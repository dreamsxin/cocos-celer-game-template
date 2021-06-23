// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {
  ButtonClickSignal,
  ShowPauseLayerSignal,
} from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { GetScoreByType } from "../../../Global/GameRule";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import { En_ID, En_View } from "../../../table";
import BaseView from "../../../View/BaseView";
import { ScoreType } from "../../Model/GamePlayModel";
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

  get Content() {
    return this.node.getChildByName("Content").getComponent(cc.RichText);
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
        ButtonClickSignal.inst.dispatch();
        this.Hide();
      },
      this
    );

    this.EndNow.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        this.Hide();
        ButtonClickSignal.inst.dispatch();
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
      this.Content.string = lan.t(En_View.ZanTingJieMian, En_ID.ZanTingKouFen, [
        PlayModelProxy.inst.FreePauseCount.toString(),

        "" + GetScoreByType(ScoreType.PauseCost),
      ]);
    } else {
      this.Content.string = lan.t(
        En_View.ZanTingJieMian,
        En_ID.MianFeiZanTing,
        [
          PlayModelProxy.inst.FreePauseCount.toString(),

          "" + GetScoreByType(ScoreType.PauseCost),
        ]
      );
    }

    this.Show();
    GameStateController.inst.pause();
  }

  start() {}

  // update (dt) {}
}
