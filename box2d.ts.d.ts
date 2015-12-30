declare module box2d {
    var DEBUG: boolean;
    var ENABLE_ASSERTS: boolean;
    function b2Assert(condition: boolean, ...args: any[]): void;
    var b2_maxFloat: number;
    var b2_epsilon: number;
    var b2_epsilon_sq: number;
    var b2_pi: number;
    var b2_maxManifoldPoints: number;
    var b2_maxPolygonVertices: number;
    var b2_aabbExtension: number;
    var b2_aabbMultiplier: number;
    var b2_linearSlop: number;
    var b2_angularSlop: number;
    var b2_polygonRadius: number;
    var b2_maxSubSteps: number;
    var b2_maxTOIContacts: number;
    var b2_velocityThreshold: number;
    var b2_maxLinearCorrection: number;
    var b2_maxAngularCorrection: number;
    var b2_maxTranslation: number;
    var b2_maxTranslationSquared: number;
    var b2_maxRotation: number;
    var b2_maxRotationSquared: number;
    var b2_baumgarte: number;
    var b2_toiBaumgarte: number;
    var b2_timeToSleep: number;
    var b2_linearSleepTolerance: number;
    var b2_angularSleepTolerance: number;
    function b2Alloc(size: number): any;
    function b2Free(mem: any): void;
    function b2Log(message: string, ...args: any[]): void;
    class b2Version {
        major: number;
        minor: number;
        revision: number;
        constructor(major?: number, minor?: number, revision?: number);
        toString(): string;
    }
    var b2_version: b2Version;
    var b2_changelist: number;
    function b2ParseInt(v: string): number;
    function b2ParseUInt(v: string): number;
    function b2MakeArray(length: number, init: {
        (i: number): any;
    }): any[];
    function b2MakeNumberArray(length: number): number[];
}
declare module box2d {
    var b2_pi_over_180: number;
    var b2_180_over_pi: number;
    var b2_two_pi: number;
    function b2Abs(n: number): number;
    function b2Min(a: number, b: number): number;
    function b2Max(a: number, b: number): number;
    function b2Clamp(a: number, lo: number, hi: number): number;
    function b2Swap(a: any[], b: any[]): void;
    function b2IsValid(n: number): boolean;
    function b2Sq(n: number): number;
    function b2InvSqrt(n: number): number;
    function b2Sqrt(n: number): number;
    function b2Pow(x: number, y: number): number;
    function b2DegToRad(degrees: number): number;
    function b2RadToDeg(radians: number): number;
    function b2Cos(radians: number): number;
    function b2Sin(radians: number): number;
    function b2Acos(n: number): number;
    function b2Asin(n: number): number;
    function b2Atan2(y: number, x: number): number;
    function b2NextPowerOfTwo(x: number): number;
    function b2IsPowerOfTwo(x: number): boolean;
    function b2Random(): number;
    function b2RandomRange(lo: number, hi: number): number;
    class b2Vec2 {
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
        SetXY(x: number, y: number): b2Vec2;
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
        GetLength(): number;
        GetLengthSquared(): number;
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
    }
    var b2Vec2_zero: b2Vec2;
    function b2AbsV(v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MinV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MaxV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2ClampV(v: b2Vec2, lo: b2Vec2, hi: b2Vec2, out: b2Vec2): b2Vec2;
    function b2RotateV(v: b2Vec2, radians: number, out: b2Vec2): b2Vec2;
    function b2DotVV(a: b2Vec2, b: b2Vec2): number;
    function b2CrossVV(a: b2Vec2, b: b2Vec2): number;
    function b2CrossVS(v: b2Vec2, s: number, out: b2Vec2): b2Vec2;
    function b2CrossVOne(v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2CrossSV(s: number, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2CrossOneV(v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2AddVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2SubVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MulSV(s: number, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2AddVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2SubVMulSV(a: b2Vec2, s: number, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2AddVCrossSV(a: b2Vec2, s: number, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MidVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2ExtVV(a: b2Vec2, b: b2Vec2, out: b2Vec2): b2Vec2;
    function b2IsEqualToV(a: b2Vec2, b: b2Vec2): boolean;
    function b2DistanceVV(a: b2Vec2, b: b2Vec2): number;
    function b2DistanceSquaredVV(a: b2Vec2, b: b2Vec2): number;
    function b2NegV(v: b2Vec2, out: b2Vec2): b2Vec2;
    class b2Vec3 {
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
    }
    function b2DotV3V3(a: b2Vec3, b: b2Vec3): number;
    function b2CrossV3V3(a: b2Vec3, b: b2Vec3, out: b2Vec3): b2Vec3;
    class b2Mat22 {
        static IDENTITY: b2Mat22;
        ex: b2Vec2;
        ey: b2Vec2;
        Clone(): b2Mat22;
        static FromVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        static FromSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        static FromAngleRadians(radians: number): b2Mat22;
        SetSSSS(r1c1: number, r1c2: number, r2c1: number, r2c2: number): b2Mat22;
        SetVV(c1: b2Vec2, c2: b2Vec2): b2Mat22;
        SetAngleRadians(radians: number): b2Mat22;
        Copy(other: b2Mat22): b2Mat22;
        SetIdentity(): b2Mat22;
        SetZero(): b2Mat22;
        GetAngleRadians(): number;
        GetInverse(out: b2Mat22): b2Mat22;
        Solve(b_x: number, b_y: number, out: b2Vec2): b2Vec2;
        SelfAbs(): b2Mat22;
        SelfInv(): b2Mat22;
        SelfAddM(M: b2Mat22): b2Mat22;
        SelfSubM(M: b2Mat22): b2Mat22;
    }
    function b2AbsM(M: b2Mat22, out: b2Mat22): b2Mat22;
    function b2MulMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MulTMV(M: b2Mat22, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2AddMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    function b2MulMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    function b2MulTMM(A: b2Mat22, B: b2Mat22, out: b2Mat22): b2Mat22;
    class b2Mat33 {
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
    }
    function b2MulM33V3(A: b2Mat33, v: b2Vec3, out: b2Vec3): b2Vec3;
    function b2MulM33XYZ(A: b2Mat33, x: number, y: number, z: number, out: b2Vec3): b2Vec3;
    function b2MulM33V2(A: b2Mat33, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MulM33XY(A: b2Mat33, x: number, y: number, out: b2Vec2): b2Vec2;
    class b2Rot {
        static IDENTITY: b2Rot;
        s: number;
        c: number;
        constructor(angle?: number);
        Clone(): b2Rot;
        Copy(other: b2Rot): b2Rot;
        SetAngleRadians(angle: number): b2Rot;
        SetIdentity(): b2Rot;
        GetAngleRadians(): number;
        GetXAxis(out: b2Vec2): b2Vec2;
        GetYAxis(out: b2Vec2): b2Vec2;
    }
    function b2MulRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
    function b2MulTRR(q: b2Rot, r: b2Rot, out: b2Rot): b2Rot;
    function b2MulRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MulTRV(q: b2Rot, v: b2Vec2, out: b2Vec2): b2Vec2;
    class b2Transform {
        static IDENTITY: b2Transform;
        p: b2Vec2;
        q: b2Rot;
        Clone(): b2Transform;
        Copy(other: b2Transform): b2Transform;
        SetIdentity(): b2Transform;
        SetPositionRotation(position: b2Vec2, q: b2Rot): b2Transform;
        SetPositionAngleRadians(pos: b2Vec2, a: number): b2Transform;
        SetPosition(position: b2Vec2): b2Transform;
        SetPositionXY(x: number, y: number): b2Transform;
        SetRotation(rotation: b2Rot): b2Transform;
        SetRotationAngleRadians(radians: number): b2Transform;
        GetPosition(): b2Vec2;
        GetRotation(): b2Rot;
        GetRotationAngleRadians(): number;
        GetAngleRadians(): number;
    }
    function b2MulXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MulTXV(T: b2Transform, v: b2Vec2, out: b2Vec2): b2Vec2;
    function b2MulXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
    function b2MulTXX(A: b2Transform, B: b2Transform, out: b2Transform): b2Transform;
    class b2Sweep {
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
declare module box2d {
    class b2Color {
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
    enum b2DrawFlags {
        e_none = 0,
        e_shapeBit = 1,
        e_jointBit = 2,
        e_aabbBit = 4,
        e_pairBit = 8,
        e_centerOfMassBit = 16,
        e_controllerBit = 32,
        e_all = 63,
    }
    class b2Draw {
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
declare module box2d {
    class b2Timer {
        m_start: number;
        Reset(): b2Timer;
        GetMilliseconds(): number;
    }
    class b2Counter {
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
declare module box2d {
    class b2GrowableStack {
        m_stack: any[];
        m_count: number;
        constructor(N: number);
        Reset(): b2GrowableStack;
        Push(element: any): void;
        Pop(): any;
        GetCount(): number;
    }
}
declare module box2d {
    class b2DistanceProxy {
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
    class b2SimplexCache {
        metric: number;
        count: number;
        indexA: number[];
        indexB: number[];
        Reset(): b2SimplexCache;
    }
    class b2DistanceInput {
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        transformA: b2Transform;
        transformB: b2Transform;
        useRadii: boolean;
        Reset(): b2DistanceInput;
    }
    class b2DistanceOutput {
        pointA: b2Vec2;
        pointB: b2Vec2;
        distance: number;
        iterations: number;
        Reset(): b2DistanceOutput;
    }
    var b2_gjkCalls: number;
    var b2_gjkIters: number;
    var b2_gjkMaxIters: number;
    class b2SimplexVertex {
        wA: b2Vec2;
        wB: b2Vec2;
        w: b2Vec2;
        a: number;
        indexA: number;
        indexB: number;
        Copy(other: b2SimplexVertex): b2SimplexVertex;
    }
    class b2Simplex {
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
    function b2Distance(output: b2DistanceOutput, cache: b2SimplexCache, input: b2DistanceInput): void;
}
declare module box2d {
    enum b2ContactFeatureType {
        e_vertex = 0,
        e_face = 1,
    }
    class b2ContactFeature {
        _id: b2ContactID;
        _indexA: number;
        _indexB: number;
        _typeA: number;
        _typeB: number;
        constructor(id: b2ContactID);
        indexA: number;
        indexB: number;
        typeA: number;
        typeB: number;
    }
    class b2ContactID {
        cf: b2ContactFeature;
        _key: number;
        constructor();
        Copy(o: b2ContactID): b2ContactID;
        Clone(): b2ContactID;
        key: number;
    }
    class b2ManifoldPoint {
        localPoint: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        id: b2ContactID;
        static MakeArray(length: number): b2ManifoldPoint[];
        Reset(): void;
        Copy(o: b2ManifoldPoint): b2ManifoldPoint;
    }
    enum b2ManifoldType {
        e_unknown = -1,
        e_circles = 0,
        e_faceA = 1,
        e_faceB = 2,
    }
    class b2Manifold {
        points: b2ManifoldPoint[];
        localNormal: b2Vec2;
        localPoint: b2Vec2;
        type: number;
        pointCount: number;
        Reset(): void;
        Copy(o: b2Manifold): b2Manifold;
        Clone(): b2Manifold;
    }
    class b2WorldManifold {
        normal: b2Vec2;
        points: b2Vec2[];
        private static Initialize_s_pointA;
        private static Initialize_s_pointB;
        private static Initialize_s_cA;
        private static Initialize_s_cB;
        private static Initialize_s_planePoint;
        private static Initialize_s_clipPoint;
        Initialize(manifold: b2Manifold, xfA: b2Transform, radiusA: number, xfB: b2Transform, radiusB: number): void;
    }
    enum b2PointState {
        b2_nullState = 0,
        b2_addState = 1,
        b2_persistState = 2,
        b2_removeState = 3,
    }
    function b2GetPointStates(state1: b2PointState[], state2: b2PointState[], manifold1: b2Manifold, manifold2: b2Manifold): void;
    class b2ClipVertex {
        v: b2Vec2;
        id: b2ContactID;
        static MakeArray(length: number): b2ClipVertex[];
        Copy(other: b2ClipVertex): b2ClipVertex;
    }
    class b2RayCastInput {
        p1: b2Vec2;
        p2: b2Vec2;
        maxFraction: number;
        Copy(o: b2RayCastInput): b2RayCastInput;
    }
    class b2RayCastOutput {
        normal: b2Vec2;
        fraction: number;
        Copy(o: b2RayCastOutput): b2RayCastOutput;
    }
    class b2AABB {
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
    function b2TestOverlapAABB(a: b2AABB, b: b2AABB): boolean;
    function b2ClipSegmentToLine(vOut: b2ClipVertex[], vIn: b2ClipVertex[], normal: b2Vec2, offset: number, vertexIndexA: number): number;
    function b2TestOverlapShape(shapeA: b2Shape, indexA: number, shapeB: b2Shape, indexB: number, xfA: b2Transform, xfB: b2Transform): boolean;
}
declare module box2d {
    class b2MassData {
        mass: number;
        center: b2Vec2;
        I: number;
    }
    enum b2ShapeType {
        e_unknown = -1,
        e_circleShape = 0,
        e_edgeShape = 1,
        e_polygonShape = 2,
        e_chainShape = 3,
        e_shapeTypeCount = 4,
    }
    class b2Shape {
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
        Dump(): void;
    }
}
declare module box2d {
    class b2CircleShape extends b2Shape {
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
        Dump(): void;
    }
}
declare module box2d {
    class b2EdgeShape extends b2Shape {
        m_vertex1: b2Vec2;
        m_vertex2: b2Vec2;
        m_vertex0: b2Vec2;
        m_vertex3: b2Vec2;
        m_hasVertex0: boolean;
        m_hasVertex3: boolean;
        constructor();
        SetAsEdge(v1: b2Vec2, v2: b2Vec2): b2EdgeShape;
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
        Dump(): void;
    }
}
declare module box2d {
    class b2ChainShape extends b2Shape {
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
        Dump(): void;
    }
}
declare module box2d {
    class b2PolygonShape extends b2Shape {
        m_centroid: b2Vec2;
        m_vertices: b2Vec2[];
        m_normals: b2Vec2[];
        m_count: number;
        constructor();
        Clone(): b2PolygonShape;
        Copy(other: b2PolygonShape): b2PolygonShape;
        GetChildCount(): number;
        private static SetAsVector_s_ps;
        private static SetAsVector_s_hull;
        private static SetAsVector_s_r;
        private static SetAsVector_s_v;
        SetAsVector(vertices: any, count: number): b2PolygonShape;
        SetAsArray(vertices: any, count: number): b2PolygonShape;
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
        Dump(): void;
        private static ComputeCentroid_s_pRef;
        private static ComputeCentroid_s_e1;
        private static ComputeCentroid_s_e2;
        static ComputeCentroid(vs: b2Vec2[], count: number, out: b2Vec2): b2Vec2;
    }
}
declare module box2d {
    class b2TreeNode {
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
    class b2DynamicTree {
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
        Query(callback: any, aabb: any): void;
        RayCast(callback: any, input: any): void;
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
        GetAreaRatio(): number;
        ComputeHeightNode(node: b2TreeNode): number;
        ComputeHeight(): number;
        ValidateStructure(index: b2TreeNode): void;
        ValidateMetrics(index: b2TreeNode): void;
        Validate(): void;
        GetMaxBalance(): number;
        RebuildBottomUp(): void;
        ShiftOrigin(newOrigin: b2Vec2): void;
    }
}
declare module box2d {
    class b2Pair {
        proxyA: b2TreeNode;
        proxyB: b2TreeNode;
    }
    class b2BroadPhase {
        m_tree: b2DynamicTree;
        m_proxyCount: number;
        m_moveCount: number;
        m_moveBuffer: any[];
        m_pairCount: number;
        m_pairBuffer: any[];
        CreateProxy(aabb: b2AABB, userData: any): b2TreeNode;
        DestroyProxy(proxy: b2TreeNode): void;
        MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): void;
        TouchProxy(proxy: b2TreeNode): void;
        GetFatAABB(proxy: b2TreeNode): b2AABB;
        GetUserData(proxy: b2TreeNode): any;
        TestOverlap(proxyA: b2TreeNode, proxyB: b2TreeNode): boolean;
        GetProxyCount(): number;
        UpdatePairs(contactManager: any): void;
        Query(callback: any, aabb: b2AABB): void;
        RayCast(callback: any, input: b2RayCastInput): void;
        GetTreeHeight(): number;
        GetTreeBalance(): number;
        GetTreeQuality(): number;
        ShiftOrigin(newOrigin: b2Vec2): void;
        BufferMove(proxy: b2TreeNode): void;
        UnBufferMove(proxy: b2TreeNode): void;
    }
    function b2PairLessThan(pair1: b2Pair, pair2: b2Pair): number;
}
declare module box2d {
    var b2_toiTime: number;
    var b2_toiMaxTime: number;
    var b2_toiCalls: number;
    var b2_toiIters: number;
    var b2_toiMaxIters: number;
    var b2_toiRootIters: number;
    var b2_toiMaxRootIters: number;
    class b2TOIInput {
        proxyA: b2DistanceProxy;
        proxyB: b2DistanceProxy;
        sweepA: b2Sweep;
        sweepB: b2Sweep;
        tMax: number;
    }
    enum b2TOIOutputState {
        e_unknown = 0,
        e_failed = 1,
        e_overlapped = 2,
        e_touching = 3,
        e_separated = 4,
    }
    class b2TOIOutput {
        state: b2TOIOutputState;
        t: number;
    }
    enum b2SeparationFunctionType {
        e_unknown = -1,
        e_points = 0,
        e_faceA = 1,
        e_faceB = 2,
    }
    class b2SeparationFunction {
        m_proxyA: any;
        m_proxyB: any;
        m_sweepA: b2Sweep;
        m_sweepB: b2Sweep;
        m_type: b2SeparationFunctionType;
        m_localPoint: b2Vec2;
        m_axis: b2Vec2;
        Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, sweepA: b2Sweep, proxyB: b2DistanceProxy, sweepB: b2Sweep, t1: number): number;
        FindMinSeparation(indexA: number[], indexB: number[], t: number): number;
        Evaluate(indexA: number, indexB: number, t: number): number;
    }
    function b2TimeOfImpact(output: b2TOIOutput, input: b2TOIInput): void;
}
declare module box2d {
    class b2Filter {
        categoryBits: number;
        maskBits: number;
        groupIndex: number;
        Clone(): b2Filter;
        Copy(other: b2Filter): b2Filter;
    }
    class b2FixtureDef {
        shape: b2Shape;
        userData: any;
        friction: number;
        restitution: number;
        density: number;
        isSensor: boolean;
        filter: b2Filter;
    }
    class b2FixtureProxy {
        aabb: b2AABB;
        fixture: b2Fixture;
        childIndex: number;
        proxy: b2TreeNode;
        static MakeArray(length: number): b2FixtureProxy[];
    }
    class b2Fixture {
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
        Dump(bodyIndex: number): void;
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
declare module box2d {
}
declare module box2d {
}
declare module box2d {
    enum b2JointType {
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
    enum b2LimitState {
        e_inactiveLimit = 0,
        e_atLowerLimit = 1,
        e_atUpperLimit = 2,
        e_equalLimits = 3,
    }
    class b2Jacobian {
        linear: b2Vec2;
        angularA: number;
        angularB: number;
        SetZero(): b2Jacobian;
        Set(x: b2Vec2, a1: number, a2: number): b2Jacobian;
    }
    class b2JointEdge {
        other: b2Body;
        joint: b2Joint;
        prev: b2JointEdge;
        next: b2JointEdge;
    }
    class b2JointDef {
        type: b2JointType;
        userData: any;
        bodyA: b2Body;
        bodyB: b2Body;
        collideConnected: boolean;
        constructor(type: b2JointType);
    }
    class b2Joint {
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
        Dump(): void;
        ShiftOrigin(newOrigin: b2Vec2): void;
        InitVelocityConstraints(data: b2SolverData): void;
        SolveVelocityConstraints(data: b2SolverData): void;
        SolvePositionConstraints(data: b2SolverData): boolean;
    }
}
declare module box2d {
    class b2DestructionListener {
        SayGoodbyeJoint(joint: b2Joint): void;
        SayGoodbyeFixture(fixture: b2Fixture): void;
    }
    class b2ContactFilter {
        ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
        static b2_defaultFilter: b2ContactFilter;
    }
    class b2ContactImpulse {
        normalImpulses: number[];
        tangentImpulses: number[];
        count: number;
    }
    class b2ContactListener {
        BeginContact(contact: b2Contact): void;
        EndContact(contact: b2Contact): void;
        PreSolve(contact: b2Contact, oldManifold: b2Manifold): void;
        PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void;
        static b2_defaultListener: b2ContactListener;
    }
    class b2QueryCallback {
        ReportFixture(fixture: b2Fixture): boolean;
    }
    class b2RayCastCallback {
        ReportFixture(fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
    }
}
declare module box2d {
    function b2MixFriction(friction1: number, friction2: number): number;
    function b2MixRestitution(restitution1: number, restitution2: number): number;
    class b2ContactEdge {
        other: b2Body;
        contact: b2Contact;
        prev: b2ContactEdge;
        next: b2ContactEdge;
    }
    enum b2ContactFlag {
        e_none = 0,
        e_islandFlag = 1,
        e_touchingFlag = 2,
        e_enabledFlag = 4,
        e_filterFlag = 8,
        e_bulletHitFlag = 16,
        e_toiFlag = 32,
    }
    class b2Contact {
        m_flags: b2ContactFlag;
        m_prev: b2Contact;
        m_next: b2Contact;
        m_nodeA: b2ContactEdge;
        m_nodeB: b2ContactEdge;
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
        GetManifold(): b2Manifold;
        GetWorldManifold(worldManifold: b2WorldManifold): void;
        IsTouching(): boolean;
        SetEnabled(flag: boolean): void;
        IsEnabled(): boolean;
        GetNext(): b2Contact;
        GetFixtureA(): b2Fixture;
        GetChildIndexA(): number;
        GetFixtureB(): b2Fixture;
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
declare module box2d {
    function b2CollideCircles(manifold: any, circleA: any, xfA: any, circleB: any, xfB: any): void;
    function b2CollidePolygonAndCircle(manifold: any, polygonA: any, xfA: any, circleB: any, xfB: any): void;
}
declare module box2d {
    class b2CircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module box2d {
    class b2PolygonAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module box2d {
    function b2EdgeSeparation(poly1: any, xf1: any, edge1: any, poly2: any, xf2: any): number;
    function b2FindMaxSeparation(edgeIndex: any, poly1: any, xf1: any, poly2: any, xf2: any): number;
    function b2FindIncidentEdge(c: any, poly1: any, xf1: any, edge1: any, poly2: any, xf2: any): void;
    function b2CollidePolygons(manifold: any, polyA: any, xfA: any, polyB: any, xfB: any): void;
}
declare module box2d {
    class b2PolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module box2d {
    function b2CollideEdgeAndCircle(manifold: any, edgeA: any, xfA: any, circleB: any, xfB: any): void;
    enum b2EPAxisType {
        e_unknown = 0,
        e_edgeA = 1,
        e_edgeB = 2,
    }
    class b2EPAxis {
        type: b2EPAxisType;
        index: number;
        separation: number;
    }
    class b2TempPolygon {
        vertices: b2Vec2[];
        normals: b2Vec2[];
        count: number;
    }
    class b2ReferenceFace {
        i1: number;
        i2: number;
        v1: b2Vec2;
        v2: b2Vec2;
        normal: b2Vec2;
        sideNormal1: b2Vec2;
        sideOffset1: number;
        sideNormal2: b2Vec2;
        sideOffset2: number;
    }
    enum b2EPColliderVertexType {
        e_isolated = 0,
        e_concave = 1,
        e_convex = 2,
    }
    class b2EPCollider {
        m_polygonB: b2TempPolygon;
        m_xf: b2Transform;
        m_centroidB: b2Vec2;
        m_v0: b2Vec2;
        m_v1: b2Vec2;
        m_v2: b2Vec2;
        m_v3: b2Vec2;
        m_normal0: b2Vec2;
        m_normal1: b2Vec2;
        m_normal2: b2Vec2;
        m_normal: b2Vec2;
        m_type1: b2EPColliderVertexType;
        m_type2: b2EPColliderVertexType;
        m_lowerLimit: b2Vec2;
        m_upperLimit: b2Vec2;
        m_radius: number;
        m_front: boolean;
        private static s_edge1;
        private static s_edge0;
        private static s_edge2;
        private static s_ie;
        private static s_rf;
        private static s_clipPoints1;
        private static s_clipPoints2;
        private static s_edgeAxis;
        private static s_polygonAxis;
        Collide(manifold: any, edgeA: any, xfA: any, polygonB: any, xfB: any): void;
        ComputeEdgeSeparation(out: any): b2EPAxis;
        private static s_n;
        private static s_perp;
        ComputePolygonSeparation(out: any): b2EPAxis;
    }
    function b2CollideEdgeAndPolygon(manifold: any, edgeA: any, xfA: any, polygonB: any, xfB: any): void;
}
declare module box2d {
    class b2EdgeAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module box2d {
    class b2EdgeAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module box2d {
    class b2ChainAndCircleContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        private static Evaluate_s_edge;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module box2d {
    class b2ChainAndPolygonContact extends b2Contact {
        constructor();
        static Create(allocator: any): b2Contact;
        static Destroy(contact: b2Contact, allocator: any): void;
        Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
        private static Evaluate_s_edge;
        Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
    }
}
declare module box2d {
    class b2ContactRegister {
        pool: b2Contact[];
        createFcn: {
            (allocator: any): b2Contact;
        };
        destroyFcn: {
            (contact: b2Contact, allocator: any): void;
        };
        primary: boolean;
    }
    class b2ContactFactory {
        m_allocator: any;
        m_registers: b2ContactRegister[][];
        constructor(allocator: any);
        private AddType(createFcn, destroyFcn, type1, type2);
        private InitializeRegisters();
        Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact;
        Destroy(contact: b2Contact): void;
    }
}
declare module box2d {
    class b2ContactManager {
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
        Destroy(c: any): void;
        Collide(): void;
    }
}
declare module box2d {
    class b2Profile {
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
    class b2TimeStep {
        dt: number;
        inv_dt: number;
        dtRatio: number;
        velocityIterations: number;
        positionIterations: number;
        warmStarting: boolean;
        Copy(step: b2TimeStep): b2TimeStep;
    }
    class b2Position {
        c: b2Vec2;
        a: number;
        static MakeArray(length: number): b2Position[];
    }
    class b2Velocity {
        v: b2Vec2;
        w: number;
        static MakeArray(length: number): b2Velocity[];
    }
    class b2SolverData {
        step: b2TimeStep;
        positions: b2Position[];
        velocities: b2Velocity[];
    }
}
declare module box2d {
    class b2VelocityConstraintPoint {
        rA: b2Vec2;
        rB: b2Vec2;
        normalImpulse: number;
        tangentImpulse: number;
        normalMass: number;
        tangentMass: number;
        velocityBias: number;
        static MakeArray(length: any): any[];
    }
    class b2ContactVelocityConstraint {
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
        static MakeArray(length: any): any[];
    }
    class b2ContactPositionConstraint {
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
        static MakeArray(length: any): any[];
    }
    class b2ContactSolverDef {
        step: b2TimeStep;
        contacts: b2Contact[];
        count: number;
        positions: b2Position[];
        velocities: b2Velocity[];
        allocator: any;
    }
    class b2PositionSolverManifold {
        normal: b2Vec2;
        point: b2Vec2;
        separation: number;
        private static Initialize_s_pointA;
        private static Initialize_s_pointB;
        private static Initialize_s_planePoint;
        private static Initialize_s_clipPoint;
        Initialize(pc: any, xfA: any, xfB: any, index: any): void;
    }
    class b2ContactSolver {
        m_step: b2TimeStep;
        m_positions: b2Position[];
        m_velocities: b2Velocity[];
        m_allocator: any;
        m_positionConstraints: b2ContactPositionConstraint[];
        m_velocityConstraints: b2ContactVelocityConstraint[];
        m_contacts: b2Contact[];
        m_count: number;
        Initialize(def: any): this;
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
        SolveTOIPositionConstraints(toiIndexA: any, toiIndexB: any): boolean;
    }
}
declare module box2d {
    class b2Island {
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
        Initialize(bodyCapacity: any, contactCapacity: any, jointCapacity: any, allocator: any, listener: any): void;
        Clear(): void;
        AddBody(body: any): void;
        AddContact(contact: any): void;
        AddJoint(joint: any): void;
        private static s_timer;
        private static s_solverData;
        private static s_contactSolverDef;
        private static s_contactSolver;
        private static s_translation;
        Solve(profile: any, step: any, gravity: any, allowSleep: any): void;
        SolveTOI(subStep: any, toiIndexA: any, toiIndexB: any): void;
        private static s_impulse;
        Report(constraints: any): void;
    }
}
declare module box2d {
    class b2DistanceJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        length: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        Initialize(b1: any, b2: any, anchor1: any, anchor2: any): void;
    }
    class b2DistanceJoint extends b2Joint {
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
        constructor(def: any);
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetLength(length: any): void;
        GetLength(): number;
        SetFrequency(hz: any): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: any): void;
        GetDampingRatio(): number;
        Dump(): void;
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_vpA;
        private static SolveVelocityConstraints_s_vpB;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: any): boolean;
    }
}
declare module box2d {
    class b2WheelJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        localAxisA: b2Vec2;
        enableMotor: boolean;
        maxMotorTorque: number;
        motorSpeed: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        Initialize(bA: any, bB: any, anchor: any, axis: any): void;
    }
    class b2WheelJoint extends b2Joint {
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
        constructor(def: any);
        GetMotorSpeed(): number;
        GetMaxMotorTorque(): number;
        SetSpringFrequencyHz(hz: any): void;
        GetSpringFrequencyHz(): number;
        SetSpringDampingRatio(ratio: any): void;
        GetSpringDampingRatio(): number;
        private static InitVelocityConstraints_s_d;
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_d;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: any): boolean;
        GetDefinition(def: any): any;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetLocalAxisA(): b2Vec2;
        GetJointTranslation(): number;
        GetJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: boolean): void;
        SetMotorSpeed(speed: number): void;
        SetMaxMotorTorque(force: number): void;
        GetMotorTorque(inv_dt: number): number;
        Dump(): void;
    }
}
declare module box2d {
    class b2MouseJointDef extends b2JointDef {
        target: b2Vec2;
        maxForce: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
    }
    class b2MouseJoint extends b2Joint {
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
        constructor(def: any);
        SetTarget(target: any): void;
        GetTarget(): b2Vec2;
        SetMaxForce(maxForce: any): void;
        GetMaxForce(): number;
        SetFrequency(hz: any): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: any): void;
        GetDampingRatio(): number;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_Cdot;
        private static SolveVelocityConstraints_s_impulse;
        private static SolveVelocityConstraints_s_oldImpulse;
        SolveVelocityConstraints(data: any): void;
        SolvePositionConstraints(data: any): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        Dump(): void;
        ShiftOrigin(newOrigin: any): void;
    }
}
declare module box2d {
    class b2RevoluteJointDef extends b2JointDef {
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
        Initialize(bA: any, bB: any, anchor: any): void;
    }
    class b2RevoluteJoint extends b2Joint {
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
        constructor(def: any);
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_P;
        private static SolveVelocityConstraints_s_Cdot_v2;
        private static SolveVelocityConstraints_s_Cdot1;
        private static SolveVelocityConstraints_s_impulse_v3;
        private static SolveVelocityConstraints_s_reduced_v2;
        private static SolveVelocityConstraints_s_impulse_v2;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_C_v2;
        private static SolvePositionConstraints_s_impulse;
        SolvePositionConstraints(data: any): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetReferenceAngle(): number;
        GetJointAngleRadians(): number;
        GetJointSpeed(): number;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: any): void;
        GetMotorTorque(inv_dt: any): number;
        GetMotorSpeed(): number;
        SetMaxMotorTorque(torque: any): void;
        GetMaxMotorTorque(): number;
        IsLimitEnabled(): boolean;
        EnableLimit(flag: any): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: any, upper: any): void;
        SetMotorSpeed(speed: any): void;
        Dump(): void;
    }
}
declare module box2d {
    class b2PrismaticJointDef extends b2JointDef {
        localAnchorA: any;
        localAnchorB: any;
        localAxisA: any;
        referenceAngle: number;
        enableLimit: boolean;
        lowerTranslation: number;
        upperTranslation: number;
        enableMotor: boolean;
        maxMotorForce: number;
        motorSpeed: number;
        constructor();
        Initialize(bA: any, bB: any, anchor: any, axis: any): void;
    }
    class b2PrismaticJoint extends b2Joint {
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
        constructor(def: any);
        private static InitVelocityConstraints_s_d;
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_P;
        private static SolveVelocityConstraints_s_f2r;
        private static SolveVelocityConstraints_s_f1;
        private static SolveVelocityConstraints_s_df3;
        private static SolveVelocityConstraints_s_df2;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_d;
        private static SolvePositionConstraints_s_impulse;
        private static SolvePositionConstraints_s_impulse1;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: any): boolean;
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
        EnableLimit(flag: any): void;
        GetLowerLimit(): number;
        GetUpperLimit(): number;
        SetLimits(lower: any, upper: any): void;
        IsMotorEnabled(): boolean;
        EnableMotor(flag: any): void;
        SetMotorSpeed(speed: any): void;
        GetMotorSpeed(): number;
        SetMaxMotorForce(force: any): void;
        GetMaxMotorForce(): number;
        GetMotorForce(inv_dt: any): number;
        Dump(): void;
    }
}
declare module box2d {
    var b2_minPulleyLength: number;
    class b2PulleyJointDef extends b2JointDef {
        groundAnchorA: b2Vec2;
        groundAnchorB: b2Vec2;
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        lengthA: number;
        lengthB: number;
        ratio: number;
        constructor();
        Initialize(bA: any, bB: any, groundA: any, groundB: any, anchorA: any, anchorB: any, r: any): void;
    }
    class b2PulleyJoint extends b2Joint {
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
        constructor(def: any);
        private static InitVelocityConstraints_s_PA;
        private static InitVelocityConstraints_s_PB;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_vpA;
        private static SolveVelocityConstraints_s_vpB;
        private static SolveVelocityConstraints_s_PA;
        private static SolveVelocityConstraints_s_PB;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_PA;
        private static SolvePositionConstraints_s_PB;
        SolvePositionConstraints(data: any): boolean;
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
        Dump(): void;
        ShiftOrigin(newOrigin: any): void;
    }
}
declare module box2d {
    class b2GearJointDef extends b2JointDef {
        joint1: b2Joint;
        joint2: b2Joint;
        ratio: number;
        constructor();
    }
    class b2GearJoint extends b2Joint {
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
        constructor(def: any);
        private static InitVelocityConstraints_s_u;
        private static InitVelocityConstraints_s_rA;
        private static InitVelocityConstraints_s_rB;
        private static InitVelocityConstraints_s_rC;
        private static InitVelocityConstraints_s_rD;
        InitVelocityConstraints(data: any): void;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_u;
        private static SolvePositionConstraints_s_rA;
        private static SolvePositionConstraints_s_rB;
        private static SolvePositionConstraints_s_rC;
        private static SolvePositionConstraints_s_rD;
        SolvePositionConstraints(data: any): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetJoint1(): b2Joint;
        GetJoint2(): b2Joint;
        GetRatio(): number;
        SetRatio(ratio: any): void;
        Dump(): void;
    }
}
declare module box2d {
    class b2WeldJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        referenceAngle: number;
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        Initialize(bA: any, bB: any, anchor: any): void;
    }
    class b2WeldJoint extends b2Joint {
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
        constructor(def: any);
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_Cdot1;
        private static SolveVelocityConstraints_s_impulse1;
        private static SolveVelocityConstraints_s_impulse;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_C1;
        private static SolvePositionConstraints_s_P;
        private static SolvePositionConstraints_s_impulse;
        SolvePositionConstraints(data: any): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        GetReferenceAngle(): number;
        SetFrequency(hz: number): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: any): void;
        GetDampingRatio(): number;
        Dump(): void;
    }
}
declare module box2d {
    class b2FrictionJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxForce: number;
        maxTorque: number;
        constructor();
        Initialize(bA: any, bB: any, anchor: any): void;
    }
    class b2FrictionJoint extends b2Joint {
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
        constructor(def: any);
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_Cdot_v2;
        private static SolveVelocityConstraints_s_impulseV;
        private static SolveVelocityConstraints_s_oldImpulseV;
        SolveVelocityConstraints(data: any): void;
        SolvePositionConstraints(data: any): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: any, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: any): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetMaxForce(force: number): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: number): void;
        GetMaxTorque(): number;
        Dump(): void;
    }
}
declare module box2d {
    class b2RopeJointDef extends b2JointDef {
        localAnchorA: b2Vec2;
        localAnchorB: b2Vec2;
        maxLength: number;
        constructor();
    }
    class b2RopeJoint extends b2Joint {
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
        constructor(def: any);
        private static InitVelocityConstraints_s_P;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_vpA;
        private static SolveVelocityConstraints_s_vpB;
        private static SolveVelocityConstraints_s_P;
        SolveVelocityConstraints(data: any): void;
        private static SolvePositionConstraints_s_P;
        SolvePositionConstraints(data: any): boolean;
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        GetLocalAnchorA(): b2Vec2;
        GetLocalAnchorB(): b2Vec2;
        SetMaxLength(length: number): void;
        GetMaxLength(): number;
        GetLimitState(): b2LimitState;
        Dump(): void;
    }
}
declare module box2d {
    class b2MotorJointDef extends b2JointDef {
        linearOffset: b2Vec2;
        angularOffset: number;
        maxForce: number;
        maxTorque: number;
        correctionFactor: number;
        constructor();
        Initialize(bA: any, bB: any): void;
    }
    class b2MotorJoint extends b2Joint {
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
        constructor(def: any);
        GetAnchorA(): b2Vec2;
        GetAnchorB(): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        SetLinearOffset(linearOffset: any): void;
        GetLinearOffset(): b2Vec2;
        SetAngularOffset(angularOffset: any): void;
        GetAngularOffset(): number;
        SetMaxForce(force: any): void;
        GetMaxForce(): number;
        SetMaxTorque(torque: any): void;
        GetMaxTorque(): number;
        InitVelocityConstraints(data: any): void;
        private static SolveVelocityConstraints_s_Cdot_v2;
        private static SolveVelocityConstraints_s_impulse_v2;
        private static SolveVelocityConstraints_s_oldImpulse_v2;
        SolveVelocityConstraints(data: any): void;
        SolvePositionConstraints(data: any): boolean;
        Dump(): void;
    }
}
declare module box2d {
    class b2AreaJointDef extends b2JointDef {
        world: b2World;
        bodies: b2Body[];
        frequencyHz: number;
        dampingRatio: number;
        constructor();
        AddBody(body: any): void;
    }
    class b2AreaJoint extends b2Joint {
        m_bodies: b2Body[];
        m_frequencyHz: number;
        m_dampingRatio: number;
        m_impulse: number;
        m_targetLengths: any;
        m_targetArea: number;
        m_normals: any;
        m_joints: any;
        m_deltas: any;
        m_delta: any;
        constructor(def: any);
        GetAnchorA(out: b2Vec2): b2Vec2;
        GetAnchorB(out: b2Vec2): b2Vec2;
        GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2;
        GetReactionTorque(inv_dt: number): number;
        SetFrequency(hz: any): void;
        GetFrequency(): number;
        SetDampingRatio(ratio: any): void;
        GetDampingRatio(): number;
        Dump(): void;
        InitVelocityConstraints(data: any): void;
        SolveVelocityConstraints(data: any): void;
        SolvePositionConstraints(data: any): boolean;
    }
}
declare module box2d {
    class b2JointFactory {
        static Create(def: b2JointDef, allocator: any): b2Joint;
        static Destroy(joint: b2Joint, allocator: any): void;
    }
}
declare module box2d {
    class b2Controller {
        type: string;
        constructor();
    }
}
declare module box2d {
    enum b2WorldFlag {
        e_none = 0,
        e_newFixture = 1,
        e_locked = 2,
        e_clearForces = 4,
    }
    class b2World {
        m_flags: b2WorldFlag;
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
        Step(dt: number, velocityIterations: number, positionIterations: number): void;
        ClearForces(): void;
        private static DrawDebugData_s_color;
        private static DrawDebugData_s_vs;
        private static DrawDebugData_s_xf;
        DrawDebugData(): void;
        QueryAABB(callback: any, aabb: any): void;
        private static QueryShape_s_aabb;
        QueryShape(callback: any, shape: any, transform: any): void;
        private static QueryPoint_s_aabb;
        QueryPoint(callback: any, point: any): void;
        private static RayCast_s_input;
        private static RayCast_s_output;
        private static RayCast_s_point;
        RayCast(callback: any, point1: any, point2: any): void;
        RayCastOne(point1: any, point2: any): b2Fixture;
        RayCastAll(point1: any, point2: any, out: any): b2Fixture[];
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
        Dump(): void;
        private static DrawJoint_s_p1;
        private static DrawJoint_s_p2;
        private static DrawJoint_s_color;
        DrawJoint(joint: b2Joint): void;
        DrawShape(fixture: any, color: any): void;
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
declare module box2d {
    enum b2BodyType {
        b2_unknown = -1,
        b2_staticBody = 0,
        b2_kinematicBody = 1,
        b2_dynamicBody = 2,
    }
    class b2BodyDef {
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
    enum b2BodyFlag {
        e_none = 0,
        e_islandFlag = 1,
        e_awakeFlag = 2,
        e_autoSleepFlag = 4,
        e_bulletFlag = 8,
        e_fixedRotationFlag = 16,
        e_activeFlag = 32,
        e_toiFlag = 64,
    }
    class b2Body {
        m_type: b2BodyType;
        m_flags: b2BodyFlag;
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
        CreateFixture(def: b2FixtureDef): b2Fixture;
        private static CreateFixture2_s_def;
        CreateFixture2(shape: b2Shape, density?: number): b2Fixture;
        DestroyFixture(fixture: b2Fixture): void;
        SetTransformVecRadians(position: b2Vec2, angle: number): void;
        SetTransformXYRadians(x: number, y: number, angle: number): void;
        SetTransform(xf: b2Transform): void;
        GetTransform(): b2Transform;
        GetPosition(): b2Vec2;
        SetPosition(position: b2Vec2): void;
        SetPositionXY(x: number, y: number): void;
        GetAngleRadians(): number;
        SetAngleRadians(angle: number): void;
        GetWorldCenter(): b2Vec2;
        GetLocalCenter(): b2Vec2;
        SetLinearVelocity(v: b2Vec2): void;
        GetLinearVelocity(): b2Vec2;
        SetAngularVelocity(w: number): void;
        GetAngularVelocity(): number;
        GetDefinition(bd: b2BodyDef): b2BodyDef;
        ApplyForce(force: any, point: any, wake?: boolean): void;
        ApplyForceToCenter(force: any, wake?: boolean): void;
        ApplyTorque(torque: any, wake?: boolean): void;
        ApplyLinearImpulse(impulse: any, point: any, wake?: boolean): void;
        ApplyAngularImpulse(impulse: any, wake?: boolean): void;
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
        Dump(): void;
        private static SynchronizeFixtures_s_xf1;
        SynchronizeFixtures(): void;
        SynchronizeTransform(): void;
        ShouldCollide(other: b2Body): boolean;
        Advance(alpha: number): void;
    }
}
declare module box2d.Testbed {
    class DebugDraw extends b2Draw {
        m_canvas: HTMLCanvasElement;
        m_ctx: CanvasRenderingContext2D;
        m_settings: Settings;
        constructor(canvas: any, settings: any);
        PushTransform(xf: any): void;
        PopTransform(xf: any): void;
        DrawPolygon(vertices: any, vertexCount: any, color: any): void;
        DrawSolidPolygon(vertices: any, vertexCount: any, color: any): void;
        DrawCircle(center: any, radius: any, color: any): void;
        DrawSolidCircle(center: any, radius: any, axis: any, color: any): void;
        DrawSegment(p1: any, p2: any, color: any): void;
        DrawTransform(xf: any): void;
        DrawPoint(p: any, size: any, color: any): void;
        private static DrawString_s_color;
        DrawString(x: number, y: number, message: string): void;
        private static DrawStringWorld_s_p;
        private static DrawStringWorld_s_cc;
        private static DrawStringWorld_s_color;
        DrawStringWorld(x: number, y: number, message: string): void;
        DrawAABB(aabb: any, color: any): void;
    }
}
declare module box2d.Testbed {
    var DRAW_STRING_NEW_LINE: number;
    enum KeyCode {
        WIN_KEY_FF_LINUX = 0,
        MAC_ENTER = 3,
        BACKSPACE = 8,
        TAB = 9,
        NUM_CENTER = 12,
        ENTER = 13,
        SHIFT = 16,
        CTRL = 17,
        ALT = 18,
        PAUSE = 19,
        CAPS_LOCK = 20,
        ESC = 27,
        SPACE = 32,
        PAGE_UP = 33,
        PAGE_DOWN = 34,
        END = 35,
        HOME = 36,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        PRINT_SCREEN = 44,
        INSERT = 45,
        DELETE = 46,
        ZERO = 48,
        ONE = 49,
        TWO = 50,
        THREE = 51,
        FOUR = 52,
        FIVE = 53,
        SIX = 54,
        SEVEN = 55,
        EIGHT = 56,
        NINE = 57,
        FF_SEMICOLON = 59,
        FF_EQUALS = 61,
        QUESTION_MARK = 63,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        META = 91,
        WIN_KEY_RIGHT = 92,
        CONTEXT_MENU = 93,
        NUM_ZERO = 96,
        NUM_ONE = 97,
        NUM_TWO = 98,
        NUM_THREE = 99,
        NUM_FOUR = 100,
        NUM_FIVE = 101,
        NUM_SIX = 102,
        NUM_SEVEN = 103,
        NUM_EIGHT = 104,
        NUM_NINE = 105,
        NUM_MULTIPLY = 106,
        NUM_PLUS = 107,
        NUM_MINUS = 109,
        NUM_PERIOD = 110,
        NUM_DIVISION = 111,
        F1 = 112,
        F2 = 113,
        F3 = 114,
        F4 = 115,
        F5 = 116,
        F6 = 117,
        F7 = 118,
        F8 = 119,
        F9 = 120,
        F10 = 121,
        F11 = 122,
        F12 = 123,
        NUMLOCK = 144,
        SCROLL_LOCK = 145,
        FIRST_MEDIA_KEY = 166,
        LAST_MEDIA_KEY = 183,
        SEMICOLON = 186,
        DASH = 189,
        EQUALS = 187,
        COMMA = 188,
        PERIOD = 190,
        SLASH = 191,
        APOSTROPHE = 192,
        TILDE = 192,
        SINGLE_QUOTE = 222,
        OPEN_SQUARE_BRACKET = 219,
        BACKSLASH = 220,
        CLOSE_SQUARE_BRACKET = 221,
        WIN_KEY = 224,
        MAC_FF_META = 224,
        WIN_IME = 229,
        PHANTOM = 255,
    }
    class Settings {
        canvasScale: number;
        viewZoom: number;
        viewCenter: b2Vec2;
        viewRotation: b2Rot;
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
    class TestEntry {
        name: string;
        createFcn: (canvas: any, settings: any) => Test;
        constructor(name: string, createFcn: any);
    }
    class DestructionListener extends b2DestructionListener {
        test: Test;
        constructor(test: any);
        SayGoodbyeJoint(joint: any): void;
        SayGoodbyeFixture(fixture: any): void;
    }
    class ContactPoint {
        fixtureA: any;
        fixtureB: any;
        normal: b2Vec2;
        position: b2Vec2;
        state: b2PointState;
        normalImpulse: number;
        tangentImpulse: number;
    }
    class Test extends b2ContactListener {
        static k_maxContactPoints: number;
        m_world: b2World;
        m_bomb: b2Body;
        m_textLine: number;
        m_mouseJoint: b2MouseJoint;
        m_points: ContactPoint[];
        m_pointCount: number;
        m_destructionListener: DestructionListener;
        m_debugDraw: DebugDraw;
        m_bombSpawnPoint: b2Vec2;
        m_bombSpawning: boolean;
        m_mouseWorld: b2Vec2;
        m_stepCount: number;
        m_maxProfile: b2Profile;
        m_totalProfile: b2Profile;
        m_groundBody: b2Body;
        constructor(canvas: HTMLCanvasElement, settings: Settings);
        JointDestroyed(joint: any): void;
        BeginContact(contact: any): void;
        EndContact(contact: any): void;
        private static PreSolve_s_state1;
        private static PreSolve_s_state2;
        private static PreSolve_s_worldManifold;
        PreSolve(contact: any, oldManifold: any): void;
        PostSolve(contact: any, impulse: any): void;
        Keyboard(key: KeyCode): void;
        KeyboardUp(key: KeyCode): void;
        SetTextLine(line: any): void;
        DrawTitle(title: string): void;
        MouseDown(p: any): void;
        SpawnBomb(worldPt: any): void;
        CompleteBombSpawn(p: any): void;
        ShiftMouseDown(p: any): void;
        MouseUp(p: any): void;
        MouseMove(p: any): void;
        LaunchBomb(): void;
        LaunchBombAt(position: any, velocity: any): void;
        Step(settings: Settings): void;
        ShiftOrigin(newOrigin: any): void;
    }
}
declare module box2d.Testbed {
    class Car extends Test {
        m_car: b2Body;
        m_wheel1: b2Body;
        m_wheel2: b2Body;
        m_hz: number;
        m_zeta: number;
        m_speed: number;
        m_spring1: b2WheelJoint;
        m_spring2: b2WheelJoint;
        constructor(canvas: HTMLCanvasElement, settings: Settings);
        Keyboard(key: KeyCode): void;
        Step(settings: Settings): void;
        static Create(canvas: HTMLCanvasElement, settings: Settings): Test;
    }
}
declare module box2d.Testbed {
    class SphereStack extends Test {
        static e_count: number;
        m_bodies: b2Body[];
        constructor(canvas: HTMLCanvasElement, settings: Settings);
        Step(settings: Settings): void;
        static Create(canvas: HTMLCanvasElement, settings: Settings): Test;
    }
}
declare module box2d.Testbed {
    function GetTestEntries(entries: TestEntry[]): TestEntry[];
}
declare module box2d.Testbed {
    class Main {
        m_time_last: number;
        m_fps_time: number;
        m_fps_frames: number;
        m_fps: number;
        m_fps_div: any;
        m_debug_div: any;
        m_settings: Settings;
        m_test: Test;
        m_test_index: number;
        m_test_entries: Testbed.TestEntry[];
        m_shift: number;
        m_ctrl: number;
        m_rMouseDown: boolean;
        m_projection0: b2Vec2;
        m_viewCenter0: b2Vec2;
        m_demo_mode: boolean;
        m_demo_time: number;
        m_max_demo_time: number;
        m_canvas_div: any;
        m_canvas: HTMLCanvasElement;
        m_ctx: CanvasRenderingContext2D;
        m_demo_button: HTMLButtonElement;
        constructor();
        ConvertViewportToElement(viewport: b2Vec2, out: b2Vec2): b2Vec2;
        ConvertElementToViewport(element: b2Vec2, out: b2Vec2): b2Vec2;
        ConvertProjectionToViewport(projection: b2Vec2, out: b2Vec2): b2Vec2;
        ConvertViewportToProjection(viewport: b2Vec2, out: b2Vec2): b2Vec2;
        ConvertWorldToProjection(world: b2Vec2, out: b2Vec2): b2Vec2;
        ConvertProjectionToWorld(projection: b2Vec2, out: b2Vec2): b2Vec2;
        ConvertElementToWorld(element: b2Vec2, out: b2Vec2): b2Vec2;
        ConvertElementToProjection(element: b2Vec2, out: b2Vec2): b2Vec2;
        MoveCamera(move: b2Vec2): void;
        RollCamera(roll: number): void;
        ZoomCamera(zoom: number): void;
        HomeCamera(): void;
        HandleMouseMove(e: any): void;
        HandleMouseDown(e: any): void;
        HandleMouseUp(e: any): void;
        HandleTouchMove(e: any): void;
        HandleTouchStart(e: any): void;
        HandleTouchEnd(e: any): void;
        HandleMouseWheel(e: any): void;
        HandleKeyDown(e: any): void;
        HandleKeyUp(e: any): void;
        UpdateTest(time_elapsed: number): void;
        DecrementTest(): void;
        IncrementTest(): void;
        LoadTest(): void;
        Pause(): void;
        SingleStep(): void;
        ToggleDemo(): void;
        SimulationLoop(): void;
    }
}
declare function requestAnimFrame(callback: any): number;
declare module main {
    function start(): void;
}
/**
\mainpage Box2D API Documentation

\section intro_sec Getting Started

For documentation please see http://box2d.org/documentation.html

For discussion please visit http://box2d.org/forum
*/
declare module box2d {
}
