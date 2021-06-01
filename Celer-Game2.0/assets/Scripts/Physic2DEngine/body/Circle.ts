import { Arcs } from "../common/arcs";
import { Bound } from "../common/bound";
import { Vector } from "../math/vector";
import { Body, BodyType, IBodyOpt } from "./body";
export interface CircleOpt extends IBodyOpt {
  radius: number;
}

/**
 * 圆形刚体
 */
export class Circle extends Body {
  /** 半径 */
  radius: number;

  constructor(opt: CircleOpt) {
    super(opt, BodyType.Circle);
  }

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getCentroid(): Vector {
    return this.origin.clone();
  }

  getInertia(): number {
    return 0.5 * this.mass * Math.pow(this.radius, 2);
  }

  getBound(): Bound {
    return Arcs.getBound(this.position, this.radius);
  }

  translate(dx: number, dy: number) {
    // 位移图形原点
    this.origin.x += dx;
    this.origin.y += dy;

    // 位移包围盒
    this.bound.translate(dx, dy);
  }

  rotate(radian: number) {
    if (this.rotateCenter === this.position) return;

    let ox = this.origin.x,
      oy = this.origin.y;

    this.origin = this.origin.rotate(radian, this.rotateCenter, this.origin);
    this.bound.translate(this.origin.x - ox, this.origin.y - oy);
  }

  isContains(x: number, y: number): boolean {
    return Arcs.isContains(this, new Vector(x, y));
  }
}
