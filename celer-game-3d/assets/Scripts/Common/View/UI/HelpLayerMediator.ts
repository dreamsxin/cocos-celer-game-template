import { _decorator, Component, Node } from "cc";
import { GameStateController } from "../../../Manager/GameStateController";
import {
  HideHelpLayerSignal,
  ShowHelpLayerSignal,
  ShowTutorialSignal,
} from "../../../Signal/Signal";
import { BaseMediator } from "../BaseMediator";
import { HelpLayerView } from "./HelpLayerView";
const { ccclass, property } = _decorator;

@ccclass("HelpLayerMediator")
export class HelpLayerMediator extends BaseMediator<HelpLayerView> {
  private closeCallback: Function = null;

  onRegister() {
    ShowHelpLayerSignal.inst.addListener(this.showHelp, this);
    ShowTutorialSignal.inst.addListener(this.showGuide, this);
    HideHelpLayerSignal.inst.addListener(this.hideGuide, this);
  }

  showHelp(callback: Function) {
    if (this.View.isShowed()) return;

    GameStateController.inst.pause();
    this.closeCallback = callback;
    this.View.Show();
  }

  showGuide(callback: Function) {
    if (this.View.isShowed()) return;

    GameStateController.inst.pause(true);
    this.closeCallback = callback;
    this.View.Show();
  }

  hideGuide() {
    if (this.View.isShowed() == false) return;

    GameStateController.inst.resume();
    this.View.Hide(this.closeCallback);
    this.closeCallback = null;
  }
}
