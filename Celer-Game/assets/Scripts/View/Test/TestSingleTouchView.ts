// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { gFactory } from "../../Factory/GameFactory";
import SingleTouchView from "../SingleTouchView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestSingleTouchView extends SingleTouchView {
  onSetParent(parent: cc.Node) {
    console.error("parent:", parent);
  }

  onTouchStart() {
    gFactory.putObj("TestNode", this.node);
  }

  onTouchEnd() {
    console.error("ontouchend");
  }
}
