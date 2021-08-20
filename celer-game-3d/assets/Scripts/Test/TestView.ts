import { _decorator, Component, Node } from "cc";
import { TestSprite } from "./TestSprite";
const { ccclass, property } = _decorator;

@ccclass("TestView")
export class TestView extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;

  get View() {
    return this.node.getChildByName("Sprite").getComponent(TestSprite);
  }

  start() {
    // Your initialization goes here.
    this.node.on(
      Node.EventType.TOUCH_END,
      () => {
        if (this.View.node.active) {
          this.View.Hide();
        } else {
          this.View.Show();
        }
      },
      this
    );
  }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
