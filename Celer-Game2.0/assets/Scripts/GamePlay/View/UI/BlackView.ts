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

const { ccclass, property } = cc._decorator;

export class ShowBlackBlockSignal extends BaseSignal {}

export class HideBlackBlockSignal extends BaseSignal {}
@ccclass
export default class BlackView extends cc.Component {
  private refCount: number = 0;
  onLoad() {
    this.node.active = false;
    ShowBlackBlockSignal.inst.addListener(() => {
      this.RefCount++;
    }, this);

    HideBlackBlockSignal.inst.addListener(() => {
      this.RefCount--;
    }, this);
  }

  start() {}

  set RefCount(val: number) {
    this.refCount = val;
    this.node.active = this.refCount > 0;
  }

  get RefCount() {
    return this.refCount;
  }

  // update (dt) {}
}
