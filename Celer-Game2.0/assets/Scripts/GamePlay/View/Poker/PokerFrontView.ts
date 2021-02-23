import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import { BaseSignal } from "../../../Utils/Signal";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PokerModel } from "../../Model/Poker/PokerModel";
import PokerRotationView, { PokerPosFlySignal } from "./PokerRotationView";

const { ccclass, property } = cc._decorator;

export class CheckIsHideSignal extends BaseSignal {}
@ccclass
export default class PokerFrontView extends cc.Component {
  get Front() {
    return this.node.getChildByName("Front");
  }

  private model: PokerModel = null;
  get Model() {
    return this.model;
  }

  onLoad() {
    PokerPosFlySignal.inst.addListener(() => {
      if (this.Front.active == false) {
        setTimeout(() => {
          this.Front.active = true;
        }, this.getComponent(PokerRotationView).randomFlyDelay / 2);
      }
    }, this);

    CheckIsHideSignal.inst.addListenerTwo((ID: string, show: boolean) => {
      if (this.model && this.model.ID == ID) {
        this.Front.active =
          show || PlayModelProxy.inst.checkIsShowFront(this.model);
      } else if (this.model) {
        this.Front.active = PlayModelProxy.inst.checkIsShowFront(this.model);
      }
    }, this);
  }

  onParentChanged(id: string) {
    if (this.model.ID != id) return;
  }

  reuse(model: PokerModel) {
    this.model = model;
  }

  unuse() {
    this.model = null;
    this.node.zIndex = 0;
  }
}
