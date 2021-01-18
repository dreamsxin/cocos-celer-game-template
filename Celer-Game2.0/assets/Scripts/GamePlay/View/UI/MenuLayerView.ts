// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ShowPauseLayerSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { ResourceController } from "../../../Controller/ResourceController";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import BaseView from "../../../View/BaseView";
import { MenuButtonClickSignal } from "./MenuButtonView";
import { EndNowSignal } from "./SubmitLayerView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuLayerView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

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
    MenuButtonClickSignal.inst.addListener(this.onShow, this);
    ShowPauseLayerSignal.inst.addListener(() => {
      this.onShow();
    }, this);
    this.Resume.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        GameStateController.inst.resume();
        this.Hide();
      },
      this
    );

    this.EndNow.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        this.Hide();

        EndNowSignal.inst.dispatch();
      },
      this
    );

    super.onLoad();
    this.node.active = false;
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

  start() {}

  // update (dt) {}
}
