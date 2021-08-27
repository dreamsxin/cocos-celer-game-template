import {
  _decorator,
  Component,
  Node,
  EventTouch,
  ProgressBar,
  tween,
  Tween,
  v3,
} from "cc";
import { BaseSignal } from "../../Common/Signal";
const { ccclass, property } = _decorator;

/** 击球 */
export class ShotSignal extends BaseSignal {}
@ccclass("PoleTouchView")
export class PoleTouchView extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;

  @property(ProgressBar)
  PowerBar: ProgressBar = null;

  @property(Node)
  Pole: Node = null;

  private startY: number = 0;
  private endY: number = -602.359;
  private scale: number = 1;

  start() {
    // Your initialization goes here.
    this.PowerBar.progress = 0;
    this.startY = this.Pole.position.y;

    this.node.on(Node.EventType.TOUCH_START, this.onStart, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onEnd, this);
    this.node.on(Node.EventType.TOUCH_END, this.onEnd, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onMove, this);
  }

  onMove(ev: EventTouch) {
    let offset = ev.getDeltaY() * this.scale;
    if (this.Pole.position.y + offset <= this.endY) {
      offset = this.endY - this.Pole.position.y;
    }

    if (offset + this.Pole.position.y >= this.startY) {
      offset = this.startY - this.Pole.position.y;
    }

    this.Pole.translate(v3(0, offset, 0));
    this.PowerBar.progress =
      (this.Pole.position.y - this.startY) / (this.endY - this.startY);
  }

  onStart(ev: EventTouch) {
    Tween.stopAllByTarget(this.Pole);
  }

  onEnd(ev: EventTouch) {
    ShotSignal.inst.dispatch(this.PowerBar.progress);
    tween(this.Pole)
      .to(
        0.05,
        {
          position: v3(this.Pole.position.x, this.startY, this.Pole.position.z),
        },
        { easing: "bounceInOut" }
      )
      .start();
    this.PowerBar.progress = 0;
  }
  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
