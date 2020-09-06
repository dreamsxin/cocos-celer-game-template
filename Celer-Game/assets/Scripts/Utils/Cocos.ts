

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