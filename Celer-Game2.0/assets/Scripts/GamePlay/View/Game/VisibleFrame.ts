// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { GameStateController } from "../../../Controller/GameStateController";
import { GameLogic } from "../../Model/GameLogic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VisiableFrame extends cc.Component {
  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTap, this);
  }

  onTap(ev: cc.Event.EventTouch) {
    if (
      !GameStateController.inst.isRoundStart() ||
      GameStateController.inst.isPause()
    )
      return;

    GameLogic.inst.checkClick(
      ev.getLocation().addSelf(cc.v2(0, -1920 / 2 - this.node.y))
    );
  }
}
