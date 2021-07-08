// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameStartSignal } from "../../../Command/CommonSignal";
import { GameStateController } from "../../../Controller/GameStateController";
import { GameLogic } from "../../Model/GameLogic";
import { UpdateTypeLabelSignal } from "../../Model/GamePlayModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubjectTypeLabel extends cc.Component {
  get Type() {
    return this.node.getChildByName("Type").getComponent(cc.RichText);
  }

  // LIFE-CYCLE CALLBACKS:

  private y: number = 0;
  onLoad() {
    this.y = this.node.y;
    this.Type.string = "";
    UpdateTypeLabelSignal.inst.addListenerOne(this.onTypeUpdate, this);
    GameStartSignal.inst.addListenerOne(this.onReadyStart, this);
  }

  start() {}

  onReadyStart(callback: Function) {
    this.node.runAction(
      cc.sequence(
        cc.moveTo(0.1, cc.v2(this.node.x, this.y + 900)),
        cc.scaleTo(0.1, 1.3),
        cc.scaleTo(0.2, 1),
        cc.delayTime(0.8),
        cc.moveTo(0.1, cc.v2(this.node.x, this.y)),
        cc.callFunc(() => {})
      )
    );

    setTimeout(() => {
      this.node.stopAllActions();
      this.node.y = this.y;
      if (!GameStateController.inst.isReady) {
        GameStateController.inst.isReady = true;
      }

      callback && callback();
    }, 100 + 100 + 200 + 800 + 100 + 100);
  }

  // update (dt) {}
  onTypeUpdate(startIndex: number) {
    let index = parseInt(this.node.name) + startIndex;
    let model = GameLogic.inst.Types[index];
    if (model) {
      console.log("Type update:", this.node.name);
      this.Type.string = lan.t(model.Type, model.SubType);

      if (GameStateController.inst.isReady) {
        GameStateController.inst.pause(true);
        this.onReadyStart(() => {
          GameStateController.inst.resume();
        });
      }
    } else {
      console.error(" 类别model不存在：", index, startIndex);
    }
  }
}
