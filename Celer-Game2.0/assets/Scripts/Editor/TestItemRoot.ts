import {
  PolygonPackDoneSignal,
  UpdatePanelHeightSignal,
} from "../AlgorithmUtils/BasePacker";
import { MinPotentialPacker } from "../AlgorithmUtils/MinimumPotentialLayout/MinPotentialPacker";
import { GeometryPolygon } from "../AlgorithmUtils/GeometryPolygon/GeometryPolygon";
import { GameStateController } from "../Controller/GameStateController";
import {
  CreateDebugGridSignal,
  Grid,
  PolygonPacker,
} from "../Controller/PolygonPacker";
import { gFactory } from "../Factory/GameFactory";
import { disOrderArray } from "../Utils/Cocos";
import { Random } from "../Utils/Random";
import { BaseSignal } from "../Utils/Signal";
import {
  GetTotalMapHeight,
  GetTotalTime,
  MapSpeedUpScale,
  StartSpeed,
} from "../Global/GameRule";
import { Time } from "../Utils/Time";

const { ccclass, property } = cc._decorator;

/** 每下移多少就重新生成新的item */
const UpdateHeight = 1920 * 0.25;

export enum PackType {
  MinPotential,
  Physics,
}

export class ItemUpdateSignal extends BaseSignal {}
@ccclass
export default class TestItemRoot extends cc.Component {
  @property({
    type: cc.Enum(PackType),
  })
  type: PackType.MinPotential = PackType.MinPotential;

  private polygonData: { [key: number]: Array<{ x: number; y: number }> } = {};

  get GridRoot() {
    return this.node.getChildByName("GridRoot");
  }

  get Items() {
    return this.node.getChildByName("Items");
  }

  get Center() {
    return this.node.getChildByName("Center");
  }

  get BorderTop() {
    return this.node.getChildByName("Top");
  }

  get BorderBot() {
    return this.node.getChildByName("Bot");
  }

  get BorderLeft() {
    return this.node.getChildByName("Left");
  }

  get BorderRight() {
    return this.node.getChildByName("Right");
  }

  private initChildCount: number = 0;

  private speed: number = StartSpeed();
  private lastTime = 0;
  onLoad() {
    cc.director.getPhysicsManager().enabled = true;
    cc.director.getPhysicsManager().enabled = false;
    if (cc.director.getPhysicsManager().enabled) {
      cc.director.getPhysicsManager().gravity = cc.v2(0, 0);
      cc.director.getPhysicsManager().enabledAccumulator = true;
      cc.director.getPhysicsManager().debugDrawFlags =
        cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    Random.setRandomSeed(Math.random());
    // Random.setRandomSeed(0.42227920776368255);
    // UpdatePanelHeightSignal.inst.addListenerOne((height: number) => {
    //   this.node.height = height;
    // }, this);

    this.node.height = GetTotalMapHeight();

    CreateDebugGridSignal.inst.addListenerOne((grid: Grid) => {
      let gridNode = gFactory.getObj("Grid", grid);

      gridNode.setPosition(
        grid.j * grid.Rect.width + grid.Rect.width / 2,
        grid.i * grid.Rect.height + grid.Rect.height / 2
      );
      gridNode.width = grid.Rect.width;
      gridNode.height = grid.Rect.height;
      this.GridRoot.addChild(gridNode);
    }, this);

    cc.debug.setDisplayStats(false);
    cc.loader.loadRes(
      "./polygonData/polygon",
      cc.JsonAsset,
      (err, json: cc.JsonAsset) => {
        if (err) {
          console.error(err);
        } else {
          this.polygonData = json.json;
          this.initPolygonPacker();
        }
      }
    );

    this.node.on(
      cc.Node.EventType.TOUCH_MOVE,
      (ev: cc.Event.EventTouch) => {
        this.node.y += ev.getDeltaY();

        if (MinPotentialPacker.inst.DebugNode) {
          MinPotentialPacker.inst.DebugNode.y += ev.getDeltaY();
        }
      },
      this
    );

    if (this.type == PackType.MinPotential) {
      PolygonPackDoneSignal.inst.addListenerOne(this.onPackDone, this);
    } else {
    }
  }

  private isStartMove: boolean = false;
  startMove() {
    if (cc.director.getPhysicsManager().enabled) {
      // cc.director.getPhysicsManager().gravity = cc.v2(0, -1000);

      return;
    }
    this.isStartMove = true;
  }

  update(dt: number) {
    if (this.isStartMove == false) {
      return;
    }

    /** 应该放到if 里面 */
    this.node.y -= dt * this.speed;
    if (MinPotentialPacker.inst.DebugNode) {
      MinPotentialPacker.inst.DebugNode.y -= dt * this.speed;
    }

    this.lastTime += dt;
    console.log(Time.timeFormat(this.lastTime).replace("/", ":"));
    this.speed += MapSpeedUpScale() * dt;

    if (this.lastTime >= GetTotalTime()) {
      this.isStartMove = false;
    }

    /** 应该放到if 里面 */

    if (
      GameStateController.inst.isRoundStart() &&
      !GameStateController.inst.isPause() &&
      !GameStateController.inst.isGameOver()
    ) {
      this.node.y -= dt * this.speed;
    }
  }

  checkNeedAdd() {}

  onPackDone(polygonMap: GeometryPolygon[]) {
    console.log("on pack done:", polygonMap.length);

    let count = 0;

    ItemUpdateSignal.inst.removeTarget(this);

    ItemUpdateSignal.inst.addListenerThree(
      (ID: string, position: cc.Vec2, rotation: number) => {
        let item = this.Items.getChildByName(ID);

        if (item) {
          item.setPosition(position);
          item.rotation = rotation;
        }
      },
      this
    );
    for (let polygon of polygonMap) {
      let ID = polygon.ID;
      count++;
      if (polygon.isUpdate) {
        setTimeout(
          (polygon: GeometryPolygon, ID: string, count: number) => {
            cc.loader.loadRes(
              "./Items/" + ID.split(":")[0],
              cc.SpriteFrame,
              (err: Error, sp: cc.SpriteFrame) => {
                if (err) {
                  console.error(err);
                  return;
                }
                let item = new cc.Node();
                item.name = polygon.ID;

                // // // 包围盒
                // let box = new cc.Node();
                // let boxCollider = box.addComponent(cc.PhysicsPolygonCollider);
                // boxCollider.points = polygon.ExpendBoxPoints;
                // boxCollider.sensor = true;
                // this.Items.addChild(box);

                // 中心点
                let center = cc.instantiate(this.Center);
                center.setPosition(polygon.Center);
                item.addChild(center);

                center.x -= polygon.Position.x;
                center.y -= polygon.Position.y;
                item.addComponent(cc.Sprite).spriteFrame = sp;

                // let colliderNode = new cc.Node();
                let collider = item.addComponent(cc.PhysicsPolygonCollider);
                collider.points = polygon.ExpendOrginPoints;
                collider.sensor = true;
                item.rotation = polygon.Rotation;
                item.setPosition(polygon.Position);

                this.Items.addChild(item);

                if (count >= polygonMap.length) {
                  if (this.initChildCount == 0) {
                    this.initChildCount = this.Items.childrenCount;
                  }
                  this.startMove();
                }
              }
            );
          },
          0,
          polygon,
          ID,
          count
        );
      }
    }
  }

  initPolygonPacker() {
    if (this.type == PackType.MinPotential) {
      MinPotentialPacker.inst.init(this.node.width, this.polygonData);
    } else if (this.type == PackType.Physics) {
    }
  }

  placeItems(spriteFrames: cc.SpriteFrame[]) {
    let startTime: number = Date.now();
    spriteFrames.length = 5;
    let count = 0;
    disOrderArray(spriteFrames);
    while (spriteFrames.length > 0) {
      count++;
      let itemNode = new cc.Node();
      itemNode.opacity = 200;
      let index = Random.randomFloorToInt(0, spriteFrames.length);
      let spriteFrame = spriteFrames.splice(index, 1)[0];
      itemNode.addComponent(cc.Sprite).spriteFrame = spriteFrame;

      let points = [];
      let orgrinPoints = [];
      for (let point of this.polygonData[spriteFrame.name]) {
        points.push(cc.v2(point.x, point.y));
        orgrinPoints.push(cc.v2(point.x, point.y));
      }

      let collider = itemNode.addComponent(cc.PhysicsPolygonCollider);
      collider.points = points;
      collider.sensor = true;
      itemNode.on(
        cc.Node.EventType.TOUCH_MOVE,
        (ev: cc.Event.EventTouch) => {
          itemNode.setPosition(itemNode.position.add(ev.getDelta()));
          PolygonPacker.inst.testCheck(orgrinPoints, itemNode);
        },
        this
      );
      itemNode.rotation = Random.getRandom() * 360;
      itemNode.setPosition(
        PolygonPacker.inst.StartX,
        PolygonPacker.inst.StartY
      );
      this.Items.addChild(itemNode);
      PolygonPacker.inst.checkBorder(itemNode, orgrinPoints);
    }
    console.log(
      " place items cost:",
      Date.now() - startTime,
      " ms,",
      " items:",
      this.Items.childrenCount
    );
  }
}

CC_DEBUG &&
  (window["EngineEnable"] = function (enable: boolean) {
    cc.director.getPhysicsManager().enabled = enable;
    if (cc.director.getPhysicsManager().enabled) {
      cc.director.getPhysicsManager().gravity = cc.v2(0, 0);
      cc.director.getPhysicsManager().enabledAccumulator = true;
      cc.director.getPhysicsManager().debugDrawFlags =
        cc.PhysicsManager.DrawBits.e_shapeBit;
    } else {
      cc.director.getPhysicsManager().debugDrawFlags = 0;
    }
  });
