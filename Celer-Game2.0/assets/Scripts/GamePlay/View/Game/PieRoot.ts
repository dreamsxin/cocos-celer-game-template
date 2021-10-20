// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { gFactory } from "../../../Factory/GameFactory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PieRoot extends cc.Component {
  static node: cc.Node = null;
  onLoad() {
    PieRoot.node = this.node;
  }

  update() {
    this.node.scale = Math.min(1, 1080 / this.node.width);
  }
}

CC_DEBUG &&
  (window["TestAddPie"] = function () {
    PieRoot.node.addChild(gFactory.getObj("Pie"));
  });
