import { Random_ID, Random_Pool } from "../../table";

export class ItemModel {
  private static objCount = 0;
  private id: string = "";
  private spName: string = "";
  private type: Random_ID = null;
  private subType: Random_Pool = null;
  private points: cc.Vec2[] = [];

  constructor(
    spName: string,
    type: Random_ID,
    subType: Random_Pool,
    points: cc.Vec2[]
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

    this.type = type;
    this.subType = subType;
    this.spName = spName;
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

  checkClick(point: cc.Vec2) {
    return cc.Intersection.pointInPolygon(point, this.points);
  }

  removeSelf() {}
}
