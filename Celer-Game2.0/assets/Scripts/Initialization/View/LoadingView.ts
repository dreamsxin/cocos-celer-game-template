// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "../../View/BaseView";
import { UpdateInitLoadingSignal } from "../Facade/InitialFacade";
import LoadingPageMediator from "./LoadingPageMediator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

  get ProgressLabel() {
    return this.node.getChildByName("ProgressLabel").getComponent(cc.Label);
  }

  get Loading() {
    return this.node.getChildByName("ae_loading1");
  }
  private percent = 0;

  onLoad() {
    // this.ProgressLabel.node.active = CC_DEBUG;
    this.node.scale = 1;
    this.node.opacity = 255;
    this.BindMedaitor(LoadingPageMediator);
    UpdateInitLoadingSignal.inst.addListenerOne((percentAdd: number) => {
      this.percent += percentAdd;
      this.percent = Math.min(1, this.percent);
      //   console.log(this.percent, " loaded :", percentAdd);
      this.ProgressLabel.string = (this.percent * 100).toFixed(0) + "%";
    }, this);
  }

  start() {}

  Hide(callback: () => void) {
    this.Loading.active = false;
    this.node.runAction(
      cc.sequence(
        cc.fadeOut(0.5),
        cc.callFunc(() => {
          this.node.active = false;
          callback();
        })
      )
    );
  }

  // update (dt) {}
}
