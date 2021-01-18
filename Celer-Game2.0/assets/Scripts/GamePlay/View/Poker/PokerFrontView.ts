import { PlayModelProxy } from "../../../Model/PlayModelProxy";
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
import { PokerParent } from "../../Model/Poker/PokerParentModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerFrontView extends cc.Component {
  get Front() {
    return this.node.getChildByName("Front");
  }

  private model: PokerModel = null;
  get Model() {
    return this.model;
  }

  onLoad() {}

  onParentChanged(id: string) {
    if (this.model.ID != id) return;
  }

  reuse(model: PokerModel) {
    this.model = model;
  }

  unuse() {
    this.model = null;
  }
}
