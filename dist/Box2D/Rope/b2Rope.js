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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2Draw"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Draw_1, b2RopeDef, b2Rope;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Draw_1_1) {
                b2Draw_1 = b2Draw_1_1;
            }
        ],
        execute: function () {
            ///
            b2RopeDef = class b2RopeDef {
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
            };
            exports_1("b2RopeDef", b2RopeDef);
            ///
            b2Rope = class b2Rope {
                constructor() {
                    this.m_count = 0;
                    this.m_ps = [];
                    this.m_p0s = [];
                    this.m_vs = [];
                    this.m_ims = [];
                    this.m_Ls = [];
                    this.m_as = [];
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
                    // DEBUG: b2Assert(def.count >= 3);
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
            };
            ///
            b2Rope.s_d = new b2Math_1.b2Vec2();
            b2Rope.s_d1 = new b2Math_1.b2Vec2();
            b2Rope.s_d2 = new b2Math_1.b2Vec2();
            b2Rope.s_Jd1 = new b2Math_1.b2Vec2();
            b2Rope.s_Jd2 = new b2Math_1.b2Vec2();
            b2Rope.s_J1 = new b2Math_1.b2Vec2();
            b2Rope.s_J2 = new b2Math_1.b2Vec2();
            exports_1("b2Rope", b2Rope);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJSb3BlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvUm9wZS9iMlJvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQU9GLEdBQUc7WUFDSCxZQUFBLE1BQWEsU0FBUztnQkFBdEI7b0JBQ0UsR0FBRztvQkFDSSxhQUFRLEdBQWEsRUFBRSxDQUFDO29CQUUvQixHQUFHO29CQUNJLFVBQUssR0FBVyxDQUFDLENBQUM7b0JBRXpCLEdBQUc7b0JBQ0ksV0FBTSxHQUFhLEVBQUUsQ0FBQztvQkFFN0IsR0FBRztvQkFDYSxZQUFPLEdBQVcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUVuRCxHQUFHO29CQUNJLFlBQU8sR0FBVyxHQUFHLENBQUM7b0JBRTdCLHdCQUF3QjtvQkFDakIsT0FBRSxHQUFXLEdBQUcsQ0FBQztvQkFFeEIsd0VBQXdFO29CQUNqRSxPQUFFLEdBQVcsR0FBRyxDQUFDO2dCQUMxQixDQUFDO2FBQUEsQ0FBQTs7WUFFRCxHQUFHO1lBQ0gsU0FBQSxNQUFhLE1BQU07Z0JBQW5CO29CQUNTLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFNBQUksR0FBYSxFQUFFLENBQUM7b0JBQ3BCLFVBQUssR0FBYSxFQUFFLENBQUM7b0JBQ3JCLFNBQUksR0FBYSxFQUFFLENBQUM7b0JBRXBCLFVBQUssR0FBYSxFQUFFLENBQUM7b0JBRXJCLFNBQUksR0FBYSxFQUFFLENBQUM7b0JBQ3BCLFNBQUksR0FBYSxFQUFFLENBQUM7b0JBRVgsY0FBUyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzFDLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBRXRCLFNBQUksR0FBVyxDQUFDLENBQUM7b0JBQ2pCLFNBQUksR0FBVyxHQUFHLENBQUM7Z0JBcU41QixDQUFDO2dCQW5OUSxjQUFjO29CQUNuQixPQUFPLElB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