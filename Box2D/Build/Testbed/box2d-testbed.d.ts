declare module "Box2D/Common/b2Settings" {
    export function b2Assert(condition: boolean, ...args: any[]): void;
    export const b2_maxFloat: number;
    export const b2_epsilon: number;
    export const b2_epsilon_sq: number;
    export const b2_pi: number;
    export const b2_maxManifoldPoints: number;
    export const b2_maxPolygonVertices: number;
    export const b2_aabbExtension: number;
    export const b2_aabbMultiplier: number;
    export const b2_linearSlop: number;
    export const b2_angularSlop: number;
    export const b2_polygonRadius: number;
    export const b2_maxSubSteps: number;
    export const b2_maxTOIContacts: number;
    export const b2_velocityThreshold: number;
    export const b2_maxLinearCorrection: number;
    export const b2_maxAngularCorrection: number;
    export const b2_maxTranslation: number;
    export const b2_maxTranslationSquared: number;
    export const b2_maxRotation: number;
    export const b2_maxRotationSquared: number;
    export const b2_baumgarte: number;
    export const b2_toiBaumgarte: number;
    export const b2_timeToSleep: number;
    export const b2_linearSleepTolerance: number;
    export const b2_angularSleepTolerance: number;
    export function b2Alloc(size: number): any;
    export function b2Free(mem: any): void;
    export function b2Log(message: string, ...args: any[]): void;
    export class b2Version {
        major: number;
        minor: number;
        revision: number;
        constructor(major?: number, minor?: number, revision?: number);
        toString(): string;
    }
    export const b2_version: b2Version;
    export const b2_changelist: number;
    export function b2ParseInt(v: string): number;
    export function b2ParseUInt(v: string): number;
    export function b2MakeArray(length: number, init: {
        (i: number): any;
    }): any[];
    export function b2MakeNullArray(length: number): any[];
    export function b2MakeNumberArray(length: number, init?: number): number[];
}
declare module "Box2D/Common/b2Math" {
    export const b2_pi_over_180: number;
    export const b2_180_over_pi: number;
    export const b2_two_pi: number;
    export function b2Abs(n: number): number;
    export function b2Min(a: number, b: number): number;
    export function b2Max(a: number, b: number): number;
    export function b2Clamp(a: number, lo: number, hi: number): number;
    export function b2Swap(a: any[], b: any[]): void;
    export function b2IsValid(n: number): boolean;
    export function b2Sq(n: number): number;
    export function b2InvSqrt(n: number): number;
    export function b2Sqrt(n: number): number;
    export function b2Pow(x: number, y: number): number;
    export function b2DegToRad(degrees: number): number;
    export function b2RadToDeg(radians: number): number;
    export function b2Cos(radians: number): number;
    export function b2Sin(radians: number): number;
    export function b2Acos(n: number): number;
    export function b2Asin(n: number): number;
    export function b2Atan2(y: number, x: number): number;
    export function b2NextPowerOfTwo(x: number): number;
    export function b2IsPowerOfTwo(x: number): boolean;
    export function b2Random(): number;
    export function b2RandomRange(lo: number, hi: number): number;
    export class b2Vec2 {
        static ZERO: b2Vec2;
        static UNITX: b2Vec2;
        static UNITY: b2Vec2;
        static s_t0: b2Vec2;
        static s_t1: b2Vec2;
        static s_t2: b2Vec2;
        static s_t3: b2Vec2;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        Clone(): b2Vec2;
        SetZero(): b2Vec2;
        Set(x: number, y: number): b2Vec2;
        Copy(other: b2Vec2): b2Vec2;
        SelfAdd(v: b2Vec2): b2Vec2;
        SelfAddXY(x: number, y: number): b2Vec2;
        SelfSub(v: b2Vec2): b2Vec2;
        SelfSubXY(x: number, y: number): b2Vec2;
        SelfMul(s: number): b2Vec2;
        SelfMulAdd(s: number, v: b2Vec2): b2Vec2;
        SelfMulSub(s: number, v: b2Vec2): b2Vec2;
        Dot(v: b2Vec2): number;
        Cross(v: b2Vec2): number;
        Length(): number;
        LengthSquared(): number;
        Normalize(): number;
        SelfNormalize(): b2Vec2;
        SelfRotate(radians: number): b2Vec2;
        IsValid(): boolean;
        SelfCrossVS(s: number): b2Vec2;
        SelfCrossSV(s: number): b2Vec2;
        SelfMinV(v: b2Vec2): b2Vec2;
        SelfMaxV(v: b2Vec2): b2Vec2;
        SelfAbs(): b2Vec2;
        SelfNeg(): b2Vec2;
        SelfSkew(): b2Vec2;
        static MakeArray(length: number): b2Vec2[];
        static AbsV(v: b2Vec2, out: b2Vec2): b2Vec2;
        static MinV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
        static MaxV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
        static ClampV(v: b2Vec2, lo: b2Vec2, hi: b2Vec2, out: b2Vec2): b2Vec2;
        static RotateV(v: b2Vec2, radians: number, out: b2Vec2): b2Vec2;
        static DotVV(a: b2Vec2, b: b2Vec2): number;
        static CrossVV(a: b2Vec2, b: b2Vec2): number;
        static CrossVS(v: b2Vec2, s: number, out: b2Vec2): b2Vec2;
        static CrossVOne(v: b2Vec2, out: b2Vec2): b2Vec2;
        static CrossSV(s: number, v: b2Vec2, out: b2Vec2): b2Vec2;
        static CrossOneV(v: b2Vec2, out: b2Vec2): b2Vec2;
        static AddVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
        static SubVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
        static MulSV(s: number, v: b2Vec2, out: b2Vec2): b2Vec2;
        static AddVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
        static SubVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
        static AddVCrossSV(a: b2Vec2, s: number, v: b2Vec2, out: b2Vec2): b2Vec2;
        static MidVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
        static ExtVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
        static IsEqualToV(a: b2Vec2, b: b2Vec2): boolean;
        static DistanceVV(a: b2Vec2, b: b2Vec2): number;
        static DistanceSquaredVV(a: b2Vec2, b: b2Vec2): number;
        static NegV(v: b2Vec2, out: b2Vec2): b2Vec2;
    }
    export const b2Vec2_zero: b2Vec2;
    export class b2Vec3 {
        static ZERO: b2Vec3;
        static s_t0: b2Vec3;
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        Clone(): b2Vec3;
        SetZero(): b2Vec3;
        SetXYZ(x: number, y: number, z: number): b2Vec3;
        Copy(other: b2Vec3): b2Vec3;
        SelfNeg(): b2Vec3;
        SelfAdd(v: b2Vec3): b2Vec3;
        SelfAddXYZ(x: number, y: number, z: number): b2Vec3;
        SelfSub(v: b2Vec3): b2Vec3;
        SelfSubXYZ(x: number, y: number, z: number): b2Vec3;
        SelfMul(s: number): b2Vec3;
        static DotV3V3(a: b2Vec3, b: b2Vec3): number;
        static CrossV3V3(a: b2Vec3, b: b2Vec3, out: b2Vec3): b2Vec3;
    }
    export class b2Mat22 {
        static IDENTITY: b2Mat22;
        ex: b2Vec2;
        ey: b2Vec2;
        Clone(): b2Mat22;
        static FromVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        static FromSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        static FromAngle(radians: number): b2Mat22;
        SetSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        SetVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        SetAngle(radians: number): b2Mat22;
        Copy(other: b2Mat22): b2Mat22;
        SetIdentity(): b2Mat22;
        SetZero(): b2Mat22;
        GetAngle(): number;
        GetInverse(out: b2Mat22): b2Mat22;
        Solve(b_x: number, b_y: number, out: b2Vec2): b2Vec2;
        SelfAbs(): b2Mat22;
        SelfInv(): b2Mat22;
        SelfAddM(M: b2Mat22): b2Mat22;
        SelfSubM(M: b2Mat22): b2Mat22;
        static AbsM(M: b2Mat22, out: b2Mat22): b2Mat22;
        static MulMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Vec2;
        static MulTMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Vec2;
        static AddMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
        static MulMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
        static MulTMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    }
    export class b2Mat33 {
        static IDENTITY: b2Mat33;
        ex: b2Vec3;
        ey: b2Vec3;
        ez: b2Vec3;
        Clone(): b2Mat33;
        SetVVV(c1: b2Vec3, c2: b2Vec3, c3: b2Vec3): b2Mat33;
        Copy(other: b2Mat33): b2Mat33;
        SetIdentity(): b2Mat33;
        SetZero(): b2Mat33;
        SelfAddM(M: b2Mat33): b2Mat33;
        Solve33(b_x: number, b_y: number, b_z: number, out: b2Vec3): b2Vec3;
        Solve22(b_x: number, b_y: number, out: b2Vec2): b2Vec2;
        GetInverse22(M: b2Mat33): void;
        GetSymInverse33(M: b2Mat33): void;
        static MulM33V3(A: b2Mat33, v: b2Vec3, out: b2Vec3): b2Vec3;
        static MulM33XYZ(A: b2Mat33, x: number, y: number, z: number, out: b2Vec3): b2Vec3;
        static MulM33V2(A: b2Mat33, v: b2Vec2, out: b2Vec2): b2Vec2;
        static MulM33XY(A: b2Mat33, x: number, y: number, out: b2Vec2): b2Vec2;
    }
    export class b2Rot {
        static IDENTITY: b2Rot;
        s: number;
        c: number;
        constructor(angle?: number);
        Clone(): b2Rot;
        Copy(other: b2Rot): b2Rot;
        SetAngle(angle: number): b2Rot;
        SetIdentity(): b2Rot;
        GetAngle(): number;
        GetXAxis(out: b2Vec2): b2Vec2;
        GetYAxis(out: b2Vec2): b2Vec2;
        static MulRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
        static MulTRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
        static MulRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Vec2;
        static MulTRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Vec2;
    }
    export class b2Transform {
        static IDENTITY: b2Transform;
        p: b2Vec2;
        q: b2Rot;
        Clone(): b2Transform;
        Copy(other: b2Transform): b2Transform;
        SetIdentity(): b2Transform;
        SetPositionRotation(position: b2Vec2, q: b2Rot): b2Transform;
        SetPositionAngle(pos: b2Vec2, a: number): b2Transform;
        SetPosition(position: b2Vec2): b2Transform;
        SetPositionXY(x: number, y: number): b2Transform;
        SetRotation(rotation: b2Rot): b2Transform;
        SetRotationAngle(radians: number): b2Transform;
        GetPosition(): b2Vec2;
        GetRotation(): b2Rot;
        GetRotationAngle(): number;
        GetAngle(): number;
        static MulXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2;
        static MulTXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2;
        static MulXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
        static MulTXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
    }
    export class b2Sweep {
        localCenter: b2Vec2;
        c0: b2Vec2;
        c: b2Vec2;
        a0: number;
        a: number;
        alpha0: number;
        Clone(): b2Sweep;
        Copy(other: b2Sweep): b2Sweep;
        GetTransform(xf: b2Transform, beta: number): b2Transform;
        Advance(alpha: number): void;
        Normalize(): void;
    }
}
declare module "Box2D/Common/b2Draw" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    export class b2Color {
        static RED: b2Color;
        static GREEN: b2Color;
        static BLUE: b2Color;
        private _r;
        private _g;
        private _b;
        constructor(rr: number, gg: number, bb: number);
        SetRGB(rr: number, gg: number, bb: number): b2Color;
        MakeStyleString(alpha?: number): string;
        static MakeStyleString(r: number, g: number, b: number, a?: number): string;
    }
    export const enum b2DrawFlags {
        e_none = 0,
        e_shapeBit = 1,
        e_jointBit = 2,
        e_aabbBit = 4,
        e_pairBit = 8,
        e_centerOfMassBit = 16,
        e_controllerBit = 32,
        e_all = 63,
    }
    export class b2Draw {
        m_drawFlags: b2DrawFlags;
        SetFlags(flags: b2DrawFlags): void;
        GetFlags(): b2DrawFlags;
        AppendFlags(flags: b2DrawFlags): void;
        ClearFlags(flags: b2DrawFlags): void;
        PushTransform(xf: b2Transform): void;
        PopTransform(xf: b2Transform): void;
        DrawPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void;
        DrawSolidPolygon(vertices: b2Vec2[], vertexCount: number, color: b2Color): void;
        DrawCircle(center: b2Vec2, radius: number, color: b2Color): void;
        DrawSolidCircle(center: b2Vec2, radius: number, axis: b2Vec2, color: b2Color): void;
        DrawSegment(p1: b2Vec2, p2: b2Vec2, color: b2Color): void;
        DrawTransform(xf: b2Transform): void;
    }
}
declare module "Box2D/Common/b2Timer" {
    export class b2Timer {
        m_start: number;
        Reset(): b2Timer;
        GetMilliseconds(): number;
    }
    export class b2Counter {
        m_count: number;
        m_min_count: number;
        m_max_count: number;
        GetCount(): number;
        GetMinCount(): number;
        GetMaxCount(): number;
        ResetCount(): number;
        ResetMinCount(): void;
        ResetMaxCount(): void;
        Increment(): void;
        Decrement(): void;
    }
}
declare module "Box2D/Common/b2GrowableStack" {
    export class b2GrowableStack {
        m_stack: any[];
        m_count: number;
        constructor(N: number);
        Reset(): b2GrowableStack;
        Push(element: any): void;
        Pop(): any;
        GetCount(): number;
    }
}
declare module "Box2D/Common/b2BlockAllocator" {
    export class b2BlockAllocator {
    }
}
declare module "Box2D/Common/b2StackAllocator" {
    export class b2StackAllocator {
    }
}
declare module "Box2D/Collision/b2Distance" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2Shape } from "Box2D/Collision/Shapes/b2Shape";
    export class b2DistanceProxy {
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
    export class b2SimplexCache {
        metric: number;
        count: number;
        indexA: number[];
        indexB: number[];
        Reset(): b2SimplexCache;
    }
    export class b2DistanceInput {
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        transformA: b2Transform;
        transformB: b2Transform;
        useRadii: boolean;
        Reset(): b2DistanceInput;
    }
    export class b2DistanceOutput {
        pointA: b2Vec2;
        pointB: b2Vec2;
        distance: number;
        iterations: number;
        Reset(): b2DistanceOutput;
    }
    export let b2_gjkCalls: number;
    export let b2_gjkIters: number;
    export let b2_gjkMaxIters: number;
    export class b2SimplexVertex {
        wA: b2Vec2;
        wB: b2Vec2;
        w: b2Vec2;
        a: number;
        indexA: number;
        indexB: number;
        Copy(other: b2SimplexVertex): b2SimplexVertex;
    }
    export class b2Simplex {
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
    export function b2Distance(output: b2DistanceOutput, cache: b2SimplexCache, input: b2DistanceInput): void;
}
declare module "Box2D/Collision/Shapes/b2Shape" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Collision/b2Distance";
    export class b2MassData {
        mass: number;
        center: b2Vec2;
        I: number;
    }
    export const enum b2ShapeType {
        e_unknown = -1,
        e_circleShape = 0,
        e_edgeShape = 1,
        e_polygonShape = 2,
        e_chainShape = 3,
        e_shapeTypeCount = 4,
    }
    export class b2Shape {
        m_type: b2ShapeType;
        m_radius: number;
        constructor(type: b2ShapeType, radius: number);
        Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetType(): b2ShapeType;
        GetChildCount(): number;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: number): boolean;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Collision/b2Collision" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2Shape } from "Box2D/Collision/Shapes/b2Shape";
    export const enum b2ContactFeatureType {
        e_vertex = 0,
        e_face = 1,
    }
    export class b2ContactFeature {
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
    export class b2ContactID {
        cf: b2ContactFeature;
        Copy(o: b2ContactID): b2ContactID;
        Clone(): b2ContactID;
        key: number;
    }
    export class b2ManifoldPoint {
        localPoint: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        id: b2ContactID;
        static MakeArray(length: number): b2ManifoldPoint[];
        Reset(): void;
        Copy(o: b2ManifoldPoint): b2ManifoldPoint;
    }
    export const enum b2ManifoldType {
        e_unknown = -1,
        e_circles = 0,
        e_faceA = 1,
        e_faceB = 2,
    }
    export class b2Manifold {
        points: b2ManifoldPoint[];
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        type: number;
        pointCount: number;
        Reset(): void;
        Copy(o: b2Manifold): b2Manifold;
        Clone(): b2Manifold;
    }
    export class b2WorldManifold {
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
    export const enum b2PointState {
        b2_nullState = 0,
        b2_addState = 1,
        b2_persistState = 2,
        b2_removeState = 3,
    }
    export function b2GetPointStates(state1: b2PointState[], state2: b2PointState[], manifold1: b2Manifold, manifold2: b2Manifold): void;
    export class b2ClipVertex {
        v: b2Vec2;
        id: b2ContactID;
        static MakeArray(length: number): b2ClipVertex[];
        Copy(other: b2ClipVertex): b2ClipVertex;
    }
    export class b2RayCastInput {
        p1: b2Vec2;
        p2: b2Vec2;
        maxFraction: number;
        Copy(o: b2RayCastInput): b2RayCastInput;
    }
    export class b2RayCastOutput {
        normal: b2Vec2;
        fraction: number;
        Copy(o: b2RayCastOutput): b2RayCastOutput;
    }
    export class b2AABB {
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
    export function b2TestOverlapAABB(a: b2AABB, b: b2AABB): boolean;
    export function b2ClipSegmentToLine(vOut: b2ClipVertex[], vIn: b2ClipVertex[], normal: b2Vec2, offset: number, vertexIndexA: number): number;
    export function b2TestOverlapShape(shapeA: b2Shape, indexA: number, shapeB: b2Shape, indexB: number, xfA: b2Transform, xfB: b2Transform): boolean;
}
declare module "Box2D/Collision/b2DynamicTree" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    import { b2GrowableStack } from "Box2D/Common/b2GrowableStack";
    import { b2AABB, b2RayCastInput } from "Box2D/Collision/b2Collision";
    export class b2TreeNode {
        m_id: number;
        aabb: b2AABB;
        userData: any;
        parent: b2TreeNode;
        child1: b2TreeNode;
        child2: b2TreeNode;
        height: number;
        constructor(id?: number);
        IsLeaf(): boolean;
    }
    export class b2DynamicTree {
        m_root: b2TreeNode;
        m_freeList: b2TreeNode;
        m_path: number;
        m_insertionCount: number;
        static s_stack: b2GrowableStack;
        static s_r: b2Vec2;
        static s_v: b2Vec2;
        static s_abs_v: b2Vec2;
        static s_segmentAABB: b2AABB;
        static s_subInput: b2RayCastInput;
        static s_combinedAABB: b2AABB;
        static s_aabb: b2AABB;
        GetUserData(proxy: b2TreeNode): any;
        GetFatAABB(proxy: b2TreeNode): b2AABB;
        Query(callback: (node: b2TreeNode) => boolean, aabb: b2AABB): void;
        RayCast(callback: (input: b2RayCastInput, node: b2TreeNode) => number, input: b2RayCastInput): void;
        static s_node_id: number;
        AllocateNode(): b2TreeNode;
        FreeNode(node: b2TreeNode): void;
        CreateProxy(aabb: b2AABB, userData: any): b2TreeNode;
        DestroyProxy(proxy: b2TreeNode): void;
        MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): boolean;
        InsertLeaf(leaf: b2TreeNode): void;
        RemoveLeaf(leaf: b2TreeNode): void;
        Balance(A: b2TreeNode): b2TreeNode;
        GetHeight(): number;
        private static GetAreaNode(node);
        GetAreaRatio(): number;
        ComputeHeightNode(node: b2TreeNode): number;
        ComputeHeight(): number;
        ValidateStructure(index: b2TreeNode): void;
        ValidateMetrics(index: b2TreeNode): void;
        Validate(): void;
        private static GetMaxBalanceNode(node, maxBalance);
        GetMaxBalance(): number;
        RebuildBottomUp(): void;
        private static ShiftOriginNode(node, newOrigin);
        ShiftOrigin(newOrigin: b2Vec2): void;
    }
}
declare module "Box2D/Collision/b2TimeOfImpact" {
    import { b2Vec2, b2Sweep } from "Box2D/Common/b2Math";
    import { b2DistanceProxy, b2SimplexCache } from "Box2D/Collision/b2Distance";
    export let b2_toiTime: number;
    export let b2_toiMaxTime: number;
    export let b2_toiCalls: number;
    export let b2_toiIters: number;
    export let b2_toiMaxIters: number;
    export let b2_toiRootIters: number;
    export let b2_toiMaxRootIters: number;
    export class b2TOIInput {
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        sweepA: b2Sweep;
        sweepB: b2Sweep;
        tMax: number;
    }
    export const enum b2TOIOutputState {
        e_unknown = 0,
        e_failed = 1,
        e_overlapped = 2,
        e_touching = 3,
        e_separated = 4,
    }
    export class b2TOIOutput {
        state: b2TOIOutputState;
        t: number;
    }
    export const enum b2SeparationFunctionType {
        e_unknown = -1,
        e_points = 0,
        e_faceA = 1,
        e_faceB = 2,
    }
    export class b2SeparationFunction {
        m_proxyA: b2DistanceProxy;
        m_proxyB: b2DistanceProxy;
        m_sweepA: b2Sweep;
        m_sweepB: b2Sweep;
        m_type: b2SeparationFunctionType;
        m_localPoint: b2Vec2;
        m_axis: b2Vec2;
        Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, sweepA: b2Sweep, proxyB: b2DistanceProxy, sweepB: b2Sweep, t1: number): number;
        FindMinSeparation(indexA: number[], indexB: number[], t: number): number;
        Evaluate(indexA: number, indexB: number, t: number): number;
    }
    export function b2TimeOfImpact(output: b2TOIOutput, input: b2TOIInput): void;
}
declare module "Box2D/Dynamics/b2TimeStep" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    export class b2Profile {
        step: number;
        collide: number;
        solve: number;
        solveInit: number;
        solveVelocity: number;
        solvePosition: number;
        broadphase: number;
        solveTOI: number;
        Reset(): this;
    }
    export class b2TimeStep {
        dt: number;
        inv_dt: number;
        dtRatio: number;
        velocityIterations: number;
        positionIterations: number;
        warmStarting: boolean;
        Copy(step: b2TimeStep): b2TimeStep;
    }
    export class b2Position {
        c: b2Vec2;
        a: number;
        static MakeArray(length: number): b2Position[];
    }
    export class b2Velocity {
        v: b2Vec2;
        w: number;
        static MakeArray(length: number): b2Velocity[];
    }
    export class b2SolverData {
        step: b2TimeStep;
        positions: b2Position[];
        velocities: b2Velocity[];
    }
}
declare module "Box2D/Dynamics/Joints/b2Joint" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export const enum b2JointType {
        e_unknownJoint = 0,
        e_revoluteJoint = 1,
        e_prismaticJoint = 2,
        e_distanceJoint = 3,
        e_pulleyJoint = 4,
        e_mouseJoint = 5,
        e_gearJoint = 6,
        e_wheelJoint = 7,
        e_weldJoint = 8,
        e_frictionJoint = 9,
        e_ropeJoint = 10,
        e_motorJoint = 11,
        e_areaJoint = 12,
    }
    export const enum b2LimitState {
        e_inactiveLimit = 0,
        e_atLowerLimit = 1,
        e_atUpperLimit = 2,
        e_equalLimits = 3,
    }
    export class b2Jacobian {
        linear: b2Vec2;
        angularA: number;
        angularB: number;
        SetZero(): b2Jacobian;
        Set(x: b2Vec2, a1: number, a2: number): b2Jacobian;
    }
    export class b2JointEdge {
        other: b2Body;
        joint: b2Joint;
        prev: b2JointEdge;
        next: b2JointEdge;
    }
    export class b2JointDef {
        type: b2JointType;
        userData: any;
        bodyA: b2Body;
        bodyB: b2Body;
        collideConnected: boolean;
        constructor(type: b2JointType);
    }
    export class b2Joint {
        m_type: b2JointType;
        m_prev: b2Joint;
        m_next: b2Joint;
        m_edgeA: b2JointEdge;
        m_edgeB: b2JointEdge;
        m_bodyA: b2Body;
        m_bodyB: b2Body;
        m_index: number;
        m_islandFlag: boolean;
        m_collideConnected: boolean;
        m_userData: any;
        constructor(def: b2JointDef);
        GetType(): b2JointType;
        GetBodyA(): b2Body;
        GetBodyB(): b2Body;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetNext(): b2Joint;
        GetUserData(): any;
        SetUserData(data: any): void;
        IsActive(): boolean;
        GetCollideConnected(): boolean;
        Dump(log: (format: string, ...args: any[]) => void): void;
        ShiftOrigin(newOrigin: b2Vec2): void;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }
}
declare module "Box2D/Dynamics/b2Fixture" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2BroadPhase } from "Box2D/Collision/b2BroadPhase";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Collision/b2Collision";
    import { b2TreeNode } from "Box2D/Collision/b2DynamicTree";
    import { b2Shape, b2ShapeType, b2MassData } from "Box2D/Collision/Shapes/b2Shape";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    export class b2Filter {
        categoryBits: number;
        maskBits: number;
        groupIndex: number;
        Clone(): b2Filter;
        Copy(other: b2Filter): b2Filter;
    }
    export class b2FixtureDef {
        shape: b2Shape;
        userData: any;
        friction: number;
        restitution: number;
        density: number;
        isSensor: boolean;
        filter: b2Filter;
    }
    export class b2FixtureProxy {
        aabb: b2AABB;
        fixture: b2Fixture;
        childIndex: number;
        proxy: b2TreeNode;
        static MakeArray(length: number): b2FixtureProxy[];
    }
    export class b2Fixture {
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
}
declare module "Box2D/Collision/Shapes/b2EdgeShape" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Collision/Shapes/b2Shape";
    export class b2EdgeShape extends b2Shape {
        m_vertex1: b2Vec2;
        m_vertex2: b2Vec2;
        m_vertex0: b2Vec2;
        m_vertex3: b2Vec2;
        m_hasVertex0: boolean;
        m_hasVertex3: boolean;
        constructor();
        Set(v1: b2Vec2, v2: b2Vec2): b2EdgeShape;
        Clone(): b2EdgeShape;
        Copy(other: b2EdgeShape): b2EdgeShape;
        GetChildCount(): number;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        private static RayCast_s_p1;
        private static RayCast_s_p2;
        private static RayCast_s_d;
        private static RayCast_s_e;
        private static RayCast_s_q;
        private static RayCast_s_r;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        private static ComputeAABB_s_v1;
        private static ComputeAABB_s_v2;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Collision/Shapes/b2ChainShape" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Collision/Shapes/b2Shape";
    import { b2EdgeShape } from "Box2D/Collision/Shapes/b2EdgeShape";
    export class b2ChainShape extends b2Shape {
        m_vertices: b2Vec2[];
        m_count: number;
        m_prevVertex: b2Vec2;
        m_nextVertex: b2Vec2;
        m_hasPrevVertex: boolean;
        m_hasNextVertex: boolean;
        constructor();
        CreateLoop(vertices: b2Vec2[], count?: number): b2ChainShape;
        CreateChain(vertices: b2Vec2[], count?: number): b2ChainShape;
        SetPrevVertex(prevVertex: b2Vec2): b2ChainShape;
        SetNextVertex(nextVertex: b2Vec2): b2ChainShape;
        Clone(): b2ChainShape;
        Copy(other: b2ChainShape): b2ChainShape;
        GetChildCount(): number;
        GetChildEdge(edge: b2EdgeShape, index: number): void;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        private static RayCast_s_edgeShape;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        private static ComputeAABB_s_v1;
        private static ComputeAABB_s_v2;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Collision/Shapes/b2CircleShape" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Collision/Shapes/b2Shape";
    export class b2CircleShape extends b2Shape {
        m_p: b2Vec2;
        constructor(radius?: number);
        Clone(): b2CircleShape;
        Copy(other: b2CircleShape): b2CircleShape;
        GetChildCount(): number;
        private static TestPoint_s_center;
        private static TestPoint_s_d;
        TestPoint(transform: b2Transform, p: b2Vec2): boolean;
        private static RayCast_s_position;
        private static RayCast_s_s;
        private static RayCast_s_r;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: number): boolean;
        private static ComputeAABB_s_p;
        ComputeAABB(aabb: b2AABB, transform: b2Transform, childIndex: number): void;
        ComputeMass(massData: b2MassData, density: number): void;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Collision/Shapes/b2PolygonShape" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Collision/Shapes/b2Shape";
    export class b2PolygonShape extends b2Shape {
        m_centroid: b2Vec2;
        m_vertices: b2Vec2[];
        m_normals: b2Vec2[];
        m_count: number;
        constructor();
        Clone(): b2PolygonShape;
        Copy(other: b2PolygonShape): b2PolygonShape;
        GetChildCount(): number;
        private static Set_s_ps;
        private static Set_s_hull;
        private static Set_s_r;
        private static Set_s_v;
        Set(vertices: b2Vec2[], count?: number, start?: number): b2PolygonShape;
        SetAsArray(vertices: b2Vec2[], count?: number): b2PolygonShape;
        SetAsBox(hx: number, hy: number): b2PolygonShape;
        SetAsOrientedBox(hx: number, hy: number, center: b2Vec2, angle: number): b2PolygonShape;
        private static TestPoint_s_pLocal;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        private static RayCast_s_p1;
        private static RayCast_s_p2;
        private static RayCast_s_d;
        RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
        private static ComputeAABB_s_v;
        ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        private static ComputeMass_s_center;
        private static ComputeMass_s_s;
        private static ComputeMass_s_e1;
        private static ComputeMass_s_e2;
        ComputeMass(massData: b2MassData, density: number): void;
        private static Validate_s_e;
        private static Validate_s_v;
        Validate(): boolean;
        SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        private static ComputeSubmergedArea_s_normalL;
        private static ComputeSubmergedArea_s_depths;
        private static ComputeSubmergedArea_s_md;
        private static ComputeSubmergedArea_s_intoVec;
        private static ComputeSubmergedArea_s_outoVec;
        private static ComputeSubmergedArea_s_center;
        ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
        private static ComputeCentroid_s_pRef;
        private static ComputeCentroid_s_e1;
        private static ComputeCentroid_s_e2;
        static ComputeCentroid(vs: b2Vec2[], count: number, out: b2Vec2): b2Vec2;
    }
}
declare module "Box2D/Dynamics/Joints/b2DistanceJoint" {
    import { b2Vec2, b2Rot } from "Box2D/Common/b2Math";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    export class b2DistanceJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        length: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        Initialize(b1: b2Body, b2: b2Body, anchor1: b2Vec2, anchor2: b2Vec2): void;
    }
    export class b2DistanceJoint extends b2Joint {
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_bias: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_gamma: number;
        m_impulse: number;
        m_length: number;
        m_indexA: number;
        m_indexB: number;
        m_u: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        constructor(def: b2DistanceJointDef);
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetLength(length: number): void;
        Length(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_vpA;
        private static SolveVelocityConstraints_s_vpB;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }
}
declare module "Box2D/Dynamics/Joints/b2AreaJoint" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2DistanceJoint } from "Box2D/Dynamics/Joints/b2DistanceJoint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2World } from "Box2D/Dynamics/b2World";
    export class b2AreaJointDef extends b2JointDef {
        world: b2World;
        bodies: b2Body[];
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        AddBody(body: b2Body): void;
    }
    export class b2AreaJoint extends b2Joint {
        m_bodies: b2Body[];
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_impulse: number;
        m_targetLengths: number[];
        m_targetArea: number;
        m_normals: b2Vec2[];
        m_joints: b2DistanceJoint[];
        m_deltas: b2Vec2[];
        m_delta: b2Vec2;
        constructor(def: b2AreaJointDef);
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }
}
declare module "Box2D/Dynamics/Joints/b2FrictionJoint" {
    import { b2Vec2, b2Mat22, b2Rot } from "Box2D/Common/b2Math";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    export class b2FrictionJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxForce: number;
        maxTorque: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }
    export class b2FrictionJoint extends b2Joint {
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_linearMass: b2Mat22;
        m_angularMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;
        constructor(def: b2FrictionJointDef);
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_Cdot_v2;
        private static SolveVelocityConstraints_s_impulseV;
        private static SolveVelocityConstraints_s_oldImpulseV;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2PrismaticJoint" {
    import { b2Vec2, b2Mat22, b2Vec3, b2Mat33, b2Rot } from "Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef, b2LimitState } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export class b2PrismaticJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        localAxisA: b2Vec2;
        referenceAngle: number;
        enableLimit: boolean;
        lowerTranslation: number;
        upperTranslation: number;
        enableMotor: boolean;
        maxMotorForce: number;
        motorSpeed: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    }
    export class b2PrismaticJoint extends b2Joint {
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localXAxisA: b2Vec2;
        m_localYAxisA: b2Vec2;
        m_referenceAngle: number;
        m_impulse: b2Vec3;
        m_motorImpulse: number;
        m_lowerTranslation: number;
        m_upperTranslation: number;
        m_maxMotorForce: number;
        m_motorSpeed: number;
        m_enableLimit: boolean;
        m_enableMotor: boolean;
        m_limitState: b2LimitState;
        m_indexA: number;
        m_indexB: number;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_axis: b2Vec2;
        m_perp: b2Vec2;
        m_s1: number;
        m_s2: number;
        m_a1: number;
        m_a2: number;
        m_K: b2Mat33;
        m_K3: b2Mat33;
        m_K2: b2Mat22;
        m_motorMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        constructor(def: b2PrismaticJointDef);
        private static InitVelocityConstraints_s_d;
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_P;
        private static SolveVelocityConstraints_s_f2r;
        private static SolveVelocityConstraints_s_f1;
        private static SolveVelocityConstraints_s_df3;
        private static SolveVelocityConstraints_s_df2;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_d;
        private static SolvePositionConstraints_s_impulse;
        private static SolvePositionConstraints_s_impulse1;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLocalAxisA(): b2Vec2;
        GetReferenceAngle(): number;
        private static GetJointTranslation_s_pA;
        private static GetJointTranslation_s_pB;
        private static GetJointTranslation_s_d;
        private static GetJointTranslation_s_axis;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        GetMotorSpeed(): number;
        SetMaxMotorForce(force: number): void;
        GetMaxMotorForce(): number;
        GetMotorForce(inv_dt: number): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2RevoluteJoint" {
    import { b2Vec2, b2Mat22, b2Vec3, b2Mat33, b2Rot } from "Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef, b2LimitState } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export class b2RevoluteJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        referenceAngle: number;
        enableLimit: boolean;
        lowerAngle: number;
        upperAngle: number;
        enableMotor: boolean;
        motorSpeed: number;
        maxMotorTorque: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }
    export class b2RevoluteJoint extends b2Joint {
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_impulse: b2Vec3;
        m_motorImpulse: number;
        m_enableMotor: boolean;
        m_maxMotorTorque: number;
        m_motorSpeed: number;
        m_enableLimit: boolean;
        m_referenceAngle: number;
        m_lowerAngle: number;
        m_upperAngle: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: b2Mat33;
        m_motorMass: number;
        m_limitState: b2LimitState;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;
        constructor(def: b2RevoluteJointDef);
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_P;
        private static SolveVelocityConstraints_s_Cdot_v2;
        private static SolveVelocityConstraints_s_Cdot1;
        private static SolveVelocityConstraints_s_impulse_v3;
        private static SolveVelocityConstraints_s_reduced_v2;
        private static SolveVelocityConstraints_s_impulse_v2;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_C_v2;
        private static SolvePositionConstraints_s_impulse;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetReferenceAngle(): number;
        GetJointAngle(): number;
        GetJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        GetMotorTorque(inv_dt: number): number;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: number): void;
        GetMaxMotorTorque(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: boolean): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: number, upper: number): void;
        SetMotorSpeed(speed: number): void;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2GearJoint" {
    import { b2Vec2, b2Rot } from "Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2JointType } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    export class b2GearJointDef extends b2JointDef {
        joint1: b2Joint;
        joint2: b2Joint;
        ratio: number;
        constructor();
    }
    export class b2GearJoint extends b2Joint {
        m_joint1: b2Joint;
        m_joint2: b2Joint;
        m_typeA: b2JointType;
        m_typeB: b2JointType;
        m_bodyC: b2Body;
        m_bodyD: b2Body;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localAnchorC: b2Vec2;
        m_localAnchorD: b2Vec2;
        m_localAxisC: b2Vec2;
        m_localAxisD: b2Vec2;
        m_referenceAngleA: number;
        m_referenceAngleB: number;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_indexC: number;
        m_indexD: number;
        m_lcA: b2Vec2;
        m_lcB: b2Vec2;
        m_lcC: b2Vec2;
        m_lcD: b2Vec2;
        m_mA: number;
        m_mB: number;
        m_mC: number;
        m_mD: number;
        m_iA: number;
        m_iB: number;
        m_iC: number;
        m_iD: number;
        m_JvAC: b2Vec2;
        m_JvBD: b2Vec2;
        m_JwA: number;
        m_JwB: number;
        m_JwC: number;
        m_JwD: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_qC: b2Rot;
        m_qD: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_lalcC: b2Vec2;
        m_lalcD: b2Vec2;
        constructor(def: b2GearJointDef);
        private static InitVelocityConstraints_s_u;
        private static InitVelocityConstraints_s_rA;
        private static InitVelocityConstraints_s_rB;
        private static InitVelocityConstraints_s_rC;
        private static InitVelocityConstraints_s_rD;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_u;
        private static SolvePositionConstraints_s_rA;
        private static SolvePositionConstraints_s_rB;
        private static SolvePositionConstraints_s_rC;
        private static SolvePositionConstraints_s_rD;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetJoint1(): b2Joint;
        GetJoint2(): b2Joint;
        GetRatio(): number;
        SetRatio(ratio: number): void;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2MotorJoint" {
    import { b2Vec2, b2Mat22, b2Rot } from "Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export class b2MotorJointDef extends b2JointDef {
        linearOffset: b2Vec2;
        angularOffset: number;
        maxForce: number;
        maxTorque: number;
        correctionFactor: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body): void;
    }
    export class b2MotorJoint extends b2Joint {
        m_linearOffset: b2Vec2;
        m_angularOffset: number;
        m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_correctionFactor: number;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_linearError: b2Vec2;
        m_angularError: number;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_linearMass: b2Mat22;
        m_angularMass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_K: b2Mat22;
        constructor(def: b2MotorJointDef);
        GetAnchorA(): b2Vec2;
        GetAnchorB(): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        SetLinearOffset(linearOffset: b2Vec2): void;
        GetLinearOffset(): b2Vec2;
        SetAngularOffset(angularOffset: number): void;
        GetAngularOffset(): number;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_Cdot_v2;
        private static SolveVelocityConstraints_s_impulse_v2;
        private static SolveVelocityConstraints_s_oldImpulse_v2;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2MouseJoint" {
    import { b2Vec2, b2Mat22, b2Rot } from "Box2D/Common/b2Math";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export class b2MouseJointDef extends b2JointDef {
        target: b2Vec2;
        maxForce: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
    }
    export class b2MouseJoint extends b2Joint {
        m_localAnchorB: b2Vec2;
        m_targetA: b2Vec2;
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_beta: number;
        m_impulse: b2Vec2;
        m_maxForce: number;
        m_gamma: number;
        m_indexA: number;
        m_indexB: number;
        m_rB: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassB: number;
        m_invIB: number;
        m_mass: b2Mat22;
        m_C: b2Vec2;
        m_qB: b2Rot;
        m_lalcB: b2Vec2;
        m_K: b2Mat22;
        constructor(def: b2MouseJointDef);
        SetTarget(target: b2Vec2): void;
        GetTarget(): b2Vec2;
        SetMaxForce(maxForce: number): void;
        GetMaxForce(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_Cdot;
        private static SolveVelocityConstraints_s_impulse;
        private static SolveVelocityConstraints_s_oldImpulse;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
        ShiftOrigin(newOrigin: b2Vec2): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2PulleyJoint" {
    import { b2Vec2, b2Rot } from "Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export const b2_minPulleyLength: number;
    export class b2PulleyJointDef extends b2JointDef {
        groundAnchorA: b2Vec2;
        groundAnchorB: b2Vec2;
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        lengthA: number;
        lengthB: number;
        ratio: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, groundA: b2Vec2, groundB: b2Vec2, anchorA: b2Vec2, anchorB: b2Vec2, r: number): void;
    }
    export class b2PulleyJoint extends b2Joint {
        m_groundAnchorA: b2Vec2;
        m_groundAnchorB: b2Vec2;
        m_lengthA: number;
        m_lengthB: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_uA: b2Vec2;
        m_uB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        constructor(def: b2PulleyJointDef);
        private static InitVelocityConstraints_s_PA;
        private static InitVelocityConstraints_s_PB;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_vpA;
        private static SolveVelocityConstraints_s_vpB;
        private static SolveVelocityConstraints_s_PA;
        private static SolveVelocityConstraints_s_PB;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_PA;
        private static SolvePositionConstraints_s_PB;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetGroundAnchorA(): b2Vec2;
        GetGroundAnchorB(): b2Vec2;
        GetLengthA(): number;
        GetLengthB(): number;
        GetRatio(): number;
        private static GetCurrentLengthA_s_p;
        GetCurrentLengthA(): number;
        private static GetCurrentLengthB_s_p;
        GetCurrentLengthB(): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
        ShiftOrigin(newOrigin: b2Vec2): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2RopeJoint" {
    import { b2Vec2, b2Rot } from "Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2LimitState } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export class b2RopeJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxLength: number;
        constructor();
    }
    export class b2RopeJoint extends b2Joint {
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_maxLength: number;
        m_length: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_u: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_state: b2LimitState;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        constructor(def: b2RopeJointDef);
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_vpA;
        private static SolveVelocityConstraints_s_vpB;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetMaxLength(length: number): void;
        GetMaxLength(): number;
        GetLimitState(): b2LimitState;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2WeldJoint" {
    import { b2Vec2, b2Vec3, b2Mat33, b2Rot } from "Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    export class b2WeldJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        referenceAngle: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }
    export class b2WeldJoint extends b2Joint {
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_bias: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_referenceAngle: number;
        m_gamma: number;
        m_impulse: b2Vec3;
        m_indexA: number;
        m_indexB: number;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: b2Mat33;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_K: b2Mat33;
        constructor(def: b2WeldJointDef);
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_Cdot1;
        private static SolveVelocityConstraints_s_impulse1;
        private static SolveVelocityConstraints_s_impulse;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_C1;
        private static SolvePositionConstraints_s_P;
        private static SolvePositionConstraints_s_impulse;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetReferenceAngle(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2WheelJoint" {
    import { b2Vec2, b2Rot } from "Box2D/Common/b2Math";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    export class b2WheelJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        localAxisA: b2Vec2;
        enableMotor: boolean;
        maxMotorTorque: number;
        motorSpeed: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2, axis: b2Vec2): void;
    }
    export class b2WheelJoint extends b2Joint {
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_localAnchorA: b2Vec2;
        m_localAnchorB: b2Vec2;
        m_localXAxisA: b2Vec2;
        m_localYAxisA: b2Vec2;
        m_impulse: number;
        m_motorImpulse: number;
        m_springImpulse: number;
        m_maxMotorTorque: number;
        m_motorSpeed: number;
        m_enableMotor: boolean;
        m_indexA: number;
        m_indexB: number;
        m_localCenterA: b2Vec2;
        m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_ax: b2Vec2;
        m_ay: b2Vec2;
        m_sAx: number;
        m_sBx: number;
        m_sAy: number;
        m_sBy: number;
        m_mass: number;
        m_motorMass: number;
        m_springMass: number;
        m_bias: number;
        m_gamma: number;
        m_qA: b2Rot;
        m_qB: b2Rot;
        m_lalcA: b2Vec2;
        m_lalcB: b2Vec2;
        m_rA: b2Vec2;
        m_rB: b2Vec2;
        constructor(def: b2WheelJointDef);
        GetMotorSpeed(): number;
        GetMaxMotorTorque(): number;
        SetSpringFrequencyHz(hz: number): void;
        GetSpringFrequencyHz(): number;
        SetSpringDampingRatio(ratio: number): void;
        GetSpringDampingRatio(): number;
        private static InitVelocityConstraints_s_d;
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_d;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetDefinition(def: b2WheelJointDef): b2WheelJointDef;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLocalAxisA(): b2Vec2;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        GetPrismaticJointTranslation(): number;
        GetPrismaticJointSpeed(): number;
        GetRevoluteJointAngle(): number;
        GetRevoluteJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        SetMaxMotorTorque(force: number): void;
        GetMotorTorque(inv_dt: number): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Dynamics/Joints/b2JointFactory" {
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    export class b2JointFactory {
        static Create(def: b2JointDef, allocator: any): b2Joint;
        static Destroy(joint: b2Joint, allocator: any): void;
    }
}
declare module "Box2D/Dynamics/Contacts/b2ContactSolver" {
    import { b2Vec2, b2Mat22, b2Transform } from "Box2D/Common/b2Math";
    import { b2ManifoldType } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2TimeStep, b2Position, b2Velocity } from "Box2D/Dynamics/b2TimeStep";
    export class b2VelocityConstraintPoint {
        rA: b2Vec2;
        rB: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        normalMass: number;
        tangentMass: number;
        velocityBias: number;
        static MakeArray(length: number): b2VelocityConstraintPoint[];
    }
    export class b2ContactVelocityConstraint {
        points: b2VelocityConstraintPoint[];
        normal: b2Vec2;
        tangent: b2Vec2;
        normalMass: b2Mat22;
        K: b2Mat22;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
        invIA: number;
        invIB: number;
        friction: number;
        restitution: number;
        tangentSpeed: number;
        pointCount: number;
        contactIndex: number;
        static MakeArray(length: number): b2ContactVelocityConstraint[];
    }
    export class b2ContactPositionConstraint {
        localPoints: b2Vec2[];
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
        localCenterA: b2Vec2;
        localCenterB: b2Vec2;
        invIA: number;
        invIB: number;
        type: b2ManifoldType;
        radiusA: number;
        radiusB: number;
        pointCount: number;
        static MakeArray(length: number): b2ContactPositionConstraint[];
    }
    export class b2ContactSolverDef {
        step: b2TimeStep;
        contacts: b2Contact[];
        count: number;
        positions: b2Position[];
        velocities: b2Velocity[];
        allocator: any;
    }
    export class b2PositionSolverManifold {
        normal: b2Vec2;
        point: b2Vec2;
        separation: number;
        private static Initialize_s_pointA;
        private static Initialize_s_pointB;
        private static Initialize_s_planePoint;
        private static Initialize_s_clipPoint;
        Initialize(pc: b2ContactPositionConstraint, xfA: b2Transform, xfB: b2Transform, index: number): void;
    }
    export class b2ContactSolver {
        m_step: b2TimeStep;
        m_positions: b2Position[];
        m_velocities: b2Velocity[];
        m_allocator: any;
        m_positionConstraints: b2ContactPositionConstraint[];
        m_velocityConstraints: b2ContactVelocityConstraint[];
        m_contacts: b2Contact[];
        m_count: number;
        Initialize(def: b2ContactSolverDef): b2ContactSolver;
        private static InitializeVelocityConstraints_s_xfA;
        private static InitializeVelocityConstraints_s_xfB;
        private static InitializeVelocityConstraints_s_worldManifold;
        InitializeVelocityConstraints(): void;
        private static WarmStart_s_P;
        WarmStart(): void;
        private static SolveVelocityConstraints_s_dv;
        private static SolveVelocityConstraints_s_dv1;
        private static SolveVelocityConstraints_s_dv2;
        private static SolveVelocityConstraints_s_P;
        private static SolveVelocityConstraints_s_a;
        private static SolveVelocityConstraints_s_b;
        private static SolveVelocityConstraints_s_x;
        private static SolveVelocityConstraints_s_d;
        private static SolveVelocityConstraints_s_P1;
        private static SolveVelocityConstraints_s_P2;
        private static SolveVelocityConstraints_s_P1P2;
        SolveVelocityConstraints(): void;
        StoreImpulses(): void;
        private static SolvePositionConstraints_s_xfA;
        private static SolvePositionConstraints_s_xfB;
        private static SolvePositionConstraints_s_psm;
        private static SolvePositionConstraints_s_rA;
        private static SolvePositionConstraints_s_rB;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(): boolean;
        private static SolveTOIPositionConstraints_s_xfA;
        private static SolveTOIPositionConstraints_s_xfB;
        private static SolveTOIPositionConstraints_s_psm;
        private static SolveTOIPositionConstraints_s_rA;
        private static SolveTOIPositionConstraints_s_rB;
        private static SolveTOIPositionConstraints_s_P;
        SolveTOIPositionConstraints(toiIndexA: number, toiIndexB: number): boolean;
    }
}
declare module "Box2D/Dynamics/b2WorldCallbacks" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Joint } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2DestructionListener {
        SayGoodbyeJoint(joint: b2Joint): void;
        SayGoodbyeFixture(fixture: b2Fixture): void;
    }
    export class b2ContactFilter {
        ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
        static b2_defaultFilter: b2ContactFilter;
    }
    export class b2ContactImpulse {
        normalImpulses: number[];
        tangentImpulses: number[];
        count: number;
    }
    export class b2ContactListener {
        BeginContact(contact: b2Contact): void;
        EndContact(contact: b2Contact): void;
        PreSolve(contact: b2Contact, oldManifold: b2Manifold): void;
        PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void;
        static b2_defaultListener: b2ContactListener;
    }
    export class b2QueryCallback {
        ReportFixture(fixture: b2Fixture): boolean;
    }
    export type b2QueryCallbackFunction = {
        (fixture: b2Fixture): boolean;
    };
    export class b2RayCastCallback {
        ReportFixture(fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
    }
    export type b2RayCastCallbackFunction = {
        (fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
    };
}
declare module "Box2D/Dynamics/b2Island" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2ContactVelocityConstraint } from "Box2D/Dynamics/Contacts/b2ContactSolver";
    import { b2Joint } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2TimeStep, b2Profile, b2Position, b2Velocity } from "Box2D/Dynamics/b2TimeStep";
    import { b2ContactListener } from "Box2D/Dynamics/b2WorldCallbacks";
    export class b2Island {
        m_allocator: any;
        m_listener: b2ContactListener;
        m_bodies: b2Body[];
        m_contacts: b2Contact[];
        m_joints: b2Joint[];
        m_positions: b2Position[];
        m_velocities: b2Velocity[];
        m_bodyCount: number;
        m_jointCount: number;
        m_contactCount: number;
        m_bodyCapacity: number;
        m_contactCapacity: number;
        m_jointCapacity: number;
        Initialize(bodyCapacity: number, contactCapacity: number, jointCapacity: number, allocator: any, listener: b2ContactListener): void;
        Clear(): void;
        AddBody(body: b2Body): void;
        AddContact(contact: b2Contact): void;
        AddJoint(joint: b2Joint): void;
        private static s_timer;
        private static s_solverData;
        private static s_contactSolverDef;
        private static s_contactSolver;
        private static s_translation;
        Solve(profile: b2Profile, step: b2TimeStep, gravity: b2Vec2, allowSleep: boolean): void;
        SolveTOI(subStep: b2TimeStep, toiIndexA: number, toiIndexB: number): void;
        private static s_impulse;
        Report(constraints: b2ContactVelocityConstraint[]): void;
    }
}
declare module "Box2D/Dynamics/b2World" {
    import { b2Vec2, b2Transform } from "Box2D/Common/b2Math";
    import { b2Color, b2Draw } from "Box2D/Common/b2Draw";
    import { b2AABB } from "Box2D/Collision/b2Collision";
    import { b2Shape } from "Box2D/Collision/Shapes/b2Shape";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Joint, b2JointDef } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2Body, b2BodyDef } from "Box2D/Dynamics/b2Body";
    import { b2ContactManager } from "Box2D/Dynamics/b2ContactManager";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    import { b2Island } from "Box2D/Dynamics/b2Island";
    import { b2Profile, b2TimeStep } from "Box2D/Dynamics/b2TimeStep";
    import { b2ContactFilter } from "Box2D/Dynamics/b2WorldCallbacks";
    import { b2ContactListener } from "Box2D/Dynamics/b2WorldCallbacks";
    import { b2DestructionListener } from "Box2D/Dynamics/b2WorldCallbacks";
    import { b2QueryCallback, b2QueryCallbackFunction } from "Box2D/Dynamics/b2WorldCallbacks";
    import { b2RayCastCallback, b2RayCastCallbackFunction } from "Box2D/Dynamics/b2WorldCallbacks";
    export class b2World {
        m_newFixture: boolean;
        m_locked: boolean;
        m_clearForces: boolean;
        m_contactManager: b2ContactManager;
        m_bodyList: b2Body;
        m_jointList: b2Joint;
        m_bodyCount: number;
        m_jointCount: number;
        m_gravity: b2Vec2;
        m_allowSleep: boolean;
        m_destructionListener: b2DestructionListener;
        m_debugDraw: b2Draw;
        m_inv_dt0: number;
        m_warmStarting: boolean;
        m_continuousPhysics: boolean;
        m_subStepping: boolean;
        m_stepComplete: boolean;
        m_profile: b2Profile;
        m_island: b2Island;
        s_stack: b2Body[];
        constructor(gravity: b2Vec2);
        SetDestructionListener(listener: b2DestructionListener): void;
        SetContactFilter(filter: b2ContactFilter): void;
        SetContactListener(listener: b2ContactListener): void;
        SetDebugDraw(debugDraw: b2Draw): void;
        CreateBody(def: b2BodyDef): b2Body;
        DestroyBody(b: b2Body): void;
        CreateJoint(def: b2JointDef): b2Joint;
        DestroyJoint(j: b2Joint): void;
        private static Step_s_step;
        private static Step_s_stepTimer;
        private static Step_s_timer;
        Step(dt: number, velocityIterations: number, positionIterations: number): void;
        ClearForces(): void;
        private static DrawDebugData_s_color;
        private static DrawDebugData_s_vs;
        private static DrawDebugData_s_xf;
        DrawDebugData(): void;
        QueryAABB(callback: b2QueryCallback | b2QueryCallbackFunction, aabb: b2AABB): void;
        private static QueryShape_s_aabb;
        QueryShape(callback: b2QueryCallback | b2QueryCallbackFunction, shape: b2Shape, transform: b2Transform): void;
        private static QueryPoint_s_aabb;
        QueryPoint(callback: b2QueryCallback | b2QueryCallbackFunction, point: b2Vec2): void;
        private static RayCast_s_input;
        private static RayCast_s_output;
        private static RayCast_s_point;
        RayCast(callback: b2RayCastCallback | b2RayCastCallbackFunction, point1: b2Vec2, point2: b2Vec2): void;
        RayCastOne(point1: b2Vec2, point2: b2Vec2): b2Fixture;
        RayCastAll(point1: b2Vec2, point2: b2Vec2, out?: b2Fixture[]): b2Fixture[];
        GetBodyList(): b2Body;
        GetJointList(): b2Joint;
        GetContactList(): b2Contact;
        SetAllowSleeping(flag: boolean): void;
        GetAllowSleeping(): boolean;
        SetWarmStarting(flag: boolean): void;
        GetWarmStarting(): boolean;
        SetContinuousPhysics(flag: boolean): void;
        GetContinuousPhysics(): boolean;
        SetSubStepping(flag: boolean): void;
        GetSubStepping(): boolean;
        GetProxyCount(): number;
        GetBodyCount(): number;
        GetJointCount(): number;
        GetContactCount(): number;
        GetTreeHeight(): number;
        GetTreeBalance(): number;
        GetTreeQuality(): number;
        SetGravity(gravity: b2Vec2, wake?: boolean): void;
        GetGravity(): b2Vec2;
        IsLocked(): boolean;
        SetAutoClearForces(flag: boolean): void;
        GetAutoClearForces(): boolean;
        ShiftOrigin(newOrigin: b2Vec2): void;
        GetContactManager(): b2ContactManager;
        GetProfile(): b2Profile;
        Dump(log: (format: string, ...args: any[]) => void): void;
        private static DrawJoint_s_p1;
        private static DrawJoint_s_p2;
        private static DrawJoint_s_color;
        DrawJoint(joint: b2Joint): void;
        DrawShape(fixture: b2Fixture, color: b2Color): void;
        Solve(step: b2TimeStep): void;
        private static SolveTOI_s_subStep;
        private static SolveTOI_s_backup;
        private static SolveTOI_s_backup1;
        private static SolveTOI_s_backup2;
        private static SolveTOI_s_toi_input;
        private static SolveTOI_s_toi_output;
        SolveTOI(step: b2TimeStep): void;
    }
}
declare module "Box2D/Dynamics/b2Body" {
    import { b2Vec2, b2Transform, b2Sweep } from "Box2D/Common/b2Math";
    import { b2Shape, b2MassData } from "Box2D/Collision/Shapes/b2Shape";
    import { b2ContactEdge } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2JointEdge } from "Box2D/Dynamics/Joints/b2Joint";
    import { b2Fixture, b2FixtureDef } from "Box2D/Dynamics/b2Fixture";
    import { b2World } from "Box2D/Dynamics/b2World";
    export const enum b2BodyType {
        b2_unknown = -1,
        b2_staticBody = 0,
        b2_kinematicBody = 1,
        b2_dynamicBody = 2,
    }
    export class b2BodyDef {
        type: b2BodyType;
        position: b2Vec2;
        angle: number;
        linearVelocity: b2Vec2;
        angularVelocity: number;
        linearDamping: number;
        angularDamping: number;
        allowSleep: boolean;
        awake: boolean;
        fixedRotation: boolean;
        bullet: boolean;
        active: boolean;
        userData: any;
        gravityScale: number;
    }
    export class b2Body {
        m_type: b2BodyType;
        m_islandFlag: boolean;
        m_awakeFlag: boolean;
        m_autoSleepFlag: boolean;
        m_bulletFlag: boolean;
        m_fixedRotationFlag: boolean;
        m_activeFlag: boolean;
        m_toiFlag: boolean;
        m_islandIndex: number;
        m_xf: b2Transform;
        m_sweep: b2Sweep;
        m_linearVelocity: b2Vec2;
        m_angularVelocity: number;
        m_force: b2Vec2;
        m_torque: number;
        m_world: b2World;
        m_prev: b2Body;
        m_next: b2Body;
        m_fixtureList: b2Fixture;
        m_fixtureCount: number;
        m_jointList: b2JointEdge;
        m_contactList: b2ContactEdge;
        m_mass: number;
        m_invMass: number;
        m_I: number;
        m_invI: number;
        m_linearDamping: number;
        m_angularDamping: number;
        m_gravityScale: number;
        m_sleepTime: number;
        m_userData: any;
        constructor(bd: b2BodyDef, world: b2World);
        CreateFixture(a: b2FixtureDef | b2Shape, b?: number): b2Fixture;
        CreateFixtureDef(def: b2FixtureDef): b2Fixture;
        private static CreateFixtureShapeDensity_s_def;
        CreateFixtureShapeDensity(shape: b2Shape, density?: number): b2Fixture;
        DestroyFixture(fixture: b2Fixture): void;
        SetTransformVec(position: b2Vec2, angle: number): void;
        SetTransformXY(x: number, y: number, angle: number): void;
        SetTransform(xf: b2Transform): void;
        GetTransform(): b2Transform;
        GetPosition(): b2Vec2;
        SetPosition(position: b2Vec2): void;
        SetPositionXY(x: number, y: number): void;
        GetAngle(): number;
        SetAngle(angle: number): void;
        GetWorldCenter(): b2Vec2;
        GetLocalCenter(): b2Vec2;
        SetLinearVelocity(v: b2Vec2): void;
        GetLinearVelocity(): b2Vec2;
        SetAngularVelocity(w: number): void;
        GetAngularVelocity(): number;
        GetDefinition(bd: b2BodyDef): b2BodyDef;
        ApplyForce(force: b2Vec2, point: b2Vec2, wake?: boolean): void;
        ApplyForceToCenter(force: b2Vec2, wake?: boolean): void;
        ApplyTorque(torque: number, wake?: boolean): void;
        ApplyLinearImpulse(impulse: b2Vec2, point: b2Vec2, wake?: boolean): void;
        ApplyLinearImpulseToCenter(impulse: b2Vec2, wake?: boolean): void;
        ApplyAngularImpulse(impulse: number, wake?: boolean): void;
        GetMass(): number;
        GetInertia(): number;
        GetMassData(data: b2MassData): b2MassData;
        private static SetMassData_s_oldCenter;
        SetMassData(massData: b2MassData): void;
        private static ResetMassData_s_localCenter;
        private static ResetMassData_s_oldCenter;
        private static ResetMassData_s_massData;
        ResetMassData(): void;
        GetWorldPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetWorldVector(localVector: b2Vec2, out: b2Vec2): b2Vec2;
        GetLocalPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetLocalVector(worldVector: b2Vec2, out: b2Vec2): b2Vec2;
        GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetLinearVelocityFromLocalPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
        GetLinearDamping(): number;
        SetLinearDamping(linearDamping: number): void;
        GetAngularDamping(): number;
        SetAngularDamping(angularDamping: number): void;
        GetGravityScale(): number;
        SetGravityScale(scale: number): void;
        SetType(type: b2BodyType): void;
        GetType(): b2BodyType;
        SetBullet(flag: boolean): void;
        IsBullet(): boolean;
        SetSleepingAllowed(flag: boolean): void;
        IsSleepingAllowed(): boolean;
        SetAwake(flag: boolean): void;
        IsAwake(): boolean;
        SetActive(flag: boolean): void;
        IsActive(): boolean;
        SetFixedRotation(flag: boolean): void;
        IsFixedRotation(): boolean;
        GetFixtureList(): b2Fixture;
        GetJointList(): b2JointEdge;
        GetContactList(): b2ContactEdge;
        GetNext(): b2Body;
        GetUserData(): any;
        SetUserData(data: any): void;
        GetWorld(): b2World;
        Dump(log: (format: string, ...args: any[]) => void): void;
        private static SynchronizeFixtures_s_xf1;
        SynchronizeFixtures(): void;
        SynchronizeTransform(): void;
        ShouldCollide(other: b2Body): boolean;
        ShouldCollideConnected(other: b2Body): boolean;
        Advance(alpha: number): void;
    }
}
declare module "Box2D/Dynamics/Contacts/b2Contact" {
    import { b2Transform, b2Sweep } from "Box2D/Common/b2Math";
    import { b2Manifold, b2WorldManifold } from "Box2D/Collision/b2Collision";
    import { b2Body } from "Box2D/Dynamics/b2Body";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    import { b2ContactListener } from "Box2D/Dynamics/b2WorldCallbacks";
    export function b2MixFriction(friction1: number, friction2: number): number;
    export function b2MixRestitution(restitution1: number, restitution2: number): number;
    export class b2ContactEdge {
        other: b2Body | null;
        contact: b2Contact | null;
        prev: b2ContactEdge | null;
        next: b2ContactEdge | null;
    }
    export class b2Contact {
        m_islandFlag: boolean;
        m_touchingFlag: boolean;
        m_enabledFlag: boolean;
        m_filterFlag: boolean;
        m_bulletHitFlag: boolean;
        m_toiFlag: boolean;
        m_prev: b2Contact | null;
        m_next: b2Contact | null;
        m_nodeA: b2ContactEdge;
        m_nodeB: b2ContactEdge;
        m_fixtureA: b2Fixture | null;
        m_fixtureB: b2Fixture | null;
        m_indexA: number;
        m_indexB: number;
        m_manifold: b2Manifold;
        m_toiCount: number;
        m_toi: number;
        m_friction: number;
        m_restitution: number;
        m_tangentSpeed: number;
        m_oldManifold: b2Manifold;
        GetManifold(): b2Manifold;
        GetWorldManifold(worldManifold: b2WorldManifold): void;
        IsTouching(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        GetNext(): b2Contact | null;
        GetFixtureA(): b2Fixture | null;
        GetChildIndexA(): number;
        GetFixtureB(): b2Fixture | null;
        GetChildIndexB(): number;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
        FlagForFiltering(): void;
        SetFriction(friction: number): void;
        GetFriction(): number;
        ResetFriction(): void;
        SetRestitution(restitution: number): void;
        GetRestitution(): number;
        ResetRestitution(): void;
        SetTangentSpeed(speed: number): void;
        GetTangentSpeed(): number;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Update(listener: b2ContactListener): void;
        private static ComputeTOI_s_input;
        private static ComputeTOI_s_output;
        ComputeTOI(sweepA: b2Sweep, sweepB: b2Sweep): number;
    }
}
declare module "Box2D/Collision/b2CollideCircle" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2CircleShape } from "Box2D/Collision/Shapes/b2CircleShape";
    import { b2PolygonShape } from "Box2D/Collision/Shapes/b2PolygonShape";
    export function b2CollideCircles(manifold: b2Manifold, circleA: b2CircleShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
    export function b2CollidePolygonAndCircle(manifold: b2Manifold, polygonA: b2PolygonShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
}
declare module "Box2D/Dynamics/Contacts/b2CircleContact" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2CircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Collision/b2CollidePolygon" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2PolygonShape } from "Box2D/Collision/Shapes/b2PolygonShape";
    export function b2CollidePolygons(manifold: b2Manifold, polyA: b2PolygonShape, xfA: b2Transform, polyB: b2PolygonShape, xfB: b2Transform): void;
}
declare module "Box2D/Dynamics/Contacts/b2PolygonContact" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2PolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Dynamics/Contacts/b2PolygonAndCircleContact" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2PolygonAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Collision/b2CollideEdge" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2CircleShape } from "Box2D/Collision/Shapes/b2CircleShape";
    import { b2PolygonShape } from "Box2D/Collision/Shapes/b2PolygonShape";
    import { b2EdgeShape } from "Box2D/Collision/Shapes/b2EdgeShape";
    export function b2CollideEdgeAndCircle(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
    export function b2CollideEdgeAndPolygon(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, polygonB: b2PolygonShape, xfB: b2Transform): void;
}
declare module "Box2D/Dynamics/Contacts/b2EdgeAndCircleContact" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2EdgeAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2EdgeAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Dynamics/Contacts/b2ChainAndCircleContact" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2ChainAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        private static Evaluate_s_edge;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Dynamics/Contacts/b2ChainAndPolygonContact" {
    import { b2Transform } from "Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2ChainAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        private static Evaluate_s_edge;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Dynamics/Contacts/b2ContactFactory" {
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Dynamics/b2Fixture";
    export class b2ContactRegister {
        pool: b2Contact[];
        createFcn: {
            (allocator: any): b2Contact;
        };
        destroyFcn: {
            (contact: b2Contact, allocator: any): void;
        };
        primary: boolean;
    }
    export class b2ContactFactory {
        m_allocator: any;
        m_registers: b2ContactRegister[][];
        constructor(allocator: any);
        private AddType(createFcn, destroyFcn, type1, type2);
        private InitializeRegisters();
        Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact;
        Destroy(contact: b2Contact): void;
    }
}
declare module "Box2D/Dynamics/b2ContactManager" {
    import { b2BroadPhase } from "Box2D/Collision/b2BroadPhase";
    import { b2Contact } from "Box2D/Dynamics/Contacts/b2Contact";
    import { b2ContactFactory } from "Box2D/Dynamics/Contacts/b2ContactFactory";
    import { b2ContactFilter, b2ContactListener } from "Box2D/Dynamics/b2WorldCallbacks";
    export class b2ContactManager {
        m_broadPhase: b2BroadPhase;
        m_contactList: b2Contact;
        m_contactCount: number;
        m_contactFilter: b2ContactFilter;
        m_contactListener: b2ContactListener;
        m_allocator: any;
        m_contactFactory: b2ContactFactory;
        constructor();
        AddPair(proxyUserDataA: any, proxyUserDataB: any): void;
        FindNewContacts(): void;
        Destroy(c: b2Contact): void;
        Collide(): void;
    }
}
declare module "Box2D/Collision/b2BroadPhase" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput } from "Box2D/Collision/b2Collision";
    import { b2TreeNode, b2DynamicTree } from "Box2D/Collision/b2DynamicTree";
    import { b2ContactManager } from "Box2D/Dynamics/b2ContactManager";
    export class b2Pair {
        proxyA: b2TreeNode | null;
        proxyB: b2TreeNode | null;
    }
    export class b2BroadPhase {
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
    export function b2PairLessThan(pair1: b2Pair, pair2: b2Pair): number;
}
declare module "Box2D/Rope/b2Rope" {
    import { b2Vec2 } from "Box2D/Common/b2Math";
    import { b2Draw } from "Box2D/Common/b2Draw";
    export class b2RopeDef {
        vertices: b2Vec2[];
        count: number;
        masses: number[];
        gravity: b2Vec2;
        damping: number;
        k2: number;
        k3: number;
    }
    export class b2Rope {
        m_count: number;
        m_ps: b2Vec2[];
        m_p0s: b2Vec2[];
        m_vs: b2Vec2[];
        m_ims: number[];
        m_Ls: number[];
        m_as: number[];
        m_gravity: b2Vec2;
        m_damping: number;
        m_k2: number;
        m_k3: number;
        GetVertexCount(): number;
        GetVertices(): b2Vec2[];
        Initialize(def: b2RopeDef): void;
        Step(h: number, iterations: number): void;
        private static s_d;
        SolveC2(): void;
        SetAngle(angle: number): void;
        private static s_d1;
        private static s_d2;
        private static s_Jd1;
        private static s_Jd2;
        private static s_J1;
        private static s_J2;
        SolveC3(): void;
        Draw(draw: b2Draw): void;
    }
}
declare module "Box2D/Box2D" {
    /**
    \mainpage Box2D API Documentation
    
    \section intro_sec Getting Started
    
    For documentation please see http://box2d.org/documentation.html
    
    For discussion please visit http://box2d.org/forum
    */
    export * from "Box2D/Common/b2Settings";
    export * from "Box2D/Common/b2Math";
    export * from "Box2D/Common/b2Draw";
    export * from "Box2D/Common/b2Timer";
    export * from "Box2D/Common/b2GrowableStack";
    export * from "Box2D/Common/b2BlockAllocator";
    export * from "Box2D/Common/b2StackAllocator";
    export * from "Box2D/Collision/b2Collision";
    export * from "Box2D/Collision/b2Distance";
    export * from "Box2D/Collision/b2BroadPhase";
    export * from "Box2D/Collision/b2DynamicTree";
    export * from "Box2D/Collision/b2TimeOfImpact";
    export * from "Box2D/Collision/b2CollideCircle";
    export * from "Box2D/Collision/b2CollidePolygon";
    export * from "Box2D/Collision/b2CollideEdge";
    export * from "Box2D/Collision/Shapes/b2Shape";
    export * from "Box2D/Collision/Shapes/b2CircleShape";
    export * from "Box2D/Collision/Shapes/b2PolygonShape";
    export * from "Box2D/Collision/Shapes/b2EdgeShape";
    export * from "Box2D/Collision/Shapes/b2ChainShape";
    export * from "Box2D/Dynamics/b2Fixture";
    export * from "Box2D/Dynamics/b2Body";
    export * from "Box2D/Dynamics/b2World";
    export * from "Box2D/Dynamics/b2WorldCallbacks";
    export * from "Box2D/Dynamics/b2Island";
    export * from "Box2D/Dynamics/b2TimeStep";
    export * from "Box2D/Dynamics/b2ContactManager";
    export * from "Box2D/Dynamics/Contacts/b2Contact";
    export * from "Box2D/Dynamics/Contacts/b2ContactFactory";
    export * from "Box2D/Dynamics/Contacts/b2ContactSolver";
    export * from "Box2D/Dynamics/Contacts/b2CircleContact";
    export * from "Box2D/Dynamics/Contacts/b2PolygonContact";
    export * from "Box2D/Dynamics/Contacts/b2PolygonAndCircleContact";
    export * from "Box2D/Dynamics/Contacts/b2EdgeAndCircleContact";
    export * from "Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact";
    export * from "Box2D/Dynamics/Contacts/b2ChainAndCircleContact";
    export * from "Box2D/Dynamics/Contacts/b2ChainAndPolygonContact";
    export * from "Box2D/Dynamics/Joints/b2Joint";
    export * from "Box2D/Dynamics/Joints/b2JointFactory";
    export * from "Box2D/Dynamics/Joints/b2AreaJoint";
    export * from "Box2D/Dynamics/Joints/b2DistanceJoint";
    export * from "Box2D/Dynamics/Joints/b2FrictionJoint";
    export * from "Box2D/Dynamics/Joints/b2GearJoint";
    export * from "Box2D/Dynamics/Joints/b2MotorJoint";
    export * from "Box2D/Dynamics/Joints/b2MouseJoint";
    export * from "Box2D/Dynamics/Joints/b2PrismaticJoint";
    export * from "Box2D/Dynamics/Joints/b2PulleyJoint";
    export * from "Box2D/Dynamics/Joints/b2RevoluteJoint";
    export * from "Box2D/Dynamics/Joints/b2RopeJoint";
    export * from "Box2D/Dynamics/Joints/b2WeldJoint";
    export * from "Box2D/Dynamics/Joints/b2WheelJoint";
    export * from "Box2D/Rope/b2Rope";
}
declare module "Testbed/Framework/DebugDraw" {
    import * as box2d from "Box2D/Box2D";
    export class Camera {
        m_center: box2d.b2Vec2;
        m_extent: number;
        m_zoom: number;
        m_width: number;
        m_height: number;
        ConvertScreenToWorld(screenPoint: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertWorldToScreen(worldPoint: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertViewportToElement(viewport: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertElementToViewport(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertProjectionToViewport(projection: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertViewportToProjection(viewport: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertWorldToProjection(world: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertProjectionToWorld(projection: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertElementToWorld(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertWorldToElement(world: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
        ConvertElementToProjection(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    }
    export class DebugDraw extends box2d.b2Draw {
        m_ctx: CanvasRenderingContext2D;
        constructor();
        PushTransform(xf: box2d.b2Transform): void;
        PopTransform(xf: box2d.b2Transform): void;
        DrawPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void;
        DrawSolidPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void;
        DrawCircle(center: box2d.b2Vec2, radius: number, color: box2d.b2Color): void;
        DrawSolidCircle(center: box2d.b2Vec2, radius: number, axis: box2d.b2Vec2, color: box2d.b2Color): void;
        DrawSegment(p1: box2d.b2Vec2, p2: box2d.b2Vec2, color: box2d.b2Color): void;
        DrawTransform(xf: box2d.b2Transform): void;
        DrawPoint(p: box2d.b2Vec2, size: number, color: box2d.b2Color): void;
        private static DrawString_s_color;
        DrawString(x: number, y: number, message: string): void;
        private static DrawStringWorld_s_p;
        private static DrawStringWorld_s_cc;
        private static DrawStringWorld_s_color;
        DrawStringWorld(x: number, y: number, message: string): void;
        DrawAABB(aabb: box2d.b2AABB, color: box2d.b2Color): void;
    }
    export const g_debugDraw: DebugDraw;
    export const g_camera: Camera;
}
declare module "Testbed/Framework/Test" {
    import * as box2d from "Box2D/Box2D";
    export const DRAW_STRING_NEW_LINE: number;
    export class Settings {
        hz: number;
        velocityIterations: number;
        positionIterations: number;
        drawShapes: boolean;
        drawJoints: boolean;
        drawAABBs: boolean;
        drawContactPoints: boolean;
        drawContactNormals: boolean;
        drawContactImpulse: boolean;
        drawFrictionImpulse: boolean;
        drawCOMs: boolean;
        drawControllers: boolean;
        drawStats: boolean;
        drawProfile: boolean;
        enableWarmStarting: boolean;
        enableContinuous: boolean;
        enableSubStepping: boolean;
        enableSleep: boolean;
        pause: boolean;
        singleStep: boolean;
    }
    export class TestEntry {
        name: string;
        createFcn: () => Test;
        constructor(name: string, createFcn: () => Test);
    }
    export class DestructionListener extends box2d.b2DestructionListener {
        test: Test;
        constructor(test: Test);
        SayGoodbyeJoint(joint: box2d.b2Joint): void;
        SayGoodbyeFixture(fixture: box2d.b2Fixture): void;
    }
    export class ContactPoint {
        fixtureA: box2d.b2Fixture;
        fixtureB: box2d.b2Fixture;
        normal: box2d.b2Vec2;
        position: box2d.b2Vec2;
        state: box2d.b2PointState;
        normalImpulse: number;
        tangentImpulse: number;
        separation: number;
    }
    export class Test extends box2d.b2ContactListener {
        static k_maxContactPoints: number;
        m_world: box2d.b2World;
        m_bomb: box2d.b2Body;
        m_textLine: number;
        m_mouseJoint: box2d.b2MouseJoint;
        m_points: ContactPoint[];
        m_pointCount: number;
        m_destructionListener: DestructionListener;
        m_bombSpawnPoint: box2d.b2Vec2;
        m_bombSpawning: boolean;
        m_mouseWorld: box2d.b2Vec2;
        m_stepCount: number;
        m_maxProfile: box2d.b2Profile;
        m_totalProfile: box2d.b2Profile;
        m_groundBody: box2d.b2Body;
        constructor();
        JointDestroyed(joint: box2d.b2Joint): void;
        BeginContact(contact: box2d.b2Contact): void;
        EndContact(contact: box2d.b2Contact): void;
        private static PreSolve_s_state1;
        private static PreSolve_s_state2;
        private static PreSolve_s_worldManifold;
        PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void;
        PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse): void;
        Keyboard(key: string): void;
        KeyboardUp(key: string): void;
        SetTextLine(line: number): void;
        DrawTitle(title: string): void;
        MouseDown(p: box2d.b2Vec2): void;
        SpawnBomb(worldPt: box2d.b2Vec2): void;
        CompleteBombSpawn(p: box2d.b2Vec2): void;
        ShiftMouseDown(p: box2d.b2Vec2): void;
        MouseUp(p: box2d.b2Vec2): void;
        MouseMove(p: box2d.b2Vec2): void;
        LaunchBomb(): void;
        LaunchBombAt(position: box2d.b2Vec2, velocity: box2d.b2Vec2): void;
        Step(settings: Settings): void;
        ShiftOrigin(newOrigin: box2d.b2Vec2): void;
        GetDefaultViewZoom(): number;
    }
}
declare module "Testbed/Tests/Car" {
    import * as box2d from "Box2D/Box2D";
    import * as testbed from "Testbed/Testbed";
    export class Car extends testbed.Test {
        m_car: box2d.b2Body;
        m_wheel1: box2d.b2Body;
        m_wheel2: box2d.b2Body;
        m_hz: number;
        m_zeta: number;
        m_speed: number;
        m_spring1: box2d.b2WheelJoint;
        m_spring2: box2d.b2WheelJoint;
        constructor();
        Keyboard(key: string): void;
        Step(settings: testbed.Settings): void;
        static Create(): testbed.Test;
    }
}
declare module "Testbed/Tests/RayCast" {
    import * as testbed from "Testbed/Testbed";
    export class RayCast extends testbed.Test {
        private static e_maxBodies;
        private m_bodyIndex;
        private m_bodies;
        private m_polygons;
        private m_circle;
        private m_edge;
        private m_angle;
        private m_mode;
        constructor();
        CreateBody(index: number): void;
        DestroyBody(): void;
        Keyboard(key: string): void;
        Step(settings: testbed.Settings): void;
        static Create(): testbed.Test;
    }
}
declare module "Testbed/Tests/SphereStack" {
    import * as box2d from "Box2D/Box2D";
    import * as testbed from "Testbed/Testbed";
    export class SphereStack extends testbed.Test {
        static e_count: number;
        m_bodies: box2d.b2Body[];
        constructor();
        Step(settings: testbed.Settings): void;
        static Create(): testbed.Test;
    }
}
declare module "Testbed/Tests/TestEntries" {
    import { TestEntry } from "Testbed/Framework/Test";
    export const g_testEntries: TestEntry[];
}
declare module "Testbed/Framework/Main" {
    import * as box2d from "Box2D/Box2D";
    import { Settings, Test } from "Testbed/Framework/Test";
    export class Main {
        m_time_last: number;
        m_fps_time: number;
        m_fps_frames: number;
        m_fps: number;
        m_fps_div: HTMLDivElement;
        m_debug_div: HTMLDivElement;
        m_settings: Settings;
        m_test: Test;
        m_test_index: number;
        m_test_select: HTMLSelectElement;
        m_shift: boolean;
        m_ctrl: boolean;
        m_lMouseDown: boolean;
        m_rMouseDown: boolean;
        m_projection0: box2d.b2Vec2;
        m_viewCenter0: box2d.b2Vec2;
        m_demo_mode: boolean;
        m_demo_time: number;
        m_max_demo_time: number;
        m_canvas_div: HTMLDivElement;
        m_canvas: HTMLCanvasElement;
        m_ctx: CanvasRenderingContext2D;
        m_demo_button: HTMLButtonElement;
        constructor();
        HomeCamera(): void;
        MoveCamera(move: box2d.b2Vec2): void;
        ZoomCamera(zoom: number): void;
        private m_mouse;
        HandleMouseMove(e: MouseEvent): void;
        HandleMouseDown(e: MouseEvent): void;
        HandleMouseUp(e: MouseEvent): void;
        HandleTouchMove(e: TouchEvent): void;
        HandleTouchStart(e: TouchEvent): void;
        HandleTouchEnd(e: TouchEvent): void;
        HandleMouseWheel(e: MouseWheelEvent): void;
        HandleKeyDown(e: KeyboardEvent): void;
        HandleKeyUp(e: KeyboardEvent): void;
        UpdateTest(time_elapsed: number): void;
        DecrementTest(): void;
        IncrementTest(): void;
        LoadTest(restartTest?: boolean): void;
        Pause(): void;
        SingleStep(): void;
        ToggleDemo(): void;
        SimulationLoop(): void;
    }
}
declare module "Testbed/Testbed" {
    export * from "Testbed/Framework/Main";
    export * from "Testbed/Framework/DebugDraw";
    export * from "Testbed/Framework/Test";
    export * from "Testbed/Tests/TestEntries";
}
