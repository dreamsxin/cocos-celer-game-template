// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FrameAniBase from "../../../Utils/FrameAniBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Level2Animation extends FrameAniBase {
  private pos = [cc.v2(0, -188.616), cc.v2(-21.285, -201.524)];

  private isFirst = true;
  play() {
    super.play();
    this.isFirst = true;
  }

  onKeyFrame(key: number) {
    this.node.setPosition(this.pos[key]);
    if (this.isFirst) {
    } else {
      this.node.stopAllActions();
      this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.fadeIn(0.1)));
    }
    this.isFirst = false;
  }
}
