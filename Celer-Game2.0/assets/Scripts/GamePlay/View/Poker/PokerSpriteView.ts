import { ResourceController } from "../../../Controller/ResourceController";
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class PokerSpriteView extends cc.Component {
  get Front() {
    return this.node.getChildByName("Front").getComponent(cc.Sprite);
  }

  // LIFE-CYCLE CALLBACKS:
  private model: PokerModel = null;
  get Model() {
    return this.model;
  }

  reuse(model: PokerModel) {
    this.model = model;
    this.Front.spriteFrame = ResourceController.inst.getPokerSprite(
      this.model.Point,
      this.model.Type
    );
  }

  unuse() {
    this.model = null;
  }
}
