import { ButtonClickSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { ResourceController } from "../../../Controller/ResourceController";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
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

import BaseView from "../../../View/BaseView";
import { SubmitButtonClickSignal } from "../../Command/GamePlaySignal";

const { ccclass, property } = cc._decorator;

export class EndNowSignal extends BaseSignal {}

@ccclass
export default class SubmitLayerView extends BaseView {
  get Resume() {
    return this.node.getChildByName("ResumeButton");
  }

  get EndNow() {
    return this.node.getChildByName("EndNow");
  }

  get FreePauseCount() {
    return this.node.getChildByName("FreePauseCount").getComponent(cc.Label);
  }

  get PauseInfo() {
    return this.node.getChildByName("PauseInfo").getComponent(cc.Sprite);
  }

  onLoad() {
    setTimeout(() => {
      this.node.active = false;
      this.node.scale = 1;
    }, 0);

    SubmitButtonClickSignal.inst.addListenerOne(this.onShow, this);

    this.EndNow.on(cc.Node.EventType.TOUCH_END, this.endNow, this);
    this.Resume.on(cc.Node.EventType.TOUCH_END, this.OnResume, this);
  }

  endNow() {
    EndNowSignal.inst.dispatch();

    ButtonClickSignal.inst.dispatch();

    setTimeout(() => {
      this.Hide();
    }, 0);
  }

  OnResume() {
    GameStateController.inst.resume();

    ButtonClickSignal.inst.dispatch();

    setTimeout(() => {
      this.Hide();
    }, 0);
  }

  onShow() {
    if (this.node.active) return;
    if (PlayModelProxy.inst.FreePauseCount <= 0) {
      this.FreePauseCount.node.active = false;
      this.PauseInfo.spriteFrame = ResourceController.inst.getAltas(
        "font_pauseno"
      );
    } else {
      this.FreePauseCount.node.active = true;
      this.FreePauseCount.string = PlayModelProxy.inst.FreePauseCount.toString();
      this.PauseInfo.spriteFrame = ResourceController.inst.getAltas(
        "font_pausehave"
      );
    }
    this.Show();
    GameStateController.inst.pause();
  }
}
