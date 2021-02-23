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
import ToturialLayer from "../new/ToturialLayer";

const { ccclass, property } = cc._decorator;

export class ShowSubmitTipSignal extends BaseSignal {}
@ccclass
export default class SubmitTip extends cc.Component {
  onLoad() {
    ShowSubmitTipSignal.inst.addListenerOne((show: boolean) => {
      this.node.active = show;
    }, this);

    setTimeout(() => {
      this.node.active = false;
    }, 0);

    ToturialLayer.AddToturialStep(
      7,
      this.node,
      null,
      true,
      () => {},
      () => {},
      () => {},
      false
    );
  }
}
