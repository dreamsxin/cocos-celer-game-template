// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameOverSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { ResourceController } from "../../../Controller/ResourceController";
import { BaseSignal } from "../../../Utils/Signal";
import SingleTouchView from "../../../View/SingleTouchView";
import { RevertButtonStateChangedSignal } from "../../Model/GamePlayModel";

const { ccclass, property } = cc._decorator;
export class RevertSignal extends BaseSignal {}
@ccclass
export default class RevertButtonView extends SingleTouchView {
  get Button() {
    return this.getComponent(cc.Sprite);
  }

  onLoad() {
    super.onLoad();

    this.Button.spriteFrame = ResourceController.inst.getAltas("btn_backgray");
    this.getComponent(cc.Button).transition = cc.Button.Transition.NONE;
    RevertButtonStateChangedSignal.inst.addListenerOne(
      this.onButtonStateChanged,
      this
    );

    GameOverSignal.inst.addListener(() => {
      this.Button.spriteFrame = ResourceController.inst.getAltas(
        "btn_backgray"
      );
      this.getComponent(cc.Button).transition = cc.Button.Transition.NONE;
    }, this);
  }

  onTouchEnd() {
    if (
      GameStateController.inst.isGameOver() ||
      GameStateController.inst.isRoundStart() == false ||
      this.getComponent(cc.Button).transition == cc.Button.Transition.NONE
    )
      return;

    RevertSignal.inst.dispatch();
  }

  onButtonStateChanged(interactable: boolean) {
    if (interactable) {
      this.getComponent(cc.Button).transition = cc.Button.Transition.SCALE;
      this.Button.spriteFrame = ResourceController.inst.getAltas("btn_back");
    } else {
      this.getComponent(cc.Button).transition = cc.Button.Transition.NONE;
      this.node.scale = 1;
      this.Button.spriteFrame = ResourceController.inst.getAltas(
        "btn_backgray"
      );
    }
  }
}
