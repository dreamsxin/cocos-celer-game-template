import { _decorator, Component, Node, Slider, UITransform } from "cc";
import { Random } from "../../Random";
const { ccclass, property } = _decorator;

@ccclass("SliderView")
export class SliderView extends Component {
  // LIFE-CYCLE CALLBACKS:

  @property(Node)
  Progress: Node = null;

  @property(Slider)
  Slider: Slider = null;

  get Percent() {
    return this.Slider.progress;
  }

  set Percent(val: number) {
    this.Slider.progress = Random.clamp(val, 0, 1);
    this.Progress.getComponent(UITransform).width =
      this.Slider.node.getComponent(UITransform).width * this.Slider.progress;
  }

  private totalLength = 0;
  onLoad() {
    this.Slider.node.on("slide", this.onSlided, this);
    this.totalLength = this.Progress.getComponent(UITransform).width;
    this.Slider.node.getComponent(UITransform).width = this.totalLength;
  }

  private onSlided() {
    this.Progress.getComponent(UITransform).width =
      this.totalLength * this.Slider.progress;

    if (this.onProgress) {
      this.onProgress(this.Slider.progress);
    }
  }

  start() {}

  onProgress(percent: number) {}

  // update (dt) {}
}
