// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseSignal } from "../../../Utils/Signal";
import RecycleAnimation from "../Animation/RecycleAnimation";
import ToturialLayer, { TutorialPrepareDoneSignal } from "../new/ToturialLayer";

const { ccclass, property } = cc._decorator;

export class PlayRecycleAnimationSignal extends BaseSignal {}
@ccclass
export default class Recycle extends cc.Component {
  get Animation() {
    return this.node.getChildByName("Animation").getComponent(RecycleAnimation);
  }

  onLoad() {
    setTimeout(() => {
      this.Animation.node.active = false;
    }, 0);
    // PlayRecycleAnimationSignal.inst.addListener(() => {
    //   this.Animation.node.active = true;
    //   this.Animation.node.opacity = 255;
    //   this.Animation.play();
    //   this.Animation.onComplete = () => {
    //     this.Animation.node.runAction(cc.fadeOut(0.1));
    //   };
    // }, this);

    TutorialPrepareDoneSignal.inst.addListener(() => {
      if (this.node.name == "0") {
        ToturialLayer.AddToturialStep(
          1,
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
}
