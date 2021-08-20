import {
  _decorator,
  Component,
  Node,
  UIOpacity,
  tween,
  v3,
  Tween,
  EventTouch,
} from "cc";
import { CelerSDK } from "../Common/SDK/CelerSDK";
import {
  CnicornWatchFailSignal,
  FlyCnicornAdDispearSignal,
  FlyCnicornClickSignal,
  RemoveFlyCnicornSignal,
  ShowFlyCnicornSignal,
  TimeAnimationStateChanged,
} from "../Signal/Signal";
const { ccclass, property } = _decorator;
export enum FlyOrigin {
  Left,
  Right,
}
@ccclass("FlyCnicornAd")
export class FlyCnicornAd extends Component {
  public static ShowTimeRest = 0;
  get Fly() {
    return this.node.getChildByName("Fly");
  }

  private flyopacity: UIOpacity = null;
  get FlyOpacity() {
    if (this.flyopacity == null) {
      this.flyopacity = this.Fly.addComponent(UIOpacity);
    }
    return this.flyopacity;
  }

  private uiopacity: UIOpacity = null;
  get UIOPacity() {
    if (this.uiopacity == null) {
      this.uiopacity = this.addComponent(UIOpacity);
    }
    return this.uiopacity;
  }

  private initY: number = 0;
  private tween: Tween = null;
  reuse(origin: FlyOrigin, y: number) {
    console.log("ShowFlyCnicorn:", FlyOrigin[origin]);
    this.UIOPacity.opacity = 255;
    this.flyopacity.opacity = 255;

    this.Fly.setPosition(this.Fly.position.x, y, this.Fly.position.z);
    origin = FlyOrigin.Right;

    this.Fly.setScale(-1, 1, 1);
    this.Fly.setPosition(940, this.Fly.position.y, this.Fly.position.z);
    let target = v3(-940, this.Fly.position.y, this.Fly.position.z);

    this.Fly.once(Node.EventType.TOUCH_END, this.onAddTouch, this);

    this.tween = tween(this.Fly).sequence(
      tween(this.Fly).to(10, { position: target }),
      tween(this.Fly).parallel(
        tween(this.FlyOpacity).to(2, { opacity: 0 }),
        tween(this.Fly).by(2, {
          position: v3(((940 * 2) / 10) * 2 * this.Fly.scale.x, 0, 0),
        })
      ),
      tween(this).call(() => {
        FlyCnicornAdDispearSignal.inst.dispatch();
        FlyCnicornAd.ShowTimeRest = 10;
        this.tween = null;
      })
    );
    this.tween.start();
  }

  unuse() {}

  onLoad() {
    this.initY = this.Fly.position.y;
    RemoveFlyCnicornSignal.inst.addOnce(() => {
      ShowFlyCnicornSignal.inst.removeTarget(this);
      CnicornWatchFailSignal.inst.removeTarget(this);
      this.node.removeFromParent();
      this.node.destroy();
    }, this);

    CnicornWatchFailSignal.inst.addListener(() => {
      FlyCnicornAd.ShowTimeRest = 10;
    }, this);

    FlyCnicornAd.ShowTimeRest = 10;
    ShowFlyCnicornSignal.inst.addListener(
      (origin: FlyOrigin, originY: number) => {
        console.log(" Show Cnicorn");
        if (this.tween) return;
        this.reuse(FlyOrigin.Right, this.initY);
      },
      this
    );
    if (CelerSDK.inst.isAndroidWeb == false && !CC_DEBUG) {
      RemoveFlyCnicornSignal.inst.dispatch();
    }
  }

  onAddTouch(ev: EventTouch) {
    if (this.tween) {
      this.tween.stop();
    }

    tween(this.FlyOpacity).to(0.2, { opacity: 0 }).start();

    FlyCnicornClickSignal.inst.dispatch();
  }

  update(dt: number) {}
}
