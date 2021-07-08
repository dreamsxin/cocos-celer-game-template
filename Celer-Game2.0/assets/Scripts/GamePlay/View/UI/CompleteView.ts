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
import {
  AnimationType,
  ResourceController,
  Title,
} from "../../../Controller/ResourceController";
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
    return this.node.getChildByName("FireWork")
      ? this.node.getChildByName("FireWork").getComponent(FireWorkAnimation)
      : null;
  }

  onLoad() {
    GameOverSignal.inst.addListenerOne(this.onGameOver, this);
    this.Font.node.active = false;
    this.Con && (this.Con.active = false);
  }

  start() {
    this.FireWork && (this.FireWork.node.active = false);
  }

  onGameOver(type: RoundEndType) {
    this.Font.node.active = true;

    let delay = 1500;
    switch (type) {
      case RoundEndType.Complete:
        this.FireWork.node.active = true;
        this.Con && (this.Con.active = true);
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.CompleteAni
        );
        delay = 3000;
        break;
      case RoundEndType.Over:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.Over
        );
        break;
      case RoundEndType.TimeUp:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.TimeUp
        );
        break;
      case RoundEndType.OutOfMove:
        this.Font.spriteFrame = ResourceController.inst.getAnimationAtlas(
          AnimationType.UI,
          Title.OutOfMove
        );
        break;
    }

    if (this.FireWork && this.FireWork.node.active) {
      this.FireWork.play();
    }
    if (this.Font.node.active) {
      this.Font.node.scaleX = 0;

      this.Font.node.runAction(cc.scaleTo(0.1, 1.2));
    } else {
      if (this.Con) {
        this.Con.scale = 0;
        this.Con.runAction(
          cc.sequence(
            cc.scaleTo(0.1, 1.2),
            cc.scaleTo(0.05, 1),
            cc.delayTime(0.15),
            cc.scaleTo(0.1, 1)
          )
        );
      }
    }

    setTimeout(() => {
      OpenResultLayerSignal.inst.dispatchOne(type);
    }, delay);
  }
}
