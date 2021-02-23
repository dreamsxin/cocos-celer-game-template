// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayModelProxy } from "../../../Model/PlayModelProxy";
import { CelerSDK } from "../../../Utils/Celer/CelerSDK";
import FrameAniBase from "../../../Utils/FrameAniBase";
import { BaseSignal } from "../../../Utils/Signal";
import ToturialLayer from "../new/ToturialLayer";

const { ccclass, property } = cc._decorator;

export class ShowDrawAniamtionSignal extends BaseSignal {}
@ccclass
export default class DrawAnimation extends FrameAniBase {
  onLoad() {
    super.onLoad();

    ShowDrawAniamtionSignal.inst.addListenerOne((show: boolean) => {
      this.node.active = show;
      this.node.getChildByName("DrawTipAnimation").active =
        PlayModelProxy.inst.isOnTutorial;
    }, this);
    setTimeout(() => {
      this.node.active = false;
    }, 0);

    ToturialLayer.AddToturialStep(
      5,
      this.node,
      null,
      false,
      () => {},
      () => {
        ShowDrawAniamtionSignal.inst.dispatchOne(true);
      },
      () => {},
      false
    );
  }
}
