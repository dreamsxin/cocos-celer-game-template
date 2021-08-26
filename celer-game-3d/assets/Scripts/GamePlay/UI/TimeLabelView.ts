import { _decorator, Component, Node, Label } from "cc";
import { Time } from "../../Common/Time";
import { CountDownSignal, UpdateTimeNumber } from "../../Signal/Signal";
const { ccclass, property } = _decorator;

@ccclass("TimeLabelView")
export class TimeLabelView extends Component {
  get Label() {
    return this.getComponent(Label);
  }

  private sec = 0;
  onLoad() {
    UpdateTimeNumber.inst.addListener(this.onTimeChanged, this);
  }

  onTimeChanged(time: number) {
    let timeStr = Time.timeFormat(time);

    if (this.node.name == "MinuteLabel") {
      this.Label.string = timeStr.split("/")[0];
    } else if (this.node.name == "SecondLabel") {
      this.Label.string = timeStr.split("/")[1];
    } else {
      this.Label.string = timeStr;
    }

    if (time > 30) {
    } else {
    }

    let secNew = Math.floor(time);
    if (
      secNew != this.sec &&
      (this.node.name == "MinuteLabel" ||
        (this.node.name != "MinuteLabel" && this.node.name != "SecondLabel"))
    ) {
      this.sec = secNew;
      if (this.sec <= 5) {
        CountDownSignal.inst.dispatch();
      }
    }
  }

  start() {}

  // update (dt) {}
}
