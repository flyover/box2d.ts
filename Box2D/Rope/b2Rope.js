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
System.register(["../Common/b2Settings.js", "../Common/b2Math.js", "../Common/b2Draw.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Draw_js_1, b2RopeDef, b2Rope;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_js_1_1) {
                b2Settings_js_1 = b2Settings_js_1_1;
            },
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            },
            function (b2Draw_js_1_1) {
                b2Draw_js_1 = b2Draw_js_1_1;
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
                    this.gravity = new b2Math_js_1.b2Vec2(0, 0);
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
                    this.m_gravity = new b2Math_js_1.b2Vec2();
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
                    this.m_ps = b2Math_js_1.b2Vec2.MakeArray(this.m_count);
                    // this.m_p0s = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
                    this.m_p0s = b2Math_js_1.b2Vec2.MakeArray(this.m_count);
                    // this.m_vs = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
                    this.m_vs = b2Math_js_1.b2Vec2.MakeArray(this.m_count);
                    // this.m_ims = (float32*)b2Alloc(this.m_count * sizeof(float32));
                    this.m_ims = b2Settings_js_1.b2MakeNumberArray(this.m_count);
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
                    this.m_Ls = b2Settings_js_1.b2MakeNumberArray(count2);
                    // this.m_as = (float32*)b2Alloc(count3 * sizeof(float32));
                    this.m_as = b2Settings_js_1.b2MakeNumberArray(count3);
                    for (let i = 0; i < count2; ++i) {
                        const p1 = this.m_ps[i];
                        const p2 = this.m_ps[i + 1];
                        this.m_Ls[i] = b2Math_js_1.b2Vec2.DistanceVV(p1, p2);
                    }
                    for (let i = 0; i < count3; ++i) {
                        const p1 = this.m_ps[i];
                        const p2 = this.m_ps[i + 1];
                        const p3 = this.m_ps[i + 2];
                        const d1 = b2Math_js_1.b2Vec2.SubVV(p2, p1, b2Math_js_1.b2Vec2.s_t0);
                        const d2 = b2Math_js_1.b2Vec2.SubVV(p3, p2, b2Math_js_1.b2Vec2.s_t1);
                        const a = b2Math_js_1.b2Vec2.CrossVV(d1, d2);
                        const b = b2Math_js_1.b2Vec2.DotVV(d1, d2);
                        this.m_as[i] = b2Math_js_1.b2Atan2(a, b);
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
                        b2Math_js_1.b2Vec2.MulSV(inv_h, b2Math_js_1.b2Vec2.SubVV(this.m_ps[i], this.m_p0s[i], b2Math_js_1.b2Vec2.s_t0), this.m_vs[i]);
                    }
                }
                SolveC2() {
                    const count2 = this.m_count - 1;
                    for (let i = 0; i < count2; ++i) {
                        const p1 = this.m_ps[i];
                        const p2 = this.m_ps[i + 1];
                        const d = b2Math_js_1.b2Vec2.SubVV(p2, p1, b2Rope.s_d);
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
                        const d1 = b2Math_js_1.b2Vec2.SubVV(p2, p1, b2Rope.s_d1);
                        const d2 = b2Math_js_1.b2Vec2.SubVV(p3, p2, b2Rope.s_d2);
                        const L1sqr = d1.LengthSquared();
                        const L2sqr = d2.LengthSquared();
                        if (L1sqr * L2sqr === 0) {
                            continue;
                        }
                        const a = b2Math_js_1.b2Vec2.CrossVV(d1, d2);
                        const b = b2Math_js_1.b2Vec2.DotVV(d1, d2);
                        let angle = b2Math_js_1.b2Atan2(a, b);
                        const Jd1 = b2Math_js_1.b2Vec2.MulSV((-1 / L1sqr), d1.SelfSkew(), b2Rope.s_Jd1);
                        const Jd2 = b2Math_js_1.b2Vec2.MulSV((1 / L2sqr), d2.SelfSkew(), b2Rope.s_Jd2);
                        const J1 = b2Math_js_1.b2Vec2.NegV(Jd1, b2Rope.s_J1);
                        const J2 = b2Math_js_1.b2Vec2.SubVV(Jd1, Jd2, b2Rope.s_J2);
                        const J3 = Jd2;
                        let mass = m1 * b2Math_js_1.b2Vec2.DotVV(J1, J1) + m2 * b2Math_js_1.b2Vec2.DotVV(J2, J2) + m3 * b2Math_js_1.b2Vec2.DotVV(J3, J3);
                        if (mass === 0) {
                            continue;
                        }
                        mass = 1 / mass;
                        let C = angle - this.m_as[i];
                        while (C > b2Settings_js_1.b2_pi) {
                            angle -= 2 * b2Settings_js_1.b2_pi;
                            C = angle - this.m_as[i];
                        }
                        while (C < -b2Settings_js_1.b2_pi) {
                            angle += 2 * b2Settings_js_1.b2_pi;
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
                    const c = new b2Draw_js_1.b2Color(0.4, 0.5, 0.7);
                    for (let i = 0; i < this.m_count - 1; ++i) {
                        draw.DrawSegment(this.m_ps[i], this.m_ps[i + 1], c);
                    }
                }
            };
            exports_1("b2Rope", b2Rope);
            ///
            b2Rope.s_d = new b2Math_js_1.b2Vec2();
            b2Rope.s_d1 = new b2Math_js_1.b2Vec2();
            b2Rope.s_d2 = new b2Math_js_1.b2Vec2();
            b2Rope.s_Jd1 = new b2Math_js_1.b2Vec2();
            b2Rope.s_Jd2 = new b2Math_js_1.b2Vec2();
            b2Rope.s_J1 = new b2Math_js_1.b2Vec2();
            b2Rope.s_J2 = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJSb3BlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJSb3BlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFPRixHQUFHO1lBQ0gsWUFBQSxNQUFhLFNBQVM7Z0JBQXRCO29CQUNFLEdBQUc7b0JBQ0ksYUFBUSxHQUFhLEVBQUUsQ0FBQztvQkFFL0IsR0FBRztvQkFDSSxVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUV6QixHQUFHO29CQUNJLFdBQU0sR0FBYSxFQUFFLENBQUM7b0JBRTdCLEdBQUc7b0JBQ2EsWUFBTyxHQUFXLElBQUksa0JBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRW5ELEdBQUc7b0JBQ0ksWUFBTyxHQUFXLEdBQUcsQ0FBQztvQkFFN0Isd0JBQXdCO29CQUNqQixPQUFFLEdBQVcsR0FBRyxDQUFDO29CQUV4Qix3RUFBd0U7b0JBQ2pFLE9BQUUsR0FBVyxHQUFHLENBQUM7Z0JBQzFCLENBQUM7YUFBQSxDQUFBOztZQUVELEdBQUc7WUFDSCxTQUFBLE1BQWEsTUFBTTtnQkFBbkI7b0JBQ1MsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFDcEIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFDcEIsVUFBSyxHQUFhLEVBQUUsQ0FBQztvQkFDckIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFFcEIsVUFBSyxHQUFhLEVBQUUsQ0FBQztvQkFFckIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFDcEIsU0FBSSxHQUFhLEVBQUUsQ0FBQztvQkFFWCxjQUFTLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzFDLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBRXRCLFNBQUksR0FBVyxDQUFDLENBQUM7b0JBQ2pCLFNBQUksR0FBVyxHQUFHLENBQUM7Z0JBcU41QixDQUFDO2dCQW5OUSxjQUFjO29CQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7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