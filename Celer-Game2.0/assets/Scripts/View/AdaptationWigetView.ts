// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

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

@ccclass
export default class AdaptationWigetView extends cc.Component {
  @property({
    type: cc.Enum(AlignType),
  })
  alignType: AlignType = AlignType.Center;
  @property
  offset: cc.Vec3 = cc.v3(0, 0, 0);
  onLoad() {
    if (cc.sys.isMobile) {
      window.addEventListener("resize", this.onResize.bind(this));
    } else {
      cc.view.on("canvas-resize", this.onResize, this);
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
    let canvasSize = cc.view.getCanvasSize();
    // this.node.anchorX = 0.5;
    // this.node.anchorY = 1;
    this.node.setPosition(
      this.LocalZero.add(
        cc.v2(
          canvasSize.width / this.UseRatio / 2,
          canvasSize.height / this.UseRatio
        )
      ).add(cc.v2(0, -this.node.height * (1 - this.node.anchorY)))
    );
  }

  alignTopLeft() {
    let canvasSize = cc.view.getCanvasSize();
    // this.node.anchorX = 0;
    // this.node.anchorY = 1;
    this.node.setPosition(
      this.LocalZero.add(cc.v2(0, canvasSize.height / this.UseRatio)).add(
        cc.v2(
          this.node.width * this.node.anchorX,
          -this.node.height * (1 - this.node.anchorY)
        )
      )
    );
  }

  alignTopRight() {
    let canvasSize = cc.view.getCanvasSize();
    // this.node.anchorX = 1;
    // this.node.anchorY = 1;
    this.node.setPosition(
      this.LocalZero.add(
        cc.v2(
          canvasSize.width / this.UseRatio,
          canvasSize.height / this.UseRatio
        )
      ).add(
        cc.v2(
          -this.node.width * (1 - this.node.anchorX),
          -this.node.height * (1 - this.node.anchorY)
        )
      )
    );
  }

  alignBottom() {
    /** 实际尺寸 */
    let canvasSize = cc.view.getCanvasSize();
    // this.node.anchorX = 0.5;
    // this.node.anchorY = 0;
    this.node.setPosition(
      this.LocalZero.add(cc.v2(canvasSize.width / this.UseRatio / 2, 0)).add(
        cc.v2(0, this.node.height * this.node.anchorY)
      )
    );
  }

  alignBotLeft() {
    // this.node.anchorX = 0;
    // this.node.anchorY = 0;
    this.node.setPosition(
      this.LocalZero.add(
        cc.v2(
          this.node.width * this.node.width,
          this.node.height * this.node.height
        )
      )
    );
  }

  alignBotRight() {
    /** 实际尺寸 */
    let canvasSize = cc.view.getCanvasSize();
    this.node.anchorX = 1;
    this.node.anchorY = 0;
    this.node.setPosition(
      this.LocalZero.add(cc.v2(canvasSize.width / this.UseRatio, 0)).add(
        cc.v2(
          -this.node.width * (1 - this.node.anchorX),
          this.node.height * this.node.anchorY
        )
      )
    );
  }

  alignLeft() {}

  alignRight() {}

  alignCenter() {}

  get UseRatio() {
    /** 实际尺寸 */
    let canvasSize = cc.view.getCanvasSize();
    /** 设计尺寸 */
    let designSize = cc.view.getDesignResolutionSize();

    let withRatio = canvasSize.width / designSize.width;
    let heightRatio = canvasSize.height / designSize.height;

    let useRatio = Math.min(withRatio, heightRatio);
    return useRatio;
  }

  get LocalZero() {
    /** 实际尺寸 */
    let canvasSize = cc.view.getCanvasSize();
    /** 设计尺寸 */
    let designSize = cc.view.getDesignResolutionSize();

    let withRatio = canvasSize.width / designSize.width;
    let heightRatio = canvasSize.height / designSize.height;

    let useRatio = Math.min(withRatio, heightRatio);

    let worldZero = cc.v2(0, 0);

    if (withRatio < heightRatio) {
      // 适配宽度
      worldZero = cc.v2(
        0,
        -(canvasSize.height / useRatio - designSize.height) / 2
      );
    } else if (withRatio > heightRatio) {
      worldZero = cc.v2(
        -(canvasSize.width / useRatio - designSize.width) / 2,
        0
      );
    } else {
      // 等比 缩放
      worldZero = cc.v2(0, 0);
    }

    let localZero = this.node.parent.convertToNodeSpaceAR(worldZero);
    return localZero;
  }
}
