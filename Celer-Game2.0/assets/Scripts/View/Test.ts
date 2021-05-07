// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameStateController } from "../Controller/GameStateController";

import { GameLogic, RestartCountSignal } from "../GamePlay/Model/GameLogic";
import { GamePlayModel } from "../GamePlay/Model/GamePlayModel";
import { PlayModelProxy } from "../Model/PlayModelProxy";
import { RandomSeedInitSignal } from "../Utils/Random";
import { BaseSignal } from "../Utils/Signal";

const { ccclass, property } = cc._decorator;

export class TestReStartSignal extends BaseSignal {}
@ccclass
export default class Test extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  get RandomSeed() {
    return this.node.getChildByName("RandomSeed");
  }

  get RestartCount() {
    return this.node.getChildByName("RestartCount");
  }

  get Next() {
    return this.node.getChildByName("Next");
  }

  get NextMap() {
    return this.node.getChildByName("NextMap");
  }

  get TestClear() {
    return this.node.getChildByName("TestClear");
  }
  get CheckDrop() {
    return this.node.getChildByName("CheckDrop");
  }

  get CheckBlock() {
    return this.node.getChildByName("CheckBlock");
  }

  get Animation() {
    return this.node.getChildByName("Animation");
  }

  private refreshing = false;
  onLoad() {
    this.node.active = !CELER_X;
    if (CC_EDITOR == false) {
      this.node.removeComponent(cc.Sprite);
      this.node.opacity = 255;
    }

    if (!CC_DEBUG) {
      this.node.removeFromParent(true);
      this.node.destroy();
      return;
    }

    if (this.TestClear) {
      //  this.TestClear.active = false;

      let toggle = this.TestClear.getComponent(cc.Toggle);
      toggle.isChecked = false;

      this.TestClear.on(
        "toggle",
        () => {
          console.log(" test clear:", toggle.isChecked);
        },
        this
      );
    }

    if (this.CheckDrop) {
      // this.CheckDrop.active = false;

      let toggle = this.CheckDrop.getComponent(cc.Toggle);
      toggle.isChecked = true;

      this.CheckDrop.on(
        "toggle",
        () => {
          console.log(" IS_RUN_LEVEL:", toggle.isChecked);
        },
        this
      );
    }

    if (this.CheckBlock) {
      // this.CheckDrop.active = false;

      let toggle = this.CheckBlock.getComponent(cc.Toggle);
      toggle.isChecked = true;

      this.CheckBlock.on(
        "toggle",
        () => {
          console.log(" CHECK_BLOCK:", toggle.isChecked);
        },
        this
      );
    }

    if (this.Animation) {
      // this.CheckDrop.active = false;

      let toggle = this.Animation.getComponent(cc.Toggle);
      toggle.isChecked = true;

      this.Animation.on(
        "toggle",
        () => {
          console.log(" OPEN_EFFECT:", toggle.isChecked);
        },
        this
      );
    }

    //-1427.234
    RandomSeedInitSignal.inst.addListenerOne((seed: number) => {
      if (this.RandomSeed && this.RandomSeed.getComponent(cc.Label)) {
        this.RandomSeed.getComponent(cc.Label).string = seed.toString();
      }
    }, this);

    if (this.RestartCount && this.RestartCount.getComponent(cc.Label)) {
      this.RestartCount.getComponent(cc.Label).string = "0";
      RestartCountSignal.inst.addListenerOne((count: number) => {
        this.RestartCount.getComponent(cc.Label).string = count.toString();
      }, this);
    }

    if (this.Next) {
      // this.Next.active = false;

      this.Next.on(
        cc.Node.EventType.TOUCH_END,
        () => {
          if (this.refreshing) {
            return;
          }
          this.refreshing = true;
        },
        this
      );
    }

    if (this.NextMap) {
      this.NextMap.on(
        cc.Node.EventType.TOUCH_END,
        () => {
          if (GameStateController.inst.isReady == false) return;
          TestReStartSignal.inst.dispatchOne(true);
        },
        this
      );
    }
  }

  start() {}

  // update (dt) {}
}
