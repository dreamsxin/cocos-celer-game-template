import { _decorator, Component, Node } from "cc";
import { SingleTouchView } from "../../Common/View/SingleTouchView";
import { GameStateController } from "../../Manager/GameStateController";
import { ButtonClickSignal, ShowHelpLayerSignal } from "../../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("HelpButtonView")
export class HelpButtonView extends SingleTouchView {
  onTouchEnd() {
    if (GameStateController.inst.isGameOver()) return;

    ShowHelpLayerSignal.inst.dispatch();
    ButtonClickSignal.inst.dispatch();
  }
}
