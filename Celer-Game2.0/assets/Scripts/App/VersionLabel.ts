// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameStartSignal } from "../Command/CommonSignal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VersionLabel extends cc.Component {
  onLoad() {
    if (CC_DEBUG) {
      window["DEBUG_VERSION"] = "test 6.0.0";
    }
    this.node.opacity = 100;
    GameStartSignal.inst.addListener(() => {
      this.getComponent(cc.Label).string =
        window["GAME_VERSION"] &&
        window["GAME_VERSION"].split("version") &&
        window["GAME_VERSION"].split("version")[1]
          ? window["GAME_VERSION"].split("version")[1].replace(":", "")
          : window["DEBUG_VERSION"];
    }, this);
  }
}
