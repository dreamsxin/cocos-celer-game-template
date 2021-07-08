// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GetCollectCount, ScoreModel } from "../../../Global/GameRule";
import { NextLevelSignal } from "../../../Model/PlayModelProxy";
import { Random_Pool } from "../../../table";
import { BaseSignal } from "../../../Utils/Signal";
import { GameLogic } from "../../Model/GameLogic";
import { UpdateTypeLabelSignal } from "../../Model/GamePlayModel";
import { UpdateMatchTimes } from "../../Model/TypeModel";
import { SubjectOkSignal } from "./Subject";

const { ccclass, property } = cc._decorator;

export class UpdateTypeScore extends BaseSignal {}

@ccclass
export default class SubjectLabel extends cc.Component {
  get Count() {
    return this.node.getChildByName("Count").getComponent(cc.Label);
  }

  get Score() {
    return this.node.getChildByName("Score").getComponent(cc.Label);
  }

  private type: Random_Pool = null;
  onLoad() {
    this.Count.node.color = cc.color(226, 83, 51);
    this.Count.string = "0/" + GetCollectCount();
    this.Score.string = "+" + ScoreModel.GetScore(Random_Pool[this.type]);
    UpdateTypeLabelSignal.inst.addListenerOne(this.onTypeUpdate, this);

    UpdateTypeScore.inst.addListener(() => {
      if (this.type) {
        this.Score.string = "+" + ScoreModel.GetScore(Random_Pool[this.type]);
      }
    }, this);
    UpdateMatchTimes.inst.addListenerTwo(this.onMatchTimesUpdate, this);
    SubjectOkSignal.inst.addListenerOne(this.onSubjectOK, this);

    NextLevelSignal.inst.addListener(() => {
      this.type = null;
    }, this);
  }

  onSubjectOK(index: number) {
    if (index == parseInt(this.node.name)) {
      this.Count.node.color = cc.color(63, 157, 157);
      this.Score.string = "";
      this.type = null;
    }
  }

  onMatchTimesUpdate(index: number, count: number) {
    if (index == parseInt(this.node.name)) {
      this.Count.string = count + "/" + GetCollectCount();
    }
  }

  onTypeUpdate(startIndex: number) {
    let index = parseInt(this.node.name) + startIndex;
    let model = GameLogic.inst.Types[index];

    if (model) {
      this.Count.node.color = cc.color(226, 83, 51);
      this.Count.string = model.MatchTimes + "/" + GetCollectCount();
      this.type = model.SubType;
      this.Score.string = "+" + ScoreModel.GetScore(Random_Pool[this.type]);
    } else {
      console.error(" 类别model不存在：", index, startIndex);
    }
  }
}
