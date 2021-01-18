// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseMediator from "../../../View/BaseMediator";
import PokerStateView from "./PokerStateView";
import {
  PokerState,
  PokerStateChangedSignal,
} from "../../Model/Poker/PokerStateModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerStateMediator extends BaseMediator<PokerStateView> {
  onRegister() {
    PokerStateChangedSignal.inst.addListenerTwo(this.onPokerStateChanged, this);
  }

  onPokerStateChanged(ID: string, state: PokerState) {
    if (!this.View.Model || this.View.Model.ID != ID) return;

    if (state == PokerState.Back) {
      this.View.turnBack(0.1, () => {}, 0);
    } else {
      this.View.turnFront(0.1, () => {}, 0);
    }
  }
}
