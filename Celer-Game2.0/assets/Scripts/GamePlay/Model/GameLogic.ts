import { AdFinishSignal, AdType } from "../../Ad/AdLayer";
import { GeometryPolygon } from "../../AlgorithmUtils/GeometryPolygon/GeometryPolygon";
import { MinPotentialPacker } from "../../AlgorithmUtils/MinimumPotentialLayout/MinPotentialPacker";
import {
  GameStateController,
  RoundEndType,
} from "../../Controller/GameStateController";
import {
  GetCollectCount,
  GetFaultCount,
  GetScoreScale,
  GetTotalLevel,
  GetTypeCount,
  ScoreModel,
} from "../../Global/GameRule";
import { Random_ID, Random_Pool } from "../../table";
import { TableManager } from "../../TableManager";
import { disOrderArray } from "../../Utils/Cocos";
import { HashMap } from "../../Utils/HashMap";
import { BaseSignal } from "../../Utils/Signal";
import { SingleTon } from "../../utils/ToSingleton";
import { TestReStartSignal } from "../../View/Test";
import { OnClickSignal, OnWrongClickSignal } from "../View/Game/Item";
import ItemRoot from "../View/Game/ItemRoot";
import { SubjectAnimationDone, SubjectOkSignal } from "../View/UI/Subject";
import { UpdateTypeScore } from "../View/UI/SubjectLabel";
import { UpdateWrongTapCount } from "../View/UI/TapCountView";

import { GamePlayModel, ScoreType } from "./GamePlayModel";
import { CreateItemNodeSignal, ItemModel, RemoveItemSignal } from "./ItemModel";
import { TypeModel } from "./TypeModel";

// enum Side {
//   Left,
//   Right,
//   Both,
// }

export class RestartCountSignal extends BaseSignal {}

export class ComboUpdateSignal extends BaseSignal {}

export class GameLogic extends SingleTon<GameLogic>() {
  private gamePlay: GamePlayModel = null;

  private restartCount: number = 0;

  private combo: number = 0;

  private types: TypeModel[] = [];

  private wrongCount: number = 0;

  private items: HashMap<string, ItemModel> = new HashMap();

  private showedItems: HashMap<string, ItemModel> = new HashMap();

  get Types() {
    return this.types;
  }

  get Combo() {
    return this.combo;
  }

  set Combo(val: number) {
    this.combo = val;
    this.combo = Math.min(this.combo, 7);
    ComboUpdateSignal.inst.dispatchOne(this.combo);
  }

  bindGamePlay(gamePlay: GamePlayModel) {
    this.gamePlay = gamePlay;
    if (!CELER_X) {
      TestReStartSignal.inst.addListener(this.restart, this);
    }

    AdFinishSignal.inst.addListenerOne(this.onAdFinish, this);

    CreateItemNodeSignal.inst.addListenerOne(this.onItemAdd, this);
    RemoveItemSignal.inst.addListenerOne(this.onItemRemove, this);
  }

  onItemAdd(model: ItemModel) {
    this.showedItems.add(model.ID, model);
  }

  onItemRemove(model: ItemModel) {
    this.showedItems.remove(model.ID);
  }

  initData() {
    console.log("init game logic.");

    UpdateWrongTapCount.inst.dispatchOne(this.wrongCount);

    // 获取随机的大类
    let randomTypes = TableManager.inst.getRandom(Random_ID.SuiJiChi).Pool;
    let typePools: {
      type: Random_ID;
      subType: Random_Pool;
    }[] = [];

    for (let type of randomTypes) {
      let pool = TableManager.inst.getRandom(type).Pool;
      for (let sub of pool) {
        typePools.push({ type: type, subType: sub });
      }
    }
    disOrderArray(typePools);

    while (this.types.length < GetTotalLevel() * GetTypeCount()) {
      let random = typePools.pop();
      let index = this.types.length % GetTypeCount();
      console.log(
        "random type:",
        Random_Pool[random.subType],
        ",index:",
        index
      );
      this.types.push(new TypeModel(random.type, random.subType, index));
    }
  }

  initItemModel(progress: (percent: number) => void, complete: () => void) {
    let polygons = MinPotentialPacker.inst.packeds<GeometryPolygon>();
    let index = 0;
    let Total = polygons.length;

    let interval = setInterval(() => {
      let polygon = polygons[index];

      let itemModel = new ItemModel(
        polygon.ID.split(":")[0],
        polygon.Type,
        polygon.SubType,
        polygon.ExpendPoints,
        cc.v2(polygon.Position.x, polygon.Position.y),
        polygon.Rotation,
        polygon.ExpendBorder.bot.y - 100,
        polygon.ExpendBorder.top.y - 100,
        TableManager.inst.getClass(polygon.Type).Group
      );

      this.items.add(itemModel.ID, itemModel);

      index++;
      progress(index / Total);
      if (index >= Total) {
        complete();

        clearInterval(interval);
      }
    }, 2) as unknown as number;
  }

  move(offset: cc.Vec2) {
    let removeId = [];

    let count = 0;
    this.items.forEach((key: string, model: ItemModel) => {
      if (model.move(offset)) {
        removeId.push(model.ID);
      }
      count++;
    });

    for (let id of removeId) {
      this.items.remove(id);
    }
  }

  checkIsComplete() {
    let startIndex = this.gamePlay.Level * GetTypeCount();

    for (let i = 0; i < GetTypeCount(); i++) {
      let index = startIndex + i;
      let typeModel = this.Types[index];
      if (typeModel.MatchTimes < GetCollectCount()) {
        return;
      }
    }

    SubjectAnimationDone.inst.addOnce(() => {
      this.gamePlay.nextLevel();
    }, this);
  }

  checkClick(point: cc.Vec2) {
    let startIndex = this.gamePlay.Level * GetTypeCount();
    let clickModel = [];

    let removeId = [];
    let indexs = [];

    this.showedItems.forEach((key: string, model: ItemModel) => {
      if (model.checkClick(point)) {
        clickModel.push(model.ID);
        let hasMatch = false;
        for (let i = 0; i < GetTypeCount(); i++) {
          let index = startIndex + i;

          let typeModel = this.Types[index];
          // 点中物品
          if (typeModel && model.SubType == typeModel.SubType) {
            hasMatch = true;
            // 物品已经收集完
            if (typeModel.MatchTimes >= GetCollectCount()) {
              SubjectOkSignal.inst.dispatchOne(typeModel.Index);
            } else {
              // 成功收集
              typeModel.MatchTimes++;
              this.checkIsComplete();
              let score =
                GetScoreScale(this.gamePlay.BonusProgress) *
                ScoreModel.GetScore(Random_Pool[typeModel.SubType], true);

              let node = ItemRoot.ITEM_ROOT;
              this.gamePlay.addPlayerScore(
                score,
                ScoreType.Match,
                1,
                node.getChildByName(model.ID)
              );

              if (typeModel.MatchTimes >= GetCollectCount()) {
                SubjectOkSignal.inst.dispatchTwo(typeModel.Index, true);
              }

              this.gamePlay.resetScaleCountDown();
              UpdateTypeScore.inst.dispatch();

              removeId.push(model.ID);
              indexs.push(typeModel.Index);
            }
          }
        }

        if (hasMatch == false) {
          // 点错物品
          this.wrongCount++;
          OnWrongClickSignal.inst.dispatchOne(model);
          UpdateWrongTapCount.inst.dispatchOne(this.wrongCount);
          if (this.wrongCount >= GetFaultCount()) {
            GameStateController.inst.roundEnd(RoundEndType.OutOfMove);
          }
        }
      }
    });

    OnClickSignal.inst.dispatchOne(clickModel);

    for (let i = 0; i < removeId.length; i++) {
      let id = removeId[i];
      let index = indexs[i];
      let model = this.items.get(id);
      if (model) {
        RemoveItemSignal.inst.dispatchThree(model, true, index);
      }
      this.items.remove(id);
      this.showedItems.remove(id);
    }
  }

  onAdFinish(adUnitId: string) {
    console.log(" ad finish:", adUnitId);

    if (adUnitId == AdType[AdType.Sun]) {
    } else {
    }
  }

  restart(isRestMap: boolean = false) {
    console.log("restart:", isRestMap);

    this.restartCount++;
    RestartCountSignal.inst.dispatchOne(this.restartCount);
  }
}

CC_DEBUG && (window["Logic"] = GameLogic.inst);
