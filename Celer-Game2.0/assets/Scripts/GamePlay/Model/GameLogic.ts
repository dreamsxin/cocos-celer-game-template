import { AdFinishSignal, AdType } from "../../Ad/AdLayer";
import { GetTotalLevel, GetTypeCount } from "../../Global/GameRule";
import { Random_ID, Random_Pool } from "../../table";
import { TableManager } from "../../TableManager";
import { disOrderArray } from "../../Utils/Cocos";
import { HashMap } from "../../Utils/HashMap";
import { BaseSignal } from "../../Utils/Signal";
import { SingleTon } from "../../utils/ToSingleton";
import { TestReStartSignal } from "../../View/Test";

import { GamePlayModel } from "./GamePlayModel";
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

  private totalGoldCount: HashMap<number, number> = new HashMap();
  private combo: number = 0;

  private types: TypeModel[] = [];

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
      console.log("random type:", Random_Pool[random.subType]);
      this.types.push(new TypeModel(random.type, random.subType));
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
