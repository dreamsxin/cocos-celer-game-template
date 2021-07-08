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

export class UpdateWrongTapCount extends BaseSignal {}
@ccclass
export default class TapRootView extends cc.Component {
  onLoad() {
    UpdateWrongTapCount.inst.addListenerOne(this.onTapUpdate, this);
  }

  onTapUpdate(count: number) {
    for (let child of this.node.children) {
      child.getChildByName("bg_miss").active = parseInt(child.name) < count;
    }
  }
}
