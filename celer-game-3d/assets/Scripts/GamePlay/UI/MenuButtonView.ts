import { _decorator, Component, Node } from "cc";
import { SingleTouchView } from "../../Common/View/SingleTouchView";
import { GameStateController } from "../../Manager/GameStateController";
import { ButtonClickSignal, MenuButtonClickSignal } from "../../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("MenuButtonView")
export class MenuButtonView extends SingleTouchView {
  onLoad() {
    super.onLoad();
  }

  onTouchEnd() {
    if (GameStateController.inst.isGameOver()) return;

    MenuButtonClickSignal.inst.dispatch();
    ButtonClickSignal.inst.dispatch();
  }
  start() {}
}
