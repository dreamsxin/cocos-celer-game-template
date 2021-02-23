// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameOverSignal, GamePauseSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import BaseView from "../../../View/BaseView";
import { PokerModel } from "../../Model/Poker/PokerModel";
import { ParentType } from "../../Model/Poker/PokerParentModel";
import { ShakePokerSignal } from "../Poker/PokerPosMediator";
import PokerToucherMediator, {
  CheckAutoRecycleSignal,
  DrawCardSignal,
} from "./PokerToucherMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerToucher extends BaseView {
  private hasMoved: boolean = false;
  private movedDetal: cc.Vec2 = cc.v2(0, 0);
  onLoad() {
    GamePauseSignal.inst.addListener(() => {
      if (this.isMoved()) {
        PlayModelProxy.inst.onCancel(this.Model.ID);
      }
    }, this);

    GameOverSignal.inst.addListener(() => {
      if (this.isMoved()) {
        PlayModelProxy.inst.onCancel(this.Model.ID);
      }
    }, this);

    this.node.on(
      cc.Node.EventType.TOUCH_END,
      (ev: cc.Event.EventTouch) => {
        this.onTouchEnd(ev);
        this.OnClick();
      },
      this
    );

    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);

    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  // LIFE-CYCLE CALLBACKS:
  private model: PokerModel = null;
  get Model() {
    return this.model;
  }

  reuse(model: PokerModel) {
    this.model = model;
  }

  unuse() {
    this.model = null;
  }

  onTouchCancel(event: cc.Event.EventTouch) {
    this.onTouchEnd(event);
    event.stopPropagation();
  }

  onTouchMove(event: cc.Event.EventTouch) {
    if (GameStateController.inst.isRoundStart() == false) return;

    this.hasMoved = false;

    this.movedDetal.addSelf(event.getDelta());
    this.hasMoved = true;
    if (this.isMoved() == false) {
      return;
    }

    if (
      this.model.Parent.ParentType == ParentType.Desk &&
      this.model.Lock == false
    ) {
      PlayModelProxy.inst.onMoved(this.Model.ID, event.getDelta());
    }

    event.stopPropagation();
  }

  onTouchStart(event: cc.Event.EventTouch) {
    event.stopPropagation();
  }

  onTouchEnd(event: cc.Event.EventTouch) {
    if (this.hasMoved) {
      PlayModelProxy.inst.onMovedEnd(this.Model.ID);
    }
    event.stopPropagation();
  }

  OnClick() {
    if (GameStateController.inst.isRoundStart() == false) return;

    if (this.Model.isOnDraw()) {
      DrawCardSignal.inst.dispatch();
    } else if (this.Model.isOnRecycle() == false) {
      if (this.isMoved() == false && this.Model.State.isFront()) {
        // CheckAutoRecycleSignal.inst.dispatchOne(this.Model);
      }
    } else if (this.Model.State.isFront() && this.isMoved() == false) {
      ShakePokerSignal.inst.dispatchOne([this.Model.ID]);
    }
    this.movedDetal.x = 0;
    this.movedDetal.y = 0;

    this.hasMoved = false;
  }

  isMoved() {
    return this.movedDetal.mag() >= 20;
  }
}
