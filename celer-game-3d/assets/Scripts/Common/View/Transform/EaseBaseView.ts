import { _decorator, Component, Node, v3, Vec3 } from "cc";
import { BaseView } from "../BaseView";
const { ccclass, property } = _decorator;

@ccclass("EaseBaseView")
export class EaseBaseView extends BaseView {
  private targetVal: Vec3 = v3(0, 0, 0);
  private startTime: number = 0;
  private lastTime: number = 0;
  private completeCallback: Function = null;

  get CompleteCallback() {
    return this.completeCallback;
  }

  protected get StartTime() {
    return this.startTime;
  }

  protected get LastTime() {
    return this.lastTime;
  }

  protected get Target() {
    return this.targetVal;
  }

  onLoad() {}

  start() {}

  private callOnStart: boolean = false;

  onStart() {}

  end() {
    if (this.completeCallback == null) return;

    this.onComplete();

    this.complete();
  }
  /**
   *
   * @param targetVal 目标值
   * @param lastTime 持续时间（秒）
   * @param callback 完成回调
   * @param delayTime 延迟（秒）
   */
  protected startUpdate(
    targetVal: Vec3,
    lastTime: number,
    callback: Function,
    delayTime: number = 0
  ) {
    this.callOnStart = false;
    this.targetVal = targetVal;

    this.startTime = Date.now() + delayTime * 1000;
    this.lastTime = lastTime * 1000;

    this.completeCallback = callback;
  }

  protected complete() {
    this.startTime = this.lastTime = 0;

    if (this.completeCallback) {
      let callback = this.completeCallback;
      this.completeCallback = null;
      callback();
    }
  }

  protected clear() {
    this.startTime = this.lastTime = 0;
  }

  update(dt: number) {
    if (this.startTime == 0) return;
    if (this.canUpdate() == false) return;

    if (this.isComplete()) {
      this.onComplete();

      this.complete();
    } else {
      if (this.canStart()) {
        if (this.callOnStart == false) {
          this.callOnStart = true;
          this.onStart();
        }

        this.onStep();
      } else {
        // do nothing
      }
    }
  }

  private canStart() {
    return Date.now() >= this.startTime && this.startTime != 0;
  }

  private isComplete() {
    return Date.now() >= this.startTime + this.lastTime;
  }

  protected canUpdate() {
    console.error("you should override this method.");

    return true;
  }

  protected onStep() {}

  protected onComplete() {}

  protected ease(startVal: number, endVal: number) {
    if (this.lastTime <= 0) {
      return endVal;
    }

    let spendTime = Date.now() - this.startTime;
    return ((endVal - startVal) * spendTime) / this.lastTime + startVal;
  }
}
