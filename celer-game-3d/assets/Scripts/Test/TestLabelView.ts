import { _decorator, Component, Node } from "cc";
import NumberChangedView from "../Common/View/UI/NumberChangedView";
const { ccclass, property } = _decorator;

@ccclass("TestLabelView")
export class TestLabelView extends NumberChangedView {
  private score = 0;
  onLoad() {
    super.onLoad();

    this.node.on(
      Node.EventType.TOUCH_END,
      () => {
        this.onNumberChanged((this.score += 100));
      },
      this
    );
  }
}
