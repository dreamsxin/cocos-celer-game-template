import { _decorator, Component, Node } from "cc";
import { BaseView } from "../BaseView";
import { GlobalSingleTouchMediator } from "./GlobalSingleTouchMediator";
const { ccclass, property } = _decorator;

@ccclass("GlobalSingleTouchView")
export class GlobalSingleTouchView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.BindMedaitor(GlobalSingleTouchMediator);
  }

  start() {}

  // update (dt) {}
}
