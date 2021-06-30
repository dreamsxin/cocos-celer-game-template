// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ScoreModel } from "../../../Global/GameRule";
import { Random_Pool } from "../../../table";
import { GameLogic } from "../../Model/GameLogic";
import { UpdateTypeLabelSignal } from "../../Model/GamePlayModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubjectLabel extends cc.Component {
  get Type() {
    return this.node.getChildByName("Type").getComponent(cc.RichText);
  }

  get Count() {
    return this.node.getChildByName("Count").getComponent(cc.Label);
  }

  get Total() {
    return this.node.getChildByName("Total").getComponent(cc.Label);
  }

  get Score() {
    return this.node.getChildByName("Score").getComponent(cc.Label);
  }

  private type: Random_Pool = null;
  onLoad() {
    this.Type.string = "";
    this.Score.string = "/" + ScoreModel.GetScore(Random_Pool[this.type]);

    UpdateTypeLabelSignal.inst.addListenerOne(this.onTypeUpdate, this);
  }

  onTypeUpdate(startIndex: number) {
    let index = parseInt(this.node.name) + startIndex;
    let model = GameLogic.inst.Types[index];
    if (model) {
      this.type = model.SubType;
      this.Score.string = "/" + ScoreModel.GetScore(Random_Pool[this.type]);
      this.Type.string = lan.t(model.Type, model.SubType);
    } else {
      console.error(" 类别model不存在：", index, startIndex);
    }
  }
}
