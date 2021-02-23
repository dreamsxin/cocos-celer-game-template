// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NumberChangedView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

  private num: number = 0;
  private showNum: number = 0;
  private step: number = 0;

  private label: cc.Label = null;

  protected action: boolean = true;

  public STEP = 120;

  get Label() {
    return this.label
      ? this.label
      : (this.label = this.node.getComponent(cc.Label));
  }

  onLoad() {}

  start() {}
  setNumber(val: number) {
    this.showNum = val;
    this.num = val;
    this.Label.string = val.toString();
  }
  onStep(step: number) {}

  private callback: Function = null;

  onNumberChanged(num: number, callback?: Function) {
    this.num = num;
    this.callback = callback;
    if (this.num != this.showNum) {
      let step = this.num - this.showNum;
      this.step =
        step > 0 ? Math.ceil(step / this.STEP) : Math.floor(step / this.STEP);
      //console.log("this.step:", this.step);
      if (this.action) {
        this.node.runAction(
          cc.sequence(
            cc.scaleTo(0.1, 1.4),
            cc.delayTime(0.2),
            cc.scaleTo(0.1, 1)
          )
        );
      }
    } else {
      this.step = 0;
    }
  }

  update(dt: number) {
    if (this.num != this.showNum) {
      this.showNum += this.step;
      this.onStep(this.step);
      if (
        (this.showNum > this.num && this.step > 0) ||
        (this.showNum < this.num && this.step < 0)
      ) {
        this.showNum = this.num;
        this.step = 0;
      }
    }

    if (Math.abs(this.num - this.showNum) <= Math.abs(this.step)) {
      if (this.callback && typeof this.callback == "function") {
        this.callback();
        this.callback = null;
      }
    }

    this.Label.string =
      this.showNum >= 0
        ? this.showNum.toString()
        : "/" + Math.abs(this.showNum).toString();
  }
}
