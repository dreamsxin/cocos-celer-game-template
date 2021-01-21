// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Random } from "../Utils/Random";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SliderView extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property(cc.Node)
  Progress: cc.Node = null;

  @property(cc.Slider)
  Slider: cc.Slider = null;

  get Percent() {
    return this.Slider.progress;
  }

  set Percent(val: number) {
    this.Slider.progress = Random.clamp(val, 0, 1);
    this.Progress.width = this.Slider.node.width * this.Slider.progress;
  }

  private totalLength = 0;
  onLoad() {
    this.Slider.node.on("slide", this.onSlided, this);
    this.totalLength = this.Progress.width;
    this.Slider.node.width = this.totalLength;
  }

  private onSlided() {
    this.Progress.width = this.totalLength * this.Slider.progress;

    if (this.onProgress) {
      this.onProgress(this.Slider.progress);
    }
  }

  start() {}

  onProgress(percent: number) {}

  // update (dt) {}
}
