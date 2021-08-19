import { _decorator, Component, Node, EventTouch } from "cc";
import { GameStateController } from "../../../Manager/GameStateController";
import { ShowTipSignal } from "../../../Signal/Signal";
import { SingleTouchMediator } from "../SingleTouchMediator";
import { GlobalSingleTouchView } from "./GlobalSingleTouchView";
const { ccclass, property } = _decorator;

@ccclass("GlobalSingleTouchMediator")
export class GlobalSingleTouchMediator extends SingleTouchMediator<GlobalSingleTouchView> {
  onRegister() {
    super.onRegister();
    this.node.eventProcessor.touchListener["swallowTouches"] = false;
  }

  protected onTouchStart(event: EventTouch) {
    if (
      GameStateController.inst.canStart() &&
      GameStateController.inst.isRoundStart() == false
    ) {
      GameStateController.inst.roundStart();
    }

    this.time = 0;
  }

  protected onTouchMove(event: EventTouch) {
    this.time = 0;
  }

  protected onTouchEnd(event: EventTouch) {
    this.time = 0;
  }

  protected onTouchCancel(event: EventTouch) {
    this.time = 0;
  }

  private time: number = 0;
  update(dt: number) {
    this.time += dt;

    if (this.time >= 3) {
      this.time = 0;
      ShowTipSignal.inst.dispatch();
    }
  }
}
