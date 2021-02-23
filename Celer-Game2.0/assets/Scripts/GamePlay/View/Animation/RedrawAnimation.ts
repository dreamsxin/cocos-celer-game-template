// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayRecycleDrawSignal } from "../../../Manager/AudioManager";
import FrameAniBase from "../../../Utils/FrameAniBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedrawAnimation extends FrameAniBase {
  onLoad() {
    super.onLoad();

    PlayRecycleDrawSignal.inst.addListener(() => {
      this.node.active = true;
      this.node.opacity = 255;
      this.play();
      this.onComplete = () => {
        this.node.active = false;
      };
    }, this);
    setTimeout(() => {
      this.node.active = false;
    }, 0);
  }
}
