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
import ResultAnimation from "../../../Animation/ResultAnimation";
import { BaseSignal } from "../../../Utils/Signal";

const { ccclass, property } = cc._decorator;

export class PlayResultAnimationSignal extends BaseSignal {}
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

  get GoldsScore() {
    return this.Root.getChildByName("GoldsScore").getComponent(
      NumberChangedView
    );
  }

  get GoldCount() {
    return this.Root.getChildByName("GoldCount").getComponent(
      NumberChangedView
    );
  }

  /** 提交按钮 */
  get Submit() {
    return this.Root.getChildByName("Submit");
  }

  get ResultAnimation() {
    return this.Root.getChildByName("TitleAnimation").getComponent(
      ResultAnimation
    );
  }

  private CountTotal = 5;

  onLoad() {
    this.node.active = false;
    this.node.scale = 1;
    OpenResultLayerSignal.inst.addListenerOne(this.onGameOver, this);
  }

  onGameOver(type: RoundEndType) {
    console.log("Open result:", RoundEndType[type]);
    this.Submit.scale = 0;
    if (type == RoundEndType.TimeUp) {
      this.Title.spriteFrame = ResourceController.inst.getResultSprite(
        Title.TimeUp
      );
    } else if (type == RoundEndType.Complete) {
      this.Title.spriteFrame = ResourceController.inst.getResultSprite(
        Title.Complete
      );
    } else if (type == RoundEndType.OutOfMove) {
      this.Title.spriteFrame = ResourceController.inst.getResultSprite(
        Title.OutOfMove
      );
    } else {
      this.Title.spriteFrame = ResourceController.inst.getResultSprite(
        Title.Over
      );
    }

    this.Title.node.scale = 0;
    this.Root.scale = 0;
    this.node.active = true;
    this.ResultAnimation.node.opacity = 0;
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
    this.GoldCount.STEP = 2;
    this.GoldsScore.STEP = 100;

    let step = () => {
      ScoreCountingSignal.inst.dispatch();
    };

    this.TimeBonus.onStep = step;
    this.TotalScore.onStep = step;
    this.Score.onStep = step;
    this.GoldCount.onStep = step;
    this.GoldsScore.onStep = step;

    this.Title.node.runAction(
      cc.sequence(
        cc.scaleTo(0.1, 1.5),
        cc.scaleTo(0.1, 1),
        cc.scaleTo(0.1, 1.2),
        cc.scaleTo(0.1, 1)
      )
    );

    this.ResultAnimation.onComplete = () => {
      this.ResultAnimation.node.runAction(cc.fadeOut(0.1));
    };
    this.ResultAnimation.node.opacity = 255;
    PlayResultAnimationSignal.inst.dispatch();
    this.ResultAnimation.play();

    this.TimeBonus.onNumberChanged(PlayModelProxy.inst.TimeBonus, () => {
      this.Count++;
      console.log("TimeBonus Done");
    });

    this.TotalScore.onNumberChanged(PlayModelProxy.inst.getTotalScore(), () => {
      this.Count++;
      console.log("TotalScore Done");
    });

    this.Score.onNumberChanged(
      PlayModelProxy.inst.getTotalScore() -
        PlayModelProxy.inst.Model.getScoreByType(ScoreType.GoldGain) -
        PlayModelProxy.inst.TimeBonus,
      () => {
        this.Count++;
        console.log("Score Done");
      }
    );

    this.GoldsScore.onNumberChanged(
      PlayModelProxy.inst.Model.getScoreByType(ScoreType.GoldGain),
      () => {
        this.Count++;
        console.log("GoldsScore Done");
      }
    );
  }
}
