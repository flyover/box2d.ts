import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class DynamicTreeTest extends testbed.Test {
    static readonly e_actorCount = 128;
    m_worldExtent: number;
    m_proxyExtent: number;
    m_tree: b2.DynamicTree<DynamicTreeTest_Actor>;
    m_queryAABB: b2.AABB;
    m_rayCastInput: b2.RayCastInput;
    m_rayCastOutput: b2.RayCastOutput;
    m_rayActor: DynamicTreeTest_Actor | null;
    m_actors: DynamicTreeTest_Actor[];
    m_stepCount: number;
    m_automated: boolean;
    constructor();
    Step(settings: testbed.Settings): void;
    Keyboard(key: string): void;
    GetRandomAABB(aabb: b2.AABB): void;
    MoveAABB(aabb: b2.AABB): void;
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
    aabb: b2.AABB;
    fraction: number;
    overlap: boolean;
    proxyId: b2.TreeNode<DynamicTreeTest_Actor> | null;
}
