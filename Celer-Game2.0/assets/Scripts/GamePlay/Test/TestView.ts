// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameOverSignal, GameStartSignal } from "../../Command/CommonSignal";
import { GameStateController } from "../../Controller/GameStateController";
import { CelerSDK } from "../../Utils/Celer/CelerSDK";
import { RandomSeedInitSignal } from "../../Utils/Random";
import { BaseSignal } from "../../Utils/Signal";
import { LevelChangedSignal, NextRoundSignal } from "../Model/GameLogic";
import {
  AfterGenLevelSignal,
  BeforeGenLevelSignal,
} from "../Model/GamePlayModel";

const { ccclass, property } = cc._decorator;

export class NextStepSignal extends BaseSignal {}
export class LastStepSignal extends BaseSignal {}

export class StepUpdateSignal extends BaseSignal {}

@ccclass
export default class TestView extends cc.Component {
  get SeedLabel() {
    return this.node.getChildByName("RandomSeed").getComponent(cc.Label);
  }

  get LevelLabel() {
    return this.node.getChildByName("Level").getComponent(cc.Label);
  }

  get StepLabel() {
    return this.node.getChildByName("Step").getComponent(cc.Label);
  }

  get buttonRoot() {
    return this.node.getChildByName("button");
  }

  get Next() {
    return this.buttonRoot.getChildByName("btn_next");
  }

  get Forward() {
    return this.buttonRoot.getChildByName("btn_forward");
  }

  get Auto() {
    return this.buttonRoot.getChildByName("auto");
  }

  get Tip() {
    return this.buttonRoot.getChildByName("tip");
  }

  get AutoLabel() {
    return this.Auto.getChildByName("label").getComponent(cc.Label);
  }

  private canNext: boolean = false;
  private autoOpen: boolean = false;
  onLoad() {
    setTimeout(() => {
      this.node.active = false;
    }, 0);

    GameStartSignal.inst.addListener(() => {
      this.node.active = CC_PREVIEW && !CELER_X; //false; //!CELER_X && CelerSDK.inst.DifficultyLevel != 1;
    }, this);

    RandomSeedInitSignal.inst.addListenerOne((seed: number) => {
      this.SeedLabel.string = "randomSeed:" + seed.toString();
    }, this);

    LevelChangedSignal.inst.addListenerOne((level: number) => {
      this.LevelLabel.string = "Level:" + level;
    }, this);

    StepUpdateSignal.inst.addListenerOne((step: number) => {
      this.StepLabel.string = "Step:" + step;
    }, this);

    this.Next.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        if (this.canNext == false || this.autoOpen) return;
        NextRoundSignal.inst.dispatch();
      },
      this
    );

    this.Forward.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        if (this.canNext == false || this.autoOpen) return;
        LastStepSignal.inst.dispatch();
      },
      this
    );

    AfterGenLevelSignal.inst.addListener(() => {
      this.canNext = true;
    }, this);

    BeforeGenLevelSignal.inst.addListener(() => {
      this.canNext = false;
    }, this);

    this.Tip.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        if (this.canNext && !this.autoOpen) {
          NextStepSignal.inst.dispatch();
        }
      },
      this
    );

    this.Auto.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        if (this.canNext) {
          this.autoOpen = !this.autoOpen;
          if (this.autoOpen) {
            this.nextPlayTime = Date.now() + 800;
          }
        }
      },
      this
    );

    GameOverSignal.inst.addListener(() => {
      this.autoOpen = false;
      this.canNext = false;
    }, this);
  }

  private nextPlayTime = 0;
  update(dt: number) {
    if (GameStateController.inst.isPause()) return;

    if (this.autoOpen) {
      this.AutoLabel.string = "autoplay(开)";

      if (Date.now() >= this.nextPlayTime) {
        NextStepSignal.inst.dispatch();
        this.nextPlayTime = Date.now() + 800;
      }

      this.Tip.color = cc.Color.GRAY;
      this.Forward.color = cc.Color.GRAY;
      this.Next.color = cc.Color.GRAY;
    } else {
      this.AutoLabel.string = "autoplay(关)";
      this.Tip.color = cc.Color.WHITE;
      this.Forward.color = cc.Color.WHITE;
      this.Next.color = cc.Color.WHITE;
    }
  }
}
