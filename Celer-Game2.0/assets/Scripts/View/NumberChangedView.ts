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

  /** 小数几位 */
  protected fixCount = 0;
  /** 单个单位 */
  protected isSingle: boolean = true;
  /** 是否大写 */
  protected isUpperCase: boolean = false;
  /** 是否智能适配小数点，有就显示，没有不显示 */
  protected isSmartFix: boolean = false;

  protected action: boolean = true;

  public STEP = 60;

  /** 数字缩放 */
  protected scale: number = 1;
  protected maxNumber: number = 0;
  protected preFix: string = "";

  get Label() {
    return this.label
      ? this.label
      : (this.label = this.node.getComponent(cc.Label));
  }

  setNumber(val: number) {
    this.showNum = val;
    this.num = val;
    if (this.scale == 1) {
      this.Label.string =
        this.preFix +
        cc
          .ScienceNumber(
            val,
            this.maxNumber,
            this.fixCount,
            this.isUpperCase,
            this.isSingle,
            this.isSmartFix
          )
          .toString();
    } else {
      this.Label.string =
        this.preFix +
        cc.ScienceNumber(
          val / this.scale,
          this.maxNumber,
          this.fixCount,
          this.isUpperCase,
          this.isSingle,
          this.isSmartFix
        );
    }
  }

  onLoad() {}

  start() {}

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
            cc.delayTime(0.05),
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

    if (this.scale == 1) {
      this.Label.string =
        this.showNum >= 0
          ? this.preFix +
            cc.ScienceNumber(
              this.showNum,
              this.maxNumber,
              this.fixCount,
              this.isUpperCase,
              this.isSingle,
              this.isSmartFix
            )
          : this.preFix +
            "/" +
            cc.ScienceNumber(
              Math.abs(this.showNum),
              this.maxNumber,
              this.fixCount,
              this.isUpperCase,
              this.isSingle,
              this.isSmartFix
            );
    } else {
      this.Label.string =
        this.showNum >= 0
          ? this.preFix +
            cc.ScienceNumber(
              this.showNum / this.scale,
              this.maxNumber,
              this.fixCount,
              this.isUpperCase,
              this.isSingle,
              this.isSmartFix
            )
          : this.preFix +
            "/" +
            cc.ScienceNumber(
              Math.abs(this.showNum / this.scale),
              this.maxNumber,
              this.fixCount,
              this.isUpperCase,
              this.isSingle,
              this.isSmartFix
            );
    }
  }
}
