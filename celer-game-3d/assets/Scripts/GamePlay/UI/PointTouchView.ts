import { _decorator, Component, Node } from "cc";
import { BaseSignal } from "../../Common/Signal";
import { ButtonClickSignal } from "../../Signal/Signal";
const { ccclass, property } = _decorator;
/** 打开击球点界面 */
export class PointTouchSignal extends BaseSignal {}
@ccclass("PointTouchView")
export class PointTouchView extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;

  start() {
    // Your initialization goes here.
    this.node.on(
      Node.EventType.TOUCH_END,
      () => {
        ButtonClickSignal.inst.dispatch();
        PointTouchSignal.inst.dispatch();
      },
      this
    );
  }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
