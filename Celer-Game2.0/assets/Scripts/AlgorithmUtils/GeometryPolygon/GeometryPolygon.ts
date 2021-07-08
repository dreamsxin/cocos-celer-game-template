import { RoundEndType } from "../../Controller/GameStateController";
import { Random_ID, Random_Pool } from "../../table";
import { RotatePoint } from "../../Utils/Cocos";

/** 计算多边形的面积 */
export function polygonArea(points: cc.Vec2[]) {
  if (points.length <= 2) return 0;
  let area0 = 0;
  for (let i = 0; i < points.length; ++i) {
    let j = (i + 1) % points.length;
    area0 += points[i].x * points[j].y;
    area0 -= points[i].y * points[j].x;
  }
  return 0.5 * Math.abs(area0);
}

/** 判断顶点是否是凹顶点 */
export function concaveJudgement(point: cc.Vec2, originPoints: cc.Vec2[]) {
  let newPoints: cc.Vec2[] = [];
  let i = 0;
  for (let p of originPoints) {
    if (p.x != point.x || p.y != point.y) {
      newPoints.push(p);
    } else {
      newPoints = newPoints.concat(
        originPoints.slice(i + 1, originPoints.length - 1)
      );
      break;
    }
    i++;
  }
  return cc.Intersection.pointInPolygon(point, newPoints);
}

/**
 * 计算两条线段的交点
 * @param a1
 * @param a2
 * @param b1
 * @param b2
 * @param out
 * @returns
 */
export function segementIntersection(
  a: cc.Vec2,
  b: cc.Vec2,
  c: cc.Vec2,
  d: cc.Vec2
): cc.Vec2 {
  /** 1 解线性方程组, 求线段交点. **/
  // 如果分母为0 则平行或共线, 不相交
  let denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
  if (denominator === 0) {
    return null;
  }
  // 线段所在直线的交点坐标 (x , y)
  let x =
    ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
      (b.y - a.y) * (d.x - c.x) * a.x -
      (d.y - c.y) * (b.x - a.x) * c.x) /
    denominator;
  let y =
    -(
      (b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
      (b.x - a.x) * (d.y - c.y) * a.y -
      (d.x - c.x) * (b.y - a.y) * c.y
    ) / denominator;
  /** 2 判断交点是否在两条线段上 **/
  if (
    // 交点在线段1上
    (x - a.x) * (x - b.x) <= 0 &&
    (y - a.y) * (y - b.y) <= 0 &&
    // 且交点也在线段2上
    (x - c.x) * (x - d.x) <= 0 &&
    (y - c.y) * (y - d.y) <= 0
  ) {
    // 返回交点p

    return cc.v2(x, y);
  }
  //否则不相交
  return null;
}
/**
 * 返回两个相交多边形的多边形区域
 * @param polygon0
 * @param polygon1
 * @returns  Polygon
 */
export function intersectPolygon(
  polygon0: GeometryPolygon,
  polygon1: GeometryPolygon
): GeometryPolygon {
  let interPolygon = new GeometryPolygon([], "", null, null);

  for (let point of polygon0.ExpendPoints) {
    if (cc.Intersection.pointInPolygon(point, polygon1.Points)) {
      interPolygon.addPoint(point);
    }
  }

  for (let point of polygon1.ExpendPoints) {
    if (cc.Intersection.pointInPolygon(point, polygon0.Points)) {
      interPolygon.addPoint(point);
    }
  }

  for (let i = 0; i < polygon0.ExpendPoints.length; ++i) {
    let p00 = polygon0.ExpendPoints[i];
    let p01 = polygon0.ExpendPoints[(i + 1) % polygon0.ExpendPoints.length];
    for (let j = 0; j < polygon1.ExpendPoints.length; ++j) {
      let p10 = polygon1.ExpendPoints[j];
      let p11 = polygon1.ExpendPoints[(j + 1) % polygon1.ExpendPoints.length];
      let interPoint = segementIntersection(p00, p01, p10, p11);
      if (interPoint) {
        interPolygon.addPoint(interPoint);
      }
    }
  }

  interPolygon.update();
  interPolygon.orderByPointAngle();
  return interPolygon.Points.length > 0 ? interPolygon : null;
}

/**
 * 多边形类
 */
export class GeometryPolygon {
  public isUpdate: boolean = false;
  /** 初始的未经变换的顶点 */
  private originPoints: cc.Vec2[] = [];
  private originPointsBackup: cc.Vec2[] = [];
  /** 初始的矩形包围盒 */
  private originBoundingBox: cc.Rect = cc.rect(0, 0, 0, 0);
  /** 经过一系列变换后的顶点 */
  private currentPoints: cc.Vec2[] = [];
  /** 初始的矩形包围盒 */
  private currentBoundingBox: cc.Rect = cc.rect(0, 0, 0, 0);
  /** 源顶点外扩*/
  private expendOriginPoints: cc.Vec2[] = [];
  /**  变换后的顶点外扩*/
  private expendCurrentPoints: cc.Vec2[] = [];
  /** 外扩后的包围盒 */
  private expendBoundingBox: cc.Rect = cc.rect(0, 0, 0, 0);
  /** 面积*/
  private area: number = 0;
  /** 变换后中心点*/
  private center: cc.Vec2 = cc.v2(0, 0);
  /** 源中心点*/
  private originCenter: cc.Vec2 = cc.v2(0, 0);
  /** 变换的位移*/
  private position: cc.Vec2 = cc.v2(0, 0);
  /** 旋转角度*/
  private rotation: number = 0;
  /** 标识*/
  private id: string = "";
  private expendSize: number = null;

  private type: Random_ID;
  private subType: Random_Pool;

  private inertia: number = 0;
  /** 变换后的边界*/
  private border: {
    top: cc.Vec2;
    bot: cc.Vec2;
    left: cc.Vec2;
    right: cc.Vec2;
  } = {
    top: cc.v2(0, cc.macro.MIN_ZINDEX),
    bot: cc.v2(0, cc.macro.MAX_ZINDEX),
    left: cc.v2(cc.macro.MAX_ZINDEX, 0),
    right: cc.v2(cc.macro.MIN_ZINDEX, 0),
  };

  /** 外扩后的边界*/
  private expendBorder: {
    top: cc.Vec2;
    bot: cc.Vec2;
    left: cc.Vec2;
    right: cc.Vec2;
  } = {
    top: cc.v2(0, cc.macro.MIN_ZINDEX),
    bot: cc.v2(0, cc.macro.MAX_ZINDEX),
    left: cc.v2(cc.macro.MAX_ZINDEX, 0),
    right: cc.v2(cc.macro.MIN_ZINDEX, 0),
  };

  /** 源顶点的边界 */
  private originBorder: {
    top: cc.Vec2;
    bot: cc.Vec2;
    left: cc.Vec2;
    right: cc.Vec2;
  } = {
    top: cc.v2(0, cc.macro.MIN_ZINDEX),
    bot: cc.v2(0, cc.macro.MAX_ZINDEX),
    left: cc.v2(cc.macro.MAX_ZINDEX, 0),
    right: cc.v2(cc.macro.MIN_ZINDEX, 0),
  };

  get SubType() {
    return this.subType;
  }

  get Type() {
    return this.type;
  }

  constructor(
    points: Array<{
      x: number;
      y: number;
    }>,
    id: string = "",
    type: Random_ID,
    subType: Random_Pool,
    isClearConcavePoint: boolean = true
  ) {
    this.type = type;
    this.subType = subType;
    this.id = id;
    for (let point of points) {
      this.originPoints.push(cc.v2(point.x, point.y));
      this.originPointsBackup.push(cc.v2(point.x, point.y));
    }

    if (isClearConcavePoint) {
      this.clearConcavePoints();
    } else {
      this.update();
    }

    this.inertia = this.getInertia();
  }

  get Inertia() {
    return this.inertia;
  }

  private getInertia() {
    let numerator = 0,
      denominator = 0,
      v = this.Points,
      cur: cc.Vec2,
      next: cc.Vec2,
      cross: number;

    for (let n = 0; n < v.length; n++) {
      cur = v[n].sub(this.position, cur);
      next = v[(n + 1) % v.length].sub(this.position, next);

      cross = Math.abs(cur.cross(next));
      numerator += cross * (cur.dot(cur) + cur.dot(next) + next.dot(next));
      denominator += cross;
    }

    return (1 / 6) * (numerator / denominator);
  }

  /** 添加顶点 */
  addPoint(point: cc.Vec2, isUpdateImmediately: boolean = false) {
    this.hasClearConcave = false;
    this.originPoints.push(point);
    if (isUpdateImmediately) {
      this.update();
    }
  }

  /** 更新初始中心点 */
  updateOriginCenter() {
    this.originCenter = cc.v2(0, 0);
    let originPoints = this.OriginPoints;
    for (let i = 0; i < originPoints.length; i++) {
      this.originCenter.x += originPoints[i].x;
      this.originCenter.y += originPoints[i].y;
    }
    this.originCenter.x /= originPoints.length;
    this.originCenter.y /= originPoints.length;
  }

  private hasClearConcave: boolean = false;
  /** 去除凹顶点 */
  clearConcavePoints() {
    if (this.hasClearConcave) return;

    while (true) {
      let concaveCount = 0;
      for (let i = 0; i < this.originPoints.length; i++) {
        let point = this.originPoints[i];
        if (concaveJudgement(point, this.originPoints)) {
          concaveCount++;
          this.originPoints.splice(i, 1);
          i--;
        }
      }
      if (concaveCount == 0) break;
    }
    this.hasClearConcave = true;
    this.update();
  }

  /** 更新所有 */
  update() {
    this.updateOriginBorder();
    this.updateOriginCenter();
    this.updatePoints();
    this.area = polygonArea(this.originPoints);
  }

  /**
   * 绕某一点旋转
   * @param angle
   * @param center
   */
  rotateByAroundPoint(angle: number, center: cc.Vec2) {
    this.rotation = 0;
    let newPoints = [];

    for (let p of this.currentPoints) {
      let newP = cc.v2(p.x, p.y);
      RotatePoint(newP, angle, center);
      newPoints.push(newP);
    }

    if (this.expendSize != null) {
      this.expend();
    }
  }

  /**  位移 */
  moveBy(x: number, y: number) {
    this.position.x += x;
    this.position.y += y;
    this.updatePoints();
    if (this.expendSize != null) {
      this.expend();
    }
  }

  moveTo(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    this.updatePoints();
    if (this.expendSize != null) {
      this.expend();
    }
  }

  /** 旋转 */
  rotateTo(angle: number) {
    this.rotation = angle;
    this.updatePoints();
    if (this.expendSize != null) {
      this.expend();
    }
  }

  rotateBy(angle: number) {
    this.rotation += angle;
    this.updatePoints();
    if (this.expendSize != null) {
      this.expend();
    }
  }

  /** 外扩边界 */
  expend(size?: number) {
    if (size != null) {
      this.expendSize = size;
    } else {
      size = this.expendSize || 0;
    }

    this.clearConcavePoints();
    /** 拓展变换后的顶点 */
    this.expendCurrentPoints.length = 0;

    for (let i = 0; i < this.Points.length; i++) {
      let point = this.Points[i];

      let expPoint = cc.v2(0, 0);
      if (point.x == this.center.x) {
        expPoint.x = point.x;
        if (point.y > this.center.y) {
          expPoint.y = point.y + size;
        } else {
          expPoint.y = point.y - size;
        }
      } else if (point.y == this.center.y) {
        expPoint.y = point.y;
        if (point.x > this.center.x) {
          expPoint.x = point.x + size;
        } else {
          expPoint.x = point.x - size;
        }
      } else {
        let k = (point.y - this.center.y) / (point.x - this.center.x);
        let rad = Math.atan(k);
        if (point.x > this.center.x) {
          expPoint.x = point.x + Math.abs(Math.cos(rad)) * size;
        } else {
          expPoint.x = point.x - Math.abs(Math.cos(rad)) * size;
        }
        if (point.y > this.center.y) {
          expPoint.y = point.y + Math.abs(Math.sin(rad)) * size;
        } else {
          expPoint.y = point.y - Math.abs(Math.sin(rad)) * size;
        }
      }

      this.expendCurrentPoints.push(expPoint);
    }

    this.updateExpendBorder();

    /** 拓展源 顶点 */
    this.expendOriginPoints.length = 0;

    for (let j = 0; j < this.OriginPoints.length; j++) {
      let point = this.OriginPoints[j];

      let expPoint = cc.v2(0, 0);
      if (point.x == this.originCenter.x) {
        expPoint.x = point.x;
        if (point.y > this.originCenter.y) {
          expPoint.y = point.y + size;
        } else {
          expPoint.y = point.y - size;
        }
      } else if (point.y == this.originCenter.y) {
        expPoint.y = point.y;
        if (point.x > this.originCenter.x) {
          expPoint.x = point.x + size;
        } else {
          expPoint.x = point.x - size;
        }
      } else {
        let k =
          (point.y - this.originCenter.y) / (point.x - this.originCenter.x);
        let rad = Math.atan(k);
        if (point.x < this.originCenter.x) {
          expPoint.x = point.x - Math.abs(Math.cos(rad)) * size;
        } else {
          expPoint.x = point.x + Math.abs(Math.cos(rad)) * size;
        }

        if (point.y < this.originCenter.y) {
          expPoint.y = point.y - Math.abs(Math.sin(rad)) * size;
        } else {
          expPoint.y = point.y + Math.abs(Math.sin(rad)) * size;
        }
      }

      this.expendOriginPoints.push(expPoint);
    }
  }

  /** 重置变换 */
  resetTransform() {
    this.position.x = 0;
    this.position.y = 0;
    this.rotation = 0;
    this.updatePoints();
    if (this.expendSize != null) {
      this.expend();
    }
  }

  /**
   * 更新源顶点的边界顶点
   */
  updateOriginBorder() {
    this.originBorder = {
      top: cc.v2(0, cc.macro.MIN_ZINDEX),
      bot: cc.v2(0, cc.macro.MAX_ZINDEX),
      left: cc.v2(cc.macro.MAX_ZINDEX, 0),
      right: cc.v2(cc.macro.MIN_ZINDEX, 0),
    };
    let points = this.OriginPoints;
    for (let point of points) {
      if (this.originBorder.top.y < point.y) {
        this.originBorder.top = cc.v2(point.x, point.y);
      }

      if (this.originBorder.bot.y > point.y) {
        this.originBorder.bot = cc.v2(point.x, point.y);
      }

      if (this.originBorder.left.x > point.x) {
        this.originBorder.left = cc.v2(point.x, point.y);
      }

      if (this.originBorder.right.x < point.x) {
        this.originBorder.right = cc.v2(point.x, point.y);
      }
    }

    this.originBoundingBox.x = this.originBorder.left.x;
    this.originBoundingBox.y = this.originBorder.bot.y;
    this.originBoundingBox.width = Math.abs(
      this.originBorder.right.x - this.originBorder.left.x
    );
    this.originBoundingBox.height = Math.abs(
      this.originBorder.top.y - this.originBorder.bot.y
    );
  }

  get OriginConcavePoints() {
    return this.originPointsBackup;
  }

  /**  更新顶点的边界顶点 */
  updateBorder() {
    this.border = {
      top: cc.v2(0, cc.macro.MIN_ZINDEX),
      bot: cc.v2(0, cc.macro.MAX_ZINDEX),
      left: cc.v2(cc.macro.MAX_ZINDEX, 0),
      right: cc.v2(cc.macro.MIN_ZINDEX, 0),
    };
    let points = this.Points;
    for (let point of points) {
      if (this.border.top.y < point.y) {
        this.border.top = cc.v2(point.x, point.y);
      }

      if (this.border.bot.y > point.y) {
        this.border.bot = cc.v2(point.x, point.y);
      }

      if (this.border.left.x > point.x) {
        this.border.left = cc.v2(point.x, point.y);
      }

      if (this.border.right.x < point.x) {
        this.border.right = cc.v2(point.x, point.y);
      }
    }

    this.currentBoundingBox.x = this.border.left.x;
    this.currentBoundingBox.y = this.border.bot.y;
    this.currentBoundingBox.width = Math.abs(
      this.border.right.x - this.border.left.x
    );
    this.currentBoundingBox.height = Math.abs(
      this.border.top.y - this.border.bot.y
    );
  }

  /**  更新外扩顶点的边界顶点 */
  updateExpendBorder() {
    this.expendBorder = {
      top: cc.v2(0, cc.macro.MIN_ZINDEX),
      bot: cc.v2(0, cc.macro.MAX_ZINDEX),
      left: cc.v2(cc.macro.MAX_ZINDEX, 0),
      right: cc.v2(cc.macro.MIN_ZINDEX, 0),
    };
    let points = this.expendCurrentPoints;
    for (let point of points) {
      if (this.expendBorder.top.y < point.y) {
        this.expendBorder.top = cc.v2(point.x, point.y);
      }

      if (this.expendBorder.bot.y > point.y) {
        this.expendBorder.bot = cc.v2(point.x, point.y);
      }

      if (this.expendBorder.left.x > point.x) {
        this.expendBorder.left = cc.v2(point.x, point.y);
      }

      if (this.expendBorder.right.x < point.x) {
        this.expendBorder.right = cc.v2(point.x, point.y);
      }
    }

    this.expendBoundingBox.x = this.expendBorder.left.x;
    this.expendBoundingBox.y = this.expendBorder.bot.y;
    this.expendBoundingBox.width = Math.abs(
      this.expendBorder.right.x - this.expendBorder.left.x
    );
    this.expendBoundingBox.height = Math.abs(
      this.expendBorder.top.y - this.expendBorder.bot.y
    );
  }

  /** 外扩后的边界 */
  get ExpendBorder() {
    return this.expendBorder;
  }

  /** 外扩后的包围盒 */
  get ExpendBox() {
    return this.expendBoundingBox;
  }

  /** 外扩后的包围盒点集 */
  get ExpendBoxPoints() {
    let box = this.expendBoundingBox;
    return [
      cc.v2(box.x, box.y),
      cc.v2(box.x + box.width, box.y),
      cc.v2(box.x + box.width, box.y + box.height),
      cc.v2(box.x, box.y + box.height),
    ];
  }

  /** 边界点集 */
  get Border() {
    return this.border;
  }
  /** 初始边界点集 */
  get OriginBorder() {
    return this.originBorder;
  }
  /** 唯一标识 */
  get ID() {
    return this.id;
  }
  /** 顶点集 */
  get Points() {
    return this.currentPoints;
  }
  /** 初始顶点集 */
  get OriginPoints() {
    return this.originPoints;
  }
  /**  外扩后的初始顶点*/
  get ExpendPoints() {
    if (this.expendCurrentPoints.length <= 0) {
      this.expend();
    }
    return this.expendCurrentPoints;
  }
  /**  外扩后的初始顶点*/
  get ExpendOrginPoints() {
    if (this.expendOriginPoints.length <= 0) {
      this.expend();
    }
    return this.expendOriginPoints;
  }
  /**  面积*/
  get Area() {
    return this.area;
  }
  /**  顶点的中心*/
  get Center() {
    return this.center;
  }

  /** 初始顶点的中心 */
  get OriginCenter() {
    return this.originCenter;
  }

  /** 旋转角度 */
  get Rotation() {
    return this.rotation;
  }

  /** 累计变换的位移 */
  get Position() {
    return this.position;
  }

  /** 顶点包围盒 */
  get BoundingBox() {
    return this.currentBoundingBox;
  }

  /** 初始顶点的包围盒 */
  get OriginBoundingBox() {
    return this.originBoundingBox;
  }

  /** 顶点包围盒的点集 */
  get BoundingPoints() {
    let box = this.currentBoundingBox;
    return [
      cc.v2(box.x, box.y),
      cc.v2(box.x + box.width, box.y),
      cc.v2(box.x + box.width, box.y + box.height),
      cc.v2(box.x, box.y + box.height),
    ];
  }

  /** 初始顶点包围盒的点集 */
  get OriginBoundingPoints() {
    let box = this.originBoundingBox;
    return [
      cc.v2(box.x, box.y),
      cc.v2(box.x + box.width, box.y),
      cc.v2(box.x + box.width, box.y + box.height),
      cc.v2(box.x, box.y + box.height),
    ];
  }

  /**  更新变换后的顶点 */
  private updatePoints() {
    this.currentPoints.length = 0;
    for (let p of this.originPoints) {
      let newP = cc.v2(p.x, p.y);
      RotatePoint(newP, this.rotation);
      newP.addSelf(this.position);
      this.currentPoints.push(newP);
    }

    this.center = cc.v2(0, 0);
    let points = this.currentPoints;
    for (let i = 0; i < points.length; i++) {
      this.center.x += points[i].x;
      this.center.y += points[i].y;
    }
    this.center.x /= points.length;
    this.center.y /= points.length;

    this.updateBorder();
  }

  /**  */
  orderByPointAngle() {}

  /** 退火算法求解函数 */
  getAnnealingValue(x: number) {
    this.rotateTo(x);

    let botPoint = cc.v2(10000, 10000);
    for (let point of this.Points) {
      if (point.y < botPoint.y) {
        botPoint.x = point.x;
        botPoint.y = point.y;
      }
    }

    return this.center.y - botPoint.y;
  }

  get GravityH() {
    return this.center.y - this.expendBorder.bot.y;
  }
}
