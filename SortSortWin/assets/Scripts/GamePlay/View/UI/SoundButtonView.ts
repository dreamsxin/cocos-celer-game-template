import { ResourceController } from "../../../Controller/ResourceController";
import { gAudio } from "../../../Manager/AudioManager";
import { BaseSignal } from "../../../Utils/Signal";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SingleTouchView from "../../../View/SingleTouchView";

const { ccclass, property } = cc._decorator;

class SoundStateChangedSignal extends BaseSignal {}
@ccclass
export default class SoundButtonView extends SingleTouchView {
  get Sprite() {
    return this.getComponent(cc.Sprite);
  }

  onLoad() {
    super.onLoad();
    this.updateState();
    SoundStateChangedSignal.inst.addListener(this.updateState, this);
  }

  onTouchEnd() {
    let vol = gAudio.MusicVolume;
    if (vol > 0) {
      gAudio.setEffectVolume(0);
      gAudio.setMusicVolume(0);
    } else {
      gAudio.setEffectVolume(1);
      gAudio.setMusicVolume(1);
    }
    SoundStateChangedSignal.inst.dispatch();
  }

  updateState() {
    let vol = gAudio.MusicVolume;
    if (vol > 0) {
      this.Sprite.spriteFrame = ResourceController.inst.getSoundEnable();
    } else {
      this.Sprite.spriteFrame = ResourceController.inst.getSoundDisabled();
    }
  }
}
