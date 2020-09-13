import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class DynamicTreeTest extends testbed.Test {
    static readonly e_actorCount = 128;
    m_worldExtent: number;
    m_proxyExtent: number;
    m_tree: box2d.b2DynamicTree<DynamicTreeTest_Actor>;
    m_queryAABB: box2d.b2AABB;
    m_rayCastInput: box2d.b2RayCastInput;
    m_rayCastOutput: box2d.b2RayCastOutput;
    m_rayActor: DynamicTreeTest_Actor | null;
    m_actors: DynamicTreeTest_Actor[];
    m_stepCount: number;
    m_automated: boolean;
    constructor();
    Step(settings: testbed.Settings): void;
    Keyboard(key: string): void;
    GetRandomAABB(aabb: box2d.b2AABB): void;
    MoveAABB(aabb: box2d.b2AABB): void;
    CreateProxy(): void;
    DestroyProxy(): void;
    MoveProxy(): void;
    Reset(): void;
    Action(): void;
    Query(): void;
    RayCast(): void;
    static Create(): testbed.Test;
}
export declare class DynamicTreeTest_Actor {
    aabb: box2d.b2AABB;
    fraction: number;
    overlap: boolean;
    proxyId: box2d.b2TreeNode<DynamicTreeTest_Actor> | null;
}
//# sourceMappingURL=dynamic_tree_test.d.ts.map