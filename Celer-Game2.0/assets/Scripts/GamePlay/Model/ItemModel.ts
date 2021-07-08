import { Random_ID, Random_Pool } from "../../table";
import { BaseSignal } from "../../Utils/Signal";

export class CreateItemNodeSignal extends BaseSignal {}
export class RemoveItemSignal extends BaseSignal {}

export class ItemModel {
  private static objCount = 0;
  private id: string = "";
  private spName: string = "";
  private type: Random_ID = null;
  private subType: Random_Pool = null;
  private points: cc.Vec2[] = [];
  private position: cc.Vec2 = cc.v2(0, 0);
  private rotation: number = 0;

  private bot: number = 0;
  private top: number = 0;
  private hasCreate: boolean = true;
  private zIndex: number = 0;

  constructor(
    spName: string,
    type: Random_ID,
    subType: Random_Pool,
    points: cc.Vec2[],
    pos: cc.Vec2,
    rotation: number,
    bot: number,
    top: number,
    zIndex: number
  ) {
    this.id =
      spName +
      "-" +
      Random_ID[type] +
      "-" +
      Random_Pool[subType] +
      ":" +
      ItemModel.objCount++;

    for (let p of points) {
      this.points.push(p.clone());
    }

    this.zIndex = zIndex;

    this.rotation = rotation;
    this.position = pos;
    this.type = type;
    this.subType = subType;
    this.spName = spName;
    (this.bot = bot), (this.top = top);

    if (this.bot <= 1920 && this.top >= 0) {
      this.hasCreate = true;
      CreateItemNodeSignal.inst.dispatchOne(this);
    } else {
      this.hasCreate = false;
    }
  }

  get ZIndex() {
    return this.zIndex;
  }

  get ID() {
    return this.id;
  }

  get Type() {
    return this.type;
  }

  get SubType() {
    return this.subType;
  }

  get Points() {
    return this.points;
  }

  get SpName() {
    return this.spName;
  }

  get Rotation() {
    return this.rotation;
  }

  get Position() {
    return this.position;
  }

  move(offset: cc.Vec2): boolean {
    for (let point of this.points) {
      point.addSelf(offset);
    }
    this.bot += offset.y;
    this.top += offset.y;

    if (this.bot <= 1920 && this.top >= 0) {
      if (!this.hasCreate) {
        CreateItemNodeSignal.inst.dispatchOne(this);
        this.hasCreate = true;
      }
    } else {
      if (this.hasCreate) {
        RemoveItemSignal.inst.dispatchOne(this);
        return true;
      }
      this.hasCreate = false;
    }

    return false;
  }

  checkClick(point: cc.Vec2) {
    return cc.Intersection.pointInPolygon(point, this.points);
  }

  removeSelf() {}
}
