// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ConvertToNodeSpaceAR, GetBoxToWorld } from "../Utils/Cocos";
import { BaseSignal } from "../Utils/Signal";
import BaseView from "../View/BaseView";
import {
  LayerType,
  TutorialManager,
  TutorialStruct,
  TutorialType,
} from "./TutorialManager";
/** 开始引导 */
export class ShowTutorialSignal extends BaseSignal {}
const { ccclass, property } = cc._decorator;

@ccclass
export default class TutorialView extends BaseView {
  get Hand() {
    return this.node.getChildByName("Hand");
  }

  get Root() {
    return this.node.getChildByName("Root");
  }

  get Mask() {
    return this.node.getChildByName("Mask");
  }

  private types: LayerType[] = [];

  private tutorial: TutorialStruct = null;
  private hasTouchStart: boolean = false;
  get Type() {
    return this.types[this.types.length - 1];
  }

  onLoad() {
    this.node.active = false;
    this.node.scale = 1;
    this.Hand.active = false;
    this.Mask.active = false;
    this.Mask.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    this.Mask.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.Mask.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.Mask.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    ShowTutorialSignal.inst.addListenerOne(this.onShow, this);
  }

  private onShow(type: LayerType) {
    this.pushType(type);
    this.Hand.active = false;
    this.Hand.stopAllActions();
    console.log(
      "Show tutorial:",
      LayerType[type],
      ", current:",
      LayerType[this.Type]
    );
    if (this.node.active) {
      this.showNext();
    } else {
      this.Show(this.showNext.bind(this));
    }
  }

  private pushType(type: LayerType) {
    if (this.Type == type) {
      return;
    } else {
      this.types.push(type);
    }
  }

  private toNext(type: LayerType) {
    console.log("to Next:", LayerType[type], LayerType[this.Type]);
    TutorialManager.inst
      .next(type)
      .then(() => {
        this.done();
      })
      .catch(() => {
        this.showNext();
      });
  }

  private showNext() {
    if (this.Type == null) {
      this.end();
      return;
    }

    this.Root.destroyAllChildren();
    TutorialManager.inst
      .show(this.Type)
      .then(this.goNext.bind(this))
      .catch(this.done.bind(this));
  }

  private done() {
    console.log(LayerType[this.Type], " done.");
    this.types.pop();

    if (this.Type == null) {
      this.end();
      return;
    }

    this.showNext();
  }

  private end() {
    if (this.tutorial && this.tutorial.node) {
      this.tutorial.node.group = "default";
    }

    this.tutorial = null;
    this.Hand.active = false;
    this.Mask.active = false;
    this.Hide();
  }

  private goNext(tutorial: TutorialStruct) {
    if (this.tutorial && this.tutorial.node) {
      this.tutorial.node.group = "default";
    }
    this.tutorial = tutorial;

    this.hasTouchStart = false;
    this.Mask.active = true;
    this.Mask.getComponent(cc.Sprite).enabled = this.tutorial.needMask;
    this.Mask["_touchListener"].swallowTouches = this.tutorial.needMask;

    if (this.tutorial.maskClear) {
      this.Mask.opacity = 0;
    } else {
      this.Mask.opacity = 255;
    }

    if (this.tutorial.delay) {
      setTimeout(() => {
        this.doNext();
      }, this.tutorial.delay * 1000);
    } else {
      this.doNext();
    }
  }

  private doNext() {
    let nodePosInHand = ConvertToNodeSpaceAR(
      this.tutorial.node,
      this.Hand.parent
    );

    if (this.tutorial.needMask) {
      this.tutorial.node.group = "tutorial";
    }

    this.Hand.stopAllActions();

    this.Hand.x = nodePosInHand.x + 10;
    this.Hand.y = nodePosInHand.y - this.tutorial.node.height / 4;
    this.Hand.rotation = 0;

    if (
      Math.abs(this.Hand.x - 20 + this.Hand.width * (1 - this.Hand.anchorX)) >
      this.node.width / 2
    ) {
      this.Hand.x = nodePosInHand.x;
      this.Hand.y = nodePosInHand.y - this.tutorial.node.height / 4;
      this.Hand.rotation = 50;
    }

    this.Hand.active = true;
    this.Hand.opacity = 0;
    this.Hand.runAction(
      cc.sequence(
        cc.delayTime(0.1),
        cc.fadeIn(0.1),
        cc.callFunc(() => {})
      )
    );

    this.showHandAni();

    if (this.tutorial.lastTime) {
      setTimeout(
        (type: LayerType) => {
          this.toNext(type);
        },
        this.tutorial.lastTime * 1000,
        this.tutorial.layer
      );
    } else {
    }
  }

  private showHandAni() {
    let action = cc.repeatForever(
      cc.sequence(
        cc.moveTo(
          0.5,
          cc.v2(this.Hand.position.x, this.Hand.position.y + 20),
          100
        ),
        cc.moveTo(
          0.5,
          cc.v2(this.Hand.position.x, this.Hand.position.y - 20),
          100
        )
      )
    );
    this.Hand.runAction(action);
  }

  private onTouchStart(ev: cc.Event.EventTouch) {
    if (!this.tutorial) {
      console.error("[onTouchStart] tutorial is null.");
      return;
    }

    if (GetBoxToWorld(this.tutorial.node).contains(ev.getLocation())) {
      if (this.tutorial.needMask) {
        this.tutorial.node.dispatchEvent(ev);
      }
      this.hasTouchStart = true;
    } else {
    }
  }

  private onTouchEnd(ev: cc.Event.EventTouch) {
    if (!this.tutorial) {
      console.error("[onTouchEnd] tutorial is null.");
      return;
    }

    if (this.hasTouchStart) {
      this.hasTouchStart = false;

      if (this.tutorial.needMask) {
        this.tutorial.node.dispatchEvent(ev);
      }

      if (this.tutorial.lastTime) {
      } else {
        this.toNext(this.tutorial.layer);
      }
    }
  }

  private onTouchMove(ev: cc.Event.EventTouch) {
    if (!this.tutorial) {
      console.error("[onTouchMove] tutorial is null.");
      return;
    }

    if (this.hasTouchStart) {
      if (this.tutorial.needMask) {
        this.tutorial.node.dispatchEvent(ev);
      }
    }
  }
}
