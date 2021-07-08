// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayerScoreChanged } from "../Command/CommonSignal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PauseCostAnimation extends cc.Component {
  onLoad() {
    this.node.active = false;
    PlayerScoreChanged.inst.addListenerFour(this.onScoreChanged, this);
  }

  onScoreChanged(score: number, changed: number) {
    if (changed >= 0) return;

    this.node.active = true;
    this.node.opacity = 255;
    this.node.scale = 0;
    this.node.runAction(
      cc.sequence(
        cc.scaleTo(0.1, 1.2),
        cc.scaleTo(0.05, 1),
        cc.fadeOut(0.1),
        cc.callFunc(() => {
          this.node.active = false;
        })
      )
    );
  }
}
