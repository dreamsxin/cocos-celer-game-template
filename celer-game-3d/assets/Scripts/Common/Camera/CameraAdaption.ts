import { _decorator, Component, Node, sys, view, v3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CameraAdaption")
export class CameraAdaption extends Component {
  /* class member could be defined like this */
  // dummy = '';

  /* use `property` decorator if your want the member to be serializable */
  // @property
  // serializableDummy = 0;
  private defaultY: number = 0;
  start() {
    this.defaultY = this.node.position.y;
    if (sys.isMobile) {
      window.addEventListener("resize", this.onResize.bind(this));
    } else {
      view.on("canvas-resize", this.onResize, this);
    }

    this.onResize();
  }
  onResize() {
    /** 实际尺寸 */
    let canvasSize = view.getCanvasSize();
    /** 设计尺寸 */
    let designSize = view.getDesignResolutionSize();

    let designRatio = designSize.height / designSize.width;
    let useRatio = canvasSize.height / canvasSize.width;

    this.node.setPosition(
      v3(
        this.node.position.x,
        this.defaultY * Math.max(1, useRatio / designRatio),
        this.node.position.z
      )
    );
  }
  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
