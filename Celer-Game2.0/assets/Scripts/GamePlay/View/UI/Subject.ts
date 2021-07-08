// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { NextLevelSignal } from "../../../Model/PlayModelProxy";
import { BaseSignal } from "../../../Utils/Signal";
import TypeFinishLight from "../Animation/TypeFinishLight";
import TypeFinishRing from "../Animation/TypeFinishRing";

const { ccclass, property } = cc._decorator;

export class SubjectOkSignal extends BaseSignal {}

export class SubjectAnimationDone extends BaseSignal {}

/**
 * 种类信息
 */
@ccclass
export default class Subject extends cc.Component {
  /** 完成的tag */
  get Tag() {
    return this.node.getChildByName("tagOK");
  }

  get Finish1() {
    return this.node.getChildByName("Finish1").getComponent(TypeFinishLight);
  }

  get Finish2() {
    return this.node.getChildByName("Finish2").getComponent(TypeFinishRing);
  }

  onLoad() {
    this.Tag.active = false;
    this.Finish1.node.active = false;
    this.Finish2.node.active = false;
    SubjectOkSignal.inst.addListenerOne(this.onSubjectOk, this);
    NextLevelSignal.inst.addListener(() => {
      this.Tag.active = false;
    }, this);
  }

  playFinish1() {
    this.Finish1.node.active = true;
    this.Finish1.node.opacity = 255;
    this.Finish1.play();
    this.Finish1.onComplete = () => {
      this.Finish1.node.runAction(
        cc.sequence(
          cc.fadeOut(0.1),
          cc.callFunc(() => {
            this.Finish1.node.active = false;
          })
        )
      );
    };
  }

  playFinish2() {
    this.Finish2.node.active = true;
    this.Finish2.node.opacity = 255;
    this.Finish2.play();
    this.Finish2.onComplete = () => {
      setTimeout(() => {
        SubjectAnimationDone.inst.dispatch();
      }, 300);
      this.Finish2.node.runAction(
        cc.sequence(
          cc.fadeOut(0.1),
          cc.callFunc(() => {
            this.Finish2.node.active = false;
          })
        )
      );
    };
  }

  onSubjectOk(index: number) {
    if (index == parseInt(this.node.name)) {
      if (this.Tag.active == true) {
        if (this.Tag.getNumberOfRunningActions() <= 0) {
          this.playFinish1();
          this.Tag.runAction(
            cc.sequence(
              cc.scaleTo(0.1, 1.2),
              cc.scaleTo(0.05, 1),
              cc.callFunc(() => {})
            )
          );
        }
      } else {
        this.playFinish1();
        this.playFinish2();
        this.Tag.active = true;
        this.Tag.opacity = 50;
        this.Tag.scale = 3;
        this.Tag.runAction(
          cc.sequence(
            cc.spawn(cc.scaleTo(0.1, 0.9), cc.fadeTo(0.1, 255)),
            cc.callFunc(() => {
              // animation
            }),
            cc.scaleTo(0.1, 1.2),
            cc.scaleTo(0.1, 1)
          )
        );
      }
    }
  }
}
