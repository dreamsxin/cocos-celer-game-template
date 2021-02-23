// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import { BaseSignal } from "../../../Utils/Signal";
import BaseView from "../../../View/BaseView";
import { Poker, PokerModel, PokerType } from "../../Model/Poker/PokerModel";
import RecycleAnimation from "../Animation/RecycleAnimation";
import ToturialLayer, { TutorialPrepareDoneSignal } from "../new/ToturialLayer";
import { PlayRecycleAnimationSignal } from "../PokerRoot/Recycle";

const { ccclass, property } = cc._decorator;

export class LockStateChangedSignal extends BaseSignal {}

@ccclass
export default class PokerLockView extends BaseView {
  get Animation() {
    return this.node.getChildByName("Animation").getComponent(RecycleAnimation);
  }

  // LIFE-CYCLE CALLBACKS:
  private model: PokerModel = null;
  get Model() {
    return this.model;
  }

  reuse(model: PokerModel) {
    this.model = model;
  }

  unuse() {
    this.model = null;
  }

  get Lock() {
    return this.node.getChildByName("Front");
  }

  onLoad() {
    LockStateChangedSignal.inst.addListenerTwo(this.onLockStateChanged, this);

    setTimeout(() => {
      this.Animation.node.active = false;
    }, 0);

    // PlayRecycleAnimationSignal.inst.addListenerOne((ID: string) => {
    //   if (this.model && this.model.ID == ID) {
    //     this.Animation.node.active = true;
    //     this.Animation.node.opacity = 255;
    //     this.Animation.play();
    //     this.Animation.onComplete = () => {
    //       this.Animation.node.runAction(cc.fadeOut(0.1));
    //     };
    //   }
    // }, this);

    TutorialPrepareDoneSignal.inst.addListener(() => {
      if (
        this.model &&
        this.model.Point == Poker.$_5 &&
        this.model.Type == PokerType.Club
      ) {
        ToturialLayer.AddToturialStep(
          6,
          this.node,
          null,
          false,
          () => {},
          () => {},
          () => {},
          true
        );
      }
    }, this);
  }

  start() {}

  onLockStateChanged(ID: string, isLock: boolean) {
    if (!this.model || this.model.ID != ID) return;
    if (isLock) {
      this.Lock.color = cc.color(238, 218, 166);
    } else {
      this.Lock.color = cc.Color.WHITE;
    }
  }

  // update (dt) {}
}
