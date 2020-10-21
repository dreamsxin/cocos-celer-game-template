

/** 获取世界坐标 */
export function GetWorldPosition(node: cc.Node) {
    if (!node || !node.getParent || !node.getParent()) return cc.v2(0, 0);
    let parent = node.getParent();
    return parent.convertToWorldSpaceAR(node.position);
};

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
};

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

    let width = 0, height = 0;

    width = Math.max(0, Math.min(a_max_x, b_max_x) - Math.max(a_min_x, b_min_x));
    height = Math.max(0, Math.min(a_max_y, b_max_y) - Math.max(a_min_y, b_min_y));

    return width * height;
}