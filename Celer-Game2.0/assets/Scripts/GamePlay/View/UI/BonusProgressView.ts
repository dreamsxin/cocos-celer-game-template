// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { ScoreCountDownUpdateSignal } from "../../Model/GamePlayModel";

const { ccclass, property } = cc._decorator;

const Total = 680; // 100%
const Double = 578; // 85%
const Times1_5 = 408; // 40%

/**
 *  分数翻倍进度条
 */
@ccclass
export default class BonusProgressView extends cc.Component {
  onLoad() {
    this.node.width = Total;
    ScoreCountDownUpdateSignal.inst.addListenerOne((percent: number) => {
      this.node.width = Total * percent;
    }, this);
  }
}
