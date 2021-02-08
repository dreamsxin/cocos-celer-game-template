import { GameOverSignal, GamePauseSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import BaseMediator from "../../../View/BaseMediator";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SingleTouchMediator from "../../../View/SingleTouchMediator";
import PokerToucher from "./PokerToucher";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerToucherMediator extends BaseMediator<PokerToucher> {
  private hasMoved: boolean = false;
  private movedDetal: cc.Vec2 = cc.v2(0, 0);

  onRegister() {
    super.onRegister();
    GamePauseSignal.inst.addListener(() => {
      if (this.isMoved()) {
        PlayModelProxy.inst.onCancel(this.View.Model.ID);
      }
    }, this);

    GameOverSignal.inst.addListener(() => {
      if (this.isMoved()) {
        PlayModelProxy.inst.onCancel(this.View.Model.ID);
      }
    }, this);

    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
  }

  onTouchCancel(event: cc.Event.EventTouch) {
    this.onTouchEnd(event);
  }

  onTouchMove(event: cc.Event.EventTouch) {
    if (GameStateController.inst.isRoundStart() == false) return;

    this.hasMoved = false;

    this.movedDetal.addSelf(
      cc.v2(Math.abs(event.getDelta().x), Math.abs(event.getDelta().y))
    );

    if (this.isMoved() == false) {
      return;
    }
    this.hasMoved = true;
    PlayModelProxy.inst.onMoved(this.View.Model.ID, event.getDelta());
  }

  onTouchStart(event: cc.Event.EventTouch) {}

  onTouchEnd(event: cc.Event.EventTouch) {
    if (this.hasMoved) {
      PlayModelProxy.inst.onMovedEnd(this.View.Model.ID);
    } else {
      this.OnClick();
    }
    this.hasMoved = false;
    this.movedDetal.x = 0;
    this.movedDetal.y = 0;
  }

  OnClick() {
    if (GameStateController.inst.isRoundStart() == false) return;
  }

  isMoved() {
    return this.movedDetal.mag() >= 15;
  }
}
