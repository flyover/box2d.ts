import { b2Vec2, b2Transform } from "../Common/b2Math";
import { b2Shape } from "./Shapes/b2Shape";
export declare const enum b2ContactFeatureType {
    e_vertex = 0,
    e_face = 1,
}
export declare class b2ContactFeature {
    _key: number;
    _key_invalid: boolean;
    _indexA: number;
    _indexB: number;
    _typeA: number;
    _typeB: number;
    constructor();
    key: number;
    indexA: number;
    indexB: number;
    typeA: number;
    typeB: number;
}
export declare class b2ContactID {
    cf: b2ContactFeature;
    Copy(o: b2ContactID): b2ContactID;
    Clone(): b2ContactID;
    key: number;
}
export declare class b2ManifoldPoint {
    localPoint: b2Vec2;
    normalImpulse: number;
    tangentImpulse: number;
    id: b2ContactID;
    static MakeArray(length: number): b2ManifoldPoint[];
    Reset(): void;
    Copy(o: b2ManifoldPoint): b2ManifoldPoint;
}
export declare const enum b2ManifoldType {
    e_unknown = -1,
    e_circles = 0,
    e_faceA = 1,
    e_faceB = 2,
}
export declare class b2Manifold {
    points: b2ManifoldPoint[];
    localNormal: b2Vec2;
    localPoint: b2Vec2;
    type: number;
    pointCount: number;
    Reset(): void;
    Copy(o: b2Manifold): b2Manifold;
    Clone(): b2Manifold;
}
export declare class b2WorldManifold {
    normal: b2Vec2;
    points: b2Vec2[];
    separations: number[];
    private static Initialize_s_pointA;
    private static Initialize_s_pointB;
    private static Initialize_s_cA;
    private static Initialize_s_cB;
    private static Initialize_s_planePoint;
    private static Initialize_s_clipPoint;
    Initialize(manifold: b2Manifold, xfA: b2Transform, radiusA: number, xfB: b2Transform, radiusB: number): void;
}
export declare const enum b2PointState {
    b2_nullState = 0,
    b2_addState = 1,
    b2_persistState = 2,
    b2_removeState = 3,
}
export declare function b2GetPointStates(state1: b2PointState[], state2: b2PointState[], manifold1: b2Manifold, manifold2: b2Manifold): void;
export declare class b2ClipVertex {
    v: b2Vec2;
    id: b2ContactID;
    static MakeArray(length: number): b2ClipVertex[];
    Copy(other: b2ClipVertex): b2ClipVertex;
}
export declare class b2RayCastInput {
    p1: b2Vec2;
    p2: b2Vec2;
    maxFraction: number;
    Copy(o: b2RayCastInput): b2RayCastInput;
}
export declare class b2RayCastOutput {
    normal: b2Vec2;
    fraction: number;
    Copy(o: b2RayCastOutput): b2RayCastOutput;
}
export declare class b2AABB {
    lowerBound: b2Vec2;
    upperBound: b2Vec2;
    private m_cache_center;
    private m_cache_extent;
    Copy(o: b2AABB): b2AABB;
    IsValid(): boolean;
    GetCenter(): b2Vec2;
    GetExtents(): b2Vec2;
    GetPerimeter(): number;
    Combine1(aabb: b2AABB): b2AABB;
    Combine2(aabb1: b2AABB, aabb2: b2AABB): b2AABB;
    static Combine(aabb1: b2AABB, aabb2: b2AABB, out: b2AABB): b2AABB;
    Contains(aabb: b2AABB): boolean;
    RayCast(output: b2RayCastOutput, input: b2RayCastInput): boolean;
    TestOverlap(other: b2AABB): boolean;
}
export declare function b2TestOverlapAABB(a: b2AABB, b: b2AABB): boolean;
export declare function b2ClipSegmentToLine(vOut: b2ClipVertex[], vIn: b2ClipVertex[], normal: b2Vec2, offset: number, vertexIndexA: number): number;
export declare function b2TestOverlapShape(shapeA: b2Shape, indexA: number, shapeB: b2Shape, indexB: number, xfA: b2Transform, xfB: b2Transform): boolean;
