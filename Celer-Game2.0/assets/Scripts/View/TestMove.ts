// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameStateController } from "../Controller/GameStateController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestMove extends cc.Component {
  onLoad() {
    if (CELER_X) {
      this.node.removeFromParent(true);
      this.node.destroy();
    } else {
      this.node.on(
        cc.Node.EventType.TOUCH_MOVE,
        (ev: cc.Event.EventTouch) => {
          if (GameStateController.inst.isReady == false) return;
        },
        this
      );
    }
  }
}
