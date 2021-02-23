// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayPokerFlySignal } from "../../../Manager/AudioManager";
import { Random } from "../../../Utils/Random";
import { BaseSignal } from "../../../Utils/Signal";
import RotationView from "../../../View/Transform/RotationView";
import { PokerModel } from "../../Model/Poker/PokerModel";
import { FlyPokerSignal } from "./PokerPosMediator";

const { ccclass, property } = cc._decorator;

export const PokerFlyDelay = 100;

export class PokerPosFlySignal extends BaseSignal {}
@ccclass
export default class PokerRotationView extends RotationView {
  public randomFlyDelay: number = 0;
  // LIFE-CYCLE CALLBACKS:
  private model: PokerModel = null;
  get Model() {
    return this.model;
  }

  onLoad() {
    FlyPokerSignal.inst.addListenerOne((ID: string) => {
      if (this.model == null || ID != this.model.ID) return;

      this.randomFlyDelay = ((this.model.Point - 1) * PokerFlyDelay) / 1000;

      this.onRotationChanged(
        360 * 20 * (this.model.Point % 2 ? 1 : -1),
        3,
        () => {},
        this.randomFlyDelay
      );

      setTimeout(() => {
        PlayPokerFlySignal.inst.dispatch();
      }, this.randomFlyDelay * 1000);
      PokerPosFlySignal.inst.dispatchOne(ID);
    }, this);
  }

  reuse(model: PokerModel) {
    this.model = model;
    this.node.rotation = 0;
  }

  unuse() {
    this.model = null;
    this.onRotationChanged(0, 0, () => {});
  }
}
