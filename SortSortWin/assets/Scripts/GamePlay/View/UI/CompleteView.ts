// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {
  GameOverSignal,
  OpenResultLayerSignal,
} from "../../../Command/CommonSignal";
import { RoundEndType } from "../../../Controller/GameStateController";
import { ResourceController } from "../../../Controller/ResourceController";
import FireWorkAnimation from "../Animation/FireWorkAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CompleteView extends cc.Component {
  get Font() {
    return this.node.getChildByName("Font").getComponent(cc.Sprite);
  }

  get Con() {
    return this.node.getChildByName("Con");
  }

  get FireWork() {
    return this.node.getChildByName("FireWork").getComponent(FireWorkAnimation);
  }

  onLoad() {
    GameOverSignal.inst.addListenerOne(this.onGameOver, this);
    this.Font.node.active = false;
    this.Con.active = false;
  }

  start() {
    this.FireWork.node.active = false;
  }

  onGameOver(type: RoundEndType) {
    this.Font.node.active = type != RoundEndType.Complete;

    switch (type) {
      case RoundEndType.Complete:
        this.FireWork.node.active = true;
        this.Con.active = true;
        break;
      case RoundEndType.Over:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          "font__game_over"
        );
        break;
      case RoundEndType.TimeUp:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          "font_time"
        );
        break;
    }

    if (this.Font.node.active) {
      this.Font.node.scaleX = 0;

      this.Font.node.runAction(cc.scaleTo(0.1, 1, 1));
    } else {
      this.FireWork.play();
      this.Con.scale = 0;
      this.Con.runAction(
        cc.sequence(
          cc.scaleTo(0.1, 1.2),
          cc.delayTime(0.15),
          cc.scaleTo(0.1, 1)
        )
      );
    }

    setTimeout(() => {
      OpenResultLayerSignal.inst.dispatchOne(type);
    }, 2000);
  }
}
