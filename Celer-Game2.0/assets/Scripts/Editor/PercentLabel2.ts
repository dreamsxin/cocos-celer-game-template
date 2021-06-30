// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseSignal } from "../Utils/Signal";

const { ccclass, property } = cc._decorator;

export class UpdateLoadingSignal extends BaseSignal {}
@ccclass
export default class PercentLabel2 extends cc.Component {
  onLoad() {
    this.node.active = CC_DEBUG;
    UpdateLoadingSignal.inst.addListenerOne((percent: number) => {
      percent = Math.min(percent, 1);
      if (percent >= 1) {
        setTimeout(() => {
          this.node.active = false;
        }, 1000);
      }
      this.getComponent(cc.Label).string = (percent * 100).toFixed(2) + "%";
    }, this);
  }
}
