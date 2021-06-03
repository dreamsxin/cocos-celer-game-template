// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { CelerSDK } from "../Utils/Celer/CelerSDK";
import { BaseSignal } from "../Utils/Signal";

const { ccclass, property } = cc._decorator;

export enum FlyOrigin {
  Left,
  Right,
}

export class CnicornWatchFailSignal extends BaseSignal {}
export class RemoveFlyCnicornSignal extends BaseSignal {}
export class FlyCnicornAdDispearSignal extends BaseSignal {}
export class FlyCnicornClickSignal extends BaseSignal {}

export class ShowFlyCnicornSignal extends BaseSignal {}
@ccclass
export default class FlyCnicornAd extends cc.Component {
  public static ShowTimeRest = 0;
  get Fly() {
    return this.node.getChildByName("Fly");
  }

  private initY: number = 0;
  reuse(origin: FlyOrigin, y: number) {
    console.log("ShowFlyCnicorn:", FlyOrigin[origin]);
    this.node.opacity = 255;
    this.Fly.opacity = 255;
    let target = 0;
    this.Fly.y = y;
    origin = FlyOrigin.Right;
    if (false) {
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
          FlyCnicornAd.ShowTimeRest = 10;
        })
      )
    );
  }

  unuse() {}

  onLoad() {
    this.initY = this.Fly.y;
    RemoveFlyCnicornSignal.inst.addOnce(() => {
      ShowFlyCnicornSignal.inst.removeTarget(this);
      CnicornWatchFailSignal.inst.removeTarget(this);
      this.node.removeFromParent(true);
      this.node.destroy();
    }, this);

    CnicornWatchFailSignal.inst.addListener(() => {
      FlyCnicornAd.ShowTimeRest = 10;
    }, this);

    FlyCnicornAd.ShowTimeRest = 10;
    ShowFlyCnicornSignal.inst.addListenerTwo(
      (origin: FlyOrigin, originY: number) => {
        console.log(" Show Cnicorn");
        if (this.Fly.getNumberOfRunningActions() > 0) return;
        this.reuse(FlyOrigin.Right, this.initY);
      },
      this
    );
    if (CelerSDK.inst.isAndroidWeb == false && !CC_DEBUG) {
      RemoveFlyCnicornSignal.inst.dispatch();
    }
  }

  onAddTouch(ev: cc.Event.EventTouch) {
    this.Fly.stopAllActions();
    this.Fly.runAction(cc.fadeOut(0.2));
    FlyCnicornClickSignal.inst.dispatch();
  }

  update(dt: number) {}
}
