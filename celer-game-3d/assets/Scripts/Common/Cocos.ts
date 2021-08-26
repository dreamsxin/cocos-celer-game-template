import { Rect, renderer, v2, Vec2, Vec3, Node, v3 } from "cc";
import { Random } from "./Random";

/**
 * 转换节点坐标系
 * @param node 转换的节点
 * @param spaceNode 目标坐标系节点
 */
export function ConvertToNodeSpaceAR(node: Node, spaceNode: Node) {
  let out: Vec3 = v3();
  return spaceNode.inverseTransformPoint(out, node.getWorldPosition());
}

/**
 * 计算两个坐标的距离
 * @param p1
 * @param p2
 */
export function Distance(p1: Vec3, p2: Vec3) {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) +
      (p1.y - p2.y) * (p1.y - p2.y) +
      (p1.z - p2.z) * (p1.z - p2.z)
  );
}

/**
 * 计算两个rect交叉的面积
 */
export function AreaOf2CrossRect(rect1: Rect, rect2: Rect) {
  let a_min_x = rect1.x;
  let a_min_y = rect1.y;
  let a_max_x = rect1.x + rect1.width;
  let a_max_y = rect1.y + rect1.height;

  let b_min_x = rect2.x;
  let b_min_y = rect2.y;
  let b_max_x = rect2.x + rect2.width;
  let b_max_y = rect2.y + rect2.height;

  let width = 0,
    height = 0;

  width = Math.max(0, Math.min(a_max_x, b_max_x) - Math.max(a_min_x, b_min_x));
  height = Math.max(0, Math.min(a_max_y, b_max_y) - Math.max(a_min_y, b_min_y));

  return width * height;
}

/**
 * 数组乱序
 */
export function disOrderArray(array: any[]) {
  for (let i = 0; i < array.length; ++i) {
    let index = Random.randomFloorToInt(0, array.length);
    [array[i], array[index]] = [array[index], array[i]];
  }
}

export function Clamp(val: number, max: number, min: number) {
  return Math.max(Math.min(val, max), min);
}

export function IndexToi(index: number, modSize: number) {
  return Math.floor(index / modSize);
}

export function IndexToj(index: number, modSize: number) {
  return index % modSize;
}

/** 获取对应像素位置的rgb */
export function GetPixels(
  xInView: number,
  yInView: number,
  width: number = 10,
  height: number = 10
) {
  throw new Error("GetPixels");
}

/**
 * 获取旋转后的坐标点
 * @param point
 * @param angle
 * @param center
 * @param isFollowClock
 */
export function RotatePoint(
  point: Vec2,
  angle: number,
  center: Vec2 = v2(0, 0),
  isFollowClock: boolean = true
) {
  let direction = isFollowClock ? -1 : 1;
  let rad = (angle / 180) * Math.PI;
  let p = v2(point.x, point.y);
  point.x =
    (p.x - center.x) * Math.cos(direction * rad) -
    (p.y - center.y) * Math.sin(direction * rad) +
    center.x;

  point.y =
    (p.x - center.x) * Math.sin(direction * rad) +
    (p.y - center.y) * Math.cos(direction * rad) +
    center.y;
}

/** a-b减掉矩形 */
export function RectSub(a: Rect, rectB: Rect): Rect {
  let ax = a.x,
    ay = a.y,
    aw = a.width,
    ah = a.height;
  let bx = rectB.x,
    by = rectB.y,
    bw = rectB.width,
    bh = rectB.height;

  a.x = ax;
  a.y = ay + bh;
  a.height = Math.abs(ah - bh);

  return a;
}

/** 近似相等 */
export function Approx(a: number, b: number, maxDiff = 0.000001) {
  return Math.abs(a - b) <= maxDiff;
}
