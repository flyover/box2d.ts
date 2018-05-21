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
System.register(["./b2Settings"], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    function b2Abs(n) {
        return (n < 0) ? (-n) : (n);
    }
    exports_1("b2Abs", b2Abs);
    function b2Min(a, b) {
        return (a < b) ? (a) : (b);
    }
    exports_1("b2Min", b2Min);
    function b2Max(a, b) {
        return (a > b) ? (a) : (b);
    }
    exports_1("b2Max", b2Max);
    function b2Clamp(a, lo, hi) {
        return (a < lo) ? (lo) : ((a > hi) ? (hi) : (a));
    }
    exports_1("b2Clamp", b2Clamp);
    function b2Swap(a, b) {
        ///b2Assert(false);
        const tmp = a[0];
        a[0] = b[0];
        b[0] = tmp;
    }
    exports_1("b2Swap", b2Swap);
    /// This function is used to ensure that a floating point number is
    /// not a NaN or infinity.
    function b2IsValid(n) {
        return isFinite(n);
    }
    exports_1("b2IsValid", b2IsValid);
    function b2Sq(n) {
        return n * n;
    }
    exports_1("b2Sq", b2Sq);
    /// This is a approximate yet fast inverse square-root.
    function b2InvSqrt(n) {
        return 1 / Math.sqrt(n);
    }
    exports_1("b2InvSqrt", b2InvSqrt);
    function b2Sqrt(n) {
        return Math.sqrt(n);
    }
    exports_1("b2Sqrt", b2Sqrt);
    function b2Pow(x, y) {
        return Math.pow(x, y);
    }
    exports_1("b2Pow", b2Pow);
    function b2DegToRad(degrees) {
        return degrees * b2_pi_over_180;
    }
    exports_1("b2DegToRad", b2DegToRad);
    function b2RadToDeg(radians) {
        return radians * b2_180_over_pi;
    }
    exports_1("b2RadToDeg", b2RadToDeg);
    function b2Cos(radians) {
        return Math.cos(radians);
    }
    exports_1("b2Cos", b2Cos);
    function b2Sin(radians) {
        return Math.sin(radians);
    }
    exports_1("b2Sin", b2Sin);
    function b2Acos(n) {
        return Math.acos(n);
    }
    exports_1("b2Acos", b2Acos);
    function b2Asin(n) {
        return Math.asin(n);
    }
    exports_1("b2Asin", b2Asin);
    function b2Atan2(y, x) {
        return Math.atan2(y, x);
    }
    exports_1("b2Atan2", b2Atan2);
    function b2NextPowerOfTwo(x) {
        x |= (x >> 1) & 0x7FFFFFFF;
        x |= (x >> 2) & 0x3FFFFFFF;
        x |= (x >> 4) & 0x0FFFFFFF;
        x |= (x >> 8) & 0x00FFFFFF;
        x |= (x >> 16) & 0x0000FFFF;
        return x + 1;
    }
    exports_1("b2NextPowerOfTwo", b2NextPowerOfTwo);
    function b2IsPowerOfTwo(x) {
        return x > 0 && (x & (x - 1)) === 0;
    }
    exports_1("b2IsPowerOfTwo", b2IsPowerOfTwo);
    function b2Random() {
        return Math.random() * 2 - 1;
    }
    exports_1("b2Random", b2Random);
    function b2RandomRange(lo, hi) {
        return (hi - lo) * Math.random() + lo;
    }
    exports_1("b2RandomRange", b2RandomRange);
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
    function b2MulVS(v, s, out) { out.x = v.x * s; out.y = v.y * s; return out; }
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
    var b2Settings_1, b2_pi_over_180, b2_180_over_pi, b2_two_pi, b2Vec2, b2Vec2_zero, b2Vec3, b2Mat22, b2Mat33, b2Rot, b2Transform, b2Sweep;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            }
        ],
        execute: function () {/*
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
            exports_1("b2_pi_over_180", b2_pi_over_180 = b2Settings_1.b2_pi / 180);
            exports_1("b2_180_over_pi", b2_180_over_pi = 180 / b2Settings_1.b2_pi);
            exports_1("b2_two_pi", b2_two_pi = 2 * b2Settings_1.b2_pi);
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
                Set(x, y) {
                    this.x = x;
                    this.y = y;
                    return this;
                }
                Copy(other) {
                    ///b2Assert(this !== other);
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
                Length() {
                    const x = this.x, y = this.y;
                    return Math.sqrt(x * x + y * y);
                }
                LengthSquared() {
                    const x = this.x, y = this.y;
                    return (x * x + y * y);
                }
                Normalize() {
                    const length = this.Length();
                    if (length >= b2Settings_1.b2_epsilon) {
                        const inv_length = 1 / length;
                        this.x *= inv_length;
                        this.y *= inv_length;
                    }
                    return length;
                }
                SelfNormalize() {
                    const length = this.Length();
                    if (length >= b2Settings_1.b2_epsilon) {
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
                    return b2Settings_1.b2MakeArray(length, function (i) { return new b2Vec2(); });
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
                static MulVS(v, s, out) { return b2MulVS(v, s, out); }
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
            exports_1("b2Vec2", b2Vec2);
            exports_1("b2Vec2_zero", b2Vec2_zero = new b2Vec2(0, 0));
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
                    ///b2Assert(this !== other);
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
            exports_1("b2Vec3", b2Vec3);
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
                static FromAngle(radians) {
                    return new b2Mat22().SetAngle(radians);
                }
                SetSSSS(r1c1, r1c2, r2c1, r2c2) {
                    this.ex.Set(r1c1, r2c1);
                    this.ey.Set(r1c2, r2c2);
                    return this;
                }
                SetVV(c1, c2) {
                    this.ex.Copy(c1);
                    this.ey.Copy(c2);
                    return this;
                }
                SetAngle(radians) {
                    const c = Math.cos(radians);
                    const s = Math.sin(radians);
                    this.ex.Set(c, s);
                    this.ey.Set(-s, c);
                    return this;
                }
                Copy(other) {
                    ///b2Assert(this !== other);
                    this.ex.Copy(other.ex);
                    this.ey.Copy(other.ey);
                    return this;
                }
                SetIdentity() {
                    this.ex.Set(1, 0);
                    this.ey.Set(0, 1);
                    return this;
                }
                SetZero() {
                    this.ex.SetZero();
                    this.ey.SetZero();
                    return this;
                }
                GetAngle() {
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
            exports_1("b2Mat22", b2Mat22);
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
                    ///b2Assert(this !== other);
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
            exports_1("b2Mat33", b2Mat33);
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
                SetAngle(angle) {
                    this.s = Math.sin(angle);
                    this.c = Math.cos(angle);
                    return this;
                }
                SetIdentity() {
                    this.s = 0;
                    this.c = 1;
                    return this;
                }
                GetAngle() {
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
            exports_1("b2Rot", b2Rot);
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
                    ///b2Assert(this !== other);
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
                SetPositionAngle(pos, a) {
                    this.p.Copy(pos);
                    this.q.SetAngle(a);
                    return this;
                }
                SetPosition(position) {
                    this.p.Copy(position);
                    return this;
                }
                SetPositionXY(x, y) {
                    this.p.Set(x, y);
                    return this;
                }
                SetRotation(rotation) {
                    this.q.Copy(rotation);
                    return this;
                }
                SetRotationAngle(radians) {
                    this.q.SetAngle(radians);
                    return this;
                }
                GetPosition() {
                    return this.p;
                }
                GetRotation() {
                    return this.q;
                }
                GetRotationAngle() {
                    return this.q.GetAngle();
                }
                GetAngle() {
                    return this.q.GetAngle();
                }
                static MulXV(T, v, out) { return b2MulXV(T, v, out); }
                static MulTXV(T, v, out) { return b2MulTXV(T, v, out); }
                static MulXX(A, B, out) { return b2MulXX(A, B, out); }
                static MulTXX(A, B, out) { return b2MulTXX(A, B, out); }
            };
            b2Transform.IDENTITY = new b2Transform();
            exports_1("b2Transform", b2Transform);
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
                    ///b2Assert(this !== other);
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
                    xf.q.SetAngle(angle);
                    xf.p.SelfSub(b2MulRV(xf.q, this.localCenter, b2Vec2.s_t0));
                    return xf;
                }
                Advance(alpha) {
                    ///b2Assert(this.alpha0 < 1);
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
            exports_1("b2Sweep", b2Sweep);
        }
    };
});
