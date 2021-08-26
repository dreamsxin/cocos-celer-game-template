import { _decorator, Component, Node, Sprite, RichText, v3, tween } from "cc";
import { CelerSDK } from "../../Common/SDK/CelerSDK";
import { BaseView } from "../../Common/View/BaseView";
import NumberChangedView from "../../Common/View/UI/NumberChangedView";
import { RoundEndType } from "../../Manager/GameStateController";
import { ResourceController, Title } from "../../Manager/ResourceController";
import { PlayModel } from "../../Model/PlayModel";
import {
  OpenResultLayerSignal,
  ScoreCountingSignal,
  ShowSubmitSignal,
} from "../../Signal/Signal";
import { En_ID, En_View } from "../../table";
import { ResultAnimation } from "../Animation/ResultAnimation";
const { ccclass, property } = _decorator;

@ccclass("ResultLayerView")
export class ResultLayerView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

  /** 根节点 */
  get Root() {
    return this.node.getChildByName("Root");
  }

  /** 标题 */
  get Title() {
    return this.Root.getChildByName("Title").getComponent(Sprite);
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

  /** 提交按钮 */
  get Submit() {
    return this.Root.getChildByName("Submit");
  }

  get Content() {
    return this.Root.getChildByName("Content").getComponent(RichText);
  }

  get Ani() {
    return this.Root.getChildByName("Ani").getComponent(ResultAnimation);
  }

  private CountTotal = 3;

  onLoad() {
    this.node.active = false;
    this.node.scale = v3(1, 1, 1);
    OpenResultLayerSignal.inst.addListener(this.onGameOver, this);
  }

  onGameOver(type: RoundEndType) {
    console.log("Open result:", RoundEndType[type]);
    this.Submit.scale = v3(0, 0, 0);

    this.Content.string = lan.t(En_View.JieSuanJieMian, En_ID.DeFen);
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

    this.Title.node.scale = v3(0, 0, 0);
    this.Root.scale = v3(0, 0, 0);
    this.node.active = true;

    tween(this.Root)
      .sequence(
        tween(this.Root).to(0.1, { scale: v3(0.9, 1.3, 1) }),
        tween(this.Root).to(0.1, { scale: v3(1.2, 0.9, 1) }),
        tween(this.Root).to(0.1, { scale: v3(1, 1, 1) }),
        tween(this.Root).call(this.showInfo.bind(this))
      )
      .start();
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

      tween(this.Submit)
        .sequence(
          tween(this.Submit).to(0.1, { scale: v3(1.2, 1.2, 1.2) }),
          tween(this.Submit).to(0.1, { scale: v3(1, 1, 1) }),
          tween(this.Submit).call(() => {
            this.Submit.once(
              Node.EventType.TOUCH_END,
              () => {
                CelerSDK.inst.submitScore(PlayModel.inst.getTotalScore());
              },
              this
            );

            if (CELER_X) {
              setTimeout(() => {
                CelerSDK.inst.submitScore(PlayModel.inst.getTotalScore());
              }, 5000);
            }
          })
        )
        .start();
    }
  }

  showInfo() {
    this.Count = 0;

    this.TotalScore.STEP = 150;
    this.TimeBonus.STEP = 150;
    this.Score.STEP = 150;
    this.Ani.play();
    let step = () => {
      ScoreCountingSignal.inst.dispatch();
    };

    this.TimeBonus.onStep = step;
    this.TotalScore.onStep = step;
    this.Score.onStep = step;

    tween(this.Title)
      .sequence(
        tween(this.Title).to(0.1, { scale: v3(1.5, 1.5, 1.5) }),
        tween(this.Title).to(0.1, { scale: v3(1, 1, 1) }),
        tween(this.Title).to(0.1, { scale: v3(1.2, 1.2, 1.2) }),
        tween(this.Title).to(0.1, { scale: v3(1, 1, 1) })
      )
      .start();

    this.TimeBonus.onNumberChanged(PlayModel.inst.TimeBonus, () => {
      this.Count++;
      console.log("TimeBonus Done");
    });

    this.TotalScore.onNumberChanged(PlayModel.inst.getTotalScore(), () => {
      this.Count++;
      console.log("TotalScore Done");
    });

    this.Score.onNumberChanged(
      PlayModel.inst.getTotalScore() - PlayModel.inst.TimeBonus,
      () => {
        this.Count++;
        console.log("Score Done");
      }
    );
  }
}
