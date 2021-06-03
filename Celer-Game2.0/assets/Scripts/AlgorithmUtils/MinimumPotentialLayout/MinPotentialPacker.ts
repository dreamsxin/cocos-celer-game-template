import { Polygon } from "../../Physic2DEngine/body/polygon";
import { Approx, Distance } from "../../Utils/Cocos";
import { HashMap } from "../../Utils/HashMap";
import { Random } from "../../Utils/Random";
import { BasePacker } from "../BasePacker";
import {
  intersectPolygon,
  GeometryPolygon,
} from "../GeometryPolygon/GeometryPolygon";

/** 最小势能布局 */
export class MinPotentialPacker extends BasePacker {
  /** 当前行数 */
  private warpCount: number = 0;
  /**每一行左右的数量 */
  private sideCount: HashMap<
    number,
    { left: GeometryPolygon[]; right: GeometryPolygon[] }
  > = new HashMap();

  /** 总共放置的个数 */
  private count: number = 0;

  /** 当前的下边界 */
  private borderY: number = 0;

  pack() {
    this.warpCount = 0;
    this.sideCount.add(this.warpCount, { left: [], right: [] });
    this.borderY = 0;
    this.startPack();
  }

  public startPack(height: number = 1920 * 1.5 /*1920 * 1.5*/) {
    let startTime: number = Date.now();

    this.packeds().length = 0;
    let currentCount = 0;
    while (this.height <= height) {
      let sideCount = this.sideCount.get(this.warpCount);

      let leftX: number = 0;
      let rightX: number = this.width;

      if (sideCount.left.length > 0) {
        leftX = sideCount.left[0].ExpendBorder.right.x;
      }

      if (sideCount.right.length > 0) {
        rightX = sideCount.right[0].ExpendBorder.left.x;
      }

      let restWidth = Math.abs(rightX - leftX);

      let polygonPool: GeometryPolygon[] = this.findPolygons(restWidth);

      if (polygonPool.length <= 0) {
        this.wrap();

        continue;
      }

      let polygon = polygonPool[Random.randomFloorToInt(0, polygonPool.length)];
      let originRotation = polygon.Rotation;

      if (this.warpCount == 0) {
        this.layFirstWrap(polygon);

        // 挤不下，重新回退到原来的角度
        if (
          polygon.ExpendBox.width > restWidth &&
          polygon.ExpendBox.height > restWidth
        ) {
          polygon.rotateTo(originRotation);
        }
      }

      if (polygon.ExpendBox.width > restWidth) {
        polygon.rotateBy(90);
      }

      for (let i = 0; i < this.polygons<GeometryPolygon>().length; i++) {
        if (this.polygons<GeometryPolygon>()[i].ID == polygon.ID) {
          this.polygons<GeometryPolygon>().splice(i, 1);
          this.setPolygons();
          break;
        }
      }

      let sidePolygon = [];
      if (this.count % 2 == 0) {
        // 左对齐
        polygon.moveTo(
          leftX - polygon.ExpendBox.x,
          this.borderY - polygon.ExpendBox.y
        );
        sidePolygon = sideCount.left;
      } else {
        // 右对齐
        polygon.moveTo(
          rightX - (polygon.ExpendBox.x + polygon.ExpendBox.width),
          this.borderY - polygon.ExpendBox.y
        );
        sidePolygon = sideCount.right;
      }

      this.tryDown(polygon, leftX, rightX, sidePolygon.length > 0, height);
      sidePolygon.unshift(polygon);
      this.count++;
      currentCount++;
      polygon.isUpdate = true;
      this.addPack(polygon);
    }

    !CELER_X &&
      console.log(
        " polygons cost:",
        Date.now() - startTime,
        " ms",
        ", total Pack:",
        currentCount
      );

    this.done();
  }

  private findPolygons(limitWidth: number) {
    let polygonPool: GeometryPolygon[] = [];
    for (let polygon of this.polygons<GeometryPolygon>()) {
      if (
        polygon.ExpendBox.width <= limitWidth ||
        polygon.ExpendBox.height <= limitWidth
      ) {
        polygonPool.push(polygon);
      } else {
        //break;
      }
    }

    return polygonPool;
  }

  private layFirstWrap(polygon: GeometryPolygon) {
    if (this.warpCount > 0) return;

    let rotationStep = 0;
    if (this.count % 2 == 0) {
      // 左对齐
      rotationStep = 0.5;
    } else {
      // 右对齐
      rotationStep = -0.5;
    }

    let Count = 90;

    let length = polygon.ExpendPoints.length;
    while (Count-- > 0) {
      let hasHroizonal = false;
      for (let i = 0; i < length; i++) {
        let lastPoint = polygon.ExpendPoints[(i + length - 1) % length];
        let nextPoint = polygon.ExpendPoints[(i + 1) % length];
        let point = polygon.ExpendPoints[i];
        if (point.y > polygon.Center.y) continue;
        if (
          Approx(lastPoint.y, point.y, 1) ||
          Approx(nextPoint.y, point.y, 1)
        ) {
          hasHroizonal = true;
        }
      }
      if (hasHroizonal) {
        break;
      }
      polygon.rotateBy(rotationStep);
    }
  }

  /** 往下堆叠到最低 */
  private tryDown(
    polygon: GeometryPolygon,
    leftBorder: number,
    rightBorder: number,
    isNeedRotate: boolean,
    targetHeight: number
  ) {
    // this.trySide(polygon);
    let interPolygon = this.tryPhysic(polygon);
    // this.downByForce(polygon, targetHeight);
  }

  private trySide(polygon: GeometryPolygon) {
    let sidePolygon: GeometryPolygon[] = [];
    let step = 0;
    if (this.count % 2 == 0) {
      // 左对齐
      step = -1;
      sidePolygon = this.sideCount.get(this.warpCount).left;
    } else {
      // 右对齐
      step = 1;
      sidePolygon = this.sideCount.get(this.warpCount).right;
    }

    if (sidePolygon.length <= 0) return;
    const TotalLoop = 100;
    let canMove = true;
    let loopCount = 0;
    while (canMove && loopCount++ <= TotalLoop) {
      canMove =
        cc.Intersection.polygonPolygon(
          sidePolygon[0].ExpendPoints,
          polygon.ExpendPoints
        ) == false;
      polygon.moveBy(step, 0);
    }
  }

  /** 往下挤压 */
  private tryPhysic(polygon: GeometryPolygon): GeometryPolygon {
    if (this.warpCount <= 0) {
      while (polygon.ExpendBorder.bot.y > 0) {
        polygon.moveBy(0, -1);
      }
      return null;
    } else {
      let interPolygon = null;
      let canMove = true;
      let loop = 0;
      let sideCount1 = this.sideCount.get(this.warpCount - 1);
      let sideCount2 = this.sideCount.get(this.warpCount - 2);
      let sideCount3 = this.sideCount.get(this.warpCount - 3);
      let sideCounts = [sideCount1];
      if (sideCount2) {
        sideCounts.push(sideCount2);
      }

      if (sideCount3) {
        sideCounts.push(sideCount3);
      }
      const Step = 1;
      const TotalLoop = 100;
      while (canMove && loop++ <= TotalLoop) {
        for (let sideCount of sideCounts) {
          for (let poly of sideCount.left) {
            if (
              cc.Intersection.polygonPolygon(
                poly.ExpendPoints,
                polygon.ExpendPoints
              )
            ) {
              interPolygon = intersectPolygon(polygon, poly);
              canMove = false;
              break;
            }
          }

          if (canMove) {
            for (let poly of sideCount.right) {
              if (
                cc.Intersection.polygonPolygon(
                  poly.ExpendPoints,
                  polygon.ExpendPoints
                )
              ) {
                interPolygon = intersectPolygon(polygon, poly);
                canMove = false;
                break;
              }
            }
          }

          if (canMove) {
            polygon.moveBy(0, -Step);
          } else {
            continue;
          }
        }
      }

      return interPolygon;
    }
  }

  private downByForce(polygon: GeometryPolygon, targetHeight: number) {
    if (this.warpCount == 0) return;
    let force = cc.v2(0, 0);
    let gravity = cc.v2(0, -1);

    const Force = 1;

    let testPolygons = [];
    // let left = new GeometryPolygon([
    //   { x: -100, y: 0 },
    //   { x: 0, y: 0 },
    //   { x: -100, y: targetHeight },
    //   { x: 0, y: targetHeight },
    // ]);
    // testPolygons.push(left);

    // let right = new GeometryPolygon([
    //   { x: this.width, y: 0 },
    //   { x: this.width + 100, y: 0 },
    //   { x: this.width, y: targetHeight },
    //   { x: this.width + 100, y: targetHeight },
    // ]);
    // testPolygons.push(right);

    // let bot = new GeometryPolygon([
    //   { x: 0, y: -100 },
    //   { x: this.width, y: -100 },
    //   { x: 0, y: 0 },
    //   { x: this.width, y: 0 },
    // ]);
    // testPolygons.push(bot);

    for (
      let wrap = this.warpCount;
      wrap >= 0 && wrap > this.warpCount - 3;
      wrap--
    ) {
      let sideCount = this.sideCount.get(wrap);
      if (sideCount) {
        if (sideCount.left.length > 1) {
          for (let i = 1; i < sideCount.left.length; i++) {
            testPolygons.push(sideCount.left[i]);
          }
        }

        if (sideCount.right.length > 1) {
          for (let i = 1; i < sideCount.right.length; i++) {
            testPolygons.push(sideCount.right[i]);
          }
        }
      }
    }

    let loopCount = 0;
    const TotalLoop = 40;
    force.addSelf(gravity.mul(1));

    while (force.mag() != 0 && loopCount++ < TotalLoop) {
      force = cc.v2(0, 0);

      force.addSelf(gravity.mul(1));
      let hasTouchBot = false;
      let hasTouchLeft = false;
      let hasTouchRight = false;
      let hasTouchTop = false;

      for (let testPolygon of testPolygons) {
        let interPolygon = intersectPolygon(polygon, testPolygon);
        if (interPolygon && interPolygon.Points.length > 0) {
          for (let point of interPolygon.Points) {
            let length = Distance(point, polygon.Center);
            let dx = polygon.Center.x - point.x;
            let dy = polygon.Center.y - point.y;
            if (!hasTouchBot) {
              hasTouchBot = dy > 0;
            }

            if (!hasTouchTop) {
              hasTouchBot = dy < 0;
            }

            if (!hasTouchLeft) {
              hasTouchBot = dx > 0;
            }

            if (!hasTouchRight) {
              hasTouchBot = dx < 0;
            }

            force.addSelf(cc.v2(dx / length, dy / length).mul(Force));

            // let rotation = 0;
            // if (force.y > 0) {
            //   rotation = force.x < polygon.Center.x ? 1 : -1;
            //   polygon.rotateBy(rotation);
            // }
            //force.y = Math.max(force.y, 0);
          }
        }
      }
      force.normalizeSelf();
      // console.log(polygon.ID, force);
      if (hasTouchBot) {
        force.y = Math.max(0, force.y);
      }

      if (hasTouchTop) {
        force.y = Math.min(0, force.y);
      }

      if (hasTouchLeft) {
        force.x = Math.max(0, force.x);
      }

      if (hasTouchRight) {
        force.x = Math.min(0, force.x);
      }
      polygon.moveBy(force.x, force.y);

      if (hasTouchBot && hasTouchLeft && hasTouchRight) {
        break;
      }
    }

    if (loopCount >= TotalLoop) {
      // console.error(" loop limit:", polygon.ID, force);
    } else {
    }
  }

  /** 换行 */
  private wrap() {
    let sideCount = this.sideCount.get(this.warpCount);
    for (let polygon of sideCount.left) {
      this.borderY = Math.max(this.borderY, polygon.ExpendBorder.top.y);
    }

    for (let polygon of sideCount.right) {
      this.borderY = Math.max(this.borderY, polygon.ExpendBorder.top.y);
    }
    this.updateHeight(sideCount);

    this.warpCount++;
    this.sideCount.add(this.warpCount, { left: [], right: [] });
  }

  private updateHeight(sideCount: {
    left: GeometryPolygon[];
    right: GeometryPolygon[];
  }) {
    this.height = 0;
    for (let polygon of sideCount.left) {
      this.height = Math.max(this.height, polygon.ExpendBorder.top.y);
    }

    for (let polygon of sideCount.right) {
      this.height = Math.max(this.height, polygon.ExpendBorder.top.y);
    }
  }
}
