import { _decorator, Component, Node, Sprite } from "cc";
import { SingleTouchView } from "../../Common/View/SingleTouchView";
import { AudioController } from "../../Manager/AudioManager";
import { ResourceController } from "../../Manager/ResourceController";
import { SoundStateChangedSignal } from "../../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("SoundButtonView")
export class SoundButtonView extends SingleTouchView {
  get Sprite() {
    return this.getComponent(Sprite);
  }

  onLoad() {
    super.onLoad();
    this.updateState();
    SoundStateChangedSignal.inst.addListener(this.updateState, this);
  }

  onTouchEnd() {
    let vol = AudioController.inst.MusicVolume;
    if (vol > 0) {
      AudioController.inst.setEffectVolume(0);
      AudioController.inst.setMusicVolume(0);
    } else {
      AudioController.inst.setEffectVolume(1);
      AudioController.inst.setMusicVolume(1);
    }
    SoundStateChangedSignal.inst.dispatch();
  }

  updateState() {
    let vol = AudioController.inst.MusicVolume;
    if (vol > 0) {
      this.Sprite.spriteFrame = ResourceController.inst.getSoundEnable();
    } else {
      this.Sprite.spriteFrame = ResourceController.inst.getSoundDisabled();
    }
  }
}
