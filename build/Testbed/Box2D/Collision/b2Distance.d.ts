import { b2Vec2, b2Transform } from "../Common/b2Math";
import { b2Shape } from "./Shapes/b2Shape";
export declare class b2DistanceProxy {
    m_buffer: b2Vec2[];
    m_vertices: b2Vec2[];
    m_count: number;
    m_radius: number;
    Reset(): b2DistanceProxy;
    SetShape(shape: b2Shape, index: number): void;
    GetSupport(d: b2Vec2): number;
    GetSupportVertex(d: b2Vec2): b2Vec2;
    GetVertexCount(): number;
    GetVertex(index: number): b2Vec2;
}
export declare class b2SimplexCache {
    metric: number;
    count: number;
    indexA: number[];
    indexB: number[];
    Reset(): b2SimplexCache;
}
export declare class b2DistanceInput {
    proxyA: b2DistanceProxy;
    proxyB: b2DistanceProxy;
    transformA: b2Transform;
    transformB: b2Transform;
    useRadii: boolean;
    Reset(): b2DistanceInput;
}
export declare class b2DistanceOutput {
    pointA: b2Vec2;
    pointB: b2Vec2;
    distance: number;
    iterations: number;
    Reset(): b2DistanceOutput;
}
export declare let b2_gjkCalls: number;
export declare let b2_gjkIters: number;
export declare let b2_gjkMaxIters: number;
export declare class b2SimplexVertex {
    wA: b2Vec2;
    wB: b2Vec2;
    w: b2Vec2;
    a: number;
    indexA: number;
    indexB: number;
    Copy(other: b2SimplexVertex): b2SimplexVertex;
}
export declare class b2Simplex {
    m_v1: b2SimplexVertex;
    m_v2: b2SimplexVertex;
    m_v3: b2SimplexVertex;
    m_vertices: b2SimplexVertex[];
    m_count: number;
    constructor();
    ReadCache(cache: b2SimplexCache, proxyA: b2DistanceProxy, transformA: b2Transform, proxyB: b2DistanceProxy, transformB: b2Transform): void;
    WriteCache(cache: b2SimplexCache): void;
    GetSearchDirection(out: b2Vec2): b2Vec2;
    GetClosestPoint(out: b2Vec2): b2Vec2;
    GetWitnessPoints(pA: b2Vec2, pB: b2Vec2): void;
    GetMetric(): number;
    Solve2(): void;
    Solve3(): void;
    private static s_e12;
    private static s_e13;
    private static s_e23;
}
export declare function b2Distance(output: b2DistanceOutput, cache: b2SimplexCache, input: b2DistanceInput): void;
