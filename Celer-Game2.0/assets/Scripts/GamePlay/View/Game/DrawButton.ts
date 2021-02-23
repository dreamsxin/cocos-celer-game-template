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
import SingleTouchView from "../../../View/SingleTouchView";

const { ccclass, property } = cc._decorator;

export class DispatchPokerToDeskSignal extends BaseSignal {}
@ccclass
export default class DrawButton extends SingleTouchView {
  private canTouch = true;
  onTouchEnd() {
    if (this.canTouch == false) return;
    console.log("Draw on touchend");
    DispatchPokerToDeskSignal.inst.dispatch();
    this.canTouch = false;
    setTimeout(() => {
      this.canTouch = true;
    }, 300);
  }
}
