// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { timeStamp } from "node:console";
import NewBreakAnimation from "./BreakAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Page extends cc.Component {
  @property(cc.Node)
  DiamondRoot: cc.Node = null;

  @property(cc.Node)
  BreakAnimation: cc.Node = null;

  @property(cc.Node)
  ScoreRoot: cc.Node = null;

  @property(cc.Node)
  Blue: cc.Node = null;

  @property(cc.Node)
  Green: cc.Node = null;

  private blueFrom: cc.Vec2 = null;
  private greenFrom: cc.Vec2 = null;

  onLoad() {
    this.blueFrom = this.Blue.position.clone();
    this.greenFrom = this.Green.position.clone();
  }

  play() {
    this.showDiamond();
    this.swapDiamond();
  }

  showDiamond() {
    this.Blue.setPosition(this.blueFrom);
    this.Green.setPosition(this.greenFrom);

    this.DiamondRoot.active = true;

    for (let child of this.DiamondRoot.children) {
      child.stopAllActions();
    }

    for (let child of this.ScoreRoot.children) {
      child.stopAllActions();
    }
    this.BreakAnimation.active = false;
    this.ScoreRoot.active = false;
  }

  swapDiamond() {
    this.Blue.runAction(
      cc.sequence(
        cc.delayTime(0.5),
        cc.moveTo(0.1, this.greenFrom),
        cc.delayTime(0.2),
        cc.callFunc(() => {
          this.playBreak();
        })
      )
    );
    this.Green.runAction(
      cc.sequence(
        cc.delayTime(0.5),
        cc.moveTo(0.1, this.blueFrom),
        cc.callFunc(() => {})
      )
    );
  }

  playBreak() {
    this.DiamondRoot.active = false;

    this.BreakAnimation.active = true;
    let hasCall = false;
    for (let child of this.BreakAnimation.children) {
      child.getComponent(NewBreakAnimation).play();

      if (hasCall) {
        child.getComponent(NewBreakAnimation).onComplete = () => {};
      } else {
        child.getComponent(NewBreakAnimation).onComplete = () => {
          child.runAction(
            cc.sequence(
              cc.fadeOut(0.2),
              cc.delayTime(1),
              cc.callFunc(() => {
                this.play();
              })
            )
          );
        };
      }
      hasCall = true;
    }

    this.ScoreRoot.active = true;

    for (let child of this.ScoreRoot.children) {
      child.opacity = 255;
      child.stopAllActions();
      child.scale = 0;
      child.runAction(
        cc.sequence(
          cc.scaleTo(0, 0),
          cc.scaleTo(0.2, 1),
          cc.scaleTo(0.1, 0.5),
          cc.fadeOut(0.1),
          cc.callFunc(() => {})
        )
      );
    }
  }
}
