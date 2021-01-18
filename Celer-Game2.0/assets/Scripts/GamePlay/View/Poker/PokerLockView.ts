// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseSignal } from "../../../Utils/Signal";
import BaseView from "../../../View/BaseView";
import { PokerModel } from "../../Model/Poker/PokerModel";

const { ccclass, property } = cc._decorator;

export class LockStateChangedSignal extends BaseSignal {}

@ccclass
export default class PokerLockView extends BaseView {
  // LIFE-CYCLE CALLBACKS:
  private model: PokerModel = null;
  get Model() {
    return this.model;
  }

  reuse(model: PokerModel) {
    this.model = model;

    this.Lock.active = false;
  }

  unuse() {
    this.model = null;
  }

  get Lock() {
    return this.node.getChildByName("Locked");
  }

  onLoad() {
    LockStateChangedSignal.inst.addListenerTwo(this.onLockStateChanged, this);
  }

  start() {}

  onLockStateChanged(ID: string, isLock: boolean) {
    if (!this.model || this.model.ID != ID) return;

    this.Lock.active = isLock;
  }

  // update (dt) {}
}
