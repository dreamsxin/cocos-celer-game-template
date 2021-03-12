// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FrameAniBase from "../utils/FrameAniBase";
import { BaseSignal } from "../Utils/Signal";

const { ccclass, property } = cc._decorator;

export class WildAdAnimationIsPlaySignal extends BaseSignal {}
@ccclass
export default class WildAdAnimation extends FrameAniBase {
  private isStart = false;
  onStartPlay() {
    WildAdAnimationIsPlaySignal.inst.dispatchOne(true);
    if (this.isStart == false) {
      this.isStart = true;
      setTimeout(() => {
        this.isStart = false;
        this.stop();
        this.node.opacity = 0;

        setTimeout(() => {
          this.node.opacity = 255;
          this.Loop = true;
          this.play();
        }, 8000);
      }, 2000);
    }
  }

  onComplete() {
    WildAdAnimationIsPlaySignal.inst.dispatchOne(false);
  }
}
