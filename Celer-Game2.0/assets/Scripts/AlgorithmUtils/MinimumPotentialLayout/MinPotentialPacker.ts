import { UpdateLoadingSignal } from "../../Editor/PercentLabel2";
import ItemRoot from "../../GamePlay/View/Game/ItemRoot";
import {
  GetCollectCount,
  GetTotalLevel,
  GetTotalMapHeight,
  GetTypeCount,
} from "../../Global/GameRule";
import ThemeView from "../../Initialization/View/ThemeView";
import { Approx, disOrderArray } from "../../Utils/Cocos";
import { HashMap } from "../../Utils/HashMap";
import { Random } from "../../Utils/Random";
import { BasePacker } from "../BasePacker";
import { GeometryPolygon } from "../GeometryPolygon/GeometryPolygon";

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

  private b2World: b2.World;

  public DebugNode: cc.Node = null;

  private targetHeight: number = 0;

  private level: number = 0;

  pack() {
    if (this.b2World == null) {
      this.b2World = new b2.World(new b2.Vec2(0, -300));
      this.b2World.SetAllowSleeping(true);

      if (CC_DEBUG) {
        window["b2World"] = this.b2World;
        let node = new cc.Node("PHYSICS_MANAGER_DEBUG_DRAW");
        this.DebugNode = node;
        node.zIndex = cc.macro.MAX_ZINDEX;
        cc.game.addPersistRootNode(node);
        let debugDrawer = node.addComponent(cc.Graphics);

        let debugDraw = new cc.PhysicsDebugDraw(debugDrawer);
        debugDraw.SetFlags(b2.DrawFlags.e_shapeBit);
        this.b2World.SetDebugDraw(debugDraw);
      }

      let worldHeight = GetTotalMapHeight() * 2;
      let borderWidth = 100;
      let groundWidth = 1080 * 2;

      /** add left edge */
      let left = new b2.BodyDef();
      left.allowSleep = true;
      left.angle = 0;
      left.gravityScale = 0;
      left.type = b2.BodyType.b2_staticBody;

      let leftShape = new b2.PolygonShape();
      leftShape.SetAsBox(
        borderWidth / 2 / cc.PhysicsTypes.PTM_RATIO,
        worldHeight / 2 / cc.PhysicsTypes.PTM_RATIO,
        new b2.Vec2(
          -borderWidth / 2 / cc.PhysicsTypes.PTM_RATIO,
          0 / 2 / cc.PhysicsTypes.PTM_RATIO
        )
      );
      let leftFixtureDef = new b2.FixtureDef();
      leftFixtureDef.density = 1;
      leftFixtureDef.shape = leftShape;
      let leftBody = this.b2World.CreateBody(left);
      leftBody.CreateFixture(leftFixtureDef);
      leftBody.SetPosition(
        new b2.Vec2(
          0 / cc.PhysicsTypes.PTM_RATIO,
          (worldHeight / 2 + borderWidth) / cc.PhysicsTypes.PTM_RATIO
        )
      );
      leftBody.name = "left";

      /** add right edge */
      let right = new b2.BodyDef();
      right.allowSleep = true;
      right.angle = 0;
      right.type = b2.BodyType.b2_staticBody;
      right.gravityScale = 0;
      let rightShape = new b2.PolygonShape();
      rightShape.SetAsBox(
        borderWidth / 2 / cc.PhysicsTypes.PTM_RATIO,
        worldHeight / 2 / cc.PhysicsTypes.PTM_RATIO,
        new b2.Vec2(
          borderWidth / 2 / cc.PhysicsTypes.PTM_RATIO,
          0 / 2 / cc.PhysicsTypes.PTM_RATIO
        )
      );
      let rightFixtureDef = new b2.FixtureDef();
      rightFixtureDef.density = 1;
      rightFixtureDef.shape = rightShape;
      let rightBody = this.b2World.CreateBody(left);
      rightBody.CreateFixture(rightFixtureDef);
      rightBody.SetPosition(
        new b2.Vec2(
          1080 / cc.PhysicsTypes.PTM_RATIO,
          (worldHeight / 2 + borderWidth) / cc.PhysicsTypes.PTM_RATIO
        )
      );
      rightBody.name = "right";

      /** add bottom edge */
      let bottom = new b2.BodyDef();
      bottom.allowSleep = true;
      bottom.type = b2.BodyType.b2_staticBody;
      bottom.gravityScale = 0;
      bottom.angle = 0;
      let bottomShape = new b2.PolygonShape();
      bottomShape.SetAsBox(
        groundWidth / 2 / cc.PhysicsTypes.PTM_RATIO,
        borderWidth / 2 / cc.PhysicsTypes.PTM_RATIO,
        new b2.Vec2(0, borderWidth / 2 / cc.PhysicsTypes.PTM_RATIO)
      );
      let bottomFixtureDef = new b2.FixtureDef();
      bottomFixtureDef.density = 1;
      bottomFixtureDef.shape = bottomShape;
      let bottomBody = this.b2World.CreateBody(bottom);
      bottomBody.CreateFixture(bottomFixtureDef);
      bottomBody.SetPosition(
        new b2.Vec2(1080 / 2 / cc.PhysicsTypes.PTM_RATIO, 0)
      );
    }

    this.warpCount = 0;
    this.sideCount.add(this.warpCount, { left: [], right: [] });
    this.borderY = 256 / 2;
    this.startPack(GetTotalMapHeight());
  }

  private Step(
    isDraw: boolean = true,
    dt: number = cc.PhysicsManager.FIXED_TIME_STEP,
    velocityIterations: number = cc.PhysicsManager.VELOCITY_ITERATIONS,
    positionIterations: number = cc.PhysicsManager.POSITION_ITERATIONS
  ) {
    ItemRoot.DRAW && isDraw && this.b2World.ClearDebugDraw();
    this.b2World.Step(dt, velocityIterations, positionIterations);
    this.syncBody();
    ItemRoot.DRAW && isDraw && this.b2World.DrawDebugData();
  }

  private syncBody() {
    this.b2World.SyncDynamicTransform(
      (body: b2.Body, offset: b2.Vec2, angle: number) => {
        if (body.data) {
          let polygon = body.data as GeometryPolygon;

          polygon.rotateBy(cc.PhysicsTypes.PHYSICS_ANGLE_TO_ANGLE * angle);
          polygon.moveBy(
            offset.x * cc.PhysicsTypes.PTM_RATIO,
            offset.y * cc.PhysicsTypes.PTM_RATIO
          );
        }
      }
    );
  }

  private createBody(polygon: GeometryPolygon) {
    let bodyDef = new b2.BodyDef();
    bodyDef.allowSleep = true;
    bodyDef.angle = 0;

    // bodyDef.gravityScale = 0;
    bodyDef.type = b2.BodyType.b2_dynamicBody;
    bodyDef.bullet = true;
    bodyDef.linearDamping = 0.5;
    bodyDef.angularDamping = 0.5;
    // bodyDef.fixedRotation = true;

    let body = this.b2World.CreateBody(bodyDef);
    body.data = polygon;
    body.SetPosition(
      new b2.Vec2(
        polygon.Position.x / cc.PhysicsTypes.PTM_RATIO,
        polygon.Position.y / cc.PhysicsTypes.PTM_RATIO
      )
    );

    let shapes = cc.PolygonSeparator.ConvexPartition(polygon.ExpendPoints);

    let polygonShapes = [];
    for (let i = 0; i < shapes.length; i++) {
      let points = shapes[i];
      let vertices: b2.Vec2[] = [];

      let b2Shape = null;
      let firstVertices = null;

      for (let j = 0; j < points.length; j++) {
        if (b2Shape == null) {
          b2Shape = new b2.PolygonShape();
        }

        let point = points[j];

        let v = new b2.Vec2(
          (point.x - polygon.Position.x) / cc.PhysicsTypes.PTM_RATIO,
          (point.y - polygon.Position.y) / cc.PhysicsTypes.PTM_RATIO
        );
        vertices.push(v);
        if (!firstVertices) {
          firstVertices = v;
        }

        if (vertices.length === b2.maxPolygonVertices) {
          b2Shape.Set(vertices, vertices.length);
          polygonShapes.push(b2Shape);

          b2Shape = null;

          if (j < points.length - 1) {
            vertices = [firstVertices, vertices[vertices.length - 1]];
          }
        }
      }
      if (b2Shape) {
        b2Shape.Set(vertices, vertices.length);
        polygonShapes.push(b2Shape);
      }
    }

    for (let shape of polygonShapes) {
      let bodyFixtureDef = new b2.FixtureDef();
      bodyFixtureDef.density = 1;
      bodyFixtureDef.isSensor = false;
      //bodyFixtureDef.friction = 0.5;
      bodyFixtureDef.shape = shape;

      body.CreateFixture(bodyFixtureDef);
    }
    body.SyncTransform();
  }

  startPack(height: number = 1920 * 15 /*1920 * 1.5*/) {
    this.targetHeight = height;
    this.packAsync(height);
  }

  private stepID: number = -1;
  private packAsync(height: number) {
    let startTime: number = Date.now();
    this.packeds().length = 0;
    let oldHeight = this.height;

    const interval = 2;
    const ToTalLoop = 30;

    this.b2World.SetGravity(new b2.Vec2(0, -300));
    this.b2World.m_AngleLimit = Math.abs(
      2 / cc.PhysicsTypes.PHYSICS_ANGLE_TO_ANGLE
    );
    this.b2World.m_OffsetLimit = 10 / cc.PhysicsTypes.PTM_RATIO;
    this.b2World.m_StaticRefLimit = 10;
    this.b2World.m_VelocityLimit = 0.5;

    this.stepID = setInterval(() => {
      let Loop = ToTalLoop;
      while (Loop--) {
        this.Step(CC_DEBUG);

        if (this.b2World.IsAllDynamicBodySleepingNow()) {
          this.b2World.SetAllDynamic2Static();

          if (this.height >= height) {
            // done
            clearInterval(this.stepID);
            !CELER_X &&
              console.log(
                " polygons cost:",
                Date.now() - startTime,
                " ms",
                ", total Pack:",
                this.packeds().length,
                ", height:",
                this.height,
                ", heightAdd:",
                this.height - oldHeight
              );

            this.done();
          } else {
            this.updateHeight();
            this.stepAsync(height);
          }

          break;
        } else {
        }
      }
      UpdateLoadingSignal.inst.dispatchOne(this.height / height);
    }, interval) as unknown as number;
  }

  private stepAsync(targetHeight: number) {
    if (this.height >= targetHeight) {
      return;
    }

    while (true) {
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
        for (let polygon of sideCount.left) {
          this.createBody(polygon);
        }

        for (let polygon of sideCount.right) {
          this.createBody(polygon);
        }
        this.wrap();
        break;
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
          this.setPolygons(polygon.ID.split(":")[0]);
          // this.setPolygons();
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

      sidePolygon.unshift(polygon);
      this.count++;
      polygon.isUpdate = true;
      this.addPack(polygon);
    }
  }

  done() {
    if (CC_DEBUG) {
      ItemRoot.DRAW && this.b2World.ClearDebugDraw();
      ItemRoot.DRAW && this.b2World.DrawDebugData();
      for (let polygon of this.polygonsNeed()) {
        if (polygon.length > 0) {
          console.error("生成解解没有全部生成。");
        }
      }
    }
    super.done();
    if (this._completeCallback) {
      this._completeCallback();
    }
  }

  private index: number = -1;
  private answerIndex = 0;
  private indexRef = 0;
  private findPolygons(limitWidth: number) {
    let polygonPool: GeometryPolygon[] = [];

    let heightPerLevel = this.targetHeight / GetTotalLevel();
    let polygons = this.polygonsNeed()[this.level];

    let count = GetCollectCount() * GetTypeCount() * GetTotalLevel();
    let height = heightPerLevel / count;

    if (polygons && polygons.length > 0) {
      disOrderArray(polygons);
      let newIndex = Math.floor(this.height / height);
      if (newIndex != this.index) {
        this.index = newIndex;
        this.indexRef = 0;
      } else {
        this.indexRef++;
      }

      if (this.indexRef <= 2) {
        for (let i = 0; i < polygons.length; i++) {
          let polygon = polygons[i];
          if (
            polygon.ExpendBox.width <= limitWidth ||
            polygon.ExpendBox.height <= limitWidth
          ) {
            polygonPool.push(polygon);
            polygons.splice(i, 1);
            break;
          } else {
            //break;
          }
        }
      }
    }

    if (polygonPool.length > 0) {
      if (CC_DEBUG) {
        // console.log(++this.answerIndex, " 生成解：", this.warpCount);
      }
      return polygonPool;
    }

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
      rotationStep = 1;
    } else {
      // 右对齐
      rotationStep = -1;
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

  /** 换行 */
  private wrap() {
    this.warpCount++;
    this.sideCount.add(this.warpCount, { left: [], right: [] });
    if (CC_DEBUG) {
      // console.log("wrap:", this.warpCount);
    }
  }

  private updateHeight() {
    if (this.warpCount == 0) return;
    let sideCount = this.sideCount.get(this.warpCount - 1);

    for (let polygon of sideCount.left) {
      this.borderY = Math.max(this.borderY, polygon.ExpendBorder.top.y);
    }

    for (let polygon of sideCount.right) {
      this.borderY = Math.max(this.borderY, polygon.ExpendBorder.top.y);
    }

    let height = 0;
    for (let polygon of sideCount.left) {
      if (height == 0) {
        height = polygon.ExpendBorder.top.y;
      } else {
        height = Math.min(height, polygon.ExpendBorder.top.y);
      }
    }

    for (let polygon of sideCount.right) {
      height = Math.min(height, polygon.ExpendBorder.top.y);
    }

    this.height = Math.max(height, this.height);

    let heightPerLevel = this.targetHeight / GetTotalLevel();
    if (this.level != Math.floor(this.height / heightPerLevel)) {
      this.index = -1;
    }
    this.level = Math.floor(this.height / heightPerLevel);

    if (this._progressCallback) {
      this._progressCallback(Math.min(1, this.height / this.targetHeight));
    }
  }
}
