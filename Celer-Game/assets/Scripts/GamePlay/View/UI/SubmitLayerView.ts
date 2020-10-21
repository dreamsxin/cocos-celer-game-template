
import { ButtonClickSignal, ShowPauseLayerSignal } from "../../../Command/CommonSignal";
import { GameStateController, RoundEndType } from "../../../Controller/GameStateController";
import { PauseFont, ResourceController } from "../../../Controller/ResourceController";
import { gAudio } from "../../../Manager/AudioManager";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../../../View/BaseView";
import SliderView from "../../../View/SliderView";
import { SubmitButtonClickSignal } from "../../Command/GamePlaySignal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubmitLayerView extends BaseView {


    get EndButton() {
        return this.node.getChildByName("btn_end");
    }

    get ResumeButton() {
        return this.node.getChildByName("btn_resume");
    }

    get PauseCount() {
        return this.node.getChildByName("pauseCount").getComponent(cc.Label);
    }

      get Volume() {
        return this.node.getChildByName("Volume").getComponent(SliderView);
    }

    get PauseMsg() {
        return this.node.getChildByName("bg_pause_font1").getComponent(cc.Sprite);
    }

    get Bg() {
        return this.node.getChildByName("bg_submit985").getComponent(cc.Sprite)
    }

    @property(cc.SpriteFrame)
    SubmitBg: cc.SpriteFrame = null;

    onLoad() {
     setTimeout(() => {
            this.node.active = false;
        this.node.scale = 1;
     }, 0);

        SubmitButtonClickSignal.inst.addListenerOne(this.onSubmit, this);
        ShowPauseLayerSignal.inst.addListener(() => {
            this.onSubmit(false);
        }, this)

        this.EndButton.on(cc.Node.EventType.TOUCH_END, this.endNow, this);
        this.ResumeButton.on(cc.Node.EventType.TOUCH_END, this.Resume, this);

        this.Volume.onProgress = (percent: number) => {
        
            gAudio.setEffectVolume(percent);
            gAudio.setMusicVolume(percent);

        }

       setTimeout(() => {
                this.Volume.Percent = gAudio.EffectVolume;
            }, 0);
        

    }

    endNow() {
        GameStateController.inst.roundEnd(RoundEndType.Over);
      
        ButtonClickSignal.inst.dispatch();

        setTimeout(() => {
              this.Hide();
        }, 0);
    }

    Resume() {

        GameStateController.inst.resume();
      
        ButtonClickSignal.inst.dispatch();

        setTimeout(() => {
              this.Hide();
        }, 0);

    }

    onSubmit(submit: boolean) {

        if (PlayModelProxy.inst.FreePauseCount > 0) {

            this.PauseCount.node.active = true;
            this.PauseMsg.spriteFrame = ResourceController.inst.getPauseFont(PauseFont.HasFree);

        } else {
            this.PauseCount.node.active = false;
            this.PauseMsg.spriteFrame = ResourceController.inst.getPauseFont(PauseFont.NoneFree);
        }

        this.PauseCount.string = PlayModelProxy.inst.FreePauseCount.toString();
         this.Show();
    
         ButtonClickSignal.inst.dispatch();
        GameStateController.inst.pause();
        
        if (submit) {
            this.Volume.node.active = false;
            this.Bg.spriteFrame = this.SubmitBg;
        } else {
            this.Volume.node.active = true;
           
          this.Bg.spriteFrame = ResourceController.inst.getAltas("bg_pause")
        }
    }
}
