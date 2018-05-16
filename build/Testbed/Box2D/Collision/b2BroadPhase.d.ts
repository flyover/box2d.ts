import { b2Vec2 } from "../Common/b2Math";
import { b2AABB, b2RayCastInput } from "./b2Collision";
import { b2TreeNode, b2DynamicTree } from "./b2DynamicTree";
import { b2ContactManager } from "../Dynamics/b2ContactManager";
export declare class b2Pair {
    proxyA: b2TreeNode | null;
    proxyB: b2TreeNode | null;
}
export declare class b2BroadPhase {
    m_tree: b2DynamicTree;
    m_proxyCount: number;
    m_moveCount: number;
    m_moveBuffer: b2TreeNode[];
    m_pairCount: number;
    m_pairBuffer: b2Pair[];
    CreateProxy(aabb: b2AABB, userData: any): b2TreeNode;
    DestroyProxy(proxy: b2TreeNode): void;
    MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): void;
    TouchProxy(proxy: b2TreeNode): void;
    GetFatAABB(proxy: b2TreeNode): b2AABB;
    GetUserData(proxy: b2TreeNode): any;
    TestOverlap(proxyA: b2TreeNode, proxyB: b2TreeNode): boolean;
    GetProxyCount(): number;
    UpdatePairs(contactManager: b2ContactManager): void;
    Query(callback: (node: b2TreeNode) => boolean, aabb: b2AABB): void;
    RayCast(callback: (input: b2RayCastInput, node: b2TreeNode) => number, input: b2RayCastInput): void;
    GetTreeHeight(): number;
    GetTreeBalance(): number;
    GetTreeQuality(): number;
    ShiftOrigin(newOrigin: b2Vec2): void;
    BufferMove(proxy: b2TreeNode): void;
    UnBufferMove(proxy: b2TreeNode): void;
}
export declare function b2PairLessThan(pair1: b2Pair, pair2: b2Pair): number;
