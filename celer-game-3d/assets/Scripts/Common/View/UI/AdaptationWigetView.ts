import {
  _decorator,
  Component,
  Node,
  Enum,
  sys,
  view,
  UITransform,
  v3,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;
export enum AlignType {
  Top,
  TopLeft,
  TopRight,
  Bottom,
  BotLeft,
  BotRight,
  Left,
  Right,
  Center,
}
@ccclass("AdaptationWigetView")
export class AdaptationWigetView extends Component {
  @property({
    type: Enum(AlignType),
  })
  alignType: AlignType = AlignType.Center;

  onLoad() {
    if (sys.isMobile) {
      window.addEventListener("resize", this.onResize.bind(this));
    } else {
      view.on("canvas-resize", this.onResize, this);
    }

    this.onResize();
  }

  onResize() {
    switch (this.alignType) {
      case AlignType.Top:
        this.alignTop();
        break;
      case AlignType.TopLeft:
        this.alignTopLeft();
        break;
      case AlignType.TopRight:
        this.alignTopRight();
        break;
      case AlignType.Bottom:
        this.alignBottom();
        break;
      case AlignType.BotLeft:
        this.alignBotLeft();
        break;
      case AlignType.BotRight:
        this.alignBotRight();
        break;
      case AlignType.Left:
        this.alignLeft();
        break;
      case AlignType.Right:
        this.alignRight();
        break;
      case AlignType.Center:
        this.alignCenter();
        break;
    }
  }

  alignTop() {
    /** 实际尺寸 */
    let canvasSize = view.getCanvasSize();
    this.node.getComponent(UITransform).anchorX = 0.5;
    this.node.getComponent(UITransform).anchorY = 1;
    this.node.setPosition(
      this.LocalZero.add(
        v3(
          canvasSize.width / this.UseRatio / 2,
          canvasSize.height / this.UseRatio
        )
      )
    );
  }

  alignTopLeft() {
    let canvasSize = view.getCanvasSize();
    this.node.getComponent(UITransform).anchorX = 0;
    this.node.getComponent(UITransform).anchorY = 1;
    this.node.setPosition(
      this.LocalZero.add(v3(0, canvasSize.height / this.UseRatio))
    );
  }

  alignTopRight() {
    let canvasSize = view.getCanvasSize();
    this.node.getComponent(UITransform).anchorX = 1;
    this.node.getComponent(UITransform).anchorY = 1;
    this.node.setPosition(
      this.LocalZero.add(
        v3(canvasSize.width / this.UseRatio, canvasSize.height / this.UseRatio)
      )
    );
  }

  alignBottom() {
    /** 实际尺寸 */
    let canvasSize = view.getCanvasSize();
    this.node.getComponent(UITransform).anchorX = 0.5;
    this.node.getComponent(UITransform).anchorY = 0;
    this.node.setPosition(
      this.LocalZero.add(v3(canvasSize.width / this.UseRatio / 2, 0))
    );
  }

  alignBotLeft() {
    this.node.getComponent(UITransform).anchorX = 0;
    this.node.getComponent(UITransform).anchorY = 0;
    this.node.setPosition(this.LocalZero);
  }

  alignBotRight() {
    /** 实际尺寸 */
    let canvasSize = view.getCanvasSize();
    this.node.getComponent(UITransform).anchorX = 1;
    this.node.getComponent(UITransform).anchorY = 0;
    this.node.setPosition(
      this.LocalZero.add(v3(canvasSize.width / this.UseRatio, 0))
    );
  }

  alignLeft() {}

  alignRight() {}

  alignCenter() {}

  get UseRatio() {
    /** 实际尺寸 */
    let canvasSize = view.getCanvasSize();
    /** 设计尺寸 */
    let designSize = view.getDesignResolutionSize();

    let withRatio = canvasSize.width / designSize.width;
    let heightRatio = canvasSize.height / designSize.height;

    let useRatio = Math.min(withRatio, heightRatio);
    return useRatio;
  }

  get LocalZero() {
    /** 实际尺寸 */
    let canvasSize = view.getCanvasSize();
    /** 设计尺寸 */
    let designSize = view.getDesignResolutionSize();

    let withRatio = canvasSize.width / designSize.width;
    let heightRatio = canvasSize.height / designSize.height;

    let useRatio = Math.min(withRatio, heightRatio);

    let worldZero = v3(0, 0, 0);

    if (withRatio < heightRatio) {
      // 适配宽度
      worldZero = v3(
        0,
        -(canvasSize.height / useRatio - designSize.height) / 2,
        0
      );
    } else if (withRatio > heightRatio) {
      worldZero = v3(
        -(canvasSize.width / useRatio - designSize.width) / 2,
        0,
        0
      );
    } else {
      // 等比 缩放
      worldZero = v3(0, 0, 0);
    }

    let localZero: Vec3 = v3(0, 0);
    this.node.parent.inverseTransformPoint(localZero, worldZero);
    return localZero;
  }
}
