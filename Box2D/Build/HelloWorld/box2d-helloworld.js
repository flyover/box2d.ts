var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var box2d;
(function (box2d) {
    box2d.DEBUG = true;
    box2d.ENABLE_ASSERTS = box2d.DEBUG;
    function b2Assert(condition) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!condition) {
            debugger;
        }
    }
    box2d.b2Assert = b2Assert;
    box2d.b2_maxFloat = 1E+37; // FLT_MAX instead of Number.MAX_VALUE;
    box2d.b2_epsilon = 1E-5; // FLT_EPSILON instead of Number.MIN_VALUE;
    box2d.b2_epsilon_sq = (box2d.b2_epsilon * box2d.b2_epsilon);
    box2d.b2_pi = 3.14159265359; // Math.PI;
    /// @file
    /// Global tuning constants based on meters-kilograms-seconds (MKS) units.
    ///
    // Collision
    /// The maximum number of contact points between two convex shapes. Do
    /// not change this value.
    box2d.b2_maxManifoldPoints = 2;
    /// The maximum number of vertices on a convex polygon. You cannot increase
    /// this too much because b2BlockAllocator has a maximum object size.
    box2d.b2_maxPolygonVertices = 8;
    /// This is used to fatten AABBs in the dynamic tree. This allows proxies
    /// to move by a small amount without triggering a tree adjustment.
    /// This is in meters.
    box2d.b2_aabbExtension = 0.1;
    /// This is used to fatten AABBs in the dynamic tree. This is used to predict
    /// the future position based on the current displacement.
    /// This is a dimensionless multiplier.
    box2d.b2_aabbMultiplier = 2;
    /// A small length used as a collision and constraint tolerance. Usually it is
    /// chosen to be numerically significant, but visually insignificant.
    box2d.b2_linearSlop = 0.008; // 0.005;
    /// A small angle used as a collision and constraint tolerance. Usually it is
    /// chosen to be numerically significant, but visually insignificant.
    box2d.b2_angularSlop = 2 / 180 * box2d.b2_pi;
    /// The radius of the polygon/edge shape skin. This should not be modified. Making
    /// this smaller means polygons will have an insufficient buffer for continuous collision.
    /// Making it larger may create artifacts for vertex collision.
    box2d.b2_polygonRadius = 2 * box2d.b2_linearSlop;
    /// Maximum number of sub-steps per contact in continuous physics simulation.
    box2d.b2_maxSubSteps = 8;
    // Dynamics
    /// Maximum number of contacts to be handled to solve a TOI impact.
    box2d.b2_maxTOIContacts = 32;
    /// A velocity threshold for elastic collisions. Any collision with a relative linear
    /// velocity below this threshold will be treated as inelastic.
    box2d.b2_velocityThreshold = 1;
    /// The maximum linear position correction used when solving constraints. This helps to
    /// prevent overshoot.
    box2d.b2_maxLinearCorrection = 0.2;
    /// The maximum angular position correction used when solving constraints. This helps to
    /// prevent overshoot.
    box2d.b2_maxAngularCorrection = 8 / 180 * box2d.b2_pi;
    /// The maximum linear velocity of a body. This limit is very large and is used
    /// to prevent numerical problems. You shouldn't need to adjust this.
    box2d.b2_maxTranslation = 2;
    box2d.b2_maxTranslationSquared = box2d.b2_maxTranslation * box2d.b2_maxTranslation;
    /// The maximum angular velocity of a body. This limit is very large and is used
    /// to prevent numerical problems. You shouldn't need to adjust this.
    box2d.b2_maxRotation = 0.5 * box2d.b2_pi;
    box2d.b2_maxRotationSquared = box2d.b2_maxRotation * box2d.b2_maxRotation;
    /// This scale factor controls how fast overlap is resolved. Ideally this would be 1 so
    /// that overlap is removed in one time step. However using values close to 1 often lead
    /// to overshoot.
    box2d.b2_baumgarte = 0.2;
    box2d.b2_toiBaumgarte = 0.75;
    // Sleep
    /// The time that a body must be still before it will go to sleep.
    box2d.b2_timeToSleep = 0.5;
    /// A body cannot sleep if its linear velocity is above this tolerance.
    box2d.b2_linearSleepTolerance = 0.01;
    /// A body cannot sleep if its angular velocity is above this tolerance.
    box2d.b2_angularSleepTolerance = 2 / 180 * box2d.b2_pi;
    // Memory Allocation
    /// Implement this function to use your own memory allocator.
    function b2Alloc(size) {
        return null;
    }
    box2d.b2Alloc = b2Alloc;
    /// If you implement b2Alloc, you should also implement this function.
    function b2Free(mem) {
    }
    box2d.b2Free = b2Free;
    /// Logging function.
    function b2Log(message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // const args = Array.prototype.slice.call(arguments);
        // const str = goog.string.format.apply(null, args.slice(0));
        // console.log(message);
    }
    box2d.b2Log = b2Log;
    /// Version numbering scheme.
    /// See http://en.wikipedia.org/wiki/Software_versioning
    var b2Version = (function () {
        function b2Version(major, minor, revision) {
            if (major === void 0) { major = 0; }
            if (minor === void 0) { minor = 0; }
            if (revision === void 0) { revision = 0; }
            this.major = 0; ///< significant changes
            this.minor = 0; ///< incremental changes
            this.revision = 0; ///< bug fixes
            this.major = major;
            this.minor = minor;
            this.revision = revision;
        }
        b2Version.prototype.toString = function () {
            return this.major + "." + this.minor + "." + this.revision;
        };
        return b2Version;
    }());
    box2d.b2Version = b2Version;
    /// Current version.
    box2d.b2_version = new b2Version(2, 3, 0);
    box2d.b2_changelist = 251;
    function b2ParseInt(v) {
        return parseInt(v, 10);
    }
    box2d.b2ParseInt = b2ParseInt;
    function b2ParseUInt(v) {
        return Math.abs(parseInt(v, 10));
    }
    box2d.b2ParseUInt = b2ParseUInt;
    function b2MakeArray(length, init) {
        var a = [];
        for (var i = 0; i < length; ++i) {
            a.push(init(i));
        }
        return a;
    }
    box2d.b2MakeArray = b2MakeArray;
    function b2MakeNumberArray(length) {
        return b2MakeArray(length, function (i) { return 0; });
    }
    box2d.b2MakeNumberArray = b2MakeNumberArray;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
var box2d;
(function (box2d) {
    box2d.b2_pi_over_180 = box2d.b2_pi / 180;
    box2d.b2_180_over_pi = 180 / box2d.b2_pi;
    box2d.b2_two_pi = 2 * box2d.b2_pi;
    function b2Abs(n) {
        return (n < 0) ? (-n) : (n);
    }
    box2d.b2Abs = b2Abs;
    function b2Min(a, b) {
        return (a < b) ? (a) : (b);
    }
    box2d.b2Min = b2Min;
    function b2Max(a, b) {
        return (a > b) ? (a) : (b);
    }
    box2d.b2Max = b2Max;
    function b2Clamp(a, lo, hi) {
        return (a < lo) ? (lo) : ((a > hi) ? (hi) : (a));
    }
    box2d.b2Clamp = b2Clamp;
    function b2Swap(a, b) {
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(false);
        }
        var tmp = a[0];
        a[0] = b[0];
        b[0] = tmp;
    }
    box2d.b2Swap = b2Swap;
    /// This function is used to ensure that a floating point number is
    /// not a NaN or infinity.
    function b2IsValid(n) {
        return isFinite(n);
    }
    box2d.b2IsValid = b2IsValid;
    function b2Sq(n) {
        return n * n;
    }
    box2d.b2Sq = b2Sq;
    /// This is a approximate yet fast inverse square-root.
    function b2InvSqrt(n) {
        return 1 / Math.sqrt(n);
    }
    box2d.b2InvSqrt = b2InvSqrt;
    function b2Sqrt(n) {
        return Math.sqrt(n);
    }
    box2d.b2Sqrt = b2Sqrt;
    function b2Pow(x, y) {
        return Math.pow(x, y);
    }
    box2d.b2Pow = b2Pow;
    function b2DegToRad(degrees) {
        return degrees * box2d.b2_pi_over_180;
    }
    box2d.b2DegToRad = b2DegToRad;
    function b2RadToDeg(radians) {
        return radians * box2d.b2_180_over_pi;
    }
    box2d.b2RadToDeg = b2RadToDeg;
    function b2Cos(radians) {
        return Math.cos(radians);
    }
    box2d.b2Cos = b2Cos;
    function b2Sin(radians) {
        return Math.sin(radians);
    }
    box2d.b2Sin = b2Sin;
    function b2Acos(n) {
        return Math.acos(n);
    }
    box2d.b2Acos = b2Acos;
    function b2Asin(n) {
        return Math.asin(n);
    }
    box2d.b2Asin = b2Asin;
    function b2Atan2(y, x) {
        return Math.atan2(y, x);
    }
    box2d.b2Atan2 = b2Atan2;
    function b2NextPowerOfTwo(x) {
        x |= (x >> 1) & 0x7FFFFFFF;
        x |= (x >> 2) & 0x3FFFFFFF;
        x |= (x >> 4) & 0x0FFFFFFF;
        x |= (x >> 8) & 0x00FFFFFF;
        x |= (x >> 16) & 0x0000FFFF;
        return x + 1;
    }
    box2d.b2NextPowerOfTwo = b2NextPowerOfTwo;
    function b2IsPowerOfTwo(x) {
        return x > 0 && (x & (x - 1)) === 0;
    }
    box2d.b2IsPowerOfTwo = b2IsPowerOfTwo;
    function b2Random() {
        return Math.random() * 2 - 1;
    }
    box2d.b2Random = b2Random;
    function b2RandomRange(lo, hi) {
        return (hi - lo) * Math.random() + lo;
    }
    box2d.b2RandomRange = b2RandomRange;
    /// A 2D column vector.
    var b2Vec2 = (function () {
        function b2Vec2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        b2Vec2.prototype.Clone = function () {
            return new b2Vec2(this.x, this.y);
        };
        b2Vec2.prototype.SetZero = function () {
            this.x = 0;
            this.y = 0;
            return this;
        };
        b2Vec2.prototype.SetXY = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        b2Vec2.prototype.Copy = function (other) {
            // if (ENABLE_ASSERTS) { b2Assert(this !== other); }
            this.x = other.x;
            this.y = other.y;
            return this;
        };
        b2Vec2.prototype.SelfAdd = function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };
        b2Vec2.prototype.SelfAddXY = function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        };
        b2Vec2.prototype.SelfSub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        b2Vec2.prototype.SelfSubXY = function (x, y) {
            this.x -= x;
            this.y -= y;
            return this;
        };
        b2Vec2.prototype.SelfMul = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        b2Vec2.prototype.SelfMulAdd = function (s, v) {
            this.x += s * v.x;
            this.y += s * v.y;
            return this;
        };
        b2Vec2.prototype.SelfMulSub = function (s, v) {
            this.x -= s * v.x;
            this.y -= s * v.y;
            return this;
        };
        b2Vec2.prototype.Dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        b2Vec2.prototype.Cross = function (v) {
            return this.x * v.y - this.y * v.x;
        };
        b2Vec2.prototype.GetLength = function () {
            var x = this.x, y = this.y;
            return Math.sqrt(x * x + y * y);
        };
        b2Vec2.prototype.GetLengthSquared = function () {
            var x = this.x, y = this.y;
            return (x * x + y * y);
        };
        b2Vec2.prototype.Normalize = function () {
            var length = this.GetLength();
            if (length >= box2d.b2_epsilon) {
                var inv_length = 1 / length;
                this.x *= inv_length;
                this.y *= inv_length;
            }
            return length;
        };
        b2Vec2.prototype.SelfNormalize = function () {
            var length = this.GetLength();
            if (length >= box2d.b2_epsilon) {
                var inv_length = 1 / length;
                this.x *= inv_length;
                this.y *= inv_length;
            }
            return this;
        };
        b2Vec2.prototype.SelfRotate = function (radians) {
            var c = Math.cos(radians);
            var s = Math.sin(radians);
            var x = this.x;
            this.x = c * x - s * this.y;
            this.y = s * x + c * this.y;
            return this;
        };
        b2Vec2.prototype.IsValid = function () {
            return isFinite(this.x) && isFinite(this.y);
        };
        b2Vec2.prototype.SelfCrossVS = function (s) {
            var x = this.x;
            this.x = s * this.y;
            this.y = -s * x;
            return this;
        };
        b2Vec2.prototype.SelfCrossSV = function (s) {
            var x = this.x;
            this.x = -s * this.y;
            this.y = s * x;
            return this;
        };
        b2Vec2.prototype.SelfMinV = function (v) {
            this.x = b2Min(this.x, v.x);
            this.y = b2Min(this.y, v.y);
            return this;
        };
        b2Vec2.prototype.SelfMaxV = function (v) {
            this.x = b2Max(this.x, v.x);
            this.y = b2Max(this.y, v.y);
            return this;
        };
        b2Vec2.prototype.SelfAbs = function () {
            this.x = b2Abs(this.x);
            this.y = b2Abs(this.y);
            return this;
        };
        b2Vec2.prototype.SelfNeg = function () {
            this.x = (-this.x);
            this.y = (-this.y);
            return this;
        };
        b2Vec2.prototype.SelfSkew = function () {
            var x = this.x;
            this.x = -this.y;
            this.y = x;
            return this;
        };
        b2Vec2.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2Vec2(); });
        };
        b2Vec2.ZERO = new b2Vec2(0, 0);
        b2Vec2.UNITX = new b2Vec2(1, 0);
        b2Vec2.UNITY = new b2Vec2(0, 1);
        b2Vec2.s_t0 = new b2Vec2();
        b2Vec2.s_t1 = new b2Vec2();
        b2Vec2.s_t2 = new b2Vec2();
        b2Vec2.s_t3 = new b2Vec2();
        return b2Vec2;
    }());
    box2d.b2Vec2 = b2Vec2;
    box2d.b2Vec2_zero = new b2Vec2(0, 0);
    function b2AbsV(v, out) {
        out.x = b2Abs(v.x);
        out.y = b2Abs(v.y);
        return out;
    }
    box2d.b2AbsV = b2AbsV;
    function b2MinV(a, b, out) {
        out.x = b2Min(a.x, b.x);
        out.y = b2Min(a.y, b.y);
        return out;
    }
    box2d.b2MinV = b2MinV;
    function b2MaxV(a, b, out) {
        out.x = b2Max(a.x, b.x);
        out.y = b2Max(a.y, b.y);
        return out;
    }
    box2d.b2MaxV = b2MaxV;
    function b2ClampV(v, lo, hi, out) {
        out.x = b2Clamp(v.x, lo.x, hi.x);
        out.y = b2Clamp(v.y, lo.y, hi.y);
        return out;
    }
    box2d.b2ClampV = b2ClampV;
    function b2RotateV(v, radians, out) {
        var v_x = v.x, v_y = v.y;
        var c = Math.cos(radians);
        var s = Math.sin(radians);
        out.x = c * v_x - s * v_y;
        out.y = s * v_x + c * v_y;
        return out;
    }
    box2d.b2RotateV = b2RotateV;
    function b2DotVV(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    box2d.b2DotVV = b2DotVV;
    function b2CrossVV(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    box2d.b2CrossVV = b2CrossVV;
    function b2CrossVS(v, s, out) {
        var v_x = v.x;
        out.x = s * v.y;
        out.y = -s * v_x;
        return out;
    }
    box2d.b2CrossVS = b2CrossVS;
    function b2CrossVOne(v, out) {
        var v_x = v.x;
        out.x = v.y;
        out.y = -v_x;
        return out;
    }
    box2d.b2CrossVOne = b2CrossVOne;
    function b2CrossSV(s, v, out) {
        var v_x = v.x;
        out.x = -s * v.y;
        out.y = s * v_x;
        return out;
    }
    box2d.b2CrossSV = b2CrossSV;
    function b2CrossOneV(v, out) {
        var v_x = v.x;
        out.x = -v.y;
        out.y = v_x;
        return out;
    }
    box2d.b2CrossOneV = b2CrossOneV;
    function b2AddVV(a, b, out) { out.x = a.x + b.x; out.y = a.y + b.y; return out; }
    box2d.b2AddVV = b2AddVV;
    function b2SubVV(a, b, out) { out.x = a.x - b.x; out.y = a.y - b.y; return out; }
    box2d.b2SubVV = b2SubVV;
    function b2MulSV(s, v, out) { out.x = v.x * s; out.y = v.y * s; return out; }
    box2d.b2MulSV = b2MulSV;
    function b2AddVMulSV(a, s, b, out) { out.x = a.x + (s * b.x); out.y = a.y + (s * b.y); return out; }
    box2d.b2AddVMulSV = b2AddVMulSV;
    function b2SubVMulSV(a, s, b, out) { out.x = a.x - (s * b.x); out.y = a.y - (s * b.y); return out; }
    box2d.b2SubVMulSV = b2SubVMulSV;
    function b2AddVCrossSV(a, s, v, out) {
        var v_x = v.x;
        out.x = a.x - (s * v.y);
        out.y = a.y + (s * v_x);
        return out;
    }
    box2d.b2AddVCrossSV = b2AddVCrossSV;
    function b2MidVV(a, b, out) { out.x = (a.x + b.x) * 0.5; out.y = (a.y + b.y) * 0.5; return out; }
    box2d.b2MidVV = b2MidVV;
    function b2ExtVV(a, b, out) { out.x = (b.x - a.x) * 0.5; out.y = (b.y - a.y) * 0.5; return out; }
    box2d.b2ExtVV = b2ExtVV;
    function b2IsEqualToV(a, b) {
        return a.x === b.x && a.y === b.y;
    }
    box2d.b2IsEqualToV = b2IsEqualToV;
    function b2DistanceVV(a, b) {
        var c_x = a.x - b.x;
        var c_y = a.y - b.y;
        return Math.sqrt(c_x * c_x + c_y * c_y);
    }
    box2d.b2DistanceVV = b2DistanceVV;
    function b2DistanceSquaredVV(a, b) {
        var c_x = a.x - b.x;
        var c_y = a.y - b.y;
        return (c_x * c_x + c_y * c_y);
    }
    box2d.b2DistanceSquaredVV = b2DistanceSquaredVV;
    function b2NegV(v, out) { out.x = -v.x; out.y = -v.y; return out; }
    box2d.b2NegV = b2NegV;
    /// A 2D column vector with 3 elements.
    var b2Vec3 = (function () {
        function b2Vec3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        b2Vec3.prototype.Clone = function () {
            return new b2Vec3(this.x, this.y, this.z);
        };
        b2Vec3.prototype.SetZero = function () {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        };
        b2Vec3.prototype.SetXYZ = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        b2Vec3.prototype.Copy = function (other) {
            // if (ENABLE_ASSERTS) { b2Assert(this !== other); }
            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
            return this;
        };
        b2Vec3.prototype.SelfNeg = function () {
            this.x = (-this.x);
            this.y = (-this.y);
            this.z = (-this.z);
            return this;
        };
        b2Vec3.prototype.SelfAdd = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        };
        b2Vec3.prototype.SelfAddXYZ = function (x, y, z) {
            this.x += x;
            this.y += y;
            this.z += z;
            return this;
        };
        b2Vec3.prototype.SelfSub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        };
        b2Vec3.prototype.SelfSubXYZ = function (x, y, z) {
            this.x -= x;
            this.y -= y;
            this.z -= z;
            return this;
        };
        b2Vec3.prototype.SelfMul = function (s) {
            this.x *= s;
            this.y *= s;
            this.z *= s;
            return this;
        };
        b2Vec3.ZERO = new b2Vec3(0, 0, 0);
        b2Vec3.s_t0 = new b2Vec3();
        return b2Vec3;
    }());
    box2d.b2Vec3 = b2Vec3;
    function b2DotV3V3(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    box2d.b2DotV3V3 = b2DotV3V3;
    function b2CrossV3V3(a, b, out) {
        var a_x = a.x, a_y = a.y, a_z = a.z;
        var b_x = b.x, b_y = b.y, b_z = b.z;
        out.x = a_y * b_z - a_z * b_y;
        out.y = a_z * b_x - a_x * b_z;
        out.z = a_x * b_y - a_y * b_x;
        return out;
    }
    box2d.b2CrossV3V3 = b2CrossV3V3;
    /// A 2-by-2 matrix. Stored in column-major order.
    var b2Mat22 = (function () {
        function b2Mat22() {
            this.ex = new b2Vec2(1, 0);
            this.ey = new b2Vec2(0, 1);
        }
        b2Mat22.prototype.Clone = function () {
            return new b2Mat22().Copy(this);
        };
        b2Mat22.FromVV = function (c1, c2) {
            return new b2Mat22().SetVV(c1, c2);
        };
        b2Mat22.FromSSSS = function (r1c1, r1c2, r2c1, r2c2) {
            return new b2Mat22().SetSSSS(r1c1, r1c2, r2c1, r2c2);
        };
        b2Mat22.FromAngleRadians = function (radians) {
            return new b2Mat22().SetAngleRadians(radians);
        };
        b2Mat22.prototype.SetSSSS = function (r1c1, r1c2, r2c1, r2c2) {
            this.ex.SetXY(r1c1, r2c1);
            this.ey.SetXY(r1c2, r2c2);
            return this;
        };
        b2Mat22.prototype.SetVV = function (c1, c2) {
            this.ex.Copy(c1);
            this.ey.Copy(c2);
            return this;
        };
        b2Mat22.prototype.SetAngleRadians = function (radians) {
            var c = Math.cos(radians);
            var s = Math.sin(radians);
            this.ex.SetXY(c, s);
            this.ey.SetXY(-s, c);
            return this;
        };
        b2Mat22.prototype.Copy = function (other) {
            // if (ENABLE_ASSERTS) { b2Assert(this !== other); }
            this.ex.Copy(other.ex);
            this.ey.Copy(other.ey);
            return this;
        };
        b2Mat22.prototype.SetIdentity = function () {
            this.ex.SetXY(1, 0);
            this.ey.SetXY(0, 1);
            return this;
        };
        b2Mat22.prototype.SetZero = function () {
            this.ex.SetZero();
            this.ey.SetZero();
            return this;
        };
        b2Mat22.prototype.GetAngleRadians = function () {
            return Math.atan2(this.ex.y, this.ex.x);
        };
        b2Mat22.prototype.GetInverse = function (out) {
            var a = this.ex.x;
            var b = this.ey.x;
            var c = this.ex.y;
            var d = this.ey.y;
            var det = a * d - b * c;
            if (det !== 0) {
                det = 1 / det;
            }
            out.ex.x = det * d;
            out.ey.x = (-det * b);
            out.ex.y = (-det * c);
            out.ey.y = det * a;
            return out;
        };
        b2Mat22.prototype.Solve = function (b_x, b_y, out) {
            var a11 = this.ex.x, a12 = this.ey.x;
            var a21 = this.ex.y, a22 = this.ey.y;
            var det = a11 * a22 - a12 * a21;
            if (det !== 0) {
                det = 1 / det;
            }
            out.x = det * (a22 * b_x - a12 * b_y);
            out.y = det * (a11 * b_y - a21 * b_x);
            return out;
        };
        b2Mat22.prototype.SelfAbs = function () {
            this.ex.SelfAbs();
            this.ey.SelfAbs();
            return this;
        };
        b2Mat22.prototype.SelfInv = function () {
            return this.GetInverse(this);
        };
        b2Mat22.prototype.SelfAddM = function (M) {
            this.ex.SelfAdd(M.ex);
            this.ey.SelfAdd(M.ey);
            return this;
        };
        b2Mat22.prototype.SelfSubM = function (M) {
            this.ex.SelfSub(M.ex);
            this.ey.SelfSub(M.ey);
            return this;
        };
        b2Mat22.IDENTITY = new b2Mat22();
        return b2Mat22;
    }());
    box2d.b2Mat22 = b2Mat22;
    function b2AbsM(M, out) {
        var M_ex = M.ex, M_ey = M.ey;
        out.ex.x = b2Abs(M_ex.x);
        out.ex.y = b2Abs(M_ex.y);
        out.ey.x = b2Abs(M_ey.x);
        out.ey.y = b2Abs(M_ey.y);
        return out;
    }
    box2d.b2AbsM = b2AbsM;
    function b2MulMV(M, v, out) {
        var M_ex = M.ex, M_ey = M.ey;
        var v_x = v.x, v_y = v.y;
        out.x = M_ex.x * v_x + M_ey.x * v_y;
        out.y = M_ex.y * v_x + M_ey.y * v_y;
        return out;
    }
    box2d.b2MulMV = b2MulMV;
    function b2MulTMV(M, v, out) {
        var M_ex = M.ex, M_ey = M.ey;
        var v_x = v.x, v_y = v.y;
        out.x = M_ex.x * v_x + M_ex.y * v_y;
        out.y = M_ey.x * v_x + M_ey.y * v_y;
        return out;
    }
    box2d.b2MulTMV = b2MulTMV;
    function b2AddMM(A, B, out) {
        var A_ex = A.ex, A_ey = A.ey;
        var B_ex = B.ex, B_ey = B.ey;
        out.ex.x = A_ex.x + B_ex.x;
        out.ex.y = A_ex.y + B_ex.y;
        out.ey.x = A_ey.x + B_ey.x;
        out.ey.y = A_ey.y + B_ey.y;
        return out;
    }
    box2d.b2AddMM = b2AddMM;
    function b2MulMM(A, B, out) {
        var A_ex_x = A.ex.x, A_ex_y = A.ex.y;
        var A_ey_x = A.ey.x, A_ey_y = A.ey.y;
        var B_ex_x = B.ex.x, B_ex_y = B.ex.y;
        var B_ey_x = B.ey.x, B_ey_y = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ey_x * B_ex_y;
        out.ex.y = A_ex_y * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ey_x * B_ey_y;
        out.ey.y = A_ex_y * B_ey_x + A_ey_y * B_ey_y;
        return out;
    }
    box2d.b2MulMM = b2MulMM;
    function b2MulTMM(A, B, out) {
        var A_ex_x = A.ex.x, A_ex_y = A.ex.y;
        var A_ey_x = A.ey.x, A_ey_y = A.ey.y;
        var B_ex_x = B.ex.x, B_ex_y = B.ex.y;
        var B_ey_x = B.ey.x, B_ey_y = B.ey.y;
        out.ex.x = A_ex_x * B_ex_x + A_ex_y * B_ex_y;
        out.ex.y = A_ey_x * B_ex_x + A_ey_y * B_ex_y;
        out.ey.x = A_ex_x * B_ey_x + A_ex_y * B_ey_y;
        out.ey.y = A_ey_x * B_ey_x + A_ey_y * B_ey_y;
        return out;
    }
    box2d.b2MulTMM = b2MulTMM;
    /// A 3-by-3 matrix. Stored in column-major order.
    var b2Mat33 = (function () {
        function b2Mat33() {
            this.ex = new b2Vec3(1, 0, 0);
            this.ey = new b2Vec3(0, 1, 0);
            this.ez = new b2Vec3(0, 0, 1);
        }
        b2Mat33.prototype.Clone = function () {
            return new b2Mat33().Copy(this);
        };
        b2Mat33.prototype.SetVVV = function (c1, c2, c3) {
            this.ex.Copy(c1);
            this.ey.Copy(c2);
            this.ez.Copy(c3);
            return this;
        };
        b2Mat33.prototype.Copy = function (other) {
            // if (ENABLE_ASSERTS) { b2Assert(this !== other); }
            this.ex.Copy(other.ex);
            this.ey.Copy(other.ey);
            this.ez.Copy(other.ez);
            return this;
        };
        b2Mat33.prototype.SetIdentity = function () {
            this.ex.SetXYZ(1, 0, 0);
            this.ey.SetXYZ(0, 1, 0);
            this.ez.SetXYZ(0, 0, 1);
            return this;
        };
        b2Mat33.prototype.SetZero = function () {
            this.ex.SetZero();
            this.ey.SetZero();
            this.ez.SetZero();
            return this;
        };
        b2Mat33.prototype.SelfAddM = function (M) {
            this.ex.SelfAdd(M.ex);
            this.ey.SelfAdd(M.ey);
            this.ez.SelfAdd(M.ez);
            return this;
        };
        b2Mat33.prototype.Solve33 = function (b_x, b_y, b_z, out) {
            var a11 = this.ex.x, a21 = this.ex.y, a31 = this.ex.z;
            var a12 = this.ey.x, a22 = this.ey.y, a32 = this.ey.z;
            var a13 = this.ez.x, a23 = this.ez.y, a33 = this.ez.z;
            var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
            if (det !== 0) {
                det = 1 / det;
            }
            out.x = det * (b_x * (a22 * a33 - a32 * a23) + b_y * (a32 * a13 - a12 * a33) + b_z * (a12 * a23 - a22 * a13));
            out.y = det * (a11 * (b_y * a33 - b_z * a23) + a21 * (b_z * a13 - b_x * a33) + a31 * (b_x * a23 - b_y * a13));
            out.z = det * (a11 * (a22 * b_z - a32 * b_y) + a21 * (a32 * b_x - a12 * b_z) + a31 * (a12 * b_y - a22 * b_x));
            return out;
        };
        b2Mat33.prototype.Solve22 = function (b_x, b_y, out) {
            var a11 = this.ex.x, a12 = this.ey.x;
            var a21 = this.ex.y, a22 = this.ey.y;
            var det = a11 * a22 - a12 * a21;
            if (det !== 0) {
                det = 1 / det;
            }
            out.x = det * (a22 * b_x - a12 * b_y);
            out.y = det * (a11 * b_y - a21 * b_x);
            return out;
        };
        b2Mat33.prototype.GetInverse22 = function (M) {
            var a = this.ex.x, b = this.ey.x, c = this.ex.y, d = this.ey.y;
            var det = a * d - b * c;
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
        };
        b2Mat33.prototype.GetSymInverse33 = function (M) {
            var det = b2DotV3V3(this.ex, b2CrossV3V3(this.ey, this.ez, b2Vec3.s_t0));
            if (det !== 0) {
                det = 1 / det;
            }
            var a11 = this.ex.x, a12 = this.ey.x, a13 = this.ez.x;
            var a22 = this.ey.y, a23 = this.ez.y;
            var a33 = this.ez.z;
            M.ex.x = det * (a22 * a33 - a23 * a23);
            M.ex.y = det * (a13 * a23 - a12 * a33);
            M.ex.z = det * (a12 * a23 - a13 * a22);
            M.ey.x = M.ex.y;
            M.ey.y = det * (a11 * a33 - a13 * a13);
            M.ey.z = det * (a13 * a12 - a11 * a23);
            M.ez.x = M.ex.z;
            M.ez.y = M.ey.z;
            M.ez.z = det * (a11 * a22 - a12 * a12);
        };
        b2Mat33.IDENTITY = new b2Mat33();
        return b2Mat33;
    }());
    box2d.b2Mat33 = b2Mat33;
    function b2MulM33V3(A, v, out) {
        var v_x = v.x, v_y = v.y, v_z = v.z;
        out.x = A.ex.x * v_x + A.ey.x * v_y + A.ez.x * v_z;
        out.y = A.ex.y * v_x + A.ey.y * v_y + A.ez.y * v_z;
        out.z = A.ex.z * v_x + A.ey.z * v_y + A.ez.z * v_z;
        return out;
    }
    box2d.b2MulM33V3 = b2MulM33V3;
    function b2MulM33XYZ(A, x, y, z, out) {
        out.x = A.ex.x * x + A.ey.x * y + A.ez.x * z;
        out.y = A.ex.y * x + A.ey.y * y + A.ez.y * z;
        out.z = A.ex.z * x + A.ey.z * y + A.ez.z * z;
        return out;
    }
    box2d.b2MulM33XYZ = b2MulM33XYZ;
    function b2MulM33V2(A, v, out) {
        var v_x = v.x, v_y = v.y;
        out.x = A.ex.x * v_x + A.ey.x * v_y;
        out.y = A.ex.y * v_x + A.ey.y * v_y;
        return out;
    }
    box2d.b2MulM33V2 = b2MulM33V2;
    function b2MulM33XY(A, x, y, out) {
        out.x = A.ex.x * x + A.ey.x * y;
        out.y = A.ex.y * x + A.ey.y * y;
        return out;
    }
    box2d.b2MulM33XY = b2MulM33XY;
    /// Rotation
    var b2Rot = (function () {
        function b2Rot(angle) {
            if (angle === void 0) { angle = 0; }
            this.s = 0;
            this.c = 1;
            if (angle) {
                this.s = Math.sin(angle);
                this.c = Math.cos(angle);
            }
        }
        b2Rot.prototype.Clone = function () {
            return new b2Rot().Copy(this);
        };
        b2Rot.prototype.Copy = function (other) {
            this.s = other.s;
            this.c = other.c;
            return this;
        };
        b2Rot.prototype.SetAngleRadians = function (angle) {
            this.s = Math.sin(angle);
            this.c = Math.cos(angle);
            return this;
        };
        b2Rot.prototype.SetIdentity = function () {
            this.s = 0;
            this.c = 1;
            return this;
        };
        b2Rot.prototype.GetAngleRadians = function () {
            return Math.atan2(this.s, this.c);
        };
        b2Rot.prototype.GetXAxis = function (out) {
            out.x = this.c;
            out.y = this.s;
            return out;
        };
        b2Rot.prototype.GetYAxis = function (out) {
            out.x = -this.s;
            out.y = this.c;
            return out;
        };
        b2Rot.IDENTITY = new b2Rot();
        return b2Rot;
    }());
    box2d.b2Rot = b2Rot;
    function b2MulRR(q, r, out) {
        // [qc -qs] * [rc -rs] = [qc*rc-qs*rs -qc*rs-qs*rc]
        // [qs  qc]   [rs  rc]   [qs*rc+qc*rs -qs*rs+qc*rc]
        // s = qs * rc + qc * rs
        // c = qc * rc - qs * rs
        var q_c = q.c, q_s = q.s;
        var r_c = r.c, r_s = r.s;
        out.s = q_s * r_c + q_c * r_s;
        out.c = q_c * r_c - q_s * r_s;
        return out;
    }
    box2d.b2MulRR = b2MulRR;
    function b2MulTRR(q, r, out) {
        // [ qc qs] * [rc -rs] = [qc*rc+qs*rs -qc*rs+qs*rc]
        // [-qs qc]   [rs  rc]   [-qs*rc+qc*rs qs*rs+qc*rc]
        // s = qc * rs - qs * rc
        // c = qc * rc + qs * rs
        var q_c = q.c, q_s = q.s;
        var r_c = r.c, r_s = r.s;
        out.s = q_c * r_s - q_s * r_c;
        out.c = q_c * r_c + q_s * r_s;
        return out;
    }
    box2d.b2MulTRR = b2MulTRR;
    function b2MulRV(q, v, out) {
        var q_c = q.c, q_s = q.s;
        var v_x = v.x, v_y = v.y;
        out.x = q_c * v_x - q_s * v_y;
        out.y = q_s * v_x + q_c * v_y;
        return out;
    }
    box2d.b2MulRV = b2MulRV;
    function b2MulTRV(q, v, out) {
        var q_c = q.c, q_s = q.s;
        var v_x = v.x, v_y = v.y;
        out.x = q_c * v_x + q_s * v_y;
        out.y = -q_s * v_x + q_c * v_y;
        return out;
    }
    box2d.b2MulTRV = b2MulTRV;
    /// A transform contains translation and rotation. It is used to represent
    /// the position and orientation of rigid frames.
    var b2Transform = (function () {
        function b2Transform() {
            this.p = new b2Vec2();
            this.q = new b2Rot();
        }
        b2Transform.prototype.Clone = function () {
            return new b2Transform().Copy(this);
        };
        b2Transform.prototype.Copy = function (other) {
            // if (ENABLE_ASSERTS) { b2Assert(this !== other); }
            this.p.Copy(other.p);
            this.q.Copy(other.q);
            return this;
        };
        b2Transform.prototype.SetIdentity = function () {
            this.p.SetZero();
            this.q.SetIdentity();
            return this;
        };
        b2Transform.prototype.SetPositionRotation = function (position, q) {
            this.p.Copy(position);
            this.q.Copy(q);
            return this;
        };
        b2Transform.prototype.SetPositionAngleRadians = function (pos, a) {
            this.p.Copy(pos);
            this.q.SetAngleRadians(a);
            return this;
        };
        b2Transform.prototype.SetPosition = function (position) {
            this.p.Copy(position);
            return this;
        };
        b2Transform.prototype.SetPositionXY = function (x, y) {
            this.p.SetXY(x, y);
            return this;
        };
        b2Transform.prototype.SetRotation = function (rotation) {
            this.q.Copy(rotation);
            return this;
        };
        b2Transform.prototype.SetRotationAngleRadians = function (radians) {
            this.q.SetAngleRadians(radians);
            return this;
        };
        b2Transform.prototype.GetPosition = function () {
            return this.p;
        };
        b2Transform.prototype.GetRotation = function () {
            return this.q;
        };
        b2Transform.prototype.GetRotationAngleRadians = function () {
            return this.q.GetAngleRadians();
        };
        b2Transform.prototype.GetAngleRadians = function () {
            return this.q.GetAngleRadians();
        };
        b2Transform.IDENTITY = new b2Transform();
        return b2Transform;
    }());
    box2d.b2Transform = b2Transform;
    function b2MulXV(T, v, out) {
        //  float32 x = (T.q.c * v.x - T.q.s * v.y) + T.p.x;
        //  float32 y = (T.q.s * v.x + T.q.c * v.y) + T.p.y;
        //
        //  return b2Vec2(x, y);
        var T_q_c = T.q.c, T_q_s = T.q.s;
        var v_x = v.x, v_y = v.y;
        out.x = (T_q_c * v_x - T_q_s * v_y) + T.p.x;
        out.y = (T_q_s * v_x + T_q_c * v_y) + T.p.y;
        return out;
    }
    box2d.b2MulXV = b2MulXV;
    function b2MulTXV(T, v, out) {
        //  float32 px = v.x - T.p.x;
        //  float32 py = v.y - T.p.y;
        //  float32 x = (T.q.c * px + T.q.s * py);
        //  float32 y = (-T.q.s * px + T.q.c * py);
        //
        //  return b2Vec2(x, y);
        var T_q_c = T.q.c, T_q_s = T.q.s;
        var p_x = v.x - T.p.x;
        var p_y = v.y - T.p.y;
        out.x = (T_q_c * p_x + T_q_s * p_y);
        out.y = (-T_q_s * p_x + T_q_c * p_y);
        return out;
    }
    box2d.b2MulTXV = b2MulTXV;
    function b2MulXX(A, B, out) {
        b2MulRR(A.q, B.q, out.q);
        b2AddVV(b2MulRV(A.q, B.p, out.p), A.p, out.p);
        return out;
    }
    box2d.b2MulXX = b2MulXX;
    function b2MulTXX(A, B, out) {
        b2MulTRR(A.q, B.q, out.q);
        b2MulTRV(A.q, b2SubVV(B.p, A.p, out.p), out.p);
        return out;
    }
    box2d.b2MulTXX = b2MulTXX;
    /// This describes the motion of a body/shape for TOI computation.
    /// Shapes are defined with respect to the body origin, which may
    /// no coincide with the center of mass. However, to support dynamics
    /// we must interpolate the center of mass position.
    var b2Sweep = (function () {
        function b2Sweep() {
            this.localCenter = new b2Vec2();
            this.c0 = new b2Vec2();
            this.c = new b2Vec2();
            this.a0 = 0;
            this.a = 0;
            this.alpha0 = 0;
        }
        b2Sweep.prototype.Clone = function () {
            return new b2Sweep().Copy(this);
        };
        b2Sweep.prototype.Copy = function (other) {
            // if (ENABLE_ASSERTS) { b2Assert(this !== other); }
            this.localCenter.Copy(other.localCenter);
            this.c0.Copy(other.c0);
            this.c.Copy(other.c);
            this.a0 = other.a0;
            this.a = other.a;
            this.alpha0 = other.alpha0;
            return this;
        };
        b2Sweep.prototype.GetTransform = function (xf, beta) {
            var one_minus_beta = (1 - beta);
            xf.p.x = one_minus_beta * this.c0.x + beta * this.c.x;
            xf.p.y = one_minus_beta * this.c0.y + beta * this.c.y;
            var angle = one_minus_beta * this.a0 + beta * this.a;
            xf.q.SetAngleRadians(angle);
            xf.p.SelfSub(b2MulRV(xf.q, this.localCenter, b2Vec2.s_t0));
            return xf;
        };
        b2Sweep.prototype.Advance = function (alpha) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.alpha0 < 1);
            }
            var beta = (alpha - this.alpha0) / (1 - this.alpha0);
            var one_minus_beta = (1 - beta);
            this.c0.x = one_minus_beta * this.c0.x + beta * this.c.x;
            this.c0.y = one_minus_beta * this.c0.y + beta * this.c.y;
            this.a0 = one_minus_beta * this.a0 + beta * this.a;
            this.alpha0 = alpha;
        };
        b2Sweep.prototype.Normalize = function () {
            var d = box2d.b2_two_pi * Math.floor(this.a0 / box2d.b2_two_pi);
            this.a0 -= d;
            this.a -= d;
        };
        return b2Sweep;
    }());
    box2d.b2Sweep = b2Sweep;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
var box2d;
(function (box2d) {
    /// Color for debug drawing. Each value has the range [0,1].
    var b2Color = (function () {
        function b2Color(rr, gg, bb) {
            this._r = 0x7f;
            this._g = 0x7f;
            this._b = 0x7f;
            this._r = box2d.b2Clamp(Math.round(rr * 255), 0, 255);
            this._g = box2d.b2Clamp(Math.round(gg * 255), 0, 255);
            this._b = box2d.b2Clamp(Math.round(bb * 255), 0, 255);
        }
        b2Color.prototype.SetRGB = function (rr, gg, bb) {
            this._r = box2d.b2Clamp(Math.round(rr * 255), 0, 255);
            this._g = box2d.b2Clamp(Math.round(gg * 255), 0, 255);
            this._b = box2d.b2Clamp(Math.round(bb * 255), 0, 255);
            return this;
        };
        b2Color.prototype.MakeStyleString = function (alpha) {
            if (alpha === void 0) { alpha = 1; }
            return b2Color.MakeStyleString(this._r, this._g, this._b, alpha);
        };
        b2Color.MakeStyleString = function (r, g, b, a) {
            if (a === void 0) { a = 1; }
            if (a < 1) {
                return "rgba(" + r + "," + g + "," + b + "," + a + ")";
            }
            else {
                return "rgb(" + r + "," + g + "," + b + ")";
            }
        };
        b2Color.RED = new b2Color(1, 0, 0);
        b2Color.GREEN = new b2Color(0, 1, 0);
        b2Color.BLUE = new b2Color(0, 0, 1);
        return b2Color;
    }());
    box2d.b2Color = b2Color;
    (function (b2DrawFlags) {
        b2DrawFlags[b2DrawFlags["e_none"] = 0] = "e_none";
        b2DrawFlags[b2DrawFlags["e_shapeBit"] = 1] = "e_shapeBit";
        b2DrawFlags[b2DrawFlags["e_jointBit"] = 2] = "e_jointBit";
        b2DrawFlags[b2DrawFlags["e_aabbBit"] = 4] = "e_aabbBit";
        b2DrawFlags[b2DrawFlags["e_pairBit"] = 8] = "e_pairBit";
        b2DrawFlags[b2DrawFlags["e_centerOfMassBit"] = 16] = "e_centerOfMassBit";
        b2DrawFlags[b2DrawFlags["e_controllerBit"] = 32] = "e_controllerBit";
        b2DrawFlags[b2DrawFlags["e_all"] = 63] = "e_all";
    })(box2d.b2DrawFlags || (box2d.b2DrawFlags = {}));
    var b2DrawFlags = box2d.b2DrawFlags;
    /// Implement and register this class with a b2World to provide debug drawing of physics
    /// entities in your game.
    var b2Draw = (function () {
        function b2Draw() {
            this.m_drawFlags = 0;
        }
        b2Draw.prototype.SetFlags = function (flags) {
            this.m_drawFlags = flags;
        };
        b2Draw.prototype.GetFlags = function () {
            return this.m_drawFlags;
        };
        b2Draw.prototype.AppendFlags = function (flags) {
            this.m_drawFlags |= flags;
        };
        b2Draw.prototype.ClearFlags = function (flags) {
            this.m_drawFlags &= ~flags;
        };
        b2Draw.prototype.PushTransform = function (xf) {
        };
        b2Draw.prototype.PopTransform = function (xf) {
        };
        b2Draw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
        };
        b2Draw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
        };
        b2Draw.prototype.DrawCircle = function (center, radius, color) {
        };
        b2Draw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
        };
        b2Draw.prototype.DrawSegment = function (p1, p2, color) {
        };
        b2Draw.prototype.DrawTransform = function (xf) {
        };
        return b2Draw;
    }());
    box2d.b2Draw = b2Draw;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
var box2d;
(function (box2d) {
    /// Timer for profiling. This has platform specific code and may
    /// not work on every platform.
    var b2Timer = (function () {
        function b2Timer() {
            this.m_start = new Date().getTime();
        }
        /// Reset the timer.
        b2Timer.prototype.Reset = function () {
            this.m_start = new Date().getTime();
            return this;
        };
        /// Get the time since construction or the last reset.
        b2Timer.prototype.GetMilliseconds = function () {
            return new Date().getTime() - this.m_start;
        };
        return b2Timer;
    }());
    box2d.b2Timer = b2Timer;
    var b2Counter = (function () {
        function b2Counter() {
            this.m_count = 0;
            this.m_min_count = 0;
            this.m_max_count = 0;
        }
        b2Counter.prototype.GetCount = function () {
            return this.m_count;
        };
        b2Counter.prototype.GetMinCount = function () {
            return this.m_min_count;
        };
        b2Counter.prototype.GetMaxCount = function () {
            return this.m_max_count;
        };
        b2Counter.prototype.ResetCount = function () {
            var count = this.m_count;
            this.m_count = 0;
            return count;
        };
        b2Counter.prototype.ResetMinCount = function () {
            this.m_min_count = 0;
        };
        b2Counter.prototype.ResetMaxCount = function () {
            this.m_max_count = 0;
        };
        b2Counter.prototype.Increment = function () {
            this.m_count++;
            if (this.m_max_count < this.m_count) {
                this.m_max_count = this.m_count;
            }
        };
        b2Counter.prototype.Decrement = function () {
            this.m_count--;
            if (this.m_min_count > this.m_count) {
                this.m_min_count = this.m_count;
            }
        };
        return b2Counter;
    }());
    box2d.b2Counter = b2Counter;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
var box2d;
(function (box2d) {
    /// This is a growable LIFO stack with an initial capacity of N.
    /// If the stack size exceeds the initial capacity, the heap is used
    /// to increase the size of the stack.
    var b2GrowableStack = (function () {
        function b2GrowableStack(N) {
            this.m_stack = [];
            this.m_count = 0;
            this.m_stack = new Array(N);
            this.m_count = 0;
        }
        b2GrowableStack.prototype.Reset = function () {
            this.m_count = 0;
            return this;
        };
        b2GrowableStack.prototype.Push = function (element) {
            this.m_stack[this.m_count] = element;
            this.m_count++;
        };
        b2GrowableStack.prototype.Pop = function () {
            // if (box2d.ENABLE_ASSERTS) { box2d.b2Assert(this.m_count > 0); }
            this.m_count--;
            var element = this.m_stack[this.m_count];
            this.m_stack[this.m_count] = null;
            return element;
        };
        b2GrowableStack.prototype.GetCount = function () {
            return this.m_count;
        };
        return b2GrowableStack;
    }());
    box2d.b2GrowableStack = b2GrowableStack;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2ChainShape.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
var box2d;
(function (box2d) {
    /// A distance proxy is used by the GJK algorithm.
    /// It encapsulates any shape.
    var b2DistanceProxy = (function () {
        function b2DistanceProxy() {
            this.m_buffer = box2d.b2Vec2.MakeArray(2);
            this.m_vertices = null;
            this.m_count = 0;
            this.m_radius = 0;
        }
        b2DistanceProxy.prototype.Reset = function () {
            this.m_vertices = null;
            this.m_count = 0;
            this.m_radius = 0;
            return this;
        };
        b2DistanceProxy.prototype.SetShape = function (shape, index) {
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
            //        if (ENABLE_ASSERTS) { b2Assert(0 <= index && index < chain.m_count); }
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
            //      if (ENABLE_ASSERTS) { b2Assert(false); }
            //      break;
            //    }
        };
        b2DistanceProxy.prototype.GetSupport = function (d) {
            var bestIndex = 0;
            var bestValue = box2d.b2DotVV(this.m_vertices[0], d);
            for (var i = 1; i < this.m_count; ++i) {
                var value = box2d.b2DotVV(this.m_vertices[i], d);
                if (value > bestValue) {
                    bestIndex = i;
                    bestValue = value;
                }
            }
            return bestIndex;
        };
        b2DistanceProxy.prototype.GetSupportVertex = function (d) {
            var bestIndex = 0;
            var bestValue = box2d.b2DotVV(this.m_vertices[0], d);
            for (var i = 1; i < this.m_count; ++i) {
                var value = box2d.b2DotVV(this.m_vertices[i], d);
                if (value > bestValue) {
                    bestIndex = i;
                    bestValue = value;
                }
            }
            return this.m_vertices[bestIndex];
        };
        b2DistanceProxy.prototype.GetVertexCount = function () {
            return this.m_count;
        };
        b2DistanceProxy.prototype.GetVertex = function (index) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= index && index < this.m_count);
            }
            return this.m_vertices[index];
        };
        return b2DistanceProxy;
    }());
    box2d.b2DistanceProxy = b2DistanceProxy;
    var b2SimplexCache = (function () {
        function b2SimplexCache() {
            this.metric = 0;
            this.count = 0;
            this.indexA = box2d.b2MakeNumberArray(3);
            this.indexB = box2d.b2MakeNumberArray(3);
        }
        b2SimplexCache.prototype.Reset = function () {
            this.metric = 0;
            this.count = 0;
            return this;
        };
        return b2SimplexCache;
    }());
    box2d.b2SimplexCache = b2SimplexCache;
    var b2DistanceInput = (function () {
        function b2DistanceInput() {
            this.proxyA = new b2DistanceProxy();
            this.proxyB = new b2DistanceProxy();
            this.transformA = new box2d.b2Transform();
            this.transformB = new box2d.b2Transform();
            this.useRadii = false;
        }
        b2DistanceInput.prototype.Reset = function () {
            this.proxyA.Reset();
            this.proxyB.Reset();
            this.transformA.SetIdentity();
            this.transformB.SetIdentity();
            this.useRadii = false;
            return this;
        };
        return b2DistanceInput;
    }());
    box2d.b2DistanceInput = b2DistanceInput;
    var b2DistanceOutput = (function () {
        function b2DistanceOutput() {
            this.pointA = new box2d.b2Vec2();
            this.pointB = new box2d.b2Vec2();
            this.distance = 0;
            this.iterations = 0; ///< number of GJK iterations used
        }
        b2DistanceOutput.prototype.Reset = function () {
            this.pointA.SetZero();
            this.pointB.SetZero();
            this.distance = 0;
            this.iterations = 0;
            return this;
        };
        return b2DistanceOutput;
    }());
    box2d.b2DistanceOutput = b2DistanceOutput;
    box2d.b2_gjkCalls = 0;
    box2d.b2_gjkIters = 0;
    box2d.b2_gjkMaxIters = 0;
    var b2SimplexVertex = (function () {
        function b2SimplexVertex() {
            this.wA = new box2d.b2Vec2(); // support point in proxyA
            this.wB = new box2d.b2Vec2(); // support point in proxyB
            this.w = new box2d.b2Vec2(); // wB - wA
            this.a = 0; // barycentric coordinate for closest point
            this.indexA = 0; // wA index
            this.indexB = 0; // wB index
        }
        b2SimplexVertex.prototype.Copy = function (other) {
            this.wA.Copy(other.wA); // support point in proxyA
            this.wB.Copy(other.wB); // support point in proxyB
            this.w.Copy(other.w); // wB - wA
            this.a = other.a; // barycentric coordinate for closest point
            this.indexA = other.indexA; // wA index
            this.indexB = other.indexB; // wB index
            return this;
        };
        return b2SimplexVertex;
    }());
    box2d.b2SimplexVertex = b2SimplexVertex;
    var b2Simplex = (function () {
        function b2Simplex() {
            this.m_v1 = new b2SimplexVertex();
            this.m_v2 = new b2SimplexVertex();
            this.m_v3 = new b2SimplexVertex();
            this.m_vertices = new Array(3);
            this.m_count = 0;
            this.m_vertices[0] = this.m_v1;
            this.m_vertices[1] = this.m_v2;
            this.m_vertices[2] = this.m_v3;
        }
        b2Simplex.prototype.ReadCache = function (cache, proxyA, transformA, proxyB, transformB) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= cache.count && cache.count <= 3);
            }
            // Copy data from cache.
            this.m_count = cache.count;
            var vertices = this.m_vertices;
            for (var i = 0; i < this.m_count; ++i) {
                var v = vertices[i];
                v.indexA = cache.indexA[i];
                v.indexB = cache.indexB[i];
                var wALocal = proxyA.GetVertex(v.indexA);
                var wBLocal = proxyB.GetVertex(v.indexB);
                box2d.b2MulXV(transformA, wALocal, v.wA);
                box2d.b2MulXV(transformB, wBLocal, v.wB);
                box2d.b2SubVV(v.wB, v.wA, v.w);
                v.a = 0;
            }
            // Compute the new simplex metric, if it is substantially different than
            // old metric then flush the simplex.
            if (this.m_count > 1) {
                var metric1 = cache.metric;
                var metric2 = this.GetMetric();
                if (metric2 < 0.5 * metric1 || 2 * metric1 < metric2 || metric2 < box2d.b2_epsilon) {
                    // Reset the simplex.
                    this.m_count = 0;
                }
            }
            // If the cache is empty or invalid ...
            if (this.m_count === 0) {
                var v = vertices[0];
                v.indexA = 0;
                v.indexB = 0;
                var wALocal = proxyA.GetVertex(0);
                var wBLocal = proxyB.GetVertex(0);
                box2d.b2MulXV(transformA, wALocal, v.wA);
                box2d.b2MulXV(transformB, wBLocal, v.wB);
                box2d.b2SubVV(v.wB, v.wA, v.w);
                v.a = 1;
                this.m_count = 1;
            }
        };
        b2Simplex.prototype.WriteCache = function (cache) {
            cache.metric = this.GetMetric();
            cache.count = this.m_count;
            var vertices = this.m_vertices;
            for (var i = 0; i < this.m_count; ++i) {
                cache.indexA[i] = vertices[i].indexA;
                cache.indexB[i] = vertices[i].indexB;
            }
        };
        b2Simplex.prototype.GetSearchDirection = function (out) {
            switch (this.m_count) {
                case 1:
                    return box2d.b2NegV(this.m_v1.w, out);
                case 2: {
                    var e12 = box2d.b2SubVV(this.m_v2.w, this.m_v1.w, out);
                    var sgn = box2d.b2CrossVV(e12, box2d.b2NegV(this.m_v1.w, box2d.b2Vec2.s_t0));
                    if (sgn > 0) {
                        // Origin is left of e12.
                        return box2d.b2CrossOneV(e12, out);
                    }
                    else {
                        // Origin is right of e12.
                        return box2d.b2CrossVOne(e12, out);
                    }
                }
                default:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    return out.SetZero();
            }
        };
        b2Simplex.prototype.GetClosestPoint = function (out) {
            switch (this.m_count) {
                case 0:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    return out.SetZero();
                case 1:
                    return out.Copy(this.m_v1.w);
                case 2:
                    return out.SetXY(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
                case 3:
                    return out.SetZero();
                default:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    return out.SetZero();
            }
        };
        b2Simplex.prototype.GetWitnessPoints = function (pA, pB) {
            switch (this.m_count) {
                case 0:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
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
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    break;
            }
        };
        b2Simplex.prototype.GetMetric = function () {
            switch (this.m_count) {
                case 0:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    return 0;
                case 1:
                    return 0;
                case 2:
                    return box2d.b2DistanceVV(this.m_v1.w, this.m_v2.w);
                case 3:
                    return box2d.b2CrossVV(box2d.b2SubVV(this.m_v2.w, this.m_v1.w, box2d.b2Vec2.s_t0), box2d.b2SubVV(this.m_v3.w, this.m_v1.w, box2d.b2Vec2.s_t1));
                default:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    return 0;
            }
        };
        b2Simplex.prototype.Solve2 = function () {
            var w1 = this.m_v1.w;
            var w2 = this.m_v2.w;
            var e12 = box2d.b2SubVV(w2, w1, b2Simplex.s_e12);
            // w1 region
            var d12_2 = (-box2d.b2DotVV(w1, e12));
            if (d12_2 <= 0) {
                // a2 <= 0, so we clamp it to 0
                this.m_v1.a = 1;
                this.m_count = 1;
                return;
            }
            // w2 region
            var d12_1 = box2d.b2DotVV(w2, e12);
            if (d12_1 <= 0) {
                // a1 <= 0, so we clamp it to 0
                this.m_v2.a = 1;
                this.m_count = 1;
                this.m_v1.Copy(this.m_v2);
                return;
            }
            // Must be in e12 region.
            var inv_d12 = 1 / (d12_1 + d12_2);
            this.m_v1.a = d12_1 * inv_d12;
            this.m_v2.a = d12_2 * inv_d12;
            this.m_count = 2;
        };
        b2Simplex.prototype.Solve3 = function () {
            var w1 = this.m_v1.w;
            var w2 = this.m_v2.w;
            var w3 = this.m_v3.w;
            // Edge12
            // [1      1     ][a1] = [1]
            // [w1.e12 w2.e12][a2] = [0]
            // a3 = 0
            var e12 = box2d.b2SubVV(w2, w1, b2Simplex.s_e12);
            var w1e12 = box2d.b2DotVV(w1, e12);
            var w2e12 = box2d.b2DotVV(w2, e12);
            var d12_1 = w2e12;
            var d12_2 = (-w1e12);
            // Edge13
            // [1      1     ][a1] = [1]
            // [w1.e13 w3.e13][a3] = [0]
            // a2 = 0
            var e13 = box2d.b2SubVV(w3, w1, b2Simplex.s_e13);
            var w1e13 = box2d.b2DotVV(w1, e13);
            var w3e13 = box2d.b2DotVV(w3, e13);
            var d13_1 = w3e13;
            var d13_2 = (-w1e13);
            // Edge23
            // [1      1     ][a2] = [1]
            // [w2.e23 w3.e23][a3] = [0]
            // a1 = 0
            var e23 = box2d.b2SubVV(w3, w2, b2Simplex.s_e23);
            var w2e23 = box2d.b2DotVV(w2, e23);
            var w3e23 = box2d.b2DotVV(w3, e23);
            var d23_1 = w3e23;
            var d23_2 = (-w2e23);
            // Triangle123
            var n123 = box2d.b2CrossVV(e12, e13);
            var d123_1 = n123 * box2d.b2CrossVV(w2, w3);
            var d123_2 = n123 * box2d.b2CrossVV(w3, w1);
            var d123_3 = n123 * box2d.b2CrossVV(w1, w2);
            // w1 region
            if (d12_2 <= 0 && d13_2 <= 0) {
                this.m_v1.a = 1;
                this.m_count = 1;
                return;
            }
            // e12
            if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
                var inv_d12 = 1 / (d12_1 + d12_2);
                this.m_v1.a = d12_1 * inv_d12;
                this.m_v2.a = d12_2 * inv_d12;
                this.m_count = 2;
                return;
            }
            // e13
            if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
                var inv_d13 = 1 / (d13_1 + d13_2);
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
                var inv_d23 = 1 / (d23_1 + d23_2);
                this.m_v2.a = d23_1 * inv_d23;
                this.m_v3.a = d23_2 * inv_d23;
                this.m_count = 2;
                this.m_v1.Copy(this.m_v3);
                return;
            }
            // Must be in triangle123
            var inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
            this.m_v1.a = d123_1 * inv_d123;
            this.m_v2.a = d123_2 * inv_d123;
            this.m_v3.a = d123_3 * inv_d123;
            this.m_count = 3;
        };
        b2Simplex.s_e12 = new box2d.b2Vec2();
        b2Simplex.s_e13 = new box2d.b2Vec2();
        b2Simplex.s_e23 = new box2d.b2Vec2();
        return b2Simplex;
    }());
    box2d.b2Simplex = b2Simplex;
    var b2Distance_s_simplex = new b2Simplex();
    var b2Distance_s_saveA = box2d.b2MakeNumberArray(3);
    var b2Distance_s_saveB = box2d.b2MakeNumberArray(3);
    var b2Distance_s_p = new box2d.b2Vec2();
    var b2Distance_s_d = new box2d.b2Vec2();
    var b2Distance_s_normal = new box2d.b2Vec2();
    var b2Distance_s_supportA = new box2d.b2Vec2();
    var b2Distance_s_supportB = new box2d.b2Vec2();
    function b2Distance(output, cache, input) {
        ++box2d.b2_gjkCalls;
        var proxyA = input.proxyA;
        var proxyB = input.proxyB;
        var transformA = input.transformA;
        var transformB = input.transformB;
        // Initialize the simplex.
        var simplex = b2Distance_s_simplex;
        simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
        // Get simplex vertices as an array.
        var vertices = simplex.m_vertices;
        var k_maxIters = 20;
        // These store the vertices of the last simplex so that we
        // can check for duplicates and prevent cycling.
        var saveA = b2Distance_s_saveA;
        var saveB = b2Distance_s_saveB;
        var saveCount = 0;
        var distanceSqr1 = box2d.b2_maxFloat;
        var distanceSqr2 = distanceSqr1;
        // Main iteration loop.
        var iter = 0;
        while (iter < k_maxIters) {
            // Copy simplex so we can identify duplicates.
            saveCount = simplex.m_count;
            for (var i = 0; i < saveCount; ++i) {
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
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    break;
            }
            // If we have 3 points, then the origin is in the corresponding triangle.
            if (simplex.m_count === 3) {
                break;
            }
            // Compute closest point.
            var p = simplex.GetClosestPoint(b2Distance_s_p);
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
            var d = simplex.GetSearchDirection(b2Distance_s_d);
            // Ensure the search direction is numerically fit.
            if (d.GetLengthSquared() < box2d.b2_epsilon_sq) {
                // The origin is probably contained by a line segment
                // or triangle. Thus the shapes are overlapped.
                // We can't return zero here even though there may be overlap.
                // In case the simplex is a point, segment, or triangle it is difficult
                // to determine if the origin is contained in the CSO or very close to it.
                break;
            }
            // Compute a tentative new simplex vertex using support points.
            var vertex = vertices[simplex.m_count];
            vertex.indexA = proxyA.GetSupport(box2d.b2MulTRV(transformA.q, box2d.b2NegV(d, box2d.b2Vec2.s_t0), b2Distance_s_supportA));
            box2d.b2MulXV(transformA, proxyA.GetVertex(vertex.indexA), vertex.wA);
            vertex.indexB = proxyB.GetSupport(box2d.b2MulTRV(transformB.q, d, b2Distance_s_supportB));
            box2d.b2MulXV(transformB, proxyB.GetVertex(vertex.indexB), vertex.wB);
            box2d.b2SubVV(vertex.wB, vertex.wA, vertex.w);
            // Iteration count is equated to the number of support point calls.
            ++iter;
            ++box2d.b2_gjkIters;
            // Check for duplicate support points. This is the main termination criteria.
            var duplicate = false;
            for (var i = 0; i < saveCount; ++i) {
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
        box2d.b2_gjkMaxIters = box2d.b2Max(box2d.b2_gjkMaxIters, iter);
        // Prepare output.
        simplex.GetWitnessPoints(output.pointA, output.pointB);
        output.distance = box2d.b2DistanceVV(output.pointA, output.pointB);
        output.iterations = iter;
        // Cache the simplex.
        simplex.WriteCache(cache);
        // Apply radii if requested.
        if (input.useRadii) {
            var rA = proxyA.m_radius;
            var rB = proxyB.m_radius;
            if (output.distance > (rA + rB) && output.distance > box2d.b2_epsilon) {
                // Shapes are still no overlapped.
                // Move the witness points to the outer surface.
                output.distance -= rA + rB;
                var normal = box2d.b2SubVV(output.pointB, output.pointA, b2Distance_s_normal);
                normal.Normalize();
                output.pointA.SelfMulAdd(rA, normal);
                output.pointB.SelfMulSub(rB, normal);
            }
            else {
                // Shapes are overlapped when radii are considered.
                // Move the witness points to the middle.
                var p = box2d.b2MidVV(output.pointA, output.pointB, b2Distance_s_p);
                output.pointA.Copy(p);
                output.pointB.Copy(p);
                output.distance = 0;
            }
        }
    }
    box2d.b2Distance = b2Distance;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2Distance.ts"/>
/// @file
/// Structures and functions used for computing contact points, distance
/// queries, and TOI queries.
var box2d;
(function (box2d) {
    (function (b2ContactFeatureType) {
        b2ContactFeatureType[b2ContactFeatureType["e_vertex"] = 0] = "e_vertex";
        b2ContactFeatureType[b2ContactFeatureType["e_face"] = 1] = "e_face";
    })(box2d.b2ContactFeatureType || (box2d.b2ContactFeatureType = {}));
    var b2ContactFeatureType = box2d.b2ContactFeatureType;
    /// The features that intersect to form the contact point
    /// This must be 4 bytes or less.
    var b2ContactFeature = (function () {
        function b2ContactFeature(id) {
            this._id = null;
            this._indexA = 0;
            this._indexB = 0;
            this._typeA = 0;
            this._typeB = 0;
            this._id = id;
        }
        Object.defineProperty(b2ContactFeature.prototype, "indexA", {
            get: function () {
                return this._indexA;
            },
            set: function (value) {
                this._indexA = value;
                // update the b2ContactID
                this._id._key = (this._id._key & 0xffffff00) | (this._indexA & 0x000000ff);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(b2ContactFeature.prototype, "indexB", {
            get: function () {
                return this._indexB;
            },
            set: function (value) {
                this._indexB = value;
                // update the b2ContactID
                this._id._key = (this._id._key & 0xffff00ff) | ((this._indexB << 8) & 0x0000ff00);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(b2ContactFeature.prototype, "typeA", {
            get: function () {
                return this._typeA;
            },
            set: function (value) {
                this._typeA = value;
                // update the b2ContactID
                this._id._key = (this._id._key & 0xff00ffff) | ((this._typeA << 16) & 0x00ff0000);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(b2ContactFeature.prototype, "typeB", {
            get: function () {
                return this._typeB;
            },
            set: function (value) {
                this._typeB = value;
                // update the b2ContactID
                this._id._key = (this._id._key & 0x00ffffff) | ((this._typeB << 24) & 0xff000000);
            },
            enumerable: true,
            configurable: true
        });
        return b2ContactFeature;
    }());
    box2d.b2ContactFeature = b2ContactFeature;
    /// Contact ids to facilitate warm starting.
    var b2ContactID = (function () {
        function b2ContactID() {
            this.cf = null;
            this._key = 0;
            this.cf = new b2ContactFeature(this);
        }
        b2ContactID.prototype.Copy = function (o) {
            this.key = o.key;
            return this;
        };
        b2ContactID.prototype.Clone = function () {
            return new b2ContactID().Copy(this);
        };
        Object.defineProperty(b2ContactID.prototype, "key", {
            get: function () {
                return this._key;
            },
            set: function (value) {
                this._key = value;
                // update the b2ContactFeature
                this.cf._indexA = this._key & 0x000000ff;
                this.cf._indexB = (this._key >> 8) & 0x000000ff;
                this.cf._typeA = (this._key >> 16) & 0x000000ff;
                this.cf._typeB = (this._key >> 24) & 0x000000ff;
            },
            enumerable: true,
            configurable: true
        });
        return b2ContactID;
    }());
    box2d.b2ContactID = b2ContactID;
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
    var b2ManifoldPoint = (function () {
        function b2ManifoldPoint() {
            this.localPoint = new box2d.b2Vec2(); ///< usage depends on manifold type
            this.normalImpulse = 0; ///< the non-penetration impulse
            this.tangentImpulse = 0; ///< the friction impulse
            this.id = new b2ContactID(); ///< uniquely identifies a contact point between two shapes
        }
        b2ManifoldPoint.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2ManifoldPoint(); });
        };
        b2ManifoldPoint.prototype.Reset = function () {
            this.localPoint.SetZero();
            this.normalImpulse = 0;
            this.tangentImpulse = 0;
            this.id.key = 0;
        };
        b2ManifoldPoint.prototype.Copy = function (o) {
            this.localPoint.Copy(o.localPoint);
            this.normalImpulse = o.normalImpulse;
            this.tangentImpulse = o.tangentImpulse;
            this.id.Copy(o.id);
            return this;
        };
        return b2ManifoldPoint;
    }());
    box2d.b2ManifoldPoint = b2ManifoldPoint;
    (function (b2ManifoldType) {
        b2ManifoldType[b2ManifoldType["e_unknown"] = -1] = "e_unknown";
        b2ManifoldType[b2ManifoldType["e_circles"] = 0] = "e_circles";
        b2ManifoldType[b2ManifoldType["e_faceA"] = 1] = "e_faceA";
        b2ManifoldType[b2ManifoldType["e_faceB"] = 2] = "e_faceB";
    })(box2d.b2ManifoldType || (box2d.b2ManifoldType = {}));
    var b2ManifoldType = box2d.b2ManifoldType;
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
    var b2Manifold = (function () {
        function b2Manifold() {
            this.points = b2ManifoldPoint.MakeArray(box2d.b2_maxManifoldPoints);
            this.localNormal = new box2d.b2Vec2();
            this.localPoint = new box2d.b2Vec2();
            this.type = b2ManifoldType.e_unknown;
            this.pointCount = 0;
        }
        b2Manifold.prototype.Reset = function () {
            for (var i = 0, ict = box2d.b2_maxManifoldPoints; i < ict; ++i) {
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(this.points[i] instanceof b2ManifoldPoint);
                }
                this.points[i].Reset();
            }
            this.localNormal.SetZero();
            this.localPoint.SetZero();
            this.type = b2ManifoldType.e_unknown;
            this.pointCount = 0;
        };
        b2Manifold.prototype.Copy = function (o) {
            this.pointCount = o.pointCount;
            for (var i = 0, ict = box2d.b2_maxManifoldPoints; i < ict; ++i) {
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(this.points[i] instanceof b2ManifoldPoint);
                }
                this.points[i].Copy(o.points[i]);
            }
            this.localNormal.Copy(o.localNormal);
            this.localPoint.Copy(o.localPoint);
            this.type = o.type;
            return this;
        };
        b2Manifold.prototype.Clone = function () {
            return new b2Manifold().Copy(this);
        };
        return b2Manifold;
    }());
    box2d.b2Manifold = b2Manifold;
    var b2WorldManifold = (function () {
        function b2WorldManifold() {
            this.normal = new box2d.b2Vec2();
            this.points = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints);
        }
        b2WorldManifold.prototype.Initialize = function (manifold, xfA, radiusA, xfB, radiusB) {
            if (manifold.pointCount === 0) {
                return;
            }
            switch (manifold.type) {
                case b2ManifoldType.e_circles:
                    {
                        this.normal.SetXY(1, 0);
                        var pointA = box2d.b2MulXV(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_pointA);
                        var pointB = box2d.b2MulXV(xfB, manifold.points[0].localPoint, b2WorldManifold.Initialize_s_pointB);
                        if (box2d.b2DistanceSquaredVV(pointA, pointB) > box2d.b2_epsilon_sq) {
                            box2d.b2SubVV(pointB, pointA, this.normal).SelfNormalize();
                        }
                        var cA = box2d.b2AddVMulSV(pointA, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                        var cB = box2d.b2SubVMulSV(pointB, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                        box2d.b2MidVV(cA, cB, this.points[0]);
                    }
                    break;
                case b2ManifoldType.e_faceA:
                    {
                        box2d.b2MulRV(xfA.q, manifold.localNormal, this.normal);
                        var planePoint = box2d.b2MulXV(xfA, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                        for (var i = 0, ict = manifold.pointCount; i < ict; ++i) {
                            var clipPoint = box2d.b2MulXV(xfB, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                            var s = radiusA - box2d.b2DotVV(box2d.b2SubVV(clipPoint, planePoint, box2d.b2Vec2.s_t0), this.normal);
                            var cA = box2d.b2AddVMulSV(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cA);
                            var cB = box2d.b2SubVMulSV(clipPoint, radiusB, this.normal, b2WorldManifold.Initialize_s_cB);
                            box2d.b2MidVV(cA, cB, this.points[i]);
                        }
                    }
                    break;
                case b2ManifoldType.e_faceB:
                    {
                        box2d.b2MulRV(xfB.q, manifold.localNormal, this.normal);
                        var planePoint = box2d.b2MulXV(xfB, manifold.localPoint, b2WorldManifold.Initialize_s_planePoint);
                        for (var i = 0, ict = manifold.pointCount; i < ict; ++i) {
                            var clipPoint = box2d.b2MulXV(xfA, manifold.points[i].localPoint, b2WorldManifold.Initialize_s_clipPoint);
                            var s = radiusB - box2d.b2DotVV(box2d.b2SubVV(clipPoint, planePoint, box2d.b2Vec2.s_t0), this.normal);
                            var cB = box2d.b2AddVMulSV(clipPoint, s, this.normal, b2WorldManifold.Initialize_s_cB);
                            var cA = box2d.b2SubVMulSV(clipPoint, radiusA, this.normal, b2WorldManifold.Initialize_s_cA);
                            box2d.b2MidVV(cA, cB, this.points[i]);
                        }
                        // Ensure normal points from A to B.
                        this.normal.SelfNeg();
                    }
                    break;
            }
        };
        b2WorldManifold.Initialize_s_pointA = new box2d.b2Vec2();
        b2WorldManifold.Initialize_s_pointB = new box2d.b2Vec2();
        b2WorldManifold.Initialize_s_cA = new box2d.b2Vec2();
        b2WorldManifold.Initialize_s_cB = new box2d.b2Vec2();
        b2WorldManifold.Initialize_s_planePoint = new box2d.b2Vec2();
        b2WorldManifold.Initialize_s_clipPoint = new box2d.b2Vec2();
        return b2WorldManifold;
    }());
    box2d.b2WorldManifold = b2WorldManifold;
    /// This is used for determining the state of contact points.
    (function (b2PointState) {
        b2PointState[b2PointState["b2_nullState"] = 0] = "b2_nullState";
        b2PointState[b2PointState["b2_addState"] = 1] = "b2_addState";
        b2PointState[b2PointState["b2_persistState"] = 2] = "b2_persistState";
        b2PointState[b2PointState["b2_removeState"] = 3] = "b2_removeState"; ///< point was removed in the update
    })(box2d.b2PointState || (box2d.b2PointState = {}));
    var b2PointState = box2d.b2PointState;
    /// Compute the point states given two manifolds. The states pertain to the transition from manifold1
    /// to manifold2. So state1 is either persist or remove while state2 is either add or persist.
    function b2GetPointStates(state1, state2, manifold1, manifold2) {
        var i;
        // Detect persists and removes.
        for (i = 0; i < manifold1.pointCount; ++i) {
            var id = manifold1.points[i].id;
            var key = id.key;
            state1[i] = b2PointState.b2_removeState;
            for (var j = 0, jct = manifold2.pointCount; j < jct; ++j) {
                if (manifold2.points[j].id.key === key) {
                    state1[i] = b2PointState.b2_persistState;
                    break;
                }
            }
        }
        for (var ict = box2d.b2_maxManifoldPoints; i < ict; ++i) {
            state1[i] = b2PointState.b2_nullState;
        }
        // Detect persists and adds.
        for (i = 0; i < manifold2.pointCount; ++i) {
            var id = manifold2.points[i].id;
            var key = id.key;
            state2[i] = b2PointState.b2_addState;
            for (var j = 0, jct = manifold1.pointCount; j < jct; ++j) {
                if (manifold1.points[j].id.key === key) {
                    state2[i] = b2PointState.b2_persistState;
                    break;
                }
            }
        }
        for (var ict = box2d.b2_maxManifoldPoints; i < ict; ++i) {
            state2[i] = b2PointState.b2_nullState;
        }
    }
    box2d.b2GetPointStates = b2GetPointStates;
    /// Used for computing contact manifolds.
    var b2ClipVertex = (function () {
        function b2ClipVertex() {
            this.v = new box2d.b2Vec2();
            this.id = new b2ContactID();
        }
        b2ClipVertex.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2ClipVertex(); });
        };
        b2ClipVertex.prototype.Copy = function (other) {
            this.v.Copy(other.v);
            this.id.Copy(other.id);
            return this;
        };
        return b2ClipVertex;
    }());
    box2d.b2ClipVertex = b2ClipVertex;
    /// Ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
    var b2RayCastInput = (function () {
        function b2RayCastInput() {
            this.p1 = new box2d.b2Vec2();
            this.p2 = new box2d.b2Vec2();
            this.maxFraction = 1;
        }
        b2RayCastInput.prototype.Copy = function (o) {
            this.p1.Copy(o.p1);
            this.p2.Copy(o.p2);
            this.maxFraction = o.maxFraction;
            return this;
        };
        return b2RayCastInput;
    }());
    box2d.b2RayCastInput = b2RayCastInput;
    /// Ray-cast output data. The ray hits at p1 + fraction * (p2 - p1), where p1 and p2
    /// come from b2RayCastInput.
    var b2RayCastOutput = (function () {
        function b2RayCastOutput() {
            this.normal = new box2d.b2Vec2();
            this.fraction = 0;
        }
        b2RayCastOutput.prototype.Copy = function (o) {
            this.normal.Copy(o.normal);
            this.fraction = o.fraction;
            return this;
        };
        return b2RayCastOutput;
    }());
    box2d.b2RayCastOutput = b2RayCastOutput;
    /// An axis aligned bounding box.
    var b2AABB = (function () {
        function b2AABB() {
            this.lowerBound = new box2d.b2Vec2(); ///< the lower vertex
            this.upperBound = new box2d.b2Vec2(); ///< the upper vertex
            this.m_cache_center = new box2d.b2Vec2(); // access using GetCenter()
            this.m_cache_extent = new box2d.b2Vec2(); // access using GetExtents()
        }
        b2AABB.prototype.Copy = function (o) {
            this.lowerBound.Copy(o.lowerBound);
            this.upperBound.Copy(o.upperBound);
            return this;
        };
        /// Verify that the bounds are sorted.
        b2AABB.prototype.IsValid = function () {
            var d_x = this.upperBound.x - this.lowerBound.x;
            var d_y = this.upperBound.y - this.lowerBound.y;
            var valid = d_x >= 0 && d_y >= 0;
            valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
            return valid;
        };
        /// Get the center of the AABB.
        b2AABB.prototype.GetCenter = function () {
            return box2d.b2MidVV(this.lowerBound, this.upperBound, this.m_cache_center);
        };
        /// Get the extents of the AABB (half-widths).
        b2AABB.prototype.GetExtents = function () {
            return box2d.b2ExtVV(this.lowerBound, this.upperBound, this.m_cache_extent);
        };
        /// Get the perimeter length
        b2AABB.prototype.GetPerimeter = function () {
            var wx = this.upperBound.x - this.lowerBound.x;
            var wy = this.upperBound.y - this.lowerBound.y;
            return 2 * (wx + wy);
        };
        /// Combine an AABB into this one.
        b2AABB.prototype.Combine1 = function (aabb) {
            this.lowerBound.x = box2d.b2Min(this.lowerBound.x, aabb.lowerBound.x);
            this.lowerBound.y = box2d.b2Min(this.lowerBound.y, aabb.lowerBound.y);
            this.upperBound.x = box2d.b2Max(this.upperBound.x, aabb.upperBound.x);
            this.upperBound.y = box2d.b2Max(this.upperBound.y, aabb.upperBound.y);
            return this;
        };
        /// Combine two AABBs into this one.
        b2AABB.prototype.Combine2 = function (aabb1, aabb2) {
            this.lowerBound.x = box2d.b2Min(aabb1.lowerBound.x, aabb2.lowerBound.x);
            this.lowerBound.y = box2d.b2Min(aabb1.lowerBound.y, aabb2.lowerBound.y);
            this.upperBound.x = box2d.b2Max(aabb1.upperBound.x, aabb2.upperBound.x);
            this.upperBound.y = box2d.b2Max(aabb1.upperBound.y, aabb2.upperBound.y);
            return this;
        };
        b2AABB.Combine = function (aabb1, aabb2, out) {
            out.Combine2(aabb1, aabb2);
            return out;
        };
        /// Does this aabb contain the provided AABB.
        b2AABB.prototype.Contains = function (aabb) {
            var result = true;
            result = result && this.lowerBound.x <= aabb.lowerBound.x;
            result = result && this.lowerBound.y <= aabb.lowerBound.y;
            result = result && aabb.upperBound.x <= this.upperBound.x;
            result = result && aabb.upperBound.y <= this.upperBound.y;
            return result;
        };
        // From Real-time Collision Detection, p179.
        b2AABB.prototype.RayCast = function (output, input) {
            var tmin = (-box2d.b2_maxFloat);
            var tmax = box2d.b2_maxFloat;
            var p_x = input.p1.x;
            var p_y = input.p1.y;
            var d_x = input.p2.x - input.p1.x;
            var d_y = input.p2.y - input.p1.y;
            var absD_x = box2d.b2Abs(d_x);
            var absD_y = box2d.b2Abs(d_y);
            var normal = output.normal;
            if (absD_x < box2d.b2_epsilon) {
                // Parallel.
                if (p_x < this.lowerBound.x || this.upperBound.x < p_x) {
                    return false;
                }
            }
            else {
                var inv_d = 1 / d_x;
                var t1 = (this.lowerBound.x - p_x) * inv_d;
                var t2 = (this.upperBound.x - p_x) * inv_d;
                // Sign of the normal vector.
                var s = (-1);
                if (t1 > t2) {
                    var t3 = t1;
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
                tmax = box2d.b2Min(tmax, t2);
                if (tmin > tmax) {
                    return false;
                }
            }
            if (absD_y < box2d.b2_epsilon) {
                // Parallel.
                if (p_y < this.lowerBound.y || this.upperBound.y < p_y) {
                    return false;
                }
            }
            else {
                var inv_d = 1 / d_y;
                var t1 = (this.lowerBound.y - p_y) * inv_d;
                var t2 = (this.upperBound.y - p_y) * inv_d;
                // Sign of the normal vector.
                var s = (-1);
                if (t1 > t2) {
                    var t3 = t1;
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
                tmax = box2d.b2Min(tmax, t2);
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
        };
        b2AABB.prototype.TestOverlap = function (other) {
            var d1_x = other.lowerBound.x - this.upperBound.x;
            var d1_y = other.lowerBound.y - this.upperBound.y;
            var d2_x = this.lowerBound.x - other.upperBound.x;
            var d2_y = this.lowerBound.y - other.upperBound.y;
            if (d1_x > 0 || d1_y > 0)
                return false;
            if (d2_x > 0 || d2_y > 0)
                return false;
            return true;
        };
        return b2AABB;
    }());
    box2d.b2AABB = b2AABB;
    function b2TestOverlapAABB(a, b) {
        var d1_x = b.lowerBound.x - a.upperBound.x;
        var d1_y = b.lowerBound.y - a.upperBound.y;
        var d2_x = a.lowerBound.x - b.upperBound.x;
        var d2_y = a.lowerBound.y - b.upperBound.y;
        if (d1_x > 0 || d1_y > 0)
            return false;
        if (d2_x > 0 || d2_y > 0)
            return false;
        return true;
    }
    box2d.b2TestOverlapAABB = b2TestOverlapAABB;
    /// Clipping for contact manifolds.
    function b2ClipSegmentToLine(vOut, vIn, normal, offset, vertexIndexA) {
        // Start with no output points
        var numOut = 0;
        var vIn0 = vIn[0];
        var vIn1 = vIn[1];
        // Calculate the distance of end points to the line
        var distance0 = box2d.b2DotVV(normal, vIn0.v) - offset;
        var distance1 = box2d.b2DotVV(normal, vIn1.v) - offset;
        // If the points are behind the plane
        if (distance0 <= 0)
            vOut[numOut++].Copy(vIn0);
        if (distance1 <= 0)
            vOut[numOut++].Copy(vIn1);
        // If the points are on different sides of the plane
        if (distance0 * distance1 < 0) {
            // Find intersection point of edge and plane
            var interp = distance0 / (distance0 - distance1);
            var v = vOut[numOut].v;
            v.x = vIn0.v.x + interp * (vIn1.v.x - vIn0.v.x);
            v.y = vIn0.v.y + interp * (vIn1.v.y - vIn0.v.y);
            // VertexA is hitting edgeB.
            var id = vOut[numOut].id;
            id.cf.indexA = vertexIndexA;
            id.cf.indexB = vIn0.id.cf.indexB;
            id.cf.typeA = b2ContactFeatureType.e_vertex;
            id.cf.typeB = b2ContactFeatureType.e_face;
            ++numOut;
        }
        return numOut;
    }
    box2d.b2ClipSegmentToLine = b2ClipSegmentToLine;
    /// Determine if two generic shapes overlap.
    var b2TestOverlapShape_s_input = new box2d.b2DistanceInput();
    var b2TestOverlapShape_s_simplexCache = new box2d.b2SimplexCache();
    var b2TestOverlapShape_s_output = new box2d.b2DistanceOutput();
    function b2TestOverlapShape(shapeA, indexA, shapeB, indexB, xfA, xfB) {
        var input = b2TestOverlapShape_s_input.Reset();
        input.proxyA.SetShape(shapeA, indexA);
        input.proxyB.SetShape(shapeB, indexB);
        input.transformA.Copy(xfA);
        input.transformB.Copy(xfB);
        input.useRadii = true;
        var simplexCache = b2TestOverlapShape_s_simplexCache.Reset();
        simplexCache.count = 0;
        var output = b2TestOverlapShape_s_output.Reset();
        box2d.b2Distance(output, simplexCache, input);
        return output.distance < 10 * box2d.b2_epsilon;
    }
    box2d.b2TestOverlapShape = b2TestOverlapShape;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/b2Collision.ts"/>
var box2d;
(function (box2d) {
    /// This holds the mass data computed for a shape.
    var b2MassData = (function () {
        function b2MassData() {
            /// The mass of the shape, usually in kilograms.
            this.mass = 0;
            /// The position of the shape's centroid relative to the shape's origin.
            this.center = new box2d.b2Vec2(0, 0);
            /// The rotational inertia of the shape about the local origin.
            this.I = 0;
        }
        return b2MassData;
    }());
    box2d.b2MassData = b2MassData;
    (function (b2ShapeType) {
        b2ShapeType[b2ShapeType["e_unknown"] = -1] = "e_unknown";
        b2ShapeType[b2ShapeType["e_circleShape"] = 0] = "e_circleShape";
        b2ShapeType[b2ShapeType["e_edgeShape"] = 1] = "e_edgeShape";
        b2ShapeType[b2ShapeType["e_polygonShape"] = 2] = "e_polygonShape";
        b2ShapeType[b2ShapeType["e_chainShape"] = 3] = "e_chainShape";
        b2ShapeType[b2ShapeType["e_shapeTypeCount"] = 4] = "e_shapeTypeCount";
    })(box2d.b2ShapeType || (box2d.b2ShapeType = {}));
    var b2ShapeType = box2d.b2ShapeType;
    /// A shape is used for collision detection. You can create a shape however you like.
    /// Shapes used for simulation in b2World are created automatically when a b2Fixture
    /// is created. Shapes may encapsulate a one or more child shapes.
    var b2Shape = (function () {
        function b2Shape(type, radius) {
            this.m_type = b2ShapeType.e_unknown;
            this.m_radius = 0;
            this.m_type = type;
            this.m_radius = radius;
        }
        /// Clone the concrete shape using the provided allocator.
        b2Shape.prototype.Clone = function () {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false);
            }
            return null;
        };
        b2Shape.prototype.Copy = function (other) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_type === other.m_type);
            }
            this.m_radius = other.m_radius;
            return this;
        };
        /// Get the type of this shape. You can use this to down cast to the concrete shape.
        /// @return the shape type.
        b2Shape.prototype.GetType = function () {
            return this.m_type;
        };
        /// Get the number of child primitives.
        b2Shape.prototype.GetChildCount = function () {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false, "pure virtual");
            }
            return 0;
        };
        /// Test a point for containment in this shape. This only works for convex shapes.
        /// @param xf the shape world transform.
        /// @param p a point in world coordinates.
        b2Shape.prototype.TestPoint = function (xf, p) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false, "pure virtual");
            }
            return false;
        };
        /// Cast a ray against a child shape.
        /// @param output the ray-cast results.
        /// @param input the ray-cast input parameters.
        /// @param transform the transform to be applied to the shape.
        /// @param childIndex the child shape index
        b2Shape.prototype.RayCast = function (output, input, transform, childIndex) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false, "pure virtual");
            }
            return false;
        };
        /// Given a transform, compute the associated axis aligned bounding box for a child shape.
        /// @param aabb returns the axis aligned box.
        /// @param xf the world transform of the shape.
        /// @param childIndex the child shape
        b2Shape.prototype.ComputeAABB = function (aabb, xf, childIndex) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false, "pure virtual");
            }
        };
        /// Compute the mass properties of this shape using its dimensions and density.
        /// The inertia tensor is computed about the local origin.
        /// @param massData returns the mass data for this shape.
        /// @param density the density in kilograms per meter squared.
        b2Shape.prototype.ComputeMass = function (massData, density) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false, "pure virtual");
            }
        };
        b2Shape.prototype.SetupDistanceProxy = function (proxy, index) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false, "pure virtual");
            }
        };
        b2Shape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false, "pure virtual");
            }
            c.SetZero();
            return 0;
        };
        b2Shape.prototype.Dump = function () {
        };
        return b2Shape;
    }());
    box2d.b2Shape = b2Shape;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
var box2d;
(function (box2d) {
    /// A circle shape.
    var b2CircleShape = (function (_super) {
        __extends(b2CircleShape, _super);
        function b2CircleShape(radius) {
            if (radius === void 0) { radius = 0; }
            _super.call(this, box2d.b2ShapeType.e_circleShape, radius);
            this.m_p = new box2d.b2Vec2();
        }
        /// Implement b2Shape.
        b2CircleShape.prototype.Clone = function () {
            return new b2CircleShape().Copy(this);
        };
        b2CircleShape.prototype.Copy = function (other) {
            _super.prototype.Copy.call(this, other);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(other instanceof b2CircleShape);
            }
            this.m_p.Copy(other.m_p);
            return this;
        };
        /// @see b2Shape::GetChildCount
        b2CircleShape.prototype.GetChildCount = function () {
            return 1;
        };
        b2CircleShape.prototype.TestPoint = function (transform, p) {
            var center = box2d.b2MulXV(transform, this.m_p, b2CircleShape.TestPoint_s_center);
            var d = box2d.b2SubVV(p, center, b2CircleShape.TestPoint_s_d);
            return box2d.b2DotVV(d, d) <= box2d.b2Sq(this.m_radius);
        };
        b2CircleShape.prototype.RayCast = function (output, input, transform, childIndex) {
            var position = box2d.b2MulXV(transform, this.m_p, b2CircleShape.RayCast_s_position);
            var s = box2d.b2SubVV(input.p1, position, b2CircleShape.RayCast_s_s);
            var b = box2d.b2DotVV(s, s) - box2d.b2Sq(this.m_radius);
            // Solve quadratic equation.
            var r = box2d.b2SubVV(input.p2, input.p1, b2CircleShape.RayCast_s_r);
            var c = box2d.b2DotVV(s, r);
            var rr = box2d.b2DotVV(r, r);
            var sigma = c * c - rr * b;
            // Check for negative discriminant and short segment.
            if (sigma < 0 || rr < box2d.b2_epsilon) {
                return false;
            }
            // Find the point of intersection of the line with the circle.
            var a = (-(c + box2d.b2Sqrt(sigma)));
            // Is the intersection point on the segment?
            if (0 <= a && a <= input.maxFraction * rr) {
                a /= rr;
                output.fraction = a;
                box2d.b2AddVMulSV(s, a, r, output.normal).SelfNormalize();
                return true;
            }
            return false;
        };
        b2CircleShape.prototype.ComputeAABB = function (aabb, transform, childIndex) {
            var p = box2d.b2MulXV(transform, this.m_p, b2CircleShape.ComputeAABB_s_p);
            aabb.lowerBound.SetXY(p.x - this.m_radius, p.y - this.m_radius);
            aabb.upperBound.SetXY(p.x + this.m_radius, p.y + this.m_radius);
        };
        /// @see b2Shape::ComputeMass
        b2CircleShape.prototype.ComputeMass = function (massData, density) {
            var radius_sq = box2d.b2Sq(this.m_radius);
            massData.mass = density * box2d.b2_pi * radius_sq;
            massData.center.Copy(this.m_p);
            // inertia about the local origin
            massData.I = massData.mass * (0.5 * radius_sq + box2d.b2DotVV(this.m_p, this.m_p));
        };
        b2CircleShape.prototype.SetupDistanceProxy = function (proxy, index) {
            proxy.m_vertices = [];
            proxy.m_vertices[0] = this.m_p;
            proxy.m_count = 1;
            proxy.m_radius = this.m_radius;
        };
        b2CircleShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
            var p = box2d.b2MulXV(xf, this.m_p, new box2d.b2Vec2());
            var l = (-(box2d.b2DotVV(normal, p) - offset));
            if (l < (-this.m_radius) + box2d.b2_epsilon) {
                // Completely dry
                return 0;
            }
            if (l > this.m_radius) {
                // Completely wet
                c.Copy(p);
                return box2d.b2_pi * this.m_radius * this.m_radius;
            }
            // Magic
            var r2 = this.m_radius * this.m_radius;
            var l2 = l * l;
            var area = r2 * (box2d.b2Asin(l / this.m_radius) + box2d.b2_pi / 2) + l * box2d.b2Sqrt(r2 - l2);
            var com = (-2 / 3 * box2d.b2Pow(r2 - l2, 1.5) / area);
            c.x = p.x + normal.x * com;
            c.y = p.y + normal.y * com;
            return area;
        };
        b2CircleShape.prototype.Dump = function () {
            box2d.b2Log("    const shape: b2CircleShape = new b2CircleShape();\n");
            box2d.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
            box2d.b2Log("    shape.m_p.SetXY(%.15f, %.15f);\n", this.m_p.x, this.m_p.y);
        };
        /// Implement b2Shape.
        b2CircleShape.TestPoint_s_center = new box2d.b2Vec2();
        b2CircleShape.TestPoint_s_d = new box2d.b2Vec2();
        /// Implement b2Shape.
        // Collision Detection in Interactive 3D Environments by Gino van den Bergen
        // From Section 3.1.2
        // x = s + a * r
        // norm(x) = radius
        b2CircleShape.RayCast_s_position = new box2d.b2Vec2();
        b2CircleShape.RayCast_s_s = new box2d.b2Vec2();
        b2CircleShape.RayCast_s_r = new box2d.b2Vec2();
        /// @see b2Shape::ComputeAABB
        b2CircleShape.ComputeAABB_s_p = new box2d.b2Vec2();
        return b2CircleShape;
    }(box2d.b2Shape));
    box2d.b2CircleShape = b2CircleShape;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
var box2d;
(function (box2d) {
    /// A line segment (edge) shape. These can be connected in chains or loops
    /// to other edge shapes. The connectivity information is used to ensure
    /// correct contact normals.
    var b2EdgeShape = (function (_super) {
        __extends(b2EdgeShape, _super);
        function b2EdgeShape() {
            _super.call(this, box2d.b2ShapeType.e_edgeShape, box2d.b2_polygonRadius);
            this.m_vertex1 = new box2d.b2Vec2();
            this.m_vertex2 = new box2d.b2Vec2();
            this.m_vertex0 = new box2d.b2Vec2();
            this.m_vertex3 = new box2d.b2Vec2();
            this.m_hasVertex0 = false;
            this.m_hasVertex3 = false;
        }
        /// Set this as an isolated edge.
        b2EdgeShape.prototype.SetAsEdge = function (v1, v2) {
            this.m_vertex1.Copy(v1);
            this.m_vertex2.Copy(v2);
            this.m_hasVertex0 = false;
            this.m_hasVertex3 = false;
            return this;
        };
        /// Implement b2Shape.
        b2EdgeShape.prototype.Clone = function () {
            return new b2EdgeShape().Copy(this);
        };
        b2EdgeShape.prototype.Copy = function (other) {
            _super.prototype.Copy.call(this, other);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(other instanceof b2EdgeShape);
            }
            this.m_vertex1.Copy(other.m_vertex1);
            this.m_vertex2.Copy(other.m_vertex2);
            this.m_vertex0.Copy(other.m_vertex0);
            this.m_vertex3.Copy(other.m_vertex3);
            this.m_hasVertex0 = other.m_hasVertex0;
            this.m_hasVertex3 = other.m_hasVertex3;
            return this;
        };
        /// @see b2Shape::GetChildCount
        b2EdgeShape.prototype.GetChildCount = function () {
            return 1;
        };
        /// @see b2Shape::TestPoint
        b2EdgeShape.prototype.TestPoint = function (xf, p) {
            return false;
        };
        b2EdgeShape.prototype.RayCast = function (output, input, xf, childIndex) {
            // Put the ray into the edge's frame of reference.
            var p1 = box2d.b2MulTXV(xf, input.p1, b2EdgeShape.RayCast_s_p1);
            var p2 = box2d.b2MulTXV(xf, input.p2, b2EdgeShape.RayCast_s_p2);
            var d = box2d.b2SubVV(p2, p1, b2EdgeShape.RayCast_s_d);
            var v1 = this.m_vertex1;
            var v2 = this.m_vertex2;
            var e = box2d.b2SubVV(v2, v1, b2EdgeShape.RayCast_s_e);
            var normal = output.normal.SetXY(e.y, -e.x).SelfNormalize();
            // q = p1 + t * d
            // dot(normal, q - v1) = 0
            // dot(normal, p1 - v1) + t * dot(normal, d) = 0
            var numerator = box2d.b2DotVV(normal, box2d.b2SubVV(v1, p1, box2d.b2Vec2.s_t0));
            var denominator = box2d.b2DotVV(normal, d);
            if (denominator === 0) {
                return false;
            }
            var t = numerator / denominator;
            if (t < 0 || input.maxFraction < t) {
                return false;
            }
            var q = box2d.b2AddVMulSV(p1, t, d, b2EdgeShape.RayCast_s_q);
            // q = v1 + s * r
            // s = dot(q - v1, r) / dot(r, r)
            var r = box2d.b2SubVV(v2, v1, b2EdgeShape.RayCast_s_r);
            var rr = box2d.b2DotVV(r, r);
            if (rr === 0) {
                return false;
            }
            var s = box2d.b2DotVV(box2d.b2SubVV(q, v1, box2d.b2Vec2.s_t0), r) / rr;
            if (s < 0 || 1 < s) {
                return false;
            }
            output.fraction = t;
            if (numerator > 0) {
                output.normal.SelfNeg();
            }
            return true;
        };
        b2EdgeShape.prototype.ComputeAABB = function (aabb, xf, childIndex) {
            var v1 = box2d.b2MulXV(xf, this.m_vertex1, b2EdgeShape.ComputeAABB_s_v1);
            var v2 = box2d.b2MulXV(xf, this.m_vertex2, b2EdgeShape.ComputeAABB_s_v2);
            box2d.b2MinV(v1, v2, aabb.lowerBound);
            box2d.b2MaxV(v1, v2, aabb.upperBound);
            var r = this.m_radius;
            aabb.lowerBound.SelfSubXY(r, r);
            aabb.upperBound.SelfAddXY(r, r);
        };
        /// @see b2Shape::ComputeMass
        b2EdgeShape.prototype.ComputeMass = function (massData, density) {
            massData.mass = 0;
            box2d.b2MidVV(this.m_vertex1, this.m_vertex2, massData.center);
            massData.I = 0;
        };
        b2EdgeShape.prototype.SetupDistanceProxy = function (proxy, index) {
            proxy.m_vertices = new Array(2);
            proxy.m_vertices[0] = this.m_vertex1;
            proxy.m_vertices[1] = this.m_vertex2;
            proxy.m_count = 2;
            proxy.m_radius = this.m_radius;
        };
        b2EdgeShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
            c.SetZero();
            return 0;
        };
        b2EdgeShape.prototype.Dump = function () {
            box2d.b2Log("    const shape: b2EdgeShape = new b2EdgeShape();\n");
            box2d.b2Log("    shape.m_radius = %.15f;\n", this.m_radius);
            box2d.b2Log("    shape.m_vertex0.SetXY(%.15f, %.15f);\n", this.m_vertex0.x, this.m_vertex0.y);
            box2d.b2Log("    shape.m_vertex1.SetXY(%.15f, %.15f);\n", this.m_vertex1.x, this.m_vertex1.y);
            box2d.b2Log("    shape.m_vertex2.SetXY(%.15f, %.15f);\n", this.m_vertex2.x, this.m_vertex2.y);
            box2d.b2Log("    shape.m_vertex3.SetXY(%.15f, %.15f);\n", this.m_vertex3.x, this.m_vertex3.y);
            box2d.b2Log("    shape.m_hasVertex0 = %s;\n", this.m_hasVertex0);
            box2d.b2Log("    shape.m_hasVertex3 = %s;\n", this.m_hasVertex3);
        };
        /// Implement b2Shape.
        // p = p1 + t * d
        // v = v1 + s * e
        // p1 + t * d = v1 + s * e
        // s * e - t * d = p1 - v1
        b2EdgeShape.RayCast_s_p1 = new box2d.b2Vec2();
        b2EdgeShape.RayCast_s_p2 = new box2d.b2Vec2();
        b2EdgeShape.RayCast_s_d = new box2d.b2Vec2();
        b2EdgeShape.RayCast_s_e = new box2d.b2Vec2();
        b2EdgeShape.RayCast_s_q = new box2d.b2Vec2();
        b2EdgeShape.RayCast_s_r = new box2d.b2Vec2();
        /// @see b2Shape::ComputeAABB
        b2EdgeShape.ComputeAABB_s_v1 = new box2d.b2Vec2();
        b2EdgeShape.ComputeAABB_s_v2 = new box2d.b2Vec2();
        return b2EdgeShape;
    }(box2d.b2Shape));
    box2d.b2EdgeShape = b2EdgeShape;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
var box2d;
(function (box2d) {
    /// A chain shape is a free form sequence of line segments.
    /// The chain has two-sided collision, so you can use inside and outside collision.
    /// Therefore, you may use any winding order.
    /// Since there may be many vertices, they are allocated using b2Alloc.
    /// Connectivity information is used to create smooth collisions.
    /// WARNING: The chain will not collide properly if there are self-intersections.
    var b2ChainShape = (function (_super) {
        __extends(b2ChainShape, _super);
        function b2ChainShape() {
            _super.call(this, box2d.b2ShapeType.e_chainShape, box2d.b2_polygonRadius);
            this.m_vertices = null;
            this.m_count = 0;
            this.m_prevVertex = new box2d.b2Vec2();
            this.m_nextVertex = new box2d.b2Vec2();
            this.m_hasPrevVertex = false;
            this.m_hasNextVertex = false;
        }
        /// Create a loop. This automatically adjusts connectivity.
        /// @param vertices an array of vertices, these are copied
        /// @param count the vertex count
        b2ChainShape.prototype.CreateLoop = function (vertices, count) {
            if (count === void 0) { count = vertices.length; }
            count = count || vertices.length;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_vertices == null && this.m_count === 0);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(count >= 3);
            }
            if (box2d.ENABLE_ASSERTS) {
                for (var i = 1; i < count; ++i) {
                    var v1 = vertices[i - 1];
                    var v2 = vertices[i];
                    // If the code crashes here, it means your vertices are too close together.
                    box2d.b2Assert(box2d.b2DistanceSquaredVV(v1, v2) > box2d.b2_linearSlop * box2d.b2_linearSlop);
                }
            }
            this.m_count = count + 1;
            this.m_vertices = box2d.b2Vec2.MakeArray(this.m_count);
            for (var i = 0; i < count; ++i) {
                this.m_vertices[i].Copy(vertices[i]);
            }
            this.m_vertices[count].Copy(this.m_vertices[0]);
            this.m_prevVertex.Copy(this.m_vertices[this.m_count - 2]);
            this.m_nextVertex.Copy(this.m_vertices[1]);
            this.m_hasPrevVertex = true;
            this.m_hasNextVertex = true;
            return this;
        };
        /// Create a chain with isolated end vertices.
        /// @param vertices an array of vertices, these are copied
        /// @param count the vertex count
        b2ChainShape.prototype.CreateChain = function (vertices, count) {
            if (count === void 0) { count = vertices.length; }
            count = count || vertices.length;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_vertices == null && this.m_count === 0);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(count >= 2);
            }
            if (box2d.ENABLE_ASSERTS) {
                for (var i = 1; i < count; ++i) {
                    var v1 = vertices[i - 1];
                    var v2 = vertices[i];
                    // If the code crashes here, it means your vertices are too close together.
                    box2d.b2Assert(box2d.b2DistanceSquaredVV(v1, v2) > box2d.b2_linearSlop * box2d.b2_linearSlop);
                }
            }
            this.m_count = count;
            this.m_vertices = box2d.b2Vec2.MakeArray(count);
            for (var i = 0; i < count; ++i) {
                this.m_vertices[i].Copy(vertices[i]);
            }
            this.m_hasPrevVertex = false;
            this.m_hasNextVertex = false;
            return this;
        };
        /// Establish connectivity to a vertex that precedes the first vertex.
        /// Don't call this for loops.
        b2ChainShape.prototype.SetPrevVertex = function (prevVertex) {
            this.m_prevVertex.Copy(prevVertex);
            this.m_hasPrevVertex = true;
            return this;
        };
        /// Establish connectivity to a vertex that follows the last vertex.
        /// Don't call this for loops.
        b2ChainShape.prototype.SetNextVertex = function (nextVertex) {
            this.m_nextVertex.Copy(nextVertex);
            this.m_hasNextVertex = true;
            return this;
        };
        /// Implement b2Shape. Vertices are cloned using b2Alloc.
        b2ChainShape.prototype.Clone = function () {
            return new b2ChainShape().Copy(this);
        };
        b2ChainShape.prototype.Copy = function (other) {
            _super.prototype.Copy.call(this, other);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(other instanceof b2ChainShape);
            }
            this.CreateChain(other.m_vertices, other.m_count);
            this.m_prevVertex.Copy(other.m_prevVertex);
            this.m_nextVertex.Copy(other.m_nextVertex);
            this.m_hasPrevVertex = other.m_hasPrevVertex;
            this.m_hasNextVertex = other.m_hasNextVertex;
            return this;
        };
        /// @see b2Shape::GetChildCount
        b2ChainShape.prototype.GetChildCount = function () {
            // edge count = vertex count - 1
            return this.m_count - 1;
        };
        /// Get a child edge.
        b2ChainShape.prototype.GetChildEdge = function (edge, index) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= index && index < this.m_count - 1);
            }
            edge.m_type = box2d.b2ShapeType.e_edgeShape;
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
        };
        /// This always return false.
        /// @see b2Shape::TestPoint
        b2ChainShape.prototype.TestPoint = function (xf, p) {
            return false;
        };
        b2ChainShape.prototype.RayCast = function (output, input, xf, childIndex) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(childIndex < this.m_count);
            }
            var edgeShape = b2ChainShape.RayCast_s_edgeShape;
            edgeShape.m_vertex1.Copy(this.m_vertices[childIndex]);
            edgeShape.m_vertex2.Copy(this.m_vertices[(childIndex + 1) % this.m_count]);
            return edgeShape.RayCast(output, input, xf, 0);
        };
        b2ChainShape.prototype.ComputeAABB = function (aabb, xf, childIndex) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(childIndex < this.m_count);
            }
            var vertexi1 = this.m_vertices[childIndex];
            var vertexi2 = this.m_vertices[(childIndex + 1) % this.m_count];
            var v1 = box2d.b2MulXV(xf, vertexi1, b2ChainShape.ComputeAABB_s_v1);
            var v2 = box2d.b2MulXV(xf, vertexi2, b2ChainShape.ComputeAABB_s_v2);
            box2d.b2MinV(v1, v2, aabb.lowerBound);
            box2d.b2MaxV(v1, v2, aabb.upperBound);
        };
        /// Chains have zero mass.
        /// @see b2Shape::ComputeMass
        b2ChainShape.prototype.ComputeMass = function (massData, density) {
            massData.mass = 0;
            massData.center.SetZero();
            massData.I = 0;
        };
        b2ChainShape.prototype.SetupDistanceProxy = function (proxy, index) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= index && index < this.m_count);
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
        };
        b2ChainShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
            c.SetZero();
            return 0;
        };
        b2ChainShape.prototype.Dump = function () {
            box2d.b2Log("    const shape: b2ChainShape = new b2ChainShape();\n");
            box2d.b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", box2d.b2_maxPolygonVertices);
            for (var i = 0; i < this.m_count; ++i) {
                box2d.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
            }
            box2d.b2Log("    shape.CreateChain(vs, %d);\n", this.m_count);
            box2d.b2Log("    shape.m_prevVertex.SetXY(%.15f, %.15f);\n", this.m_prevVertex.x, this.m_prevVertex.y);
            box2d.b2Log("    shape.m_nextVertex.SetXY(%.15f, %.15f);\n", this.m_nextVertex.x, this.m_nextVertex.y);
            box2d.b2Log("    shape.m_hasPrevVertex = %s;\n", (this.m_hasPrevVertex) ? ("true") : ("false"));
            box2d.b2Log("    shape.m_hasNextVertex = %s;\n", (this.m_hasNextVertex) ? ("true") : ("false"));
        };
        /// Implement b2Shape.
        b2ChainShape.RayCast_s_edgeShape = new box2d.b2EdgeShape();
        /// @see b2Shape::ComputeAABB
        b2ChainShape.ComputeAABB_s_v1 = new box2d.b2Vec2();
        b2ChainShape.ComputeAABB_s_v2 = new box2d.b2Vec2();
        return b2ChainShape;
    }(box2d.b2Shape));
    box2d.b2ChainShape = b2ChainShape;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
var box2d;
(function (box2d) {
    /// A convex polygon. It is assumed that the interior of the polygon is to
    /// the left of each edge.
    /// Polygons have a maximum number of vertices equal to b2_maxPolygonVertices.
    /// In most cases you should not need many vertices for a convex polygon.
    var b2PolygonShape = (function (_super) {
        __extends(b2PolygonShape, _super);
        function b2PolygonShape() {
            _super.call(this, box2d.b2ShapeType.e_polygonShape, box2d.b2_polygonRadius);
            this.m_centroid = new box2d.b2Vec2(0, 0);
            this.m_vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
            this.m_normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
            this.m_count = 0;
        }
        /// Implement b2Shape.
        b2PolygonShape.prototype.Clone = function () {
            return new b2PolygonShape().Copy(this);
        };
        b2PolygonShape.prototype.Copy = function (other) {
            _super.prototype.Copy.call(this, other);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(other instanceof b2PolygonShape);
            }
            this.m_centroid.Copy(other.m_centroid);
            this.m_count = other.m_count;
            for (var i = 0, ict = this.m_count; i < ict; ++i) {
                this.m_vertices[i].Copy(other.m_vertices[i]);
                this.m_normals[i].Copy(other.m_normals[i]);
            }
            return this;
        };
        /// @see b2Shape::GetChildCount
        b2PolygonShape.prototype.GetChildCount = function () {
            return 1;
        };
        b2PolygonShape.prototype.SetAsVector = function (vertices, count) {
            if (count === undefined)
                count = vertices.length;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(3 <= count && count <= box2d.b2_maxPolygonVertices);
            }
            if (count < 3) {
                return this.SetAsBox(1, 1);
            }
            var n = box2d.b2Min(count, box2d.b2_maxPolygonVertices);
            // Copy vertices into local buffer
            var ps = b2PolygonShape.SetAsVector_s_ps;
            for (var i = 0; i < n; ++i) {
                ps[i].Copy(vertices[i]);
            }
            // Create the convex hull using the Gift wrapping algorithm
            // http://en.wikipedia.org/wiki/Gift_wrapping_algorithm
            // Find the right most point on the hull
            var i0 = 0;
            var x0 = ps[0].x;
            for (var i = 1; i < count; ++i) {
                var x = ps[i].x;
                if (x > x0 || (x === x0 && ps[i].y < ps[i0].y)) {
                    i0 = i;
                    x0 = x;
                }
            }
            var hull = b2PolygonShape.SetAsVector_s_hull;
            var m = 0;
            var ih = i0;
            for (;;) {
                hull[m] = ih;
                var ie = 0;
                for (var j = 1; j < n; ++j) {
                    if (ie === ih) {
                        ie = j;
                        continue;
                    }
                    var r = box2d.b2SubVV(ps[ie], ps[hull[m]], b2PolygonShape.SetAsVector_s_r);
                    var v = box2d.b2SubVV(ps[j], ps[hull[m]], b2PolygonShape.SetAsVector_s_v);
                    var c = box2d.b2CrossVV(r, v);
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
            for (var i = 0; i < m; ++i) {
                this.m_vertices[i].Copy(ps[hull[i]]);
            }
            // Compute normals. Ensure the edges have non-zero length.
            for (var i = 0, ict = m; i < ict; ++i) {
                var vertexi1 = this.m_vertices[i];
                var vertexi2 = this.m_vertices[(i + 1) % ict];
                var edge = box2d.b2SubVV(vertexi2, vertexi1, box2d.b2Vec2.s_t0); // edge uses s_t0
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(edge.GetLengthSquared() > box2d.b2_epsilon_sq);
                }
                box2d.b2CrossVOne(edge, this.m_normals[i]).SelfNormalize();
            }
            // Compute the polygon centroid.
            b2PolygonShape.ComputeCentroid(this.m_vertices, m, this.m_centroid);
            return this;
        };
        b2PolygonShape.prototype.SetAsArray = function (vertices, count) {
            return this.SetAsVector(vertices, count);
        };
        /// Build vertices to represent an axis-aligned box.
        /// @param hx the half-width.
        /// @param hy the half-height.
        b2PolygonShape.prototype.SetAsBox = function (hx, hy) {
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
        };
        /// Build vertices to represent an oriented box.
        /// @param hx the half-width.
        /// @param hy the half-height.
        /// @param center the center of the box in local coordinates.
        /// @param angle the rotation of the box in local coordinates.
        b2PolygonShape.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
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
            var xf = new box2d.b2Transform();
            xf.SetPosition(center);
            xf.SetRotationAngleRadians(angle);
            // Transform vertices and normals.
            for (var i = 0, ict = this.m_count; i < ict; ++i) {
                box2d.b2MulXV(xf, this.m_vertices[i], this.m_vertices[i]);
                box2d.b2MulRV(xf.q, this.m_normals[i], this.m_normals[i]);
            }
            return this;
        };
        b2PolygonShape.prototype.TestPoint = function (xf, p) {
            var pLocal = box2d.b2MulTXV(xf, p, b2PolygonShape.TestPoint_s_pLocal);
            for (var i = 0, ict = this.m_count; i < ict; ++i) {
                var dot = box2d.b2DotVV(this.m_normals[i], box2d.b2SubVV(pLocal, this.m_vertices[i], box2d.b2Vec2.s_t0));
                if (dot > 0) {
                    return false;
                }
            }
            return true;
        };
        b2PolygonShape.prototype.RayCast = function (output, input, xf, childIndex) {
            // Put the ray into the polygon's frame of reference.
            var p1 = box2d.b2MulTXV(xf, input.p1, b2PolygonShape.RayCast_s_p1);
            var p2 = box2d.b2MulTXV(xf, input.p2, b2PolygonShape.RayCast_s_p2);
            var d = box2d.b2SubVV(p2, p1, b2PolygonShape.RayCast_s_d);
            var lower = 0, upper = input.maxFraction;
            var index = -1;
            for (var i = 0, ict = this.m_count; i < ict; ++i) {
                // p = p1 + a * d
                // dot(normal, p - v) = 0
                // dot(normal, p1 - v) + a * dot(normal, d) = 0
                var numerator = box2d.b2DotVV(this.m_normals[i], box2d.b2SubVV(this.m_vertices[i], p1, box2d.b2Vec2.s_t0));
                var denominator = box2d.b2DotVV(this.m_normals[i], d);
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
                // if (upper < lower - b2_epsilon)
                if (upper < lower) {
                    return false;
                }
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= lower && lower <= input.maxFraction);
            }
            if (index >= 0) {
                output.fraction = lower;
                box2d.b2MulRV(xf.q, this.m_normals[index], output.normal);
                return true;
            }
            return false;
        };
        b2PolygonShape.prototype.ComputeAABB = function (aabb, xf, childIndex) {
            var lower = box2d.b2MulXV(xf, this.m_vertices[0], aabb.lowerBound);
            var upper = aabb.upperBound.Copy(lower);
            for (var i = 0, ict = this.m_count; i < ict; ++i) {
                var v = box2d.b2MulXV(xf, this.m_vertices[i], b2PolygonShape.ComputeAABB_s_v);
                box2d.b2MinV(v, lower, lower);
                box2d.b2MaxV(v, upper, upper);
            }
            var r = this.m_radius;
            lower.SelfSubXY(r, r);
            upper.SelfAddXY(r, r);
        };
        b2PolygonShape.prototype.ComputeMass = function (massData, density) {
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
            // for a single triangle, we make a change of constiables to
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
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_count >= 3);
            }
            var center = b2PolygonShape.ComputeMass_s_center.SetZero();
            var area = 0;
            var I = 0;
            // s is the reference point for forming triangles.
            // It's location doesn't change the result (except for rounding error).
            var s = b2PolygonShape.ComputeMass_s_s.SetZero();
            // This code would put the reference point inside the polygon.
            for (var i = 0, ict = this.m_count; i < ict; ++i) {
                s.SelfAdd(this.m_vertices[i]);
            }
            s.SelfMul(1 / this.m_count);
            var k_inv3 = 1 / 3;
            for (var i = 0, ict = this.m_count; i < ict; ++i) {
                // Triangle vertices.
                var e1 = box2d.b2SubVV(this.m_vertices[i], s, b2PolygonShape.ComputeMass_s_e1);
                var e2 = box2d.b2SubVV(this.m_vertices[(i + 1) % ict], s, b2PolygonShape.ComputeMass_s_e2);
                var D = box2d.b2CrossVV(e1, e2);
                var triangleArea = 0.5 * D;
                area += triangleArea;
                // Area weighted centroid
                center.SelfAdd(box2d.b2MulSV(triangleArea * k_inv3, box2d.b2AddVV(e1, e2, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t1));
                var ex1 = e1.x;
                var ey1 = e1.y;
                var ex2 = e2.x;
                var ey2 = e2.y;
                var intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
                var inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;
                I += (0.25 * k_inv3 * D) * (intx2 + inty2);
            }
            // Total mass
            massData.mass = density * area;
            // Center of mass
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(area > box2d.b2_epsilon);
            }
            center.SelfMul(1 / area);
            box2d.b2AddVV(center, s, massData.center);
            // Inertia tensor relative to the local origin (point s).
            massData.I = density * I;
            // Shift to center of mass then to original body origin.
            massData.I += massData.mass * (box2d.b2DotVV(massData.center, massData.center) - box2d.b2DotVV(center, center));
        };
        b2PolygonShape.prototype.Validate = function () {
            for (var i = 0; i < this.m_count; ++i) {
                var i1 = i;
                var i2 = (i + 1) % this.m_count;
                var p = this.m_vertices[i1];
                var e = box2d.b2SubVV(this.m_vertices[i2], p, b2PolygonShape.Validate_s_e);
                for (var j = 0; j < this.m_count; ++j) {
                    if (j === i1 || j === i2) {
                        continue;
                    }
                    var v = box2d.b2SubVV(this.m_vertices[j], p, b2PolygonShape.Validate_s_v);
                    var c = box2d.b2CrossVV(e, v);
                    if (c < 0) {
                        return false;
                    }
                }
            }
            return true;
        };
        b2PolygonShape.prototype.SetupDistanceProxy = function (proxy, index) {
            proxy.m_vertices = this.m_vertices;
            proxy.m_count = this.m_count;
            proxy.m_radius = this.m_radius;
        };
        b2PolygonShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
            // Transform plane into shape co-ordinates
            var normalL = box2d.b2MulTRV(xf.q, normal, b2PolygonShape.ComputeSubmergedArea_s_normalL);
            var offsetL = offset - box2d.b2DotVV(normal, xf.p);
            var depths = b2PolygonShape.ComputeSubmergedArea_s_depths;
            var diveCount = 0;
            var intoIndex = -1;
            var outoIndex = -1;
            var lastSubmerged = false;
            for (var i_1 = 0, ict = this.m_count; i_1 < ict; ++i_1) {
                depths[i_1] = box2d.b2DotVV(normalL, this.m_vertices[i_1]) - offsetL;
                var isSubmerged = depths[i_1] < (-box2d.b2_epsilon);
                if (i_1 > 0) {
                    if (isSubmerged) {
                        if (!lastSubmerged) {
                            intoIndex = i_1 - 1;
                            diveCount++;
                        }
                    }
                    else {
                        if (lastSubmerged) {
                            outoIndex = i_1 - 1;
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
                        var md = b2PolygonShape.ComputeSubmergedArea_s_md;
                        this.ComputeMass(md, 1);
                        box2d.b2MulXV(xf, md.center, c);
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
            var intoIndex2 = ((intoIndex + 1) % this.m_count);
            var outoIndex2 = ((outoIndex + 1) % this.m_count);
            var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
            var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
            var intoVec = b2PolygonShape.ComputeSubmergedArea_s_intoVec.SetXY(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
            var outoVec = b2PolygonShape.ComputeSubmergedArea_s_outoVec.SetXY(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
            // Initialize accumulator
            var area = 0;
            var center = b2PolygonShape.ComputeSubmergedArea_s_center.SetZero();
            var p2 = this.m_vertices[intoIndex2];
            var p3 = null;
            // An awkward loop from intoIndex2+1 to outIndex2
            var i = intoIndex2;
            while (i !== outoIndex2) {
                i = (i + 1) % this.m_count;
                if (i === outoIndex2)
                    p3 = outoVec;
                else
                    p3 = this.m_vertices[i];
                var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
                area += triangleArea;
                // Area weighted centroid
                center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
                center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
                p2 = p3;
            }
            // Normalize and transform centroid
            center.SelfMul(1 / area);
            box2d.b2MulXV(xf, center, c);
            return area;
        };
        b2PolygonShape.prototype.Dump = function () {
            box2d.b2Log("    const shape: b2PolygonShape = new b2PolygonShape();\n");
            box2d.b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", box2d.b2_maxPolygonVertices);
            for (var i = 0; i < this.m_count; ++i) {
                box2d.b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
            }
            box2d.b2Log("    shape.SetAsVector(vs, %d);\n", this.m_count);
        };
        b2PolygonShape.ComputeCentroid = function (vs, count, out) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(count >= 3);
            }
            var c = out;
            c.SetZero();
            var area = 0;
            // s is the reference point for forming triangles.
            // It's location doesn't change the result (except for rounding error).
            var pRef = b2PolygonShape.ComputeCentroid_s_pRef.SetZero();
            /*
        #if 0
            // This code would put the reference point inside the polygon.
            for (const i: number = 0; i < count; ++i) {
              pRef.SelfAdd(vs[i]);
            }
            pRef.SelfMul(1 / count);
        #endif
            */
            var inv3 = 1 / 3;
            for (var i = 0; i < count; ++i) {
                // Triangle vertices.
                var p1 = pRef;
                var p2 = vs[i];
                var p3 = vs[(i + 1) % count];
                var e1 = box2d.b2SubVV(p2, p1, b2PolygonShape.ComputeCentroid_s_e1);
                var e2 = box2d.b2SubVV(p3, p1, b2PolygonShape.ComputeCentroid_s_e2);
                var D = box2d.b2CrossVV(e1, e2);
                var triangleArea = 0.5 * D;
                area += triangleArea;
                // Area weighted centroid
                c.x += triangleArea * inv3 * (p1.x + p2.x + p3.x);
                c.y += triangleArea * inv3 * (p1.y + p2.y + p3.y);
            }
            // Centroid
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(area > box2d.b2_epsilon);
            }
            c.SelfMul(1 / area);
            return c;
        };
        /// Create a convex hull from the given array of points.
        /// The count must be in the range [3, b2_maxPolygonVertices].
        /// @warning the points may be re-ordered, even if they form a convex polygon
        /// @warning collinear points are handled but not removed. Collinear points
        /// may lead to poor stacking behavior.
        b2PolygonShape.SetAsVector_s_ps = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
        b2PolygonShape.SetAsVector_s_hull = box2d.b2MakeNumberArray(box2d.b2_maxPolygonVertices);
        b2PolygonShape.SetAsVector_s_r = new box2d.b2Vec2();
        b2PolygonShape.SetAsVector_s_v = new box2d.b2Vec2();
        /// @see b2Shape::TestPoint
        b2PolygonShape.TestPoint_s_pLocal = new box2d.b2Vec2();
        /// Implement b2Shape.
        b2PolygonShape.RayCast_s_p1 = new box2d.b2Vec2();
        b2PolygonShape.RayCast_s_p2 = new box2d.b2Vec2();
        b2PolygonShape.RayCast_s_d = new box2d.b2Vec2();
        /// @see b2Shape::ComputeAABB
        b2PolygonShape.ComputeAABB_s_v = new box2d.b2Vec2();
        /// @see b2Shape::ComputeMass
        b2PolygonShape.ComputeMass_s_center = new box2d.b2Vec2();
        b2PolygonShape.ComputeMass_s_s = new box2d.b2Vec2();
        b2PolygonShape.ComputeMass_s_e1 = new box2d.b2Vec2();
        b2PolygonShape.ComputeMass_s_e2 = new box2d.b2Vec2();
        b2PolygonShape.Validate_s_e = new box2d.b2Vec2();
        b2PolygonShape.Validate_s_v = new box2d.b2Vec2();
        b2PolygonShape.ComputeSubmergedArea_s_normalL = new box2d.b2Vec2();
        b2PolygonShape.ComputeSubmergedArea_s_depths = box2d.b2MakeNumberArray(box2d.b2_maxPolygonVertices);
        b2PolygonShape.ComputeSubmergedArea_s_md = new box2d.b2MassData();
        b2PolygonShape.ComputeSubmergedArea_s_intoVec = new box2d.b2Vec2();
        b2PolygonShape.ComputeSubmergedArea_s_outoVec = new box2d.b2Vec2();
        b2PolygonShape.ComputeSubmergedArea_s_center = new box2d.b2Vec2();
        b2PolygonShape.ComputeCentroid_s_pRef = new box2d.b2Vec2();
        b2PolygonShape.ComputeCentroid_s_e1 = new box2d.b2Vec2();
        b2PolygonShape.ComputeCentroid_s_e2 = new box2d.b2Vec2();
        return b2PolygonShape;
    }(box2d.b2Shape));
    box2d.b2PolygonShape = b2PolygonShape;
})(box2d || (box2d = {})); // namespace box2d
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
var box2d;
(function (box2d) {
    /// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
    /// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
    /// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
    /// <reference path="../../../Box2D/Box2D/Common/b2GrowableStack.ts"/>
    /// A node in the dynamic tree. The client does not interact with this directly.
    var b2TreeNode = (function () {
        function b2TreeNode(id) {
            if (id === void 0) { id = 0; }
            this.m_id = 0;
            this.aabb = new box2d.b2AABB();
            this.userData = null;
            this.parent = null; // or b2TreeNode.prototype.next
            this.child1 = null; // or b2TreeNode.prototype.next
            this.child2 = null; // or b2TreeNode.prototype.next
            this.height = 0; // leaf = 0, free node = -1
            this.m_id = id;
        }
        b2TreeNode.prototype.IsLeaf = function () {
            return this.child1 == null;
        };
        return b2TreeNode;
    }());
    box2d.b2TreeNode = b2TreeNode;
    var b2DynamicTree = (function () {
        function b2DynamicTree() {
            this.m_root = null;
            // b2TreeNode* public m_nodes;
            // int32 public m_nodeCount;
            // int32 public m_nodeCapacity;
            this.m_freeList = null;
            this.m_path = 0;
            this.m_insertionCount = 0;
        }
        b2DynamicTree.prototype.GetUserData = function (proxy) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(proxy != null);
            }
            return proxy.userData;
        };
        b2DynamicTree.prototype.GetFatAABB = function (proxy) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(proxy != null);
            }
            return proxy.aabb;
        };
        b2DynamicTree.prototype.Query = function (callback, aabb) {
            if (this.m_root == null)
                return;
            var stack = b2DynamicTree.s_stack.Reset();
            stack.Push(this.m_root);
            while (stack.GetCount() > 0) {
                var node = stack.Pop();
                if (node == null) {
                    continue;
                }
                if (node.aabb.TestOverlap(aabb)) {
                    if (node.IsLeaf()) {
                        var proceed = callback(node);
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
        };
        b2DynamicTree.prototype.RayCast = function (callback, input) {
            if (this.m_root == null)
                return;
            var p1 = input.p1;
            var p2 = input.p2;
            var r = box2d.b2SubVV(p2, p1, b2DynamicTree.s_r);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(r.GetLengthSquared() > 0);
            }
            r.Normalize();
            // v is perpendicular to the segment.
            var v = box2d.b2CrossOneV(r, b2DynamicTree.s_v);
            var abs_v = box2d.b2AbsV(v, b2DynamicTree.s_abs_v);
            // Separating axis for segment (Gino, p80).
            // |dot(v, p1 - c)| > dot(|v|, h)
            var maxFraction = input.maxFraction;
            // Build a bounding box for the segment.
            var segmentAABB = b2DynamicTree.s_segmentAABB;
            var t_x = p1.x + maxFraction * (p2.x - p1.x);
            var t_y = p1.y + maxFraction * (p2.y - p1.y);
            segmentAABB.lowerBound.x = box2d.b2Min(p1.x, t_x);
            segmentAABB.lowerBound.y = box2d.b2Min(p1.y, t_y);
            segmentAABB.upperBound.x = box2d.b2Max(p1.x, t_x);
            segmentAABB.upperBound.y = box2d.b2Max(p1.y, t_y);
            var stack = b2DynamicTree.s_stack.Reset();
            stack.Push(this.m_root);
            while (stack.GetCount() > 0) {
                var node = stack.Pop();
                if (node == null) {
                    continue;
                }
                if (box2d.b2TestOverlapAABB(node.aabb, segmentAABB) === false) {
                    continue;
                }
                // Separating axis for segment (Gino, p80).
                // |dot(v, p1 - c)| > dot(|v|, h)
                var c = node.aabb.GetCenter();
                var h = node.aabb.GetExtents();
                var separation = box2d.b2Abs(box2d.b2DotVV(v, box2d.b2SubVV(p1, c, box2d.b2Vec2.s_t0))) - box2d.b2DotVV(abs_v, h);
                if (separation > 0) {
                    continue;
                }
                if (node.IsLeaf()) {
                    var subInput = b2DynamicTree.s_subInput;
                    subInput.p1.Copy(input.p1);
                    subInput.p2.Copy(input.p2);
                    subInput.maxFraction = maxFraction;
                    var value = callback(subInput, node);
                    if (value === 0) {
                        // The client has terminated the ray cast.
                        return;
                    }
                    if (value > 0) {
                        // Update segment bounding box.
                        maxFraction = value;
                        t_x = p1.x + maxFraction * (p2.x - p1.x);
                        t_y = p1.y + maxFraction * (p2.y - p1.y);
                        segmentAABB.lowerBound.x = box2d.b2Min(p1.x, t_x);
                        segmentAABB.lowerBound.y = box2d.b2Min(p1.y, t_y);
                        segmentAABB.upperBound.x = box2d.b2Max(p1.x, t_x);
                        segmentAABB.upperBound.y = box2d.b2Max(p1.y, t_y);
                    }
                }
                else {
                    stack.Push(node.child1);
                    stack.Push(node.child2);
                }
            }
        };
        b2DynamicTree.prototype.AllocateNode = function () {
            // Expand the node pool as needed.
            if (this.m_freeList) {
                var node = this.m_freeList;
                this.m_freeList = node.parent; // this.m_freeList = node.next;
                node.parent = null;
                node.child1 = null;
                node.child2 = null;
                node.height = 0;
                node.userData = null;
                return node;
            }
            return new b2TreeNode(b2DynamicTree.s_node_id++);
        };
        b2DynamicTree.prototype.FreeNode = function (node) {
            node.parent = this.m_freeList; // node.next = this.m_freeList;
            node.height = -1;
            this.m_freeList = node;
        };
        b2DynamicTree.prototype.CreateProxy = function (aabb, userData) {
            var node = this.AllocateNode();
            // Fatten the aabb.
            var r_x = box2d.b2_aabbExtension;
            var r_y = box2d.b2_aabbExtension;
            node.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
            node.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
            node.aabb.upperBound.x = aabb.upperBound.x + r_x;
            node.aabb.upperBound.y = aabb.upperBound.y + r_y;
            node.userData = userData;
            node.height = 0;
            this.InsertLeaf(node);
            return node;
        };
        b2DynamicTree.prototype.DestroyProxy = function (proxy) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(proxy.IsLeaf());
            }
            this.RemoveLeaf(proxy);
            this.FreeNode(proxy);
        };
        b2DynamicTree.prototype.MoveProxy = function (proxy, aabb, displacement) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(proxy.IsLeaf());
            }
            if (proxy.aabb.Contains(aabb)) {
                return false;
            }
            this.RemoveLeaf(proxy);
            // Extend AABB.
            // Predict AABB displacement.
            var r_x = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
            var r_y = box2d.b2_aabbExtension + box2d.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
            proxy.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
            proxy.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
            proxy.aabb.upperBound.x = aabb.upperBound.x + r_x;
            proxy.aabb.upperBound.y = aabb.upperBound.y + r_y;
            this.InsertLeaf(proxy);
            return true;
        };
        b2DynamicTree.prototype.InsertLeaf = function (leaf) {
            ++this.m_insertionCount;
            if (this.m_root == null) {
                this.m_root = leaf;
                this.m_root.parent = null;
                return;
            }
            // Find the best sibling for this node
            var leafAABB = leaf.aabb;
            var center = leafAABB.GetCenter();
            var index = this.m_root;
            var child1;
            var child2;
            while (index.IsLeaf() === false) {
                child1 = index.child1;
                child2 = index.child2;
                var area = index.aabb.GetPerimeter();
                var combinedAABB = b2DynamicTree.s_combinedAABB;
                combinedAABB.Combine2(index.aabb, leafAABB);
                var combinedArea = combinedAABB.GetPerimeter();
                // Cost of creating a new parent for this node and the new leaf
                var cost = 2 * combinedArea;
                // Minimum cost of pushing the leaf further down the tree
                var inheritanceCost = 2 * (combinedArea - area);
                // Cost of descending into child1
                var cost1 = void 0;
                var aabb = b2DynamicTree.s_aabb;
                var oldArea = void 0;
                var newArea = void 0;
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
                var cost2 = void 0;
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
            var sibling = index;
            // Create a parent for the siblings.
            var oldParent = sibling.parent;
            var newParent = this.AllocateNode();
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
            while (index != null) {
                index = this.Balance(index);
                child1 = index.child1;
                child2 = index.child2;
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(child1 != null);
                }
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(child2 != null);
                }
                index.height = 1 + box2d.b2Max(child1.height, child2.height);
                index.aabb.Combine2(child1.aabb, child2.aabb);
                index = index.parent;
            }
            // this.Validate();
        };
        b2DynamicTree.prototype.RemoveLeaf = function (leaf) {
            if (leaf === this.m_root) {
                this.m_root = null;
                return;
            }
            var parent = leaf.parent;
            var grandParent = parent.parent;
            var sibling;
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
                var index = grandParent;
                while (index) {
                    index = this.Balance(index);
                    var child1 = index.child1;
                    var child2 = index.child2;
                    index.aabb.Combine2(child1.aabb, child2.aabb);
                    index.height = 1 + box2d.b2Max(child1.height, child2.height);
                    index = index.parent;
                }
            }
            else {
                this.m_root = sibling;
                sibling.parent = null;
                this.FreeNode(parent);
            }
            // this.Validate();
        };
        b2DynamicTree.prototype.Balance = function (A) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(A != null);
            }
            if (A.IsLeaf() || A.height < 2) {
                return A;
            }
            var B = A.child1;
            var C = A.child2;
            var balance = C.height - B.height;
            // Rotate C up
            if (balance > 1) {
                var F = C.child1;
                var G = C.child2;
                // Swap A and C
                C.child1 = A;
                C.parent = A.parent;
                A.parent = C;
                // A's old parent should point to C
                if (C.parent != null) {
                    if (C.parent.child1 === A) {
                        C.parent.child1 = C;
                    }
                    else {
                        if (box2d.ENABLE_ASSERTS) {
                            box2d.b2Assert(C.parent.child2 === A);
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
                    A.height = 1 + box2d.b2Max(B.height, G.height);
                    C.height = 1 + box2d.b2Max(A.height, F.height);
                }
                else {
                    C.child2 = G;
                    A.child2 = F;
                    F.parent = A;
                    A.aabb.Combine2(B.aabb, F.aabb);
                    C.aabb.Combine2(A.aabb, G.aabb);
                    A.height = 1 + box2d.b2Max(B.height, F.height);
                    C.height = 1 + box2d.b2Max(A.height, G.height);
                }
                return C;
            }
            // Rotate B up
            if (balance < -1) {
                var D = B.child1;
                var E = B.child2;
                // Swap A and B
                B.child1 = A;
                B.parent = A.parent;
                A.parent = B;
                // A's old parent should point to B
                if (B.parent != null) {
                    if (B.parent.child1 === A) {
                        B.parent.child1 = B;
                    }
                    else {
                        if (box2d.ENABLE_ASSERTS) {
                            box2d.b2Assert(B.parent.child2 === A);
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
                    A.height = 1 + box2d.b2Max(C.height, E.height);
                    B.height = 1 + box2d.b2Max(A.height, D.height);
                }
                else {
                    B.child2 = E;
                    A.child1 = D;
                    D.parent = A;
                    A.aabb.Combine2(C.aabb, D.aabb);
                    B.aabb.Combine2(A.aabb, E.aabb);
                    A.height = 1 + box2d.b2Max(C.height, D.height);
                    B.height = 1 + box2d.b2Max(A.height, E.height);
                }
                return B;
            }
            return A;
        };
        b2DynamicTree.prototype.GetHeight = function () {
            if (this.m_root == null) {
                return 0;
            }
            return this.m_root.height;
        };
        b2DynamicTree.prototype.GetAreaRatio = function () {
            if (this.m_root == null) {
                return 0;
            }
            var root = this.m_root;
            var rootArea = root.aabb.GetPerimeter();
            var GetAreaNode = function (node) {
                if (node == null) {
                    return 0;
                }
                if (node.IsLeaf()) {
                    return 0;
                }
                var area = node.aabb.GetPerimeter();
                area += GetAreaNode(node.child1);
                area += GetAreaNode(node.child2);
                return area;
            };
            var totalArea = GetAreaNode(this.m_root);
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
        };
        b2DynamicTree.prototype.ComputeHeightNode = function (node) {
            if (node.IsLeaf()) {
                return 0;
            }
            var height1 = this.ComputeHeightNode(node.child1);
            var height2 = this.ComputeHeightNode(node.child2);
            return 1 + box2d.b2Max(height1, height2);
        };
        b2DynamicTree.prototype.ComputeHeight = function () {
            var height = this.ComputeHeightNode(this.m_root);
            return height;
        };
        b2DynamicTree.prototype.ValidateStructure = function (index) {
            if (index == null) {
                return;
            }
            if (index === this.m_root) {
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(index.parent == null);
                }
            }
            var node = index;
            var child1 = node.child1;
            var child2 = node.child2;
            if (node.IsLeaf()) {
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(child1 == null);
                }
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(child2 == null);
                }
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(node.height === 0);
                }
                return;
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(child1.parent === index);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(child2.parent === index);
            }
            this.ValidateStructure(child1);
            this.ValidateStructure(child2);
        };
        b2DynamicTree.prototype.ValidateMetrics = function (index) {
            if (index == null) {
                return;
            }
            var node = index;
            var child1 = node.child1;
            var child2 = node.child2;
            if (node.IsLeaf()) {
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(child1 == null);
                }
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(child2 == null);
                }
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(node.height === 0);
                }
                return;
            }
            var height1 = child1.height;
            var height2 = child2.height;
            var height = 1 + box2d.b2Max(height1, height2);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(node.height === height);
            }
            var aabb = b2DynamicTree.s_aabb;
            aabb.Combine2(child1.aabb, child2.aabb);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(aabb.lowerBound === node.aabb.lowerBound);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(aabb.upperBound === node.aabb.upperBound);
            }
            this.ValidateMetrics(child1);
            this.ValidateMetrics(child2);
        };
        b2DynamicTree.prototype.Validate = function () {
            this.ValidateStructure(this.m_root);
            this.ValidateMetrics(this.m_root);
            var freeCount = 0;
            var freeIndex = this.m_freeList;
            while (freeIndex != null) {
                freeIndex = freeIndex.parent; // freeIndex = freeIndex.next;
                ++freeCount;
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.GetHeight() === this.ComputeHeight());
            }
        };
        b2DynamicTree.prototype.GetMaxBalance = function () {
            var GetMaxBalanceNode = function (node, maxBalance) {
                if (node == null) {
                    return maxBalance;
                }
                if (node.height <= 1) {
                    return maxBalance;
                }
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(node.IsLeaf() === false);
                }
                var child1 = node.child1;
                var child2 = node.child2;
                var balance = box2d.b2Abs(child2.height - child1.height);
                return box2d.b2Max(maxBalance, balance);
            };
            var maxBalance = GetMaxBalanceNode(this.m_root, 0);
            /*
            int32 maxBalance = 0;
            for (int32 i = 0; i < m_nodeCapacity; ++i) {
              const b2TreeNode* node = m_nodes + i;
              if (node.height <= 1) {
                continue;
              }
        
              b2Assert(node.IsLeaf() == false);
        
              int32 child1 = node.child1;
              int32 child2 = node.child2;
              int32 balance = b2Abs(m_nodes[child2].height - m_nodes[child1].height);
              maxBalance = b2Max(maxBalance, balance);
            }
            */
            return maxBalance;
        };
        b2DynamicTree.prototype.RebuildBottomUp = function () {
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
              float32 minCost = b2_maxFloat;
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
        };
        b2DynamicTree.prototype.ShiftOrigin = function (newOrigin) {
            var ShiftOriginNode = function (node, newOrigin) {
                if (node == null) {
                    return;
                }
                if (node.height <= 1) {
                    return;
                }
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(node.IsLeaf() === false);
                }
                var child1 = node.child1;
                var child2 = node.child2;
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
        };
        b2DynamicTree.s_stack = new box2d.b2GrowableStack(256);
        b2DynamicTree.s_r = new box2d.b2Vec2();
        b2DynamicTree.s_v = new box2d.b2Vec2();
        b2DynamicTree.s_abs_v = new box2d.b2Vec2();
        b2DynamicTree.s_segmentAABB = new box2d.b2AABB();
        b2DynamicTree.s_subInput = new box2d.b2RayCastInput();
        b2DynamicTree.s_combinedAABB = new box2d.b2AABB();
        b2DynamicTree.s_aabb = new box2d.b2AABB();
        b2DynamicTree.s_node_id = 0;
        return b2DynamicTree;
    }());
    box2d.b2DynamicTree = b2DynamicTree;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2DynamicTree.ts"/>
var box2d;
(function (box2d) {
    var b2Pair = (function () {
        function b2Pair() {
            this.proxyA = null;
            this.proxyB = null;
        }
        return b2Pair;
    }());
    box2d.b2Pair = b2Pair;
    /// The broad-phase is used for computing pairs and performing volume queries and ray casts.
    /// This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
    /// It is up to the client to consume the new pairs and to track subsequent overlap.
    var b2BroadPhase = (function () {
        function b2BroadPhase() {
            this.m_tree = new box2d.b2DynamicTree();
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
        b2BroadPhase.prototype.CreateProxy = function (aabb, userData) {
            var proxy = this.m_tree.CreateProxy(aabb, userData);
            ++this.m_proxyCount;
            this.BufferMove(proxy);
            return proxy;
        };
        /// Destroy a proxy. It is up to the client to remove any pairs.
        b2BroadPhase.prototype.DestroyProxy = function (proxy) {
            this.UnBufferMove(proxy);
            --this.m_proxyCount;
            this.m_tree.DestroyProxy(proxy);
        };
        /// Call MoveProxy as many times as you like, then when you are done
        /// call UpdatePairs to finalized the proxy pairs (for your time step).
        b2BroadPhase.prototype.MoveProxy = function (proxy, aabb, displacement) {
            var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
            if (buffer) {
                this.BufferMove(proxy);
            }
        };
        /// Call to trigger a re-processing of it's pairs on the next call to UpdatePairs.
        b2BroadPhase.prototype.TouchProxy = function (proxy) {
            this.BufferMove(proxy);
        };
        /// Get the fat AABB for a proxy.
        b2BroadPhase.prototype.GetFatAABB = function (proxy) {
            return this.m_tree.GetFatAABB(proxy);
        };
        /// Get user data from a proxy. Returns NULL if the id is invalid.
        b2BroadPhase.prototype.GetUserData = function (proxy) {
            return this.m_tree.GetUserData(proxy);
        };
        /// Test overlap of fat AABBs.
        b2BroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
            var aabbA = this.m_tree.GetFatAABB(proxyA);
            var aabbB = this.m_tree.GetFatAABB(proxyB);
            return box2d.b2TestOverlapAABB(aabbA, aabbB);
        };
        /// Get the number of proxies.
        b2BroadPhase.prototype.GetProxyCount = function () {
            return this.m_proxyCount;
        };
        /// Update the pairs. This results in pair callbacks. This can only add pairs.
        b2BroadPhase.prototype.UpdatePairs = function (contactManager) {
            // Reset pair buffer
            this.m_pairCount = 0;
            // Perform tree queries for all moving proxies.
            var _loop_1 = function(i_2) {
                var queryProxy = this_1.m_moveBuffer[i_2];
                if (queryProxy == null) {
                    return "continue";
                }
                var that = this_1;
                // This is called from box2d.b2DynamicTree::Query when we are gathering pairs.
                // boolean b2BroadPhase::QueryCallback(int32 proxyId);
                var QueryCallback = function (proxy) {
                    // A proxy cannot form a pair with itself.
                    if (proxy.m_id === queryProxy.m_id) {
                        return true;
                    }
                    // Grow the pair buffer as needed.
                    if (that.m_pairCount === that.m_pairBuffer.length) {
                        that.m_pairBuffer[that.m_pairCount] = new box2d.b2Pair();
                    }
                    var pair = that.m_pairBuffer[that.m_pairCount];
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
                var fatAABB = this_1.m_tree.GetFatAABB(queryProxy);
                // Query tree, create pairs and add them pair buffer.
                this_1.m_tree.Query(QueryCallback, fatAABB);
            };
            var this_1 = this;
            for (var i_2 = 0; i_2 < this.m_moveCount; ++i_2) {
                _loop_1(i_2);
            }
            // Reset move buffer
            this.m_moveCount = 0;
            // Sort the pair buffer to expose duplicates.
            this.m_pairBuffer.length = this.m_pairCount;
            this.m_pairBuffer.sort(box2d.b2PairLessThan);
            // Send the pairs back to the client.
            var i = 0;
            while (i < this.m_pairCount) {
                var primaryPair = this.m_pairBuffer[i];
                var userDataA = this.m_tree.GetUserData(primaryPair.proxyA);
                var userDataB = this.m_tree.GetUserData(primaryPair.proxyB);
                contactManager.AddPair(userDataA, userDataB);
                ++i;
                // Skip any duplicate pairs.
                while (i < this.m_pairCount) {
                    var pair = this.m_pairBuffer[i];
                    if (pair.proxyA.m_id !== primaryPair.proxyA.m_id || pair.proxyB.m_id !== primaryPair.proxyB.m_id) {
                        break;
                    }
                    ++i;
                }
            }
            // Try to keep the tree balanced.
            // this.m_tree.Rebalance(4);
        };
        /// Query an AABB for overlapping proxies. The callback class
        /// is called for each proxy that overlaps the supplied AABB.
        b2BroadPhase.prototype.Query = function (callback, aabb) {
            this.m_tree.Query(callback, aabb);
        };
        /// Ray-cast against the proxies in the tree. This relies on the callback
        /// to perform a exact ray-cast in the case were the proxy contains a shape.
        /// The callback also performs the any collision filtering. This has performance
        /// roughly equal to k * log(n), where k is the number of collisions and n is the
        /// number of proxies in the tree.
        /// @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
        /// @param callback a callback class that is called for each proxy that is hit by the ray.
        b2BroadPhase.prototype.RayCast = function (callback, input) {
            this.m_tree.RayCast(callback, input);
        };
        /// Get the height of the embedded tree.
        b2BroadPhase.prototype.GetTreeHeight = function () {
            return this.m_tree.GetHeight();
        };
        /// Get the balance of the embedded tree.
        b2BroadPhase.prototype.GetTreeBalance = function () {
            return this.m_tree.GetMaxBalance();
        };
        /// Get the quality metric of the embedded tree.
        b2BroadPhase.prototype.GetTreeQuality = function () {
            return this.m_tree.GetAreaRatio();
        };
        /// Shift the world origin. Useful for large worlds.
        /// The shift formula is: position -= newOrigin
        /// @param newOrigin the new origin with respect to the old origin
        b2BroadPhase.prototype.ShiftOrigin = function (newOrigin) {
            this.m_tree.ShiftOrigin(newOrigin);
        };
        b2BroadPhase.prototype.BufferMove = function (proxy) {
            this.m_moveBuffer[this.m_moveCount] = proxy;
            ++this.m_moveCount;
        };
        b2BroadPhase.prototype.UnBufferMove = function (proxy) {
            var i = this.m_moveBuffer.indexOf(proxy);
            this.m_moveBuffer[i] = null;
        };
        return b2BroadPhase;
    }());
    box2d.b2BroadPhase = b2BroadPhase;
    /// This is used to sort pairs.
    function b2PairLessThan(pair1, pair2) {
        if (pair1.proxyA.m_id === pair2.proxyA.m_id) {
            return pair1.proxyB.m_id - pair2.proxyB.m_id;
        }
        return pair1.proxyA.m_id - pair2.proxyA.m_id;
    }
    box2d.b2PairLessThan = b2PairLessThan;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2Distance.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Timer.ts"/>
var box2d;
(function (box2d) {
    box2d.b2_toiTime = 0;
    box2d.b2_toiMaxTime = 0;
    box2d.b2_toiCalls = 0;
    box2d.b2_toiIters = 0;
    box2d.b2_toiMaxIters = 0;
    box2d.b2_toiRootIters = 0;
    box2d.b2_toiMaxRootIters = 0;
    var b2TimeOfImpact_s_xfA = new box2d.b2Transform();
    var b2TimeOfImpact_s_xfB = new box2d.b2Transform();
    var b2TimeOfImpact_s_pointA = new box2d.b2Vec2();
    var b2TimeOfImpact_s_pointB = new box2d.b2Vec2();
    var b2TimeOfImpact_s_normal = new box2d.b2Vec2();
    var b2TimeOfImpact_s_axisA = new box2d.b2Vec2();
    var b2TimeOfImpact_s_axisB = new box2d.b2Vec2();
    /// Input parameters for b2TimeOfImpact
    var b2TOIInput = (function () {
        function b2TOIInput() {
            this.proxyA = new box2d.b2DistanceProxy();
            this.proxyB = new box2d.b2DistanceProxy();
            this.sweepA = new box2d.b2Sweep();
            this.sweepB = new box2d.b2Sweep();
            this.tMax = 0; // defines sweep interval [0, tMax]
        }
        return b2TOIInput;
    }());
    box2d.b2TOIInput = b2TOIInput;
    (function (b2TOIOutputState) {
        b2TOIOutputState[b2TOIOutputState["e_unknown"] = 0] = "e_unknown";
        b2TOIOutputState[b2TOIOutputState["e_failed"] = 1] = "e_failed";
        b2TOIOutputState[b2TOIOutputState["e_overlapped"] = 2] = "e_overlapped";
        b2TOIOutputState[b2TOIOutputState["e_touching"] = 3] = "e_touching";
        b2TOIOutputState[b2TOIOutputState["e_separated"] = 4] = "e_separated";
    })(box2d.b2TOIOutputState || (box2d.b2TOIOutputState = {}));
    var b2TOIOutputState = box2d.b2TOIOutputState;
    var b2TOIOutput = (function () {
        function b2TOIOutput() {
            this.state = b2TOIOutputState.e_unknown;
            this.t = 0;
        }
        return b2TOIOutput;
    }());
    box2d.b2TOIOutput = b2TOIOutput;
    (function (b2SeparationFunctionType) {
        b2SeparationFunctionType[b2SeparationFunctionType["e_unknown"] = -1] = "e_unknown";
        b2SeparationFunctionType[b2SeparationFunctionType["e_points"] = 0] = "e_points";
        b2SeparationFunctionType[b2SeparationFunctionType["e_faceA"] = 1] = "e_faceA";
        b2SeparationFunctionType[b2SeparationFunctionType["e_faceB"] = 2] = "e_faceB";
    })(box2d.b2SeparationFunctionType || (box2d.b2SeparationFunctionType = {}));
    var b2SeparationFunctionType = box2d.b2SeparationFunctionType;
    var b2SeparationFunction = (function () {
        function b2SeparationFunction() {
            this.m_proxyA = null;
            this.m_proxyB = null;
            this.m_sweepA = new box2d.b2Sweep();
            this.m_sweepB = new box2d.b2Sweep();
            this.m_type = b2SeparationFunctionType.e_unknown;
            this.m_localPoint = new box2d.b2Vec2();
            this.m_axis = new box2d.b2Vec2();
        }
        b2SeparationFunction.prototype.Initialize = function (cache, proxyA, sweepA, proxyB, sweepB, t1) {
            this.m_proxyA = proxyA;
            this.m_proxyB = proxyB;
            var count = cache.count;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 < count && count < 3);
            }
            this.m_sweepA.Copy(sweepA);
            this.m_sweepB.Copy(sweepB);
            var xfA = b2TimeOfImpact_s_xfA;
            var xfB = b2TimeOfImpact_s_xfB;
            this.m_sweepA.GetTransform(xfA, t1);
            this.m_sweepB.GetTransform(xfB, t1);
            if (count === 1) {
                this.m_type = b2SeparationFunctionType.e_points;
                var localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
                var localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
                var pointA = box2d.b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                var pointB = box2d.b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                box2d.b2SubVV(pointB, pointA, this.m_axis);
                var s = this.m_axis.Normalize();
                return s;
            }
            else if (cache.indexA[0] === cache.indexA[1]) {
                // Two points on B and one on A.
                this.m_type = b2SeparationFunctionType.e_faceB;
                var localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
                var localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
                box2d.b2CrossVOne(box2d.b2SubVV(localPointB2, localPointB1, box2d.b2Vec2.s_t0), this.m_axis).SelfNormalize();
                var normal = box2d.b2MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                box2d.b2MidVV(localPointB1, localPointB2, this.m_localPoint);
                var pointB = box2d.b2MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                var localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
                var pointA = box2d.b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                var s = box2d.b2DotVV(box2d.b2SubVV(pointA, pointB, box2d.b2Vec2.s_t0), normal);
                if (s < 0) {
                    this.m_axis.SelfNeg();
                    s = -s;
                }
                return s;
            }
            else {
                // Two points on A and one or two points on B.
                this.m_type = b2SeparationFunctionType.e_faceA;
                var localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
                var localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
                box2d.b2CrossVOne(box2d.b2SubVV(localPointA2, localPointA1, box2d.b2Vec2.s_t0), this.m_axis).SelfNormalize();
                var normal = box2d.b2MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                box2d.b2MidVV(localPointA1, localPointA2, this.m_localPoint);
                var pointA = box2d.b2MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                var localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
                var pointB = box2d.b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                var s = box2d.b2DotVV(box2d.b2SubVV(pointB, pointA, box2d.b2Vec2.s_t0), normal);
                if (s < 0) {
                    this.m_axis.SelfNeg();
                    s = -s;
                }
                return s;
            }
        };
        b2SeparationFunction.prototype.FindMinSeparation = function (indexA, indexB, t) {
            var xfA = b2TimeOfImpact_s_xfA;
            var xfB = b2TimeOfImpact_s_xfB;
            this.m_sweepA.GetTransform(xfA, t);
            this.m_sweepB.GetTransform(xfB, t);
            switch (this.m_type) {
                case b2SeparationFunctionType.e_points: {
                    var axisA = box2d.b2MulTRV(xfA.q, this.m_axis, b2TimeOfImpact_s_axisA);
                    var axisB = box2d.b2MulTRV(xfB.q, box2d.b2NegV(this.m_axis, box2d.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                    indexA[0] = this.m_proxyA.GetSupport(axisA);
                    indexB[0] = this.m_proxyB.GetSupport(axisB);
                    var localPointA = this.m_proxyA.GetVertex(indexA[0]);
                    var localPointB = this.m_proxyB.GetVertex(indexB[0]);
                    var pointA = box2d.b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                    var pointB = box2d.b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                    var separation = box2d.b2DotVV(box2d.b2SubVV(pointB, pointA, box2d.b2Vec2.s_t0), this.m_axis);
                    return separation;
                }
                case b2SeparationFunctionType.e_faceA: {
                    var normal = box2d.b2MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                    var pointA = box2d.b2MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                    var axisB = box2d.b2MulTRV(xfB.q, box2d.b2NegV(normal, box2d.b2Vec2.s_t0), b2TimeOfImpact_s_axisB);
                    indexA[0] = -1;
                    indexB[0] = this.m_proxyB.GetSupport(axisB);
                    var localPointB = this.m_proxyB.GetVertex(indexB[0]);
                    var pointB = box2d.b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                    var separation = box2d.b2DotVV(box2d.b2SubVV(pointB, pointA, box2d.b2Vec2.s_t0), normal);
                    return separation;
                }
                case b2SeparationFunctionType.e_faceB: {
                    var normal = box2d.b2MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                    var pointB = box2d.b2MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                    var axisA = box2d.b2MulTRV(xfA.q, box2d.b2NegV(normal, box2d.b2Vec2.s_t0), b2TimeOfImpact_s_axisA);
                    indexB[0] = -1;
                    indexA[0] = this.m_proxyA.GetSupport(axisA);
                    var localPointA = this.m_proxyA.GetVertex(indexA[0]);
                    var pointA = box2d.b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                    var separation = box2d.b2DotVV(box2d.b2SubVV(pointA, pointB, box2d.b2Vec2.s_t0), normal);
                    return separation;
                }
                default:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    indexA[0] = -1;
                    indexB[0] = -1;
                    return 0;
            }
        };
        b2SeparationFunction.prototype.Evaluate = function (indexA, indexB, t) {
            var xfA = b2TimeOfImpact_s_xfA;
            var xfB = b2TimeOfImpact_s_xfB;
            this.m_sweepA.GetTransform(xfA, t);
            this.m_sweepB.GetTransform(xfB, t);
            switch (this.m_type) {
                case b2SeparationFunctionType.e_points: {
                    var localPointA = this.m_proxyA.GetVertex(indexA);
                    var localPointB = this.m_proxyB.GetVertex(indexB);
                    var pointA = box2d.b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                    var pointB = box2d.b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                    var separation = box2d.b2DotVV(box2d.b2SubVV(pointB, pointA, box2d.b2Vec2.s_t0), this.m_axis);
                    return separation;
                }
                case b2SeparationFunctionType.e_faceA: {
                    var normal = box2d.b2MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
                    var pointA = box2d.b2MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);
                    var localPointB = this.m_proxyB.GetVertex(indexB);
                    var pointB = box2d.b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
                    var separation = box2d.b2DotVV(box2d.b2SubVV(pointB, pointA, box2d.b2Vec2.s_t0), normal);
                    return separation;
                }
                case b2SeparationFunctionType.e_faceB: {
                    var normal = box2d.b2MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
                    var pointB = box2d.b2MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);
                    var localPointA = this.m_proxyA.GetVertex(indexA);
                    var pointA = box2d.b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
                    var separation = box2d.b2DotVV(box2d.b2SubVV(pointA, pointB, box2d.b2Vec2.s_t0), normal);
                    return separation;
                }
                default:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    return 0;
            }
        };
        return b2SeparationFunction;
    }());
    box2d.b2SeparationFunction = b2SeparationFunction;
    var b2TimeOfImpact_s_timer = new box2d.b2Timer();
    var b2TimeOfImpact_s_cache = new box2d.b2SimplexCache();
    var b2TimeOfImpact_s_distanceInput = new box2d.b2DistanceInput();
    var b2TimeOfImpact_s_distanceOutput = new box2d.b2DistanceOutput();
    var b2TimeOfImpact_s_fcn = new b2SeparationFunction();
    var b2TimeOfImpact_s_indexA = box2d.b2MakeNumberArray(1);
    var b2TimeOfImpact_s_indexB = box2d.b2MakeNumberArray(1);
    var b2TimeOfImpact_s_sweepA = new box2d.b2Sweep();
    var b2TimeOfImpact_s_sweepB = new box2d.b2Sweep();
    function b2TimeOfImpact(output, input) {
        var timer = b2TimeOfImpact_s_timer.Reset();
        ++box2d.b2_toiCalls;
        output.state = b2TOIOutputState.e_unknown;
        output.t = input.tMax;
        var proxyA = input.proxyA;
        var proxyB = input.proxyB;
        var sweepA = b2TimeOfImpact_s_sweepA.Copy(input.sweepA);
        var sweepB = b2TimeOfImpact_s_sweepB.Copy(input.sweepB);
        // Large rotations can make the root finder fail, so we normalize the
        // sweep angles.
        sweepA.Normalize();
        sweepB.Normalize();
        var tMax = input.tMax;
        var totalRadius = proxyA.m_radius + proxyB.m_radius;
        var target = box2d.b2Max(box2d.b2_linearSlop, totalRadius - 3 * box2d.b2_linearSlop);
        var tolerance = 0.25 * box2d.b2_linearSlop;
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(target > tolerance);
        }
        var t1 = 0;
        var k_maxIterations = 20; // TODO_ERIN b2Settings
        var iter = 0;
        // Prepare input for distance query.
        var cache = b2TimeOfImpact_s_cache;
        cache.count = 0;
        var distanceInput = b2TimeOfImpact_s_distanceInput;
        distanceInput.proxyA = input.proxyA;
        distanceInput.proxyB = input.proxyB;
        distanceInput.useRadii = false;
        // The outer loop progressively attempts to compute new separating axes.
        // This loop terminates when an axis is repeated (no progress is made).
        for (;;) {
            var xfA = b2TimeOfImpact_s_xfA;
            var xfB = b2TimeOfImpact_s_xfB;
            sweepA.GetTransform(xfA, t1);
            sweepB.GetTransform(xfB, t1);
            // Get the distance between shapes. We can also use the results
            // to get a separating axis.
            distanceInput.transformA.Copy(xfA);
            distanceInput.transformB.Copy(xfB);
            var distanceOutput = b2TimeOfImpact_s_distanceOutput;
            box2d.b2Distance(distanceOutput, cache, distanceInput);
            // If the shapes are overlapped, we give up on continuous collision.
            if (distanceOutput.distance <= 0) {
                // Failure!
                output.state = b2TOIOutputState.e_overlapped;
                output.t = 0;
                break;
            }
            if (distanceOutput.distance < target + tolerance) {
                // Victory!
                output.state = b2TOIOutputState.e_touching;
                output.t = t1;
                break;
            }
            // Initialize the separating axis.
            var fcn = b2TimeOfImpact_s_fcn;
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
            var done = false;
            var t2 = tMax;
            var pushBackIter = 0;
            for (;;) {
                // Find the deepest point at t2. Store the witness point indices.
                var indexA = b2TimeOfImpact_s_indexA;
                var indexB = b2TimeOfImpact_s_indexB;
                var s2 = fcn.FindMinSeparation(indexA, indexB, t2);
                // Is the final configuration separated?
                if (s2 > (target + tolerance)) {
                    // Victory!
                    output.state = b2TOIOutputState.e_separated;
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
                var s1 = fcn.Evaluate(indexA[0], indexB[0], t1);
                // Check for initial overlap. This might happen if the root finder
                // runs out of iterations.
                if (s1 < (target - tolerance)) {
                    output.state = b2TOIOutputState.e_failed;
                    output.t = t1;
                    done = true;
                    break;
                }
                // Check for touching
                if (s1 <= (target + tolerance)) {
                    // Victory! t1 should hold the TOI (could be 0.0).
                    output.state = b2TOIOutputState.e_touching;
                    output.t = t1;
                    done = true;
                    break;
                }
                // Compute 1D root of: f(x) - target = 0
                var rootIterCount = 0;
                var a1 = t1;
                var a2 = t2;
                for (;;) {
                    // Use a mix of the secant rule and bisection.
                    var t = 0;
                    if (rootIterCount & 1) {
                        // Secant rule to improve convergence.
                        t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
                    }
                    else {
                        // Bisection to guarantee progress.
                        t = 0.5 * (a1 + a2);
                    }
                    ++rootIterCount;
                    ++box2d.b2_toiRootIters;
                    var s = fcn.Evaluate(indexA[0], indexB[0], t);
                    if (box2d.b2Abs(s - target) < tolerance) {
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
                box2d.b2_toiMaxRootIters = box2d.b2Max(box2d.b2_toiMaxRootIters, rootIterCount);
                ++pushBackIter;
                if (pushBackIter === box2d.b2_maxPolygonVertices) {
                    break;
                }
            }
            ++iter;
            ++box2d.b2_toiIters;
            if (done) {
                break;
            }
            if (iter === k_maxIterations) {
                // Root finder got stuck. Semi-victory.
                output.state = b2TOIOutputState.e_failed;
                output.t = t1;
                break;
            }
        }
        box2d.b2_toiMaxIters = box2d.b2Max(box2d.b2_toiMaxIters, iter);
        var time = timer.GetMilliseconds();
        box2d.b2_toiMaxTime = box2d.b2Max(box2d.b2_toiMaxTime, time);
        box2d.b2_toiTime += time;
    }
    box2d.b2TimeOfImpact = b2TimeOfImpact;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
// <reference path="../../../Box2D/Box2D/Dynamics/b2World.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2ChainShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2BroadPhase.ts"/>
var box2d;
(function (box2d) {
    /// This holds contact filtering data.
    var b2Filter = (function () {
        function b2Filter() {
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
        b2Filter.prototype.Clone = function () {
            return new b2Filter().Copy(this);
        };
        b2Filter.prototype.Copy = function (other) {
            // if (ENABLE_ASSERTS) { b2Assert(this !== other); }
            this.categoryBits = other.categoryBits;
            this.maskBits = other.maskBits;
            this.groupIndex = other.groupIndex;
            return this;
        };
        return b2Filter;
    }());
    box2d.b2Filter = b2Filter;
    /// A fixture definition is used to create a fixture. This class defines an
    /// abstract fixture definition. You can reuse fixture definitions safely.
    var b2FixtureDef = (function () {
        function b2FixtureDef() {
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
        return b2FixtureDef;
    }());
    box2d.b2FixtureDef = b2FixtureDef;
    /// This proxy is used internally to connect fixtures to the broad-phase.
    var b2FixtureProxy = (function () {
        function b2FixtureProxy() {
            this.aabb = new box2d.b2AABB();
            this.fixture = null;
            this.childIndex = 0;
            this.proxy = null;
        }
        b2FixtureProxy.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2FixtureProxy(); });
        };
        return b2FixtureProxy;
    }());
    box2d.b2FixtureProxy = b2FixtureProxy;
    /// A fixture is used to attach a shape to a body for collision detection. A fixture
    /// inherits its transform from its parent. Fixtures hold additional non-geometric data
    /// such as friction, collision filters, etc.
    /// Fixtures are created via b2Body::CreateFixture.
    /// @warning you cannot reuse fixtures.
    var b2Fixture = (function () {
        function b2Fixture() {
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
        b2Fixture.prototype.GetType = function () {
            return this.m_shape.GetType();
        };
        /// Get the child shape. You can modify the child shape, however you should not change the
        /// number of vertices because this will crash some collision caching mechanisms.
        /// Manipulating the shape may lead to non-physical behavior.
        b2Fixture.prototype.GetShape = function () {
            return this.m_shape;
        };
        /// Set if this fixture is a sensor.
        b2Fixture.prototype.SetSensor = function (sensor) {
            if (sensor !== this.m_isSensor) {
                this.m_body.SetAwake(true);
                this.m_isSensor = sensor;
            }
        };
        /// Is this fixture a sensor (non-solid)?
        /// @return the true if the shape is a sensor.
        b2Fixture.prototype.IsSensor = function () {
            return this.m_isSensor;
        };
        /// Set the contact filtering data. This will not update contacts until the next time
        /// step when either parent body is active and awake.
        /// This automatically calls Refilter.
        b2Fixture.prototype.SetFilterData = function (filter) {
            this.m_filter.Copy(filter);
            this.Refilter();
        };
        /// Get the contact filtering data.
        b2Fixture.prototype.GetFilterData = function () {
            return this.m_filter;
        };
        /// Call this if you want to establish collision that was previously disabled by b2ContactFilter::ShouldCollide.
        b2Fixture.prototype.Refilter = function () {
            if (this.m_body) {
                return;
            }
            // Flag associated contacts for filtering.
            var edge = this.m_body.GetContactList();
            while (edge) {
                var contact = edge.contact;
                var fixtureA = contact.GetFixtureA();
                var fixtureB = contact.GetFixtureB();
                if (fixtureA === this || fixtureB === this) {
                    contact.FlagForFiltering();
                }
                edge = edge.next;
            }
            var world = this.m_body.GetWorld();
            if (world === null) {
                return;
            }
            // Touch each proxy so that new pairs may be created
            var broadPhase = world.m_contactManager.m_broadPhase;
            for (var i = 0; i < this.m_proxyCount; ++i) {
                broadPhase.TouchProxy(this.m_proxies[i].proxy);
            }
        };
        /// Get the parent body of this fixture. This is NULL if the fixture is not attached.
        /// @return the parent body.
        b2Fixture.prototype.GetBody = function () {
            return this.m_body;
        };
        /// Get the next fixture in the parent body's fixture list.
        /// @return the next shape.
        b2Fixture.prototype.GetNext = function () {
            return this.m_next;
        };
        /// Get the user data that was assigned in the fixture definition. Use this to
        /// store your application specific data.
        b2Fixture.prototype.GetUserData = function () {
            return this.m_userData;
        };
        /// Set the user data. Use this to store your application specific data.
        b2Fixture.prototype.SetUserData = function (data) {
            this.m_userData = data;
        };
        /// Test a point for containment in this fixture.
        /// @param p a point in world coordinates.
        b2Fixture.prototype.TestPoint = function (p) {
            return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
        };
        /// Cast a ray against this shape.
        /// @param output the ray-cast results.
        /// @param input the ray-cast input parameters.
        b2Fixture.prototype.RayCast = function (output, input, childIndex) {
            return this.m_shape.RayCast(output, input, this.m_body.GetTransform(), childIndex);
        };
        /// Get the mass data for this fixture. The mass data is based on the density and
        /// the shape. The rotational inertia is about the shape's origin. This operation
        /// may be expensive.
        b2Fixture.prototype.GetMassData = function (massData) {
            if (massData === void 0) { massData = new box2d.b2MassData(); }
            this.m_shape.ComputeMass(massData, this.m_density);
            return massData;
        };
        /// Set the density of this fixture. This will _not_ automatically adjust the mass
        /// of the body. You must call b2Body::ResetMassData to update the body's mass.
        b2Fixture.prototype.SetDensity = function (density) {
            this.m_density = density;
        };
        /// Get the density of this fixture.
        b2Fixture.prototype.GetDensity = function () {
            return this.m_density;
        };
        /// Get the coefficient of friction.
        b2Fixture.prototype.GetFriction = function () {
            return this.m_friction;
        };
        /// Set the coefficient of friction. This will _not_ change the friction of
        /// existing contacts.
        b2Fixture.prototype.SetFriction = function (friction) {
            this.m_friction = friction;
        };
        /// Get the coefficient of restitution.
        b2Fixture.prototype.GetRestitution = function () {
            return this.m_restitution;
        };
        /// Set the coefficient of restitution. This will _not_ change the restitution of
        /// existing contacts.
        b2Fixture.prototype.SetRestitution = function (restitution) {
            this.m_restitution = restitution;
        };
        /// Get the fixture's AABB. This AABB may be enlarge and/or stale.
        /// If you need a more accurate AABB, compute it using the shape and
        /// the body transform.
        b2Fixture.prototype.GetAABB = function (childIndex) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= childIndex && childIndex < this.m_proxyCount);
            }
            return this.m_proxies[childIndex].aabb;
        };
        /// Dump this fixture to the log file.
        b2Fixture.prototype.Dump = function (bodyIndex) {
            if (box2d.DEBUG) {
                box2d.b2Log("    const fd: b2FixtureDef = new b2FixtureDef();\n");
                box2d.b2Log("    fd.friction = %.15f;\n", this.m_friction);
                box2d.b2Log("    fd.restitution = %.15f;\n", this.m_restitution);
                box2d.b2Log("    fd.density = %.15f;\n", this.m_density);
                box2d.b2Log("    fd.isSensor = %s;\n", (this.m_isSensor) ? ("true") : ("false"));
                box2d.b2Log("    fd.filter.categoryBits = %d;\n", this.m_filter.categoryBits);
                box2d.b2Log("    fd.filter.maskBits = %d;\n", this.m_filter.maskBits);
                box2d.b2Log("    fd.filter.groupIndex = %d;\n", this.m_filter.groupIndex);
                this.m_shape.Dump();
                //      switch (this.m_shape.m_type)
                //      {
                //      case b2ShapeType.e_circleShape:
                //        {
                //          const circle: b2CircleShape = <b2CircleShape> this.m_shape;
                //          b2Log("    const shape: b2CircleShape = new b2CircleShape();\n");
                //          b2Log("    shape.m_radius = %.15f;\n", circle.m_radius);
                //          b2Log("    shape.m_p.SetXY(%.15f, %.15f);\n", circle.m_p.x, circle.m_p.y);
                //        }
                //        break;
                //
                //      case b2ShapeType.e_edgeShape:
                //        {
                //          const edge: b2EdgeShape = <b2EdgeShape> this.m_shape;
                //          b2Log("    const shape: b2EdgeShape = new b2EdgeShape();\n");
                //          b2Log("    shape.m_radius = %.15f;\n", edge.m_radius);
                //          b2Log("    shape.m_vertex0.SetXY(%.15f, %.15f);\n", edge.m_vertex0.x, edge.m_vertex0.y);
                //          b2Log("    shape.m_vertex1.SetXY(%.15f, %.15f);\n", edge.m_vertex1.x, edge.m_vertex1.y);
                //          b2Log("    shape.m_vertex2.SetXY(%.15f, %.15f);\n", edge.m_vertex2.x, edge.m_vertex2.y);
                //          b2Log("    shape.m_vertex3.SetXY(%.15f, %.15f);\n", edge.m_vertex3.x, edge.m_vertex3.y);
                //          b2Log("    shape.m_hasVertex0 = %s;\n", edge.m_hasVertex0);
                //          b2Log("    shape.m_hasVertex3 = %s;\n", edge.m_hasVertex3);
                //        }
                //        break;
                //
                //      case b2ShapeType.e_polygonShape:
                //        {
                //          const polygon: b2PolygonShape = <b2PolygonShape> this.m_shape;
                //          b2Log("    const shape: b2PolygonShape = new b2PolygonShape();\n");
                //          b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2_maxPolygonVertices);
                //          for (const i: number = 0; i < polygon.m_count; ++i)
                //          {
                //            b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, polygon.m_vertices[i].x, polygon.m_vertices[i].y);
                //          }
                //          b2Log("    shape.SetAsVector(vs, %d);\n", polygon.m_count);
                //        }
                //        break;
                //
                //      case b2ShapeType.e_chainShape:
                //        {
                //          const chain: b2ChainShape = <b2ChainShape> this.m_shape;
                //          b2Log("    const shape: b2ChainShape = new b2ChainShape();\n");
                //          b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2_maxPolygonVertices);
                //          for (const i: number = 0; i < chain.m_count; ++i)
                //          {
                //            b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, chain.m_vertices[i].x, chain.m_vertices[i].y);
                //          }
                //          b2Log("    shape.CreateChain(vs, %d);\n", chain.m_count);
                //          b2Log("    shape.m_prevVertex.SetXY(%.15f, %.15f);\n", chain.m_prevVertex.x, chain.m_prevVertex.y);
                //          b2Log("    shape.m_nextVertex.SetXY(%.15f, %.15f);\n", chain.m_nextVertex.x, chain.m_nextVertex.y);
                //          b2Log("    shape.m_hasPrevVertex = %s;\n", (chain.m_hasPrevVertex)?('true'):('false'));
                //          b2Log("    shape.m_hasNextVertex = %s;\n", (chain.m_hasNextVertex)?('true'):('false'));
                //        }
                //        break;
                //
                //      default:
                //        return;
                //      }
                box2d.b2Log("\n");
                box2d.b2Log("    fd.shape = shape;\n");
                box2d.b2Log("\n");
                box2d.b2Log("    bodies[%d].CreateFixture(fd);\n", bodyIndex);
            }
        };
        // We need separation create/destroy functions from the constructor/destructor because
        // the destructor cannot access the allocator (no destructor arguments allowed by C++).
        b2Fixture.prototype.Create = function (body, def) {
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
        };
        b2Fixture.prototype.Destroy = function () {
            // The proxies must be destroyed before calling this.
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_proxyCount === 0);
            }
            // Free the proxy array.
            // int32 childCount = m_shape->GetChildCount();
            // allocator->Free(m_proxies, childCount * sizeof(b2FixtureProxy));
            // m_proxies = NULL;
            this.m_shape = null;
        };
        // These support body activation/deactivation.
        b2Fixture.prototype.CreateProxies = function (broadPhase, xf) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_proxyCount === 0);
            }
            // Create proxies in the broad-phase.
            this.m_proxyCount = this.m_shape.GetChildCount();
            for (var i = 0; i < this.m_proxyCount; ++i) {
                var proxy = this.m_proxies[i];
                this.m_shape.ComputeAABB(proxy.aabb, xf, i);
                proxy.proxy = broadPhase.CreateProxy(proxy.aabb, proxy);
                proxy.fixture = this;
                proxy.childIndex = i;
            }
        };
        b2Fixture.prototype.DestroyProxies = function (broadPhase) {
            // Destroy proxies in the broad-phase.
            for (var i = 0; i < this.m_proxyCount; ++i) {
                var proxy = this.m_proxies[i];
                broadPhase.DestroyProxy(proxy.proxy);
                proxy.proxy = null;
            }
            this.m_proxyCount = 0;
        };
        b2Fixture.prototype.Synchronize = function (broadPhase, transform1, transform2) {
            if (this.m_proxyCount === 0) {
                return;
            }
            for (var i = 0; i < this.m_proxyCount; ++i) {
                var proxy = this.m_proxies[i];
                // Compute an AABB that covers the swept shape (may miss some rotation effect).
                var aabb1 = b2Fixture.Synchronize_s_aabb1;
                var aabb2 = b2Fixture.Synchronize_s_aabb2;
                this.m_shape.ComputeAABB(aabb1, transform1, i);
                this.m_shape.ComputeAABB(aabb2, transform2, i);
                proxy.aabb.Combine2(aabb1, aabb2);
                var displacement = box2d.b2SubVV(transform2.p, transform1.p, b2Fixture.Synchronize_s_displacement);
                broadPhase.MoveProxy(proxy.proxy, proxy.aabb, displacement);
            }
        };
        b2Fixture.Synchronize_s_aabb1 = new box2d.b2AABB();
        b2Fixture.Synchronize_s_aabb2 = new box2d.b2AABB();
        b2Fixture.Synchronize_s_displacement = new box2d.b2Vec2();
        return b2Fixture;
    }());
    box2d.b2Fixture = b2Fixture;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
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
/// <reference path="../../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2World.ts"/>
// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
var box2d;
(function (box2d) {
    (function (b2JointType) {
        b2JointType[b2JointType["e_unknownJoint"] = 0] = "e_unknownJoint";
        b2JointType[b2JointType["e_revoluteJoint"] = 1] = "e_revoluteJoint";
        b2JointType[b2JointType["e_prismaticJoint"] = 2] = "e_prismaticJoint";
        b2JointType[b2JointType["e_distanceJoint"] = 3] = "e_distanceJoint";
        b2JointType[b2JointType["e_pulleyJoint"] = 4] = "e_pulleyJoint";
        b2JointType[b2JointType["e_mouseJoint"] = 5] = "e_mouseJoint";
        b2JointType[b2JointType["e_gearJoint"] = 6] = "e_gearJoint";
        b2JointType[b2JointType["e_wheelJoint"] = 7] = "e_wheelJoint";
        b2JointType[b2JointType["e_weldJoint"] = 8] = "e_weldJoint";
        b2JointType[b2JointType["e_frictionJoint"] = 9] = "e_frictionJoint";
        b2JointType[b2JointType["e_ropeJoint"] = 10] = "e_ropeJoint";
        b2JointType[b2JointType["e_motorJoint"] = 11] = "e_motorJoint";
        b2JointType[b2JointType["e_areaJoint"] = 12] = "e_areaJoint";
    })(box2d.b2JointType || (box2d.b2JointType = {}));
    var b2JointType = box2d.b2JointType;
    (function (b2LimitState) {
        b2LimitState[b2LimitState["e_inactiveLimit"] = 0] = "e_inactiveLimit";
        b2LimitState[b2LimitState["e_atLowerLimit"] = 1] = "e_atLowerLimit";
        b2LimitState[b2LimitState["e_atUpperLimit"] = 2] = "e_atUpperLimit";
        b2LimitState[b2LimitState["e_equalLimits"] = 3] = "e_equalLimits";
    })(box2d.b2LimitState || (box2d.b2LimitState = {}));
    var b2LimitState = box2d.b2LimitState;
    var b2Jacobian = (function () {
        function b2Jacobian() {
            this.linear = new box2d.b2Vec2();
            this.angularA = 0;
            this.angularB = 0;
        }
        b2Jacobian.prototype.SetZero = function () {
            this.linear.SetZero();
            this.angularA = 0;
            this.angularB = 0;
            return this;
        };
        b2Jacobian.prototype.Set = function (x, a1, a2) {
            this.linear.Copy(x);
            this.angularA = a1;
            this.angularB = a2;
            return this;
        };
        return b2Jacobian;
    }());
    box2d.b2Jacobian = b2Jacobian;
    /// A joint edge is used to connect bodies and joints together
    /// in a joint graph where each body is a node and each joint
    /// is an edge. A joint edge belongs to a doubly linked list
    /// maintained in each attached body. Each joint has two joint
    /// nodes, one for each attached body.
    var b2JointEdge = (function () {
        function b2JointEdge() {
            this.other = null; ///< provides quick access to the other body attached.
            this.joint = null; ///< the joint
            this.prev = null; ///< the previous joint edge in the body's joint list
            this.next = null; ///< the next joint edge in the body's joint list
        }
        return b2JointEdge;
    }());
    box2d.b2JointEdge = b2JointEdge;
    /// Joint definitions are used to construct joints.
    var b2JointDef = (function () {
        function b2JointDef(type) {
            /// The joint type is set automatically for concrete joint types.
            this.type = b2JointType.e_unknownJoint;
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
        return b2JointDef;
    }());
    box2d.b2JointDef = b2JointDef;
    /// The base joint class. Joints are used to constraint two bodies together in
    /// constious fashions. Some joints also feature limits and motors.
    var b2Joint = (function () {
        function b2Joint(def) {
            this.m_type = b2JointType.e_unknownJoint;
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
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(def.bodyA !== def.bodyB);
            }
            this.m_type = def.type;
            this.m_bodyA = def.bodyA;
            this.m_bodyB = def.bodyB;
            this.m_collideConnected = def.collideConnected;
            this.m_userData = def.userData;
        }
        /// Get the type of the concrete joint.
        b2Joint.prototype.GetType = function () {
            return this.m_type;
        };
        /// Get the first body attached to this joint.
        b2Joint.prototype.GetBodyA = function () {
            return this.m_bodyA;
        };
        /// Get the second body attached to this joint.
        b2Joint.prototype.GetBodyB = function () {
            return this.m_bodyB;
        };
        /// Get the anchor point on bodyA in world coordinates.
        b2Joint.prototype.GetAnchorA = function (out) {
            return out.SetZero();
        };
        /// Get the anchor point on bodyB in world coordinates.
        b2Joint.prototype.GetAnchorB = function (out) {
            return out.SetZero();
        };
        /// Get the reaction force on bodyB at the joint anchor in Newtons.
        b2Joint.prototype.GetReactionForce = function (inv_dt, out) {
            return out.SetZero();
        };
        /// Get the reaction torque on bodyB in N*m.
        b2Joint.prototype.GetReactionTorque = function (inv_dt) {
            return 0;
        };
        /// Get the next joint the world joint list.
        b2Joint.prototype.GetNext = function () {
            return this.m_next;
        };
        /// Get the user data pointer.
        b2Joint.prototype.GetUserData = function () {
            return this.m_userData;
        };
        /// Set the user data pointer.
        b2Joint.prototype.SetUserData = function (data) {
            this.m_userData = data;
        };
        /// Short-cut function to determine if either body is inactive.
        b2Joint.prototype.IsActive = function () {
            return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
        };
        /// Get collide connected.
        /// Note: modifying the collide connect flag won't work correctly because
        /// the flag is only checked when fixture AABBs begin to overlap.
        b2Joint.prototype.GetCollideConnected = function () {
            return this.m_collideConnected;
        };
        /// Dump this joint to the log file.
        b2Joint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                box2d.b2Log("// Dump is not supported for this joint type.\n");
            }
        };
        /// Shift the origin for any points stored in world coordinates.
        b2Joint.prototype.ShiftOrigin = function (newOrigin) {
        };
        b2Joint.prototype.InitVelocityConstraints = function (data) {
        };
        b2Joint.prototype.SolveVelocityConstraints = function (data) {
        };
        // This returns true if the position errors are within tolerance.
        b2Joint.prototype.SolvePositionConstraints = function (data) {
            return false;
        };
        return b2Joint;
    }());
    box2d.b2Joint = b2Joint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
var box2d;
(function (box2d) {
    /// Joints and fixtures are destroyed when their associated
    /// body is destroyed. Implement this listener so that you
    /// may nullify references to these joints and shapes.
    var b2DestructionListener = (function () {
        function b2DestructionListener() {
        }
        /// Called when any joint is about to be destroyed due
        /// to the destruction of one of its attached bodies.
        b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) {
        };
        /// Called when any fixture is about to be destroyed due
        /// to the destruction of its parent body.
        b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) {
        };
        return b2DestructionListener;
    }());
    box2d.b2DestructionListener = b2DestructionListener;
    /// Implement this class to provide collision filtering. In other words, you can implement
    /// this class if you want finer control over contact creation.
    var b2ContactFilter = (function () {
        function b2ContactFilter() {
        }
        /// Return true if contact calculations should be performed between these two shapes.
        /// @warning for performance reasons this is only called when the AABBs begin to overlap.
        b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
            var filter1 = fixtureA.GetFilterData();
            var filter2 = fixtureB.GetFilterData();
            if (filter1.groupIndex === filter2.groupIndex && filter1.groupIndex !== 0) {
                return (filter1.groupIndex > 0);
            }
            var collide = (((filter1.maskBits & filter2.categoryBits) !== 0) && ((filter1.categoryBits & filter2.maskBits) !== 0));
            return collide;
        };
        b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
        return b2ContactFilter;
    }());
    box2d.b2ContactFilter = b2ContactFilter;
    /// Contact impulses for reporting. Impulses are used instead of forces because
    /// sub-step forces may approach infinity for rigid body collisions. These
    /// match up one-to-one with the contact points in b2Manifold.
    var b2ContactImpulse = (function () {
        function b2ContactImpulse() {
            this.normalImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints);
            this.tangentImpulses = box2d.b2MakeNumberArray(box2d.b2_maxManifoldPoints);
            this.count = 0;
        }
        return b2ContactImpulse;
    }());
    box2d.b2ContactImpulse = b2ContactImpulse;
    /// Implement this class to get contact information. You can use these results for
    /// things like sounds and game logic. You can also get contact results by
    /// traversing the contact lists after the time step. However, you might miss
    /// some contacts because continuous physics leads to sub-stepping.
    /// Additionally you may receive multiple callbacks for the same contact in a
    /// single time step.
    /// You should strive to make your callbacks efficient because there may be
    /// many callbacks per time step.
    /// @warning You cannot create/destroy Box2D entities inside these callbacks.
    var b2ContactListener = (function () {
        function b2ContactListener() {
        }
        /// Called when two fixtures begin to touch.
        b2ContactListener.prototype.BeginContact = function (contact) {
        };
        /// Called when two fixtures cease to touch.
        b2ContactListener.prototype.EndContact = function (contact) {
        };
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
        b2ContactListener.prototype.PreSolve = function (contact, oldManifold) {
        };
        /// This lets you inspect a contact after the solver is finished. This is useful
        /// for inspecting impulses.
        /// Note: the contact manifold does not include time of impact impulses, which can be
        /// arbitrarily large if the sub-step is small. Hence the impulse is provided explicitly
        /// in a separate data structure.
        /// Note: this is only called for contacts that are touching, solid, and awake.
        b2ContactListener.prototype.PostSolve = function (contact, impulse) {
        };
        b2ContactListener.b2_defaultListener = new b2ContactListener();
        return b2ContactListener;
    }());
    box2d.b2ContactListener = b2ContactListener;
    /// Callback class for AABB queries.
    /// See b2World::Query
    var b2QueryCallback = (function () {
        function b2QueryCallback() {
        }
        /// Called for each fixture found in the query AABB.
        /// @return false to terminate the query.
        b2QueryCallback.prototype.ReportFixture = function (fixture) {
            return true;
        };
        return b2QueryCallback;
    }());
    box2d.b2QueryCallback = b2QueryCallback;
    /// Callback class for ray casts.
    /// See b2World::RayCast
    var b2RayCastCallback = (function () {
        function b2RayCastCallback() {
        }
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
        b2RayCastCallback.prototype.ReportFixture = function (fixture, point, normal, fraction) {
            return fraction;
        };
        return b2RayCastCallback;
    }());
    box2d.b2RayCastCallback = b2RayCastCallback;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../../Box2D/Box2D/Common/b2Math.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/b2Collision.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
// <reference path=""../../../../Box2D/Box2D/Dynamics/Contacts/b2ContactSolver.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/b2TimeOfImpact.ts"/>
// <reference path=""../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path=""../../../../Box2D/Box2D/Dynamics/b2World.ts"/>
var box2d;
(function (box2d) {
    /// Friction mixing law. The idea is to allow either fixture to drive the restitution to zero.
    /// For example, anything slides on ice.
    function b2MixFriction(friction1, friction2) {
        return box2d.b2Sqrt(friction1 * friction2);
    }
    box2d.b2MixFriction = b2MixFriction;
    /// Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
    /// For example, a superball bounces on anything.
    function b2MixRestitution(restitution1, restitution2) {
        return restitution1 > restitution2 ? restitution1 : restitution2;
    }
    box2d.b2MixRestitution = b2MixRestitution;
    var b2ContactEdge = (function () {
        function b2ContactEdge() {
            this.other = null; ///< provides quick access to the other body attached.
            this.contact = null; ///< the contact
            this.prev = null; ///< the previous contact edge in the body's contact list
            this.next = null; ///< the next contact edge in the body's contact list
        }
        return b2ContactEdge;
    }());
    box2d.b2ContactEdge = b2ContactEdge;
    (function (b2ContactFlag) {
        b2ContactFlag[b2ContactFlag["e_none"] = 0] = "e_none";
        b2ContactFlag[b2ContactFlag["e_islandFlag"] = 1] = "e_islandFlag";
        b2ContactFlag[b2ContactFlag["e_touchingFlag"] = 2] = "e_touchingFlag";
        b2ContactFlag[b2ContactFlag["e_enabledFlag"] = 4] = "e_enabledFlag";
        b2ContactFlag[b2ContactFlag["e_filterFlag"] = 8] = "e_filterFlag";
        b2ContactFlag[b2ContactFlag["e_bulletHitFlag"] = 16] = "e_bulletHitFlag";
        b2ContactFlag[b2ContactFlag["e_toiFlag"] = 32] = "e_toiFlag"; /// This contact has a valid TOI in m_toi
    })(box2d.b2ContactFlag || (box2d.b2ContactFlag = {}));
    var b2ContactFlag = box2d.b2ContactFlag;
    var b2Contact = (function () {
        function b2Contact() {
            this.m_flags = b2ContactFlag.e_none;
            this.m_prev = null;
            this.m_next = null;
            this.m_nodeA = new b2ContactEdge();
            this.m_nodeB = new b2ContactEdge();
            this.m_fixtureA = null;
            this.m_fixtureB = null;
            this.m_indexA = 0;
            this.m_indexB = 0;
            this.m_manifold = new box2d.b2Manifold();
            this.m_toiCount = 0;
            this.m_toi = 0;
            this.m_friction = 0;
            this.m_restitution = 0;
            this.m_tangentSpeed = 0;
            this.m_oldManifold = new box2d.b2Manifold();
        }
        b2Contact.prototype.GetManifold = function () {
            return this.m_manifold;
        };
        b2Contact.prototype.GetWorldManifold = function (worldManifold) {
            var bodyA = this.m_fixtureA.GetBody();
            var bodyB = this.m_fixtureB.GetBody();
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
        };
        b2Contact.prototype.IsTouching = function () {
            return (this.m_flags & b2ContactFlag.e_touchingFlag) === b2ContactFlag.e_touchingFlag;
        };
        b2Contact.prototype.SetEnabled = function (flag) {
            if (flag) {
                this.m_flags |= b2ContactFlag.e_enabledFlag;
            }
            else {
                this.m_flags &= ~b2ContactFlag.e_enabledFlag;
            }
        };
        b2Contact.prototype.IsEnabled = function () {
            return (this.m_flags & b2ContactFlag.e_enabledFlag) === b2ContactFlag.e_enabledFlag;
        };
        b2Contact.prototype.GetNext = function () {
            return this.m_next;
        };
        b2Contact.prototype.GetFixtureA = function () {
            return this.m_fixtureA;
        };
        b2Contact.prototype.GetChildIndexA = function () {
            return this.m_indexA;
        };
        b2Contact.prototype.GetFixtureB = function () {
            return this.m_fixtureB;
        };
        b2Contact.prototype.GetChildIndexB = function () {
            return this.m_indexB;
        };
        b2Contact.prototype.Evaluate = function (manifold, xfA, xfB) {
        };
        b2Contact.prototype.FlagForFiltering = function () {
            this.m_flags |= b2ContactFlag.e_filterFlag;
        };
        b2Contact.prototype.SetFriction = function (friction) {
            this.m_friction = friction;
        };
        b2Contact.prototype.GetFriction = function () {
            return this.m_friction;
        };
        b2Contact.prototype.ResetFriction = function () {
            this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
        };
        b2Contact.prototype.SetRestitution = function (restitution) {
            this.m_restitution = restitution;
        };
        b2Contact.prototype.GetRestitution = function () {
            return this.m_restitution;
        };
        b2Contact.prototype.ResetRestitution = function () {
            this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
        };
        b2Contact.prototype.SetTangentSpeed = function (speed) {
            this.m_tangentSpeed = speed;
        };
        b2Contact.prototype.GetTangentSpeed = function () {
            return this.m_tangentSpeed;
        };
        b2Contact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            this.m_flags = b2ContactFlag.e_enabledFlag;
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
        };
        b2Contact.prototype.Update = function (listener) {
            var tManifold = this.m_oldManifold;
            this.m_oldManifold = this.m_manifold;
            this.m_manifold = tManifold;
            // Re-enable this contact.
            this.m_flags |= b2ContactFlag.e_enabledFlag;
            var touching = false;
            var wasTouching = (this.m_flags & b2ContactFlag.e_touchingFlag) === b2ContactFlag.e_touchingFlag;
            var sensorA = this.m_fixtureA.IsSensor();
            var sensorB = this.m_fixtureB.IsSensor();
            var sensor = sensorA || sensorB;
            var bodyA = this.m_fixtureA.GetBody();
            var bodyB = this.m_fixtureB.GetBody();
            var xfA = bodyA.GetTransform();
            var xfB = bodyB.GetTransform();
            // const aabbOverlap = b2TestOverlapAABB(this.m_fixtureA.GetAABB(0), this.m_fixtureB.GetAABB(0));
            // Is this contact a sensor?
            if (sensor) {
                // if (aabbOverlap)
                // {
                var shapeA = this.m_fixtureA.GetShape();
                var shapeB = this.m_fixtureB.GetShape();
                touching = box2d.b2TestOverlapShape(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
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
                for (var i = 0; i < this.m_manifold.pointCount; ++i) {
                    var mp2 = this.m_manifold.points[i];
                    mp2.normalImpulse = 0;
                    mp2.tangentImpulse = 0;
                    var id2 = mp2.id;
                    for (var j = 0; j < this.m_oldManifold.pointCount; ++j) {
                        var mp1 = this.m_oldManifold.points[j];
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
                this.m_flags |= b2ContactFlag.e_touchingFlag;
            }
            else {
                this.m_flags &= ~b2ContactFlag.e_touchingFlag;
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
        };
        b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
            var input = b2Contact.ComputeTOI_s_input;
            input.proxyA.SetShape(this.m_fixtureA.GetShape(), this.m_indexA);
            input.proxyB.SetShape(this.m_fixtureB.GetShape(), this.m_indexB);
            input.sweepA.Copy(sweepA);
            input.sweepB.Copy(sweepB);
            input.tMax = box2d.b2_linearSlop;
            var output = b2Contact.ComputeTOI_s_output;
            box2d.b2TimeOfImpact(output, input);
            return output.t;
        };
        b2Contact.ComputeTOI_s_input = new box2d.b2TOIInput();
        b2Contact.ComputeTOI_s_output = new box2d.b2TOIOutput();
        return b2Contact;
    }());
    box2d.b2Contact = b2Contact;
})(box2d || (box2d = {})); // namespace box2d
/// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
var box2d;
(function (box2d) {
    var b2CollideCircles_s_pA = new box2d.b2Vec2();
    var b2CollideCircles_s_pB = new box2d.b2Vec2();
    function b2CollideCircles(manifold, circleA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        var pA = box2d.b2MulXV(xfA, circleA.m_p, b2CollideCircles_s_pA);
        var pB = box2d.b2MulXV(xfB, circleB.m_p, b2CollideCircles_s_pB);
        var distSqr = box2d.b2DistanceSquaredVV(pA, pB);
        var radius = circleA.m_radius + circleB.m_radius;
        if (distSqr > radius * radius) {
            return;
        }
        manifold.type = box2d.b2ManifoldType.e_circles;
        manifold.localPoint.Copy(circleA.m_p);
        manifold.localNormal.SetZero();
        manifold.pointCount = 1;
        manifold.points[0].localPoint.Copy(circleB.m_p);
        manifold.points[0].id.key = 0;
    }
    box2d.b2CollideCircles = b2CollideCircles;
    var b2CollidePolygonAndCircle_s_c = new box2d.b2Vec2();
    var b2CollidePolygonAndCircle_s_cLocal = new box2d.b2Vec2();
    var b2CollidePolygonAndCircle_s_faceCenter = new box2d.b2Vec2();
    function b2CollidePolygonAndCircle(manifold, polygonA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle position in the frame of the polygon.
        var c = box2d.b2MulXV(xfB, circleB.m_p, b2CollidePolygonAndCircle_s_c);
        var cLocal = box2d.b2MulTXV(xfA, c, b2CollidePolygonAndCircle_s_cLocal);
        // Find the min separating edge.
        var normalIndex = 0;
        var separation = (-box2d.b2_maxFloat);
        var radius = polygonA.m_radius + circleB.m_radius;
        var vertexCount = polygonA.m_count;
        var vertices = polygonA.m_vertices;
        var normals = polygonA.m_normals;
        for (var i = 0; i < vertexCount; ++i) {
            var s = box2d.b2DotVV(normals[i], box2d.b2SubVV(cLocal, vertices[i], box2d.b2Vec2.s_t0));
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
        var vertIndex1 = normalIndex;
        var vertIndex2 = (vertIndex1 + 1) % vertexCount;
        var v1 = vertices[vertIndex1];
        var v2 = vertices[vertIndex2];
        // If the center is inside the polygon ...
        if (separation < box2d.b2_epsilon) {
            manifold.pointCount = 1;
            manifold.type = box2d.b2ManifoldType.e_faceA;
            manifold.localNormal.Copy(normals[normalIndex]);
            box2d.b2MidVV(v1, v2, manifold.localPoint);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
            return;
        }
        // Compute barycentric coordinates
        var u1 = box2d.b2DotVV(box2d.b2SubVV(cLocal, v1, box2d.b2Vec2.s_t0), box2d.b2SubVV(v2, v1, box2d.b2Vec2.s_t1));
        var u2 = box2d.b2DotVV(box2d.b2SubVV(cLocal, v2, box2d.b2Vec2.s_t0), box2d.b2SubVV(v1, v2, box2d.b2Vec2.s_t1));
        if (u1 <= 0) {
            if (box2d.b2DistanceSquaredVV(cLocal, v1) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = box2d.b2ManifoldType.e_faceA;
            box2d.b2SubVV(cLocal, v1, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v1);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else if (u2 <= 0) {
            if (box2d.b2DistanceSquaredVV(cLocal, v2) > radius * radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = box2d.b2ManifoldType.e_faceA;
            box2d.b2SubVV(cLocal, v2, manifold.localNormal).SelfNormalize();
            manifold.localPoint.Copy(v2);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
        else {
            var faceCenter = box2d.b2MidVV(v1, v2, b2CollidePolygonAndCircle_s_faceCenter);
            separation = box2d.b2DotVV(box2d.b2SubVV(cLocal, faceCenter, box2d.b2Vec2.s_t1), normals[vertIndex1]);
            if (separation > radius) {
                return;
            }
            manifold.pointCount = 1;
            manifold.type = box2d.b2ManifoldType.e_faceA;
            manifold.localNormal.Copy(normals[vertIndex1]).SelfNormalize();
            manifold.localPoint.Copy(faceCenter);
            manifold.points[0].localPoint.Copy(circleB.m_p);
            manifold.points[0].id.key = 0;
        }
    }
    box2d.b2CollidePolygonAndCircle = b2CollidePolygonAndCircle;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2WorldCallbacks.ts"/>
// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/b2TimeOfImpact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/b2CollideCircle.ts"/>
var box2d;
(function (box2d) {
    var b2CircleContact = (function (_super) {
        __extends(b2CircleContact, _super);
        function b2CircleContact() {
            _super.call(this); // base class constructor
        }
        b2CircleContact.Create = function (allocator) {
            return new b2CircleContact();
        };
        b2CircleContact.Destroy = function (contact, allocator) {
        };
        b2CircleContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            _super.prototype.Reset.call(this, fixtureA, indexA, fixtureB, indexB);
        };
        b2CircleContact.prototype.Evaluate = function (manifold, xfA, xfB) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeA instanceof box2d.b2CircleShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeB instanceof box2d.b2CircleShape);
            }
            box2d.b2CollideCircles(manifold, shapeA, xfA, shapeB, xfB);
        };
        return b2CircleContact;
    }(box2d.b2Contact));
    box2d.b2CircleContact = b2CircleContact;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/b2CollideCircle.ts"/>
var box2d;
(function (box2d) {
    var b2PolygonAndCircleContact = (function (_super) {
        __extends(b2PolygonAndCircleContact, _super);
        function b2PolygonAndCircleContact() {
            _super.call(this); // base class constructor
        }
        b2PolygonAndCircleContact.Create = function (allocator) {
            return new b2PolygonAndCircleContact();
        };
        b2PolygonAndCircleContact.Destroy = function (contact, allocator) {
        };
        b2PolygonAndCircleContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            _super.prototype.Reset.call(this, fixtureA, indexA, fixtureB, indexB);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureA.GetType() === box2d.b2ShapeType.e_polygonShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureB.GetType() === box2d.b2ShapeType.e_circleShape);
            }
        };
        b2PolygonAndCircleContact.prototype.Evaluate = function (manifold, xfA, xfB) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeA instanceof box2d.b2PolygonShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeB instanceof box2d.b2CircleShape);
            }
            box2d.b2CollidePolygonAndCircle(manifold, shapeA, xfA, shapeB, xfB);
        };
        return b2PolygonAndCircleContact;
    }(box2d.b2Contact));
    box2d.b2PolygonAndCircleContact = b2PolygonAndCircleContact;
})(box2d || (box2d = {})); // namespace box2d
/// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
var box2d;
(function (box2d) {
    var b2EdgeSeparation_s_normal1World = new box2d.b2Vec2();
    var b2EdgeSeparation_s_normal1 = new box2d.b2Vec2();
    var b2EdgeSeparation_s_v1 = new box2d.b2Vec2();
    var b2EdgeSeparation_s_v2 = new box2d.b2Vec2();
    function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
        var count1 = poly1.m_count;
        var vertices1 = poly1.m_vertices;
        var normals1 = poly1.m_normals;
        var count2 = poly2.m_count;
        var vertices2 = poly2.m_vertices;
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(0 <= edge1 && edge1 < count1);
        }
        // Convert normal from poly1's frame into poly2's frame.
        var normal1World = box2d.b2MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
        var normal1 = box2d.b2MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);
        // Find support vertex on poly2 for -normal.
        var index = 0;
        var minDot = box2d.b2_maxFloat;
        for (var i = 0; i < count2; ++i) {
            var dot = box2d.b2DotVV(vertices2[i], normal1);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        var v1 = box2d.b2MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
        var v2 = box2d.b2MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
        var separation = box2d.b2DotVV(box2d.b2SubVV(v2, v1, box2d.b2Vec2.s_t0), normal1World);
        return separation;
    }
    box2d.b2EdgeSeparation = b2EdgeSeparation;
    var b2FindMaxSeparation_s_d = new box2d.b2Vec2();
    var b2FindMaxSeparation_s_dLocal1 = new box2d.b2Vec2();
    function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
        var count1 = poly1.m_count;
        var normals1 = poly1.m_normals;
        // Vector pointing from the centroid of poly1 to the centroid of poly2.
        var d = box2d.b2SubVV(box2d.b2MulXV(xf2, poly2.m_centroid, box2d.b2Vec2.s_t0), box2d.b2MulXV(xf1, poly1.m_centroid, box2d.b2Vec2.s_t1), b2FindMaxSeparation_s_d);
        var dLocal1 = box2d.b2MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);
        // Find edge normal on poly1 that has the largest projection onto d.
        var edge = 0;
        var maxDot = (-box2d.b2_maxFloat);
        for (var i = 0; i < count1; ++i) {
            var dot = box2d.b2DotVV(normals1[i], dLocal1);
            if (dot > maxDot) {
                maxDot = dot;
                edge = i;
            }
        }
        // Get the separation for the edge normal.
        var s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);
        // Check the separation for the previous edge normal.
        var prevEdge = (edge + count1 - 1) % count1;
        var sPrev = b2EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
        // Check the separation for the next edge normal.
        var nextEdge = (edge + 1) % count1;
        var sNext = b2EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
        // Find the best edge and the search direction.
        var bestEdge = 0;
        var bestSeparation = 0;
        var increment = 0;
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
    box2d.b2FindMaxSeparation = b2FindMaxSeparation;
    var b2FindIncidentEdge_s_normal1 = new box2d.b2Vec2();
    function b2FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
        var count1 = poly1.m_count;
        var normals1 = poly1.m_normals;
        var count2 = poly2.m_count;
        var vertices2 = poly2.m_vertices;
        var normals2 = poly2.m_normals;
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(0 <= edge1 && edge1 < count1);
        }
        // Get the normal of the reference edge in poly2's frame.
        var normal1 = box2d.b2MulTRV(xf2.q, box2d.b2MulRV(xf1.q, normals1[edge1], box2d.b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);
        // Find the incident edge on poly2.
        var index = 0;
        var minDot = box2d.b2_maxFloat;
        for (var i = 0; i < count2; ++i) {
            var dot = box2d.b2DotVV(normal1, normals2[i]);
            if (dot < minDot) {
                minDot = dot;
                index = i;
            }
        }
        // Build the clip vertices for the incident edge.
        var i1 = index;
        var i2 = (i1 + 1) % count2;
        var c0 = c[0];
        box2d.b2MulXV(xf2, vertices2[i1], c0.v);
        var cf0 = c0.id.cf;
        cf0.indexA = edge1;
        cf0.indexB = i1;
        cf0.typeA = box2d.b2ContactFeatureType.e_face;
        cf0.typeB = box2d.b2ContactFeatureType.e_vertex;
        var c1 = c[1];
        box2d.b2MulXV(xf2, vertices2[i2], c1.v);
        var cf1 = c1.id.cf;
        cf1.indexA = edge1;
        cf1.indexB = i2;
        cf1.typeA = box2d.b2ContactFeatureType.e_face;
        cf1.typeB = box2d.b2ContactFeatureType.e_vertex;
    }
    box2d.b2FindIncidentEdge = b2FindIncidentEdge;
    var b2CollidePolygons_s_incidentEdge = box2d.b2ClipVertex.MakeArray(2);
    var b2CollidePolygons_s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
    var b2CollidePolygons_s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
    var b2CollidePolygons_s_edgeA = box2d.b2MakeNumberArray(1);
    var b2CollidePolygons_s_edgeB = box2d.b2MakeNumberArray(1);
    var b2CollidePolygons_s_localTangent = new box2d.b2Vec2();
    var b2CollidePolygons_s_localNormal = new box2d.b2Vec2();
    var b2CollidePolygons_s_planePoint = new box2d.b2Vec2();
    var b2CollidePolygons_s_normal = new box2d.b2Vec2();
    var b2CollidePolygons_s_tangent = new box2d.b2Vec2();
    var b2CollidePolygons_s_ntangent = new box2d.b2Vec2();
    var b2CollidePolygons_s_v11 = new box2d.b2Vec2();
    var b2CollidePolygons_s_v12 = new box2d.b2Vec2();
    function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
        manifold.pointCount = 0;
        var totalRadius = polyA.m_radius + polyB.m_radius;
        var edgeA = b2CollidePolygons_s_edgeA;
        edgeA[0] = 0;
        var separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
        if (separationA > totalRadius)
            return;
        var edgeB = b2CollidePolygons_s_edgeB;
        edgeB[0] = 0;
        var separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
        if (separationB > totalRadius)
            return;
        var poly1; // reference polygon
        var poly2; // incident polygon
        var xf1, xf2;
        var edge1 = 0; // reference edge
        var flip = 0;
        var k_relativeTol = 0.98;
        var k_absoluteTol = 0.001;
        if (separationB > k_relativeTol * separationA + k_absoluteTol) {
            poly1 = polyB;
            poly2 = polyA;
            xf1 = xfB;
            xf2 = xfA;
            edge1 = edgeB[0];
            manifold.type = box2d.b2ManifoldType.e_faceB;
            flip = 1;
        }
        else {
            poly1 = polyA;
            poly2 = polyB;
            xf1 = xfA;
            xf2 = xfB;
            edge1 = edgeA[0];
            manifold.type = box2d.b2ManifoldType.e_faceA;
            flip = 0;
        }
        var incidentEdge = b2CollidePolygons_s_incidentEdge;
        b2FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
        var count1 = poly1.m_count;
        var vertices1 = poly1.m_vertices;
        var iv1 = edge1;
        var iv2 = (edge1 + 1) % count1;
        var local_v11 = vertices1[iv1];
        var local_v12 = vertices1[iv2];
        var localTangent = box2d.b2SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
        localTangent.Normalize();
        var localNormal = box2d.b2CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
        var planePoint = box2d.b2MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);
        var tangent = box2d.b2MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
        var normal = box2d.b2CrossVOne(tangent, b2CollidePolygons_s_normal);
        var v11 = box2d.b2MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
        var v12 = box2d.b2MulXV(xf1, local_v12, b2CollidePolygons_s_v12);
        // Face offset.
        var frontOffset = box2d.b2DotVV(normal, v11);
        // Side offsets, extended by polytope skin thickness.
        var sideOffset1 = -box2d.b2DotVV(tangent, v11) + totalRadius;
        var sideOffset2 = box2d.b2DotVV(tangent, v12) + totalRadius;
        // Clip incident edge against extruded edge1 side edges.
        var clipPoints1 = b2CollidePolygons_s_clipPoints1;
        var clipPoints2 = b2CollidePolygons_s_clipPoints2;
        var np;
        // Clip to box side 1
        var ntangent = box2d.b2NegV(tangent, b2CollidePolygons_s_ntangent);
        np = box2d.b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
        if (np < 2)
            return;
        // Clip to negative box side 1
        np = box2d.b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
        if (np < 2) {
            return;
        }
        // Now clipPoints2 contains the clipped points.
        manifold.localNormal.Copy(localNormal);
        manifold.localPoint.Copy(planePoint);
        var pointCount = 0;
        for (var i = 0; i < box2d.b2_maxManifoldPoints; ++i) {
            var cv = clipPoints2[i];
            var separation = box2d.b2DotVV(normal, cv.v) - frontOffset;
            if (separation <= totalRadius) {
                var cp = manifold.points[pointCount];
                box2d.b2MulTXV(xf2, cv.v, cp.localPoint);
                cp.id.Copy(cv.id);
                if (flip) {
                    // Swap features
                    var cf = cp.id.cf;
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
    box2d.b2CollidePolygons = b2CollidePolygons;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/b2TimeOfImpact.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
// <reference path=""../../../../Box2D/Box2D/Dynamics/b2WorldCallbacks.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/b2CollidePolygon.ts"/>
var box2d;
(function (box2d) {
    var b2PolygonContact = (function (_super) {
        __extends(b2PolygonContact, _super);
        function b2PolygonContact() {
            _super.call(this); // base class constructor
        }
        b2PolygonContact.Create = function (allocator) {
            return new b2PolygonContact();
        };
        b2PolygonContact.Destroy = function (contact, allocator) {
        };
        b2PolygonContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            _super.prototype.Reset.call(this, fixtureA, indexA, fixtureB, indexB);
        };
        b2PolygonContact.prototype.Evaluate = function (manifold, xfA, xfB) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeA instanceof box2d.b2PolygonShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeB instanceof box2d.b2PolygonShape);
            }
            box2d.b2CollidePolygons(manifold, shapeA, xfA, shapeB, xfB);
        };
        return b2PolygonContact;
    }(box2d.b2Contact));
    box2d.b2PolygonContact = b2PolygonContact;
})(box2d || (box2d = {})); // namespace box2d
/// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
var box2d;
(function (box2d) {
    var b2CollideEdgeAndCircle_s_Q = new box2d.b2Vec2();
    var b2CollideEdgeAndCircle_s_e = new box2d.b2Vec2();
    var b2CollideEdgeAndCircle_s_d = new box2d.b2Vec2();
    var b2CollideEdgeAndCircle_s_e1 = new box2d.b2Vec2();
    var b2CollideEdgeAndCircle_s_e2 = new box2d.b2Vec2();
    var b2CollideEdgeAndCircle_s_P = new box2d.b2Vec2();
    var b2CollideEdgeAndCircle_s_n = new box2d.b2Vec2();
    var b2CollideEdgeAndCircle_s_id = new box2d.b2ContactID();
    function b2CollideEdgeAndCircle(manifold, edgeA, xfA, circleB, xfB) {
        manifold.pointCount = 0;
        // Compute circle in frame of edge
        var Q = box2d.b2MulTXV(xfA, box2d.b2MulXV(xfB, circleB.m_p, box2d.b2Vec2.s_t0), b2CollideEdgeAndCircle_s_Q);
        var A = edgeA.m_vertex1;
        var B = edgeA.m_vertex2;
        var e = box2d.b2SubVV(B, A, b2CollideEdgeAndCircle_s_e);
        // Barycentric coordinates
        var u = box2d.b2DotVV(e, box2d.b2SubVV(B, Q, box2d.b2Vec2.s_t0));
        var v = box2d.b2DotVV(e, box2d.b2SubVV(Q, A, box2d.b2Vec2.s_t0));
        var radius = edgeA.m_radius + circleB.m_radius;
        // const cf: b2ContactFeature = new b2ContactFeature();
        var id = b2CollideEdgeAndCircle_s_id;
        id.cf.indexB = 0;
        id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
        // Region A
        if (v <= 0) {
            var P_1 = A;
            var d_1 = box2d.b2SubVV(Q, P_1, b2CollideEdgeAndCircle_s_d);
            var dd_1 = box2d.b2DotVV(d_1, d_1);
            if (dd_1 > radius * radius) {
                return;
            }
            // Is there an edge connected to A?
            if (edgeA.m_hasVertex0) {
                var A1 = edgeA.m_vertex0;
                var B1 = A;
                var e1 = box2d.b2SubVV(B1, A1, b2CollideEdgeAndCircle_s_e1);
                var u1 = box2d.b2DotVV(e1, box2d.b2SubVV(B1, Q, box2d.b2Vec2.s_t0));
                // Is the circle in Region AB of the previous edge?
                if (u1 > 0) {
                    return;
                }
            }
            id.cf.indexA = 0;
            id.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = box2d.b2ManifoldType.e_circles;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P_1);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region B
        if (u <= 0) {
            var P_2 = B;
            var d_2 = box2d.b2SubVV(Q, P_2, b2CollideEdgeAndCircle_s_d);
            var dd_2 = box2d.b2DotVV(d_2, d_2);
            if (dd_2 > radius * radius) {
                return;
            }
            // Is there an edge connected to B?
            if (edgeA.m_hasVertex3) {
                var B2 = edgeA.m_vertex3;
                var A2 = B;
                var e2 = box2d.b2SubVV(B2, A2, b2CollideEdgeAndCircle_s_e2);
                var v2 = box2d.b2DotVV(e2, box2d.b2SubVV(Q, A2, box2d.b2Vec2.s_t0));
                // Is the circle in Region AB of the next edge?
                if (v2 > 0) {
                    return;
                }
            }
            id.cf.indexA = 1;
            id.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
            manifold.pointCount = 1;
            manifold.type = box2d.b2ManifoldType.e_circles;
            manifold.localNormal.SetZero();
            manifold.localPoint.Copy(P_2);
            manifold.points[0].id.Copy(id);
            // manifold.points[0].id.key = 0;
            // manifold.points[0].id.cf = cf;
            manifold.points[0].localPoint.Copy(circleB.m_p);
            return;
        }
        // Region AB
        var den = box2d.b2DotVV(e, e);
        if (box2d.ENABLE_ASSERTS) {
            box2d.b2Assert(den > 0);
        }
        var P = b2CollideEdgeAndCircle_s_P;
        P.x = (1 / den) * (u * A.x + v * B.x);
        P.y = (1 / den) * (u * A.y + v * B.y);
        var d = box2d.b2SubVV(Q, P, b2CollideEdgeAndCircle_s_d);
        var dd = box2d.b2DotVV(d, d);
        if (dd > radius * radius) {
            return;
        }
        var n = b2CollideEdgeAndCircle_s_n.SetXY(-e.y, e.x);
        if (box2d.b2DotVV(n, box2d.b2SubVV(Q, A, box2d.b2Vec2.s_t0)) < 0) {
            n.SetXY(-n.x, -n.y);
        }
        n.Normalize();
        id.cf.indexA = 0;
        id.cf.typeA = box2d.b2ContactFeatureType.e_face;
        manifold.pointCount = 1;
        manifold.type = box2d.b2ManifoldType.e_faceA;
        manifold.localNormal.Copy(n);
        manifold.localPoint.Copy(A);
        manifold.points[0].id.Copy(id);
        // manifold.points[0].id.key = 0;
        // manifold.points[0].id.cf = cf;
        manifold.points[0].localPoint.Copy(circleB.m_p);
    }
    box2d.b2CollideEdgeAndCircle = b2CollideEdgeAndCircle;
    (function (b2EPAxisType) {
        b2EPAxisType[b2EPAxisType["e_unknown"] = 0] = "e_unknown";
        b2EPAxisType[b2EPAxisType["e_edgeA"] = 1] = "e_edgeA";
        b2EPAxisType[b2EPAxisType["e_edgeB"] = 2] = "e_edgeB";
    })(box2d.b2EPAxisType || (box2d.b2EPAxisType = {}));
    var b2EPAxisType = box2d.b2EPAxisType;
    var b2EPAxis = (function () {
        function b2EPAxis() {
            this.type = b2EPAxisType.e_unknown;
            this.index = 0;
            this.separation = 0;
        }
        return b2EPAxis;
    }());
    box2d.b2EPAxis = b2EPAxis;
    var b2TempPolygon = (function () {
        function b2TempPolygon() {
            this.vertices = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
            this.normals = box2d.b2Vec2.MakeArray(box2d.b2_maxPolygonVertices);
            this.count = 0;
        }
        return b2TempPolygon;
    }());
    box2d.b2TempPolygon = b2TempPolygon;
    var b2ReferenceFace = (function () {
        function b2ReferenceFace() {
            this.i1 = 0;
            this.i2 = 0;
            this.v1 = new box2d.b2Vec2();
            this.v2 = new box2d.b2Vec2();
            this.normal = new box2d.b2Vec2();
            this.sideNormal1 = new box2d.b2Vec2();
            this.sideOffset1 = 0;
            this.sideNormal2 = new box2d.b2Vec2();
            this.sideOffset2 = 0;
        }
        return b2ReferenceFace;
    }());
    box2d.b2ReferenceFace = b2ReferenceFace;
    (function (b2EPColliderVertexType) {
        b2EPColliderVertexType[b2EPColliderVertexType["e_isolated"] = 0] = "e_isolated";
        b2EPColliderVertexType[b2EPColliderVertexType["e_concave"] = 1] = "e_concave";
        b2EPColliderVertexType[b2EPColliderVertexType["e_convex"] = 2] = "e_convex";
    })(box2d.b2EPColliderVertexType || (box2d.b2EPColliderVertexType = {}));
    var b2EPColliderVertexType = box2d.b2EPColliderVertexType;
    var b2EPCollider = (function () {
        function b2EPCollider() {
            this.m_polygonB = new b2TempPolygon();
            this.m_xf = new box2d.b2Transform();
            this.m_centroidB = new box2d.b2Vec2();
            this.m_v0 = new box2d.b2Vec2();
            this.m_v1 = new box2d.b2Vec2();
            this.m_v2 = new box2d.b2Vec2();
            this.m_v3 = new box2d.b2Vec2();
            this.m_normal0 = new box2d.b2Vec2();
            this.m_normal1 = new box2d.b2Vec2();
            this.m_normal2 = new box2d.b2Vec2();
            this.m_normal = new box2d.b2Vec2();
            this.m_type1 = b2EPColliderVertexType.e_isolated;
            this.m_type2 = b2EPColliderVertexType.e_isolated;
            this.m_lowerLimit = new box2d.b2Vec2();
            this.m_upperLimit = new box2d.b2Vec2();
            this.m_radius = 0;
            this.m_front = false;
        }
        b2EPCollider.prototype.Collide = function (manifold, edgeA, xfA, polygonB, xfB) {
            box2d.b2MulTXX(xfA, xfB, this.m_xf);
            box2d.b2MulXV(this.m_xf, polygonB.m_centroid, this.m_centroidB);
            this.m_v0.Copy(edgeA.m_vertex0);
            this.m_v1.Copy(edgeA.m_vertex1);
            this.m_v2.Copy(edgeA.m_vertex2);
            this.m_v3.Copy(edgeA.m_vertex3);
            var hasVertex0 = edgeA.m_hasVertex0;
            var hasVertex3 = edgeA.m_hasVertex3;
            var edge1 = box2d.b2SubVV(this.m_v2, this.m_v1, b2EPCollider.s_edge1);
            edge1.Normalize();
            this.m_normal1.SetXY(edge1.y, -edge1.x);
            var offset1 = box2d.b2DotVV(this.m_normal1, box2d.b2SubVV(this.m_centroidB, this.m_v1, box2d.b2Vec2.s_t0));
            var offset0 = 0;
            var offset2 = 0;
            var convex1 = false;
            var convex2 = false;
            // Is there a preceding edge?
            if (hasVertex0) {
                var edge0 = box2d.b2SubVV(this.m_v1, this.m_v0, b2EPCollider.s_edge0);
                edge0.Normalize();
                this.m_normal0.SetXY(edge0.y, -edge0.x);
                convex1 = box2d.b2CrossVV(edge0, edge1) >= 0;
                offset0 = box2d.b2DotVV(this.m_normal0, box2d.b2SubVV(this.m_centroidB, this.m_v0, box2d.b2Vec2.s_t0));
            }
            // Is there a following edge?
            if (hasVertex3) {
                var edge2 = box2d.b2SubVV(this.m_v3, this.m_v2, b2EPCollider.s_edge2);
                edge2.Normalize();
                this.m_normal2.SetXY(edge2.y, -edge2.x);
                convex2 = box2d.b2CrossVV(edge1, edge2) > 0;
                offset2 = box2d.b2DotVV(this.m_normal2, box2d.b2SubVV(this.m_centroidB, this.m_v2, box2d.b2Vec2.s_t0));
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
            for (var i = 0, ict = polygonB.m_count; i < ict; ++i) {
                box2d.b2MulXV(this.m_xf, polygonB.m_vertices[i], this.m_polygonB.vertices[i]);
                box2d.b2MulRV(this.m_xf.q, polygonB.m_normals[i], this.m_polygonB.normals[i]);
            }
            this.m_radius = 2 * box2d.b2_polygonRadius;
            manifold.pointCount = 0;
            var edgeAxis = this.ComputeEdgeSeparation(b2EPCollider.s_edgeAxis);
            // If no valid normal can be found than this edge should not collide.
            if (edgeAxis.type === b2EPAxisType.e_unknown) {
                return;
            }
            if (edgeAxis.separation > this.m_radius) {
                return;
            }
            var polygonAxis = this.ComputePolygonSeparation(b2EPCollider.s_polygonAxis);
            if (polygonAxis.type !== b2EPAxisType.e_unknown && polygonAxis.separation > this.m_radius) {
                return;
            }
            // Use hysteresis for jitter reduction.
            var k_relativeTol = 0.98;
            var k_absoluteTol = 0.001;
            var primaryAxis;
            if (polygonAxis.type === b2EPAxisType.e_unknown) {
                primaryAxis = edgeAxis;
            }
            else if (polygonAxis.separation > k_relativeTol * edgeAxis.separation + k_absoluteTol) {
                primaryAxis = polygonAxis;
            }
            else {
                primaryAxis = edgeAxis;
            }
            var ie = b2EPCollider.s_ie;
            var rf = b2EPCollider.s_rf;
            if (primaryAxis.type === b2EPAxisType.e_edgeA) {
                manifold.type = box2d.b2ManifoldType.e_faceA;
                // Search for the polygon normal that is most anti-parallel to the edge normal.
                var bestIndex = 0;
                var bestValue = box2d.b2DotVV(this.m_normal, this.m_polygonB.normals[0]);
                for (var i = 1, ict = this.m_polygonB.count; i < ict; ++i) {
                    var value = box2d.b2DotVV(this.m_normal, this.m_polygonB.normals[i]);
                    if (value < bestValue) {
                        bestValue = value;
                        bestIndex = i;
                    }
                }
                var i1 = bestIndex;
                var i2 = (i1 + 1) % this.m_polygonB.count;
                var ie0 = ie[0];
                ie0.v.Copy(this.m_polygonB.vertices[i1]);
                ie0.id.cf.indexA = 0;
                ie0.id.cf.indexB = i1;
                ie0.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
                ie0.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
                var ie1 = ie[1];
                ie1.v.Copy(this.m_polygonB.vertices[i2]);
                ie1.id.cf.indexA = 0;
                ie1.id.cf.indexB = i2;
                ie1.id.cf.typeA = box2d.b2ContactFeatureType.e_face;
                ie1.id.cf.typeB = box2d.b2ContactFeatureType.e_vertex;
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
                manifold.type = box2d.b2ManifoldType.e_faceB;
                var ie0 = ie[0];
                ie0.v.Copy(this.m_v1);
                ie0.id.cf.indexA = 0;
                ie0.id.cf.indexB = primaryAxis.index;
                ie0.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
                ie0.id.cf.typeB = box2d.b2ContactFeatureType.e_face;
                var ie1 = ie[1];
                ie1.v.Copy(this.m_v2);
                ie1.id.cf.indexA = 0;
                ie1.id.cf.indexB = primaryAxis.index;
                ie1.id.cf.typeA = box2d.b2ContactFeatureType.e_vertex;
                ie1.id.cf.typeB = box2d.b2ContactFeatureType.e_face;
                rf.i1 = primaryAxis.index;
                rf.i2 = (rf.i1 + 1) % this.m_polygonB.count;
                rf.v1.Copy(this.m_polygonB.vertices[rf.i1]);
                rf.v2.Copy(this.m_polygonB.vertices[rf.i2]);
                rf.normal.Copy(this.m_polygonB.normals[rf.i1]);
            }
            rf.sideNormal1.SetXY(rf.normal.y, -rf.normal.x);
            rf.sideNormal2.Copy(rf.sideNormal1).SelfNeg();
            rf.sideOffset1 = box2d.b2DotVV(rf.sideNormal1, rf.v1);
            rf.sideOffset2 = box2d.b2DotVV(rf.sideNormal2, rf.v2);
            // Clip incident edge against extruded edge1 side edges.
            var clipPoints1 = b2EPCollider.s_clipPoints1;
            var clipPoints2 = b2EPCollider.s_clipPoints2;
            var np = 0;
            // Clip to box side 1
            np = box2d.b2ClipSegmentToLine(clipPoints1, ie, rf.sideNormal1, rf.sideOffset1, rf.i1);
            if (np < box2d.b2_maxManifoldPoints) {
                return;
            }
            // Clip to negative box side 1
            np = box2d.b2ClipSegmentToLine(clipPoints2, clipPoints1, rf.sideNormal2, rf.sideOffset2, rf.i2);
            if (np < box2d.b2_maxManifoldPoints) {
                return;
            }
            // Now clipPoints2 contains the clipped points.
            if (primaryAxis.type === b2EPAxisType.e_edgeA) {
                manifold.localNormal.Copy(rf.normal);
                manifold.localPoint.Copy(rf.v1);
            }
            else {
                manifold.localNormal.Copy(polygonB.m_normals[rf.i1]);
                manifold.localPoint.Copy(polygonB.m_vertices[rf.i1]);
            }
            var pointCount = 0;
            for (var i = 0, ict = box2d.b2_maxManifoldPoints; i < ict; ++i) {
                var separation = void 0;
                separation = box2d.b2DotVV(rf.normal, box2d.b2SubVV(clipPoints2[i].v, rf.v1, box2d.b2Vec2.s_t0));
                if (separation <= this.m_radius) {
                    var cp = manifold.points[pointCount];
                    if (primaryAxis.type === b2EPAxisType.e_edgeA) {
                        box2d.b2MulTXV(this.m_xf, clipPoints2[i].v, cp.localPoint);
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
        };
        b2EPCollider.prototype.ComputeEdgeSeparation = function (out) {
            var axis = out;
            axis.type = b2EPAxisType.e_edgeA;
            axis.index = this.m_front ? 0 : 1;
            axis.separation = box2d.b2_maxFloat;
            for (var i = 0, ict = this.m_polygonB.count; i < ict; ++i) {
                var s = box2d.b2DotVV(this.m_normal, box2d.b2SubVV(this.m_polygonB.vertices[i], this.m_v1, box2d.b2Vec2.s_t0));
                if (s < axis.separation) {
                    axis.separation = s;
                }
            }
            return axis;
        };
        b2EPCollider.prototype.ComputePolygonSeparation = function (out) {
            var axis = out;
            axis.type = b2EPAxisType.e_unknown;
            axis.index = -1;
            axis.separation = -box2d.b2_maxFloat;
            var perp = b2EPCollider.s_perp.SetXY(-this.m_normal.y, this.m_normal.x);
            for (var i = 0, ict = this.m_polygonB.count; i < ict; ++i) {
                var n = box2d.b2NegV(this.m_polygonB.normals[i], b2EPCollider.s_n);
                var s1 = box2d.b2DotVV(n, box2d.b2SubVV(this.m_polygonB.vertices[i], this.m_v1, box2d.b2Vec2.s_t0));
                var s2 = box2d.b2DotVV(n, box2d.b2SubVV(this.m_polygonB.vertices[i], this.m_v2, box2d.b2Vec2.s_t0));
                var s = box2d.b2Min(s1, s2);
                if (s > this.m_radius) {
                    // No collision
                    axis.type = b2EPAxisType.e_edgeB;
                    axis.index = i;
                    axis.separation = s;
                    return axis;
                }
                // Adjacency
                if (box2d.b2DotVV(n, perp) >= 0) {
                    if (box2d.b2DotVV(box2d.b2SubVV(n, this.m_upperLimit, box2d.b2Vec2.s_t0), this.m_normal) < -box2d.b2_angularSlop) {
                        continue;
                    }
                }
                else {
                    if (box2d.b2DotVV(box2d.b2SubVV(n, this.m_lowerLimit, box2d.b2Vec2.s_t0), this.m_normal) < -box2d.b2_angularSlop) {
                        continue;
                    }
                }
                if (s > axis.separation) {
                    axis.type = b2EPAxisType.e_edgeB;
                    axis.index = i;
                    axis.separation = s;
                }
            }
            return axis;
        };
        b2EPCollider.s_edge1 = new box2d.b2Vec2();
        b2EPCollider.s_edge0 = new box2d.b2Vec2();
        b2EPCollider.s_edge2 = new box2d.b2Vec2();
        b2EPCollider.s_ie = box2d.b2ClipVertex.MakeArray(2);
        b2EPCollider.s_rf = new b2ReferenceFace();
        b2EPCollider.s_clipPoints1 = box2d.b2ClipVertex.MakeArray(2);
        b2EPCollider.s_clipPoints2 = box2d.b2ClipVertex.MakeArray(2);
        b2EPCollider.s_edgeAxis = new b2EPAxis();
        b2EPCollider.s_polygonAxis = new b2EPAxis();
        b2EPCollider.s_n = new box2d.b2Vec2();
        b2EPCollider.s_perp = new box2d.b2Vec2();
        return b2EPCollider;
    }());
    box2d.b2EPCollider = b2EPCollider;
    var b2CollideEdgeAndPolygon_s_collider = new b2EPCollider();
    function b2CollideEdgeAndPolygon(manifold, edgeA, xfA, polygonB, xfB) {
        var collider = b2CollideEdgeAndPolygon_s_collider;
        collider.Collide(manifold, edgeA, xfA, polygonB, xfB);
    }
    box2d.b2CollideEdgeAndPolygon = b2CollideEdgeAndPolygon;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/b2CollideEdge.ts"/>
var box2d;
(function (box2d) {
    var b2EdgeAndCircleContact = (function (_super) {
        __extends(b2EdgeAndCircleContact, _super);
        function b2EdgeAndCircleContact() {
            _super.call(this); // base class constructor
        }
        b2EdgeAndCircleContact.Create = function (allocator) {
            return new b2EdgeAndCircleContact();
        };
        b2EdgeAndCircleContact.Destroy = function (contact, allocator) {
        };
        b2EdgeAndCircleContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            _super.prototype.Reset.call(this, fixtureA, indexA, fixtureB, indexB);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureA.GetType() === box2d.b2ShapeType.e_edgeShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureB.GetType() === box2d.b2ShapeType.e_circleShape);
            }
        };
        b2EdgeAndCircleContact.prototype.Evaluate = function (manifold, xfA, xfB) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeA instanceof box2d.b2EdgeShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeB instanceof box2d.b2CircleShape);
            }
            box2d.b2CollideEdgeAndCircle(manifold, shapeA, xfA, shapeB, xfB);
        };
        return b2EdgeAndCircleContact;
    }(box2d.b2Contact));
    box2d.b2EdgeAndCircleContact = b2EdgeAndCircleContact;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
var box2d;
(function (box2d) {
    var b2EdgeAndPolygonContact = (function (_super) {
        __extends(b2EdgeAndPolygonContact, _super);
        function b2EdgeAndPolygonContact() {
            _super.call(this); // base class constructor
        }
        b2EdgeAndPolygonContact.Create = function (allocator) {
            return new b2EdgeAndPolygonContact();
        };
        b2EdgeAndPolygonContact.Destroy = function (contact, allocator) {
        };
        b2EdgeAndPolygonContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            _super.prototype.Reset.call(this, fixtureA, indexA, fixtureB, indexB);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureA.GetType() === box2d.b2ShapeType.e_edgeShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureB.GetType() === box2d.b2ShapeType.e_polygonShape);
            }
        };
        b2EdgeAndPolygonContact.prototype.Evaluate = function (manifold, xfA, xfB) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeA instanceof box2d.b2EdgeShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeB instanceof box2d.b2PolygonShape);
            }
            box2d.b2CollideEdgeAndPolygon(manifold, shapeA, xfA, shapeB, xfB);
        };
        return b2EdgeAndPolygonContact;
    }(box2d.b2Contact));
    box2d.b2EdgeAndPolygonContact = b2EdgeAndPolygonContact;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2ChainShape.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
var box2d;
(function (box2d) {
    var b2ChainAndCircleContact = (function (_super) {
        __extends(b2ChainAndCircleContact, _super);
        function b2ChainAndCircleContact() {
            _super.call(this); // base class constructor
        }
        b2ChainAndCircleContact.Create = function (allocator) {
            return new b2ChainAndCircleContact();
        };
        b2ChainAndCircleContact.Destroy = function (contact, allocator) {
        };
        b2ChainAndCircleContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            _super.prototype.Reset.call(this, fixtureA, indexA, fixtureB, indexB);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureA.GetType() === box2d.b2ShapeType.e_chainShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureB.GetType() === box2d.b2ShapeType.e_circleShape);
            }
        };
        b2ChainAndCircleContact.prototype.Evaluate = function (manifold, xfA, xfB) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeA instanceof box2d.b2ChainShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeB instanceof box2d.b2CircleShape);
            }
            var chain = shapeA;
            var edge = b2ChainAndCircleContact.Evaluate_s_edge;
            chain.GetChildEdge(edge, this.m_indexA);
            box2d.b2CollideEdgeAndCircle(manifold, edge, xfA, shapeB, xfB);
        };
        b2ChainAndCircleContact.Evaluate_s_edge = new box2d.b2EdgeShape();
        return b2ChainAndCircleContact;
    }(box2d.b2Contact));
    box2d.b2ChainAndCircleContact = b2ChainAndCircleContact;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2ChainShape.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
var box2d;
(function (box2d) {
    var b2ChainAndPolygonContact = (function (_super) {
        __extends(b2ChainAndPolygonContact, _super);
        function b2ChainAndPolygonContact() {
            _super.call(this); // base class constructor
        }
        b2ChainAndPolygonContact.Create = function (allocator) {
            return new b2ChainAndPolygonContact();
        };
        b2ChainAndPolygonContact.Destroy = function (contact, allocator) {
        };
        b2ChainAndPolygonContact.prototype.Reset = function (fixtureA, indexA, fixtureB, indexB) {
            _super.prototype.Reset.call(this, fixtureA, indexA, fixtureB, indexB);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureA.GetType() === box2d.b2ShapeType.e_chainShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixtureB.GetType() === box2d.b2ShapeType.e_polygonShape);
            }
        };
        b2ChainAndPolygonContact.prototype.Evaluate = function (manifold, xfA, xfB) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeA instanceof box2d.b2ChainShape);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(shapeB instanceof box2d.b2PolygonShape);
            }
            var chain = shapeA;
            var edge = b2ChainAndPolygonContact.Evaluate_s_edge;
            chain.GetChildEdge(edge, this.m_indexA);
            box2d.b2CollideEdgeAndPolygon(manifold, edge, xfA, shapeB, xfB);
        };
        b2ChainAndPolygonContact.Evaluate_s_edge = new box2d.b2EdgeShape();
        return b2ChainAndPolygonContact;
    }(box2d.b2Contact));
    box2d.b2ChainAndPolygonContact = b2ChainAndPolygonContact;
})(box2d || (box2d = {})); // namespace box2d
// <reference path="../../../../Box2D/Box2D/Common/b2Math.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/b2Collision.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2CircleContact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2PolygonContact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2ChainAndCircleContact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2ContactSolver.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/b2Collision.ts"/>
// <reference path="../../../../Box2D/Box2D/Collision/b2TimeOfImpact.ts"/>
// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2World.ts"/>
var box2d;
(function (box2d) {
    var b2ContactRegister = (function () {
        function b2ContactRegister() {
            this.pool = null;
            this.createFcn = null;
            this.destroyFcn = null;
            this.primary = false;
        }
        return b2ContactRegister;
    }());
    box2d.b2ContactRegister = b2ContactRegister;
    var b2ContactFactory = (function () {
        function b2ContactFactory(allocator) {
            this.m_allocator = null;
            this.m_allocator = allocator;
            this.InitializeRegisters();
        }
        b2ContactFactory.prototype.AddType = function (createFcn, destroyFcn, type1, type2) {
            {
                var that_1 = this;
                var pool_1 = box2d.b2MakeArray(256, function (i) { return createFcn(that_1.m_allocator); }); // TODO: b2Settings
                var poolCreateFcn = function (allocator) {
                    if (pool_1.length > 0) {
                        return pool_1.pop();
                    }
                    return createFcn(allocator);
                };
                var poolDestroyFcn = function (contact, allocator) {
                    pool_1.push(contact);
                };
                this.m_registers[type1][type2].pool = pool_1;
                this.m_registers[type1][type2].createFcn = poolCreateFcn;
                this.m_registers[type1][type2].destroyFcn = poolDestroyFcn;
                this.m_registers[type1][type2].primary = true;
                if (type1 !== type2) {
                    this.m_registers[type2][type1].pool = pool_1;
                    this.m_registers[type2][type1].createFcn = poolCreateFcn;
                    this.m_registers[type2][type1].destroyFcn = poolDestroyFcn;
                    this.m_registers[type2][type1].primary = false;
                }
            }
            /*
            this.m_registers[type1][type2].createFcn = createFcn;
            this.m_registers[type1][type2].destroyFcn = destroyFcn;
            this.m_registers[type1][type2].primary = true;
        
            if (type1 != type2) {
              this.m_registers[type2][type1].createFcn = createFcn;
              this.m_registers[type2][type1].destroyFcn = destroyFcn;
              this.m_registers[type2][type1].primary = false;
            }
            */
        };
        b2ContactFactory.prototype.InitializeRegisters = function () {
            this.m_registers = new Array(box2d.b2ShapeType.e_shapeTypeCount);
            for (var i = 0; i < box2d.b2ShapeType.e_shapeTypeCount; i++) {
                this.m_registers[i] = new Array(box2d.b2ShapeType.e_shapeTypeCount);
                for (var j = 0; j < box2d.b2ShapeType.e_shapeTypeCount; j++) {
                    this.m_registers[i][j] = new b2ContactRegister();
                }
            }
            this.AddType(box2d.b2CircleContact.Create, box2d.b2CircleContact.Destroy, box2d.b2ShapeType.e_circleShape, box2d.b2ShapeType.e_circleShape);
            this.AddType(box2d.b2PolygonAndCircleContact.Create, box2d.b2PolygonAndCircleContact.Destroy, box2d.b2ShapeType.e_polygonShape, box2d.b2ShapeType.e_circleShape);
            this.AddType(box2d.b2PolygonContact.Create, box2d.b2PolygonContact.Destroy, box2d.b2ShapeType.e_polygonShape, box2d.b2ShapeType.e_polygonShape);
            this.AddType(box2d.b2EdgeAndCircleContact.Create, box2d.b2EdgeAndCircleContact.Destroy, box2d.b2ShapeType.e_edgeShape, box2d.b2ShapeType.e_circleShape);
            this.AddType(box2d.b2EdgeAndPolygonContact.Create, box2d.b2EdgeAndPolygonContact.Destroy, box2d.b2ShapeType.e_edgeShape, box2d.b2ShapeType.e_polygonShape);
            this.AddType(box2d.b2ChainAndCircleContact.Create, box2d.b2ChainAndCircleContact.Destroy, box2d.b2ShapeType.e_chainShape, box2d.b2ShapeType.e_circleShape);
            this.AddType(box2d.b2ChainAndPolygonContact.Create, box2d.b2ChainAndPolygonContact.Destroy, box2d.b2ShapeType.e_chainShape, box2d.b2ShapeType.e_polygonShape);
        };
        b2ContactFactory.prototype.Create = function (fixtureA, indexA, fixtureB, indexB) {
            var type1 = fixtureA.GetType();
            var type2 = fixtureB.GetType();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= type1 && type1 < box2d.b2ShapeType.e_shapeTypeCount);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= type2 && type2 < box2d.b2ShapeType.e_shapeTypeCount);
            }
            var reg = this.m_registers[type1][type2];
            if (reg.primary) {
                var c = reg.createFcn(this.m_allocator);
                c.Reset(fixtureA, indexA, fixtureB, indexB);
                return c;
            }
            else {
                var c = reg.createFcn(this.m_allocator);
                c.Reset(fixtureB, indexB, fixtureA, indexA);
                return c;
            }
        };
        b2ContactFactory.prototype.Destroy = function (contact) {
            var fixtureA = contact.m_fixtureA;
            var fixtureB = contact.m_fixtureB;
            if (contact.m_manifold.pointCount > 0 &&
                fixtureA.IsSensor() === false &&
                fixtureB.IsSensor() === false) {
                fixtureA.GetBody().SetAwake(true);
                fixtureB.GetBody().SetAwake(true);
            }
            var typeA = fixtureA.GetType();
            var typeB = fixtureB.GetType();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= typeA && typeB < box2d.b2ShapeType.e_shapeTypeCount);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(0 <= typeA && typeB < box2d.b2ShapeType.e_shapeTypeCount);
            }
            var reg = this.m_registers[typeA][typeB];
            reg.destroyFcn(contact, this.m_allocator);
        };
        return b2ContactFactory;
    }());
    box2d.b2ContactFactory = b2ContactFactory;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Collision/b2BroadPhase.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2WorldCallbacks.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2ContactFactory.ts"/>
var box2d;
(function (box2d) {
    // Delegate of b2World.
    var b2ContactManager = (function () {
        function b2ContactManager() {
            this.m_broadPhase = new box2d.b2BroadPhase();
            this.m_contactList = null;
            this.m_contactCount = 0;
            this.m_contactFilter = box2d.b2ContactFilter.b2_defaultFilter;
            this.m_contactListener = box2d.b2ContactListener.b2_defaultListener;
            this.m_allocator = null;
            this.m_contactFactory = null;
            this.m_contactFactory = new box2d.b2ContactFactory(this.m_allocator);
        }
        // Broad-phase callback.
        b2ContactManager.prototype.AddPair = function (proxyUserDataA, proxyUserDataB) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(proxyUserDataA instanceof box2d.b2FixtureProxy);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(proxyUserDataB instanceof box2d.b2FixtureProxy);
            }
            var proxyA = proxyUserDataA; // (proxyUserDataA instanceof b2FixtureProxy ? proxyUserDataA : null);
            var proxyB = proxyUserDataB; // (proxyUserDataB instanceof b2FixtureProxy ? proxyUserDataB : null);
            var fixtureA = proxyA.fixture;
            var fixtureB = proxyB.fixture;
            var indexA = proxyA.childIndex;
            var indexB = proxyB.childIndex;
            var bodyA = fixtureA.GetBody();
            var bodyB = fixtureB.GetBody();
            // Are the fixtures on the same body?
            if (bodyA === bodyB) {
                return;
            }
            // TODO_ERIN use a hash table to remove a potential bottleneck when both
            // bodies have a lot of contacts.
            // Does a contact already exist?
            var edge = bodyB.GetContactList();
            while (edge) {
                if (edge.other === bodyA) {
                    var fA = edge.contact.GetFixtureA();
                    var fB = edge.contact.GetFixtureB();
                    var iA = edge.contact.GetChildIndexA();
                    var iB = edge.contact.GetChildIndexB();
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
            var c = this.m_contactFactory.Create(fixtureA, indexA, fixtureB, indexB);
            if (c == null) {
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
            if (bodyA.m_contactList != null) {
                bodyA.m_contactList.prev = c.m_nodeA;
            }
            bodyA.m_contactList = c.m_nodeA;
            // Connect to body B
            c.m_nodeB.contact = c;
            c.m_nodeB.other = bodyA;
            c.m_nodeB.prev = null;
            c.m_nodeB.next = bodyB.m_contactList;
            if (bodyB.m_contactList != null) {
                bodyB.m_contactList.prev = c.m_nodeB;
            }
            bodyB.m_contactList = c.m_nodeB;
            // Wake up the bodies
            if (fixtureA.IsSensor() === false && fixtureB.IsSensor() === false) {
                bodyA.SetAwake(true);
                bodyB.SetAwake(true);
            }
            ++this.m_contactCount;
        };
        b2ContactManager.prototype.FindNewContacts = function () {
            this.m_broadPhase.UpdatePairs(this);
        };
        b2ContactManager.prototype.Destroy = function (c) {
            var fixtureA = c.GetFixtureA();
            var fixtureB = c.GetFixtureB();
            var bodyA = fixtureA.GetBody();
            var bodyB = fixtureB.GetBody();
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
        };
        // This is the top level collision call for the time step. Here
        // all the narrow phase collision is processed for the world
        // contact list.
        b2ContactManager.prototype.Collide = function () {
            // Update awake contacts.
            var c = this.m_contactList;
            while (c) {
                var fixtureA = c.GetFixtureA();
                var fixtureB = c.GetFixtureB();
                var indexA = c.GetChildIndexA();
                var indexB = c.GetChildIndexB();
                var bodyA = fixtureA.GetBody();
                var bodyB = fixtureB.GetBody();
                // Is this contact flagged for filtering?
                if (c.m_flags & box2d.b2ContactFlag.e_filterFlag) {
                    // Should these bodies collide?
                    if (bodyB.ShouldCollide(bodyA) === false) {
                        var cNuke = c;
                        c = cNuke.m_next;
                        this.Destroy(cNuke);
                        continue;
                    }
                    // Check user filtering.
                    if (this.m_contactFilter && this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) === false) {
                        var cNuke = c;
                        c = cNuke.m_next;
                        this.Destroy(cNuke);
                        continue;
                    }
                    // Clear the filtering flag.
                    c.m_flags &= ~box2d.b2ContactFlag.e_filterFlag;
                }
                var activeA = bodyA.IsAwake() && bodyA.m_type !== box2d.b2BodyType.b2_staticBody;
                var activeB = bodyB.IsAwake() && bodyB.m_type !== box2d.b2BodyType.b2_staticBody;
                // At least one body must be awake and it must be dynamic or kinematic.
                if (activeA === false && activeB === false) {
                    c = c.m_next;
                    continue;
                }
                var proxyA = fixtureA.m_proxies[indexA].proxy;
                var proxyB = fixtureB.m_proxies[indexB].proxy;
                var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
                // Here we destroy contacts that cease to overlap in the broad-phase.
                if (overlap === false) {
                    var cNuke = c;
                    c = cNuke.m_next;
                    this.Destroy(cNuke);
                    continue;
                }
                // The contact persists.
                c.Update(this.m_contactListener);
                c = c.m_next;
            }
        };
        return b2ContactManager;
    }());
    box2d.b2ContactManager = b2ContactManager;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
var box2d;
(function (box2d) {
    /// Profiling data. Times are in milliseconds.
    var b2Profile = (function () {
        function b2Profile() {
            this.step = 0;
            this.collide = 0;
            this.solve = 0;
            this.solveInit = 0;
            this.solveVelocity = 0;
            this.solvePosition = 0;
            this.broadphase = 0;
            this.solveTOI = 0;
        }
        b2Profile.prototype.Reset = function () {
            this.step = 0;
            this.collide = 0;
            this.solve = 0;
            this.solveInit = 0;
            this.solveVelocity = 0;
            this.solvePosition = 0;
            this.broadphase = 0;
            this.solveTOI = 0;
            return this;
        };
        return b2Profile;
    }());
    box2d.b2Profile = b2Profile;
    /// This is an internal structure.
    var b2TimeStep = (function () {
        function b2TimeStep() {
            this.dt = 0; // time step
            this.inv_dt = 0; // inverse time step (0 if dt == 0).
            this.dtRatio = 0; // dt * inv_dt0
            this.velocityIterations = 0;
            this.positionIterations = 0;
            this.warmStarting = false;
        }
        b2TimeStep.prototype.Copy = function (step) {
            this.dt = step.dt;
            this.inv_dt = step.inv_dt;
            this.dtRatio = step.dtRatio;
            this.positionIterations = step.positionIterations;
            this.velocityIterations = step.velocityIterations;
            this.warmStarting = step.warmStarting;
            return this;
        };
        return b2TimeStep;
    }());
    box2d.b2TimeStep = b2TimeStep;
    var b2Position = (function () {
        function b2Position() {
            this.c = new box2d.b2Vec2();
            this.a = 0;
        }
        b2Position.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2Position(); });
        };
        return b2Position;
    }());
    box2d.b2Position = b2Position;
    var b2Velocity = (function () {
        function b2Velocity() {
            this.v = new box2d.b2Vec2();
            this.w = 0;
        }
        b2Velocity.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2Velocity(); });
        };
        return b2Velocity;
    }());
    box2d.b2Velocity = b2Velocity;
    var b2SolverData = (function () {
        function b2SolverData() {
            this.step = new b2TimeStep();
            this.positions = null;
            this.velocities = null;
        }
        return b2SolverData;
    }());
    box2d.b2SolverData = b2SolverData;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../../Box2D/Box2D/Collision/b2Collision.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2World.ts"/>
/// <reference path="../../../../Box2D/Box2D/Common/b2StackAllocator.ts"/>
var box2d;
(function (box2d) {
    var b2VelocityConstraintPoint = (function () {
        function b2VelocityConstraintPoint() {
            this.rA = new box2d.b2Vec2();
            this.rB = new box2d.b2Vec2();
            this.normalImpulse = 0;
            this.tangentImpulse = 0;
            this.normalMass = 0;
            this.tangentMass = 0;
            this.velocityBias = 0;
        }
        b2VelocityConstraintPoint.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2VelocityConstraintPoint(); });
        };
        return b2VelocityConstraintPoint;
    }());
    box2d.b2VelocityConstraintPoint = b2VelocityConstraintPoint;
    var b2ContactVelocityConstraint = (function () {
        function b2ContactVelocityConstraint() {
            this.points = b2VelocityConstraintPoint.MakeArray(box2d.b2_maxManifoldPoints);
            this.normal = new box2d.b2Vec2();
            this.tangent = new box2d.b2Vec2();
            this.normalMass = new box2d.b2Mat22();
            this.K = new box2d.b2Mat22();
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
        b2ContactVelocityConstraint.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2ContactVelocityConstraint(); });
        };
        return b2ContactVelocityConstraint;
    }());
    box2d.b2ContactVelocityConstraint = b2ContactVelocityConstraint;
    var b2ContactPositionConstraint = (function () {
        function b2ContactPositionConstraint() {
            this.localPoints = box2d.b2Vec2.MakeArray(box2d.b2_maxManifoldPoints);
            this.localNormal = new box2d.b2Vec2();
            this.localPoint = new box2d.b2Vec2();
            this.indexA = 0;
            this.indexB = 0;
            this.invMassA = 0;
            this.invMassB = 0;
            this.localCenterA = new box2d.b2Vec2();
            this.localCenterB = new box2d.b2Vec2();
            this.invIA = 0;
            this.invIB = 0;
            this.type = box2d.b2ManifoldType.e_unknown;
            this.radiusA = 0;
            this.radiusB = 0;
            this.pointCount = 0;
        }
        b2ContactPositionConstraint.MakeArray = function (length) {
            return box2d.b2MakeArray(length, function (i) { return new b2ContactPositionConstraint(); });
        };
        return b2ContactPositionConstraint;
    }());
    box2d.b2ContactPositionConstraint = b2ContactPositionConstraint;
    var b2ContactSolverDef = (function () {
        function b2ContactSolverDef() {
            this.step = new box2d.b2TimeStep();
            this.contacts = null;
            this.count = 0;
            this.positions = null;
            this.velocities = null;
            this.allocator = null;
        }
        return b2ContactSolverDef;
    }());
    box2d.b2ContactSolverDef = b2ContactSolverDef;
    var b2PositionSolverManifold = (function () {
        function b2PositionSolverManifold() {
            this.normal = new box2d.b2Vec2();
            this.point = new box2d.b2Vec2();
            this.separation = 0;
        }
        b2PositionSolverManifold.prototype.Initialize = function (pc, xfA, xfB, index) {
            var pointA = b2PositionSolverManifold.Initialize_s_pointA;
            var pointB = b2PositionSolverManifold.Initialize_s_pointB;
            var planePoint = b2PositionSolverManifold.Initialize_s_planePoint;
            var clipPoint = b2PositionSolverManifold.Initialize_s_clipPoint;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(pc.pointCount > 0);
            }
            switch (pc.type) {
                case box2d.b2ManifoldType.e_circles:
                    {
                        // b2Vec2 pointA = b2Mul(xfA, pc->localPoint);
                        box2d.b2MulXV(xfA, pc.localPoint, pointA);
                        // b2Vec2 pointB = b2Mul(xfB, pc->localPoints[0]);
                        box2d.b2MulXV(xfB, pc.localPoints[0], pointB);
                        // normal = pointB - pointA;
                        // normal.Normalize();
                        box2d.b2SubVV(pointB, pointA, this.normal).SelfNormalize();
                        // point = 0.5f * (pointA + pointB);
                        box2d.b2MidVV(pointA, pointB, this.point);
                        // separation = b2Dot(pointB - pointA, normal) - pc->radius;
                        this.separation = box2d.b2DotVV(box2d.b2SubVV(pointB, pointA, box2d.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                    }
                    break;
                case box2d.b2ManifoldType.e_faceA:
                    {
                        // normal = b2Mul(xfA.q, pc->localNormal);
                        box2d.b2MulRV(xfA.q, pc.localNormal, this.normal);
                        // b2Vec2 planePoint = b2Mul(xfA, pc->localPoint);
                        box2d.b2MulXV(xfA, pc.localPoint, planePoint);
                        // b2Vec2 clipPoint = b2Mul(xfB, pc->localPoints[index]);
                        box2d.b2MulXV(xfB, pc.localPoints[index], clipPoint);
                        // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                        this.separation = box2d.b2DotVV(box2d.b2SubVV(clipPoint, planePoint, box2d.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                        // point = clipPoint;
                        this.point.Copy(clipPoint);
                    }
                    break;
                case box2d.b2ManifoldType.e_faceB:
                    {
                        // normal = b2Mul(xfB.q, pc->localNormal);
                        box2d.b2MulRV(xfB.q, pc.localNormal, this.normal);
                        // b2Vec2 planePoint = b2Mul(xfB, pc->localPoint);
                        box2d.b2MulXV(xfB, pc.localPoint, planePoint);
                        // b2Vec2 clipPoint = b2Mul(xfA, pc->localPoints[index]);
                        box2d.b2MulXV(xfA, pc.localPoints[index], clipPoint);
                        // separation = b2Dot(clipPoint - planePoint, normal) - pc->radius;
                        this.separation = box2d.b2DotVV(box2d.b2SubVV(clipPoint, planePoint, box2d.b2Vec2.s_t0), this.normal) - pc.radiusA - pc.radiusB;
                        // point = clipPoint;
                        this.point.Copy(clipPoint);
                        // Ensure normal points from A to B
                        // normal = -normal;
                        this.normal.SelfNeg();
                    }
                    break;
            }
        };
        b2PositionSolverManifold.Initialize_s_pointA = new box2d.b2Vec2();
        b2PositionSolverManifold.Initialize_s_pointB = new box2d.b2Vec2();
        b2PositionSolverManifold.Initialize_s_planePoint = new box2d.b2Vec2();
        b2PositionSolverManifold.Initialize_s_clipPoint = new box2d.b2Vec2();
        return b2PositionSolverManifold;
    }());
    box2d.b2PositionSolverManifold = b2PositionSolverManifold;
    var b2ContactSolver = (function () {
        function b2ContactSolver() {
            this.m_step = new box2d.b2TimeStep();
            this.m_positions = null;
            this.m_velocities = null;
            this.m_allocator = null;
            this.m_positionConstraints = b2ContactPositionConstraint.MakeArray(1024); // TODO: b2Settings
            this.m_velocityConstraints = b2ContactVelocityConstraint.MakeArray(1024); // TODO: b2Settings
            this.m_contacts = null;
            this.m_count = 0;
        }
        b2ContactSolver.prototype.Initialize = function (def) {
            this.m_step.Copy(def.step);
            this.m_allocator = def.allocator;
            this.m_count = def.count;
            // TODO:
            if (this.m_positionConstraints.length < this.m_count) {
                var new_length = box2d.b2Max(this.m_positionConstraints.length * 2, this.m_count);
                if (box2d.DEBUG) {
                    console.log("b2ContactSolver.m_positionConstraints: " + new_length);
                }
                while (this.m_positionConstraints.length < new_length) {
                    this.m_positionConstraints[this.m_positionConstraints.length] = new b2ContactPositionConstraint();
                }
            }
            // TODO:
            if (this.m_velocityConstraints.length < this.m_count) {
                var new_length = box2d.b2Max(this.m_velocityConstraints.length * 2, this.m_count);
                if (box2d.DEBUG) {
                    console.log("b2ContactSolver.m_velocityConstraints: " + new_length);
                }
                while (this.m_velocityConstraints.length < new_length) {
                    this.m_velocityConstraints[this.m_velocityConstraints.length] = new b2ContactVelocityConstraint();
                }
            }
            this.m_positions = def.positions;
            this.m_velocities = def.velocities;
            this.m_contacts = def.contacts;
            var i;
            var ict;
            var j;
            var jct;
            var contact;
            var fixtureA;
            var fixtureB;
            var shapeA;
            var shapeB;
            var radiusA;
            var radiusB;
            var bodyA;
            var bodyB;
            var manifold;
            var pointCount;
            var vc;
            var pc;
            var cp;
            var vcp;
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
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(pointCount > 0);
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
        };
        b2ContactSolver.prototype.InitializeVelocityConstraints = function () {
            var i;
            var ict;
            var j;
            var jct;
            var vc;
            var pc;
            var radiusA;
            var radiusB;
            var manifold;
            var indexA;
            var indexB;
            var mA;
            var mB;
            var iA;
            var iB;
            var localCenterA;
            var localCenterB;
            var cA;
            var aA;
            var vA;
            var wA;
            var cB;
            var aB;
            var vB;
            var wB;
            var xfA = b2ContactSolver.InitializeVelocityConstraints_s_xfA;
            var xfB = b2ContactSolver.InitializeVelocityConstraints_s_xfB;
            var worldManifold = b2ContactSolver.InitializeVelocityConstraints_s_worldManifold;
            var pointCount;
            var vcp;
            var rnA;
            var rnB;
            var kNormal;
            var tangent;
            var rtA;
            var rtB;
            var kTangent;
            var vRel;
            var vcp1;
            var vcp2;
            var rn1A;
            var rn1B;
            var rn2A;
            var rn2B;
            var k11;
            var k22;
            var k12;
            var k_maxConditionNumber = 1000;
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
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(manifold.pointCount > 0);
                }
                xfA.q.SetAngleRadians(aA);
                xfB.q.SetAngleRadians(aB);
                box2d.b2SubVV(cA, box2d.b2MulRV(xfA.q, localCenterA, box2d.b2Vec2.s_t0), xfA.p);
                box2d.b2SubVV(cB, box2d.b2MulRV(xfB.q, localCenterB, box2d.b2Vec2.s_t0), xfB.p);
                worldManifold.Initialize(manifold, xfA, radiusA, xfB, radiusB);
                vc.normal.Copy(worldManifold.normal);
                box2d.b2CrossVOne(vc.normal, vc.tangent); // compute from normal
                pointCount = vc.pointCount;
                for (j = 0, jct = pointCount; j < jct; ++j) {
                    vcp = vc.points[j];
                    // vcp->rA = worldManifold.points[j] - cA;
                    box2d.b2SubVV(worldManifold.points[j], cA, vcp.rA);
                    // vcp->rB = worldManifold.points[j] - cB;
                    box2d.b2SubVV(worldManifold.points[j], cB, vcp.rB);
                    rnA = box2d.b2CrossVV(vcp.rA, vc.normal);
                    rnB = box2d.b2CrossVV(vcp.rB, vc.normal);
                    kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                    vcp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
                    // b2Vec2 tangent = b2Cross(vc->normal, 1.0f);
                    tangent = vc.tangent; // precomputed from normal
                    rtA = box2d.b2CrossVV(vcp.rA, tangent);
                    rtB = box2d.b2CrossVV(vcp.rB, tangent);
                    kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
                    vcp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
                    // Setup a velocity bias for restitution.
                    vcp.velocityBias = 0;
                    // float32 vRel = b2Dot(vc->normal, vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA));
                    vRel = box2d.b2DotVV(vc.normal, box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, vcp.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, vcp.rA, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0));
                    if (vRel < (-box2d.b2_velocityThreshold)) {
                        vcp.velocityBias += (-vc.restitution * vRel);
                    }
                }
                // If we have two points, then prepare the block solver.
                if (vc.pointCount === 2) {
                    vcp1 = vc.points[0];
                    vcp2 = vc.points[1];
                    rn1A = box2d.b2CrossVV(vcp1.rA, vc.normal);
                    rn1B = box2d.b2CrossVV(vcp1.rB, vc.normal);
                    rn2A = box2d.b2CrossVV(vcp2.rA, vc.normal);
                    rn2B = box2d.b2CrossVV(vcp2.rB, vc.normal);
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
        };
        b2ContactSolver.prototype.WarmStart = function () {
            var i;
            var ict;
            var j;
            var jct;
            var vc;
            var indexA;
            var indexB;
            var mA;
            var iA;
            var mB;
            var iB;
            var pointCount;
            var vA;
            var wA;
            var vB;
            var wB;
            var normal;
            var tangent;
            var vcp;
            var P = b2ContactSolver.WarmStart_s_P;
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
                    box2d.b2AddVV(box2d.b2MulSV(vcp.normalImpulse, normal, box2d.b2Vec2.s_t0), box2d.b2MulSV(vcp.tangentImpulse, tangent, box2d.b2Vec2.s_t1), P);
                    // wA -= iA * b2Cross(vcp->rA, P);
                    wA -= iA * box2d.b2CrossVV(vcp.rA, P);
                    // vA -= mA * P;
                    vA.SelfMulSub(mA, P);
                    // wB += iB * b2Cross(vcp->rB, P);
                    wB += iB * box2d.b2CrossVV(vcp.rB, P);
                    // vB += mB * P;
                    vB.SelfMulAdd(mB, P);
                }
                // this.m_velocities[indexA].v = vA;
                this.m_velocities[indexA].w = wA;
                // this.m_velocities[indexB].v = vB;
                this.m_velocities[indexB].w = wB;
            }
        };
        b2ContactSolver.prototype.SolveVelocityConstraints = function () {
            var i;
            var ict;
            var j;
            var jct;
            var vc;
            var indexA;
            var indexB;
            var mA;
            var iA;
            var mB;
            var iB;
            var pointCount;
            var vA;
            var wA;
            var vB;
            var wB;
            var normal;
            var tangent;
            var friction;
            var vcp;
            var dv = b2ContactSolver.SolveVelocityConstraints_s_dv;
            var dv1 = b2ContactSolver.SolveVelocityConstraints_s_dv1;
            var dv2 = b2ContactSolver.SolveVelocityConstraints_s_dv2;
            var vt;
            var vn;
            var lambda;
            var maxFriction;
            var newImpulse;
            var P = b2ContactSolver.SolveVelocityConstraints_s_P;
            var cp1;
            var cp2;
            var a = b2ContactSolver.SolveVelocityConstraints_s_a;
            var b = b2ContactSolver.SolveVelocityConstraints_s_b;
            var vn1;
            var vn2;
            var x = b2ContactSolver.SolveVelocityConstraints_s_x;
            var d = b2ContactSolver.SolveVelocityConstraints_s_d;
            var P1 = b2ContactSolver.SolveVelocityConstraints_s_P1;
            var P2 = b2ContactSolver.SolveVelocityConstraints_s_P2;
            var P1P2 = b2ContactSolver.SolveVelocityConstraints_s_P1P2;
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
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(pointCount === 1 || pointCount === 2);
                }
                // Solve tangent constraints first because non-penetration is more important
                // than friction.
                for (j = 0, jct = pointCount; j < jct; ++j) {
                    vcp = vc.points[j];
                    // Relative velocity at contact
                    // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                    box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, vcp.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, vcp.rA, box2d.b2Vec2.s_t1), dv);
                    // Compute tangent force
                    // float32 vt = b2Dot(dv, tangent) - vc->tangentSpeed;
                    vt = box2d.b2DotVV(dv, tangent) - vc.tangentSpeed;
                    lambda = vcp.tangentMass * (-vt);
                    // b2Clamp the accumulated force
                    maxFriction = friction * vcp.normalImpulse;
                    newImpulse = box2d.b2Clamp(vcp.tangentImpulse + lambda, (-maxFriction), maxFriction);
                    lambda = newImpulse - vcp.tangentImpulse;
                    vcp.tangentImpulse = newImpulse;
                    // Apply contact impulse
                    // b2Vec2 P = lambda * tangent;
                    box2d.b2MulSV(lambda, tangent, P);
                    // vA -= mA * P;
                    vA.SelfMulSub(mA, P);
                    // wA -= iA * b2Cross(vcp->rA, P);
                    wA -= iA * box2d.b2CrossVV(vcp.rA, P);
                    // vB += mB * P;
                    vB.SelfMulAdd(mB, P);
                    // wB += iB * b2Cross(vcp->rB, P);
                    wB += iB * box2d.b2CrossVV(vcp.rB, P);
                }
                // Solve normal constraints
                if (vc.pointCount === 1) {
                    vcp = vc.points[0];
                    // Relative velocity at contact
                    // b2Vec2 dv = vB + b2Cross(wB, vcp->rB) - vA - b2Cross(wA, vcp->rA);
                    box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, vcp.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, vcp.rA, box2d.b2Vec2.s_t1), dv);
                    // Compute normal impulse
                    // float32 vn = b2Dot(dv, normal);
                    vn = box2d.b2DotVV(dv, normal);
                    lambda = (-vcp.normalMass * (vn - vcp.velocityBias));
                    // b2Clamp the accumulated impulse
                    // float32 newImpulse = b2Max(vcp->normalImpulse + lambda, 0.0f);
                    newImpulse = box2d.b2Max(vcp.normalImpulse + lambda, 0);
                    lambda = newImpulse - vcp.normalImpulse;
                    vcp.normalImpulse = newImpulse;
                    // Apply contact impulse
                    // b2Vec2 P = lambda * normal;
                    box2d.b2MulSV(lambda, normal, P);
                    // vA -= mA * P;
                    vA.SelfMulSub(mA, P);
                    // wA -= iA * b2Cross(vcp->rA, P);
                    wA -= iA * box2d.b2CrossVV(vcp.rA, P);
                    // vB += mB * P;
                    vB.SelfMulAdd(mB, P);
                    // wB += iB * b2Cross(vcp->rB, P);
                    wB += iB * box2d.b2CrossVV(vcp.rB, P);
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
                    // that the accumulated impulse is clamped and not the incremental impulse) we change the impulse constiable (x_i).
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
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(a.x >= 0 && a.y >= 0);
                    }
                    // Relative velocity at contact
                    // b2Vec2 dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                    box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, cp1.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, cp1.rA, box2d.b2Vec2.s_t1), dv1);
                    // b2Vec2 dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                    box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, cp2.rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, cp2.rA, box2d.b2Vec2.s_t1), dv2);
                    // Compute normal velocity
                    // float32 vn1 = b2Dot(dv1, normal);
                    vn1 = box2d.b2DotVV(dv1, normal);
                    // float32 vn2 = b2Dot(dv2, normal);
                    vn2 = box2d.b2DotVV(dv2, normal);
                    // b2Vec2 b;
                    b.x = vn1 - cp1.velocityBias;
                    b.y = vn2 - cp2.velocityBias;
                    // Compute b'
                    // b -= b2Mul(vc->K, a);
                    b.SelfSub(box2d.b2MulMV(vc.K, a, box2d.b2Vec2.s_t0));
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
                        box2d.b2MulMV(vc.normalMass, b, x).SelfNeg();
                        if (x.x >= 0 && x.y >= 0) {
                            // Get the incremental impulse
                            // b2Vec2 d = x - a;
                            box2d.b2SubVV(x, a, d);
                            // Apply incremental impulse
                            // b2Vec2 P1 = d.x * normal;
                            box2d.b2MulSV(d.x, normal, P1);
                            // b2Vec2 P2 = d.y * normal;
                            box2d.b2MulSV(d.y, normal, P2);
                            box2d.b2AddVV(P1, P2, P1P2);
                            // vA -= mA * (P1 + P2);
                            vA.SelfMulSub(mA, P1P2);
                            // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                            wA -= iA * (box2d.b2CrossVV(cp1.rA, P1) + box2d.b2CrossVV(cp2.rA, P2));
                            // vB += mB * (P1 + P2);
                            vB.SelfMulAdd(mB, P1P2);
                            // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                            wB += iB * (box2d.b2CrossVV(cp1.rB, P1) + box2d.b2CrossVV(cp2.rB, P2));
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
                
                            if (ENABLE_ASSERTS) { b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol); }
                            if (ENABLE_ASSERTS) { b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol); }
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
                            box2d.b2SubVV(x, a, d);
                            // Apply incremental impulse
                            // b2Vec2 P1 = d.x * normal;
                            box2d.b2MulSV(d.x, normal, P1);
                            // b2Vec2 P2 = d.y * normal;
                            box2d.b2MulSV(d.y, normal, P2);
                            box2d.b2AddVV(P1, P2, P1P2);
                            // vA -= mA * (P1 + P2);
                            vA.SelfMulSub(mA, P1P2);
                            // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                            wA -= iA * (box2d.b2CrossVV(cp1.rA, P1) + box2d.b2CrossVV(cp2.rA, P2));
                            // vB += mB * (P1 + P2);
                            vB.SelfMulAdd(mB, P1P2);
                            // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                            wB += iB * (box2d.b2CrossVV(cp1.rB, P1) + box2d.b2CrossVV(cp2.rB, P2));
                            // Accumulate
                            cp1.normalImpulse = x.x;
                            cp2.normalImpulse = x.y;
                            /*
                            #if B2_DEBUG_SOLVER === 1
                            // Postconditions
                            dv1 = vB + b2Cross(wB, cp1->rB) - vA - b2Cross(wA, cp1->rA);
                
                            // Compute normal velocity
                            vn1 = b2Dot(dv1, normal);
                
                            if (ENABLE_ASSERTS) { b2Assert(b2Abs(vn1 - cp1->velocityBias) < k_errorTol); }
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
                            box2d.b2SubVV(x, a, d);
                            // Apply incremental impulse
                            // b2Vec2 P1 = d.x * normal;
                            box2d.b2MulSV(d.x, normal, P1);
                            // b2Vec2 P2 = d.y * normal;
                            box2d.b2MulSV(d.y, normal, P2);
                            box2d.b2AddVV(P1, P2, P1P2);
                            // vA -= mA * (P1 + P2);
                            vA.SelfMulSub(mA, P1P2);
                            // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                            wA -= iA * (box2d.b2CrossVV(cp1.rA, P1) + box2d.b2CrossVV(cp2.rA, P2));
                            // vB += mB * (P1 + P2);
                            vB.SelfMulAdd(mB, P1P2);
                            // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                            wB += iB * (box2d.b2CrossVV(cp1.rB, P1) + box2d.b2CrossVV(cp2.rB, P2));
                            // Accumulate
                            cp1.normalImpulse = x.x;
                            cp2.normalImpulse = x.y;
                            /*
                            #if B2_DEBUG_SOLVER === 1
                            // Postconditions
                            dv2 = vB + b2Cross(wB, cp2->rB) - vA - b2Cross(wA, cp2->rA);
                
                            // Compute normal velocity
                            vn2 = b2Dot(dv2, normal);
                
                            if (ENABLE_ASSERTS) { b2Assert(b2Abs(vn2 - cp2->velocityBias) < k_errorTol); }
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
                            box2d.b2SubVV(x, a, d);
                            // Apply incremental impulse
                            // b2Vec2 P1 = d.x * normal;
                            box2d.b2MulSV(d.x, normal, P1);
                            // b2Vec2 P2 = d.y * normal;
                            box2d.b2MulSV(d.y, normal, P2);
                            box2d.b2AddVV(P1, P2, P1P2);
                            // vA -= mA * (P1 + P2);
                            vA.SelfMulSub(mA, P1P2);
                            // wA -= iA * (b2Cross(cp1->rA, P1) + b2Cross(cp2->rA, P2));
                            wA -= iA * (box2d.b2CrossVV(cp1.rA, P1) + box2d.b2CrossVV(cp2.rA, P2));
                            // vB += mB * (P1 + P2);
                            vB.SelfMulAdd(mB, P1P2);
                            // wB += iB * (b2Cross(cp1->rB, P1) + b2Cross(cp2->rB, P2));
                            wB += iB * (box2d.b2CrossVV(cp1.rB, P1) + box2d.b2CrossVV(cp2.rB, P2));
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
        };
        b2ContactSolver.prototype.StoreImpulses = function () {
            var i;
            var ict;
            var j;
            var jct;
            var vc;
            var manifold;
            for (i = 0, ict = this.m_count; i < ict; ++i) {
                vc = this.m_velocityConstraints[i];
                manifold = this.m_contacts[vc.contactIndex].GetManifold();
                for (j = 0, jct = vc.pointCount; j < jct; ++j) {
                    manifold.points[j].normalImpulse = vc.points[j].normalImpulse;
                    manifold.points[j].tangentImpulse = vc.points[j].tangentImpulse;
                }
            }
        };
        b2ContactSolver.prototype.SolvePositionConstraints = function () {
            var i;
            var ict;
            var j;
            var jct;
            var pc;
            var indexA;
            var indexB;
            var localCenterA;
            var mA;
            var iA;
            var localCenterB;
            var mB;
            var iB;
            var pointCount;
            var cA;
            var aA;
            var cB;
            var aB;
            var xfA = b2ContactSolver.SolvePositionConstraints_s_xfA;
            var xfB = b2ContactSolver.SolvePositionConstraints_s_xfB;
            var psm = b2ContactSolver.SolvePositionConstraints_s_psm;
            var normal;
            var point;
            var separation;
            var rA = b2ContactSolver.SolvePositionConstraints_s_rA;
            var rB = b2ContactSolver.SolvePositionConstraints_s_rB;
            var C;
            var rnA;
            var rnB;
            var K;
            var impulse;
            var P = b2ContactSolver.SolvePositionConstraints_s_P;
            var minSeparation = 0;
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
                    box2d.b2SubVV(cA, box2d.b2MulRV(xfA.q, localCenterA, box2d.b2Vec2.s_t0), xfA.p);
                    box2d.b2SubVV(cB, box2d.b2MulRV(xfB.q, localCenterB, box2d.b2Vec2.s_t0), xfB.p);
                    psm.Initialize(pc, xfA, xfB, j);
                    normal = psm.normal;
                    point = psm.point;
                    separation = psm.separation;
                    // b2Vec2 rA = point - cA;
                    box2d.b2SubVV(point, cA, rA);
                    // b2Vec2 rB = point - cB;
                    box2d.b2SubVV(point, cB, rB);
                    // Track max constraint error.
                    minSeparation = box2d.b2Min(minSeparation, separation);
                    // Prevent large corrections and allow slop.
                    C = box2d.b2Clamp(box2d.b2_baumgarte * (separation + box2d.b2_linearSlop), (-box2d.b2_maxLinearCorrection), 0);
                    // Compute the effective mass.
                    // float32 rnA = b2Cross(rA, normal);
                    rnA = box2d.b2CrossVV(rA, normal);
                    // float32 rnB = b2Cross(rB, normal);
                    rnB = box2d.b2CrossVV(rB, normal);
                    // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                    K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                    // Compute normal impulse
                    impulse = K > 0 ? -C / K : 0;
                    // b2Vec2 P = impulse * normal;
                    box2d.b2MulSV(impulse, normal, P);
                    // cA -= mA * P;
                    cA.SelfMulSub(mA, P);
                    // aA -= iA * b2Cross(rA, P);
                    aA -= iA * box2d.b2CrossVV(rA, P);
                    // cB += mB * P;
                    cB.SelfMulAdd(mB, P);
                    // aB += iB * b2Cross(rB, P);
                    aB += iB * box2d.b2CrossVV(rB, P);
                }
                // this.m_positions[indexA].c = cA;
                this.m_positions[indexA].a = aA;
                // this.m_positions[indexB].c = cB;
                this.m_positions[indexB].a = aB;
            }
            // We can't expect minSpeparation >= -b2_linearSlop because we don't
            // push the separation above -b2_linearSlop.
            return minSeparation > (-3 * box2d.b2_linearSlop);
        };
        b2ContactSolver.prototype.SolveTOIPositionConstraints = function (toiIndexA, toiIndexB) {
            var i;
            var ict;
            var j;
            var jct;
            var pc;
            var indexA;
            var indexB;
            var localCenterA;
            var localCenterB;
            var pointCount;
            var mA;
            var iA;
            var mB;
            var iB;
            var cA;
            var aA;
            var cB;
            var aB;
            var xfA = b2ContactSolver.SolveTOIPositionConstraints_s_xfA;
            var xfB = b2ContactSolver.SolveTOIPositionConstraints_s_xfB;
            var psm = b2ContactSolver.SolveTOIPositionConstraints_s_psm;
            var normal;
            var point;
            var separation;
            var rA = b2ContactSolver.SolveTOIPositionConstraints_s_rA;
            var rB = b2ContactSolver.SolveTOIPositionConstraints_s_rB;
            var C;
            var rnA;
            var rnB;
            var K;
            var impulse;
            var P = b2ContactSolver.SolveTOIPositionConstraints_s_P;
            var minSeparation = 0;
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
                    box2d.b2SubVV(cA, box2d.b2MulRV(xfA.q, localCenterA, box2d.b2Vec2.s_t0), xfA.p);
                    box2d.b2SubVV(cB, box2d.b2MulRV(xfB.q, localCenterB, box2d.b2Vec2.s_t0), xfB.p);
                    psm.Initialize(pc, xfA, xfB, j);
                    normal = psm.normal;
                    point = psm.point;
                    separation = psm.separation;
                    // b2Vec2 rA = point - cA;
                    box2d.b2SubVV(point, cA, rA);
                    // b2Vec2 rB = point - cB;
                    box2d.b2SubVV(point, cB, rB);
                    // Track max constraint error.
                    minSeparation = box2d.b2Min(minSeparation, separation);
                    // Prevent large corrections and allow slop.
                    C = box2d.b2Clamp(box2d.b2_toiBaumgarte * (separation + box2d.b2_linearSlop), (-box2d.b2_maxLinearCorrection), 0);
                    // Compute the effective mass.
                    // float32 rnA = b2Cross(rA, normal);
                    rnA = box2d.b2CrossVV(rA, normal);
                    // float32 rnB = b2Cross(rB, normal);
                    rnB = box2d.b2CrossVV(rB, normal);
                    // float32 K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                    K = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
                    // Compute normal impulse
                    impulse = K > 0 ? -C / K : 0;
                    // b2Vec2 P = impulse * normal;
                    box2d.b2MulSV(impulse, normal, P);
                    // cA -= mA * P;
                    cA.SelfMulSub(mA, P);
                    // aA -= iA * b2Cross(rA, P);
                    aA -= iA * box2d.b2CrossVV(rA, P);
                    // cB += mB * P;
                    cB.SelfMulAdd(mB, P);
                    // aB += iB * b2Cross(rB, P);
                    aB += iB * box2d.b2CrossVV(rB, P);
                }
                // this.m_positions[indexA].c = cA;
                this.m_positions[indexA].a = aA;
                // this.m_positions[indexB].c = cB;
                this.m_positions[indexB].a = aB;
            }
            // We can't expect minSpeparation >= -b2_linearSlop because we don't
            // push the separation above -b2_linearSlop.
            return minSeparation >= -1.5 * box2d.b2_linearSlop;
        };
        b2ContactSolver.InitializeVelocityConstraints_s_xfA = new box2d.b2Transform();
        b2ContactSolver.InitializeVelocityConstraints_s_xfB = new box2d.b2Transform();
        b2ContactSolver.InitializeVelocityConstraints_s_worldManifold = new box2d.b2WorldManifold();
        b2ContactSolver.WarmStart_s_P = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_dv = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_dv1 = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_dv2 = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_P = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_a = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_b = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_x = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_d = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_P1 = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_P2 = new box2d.b2Vec2();
        b2ContactSolver.SolveVelocityConstraints_s_P1P2 = new box2d.b2Vec2();
        b2ContactSolver.SolvePositionConstraints_s_xfA = new box2d.b2Transform();
        b2ContactSolver.SolvePositionConstraints_s_xfB = new box2d.b2Transform();
        b2ContactSolver.SolvePositionConstraints_s_psm = new b2PositionSolverManifold();
        b2ContactSolver.SolvePositionConstraints_s_rA = new box2d.b2Vec2();
        b2ContactSolver.SolvePositionConstraints_s_rB = new box2d.b2Vec2();
        b2ContactSolver.SolvePositionConstraints_s_P = new box2d.b2Vec2();
        b2ContactSolver.SolveTOIPositionConstraints_s_xfA = new box2d.b2Transform();
        b2ContactSolver.SolveTOIPositionConstraints_s_xfB = new box2d.b2Transform();
        b2ContactSolver.SolveTOIPositionConstraints_s_psm = new b2PositionSolverManifold();
        b2ContactSolver.SolveTOIPositionConstraints_s_rA = new box2d.b2Vec2();
        b2ContactSolver.SolveTOIPositionConstraints_s_rB = new box2d.b2Vec2();
        b2ContactSolver.SolveTOIPositionConstraints_s_P = new box2d.b2Vec2();
        return b2ContactSolver;
    }());
    box2d.b2ContactSolver = b2ContactSolver;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2Distance.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2World.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2ContactSolver.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2StackAllocator.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Timer.ts"/>
var box2d;
(function (box2d) {
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
    iterations to terminate early if the error becomes smaller than b2_linearSlop.
    
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
    var b2Island = (function () {
        function b2Island() {
            this.m_allocator = null;
            this.m_listener = null;
            this.m_bodies = new Array(1024); // TODO: b2Settings
            this.m_contacts = new Array(1024); // TODO: b2Settings
            this.m_joints = new Array(1024); // TODO: b2Settings
            this.m_positions = box2d.b2Position.MakeArray(1024); // TODO: b2Settings
            this.m_velocities = box2d.b2Velocity.MakeArray(1024); // TODO: b2Settings
            this.m_bodyCount = 0;
            this.m_jointCount = 0;
            this.m_contactCount = 0;
            this.m_bodyCapacity = 0;
            this.m_contactCapacity = 0;
            this.m_jointCapacity = 0;
        }
        b2Island.prototype.Initialize = function (bodyCapacity, contactCapacity, jointCapacity, allocator, listener) {
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
                var new_length = box2d.b2Max(this.m_positions.length * 2, bodyCapacity);
                if (box2d.DEBUG) {
                    console.log("b2Island.m_positions: " + new_length);
                }
                while (this.m_positions.length < new_length) {
                    this.m_positions[this.m_positions.length] = new box2d.b2Position();
                }
            }
            // TODO:
            if (this.m_velocities.length < bodyCapacity) {
                var new_length = box2d.b2Max(this.m_velocities.length * 2, bodyCapacity);
                if (box2d.DEBUG) {
                    console.log("b2Island.m_velocities: " + new_length);
                }
                while (this.m_velocities.length < new_length) {
                    this.m_velocities[this.m_velocities.length] = new box2d.b2Velocity();
                }
            }
        };
        b2Island.prototype.Clear = function () {
            this.m_bodyCount = 0;
            this.m_contactCount = 0;
            this.m_jointCount = 0;
        };
        b2Island.prototype.AddBody = function (body) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_bodyCount < this.m_bodyCapacity);
            }
            body.m_islandIndex = this.m_bodyCount;
            this.m_bodies[this.m_bodyCount++] = body;
        };
        b2Island.prototype.AddContact = function (contact) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_contactCount < this.m_contactCapacity);
            }
            this.m_contacts[this.m_contactCount++] = contact;
        };
        b2Island.prototype.AddJoint = function (joint) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_jointCount < this.m_jointCapacity);
            }
            this.m_joints[this.m_jointCount++] = joint;
        };
        b2Island.prototype.Solve = function (profile, step, gravity, allowSleep) {
            var timer = b2Island.s_timer.Reset();
            var h = step.dt;
            // Integrate velocities and apply damping. Initialize the body state.
            for (var i = 0; i < this.m_bodyCount; ++i) {
                var b = this.m_bodies[i];
                var c = this.m_positions[i].c.Copy(b.m_sweep.c);
                var a = b.m_sweep.a;
                var v = this.m_velocities[i].v.Copy(b.m_linearVelocity);
                var w = b.m_angularVelocity;
                // Store positions for continuous collision.
                b.m_sweep.c0.Copy(b.m_sweep.c);
                b.m_sweep.a0 = b.m_sweep.a;
                if (b.m_type === box2d.b2BodyType.b2_dynamicBody) {
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
                    v.SelfMul(box2d.b2Clamp(1 - h * b.m_linearDamping, 0, 1));
                    w *= box2d.b2Clamp(1 - h * b.m_angularDamping, 0, 1);
                }
                // this.m_positions[i].c = c;
                this.m_positions[i].a = a;
                // this.m_velocities[i].v = v;
                this.m_velocities[i].w = w;
            }
            timer.Reset();
            // Solver data
            var solverData = b2Island.s_solverData;
            solverData.step.Copy(step);
            solverData.positions = this.m_positions;
            solverData.velocities = this.m_velocities;
            // Initialize velocity constraints.
            var contactSolverDef = b2Island.s_contactSolverDef;
            contactSolverDef.step.Copy(step);
            contactSolverDef.contacts = this.m_contacts;
            contactSolverDef.count = this.m_contactCount;
            contactSolverDef.positions = this.m_positions;
            contactSolverDef.velocities = this.m_velocities;
            contactSolverDef.allocator = this.m_allocator;
            var contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
            contactSolver.InitializeVelocityConstraints();
            if (step.warmStarting) {
                contactSolver.WarmStart();
            }
            for (var i = 0; i < this.m_jointCount; ++i) {
                this.m_joints[i].InitVelocityConstraints(solverData);
            }
            profile.solveInit = timer.GetMilliseconds();
            // Solve velocity constraints.
            timer.Reset();
            for (var i = 0; i < step.velocityIterations; ++i) {
                for (var j = 0; j < this.m_jointCount; ++j) {
                    this.m_joints[j].SolveVelocityConstraints(solverData);
                }
                contactSolver.SolveVelocityConstraints();
            }
            // Store impulses for warm starting
            contactSolver.StoreImpulses();
            profile.solveVelocity = timer.GetMilliseconds();
            // Integrate positions.
            for (var i = 0; i < this.m_bodyCount; ++i) {
                var c = this.m_positions[i].c;
                var a = this.m_positions[i].a;
                var v = this.m_velocities[i].v;
                var w = this.m_velocities[i].w;
                // Check for large velocities
                var translation = box2d.b2MulSV(h, v, b2Island.s_translation);
                if (box2d.b2DotVV(translation, translation) > box2d.b2_maxTranslationSquared) {
                    var ratio = box2d.b2_maxTranslation / translation.GetLength();
                    v.SelfMul(ratio);
                }
                var rotation = h * w;
                if (rotation * rotation > box2d.b2_maxRotationSquared) {
                    var ratio = box2d.b2_maxRotation / box2d.b2Abs(rotation);
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
            var positionSolved = false;
            for (var i = 0; i < step.positionIterations; ++i) {
                var contactsOkay = contactSolver.SolvePositionConstraints();
                var jointsOkay = true;
                for (var j = 0; j < this.m_jointCount; ++j) {
                    var jointOkay = this.m_joints[j].SolvePositionConstraints(solverData);
                    jointsOkay = jointsOkay && jointOkay;
                }
                if (contactsOkay && jointsOkay) {
                    // Exit early if the position errors are small.
                    positionSolved = true;
                    break;
                }
            }
            // Copy state buffers back to the bodies
            for (var i = 0; i < this.m_bodyCount; ++i) {
                var body = this.m_bodies[i];
                body.m_sweep.c.Copy(this.m_positions[i].c);
                body.m_sweep.a = this.m_positions[i].a;
                body.m_linearVelocity.Copy(this.m_velocities[i].v);
                body.m_angularVelocity = this.m_velocities[i].w;
                body.SynchronizeTransform();
            }
            profile.solvePosition = timer.GetMilliseconds();
            this.Report(contactSolver.m_velocityConstraints);
            if (allowSleep) {
                var minSleepTime = box2d.b2_maxFloat;
                var linTolSqr = box2d.b2_linearSleepTolerance * box2d.b2_linearSleepTolerance;
                var angTolSqr = box2d.b2_angularSleepTolerance * box2d.b2_angularSleepTolerance;
                for (var i = 0; i < this.m_bodyCount; ++i) {
                    var b = this.m_bodies[i];
                    if (b.GetType() === box2d.b2BodyType.b2_staticBody) {
                        continue;
                    }
                    if ((b.m_flags & box2d.b2BodyFlag.e_autoSleepFlag) === 0 ||
                        b.m_angularVelocity * b.m_angularVelocity > angTolSqr ||
                        box2d.b2DotVV(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
                        b.m_sleepTime = 0;
                        minSleepTime = 0;
                    }
                    else {
                        b.m_sleepTime += h;
                        minSleepTime = box2d.b2Min(minSleepTime, b.m_sleepTime);
                    }
                }
                if (minSleepTime >= box2d.b2_timeToSleep && positionSolved) {
                    for (var i = 0; i < this.m_bodyCount; ++i) {
                        var b = this.m_bodies[i];
                        b.SetAwake(false);
                    }
                }
            }
        };
        b2Island.prototype.SolveTOI = function (subStep, toiIndexA, toiIndexB) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(toiIndexA < this.m_bodyCount);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(toiIndexB < this.m_bodyCount);
            }
            // Initialize the body state.
            for (var i = 0; i < this.m_bodyCount; ++i) {
                var b = this.m_bodies[i];
                this.m_positions[i].c.Copy(b.m_sweep.c);
                this.m_positions[i].a = b.m_sweep.a;
                this.m_velocities[i].v.Copy(b.m_linearVelocity);
                this.m_velocities[i].w = b.m_angularVelocity;
            }
            var contactSolverDef = b2Island.s_contactSolverDef;
            contactSolverDef.contacts = this.m_contacts;
            contactSolverDef.count = this.m_contactCount;
            contactSolverDef.allocator = this.m_allocator;
            contactSolverDef.step.Copy(subStep);
            contactSolverDef.positions = this.m_positions;
            contactSolverDef.velocities = this.m_velocities;
            var contactSolver = b2Island.s_contactSolver.Initialize(contactSolverDef);
            // Solve position constraints.
            for (var i = 0; i < subStep.positionIterations; ++i) {
                var contactsOkay = contactSolver.SolveTOIPositionConstraints(toiIndexA, toiIndexB);
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
          
                if (output.distance == 0 || cache.count == 3) {
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
            for (var i = 0; i < subStep.velocityIterations; ++i) {
                contactSolver.SolveVelocityConstraints();
            }
            // Don't store the TOI contact forces for warm starting
            // because they can be quite large.
            var h = subStep.dt;
            // Integrate positions
            for (var i = 0; i < this.m_bodyCount; ++i) {
                var c = this.m_positions[i].c;
                var a = this.m_positions[i].a;
                var v = this.m_velocities[i].v;
                var w = this.m_velocities[i].w;
                // Check for large velocities
                var translation = box2d.b2MulSV(h, v, b2Island.s_translation);
                if (box2d.b2DotVV(translation, translation) > box2d.b2_maxTranslationSquared) {
                    var ratio = box2d.b2_maxTranslation / translation.GetLength();
                    v.SelfMul(ratio);
                }
                var rotation = h * w;
                if (rotation * rotation > box2d.b2_maxRotationSquared) {
                    var ratio = box2d.b2_maxRotation / box2d.b2Abs(rotation);
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
                var body = this.m_bodies[i];
                body.m_sweep.c.Copy(c);
                body.m_sweep.a = a;
                body.m_linearVelocity.Copy(v);
                body.m_angularVelocity = w;
                body.SynchronizeTransform();
            }
            this.Report(contactSolver.m_velocityConstraints);
        };
        b2Island.prototype.Report = function (constraints) {
            if (this.m_listener == null) {
                return;
            }
            for (var i = 0; i < this.m_contactCount; ++i) {
                var c = this.m_contacts[i];
                if (!c) {
                    continue;
                }
                var vc = constraints[i];
                var impulse = b2Island.s_impulse;
                impulse.count = vc.pointCount;
                for (var j = 0; j < vc.pointCount; ++j) {
                    impulse.normalImpulses[j] = vc.points[j].normalImpulse;
                    impulse.tangentImpulses[j] = vc.points[j].tangentImpulse;
                }
                this.m_listener.PostSolve(c, impulse);
            }
        };
        b2Island.s_timer = new box2d.b2Timer();
        b2Island.s_solverData = new box2d.b2SolverData();
        b2Island.s_contactSolverDef = new box2d.b2ContactSolverDef();
        b2Island.s_contactSolver = new box2d.b2ContactSolver();
        b2Island.s_translation = new box2d.b2Vec2();
        b2Island.s_impulse = new box2d.b2ContactImpulse();
        return b2Island;
    }());
    box2d.b2Island = b2Island;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Distance joint definition. This requires defining an
    /// anchor point on both bodies and the non-zero length of the
    /// distance joint. The definition uses local anchor points
    /// so that the initial configuration can violate the constraint
    /// slightly. This helps when saving and loading a game.
    /// @warning Do not use a zero or short length.
    var b2DistanceJointDef = (function (_super) {
        __extends(b2DistanceJointDef, _super);
        function b2DistanceJointDef() {
            _super.call(this, box2d.b2JointType.e_distanceJoint); // base class constructor
            this.localAnchorA = new box2d.b2Vec2();
            this.localAnchorB = new box2d.b2Vec2();
            this.length = 1;
            this.frequencyHz = 0;
            this.dampingRatio = 0;
        }
        b2DistanceJointDef.prototype.Initialize = function (b1, b2, anchor1, anchor2) {
            this.bodyA = b1;
            this.bodyB = b2;
            this.bodyA.GetLocalPoint(anchor1, this.localAnchorA);
            this.bodyB.GetLocalPoint(anchor2, this.localAnchorB);
            this.length = box2d.b2DistanceVV(anchor1, anchor2);
            this.frequencyHz = 0;
            this.dampingRatio = 0;
        };
        return b2DistanceJointDef;
    }(box2d.b2JointDef));
    box2d.b2DistanceJointDef = b2DistanceJointDef;
    var b2DistanceJoint = (function (_super) {
        __extends(b2DistanceJoint, _super);
        function b2DistanceJoint(def) {
            _super.call(this, def); // base class constructor
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
            this.m_u = new box2d.b2Vec2();
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_frequencyHz = def.frequencyHz;
            this.m_dampingRatio = def.dampingRatio;
            this.m_localAnchorA = def.localAnchorA.Clone();
            this.m_localAnchorB = def.localAnchorB.Clone();
            this.m_length = def.length;
        }
        b2DistanceJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2DistanceJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2DistanceJoint.prototype.GetReactionForce = function (inv_dt, out) {
            return out.SetXY(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
        };
        b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
            return 0;
        };
        b2DistanceJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
        b2DistanceJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
        b2DistanceJoint.prototype.SetLength = function (length) {
            this.m_length = length;
        };
        b2DistanceJoint.prototype.GetLength = function () {
            return this.m_length;
        };
        b2DistanceJoint.prototype.SetFrequency = function (hz) {
            this.m_frequencyHz = hz;
        };
        b2DistanceJoint.prototype.GetFrequency = function () {
            return this.m_frequencyHz;
        };
        b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
            this.m_dampingRatio = ratio;
        };
        b2DistanceJoint.prototype.GetDampingRatio = function () {
            return this.m_dampingRatio;
        };
        b2DistanceJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2DistanceJointDef = new b2DistanceJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.length = %.15f;\n", this.m_length);
                box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2DistanceJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // m_u = cB + m_rB - cA - m_rA;
            this.m_u.x = cB.x + this.m_rB.x - cA.x - this.m_rA.x;
            this.m_u.y = cB.y + this.m_rB.y - cA.y - this.m_rA.y;
            // Handle singularity.
            var length = this.m_u.GetLength();
            if (length > box2d.b2_linearSlop) {
                this.m_u.SelfMul(1 / length);
            }
            else {
                this.m_u.SetZero();
            }
            // float32 crAu = b2Cross(m_rA, m_u);
            var crAu = box2d.b2CrossVV(this.m_rA, this.m_u);
            // float32 crBu = b2Cross(m_rB, m_u);
            var crBu = box2d.b2CrossVV(this.m_rB, this.m_u);
            // float32 invMass = m_invMassA + m_invIA * crAu * crAu + m_invMassB + m_invIB * crBu * crBu;
            var invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB + this.m_invIB * crBu * crBu;
            // Compute the effective mass matrix.
            this.m_mass = invMass !== 0 ? 1 / invMass : 0;
            if (this.m_frequencyHz > 0) {
                var C = length - this.m_length;
                // Frequency
                var omega = 2 * box2d.b2_pi * this.m_frequencyHz;
                // Damping coefficient
                var d = 2 * this.m_mass * this.m_dampingRatio * omega;
                // Spring stiffness
                var k = this.m_mass * omega * omega;
                // magic formulas
                var h = data.step.dt;
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
                // Scale the impulse to support a constiable time step.
                this.m_impulse *= data.step.dtRatio;
                // b2Vec2 P = m_impulse * m_u;
                var P = box2d.b2MulSV(this.m_impulse, this.m_u, b2DistanceJoint.InitVelocityConstraints_s_P);
                // vA -= m_invMassA * P;
                vA.SelfMulSub(this.m_invMassA, P);
                // wA -= m_invIA * b2Cross(m_rA, P);
                wA -= this.m_invIA * box2d.b2CrossVV(this.m_rA, P);
                // vB += m_invMassB * P;
                vB.SelfMulAdd(this.m_invMassB, P);
                // wB += m_invIB * b2Cross(m_rB, P);
                wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, P);
            }
            else {
                this.m_impulse = 0;
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2DistanceJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
            var vpA = box2d.b2AddVCrossSV(vA, wA, this.m_rA, b2DistanceJoint.SolveVelocityConstraints_s_vpA);
            // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
            var vpB = box2d.b2AddVCrossSV(vB, wB, this.m_rB, b2DistanceJoint.SolveVelocityConstraints_s_vpB);
            // float32 Cdot = b2Dot(m_u, vpB - vpA);
            var Cdot = box2d.b2DotVV(this.m_u, box2d.b2SubVV(vpB, vpA, box2d.b2Vec2.s_t0));
            var impulse = (-this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse));
            this.m_impulse += impulse;
            // b2Vec2 P = impulse * m_u;
            var P = box2d.b2MulSV(impulse, this.m_u, b2DistanceJoint.SolveVelocityConstraints_s_P);
            // vA -= m_invMassA * P;
            vA.SelfMulSub(this.m_invMassA, P);
            // wA -= m_invIA * b2Cross(m_rA, P);
            wA -= this.m_invIA * box2d.b2CrossVV(this.m_rA, P);
            // vB += m_invMassB * P;
            vB.SelfMulAdd(this.m_invMassB, P);
            // wB += m_invIB * b2Cross(m_rB, P);
            wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, P);
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2DistanceJoint.prototype.SolvePositionConstraints = function (data) {
            if (this.m_frequencyHz > 0) {
                // There is no position correction for soft distance constraints.
                return true;
            }
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            var rA = box2d.b2MulRV(this.m_qA, this.m_lalcA, this.m_rA); // use m_rA
            // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            var rB = box2d.b2MulRV(this.m_qB, this.m_lalcB, this.m_rB); // use m_rB
            // b2Vec2 u = cB + rB - cA - rA;
            var u = this.m_u; // use m_u
            u.x = cB.x + rB.x - cA.x - rA.x;
            u.y = cB.y + rB.y - cA.y - rA.y;
            // float32 length = u.Normalize();
            var length = this.m_u.Normalize();
            // float32 C = length - m_length;
            var C = length - this.m_length;
            C = box2d.b2Clamp(C, (-box2d.b2_maxLinearCorrection), box2d.b2_maxLinearCorrection);
            var impulse = (-this.m_mass * C);
            // b2Vec2 P = impulse * u;
            var P = box2d.b2MulSV(impulse, u, b2DistanceJoint.SolvePositionConstraints_s_P);
            // cA -= m_invMassA * P;
            cA.SelfMulSub(this.m_invMassA, P);
            // aA -= m_invIA * b2Cross(rA, P);
            aA -= this.m_invIA * box2d.b2CrossVV(rA, P);
            // cB += m_invMassB * P;
            cB.SelfMulAdd(this.m_invMassB, P);
            // aB += m_invIB * b2Cross(rB, P);
            aB += this.m_invIB * box2d.b2CrossVV(rB, P);
            // data.positions[this.m_indexA].c = cA;
            data.positions[this.m_indexA].a = aA;
            // data.positions[this.m_indexB].c = cB;
            data.positions[this.m_indexB].a = aB;
            return box2d.b2Abs(C) < box2d.b2_linearSlop;
        };
        b2DistanceJoint.InitVelocityConstraints_s_P = new box2d.b2Vec2();
        b2DistanceJoint.SolveVelocityConstraints_s_vpA = new box2d.b2Vec2();
        b2DistanceJoint.SolveVelocityConstraints_s_vpB = new box2d.b2Vec2();
        b2DistanceJoint.SolveVelocityConstraints_s_P = new box2d.b2Vec2();
        b2DistanceJoint.SolvePositionConstraints_s_P = new box2d.b2Vec2();
        return b2DistanceJoint;
    }(box2d.b2Joint));
    box2d.b2DistanceJoint = b2DistanceJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Wheel joint definition. This requires defining a line of
    /// motion using an axis and an anchor point. The definition uses local
    /// anchor points and a local axis so that the initial configuration
    /// can violate the constraint slightly. The joint translation is zero
    /// when the local anchor points coincide in world space. Using local
    /// anchors and a local axis helps when saving and loading a game.
    var b2WheelJointDef = (function (_super) {
        __extends(b2WheelJointDef, _super);
        function b2WheelJointDef() {
            _super.call(this, box2d.b2JointType.e_wheelJoint); // base class constructor
            this.localAnchorA = new box2d.b2Vec2(0, 0);
            this.localAnchorB = new box2d.b2Vec2(0, 0);
            this.localAxisA = new box2d.b2Vec2(1, 0);
            this.enableMotor = false;
            this.maxMotorTorque = 0;
            this.motorSpeed = 0;
            this.frequencyHz = 2;
            this.dampingRatio = 0.7;
        }
        b2WheelJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
            this.bodyA = bA;
            this.bodyB = bB;
            this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
            this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
            this.bodyA.GetLocalVector(axis, this.localAxisA);
        };
        return b2WheelJointDef;
    }(box2d.b2JointDef));
    box2d.b2WheelJointDef = b2WheelJointDef;
    var b2WheelJoint = (function (_super) {
        __extends(b2WheelJoint, _super);
        function b2WheelJoint(def) {
            _super.call(this, def); // base class constructor
            this.m_frequencyHz = 0;
            this.m_dampingRatio = 0;
            // Solver shared
            this.m_localAnchorA = new box2d.b2Vec2();
            this.m_localAnchorB = new box2d.b2Vec2();
            this.m_localXAxisA = new box2d.b2Vec2();
            this.m_localYAxisA = new box2d.b2Vec2();
            this.m_impulse = 0;
            this.m_motorImpulse = 0;
            this.m_springImpulse = 0;
            this.m_maxMotorTorque = 0;
            this.m_motorSpeed = 0;
            this.m_enableMotor = false;
            // Solver temp
            this.m_indexA = 0;
            this.m_indexB = 0;
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_invMassA = 0;
            this.m_invMassB = 0;
            this.m_invIA = 0;
            this.m_invIB = 0;
            this.m_ax = new box2d.b2Vec2();
            this.m_ay = new box2d.b2Vec2();
            this.m_sAx = 0;
            this.m_sBx = 0;
            this.m_sAy = 0;
            this.m_sBy = 0;
            this.m_mass = 0;
            this.m_motorMass = 0;
            this.m_springMass = 0;
            this.m_bias = 0;
            this.m_gamma = 0;
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_frequencyHz = def.frequencyHz;
            this.m_dampingRatio = def.dampingRatio;
            this.m_localAnchorA.Copy(def.localAnchorA);
            this.m_localAnchorB.Copy(def.localAnchorB);
            this.m_localXAxisA.Copy(def.localAxisA);
            box2d.b2CrossOneV(this.m_localXAxisA, this.m_localYAxisA);
            this.m_maxMotorTorque = def.maxMotorTorque;
            this.m_motorSpeed = def.motorSpeed;
            this.m_enableMotor = def.enableMotor;
            this.m_ax.SetZero();
            this.m_ay.SetZero();
        }
        b2WheelJoint.prototype.GetMotorSpeed = function () {
            return this.m_motorSpeed;
        };
        b2WheelJoint.prototype.GetMaxMotorTorque = function () {
            return this.m_maxMotorTorque;
        };
        b2WheelJoint.prototype.SetSpringFrequencyHz = function (hz) {
            this.m_frequencyHz = hz;
        };
        b2WheelJoint.prototype.GetSpringFrequencyHz = function () {
            return this.m_frequencyHz;
        };
        b2WheelJoint.prototype.SetSpringDampingRatio = function (ratio) {
            this.m_dampingRatio = ratio;
        };
        b2WheelJoint.prototype.GetSpringDampingRatio = function () {
            return this.m_dampingRatio;
        };
        b2WheelJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // Compute the effective masses.
            // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // b2Vec2 d = cB + rB - cA - rA;
            var d = box2d.b2SubVV(box2d.b2AddVV(cB, rB, box2d.b2Vec2.s_t0), box2d.b2AddVV(cA, rA, box2d.b2Vec2.s_t1), b2WheelJoint.InitVelocityConstraints_s_d);
            // Point to line constraint
            {
                // m_ay = b2Mul(qA, m_localYAxisA);
                box2d.b2MulRV(qA, this.m_localYAxisA, this.m_ay);
                // m_sAy = b2Cross(d + rA, m_ay);
                this.m_sAy = box2d.b2CrossVV(box2d.b2AddVV(d, rA, box2d.b2Vec2.s_t0), this.m_ay);
                // m_sBy = b2Cross(rB, m_ay);
                this.m_sBy = box2d.b2CrossVV(rB, this.m_ay);
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
                box2d.b2MulRV(qA, this.m_localXAxisA, this.m_ax);
                // m_sAx = b2Cross(d + rA, m_ax);
                this.m_sAx = box2d.b2CrossVV(box2d.b2AddVV(d, rA, box2d.b2Vec2.s_t0), this.m_ax);
                // m_sBx = b2Cross(rB, m_ax);
                this.m_sBx = box2d.b2CrossVV(rB, this.m_ax);
                var invMass = mA + mB + iA * this.m_sAx * this.m_sAx + iB * this.m_sBx * this.m_sBx;
                if (invMass > 0) {
                    this.m_springMass = 1 / invMass;
                    var C = box2d.b2DotVV(d, this.m_ax);
                    // Frequency
                    var omega = 2 * box2d.b2_pi * this.m_frequencyHz;
                    // Damping coefficient
                    var dc = 2 * this.m_springMass * this.m_dampingRatio * omega;
                    // Spring stiffness
                    var k = this.m_springMass * omega * omega;
                    // magic formulas
                    var h = data.step.dt;
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
                // Account for constiable time step.
                this.m_impulse *= data.step.dtRatio;
                this.m_springImpulse *= data.step.dtRatio;
                this.m_motorImpulse *= data.step.dtRatio;
                // b2Vec2 P = m_impulse * m_ay + m_springImpulse * m_ax;
                var P = box2d.b2AddVV(box2d.b2MulSV(this.m_impulse, this.m_ay, box2d.b2Vec2.s_t0), box2d.b2MulSV(this.m_springImpulse, this.m_ax, box2d.b2Vec2.s_t1), b2WheelJoint.InitVelocityConstraints_s_P);
                // float32 LA = m_impulse * m_sAy + m_springImpulse * m_sAx + m_motorImpulse;
                var LA = this.m_impulse * this.m_sAy + this.m_springImpulse * this.m_sAx + this.m_motorImpulse;
                // float32 LB = m_impulse * m_sBy + m_springImpulse * m_sBx + m_motorImpulse;
                var LB = this.m_impulse * this.m_sBy + this.m_springImpulse * this.m_sBx + this.m_motorImpulse;
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
        };
        b2WheelJoint.prototype.SolveVelocityConstraints = function (data) {
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // Solve spring constraint
            if (true) {
                var Cdot = box2d.b2DotVV(this.m_ax, box2d.b2SubVV(vB, vA, box2d.b2Vec2.s_t0)) + this.m_sBx * wB - this.m_sAx * wA;
                var impulse = -this.m_springMass * (Cdot + this.m_bias + this.m_gamma * this.m_springImpulse);
                this.m_springImpulse += impulse;
                // b2Vec2 P = impulse * m_ax;
                var P = box2d.b2MulSV(impulse, this.m_ax, b2WheelJoint.SolveVelocityConstraints_s_P);
                var LA = impulse * this.m_sAx;
                var LB = impulse * this.m_sBx;
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                wA -= iA * LA;
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                wB += iB * LB;
            }
            // Solve rotational motor constraint
            if (true) {
                var Cdot = wB - wA - this.m_motorSpeed;
                var impulse = -this.m_motorMass * Cdot;
                var oldImpulse = this.m_motorImpulse;
                var maxImpulse = data.step.dt * this.m_maxMotorTorque;
                this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
                impulse = this.m_motorImpulse - oldImpulse;
                wA -= iA * impulse;
                wB += iB * impulse;
            }
            // Solve point to line constraint
            if (true) {
                var Cdot = box2d.b2DotVV(this.m_ay, box2d.b2SubVV(vB, vA, box2d.b2Vec2.s_t0)) + this.m_sBy * wB - this.m_sAy * wA;
                var impulse = -this.m_mass * Cdot;
                this.m_impulse += impulse;
                // b2Vec2 P = impulse * m_ay;
                var P = box2d.b2MulSV(impulse, this.m_ay, b2WheelJoint.SolveVelocityConstraints_s_P);
                var LA = impulse * this.m_sAy;
                var LB = impulse * this.m_sBy;
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
        };
        b2WheelJoint.prototype.SolvePositionConstraints = function (data) {
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // b2Vec2 d = (cB - cA) + rB - rA;
            var d = box2d.b2AddVV(box2d.b2SubVV(cB, cA, box2d.b2Vec2.s_t0), box2d.b2SubVV(rB, rA, box2d.b2Vec2.s_t1), b2WheelJoint.SolvePositionConstraints_s_d);
            // b2Vec2 ay = b2Mul(qA, m_localYAxisA);
            var ay = box2d.b2MulRV(qA, this.m_localYAxisA, this.m_ay);
            // float32 sAy = b2Cross(d + rA, ay);
            var sAy = box2d.b2CrossVV(box2d.b2AddVV(d, rA, box2d.b2Vec2.s_t0), ay);
            // float32 sBy = b2Cross(rB, ay);
            var sBy = box2d.b2CrossVV(rB, ay);
            // float32 C = b2Dot(d, ay);
            var C = box2d.b2DotVV(d, this.m_ay);
            var k = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy;
            var impulse;
            if (k !== 0) {
                impulse = -C / k;
            }
            else {
                impulse = 0;
            }
            // b2Vec2 P = impulse * ay;
            var P = box2d.b2MulSV(impulse, ay, b2WheelJoint.SolvePositionConstraints_s_P);
            var LA = impulse * sAy;
            var LB = impulse * sBy;
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
            return box2d.b2Abs(C) <= box2d.b2_linearSlop;
        };
        b2WheelJoint.prototype.GetDefinition = function (def) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(false);
            } // TODO
            return def;
        };
        b2WheelJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2WheelJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2WheelJoint.prototype.GetReactionForce = function (inv_dt, out) {
            // return inv_dt * (m_impulse * m_ay + m_springImpulse * m_ax);
            out.x = inv_dt * (this.m_impulse * this.m_ay.x + this.m_springImpulse * this.m_ax.x);
            out.y = inv_dt * (this.m_impulse * this.m_ay.y + this.m_springImpulse * this.m_ax.y);
            return out;
        };
        b2WheelJoint.prototype.GetReactionTorque = function (inv_dt) {
            return inv_dt * this.m_motorImpulse;
        };
        b2WheelJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
        b2WheelJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
        b2WheelJoint.prototype.GetLocalAxisA = function () { return this.m_localXAxisA; };
        b2WheelJoint.prototype.GetJointTranslation = function () {
            var bA = this.m_bodyA;
            var bB = this.m_bodyB;
            var pA = bA.GetWorldPoint(this.m_localAnchorA, new box2d.b2Vec2());
            var pB = bB.GetWorldPoint(this.m_localAnchorB, new box2d.b2Vec2());
            var d = box2d.b2SubVV(pB, pA, new box2d.b2Vec2());
            var axis = bA.GetWorldVector(this.m_localXAxisA, new box2d.b2Vec2());
            var translation = box2d.b2DotVV(d, axis);
            return translation;
        };
        b2WheelJoint.prototype.GetJointSpeed = function () {
            var wA = this.m_bodyA.m_angularVelocity;
            var wB = this.m_bodyB.m_angularVelocity;
            return wB - wA;
        };
        b2WheelJoint.prototype.IsMotorEnabled = function () {
            return this.m_enableMotor;
        };
        b2WheelJoint.prototype.EnableMotor = function (flag) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableMotor = flag;
        };
        b2WheelJoint.prototype.SetMotorSpeed = function (speed) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_motorSpeed = speed;
        };
        b2WheelJoint.prototype.SetMaxMotorTorque = function (force) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_maxMotorTorque = force;
        };
        b2WheelJoint.prototype.GetMotorTorque = function (inv_dt) {
            return inv_dt * this.m_motorImpulse;
        };
        b2WheelJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2WheelJointDef = new b2WheelJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.localAxisA.Set(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
                box2d.b2Log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
                box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2WheelJoint.InitVelocityConstraints_s_d = new box2d.b2Vec2();
        b2WheelJoint.InitVelocityConstraints_s_P = new box2d.b2Vec2();
        b2WheelJoint.SolveVelocityConstraints_s_P = new box2d.b2Vec2();
        b2WheelJoint.SolvePositionConstraints_s_d = new box2d.b2Vec2();
        b2WheelJoint.SolvePositionConstraints_s_P = new box2d.b2Vec2();
        return b2WheelJoint;
    }(box2d.b2Joint));
    box2d.b2WheelJoint = b2WheelJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Mouse joint definition. This requires a world target point,
    /// tuning parameters, and the time step.
    var b2MouseJointDef = (function (_super) {
        __extends(b2MouseJointDef, _super);
        function b2MouseJointDef() {
            _super.call(this, box2d.b2JointType.e_mouseJoint); // base class constructor
            this.target = new box2d.b2Vec2();
            this.maxForce = 0;
            this.frequencyHz = 5;
            this.dampingRatio = 0.7;
        }
        return b2MouseJointDef;
    }(box2d.b2JointDef));
    box2d.b2MouseJointDef = b2MouseJointDef;
    var b2MouseJoint = (function (_super) {
        __extends(b2MouseJoint, _super);
        function b2MouseJoint(def) {
            _super.call(this, def); // base class constructor
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
            this.m_localAnchorB = new box2d.b2Vec2();
            this.m_targetA = new box2d.b2Vec2();
            this.m_impulse = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_mass = new box2d.b2Mat22();
            this.m_C = new box2d.b2Vec2();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_K = new box2d.b2Mat22();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(def.target.IsValid());
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(def.maxForce) && def.maxForce >= 0);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(def.frequencyHz) && def.frequencyHz >= 0);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(def.dampingRatio) && def.dampingRatio >= 0);
            }
            this.m_targetA.Copy(def.target);
            box2d.b2MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
            this.m_maxForce = def.maxForce;
            this.m_impulse.SetZero();
            this.m_frequencyHz = def.frequencyHz;
            this.m_dampingRatio = def.dampingRatio;
            this.m_beta = 0;
            this.m_gamma = 0;
        }
        b2MouseJoint.prototype.SetTarget = function (target) {
            if (this.m_bodyB.IsAwake() === false) {
                this.m_bodyB.SetAwake(true);
            }
            this.m_targetA.Copy(target);
        };
        b2MouseJoint.prototype.GetTarget = function () {
            return this.m_targetA;
        };
        b2MouseJoint.prototype.SetMaxForce = function (maxForce) {
            this.m_maxForce = maxForce;
        };
        b2MouseJoint.prototype.GetMaxForce = function () {
            return this.m_maxForce;
        };
        b2MouseJoint.prototype.SetFrequency = function (hz) {
            this.m_frequencyHz = hz;
        };
        b2MouseJoint.prototype.GetFrequency = function () {
            return this.m_frequencyHz;
        };
        b2MouseJoint.prototype.SetDampingRatio = function (ratio) {
            this.m_dampingRatio = ratio;
        };
        b2MouseJoint.prototype.GetDampingRatio = function () {
            return this.m_dampingRatio;
        };
        b2MouseJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIB = this.m_bodyB.m_invI;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var qB = this.m_qB.SetAngleRadians(aB);
            var mass = this.m_bodyB.GetMass();
            // Frequency
            var omega = 2 * box2d.b2_pi * this.m_frequencyHz;
            // Damping coefficient
            var d = 2 * mass * this.m_dampingRatio * omega;
            // Spring stiffness
            var k = mass * (omega * omega);
            // magic formulas
            // gamma has units of inverse mass.
            // beta has units of inverse time.
            var h = data.step.dt;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(d + h * k > box2d.b2_epsilon);
            }
            this.m_gamma = h * (d + h * k);
            if (this.m_gamma !== 0) {
                this.m_gamma = 1 / this.m_gamma;
            }
            this.m_beta = h * k * this.m_gamma;
            // Compute the effective mass matrix.
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
            //      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
            //        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
            var K = this.m_K;
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
                wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, this.m_impulse);
            }
            else {
                this.m_impulse.SetZero();
            }
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2MouseJoint.prototype.SolveVelocityConstraints = function (data) {
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // Cdot = v + cross(w, r)
            // b2Vec2 Cdot = vB + b2Cross(wB, m_rB);
            var Cdot = box2d.b2AddVCrossSV(vB, wB, this.m_rB, b2MouseJoint.SolveVelocityConstraints_s_Cdot);
            //  b2Vec2 impulse = b2Mul(m_mass, -(Cdot + m_C + m_gamma * m_impulse));
            var impulse = box2d.b2MulMV(this.m_mass, box2d.b2AddVV(Cdot, box2d.b2AddVV(this.m_C, box2d.b2MulSV(this.m_gamma, this.m_impulse, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0).SelfNeg(), b2MouseJoint.SolveVelocityConstraints_s_impulse);
            // b2Vec2 oldImpulse = m_impulse;
            var oldImpulse = b2MouseJoint.SolveVelocityConstraints_s_oldImpulse.Copy(this.m_impulse);
            // m_impulse += impulse;
            this.m_impulse.SelfAdd(impulse);
            var maxImpulse = data.step.dt * this.m_maxForce;
            if (this.m_impulse.GetLengthSquared() > maxImpulse * maxImpulse) {
                this.m_impulse.SelfMul(maxImpulse / this.m_impulse.GetLength());
            }
            // impulse = m_impulse - oldImpulse;
            box2d.b2SubVV(this.m_impulse, oldImpulse, impulse);
            // vB += m_invMassB * impulse;
            vB.SelfMulAdd(this.m_invMassB, impulse);
            wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, impulse);
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2MouseJoint.prototype.SolvePositionConstraints = function (data) {
            return true;
        };
        b2MouseJoint.prototype.GetAnchorA = function (out) {
            return out.Copy(this.m_targetA);
        };
        b2MouseJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2MouseJoint.prototype.GetReactionForce = function (inv_dt, out) {
            return box2d.b2MulSV(inv_dt, this.m_impulse, out);
        };
        b2MouseJoint.prototype.GetReactionTorque = function (inv_dt) {
            return 0;
        };
        b2MouseJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                box2d.b2Log("Mouse joint dumping is not supported.\n");
            }
        };
        b2MouseJoint.prototype.ShiftOrigin = function (newOrigin) {
            this.m_targetA.SelfSub(newOrigin);
        };
        b2MouseJoint.SolveVelocityConstraints_s_Cdot = new box2d.b2Vec2();
        b2MouseJoint.SolveVelocityConstraints_s_impulse = new box2d.b2Vec2();
        b2MouseJoint.SolveVelocityConstraints_s_oldImpulse = new box2d.b2Vec2();
        return b2MouseJoint;
    }(box2d.b2Joint));
    box2d.b2MouseJoint = b2MouseJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
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
    var b2RevoluteJointDef = (function (_super) {
        __extends(b2RevoluteJointDef, _super);
        function b2RevoluteJointDef() {
            _super.call(this, box2d.b2JointType.e_revoluteJoint); // base class constructor
            this.localAnchorA = new box2d.b2Vec2(0, 0);
            this.localAnchorB = new box2d.b2Vec2(0, 0);
            this.referenceAngle = 0;
            this.enableLimit = false;
            this.lowerAngle = 0;
            this.upperAngle = 0;
            this.enableMotor = false;
            this.motorSpeed = 0;
            this.maxMotorTorque = 0;
        }
        b2RevoluteJointDef.prototype.Initialize = function (bA, bB, anchor) {
            this.bodyA = bA;
            this.bodyB = bB;
            this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
            this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
            this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians();
        };
        return b2RevoluteJointDef;
    }(box2d.b2JointDef));
    box2d.b2RevoluteJointDef = b2RevoluteJointDef;
    var b2RevoluteJoint = (function (_super) {
        __extends(b2RevoluteJoint, _super);
        function b2RevoluteJoint(def) {
            _super.call(this, def); // base class constructor
            // Solver shared
            this.m_localAnchorA = new box2d.b2Vec2();
            this.m_localAnchorB = new box2d.b2Vec2();
            this.m_impulse = new box2d.b2Vec3();
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
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_invMassA = 0;
            this.m_invMassB = 0;
            this.m_invIA = 0;
            this.m_invIB = 0;
            this.m_mass = new box2d.b2Mat33(); // effective mass for point-to-point constraint.
            this.m_motorMass = 0; // effective mass for motor/limit angular constraint.
            this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_K = new box2d.b2Mat22();
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
            this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
        }
        b2RevoluteJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // b2Rot qA(aA), qB(aB);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // J = [-I -r1_skew I r2_skew]
            //     [ 0       -1 0       1]
            // r_skew = [-ry; rx]
            // Matlab
            // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
            //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
            //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var fixedRotation = (iA + iB === 0);
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
                var jointAngle = aB - aA - this.m_referenceAngle;
                if (box2d.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * box2d.b2_angularSlop) {
                    this.m_limitState = box2d.b2LimitState.e_equalLimits;
                }
                else if (jointAngle <= this.m_lowerAngle) {
                    if (this.m_limitState !== box2d.b2LimitState.e_atLowerLimit) {
                        this.m_impulse.z = 0;
                    }
                    this.m_limitState = box2d.b2LimitState.e_atLowerLimit;
                }
                else if (jointAngle >= this.m_upperAngle) {
                    if (this.m_limitState !== box2d.b2LimitState.e_atUpperLimit) {
                        this.m_impulse.z = 0;
                    }
                    this.m_limitState = box2d.b2LimitState.e_atUpperLimit;
                }
                else {
                    this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
                    this.m_impulse.z = 0;
                }
            }
            else {
                this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
            }
            if (data.step.warmStarting) {
                // Scale impulses to support a constiable time step.
                this.m_impulse.SelfMul(data.step.dtRatio);
                this.m_motorImpulse *= data.step.dtRatio;
                // b2Vec2 P(m_impulse.x, m_impulse.y);
                var P = b2RevoluteJoint.InitVelocityConstraints_s_P.SetXY(this.m_impulse.x, this.m_impulse.y);
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                wA -= iA * (box2d.b2CrossVV(this.m_rA, P) + this.m_motorImpulse + this.m_impulse.z);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                wB += iB * (box2d.b2CrossVV(this.m_rB, P) + this.m_motorImpulse + this.m_impulse.z);
            }
            else {
                this.m_impulse.SetZero();
                this.m_motorImpulse = 0;
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2RevoluteJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var fixedRotation = (iA + iB === 0);
            // Solve motor constraint.
            if (this.m_enableMotor && this.m_limitState !== box2d.b2LimitState.e_equalLimits && fixedRotation === false) {
                var Cdot = wB - wA - this.m_motorSpeed;
                var impulse = -this.m_motorMass * Cdot;
                var oldImpulse = this.m_motorImpulse;
                var maxImpulse = data.step.dt * this.m_maxMotorTorque;
                this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
                impulse = this.m_motorImpulse - oldImpulse;
                wA -= iA * impulse;
                wB += iB * impulse;
            }
            // Solve limit constraint.
            if (this.m_enableLimit && this.m_limitState !== box2d.b2LimitState.e_inactiveLimit && fixedRotation === false) {
                // b2Vec2 Cdot1 = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                var Cdot1 = box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, this.m_rA, box2d.b2Vec2.s_t1), b2RevoluteJoint.SolveVelocityConstraints_s_Cdot1);
                var Cdot2 = wB - wA;
                // b2Vec3 Cdot(Cdot1.x, Cdot1.y, Cdot2);
                // b2Vec3 impulse = -this.m_mass.Solve33(Cdot);
                var impulse_v3 = this.m_mass.Solve33(Cdot1.x, Cdot1.y, Cdot2, b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v3).SelfNeg();
                if (this.m_limitState === box2d.b2LimitState.e_equalLimits) {
                    this.m_impulse.SelfAdd(impulse_v3);
                }
                else if (this.m_limitState === box2d.b2LimitState.e_atLowerLimit) {
                    var newImpulse = this.m_impulse.z + impulse_v3.z;
                    if (newImpulse < 0) {
                        // b2Vec2 rhs = -Cdot1 + m_impulse.z * b2Vec2(m_mass.ez.x, m_mass.ez.y);
                        var rhs_x = -Cdot1.x + this.m_impulse.z * this.m_mass.ez.x;
                        var rhs_y = -Cdot1.y + this.m_impulse.z * this.m_mass.ez.y;
                        var reduced_v2 = this.m_mass.Solve22(rhs_x, rhs_y, b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2);
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
                else if (this.m_limitState === box2d.b2LimitState.e_atUpperLimit) {
                    var newImpulse = this.m_impulse.z + impulse_v3.z;
                    if (newImpulse > 0) {
                        // b2Vec2 rhs = -Cdot1 + m_impulse.z * b2Vec2(m_mass.ez.x, m_mass.ez.y);
                        var rhs_x = -Cdot1.x + this.m_impulse.z * this.m_mass.ez.x;
                        var rhs_y = -Cdot1.y + this.m_impulse.z * this.m_mass.ez.y;
                        var reduced_v2 = this.m_mass.Solve22(rhs_x, rhs_y, b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2);
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
                var P = b2RevoluteJoint.SolveVelocityConstraints_s_P.SetXY(impulse_v3.x, impulse_v3.y);
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                wA -= iA * (box2d.b2CrossVV(this.m_rA, P) + impulse_v3.z);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                wB += iB * (box2d.b2CrossVV(this.m_rB, P) + impulse_v3.z);
            }
            else {
                // Solve point-to-point constraint
                // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                var Cdot_v2 = box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, this.m_rA, box2d.b2Vec2.s_t1), b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2);
                // b2Vec2 impulse = m_mass.Solve22(-Cdot);
                var impulse_v2 = this.m_mass.Solve22(-Cdot_v2.x, -Cdot_v2.y, b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2);
                this.m_impulse.x += impulse_v2.x;
                this.m_impulse.y += impulse_v2.y;
                // vA -= mA * impulse;
                vA.SelfMulSub(mA, impulse_v2);
                wA -= iA * box2d.b2CrossVV(this.m_rA, impulse_v2);
                // vB += mB * impulse;
                vB.SelfMulAdd(mB, impulse_v2);
                wB += iB * box2d.b2CrossVV(this.m_rB, impulse_v2);
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2RevoluteJoint.prototype.SolvePositionConstraints = function (data) {
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            // b2Rot qA(aA), qB(aB);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            var angularError = 0;
            var positionError = 0;
            var fixedRotation = (this.m_invIA + this.m_invIB === 0);
            // Solve angular limit constraint.
            if (this.m_enableLimit && this.m_limitState !== box2d.b2LimitState.e_inactiveLimit && fixedRotation === false) {
                var angle = aB - aA - this.m_referenceAngle;
                var limitImpulse = 0;
                if (this.m_limitState === box2d.b2LimitState.e_equalLimits) {
                    // Prevent large angular corrections
                    var C = box2d.b2Clamp(angle - this.m_lowerAngle, -box2d.b2_maxAngularCorrection, box2d.b2_maxAngularCorrection);
                    limitImpulse = -this.m_motorMass * C;
                    angularError = box2d.b2Abs(C);
                }
                else if (this.m_limitState === box2d.b2LimitState.e_atLowerLimit) {
                    var C = angle - this.m_lowerAngle;
                    angularError = -C;
                    // Prevent large angular corrections and allow some slop.
                    C = box2d.b2Clamp(C + box2d.b2_angularSlop, -box2d.b2_maxAngularCorrection, 0);
                    limitImpulse = -this.m_motorMass * C;
                }
                else if (this.m_limitState === box2d.b2LimitState.e_atUpperLimit) {
                    var C = angle - this.m_upperAngle;
                    angularError = C;
                    // Prevent large angular corrections and allow some slop.
                    C = box2d.b2Clamp(C - box2d.b2_angularSlop, 0, box2d.b2_maxAngularCorrection);
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
                box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
                // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
                // b2Vec2 C = cB + rB - cA - rA;
                var C_v2 = box2d.b2SubVV(box2d.b2AddVV(cB, rB, box2d.b2Vec2.s_t0), box2d.b2AddVV(cA, rA, box2d.b2Vec2.s_t1), b2RevoluteJoint.SolvePositionConstraints_s_C_v2);
                // positionError = C.Length();
                positionError = C_v2.GetLength();
                var mA = this.m_invMassA, mB = this.m_invMassB;
                var iA = this.m_invIA, iB = this.m_invIB;
                var K = this.m_K;
                K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
                K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
                K.ey.x = K.ex.y;
                K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
                // b2Vec2 impulse = -K.Solve(C);
                var impulse = K.Solve(C_v2.x, C_v2.y, b2RevoluteJoint.SolvePositionConstraints_s_impulse).SelfNeg();
                // cA -= mA * impulse;
                cA.SelfMulSub(mA, impulse);
                aA -= iA * box2d.b2CrossVV(rA, impulse);
                // cB += mB * impulse;
                cB.SelfMulAdd(mB, impulse);
                aB += iB * box2d.b2CrossVV(rB, impulse);
            }
            // data.positions[this.m_indexA].c = cA;
            data.positions[this.m_indexA].a = aA;
            // data.positions[this.m_indexB].c = cB;
            data.positions[this.m_indexB].a = aB;
            return positionError <= box2d.b2_linearSlop && angularError <= box2d.b2_angularSlop;
        };
        b2RevoluteJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2RevoluteJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2RevoluteJoint.prototype.GetReactionForce = function (inv_dt, out) {
            // b2Vec2 P(this.m_impulse.x, this.m_impulse.y);
            // return inv_dt * P;
            return out.SetXY(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
        };
        b2RevoluteJoint.prototype.GetReactionTorque = function (inv_dt) {
            return inv_dt * this.m_impulse.z;
        };
        b2RevoluteJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
        b2RevoluteJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
        b2RevoluteJoint.prototype.GetReferenceAngle = function () { return this.m_referenceAngle; };
        b2RevoluteJoint.prototype.GetJointAngleRadians = function () {
            // b2Body* bA = this.m_bodyA;
            // b2Body* bB = this.m_bodyB;
            // return bB->this.m_sweep.a - bA->this.m_sweep.a - this.m_referenceAngle;
            return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
        };
        b2RevoluteJoint.prototype.GetJointSpeed = function () {
            // b2Body* bA = this.m_bodyA;
            // b2Body* bB = this.m_bodyB;
            // return bB->this.m_angularVelocity - bA->this.m_angularVelocity;
            return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
        };
        b2RevoluteJoint.prototype.IsMotorEnabled = function () {
            return this.m_enableMotor;
        };
        b2RevoluteJoint.prototype.EnableMotor = function (flag) {
            if (this.m_enableMotor !== flag) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_enableMotor = flag;
            }
        };
        b2RevoluteJoint.prototype.GetMotorTorque = function (inv_dt) {
            return inv_dt * this.m_motorImpulse;
        };
        b2RevoluteJoint.prototype.GetMotorSpeed = function () {
            return this.m_motorSpeed;
        };
        b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
            this.m_maxMotorTorque = torque;
        };
        b2RevoluteJoint.prototype.GetMaxMotorTorque = function () { return this.m_maxMotorTorque; };
        b2RevoluteJoint.prototype.IsLimitEnabled = function () {
            return this.m_enableLimit;
        };
        b2RevoluteJoint.prototype.EnableLimit = function (flag) {
            if (flag !== this.m_enableLimit) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_enableLimit = flag;
                this.m_impulse.z = 0;
            }
        };
        b2RevoluteJoint.prototype.GetLowerLimit = function () {
            return this.m_lowerAngle;
        };
        b2RevoluteJoint.prototype.GetUpperLimit = function () {
            return this.m_upperAngle;
        };
        b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
            if (lower !== this.m_lowerAngle || upper !== this.m_upperAngle) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_impulse.z = 0;
                this.m_lowerAngle = lower;
                this.m_upperAngle = upper;
            }
        };
        b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
            if (this.m_motorSpeed !== speed) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_motorSpeed = speed;
            }
        };
        b2RevoluteJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2RevoluteJointDef = new b2RevoluteJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                box2d.b2Log("  jd.enableLimit = %s;\n", (this.m_enableLimit) ? ("true") : ("false"));
                box2d.b2Log("  jd.lowerAngle = %.15f;\n", this.m_lowerAngle);
                box2d.b2Log("  jd.upperAngle = %.15f;\n", this.m_upperAngle);
                box2d.b2Log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                box2d.b2Log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2RevoluteJoint.InitVelocityConstraints_s_P = new box2d.b2Vec2();
        b2RevoluteJoint.SolveVelocityConstraints_s_P = new box2d.b2Vec2();
        b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2 = new box2d.b2Vec2();
        b2RevoluteJoint.SolveVelocityConstraints_s_Cdot1 = new box2d.b2Vec2();
        b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v3 = new box2d.b2Vec3();
        b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2 = new box2d.b2Vec2();
        b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2 = new box2d.b2Vec2();
        b2RevoluteJoint.SolvePositionConstraints_s_C_v2 = new box2d.b2Vec2();
        b2RevoluteJoint.SolvePositionConstraints_s_impulse = new box2d.b2Vec2();
        return b2RevoluteJoint;
    }(box2d.b2Joint));
    box2d.b2RevoluteJoint = b2RevoluteJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Prismatic joint definition. This requires defining a line of
    /// motion using an axis and an anchor point. The definition uses local
    /// anchor points and a local axis so that the initial configuration
    /// can violate the constraint slightly. The joint translation is zero
    /// when the local anchor points coincide in world space. Using local
    /// anchors and a local axis helps when saving and loading a game.
    var b2PrismaticJointDef = (function (_super) {
        __extends(b2PrismaticJointDef, _super);
        function b2PrismaticJointDef() {
            _super.call(this, box2d.b2JointType.e_prismaticJoint); // base class constructor
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
            this.localAnchorA = new box2d.b2Vec2();
            this.localAnchorB = new box2d.b2Vec2();
            this.localAxisA = new box2d.b2Vec2(1, 0);
        }
        b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
            this.bodyA = bA;
            this.bodyB = bB;
            this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
            this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
            this.bodyA.GetLocalVector(axis, this.localAxisA);
            this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians();
        };
        return b2PrismaticJointDef;
    }(box2d.b2JointDef));
    box2d.b2PrismaticJointDef = b2PrismaticJointDef;
    var b2PrismaticJoint = (function (_super) {
        __extends(b2PrismaticJoint, _super);
        function b2PrismaticJoint(def) {
            _super.call(this, def); // base class constructor
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
            this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
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
            this.m_localYAxisA = box2d.b2CrossOneV(this.m_localXAxisA, new box2d.b2Vec2());
            this.m_referenceAngle = def.referenceAngle;
            this.m_impulse = new box2d.b2Vec3(0, 0, 0);
            this.m_lowerTranslation = def.lowerTranslation;
            this.m_upperTranslation = def.upperTranslation;
            this.m_maxMotorForce = def.maxMotorForce;
            this.m_motorSpeed = def.motorSpeed;
            this.m_enableLimit = def.enableLimit;
            this.m_enableMotor = def.enableMotor;
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_axis = new box2d.b2Vec2(0, 0);
            this.m_perp = new box2d.b2Vec2(0, 0);
            this.m_K = new box2d.b2Mat33();
            this.m_K3 = new box2d.b2Mat33();
            this.m_K2 = new box2d.b2Mat22();
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
        }
        b2PrismaticJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // Compute the effective masses.
            // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // b2Vec2 d = (cB - cA) + rB - rA;
            var d = box2d.b2AddVV(box2d.b2SubVV(cB, cA, box2d.b2Vec2.s_t0), box2d.b2SubVV(rB, rA, box2d.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_d);
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            // Compute motor Jacobian and effective mass.
            {
                // m_axis = b2Mul(qA, m_localXAxisA);
                box2d.b2MulRV(qA, this.m_localXAxisA, this.m_axis);
                // m_a1 = b2Cross(d + rA, m_axis);
                this.m_a1 = box2d.b2CrossVV(box2d.b2AddVV(d, rA, box2d.b2Vec2.s_t0), this.m_axis);
                // m_a2 = b2Cross(rB, m_axis);
                this.m_a2 = box2d.b2CrossVV(rB, this.m_axis);
                this.m_motorMass = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
                if (this.m_motorMass > 0) {
                    this.m_motorMass = 1 / this.m_motorMass;
                }
            }
            // Prismatic constraint.
            {
                // m_perp = b2Mul(qA, m_localYAxisA);
                box2d.b2MulRV(qA, this.m_localYAxisA, this.m_perp);
                // m_s1 = b2Cross(d + rA, m_perp);
                this.m_s1 = box2d.b2CrossVV(box2d.b2AddVV(d, rA, box2d.b2Vec2.s_t0), this.m_perp);
                // m_s2 = b2Cross(rB, m_perp);
                this.m_s2 = box2d.b2CrossVV(rB, this.m_perp);
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
                var jointTranslation = box2d.b2DotVV(this.m_axis, d);
                if (box2d.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * box2d.b2_linearSlop) {
                    this.m_limitState = box2d.b2LimitState.e_equalLimits;
                }
                else if (jointTranslation <= this.m_lowerTranslation) {
                    if (this.m_limitState !== box2d.b2LimitState.e_atLowerLimit) {
                        this.m_limitState = box2d.b2LimitState.e_atLowerLimit;
                        this.m_impulse.z = 0;
                    }
                }
                else if (jointTranslation >= this.m_upperTranslation) {
                    if (this.m_limitState !== box2d.b2LimitState.e_atUpperLimit) {
                        this.m_limitState = box2d.b2LimitState.e_atUpperLimit;
                        this.m_impulse.z = 0;
                    }
                }
                else {
                    this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
                    this.m_impulse.z = 0;
                }
            }
            else {
                this.m_limitState = box2d.b2LimitState.e_inactiveLimit;
                this.m_impulse.z = 0;
            }
            if (this.m_enableMotor === false) {
                this.m_motorImpulse = 0;
            }
            if (data.step.warmStarting) {
                // Account for constiable time step.
                // m_impulse *= data.step.dtRatio;
                this.m_impulse.SelfMul(data.step.dtRatio);
                this.m_motorImpulse *= data.step.dtRatio;
                // b2Vec2 P = m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis;
                var P = box2d.b2AddVV(box2d.b2MulSV(this.m_impulse.x, this.m_perp, box2d.b2Vec2.s_t0), box2d.b2MulSV((this.m_motorImpulse + this.m_impulse.z), this.m_axis, box2d.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_P);
                // float32 LA = m_impulse.x * m_s1 + m_impulse.y + (m_motorImpulse + m_impulse.z) * m_a1;
                var LA = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
                // float32 LB = m_impulse.x * m_s2 + m_impulse.y + (m_motorImpulse + m_impulse.z) * m_a2;
                var LB = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
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
        };
        b2PrismaticJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            // Solve linear motor constraint.
            if (this.m_enableMotor && this.m_limitState !== box2d.b2LimitState.e_equalLimits) {
                // float32 Cdot = b2Dot(m_axis, vB - vA) + m_a2 * wB - m_a1 * wA;
                var Cdot = box2d.b2DotVV(this.m_axis, box2d.b2SubVV(vB, vA, box2d.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
                var oldImpulse = this.m_motorImpulse;
                var maxImpulse = data.step.dt * this.m_maxMotorForce;
                this.m_motorImpulse = box2d.b2Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
                impulse = this.m_motorImpulse - oldImpulse;
                // b2Vec2 P = impulse * m_axis;
                var P = box2d.b2MulSV(impulse, this.m_axis, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                var LA = impulse * this.m_a1;
                var LB = impulse * this.m_a2;
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                wA -= iA * LA;
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                wB += iB * LB;
            }
            // b2Vec2 Cdot1;
            // Cdot1.x = b2Dot(m_perp, vB - vA) + m_s2 * wB - m_s1 * wA;
            var Cdot1_x = box2d.b2DotVV(this.m_perp, box2d.b2SubVV(vB, vA, box2d.b2Vec2.s_t0)) + this.m_s2 * wB - this.m_s1 * wA;
            // Cdot1.y = wB - wA;
            var Cdot1_y = wB - wA;
            if (this.m_enableLimit && this.m_limitState !== box2d.b2LimitState.e_inactiveLimit) {
                // Solve prismatic and limit constraint in block form.
                // float32 Cdot2;
                // Cdot2 = b2Dot(m_axis, vB - vA) + m_a2 * wB - m_a1 * wA;
                var Cdot2 = box2d.b2DotVV(this.m_axis, box2d.b2SubVV(vB, vA, box2d.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                // b2Vec3 Cdot(Cdot1.x, Cdot1.y, Cdot2);
                // b2Vec3 f1 = m_impulse;
                var f1 = b2PrismaticJoint.SolveVelocityConstraints_s_f1.Copy(this.m_impulse);
                // b2Vec3 df =  m_K.Solve33(-Cdot);
                var df3 = this.m_K.Solve33((-Cdot1_x), (-Cdot1_y), (-Cdot2), b2PrismaticJoint.SolveVelocityConstraints_s_df3);
                // m_impulse += df;
                this.m_impulse.SelfAdd(df3);
                if (this.m_limitState === box2d.b2LimitState.e_atLowerLimit) {
                    this.m_impulse.z = box2d.b2Max(this.m_impulse.z, 0);
                }
                else if (this.m_limitState === box2d.b2LimitState.e_atUpperLimit) {
                    this.m_impulse.z = box2d.b2Min(this.m_impulse.z, 0);
                }
                // f2(1:2) = invK(1:2,1:2) * (-Cdot(1:2) - K(1:2,3) * (f2(3) - f1(3))) + f1(1:2)
                // b2Vec2 b = -Cdot1 - (m_impulse.z - f1.z) * b2Vec2(m_K.ez.x, m_K.ez.y);
                var b_x = (-Cdot1_x) - (this.m_impulse.z - f1.z) * this.m_K.ez.x;
                var b_y = (-Cdot1_y) - (this.m_impulse.z - f1.z) * this.m_K.ez.y;
                // b2Vec2 f2r = m_K.Solve22(b) + b2Vec2(f1.x, f1.y);
                var f2r = this.m_K.Solve22(b_x, b_y, b2PrismaticJoint.SolveVelocityConstraints_s_f2r);
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
                var P = box2d.b2AddVV(box2d.b2MulSV(df3.x, this.m_perp, box2d.b2Vec2.s_t0), box2d.b2MulSV(df3.z, this.m_axis, box2d.b2Vec2.s_t1), b2PrismaticJoint.SolveVelocityConstraints_s_P);
                // float32 LA = df.x * m_s1 + df.y + df.z * m_a1;
                var LA = df3.x * this.m_s1 + df3.y + df3.z * this.m_a1;
                // float32 LB = df.x * m_s2 + df.y + df.z * m_a2;
                var LB = df3.x * this.m_s2 + df3.y + df3.z * this.m_a2;
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
                var df2 = this.m_K.Solve22((-Cdot1_x), (-Cdot1_y), b2PrismaticJoint.SolveVelocityConstraints_s_df2);
                this.m_impulse.x += df2.x;
                this.m_impulse.y += df2.y;
                // b2Vec2 P = df.x * m_perp;
                var P = box2d.b2MulSV(df2.x, this.m_perp, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                // float32 LA = df.x * m_s1 + df.y;
                var LA = df2.x * this.m_s1 + df2.y;
                // float32 LB = df.x * m_s2 + df.y;
                var LB = df2.x * this.m_s2 + df2.y;
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
        };
        b2PrismaticJoint.prototype.SolvePositionConstraints = function (data) {
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // b2Vec2 d = cB + rB - cA - rA;
            var d = box2d.b2SubVV(box2d.b2AddVV(cB, rB, box2d.b2Vec2.s_t0), box2d.b2AddVV(cA, rA, box2d.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_d);
            // b2Vec2 axis = b2Mul(qA, m_localXAxisA);
            var axis = box2d.b2MulRV(qA, this.m_localXAxisA, this.m_axis);
            // float32 a1 = b2Cross(d + rA, axis);
            var a1 = box2d.b2CrossVV(box2d.b2AddVV(d, rA, box2d.b2Vec2.s_t0), axis);
            // float32 a2 = b2Cross(rB, axis);
            var a2 = box2d.b2CrossVV(rB, axis);
            // b2Vec2 perp = b2Mul(qA, m_localYAxisA);
            var perp = box2d.b2MulRV(qA, this.m_localYAxisA, this.m_perp);
            // float32 s1 = b2Cross(d + rA, perp);
            var s1 = box2d.b2CrossVV(box2d.b2AddVV(d, rA, box2d.b2Vec2.s_t0), perp);
            // float32 s2 = b2Cross(rB, perp);
            var s2 = box2d.b2CrossVV(rB, perp);
            // b2Vec3 impulse;
            var impulse = b2PrismaticJoint.SolvePositionConstraints_s_impulse;
            // b2Vec2 C1;
            // C1.x = b2Dot(perp, d);
            var C1_x = box2d.b2DotVV(perp, d);
            // C1.y = aB - aA - m_referenceAngle;
            var C1_y = aB - aA - this.m_referenceAngle;
            var linearError = box2d.b2Abs(C1_x);
            var angularError = box2d.b2Abs(C1_y);
            var active = false;
            var C2 = 0;
            if (this.m_enableLimit) {
                // float32 translation = b2Dot(axis, d);
                var translation = box2d.b2DotVV(axis, d);
                if (box2d.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * box2d.b2_linearSlop) {
                    // Prevent large angular corrections
                    C2 = box2d.b2Clamp(translation, (-box2d.b2_maxLinearCorrection), box2d.b2_maxLinearCorrection);
                    linearError = box2d.b2Max(linearError, box2d.b2Abs(translation));
                    active = true;
                }
                else if (translation <= this.m_lowerTranslation) {
                    // Prevent large linear corrections and allow some slop.
                    C2 = box2d.b2Clamp(translation - this.m_lowerTranslation + box2d.b2_linearSlop, (-box2d.b2_maxLinearCorrection), 0);
                    linearError = box2d.b2Max(linearError, this.m_lowerTranslation - translation);
                    active = true;
                }
                else if (translation >= this.m_upperTranslation) {
                    // Prevent large linear corrections and allow some slop.
                    C2 = box2d.b2Clamp(translation - this.m_upperTranslation - box2d.b2_linearSlop, 0, box2d.b2_maxLinearCorrection);
                    linearError = box2d.b2Max(linearError, translation - this.m_upperTranslation);
                    active = true;
                }
            }
            if (active) {
                // float32 k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                var k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                // float32 k12 = iA * s1 + iB * s2;
                var k12 = iA * s1 + iB * s2;
                // float32 k13 = iA * s1 * a1 + iB * s2 * a2;
                var k13 = iA * s1 * a1 + iB * s2 * a2;
                // float32 k22 = iA + iB;
                var k22 = iA + iB;
                if (k22 === 0) {
                    // For fixed rotation
                    k22 = 1;
                }
                // float32 k23 = iA * a1 + iB * a2;
                var k23 = iA * a1 + iB * a2;
                // float32 k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;
                var k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;
                // b2Mat33 K;
                var K = this.m_K3;
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
                var k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                // float32 k12 = iA * s1 + iB * s2;
                var k12 = iA * s1 + iB * s2;
                // float32 k22 = iA + iB;
                var k22 = iA + iB;
                if (k22 === 0) {
                    k22 = 1;
                }
                // b2Mat22 K;
                var K2 = this.m_K2;
                // K.ex.Set(k11, k12);
                K2.ex.SetXY(k11, k12);
                // K.ey.Set(k12, k22);
                K2.ey.SetXY(k12, k22);
                // b2Vec2 impulse1 = K.Solve(-C1);
                var impulse1 = K2.Solve((-C1_x), (-C1_y), b2PrismaticJoint.SolvePositionConstraints_s_impulse1);
                impulse.x = impulse1.x;
                impulse.y = impulse1.y;
                impulse.z = 0;
            }
            // b2Vec2 P = impulse.x * perp + impulse.z * axis;
            var P = box2d.b2AddVV(box2d.b2MulSV(impulse.x, perp, box2d.b2Vec2.s_t0), box2d.b2MulSV(impulse.z, axis, box2d.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_P);
            // float32 LA = impulse.x * s1 + impulse.y + impulse.z * a1;
            var LA = impulse.x * s1 + impulse.y + impulse.z * a1;
            // float32 LB = impulse.x * s2 + impulse.y + impulse.z * a2;
            var LB = impulse.x * s2 + impulse.y + impulse.z * a2;
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
            return linearError <= box2d.b2_linearSlop && angularError <= box2d.b2_angularSlop;
        };
        b2PrismaticJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2PrismaticJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2PrismaticJoint.prototype.GetReactionForce = function (inv_dt, out) {
            // return inv_dt * (m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis);
            return out.SetXY(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
        };
        b2PrismaticJoint.prototype.GetReactionTorque = function (inv_dt) {
            return inv_dt * this.m_impulse.y;
        };
        b2PrismaticJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
        b2PrismaticJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
        b2PrismaticJoint.prototype.GetLocalAxisA = function () { return this.m_localXAxisA; };
        b2PrismaticJoint.prototype.GetReferenceAngle = function () { return this.m_referenceAngle; };
        b2PrismaticJoint.prototype.GetJointTranslation = function () {
            // b2Vec2 pA = m_bodyA.GetWorldPoint(m_localAnchorA);
            var pA = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, b2PrismaticJoint.GetJointTranslation_s_pA);
            // b2Vec2 pB = m_bodyB.GetWorldPoint(m_localAnchorB);
            var pB = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, b2PrismaticJoint.GetJointTranslation_s_pB);
            // b2Vec2 d = pB - pA;
            var d = box2d.b2SubVV(pB, pA, b2PrismaticJoint.GetJointTranslation_s_d);
            // b2Vec2 axis = m_bodyA.GetWorldVector(m_localXAxisA);
            var axis = this.m_bodyA.GetWorldVector(this.m_localXAxisA, b2PrismaticJoint.GetJointTranslation_s_axis);
            // float32 translation = b2Dot(d, axis);
            var translation = box2d.b2DotVV(d, axis);
            return translation;
        };
        b2PrismaticJoint.prototype.GetJointSpeed = function () {
            var bA = this.m_bodyA;
            var bB = this.m_bodyB;
            // b2Vec2 rA = b2Mul(bA->m_xf.q, m_localAnchorA - bA->m_sweep.localCenter);
            box2d.b2SubVV(this.m_localAnchorA, bA.m_sweep.localCenter, this.m_lalcA);
            var rA = box2d.b2MulRV(bA.m_xf.q, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(bB->m_xf.q, m_localAnchorB - bB->m_sweep.localCenter);
            box2d.b2SubVV(this.m_localAnchorB, bB.m_sweep.localCenter, this.m_lalcB);
            var rB = box2d.b2MulRV(bB.m_xf.q, this.m_lalcB, this.m_rB);
            // b2Vec2 pA = bA->m_sweep.c + rA;
            var pA = box2d.b2AddVV(bA.m_sweep.c, rA, box2d.b2Vec2.s_t0); // pA uses s_t0
            // b2Vec2 pB = bB->m_sweep.c + rB;
            var pB = box2d.b2AddVV(bB.m_sweep.c, rB, box2d.b2Vec2.s_t1); // pB uses s_t1
            // b2Vec2 d = pB - pA;
            var d = box2d.b2SubVV(pB, pA, box2d.b2Vec2.s_t2); // d uses s_t2
            // b2Vec2 axis = b2Mul(bA.m_xf.q, m_localXAxisA);
            var axis = bA.GetWorldVector(this.m_localXAxisA, this.m_axis);
            var vA = bA.m_linearVelocity;
            var vB = bB.m_linearVelocity;
            var wA = bA.m_angularVelocity;
            var wB = bB.m_angularVelocity;
            // float32 speed = b2Dot(d, b2Cross(wA, axis)) + b2Dot(axis, vB + b2Cross(wB, rB) - vA - b2Cross(wA, rA));
            var speed = box2d.b2DotVV(d, box2d.b2CrossSV(wA, axis, box2d.b2Vec2.s_t0)) +
                box2d.b2DotVV(axis, box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, rA, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0));
            return speed;
        };
        b2PrismaticJoint.prototype.IsLimitEnabled = function () {
            return this.m_enableLimit;
        };
        b2PrismaticJoint.prototype.EnableLimit = function (flag) {
            if (flag !== this.m_enableLimit) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_enableLimit = flag;
                this.m_impulse.z = 0;
            }
        };
        b2PrismaticJoint.prototype.GetLowerLimit = function () {
            return this.m_lowerTranslation;
        };
        b2PrismaticJoint.prototype.GetUpperLimit = function () {
            return this.m_upperTranslation;
        };
        b2PrismaticJoint.prototype.SetLimits = function (lower, upper) {
            if (lower !== this.m_lowerTranslation || upper !== this.m_upperTranslation) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_lowerTranslation = lower;
                this.m_upperTranslation = upper;
                this.m_impulse.z = 0;
            }
        };
        b2PrismaticJoint.prototype.IsMotorEnabled = function () {
            return this.m_enableMotor;
        };
        b2PrismaticJoint.prototype.EnableMotor = function (flag) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_enableMotor = flag;
        };
        b2PrismaticJoint.prototype.SetMotorSpeed = function (speed) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_motorSpeed = speed;
        };
        b2PrismaticJoint.prototype.GetMotorSpeed = function () {
            return this.m_motorSpeed;
        };
        b2PrismaticJoint.prototype.SetMaxMotorForce = function (force) {
            this.m_bodyA.SetAwake(true);
            this.m_bodyB.SetAwake(true);
            this.m_maxMotorForce = force;
        };
        b2PrismaticJoint.prototype.GetMaxMotorForce = function () { return this.m_maxMotorForce; };
        b2PrismaticJoint.prototype.GetMotorForce = function (inv_dt) {
            return inv_dt * this.m_motorImpulse;
        };
        b2PrismaticJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2PrismaticJointDef = new b2PrismaticJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.localAxisA.SetXY(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
                box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                box2d.b2Log("  jd.enableLimit = %s;\n", (this.m_enableLimit) ? ("true") : ("false"));
                box2d.b2Log("  jd.lowerTranslation = %.15f;\n", this.m_lowerTranslation);
                box2d.b2Log("  jd.upperTranslation = %.15f;\n", this.m_upperTranslation);
                box2d.b2Log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                box2d.b2Log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                box2d.b2Log("  jd.maxMotorForce = %.15f;\n", this.m_maxMotorForce);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2PrismaticJoint.InitVelocityConstraints_s_d = new box2d.b2Vec2();
        b2PrismaticJoint.InitVelocityConstraints_s_P = new box2d.b2Vec2();
        b2PrismaticJoint.SolveVelocityConstraints_s_P = new box2d.b2Vec2();
        b2PrismaticJoint.SolveVelocityConstraints_s_f2r = new box2d.b2Vec2();
        b2PrismaticJoint.SolveVelocityConstraints_s_f1 = new box2d.b2Vec3();
        b2PrismaticJoint.SolveVelocityConstraints_s_df3 = new box2d.b2Vec3();
        b2PrismaticJoint.SolveVelocityConstraints_s_df2 = new box2d.b2Vec2();
        b2PrismaticJoint.SolvePositionConstraints_s_d = new box2d.b2Vec2();
        b2PrismaticJoint.SolvePositionConstraints_s_impulse = new box2d.b2Vec3();
        b2PrismaticJoint.SolvePositionConstraints_s_impulse1 = new box2d.b2Vec2();
        b2PrismaticJoint.SolvePositionConstraints_s_P = new box2d.b2Vec2();
        b2PrismaticJoint.GetJointTranslation_s_pA = new box2d.b2Vec2();
        b2PrismaticJoint.GetJointTranslation_s_pB = new box2d.b2Vec2();
        b2PrismaticJoint.GetJointTranslation_s_d = new box2d.b2Vec2();
        b2PrismaticJoint.GetJointTranslation_s_axis = new box2d.b2Vec2();
        return b2PrismaticJoint;
    }(box2d.b2Joint));
    box2d.b2PrismaticJoint = b2PrismaticJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    box2d.b2_minPulleyLength = 2;
    /// Pulley joint definition. This requires two ground anchors,
    /// two dynamic body anchor points, and a pulley ratio.
    var b2PulleyJointDef = (function (_super) {
        __extends(b2PulleyJointDef, _super);
        function b2PulleyJointDef() {
            _super.call(this, box2d.b2JointType.e_pulleyJoint); // base class constructor
            this.groundAnchorA = new box2d.b2Vec2(-1, 1);
            this.groundAnchorB = new box2d.b2Vec2(1, 1);
            this.localAnchorA = new box2d.b2Vec2(-1, 0);
            this.localAnchorB = new box2d.b2Vec2(1, 0);
            this.lengthA = 0;
            this.lengthB = 0;
            this.ratio = 1;
            this.collideConnected = true;
        }
        b2PulleyJointDef.prototype.Initialize = function (bA, bB, groundA, groundB, anchorA, anchorB, r) {
            this.bodyA = bA;
            this.bodyB = bB;
            this.groundAnchorA.Copy(groundA);
            this.groundAnchorB.Copy(groundB);
            this.bodyA.GetLocalPoint(anchorA, this.localAnchorA);
            this.bodyB.GetLocalPoint(anchorB, this.localAnchorB);
            this.lengthA = box2d.b2DistanceVV(anchorA, groundA);
            this.lengthB = box2d.b2DistanceVV(anchorB, groundB);
            this.ratio = r;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.ratio > box2d.b2_epsilon);
            }
        };
        return b2PulleyJointDef;
    }(box2d.b2JointDef));
    box2d.b2PulleyJointDef = b2PulleyJointDef;
    var b2PulleyJoint = (function (_super) {
        __extends(b2PulleyJoint, _super);
        function b2PulleyJoint(def) {
            _super.call(this, def); // base class constructor
            this.m_groundAnchorA = new box2d.b2Vec2();
            this.m_groundAnchorB = new box2d.b2Vec2();
            this.m_lengthA = 0;
            this.m_lengthB = 0;
            // Solver shared
            this.m_localAnchorA = new box2d.b2Vec2();
            this.m_localAnchorB = new box2d.b2Vec2();
            this.m_constant = 0;
            this.m_ratio = 0;
            this.m_impulse = 0;
            // Solver temp
            this.m_indexA = 0;
            this.m_indexB = 0;
            this.m_uA = new box2d.b2Vec2();
            this.m_uB = new box2d.b2Vec2();
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_invMassA = 0;
            this.m_invMassB = 0;
            this.m_invIA = 0;
            this.m_invIB = 0;
            this.m_mass = 0;
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_groundAnchorA.Copy(def.groundAnchorA);
            this.m_groundAnchorB.Copy(def.groundAnchorB);
            this.m_localAnchorA.Copy(def.localAnchorA);
            this.m_localAnchorB.Copy(def.localAnchorB);
            this.m_lengthA = def.lengthA;
            this.m_lengthB = def.lengthB;
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(def.ratio !== 0);
            }
            this.m_ratio = def.ratio;
            this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
            this.m_impulse = 0;
        }
        b2PulleyJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // b2Rot qA(aA), qB(aB);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // Get the pulley axes.
            // m_uA = cA + m_rA - m_groundAnchorA;
            this.m_uA.Copy(cA).SelfAdd(this.m_rA).SelfSub(this.m_groundAnchorA);
            // m_uB = cB + m_rB - m_groundAnchorB;
            this.m_uB.Copy(cB).SelfAdd(this.m_rB).SelfSub(this.m_groundAnchorB);
            var lengthA = this.m_uA.GetLength();
            var lengthB = this.m_uB.GetLength();
            if (lengthA > 10 * box2d.b2_linearSlop) {
                this.m_uA.SelfMul(1 / lengthA);
            }
            else {
                this.m_uA.SetZero();
            }
            if (lengthB > 10 * box2d.b2_linearSlop) {
                this.m_uB.SelfMul(1 / lengthB);
            }
            else {
                this.m_uB.SetZero();
            }
            // Compute effective mass.
            var ruA = box2d.b2CrossVV(this.m_rA, this.m_uA);
            var ruB = box2d.b2CrossVV(this.m_rB, this.m_uB);
            var mA = this.m_invMassA + this.m_invIA * ruA * ruA;
            var mB = this.m_invMassB + this.m_invIB * ruB * ruB;
            this.m_mass = mA + this.m_ratio * this.m_ratio * mB;
            if (this.m_mass > 0) {
                this.m_mass = 1 / this.m_mass;
            }
            if (data.step.warmStarting) {
                // Scale impulses to support constiable time steps.
                this.m_impulse *= data.step.dtRatio;
                // Warm starting.
                // b2Vec2 PA = -(m_impulse) * m_uA;
                var PA = box2d.b2MulSV(-(this.m_impulse), this.m_uA, b2PulleyJoint.InitVelocityConstraints_s_PA);
                // b2Vec2 PB = (-m_ratio * m_impulse) * m_uB;
                var PB = box2d.b2MulSV((-this.m_ratio * this.m_impulse), this.m_uB, b2PulleyJoint.InitVelocityConstraints_s_PB);
                // vA += m_invMassA * PA;
                vA.SelfMulAdd(this.m_invMassA, PA);
                wA += this.m_invIA * box2d.b2CrossVV(this.m_rA, PA);
                // vB += m_invMassB * PB;
                vB.SelfMulAdd(this.m_invMassB, PB);
                wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, PB);
            }
            else {
                this.m_impulse = 0;
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2PulleyJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
            var vpA = box2d.b2AddVCrossSV(vA, wA, this.m_rA, b2PulleyJoint.SolveVelocityConstraints_s_vpA);
            // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
            var vpB = box2d.b2AddVCrossSV(vB, wB, this.m_rB, b2PulleyJoint.SolveVelocityConstraints_s_vpB);
            var Cdot = -box2d.b2DotVV(this.m_uA, vpA) - this.m_ratio * box2d.b2DotVV(this.m_uB, vpB);
            var impulse = -this.m_mass * Cdot;
            this.m_impulse += impulse;
            // b2Vec2 PA = -impulse * m_uA;
            var PA = box2d.b2MulSV(-impulse, this.m_uA, b2PulleyJoint.SolveVelocityConstraints_s_PA);
            // b2Vec2 PB = -m_ratio * impulse * m_uB;
            var PB = box2d.b2MulSV(-this.m_ratio * impulse, this.m_uB, b2PulleyJoint.SolveVelocityConstraints_s_PB);
            // vA += m_invMassA * PA;
            vA.SelfMulAdd(this.m_invMassA, PA);
            wA += this.m_invIA * box2d.b2CrossVV(this.m_rA, PA);
            // vB += m_invMassB * PB;
            vB.SelfMulAdd(this.m_invMassB, PB);
            wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, PB);
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2PulleyJoint.prototype.SolvePositionConstraints = function (data) {
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            // b2Rot qA(aA), qB(aB);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // Get the pulley axes.
            // b2Vec2 uA = cA + rA - m_groundAnchorA;
            var uA = this.m_uA.Copy(cA).SelfAdd(rA).SelfSub(this.m_groundAnchorA);
            // b2Vec2 uB = cB + rB - m_groundAnchorB;
            var uB = this.m_uB.Copy(cB).SelfAdd(rB).SelfSub(this.m_groundAnchorB);
            var lengthA = uA.GetLength();
            var lengthB = uB.GetLength();
            if (lengthA > 10 * box2d.b2_linearSlop) {
                uA.SelfMul(1 / lengthA);
            }
            else {
                uA.SetZero();
            }
            if (lengthB > 10 * box2d.b2_linearSlop) {
                uB.SelfMul(1 / lengthB);
            }
            else {
                uB.SetZero();
            }
            // Compute effective mass.
            var ruA = box2d.b2CrossVV(rA, uA);
            var ruB = box2d.b2CrossVV(rB, uB);
            var mA = this.m_invMassA + this.m_invIA * ruA * ruA;
            var mB = this.m_invMassB + this.m_invIB * ruB * ruB;
            var mass = mA + this.m_ratio * this.m_ratio * mB;
            if (mass > 0) {
                mass = 1 / mass;
            }
            var C = this.m_constant - lengthA - this.m_ratio * lengthB;
            var linearError = box2d.b2Abs(C);
            var impulse = -mass * C;
            // b2Vec2 PA = -impulse * uA;
            var PA = box2d.b2MulSV(-impulse, uA, b2PulleyJoint.SolvePositionConstraints_s_PA);
            // b2Vec2 PB = -m_ratio * impulse * uB;
            var PB = box2d.b2MulSV(-this.m_ratio * impulse, uB, b2PulleyJoint.SolvePositionConstraints_s_PB);
            // cA += m_invMassA * PA;
            cA.SelfMulAdd(this.m_invMassA, PA);
            aA += this.m_invIA * box2d.b2CrossVV(rA, PA);
            // cB += m_invMassB * PB;
            cB.SelfMulAdd(this.m_invMassB, PB);
            aB += this.m_invIB * box2d.b2CrossVV(rB, PB);
            // data.positions[this.m_indexA].c = cA;
            data.positions[this.m_indexA].a = aA;
            // data.positions[this.m_indexB].c = cB;
            data.positions[this.m_indexB].a = aB;
            return linearError < box2d.b2_linearSlop;
        };
        b2PulleyJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2PulleyJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2PulleyJoint.prototype.GetReactionForce = function (inv_dt, out) {
            // b2Vec2 P = m_impulse * m_uB;
            // return inv_dt * P;
            return out.SetXY(inv_dt * this.m_impulse * this.m_uB.x, inv_dt * this.m_impulse * this.m_uB.y);
        };
        b2PulleyJoint.prototype.GetReactionTorque = function (inv_dt) {
            return 0;
        };
        b2PulleyJoint.prototype.GetGroundAnchorA = function () {
            return this.m_groundAnchorA;
        };
        b2PulleyJoint.prototype.GetGroundAnchorB = function () {
            return this.m_groundAnchorB;
        };
        b2PulleyJoint.prototype.GetLengthA = function () {
            return this.m_lengthA;
        };
        b2PulleyJoint.prototype.GetLengthB = function () {
            return this.m_lengthB;
        };
        b2PulleyJoint.prototype.GetRatio = function () {
            return this.m_ratio;
        };
        b2PulleyJoint.prototype.GetCurrentLengthA = function () {
            // b2Vec2 p = m_bodyA->GetWorldPoint(m_localAnchorA);
            // b2Vec2 s = m_groundAnchorA;
            // b2Vec2 d = p - s;
            // return d.Length();
            var p = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, b2PulleyJoint.GetCurrentLengthA_s_p);
            var s = this.m_groundAnchorA;
            return box2d.b2DistanceVV(p, s);
        };
        b2PulleyJoint.prototype.GetCurrentLengthB = function () {
            // b2Vec2 p = m_bodyB->GetWorldPoint(m_localAnchorB);
            // b2Vec2 s = m_groundAnchorB;
            // b2Vec2 d = p - s;
            // return d.Length();
            var p = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, b2PulleyJoint.GetCurrentLengthB_s_p);
            var s = this.m_groundAnchorB;
            return box2d.b2DistanceVV(p, s);
        };
        b2PulleyJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2PulleyJointDef = new b2PulleyJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.groundAnchorA.SetXY(%.15f, %.15f);\n", this.m_groundAnchorA.x, this.m_groundAnchorA.y);
                box2d.b2Log("  jd.groundAnchorB.SetXY(%.15f, %.15f);\n", this.m_groundAnchorB.x, this.m_groundAnchorB.y);
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.lengthA = %.15f;\n", this.m_lengthA);
                box2d.b2Log("  jd.lengthB = %.15f;\n", this.m_lengthB);
                box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2PulleyJoint.prototype.ShiftOrigin = function (newOrigin) {
            this.m_groundAnchorA.SelfSub(newOrigin);
            this.m_groundAnchorB.SelfSub(newOrigin);
        };
        b2PulleyJoint.InitVelocityConstraints_s_PA = new box2d.b2Vec2();
        b2PulleyJoint.InitVelocityConstraints_s_PB = new box2d.b2Vec2();
        b2PulleyJoint.SolveVelocityConstraints_s_vpA = new box2d.b2Vec2();
        b2PulleyJoint.SolveVelocityConstraints_s_vpB = new box2d.b2Vec2();
        b2PulleyJoint.SolveVelocityConstraints_s_PA = new box2d.b2Vec2();
        b2PulleyJoint.SolveVelocityConstraints_s_PB = new box2d.b2Vec2();
        b2PulleyJoint.SolvePositionConstraints_s_PA = new box2d.b2Vec2();
        b2PulleyJoint.SolvePositionConstraints_s_PB = new box2d.b2Vec2();
        b2PulleyJoint.GetCurrentLengthA_s_p = new box2d.b2Vec2();
        b2PulleyJoint.GetCurrentLengthB_s_p = new box2d.b2Vec2();
        return b2PulleyJoint;
    }(box2d.b2Joint));
    box2d.b2PulleyJoint = b2PulleyJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Gear joint definition. This definition requires two existing
    /// revolute or prismatic joints (any combination will work).
    var b2GearJointDef = (function (_super) {
        __extends(b2GearJointDef, _super);
        function b2GearJointDef() {
            _super.call(this, box2d.b2JointType.e_gearJoint); // base class constructor
            this.joint1 = null;
            this.joint2 = null;
            this.ratio = 1;
        }
        return b2GearJointDef;
    }(box2d.b2JointDef));
    box2d.b2GearJointDef = b2GearJointDef;
    var b2GearJoint = (function (_super) {
        __extends(b2GearJoint, _super);
        function b2GearJoint(def) {
            _super.call(this, def); // base class constructor
            this.m_joint1 = null;
            this.m_joint2 = null;
            this.m_typeA = box2d.b2JointType.e_unknownJoint;
            this.m_typeB = box2d.b2JointType.e_unknownJoint;
            // Body A is connected to body C
            // Body B is connected to body D
            this.m_bodyC = null;
            this.m_bodyD = null;
            // Solver shared
            this.m_localAnchorA = new box2d.b2Vec2();
            this.m_localAnchorB = new box2d.b2Vec2();
            this.m_localAnchorC = new box2d.b2Vec2();
            this.m_localAnchorD = new box2d.b2Vec2();
            this.m_localAxisC = new box2d.b2Vec2();
            this.m_localAxisD = new box2d.b2Vec2();
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
            this.m_lcA = new box2d.b2Vec2();
            this.m_lcB = new box2d.b2Vec2();
            this.m_lcC = new box2d.b2Vec2();
            this.m_lcD = new box2d.b2Vec2();
            this.m_mA = 0;
            this.m_mB = 0;
            this.m_mC = 0;
            this.m_mD = 0;
            this.m_iA = 0;
            this.m_iB = 0;
            this.m_iC = 0;
            this.m_iD = 0;
            this.m_JvAC = new box2d.b2Vec2();
            this.m_JvBD = new box2d.b2Vec2();
            this.m_JwA = 0;
            this.m_JwB = 0;
            this.m_JwC = 0;
            this.m_JwD = 0;
            this.m_mass = 0;
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_qC = new box2d.b2Rot();
            this.m_qD = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_lalcC = new box2d.b2Vec2();
            this.m_lalcD = new box2d.b2Vec2();
            this.m_joint1 = def.joint1;
            this.m_joint2 = def.joint2;
            this.m_typeA = this.m_joint1.GetType();
            this.m_typeB = this.m_joint2.GetType();
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_typeA === box2d.b2JointType.e_revoluteJoint || this.m_typeA === box2d.b2JointType.e_prismaticJoint);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_typeB === box2d.b2JointType.e_revoluteJoint || this.m_typeB === box2d.b2JointType.e_prismaticJoint);
            }
            var coordinateA, coordinateB;
            // TODO_ERIN there might be some problem with the joint edges in b2Joint.
            this.m_bodyC = this.m_joint1.GetBodyA();
            this.m_bodyA = this.m_joint1.GetBodyB();
            // Get geometry of joint1
            var xfA = this.m_bodyA.m_xf;
            var aA = this.m_bodyA.m_sweep.a;
            var xfC = this.m_bodyC.m_xf;
            var aC = this.m_bodyC.m_sweep.a;
            if (this.m_typeA === box2d.b2JointType.e_revoluteJoint) {
                var revolute = def.joint1;
                this.m_localAnchorC.Copy(revolute.m_localAnchorA);
                this.m_localAnchorA.Copy(revolute.m_localAnchorB);
                this.m_referenceAngleA = revolute.m_referenceAngle;
                this.m_localAxisC.SetZero();
                coordinateA = aA - aC - this.m_referenceAngleA;
            }
            else {
                var prismatic = def.joint1;
                this.m_localAnchorC.Copy(prismatic.m_localAnchorA);
                this.m_localAnchorA.Copy(prismatic.m_localAnchorB);
                this.m_referenceAngleA = prismatic.m_referenceAngle;
                this.m_localAxisC.Copy(prismatic.m_localXAxisA);
                // b2Vec2 pC = m_localAnchorC;
                var pC = this.m_localAnchorC;
                // b2Vec2 pA = b2MulT(xfC.q, b2Mul(xfA.q, m_localAnchorA) + (xfA.p - xfC.p));
                var pA = box2d.b2MulTRV(xfC.q, box2d.b2AddVV(box2d.b2MulRV(xfA.q, this.m_localAnchorA, box2d.b2Vec2.s_t0), box2d.b2SubVV(xfA.p, xfC.p, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0); // pA uses s_t0
                // coordinateA = b2Dot(pA - pC, m_localAxisC);
                coordinateA = box2d.b2DotVV(box2d.b2SubVV(pA, pC, box2d.b2Vec2.s_t0), this.m_localAxisC);
            }
            this.m_bodyD = this.m_joint2.GetBodyA();
            this.m_bodyB = this.m_joint2.GetBodyB();
            // Get geometry of joint2
            var xfB = this.m_bodyB.m_xf;
            var aB = this.m_bodyB.m_sweep.a;
            var xfD = this.m_bodyD.m_xf;
            var aD = this.m_bodyD.m_sweep.a;
            if (this.m_typeB === box2d.b2JointType.e_revoluteJoint) {
                var revolute = def.joint2;
                this.m_localAnchorD.Copy(revolute.m_localAnchorA);
                this.m_localAnchorB.Copy(revolute.m_localAnchorB);
                this.m_referenceAngleB = revolute.m_referenceAngle;
                this.m_localAxisD.SetZero();
                coordinateB = aB - aD - this.m_referenceAngleB;
            }
            else {
                var prismatic = def.joint2;
                this.m_localAnchorD.Copy(prismatic.m_localAnchorA);
                this.m_localAnchorB.Copy(prismatic.m_localAnchorB);
                this.m_referenceAngleB = prismatic.m_referenceAngle;
                this.m_localAxisD.Copy(prismatic.m_localXAxisA);
                // b2Vec2 pD = m_localAnchorD;
                var pD = this.m_localAnchorD;
                // b2Vec2 pB = b2MulT(xfD.q, b2Mul(xfB.q, m_localAnchorB) + (xfB.p - xfD.p));
                var pB = box2d.b2MulTRV(xfD.q, box2d.b2AddVV(box2d.b2MulRV(xfB.q, this.m_localAnchorB, box2d.b2Vec2.s_t0), box2d.b2SubVV(xfB.p, xfD.p, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0); // pB uses s_t0
                // coordinateB = b2Dot(pB - pD, m_localAxisD);
                coordinateB = box2d.b2DotVV(box2d.b2SubVV(pB, pD, box2d.b2Vec2.s_t0), this.m_localAxisD);
            }
            this.m_ratio = def.ratio;
            this.m_constant = coordinateA + this.m_ratio * coordinateB;
            this.m_impulse = 0;
        }
        b2GearJoint.prototype.InitVelocityConstraints = function (data) {
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
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var aC = data.positions[this.m_indexC].a;
            var vC = data.velocities[this.m_indexC].v;
            var wC = data.velocities[this.m_indexC].w;
            var aD = data.positions[this.m_indexD].a;
            var vD = data.velocities[this.m_indexD].v;
            var wD = data.velocities[this.m_indexD].w;
            // b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB), qC = this.m_qC.SetAngleRadians(aC), qD = this.m_qD.SetAngleRadians(aD);
            this.m_mass = 0;
            if (this.m_typeA === box2d.b2JointType.e_revoluteJoint) {
                this.m_JvAC.SetZero();
                this.m_JwA = 1;
                this.m_JwC = 1;
                this.m_mass += this.m_iA + this.m_iC;
            }
            else {
                // b2Vec2 u = b2Mul(qC, m_localAxisC);
                var u = box2d.b2MulRV(qC, this.m_localAxisC, b2GearJoint.InitVelocityConstraints_s_u);
                // b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
                box2d.b2SubVV(this.m_localAnchorC, this.m_lcC, this.m_lalcC);
                var rC = box2d.b2MulRV(qC, this.m_lalcC, b2GearJoint.InitVelocityConstraints_s_rC);
                // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
                box2d.b2SubVV(this.m_localAnchorA, this.m_lcA, this.m_lalcA);
                var rA = box2d.b2MulRV(qA, this.m_lalcA, b2GearJoint.InitVelocityConstraints_s_rA);
                // m_JvAC = u;
                this.m_JvAC.Copy(u);
                // m_JwC = b2Cross(rC, u);
                this.m_JwC = box2d.b2CrossVV(rC, u);
                // m_JwA = b2Cross(rA, u);
                this.m_JwA = box2d.b2CrossVV(rA, u);
                this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
            }
            if (this.m_typeB === box2d.b2JointType.e_revoluteJoint) {
                this.m_JvBD.SetZero();
                this.m_JwB = this.m_ratio;
                this.m_JwD = this.m_ratio;
                this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
            }
            else {
                // b2Vec2 u = b2Mul(qD, m_localAxisD);
                var u = box2d.b2MulRV(qD, this.m_localAxisD, b2GearJoint.InitVelocityConstraints_s_u);
                // b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
                box2d.b2SubVV(this.m_localAnchorD, this.m_lcD, this.m_lalcD);
                var rD = box2d.b2MulRV(qD, this.m_lalcD, b2GearJoint.InitVelocityConstraints_s_rD);
                // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
                box2d.b2SubVV(this.m_localAnchorB, this.m_lcB, this.m_lalcB);
                var rB = box2d.b2MulRV(qB, this.m_lalcB, b2GearJoint.InitVelocityConstraints_s_rB);
                // m_JvBD = m_ratio * u;
                box2d.b2MulSV(this.m_ratio, u, this.m_JvBD);
                // m_JwD = m_ratio * b2Cross(rD, u);
                this.m_JwD = this.m_ratio * box2d.b2CrossVV(rD, u);
                // m_JwB = m_ratio * b2Cross(rB, u);
                this.m_JwB = this.m_ratio * box2d.b2CrossVV(rB, u);
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
        };
        b2GearJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var vC = data.velocities[this.m_indexC].v;
            var wC = data.velocities[this.m_indexC].w;
            var vD = data.velocities[this.m_indexD].v;
            var wD = data.velocities[this.m_indexD].w;
            // float32 Cdot = b2Dot(m_JvAC, vA - vC) + b2Dot(m_JvBD, vB - vD);
            var Cdot = box2d.b2DotVV(this.m_JvAC, box2d.b2SubVV(vA, vC, box2d.b2Vec2.s_t0)) +
                box2d.b2DotVV(this.m_JvBD, box2d.b2SubVV(vB, vD, box2d.b2Vec2.s_t0));
            Cdot += (this.m_JwA * wA - this.m_JwC * wC) + (this.m_JwB * wB - this.m_JwD * wD);
            var impulse = -this.m_mass * Cdot;
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
        };
        b2GearJoint.prototype.SolvePositionConstraints = function (data) {
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var cC = data.positions[this.m_indexC].c;
            var aC = data.positions[this.m_indexC].a;
            var cD = data.positions[this.m_indexD].c;
            var aD = data.positions[this.m_indexD].a;
            // b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB), qC = this.m_qC.SetAngleRadians(aC), qD = this.m_qD.SetAngleRadians(aD);
            var linearError = 0;
            var coordinateA, coordinateB;
            var JvAC = this.m_JvAC, JvBD = this.m_JvBD;
            var JwA, JwB, JwC, JwD;
            var mass = 0;
            if (this.m_typeA === box2d.b2JointType.e_revoluteJoint) {
                JvAC.SetZero();
                JwA = 1;
                JwC = 1;
                mass += this.m_iA + this.m_iC;
                coordinateA = aA - aC - this.m_referenceAngleA;
            }
            else {
                // b2Vec2 u = b2Mul(qC, m_localAxisC);
                var u = box2d.b2MulRV(qC, this.m_localAxisC, b2GearJoint.SolvePositionConstraints_s_u);
                // b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
                var rC = box2d.b2MulRV(qC, this.m_lalcC, b2GearJoint.SolvePositionConstraints_s_rC);
                // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
                var rA = box2d.b2MulRV(qA, this.m_lalcA, b2GearJoint.SolvePositionConstraints_s_rA);
                // JvAC = u;
                JvAC.Copy(u);
                // JwC = b2Cross(rC, u);
                JwC = box2d.b2CrossVV(rC, u);
                // JwA = b2Cross(rA, u);
                JwA = box2d.b2CrossVV(rA, u);
                mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;
                // b2Vec2 pC = m_localAnchorC - m_lcC;
                var pC = this.m_lalcC;
                // b2Vec2 pA = b2MulT(qC, rA + (cA - cC));
                var pA = box2d.b2MulTRV(qC, box2d.b2AddVV(rA, box2d.b2SubVV(cA, cC, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0); // pA uses s_t0
                // coordinateA = b2Dot(pA - pC, m_localAxisC);
                coordinateA = box2d.b2DotVV(box2d.b2SubVV(pA, pC, box2d.b2Vec2.s_t0), this.m_localAxisC);
            }
            if (this.m_typeB === box2d.b2JointType.e_revoluteJoint) {
                JvBD.SetZero();
                JwB = this.m_ratio;
                JwD = this.m_ratio;
                mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
                coordinateB = aB - aD - this.m_referenceAngleB;
            }
            else {
                // b2Vec2 u = b2Mul(qD, m_localAxisD);
                var u = box2d.b2MulRV(qD, this.m_localAxisD, b2GearJoint.SolvePositionConstraints_s_u);
                // b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
                var rD = box2d.b2MulRV(qD, this.m_lalcD, b2GearJoint.SolvePositionConstraints_s_rD);
                // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
                var rB = box2d.b2MulRV(qB, this.m_lalcB, b2GearJoint.SolvePositionConstraints_s_rB);
                // JvBD = m_ratio * u;
                box2d.b2MulSV(this.m_ratio, u, JvBD);
                // JwD = m_ratio * b2Cross(rD, u);
                JwD = this.m_ratio * box2d.b2CrossVV(rD, u);
                // JwB = m_ratio * b2Cross(rB, u);
                JwB = this.m_ratio * box2d.b2CrossVV(rB, u);
                mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * JwD * JwD + this.m_iB * JwB * JwB;
                // b2Vec2 pD = m_localAnchorD - m_lcD;
                var pD = this.m_lalcD;
                // b2Vec2 pB = b2MulT(qD, rB + (cB - cD));
                var pB = box2d.b2MulTRV(qD, box2d.b2AddVV(rB, box2d.b2SubVV(cB, cD, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0); // pB uses s_t0
                // coordinateB = b2Dot(pB - pD, m_localAxisD);
                coordinateB = box2d.b2DotVV(box2d.b2SubVV(pB, pD, box2d.b2Vec2.s_t0), this.m_localAxisD);
            }
            var C = (coordinateA + this.m_ratio * coordinateB) - this.m_constant;
            var impulse = 0;
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
            return linearError < box2d.b2_linearSlop;
        };
        b2GearJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2GearJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2GearJoint.prototype.GetReactionForce = function (inv_dt, out) {
            // b2Vec2 P = m_impulse * m_JvAC;
            // return inv_dt * P;
            return box2d.b2MulSV(inv_dt * this.m_impulse, this.m_JvAC, out);
        };
        b2GearJoint.prototype.GetReactionTorque = function (inv_dt) {
            // float32 L = m_impulse * m_JwA;
            // return inv_dt * L;
            return inv_dt * this.m_impulse * this.m_JwA;
        };
        b2GearJoint.prototype.GetJoint1 = function () { return this.m_joint1; };
        b2GearJoint.prototype.GetJoint2 = function () { return this.m_joint2; };
        b2GearJoint.prototype.GetRatio = function () {
            return this.m_ratio;
        };
        b2GearJoint.prototype.SetRatio = function (ratio) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(ratio));
            }
            this.m_ratio = ratio;
        };
        b2GearJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                var index1 = this.m_joint1.m_index;
                var index2 = this.m_joint2.m_index;
                box2d.b2Log("  const jd: b2GearJointDef = new b2GearJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.joint1 = joints[%d];\n", index1);
                box2d.b2Log("  jd.joint2 = joints[%d];\n", index2);
                box2d.b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2GearJoint.InitVelocityConstraints_s_u = new box2d.b2Vec2();
        b2GearJoint.InitVelocityConstraints_s_rA = new box2d.b2Vec2();
        b2GearJoint.InitVelocityConstraints_s_rB = new box2d.b2Vec2();
        b2GearJoint.InitVelocityConstraints_s_rC = new box2d.b2Vec2();
        b2GearJoint.InitVelocityConstraints_s_rD = new box2d.b2Vec2();
        b2GearJoint.SolvePositionConstraints_s_u = new box2d.b2Vec2();
        b2GearJoint.SolvePositionConstraints_s_rA = new box2d.b2Vec2();
        b2GearJoint.SolvePositionConstraints_s_rB = new box2d.b2Vec2();
        b2GearJoint.SolvePositionConstraints_s_rC = new box2d.b2Vec2();
        b2GearJoint.SolvePositionConstraints_s_rD = new box2d.b2Vec2();
        return b2GearJoint;
    }(box2d.b2Joint));
    box2d.b2GearJoint = b2GearJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Weld joint definition. You need to specify local anchor points
    /// where they are attached and the relative body angle. The position
    /// of the anchor points is important for computing the reaction torque.
    var b2WeldJointDef = (function (_super) {
        __extends(b2WeldJointDef, _super);
        function b2WeldJointDef() {
            _super.call(this, box2d.b2JointType.e_weldJoint); // base class constructor
            this.localAnchorA = new box2d.b2Vec2();
            this.localAnchorB = new box2d.b2Vec2();
            this.referenceAngle = 0;
            this.frequencyHz = 0;
            this.dampingRatio = 0;
        }
        b2WeldJointDef.prototype.Initialize = function (bA, bB, anchor) {
            this.bodyA = bA;
            this.bodyB = bB;
            this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
            this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
            this.referenceAngle = this.bodyB.GetAngleRadians() - this.bodyA.GetAngleRadians();
        };
        return b2WeldJointDef;
    }(box2d.b2JointDef));
    box2d.b2WeldJointDef = b2WeldJointDef;
    var b2WeldJoint = (function (_super) {
        __extends(b2WeldJoint, _super);
        function b2WeldJoint(def) {
            _super.call(this, def); // base class constructor
            this.m_frequencyHz = 0;
            this.m_dampingRatio = 0;
            this.m_bias = 0;
            // Solver shared
            this.m_localAnchorA = new box2d.b2Vec2();
            this.m_localAnchorB = new box2d.b2Vec2();
            this.m_referenceAngle = 0;
            this.m_gamma = 0;
            this.m_impulse = new box2d.b2Vec3(0, 0, 0);
            // Solver temp
            this.m_indexA = 0;
            this.m_indexB = 0;
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_invMassA = 0;
            this.m_invMassB = 0;
            this.m_invIA = 0;
            this.m_invIB = 0;
            this.m_mass = new box2d.b2Mat33();
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_K = new box2d.b2Mat33();
            this.m_frequencyHz = def.frequencyHz;
            this.m_dampingRatio = def.dampingRatio;
            this.m_localAnchorA.Copy(def.localAnchorA);
            this.m_localAnchorB.Copy(def.localAnchorB);
            this.m_referenceAngle = def.referenceAngle;
            this.m_impulse.SetZero();
        }
        b2WeldJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // J = [-I -r1_skew I r2_skew]
            //     [ 0       -1 0       1]
            // r_skew = [-ry; rx]
            // Matlab
            // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
            //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
            //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var K = this.m_K;
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
                var invM = iA + iB;
                var m = invM > 0 ? 1 / invM : 0;
                var C = aB - aA - this.m_referenceAngle;
                // Frequency
                var omega = 2 * box2d.b2_pi * this.m_frequencyHz;
                // Damping coefficient
                var d = 2 * m * this.m_dampingRatio * omega;
                // Spring stiffness
                var k = m * omega * omega;
                // magic formulas
                var h = data.step.dt;
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
                // Scale impulses to support a constiable time step.
                this.m_impulse.SelfMul(data.step.dtRatio);
                // b2Vec2 P(m_impulse.x, m_impulse.y);
                var P = b2WeldJoint.InitVelocityConstraints_s_P.SetXY(this.m_impulse.x, this.m_impulse.y);
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                wA -= iA * (box2d.b2CrossVV(this.m_rA, P) + this.m_impulse.z);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                wB += iB * (box2d.b2CrossVV(this.m_rB, P) + this.m_impulse.z);
            }
            else {
                this.m_impulse.SetZero();
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2WeldJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            if (this.m_frequencyHz > 0) {
                var Cdot2 = wB - wA;
                var impulse2 = -this.m_mass.ez.z * (Cdot2 + this.m_bias + this.m_gamma * this.m_impulse.z);
                this.m_impulse.z += impulse2;
                wA -= iA * impulse2;
                wB += iB * impulse2;
                // b2Vec2 Cdot1 = vB + b2CrossSV(wB, this.m_rB) - vA - b2CrossSV(wA, this.m_rA);
                var Cdot1 = box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, this.m_rA, box2d.b2Vec2.s_t1), b2WeldJoint.SolveVelocityConstraints_s_Cdot1);
                // b2Vec2 impulse1 = -b2Mul22(m_mass, Cdot1);
                var impulse1 = box2d.b2MulM33XY(this.m_mass, Cdot1.x, Cdot1.y, b2WeldJoint.SolveVelocityConstraints_s_impulse1).SelfNeg();
                this.m_impulse.x += impulse1.x;
                this.m_impulse.y += impulse1.y;
                // b2Vec2 P = impulse1;
                var P = impulse1;
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                // wA -= iA * b2Cross(m_rA, P);
                wA -= iA * box2d.b2CrossVV(this.m_rA, P);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                // wB += iB * b2Cross(m_rB, P);
                wB += iB * box2d.b2CrossVV(this.m_rB, P);
            }
            else {
                // b2Vec2 Cdot1 = vB + b2Cross(wB, this.m_rB) - vA - b2Cross(wA, this.m_rA);
                var Cdot1 = box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, this.m_rA, box2d.b2Vec2.s_t1), b2WeldJoint.SolveVelocityConstraints_s_Cdot1);
                var Cdot2 = wB - wA;
                // b2Vec3 const Cdot(Cdot1.x, Cdot1.y, Cdot2);
                // b2Vec3 impulse = -b2Mul(m_mass, Cdot);
                var impulse = box2d.b2MulM33XYZ(this.m_mass, Cdot1.x, Cdot1.y, Cdot2, b2WeldJoint.SolveVelocityConstraints_s_impulse).SelfNeg();
                this.m_impulse.SelfAdd(impulse);
                // b2Vec2 P(impulse.x, impulse.y);
                var P = b2WeldJoint.SolveVelocityConstraints_s_P.SetXY(impulse.x, impulse.y);
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                wA -= iA * (box2d.b2CrossVV(this.m_rA, P) + impulse.z);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                wB += iB * (box2d.b2CrossVV(this.m_rB, P) + impulse.z);
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2WeldJoint.prototype.SolvePositionConstraints = function (data) {
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            var positionError, angularError;
            var K = this.m_K;
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
                var C1 = box2d.b2SubVV(box2d.b2AddVV(cB, rB, box2d.b2Vec2.s_t0), box2d.b2AddVV(cA, rA, box2d.b2Vec2.s_t1), b2WeldJoint.SolvePositionConstraints_s_C1);
                positionError = C1.GetLength();
                angularError = 0;
                // b2Vec2 P = -K.Solve22(C1);
                var P = K.Solve22(C1.x, C1.y, b2WeldJoint.SolvePositionConstraints_s_P).SelfNeg();
                // cA -= mA * P;
                cA.SelfMulSub(mA, P);
                aA -= iA * box2d.b2CrossVV(rA, P);
                // cB += mB * P;
                cB.SelfMulAdd(mB, P);
                aB += iB * box2d.b2CrossVV(rB, P);
            }
            else {
                // b2Vec2 C1 =  cB + rB - cA - rA;
                var C1 = box2d.b2SubVV(box2d.b2AddVV(cB, rB, box2d.b2Vec2.s_t0), box2d.b2AddVV(cA, rA, box2d.b2Vec2.s_t1), b2WeldJoint.SolvePositionConstraints_s_C1);
                var C2 = aB - aA - this.m_referenceAngle;
                positionError = C1.GetLength();
                angularError = box2d.b2Abs(C2);
                // b2Vec3 C(C1.x, C1.y, C2);
                // b2Vec3 impulse = -K.Solve33(C);
                var impulse = K.Solve33(C1.x, C1.y, C2, b2WeldJoint.SolvePositionConstraints_s_impulse).SelfNeg();
                // b2Vec2 P(impulse.x, impulse.y);
                var P = b2WeldJoint.SolvePositionConstraints_s_P.SetXY(impulse.x, impulse.y);
                // cA -= mA * P;
                cA.SelfMulSub(mA, P);
                aA -= iA * (box2d.b2CrossVV(this.m_rA, P) + impulse.z);
                // cB += mB * P;
                cB.SelfMulAdd(mB, P);
                aB += iB * (box2d.b2CrossVV(this.m_rB, P) + impulse.z);
            }
            // data.positions[this.m_indexA].c = cA;
            data.positions[this.m_indexA].a = aA;
            // data.positions[this.m_indexB].c = cB;
            data.positions[this.m_indexB].a = aB;
            return positionError <= box2d.b2_linearSlop && angularError <= box2d.b2_angularSlop;
        };
        b2WeldJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2WeldJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2WeldJoint.prototype.GetReactionForce = function (inv_dt, out) {
            // b2Vec2 P(this.m_impulse.x, this.m_impulse.y);
            // return inv_dt * P;
            return out.SetXY(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
        };
        b2WeldJoint.prototype.GetReactionTorque = function (inv_dt) {
            return inv_dt * this.m_impulse.z;
        };
        b2WeldJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
        b2WeldJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
        b2WeldJoint.prototype.GetReferenceAngle = function () { return this.m_referenceAngle; };
        b2WeldJoint.prototype.SetFrequency = function (hz) { this.m_frequencyHz = hz; };
        b2WeldJoint.prototype.GetFrequency = function () { return this.m_frequencyHz; };
        b2WeldJoint.prototype.SetDampingRatio = function (ratio) { this.m_dampingRatio = ratio; };
        b2WeldJoint.prototype.GetDampingRatio = function () { return this.m_dampingRatio; };
        b2WeldJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2WeldJointDef = new b2WeldJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                box2d.b2Log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                box2d.b2Log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2WeldJoint.InitVelocityConstraints_s_P = new box2d.b2Vec2();
        b2WeldJoint.SolveVelocityConstraints_s_Cdot1 = new box2d.b2Vec2();
        b2WeldJoint.SolveVelocityConstraints_s_impulse1 = new box2d.b2Vec2();
        b2WeldJoint.SolveVelocityConstraints_s_impulse = new box2d.b2Vec3();
        b2WeldJoint.SolveVelocityConstraints_s_P = new box2d.b2Vec2();
        b2WeldJoint.SolvePositionConstraints_s_C1 = new box2d.b2Vec2();
        b2WeldJoint.SolvePositionConstraints_s_P = new box2d.b2Vec2();
        b2WeldJoint.SolvePositionConstraints_s_impulse = new box2d.b2Vec3();
        return b2WeldJoint;
    }(box2d.b2Joint));
    box2d.b2WeldJoint = b2WeldJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Friction joint definition.
    var b2FrictionJointDef = (function (_super) {
        __extends(b2FrictionJointDef, _super);
        function b2FrictionJointDef() {
            _super.call(this, box2d.b2JointType.e_frictionJoint); // base class constructor
            this.localAnchorA = new box2d.b2Vec2();
            this.localAnchorB = new box2d.b2Vec2();
            this.maxForce = 0;
            this.maxTorque = 0;
        }
        b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
            this.bodyA = bA;
            this.bodyB = bB;
            this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
            this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
        };
        return b2FrictionJointDef;
    }(box2d.b2JointDef));
    box2d.b2FrictionJointDef = b2FrictionJointDef;
    var b2FrictionJoint = (function (_super) {
        __extends(b2FrictionJoint, _super);
        function b2FrictionJoint(def) {
            _super.call(this, def); // base class constructor
            this.m_localAnchorA = new box2d.b2Vec2();
            this.m_localAnchorB = new box2d.b2Vec2();
            // Solver shared
            this.m_linearImpulse = new box2d.b2Vec2();
            this.m_angularImpulse = 0;
            this.m_maxForce = 0;
            this.m_maxTorque = 0;
            // Solver temp
            this.m_indexA = 0;
            this.m_indexB = 0;
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_invMassA = 0;
            this.m_invMassB = 0;
            this.m_invIA = 0;
            this.m_invIB = 0;
            this.m_linearMass = new box2d.b2Mat22();
            this.m_angularMass = 0;
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_K = new box2d.b2Mat22();
            this.m_localAnchorA.Copy(def.localAnchorA);
            this.m_localAnchorB.Copy(def.localAnchorB);
            this.m_linearImpulse.SetZero();
            this.m_maxForce = def.maxForce;
            this.m_maxTorque = def.maxTorque;
            this.m_linearMass.SetZero();
        }
        b2FrictionJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            // const cA: b2Vec2 = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            // const cB: b2Vec2 = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // Compute the effective mass matrix.
            // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // J = [-I -r1_skew I r2_skew]
            //     [ 0       -1 0       1]
            // r_skew = [-ry; rx]
            // Matlab
            // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
            //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
            //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var K = this.m_K; // new b2Mat22();
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
                // Scale impulses to support a constiable time step.
                // m_linearImpulse *= data.step.dtRatio;
                this.m_linearImpulse.SelfMul(data.step.dtRatio);
                this.m_angularImpulse *= data.step.dtRatio;
                // const P: b2Vec2(m_linearImpulse.x, m_linearImpulse.y);
                var P = this.m_linearImpulse;
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                // wA -= iA * (b2Cross(m_rA, P) + m_angularImpulse);
                wA -= iA * (box2d.b2CrossVV(this.m_rA, P) + this.m_angularImpulse);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                // wB += iB * (b2Cross(m_rB, P) + m_angularImpulse);
                wB += iB * (box2d.b2CrossVV(this.m_rB, P) + this.m_angularImpulse);
            }
            else {
                this.m_linearImpulse.SetZero();
                this.m_angularImpulse = 0;
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2FrictionJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var h = data.step.dt;
            // Solve angular friction
            if (true) {
                var Cdot = wB - wA;
                var impulse = (-this.m_angularMass * Cdot);
                var oldImpulse = this.m_angularImpulse;
                var maxImpulse = h * this.m_maxTorque;
                this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
                impulse = this.m_angularImpulse - oldImpulse;
                wA -= iA * impulse;
                wB += iB * impulse;
            }
            // Solve linear friction
            if (true) {
                // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                var Cdot_v2 = box2d.b2SubVV(box2d.b2AddVCrossSV(vB, wB, this.m_rB, box2d.b2Vec2.s_t0), box2d.b2AddVCrossSV(vA, wA, this.m_rA, box2d.b2Vec2.s_t1), b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2);
                // b2Vec2 impulse = -b2Mul(m_linearMass, Cdot);
                var impulseV = box2d.b2MulMV(this.m_linearMass, Cdot_v2, b2FrictionJoint.SolveVelocityConstraints_s_impulseV).SelfNeg();
                // b2Vec2 oldImpulse = m_linearImpulse;
                var oldImpulseV = b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV.Copy(this.m_linearImpulse);
                // m_linearImpulse += impulse;
                this.m_linearImpulse.SelfAdd(impulseV);
                var maxImpulse = h * this.m_maxForce;
                if (this.m_linearImpulse.GetLengthSquared() > maxImpulse * maxImpulse) {
                    this.m_linearImpulse.Normalize();
                    this.m_linearImpulse.SelfMul(maxImpulse);
                }
                // impulse = m_linearImpulse - oldImpulse;
                box2d.b2SubVV(this.m_linearImpulse, oldImpulseV, impulseV);
                // vA -= mA * impulse;
                vA.SelfMulSub(mA, impulseV);
                // wA -= iA * b2Cross(m_rA, impulse);
                wA -= iA * box2d.b2CrossVV(this.m_rA, impulseV);
                // vB += mB * impulse;
                vB.SelfMulAdd(mB, impulseV);
                // wB += iB * b2Cross(m_rB, impulse);
                wB += iB * box2d.b2CrossVV(this.m_rB, impulseV);
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2FrictionJoint.prototype.SolvePositionConstraints = function (data) {
            return true;
        };
        b2FrictionJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2FrictionJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2FrictionJoint.prototype.GetReactionForce = function (inv_dt, out) {
            return out.SetXY(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
        };
        b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
            return inv_dt * this.m_angularImpulse;
        };
        b2FrictionJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
        b2FrictionJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
        b2FrictionJoint.prototype.SetMaxForce = function (force) {
            this.m_maxForce = force;
        };
        b2FrictionJoint.prototype.GetMaxForce = function () {
            return this.m_maxForce;
        };
        b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
            this.m_maxTorque = torque;
        };
        b2FrictionJoint.prototype.GetMaxTorque = function () {
            return this.m_maxTorque;
        };
        b2FrictionJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2FrictionJointDef = new b2FrictionJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
                box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2 = new box2d.b2Vec2();
        b2FrictionJoint.SolveVelocityConstraints_s_impulseV = new box2d.b2Vec2();
        b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV = new box2d.b2Vec2();
        return b2FrictionJoint;
    }(box2d.b2Joint));
    box2d.b2FrictionJoint = b2FrictionJoint;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    /// Rope joint definition. This requires two body anchor points and
    /// a maximum lengths.
    /// Note: by default the connected objects will not collide.
    /// see collideConnected in b2JointDef.
    var b2RopeJointDef = (function (_super) {
        __extends(b2RopeJointDef, _super);
        function b2RopeJointDef() {
            _super.call(this, box2d.b2JointType.e_ropeJoint); // base class constructor
            this.localAnchorA = new box2d.b2Vec2(-1, 0);
            this.localAnchorB = new box2d.b2Vec2(1, 0);
            this.maxLength = 0;
        }
        return b2RopeJointDef;
    }(box2d.b2JointDef));
    box2d.b2RopeJointDef = b2RopeJointDef;
    var b2RopeJoint = (function (_super) {
        __extends(b2RopeJoint, _super);
        function b2RopeJoint(def) {
            _super.call(this, def); // base class constructor
            // Solver shared
            this.m_localAnchorA = new box2d.b2Vec2();
            this.m_localAnchorB = new box2d.b2Vec2();
            this.m_maxLength = 0;
            this.m_length = 0;
            this.m_impulse = 0;
            // Solver temp
            this.m_indexA = 0;
            this.m_indexB = 0;
            this.m_u = new box2d.b2Vec2();
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_invMassA = 0;
            this.m_invMassB = 0;
            this.m_invIA = 0;
            this.m_invIB = 0;
            this.m_mass = 0;
            this.m_state = box2d.b2LimitState.e_inactiveLimit;
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_lalcA = new box2d.b2Vec2();
            this.m_lalcB = new box2d.b2Vec2();
            this.m_localAnchorA = def.localAnchorA.Clone();
            this.m_localAnchorB = def.localAnchorB.Clone();
            this.m_maxLength = def.maxLength;
        }
        b2RopeJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // this.m_rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // this.m_rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // this.m_u = cB + this.m_rB - cA - this.m_rA;
            this.m_u.Copy(cB).SelfAdd(this.m_rB).SelfSub(cA).SelfSub(this.m_rA);
            this.m_length = this.m_u.GetLength();
            var C = this.m_length - this.m_maxLength;
            if (C > 0) {
                this.m_state = box2d.b2LimitState.e_atUpperLimit;
            }
            else {
                this.m_state = box2d.b2LimitState.e_inactiveLimit;
            }
            if (this.m_length > box2d.b2_linearSlop) {
                this.m_u.SelfMul(1 / this.m_length);
            }
            else {
                this.m_u.SetZero();
                this.m_mass = 0;
                this.m_impulse = 0;
                return;
            }
            // Compute effective mass.
            var crA = box2d.b2CrossVV(this.m_rA, this.m_u);
            var crB = box2d.b2CrossVV(this.m_rB, this.m_u);
            var invMass = this.m_invMassA + this.m_invIA * crA * crA + this.m_invMassB + this.m_invIB * crB * crB;
            this.m_mass = invMass !== 0 ? 1 / invMass : 0;
            if (data.step.warmStarting) {
                // Scale the impulse to support a constiable time step.
                this.m_impulse *= data.step.dtRatio;
                // b2Vec2 P = m_impulse * m_u;
                var P = box2d.b2MulSV(this.m_impulse, this.m_u, b2RopeJoint.InitVelocityConstraints_s_P);
                // vA -= m_invMassA * P;
                vA.SelfMulSub(this.m_invMassA, P);
                wA -= this.m_invIA * box2d.b2CrossVV(this.m_rA, P);
                // vB += m_invMassB * P;
                vB.SelfMulAdd(this.m_invMassB, P);
                wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, P);
            }
            else {
                this.m_impulse = 0;
            }
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2RopeJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            // Cdot = dot(u, v + cross(w, r))
            // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
            var vpA = box2d.b2AddVCrossSV(vA, wA, this.m_rA, b2RopeJoint.SolveVelocityConstraints_s_vpA);
            // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
            var vpB = box2d.b2AddVCrossSV(vB, wB, this.m_rB, b2RopeJoint.SolveVelocityConstraints_s_vpB);
            // float32 C = m_length - m_maxLength;
            var C = this.m_length - this.m_maxLength;
            // float32 Cdot = b2Dot(m_u, vpB - vpA);
            var Cdot = box2d.b2DotVV(this.m_u, box2d.b2SubVV(vpB, vpA, box2d.b2Vec2.s_t0));
            // Predictive constraint.
            if (C < 0) {
                Cdot += data.step.inv_dt * C;
            }
            var impulse = -this.m_mass * Cdot;
            var oldImpulse = this.m_impulse;
            this.m_impulse = box2d.b2Min(0, this.m_impulse + impulse);
            impulse = this.m_impulse - oldImpulse;
            // b2Vec2 P = impulse * m_u;
            var P = box2d.b2MulSV(impulse, this.m_u, b2RopeJoint.SolveVelocityConstraints_s_P);
            // vA -= m_invMassA * P;
            vA.SelfMulSub(this.m_invMassA, P);
            wA -= this.m_invIA * box2d.b2CrossVV(this.m_rA, P);
            // vB += m_invMassB * P;
            vB.SelfMulAdd(this.m_invMassB, P);
            wB += this.m_invIB * box2d.b2CrossVV(this.m_rB, P);
            // data.velocities[this.m_indexA].v = vA;
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB;
            data.velocities[this.m_indexB].w = wB;
        };
        b2RopeJoint.prototype.SolvePositionConstraints = function (data) {
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // b2Vec2 rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
            box2d.b2SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
            var rA = box2d.b2MulRV(qA, this.m_lalcA, this.m_rA);
            // b2Vec2 rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
            box2d.b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
            var rB = box2d.b2MulRV(qB, this.m_lalcB, this.m_rB);
            // b2Vec2 u = cB + rB - cA - rA;
            var u = this.m_u.Copy(cB).SelfAdd(rB).SelfSub(cA).SelfSub(rA);
            var length = u.Normalize();
            var C = length - this.m_maxLength;
            C = box2d.b2Clamp(C, 0, box2d.b2_maxLinearCorrection);
            var impulse = -this.m_mass * C;
            // b2Vec2 P = impulse * u;
            var P = box2d.b2MulSV(impulse, u, b2RopeJoint.SolvePositionConstraints_s_P);
            // cA -= m_invMassA * P;
            cA.SelfMulSub(this.m_invMassA, P);
            aA -= this.m_invIA * box2d.b2CrossVV(rA, P);
            // cB += m_invMassB * P;
            cB.SelfMulAdd(this.m_invMassB, P);
            aB += this.m_invIB * box2d.b2CrossVV(rB, P);
            // data.positions[this.m_indexA].c = cA;
            data.positions[this.m_indexA].a = aA;
            // data.positions[this.m_indexB].c = cB;
            data.positions[this.m_indexB].a = aB;
            return length - this.m_maxLength < box2d.b2_linearSlop;
        };
        b2RopeJoint.prototype.GetAnchorA = function (out) {
            return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
        };
        b2RopeJoint.prototype.GetAnchorB = function (out) {
            return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
        };
        b2RopeJoint.prototype.GetReactionForce = function (inv_dt, out) {
            var F = box2d.b2MulSV((inv_dt * this.m_impulse), this.m_u, out);
            return F;
            // return out.SetXY(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
        };
        b2RopeJoint.prototype.GetReactionTorque = function (inv_dt) {
            return 0;
        };
        b2RopeJoint.prototype.GetLocalAnchorA = function () { return this.m_localAnchorA; };
        b2RopeJoint.prototype.GetLocalAnchorB = function () { return this.m_localAnchorB; };
        b2RopeJoint.prototype.SetMaxLength = function (length) { this.m_maxLength = length; };
        b2RopeJoint.prototype.GetMaxLength = function () {
            return this.m_maxLength;
        };
        b2RopeJoint.prototype.GetLimitState = function () {
            return this.m_state;
        };
        b2RopeJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2RopeJointDef = new b2RopeJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.localAnchorA.SetXY(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                box2d.b2Log("  jd.localAnchorB.SetXY(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                box2d.b2Log("  jd.maxLength = %.15f;\n", this.m_maxLength);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2RopeJoint.InitVelocityConstraints_s_P = new box2d.b2Vec2();
        b2RopeJoint.SolveVelocityConstraints_s_vpA = new box2d.b2Vec2();
        b2RopeJoint.SolveVelocityConstraints_s_vpB = new box2d.b2Vec2();
        b2RopeJoint.SolveVelocityConstraints_s_P = new box2d.b2Vec2();
        b2RopeJoint.SolvePositionConstraints_s_P = new box2d.b2Vec2();
        return b2RopeJoint;
    }(box2d.b2Joint));
    box2d.b2RopeJoint = b2RopeJoint;
})(box2d || (box2d = {})); // namespace box2d
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
var box2d;
(function (box2d) {
    var b2MotorJointDef = (function (_super) {
        __extends(b2MotorJointDef, _super);
        function b2MotorJointDef() {
            _super.call(this, box2d.b2JointType.e_motorJoint); // base class constructor
            this.linearOffset = new box2d.b2Vec2(0, 0);
            this.angularOffset = 0;
            this.maxForce = 1;
            this.maxTorque = 1;
            this.correctionFactor = 0.3;
        }
        b2MotorJointDef.prototype.Initialize = function (bA, bB) {
            this.bodyA = bA;
            this.bodyB = bB;
            // b2Vec2 xB = bodyB->GetPosition();
            // linearOffset = bodyA->GetLocalPoint(xB);
            this.bodyA.GetLocalPoint(this.bodyB.GetPosition(), this.linearOffset);
            var angleA = this.bodyA.GetAngleRadians();
            var angleB = this.bodyB.GetAngleRadians();
            this.angularOffset = angleB - angleA;
        };
        return b2MotorJointDef;
    }(box2d.b2JointDef));
    box2d.b2MotorJointDef = b2MotorJointDef;
    var b2MotorJoint = (function (_super) {
        __extends(b2MotorJoint, _super);
        function b2MotorJoint(def) {
            _super.call(this, def); // base class constructor
            // Solver shared
            this.m_linearOffset = new box2d.b2Vec2();
            this.m_angularOffset = 0;
            this.m_linearImpulse = new box2d.b2Vec2();
            this.m_angularImpulse = 0;
            this.m_maxForce = 0;
            this.m_maxTorque = 0;
            this.m_correctionFactor = 0.3;
            // Solver temp
            this.m_indexA = 0;
            this.m_indexB = 0;
            this.m_rA = new box2d.b2Vec2();
            this.m_rB = new box2d.b2Vec2();
            this.m_localCenterA = new box2d.b2Vec2();
            this.m_localCenterB = new box2d.b2Vec2();
            this.m_linearError = new box2d.b2Vec2();
            this.m_angularError = 0;
            this.m_invMassA = 0;
            this.m_invMassB = 0;
            this.m_invIA = 0;
            this.m_invIB = 0;
            this.m_linearMass = new box2d.b2Mat22();
            this.m_angularMass = 0;
            this.m_qA = new box2d.b2Rot();
            this.m_qB = new box2d.b2Rot();
            this.m_K = new box2d.b2Mat22();
            this.m_linearOffset.Copy(def.linearOffset);
            this.m_linearImpulse.SetZero();
            this.m_maxForce = def.maxForce;
            this.m_maxTorque = def.maxTorque;
            this.m_correctionFactor = def.correctionFactor;
        }
        b2MotorJoint.prototype.GetAnchorA = function () {
            return this.m_bodyA.GetPosition();
        };
        b2MotorJoint.prototype.GetAnchorB = function () {
            return this.m_bodyB.GetPosition();
        };
        b2MotorJoint.prototype.GetReactionForce = function (inv_dt, out) {
            // return inv_dt * m_linearImpulse;
            return box2d.b2MulSV(inv_dt, this.m_linearImpulse, out);
        };
        b2MotorJoint.prototype.GetReactionTorque = function (inv_dt) {
            return inv_dt * this.m_angularImpulse;
        };
        b2MotorJoint.prototype.SetLinearOffset = function (linearOffset) {
            if (!box2d.b2IsEqualToV(linearOffset, this.m_linearOffset)) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_linearOffset.Copy(linearOffset);
            }
        };
        b2MotorJoint.prototype.GetLinearOffset = function () {
            return this.m_linearOffset;
        };
        b2MotorJoint.prototype.SetAngularOffset = function (angularOffset) {
            if (angularOffset !== this.m_angularOffset) {
                this.m_bodyA.SetAwake(true);
                this.m_bodyB.SetAwake(true);
                this.m_angularOffset = angularOffset;
            }
        };
        b2MotorJoint.prototype.GetAngularOffset = function () {
            return this.m_angularOffset;
        };
        b2MotorJoint.prototype.SetMaxForce = function (force) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(force) && force >= 0);
            }
            this.m_maxForce = force;
        };
        b2MotorJoint.prototype.GetMaxForce = function () {
            return this.m_maxForce;
        };
        b2MotorJoint.prototype.SetMaxTorque = function (torque) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(torque) && torque >= 0);
            }
            this.m_maxTorque = torque;
        };
        b2MotorJoint.prototype.GetMaxTorque = function () {
            return this.m_maxTorque;
        };
        b2MotorJoint.prototype.InitVelocityConstraints = function (data) {
            this.m_indexA = this.m_bodyA.m_islandIndex;
            this.m_indexB = this.m_bodyB.m_islandIndex;
            this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
            this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
            this.m_invMassA = this.m_bodyA.m_invMass;
            this.m_invMassB = this.m_bodyB.m_invMass;
            this.m_invIA = this.m_bodyA.m_invI;
            this.m_invIB = this.m_bodyB.m_invI;
            var cA = data.positions[this.m_indexA].c;
            var aA = data.positions[this.m_indexA].a;
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var cB = data.positions[this.m_indexB].c;
            var aB = data.positions[this.m_indexB].a;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var qA = this.m_qA.SetAngleRadians(aA), qB = this.m_qB.SetAngleRadians(aB);
            // Compute the effective mass matrix.
            // this.m_rA = b2Mul(qA, -this.m_localCenterA);
            var rA = box2d.b2MulRV(qA, box2d.b2NegV(this.m_localCenterA, box2d.b2Vec2.s_t0), this.m_rA);
            // this.m_rB = b2Mul(qB, -this.m_localCenterB);
            var rB = box2d.b2MulRV(qB, box2d.b2NegV(this.m_localCenterB, box2d.b2Vec2.s_t0), this.m_rB);
            // J = [-I -r1_skew I r2_skew]
            //     [ 0       -1 0       1]
            // r_skew = [-ry; rx]
            // Matlab
            // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
            //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
            //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var K = this.m_K;
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
            box2d.b2SubVV(box2d.b2SubVV(box2d.b2AddVV(cB, rB, box2d.b2Vec2.s_t0), box2d.b2AddVV(cA, rA, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t2), box2d.b2MulRV(qA, this.m_linearOffset, box2d.b2Vec2.s_t3), this.m_linearError);
            this.m_angularError = aB - aA - this.m_angularOffset;
            if (data.step.warmStarting) {
                // Scale impulses to support a constiable time step.
                // this.m_linearImpulse *= data.step.dtRatio;
                this.m_linearImpulse.SelfMul(data.step.dtRatio);
                this.m_angularImpulse *= data.step.dtRatio;
                // b2Vec2 P(this.m_linearImpulse.x, this.m_linearImpulse.y);
                var P = this.m_linearImpulse;
                // vA -= mA * P;
                vA.SelfMulSub(mA, P);
                wA -= iA * (box2d.b2CrossVV(rA, P) + this.m_angularImpulse);
                // vB += mB * P;
                vB.SelfMulAdd(mB, P);
                wB += iB * (box2d.b2CrossVV(rB, P) + this.m_angularImpulse);
            }
            else {
                this.m_linearImpulse.SetZero();
                this.m_angularImpulse = 0;
            }
            // data.velocities[this.m_indexA].v = vA; // vA is a reference
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB; // vB is a reference
            data.velocities[this.m_indexB].w = wB;
        };
        b2MotorJoint.prototype.SolveVelocityConstraints = function (data) {
            var vA = data.velocities[this.m_indexA].v;
            var wA = data.velocities[this.m_indexA].w;
            var vB = data.velocities[this.m_indexB].v;
            var wB = data.velocities[this.m_indexB].w;
            var mA = this.m_invMassA, mB = this.m_invMassB;
            var iA = this.m_invIA, iB = this.m_invIB;
            var h = data.step.dt;
            var inv_h = data.step.inv_dt;
            // Solve angular friction
            {
                var Cdot = wB - wA + inv_h * this.m_correctionFactor * this.m_angularError;
                var impulse = -this.m_angularMass * Cdot;
                var oldImpulse = this.m_angularImpulse;
                var maxImpulse = h * this.m_maxTorque;
                this.m_angularImpulse = box2d.b2Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
                impulse = this.m_angularImpulse - oldImpulse;
                wA -= iA * impulse;
                wB += iB * impulse;
            }
            // Solve linear friction
            {
                var rA = this.m_rA;
                var rB = this.m_rB;
                // b2Vec2 Cdot = vB + b2CrossSV(wB, rB) - vA - b2CrossSV(wA, rA) + inv_h * this.m_correctionFactor * this.m_linearError;
                var Cdot_v2 = box2d.b2AddVV(box2d.b2SubVV(box2d.b2AddVV(vB, box2d.b2CrossSV(wB, rB, box2d.b2Vec2.s_t0), box2d.b2Vec2.s_t0), box2d.b2AddVV(vA, box2d.b2CrossSV(wA, rA, box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t1), box2d.b2Vec2.s_t2), box2d.b2MulSV(inv_h * this.m_correctionFactor, this.m_linearError, box2d.b2Vec2.s_t3), b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2);
                // b2Vec2 impulse = -b2Mul(this.m_linearMass, Cdot);
                var impulse_v2 = box2d.b2MulMV(this.m_linearMass, Cdot_v2, b2MotorJoint.SolveVelocityConstraints_s_impulse_v2).SelfNeg();
                // b2Vec2 oldImpulse = this.m_linearImpulse;
                var oldImpulse_v2 = b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2.Copy(this.m_linearImpulse);
                // this.m_linearImpulse += impulse;
                this.m_linearImpulse.SelfAdd(impulse_v2);
                var maxImpulse = h * this.m_maxForce;
                if (this.m_linearImpulse.GetLengthSquared() > maxImpulse * maxImpulse) {
                    this.m_linearImpulse.Normalize();
                    // this.m_linearImpulse *= maxImpulse;
                    this.m_linearImpulse.SelfMul(maxImpulse);
                }
                // impulse = this.m_linearImpulse - oldImpulse;
                box2d.b2SubVV(this.m_linearImpulse, oldImpulse_v2, impulse_v2);
                // vA -= mA * impulse;
                vA.SelfMulSub(mA, impulse_v2);
                // wA -= iA * b2CrossVV(rA, impulse);
                wA -= iA * box2d.b2CrossVV(rA, impulse_v2);
                // vB += mB * impulse;
                vB.SelfMulAdd(mB, impulse_v2);
                // wB += iB * b2CrossVV(rB, impulse);
                wB += iB * box2d.b2CrossVV(rB, impulse_v2);
            }
            // data.velocities[this.m_indexA].v = vA; // vA is a reference
            data.velocities[this.m_indexA].w = wA;
            // data.velocities[this.m_indexB].v = vB; // vB is a reference
            data.velocities[this.m_indexB].w = wB;
        };
        b2MotorJoint.prototype.SolvePositionConstraints = function (data) {
            return true;
        };
        b2MotorJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var indexA = this.m_bodyA.m_islandIndex;
                var indexB = this.m_bodyB.m_islandIndex;
                box2d.b2Log("  const jd: b2MotorJointDef = new b2MotorJointDef();\n");
                box2d.b2Log("  jd.bodyA = bodies[%d];\n", indexA);
                box2d.b2Log("  jd.bodyB = bodies[%d];\n", indexB);
                box2d.b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                box2d.b2Log("  jd.linearOffset.SetXY(%.15f, %.15f);\n", this.m_linearOffset.x, this.m_linearOffset.y);
                box2d.b2Log("  jd.angularOffset = %.15f;\n", this.m_angularOffset);
                box2d.b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
                box2d.b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
                box2d.b2Log("  jd.correctionFactor = %.15f;\n", this.m_correctionFactor);
                box2d.b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
            }
        };
        b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2 = new box2d.b2Vec2();
        b2MotorJoint.SolveVelocityConstraints_s_impulse_v2 = new box2d.b2Vec2();
        b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2 = new box2d.b2Vec2();
        return b2MotorJoint;
    }(box2d.b2Joint));
    box2d.b2MotorJoint = b2MotorJoint;
})(box2d || (box2d = {})); // namespace box2d
// <reference path="../../../Box2D/Common/b2Settings.ts"/>
// <reference path="../../../Box2D/Common/b2Math.ts"/>
/// <reference path="../../../Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../Box2D/Dynamics/Joints/b2DistanceJoint.ts"/>
var box2d;
(function (box2d) {
    var b2AreaJointDef = (function (_super) {
        __extends(b2AreaJointDef, _super);
        function b2AreaJointDef() {
            _super.call(this, box2d.b2JointType.e_areaJoint); // base class constructor
            this.world = null;
            this.bodies = new Array();
            this.frequencyHz = 0;
            this.dampingRatio = 0;
        }
        b2AreaJointDef.prototype.AddBody = function (body) {
            this.bodies.push(body);
            if (this.bodies.length === 1) {
                this.bodyA = body;
            }
            else if (this.bodies.length === 2) {
                this.bodyB = body;
            }
        };
        return b2AreaJointDef;
    }(box2d.b2JointDef));
    box2d.b2AreaJointDef = b2AreaJointDef;
    var b2AreaJoint = (function (_super) {
        __extends(b2AreaJoint, _super);
        function b2AreaJoint(def) {
            _super.call(this, def); // base class constructor
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
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies.");
            }
            this.m_bodies = def.bodies;
            this.m_frequencyHz = def.frequencyHz;
            this.m_dampingRatio = def.dampingRatio;
            this.m_targetLengths = box2d.b2MakeNumberArray(def.bodies.length);
            this.m_normals = box2d.b2Vec2.MakeArray(def.bodies.length);
            this.m_joints = new Array(def.bodies.length);
            this.m_deltas = box2d.b2Vec2.MakeArray(def.bodies.length);
            this.m_delta = new box2d.b2Vec2();
            var djd = new box2d.b2DistanceJointDef();
            djd.frequencyHz = def.frequencyHz;
            djd.dampingRatio = def.dampingRatio;
            this.m_targetArea = 0;
            for (var i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                var body = this.m_bodies[i];
                var next = this.m_bodies[(i + 1) % ict];
                var body_c = body.GetWorldCenter();
                var next_c = next.GetWorldCenter();
                this.m_targetLengths[i] = box2d.b2DistanceVV(body_c, next_c);
                this.m_targetArea += box2d.b2CrossVV(body_c, next_c);
                djd.Initialize(body, next, body_c, next_c);
                this.m_joints[i] = def.world.CreateJoint(djd);
            }
            this.m_targetArea *= 0.5;
        }
        b2AreaJoint.prototype.GetAnchorA = function (out) {
            return out.SetZero();
        };
        b2AreaJoint.prototype.GetAnchorB = function (out) {
            return out.SetZero();
        };
        b2AreaJoint.prototype.GetReactionForce = function (inv_dt, out) {
            return out.SetZero();
        };
        b2AreaJoint.prototype.GetReactionTorque = function (inv_dt) {
            return 0;
        };
        b2AreaJoint.prototype.SetFrequency = function (hz) {
            this.m_frequencyHz = hz;
            for (var i = 0, ict = this.m_joints.length; i < ict; ++i) {
                this.m_joints[i].SetFrequency(hz);
            }
        };
        b2AreaJoint.prototype.GetFrequency = function () {
            return this.m_frequencyHz;
        };
        b2AreaJoint.prototype.SetDampingRatio = function (ratio) {
            this.m_dampingRatio = ratio;
            for (var i = 0, ict = this.m_joints.length; i < ict; ++i) {
                this.m_joints[i].SetDampingRatio(ratio);
            }
        };
        b2AreaJoint.prototype.GetDampingRatio = function () {
            return this.m_dampingRatio;
        };
        b2AreaJoint.prototype.Dump = function () {
            if (box2d.DEBUG) {
                box2d.b2Log("Area joint dumping is not supported.\n");
            }
        };
        b2AreaJoint.prototype.InitVelocityConstraints = function (data) {
            for (var i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                var prev = this.m_bodies[(i + ict - 1) % ict];
                var next = this.m_bodies[(i + 1) % ict];
                var prev_c = data.positions[prev.m_islandIndex].c;
                var next_c = data.positions[next.m_islandIndex].c;
                var delta = this.m_deltas[i];
                box2d.b2SubVV(next_c, prev_c, delta);
            }
            if (data.step.warmStarting) {
                this.m_impulse *= data.step.dtRatio;
                for (var i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                    var body = this.m_bodies[i];
                    var body_v = data.velocities[body.m_islandIndex].v;
                    var delta = this.m_deltas[i];
                    body_v.x += body.m_invMass * delta.y * 0.5 * this.m_impulse;
                    body_v.y += body.m_invMass * -delta.x * 0.5 * this.m_impulse;
                }
            }
            else {
                this.m_impulse = 0;
            }
        };
        b2AreaJoint.prototype.SolveVelocityConstraints = function (data) {
            var dotMassSum = 0;
            var crossMassSum = 0;
            for (var i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                var body = this.m_bodies[i];
                var body_v = data.velocities[body.m_islandIndex].v;
                var delta = this.m_deltas[i];
                dotMassSum += delta.GetLengthSquared() / body.GetMass();
                crossMassSum += box2d.b2CrossVV(body_v, delta);
            }
            var lambda = -2 * crossMassSum / dotMassSum;
            // lambda = b2Clamp(lambda, -b2_maxLinearCorrection, b2_maxLinearCorrection);
            this.m_impulse += lambda;
            for (var i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                var body = this.m_bodies[i];
                var body_v = data.velocities[body.m_islandIndex].v;
                var delta = this.m_deltas[i];
                body_v.x += body.m_invMass * delta.y * 0.5 * lambda;
                body_v.y += body.m_invMass * -delta.x * 0.5 * lambda;
            }
        };
        b2AreaJoint.prototype.SolvePositionConstraints = function (data) {
            var perimeter = 0;
            var area = 0;
            for (var i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                var body = this.m_bodies[i];
                var next = this.m_bodies[(i + 1) % ict];
                var body_c = data.positions[body.m_islandIndex].c;
                var next_c = data.positions[next.m_islandIndex].c;
                var delta = box2d.b2SubVV(next_c, body_c, this.m_delta);
                var dist = delta.GetLength();
                if (dist < box2d.b2_epsilon) {
                    dist = 1;
                }
                this.m_normals[i].x = delta.y / dist;
                this.m_normals[i].y = -delta.x / dist;
                perimeter += dist;
                area += box2d.b2CrossVV(body_c, next_c);
            }
            area *= 0.5;
            var deltaArea = this.m_targetArea - area;
            var toExtrude = 0.5 * deltaArea / perimeter;
            var done = true;
            for (var i = 0, ict = this.m_bodies.length; i < ict; ++i) {
                var body = this.m_bodies[i];
                var body_c = data.positions[body.m_islandIndex].c;
                var next_i = (i + 1) % ict;
                var delta = box2d.b2AddVV(this.m_normals[i], this.m_normals[next_i], this.m_delta);
                delta.SelfMul(toExtrude);
                var norm_sq = delta.GetLengthSquared();
                if (norm_sq > box2d.b2Sq(box2d.b2_maxLinearCorrection)) {
                    delta.SelfMul(box2d.b2_maxLinearCorrection / box2d.b2Sqrt(norm_sq));
                }
                if (norm_sq > box2d.b2Sq(box2d.b2_linearSlop)) {
                    done = false;
                }
                body_c.x += delta.x;
                body_c.y += delta.y;
            }
            return done;
        };
        return b2AreaJoint;
    }(box2d.b2Joint));
    box2d.b2AreaJoint = b2AreaJoint;
})(box2d || (box2d = {})); // namespace box2d
// <reference path="../../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2DistanceJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2WheelJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2MouseJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2PulleyJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2GearJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2WeldJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2FrictionJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2RopeJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2MotorJoint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2AreaJoint.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
// <reference path="../../../../Box2D/Box2D/Dynamics/b2World.ts"/>
// <reference path="../../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
var box2d;
(function (box2d) {
    var b2JointFactory = (function () {
        function b2JointFactory() {
        }
        b2JointFactory.Create = function (def, allocator) {
            var joint = null;
            switch (def.type) {
                case box2d.b2JointType.e_distanceJoint:
                    joint = new box2d.b2DistanceJoint(def);
                    break;
                case box2d.b2JointType.e_mouseJoint:
                    joint = new box2d.b2MouseJoint(def);
                    break;
                case box2d.b2JointType.e_prismaticJoint:
                    joint = new box2d.b2PrismaticJoint(def);
                    break;
                case box2d.b2JointType.e_revoluteJoint:
                    joint = new box2d.b2RevoluteJoint(def);
                    break;
                case box2d.b2JointType.e_pulleyJoint:
                    joint = new box2d.b2PulleyJoint(def);
                    break;
                case box2d.b2JointType.e_gearJoint:
                    joint = new box2d.b2GearJoint(def);
                    break;
                case box2d.b2JointType.e_wheelJoint:
                    joint = new box2d.b2WheelJoint(def);
                    break;
                case box2d.b2JointType.e_weldJoint:
                    joint = new box2d.b2WeldJoint(def);
                    break;
                case box2d.b2JointType.e_frictionJoint:
                    joint = new box2d.b2FrictionJoint(def);
                    break;
                case box2d.b2JointType.e_ropeJoint:
                    joint = new box2d.b2RopeJoint(def);
                    break;
                case box2d.b2JointType.e_motorJoint:
                    joint = new box2d.b2MotorJoint(def);
                    break;
                case box2d.b2JointType.e_areaJoint:
                    joint = new box2d.b2AreaJoint(def);
                    break;
                default:
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(false);
                    }
                    break;
            }
            return joint;
        };
        b2JointFactory.Destroy = function (joint, allocator) {
        };
        return b2JointFactory;
    }());
    box2d.b2JointFactory = b2JointFactory;
})(box2d || (box2d = {})); // namespace box2d
// b2Controller.ts
var box2d;
(function (box2d) {
    var b2Controller = (function () {
        function b2Controller() {
            this.type = "b2Controller";
            box2d.b2Assert(true);
        }
        return b2Controller;
    }());
    box2d.b2Controller = b2Controller;
})(box2d || (box2d = {}));
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2BlockAllocator.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2StackAllocator.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2ContactManager.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2WorldCallbacks.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Island.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Joints/b2JointFactory.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Joints/b2PulleyJoint.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2ContactSolver.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2Collision.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2BroadPhase.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2ChainShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/b2TimeOfImpact.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Draw.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Timer.ts"/>
/// <reference path="../../../Contributions/Enhancements/Controllers/b2Controller.ts"/>
var box2d;
(function (box2d) {
    (function (b2WorldFlag) {
        b2WorldFlag[b2WorldFlag["e_none"] = 0] = "e_none";
        b2WorldFlag[b2WorldFlag["e_newFixture"] = 1] = "e_newFixture";
        b2WorldFlag[b2WorldFlag["e_locked"] = 2] = "e_locked";
        b2WorldFlag[b2WorldFlag["e_clearForces"] = 4] = "e_clearForces";
    })(box2d.b2WorldFlag || (box2d.b2WorldFlag = {}));
    var b2WorldFlag = box2d.b2WorldFlag;
    /// The world class manages all physics entities, dynamic simulation,
    /// and asynchronous queries. The world also contains efficient memory
    /// management facilities.
    var b2World = (function () {
        // public m_controllerList: b2Controller = null;
        // public m_controllerCount: number = 0;
        /// Construct a world object.
        /// @param gravity the world gravity vector.
        function b2World(gravity) {
            // b2BlockAllocator m_blockAllocator;
            // b2StackAllocator m_stackAllocator;
            this.m_flags = b2WorldFlag.e_clearForces;
            this.m_contactManager = new box2d.b2ContactManager();
            this.m_bodyList = null;
            this.m_jointList = null;
            this.m_bodyCount = 0;
            this.m_jointCount = 0;
            this.m_gravity = new box2d.b2Vec2();
            this.m_allowSleep = true;
            this.m_destructionListener = null;
            this.m_debugDraw = null;
            // This is used to compute the time step ratio to
            // support a constiable time step.
            this.m_inv_dt0 = 0;
            // These are for debugging the solver.
            this.m_warmStarting = true;
            this.m_continuousPhysics = true;
            this.m_subStepping = false;
            this.m_stepComplete = true;
            this.m_profile = new box2d.b2Profile();
            this.m_island = new box2d.b2Island();
            this.s_stack = new Array();
            this.m_gravity = gravity.Clone();
        }
        /// Register a destruction listener. The listener is owned by you and must
        /// remain in scope.
        b2World.prototype.SetDestructionListener = function (listener) {
            this.m_destructionListener = listener;
        };
        /// Register a contact filter to provide specific control over collision.
        /// Otherwise the default filter is used (b2_defaultFilter). The listener is
        /// owned by you and must remain in scope.
        b2World.prototype.SetContactFilter = function (filter) {
            this.m_contactManager.m_contactFilter = filter;
        };
        /// Register a contact event listener. The listener is owned by you and must
        /// remain in scope.
        b2World.prototype.SetContactListener = function (listener) {
            this.m_contactManager.m_contactListener = listener;
        };
        /// Register a routine for debug drawing. The debug draw functions are called
        /// inside with b2World::DrawDebugData method. The debug draw object is owned
        /// by you and must remain in scope.
        b2World.prototype.SetDebugDraw = function (debugDraw) {
            this.m_debugDraw = debugDraw;
        };
        /// Create a rigid body given a definition. No reference to the definition
        /// is retained.
        /// @warning This function is locked during callbacks.
        b2World.prototype.CreateBody = function (def) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.IsLocked() === false);
            }
            if (this.IsLocked()) {
                return null;
            }
            var b = new box2d.b2Body(def, this);
            // Add to world doubly linked list.
            b.m_prev = null;
            b.m_next = this.m_bodyList;
            if (this.m_bodyList) {
                this.m_bodyList.m_prev = b;
            }
            this.m_bodyList = b;
            ++this.m_bodyCount;
            return b;
        };
        /// Destroy a rigid body given a definition. No reference to the definition
        /// is retained. This function is locked during callbacks.
        /// @warning This automatically deletes all associated shapes and joints.
        /// @warning This function is locked during callbacks.
        b2World.prototype.DestroyBody = function (b) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_bodyCount > 0);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.IsLocked() === false);
            }
            if (this.IsLocked()) {
                return;
            }
            // Delete the attached joints.
            var je = b.m_jointList;
            while (je) {
                var je0 = je;
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
            //    while (coe)
            //    {
            //      const coe0: b2ControllerEdge = coe;
            //      coe = coe.nextController;
            //      coe0.controller.RemoveBody(b);
            //    }
            // Delete the attached contacts.
            var ce = b.m_contactList;
            while (ce) {
                var ce0 = ce;
                ce = ce.next;
                this.m_contactManager.Destroy(ce0.contact);
            }
            b.m_contactList = null;
            // Delete the attached fixtures. This destroys broad-phase proxies.
            var f = b.m_fixtureList;
            while (f) {
                var f0 = f;
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
        };
        /// Create a joint to constrain bodies together. No reference to the definition
        /// is retained. This may cause the connected bodies to cease colliding.
        /// @warning This function is locked during callbacks.
        b2World.prototype.CreateJoint = function (def) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.IsLocked() === false);
            }
            if (this.IsLocked()) {
                return null;
            }
            var j = box2d.b2JointFactory.Create(def, null);
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
            var bodyA = def.bodyA;
            var bodyB = def.bodyB;
            // If the joint prevents collisions, then flag any contacts for filtering.
            if (def.collideConnected === false) {
                var edge = bodyB.GetContactList();
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
        };
        /// Destroy a joint. This may cause the connected bodies to begin colliding.
        /// @warning This function is locked during callbacks.
        b2World.prototype.DestroyJoint = function (j) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.IsLocked() === false);
            }
            if (this.IsLocked()) {
                return;
            }
            var collideConnected = j.m_collideConnected;
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
            var bodyA = j.m_bodyA;
            var bodyB = j.m_bodyB;
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
            box2d.b2JointFactory.Destroy(j, null);
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_jointCount > 0);
            }
            --this.m_jointCount;
            // If the joint prevents collisions, then flag any contacts for filtering.
            if (collideConnected === false) {
                var edge = bodyB.GetContactList();
                while (edge) {
                    if (edge.other === bodyA) {
                        // Flag the contact for filtering at the next time step (where either
                        // body is awake).
                        edge.contact.FlagForFiltering();
                    }
                    edge = edge.next;
                }
            }
        };
        b2World.prototype.Step = function (dt, velocityIterations, positionIterations) {
            var stepTimer = new box2d.b2Timer();
            // If new fixtures were added, we need to find the new contacts.
            if (this.m_flags & b2WorldFlag.e_newFixture) {
                this.m_contactManager.FindNewContacts();
                this.m_flags &= ~b2WorldFlag.e_newFixture;
            }
            this.m_flags |= b2WorldFlag.e_locked;
            var step = b2World.Step_s_step;
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
            {
                var timer = new box2d.b2Timer();
                this.m_contactManager.Collide();
                this.m_profile.collide = timer.GetMilliseconds();
            }
            // Integrate velocities, solve velocity constraints, and integrate positions.
            if (this.m_stepComplete && step.dt > 0) {
                var timer = new box2d.b2Timer();
                this.Solve(step);
                this.m_profile.solve = timer.GetMilliseconds();
            }
            // Handle TOI events.
            if (this.m_continuousPhysics && step.dt > 0) {
                var timer = new box2d.b2Timer();
                this.SolveTOI(step);
                this.m_profile.solveTOI = timer.GetMilliseconds();
            }
            if (step.dt > 0) {
                this.m_inv_dt0 = step.inv_dt;
            }
            if (this.m_flags & b2WorldFlag.e_clearForces) {
                this.ClearForces();
            }
            this.m_flags &= ~b2WorldFlag.e_locked;
            this.m_profile.step = stepTimer.GetMilliseconds();
        };
        /// Manually clear the force buffer on all bodies. By default, forces are cleared automatically
        /// after each call to Step. The default behavior is modified by calling SetAutoClearForces.
        /// The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
        /// a fixed sized time step under a constiable frame-rate.
        /// When you perform sub-stepping you will disable auto clearing of forces and instead call
        /// ClearForces after all sub-steps are complete in one pass of your game loop.
        /// @see SetAutoClearForces
        b2World.prototype.ClearForces = function () {
            for (var body = this.m_bodyList; body; body = body.m_next) {
                body.m_force.SetZero();
                body.m_torque = 0;
            }
        };
        b2World.prototype.DrawDebugData = function () {
            if (this.m_debugDraw === null) {
                return;
            }
            var flags = this.m_debugDraw.GetFlags();
            var color = b2World.DrawDebugData_s_color.SetRGB(0, 0, 0);
            if (flags & box2d.b2DrawFlags.e_shapeBit) {
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    var xf = b.m_xf;
                    this.m_debugDraw.PushTransform(xf);
                    for (var f = b.GetFixtureList(); f; f = f.m_next) {
                        if (b.IsActive() === false) {
                            color.SetRGB(0.5, 0.5, 0.3);
                            this.DrawShape(f, color);
                        }
                        else if (b.GetType() === box2d.b2BodyType.b2_staticBody) {
                            color.SetRGB(0.5, 0.9, 0.5);
                            this.DrawShape(f, color);
                        }
                        else if (b.GetType() === box2d.b2BodyType.b2_kinematicBody) {
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
            if (flags & box2d.b2DrawFlags.e_jointBit) {
                for (var j = this.m_jointList; j; j = j.m_next) {
                    this.DrawJoint(j);
                }
            }
            /*
            if (flags & b2DrawFlags.e_pairBit) {
              color.SetRGB(0.3, 0.9, 0.9);
              for (const contact = this.m_contactManager.m_contactList; contact; contact = contact.m_next) {
                const fixtureA = contact.GetFixtureA();
                const fixtureB = contact.GetFixtureB();
        
                const cA = fixtureA.GetAABB().GetCenter();
                const cB = fixtureB.GetAABB().GetCenter();
        
                this.m_debugDraw.DrawSegment(cA, cB, color);
              }
            }
            */
            if (flags & box2d.b2DrawFlags.e_aabbBit) {
                color.SetRGB(0.9, 0.3, 0.9);
                var bp = this.m_contactManager.m_broadPhase;
                var vs = b2World.DrawDebugData_s_vs;
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    if (b.IsActive() === false) {
                        continue;
                    }
                    for (var f = b.GetFixtureList(); f; f = f.m_next) {
                        for (var i = 0; i < f.m_proxyCount; ++i) {
                            var proxy = f.m_proxies[i];
                            var aabb = bp.GetFatAABB(proxy.proxy);
                            vs[0].SetXY(aabb.lowerBound.x, aabb.lowerBound.y);
                            vs[1].SetXY(aabb.upperBound.x, aabb.lowerBound.y);
                            vs[2].SetXY(aabb.upperBound.x, aabb.upperBound.y);
                            vs[3].SetXY(aabb.lowerBound.x, aabb.upperBound.y);
                            this.m_debugDraw.DrawPolygon(vs, 4, color);
                        }
                    }
                }
            }
            if (flags & box2d.b2DrawFlags.e_centerOfMassBit) {
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    var xf = b2World.DrawDebugData_s_xf;
                    xf.q.Copy(b.m_xf.q);
                    xf.p.Copy(b.GetWorldCenter());
                    this.m_debugDraw.DrawTransform(xf);
                }
            }
            /// @see b2Controller list
            //    if (flags & b2DrawFlags.e_controllerBit)
            //    {
            //      for (const c = this.m_controllerList; c; c = c.m_next)
            //      {
            //        c.Draw(this.m_debugDraw);
            //      }
            //    }
        };
        /// Query the world for all fixtures that potentially overlap the
        /// provided AABB.
        /// @param callback a user implemented callback class.
        /// @param aabb the query box.
        b2World.prototype.QueryAABB = function (callback, aabb) {
            var broadPhase = this.m_contactManager.m_broadPhase;
            var WorldQueryWrapper = function (proxy) {
                var fixture_proxy = broadPhase.GetUserData(proxy);
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(fixture_proxy instanceof box2d.b2FixtureProxy);
                }
                var fixture = fixture_proxy.fixture;
                var index = fixture_proxy.childIndex;
                if (callback instanceof box2d.b2QueryCallback) {
                    return callback.ReportFixture(fixture);
                }
                else {
                    return callback(fixture);
                }
            };
            broadPhase.Query(WorldQueryWrapper, aabb);
        };
        b2World.prototype.QueryShape = function (callback, shape, transform) {
            var broadPhase = this.m_contactManager.m_broadPhase;
            var WorldQueryWrapper = function (proxy) {
                var fixture_proxy = broadPhase.GetUserData(proxy);
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(fixture_proxy instanceof box2d.b2FixtureProxy);
                }
                var fixture = fixture_proxy.fixture;
                var index = fixture_proxy.childIndex;
                if (box2d.b2TestOverlapShape(shape, 0, fixture.GetShape(), 0, transform, fixture.GetBody().GetTransform())) {
                    if (callback instanceof box2d.b2QueryCallback) {
                        return callback.ReportFixture(fixture);
                    }
                    else {
                        return callback(fixture);
                    }
                }
                return true;
            };
            var aabb = b2World.QueryShape_s_aabb;
            shape.ComputeAABB(aabb, transform, 0); // TODO
            broadPhase.Query(WorldQueryWrapper, aabb);
        };
        b2World.prototype.QueryPoint = function (callback, point) {
            var broadPhase = this.m_contactManager.m_broadPhase;
            var WorldQueryWrapper = function (proxy) {
                var fixture_proxy = broadPhase.GetUserData(proxy);
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(fixture_proxy instanceof box2d.b2FixtureProxy);
                }
                var fixture = fixture_proxy.fixture;
                var index = fixture_proxy.childIndex;
                if (fixture.TestPoint(point)) {
                    if (callback instanceof box2d.b2QueryCallback) {
                        return callback.ReportFixture(fixture);
                    }
                    else {
                        return callback(fixture);
                    }
                }
                return true;
            };
            var aabb = b2World.QueryPoint_s_aabb;
            aabb.lowerBound.SetXY(point.x - box2d.b2_linearSlop, point.y - box2d.b2_linearSlop);
            aabb.upperBound.SetXY(point.x + box2d.b2_linearSlop, point.y + box2d.b2_linearSlop);
            broadPhase.Query(WorldQueryWrapper, aabb);
        };
        b2World.prototype.RayCast = function (callback, point1, point2) {
            var broadPhase = this.m_contactManager.m_broadPhase;
            var WorldRayCastWrapper = function (input, proxy) {
                var fixture_proxy = broadPhase.GetUserData(proxy);
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(fixture_proxy instanceof box2d.b2FixtureProxy);
                }
                var fixture = fixture_proxy.fixture;
                var index = fixture_proxy.childIndex;
                var output = b2World.RayCast_s_output;
                var hit = fixture.RayCast(output, input, index);
                if (hit) {
                    var fraction = output.fraction;
                    var point = b2World.RayCast_s_point;
                    point.SetXY((1 - fraction) * point1.x + fraction * point2.x, (1 - fraction) * point1.y + fraction * point2.y);
                    if (callback instanceof box2d.b2RayCastCallback) {
                        return callback.ReportFixture(fixture, point, output.normal, fraction);
                    }
                    else {
                        return callback(fixture, point, output.normal, fraction);
                    }
                }
                return input.maxFraction;
            };
            var input = b2World.RayCast_s_input;
            input.maxFraction = 1;
            input.p1.Copy(point1);
            input.p2.Copy(point2);
            broadPhase.RayCast(WorldRayCastWrapper, input);
        };
        b2World.prototype.RayCastOne = function (point1, point2) {
            var result = null;
            var min_fraction = 1;
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
        };
        b2World.prototype.RayCastAll = function (point1, point2, out) {
            out.length = 0;
            function WorldRayCastAllWrapper(fixture, point, normal, fraction) {
                out.push(fixture);
                return 1;
            }
            ;
            this.RayCast(WorldRayCastAllWrapper, point1, point2);
            return out;
        };
        /// Get the world body list. With the returned body, use b2Body::GetNext to get
        /// the next body in the world list. A NULL body indicates the end of the list.
        /// @return the head of the world body list.
        b2World.prototype.GetBodyList = function () {
            return this.m_bodyList;
        };
        /// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
        /// the next joint in the world list. A NULL joint indicates the end of the list.
        /// @return the head of the world joint list.
        b2World.prototype.GetJointList = function () {
            return this.m_jointList;
        };
        /// Get the world contact list. With the returned contact, use b2Contact::GetNext to get
        /// the next contact in the world list. A NULL contact indicates the end of the list.
        /// @return the head of the world contact list.
        /// @warning contacts are created and destroyed in the middle of a time step.
        /// Use b2ContactListener to avoid missing contacts.
        b2World.prototype.GetContactList = function () {
            return this.m_contactManager.m_contactList;
        };
        /// Enable/disable sleep.
        b2World.prototype.SetAllowSleeping = function (flag) {
            if (flag === this.m_allowSleep) {
                return;
            }
            this.m_allowSleep = flag;
            if (this.m_allowSleep === false) {
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    b.SetAwake(true);
                }
            }
        };
        b2World.prototype.GetAllowSleeping = function () {
            return this.m_allowSleep;
        };
        /// Enable/disable warm starting. For testing.
        b2World.prototype.SetWarmStarting = function (flag) {
            this.m_warmStarting = flag;
        };
        b2World.prototype.GetWarmStarting = function () {
            return this.m_warmStarting;
        };
        /// Enable/disable continuous physics. For testing.
        b2World.prototype.SetContinuousPhysics = function (flag) {
            this.m_continuousPhysics = flag;
        };
        b2World.prototype.GetContinuousPhysics = function () {
            return this.m_continuousPhysics;
        };
        /// Enable/disable single stepped continuous physics. For testing.
        b2World.prototype.SetSubStepping = function (flag) {
            this.m_subStepping = flag;
        };
        b2World.prototype.GetSubStepping = function () {
            return this.m_subStepping;
        };
        /// Get the number of broad-phase proxies.
        b2World.prototype.GetProxyCount = function () {
            return this.m_contactManager.m_broadPhase.GetProxyCount();
        };
        /// Get the number of bodies.
        b2World.prototype.GetBodyCount = function () {
            return this.m_bodyCount;
        };
        /// Get the number of joints.
        b2World.prototype.GetJointCount = function () {
            return this.m_jointCount;
        };
        /// Get the number of contacts (each may have 0 or more contact points).
        b2World.prototype.GetContactCount = function () {
            return this.m_contactManager.m_contactCount;
        };
        /// Get the height of the dynamic tree.
        b2World.prototype.GetTreeHeight = function () {
            return this.m_contactManager.m_broadPhase.GetTreeHeight();
        };
        /// Get the balance of the dynamic tree.
        b2World.prototype.GetTreeBalance = function () {
            return this.m_contactManager.m_broadPhase.GetTreeBalance();
        };
        /// Get the quality metric of the dynamic tree. The smaller the better.
        /// The minimum is 1.
        b2World.prototype.GetTreeQuality = function () {
            return this.m_contactManager.m_broadPhase.GetTreeQuality();
        };
        /// Change the global gravity vector.
        b2World.prototype.SetGravity = function (gravity, wake) {
            if (wake === void 0) { wake = true; }
            if ((this.m_gravity.x !== gravity.x) || (this.m_gravity.y !== gravity.y)) {
                this.m_gravity.Copy(gravity);
                if (wake) {
                    for (var b = this.m_bodyList; b; b = b.m_next) {
                        b.SetAwake(true);
                    }
                }
            }
        };
        /// Get the global gravity vector.
        b2World.prototype.GetGravity = function () {
            return this.m_gravity;
        };
        /// Is the world locked (in the middle of a time step).
        b2World.prototype.IsLocked = function () {
            return (this.m_flags & b2WorldFlag.e_locked) > 0;
        };
        /// Set flag to control automatic clearing of forces after each time step.
        b2World.prototype.SetAutoClearForces = function (flag) {
            if (flag) {
                this.m_flags |= b2WorldFlag.e_clearForces;
            }
            else {
                this.m_flags &= ~b2WorldFlag.e_clearForces;
            }
        };
        /// Get the flag that controls automatic clearing of forces after each time step.
        b2World.prototype.GetAutoClearForces = function () {
            return (this.m_flags & b2WorldFlag.e_clearForces) === b2WorldFlag.e_clearForces;
        };
        /// Shift the world origin. Useful for large worlds.
        /// The body shift formula is: position -= newOrigin
        /// @param newOrigin the new origin with respect to the old origin
        b2World.prototype.ShiftOrigin = function (newOrigin) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.IsLocked() === false);
            }
            if (this.IsLocked()) {
                return;
            }
            for (var b = this.m_bodyList; b; b = b.m_next) {
                b.m_xf.p.SelfSub(newOrigin);
                b.m_sweep.c0.SelfSub(newOrigin);
                b.m_sweep.c.SelfSub(newOrigin);
            }
            for (var j = this.m_jointList; j; j = j.m_next) {
                j.ShiftOrigin(newOrigin);
            }
            this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
        };
        /// Get the contact manager for testing.
        b2World.prototype.GetContactManager = function () {
            return this.m_contactManager;
        };
        /// Get the current profile.
        b2World.prototype.GetProfile = function () {
            return this.m_profile;
        };
        /// Dump the world into the log file.
        /// @warning this should be called outside of a time step.
        b2World.prototype.Dump = function () {
            if (box2d.DEBUG) {
                if ((this.m_flags & b2WorldFlag.e_locked) === b2WorldFlag.e_locked) {
                    return;
                }
                box2d.b2Log("const g: b2Vec2 = new b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
                box2d.b2Log("this.m_world.SetGravity(g);\n");
                box2d.b2Log("const bodies: b2Body[] = new Array(%d);\n", this.m_bodyCount);
                box2d.b2Log("const joints: b2Joint[] = new Array(%d);\n", this.m_jointCount);
                var i = 0;
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    b.m_islandIndex = i;
                    b.Dump();
                    ++i;
                }
                i = 0;
                for (var j = this.m_jointList; j; j = j.m_next) {
                    j.m_index = i;
                    ++i;
                }
                // First pass on joints, skip gear joints.
                for (var j = this.m_jointList; j; j = j.m_next) {
                    if (j.m_type === box2d.b2JointType.e_gearJoint) {
                        continue;
                    }
                    box2d.b2Log("{\n");
                    j.Dump();
                    box2d.b2Log("}\n");
                }
                // Second pass on joints, only gear joints.
                for (var j = this.m_jointList; j; j = j.m_next) {
                    if (j.m_type !== box2d.b2JointType.e_gearJoint) {
                        continue;
                    }
                    box2d.b2Log("{\n");
                    j.Dump();
                    box2d.b2Log("}\n");
                }
            }
        };
        b2World.prototype.DrawJoint = function (joint) {
            var bodyA = joint.GetBodyA();
            var bodyB = joint.GetBodyB();
            var xf1 = bodyA.m_xf;
            var xf2 = bodyB.m_xf;
            var x1 = xf1.p;
            var x2 = xf2.p;
            var p1 = joint.GetAnchorA(b2World.DrawJoint_s_p1);
            var p2 = joint.GetAnchorB(b2World.DrawJoint_s_p2);
            var color = b2World.DrawJoint_s_color.SetRGB(0.5, 0.8, 0.8);
            switch (joint.m_type) {
                case box2d.b2JointType.e_distanceJoint:
                    this.m_debugDraw.DrawSegment(p1, p2, color);
                    break;
                case box2d.b2JointType.e_pulleyJoint:
                    {
                        var pulley = joint;
                        var s1 = pulley.GetGroundAnchorA();
                        var s2 = pulley.GetGroundAnchorB();
                        this.m_debugDraw.DrawSegment(s1, p1, color);
                        this.m_debugDraw.DrawSegment(s2, p2, color);
                        this.m_debugDraw.DrawSegment(s1, s2, color);
                    }
                    break;
                case box2d.b2JointType.e_mouseJoint:
                    // don't draw this
                    this.m_debugDraw.DrawSegment(p1, p2, color);
                    break;
                default:
                    this.m_debugDraw.DrawSegment(x1, p1, color);
                    this.m_debugDraw.DrawSegment(p1, p2, color);
                    this.m_debugDraw.DrawSegment(x2, p2, color);
            }
        };
        b2World.prototype.DrawShape = function (fixture, color) {
            var shape = fixture.GetShape();
            switch (shape.m_type) {
                case box2d.b2ShapeType.e_circleShape:
                    {
                        var circle = shape; // ((shape instanceof b2CircleShape ? shape : null));
                        var center = circle.m_p;
                        var radius = circle.m_radius;
                        var axis = box2d.b2Vec2.UNITX;
                        this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
                    }
                    break;
                case box2d.b2ShapeType.e_edgeShape:
                    {
                        var edge = shape; // ((shape instanceof b2EdgeShape ? shape : null));
                        var v1 = edge.m_vertex1;
                        var v2 = edge.m_vertex2;
                        this.m_debugDraw.DrawSegment(v1, v2, color);
                    }
                    break;
                case box2d.b2ShapeType.e_chainShape:
                    {
                        var chain = shape; // ((shape instanceof b2ChainShape ? shape : null));
                        var count = chain.m_count;
                        var vertices = chain.m_vertices;
                        var v1 = vertices[0];
                        this.m_debugDraw.DrawCircle(v1, 0.05, color);
                        for (var i = 1; i < count; ++i) {
                            var v2 = vertices[i];
                            this.m_debugDraw.DrawSegment(v1, v2, color);
                            this.m_debugDraw.DrawCircle(v2, 0.05, color);
                            v1 = v2;
                        }
                    }
                    break;
                case box2d.b2ShapeType.e_polygonShape:
                    {
                        var poly = shape; // ((shape instanceof b2PolygonShape ? shape : null));
                        var vertexCount = poly.m_count;
                        var vertices = poly.m_vertices;
                        this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
                    }
                    break;
            }
        };
        b2World.prototype.Solve = function (step) {
            /// @see b2Controller list
            //    for (const controller = this.m_controllerList; controller; controller = controller.m_next)
            //    {
            //      controller.Step(step);
            //    }
            this.m_profile.solveInit = 0;
            this.m_profile.solveVelocity = 0;
            this.m_profile.solvePosition = 0;
            // Size the island for the worst case.
            var island = this.m_island;
            island.Initialize(this.m_bodyCount, this.m_contactManager.m_contactCount, this.m_jointCount, null, // this.m_stackAllocator,
            this.m_contactManager.m_contactListener);
            // Clear all the island flags.
            for (var b = this.m_bodyList; b; b = b.m_next) {
                b.m_flags &= ~box2d.b2BodyFlag.e_islandFlag;
            }
            for (var c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                c.m_flags &= ~box2d.b2ContactFlag.e_islandFlag;
            }
            for (var j = this.m_jointList; j; j = j.m_next) {
                j.m_islandFlag = false;
            }
            // Build and simulate all awake islands.
            var stackSize = this.m_bodyCount;
            var stack = this.s_stack;
            for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
                if (seed.m_flags & box2d.b2BodyFlag.e_islandFlag) {
                    continue;
                }
                if (seed.IsAwake() === false || seed.IsActive() === false) {
                    continue;
                }
                // The seed can be dynamic or kinematic.
                if (seed.GetType() === box2d.b2BodyType.b2_staticBody) {
                    continue;
                }
                // Reset island and stack.
                island.Clear();
                var stackCount = 0;
                stack[stackCount++] = seed;
                seed.m_flags |= box2d.b2BodyFlag.e_islandFlag;
                // Perform a depth first search (DFS) on the constraint graph.
                while (stackCount > 0) {
                    // Grab the next body off the stack and add it to the island.
                    var b = stack[--stackCount];
                    if (box2d.ENABLE_ASSERTS) {
                        box2d.b2Assert(b.IsActive() === true);
                    }
                    island.AddBody(b);
                    // Make sure the body is awake.
                    b.SetAwake(true);
                    // To keep islands as small as possible, we don't
                    // propagate islands across static bodies.
                    if (b.GetType() === box2d.b2BodyType.b2_staticBody) {
                        continue;
                    }
                    // Search all contacts connected to this body.
                    for (var ce = b.m_contactList; ce; ce = ce.next) {
                        var contact = ce.contact;
                        // Has this contact already been added to an island?
                        if (contact.m_flags & box2d.b2ContactFlag.e_islandFlag) {
                            continue;
                        }
                        // Is this contact solid and touching?
                        if (contact.IsEnabled() === false ||
                            contact.IsTouching() === false) {
                            continue;
                        }
                        // Skip sensors.
                        var sensorA = contact.m_fixtureA.m_isSensor;
                        var sensorB = contact.m_fixtureB.m_isSensor;
                        if (sensorA || sensorB) {
                            continue;
                        }
                        island.AddContact(contact);
                        contact.m_flags |= box2d.b2ContactFlag.e_islandFlag;
                        var other = ce.other;
                        // Was the other body already added to this island?
                        if (other.m_flags & box2d.b2BodyFlag.e_islandFlag) {
                            continue;
                        }
                        if (box2d.ENABLE_ASSERTS) {
                            box2d.b2Assert(stackCount < stackSize);
                        }
                        stack[stackCount++] = other;
                        other.m_flags |= box2d.b2BodyFlag.e_islandFlag;
                    }
                    // Search all joints connect to this body.
                    for (var je = b.m_jointList; je; je = je.next) {
                        if (je.joint.m_islandFlag === true) {
                            continue;
                        }
                        var other = je.other;
                        // Don't simulate joints connected to inactive bodies.
                        if (other.IsActive() === false) {
                            continue;
                        }
                        island.AddJoint(je.joint);
                        je.joint.m_islandFlag = true;
                        if (other.m_flags & box2d.b2BodyFlag.e_islandFlag) {
                            continue;
                        }
                        if (box2d.ENABLE_ASSERTS) {
                            box2d.b2Assert(stackCount < stackSize);
                        }
                        stack[stackCount++] = other;
                        other.m_flags |= box2d.b2BodyFlag.e_islandFlag;
                    }
                }
                var profile = new box2d.b2Profile();
                island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
                this.m_profile.solveInit += profile.solveInit;
                this.m_profile.solveVelocity += profile.solveVelocity;
                this.m_profile.solvePosition += profile.solvePosition;
                // Post solve cleanup.
                for (var i = 0; i < island.m_bodyCount; ++i) {
                    // Allow static bodies to participate in other islands.
                    var b = island.m_bodies[i];
                    if (b.GetType() === box2d.b2BodyType.b2_staticBody) {
                        b.m_flags &= ~box2d.b2BodyFlag.e_islandFlag;
                    }
                }
            }
            for (var i = 0; i < stack.length; ++i) {
                if (!stack[i])
                    break;
                stack[i] = null;
            }
            {
                var timer = new box2d.b2Timer();
                // Synchronize fixtures, check for out of range bodies.
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    // If a body was not in an island then it did not move.
                    if ((b.m_flags & box2d.b2BodyFlag.e_islandFlag) === 0) {
                        continue;
                    }
                    if (b.GetType() === box2d.b2BodyType.b2_staticBody) {
                        continue;
                    }
                    // Update fixtures (for broad-phase).
                    b.SynchronizeFixtures();
                }
                // Look for new contacts.
                this.m_contactManager.FindNewContacts();
                this.m_profile.broadphase = timer.GetMilliseconds();
            }
        };
        b2World.prototype.SolveTOI = function (step) {
            // b2Island island(2 * b2_maxTOIContacts, b2_maxTOIContacts, 0, &m_stackAllocator, m_contactManager.m_contactListener);
            var island = this.m_island;
            island.Initialize(2 * box2d.b2_maxTOIContacts, box2d.b2_maxTOIContacts, 0, null, this.m_contactManager.m_contactListener);
            if (this.m_stepComplete) {
                for (var b = this.m_bodyList; b; b = b.m_next) {
                    b.m_flags &= ~box2d.b2BodyFlag.e_islandFlag;
                    b.m_sweep.alpha0 = 0;
                }
                for (var c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                    // Invalidate TOI
                    c.m_flags &= ~(box2d.b2ContactFlag.e_toiFlag | box2d.b2ContactFlag.e_islandFlag);
                    c.m_toiCount = 0;
                    c.m_toi = 1;
                }
            }
            // Find TOI events and solve them.
            for (;;) {
                // Find the first TOI.
                var minContact = null;
                var minAlpha = 1;
                for (var c = this.m_contactManager.m_contactList; c; c = c.m_next) {
                    // Is this contact disabled?
                    if (c.IsEnabled() === false) {
                        continue;
                    }
                    // Prevent excessive sub-stepping.
                    if (c.m_toiCount > box2d.b2_maxSubSteps) {
                        continue;
                    }
                    var alpha = 1;
                    if (c.m_flags & box2d.b2ContactFlag.e_toiFlag) {
                        // This contact has a valid cached TOI.
                        alpha = c.m_toi;
                    }
                    else {
                        var fA_1 = c.GetFixtureA();
                        var fB_1 = c.GetFixtureB();
                        // Is there a sensor?
                        if (fA_1.IsSensor() || fB_1.IsSensor()) {
                            continue;
                        }
                        var bA_1 = fA_1.GetBody();
                        var bB_1 = fB_1.GetBody();
                        var typeA = bA_1.m_type;
                        var typeB = bB_1.m_type;
                        if (box2d.ENABLE_ASSERTS) {
                            box2d.b2Assert(typeA === box2d.b2BodyType.b2_dynamicBody || typeB === box2d.b2BodyType.b2_dynamicBody);
                        }
                        var activeA = bA_1.IsAwake() && typeA !== box2d.b2BodyType.b2_staticBody;
                        var activeB = bB_1.IsAwake() && typeB !== box2d.b2BodyType.b2_staticBody;
                        // Is at least one body active (awake and dynamic or kinematic)?
                        if (activeA === false && activeB === false) {
                            continue;
                        }
                        var collideA = bA_1.IsBullet() || typeA !== box2d.b2BodyType.b2_dynamicBody;
                        var collideB = bB_1.IsBullet() || typeB !== box2d.b2BodyType.b2_dynamicBody;
                        // Are these two non-bullet dynamic bodies?
                        if (collideA === false && collideB === false) {
                            continue;
                        }
                        // Compute the TOI for this contact.
                        // Put the sweeps onto the same time interval.
                        var alpha0 = bA_1.m_sweep.alpha0;
                        if (bA_1.m_sweep.alpha0 < bB_1.m_sweep.alpha0) {
                            alpha0 = bB_1.m_sweep.alpha0;
                            bA_1.m_sweep.Advance(alpha0);
                        }
                        else if (bB_1.m_sweep.alpha0 < bA_1.m_sweep.alpha0) {
                            alpha0 = bA_1.m_sweep.alpha0;
                            bB_1.m_sweep.Advance(alpha0);
                        }
                        if (box2d.ENABLE_ASSERTS) {
                            box2d.b2Assert(alpha0 < 1);
                        }
                        var indexA = c.GetChildIndexA();
                        var indexB = c.GetChildIndexB();
                        // Compute the time of impact in interval [0, minTOI]
                        var input = b2World.SolveTOI_s_toi_input;
                        input.proxyA.SetShape(fA_1.GetShape(), indexA);
                        input.proxyB.SetShape(fB_1.GetShape(), indexB);
                        input.sweepA.Copy(bA_1.m_sweep);
                        input.sweepB.Copy(bB_1.m_sweep);
                        input.tMax = 1;
                        var output = b2World.SolveTOI_s_toi_output;
                        box2d.b2TimeOfImpact(output, input);
                        // Beta is the fraction of the remaining portion of the .
                        var beta = output.t;
                        if (output.state === box2d.b2TOIOutputState.e_touching) {
                            alpha = box2d.b2Min(alpha0 + (1 - alpha0) * beta, 1);
                        }
                        else {
                            alpha = 1;
                        }
                        c.m_toi = alpha;
                        c.m_flags |= box2d.b2ContactFlag.e_toiFlag;
                    }
                    if (alpha < minAlpha) {
                        // This is the minimum TOI found so far.
                        minContact = c;
                        minAlpha = alpha;
                    }
                }
                if (minContact === null || 1 - 10 * box2d.b2_epsilon < minAlpha) {
                    // No more TOI events. Done!
                    this.m_stepComplete = true;
                    break;
                }
                // Advance the bodies to the TOI.
                var fA = minContact.GetFixtureA();
                var fB = minContact.GetFixtureB();
                var bA = fA.GetBody();
                var bB = fB.GetBody();
                var backup1 = b2World.SolveTOI_s_backup1.Copy(bA.m_sweep);
                var backup2 = b2World.SolveTOI_s_backup2.Copy(bB.m_sweep);
                bA.Advance(minAlpha);
                bB.Advance(minAlpha);
                // The TOI contact likely has some new contact points.
                minContact.Update(this.m_contactManager.m_contactListener);
                minContact.m_flags &= ~box2d.b2ContactFlag.e_toiFlag;
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
                bA.m_flags |= box2d.b2BodyFlag.e_islandFlag;
                bB.m_flags |= box2d.b2BodyFlag.e_islandFlag;
                minContact.m_flags |= box2d.b2ContactFlag.e_islandFlag;
                // Get contacts on bodyA and bodyB.
                // const bodies: b2Body[] = [bA, bB];
                for (var i = 0; i < 2; ++i) {
                    var body = (i === 0) ? (bA) : (bB); // bodies[i];
                    if (body.m_type === box2d.b2BodyType.b2_dynamicBody) {
                        for (var ce = body.m_contactList; ce; ce = ce.next) {
                            if (island.m_bodyCount === island.m_bodyCapacity) {
                                break;
                            }
                            if (island.m_contactCount === island.m_contactCapacity) {
                                break;
                            }
                            var contact = ce.contact;
                            // Has this contact already been added to the island?
                            if (contact.m_flags & box2d.b2ContactFlag.e_islandFlag) {
                                continue;
                            }
                            // Only add static, kinematic, or bullet bodies.
                            var other = ce.other;
                            if (other.m_type === box2d.b2BodyType.b2_dynamicBody &&
                                body.IsBullet() === false && other.IsBullet() === false) {
                                continue;
                            }
                            // Skip sensors.
                            var sensorA = contact.m_fixtureA.m_isSensor;
                            var sensorB = contact.m_fixtureB.m_isSensor;
                            if (sensorA || sensorB) {
                                continue;
                            }
                            // Tentatively advance the body to the TOI.
                            var backup = b2World.SolveTOI_s_backup.Copy(other.m_sweep);
                            if ((other.m_flags & box2d.b2BodyFlag.e_islandFlag) === 0) {
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
                            contact.m_flags |= box2d.b2ContactFlag.e_islandFlag;
                            island.AddContact(contact);
                            // Has the other body already been added to the island?
                            if (other.m_flags & box2d.b2BodyFlag.e_islandFlag) {
                                continue;
                            }
                            // Add the other body to the island.
                            other.m_flags |= box2d.b2BodyFlag.e_islandFlag;
                            if (other.m_type !== box2d.b2BodyType.b2_staticBody) {
                                other.SetAwake(true);
                            }
                            island.AddBody(other);
                        }
                    }
                }
                var subStep = b2World.SolveTOI_s_subStep;
                subStep.dt = (1 - minAlpha) * step.dt;
                subStep.inv_dt = 1 / subStep.dt;
                subStep.dtRatio = 1;
                subStep.positionIterations = 20;
                subStep.velocityIterations = step.velocityIterations;
                subStep.warmStarting = false;
                island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);
                // Reset island flags and synchronize broad-phase proxies.
                for (var i = 0; i < island.m_bodyCount; ++i) {
                    var body = island.m_bodies[i];
                    body.m_flags &= ~box2d.b2BodyFlag.e_islandFlag;
                    if (body.m_type !== box2d.b2BodyType.b2_dynamicBody) {
                        continue;
                    }
                    body.SynchronizeFixtures();
                    // Invalidate all contact TOIs on this displaced body.
                    for (var ce = body.m_contactList; ce; ce = ce.next) {
                        ce.contact.m_flags &= ~(box2d.b2ContactFlag.e_toiFlag | box2d.b2ContactFlag.e_islandFlag);
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
        };
        /// Take a time step. This performs collision detection, integration,
        /// and constraint solution.
        /// @param timeStep the amount of time to simulate, this should not consty.
        /// @param velocityIterations for the velocity constraint solver.
        /// @param positionIterations for the position constraint solver.
        b2World.Step_s_step = new box2d.b2TimeStep();
        /// Call this to draw shapes and other debug draw data.
        b2World.DrawDebugData_s_color = new box2d.b2Color(0, 0, 0);
        b2World.DrawDebugData_s_vs = box2d.b2Vec2.MakeArray(4);
        b2World.DrawDebugData_s_xf = new box2d.b2Transform();
        b2World.QueryShape_s_aabb = new box2d.b2AABB();
        b2World.QueryPoint_s_aabb = new box2d.b2AABB();
        /// Ray-cast the world for all fixtures in the path of the ray. Your callback
        /// controls whether you get the closest point, any point, or n-points.
        /// The ray-cast ignores shapes that contain the starting point.
        /// @param callback a user implemented callback class.
        /// @param point1 the ray starting point
        /// @param point2 the ray ending point
        b2World.RayCast_s_input = new box2d.b2RayCastInput();
        b2World.RayCast_s_output = new box2d.b2RayCastOutput();
        b2World.RayCast_s_point = new box2d.b2Vec2();
        b2World.DrawJoint_s_p1 = new box2d.b2Vec2();
        b2World.DrawJoint_s_p2 = new box2d.b2Vec2();
        b2World.DrawJoint_s_color = new box2d.b2Color(0.5, 0.8, 0.8);
        b2World.SolveTOI_s_subStep = new box2d.b2TimeStep();
        b2World.SolveTOI_s_backup = new box2d.b2Sweep();
        b2World.SolveTOI_s_backup1 = new box2d.b2Sweep();
        b2World.SolveTOI_s_backup2 = new box2d.b2Sweep();
        b2World.SolveTOI_s_toi_input = new box2d.b2TOIInput();
        b2World.SolveTOI_s_toi_output = new box2d.b2TOIOutput();
        return b2World;
    }());
    box2d.b2World = b2World;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../../Box2D/Box2D/Common/b2Math.ts"/>
/// <reference path="../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/b2World.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
var box2d;
(function (box2d) {
    /// The body type.
    /// static: zero mass, zero velocity, may be manually moved
    /// kinematic: zero mass, non-zero velocity set by user, moved by solver
    /// dynamic: positive mass, non-zero velocity determined by forces, moved by solver
    (function (b2BodyType) {
        b2BodyType[b2BodyType["b2_unknown"] = -1] = "b2_unknown";
        b2BodyType[b2BodyType["b2_staticBody"] = 0] = "b2_staticBody";
        b2BodyType[b2BodyType["b2_kinematicBody"] = 1] = "b2_kinematicBody";
        b2BodyType[b2BodyType["b2_dynamicBody"] = 2] = "b2_dynamicBody";
    })(box2d.b2BodyType || (box2d.b2BodyType = {}));
    var b2BodyType = box2d.b2BodyType;
    /// A body definition holds all the data needed to construct a rigid body.
    /// You can safely re-use body definitions. Shapes are added to a body after construction.
    var b2BodyDef = (function () {
        function b2BodyDef() {
            /// The body type: static, kinematic, or dynamic.
            /// Note: if a dynamic body would have zero mass, the mass is set to one.
            this.type = b2BodyType.b2_staticBody;
            /// The world position of the body. Avoid creating bodies at the origin
            /// since this can lead to many overlapping shapes.
            this.position = new box2d.b2Vec2(0, 0);
            /// The world angle of the body in radians.
            this.angle = 0;
            /// The linear velocity of the body's origin in world co-ordinates.
            this.linearVelocity = new box2d.b2Vec2(0, 0);
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
        return b2BodyDef;
    }());
    box2d.b2BodyDef = b2BodyDef;
    (function (b2BodyFlag) {
        b2BodyFlag[b2BodyFlag["e_none"] = 0] = "e_none";
        b2BodyFlag[b2BodyFlag["e_islandFlag"] = 1] = "e_islandFlag";
        b2BodyFlag[b2BodyFlag["e_awakeFlag"] = 2] = "e_awakeFlag";
        b2BodyFlag[b2BodyFlag["e_autoSleepFlag"] = 4] = "e_autoSleepFlag";
        b2BodyFlag[b2BodyFlag["e_bulletFlag"] = 8] = "e_bulletFlag";
        b2BodyFlag[b2BodyFlag["e_fixedRotationFlag"] = 16] = "e_fixedRotationFlag";
        b2BodyFlag[b2BodyFlag["e_activeFlag"] = 32] = "e_activeFlag";
        b2BodyFlag[b2BodyFlag["e_toiFlag"] = 64] = "e_toiFlag";
    })(box2d.b2BodyFlag || (box2d.b2BodyFlag = {}));
    var b2BodyFlag = box2d.b2BodyFlag;
    /// A rigid body. These are created via b2World::CreateBody.
    var b2Body = (function () {
        // public m_controllerList: b2ControllerEdge = null;
        // public m_controllerCount: number = 0;
        function b2Body(bd, world) {
            this.m_type = b2BodyType.b2_staticBody;
            this.m_flags = b2BodyFlag.e_none;
            this.m_islandIndex = 0;
            this.m_xf = new box2d.b2Transform(); // the body origin transform
            this.m_sweep = new box2d.b2Sweep(); // the swept motion for CCD
            this.m_linearVelocity = new box2d.b2Vec2();
            this.m_angularVelocity = 0;
            this.m_force = new box2d.b2Vec2;
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
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(bd.position.IsValid());
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(bd.linearVelocity.IsValid());
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(bd.angle));
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(bd.angularVelocity));
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(bd.gravityScale) && bd.gravityScale >= 0);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(bd.angularDamping) && bd.angularDamping >= 0);
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(box2d.b2IsValid(bd.linearDamping) && bd.linearDamping >= 0);
            }
            this.m_flags = b2BodyFlag.e_none;
            if (bd.bullet) {
                this.m_flags |= b2BodyFlag.e_bulletFlag;
            }
            if (bd.fixedRotation) {
                this.m_flags |= b2BodyFlag.e_fixedRotationFlag;
            }
            if (bd.allowSleep) {
                this.m_flags |= b2BodyFlag.e_autoSleepFlag;
            }
            if (bd.awake) {
                this.m_flags |= b2BodyFlag.e_awakeFlag;
            }
            if (bd.active) {
                this.m_flags |= b2BodyFlag.e_activeFlag;
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
            if (bd.type === b2BodyType.b2_dynamicBody) {
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
        b2Body.prototype.CreateFixture = function (def) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_world.IsLocked() === false);
            }
            if (this.m_world.IsLocked() === true) {
                return null;
            }
            var fixture = new box2d.b2Fixture();
            fixture.Create(this, def);
            if (this.m_flags & b2BodyFlag.e_activeFlag) {
                var broadPhase = this.m_world.m_contactManager.m_broadPhase;
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
            this.m_world.m_flags |= box2d.b2WorldFlag.e_newFixture;
            return fixture;
        };
        b2Body.prototype.CreateFixture2 = function (shape, density) {
            if (density === void 0) { density = 0; }
            var def = b2Body.CreateFixture2_s_def;
            def.shape = shape;
            def.density = density;
            return this.CreateFixture(def);
        };
        /// Destroy a fixture. This removes the fixture from the broad-phase and
        /// destroys all contacts associated with this fixture. This will
        /// automatically adjust the mass of the body if the body is dynamic and the
        /// fixture has positive density.
        /// All fixtures attached to a body are implicitly destroyed when the body is destroyed.
        /// @param fixture the fixture to be removed.
        /// @warning This function is locked during callbacks.
        b2Body.prototype.DestroyFixture = function (fixture) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_world.IsLocked() === false);
            }
            if (this.m_world.IsLocked() === true) {
                return;
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(fixture.m_body === this);
            }
            // Remove the fixture from this body's singly linked list.
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_fixtureCount > 0);
            }
            var node = this.m_fixtureList;
            var ppF = null;
            var found = false;
            while (node != null) {
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
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(found);
            }
            // Destroy any contacts associated with the fixture.
            var edge = this.m_contactList;
            while (edge) {
                var c = edge.contact;
                edge = edge.next;
                var fixtureA = c.GetFixtureA();
                var fixtureB = c.GetFixtureB();
                if (fixture === fixtureA || fixture === fixtureB) {
                    // This destroys the contact and removes it from
                    // this body's contact list.
                    this.m_world.m_contactManager.Destroy(c);
                }
            }
            if (this.m_flags & b2BodyFlag.e_activeFlag) {
                var broadPhase = this.m_world.m_contactManager.m_broadPhase;
                fixture.DestroyProxies(broadPhase);
            }
            fixture.Destroy();
            fixture.m_body = null;
            fixture.m_next = null;
            --this.m_fixtureCount;
            // Reset the mass data.
            this.ResetMassData();
        };
        /// Set the position of the body's origin and rotation.
        /// This breaks any contacts and wakes the other bodies.
        /// Manipulating a body's transform may cause non-physical behavior.
        /// @param position the world position of the body's local origin.
        /// @param angle the world rotation in radians.
        b2Body.prototype.SetTransformVecRadians = function (position, angle) {
            this.SetTransformXYRadians(position.x, position.y, angle);
        };
        b2Body.prototype.SetTransformXYRadians = function (x, y, angle) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_world.IsLocked() === false);
            }
            if (this.m_world.IsLocked() === true) {
                return;
            }
            this.m_xf.q.SetAngleRadians(angle);
            this.m_xf.p.SetXY(x, y);
            box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
            this.m_sweep.a = angle;
            this.m_sweep.c0.Copy(this.m_sweep.c);
            this.m_sweep.a0 = angle;
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            for (var f = this.m_fixtureList; f; f = f.m_next) {
                f.Synchronize(broadPhase, this.m_xf, this.m_xf);
            }
            this.m_world.m_contactManager.FindNewContacts();
        };
        b2Body.prototype.SetTransform = function (xf) {
            this.SetTransformVecRadians(xf.p, xf.GetAngleRadians());
        };
        /// Get the body transform for the body's origin.
        /// @return the world transform of the body's origin.
        b2Body.prototype.GetTransform = function () {
            return this.m_xf;
        };
        /// Get the world body origin position.
        /// @return the world position of the body's origin.
        b2Body.prototype.GetPosition = function () {
            return this.m_xf.p;
        };
        b2Body.prototype.SetPosition = function (position) {
            this.SetTransformVecRadians(position, this.GetAngleRadians());
        };
        b2Body.prototype.SetPositionXY = function (x, y) {
            this.SetTransformXYRadians(x, y, this.GetAngleRadians());
        };
        /// Get the angle in radians.
        /// @return the current world rotation angle in radians.
        b2Body.prototype.GetAngleRadians = function () {
            return this.m_sweep.a;
        };
        b2Body.prototype.SetAngleRadians = function (angle) {
            this.SetTransformVecRadians(this.GetPosition(), angle);
        };
        /// Get the world position of the center of mass.
        b2Body.prototype.GetWorldCenter = function () {
            return this.m_sweep.c;
        };
        /// Get the local position of the center of mass.
        b2Body.prototype.GetLocalCenter = function () {
            return this.m_sweep.localCenter;
        };
        /// Set the linear velocity of the center of mass.
        /// @param v the new linear velocity of the center of mass.
        b2Body.prototype.SetLinearVelocity = function (v) {
            if (this.m_type === b2BodyType.b2_staticBody) {
                return;
            }
            if (box2d.b2DotVV(v, v) > 0) {
                this.SetAwake(true);
            }
            this.m_linearVelocity.Copy(v);
        };
        /// Get the linear velocity of the center of mass.
        /// @return the linear velocity of the center of mass.
        b2Body.prototype.GetLinearVelocity = function () {
            return this.m_linearVelocity;
        };
        /// Set the angular velocity.
        /// @param omega the new angular velocity in radians/second.
        b2Body.prototype.SetAngularVelocity = function (w) {
            if (this.m_type === b2BodyType.b2_staticBody) {
                return;
            }
            if (w * w > 0) {
                this.SetAwake(true);
            }
            this.m_angularVelocity = w;
        };
        /// Get the angular velocity.
        /// @return the angular velocity in radians/second.
        b2Body.prototype.GetAngularVelocity = function () {
            return this.m_angularVelocity;
        };
        b2Body.prototype.GetDefinition = function (bd) {
            bd.type = this.GetType();
            bd.allowSleep = (this.m_flags & b2BodyFlag.e_autoSleepFlag) === b2BodyFlag.e_autoSleepFlag;
            bd.angle = this.GetAngleRadians();
            bd.angularDamping = this.m_angularDamping;
            bd.gravityScale = this.m_gravityScale;
            bd.angularVelocity = this.m_angularVelocity;
            bd.fixedRotation = (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === b2BodyFlag.e_fixedRotationFlag;
            bd.bullet = (this.m_flags & b2BodyFlag.e_bulletFlag) === b2BodyFlag.e_bulletFlag;
            bd.awake = (this.m_flags & b2BodyFlag.e_awakeFlag) === b2BodyFlag.e_awakeFlag;
            bd.linearDamping = this.m_linearDamping;
            bd.linearVelocity.Copy(this.GetLinearVelocity());
            bd.position.Copy(this.GetPosition());
            bd.userData = this.GetUserData();
            return bd;
        };
        /// Apply a force at a world point. If the force is not
        /// applied at the center of mass, it will generate a torque and
        /// affect the angular velocity. This wakes up the body.
        /// @param force the world force vector, usually in Newtons (N).
        /// @param point the world position of the point of application.
        /// @param wake also wake up the body
        b2Body.prototype.ApplyForce = function (force, point, wake) {
            if (wake === void 0) { wake = true; }
            if (this.m_type !== b2BodyType.b2_dynamicBody) {
                return;
            }
            if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
                this.SetAwake(true);
            }
            // Don't accumulate a force if the body is sleeping.
            if (this.m_flags & b2BodyFlag.e_awakeFlag) {
                this.m_force.x += force.x;
                this.m_force.y += force.y;
                this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
            }
        };
        /// Apply a force to the center of mass. This wakes up the body.
        /// @param force the world force vector, usually in Newtons (N).
        /// @param wake also wake up the body
        b2Body.prototype.ApplyForceToCenter = function (force, wake) {
            if (wake === void 0) { wake = true; }
            if (this.m_type !== b2BodyType.b2_dynamicBody) {
                return;
            }
            if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
                this.SetAwake(true);
            }
            // Don't accumulate a force if the body is sleeping.
            if (this.m_flags & b2BodyFlag.e_awakeFlag) {
                this.m_force.x += force.x;
                this.m_force.y += force.y;
            }
        };
        /// Apply a torque. This affects the angular velocity
        /// without affecting the linear velocity of the center of mass.
        /// This wakes up the body.
        /// @param torque about the z-axis (out of the screen), usually in N-m.
        /// @param wake also wake up the body
        b2Body.prototype.ApplyTorque = function (torque, wake) {
            if (wake === void 0) { wake = true; }
            if (this.m_type !== b2BodyType.b2_dynamicBody) {
                return;
            }
            if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
                this.SetAwake(true);
            }
            // Don't accumulate a force if the body is sleeping.
            if (this.m_flags & b2BodyFlag.e_awakeFlag) {
                this.m_torque += torque;
            }
        };
        /// Apply an impulse at a point. This immediately modifies the velocity.
        /// It also modifies the angular velocity if the point of application
        /// is not at the center of mass. This wakes up the body.
        /// @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
        /// @param point the world position of the point of application.
        /// @param wake also wake up the body
        b2Body.prototype.ApplyLinearImpulse = function (impulse, point, wake) {
            if (wake === void 0) { wake = true; }
            if (this.m_type !== b2BodyType.b2_dynamicBody) {
                return;
            }
            if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
                this.SetAwake(true);
            }
            // Don't accumulate a force if the body is sleeping.
            if (this.m_flags & b2BodyFlag.e_awakeFlag) {
                this.m_linearVelocity.x += this.m_invMass * impulse.x;
                this.m_linearVelocity.y += this.m_invMass * impulse.y;
                this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
            }
        };
        /// Apply an angular impulse.
        /// @param impulse the angular impulse in units of kg*m*m/s
        /// @param wake also wake up the body
        b2Body.prototype.ApplyAngularImpulse = function (impulse, wake) {
            if (wake === void 0) { wake = true; }
            if (this.m_type !== b2BodyType.b2_dynamicBody) {
                return;
            }
            if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
                this.SetAwake(true);
            }
            // Don't accumulate a force if the body is sleeping.
            if (this.m_flags & b2BodyFlag.e_awakeFlag) {
                this.m_angularVelocity += this.m_invI * impulse;
            }
        };
        /// Get the total mass of the body.
        /// @return the mass, usually in kilograms (kg).
        b2Body.prototype.GetMass = function () {
            return this.m_mass;
        };
        /// Get the rotational inertia of the body about the local origin.
        /// @return the rotational inertia, usually in kg-m^2.
        b2Body.prototype.GetInertia = function () {
            return this.m_I + this.m_mass * box2d.b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
        };
        /// Get the mass data of the body.
        /// @return a struct containing the mass, inertia and center of the body.
        b2Body.prototype.GetMassData = function (data) {
            data.mass = this.m_mass;
            data.I = this.m_I + this.m_mass * box2d.b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
            data.center.Copy(this.m_sweep.localCenter);
            return data;
        };
        b2Body.prototype.SetMassData = function (massData) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_world.IsLocked() === false);
            }
            if (this.m_world.IsLocked() === true) {
                return;
            }
            if (this.m_type !== b2BodyType.b2_dynamicBody) {
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
            if (massData.I > 0 && (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === 0) {
                this.m_I = massData.I - this.m_mass * box2d.b2DotVV(massData.center, massData.center);
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(this.m_I > 0);
                }
                this.m_invI = 1 / this.m_I;
            }
            // Move center of mass.
            var oldCenter = b2Body.SetMassData_s_oldCenter.Copy(this.m_sweep.c);
            this.m_sweep.localCenter.Copy(massData.center);
            box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
            this.m_sweep.c0.Copy(this.m_sweep.c);
            // Update center of mass velocity.
            box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(this.m_sweep.c, oldCenter, box2d.b2Vec2.s_t0), this.m_linearVelocity);
        };
        b2Body.prototype.ResetMassData = function () {
            // Compute mass data from shapes. Each shape has its own density.
            this.m_mass = 0;
            this.m_invMass = 0;
            this.m_I = 0;
            this.m_invI = 0;
            this.m_sweep.localCenter.SetZero();
            // Static and kinematic bodies have zero mass.
            if (this.m_type === b2BodyType.b2_staticBody || this.m_type === b2BodyType.b2_kinematicBody) {
                this.m_sweep.c0.Copy(this.m_xf.p);
                this.m_sweep.c.Copy(this.m_xf.p);
                this.m_sweep.a0 = this.m_sweep.a;
                return;
            }
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_type === b2BodyType.b2_dynamicBody);
            }
            // Accumulate mass over all fixtures.
            var localCenter = b2Body.ResetMassData_s_localCenter.SetZero();
            for (var f = this.m_fixtureList; f; f = f.m_next) {
                if (f.m_density === 0) {
                    continue;
                }
                var massData = f.GetMassData(b2Body.ResetMassData_s_massData);
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
            if (this.m_I > 0 && (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === 0) {
                // Center the inertia about the center of mass.
                this.m_I -= this.m_mass * box2d.b2DotVV(localCenter, localCenter);
                if (box2d.ENABLE_ASSERTS) {
                    box2d.b2Assert(this.m_I > 0);
                }
                this.m_invI = 1 / this.m_I;
            }
            else {
                this.m_I = 0;
                this.m_invI = 0;
            }
            // Move center of mass.
            var oldCenter = b2Body.ResetMassData_s_oldCenter.Copy(this.m_sweep.c);
            this.m_sweep.localCenter.Copy(localCenter);
            box2d.b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
            this.m_sweep.c0.Copy(this.m_sweep.c);
            // Update center of mass velocity.
            box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(this.m_sweep.c, oldCenter, box2d.b2Vec2.s_t0), this.m_linearVelocity);
        };
        /// Get the world coordinates of a point given the local coordinates.
        /// @param localPoint a point on the body measured relative the the body's origin.
        /// @return the same point expressed in world coordinates.
        b2Body.prototype.GetWorldPoint = function (localPoint, out) {
            return box2d.b2MulXV(this.m_xf, localPoint, out);
        };
        /// Get the world coordinates of a vector given the local coordinates.
        /// @param localVector a vector fixed in the body.
        /// @return the same vector expressed in world coordinates.
        b2Body.prototype.GetWorldVector = function (localVector, out) {
            return box2d.b2MulRV(this.m_xf.q, localVector, out);
        };
        /// Gets a local point relative to the body's origin given a world point.
        /// @param a point in world coordinates.
        /// @return the corresponding local point relative to the body's origin.
        b2Body.prototype.GetLocalPoint = function (worldPoint, out) {
            return box2d.b2MulTXV(this.m_xf, worldPoint, out);
        };
        /// Gets a local vector given a world vector.
        /// @param a vector in world coordinates.
        /// @return the corresponding local vector.
        b2Body.prototype.GetLocalVector = function (worldVector, out) {
            return box2d.b2MulTRV(this.m_xf.q, worldVector, out);
        };
        /// Get the world linear velocity of a world point attached to this body.
        /// @param a point in world coordinates.
        /// @return the world velocity of a point.
        b2Body.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint, out) {
            return box2d.b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, box2d.b2SubVV(worldPoint, this.m_sweep.c, box2d.b2Vec2.s_t0), out);
        };
        /// Get the world velocity of a local point.
        /// @param a point in local coordinates.
        /// @return the world velocity of a point.
        b2Body.prototype.GetLinearVelocityFromLocalPoint = function (localPoint, out) {
            return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(localPoint, out), out);
        };
        /// Get the linear damping of the body.
        b2Body.prototype.GetLinearDamping = function () {
            return this.m_linearDamping;
        };
        /// Set the linear damping of the body.
        b2Body.prototype.SetLinearDamping = function (linearDamping) {
            this.m_linearDamping = linearDamping;
        };
        /// Get the angular damping of the body.
        b2Body.prototype.GetAngularDamping = function () {
            return this.m_angularDamping;
        };
        /// Set the angular damping of the body.
        b2Body.prototype.SetAngularDamping = function (angularDamping) {
            this.m_angularDamping = angularDamping;
        };
        /// Get the gravity scale of the body.
        b2Body.prototype.GetGravityScale = function () {
            return this.m_gravityScale;
        };
        /// Set the gravity scale of the body.
        b2Body.prototype.SetGravityScale = function (scale) {
            this.m_gravityScale = scale;
        };
        /// Set the type of this body. This may alter the mass and velocity.
        b2Body.prototype.SetType = function (type) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_world.IsLocked() === false);
            }
            if (this.m_world.IsLocked() === true) {
                return;
            }
            if (this.m_type === type) {
                return;
            }
            this.m_type = type;
            this.ResetMassData();
            if (this.m_type === b2BodyType.b2_staticBody) {
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
            var ce = this.m_contactList;
            while (ce) {
                var ce0 = ce;
                ce = ce.next;
                this.m_world.m_contactManager.Destroy(ce0.contact);
            }
            this.m_contactList = null;
            // Touch the proxies so that new contacts will be created (when appropriate)
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            for (var f = this.m_fixtureList; f; f = f.m_next) {
                var proxyCount = f.m_proxyCount;
                for (var i = 0; i < proxyCount; ++i) {
                    broadPhase.TouchProxy(f.m_proxies[i].proxy);
                }
            }
        };
        /// Get the type of this body.
        b2Body.prototype.GetType = function () {
            return this.m_type;
        };
        /// Should this body be treated like a bullet for continuous collision detection?
        b2Body.prototype.SetBullet = function (flag) {
            if (flag) {
                this.m_flags |= b2BodyFlag.e_bulletFlag;
            }
            else {
                this.m_flags &= ~b2BodyFlag.e_bulletFlag;
            }
        };
        /// Is this body treated like a bullet for continuous collision detection?
        b2Body.prototype.IsBullet = function () {
            return (this.m_flags & b2BodyFlag.e_bulletFlag) === b2BodyFlag.e_bulletFlag;
        };
        /// You can disable sleeping on this body. If you disable sleeping, the
        /// body will be woken.
        b2Body.prototype.SetSleepingAllowed = function (flag) {
            if (flag) {
                this.m_flags |= b2BodyFlag.e_autoSleepFlag;
            }
            else {
                this.m_flags &= ~b2BodyFlag.e_autoSleepFlag;
                this.SetAwake(true);
            }
        };
        /// Is this body allowed to sleep
        b2Body.prototype.IsSleepingAllowed = function () {
            return (this.m_flags & b2BodyFlag.e_autoSleepFlag) === b2BodyFlag.e_autoSleepFlag;
        };
        /// Set the sleep state of the body. A sleeping body has very
        /// low CPU cost.
        /// @param flag set to true to wake the body, false to put it to sleep.
        b2Body.prototype.SetAwake = function (flag) {
            if (flag) {
                if ((this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
                    this.m_flags |= b2BodyFlag.e_awakeFlag;
                    this.m_sleepTime = 0;
                }
            }
            else {
                this.m_flags &= ~b2BodyFlag.e_awakeFlag;
                this.m_sleepTime = 0;
                this.m_linearVelocity.SetZero();
                this.m_angularVelocity = 0;
                this.m_force.SetZero();
                this.m_torque = 0;
            }
        };
        /// Get the sleeping state of this body.
        /// @return true if the body is sleeping.
        b2Body.prototype.IsAwake = function () {
            return (this.m_flags & b2BodyFlag.e_awakeFlag) === b2BodyFlag.e_awakeFlag;
        };
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
        b2Body.prototype.SetActive = function (flag) {
            if (box2d.ENABLE_ASSERTS) {
                box2d.b2Assert(this.m_world.IsLocked() === false);
            }
            if (flag === this.IsActive()) {
                return;
            }
            if (flag) {
                this.m_flags |= b2BodyFlag.e_activeFlag;
                // Create all proxies.
                var broadPhase = this.m_world.m_contactManager.m_broadPhase;
                for (var f = this.m_fixtureList; f; f = f.m_next) {
                    f.CreateProxies(broadPhase, this.m_xf);
                }
            }
            else {
                this.m_flags &= ~b2BodyFlag.e_activeFlag;
                // Destroy all proxies.
                var broadPhase = this.m_world.m_contactManager.m_broadPhase;
                for (var f = this.m_fixtureList; f; f = f.m_next) {
                    f.DestroyProxies(broadPhase);
                }
                // Destroy the attached contacts.
                var ce = this.m_contactList;
                while (ce) {
                    var ce0 = ce;
                    ce = ce.next;
                    this.m_world.m_contactManager.Destroy(ce0.contact);
                }
                this.m_contactList = null;
            }
        };
        /// Get the active state of the body.
        b2Body.prototype.IsActive = function () {
            return (this.m_flags & b2BodyFlag.e_activeFlag) === b2BodyFlag.e_activeFlag;
        };
        /// Set this body to have fixed rotation. This causes the mass
        /// to be reset.
        b2Body.prototype.SetFixedRotation = function (flag) {
            var status = (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === b2BodyFlag.e_fixedRotationFlag;
            if (status === flag) {
                return;
            }
            if (flag) {
                this.m_flags |= b2BodyFlag.e_fixedRotationFlag;
            }
            else {
                this.m_flags &= ~b2BodyFlag.e_fixedRotationFlag;
            }
            this.m_angularVelocity = 0;
            this.ResetMassData();
        };
        /// Does this body have fixed rotation?
        b2Body.prototype.IsFixedRotation = function () {
            return (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === b2BodyFlag.e_fixedRotationFlag;
        };
        /// Get the list of all fixtures attached to this body.
        b2Body.prototype.GetFixtureList = function () {
            return this.m_fixtureList;
        };
        /// Get the list of all joints attached to this body.
        b2Body.prototype.GetJointList = function () {
            return this.m_jointList;
        };
        /// Get the list of all contacts attached to this body.
        /// @warning this list changes during the time step and you may
        /// miss some collisions if you don't use b2ContactListener.
        b2Body.prototype.GetContactList = function () {
            return this.m_contactList;
        };
        /// Get the next body in the world's body list.
        b2Body.prototype.GetNext = function () {
            return this.m_next;
        };
        /// Get the user data pointer that was provided in the body definition.
        b2Body.prototype.GetUserData = function () {
            return this.m_userData;
        };
        /// Set the user data. Use this to store your application specific data.
        b2Body.prototype.SetUserData = function (data) {
            this.m_userData = data;
        };
        /// Get the parent world of this body.
        b2Body.prototype.GetWorld = function () {
            return this.m_world;
        };
        /// Dump this body to a log file
        b2Body.prototype.Dump = function () {
            if (box2d.DEBUG) {
                var bodyIndex = this.m_islandIndex;
                box2d.b2Log("{\n");
                box2d.b2Log("  const bd: b2BodyDef = new b2BodyDef();\n");
                var type_str = "";
                switch (this.m_type) {
                    case b2BodyType.b2_staticBody:
                        type_str = "b2BodyType.b2_staticBody";
                        break;
                    case b2BodyType.b2_kinematicBody:
                        type_str = "b2BodyType.b2_kinematicBody";
                        break;
                    case b2BodyType.b2_dynamicBody:
                        type_str = "b2BodyType.b2_dynamicBody";
                        break;
                    default:
                        if (box2d.ENABLE_ASSERTS) {
                            box2d.b2Assert(false);
                        }
                        break;
                }
                box2d.b2Log("  bd.type = %s;\n", type_str);
                box2d.b2Log("  bd.position.SetXY(%.15f, %.15f);\n", this.m_xf.p.x, this.m_xf.p.y);
                box2d.b2Log("  bd.angle = %.15f;\n", this.m_sweep.a);
                box2d.b2Log("  bd.linearVelocity.SetXY(%.15f, %.15f);\n", this.m_linearVelocity.x, this.m_linearVelocity.y);
                box2d.b2Log("  bd.angularVelocity = %.15f;\n", this.m_angularVelocity);
                box2d.b2Log("  bd.linearDamping = %.15f;\n", this.m_linearDamping);
                box2d.b2Log("  bd.angularDamping = %.15f;\n", this.m_angularDamping);
                box2d.b2Log("  bd.allowSleep = %s;\n", (this.m_flags & b2BodyFlag.e_autoSleepFlag) ? ("true") : ("false"));
                box2d.b2Log("  bd.awake = %s;\n", (this.m_flags & b2BodyFlag.e_awakeFlag) ? ("true") : ("false"));
                box2d.b2Log("  bd.fixedRotation = %s;\n", (this.m_flags & b2BodyFlag.e_fixedRotationFlag) ? ("true") : ("false"));
                box2d.b2Log("  bd.bullet = %s;\n", (this.m_flags & b2BodyFlag.e_bulletFlag) ? ("true") : ("false"));
                box2d.b2Log("  bd.active = %s;\n", (this.m_flags & b2BodyFlag.e_activeFlag) ? ("true") : ("false"));
                box2d.b2Log("  bd.gravityScale = %.15f;\n", this.m_gravityScale);
                box2d.b2Log("\n");
                box2d.b2Log("  bodies[%d] = this.m_world.CreateBody(bd);\n", this.m_islandIndex);
                box2d.b2Log("\n");
                for (var f = this.m_fixtureList; f; f = f.m_next) {
                    box2d.b2Log("  {\n");
                    f.Dump(bodyIndex);
                    box2d.b2Log("  }\n");
                }
                box2d.b2Log("}\n");
            }
        };
        b2Body.prototype.SynchronizeFixtures = function () {
            var xf1 = b2Body.SynchronizeFixtures_s_xf1;
            xf1.q.SetAngleRadians(this.m_sweep.a0);
            box2d.b2MulRV(xf1.q, this.m_sweep.localCenter, xf1.p);
            box2d.b2SubVV(this.m_sweep.c0, xf1.p, xf1.p);
            var broadPhase = this.m_world.m_contactManager.m_broadPhase;
            for (var f = this.m_fixtureList; f; f = f.m_next) {
                f.Synchronize(broadPhase, xf1, this.m_xf);
            }
        };
        b2Body.prototype.SynchronizeTransform = function () {
            this.m_xf.q.SetAngleRadians(this.m_sweep.a);
            box2d.b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
            box2d.b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
        };
        // This is used to prevent connected bodies from colliding.
        // It may lie, depending on the collideConnected flag.
        b2Body.prototype.ShouldCollide = function (other) {
            // At least one body should be dynamic.
            if (this.m_type !== b2BodyType.b2_dynamicBody && other.m_type !== b2BodyType.b2_dynamicBody) {
                return false;
            }
            // Does a joint prevent collision?
            for (var jn = this.m_jointList; jn; jn = jn.next) {
                if (jn.other === other) {
                    if (jn.joint.m_collideConnected === false) {
                        return false;
                    }
                }
            }
            return true;
        };
        b2Body.prototype.Advance = function (alpha) {
            // Advance to the new safe time. This doesn't sync the broad-phase.
            this.m_sweep.Advance(alpha);
            this.m_sweep.c.Copy(this.m_sweep.c0);
            this.m_sweep.a = this.m_sweep.a0;
            this.m_xf.q.SetAngleRadians(this.m_sweep.a);
            box2d.b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
            box2d.b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
        };
        /// Creates a fixture from a shape and attach it to this body.
        /// This is a convenience function. Use b2FixtureDef if you need to set parameters
        /// like friction, restitution, user data, or filtering.
        /// If the density is non-zero, this function automatically updates the mass of the body.
        /// @param shape the shape to be cloned.
        /// @param density the shape density (set to zero for static bodies).
        /// @warning This function is locked during callbacks.
        b2Body.CreateFixture2_s_def = new box2d.b2FixtureDef();
        /// Set the mass properties to override the mass properties of the fixtures.
        /// Note that this changes the center of mass position.
        /// Note that creating or destroying fixtures can also alter the mass.
        /// This function has no effect if the body isn't dynamic.
        /// @param massData the mass properties.
        b2Body.SetMassData_s_oldCenter = new box2d.b2Vec2();
        /// This resets the mass properties to the sum of the mass properties of the fixtures.
        /// This normally does not need to be called unless you called SetMassData to override
        /// the mass and you later want to reset the mass.
        b2Body.ResetMassData_s_localCenter = new box2d.b2Vec2();
        b2Body.ResetMassData_s_oldCenter = new box2d.b2Vec2();
        b2Body.ResetMassData_s_massData = new box2d.b2MassData();
        b2Body.SynchronizeFixtures_s_xf1 = new box2d.b2Transform();
        return b2Body;
    }());
    box2d.b2Body = b2Body;
})(box2d || (box2d = {})); // namespace box2d
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
/// <reference path="../../Box2D/Box2D/Common/b2Settings.ts"/>
/// <reference path="../../Box2D/Box2D/Common/b2Draw.ts"/>
/// <reference path="../../Box2D/Box2D/Common/b2Timer.ts"/>
/// <reference path="../../Box2D/Box2D/Common/b2GrowableStack.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/Shapes/b2ChainShape.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/b2BroadPhase.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/b2Distance.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/b2DynamicTree.ts"/>
/// <reference path="../../Box2D/Box2D/Collision/b2TimeOfImpact.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/b2Fixture.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/b2WorldCallbacks.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/b2World.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2DistanceJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2FrictionJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2GearJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2MotorJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2MouseJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2PulleyJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2RopeJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2WeldJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2WheelJoint.ts"/>
/// <reference path="../../Box2D/Box2D/Dynamics/Joints/b2AreaJoint.ts"/>
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
/// <reference path="../../Box2D/Box2D/Box2D.ts"/>
var box2d;
(function (box2d) {
    var HelloWorld;
    (function (HelloWorld) {
        // This is a simple example of building and running a simulation
        // using Box2D. Here we create a large ground box and a small dynamic
        // box.
        // There are no graphics for this example. Box2D is meant to be used
        // with your rendering engine in your game engine.
        function main() {
            //  const pre = document.body.appendChild(document.createElement('pre'));
            // Define the gravity vector.
            var gravity = new box2d.b2Vec2(0, -10);
            // Construct a world object, which will hold and simulate the rigid bodies.
            var world = new box2d.b2World(gravity);
            // Define the ground body.
            var groundBodyDef = new box2d.b2BodyDef();
            groundBodyDef.position.SetXY(0, -10);
            // Call the body factory which allocates memory for the ground body
            // from a pool and creates the ground box shape (also from a pool).
            // The body is also added to the world.
            var groundBody = world.CreateBody(groundBodyDef);
            // Define the ground box shape.
            var groundBox = new box2d.b2PolygonShape();
            // The extents are the half-widths of the box.
            groundBox.SetAsBox(50, 10);
            // Add the ground fixture to the ground body.
            groundBody.CreateFixture2(groundBox, 0);
            // Define the dynamic body. We set its position and call the body factory.
            var bodyDef = new box2d.b2BodyDef();
            bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
            bodyDef.position.SetXY(0, 4);
            var body = world.CreateBody(bodyDef);
            // Define another box shape for our dynamic body.
            var dynamicBox = new box2d.b2PolygonShape();
            dynamicBox.SetAsBox(1, 1);
            // Define the dynamic body fixture.
            var fixtureDef = new box2d.b2FixtureDef();
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
            var timeStep = 1 / 60;
            var velocityIterations = 6;
            var positionIterations = 2;
            // This is our little game loop.
            for (var i = 0; i < 60; ++i) {
                // Instruct the world to perform a single step of simulation.
                // It is generally best to keep the time step and iterations fixed.
                world.Step(timeStep, velocityIterations, positionIterations);
                // Now print the position and angle of the body.
                var position = body.GetPosition();
                var angle = body.GetAngleRadians();
                console.log(position.x.toFixed(2), position.y.toFixed(2), angle.toFixed(2));
            }
            // When the world destructor is called, all bodies and joints are freed. This can
            // create orphaned pointers, so be careful about your world management.
            return 0;
        }
        HelloWorld.main = main;
    })(HelloWorld = box2d.HelloWorld || (box2d.HelloWorld = {}));
})(box2d || (box2d = {})); // namespace box2d
//# sourceMappingURL=box2d-helloworld.js.map