import { b2Vec2, b2Transform } from "../Common/b2Math";
import { b2BroadPhase } from "../Collision/b2BroadPhase";
import { b2AABB, b2RayCastInput, b2RayCastOutput } from "../Collision/b2Collision";
import { b2TreeNode } from "../Collision/b2DynamicTree";
import { b2Shape, b2ShapeType, b2MassData } from "../Collision/Shapes/b2Shape";
import { b2Body } from "./b2Body";
export declare class b2Filter {
    categoryBits: number;
    maskBits: number;
    groupIndex: number;
    Clone(): b2Filter;
    Copy(other: b2Filter): b2Filter;
}
export declare class b2FixtureDef {
    shape: b2Shape;
    userData: any;
    friction: number;
    restitution: number;
    density: number;
    isSensor: boolean;
    filter: b2Filter;
}
export declare class b2FixtureProxy {
    aabb: b2AABB;
    fixture: b2Fixture;
    childIndex: number;
    proxy: b2TreeNode;
    static MakeArray(length: number): b2FixtureProxy[];
}
export declare class b2Fixture {
    m_density: number;
    m_next: b2Fixture;
    m_body: b2Body;
    m_shape: b2Shape;
    m_friction: number;
    m_restitution: number;
    m_proxies: b2FixtureProxy[];
    m_proxyCount: number;
    m_filter: b2Filter;
    m_isSensor: boolean;
    m_userData: any;
    GetType(): b2ShapeType;
    GetShape(): b2Shape;
    SetSensor(sensor: boolean): void;
    IsSensor(): boolean;
    SetFilterData(filter: b2Filter): void;
    GetFilterData(): b2Filter;
    Refilter(): void;
    GetBody(): b2Body;
    GetNext(): b2Fixture;
    GetUserData(): any;
    SetUserData(data: any): void;
    TestPoint(p: b2Vec2): boolean;
    ComputeDistance(p: b2Vec2, normal: b2Vec2, childIndex: number): number;
    RayCast(output: b2RayCastOutput, input: b2RayCastInput, childIndex: number): boolean;
    GetMassData(massData?: b2MassData): b2MassData;
    SetDensity(density: number): void;
    GetDensity(): number;
    GetFriction(): number;
    SetFriction(friction: number): void;
    GetRestitution(): number;
    SetRestitution(restitution: number): void;
    GetAABB(childIndex: number): b2AABB;
    Dump(log: (format: string, ...args: any[]) => void, bodyIndex: number): void;
    Create(body: b2Body, def: b2FixtureDef): void;
    Destroy(): void;
    CreateProxies(broadPhase: b2BroadPhase, xf: b2Transform): void;
    DestroyProxies(broadPhase: b2BroadPhase): void;
    private static Synchronize_s_aabb1;
    private static Synchronize_s_aabb2;
    private static Synchronize_s_displacement;
    Synchronize(broadPhase: b2BroadPhase, transform1: b2Transform, transform2: b2Transform): void;
}
