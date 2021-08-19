import { _decorator, Component, Node, Vec3 } from "cc";
import { EaseBaseView } from "./EaseBaseView";
const { ccclass, property } = _decorator;

@ccclass("RotationView")
export class RotationView extends EaseBaseView {
  // LIFE-CYCLE CALLBACKS:

  private startRotation: Vec3 = Vec3.ZERO;
  onLoad() {
    if (CC_DEBUG && this.node.name == "TestNode") {
      window["testRotation"] = this.onRotationChanged.bind(this);
    }
  }

  canUpdate() {
    return true;
  }

  start() {}

  onRotationChanged(
    targetRotation: Vec3,
    lastTime: number,
    callback: Function,
    delay: number = 0
  ) {
    this.node.getRotation().getEulerAngles(this.startRotation);
    this.startUpdate(targetRotation, lastTime, callback, delay);
  }

  onStep() {
    this.node.setRotationFromEuler(
      this.ease(this.startRotation.x, this.Target.x),
      this.ease(this.startRotation.y, this.Target.y),
      this.ease(this.startRotation.z, this.Target.z)
    );
  }

  onComplete() {
    this.node.setRotationFromEuler(this.Target.x, this.Target.y, this.Target.z);
  }
}
