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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJSb3BlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvUm9wZS9iMlJvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQU9GLEdBQUc7WUFDSCxZQUFBO2dCQUFBO29CQUNFLEdBQUc7b0JBQ0ksYUFBUSxHQUFhLEVBQUUsQ0FBQztvQkFFL0IsR0FBRztvQkFDSSxVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUV6QixHQUFHO29CQUNJLFdBQU0sR0FBYSxFQUFFLENBQUM7b0JBRTdCLEdBQUc7b0JBQ2EsWUFBTyxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFbkQsR0FBRztvQkFDSSxZQUFPLEdBQVcsR0FBRyxDQUFDO29CQUU3Qix3QkFBd0I7b0JBQ2pCLE9BQUUsR0FBVyxHQUFHLENBQUM7b0JBRXhCLHdFQUF3RTtvQkFDakUsT0FBRSxHQUFXLEdBQUcsQ0FBQztnQkFDMUIsQ0FBQzthQUFBLENBQUE7O1lBRUQsR0FBRztZQUNILFNBQUE7Z0JBQUE7b0JBQ1MsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFDcEIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFDcEIsVUFBSyxHQUFhLEVBQUUsQ0FBQztvQkFDckIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFFcEIsVUFBSyxHQUFhLEVBQUUsQ0FBQztvQkFFckIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFDcEIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFFWCxjQUFTLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDMUMsY0FBUyxHQUFXLENBQUMsQ0FBQztvQkFFdEIsU0FBSSxHQUFXLENBQUMsQ0FBQztvQkFDakIsU0FBSSxHQUFXLEdBQUcsQ0FBQztnQkFxTjVCLENBQUM7Z0JBbk5RLGNBQWM7b0JBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFD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