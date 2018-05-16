"use strict";
/*
* Copyright (c) 2011 Erin Catto http://www.box2d.org
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
Object.defineProperty(exports, "__esModule", { value: true });
const b2Settings_1 = require("../Common/b2Settings");
const b2Math_1 = require("../Common/b2Math");
const b2Draw_1 = require("../Common/b2Draw");
///
class b2RopeDef {
    constructor() {
        ///
        this.vertices = [];
        ///
        this.count = 0;
        ///
        this.masses = [];
        ///
        this.gravity = new b2Math_1.b2Vec2(0, 0);
        ///
        this.damping = 0.1;
        /// Stretching stiffness
        this.k2 = 0.9;
        /// Bending stiffness. Values above 0.5 can make the simulation blow up.
        this.k3 = 0.1;
    }
}
exports.b2RopeDef = b2RopeDef;
///
class b2Rope {
    constructor() {
        this.m_count = 0;
        this.m_ps = null;
        this.m_p0s = null;
        this.m_vs = null;
        this.m_ims = null;
        this.m_Ls = null;
        this.m_as = null;
        this.m_gravity = new b2Math_1.b2Vec2();
        this.m_damping = 0;
        this.m_k2 = 1;
        this.m_k3 = 0.1;
    }
    GetVertexCount() {
        return this.m_count;
    }
    GetVertices() {
        return this.m_ps;
    }
    ///
    Initialize(def) {
        ///b2Assert(def.count >= 3);
        this.m_count = def.count;
        // this.m_ps = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
        this.m_ps = b2Math_1.b2Vec2.MakeArray(this.m_count);
        // this.m_p0s = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
        this.m_p0s = b2Math_1.b2Vec2.MakeArray(this.m_count);
        // this.m_vs = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
        this.m_vs = b2Math_1.b2Vec2.MakeArray(this.m_count);
        // this.m_ims = (float32*)b2Alloc(this.m_count * sizeof(float32));
        this.m_ims = b2Settings_1.b2MakeNumberArray(this.m_count);
        for (let i = 0; i < this.m_count; ++i) {
            this.m_ps[i].Copy(def.vertices[i]);
            this.m_p0s[i].Copy(def.vertices[i]);
            this.m_vs[i].SetZero();
            const m = def.masses[i];
            if (m > 0) {
                this.m_ims[i] = 1 / m;
            }
            else {
                this.m_ims[i] = 0;
            }
        }
        const count2 = this.m_count - 1;
        const count3 = this.m_count - 2;
        // this.m_Ls = (float32*)be2Alloc(count2 * sizeof(float32));
        this.m_Ls = b2Settings_1.b2MakeNumberArray(count2);
        // this.m_as = (float32*)b2Alloc(count3 * sizeof(float32));
        this.m_as = b2Settings_1.b2MakeNumberArray(count3);
        for (let i = 0; i < count2; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            this.m_Ls[i] = b2Math_1.b2Vec2.DistanceVV(p1, p2);
        }
        for (let i = 0; i < count3; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            const p3 = this.m_ps[i + 2];
            const d1 = b2Math_1.b2Vec2.SubVV(p2, p1, b2Math_1.b2Vec2.s_t0);
            const d2 = b2Math_1.b2Vec2.SubVV(p3, p2, b2Math_1.b2Vec2.s_t1);
            const a = b2Math_1.b2Vec2.CrossVV(d1, d2);
            const b = b2Math_1.b2Vec2.DotVV(d1, d2);
            this.m_as[i] = b2Math_1.b2Atan2(a, b);
        }
        this.m_gravity.Copy(def.gravity);
        this.m_damping = def.damping;
        this.m_k2 = def.k2;
        this.m_k3 = def.k3;
    }
    ///
    Step(h, iterations) {
        if (h === 0) {
            return;
        }
        const d = Math.exp(-h * this.m_damping);
        for (let i = 0; i < this.m_count; ++i) {
            this.m_p0s[i].Copy(this.m_ps[i]);
            if (this.m_ims[i] > 0) {
                this.m_vs[i].SelfMulAdd(h, this.m_gravity);
            }
            this.m_vs[i].SelfMul(d);
            this.m_ps[i].SelfMulAdd(h, this.m_vs[i]);
        }
        for (let i = 0; i < iterations; ++i) {
            this.SolveC2();
            this.SolveC3();
            this.SolveC2();
        }
        const inv_h = 1 / h;
        for (let i = 0; i < this.m_count; ++i) {
            b2Math_1.b2Vec2.MulSV(inv_h, b2Math_1.b2Vec2.SubVV(this.m_ps[i], this.m_p0s[i], b2Math_1.b2Vec2.s_t0), this.m_vs[i]);
        }
    }
    SolveC2() {
        const count2 = this.m_count - 1;
        for (let i = 0; i < count2; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            const d = b2Math_1.b2Vec2.SubVV(p2, p1, b2Rope.s_d);
            const L = d.Normalize();
            const im1 = this.m_ims[i];
            const im2 = this.m_ims[i + 1];
            if (im1 + im2 === 0) {
                continue;
            }
            const s1 = im1 / (im1 + im2);
            const s2 = im2 / (im1 + im2);
            p1.SelfMulSub(this.m_k2 * s1 * (this.m_Ls[i] - L), d);
            p2.SelfMulAdd(this.m_k2 * s2 * (this.m_Ls[i] - L), d);
            // this.m_ps[i] = p1;
            // this.m_ps[i + 1] = p2;
        }
    }
    SetAngle(angle) {
        const count3 = this.m_count - 2;
        for (let i = 0; i < count3; ++i) {
            this.m_as[i] = angle;
        }
    }
    SolveC3() {
        const count3 = this.m_count - 2;
        for (let i = 0; i < count3; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            const p3 = this.m_ps[i + 2];
            const m1 = this.m_ims[i];
            const m2 = this.m_ims[i + 1];
            const m3 = this.m_ims[i + 2];
            const d1 = b2Math_1.b2Vec2.SubVV(p2, p1, b2Rope.s_d1);
            const d2 = b2Math_1.b2Vec2.SubVV(p3, p2, b2Rope.s_d2);
            const L1sqr = d1.LengthSquared();
            const L2sqr = d2.LengthSquared();
            if (L1sqr * L2sqr === 0) {
                continue;
            }
            const a = b2Math_1.b2Vec2.CrossVV(d1, d2);
            const b = b2Math_1.b2Vec2.DotVV(d1, d2);
            let angle = b2Math_1.b2Atan2(a, b);
            const Jd1 = b2Math_1.b2Vec2.MulSV((-1 / L1sqr), d1.SelfSkew(), b2Rope.s_Jd1);
            const Jd2 = b2Math_1.b2Vec2.MulSV((1 / L2sqr), d2.SelfSkew(), b2Rope.s_Jd2);
            const J1 = b2Math_1.b2Vec2.NegV(Jd1, b2Rope.s_J1);
            const J2 = b2Math_1.b2Vec2.SubVV(Jd1, Jd2, b2Rope.s_J2);
            const J3 = Jd2;
            let mass = m1 * b2Math_1.b2Vec2.DotVV(J1, J1) + m2 * b2Math_1.b2Vec2.DotVV(J2, J2) + m3 * b2Math_1.b2Vec2.DotVV(J3, J3);
            if (mass === 0) {
                continue;
            }
            mass = 1 / mass;
            let C = angle - this.m_as[i];
            while (C > b2Settings_1.b2_pi) {
                angle -= 2 * b2Settings_1.b2_pi;
                C = angle - this.m_as[i];
            }
            while (C < -b2Settings_1.b2_pi) {
                angle += 2 * b2Settings_1.b2_pi;
                C = angle - this.m_as[i];
            }
            const impulse = -this.m_k3 * mass * C;
            p1.SelfMulAdd((m1 * impulse), J1);
            p2.SelfMulAdd((m2 * impulse), J2);
            p3.SelfMulAdd((m3 * impulse), J3);
            // this.m_ps[i] = p1;
            // this.m_ps[i + 1] = p2;
            // this.m_ps[i + 2] = p3;
        }
    }
    Draw(draw) {
        const c = new b2Draw_1.b2Color(0.4, 0.5, 0.7);
        for (let i = 0; i < this.m_count - 1; ++i) {
            draw.DrawSegment(this.m_ps[i], this.m_ps[i + 1], c);
        }
    }
}
///
b2Rope.s_d = new b2Math_1.b2Vec2();
b2Rope.s_d1 = new b2Math_1.b2Vec2();
b2Rope.s_d2 = new b2Math_1.b2Vec2();
b2Rope.s_Jd1 = new b2Math_1.b2Vec2();
b2Rope.s_Jd2 = new b2Math_1.b2Vec2();
b2Rope.s_J1 = new b2Math_1.b2Vec2();
b2Rope.s_J2 = new b2Math_1.b2Vec2();
exports.b2Rope = b2Rope;
//# sourceMappingURL=b2Rope.js.map