import { Random } from "./Random";

/** 获取世界坐标 */
export function GetWorldPosition(node: cc.Node) {
  if (!node || !node.getParent || !node.getParent()) return cc.v2(0, 0);
  let parent = node.getParent();
  return parent.convertToWorldSpaceAR(node.position);
}

/**
 * 转换节点坐标系
 * @param node 转换的节点
 * @param spaceNode 目标坐标系节点
 */
export function ConvertToNodeSpaceAR(node: cc.Node, spaceNode: cc.Node) {
  if (!spaceNode) return cc.v2(0, 0);
  let worldPos = GetWorldPosition(node);
  return spaceNode.convertToNodeSpaceAR(worldPos);
}

/**
 * 计算两个坐标的距离
 * @param p1
 * @param p2
 */
export function Distance(p1: cc.Vec2, p2: cc.Vec2) {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
  );
}

/**
 * 计算两个rect交叉的面积
 */
export function AreaOf2CrossRect(rect1: cc.Rect, rect2: cc.Rect) {
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

let mat4 = {
  mul: null,
};
mat4.mul = function (out, a, b) {
  let a00 = a.m00,
    a01 = a.m01,
    a02 = a.m02,
    a03 = a.m03,
    a10 = a.m04,
    a11 = a.m05,
    a12 = a.m06,
    a13 = a.m07,
    a20 = a.m08,
    a21 = a.m09,
    a22 = a.m10,
    a23 = a.m11,
    a30 = a.m12,
    a31 = a.m13,
    a32 = a.m14,
    a33 = a.m15;

  // Cache only the current line of the second matrix
  let b0 = b.m00,
    b1 = b.m01,
    b2 = b.m02,
    b3 = b.m03;
  out.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b.m04;
  b1 = b.m05;
  b2 = b.m06;
  b3 = b.m07;
  out.m04 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m05 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m06 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m07 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b.m08;
  b1 = b.m09;
  b2 = b.m10;
  b3 = b.m11;
  out.m08 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m09 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m10 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m11 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b.m12;
  b1 = b.m13;
  b2 = b.m14;
  b3 = b.m15;
  out.m12 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out.m13 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out.m14 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out.m15 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
};

function _getBoundingBoxTo(node: cc.Node, parentMat: any, exceptNode: cc.Node) {
  node["_updateLocalMatrix"]();
  let width = node["_contentSize"].width;
  let height = node["_contentSize"].height;
  let rect = cc.rect(
    -node["_anchorPoint"].x * width,
    -node["_anchorPoint"].y * height,
    width,
    height
  );

  parentMat = mat4.mul(node["_worldMatrix"], parentMat, node["_matrix"]);
  rect.transformMat4(rect, parentMat);

  //query child's BoundingBox
  if (!exceptNode) return rect;

  let rect2 = GetBoxToWorld(exceptNode);
  if (!rect2.intersects(rect)) return rect;

  let inter = rect2.intersection(rect2, rect);
  rect = RectSub(rect, inter);
  return rect;
}

export function GetBoxToWorld(node: cc.Node, exceptNode?: cc.Node) {
  if (node["_parent"]) {
    node["_parent"]._updateWorldMatrix();
    return _getBoundingBoxTo(node, node["_parent"]._worldMatrix, exceptNode);
  } else {
    return getBoundingBox(node, exceptNode);
  }
}

export function getBoundingBox(node: cc.Node, exceptNode: cc.Node) {
  node["_updateLocalMatrix"]();
  let width = node["_contentSize"].width;
  let height = node["_contentSize"].height;
  let rect = cc.rect(
    -node["_anchorPoint"].x * width,
    -node["_anchorPoint"].y * height,
    width,
    height
  );
  let res: any = rect.transformMat4(rect, node["_matrix"]);

  if (!exceptNode) return res;

  let rect2 = GetBoxToWorld(exceptNode);
  if (!rect2.intersects(rect)) return rect;
  let inter = rect2.intersection(rect2, rect);
  res = RectSub(res, inter);

  return res;
}

/** a-b减掉矩形 */
export function RectSub(a: cc.Rect, rectB: cc.Rect) {
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
