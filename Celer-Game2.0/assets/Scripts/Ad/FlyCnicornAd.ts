// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseSignal } from "../Utils/Signal";

const { ccclass, property } = cc._decorator;

export enum FlyOrigin {
  Left,
  Right,
}

export class FlyCnicornAdDispearSignal extends BaseSignal {}
export class FlyCnicornClickSignal extends BaseSignal {}

export class ShowFlyCnicornSignal extends BaseSignal {}
@ccclass
export default class FlyCnicornAd extends cc.Component {
  get Fly() {
    return this.node.getChildByName("Fly");
  }

  reuse(origin: FlyOrigin, y: number) {
    this.node.opacity = 255;
    let target = 0;
    this.Fly.y = y;
    if (origin == FlyOrigin.Left) {
      this.Fly.scaleX = 1;
      this.Fly.x = -940;
      target = 940;
    } else {
      this.Fly.scaleX = -1;
      this.Fly.x = 940;
      target = -940;
    }

    this.Fly.once(cc.Node.EventType.TOUCH_END, this.onAddTouch, this);

    this.Fly.runAction(
      cc.sequence(
        cc.moveTo(10, target, this.Fly.y),
        cc.spawn(
          cc.fadeOut(2),
          cc.moveBy(2, ((940 * 2) / 10) * 2 * this.Fly.scaleX, 0)
        ),
        cc.callFunc(() => {
          FlyCnicornAdDispearSignal.inst.dispatch();
        })
      )
    );
  }

  unuse() {}

  onLoad() {
    if (CC_DEBUG) {
      this.reuse(FlyOrigin.Right, 0);
    }

    ShowFlyCnicornSignal.inst.addListenerTwo(
      (origin: FlyOrigin, originY: number) => {
        this.reuse(origin, originY);
      },
      this
    );
  }

  onAddTouch(ev: cc.Event.EventTouch) {
    this.Fly.stopAllActions();
    this.Fly.runAction(cc.fadeOut(0.2));
    FlyCnicornClickSignal.inst.dispatch();
  }
}
