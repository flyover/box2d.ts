/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Common/b2Settings", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DEBUG, ENABLE_ASSERTS, b2_maxFloat, b2_epsilon, b2_epsilon_sq, b2_pi, b2_maxManifoldPoints, b2_maxPolygonVertices, b2_aabbExtension, b2_aabbMultiplier, b2_linearSlop, b2_angularSlop, b2_polygonRadius, b2_maxSubSteps, b2_maxTOIContacts, b2_velocityThreshold, b2_maxLinearCorrection, b2_maxAngularCorrection, b2_maxTranslation, b2_maxTranslationSquared, b2_maxRotation, b2_maxRotationSquared, b2_baumgarte, b2_toiBaumgarte, b2_timeToSleep, b2_linearSleepTolerance, b2_angularSleepTolerance, b2Version, b2_version, b2_changelist;
    function b2Assert(condition, ...args) {
        if (!condition) {
            debugger;
        }
    }
    exports_1("b2Assert", b2Assert);
    // Memory Allocation
    /// Implement this function to use your own memory allocator.
    function b2Alloc(size) {
        return null;
    }
    exports_1("b2Alloc", b2Alloc);
    /// If you implement b2Alloc, you should also implement this function.
    function b2Free(mem) {
    }
    exports_1("b2Free", b2Free);
    /// Logging function.
    function b2Log(message, ...args) {
        // const args = Array.prototype.slice.call(arguments);
        // const str = goog.string.format.apply(null, args.slice(0));
        // console.log(message);
    }
    exports_1("b2Log", b2Log);
    function b2ParseInt(v) {
        return parseInt(v, 10);
    }
    exports_1("b2ParseInt", b2ParseInt);
    function b2ParseUInt(v) {
        return Math.abs(parseInt(v, 10));
    }
    exports_1("b2ParseUInt", b2ParseUInt);
    function b2MakeArray(length, init) {
        let a = [];
        for (let i = 0; i < length; ++i) {
            a.push(init(i));
        }
        return a;
    }
    exports_1("b2MakeArray", b2MakeArray);
    function b2MakeNumberArray(length) {
        return b2MakeArray(length, function (i) { return 0; });
    }
    exports_1("b2MakeNumberArray", b2MakeNumberArray);
    return {
        setters:[],
        execute: function() {
            exports_1("DEBUG", DEBUG = false);
            exports_1("ENABLE_ASSERTS", ENABLE_ASSERTS = DEBUG);
            exports_1("b2_maxFloat", b2_maxFloat = 1E+37); // FLT_MAX instead of Number.MAX_VALUE;
            exports_1("b2_epsilon", b2_epsilon = 1E-5); // FLT_EPSILON instead of Number.MIN_VALUE;
            exports_1("b2_epsilon_sq", b2_epsilon_sq = (b2_epsilon * b2_epsilon));
            exports_1("b2_pi", b2_pi = 3.14159265359); // Math.PI;
            /// @file
            /// Global tuning constants based on meters-kilograms-seconds (MKS) units.
            ///
            // Collision
            /// The maximum number of contact points between two convex shapes. Do
            /// not change this value.
            exports_1("b2_maxManifoldPoints", b2_maxManifoldPoints = 2);
            /// The maximum number of vertices on a convex polygon. You cannot increase
            /// this too much because b2BlockAllocator has a maximum object size.
            exports_1("b2_maxPolygonVertices", b2_maxPolygonVertices = 8);
            /// This is used to fatten AABBs in the dynamic tree. This allows proxies
            /// to move by a small amount without triggering a tree adjustment.
            /// This is in meters.
            exports_1("b2_aabbExtension", b2_aabbExtension = 0.1);
            /// This is used to fatten AABBs in the dynamic tree. This is used to predict
            /// the future position based on the current displacement.
            /// This is a dimensionless multiplier.
            exports_1("b2_aabbMultiplier", b2_aabbMultiplier = 2);
            /// A small length used as a collision and constraint tolerance. Usually it is
            /// chosen to be numerically significant, but visually insignificant.
            exports_1("b2_linearSlop", b2_linearSlop = 0.008); // 0.005;
            /// A small angle used as a collision and constraint tolerance. Usually it is
            /// chosen to be numerically significant, but visually insignificant.
            exports_1("b2_angularSlop", b2_angularSlop = 2 / 180 * b2_pi);
            /// The radius of the polygon/edge shape skin. This should not be modified. Making
            /// this smaller means polygons will have an insufficient buffer for continuous collision.
            /// Making it larger may create artifacts for vertex collision.
            exports_1("b2_polygonRadius", b2_polygonRadius = 2 * b2_linearSlop);
            /// Maximum number of sub-steps per contact in continuous physics simulation.
            exports_1("b2_maxSubSteps", b2_maxSubSteps = 8);
            // Dynamics
            /// Maximum number of contacts to be handled to solve a TOI impact.
            exports_1("b2_maxTOIContacts", b2_maxTOIContacts = 32);
            /// A velocity threshold for elastic collisions. Any collision with a relative linear
            /// velocity below this threshold will be treated as inelastic.
            exports_1("b2_velocityThreshold", b2_velocityThreshold = 1);
            /// The maximum linear position correction used when solving constraints. This helps to
            /// prevent overshoot.
            exports_1("b2_maxLinearCorrection", b2_maxLinearCorrection = 0.2);
            /// The maximum angular position correction used when solving constraints. This helps to
            /// prevent overshoot.
            exports_1("b2_maxAngularCorrection", b2_maxAngularCorrection = 8 / 180 * b2_pi);
            /// The maximum linear velocity of a body. This limit is very large and is used
            /// to prevent numerical problems. You shouldn't need to adjust this.
            exports_1("b2_maxTranslation", b2_maxTranslation = 2);
            exports_1("b2_maxTranslationSquared", b2_maxTranslationSquared = b2_maxTranslation * b2_maxTranslation);
            /// The maximum angular velocity of a body. This limit is very large and is used
            /// to prevent numerical problems. You shouldn't need to adjust this.
            exports_1("b2_maxRotation", b2_maxRotation = 0.5 * b2_pi);
            exports_1("b2_maxRotationSquared", b2_maxRotationSquared = b2_maxRotation * b2_maxRotation);
            /// This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
            /// that overlap is removed in one time step. However using values close to 1 often lead
            /// to overshoot.
            exports_1("b2_baumgarte", b2_baumgarte = 0.2);
            exports_1("b2_toiBaumgarte", b2_toiBaumgarte = 0.75);
            // Sleep
            /// The time that a body must be still before it will go to sleep.
            exports_1("b2_timeToSleep", b2_timeToSleep = 0.5);
            /// A body cannot sleep if its linear velocity is above this tolerance.
            exports_1("b2_linearSleepTolerance", b2_linearSleepTolerance = 0.01);
            /// A body cannot sleep if its angular velocity is above this tolerance.
            exports_1("b2_angularSleepTolerance", b2_angularSleepTolerance = 2 / 180 * b2_pi);
            /// Version numbering scheme.
            /// See http://en.wikipedia.org/wiki/Software_versioning
            b2Version = class b2Version {
                constructor(major = 0, minor = 0, revision = 0) {
                    this.major = 0; ///< significant changes
                    this.minor = 0; ///< incremental changes
                    this.revision = 0; ///< bug fixes
                    this.major = major;
                    this.minor = minor;
                    this.revision = revision;
                }
                toString() {
                    return this.major + "." + this.minor + "." + this.revision;
                }
            };
            exports_1("b2Version", b2Version);
            /// Current version.
            exports_1("b2_version", b2_version = new b2Version(2, 3, 0));
            exports_1("b2_changelist", b2_changelist = 251);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Common/b2Math", ["Box2D/Common/b2Settings"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var b2Settings;
    var b2_pi_over_180, b2_180_over_pi, b2_two_pi, b2Vec2, b2Vec2_zero, b2Vec3, b2Mat22, b2Mat33, b2Rot, b2Transform, b2Sweep;
    function b2Abs(n) {
        return (n < 0) ? (-n) : (n);
    }
    exports_2("b2Abs", b2Abs);
    function b2Min(a, b) {
        return (a < b) ? (a) : (b);
    }
    exports_2("b2Min", b2Min);
    function b2Max(a, b) {
        return (a > b) ? (a) : (b);
    }
    exports_2("b2Max", b2Max);
    function b2Clamp(a, lo, hi) {
        return (a < lo) ? (lo) : ((a > hi) ? (hi) : (a));
    }
    exports_2("b2Clamp", b2Clamp);
    function b2Swap(a, b) {
        if (b2Settings.ENABLE_ASSERTS) {
            b2Settings.b2Assert(false);
        }
        const tmp = a[0];
        a[0] = b[0];
        b[0] = tmp;
    }
    exports_2("b2Swap", b2Swap);
    /// This function is used to ensure that a floating point number is
    /// not a NaN or infinity.
    function b2IsValid(n) {
        return isFinite(n);
    }
    exports_2("b2IsValid", b2IsValid);
    function b2Sq(n) {
        return n * n;
    }
    exports_2("b2Sq", b2Sq);
    /// This is a approximate yet fast inverse square-root.
    function b2InvSqrt(n) {
        return 1 / Math.sqrt(n);
    }
    exports_2("b2InvSqrt", b2InvSqrt);
    function b2Sqrt(n) {
        return Math.sqrt(n);
    }
    exports_2("b2Sqrt", b2Sqrt);
    function b2Pow(x, y) {
        return Math.pow(x, y);
    }
    exports_2("b2Pow", b2Pow);
    function b2DegToRad(degrees) {
        return degrees * b2_pi_over_180;
    }
    exports_2("b2DegToRad", b2DegToRad);
    function b2RadToDeg(radians) {
        return radians * b2_180_over_pi;
    }
    exports_2("b2RadToDeg", b2RadToDeg);
    function b2Cos(radians) {
        return Math.cos(radians);
    }
    exports_2("b2Cos", b2Cos);
    function b2Sin(radians) {
        return Math.sin(radians);
    }
    exports_2("b2Sin", b2Sin);
    function b2Acos(n) {
        return Math.acos(n);
    }
    exports_2("b2Acos", b2Acos);
    function b2Asin(n) {
        return Math.asin(n);
    }
    exports_2("b2Asin", b2Asin);
    function b2Atan2(y, x) {
        return Math.atan2(y, x);
    }
    exports_2("b2Atan2", b2Atan2);
    function b2NextPowerOfTwo(x) {
        x |= (x >> 1) & 0x7FFFFFFF;
        x |= (x >> 2) & 0x3FFFFFFF;
        x |= (x >> 4) & 0x0FFFFFFF;
        x |= (x >> 8) & 0x00FFFFFF;
        x |= (x >> 16) & 0x0000FFFF;
        return x + 1;
    }
    exports_2("b2NextPowerOfTwo", b2NextPowerOfTwo);
    function b2IsPowerOfTwo(x) {
        return x > 0 && (x & (x - 1)) === 0;
    }
    exports_2("b2IsPowerOfTwo", b2IsPowerOfTwo);
    function b2Random() {
        return Math.random() * 2 - 1;
    }
    exports_2("b2Random", b2Random);
    function b2RandomRange(lo, hi) {
        return (hi - lo) * Math.random() + lo;
    }
    exports_2("b2RandomRange", b2RandomRange);
    function b2AbsV(v, out) {
        out.x = b2Abs(v.x);
        out.y = b2Abs(v.y);
        return out;
    }
    function b2MinV(a, b, out) {
        out.x = b2Min(a.x, b.x);
        out.y = b2Min(a.y, b.y);
        return out;
    }
    function b2MaxV(a, b, out) {
        out.x = b2Max(a.x, b.x);
        out.y = b2Max(a.y, b.y);
        return out;
    }
    function b2ClampV(v, lo, hi, out) {
        out.x = b2Clamp(v.x, lo.x, hi.x);
        out.y = b2Clamp(v.y, lo.y, hi.y);
        return out;
    }
    function b2RotateV(v, radians, out) {
        const v_x = v.x, v_y = v.y;
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        out.x = c * v_x - s * v_y;
        out.y = s * v_x + c * v_y;
        return out;
    }
    function b2DotVV(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    function b2CrossVV(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    function b2CrossVS(v, s, out) {
        const v_x = v.x;
        out.x = s * v.y;
        out.y = -s * v_x;
        return out;
    }
    function b2CrossVOne(v, out) {
        const v_x = v.x;
        out.x = v.y;
        out.y = -v_x;
        return out;
    }
    function b2CrossSV(s, v, out) {
        const v_x = v.x;
        out.x = -s * v.y;
        out.y = s * v_x;
        return out;
    }
    function b2CrossOneV(v, out) {
        const v_x = v.x;
        out.x = -v.y;
        out.y = v_x;
        return out;
    }
    function b2AddVV(a, b, out) { out.x = a.x + b.x; out.y = a.y + b.y; return out; }
    function b2SubVV(a, b, out) { out.x = a.x - b.x; out.y = a.y - b.y; return out; }
    function b2MulSV(s, v, out) { out.x = v.x * s; out.y = v.y * s; return out; }
    function b2AddVMulSV(a, s, b, out) { out.x = a.x + (s * b.x); out.y = a.y + (s * b.y); return out; }
    function b2SubVMulSV(a, s, b, out) { out.x = a.x - (s * b.x); out.y = a.y - (s * b.y); return out; }
    function b2AddVCrossSV(a, s, v, out) {
        const v_x = v.x;
        out.x = a.x - (s * v.y);
        out.y = a.y + (s * v_x);
        return out;
    }
    function b2MidVV(a, b, out) { out.x = (a.x + b.x) * 0.5; out.y = (a.y + b.y) * 0.5; return out; }
    function b2ExtVV(a, b, out) { out.x = (b.x - a.x) * 0.5; out.y = (b.y - a.y) * 0.5; return out; }
    function b2IsEqualToV(a, b) {
        return a.x === b.x && a.y === b.y;
    }
    function b2DistanceVV(a, b) {
        const c_x = a.x - b.x;
        const c_y = a.y - b.y;
        return Math.sqrt(c_x * c_x + c_y * c_y);
    }
    function b2DistanceSquaredVV(a, b) {
        const c_x = a.x - b.x;
        const c_y = a.y - b.y;
        return (c_x * c_x + c_y * c_y);
    }
    function b2NegV(v, out) { out.x = -v.x; out.y = -v.y; return out; }
    function b2DotV3V3(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    function b2CrossV3V3(a, b, out) {
        const a_x = a.x, a_y = a.y, a_z = a.z;
        const b_x = b.x, b_y = b.y, b_z = b.z;
        out.x = a_y * b_z - a_z * b_y;
        out.y = a_z * b_x - a_x * b_z;
        out.z = a_x * b_y - a_y * b_x;
        return out;
    }
    function b2AbsM(M, out) {
        const M_ex = M.ex, M_ey = M.ey;
        out.ex.x = b2Abs(M_ex.x);
        out.ex.y = b2Abs(M_ex.y);
        out.ey.x = b2Abs(M_ey.x);
        out.ey.y = b2Abs(M_ey.y);
        return out;
    }
    function b2MulMV(M, v, out) {
        const M_ex = M.ex, M_ey = M.ey;
        const v_x = v.x, v_y = v.y;
        out.x = M_ex.x * v_x + M_ey.x * v_y;
        out.y = M_ex.y * v_x + M_ey.y * v_y;
        return out;
    }
    function b2MulTMV(M, v, out) {
        const M_ex = M.ex, M_ey = M.ey;
        const v_x = v.x, v_y = v.y;
        out.x = M_ex.x * v_x + M_ex.y * v_y;
        out.y = M_ey.x * v_x + M_ey.y * v_y;
        return out;
    }
    function b2AddMM(A, B, out) {
        const A_ex = A.ex, A_ey = A.ey;
        const B_ex = B.ex, B_ey = B.ey;
        out.ex.x = A_ex.x + B_ex.x;
        out.ex.y = A_ex.y + B_ex.y;
        out.ey.x = A_ey.x + B_ey.x;
        out.ey.y = A_ey.y + B_ey.y;
        return out;
    }
    function b2MulMM(A, B, out) {
        const A_ex_x = A.ex.x, A_ex_y = A.ex.y;
        const A_ey_x = A.ey.x, A_ey_y = A.ey.y;
        const B_ex_x = B.ex.x, B_ex_y = B.ex.y;
        const B_ey_x = B.ey.x, B_ey_y = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ey_x * B_ex_y;
        out.ex.y = A_ex_y * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ey_x * B_ey_y;
        out.ey.y = A_ex_y * B_ey_x + A_ey_y * B_ey_y;
        return out;
    }
    function b2MulTMM(A, B, out) {
        const A_ex_x = A.ex.x, A_ex_y = A.ex.y;
        const A_ey_x = A.ey.x, A_ey_y = A.ey.y;
        const B_ex_x = B.ex.x, B_ex_y = B.ex.y;
        const B_ey_x = B.ey.x, B_ey_y = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ex_y * B_ex_y;
        out.ex.y = A_ey_x * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ex_y * B_ey_y;
        out.ey.y = A_ey_x * B_ey_x + A_ey_y * B_ey_y;
        return out;
    }
    function b2MulM33V3(A, v, out) {
        const v_x = v.x, v_y = v.y, v_z = v.z;
        out.x = A.ex.x * v_x + A.ey.x * v_y + A.ez.x * v_z;
        out.y = A.ex.y * v_x + A.ey.y * v_y + A.ez.y * v_z;
        out.z = A.ex.z * v_x + A.ey.z * v_y + A.ez.z * v_z;
        return out;
    }
    function b2MulM33XYZ(A, x, y, z, out) {
        out.x = A.ex.x * x + A.ey.x * y + A.ez.x * z;
        out.y = A.ex.y * x + A.ey.y * y + A.ez.y * z;
        out.z = A.ex.z * x + A.ey.z * y + A.ez.z * z;
        return out;
    }
    function b2MulM33V2(A, v, out) {
        const v_x = v.x, v_y = v.y;
        out.x = A.ex.x * v_x + A.ey.x * v_y;
        out.y = A.ex.y * v_x + A.ey.y * v_y;
        return out;
    }
    function b2MulM33XY(A, x, y, out) {
        out.x = A.ex.x * x + A.ey.x * y;
        out.y = A.ex.y * x + A.ey.y * y;
        return out;
    }
    function b2MulRR(q, r, out) {
        // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
        // [qs  qc]   [rs  rc]   [qs*rc+qc*rs -qs*rs+qc*rc]
        // s = qs * rc + qc * rs
        // c = qc * rc - qs * rs
        const q_c = q.c, q_s = q.s;
        const r_c = r.c, r_s = r.s;
        out.s = q_s * r_c + q_c * r_s;
        out.c = q_c * r_c - q_s * r_s;
        return out;
    }
    function b2MulTRR(q, r, out) {
        // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
        // [-qs qc]   [rs  rc]   [-qs*rc+qc*rs qs*rs+qc*rc]
        // s = qc * rs - qs * rc
        // c = qc * rc + qs * rs
        const q_c = q.c, q_s = q.s;
        const r_c = r.c, r_s = r.s;
        out.s = q_c * r_s - q_s * r_c;
        out.c = q_c * r_c + q_s * r_s;
        return out;
    }
    function b2MulRV(q, v, out) {
        const q_c = q.c, q_s = q.s;
        const v_x = v.x, v_y = v.y;
        out.x = q_c * v_x - q_s * v_y;
        out.y = q_s * v_x + q_c * v_y;
        return out;
    }
    function b2MulTRV(q, v, out) {
        const q_c = q.c, q_s = q.s;
        const v_x = v.x, v_y = v.y;
        out.x = q_c * v_x + q_s * v_y;
        out.y = -q_s * v_x + q_c * v_y;
        return out;
    }
    function b2MulXV(T, v, out) {
        //  float32 x = (T.q.c * v.x - T.q.s * v.y) + T.p.x;
        //  float32 y = (T.q.s * v.x + T.q.c * v.y) + T.p.y;
        //
        //  return b2Vec2(x, y);
        const T_q_c = T.q.c, T_q_s = T.q.s;
        const v_x = v.x, v_y = v.y;
        out.x = (T_q_c * v_x - T_q_s * v_y) + T.p.x;
        out.y = (T_q_s * v_x + T_q_c * v_y) + T.p.y;
        return out;
    }
    function b2MulTXV(T, v, out) {
        //  float32 px = v.x - T.p.x;
        //  float32 py = v.y - T.p.y;
        //  float32 x = (T.q.c * px + T.q.s * py);
        //  float32 y = (-T.q.s * px + T.q.c * py);
        //
        //  return b2Vec2(x, y);
        const T_q_c = T.q.c, T_q_s = T.q.s;
        const p_x = v.x - T.p.x;
        const p_y = v.y - T.p.y;
        out.x = (T_q_c * p_x + T_q_s * p_y);
        out.y = (-T_q_s * p_x + T_q_c * p_y);
        return out;
    }
    function b2MulXX(A, B, out) {
        b2MulRR(A.q, B.q, out.q);
        b2AddVV(b2MulRV(A.q, B.p, out.p), A.p, out.p);
        return out;
    }
    function b2MulTXX(A, B, out) {
        b2MulTRR(A.q, B.q, out.q);
        b2MulTRV(A.q, b2SubVV(B.p, A.p, out.p), out.p);
        return out;
    }
    return {
        setters:[
            function (b2Settings_1) {
                b2Settings = b2Settings_1;
            }],
        execute: function() {
            exports_2("b2_pi_over_180", b2_pi_over_180 = b2Settings.b2_pi / 180);
            exports_2("b2_180_over_pi", b2_180_over_pi = 180 / b2Settings.b2_pi);
            exports_2("b2_two_pi", b2_two_pi = 2 * b2Settings.b2_pi);
            /// A 2D column vector.
            b2Vec2 = class b2Vec2 {
                constructor(x = 0, y = 0) {
                    this.x = x;
                    this.y = y;
                }
                Clone() {
                    return new b2Vec2(this.x, this.y);
                }
                SetZero() {
                    this.x = 0;
                    this.y = 0;
                    return this;
                }
                SetXY(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                Copy(other) {
                    // if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(this !== other); }
                    this.x = other.x;
                    this.y = other.y;
                    return this;
                }
                SelfAdd(v) {
                    this.x += v.x;
                    this.y += v.y;
                    return this;
                }
                SelfAddXY(x, y) {
                    this.x += x;
                    this.y += y;
                    return this;
                }
                SelfSub(v) {
                    this.x -= v.x;
                    this.y -= v.y;
                    return this;
                }
                SelfSubXY(x, y) {
                    this.x -= x;
                    this.y -= y;
                    return this;
                }
                SelfMul(s) {
                    this.x *= s;
                    this.y *= s;
                    return this;
                }
                SelfMulAdd(s, v) {
                    this.x += s * v.x;
                    this.y += s * v.y;
                    return this;
                }
                SelfMulSub(s, v) {
                    this.x -= s * v.x;
                    this.y -= s * v.y;
                    return this;
                }
                Dot(v) {
                    return this.x * v.x + this.y * v.y;
                }
                Cross(v) {
                    return this.x * v.y - this.y * v.x;
                }
                GetLength() {
                    const x = this.x, y = this.y;
                    return Math.sqrt(x * x + y * y);
                }
                GetLengthSquared() {
                    const x = this.x, y = this.y;
                    return (x * x + y * y);
                }
                Normalize() {
                    const length = this.GetLength();
                    if (length >= b2Settings.b2_epsilon) {
                        const inv_length = 1 / length;
                        this.x *= inv_length;
                        this.y *= inv_length;
                    }
                    return length;
                }
                SelfNormalize() {
                    const length = this.GetLength();
                    if (length >= b2Settings.b2_epsilon) {
                        const inv_length = 1 / length;
                        this.x *= inv_length;
                        this.y *= inv_length;
                    }
                    return this;
                }
                SelfRotate(radians) {
                    const c = Math.cos(radians);
                    const s = Math.sin(radians);
                    const x = this.x;
                    this.x = c * x - s * this.y;
                    this.y = s * x + c * this.y;
                    return this;
                }
                IsValid() {
                    return isFinite(this.x) && isFinite(this.y);
                }
                SelfCrossVS(s) {
                    const x = this.x;
                    this.x = s * this.y;
                    this.y = -s * x;
                    return this;
                }
                SelfCrossSV(s) {
                    const x = this.x;
                    this.x = -s * this.y;
                    this.y = s * x;
                    return this;
                }
                SelfMinV(v) {
                    this.x = b2Min(this.x, v.x);
                    this.y = b2Min(this.y, v.y);
                    return this;
                }
                SelfMaxV(v) {
                    this.x = b2Max(this.x, v.x);
                    this.y = b2Max(this.y, v.y);
                    return this;
                }
                SelfAbs() {
                    this.x = b2Abs(this.x);
                    this.y = b2Abs(this.y);
                    return this;
                }
                SelfNeg() {
                    this.x = (-this.x);
                    this.y = (-this.y);
                    return this;
                }
                SelfSkew() {
                    const x = this.x;
                    this.x = -this.y;
                    this.y = x;
                    return this;
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2Vec2(); });
                }
                static AbsV(v, out) { return b2AbsV(v, out); }
                static MinV(a, b, out) { return b2MinV(a, b, out); }
                static MaxV(a, b, out) { return b2MaxV(a, b, out); }
                static ClampV(v, lo, hi, out) { return b2ClampV(v, lo, hi, out); }
                static RotateV(v, radians, out) { return b2RotateV(v, radians, out); }
                static DotVV(a, b) { return b2DotVV(a, b); }
                static CrossVV(a, b) { return b2CrossVV(a, b); }
                static CrossVS(v, s, out) { return b2CrossVS(v, s, out); }
                static CrossVOne(v, out) { return b2CrossVOne(v, out); }
                static CrossSV(s, v, out) { return b2CrossSV(s, v, out); }
                static CrossOneV(v, out) { return b2CrossOneV(v, out); }
                static AddVV(a, b, out) { return b2AddVV(a, b, out); }
                static SubVV(a, b, out) { return b2SubVV(a, b, out); }
                static MulSV(s, v, out) { return b2MulSV(s, v, out); }
                static AddVMulSV(a, s, b, out) { return b2AddVMulSV(a, s, b, out); }
                static SubVMulSV(a, s, b, out) { return b2SubVMulSV(a, s, b, out); }
                static AddVCrossSV(a, s, v, out) { return b2AddVCrossSV(a, s, v, out); }
                static MidVV(a, b, out) { return b2MidVV(a, b, out); }
                static ExtVV(a, b, out) { return b2ExtVV(a, b, out); }
                static IsEqualToV(a, b) { return b2IsEqualToV(a, b); }
                static DistanceVV(a, b) { return b2DistanceVV(a, b); }
                static DistanceSquaredVV(a, b) { return b2DistanceSquaredVV(a, b); }
                static NegV(v, out) { return b2NegV(v, out); }
            };
            b2Vec2.ZERO = new b2Vec2(0, 0);
            b2Vec2.UNITX = new b2Vec2(1, 0);
            b2Vec2.UNITY = new b2Vec2(0, 1);
            b2Vec2.s_t0 = new b2Vec2();
            b2Vec2.s_t1 = new b2Vec2();
            b2Vec2.s_t2 = new b2Vec2();
            b2Vec2.s_t3 = new b2Vec2();
            exports_2("b2Vec2", b2Vec2);
            exports_2("b2Vec2_zero", b2Vec2_zero = new b2Vec2(0, 0));
            /// A 2D column vector with 3 elements.
            b2Vec3 = class b2Vec3 {
                constructor(x = 0, y = 0, z = 0) {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                }
                Clone() {
                    return new b2Vec3(this.x, this.y, this.z);
                }
                SetZero() {
                    this.x = 0;
                    this.y = 0;
                    this.z = 0;
                    return this;
                }
                SetXYZ(x, y, z) {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    return this;
                }
                Copy(other) {
                    // if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(this !== other); }
                    this.x = other.x;
                    this.y = other.y;
                    this.z = other.z;
                    return this;
                }
                SelfNeg() {
                    this.x = (-this.x);
                    this.y = (-this.y);
                    this.z = (-this.z);
                    return this;
                }
                SelfAdd(v) {
                    this.x += v.x;
                    this.y += v.y;
                    this.z += v.z;
                    return this;
                }
                SelfAddXYZ(x, y, z) {
                    this.x += x;
                    this.y += y;
                    this.z += z;
                    return this;
                }
                SelfSub(v) {
                    this.x -= v.x;
                    this.y -= v.y;
                    this.z -= v.z;
                    return this;
                }
                SelfSubXYZ(x, y, z) {
                    this.x -= x;
                    this.y -= y;
                    this.z -= z;
                    return this;
                }
                SelfMul(s) {
                    this.x *= s;
                    this.y *= s;
                    this.z *= s;
                    return this;
                }
                static DotV3V3(a, b) { return b2DotV3V3(a, b); }
                static CrossV3V3(a, b, out) { return b2CrossV3V3(a, b, out); }
            };
            b2Vec3.ZERO = new b2Vec3(0, 0, 0);
            b2Vec3.s_t0 = new b2Vec3();
            exports_2("b2Vec3", b2Vec3);
            /// A 2-by-2 matrix. Stored in column-major order.
            b2Mat22 = class b2Mat22 {
                constructor() {
                    this.ex = new b2Vec2(1, 0);
                    this.ey = new b2Vec2(0, 1);
                }
                Clone() {
                    return new b2Mat22().Copy(this);
                }
                static FromVV(c1, c2) {
                    return new b2Mat22().SetVV(c1, c2);
                }
                static FromSSSS(r1c1, r1c2, r2c1, r2c2) {
                    return new b2Mat22().SetSSSS(r1c1, r1c2, r2c1, r2c2);
                }
                static FromAngleRadians(radians) {
                    return new b2Mat22().SetAngleRadians(radians);
                }
                SetSSSS(r1c1, r1c2, r2c1, r2c2) {
                    this.ex.SetXY(r1c1, r2c1);
                    this.ey.SetXY(r1c2, r2c2);
                    return this;
                }
                SetVV(c1, c2) {
                    this.ex.Copy(c1);
                    this.ey.Copy(c2);
                    return this;
                }
                SetAngleRadians(radians) {
                    const c = Math.cos(radians);
                    const s = Math.sin(radians);
                    this.ex.SetXY(c, s);
                    this.ey.SetXY(-s, c);
                    return this;
                }
                Copy(other) {
                    // if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(this !== other); }
                    this.ex.Copy(other.ex);
                    this.ey.Copy(other.ey);
                    return this;
                }
                SetIdentity() {
                    this.ex.SetXY(1, 0);
                    this.ey.SetXY(0, 1);
                    return this;
                }
                SetZero() {
                    this.ex.SetZero();
                    this.ey.SetZero();
                    return this;
                }
                GetAngleRadians() {
                    return Math.atan2(this.ex.y, this.ex.x);
                }
                GetInverse(out) {
                    const a = this.ex.x;
                    const b = this.ey.x;
                    const c = this.ex.y;
                    const d = this.ey.y;
                    let det = a * d - b * c;
                    if (det !== 0) {
                        det = 1 / det;
                    }
                    out.ex.x = det * d;
                    out.ey.x = (-det * b);
                    out.ex.y = (-det * c);
                    out.ey.y = det * a;
                    return out;
                }
                Solve(b_x, b_y, out) {
                    const a11 = this.ex.x, a12 = this.ey.x;
                    const a21 = this.ex.y, a22 = this.ey.y;
                    let det = a11 * a22 - a12 * a21;
                    if (det !== 0) {
                        det = 1 / det;
                    }
                    out.x = det * (a22 * b_x - a12 * b_y);
                    out.y = det * (a11 * b_y - a21 * b_x);
                    return out;
                }
                SelfAbs() {
                    this.ex.SelfAbs();
                    this.ey.SelfAbs();
                    return this;
                }
                SelfInv() {
                    return this.GetInverse(this);
                }
                SelfAddM(M) {
                    this.ex.SelfAdd(M.ex);
                    this.ey.SelfAdd(M.ey);
                    return this;
                }
                SelfSubM(M) {
                    this.ex.SelfSub(M.ex);
                    this.ey.SelfSub(M.ey);
                    return this;
                }
                static AbsM(M, out) { return b2AbsM(M, out); }
                static MulMV(M, v, out) { return b2MulMV(M, v, out); }
                static MulTMV(M, v, out) { return b2MulTMV(M, v, out); }
                static AddMM(A, B, out) { return b2AddMM(A, B, out); }
                static MulMM(A, B, out) { return b2MulMM(A, B, out); }
                static MulTMM(A, B, out) { return b2MulTMM(A, B, out); }
            };
            b2Mat22.IDENTITY = new b2Mat22();
            exports_2("b2Mat22", b2Mat22);
            /// A 3-by-3 matrix. Stored in column-major order.
            b2Mat33 = class b2Mat33 {
                constructor() {
                    this.ex = new b2Vec3(1, 0, 0);
                    this.ey = new b2Vec3(0, 1, 0);
                    this.ez = new b2Vec3(0, 0, 1);
                }
                Clone() {
                    return new b2Mat33().Copy(this);
                }
                SetVVV(c1, c2, c3) {
                    this.ex.Copy(c1);
                    this.ey.Copy(c2);
                    this.ez.Copy(c3);
                    return this;
                }
                Copy(other) {
                    // if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(this !== other); }
                    this.ex.Copy(other.ex);
                    this.ey.Copy(other.ey);
                    this.ez.Copy(other.ez);
                    return this;
                }
                SetIdentity() {
                    this.ex.SetXYZ(1, 0, 0);
                    this.ey.SetXYZ(0, 1, 0);
                    this.ez.SetXYZ(0, 0, 1);
                    return this;
                }
                SetZero() {
                    this.ex.SetZero();
                    this.ey.SetZero();
                    this.ez.SetZero();
                    return this;
                }
                SelfAddM(M) {
                    this.ex.SelfAdd(M.ex);
                    this.ey.SelfAdd(M.ey);
                    this.ez.SelfAdd(M.ez);
                    return this;
                }
                Solve33(b_x, b_y, b_z, out) {
                    const a11 = this.ex.x, a21 = this.ex.y, a31 = this.ex.z;
                    const a12 = this.ey.x, a22 = this.ey.y, a32 = this.ey.z;
                    const a13 = this.ez.x, a23 = this.ez.y, a33 = this.ez.z;
                    let det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
                    if (det !== 0) {
                        det = 1 / det;
                    }
                    out.x = det * (b_x * (a22 * a33 - a32 * a23) + b_y * (a32 * a13 - a12 * a33) + b_z * (a12 * a23 - a22 * a13));
                    out.y = det * (a11 * (b_y * a33 - b_z * a23) + a21 * (b_z * a13 - b_x * a33) + a31 * (b_x * a23 - b_y * a13));
                    out.z = det * (a11 * (a22 * b_z - a32 * b_y) + a21 * (a32 * b_x - a12 * b_z) + a31 * (a12 * b_y - a22 * b_x));
                    return out;
                }
                Solve22(b_x, b_y, out) {
                    const a11 = this.ex.x, a12 = this.ey.x;
                    const a21 = this.ex.y, a22 = this.ey.y;
                    let det = a11 * a22 - a12 * a21;
                    if (det !== 0) {
                        det = 1 / det;
                    }
                    out.x = det * (a22 * b_x - a12 * b_y);
                    out.y = det * (a11 * b_y - a21 * b_x);
                    return out;
                }
                GetInverse22(M) {
                    const a = this.ex.x, b = this.ey.x, c = this.ex.y, d = this.ey.y;
                    let det = a * d - b * c;
                    if (det !== 0) {
                        det = 1 / det;
                    }
                    M.ex.x = det * d;
                    M.ey.x = -det * b;
                    M.ex.z = 0;
                    M.ex.y = -det * c;
                    M.ey.y = det * a;
                    M.ey.z = 0;
                    M.ez.x = 0;
                    M.ez.y = 0;
                    M.ez.z = 0;
                }
                GetSymInverse33(M) {
                    let det = b2DotV3V3(this.ex, b2CrossV3V3(this.ey, this.ez, b2Vec3.s_t0));
                    if (det !== 0) {
                        det = 1 / det;
                    }
                    const a11 = this.ex.x, a12 = this.ey.x, a13 = this.ez.x;
                    const a22 = this.ey.y, a23 = this.ez.y;
                    const a33 = this.ez.z;
                    M.ex.x = det * (a22 * a33 - a23 * a23);
                    M.ex.y = det * (a13 * a23 - a12 * a33);
                    M.ex.z = det * (a12 * a23 - a13 * a22);
                    M.ey.x = M.ex.y;
                    M.ey.y = det * (a11 * a33 - a13 * a13);
                    M.ey.z = det * (a13 * a12 - a11 * a23);
                    M.ez.x = M.ex.z;
                    M.ez.y = M.ey.z;
                    M.ez.z = det * (a11 * a22 - a12 * a12);
                }
                static MulM33V3(A, v, out) { return b2MulM33V3(A, v, out); }
                static MulM33XYZ(A, x, y, z, out) { return b2MulM33XYZ(A, x, y, z, out); }
                static MulM33V2(A, v, out) { return b2MulM33V2(A, v, out); }
                static MulM33XY(A, x, y, out) { return b2MulM33XY(A, x, y, out); }
            };
            b2Mat33.IDENTITY = new b2Mat33();
            exports_2("b2Mat33", b2Mat33);
            /// Rotation
            b2Rot = class b2Rot {
                constructor(angle = 0) {
                    this.s = 0;
                    this.c = 1;
                    if (angle) {
                        this.s = Math.sin(angle);
                        this.c = Math.cos(angle);
                    }
                }
                Clone() {
                    return new b2Rot().Copy(this);
                }
                Copy(other) {
                    this.s = other.s;
                    this.c = other.c;
                    return this;
                }
                SetAngleRadians(angle) {
                    this.s = Math.sin(angle);
                    this.c = Math.cos(angle);
                    return this;
                }
                SetIdentity() {
                    this.s = 0;
                    this.c = 1;
                    return this;
                }
                GetAngleRadians() {
                    return Math.atan2(this.s, this.c);
                }
                GetXAxis(out) {
                    out.x = this.c;
                    out.y = this.s;
                    return out;
                }
                GetYAxis(out) {
                    out.x = -this.s;
                    out.y = this.c;
                    return out;
                }
                static MulRR(q, r, out) { return b2MulRR(q, r, out); }
                static MulTRR(q, r, out) { return b2MulTRR(q, r, out); }
                static MulRV(q, v, out) { return b2MulRV(q, v, out); }
                static MulTRV(q, v, out) { return b2MulTRV(q, v, out); }
            };
            b2Rot.IDENTITY = new b2Rot();
            exports_2("b2Rot", b2Rot);
            /// A transform contains translation and rotation. It is used to represent
            /// the position and orientation of rigid frames.
            b2Transform = class b2Transform {
                constructor() {
                    this.p = new b2Vec2();
                    this.q = new b2Rot();
                }
                Clone() {
                    return new b2Transform().Copy(this);
                }
                Copy(other) {
                    // if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(this !== other); }
                    this.p.Copy(other.p);
                    this.q.Copy(other.q);
                    return this;
                }
                SetIdentity() {
                    this.p.SetZero();
                    this.q.SetIdentity();
                    return this;
                }
                SetPositionRotation(position, q) {
                    this.p.Copy(position);
                    this.q.Copy(q);
                    return this;
                }
                SetPositionAngleRadians(pos, a) {
                    this.p.Copy(pos);
                    this.q.SetAngleRadians(a);
                    return this;
                }
                SetPosition(position) {
                    this.p.Copy(position);
                    return this;
                }
                SetPositionXY(x, y) {
                    this.p.SetXY(x, y);
                    return this;
                }
                SetRotation(rotation) {
                    this.q.Copy(rotation);
                    return this;
                }
                SetRotationAngleRadians(radians) {
                    this.q.SetAngleRadians(radians);
                    return this;
                }
                GetPosition() {
                    return this.p;
                }
                GetRotation() {
                    return this.q;
                }
                GetRotationAngleRadians() {
                    return this.q.GetAngleRadians();
                }
                GetAngleRadians() {
                    return this.q.GetAngleRadians();
                }
                static MulXV(T, v, out) { return b2MulXV(T, v, out); }
                static MulTXV(T, v, out) { return b2MulTXV(T, v, out); }
                static MulXX(A, B, out) { return b2MulXX(A, B, out); }
                static MulTXX(A, B, out) { return b2MulTXX(A, B, out); }
            };
            b2Transform.IDENTITY = new b2Transform();
            exports_2("b2Transform", b2Transform);
            /// This describes the motion of a body/shape for TOI computation.
            /// Shapes are defined with respect to the body origin, which may
            /// no coincide with the center of mass. However, to support dynamics
            /// we must interpolate the center of mass position.
            b2Sweep = class b2Sweep {
                constructor() {
                    this.localCenter = new b2Vec2();
                    this.c0 = new b2Vec2();
                    this.c = new b2Vec2();
                    this.a0 = 0;
                    this.a = 0;
                    this.alpha0 = 0;
                }
                Clone() {
                    return new b2Sweep().Copy(this);
                }
                Copy(other) {
                    // if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(this !== other); }
                    this.localCenter.Copy(other.localCenter);
                    this.c0.Copy(other.c0);
                    this.c.Copy(other.c);
                    this.a0 = other.a0;
                    this.a = other.a;
                    this.alpha0 = other.alpha0;
                    return this;
                }
                GetTransform(xf, beta) {
                    const one_minus_beta = (1 - beta);
                    xf.p.x = one_minus_beta * this.c0.x + beta * this.c.x;
                    xf.p.y = one_minus_beta * this.c0.y + beta * this.c.y;
                    const angle = one_minus_beta * this.a0 + beta * this.a;
                    xf.q.SetAngleRadians(angle);
                    xf.p.SelfSub(b2MulRV(xf.q, this.localCenter, b2Vec2.s_t0));
                    return xf;
                }
                Advance(alpha) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.alpha0 < 1);
                    }
                    const beta = (alpha - this.alpha0) / (1 - this.alpha0);
                    const one_minus_beta = (1 - beta);
                    this.c0.x = one_minus_beta * this.c0.x + beta * this.c.x;
                    this.c0.y = one_minus_beta * this.c0.y + beta * this.c.y;
                    this.a0 = one_minus_beta * this.a0 + beta * this.a;
                    this.alpha0 = alpha;
                }
                Normalize() {
                    const d = b2_two_pi * Math.floor(this.a0 / b2_two_pi);
                    this.a0 -= d;
                    this.a -= d;
                }
            };
            exports_2("b2Sweep", b2Sweep);
        }
    }
});
/*
* Copyright (c) 2011 Erin Catto http://box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Common/b2Timer", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var b2Timer, b2Counter;
    return {
        setters:[],
        execute: function() {
            /// Timer for profiling. This has platform specific code and may
            /// not work on every platform.
            b2Timer = class b2Timer {
                constructor() {
                    this.m_start = new Date().getTime();
                }
                /// Reset the timer.
                Reset() {
                    this.m_start = new Date().getTime();
                    return this;
                }
                /// Get the time since construction or the last reset.
                GetMilliseconds() {
                    return new Date().getTime() - this.m_start;
                }
            };
            exports_3("b2Timer", b2Timer);
            b2Counter = class b2Counter {
                constructor() {
                    this.m_count = 0;
                    this.m_min_count = 0;
                    this.m_max_count = 0;
                }
                GetCount() {
                    return this.m_count;
                }
                GetMinCount() {
                    return this.m_min_count;
                }
                GetMaxCount() {
                    return this.m_max_count;
                }
                ResetCount() {
                    const count = this.m_count;
                    this.m_count = 0;
                    return count;
                }
                ResetMinCount() {
                    this.m_min_count = 0;
                }
                ResetMaxCount() {
                    this.m_max_count = 0;
                }
                Increment() {
                    this.m_count++;
                    if (this.m_max_count < this.m_count) {
                        this.m_max_count = this.m_count;
                    }
                }
                Decrement() {
                    this.m_count--;
                    if (this.m_min_count > this.m_count) {
                        this.m_min_count = this.m_count;
                    }
                }
            };
            exports_3("b2Counter", b2Counter);
        }
    }
});
/*
* Copyright (c) 2011 Erin Catto http://box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Common/b2Draw", ["Box2D/Common/b2Math"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var b2Math_1;
    var b2Color, b2Draw;
    return {
        setters:[
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            }],
        execute: function() {
            /// Color for debug drawing. Each value has the range [0,1].
            b2Color = class b2Color {
                constructor(rr, gg, bb) {
                    this._r = 0x7f;
                    this._g = 0x7f;
                    this._b = 0x7f;
                    this._r = b2Math_1.b2Clamp(Math.round(rr * 255), 0, 255);
                    this._g = b2Math_1.b2Clamp(Math.round(gg * 255), 0, 255);
                    this._b = b2Math_1.b2Clamp(Math.round(bb * 255), 0, 255);
                }
                SetRGB(rr, gg, bb) {
                    this._r = b2Math_1.b2Clamp(Math.round(rr * 255), 0, 255);
                    this._g = b2Math_1.b2Clamp(Math.round(gg * 255), 0, 255);
                    this._b = b2Math_1.b2Clamp(Math.round(bb * 255), 0, 255);
                    return this;
                }
                MakeStyleString(alpha = 1) {
                    return b2Color.MakeStyleString(this._r, this._g, this._b, alpha);
                }
                static MakeStyleString(r, g, b, a = 1) {
                    if (a < 1) {
                        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
                    }
                    else {
                        return "rgb(" + r + "," + g + "," + b + ")";
                    }
                }
            };
            b2Color.RED = new b2Color(1, 0, 0);
            b2Color.GREEN = new b2Color(0, 1, 0);
            b2Color.BLUE = new b2Color(0, 0, 1);
            exports_4("b2Color", b2Color);
            /// Implement and register this class with a b2World to provide debug drawing of physics
            /// entities in your game.
            b2Draw = class b2Draw {
                constructor() {
                    this.m_drawFlags = 0;
                }
                SetFlags(flags) {
                    this.m_drawFlags = flags;
                }
                GetFlags() {
                    return this.m_drawFlags;
                }
                AppendFlags(flags) {
                    this.m_drawFlags |= flags;
                }
                ClearFlags(flags) {
                    this.m_drawFlags &= ~flags;
                }
                PushTransform(xf) {
                }
                PopTransform(xf) {
                }
                DrawPolygon(vertices, vertexCount, color) {
                }
                DrawSolidPolygon(vertices, vertexCount, color) {
                }
                DrawCircle(center, radius, color) {
                }
                DrawSolidCircle(center, radius, axis, color) {
                }
                DrawSegment(p1, p2, color) {
                }
                DrawTransform(xf) {
                }
            };
            exports_4("b2Draw", b2Draw);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/b2Distance", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var b2Settings, b2Math_2;
    var b2DistanceProxy, b2SimplexCache, b2DistanceInput, b2DistanceOutput, b2_gjkCalls, b2_gjkIters, b2_gjkMaxIters, b2SimplexVertex, b2Simplex, b2Distance_s_simplex, b2Distance_s_saveA, b2Distance_s_saveB, b2Distance_s_p, b2Distance_s_d, b2Distance_s_normal, b2Distance_s_supportA, b2Distance_s_supportB;
    function b2Distance(output, cache, input) {
        exports_5("b2_gjkCalls", ++b2_gjkCalls);
        const proxyA = input.proxyA;
        const proxyB = input.proxyB;
        const transformA = input.transformA;
        const transformB = input.transformB;
        // Initialize the simplex.
        const simplex = b2Distance_s_simplex;
        simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
        // Get simplex vertices as an array.
        const vertices = simplex.m_vertices;
        const k_maxIters = 20;
        // These store the vertices of the last simplex so that we
        // can check for duplicates and prevent cycling.
        const saveA = b2Distance_s_saveA;
        const saveB = b2Distance_s_saveB;
        let saveCount = 0;
        let distanceSqr1 = b2Settings.b2_maxFloat;
        let distanceSqr2 = distanceSqr1;
        // Main iteration loop.
        let iter = 0;
        while (iter < k_maxIters) {
            // Copy simplex so we can identify duplicates.
            saveCount = simplex.m_count;
            for (let i = 0; i < saveCount; ++i) {
                saveA[i] = vertices[i].indexA;
                saveB[i] = vertices[i].indexB;
            }
            switch (simplex.m_count) {
                case 1:
                    break;
                case 2:
                    simplex.Solve2();
                    break;
                case 3:
                    simplex.Solve3();
                    break;
                default:
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false);
                    }
                    break;
            }
            // If we have 3 points, then the origin is in the corresponding triangle.
            if (simplex.m_count === 3) {
                break;
            }
            // Compute closest point.
            const p = simplex.GetClosestPoint(b2Distance_s_p);
            distanceSqr2 = p.GetLengthSquared();
            // Ensure progress
            /*
            TODO: to fix compile warning
            if (distanceSqr2 > distanceSqr1) {
              //break;
            }
            */
            distanceSqr1 = distanceSqr2;
            // Get search direction.
            const d = simplex.GetSearchDirection(b2Distance_s_d);
            // Ensure the search direction is numerically fit.
            if (d.GetLengthSquared() < b2Settings.b2_epsilon_sq) {
                // The origin is probably contained by a line segment
                // or triangle. Thus the shapes are overlapped.
                // We can't return zero here even though there may be overlap.
                // In case the simplex is a point, segment, or triangle it is difficult
                // to determine if the origin is contained in the CSO or very close to it.
                break;
            }
            // Compute a tentative new simplex vertex using support points.
            const vertex = vertices[simplex.m_count];
            vertex.indexA = proxyA.GetSupport(b2Math_2.b2Rot.MulTRV(transformA.q, b2Math_2.b2Vec2.NegV(d, b2Math_2.b2Vec2.s_t0), b2Distance_s_supportA));
            b2Math_2.b2Transform.MulXV(transformA, proxyA.GetVertex(vertex.indexA), vertex.wA);
            vertex.indexB = proxyB.GetSupport(b2Math_2.b2Rot.MulTRV(transformB.q, d, b2Distance_s_supportB));
            b2Math_2.b2Transform.MulXV(transformB, proxyB.GetVertex(vertex.indexB), vertex.wB);
            b2Math_2.b2Vec2.SubVV(vertex.wB, vertex.wA, vertex.w);
            // Iteration count is equated to the number of support point calls.
            ++iter;
            exports_5("b2_gjkIters", ++b2_gjkIters);
            // Check for duplicate support points. This is the main termination criteria.
            let duplicate = false;
            for (let i = 0; i < saveCount; ++i) {
                if (vertex.indexA === saveA[i] && vertex.indexB === saveB[i]) {
                    duplicate = true;
                    break;
                }
            }
            // If we found a duplicate support point we must exit to avoid cycling.
            if (duplicate) {
                break;
            }
            // New vertex is ok and needed.
            ++simplex.m_count;
        }
        exports_5("b2_gjkMaxIters", b2_gjkMaxIters = b2Math_2.b2Max(b2_gjkMaxIters, iter));
        // Prepare output.
        simplex.GetWitnessPoints(output.pointA, output.pointB);
        output.distance = b2Math_2.b2Vec2.DistanceVV(output.pointA, output.pointB);
        output.iterations = iter;
        // Cache the simplex.
        simplex.WriteCache(cache);
        // Apply radii if requested.
        if (input.useRadii) {
            const rA = proxyA.m_radius;
            const rB = proxyB.m_radius;
            if (output.distance > (rA + rB) && output.distance > b2Settings.b2_epsilon) {
                // Shapes are still no overlapped.
                // Move the witness points to the outer surface.
                output.distance -= rA + rB;
                const normal = b2Math_2.b2Vec2.SubVV(output.pointB, output.pointA, b2Distance_s_normal);
                normal.Normalize();
                output.pointA.SelfMulAdd(rA, normal);
                output.pointB.SelfMulSub(rB, normal);
            }
            else {
                // Shapes are overlapped when radii are considered.
                // Move the witness points to the middle.
                const p = b2Math_2.b2Vec2.MidVV(output.pointA, output.pointB, b2Distance_s_p);
                output.pointA.Copy(p);
                output.pointB.Copy(p);
                output.distance = 0;
            }
        }
    }
    exports_5("b2Distance", b2Distance);
    return {
        setters:[
            function (b2Settings_2) {
                b2Settings = b2Settings_2;
            },
            function (b2Math_2_1) {
                b2Math_2 = b2Math_2_1;
            }],
        execute: function() {
            /// A distance proxy is used by the GJK algorithm.
            /// It encapsulates any shape.
            b2DistanceProxy = class b2DistanceProxy {
                constructor() {
                    this.m_buffer = b2Math_2.b2Vec2.MakeArray(2);
                    this.m_vertices = null;
                    this.m_count = 0;
                    this.m_radius = 0;
                }
                Reset() {
                    this.m_vertices = null;
                    this.m_count = 0;
                    this.m_radius = 0;
                    return this;
                }
                SetShape(shape, index) {
                    shape.SetupDistanceProxy(this, index);
                    //    switch (shape.GetType())
                    //    {
                    //    case b2ShapeType.e_circleShape:
                    //      {
                    //        const circle: b2CircleShape = <b2CircleShape> shape;
                    //        this.m_vertices = new Array(1, true);
                    //        this.m_vertices[0] = circle.m_p;
                    //        this.m_count = 1;
                    //        this.m_radius = circle.m_radius;
                    //      }
                    //      break;
                    //
                    //    case b2ShapeType.e_polygonShape:
                    //      {
                    //        const polygon: b2PolygonShape = <b2PolygonShape> shape;
                    //        this.m_vertices = polygon.m_vertices;
                    //        this.m_count = polygon.m_count;
                    //        this.m_radius = polygon.m_radius;
                    //      }
                    //      break;
                    //
                    //    case b2ShapeType.e_edgeShape:
                    //      {
                    //        const edge: b2EdgeShape = <b2EdgeShape> shape;
                    //        this.m_vertices = new Array(2);
                    //        this.m_vertices[0] = edge.m_vertex1;
                    //        this.m_vertices[1] = edge.m_vertex2;
                    //        this.m_count = 2;
                    //        this.m_radius = edge.m_radius;
                    //      }
                    //      break;
                    //
                    //    case b2ShapeType.e_chainShape:
                    //      {
                    //        const chain: b2ChainShape = <b2ChainShape> shape;
                    //        if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(0 <= index && index < chain.m_count); }
                    //
                    //        this.m_buffer[0].Copy(chain.m_vertices[index]);
                    //        if (index + 1 < chain.m_count)
                    //        {
                    //          this.m_buffer[1].Copy(chain.m_vertices[index + 1]);
                    //        }
                    //        else
                    //        {
                    //          this.m_buffer[1].Copy(chain.m_vertices[0]);
                    //        }
                    //
                    //        this.m_vertices = this.m_buffer;
                    //        this.m_count = 2;
                    //        this.m_radius = chain.m_radius;
                    //      }
                    //      break;
                    //
                    //    default:
                    //      if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(false); }
                    //      break;
                    //    }
                }
                GetSupport(d) {
                    let bestIndex = 0;
                    let bestValue = b2Math_2.b2Vec2.DotVV(this.m_vertices[0], d);
                    for (let i = 1; i < this.m_count; ++i) {
                        const value = b2Math_2.b2Vec2.DotVV(this.m_vertices[i], d);
                        if (value > bestValue) {
                            bestIndex = i;
                            bestValue = value;
                        }
                    }
                    return bestIndex;
                }
                GetSupportVertex(d) {
                    let bestIndex = 0;
                    let bestValue = b2Math_2.b2Vec2.DotVV(this.m_vertices[0], d);
                    for (let i = 1; i < this.m_count; ++i) {
                        const value = b2Math_2.b2Vec2.DotVV(this.m_vertices[i], d);
                        if (value > bestValue) {
                            bestIndex = i;
                            bestValue = value;
                        }
                    }
                    return this.m_vertices[bestIndex];
                }
                GetVertexCount() {
                    return this.m_count;
                }
                GetVertex(index) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= index && index < this.m_count);
                    }
                    return this.m_vertices[index];
                }
            };
            exports_5("b2DistanceProxy", b2DistanceProxy);
            b2SimplexCache = class b2SimplexCache {
                constructor() {
                    this.metric = 0;
                    this.count = 0;
                    this.indexA = b2Settings.b2MakeNumberArray(3);
                    this.indexB = b2Settings.b2MakeNumberArray(3);
                }
                Reset() {
                    this.metric = 0;
                    this.count = 0;
                    return this;
                }
            };
            exports_5("b2SimplexCache", b2SimplexCache);
            b2DistanceInput = class b2DistanceInput {
                constructor() {
                    this.proxyA = new b2DistanceProxy();
                    this.proxyB = new b2DistanceProxy();
                    this.transformA = new b2Math_2.b2Transform();
                    this.transformB = new b2Math_2.b2Transform();
                    this.useRadii = false;
                }
                Reset() {
                    this.proxyA.Reset();
                    this.proxyB.Reset();
                    this.transformA.SetIdentity();
                    this.transformB.SetIdentity();
                    this.useRadii = false;
                    return this;
                }
            };
            exports_5("b2DistanceInput", b2DistanceInput);
            b2DistanceOutput = class b2DistanceOutput {
                constructor() {
                    this.pointA = new b2Math_2.b2Vec2();
                    this.pointB = new b2Math_2.b2Vec2();
                    this.distance = 0;
                    this.iterations = 0; ///< number of GJK iterations used
                }
                Reset() {
                    this.pointA.SetZero();
                    this.pointB.SetZero();
                    this.distance = 0;
                    this.iterations = 0;
                    return this;
                }
            };
            exports_5("b2DistanceOutput", b2DistanceOutput);
            exports_5("b2_gjkCalls", b2_gjkCalls = 0);
            exports_5("b2_gjkIters", b2_gjkIters = 0);
            exports_5("b2_gjkMaxIters", b2_gjkMaxIters = 0);
            b2SimplexVertex = class b2SimplexVertex {
                constructor() {
                    this.wA = new b2Math_2.b2Vec2(); // support point in proxyA
                    this.wB = new b2Math_2.b2Vec2(); // support point in proxyB
                    this.w = new b2Math_2.b2Vec2(); // wB - wA
                    this.a = 0; // barycentric coordinate for closest point
                    this.indexA = 0; // wA index
                    this.indexB = 0; // wB index
                }
                Copy(other) {
                    this.wA.Copy(other.wA); // support point in proxyA
                    this.wB.Copy(other.wB); // support point in proxyB
                    this.w.Copy(other.w); // wB - wA
                    this.a = other.a; // barycentric coordinate for closest point
                    this.indexA = other.indexA; // wA index
                    this.indexB = other.indexB; // wB index
                    return this;
                }
            };
            exports_5("b2SimplexVertex", b2SimplexVertex);
            b2Simplex = class b2Simplex {
                constructor() {
                    this.m_v1 = new b2SimplexVertex();
                    this.m_v2 = new b2SimplexVertex();
                    this.m_v3 = new b2SimplexVertex();
                    this.m_vertices = new Array(3);
                    this.m_count = 0;
                    this.m_vertices[0] = this.m_v1;
                    this.m_vertices[1] = this.m_v2;
                    this.m_vertices[2] = this.m_v3;
                }
                ReadCache(cache, proxyA, transformA, proxyB, transformB) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= cache.count && cache.count <= 3);
                    }
                    // Copy data from cache.
                    this.m_count = cache.count;
                    const vertices = this.m_vertices;
                    for (let i = 0; i < this.m_count; ++i) {
                        const v = vertices[i];
                        v.indexA = cache.indexA[i];
                        v.indexB = cache.indexB[i];
                        const wALocal = proxyA.GetVertex(v.indexA);
                        const wBLocal = proxyB.GetVertex(v.indexB);
                        b2Math_2.b2Transform.MulXV(transformA, wALocal, v.wA);
                        b2Math_2.b2Transform.MulXV(transformB, wBLocal, v.wB);
                        b2Math_2.b2Vec2.SubVV(v.wB, v.wA, v.w);
                        v.a = 0;
                    }
                    // Compute the new simplex metric, if it is substantially different than
                    // old metric then flush the simplex.
                    if (this.m_count > 1) {
                        const metric1 = cache.metric;
                        const metric2 = this.GetMetric();
                        if (metric2 < 0.5 * metric1 || 2 * metric1 < metric2 || metric2 < b2Settings.b2_epsilon) {
                            // Reset the simplex.
                            this.m_count = 0;
                        }
                    }
                    // If the cache is empty or invalid ...
                    if (this.m_count === 0) {
                        const v = vertices[0];
                        v.indexA = 0;
                        v.indexB = 0;
                        const wALocal = proxyA.GetVertex(0);
                        const wBLocal = proxyB.GetVertex(0);
                        b2Math_2.b2Transform.MulXV(transformA, wALocal, v.wA);
                        b2Math_2.b2Transform.MulXV(transformB, wBLocal, v.wB);
                        b2Math_2.b2Vec2.SubVV(v.wB, v.wA, v.w);
                        v.a = 1;
                        this.m_count = 1;
                    }
                }
                WriteCache(cache) {
                    cache.metric = this.GetMetric();
                    cache.count = this.m_count;
                    const vertices = this.m_vertices;
                    for (let i = 0; i < this.m_count; ++i) {
                        cache.indexA[i] = vertices[i].indexA;
                        cache.indexB[i] = vertices[i].indexB;
                    }
                }
                GetSearchDirection(out) {
                    switch (this.m_count) {
                        case 1:
                            return b2Math_2.b2Vec2.NegV(this.m_v1.w, out);
                        case 2: {
                            const e12 = b2Math_2.b2Vec2.SubVV(this.m_v2.w, this.m_v1.w, out);
                            const sgn = b2Math_2.b2Vec2.CrossVV(e12, b2Math_2.b2Vec2.NegV(this.m_v1.w, b2Math_2.b2Vec2.s_t0));
                            if (sgn > 0) {
                                // Origin is left of e12.
                                return b2Math_2.b2Vec2.CrossOneV(e12, out);
                            }
                            else {
                                // Origin is right of e12.
                                return b2Math_2.b2Vec2.CrossVOne(e12, out);
                            }
                        }
                        default:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            return out.SetZero();
                    }
                }
                GetClosestPoint(out) {
                    switch (this.m_count) {
                        case 0:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            return out.SetZero();
                        case 1:
                            return out.Copy(this.m_v1.w);
                        case 2:
                            return out.SetXY(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
                        case 3:
                            return out.SetZero();
                        default:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            return out.SetZero();
                    }
                }
                GetWitnessPoints(pA, pB) {
                    switch (this.m_count) {
                        case 0:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            break;
                        case 1:
                            pA.Copy(this.m_v1.wA);
                            pB.Copy(this.m_v1.wB);
                            break;
                        case 2:
                            pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
                            pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
                            pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
                            pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
                            break;
                        case 3:
                            pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
                            pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
                            break;
                        default:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            break;
                    }
                }
                GetMetric() {
                    switch (this.m_count) {
                        case 0:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            return 0;
                        case 1:
                            return 0;
                        case 2:
                            return b2Math_2.b2Vec2.DistanceVV(this.m_v1.w, this.m_v2.w);
                        case 3:
                            return b2Math_2.b2Vec2.CrossVV(b2Math_2.b2Vec2.SubVV(this.m_v2.w, this.m_v1.w, b2Math_2.b2Vec2.s_t0), b2Math_2.b2Vec2.SubVV(this.m_v3.w, this.m_v1.w, b2Math_2.b2Vec2.s_t1));
                        default:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            return 0;
                    }
                }
                Solve2() {
                    const w1 = this.m_v1.w;
                    const w2 = this.m_v2.w;
                    const e12 = b2Math_2.b2Vec2.SubVV(w2, w1, b2Simplex.s_e12);
                    // w1 region
                    const d12_2 = (-b2Math_2.b2Vec2.DotVV(w1, e12));
                    if (d12_2 <= 0) {
                        // a2 <= 0, so we clamp it to 0
                        this.m_v1.a = 1;
                        this.m_count = 1;
                        return;
                    }
                    // w2 region
                    const d12_1 = b2Math_2.b2Vec2.DotVV(w2, e12);
                    if (d12_1 <= 0) {
                        // a1 <= 0, so we clamp it to 0
                        this.m_v2.a = 1;
                        this.m_count = 1;
                        this.m_v1.Copy(this.m_v2);
                        return;
                    }
                    // Must be in e12 region.
                    const inv_d12 = 1 / (d12_1 + d12_2);
                    this.m_v1.a = d12_1 * inv_d12;
                    this.m_v2.a = d12_2 * inv_d12;
                    this.m_count = 2;
                }
                Solve3() {
                    const w1 = this.m_v1.w;
                    const w2 = this.m_v2.w;
                    const w3 = this.m_v3.w;
                    // Edge12
                    // [1      1     ][a1] = [1]
                    // [w1.e12 w2.e12][a2] = [0]
                    // a3 = 0
                    const e12 = b2Math_2.b2Vec2.SubVV(w2, w1, b2Simplex.s_e12);
                    const w1e12 = b2Math_2.b2Vec2.DotVV(w1, e12);
                    const w2e12 = b2Math_2.b2Vec2.DotVV(w2, e12);
                    const d12_1 = w2e12;
                    const d12_2 = (-w1e12);
                    // Edge13
                    // [1      1     ][a1] = [1]
                    // [w1.e13 w3.e13][a3] = [0]
                    // a2 = 0
                    const e13 = b2Math_2.b2Vec2.SubVV(w3, w1, b2Simplex.s_e13);
                    const w1e13 = b2Math_2.b2Vec2.DotVV(w1, e13);
                    const w3e13 = b2Math_2.b2Vec2.DotVV(w3, e13);
                    const d13_1 = w3e13;
                    const d13_2 = (-w1e13);
                    // Edge23
                    // [1      1     ][a2] = [1]
                    // [w2.e23 w3.e23][a3] = [0]
                    // a1 = 0
                    const e23 = b2Math_2.b2Vec2.SubVV(w3, w2, b2Simplex.s_e23);
                    const w2e23 = b2Math_2.b2Vec2.DotVV(w2, e23);
                    const w3e23 = b2Math_2.b2Vec2.DotVV(w3, e23);
                    const d23_1 = w3e23;
                    const d23_2 = (-w2e23);
                    // Triangle123
                    const n123 = b2Math_2.b2Vec2.CrossVV(e12, e13);
                    const d123_1 = n123 * b2Math_2.b2Vec2.CrossVV(w2, w3);
                    const d123_2 = n123 * b2Math_2.b2Vec2.CrossVV(w3, w1);
                    const d123_3 = n123 * b2Math_2.b2Vec2.CrossVV(w1, w2);
                    // w1 region
                    if (d12_2 <= 0 && d13_2 <= 0) {
                        this.m_v1.a = 1;
                        this.m_count = 1;
                        return;
                    }
                    // e12
                    if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
                        const inv_d12 = 1 / (d12_1 + d12_2);
                        this.m_v1.a = d12_1 * inv_d12;
                        this.m_v2.a = d12_2 * inv_d12;
                        this.m_count = 2;
                        return;
                    }
                    // e13
                    if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
                        const inv_d13 = 1 / (d13_1 + d13_2);
                        this.m_v1.a = d13_1 * inv_d13;
                        this.m_v3.a = d13_2 * inv_d13;
                        this.m_count = 2;
                        this.m_v2.Copy(this.m_v3);
                        return;
                    }
                    // w2 region
                    if (d12_1 <= 0 && d23_2 <= 0) {
                        this.m_v2.a = 1;
                        this.m_count = 1;
                        this.m_v1.Copy(this.m_v2);
                        return;
                    }
                    // w3 region
                    if (d13_1 <= 0 && d23_1 <= 0) {
                        this.m_v3.a = 1;
                        this.m_count = 1;
                        this.m_v1.Copy(this.m_v3);
                        return;
                    }
                    // e23
                    if (d23_1 > 0 && d23_2 > 0 && d123_1 <= 0) {
                        const inv_d23 = 1 / (d23_1 + d23_2);
                        this.m_v2.a = d23_1 * inv_d23;
                        this.m_v3.a = d23_2 * inv_d23;
                        this.m_count = 2;
                        this.m_v1.Copy(this.m_v3);
                        return;
                    }
                    // Must be in triangle123
                    const inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
                    this.m_v1.a = d123_1 * inv_d123;
                    this.m_v2.a = d123_2 * inv_d123;
                    this.m_v3.a = d123_3 * inv_d123;
                    this.m_count = 3;
                }
            };
            b2Simplex.s_e12 = new b2Math_2.b2Vec2();
            b2Simplex.s_e13 = new b2Math_2.b2Vec2();
            b2Simplex.s_e23 = new b2Math_2.b2Vec2();
            exports_5("b2Simplex", b2Simplex);
            b2Distance_s_simplex = new b2Simplex();
            b2Distance_s_saveA = b2Settings.b2MakeNumberArray(3);
            b2Distance_s_saveB = b2Settings.b2MakeNumberArray(3);
            b2Distance_s_p = new b2Math_2.b2Vec2();
            b2Distance_s_d = new b2Math_2.b2Vec2();
            b2Distance_s_normal = new b2Math_2.b2Vec2();
            b2Distance_s_supportA = new b2Math_2.b2Vec2();
            b2Distance_s_supportB = new b2Math_2.b2Vec2();
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/Shapes/b2Shape", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var b2Settings, b2Math_3;
    var b2MassData, b2Shape;
    return {
        setters:[
            function (b2Settings_3) {
                b2Settings = b2Settings_3;
            },
            function (b2Math_3_1) {
                b2Math_3 = b2Math_3_1;
            }],
        execute: function() {
            /// This holds the mass data computed for a shape.
            b2MassData = class b2MassData {
                constructor() {
                    /// The mass of the shape, usually in kilograms.
                    this.mass = 0;
                    /// The position of the shape's centroid relative to the shape's origin.
                    this.center = new b2Math_3.b2Vec2(0, 0);
                    /// The rotational inertia of the shape about the local origin.
                    this.I = 0;
                }
            };
            exports_6("b2MassData", b2MassData);
            /// A shape is used for collision detection. You can create a shape however you like.
            /// Shapes used for simulation in b2World are created automatically when a b2Fixture
            /// is created. Shapes may encapsulate a one or more child shapes.
            b2Shape = class b2Shape {
                constructor(type, radius) {
                    this.m_type = -1 /* e_unknown */;
                    this.m_radius = 0;
                    this.m_type = type;
                    this.m_radius = radius;
                }
                /// Clone the concrete shape using the provided allocator.
                Clone() {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false);
                    }
                    return null;
                }
                Copy(other) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_type === other.m_type);
                    }
                    this.m_radius = other.m_radius;
                    return this;
                }
                /// Get the type of this shape. You can use this to down cast to the concrete shape.
                /// @return the shape type.
                GetType() {
                    return this.m_type;
                }
                /// Get the number of child primitives.
                GetChildCount() {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false, "pure virtual");
                    }
                    return 0;
                }
                /// Test a point for containment in this shape. This only works for convex shapes.
                /// @param xf the shape world transform.
                /// @param p a point in world coordinates.
                TestPoint(xf, p) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false, "pure virtual");
                    }
                    return false;
                }
                /// Cast a ray against a child shape.
                /// @param output the ray-cast results.
                /// @param input the ray-cast input parameters.
                /// @param transform the transform to be applied to the shape.
                /// @param childIndex the child shape index
                RayCast(output, input, transform, childIndex) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false, "pure virtual");
                    }
                    return false;
                }
                /// Given a transform, compute the associated axis aligned bounding box for a child shape.
                /// @param aabb returns the axis aligned box.
                /// @param xf the world transform of the shape.
                /// @param childIndex the child shape
                ComputeAABB(aabb, xf, childIndex) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false, "pure virtual");
                    }
                }
                /// Compute the mass properties of this shape using its dimensions and density.
                /// The inertia tensor is computed about the local origin.
                /// @param massData returns the mass data for this shape.
                /// @param density the density in kilograms per meter squared.
                ComputeMass(massData, density) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false, "pure virtual");
                    }
                }
                SetupDistanceProxy(proxy, index) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false, "pure virtual");
                    }
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false, "pure virtual");
                    }
                    c.SetZero();
                    return 0;
                }
                Dump() {
                }
            };
            exports_6("b2Shape", b2Shape);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/b2Collision", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/b2Distance"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var b2Settings, b2Math_4, b2Distance_1;
    var b2ContactFeature, b2ContactID, b2ManifoldPoint, b2Manifold, b2WorldManifold, b2ClipVertex, b2RayCastInput, b2RayCastOutput, b2AABB, b2TestOverlapShape_s_input, b2TestOverlapShape_s_simplexCache, b2TestOverlapShape_s_output;
    /// Compute the point states given two manifolds. The states pertain to the transition from manifold1
    /// to manifold2. So state1 is either persist or remove while state2 is either add or persist.
    function b2GetPointStates(state1, state2, manifold1, manifold2) {
        // Detect persists and removes.
        let i;
        for (i = 0; i < manifold1.pointCount; ++i) {
            const id = manifold1.points[i].id;
            const key = id.key;
            state1[i] = 3 /* b2_removeState */;
            for (let j = 0, jct = manifold2.pointCount; j < jct; ++j) {
                if (manifold2.points[j].id.key === key) {
                    state1[i] = 2 /* b2_persistState */;
                    break;
                }
            }
        }
        for (; i < b2Settings.b2_maxManifoldPoints; ++i) {
            state1[i] = 0 /* b2_nullState */;
        }
        // Detect persists and adds.
        for (i = 0; i < manifold2.pointCount; ++i) {
            const id = manifold2.points[i].id;
            const key = id.key;
            state2[i] = 1 /* b2_addState */;
            for (let j = 0, jct = manifold1.pointCount; j < jct; ++j) {
                if (manifold1.points[j].id.key === key) {
                    state2[i] = 2 /* b2_persistState */;
                    break;
                }
            }
        }
        for (; i < b2Settings.b2_maxManifoldPoints; ++i) {
            state2[i] = 0 /* b2_nullState */;
        }
    }
    exports_7("b2GetPointStates", b2GetPointStates);
    function b2TestOverlapAABB(a, b) {
        const d1_x = b.lowerBound.x - a.upperBound.x;
        const d1_y = b.lowerBound.y - a.upperBound.y;
        const d2_x = a.lowerBound.x - b.upperBound.x;
        const d2_y = a.lowerBound.y - b.upperBound.y;
        if (d1_x > 0 || d1_y > 0)
            return false;
        if (d2_x > 0 || d2_y > 0)
            return false;
        return true;
    }
    exports_7("b2TestOverlapAABB", b2TestOverlapAABB);
    /// Clipping for contact manifolds.
    function b2ClipSegmentToLine(vOut, vIn, normal, offset, vertexIndexA) {
        // Start with no output points
        let numOut = 0;
        const vIn0 = vIn[0];
        const vIn1 = vIn[1];
        // Calculate the distance of end points to the line
        const distance0 = b2Math_4.b2Vec2.DotVV(normal, vIn0.v) - offset;
        const distance1 = b2Math_4.b2Vec2.DotVV(normal, vIn1.v) - offset;
        // If the points are behind the plane
        if (distance0 <= 0)
            vOut[numOut++].Copy(vIn0);
        if (distance1 <= 0)
            vOut[numOut++].Copy(vIn1);
        // If the points are on different sides of the plane
        if (distance0 * distance1 < 0) {
            // Find intersection point of edge and plane
            const interp = distance0 / (distance0 - distance1);
            const v = vOut[numOut].v;
            v.x = vIn0.v.x + interp * (vIn1.v.x - vIn0.v.x);
            v.y = vIn0.v.y + interp * (vIn1.v.y - vIn0.v.y);
            // VertexA is hitting edgeB.
            const id = vOut[numOut].id;
            id.cf.indexA = vertexIndexA;
            id.cf.indexB = vIn0.id.cf.indexB;
            id.cf.typeA = 0 /* e_vertex */;
            id.cf.typeB = 1 /* e_face */;
            ++numOut;
        }
        return numOut;
    }
    exports_7("b2ClipSegmentToLine", b2ClipSegmentToLine);
    function b2TestOverlapShape(shapeA, indexA, shapeB, indexB, xfA, xfB) {
        const input = b2TestOverlapShape_s_input.Reset();
        input.proxyA.SetShape(shapeA, indexA);
        input.proxyB.SetShape(shapeB, indexB);
        input.transformA.Copy(xfA);
        input.transformB.Copy(xfB);
        input.useRadii = true;
        const simplexCache = b2TestOverlapShape_s_simplexCache.Reset();
        simplexCache.count = 0;
        const output = b2TestOverlapShape_s_output.Reset();
        b2Distance_1.b2Distance(output, simplexCache, input);
        return output.distance < 10 * b2Settings.b2_epsilon;
    }
    exports_7("b2TestOverlapShape", b2TestOverlapShape);
    return {
        setters:[
            function (b2Settings_4) {
                b2Settings = b2Settings_4;
            },
            function (b2Math_4_1) {
                b2Math_4 = b2Math_4_1;
            },
            function (b2Distance_1_1) {
                b2Distance_1 = b2Distance_1_1;
            }],
        execute: function() {
            /// The features that intersect to form the contact point
            /// This must be 4 bytes or less.
            b2ContactFeature = class b2ContactFeature {
                constructor(id) {
                    this._id = null;
                    this._indexA = 0;
                    this._indexB = 0;
                    this._typeA = 0;
                    this._typeB = 0;
                    this._id = id;
                }
                get indexA() {
                    return this._indexA;
                }
                set indexA(value) {
                    this._indexA = value;
                    // update the b2ContactID
                    this._id._key = (this._id._key & 0xffffff00) | (this._indexA & 0x000000ff);
                }
                get indexB() {
                    return this._indexB;
                }
                set indexB(value) {
                    this._indexB = value;
                    // update the b2ContactID
                    this._id._key = (this._id._key & 0xffff00ff) | ((this._indexB << 8) & 0x0000ff00);
                }
                get typeA() {
                    return this._typeA;
                }
                set typeA(value) {
                    this._typeA = value;
                    // update the b2ContactID
                    this._id._key = (this._id._key & 0xff00ffff) | ((this._typeA << 16) & 0x00ff0000);
                }
                get typeB() {
                    return this._typeB;
                }
                set typeB(value) {
                    this._typeB = value;
                    // update the b2ContactID
                    this._id._key = (this._id._key & 0x00ffffff) | ((this._typeB << 24) & 0xff000000);
                }
            };
            exports_7("b2ContactFeature", b2ContactFeature);
            /// Contact ids to facilitate warm starting.
            b2ContactID = class b2ContactID {
                constructor() {
                    this.cf = null;
                    this._key = 0;
                    this.cf = new b2ContactFeature(this);
                }
                Copy(o) {
                    this.key = o.key;
                    return this;
                }
                Clone() {
                    return new b2ContactID().Copy(this);
                }
                get key() {
                    return this._key;
                }
                set key(value) {
                    this._key = value;
                    // update the b2ContactFeature
                    this.cf._indexA = this._key & 0x000000ff;
                    this.cf._indexB = (this._key >> 8) & 0x000000ff;
                    this.cf._typeA = (this._key >> 16) & 0x000000ff;
                    this.cf._typeB = (this._key >> 24) & 0x000000ff;
                }
            };
            exports_7("b2ContactID", b2ContactID);
            /// A manifold point is a contact point belonging to a contact
            /// manifold. It holds details related to the geometry and dynamics
            /// of the contact points.
            /// The local point usage depends on the manifold type:
            /// -e_circles: the local center of circleB
            /// -e_faceA: the local center of cirlceB or the clip point of polygonB
            /// -e_faceB: the clip point of polygonA
            /// This structure is stored across time steps, so we keep it small.
            /// Note: the impulses are used for internal caching and may not
            /// provide reliable contact forces, especially for high speed collisions.
            b2ManifoldPoint = class b2ManifoldPoint {
                constructor() {
                    this.localPoint = new b2Math_4.b2Vec2(); ///< usage depends on manifold type
                    this.normalImpulse = 0; ///< the non-penetration impulse
                    this.tangentImpulse = 0; ///< the friction impulse
                    this.id = new b2ContactID(); ///< uniquely identifies a contact point between two shapes
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2ManifoldPoint(); });
                }
                Reset() {
                    this.localPoint.SetZero();
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.id.key = 0;
                }
                Copy(o) {
                    this.localPoint.Copy(o.localPoint);
                    this.normalImpulse = o.normalImpulse;
                    this.tangentImpulse = o.tangentImpulse;
                    this.id.Copy(o.id);
                    return this;
                }
            };
            exports_7("b2ManifoldPoint", b2ManifoldPoint);
            /// A manifold for two touching convex shapes.
            /// Box2D supports multiple types of contact:
            /// - clip point versus plane with radius
            /// - point versus point with radius (circles)
            /// The local point usage depends on the manifold type:
            /// -e_circles: the local center of circleA
            /// -e_faceA: the center of faceA
            /// -e_faceB: the center of faceB
            /// Similarly the local normal usage:
            /// -e_circles: not used
            /// -e_faceA: the normal on polygonA
            /// -e_faceB: the normal on polygonB
            /// We store contacts in this way so that position correction can
            /// account for movement, which is critical for continuous physics.
            /// All contact scenarios must be expressed in one of these types.
            /// This structure is stored across time steps, so we keep it small.
            b2Manifold = class b2Manifold {
                constructor() {
                    this.points = b2ManifoldPoint.MakeArray(b2Settings.b2_maxManifoldPoints);
                    this.localNormal = new b2Math_4.b2Vec2();
                    this.localPoint = new b2Math_4.b2Vec2();
                    this.type = -1 /* e_unknown */;
                    this.pointCount = 0;
                }
                Reset() {
                    for (let i = 0, ict = b2Settings.b2_maxManifoldPoints; i < ict; ++i) {
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(this.points[i] instanceof b2ManifoldPoint);
                        }
                        this.points[i].Reset();
                    }
                    this.localNormal.SetZero();
                    this.localPoint.SetZero();
                    this.type = -1 /* e_unknown */;
                    this.pointCount = 0;
                }
                Copy(o) {
                    this.pointCount = o.pointCount;
                    for (let i = 0, ict = b2Settings.b2_maxManifoldPoints; i < ict; ++i) {
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(this.points[i] instanceof b2ManifoldPoint);
                        }
                        this.points[i].Copy(o.points[i]);
                    }
                    this.localNormal.Copy(o.localNormal);
                    this.localPoint.Copy(o.localPoint);
                    this.type = o.type;
                    return this;
                }
                Clone() {
                    return new b2Manifold().Copy(this);
                }
            };
            exports_7("b2Manifold", b2Manifold);
            b2WorldManifold = class b2WorldManifold {
                constructor() {
                    this.normal = new b2Math_4.b2Vec2();
                    this.points = b2Math_4.b2Vec2.MakeArray(b2Settings.b2_maxManifoldPoints);
                }
                Initialize(manifold, xfA, radiusA, xfB, radiusB) {
                    if (manifold.pointCount === 0) {
                        return;
                    }
                    switch (manifold.type) {
                        case 0 /* e_circles */:
                            {
                                this.normal.SetXY(1, 0);
                                const pointA = b2Math_4.b2Transform.MulXV(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_pointA);
                                const pointB = b2Math_4.b2Transform.MulXV(xfB, manifold.points[0].localPoint, b2WorldManifold.Initialize_s_pointB);
                                if (b2Math_4.b2Vec2.DistanceSquaredVV(pointA, pointB) > b2Settings.b2_epsilon_sq) {
                                    b2Math_4.b2Vec2.SubVV(pointB, pointA, this.normal).SelfNormalize();
                                }
                                const cA = b2Math_4.b2Vec2.AddVMulSV(pointA, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                                const cB = b2Math_4.b2Vec2.SubVMulSV(pointB, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                                b2Math_4.b2Vec2.MidVV(cA, cB, this.points[0]);
                            }
                            break;
                        case 1 /* e_faceA */:
                            {
                                b2Math_4.b2Rot.MulRV(xfA.q, manifold.localNormal, this.normal);
                                const planePoint = b2Math_4.b2Transform.MulXV(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                                for (let i = 0, ict = manifold.pointCount; i < ict; ++i) {
                                    const clipPoint = b2Math_4.b2Transform.MulXV(xfB, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                                    const s = radiusA - b2Math_4.b2Vec2.DotVV(b2Math_4.b2Vec2.SubVV(clipPoint, planePoint, b2Math_4.b2Vec2.s_t0), this.normal);
                                    const cA = b2Math_4.b2Vec2.AddVMulSV(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cA);
                                    const cB = b2Math_4.b2Vec2.SubVMulSV(clipPoint, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                                    b2Math_4.b2Vec2.MidVV(cA, cB, this.points[i]);
                                }
                            }
                            break;
                        case 2 /* e_faceB */:
                            {
                                b2Math_4.b2Rot.MulRV(xfB.q, manifold.localNormal, this.normal);
                                const planePoint = b2Math_4.b2Transform.MulXV(xfB, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                                for (let i = 0, ict = manifold.pointCount; i < ict; ++i) {
                                    const clipPoint = b2Math_4.b2Transform.MulXV(xfA, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                                    const s = radiusB - b2Math_4.b2Vec2.DotVV(b2Math_4.b2Vec2.SubVV(clipPoint, planePoint, b2Math_4.b2Vec2.s_t0), this.normal);
                                    const cB = b2Math_4.b2Vec2.AddVMulSV(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cB);
                                    const cA = b2Math_4.b2Vec2.SubVMulSV(clipPoint, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                                    b2Math_4.b2Vec2.MidVV(cA, cB, this.points[i]);
                                }
                                // Ensure normal points from A to B.
                                this.normal.SelfNeg();
                            }
                            break;
                    }
                }
            };
            b2WorldManifold.Initialize_s_pointA = new b2Math_4.b2Vec2();
            b2WorldManifold.Initialize_s_pointB = new b2Math_4.b2Vec2();
            b2WorldManifold.Initialize_s_cA = new b2Math_4.b2Vec2();
            b2WorldManifold.Initialize_s_cB = new b2Math_4.b2Vec2();
            b2WorldManifold.Initialize_s_planePoint = new b2Math_4.b2Vec2();
            b2WorldManifold.Initialize_s_clipPoint = new b2Math_4.b2Vec2();
            exports_7("b2WorldManifold", b2WorldManifold);
            /// Used for computing contact manifolds.
            b2ClipVertex = class b2ClipVertex {
                constructor() {
                    this.v = new b2Math_4.b2Vec2();
                    this.id = new b2ContactID();
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2ClipVertex(); });
                }
                Copy(other) {
                    this.v.Copy(other.v);
                    this.id.Copy(other.id);
                    return this;
                }
            };
            exports_7("b2ClipVertex", b2ClipVertex);
            /// Ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
            b2RayCastInput = class b2RayCastInput {
                constructor() {
                    this.p1 = new b2Math_4.b2Vec2();
                    this.p2 = new b2Math_4.b2Vec2();
                    this.maxFraction = 1;
                }
                Copy(o) {
                    this.p1.Copy(o.p1);
                    this.p2.Copy(o.p2);
                    this.maxFraction = o.maxFraction;
                    return this;
                }
            };
            exports_7("b2RayCastInput", b2RayCastInput);
            /// Ray-cast output data. The ray hits at p1 + fraction * (p2 - p1), where p1 and p2
            /// come from b2RayCastInput.
            b2RayCastOutput = class b2RayCastOutput {
                constructor() {
                    this.normal = new b2Math_4.b2Vec2();
                    this.fraction = 0;
                }
                Copy(o) {
                    this.normal.Copy(o.normal);
                    this.fraction = o.fraction;
                    return this;
                }
            };
            exports_7("b2RayCastOutput", b2RayCastOutput);
            /// An axis aligned bounding box.
            b2AABB = class b2AABB {
                constructor() {
                    this.lowerBound = new b2Math_4.b2Vec2(); ///< the lower vertex
                    this.upperBound = new b2Math_4.b2Vec2(); ///< the upper vertex
                    this.m_cache_center = new b2Math_4.b2Vec2(); // access using GetCenter()
                    this.m_cache_extent = new b2Math_4.b2Vec2(); // access using GetExtents()
                }
                Copy(o) {
                    this.lowerBound.Copy(o.lowerBound);
                    this.upperBound.Copy(o.upperBound);
                    return this;
                }
                /// Verify that the bounds are sorted.
                IsValid() {
                    const d_x = this.upperBound.x - this.lowerBound.x;
                    const d_y = this.upperBound.y - this.lowerBound.y;
                    let valid = d_x >= 0 && d_y >= 0;
                    valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
                    return valid;
                }
                /// Get the center of the AABB.
                GetCenter() {
                    return b2Math_4.b2Vec2.MidVV(this.lowerBound, this.upperBound, this.m_cache_center);
                }
                /// Get the extents of the AABB (half-widths).
                GetExtents() {
                    return b2Math_4.b2Vec2.ExtVV(this.lowerBound, this.upperBound, this.m_cache_extent);
                }
                /// Get the perimeter length
                GetPerimeter() {
                    const wx = this.upperBound.x - this.lowerBound.x;
                    const wy = this.upperBound.y - this.lowerBound.y;
                    return 2 * (wx + wy);
                }
                /// Combine an AABB into this one.
                Combine1(aabb) {
                    this.lowerBound.x = b2Math_4.b2Min(this.lowerBound.x, aabb.lowerBound.x);
                    this.lowerBound.y = b2Math_4.b2Min(this.lowerBound.y, aabb.lowerBound.y);
                    this.upperBound.x = b2Math_4.b2Max(this.upperBound.x, aabb.upperBound.x);
                    this.upperBound.y = b2Math_4.b2Max(this.upperBound.y, aabb.upperBound.y);
                    return this;
                }
                /// Combine two AABBs into this one.
                Combine2(aabb1, aabb2) {
                    this.lowerBound.x = b2Math_4.b2Min(aabb1.lowerBound.x, aabb2.lowerBound.x);
                    this.lowerBound.y = b2Math_4.b2Min(aabb1.lowerBound.y, aabb2.lowerBound.y);
                    this.upperBound.x = b2Math_4.b2Max(aabb1.upperBound.x, aabb2.upperBound.x);
                    this.upperBound.y = b2Math_4.b2Max(aabb1.upperBound.y, aabb2.upperBound.y);
                    return this;
                }
                static Combine(aabb1, aabb2, out) {
                    out.Combine2(aabb1, aabb2);
                    return out;
                }
                /// Does this aabb contain the provided AABB.
                Contains(aabb) {
                    let result = true;
                    result = result && this.lowerBound.x <= aabb.lowerBound.x;
                    result = result && this.lowerBound.y <= aabb.lowerBound.y;
                    result = result && aabb.upperBound.x <= this.upperBound.x;
                    result = result && aabb.upperBound.y <= this.upperBound.y;
                    return result;
                }
                // From Real-time Collision Detection, p179.
                RayCast(output, input) {
                    let tmin = (-b2Settings.b2_maxFloat);
                    let tmax = b2Settings.b2_maxFloat;
                    const p_x = input.p1.x;
                    const p_y = input.p1.y;
                    const d_x = input.p2.x - input.p1.x;
                    const d_y = input.p2.y - input.p1.y;
                    const absD_x = b2Math_4.b2Abs(d_x);
                    const absD_y = b2Math_4.b2Abs(d_y);
                    const normal = output.normal;
                    if (absD_x < b2Settings.b2_epsilon) {
                        // Parallel.
                        if (p_x < this.lowerBound.x || this.upperBound.x < p_x) {
                            return false;
                        }
                    }
                    else {
                        const inv_d = 1 / d_x;
                        let t1 = (this.lowerBound.x - p_x) * inv_d;
                        let t2 = (this.upperBound.x - p_x) * inv_d;
                        // Sign of the normal vector.
                        let s = (-1);
                        if (t1 > t2) {
                            const t3 = t1;
                            t1 = t2;
                            t2 = t3;
                            s = 1;
                        }
                        // Push the min up
                        if (t1 > tmin) {
                            normal.x = s;
                            normal.y = 0;
                            tmin = t1;
                        }
                        // Pull the max down
                        tmax = b2Math_4.b2Min(tmax, t2);
                        if (tmin > tmax) {
                            return false;
                        }
                    }
                    if (absD_y < b2Settings.b2_epsilon) {
                        // Parallel.
                        if (p_y < this.lowerBound.y || this.upperBound.y < p_y) {
                            return false;
                        }
                    }
                    else {
                        const inv_d = 1 / d_y;
                        let t1 = (this.lowerBound.y - p_y) * inv_d;
                        let t2 = (this.upperBound.y - p_y) * inv_d;
                        // Sign of the normal vector.
                        let s = (-1);
                        if (t1 > t2) {
                            const t3 = t1;
                            t1 = t2;
                            t2 = t3;
                            s = 1;
                        }
                        // Push the min up
                        if (t1 > tmin) {
                            normal.x = 0;
                            normal.y = s;
                            tmin = t1;
                        }
                        // Pull the max down
                        tmax = b2Math_4.b2Min(tmax, t2);
                        if (tmin > tmax) {
                            return false;
                        }
                    }
                    // Does the ray start inside the box?
                    // Does the ray intersect beyond the max fraction?
                    if (tmin < 0 || input.maxFraction < tmin) {
                        return false;
                    }
                    // Intersection.
                    output.fraction = tmin;
                    return true;
                }
                TestOverlap(other) {
                    const d1_x = other.lowerBound.x - this.upperBound.x;
                    const d1_y = other.lowerBound.y - this.upperBound.y;
                    const d2_x = this.lowerBound.x - other.upperBound.x;
                    const d2_y = this.lowerBound.y - other.upperBound.y;
                    if (d1_x > 0 || d1_y > 0)
                        return false;
                    if (d2_x > 0 || d2_y > 0)
                        return false;
                    return true;
                }
            };
            exports_7("b2AABB", b2AABB);
            /// Determine if two generic shapes overlap.
            b2TestOverlapShape_s_input = new b2Distance_1.b2DistanceInput();
            b2TestOverlapShape_s_simplexCache = new b2Distance_1.b2SimplexCache();
            b2TestOverlapShape_s_output = new b2Distance_1.b2DistanceOutput();
        }
    }
});
/*
* Copyright (c) 2010 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Common/b2GrowableStack", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var b2GrowableStack;
    return {
        setters:[],
        execute: function() {
            /// This is a growable LIFO stack with an initial capacity of N.
            /// If the stack size exceeds the initial capacity, the heap is used
            /// to increase the size of the stack.
            b2GrowableStack = class b2GrowableStack {
                constructor(N) {
                    this.m_stack = [];
                    this.m_count = 0;
                    this.m_stack = new Array(N);
                    this.m_count = 0;
                }
                Reset() {
                    this.m_count = 0;
                    return this;
                }
                Push(element) {
                    this.m_stack[this.m_count] = element;
                    this.m_count++;
                }
                Pop() {
                    // if (box2d.b2Settings.ENABLE_ASSERTS) { box2d.b2Settings.b2Assert(this.m_count > 0); }
                    this.m_count--;
                    const element = this.m_stack[this.m_count];
                    this.m_stack[this.m_count] = null;
                    return element;
                }
                GetCount() {
                    return this.m_count;
                }
            };
            exports_8("b2GrowableStack", b2GrowableStack);
        }
    }
});
/*
* Copyright (c) 2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/b2DynamicTree", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Common/b2GrowableStack", "Box2D/Collision/b2Collision"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var b2Settings, b2Math_5, b2GrowableStack_1, b2Collision_1;
    var b2TreeNode, b2DynamicTree;
    return {
        setters:[
            function (b2Settings_5) {
                b2Settings = b2Settings_5;
            },
            function (b2Math_5_1) {
                b2Math_5 = b2Math_5_1;
            },
            function (b2GrowableStack_1_1) {
                b2GrowableStack_1 = b2GrowableStack_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            }],
        execute: function() {
            /// A node in the dynamic tree. The client does not interact with this directly.
            b2TreeNode = class b2TreeNode {
                constructor(id = 0) {
                    this.m_id = 0;
                    this.aabb = new b2Collision_1.b2AABB();
                    this.userData = null;
                    this.parent = null; // or b2TreeNode.prototype.next
                    this.child1 = null; // or b2TreeNode.prototype.next
                    this.child2 = null; // or b2TreeNode.prototype.next
                    this.height = 0; // leaf = 0, free node = -1
                    this.m_id = id;
                }
                IsLeaf() {
                    return this.child1 === null;
                }
            };
            exports_9("b2TreeNode", b2TreeNode);
            b2DynamicTree = class b2DynamicTree {
                constructor() {
                    this.m_root = null;
                    // b2TreeNode* public m_nodes;
                    // int32 public m_nodeCount;
                    // int32 public m_nodeCapacity;
                    this.m_freeList = null;
                    this.m_path = 0;
                    this.m_insertionCount = 0;
                }
                GetUserData(proxy) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(proxy !== null);
                    }
                    return proxy.userData;
                }
                GetFatAABB(proxy) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(proxy !== null);
                    }
                    return proxy.aabb;
                }
                Query(callback, aabb) {
                    if (this.m_root === null)
                        return;
                    const stack = b2DynamicTree.s_stack.Reset();
                    stack.Push(this.m_root);
                    while (stack.GetCount() > 0) {
                        const node = stack.Pop();
                        if (node === null) {
                            continue;
                        }
                        if (node.aabb.TestOverlap(aabb)) {
                            if (node.IsLeaf()) {
                                const proceed = callback(node);
                                if (proceed === false) {
                                    return;
                                }
                            }
                            else {
                                stack.Push(node.child1);
                                stack.Push(node.child2);
                            }
                        }
                    }
                }
                RayCast(callback, input) {
                    if (this.m_root === null)
                        return;
                    const p1 = input.p1;
                    const p2 = input.p2;
                    const r = b2Math_5.b2Vec2.SubVV(p2, p1, b2DynamicTree.s_r);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(r.GetLengthSquared() > 0);
                    }
                    r.Normalize();
                    // v is perpendicular to the segment.
                    const v = b2Math_5.b2Vec2.CrossOneV(r, b2DynamicTree.s_v);
                    const abs_v = b2Math_5.b2Vec2.AbsV(v, b2DynamicTree.s_abs_v);
                    // Separating axis for segment (Gino, p80).
                    // |dot(v, p1 - c)| > dot(|v|, h)
                    let maxFraction = input.maxFraction;
                    // Build a bounding box for the segment.
                    const segmentAABB = b2DynamicTree.s_segmentAABB;
                    let t_x = p1.x + maxFraction * (p2.x - p1.x);
                    let t_y = p1.y + maxFraction * (p2.y - p1.y);
                    segmentAABB.lowerBound.x = b2Math_5.b2Min(p1.x, t_x);
                    segmentAABB.lowerBound.y = b2Math_5.b2Min(p1.y, t_y);
                    segmentAABB.upperBound.x = b2Math_5.b2Max(p1.x, t_x);
                    segmentAABB.upperBound.y = b2Math_5.b2Max(p1.y, t_y);
                    const stack = b2DynamicTree.s_stack.Reset();
                    stack.Push(this.m_root);
                    while (stack.GetCount() > 0) {
                        const node = stack.Pop();
                        if (node === null) {
                            continue;
                        }
                        if (b2Collision_1.b2TestOverlapAABB(node.aabb, segmentAABB) === false) {
                            continue;
                        }
                        // Separating axis for segment (Gino, p80).
                        // |dot(v, p1 - c)| > dot(|v|, h)
                        const c = node.aabb.GetCenter();
                        const h = node.aabb.GetExtents();
                        const separation = b2Math_5.b2Abs(b2Math_5.b2Vec2.DotVV(v, b2Math_5.b2Vec2.SubVV(p1, c, b2Math_5.b2Vec2.s_t0))) - b2Math_5.b2Vec2.DotVV(abs_v, h);
                        if (separation > 0) {
                            continue;
                        }
                        if (node.IsLeaf()) {
                            const subInput = b2DynamicTree.s_subInput;
                            subInput.p1.Copy(input.p1);
                            subInput.p2.Copy(input.p2);
                            subInput.maxFraction = maxFraction;
                            const value = callback(subInput, node);
                            if (value === 0) {
                                // The client has terminated the ray cast.
                                return;
                            }
                            if (value > 0) {
                                // Update segment bounding box.
                                maxFraction = value;
                                t_x = p1.x + maxFraction * (p2.x - p1.x);
                                t_y = p1.y + maxFraction * (p2.y - p1.y);
                                segmentAABB.lowerBound.x = b2Math_5.b2Min(p1.x, t_x);
                                segmentAABB.lowerBound.y = b2Math_5.b2Min(p1.y, t_y);
                                segmentAABB.upperBound.x = b2Math_5.b2Max(p1.x, t_x);
                                segmentAABB.upperBound.y = b2Math_5.b2Max(p1.y, t_y);
                            }
                        }
                        else {
                            stack.Push(node.child1);
                            stack.Push(node.child2);
                        }
                    }
                }
                AllocateNode() {
                    // Expand the node pool as needed.
                    if (this.m_freeList) {
                        const node = this.m_freeList;
                        this.m_freeList = node.parent; // this.m_freeList = node.next;
                        node.parent = null;
                        node.child1 = null;
                        node.child2 = null;
                        node.height = 0;
                        node.userData = null;
                        return node;
                    }
                    return new b2TreeNode(b2DynamicTree.s_node_id++);
                }
                FreeNode(node) {
                    node.parent = this.m_freeList; // node.next = this.m_freeList;
                    node.height = -1;
                    this.m_freeList = node;
                }
                CreateProxy(aabb, userData) {
                    const node = this.AllocateNode();
                    // Fatten the aabb.
                    const r_x = b2Settings.b2_aabbExtension;
                    const r_y = b2Settings.b2_aabbExtension;
                    node.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
                    node.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
                    node.aabb.upperBound.x = aabb.upperBound.x + r_x;
                    node.aabb.upperBound.y = aabb.upperBound.y + r_y;
                    node.userData = userData;
                    node.height = 0;
                    this.InsertLeaf(node);
                    return node;
                }
                DestroyProxy(proxy) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(proxy.IsLeaf());
                    }
                    this.RemoveLeaf(proxy);
                    this.FreeNode(proxy);
                }
                MoveProxy(proxy, aabb, displacement) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(proxy.IsLeaf());
                    }
                    if (proxy.aabb.Contains(aabb)) {
                        return false;
                    }
                    this.RemoveLeaf(proxy);
                    // Extend AABB.
                    // Predict AABB displacement.
                    const r_x = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
                    const r_y = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
                    proxy.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
                    proxy.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
                    proxy.aabb.upperBound.x = aabb.upperBound.x + r_x;
                    proxy.aabb.upperBound.y = aabb.upperBound.y + r_y;
                    this.InsertLeaf(proxy);
                    return true;
                }
                InsertLeaf(leaf) {
                    ++this.m_insertionCount;
                    if (this.m_root === null) {
                        this.m_root = leaf;
                        this.m_root.parent = null;
                        return;
                    }
                    // Find the best sibling for this node
                    const leafAABB = leaf.aabb;
                    const center = leafAABB.GetCenter();
                    let index = this.m_root;
                    let child1;
                    let child2;
                    while (index.IsLeaf() === false) {
                        child1 = index.child1;
                        child2 = index.child2;
                        const area = index.aabb.GetPerimeter();
                        const combinedAABB = b2DynamicTree.s_combinedAABB;
                        combinedAABB.Combine2(index.aabb, leafAABB);
                        const combinedArea = combinedAABB.GetPerimeter();
                        // Cost of creating a new parent for this node and the new leaf
                        const cost = 2 * combinedArea;
                        // Minimum cost of pushing the leaf further down the tree
                        const inheritanceCost = 2 * (combinedArea - area);
                        // Cost of descending into child1
                        let cost1;
                        const aabb = b2DynamicTree.s_aabb;
                        let oldArea;
                        let newArea;
                        if (child1.IsLeaf()) {
                            aabb.Combine2(leafAABB, child1.aabb);
                            cost1 = aabb.GetPerimeter() + inheritanceCost;
                        }
                        else {
                            aabb.Combine2(leafAABB, child1.aabb);
                            oldArea = child1.aabb.GetPerimeter();
                            newArea = aabb.GetPerimeter();
                            cost1 = (newArea - oldArea) + inheritanceCost;
                        }
                        // Cost of descending into child2
                        let cost2;
                        if (child2.IsLeaf()) {
                            aabb.Combine2(leafAABB, child2.aabb);
                            cost2 = aabb.GetPerimeter() + inheritanceCost;
                        }
                        else {
                            aabb.Combine2(leafAABB, child2.aabb);
                            oldArea = child2.aabb.GetPerimeter();
                            newArea = aabb.GetPerimeter();
                            cost2 = newArea - oldArea + inheritanceCost;
                        }
                        // Descend according to the minimum cost.
                        if (cost < cost1 && cost < cost2) {
                            break;
                        }
                        // Descend
                        if (cost1 < cost2) {
                            index = child1;
                        }
                        else {
                            index = child2;
                        }
                    }
                    const sibling = index;
                    // Create a parent for the siblings.
                    const oldParent = sibling.parent;
                    const newParent = this.AllocateNode();
                    newParent.parent = oldParent;
                    newParent.userData = null;
                    newParent.aabb.Combine2(leafAABB, sibling.aabb);
                    newParent.height = sibling.height + 1;
                    if (oldParent) {
                        // The sibling was not the root.
                        if (oldParent.child1 === sibling) {
                            oldParent.child1 = newParent;
                        }
                        else {
                            oldParent.child2 = newParent;
                        }
                        newParent.child1 = sibling;
                        newParent.child2 = leaf;
                        sibling.parent = newParent;
                        leaf.parent = newParent;
                    }
                    else {
                        // The sibling was the root.
                        newParent.child1 = sibling;
                        newParent.child2 = leaf;
                        sibling.parent = newParent;
                        leaf.parent = newParent;
                        this.m_root = newParent;
                    }
                    // Walk back up the tree fixing heights and AABBs
                    index = leaf.parent;
                    while (index !== null) {
                        index = this.Balance(index);
                        child1 = index.child1;
                        child2 = index.child2;
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(child1 !== null);
                        }
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(child2 !== null);
                        }
                        index.height = 1 + b2Math_5.b2Max(child1.height, child2.height);
                        index.aabb.Combine2(child1.aabb, child2.aabb);
                        index = index.parent;
                    }
                    // this.Validate();
                }
                RemoveLeaf(leaf) {
                    if (leaf === this.m_root) {
                        this.m_root = null;
                        return;
                    }
                    const parent = leaf.parent;
                    const grandParent = parent.parent;
                    let sibling;
                    if (parent.child1 === leaf) {
                        sibling = parent.child2;
                    }
                    else {
                        sibling = parent.child1;
                    }
                    if (grandParent) {
                        // Destroy parent and connect sibling to grandParent.
                        if (grandParent.child1 === parent) {
                            grandParent.child1 = sibling;
                        }
                        else {
                            grandParent.child2 = sibling;
                        }
                        sibling.parent = grandParent;
                        this.FreeNode(parent);
                        // Adjust ancestor bounds.
                        let index = grandParent;
                        while (index) {
                            index = this.Balance(index);
                            const child1 = index.child1;
                            const child2 = index.child2;
                            index.aabb.Combine2(child1.aabb, child2.aabb);
                            index.height = 1 + b2Math_5.b2Max(child1.height, child2.height);
                            index = index.parent;
                        }
                    }
                    else {
                        this.m_root = sibling;
                        sibling.parent = null;
                        this.FreeNode(parent);
                    }
                    // this.Validate();
                }
                Balance(A) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(A !== null);
                    }
                    if (A.IsLeaf() || A.height < 2) {
                        return A;
                    }
                    const B = A.child1;
                    const C = A.child2;
                    const balance = C.height - B.height;
                    // Rotate C up
                    if (balance > 1) {
                        const F = C.child1;
                        const G = C.child2;
                        // Swap A and C
                        C.child1 = A;
                        C.parent = A.parent;
                        A.parent = C;
                        // A's old parent should point to C
                        if (C.parent !== null) {
                            if (C.parent.child1 === A) {
                                C.parent.child1 = C;
                            }
                            else {
                                if (b2Settings.ENABLE_ASSERTS) {
                                    b2Settings.b2Assert(C.parent.child2 === A);
                                }
                                C.parent.child2 = C;
                            }
                        }
                        else {
                            this.m_root = C;
                        }
                        // Rotate
                        if (F.height > G.height) {
                            C.child2 = F;
                            A.child2 = G;
                            G.parent = A;
                            A.aabb.Combine2(B.aabb, G.aabb);
                            C.aabb.Combine2(A.aabb, F.aabb);
                            A.height = 1 + b2Math_5.b2Max(B.height, G.height);
                            C.height = 1 + b2Math_5.b2Max(A.height, F.height);
                        }
                        else {
                            C.child2 = G;
                            A.child2 = F;
                            F.parent = A;
                            A.aabb.Combine2(B.aabb, F.aabb);
                            C.aabb.Combine2(A.aabb, G.aabb);
                            A.height = 1 + b2Math_5.b2Max(B.height, F.height);
                            C.height = 1 + b2Math_5.b2Max(A.height, G.height);
                        }
                        return C;
                    }
                    // Rotate B up
                    if (balance < -1) {
                        const D = B.child1;
                        const E = B.child2;
                        // Swap A and B
                        B.child1 = A;
                        B.parent = A.parent;
                        A.parent = B;
                        // A's old parent should point to B
                        if (B.parent !== null) {
                            if (B.parent.child1 === A) {
                                B.parent.child1 = B;
                            }
                            else {
                                if (b2Settings.ENABLE_ASSERTS) {
                                    b2Settings.b2Assert(B.parent.child2 === A);
                                }
                                B.parent.child2 = B;
                            }
                        }
                        else {
                            this.m_root = B;
                        }
                        // Rotate
                        if (D.height > E.height) {
                            B.child2 = D;
                            A.child1 = E;
                            E.parent = A;
                            A.aabb.Combine2(C.aabb, E.aabb);
                            B.aabb.Combine2(A.aabb, D.aabb);
                            A.height = 1 + b2Math_5.b2Max(C.height, E.height);
                            B.height = 1 + b2Math_5.b2Max(A.height, D.height);
                        }
                        else {
                            B.child2 = E;
                            A.child1 = D;
                            D.parent = A;
                            A.aabb.Combine2(C.aabb, D.aabb);
                            B.aabb.Combine2(A.aabb, E.aabb);
                            A.height = 1 + b2Math_5.b2Max(C.height, D.height);
                            B.height = 1 + b2Math_5.b2Max(A.height, E.height);
                        }
                        return B;
                    }
                    return A;
                }
                GetHeight() {
                    if (this.m_root === null) {
                        return 0;
                    }
                    return this.m_root.height;
                }
                GetAreaRatio() {
                    if (this.m_root === null) {
                        return 0;
                    }
                    const root = this.m_root;
                    const rootArea = root.aabb.GetPerimeter();
                    const GetAreaNode = function (node) {
                        if (node === null) {
                            return 0;
                        }
                        if (node.IsLeaf()) {
                            return 0;
                        }
                        let area = node.aabb.GetPerimeter();
                        area += GetAreaNode(node.child1);
                        area += GetAreaNode(node.child2);
                        return area;
                    };
                    const totalArea = GetAreaNode(this.m_root);
                    /*
                    float32 totalArea = 0.0;
                    for (int32 i = 0; i < m_nodeCapacity; ++i) {
                      const b2TreeNode* node = m_nodes + i;
                      if (node.height < 0) {
                        // Free node in pool
                        continue;
                      }
                
                      totalArea += node.aabb.GetPerimeter();
                    }
                    */
                    return totalArea / rootArea;
                }
                ComputeHeightNode(node) {
                    if (node.IsLeaf()) {
                        return 0;
                    }
                    const height1 = this.ComputeHeightNode(node.child1);
                    const height2 = this.ComputeHeightNode(node.child2);
                    return 1 + b2Math_5.b2Max(height1, height2);
                }
                ComputeHeight() {
                    const height = this.ComputeHeightNode(this.m_root);
                    return height;
                }
                ValidateStructure(index) {
                    if (index === null) {
                        return;
                    }
                    if (index === this.m_root) {
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(index.parent === null);
                        }
                    }
                    const node = index;
                    const child1 = node.child1;
                    const child2 = node.child2;
                    if (node.IsLeaf()) {
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(child1 === null);
                        }
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(child2 === null);
                        }
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(node.height === 0);
                        }
                        return;
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(child1.parent === index);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(child2.parent === index);
                    }
                    this.ValidateStructure(child1);
                    this.ValidateStructure(child2);
                }
                ValidateMetrics(index) {
                    if (index === null) {
                        return;
                    }
                    const node = index;
                    const child1 = node.child1;
                    const child2 = node.child2;
                    if (node.IsLeaf()) {
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(child1 === null);
                        }
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(child2 === null);
                        }
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(node.height === 0);
                        }
                        return;
                    }
                    const height1 = child1.height;
                    const height2 = child2.height;
                    const height = 1 + b2Math_5.b2Max(height1, height2);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(node.height === height);
                    }
                    const aabb = b2DynamicTree.s_aabb;
                    aabb.Combine2(child1.aabb, child2.aabb);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(aabb.lowerBound === node.aabb.lowerBound);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(aabb.upperBound === node.aabb.upperBound);
                    }
                    this.ValidateMetrics(child1);
                    this.ValidateMetrics(child2);
                }
                Validate() {
                    this.ValidateStructure(this.m_root);
                    this.ValidateMetrics(this.m_root);
                    let freeCount = 0;
                    let freeIndex = this.m_freeList;
                    while (freeIndex !== null) {
                        freeIndex = freeIndex.parent; // freeIndex = freeIndex.next;
                        ++freeCount;
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.GetHeight() === this.ComputeHeight());
                    }
                }
                GetMaxBalance() {
                    const GetMaxBalanceNode = function (node, maxBalance) {
                        if (node === null) {
                            return maxBalance;
                        }
                        if (node.height <= 1) {
                            return maxBalance;
                        }
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(node.IsLeaf() === false);
                        }
                        const child1 = node.child1;
                        const child2 = node.child2;
                        const balance = b2Math_5.b2Abs(child2.height - child1.height);
                        return b2Math_5.b2Max(maxBalance, balance);
                    };
                    const maxBalance = GetMaxBalanceNode(this.m_root, 0);
                    /*
                    int32 maxBalance = 0;
                    for (int32 i = 0; i < m_nodeCapacity; ++i) {
                      const b2TreeNode* node = m_nodes + i;
                      if (node.height <= 1) {
                        continue;
                      }
                
                      b2Settings.b2Assert(node.IsLeaf() === false);
                
                      int32 child1 = node.child1;
                      int32 child2 = node.child2;
                      int32 balance = b2Abs(m_nodes[child2].height - m_nodes[child1].height);
                      maxBalance = b2Max(maxBalance, balance);
                    }
                    */
                    return maxBalance;
                }
                RebuildBottomUp() {
                    /*
                    int32* nodes = (int32*)b2Alloc(m_nodeCount * sizeof(int32));
                    int32 count = 0;
                
                    // Build array of leaves. Free the rest.
                    for (int32 i = 0; i < m_nodeCapacity; ++i) {
                      if (m_nodes[i].height < 0) {
                        // free node in pool
                        continue;
                      }
                
                      if (m_nodes[i].IsLeaf()) {
                        m_nodes[i].parent = b2_nullNode;
                        nodes[count] = i;
                        ++count;
                      } else {
                        FreeNode(i);
                      }
                    }
                
                    while (count > 1) {
                      float32 minCost = b2Settings.b2_maxFloat;
                      int32 iMin = -1, jMin = -1;
                      for (int32 i = 0; i < count; ++i) {
                        b2AABB aabbi = m_nodes[nodes[i]].aabb;
                
                        for (int32 j = i + 1; j < count; ++j) {
                          b2AABB aabbj = m_nodes[nodes[j]].aabb;
                          b2AABB b;
                          b.Combine(aabbi, aabbj);
                          float32 cost = b.GetPerimeter();
                          if (cost < minCost) {
                            iMin = i;
                            jMin = j;
                            minCost = cost;
                          }
                        }
                      }
                
                      int32 index1 = nodes[iMin];
                      int32 index2 = nodes[jMin];
                      b2TreeNode* child1 = m_nodes + index1;
                      b2TreeNode* child2 = m_nodes + index2;
                
                      int32 parentIndex = AllocateNode();
                      b2TreeNode* parent = m_nodes + parentIndex;
                      parent.child1 = index1;
                      parent.child2 = index2;
                      parent.height = 1 + b2Max(child1.height, child2.height);
                      parent.aabb.Combine(child1.aabb, child2.aabb);
                      parent.parent = b2_nullNode;
                
                      child1.parent = parentIndex;
                      child2.parent = parentIndex;
                
                      nodes[jMin] = nodes[count-1];
                      nodes[iMin] = parentIndex;
                      --count;
                    }
                
                    m_root = nodes[0];
                    b2Free(nodes);
                    */
                    this.Validate();
                }
                ShiftOrigin(newOrigin) {
                    const ShiftOriginNode = function (node, newOrigin) {
                        if (node === null) {
                            return;
                        }
                        if (node.height <= 1) {
                            return;
                        }
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(node.IsLeaf() === false);
                        }
                        const child1 = node.child1;
                        const child2 = node.child2;
                        ShiftOriginNode(child1, newOrigin);
                        ShiftOriginNode(child2, newOrigin);
                        node.aabb.lowerBound.SelfSub(newOrigin);
                        node.aabb.upperBound.SelfSub(newOrigin);
                    };
                    ShiftOriginNode(this.m_root, newOrigin);
                    /*
                    // Build array of leaves. Free the rest.
                    for (int32 i = 0; i < m_nodeCapacity; ++i) {
                      m_nodes[i].aabb.lowerBound -= newOrigin;
                      m_nodes[i].aabb.upperBound -= newOrigin;
                    }
                    */
                }
            };
            b2DynamicTree.s_stack = new b2GrowableStack_1.b2GrowableStack(256);
            b2DynamicTree.s_r = new b2Math_5.b2Vec2();
            b2DynamicTree.s_v = new b2Math_5.b2Vec2();
            b2DynamicTree.s_abs_v = new b2Math_5.b2Vec2();
            b2DynamicTree.s_segmentAABB = new b2Collision_1.b2AABB();
            b2DynamicTree.s_subInput = new b2Collision_1.b2RayCastInput();
            b2DynamicTree.s_combinedAABB = new b2Collision_1.b2AABB();
            b2DynamicTree.s_aabb = new b2Collision_1.b2AABB();
            b2DynamicTree.s_node_id = 0;
            exports_9("b2DynamicTree", b2DynamicTree);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/b2BroadPhase", ["Box2D/Collision/b2Collision", "Box2D/Collision/b2DynamicTree"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var b2Collision_2, b2DynamicTree_1;
    var b2Pair, b2BroadPhase;
    /// This is used to sort pairs.
    function b2PairLessThan(pair1, pair2) {
        if (pair1.proxyA.m_id === pair2.proxyA.m_id) {
            return pair1.proxyB.m_id - pair2.proxyB.m_id;
        }
        return pair1.proxyA.m_id - pair2.proxyA.m_id;
    }
    exports_10("b2PairLessThan", b2PairLessThan);
    return {
        setters:[
            function (b2Collision_2_1) {
                b2Collision_2 = b2Collision_2_1;
            },
            function (b2DynamicTree_1_1) {
                b2DynamicTree_1 = b2DynamicTree_1_1;
            }],
        execute: function() {
            b2Pair = class b2Pair {
                constructor() {
                    this.proxyA = null;
                    this.proxyB = null;
                }
            };
            exports_10("b2Pair", b2Pair);
            /// The broad-phase is used for computing pairs and performing volume queries and ray casts.
            /// This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
            /// It is up to the client to consume the new pairs and to track subsequent overlap.
            b2BroadPhase = class b2BroadPhase {
                constructor() {
                    this.m_tree = new b2DynamicTree_1.b2DynamicTree();
                    this.m_proxyCount = 0;
                    // public m_moveCapacity: number = 16;
                    this.m_moveCount = 0;
                    this.m_moveBuffer = [];
                    // public m_pairCapacity: number = 16;
                    this.m_pairCount = 0;
                    this.m_pairBuffer = [];
                }
                // public m_queryProxyId: number = 0;
                /// Create a proxy with an initial AABB. Pairs are not reported until
                /// UpdatePairs is called.
                CreateProxy(aabb, userData) {
                    const proxy = this.m_tree.CreateProxy(aabb, userData);
                    ++this.m_proxyCount;
                    this.BufferMove(proxy);
                    return proxy;
                }
                /// Destroy a proxy. It is up to the client to remove any pairs.
                DestroyProxy(proxy) {
                    this.UnBufferMove(proxy);
                    --this.m_proxyCount;
                    this.m_tree.DestroyProxy(proxy);
                }
                /// Call MoveProxy as many times as you like, then when you are done
                /// call UpdatePairs to finalized the proxy pairs (for your time step).
                MoveProxy(proxy, aabb, displacement) {
                    const buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
                    if (buffer) {
                        this.BufferMove(proxy);
                    }
                }
                /// Call to trigger a re-processing of it's pairs on the next call to UpdatePairs.
                TouchProxy(proxy) {
                    this.BufferMove(proxy);
                }
                /// Get the fat AABB for a proxy.
                GetFatAABB(proxy) {
                    return this.m_tree.GetFatAABB(proxy);
                }
                /// Get user data from a proxy. Returns NULL if the id is invalid.
                GetUserData(proxy) {
                    return this.m_tree.GetUserData(proxy);
                }
                /// Test overlap of fat AABBs.
                TestOverlap(proxyA, proxyB) {
                    const aabbA = this.m_tree.GetFatAABB(proxyA);
                    const aabbB = this.m_tree.GetFatAABB(proxyB);
                    return b2Collision_2.b2TestOverlapAABB(aabbA, aabbB);
                }
                /// Get the number of proxies.
                GetProxyCount() {
                    return this.m_proxyCount;
                }
                /// Update the pairs. This results in pair callbacks. This can only add pairs.
                UpdatePairs(contactManager) {
                    // Reset pair buffer
                    this.m_pairCount = 0;
                    // Perform tree queries for all moving proxies.
                    for (let i = 0; i < this.m_moveCount; ++i) {
                        const queryProxy = this.m_moveBuffer[i];
                        if (queryProxy === null) {
                            continue;
                        }
                        const that = this;
                        // This is called from box2d.b2DynamicTree::Query when we are gathering pairs.
                        // boolean b2BroadPhase::QueryCallback(int32 proxyId);
                        const QueryCallback = function (proxy) {
                            // A proxy cannot form a pair with itself.
                            if (proxy.m_id === queryProxy.m_id) {
                                return true;
                            }
                            // Grow the pair buffer as needed.
                            if (that.m_pairCount === that.m_pairBuffer.length) {
                                that.m_pairBuffer[that.m_pairCount] = new b2Pair();
                            }
                            const pair = that.m_pairBuffer[that.m_pairCount];
                            // pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
                            // pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;
                            if (proxy.m_id < queryProxy.m_id) {
                                pair.proxyA = proxy;
                                pair.proxyB = queryProxy;
                            }
                            else {
                                pair.proxyA = queryProxy;
                                pair.proxyB = proxy;
                            }
                            ++that.m_pairCount;
                            return true;
                        };
                        // We have to query the tree with the fat AABB so that
                        // we don't fail to create a pair that may touch later.
                        const fatAABB = this.m_tree.GetFatAABB(queryProxy);
                        // Query tree, create pairs and add them pair buffer.
                        this.m_tree.Query(QueryCallback, fatAABB);
                    }
                    // Reset move buffer
                    this.m_moveCount = 0;
                    // Sort the pair buffer to expose duplicates.
                    this.m_pairBuffer.length = this.m_pairCount;
                    this.m_pairBuffer.sort(b2PairLessThan);
                    // Send the pairs back to the client.
                    let i = 0;
                    while (i < this.m_pairCount) {
                        const primaryPair = this.m_pairBuffer[i];
                        const userDataA = this.m_tree.GetUserData(primaryPair.proxyA);
                        const userDataB = this.m_tree.GetUserData(primaryPair.proxyB);
                        contactManager.AddPair(userDataA, userDataB);
                        ++i;
                        // Skip any duplicate pairs.
                        while (i < this.m_pairCount) {
                            const pair = this.m_pairBuffer[i];
                            if (pair.proxyA.m_id !== primaryPair.proxyA.m_id || pair.proxyB.m_id !== primaryPair.proxyB.m_id) {
                                break;
                            }
                            ++i;
                        }
                    }
                    // Try to keep the tree balanced.
                    // this.m_tree.Rebalance(4);
                }
                /// Query an AABB for overlapping proxies. The callback class
                /// is called for each proxy that overlaps the supplied AABB.
                Query(callback, aabb) {
                    this.m_tree.Query(callback, aabb);
                }
                /// Ray-cast against the proxies in the tree. This relies on the callback
                /// to perform a exact ray-cast in the case were the proxy contains a shape.
                /// The callback also performs the any collision filtering. This has performance
                /// roughly equal to k * log(n), where k is the number of collisions and n is the
                /// number of proxies in the tree.
                /// @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
                /// @param callback a callback class that is called for each proxy that is hit by the ray.
                RayCast(callback, input) {
                    this.m_tree.RayCast(callback, input);
                }
                /// Get the height of the embedded tree.
                GetTreeHeight() {
                    return this.m_tree.GetHeight();
                }
                /// Get the balance of the embedded tree.
                GetTreeBalance() {
                    return this.m_tree.GetMaxBalance();
                }
                /// Get the quality metric of the embedded tree.
                GetTreeQuality() {
                    return this.m_tree.GetAreaRatio();
                }
                /// Shift the world origin. Useful for large worlds.
                /// The shift formula is: position -= newOrigin
                /// @param newOrigin the new origin with respect to the old origin
                ShiftOrigin(newOrigin) {
                    this.m_tree.ShiftOrigin(newOrigin);
                }
                BufferMove(proxy) {
                    this.m_moveBuffer[this.m_moveCount] = proxy;
                    ++this.m_moveCount;
                }
                UnBufferMove(proxy) {
                    const i = this.m_moveBuffer.indexOf(proxy);
                    this.m_moveBuffer[i] = null;
                }
            };
            exports_10("b2BroadPhase", b2BroadPhase);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/b2TimeOfImpact", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Common/b2Timer", "Box2D/Collision/b2Distance"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var b2Settings, b2Math_6, b2Timer_1, b2Distance_2;
    var b2_toiTime, b2_toiMaxTime, b2_toiCalls, b2_toiIters, b2_toiMaxIters, b2_toiRootIters, b2_toiMaxRootIters, b2TimeOfImpact_s_xfA, b2TimeOfImpact_s_xfB, b2TimeOfImpact_s_pointA, b2TimeOfImpact_s_pointB, b2TimeOfImpact_s_normal, b2TimeOfImpact_s_axisA, b2TimeOfImpact_s_axisB, b2TOIInput, b2TOIOutput, b2SeparationFunction, b2TimeOfImpact_s_timer, b2TimeOfImpact_s_cache, b2TimeOfImpact_s_distanceInput, b2TimeOfImpact_s_distanceOutput, b2TimeOfImpact_s_fcn, b2TimeOfImpact_s_indexA, b2TimeOfImpact_s_indexB, b2TimeOfImpact_s_sweepA, b2TimeOfImpact_s_sweepB;
    function b2TimeOfImpact(output, input) {
        const timer = b2TimeOfImpact_s_timer.Reset();
        exports_11("b2_toiCalls", ++b2_toiCalls);
        output.state = 0 /* e_unknown */;
        output.t = input.tMax;
        const proxyA = input.proxyA;
        const proxyB = input.proxyB;
        const sweepA = b2TimeOfImpact_s_sweepA.Copy(input.sweepA);
        const sweepB = b2TimeOfImpact_s_sweepB.Copy(input.sweepB);
        // Large rotations can make the root finder fail, so we normalize the
        // sweep angles.
        sweepA.Normalize();
        sweepB.Normalize();
        const tMax = input.tMax;
        const totalRadius = proxyA.m_radius + proxyB.m_radius;
        const target = b2Math_6.b2Max(b2Settings.b2_linearSlop, totalRadius - 3 * b2Settings.b2_linearSlop);
        const tolerance = 0.25 * b2Settings.b2_linearSlop;
        if (b2Settings.ENABLE_ASSERTS) {
            b2Settings.b2Assert(target > tolerance);
        }
        let t1 = 0;
        const k_maxIterations = 20; // TODO_ERIN b2Settings
        let iter = 0;
        // Prepare input for distance query.
        const cache = b2TimeOfImpact_s_cache;
        cache.count = 0;
        const distanceInput = b2TimeOfImpact_s_distanceInput;
        distanceInput.proxyA = input.proxyA;
        distanceInput.proxyB = input.proxyB;
        distanceInput.useRadii = false;
        // The outer loop progressively attempts to compute new separating axes.
        // This loop terminates when an axis is repeated (no progress is made).
        for (;;) {
            const xfA = b2TimeOfImpact_s_xfA;
            const xfB = b2TimeOfImpact_s_xfB;
            sweepA.GetTransform(xfA, t1);
            sweepB.GetTransform(xfB, t1);
            // Get the distance between shapes. We can also use the results
            // to get a separating axis.
            distanceInput.transformA.Copy(xfA);
            distanceInput.transformB.Copy(xfB);
            const distanceOutput = b2TimeOfImpact_s_distanceOutput;
            b2Distance_2.b2Distance(distanceOutput, cache, distanceInput);
            // If the shapes are overlapped, we give up on continuous collision.
            if (distanceOutput.distance <= 0) {
                // Failure!
                output.state = 2 /* e_overlapped */;
                output.t = 0;
                break;
            }
            if (distanceOutput.distance < target + tolerance) {
                // Victory!
                output.state = 3 /* e_touching */;
                output.t = t1;
                break;
            }
            // Initialize the separating axis.
            const fcn = b2TimeOfImpact_s_fcn;
            fcn.Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1);
            /*
            #if 0
                // Dump the curve seen by the root finder {
                  const int32 N = 100;
                  float32 dx = 1.0f / N;
                  float32 xs[N+1];
                  float32 fs[N+1];
            
                  float32 x = 0.0f;
            
                  for (int32 i = 0; i <= N; ++i) {
                    sweepA.GetTransform(&xfA, x);
                    sweepB.GetTransform(&xfB, x);
                    float32 f = fcn.Evaluate(xfA, xfB) - target;
            
                    printf("%g %g\n", x, f);
            
                    xs[i] = x;
                    fs[i] = f;
            
                    x += dx;
                  }
                }
            #endif
            */
            // Compute the TOI on the separating axis. We do this by successively
            // resolving the deepest point. This loop is bounded by the number of vertices.
            let done = false;
            let t2 = tMax;
            let pushBackIter = 0;
            for (;;) {
                // Find the deepest point at t2. Store the witness point indices.
                const indexA = b2TimeOfImpact_s_indexA;
                const indexB = b2TimeOfImpact_s_indexB;
                let s2 = fcn.FindMinSeparation(indexA, indexB, t2);
                // Is the final configuration separated?
                if (s2 > (target + tolerance)) {
                    // Victory!
                    output.state = 4 /* e_separated */;
                    output.t = tMax;
                    done = true;
                    break;
                }
                // Has the separation reached tolerance?
                if (s2 > (target - tolerance)) {
                    // Advance the sweeps
                    t1 = t2;
                    break;
                }
                // Compute the initial separation of the witness points.
                let s1 = fcn.Evaluate(indexA[0], indexB[0], t1);
                // Check for initial overlap. This might happen if the root finder
                // runs out of iterations.
                if (s1 < (target - tolerance)) {
                    output.state = 1 /* e_failed */;
                    output.t = t1;
                    done = true;
                    break;
                }
                // Check for touching
                if (s1 <= (target + tolerance)) {
                    // Victory! t1 should hold the TOI (could be 0.0).
                    output.state = 3 /* e_touching */;
                    output.t = t1;
                    done = true;
                    break;
                }
                // Compute 1D root of: f(x) - target = 0
                let rootIterCount = 0;
                let a1 = t1;
                let a2 = t2;
                for (;;) {
                    // Use a mix of the secant rule and bisection.
                    let t = 0;
                    if (rootIterCount & 1) {
                        // Secant rule to improve convergence.
                        t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
                    }
                    else {
                        // Bisection to guarantee progress.
                        t = 0.5 * (a1 + a2);
                    }
                    ++rootIterCount;
                    exports_11("b2_toiRootIters", ++b2_toiRootIters);
                    const s = fcn.Evaluate(indexA[0], indexB[0], t);
                    if (b2Math_6.b2Abs(s - target) < tolerance) {
                        // t2 holds a tentative value for t1
                        t2 = t;
                        break;
                    }
                    // Ensure we continue to bracket the root.
                    if (s > target) {
                        a1 = t;
                        s1 = s;
                    }
                    else {
                        a2 = t;
                        s2 = s;
                    }
                    if (rootIterCount === 50) {
                        break;
                    }
                }
                exports_11("b2_toiMaxRootIters", b2_toiMaxRootIters = b2Math_6.b2Max(b2_toiMaxRootIters, rootIterCount));
                ++pushBackIter;
                if (pushBackIter === b2Settings.b2_maxPolygonVertices) {
                    break;
                }
            }
            ++iter;
            exports_11("b2_toiIters", ++b2_toiIters);
            if (done) {
                break;
            }
            if (iter === k_maxIterations) {
                // Root finder got stuck. Semi-victory.
                output.state = 1 /* e_failed */;
                output.t = t1;
                break;
            }
        }
        exports_11("b2_toiMaxIters", b2_toiMaxIters = b2Math_6.b2Max(b2_toiMaxIters, iter));
        const time = timer.GetMilliseconds();
        exports_11("b2_toiMaxTime", b2_toiMaxTime = b2Math_6.b2Max(b2_toiMaxTime, time));
        exports_11("b2_toiTime", b2_toiTime += time);
    }
    exports_11("b2TimeOfImpact", b2TimeOfImpact);
    return {
        setters:[
            function (b2Settings_6) {
                b2Settings = b2Settings_6;
            },
            function (b2Math_6_1) {
                b2Math_6 = b2Math_6_1;
            },
            function (b2Timer_1_1) {
                b2Timer_1 = b2Timer_1_1;
            },
            function (b2Distance_2_1) {
                b2Distance_2 = b2Distance_2_1;
            }],
        execute: function() {
            exports_11("b2_toiTime", b2_toiTime = 0);
            exports_11("b2_toiMaxTime", b2_toiMaxTime = 0);
            exports_11("b2_toiCalls", b2_toiCalls = 0);
            exports_11("b2_toiIters", b2_toiIters = 0);
            exports_11("b2_toiMaxIters", b2_toiMaxIters = 0);
            exports_11("b2_toiRootIters", b2_toiRootIters = 0);
            exports_11("b2_toiMaxRootIters", b2_toiMaxRootIters = 0);
            b2TimeOfImpact_s_xfA = new b2Math_6.b2Transform();
            b2TimeOfImpact_s_xfB = new b2Math_6.b2Transform();
            b2TimeOfImpact_s_pointA = new b2Math_6.b2Vec2();
            b2TimeOfImpact_s_pointB = new b2Math_6.b2Vec2();
            b2TimeOfImpact_s_normal = new b2Math_6.b2Vec2();
            b2TimeOfImpact_s_axisA = new b2Math_6.b2Vec2();
            b2TimeOfImpact_s_axisB = new b2Math_6.b2Vec2();
            /// Input parameters for b2TimeOfImpact
            b2TOIInput = class b2TOIInput {
                constructor() {
                    this.proxyA = new b2Distance_2.b2DistanceProxy();
                    this.proxyB = new b2Distance_2.b2DistanceProxy();
                    this.sweepA = new b2Math_6.b2Sweep();
                    this.sweepB = new b2Math_6.b2Sweep();
                    this.tMax = 0; // defines sweep interval [0, tMax]
                }
            };
            exports_11("b2TOIInput", b2TOIInput);
            b2TOIOutput = class b2TOIOutput {
                constructor() {
                    this.state = 0 /* e_unknown */;
                    this.t = 0;
                }
            };
            exports_11("b2TOIOutput", b2TOIOutput);
            b2SeparationFunction = class b2SeparationFunction {
                constructor() {
                    this.m_proxyA = null;
                    this.m_proxyB = null;
                    this.m_sweepA = new b2Math_6.b2Sweep();
                    this.m_sweepB = new b2Math_6.b2Sweep();
                    this.m_type = -1 /* e_unknown */;
                    this.m_localPoint = new b2Math_6.b2Vec2();
                    this.m_axis = new b2Math_6.b2Vec2();
                }
                Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1) {
                    this.m_proxyA = proxyA;
                    this.m_proxyB = proxyB;
                    const count = cache.count;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 < count && count < 3);
                    }
                    this.m_sweepA.Copy(sweepA);
                    this.m_sweepB.Copy(sweepB);
                    const xfA = b2TimeOfImpact_s_xfA;
                    const xfB = b2TimeOfImpact_s_xfB;
                    this.m_sweepA.GetTransform(xfA, t1);
                    this.m_sweepB.GetTransform(xfB, t1);
                    if (count === 1) {
                        this.m_type = 0 /* e_points */;
                        const localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
                        const localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
                        const pointA = b2Math_6.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                        const pointB = b2Math_6.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                        b2Math_6.b2Vec2.SubVV(pointB, pointA, this.m_axis);
                        const s = this.m_axis.Normalize();
                        return s;
                    }
                    else if (cache.indexA[0] === cache.indexA[1]) {
                        // Two points on B and one on A.
                        this.m_type = 2 /* e_faceB */;
                        const localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
                        const localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
                        b2Math_6.b2Vec2.CrossVOne(b2Math_6.b2Vec2.SubVV(localPointB2, localPointB1, b2Math_6.b2Vec2.s_t0), this.m_axis).SelfNormalize();
                        const normal = b2Math_6.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                        b2Math_6.b2Vec2.MidVV(localPointB1, localPointB2, this.m_localPoint);
                        const pointB = b2Math_6.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                        const localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
                        const pointA = b2Math_6.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                        let s = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointA, pointB, b2Math_6.b2Vec2.s_t0), normal);
                        if (s < 0) {
                            this.m_axis.SelfNeg();
                            s = -s;
                        }
                        return s;
                    }
                    else {
                        // Two points on A and one or two points on B.
                        this.m_type = 1 /* e_faceA */;
                        const localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
                        const localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
                        b2Math_6.b2Vec2.CrossVOne(b2Math_6.b2Vec2.SubVV(localPointA2, localPointA1, b2Math_6.b2Vec2.s_t0), this.m_axis).SelfNormalize();
                        const normal = b2Math_6.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                        b2Math_6.b2Vec2.MidVV(localPointA1, localPointA2, this.m_localPoint);
                        const pointA = b2Math_6.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                        const localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
                        const pointB = b2Math_6.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                        let s = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointB, pointA, b2Math_6.b2Vec2.s_t0), normal);
                        if (s < 0) {
                            this.m_axis.SelfNeg();
                            s = -s;
                        }
                        return s;
                    }
                }
                FindMinSeparation(indexA, indexB, t) {
                    const xfA = b2TimeOfImpact_s_xfA;
                    const xfB = b2TimeOfImpact_s_xfB;
                    this.m_sweepA.GetTransform(xfA, t);
                    this.m_sweepB.GetTransform(xfB, t);
                    switch (this.m_type) {
                        case 0 /* e_points */: {
                            const axisA = b2Math_6.b2Rot.MulTRV(xfA.q, this.m_axis, b2TimeOfImpact_s_axisA);
                            const axisB = b2Math_6.b2Rot.MulTRV(xfB.q, b2Math_6.b2Vec2.NegV(this.m_axis, b2Math_6.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                            indexA[0] = this.m_proxyA.GetSupport(axisA);
                            indexB[0] = this.m_proxyB.GetSupport(axisB);
                            const localPointA = this.m_proxyA.GetVertex(indexA[0]);
                            const localPointB = this.m_proxyB.GetVertex(indexB[0]);
                            const pointA = b2Math_6.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const pointB = b2Math_6.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointB, pointA, b2Math_6.b2Vec2.s_t0), this.m_axis);
                            return separation;
                        }
                        case 1 /* e_faceA */: {
                            const normal = b2Math_6.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointA = b2Math_6.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                            const axisB = b2Math_6.b2Rot.MulTRV(xfB.q, b2Math_6.b2Vec2.NegV(normal, b2Math_6.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                            indexA[0] = -1;
                            indexB[0] = this.m_proxyB.GetSupport(axisB);
                            const localPointB = this.m_proxyB.GetVertex(indexB[0]);
                            const pointB = b2Math_6.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointB, pointA, b2Math_6.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        case 2 /* e_faceB */: {
                            const normal = b2Math_6.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointB = b2Math_6.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                            const axisA = b2Math_6.b2Rot.MulTRV(xfA.q, b2Math_6.b2Vec2.NegV(normal, b2Math_6.b2Vec2.s_t0), b2TimeOfImpact_s_axisA);
                            indexB[0] = -1;
                            indexA[0] = this.m_proxyA.GetSupport(axisA);
                            const localPointA = this.m_proxyA.GetVertex(indexA[0]);
                            const pointA = b2Math_6.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const separation = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointA, pointB, b2Math_6.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        default:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            indexA[0] = -1;
                            indexB[0] = -1;
                            return 0;
                    }
                }
                Evaluate(indexA, indexB, t) {
                    const xfA = b2TimeOfImpact_s_xfA;
                    const xfB = b2TimeOfImpact_s_xfB;
                    this.m_sweepA.GetTransform(xfA, t);
                    this.m_sweepB.GetTransform(xfB, t);
                    switch (this.m_type) {
                        case 0 /* e_points */: {
                            const localPointA = this.m_proxyA.GetVertex(indexA);
                            const localPointB = this.m_proxyB.GetVertex(indexB);
                            const pointA = b2Math_6.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const pointB = b2Math_6.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointB, pointA, b2Math_6.b2Vec2.s_t0), this.m_axis);
                            return separation;
                        }
                        case 1 /* e_faceA */: {
                            const normal = b2Math_6.b2Rot.MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointA = b2Math_6.b2Transform.MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                            const localPointB = this.m_proxyB.GetVertex(indexB);
                            const pointB = b2Math_6.b2Transform.MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                            const separation = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointB, pointA, b2Math_6.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        case 2 /* e_faceB */: {
                            const normal = b2Math_6.b2Rot.MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                            const pointB = b2Math_6.b2Transform.MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                            const localPointA = this.m_proxyA.GetVertex(indexA);
                            const pointA = b2Math_6.b2Transform.MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                            const separation = b2Math_6.b2Vec2.DotVV(b2Math_6.b2Vec2.SubVV(pointA, pointB, b2Math_6.b2Vec2.s_t0), normal);
                            return separation;
                        }
                        default:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            return 0;
                    }
                }
            };
            exports_11("b2SeparationFunction", b2SeparationFunction);
            b2TimeOfImpact_s_timer = new b2Timer_1.b2Timer();
            b2TimeOfImpact_s_cache = new b2Distance_2.b2SimplexCache();
            b2TimeOfImpact_s_distanceInput = new b2Distance_2.b2DistanceInput();
            b2TimeOfImpact_s_distanceOutput = new b2Distance_2.b2DistanceOutput();
            b2TimeOfImpact_s_fcn = new b2SeparationFunction();
            b2TimeOfImpact_s_indexA = b2Settings.b2MakeNumberArray(1);
            b2TimeOfImpact_s_indexB = b2Settings.b2MakeNumberArray(1);
            b2TimeOfImpact_s_sweepA = new b2Math_6.b2Sweep();
            b2TimeOfImpact_s_sweepB = new b2Math_6.b2Sweep();
        }
    }
});
/*
* Copyright (c) 2006-2010 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/Shapes/b2EdgeShape", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/Shapes/b2Shape"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var b2Settings, b2Math_7, b2Shape_1;
    var b2EdgeShape;
    return {
        setters:[
            function (b2Settings_7) {
                b2Settings = b2Settings_7;
            },
            function (b2Math_7_1) {
                b2Math_7 = b2Math_7_1;
            },
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            }],
        execute: function() {
            /// A line segment (edge) shape. These can be connected in chains or loops
            /// to other edge shapes. The connectivity information is used to ensure
            /// correct contact normals.
            b2EdgeShape = class b2EdgeShape extends b2Shape_1.b2Shape {
                constructor() {
                    super(1 /* e_edgeShape */, b2Settings.b2_polygonRadius);
                    this.m_vertex1 = new b2Math_7.b2Vec2();
                    this.m_vertex2 = new b2Math_7.b2Vec2();
                    this.m_vertex0 = new b2Math_7.b2Vec2();
                    this.m_vertex3 = new b2Math_7.b2Vec2();
                    this.m_hasVertex0 = false;
                    this.m_hasVertex3 = false;
                }
                /// Set this as an isolated edge.
                SetAsEdge(v1, v2) {
                    this.m_vertex1.Copy(v1);
                    this.m_vertex2.Copy(v2);
                    this.m_hasVertex0 = false;
                    this.m_hasVertex3 = false;
                    return this;
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2EdgeShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(other instanceof b2EdgeShape);
                    }
                    this.m_vertex1.Copy(other.m_vertex1);
                    this.m_vertex2.Copy(other.m_vertex2);
                    this.m_vertex0.Copy(other.m_vertex0);
                    this.m_vertex3.Copy(other.m_vertex3);
                    this.m_hasVertex0 = other.m_hasVertex0;
                    this.m_hasVertex3 = other.m_hasVertex3;
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    return 1;
                }
                /// @see b2Shape::TestPoint
                TestPoint(xf, p) {
                    return false;
                }
                RayCast(output, input, xf, childIndex) {
                    // Put the ray into the edge's frame of reference.
                    const p1 = b2Math_7.b2Transform.MulTXV(xf, input.p1, b2EdgeShape.RayCast_s_p1);
                    const p2 = b2Math_7.b2Transform.MulTXV(xf, input.p2, b2EdgeShape.RayCast_s_p2);
                    const d = b2Math_7.b2Vec2.SubVV(p2, p1, b2EdgeShape.RayCast_s_d);
                    const v1 = this.m_vertex1;
                    const v2 = this.m_vertex2;
                    const e = b2Math_7.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_e);
                    const normal = output.normal.SetXY(e.y, -e.x).SelfNormalize();
                    // q = p1 + t * d
                    // dot(normal, q - v1) = 0
                    // dot(normal, p1 - v1) + t * dot(normal, d) = 0
                    const numerator = b2Math_7.b2Vec2.DotVV(normal, b2Math_7.b2Vec2.SubVV(v1, p1, b2Math_7.b2Vec2.s_t0));
                    const denominator = b2Math_7.b2Vec2.DotVV(normal, d);
                    if (denominator === 0) {
                        return false;
                    }
                    const t = numerator / denominator;
                    if (t < 0 || input.maxFraction < t) {
                        return false;
                    }
                    const q = b2Math_7.b2Vec2.AddVMulSV(p1, t, d, b2EdgeShape.RayCast_s_q);
                    // q = v1 + s * r
                    // s = dot(q - v1, r) / dot(r, r)
                    const r = b2Math_7.b2Vec2.SubVV(v2, v1, b2EdgeShape.RayCast_s_r);
                    const rr = b2Math_7.b2Vec2.DotVV(r, r);
                    if (rr === 0) {
                        return false;
                    }
                    const s = b2Math_7.b2Vec2.DotVV(b2Math_7.b2Vec2.SubVV(q, v1, b2Math_7.b2Vec2.s_t0), r) / rr;
                    if (s < 0 || 1 < s) {
                        return false;
                    }
                    output.fraction = t;
                    if (numerator > 0) {
                        output.normal.SelfNeg();
                    }
                    return true;
                }
                ComputeAABB(aabb, xf, childIndex) {
                    const v1 = b2Math_7.b2Transform.MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeAABB_s_v1);
                    const v2 = b2Math_7.b2Transform.MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeAABB_s_v2);
                    b2Math_7.b2Vec2.MinV(v1, v2, aabb.lowerBound);
                    b2Math_7.b2Vec2.MaxV(v1, v2, aabb.upperBound);
                    const r = this.m_radius;
                    aabb.lowerBound.SelfSubXY(r, r);
                    aabb.upperBound.SelfAddXY(r, r);
                }
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    massData.mass = 0;
                    b2Math_7.b2Vec2.MidVV(this.m_vertex1, this.m_vertex2, massData.center);
                    massData.I = 0;
                }
                SetupDistanceProxy(proxy, index) {
                    proxy.m_vertices = new Array(2);
                    proxy.m_vertices[0] = this.m_vertex1;
                    proxy.m_vertices[1] = this.m_vertex2;
                    proxy.m_count = 2;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    c.SetZero();
                    return 0;
                }
                Dump() {
                    b2Settings.b2Log("    const shape: b2EdgeShape = new b2EdgeShape();\n");
                    b2Settings.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
                    b2Settings.b2Log("    shape.m_vertex0.SetXY(%.15f, %.15f);\n", this.m_vertex0.x, this.m_vertex0.y);
                    b2Settings.b2Log("    shape.m_vertex1.SetXY(%.15f, %.15f);\n", this.m_vertex1.x, this.m_vertex1.y);
                    b2Settings.b2Log("    shape.m_vertex2.SetXY(%.15f, %.15f);\n", this.m_vertex2.x, this.m_vertex2.y);
                    b2Settings.b2Log("    shape.m_vertex3.SetXY(%.15f, %.15f);\n", this.m_vertex3.x, this.m_vertex3.y);
                    b2Settings.b2Log("    shape.m_hasVertex0 = %s;\n", this.m_hasVertex0);
                    b2Settings.b2Log("    shape.m_hasVertex3 = %s;\n", this.m_hasVertex3);
                }
            };
            /// Implement b2Shape.
            // p = p1 + t * d
            // v = v1 + s * e
            // p1 + t * d = v1 + s * e
            // s * e - t * d = p1 - v1
            b2EdgeShape.RayCast_s_p1 = new b2Math_7.b2Vec2();
            b2EdgeShape.RayCast_s_p2 = new b2Math_7.b2Vec2();
            b2EdgeShape.RayCast_s_d = new b2Math_7.b2Vec2();
            b2EdgeShape.RayCast_s_e = new b2Math_7.b2Vec2();
            b2EdgeShape.RayCast_s_q = new b2Math_7.b2Vec2();
            b2EdgeShape.RayCast_s_r = new b2Math_7.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2EdgeShape.ComputeAABB_s_v1 = new b2Math_7.b2Vec2();
            b2EdgeShape.ComputeAABB_s_v2 = new b2Math_7.b2Vec2();
            exports_12("b2EdgeShape", b2EdgeShape);
        }
    }
});
/*
* Copyright (c) 2006-2010 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/Shapes/b2ChainShape", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/Shapes/b2Shape", "Box2D/Collision/Shapes/b2EdgeShape"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var b2Settings, b2Math_8, b2Shape_2, b2EdgeShape_1;
    var b2ChainShape;
    return {
        setters:[
            function (b2Settings_8) {
                b2Settings = b2Settings_8;
            },
            function (b2Math_8_1) {
                b2Math_8 = b2Math_8_1;
            },
            function (b2Shape_2_1) {
                b2Shape_2 = b2Shape_2_1;
            },
            function (b2EdgeShape_1_1) {
                b2EdgeShape_1 = b2EdgeShape_1_1;
            }],
        execute: function() {
            /// A chain shape is a free form sequence of line segments.
            /// The chain has two-sided collision, so you can use inside and outside collision.
            /// Therefore, you may use any winding order.
            /// Since there may be many vertices, they are allocated using b2Alloc.
            /// Connectivity information is used to create smooth collisions.
            /// WARNING: The chain will not collide properly if there are self-intersections.
            b2ChainShape = class b2ChainShape extends b2Shape_2.b2Shape {
                constructor() {
                    super(3 /* e_chainShape */, b2Settings.b2_polygonRadius);
                    this.m_vertices = null;
                    this.m_count = 0;
                    this.m_prevVertex = new b2Math_8.b2Vec2();
                    this.m_nextVertex = new b2Math_8.b2Vec2();
                    this.m_hasPrevVertex = false;
                    this.m_hasNextVertex = false;
                }
                /// Create a loop. This automatically adjusts connectivity.
                /// @param vertices an array of vertices, these are copied
                /// @param count the vertex count
                CreateLoop(vertices, count = vertices.length) {
                    count = count || vertices.length;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_vertices === null && this.m_count === 0);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(count >= 3);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        for (let i = 1; i < count; ++i) {
                            const v1 = vertices[i - 1];
                            const v2 = vertices[i];
                            // If the code crashes here, it means your vertices are too close together.
                            b2Settings.b2Assert(b2Math_8.b2Vec2.DistanceSquaredVV(v1, v2) > b2Settings.b2_linearSlop * b2Settings.b2_linearSlop);
                        }
                    }
                    this.m_count = count + 1;
                    this.m_vertices = b2Math_8.b2Vec2.MakeArray(this.m_count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices[i]);
                    }
                    this.m_vertices[count].Copy(this.m_vertices[0]);
                    this.m_prevVertex.Copy(this.m_vertices[this.m_count - 2]);
                    this.m_nextVertex.Copy(this.m_vertices[1]);
                    this.m_hasPrevVertex = true;
                    this.m_hasNextVertex = true;
                    return this;
                }
                /// Create a chain with isolated end vertices.
                /// @param vertices an array of vertices, these are copied
                /// @param count the vertex count
                CreateChain(vertices, count = vertices.length) {
                    count = count || vertices.length;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_vertices === null && this.m_count === 0);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(count >= 2);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        for (let i = 1; i < count; ++i) {
                            const v1 = vertices[i - 1];
                            const v2 = vertices[i];
                            // If the code crashes here, it means your vertices are too close together.
                            b2Settings.b2Assert(b2Math_8.b2Vec2.DistanceSquaredVV(v1, v2) > b2Settings.b2_linearSlop * b2Settings.b2_linearSlop);
                        }
                    }
                    this.m_count = count;
                    this.m_vertices = b2Math_8.b2Vec2.MakeArray(count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices[i]);
                    }
                    this.m_hasPrevVertex = false;
                    this.m_hasNextVertex = false;
                    return this;
                }
                /// Establish connectivity to a vertex that precedes the first vertex.
                /// Don't call this for loops.
                SetPrevVertex(prevVertex) {
                    this.m_prevVertex.Copy(prevVertex);
                    this.m_hasPrevVertex = true;
                    return this;
                }
                /// Establish connectivity to a vertex that follows the last vertex.
                /// Don't call this for loops.
                SetNextVertex(nextVertex) {
                    this.m_nextVertex.Copy(nextVertex);
                    this.m_hasNextVertex = true;
                    return this;
                }
                /// Implement b2Shape. Vertices are cloned using b2Alloc.
                Clone() {
                    return new b2ChainShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(other instanceof b2ChainShape);
                    }
                    this.CreateChain(other.m_vertices, other.m_count);
                    this.m_prevVertex.Copy(other.m_prevVertex);
                    this.m_nextVertex.Copy(other.m_nextVertex);
                    this.m_hasPrevVertex = other.m_hasPrevVertex;
                    this.m_hasNextVertex = other.m_hasNextVertex;
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    // edge count = vertex count - 1
                    return this.m_count - 1;
                }
                /// Get a child edge.
                GetChildEdge(edge, index) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= index && index < this.m_count - 1);
                    }
                    edge.m_type = 1 /* e_edgeShape */;
                    edge.m_radius = this.m_radius;
                    edge.m_vertex1.Copy(this.m_vertices[index]);
                    edge.m_vertex2.Copy(this.m_vertices[index + 1]);
                    if (index > 0) {
                        edge.m_vertex0.Copy(this.m_vertices[index - 1]);
                        edge.m_hasVertex0 = true;
                    }
                    else {
                        edge.m_vertex0.Copy(this.m_prevVertex);
                        edge.m_hasVertex0 = this.m_hasPrevVertex;
                    }
                    if (index < this.m_count - 2) {
                        edge.m_vertex3.Copy(this.m_vertices[index + 2]);
                        edge.m_hasVertex3 = true;
                    }
                    else {
                        edge.m_vertex3.Copy(this.m_nextVertex);
                        edge.m_hasVertex3 = this.m_hasNextVertex;
                    }
                }
                /// This always return false.
                /// @see b2Shape::TestPoint
                TestPoint(xf, p) {
                    return false;
                }
                RayCast(output, input, xf, childIndex) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(childIndex < this.m_count);
                    }
                    const edgeShape = b2ChainShape.RayCast_s_edgeShape;
                    edgeShape.m_vertex1.Copy(this.m_vertices[childIndex]);
                    edgeShape.m_vertex2.Copy(this.m_vertices[(childIndex + 1) % this.m_count]);
                    return edgeShape.RayCast(output, input, xf, 0);
                }
                ComputeAABB(aabb, xf, childIndex) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(childIndex < this.m_count);
                    }
                    const vertexi1 = this.m_vertices[childIndex];
                    const vertexi2 = this.m_vertices[(childIndex + 1) % this.m_count];
                    const v1 = b2Math_8.b2Transform.MulXV(xf, vertexi1, b2ChainShape.ComputeAABB_s_v1);
                    const v2 = b2Math_8.b2Transform.MulXV(xf, vertexi2, b2ChainShape.ComputeAABB_s_v2);
                    b2Math_8.b2Vec2.MinV(v1, v2, aabb.lowerBound);
                    b2Math_8.b2Vec2.MaxV(v1, v2, aabb.upperBound);
                }
                /// Chains have zero mass.
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    massData.mass = 0;
                    massData.center.SetZero();
                    massData.I = 0;
                }
                SetupDistanceProxy(proxy, index) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= index && index < this.m_count);
                    }
                    proxy.m_buffer[0].Copy(this.m_vertices[index]);
                    if (index + 1 < this.m_count) {
                        proxy.m_buffer[1].Copy(this.m_vertices[index + 1]);
                    }
                    else {
                        proxy.m_buffer[1].Copy(this.m_vertices[0]);
                    }
                    proxy.m_vertices = proxy.m_buffer;
                    proxy.m_count = 2;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    c.SetZero();
                    return 0;
                }
                Dump() {
                    b2Settings.b2Log("    const shape: b2ChainShape = new b2ChainShape();\n");
                    b2Settings.b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2Settings.b2_maxPolygonVertices);
                    for (let i = 0; i < this.m_count; ++i) {
                        b2Settings.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
                    }
                    b2Settings.b2Log("    shape.CreateChain(vs, %d);\n", this.m_count);
                    b2Settings.b2Log("    shape.m_prevVertex.SetXY(%.15f, %.15f);\n", this.m_prevVertex.x, this.m_prevVertex.y);
                    b2Settings.b2Log("    shape.m_nextVertex.SetXY(%.15f, %.15f);\n", this.m_nextVertex.x, this.m_nextVertex.y);
                    b2Settings.b2Log("    shape.m_hasPrevVertex = %s;\n", (this.m_hasPrevVertex) ? ("true") : ("false"));
                    b2Settings.b2Log("    shape.m_hasNextVertex = %s;\n", (this.m_hasNextVertex) ? ("true") : ("false"));
                }
            };
            /// Implement b2Shape.
            b2ChainShape.RayCast_s_edgeShape = new b2EdgeShape_1.b2EdgeShape();
            /// @see b2Shape::ComputeAABB
            b2ChainShape.ComputeAABB_s_v1 = new b2Math_8.b2Vec2();
            b2ChainShape.ComputeAABB_s_v2 = new b2Math_8.b2Vec2();
            exports_13("b2ChainShape", b2ChainShape);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/Shapes/b2CircleShape", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/Shapes/b2Shape"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var b2Settings, b2Math_9, b2Shape_3;
    var b2CircleShape;
    return {
        setters:[
            function (b2Settings_9) {
                b2Settings = b2Settings_9;
            },
            function (b2Math_9_1) {
                b2Math_9 = b2Math_9_1;
            },
            function (b2Shape_3_1) {
                b2Shape_3 = b2Shape_3_1;
            }],
        execute: function() {
            /// A circle shape.
            b2CircleShape = class b2CircleShape extends b2Shape_3.b2Shape {
                constructor(radius = 0) {
                    super(0 /* e_circleShape */, radius);
                    this.m_p = new b2Math_9.b2Vec2();
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2CircleShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(other instanceof b2CircleShape);
                    }
                    this.m_p.Copy(other.m_p);
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    return 1;
                }
                TestPoint(transform, p) {
                    const center = b2Math_9.b2Transform.MulXV(transform, this.m_p, b2CircleShape.TestPoint_s_center);
                    const d = b2Math_9.b2Vec2.SubVV(p, center, b2CircleShape.TestPoint_s_d);
                    return b2Math_9.b2Vec2.DotVV(d, d) <= b2Math_9.b2Sq(this.m_radius);
                }
                RayCast(output, input, transform, childIndex) {
                    const position = b2Math_9.b2Transform.MulXV(transform, this.m_p, b2CircleShape.RayCast_s_position);
                    const s = b2Math_9.b2Vec2.SubVV(input.p1, position, b2CircleShape.RayCast_s_s);
                    const b = b2Math_9.b2Vec2.DotVV(s, s) - b2Math_9.b2Sq(this.m_radius);
                    // Solve quadratic equation.
                    const r = b2Math_9.b2Vec2.SubVV(input.p2, input.p1, b2CircleShape.RayCast_s_r);
                    const c = b2Math_9.b2Vec2.DotVV(s, r);
                    const rr = b2Math_9.b2Vec2.DotVV(r, r);
                    const sigma = c * c - rr * b;
                    // Check for negative discriminant and short segment.
                    if (sigma < 0 || rr < b2Settings.b2_epsilon) {
                        return false;
                    }
                    // Find the point of intersection of the line with the circle.
                    let a = (-(c + b2Math_9.b2Sqrt(sigma)));
                    // Is the intersection point on the segment?
                    if (0 <= a && a <= input.maxFraction * rr) {
                        a /= rr;
                        output.fraction = a;
                        b2Math_9.b2Vec2.AddVMulSV(s, a, r, output.normal).SelfNormalize();
                        return true;
                    }
                    return false;
                }
                ComputeAABB(aabb, transform, childIndex) {
                    const p = b2Math_9.b2Transform.MulXV(transform, this.m_p, b2CircleShape.ComputeAABB_s_p);
                    aabb.lowerBound.SetXY(p.x - this.m_radius, p.y - this.m_radius);
                    aabb.upperBound.SetXY(p.x + this.m_radius, p.y + this.m_radius);
                }
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    const radius_sq = b2Math_9.b2Sq(this.m_radius);
                    massData.mass = density * b2Settings.b2_pi * radius_sq;
                    massData.center.Copy(this.m_p);
                    // inertia about the local origin
                    massData.I = massData.mass * (0.5 * radius_sq + b2Math_9.b2Vec2.DotVV(this.m_p, this.m_p));
                }
                SetupDistanceProxy(proxy, index) {
                    proxy.m_vertices = [];
                    proxy.m_vertices[0] = this.m_p;
                    proxy.m_count = 1;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    const p = b2Math_9.b2Transform.MulXV(xf, this.m_p, new b2Math_9.b2Vec2());
                    const l = (-(b2Math_9.b2Vec2.DotVV(normal, p) - offset));
                    if (l < (-this.m_radius) + b2Settings.b2_epsilon) {
                        // Completely dry
                        return 0;
                    }
                    if (l > this.m_radius) {
                        // Completely wet
                        c.Copy(p);
                        return b2Settings.b2_pi * this.m_radius * this.m_radius;
                    }
                    // Magic
                    const r2 = this.m_radius * this.m_radius;
                    const l2 = l * l;
                    const area = r2 * (b2Math_9.b2Asin(l / this.m_radius) + b2Settings.b2_pi / 2) + l * b2Math_9.b2Sqrt(r2 - l2);
                    const com = (-2 / 3 * b2Math_9.b2Pow(r2 - l2, 1.5) / area);
                    c.x = p.x + normal.x * com;
                    c.y = p.y + normal.y * com;
                    return area;
                }
                Dump() {
                    b2Settings.b2Log("    const shape: b2CircleShape = new b2CircleShape();\n");
                    b2Settings.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
                    b2Settings.b2Log("    shape.m_p.SetXY(%.15f, %.15f);\n", this.m_p.x, this.m_p.y);
                }
            };
            /// Implement b2Shape.
            b2CircleShape.TestPoint_s_center = new b2Math_9.b2Vec2();
            b2CircleShape.TestPoint_s_d = new b2Math_9.b2Vec2();
            /// Implement b2Shape.
            // Collision Detection in Interactive 3D Environments by Gino van den Bergen
            // From Section 3.1.2
            // x = s + a * r
            // norm(x) = radius
            b2CircleShape.RayCast_s_position = new b2Math_9.b2Vec2();
            b2CircleShape.RayCast_s_s = new b2Math_9.b2Vec2();
            b2CircleShape.RayCast_s_r = new b2Math_9.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2CircleShape.ComputeAABB_s_p = new b2Math_9.b2Vec2();
            exports_14("b2CircleShape", b2CircleShape);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Collision/Shapes/b2PolygonShape", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/Shapes/b2Shape"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var b2Settings, b2Math_10, b2Shape_4, b2Shape_5;
    var b2PolygonShape;
    return {
        setters:[
            function (b2Settings_10) {
                b2Settings = b2Settings_10;
            },
            function (b2Math_10_1) {
                b2Math_10 = b2Math_10_1;
            },
            function (b2Shape_4_1) {
                b2Shape_4 = b2Shape_4_1;
                b2Shape_5 = b2Shape_4_1;
            }],
        execute: function() {
            /// A convex polygon. It is assumed that the interior of the polygon is to
            /// the left of each edge.
            /// Polygons have a maximum number of vertices equal to b2_maxPolygonVertices.
            /// In most cases you should not need many vertices for a convex polygon.
            b2PolygonShape = class b2PolygonShape extends b2Shape_5.b2Shape {
                constructor() {
                    super(2 /* e_polygonShape */, b2Settings.b2_polygonRadius);
                    this.m_centroid = new b2Math_10.b2Vec2(0, 0);
                    this.m_vertices = b2Math_10.b2Vec2.MakeArray(b2Settings.b2_maxPolygonVertices);
                    this.m_normals = b2Math_10.b2Vec2.MakeArray(b2Settings.b2_maxPolygonVertices);
                    this.m_count = 0;
                }
                /// Implement b2Shape.
                Clone() {
                    return new b2PolygonShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(other instanceof b2PolygonShape);
                    }
                    this.m_centroid.Copy(other.m_centroid);
                    this.m_count = other.m_count;
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        this.m_vertices[i].Copy(other.m_vertices[i]);
                        this.m_normals[i].Copy(other.m_normals[i]);
                    }
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    return 1;
                }
                SetAsVector(vertices, count) {
                    if (count === undefined)
                        count = vertices.length;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(3 <= count && count <= b2Settings.b2_maxPolygonVertices);
                    }
                    if (count < 3) {
                        return this.SetAsBox(1, 1);
                    }
                    const n = b2Math_10.b2Min(count, b2Settings.b2_maxPolygonVertices);
                    // Copy vertices into local buffer
                    const ps = b2PolygonShape.SetAsVector_s_ps;
                    for (let i = 0; i < n; ++i) {
                        ps[i].Copy(vertices[i]);
                    }
                    // Create the convex hull using the Gift wrapping algorithm
                    // http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
                    // Find the right most point on the hull
                    let i0 = 0;
                    let x0 = ps[0].x;
                    for (let i = 1; i < count; ++i) {
                        const x = ps[i].x;
                        if (x > x0 || (x === x0 && ps[i].y < ps[i0].y)) {
                            i0 = i;
                            x0 = x;
                        }
                    }
                    const hull = b2PolygonShape.SetAsVector_s_hull;
                    let m = 0;
                    let ih = i0;
                    for (;;) {
                        hull[m] = ih;
                        let ie = 0;
                        for (let j = 1; j < n; ++j) {
                            if (ie === ih) {
                                ie = j;
                                continue;
                            }
                            const r = b2Math_10.b2Vec2.SubVV(ps[ie], ps[hull[m]], b2PolygonShape.SetAsVector_s_r);
                            const v = b2Math_10.b2Vec2.SubVV(ps[j], ps[hull[m]], b2PolygonShape.SetAsVector_s_v);
                            const c = b2Math_10.b2Vec2.CrossVV(r, v);
                            if (c < 0) {
                                ie = j;
                            }
                            // Collinearity check
                            if (c === 0 && v.GetLengthSquared() > r.GetLengthSquared()) {
                                ie = j;
                            }
                        }
                        ++m;
                        ih = ie;
                        if (ie === i0) {
                            break;
                        }
                    }
                    this.m_count = m;
                    // Copy vertices.
                    for (let i = 0; i < m; ++i) {
                        this.m_vertices[i].Copy(ps[hull[i]]);
                    }
                    // Compute normals. Ensure the edges have non-zero length.
                    for (let i = 0, ict = m; i < ict; ++i) {
                        const vertexi1 = this.m_vertices[i];
                        const vertexi2 = this.m_vertices[(i + 1) % ict];
                        const edge = b2Math_10.b2Vec2.SubVV(vertexi2, vertexi1, b2Math_10.b2Vec2.s_t0); // edge uses s_t0
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(edge.GetLengthSquared() > b2Settings.b2_epsilon_sq);
                        }
                        b2Math_10.b2Vec2.CrossVOne(edge, this.m_normals[i]).SelfNormalize();
                    }
                    // Compute the polygon centroid.
                    b2PolygonShape.ComputeCentroid(this.m_vertices, m, this.m_centroid);
                    return this;
                }
                SetAsArray(vertices, count) {
                    return this.SetAsVector(vertices, count);
                }
                /// Build vertices to represent an axis-aligned box.
                /// @param hx the half-width.
                /// @param hy the half-height.
                SetAsBox(hx, hy) {
                    this.m_count = 4;
                    this.m_vertices[0].SetXY((-hx), (-hy));
                    this.m_vertices[1].SetXY(hx, (-hy));
                    this.m_vertices[2].SetXY(hx, hy);
                    this.m_vertices[3].SetXY((-hx), hy);
                    this.m_normals[0].SetXY(0, (-1));
                    this.m_normals[1].SetXY(1, 0);
                    this.m_normals[2].SetXY(0, 1);
                    this.m_normals[3].SetXY((-1), 0);
                    this.m_centroid.SetZero();
                    return this;
                }
                /// Build vertices to represent an oriented box.
                /// @param hx the half-width.
                /// @param hy the half-height.
                /// @param center the center of the box in local coordinates.
                /// @param angle the rotation of the box in local coordinates.
                SetAsOrientedBox(hx, hy, center, angle) {
                    this.m_count = 4;
                    this.m_vertices[0].SetXY((-hx), (-hy));
                    this.m_vertices[1].SetXY(hx, (-hy));
                    this.m_vertices[2].SetXY(hx, hy);
                    this.m_vertices[3].SetXY((-hx), hy);
                    this.m_normals[0].SetXY(0, (-1));
                    this.m_normals[1].SetXY(1, 0);
                    this.m_normals[2].SetXY(0, 1);
                    this.m_normals[3].SetXY((-1), 0);
                    this.m_centroid.Copy(center);
                    const xf = new b2Math_10.b2Transform();
                    xf.SetPosition(center);
                    xf.SetRotationAngleRadians(angle);
                    // Transform vertices and normals.
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        b2Math_10.b2Transform.MulXV(xf, this.m_vertices[i], this.m_vertices[i]);
                        b2Math_10.b2Rot.MulRV(xf.q, this.m_normals[i], this.m_normals[i]);
                    }
                    return this;
                }
                TestPoint(xf, p) {
                    const pLocal = b2Math_10.b2Transform.MulTXV(xf, p, b2PolygonShape.TestPoint_s_pLocal);
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        const dot = b2Math_10.b2Vec2.DotVV(this.m_normals[i], b2Math_10.b2Vec2.SubVV(pLocal, this.m_vertices[i], b2Math_10.b2Vec2.s_t0));
                        if (dot > 0) {
                            return false;
                        }
                    }
                    return true;
                }
                RayCast(output, input, xf, childIndex) {
                    // Put the ray into the polygon's frame of reference.
                    const p1 = b2Math_10.b2Transform.MulTXV(xf, input.p1, b2PolygonShape.RayCast_s_p1);
                    const p2 = b2Math_10.b2Transform.MulTXV(xf, input.p2, b2PolygonShape.RayCast_s_p2);
                    const d = b2Math_10.b2Vec2.SubVV(p2, p1, b2PolygonShape.RayCast_s_d);
                    let lower = 0, upper = input.maxFraction;
                    let index = -1;
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        // p = p1 + a * d
                        // dot(normal, p - v) = 0
                        // dot(normal, p1 - v) + a * dot(normal, d) = 0
                        const numerator = b2Math_10.b2Vec2.DotVV(this.m_normals[i], b2Math_10.b2Vec2.SubVV(this.m_vertices[i], p1, b2Math_10.b2Vec2.s_t0));
                        const denominator = b2Math_10.b2Vec2.DotVV(this.m_normals[i], d);
                        if (denominator === 0) {
                            if (numerator < 0) {
                                return false;
                            }
                        }
                        else {
                            // Note: we want this predicate without division:
                            // lower < numerator / denominator, where denominator < 0
                            // Since denominator < 0, we have to flip the inequality:
                            // lower < numerator / denominator <==> denominator * lower > numerator.
                            if (denominator < 0 && numerator < lower * denominator) {
                                // Increase lower.
                                // The segment enters this half-space.
                                lower = numerator / denominator;
                                index = i;
                            }
                            else if (denominator > 0 && numerator < upper * denominator) {
                                // Decrease upper.
                                // The segment exits this half-space.
                                upper = numerator / denominator;
                            }
                        }
                        // The use of epsilon here causes the assert on lower to trip
                        // in some cases. Apparently the use of epsilon was to make edge
                        // shapes work, but now those are handled separately.
                        // if (upper < lower - b2Settings.b2_epsilon)
                        if (upper < lower) {
                            return false;
                        }
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= lower && lower <= input.maxFraction);
                    }
                    if (index >= 0) {
                        output.fraction = lower;
                        b2Math_10.b2Rot.MulRV(xf.q, this.m_normals[index], output.normal);
                        return true;
                    }
                    return false;
                }
                ComputeAABB(aabb, xf, childIndex) {
                    const lower = b2Math_10.b2Transform.MulXV(xf, this.m_vertices[0], aabb.lowerBound);
                    const upper = aabb.upperBound.Copy(lower);
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        const v = b2Math_10.b2Transform.MulXV(xf, this.m_vertices[i], b2PolygonShape.ComputeAABB_s_v);
                        b2Math_10.b2Vec2.MinV(v, lower, lower);
                        b2Math_10.b2Vec2.MaxV(v, upper, upper);
                    }
                    const r = this.m_radius;
                    lower.SelfSubXY(r, r);
                    upper.SelfAddXY(r, r);
                }
                ComputeMass(massData, density) {
                    // Polygon mass, centroid, and inertia.
                    // Let rho be the polygon density in mass per unit area.
                    // Then:
                    // mass = rho * int(dA)
                    // centroid.x = (1/mass) * rho * int(x * dA)
                    // centroid.y = (1/mass) * rho * int(y * dA)
                    // I = rho * int((x*x + y*y) * dA)
                    //
                    // We can compute these integrals by summing all the integrals
                    // for each triangle of the polygon. To evaluate the integral
                    // for a single triangle, we make a change of variables to
                    // the (u,v) coordinates of the triangle:
                    // x = x0 + e1x * u + e2x * v
                    // y = y0 + e1y * u + e2y * v
                    // where 0 <= u && 0 <= v && u + v <= 1.
                    //
                    // We integrate u from [0,1-v] and then v from [0,1].
                    // We also need to use the Jacobian of the transformation:
                    // D = cross(e1, e2)
                    //
                    // Simplification: triangle centroid = (1/3) * (p1 + p2 + p3)
                    //
                    // The rest of the derivation is handled by computer algebra.
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_count >= 3);
                    }
                    const center = b2PolygonShape.ComputeMass_s_center.SetZero();
                    let area = 0;
                    let I = 0;
                    // s is the reference point for forming triangles.
                    // It's location doesn't change the result (except for rounding error).
                    const s = b2PolygonShape.ComputeMass_s_s.SetZero();
                    // This code would put the reference point inside the polygon.
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        s.SelfAdd(this.m_vertices[i]);
                    }
                    s.SelfMul(1 / this.m_count);
                    const k_inv3 = 1 / 3;
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        // Triangle vertices.
                        const e1 = b2Math_10.b2Vec2.SubVV(this.m_vertices[i], s, b2PolygonShape.ComputeMass_s_e1);
                        const e2 = b2Math_10.b2Vec2.SubVV(this.m_vertices[(i + 1) % ict], s, b2PolygonShape.ComputeMass_s_e2);
                        const D = b2Math_10.b2Vec2.CrossVV(e1, e2);
                        const triangleArea = 0.5 * D;
                        area += triangleArea;
                        // Area weighted centroid
                        center.SelfAdd(b2Math_10.b2Vec2.MulSV(triangleArea * k_inv3, b2Math_10.b2Vec2.AddVV(e1, e2, b2Math_10.b2Vec2.s_t0), b2Math_10.b2Vec2.s_t1));
                        const ex1 = e1.x;
                        const ey1 = e1.y;
                        const ex2 = e2.x;
                        const ey2 = e2.y;
                        const intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
                        const inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;
                        I += (0.25 * k_inv3 * D) * (intx2 + inty2);
                    }
                    // Total mass
                    massData.mass = density * area;
                    // Center of mass
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(area > b2Settings.b2_epsilon);
                    }
                    center.SelfMul(1 / area);
                    b2Math_10.b2Vec2.AddVV(center, s, massData.center);
                    // Inertia tensor relative to the local origin (point s).
                    massData.I = density * I;
                    // Shift to center of mass then to original body origin.
                    massData.I += massData.mass * (b2Math_10.b2Vec2.DotVV(massData.center, massData.center) - b2Math_10.b2Vec2.DotVV(center, center));
                }
                Validate() {
                    for (let i = 0; i < this.m_count; ++i) {
                        const i1 = i;
                        const i2 = (i + 1) % this.m_count;
                        const p = this.m_vertices[i1];
                        const e = b2Math_10.b2Vec2.SubVV(this.m_vertices[i2], p, b2PolygonShape.Validate_s_e);
                        for (let j = 0; j < this.m_count; ++j) {
                            if (j === i1 || j === i2) {
                                continue;
                            }
                            const v = b2Math_10.b2Vec2.SubVV(this.m_vertices[j], p, b2PolygonShape.Validate_s_v);
                            const c = b2Math_10.b2Vec2.CrossVV(e, v);
                            if (c < 0) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                SetupDistanceProxy(proxy, index) {
                    proxy.m_vertices = this.m_vertices;
                    proxy.m_count = this.m_count;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    // Transform plane into shape co-ordinates
                    const normalL = b2Math_10.b2Rot.MulTRV(xf.q, normal, b2PolygonShape.ComputeSubmergedArea_s_normalL);
                    const offsetL = offset - b2Math_10.b2Vec2.DotVV(normal, xf.p);
                    const depths = b2PolygonShape.ComputeSubmergedArea_s_depths;
                    let diveCount = 0;
                    let intoIndex = -1;
                    let outoIndex = -1;
                    let lastSubmerged = false;
                    for (let i = 0, ict = this.m_count; i < ict; ++i) {
                        depths[i] = b2Math_10.b2Vec2.DotVV(normalL, this.m_vertices[i]) - offsetL;
                        const isSubmerged = depths[i] < (-b2Settings.b2_epsilon);
                        if (i > 0) {
                            if (isSubmerged) {
                                if (!lastSubmerged) {
                                    intoIndex = i - 1;
                                    diveCount++;
                                }
                            }
                            else {
                                if (lastSubmerged) {
                                    outoIndex = i - 1;
                                    diveCount++;
                                }
                            }
                        }
                        lastSubmerged = isSubmerged;
                    }
                    switch (diveCount) {
                        case 0:
                            if (lastSubmerged) {
                                // Completely submerged
                                const md = b2PolygonShape.ComputeSubmergedArea_s_md;
                                this.ComputeMass(md, 1);
                                b2Math_10.b2Transform.MulXV(xf, md.center, c);
                                return md.mass;
                            }
                            else {
                                // Completely dry
                                return 0;
                            }
                        case 1:
                            if (intoIndex === (-1)) {
                                intoIndex = this.m_count - 1;
                            }
                            else {
                                outoIndex = this.m_count - 1;
                            }
                            break;
                    }
                    const intoIndex2 = ((intoIndex + 1) % this.m_count);
                    const outoIndex2 = ((outoIndex + 1) % this.m_count);
                    const intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
                    const outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
                    const intoVec = b2PolygonShape.ComputeSubmergedArea_s_intoVec.SetXY(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
                    const outoVec = b2PolygonShape.ComputeSubmergedArea_s_outoVec.SetXY(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
                    // Initialize accumulator
                    let area = 0;
                    const center = b2PolygonShape.ComputeSubmergedArea_s_center.SetZero();
                    let p2 = this.m_vertices[intoIndex2];
                    let p3 = null;
                    // An awkward loop from intoIndex2+1 to outIndex2
                    let i = intoIndex2;
                    while (i !== outoIndex2) {
                        i = (i + 1) % this.m_count;
                        if (i === outoIndex2)
                            p3 = outoVec;
                        else
                            p3 = this.m_vertices[i];
                        const triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
                        area += triangleArea;
                        // Area weighted centroid
                        center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
                        center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
                        p2 = p3;
                    }
                    // Normalize and transform centroid
                    center.SelfMul(1 / area);
                    b2Math_10.b2Transform.MulXV(xf, center, c);
                    return area;
                }
                Dump() {
                    b2Settings.b2Log("    const shape: b2PolygonShape = new b2PolygonShape();\n");
                    b2Settings.b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2Settings.b2_maxPolygonVertices);
                    for (let i = 0; i < this.m_count; ++i) {
                        b2Settings.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
                    }
                    b2Settings.b2Log("    shape.SetAsVector(vs, %d);\n", this.m_count);
                }
                static ComputeCentroid(vs, count, out) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(count >= 3);
                    }
                    const c = out;
                    c.SetZero();
                    let area = 0;
                    // s is the reference point for forming triangles.
                    // It's location doesn't change the result (except for rounding error).
                    const pRef = b2PolygonShape.ComputeCentroid_s_pRef.SetZero();
                    /*
                #if 0
                    // This code would put the reference point inside the polygon.
                    for (let i: number = 0; i < count; ++i) {
                      pRef.SelfAdd(vs[i]);
                    }
                    pRef.SelfMul(1 / count);
                #endif
                    */
                    const inv3 = 1 / 3;
                    for (let i = 0; i < count; ++i) {
                        // Triangle vertices.
                        const p1 = pRef;
                        const p2 = vs[i];
                        const p3 = vs[(i + 1) % count];
                        const e1 = b2Math_10.b2Vec2.SubVV(p2, p1, b2PolygonShape.ComputeCentroid_s_e1);
                        const e2 = b2Math_10.b2Vec2.SubVV(p3, p1, b2PolygonShape.ComputeCentroid_s_e2);
                        const D = b2Math_10.b2Vec2.CrossVV(e1, e2);
                        const triangleArea = 0.5 * D;
                        area += triangleArea;
                        // Area weighted centroid
                        c.x += triangleArea * inv3 * (p1.x + p2.x + p3.x);
                        c.y += triangleArea * inv3 * (p1.y + p2.y + p3.y);
                    }
                    // Centroid
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(area > b2Settings.b2_epsilon);
                    }
                    c.SelfMul(1 / area);
                    return c;
                }
            };
            /// Create a convex hull from the given array of points.
            /// The count must be in the range [3, b2_maxPolygonVertices].
            /// @warning the points may be re-ordered, even if they form a convex polygon
            /// @warning collinear points are handled but not removed. Collinear points
            /// may lead to poor stacking behavior.
            b2PolygonShape.SetAsVector_s_ps = b2Math_10.b2Vec2.MakeArray(b2Settings.b2_maxPolygonVertices);
            b2PolygonShape.SetAsVector_s_hull = b2Settings.b2MakeNumberArray(b2Settings.b2_maxPolygonVertices);
            b2PolygonShape.SetAsVector_s_r = new b2Math_10.b2Vec2();
            b2PolygonShape.SetAsVector_s_v = new b2Math_10.b2Vec2();
            /// @see b2Shape::TestPoint
            b2PolygonShape.TestPoint_s_pLocal = new b2Math_10.b2Vec2();
            /// Implement b2Shape.
            b2PolygonShape.RayCast_s_p1 = new b2Math_10.b2Vec2();
            b2PolygonShape.RayCast_s_p2 = new b2Math_10.b2Vec2();
            b2PolygonShape.RayCast_s_d = new b2Math_10.b2Vec2();
            /// @see b2Shape::ComputeAABB
            b2PolygonShape.ComputeAABB_s_v = new b2Math_10.b2Vec2();
            /// @see b2Shape::ComputeMass
            b2PolygonShape.ComputeMass_s_center = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeMass_s_s = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeMass_s_e1 = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeMass_s_e2 = new b2Math_10.b2Vec2();
            b2PolygonShape.Validate_s_e = new b2Math_10.b2Vec2();
            b2PolygonShape.Validate_s_v = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_normalL = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_depths = b2Settings.b2MakeNumberArray(b2Settings.b2_maxPolygonVertices);
            b2PolygonShape.ComputeSubmergedArea_s_md = new b2Shape_4.b2MassData();
            b2PolygonShape.ComputeSubmergedArea_s_intoVec = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_outoVec = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeSubmergedArea_s_center = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeCentroid_s_pRef = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeCentroid_s_e1 = new b2Math_10.b2Vec2();
            b2PolygonShape.ComputeCentroid_s_e2 = new b2Math_10.b2Vec2();
            exports_15("b2PolygonShape", b2PolygonShape);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/b2TimeStep", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var b2Settings, b2Math_11;
    var b2Profile, b2TimeStep, b2Position, b2Velocity, b2SolverData;
    return {
        setters:[
            function (b2Settings_11) {
                b2Settings = b2Settings_11;
            },
            function (b2Math_11_1) {
                b2Math_11 = b2Math_11_1;
            }],
        execute: function() {
            /// Profiling data. Times are in milliseconds.
            b2Profile = class b2Profile {
                constructor() {
                    this.step = 0;
                    this.collide = 0;
                    this.solve = 0;
                    this.solveInit = 0;
                    this.solveVelocity = 0;
                    this.solvePosition = 0;
                    this.broadphase = 0;
                    this.solveTOI = 0;
                }
                Reset() {
                    this.step = 0;
                    this.collide = 0;
                    this.solve = 0;
                    this.solveInit = 0;
                    this.solveVelocity = 0;
                    this.solvePosition = 0;
                    this.broadphase = 0;
                    this.solveTOI = 0;
                    return this;
                }
            };
            exports_16("b2Profile", b2Profile);
            /// This is an internal structure.
            b2TimeStep = class b2TimeStep {
                constructor() {
                    this.dt = 0; // time step
                    this.inv_dt = 0; // inverse time step (0 if dt == 0).
                    this.dtRatio = 0; // dt * inv_dt0
                    this.velocityIterations = 0;
                    this.positionIterations = 0;
                    this.warmStarting = false;
                }
                Copy(step) {
                    this.dt = step.dt;
                    this.inv_dt = step.inv_dt;
                    this.dtRatio = step.dtRatio;
                    this.positionIterations = step.positionIterations;
                    this.velocityIterations = step.velocityIterations;
                    this.warmStarting = step.warmStarting;
                    return this;
                }
            };
            exports_16("b2TimeStep", b2TimeStep);
            b2Position = class b2Position {
                constructor() {
                    this.c = new b2Math_11.b2Vec2();
                    this.a = 0;
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2Position(); });
                }
            };
            exports_16("b2Position", b2Position);
            b2Velocity = class b2Velocity {
                constructor() {
                    this.v = new b2Math_11.b2Vec2();
                    this.w = 0;
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2Velocity(); });
                }
            };
            exports_16("b2Velocity", b2Velocity);
            b2SolverData = class b2SolverData {
                constructor() {
                    this.step = new b2TimeStep();
                    this.positions = null;
                    this.velocities = null;
                }
            };
            exports_16("b2SolverData", b2SolverData);
        }
    }
});
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2Joint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var b2Settings, b2Math_12;
    var b2Jacobian, b2JointEdge, b2JointDef, b2Joint;
    return {
        setters:[
            function (b2Settings_12) {
                b2Settings = b2Settings_12;
            },
            function (b2Math_12_1) {
                b2Math_12 = b2Math_12_1;
            }],
        execute: function() {
            b2Jacobian = class b2Jacobian {
                constructor() {
                    this.linear = new b2Math_12.b2Vec2();
                    this.angularA = 0;
                    this.angularB = 0;
                }
                SetZero() {
                    this.linear.SetZero();
                    this.angularA = 0;
                    this.angularB = 0;
                    return this;
                }
                Set(x, a1, a2) {
                    this.linear.Copy(x);
                    this.angularA = a1;
                    this.angularB = a2;
                    return this;
                }
            };
            exports_17("b2Jacobian", b2Jacobian);
            /// A joint edge is used to connect bodies and joints together
            /// in a joint graph where each body is a node and each joint
            /// is an edge. A joint edge belongs to a doubly linked list
            /// maintained in each attached body. Each joint has two joint
            /// nodes, one for each attached body.
            b2JointEdge = class b2JointEdge {
                constructor() {
                    this.other = null; ///< provides quick access to the other body attached.
                    this.joint = null; ///< the joint
                    this.prev = null; ///< the previous joint edge in the body's joint list
                    this.next = null; ///< the next joint edge in the body's joint list
                }
            };
            exports_17("b2JointEdge", b2JointEdge);
            /// Joint definitions are used to construct joints.
            b2JointDef = class b2JointDef {
                constructor(type) {
                    /// The joint type is set automatically for concrete joint types.
                    this.type = 0 /* e_unknownJoint */;
                    /// Use this to attach application specific data to your joints.
                    this.userData = null;
                    /// The first attached body.
                    this.bodyA = null;
                    /// The second attached body.
                    this.bodyB = null;
                    /// Set this flag to true if the attached bodies should collide.
                    this.collideConnected = false;
                    this.type = type;
                }
            };
            exports_17("b2JointDef", b2JointDef);
            /// The base joint class. Joints are used to constraint two bodies together in
            /// various fashions. Some joints also feature limits and motors.
            b2Joint = class b2Joint {
                constructor(def) {
                    this.m_type = 0 /* e_unknownJoint */;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_edgeA = new b2JointEdge();
                    this.m_edgeB = new b2JointEdge();
                    this.m_bodyA = null;
                    this.m_bodyB = null;
                    this.m_index = 0;
                    this.m_islandFlag = false;
                    this.m_collideConnected = false;
                    this.m_userData = null;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(def.bodyA !== def.bodyB);
                    }
                    this.m_type = def.type;
                    this.m_bodyA = def.bodyA;
                    this.m_bodyB = def.bodyB;
                    this.m_collideConnected = def.collideConnected;
                    this.m_userData = def.userData;
                }
                /// Get the type of the concrete joint.
                GetType() {
                    return this.m_type;
                }
                /// Get the first body attached to this joint.
                GetBodyA() {
                    return this.m_bodyA;
                }
                /// Get the second body attached to this joint.
                GetBodyB() {
                    return this.m_bodyB;
                }
                /// Get the anchor point on bodyA in world coordinates.
                GetAnchorA(out) {
                    return out.SetZero();
                }
                /// Get the anchor point on bodyB in world coordinates.
                GetAnchorB(out) {
                    return out.SetZero();
                }
                /// Get the reaction force on bodyB at the joint anchor in Newtons.
                GetReactionForce(inv_dt, out) {
                    return out.SetZero();
                }
                /// Get the reaction torque on bodyB in N*m.
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                /// Get the next joint the world joint list.
                GetNext() {
                    return this.m_next;
                }
                /// Get the user data pointer.
                GetUserData() {
                    return this.m_userData;
                }
                /// Set the user data pointer.
                SetUserData(data) {
                    this.m_userData = data;
                }
                /// Short-cut function to determine if either body is inactive.
                IsActive() {
                    return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
                }
                /// Get collide connected.
                /// Note: modifying the collide connect flag won't work correctly because
                /// the flag is only checked when fixture AABBs begin to overlap.
                GetCollideConnected() {
                    return this.m_collideConnected;
                }
                /// Dump this joint to the log file.
                Dump() {
                    if (b2Settings.DEBUG) {
                        b2Settings.b2Log("// Dump is not supported for this joint type.\n");
                    }
                }
                /// Shift the origin for any points stored in world coordinates.
                ShiftOrigin(newOrigin) {
                }
                InitVelocityConstraints(data) {
                }
                SolveVelocityConstraints(data) {
                }
                // This returns true if the position errors are within tolerance.
                SolvePositionConstraints(data) {
                    return false;
                }
            };
            exports_17("b2Joint", b2Joint);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/b2Fixture", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/b2Collision", "Box2D/Collision/Shapes/b2Shape"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var b2Settings, b2Math_13, b2Collision_3, b2Shape_6;
    var b2Filter, b2FixtureDef, b2FixtureProxy, b2Fixture;
    return {
        setters:[
            function (b2Settings_13) {
                b2Settings = b2Settings_13;
            },
            function (b2Math_13_1) {
                b2Math_13 = b2Math_13_1;
            },
            function (b2Collision_3_1) {
                b2Collision_3 = b2Collision_3_1;
            },
            function (b2Shape_6_1) {
                b2Shape_6 = b2Shape_6_1;
            }],
        execute: function() {
            /// This holds contact filtering data.
            b2Filter = class b2Filter {
                constructor() {
                    /// The collision category bits. Normally you would just set one bit.
                    this.categoryBits = 0x0001;
                    /// The collision mask bits. This states the categories that this
                    /// shape would accept for collision.
                    this.maskBits = 0xFFFF;
                    /// Collision groups allow a certain group of objects to never collide (negative)
                    /// or always collide (positive). Zero means no collision group. Non-zero group
                    /// filtering always wins against the mask bits.
                    this.groupIndex = 0;
                }
                Clone() {
                    return new b2Filter().Copy(this);
                }
                Copy(other) {
                    // if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(this !== other); }
                    this.categoryBits = other.categoryBits;
                    this.maskBits = other.maskBits;
                    this.groupIndex = other.groupIndex;
                    return this;
                }
            };
            exports_18("b2Filter", b2Filter);
            /// A fixture definition is used to create a fixture. This class defines an
            /// abstract fixture definition. You can reuse fixture definitions safely.
            b2FixtureDef = class b2FixtureDef {
                constructor() {
                    /// The shape, this must be set. The shape will be cloned, so you
                    /// can create the shape on the stack.
                    this.shape = null;
                    /// Use this to store application specific fixture data.
                    this.userData = null;
                    /// The friction coefficient, usually in the range [0,1].
                    this.friction = 0.2;
                    /// The restitution (elasticity) usually in the range [0,1].
                    this.restitution = 0;
                    /// The density, usually in kg/m^2.
                    this.density = 0;
                    /// A sensor shape collects contact information but never generates a collision
                    /// response.
                    this.isSensor = false;
                    /// Contact filtering data.
                    this.filter = new b2Filter();
                }
            };
            exports_18("b2FixtureDef", b2FixtureDef);
            /// This proxy is used internally to connect fixtures to the broad-phase.
            b2FixtureProxy = class b2FixtureProxy {
                constructor() {
                    this.aabb = new b2Collision_3.b2AABB();
                    this.fixture = null;
                    this.childIndex = 0;
                    this.proxy = null;
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2FixtureProxy(); });
                }
            };
            exports_18("b2FixtureProxy", b2FixtureProxy);
            /// A fixture is used to attach a shape to a body for collision detection. A fixture
            /// inherits its transform from its parent. Fixtures hold additional non-geometric data
            /// such as friction, collision filters, etc.
            /// Fixtures are created via b2Body::CreateFixture.
            /// @warning you cannot reuse fixtures.
            b2Fixture = class b2Fixture {
                constructor() {
                    this.m_density = 0;
                    this.m_next = null;
                    this.m_body = null;
                    this.m_shape = null;
                    this.m_friction = 0;
                    this.m_restitution = 0;
                    this.m_proxies = null;
                    this.m_proxyCount = 0;
                    this.m_filter = new b2Filter();
                    this.m_isSensor = false;
                    this.m_userData = null;
                }
                /// Get the type of the child shape. You can use this to down cast to the concrete shape.
                /// @return the shape type.
                GetType() {
                    return this.m_shape.GetType();
                }
                /// Get the child shape. You can modify the child shape, however you should not change the
                /// number of vertices because this will crash some collision caching mechanisms.
                /// Manipulating the shape may lead to non-physical behavior.
                GetShape() {
                    return this.m_shape;
                }
                /// Set if this fixture is a sensor.
                SetSensor(sensor) {
                    if (sensor !== this.m_isSensor) {
                        this.m_body.SetAwake(true);
                        this.m_isSensor = sensor;
                    }
                }
                /// Is this fixture a sensor (non-solid)?
                /// @return the true if the shape is a sensor.
                IsSensor() {
                    return this.m_isSensor;
                }
                /// Set the contact filtering data. This will not update contacts until the next time
                /// step when either parent body is active and awake.
                /// This automatically calls Refilter.
                SetFilterData(filter) {
                    this.m_filter.Copy(filter);
                    this.Refilter();
                }
                /// Get the contact filtering data.
                GetFilterData() {
                    return this.m_filter;
                }
                /// Call this if you want to establish collision that was previously disabled by b2ContactFilter::ShouldCollide.
                Refilter() {
                    if (this.m_body) {
                        return;
                    }
                    // Flag associated contacts for filtering.
                    let edge = this.m_body.GetContactList();
                    while (edge) {
                        const contact = edge.contact;
                        const fixtureA = contact.GetFixtureA();
                        const fixtureB = contact.GetFixtureB();
                        if (fixtureA === this || fixtureB === this) {
                            contact.FlagForFiltering();
                        }
                        edge = edge.next;
                    }
                    const world = this.m_body.GetWorld();
                    if (world === null) {
                        return;
                    }
                    // Touch each proxy so that new pairs may be created
                    const broadPhase = world.m_contactManager.m_broadPhase;
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        broadPhase.TouchProxy(this.m_proxies[i].proxy);
                    }
                }
                /// Get the parent body of this fixture. This is NULL if the fixture is not attached.
                /// @return the parent body.
                GetBody() {
                    return this.m_body;
                }
                /// Get the next fixture in the parent body's fixture list.
                /// @return the next shape.
                GetNext() {
                    return this.m_next;
                }
                /// Get the user data that was assigned in the fixture definition. Use this to
                /// store your application specific data.
                GetUserData() {
                    return this.m_userData;
                }
                /// Set the user data. Use this to store your application specific data.
                SetUserData(data) {
                    this.m_userData = data;
                }
                /// Test a point for containment in this fixture.
                /// @param p a point in world coordinates.
                TestPoint(p) {
                    return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
                }
                /// Cast a ray against this shape.
                /// @param output the ray-cast results.
                /// @param input the ray-cast input parameters.
                RayCast(output, input, childIndex) {
                    return this.m_shape.RayCast(output, input, this.m_body.GetTransform(), childIndex);
                }
                /// Get the mass data for this fixture. The mass data is based on the density and
                /// the shape. The rotational inertia is about the shape's origin. This operation
                /// may be expensive.
                GetMassData(massData = new b2Shape_6.b2MassData()) {
                    this.m_shape.ComputeMass(massData, this.m_density);
                    return massData;
                }
                /// Set the density of this fixture. This will _not_ automatically adjust the mass
                /// of the body. You must call b2Body::ResetMassData to update the body's mass.
                SetDensity(density) {
                    this.m_density = density;
                }
                /// Get the density of this fixture.
                GetDensity() {
                    return this.m_density;
                }
                /// Get the coefficient of friction.
                GetFriction() {
                    return this.m_friction;
                }
                /// Set the coefficient of friction. This will _not_ change the friction of
                /// existing contacts.
                SetFriction(friction) {
                    this.m_friction = friction;
                }
                /// Get the coefficient of restitution.
                GetRestitution() {
                    return this.m_restitution;
                }
                /// Set the coefficient of restitution. This will _not_ change the restitution of
                /// existing contacts.
                SetRestitution(restitution) {
                    this.m_restitution = restitution;
                }
                /// Get the fixture's AABB. This AABB may be enlarge and/or stale.
                /// If you need a more accurate AABB, compute it using the shape and
                /// the body transform.
                GetAABB(childIndex) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= childIndex && childIndex < this.m_proxyCount);
                    }
                    return this.m_proxies[childIndex].aabb;
                }
                /// Dump this fixture to the log file.
                Dump(bodyIndex) {
                    if (b2Settings.DEBUG) {
                        b2Settings.b2Log("    const fd: b2FixtureDef = new b2FixtureDef();\n");
                        b2Settings.b2Log("    fd.friction = %.15f;\n", this.m_friction);
                        b2Settings.b2Log("    fd.restitution = %.15f;\n", this.m_restitution);
                        b2Settings.b2Log("    fd.density = %.15f;\n", this.m_density);
                        b2Settings.b2Log("    fd.isSensor = %s;\n", (this.m_isSensor) ? ("true") : ("false"));
                        b2Settings.b2Log("    fd.filter.categoryBits = %d;\n", this.m_filter.categoryBits);
                        b2Settings.b2Log("    fd.filter.maskBits = %d;\n", this.m_filter.maskBits);
                        b2Settings.b2Log("    fd.filter.groupIndex = %d;\n", this.m_filter.groupIndex);
                        this.m_shape.Dump();
                        //      switch (this.m_shape.m_type)
                        //      {
                        //      case b2ShapeType.e_circleShape:
                        //        {
                        //          const circle: b2CircleShape = <b2CircleShape> this.m_shape;
                        //          b2Settings.b2Log("    const shape: b2CircleShape = new b2CircleShape();\n");
                        //          b2Settings.b2Log("    shape.m_radius = %.15f;\n", circle.m_radius);
                        //          b2Settings.b2Log("    shape.m_p.SetXY(%.15f, %.15f);\n", circle.m_p.x, circle.m_p.y);
                        //        }
                        //        break;
                        //
                        //      case b2ShapeType.e_edgeShape:
                        //        {
                        //          const edge: b2EdgeShape = <b2EdgeShape> this.m_shape;
                        //          b2Settings.b2Log("    const shape: b2EdgeShape = new b2EdgeShape();\n");
                        //          b2Settings.b2Log("    shape.m_radius = %.15f;\n", edge.m_radius);
                        //          b2Settings.b2Log("    shape.m_vertex0.SetXY(%.15f, %.15f);\n", edge.m_vertex0.x, edge.m_vertex0.y);
                        //          b2Settings.b2Log("    shape.m_vertex1.SetXY(%.15f, %.15f);\n", edge.m_vertex1.x, edge.m_vertex1.y);
                        //          b2Settings.b2Log("    shape.m_vertex2.SetXY(%.15f, %.15f);\n", edge.m_vertex2.x, edge.m_vertex2.y);
                        //          b2Settings.b2Log("    shape.m_vertex3.SetXY(%.15f, %.15f);\n", edge.m_vertex3.x, edge.m_vertex3.y);
                        //          b2Settings.b2Log("    shape.m_hasVertex0 = %s;\n", edge.m_hasVertex0);
                        //          b2Settings.b2Log("    shape.m_hasVertex3 = %s;\n", edge.m_hasVertex3);
                        //        }
                        //        break;
                        //
                        //      case b2ShapeType.e_polygonShape:
                        //        {
                        //          const polygon: b2PolygonShape = <b2PolygonShape> this.m_shape;
                        //          b2Settings.b2Log("    const shape: b2PolygonShape = new b2PolygonShape();\n");
                        //          b2Settings.b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2_maxPolygonVertices);
                        //          for (let i: number = 0; i < polygon.m_count; ++i)
                        //          {
                        //            b2Settings.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, polygon.m_vertices[i].x, polygon.m_vertices[i].y);
                        //          }
                        //          b2Settings.b2Log("    shape.SetAsVector(vs, %d);\n", polygon.m_count);
                        //        }
                        //        break;
                        //
                        //      case b2ShapeType.e_chainShape:
                        //        {
                        //          const chain: b2ChainShape = <b2ChainShape> this.m_shape;
                        //          b2Settings.b2Log("    const shape: b2ChainShape = new b2ChainShape();\n");
                        //          b2Settings.b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2_maxPolygonVertices);
                        //          for (let i: number = 0; i < chain.m_count; ++i)
                        //          {
                        //            b2Settings.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, chain.m_vertices[i].x, chain.m_vertices[i].y);
                        //          }
                        //          b2Settings.b2Log("    shape.CreateChain(vs, %d);\n", chain.m_count);
                        //          b2Settings.b2Log("    shape.m_prevVertex.SetXY(%.15f, %.15f);\n", chain.m_prevVertex.x, chain.m_prevVertex.y);
                        //          b2Settings.b2Log("    shape.m_nextVertex.SetXY(%.15f, %.15f);\n", chain.m_nextVertex.x, chain.m_nextVertex.y);
                        //          b2Settings.b2Log("    shape.m_hasPrevVertex = %s;\n", (chain.m_hasPrevVertex)?('true'):('false'));
                        //          b2Settings.b2Log("    shape.m_hasNextVertex = %s;\n", (chain.m_hasNextVertex)?('true'):('false'));
                        //        }
                        //        break;
                        //
                        //      default:
                        //        return;
                        //      }
                        b2Settings.b2Log("\n");
                        b2Settings.b2Log("    fd.shape = shape;\n");
                        b2Settings.b2Log("\n");
                        b2Settings.b2Log("    bodies[%d].CreateFixture(fd);\n", bodyIndex);
                    }
                }
                // We need separation create/destroy functions from the constructor/destructor because
                // the destructor cannot access the allocator (no destructor arguments allowed by C++).
                Create(body, def) {
                    this.m_userData = def.userData;
                    this.m_friction = def.friction;
                    this.m_restitution = def.restitution;
                    this.m_body = body;
                    this.m_next = null;
                    this.m_filter.Copy(def.filter);
                    this.m_isSensor = def.isSensor;
                    this.m_shape = def.shape.Clone();
                    // Reserve proxy space
                    // const childCount = m_shape->GetChildCount();
                    // m_proxies = (b2FixtureProxy*)allocator->Allocate(childCount * sizeof(b2FixtureProxy));
                    // for (int32 i = 0; i < childCount; ++i)
                    // {
                    //   m_proxies[i].fixture = NULL;
                    //   m_proxies[i].proxyId = b2BroadPhase::e_nullProxy;
                    // }
                    this.m_proxies = b2FixtureProxy.MakeArray(this.m_shape.GetChildCount());
                    this.m_proxyCount = 0;
                    this.m_density = def.density;
                }
                Destroy() {
                    // The proxies must be destroyed before calling this.
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_proxyCount === 0);
                    }
                    // Free the proxy array.
                    // int32 childCount = m_shape->GetChildCount();
                    // allocator->Free(m_proxies, childCount * sizeof(b2FixtureProxy));
                    // m_proxies = NULL;
                    this.m_shape = null;
                }
                // These support body activation/deactivation.
                CreateProxies(broadPhase, xf) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_proxyCount === 0);
                    }
                    // Create proxies in the broad-phase.
                    this.m_proxyCount = this.m_shape.GetChildCount();
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i];
                        this.m_shape.ComputeAABB(proxy.aabb, xf, i);
                        proxy.proxy = broadPhase.CreateProxy(proxy.aabb, proxy);
                        proxy.fixture = this;
                        proxy.childIndex = i;
                    }
                }
                DestroyProxies(broadPhase) {
                    // Destroy proxies in the broad-phase.
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i];
                        broadPhase.DestroyProxy(proxy.proxy);
                        proxy.proxy = null;
                    }
                    this.m_proxyCount = 0;
                }
                Synchronize(broadPhase, transform1, transform2) {
                    if (this.m_proxyCount === 0) {
                        return;
                    }
                    for (let i = 0; i < this.m_proxyCount; ++i) {
                        const proxy = this.m_proxies[i];
                        // Compute an AABB that covers the swept shape (may miss some rotation effect).
                        const aabb1 = b2Fixture.Synchronize_s_aabb1;
                        const aabb2 = b2Fixture.Synchronize_s_aabb2;
                        this.m_shape.ComputeAABB(aabb1, transform1, i);
                        this.m_shape.ComputeAABB(aabb2, transform2, i);
                        proxy.aabb.Combine2(aabb1, aabb2);
                        const displacement = b2Math_13.b2Vec2.SubVV(transform2.p, transform1.p, b2Fixture.Synchronize_s_displacement);
                        broadPhase.MoveProxy(proxy.proxy, proxy.aabb, displacement);
                    }
                }
            };
            b2Fixture.Synchronize_s_aabb1 = new b2Collision_3.b2AABB();
            b2Fixture.Synchronize_s_aabb2 = new b2Collision_3.b2AABB();
            b2Fixture.Synchronize_s_displacement = new b2Math_13.b2Vec2();
            exports_18("b2Fixture", b2Fixture);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/b2Body", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/Shapes/b2Shape", "Box2D/Dynamics/b2Fixture"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var b2Settings, b2Math_14, b2Shape_7, b2Fixture_1;
    var b2BodyDef, b2Body;
    return {
        setters:[
            function (b2Settings_14) {
                b2Settings = b2Settings_14;
            },
            function (b2Math_14_1) {
                b2Math_14 = b2Math_14_1;
            },
            function (b2Shape_7_1) {
                b2Shape_7 = b2Shape_7_1;
            },
            function (b2Fixture_1_1) {
                b2Fixture_1 = b2Fixture_1_1;
            }],
        execute: function() {
            /// A body definition holds all the data needed to construct a rigid body.
            /// You can safely re-use body definitions. Shapes are added to a body after construction.
            b2BodyDef = class b2BodyDef {
                constructor() {
                    /// The body type: static, kinematic, or dynamic.
                    /// Note: if a dynamic body would have zero mass, the mass is set to one.
                    this.type = 0 /* b2_staticBody */;
                    /// The world position of the body. Avoid creating bodies at the origin
                    /// since this can lead to many overlapping shapes.
                    this.position = new b2Math_14.b2Vec2(0, 0);
                    /// The world angle of the body in radians.
                    this.angle = 0;
                    /// The linear velocity of the body's origin in world co-ordinates.
                    this.linearVelocity = new b2Math_14.b2Vec2(0, 0);
                    /// The angular velocity of the body.
                    this.angularVelocity = 0;
                    /// Linear damping is use to reduce the linear velocity. The damping parameter
                    /// can be larger than 1.0f but the damping effect becomes sensitive to the
                    /// time step when the damping parameter is large.
                    this.linearDamping = 0;
                    /// Angular damping is use to reduce the angular velocity. The damping parameter
                    /// can be larger than 1.0f but the damping effect becomes sensitive to the
                    /// time step when the damping parameter is large.
                    this.angularDamping = 0;
                    /// Set this flag to false if this body should never fall asleep. Note that
                    /// this increases CPU usage.
                    this.allowSleep = true;
                    /// Is this body initially awake or sleeping?
                    this.awake = true;
                    /// Should this body be prevented from rotating? Useful for characters.
                    this.fixedRotation = false;
                    /// Is this a fast moving body that should be prevented from tunneling through
                    /// other moving bodies? Note that all bodies are prevented from tunneling through
                    /// kinematic and static bodies. This setting is only considered on dynamic bodies.
                    /// @warning You should use this flag sparingly since it increases processing time.
                    this.bullet = false;
                    /// Does this body start out active?
                    this.active = true;
                    /// Use this to store application specific body data.
                    this.userData = null;
                    /// Scale the gravity applied to this body.
                    this.gravityScale = 1;
                }
            };
            exports_19("b2BodyDef", b2BodyDef);
            /// A rigid body. These are created via b2World::CreateBody.
            b2Body = class b2Body {
                // public m_controllerList: b2ControllerEdge = null;
                // public m_controllerCount: number = 0;
                constructor(bd, world) {
                    this.m_type = 0 /* b2_staticBody */;
                    this.m_flags = 0 /* e_none */;
                    this.m_islandIndex = 0;
                    this.m_xf = new b2Math_14.b2Transform(); // the body origin transform
                    this.m_sweep = new b2Math_14.b2Sweep(); // the swept motion for CCD
                    this.m_linearVelocity = new b2Math_14.b2Vec2();
                    this.m_angularVelocity = 0;
                    this.m_force = new b2Math_14.b2Vec2;
                    this.m_torque = 0;
                    this.m_world = null;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_fixtureList = null;
                    this.m_fixtureCount = 0;
                    this.m_jointList = null;
                    this.m_contactList = null;
                    this.m_mass = 1;
                    this.m_invMass = 1;
                    // Rotational inertia about the center of mass.
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_linearDamping = 0;
                    this.m_angularDamping = 0;
                    this.m_gravityScale = 1;
                    this.m_sleepTime = 0;
                    this.m_userData = null;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(bd.position.IsValid());
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(bd.linearVelocity.IsValid());
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_14.b2IsValid(bd.angle));
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_14.b2IsValid(bd.angularVelocity));
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_14.b2IsValid(bd.gravityScale) && bd.gravityScale >= 0);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_14.b2IsValid(bd.angularDamping) && bd.angularDamping >= 0);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_14.b2IsValid(bd.linearDamping) && bd.linearDamping >= 0);
                    }
                    this.m_flags = 0 /* e_none */;
                    if (bd.bullet) {
                        this.m_flags |= 8 /* e_bulletFlag */;
                    }
                    if (bd.fixedRotation) {
                        this.m_flags |= 16 /* e_fixedRotationFlag */;
                    }
                    if (bd.allowSleep) {
                        this.m_flags |= 4 /* e_autoSleepFlag */;
                    }
                    if (bd.awake) {
                        this.m_flags |= 2 /* e_awakeFlag */;
                    }
                    if (bd.active) {
                        this.m_flags |= 32 /* e_activeFlag */;
                    }
                    this.m_world = world;
                    this.m_xf.p.Copy(bd.position);
                    this.m_xf.q.SetAngleRadians(bd.angle);
                    this.m_sweep.localCenter.SetZero();
                    this.m_sweep.c0.Copy(this.m_xf.p);
                    this.m_sweep.c.Copy(this.m_xf.p);
                    this.m_sweep.a0 = bd.angle;
                    this.m_sweep.a = bd.angle;
                    this.m_sweep.alpha0 = 0;
                    this.m_linearVelocity.Copy(bd.linearVelocity);
                    this.m_angularVelocity = bd.angularVelocity;
                    this.m_linearDamping = bd.linearDamping;
                    this.m_angularDamping = bd.angularDamping;
                    this.m_gravityScale = bd.gravityScale;
                    this.m_force.SetZero();
                    this.m_torque = 0;
                    this.m_sleepTime = 0;
                    this.m_type = bd.type;
                    if (bd.type === 2 /* b2_dynamicBody */) {
                        this.m_mass = 1;
                        this.m_invMass = 1;
                    }
                    else {
                        this.m_mass = 0;
                        this.m_invMass = 0;
                    }
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_userData = bd.userData;
                    this.m_fixtureList = null;
                    this.m_fixtureCount = 0;
                    // this.m_controllerList = null;
                    // this.m_controllerCount = 0;
                }
                /// Creates a fixture and attach it to this body. Use this function if you need
                /// to set some fixture parameters, like friction. Otherwise you can create the
                /// fixture directly from a shape.
                /// If the density is non-zero, this function automatically updates the mass of the body.
                /// Contacts are not created until the next time step.
                /// @param def the fixture definition.
                /// @warning This function is locked during callbacks.
                CreateFixture(def) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_world.IsLocked() === false);
                    }
                    if (this.m_world.IsLocked() === true) {
                        return null;
                    }
                    const fixture = new b2Fixture_1.b2Fixture();
                    fixture.Create(this, def);
                    if (this.m_flags & 32 /* e_activeFlag */) {
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        fixture.CreateProxies(broadPhase, this.m_xf);
                    }
                    fixture.m_next = this.m_fixtureList;
                    this.m_fixtureList = fixture;
                    ++this.m_fixtureCount;
                    fixture.m_body = this;
                    // Adjust mass properties if needed.
                    if (fixture.m_density > 0) {
                        this.ResetMassData();
                    }
                    // Let the world know we have a new fixture. This will cause new contacts
                    // to be created at the beginning of the next time step.
                    this.m_world.m_flags |= 1 /* e_newFixture */;
                    return fixture;
                }
                CreateFixture2(shape, density = 0) {
                    const def = b2Body.CreateFixture2_s_def;
                    def.shape = shape;
                    def.density = density;
                    return this.CreateFixture(def);
                }
                /// Destroy a fixture. This removes the fixture from the broad-phase and
                /// destroys all contacts associated with this fixture. This will
                /// automatically adjust the mass of the body if the body is dynamic and the
                /// fixture has positive density.
                /// All fixtures attached to a body are implicitly destroyed when the body is destroyed.
                /// @param fixture the fixture to be removed.
                /// @warning This function is locked during callbacks.
                DestroyFixture(fixture) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_world.IsLocked() === false);
                    }
                    if (this.m_world.IsLocked() === true) {
                        return;
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixture.m_body === this);
                    }
                    // Remove the fixture from this body's singly linked list.
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_fixtureCount > 0);
                    }
                    let node = this.m_fixtureList;
                    let ppF = null;
                    let found = false;
                    while (node !== null) {
                        if (node === fixture) {
                            if (ppF)
                                ppF.m_next = fixture.m_next;
                            else
                                this.m_fixtureList = fixture.m_next;
                            found = true;
                            break;
                        }
                        ppF = node;
                        node = node.m_next;
                    }
                    // You tried to remove a shape that is not attached to this body.
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(found);
                    }
                    // Destroy any contacts associated with the fixture.
                    let edge = this.m_contactList;
                    while (edge) {
                        const c = edge.contact;
                        edge = edge.next;
                        const fixtureA = c.GetFixtureA();
                        const fixtureB = c.GetFixtureB();
                        if (fixture === fixtureA || fixture === fixtureB) {
                            // This destroys the contact and removes it from
                            // this body's contact list.
                            this.m_world.m_contactManager.Destroy(c);
                        }
                    }
                    if (this.m_flags & 32 /* e_activeFlag */) {
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        fixture.DestroyProxies(broadPhase);
                    }
                    fixture.Destroy();
                    fixture.m_body = null;
                    fixture.m_next = null;
                    --this.m_fixtureCount;
                    // Reset the mass data.
                    this.ResetMassData();
                }
                /// Set the position of the body's origin and rotation.
                /// This breaks any contacts and wakes the other bodies.
                /// Manipulating a body's transform may cause non-physical behavior.
                /// @param position the world position of the body's local origin.
                /// @param angle the world rotation in radians.
                SetTransformVecRadians(position, angle) {
                    this.SetTransformXYRadians(position.x, position.y, angle);
                }
                SetTransformXYRadians(x, y, angle) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_world.IsLocked() === false);
                    }
                    if (this.m_world.IsLocked() === true) {
                        return;
                    }
                    this.m_xf.q.SetAngleRadians(angle);
                    this.m_xf.p.SetXY(x, y);
                    b2Math_14.b2Transform.MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
                    this.m_sweep.a = angle;
                    this.m_sweep.c0.Copy(this.m_sweep.c);
                    this.m_sweep.a0 = angle;
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        f.Synchronize(broadPhase, this.m_xf, this.m_xf);
                    }
                    this.m_world.m_contactManager.FindNewContacts();
                }
                SetTransform(xf) {
                    this.SetTransformVecRadians(xf.p, xf.GetAngleRadians());
                }
                /// Get the body transform for the body's origin.
                /// @return the world transform of the body's origin.
                GetTransform() {
                    return this.m_xf;
                }
                /// Get the world body origin position.
                /// @return the world position of the body's origin.
                GetPosition() {
                    return this.m_xf.p;
                }
                SetPosition(position) {
                    this.SetTransformVecRadians(position, this.GetAngleRadians());
                }
                SetPositionXY(x, y) {
                    this.SetTransformXYRadians(x, y, this.GetAngleRadians());
                }
                /// Get the angle in radians.
                /// @return the current world rotation angle in radians.
                GetAngleRadians() {
                    return this.m_sweep.a;
                }
                SetAngleRadians(angle) {
                    this.SetTransformVecRadians(this.GetPosition(), angle);
                }
                /// Get the world position of the center of mass.
                GetWorldCenter() {
                    return this.m_sweep.c;
                }
                /// Get the local position of the center of mass.
                GetLocalCenter() {
                    return this.m_sweep.localCenter;
                }
                /// Set the linear velocity of the center of mass.
                /// @param v the new linear velocity of the center of mass.
                SetLinearVelocity(v) {
                    if (this.m_type === 0 /* b2_staticBody */) {
                        return;
                    }
                    if (b2Math_14.b2Vec2.DotVV(v, v) > 0) {
                        this.SetAwake(true);
                    }
                    this.m_linearVelocity.Copy(v);
                }
                /// Get the linear velocity of the center of mass.
                /// @return the linear velocity of the center of mass.
                GetLinearVelocity() {
                    return this.m_linearVelocity;
                }
                /// Set the angular velocity.
                /// @param omega the new angular velocity in radians/second.
                SetAngularVelocity(w) {
                    if (this.m_type === 0 /* b2_staticBody */) {
                        return;
                    }
                    if (w * w > 0) {
                        this.SetAwake(true);
                    }
                    this.m_angularVelocity = w;
                }
                /// Get the angular velocity.
                /// @return the angular velocity in radians/second.
                GetAngularVelocity() {
                    return this.m_angularVelocity;
                }
                GetDefinition(bd) {
                    bd.type = this.GetType();
                    bd.allowSleep = (this.m_flags & 4 /* e_autoSleepFlag */) === 4 /* e_autoSleepFlag */;
                    bd.angle = this.GetAngleRadians();
                    bd.angularDamping = this.m_angularDamping;
                    bd.gravityScale = this.m_gravityScale;
                    bd.angularVelocity = this.m_angularVelocity;
                    bd.fixedRotation = (this.m_flags & 16 /* e_fixedRotationFlag */) === 16 /* e_fixedRotationFlag */;
                    bd.bullet = (this.m_flags & 8 /* e_bulletFlag */) === 8 /* e_bulletFlag */;
                    bd.awake = (this.m_flags & 2 /* e_awakeFlag */) === 2 /* e_awakeFlag */;
                    bd.linearDamping = this.m_linearDamping;
                    bd.linearVelocity.Copy(this.GetLinearVelocity());
                    bd.position.Copy(this.GetPosition());
                    bd.userData = this.GetUserData();
                    return bd;
                }
                /// Apply a force at a world point. If the force is not
                /// applied at the center of mass, it will generate a torque and
                /// affect the angular velocity. This wakes up the body.
                /// @param force the world force vector, usually in Newtons (N).
                /// @param point the world position of the point of application.
                /// @param wake also wake up the body
                ApplyForce(force, point, wake = true) {
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
                        return;
                    }
                    if (wake && (this.m_flags & 2 /* e_awakeFlag */) === 0) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_flags & 2 /* e_awakeFlag */) {
                        this.m_force.x += force.x;
                        this.m_force.y += force.y;
                        this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
                    }
                }
                /// Apply a force to the center of mass. This wakes up the body.
                /// @param force the world force vector, usually in Newtons (N).
                /// @param wake also wake up the body
                ApplyForceToCenter(force, wake = true) {
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
                        return;
                    }
                    if (wake && (this.m_flags & 2 /* e_awakeFlag */) === 0) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_flags & 2 /* e_awakeFlag */) {
                        this.m_force.x += force.x;
                        this.m_force.y += force.y;
                    }
                }
                /// Apply a torque. This affects the angular velocity
                /// without affecting the linear velocity of the center of mass.
                /// This wakes up the body.
                /// @param torque about the z-axis (out of the screen), usually in N-m.
                /// @param wake also wake up the body
                ApplyTorque(torque, wake = true) {
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
                        return;
                    }
                    if (wake && (this.m_flags & 2 /* e_awakeFlag */) === 0) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_flags & 2 /* e_awakeFlag */) {
                        this.m_torque += torque;
                    }
                }
                /// Apply an impulse at a point. This immediately modifies the velocity.
                /// It also modifies the angular velocity if the point of application
                /// is not at the center of mass. This wakes up the body.
                /// @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
                /// @param point the world position of the point of application.
                /// @param wake also wake up the body
                ApplyLinearImpulse(impulse, point, wake = true) {
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
                        return;
                    }
                    if (wake && (this.m_flags & 2 /* e_awakeFlag */) === 0) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_flags & 2 /* e_awakeFlag */) {
                        this.m_linearVelocity.x += this.m_invMass * impulse.x;
                        this.m_linearVelocity.y += this.m_invMass * impulse.y;
                        this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
                    }
                }
                /// Apply an angular impulse.
                /// @param impulse the angular impulse in units of kg*m*m/s
                /// @param wake also wake up the body
                ApplyAngularImpulse(impulse, wake = true) {
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
                        return;
                    }
                    if (wake && (this.m_flags & 2 /* e_awakeFlag */) === 0) {
                        this.SetAwake(true);
                    }
                    // Don't accumulate a force if the body is sleeping.
                    if (this.m_flags & 2 /* e_awakeFlag */) {
                        this.m_angularVelocity += this.m_invI * impulse;
                    }
                }
                /// Get the total mass of the body.
                /// @return the mass, usually in kilograms (kg).
                GetMass() {
                    return this.m_mass;
                }
                /// Get the rotational inertia of the body about the local origin.
                /// @return the rotational inertia, usually in kg-m^2.
                GetInertia() {
                    return this.m_I + this.m_mass * b2Math_14.b2Vec2.DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
                }
                /// Get the mass data of the body.
                /// @return a struct containing the mass, inertia and center of the body.
                GetMassData(data) {
                    data.mass = this.m_mass;
                    data.I = this.m_I + this.m_mass * b2Math_14.b2Vec2.DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
                    data.center.Copy(this.m_sweep.localCenter);
                    return data;
                }
                SetMassData(massData) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_world.IsLocked() === false);
                    }
                    if (this.m_world.IsLocked() === true) {
                        return;
                    }
                    if (this.m_type !== 2 /* b2_dynamicBody */) {
                        return;
                    }
                    this.m_invMass = 0;
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_mass = massData.mass;
                    if (this.m_mass <= 0) {
                        this.m_mass = 1;
                    }
                    this.m_invMass = 1 / this.m_mass;
                    if (massData.I > 0 && (this.m_flags & 16 /* e_fixedRotationFlag */) === 0) {
                        this.m_I = massData.I - this.m_mass * b2Math_14.b2Vec2.DotVV(massData.center, massData.center);
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(this.m_I > 0);
                        }
                        this.m_invI = 1 / this.m_I;
                    }
                    // Move center of mass.
                    const oldCenter = b2Body.SetMassData_s_oldCenter.Copy(this.m_sweep.c);
                    this.m_sweep.localCenter.Copy(massData.center);
                    b2Math_14.b2Transform.MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
                    this.m_sweep.c0.Copy(this.m_sweep.c);
                    // Update center of mass velocity.
                    b2Math_14.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_14.b2Vec2.SubVV(this.m_sweep.c, oldCenter, b2Math_14.b2Vec2.s_t0), this.m_linearVelocity);
                }
                ResetMassData() {
                    // Compute mass data from shapes. Each shape has its own density.
                    this.m_mass = 0;
                    this.m_invMass = 0;
                    this.m_I = 0;
                    this.m_invI = 0;
                    this.m_sweep.localCenter.SetZero();
                    // Static and kinematic bodies have zero mass.
                    if (this.m_type === 0 /* b2_staticBody */ || this.m_type === 1 /* b2_kinematicBody */) {
                        this.m_sweep.c0.Copy(this.m_xf.p);
                        this.m_sweep.c.Copy(this.m_xf.p);
                        this.m_sweep.a0 = this.m_sweep.a;
                        return;
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_type === 2 /* b2_dynamicBody */);
                    }
                    // Accumulate mass over all fixtures.
                    const localCenter = b2Body.ResetMassData_s_localCenter.SetZero();
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        if (f.m_density === 0) {
                            continue;
                        }
                        const massData = f.GetMassData(b2Body.ResetMassData_s_massData);
                        this.m_mass += massData.mass;
                        localCenter.x += massData.center.x * massData.mass;
                        localCenter.y += massData.center.y * massData.mass;
                        this.m_I += massData.I;
                    }
                    // Compute center of mass.
                    if (this.m_mass > 0) {
                        this.m_invMass = 1 / this.m_mass;
                        localCenter.x *= this.m_invMass;
                        localCenter.y *= this.m_invMass;
                    }
                    else {
                        // Force all dynamic bodies to have a positive mass.
                        this.m_mass = 1;
                        this.m_invMass = 1;
                    }
                    if (this.m_I > 0 && (this.m_flags & 16 /* e_fixedRotationFlag */) === 0) {
                        // Center the inertia about the center of mass.
                        this.m_I -= this.m_mass * b2Math_14.b2Vec2.DotVV(localCenter, localCenter);
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(this.m_I > 0);
                        }
                        this.m_invI = 1 / this.m_I;
                    }
                    else {
                        this.m_I = 0;
                        this.m_invI = 0;
                    }
                    // Move center of mass.
                    const oldCenter = b2Body.ResetMassData_s_oldCenter.Copy(this.m_sweep.c);
                    this.m_sweep.localCenter.Copy(localCenter);
                    b2Math_14.b2Transform.MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
                    this.m_sweep.c0.Copy(this.m_sweep.c);
                    // Update center of mass velocity.
                    b2Math_14.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_14.b2Vec2.SubVV(this.m_sweep.c, oldCenter, b2Math_14.b2Vec2.s_t0), this.m_linearVelocity);
                }
                /// Get the world coordinates of a point given the local coordinates.
                /// @param localPoint a point on the body measured relative the the body's origin.
                /// @return the same point expressed in world coordinates.
                GetWorldPoint(localPoint, out) {
                    return b2Math_14.b2Transform.MulXV(this.m_xf, localPoint, out);
                }
                /// Get the world coordinates of a vector given the local coordinates.
                /// @param localVector a vector fixed in the body.
                /// @return the same vector expressed in world coordinates.
                GetWorldVector(localVector, out) {
                    return b2Math_14.b2Rot.MulRV(this.m_xf.q, localVector, out);
                }
                /// Gets a local point relative to the body's origin given a world point.
                /// @param a point in world coordinates.
                /// @return the corresponding local point relative to the body's origin.
                GetLocalPoint(worldPoint, out) {
                    return b2Math_14.b2Transform.MulTXV(this.m_xf, worldPoint, out);
                }
                /// Gets a local vector given a world vector.
                /// @param a vector in world coordinates.
                /// @return the corresponding local vector.
                GetLocalVector(worldVector, out) {
                    return b2Math_14.b2Rot.MulTRV(this.m_xf.q, worldVector, out);
                }
                /// Get the world linear velocity of a world point attached to this body.
                /// @param a point in world coordinates.
                /// @return the world velocity of a point.
                GetLinearVelocityFromWorldPoint(worldPoint, out) {
                    return b2Math_14.b2Vec2.AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2Math_14.b2Vec2.SubVV(worldPoint, this.m_sweep.c, b2Math_14.b2Vec2.s_t0), out);
                }
                /// Get the world velocity of a local point.
                /// @param a point in local coordinates.
                /// @return the world velocity of a point.
                GetLinearVelocityFromLocalPoint(localPoint, out) {
                    return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(localPoint, out), out);
                }
                /// Get the linear damping of the body.
                GetLinearDamping() {
                    return this.m_linearDamping;
                }
                /// Set the linear damping of the body.
                SetLinearDamping(linearDamping) {
                    this.m_linearDamping = linearDamping;
                }
                /// Get the angular damping of the body.
                GetAngularDamping() {
                    return this.m_angularDamping;
                }
                /// Set the angular damping of the body.
                SetAngularDamping(angularDamping) {
                    this.m_angularDamping = angularDamping;
                }
                /// Get the gravity scale of the body.
                GetGravityScale() {
                    return this.m_gravityScale;
                }
                /// Set the gravity scale of the body.
                SetGravityScale(scale) {
                    this.m_gravityScale = scale;
                }
                /// Set the type of this body. This may alter the mass and velocity.
                SetType(type) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_world.IsLocked() === false);
                    }
                    if (this.m_world.IsLocked() === true) {
                        return;
                    }
                    if (this.m_type === type) {
                        return;
                    }
                    this.m_type = type;
                    this.ResetMassData();
                    if (this.m_type === 0 /* b2_staticBody */) {
                        this.m_linearVelocity.SetZero();
                        this.m_angularVelocity = 0;
                        this.m_sweep.a0 = this.m_sweep.a;
                        this.m_sweep.c0.Copy(this.m_sweep.c);
                        this.SynchronizeFixtures();
                    }
                    this.SetAwake(true);
                    this.m_force.SetZero();
                    this.m_torque = 0;
                    // Delete the attached contacts.
                    let ce = this.m_contactList;
                    while (ce) {
                        const ce0 = ce;
                        ce = ce.next;
                        this.m_world.m_contactManager.Destroy(ce0.contact);
                    }
                    this.m_contactList = null;
                    // Touch the proxies so that new contacts will be created (when appropriate)
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        const proxyCount = f.m_proxyCount;
                        for (let i = 0; i < proxyCount; ++i) {
                            broadPhase.TouchProxy(f.m_proxies[i].proxy);
                        }
                    }
                }
                /// Get the type of this body.
                GetType() {
                    return this.m_type;
                }
                /// Should this body be treated like a bullet for continuous collision detection?
                SetBullet(flag) {
                    if (flag) {
                        this.m_flags |= 8 /* e_bulletFlag */;
                    }
                    else {
                        this.m_flags &= ~8 /* e_bulletFlag */;
                    }
                }
                /// Is this body treated like a bullet for continuous collision detection?
                IsBullet() {
                    return (this.m_flags & 8 /* e_bulletFlag */) === 8 /* e_bulletFlag */;
                }
                /// You can disable sleeping on this body. If you disable sleeping, the
                /// body will be woken.
                SetSleepingAllowed(flag) {
                    if (flag) {
                        this.m_flags |= 4 /* e_autoSleepFlag */;
                    }
                    else {
                        this.m_flags &= ~4 /* e_autoSleepFlag */;
                        this.SetAwake(true);
                    }
                }
                /// Is this body allowed to sleep
                IsSleepingAllowed() {
                    return (this.m_flags & 4 /* e_autoSleepFlag */) === 4 /* e_autoSleepFlag */;
                }
                /// Set the sleep state of the body. A sleeping body has very
                /// low CPU cost.
                /// @param flag set to true to wake the body, false to put it to sleep.
                SetAwake(flag) {
                    if (flag) {
                        if ((this.m_flags & 2 /* e_awakeFlag */) === 0) {
                            this.m_flags |= 2 /* e_awakeFlag */;
                            this.m_sleepTime = 0;
                        }
                    }
                    else {
                        this.m_flags &= ~2 /* e_awakeFlag */;
                        this.m_sleepTime = 0;
                        this.m_linearVelocity.SetZero();
                        this.m_angularVelocity = 0;
                        this.m_force.SetZero();
                        this.m_torque = 0;
                    }
                }
                /// Get the sleeping state of this body.
                /// @return true if the body is sleeping.
                IsAwake() {
                    return (this.m_flags & 2 /* e_awakeFlag */) === 2 /* e_awakeFlag */;
                }
                /// Set the active state of the body. An inactive body is not
                /// simulated and cannot be collided with or woken up.
                /// If you pass a flag of true, all fixtures will be added to the
                /// broad-phase.
                /// If you pass a flag of false, all fixtures will be removed from
                /// the broad-phase and all contacts will be destroyed.
                /// Fixtures and joints are otherwise unaffected. You may continue
                /// to create/destroy fixtures and joints on inactive bodies.
                /// Fixtures on an inactive body are implicitly inactive and will
                /// not participate in collisions, ray-casts, or queries.
                /// Joints connected to an inactive body are implicitly inactive.
                /// An inactive body is still owned by a b2World object and remains
                /// in the body list.
                SetActive(flag) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_world.IsLocked() === false);
                    }
                    if (flag === this.IsActive()) {
                        return;
                    }
                    if (flag) {
                        this.m_flags |= 32 /* e_activeFlag */;
                        // Create all proxies.
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        for (let f = this.m_fixtureList; f; f = f.m_next) {
                            f.CreateProxies(broadPhase, this.m_xf);
                        }
                    }
                    else {
                        this.m_flags &= ~32 /* e_activeFlag */;
                        // Destroy all proxies.
                        const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                        for (let f = this.m_fixtureList; f; f = f.m_next) {
                            f.DestroyProxies(broadPhase);
                        }
                        // Destroy the attached contacts.
                        let ce = this.m_contactList;
                        while (ce) {
                            const ce0 = ce;
                            ce = ce.next;
                            this.m_world.m_contactManager.Destroy(ce0.contact);
                        }
                        this.m_contactList = null;
                    }
                }
                /// Get the active state of the body.
                IsActive() {
                    return (this.m_flags & 32 /* e_activeFlag */) === 32 /* e_activeFlag */;
                }
                /// Set this body to have fixed rotation. This causes the mass
                /// to be reset.
                SetFixedRotation(flag) {
                    const status = (this.m_flags & 16 /* e_fixedRotationFlag */) === 16 /* e_fixedRotationFlag */;
                    if (status === flag) {
                        return;
                    }
                    if (flag) {
                        this.m_flags |= 16 /* e_fixedRotationFlag */;
                    }
                    else {
                        this.m_flags &= ~16 /* e_fixedRotationFlag */;
                    }
                    this.m_angularVelocity = 0;
                    this.ResetMassData();
                }
                /// Does this body have fixed rotation?
                IsFixedRotation() {
                    return (this.m_flags & 16 /* e_fixedRotationFlag */) === 16 /* e_fixedRotationFlag */;
                }
                /// Get the list of all fixtures attached to this body.
                GetFixtureList() {
                    return this.m_fixtureList;
                }
                /// Get the list of all joints attached to this body.
                GetJointList() {
                    return this.m_jointList;
                }
                /// Get the list of all contacts attached to this body.
                /// @warning this list changes during the time step and you may
                /// miss some collisions if you don't use b2ContactListener.
                GetContactList() {
                    return this.m_contactList;
                }
                /// Get the next body in the world's body list.
                GetNext() {
                    return this.m_next;
                }
                /// Get the user data pointer that was provided in the body definition.
                GetUserData() {
                    return this.m_userData;
                }
                /// Set the user data. Use this to store your application specific data.
                SetUserData(data) {
                    this.m_userData = data;
                }
                /// Get the parent world of this body.
                GetWorld() {
                    return this.m_world;
                }
                /// Dump this body to a log file
                Dump() {
                    if (b2Settings.DEBUG) {
                        const bodyIndex = this.m_islandIndex;
                        b2Settings.b2Log("{\n");
                        b2Settings.b2Log("  const bd: b2BodyDef = new b2BodyDef();\n");
                        let type_str = "";
                        switch (this.m_type) {
                            case 0 /* b2_staticBody */:
                                type_str = "b2BodyType.b2_staticBody";
                                break;
                            case 1 /* b2_kinematicBody */:
                                type_str = "b2BodyType.b2_kinematicBody";
                                break;
                            case 2 /* b2_dynamicBody */:
                                type_str = "b2BodyType.b2_dynamicBody";
                                break;
                            default:
                                if (b2Settings.ENABLE_ASSERTS) {
                                    b2Settings.b2Assert(false);
                                }
                                break;
                        }
                        b2Settings.b2Log("  bd.type = %s;\n", type_str);
                        b2Settings.b2Log("  bd.position.SetXY(%.15f, %.15f);\n", this.m_xf.p.x, this.m_xf.p.y);
                        b2Settings.b2Log("  bd.angle = %.15f;\n", this.m_sweep.a);
                        b2Settings.b2Log("  bd.linearVelocity.SetXY(%.15f, %.15f);\n", this.m_linearVelocity.x, this.m_linearVelocity.y);
                        b2Settings.b2Log("  bd.angularVelocity = %.15f;\n", this.m_angularVelocity);
                        b2Settings.b2Log("  bd.linearDamping = %.15f;\n", this.m_linearDamping);
                        b2Settings.b2Log("  bd.angularDamping = %.15f;\n", this.m_angularDamping);
                        b2Settings.b2Log("  bd.allowSleep = %s;\n", (this.m_flags & 4 /* e_autoSleepFlag */) ? ("true") : ("false"));
                        b2Settings.b2Log("  bd.awake = %s;\n", (this.m_flags & 2 /* e_awakeFlag */) ? ("true") : ("false"));
                        b2Settings.b2Log("  bd.fixedRotation = %s;\n", (this.m_flags & 16 /* e_fixedRotationFlag */) ? ("true") : ("false"));
                        b2Settings.b2Log("  bd.bullet = %s;\n", (this.m_flags & 8 /* e_bulletFlag */) ? ("true") : ("false"));
                        b2Settings.b2Log("  bd.active = %s;\n", (this.m_flags & 32 /* e_activeFlag */) ? ("true") : ("false"));
                        b2Settings.b2Log("  bd.gravityScale = %.15f;\n", this.m_gravityScale);
                        b2Settings.b2Log("\n");
                        b2Settings.b2Log("  bodies[%d] = this.m_world.CreateBody(bd);\n", this.m_islandIndex);
                        b2Settings.b2Log("\n");
                        for (let f = this.m_fixtureList; f; f = f.m_next) {
                            b2Settings.b2Log("  {\n");
                            f.Dump(bodyIndex);
                            b2Settings.b2Log("  }\n");
                        }
                        b2Settings.b2Log("}\n");
                    }
                }
                SynchronizeFixtures() {
                    const xf1 = b2Body.SynchronizeFixtures_s_xf1;
                    xf1.q.SetAngleRadians(this.m_sweep.a0);
                    b2Math_14.b2Rot.MulRV(xf1.q, this.m_sweep.localCenter, xf1.p);
                    b2Math_14.b2Vec2.SubVV(this.m_sweep.c0, xf1.p, xf1.p);
                    const broadPhase = this.m_world.m_contactManager.m_broadPhase;
                    for (let f = this.m_fixtureList; f; f = f.m_next) {
                        f.Synchronize(broadPhase, xf1, this.m_xf);
                    }
                }
                SynchronizeTransform() {
                    this.m_xf.q.SetAngleRadians(this.m_sweep.a);
                    b2Math_14.b2Rot.MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
                    b2Math_14.b2Vec2.SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
                }
                // This is used to prevent connected bodies from colliding.
                // It may lie, depending on the collideConnected flag.
                ShouldCollide(other) {
                    // At least one body should be dynamic.
                    if (this.m_type !== 2 /* b2_dynamicBody */ && other.m_type !== 2 /* b2_dynamicBody */) {
                        return false;
                    }
                    // Does a joint prevent collision?
                    for (let jn = this.m_jointList; jn; jn = jn.next) {
                        if (jn.other === other) {
                            if (jn.joint.m_collideConnected === false) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                Advance(alpha) {
                    // Advance to the new safe time. This doesn't sync the broad-phase.
                    this.m_sweep.Advance(alpha);
                    this.m_sweep.c.Copy(this.m_sweep.c0);
                    this.m_sweep.a = this.m_sweep.a0;
                    this.m_xf.q.SetAngleRadians(this.m_sweep.a);
                    b2Math_14.b2Rot.MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
                    b2Math_14.b2Vec2.SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
                }
            };
            /// Creates a fixture from a shape and attach it to this body.
            /// This is a convenience function. Use b2FixtureDef if you need to set parameters
            /// like friction, restitution, user data, or filtering.
            /// If the density is non-zero, this function automatically updates the mass of the body.
            /// @param shape the shape to be cloned.
            /// @param density the shape density (set to zero for static bodies).
            /// @warning This function is locked during callbacks.
            b2Body.CreateFixture2_s_def = new b2Fixture_1.b2FixtureDef();
            /// Set the mass properties to override the mass properties of the fixtures.
            /// Note that this changes the center of mass position.
            /// Note that creating or destroying fixtures can also alter the mass.
            /// This function has no effect if the body isn't dynamic.
            /// @param massData the mass properties.
            b2Body.SetMassData_s_oldCenter = new b2Math_14.b2Vec2();
            /// This resets the mass properties to the sum of the mass properties of the fixtures.
            /// This normally does not need to be called unless you called SetMassData to override
            /// the mass and you later want to reset the mass.
            b2Body.ResetMassData_s_localCenter = new b2Math_14.b2Vec2();
            b2Body.ResetMassData_s_oldCenter = new b2Math_14.b2Vec2();
            b2Body.ResetMassData_s_massData = new b2Shape_7.b2MassData();
            b2Body.SynchronizeFixtures_s_xf1 = new b2Math_14.b2Transform();
            exports_19("b2Body", b2Body);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/b2WorldCallbacks", ["Box2D/Common/b2Settings"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var b2Settings;
    var b2DestructionListener, b2ContactFilter, b2ContactImpulse, b2ContactListener, b2QueryCallback, b2RayCastCallback;
    return {
        setters:[
            function (b2Settings_15) {
                b2Settings = b2Settings_15;
            }],
        execute: function() {
            /// Joints and fixtures are destroyed when their associated
            /// body is destroyed. Implement this listener so that you
            /// may nullify references to these joints and shapes.
            b2DestructionListener = class b2DestructionListener {
                /// Called when any joint is about to be destroyed due
                /// to the destruction of one of its attached bodies.
                SayGoodbyeJoint(joint) {
                }
                /// Called when any fixture is about to be destroyed due
                /// to the destruction of its parent body.
                SayGoodbyeFixture(fixture) {
                }
            };
            exports_20("b2DestructionListener", b2DestructionListener);
            /// Implement this class to provide collision filtering. In other words, you can implement
            /// this class if you want finer control over contact creation.
            b2ContactFilter = class b2ContactFilter {
                /// Return true if contact calculations should be performed between these two shapes.
                /// @warning for performance reasons this is only called when the AABBs begin to overlap.
                ShouldCollide(fixtureA, fixtureB) {
                    const filter1 = fixtureA.GetFilterData();
                    const filter2 = fixtureB.GetFilterData();
                    if (filter1.groupIndex === filter2.groupIndex && filter1.groupIndex !== 0) {
                        return (filter1.groupIndex > 0);
                    }
                    const collide = (((filter1.maskBits & filter2.categoryBits) !== 0) && ((filter1.categoryBits & filter2.maskBits) !== 0));
                    return collide;
                }
            };
            b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
            exports_20("b2ContactFilter", b2ContactFilter);
            /// Contact impulses for reporting. Impulses are used instead of forces because
            /// sub-step forces may approach infinity for rigid body collisions. These
            /// match up one-to-one with the contact points in b2Manifold.
            b2ContactImpulse = class b2ContactImpulse {
                constructor() {
                    this.normalImpulses = b2Settings.b2MakeNumberArray(b2Settings.b2_maxManifoldPoints);
                    this.tangentImpulses = b2Settings.b2MakeNumberArray(b2Settings.b2_maxManifoldPoints);
                    this.count = 0;
                }
            };
            exports_20("b2ContactImpulse", b2ContactImpulse);
            /// Implement this class to get contact information. You can use these results for
            /// things like sounds and game logic. You can also get contact results by
            /// traversing the contact lists after the time step. However, you might miss
            /// some contacts because continuous physics leads to sub-stepping.
            /// Additionally you may receive multiple callbacks for the same contact in a
            /// single time step.
            /// You should strive to make your callbacks efficient because there may be
            /// many callbacks per time step.
            /// @warning You cannot create/destroy Box2D entities inside these callbacks.
            b2ContactListener = class b2ContactListener {
                /// Called when two fixtures begin to touch.
                BeginContact(contact) {
                }
                /// Called when two fixtures cease to touch.
                EndContact(contact) {
                }
                /// This is called after a contact is updated. This allows you to inspect a
                /// contact before it goes to the solver. If you are careful, you can modify the
                /// contact manifold (e.g. disable contact).
                /// A copy of the old manifold is provided so that you can detect changes.
                /// Note: this is called only for awake bodies.
                /// Note: this is called even when the number of contact points is zero.
                /// Note: this is not called for sensors.
                /// Note: if you set the number of contact points to zero, you will not
                /// get an EndContact callback. However, you may get a BeginContact callback
                /// the next step.
                PreSolve(contact, oldManifold) {
                }
                /// This lets you inspect a contact after the solver is finished. This is useful
                /// for inspecting impulses.
                /// Note: the contact manifold does not include time of impact impulses, which can be
                /// arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly
                /// in a separate data structure.
                /// Note: this is only called for contacts that are touching, solid, and awake.
                PostSolve(contact, impulse) {
                }
            };
            b2ContactListener.b2_defaultListener = new b2ContactListener();
            exports_20("b2ContactListener", b2ContactListener);
            /// Callback class for AABB queries.
            /// See b2World::Query
            b2QueryCallback = class b2QueryCallback {
                /// Called for each fixture found in the query AABB.
                /// @return false to terminate the query.
                ReportFixture(fixture) {
                    return true;
                }
            };
            exports_20("b2QueryCallback", b2QueryCallback);
            /// Callback class for ray casts.
            /// See b2World::RayCast
            b2RayCastCallback = class b2RayCastCallback {
                /// Called for each fixture found in the query. You control how the ray cast
                /// proceeds by returning a float:
                /// return -1: ignore this fixture and continue
                /// return 0: terminate the ray cast
                /// return fraction: clip the ray to this point
                /// return 1: don't clip the ray and continue
                /// @param fixture the fixture hit by the ray
                /// @param point the point of initial intersection
                /// @param normal the normal vector at the point of intersection
                /// @return -1 to filter, 0 to terminate, fraction to clip the ray for
                /// closest hit, 1 to continue
                ReportFixture(fixture, point, normal, fraction) {
                    return fraction;
                }
            };
            exports_20("b2RayCastCallback", b2RayCastCallback);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2Contact", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/b2Collision", "Box2D/Collision/b2TimeOfImpact"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var b2Settings, b2Math_15, b2Collision_4, b2Collision_5, b2TimeOfImpact_1, b2TimeOfImpact_2, b2TimeOfImpact_3;
    var b2ContactEdge, b2Contact;
    /// Friction mixing law. The idea is to allow either fixture to drive the restitution to zero.
    /// For example, anything slides on ice.
    function b2MixFriction(friction1, friction2) {
        return b2Math_15.b2Sqrt(friction1 * friction2);
    }
    exports_21("b2MixFriction", b2MixFriction);
    /// Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
    /// For example, a superball bounces on anything.
    function b2MixRestitution(restitution1, restitution2) {
        return restitution1 > restitution2 ? restitution1 : restitution2;
    }
    exports_21("b2MixRestitution", b2MixRestitution);
    return {
        setters:[
            function (b2Settings_16) {
                b2Settings = b2Settings_16;
            },
            function (b2Math_15_1) {
                b2Math_15 = b2Math_15_1;
            },
            function (b2Collision_4_1) {
                b2Collision_4 = b2Collision_4_1;
                b2Collision_5 = b2Collision_4_1;
            },
            function (b2TimeOfImpact_1_1) {
                b2TimeOfImpact_1 = b2TimeOfImpact_1_1;
                b2TimeOfImpact_2 = b2TimeOfImpact_1_1;
                b2TimeOfImpact_3 = b2TimeOfImpact_1_1;
            }],
        execute: function() {
            b2ContactEdge = class b2ContactEdge {
                constructor() {
                    this.other = null; ///< provides quick access to the other body attached.
                    this.contact = null; ///< the contact
                    this.prev = null; ///< the previous contact edge in the body's contact list
                    this.next = null; ///< the next contact edge in the body's contact list
                }
            };
            exports_21("b2ContactEdge", b2ContactEdge);
            b2Contact = class b2Contact {
                constructor() {
                    this.m_flags = 0 /* e_none */;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_nodeA = new b2ContactEdge();
                    this.m_nodeB = new b2ContactEdge();
                    this.m_fixtureA = null;
                    this.m_fixtureB = null;
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_manifold = new b2Collision_4.b2Manifold();
                    this.m_toiCount = 0;
                    this.m_toi = 0;
                    this.m_friction = 0;
                    this.m_restitution = 0;
                    this.m_tangentSpeed = 0;
                    this.m_oldManifold = new b2Collision_4.b2Manifold();
                }
                GetManifold() {
                    return this.m_manifold;
                }
                GetWorldManifold(worldManifold) {
                    const bodyA = this.m_fixtureA.GetBody();
                    const bodyB = this.m_fixtureB.GetBody();
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
                }
                IsTouching() {
                    return (this.m_flags & 2 /* e_touchingFlag */) === 2 /* e_touchingFlag */;
                }
                SetEnabled(flag) {
                    if (flag) {
                        this.m_flags |= 4 /* e_enabledFlag */;
                    }
                    else {
                        this.m_flags &= ~4 /* e_enabledFlag */;
                    }
                }
                IsEnabled() {
                    return (this.m_flags & 4 /* e_enabledFlag */) === 4 /* e_enabledFlag */;
                }
                GetNext() {
                    return this.m_next;
                }
                GetFixtureA() {
                    return this.m_fixtureA;
                }
                GetChildIndexA() {
                    return this.m_indexA;
                }
                GetFixtureB() {
                    return this.m_fixtureB;
                }
                GetChildIndexB() {
                    return this.m_indexB;
                }
                Evaluate(manifold, xfA, xfB) {
                }
                FlagForFiltering() {
                    this.m_flags |= 8 /* e_filterFlag */;
                }
                SetFriction(friction) {
                    this.m_friction = friction;
                }
                GetFriction() {
                    return this.m_friction;
                }
                ResetFriction() {
                    this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
                }
                SetRestitution(restitution) {
                    this.m_restitution = restitution;
                }
                GetRestitution() {
                    return this.m_restitution;
                }
                ResetRestitution() {
                    this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
                }
                SetTangentSpeed(speed) {
                    this.m_tangentSpeed = speed;
                }
                GetTangentSpeed() {
                    return this.m_tangentSpeed;
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    this.m_flags = 4 /* e_enabledFlag */;
                    this.m_fixtureA = fixtureA;
                    this.m_fixtureB = fixtureB;
                    this.m_indexA = indexA;
                    this.m_indexB = indexB;
                    this.m_manifold.pointCount = 0;
                    this.m_prev = null;
                    this.m_next = null;
                    this.m_nodeA.contact = null;
                    this.m_nodeA.prev = null;
                    this.m_nodeA.next = null;
                    this.m_nodeA.other = null;
                    this.m_nodeB.contact = null;
                    this.m_nodeB.prev = null;
                    this.m_nodeB.next = null;
                    this.m_nodeB.other = null;
                    this.m_toiCount = 0;
                    this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
                    this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
                }
                Update(listener) {
                    const tManifold = this.m_oldManifold;
                    this.m_oldManifold = this.m_manifold;
                    this.m_manifold = tManifold;
                    // Re-enable this contact.
                    this.m_flags |= 4 /* e_enabledFlag */;
                    let touching = false;
                    const wasTouching = (this.m_flags & 2 /* e_touchingFlag */) === 2 /* e_touchingFlag */;
                    const sensorA = this.m_fixtureA.IsSensor();
                    const sensorB = this.m_fixtureB.IsSensor();
                    const sensor = sensorA || sensorB;
                    const bodyA = this.m_fixtureA.GetBody();
                    const bodyB = this.m_fixtureB.GetBody();
                    const xfA = bodyA.GetTransform();
                    const xfB = bodyB.GetTransform();
                    // const aabbOverlap = b2TestOverlapAABB(this.m_fixtureA.GetAABB(0), this.m_fixtureB.GetAABB(0));
                    // Is this contact a sensor?
                    if (sensor) {
                        // if (aabbOverlap)
                        // {
                        const shapeA = this.m_fixtureA.GetShape();
                        const shapeB = this.m_fixtureB.GetShape();
                        touching = b2Collision_5.b2TestOverlapShape(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
                        // }
                        // Sensors don't generate manifolds.
                        this.m_manifold.pointCount = 0;
                    }
                    else {
                        // if (aabbOverlap)
                        // {
                        this.Evaluate(this.m_manifold, xfA, xfB);
                        touching = this.m_manifold.pointCount > 0;
                        // Match old contact ids to new contact ids and copy the
                        // stored impulses to warm start the solver.
                        for (let i = 0; i < this.m_manifold.pointCount; ++i) {
                            const mp2 = this.m_manifold.points[i];
                            mp2.normalImpulse = 0;
                            mp2.tangentImpulse = 0;
                            const id2 = mp2.id;
                            for (let j = 0; j < this.m_oldManifold.pointCount; ++j) {
                                const mp1 = this.m_oldManifold.points[j];
                                if (mp1.id.key === id2.key) {
                                    mp2.normalImpulse = mp1.normalImpulse;
                                    mp2.tangentImpulse = mp1.tangentImpulse;
                                    break;
                                }
                            }
                        }
                        // }
                        // else
                        // {
                        //   this.m_manifold.pointCount = 0;
                        // }
                        if (touching !== wasTouching) {
                            bodyA.SetAwake(true);
                            bodyB.SetAwake(true);
                        }
                    }
                    if (touching) {
                        this.m_flags |= 2 /* e_touchingFlag */;
                    }
                    else {
                        this.m_flags &= ~2 /* e_touchingFlag */;
                    }
                    if (wasTouching === false && touching === true && listener) {
                        listener.BeginContact(this);
                    }
                    if (wasTouching === true && touching === false && listener) {
                        listener.EndContact(this);
                    }
                    if (sensor === false && touching && listener) {
                        listener.PreSolve(this, this.m_oldManifold);
                    }
                }
                ComputeTOI(sweepA, sweepB) {
                    const input = b2Contact.ComputeTOI_s_input;
                    input.proxyA.SetShape(this.m_fixtureA.GetShape(), this.m_indexA);
                    input.proxyB.SetShape(this.m_fixtureB.GetShape(), this.m_indexB);
                    input.sweepA.Copy(sweepA);
                    input.sweepB.Copy(sweepB);
                    input.tMax = b2Settings.b2_linearSlop;
                    const output = b2Contact.ComputeTOI_s_output;
                    b2TimeOfImpact_3.b2TimeOfImpact(output, input);
                    return output.t;
                }
            };
            b2Contact.ComputeTOI_s_input = new b2TimeOfImpact_1.b2TOIInput();
            b2Contact.ComputeTOI_s_output = new b2TimeOfImpact_2.b2TOIOutput();
            exports_21("b2Contact", b2Contact);
        }
    }
});
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2DistanceJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var b2Settings, b2Math_16, b2Joint_1;
    var b2DistanceJointDef, b2DistanceJoint;
    return {
        setters:[
            function (b2Settings_17) {
                b2Settings = b2Settings_17;
            },
            function (b2Math_16_1) {
                b2Math_16 = b2Math_16_1;
            },
            function (b2Joint_1_1) {
                b2Joint_1 = b2Joint_1_1;
            }],
        execute: function() {
            /// Distance joint definition. This requires defining an
            /// anchor point on both bodies and the non-zero length of the
            /// distance joint. The definition uses local anchor points
            /// so that the initial configuration can violate the constraint
            /// slightly. This helps when saving and loading a game.
            /// @warning Do not use a zero or short length.
            b2DistanceJointDef = class b2DistanceJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(3 /* e_distanceJoint */); // base class constructor
                    this.localAnchorA = new b2Math_16.b2Vec2();
                    this.localAnchorB = new b2Math_16.b2Vec2();
                    this.length = 1;
                    this.frequencyHz = 0;
                    this.dampingRatio = 0;
                }
                Initialize(b1, b2, anchor1, anchor2) {
                    this.bodyA = b1;
                    this.bodyB = b2;
                    this.bodyA.GetLocalPoint(anchor1, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor2, this.localAnchorB);
                    this.length = b2Math_16.b2Vec2.DistanceVV(anchor1, anchor2);
                    this.frequencyHz = 0;
                    this.dampingRatio = 0;
                }
            };
            exports_22("b2DistanceJointDef", b2DistanceJointDef);
            b2DistanceJoint = class b2DistanceJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_bias = 0;
                    // Solver shared
                    this.m_localAnchorA = null;
                    this.m_localAnchorB = null;
                    this.m_gamma = 0;
                    this.m_impulse = 0;
                    this.m_length = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_u = null;
                    this.m_rA = null;
                    this.m_rB = null;
                    this.m_localCenterA = null;
                    this.m_localCenterB = null;
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = 0;
                    this.m_qA = null;
                    this.m_qB = null;
                    this.m_lalcA = null;
                    this.m_lalcB = null;
                    this.m_u = new b2Math_16.b2Vec2();
                    this.m_rA = new b2Math_16.b2Vec2();
                    this.m_rB = new b2Math_16.b2Vec2();
                    this.m_localCenterA = new b2Math_16.b2Vec2();
                    this.m_localCenterB = new b2Math_16.b2Vec2();
                    this.m_qA = new b2Math_16.b2Rot();
                    this.m_qB = new b2Math_16.b2Rot();
                    this.m_lalcA = new b2Math_16.b2Vec2();
                    this.m_lalcB = new b2Math_16.b2Vec2();
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_localAnchorA = def.localAnchorA.Clone();
                    this.m_localAnchorB = def.localAnchorB.Clone();
                    this.m_length = def.length;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    return out.SetXY(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                SetLength(length) {
                    this.m_length = length;
                }
                GetLength() {
                    return this.m_length;
                }
                SetFrequency(hz) {
                    this.m_frequencyHz = hz;
                }
                GetFrequency() {
                    return this.m_frequencyHz;
                }
                SetDampingRatio(ratio) {
                    this.m_dampingRatio = ratio;
                }
                GetDampingRatio() {
                    return this.m_dampingRatio;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2DistanceJointDef = new b2DistanceJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.length = %.15f;\n", this.m_length);
                        b2Settings.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                        b2Settings.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cA = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_16.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_16.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_16.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_16.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // m_u = cB + m_rB - cA - m_rA;
                    this.m_u.x = cB.x + this.m_rB.x - cA.x - this.m_rA.x;
                    this.m_u.y = cB.y + this.m_rB.y - cA.y - this.m_rA.y;
                    // Handle singularity.
                    const length = this.m_u.GetLength();
                    if (length > b2Settings.b2_linearSlop) {
                        this.m_u.SelfMul(1 / length);
                    }
                    else {
                        this.m_u.SetZero();
                    }
                    // float32 crAu = b2Cross(m_rA, m_u);
                    const crAu = b2Math_16.b2Vec2.CrossVV(this.m_rA, this.m_u);
                    // float32 crBu = b2Cross(m_rB, m_u);
                    const crBu = b2Math_16.b2Vec2.CrossVV(this.m_rB, this.m_u);
                    // float32 invMass = m_invMassA + m_invIA * crAu * crAu + m_invMassB + m_invIB * crBu * crBu;
                    let invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB + this.m_invIB * crBu * crBu;
                    // Compute the effective mass matrix.
                    this.m_mass = invMass !== 0 ? 1 / invMass : 0;
                    if (this.m_frequencyHz > 0) {
                        const C = length - this.m_length;
                        // Frequency
                        const omega = 2 * b2Settings.b2_pi * this.m_frequencyHz;
                        // Damping coefficient
                        const d = 2 * this.m_mass * this.m_dampingRatio * omega;
                        // Spring stiffness
                        const k = this.m_mass * omega * omega;
                        // magic formulas
                        const h = data.step.dt;
                        this.m_gamma = h * (d + h * k);
                        this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0;
                        this.m_bias = C * h * k * this.m_gamma;
                        invMass += this.m_gamma;
                        this.m_mass = invMass !== 0 ? 1 / invMass : 0;
                    }
                    else {
                        this.m_gamma = 0;
                        this.m_bias = 0;
                    }
                    if (data.step.warmStarting) {
                        // Scale the impulse to support a variable time step.
                        this.m_impulse *= data.step.dtRatio;
                        // b2Vec2 P = m_impulse * m_u;
                        const P = b2Math_16.b2Vec2.MulSV(this.m_impulse, this.m_u, b2DistanceJoint.InitVelocityConstraints_s_P);
                        // vA -= m_invMassA * P;
                        vA.SelfMulSub(this.m_invMassA, P);
                        // wA -= m_invIA * b2Cross(m_rA, P);
                        wA -= this.m_invIA * b2Math_16.b2Vec2.CrossVV(this.m_rA, P);
                        // vB += m_invMassB * P;
                        vB.SelfMulAdd(this.m_invMassB, P);
                        // wB += m_invIB * b2Cross(m_rB, P);
                        wB += this.m_invIB * b2Math_16.b2Vec2.CrossVV(this.m_rB, P);
                    }
                    else {
                        this.m_impulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
                    const vpA = b2Math_16.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2DistanceJoint.SolveVelocityConstraints_s_vpA);
                    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
                    const vpB = b2Math_16.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2DistanceJoint.SolveVelocityConstraints_s_vpB);
                    // float32 Cdot = b2Dot(m_u, vpB - vpA);
                    const Cdot = b2Math_16.b2Vec2.DotVV(this.m_u, b2Math_16.b2Vec2.SubVV(vpB, vpA, b2Math_16.b2Vec2.s_t0));
                    const impulse = (-this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse));
                    this.m_impulse += impulse;
                    // b2Vec2 P = impulse * m_u;
                    const P = b2Math_16.b2Vec2.MulSV(impulse, this.m_u, b2DistanceJoint.SolveVelocityConstraints_s_P);
                    // vA -= m_invMassA * P;
                    vA.SelfMulSub(this.m_invMassA, P);
                    // wA -= m_invIA * b2Cross(m_rA, P);
                    wA -= this.m_invIA * b2Math_16.b2Vec2.CrossVV(this.m_rA, P);
                    // vB += m_invMassB * P;
                    vB.SelfMulAdd(this.m_invMassB, P);
                    // wB += m_invIB * b2Cross(m_rB, P);
                    wB += this.m_invIB * b2Math_16.b2Vec2.CrossVV(this.m_rB, P);
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    if (this.m_frequencyHz > 0) {
                        // There is no position correction for soft distance constraints.
                        return true;
                    }
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    const rA = b2Math_16.b2Rot.MulRV(this.m_qA, this.m_lalcA, this.m_rA); // use m_rA
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    const rB = b2Math_16.b2Rot.MulRV(this.m_qB, this.m_lalcB, this.m_rB); // use m_rB
                    // b2Vec2 u = cB + rB - cA - rA;
                    const u = this.m_u; // use m_u
                    u.x = cB.x + rB.x - cA.x - rA.x;
                    u.y = cB.y + rB.y - cA.y - rA.y;
                    // float32 length = u.Normalize();
                    const length = this.m_u.Normalize();
                    // float32 C = length - m_length;
                    let C = length - this.m_length;
                    C = b2Math_16.b2Clamp(C, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
                    const impulse = (-this.m_mass * C);
                    // b2Vec2 P = impulse * u;
                    const P = b2Math_16.b2Vec2.MulSV(impulse, u, b2DistanceJoint.SolvePositionConstraints_s_P);
                    // cA -= m_invMassA * P;
                    cA.SelfMulSub(this.m_invMassA, P);
                    // aA -= m_invIA * b2Cross(rA, P);
                    aA -= this.m_invIA * b2Math_16.b2Vec2.CrossVV(rA, P);
                    // cB += m_invMassB * P;
                    cB.SelfMulAdd(this.m_invMassB, P);
                    // aB += m_invIB * b2Cross(rB, P);
                    aB += this.m_invIB * b2Math_16.b2Vec2.CrossVV(rB, P);
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return b2Math_16.b2Abs(C) < b2Settings.b2_linearSlop;
                }
            };
            b2DistanceJoint.InitVelocityConstraints_s_P = new b2Math_16.b2Vec2();
            b2DistanceJoint.SolveVelocityConstraints_s_vpA = new b2Math_16.b2Vec2();
            b2DistanceJoint.SolveVelocityConstraints_s_vpB = new b2Math_16.b2Vec2();
            b2DistanceJoint.SolveVelocityConstraints_s_P = new b2Math_16.b2Vec2();
            b2DistanceJoint.SolvePositionConstraints_s_P = new b2Math_16.b2Vec2();
            exports_22("b2DistanceJoint", b2DistanceJoint);
        }
    }
});
System.register("Box2D/Dynamics/Joints/b2AreaJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint", "Box2D/Dynamics/Joints/b2DistanceJoint"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var b2Settings, b2Math_17, b2Joint_2, b2DistanceJoint_1;
    var b2AreaJointDef, b2AreaJoint;
    return {
        setters:[
            function (b2Settings_18) {
                b2Settings = b2Settings_18;
            },
            function (b2Math_17_1) {
                b2Math_17 = b2Math_17_1;
            },
            function (b2Joint_2_1) {
                b2Joint_2 = b2Joint_2_1;
            },
            function (b2DistanceJoint_1_1) {
                b2DistanceJoint_1 = b2DistanceJoint_1_1;
            }],
        execute: function() {
            b2AreaJointDef = class b2AreaJointDef extends b2Joint_2.b2JointDef {
                constructor() {
                    super(12 /* e_areaJoint */); // base class constructor
                    this.world = null;
                    this.bodies = new Array();
                    this.frequencyHz = 0;
                    this.dampingRatio = 0;
                }
                AddBody(body) {
                    this.bodies.push(body);
                    if (this.bodies.length === 1) {
                        this.bodyA = body;
                    }
                    else if (this.bodies.length === 2) {
                        this.bodyB = body;
                    }
                }
            };
            exports_23("b2AreaJointDef", b2AreaJointDef);
            b2AreaJoint = class b2AreaJoint extends b2Joint_2.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_bodies = null;
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    // Solver shared
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_targetLengths = null;
                    this.m_targetArea = 0;
                    this.m_normals = null;
                    this.m_joints = null;
                    this.m_deltas = null;
                    this.m_delta = null;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies.");
                    }
                    this.m_bodies = def.bodies;
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_targetLengths = b2Settings.b2MakeNumberArray(def.bodies.length);
                    this.m_normals = b2Math_17.b2Vec2.MakeArray(def.bodies.length);
                    this.m_joints = new Array(def.bodies.length);
                    this.m_deltas = b2Math_17.b2Vec2.MakeArray(def.bodies.length);
                    this.m_delta = new b2Math_17.b2Vec2();
                    const djd = new b2DistanceJoint_1.b2DistanceJointDef();
                    djd.frequencyHz = def.frequencyHz;
                    djd.dampingRatio = def.dampingRatio;
                    this.m_targetArea = 0;
                    for (let i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                        const body = this.m_bodies[i];
                        const next = this.m_bodies[(i + 1) % ict];
                        const body_c = body.GetWorldCenter();
                        const next_c = next.GetWorldCenter();
                        this.m_targetLengths[i] = b2Math_17.b2Vec2.DistanceVV(body_c, next_c);
                        this.m_targetArea += b2Math_17.b2Vec2.CrossVV(body_c, next_c);
                        djd.Initialize(body, next, body_c, next_c);
                        this.m_joints[i] = def.world.CreateJoint(djd);
                    }
                    this.m_targetArea *= 0.5;
                }
                GetAnchorA(out) {
                    return out.SetZero();
                }
                GetAnchorB(out) {
                    return out.SetZero();
                }
                GetReactionForce(inv_dt, out) {
                    return out.SetZero();
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                SetFrequency(hz) {
                    this.m_frequencyHz = hz;
                    for (let i = 0, ict = this.m_joints.length; i < ict; ++i) {
                        this.m_joints[i].SetFrequency(hz);
                    }
                }
                GetFrequency() {
                    return this.m_frequencyHz;
                }
                SetDampingRatio(ratio) {
                    this.m_dampingRatio = ratio;
                    for (let i = 0, ict = this.m_joints.length; i < ict; ++i) {
                        this.m_joints[i].SetDampingRatio(ratio);
                    }
                }
                GetDampingRatio() {
                    return this.m_dampingRatio;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        b2Settings.b2Log("Area joint dumping is not supported.\n");
                    }
                }
                InitVelocityConstraints(data) {
                    for (let i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                        const prev = this.m_bodies[(i + ict - 1) % ict];
                        const next = this.m_bodies[(i + 1) % ict];
                        const prev_c = data.positions[prev.m_islandIndex].c;
                        const next_c = data.positions[next.m_islandIndex].c;
                        const delta = this.m_deltas[i];
                        b2Math_17.b2Vec2.SubVV(next_c, prev_c, delta);
                    }
                    if (data.step.warmStarting) {
                        this.m_impulse *= data.step.dtRatio;
                        for (let i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                            const body = this.m_bodies[i];
                            const body_v = data.velocities[body.m_islandIndex].v;
                            const delta = this.m_deltas[i];
                            body_v.x += body.m_invMass * delta.y * 0.5 * this.m_impulse;
                            body_v.y += body.m_invMass * -delta.x * 0.5 * this.m_impulse;
                        }
                    }
                    else {
                        this.m_impulse = 0;
                    }
                }
                SolveVelocityConstraints(data) {
                    let dotMassSum = 0;
                    let crossMassSum = 0;
                    for (let i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                        const body = this.m_bodies[i];
                        const body_v = data.velocities[body.m_islandIndex].v;
                        const delta = this.m_deltas[i];
                        dotMassSum += delta.GetLengthSquared() / body.GetMass();
                        crossMassSum += b2Math_17.b2Vec2.CrossVV(body_v, delta);
                    }
                    const lambda = -2 * crossMassSum / dotMassSum;
                    // lambda = b2Clamp(lambda, -b2Settings.b2_maxLinearCorrection, b2Settings.b2_maxLinearCorrection);
                    this.m_impulse += lambda;
                    for (let i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                        const body = this.m_bodies[i];
                        const body_v = data.velocities[body.m_islandIndex].v;
                        const delta = this.m_deltas[i];
                        body_v.x += body.m_invMass * delta.y * 0.5 * lambda;
                        body_v.y += body.m_invMass * -delta.x * 0.5 * lambda;
                    }
                }
                SolvePositionConstraints(data) {
                    let perimeter = 0;
                    let area = 0;
                    for (let i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                        const body = this.m_bodies[i];
                        const next = this.m_bodies[(i + 1) % ict];
                        const body_c = data.positions[body.m_islandIndex].c;
                        const next_c = data.positions[next.m_islandIndex].c;
                        const delta = b2Math_17.b2Vec2.SubVV(next_c, body_c, this.m_delta);
                        let dist = delta.GetLength();
                        if (dist < b2Settings.b2_epsilon) {
                            dist = 1;
                        }
                        this.m_normals[i].x = delta.y / dist;
                        this.m_normals[i].y = -delta.x / dist;
                        perimeter += dist;
                        area += b2Math_17.b2Vec2.CrossVV(body_c, next_c);
                    }
                    area *= 0.5;
                    const deltaArea = this.m_targetArea - area;
                    const toExtrude = 0.5 * deltaArea / perimeter;
                    let done = true;
                    for (let i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                        const body = this.m_bodies[i];
                        const body_c = data.positions[body.m_islandIndex].c;
                        const next_i = (i + 1) % ict;
                        const delta = b2Math_17.b2Vec2.AddVV(this.m_normals[i], this.m_normals[next_i], this.m_delta);
                        delta.SelfMul(toExtrude);
                        const norm_sq = delta.GetLengthSquared();
                        if (norm_sq > b2Math_17.b2Sq(b2Settings.b2_maxLinearCorrection)) {
                            delta.SelfMul(b2Settings.b2_maxLinearCorrection / b2Math_17.b2Sqrt(norm_sq));
                        }
                        if (norm_sq > b2Math_17.b2Sq(b2Settings.b2_linearSlop)) {
                            done = false;
                        }
                        body_c.x += delta.x;
                        body_c.y += delta.y;
                    }
                    return done;
                }
            };
            exports_23("b2AreaJoint", b2AreaJoint);
        }
    }
});
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2FrictionJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var b2Settings, b2Math_18, b2Joint_3;
    var b2FrictionJointDef, b2FrictionJoint;
    return {
        setters:[
            function (b2Settings_19) {
                b2Settings = b2Settings_19;
            },
            function (b2Math_18_1) {
                b2Math_18 = b2Math_18_1;
            },
            function (b2Joint_3_1) {
                b2Joint_3 = b2Joint_3_1;
            }],
        execute: function() {
            /// Friction joint definition.
            b2FrictionJointDef = class b2FrictionJointDef extends b2Joint_3.b2JointDef {
                constructor() {
                    super(9 /* e_frictionJoint */); // base class constructor
                    this.localAnchorA = new b2Math_18.b2Vec2();
                    this.localAnchorB = new b2Math_18.b2Vec2();
                    this.maxForce = 0;
                    this.maxTorque = 0;
                }
                Initialize(bA, bB, anchor) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                }
            };
            exports_24("b2FrictionJointDef", b2FrictionJointDef);
            b2FrictionJoint = class b2FrictionJoint extends b2Joint_3.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_localAnchorA = new b2Math_18.b2Vec2();
                    this.m_localAnchorB = new b2Math_18.b2Vec2();
                    // Solver shared
                    this.m_linearImpulse = new b2Math_18.b2Vec2();
                    this.m_angularImpulse = 0;
                    this.m_maxForce = 0;
                    this.m_maxTorque = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2Math_18.b2Vec2();
                    this.m_rB = new b2Math_18.b2Vec2();
                    this.m_localCenterA = new b2Math_18.b2Vec2();
                    this.m_localCenterB = new b2Math_18.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_linearMass = new b2Math_18.b2Mat22();
                    this.m_angularMass = 0;
                    this.m_qA = new b2Math_18.b2Rot();
                    this.m_qB = new b2Math_18.b2Rot();
                    this.m_lalcA = new b2Math_18.b2Vec2();
                    this.m_lalcB = new b2Math_18.b2Vec2();
                    this.m_K = new b2Math_18.b2Mat22();
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_linearImpulse.SetZero();
                    this.m_maxForce = def.maxForce;
                    this.m_maxTorque = def.maxTorque;
                    this.m_linearMass.SetZero();
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    // const cA: b2Vec2 = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    // const cB: b2Vec2 = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // Compute the effective mass matrix.
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_18.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_18.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_18.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_18.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    //     [ 0       -1 0       1]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const K = this.m_K; // new b2Mat22();
                    K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
                    K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
                    K.ey.x = K.ex.y;
                    K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
                    K.GetInverse(this.m_linearMass);
                    this.m_angularMass = iA + iB;
                    if (this.m_angularMass > 0) {
                        this.m_angularMass = 1 / this.m_angularMass;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        // m_linearImpulse *= data.step.dtRatio;
                        this.m_linearImpulse.SelfMul(data.step.dtRatio);
                        this.m_angularImpulse *= data.step.dtRatio;
                        // const P: b2Vec2(m_linearImpulse.x, m_linearImpulse.y);
                        const P = this.m_linearImpulse;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        // wA -= iA * (b2Cross(m_rA, P) + m_angularImpulse);
                        wA -= iA * (b2Math_18.b2Vec2.CrossVV(this.m_rA, P) + this.m_angularImpulse);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        // wB += iB * (b2Cross(m_rB, P) + m_angularImpulse);
                        wB += iB * (b2Math_18.b2Vec2.CrossVV(this.m_rB, P) + this.m_angularImpulse);
                    }
                    else {
                        this.m_linearImpulse.SetZero();
                        this.m_angularImpulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const h = data.step.dt;
                    // Solve angular friction
                    if (true) {
                        const Cdot = wB - wA;
                        let impulse = (-this.m_angularMass * Cdot);
                        const oldImpulse = this.m_angularImpulse;
                        const maxImpulse = h * this.m_maxTorque;
                        this.m_angularImpulse = b2Math_18.b2Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
                        impulse = this.m_angularImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve linear friction
                    if (true) {
                        // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                        const Cdot_v2 = b2Math_18.b2Vec2.SubVV(b2Math_18.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_18.b2Vec2.s_t0), b2Math_18.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_18.b2Vec2.s_t1), b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = -b2Mul(m_linearMass, Cdot);
                        const impulseV = b2Math_18.b2Mat22.MulMV(this.m_linearMass, Cdot_v2, b2FrictionJoint.SolveVelocityConstraints_s_impulseV).SelfNeg();
                        // b2Vec2 oldImpulse = m_linearImpulse;
                        const oldImpulseV = b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV.Copy(this.m_linearImpulse);
                        // m_linearImpulse += impulse;
                        this.m_linearImpulse.SelfAdd(impulseV);
                        const maxImpulse = h * this.m_maxForce;
                        if (this.m_linearImpulse.GetLengthSquared() > maxImpulse * maxImpulse) {
                            this.m_linearImpulse.Normalize();
                            this.m_linearImpulse.SelfMul(maxImpulse);
                        }
                        // impulse = m_linearImpulse - oldImpulse;
                        b2Math_18.b2Vec2.SubVV(this.m_linearImpulse, oldImpulseV, impulseV);
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulseV);
                        // wA -= iA * b2Cross(m_rA, impulse);
                        wA -= iA * b2Math_18.b2Vec2.CrossVV(this.m_rA, impulseV);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulseV);
                        // wB += iB * b2Cross(m_rB, impulse);
                        wB += iB * b2Math_18.b2Vec2.CrossVV(this.m_rB, impulseV);
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    return true;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    return out.SetXY(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_angularImpulse;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                SetMaxForce(force) {
                    this.m_maxForce = force;
                }
                GetMaxForce() {
                    return this.m_maxForce;
                }
                SetMaxTorque(torque) {
                    this.m_maxTorque = torque;
                }
                GetMaxTorque() {
                    return this.m_maxTorque;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2FrictionJointDef = new b2FrictionJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
                        b2Settings.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2Math_18.b2Vec2();
            b2FrictionJoint.SolveVelocityConstraints_s_impulseV = new b2Math_18.b2Vec2();
            b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV = new b2Math_18.b2Vec2();
            exports_24("b2FrictionJoint", b2FrictionJoint);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2PrismaticJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var b2Settings, b2Math_19, b2Joint_4;
    var b2PrismaticJointDef, b2PrismaticJoint;
    return {
        setters:[
            function (b2Settings_20) {
                b2Settings = b2Settings_20;
            },
            function (b2Math_19_1) {
                b2Math_19 = b2Math_19_1;
            },
            function (b2Joint_4_1) {
                b2Joint_4 = b2Joint_4_1;
            }],
        execute: function() {
            /// Prismatic joint definition. This requires defining a line of
            /// motion using an axis and an anchor point. The definition uses local
            /// anchor points and a local axis so that the initial configuration
            /// can violate the constraint slightly. The joint translation is zero
            /// when the local anchor points coincide in world space. Using local
            /// anchors and a local axis helps when saving and loading a game.
            b2PrismaticJointDef = class b2PrismaticJointDef extends b2Joint_4.b2JointDef {
                constructor() {
                    super(2 /* e_prismaticJoint */); // base class constructor
                    this.localAnchorA = null;
                    this.localAnchorB = null;
                    this.localAxisA = null;
                    this.referenceAngle = 0;
                    this.enableLimit = false;
                    this.lowerTranslation = 0;
                    this.upperTranslation = 0;
                    this.enableMotor = false;
                    this.maxMotorForce = 0;
                    this.motorSpeed = 0;
                    this.localAnchorA = new b2Math_19.b2Vec2();
                    this.localAnchorB = new b2Math_19.b2Vec2();
                    this.localAxisA = new b2Math_19.b2Vec2(1, 0);
                }
                Initialize(bA, bB, anchor, axis) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.bodyA.GetLocalVector(axis, this.localAxisA);
                    this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians();
                }
            };
            exports_25("b2PrismaticJointDef", b2PrismaticJointDef);
            b2PrismaticJoint = class b2PrismaticJoint extends b2Joint_4.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    // Solver shared
                    this.m_localAnchorA = null;
                    this.m_localAnchorB = null;
                    this.m_localXAxisA = null;
                    this.m_localYAxisA = null;
                    this.m_referenceAngle = 0;
                    this.m_impulse = null;
                    this.m_motorImpulse = 0;
                    this.m_lowerTranslation = 0;
                    this.m_upperTranslation = 0;
                    this.m_maxMotorForce = 0;
                    this.m_motorSpeed = 0;
                    this.m_enableLimit = false;
                    this.m_enableMotor = false;
                    this.m_limitState = 0 /* e_inactiveLimit */;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_localCenterA = null;
                    this.m_localCenterB = null;
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_axis = null;
                    this.m_perp = null;
                    this.m_s1 = 0;
                    this.m_s2 = 0;
                    this.m_a1 = 0;
                    this.m_a2 = 0;
                    this.m_K = null;
                    this.m_K3 = null;
                    this.m_K2 = null;
                    this.m_motorMass = 0;
                    this.m_qA = null;
                    this.m_qB = null;
                    this.m_lalcA = null;
                    this.m_lalcB = null;
                    this.m_rA = null;
                    this.m_rB = null;
                    this.m_localAnchorA = def.localAnchorA.Clone();
                    this.m_localAnchorB = def.localAnchorB.Clone();
                    this.m_localXAxisA = def.localAxisA.Clone().SelfNormalize();
                    this.m_localYAxisA = b2Math_19.b2Vec2.CrossOneV(this.m_localXAxisA, new b2Math_19.b2Vec2());
                    this.m_referenceAngle = def.referenceAngle;
                    this.m_impulse = new b2Math_19.b2Vec3(0, 0, 0);
                    this.m_lowerTranslation = def.lowerTranslation;
                    this.m_upperTranslation = def.upperTranslation;
                    this.m_maxMotorForce = def.maxMotorForce;
                    this.m_motorSpeed = def.motorSpeed;
                    this.m_enableLimit = def.enableLimit;
                    this.m_enableMotor = def.enableMotor;
                    this.m_localCenterA = new b2Math_19.b2Vec2();
                    this.m_localCenterB = new b2Math_19.b2Vec2();
                    this.m_axis = new b2Math_19.b2Vec2(0, 0);
                    this.m_perp = new b2Math_19.b2Vec2(0, 0);
                    this.m_K = new b2Math_19.b2Mat33();
                    this.m_K3 = new b2Math_19.b2Mat33();
                    this.m_K2 = new b2Math_19.b2Mat22();
                    this.m_qA = new b2Math_19.b2Rot();
                    this.m_qB = new b2Math_19.b2Rot();
                    this.m_lalcA = new b2Math_19.b2Vec2();
                    this.m_lalcB = new b2Math_19.b2Vec2();
                    this.m_rA = new b2Math_19.b2Vec2();
                    this.m_rB = new b2Math_19.b2Vec2();
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cA = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // Compute the effective masses.
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_19.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_19.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_19.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_19.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = (cB - cA) + rB - rA;
                    const d = b2Math_19.b2Vec2.AddVV(b2Math_19.b2Vec2.SubVV(cB, cA, b2Math_19.b2Vec2.s_t0), b2Math_19.b2Vec2.SubVV(rB, rA, b2Math_19.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_d);
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // Compute motor Jacobian and effective mass.
                    {
                        // m_axis = b2Mul(qA, m_localXAxisA);
                        b2Math_19.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_axis);
                        // m_a1 = b2Cross(d + rA, m_axis);
                        this.m_a1 = b2Math_19.b2Vec2.CrossVV(b2Math_19.b2Vec2.AddVV(d, rA, b2Math_19.b2Vec2.s_t0), this.m_axis);
                        // m_a2 = b2Cross(rB, m_axis);
                        this.m_a2 = b2Math_19.b2Vec2.CrossVV(rB, this.m_axis);
                        this.m_motorMass = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
                        if (this.m_motorMass > 0) {
                            this.m_motorMass = 1 / this.m_motorMass;
                        }
                    }
                    // Prismatic constraint.
                    {
                        // m_perp = b2Mul(qA, m_localYAxisA);
                        b2Math_19.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_perp);
                        // m_s1 = b2Cross(d + rA, m_perp);
                        this.m_s1 = b2Math_19.b2Vec2.CrossVV(b2Math_19.b2Vec2.AddVV(d, rA, b2Math_19.b2Vec2.s_t0), this.m_perp);
                        // m_s2 = b2Cross(rB, m_perp);
                        this.m_s2 = b2Math_19.b2Vec2.CrossVV(rB, this.m_perp);
                        // float32 k11 = mA + mB + iA * m_s1 * m_s1 + iB * m_s2 * m_s2;
                        this.m_K.ex.x = mA + mB + iA * this.m_s1 * this.m_s1 + iB * this.m_s2 * this.m_s2;
                        // float32 k12 = iA * m_s1 + iB * m_s2;
                        this.m_K.ex.y = iA * this.m_s1 + iB * this.m_s2;
                        // float32 k13 = iA * m_s1 * m_a1 + iB * m_s2 * m_a2;
                        this.m_K.ex.z = iA * this.m_s1 * this.m_a1 + iB * this.m_s2 * this.m_a2;
                        this.m_K.ey.x = this.m_K.ex.y;
                        // float32 k22 = iA + iB;
                        this.m_K.ey.y = iA + iB;
                        if (this.m_K.ey.y === 0) {
                            // For bodies with fixed rotation.
                            this.m_K.ey.y = 1;
                        }
                        // float32 k23 = iA * m_a1 + iB * m_a2;
                        this.m_K.ey.z = iA * this.m_a1 + iB * this.m_a2;
                        this.m_K.ez.x = this.m_K.ex.z;
                        this.m_K.ez.y = this.m_K.ey.z;
                        // float32 k33 = mA + mB + iA * m_a1 * m_a1 + iB * m_a2 * m_a2;
                        this.m_K.ez.z = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
                    }
                    // Compute motor and limit terms.
                    if (this.m_enableLimit) {
                        // float32 jointTranslation = b2Dot(m_axis, d);
                        const jointTranslation = b2Math_19.b2Vec2.DotVV(this.m_axis, d);
                        if (b2Math_19.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2Settings.b2_linearSlop) {
                            this.m_limitState = 3 /* e_equalLimits */;
                        }
                        else if (jointTranslation <= this.m_lowerTranslation) {
                            if (this.m_limitState !== 1 /* e_atLowerLimit */) {
                                this.m_limitState = 1 /* e_atLowerLimit */;
                                this.m_impulse.z = 0;
                            }
                        }
                        else if (jointTranslation >= this.m_upperTranslation) {
                            if (this.m_limitState !== 2 /* e_atUpperLimit */) {
                                this.m_limitState = 2 /* e_atUpperLimit */;
                                this.m_impulse.z = 0;
                            }
                        }
                        else {
                            this.m_limitState = 0 /* e_inactiveLimit */;
                            this.m_impulse.z = 0;
                        }
                    }
                    else {
                        this.m_limitState = 0 /* e_inactiveLimit */;
                        this.m_impulse.z = 0;
                    }
                    if (this.m_enableMotor === false) {
                        this.m_motorImpulse = 0;
                    }
                    if (data.step.warmStarting) {
                        // Account for variable time step.
                        // m_impulse *= data.step.dtRatio;
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        this.m_motorImpulse *= data.step.dtRatio;
                        // b2Vec2 P = m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis;
                        const P = b2Math_19.b2Vec2.AddVV(b2Math_19.b2Vec2.MulSV(this.m_impulse.x, this.m_perp, b2Math_19.b2Vec2.s_t0), b2Math_19.b2Vec2.MulSV((this.m_motorImpulse + this.m_impulse.z), this.m_axis, b2Math_19.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_P);
                        // float32 LA = m_impulse.x * m_s1 + m_impulse.y + (m_motorImpulse + m_impulse.z) * m_a1;
                        const LA = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
                        // float32 LB = m_impulse.x * m_s2 + m_impulse.y + (m_motorImpulse + m_impulse.z) * m_a2;
                        const LB = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    else {
                        this.m_impulse.SetZero();
                        this.m_motorImpulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // Solve linear motor constraint.
                    if (this.m_enableMotor && this.m_limitState !== 3 /* e_equalLimits */) {
                        // float32 Cdot = b2Dot(m_axis, vB - vA) + m_a2 * wB - m_a1 * wA;
                        const Cdot = b2Math_19.b2Vec2.DotVV(this.m_axis, b2Math_19.b2Vec2.SubVV(vB, vA, b2Math_19.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                        let impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorForce;
                        this.m_motorImpulse = b2Math_19.b2Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        // b2Vec2 P = impulse * m_axis;
                        const P = b2Math_19.b2Vec2.MulSV(impulse, this.m_axis, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        const LA = impulse * this.m_a1;
                        const LB = impulse * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    // b2Vec2 Cdot1;
                    // Cdot1.x = b2Dot(m_perp, vB - vA) + m_s2 * wB - m_s1 * wA;
                    const Cdot1_x = b2Math_19.b2Vec2.DotVV(this.m_perp, b2Math_19.b2Vec2.SubVV(vB, vA, b2Math_19.b2Vec2.s_t0)) + this.m_s2 * wB - this.m_s1 * wA;
                    // Cdot1.y = wB - wA;
                    const Cdot1_y = wB - wA;
                    if (this.m_enableLimit && this.m_limitState !== 0 /* e_inactiveLimit */) {
                        // Solve prismatic and limit constraint in block form.
                        // float32 Cdot2;
                        // Cdot2 = b2Dot(m_axis, vB - vA) + m_a2 * wB - m_a1 * wA;
                        const Cdot2 = b2Math_19.b2Vec2.DotVV(this.m_axis, b2Math_19.b2Vec2.SubVV(vB, vA, b2Math_19.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                        // b2Vec3 Cdot(Cdot1.x, Cdot1.y, Cdot2);
                        // b2Vec3 f1 = m_impulse;
                        const f1 = b2PrismaticJoint.SolveVelocityConstraints_s_f1.Copy(this.m_impulse);
                        // b2Vec3 df =  m_K.Solve33(-Cdot);
                        const df3 = this.m_K.Solve33((-Cdot1_x), (-Cdot1_y), (-Cdot2), b2PrismaticJoint.SolveVelocityConstraints_s_df3);
                        // m_impulse += df;
                        this.m_impulse.SelfAdd(df3);
                        if (this.m_limitState === 1 /* e_atLowerLimit */) {
                            this.m_impulse.z = b2Math_19.b2Max(this.m_impulse.z, 0);
                        }
                        else if (this.m_limitState === 2 /* e_atUpperLimit */) {
                            this.m_impulse.z = b2Math_19.b2Min(this.m_impulse.z, 0);
                        }
                        // f2(1:2) = invK(1:2,1:2) * (-Cdot(1:2) - K(1:2,3) * (f2(3) - f1(3))) + f1(1:2)
                        // b2Vec2 b = -Cdot1 - (m_impulse.z - f1.z) * b2Vec2(m_K.ez.x, m_K.ez.y);
                        const b_x = (-Cdot1_x) - (this.m_impulse.z - f1.z) * this.m_K.ez.x;
                        const b_y = (-Cdot1_y) - (this.m_impulse.z - f1.z) * this.m_K.ez.y;
                        // b2Vec2 f2r = m_K.Solve22(b) + b2Vec2(f1.x, f1.y);
                        const f2r = this.m_K.Solve22(b_x, b_y, b2PrismaticJoint.SolveVelocityConstraints_s_f2r);
                        f2r.x += f1.x;
                        f2r.y += f1.y;
                        // m_impulse.x = f2r.x;
                        this.m_impulse.x = f2r.x;
                        // m_impulse.y = f2r.y;
                        this.m_impulse.y = f2r.y;
                        // df = m_impulse - f1;
                        df3.x = this.m_impulse.x - f1.x;
                        df3.y = this.m_impulse.y - f1.y;
                        df3.z = this.m_impulse.z - f1.z;
                        // b2Vec2 P = df.x * m_perp + df.z * m_axis;
                        const P = b2Math_19.b2Vec2.AddVV(b2Math_19.b2Vec2.MulSV(df3.x, this.m_perp, b2Math_19.b2Vec2.s_t0), b2Math_19.b2Vec2.MulSV(df3.z, this.m_axis, b2Math_19.b2Vec2.s_t1), b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        // float32 LA = df.x * m_s1 + df.y + df.z * m_a1;
                        const LA = df3.x * this.m_s1 + df3.y + df3.z * this.m_a1;
                        // float32 LB = df.x * m_s2 + df.y + df.z * m_a2;
                        const LB = df3.x * this.m_s2 + df3.y + df3.z * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    else {
                        // Limit is inactive, just solve the prismatic constraint in block form.
                        // b2Vec2 df = m_K.Solve22(-Cdot1);
                        const df2 = this.m_K.Solve22((-Cdot1_x), (-Cdot1_y), b2PrismaticJoint.SolveVelocityConstraints_s_df2);
                        this.m_impulse.x += df2.x;
                        this.m_impulse.y += df2.y;
                        // b2Vec2 P = df.x * m_perp;
                        const P = b2Math_19.b2Vec2.MulSV(df2.x, this.m_perp, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        // float32 LA = df.x * m_s1 + df.y;
                        const LA = df2.x * this.m_s1 + df2.y;
                        // float32 LB = df.x * m_s2 + df.y;
                        const LB = df2.x * this.m_s2 + df2.y;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    const rA = b2Math_19.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    const rB = b2Math_19.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = cB + rB - cA - rA;
                    const d = b2Math_19.b2Vec2.SubVV(b2Math_19.b2Vec2.AddVV(cB, rB, b2Math_19.b2Vec2.s_t0), b2Math_19.b2Vec2.AddVV(cA, rA, b2Math_19.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_d);
                    // b2Vec2 axis = b2Mul(qA, m_localXAxisA);
                    const axis = b2Math_19.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_axis);
                    // float32 a1 = b2Cross(d + rA, axis);
                    const a1 = b2Math_19.b2Vec2.CrossVV(b2Math_19.b2Vec2.AddVV(d, rA, b2Math_19.b2Vec2.s_t0), axis);
                    // float32 a2 = b2Cross(rB, axis);
                    const a2 = b2Math_19.b2Vec2.CrossVV(rB, axis);
                    // b2Vec2 perp = b2Mul(qA, m_localYAxisA);
                    const perp = b2Math_19.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_perp);
                    // float32 s1 = b2Cross(d + rA, perp);
                    const s1 = b2Math_19.b2Vec2.CrossVV(b2Math_19.b2Vec2.AddVV(d, rA, b2Math_19.b2Vec2.s_t0), perp);
                    // float32 s2 = b2Cross(rB, perp);
                    const s2 = b2Math_19.b2Vec2.CrossVV(rB, perp);
                    // b2Vec3 impulse;
                    let impulse = b2PrismaticJoint.SolvePositionConstraints_s_impulse;
                    // b2Vec2 C1;
                    // C1.x = b2Dot(perp, d);
                    const C1_x = b2Math_19.b2Vec2.DotVV(perp, d);
                    // C1.y = aB - aA - m_referenceAngle;
                    const C1_y = aB - aA - this.m_referenceAngle;
                    let linearError = b2Math_19.b2Abs(C1_x);
                    let angularError = b2Math_19.b2Abs(C1_y);
                    let active = false;
                    let C2 = 0;
                    if (this.m_enableLimit) {
                        // float32 translation = b2Dot(axis, d);
                        const translation = b2Math_19.b2Vec2.DotVV(axis, d);
                        if (b2Math_19.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2Settings.b2_linearSlop) {
                            // Prevent large angular corrections
                            C2 = b2Math_19.b2Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
                            linearError = b2Math_19.b2Max(linearError, b2Math_19.b2Abs(translation));
                            active = true;
                        }
                        else if (translation <= this.m_lowerTranslation) {
                            // Prevent large linear corrections and allow some slop.
                            C2 = b2Math_19.b2Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0);
                            linearError = b2Math_19.b2Max(linearError, this.m_lowerTranslation - translation);
                            active = true;
                        }
                        else if (translation >= this.m_upperTranslation) {
                            // Prevent large linear corrections and allow some slop.
                            C2 = b2Math_19.b2Clamp(translation - this.m_upperTranslation - b2Settings.b2_linearSlop, 0, b2Settings.b2_maxLinearCorrection);
                            linearError = b2Math_19.b2Max(linearError, translation - this.m_upperTranslation);
                            active = true;
                        }
                    }
                    if (active) {
                        // float32 k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        // float32 k12 = iA * s1 + iB * s2;
                        const k12 = iA * s1 + iB * s2;
                        // float32 k13 = iA * s1 * a1 + iB * s2 * a2;
                        const k13 = iA * s1 * a1 + iB * s2 * a2;
                        // float32 k22 = iA + iB;
                        let k22 = iA + iB;
                        if (k22 === 0) {
                            // For fixed rotation
                            k22 = 1;
                        }
                        // float32 k23 = iA * a1 + iB * a2;
                        const k23 = iA * a1 + iB * a2;
                        // float32 k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;
                        const k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;
                        // b2Mat33 K;
                        const K = this.m_K3;
                        // K.ex.Set(k11, k12, k13);
                        K.ex.SetXYZ(k11, k12, k13);
                        // K.ey.Set(k12, k22, k23);
                        K.ey.SetXYZ(k12, k22, k23);
                        // K.ez.Set(k13, k23, k33);
                        K.ez.SetXYZ(k13, k23, k33);
                        // b2Vec3 C;
                        // C.x = C1.x;
                        // C.y = C1.y;
                        // C.z = C2;
                        // impulse = K.Solve33(-C);
                        impulse = K.Solve33((-C1_x), (-C1_y), (-C2), impulse);
                    }
                    else {
                        // float32 k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        // float32 k12 = iA * s1 + iB * s2;
                        const k12 = iA * s1 + iB * s2;
                        // float32 k22 = iA + iB;
                        let k22 = iA + iB;
                        if (k22 === 0) {
                            k22 = 1;
                        }
                        // b2Mat22 K;
                        const K2 = this.m_K2;
                        // K.ex.Set(k11, k12);
                        K2.ex.SetXY(k11, k12);
                        // K.ey.Set(k12, k22);
                        K2.ey.SetXY(k12, k22);
                        // b2Vec2 impulse1 = K.Solve(-C1);
                        const impulse1 = K2.Solve((-C1_x), (-C1_y), b2PrismaticJoint.SolvePositionConstraints_s_impulse1);
                        impulse.x = impulse1.x;
                        impulse.y = impulse1.y;
                        impulse.z = 0;
                    }
                    // b2Vec2 P = impulse.x * perp + impulse.z * axis;
                    const P = b2Math_19.b2Vec2.AddVV(b2Math_19.b2Vec2.MulSV(impulse.x, perp, b2Math_19.b2Vec2.s_t0), b2Math_19.b2Vec2.MulSV(impulse.z, axis, b2Math_19.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_P);
                    // float32 LA = impulse.x * s1 + impulse.y + impulse.z * a1;
                    const LA = impulse.x * s1 + impulse.y + impulse.z * a1;
                    // float32 LB = impulse.x * s2 + impulse.y + impulse.z * a2;
                    const LB = impulse.x * s2 + impulse.y + impulse.z * a2;
                    // cA -= mA * P;
                    cA.SelfMulSub(mA, P);
                    aA -= iA * LA;
                    // cB += mB * P;
                    cB.SelfMulAdd(mB, P);
                    aB += iB * LB;
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // return inv_dt * (m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis);
                    return out.SetXY(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_impulse.y;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetLocalAxisA() { return this.m_localXAxisA; }
                GetReferenceAngle() { return this.m_referenceAngle; }
                GetJointTranslation() {
                    // b2Vec2 pA = m_bodyA.GetWorldPoint(m_localAnchorA);
                    const pA = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, b2PrismaticJoint.GetJointTranslation_s_pA);
                    // b2Vec2 pB = m_bodyB.GetWorldPoint(m_localAnchorB);
                    const pB = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, b2PrismaticJoint.GetJointTranslation_s_pB);
                    // b2Vec2 d = pB - pA;
                    const d = b2Math_19.b2Vec2.SubVV(pB, pA, b2PrismaticJoint.GetJointTranslation_s_d);
                    // b2Vec2 axis = m_bodyA.GetWorldVector(m_localXAxisA);
                    const axis = this.m_bodyA.GetWorldVector(this.m_localXAxisA, b2PrismaticJoint.GetJointTranslation_s_axis);
                    // float32 translation = b2Dot(d, axis);
                    const translation = b2Math_19.b2Vec2.DotVV(d, axis);
                    return translation;
                }
                GetJointSpeed() {
                    const bA = this.m_bodyA;
                    const bB = this.m_bodyB;
                    // b2Vec2 rA = b2Mul(bA->m_xf.q, m_localAnchorA - bA->m_sweep.localCenter);
                    b2Math_19.b2Vec2.SubVV(this.m_localAnchorA, bA.m_sweep.localCenter, this.m_lalcA);
                    const rA = b2Math_19.b2Rot.MulRV(bA.m_xf.q, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(bB->m_xf.q, m_localAnchorB - bB->m_sweep.localCenter);
                    b2Math_19.b2Vec2.SubVV(this.m_localAnchorB, bB.m_sweep.localCenter, this.m_lalcB);
                    const rB = b2Math_19.b2Rot.MulRV(bB.m_xf.q, this.m_lalcB, this.m_rB);
                    // b2Vec2 pA = bA->m_sweep.c + rA;
                    const pA = b2Math_19.b2Vec2.AddVV(bA.m_sweep.c, rA, b2Math_19.b2Vec2.s_t0); // pA uses s_t0
                    // b2Vec2 pB = bB->m_sweep.c + rB;
                    const pB = b2Math_19.b2Vec2.AddVV(bB.m_sweep.c, rB, b2Math_19.b2Vec2.s_t1); // pB uses s_t1
                    // b2Vec2 d = pB - pA;
                    const d = b2Math_19.b2Vec2.SubVV(pB, pA, b2Math_19.b2Vec2.s_t2); // d uses s_t2
                    // b2Vec2 axis = b2Mul(bA.m_xf.q, m_localXAxisA);
                    const axis = bA.GetWorldVector(this.m_localXAxisA, this.m_axis);
                    const vA = bA.m_linearVelocity;
                    const vB = bB.m_linearVelocity;
                    const wA = bA.m_angularVelocity;
                    const wB = bB.m_angularVelocity;
                    // float32 speed = b2Dot(d, b2Cross(wA, axis)) + b2Dot(axis, vB + b2Cross(wB, rB) - vA - b2Cross(wA, rA));
                    const speed = b2Math_19.b2Vec2.DotVV(d, b2Math_19.b2Vec2.CrossSV(wA, axis, b2Math_19.b2Vec2.s_t0)) +
                        b2Math_19.b2Vec2.DotVV(axis, b2Math_19.b2Vec2.SubVV(b2Math_19.b2Vec2.AddVCrossSV(vB, wB, rB, b2Math_19.b2Vec2.s_t0), b2Math_19.b2Vec2.AddVCrossSV(vA, wA, rA, b2Math_19.b2Vec2.s_t1), b2Math_19.b2Vec2.s_t0));
                    return speed;
                }
                IsLimitEnabled() {
                    return this.m_enableLimit;
                }
                EnableLimit(flag) {
                    if (flag !== this.m_enableLimit) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_enableLimit = flag;
                        this.m_impulse.z = 0;
                    }
                }
                GetLowerLimit() {
                    return this.m_lowerTranslation;
                }
                GetUpperLimit() {
                    return this.m_upperTranslation;
                }
                SetLimits(lower, upper) {
                    if (lower !== this.m_lowerTranslation || upper !== this.m_upperTranslation) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_lowerTranslation = lower;
                        this.m_upperTranslation = upper;
                        this.m_impulse.z = 0;
                    }
                }
                IsMotorEnabled() {
                    return this.m_enableMotor;
                }
                EnableMotor(flag) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_enableMotor = flag;
                }
                SetMotorSpeed(speed) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_motorSpeed = speed;
                }
                GetMotorSpeed() {
                    return this.m_motorSpeed;
                }
                SetMaxMotorForce(force) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_maxMotorForce = force;
                }
                GetMaxMotorForce() { return this.m_maxMotorForce; }
                GetMotorForce(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2PrismaticJointDef = new b2PrismaticJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.localAxisA.SetXY(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
                        b2Settings.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                        b2Settings.b2Log("  jd.enableLimit = %s;\n", (this.m_enableLimit) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.lowerTranslation = %.15f;\n", this.m_lowerTranslation);
                        b2Settings.b2Log("  jd.upperTranslation = %.15f;\n", this.m_upperTranslation);
                        b2Settings.b2Log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                        b2Settings.b2Log("  jd.maxMotorForce = %.15f;\n", this.m_maxMotorForce);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2PrismaticJoint.InitVelocityConstraints_s_d = new b2Math_19.b2Vec2();
            b2PrismaticJoint.InitVelocityConstraints_s_P = new b2Math_19.b2Vec2();
            b2PrismaticJoint.SolveVelocityConstraints_s_P = new b2Math_19.b2Vec2();
            b2PrismaticJoint.SolveVelocityConstraints_s_f2r = new b2Math_19.b2Vec2();
            b2PrismaticJoint.SolveVelocityConstraints_s_f1 = new b2Math_19.b2Vec3();
            b2PrismaticJoint.SolveVelocityConstraints_s_df3 = new b2Math_19.b2Vec3();
            b2PrismaticJoint.SolveVelocityConstraints_s_df2 = new b2Math_19.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_d = new b2Math_19.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_impulse = new b2Math_19.b2Vec3();
            b2PrismaticJoint.SolvePositionConstraints_s_impulse1 = new b2Math_19.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_P = new b2Math_19.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_pA = new b2Math_19.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_pB = new b2Math_19.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_d = new b2Math_19.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_axis = new b2Math_19.b2Vec2();
            exports_25("b2PrismaticJoint", b2PrismaticJoint);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2RevoluteJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var b2Settings, b2Math_20, b2Joint_5;
    var b2RevoluteJointDef, b2RevoluteJoint;
    return {
        setters:[
            function (b2Settings_21) {
                b2Settings = b2Settings_21;
            },
            function (b2Math_20_1) {
                b2Math_20 = b2Math_20_1;
            },
            function (b2Joint_5_1) {
                b2Joint_5 = b2Joint_5_1;
            }],
        execute: function() {
            /// Revolute joint definition. This requires defining an
            /// anchor point where the bodies are joined. The definition
            /// uses local anchor points so that the initial configuration
            /// can violate the constraint slightly. You also need to
            /// specify the initial relative angle for joint limits. This
            /// helps when saving and loading a game.
            /// The local anchor points are measured from the body's origin
            /// rather than the center of mass because:
            /// 1. you might not know where the center of mass will be.
            /// 2. if you add/remove shapes from a body and recompute the mass,
            ///    the joints will be broken.
            b2RevoluteJointDef = class b2RevoluteJointDef extends b2Joint_5.b2JointDef {
                constructor() {
                    super(1 /* e_revoluteJoint */); // base class constructor
                    this.localAnchorA = new b2Math_20.b2Vec2(0, 0);
                    this.localAnchorB = new b2Math_20.b2Vec2(0, 0);
                    this.referenceAngle = 0;
                    this.enableLimit = false;
                    this.lowerAngle = 0;
                    this.upperAngle = 0;
                    this.enableMotor = false;
                    this.motorSpeed = 0;
                    this.maxMotorTorque = 0;
                }
                Initialize(bA, bB, anchor) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians();
                }
            };
            exports_26("b2RevoluteJointDef", b2RevoluteJointDef);
            b2RevoluteJoint = class b2RevoluteJoint extends b2Joint_5.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    // Solver shared
                    this.m_localAnchorA = new b2Math_20.b2Vec2();
                    this.m_localAnchorB = new b2Math_20.b2Vec2();
                    this.m_impulse = new b2Math_20.b2Vec3();
                    this.m_motorImpulse = 0;
                    this.m_enableMotor = false;
                    this.m_maxMotorTorque = 0;
                    this.m_motorSpeed = 0;
                    this.m_enableLimit = false;
                    this.m_referenceAngle = 0;
                    this.m_lowerAngle = 0;
                    this.m_upperAngle = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2Math_20.b2Vec2();
                    this.m_rB = new b2Math_20.b2Vec2();
                    this.m_localCenterA = new b2Math_20.b2Vec2();
                    this.m_localCenterB = new b2Math_20.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = new b2Math_20.b2Mat33(); // effective mass for point-to-point constraint.
                    this.m_motorMass = 0; // effective mass for motor/limit angular constraint.
                    this.m_limitState = 0 /* e_inactiveLimit */;
                    this.m_qA = new b2Math_20.b2Rot();
                    this.m_qB = new b2Math_20.b2Rot();
                    this.m_lalcA = new b2Math_20.b2Vec2();
                    this.m_lalcB = new b2Math_20.b2Vec2();
                    this.m_K = new b2Math_20.b2Mat22();
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_referenceAngle = def.referenceAngle;
                    this.m_impulse.SetZero();
                    this.m_motorImpulse = 0;
                    this.m_lowerAngle = def.lowerAngle;
                    this.m_upperAngle = def.upperAngle;
                    this.m_maxMotorTorque = def.maxMotorTorque;
                    this.m_motorSpeed = def.motorSpeed;
                    this.m_enableLimit = def.enableLimit;
                    this.m_enableMotor = def.enableMotor;
                    this.m_limitState = 0 /* e_inactiveLimit */;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // b2Rot qA(aA), qB(aB);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_20.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_20.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_20.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_20.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    //     [ 0       -1 0       1]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const fixedRotation = (iA + iB === 0);
                    this.m_mass.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
                    this.m_mass.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
                    this.m_mass.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
                    this.m_mass.ex.y = this.m_mass.ey.x;
                    this.m_mass.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
                    this.m_mass.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
                    this.m_mass.ex.z = this.m_mass.ez.x;
                    this.m_mass.ey.z = this.m_mass.ez.y;
                    this.m_mass.ez.z = iA + iB;
                    this.m_motorMass = iA + iB;
                    if (this.m_motorMass > 0) {
                        this.m_motorMass = 1 / this.m_motorMass;
                    }
                    if (this.m_enableMotor === false || fixedRotation) {
                        this.m_motorImpulse = 0;
                    }
                    if (this.m_enableLimit && fixedRotation === false) {
                        const jointAngle = aB - aA - this.m_referenceAngle;
                        if (b2Math_20.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * b2Settings.b2_angularSlop) {
                            this.m_limitState = 3 /* e_equalLimits */;
                        }
                        else if (jointAngle <= this.m_lowerAngle) {
                            if (this.m_limitState !== 1 /* e_atLowerLimit */) {
                                this.m_impulse.z = 0;
                            }
                            this.m_limitState = 1 /* e_atLowerLimit */;
                        }
                        else if (jointAngle >= this.m_upperAngle) {
                            if (this.m_limitState !== 2 /* e_atUpperLimit */) {
                                this.m_impulse.z = 0;
                            }
                            this.m_limitState = 2 /* e_atUpperLimit */;
                        }
                        else {
                            this.m_limitState = 0 /* e_inactiveLimit */;
                            this.m_impulse.z = 0;
                        }
                    }
                    else {
                        this.m_limitState = 0 /* e_inactiveLimit */;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        this.m_motorImpulse *= data.step.dtRatio;
                        // b2Vec2 P(m_impulse.x, m_impulse.y);
                        const P = b2RevoluteJoint.InitVelocityConstraints_s_P.SetXY(this.m_impulse.x, this.m_impulse.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_20.b2Vec2.CrossVV(this.m_rA, P) + this.m_motorImpulse + this.m_impulse.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_20.b2Vec2.CrossVV(this.m_rB, P) + this.m_motorImpulse + this.m_impulse.z);
                    }
                    else {
                        this.m_impulse.SetZero();
                        this.m_motorImpulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const fixedRotation = (iA + iB === 0);
                    // Solve motor constraint.
                    if (this.m_enableMotor && this.m_limitState !== 3 /* e_equalLimits */ && fixedRotation === false) {
                        const Cdot = wB - wA - this.m_motorSpeed;
                        let impulse = -this.m_motorMass * Cdot;
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorTorque;
                        this.m_motorImpulse = b2Math_20.b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve limit constraint.
                    if (this.m_enableLimit && this.m_limitState !== 0 /* e_inactiveLimit */ && fixedRotation === false) {
                        // b2Vec2 Cdot1 = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                        const Cdot1 = b2Math_20.b2Vec2.SubVV(b2Math_20.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_20.b2Vec2.s_t0), b2Math_20.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_20.b2Vec2.s_t1), b2RevoluteJoint.SolveVelocityConstraints_s_Cdot1);
                        const Cdot2 = wB - wA;
                        // b2Vec3 Cdot(Cdot1.x, Cdot1.y, Cdot2);
                        // b2Vec3 impulse = -this.m_mass.Solve33(Cdot);
                        const impulse_v3 = this.m_mass.Solve33(Cdot1.x, Cdot1.y, Cdot2, b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v3).SelfNeg();
                        if (this.m_limitState === 3 /* e_equalLimits */) {
                            this.m_impulse.SelfAdd(impulse_v3);
                        }
                        else if (this.m_limitState === 1 /* e_atLowerLimit */) {
                            const newImpulse = this.m_impulse.z + impulse_v3.z;
                            if (newImpulse < 0) {
                                // b2Vec2 rhs = -Cdot1 + m_impulse.z * b2Vec2(m_mass.ez.x, m_mass.ez.y);
                                const rhs_x = -Cdot1.x + this.m_impulse.z * this.m_mass.ez.x;
                                const rhs_y = -Cdot1.y + this.m_impulse.z * this.m_mass.ez.y;
                                const reduced_v2 = this.m_mass.Solve22(rhs_x, rhs_y, b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2);
                                impulse_v3.x = reduced_v2.x;
                                impulse_v3.y = reduced_v2.y;
                                impulse_v3.z = -this.m_impulse.z;
                                this.m_impulse.x += reduced_v2.x;
                                this.m_impulse.y += reduced_v2.y;
                                this.m_impulse.z = 0;
                            }
                            else {
                                this.m_impulse.SelfAdd(impulse_v3);
                            }
                        }
                        else if (this.m_limitState === 2 /* e_atUpperLimit */) {
                            const newImpulse = this.m_impulse.z + impulse_v3.z;
                            if (newImpulse > 0) {
                                // b2Vec2 rhs = -Cdot1 + m_impulse.z * b2Vec2(m_mass.ez.x, m_mass.ez.y);
                                const rhs_x = -Cdot1.x + this.m_impulse.z * this.m_mass.ez.x;
                                const rhs_y = -Cdot1.y + this.m_impulse.z * this.m_mass.ez.y;
                                const reduced_v2 = this.m_mass.Solve22(rhs_x, rhs_y, b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2);
                                impulse_v3.x = reduced_v2.x;
                                impulse_v3.y = reduced_v2.y;
                                impulse_v3.z = -this.m_impulse.z;
                                this.m_impulse.x += reduced_v2.x;
                                this.m_impulse.y += reduced_v2.y;
                                this.m_impulse.z = 0;
                            }
                            else {
                                this.m_impulse.SelfAdd(impulse_v3);
                            }
                        }
                        // b2Vec2 P(impulse.x, impulse.y);
                        const P = b2RevoluteJoint.SolveVelocityConstraints_s_P.SetXY(impulse_v3.x, impulse_v3.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_20.b2Vec2.CrossVV(this.m_rA, P) + impulse_v3.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_20.b2Vec2.CrossVV(this.m_rB, P) + impulse_v3.z);
                    }
                    else {
                        // Solve point-to-point constraint
                        // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                        const Cdot_v2 = b2Math_20.b2Vec2.SubVV(b2Math_20.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_20.b2Vec2.s_t0), b2Math_20.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_20.b2Vec2.s_t1), b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = m_mass.Solve22(-Cdot);
                        const impulse_v2 = this.m_mass.Solve22(-Cdot_v2.x, -Cdot_v2.y, b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2);
                        this.m_impulse.x += impulse_v2.x;
                        this.m_impulse.y += impulse_v2.y;
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulse_v2);
                        wA -= iA * b2Math_20.b2Vec2.CrossVV(this.m_rA, impulse_v2);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulse_v2);
                        wB += iB * b2Math_20.b2Vec2.CrossVV(this.m_rB, impulse_v2);
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    // b2Rot qA(aA), qB(aB);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    let angularError = 0;
                    let positionError = 0;
                    const fixedRotation = (this.m_invIA + this.m_invIB === 0);
                    // Solve angular limit constraint.
                    if (this.m_enableLimit && this.m_limitState !== 0 /* e_inactiveLimit */ && fixedRotation === false) {
                        const angle = aB - aA - this.m_referenceAngle;
                        let limitImpulse = 0;
                        if (this.m_limitState === 3 /* e_equalLimits */) {
                            // Prevent large angular corrections
                            const C = b2Math_20.b2Clamp(angle - this.m_lowerAngle, -b2Settings.b2_maxAngularCorrection, b2Settings.b2_maxAngularCorrection);
                            limitImpulse = -this.m_motorMass * C;
                            angularError = b2Math_20.b2Abs(C);
                        }
                        else if (this.m_limitState === 1 /* e_atLowerLimit */) {
                            let C = angle - this.m_lowerAngle;
                            angularError = -C;
                            // Prevent large angular corrections and allow some slop.
                            C = b2Math_20.b2Clamp(C + b2Settings.b2_angularSlop, -b2Settings.b2_maxAngularCorrection, 0);
                            limitImpulse = -this.m_motorMass * C;
                        }
                        else if (this.m_limitState === 2 /* e_atUpperLimit */) {
                            let C = angle - this.m_upperAngle;
                            angularError = C;
                            // Prevent large angular corrections and allow some slop.
                            C = b2Math_20.b2Clamp(C - b2Settings.b2_angularSlop, 0, b2Settings.b2_maxAngularCorrection);
                            limitImpulse = -this.m_motorMass * C;
                        }
                        aA -= this.m_invIA * limitImpulse;
                        aB += this.m_invIB * limitImpulse;
                    }
                    // Solve point-to-point constraint.
                    {
                        qA.SetAngleRadians(aA);
                        qB.SetAngleRadians(aB);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                        b2Math_20.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                        const rA = b2Math_20.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                        b2Math_20.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                        const rB = b2Math_20.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                        // b2Vec2 C = cB + rB - cA - rA;
                        const C_v2 = b2Math_20.b2Vec2.SubVV(b2Math_20.b2Vec2.AddVV(cB, rB, b2Math_20.b2Vec2.s_t0), b2Math_20.b2Vec2.AddVV(cA, rA, b2Math_20.b2Vec2.s_t1), b2RevoluteJoint.SolvePositionConstraints_s_C_v2);
                        // positionError = C.Length();
                        positionError = C_v2.GetLength();
                        const mA = this.m_invMassA, mB = this.m_invMassB;
                        const iA = this.m_invIA, iB = this.m_invIB;
                        const K = this.m_K;
                        K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
                        K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
                        K.ey.x = K.ex.y;
                        K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
                        // b2Vec2 impulse = -K.Solve(C);
                        const impulse = K.Solve(C_v2.x, C_v2.y, b2RevoluteJoint.SolvePositionConstraints_s_impulse).SelfNeg();
                        // cA -= mA * impulse;
                        cA.SelfMulSub(mA, impulse);
                        aA -= iA * b2Math_20.b2Vec2.CrossVV(rA, impulse);
                        // cB += mB * impulse;
                        cB.SelfMulAdd(mB, impulse);
                        aB += iB * b2Math_20.b2Vec2.CrossVV(rB, impulse);
                    }
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // b2Vec2 P(this.m_impulse.x, this.m_impulse.y);
                    // return inv_dt * P;
                    return out.SetXY(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_impulse.z;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetReferenceAngle() { return this.m_referenceAngle; }
                GetJointAngleRadians() {
                    // b2Body* bA = this.m_bodyA;
                    // b2Body* bB = this.m_bodyB;
                    // return bB->this.m_sweep.a - bA->this.m_sweep.a - this.m_referenceAngle;
                    return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
                }
                GetJointSpeed() {
                    // b2Body* bA = this.m_bodyA;
                    // b2Body* bB = this.m_bodyB;
                    // return bB->this.m_angularVelocity - bA->this.m_angularVelocity;
                    return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
                }
                IsMotorEnabled() {
                    return this.m_enableMotor;
                }
                EnableMotor(flag) {
                    if (this.m_enableMotor !== flag) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_enableMotor = flag;
                    }
                }
                GetMotorTorque(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                GetMotorSpeed() {
                    return this.m_motorSpeed;
                }
                SetMaxMotorTorque(torque) {
                    this.m_maxMotorTorque = torque;
                }
                GetMaxMotorTorque() { return this.m_maxMotorTorque; }
                IsLimitEnabled() {
                    return this.m_enableLimit;
                }
                EnableLimit(flag) {
                    if (flag !== this.m_enableLimit) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_enableLimit = flag;
                        this.m_impulse.z = 0;
                    }
                }
                GetLowerLimit() {
                    return this.m_lowerAngle;
                }
                GetUpperLimit() {
                    return this.m_upperAngle;
                }
                SetLimits(lower, upper) {
                    if (lower !== this.m_lowerAngle || upper !== this.m_upperAngle) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_impulse.z = 0;
                        this.m_lowerAngle = lower;
                        this.m_upperAngle = upper;
                    }
                }
                SetMotorSpeed(speed) {
                    if (this.m_motorSpeed !== speed) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_motorSpeed = speed;
                    }
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2RevoluteJointDef = new b2RevoluteJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                        b2Settings.b2Log("  jd.enableLimit = %s;\n", (this.m_enableLimit) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.lowerAngle = %.15f;\n", this.m_lowerAngle);
                        b2Settings.b2Log("  jd.upperAngle = %.15f;\n", this.m_upperAngle);
                        b2Settings.b2Log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                        b2Settings.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2RevoluteJoint.InitVelocityConstraints_s_P = new b2Math_20.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_P = new b2Math_20.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2Math_20.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_Cdot1 = new b2Math_20.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v3 = new b2Math_20.b2Vec3();
            b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2 = new b2Math_20.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2 = new b2Math_20.b2Vec2();
            b2RevoluteJoint.SolvePositionConstraints_s_C_v2 = new b2Math_20.b2Vec2();
            b2RevoluteJoint.SolvePositionConstraints_s_impulse = new b2Math_20.b2Vec2();
            exports_26("b2RevoluteJoint", b2RevoluteJoint);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2GearJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var b2Settings, b2Math_21, b2Joint_6;
    var b2GearJointDef, b2GearJoint;
    return {
        setters:[
            function (b2Settings_22) {
                b2Settings = b2Settings_22;
            },
            function (b2Math_21_1) {
                b2Math_21 = b2Math_21_1;
            },
            function (b2Joint_6_1) {
                b2Joint_6 = b2Joint_6_1;
            }],
        execute: function() {
            /// Gear joint definition. This definition requires two existing
            /// revolute or prismatic joints (any combination will work).
            b2GearJointDef = class b2GearJointDef extends b2Joint_6.b2JointDef {
                constructor() {
                    super(6 /* e_gearJoint */); // base class constructor
                    this.joint1 = null;
                    this.joint2 = null;
                    this.ratio = 1;
                }
            };
            exports_27("b2GearJointDef", b2GearJointDef);
            b2GearJoint = class b2GearJoint extends b2Joint_6.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_joint1 = null;
                    this.m_joint2 = null;
                    this.m_typeA = 0 /* e_unknownJoint */;
                    this.m_typeB = 0 /* e_unknownJoint */;
                    // Body A is connected to body C
                    // Body B is connected to body D
                    this.m_bodyC = null;
                    this.m_bodyD = null;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_21.b2Vec2();
                    this.m_localAnchorB = new b2Math_21.b2Vec2();
                    this.m_localAnchorC = new b2Math_21.b2Vec2();
                    this.m_localAnchorD = new b2Math_21.b2Vec2();
                    this.m_localAxisC = new b2Math_21.b2Vec2();
                    this.m_localAxisD = new b2Math_21.b2Vec2();
                    this.m_referenceAngleA = 0;
                    this.m_referenceAngleB = 0;
                    this.m_constant = 0;
                    this.m_ratio = 0;
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_indexC = 0;
                    this.m_indexD = 0;
                    this.m_lcA = new b2Math_21.b2Vec2();
                    this.m_lcB = new b2Math_21.b2Vec2();
                    this.m_lcC = new b2Math_21.b2Vec2();
                    this.m_lcD = new b2Math_21.b2Vec2();
                    this.m_mA = 0;
                    this.m_mB = 0;
                    this.m_mC = 0;
                    this.m_mD = 0;
                    this.m_iA = 0;
                    this.m_iB = 0;
                    this.m_iC = 0;
                    this.m_iD = 0;
                    this.m_JvAC = new b2Math_21.b2Vec2();
                    this.m_JvBD = new b2Math_21.b2Vec2();
                    this.m_JwA = 0;
                    this.m_JwB = 0;
                    this.m_JwC = 0;
                    this.m_JwD = 0;
                    this.m_mass = 0;
                    this.m_qA = new b2Math_21.b2Rot();
                    this.m_qB = new b2Math_21.b2Rot();
                    this.m_qC = new b2Math_21.b2Rot();
                    this.m_qD = new b2Math_21.b2Rot();
                    this.m_lalcA = new b2Math_21.b2Vec2();
                    this.m_lalcB = new b2Math_21.b2Vec2();
                    this.m_lalcC = new b2Math_21.b2Vec2();
                    this.m_lalcD = new b2Math_21.b2Vec2();
                    this.m_joint1 = def.joint1;
                    this.m_joint2 = def.joint2;
                    this.m_typeA = this.m_joint1.GetType();
                    this.m_typeB = this.m_joint2.GetType();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_typeA === 1 /* e_revoluteJoint */ || this.m_typeA === 2 /* e_prismaticJoint */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_typeB === 1 /* e_revoluteJoint */ || this.m_typeB === 2 /* e_prismaticJoint */);
                    }
                    let coordinateA, coordinateB;
                    // TODO_ERIN there might be some problem with the joint edges in b2Joint.
                    this.m_bodyC = this.m_joint1.GetBodyA();
                    this.m_bodyA = this.m_joint1.GetBodyB();
                    // Get geometry of joint1
                    const xfA = this.m_bodyA.m_xf;
                    const aA = this.m_bodyA.m_sweep.a;
                    const xfC = this.m_bodyC.m_xf;
                    const aC = this.m_bodyC.m_sweep.a;
                    if (this.m_typeA === 1 /* e_revoluteJoint */) {
                        const revolute = def.joint1;
                        this.m_localAnchorC.Copy(revolute.m_localAnchorA);
                        this.m_localAnchorA.Copy(revolute.m_localAnchorB);
                        this.m_referenceAngleA = revolute.m_referenceAngle;
                        this.m_localAxisC.SetZero();
                        coordinateA = aA - aC - this.m_referenceAngleA;
                    }
                    else {
                        const prismatic = def.joint1;
                        this.m_localAnchorC.Copy(prismatic.m_localAnchorA);
                        this.m_localAnchorA.Copy(prismatic.m_localAnchorB);
                        this.m_referenceAngleA = prismatic.m_referenceAngle;
                        this.m_localAxisC.Copy(prismatic.m_localXAxisA);
                        // b2Vec2 pC = m_localAnchorC;
                        const pC = this.m_localAnchorC;
                        // b2Vec2 pA = b2MulT(xfC.q, b2Mul(xfA.q, m_localAnchorA) + (xfA.p - xfC.p));
                        const pA = b2Math_21.b2Rot.MulTRV(xfC.q, b2Math_21.b2Vec2.AddVV(b2Math_21.b2Rot.MulRV(xfA.q, this.m_localAnchorA, b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.SubVV(xfA.p, xfC.p, b2Math_21.b2Vec2.s_t1), b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.s_t0); // pA uses s_t0
                        // coordinateA = b2Dot(pA - pC, m_localAxisC);
                        coordinateA = b2Math_21.b2Vec2.DotVV(b2Math_21.b2Vec2.SubVV(pA, pC, b2Math_21.b2Vec2.s_t0), this.m_localAxisC);
                    }
                    this.m_bodyD = this.m_joint2.GetBodyA();
                    this.m_bodyB = this.m_joint2.GetBodyB();
                    // Get geometry of joint2
                    const xfB = this.m_bodyB.m_xf;
                    const aB = this.m_bodyB.m_sweep.a;
                    const xfD = this.m_bodyD.m_xf;
                    const aD = this.m_bodyD.m_sweep.a;
                    if (this.m_typeB === 1 /* e_revoluteJoint */) {
                        const revolute = def.joint2;
                        this.m_localAnchorD.Copy(revolute.m_localAnchorA);
                        this.m_localAnchorB.Copy(revolute.m_localAnchorB);
                        this.m_referenceAngleB = revolute.m_referenceAngle;
                        this.m_localAxisD.SetZero();
                        coordinateB = aB - aD - this.m_referenceAngleB;
                    }
                    else {
                        const prismatic = def.joint2;
                        this.m_localAnchorD.Copy(prismatic.m_localAnchorA);
                        this.m_localAnchorB.Copy(prismatic.m_localAnchorB);
                        this.m_referenceAngleB = prismatic.m_referenceAngle;
                        this.m_localAxisD.Copy(prismatic.m_localXAxisA);
                        // b2Vec2 pD = m_localAnchorD;
                        const pD = this.m_localAnchorD;
                        // b2Vec2 pB = b2MulT(xfD.q, b2Mul(xfB.q, m_localAnchorB) + (xfB.p - xfD.p));
                        const pB = b2Math_21.b2Rot.MulTRV(xfD.q, b2Math_21.b2Vec2.AddVV(b2Math_21.b2Rot.MulRV(xfB.q, this.m_localAnchorB, b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.SubVV(xfB.p, xfD.p, b2Math_21.b2Vec2.s_t1), b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.s_t0); // pB uses s_t0
                        // coordinateB = b2Dot(pB - pD, m_localAxisD);
                        coordinateB = b2Math_21.b2Vec2.DotVV(b2Math_21.b2Vec2.SubVV(pB, pD, b2Math_21.b2Vec2.s_t0), this.m_localAxisD);
                    }
                    this.m_ratio = def.ratio;
                    this.m_constant = coordinateA + this.m_ratio * coordinateB;
                    this.m_impulse = 0;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_indexC = this.m_bodyC.m_islandIndex;
                    this.m_indexD = this.m_bodyD.m_islandIndex;
                    this.m_lcA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_lcB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_lcC.Copy(this.m_bodyC.m_sweep.localCenter);
                    this.m_lcD.Copy(this.m_bodyD.m_sweep.localCenter);
                    this.m_mA = this.m_bodyA.m_invMass;
                    this.m_mB = this.m_bodyB.m_invMass;
                    this.m_mC = this.m_bodyC.m_invMass;
                    this.m_mD = this.m_bodyD.m_invMass;
                    this.m_iA = this.m_bodyA.m_invI;
                    this.m_iB = this.m_bodyB.m_invI;
                    this.m_iC = this.m_bodyC.m_invI;
                    this.m_iD = this.m_bodyD.m_invI;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const aC = data.positions[this.m_indexC].a;
                    const vC = data.velocities[this.m_indexC].v;
                    let wC = data.velocities[this.m_indexC].w;
                    const aD = data.positions[this.m_indexD].a;
                    const vD = data.velocities[this.m_indexD].v;
                    let wD = data.velocities[this.m_indexD].w;
                    // b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB), qC = this.m_qC.SetAngleRadians(aC), qD = this.m_qD.SetAngleRadians(aD);
                    this.m_mass = 0;
                    if (this.m_typeA === 1 /* e_revoluteJoint */) {
                        this.m_JvAC.SetZero();
                        this.m_JwA = 1;
                        this.m_JwC = 1;
                        this.m_mass += this.m_iA + this.m_iC;
                    }
                    else {
                        // b2Vec2 u = b2Mul(qC, m_localAxisC);
                        const u = b2Math_21.b2Rot.MulRV(qC, this.m_localAxisC, b2GearJoint.InitVelocityConstraints_s_u);
                        // b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
                        b2Math_21.b2Vec2.SubVV(this.m_localAnchorC, this.m_lcC, this.m_lalcC);
                        const rC = b2Math_21.b2Rot.MulRV(qC, this.m_lalcC, b2GearJoint.InitVelocityConstraints_s_rC);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
                        b2Math_21.b2Vec2.SubVV(this.m_localAnchorA, this.m_lcA, this.m_lalcA);
                        const rA = b2Math_21.b2Rot.MulRV(qA, this.m_lalcA, b2GearJoint.InitVelocityConstraints_s_rA);
                        // m_JvAC = u;
                        this.m_JvAC.Copy(u);
                        // m_JwC = b2Cross(rC, u);
                        this.m_JwC = b2Math_21.b2Vec2.CrossVV(rC, u);
                        // m_JwA = b2Cross(rA, u);
                        this.m_JwA = b2Math_21.b2Vec2.CrossVV(rA, u);
                        this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
                    }
                    if (this.m_typeB === 1 /* e_revoluteJoint */) {
                        this.m_JvBD.SetZero();
                        this.m_JwB = this.m_ratio;
                        this.m_JwD = this.m_ratio;
                        this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
                    }
                    else {
                        // b2Vec2 u = b2Mul(qD, m_localAxisD);
                        const u = b2Math_21.b2Rot.MulRV(qD, this.m_localAxisD, b2GearJoint.InitVelocityConstraints_s_u);
                        // b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
                        b2Math_21.b2Vec2.SubVV(this.m_localAnchorD, this.m_lcD, this.m_lalcD);
                        const rD = b2Math_21.b2Rot.MulRV(qD, this.m_lalcD, b2GearJoint.InitVelocityConstraints_s_rD);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
                        b2Math_21.b2Vec2.SubVV(this.m_localAnchorB, this.m_lcB, this.m_lalcB);
                        const rB = b2Math_21.b2Rot.MulRV(qB, this.m_lalcB, b2GearJoint.InitVelocityConstraints_s_rB);
                        // m_JvBD = m_ratio * u;
                        b2Math_21.b2Vec2.MulSV(this.m_ratio, u, this.m_JvBD);
                        // m_JwD = m_ratio * b2Cross(rD, u);
                        this.m_JwD = this.m_ratio * b2Math_21.b2Vec2.CrossVV(rD, u);
                        // m_JwB = m_ratio * b2Cross(rB, u);
                        this.m_JwB = this.m_ratio * b2Math_21.b2Vec2.CrossVV(rB, u);
                        this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
                    }
                    // Compute effective mass.
                    this.m_mass = this.m_mass > 0 ? 1 / this.m_mass : 0;
                    if (data.step.warmStarting) {
                        // vA += (m_mA * m_impulse) * m_JvAC;
                        vA.SelfMulAdd(this.m_mA * this.m_impulse, this.m_JvAC);
                        wA += this.m_iA * this.m_impulse * this.m_JwA;
                        // vB += (m_mB * m_impulse) * m_JvBD;
                        vB.SelfMulAdd(this.m_mB * this.m_impulse, this.m_JvBD);
                        wB += this.m_iB * this.m_impulse * this.m_JwB;
                        // vC -= (m_mC * m_impulse) * m_JvAC;
                        vC.SelfMulSub(this.m_mC * this.m_impulse, this.m_JvAC);
                        wC -= this.m_iC * this.m_impulse * this.m_JwC;
                        // vD -= (m_mD * m_impulse) * m_JvBD;
                        vD.SelfMulSub(this.m_mD * this.m_impulse, this.m_JvBD);
                        wD -= this.m_iD * this.m_impulse * this.m_JwD;
                    }
                    else {
                        this.m_impulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                    // data.velocities[this.m_indexC].v = vC;
                    data.velocities[this.m_indexC].w = wC;
                    // data.velocities[this.m_indexD].v = vD;
                    data.velocities[this.m_indexD].w = wD;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const vC = data.velocities[this.m_indexC].v;
                    let wC = data.velocities[this.m_indexC].w;
                    const vD = data.velocities[this.m_indexD].v;
                    let wD = data.velocities[this.m_indexD].w;
                    // float32 Cdot = b2Dot(m_JvAC, vA - vC) + b2Dot(m_JvBD, vB - vD);
                    let Cdot = b2Math_21.b2Vec2.DotVV(this.m_JvAC, b2Math_21.b2Vec2.SubVV(vA, vC, b2Math_21.b2Vec2.s_t0)) +
                        b2Math_21.b2Vec2.DotVV(this.m_JvBD, b2Math_21.b2Vec2.SubVV(vB, vD, b2Math_21.b2Vec2.s_t0));
                    Cdot += (this.m_JwA * wA - this.m_JwC * wC) + (this.m_JwB * wB - this.m_JwD * wD);
                    const impulse = -this.m_mass * Cdot;
                    this.m_impulse += impulse;
                    // vA += (m_mA * impulse) * m_JvAC;
                    vA.SelfMulAdd((this.m_mA * impulse), this.m_JvAC);
                    wA += this.m_iA * impulse * this.m_JwA;
                    // vB += (m_mB * impulse) * m_JvBD;
                    vB.SelfMulAdd((this.m_mB * impulse), this.m_JvBD);
                    wB += this.m_iB * impulse * this.m_JwB;
                    // vC -= (m_mC * impulse) * m_JvAC;
                    vC.SelfMulSub((this.m_mC * impulse), this.m_JvAC);
                    wC -= this.m_iC * impulse * this.m_JwC;
                    // vD -= (m_mD * impulse) * m_JvBD;
                    vD.SelfMulSub((this.m_mD * impulse), this.m_JvBD);
                    wD -= this.m_iD * impulse * this.m_JwD;
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                    // data.velocities[this.m_indexC].v = vC;
                    data.velocities[this.m_indexC].w = wC;
                    // data.velocities[this.m_indexD].v = vD;
                    data.velocities[this.m_indexD].w = wD;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    const cC = data.positions[this.m_indexC].c;
                    let aC = data.positions[this.m_indexC].a;
                    const cD = data.positions[this.m_indexD].c;
                    let aD = data.positions[this.m_indexD].a;
                    // b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB), qC = this.m_qC.SetAngleRadians(aC), qD = this.m_qD.SetAngleRadians(aD);
                    const linearError = 0;
                    let coordinateA, coordinateB;
                    const JvAC = this.m_JvAC, JvBD = this.m_JvBD;
                    let JwA, JwB, JwC, JwD;
                    let mass = 0;
                    if (this.m_typeA === 1 /* e_revoluteJoint */) {
                        JvAC.SetZero();
                        JwA = 1;
                        JwC = 1;
                        mass += this.m_iA + this.m_iC;
                        coordinateA = aA - aC - this.m_referenceAngleA;
                    }
                    else {
                        // b2Vec2 u = b2Mul(qC, m_localAxisC);
                        const u = b2Math_21.b2Rot.MulRV(qC, this.m_localAxisC, b2GearJoint.SolvePositionConstraints_s_u);
                        // b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
                        const rC = b2Math_21.b2Rot.MulRV(qC, this.m_lalcC, b2GearJoint.SolvePositionConstraints_s_rC);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
                        const rA = b2Math_21.b2Rot.MulRV(qA, this.m_lalcA, b2GearJoint.SolvePositionConstraints_s_rA);
                        // JvAC = u;
                        JvAC.Copy(u);
                        // JwC = b2Cross(rC, u);
                        JwC = b2Math_21.b2Vec2.CrossVV(rC, u);
                        // JwA = b2Cross(rA, u);
                        JwA = b2Math_21.b2Vec2.CrossVV(rA, u);
                        mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;
                        // b2Vec2 pC = m_localAnchorC - m_lcC;
                        const pC = this.m_lalcC;
                        // b2Vec2 pA = b2MulT(qC, rA + (cA - cC));
                        const pA = b2Math_21.b2Rot.MulTRV(qC, b2Math_21.b2Vec2.AddVV(rA, b2Math_21.b2Vec2.SubVV(cA, cC, b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.s_t0); // pA uses s_t0
                        // coordinateA = b2Dot(pA - pC, m_localAxisC);
                        coordinateA = b2Math_21.b2Vec2.DotVV(b2Math_21.b2Vec2.SubVV(pA, pC, b2Math_21.b2Vec2.s_t0), this.m_localAxisC);
                    }
                    if (this.m_typeB === 1 /* e_revoluteJoint */) {
                        JvBD.SetZero();
                        JwB = this.m_ratio;
                        JwD = this.m_ratio;
                        mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
                        coordinateB = aB - aD - this.m_referenceAngleB;
                    }
                    else {
                        // b2Vec2 u = b2Mul(qD, m_localAxisD);
                        const u = b2Math_21.b2Rot.MulRV(qD, this.m_localAxisD, b2GearJoint.SolvePositionConstraints_s_u);
                        // b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
                        const rD = b2Math_21.b2Rot.MulRV(qD, this.m_lalcD, b2GearJoint.SolvePositionConstraints_s_rD);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
                        const rB = b2Math_21.b2Rot.MulRV(qB, this.m_lalcB, b2GearJoint.SolvePositionConstraints_s_rB);
                        // JvBD = m_ratio * u;
                        b2Math_21.b2Vec2.MulSV(this.m_ratio, u, JvBD);
                        // JwD = m_ratio * b2Cross(rD, u);
                        JwD = this.m_ratio * b2Math_21.b2Vec2.CrossVV(rD, u);
                        // JwB = m_ratio * b2Cross(rB, u);
                        JwB = this.m_ratio * b2Math_21.b2Vec2.CrossVV(rB, u);
                        mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * JwD * JwD + this.m_iB * JwB * JwB;
                        // b2Vec2 pD = m_localAnchorD - m_lcD;
                        const pD = this.m_lalcD;
                        // b2Vec2 pB = b2MulT(qD, rB + (cB - cD));
                        const pB = b2Math_21.b2Rot.MulTRV(qD, b2Math_21.b2Vec2.AddVV(rB, b2Math_21.b2Vec2.SubVV(cB, cD, b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.s_t0), b2Math_21.b2Vec2.s_t0); // pB uses s_t0
                        // coordinateB = b2Dot(pB - pD, m_localAxisD);
                        coordinateB = b2Math_21.b2Vec2.DotVV(b2Math_21.b2Vec2.SubVV(pB, pD, b2Math_21.b2Vec2.s_t0), this.m_localAxisD);
                    }
                    const C = (coordinateA + this.m_ratio * coordinateB) - this.m_constant;
                    let impulse = 0;
                    if (mass > 0) {
                        impulse = -C / mass;
                    }
                    // cA += m_mA * impulse * JvAC;
                    cA.SelfMulAdd(this.m_mA * impulse, JvAC);
                    aA += this.m_iA * impulse * JwA;
                    // cB += m_mB * impulse * JvBD;
                    cB.SelfMulAdd(this.m_mB * impulse, JvBD);
                    aB += this.m_iB * impulse * JwB;
                    // cC -= m_mC * impulse * JvAC;
                    cC.SelfMulSub(this.m_mC * impulse, JvAC);
                    aC -= this.m_iC * impulse * JwC;
                    // cD -= m_mD * impulse * JvBD;
                    cD.SelfMulSub(this.m_mD * impulse, JvBD);
                    aD -= this.m_iD * impulse * JwD;
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    // data.positions[this.m_indexC].c = cC;
                    data.positions[this.m_indexC].a = aC;
                    // data.positions[this.m_indexD].c = cD;
                    data.positions[this.m_indexD].a = aD;
                    // TODO_ERIN not implemented
                    return linearError < b2Settings.b2_linearSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // b2Vec2 P = m_impulse * m_JvAC;
                    // return inv_dt * P;
                    return b2Math_21.b2Vec2.MulSV(inv_dt * this.m_impulse, this.m_JvAC, out);
                }
                GetReactionTorque(inv_dt) {
                    // float32 L = m_impulse * m_JwA;
                    // return inv_dt * L;
                    return inv_dt * this.m_impulse * this.m_JwA;
                }
                GetJoint1() { return this.m_joint1; }
                GetJoint2() { return this.m_joint2; }
                GetRatio() {
                    return this.m_ratio;
                }
                SetRatio(ratio) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_21.b2IsValid(ratio));
                    }
                    this.m_ratio = ratio;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        const index1 = this.m_joint1.m_index;
                        const index2 = this.m_joint2.m_index;
                        b2Settings.b2Log("  const jd: b2GearJointDef = new b2GearJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.joint1 = joints[%d];\n", index1);
                        b2Settings.b2Log("  jd.joint2 = joints[%d];\n", index2);
                        b2Settings.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2GearJoint.InitVelocityConstraints_s_u = new b2Math_21.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rA = new b2Math_21.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rB = new b2Math_21.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rC = new b2Math_21.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rD = new b2Math_21.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_u = new b2Math_21.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rA = new b2Math_21.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rB = new b2Math_21.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rC = new b2Math_21.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rD = new b2Math_21.b2Vec2();
            exports_27("b2GearJoint", b2GearJoint);
        }
    }
});
System.register("Box2D/Dynamics/Joints/b2MotorJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var b2Settings, b2Math_22, b2Joint_7;
    var b2MotorJointDef, b2MotorJoint;
    return {
        setters:[
            function (b2Settings_23) {
                b2Settings = b2Settings_23;
            },
            function (b2Math_22_1) {
                b2Math_22 = b2Math_22_1;
            },
            function (b2Joint_7_1) {
                b2Joint_7 = b2Joint_7_1;
            }],
        execute: function() {
            b2MotorJointDef = class b2MotorJointDef extends b2Joint_7.b2JointDef {
                constructor() {
                    super(11 /* e_motorJoint */); // base class constructor
                    this.linearOffset = new b2Math_22.b2Vec2(0, 0);
                    this.angularOffset = 0;
                    this.maxForce = 1;
                    this.maxTorque = 1;
                    this.correctionFactor = 0.3;
                }
                Initialize(bA, bB) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    // b2Vec2 xB = bodyB->GetPosition();
                    // linearOffset = bodyA->GetLocalPoint(xB);
                    this.bodyA.GetLocalPoint(this.bodyB.GetPosition(), this.linearOffset);
                    const angleA = this.bodyA.GetAngleRadians();
                    const angleB = this.bodyB.GetAngleRadians();
                    this.angularOffset = angleB - angleA;
                }
            };
            exports_28("b2MotorJointDef", b2MotorJointDef);
            b2MotorJoint = class b2MotorJoint extends b2Joint_7.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    // Solver shared
                    this.m_linearOffset = new b2Math_22.b2Vec2();
                    this.m_angularOffset = 0;
                    this.m_linearImpulse = new b2Math_22.b2Vec2();
                    this.m_angularImpulse = 0;
                    this.m_maxForce = 0;
                    this.m_maxTorque = 0;
                    this.m_correctionFactor = 0.3;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2Math_22.b2Vec2();
                    this.m_rB = new b2Math_22.b2Vec2();
                    this.m_localCenterA = new b2Math_22.b2Vec2();
                    this.m_localCenterB = new b2Math_22.b2Vec2();
                    this.m_linearError = new b2Math_22.b2Vec2();
                    this.m_angularError = 0;
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_linearMass = new b2Math_22.b2Mat22();
                    this.m_angularMass = 0;
                    this.m_qA = new b2Math_22.b2Rot();
                    this.m_qB = new b2Math_22.b2Rot();
                    this.m_K = new b2Math_22.b2Mat22();
                    this.m_linearOffset.Copy(def.linearOffset);
                    this.m_linearImpulse.SetZero();
                    this.m_maxForce = def.maxForce;
                    this.m_maxTorque = def.maxTorque;
                    this.m_correctionFactor = def.correctionFactor;
                }
                GetAnchorA() {
                    return this.m_bodyA.GetPosition();
                }
                GetAnchorB() {
                    return this.m_bodyB.GetPosition();
                }
                GetReactionForce(inv_dt, out) {
                    // return inv_dt * m_linearImpulse;
                    return b2Math_22.b2Vec2.MulSV(inv_dt, this.m_linearImpulse, out);
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_angularImpulse;
                }
                SetLinearOffset(linearOffset) {
                    if (!b2Math_22.b2Vec2.IsEqualToV(linearOffset, this.m_linearOffset)) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_linearOffset.Copy(linearOffset);
                    }
                }
                GetLinearOffset() {
                    return this.m_linearOffset;
                }
                SetAngularOffset(angularOffset) {
                    if (angularOffset !== this.m_angularOffset) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_angularOffset = angularOffset;
                    }
                }
                GetAngularOffset() {
                    return this.m_angularOffset;
                }
                SetMaxForce(force) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_22.b2IsValid(force) && force >= 0);
                    }
                    this.m_maxForce = force;
                }
                GetMaxForce() {
                    return this.m_maxForce;
                }
                SetMaxTorque(torque) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_22.b2IsValid(torque) && torque >= 0);
                    }
                    this.m_maxTorque = torque;
                }
                GetMaxTorque() {
                    return this.m_maxTorque;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cA = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // Compute the effective mass matrix.
                    // this.m_rA = b2Mul(qA, -this.m_localCenterA);
                    const rA = b2Math_22.b2Rot.MulRV(qA, b2Math_22.b2Vec2.NegV(this.m_localCenterA, b2Math_22.b2Vec2.s_t0), this.m_rA);
                    // this.m_rB = b2Mul(qB, -this.m_localCenterB);
                    const rB = b2Math_22.b2Rot.MulRV(qB, b2Math_22.b2Vec2.NegV(this.m_localCenterB, b2Math_22.b2Vec2.s_t0), this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    //     [ 0       -1 0       1]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const K = this.m_K;
                    K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
                    K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
                    K.ey.x = K.ex.y;
                    K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
                    // this.m_linearMass = K.GetInverse();
                    K.GetInverse(this.m_linearMass);
                    this.m_angularMass = iA + iB;
                    if (this.m_angularMass > 0) {
                        this.m_angularMass = 1 / this.m_angularMass;
                    }
                    // this.m_linearError = cB + rB - cA - rA - b2Mul(qA, this.m_linearOffset);
                    b2Math_22.b2Vec2.SubVV(b2Math_22.b2Vec2.SubVV(b2Math_22.b2Vec2.AddVV(cB, rB, b2Math_22.b2Vec2.s_t0), b2Math_22.b2Vec2.AddVV(cA, rA, b2Math_22.b2Vec2.s_t1), b2Math_22.b2Vec2.s_t2), b2Math_22.b2Rot.MulRV(qA, this.m_linearOffset, b2Math_22.b2Vec2.s_t3), this.m_linearError);
                    this.m_angularError = aB - aA - this.m_angularOffset;
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        // this.m_linearImpulse *= data.step.dtRatio;
                        this.m_linearImpulse.SelfMul(data.step.dtRatio);
                        this.m_angularImpulse *= data.step.dtRatio;
                        // b2Vec2 P(this.m_linearImpulse.x, this.m_linearImpulse.y);
                        const P = this.m_linearImpulse;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_22.b2Vec2.CrossVV(rA, P) + this.m_angularImpulse);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_22.b2Vec2.CrossVV(rB, P) + this.m_angularImpulse);
                    }
                    else {
                        this.m_linearImpulse.SetZero();
                        this.m_angularImpulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA; // vA is a reference
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB; // vB is a reference
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const h = data.step.dt;
                    const inv_h = data.step.inv_dt;
                    // Solve angular friction
                    {
                        const Cdot = wB - wA + inv_h * this.m_correctionFactor * this.m_angularError;
                        let impulse = -this.m_angularMass * Cdot;
                        const oldImpulse = this.m_angularImpulse;
                        const maxImpulse = h * this.m_maxTorque;
                        this.m_angularImpulse = b2Math_22.b2Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_angularImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve linear friction
                    {
                        const rA = this.m_rA;
                        const rB = this.m_rB;
                        // b2Vec2 Cdot = vB + b2Vec2.CrossSV(wB, rB) - vA - b2Vec2.CrossSV(wA, rA) + inv_h * this.m_correctionFactor * this.m_linearError;
                        const Cdot_v2 = b2Math_22.b2Vec2.AddVV(b2Math_22.b2Vec2.SubVV(b2Math_22.b2Vec2.AddVV(vB, b2Math_22.b2Vec2.CrossSV(wB, rB, b2Math_22.b2Vec2.s_t0), b2Math_22.b2Vec2.s_t0), b2Math_22.b2Vec2.AddVV(vA, b2Math_22.b2Vec2.CrossSV(wA, rA, b2Math_22.b2Vec2.s_t1), b2Math_22.b2Vec2.s_t1), b2Math_22.b2Vec2.s_t2), b2Math_22.b2Vec2.MulSV(inv_h * this.m_correctionFactor, this.m_linearError, b2Math_22.b2Vec2.s_t3), b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = -b2Mul(this.m_linearMass, Cdot);
                        const impulse_v2 = b2Math_22.b2Mat22.MulMV(this.m_linearMass, Cdot_v2, b2MotorJoint.SolveVelocityConstraints_s_impulse_v2).SelfNeg();
                        // b2Vec2 oldImpulse = this.m_linearImpulse;
                        const oldImpulse_v2 = b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2.Copy(this.m_linearImpulse);
                        // this.m_linearImpulse += impulse;
                        this.m_linearImpulse.SelfAdd(impulse_v2);
                        const maxImpulse = h * this.m_maxForce;
                        if (this.m_linearImpulse.GetLengthSquared() > maxImpulse * maxImpulse) {
                            this.m_linearImpulse.Normalize();
                            // this.m_linearImpulse *= maxImpulse;
                            this.m_linearImpulse.SelfMul(maxImpulse);
                        }
                        // impulse = this.m_linearImpulse - oldImpulse;
                        b2Math_22.b2Vec2.SubVV(this.m_linearImpulse, oldImpulse_v2, impulse_v2);
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulse_v2);
                        // wA -= iA * b2Vec2.CrossVV(rA, impulse);
                        wA -= iA * b2Math_22.b2Vec2.CrossVV(rA, impulse_v2);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulse_v2);
                        // wB += iB * b2Vec2.CrossVV(rB, impulse);
                        wB += iB * b2Math_22.b2Vec2.CrossVV(rB, impulse_v2);
                    }
                    // data.velocities[this.m_indexA].v = vA; // vA is a reference
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB; // vB is a reference
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    return true;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2MotorJointDef = new b2MotorJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.linearOffset.SetXY(%.15f, %.15f);\n", this.m_linearOffset.x, this.m_linearOffset.y);
                        b2Settings.b2Log("  jd.angularOffset = %.15f;\n", this.m_angularOffset);
                        b2Settings.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
                        b2Settings.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
                        b2Settings.b2Log("  jd.correctionFactor = %.15f;\n", this.m_correctionFactor);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2Math_22.b2Vec2();
            b2MotorJoint.SolveVelocityConstraints_s_impulse_v2 = new b2Math_22.b2Vec2();
            b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2 = new b2Math_22.b2Vec2();
            exports_28("b2MotorJoint", b2MotorJoint);
        }
    }
});
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2MouseJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var b2Settings, b2Math_23, b2Joint_8;
    var b2MouseJointDef, b2MouseJoint;
    return {
        setters:[
            function (b2Settings_24) {
                b2Settings = b2Settings_24;
            },
            function (b2Math_23_1) {
                b2Math_23 = b2Math_23_1;
            },
            function (b2Joint_8_1) {
                b2Joint_8 = b2Joint_8_1;
            }],
        execute: function() {
            /// Mouse joint definition. This requires a world target point,
            /// tuning parameters, and the time step.
            b2MouseJointDef = class b2MouseJointDef extends b2Joint_8.b2JointDef {
                constructor() {
                    super(5 /* e_mouseJoint */); // base class constructor
                    this.target = new b2Math_23.b2Vec2();
                    this.maxForce = 0;
                    this.frequencyHz = 5;
                    this.dampingRatio = 0.7;
                }
            };
            exports_29("b2MouseJointDef", b2MouseJointDef);
            b2MouseJoint = class b2MouseJoint extends b2Joint_8.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_localAnchorB = null;
                    this.m_targetA = null;
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_beta = 0;
                    // Solver shared
                    this.m_impulse = null;
                    this.m_maxForce = 0;
                    this.m_gamma = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rB = null;
                    this.m_localCenterB = null;
                    this.m_invMassB = 0;
                    this.m_invIB = 0;
                    this.m_mass = null;
                    this.m_C = null;
                    this.m_qB = null;
                    this.m_lalcB = null;
                    this.m_K = null;
                    this.m_localAnchorB = new b2Math_23.b2Vec2();
                    this.m_targetA = new b2Math_23.b2Vec2();
                    this.m_impulse = new b2Math_23.b2Vec2();
                    this.m_rB = new b2Math_23.b2Vec2();
                    this.m_localCenterB = new b2Math_23.b2Vec2();
                    this.m_mass = new b2Math_23.b2Mat22();
                    this.m_C = new b2Math_23.b2Vec2();
                    this.m_qB = new b2Math_23.b2Rot();
                    this.m_lalcB = new b2Math_23.b2Vec2();
                    this.m_K = new b2Math_23.b2Mat22();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(def.target.IsValid());
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_23.b2IsValid(def.maxForce) && def.maxForce >= 0);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_23.b2IsValid(def.frequencyHz) && def.frequencyHz >= 0);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(b2Math_23.b2IsValid(def.dampingRatio) && def.dampingRatio >= 0);
                    }
                    this.m_targetA.Copy(def.target);
                    b2Math_23.b2Transform.MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
                    this.m_maxForce = def.maxForce;
                    this.m_impulse.SetZero();
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_beta = 0;
                    this.m_gamma = 0;
                }
                SetTarget(target) {
                    if (this.m_bodyB.IsAwake() === false) {
                        this.m_bodyB.SetAwake(true);
                    }
                    this.m_targetA.Copy(target);
                }
                GetTarget() {
                    return this.m_targetA;
                }
                SetMaxForce(maxForce) {
                    this.m_maxForce = maxForce;
                }
                GetMaxForce() {
                    return this.m_maxForce;
                }
                SetFrequency(hz) {
                    this.m_frequencyHz = hz;
                }
                GetFrequency() {
                    return this.m_frequencyHz;
                }
                SetDampingRatio(ratio) {
                    this.m_dampingRatio = ratio;
                }
                GetDampingRatio() {
                    return this.m_dampingRatio;
                }
                InitVelocityConstraints(data) {
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const qB = this.m_qB.SetAngleRadians(aB);
                    const mass = this.m_bodyB.GetMass();
                    // Frequency
                    const omega = 2 * b2Settings.b2_pi * this.m_frequencyHz;
                    // Damping coefficient
                    const d = 2 * mass * this.m_dampingRatio * omega;
                    // Spring stiffness
                    const k = mass * (omega * omega);
                    // magic formulas
                    // gamma has units of inverse mass.
                    // beta has units of inverse time.
                    const h = data.step.dt;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(d + h * k > b2Settings.b2_epsilon);
                    }
                    this.m_gamma = h * (d + h * k);
                    if (this.m_gamma !== 0) {
                        this.m_gamma = 1 / this.m_gamma;
                    }
                    this.m_beta = h * k * this.m_gamma;
                    // Compute the effective mass matrix.
                    b2Math_23.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_23.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
                    //      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
                    //        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
                    const K = this.m_K;
                    K.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
                    K.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
                    K.ey.x = K.ex.y;
                    K.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;
                    K.GetInverse(this.m_mass);
                    // m_C = cB + m_rB - m_targetA;
                    this.m_C.x = cB.x + this.m_rB.x - this.m_targetA.x;
                    this.m_C.y = cB.y + this.m_rB.y - this.m_targetA.y;
                    // m_C *= m_beta;
                    this.m_C.SelfMul(this.m_beta);
                    // Cheat with some damping
                    wB *= 0.98;
                    if (data.step.warmStarting) {
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        // vB += m_invMassB * m_impulse;
                        vB.x += this.m_invMassB * this.m_impulse.x;
                        vB.y += this.m_invMassB * this.m_impulse.y;
                        wB += this.m_invIB * b2Math_23.b2Vec2.CrossVV(this.m_rB, this.m_impulse);
                    }
                    else {
                        this.m_impulse.SetZero();
                    }
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // Cdot = v + cross(w, r)
                    // b2Vec2 Cdot = vB + b2Cross(wB, m_rB);
                    const Cdot = b2Math_23.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2MouseJoint.SolveVelocityConstraints_s_Cdot);
                    //  b2Vec2 impulse = b2Mul(m_mass, -(Cdot + m_C + m_gamma * m_impulse));
                    const impulse = b2Math_23.b2Mat22.MulMV(this.m_mass, b2Math_23.b2Vec2.AddVV(Cdot, b2Math_23.b2Vec2.AddVV(this.m_C, b2Math_23.b2Vec2.MulSV(this.m_gamma, this.m_impulse, b2Math_23.b2Vec2.s_t0), b2Math_23.b2Vec2.s_t0), b2Math_23.b2Vec2.s_t0).SelfNeg(), b2MouseJoint.SolveVelocityConstraints_s_impulse);
                    // b2Vec2 oldImpulse = m_impulse;
                    const oldImpulse = b2MouseJoint.SolveVelocityConstraints_s_oldImpulse.Copy(this.m_impulse);
                    // m_impulse += impulse;
                    this.m_impulse.SelfAdd(impulse);
                    const maxImpulse = data.step.dt * this.m_maxForce;
                    if (this.m_impulse.GetLengthSquared() > maxImpulse * maxImpulse) {
                        this.m_impulse.SelfMul(maxImpulse / this.m_impulse.GetLength());
                    }
                    // impulse = m_impulse - oldImpulse;
                    b2Math_23.b2Vec2.SubVV(this.m_impulse, oldImpulse, impulse);
                    // vB += m_invMassB * impulse;
                    vB.SelfMulAdd(this.m_invMassB, impulse);
                    wB += this.m_invIB * b2Math_23.b2Vec2.CrossVV(this.m_rB, impulse);
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    return true;
                }
                GetAnchorA(out) {
                    return out.Copy(this.m_targetA);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    return b2Math_23.b2Vec2.MulSV(inv_dt, this.m_impulse, out);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        b2Settings.b2Log("Mouse joint dumping is not supported.\n");
                    }
                }
                ShiftOrigin(newOrigin) {
                    this.m_targetA.SelfSub(newOrigin);
                }
            };
            b2MouseJoint.SolveVelocityConstraints_s_Cdot = new b2Math_23.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_impulse = new b2Math_23.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_oldImpulse = new b2Math_23.b2Vec2();
            exports_29("b2MouseJoint", b2MouseJoint);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2PulleyJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var b2Settings, b2Math_24, b2Joint_9;
    var b2_minPulleyLength, b2PulleyJointDef, b2PulleyJoint;
    return {
        setters:[
            function (b2Settings_25) {
                b2Settings = b2Settings_25;
            },
            function (b2Math_24_1) {
                b2Math_24 = b2Math_24_1;
            },
            function (b2Joint_9_1) {
                b2Joint_9 = b2Joint_9_1;
            }],
        execute: function() {
            exports_30("b2_minPulleyLength", b2_minPulleyLength = 2);
            /// Pulley joint definition. This requires two ground anchors,
            /// two dynamic body anchor points, and a pulley ratio.
            b2PulleyJointDef = class b2PulleyJointDef extends b2Joint_9.b2JointDef {
                constructor() {
                    super(4 /* e_pulleyJoint */); // base class constructor
                    this.groundAnchorA = new b2Math_24.b2Vec2(-1, 1);
                    this.groundAnchorB = new b2Math_24.b2Vec2(1, 1);
                    this.localAnchorA = new b2Math_24.b2Vec2(-1, 0);
                    this.localAnchorB = new b2Math_24.b2Vec2(1, 0);
                    this.lengthA = 0;
                    this.lengthB = 0;
                    this.ratio = 1;
                    this.collideConnected = true;
                }
                Initialize(bA, bB, groundA, groundB, anchorA, anchorB, r) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.groundAnchorA.Copy(groundA);
                    this.groundAnchorB.Copy(groundB);
                    this.bodyA.GetLocalPoint(anchorA, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchorB, this.localAnchorB);
                    this.lengthA = b2Math_24.b2Vec2.DistanceVV(anchorA, groundA);
                    this.lengthB = b2Math_24.b2Vec2.DistanceVV(anchorB, groundB);
                    this.ratio = r;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.ratio > b2Settings.b2_epsilon);
                    }
                }
            };
            exports_30("b2PulleyJointDef", b2PulleyJointDef);
            b2PulleyJoint = class b2PulleyJoint extends b2Joint_9.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_groundAnchorA = new b2Math_24.b2Vec2();
                    this.m_groundAnchorB = new b2Math_24.b2Vec2();
                    this.m_lengthA = 0;
                    this.m_lengthB = 0;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_24.b2Vec2();
                    this.m_localAnchorB = new b2Math_24.b2Vec2();
                    this.m_constant = 0;
                    this.m_ratio = 0;
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_uA = new b2Math_24.b2Vec2();
                    this.m_uB = new b2Math_24.b2Vec2();
                    this.m_rA = new b2Math_24.b2Vec2();
                    this.m_rB = new b2Math_24.b2Vec2();
                    this.m_localCenterA = new b2Math_24.b2Vec2();
                    this.m_localCenterB = new b2Math_24.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = 0;
                    this.m_qA = new b2Math_24.b2Rot();
                    this.m_qB = new b2Math_24.b2Rot();
                    this.m_lalcA = new b2Math_24.b2Vec2();
                    this.m_lalcB = new b2Math_24.b2Vec2();
                    this.m_groundAnchorA.Copy(def.groundAnchorA);
                    this.m_groundAnchorB.Copy(def.groundAnchorB);
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_lengthA = def.lengthA;
                    this.m_lengthB = def.lengthB;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(def.ratio !== 0);
                    }
                    this.m_ratio = def.ratio;
                    this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
                    this.m_impulse = 0;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cA = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // b2Rot qA(aA), qB(aB);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_24.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_24.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_24.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_24.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // Get the pulley axes.
                    // m_uA = cA + m_rA - m_groundAnchorA;
                    this.m_uA.Copy(cA).SelfAdd(this.m_rA).SelfSub(this.m_groundAnchorA);
                    // m_uB = cB + m_rB - m_groundAnchorB;
                    this.m_uB.Copy(cB).SelfAdd(this.m_rB).SelfSub(this.m_groundAnchorB);
                    const lengthA = this.m_uA.GetLength();
                    const lengthB = this.m_uB.GetLength();
                    if (lengthA > 10 * b2Settings.b2_linearSlop) {
                        this.m_uA.SelfMul(1 / lengthA);
                    }
                    else {
                        this.m_uA.SetZero();
                    }
                    if (lengthB > 10 * b2Settings.b2_linearSlop) {
                        this.m_uB.SelfMul(1 / lengthB);
                    }
                    else {
                        this.m_uB.SetZero();
                    }
                    // Compute effective mass.
                    const ruA = b2Math_24.b2Vec2.CrossVV(this.m_rA, this.m_uA);
                    const ruB = b2Math_24.b2Vec2.CrossVV(this.m_rB, this.m_uB);
                    const mA = this.m_invMassA + this.m_invIA * ruA * ruA;
                    const mB = this.m_invMassB + this.m_invIB * ruB * ruB;
                    this.m_mass = mA + this.m_ratio * this.m_ratio * mB;
                    if (this.m_mass > 0) {
                        this.m_mass = 1 / this.m_mass;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support variable time steps.
                        this.m_impulse *= data.step.dtRatio;
                        // Warm starting.
                        // b2Vec2 PA = -(m_impulse) * m_uA;
                        const PA = b2Math_24.b2Vec2.MulSV(-(this.m_impulse), this.m_uA, b2PulleyJoint.InitVelocityConstraints_s_PA);
                        // b2Vec2 PB = (-m_ratio * m_impulse) * m_uB;
                        const PB = b2Math_24.b2Vec2.MulSV((-this.m_ratio * this.m_impulse), this.m_uB, b2PulleyJoint.InitVelocityConstraints_s_PB);
                        // vA += m_invMassA * PA;
                        vA.SelfMulAdd(this.m_invMassA, PA);
                        wA += this.m_invIA * b2Math_24.b2Vec2.CrossVV(this.m_rA, PA);
                        // vB += m_invMassB * PB;
                        vB.SelfMulAdd(this.m_invMassB, PB);
                        wB += this.m_invIB * b2Math_24.b2Vec2.CrossVV(this.m_rB, PB);
                    }
                    else {
                        this.m_impulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
                    const vpA = b2Math_24.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2PulleyJoint.SolveVelocityConstraints_s_vpA);
                    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
                    const vpB = b2Math_24.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2PulleyJoint.SolveVelocityConstraints_s_vpB);
                    const Cdot = -b2Math_24.b2Vec2.DotVV(this.m_uA, vpA) - this.m_ratio * b2Math_24.b2Vec2.DotVV(this.m_uB, vpB);
                    const impulse = -this.m_mass * Cdot;
                    this.m_impulse += impulse;
                    // b2Vec2 PA = -impulse * m_uA;
                    const PA = b2Math_24.b2Vec2.MulSV(-impulse, this.m_uA, b2PulleyJoint.SolveVelocityConstraints_s_PA);
                    // b2Vec2 PB = -m_ratio * impulse * m_uB;
                    const PB = b2Math_24.b2Vec2.MulSV(-this.m_ratio * impulse, this.m_uB, b2PulleyJoint.SolveVelocityConstraints_s_PB);
                    // vA += m_invMassA * PA;
                    vA.SelfMulAdd(this.m_invMassA, PA);
                    wA += this.m_invIA * b2Math_24.b2Vec2.CrossVV(this.m_rA, PA);
                    // vB += m_invMassB * PB;
                    vB.SelfMulAdd(this.m_invMassB, PB);
                    wB += this.m_invIB * b2Math_24.b2Vec2.CrossVV(this.m_rB, PB);
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    // b2Rot qA(aA), qB(aB);
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_24.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_24.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_24.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_24.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // Get the pulley axes.
                    // b2Vec2 uA = cA + rA - m_groundAnchorA;
                    const uA = this.m_uA.Copy(cA).SelfAdd(rA).SelfSub(this.m_groundAnchorA);
                    // b2Vec2 uB = cB + rB - m_groundAnchorB;
                    const uB = this.m_uB.Copy(cB).SelfAdd(rB).SelfSub(this.m_groundAnchorB);
                    const lengthA = uA.GetLength();
                    const lengthB = uB.GetLength();
                    if (lengthA > 10 * b2Settings.b2_linearSlop) {
                        uA.SelfMul(1 / lengthA);
                    }
                    else {
                        uA.SetZero();
                    }
                    if (lengthB > 10 * b2Settings.b2_linearSlop) {
                        uB.SelfMul(1 / lengthB);
                    }
                    else {
                        uB.SetZero();
                    }
                    // Compute effective mass.
                    const ruA = b2Math_24.b2Vec2.CrossVV(rA, uA);
                    const ruB = b2Math_24.b2Vec2.CrossVV(rB, uB);
                    const mA = this.m_invMassA + this.m_invIA * ruA * ruA;
                    const mB = this.m_invMassB + this.m_invIB * ruB * ruB;
                    let mass = mA + this.m_ratio * this.m_ratio * mB;
                    if (mass > 0) {
                        mass = 1 / mass;
                    }
                    const C = this.m_constant - lengthA - this.m_ratio * lengthB;
                    const linearError = b2Math_24.b2Abs(C);
                    const impulse = -mass * C;
                    // b2Vec2 PA = -impulse * uA;
                    const PA = b2Math_24.b2Vec2.MulSV(-impulse, uA, b2PulleyJoint.SolvePositionConstraints_s_PA);
                    // b2Vec2 PB = -m_ratio * impulse * uB;
                    const PB = b2Math_24.b2Vec2.MulSV(-this.m_ratio * impulse, uB, b2PulleyJoint.SolvePositionConstraints_s_PB);
                    // cA += m_invMassA * PA;
                    cA.SelfMulAdd(this.m_invMassA, PA);
                    aA += this.m_invIA * b2Math_24.b2Vec2.CrossVV(rA, PA);
                    // cB += m_invMassB * PB;
                    cB.SelfMulAdd(this.m_invMassB, PB);
                    aB += this.m_invIB * b2Math_24.b2Vec2.CrossVV(rB, PB);
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return linearError < b2Settings.b2_linearSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // b2Vec2 P = m_impulse * m_uB;
                    // return inv_dt * P;
                    return out.SetXY(inv_dt * this.m_impulse * this.m_uB.x, inv_dt * this.m_impulse * this.m_uB.y);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                GetGroundAnchorA() {
                    return this.m_groundAnchorA;
                }
                GetGroundAnchorB() {
                    return this.m_groundAnchorB;
                }
                GetLengthA() {
                    return this.m_lengthA;
                }
                GetLengthB() {
                    return this.m_lengthB;
                }
                GetRatio() {
                    return this.m_ratio;
                }
                GetCurrentLengthA() {
                    // b2Vec2 p = m_bodyA->GetWorldPoint(m_localAnchorA);
                    // b2Vec2 s = m_groundAnchorA;
                    // b2Vec2 d = p - s;
                    // return d.Length();
                    const p = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, b2PulleyJoint.GetCurrentLengthA_s_p);
                    const s = this.m_groundAnchorA;
                    return b2Math_24.b2Vec2.DistanceVV(p, s);
                }
                GetCurrentLengthB() {
                    // b2Vec2 p = m_bodyB->GetWorldPoint(m_localAnchorB);
                    // b2Vec2 s = m_groundAnchorB;
                    // b2Vec2 d = p - s;
                    // return d.Length();
                    const p = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, b2PulleyJoint.GetCurrentLengthB_s_p);
                    const s = this.m_groundAnchorB;
                    return b2Math_24.b2Vec2.DistanceVV(p, s);
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2PulleyJointDef = new b2PulleyJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.groundAnchorA.SetXY(%.15f, %.15f);\n", this.m_groundAnchorA.x, this.m_groundAnchorA.y);
                        b2Settings.b2Log("  jd.groundAnchorB.SetXY(%.15f, %.15f);\n", this.m_groundAnchorB.x, this.m_groundAnchorB.y);
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.lengthA = %.15f;\n", this.m_lengthA);
                        b2Settings.b2Log("  jd.lengthB = %.15f;\n", this.m_lengthB);
                        b2Settings.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
                ShiftOrigin(newOrigin) {
                    this.m_groundAnchorA.SelfSub(newOrigin);
                    this.m_groundAnchorB.SelfSub(newOrigin);
                }
            };
            b2PulleyJoint.InitVelocityConstraints_s_PA = new b2Math_24.b2Vec2();
            b2PulleyJoint.InitVelocityConstraints_s_PB = new b2Math_24.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_vpA = new b2Math_24.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_vpB = new b2Math_24.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_PA = new b2Math_24.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_PB = new b2Math_24.b2Vec2();
            b2PulleyJoint.SolvePositionConstraints_s_PA = new b2Math_24.b2Vec2();
            b2PulleyJoint.SolvePositionConstraints_s_PB = new b2Math_24.b2Vec2();
            b2PulleyJoint.GetCurrentLengthA_s_p = new b2Math_24.b2Vec2();
            b2PulleyJoint.GetCurrentLengthB_s_p = new b2Math_24.b2Vec2();
            exports_30("b2PulleyJoint", b2PulleyJoint);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2RopeJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var b2Settings, b2Math_25, b2Joint_10;
    var b2RopeJointDef, b2RopeJoint;
    return {
        setters:[
            function (b2Settings_26) {
                b2Settings = b2Settings_26;
            },
            function (b2Math_25_1) {
                b2Math_25 = b2Math_25_1;
            },
            function (b2Joint_10_1) {
                b2Joint_10 = b2Joint_10_1;
            }],
        execute: function() {
            /// Rope joint definition. This requires two body anchor points and
            /// a maximum lengths.
            /// Note: by default the connected objects will not collide.
            /// see collideConnected in b2JointDef.
            b2RopeJointDef = class b2RopeJointDef extends b2Joint_10.b2JointDef {
                constructor() {
                    super(10 /* e_ropeJoint */); // base class constructor
                    this.localAnchorA = new b2Math_25.b2Vec2(-1, 0);
                    this.localAnchorB = new b2Math_25.b2Vec2(1, 0);
                    this.maxLength = 0;
                }
            };
            exports_31("b2RopeJointDef", b2RopeJointDef);
            b2RopeJoint = class b2RopeJoint extends b2Joint_10.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    // Solver shared
                    this.m_localAnchorA = new b2Math_25.b2Vec2();
                    this.m_localAnchorB = new b2Math_25.b2Vec2();
                    this.m_maxLength = 0;
                    this.m_length = 0;
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_u = new b2Math_25.b2Vec2();
                    this.m_rA = new b2Math_25.b2Vec2();
                    this.m_rB = new b2Math_25.b2Vec2();
                    this.m_localCenterA = new b2Math_25.b2Vec2();
                    this.m_localCenterB = new b2Math_25.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = 0;
                    this.m_state = 0 /* e_inactiveLimit */;
                    this.m_qA = new b2Math_25.b2Rot();
                    this.m_qB = new b2Math_25.b2Rot();
                    this.m_lalcA = new b2Math_25.b2Vec2();
                    this.m_lalcB = new b2Math_25.b2Vec2();
                    this.m_localAnchorA = def.localAnchorA.Clone();
                    this.m_localAnchorB = def.localAnchorB.Clone();
                    this.m_maxLength = def.maxLength;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cA = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // this.m_rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
                    b2Math_25.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_25.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // this.m_rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
                    b2Math_25.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_25.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // this.m_u = cB + this.m_rB - cA - this.m_rA;
                    this.m_u.Copy(cB).SelfAdd(this.m_rB).SelfSub(cA).SelfSub(this.m_rA);
                    this.m_length = this.m_u.GetLength();
                    const C = this.m_length - this.m_maxLength;
                    if (C > 0) {
                        this.m_state = 2 /* e_atUpperLimit */;
                    }
                    else {
                        this.m_state = 0 /* e_inactiveLimit */;
                    }
                    if (this.m_length > b2Settings.b2_linearSlop) {
                        this.m_u.SelfMul(1 / this.m_length);
                    }
                    else {
                        this.m_u.SetZero();
                        this.m_mass = 0;
                        this.m_impulse = 0;
                        return;
                    }
                    // Compute effective mass.
                    const crA = b2Math_25.b2Vec2.CrossVV(this.m_rA, this.m_u);
                    const crB = b2Math_25.b2Vec2.CrossVV(this.m_rB, this.m_u);
                    const invMass = this.m_invMassA + this.m_invIA * crA * crA + this.m_invMassB + this.m_invIB * crB * crB;
                    this.m_mass = invMass !== 0 ? 1 / invMass : 0;
                    if (data.step.warmStarting) {
                        // Scale the impulse to support a variable time step.
                        this.m_impulse *= data.step.dtRatio;
                        // b2Vec2 P = m_impulse * m_u;
                        const P = b2Math_25.b2Vec2.MulSV(this.m_impulse, this.m_u, b2RopeJoint.InitVelocityConstraints_s_P);
                        // vA -= m_invMassA * P;
                        vA.SelfMulSub(this.m_invMassA, P);
                        wA -= this.m_invIA * b2Math_25.b2Vec2.CrossVV(this.m_rA, P);
                        // vB += m_invMassB * P;
                        vB.SelfMulAdd(this.m_invMassB, P);
                        wB += this.m_invIB * b2Math_25.b2Vec2.CrossVV(this.m_rB, P);
                    }
                    else {
                        this.m_impulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // Cdot = dot(u, v + cross(w, r))
                    // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
                    const vpA = b2Math_25.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2RopeJoint.SolveVelocityConstraints_s_vpA);
                    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
                    const vpB = b2Math_25.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2RopeJoint.SolveVelocityConstraints_s_vpB);
                    // float32 C = m_length - m_maxLength;
                    const C = this.m_length - this.m_maxLength;
                    // float32 Cdot = b2Dot(m_u, vpB - vpA);
                    let Cdot = b2Math_25.b2Vec2.DotVV(this.m_u, b2Math_25.b2Vec2.SubVV(vpB, vpA, b2Math_25.b2Vec2.s_t0));
                    // Predictive constraint.
                    if (C < 0) {
                        Cdot += data.step.inv_dt * C;
                    }
                    let impulse = -this.m_mass * Cdot;
                    const oldImpulse = this.m_impulse;
                    this.m_impulse = b2Math_25.b2Min(0, this.m_impulse + impulse);
                    impulse = this.m_impulse - oldImpulse;
                    // b2Vec2 P = impulse * m_u;
                    const P = b2Math_25.b2Vec2.MulSV(impulse, this.m_u, b2RopeJoint.SolveVelocityConstraints_s_P);
                    // vA -= m_invMassA * P;
                    vA.SelfMulSub(this.m_invMassA, P);
                    wA -= this.m_invIA * b2Math_25.b2Vec2.CrossVV(this.m_rA, P);
                    // vB += m_invMassB * P;
                    vB.SelfMulAdd(this.m_invMassB, P);
                    wB += this.m_invIB * b2Math_25.b2Vec2.CrossVV(this.m_rB, P);
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // b2Vec2 rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
                    b2Math_25.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_25.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
                    b2Math_25.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_25.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 u = cB + rB - cA - rA;
                    const u = this.m_u.Copy(cB).SelfAdd(rB).SelfSub(cA).SelfSub(rA);
                    const length = u.Normalize();
                    let C = length - this.m_maxLength;
                    C = b2Math_25.b2Clamp(C, 0, b2Settings.b2_maxLinearCorrection);
                    const impulse = -this.m_mass * C;
                    // b2Vec2 P = impulse * u;
                    const P = b2Math_25.b2Vec2.MulSV(impulse, u, b2RopeJoint.SolvePositionConstraints_s_P);
                    // cA -= m_invMassA * P;
                    cA.SelfMulSub(this.m_invMassA, P);
                    aA -= this.m_invIA * b2Math_25.b2Vec2.CrossVV(rA, P);
                    // cB += m_invMassB * P;
                    cB.SelfMulAdd(this.m_invMassB, P);
                    aB += this.m_invIB * b2Math_25.b2Vec2.CrossVV(rB, P);
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return length - this.m_maxLength < b2Settings.b2_linearSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    const F = b2Math_25.b2Vec2.MulSV((inv_dt * this.m_impulse), this.m_u, out);
                    return F;
                    // return out.SetXY(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                SetMaxLength(length) { this.m_maxLength = length; }
                GetMaxLength() {
                    return this.m_maxLength;
                }
                GetLimitState() {
                    return this.m_state;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2RopeJointDef = new b2RopeJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.maxLength = %.15f;\n", this.m_maxLength);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2RopeJoint.InitVelocityConstraints_s_P = new b2Math_25.b2Vec2();
            b2RopeJoint.SolveVelocityConstraints_s_vpA = new b2Math_25.b2Vec2();
            b2RopeJoint.SolveVelocityConstraints_s_vpB = new b2Math_25.b2Vec2();
            b2RopeJoint.SolveVelocityConstraints_s_P = new b2Math_25.b2Vec2();
            b2RopeJoint.SolvePositionConstraints_s_P = new b2Math_25.b2Vec2();
            exports_31("b2RopeJoint", b2RopeJoint);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2WeldJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var b2Settings, b2Math_26, b2Joint_11;
    var b2WeldJointDef, b2WeldJoint;
    return {
        setters:[
            function (b2Settings_27) {
                b2Settings = b2Settings_27;
            },
            function (b2Math_26_1) {
                b2Math_26 = b2Math_26_1;
            },
            function (b2Joint_11_1) {
                b2Joint_11 = b2Joint_11_1;
            }],
        execute: function() {
            /// Weld joint definition. You need to specify local anchor points
            /// where they are attached and the relative body angle. The position
            /// of the anchor points is important for computing the reaction torque.
            b2WeldJointDef = class b2WeldJointDef extends b2Joint_11.b2JointDef {
                constructor() {
                    super(8 /* e_weldJoint */); // base class constructor
                    this.localAnchorA = new b2Math_26.b2Vec2();
                    this.localAnchorB = new b2Math_26.b2Vec2();
                    this.referenceAngle = 0;
                    this.frequencyHz = 0;
                    this.dampingRatio = 0;
                }
                Initialize(bA, bB, anchor) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians();
                }
            };
            exports_32("b2WeldJointDef", b2WeldJointDef);
            b2WeldJoint = class b2WeldJoint extends b2Joint_11.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_bias = 0;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_26.b2Vec2();
                    this.m_localAnchorB = new b2Math_26.b2Vec2();
                    this.m_referenceAngle = 0;
                    this.m_gamma = 0;
                    this.m_impulse = new b2Math_26.b2Vec3(0, 0, 0);
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2Math_26.b2Vec2();
                    this.m_rB = new b2Math_26.b2Vec2();
                    this.m_localCenterA = new b2Math_26.b2Vec2();
                    this.m_localCenterB = new b2Math_26.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = new b2Math_26.b2Mat33();
                    this.m_qA = new b2Math_26.b2Rot();
                    this.m_qB = new b2Math_26.b2Rot();
                    this.m_lalcA = new b2Math_26.b2Vec2();
                    this.m_lalcB = new b2Math_26.b2Vec2();
                    this.m_K = new b2Math_26.b2Mat33();
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_referenceAngle = def.referenceAngle;
                    this.m_impulse.SetZero();
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_26.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_26.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_26.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_26.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    //     [ 0       -1 0       1]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const K = this.m_K;
                    K.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
                    K.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
                    K.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
                    K.ex.y = K.ey.x;
                    K.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
                    K.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
                    K.ex.z = K.ez.x;
                    K.ey.z = K.ez.y;
                    K.ez.z = iA + iB;
                    if (this.m_frequencyHz > 0) {
                        K.GetInverse22(this.m_mass);
                        let invM = iA + iB;
                        const m = invM > 0 ? 1 / invM : 0;
                        const C = aB - aA - this.m_referenceAngle;
                        // Frequency
                        const omega = 2 * b2Settings.b2_pi * this.m_frequencyHz;
                        // Damping coefficient
                        const d = 2 * m * this.m_dampingRatio * omega;
                        // Spring stiffness
                        const k = m * omega * omega;
                        // magic formulas
                        const h = data.step.dt;
                        this.m_gamma = h * (d + h * k);
                        this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0;
                        this.m_bias = C * h * k * this.m_gamma;
                        invM += this.m_gamma;
                        this.m_mass.ez.z = invM !== 0 ? 1 / invM : 0;
                    }
                    else {
                        K.GetSymInverse33(this.m_mass);
                        this.m_gamma = 0;
                        this.m_bias = 0;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        // b2Vec2 P(m_impulse.x, m_impulse.y);
                        const P = b2WeldJoint.InitVelocityConstraints_s_P.SetXY(this.m_impulse.x, this.m_impulse.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_26.b2Vec2.CrossVV(this.m_rA, P) + this.m_impulse.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_26.b2Vec2.CrossVV(this.m_rB, P) + this.m_impulse.z);
                    }
                    else {
                        this.m_impulse.SetZero();
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    if (this.m_frequencyHz > 0) {
                        const Cdot2 = wB - wA;
                        const impulse2 = -this.m_mass.ez.z * (Cdot2 + this.m_bias + this.m_gamma * this.m_impulse.z);
                        this.m_impulse.z += impulse2;
                        wA -= iA * impulse2;
                        wB += iB * impulse2;
                        // b2Vec2 Cdot1 = vB + b2Vec2.CrossSV(wB, this.m_rB) - vA - b2Vec2.CrossSV(wA, this.m_rA);
                        const Cdot1 = b2Math_26.b2Vec2.SubVV(b2Math_26.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_26.b2Vec2.s_t0), b2Math_26.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_26.b2Vec2.s_t1), b2WeldJoint.SolveVelocityConstraints_s_Cdot1);
                        // b2Vec2 impulse1 = -b2Mul22(m_mass, Cdot1);
                        const impulse1 = b2Math_26.b2Mat33.MulM33XY(this.m_mass, Cdot1.x, Cdot1.y, b2WeldJoint.SolveVelocityConstraints_s_impulse1).SelfNeg();
                        this.m_impulse.x += impulse1.x;
                        this.m_impulse.y += impulse1.y;
                        // b2Vec2 P = impulse1;
                        const P = impulse1;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        // wA -= iA * b2Cross(m_rA, P);
                        wA -= iA * b2Math_26.b2Vec2.CrossVV(this.m_rA, P);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        // wB += iB * b2Cross(m_rB, P);
                        wB += iB * b2Math_26.b2Vec2.CrossVV(this.m_rB, P);
                    }
                    else {
                        // b2Vec2 Cdot1 = vB + b2Cross(wB, this.m_rB) - vA - b2Cross(wA, this.m_rA);
                        const Cdot1 = b2Math_26.b2Vec2.SubVV(b2Math_26.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_26.b2Vec2.s_t0), b2Math_26.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_26.b2Vec2.s_t1), b2WeldJoint.SolveVelocityConstraints_s_Cdot1);
                        const Cdot2 = wB - wA;
                        // b2Vec3 const Cdot(Cdot1.x, Cdot1.y, Cdot2);
                        // b2Vec3 impulse = -b2Mul(m_mass, Cdot);
                        const impulse = b2Math_26.b2Mat33.MulM33XYZ(this.m_mass, Cdot1.x, Cdot1.y, Cdot2, b2WeldJoint.SolveVelocityConstraints_s_impulse).SelfNeg();
                        this.m_impulse.SelfAdd(impulse);
                        // b2Vec2 P(impulse.x, impulse.y);
                        const P = b2WeldJoint.SolveVelocityConstraints_s_P.SetXY(impulse.x, impulse.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_26.b2Vec2.CrossVV(this.m_rA, P) + impulse.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_26.b2Vec2.CrossVV(this.m_rB, P) + impulse.z);
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_26.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_26.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_26.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_26.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    let positionError, angularError;
                    const K = this.m_K;
                    K.ex.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
                    K.ey.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
                    K.ez.x = -rA.y * iA - rB.y * iB;
                    K.ex.y = K.ey.x;
                    K.ey.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
                    K.ez.y = rA.x * iA + rB.x * iB;
                    K.ex.z = K.ez.x;
                    K.ey.z = K.ez.y;
                    K.ez.z = iA + iB;
                    if (this.m_frequencyHz > 0) {
                        // b2Vec2 C1 =  cB + rB - cA - rA;
                        const C1 = b2Math_26.b2Vec2.SubVV(b2Math_26.b2Vec2.AddVV(cB, rB, b2Math_26.b2Vec2.s_t0), b2Math_26.b2Vec2.AddVV(cA, rA, b2Math_26.b2Vec2.s_t1), b2WeldJoint.SolvePositionConstraints_s_C1);
                        positionError = C1.GetLength();
                        angularError = 0;
                        // b2Vec2 P = -K.Solve22(C1);
                        const P = K.Solve22(C1.x, C1.y, b2WeldJoint.SolvePositionConstraints_s_P).SelfNeg();
                        // cA -= mA * P;
                        cA.SelfMulSub(mA, P);
                        aA -= iA * b2Math_26.b2Vec2.CrossVV(rA, P);
                        // cB += mB * P;
                        cB.SelfMulAdd(mB, P);
                        aB += iB * b2Math_26.b2Vec2.CrossVV(rB, P);
                    }
                    else {
                        // b2Vec2 C1 =  cB + rB - cA - rA;
                        const C1 = b2Math_26.b2Vec2.SubVV(b2Math_26.b2Vec2.AddVV(cB, rB, b2Math_26.b2Vec2.s_t0), b2Math_26.b2Vec2.AddVV(cA, rA, b2Math_26.b2Vec2.s_t1), b2WeldJoint.SolvePositionConstraints_s_C1);
                        const C2 = aB - aA - this.m_referenceAngle;
                        positionError = C1.GetLength();
                        angularError = b2Math_26.b2Abs(C2);
                        // b2Vec3 C(C1.x, C1.y, C2);
                        // b2Vec3 impulse = -K.Solve33(C);
                        const impulse = K.Solve33(C1.x, C1.y, C2, b2WeldJoint.SolvePositionConstraints_s_impulse).SelfNeg();
                        // b2Vec2 P(impulse.x, impulse.y);
                        const P = b2WeldJoint.SolvePositionConstraints_s_P.SetXY(impulse.x, impulse.y);
                        // cA -= mA * P;
                        cA.SelfMulSub(mA, P);
                        aA -= iA * (b2Math_26.b2Vec2.CrossVV(this.m_rA, P) + impulse.z);
                        // cB += mB * P;
                        cB.SelfMulAdd(mB, P);
                        aB += iB * (b2Math_26.b2Vec2.CrossVV(this.m_rB, P) + impulse.z);
                    }
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // b2Vec2 P(this.m_impulse.x, this.m_impulse.y);
                    // return inv_dt * P;
                    return out.SetXY(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_impulse.z;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetReferenceAngle() { return this.m_referenceAngle; }
                SetFrequency(hz) { this.m_frequencyHz = hz; }
                GetFrequency() { return this.m_frequencyHz; }
                SetDampingRatio(ratio) { this.m_dampingRatio = ratio; }
                GetDampingRatio() { return this.m_dampingRatio; }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2WeldJointDef = new b2WeldJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                        b2Settings.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                        b2Settings.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2WeldJoint.InitVelocityConstraints_s_P = new b2Math_26.b2Vec2();
            b2WeldJoint.SolveVelocityConstraints_s_Cdot1 = new b2Math_26.b2Vec2();
            b2WeldJoint.SolveVelocityConstraints_s_impulse1 = new b2Math_26.b2Vec2();
            b2WeldJoint.SolveVelocityConstraints_s_impulse = new b2Math_26.b2Vec3();
            b2WeldJoint.SolveVelocityConstraints_s_P = new b2Math_26.b2Vec2();
            b2WeldJoint.SolvePositionConstraints_s_C1 = new b2Math_26.b2Vec2();
            b2WeldJoint.SolvePositionConstraints_s_P = new b2Math_26.b2Vec2();
            b2WeldJoint.SolvePositionConstraints_s_impulse = new b2Math_26.b2Vec3();
            exports_32("b2WeldJoint", b2WeldJoint);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Joints/b2WheelJoint", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Dynamics/Joints/b2Joint"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var b2Settings, b2Math_27, b2Joint_12;
    var b2WheelJointDef, b2WheelJoint;
    return {
        setters:[
            function (b2Settings_28) {
                b2Settings = b2Settings_28;
            },
            function (b2Math_27_1) {
                b2Math_27 = b2Math_27_1;
            },
            function (b2Joint_12_1) {
                b2Joint_12 = b2Joint_12_1;
            }],
        execute: function() {
            /// Wheel joint definition. This requires defining a line of
            /// motion using an axis and an anchor point. The definition uses local
            /// anchor points and a local axis so that the initial configuration
            /// can violate the constraint slightly. The joint translation is zero
            /// when the local anchor points coincide in world space. Using local
            /// anchors and a local axis helps when saving and loading a game.
            b2WheelJointDef = class b2WheelJointDef extends b2Joint_12.b2JointDef {
                constructor() {
                    super(7 /* e_wheelJoint */); // base class constructor
                    this.localAnchorA = new b2Math_27.b2Vec2(0, 0);
                    this.localAnchorB = new b2Math_27.b2Vec2(0, 0);
                    this.localAxisA = new b2Math_27.b2Vec2(1, 0);
                    this.enableMotor = false;
                    this.maxMotorTorque = 0;
                    this.motorSpeed = 0;
                    this.frequencyHz = 2;
                    this.dampingRatio = 0.7;
                }
                Initialize(bA, bB, anchor, axis) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.bodyA.GetLocalVector(axis, this.localAxisA);
                }
            };
            exports_33("b2WheelJointDef", b2WheelJointDef);
            b2WheelJoint = class b2WheelJoint extends b2Joint_12.b2Joint {
                constructor(def) {
                    super(def); // base class constructor
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_27.b2Vec2();
                    this.m_localAnchorB = new b2Math_27.b2Vec2();
                    this.m_localXAxisA = new b2Math_27.b2Vec2();
                    this.m_localYAxisA = new b2Math_27.b2Vec2();
                    this.m_impulse = 0;
                    this.m_motorImpulse = 0;
                    this.m_springImpulse = 0;
                    this.m_maxMotorTorque = 0;
                    this.m_motorSpeed = 0;
                    this.m_enableMotor = false;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_localCenterA = new b2Math_27.b2Vec2();
                    this.m_localCenterB = new b2Math_27.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_ax = new b2Math_27.b2Vec2();
                    this.m_ay = new b2Math_27.b2Vec2();
                    this.m_sAx = 0;
                    this.m_sBx = 0;
                    this.m_sAy = 0;
                    this.m_sBy = 0;
                    this.m_mass = 0;
                    this.m_motorMass = 0;
                    this.m_springMass = 0;
                    this.m_bias = 0;
                    this.m_gamma = 0;
                    this.m_qA = new b2Math_27.b2Rot();
                    this.m_qB = new b2Math_27.b2Rot();
                    this.m_lalcA = new b2Math_27.b2Vec2();
                    this.m_lalcB = new b2Math_27.b2Vec2();
                    this.m_rA = new b2Math_27.b2Vec2();
                    this.m_rB = new b2Math_27.b2Vec2();
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_localXAxisA.Copy(def.localAxisA);
                    b2Math_27.b2Vec2.CrossOneV(this.m_localXAxisA, this.m_localYAxisA);
                    this.m_maxMotorTorque = def.maxMotorTorque;
                    this.m_motorSpeed = def.motorSpeed;
                    this.m_enableMotor = def.enableMotor;
                    this.m_ax.SetZero();
                    this.m_ay.SetZero();
                }
                GetMotorSpeed() {
                    return this.m_motorSpeed;
                }
                GetMaxMotorTorque() {
                    return this.m_maxMotorTorque;
                }
                SetSpringFrequencyHz(hz) {
                    this.m_frequencyHz = hz;
                }
                GetSpringFrequencyHz() {
                    return this.m_frequencyHz;
                }
                SetSpringDampingRatio(ratio) {
                    this.m_dampingRatio = ratio;
                }
                GetSpringDampingRatio() {
                    return this.m_dampingRatio;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const cA = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // Compute the effective masses.
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_27.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_27.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_27.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_27.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = cB + rB - cA - rA;
                    const d = b2Math_27.b2Vec2.SubVV(b2Math_27.b2Vec2.AddVV(cB, rB, b2Math_27.b2Vec2.s_t0), b2Math_27.b2Vec2.AddVV(cA, rA, b2Math_27.b2Vec2.s_t1), b2WheelJoint.InitVelocityConstraints_s_d);
                    // Point to line constraint
                    {
                        // m_ay = b2Mul(qA, m_localYAxisA);
                        b2Math_27.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_ay);
                        // m_sAy = b2Cross(d + rA, m_ay);
                        this.m_sAy = b2Math_27.b2Vec2.CrossVV(b2Math_27.b2Vec2.AddVV(d, rA, b2Math_27.b2Vec2.s_t0), this.m_ay);
                        // m_sBy = b2Cross(rB, m_ay);
                        this.m_sBy = b2Math_27.b2Vec2.CrossVV(rB, this.m_ay);
                        this.m_mass = mA + mB + iA * this.m_sAy * this.m_sAy + iB * this.m_sBy * this.m_sBy;
                        if (this.m_mass > 0) {
                            this.m_mass = 1 / this.m_mass;
                        }
                    }
                    // Spring constraint
                    this.m_springMass = 0;
                    this.m_bias = 0;
                    this.m_gamma = 0;
                    if (this.m_frequencyHz > 0) {
                        // m_ax = b2Mul(qA, m_localXAxisA);
                        b2Math_27.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_ax);
                        // m_sAx = b2Cross(d + rA, m_ax);
                        this.m_sAx = b2Math_27.b2Vec2.CrossVV(b2Math_27.b2Vec2.AddVV(d, rA, b2Math_27.b2Vec2.s_t0), this.m_ax);
                        // m_sBx = b2Cross(rB, m_ax);
                        this.m_sBx = b2Math_27.b2Vec2.CrossVV(rB, this.m_ax);
                        const invMass = mA + mB + iA * this.m_sAx * this.m_sAx + iB * this.m_sBx * this.m_sBx;
                        if (invMass > 0) {
                            this.m_springMass = 1 / invMass;
                            const C = b2Math_27.b2Vec2.DotVV(d, this.m_ax);
                            // Frequency
                            const omega = 2 * b2Settings.b2_pi * this.m_frequencyHz;
                            // Damping coefficient
                            const dc = 2 * this.m_springMass * this.m_dampingRatio * omega;
                            // Spring stiffness
                            const k = this.m_springMass * omega * omega;
                            // magic formulas
                            const h = data.step.dt;
                            this.m_gamma = h * (dc + h * k);
                            if (this.m_gamma > 0) {
                                this.m_gamma = 1 / this.m_gamma;
                            }
                            this.m_bias = C * h * k * this.m_gamma;
                            this.m_springMass = invMass + this.m_gamma;
                            if (this.m_springMass > 0) {
                                this.m_springMass = 1 / this.m_springMass;
                            }
                        }
                    }
                    else {
                        this.m_springImpulse = 0;
                    }
                    // Rotational motor
                    if (this.m_enableMotor) {
                        this.m_motorMass = iA + iB;
                        if (this.m_motorMass > 0) {
                            this.m_motorMass = 1 / this.m_motorMass;
                        }
                    }
                    else {
                        this.m_motorMass = 0;
                        this.m_motorImpulse = 0;
                    }
                    if (data.step.warmStarting) {
                        // Account for variable time step.
                        this.m_impulse *= data.step.dtRatio;
                        this.m_springImpulse *= data.step.dtRatio;
                        this.m_motorImpulse *= data.step.dtRatio;
                        // b2Vec2 P = m_impulse * m_ay + m_springImpulse * m_ax;
                        const P = b2Math_27.b2Vec2.AddVV(b2Math_27.b2Vec2.MulSV(this.m_impulse, this.m_ay, b2Math_27.b2Vec2.s_t0), b2Math_27.b2Vec2.MulSV(this.m_springImpulse, this.m_ax, b2Math_27.b2Vec2.s_t1), b2WheelJoint.InitVelocityConstraints_s_P);
                        // float32 LA = m_impulse * m_sAy + m_springImpulse * m_sAx + m_motorImpulse;
                        const LA = this.m_impulse * this.m_sAy + this.m_springImpulse * this.m_sAx + this.m_motorImpulse;
                        // float32 LB = m_impulse * m_sBy + m_springImpulse * m_sBx + m_motorImpulse;
                        const LB = this.m_impulse * this.m_sBy + this.m_springImpulse * this.m_sBx + this.m_motorImpulse;
                        // vA -= m_invMassA * P;
                        vA.SelfMulSub(this.m_invMassA, P);
                        wA -= this.m_invIA * LA;
                        // vB += m_invMassB * P;
                        vB.SelfMulAdd(this.m_invMassB, P);
                        wB += this.m_invIB * LB;
                    }
                    else {
                        this.m_impulse = 0;
                        this.m_springImpulse = 0;
                        this.m_motorImpulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // Solve spring constraint
                    if (true) {
                        const Cdot = b2Math_27.b2Vec2.DotVV(this.m_ax, b2Math_27.b2Vec2.SubVV(vB, vA, b2Math_27.b2Vec2.s_t0)) + this.m_sBx * wB - this.m_sAx * wA;
                        const impulse = -this.m_springMass * (Cdot + this.m_bias + this.m_gamma * this.m_springImpulse);
                        this.m_springImpulse += impulse;
                        // b2Vec2 P = impulse * m_ax;
                        const P = b2Math_27.b2Vec2.MulSV(impulse, this.m_ax, b2WheelJoint.SolveVelocityConstraints_s_P);
                        const LA = impulse * this.m_sAx;
                        const LB = impulse * this.m_sBx;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    // Solve rotational motor constraint
                    if (true) {
                        const Cdot = wB - wA - this.m_motorSpeed;
                        let impulse = -this.m_motorMass * Cdot;
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorTorque;
                        this.m_motorImpulse = b2Math_27.b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve point to line constraint
                    if (true) {
                        const Cdot = b2Math_27.b2Vec2.DotVV(this.m_ay, b2Math_27.b2Vec2.SubVV(vB, vA, b2Math_27.b2Vec2.s_t0)) + this.m_sBy * wB - this.m_sAy * wA;
                        const impulse = -this.m_mass * Cdot;
                        this.m_impulse += impulse;
                        // b2Vec2 P = impulse * m_ay;
                        const P = b2Math_27.b2Vec2.MulSV(impulse, this.m_ay, b2WheelJoint.SolveVelocityConstraints_s_P);
                        const LA = impulse * this.m_sAy;
                        const LB = impulse * this.m_sBy;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    const qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_27.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_27.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_27.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_27.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = (cB - cA) + rB - rA;
                    const d = b2Math_27.b2Vec2.AddVV(b2Math_27.b2Vec2.SubVV(cB, cA, b2Math_27.b2Vec2.s_t0), b2Math_27.b2Vec2.SubVV(rB, rA, b2Math_27.b2Vec2.s_t1), b2WheelJoint.SolvePositionConstraints_s_d);
                    // b2Vec2 ay = b2Mul(qA, m_localYAxisA);
                    const ay = b2Math_27.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_ay);
                    // float32 sAy = b2Cross(d + rA, ay);
                    const sAy = b2Math_27.b2Vec2.CrossVV(b2Math_27.b2Vec2.AddVV(d, rA, b2Math_27.b2Vec2.s_t0), ay);
                    // float32 sBy = b2Cross(rB, ay);
                    const sBy = b2Math_27.b2Vec2.CrossVV(rB, ay);
                    // float32 C = b2Dot(d, ay);
                    const C = b2Math_27.b2Vec2.DotVV(d, this.m_ay);
                    const k = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy;
                    let impulse;
                    if (k !== 0) {
                        impulse = -C / k;
                    }
                    else {
                        impulse = 0;
                    }
                    // b2Vec2 P = impulse * ay;
                    const P = b2Math_27.b2Vec2.MulSV(impulse, ay, b2WheelJoint.SolvePositionConstraints_s_P);
                    const LA = impulse * sAy;
                    const LB = impulse * sBy;
                    // cA -= m_invMassA * P;
                    cA.SelfMulSub(this.m_invMassA, P);
                    aA -= this.m_invIA * LA;
                    // cB += m_invMassB * P;
                    cB.SelfMulAdd(this.m_invMassB, P);
                    aB += this.m_invIB * LB;
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return b2Math_27.b2Abs(C) <= b2Settings.b2_linearSlop;
                }
                GetDefinition(def) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(false);
                    } // TODO
                    return def;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // return inv_dt * (m_impulse * m_ay + m_springImpulse * m_ax);
                    out.x = inv_dt * (this.m_impulse * this.m_ay.x + this.m_springImpulse * this.m_ax.x);
                    out.y = inv_dt * (this.m_impulse * this.m_ay.y + this.m_springImpulse * this.m_ax.y);
                    return out;
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetLocalAxisA() { return this.m_localXAxisA; }
                GetJointTranslation() {
                    const bA = this.m_bodyA;
                    const bB = this.m_bodyB;
                    const pA = bA.GetWorldPoint(this.m_localAnchorA, new b2Math_27.b2Vec2());
                    const pB = bB.GetWorldPoint(this.m_localAnchorB, new b2Math_27.b2Vec2());
                    const d = b2Math_27.b2Vec2.SubVV(pB, pA, new b2Math_27.b2Vec2());
                    const axis = bA.GetWorldVector(this.m_localXAxisA, new b2Math_27.b2Vec2());
                    const translation = b2Math_27.b2Vec2.DotVV(d, axis);
                    return translation;
                }
                GetJointSpeed() {
                    const wA = this.m_bodyA.m_angularVelocity;
                    const wB = this.m_bodyB.m_angularVelocity;
                    return wB - wA;
                }
                IsMotorEnabled() {
                    return this.m_enableMotor;
                }
                EnableMotor(flag) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_enableMotor = flag;
                }
                SetMotorSpeed(speed) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_motorSpeed = speed;
                }
                SetMaxMotorTorque(force) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_maxMotorTorque = force;
                }
                GetMotorTorque(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                Dump() {
                    if (b2Settings.DEBUG) {
                        const indexA = this.m_bodyA.m_islandIndex;
                        const indexB = this.m_bodyB.m_islandIndex;
                        b2Settings.b2Log("  const jd: b2WheelJointDef = new b2WheelJointDef();\n");
                        b2Settings.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                        b2Settings.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                        b2Settings.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                        b2Settings.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                        b2Settings.b2Log("  jd.localAxisA.Set(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
                        b2Settings.b2Log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                        b2Settings.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                        b2Settings.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
                        b2Settings.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                        b2Settings.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                        b2Settings.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                    }
                }
            };
            b2WheelJoint.InitVelocityConstraints_s_d = new b2Math_27.b2Vec2();
            b2WheelJoint.InitVelocityConstraints_s_P = new b2Math_27.b2Vec2();
            b2WheelJoint.SolveVelocityConstraints_s_P = new b2Math_27.b2Vec2();
            b2WheelJoint.SolvePositionConstraints_s_d = new b2Math_27.b2Vec2();
            b2WheelJoint.SolvePositionConstraints_s_P = new b2Math_27.b2Vec2();
            exports_33("b2WheelJoint", b2WheelJoint);
        }
    }
});
System.register("Box2D/Dynamics/Joints/b2JointFactory", ["Box2D/Common/b2Settings", "Box2D/Dynamics/Joints/b2AreaJoint", "Box2D/Dynamics/Joints/b2DistanceJoint", "Box2D/Dynamics/Joints/b2FrictionJoint", "Box2D/Dynamics/Joints/b2GearJoint", "Box2D/Dynamics/Joints/b2MotorJoint", "Box2D/Dynamics/Joints/b2MouseJoint", "Box2D/Dynamics/Joints/b2PrismaticJoint", "Box2D/Dynamics/Joints/b2PulleyJoint", "Box2D/Dynamics/Joints/b2RevoluteJoint", "Box2D/Dynamics/Joints/b2RopeJoint", "Box2D/Dynamics/Joints/b2WeldJoint", "Box2D/Dynamics/Joints/b2WheelJoint"], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    var b2Settings, b2AreaJoint_1, b2DistanceJoint_2, b2FrictionJoint_1, b2GearJoint_1, b2MotorJoint_1, b2MouseJoint_1, b2PrismaticJoint_1, b2PulleyJoint_1, b2RevoluteJoint_1, b2RopeJoint_1, b2WeldJoint_1, b2WheelJoint_1;
    var b2JointFactory;
    return {
        setters:[
            function (b2Settings_29) {
                b2Settings = b2Settings_29;
            },
            function (b2AreaJoint_1_1) {
                b2AreaJoint_1 = b2AreaJoint_1_1;
            },
            function (b2DistanceJoint_2_1) {
                b2DistanceJoint_2 = b2DistanceJoint_2_1;
            },
            function (b2FrictionJoint_1_1) {
                b2FrictionJoint_1 = b2FrictionJoint_1_1;
            },
            function (b2GearJoint_1_1) {
                b2GearJoint_1 = b2GearJoint_1_1;
            },
            function (b2MotorJoint_1_1) {
                b2MotorJoint_1 = b2MotorJoint_1_1;
            },
            function (b2MouseJoint_1_1) {
                b2MouseJoint_1 = b2MouseJoint_1_1;
            },
            function (b2PrismaticJoint_1_1) {
                b2PrismaticJoint_1 = b2PrismaticJoint_1_1;
            },
            function (b2PulleyJoint_1_1) {
                b2PulleyJoint_1 = b2PulleyJoint_1_1;
            },
            function (b2RevoluteJoint_1_1) {
                b2RevoluteJoint_1 = b2RevoluteJoint_1_1;
            },
            function (b2RopeJoint_1_1) {
                b2RopeJoint_1 = b2RopeJoint_1_1;
            },
            function (b2WeldJoint_1_1) {
                b2WeldJoint_1 = b2WeldJoint_1_1;
            },
            function (b2WheelJoint_1_1) {
                b2WheelJoint_1 = b2WheelJoint_1_1;
            }],
        execute: function() {
            b2JointFactory = class b2JointFactory {
                static Create(def, allocator) {
                    let joint = null;
                    switch (def.type) {
                        case 3 /* e_distanceJoint */:
                            joint = new b2DistanceJoint_2.b2DistanceJoint(def);
                            break;
                        case 5 /* e_mouseJoint */:
                            joint = new b2MouseJoint_1.b2MouseJoint(def);
                            break;
                        case 2 /* e_prismaticJoint */:
                            joint = new b2PrismaticJoint_1.b2PrismaticJoint(def);
                            break;
                        case 1 /* e_revoluteJoint */:
                            joint = new b2RevoluteJoint_1.b2RevoluteJoint(def);
                            break;
                        case 4 /* e_pulleyJoint */:
                            joint = new b2PulleyJoint_1.b2PulleyJoint(def);
                            break;
                        case 6 /* e_gearJoint */:
                            joint = new b2GearJoint_1.b2GearJoint(def);
                            break;
                        case 7 /* e_wheelJoint */:
                            joint = new b2WheelJoint_1.b2WheelJoint(def);
                            break;
                        case 8 /* e_weldJoint */:
                            joint = new b2WeldJoint_1.b2WeldJoint(def);
                            break;
                        case 9 /* e_frictionJoint */:
                            joint = new b2FrictionJoint_1.b2FrictionJoint(def);
                            break;
                        case 10 /* e_ropeJoint */:
                            joint = new b2RopeJoint_1.b2RopeJoint(def);
                            break;
                        case 11 /* e_motorJoint */:
                            joint = new b2MotorJoint_1.b2MotorJoint(def);
                            break;
                        case 12 /* e_areaJoint */:
                            joint = new b2AreaJoint_1.b2AreaJoint(def);
                            break;
                        default:
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(false);
                            }
                            break;
                    }
                    return joint;
                }
                static Destroy(joint, allocator) {
                }
            };
            exports_34("b2JointFactory", b2JointFactory);
        }
    }
});
System.register("Box2D/Collision/b2CollideEdge", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/b2Collision"], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var b2Settings, b2Math_28, b2Collision_6, b2Collision_7;
    var b2CollideEdgeAndCircle_s_Q, b2CollideEdgeAndCircle_s_e, b2CollideEdgeAndCircle_s_d, b2CollideEdgeAndCircle_s_e1, b2CollideEdgeAndCircle_s_e2, b2CollideEdgeAndCircle_s_P, b2CollideEdgeAndCircle_s_n, b2CollideEdgeAndCircle_s_id, b2EPAxis, b2TempPolygon, b2ReferenceFace, b2EPCollider, b2CollideEdgeAndPolygon_s_collider;
    function b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle in frame of edge
        const Q = b2Math_28.b2Transform.MulTXV(xfA, b2Math_28.b2Transform.MulXV(xfB, circleB.m_p, b2Math_28.b2Vec2.s_t0), b2CollideEdgeAndCircle_s_Q);
        const A = edgeA.m_vertex1;
        const B = edgeA.m_vertex2;
        const e = b2Math_28.b2Vec2.SubVV(B, A, b2CollideEdgeAndCircle_s_e);
        // Barycentric coordinates
        const u = b2Math_28.b2Vec2.DotVV(e, b2Math_28.b2Vec2.SubVV(B, Q, b2Math_28.b2Vec2.s_t0));
        const v = b2Math_28.b2Vec2.DotVV(e, b2Math_28.b2Vec2.SubVV(Q, A, b2Math_28.b2Vec2.s_t0));
        const radius = edgeA.m_radius + circleB.m_radius;
        // const cf: b2ContactFeature = new b2ContactFeature();
        const id = b2CollideEdgeAndCircle_s_id;
        id.cf.indexB = 0;
        id.cf.typeB = 0 /* e_vertex */;
        // Region A
        if (v <= 0) {
            const P = A;
            const d = b2Math_28.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2Math_28.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to A?
            if (edgeA.m_hasVertex0) {
                const A1 = edgeA.m_vertex0;
                const B1 = A;
                const e1 = b2Math_28.b2Vec2.SubVV(B1, A1, b2CollideEdgeAndCircle_s_e1);
                const u1 = b2Math_28.b2Vec2.DotVV(e1, b2Math_28.b2Vec2.SubVV(B1, Q, b2Math_28.b2Vec2.s_t0));
                // Is the circle in Region AB of the previous edge?
                if (u1 > 0) {
                    return;
                }
            }
            id.cf.indexA = 0;
            id.cf.typeA = 0 /* e_vertex */;
            manifold.pointCount = 1;
            manifold.type = 0 /* e_circles */;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region B
        if (u <= 0) {
            const P = B;
            const d = b2Math_28.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
            const dd = b2Math_28.b2Vec2.DotVV(d, d);
            if (dd > radius * radius) {
                return;
            }
            // Is there an edge connected to B?
            if (edgeA.m_hasVertex3) {
                const B2 = edgeA.m_vertex3;
                const A2 = B;
                const e2 = b2Math_28.b2Vec2.SubVV(B2, A2, b2CollideEdgeAndCircle_s_e2);
                const v2 = b2Math_28.b2Vec2.DotVV(e2, b2Math_28.b2Vec2.SubVV(Q, A2, b2Math_28.b2Vec2.s_t0));
                // Is the circle in Region AB of the next edge?
                if (v2 > 0) {
                    return;
                }
            }
            id.cf.indexA = 1;
            id.cf.typeA = 0 /* e_vertex */;
            manifold.pointCount = 1;
            manifold.type = 0 /* e_circles */;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region AB
        const den = b2Math_28.b2Vec2.DotVV(e, e);
        if (b2Settings.ENABLE_ASSERTS) {
            b2Settings.b2Assert(den > 0);
        }
        const P = b2CollideEdgeAndCircle_s_P;
        P.x = (1 / den) * (u * A.x + v * B.x);
        P.y = (1 / den) * (u * A.y + v * B.y);
        const d = b2Math_28.b2Vec2.SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
        const dd = b2Math_28.b2Vec2.DotVV(d, d);
        if (dd > radius * radius) {
            return;
        }
        const n = b2CollideEdgeAndCircle_s_n.SetXY(-e.y, e.x);
        if (b2Math_28.b2Vec2.DotVV(n, b2Math_28.b2Vec2.SubVV(Q, A, b2Math_28.b2Vec2.s_t0)) < 0) {
            n.SetXY(-n.x, -n.y);
        }
        n.Normalize();
        id.cf.indexA = 0;
        id.cf.typeA = 1 /* e_face */;
        manifold.pointCount = 1;
        manifold.type = 1 /* e_faceA */;
        manifold.localNormal.Copy(n);
        manifold.localPoint.Copy(A);
        manifold.points[0].id.Copy(id);
        // manifold.points[0].id.key = 0;
        // manifold.points[0].id.cf = cf;
        manifold.points[0].localPoint.Copy(circleB.m_p);
    }
    exports_35("b2CollideEdgeAndCircle", b2CollideEdgeAndCircle);
    function b2CollideEdgeAndPolygon(manifold, edgeA, xfA, polygonB, xfB) {
        const collider = b2CollideEdgeAndPolygon_s_collider;
        collider.Collide(manifold, edgeA, xfA, polygonB, xfB);
    }
    exports_35("b2CollideEdgeAndPolygon", b2CollideEdgeAndPolygon);
    return {
        setters:[
            function (b2Settings_30) {
                b2Settings = b2Settings_30;
            },
            function (b2Math_28_1) {
                b2Math_28 = b2Math_28_1;
            },
            function (b2Collision_6_1) {
                b2Collision_6 = b2Collision_6_1;
                b2Collision_7 = b2Collision_6_1;
            }],
        execute: function() {
            b2CollideEdgeAndCircle_s_Q = new b2Math_28.b2Vec2();
            b2CollideEdgeAndCircle_s_e = new b2Math_28.b2Vec2();
            b2CollideEdgeAndCircle_s_d = new b2Math_28.b2Vec2();
            b2CollideEdgeAndCircle_s_e1 = new b2Math_28.b2Vec2();
            b2CollideEdgeAndCircle_s_e2 = new b2Math_28.b2Vec2();
            b2CollideEdgeAndCircle_s_P = new b2Math_28.b2Vec2();
            b2CollideEdgeAndCircle_s_n = new b2Math_28.b2Vec2();
            b2CollideEdgeAndCircle_s_id = new b2Collision_6.b2ContactID();
            b2EPAxis = class b2EPAxis {
                constructor() {
                    this.type = 0 /* e_unknown */;
                    this.index = 0;
                    this.separation = 0;
                }
            };
            b2TempPolygon = class b2TempPolygon {
                constructor() {
                    this.vertices = b2Math_28.b2Vec2.MakeArray(b2Settings.b2_maxPolygonVertices);
                    this.normals = b2Math_28.b2Vec2.MakeArray(b2Settings.b2_maxPolygonVertices);
                    this.count = 0;
                }
            };
            b2ReferenceFace = class b2ReferenceFace {
                constructor() {
                    this.i1 = 0;
                    this.i2 = 0;
                    this.v1 = new b2Math_28.b2Vec2();
                    this.v2 = new b2Math_28.b2Vec2();
                    this.normal = new b2Math_28.b2Vec2();
                    this.sideNormal1 = new b2Math_28.b2Vec2();
                    this.sideOffset1 = 0;
                    this.sideNormal2 = new b2Math_28.b2Vec2();
                    this.sideOffset2 = 0;
                }
            };
            b2EPCollider = class b2EPCollider {
                constructor() {
                    this.m_polygonB = new b2TempPolygon();
                    this.m_xf = new b2Math_28.b2Transform();
                    this.m_centroidB = new b2Math_28.b2Vec2();
                    this.m_v0 = new b2Math_28.b2Vec2();
                    this.m_v1 = new b2Math_28.b2Vec2();
                    this.m_v2 = new b2Math_28.b2Vec2();
                    this.m_v3 = new b2Math_28.b2Vec2();
                    this.m_normal0 = new b2Math_28.b2Vec2();
                    this.m_normal1 = new b2Math_28.b2Vec2();
                    this.m_normal2 = new b2Math_28.b2Vec2();
                    this.m_normal = new b2Math_28.b2Vec2();
                    this.m_type1 = 0 /* e_isolated */;
                    this.m_type2 = 0 /* e_isolated */;
                    this.m_lowerLimit = new b2Math_28.b2Vec2();
                    this.m_upperLimit = new b2Math_28.b2Vec2();
                    this.m_radius = 0;
                    this.m_front = false;
                }
                Collide(manifold, edgeA, xfA, polygonB, xfB) {
                    b2Math_28.b2Transform.MulTXX(xfA, xfB, this.m_xf);
                    b2Math_28.b2Transform.MulXV(this.m_xf, polygonB.m_centroid, this.m_centroidB);
                    this.m_v0.Copy(edgeA.m_vertex0);
                    this.m_v1.Copy(edgeA.m_vertex1);
                    this.m_v2.Copy(edgeA.m_vertex2);
                    this.m_v3.Copy(edgeA.m_vertex3);
                    const hasVertex0 = edgeA.m_hasVertex0;
                    const hasVertex3 = edgeA.m_hasVertex3;
                    const edge1 = b2Math_28.b2Vec2.SubVV(this.m_v2, this.m_v1, b2EPCollider.s_edge1);
                    edge1.Normalize();
                    this.m_normal1.SetXY(edge1.y, -edge1.x);
                    const offset1 = b2Math_28.b2Vec2.DotVV(this.m_normal1, b2Math_28.b2Vec2.SubVV(this.m_centroidB, this.m_v1, b2Math_28.b2Vec2.s_t0));
                    let offset0 = 0;
                    let offset2 = 0;
                    let convex1 = false;
                    let convex2 = false;
                    // Is there a preceding edge?
                    if (hasVertex0) {
                        const edge0 = b2Math_28.b2Vec2.SubVV(this.m_v1, this.m_v0, b2EPCollider.s_edge0);
                        edge0.Normalize();
                        this.m_normal0.SetXY(edge0.y, -edge0.x);
                        convex1 = b2Math_28.b2Vec2.CrossVV(edge0, edge1) >= 0;
                        offset0 = b2Math_28.b2Vec2.DotVV(this.m_normal0, b2Math_28.b2Vec2.SubVV(this.m_centroidB, this.m_v0, b2Math_28.b2Vec2.s_t0));
                    }
                    // Is there a following edge?
                    if (hasVertex3) {
                        const edge2 = b2Math_28.b2Vec2.SubVV(this.m_v3, this.m_v2, b2EPCollider.s_edge2);
                        edge2.Normalize();
                        this.m_normal2.SetXY(edge2.y, -edge2.x);
                        convex2 = b2Math_28.b2Vec2.CrossVV(edge1, edge2) > 0;
                        offset2 = b2Math_28.b2Vec2.DotVV(this.m_normal2, b2Math_28.b2Vec2.SubVV(this.m_centroidB, this.m_v2, b2Math_28.b2Vec2.s_t0));
                    }
                    // Determine front or back collision. Determine collision normal limits.
                    if (hasVertex0 && hasVertex3) {
                        if (convex1 && convex2) {
                            this.m_front = offset0 >= 0 || offset1 >= 0 || offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal0);
                                this.m_upperLimit.Copy(this.m_normal2);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                        }
                        else if (convex1) {
                            this.m_front = offset0 >= 0 || (offset1 >= 0 && offset2 >= 0);
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal0);
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                        }
                        else if (convex2) {
                            this.m_front = offset2 >= 0 || (offset0 >= 0 && offset1 >= 0);
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal2);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
                            }
                        }
                        else {
                            this.m_front = offset0 >= 0 && offset1 >= 0 && offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
                            }
                        }
                    }
                    else if (hasVertex0) {
                        if (convex1) {
                            this.m_front = offset0 >= 0 || offset1 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal0);
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                        }
                        else {
                            this.m_front = offset0 >= 0 && offset1 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1);
                                this.m_upperLimit.Copy(this.m_normal0).SelfNeg();
                            }
                        }
                    }
                    else if (hasVertex3) {
                        if (convex2) {
                            this.m_front = offset1 >= 0 || offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal2);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                        }
                        else {
                            this.m_front = offset1 >= 0 && offset2 >= 0;
                            if (this.m_front) {
                                this.m_normal.Copy(this.m_normal1);
                                this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                            else {
                                this.m_normal.Copy(this.m_normal1).SelfNeg();
                                this.m_lowerLimit.Copy(this.m_normal2).SelfNeg();
                                this.m_upperLimit.Copy(this.m_normal1);
                            }
                        }
                    }
                    else {
                        this.m_front = offset1 >= 0;
                        if (this.m_front) {
                            this.m_normal.Copy(this.m_normal1);
                            this.m_lowerLimit.Copy(this.m_normal1).SelfNeg();
                            this.m_upperLimit.Copy(this.m_normal1).SelfNeg();
                        }
                        else {
                            this.m_normal.Copy(this.m_normal1).SelfNeg();
                            this.m_lowerLimit.Copy(this.m_normal1);
                            this.m_upperLimit.Copy(this.m_normal1);
                        }
                    }
                    // Get polygonB in frameA
                    this.m_polygonB.count = polygonB.m_count;
                    for (let i = 0, ict = polygonB.m_count; i < ict; ++i) {
                        b2Math_28.b2Transform.MulXV(this.m_xf, polygonB.m_vertices[i], this.m_polygonB.vertices[i]);
                        b2Math_28.b2Rot.MulRV(this.m_xf.q, polygonB.m_normals[i], this.m_polygonB.normals[i]);
                    }
                    this.m_radius = 2 * b2Settings.b2_polygonRadius;
                    manifold.pointCount = 0;
                    const edgeAxis = this.ComputeEdgeSeparation(b2EPCollider.s_edgeAxis);
                    // If no valid normal can be found than this edge should not collide.
                    if (edgeAxis.type === 0 /* e_unknown */) {
                        return;
                    }
                    if (edgeAxis.separation > this.m_radius) {
                        return;
                    }
                    const polygonAxis = this.ComputePolygonSeparation(b2EPCollider.s_polygonAxis);
                    if (polygonAxis.type !== 0 /* e_unknown */ && polygonAxis.separation > this.m_radius) {
                        return;
                    }
                    // Use hysteresis for jitter reduction.
                    const k_relativeTol = 0.98;
                    const k_absoluteTol = 0.001;
                    let primaryAxis;
                    if (polygonAxis.type === 0 /* e_unknown */) {
                        primaryAxis = edgeAxis;
                    }
                    else if (polygonAxis.separation > k_relativeTol * edgeAxis.separation + k_absoluteTol) {
                        primaryAxis = polygonAxis;
                    }
                    else {
                        primaryAxis = edgeAxis;
                    }
                    const ie = b2EPCollider.s_ie;
                    const rf = b2EPCollider.s_rf;
                    if (primaryAxis.type === 1 /* e_edgeA */) {
                        manifold.type = 1 /* e_faceA */;
                        // Search for the polygon normal that is most anti-parallel to the edge normal.
                        let bestIndex = 0;
                        let bestValue = b2Math_28.b2Vec2.DotVV(this.m_normal, this.m_polygonB.normals[0]);
                        for (let i = 1, ict = this.m_polygonB.count; i < ict; ++i) {
                            const value = b2Math_28.b2Vec2.DotVV(this.m_normal, this.m_polygonB.normals[i]);
                            if (value < bestValue) {
                                bestValue = value;
                                bestIndex = i;
                            }
                        }
                        const i1 = bestIndex;
                        const i2 = (i1 + 1) % this.m_polygonB.count;
                        const ie0 = ie[0];
                        ie0.v.Copy(this.m_polygonB.vertices[i1]);
                        ie0.id.cf.indexA = 0;
                        ie0.id.cf.indexB = i1;
                        ie0.id.cf.typeA = 1 /* e_face */;
                        ie0.id.cf.typeB = 0 /* e_vertex */;
                        const ie1 = ie[1];
                        ie1.v.Copy(this.m_polygonB.vertices[i2]);
                        ie1.id.cf.indexA = 0;
                        ie1.id.cf.indexB = i2;
                        ie1.id.cf.typeA = 1 /* e_face */;
                        ie1.id.cf.typeB = 0 /* e_vertex */;
                        if (this.m_front) {
                            rf.i1 = 0;
                            rf.i2 = 1;
                            rf.v1.Copy(this.m_v1);
                            rf.v2.Copy(this.m_v2);
                            rf.normal.Copy(this.m_normal1);
                        }
                        else {
                            rf.i1 = 1;
                            rf.i2 = 0;
                            rf.v1.Copy(this.m_v2);
                            rf.v2.Copy(this.m_v1);
                            rf.normal.Copy(this.m_normal1).SelfNeg();
                        }
                    }
                    else {
                        manifold.type = 2 /* e_faceB */;
                        const ie0 = ie[0];
                        ie0.v.Copy(this.m_v1);
                        ie0.id.cf.indexA = 0;
                        ie0.id.cf.indexB = primaryAxis.index;
                        ie0.id.cf.typeA = 0 /* e_vertex */;
                        ie0.id.cf.typeB = 1 /* e_face */;
                        const ie1 = ie[1];
                        ie1.v.Copy(this.m_v2);
                        ie1.id.cf.indexA = 0;
                        ie1.id.cf.indexB = primaryAxis.index;
                        ie1.id.cf.typeA = 0 /* e_vertex */;
                        ie1.id.cf.typeB = 1 /* e_face */;
                        rf.i1 = primaryAxis.index;
                        rf.i2 = (rf.i1 + 1) % this.m_polygonB.count;
                        rf.v1.Copy(this.m_polygonB.vertices[rf.i1]);
                        rf.v2.Copy(this.m_polygonB.vertices[rf.i2]);
                        rf.normal.Copy(this.m_polygonB.normals[rf.i1]);
                    }
                    rf.sideNormal1.SetXY(rf.normal.y, -rf.normal.x);
                    rf.sideNormal2.Copy(rf.sideNormal1).SelfNeg();
                    rf.sideOffset1 = b2Math_28.b2Vec2.DotVV(rf.sideNormal1, rf.v1);
                    rf.sideOffset2 = b2Math_28.b2Vec2.DotVV(rf.sideNormal2, rf.v2);
                    // Clip incident edge against extruded edge1 side edges.
                    const clipPoints1 = b2EPCollider.s_clipPoints1;
                    const clipPoints2 = b2EPCollider.s_clipPoints2;
                    let np = 0;
                    // Clip to box side 1
                    np = b2Collision_7.b2ClipSegmentToLine(clipPoints1, ie, rf.sideNormal1, rf.sideOffset1, rf.i1);
                    if (np < b2Settings.b2_maxManifoldPoints) {
                        return;
                    }
                    // Clip to negative box side 1
                    np = b2Collision_7.b2ClipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2, rf.sideOffset2, rf.i2);
                    if (np < b2Settings.b2_maxManifoldPoints) {
                        return;
                    }
                    // Now clipPoints2 contains the clipped points.
                    if (primaryAxis.type === 1 /* e_edgeA */) {
                        manifold.localNormal.Copy(rf.normal);
                        manifold.localPoint.Copy(rf.v1);
                    }
                    else {
                        manifold.localNormal.Copy(polygonB.m_normals[rf.i1]);
                        manifold.localPoint.Copy(polygonB.m_vertices[rf.i1]);
                    }
                    let pointCount = 0;
                    for (let i = 0, ict = b2Settings.b2_maxManifoldPoints; i < ict; ++i) {
                        let separation;
                        separation = b2Math_28.b2Vec2.DotVV(rf.normal, b2Math_28.b2Vec2.SubVV(clipPoints2[i].v, rf.v1, b2Math_28.b2Vec2.s_t0));
                        if (separation <= this.m_radius) {
                            const cp = manifold.points[pointCount];
                            if (primaryAxis.type === 1 /* e_edgeA */) {
                                b2Math_28.b2Transform.MulTXV(this.m_xf, clipPoints2[i].v, cp.localPoint);
                                cp.id = clipPoints2[i].id;
                            }
                            else {
                                cp.localPoint.Copy(clipPoints2[i].v);
                                cp.id.cf.typeA = clipPoints2[i].id.cf.typeB;
                                cp.id.cf.typeB = clipPoints2[i].id.cf.typeA;
                                cp.id.cf.indexA = clipPoints2[i].id.cf.indexB;
                                cp.id.cf.indexB = clipPoints2[i].id.cf.indexA;
                            }
                            ++pointCount;
                        }
                    }
                    manifold.pointCount = pointCount;
                }
                ComputeEdgeSeparation(out) {
                    const axis = out;
                    axis.type = 1 /* e_edgeA */;
                    axis.index = this.m_front ? 0 : 1;
                    axis.separation = b2Settings.b2_maxFloat;
                    for (let i = 0, ict = this.m_polygonB.count; i < ict; ++i) {
                        const s = b2Math_28.b2Vec2.DotVV(this.m_normal, b2Math_28.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Math_28.b2Vec2.s_t0));
                        if (s < axis.separation) {
                            axis.separation = s;
                        }
                    }
                    return axis;
                }
                ComputePolygonSeparation(out) {
                    const axis = out;
                    axis.type = 0 /* e_unknown */;
                    axis.index = -1;
                    axis.separation = -b2Settings.b2_maxFloat;
                    const perp = b2EPCollider.s_perp.SetXY(-this.m_normal.y, this.m_normal.x);
                    for (let i = 0, ict = this.m_polygonB.count; i < ict; ++i) {
                        const n = b2Math_28.b2Vec2.NegV(this.m_polygonB.normals[i], b2EPCollider.s_n);
                        const s1 = b2Math_28.b2Vec2.DotVV(n, b2Math_28.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v1, b2Math_28.b2Vec2.s_t0));
                        const s2 = b2Math_28.b2Vec2.DotVV(n, b2Math_28.b2Vec2.SubVV(this.m_polygonB.vertices[i], this.m_v2, b2Math_28.b2Vec2.s_t0));
                        const s = b2Math_28.b2Min(s1, s2);
                        if (s > this.m_radius) {
                            // No collision
                            axis.type = 2 /* e_edgeB */;
                            axis.index = i;
                            axis.separation = s;
                            return axis;
                        }
                        // Adjacency
                        if (b2Math_28.b2Vec2.DotVV(n, perp) >= 0) {
                            if (b2Math_28.b2Vec2.DotVV(b2Math_28.b2Vec2.SubVV(n, this.m_upperLimit, b2Math_28.b2Vec2.s_t0), this.m_normal) < -b2Settings.b2_angularSlop) {
                                continue;
                            }
                        }
                        else {
                            if (b2Math_28.b2Vec2.DotVV(b2Math_28.b2Vec2.SubVV(n, this.m_lowerLimit, b2Math_28.b2Vec2.s_t0), this.m_normal) < -b2Settings.b2_angularSlop) {
                                continue;
                            }
                        }
                        if (s > axis.separation) {
                            axis.type = 2 /* e_edgeB */;
                            axis.index = i;
                            axis.separation = s;
                        }
                    }
                    return axis;
                }
            };
            b2EPCollider.s_edge1 = new b2Math_28.b2Vec2();
            b2EPCollider.s_edge0 = new b2Math_28.b2Vec2();
            b2EPCollider.s_edge2 = new b2Math_28.b2Vec2();
            b2EPCollider.s_ie = b2Collision_7.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_rf = new b2ReferenceFace();
            b2EPCollider.s_clipPoints1 = b2Collision_7.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_clipPoints2 = b2Collision_7.b2ClipVertex.MakeArray(2);
            b2EPCollider.s_edgeAxis = new b2EPAxis();
            b2EPCollider.s_polygonAxis = new b2EPAxis();
            b2EPCollider.s_n = new b2Math_28.b2Vec2();
            b2EPCollider.s_perp = new b2Math_28.b2Vec2();
            b2CollideEdgeAndPolygon_s_collider = new b2EPCollider();
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2ChainAndCircleContact", ["Box2D/Common/b2Settings", "Box2D/Collision/b2CollideEdge", "Box2D/Collision/Shapes/b2ChainShape", "Box2D/Collision/Shapes/b2CircleShape", "Box2D/Collision/Shapes/b2EdgeShape", "Box2D/Dynamics/Contacts/b2Contact"], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var b2Settings, b2CollideEdge_1, b2ChainShape_1, b2CircleShape_1, b2EdgeShape_2, b2Contact_1;
    var b2ChainAndCircleContact;
    return {
        setters:[
            function (b2Settings_31) {
                b2Settings = b2Settings_31;
            },
            function (b2CollideEdge_1_1) {
                b2CollideEdge_1 = b2CollideEdge_1_1;
            },
            function (b2ChainShape_1_1) {
                b2ChainShape_1 = b2ChainShape_1_1;
            },
            function (b2CircleShape_1_1) {
                b2CircleShape_1 = b2CircleShape_1_1;
            },
            function (b2EdgeShape_2_1) {
                b2EdgeShape_2 = b2EdgeShape_2_1;
            },
            function (b2Contact_1_1) {
                b2Contact_1 = b2Contact_1_1;
            }],
        execute: function() {
            b2ChainAndCircleContact = class b2ChainAndCircleContact extends b2Contact_1.b2Contact {
                constructor() {
                    super(); // base class constructor
                }
                static Create(allocator) {
                    return new b2ChainAndCircleContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureA.GetType() === 3 /* e_chainShape */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureB.GetType() === 0 /* e_circleShape */);
                    }
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeA instanceof b2ChainShape_1.b2ChainShape);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeB instanceof b2CircleShape_1.b2CircleShape);
                    }
                    const chain = shapeA;
                    const edge = b2ChainAndCircleContact.Evaluate_s_edge;
                    chain.GetChildEdge(edge, this.m_indexA);
                    b2CollideEdge_1.b2CollideEdgeAndCircle(manifold, edge, xfA, shapeB, xfB);
                }
            };
            b2ChainAndCircleContact.Evaluate_s_edge = new b2EdgeShape_2.b2EdgeShape();
            exports_36("b2ChainAndCircleContact", b2ChainAndCircleContact);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2ChainAndPolygonContact", ["Box2D/Common/b2Settings", "Box2D/Collision/b2CollideEdge", "Box2D/Collision/Shapes/b2ChainShape", "Box2D/Collision/Shapes/b2EdgeShape", "Box2D/Collision/Shapes/b2PolygonShape", "Box2D/Dynamics/Contacts/b2Contact"], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var b2Settings, b2CollideEdge_2, b2ChainShape_2, b2EdgeShape_3, b2PolygonShape_1, b2Contact_2;
    var b2ChainAndPolygonContact;
    return {
        setters:[
            function (b2Settings_32) {
                b2Settings = b2Settings_32;
            },
            function (b2CollideEdge_2_1) {
                b2CollideEdge_2 = b2CollideEdge_2_1;
            },
            function (b2ChainShape_2_1) {
                b2ChainShape_2 = b2ChainShape_2_1;
            },
            function (b2EdgeShape_3_1) {
                b2EdgeShape_3 = b2EdgeShape_3_1;
            },
            function (b2PolygonShape_1_1) {
                b2PolygonShape_1 = b2PolygonShape_1_1;
            },
            function (b2Contact_2_1) {
                b2Contact_2 = b2Contact_2_1;
            }],
        execute: function() {
            b2ChainAndPolygonContact = class b2ChainAndPolygonContact extends b2Contact_2.b2Contact {
                constructor() {
                    super(); // base class constructor
                }
                static Create(allocator) {
                    return new b2ChainAndPolygonContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureA.GetType() === 3 /* e_chainShape */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureB.GetType() === 2 /* e_polygonShape */);
                    }
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeA instanceof b2ChainShape_2.b2ChainShape);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeB instanceof b2PolygonShape_1.b2PolygonShape);
                    }
                    const chain = shapeA;
                    const edge = b2ChainAndPolygonContact.Evaluate_s_edge;
                    chain.GetChildEdge(edge, this.m_indexA);
                    b2CollideEdge_2.b2CollideEdgeAndPolygon(manifold, edge, xfA, shapeB, xfB);
                }
            };
            b2ChainAndPolygonContact.Evaluate_s_edge = new b2EdgeShape_3.b2EdgeShape();
            exports_37("b2ChainAndPolygonContact", b2ChainAndPolygonContact);
        }
    }
});
System.register("Box2D/Collision/b2CollideCircle", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math"], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var b2Settings, b2Math_29;
    var b2CollideCircles_s_pA, b2CollideCircles_s_pB, b2CollidePolygonAndCircle_s_c, b2CollidePolygonAndCircle_s_cLocal, b2CollidePolygonAndCircle_s_faceCenter;
    function b2CollideCircles(manifold, circleA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        const pA = b2Math_29.b2Transform.MulXV(xfA, circleA.m_p, b2CollideCircles_s_pA);
        const pB = b2Math_29.b2Transform.MulXV(xfB, circleB.m_p, b2CollideCircles_s_pB);
        const distSqr = b2Math_29.b2Vec2.DistanceSquaredVV(pA, pB);
        const radius = circleA.m_radius + circleB.m_radius;
        if (distSqr > radius * radius) {
            return;
        }
        manifold.type = 0 /* e_circles */;
        manifold.localPoint.Copy(circleA.m_p);
        manifold.localNormal.SetZero();
        manifold.pointCount = 1;
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
    }
    exports_38("b2CollideCircles", b2CollideCircles);
    function b2CollidePolygonAndCircle(manifold, polygonA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle position in the frame of the polygon.
        const c = b2Math_29.b2Transform.MulXV(xfB, circleB.m_p, b2CollidePolygonAndCircle_s_c);
        const cLocal = b2Math_29.b2Transform.MulTXV(xfA, c, b2CollidePolygonAndCircle_s_cLocal);
        // Find the min separating edge.
        let normalIndex = 0;
        let separation = (-b2Settings.b2_maxFloat);
        const radius = polygonA.m_radius + circleB.m_radius;
        const vertexCount = polygonA.m_count;
        const vertices = polygonA.m_vertices;
        const normals = polygonA.m_normals;
        for (let i = 0; i < vertexCount; ++i) {
            const s = b2Math_29.b2Vec2.DotVV(normals[i], b2Math_29.b2Vec2.SubVV(cLocal, vertices[i], b2Math_29.b2Vec2.s_t0));
            if (s > radius) {
                // Early out.
                return;
            }
            if (s > separation) {
                separation = s;
                normalIndex = i;
            }
        }
        // Vertices that subtend the incident face.
        const vertIndex1 = normalIndex;
        const vertIndex2 = (vertIndex1 + 1) % vertexCount;
        const v1 = vertices[vertIndex1];
        const v2 = vertices[vertIndex2];
        // If the center is inside the polygon ...
        if (separation < b2Settings.b2_epsilon) {
            manifold.pointCount = 1;
            manifold.type = 1 /* e_faceA */;
            manifold.localNormal.Copy(normals[normalIndex]);
            b2Math_29.b2Vec2.MidVV(v1, v2, manifold.localPoint);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
            return;
        }
        // Compute barycentric coordinates
        const u1 = b2Math_29.b2Vec2.DotVV(b2Math_29.b2Vec2.SubVV(cLocal, v1, b2Math_29.b2Vec2.s_t0), b2Math_29.b2Vec2.SubVV(v2, v1, b2Math_29.b2Vec2.s_t1));
        const u2 = b2Math_29.b2Vec2.DotVV(b2Math_29.b2Vec2.SubVV(cLocal, v2, b2Math_29.b2Vec2.s_t0), b2Math_29.b2Vec2.SubVV(v1, v2, b2Math_29.b2Vec2.s_t1));
        if (u1 <= 0) {
            if (b2Math_29.b2Vec2.DistanceSquaredVV(cLocal, v1) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = 1 /* e_faceA */;
            b2Math_29.b2Vec2.SubVV(cLocal, v1, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v1);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else if (u2 <= 0) {
            if (b2Math_29.b2Vec2.DistanceSquaredVV(cLocal, v2) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = 1 /* e_faceA */;
            b2Math_29.b2Vec2.SubVV(cLocal, v2, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v2);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else {
            const faceCenter = b2Math_29.b2Vec2.MidVV(v1, v2, b2CollidePolygonAndCircle_s_faceCenter);
            separation = b2Math_29.b2Vec2.DotVV(b2Math_29.b2Vec2.SubVV(cLocal, faceCenter, b2Math_29.b2Vec2.s_t1), normals[vertIndex1]);
            if (separation > radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = 1 /* e_faceA */;
            manifold.localNormal.Copy(normals[vertIndex1]).SelfNormalize();
            manifold.localPoint.Copy(faceCenter);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
    }
    exports_38("b2CollidePolygonAndCircle", b2CollidePolygonAndCircle);
    return {
        setters:[
            function (b2Settings_33) {
                b2Settings = b2Settings_33;
            },
            function (b2Math_29_1) {
                b2Math_29 = b2Math_29_1;
            }],
        execute: function() {
            b2CollideCircles_s_pA = new b2Math_29.b2Vec2();
            b2CollideCircles_s_pB = new b2Math_29.b2Vec2();
            b2CollidePolygonAndCircle_s_c = new b2Math_29.b2Vec2();
            b2CollidePolygonAndCircle_s_cLocal = new b2Math_29.b2Vec2();
            b2CollidePolygonAndCircle_s_faceCenter = new b2Math_29.b2Vec2();
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2CircleContact", ["Box2D/Common/b2Settings", "Box2D/Collision/b2CollideCircle", "Box2D/Collision/Shapes/b2CircleShape", "Box2D/Dynamics/Contacts/b2Contact"], function(exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var b2Settings, b2CollideCircle_1, b2CircleShape_2, b2Contact_3;
    var b2CircleContact;
    return {
        setters:[
            function (b2Settings_34) {
                b2Settings = b2Settings_34;
            },
            function (b2CollideCircle_1_1) {
                b2CollideCircle_1 = b2CollideCircle_1_1;
            },
            function (b2CircleShape_2_1) {
                b2CircleShape_2 = b2CircleShape_2_1;
            },
            function (b2Contact_3_1) {
                b2Contact_3 = b2Contact_3_1;
            }],
        execute: function() {
            b2CircleContact = class b2CircleContact extends b2Contact_3.b2Contact {
                constructor() {
                    super(); // base class constructor
                }
                static Create(allocator) {
                    return new b2CircleContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeA instanceof b2CircleShape_2.b2CircleShape);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeB instanceof b2CircleShape_2.b2CircleShape);
                    }
                    b2CollideCircle_1.b2CollideCircles(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_39("b2CircleContact", b2CircleContact);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2EdgeAndCircleContact", ["Box2D/Common/b2Settings", "Box2D/Collision/b2CollideEdge", "Box2D/Collision/Shapes/b2CircleShape", "Box2D/Collision/Shapes/b2EdgeShape", "Box2D/Dynamics/Contacts/b2Contact"], function(exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    var b2Settings, b2CollideEdge_3, b2CircleShape_3, b2EdgeShape_4, b2Contact_4;
    var b2EdgeAndCircleContact;
    return {
        setters:[
            function (b2Settings_35) {
                b2Settings = b2Settings_35;
            },
            function (b2CollideEdge_3_1) {
                b2CollideEdge_3 = b2CollideEdge_3_1;
            },
            function (b2CircleShape_3_1) {
                b2CircleShape_3 = b2CircleShape_3_1;
            },
            function (b2EdgeShape_4_1) {
                b2EdgeShape_4 = b2EdgeShape_4_1;
            },
            function (b2Contact_4_1) {
                b2Contact_4 = b2Contact_4_1;
            }],
        execute: function() {
            b2EdgeAndCircleContact = class b2EdgeAndCircleContact extends b2Contact_4.b2Contact {
                constructor() {
                    super(); // base class constructor
                }
                static Create(allocator) {
                    return new b2EdgeAndCircleContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureA.GetType() === 1 /* e_edgeShape */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureB.GetType() === 0 /* e_circleShape */);
                    }
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeA instanceof b2EdgeShape_4.b2EdgeShape);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeB instanceof b2CircleShape_3.b2CircleShape);
                    }
                    b2CollideEdge_3.b2CollideEdgeAndCircle(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_40("b2EdgeAndCircleContact", b2EdgeAndCircleContact);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact", ["Box2D/Common/b2Settings", "Box2D/Collision/b2CollideEdge", "Box2D/Collision/Shapes/b2EdgeShape", "Box2D/Collision/Shapes/b2PolygonShape", "Box2D/Dynamics/Contacts/b2Contact"], function(exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var b2Settings, b2CollideEdge_4, b2EdgeShape_5, b2PolygonShape_2, b2Contact_5;
    var b2EdgeAndPolygonContact;
    return {
        setters:[
            function (b2Settings_36) {
                b2Settings = b2Settings_36;
            },
            function (b2CollideEdge_4_1) {
                b2CollideEdge_4 = b2CollideEdge_4_1;
            },
            function (b2EdgeShape_5_1) {
                b2EdgeShape_5 = b2EdgeShape_5_1;
            },
            function (b2PolygonShape_2_1) {
                b2PolygonShape_2 = b2PolygonShape_2_1;
            },
            function (b2Contact_5_1) {
                b2Contact_5 = b2Contact_5_1;
            }],
        execute: function() {
            b2EdgeAndPolygonContact = class b2EdgeAndPolygonContact extends b2Contact_5.b2Contact {
                constructor() {
                    super(); // base class constructor
                }
                static Create(allocator) {
                    return new b2EdgeAndPolygonContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureA.GetType() === 1 /* e_edgeShape */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureB.GetType() === 2 /* e_polygonShape */);
                    }
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeA instanceof b2EdgeShape_5.b2EdgeShape);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeB instanceof b2PolygonShape_2.b2PolygonShape);
                    }
                    b2CollideEdge_4.b2CollideEdgeAndPolygon(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_41("b2EdgeAndPolygonContact", b2EdgeAndPolygonContact);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2PolygonAndCircleContact", ["Box2D/Common/b2Settings", "Box2D/Collision/b2CollideCircle", "Box2D/Collision/Shapes/b2CircleShape", "Box2D/Collision/Shapes/b2PolygonShape", "Box2D/Dynamics/Contacts/b2Contact"], function(exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var b2Settings, b2CollideCircle_2, b2CircleShape_4, b2PolygonShape_3, b2Contact_6;
    var b2PolygonAndCircleContact;
    return {
        setters:[
            function (b2Settings_37) {
                b2Settings = b2Settings_37;
            },
            function (b2CollideCircle_2_1) {
                b2CollideCircle_2 = b2CollideCircle_2_1;
            },
            function (b2CircleShape_4_1) {
                b2CircleShape_4 = b2CircleShape_4_1;
            },
            function (b2PolygonShape_3_1) {
                b2PolygonShape_3 = b2PolygonShape_3_1;
            },
            function (b2Contact_6_1) {
                b2Contact_6 = b2Contact_6_1;
            }],
        execute: function() {
            b2PolygonAndCircleContact = class b2PolygonAndCircleContact extends b2Contact_6.b2Contact {
                constructor() {
                    super(); // base class constructor
                }
                static Create(allocator) {
                    return new b2PolygonAndCircleContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureA.GetType() === 2 /* e_polygonShape */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(fixtureB.GetType() === 0 /* e_circleShape */);
                    }
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeA instanceof b2PolygonShape_3.b2PolygonShape);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeB instanceof b2CircleShape_4.b2CircleShape);
                    }
                    b2CollideCircle_2.b2CollidePolygonAndCircle(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_42("b2PolygonAndCircleContact", b2PolygonAndCircleContact);
        }
    }
});
System.register("Box2D/Collision/b2CollidePolygon", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/b2Collision"], function(exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var b2Settings, b2Math_30, b2Collision_8;
    var b2EdgeSeparation_s_normal1World, b2EdgeSeparation_s_normal1, b2EdgeSeparation_s_v1, b2EdgeSeparation_s_v2, b2FindMaxSeparation_s_d, b2FindMaxSeparation_s_dLocal1, b2FindIncidentEdge_s_normal1, b2CollidePolygons_s_incidentEdge, b2CollidePolygons_s_clipPoints1, b2CollidePolygons_s_clipPoints2, b2CollidePolygons_s_edgeA, b2CollidePolygons_s_edgeB, b2CollidePolygons_s_localTangent, b2CollidePolygons_s_localNormal, b2CollidePolygons_s_planePoint, b2CollidePolygons_s_normal, b2CollidePolygons_s_tangent, b2CollidePolygons_s_ntangent, b2CollidePolygons_s_v11, b2CollidePolygons_s_v12;
    function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
        const count1 = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        if (b2Settings.ENABLE_ASSERTS) {
            b2Settings.b2Assert(0 <= edge1 && edge1 < count1);
        }
        // Convert normal from poly1's frame into poly2's frame.
        const normal1World = b2Math_30.b2Rot.MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
        const normal1 = b2Math_30.b2Rot.MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);
        // Find support vertex on poly2 for -normal.
        let index = 0;
        let minDot = b2Settings.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2Math_30.b2Vec2.DotVV(vertices2[i], normal1);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        const v1 = b2Math_30.b2Transform.MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
        const v2 = b2Math_30.b2Transform.MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
        const separation = b2Math_30.b2Vec2.DotVV(b2Math_30.b2Vec2.SubVV(v2, v1, b2Math_30.b2Vec2.s_t0), normal1World);
        return separation;
    }
    function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
        const count1 = poly1.m_count;
        const normals1 = poly1.m_normals;
        // Vector pointing from the centroid of poly1 to the centroid of poly2.
        const d = b2Math_30.b2Vec2.SubVV(b2Math_30.b2Transform.MulXV(xf2, poly2.m_centroid, b2Math_30.b2Vec2.s_t0), b2Math_30.b2Transform.MulXV(xf1, poly1.m_centroid, b2Math_30.b2Vec2.s_t1), b2FindMaxSeparation_s_d);
        const dLocal1 = b2Math_30.b2Rot.MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);
        // Find edge normal on poly1 that has the largest projection onto d.
        let edge = 0;
        let maxDot = (-b2Settings.b2_maxFloat);
        for (let i = 0; i < count1; ++i) {
            const dot = b2Math_30.b2Vec2.DotVV(normals1[i], dLocal1);
            if (dot > maxDot) {
                maxDot = dot;
                edge = i;
            }
        }
        // Get the separation for the edge normal.
        let s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);
        // Check the separation for the previous edge normal.
        const prevEdge = (edge + count1 - 1) % count1;
        const sPrev = b2EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
        // Check the separation for the next edge normal.
        const nextEdge = (edge + 1) % count1;
        const sNext = b2EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
        // Find the best edge and the search direction.
        let bestEdge = 0;
        let bestSeparation = 0;
        let increment = 0;
        if (sPrev > s && sPrev > sNext) {
            increment = -1;
            bestEdge = prevEdge;
            bestSeparation = sPrev;
        }
        else if (sNext > s) {
            increment = 1;
            bestEdge = nextEdge;
            bestSeparation = sNext;
        }
        else {
            edgeIndex[0] = edge;
            return s;
        }
        // Perform a local search for the best edge normal.
        while (true) {
            if (increment === -1)
                edge = (bestEdge + count1 - 1) % count1;
            else
                edge = (bestEdge + 1) % count1;
            s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);
            if (s > bestSeparation) {
                bestEdge = edge;
                bestSeparation = s;
            }
            else {
                break;
            }
        }
        edgeIndex[0] = bestEdge;
        return bestSeparation;
    }
    function b2FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
        const count1 = poly1.m_count;
        const normals1 = poly1.m_normals;
        const count2 = poly2.m_count;
        const vertices2 = poly2.m_vertices;
        const normals2 = poly2.m_normals;
        if (b2Settings.ENABLE_ASSERTS) {
            b2Settings.b2Assert(0 <= edge1 && edge1 < count1);
        }
        // Get the normal of the reference edge in poly2's frame.
        const normal1 = b2Math_30.b2Rot.MulTRV(xf2.q, b2Math_30.b2Rot.MulRV(xf1.q, normals1[edge1], b2Math_30.b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);
        // Find the incident edge on poly2.
        let index = 0;
        let minDot = b2Settings.b2_maxFloat;
        for (let i = 0; i < count2; ++i) {
            const dot = b2Math_30.b2Vec2.DotVV(normal1, normals2[i]);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        // Build the clip vertices for the incident edge.
        const i1 = index;
        const i2 = (i1 + 1) % count2;
        const c0 = c[0];
        b2Math_30.b2Transform.MulXV(xf2, vertices2[i1], c0.v);
        const cf0 = c0.id.cf;
        cf0.indexA = edge1;
        cf0.indexB = i1;
        cf0.typeA = 1 /* e_face */;
        cf0.typeB = 0 /* e_vertex */;
        const c1 = c[1];
        b2Math_30.b2Transform.MulXV(xf2, vertices2[i2], c1.v);
        const cf1 = c1.id.cf;
        cf1.indexA = edge1;
        cf1.indexB = i2;
        cf1.typeA = 1 /* e_face */;
        cf1.typeB = 0 /* e_vertex */;
    }
    function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
        manifold.pointCount = 0;
        const totalRadius = polyA.m_radius + polyB.m_radius;
        const edgeA = b2CollidePolygons_s_edgeA;
        edgeA[0] = 0;
        const separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
        if (separationA > totalRadius)
            return;
        const edgeB = b2CollidePolygons_s_edgeB;
        edgeB[0] = 0;
        const separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
        if (separationB > totalRadius)
            return;
        let poly1; // reference polygon
        let poly2; // incident polygon
        let xf1, xf2;
        let edge1 = 0; // reference edge
        let flip = 0;
        const k_relativeTol = 0.98;
        const k_absoluteTol = 0.001;
        if (separationB > k_relativeTol * separationA + k_absoluteTol) {
            poly1 = polyB;
            poly2 = polyA;
            xf1 = xfB;
            xf2 = xfA;
            edge1 = edgeB[0];
            manifold.type = 2 /* e_faceB */;
            flip = 1;
        }
        else {
            poly1 = polyA;
            poly2 = polyB;
            xf1 = xfA;
            xf2 = xfB;
            edge1 = edgeA[0];
            manifold.type = 1 /* e_faceA */;
            flip = 0;
        }
        const incidentEdge = b2CollidePolygons_s_incidentEdge;
        b2FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
        const count1 = poly1.m_count;
        const vertices1 = poly1.m_vertices;
        const iv1 = edge1;
        const iv2 = (edge1 + 1) % count1;
        const local_v11 = vertices1[iv1];
        const local_v12 = vertices1[iv2];
        const localTangent = b2Math_30.b2Vec2.SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
        localTangent.Normalize();
        const localNormal = b2Math_30.b2Vec2.CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
        const planePoint = b2Math_30.b2Vec2.MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);
        const tangent = b2Math_30.b2Rot.MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
        const normal = b2Math_30.b2Vec2.CrossVOne(tangent, b2CollidePolygons_s_normal);
        const v11 = b2Math_30.b2Transform.MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
        const v12 = b2Math_30.b2Transform.MulXV(xf1, local_v12, b2CollidePolygons_s_v12);
        // Face offset.
        const frontOffset = b2Math_30.b2Vec2.DotVV(normal, v11);
        // Side offsets, extended by polytope skin thickness.
        const sideOffset1 = -b2Math_30.b2Vec2.DotVV(tangent, v11) + totalRadius;
        const sideOffset2 = b2Math_30.b2Vec2.DotVV(tangent, v12) + totalRadius;
        // Clip incident edge against extruded edge1 side edges.
        const clipPoints1 = b2CollidePolygons_s_clipPoints1;
        const clipPoints2 = b2CollidePolygons_s_clipPoints2;
        let np;
        // Clip to box side 1
        const ntangent = b2Math_30.b2Vec2.NegV(tangent, b2CollidePolygons_s_ntangent);
        np = b2Collision_8.b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
        if (np < 2)
            return;
        // Clip to negative box side 1
        np = b2Collision_8.b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
        if (np < 2) {
            return;
        }
        // Now clipPoints2 contains the clipped points.
        manifold.localNormal.Copy(localNormal);
        manifold.localPoint.Copy(planePoint);
        let pointCount = 0;
        for (let i = 0; i < b2Settings.b2_maxManifoldPoints; ++i) {
            const cv = clipPoints2[i];
            const separation = b2Math_30.b2Vec2.DotVV(normal, cv.v) - frontOffset;
            if (separation <= totalRadius) {
                const cp = manifold.points[pointCount];
                b2Math_30.b2Transform.MulTXV(xf2, cv.v, cp.localPoint);
                cp.id.Copy(cv.id);
                if (flip) {
                    // Swap features
                    const cf = cp.id.cf;
                    cp.id.cf.indexA = cf.indexB;
                    cp.id.cf.indexB = cf.indexA;
                    cp.id.cf.typeA = cf.typeB;
                    cp.id.cf.typeB = cf.typeA;
                }
                ++pointCount;
            }
        }
        manifold.pointCount = pointCount;
    }
    exports_43("b2CollidePolygons", b2CollidePolygons);
    return {
        setters:[
            function (b2Settings_38) {
                b2Settings = b2Settings_38;
            },
            function (b2Math_30_1) {
                b2Math_30 = b2Math_30_1;
            },
            function (b2Collision_8_1) {
                b2Collision_8 = b2Collision_8_1;
            }],
        execute: function() {
            b2EdgeSeparation_s_normal1World = new b2Math_30.b2Vec2();
            b2EdgeSeparation_s_normal1 = new b2Math_30.b2Vec2();
            b2EdgeSeparation_s_v1 = new b2Math_30.b2Vec2();
            b2EdgeSeparation_s_v2 = new b2Math_30.b2Vec2();
            b2FindMaxSeparation_s_d = new b2Math_30.b2Vec2();
            b2FindMaxSeparation_s_dLocal1 = new b2Math_30.b2Vec2();
            b2FindIncidentEdge_s_normal1 = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_incidentEdge = b2Collision_8.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints1 = b2Collision_8.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_clipPoints2 = b2Collision_8.b2ClipVertex.MakeArray(2);
            b2CollidePolygons_s_edgeA = b2Settings.b2MakeNumberArray(1);
            b2CollidePolygons_s_edgeB = b2Settings.b2MakeNumberArray(1);
            b2CollidePolygons_s_localTangent = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_localNormal = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_planePoint = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_normal = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_tangent = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_ntangent = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_v11 = new b2Math_30.b2Vec2();
            b2CollidePolygons_s_v12 = new b2Math_30.b2Vec2();
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2PolygonContact", ["Box2D/Common/b2Settings", "Box2D/Collision/b2CollidePolygon", "Box2D/Collision/Shapes/b2PolygonShape", "Box2D/Dynamics/Contacts/b2Contact"], function(exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var b2Settings, b2CollidePolygon_1, b2PolygonShape_4, b2Contact_7;
    var b2PolygonContact;
    return {
        setters:[
            function (b2Settings_39) {
                b2Settings = b2Settings_39;
            },
            function (b2CollidePolygon_1_1) {
                b2CollidePolygon_1 = b2CollidePolygon_1_1;
            },
            function (b2PolygonShape_4_1) {
                b2PolygonShape_4 = b2PolygonShape_4_1;
            },
            function (b2Contact_7_1) {
                b2Contact_7 = b2Contact_7_1;
            }],
        execute: function() {
            b2PolygonContact = class b2PolygonContact extends b2Contact_7.b2Contact {
                constructor() {
                    super(); // base class constructor
                }
                static Create(allocator) {
                    return new b2PolygonContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeA instanceof b2PolygonShape_4.b2PolygonShape);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(shapeB instanceof b2PolygonShape_4.b2PolygonShape);
                    }
                    b2CollidePolygon_1.b2CollidePolygons(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_44("b2PolygonContact", b2PolygonContact);
        }
    }
});
System.register("Box2D/Dynamics/Contacts/b2ContactFactory", ["Box2D/Common/b2Settings", "Box2D/Dynamics/Contacts/b2ChainAndCircleContact", "Box2D/Dynamics/Contacts/b2ChainAndPolygonContact", "Box2D/Dynamics/Contacts/b2CircleContact", "Box2D/Dynamics/Contacts/b2EdgeAndCircleContact", "Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact", "Box2D/Dynamics/Contacts/b2PolygonAndCircleContact", "Box2D/Dynamics/Contacts/b2PolygonContact"], function(exports_45, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var b2Settings, b2ChainAndCircleContact_1, b2ChainAndPolygonContact_1, b2CircleContact_1, b2EdgeAndCircleContact_1, b2EdgeAndPolygonContact_1, b2PolygonAndCircleContact_1, b2PolygonContact_1;
    var b2ContactRegister, b2ContactFactory;
    return {
        setters:[
            function (b2Settings_40) {
                b2Settings = b2Settings_40;
            },
            function (b2ChainAndCircleContact_1_1) {
                b2ChainAndCircleContact_1 = b2ChainAndCircleContact_1_1;
            },
            function (b2ChainAndPolygonContact_1_1) {
                b2ChainAndPolygonContact_1 = b2ChainAndPolygonContact_1_1;
            },
            function (b2CircleContact_1_1) {
                b2CircleContact_1 = b2CircleContact_1_1;
            },
            function (b2EdgeAndCircleContact_1_1) {
                b2EdgeAndCircleContact_1 = b2EdgeAndCircleContact_1_1;
            },
            function (b2EdgeAndPolygonContact_1_1) {
                b2EdgeAndPolygonContact_1 = b2EdgeAndPolygonContact_1_1;
            },
            function (b2PolygonAndCircleContact_1_1) {
                b2PolygonAndCircleContact_1 = b2PolygonAndCircleContact_1_1;
            },
            function (b2PolygonContact_1_1) {
                b2PolygonContact_1 = b2PolygonContact_1_1;
            }],
        execute: function() {
            b2ContactRegister = class b2ContactRegister {
                constructor() {
                    this.pool = null;
                    this.createFcn = null;
                    this.destroyFcn = null;
                    this.primary = false;
                }
            };
            exports_45("b2ContactRegister", b2ContactRegister);
            b2ContactFactory = class b2ContactFactory {
                constructor(allocator) {
                    this.m_allocator = null;
                    this.m_allocator = allocator;
                    this.InitializeRegisters();
                }
                AddType(createFcn, destroyFcn, type1, type2) {
                    const that = this;
                    const pool = b2Settings.b2MakeArray(256, function (i) { return createFcn(that.m_allocator); }); // TODO: b2Settings
                    const poolCreateFcn = function (allocator) {
                        if (pool.length > 0) {
                            return pool.pop();
                        }
                        return createFcn(allocator);
                    };
                    const poolDestroyFcn = function (contact, allocator) {
                        pool.push(contact);
                    };
                    this.m_registers[type1][type2].pool = pool;
                    this.m_registers[type1][type2].createFcn = poolCreateFcn;
                    this.m_registers[type1][type2].destroyFcn = poolDestroyFcn;
                    this.m_registers[type1][type2].primary = true;
                    if (type1 !== type2) {
                        this.m_registers[type2][type1].pool = pool;
                        this.m_registers[type2][type1].createFcn = poolCreateFcn;
                        this.m_registers[type2][type1].destroyFcn = poolDestroyFcn;
                        this.m_registers[type2][type1].primary = false;
                    }
                    /*
                    this.m_registers[type1][type2].createFcn = createFcn;
                    this.m_registers[type1][type2].destroyFcn = destroyFcn;
                    this.m_registers[type1][type2].primary = true;
                
                    if (type1 !== type2) {
                      this.m_registers[type2][type1].createFcn = createFcn;
                      this.m_registers[type2][type1].destroyFcn = destroyFcn;
                      this.m_registers[type2][type1].primary = false;
                    }
                    */
                }
                InitializeRegisters() {
                    this.m_registers = new Array(4 /* e_shapeTypeCount */);
                    for (let i = 0; i < 4 /* e_shapeTypeCount */; i++) {
                        this.m_registers[i] = new Array(4 /* e_shapeTypeCount */);
                        for (let j = 0; j < 4 /* e_shapeTypeCount */; j++) {
                            this.m_registers[i][j] = new b2ContactRegister();
                        }
                    }
                    this.AddType(b2CircleContact_1.b2CircleContact.Create, b2CircleContact_1.b2CircleContact.Destroy, 0 /* e_circleShape */, 0 /* e_circleShape */);
                    this.AddType(b2PolygonAndCircleContact_1.b2PolygonAndCircleContact.Create, b2PolygonAndCircleContact_1.b2PolygonAndCircleContact.Destroy, 2 /* e_polygonShape */, 0 /* e_circleShape */);
                    this.AddType(b2PolygonContact_1.b2PolygonContact.Create, b2PolygonContact_1.b2PolygonContact.Destroy, 2 /* e_polygonShape */, 2 /* e_polygonShape */);
                    this.AddType(b2EdgeAndCircleContact_1.b2EdgeAndCircleContact.Create, b2EdgeAndCircleContact_1.b2EdgeAndCircleContact.Destroy, 1 /* e_edgeShape */, 0 /* e_circleShape */);
                    this.AddType(b2EdgeAndPolygonContact_1.b2EdgeAndPolygonContact.Create, b2EdgeAndPolygonContact_1.b2EdgeAndPolygonContact.Destroy, 1 /* e_edgeShape */, 2 /* e_polygonShape */);
                    this.AddType(b2ChainAndCircleContact_1.b2ChainAndCircleContact.Create, b2ChainAndCircleContact_1.b2ChainAndCircleContact.Destroy, 3 /* e_chainShape */, 0 /* e_circleShape */);
                    this.AddType(b2ChainAndPolygonContact_1.b2ChainAndPolygonContact.Create, b2ChainAndPolygonContact_1.b2ChainAndPolygonContact.Destroy, 3 /* e_chainShape */, 2 /* e_polygonShape */);
                }
                Create(fixtureA, indexA, fixtureB, indexB) {
                    const type1 = fixtureA.GetType();
                    const type2 = fixtureB.GetType();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= type1 && type1 < 4 /* e_shapeTypeCount */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= type2 && type2 < 4 /* e_shapeTypeCount */);
                    }
                    const reg = this.m_registers[type1][type2];
                    if (reg.primary) {
                        const c = reg.createFcn(this.m_allocator);
                        c.Reset(fixtureA, indexA, fixtureB, indexB);
                        return c;
                    }
                    else {
                        const c = reg.createFcn(this.m_allocator);
                        c.Reset(fixtureB, indexB, fixtureA, indexA);
                        return c;
                    }
                }
                Destroy(contact) {
                    const fixtureA = contact.m_fixtureA;
                    const fixtureB = contact.m_fixtureB;
                    if (contact.m_manifold.pointCount > 0 &&
                        fixtureA.IsSensor() === false &&
                        fixtureB.IsSensor() === false) {
                        fixtureA.GetBody().SetAwake(true);
                        fixtureB.GetBody().SetAwake(true);
                    }
                    const typeA = fixtureA.GetType();
                    const typeB = fixtureB.GetType();
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= typeA && typeB < 4 /* e_shapeTypeCount */);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(0 <= typeA && typeB < 4 /* e_shapeTypeCount */);
                    }
                    const reg = this.m_registers[typeA][typeB];
                    reg.destroyFcn(contact, this.m_allocator);
                }
            };
            exports_45("b2ContactFactory", b2ContactFactory);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/b2ContactManager", ["Box2D/Common/b2Settings", "Box2D/Collision/b2BroadPhase", "Box2D/Dynamics/Contacts/b2ContactFactory", "Box2D/Dynamics/b2Fixture", "Box2D/Dynamics/b2WorldCallbacks"], function(exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var b2Settings, b2BroadPhase_1, b2ContactFactory_1, b2Fixture_2, b2WorldCallbacks_1, b2WorldCallbacks_2;
    var b2ContactManager;
    return {
        setters:[
            function (b2Settings_41) {
                b2Settings = b2Settings_41;
            },
            function (b2BroadPhase_1_1) {
                b2BroadPhase_1 = b2BroadPhase_1_1;
            },
            function (b2ContactFactory_1_1) {
                b2ContactFactory_1 = b2ContactFactory_1_1;
            },
            function (b2Fixture_2_1) {
                b2Fixture_2 = b2Fixture_2_1;
            },
            function (b2WorldCallbacks_1_1) {
                b2WorldCallbacks_1 = b2WorldCallbacks_1_1;
                b2WorldCallbacks_2 = b2WorldCallbacks_1_1;
            }],
        execute: function() {
            // Delegate of b2World.
            b2ContactManager = class b2ContactManager {
                constructor() {
                    this.m_broadPhase = new b2BroadPhase_1.b2BroadPhase();
                    this.m_contactList = null;
                    this.m_contactCount = 0;
                    this.m_contactFilter = b2WorldCallbacks_1.b2ContactFilter.b2_defaultFilter;
                    this.m_contactListener = b2WorldCallbacks_2.b2ContactListener.b2_defaultListener;
                    this.m_allocator = null;
                    this.m_contactFactory = null;
                    this.m_contactFactory = new b2ContactFactory_1.b2ContactFactory(this.m_allocator);
                }
                // Broad-phase callback.
                AddPair(proxyUserDataA, proxyUserDataB) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(proxyUserDataA instanceof b2Fixture_2.b2FixtureProxy);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(proxyUserDataB instanceof b2Fixture_2.b2FixtureProxy);
                    }
                    const proxyA = proxyUserDataA; // (proxyUserDataA instanceof b2FixtureProxy ? proxyUserDataA : null);
                    const proxyB = proxyUserDataB; // (proxyUserDataB instanceof b2FixtureProxy ? proxyUserDataB : null);
                    let fixtureA = proxyA.fixture;
                    let fixtureB = proxyB.fixture;
                    let indexA = proxyA.childIndex;
                    let indexB = proxyB.childIndex;
                    let bodyA = fixtureA.GetBody();
                    let bodyB = fixtureB.GetBody();
                    // Are the fixtures on the same body?
                    if (bodyA === bodyB) {
                        return;
                    }
                    // TODO_ERIN use a hash table to remove a potential bottleneck when both
                    // bodies have a lot of contacts.
                    // Does a contact already exist?
                    let edge = bodyB.GetContactList();
                    while (edge) {
                        if (edge.other === bodyA) {
                            const fA = edge.contact.GetFixtureA();
                            const fB = edge.contact.GetFixtureB();
                            const iA = edge.contact.GetChildIndexA();
                            const iB = edge.contact.GetChildIndexB();
                            if (fA === fixtureA && fB === fixtureB && iA === indexA && iB === indexB) {
                                // A contact already exists.
                                return;
                            }
                            if (fA === fixtureB && fB === fixtureA && iA === indexB && iB === indexA) {
                                // A contact already exists.
                                return;
                            }
                        }
                        edge = edge.next;
                    }
                    // Does a joint override collision? Is at least one body dynamic?
                    if (bodyB.ShouldCollide(bodyA) === false) {
                        return;
                    }
                    // Check user filtering.
                    if (this.m_contactFilter && this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) === false) {
                        return;
                    }
                    // Call the factory.
                    const c = this.m_contactFactory.Create(fixtureA, indexA, fixtureB, indexB);
                    if (c === null) {
                        return;
                    }
                    // Contact creation may swap fixtures.
                    fixtureA = c.GetFixtureA();
                    fixtureB = c.GetFixtureB();
                    indexA = c.GetChildIndexA();
                    indexB = c.GetChildIndexB();
                    bodyA = fixtureA.m_body;
                    bodyB = fixtureB.m_body;
                    // Insert into the world.
                    c.m_prev = null;
                    c.m_next = this.m_contactList;
                    if (this.m_contactList !== null) {
                        this.m_contactList.m_prev = c;
                    }
                    this.m_contactList = c;
                    // Connect to island graph.
                    // Connect to body A
                    c.m_nodeA.contact = c;
                    c.m_nodeA.other = bodyB;
                    c.m_nodeA.prev = null;
                    c.m_nodeA.next = bodyA.m_contactList;
                    if (bodyA.m_contactList !== null) {
                        bodyA.m_contactList.prev = c.m_nodeA;
                    }
                    bodyA.m_contactList = c.m_nodeA;
                    // Connect to body B
                    c.m_nodeB.contact = c;
                    c.m_nodeB.other = bodyA;
                    c.m_nodeB.prev = null;
                    c.m_nodeB.next = bodyB.m_contactList;
                    if (bodyB.m_contactList !== null) {
                        bodyB.m_contactList.prev = c.m_nodeB;
                    }
                    bodyB.m_contactList = c.m_nodeB;
                    // Wake up the bodies
                    if (fixtureA.IsSensor() === false && fixtureB.IsSensor() === false) {
                        bodyA.SetAwake(true);
                        bodyB.SetAwake(true);
                    }
                    ++this.m_contactCount;
                }
                FindNewContacts() {
                    this.m_broadPhase.UpdatePairs(this);
                }
                Destroy(c) {
                    const fixtureA = c.GetFixtureA();
                    const fixtureB = c.GetFixtureB();
                    const bodyA = fixtureA.GetBody();
                    const bodyB = fixtureB.GetBody();
                    if (this.m_contactListener && c.IsTouching()) {
                        this.m_contactListener.EndContact(c);
                    }
                    // Remove from the world.
                    if (c.m_prev) {
                        c.m_prev.m_next = c.m_next;
                    }
                    if (c.m_next) {
                        c.m_next.m_prev = c.m_prev;
                    }
                    if (c === this.m_contactList) {
                        this.m_contactList = c.m_next;
                    }
                    // Remove from body 1
                    if (c.m_nodeA.prev) {
                        c.m_nodeA.prev.next = c.m_nodeA.next;
                    }
                    if (c.m_nodeA.next) {
                        c.m_nodeA.next.prev = c.m_nodeA.prev;
                    }
                    if (c.m_nodeA === bodyA.m_contactList) {
                        bodyA.m_contactList = c.m_nodeA.next;
                    }
                    // Remove from body 2
                    if (c.m_nodeB.prev) {
                        c.m_nodeB.prev.next = c.m_nodeB.next;
                    }
                    if (c.m_nodeB.next) {
                        c.m_nodeB.next.prev = c.m_nodeB.prev;
                    }
                    if (c.m_nodeB === bodyB.m_contactList) {
                        bodyB.m_contactList = c.m_nodeB.next;
                    }
                    // Call the factory.
                    this.m_contactFactory.Destroy(c);
                    --this.m_contactCount;
                }
                // This is the top level collision call for the time step. Here
                // all the narrow phase collision is processed for the world
                // contact list.
                Collide() {
                    // Update awake contacts.
                    let c = this.m_contactList;
                    while (c) {
                        const fixtureA = c.GetFixtureA();
                        const fixtureB = c.GetFixtureB();
                        const indexA = c.GetChildIndexA();
                        const indexB = c.GetChildIndexB();
                        const bodyA = fixtureA.GetBody();
                        const bodyB = fixtureB.GetBody();
                        // Is this contact flagged for filtering?
                        if (c.m_flags & 8 /* e_filterFlag */) {
                            // Should these bodies collide?
                            if (bodyB.ShouldCollide(bodyA) === false) {
                                const cNuke = c;
                                c = cNuke.m_next;
                                this.Destroy(cNuke);
                                continue;
                            }
                            // Check user filtering.
                            if (this.m_contactFilter && this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) === false) {
                                const cNuke = c;
                                c = cNuke.m_next;
                                this.Destroy(cNuke);
                                continue;
                            }
                            // Clear the filtering flag.
                            c.m_flags &= ~8 /* e_filterFlag */;
                        }
                        const activeA = bodyA.IsAwake() && bodyA.m_type !== 0 /* b2_staticBody */;
                        const activeB = bodyB.IsAwake() && bodyB.m_type !== 0 /* b2_staticBody */;
                        // At least one body must be awake and it must be dynamic or kinematic.
                        if (activeA === false && activeB === false) {
                            c = c.m_next;
                            continue;
                        }
                        const proxyA = fixtureA.m_proxies[indexA].proxy;
                        const proxyB = fixtureB.m_proxies[indexB].proxy;
                        const overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
                        // Here we destroy contacts that cease to overlap in the broad-phase.
                        if (overlap === false) {
                            const cNuke = c;
                            c = cNuke.m_next;
                            this.Destroy(cNuke);
                            continue;
                        }
                        // The contact persists.
                        c.Update(this.m_contactListener);
                        c = c.m_next;
                    }
                }
            };
            exports_46("b2ContactManager", b2ContactManager);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/Contacts/b2ContactSolver", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Collision/b2Collision", "Box2D/Dynamics/b2TimeStep"], function(exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var b2Settings, b2Math_31, b2Collision_9, b2TimeStep_1;
    var b2VelocityConstraintPoint, b2ContactVelocityConstraint, b2ContactPositionConstraint, b2ContactSolverDef, b2PositionSolverManifold, b2ContactSolver;
    return {
        setters:[
            function (b2Settings_42) {
                b2Settings = b2Settings_42;
            },
            function (b2Math_31_1) {
                b2Math_31 = b2Math_31_1;
            },
            function (b2Collision_9_1) {
                b2Collision_9 = b2Collision_9_1;
            },
            function (b2TimeStep_1_1) {
                b2TimeStep_1 = b2TimeStep_1_1;
            }],
        execute: function() {
            b2VelocityConstraintPoint = class b2VelocityConstraintPoint {
                constructor() {
                    this.rA = new b2Math_31.b2Vec2();
                    this.rB = new b2Math_31.b2Vec2();
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.normalMass = 0;
                    this.tangentMass = 0;
                    this.velocityBias = 0;
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2VelocityConstraintPoint(); });
                }
            };
            exports_47("b2VelocityConstraintPoint", b2VelocityConstraintPoint);
            b2ContactVelocityConstraint = class b2ContactVelocityConstraint {
                constructor() {
                    this.points = b2VelocityConstraintPoint.MakeArray(b2Settings.b2_maxManifoldPoints);
                    this.normal = new b2Math_31.b2Vec2();
                    this.tangent = new b2Math_31.b2Vec2();
                    this.normalMass = new b2Math_31.b2Mat22();
                    this.K = new b2Math_31.b2Mat22();
                    this.indexA = 0;
                    this.indexB = 0;
                    this.invMassA = 0;
                    this.invMassB = 0;
                    this.invIA = 0;
                    this.invIB = 0;
                    this.friction = 0;
                    this.restitution = 0;
                    this.tangentSpeed = 0;
                    this.pointCount = 0;
                    this.contactIndex = 0;
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2ContactVelocityConstraint(); });
                }
            };
            exports_47("b2ContactVelocityConstraint", b2ContactVelocityConstraint);
            b2ContactPositionConstraint = class b2ContactPositionConstraint {
                constructor() {
                    this.localPoints = b2Math_31.b2Vec2.MakeArray(b2Settings.b2_maxManifoldPoints);
                    this.localNormal = new b2Math_31.b2Vec2();
                    this.localPoint = new b2Math_31.b2Vec2();
                    this.indexA = 0;
                    this.indexB = 0;
                    this.invMassA = 0;
                    this.invMassB = 0;
                    this.localCenterA = new b2Math_31.b2Vec2();
                    this.localCenterB = new b2Math_31.b2Vec2();
                    this.invIA = 0;
                    this.invIB = 0;
                    this.type = -1 /* e_unknown */;
                    this.radiusA = 0;
                    this.radiusB = 0;
                    this.pointCount = 0;
                }
                static MakeArray(length) {
                    return b2Settings.b2MakeArray(length, function (i) { return new b2ContactPositionConstraint(); });
                }
            };
            exports_47("b2ContactPositionConstraint", b2ContactPositionConstraint);
            b2ContactSolverDef = class b2ContactSolverDef {
                constructor() {
                    this.step = new b2TimeStep_1.b2TimeStep();
                    this.contacts = null;
                    this.count = 0;
                    this.positions = null;
                    this.velocities = null;
                    this.allocator = null;
                }
            };
            exports_47("b2ContactSolverDef", b2ContactSolverDef);
            b2PositionSolverManifold = class b2PositionSolverManifold {
                constructor() {
                    this.normal = new b2Math_31.b2Vec2();
                    this.point = new b2Math_31.b2Vec2();
                    this.separation = 0;
                }
                Initialize(pc, xfA, xfB, index) {
                    const pointA = b2PositionSolverManifold.Initialize_s_pointA;
                    const pointB = b2PositionSolverManifold.Initialize_s_pointB;
                    const planePoint = b2PositionSolverManifold.Initialize_s_planePoint;
                    const clipPoint = b2PositionSolverManifold.Initialize_s_clipPoint;
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(pc.pointCount > 0);
                    }
                    switch (pc.type) {
                        case 0 /* e_circles */:
                            {
                                // b2Vec2 pointA = b2Mul(xfA, pc->localPoint);
                                b2Math_31.b2Transform.MulXV(xfA, pc.localPoint, pointA);
                                // b2Vec2 pointB = b2Mul(xfB, pc->localPoints[0]);
                                b2Math_31.b2Transform.MulXV(xfB, pc.localPoints[0], pointB);
                                // normal = pointB - pointA;
                                // normal.Normalize();
                                b2Math_31.b2Vec2.SubVV(pointB, pointA, this.normal).SelfNormalize();
                                // point = 0.5f * (pointA + pointB);
                                b2Math_31.b2Vec2.MidVV(pointA, pointB, this.point);
                                // separation = b2Dot(pointB - pointA, normal) - pc->radius;
                                this.separation = b2Math_31.b2Vec2.DotVV(b2Math_31.b2Vec2.SubVV(pointB, pointA, b2Math_31.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                            }
                            break;
                        case 1 /* e_faceA */:
                            {
                                // normal = b2Mul(xfA.q, pc->localNormal);
                                b2Math_31.b2Rot.MulRV(xfA.q, pc.localNormal, this.normal);
                                // b2Vec2 planePoint = b2Mul(xfA, pc->localPoint);
                                b2Math_31.b2Transform.MulXV(xfA, pc.localPoint, planePoint);
                                // b2Vec2 clipPoint = b2Mul(xfB, pc->localPoints[index]);
                                b2Math_31.b2Transform.MulXV(xfB, pc.localPoints[index], clipPoint);
                                // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                                this.separation = b2Math_31.b2Vec2.DotVV(b2Math_31.b2Vec2.SubVV(clipPoint, planePoint, b2Math_31.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                                // point = clipPoint;
                                this.point.Copy(clipPoint);
                            }
                            break;
                        case 2 /* e_faceB */:
                            {
                                // normal = b2Mul(xfB.q, pc->localNormal);
                                b2Math_31.b2Rot.MulRV(xfB.q, pc.localNormal, this.normal);
                                // b2Vec2 planePoint = b2Mul(xfB, pc->localPoint);
                                b2Math_31.b2Transform.MulXV(xfB, pc.localPoint, planePoint);
                                // b2Vec2 clipPoint = b2Mul(xfA, pc->localPoints[index]);
                                b2Math_31.b2Transform.MulXV(xfA, pc.localPoints[index], clipPoint);
                                // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                                this.separation = b2Math_31.b2Vec2.DotVV(b2Math_31.b2Vec2.SubVV(clipPoint, planePoint, b2Math_31.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                                // point = clipPoint;
                                this.point.Copy(clipPoint);
                                // Ensure normal points from A to B
                                // normal = -normal;
                                this.normal.SelfNeg();
                            }
                            break;
                    }
                }
            };
            b2PositionSolverManifold.Initialize_s_pointA = new b2Math_31.b2Vec2();
            b2PositionSolverManifold.Initialize_s_pointB = new b2Math_31.b2Vec2();
            b2PositionSolverManifold.Initialize_s_planePoint = new b2Math_31.b2Vec2();
            b2PositionSolverManifold.Initialize_s_clipPoint = new b2Math_31.b2Vec2();
            exports_47("b2PositionSolverManifold", b2PositionSolverManifold);
            b2ContactSolver = class b2ContactSolver {
                constructor() {
                    this.m_step = new b2TimeStep_1.b2TimeStep();
                    this.m_positions = null;
                    this.m_velocities = null;
                    this.m_allocator = null;
                    this.m_positionConstraints = b2ContactPositionConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_velocityConstraints = b2ContactVelocityConstraint.MakeArray(1024); // TODO: b2Settings
                    this.m_contacts = null;
                    this.m_count = 0;
                }
                Initialize(def) {
                    this.m_step.Copy(def.step);
                    this.m_allocator = def.allocator;
                    this.m_count = def.count;
                    // TODO:
                    if (this.m_positionConstraints.length < this.m_count) {
                        const new_length = b2Math_31.b2Max(this.m_positionConstraints.length * 2, this.m_count);
                        if (b2Settings.DEBUG) {
                            console.log("b2ContactSolver.m_positionConstraints: " + new_length);
                        }
                        while (this.m_positionConstraints.length < new_length) {
                            this.m_positionConstraints[this.m_positionConstraints.length] = new b2ContactPositionConstraint();
                        }
                    }
                    // TODO:
                    if (this.m_velocityConstraints.length < this.m_count) {
                        const new_length = b2Math_31.b2Max(this.m_velocityConstraints.length * 2, this.m_count);
                        if (b2Settings.DEBUG) {
                            console.log("b2ContactSolver.m_velocityConstraints: " + new_length);
                        }
                        while (this.m_velocityConstraints.length < new_length) {
                            this.m_velocityConstraints[this.m_velocityConstraints.length] = new b2ContactVelocityConstraint();
                        }
                    }
                    this.m_positions = def.positions;
                    this.m_velocities = def.velocities;
                    this.m_contacts = def.contacts;
                    let i;
                    let ict;
                    let j;
                    let jct;
                    let contact;
                    let fixtureA;
                    let fixtureB;
                    let shapeA;
                    let shapeB;
                    let radiusA;
                    let radiusB;
                    let bodyA;
                    let bodyB;
                    let manifold;
                    let pointCount;
                    let vc;
                    let pc;
                    let cp;
                    let vcp;
                    // Initialize position independent portions of the constraints.
                    for (i = 0, ict = this.m_count; i < ict; ++i) {
                        contact = this.m_contacts[i];
                        fixtureA = contact.m_fixtureA;
                        fixtureB = contact.m_fixtureB;
                        shapeA = fixtureA.GetShape();
                        shapeB = fixtureB.GetShape();
                        radiusA = shapeA.m_radius;
                        radiusB = shapeB.m_radius;
                        bodyA = fixtureA.GetBody();
                        bodyB = fixtureB.GetBody();
                        manifold = contact.GetManifold();
                        pointCount = manifold.pointCount;
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(pointCount > 0);
                        }
                        vc = this.m_velocityConstraints[i];
                        vc.friction = contact.m_friction;
                        vc.restitution = contact.m_restitution;
                        vc.tangentSpeed = contact.m_tangentSpeed;
                        vc.indexA = bodyA.m_islandIndex;
                        vc.indexB = bodyB.m_islandIndex;
                        vc.invMassA = bodyA.m_invMass;
                        vc.invMassB = bodyB.m_invMass;
                        vc.invIA = bodyA.m_invI;
                        vc.invIB = bodyB.m_invI;
                        vc.contactIndex = i;
                        vc.pointCount = pointCount;
                        vc.K.SetZero();
                        vc.normalMass.SetZero();
                        pc = this.m_positionConstraints[i];
                        pc.indexA = bodyA.m_islandIndex;
                        pc.indexB = bodyB.m_islandIndex;
                        pc.invMassA = bodyA.m_invMass;
                        pc.invMassB = bodyB.m_invMass;
                        pc.localCenterA.Copy(bodyA.m_sweep.localCenter);
                        pc.localCenterB.Copy(bodyB.m_sweep.localCenter);
                        pc.invIA = bodyA.m_invI;
                        pc.invIB = bodyB.m_invI;
                        pc.localNormal.Copy(manifold.localNormal);
                        pc.localPoint.Copy(manifold.localPoint);
                        pc.pointCount = pointCount;
                        pc.radiusA = radiusA;
                        pc.radiusB = radiusB;
                        pc.type = manifold.type;
                        for (j = 0, jct = pointCount; j < jct; ++j) {
                            cp = manifold.points[j];
                            vcp = vc.points[j];
                            if (this.m_step.warmStarting) {
                                vcp.normalImpulse = this.m_step.dtRatio * cp.normalImpulse;
                                vcp.tangentImpulse = this.m_step.dtRatio * cp.tangentImpulse;
                            }
                            else {
                                vcp.normalImpulse = 0;
                                vcp.tangentImpulse = 0;
                            }
                            vcp.rA.SetZero();
                            vcp.rB.SetZero();
                            vcp.normalMass = 0;
                            vcp.tangentMass = 0;
                            vcp.velocityBias = 0;
                            pc.localPoints[j].Copy(cp.localPoint);
                        }
                    }
                    return this;
                }
                InitializeVelocityConstraints() {
                    let i;
                    let ict;
                    let j;
                    let jct;
                    let vc;
                    let pc;
                    let radiusA;
                    let radiusB;
                    let manifold;
                    let indexA;
                    let indexB;
                    let mA;
                    let mB;
                    let iA;
                    let iB;
                    let localCenterA;
                    let localCenterB;
                    let cA;
                    let aA;
                    let vA;
                    let wA;
                    let cB;
                    let aB;
                    let vB;
                    let wB;
                    const xfA = b2ContactSolver.InitializeVelocityConstraints_s_xfA;
                    const xfB = b2ContactSolver.InitializeVelocityConstraints_s_xfB;
                    const worldManifold = b2ContactSolver.InitializeVelocityConstraints_s_worldManifold;
                    let pointCount;
                    let vcp;
                    let rnA;
                    let rnB;
                    let kNormal;
                    let tangent;
                    let rtA;
                    let rtB;
                    let kTangent;
                    let vRel;
                    let vcp1;
                    let vcp2;
                    let rn1A;
                    let rn1B;
                    let rn2A;
                    let rn2B;
                    let k11;
                    let k22;
                    let k12;
                    const k_maxConditionNumber = 1000;
                    for (i = 0, ict = this.m_count; i < ict; ++i) {
                        vc = this.m_velocityConstraints[i];
                        pc = this.m_positionConstraints[i];
                        radiusA = pc.radiusA;
                        radiusB = pc.radiusB;
                        manifold = this.m_contacts[vc.contactIndex].GetManifold();
                        indexA = vc.indexA;
                        indexB = vc.indexB;
                        mA = vc.invMassA;
                        mB = vc.invMassB;
                        iA = vc.invIA;
                        iB = vc.invIB;
                        localCenterA = pc.localCenterA;
                        localCenterB = pc.localCenterB;
                        cA = this.m_positions[indexA].c;
                        aA = this.m_positions[indexA].a;
                        vA = this.m_velocities[indexA].v;
                        wA = this.m_velocities[indexA].w;
                        cB = this.m_positions[indexB].c;
                        aB = this.m_positions[indexB].a;
                        vB = this.m_velocities[indexB].v;
                        wB = this.m_velocities[indexB].w;
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(manifold.pointCount > 0);
                        }
                        xfA.q.SetAngleRadians(aA);
                        xfB.q.SetAngleRadians(aB);
                        b2Math_31.b2Vec2.SubVV(cA, b2Math_31.b2Rot.MulRV(xfA.q, localCenterA, b2Math_31.b2Vec2.s_t0), xfA.p);
                        b2Math_31.b2Vec2.SubVV(cB, b2Math_31.b2Rot.MulRV(xfB.q, localCenterB, b2Math_31.b2Vec2.s_t0), xfB.p);
                        worldManifold.Initialize(manifold, xfA, radiusA, xfB, radiusB);
                        vc.normal.Copy(worldManifold.normal);
                        b2Math_31.b2Vec2.CrossVOne(vc.normal, vc.tangent); // compute from normal
                        pointCount = vc.pointCount;
                        for (j = 0, jct = pointCount; j < jct; ++j) {
                            vcp = vc.points[j];
                            // vcp->rA = worldManifold.points[j] - cA;
                            b2Math_31.b2Vec2.SubVV(worldManifold.points[j], cA, vcp.rA);
                            // vcp->rB = worldManifold.points[j] - cB;
                            b2Math_31.b2Vec2.SubVV(worldManifold.points[j], cB, vcp.rB);
                            rnA = b2Math_31.b2Vec2.CrossVV(vcp.rA, vc.normal);
                            rnB = b2Math_31.b2Vec2.CrossVV(vcp.rB, vc.normal);
                            kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            vcp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
                            // b2Vec2 tangent = b2Cross(vc->normal, 1.0f);
                            tangent = vc.tangent; // precomputed from normal
                            rtA = b2Math_31.b2Vec2.CrossVV(vcp.rA, tangent);
                            rtB = b2Math_31.b2Vec2.CrossVV(vcp.rB, tangent);
                            kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
                            vcp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
                            // Setup a velocity bias for restitution.
                            vcp.velocityBias = 0;
                            // float32 vRel = b2Dot(vc->normal, vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA));
                            vRel = b2Math_31.b2Vec2.DotVV(vc.normal, b2Math_31.b2Vec2.SubVV(b2Math_31.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_31.b2Vec2.s_t0), b2Math_31.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_31.b2Vec2.s_t1), b2Math_31.b2Vec2.s_t0));
                            if (vRel < (-b2Settings.b2_velocityThreshold)) {
                                vcp.velocityBias += (-vc.restitution * vRel);
                            }
                        }
                        // If we have two points, then prepare the block solver.
                        if (vc.pointCount === 2) {
                            vcp1 = vc.points[0];
                            vcp2 = vc.points[1];
                            rn1A = b2Math_31.b2Vec2.CrossVV(vcp1.rA, vc.normal);
                            rn1B = b2Math_31.b2Vec2.CrossVV(vcp1.rB, vc.normal);
                            rn2A = b2Math_31.b2Vec2.CrossVV(vcp2.rA, vc.normal);
                            rn2B = b2Math_31.b2Vec2.CrossVV(vcp2.rB, vc.normal);
                            k11 = mA + mB + iA * rn1A * rn1A + iB * rn1B * rn1B;
                            k22 = mA + mB + iA * rn2A * rn2A + iB * rn2B * rn2B;
                            k12 = mA + mB + iA * rn1A * rn2A + iB * rn1B * rn2B;
                            // Ensure a reasonable condition number.
                            // float32 k_maxConditionNumber = 1000.0f;
                            if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
                                // K is safe to invert.
                                vc.K.ex.SetXY(k11, k12);
                                vc.K.ey.SetXY(k12, k22);
                                vc.K.GetInverse(vc.normalMass);
                            }
                            else {
                                // The constraints are redundant, just use one.
                                // TODO_ERIN use deepest?
                                vc.pointCount = 1;
                            }
                        }
                    }
                }
                WarmStart() {
                    let i;
                    let ict;
                    let j;
                    let jct;
                    let vc;
                    let indexA;
                    let indexB;
                    let mA;
                    let iA;
                    let mB;
                    let iB;
                    let pointCount;
                    let vA;
                    let wA;
                    let vB;
                    let wB;
                    let normal;
                    let tangent;
                    let vcp;
                    const P = b2ContactSolver.WarmStart_s_P;
                    // Warm start.
                    for (i = 0, ict = this.m_count; i < ict; ++i) {
                        vc = this.m_velocityConstraints[i];
                        indexA = vc.indexA;
                        indexB = vc.indexB;
                        mA = vc.invMassA;
                        iA = vc.invIA;
                        mB = vc.invMassB;
                        iB = vc.invIB;
                        pointCount = vc.pointCount;
                        vA = this.m_velocities[indexA].v;
                        wA = this.m_velocities[indexA].w;
                        vB = this.m_velocities[indexB].v;
                        wB = this.m_velocities[indexB].w;
                        normal = vc.normal;
                        // b2Vec2 tangent = b2Cross(normal, 1.0f);
                        tangent = vc.tangent; // precomputed from normal
                        for (j = 0, jct = pointCount; j < jct; ++j) {
                            vcp = vc.points[j];
                            // b2Vec2 P = vcp->normalImpulse * normal + vcp->tangentImpulse * tangent;
                            b2Math_31.b2Vec2.AddVV(b2Math_31.b2Vec2.MulSV(vcp.normalImpulse, normal, b2Math_31.b2Vec2.s_t0), b2Math_31.b2Vec2.MulSV(vcp.tangentImpulse, tangent, b2Math_31.b2Vec2.s_t1), P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_31.b2Vec2.CrossVV(vcp.rA, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_31.b2Vec2.CrossVV(vcp.rB, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                        }
                        // this.m_velocities[indexA].v = vA;
                        this.m_velocities[indexA].w = wA;
                        // this.m_velocities[indexB].v = vB;
                        this.m_velocities[indexB].w = wB;
                    }
                }
                SolveVelocityConstraints() {
                    let i;
                    let ict;
                    let j;
                    let jct;
                    let vc;
                    let indexA;
                    let indexB;
                    let mA;
                    let iA;
                    let mB;
                    let iB;
                    let pointCount;
                    let vA;
                    let wA;
                    let vB;
                    let wB;
                    let normal;
                    let tangent;
                    let friction;
                    let vcp;
                    const dv = b2ContactSolver.SolveVelocityConstraints_s_dv;
                    const dv1 = b2ContactSolver.SolveVelocityConstraints_s_dv1;
                    const dv2 = b2ContactSolver.SolveVelocityConstraints_s_dv2;
                    let vt;
                    let vn;
                    let lambda;
                    let maxFriction;
                    let newImpulse;
                    const P = b2ContactSolver.SolveVelocityConstraints_s_P;
                    let cp1;
                    let cp2;
                    const a = b2ContactSolver.SolveVelocityConstraints_s_a;
                    const b = b2ContactSolver.SolveVelocityConstraints_s_b;
                    let vn1;
                    let vn2;
                    const x = b2ContactSolver.SolveVelocityConstraints_s_x;
                    const d = b2ContactSolver.SolveVelocityConstraints_s_d;
                    const P1 = b2ContactSolver.SolveVelocityConstraints_s_P1;
                    const P2 = b2ContactSolver.SolveVelocityConstraints_s_P2;
                    const P1P2 = b2ContactSolver.SolveVelocityConstraints_s_P1P2;
                    for (i = 0, ict = this.m_count; i < ict; ++i) {
                        vc = this.m_velocityConstraints[i];
                        indexA = vc.indexA;
                        indexB = vc.indexB;
                        mA = vc.invMassA;
                        iA = vc.invIA;
                        mB = vc.invMassB;
                        iB = vc.invIB;
                        pointCount = vc.pointCount;
                        vA = this.m_velocities[indexA].v;
                        wA = this.m_velocities[indexA].w;
                        vB = this.m_velocities[indexB].v;
                        wB = this.m_velocities[indexB].w;
                        // b2Vec2 normal = vc->normal;
                        normal = vc.normal;
                        // b2Vec2 tangent = b2Cross(normal, 1.0f);
                        tangent = vc.tangent; // precomputed from normal
                        friction = vc.friction;
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(pointCount === 1 || pointCount === 2);
                        }
                        // Solve tangent constraints first because non-penetration is more important
                        // than friction.
                        for (j = 0, jct = pointCount; j < jct; ++j) {
                            vcp = vc.points[j];
                            // Relative velocity at contact
                            // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                            b2Math_31.b2Vec2.SubVV(b2Math_31.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_31.b2Vec2.s_t0), b2Math_31.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_31.b2Vec2.s_t1), dv);
                            // Compute tangent force
                            // float32 vt = b2Dot(dv, tangent) - vc->tangentSpeed;
                            vt = b2Math_31.b2Vec2.DotVV(dv, tangent) - vc.tangentSpeed;
                            lambda = vcp.tangentMass * (-vt);
                            // b2Clamp the accumulated force
                            maxFriction = friction * vcp.normalImpulse;
                            newImpulse = b2Math_31.b2Clamp(vcp.tangentImpulse + lambda, (-maxFriction), maxFriction);
                            lambda = newImpulse - vcp.tangentImpulse;
                            vcp.tangentImpulse = newImpulse;
                            // Apply contact impulse
                            // b2Vec2 P = lambda * tangent;
                            b2Math_31.b2Vec2.MulSV(lambda, tangent, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_31.b2Vec2.CrossVV(vcp.rA, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_31.b2Vec2.CrossVV(vcp.rB, P);
                        }
                        // Solve normal constraints
                        if (vc.pointCount === 1) {
                            vcp = vc.points[0];
                            // Relative velocity at contact
                            // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                            b2Math_31.b2Vec2.SubVV(b2Math_31.b2Vec2.AddVCrossSV(vB, wB, vcp.rB, b2Math_31.b2Vec2.s_t0), b2Math_31.b2Vec2.AddVCrossSV(vA, wA, vcp.rA, b2Math_31.b2Vec2.s_t1), dv);
                            // Compute normal impulse
                            // float32 vn = b2Dot(dv, normal);
                            vn = b2Math_31.b2Vec2.DotVV(dv, normal);
                            lambda = (-vcp.normalMass * (vn - vcp.velocityBias));
                            // b2Clamp the accumulated impulse
                            // float32 newImpulse = b2Max(vcp->normalImpulse + lambda, 0.0f);
                            newImpulse = b2Math_31.b2Max(vcp.normalImpulse + lambda, 0);
                            lambda = newImpulse - vcp.normalImpulse;
                            vcp.normalImpulse = newImpulse;
                            // Apply contact impulse
                            // b2Vec2 P = lambda * normal;
                            b2Math_31.b2Vec2.MulSV(lambda, normal, P);
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            // wA -= iA * b2Cross(vcp->rA, P);
                            wA -= iA * b2Math_31.b2Vec2.CrossVV(vcp.rA, P);
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            // wB += iB * b2Cross(vcp->rB, P);
                            wB += iB * b2Math_31.b2Vec2.CrossVV(vcp.rB, P);
                        }
                        else {
                            // Block solver developed in collaboration with Dirk Gregorius (back in 01/07 on Box2D_Lite).
                            // Build the mini LCP for this contact patch
                            //
                            // vn = A * x + b, vn >= 0, , vn >= 0, x >= 0 and vn_i * x_i = 0 with i = 1..2
                            //
                            // A = J * W * JT and J = ( -n, -r1 x n, n, r2 x n )
                            // b = vn0 - velocityBias
                            //
                            // The system is solved using the "Total enumeration method" (s. Murty). The complementary constraint vn_i * x_i
                            // implies that we must have in any solution either vn_i = 0 or x_i = 0. So for the 2D contact problem the cases
                            // vn1 = 0 and vn2 = 0, x1 = 0 and x2 = 0, x1 = 0 and vn2 = 0, x2 = 0 and vn1 = 0 need to be tested. The first valid
                            // solution that satisfies the problem is chosen.
                            //
                            // In order to account of the accumulated impulse 'a' (because of the iterative nature of the solver which only requires
                            // that the accumulated impulse is clamped and not the incremental impulse) we change the impulse variable (x_i).
                            //
                            // Substitute:
                            //
                            // x = a + d
                            //
                            // a := old total impulse
                            // x := new total impulse
                            // d := incremental impulse
                            //
                            // For the current iteration we extend the formula for the incremental impulse
                            // to compute the new total impulse:
                            //
                            // vn = A * d + b
                            //    = A * (x - a) + b
                            //    = A * x + b - A * a
                            //    = A * x + b'
                            // b' = b - A * a;
                            cp1 = vc.points[0];
                            cp2 = vc.points[1];
                            // b2Vec2 a(cp1->normalImpulse, cp2->normalImpulse);
                            a.SetXY(cp1.normalImpulse, cp2.normalImpulse);
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(a.x >= 0 && a.y >= 0);
                            }
                            // Relative velocity at contact
                            // b2Vec2 dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                            b2Math_31.b2Vec2.SubVV(b2Math_31.b2Vec2.AddVCrossSV(vB, wB, cp1.rB, b2Math_31.b2Vec2.s_t0), b2Math_31.b2Vec2.AddVCrossSV(vA, wA, cp1.rA, b2Math_31.b2Vec2.s_t1), dv1);
                            // b2Vec2 dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                            b2Math_31.b2Vec2.SubVV(b2Math_31.b2Vec2.AddVCrossSV(vB, wB, cp2.rB, b2Math_31.b2Vec2.s_t0), b2Math_31.b2Vec2.AddVCrossSV(vA, wA, cp2.rA, b2Math_31.b2Vec2.s_t1), dv2);
                            // Compute normal velocity
                            // float32 vn1 = b2Dot(dv1, normal);
                            vn1 = b2Math_31.b2Vec2.DotVV(dv1, normal);
                            // float32 vn2 = b2Dot(dv2, normal);
                            vn2 = b2Math_31.b2Vec2.DotVV(dv2, normal);
                            // b2Vec2 b;
                            b.x = vn1 - cp1.velocityBias;
                            b.y = vn2 - cp2.velocityBias;
                            // Compute b'
                            // b -= b2Mul(vc->K, a);
                            b.SelfSub(b2Math_31.b2Mat22.MulMV(vc.K, a, b2Math_31.b2Vec2.s_t0));
                            /*
                            #if B2_DEBUG_SOLVER === 1
                            const k_errorTol: number = 0.001;
                            #endif
                            */
                            for (;;) {
                                //
                                // Case 1: vn = 0
                                //
                                // 0 = A * x + b'
                                //
                                // Solve for x:
                                //
                                // x = - inv(A) * b'
                                //
                                // b2Vec2 x = - b2Mul(vc->normalMass, b);
                                b2Math_31.b2Mat22.MulMV(vc.normalMass, b, x).SelfNeg();
                                if (x.x >= 0 && x.y >= 0) {
                                    // Get the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_31.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_31.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_31.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_31.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_31.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_31.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                                    dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                        
                                    // Compute normal velocity
                                    vn1 = b2Dot(dv1, normal);
                                    vn2 = b2Dot(dv2, normal);
                        
                                    if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol); }
                                    if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol); }
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 2: vn1 = 0 and x2 = 0
                                //
                                //   0 = a11 * x1 + a12 * 0 + b1'
                                // vn2 = a21 * x1 + a22 * 0 + b2'
                                //
                                x.x = (-cp1.normalMass * b.x);
                                x.y = 0;
                                vn1 = 0;
                                vn2 = vc.K.ex.y * x.x + b.y;
                                if (x.x >= 0 && vn2 >= 0) {
                                    // Get the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_31.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_31.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_31.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_31.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_31.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_31.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                        
                                    // Compute normal velocity
                                    vn1 = b2Dot(dv1, normal);
                        
                                    if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol); }
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 3: vn2 = 0 and x1 = 0
                                //
                                // vn1 = a11 * 0 + a12 * x2 + b1'
                                //   0 = a21 * 0 + a22 * x2 + b2'
                                //
                                x.x = 0;
                                x.y = (-cp2.normalMass * b.y);
                                vn1 = vc.K.ey.x * x.y + b.x;
                                vn2 = 0;
                                if (x.y >= 0 && vn1 >= 0) {
                                    // Resubstitute for the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_31.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_31.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_31.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_31.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_31.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_31.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    /*
                                    #if B2_DEBUG_SOLVER === 1
                                    // Postconditions
                                    dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                        
                                    // Compute normal velocity
                                    vn2 = b2Dot(dv2, normal);
                        
                                    if (b2Settings.ENABLE_ASSERTS) { b2Settings.b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol); }
                                    #endif
                                    */
                                    break;
                                }
                                //
                                // Case 4: x1 = 0 and x2 = 0
                                //
                                // vn1 = b1
                                // vn2 = b2;
                                x.x = 0;
                                x.y = 0;
                                vn1 = b.x;
                                vn2 = b.y;
                                if (vn1 >= 0 && vn2 >= 0) {
                                    // Resubstitute for the incremental impulse
                                    // b2Vec2 d = x - a;
                                    b2Math_31.b2Vec2.SubVV(x, a, d);
                                    // Apply incremental impulse
                                    // b2Vec2 P1 = d.x * normal;
                                    b2Math_31.b2Vec2.MulSV(d.x, normal, P1);
                                    // b2Vec2 P2 = d.y * normal;
                                    b2Math_31.b2Vec2.MulSV(d.y, normal, P2);
                                    b2Math_31.b2Vec2.AddVV(P1, P2, P1P2);
                                    // vA -= mA * (P1 + P2);
                                    vA.SelfMulSub(mA, P1P2);
                                    // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                                    wA -= iA * (b2Math_31.b2Vec2.CrossVV(cp1.rA, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rA, P2));
                                    // vB += mB * (P1 + P2);
                                    vB.SelfMulAdd(mB, P1P2);
                                    // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                                    wB += iB * (b2Math_31.b2Vec2.CrossVV(cp1.rB, P1) + b2Math_31.b2Vec2.CrossVV(cp2.rB, P2));
                                    // Accumulate
                                    cp1.normalImpulse = x.x;
                                    cp2.normalImpulse = x.y;
                                    break;
                                }
                                // No solution, give up. This is hit sometimes, but it doesn't seem to matter.
                                break;
                            }
                        }
                        // this.m_velocities[indexA].v = vA;
                        this.m_velocities[indexA].w = wA;
                        // this.m_velocities[indexB].v = vB;
                        this.m_velocities[indexB].w = wB;
                    }
                }
                StoreImpulses() {
                    let i;
                    let ict;
                    let j;
                    let jct;
                    let vc;
                    let manifold;
                    for (i = 0, ict = this.m_count; i < ict; ++i) {
                        vc = this.m_velocityConstraints[i];
                        manifold = this.m_contacts[vc.contactIndex].GetManifold();
                        for (j = 0, jct = vc.pointCount; j < jct; ++j) {
                            manifold.points[j].normalImpulse = vc.points[j].normalImpulse;
                            manifold.points[j].tangentImpulse = vc.points[j].tangentImpulse;
                        }
                    }
                }
                SolvePositionConstraints() {
                    let i;
                    let ict;
                    let j;
                    let jct;
                    let pc;
                    let indexA;
                    let indexB;
                    let localCenterA;
                    let mA;
                    let iA;
                    let localCenterB;
                    let mB;
                    let iB;
                    let pointCount;
                    let cA;
                    let aA;
                    let cB;
                    let aB;
                    const xfA = b2ContactSolver.SolvePositionConstraints_s_xfA;
                    const xfB = b2ContactSolver.SolvePositionConstraints_s_xfB;
                    const psm = b2ContactSolver.SolvePositionConstraints_s_psm;
                    let normal;
                    let point;
                    let separation;
                    const rA = b2ContactSolver.SolvePositionConstraints_s_rA;
                    const rB = b2ContactSolver.SolvePositionConstraints_s_rB;
                    let C;
                    let rnA;
                    let rnB;
                    let K;
                    let impulse;
                    const P = b2ContactSolver.SolvePositionConstraints_s_P;
                    let minSeparation = 0;
                    for (i = 0, ict = this.m_count; i < ict; ++i) {
                        pc = this.m_positionConstraints[i];
                        indexA = pc.indexA;
                        indexB = pc.indexB;
                        localCenterA = pc.localCenterA;
                        mA = pc.invMassA;
                        iA = pc.invIA;
                        localCenterB = pc.localCenterB;
                        mB = pc.invMassB;
                        iB = pc.invIB;
                        pointCount = pc.pointCount;
                        cA = this.m_positions[indexA].c;
                        aA = this.m_positions[indexA].a;
                        cB = this.m_positions[indexB].c;
                        aB = this.m_positions[indexB].a;
                        // Solve normal constraints
                        for (j = 0, jct = pointCount; j < jct; ++j) {
                            xfA.q.SetAngleRadians(aA);
                            xfB.q.SetAngleRadians(aB);
                            b2Math_31.b2Vec2.SubVV(cA, b2Math_31.b2Rot.MulRV(xfA.q, localCenterA, b2Math_31.b2Vec2.s_t0), xfA.p);
                            b2Math_31.b2Vec2.SubVV(cB, b2Math_31.b2Rot.MulRV(xfB.q, localCenterB, b2Math_31.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            normal = psm.normal;
                            point = psm.point;
                            separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_31.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_31.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_31.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            C = b2Math_31.b2Clamp(b2Settings.b2_baumgarte * (separation + b2Settings.b2_linearSlop), (-b2Settings.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            rnA = b2Math_31.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            rnB = b2Math_31.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_31.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_31.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_31.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2Settings.b2_linearSlop because we don't
                    // push the separation above -b2Settings.b2_linearSlop.
                    return minSeparation > (-3 * b2Settings.b2_linearSlop);
                }
                SolveTOIPositionConstraints(toiIndexA, toiIndexB) {
                    let i;
                    let ict;
                    let j;
                    let jct;
                    let pc;
                    let indexA;
                    let indexB;
                    let localCenterA;
                    let localCenterB;
                    let pointCount;
                    let mA;
                    let iA;
                    let mB;
                    let iB;
                    let cA;
                    let aA;
                    let cB;
                    let aB;
                    const xfA = b2ContactSolver.SolveTOIPositionConstraints_s_xfA;
                    const xfB = b2ContactSolver.SolveTOIPositionConstraints_s_xfB;
                    const psm = b2ContactSolver.SolveTOIPositionConstraints_s_psm;
                    let normal;
                    let point;
                    let separation;
                    const rA = b2ContactSolver.SolveTOIPositionConstraints_s_rA;
                    const rB = b2ContactSolver.SolveTOIPositionConstraints_s_rB;
                    let C;
                    let rnA;
                    let rnB;
                    let K;
                    let impulse;
                    const P = b2ContactSolver.SolveTOIPositionConstraints_s_P;
                    let minSeparation = 0;
                    for (i = 0, ict = this.m_count; i < ict; ++i) {
                        pc = this.m_positionConstraints[i];
                        indexA = pc.indexA;
                        indexB = pc.indexB;
                        localCenterA = pc.localCenterA;
                        localCenterB = pc.localCenterB;
                        pointCount = pc.pointCount;
                        mA = 0;
                        iA = 0;
                        if (indexA === toiIndexA || indexA === toiIndexB) {
                            mA = pc.invMassA;
                            iA = pc.invIA;
                        }
                        mB = 0;
                        iB = 0;
                        if (indexB === toiIndexA || indexB === toiIndexB) {
                            mB = pc.invMassB;
                            iB = pc.invIB;
                        }
                        cA = this.m_positions[indexA].c;
                        aA = this.m_positions[indexA].a;
                        cB = this.m_positions[indexB].c;
                        aB = this.m_positions[indexB].a;
                        // Solve normal constraints
                        for (j = 0, jct = pointCount; j < jct; ++j) {
                            xfA.q.SetAngleRadians(aA);
                            xfB.q.SetAngleRadians(aB);
                            b2Math_31.b2Vec2.SubVV(cA, b2Math_31.b2Rot.MulRV(xfA.q, localCenterA, b2Math_31.b2Vec2.s_t0), xfA.p);
                            b2Math_31.b2Vec2.SubVV(cB, b2Math_31.b2Rot.MulRV(xfB.q, localCenterB, b2Math_31.b2Vec2.s_t0), xfB.p);
                            psm.Initialize(pc, xfA, xfB, j);
                            normal = psm.normal;
                            point = psm.point;
                            separation = psm.separation;
                            // b2Vec2 rA = point - cA;
                            b2Math_31.b2Vec2.SubVV(point, cA, rA);
                            // b2Vec2 rB = point - cB;
                            b2Math_31.b2Vec2.SubVV(point, cB, rB);
                            // Track max constraint error.
                            minSeparation = b2Math_31.b2Min(minSeparation, separation);
                            // Prevent large corrections and allow slop.
                            C = b2Math_31.b2Clamp(b2Settings.b2_toiBaumgarte * (separation + b2Settings.b2_linearSlop), (-b2Settings.b2_maxLinearCorrection), 0);
                            // Compute the effective mass.
                            // float32 rnA = b2Cross(rA, normal);
                            rnA = b2Math_31.b2Vec2.CrossVV(rA, normal);
                            // float32 rnB = b2Cross(rB, normal);
                            rnB = b2Math_31.b2Vec2.CrossVV(rB, normal);
                            // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                            // Compute normal impulse
                            impulse = K > 0 ? -C / K : 0;
                            // b2Vec2 P = impulse * normal;
                            b2Math_31.b2Vec2.MulSV(impulse, normal, P);
                            // cA -= mA * P;
                            cA.SelfMulSub(mA, P);
                            // aA -= iA * b2Cross(rA, P);
                            aA -= iA * b2Math_31.b2Vec2.CrossVV(rA, P);
                            // cB += mB * P;
                            cB.SelfMulAdd(mB, P);
                            // aB += iB * b2Cross(rB, P);
                            aB += iB * b2Math_31.b2Vec2.CrossVV(rB, P);
                        }
                        // this.m_positions[indexA].c = cA;
                        this.m_positions[indexA].a = aA;
                        // this.m_positions[indexB].c = cB;
                        this.m_positions[indexB].a = aB;
                    }
                    // We can't expect minSpeparation >= -b2Settings.b2_linearSlop because we don't
                    // push the separation above -b2Settings.b2_linearSlop.
                    return minSeparation >= -1.5 * b2Settings.b2_linearSlop;
                }
            };
            b2ContactSolver.InitializeVelocityConstraints_s_xfA = new b2Math_31.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_xfB = new b2Math_31.b2Transform();
            b2ContactSolver.InitializeVelocityConstraints_s_worldManifold = new b2Collision_9.b2WorldManifold();
            b2ContactSolver.WarmStart_s_P = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv1 = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_dv2 = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_a = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_b = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_x = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_d = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1 = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P2 = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveVelocityConstraints_s_P1P2 = new b2Math_31.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_xfA = new b2Math_31.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_xfB = new b2Math_31.b2Transform();
            b2ContactSolver.SolvePositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolvePositionConstraints_s_rA = new b2Math_31.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_rB = new b2Math_31.b2Vec2();
            b2ContactSolver.SolvePositionConstraints_s_P = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfA = new b2Math_31.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_xfB = new b2Math_31.b2Transform();
            b2ContactSolver.SolveTOIPositionConstraints_s_psm = new b2PositionSolverManifold();
            b2ContactSolver.SolveTOIPositionConstraints_s_rA = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_rB = new b2Math_31.b2Vec2();
            b2ContactSolver.SolveTOIPositionConstraints_s_P = new b2Math_31.b2Vec2();
            exports_47("b2ContactSolver", b2ContactSolver);
        }
    }
});
/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/b2Island", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Common/b2Timer", "Box2D/Dynamics/Contacts/b2ContactSolver", "Box2D/Dynamics/b2TimeStep", "Box2D/Dynamics/b2WorldCallbacks"], function(exports_48, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    var b2Settings, b2Math_32, b2Timer_2, b2ContactSolver_1, b2TimeStep_2, b2TimeStep_3, b2TimeStep_4, b2WorldCallbacks_3;
    var b2Island;
    return {
        setters:[
            function (b2Settings_43) {
                b2Settings = b2Settings_43;
            },
            function (b2Math_32_1) {
                b2Math_32 = b2Math_32_1;
            },
            function (b2Timer_2_1) {
                b2Timer_2 = b2Timer_2_1;
            },
            function (b2ContactSolver_1_1) {
                b2ContactSolver_1 = b2ContactSolver_1_1;
            },
            function (b2TimeStep_2_1) {
                b2TimeStep_2 = b2TimeStep_2_1;
                b2TimeStep_3 = b2TimeStep_2_1;
                b2TimeStep_4 = b2TimeStep_2_1;
            },
            function (b2WorldCallbacks_3_1) {
                b2WorldCallbacks_3 = b2WorldCallbacks_3_1;
            }],
        execute: function() {
            /*
            Position Correction Notes
            =========================
            I tried the several algorithms for position correction of the 2D revolute joint.
            I looked at these systems:
            - simple pendulum (1m diameter sphere on massless 5m stick) with initial angular velocity of 100 rad/s.
            - suspension bridge with 30 1m long planks of length 1m.
            - multi-link chain with 30 1m long links.
            
            Here are the algorithms:
            
            Baumgarte - A fraction of the position error is added to the velocity error. There is no
            separate position solver.
            
            Pseudo Velocities - After the velocity solver and position integration,
            the position error, Jacobian, and effective mass are recomputed. Then
            the velocity constraints are solved with pseudo velocities and a fraction
            of the position error is added to the pseudo velocity error. The pseudo
            velocities are initialized to zero and there is no warm-starting. After
            the position solver, the pseudo velocities are added to the positions.
            This is also called the First Order World method or the Position LCP method.
            
            Modified Nonlinear Gauss-Seidel (NGS) - Like Pseudo Velocities except the
            position error is re-computed for each constraint and the positions are updated
            after the constraint is solved. The radius vectors (aka Jacobians) are
            re-computed too (otherwise the algorithm has horrible instability). The pseudo
            velocity states are not needed because they are effectively zero at the beginning
            of each iteration. Since we have the current position error, we allow the
            iterations to terminate early if the error becomes smaller than b2Settings.b2_linearSlop.
            
            Full NGS or just NGS - Like Modified NGS except the effective mass are re-computed
            each time a constraint is solved.
            
            Here are the results:
            Baumgarte - this is the cheapest algorithm but it has some stability problems,
            especially with the bridge. The chain links separate easily close to the root
            and they jitter as they struggle to pull together. This is one of the most common
            methods in the field. The big drawback is that the position correction artificially
            affects the momentum, thus leading to instabilities and false bounce. I used a
            bias factor of 0.2. A larger bias factor makes the bridge less stable, a smaller
            factor makes joints and contacts more spongy.
            
            Pseudo Velocities - the is more stable than the Baumgarte method. The bridge is
            stable. However, joints still separate with large angular velocities. Drag the
            simple pendulum in a circle quickly and the joint will separate. The chain separates
            easily and does not recover. I used a bias factor of 0.2. A larger value lead to
            the bridge collapsing when a heavy cube drops on it.
            
            Modified NGS - this algorithm is better in some ways than Baumgarte and Pseudo
            Velocities, but in other ways it is worse. The bridge and chain are much more
            stable, but the simple pendulum goes unstable at high angular velocities.
            
            Full NGS - stable in all tests. The joints display good stiffness. The bridge
            still sags, but this is better than infinite forces.
            
            Recommendations
            Pseudo Velocities are not really worthwhile because the bridge and chain cannot
            recover from joint separation. In other cases the benefit over Baumgarte is small.
            
            Modified NGS is not a robust method for the revolute joint due to the violent
            instability seen in the simple pendulum. Perhaps it is viable with other constraint
            types, especially scalar constraints where the effective mass is a scalar.
            
            This leaves Baumgarte and Full NGS. Baumgarte has small, but manageable instabilities
            and is very fast. I don't think we can escape Baumgarte, especially in highly
            demanding cases where high constraint fidelity is not needed.
            
            Full NGS is robust and easy on the eyes. I recommend this as an option for
            higher fidelity simulation and certainly for suspension bridges and long chains.
            Full NGS might be a good choice for ragdolls, especially motorized ragdolls where
            joint separation can be problematic. The number of NGS iterations can be reduced
            for better performance without harming robustness much.
            
            Each joint in a can be handled differently in the position solver. So I recommend
            a system where the user can select the algorithm on a per joint basis. I would
            probably default to the slower Full NGS and let the user select the faster
            Baumgarte method in performance critical scenarios.
            */
            /*
            Cache Performance
            
            The Box2D solvers are dominated by cache misses. Data structures are designed
            to increase the number of cache hits. Much of misses are due to random access
            to body data. The constraint structures are iterated over linearly, which leads
            to few cache misses.
            
            The bodies are not accessed during iteration. Instead read only data, such as
            the mass values are stored with the constraints. The mutable data are the constraint
            impulses and the bodies velocities/positions. The impulses are held inside the
            constraint structures. The body velocities/positions are held in compact, temporary
            arrays to increase the number of cache hits. Linear and angular velocity are
            stored in a single array since multiple arrays lead to multiple misses.
            */
            /*
            2D Rotation
            
            R = [cos(theta) -sin(theta)]
                [sin(theta) cos(theta) ]
            
            thetaDot = omega
            
            Let q1 = cos(theta), q2 = sin(theta).
            R = [q1 -q2]
                [q2  q1]
            
            q1Dot = -thetaDot * q2
            q2Dot = thetaDot * q1
            
            q1_new = q1_old - dt * w * q2
            q2_new = q2_old + dt * w * q1
            then normalize.
            
            This might be faster than computing sin+cos.
            However, we can compute sin+cos of the same angle fast.
            */
            b2Island = class b2Island {
                constructor() {
                    this.m_allocator = null;
                    this.m_listener = null;
                    this.m_bodies = new Array(1024); // TODO: b2Settings
                    this.m_contacts = new Array(1024); // TODO: b2Settings
                    this.m_joints = new Array(1024); // TODO: b2Settings
                    this.m_positions = b2TimeStep_2.b2Position.MakeArray(1024); // TODO: b2Settings
                    this.m_velocities = b2TimeStep_4.b2Velocity.MakeArray(1024); // TODO: b2Settings
                    this.m_bodyCount = 0;
                    this.m_jointCount = 0;
                    this.m_contactCount = 0;
                    this.m_bodyCapacity = 0;
                    this.m_contactCapacity = 0;
                    this.m_jointCapacity = 0;
                }
                Initialize(bodyCapacity, contactCapacity, jointCapacity, allocator, listener) {
                    this.m_bodyCapacity = bodyCapacity;
                    this.m_contactCapacity = contactCapacity;
                    this.m_jointCapacity = jointCapacity;
                    this.m_bodyCount = 0;
                    this.m_contactCount = 0;
                    this.m_jointCount = 0;
                    this.m_allocator = allocator;
                    this.m_listener = listener;
                    // TODO:
                    while (this.m_bodies.length < bodyCapacity) {
                        this.m_bodies[this.m_bodies.length] = null;
                    }
                    // TODO:
                    while (this.m_contacts.length < contactCapacity) {
                        this.m_contacts[this.m_contacts.length] = null;
                    }
                    // TODO:
                    while (this.m_joints.length < jointCapacity) {
                        this.m_joints[this.m_joints.length] = null;
                    }
                    // TODO:
                    if (this.m_positions.length < bodyCapacity) {
                        const new_length = b2Math_32.b2Max(this.m_positions.length * 2, bodyCapacity);
                        if (b2Settings.DEBUG) {
                            console.log("b2Island.m_positions: " + new_length);
                        }
                        while (this.m_positions.length < new_length) {
                            this.m_positions[this.m_positions.length] = new b2TimeStep_2.b2Position();
                        }
                    }
                    // TODO:
                    if (this.m_velocities.length < bodyCapacity) {
                        const new_length = b2Math_32.b2Max(this.m_velocities.length * 2, bodyCapacity);
                        if (b2Settings.DEBUG) {
                            console.log("b2Island.m_velocities: " + new_length);
                        }
                        while (this.m_velocities.length < new_length) {
                            this.m_velocities[this.m_velocities.length] = new b2TimeStep_4.b2Velocity();
                        }
                    }
                }
                Clear() {
                    this.m_bodyCount = 0;
                    this.m_contactCount = 0;
                    this.m_jointCount = 0;
                }
                AddBody(body) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_bodyCount < this.m_bodyCapacity);
                    }
                    body.m_islandIndex = this.m_bodyCount;
                    this.m_bodies[this.m_bodyCount++] = body;
                }
                AddContact(contact) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_contactCount < this.m_contactCapacity);
                    }
                    this.m_contacts[this.m_contactCount++] = contact;
                }
                AddJoint(joint) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_jointCount < this.m_jointCapacity);
                    }
                    this.m_joints[this.m_jointCount++] = joint;
                }
                Solve(profile, step, gravity, allowSleep) {
                    const timer = b2Island.s_timer.Reset();
                    const h = step.dt;
                    // Integrate velocities and apply damping. Initialize the body state.
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const b = this.m_bodies[i];
                        const c = this.m_positions[i].c.Copy(b.m_sweep.c);
                        const a = b.m_sweep.a;
                        const v = this.m_velocities[i].v.Copy(b.m_linearVelocity);
                        let w = b.m_angularVelocity;
                        // Store positions for continuous collision.
                        b.m_sweep.c0.Copy(b.m_sweep.c);
                        b.m_sweep.a0 = b.m_sweep.a;
                        if (b.m_type === 2 /* b2_dynamicBody */) {
                            // Integrate velocities.
                            v.x += h * (b.m_gravityScale * gravity.x + b.m_invMass * b.m_force.x);
                            v.y += h * (b.m_gravityScale * gravity.y + b.m_invMass * b.m_force.y);
                            w += h * b.m_invI * b.m_torque;
                            // Apply damping.
                            // ODE: dv/dt + c * v = 0
                            // Solution: v(t) = v0 * exp(-c * t)
                            // Time step: v(t + dt) = v0 * exp(-c * (t + dt)) = v0 * exp(-c * t) * exp(-c * dt) = v * exp(-c * dt)
                            // v2 = exp(-c * dt) * v1
                            // Taylor expansion:
                            // v2 = (1.0f - c * dt) * v1
                            v.SelfMul(b2Math_32.b2Clamp(1 - h * b.m_linearDamping, 0, 1));
                            w *= b2Math_32.b2Clamp(1 - h * b.m_angularDamping, 0, 1);
                        }
                        // this.m_positions[i].c = c;
                        this.m_positions[i].a = a;
                        // this.m_velocities[i].v = v;
                        this.m_velocities[i].w = w;
                    }
                    timer.Reset();
                    // Solver data
                    const solverData = b2Island.s_solverData;
                    solverData.step.Copy(step);
                    solverData.positions = this.m_positions;
                    solverData.velocities = this.m_velocities;
                    // Initialize velocity constraints.
                    const contactSolverDef = b2Island.s_contactSolverDef;
                    contactSolverDef.step.Copy(step);
                    contactSolverDef.contacts = this.m_contacts;
                    contactSolverDef.count = this.m_contactCount;
                    contactSolverDef.positions = this.m_positions;
                    contactSolverDef.velocities = this.m_velocities;
                    contactSolverDef.allocator = this.m_allocator;
                    const contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
                    contactSolver.InitializeVelocityConstraints();
                    if (step.warmStarting) {
                        contactSolver.WarmStart();
                    }
                    for (let i = 0; i < this.m_jointCount; ++i) {
                        this.m_joints[i].InitVelocityConstraints(solverData);
                    }
                    profile.solveInit = timer.GetMilliseconds();
                    // Solve velocity constraints.
                    timer.Reset();
                    for (let i = 0; i < step.velocityIterations; ++i) {
                        for (let j = 0; j < this.m_jointCount; ++j) {
                            this.m_joints[j].SolveVelocityConstraints(solverData);
                        }
                        contactSolver.SolveVelocityConstraints();
                    }
                    // Store impulses for warm starting
                    contactSolver.StoreImpulses();
                    profile.solveVelocity = timer.GetMilliseconds();
                    // Integrate positions.
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const c = this.m_positions[i].c;
                        let a = this.m_positions[i].a;
                        const v = this.m_velocities[i].v;
                        let w = this.m_velocities[i].w;
                        // Check for large velocities
                        const translation = b2Math_32.b2Vec2.MulSV(h, v, b2Island.s_translation);
                        if (b2Math_32.b2Vec2.DotVV(translation, translation) > b2Settings.b2_maxTranslationSquared) {
                            const ratio = b2Settings.b2_maxTranslation / translation.GetLength();
                            v.SelfMul(ratio);
                        }
                        const rotation = h * w;
                        if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
                            const ratio = b2Settings.b2_maxRotation / b2Math_32.b2Abs(rotation);
                            w *= ratio;
                        }
                        // Integrate
                        c.x += h * v.x;
                        c.y += h * v.y;
                        a += h * w;
                        // this.m_positions[i].c = c;
                        this.m_positions[i].a = a;
                        // this.m_velocities[i].v = v;
                        this.m_velocities[i].w = w;
                    }
                    // Solve position constraints
                    timer.Reset();
                    let positionSolved = false;
                    for (let i = 0; i < step.positionIterations; ++i) {
                        const contactsOkay = contactSolver.SolvePositionConstraints();
                        let jointsOkay = true;
                        for (let j = 0; j < this.m_jointCount; ++j) {
                            const jointOkay = this.m_joints[j].SolvePositionConstraints(solverData);
                            jointsOkay = jointsOkay && jointOkay;
                        }
                        if (contactsOkay && jointsOkay) {
                            // Exit early if the position errors are small.
                            positionSolved = true;
                            break;
                        }
                    }
                    // Copy state buffers back to the bodies
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const body = this.m_bodies[i];
                        body.m_sweep.c.Copy(this.m_positions[i].c);
                        body.m_sweep.a = this.m_positions[i].a;
                        body.m_linearVelocity.Copy(this.m_velocities[i].v);
                        body.m_angularVelocity = this.m_velocities[i].w;
                        body.SynchronizeTransform();
                    }
                    profile.solvePosition = timer.GetMilliseconds();
                    this.Report(contactSolver.m_velocityConstraints);
                    if (allowSleep) {
                        let minSleepTime = b2Settings.b2_maxFloat;
                        const linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
                        const angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
                        for (let i = 0; i < this.m_bodyCount; ++i) {
                            const b = this.m_bodies[i];
                            if (b.GetType() === 0 /* b2_staticBody */) {
                                continue;
                            }
                            if ((b.m_flags & 4 /* e_autoSleepFlag */) === 0 ||
                                b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
                                b2Math_32.b2Vec2.DotVV(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
                                b.m_sleepTime = 0;
                                minSleepTime = 0;
                            }
                            else {
                                b.m_sleepTime += h;
                                minSleepTime = b2Math_32.b2Min(minSleepTime, b.m_sleepTime);
                            }
                        }
                        if (minSleepTime >= b2Settings.b2_timeToSleep && positionSolved) {
                            for (let i = 0; i < this.m_bodyCount; ++i) {
                                const b = this.m_bodies[i];
                                b.SetAwake(false);
                            }
                        }
                    }
                }
                SolveTOI(subStep, toiIndexA, toiIndexB) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(toiIndexA < this.m_bodyCount);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(toiIndexB < this.m_bodyCount);
                    }
                    // Initialize the body state.
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const b = this.m_bodies[i];
                        this.m_positions[i].c.Copy(b.m_sweep.c);
                        this.m_positions[i].a = b.m_sweep.a;
                        this.m_velocities[i].v.Copy(b.m_linearVelocity);
                        this.m_velocities[i].w = b.m_angularVelocity;
                    }
                    const contactSolverDef = b2Island.s_contactSolverDef;
                    contactSolverDef.contacts = this.m_contacts;
                    contactSolverDef.count = this.m_contactCount;
                    contactSolverDef.allocator = this.m_allocator;
                    contactSolverDef.step.Copy(subStep);
                    contactSolverDef.positions = this.m_positions;
                    contactSolverDef.velocities = this.m_velocities;
                    const contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
                    // Solve position constraints.
                    for (let i = 0; i < subStep.positionIterations; ++i) {
                        const contactsOkay = contactSolver.SolveTOIPositionConstraints(toiIndexA, toiIndexB);
                        if (contactsOkay) {
                            break;
                        }
                    }
                    /*
                    #if 0
                      // Is the new position really safe?
                      for (int32 i = 0; i < this.m_contactCount; ++i) {
                        b2Contact* c = this.m_contacts[i];
                        b2Fixture* fA = c.GetFixtureA();
                        b2Fixture* fB = c.GetFixtureB();
                  
                        b2Body* bA = fA.GetBody();
                        b2Body* bB = fB.GetBody();
                  
                        int32 indexA = c.GetChildIndexA();
                        int32 indexB = c.GetChildIndexB();
                  
                        b2DistanceInput input;
                        input.proxyA.Set(fA.GetShape(), indexA);
                        input.proxyB.Set(fB.GetShape(), indexB);
                        input.transformA = bA.GetTransform();
                        input.transformB = bB.GetTransform();
                        input.useRadii = false;
                  
                        b2DistanceOutput output;
                        b2SimplexCache cache;
                        cache.count = 0;
                        b2Distance(&output, &cache, &input);
                  
                        if (output.distance === 0 || cache.count === 3) {
                          cache.count += 0;
                        }
                      }
                    #endif
                    */
                    // Leap of faith to new safe state.
                    this.m_bodies[toiIndexA].m_sweep.c0.Copy(this.m_positions[toiIndexA].c);
                    this.m_bodies[toiIndexA].m_sweep.a0 = this.m_positions[toiIndexA].a;
                    this.m_bodies[toiIndexB].m_sweep.c0.Copy(this.m_positions[toiIndexB].c);
                    this.m_bodies[toiIndexB].m_sweep.a0 = this.m_positions[toiIndexB].a;
                    // No warm starting is needed for TOI events because warm
                    // starting impulses were applied in the discrete solver.
                    contactSolver.InitializeVelocityConstraints();
                    // Solve velocity constraints.
                    for (let i = 0; i < subStep.velocityIterations; ++i) {
                        contactSolver.SolveVelocityConstraints();
                    }
                    // Don't store the TOI contact forces for warm starting
                    // because they can be quite large.
                    const h = subStep.dt;
                    // Integrate positions
                    for (let i = 0; i < this.m_bodyCount; ++i) {
                        const c = this.m_positions[i].c;
                        let a = this.m_positions[i].a;
                        const v = this.m_velocities[i].v;
                        let w = this.m_velocities[i].w;
                        // Check for large velocities
                        const translation = b2Math_32.b2Vec2.MulSV(h, v, b2Island.s_translation);
                        if (b2Math_32.b2Vec2.DotVV(translation, translation) > b2Settings.b2_maxTranslationSquared) {
                            const ratio = b2Settings.b2_maxTranslation / translation.GetLength();
                            v.SelfMul(ratio);
                        }
                        const rotation = h * w;
                        if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
                            const ratio = b2Settings.b2_maxRotation / b2Math_32.b2Abs(rotation);
                            w *= ratio;
                        }
                        // Integrate
                        c.SelfMulAdd(h, v);
                        a += h * w;
                        // this.m_positions[i].c = c;
                        this.m_positions[i].a = a;
                        // this.m_velocities[i].v = v;
                        this.m_velocities[i].w = w;
                        // Sync bodies
                        const body = this.m_bodies[i];
                        body.m_sweep.c.Copy(c);
                        body.m_sweep.a = a;
                        body.m_linearVelocity.Copy(v);
                        body.m_angularVelocity = w;
                        body.SynchronizeTransform();
                    }
                    this.Report(contactSolver.m_velocityConstraints);
                }
                Report(constraints) {
                    if (this.m_listener === null) {
                        return;
                    }
                    for (let i = 0; i < this.m_contactCount; ++i) {
                        const c = this.m_contacts[i];
                        if (!c) {
                            continue;
                        }
                        const vc = constraints[i];
                        const impulse = b2Island.s_impulse;
                        impulse.count = vc.pointCount;
                        for (let j = 0; j < vc.pointCount; ++j) {
                            impulse.normalImpulses[j] = vc.points[j].normalImpulse;
                            impulse.tangentImpulses[j] = vc.points[j].tangentImpulse;
                        }
                        this.m_listener.PostSolve(c, impulse);
                    }
                }
            };
            b2Island.s_timer = new b2Timer_2.b2Timer();
            b2Island.s_solverData = new b2TimeStep_3.b2SolverData();
            b2Island.s_contactSolverDef = new b2ContactSolver_1.b2ContactSolverDef();
            b2Island.s_contactSolver = new b2ContactSolver_1.b2ContactSolver();
            b2Island.s_translation = new b2Math_32.b2Vec2();
            b2Island.s_impulse = new b2WorldCallbacks_3.b2ContactImpulse();
            exports_48("b2Island", b2Island);
        }
    }
});
/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("Box2D/Dynamics/b2World", ["Box2D/Common/b2Settings", "Box2D/Common/b2Math", "Box2D/Common/b2Timer", "Box2D/Common/b2Draw", "Box2D/Collision/b2Collision", "Box2D/Collision/b2TimeOfImpact", "Box2D/Dynamics/Joints/b2JointFactory", "Box2D/Dynamics/b2Body", "Box2D/Dynamics/b2ContactManager", "Box2D/Dynamics/b2Fixture", "Box2D/Dynamics/b2Island", "Box2D/Dynamics/b2TimeStep", "Box2D/Dynamics/b2WorldCallbacks"], function(exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var b2Settings, b2Math_33, b2Timer_3, b2Draw_1, b2Collision_10, b2Collision_11, b2Collision_12, b2Collision_13, b2TimeOfImpact_4, b2TimeOfImpact_5, b2TimeOfImpact_6, b2JointFactory_1, b2Body_1, b2ContactManager_1, b2Fixture_3, b2Island_1, b2TimeStep_5, b2TimeStep_6, b2WorldCallbacks_4, b2WorldCallbacks_5;
    var b2World;
    return {
        setters:[
            function (b2Settings_44) {
                b2Settings = b2Settings_44;
            },
            function (b2Math_33_1) {
                b2Math_33 = b2Math_33_1;
            },
            function (b2Timer_3_1) {
                b2Timer_3 = b2Timer_3_1;
            },
            function (b2Draw_1_1) {
                b2Draw_1 = b2Draw_1_1;
            },
            function (b2Collision_10_1) {
                b2Collision_10 = b2Collision_10_1;
                b2Collision_11 = b2Collision_10_1;
                b2Collision_12 = b2Collision_10_1;
                b2Collision_13 = b2Collision_10_1;
            },
            function (b2TimeOfImpact_4_1) {
                b2TimeOfImpact_4 = b2TimeOfImpact_4_1;
                b2TimeOfImpact_5 = b2TimeOfImpact_4_1;
                b2TimeOfImpact_6 = b2TimeOfImpact_4_1;
            },
            function (b2JointFactory_1_1) {
                b2JointFactory_1 = b2JointFactory_1_1;
            },
            function (b2Body_1_1) {
                b2Body_1 = b2Body_1_1;
            },
            function (b2ContactManager_1_1) {
                b2ContactManager_1 = b2ContactManager_1_1;
            },
            function (b2Fixture_3_1) {
                b2Fixture_3 = b2Fixture_3_1;
            },
            function (b2Island_1_1) {
                b2Island_1 = b2Island_1_1;
            },
            function (b2TimeStep_5_1) {
                b2TimeStep_5 = b2TimeStep_5_1;
                b2TimeStep_6 = b2TimeStep_5_1;
            },
            function (b2WorldCallbacks_4_1) {
                b2WorldCallbacks_4 = b2WorldCallbacks_4_1;
                b2WorldCallbacks_5 = b2WorldCallbacks_4_1;
            }],
        execute: function() {
            /// The world class manages all physics entities, dynamic simulation,
            /// and asynchronous queries. The world also contains efficient memory
            /// management facilities.
            b2World = class b2World {
                // public m_controllerList: b2Controller = null;
                // public m_controllerCount: number = 0;
                /// Construct a world object.
                /// @param gravity the world gravity vector.
                constructor(gravity) {
                    // b2BlockAllocator m_blockAllocator;
                    // b2StackAllocator m_stackAllocator;
                    this.m_flags = 4 /* e_clearForces */;
                    this.m_contactManager = new b2ContactManager_1.b2ContactManager();
                    this.m_bodyList = null;
                    this.m_jointList = null;
                    this.m_bodyCount = 0;
                    this.m_jointCount = 0;
                    this.m_gravity = new b2Math_33.b2Vec2();
                    this.m_allowSleep = true;
                    this.m_destructionListener = null;
                    this.m_debugDraw = null;
                    // This is used to compute the time step ratio to
                    // support a variable time step.
                    this.m_inv_dt0 = 0;
                    // These are for debugging the solver.
                    this.m_warmStarting = true;
                    this.m_continuousPhysics = true;
                    this.m_subStepping = false;
                    this.m_stepComplete = true;
                    this.m_profile = new b2TimeStep_5.b2Profile();
                    this.m_island = new b2Island_1.b2Island();
                    this.s_stack = new Array();
                    this.m_gravity = gravity.Clone();
                }
                /// Register a destruction listener. The listener is owned by you and must
                /// remain in scope.
                SetDestructionListener(listener) {
                    this.m_destructionListener = listener;
                }
                /// Register a contact filter to provide specific control over collision.
                /// Otherwise the default filter is used (b2_defaultFilter). The listener is
                /// owned by you and must remain in scope.
                SetContactFilter(filter) {
                    this.m_contactManager.m_contactFilter = filter;
                }
                /// Register a contact event listener. The listener is owned by you and must
                /// remain in scope.
                SetContactListener(listener) {
                    this.m_contactManager.m_contactListener = listener;
                }
                /// Register a routine for debug drawing. The debug draw functions are called
                /// inside with b2World::DrawDebugData method. The debug draw object is owned
                /// by you and must remain in scope.
                SetDebugDraw(debugDraw) {
                    this.m_debugDraw = debugDraw;
                }
                /// Create a rigid body given a definition. No reference to the definition
                /// is retained.
                /// @warning This function is locked during callbacks.
                CreateBody(def) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.IsLocked() === false);
                    }
                    if (this.IsLocked()) {
                        return null;
                    }
                    const b = new b2Body_1.b2Body(def, this);
                    // Add to world doubly linked list.
                    b.m_prev = null;
                    b.m_next = this.m_bodyList;
                    if (this.m_bodyList) {
                        this.m_bodyList.m_prev = b;
                    }
                    this.m_bodyList = b;
                    ++this.m_bodyCount;
                    return b;
                }
                /// Destroy a rigid body given a definition. No reference to the definition
                /// is retained. This function is locked during callbacks.
                /// @warning This automatically deletes all associated shapes and joints.
                /// @warning This function is locked during callbacks.
                DestroyBody(b) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_bodyCount > 0);
                    }
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.IsLocked() === false);
                    }
                    if (this.IsLocked()) {
                        return;
                    }
                    // Delete the attached joints.
                    let je = b.m_jointList;
                    while (je) {
                        const je0 = je;
                        je = je.next;
                        if (this.m_destructionListener) {
                            this.m_destructionListener.SayGoodbyeJoint(je0.joint);
                        }
                        this.DestroyJoint(je0.joint);
                        b.m_jointList = je;
                    }
                    b.m_jointList = null;
                    /// @see b2Controller list
                    //    const coe: b2ControllerEdge = b.m_controllerList;
                    //    while (coe) {
                    //      const coe0: b2ControllerEdge = coe;
                    //      coe = coe.nextController;
                    //      coe0.controller.RemoveBody(b);
                    //    }
                    // Delete the attached contacts.
                    let ce = b.m_contactList;
                    while (ce) {
                        const ce0 = ce;
                        ce = ce.next;
                        this.m_contactManager.Destroy(ce0.contact);
                    }
                    b.m_contactList = null;
                    // Delete the attached fixtures. This destroys broad-phase proxies.
                    let f = b.m_fixtureList;
                    while (f) {
                        const f0 = f;
                        f = f.m_next;
                        if (this.m_destructionListener) {
                            this.m_destructionListener.SayGoodbyeFixture(f0);
                        }
                        f0.DestroyProxies(this.m_contactManager.m_broadPhase);
                        f0.Destroy();
                        b.m_fixtureList = f;
                        b.m_fixtureCount -= 1;
                    }
                    b.m_fixtureList = null;
                    b.m_fixtureCount = 0;
                    // Remove world body list.
                    if (b.m_prev) {
                        b.m_prev.m_next = b.m_next;
                    }
                    if (b.m_next) {
                        b.m_next.m_prev = b.m_prev;
                    }
                    if (b === this.m_bodyList) {
                        this.m_bodyList = b.m_next;
                    }
                    --this.m_bodyCount;
                }
                /// Create a joint to constrain bodies together. No reference to the definition
                /// is retained. This may cause the connected bodies to cease colliding.
                /// @warning This function is locked during callbacks.
                CreateJoint(def) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.IsLocked() === false);
                    }
                    if (this.IsLocked()) {
                        return null;
                    }
                    const j = b2JointFactory_1.b2JointFactory.Create(def, null);
                    // Connect to the world list.
                    j.m_prev = null;
                    j.m_next = this.m_jointList;
                    if (this.m_jointList) {
                        this.m_jointList.m_prev = j;
                    }
                    this.m_jointList = j;
                    ++this.m_jointCount;
                    // Connect to the bodies' doubly linked lists.
                    j.m_edgeA.joint = j;
                    j.m_edgeA.other = j.m_bodyB;
                    j.m_edgeA.prev = null;
                    j.m_edgeA.next = j.m_bodyA.m_jointList;
                    if (j.m_bodyA.m_jointList)
                        j.m_bodyA.m_jointList.prev = j.m_edgeA;
                    j.m_bodyA.m_jointList = j.m_edgeA;
                    j.m_edgeB.joint = j;
                    j.m_edgeB.other = j.m_bodyA;
                    j.m_edgeB.prev = null;
                    j.m_edgeB.next = j.m_bodyB.m_jointList;
                    if (j.m_bodyB.m_jointList)
                        j.m_bodyB.m_jointList.prev = j.m_edgeB;
                    j.m_bodyB.m_jointList = j.m_edgeB;
                    const bodyA = def.bodyA;
                    const bodyB = def.bodyB;
                    // If the joint prevents collisions, then flag any contacts for filtering.
                    if (def.collideConnected === false) {
                        let edge = bodyB.GetContactList();
                        while (edge) {
                            if (edge.other === bodyA) {
                                // Flag the contact for filtering at the next time step (where either
                                // body is awake).
                                edge.contact.FlagForFiltering();
                            }
                            edge = edge.next;
                        }
                    }
                    // Note: creating a joint doesn't wake the bodies.
                    return j;
                }
                /// Destroy a joint. This may cause the connected bodies to begin colliding.
                /// @warning This function is locked during callbacks.
                DestroyJoint(j) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.IsLocked() === false);
                    }
                    if (this.IsLocked()) {
                        return;
                    }
                    const collideConnected = j.m_collideConnected;
                    // Remove from the doubly linked list.
                    if (j.m_prev) {
                        j.m_prev.m_next = j.m_next;
                    }
                    if (j.m_next) {
                        j.m_next.m_prev = j.m_prev;
                    }
                    if (j === this.m_jointList) {
                        this.m_jointList = j.m_next;
                    }
                    // Disconnect from island graph.
                    const bodyA = j.m_bodyA;
                    const bodyB = j.m_bodyB;
                    // Wake up connected bodies.
                    bodyA.SetAwake(true);
                    bodyB.SetAwake(true);
                    // Remove from body 1.
                    if (j.m_edgeA.prev) {
                        j.m_edgeA.prev.next = j.m_edgeA.next;
                    }
                    if (j.m_edgeA.next) {
                        j.m_edgeA.next.prev = j.m_edgeA.prev;
                    }
                    if (j.m_edgeA === bodyA.m_jointList) {
                        bodyA.m_jointList = j.m_edgeA.next;
                    }
                    j.m_edgeA.prev = null;
                    j.m_edgeA.next = null;
                    // Remove from body 2
                    if (j.m_edgeB.prev) {
                        j.m_edgeB.prev.next = j.m_edgeB.next;
                    }
                    if (j.m_edgeB.next) {
                        j.m_edgeB.next.prev = j.m_edgeB.prev;
                    }
                    if (j.m_edgeB === bodyB.m_jointList) {
                        bodyB.m_jointList = j.m_edgeB.next;
                    }
                    j.m_edgeB.prev = null;
                    j.m_edgeB.next = null;
                    b2JointFactory_1.b2JointFactory.Destroy(j, null);
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.m_jointCount > 0);
                    }
                    --this.m_jointCount;
                    // If the joint prevents collisions, then flag any contacts for filtering.
                    if (collideConnected === false) {
                        let edge = bodyB.GetContactList();
                        while (edge) {
                            if (edge.other === bodyA) {
                                // Flag the contact for filtering at the next time step (where either
                                // body is awake).
                                edge.contact.FlagForFiltering();
                            }
                            edge = edge.next;
                        }
                    }
                }
                Step(dt, velocityIterations, positionIterations) {
                    const stepTimer = new b2Timer_3.b2Timer();
                    // If new fixtures were added, we need to find the new contacts.
                    if (this.m_flags & 1 /* e_newFixture */) {
                        this.m_contactManager.FindNewContacts();
                        this.m_flags &= ~1 /* e_newFixture */;
                    }
                    this.m_flags |= 2 /* e_locked */;
                    const step = b2World.Step_s_step;
                    step.dt = dt;
                    step.velocityIterations = velocityIterations;
                    step.positionIterations = positionIterations;
                    if (dt > 0) {
                        step.inv_dt = 1 / dt;
                    }
                    else {
                        step.inv_dt = 0;
                    }
                    step.dtRatio = this.m_inv_dt0 * dt;
                    step.warmStarting = this.m_warmStarting;
                    // Update contacts. This is where some contacts are destroyed.
                    const timer = new b2Timer_3.b2Timer();
                    this.m_contactManager.Collide();
                    this.m_profile.collide = timer.GetMilliseconds();
                    // Integrate velocities, solve velocity constraints, and integrate positions.
                    if (this.m_stepComplete && step.dt > 0) {
                        const timer = new b2Timer_3.b2Timer();
                        this.Solve(step);
                        this.m_profile.solve = timer.GetMilliseconds();
                    }
                    // Handle TOI events.
                    if (this.m_continuousPhysics && step.dt > 0) {
                        const timer = new b2Timer_3.b2Timer();
                        this.SolveTOI(step);
                        this.m_profile.solveTOI = timer.GetMilliseconds();
                    }
                    if (step.dt > 0) {
                        this.m_inv_dt0 = step.inv_dt;
                    }
                    if (this.m_flags & 4 /* e_clearForces */) {
                        this.ClearForces();
                    }
                    this.m_flags &= ~2 /* e_locked */;
                    this.m_profile.step = stepTimer.GetMilliseconds();
                }
                /// Manually clear the force buffer on all bodies. By default, forces are cleared automatically
                /// after each call to Step. The default behavior is modified by calling SetAutoClearForces.
                /// The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
                /// a fixed sized time step under a variable frame-rate.
                /// When you perform sub-stepping you will disable auto clearing of forces and instead call
                /// ClearForces after all sub-steps are complete in one pass of your game loop.
                /// @see SetAutoClearForces
                ClearForces() {
                    for (let body = this.m_bodyList; body; body = body.m_next) {
                        body.m_force.SetZero();
                        body.m_torque = 0;
                    }
                }
                DrawDebugData() {
                    if (this.m_debugDraw === null) {
                        return;
                    }
                    const flags = this.m_debugDraw.GetFlags();
                    const color = b2World.DrawDebugData_s_color.SetRGB(0, 0, 0);
                    if (flags & 1 /* e_shapeBit */) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            const xf = b.m_xf;
                            this.m_debugDraw.PushTransform(xf);
                            for (let f = b.GetFixtureList(); f; f = f.m_next) {
                                if (b.IsActive() === false) {
                                    color.SetRGB(0.5, 0.5, 0.3);
                                    this.DrawShape(f, color);
                                }
                                else if (b.GetType() === 0 /* b2_staticBody */) {
                                    color.SetRGB(0.5, 0.9, 0.5);
                                    this.DrawShape(f, color);
                                }
                                else if (b.GetType() === 1 /* b2_kinematicBody */) {
                                    color.SetRGB(0.5, 0.5, 0.9);
                                    this.DrawShape(f, color);
                                }
                                else if (b.IsAwake() === false) {
                                    color.SetRGB(0.6, 0.6, 0.6);
                                    this.DrawShape(f, color);
                                }
                                else {
                                    color.SetRGB(0.9, 0.7, 0.7);
                                    this.DrawShape(f, color);
                                }
                            }
                            this.m_debugDraw.PopTransform(xf);
                        }
                    }
                    if (flags & 2 /* e_jointBit */) {
                        for (let j = this.m_jointList; j; j = j.m_next) {
                            this.DrawJoint(j);
                        }
                    }
                    /*
                    if (flags & b2DrawFlags.e_pairBit) {
                      color.SetRGB(0.3, 0.9, 0.9);
                      for (let contact = this.m_contactManager.m_contactList; contact; contact = contact.m_next) {
                        const fixtureA = contact.GetFixtureA();
                        const fixtureB = contact.GetFixtureB();
                
                        const cA = fixtureA.GetAABB().GetCenter();
                        const cB = fixtureB.GetAABB().GetCenter();
                
                        this.m_debugDraw.DrawSegment(cA, cB, color);
                      }
                    }
                    */
                    if (flags & 4 /* e_aabbBit */) {
                        color.SetRGB(0.9, 0.3, 0.9);
                        const bp = this.m_contactManager.m_broadPhase;
                        const vs = b2World.DrawDebugData_s_vs;
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            if (b.IsActive() === false) {
                                continue;
                            }
                            for (let f = b.GetFixtureList(); f; f = f.m_next) {
                                for (let i = 0; i < f.m_proxyCount; ++i) {
                                    const proxy = f.m_proxies[i];
                                    const aabb = bp.GetFatAABB(proxy.proxy);
                                    vs[0].SetXY(aabb.lowerBound.x, aabb.lowerBound.y);
                                    vs[1].SetXY(aabb.upperBound.x, aabb.lowerBound.y);
                                    vs[2].SetXY(aabb.upperBound.x, aabb.upperBound.y);
                                    vs[3].SetXY(aabb.lowerBound.x, aabb.upperBound.y);
                                    this.m_debugDraw.DrawPolygon(vs, 4, color);
                                }
                            }
                        }
                    }
                    if (flags & 16 /* e_centerOfMassBit */) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            const xf = b2World.DrawDebugData_s_xf;
                            xf.q.Copy(b.m_xf.q);
                            xf.p.Copy(b.GetWorldCenter());
                            this.m_debugDraw.DrawTransform(xf);
                        }
                    }
                    /// @see b2Controller list
                    //    if (flags & b2DrawFlags.e_controllerBit) {
                    //      for (let c = this.m_controllerList; c; c = c.m_next) {
                    //        c.Draw(this.m_debugDraw);
                    //      }
                    //    }
                }
                /// Query the world for all fixtures that potentially overlap the
                /// provided AABB.
                /// @param callback a user implemented callback class.
                /// @param aabb the query box.
                QueryAABB(callback, aabb) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    const WorldQueryWrapper = function (proxy) {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(fixture_proxy instanceof b2Fixture_3.b2FixtureProxy);
                        }
                        const fixture = fixture_proxy.fixture;
                        const index = fixture_proxy.childIndex;
                        if (callback instanceof b2WorldCallbacks_4.b2QueryCallback) {
                            return callback.ReportFixture(fixture);
                        }
                        else {
                            return callback(fixture);
                        }
                    };
                    broadPhase.Query(WorldQueryWrapper, aabb);
                }
                QueryShape(callback, shape, transform) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    const WorldQueryWrapper = function (proxy) {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(fixture_proxy instanceof b2Fixture_3.b2FixtureProxy);
                        }
                        const fixture = fixture_proxy.fixture;
                        const index = fixture_proxy.childIndex;
                        if (b2Collision_13.b2TestOverlapShape(shape, 0, fixture.GetShape(), 0, transform, fixture.GetBody().GetTransform())) {
                            if (callback instanceof b2WorldCallbacks_4.b2QueryCallback) {
                                return callback.ReportFixture(fixture);
                            }
                            else {
                                return callback(fixture);
                            }
                        }
                        return true;
                    };
                    const aabb = b2World.QueryShape_s_aabb;
                    shape.ComputeAABB(aabb, transform, 0); // TODO
                    broadPhase.Query(WorldQueryWrapper, aabb);
                }
                QueryPoint(callback, point) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    const WorldQueryWrapper = function (proxy) {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(fixture_proxy instanceof b2Fixture_3.b2FixtureProxy);
                        }
                        const fixture = fixture_proxy.fixture;
                        const index = fixture_proxy.childIndex;
                        if (fixture.TestPoint(point)) {
                            if (callback instanceof b2WorldCallbacks_4.b2QueryCallback) {
                                return callback.ReportFixture(fixture);
                            }
                            else {
                                return callback(fixture);
                            }
                        }
                        return true;
                    };
                    const aabb = b2World.QueryPoint_s_aabb;
                    aabb.lowerBound.SetXY(point.x - b2Settings.b2_linearSlop, point.y - b2Settings.b2_linearSlop);
                    aabb.upperBound.SetXY(point.x + b2Settings.b2_linearSlop, point.y + b2Settings.b2_linearSlop);
                    broadPhase.Query(WorldQueryWrapper, aabb);
                }
                RayCast(callback, point1, point2) {
                    const broadPhase = this.m_contactManager.m_broadPhase;
                    const WorldRayCastWrapper = function (input, proxy) {
                        const fixture_proxy = broadPhase.GetUserData(proxy);
                        if (b2Settings.ENABLE_ASSERTS) {
                            b2Settings.b2Assert(fixture_proxy instanceof b2Fixture_3.b2FixtureProxy);
                        }
                        const fixture = fixture_proxy.fixture;
                        const index = fixture_proxy.childIndex;
                        const output = b2World.RayCast_s_output;
                        const hit = fixture.RayCast(output, input, index);
                        if (hit) {
                            const fraction = output.fraction;
                            const point = b2World.RayCast_s_point;
                            point.SetXY((1 - fraction) * point1.x + fraction * point2.x, (1 - fraction) * point1.y + fraction * point2.y);
                            if (callback instanceof b2WorldCallbacks_5.b2RayCastCallback) {
                                return callback.ReportFixture(fixture, point, output.normal, fraction);
                            }
                            else {
                                return callback(fixture, point, output.normal, fraction);
                            }
                        }
                        return input.maxFraction;
                    };
                    const input = b2World.RayCast_s_input;
                    input.maxFraction = 1;
                    input.p1.Copy(point1);
                    input.p2.Copy(point2);
                    broadPhase.RayCast(WorldRayCastWrapper, input);
                }
                RayCastOne(point1, point2) {
                    let result = null;
                    let min_fraction = 1;
                    function WorldRayCastOneWrapper(fixture, point, normal, fraction) {
                        if (fraction < min_fraction) {
                            min_fraction = fraction;
                            result = fixture;
                        }
                        return min_fraction;
                    }
                    ;
                    this.RayCast(WorldRayCastOneWrapper, point1, point2);
                    return result;
                }
                RayCastAll(point1, point2, out) {
                    out.length = 0;
                    function WorldRayCastAllWrapper(fixture, point, normal, fraction) {
                        out.push(fixture);
                        return 1;
                    }
                    ;
                    this.RayCast(WorldRayCastAllWrapper, point1, point2);
                    return out;
                }
                /// Get the world body list. With the returned body, use b2Body::GetNext to get
                /// the next body in the world list. A NULL body indicates the end of the list.
                /// @return the head of the world body list.
                GetBodyList() {
                    return this.m_bodyList;
                }
                /// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
                /// the next joint in the world list. A NULL joint indicates the end of the list.
                /// @return the head of the world joint list.
                GetJointList() {
                    return this.m_jointList;
                }
                /// Get the world contact list. With the returned contact, use b2Contact::GetNext to get
                /// the next contact in the world list. A NULL contact indicates the end of the list.
                /// @return the head of the world contact list.
                /// @warning contacts are created and destroyed in the middle of a time step.
                /// Use b2ContactListener to avoid missing contacts.
                GetContactList() {
                    return this.m_contactManager.m_contactList;
                }
                /// Enable/disable sleep.
                SetAllowSleeping(flag) {
                    if (flag === this.m_allowSleep) {
                        return;
                    }
                    this.m_allowSleep = flag;
                    if (this.m_allowSleep === false) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            b.SetAwake(true);
                        }
                    }
                }
                GetAllowSleeping() {
                    return this.m_allowSleep;
                }
                /// Enable/disable warm starting. For testing.
                SetWarmStarting(flag) {
                    this.m_warmStarting = flag;
                }
                GetWarmStarting() {
                    return this.m_warmStarting;
                }
                /// Enable/disable continuous physics. For testing.
                SetContinuousPhysics(flag) {
                    this.m_continuousPhysics = flag;
                }
                GetContinuousPhysics() {
                    return this.m_continuousPhysics;
                }
                /// Enable/disable single stepped continuous physics. For testing.
                SetSubStepping(flag) {
                    this.m_subStepping = flag;
                }
                GetSubStepping() {
                    return this.m_subStepping;
                }
                /// Get the number of broad-phase proxies.
                GetProxyCount() {
                    return this.m_contactManager.m_broadPhase.GetProxyCount();
                }
                /// Get the number of bodies.
                GetBodyCount() {
                    return this.m_bodyCount;
                }
                /// Get the number of joints.
                GetJointCount() {
                    return this.m_jointCount;
                }
                /// Get the number of contacts (each may have 0 or more contact points).
                GetContactCount() {
                    return this.m_contactManager.m_contactCount;
                }
                /// Get the height of the dynamic tree.
                GetTreeHeight() {
                    return this.m_contactManager.m_broadPhase.GetTreeHeight();
                }
                /// Get the balance of the dynamic tree.
                GetTreeBalance() {
                    return this.m_contactManager.m_broadPhase.GetTreeBalance();
                }
                /// Get the quality metric of the dynamic tree. The smaller the better.
                /// The minimum is 1.
                GetTreeQuality() {
                    return this.m_contactManager.m_broadPhase.GetTreeQuality();
                }
                /// Change the global gravity vector.
                SetGravity(gravity, wake = true) {
                    if ((this.m_gravity.x !== gravity.x) || (this.m_gravity.y !== gravity.y)) {
                        this.m_gravity.Copy(gravity);
                        if (wake) {
                            for (let b = this.m_bodyList; b; b = b.m_next) {
                                b.SetAwake(true);
                            }
                        }
                    }
                }
                /// Get the global gravity vector.
                GetGravity() {
                    return this.m_gravity;
                }
                /// Is the world locked (in the middle of a time step).
                IsLocked() {
                    return (this.m_flags & 2 /* e_locked */) > 0;
                }
                /// Set flag to control automatic clearing of forces after each time step.
                SetAutoClearForces(flag) {
                    if (flag) {
                        this.m_flags |= 4 /* e_clearForces */;
                    }
                    else {
                        this.m_flags &= ~4 /* e_clearForces */;
                    }
                }
                /// Get the flag that controls automatic clearing of forces after each time step.
                GetAutoClearForces() {
                    return (this.m_flags & 4 /* e_clearForces */) === 4 /* e_clearForces */;
                }
                /// Shift the world origin. Useful for large worlds.
                /// The body shift formula is: position -= newOrigin
                /// @param newOrigin the new origin with respect to the old origin
                ShiftOrigin(newOrigin) {
                    if (b2Settings.ENABLE_ASSERTS) {
                        b2Settings.b2Assert(this.IsLocked() === false);
                    }
                    if (this.IsLocked()) {
                        return;
                    }
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        b.m_xf.p.SelfSub(newOrigin);
                        b.m_sweep.c0.SelfSub(newOrigin);
                        b.m_sweep.c.SelfSub(newOrigin);
                    }
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        j.ShiftOrigin(newOrigin);
                    }
                    this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
                }
                /// Get the contact manager for testing.
                GetContactManager() {
                    return this.m_contactManager;
                }
                /// Get the current profile.
                GetProfile() {
                    return this.m_profile;
                }
                /// Dump the world into the log file.
                /// @warning this should be called outside of a time step.
                Dump() {
                    if (b2Settings.DEBUG) {
                        if ((this.m_flags & 2 /* e_locked */) === 2 /* e_locked */) {
                            return;
                        }
                        b2Settings.b2Log("const g: b2Vec2 = new b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
                        b2Settings.b2Log("this.m_world.SetGravity(g);\n");
                        b2Settings.b2Log("const bodies: b2Body[] = new Array(%d);\n", this.m_bodyCount);
                        b2Settings.b2Log("const joints: b2Joint[] = new Array(%d);\n", this.m_jointCount);
                        let i = 0;
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            b.m_islandIndex = i;
                            b.Dump();
                            ++i;
                        }
                        i = 0;
                        for (let j = this.m_jointList; j; j = j.m_next) {
                            j.m_index = i;
                            ++i;
                        }
                        // First pass on joints, skip gear joints.
                        for (let j = this.m_jointList; j; j = j.m_next) {
                            if (j.m_type === 6 /* e_gearJoint */) {
                                continue;
                            }
                            b2Settings.b2Log("{\n");
                            j.Dump();
                            b2Settings.b2Log("}\n");
                        }
                        // Second pass on joints, only gear joints.
                        for (let j = this.m_jointList; j; j = j.m_next) {
                            if (j.m_type !== 6 /* e_gearJoint */) {
                                continue;
                            }
                            b2Settings.b2Log("{\n");
                            j.Dump();
                            b2Settings.b2Log("}\n");
                        }
                    }
                }
                DrawJoint(joint) {
                    const bodyA = joint.GetBodyA();
                    const bodyB = joint.GetBodyB();
                    const xf1 = bodyA.m_xf;
                    const xf2 = bodyB.m_xf;
                    const x1 = xf1.p;
                    const x2 = xf2.p;
                    const p1 = joint.GetAnchorA(b2World.DrawJoint_s_p1);
                    const p2 = joint.GetAnchorB(b2World.DrawJoint_s_p2);
                    const color = b2World.DrawJoint_s_color.SetRGB(0.5, 0.8, 0.8);
                    switch (joint.m_type) {
                        case 3 /* e_distanceJoint */:
                            this.m_debugDraw.DrawSegment(p1, p2, color);
                            break;
                        case 4 /* e_pulleyJoint */:
                            {
                                const pulley = joint;
                                const s1 = pulley.GetGroundAnchorA();
                                const s2 = pulley.GetGroundAnchorB();
                                this.m_debugDraw.DrawSegment(s1, p1, color);
                                this.m_debugDraw.DrawSegment(s2, p2, color);
                                this.m_debugDraw.DrawSegment(s1, s2, color);
                            }
                            break;
                        case 5 /* e_mouseJoint */:
                            // don't draw this
                            this.m_debugDraw.DrawSegment(p1, p2, color);
                            break;
                        default:
                            this.m_debugDraw.DrawSegment(x1, p1, color);
                            this.m_debugDraw.DrawSegment(p1, p2, color);
                            this.m_debugDraw.DrawSegment(x2, p2, color);
                    }
                }
                DrawShape(fixture, color) {
                    const shape = fixture.GetShape();
                    switch (shape.m_type) {
                        case 0 /* e_circleShape */:
                            {
                                const circle = shape;
                                const center = circle.m_p;
                                const radius = circle.m_radius;
                                const axis = b2Math_33.b2Vec2.UNITX;
                                this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                            }
                            break;
                        case 1 /* e_edgeShape */:
                            {
                                const edge = shape;
                                const v1 = edge.m_vertex1;
                                const v2 = edge.m_vertex2;
                                this.m_debugDraw.DrawSegment(v1, v2, color);
                            }
                            break;
                        case 3 /* e_chainShape */:
                            {
                                const chain = shape;
                                const count = chain.m_count;
                                const vertices = chain.m_vertices;
                                let v1 = vertices[0];
                                this.m_debugDraw.DrawCircle(v1, 0.05, color);
                                for (let i = 1; i < count; ++i) {
                                    const v2 = vertices[i];
                                    this.m_debugDraw.DrawSegment(v1, v2, color);
                                    this.m_debugDraw.DrawCircle(v2, 0.05, color);
                                    v1 = v2;
                                }
                            }
                            break;
                        case 2 /* e_polygonShape */:
                            {
                                const poly = shape;
                                const vertexCount = poly.m_count;
                                const vertices = poly.m_vertices;
                                this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
                            }
                            break;
                    }
                }
                Solve(step) {
                    /// @see b2Controller list
                    //    for (let controller = this.m_controllerList; controller; controller = controller.m_next) {
                    //      controller.Step(step);
                    //    }
                    this.m_profile.solveInit = 0;
                    this.m_profile.solveVelocity = 0;
                    this.m_profile.solvePosition = 0;
                    // Size the island for the worst case.
                    const island = this.m_island;
                    island.Initialize(this.m_bodyCount, this.m_contactManager.m_contactCount, this.m_jointCount, null, // this.m_stackAllocator,
                    this.m_contactManager.m_contactListener);
                    // Clear all the island flags.
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        b.m_flags &= ~1 /* e_islandFlag */;
                    }
                    for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                        c.m_flags &= ~1 /* e_islandFlag */;
                    }
                    for (let j = this.m_jointList; j; j = j.m_next) {
                        j.m_islandFlag = false;
                    }
                    // Build and simulate all awake islands.
                    const stackSize = this.m_bodyCount;
                    const stack = this.s_stack;
                    for (let seed = this.m_bodyList; seed; seed = seed.m_next) {
                        if (seed.m_flags & 1 /* e_islandFlag */) {
                            continue;
                        }
                        if (seed.IsAwake() === false || seed.IsActive() === false) {
                            continue;
                        }
                        // The seed can be dynamic or kinematic.
                        if (seed.GetType() === 0 /* b2_staticBody */) {
                            continue;
                        }
                        // Reset island and stack.
                        island.Clear();
                        let stackCount = 0;
                        stack[stackCount++] = seed;
                        seed.m_flags |= 1 /* e_islandFlag */;
                        // Perform a depth first search (DFS) on the constraint graph.
                        while (stackCount > 0) {
                            // Grab the next body off the stack and add it to the island.
                            const b = stack[--stackCount];
                            if (b2Settings.ENABLE_ASSERTS) {
                                b2Settings.b2Assert(b.IsActive() === true);
                            }
                            island.AddBody(b);
                            // Make sure the body is awake.
                            b.SetAwake(true);
                            // To keep islands as small as possible, we don't
                            // propagate islands across static bodies.
                            if (b.GetType() === 0 /* b2_staticBody */) {
                                continue;
                            }
                            // Search all contacts connected to this body.
                            for (let ce = b.m_contactList; ce; ce = ce.next) {
                                const contact = ce.contact;
                                // Has this contact already been added to an island?
                                if (contact.m_flags & 1 /* e_islandFlag */) {
                                    continue;
                                }
                                // Is this contact solid and touching?
                                if (contact.IsEnabled() === false ||
                                    contact.IsTouching() === false) {
                                    continue;
                                }
                                // Skip sensors.
                                const sensorA = contact.m_fixtureA.m_isSensor;
                                const sensorB = contact.m_fixtureB.m_isSensor;
                                if (sensorA || sensorB) {
                                    continue;
                                }
                                island.AddContact(contact);
                                contact.m_flags |= 1 /* e_islandFlag */;
                                const other = ce.other;
                                // Was the other body already added to this island?
                                if (other.m_flags & 1 /* e_islandFlag */) {
                                    continue;
                                }
                                if (b2Settings.ENABLE_ASSERTS) {
                                    b2Settings.b2Assert(stackCount < stackSize);
                                }
                                stack[stackCount++] = other;
                                other.m_flags |= 1 /* e_islandFlag */;
                            }
                            // Search all joints connect to this body.
                            for (let je = b.m_jointList; je; je = je.next) {
                                if (je.joint.m_islandFlag === true) {
                                    continue;
                                }
                                const other = je.other;
                                // Don't simulate joints connected to inactive bodies.
                                if (other.IsActive() === false) {
                                    continue;
                                }
                                island.AddJoint(je.joint);
                                je.joint.m_islandFlag = true;
                                if (other.m_flags & 1 /* e_islandFlag */) {
                                    continue;
                                }
                                if (b2Settings.ENABLE_ASSERTS) {
                                    b2Settings.b2Assert(stackCount < stackSize);
                                }
                                stack[stackCount++] = other;
                                other.m_flags |= 1 /* e_islandFlag */;
                            }
                        }
                        const profile = new b2TimeStep_5.b2Profile();
                        island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
                        this.m_profile.solveInit += profile.solveInit;
                        this.m_profile.solveVelocity += profile.solveVelocity;
                        this.m_profile.solvePosition += profile.solvePosition;
                        // Post solve cleanup.
                        for (let i = 0; i < island.m_bodyCount; ++i) {
                            // Allow static bodies to participate in other islands.
                            const b = island.m_bodies[i];
                            if (b.GetType() === 0 /* b2_staticBody */) {
                                b.m_flags &= ~1 /* e_islandFlag */;
                            }
                        }
                    }
                    for (let i = 0; i < stack.length; ++i) {
                        if (!stack[i])
                            break;
                        stack[i] = null;
                    }
                    const timer = new b2Timer_3.b2Timer();
                    // Synchronize fixtures, check for out of range bodies.
                    for (let b = this.m_bodyList; b; b = b.m_next) {
                        // If a body was not in an island then it did not move.
                        if ((b.m_flags & 1 /* e_islandFlag */) === 0) {
                            continue;
                        }
                        if (b.GetType() === 0 /* b2_staticBody */) {
                            continue;
                        }
                        // Update fixtures (for broad-phase).
                        b.SynchronizeFixtures();
                    }
                    // Look for new contacts.
                    this.m_contactManager.FindNewContacts();
                    this.m_profile.broadphase = timer.GetMilliseconds();
                }
                SolveTOI(step) {
                    // b2Island island(2 * b2Settings.b2_maxTOIContacts, b2Settings.b2_maxTOIContacts, 0, &m_stackAllocator, m_contactManager.m_contactListener);
                    const island = this.m_island;
                    island.Initialize(2 * b2Settings.b2_maxTOIContacts, b2Settings.b2_maxTOIContacts, 0, null, this.m_contactManager.m_contactListener);
                    if (this.m_stepComplete) {
                        for (let b = this.m_bodyList; b; b = b.m_next) {
                            b.m_flags &= ~1 /* e_islandFlag */;
                            b.m_sweep.alpha0 = 0;
                        }
                        for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                            // Invalidate TOI
                            c.m_flags &= ~(32 /* e_toiFlag */ | 1 /* e_islandFlag */);
                            c.m_toiCount = 0;
                            c.m_toi = 1;
                        }
                    }
                    // Find TOI events and solve them.
                    for (;;) {
                        // Find the first TOI.
                        let minContact = null;
                        let minAlpha = 1;
                        for (let c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                            // Is this contact disabled?
                            if (c.IsEnabled() === false) {
                                continue;
                            }
                            // Prevent excessive sub-stepping.
                            if (c.m_toiCount > b2Settings.b2_maxSubSteps) {
                                continue;
                            }
                            let alpha = 1;
                            if (c.m_flags & 32 /* e_toiFlag */) {
                                // This contact has a valid cached TOI.
                                alpha = c.m_toi;
                            }
                            else {
                                const fA = c.GetFixtureA();
                                const fB = c.GetFixtureB();
                                // Is there a sensor?
                                if (fA.IsSensor() || fB.IsSensor()) {
                                    continue;
                                }
                                const bA = fA.GetBody();
                                const bB = fB.GetBody();
                                const typeA = bA.m_type;
                                const typeB = bB.m_type;
                                if (b2Settings.ENABLE_ASSERTS) {
                                    b2Settings.b2Assert(typeA === 2 /* b2_dynamicBody */ || typeB === 2 /* b2_dynamicBody */);
                                }
                                const activeA = bA.IsAwake() && typeA !== 0 /* b2_staticBody */;
                                const activeB = bB.IsAwake() && typeB !== 0 /* b2_staticBody */;
                                // Is at least one body active (awake and dynamic or kinematic)?
                                if (activeA === false && activeB === false) {
                                    continue;
                                }
                                const collideA = bA.IsBullet() || typeA !== 2 /* b2_dynamicBody */;
                                const collideB = bB.IsBullet() || typeB !== 2 /* b2_dynamicBody */;
                                // Are these two non-bullet dynamic bodies?
                                if (collideA === false && collideB === false) {
                                    continue;
                                }
                                // Compute the TOI for this contact.
                                // Put the sweeps onto the same time interval.
                                let alpha0 = bA.m_sweep.alpha0;
                                if (bA.m_sweep.alpha0 < bB.m_sweep.alpha0) {
                                    alpha0 = bB.m_sweep.alpha0;
                                    bA.m_sweep.Advance(alpha0);
                                }
                                else if (bB.m_sweep.alpha0 < bA.m_sweep.alpha0) {
                                    alpha0 = bA.m_sweep.alpha0;
                                    bB.m_sweep.Advance(alpha0);
                                }
                                if (b2Settings.ENABLE_ASSERTS) {
                                    b2Settings.b2Assert(alpha0 < 1);
                                }
                                const indexA = c.GetChildIndexA();
                                const indexB = c.GetChildIndexB();
                                // Compute the time of impact in interval [0, minTOI]
                                const input = b2World.SolveTOI_s_toi_input;
                                input.proxyA.SetShape(fA.GetShape(), indexA);
                                input.proxyB.SetShape(fB.GetShape(), indexB);
                                input.sweepA.Copy(bA.m_sweep);
                                input.sweepB.Copy(bB.m_sweep);
                                input.tMax = 1;
                                const output = b2World.SolveTOI_s_toi_output;
                                b2TimeOfImpact_6.b2TimeOfImpact(output, input);
                                // Beta is the fraction of the remaining portion of the .
                                const beta = output.t;
                                if (output.state === 3 /* e_touching */) {
                                    alpha = b2Math_33.b2Min(alpha0 + (1 - alpha0) * beta, 1);
                                }
                                else {
                                    alpha = 1;
                                }
                                c.m_toi = alpha;
                                c.m_flags |= 32 /* e_toiFlag */;
                            }
                            if (alpha < minAlpha) {
                                // This is the minimum TOI found so far.
                                minContact = c;
                                minAlpha = alpha;
                            }
                        }
                        if (minContact === null || 1 - 10 * b2Settings.b2_epsilon < minAlpha) {
                            // No more TOI events. Done!
                            this.m_stepComplete = true;
                            break;
                        }
                        // Advance the bodies to the TOI.
                        const fA = minContact.GetFixtureA();
                        const fB = minContact.GetFixtureB();
                        const bA = fA.GetBody();
                        const bB = fB.GetBody();
                        const backup1 = b2World.SolveTOI_s_backup1.Copy(bA.m_sweep);
                        const backup2 = b2World.SolveTOI_s_backup2.Copy(bB.m_sweep);
                        bA.Advance(minAlpha);
                        bB.Advance(minAlpha);
                        // The TOI contact likely has some new contact points.
                        minContact.Update(this.m_contactManager.m_contactListener);
                        minContact.m_flags &= ~32 /* e_toiFlag */;
                        ++minContact.m_toiCount;
                        // Is the contact solid?
                        if (minContact.IsEnabled() === false || minContact.IsTouching() === false) {
                            // Restore the sweeps.
                            minContact.SetEnabled(false);
                            bA.m_sweep.Copy(backup1);
                            bB.m_sweep.Copy(backup2);
                            bA.SynchronizeTransform();
                            bB.SynchronizeTransform();
                            continue;
                        }
                        bA.SetAwake(true);
                        bB.SetAwake(true);
                        // Build the island
                        island.Clear();
                        island.AddBody(bA);
                        island.AddBody(bB);
                        island.AddContact(minContact);
                        bA.m_flags |= 1 /* e_islandFlag */;
                        bB.m_flags |= 1 /* e_islandFlag */;
                        minContact.m_flags |= 1 /* e_islandFlag */;
                        // Get contacts on bodyA and bodyB.
                        // const bodies: b2Body[] = [bA, bB];
                        for (let i = 0; i < 2; ++i) {
                            const body = (i === 0) ? (bA) : (bB); // bodies[i];
                            if (body.m_type === 2 /* b2_dynamicBody */) {
                                for (let ce = body.m_contactList; ce; ce = ce.next) {
                                    if (island.m_bodyCount === island.m_bodyCapacity) {
                                        break;
                                    }
                                    if (island.m_contactCount === island.m_contactCapacity) {
                                        break;
                                    }
                                    const contact = ce.contact;
                                    // Has this contact already been added to the island?
                                    if (contact.m_flags & 1 /* e_islandFlag */) {
                                        continue;
                                    }
                                    // Only add static, kinematic, or bullet bodies.
                                    const other = ce.other;
                                    if (other.m_type === 2 /* b2_dynamicBody */ &&
                                        body.IsBullet() === false && other.IsBullet() === false) {
                                        continue;
                                    }
                                    // Skip sensors.
                                    const sensorA = contact.m_fixtureA.m_isSensor;
                                    const sensorB = contact.m_fixtureB.m_isSensor;
                                    if (sensorA || sensorB) {
                                        continue;
                                    }
                                    // Tentatively advance the body to the TOI.
                                    const backup = b2World.SolveTOI_s_backup.Copy(other.m_sweep);
                                    if ((other.m_flags & 1 /* e_islandFlag */) === 0) {
                                        other.Advance(minAlpha);
                                    }
                                    // Update the contact points
                                    contact.Update(this.m_contactManager.m_contactListener);
                                    // Was the contact disabled by the user?
                                    if (contact.IsEnabled() === false) {
                                        other.m_sweep.Copy(backup);
                                        other.SynchronizeTransform();
                                        continue;
                                    }
                                    // Are there contact points?
                                    if (contact.IsTouching() === false) {
                                        other.m_sweep.Copy(backup);
                                        other.SynchronizeTransform();
                                        continue;
                                    }
                                    // Add the contact to the island
                                    contact.m_flags |= 1 /* e_islandFlag */;
                                    island.AddContact(contact);
                                    // Has the other body already been added to the island?
                                    if (other.m_flags & 1 /* e_islandFlag */) {
                                        continue;
                                    }
                                    // Add the other body to the island.
                                    other.m_flags |= 1 /* e_islandFlag */;
                                    if (other.m_type !== 0 /* b2_staticBody */) {
                                        other.SetAwake(true);
                                    }
                                    island.AddBody(other);
                                }
                            }
                        }
                        const subStep = b2World.SolveTOI_s_subStep;
                        subStep.dt = (1 - minAlpha) * step.dt;
                        subStep.inv_dt = 1 / subStep.dt;
                        subStep.dtRatio = 1;
                        subStep.positionIterations = 20;
                        subStep.velocityIterations = step.velocityIterations;
                        subStep.warmStarting = false;
                        island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);
                        // Reset island flags and synchronize broad-phase proxies.
                        for (let i = 0; i < island.m_bodyCount; ++i) {
                            const body = island.m_bodies[i];
                            body.m_flags &= ~1 /* e_islandFlag */;
                            if (body.m_type !== 2 /* b2_dynamicBody */) {
                                continue;
                            }
                            body.SynchronizeFixtures();
                            // Invalidate all contact TOIs on this displaced body.
                            for (let ce = body.m_contactList; ce; ce = ce.next) {
                                ce.contact.m_flags &= ~(32 /* e_toiFlag */ | 1 /* e_islandFlag */);
                            }
                        }
                        // Commit fixture proxy movements to the broad-phase so that new contacts are created.
                        // Also, some contacts can be destroyed.
                        this.m_contactManager.FindNewContacts();
                        if (this.m_subStepping) {
                            this.m_stepComplete = false;
                            break;
                        }
                    }
                }
            };
            /// Take a time step. This performs collision detection, integration,
            /// and constraint solution.
            /// @param timeStep the amount of time to simulate, this should not vary.
            /// @param velocityIterations for the velocity constraint solver.
            /// @param positionIterations for the position constraint solver.
            b2World.Step_s_step = new b2TimeStep_6.b2TimeStep();
            /// Call this to draw shapes and other debug draw data.
            b2World.DrawDebugData_s_color = new b2Draw_1.b2Color(0, 0, 0);
            b2World.DrawDebugData_s_vs = b2Math_33.b2Vec2.MakeArray(4);
            b2World.DrawDebugData_s_xf = new b2Math_33.b2Transform();
            b2World.QueryShape_s_aabb = new b2Collision_10.b2AABB();
            b2World.QueryPoint_s_aabb = new b2Collision_10.b2AABB();
            /// Ray-cast the world for all fixtures in the path of the ray. Your callback
            /// controls whether you get the closest point, any point, or n-points.
            /// The ray-cast ignores shapes that contain the starting point.
            /// @param callback a user implemented callback class.
            /// @param point1 the ray starting point
            /// @param point2 the ray ending point
            b2World.RayCast_s_input = new b2Collision_11.b2RayCastInput();
            b2World.RayCast_s_output = new b2Collision_12.b2RayCastOutput();
            b2World.RayCast_s_point = new b2Math_33.b2Vec2();
            b2World.DrawJoint_s_p1 = new b2Math_33.b2Vec2();
            b2World.DrawJoint_s_p2 = new b2Math_33.b2Vec2();
            b2World.DrawJoint_s_color = new b2Draw_1.b2Color(0.5, 0.8, 0.8);
            b2World.SolveTOI_s_subStep = new b2TimeStep_6.b2TimeStep();
            b2World.SolveTOI_s_backup = new b2Math_33.b2Sweep();
            b2World.SolveTOI_s_backup1 = new b2Math_33.b2Sweep();
            b2World.SolveTOI_s_backup2 = new b2Math_33.b2Sweep();
            b2World.SolveTOI_s_toi_input = new b2TimeOfImpact_4.b2TOIInput();
            b2World.SolveTOI_s_toi_output = new b2TimeOfImpact_5.b2TOIOutput();
            exports_49("b2World", b2World);
        }
    }
});
/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register("HelloWorld/HelloWorld", ["Box2D/Common/b2Math", "Box2D/Dynamics/b2World", "Box2D/Dynamics/b2Body", "Box2D/Dynamics/b2Fixture", "Box2D/Collision/Shapes/b2PolygonShape"], function(exports_50, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var b2Math_34, b2World_1, b2Body_2, b2Fixture_4, b2PolygonShape_5;
    // This is a simple example of building and running a simulation
    // using Box2D. Here we create a large ground box and a small dynamic
    // box.
    // There are no graphics for this example. Box2D is meant to be used
    // with your rendering engine in your game engine.
    function main() {
        // const pre = document.body.appendChild(document.createElement('pre'));
        // Define the gravity vector.
        const gravity = new b2Math_34.b2Vec2(0, -10);
        // Construct a world object, which will hold and simulate the rigid bodies.
        const world = new b2World_1.b2World(gravity);
        // Define the ground body.
        const groundBodyDef = new b2Body_2.b2BodyDef();
        groundBodyDef.position.SetXY(0, -10);
        // Call the body factory which allocates memory for the ground body
        // from a pool and creates the ground box shape (also from a pool).
        // The body is also added to the world.
        const groundBody = world.CreateBody(groundBodyDef);
        // Define the ground box shape.
        const groundBox = new b2PolygonShape_5.b2PolygonShape();
        // The extents are the half-widths of the box.
        groundBox.SetAsBox(50, 10);
        // Add the ground fixture to the ground body.
        groundBody.CreateFixture2(groundBox, 0);
        // Define the dynamic body. We set its position and call the body factory.
        const bodyDef = new b2Body_2.b2BodyDef();
        bodyDef.type = 2 /* b2_dynamicBody */;
        bodyDef.position.SetXY(0, 4);
        const body = world.CreateBody(bodyDef);
        // Define another box shape for our dynamic body.
        const dynamicBox = new b2PolygonShape_5.b2PolygonShape();
        dynamicBox.SetAsBox(1, 1);
        // Define the dynamic body fixture.
        const fixtureDef = new b2Fixture_4.b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        // Set the box density to be non-zero, so it will be dynamic.
        fixtureDef.density = 1;
        // Override the default friction.
        fixtureDef.friction = 0.3;
        // Add the shape to the body.
        body.CreateFixture(fixtureDef);
        // Prepare for simulation. Typically we use a time step of 1/60 of a
        // second (60Hz) and 10 iterations. This provides a high quality simulation
        // in most game scenarios.
        const timeStep = 1 / 60;
        const velocityIterations = 6;
        const positionIterations = 2;
        // This is our little game loop.
        for (let i = 0; i < 60; ++i) {
            // Instruct the world to perform a single step of simulation.
            // It is generally best to keep the time step and iterations fixed.
            world.Step(timeStep, velocityIterations, positionIterations);
            // Now print the position and angle of the body.
            const position = body.GetPosition();
            const angle = body.GetAngleRadians();
            console.log(position.x.toFixed(2), position.y.toFixed(2), angle.toFixed(2));
        }
        // When the world destructor is called, all bodies and joints are freed. This can
        // create orphaned pointers, so be careful about your world management.
        return 0;
    }
    exports_50("main", main);
    return {
        setters:[
            function (b2Math_34_1) {
                b2Math_34 = b2Math_34_1;
            },
            function (b2World_1_1) {
                b2World_1 = b2World_1_1;
            },
            function (b2Body_2_1) {
                b2Body_2 = b2Body_2_1;
            },
            function (b2Fixture_4_1) {
                b2Fixture_4 = b2Fixture_4_1;
            },
            function (b2PolygonShape_5_1) {
                b2PolygonShape_5 = b2PolygonShape_5_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=box2d-helloworld.js.map