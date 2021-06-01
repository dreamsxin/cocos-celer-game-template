// 二维向量 {x, y}
export class Vector {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.x = 0;
    this.y = 0;

    if (x !== undefined && y !== undefined) {
      this.set(x, y);
    }
  }

  //-------------操作----------------

  /**
   * 设置值
   * @param x
   * @param y
   */
  set(x: number, y: number): Vector {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * 相加
   * @param v
   */
  add(v: Vector, out?: Vector): Vector {
    out = out || new Vector();

    out.x = this.x + v.x;
    out.y = this.y + v.y;

    return out;
  }

  /**
   * 相加
   * @param v
   */
  addSelf(v: Vector): Vector {
    this.x = this.x + v.x;
    this.y = this.y + v.y;

    return this;
  }

  /**
   * 相减
   * @param v
   */
  sub(v: Vector, out?: Vector): Vector {
    out = out || new Vector();

    out.x = this.x - v.x;
    out.y = this.y - v.y;

    return out;
  }

  /**
   * 相减
   * @param v
   */
  subSelf(v: Vector): Vector {
    this.x = this.x - v.x;
    this.y = this.y - v.y;

    return this;
  }

  /**
   * 点积
   * @param v
   */
  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 叉积
   * @param v
   */
  cross(v: Vector): number {
    return this.x * v.y - v.x * this.y;
  }

  /**
   * 与标量进行叉积
   * 若n > 0, 则返回当前向量放大n倍后，向逆时针旋转90°的向量
   * 若n < 0, 则返回当前向量放大n倍后，向顺时针旋转90°的向量
   * @param n
   */
  crossNum(n: number, out?: Vector): Vector {
    out = out || new Vector();

    out.x = -n * this.y;
    out.y = n * this.x;

    return out;
  }

  /**
   * 投影
   * @param v
   */
  project(v: Vector): number {
    return this.dot(v) / v.len();
  }

  /**
   * 法向
   */
  normal(out?: Vector): Vector {
    out = out || new Vector();

    out.x = this.y;
    out.y = -this.x;

    return out;
  }

  /**
   * 求模
   */
  len(): number {
    return Math.hypot(this.x, this.y);
  }

  /**
   * 平方模（节省求平方根操作）
   */
  squareLen(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * 单位化
   */
  normalize(out?: Vector): Vector {
    out = out || new Vector();
    let len = this.len();

    if (len === 0) {
      return new Vector();
    }

    out.x = this.x / len;
    out.y = this.y / len;

    return out;
  }

  /**
   * 单位化
   */
  normalizeSelf(): Vector {
    let len = this.len();

    if (len === 0) {
      return new Vector();
    }

    this.x = this.x / len;
    this.y = this.y / len;

    return this;
  }

  /**
   * 缩放
   * @param n
   */
  scale(n: number, out?: Vector): Vector {
    out = out || new Vector();
    out.x = n * this.x;
    out.y = n * this.y;
    return out;
  }

  /**
   * 缩放
   * @param n
   */
  scaleSelf(n: number): Vector {
    this.x = n * this.x;
    this.y = n * this.y;
    return this;
  }

  /**
   * 反向
   */
  inverse(out?: Vector): Vector {
    out = out || new Vector();
    out.x = -this.x;
    out.y = -this.y;
    return out;
  }

  /**
   * 反向
   */
  inverseSelf(): Vector {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * 判断两向量是否相等
   * @param v
   */
  equal(v: Vector): boolean {
    return this.x === v.x && this.y === v.y;
  }

  /**
   * 求两向量夹角(弧度制)
   * @param v
   */
  angle(v: Vector): number {
    return Math.acos(this.dot(v) / (this.len() * v.len()));
  }

  /**
   * 克隆向量
   */
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /**
   * 绕某点旋转向量
   * @param radian 角度（弧度制）
   * @param point 绕的点
   */
  rotate(radian: number, point: Vector, out?: Vector): Vector {
    out = out || new Vector();

    let cos = Math.cos(radian),
      sin = Math.sin(radian),
      dx = this.x - point.x,
      dy = this.y - point.y;

    out.x = point.x + (dx * cos - dy * sin);
    out.y = point.y + (dx * sin + dy * cos);

    return out;
  }

  /**
   * 绕某点旋转向量
   * @param radian 角度（弧度制）
   * @param point 绕的点
   */
  rotateSelf(radian: number, point: Vector): Vector {
    let cos = Math.cos(radian),
      sin = Math.sin(radian),
      dx = this.x - point.x,
      dy = this.y - point.y;

    this.x = point.x + (dx * cos - dy * sin);
    this.y = point.y + (dx * sin + dy * cos);

    return this;
  }

  /**
   * 求一个向量（点）按照direction方向，延长len长度后的坐标
   * @param direction
   * @param len
   */
  extend(direction: Vector, len: number, out?: Vector): Vector {
    out = out || new Vector();

    direction.normalizeSelf();
    out.x = this.x + direction.x * len;
    out.y = this.y + direction.y * len;

    return out;
  }

  /**
   * 求一个向量（点）按照direction方向，延长len长度后的坐标
   * @param direction
   * @param len
   */
  extendSelf(direction: Vector, len: number): Vector {
    direction.normalizeSelf();
    this.x = this.x + direction.x * len;
    this.y = this.y + direction.y * len;

    return this;
  }
}

export const _tempVector1 = new Vector();
export const _tempVector2 = new Vector();
export const _tempVector3 = new Vector();
export const _tempVector4 = new Vector();
