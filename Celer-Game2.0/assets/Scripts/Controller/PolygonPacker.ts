// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { gFactory } from "../Factory/GameFactory";
import { RotatePoint } from "../Utils/Cocos";
import { BaseSignal } from "../Utils/Signal";
import { SingleTon } from "../utils/ToSingleton";

export class GridEmployStateChangedSignal extends BaseSignal { }

/** 格子状态 */
export enum EmployState {
  /** 空白 */
  Free,
  /** 废弃 */
  Abandoned,
  /** 占用 */
  Employed,
}
/**
 * 格子对象
 */
export class Grid {
  private rect: cc.Rect;
  private id: string;
  private _i: number;
  private _j: number;
  /** 是否被占用 */
  private employState: EmployState;


  get Rect() {
    return this.rect;
  }

  get i() {
    return this._i;
  }

  get j() {
    return this._j;
  }

  get ID() {
    return this.id;
  }

  get State() {
    return this.employState;
  }

  set State(state: EmployState) {
    if (state != this.employState) {
      this.employState = state;
      GridEmployStateChangedSignal.inst.dispatchOne(this);
    }
  }

  constructor(rect: cc.Rect, i: number, j: number, isCreate: boolean) {
    this.rect = rect;
    this.id = "i:" + i + " - j:" + j;
    this._i = i;
    this._j = j;
    this.employState = EmployState.Free;
    if (isCreate) {
      CreateDebugGridSignal.inst.dispatchOne(this);
    }
  }

  removeSelf() {
    RemoveGridSignal.inst.dispatchOne(this);
  }
}

export class CreateDebugGridSignal extends BaseSignal { }

export class RemoveGridSignal extends BaseSignal { }

/**
 * 计算多边形的装箱摆放
 *
 * 1.从最低起点开始，按照格子计算
 * 2.最低起点上移，则清空上上轮起点一下的格子，因为下边已经填满不需要用到了
 *   同时上方创建新的格子
 *
 */
export class PolygonPacker extends SingleTon<PolygonPacker>() {
  /** 单位方格尺寸 */
  private gridSize: number = 10;
  /** 每次调节位移的步长 */
  private step: number = 10;
  /** 空白格子 */
  private freeGrid: Grid[] = [];
  /** 已放置的多边形 */
  private polygons: cc.Vec2[][] = [];
  /** 上一行放置多少个polygon */
  private lastHroizontalPlaceCount: number = 0;
  /** 这一行放置多少个 */
  private horizontalPlaceCount: number = 0;

  /** 初始容器大小 */
  private panelSize: cc.Size = cc.size(0, 0);
  /**水平个数 */
  private horizontalCount: number = 0;
  /** 初始垂直个数 */
  private verticalCount: number = 0;
  private showDebugGrid: boolean = CC_DEBUG;
  /** 摆放开始位置x */
  private startPositionX: number[] = [];
  /** 摆放开始位置y */
  private startPositionY: number[] = [];

  /**     node    */
  private borderLeft: cc.Node = null;
  private borderRight: cc.Node = null;
  private borderTop: cc.Node = null;
  private borderBot: cc.Node = null;
  /**
   *
   * 初始化格子
   * @param gridSize
   * @param panelSize
   */

  get DrawDebug() {
    return this.showDebugGrid && !CELER_X
  }

  get GridSize() {
    return this.gridSize;
  }

  private timer: any = {};
  private checkTime(key: string) {
    this.timer[key] = Date.now();
  }

  private dumpTime(key: string) {
    console.log(key, " cost ", Date.now() - this.timer[key], " ms");
  }

  init(
    gridSize: number,
    panelSize: cc.Size,
    left: cc.Node,
    right: cc.Node,
    top: cc.Node,
    bot: cc.Node
  ) {
    this.StartPositionX = 0;
    this.StartPositionY = 0;
    this.borderBot = bot;
    this.borderLeft = left;
    this.borderRight = right;
    this.borderTop = top;

    this.gridSize = gridSize;
    this.panelSize = panelSize;
    return new Promise<PolygonPacker>(
      (
        solve: (packer: PolygonPacker) => void,
        reject: (err: Error) => void
      ) => {
        if (this.showDebugGrid && !CELER_X) {
          gFactory
            .addObject("Grid", "/polygonData/Grid", 100)
            .then(() => {
              this.createGrid(true);
              solve(this);
            })
            .catch((err: Error) => {
              reject(err);
            });
        } else {
          // this.createGrid();
          solve(this);
        }
      }
    );
  }

  private createGrid(isCreateDebugGrid: boolean = false) {
    this.horizontalCount = this.panelSize.width / this.gridSize;
    this.verticalCount = this.panelSize.height / this.gridSize;
    for (let i = 0; i < this.verticalCount; i++) {
      for (let j = 0; j < this.horizontalCount; j++) {
        let rect = cc.rect(
          j * this.gridSize + this.gridSize / 2,
          i * this.gridSize + this.gridSize / 2,
          this.gridSize,
          this.gridSize
        );

        let grid = new Grid(rect, i, j, isCreateDebugGrid);

        this.freeGrid.push(grid);
      }
    }
  }

  /**
   * 获取经过变换的顶点数据
   * @param points
   * @param node
   * @returns
   */
  getTransPoint(points: cc.Vec2[], node: cc.Node) {
    let newPoints: cc.Vec2[] = [];
    for (let p of points) {
      let newP = cc.v2(p.x, p.y);
      RotatePoint(newP, node.rotation);
      newP.addSelf(node.position);
      newPoints.push(newP);
    }
    return newPoints;
  }

  /**
   * 检测格子是否被占用
   * @param points
   * @param node
   */
  private checkGridEmploy(points: cc.Vec2[], node: cc.Node) {

    this.checkTime("checkGridEmploy");
    let newPoints = this.getTransPoint(points, node);

    let pointxMax = 0;
    let pointyMax = 0;
    for (let point of newPoints) {
      pointxMax = Math.max(point.x, pointxMax);
      pointyMax = Math.max(point.y, pointyMax);
    }

    let loopCount = 0;
    for (let i = 0; i < this.freeGrid.length; i++) {
      let grid = this.freeGrid[i];
      if (grid.Rect.x > pointxMax) continue;
      if (grid.Rect.y > pointyMax) break;

      if (cc.Intersection.rectPolygon(grid.Rect, newPoints)) {
        grid.State = EmployState.Employed;
        this.freeGrid.splice(i, 1);
        i--;

        loopCount++;
        continue;
      }

      if (grid.Rect.x < pointxMax && grid.Rect.y < node.y) {
        grid.State = EmployState.Abandoned;
        this.freeGrid.splice(i, 1);
        i--;
        loopCount++;
        continue;
      }
      loopCount++;
    }

    console.log(" loop :", loopCount);
    this.dumpTime("checkGridEmploy");
  }

  /** 换行 */
  wrap(itemNode: cc.Node) {

    this.StartPositionX = 0;

    let pointyMin = 1000000000000000;

    for (let points of this.polygons) {
      let pointyMax = 0
      for (let point of points) {

        pointyMax = Math.max(point.y, pointyMax);
      }
      pointyMin = Math.min(pointyMin, pointyMax)
    }
    this.StartPositionY = pointyMin

    let delCount = this.lastHroizontalPlaceCount;
    this.lastHroizontalPlaceCount = this.horizontalPlaceCount;
    this.horizontalPlaceCount = 0;
    while (delCount-- > 0) {
      this.polygons.pop()
    }
    itemNode.x = this.StartX;
    itemNode.y = this.StartY;
  }

  /** 检测重叠 */
  checkBorder(itemNode: cc.Node, points: cc.Vec2[]) {
    this.checkTime("checkBorder");

    let newPoints = this.getTransPoint(points, itemNode);
    let isLeftContain = cc.Intersection.rectPolygon(
      this.borderLeft.getBoundingBox(),
      newPoints
    );

    let isRightContain = cc.Intersection.rectPolygon(
      this.borderRight.getBoundingBox(),
      newPoints
    );

    let isBotContain = cc.Intersection.rectPolygon(
      this.borderBot.getBoundingBox(),
      newPoints
    );
    let isTopContain = cc.Intersection.rectPolygon(
      this.borderTop.getBoundingBox(),
      newPoints
    );
    let loopCount = 0;
    while (
      (isLeftContain || isRightContain || isBotContain || isTopContain) &&
      loopCount++ < 1000
    ) {
      if (isLeftContain) {
        itemNode.x += this.step;
        if (isRightContain) {
          this.wrap(itemNode)
        }
      } else {
        if (isRightContain) {
          itemNode.x -= this.step;
        }
      }



      if (isBotContain) {
        itemNode.y += this.step;
      }

      if (isTopContain) {
        itemNode.y -= this.step;
      }

      newPoints = this.getTransPoint(points, itemNode);
      isLeftContain = cc.Intersection.rectPolygon(
        this.borderLeft.getBoundingBox(),
        newPoints
      );

      isRightContain = cc.Intersection.rectPolygon(
        this.borderRight.getBoundingBox(),
        newPoints
      );

      isBotContain = cc.Intersection.rectPolygon(
        this.borderBot.getBoundingBox(),
        newPoints
      );
      isTopContain = cc.Intersection.rectPolygon(
        this.borderTop.getBoundingBox(),
        newPoints
      );
    }

    // 改变了物品的transform
    this.instersectGrid(itemNode, points);

    this.dumpTime("checkBorder");
    let pointxMax = 0;
    let pointyMax = 0;
    newPoints = this.getTransPoint(points, itemNode);
    for (let point of newPoints) {
      pointxMax = Math.max(point.x, pointxMax);
      pointyMax = Math.max(point.y, pointyMax);
    }

    this.StartPositionX = pointxMax;

    this.polygons.unshift(newPoints);
    this.horizontalPlaceCount++
    this.checkGridEmploy(points, itemNode);
  }

  /**
   * 格子检测，并且调整物品的transform
   * @param itemNode
   * @param points
   */
  private instersectGrid(itemNode: cc.Node, points: cc.Vec2[]) {
    let isInsterect = true;

    let loopCount: number = 0;
    let maxLoop = 1000;


    while (isInsterect && loopCount++ < maxLoop) {
      let newPoints = this.getTransPoint(points, itemNode);
      isInsterect = false;
      if (this.polygons.length > 0 && cc.Intersection.polygonPolygon(this.polygons[0], newPoints)) {
        itemNode.x += this.step;
        isInsterect = true;

        let isRightContain = cc.Intersection.rectPolygon(
          this.borderRight.getBoundingBox(),
          newPoints
        );
        if (isRightContain) {
          this.wrap(itemNode)
          this.checkBorder(itemNode, points)
        }


      }
    }

    if (loopCount >= maxLoop) {
      console.error("instersectGrid loop error:", loopCount);
    }
  }

  get StartX() {
    if (!this.startPositionX || this.startPositionX.length <= 0) {
      return 0;
    } else {
      return this.startPositionX[0];
    }
  }

  set StartPositionX(x: number) {
    this.startPositionX.unshift(x);
    if (this.startPositionX.length > 2) {
      this.startPositionX.pop();
    }

    if (this.startPositionX.length == 2) {
    }
  }

  get StartY() {
    if (!this.startPositionY || this.startPositionY.length <= 0) {
      return 0;
    } else {
      return this.startPositionY[0];
    }
  }

  set StartPositionY(y: number) {
    this.startPositionY.unshift(y);
    if (this.startPositionY.length > 2) {
      this.startPositionY.pop();
    }

    if (this.startPositionY.length == 2) {
    }
  }
  private clearGrid(position: cc.Vec2) { }

  testCheck(points: cc.Vec2[], itemNode: cc.Node) {
    let newPoint = this.getTransPoint(points, itemNode);
    let insterect = false;

    for (let point of this.polygons) {
      if (cc.Intersection.polygonPolygon(point, newPoint)) {
        insterect = true;
        break;
      }
    }

    if (insterect) {
      itemNode.color = cc.Color.GREEN;
    } else {
      itemNode.color = cc.Color.WHITE;
    }
  }
}
