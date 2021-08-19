import { _decorator, Component, Node } from "cc";
import { TimeAnimationStateChanged } from "../../../Signal/Signal";
import { SpriteUIAnimation } from "../SpriteUIAnimation";
const { ccclass, property } = _decorator;

@ccclass("TimeEffectAnimation")
export class TimeEffectAnimation extends SpriteUIAnimation {
  onLoad() {
    super.onLoad();
    this.Sprite.color.a = 0;
    TimeAnimationStateChanged.inst.addListener(this.onPlayStateChanged, this);
  }

  onPlayStateChanged(isPlay: boolean) {
    if (isPlay) {
      if (this.isPlaying == false) {
        this.play();
      }
    } else {
      this.stop();
    }
  }

  start() {}

  play() {
    this.Sprite.color.a = 255;
    super.play();
  }

  stop() {
    this.Sprite.color.a = 0;
    super.stop();
  }

  // update (dt) {}
}
