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

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubjectLabel extends cc.Component {
  get Type() {
    return this.node.getChildByName("Type").getComponent(cc.Label);
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

  private type: string = "";
  onLoad() {
    this.Type.enableBold(true);
    this.Type.string = "Down\nJacket";
    this.Score.string = "/" + ScoreModel.GetScore(this.type);
  }
}
