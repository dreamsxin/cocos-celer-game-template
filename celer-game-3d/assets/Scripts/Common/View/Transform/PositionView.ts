import { _decorator, Component, Node, Vec3, v3 } from "cc";
import { EaseBaseView } from "./EaseBaseView";
const { ccclass, property } = _decorator;

@ccclass("PositionView")
export class PositionView extends EaseBaseView {
  // LIFE-CYCLE CALLBACKS:

  private startPos: Vec3 = Vec3.ZERO;

  get TargetPos() {
    return v3(this.Target.x, this.Target.y, this.Target.z);
  }

  canUpdate() {
    return true;
  }

  onLoad() {
    if (CC_DEBUG && this.node.name == "TestNode") {
      window["testPosition"] = this.onPositionChanged.bind(this);
    }
  }

  start() {}

  onPositionChanged(
    targetPos: Vec3,
    lastTime: number,
    callback: Function,
    delay: number = 0
  ) {
    this.startPos = this.node.position.clone();
    this.startUpdate(
      v3(targetPos.x, targetPos.y, targetPos.z),
      lastTime,
      callback,
      delay
    );
  }

  onStep() {
    this.node.setPosition(
      this.ease(this.startPos.x, this.Target.x),
      this.ease(this.startPos.y, this.Target.y),
      this.ease(this.startPos.z, this.Target.z)
    );
  }

  onComplete() {
    this.node.setPosition(v3(this.Target.x, this.Target.y, this.Target.z));
  }
}
