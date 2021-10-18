// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "../App/App";
import { GameLogic } from "../GamePlay/Model/GameLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SingleTouchMediator<
  T extends cc.Component
> extends cc.Component {
  public bind(view: T) {
    this.view = view;
  }

  private view: T;
  get View(): T {
    console.assert(this.view != null, " view is null");
    return this.view;
  }

  private _touchid: number = null;

  private get touchid() {
    return this._touchid;
  }

  private set touchid(val: number) {
    this._touchid = val;
    window["OpenTouchIDlog"] &&
      console.log(this.node.name, " touchid :", this._touchid);
  }

  onRegister() {
    this.node.targetOff(this);
    this.node["_onSetParent"] = this._onSetParent.bind(this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
  }

  onUnregister() {
    this.node.targetOff(this);
  }

  private touchStart(event: cc.Event.EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      console.log(
        this.node.name,
        " touch start  touchid is different: ",
        this.touchid,
        event.getID()
      );
      event.stopPropagation();
      return;
    }
    this.touchid = event.getID();

    this.onTouchStart(event);
  }

  private touchMove(event: cc.Event.EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      //console.log(this.node.name, " touch move  touchid is different! ");
      event.stopPropagation();
      return;
    }
    this.touchid = event.getID();
    this.onTouchMove(event);
  }

  private touchEnd(event: cc.Event.EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      console.log(
        this.node.name,
        " touch end  touchid is different: ",
        this.touchid,
        event.getID()
      );
      event.stopPropagation();
      return;
    }

    if (this.touchid == null) {
      event.stopPropagation();
      return;
    }

    this.touchid = null;
    this.onTouchEnd(event);
    this.OnClick();
  }

  private touchCancel(event: cc.Event.EventTouch) {
    if (this.touchid !== null && this.touchid !== event.getID()) {
      console.log(
        this.node.name,
        " touch cancel  touchid is different: ",
        this.touchid,
        event.getID()
      );
      event.stopPropagation();
      return;
    }

    if (this.touchid == null) {
      event.stopPropagation();
      return;
    }

    this.touchid = null;
    this.onTouchCancel(event);
  }

  protected OnClick() {}

  protected onTouchStart(event: cc.Event.EventTouch) {}

  protected onTouchMove(event: cc.Event.EventTouch) {}

  protected onTouchEnd(event: cc.Event.EventTouch) {}

  protected onTouchCancel(event: cc.Event.EventTouch) {}

  protected onSetParent(perent: cc.Node) {}

  private _onSetParent(parent: cc.Node) {
    if (parent == null) {
      this.touchid = null;
    }

    this.onSetParent(parent);
  }
}
