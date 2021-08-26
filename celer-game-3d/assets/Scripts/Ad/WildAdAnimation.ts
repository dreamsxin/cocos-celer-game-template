import { _decorator, Component, Node } from "cc";
import { SpriteUIAnimation } from "../Common/View/SpriteUIAnimation";
import { WildAdAnimationIsPlaySignal } from "../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("WildAdAnimation")
export class WildAdAnimation extends SpriteUIAnimation {
  private isStart = false;
  onStartPlay() {
    WildAdAnimationIsPlaySignal.inst.dispatch(true);
    if (this.isStart == false) {
      this.isStart = true;
      setTimeout(() => {
        this.isStart = false;
        this.stop();
        this.Sprite.color.a = 0;

        setTimeout(() => {
          this.Sprite.color.a = 255;
          this.Loop = true;
          this.play();
        }, 8000);
      }, 2000);
    }
  }

  onComplete() {
    WildAdAnimationIsPlaySignal.inst.dispatch(false);
  }
}
