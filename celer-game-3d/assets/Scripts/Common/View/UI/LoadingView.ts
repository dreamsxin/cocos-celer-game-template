import { _decorator, Component, Node, v3, UIOpacity, Label, tween } from "cc";
import { UpdateInitLoadingSignal } from "../../../Signal/Signal";
import { BaseView } from "../BaseView";
import { LoadingViewMediator } from "./LoadingViewMediator";
const { ccclass, property } = _decorator;

@ccclass("LoadingView")
export class LoadingView extends BaseView {
  // LIFE-CYCLE CALLBACKS:

  get ProgressLabel() {
    return this.node.getChildByName("ProgressLabel").getComponent(Label);
  }

  get Loading() {
    return this.node.getChildByName("ae_loading1");
  }
  private percent = 0;

  private uiopacity: UIOpacity = null;
  get UIOpacity() {
    if (this.uiopacity == null) {
      this.uiopacity = this.addComponent(UIOpacity);
    }
    return this.uiopacity;
  }

  onLoad() {
    // this.ProgressLabel.node.active = CC_DEBUG;
    this.node.scale = v3(1, 1, 1);
    this.uiopacity.opacity = 255;
    this.BindMedaitor(LoadingViewMediator);
    UpdateInitLoadingSignal.inst.addListener((percentAdd: number) => {
      this.percent += percentAdd;
      this.percent = Math.min(1, this.percent);
      //   console.log(this.percent, " loaded :", percentAdd);
      this.ProgressLabel.string = (this.percent * 100).toFixed(0) + "%";
    }, this);
  }

  start() {}

  Hide(callback: () => void) {
    this.Loading.active = false;
    tween(this.UIOpacity).sequence(
      tween(this.UIOpacity).to(0.5, { opacity: 0 }),
      tween(this.UIOpacity).call(() => {
        this.node.active = false;
        callback();
      })
    );
  }
}
