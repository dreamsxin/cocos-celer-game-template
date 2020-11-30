// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameReadySignal } from "../../Command/CommonSignal";
import { gFactory } from "../../Factory/GameFactory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestApp extends cc.Component {
  start() {
    if (!CC_DEBUG) {
      this.node.removeComponent(TestApp);
      return;
    }
    GameReadySignal.inst.addListener(() => {
      this.node.addChild(gFactory.getObj("TestNode"));
    }, this);
  }
}
