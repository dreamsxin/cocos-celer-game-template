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
import { NextLevelSignal } from "../../../Model/PlayModelProxy";
import { GameLogic } from "../../Model/GameLogic";
import { UpdateTypeLabelSignal } from "../../Model/GamePlayModel";
import { SubjectOkSignal } from "./Subject";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SubjectTap extends cc.Component {
  get Tap() {
    return this.node.getChildByName("tap");
  }
  private y: number = 0;
  onLoad() {
    this.y = this.Tap.y;
    SubjectOkSignal.inst.addListenerOne(this.onSubjectOk, this);
    NextLevelSignal.inst.addListener(() => {
      this.getComponent(cc.Sprite).enabled = true;
    }, this);

    GameStartSignal.inst.addListener(this.onReadyStart, this);
    UpdateTypeLabelSignal.inst.addListenerOne(this.onTypeUpdate, this);
  }

  onTypeUpdate(startIndex: number) {
    let index = parseInt(this.node.name) + startIndex;
    let model = GameLogic.inst.Types[index];
    if (GameStateController.inst.isReady && model) {
      this.onReadyStart();
    }
  }

  onReadyStart() {
    this.Tap.runAction(
      cc.sequence(
        cc.moveTo(0.1, cc.v2(this.Tap.x, this.y + 900)),
        cc.scaleTo(0.1, 1.3),

        cc.scaleTo(0.2, 1),
        cc.delayTime(0.8),
        cc.moveTo(0.1, cc.v2(this.Tap.x, this.y)),
        cc.callFunc(() => {})
      )
    );

    setTimeout(() => {
      this.Tap.stopAllActions();
      this.Tap.y = this.y;
    }, 100 + 100 + 200 + 800 + 100 + 100);
  }

  onSubjectOk(index: number) {
    if (index == parseInt(this.node.name)) {
      this.getComponent(cc.Sprite).enabled = false;
    }
  }
}
