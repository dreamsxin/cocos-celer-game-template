import { _decorator, Component, Node, RichText } from "cc";
import { BaseView } from "../../Common/View/BaseView";
import { GameStateController } from "../../Manager/GameStateController";
import { PlayModel } from "../../Model/PlayModel";
import {
  ButtonClickSignal,
  EndNowSignal,
  MenuButtonClickSignal,
  ShowPauseLayerSignal,
} from "../../Signal/Signal";
import { En_ID, En_View } from "../../table";
import { GetScoreByType, ScoreType, Theme } from "../GameRule";
const { ccclass, property } = _decorator;

@ccclass("MenuLayerView")
export class MenuLayerView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

  get Resume() {
    return this.node.getChildByName("ResumeButton");
  }

  get EndNow() {
    return this.node.getChildByName("EndNow");
  }
  get Background() {
    return this.node.getChildByName("Background");
  }
  get Content() {
    return this.node.getChildByName("Content").getComponent(RichText);
  }

  onLoad() {
    MenuButtonClickSignal.inst.addListener(this.onShow, this);
    ShowPauseLayerSignal.inst.addListener(() => {
      this.onShow();
    }, this);
    this.Resume.on(
      Node.EventType.TOUCH_END,
      () => {
        GameStateController.inst.resume();
        ButtonClickSignal.inst.dispatch();
        this.Hide();
      },
      this
    );

    this.EndNow.on(
      Node.EventType.TOUCH_END,
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
    let count = 0;
    for (let child of this.Background.children) {
      child.active = child.name == Theme[PlayModel.inst.Theme];
      if (child.active) {
        count++;
      }
    }

    if (count <= 0) {
      this.Background.children[0].active = true;
    }
    if (PlayModel.inst.FreePauseCount <= 0) {
      this.Content.string = lan.t(En_View.ZanTingJieMian, En_ID.ZanTingKouFen, [
        "" + GetScoreByType(ScoreType.PauseCost),
      ]);
    } else {
      this.Content.string = lan.t(
        En_View.ZanTingJieMian,
        En_ID.MianFeiZanTing,
        [
          PlayModel.inst.FreePauseCount.toString(),

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
