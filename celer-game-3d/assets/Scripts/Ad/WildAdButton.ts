import {
  _decorator,
  Component,
  Node,
  Enum,
  sys,
  Vec3,
  Button,
  tween,
  v3,
} from "cc";

import {
  HideWildAdButtonSignal,
  WildAdButtonClick,
  WildButtonReadySignal,
} from "../Signal/Signal";
const { ccclass, property } = _decorator;
export enum AdButtonType {
  Default,
}
@ccclass("WildAdButton")
export class WildAdButton extends Component {
  @property({
    type: Enum(AdButtonType),
  })
  adType: AdButtonType = AdButtonType.Default;
  onLoad() {
    this.node.active =
      sys.isMobile && sys.isBrowser && sys.os == sys.OS_ANDROID;
    this.node.parent.active = this.node.active;
    this.node.scale = Vec3.ZERO;

    WildButtonReadySignal.inst.addOnce((type: AdButtonType) => {
      if (this.adType != type && type != null) return;

      console.log(" Wild button :", this.node.active);
      if (this.node.active) {
        this.node.getComponent(Button).transition = Button.Transition.NONE;

        tween(this.node)
          .sequence(
            tween(this.node).to(0.1, { scale: v3(1, 1, 1) }),
            tween(this.node).call(() => {
              this.node.getComponent(Button).transition =
                Button.Transition.SCALE;
              this.node.getComponent(Button).zoomScale = 1.2;
              this.node.on(
                Node.EventType.TOUCH_END,
                () => {
                  WildAdButtonClick.inst.dispatch();
                },
                this
              );
            })
          )
          .start();
      }
    }, this);

    HideWildAdButtonSignal.inst.addListener((type: AdButtonType) => {
      if (this.adType != type && type != null) return;
      this.node.active = false;
      this.node.parent.active = false;
      for (let child of this.node.parent.children) {
        if (child.active) {
          this.node.parent.active = true;
          break;
        }
      }
    }, this);
  }
}
