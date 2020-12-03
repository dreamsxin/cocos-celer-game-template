import BaseView from "../../../View/BaseView";
import NumberChangedView from "../../../View/NumberChangedView";
import {
  OpenResultLayerSignal,
  ShowSubmitSignal,
  ScoreCountingSignal,
} from "../../../Command/CommonSignal";
import { RoundEndType } from "../../../Controller/GameStateController";
import {
  ResourceController,
  Title,
} from "../../../Controller/ResourceController";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import { CelerSDK } from "../../../Utils/Celer/CelerSDK";
import { ScoreType } from "../../Model/GamePlayModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultLayerView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

  /** 根节点 */
  get Root() {
    return this.node.getChildByName("Root");
  }

  /** 标题 */
  get Title() {
    return this.Root.getChildByName("Title").getComponent(cc.Sprite);
  }

  /** 总分 */
  get TotalScore() {
    return this.Root.getChildByName("TotalScore").getComponent(
      NumberChangedView
    );
  }

  /**时间加成 */
  get TimeBonus() {
    return this.Root.getChildByName("TimeBonus").getComponent(
      NumberChangedView
    );
  }

  get Score() {
    return this.Root.getChildByName("ScoreLabel").getComponent(
      NumberChangedView
    );
  }

  get MoveCount() {
    return this.Root.getChildByName("MoveCountLabel").getComponent(
      NumberChangedView
    );
  }

  /** 提交按钮 */
  get Submit() {
    return this.Root.getChildByName("Submit");
  }

  private CountTotal = 4;

  onLoad() {
    this.node.active = false;
    this.node.scale = 1;
    OpenResultLayerSignal.inst.addListenerOne(this.onGameOver, this);
  }

  onGameOver(type: RoundEndType) {
    console.log("Open result:", RoundEndType[type], Date.now());
    this.Submit.scale = 0;
    if (type == RoundEndType.TimeUp) {
      this.Title.spriteFrame = ResourceController.inst.getTitleSprite(
        Title.TimeUp
      );
    } else if (type == RoundEndType.Complete) {
      this.Title.spriteFrame = ResourceController.inst.getTitleSprite(
        Title.Complete
      );
    } else {
      this.Title.spriteFrame = ResourceController.inst.getTitleSprite(
        Title.Over
      );
    }

    this.Root.scale = 0;
    this.node.active = true;
    this.Root.runAction(
      cc.sequence(
        cc.scaleTo(0.1, 0.9, 1.3),
        cc.scaleTo(0.1, 1.2, 0.9),
        cc.scaleTo(0.1, 1, 1),
        cc.callFunc(this.showInfo.bind(this))
      )
    );
  }

  private count = 0;

  private get Count() {
    return this.count;
  }

  private set Count(val: number) {
    if (this.count == val) return;

    this.count = val;
    console.log("count:", this.Count);
    if (this.Count >= this.CountTotal) {
      ShowSubmitSignal.inst.dispatch();

      this.Submit.runAction(
        cc.sequence(
          cc.scaleTo(0.1, 1.2),
          cc.scaleTo(0.1, 1),
          cc.callFunc(() => {
            this.Submit.once(
              cc.Node.EventType.TOUCH_END,
              () => {
                CelerSDK.inst.submitScore(PlayModelProxy.inst.getTotalScore());
              },
              this
            );

            if (CELER_X) {
              setTimeout(() => {
                CelerSDK.inst.submitScore(PlayModelProxy.inst.getTotalScore());
              }, 5000);
            }
          })
        )
      );
    }
  }

  showInfo() {
    this.Count = 0;

    this.TotalScore.STEP = 150;
    this.TimeBonus.STEP = 150;
    this.Score.STEP = 150;
    this.MoveCount.STEP = 2;

    let step = () => {
      ScoreCountingSignal.inst.dispatch();
    };

    this.TimeBonus.onStep = step;
    this.TotalScore.onStep = step;
    this.Score.onStep = step;
    this.MoveCount.onStep = step;

    this.TimeBonus.onNumberChanged(PlayModelProxy.inst.TimeBonus, () => {
      this.Count++;
      console.log("TimeBonus Done");
    });

    this.TotalScore.onNumberChanged(PlayModelProxy.inst.getTotalScore(), () => {
      this.Count++;
      console.log("TotalScore Done");
    });

    this.Score.onNumberChanged(
      PlayModelProxy.inst.getScoreByType(ScoreType.Normal),
      () => {
        this.Count++;
        console.log("Score Done");
      }
    );

    this.MoveCount.onNumberChanged(-PlayModelProxy.inst.MoveCount, () => {
      this.Count++;
      console.log("MoveCount Done");
    });
  }
}
