import { _decorator, Component, Node, EventTouch, UITransform, v3 } from "cc";
import { BaseSignal } from "../../Common/Signal";
import { GameStateController } from "../../Manager/GameStateController";
const { ccclass, property } = _decorator;

/** 球杆角度微调 */
export class PoleAdjustSignal extends BaseSignal {}
@ccclass("LineScaleView")
export class LineScaleView extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;
  @property(Node)
  LineScale: Node = null;

  private top: Node = null;
  private bot: Node = null;
  private offset: number = 0;
  private scale: number = 0.8;

  start() {
    this.top = this.LineScale.children[0];
    this.bot = this.LineScale.children[this.LineScale.children.length - 1];
    this.node.on(Node.EventType.TOUCH_MOVE, this.onMove, this);
  }

  onMove(ev: EventTouch) {
    if (GameStateController.inst.canInteractive()) {
      this.LineScale.translate(v3(0, ev.getDeltaY() * this.scale, 0));
      this.offset += ev.getDeltaY() * this.scale;

      if (Math.abs(this.offset) >= this.top.getComponent(UITransform).height) {
        if (this.offset > 0) {
          /** 向上 */

          this.top.setPosition(
            0,
            this.bot.position.y - this.bot.getComponent(UITransform).height,
            0
          );
          this.offset -= this.top.getComponent(UITransform).height;
        } else {
          /** 向下 */

          this.bot.setPosition(
            0,
            this.top.position.y + this.bot.getComponent(UITransform).height,
            0
          );

          this.offset += this.top.getComponent(UITransform).height;
        }

        this.LineScale.children.sort((a, b) => {
          return b.position.y - a.position.y;
        });

        this.top = this.LineScale.children[0];
        this.bot = this.LineScale.children[this.LineScale.children.length - 1];
      }

      PoleAdjustSignal.inst.dispatch(ev.getDeltaY());
    }
  }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
