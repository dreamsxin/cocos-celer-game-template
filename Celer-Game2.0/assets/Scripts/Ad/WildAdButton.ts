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

export class HideWildAdButtonSignal extends BaseSignal {}
export class WildAdButtonClick extends BaseSignal {}

export class WildButtonReadySignal extends BaseSignal {}
export enum AdButtonType {
  Default,
}
@ccclass
export default class WildAdButton extends cc.Component {
  @property({
    type: cc.Enum(AdButtonType),
  })
  adType: AdButtonType = AdButtonType.Default;
  onLoad() {
    this.node.active =
      cc.sys.isMobile && cc.sys.isBrowser && cc.sys.os == cc.sys.OS_ANDROID;
    this.node.parent.active = this.node.active;
    this.node.scale = 0;

    WildButtonReadySignal.inst.addOnceOne((type: AdButtonType) => {
      if (this.adType != type && type != null) return;

      console.log(" Wild button :", this.node.active);
      if (this.node.active) {
        this.node.getComponent(cc.Button).transition =
          cc.Button.Transition.NONE;
        this.node.runAction(
          cc.sequence(
            cc.scaleTo(0.1, 1),
            cc.callFunc(() => {
              this.node.getComponent(cc.Button).transition =
                cc.Button.Transition.SCALE;
              this.node.getComponent(cc.Button).zoomScale = 1.2;
              this.node.on(
                cc.Node.EventType.TOUCH_END,
                () => {
                  WildAdButtonClick.inst.dispatch();
                },
                this
              );
            })
          )
        );
      }
    }, this);

    HideWildAdButtonSignal.inst.addListenerOne((type: AdButtonType) => {
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
