// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameStateController } from "../../../Controller/GameStateController";
import { BaseSignal } from "../../../Utils/Signal";
import SingleTouchView from "../../../View/SingleTouchView";
import { RevertButtonStateChangedSignal } from "../../Model/GamePlayModel";

const { ccclass, property } = cc._decorator;
export class RevertSignal extends BaseSignal {}
@ccclass
export default class RevertButtonView extends SingleTouchView {
  get Button() {
    return this.getComponent(cc.Button);
  }

  onLoad() {
    super.onLoad();
    this.Button.interactable = false;
    RevertButtonStateChangedSignal.inst.addListenerOne(
      this.onButtonStateChanged,
      this
    );
  }

  onTouchEnd() {
    if (
      GameStateController.inst.isGameOver() ||
      GameStateController.inst.isRoundStart() == false
    )
      return;
    if (this.Button.interactable == false) return;

    console.log("revert");
    RevertSignal.inst.dispatch();
  }

  onButtonStateChanged(interactable: boolean) {
    this.Button.interactable = interactable;
  }
}
