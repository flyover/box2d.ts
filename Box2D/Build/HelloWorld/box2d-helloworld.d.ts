declare module "Box2D/Box2D/Common/b2Settings" {
    export function b2Assert(condition: boolean, ...args: any[]): void;
    export function b2Maybe<T>(value: T | undefined, def: T): T;
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
    export const b2_invalidParticleIndex: number;
    export const b2_maxParticleIndex: number;
    export const b2_particleStride: number;
    export const b2_minParticleWeight: number;
    export const b2_maxParticlePressure: number;
    export const b2_maxParticleForce: number;
    export const b2_maxTriadDistance: number;
    export const b2_maxTriadDistanceSquared: number;
    export const b2_minParticleSystemBufferCapacity: number;
    export const b2_barrierCollisionTime: number;
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
    export function b2MakeArray<T>(length: number, init: (i: number) => T): T[];
    export function b2MakeNullArray<T>(length: number): Array<T | null>;
    export function b2MakeNumberArray(length: number, init?: number): number[];
}
declare module "Box2D/Box2D/Common/b2Math" {
    export const b2_pi_over_180: number;
    export const b2_180_over_pi: number;
    export const b2_two_pi: number;
    export const b2Abs: (x: number) => number;
    export const b2Min: (...values: number[]) => number;
    export const b2Max: (...values: number[]) => number;
    export function b2Clamp(a: number, lo: number, hi: number): number;
    export function b2Swap<T>(a: T[], b: T[]): void;
    export function b2IsValid(n: number): boolean;
    export function b2Sq(n: number): number;
    export function b2InvSqrt(n: number): number;
    export const b2Sqrt: (x: number) => number;
    export const b2Pow: (x: number, y: number) => number;
    export function b2DegToRad(degrees: number): number;
    export function b2RadToDeg(radians: number): number;
    export const b2Cos: (x: number) => number;
    export const b2Sin: (x: number) => number;
    export const b2Acos: (x: number) => number;
    export const b2Asin: (x: number) => number;
    export const b2Atan2: (y: number, x: number) => number;
    export function b2NextPowerOfTwo(x: number): number;
    export function b2IsPowerOfTwo(x: number): boolean;
    export function b2Random(): number;
    export function b2RandomRange(lo: number, hi: number): number;
    export interface XY {
        x: number;
        y: number;
    }
    export class b2Vec2 implements XY {
        static readonly ZERO: Readonly<b2Vec2>;
        static readonly UNITX: Readonly<b2Vec2>;
        static readonly UNITY: Readonly<b2Vec2>;
        static readonly s_t0: b2Vec2;
        static readonly s_t1: b2Vec2;
        static readonly s_t2: b2Vec2;
        static readonly s_t3: b2Vec2;
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        Clone(): b2Vec2;
        SetZero(): this;
        Set(x: number, y: number): this;
        Copy(other: XY): this;
        SelfAdd(v: XY): this;
        SelfAddXY(x: number, y: number): this;
        SelfSub(v: XY): this;
        SelfSubXY(x: number, y: number): this;
        SelfMul(s: number): this;
        SelfMulAdd(s: number, v: XY): this;
        SelfMulSub(s: number, v: XY): this;
        Dot(v: XY): number;
        Cross(v: XY): number;
        Length(): number;
        LengthSquared(): number;
        Normalize(): number;
        SelfNormalize(): this;
        SelfRotate(radians: number): this;
        IsValid(): boolean;
        SelfCrossVS(s: number): this;
        SelfCrossSV(s: number): this;
        SelfMinV(v: XY): this;
        SelfMaxV(v: XY): this;
        SelfAbs(): this;
        SelfNeg(): this;
        SelfSkew(): this;
        static MakeArray(length: number): b2Vec2[];
        static AbsV<T extends XY>(v: XY, out: T): T;
        static MinV<T extends XY>(a: XY, b: XY, out: T): T;
        static MaxV<T extends XY>(a: XY, b: XY, out: T): T;
        static ClampV<T extends XY>(v: XY, lo: XY, hi: XY, out: T): T;
        static RotateV<T extends XY>(v: XY, radians: number, out: T): T;
        static DotVV(a: XY, b: XY): number;
        static CrossVV(a: XY, b: XY): number;
        static CrossVS<T extends XY>(v: XY, s: number, out: T): T;
        static CrossVOne<T extends XY>(v: XY, out: T): T;
        static CrossSV<T extends XY>(s: number, v: XY, out: T): T;
        static CrossOneV<T extends XY>(v: XY, out: T): T;
        static AddVV<T extends XY>(a: XY, b: XY, out: T): T;
        static SubVV<T extends XY>(a: XY, b: XY, out: T): T;
        static MulSV<T extends XY>(s: number, v: XY, out: T): T;
        static MulVS<T extends XY>(v: XY, s: number, out: T): T;
        static AddVMulSV<T extends XY>(a: XY, s: number, b: XY, out: T): T;
        static SubVMulSV<T extends XY>(a: XY, s: number, b: XY, out: T): T;
        static AddVCrossSV<T extends XY>(a: XY, s: number, v: XY, out: T): T;
        static MidVV<T extends XY>(a: XY, b: XY, out: T): T;
        static ExtVV<T extends XY>(a: XY, b: XY, out: T): T;
        static IsEqualToV(a: XY, b: XY): boolean;
        static DistanceVV(a: XY, b: XY): number;
        static DistanceSquaredVV(a: XY, b: XY): number;
        static NegV<T extends XY>(v: XY, out: T): T;
    }
    export const b2Vec2_zero: Readonly<b2Vec2>;
    export interface XYZ extends XY {
        z: number;
    }
    export class b2Vec3 implements XYZ {
        static readonly ZERO: Readonly<b2Vec3>;
        static readonly s_t0: b2Vec3;
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        Clone(): b2Vec3;
        SetZero(): this;
        SetXYZ(x: number, y: number, z: number): this;
        Copy(other: XYZ): this;
        SelfNeg(): this;
        SelfAdd(v: XYZ): this;
        SelfAddXYZ(x: number, y: number, z: number): this;
        SelfSub(v: XYZ): this;
        SelfSubXYZ(x: number, y: number, z: number): this;
        SelfMul(s: number): this;
        static DotV3V3(a: XYZ, b: XYZ): number;
        static CrossV3V3<T extends XYZ>(a: XYZ, b: XYZ, out: T): T;
    }
    export class b2Mat22 {
        static readonly IDENTITY: Readonly<b2Mat22>;
        readonly ex: b2Vec2;
        readonly ey: b2Vec2;
        Clone(): b2Mat22;
        static FromVV(c1: XY, c2: XY): b2Mat22;
        static FromSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        static FromAngle(radians: number): b2Mat22;
        SetSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): this;
        SetVV(c1: XY, c2: XY): this;
        SetAngle(radians: number): this;
        Copy(other: b2Mat22): this;
        SetIdentity(): this;
        SetZero(): this;
        GetAngle(): number;
        GetInverse(out: b2Mat22): b2Mat22;
        Solve<T extends XY>(b_x: number, b_y: number, out: T): T;
        SelfAbs(): this;
        SelfInv(): this;
        SelfAddM(M: b2Mat22): this;
        SelfSubM(M: b2Mat22): this;
        static AbsM(M: b2Mat22, out: b2Mat22): b2Mat22;
        static MulMV<T extends XY>(M: b2Mat22, v: XY, out: T): T;
        static MulTMV<T extends XY>(M: b2Mat22, v: XY, out: T): T;
        static AddMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
        static MulMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
        static MulTMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    }
    export class b2Mat33 {
        static readonly IDENTITY: Readonly<b2Mat33>;
        readonly ex: b2Vec3;
        readonly ey: b2Vec3;
        readonly ez: b2Vec3;
        Clone(): b2Mat33;
        SetVVV(c1: XYZ, c2: XYZ, c3: XYZ): this;
        Copy(other: b2Mat33): this;
        SetIdentity(): this;
        SetZero(): this;
        SelfAddM(M: b2Mat33): this;
        Solve33<T extends XYZ>(b_x: number, b_y: number, b_z: number, out: T): T;
        Solve22<T extends XY>(b_x: number, b_y: number, out: T): T;
        GetInverse22(M: b2Mat33): void;
        GetSymInverse33(M: b2Mat33): void;
        static MulM33V3<T extends XYZ>(A: b2Mat33, v: XYZ, out: T): T;
        static MulM33XYZ<T extends XYZ>(A: b2Mat33, x: number, y: number, z: number, out: T): T;
        static MulM33V2<T extends XY>(A: b2Mat33, v: XY, out: T): T;
        static MulM33XY<T extends XY>(A: b2Mat33, x: number, y: number, out: T): T;
    }
    export class b2Rot {
        static readonly IDENTITY: Readonly<b2Rot>;
        s: number;
        c: number;
        constructor(angle?: number);
        Clone(): b2Rot;
        Copy(other: b2Rot): this;
        SetAngle(angle: number): this;
        SetIdentity(): this;
        GetAngle(): number;
        GetXAxis<T extends XY>(out: T): T;
        GetYAxis<T extends XY>(out: T): T;
        static MulRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
        static MulTRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
        static MulRV<T extends XY>(q: b2Rot, v: XY, out: T): T;
        static MulTRV<T extends XY>(q: b2Rot, v: XY, out: T): T;
    }
    export class b2Transform {
        static readonly IDENTITY: Readonly<b2Transform>;
        readonly p: b2Vec2;
        readonly q: b2Rot;
        Clone(): b2Transform;
        Copy(other: b2Transform): this;
        SetIdentity(): this;
        SetPositionRotation(position: XY, q: Readonly<b2Rot>): this;
        SetPositionAngle(pos: XY, a: number): this;
        SetPosition(position: XY): this;
        SetPositionXY(x: number, y: number): this;
        SetRotation(rotation: Readonly<b2Rot>): this;
        SetRotationAngle(radians: number): this;
        GetPosition(): Readonly<b2Vec2>;
        GetRotation(): Readonly<b2Rot>;
        GetRotationAngle(): number;
        GetAngle(): number;
        static MulXV<T extends XY>(T: b2Transform, v: XY, out: T): T;
        static MulTXV<T extends XY>(T: b2Transform, v: XY, out: T): T;
        static MulXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
        static MulTXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
    }
    export class b2Sweep {
        readonly localCenter: b2Vec2;
        readonly c0: b2Vec2;
        readonly c: b2Vec2;
        a0: number;
        a: number;
        alpha0: number;
        Clone(): b2Sweep;
        Copy(other: b2Sweep): this;
        GetTransform(xf: b2Transform, beta: number): b2Transform;
        Advance(alpha: number): void;
        Normalize(): void;
    }
}
declare module "Box2D/Box2D/Common/b2Timer" {
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
declare module "Box2D/Box2D/Common/b2Draw" {
    import { b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    export interface RGB {
        r: number;
        g: number;
        b: number;
    }
    export interface RGBA extends RGB {
        a: number;
    }
    export class b2Color implements RGBA {
        static readonly ZERO: Readonly<b2Color>;
        static readonly RED: Readonly<b2Color>;
        static readonly GREEN: Readonly<b2Color>;
        static readonly BLUE: Readonly<b2Color>;
        r: number;
        g: number;
        b: number;
        a: number;
        constructor(rr?: number, gg?: number, bb?: number, aa?: number);
        Clone(): b2Color;
        Copy(other: RGBA): this;
        IsEqual(color: RGBA): boolean;
        IsZero(): boolean;
        Set(r: number, g: number, b: number, a?: number): void;
        SetByteRGB(r: number, g: number, b: number): this;
        SetByteRGBA(r: number, g: number, b: number, a: number): this;
        SetRGB(rr: number, gg: number, bb: number): this;
        SetRGBA(rr: number, gg: number, bb: number, aa: number): this;
        SelfAdd(color: RGBA): this;
        Add<T extends RGBA>(color: RGBA, out: T): T;
        SelfSub(color: RGBA): this;
        Sub<T extends RGBA>(color: RGBA, out: T): T;
        SelfMul(s: number): this;
        Mul<T extends RGBA>(s: number, out: T): T;
        Mix(mixColor: RGBA, strength: number): void;
        static MixColors(colorA: RGBA, colorB: RGBA, strength: number): void;
        MakeStyleString(alpha?: number): string;
        static MakeStyleString(r: number, g: number, b: number, a?: number): string;
    }
    export enum b2DrawFlags {
        e_none = 0,
        e_shapeBit = 1,
        e_jointBit = 2,
        e_aabbBit = 4,
        e_pairBit = 8,
        e_centerOfMassBit = 16,
        e_particleBit = 32,
        e_controllerBit = 64,
        e_all = 63
    }
    export class b2Draw {
        m_drawFlags: b2DrawFlags;
        SetFlags(flags: b2DrawFlags): void;
        GetFlags(): b2DrawFlags;
        AppendFlags(flags: b2DrawFlags): void;
        ClearFlags(flags: b2DrawFlags): void;
        PushTransform(xf: b2Transform): void;
        PopTransform(xf: b2Transform): void;
        DrawPolygon(vertices: XY[], vertexCount: number, color: RGBA): void;
        DrawSolidPolygon(vertices: XY[], vertexCount: number, color: RGBA): void;
        DrawCircle(center: XY, radius: number, color: RGBA): void;
        DrawSolidCircle(center: XY, radius: number, axis: XY, color: RGBA): void;
        DrawParticles(centers: XY[], radius: number, colors: RGBA[] | null, count: number): void;
        DrawSegment(p1: XY, p2: XY, color: RGBA): void;
        DrawTransform(xf: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Collision/b2Distance" {
    import { b2Vec2, b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
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
        readonly transformA: b2Transform;
        readonly transformB: b2Transform;
        useRadii: boolean;
        Reset(): b2DistanceInput;
    }
    export class b2DistanceOutput {
        readonly pointA: b2Vec2;
        readonly pointB: b2Vec2;
        distance: number;
        iterations: number;
        Reset(): b2DistanceOutput;
    }
    export let b2_gjkCalls: number;
    export let b2_gjkIters: number;
    export let b2_gjkMaxIters: number;
    export function b2_gjk_reset(): void;
    export class b2SimplexVertex {
        readonly wA: b2Vec2;
        readonly wB: b2Vec2;
        readonly w: b2Vec2;
        a: number;
        indexA: number;
        indexB: number;
        Copy(other: b2SimplexVertex): b2SimplexVertex;
    }
    export class b2Simplex {
        readonly m_v1: b2SimplexVertex;
        readonly m_v2: b2SimplexVertex;
        readonly m_v3: b2SimplexVertex;
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
declare module "Box2D/Box2D/Collision/Shapes/b2Shape" {
    import { b2Vec2, b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Box2D/Collision/b2Distance";
    export class b2MassData {
        mass: number;
        readonly center: b2Vec2;
        I: number;
    }
    export enum b2ShapeType {
        e_unknown = -1,
        e_circleShape = 0,
        e_edgeShape = 1,
        e_polygonShape = 2,
        e_chainShape = 3,
        e_shapeTypeCount = 4
    }
    export abstract class b2Shape {
        m_type: b2ShapeType;
        m_radius: number;
        constructor(type: b2ShapeType, radius: number);
        abstract Clone(): b2Shape;
        Copy(other: b2Shape): b2Shape;
        GetType(): b2ShapeType;
        abstract GetChildCount(): number;
        abstract TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        abstract ComputeDistance(xf: b2Transform, p: b2Vec2, normal: b2Vec2, childIndex: number): number;
        abstract RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: number): boolean;
        abstract ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
        abstract ComputeMass(massData: b2MassData, density: number): void;
        abstract SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
        abstract ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
        abstract Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Box2D/Collision/b2Collision" {
    import { b2Vec2, b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    export enum b2ContactFeatureType {
        e_vertex = 0,
        e_face = 1
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
        readonly cf: b2ContactFeature;
        Copy(o: b2ContactID): b2ContactID;
        Clone(): b2ContactID;
        key: number;
    }
    export class b2ManifoldPoint {
        readonly localPoint: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        id: b2ContactID;
        static MakeArray(length: number): b2ManifoldPoint[];
        Reset(): void;
        Copy(o: b2ManifoldPoint): b2ManifoldPoint;
    }
    export enum b2ManifoldType {
        e_unknown = -1,
        e_circles = 0,
        e_faceA = 1,
        e_faceB = 2
    }
    export class b2Manifold {
        points: b2ManifoldPoint[];
        readonly localNormal: b2Vec2;
        readonly localPoint: b2Vec2;
        type: number;
        pointCount: number;
        Reset(): void;
        Copy(o: b2Manifold): b2Manifold;
        Clone(): b2Manifold;
    }
    export class b2WorldManifold {
        readonly normal: b2Vec2;
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
    export enum b2PointState {
        b2_nullState = 0,
        b2_addState = 1,
        b2_persistState = 2,
        b2_removeState = 3
    }
    export function b2GetPointStates(state1: b2PointState[], state2: b2PointState[], manifold1: b2Manifold, manifold2: b2Manifold): void;
    export class b2ClipVertex {
        readonly v: b2Vec2;
        readonly id: b2ContactID;
        static MakeArray(length: number): b2ClipVertex[];
        Copy(other: b2ClipVertex): b2ClipVertex;
    }
    export class b2RayCastInput {
        readonly p1: b2Vec2;
        readonly p2: b2Vec2;
        maxFraction: number;
        Copy(o: b2RayCastInput): b2RayCastInput;
    }
    export class b2RayCastOutput {
        readonly normal: b2Vec2;
        fraction: number;
        Copy(o: b2RayCastOutput): b2RayCastOutput;
    }
    export class b2AABB {
        readonly lowerBound: b2Vec2;
        readonly upperBound: b2Vec2;
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
declare module "Box2D/Box2D/Common/b2GrowableStack" {
    export class b2GrowableStack<T> {
        m_stack: Array<T | null>;
        m_count: number;
        constructor(N: number);
        Reset(): this;
        Push(element: T | null): void;
        Pop(): T | null;
        GetCount(): number;
    }
}
declare module "Box2D/Box2D/Collision/b2DynamicTree" {
    import { b2Vec2, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2GrowableStack } from "Box2D/Box2D/Common/b2GrowableStack";
    import { b2AABB, b2RayCastInput } from "Box2D/Box2D/Collision/b2Collision";
    export class b2TreeNode {
        m_id: number;
        readonly aabb: b2AABB;
        userData: any;
        parent: b2TreeNode | null;
        child1: b2TreeNode | null;
        child2: b2TreeNode | null;
        height: number;
        constructor(id?: number);
        IsLeaf(): boolean;
    }
    export class b2DynamicTree {
        m_root: b2TreeNode | null;
        m_freeList: b2TreeNode | null;
        m_path: number;
        m_insertionCount: number;
        static readonly s_stack: b2GrowableStack<b2TreeNode>;
        static readonly s_r: b2Vec2;
        static readonly s_v: b2Vec2;
        static readonly s_abs_v: b2Vec2;
        static readonly s_segmentAABB: b2AABB;
        static readonly s_subInput: b2RayCastInput;
        static readonly s_combinedAABB: b2AABB;
        static readonly s_aabb: b2AABB;
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
        private static GetAreaNode;
        GetAreaRatio(): number;
        ComputeHeightNode(node: b2TreeNode | null): number;
        ComputeHeight(): number;
        ValidateStructure(index: b2TreeNode | null): void;
        ValidateMetrics(index: b2TreeNode | null): void;
        Validate(): void;
        private static GetMaxBalanceNode;
        GetMaxBalance(): number;
        RebuildBottomUp(): void;
        private static ShiftOriginNode;
        ShiftOrigin(newOrigin: XY): void;
    }
}
declare module "Box2D/Box2D/Collision/b2TimeOfImpact" {
    import { b2Vec2, b2Sweep } from "Box2D/Box2D/Common/b2Math";
    import { b2DistanceProxy, b2SimplexCache } from "Box2D/Box2D/Collision/b2Distance";
    export let b2_toiTime: number;
    export let b2_toiMaxTime: number;
    export let b2_toiCalls: number;
    export let b2_toiIters: number;
    export let b2_toiMaxIters: number;
    export let b2_toiRootIters: number;
    export let b2_toiMaxRootIters: number;
    export function b2_toi_reset(): void;
    export class b2TOIInput {
        readonly proxyA: b2DistanceProxy;
        readonly proxyB: b2DistanceProxy;
        readonly sweepA: b2Sweep;
        readonly sweepB: b2Sweep;
        tMax: number;
    }
    export enum b2TOIOutputState {
        e_unknown = 0,
        e_failed = 1,
        e_overlapped = 2,
        e_touching = 3,
        e_separated = 4
    }
    export class b2TOIOutput {
        state: b2TOIOutputState;
        t: number;
    }
    export enum b2SeparationFunctionType {
        e_unknown = -1,
        e_points = 0,
        e_faceA = 1,
        e_faceB = 2
    }
    export class b2SeparationFunction {
        m_proxyA: b2DistanceProxy;
        m_proxyB: b2DistanceProxy;
        readonly m_sweepA: b2Sweep;
        readonly m_sweepB: b2Sweep;
        m_type: b2SeparationFunctionType;
        readonly m_localPoint: b2Vec2;
        readonly m_axis: b2Vec2;
        Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, sweepA: b2Sweep, proxyB: b2DistanceProxy, sweepB: b2Sweep, t1: number): number;
        FindMinSeparation(indexA: number[], indexB: number[], t: number): number;
        Evaluate(indexA: number, indexB: number, t: number): number;
    }
    export function b2TimeOfImpact(output: b2TOIOutput, input: b2TOIInput): void;
}
declare module "Box2D/Box2D/Dynamics/b2TimeStep" {
    import { b2Vec2 } from "Box2D/Box2D/Common/b2Math";
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
        particleIterations: number;
        warmStarting: boolean;
        Copy(step: b2TimeStep): b2TimeStep;
    }
    export class b2Position {
        readonly c: b2Vec2;
        a: number;
        static MakeArray(length: number): b2Position[];
    }
    export class b2Velocity {
        readonly v: b2Vec2;
        w: number;
        static MakeArray(length: number): b2Velocity[];
    }
    export class b2SolverData {
        readonly step: b2TimeStep;
        positions: b2Position[];
        velocities: b2Velocity[];
    }
}
declare module "Box2D/Box2D/Dynamics/Joints/b2Joint" {
    import { b2Vec2, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export enum b2JointType {
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
        e_areaJoint = 12
    }
    export enum b2LimitState {
        e_inactiveLimit = 0,
        e_atLowerLimit = 1,
        e_atUpperLimit = 2,
        e_equalLimits = 3
    }
    export class b2Jacobian {
        readonly linear: b2Vec2;
        angularA: number;
        angularB: number;
        SetZero(): b2Jacobian;
        Set(x: XY, a1: number, a2: number): b2Jacobian;
    }
    export class b2JointEdge {
        readonly other: b2Body;
        readonly joint: b2Joint;
        prev: b2JointEdge | null;
        next: b2JointEdge | null;
        constructor(joint: b2Joint, other: b2Body);
    }
    export interface b2IJointDef {
        type: b2JointType;
        userData?: any;
        bodyA: b2Body;
        bodyB: b2Body;
        collideConnected?: boolean;
    }
    export class b2JointDef {
        type: b2JointType;
        userData: any;
        bodyA: b2Body;
        bodyB: b2Body;
        collideConnected: boolean;
        constructor(type: b2JointType);
    }
    export abstract class b2Joint {
        m_type: b2JointType;
        m_prev: b2Joint | null;
        m_next: b2Joint | null;
        m_edgeA: b2JointEdge;
        m_edgeB: b2JointEdge;
        m_bodyA: b2Body;
        m_bodyB: b2Body;
        m_index: number;
        m_islandFlag: boolean;
        m_collideConnected: boolean;
        m_userData: any;
        constructor(def: b2IJointDef);
        GetType(): b2JointType;
        GetBodyA(): b2Body;
        GetBodyB(): b2Body;
        abstract GetAnchorA<T extends XY>(out: T): T;
        abstract GetAnchorB<T extends XY>(out: T): T;
        abstract GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        abstract GetReactionTorque(inv_dt: number): number;
        GetNext(): b2Joint | null;
        GetUserData(): any;
        SetUserData(data: any): void;
        IsActive(): boolean;
        GetCollideConnected(): boolean;
        Dump(log: (format: string, ...args: any[]) => void): void;
        ShiftOrigin(newOrigin: XY): void;
        abstract InitVelocityConstraints(data: b2SolverData): void;
        abstract SolveVelocityConstraints(data: b2SolverData): void;
        abstract SolvePositionConstraints(data: b2SolverData): boolean;
    }
}
declare module "Box2D/Box2D/Dynamics/b2Fixture" {
    import { b2Vec2, b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2BroadPhase } from "Box2D/Box2D/Collision/b2BroadPhase";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2TreeNode } from "Box2D/Box2D/Collision/b2DynamicTree";
    import { b2Shape, b2ShapeType, b2MassData } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    export interface b2IFilter {
        categoryBits: number;
        maskBits: number;
        groupIndex?: number;
    }
    export class b2Filter implements b2IFilter {
        static readonly DEFAULT: Readonly<b2Filter>;
        categoryBits: number;
        maskBits: number;
        groupIndex: number;
        Clone(): b2Filter;
        Copy(other: b2IFilter): this;
    }
    export interface b2IFixtureDef {
        shape: b2Shape;
        userData?: any;
        friction?: number;
        restitution?: number;
        density?: number;
        isSensor?: boolean;
        filter?: b2IFilter;
    }
    export class b2FixtureDef implements b2IFixtureDef {
        shape: b2Shape;
        userData: any;
        friction: number;
        restitution: number;
        density: number;
        isSensor: boolean;
        readonly filter: b2Filter;
    }
    export class b2FixtureProxy {
        readonly aabb: b2AABB;
        fixture: b2Fixture;
        childIndex: number;
        treeNode: b2TreeNode;
        constructor(fixture: b2Fixture);
    }
    export class b2Fixture {
        m_density: number;
        m_next: b2Fixture | null;
        readonly m_body: b2Body;
        readonly m_shape: b2Shape;
        m_friction: number;
        m_restitution: number;
        m_proxies: b2FixtureProxy[];
        m_proxyCount: number;
        readonly m_filter: b2Filter;
        m_isSensor: boolean;
        m_userData: any;
        constructor(def: b2IFixtureDef, body: b2Body);
        GetType(): b2ShapeType;
        GetShape(): b2Shape;
        SetSensor(sensor: boolean): void;
        IsSensor(): boolean;
        SetFilterData(filter: b2Filter): void;
        GetFilterData(): Readonly<b2Filter>;
        Refilter(): void;
        GetBody(): b2Body;
        GetNext(): b2Fixture | null;
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
        GetAABB(childIndex: number): Readonly<b2AABB>;
        Dump(log: (format: string, ...args: any[]) => void, bodyIndex: number): void;
        Create(/*body: b2Body,*/ def: b2IFixtureDef): void;
        Destroy(): void;
        CreateProxies(broadPhase: b2BroadPhase, xf: b2Transform): void;
        DestroyProxies(broadPhase: b2BroadPhase): void;
        private static Synchronize_s_aabb1;
        private static Synchronize_s_aabb2;
        private static Synchronize_s_displacement;
        Synchronize(broadPhase: b2BroadPhase, transform1: b2Transform, transform2: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Common/b2BlockAllocator" {
    export class b2BlockAllocator {
    }
}
declare module "Box2D/Box2D/Common/b2StackAllocator" {
    export class b2StackAllocator {
    }
}
declare module "Box2D/Box2D/Collision/Shapes/b2CircleShape" {
    import { b2Vec2, b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    export class b2CircleShape extends b2Shape {
        readonly m_p: b2Vec2;
        constructor(radius?: number);
        Set(position: XY, radius?: number): this;
        Clone(): b2CircleShape;
        Copy(other: b2CircleShape): b2CircleShape;
        GetChildCount(): number;
        private static TestPoint_s_center;
        private static TestPoint_s_d;
        TestPoint(transform: b2Transform, p: XY): boolean;
        private static ComputeDistance_s_center;
        ComputeDistance(xf: b2Transform, p: b2Vec2, normal: b2Vec2, childIndex: number): number;
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
declare module "Box2D/Box2D/Collision/Shapes/b2PolygonShape" {
    import { b2Vec2, b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    export class b2PolygonShape extends b2Shape {
        readonly m_centroid: b2Vec2;
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
        Set(vertices: XY[], count?: number, start?: number): b2PolygonShape;
        SetAsArray(vertices: XY[], count?: number): b2PolygonShape;
        SetAsBox(hx: number, hy: number, center?: XY, angle?: number): b2PolygonShape;
        private static TestPoint_s_pLocal;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        private static ComputeDistance_s_pLocal;
        private static ComputeDistance_s_normalForMaxDistance;
        private static ComputeDistance_s_minDistance;
        private static ComputeDistance_s_distance;
        ComputeDistance(xf: b2Transform, p: b2Vec2, normal: b2Vec2, childIndex: number): number;
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
declare module "Box2D/Box2D/Collision/b2CollideCircle" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2CircleShape } from "Box2D/Box2D/Collision/Shapes/b2CircleShape";
    import { b2PolygonShape } from "Box2D/Box2D/Collision/Shapes/b2PolygonShape";
    export function b2CollideCircles(manifold: b2Manifold, circleA: b2CircleShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
    export function b2CollidePolygonAndCircle(manifold: b2Manifold, polygonA: b2PolygonShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
}
declare module "Box2D/Box2D/Collision/b2CollidePolygon" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2PolygonShape } from "Box2D/Box2D/Collision/Shapes/b2PolygonShape";
    export function b2CollidePolygons(manifold: b2Manifold, polyA: b2PolygonShape, xfA: b2Transform, polyB: b2PolygonShape, xfB: b2Transform): void;
}
declare module "Box2D/Box2D/Collision/Shapes/b2EdgeShape" {
    import { b2Vec2, b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    export class b2EdgeShape extends b2Shape {
        readonly m_vertex1: b2Vec2;
        readonly m_vertex2: b2Vec2;
        readonly m_vertex0: b2Vec2;
        readonly m_vertex3: b2Vec2;
        m_hasVertex0: boolean;
        m_hasVertex3: boolean;
        constructor();
        Set(v1: XY, v2: XY): b2EdgeShape;
        Clone(): b2EdgeShape;
        Copy(other: b2EdgeShape): b2EdgeShape;
        GetChildCount(): number;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        private static ComputeDistance_s_v1;
        private static ComputeDistance_s_v2;
        private static ComputeDistance_s_d;
        private static ComputeDistance_s_s;
        ComputeDistance(xf: b2Transform, p: b2Vec2, normal: b2Vec2, childIndex: number): number;
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
declare module "Box2D/Box2D/Collision/b2CollideEdge" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2CircleShape } from "Box2D/Box2D/Collision/Shapes/b2CircleShape";
    import { b2PolygonShape } from "Box2D/Box2D/Collision/Shapes/b2PolygonShape";
    import { b2EdgeShape } from "Box2D/Box2D/Collision/Shapes/b2EdgeShape";
    export function b2CollideEdgeAndCircle(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
    export function b2CollideEdgeAndPolygon(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, polygonB: b2PolygonShape, xfB: b2Transform): void;
}
declare module "Box2D/Box2D/Collision/Shapes/b2ChainShape" {
    import { b2Vec2, b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2DistanceProxy } from "Box2D/Box2D/Collision/b2Distance";
    import { b2MassData } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2EdgeShape } from "Box2D/Box2D/Collision/Shapes/b2EdgeShape";
    export class b2ChainShape extends b2Shape {
        m_vertices: b2Vec2[];
        m_count: number;
        readonly m_prevVertex: b2Vec2;
        readonly m_nextVertex: b2Vec2;
        m_hasPrevVertex: boolean;
        m_hasNextVertex: boolean;
        constructor();
        CreateLoop(vertices: XY[], count?: number, start?: number): b2ChainShape;
        CreateChain(vertices: XY[], count?: number, start?: number): b2ChainShape;
        SetPrevVertex(prevVertex: XY): b2ChainShape;
        SetNextVertex(nextVertex: XY): b2ChainShape;
        Clone(): b2ChainShape;
        Copy(other: b2ChainShape): b2ChainShape;
        GetChildCount(): number;
        GetChildEdge(edge: b2EdgeShape, index: number): void;
        TestPoint(xf: b2Transform, p: b2Vec2): boolean;
        private static ComputeDistance_s_edgeShape;
        ComputeDistance(xf: b2Transform, p: b2Vec2, normal: b2Vec2, childIndex: number): number;
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
declare module "Box2D/Box2D/Particle/b2Particle" {
    import { b2Vec2, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Color, RGBA } from "Box2D/Box2D/Common/b2Draw";
    import { b2ParticleGroup } from "Box2D/Box2D/Particle/b2ParticleGroup";
    /**
     * The particle type. Can be combined with the | operator.
     */
    export enum b2ParticleFlag {
        b2_waterParticle = 0,
        b2_zombieParticle = 2,
        b2_wallParticle = 4,
        b2_springParticle = 8,
        b2_elasticParticle = 16,
        b2_viscousParticle = 32,
        b2_powderParticle = 64,
        b2_tensileParticle = 128,
        b2_colorMixingParticle = 256,
        b2_destructionListenerParticle = 512,
        b2_barrierParticle = 1024,
        b2_staticPressureParticle = 2048,
        b2_reactiveParticle = 4096,
        b2_repulsiveParticle = 8192,
        b2_fixtureContactListenerParticle = 16384,
        b2_particleContactListenerParticle = 32768,
        b2_fixtureContactFilterParticle = 65536,
        b2_particleContactFilterParticle = 131072
    }
    export interface b2IParticleDef {
        flags?: b2ParticleFlag;
        position?: XY;
        velocity?: XY;
        color?: RGBA;
        lifetime?: number;
        userData?: any;
        group?: b2ParticleGroup | null;
    }
    export class b2ParticleDef implements b2IParticleDef {
        flags: b2ParticleFlag;
        readonly position: b2Vec2;
        readonly velocity: b2Vec2;
        readonly color: b2Color;
        lifetime: number;
        userData: any;
        group: b2ParticleGroup | null;
    }
    export function b2CalculateParticleIterations(gravity: number, radius: number, timeStep: number): number;
    export class b2ParticleHandle {
        m_index: number;
        GetIndex(): number;
        SetIndex(index: number): void;
    }
}
declare module "Box2D/Box2D/Particle/b2StackQueue" {
    export class b2StackQueue<T> {
        m_buffer: Array<T | null>;
        m_front: number;
        m_back: number;
        m_capacity: number;
        constructor(capacity: number);
        Push(item: T): void;
        Pop(): void;
        Empty(): boolean;
        Front(): T;
    }
}
declare module "Box2D/Box2D/Particle/b2VoronoiDiagram" {
    import { b2Vec2 } from "Box2D/Box2D/Common/b2Math";
    /**
     * A field representing the nearest generator from each point.
     */
    export class b2VoronoiDiagram {
        m_generatorBuffer: b2VoronoiDiagram.Generator[];
        m_generatorCapacity: number;
        m_generatorCount: number;
        m_countX: number;
        m_countY: number;
        m_diagram: b2VoronoiDiagram.Generator[];
        constructor(generatorCapacity: number);
        /**
         * Add a generator.
         *
         * @param center the position of the generator.
         * @param tag a tag used to identify the generator in callback functions.
         * @param necessary whether to callback for nodes associated with the generator.
         */
        AddGenerator(center: b2Vec2, tag: number, necessary: boolean): void;
        /**
         * Generate the Voronoi diagram. It is rasterized with a given
         * interval in the same range as the necessary generators exist.
         *
         * @param radius the interval of the diagram.
         * @param margin margin for which the range of the diagram is extended.
         */
        Generate(radius: number, margin: number): void;
        /**
         * Enumerate all nodes that contain at least one necessary
         * generator.
         */
        GetNodes(callback: b2VoronoiDiagram.NodeCallback): void;
    }
    export namespace b2VoronoiDiagram {
        /**
         * Callback used by GetNodes().
         *
         * Receive tags for generators associated with a node.
         */
        type NodeCallback = (a: number, b: number, c: number) => void;
        class Generator {
            center: b2Vec2;
            tag: number;
            necessary: boolean;
        }
        class Task {
            m_x: number;
            m_y: number;
            m_i: number;
            m_generator: b2VoronoiDiagram.Generator;
            constructor(x: number, y: number, i: number, g: b2VoronoiDiagram.Generator);
        }
    }
}
declare module "Box2D/Box2D/Particle/b2ParticleSystem" {
    import { b2Vec2, b2Rot, b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Color } from "Box2D/Box2D/Common/b2Draw";
    import { b2AABB, b2RayCastInput, b2RayCastOutput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Shape, b2MassData } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2EdgeShape } from "Box2D/Box2D/Collision/Shapes/b2EdgeShape";
    import { b2TimeStep } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2World } from "Box2D/Box2D/Dynamics/b2World";
    import { b2ContactFilter, b2ContactListener, b2QueryCallback, b2RayCastCallback } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    import { b2ParticleFlag, b2ParticleHandle, b2IParticleDef } from "Box2D/Box2D/Particle/b2Particle";
    import { b2ParticleGroupFlag, b2ParticleGroup, b2IParticleGroupDef } from "Box2D/Box2D/Particle/b2ParticleGroup";
    import { b2DistanceProxy } from "Box2D/Box2D/Collision/b2Distance";
    export class b2GrowableBuffer<T> {
        data: T[];
        count: number;
        capacity: number;
        allocator: () => T;
        constructor(allocator: () => T);
        Append(): number;
        Reserve(newCapacity: number): void;
        Grow(): void;
        Free(): void;
        Shorten(newEnd: number): void;
        Data(): T[];
        GetCount(): number;
        SetCount(newCount: number): void;
        GetCapacity(): number;
        RemoveIf(pred: (t: T) => boolean): void;
        Unique(pred: (a: T, b: T) => boolean): void;
    }
    export type b2ParticleIndex = number;
    export class b2FixtureParticleQueryCallback extends b2QueryCallback {
        m_system: b2ParticleSystem;
        constructor(system: b2ParticleSystem);
        ShouldQueryParticleSystem(system: b2ParticleSystem): boolean;
        ReportFixture(fixture: b2Fixture): boolean;
        ReportParticle(system: b2ParticleSystem, index: number): boolean;
        ReportFixtureAndParticle(fixture: b2Fixture, childIndex: number, index: number): void;
    }
    export class b2ParticleContact {
        indexA: number;
        indexB: number;
        weight: number;
        normal: b2Vec2;
        flags: b2ParticleFlag;
        SetIndices(a: number, b: number): void;
        SetWeight(w: number): void;
        SetNormal(n: b2Vec2): void;
        SetFlags(f: b2ParticleFlag): void;
        GetIndexA(): number;
        GetIndexB(): number;
        GetWeight(): number;
        GetNormal(): b2Vec2;
        GetFlags(): b2ParticleFlag;
        IsEqual(rhs: b2ParticleContact): boolean;
        IsNotEqual(rhs: b2ParticleContact): boolean;
        ApproximatelyEqual(rhs: b2ParticleContact): boolean;
    }
    export class b2ParticleBodyContact {
        index: number;
        body: b2Body;
        fixture: b2Fixture;
        weight: number;
        normal: b2Vec2;
        mass: number;
    }
    export class b2ParticlePair {
        indexA: number;
        indexB: number;
        flags: b2ParticleFlag;
        strength: number;
        distance: number;
    }
    export class b2ParticleTriad {
        indexA: number;
        indexB: number;
        indexC: number;
        flags: b2ParticleFlag;
        strength: number;
        pa: b2Vec2;
        pb: b2Vec2;
        pc: b2Vec2;
        ka: number;
        kb: number;
        kc: number;
        s: number;
    }
    export class b2ParticleSystemDef {
        /**
         * Enable strict Particle/Body contact check.
         * See SetStrictContactCheck for details.
         */
        strictContactCheck: boolean;
        /**
         * Set the particle density.
         * See SetDensity for details.
         */
        density: number;
        /**
         * Change the particle gravity scale. Adjusts the effect of the
         * global gravity vector on particles. Default value is 1.0f.
         */
        gravityScale: number;
        /**
         * Particles behave as circles with this radius. In Box2D units.
         */
        radius: number;
        /**
         * Set the maximum number of particles.
         * By default, there is no maximum. The particle buffers can
         * continue to grow while b2World's block allocator still has
         * memory.
         * See SetMaxParticleCount for details.
         */
        maxCount: number;
        /**
         * Increases pressure in response to compression
         * Smaller values allow more compression
         */
        pressureStrength: number;
        /**
         * Reduces velocity along the collision normal
         * Smaller value reduces less
         */
        dampingStrength: number;
        /**
         * Restores shape of elastic particle groups
         * Larger values increase elastic particle velocity
         */
        elasticStrength: number;
        /**
         * Restores length of spring particle groups
         * Larger values increase spring particle velocity
         */
        springStrength: number;
        /**
         * Reduces relative velocity of viscous particles
         * Larger values slow down viscous particles more
         */
        viscousStrength: number;
        /**
         * Produces pressure on tensile particles
         * 0~0.2. Larger values increase the amount of surface tension.
         */
        surfaceTensionPressureStrength: number;
        /**
         * Smoothes outline of tensile particles
         * 0~0.2. Larger values result in rounder, smoother,
         * water-drop-like clusters of particles.
         */
        surfaceTensionNormalStrength: number;
        /**
         * Produces additional pressure on repulsive particles
         * Larger values repulse more
         * Negative values mean attraction. The range where particles
         * behave stably is about -0.2 to 2.0.
         */
        repulsiveStrength: number;
        /**
         * Produces repulsion between powder particles
         * Larger values repulse more
         */
        powderStrength: number;
        /**
         * Pushes particles out of solid particle group
         * Larger values repulse more
         */
        ejectionStrength: number;
        /**
         * Produces static pressure
         * Larger values increase the pressure on neighboring partilces
         * For a description of static pressure, see
         * http://en.wikipedia.org/wiki/Static_pressure#Static_pressure_in_fluid_dynamics
         */
        staticPressureStrength: number;
        /**
         * Reduces instability in static pressure calculation
         * Larger values make stabilize static pressure with fewer
         * iterations
         */
        staticPressureRelaxation: number;
        /**
         * Computes static pressure more precisely
         * See SetStaticPressureIterations for details
         */
        staticPressureIterations: number;
        /**
         * Determines how fast colors are mixed
         * 1.0f ==> mixed immediately
         * 0.5f ==> mixed half way each simulation step (see
         * b2World::Step())
         */
        colorMixingStrength: number;
        /**
         * Whether to destroy particles by age when no more particles
         * can be created.  See #b2ParticleSystem::SetDestructionByAge()
         * for more information.
         */
        destroyByAge: boolean;
        /**
         * Granularity of particle lifetimes in seconds.  By default
         * this is set to (1.0f / 60.0f) seconds.  b2ParticleSystem uses
         * a 32-bit signed value to track particle lifetimes so the
         * maximum lifetime of a particle is (2^32 - 1) / (1.0f /
         * lifetimeGranularity) seconds. With the value set to 1/60 the
         * maximum lifetime or age of a particle is 2.27 years.
         */
        lifetimeGranularity: number;
        Copy(def: b2ParticleSystemDef): b2ParticleSystemDef;
        Clone(): b2ParticleSystemDef;
    }
    export class b2ParticleSystem {
        m_paused: boolean;
        m_timestamp: number;
        m_allParticleFlags: b2ParticleFlag;
        m_needsUpdateAllParticleFlags: boolean;
        m_allGroupFlags: b2ParticleGroupFlag;
        m_needsUpdateAllGroupFlags: boolean;
        m_hasForce: boolean;
        m_iterationIndex: number;
        m_inverseDensity: number;
        m_particleDiameter: number;
        m_inverseDiameter: number;
        m_squaredDiameter: number;
        m_count: number;
        m_internalAllocatedCapacity: number;
        /**
         * Allocator for b2ParticleHandle instances.
         */
        /**
         * Maps particle indicies to handles.
         */
        m_handleIndexBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleHandle | null>;
        m_flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag>;
        m_positionBuffer: b2ParticleSystem.UserOverridableBuffer<b2Vec2>;
        m_velocityBuffer: b2ParticleSystem.UserOverridableBuffer<b2Vec2>;
        m_forceBuffer: b2Vec2[];
        /**
         * this.m_weightBuffer is populated in ComputeWeight and used in
         * ComputeDepth(), SolveStaticPressure() and SolvePressure().
         */
        m_weightBuffer: number[];
        /**
         * When any particles have the flag b2_staticPressureParticle,
         * this.m_staticPressureBuffer is first allocated and used in
         * SolveStaticPressure() and SolvePressure().  It will be
         * reallocated on subsequent CreateParticle() calls.
         */
        m_staticPressureBuffer: number[];
        /**
         * this.m_accumulationBuffer is used in many functions as a temporary
         * buffer for scalar values.
         */
        m_accumulationBuffer: number[];
        /**
         * When any particles have the flag b2_tensileParticle,
         * this.m_accumulation2Buffer is first allocated and used in
         * SolveTensile() as a temporary buffer for vector values.  It
         * will be reallocated on subsequent CreateParticle() calls.
         */
        m_accumulation2Buffer: b2Vec2[];
        /**
         * When any particle groups have the flag b2_solidParticleGroup,
         * this.m_depthBuffer is first allocated and populated in
         * ComputeDepth() and used in SolveSolid(). It will be
         * reallocated on subsequent CreateParticle() calls.
         */
        m_depthBuffer: number[];
        m_colorBuffer: b2ParticleSystem.UserOverridableBuffer<b2Color>;
        m_groupBuffer: Array<b2ParticleGroup | null>;
        m_userDataBuffer: b2ParticleSystem.UserOverridableBuffer<any>;
        /**
         * Stuck particle detection parameters and record keeping
         */
        m_stuckThreshold: number;
        m_lastBodyContactStepBuffer: b2ParticleSystem.UserOverridableBuffer<number>;
        m_bodyContactCountBuffer: b2ParticleSystem.UserOverridableBuffer<number>;
        m_consecutiveContactStepsBuffer: b2ParticleSystem.UserOverridableBuffer<number>;
        m_stuckParticleBuffer: b2GrowableBuffer<number>;
        m_proxyBuffer: b2GrowableBuffer<b2ParticleSystem.Proxy>;
        m_contactBuffer: b2GrowableBuffer<b2ParticleContact>;
        m_bodyContactBuffer: b2GrowableBuffer<b2ParticleBodyContact>;
        m_pairBuffer: b2GrowableBuffer<b2ParticlePair>;
        m_triadBuffer: b2GrowableBuffer<b2ParticleTriad>;
        /**
         * Time each particle should be destroyed relative to the last
         * time this.m_timeElapsed was initialized.  Each unit of time
         * corresponds to b2ParticleSystemDef::lifetimeGranularity
         * seconds.
         */
        m_expirationTimeBuffer: b2ParticleSystem.UserOverridableBuffer<number>;
        /**
         * List of particle indices sorted by expiration time.
         */
        m_indexByExpirationTimeBuffer: b2ParticleSystem.UserOverridableBuffer<number>;
        /**
         * Time elapsed in 32:32 fixed point.  Each non-fractional unit
         * of time corresponds to
         * b2ParticleSystemDef::lifetimeGranularity seconds.
         */
        m_timeElapsed: number;
        /**
         * Whether the expiration time buffer has been modified and
         * needs to be resorted.
         */
        m_expirationTimeBufferRequiresSorting: boolean;
        m_groupCount: number;
        m_groupList: b2ParticleGroup | null;
        m_def: b2ParticleSystemDef;
        m_world: b2World;
        m_prev: b2ParticleSystem | null;
        m_next: b2ParticleSystem | null;
        static readonly xTruncBits: number;
        static readonly yTruncBits: number;
        static readonly tagBits: number;
        static readonly yOffset: number;
        static readonly yShift: number;
        static readonly xShift: number;
        static readonly xScale: number;
        static readonly xOffset: number;
        static readonly yMask: number;
        static readonly xMask: number;
        static computeTag(x: number, y: number): number;
        static computeRelativeTag(tag: number, x: number, y: number): number;
        constructor(def: b2ParticleSystemDef, world: b2World);
        Drop(): void;
        /**
         * Create a particle whose properties have been defined.
         *
         * No reference to the definition is retained.
         *
         * A simulation step must occur before it's possible to interact
         * with a newly created particle.  For example,
         * DestroyParticleInShape() will not destroy a particle until
         * b2World::Step() has been called.
         *
         * warning: This function is locked during callbacks.
         */
        CreateParticle(def: b2IParticleDef): number;
        /**
         * Retrieve a handle to the particle at the specified index.
         *
         * Please see #b2ParticleHandle for why you might want a handle.
         */
        GetParticleHandleFromIndex(index: number): b2ParticleHandle;
        /**
         * Destroy a particle.
         *
         * The particle is removed after the next simulation step (see
         * b2World::Step()).
         *
         * @param index Index of the particle to destroy.
         * @param callDestructionListener Whether to call the
         *      destruction listener just before the particle is
         *      destroyed.
         */
        DestroyParticle(index: number, callDestructionListener?: boolean): void;
        /**
         * Destroy the Nth oldest particle in the system.
         *
         * The particle is removed after the next b2World::Step().
         *
         * @param index Index of the Nth oldest particle to
         *      destroy, 0 will destroy the oldest particle in the
         *      system, 1 will destroy the next oldest particle etc.
         * @param callDestructionListener Whether to call the
         *      destruction listener just before the particle is
         *      destroyed.
         */
        DestroyOldestParticle(index: number, callDestructionListener?: boolean): void;
        /**
         * Destroy particles inside a shape.
         *
         * warning: This function is locked during callbacks.
         *
         * In addition, this function immediately destroys particles in
         * the shape in constrast to DestroyParticle() which defers the
         * destruction until the next simulation step.
         *
         * @return Number of particles destroyed.
         * @param shape Shape which encloses particles
         *      that should be destroyed.
         * @param xf Transform applied to the shape.
         * @param callDestructionListener Whether to call the
         *      world b2DestructionListener for each particle
         *      destroyed.
         */
        DestroyParticlesInShape(shape: b2Shape, xf: b2Transform, callDestructionListener?: boolean): number;
        static readonly DestroyParticlesInShape_s_aabb: b2AABB;
        /**
         * Create a particle group whose properties have been defined.
         *
         * No reference to the definition is retained.
         *
         * warning: This function is locked during callbacks.
         */
        CreateParticleGroup(groupDef: b2IParticleGroupDef): b2ParticleGroup;
        static readonly CreateParticleGroup_s_transform: b2Transform;
        /**
         * Join two particle groups.
         *
         * warning: This function is locked during callbacks.
         *
         * @param groupA the first group. Expands to encompass the second group.
         * @param groupB the second group. It is destroyed.
         */
        JoinParticleGroups(groupA: b2ParticleGroup, groupB: b2ParticleGroup): void;
        /**
         * Split particle group into multiple disconnected groups.
         *
         * warning: This function is locked during callbacks.
         *
         * @param group the group to be split.
         */
        SplitParticleGroup(group: b2ParticleGroup): void;
        /**
         * Get the world particle group list. With the returned group,
         * use b2ParticleGroup::GetNext to get the next group in the
         * world list.
         *
         * A null group indicates the end of the list.
         *
         * @return the head of the world particle group list.
         */
        GetParticleGroupList(): b2ParticleGroup | null;
        /**
         * Get the number of particle groups.
         */
        GetParticleGroupCount(): number;
        /**
         * Get the number of particles.
         */
        GetParticleCount(): number;
        /**
         * Get the maximum number of particles.
         */
        GetMaxParticleCount(): number;
        /**
         * Set the maximum number of particles.
         *
         * A value of 0 means there is no maximum. The particle buffers
         * can continue to grow while b2World's block allocator still
         * has memory.
         *
         * Note: If you try to CreateParticle() with more than this
         * count, b2_invalidParticleIndex is returned unless
         * SetDestructionByAge() is used to enable the destruction of
         * the oldest particles in the system.
         */
        SetMaxParticleCount(count: number): void;
        /**
         * Get all existing particle flags.
         */
        GetAllParticleFlags(): b2ParticleFlag;
        /**
         * Get all existing particle group flags.
         */
        GetAllGroupFlags(): b2ParticleGroupFlag;
        /**
         * Pause or unpause the particle system. When paused,
         * b2World::Step() skips over this particle system. All
         * b2ParticleSystem function calls still work.
         *
         * @param paused paused is true to pause, false to un-pause.
         */
        SetPaused(paused: boolean): void;
        /**
         * Initially, true, then, the last value passed into
         * SetPaused().
         *
         * @return true if the particle system is being updated in b2World::Step().
         */
        GetPaused(): boolean;
        /**
         * Change the particle density.
         *
         * Particle density affects the mass of the particles, which in
         * turn affects how the particles interact with b2Bodies. Note
         * that the density does not affect how the particles interact
         * with each other.
         */
        SetDensity(density: number): void;
        /**
         * Get the particle density.
         */
        GetDensity(): number;
        /**
         * Change the particle gravity scale. Adjusts the effect of the
         * global gravity vector on particles.
         */
        SetGravityScale(gravityScale: number): void;
        /**
         * Get the particle gravity scale.
         */
        GetGravityScale(): number;
        /**
         * Damping is used to reduce the velocity of particles. The
         * damping parameter can be larger than 1.0f but the damping
         * effect becomes sensitive to the time step when the damping
         * parameter is large.
         */
        SetDamping(damping: number): void;
        /**
         * Get damping for particles
         */
        GetDamping(): number;
        /**
         * Change the number of iterations when calculating the static
         * pressure of particles. By default, 8 iterations. You can
         * reduce the number of iterations down to 1 in some situations,
         * but this may cause instabilities when many particles come
         * together. If you see particles popping away from each other
         * like popcorn, you may have to increase the number of
         * iterations.
         *
         * For a description of static pressure, see
         * http://en.wikipedia.org/wiki/Static_pressure#Static_pressure_in_fluid_dynamics
         */
        SetStaticPressureIterations(iterations: number): void;
        /**
         * Get the number of iterations for static pressure of
         * particles.
         */
        GetStaticPressureIterations(): number;
        /**
         * Change the particle radius.
         *
         * You should set this only once, on world start.
         * If you change the radius during execution, existing particles
         * may explode, shrink, or behave unexpectedly.
         */
        SetRadius(radius: number): void;
        /**
         * Get the particle radius.
         */
        GetRadius(): number;
        /**
         * Get the position of each particle
         *
         * Array is length GetParticleCount()
         *
         * @return the pointer to the head of the particle positions array.
         */
        GetPositionBuffer(): b2Vec2[];
        /**
         * Get the velocity of each particle
         *
         * Array is length GetParticleCount()
         *
         * @return the pointer to the head of the particle velocities array.
         */
        GetVelocityBuffer(): b2Vec2[];
        /**
         * Get the color of each particle
         *
         * Array is length GetParticleCount()
         *
         * @return the pointer to the head of the particle colors array.
         */
        GetColorBuffer(): b2Color[];
        /**
         * Get the particle-group of each particle.
         *
         * Array is length GetParticleCount()
         *
         * @return the pointer to the head of the particle group array.
         */
        GetGroupBuffer(): Array<b2ParticleGroup | null>;
        /**
         * Get the weight of each particle
         *
         * Array is length GetParticleCount()
         *
         * @return the pointer to the head of the particle positions array.
         */
        GetWeightBuffer(): number[];
        /**
         * Get the user-specified data of each particle.
         *
         * Array is length GetParticleCount()
         *
         * @return the pointer to the head of the particle user-data array.
         */
        GetUserDataBuffer<T>(): T[];
        /**
         * Get the flags for each particle. See the b2ParticleFlag enum.
         *
         * Array is length GetParticleCount()
         *
         * @return the pointer to the head of the particle-flags array.
         */
        GetFlagsBuffer(): b2ParticleFlag[];
        /**
         * Set flags for a particle. See the b2ParticleFlag enum.
         */
        SetParticleFlags(index: number, newFlags: b2ParticleFlag): void;
        /**
         * Get flags for a particle. See the b2ParticleFlag enum.
         */
        GetParticleFlags(index: number): b2ParticleFlag;
        /**
         * Set an external buffer for particle data.
         *
         * Normally, the b2World's block allocator is used for particle
         * data. However, sometimes you may have an OpenGL or Java
         * buffer for particle data. To avoid data duplication, you may
         * supply this external buffer.
         *
         * Note that, when b2World's block allocator is used, the
         * particle data buffers can grow as required. However, when
         * external buffers are used, the maximum number of particles is
         * clamped to the size of the smallest external buffer.
         *
         * @param buffer a pointer to a block of memory.
         * @param capacity the number of values in the block.
         */
        SetFlagsBuffer(buffer: b2ParticleFlag[], capacity: number): void;
        SetPositionBuffer(buffer: b2Vec2[], capacity: number): void;
        SetVelocityBuffer(buffer: b2Vec2[], capacity: number): void;
        SetColorBuffer(buffer: b2Color[], capacity: number): void;
        SetUserDataBuffer<T>(buffer: T[], capacity: number): void;
        /**
         * Get contacts between particles
         * Contact data can be used for many reasons, for example to
         * trigger rendering or audio effects.
         */
        GetContacts(): b2ParticleContact[];
        GetContactCount(): number;
        /**
         * Get contacts between particles and bodies
         *
         * Contact data can be used for many reasons, for example to
         * trigger rendering or audio effects.
         */
        GetBodyContacts(): b2ParticleBodyContact[];
        GetBodyContactCount(): number;
        /**
         * Get array of particle pairs. The particles in a pair:
         *   (1) are contacting,
         *   (2) are in the same particle group,
         *   (3) are part of a rigid particle group, or are spring, elastic,
         *       or wall particles.
         *   (4) have at least one particle that is a spring or barrier
         *       particle (i.e. one of the types in k_pairFlags),
         *   (5) have at least one particle that returns true for
         *       ConnectionFilter::IsNecessary,
         *   (6) are not zombie particles.
         *
         * Essentially, this is an array of spring or barrier particles
         * that are interacting. The array is sorted by b2ParticlePair's
         * indexA, and then indexB. There are no duplicate entries.
         */
        GetPairs(): b2ParticlePair[];
        GetPairCount(): number;
        /**
         * Get array of particle triads. The particles in a triad:
         *   (1) are in the same particle group,
         *   (2) are in a Voronoi triangle together,
         *   (3) are within b2_maxTriadDistance particle diameters of each
         *       other,
         *   (4) return true for ConnectionFilter::ShouldCreateTriad
         *   (5) have at least one particle of type elastic (i.e. one of the
         *       types in k_triadFlags),
         *   (6) are part of a rigid particle group, or are spring, elastic,
         *       or wall particles.
         *   (7) are not zombie particles.
         *
         * Essentially, this is an array of elastic particles that are
         * interacting. The array is sorted by b2ParticleTriad's indexA,
         * then indexB, then indexC. There are no duplicate entries.
         */
        GetTriads(): b2ParticleTriad[];
        GetTriadCount(): number;
        /**
         * Set an optional threshold for the maximum number of
         * consecutive particle iterations that a particle may contact
         * multiple bodies before it is considered a candidate for being
         * "stuck". Setting to zero or less disables.
         */
        SetStuckThreshold(steps: number): void;
        /**
         * Get potentially stuck particles from the last step; the user
         * must decide if they are stuck or not, and if so, delete or
         * move them
         */
        GetStuckCandidates(): number[];
        /**
         * Get the number of stuck particle candidates from the last
         * step.
         */
        GetStuckCandidateCount(): number;
        /**
         * Compute the kinetic energy that can be lost by damping force
         */
        ComputeCollisionEnergy(): number;
        static readonly ComputeCollisionEnergy_s_v: b2Vec2;
        /**
         * Set strict Particle/Body contact check.
         *
         * This is an option that will help ensure correct behavior if
         * there are corners in the world model where Particle/Body
         * contact is ambiguous. This option scales at n*log(n) of the
         * number of Particle/Body contacts, so it is best to only
         * enable if it is necessary for your geometry. Enable if you
         * see strange particle behavior around b2Body intersections.
         */
        SetStrictContactCheck(enabled: boolean): void;
        /**
         * Get the status of the strict contact check.
         */
        GetStrictContactCheck(): boolean;
        /**
         * Set the lifetime (in seconds) of a particle relative to the
         * current time.  A lifetime of less than or equal to 0.0f
         * results in the particle living forever until it's manually
         * destroyed by the application.
         */
        SetParticleLifetime(index: number, lifetime: number): void;
        /**
         * Get the lifetime (in seconds) of a particle relative to the
         * current time.  A value > 0.0f is returned if the particle is
         * scheduled to be destroyed in the future, values <= 0.0f
         * indicate the particle has an infinite lifetime.
         */
        GetParticleLifetime(index: number): number;
        /**
         * Enable / disable destruction of particles in CreateParticle()
         * when no more particles can be created due to a prior call to
         * SetMaxParticleCount().  When this is enabled, the oldest
         * particle is destroyed in CreateParticle() favoring the
         * destruction of particles with a finite lifetime over
         * particles with infinite lifetimes. This feature is enabled by
         * default when particle lifetimes are tracked.  Explicitly
         * enabling this feature using this function enables particle
         * lifetime tracking.
         */
        SetDestructionByAge(enable: boolean): void;
        /**
         * Get whether the oldest particle will be destroyed in
         * CreateParticle() when the maximum number of particles are
         * present in the system.
         */
        GetDestructionByAge(): boolean;
        /**
         * Get the array of particle expiration times indexed by
         * particle index.
         *
         * GetParticleCount() items are in the returned array.
         */
        GetExpirationTimeBuffer(): number[];
        /**
         * Convert a expiration time value in returned by
         * GetExpirationTimeBuffer() to a time in seconds relative to
         * the current simulation time.
         */
        ExpirationTimeToLifetime(expirationTime: number): number;
        /**
         * Get the array of particle indices ordered by reverse
         * lifetime. The oldest particle indexes are at the end of the
         * array with the newest at the start.  Particles with infinite
         * lifetimes (i.e expiration times less than or equal to 0) are
         * placed at the start of the array.
         * ExpirationTimeToLifetime(GetExpirationTimeBuffer()[index]) is
         * equivalent to GetParticleLifetime(index).
         *
         * GetParticleCount() items are in the returned array.
         */
        GetIndexByExpirationTimeBuffer(): number[];
        /**
         * Apply an impulse to one particle. This immediately modifies
         * the velocity. Similar to b2Body::ApplyLinearImpulse.
         *
         * @param index the particle that will be modified.
         * @param impulse impulse the world impulse vector, usually in N-seconds or kg-m/s.
         */
        ParticleApplyLinearImpulse(index: number, impulse: XY): void;
        /**
         * Apply an impulse to all particles between 'firstIndex' and
         * 'lastIndex'. This immediately modifies the velocity. Note
         * that the impulse is applied to the total mass of all
         * particles. So, calling ParticleApplyLinearImpulse(0, impulse)
         * and ParticleApplyLinearImpulse(1, impulse) will impart twice
         * as much velocity as calling just ApplyLinearImpulse(0, 1,
         * impulse).
         *
         * @param firstIndex the first particle to be modified.
         * @param lastIndex the last particle to be modified.
         * @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
         */
        ApplyLinearImpulse(firstIndex: number, lastIndex: number, impulse: XY): void;
        static IsSignificantForce(force: XY): boolean;
        /**
         * Apply a force to the center of a particle.
         *
         * @param index the particle that will be modified.
         * @param force the world force vector, usually in Newtons (N).
         */
        ParticleApplyForce(index: number, force: XY): void;
        /**
         * Distribute a force across several particles. The particles
         * must not be wall particles. Note that the force is
         * distributed across all the particles, so calling this
         * function for indices 0..N is not the same as calling
         * ParticleApplyForce(i, force) for i in 0..N.
         *
         * @param firstIndex the first particle to be modified.
         * @param lastIndex the last particle to be modified.
         * @param force the world force vector, usually in Newtons (N).
         */
        ApplyForce(firstIndex: number, lastIndex: number, force: XY): void;
        /**
         * Get the next particle-system in the world's particle-system
         * list.
         */
        GetNext(): b2ParticleSystem | null;
        /**
         * Query the particle system for all particles that potentially
         * overlap the provided AABB.
         * b2QueryCallback::ShouldQueryParticleSystem is ignored.
         *
         * @param callback a user implemented callback class.
         * @param aabb the query box.
         */
        QueryAABB(callback: b2QueryCallback, aabb: b2AABB): void;
        /**
         * Query the particle system for all particles that potentially
         * overlap the provided shape's AABB. Calls QueryAABB
         * internally. b2QueryCallback::ShouldQueryParticleSystem is
         * ignored.
         *
         * @param callback a user implemented callback class.
         * @param shape the query shape
         * @param xf the transform of the AABB
         * @param childIndex
         */
        QueryShapeAABB(callback: b2QueryCallback, shape: b2Shape, xf: b2Transform, childIndex?: number): void;
        static readonly QueryShapeAABB_s_aabb: b2AABB;
        QueryPointAABB(callback: b2QueryCallback, point: b2Vec2, slop?: number): void;
        static readonly QueryPointAABB_s_aabb: b2AABB;
        /**
         * Ray-cast the particle system for all particles in the path of
         * the ray. Your callback controls whether you get the closest
         * point, any point, or n-points. The ray-cast ignores particles
         * that contain the starting point.
         * b2RayCastCallback::ShouldQueryParticleSystem is ignored.
         *
         * @param callback a user implemented callback class.
         * @param point1 the ray starting point
         * @param point2 the ray ending point
         */
        RayCast(callback: b2RayCastCallback, point1: b2Vec2, point2: b2Vec2): void;
        static readonly RayCast_s_aabb: b2AABB;
        static readonly RayCast_s_p: b2Vec2;
        static readonly RayCast_s_v: b2Vec2;
        static readonly RayCast_s_n: b2Vec2;
        static readonly RayCast_s_point: b2Vec2;
        /**
         * Compute the axis-aligned bounding box for all particles
         * contained within this particle system.
         * @param aabb Returns the axis-aligned bounding box of the system.
         */
        ComputeAABB(aabb: b2AABB): void;
        /**
         * All particle types that require creating pairs
         */
        static readonly k_pairFlags: number;
        /**
         * All particle types that require creating triads
         */
        static readonly k_triadFlags: b2ParticleFlag;
        /**
         * All particle types that do not produce dynamic pressure
         */
        static readonly k_noPressureFlags: number;
        /**
         * All particle types that apply extra damping force with bodies
         */
        static readonly k_extraDampingFlags: b2ParticleFlag;
        static readonly k_barrierWallFlags: number;
        FreeBuffer<T>(b: T[] | null, capacity: number): void;
        FreeUserOverridableBuffer<T>(b: b2ParticleSystem.UserOverridableBuffer<T>): void;
        /**
         * Reallocate a buffer
         */
        ReallocateBuffer3<T>(oldBuffer: T[] | null, oldCapacity: number, newCapacity: number): T[];
        /**
         * Reallocate a buffer
         */
        ReallocateBuffer5<T>(buffer: T[] | null, userSuppliedCapacity: number, oldCapacity: number, newCapacity: number, deferred: boolean): T[];
        /**
         * Reallocate a buffer
         */
        ReallocateBuffer4<T>(buffer: b2ParticleSystem.UserOverridableBuffer<any>, oldCapacity: number, newCapacity: number, deferred: boolean): T[] | null;
        RequestBuffer<T>(buffer: T[] | null): T[];
        /**
         * Reallocate the handle / index map and schedule the allocation
         * of a new pool for handle allocation.
         */
        ReallocateHandleBuffers(newCapacity: number): void;
        ReallocateInternalAllocatedBuffers(capacity: number): void;
        CreateParticleForGroup(groupDef: b2IParticleGroupDef, xf: b2Transform, p: XY): void;
        CreateParticlesStrokeShapeForGroup(shape: b2Shape, groupDef: b2IParticleGroupDef, xf: b2Transform): void;
        static readonly CreateParticlesStrokeShapeForGroup_s_edge: b2EdgeShape;
        static readonly CreateParticlesStrokeShapeForGroup_s_d: b2Vec2;
        static readonly CreateParticlesStrokeShapeForGroup_s_p: b2Vec2;
        CreateParticlesFillShapeForGroup(shape: b2Shape, groupDef: b2IParticleGroupDef, xf: b2Transform): void;
        static readonly CreateParticlesFillShapeForGroup_s_aabb: b2AABB;
        static readonly CreateParticlesFillShapeForGroup_s_p: b2Vec2;
        CreateParticlesWithShapeForGroup(shape: b2Shape, groupDef: b2IParticleGroupDef, xf: b2Transform): void;
        CreateParticlesWithShapesForGroup(shapes: b2Shape[], shapeCount: number, groupDef: b2IParticleGroupDef, xf: b2Transform): void;
        CloneParticle(oldIndex: number, group: b2ParticleGroup): number;
        DestroyParticlesInGroup(group: b2ParticleGroup, callDestructionListener?: boolean): void;
        DestroyParticleGroup(group: b2ParticleGroup): void;
        static ParticleCanBeConnected(flags: b2ParticleFlag, group: b2ParticleGroup | null): boolean;
        UpdatePairsAndTriads(firstIndex: number, lastIndex: number, filter: b2ParticleSystem.ConnectionFilter): void;
        private static UpdatePairsAndTriads_s_dab;
        private static UpdatePairsAndTriads_s_dbc;
        private static UpdatePairsAndTriads_s_dca;
        UpdatePairsAndTriadsWithReactiveParticles(): void;
        static ComparePairIndices(a: b2ParticlePair, b: b2ParticlePair): boolean;
        static MatchPairIndices(a: b2ParticlePair, b: b2ParticlePair): boolean;
        static CompareTriadIndices(a: b2ParticleTriad, b: b2ParticleTriad): boolean;
        static MatchTriadIndices(a: b2ParticleTriad, b: b2ParticleTriad): boolean;
        static InitializeParticleLists(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): void;
        MergeParticleListsInContact(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): void;
        static MergeParticleLists(listA: b2ParticleSystem.ParticleListNode, listB: b2ParticleSystem.ParticleListNode): void;
        static FindLongestParticleList(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): b2ParticleSystem.ParticleListNode;
        MergeZombieParticleListNodes(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[], survivingList: b2ParticleSystem.ParticleListNode): void;
        static MergeParticleListAndNode(list: b2ParticleSystem.ParticleListNode, node: b2ParticleSystem.ParticleListNode): void;
        CreateParticleGroupsFromParticleList(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[], survivingList: b2ParticleSystem.ParticleListNode): void;
        UpdatePairsAndTriadsWithParticleList(group: b2ParticleGroup, nodeBuffer: b2ParticleSystem.ParticleListNode[]): void;
        ComputeDepth(): void;
        GetInsideBoundsEnumerator(aabb: Readonly<b2AABB>): b2ParticleSystem.InsideBoundsEnumerator;
        UpdateAllParticleFlags(): void;
        UpdateAllGroupFlags(): void;
        AddContact(a: number, b: number, contacts: b2GrowableBuffer<b2ParticleContact>): void;
        static readonly AddContact_s_d: b2Vec2;
        FindContacts_Reference(contacts: b2GrowableBuffer<b2ParticleContact>): void;
        FindContacts(contacts: b2GrowableBuffer<b2ParticleContact>): void;
        UpdateProxies_Reference(proxies: b2GrowableBuffer<b2ParticleSystem.Proxy>): void;
        UpdateProxies(proxies: b2GrowableBuffer<b2ParticleSystem.Proxy>): void;
        SortProxies(proxies: b2GrowableBuffer<b2ParticleSystem.Proxy>): void;
        FilterContacts(contacts: b2GrowableBuffer<b2ParticleContact>): void;
        NotifyContactListenerPreContact(particlePairs: b2ParticleSystem.b2ParticlePairSet): void;
        NotifyContactListenerPostContact(particlePairs: b2ParticleSystem.b2ParticlePairSet): void;
        static b2ParticleContactIsZombie(contact: b2ParticleContact): boolean;
        UpdateContacts(exceptZombie: boolean): void;
        NotifyBodyContactListenerPreContact(fixtureSet: b2ParticleSystem.FixtureParticleSet): void;
        NotifyBodyContactListenerPostContact(fixtureSet: b2ParticleSystem.FixtureParticleSet): void;
        UpdateBodyContacts(): void;
        static readonly UpdateBodyContacts_s_aabb: b2AABB;
        Solve(step: b2TimeStep): void;
        static readonly Solve_s_subStep: b2TimeStep;
        SolveCollision(step: b2TimeStep): void;
        static readonly SolveCollision_s_aabb: b2AABB;
        LimitVelocity(step: b2TimeStep): void;
        SolveGravity(step: b2TimeStep): void;
        static readonly SolveGravity_s_gravity: b2Vec2;
        SolveBarrier(step: b2TimeStep): void;
        static readonly SolveBarrier_s_aabb: b2AABB;
        static readonly SolveBarrier_s_va: b2Vec2;
        static readonly SolveBarrier_s_vb: b2Vec2;
        static readonly SolveBarrier_s_pba: b2Vec2;
        static readonly SolveBarrier_s_vba: b2Vec2;
        static readonly SolveBarrier_s_vc: b2Vec2;
        static readonly SolveBarrier_s_pca: b2Vec2;
        static readonly SolveBarrier_s_vca: b2Vec2;
        static readonly SolveBarrier_s_qba: b2Vec2;
        static readonly SolveBarrier_s_qca: b2Vec2;
        static readonly SolveBarrier_s_dv: b2Vec2;
        static readonly SolveBarrier_s_f: b2Vec2;
        SolveStaticPressure(step: b2TimeStep): void;
        ComputeWeight(): void;
        SolvePressure(step: b2TimeStep): void;
        static readonly SolvePressure_s_f: b2Vec2;
        SolveDamping(step: b2TimeStep): void;
        static readonly SolveDamping_s_v: b2Vec2;
        static readonly SolveDamping_s_f: b2Vec2;
        SolveRigidDamping(): void;
        static readonly SolveRigidDamping_s_t0: b2Vec2;
        static readonly SolveRigidDamping_s_t1: b2Vec2;
        static readonly SolveRigidDamping_s_p: b2Vec2;
        static readonly SolveRigidDamping_s_v: b2Vec2;
        SolveExtraDamping(): void;
        static readonly SolveExtraDamping_s_v: b2Vec2;
        static readonly SolveExtraDamping_s_f: b2Vec2;
        SolveWall(): void;
        SolveRigid(step: b2TimeStep): void;
        static readonly SolveRigid_s_position: b2Vec2;
        static readonly SolveRigid_s_rotation: b2Rot;
        static readonly SolveRigid_s_transform: b2Transform;
        static readonly SolveRigid_s_velocityTransform: b2Transform;
        SolveElastic(step: b2TimeStep): void;
        static readonly SolveElastic_s_pa: b2Vec2;
        static readonly SolveElastic_s_pb: b2Vec2;
        static readonly SolveElastic_s_pc: b2Vec2;
        static readonly SolveElastic_s_r: b2Rot;
        static readonly SolveElastic_s_t0: b2Vec2;
        SolveSpring(step: b2TimeStep): void;
        static readonly SolveSpring_s_pa: b2Vec2;
        static readonly SolveSpring_s_pb: b2Vec2;
        static readonly SolveSpring_s_d: b2Vec2;
        static readonly SolveSpring_s_f: b2Vec2;
        SolveTensile(step: b2TimeStep): void;
        static readonly SolveTensile_s_weightedNormal: b2Vec2;
        static readonly SolveTensile_s_s: b2Vec2;
        static readonly SolveTensile_s_f: b2Vec2;
        SolveViscous(): void;
        static readonly SolveViscous_s_v: b2Vec2;
        static readonly SolveViscous_s_f: b2Vec2;
        SolveRepulsive(step: b2TimeStep): void;
        static readonly SolveRepulsive_s_f: b2Vec2;
        SolvePowder(step: b2TimeStep): void;
        static readonly SolvePowder_s_f: b2Vec2;
        SolveSolid(step: b2TimeStep): void;
        static readonly SolveSolid_s_f: b2Vec2;
        SolveForce(step: b2TimeStep): void;
        SolveColorMixing(): void;
        SolveZombie(): void;
        /**
         * Destroy all particles which have outlived their lifetimes set
         * by SetParticleLifetime().
         */
        SolveLifetimes(step: b2TimeStep): void;
        RotateBuffer(start: number, mid: number, end: number): void;
        GetCriticalVelocity(step: b2TimeStep): number;
        GetCriticalVelocitySquared(step: b2TimeStep): number;
        GetCriticalPressure(step: b2TimeStep): number;
        GetParticleStride(): number;
        GetParticleMass(): number;
        GetParticleInvMass(): number;
        /**
         * Get the world's contact filter if any particles with the
         * b2_contactFilterParticle flag are present in the system.
         */
        GetFixtureContactFilter(): b2ContactFilter | null;
        /**
         * Get the world's contact filter if any particles with the
         * b2_particleContactFilterParticle flag are present in the
         * system.
         */
        GetParticleContactFilter(): b2ContactFilter | null;
        /**
         * Get the world's contact listener if any particles with the
         * b2_fixtureContactListenerParticle flag are present in the
         * system.
         */
        GetFixtureContactListener(): b2ContactListener | null;
        /**
         * Get the world's contact listener if any particles with the
         * b2_particleContactListenerParticle flag are present in the
         * system.
         */
        GetParticleContactListener(): b2ContactListener | null;
        SetUserOverridableBuffer<T>(buffer: b2ParticleSystem.UserOverridableBuffer<any>, newData: T[], newCapacity: number): void;
        SetGroupFlags(group: b2ParticleGroup, newFlags: b2ParticleGroupFlag): void;
        static BodyContactCompare(lhs: b2ParticleBodyContact, rhs: b2ParticleBodyContact): boolean;
        RemoveSpuriousBodyContacts(): void;
        private static RemoveSpuriousBodyContacts_s_n;
        private static RemoveSpuriousBodyContacts_s_pos;
        private static RemoveSpuriousBodyContacts_s_normal;
        DetectStuckParticle(particle: number): void;
        /**
         * Determine whether a particle index is valid.
         */
        ValidateParticleIndex(index: number): boolean;
        /**
         * Get the time elapsed in
         * b2ParticleSystemDef::lifetimeGranularity.
         */
        GetQuantizedTimeElapsed(): number;
        /**
         * Convert a lifetime in seconds to an expiration time.
         */
        LifetimeToExpirationTime(lifetime: number): number;
        ForceCanBeApplied(flags: b2ParticleFlag): boolean;
        PrepareForceBuffer(): void;
        IsRigidGroup(group: b2ParticleGroup | null): boolean;
        GetLinearVelocity(group: b2ParticleGroup | null, particleIndex: number, point: b2Vec2, out: b2Vec2): b2Vec2;
        InitDampingParameter(invMass: number[], invInertia: number[], tangentDistance: number[], mass: number, inertia: number, center: b2Vec2, point: b2Vec2, normal: b2Vec2): void;
        InitDampingParameterWithRigidGroupOrParticle(invMass: number[], invInertia: number[], tangentDistance: number[], isRigidGroup: boolean, group: b2ParticleGroup | null, particleIndex: number, point: b2Vec2, normal: b2Vec2): void;
        ComputeDampingImpulse(invMassA: number, invInertiaA: number, tangentDistanceA: number, invMassB: number, invInertiaB: number, tangentDistanceB: number, normalVelocity: number): number;
        ApplyDamping(invMass: number, invInertia: number, tangentDistance: number, isRigidGroup: boolean, group: b2ParticleGroup | null, particleIndex: number, impulse: number, normal: b2Vec2): void;
    }
    export namespace b2ParticleSystem {
        class UserOverridableBuffer<T> {
            data: T[] | null;
            userSuppliedCapacity: number;
        }
        class Proxy {
            index: number;
            tag: number;
            static CompareProxyProxy(a: Proxy, b: Proxy): boolean;
            static CompareTagProxy(a: number, b: Proxy): boolean;
            static CompareProxyTag(a: Proxy, b: number): boolean;
        }
        class InsideBoundsEnumerator {
            m_system: b2ParticleSystem;
            m_xLower: number;
            m_xUpper: number;
            m_yLower: number;
            m_yUpper: number;
            m_first: number;
            m_last: number;
            /**
             * InsideBoundsEnumerator enumerates all particles inside the
             * given bounds.
             *
             * Construct an enumerator with bounds of tags and a range of
             * proxies.
             */
            constructor(system: b2ParticleSystem, lower: number, upper: number, first: number, last: number);
            /**
             * Get index of the next particle. Returns
             * b2_invalidParticleIndex if there are no more particles.
             */
            GetNext(): number;
        }
        class ParticleListNode {
            /**
             * The head of the list.
             */
            list: b2ParticleSystem.ParticleListNode;
            /**
             * The next node in the list.
             */
            next: b2ParticleSystem.ParticleListNode | null;
            /**
             * Number of entries in the list. Valid only for the node at the
             * head of the list.
             */
            count: number;
            /**
             * Particle index.
             */
            index: number;
        }
        /**
         * @constructor
         */
        class FixedSetAllocator<T> {
            Allocate(itemSize: number, count: number): number;
            Clear(): void;
            GetCount(): number;
            Invalidate(itemIndex: number): void;
            GetValidBuffer(): boolean[];
            GetBuffer(): T[];
            SetCount(count: number): void;
        }
        class FixtureParticle {
            first: b2Fixture;
            second: number;
            constructor(fixture: b2Fixture, particle: number);
        }
        class FixtureParticleSet extends b2ParticleSystem.FixedSetAllocator<FixtureParticle> {
            Initialize(bodyContactBuffer: b2GrowableBuffer<b2ParticleBodyContact>, flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag>): void;
            Find(pair: b2ParticleSystem.FixtureParticle): number;
        }
        class ParticlePair {
            first: number;
            second: number;
            constructor(particleA: number, particleB: number);
        }
        class b2ParticlePairSet extends b2ParticleSystem.FixedSetAllocator<ParticlePair> {
            Initialize(contactBuffer: b2GrowableBuffer<b2ParticleContact>, flagsBuffer: UserOverridableBuffer<b2ParticleFlag>): void;
            Find(pair: b2ParticleSystem.ParticlePair): number;
        }
        class ConnectionFilter {
            /**
             * Is the particle necessary for connection?
             * A pair or a triad should contain at least one 'necessary'
             * particle.
             */
            IsNecessary(index: number): boolean;
            /**
             * An additional condition for creating a pair.
             */
            ShouldCreatePair(a: number, b: number): boolean;
            /**
             * An additional condition for creating a triad.
             */
            ShouldCreateTriad(a: number, b: number, c: number): boolean;
        }
        class DestroyParticlesInShapeCallback extends b2QueryCallback {
            m_system: b2ParticleSystem;
            m_shape: b2Shape;
            m_xf: b2Transform;
            m_callDestructionListener: boolean;
            m_destroyed: number;
            constructor(system: b2ParticleSystem, shape: b2Shape, xf: b2Transform, callDestructionListener: boolean);
            ReportFixture(fixture: b2Fixture): boolean;
            ReportParticle(particleSystem: b2ParticleSystem, index: number): boolean;
            Destroyed(): number;
        }
        class JoinParticleGroupsFilter extends b2ParticleSystem.ConnectionFilter {
            m_threshold: number;
            constructor(threshold: number);
            /**
             * An additional condition for creating a pair.
             */
            ShouldCreatePair(a: number, b: number): boolean;
            /**
             * An additional condition for creating a triad.
             */
            ShouldCreateTriad(a: number, b: number, c: number): boolean;
        }
        class CompositeShape extends b2Shape {
            constructor(shapes: b2Shape[], shapeCount?: number);
            m_shapes: b2Shape[];
            m_shapeCount: number;
            Clone(): b2Shape;
            GetChildCount(): number;
            /**
             * @see b2Shape::TestPoint
             */
            TestPoint(xf: b2Transform, p: b2Vec2): boolean;
            /**
             * @see b2Shape::ComputeDistance
             */
            ComputeDistance(xf: b2Transform, p: b2Vec2, normal: b2Vec2, childIndex: number): number;
            /**
             * Implement b2Shape.
             */
            RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean;
            /**
             * @see b2Shape::ComputeAABB
             */
            ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void;
            /**
             * @see b2Shape::ComputeMass
             */
            ComputeMass(massData: b2MassData, density: number): void;
            SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void;
            ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number;
            Dump(log: (format: string, ...args: any[]) => void): void;
        }
        class ReactiveFilter extends b2ParticleSystem.ConnectionFilter {
            m_flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag>;
            constructor(flagsBuffer: b2ParticleSystem.UserOverridableBuffer<b2ParticleFlag>);
            IsNecessary(index: number): boolean;
        }
        class UpdateBodyContactsCallback extends b2FixtureParticleQueryCallback {
            m_contactFilter: b2ContactFilter | null;
            constructor(system: b2ParticleSystem, contactFilter: b2ContactFilter | null);
            ShouldCollideFixtureParticle(fixture: b2Fixture, particleSystem: b2ParticleSystem, particleIndex: number): boolean;
            ReportFixtureAndParticle(fixture: b2Fixture, childIndex: number, a: number): void;
            static readonly ReportFixtureAndParticle_s_n: b2Vec2;
            static readonly ReportFixtureAndParticle_s_rp: b2Vec2;
        }
        class SolveCollisionCallback extends b2FixtureParticleQueryCallback {
            m_step: b2TimeStep;
            constructor(system: b2ParticleSystem, step: b2TimeStep);
            ReportFixtureAndParticle(fixture: b2Fixture, childIndex: number, a: number): void;
            static readonly ReportFixtureAndParticle_s_p1: b2Vec2;
            static readonly ReportFixtureAndParticle_s_output: b2RayCastOutput;
            static readonly ReportFixtureAndParticle_s_input: b2RayCastInput;
            static readonly ReportFixtureAndParticle_s_p: b2Vec2;
            static readonly ReportFixtureAndParticle_s_v: b2Vec2;
            static readonly ReportFixtureAndParticle_s_f: b2Vec2;
            ReportParticle(system: b2ParticleSystem, index: number): boolean;
        }
    }
}
declare module "Box2D/Box2D/Particle/b2ParticleGroup" {
    import { b2Vec2, b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Color, RGBA } from "Box2D/Box2D/Common/b2Draw";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2ParticleFlag } from "Box2D/Box2D/Particle/b2Particle";
    import { b2ParticleSystem } from "Box2D/Box2D/Particle/b2ParticleSystem";
    export enum b2ParticleGroupFlag {
        b2_solidParticleGroup = 1,
        b2_rigidParticleGroup = 2,
        b2_particleGroupCanBeEmpty = 4,
        b2_particleGroupWillBeDestroyed = 8,
        b2_particleGroupNeedsUpdateDepth = 16,
        b2_particleGroupInternalMask = 24
    }
    export interface b2IParticleGroupDef {
        flags?: b2ParticleFlag;
        groupFlags?: b2ParticleGroupFlag;
        position?: XY;
        angle?: number;
        linearVelocity?: XY;
        angularVelocity?: number;
        color?: RGBA;
        strength?: number;
        shape?: b2Shape;
        shapes?: b2Shape[];
        shapeCount?: number;
        stride?: number;
        particleCount?: number;
        positionData?: XY[];
        lifetime?: number;
        userData?: any;
        group?: b2ParticleGroup | null;
    }
    export class b2ParticleGroupDef implements b2IParticleGroupDef {
        flags: b2ParticleFlag;
        groupFlags: b2ParticleGroupFlag;
        readonly position: b2Vec2;
        angle: number;
        readonly linearVelocity: b2Vec2;
        angularVelocity: number;
        readonly color: b2Color;
        strength: number;
        shape?: b2Shape;
        shapes?: b2Shape[];
        shapeCount: number;
        stride: number;
        particleCount: number;
        positionData?: b2Vec2[];
        lifetime: number;
        userData: any;
        group: b2ParticleGroup | null;
    }
    export class b2ParticleGroup {
        readonly m_system: b2ParticleSystem;
        m_firstIndex: number;
        m_lastIndex: number;
        m_groupFlags: b2ParticleGroupFlag;
        m_strength: number;
        m_prev: b2ParticleGroup | null;
        m_next: b2ParticleGroup | null;
        m_timestamp: number;
        m_mass: number;
        m_inertia: number;
        readonly m_center: b2Vec2;
        readonly m_linearVelocity: b2Vec2;
        m_angularVelocity: number;
        readonly m_transform: b2Transform;
        m_userData: any;
        constructor(system: b2ParticleSystem);
        GetNext(): b2ParticleGroup | null;
        GetParticleSystem(): b2ParticleSystem;
        GetParticleCount(): number;
        GetBufferIndex(): number;
        ContainsParticle(index: number): boolean;
        GetAllParticleFlags(): b2ParticleFlag;
        GetGroupFlags(): b2ParticleGroupFlag;
        SetGroupFlags(flags: number): void;
        GetMass(): number;
        GetInertia(): number;
        GetCenter(): Readonly<b2Vec2>;
        GetLinearVelocity(): Readonly<b2Vec2>;
        GetAngularVelocity(): number;
        GetTransform(): Readonly<b2Transform>;
        GetPosition(): Readonly<b2Vec2>;
        GetAngle(): number;
        GetLinearVelocityFromWorldPoint<T extends XY>(worldPoint: XY, out: T): T;
        static readonly GetLinearVelocityFromWorldPoint_s_t0: b2Vec2;
        GetUserData(): void;
        SetUserData(data: any): void;
        ApplyForce(force: XY): void;
        ApplyLinearImpulse(impulse: XY): void;
        DestroyParticles(callDestructionListener: boolean): void;
        UpdateStatistics(): void;
    }
}
declare module "Box2D/Box2D/Dynamics/b2WorldCallbacks" {
    import { b2Vec2 } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Joint } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    import { b2ParticleGroup } from "Box2D/Box2D/Particle/b2ParticleGroup";
    import { b2ParticleSystem, b2ParticleContact, b2ParticleBodyContact } from "Box2D/Box2D/Particle/b2ParticleSystem";
    export class b2DestructionListener {
        SayGoodbyeJoint(joint: b2Joint): void;
        SayGoodbyeFixture(fixture: b2Fixture): void;
        SayGoodbyeParticleGroup(group: b2ParticleGroup): void;
        SayGoodbyeParticle(system: b2ParticleSystem, index: number): void;
    }
    export class b2ContactFilter {
        ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
        ShouldCollideFixtureParticle(fixture: b2Fixture, system: b2ParticleSystem, index: number): boolean;
        ShouldCollideParticleParticle(system: b2ParticleSystem, indexA: number, indexB: number): boolean;
        static readonly b2_defaultFilter: b2ContactFilter;
    }
    export class b2ContactImpulse {
        normalImpulses: number[];
        tangentImpulses: number[];
        count: number;
    }
    export class b2ContactListener {
        BeginContact(contact: b2Contact): void;
        EndContact(contact: b2Contact): void;
        BeginContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void;
        EndContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void;
        BeginContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void;
        EndContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void;
        PreSolve(contact: b2Contact, oldManifold: b2Manifold): void;
        PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void;
        static readonly b2_defaultListener: b2ContactListener;
    }
    export class b2QueryCallback {
        ReportFixture(fixture: b2Fixture): boolean;
        ReportParticle(system: b2ParticleSystem, index: number): boolean;
        ShouldQueryParticleSystem(system: b2ParticleSystem): boolean;
    }
    export type b2QueryCallbackFunction = (fixture: b2Fixture) => boolean;
    export class b2RayCastCallback {
        ReportFixture(fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
        ReportParticle(system: b2ParticleSystem, index: number, point: b2Vec2, normal: b2Vec2, fraction: number): number;
        ShouldQueryParticleSystem(system: b2ParticleSystem): boolean;
    }
    export type b2RayCastCallbackFunction = (fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number) => number;
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2ContactSolver" {
    import { b2Vec2, b2Mat22, b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2ManifoldType } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2TimeStep, b2Position, b2Velocity } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export class b2VelocityConstraintPoint {
        readonly rA: b2Vec2;
        readonly rB: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        normalMass: number;
        tangentMass: number;
        velocityBias: number;
        static MakeArray(length: number): b2VelocityConstraintPoint[];
    }
    export class b2ContactVelocityConstraint {
        points: b2VelocityConstraintPoint[];
        readonly normal: b2Vec2;
        readonly tangent: b2Vec2;
        readonly normalMass: b2Mat22;
        readonly K: b2Mat22;
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
        readonly localNormal: b2Vec2;
        readonly localPoint: b2Vec2;
        indexA: number;
        indexB: number;
        invMassA: number;
        invMassB: number;
        readonly localCenterA: b2Vec2;
        readonly localCenterB: b2Vec2;
        invIA: number;
        invIB: number;
        type: b2ManifoldType;
        radiusA: number;
        radiusB: number;
        pointCount: number;
        static MakeArray(length: number): b2ContactPositionConstraint[];
    }
    export class b2ContactSolverDef {
        readonly step: b2TimeStep;
        contacts: b2Contact[];
        count: number;
        positions: b2Position[];
        velocities: b2Velocity[];
        allocator: any;
    }
    export class b2PositionSolverManifold {
        readonly normal: b2Vec2;
        readonly point: b2Vec2;
        separation: number;
        private static Initialize_s_pointA;
        private static Initialize_s_pointB;
        private static Initialize_s_planePoint;
        private static Initialize_s_clipPoint;
        Initialize(pc: b2ContactPositionConstraint, xfA: b2Transform, xfB: b2Transform, index: number): void;
    }
    export class b2ContactSolver {
        readonly m_step: b2TimeStep;
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
declare module "Box2D/Box2D/Dynamics/b2Island" {
    import { b2Vec2 } from "Box2D/Box2D/Common/b2Math";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2ContactVelocityConstraint } from "Box2D/Box2D/Dynamics/Contacts/b2ContactSolver";
    import { b2Joint } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2TimeStep, b2Profile, b2Position, b2Velocity } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2ContactListener } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
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
declare module "Box2D/Box2D/Dynamics/Contacts/b2CircleContact" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2CircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2PolygonContact" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2PolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2PolygonAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2EdgeAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2EdgeAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2ChainAndCircleContact" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2ChainAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        private static Evaluate_s_edge;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact" {
    import { b2Transform } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2ChainAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        private static Evaluate_s_edge;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2ContactFactory" {
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    export class b2ContactRegister {
        createFcn: ((allocator: any) => b2Contact) | null;
        destroyFcn: ((contact: b2Contact, allocator: any) => void) | null;
        primary: boolean;
    }
    export class b2ContactFactory {
        m_allocator: any;
        m_registers: b2ContactRegister[][];
        constructor(allocator: any);
        private AddType;
        private InitializeRegisters;
        Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact | null;
        Destroy(contact: b2Contact): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Joints/b2DistanceJoint" {
    import { b2Vec2, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    export interface b2IDistanceJointDef extends b2IJointDef {
        localAnchorA: XY;
        localAnchorB: XY;
        length: number;
        frequencyHz?: number;
        dampingRatio?: number;
    }
    export class b2DistanceJointDef extends b2JointDef implements b2IDistanceJointDef {
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
        length: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        Initialize(b1: b2Body, b2: b2Body, anchor1: XY, anchor2: XY): void;
    }
    export class b2DistanceJoint extends b2Joint {
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_bias: number;
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        m_gamma: number;
        m_impulse: number;
        m_length: number;
        m_indexA: number;
        m_indexB: number;
        readonly m_u: b2Vec2;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        constructor(def: b2IDistanceJointDef);
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): Readonly<b2Vec2>;
        GetLocalAnchorB(): Readonly<b2Vec2>;
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
declare module "Box2D/Box2D/Dynamics/Joints/b2AreaJoint" {
    import { b2Vec2, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2DistanceJoint } from "Box2D/Box2D/Dynamics/Joints/b2DistanceJoint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    export interface b2IAreaJointDef extends b2IJointDef {
        bodies: b2Body[];
        frequencyHz?: number;
        dampingRatio?: number;
    }
    export class b2AreaJointDef extends b2JointDef implements b2IAreaJointDef {
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
        constructor(def: b2IAreaJointDef);
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
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
declare module "Box2D/Box2D/Dynamics/Joints/b2FrictionJoint" {
    import { b2Vec2, b2Mat22, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    export interface b2IFrictionJointDef extends b2IJointDef {
        localAnchorA: XY;
        localAnchorB: XY;
        maxForce?: number;
        maxTorque?: number;
    }
    export class b2FrictionJointDef extends b2JointDef implements b2IFrictionJointDef {
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
        maxForce: number;
        maxTorque: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, anchor: b2Vec2): void;
    }
    export class b2FrictionJoint extends b2Joint {
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        readonly m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_indexA: number;
        m_indexB: number;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        readonly m_linearMass: b2Mat22;
        m_angularMass: number;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        readonly m_K: b2Mat22;
        constructor(def: b2IFrictionJointDef);
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_Cdot_v2;
        private static SolveVelocityConstraints_s_impulseV;
        private static SolveVelocityConstraints_s_oldImpulseV;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): Readonly<b2Vec2>;
        GetLocalAnchorB(): Readonly<b2Vec2>;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint" {
    import { b2Vec2, b2Mat22, b2Vec3, b2Mat33, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef, b2LimitState, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export interface b2IPrismaticJointDef extends b2IJointDef {
        localAnchorA?: XY;
        localAnchorB?: XY;
        localAxisA?: XY;
        referenceAngle?: number;
        enableLimit?: boolean;
        lowerTranslation?: number;
        upperTranslation?: number;
        enableMotor?: boolean;
        maxMotorForce?: number;
        motorSpeed?: number;
    }
    export class b2PrismaticJointDef extends b2JointDef implements b2IPrismaticJointDef {
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
        readonly localAxisA: b2Vec2;
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
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        readonly m_localXAxisA: b2Vec2;
        readonly m_localYAxisA: b2Vec2;
        m_referenceAngle: number;
        readonly m_impulse: b2Vec3;
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
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        readonly m_axis: b2Vec2;
        readonly m_perp: b2Vec2;
        m_s1: number;
        m_s2: number;
        m_a1: number;
        m_a2: number;
        readonly m_K: b2Mat33;
        readonly m_K3: b2Mat33;
        readonly m_K2: b2Mat22;
        m_motorMass: number;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        constructor(def: b2IPrismaticJointDef);
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
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): Readonly<b2Vec2>;
        GetLocalAnchorB(): Readonly<b2Vec2>;
        GetLocalAxisA(): Readonly<b2Vec2>;
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
declare module "Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint" {
    import { b2Vec2, b2Mat22, b2Vec3, b2Mat33, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef, b2LimitState, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export interface b2IRevoluteJointDef extends b2IJointDef {
        localAnchorA?: XY;
        localAnchorB?: XY;
        referenceAngle?: number;
        enableLimit?: boolean;
        lowerAngle?: number;
        upperAngle?: number;
        enableMotor?: boolean;
        motorSpeed?: number;
        maxMotorTorque?: number;
    }
    export class b2RevoluteJointDef extends b2JointDef implements b2IRevoluteJointDef {
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
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
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        readonly m_impulse: b2Vec3;
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
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        readonly m_mass: b2Mat33;
        m_motorMass: number;
        m_limitState: b2LimitState;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        readonly m_K: b2Mat22;
        constructor(def: b2IRevoluteJointDef);
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
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): Readonly<b2Vec2>;
        GetLocalAnchorB(): Readonly<b2Vec2>;
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
declare module "Box2D/Box2D/Dynamics/Joints/b2GearJoint" {
    import { b2Vec2, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2JointType, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    export interface b2IGearJointDef extends b2IJointDef {
        joint1: b2Joint;
        joint2: b2Joint;
        ratio?: number;
    }
    export class b2GearJointDef extends b2JointDef implements b2IGearJointDef {
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
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        readonly m_localAnchorC: b2Vec2;
        readonly m_localAnchorD: b2Vec2;
        readonly m_localAxisC: b2Vec2;
        readonly m_localAxisD: b2Vec2;
        m_referenceAngleA: number;
        m_referenceAngleB: number;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        m_indexC: number;
        m_indexD: number;
        readonly m_lcA: b2Vec2;
        readonly m_lcB: b2Vec2;
        readonly m_lcC: b2Vec2;
        readonly m_lcD: b2Vec2;
        m_mA: number;
        m_mB: number;
        m_mC: number;
        m_mD: number;
        m_iA: number;
        m_iB: number;
        m_iC: number;
        m_iD: number;
        readonly m_JvAC: b2Vec2;
        readonly m_JvBD: b2Vec2;
        m_JwA: number;
        m_JwB: number;
        m_JwC: number;
        m_JwD: number;
        m_mass: number;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_qC: b2Rot;
        readonly m_qD: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        readonly m_lalcC: b2Vec2;
        readonly m_lalcD: b2Vec2;
        constructor(def: b2IGearJointDef);
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
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetJoint1(): b2Joint;
        GetJoint2(): b2Joint;
        GetRatio(): number;
        SetRatio(ratio: number): void;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Joints/b2MotorJoint" {
    import { b2Vec2, b2Mat22, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export interface b2IMotorJointDef extends b2IJointDef {
        linearOffset?: XY;
        angularOffset?: number;
        maxForce?: number;
        maxTorque?: number;
        correctionFactor?: number;
    }
    export class b2MotorJointDef extends b2JointDef implements b2IMotorJointDef {
        readonly linearOffset: b2Vec2;
        angularOffset: number;
        maxForce: number;
        maxTorque: number;
        correctionFactor: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body): void;
    }
    export class b2MotorJoint extends b2Joint {
        readonly m_linearOffset: b2Vec2;
        m_angularOffset: number;
        readonly m_linearImpulse: b2Vec2;
        m_angularImpulse: number;
        m_maxForce: number;
        m_maxTorque: number;
        m_correctionFactor: number;
        m_indexA: number;
        m_indexB: number;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        readonly m_linearError: b2Vec2;
        m_angularError: number;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        readonly m_linearMass: b2Mat22;
        m_angularMass: number;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_K: b2Mat22;
        constructor(def: b2IMotorJointDef);
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
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
declare module "Box2D/Box2D/Dynamics/Joints/b2MouseJoint" {
    import { b2Vec2, b2Mat22, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export interface b2IMouseJointDef extends b2IJointDef {
        target?: XY;
        maxForce?: number;
        frequencyHz?: number;
        dampingRatio?: number;
    }
    export class b2MouseJointDef extends b2JointDef implements b2IMouseJointDef {
        readonly target: b2Vec2;
        maxForce: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
    }
    export class b2MouseJoint extends b2Joint {
        readonly m_localAnchorB: b2Vec2;
        readonly m_targetA: b2Vec2;
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_beta: number;
        readonly m_impulse: b2Vec2;
        m_maxForce: number;
        m_gamma: number;
        m_indexA: number;
        m_indexB: number;
        readonly m_rB: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassB: number;
        m_invIB: number;
        readonly m_mass: b2Mat22;
        readonly m_C: b2Vec2;
        readonly m_qB: b2Rot;
        readonly m_lalcB: b2Vec2;
        readonly m_K: b2Mat22;
        constructor(def: b2IMouseJointDef);
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
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
        ShiftOrigin(newOrigin: b2Vec2): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Joints/b2PulleyJoint" {
    import { b2Vec2, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export const b2_minPulleyLength: number;
    export interface b2IPulleyJointDef extends b2IJointDef {
        groundAnchorA?: XY;
        groundAnchorB?: XY;
        localAnchorA?: XY;
        localAnchorB?: XY;
        lengthA?: number;
        lengthB?: number;
        ratio?: number;
    }
    export class b2PulleyJointDef extends b2JointDef implements b2IPulleyJointDef {
        readonly groundAnchorA: b2Vec2;
        readonly groundAnchorB: b2Vec2;
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
        lengthA: number;
        lengthB: number;
        ratio: number;
        constructor();
        Initialize(bA: b2Body, bB: b2Body, groundA: b2Vec2, groundB: b2Vec2, anchorA: b2Vec2, anchorB: b2Vec2, r: number): void;
    }
    export class b2PulleyJoint extends b2Joint {
        readonly m_groundAnchorA: b2Vec2;
        readonly m_groundAnchorB: b2Vec2;
        m_lengthA: number;
        m_lengthB: number;
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        m_constant: number;
        m_ratio: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        readonly m_uA: b2Vec2;
        readonly m_uB: b2Vec2;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        constructor(def: b2IPulleyJointDef);
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
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
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
declare module "Box2D/Box2D/Dynamics/Joints/b2RopeJoint" {
    import { b2Vec2, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2LimitState, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export interface b2IRopeJointDef extends b2IJointDef {
        localAnchorA?: XY;
        localAnchorB?: XY;
        maxLength?: number;
    }
    export class b2RopeJointDef extends b2JointDef implements b2IRopeJointDef {
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
        maxLength: number;
        constructor();
    }
    export class b2RopeJoint extends b2Joint {
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        m_maxLength: number;
        m_length: number;
        m_impulse: number;
        m_indexA: number;
        m_indexB: number;
        readonly m_u: b2Vec2;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        m_mass: number;
        m_state: b2LimitState;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        constructor(def: b2IRopeJointDef);
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: b2SolverData): void;
        private static SolveVelocityConstraints_s_vpA;
        private static SolveVelocityConstraints_s_vpB;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: b2SolverData): void;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: b2SolverData): boolean;
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): Readonly<b2Vec2>;
        GetLocalAnchorB(): Readonly<b2Vec2>;
        SetMaxLength(length: number): void;
        GetMaxLength(): number;
        GetLimitState(): b2LimitState;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Joints/b2WeldJoint" {
    import { b2Vec2, b2Vec3, b2Mat33, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    export interface b2IWeldJointDef extends b2IJointDef {
        localAnchorA?: XY;
        localAnchorB?: XY;
        referenceAngle?: number;
        frequencyHz?: number;
        dampingRatio?: number;
    }
    export class b2WeldJointDef extends b2JointDef implements b2IWeldJointDef {
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
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
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        m_referenceAngle: number;
        m_gamma: number;
        readonly m_impulse: b2Vec3;
        m_indexA: number;
        m_indexB: number;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        readonly m_mass: b2Mat33;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        readonly m_K: b2Mat33;
        constructor(def: b2IWeldJointDef);
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
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): Readonly<b2Vec2>;
        GetLocalAnchorB(): Readonly<b2Vec2>;
        GetReferenceAngle(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: number): void;
        GetDampingRatio(): number;
        Dump(log: (format: string, ...args: any[]) => void): void;
    }
}
declare module "Box2D/Box2D/Dynamics/Joints/b2WheelJoint" {
    import { b2Vec2, b2Rot, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Joint, b2JointDef, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2SolverData } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    export interface b2IWheelJointDef extends b2IJointDef {
        localAnchorA?: XY;
        localAnchorB?: XY;
        localAxisA?: XY;
        enableMotor?: boolean;
        maxMotorTorque?: number;
        motorSpeed?: number;
        frequencyHz?: number;
        dampingRatio?: number;
    }
    export class b2WheelJointDef extends b2JointDef implements b2IWheelJointDef {
        readonly localAnchorA: b2Vec2;
        readonly localAnchorB: b2Vec2;
        readonly localAxisA: b2Vec2;
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
        readonly m_localAnchorA: b2Vec2;
        readonly m_localAnchorB: b2Vec2;
        readonly m_localXAxisA: b2Vec2;
        readonly m_localYAxisA: b2Vec2;
        m_impulse: number;
        m_motorImpulse: number;
        m_springImpulse: number;
        m_maxMotorTorque: number;
        m_motorSpeed: number;
        m_enableMotor: boolean;
        m_indexA: number;
        m_indexB: number;
        readonly m_localCenterA: b2Vec2;
        readonly m_localCenterB: b2Vec2;
        m_invMassA: number;
        m_invMassB: number;
        m_invIA: number;
        m_invIB: number;
        readonly m_ax: b2Vec2;
        readonly m_ay: b2Vec2;
        m_sAx: number;
        m_sBx: number;
        m_sAy: number;
        m_sBy: number;
        m_mass: number;
        m_motorMass: number;
        m_springMass: number;
        m_bias: number;
        m_gamma: number;
        readonly m_qA: b2Rot;
        readonly m_qB: b2Rot;
        readonly m_lalcA: b2Vec2;
        readonly m_lalcB: b2Vec2;
        readonly m_rA: b2Vec2;
        readonly m_rB: b2Vec2;
        constructor(def: b2IWheelJointDef);
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
        GetAnchorA<T extends XY>(out: T): T;
        GetAnchorB<T extends XY>(out: T): T;
        GetReactionForce<T extends XY>(inv_dt: number, out: T): T;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): Readonly<b2Vec2>;
        GetLocalAnchorB(): Readonly<b2Vec2>;
        GetLocalAxisA(): Readonly<b2Vec2>;
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
declare module "Box2D/Box2D/Dynamics/Joints/b2JointFactory" {
    import { b2Joint, b2IJointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    export class b2JointFactory {
        static Create(def: b2IJointDef, allocator: any): b2Joint;
        static Destroy(joint: b2Joint, allocator: any): void;
    }
}
declare module "Box2D/Box2D/Rope/b2Rope" {
    import { b2Vec2 } from "Box2D/Box2D/Common/b2Math";
    import { b2Draw } from "Box2D/Box2D/Common/b2Draw";
    export class b2RopeDef {
        vertices: b2Vec2[];
        count: number;
        masses: number[];
        readonly gravity: b2Vec2;
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
        readonly m_gravity: b2Vec2;
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
declare module "Box2D/Box2D/Box2D" {
    /**
     * \mainpage Box2D API Documentation
     * \section intro_sec Getting Started
     * For documentation please see http://box2d.org/documentation.html
     * For discussion please visit http://box2d.org/forum
     */
    export * from "Box2D/Box2D/Common/b2Settings";
    export * from "Box2D/Box2D/Common/b2Math";
    export * from "Box2D/Box2D/Common/b2Draw";
    export * from "Box2D/Box2D/Common/b2Timer";
    export * from "Box2D/Box2D/Common/b2GrowableStack";
    export * from "Box2D/Box2D/Common/b2BlockAllocator";
    export * from "Box2D/Box2D/Common/b2StackAllocator";
    export * from "Box2D/Box2D/Collision/b2Collision";
    export * from "Box2D/Box2D/Collision/b2Distance";
    export * from "Box2D/Box2D/Collision/b2BroadPhase";
    export * from "Box2D/Box2D/Collision/b2DynamicTree";
    export * from "Box2D/Box2D/Collision/b2TimeOfImpact";
    export * from "Box2D/Box2D/Collision/b2CollideCircle";
    export * from "Box2D/Box2D/Collision/b2CollidePolygon";
    export * from "Box2D/Box2D/Collision/b2CollideEdge";
    export * from "Box2D/Box2D/Collision/Shapes/b2Shape";
    export * from "Box2D/Box2D/Collision/Shapes/b2CircleShape";
    export * from "Box2D/Box2D/Collision/Shapes/b2PolygonShape";
    export * from "Box2D/Box2D/Collision/Shapes/b2EdgeShape";
    export * from "Box2D/Box2D/Collision/Shapes/b2ChainShape";
    export * from "Box2D/Box2D/Dynamics/b2Fixture";
    export * from "Box2D/Box2D/Dynamics/b2Body";
    export * from "Box2D/Box2D/Dynamics/b2World";
    export * from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    export * from "Box2D/Box2D/Dynamics/b2Island";
    export * from "Box2D/Box2D/Dynamics/b2TimeStep";
    export * from "Box2D/Box2D/Dynamics/b2ContactManager";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2ContactFactory";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2ContactSolver";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2CircleContact";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2PolygonContact";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2ChainAndCircleContact";
    export * from "Box2D/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact";
    export * from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2JointFactory";
    export * from "Box2D/Box2D/Dynamics/Joints/b2AreaJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2DistanceJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2FrictionJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2GearJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2MotorJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2MouseJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2PulleyJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2RopeJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2WeldJoint";
    export * from "Box2D/Box2D/Dynamics/Joints/b2WheelJoint";
    export * from "Box2D/Box2D/Particle/b2Particle";
    export * from "Box2D/Box2D/Particle/b2ParticleGroup";
    export * from "Box2D/Box2D/Particle/b2ParticleSystem";
    export * from "Box2D/Box2D/Rope/b2Rope";
}
declare module "Contributions/Enhancements/Controllers/b2Controller" {
    import { b2TimeStep, b2Draw, b2Body } from "Box2D/Box2D/Box2D";
    /**
     * A controller edge is used to connect bodies and controllers
     * together in a bipartite graph.
     */
    export class b2ControllerEdge {
        controller: b2Controller;
        body: b2Body;
        prevBody: b2ControllerEdge | null;
        nextBody: b2ControllerEdge | null;
        prevController: b2ControllerEdge | null;
        nextController: b2ControllerEdge | null;
        constructor(controller: b2Controller, body: b2Body);
    }
    /**
     * Base class for controllers. Controllers are a convience for
     * encapsulating common per-step functionality.
     */
    export abstract class b2Controller {
        m_bodyList: b2ControllerEdge | null;
        m_bodyCount: number;
        m_prev: b2Controller | null;
        m_next: b2Controller | null;
        /**
         * Controllers override this to implement per-step functionality.
         */
        abstract Step(step: b2TimeStep): void;
        /**
         * Controllers override this to provide debug drawing.
         */
        abstract Draw(debugDraw: b2Draw): void;
        /**
         * Get the next controller in the world's body list.
         */
        GetNext(): b2Controller | null;
        /**
         * Get the previous controller in the world's body list.
         */
        GetPrev(): b2Controller | null;
        /**
         * Get the parent world of this body.
         */
        /**
         * Get the attached body list
         */
        GetBodyList(): b2ControllerEdge | null;
        /**
         * Adds a body to the controller list.
         */
        AddBody(body: b2Body): void;
        /**
         * Removes a body from the controller list.
         */
        RemoveBody(body: b2Body): void;
        /**
         * Removes all bodies from the controller list.
         */
        Clear(): void;
    }
}
declare module "Box2D/Box2D/Dynamics/b2Body" {
    import { b2Vec2, b2Transform, b2Sweep, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Shape, b2MassData } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2ContactEdge } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2JointEdge } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2Fixture, b2IFixtureDef } from "Box2D/Box2D/Dynamics/b2Fixture";
    import { b2World } from "Box2D/Box2D/Dynamics/b2World";
    import { b2ControllerEdge } from "Contributions/Enhancements/Controllers/b2Controller";
    export enum b2BodyType {
        b2_unknown = -1,
        b2_staticBody = 0,
        b2_kinematicBody = 1,
        b2_dynamicBody = 2
    }
    export interface b2IBodyDef {
        type?: b2BodyType;
        position?: XY;
        angle?: number;
        linearVelocity?: XY;
        angularVelocity?: number;
        linearDamping?: number;
        angularDamping?: number;
        allowSleep?: boolean;
        awake?: boolean;
        fixedRotation?: boolean;
        bullet?: boolean;
        active?: boolean;
        userData?: any;
        gravityScale?: number;
    }
    export class b2BodyDef implements b2IBodyDef {
        type: b2BodyType;
        readonly position: b2Vec2;
        angle: number;
        readonly linearVelocity: b2Vec2;
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
        readonly m_xf: b2Transform;
        readonly m_xf0: b2Transform;
        readonly m_sweep: b2Sweep;
        readonly m_linearVelocity: b2Vec2;
        m_angularVelocity: number;
        readonly m_force: b2Vec2;
        m_torque: number;
        m_world: b2World;
        m_prev: b2Body | null;
        m_next: b2Body | null;
        m_fixtureList: b2Fixture | null;
        m_fixtureCount: number;
        m_jointList: b2JointEdge | null;
        m_contactList: b2ContactEdge | null;
        m_mass: number;
        m_invMass: number;
        m_I: number;
        m_invI: number;
        m_linearDamping: number;
        m_angularDamping: number;
        m_gravityScale: number;
        m_sleepTime: number;
        m_userData: any;
        m_controllerList: b2ControllerEdge | null;
        m_controllerCount: number;
        constructor(bd: b2IBodyDef, world: b2World);
        CreateFixture(a: b2IFixtureDef | b2Shape, b?: number): b2Fixture;
        CreateFixtureDef(def: b2IFixtureDef): b2Fixture;
        private static CreateFixtureShapeDensity_s_def;
        CreateFixtureShapeDensity(shape: b2Shape, density?: number): b2Fixture;
        DestroyFixture(fixture: b2Fixture): void;
        SetTransformVec(position: XY, angle: number): void;
        SetTransformXY(x: number, y: number, angle: number): void;
        SetTransform(xf: b2Transform): void;
        GetTransform(): Readonly<b2Transform>;
        GetPosition(): Readonly<b2Vec2>;
        SetPosition(position: XY): void;
        SetPositionXY(x: number, y: number): void;
        GetAngle(): number;
        SetAngle(angle: number): void;
        GetWorldCenter(): Readonly<b2Vec2>;
        GetLocalCenter(): Readonly<b2Vec2>;
        SetLinearVelocity(v: XY): void;
        GetLinearVelocity(): Readonly<b2Vec2>;
        SetAngularVelocity(w: number): void;
        GetAngularVelocity(): number;
        GetDefinition(bd: b2BodyDef): b2BodyDef;
        ApplyForce(force: XY, point: XY, wake?: boolean): void;
        ApplyForceToCenter(force: XY, wake?: boolean): void;
        ApplyTorque(torque: number, wake?: boolean): void;
        ApplyLinearImpulse(impulse: XY, point: XY, wake?: boolean): void;
        ApplyLinearImpulseToCenter(impulse: XY, wake?: boolean): void;
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
        GetWorldPoint<T extends XY>(localPoint: XY, out: T): T;
        GetWorldVector<T extends XY>(localVector: XY, out: T): T;
        GetLocalPoint<T extends XY>(worldPoint: XY, out: T): T;
        GetLocalVector<T extends XY>(worldVector: XY, out: T): T;
        GetLinearVelocityFromWorldPoint<T extends XY>(worldPoint: XY, out: T): T;
        GetLinearVelocityFromLocalPoint<T extends XY>(localPoint: XY, out: T): T;
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
        GetFixtureList(): b2Fixture | null;
        GetJointList(): b2JointEdge | null;
        GetContactList(): b2ContactEdge | null;
        GetNext(): b2Body | null;
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
        GetControllerList(): b2ControllerEdge | null;
        GetControllerCount(): number;
    }
}
declare module "Box2D/Box2D/Dynamics/Contacts/b2Contact" {
    import { b2Transform, b2Sweep } from "Box2D/Box2D/Common/b2Math";
    import { b2Manifold, b2WorldManifold } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Body } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    import { b2ContactListener } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    export function b2MixFriction(friction1: number, friction2: number): number;
    export function b2MixRestitution(restitution1: number, restitution2: number): number;
    export class b2ContactEdge {
        other: b2Body;
        contact: b2Contact;
        prev: b2ContactEdge | null;
        next: b2ContactEdge | null;
        constructor(contact: b2Contact);
    }
    export abstract class b2Contact {
        m_islandFlag: boolean;
        m_touchingFlag: boolean;
        m_enabledFlag: boolean;
        m_filterFlag: boolean;
        m_bulletHitFlag: boolean;
        m_toiFlag: boolean;
        m_prev: b2Contact | null;
        m_next: b2Contact | null;
        readonly m_nodeA: b2ContactEdge;
        readonly m_nodeB: b2ContactEdge;
        m_fixtureA: b2Fixture;
        m_fixtureB: b2Fixture;
        m_indexA: number;
        m_indexB: number;
        m_manifold: b2Manifold;
        m_toiCount: number;
        m_toi: number;
        m_friction: number;
        m_restitution: number;
        m_tangentSpeed: number;
        m_oldManifold: b2Manifold;
        constructor();
        GetManifold(): b2Manifold;
        GetWorldManifold(worldManifold: b2WorldManifold): void;
        IsTouching(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        GetNext(): b2Contact | null;
        GetFixtureA(): b2Fixture;
        GetChildIndexA(): number;
        GetFixtureB(): b2Fixture;
        GetChildIndexB(): number;
        abstract Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
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
declare module "Box2D/Box2D/Dynamics/b2ContactManager" {
    import { b2BroadPhase } from "Box2D/Box2D/Collision/b2BroadPhase";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2ContactFactory } from "Box2D/Box2D/Dynamics/Contacts/b2ContactFactory";
    import { b2FixtureProxy } from "Box2D/Box2D/Dynamics/b2Fixture";
    import { b2ContactFilter, b2ContactListener } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    export class b2ContactManager {
        readonly m_broadPhase: b2BroadPhase;
        m_contactList: b2Contact | null;
        m_contactCount: number;
        m_contactFilter: b2ContactFilter;
        m_contactListener: b2ContactListener;
        m_allocator: any;
        m_contactFactory: b2ContactFactory;
        constructor();
        AddPair(proxyA: b2FixtureProxy, proxyB: b2FixtureProxy): void;
        FindNewContacts(): void;
        Destroy(c: b2Contact): void;
        Collide(): void;
    }
}
declare module "Box2D/Box2D/Collision/b2BroadPhase" {
    import { b2Vec2, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2AABB, b2RayCastInput } from "Box2D/Box2D/Collision/b2Collision";
    import { b2TreeNode, b2DynamicTree } from "Box2D/Box2D/Collision/b2DynamicTree";
    import { b2ContactManager } from "Box2D/Box2D/Dynamics/b2ContactManager";
    export class b2Pair {
        proxyA: b2TreeNode;
        proxyB: b2TreeNode;
        constructor(proxyA: b2TreeNode, proxyB: b2TreeNode);
    }
    export class b2BroadPhase {
        readonly m_tree: b2DynamicTree;
        m_proxyCount: number;
        m_moveCount: number;
        m_moveBuffer: Array<b2TreeNode | null>;
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
        ShiftOrigin(newOrigin: XY): void;
        BufferMove(proxy: b2TreeNode): void;
        UnBufferMove(proxy: b2TreeNode): void;
    }
    export function b2PairLessThan(pair1: b2Pair, pair2: b2Pair): number;
}
declare module "Box2D/Box2D/Dynamics/b2World" {
    import { b2Vec2, b2Transform, XY } from "Box2D/Box2D/Common/b2Math";
    import { b2Color, b2Draw } from "Box2D/Box2D/Common/b2Draw";
    import { b2AABB } from "Box2D/Box2D/Collision/b2Collision";
    import { b2Shape } from "Box2D/Box2D/Collision/Shapes/b2Shape";
    import { b2Contact } from "Box2D/Box2D/Dynamics/Contacts/b2Contact";
    import { b2Joint, b2JointDef } from "Box2D/Box2D/Dynamics/Joints/b2Joint";
    import { b2Body, b2IBodyDef } from "Box2D/Box2D/Dynamics/b2Body";
    import { b2ContactManager } from "Box2D/Box2D/Dynamics/b2ContactManager";
    import { b2Fixture } from "Box2D/Box2D/Dynamics/b2Fixture";
    import { b2Island } from "Box2D/Box2D/Dynamics/b2Island";
    import { b2Profile, b2TimeStep } from "Box2D/Box2D/Dynamics/b2TimeStep";
    import { b2ContactFilter } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    import { b2ContactListener } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    import { b2DestructionListener } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    import { b2QueryCallback, b2QueryCallbackFunction } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    import { b2RayCastCallback, b2RayCastCallbackFunction } from "Box2D/Box2D/Dynamics/b2WorldCallbacks";
    import { b2ParticleSystemDef, b2ParticleSystem } from "Box2D/Box2D/Particle/b2ParticleSystem";
    import { b2Controller } from "Contributions/Enhancements/Controllers/b2Controller";
    export class b2World {
        m_newFixture: boolean;
        m_locked: boolean;
        m_clearForces: boolean;
        readonly m_contactManager: b2ContactManager;
        m_bodyList: b2Body | null;
        m_jointList: b2Joint | null;
        m_particleSystemList: b2ParticleSystem | null;
        m_bodyCount: number;
        m_jointCount: number;
        readonly m_gravity: b2Vec2;
        m_allowSleep: boolean;
        m_destructionListener: b2DestructionListener | null;
        m_debugDraw: b2Draw | null;
        m_inv_dt0: number;
        m_warmStarting: boolean;
        m_continuousPhysics: boolean;
        m_subStepping: boolean;
        m_stepComplete: boolean;
        readonly m_profile: b2Profile;
        readonly m_island: b2Island;
        readonly s_stack: Array<b2Body | null>;
        m_controllerList: b2Controller | null;
        m_controllerCount: number;
        constructor(gravity: XY);
        SetDestructionListener(listener: b2DestructionListener | null): void;
        SetContactFilter(filter: b2ContactFilter): void;
        SetContactListener(listener: b2ContactListener): void;
        SetDebugDraw(debugDraw: b2Draw): void;
        CreateBody(def: b2IBodyDef): b2Body;
        DestroyBody(b: b2Body): void;
        CreateJoint<T extends b2Joint>(def: b2JointDef): T;
        DestroyJoint(j: b2Joint): void;
        CreateParticleSystem(def: b2ParticleSystemDef): b2ParticleSystem;
        DestroyParticleSystem(p: b2ParticleSystem): void;
        CalculateReasonableParticleIterations(timeStep: number): number;
        private static Step_s_step;
        private static Step_s_stepTimer;
        private static Step_s_timer;
        Step(dt: number, velocityIterations: number, positionIterations: number, particleIterations?: number): void;
        ClearForces(): void;
        DrawParticleSystem(system: b2ParticleSystem): void;
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
        RayCastOne(point1: b2Vec2, point2: b2Vec2): b2Fixture | null;
        RayCastAll(point1: b2Vec2, point2: b2Vec2, out?: b2Fixture[]): b2Fixture[];
        GetBodyList(): b2Body | null;
        GetJointList(): b2Joint | null;
        GetParticleSystemList(): b2ParticleSystem | null;
        GetContactList(): b2Contact | null;
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
        SetGravity(gravity: XY, wake?: boolean): void;
        GetGravity(): Readonly<b2Vec2>;
        IsLocked(): boolean;
        SetAutoClearForces(flag: boolean): void;
        GetAutoClearForces(): boolean;
        ShiftOrigin(newOrigin: XY): void;
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
        AddController(controller: b2Controller): b2Controller;
        RemoveController(controller: b2Controller): b2Controller;
    }
}
declare module "Box2D/HelloWorld/HelloWorld" {
    export function main(): number;
}
