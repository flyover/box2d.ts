// MIT License
System.register(["../common/b2_math.js", "../common/b2_draw.js", "../common/b2_settings.js"], function (exports_1, context_1) {
    "use strict";
    var b2_math_js_1, b2_draw_js_1, b2_settings_js_1, b2StretchingModel, b2BendingModel, b2RopeTuning, b2RopeDef, b2RopeStretch, b2RopeBend, b2Rope;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_draw_js_1_1) {
                b2_draw_js_1 = b2_draw_js_1_1;
            },
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            }
        ],
        execute: function () {
            (function (b2StretchingModel) {
                b2StretchingModel[b2StretchingModel["b2_pbdStretchingModel"] = 0] = "b2_pbdStretchingModel";
                b2StretchingModel[b2StretchingModel["b2_xpbdStretchingModel"] = 1] = "b2_xpbdStretchingModel";
            })(b2StretchingModel || (b2StretchingModel = {}));
            exports_1("b2StretchingModel", b2StretchingModel);
            (function (b2BendingModel) {
                b2BendingModel[b2BendingModel["b2_springAngleBendingModel"] = 0] = "b2_springAngleBendingModel";
                b2BendingModel[b2BendingModel["b2_pbdAngleBendingModel"] = 1] = "b2_pbdAngleBendingModel";
                b2BendingModel[b2BendingModel["b2_xpbdAngleBendingModel"] = 2] = "b2_xpbdAngleBendingModel";
                b2BendingModel[b2BendingModel["b2_pbdDistanceBendingModel"] = 3] = "b2_pbdDistanceBendingModel";
                b2BendingModel[b2BendingModel["b2_pbdHeightBendingModel"] = 4] = "b2_pbdHeightBendingModel";
            })(b2BendingModel || (b2BendingModel = {}));
            exports_1("b2BendingModel", b2BendingModel);
            ///
            b2RopeTuning = class b2RopeTuning {
                constructor() {
                    this.stretchingModel = b2StretchingModel.b2_pbdStretchingModel;
                    this.bendingModel = b2BendingModel.b2_pbdAngleBendingModel;
                    this.damping = 0.0;
                    this.stretchStiffness = 1.0;
                    this.stretchHertz = 0.0;
                    this.stretchDamping = 0.0;
                    this.bendStiffness = 0.5;
                    this.bendHertz = 1.0;
                    this.bendDamping = 0.0;
                    this.isometric = false;
                    this.fixedEffectiveMass = false;
                    this.warmStart = false;
                }
                Copy(other) {
                    this.stretchingModel = other.stretchingModel;
                    this.bendingModel = other.bendingModel;
                    this.damping = other.damping;
                    this.stretchStiffness = other.stretchStiffness;
                    this.stretchHertz = other.stretchHertz;
                    this.stretchDamping = other.stretchDamping;
                    this.bendStiffness = other.bendStiffness;
                    this.bendHertz = other.bendHertz;
                    this.bendDamping = other.bendDamping;
                    this.isometric = other.isometric;
                    this.fixedEffectiveMass = other.fixedEffectiveMass;
                    this.warmStart = other.warmStart;
                    return this;
                }
            };
            exports_1("b2RopeTuning", b2RopeTuning);
            ///
            b2RopeDef = class b2RopeDef {
                constructor() {
                    this.position = new b2_math_js_1.b2Vec2();
                    // b2Vec2* vertices;
                    this.vertices = [];
                    // int32 count;
                    this.count = 0;
                    // float* masses;
                    this.masses = [];
                    // b2Vec2 gravity;
                    this.gravity = new b2_math_js_1.b2Vec2();
                    // b2RopeTuning tuning;
                    this.tuning = new b2RopeTuning();
                }
            };
            exports_1("b2RopeDef", b2RopeDef);
            b2RopeStretch = class b2RopeStretch {
                constructor() {
                    this.i1 = 0;
                    this.i2 = 0;
                    this.invMass1 = 0.0;
                    this.invMass2 = 0.0;
                    this.L = 0.0;
                    this.lambda = 0.0;
                    this.spring = 0.0;
                    this.damper = 0.0;
                }
            };
            b2RopeBend = class b2RopeBend {
                constructor() {
                    this.i1 = 0;
                    this.i2 = 0;
                    this.i3 = 0;
                    this.invMass1 = 0.0;
                    this.invMass2 = 0.0;
                    this.invMass3 = 0.0;
                    this.invEffectiveMass = 0.0;
                    this.lambda = 0.0;
                    this.L1 = 0.0;
                    this.L2 = 0.0;
                    this.alpha1 = 0.0;
                    this.alpha2 = 0.0;
                    this.spring = 0.0;
                    this.damper = 0.0;
                }
            };
            ///
            b2Rope = class b2Rope {
                constructor() {
                    this.m_position = new b2_math_js_1.b2Vec2();
                    this.m_count = 0;
                    this.m_stretchCount = 0;
                    this.m_bendCount = 0;
                    // b2RopeStretch* m_stretchConstraints;
                    this.m_stretchConstraints = [];
                    // b2RopeBend* m_bendConstraints;
                    this.m_bendConstraints = [];
                    // b2Vec2* m_bindPositions;
                    this.m_bindPositions = [];
                    // b2Vec2* m_ps;
                    this.m_ps = [];
                    // b2Vec2* m_p0s;
                    this.m_p0s = [];
                    // b2Vec2* m_vs;
                    this.m_vs = [];
                    // float* m_invMasses;
                    this.m_invMasses = [];
                    // b2Vec2 m_gravity;
                    this.m_gravity = new b2_math_js_1.b2Vec2();
                    this.m_tuning = new b2RopeTuning();
                }
                Create(def) {
                    // b2Assert(def.count >= 3);
                    this.m_position.Copy(def.position);
                    this.m_count = def.count;
                    function make_array(array, count, make) {
                        for (let index = 0; index < count; ++index) {
                            array[index] = make(index);
                        }
                    }
                    // this.m_bindPositions = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
                    make_array(this.m_bindPositions, this.m_count, () => new b2_math_js_1.b2Vec2());
                    // this.m_ps = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
                    make_array(this.m_ps, this.m_count, () => new b2_math_js_1.b2Vec2());
                    // this.m_p0s = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
                    make_array(this.m_p0s, this.m_count, () => new b2_math_js_1.b2Vec2());
                    // this.m_vs = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
                    make_array(this.m_vs, this.m_count, () => new b2_math_js_1.b2Vec2());
                    // this.m_invMasses = (float*)b2Alloc(this.m_count * sizeof(float));
                    make_array(this.m_invMasses, this.m_count, () => 0.0);
                    for (let i = 0; i < this.m_count; ++i) {
                        this.m_bindPositions[i].Copy(def.vertices[i]);
                        // this.m_ps[i] = def.vertices[i] + this.m_position;
                        this.m_ps[i].Copy(def.vertices[i]).SelfAdd(this.m_position);
                        // this.m_p0s[i] = def.vertices[i] + this.m_position;
                        this.m_p0s[i].Copy(def.vertices[i]).SelfAdd(this.m_position);
                        this.m_vs[i].SetZero();
                        const m = def.masses[i];
                        if (m > 0.0) {
                            this.m_invMasses[i] = 1.0 / m;
                        }
                        else {
                            this.m_invMasses[i] = 0.0;
                        }
                    }
                    this.m_stretchCount = this.m_count - 1;
                    this.m_bendCount = this.m_count - 2;
                    // this.m_stretchConstraints = (b2RopeStretch*)b2Alloc(this.m_stretchCount * sizeof(b2RopeStretch));
                    make_array(this.m_stretchConstraints, this.m_stretchCount, () => new b2RopeStretch());
                    // this.m_bendConstraints = (b2RopeBend*)b2Alloc(this.m_bendCount * sizeof(b2RopeBend));
                    make_array(this.m_bendConstraints, this.m_bendCount, () => new b2RopeBend());
                    for (let i = 0; i < this.m_stretchCount; ++i) {
                        const c = this.m_stretchConstraints[i];
                        const p1 = this.m_ps[i];
                        const p2 = this.m_ps[i + 1];
                        c.i1 = i;
                        c.i2 = i + 1;
                        c.L = b2_math_js_1.b2Vec2.DistanceVV(p1, p2);
                        c.invMass1 = this.m_invMasses[i];
                        c.invMass2 = this.m_invMasses[i + 1];
                        c.lambda = 0.0;
                        c.damper = 0.0;
                        c.spring = 0.0;
                    }
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        const c = this.m_bendConstraints[i];
                        const p1 = this.m_ps[i];
                        const p2 = this.m_ps[i + 1];
                        const p3 = this.m_ps[i + 2];
                        c.i1 = i;
                        c.i2 = i + 1;
                        c.i3 = i + 2;
                        c.invMass1 = this.m_invMasses[i];
                        c.invMass2 = this.m_invMasses[i + 1];
                        c.invMass3 = this.m_invMasses[i + 2];
                        c.invEffectiveMass = 0.0;
                        c.L1 = b2_math_js_1.b2Vec2.DistanceVV(p1, p2);
                        c.L2 = b2_math_js_1.b2Vec2.DistanceVV(p2, p3);
                        c.lambda = 0.0;
                        // Pre-compute effective mass (TODO use flattened config)
                        const e1 = b2_math_js_1.b2Vec2.SubVV(p2, p1, new b2_math_js_1.b2Vec2());
                        const e2 = b2_math_js_1.b2Vec2.SubVV(p3, p2, new b2_math_js_1.b2Vec2());
                        const L1sqr = e1.LengthSquared();
                        const L2sqr = e2.LengthSquared();
                        if (L1sqr * L2sqr === 0.0) {
                            continue;
                        }
                        // b2Vec2 Jd1 = (-1.0 / L1sqr) * e1.Skew();
                        const Jd1 = new b2_math_js_1.b2Vec2().Copy(e1).SelfSkew().SelfMul(-1.0 / L1sqr);
                        // b2Vec2 Jd2 = (1.0 / L2sqr) * e2.Skew();
                        const Jd2 = new b2_math_js_1.b2Vec2().Copy(e2).SelfSkew().SelfMul(1.0 / L2sqr);
                        // b2Vec2 J1 = -Jd1;
                        const J1 = Jd1.Clone().SelfNeg();
                        // b2Vec2 J2 = Jd1 - Jd2;
                        const J2 = Jd1.Clone().SelfSub(Jd2);
                        // b2Vec2 J3 = Jd2;
                        const J3 = Jd2.Clone();
                        c.invEffectiveMass = c.invMass1 * b2_math_js_1.b2Vec2.DotVV(J1, J1) + c.invMass2 * b2_math_js_1.b2Vec2.DotVV(J2, J2) + c.invMass3 * b2_math_js_1.b2Vec2.DotVV(J3, J3);
                        // b2Vec2 r = p3 - p1;
                        const r = b2_math_js_1.b2Vec2.SubVV(p3, p1, new b2_math_js_1.b2Vec2());
                        const rr = r.LengthSquared();
                        if (rr === 0.0) {
                            continue;
                        }
                        // a1 = h2 / (h1 + h2)
                        // a2 = h1 / (h1 + h2)
                        c.alpha1 = b2_math_js_1.b2Vec2.DotVV(e2, r) / rr;
                        c.alpha2 = b2_math_js_1.b2Vec2.DotVV(e1, r) / rr;
                    }
                    this.m_gravity.Copy(def.gravity);
                    this.SetTuning(def.tuning);
                }
                SetTuning(tuning) {
                    this.m_tuning.Copy(tuning);
                    // Pre-compute spring and damper values based on tuning
                    const bendOmega = 2.0 * b2_settings_js_1.b2_pi * this.m_tuning.bendHertz;
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        const c = this.m_bendConstraints[i];
                        const L1sqr = c.L1 * c.L1;
                        const L2sqr = c.L2 * c.L2;
                        if (L1sqr * L2sqr === 0.0) {
                            c.spring = 0.0;
                            c.damper = 0.0;
                            continue;
                        }
                        // Flatten the triangle formed by the two edges
                        const J2 = 1.0 / c.L1 + 1.0 / c.L2;
                        const sum = c.invMass1 / L1sqr + c.invMass2 * J2 * J2 + c.invMass3 / L2sqr;
                        if (sum === 0.0) {
                            c.spring = 0.0;
                            c.damper = 0.0;
                            continue;
                        }
                        const mass = 1.0 / sum;
                        c.spring = mass * bendOmega * bendOmega;
                        c.damper = 2.0 * mass * this.m_tuning.bendDamping * bendOmega;
                    }
                    const stretchOmega = 2.0 * b2_settings_js_1.b2_pi * this.m_tuning.stretchHertz;
                    for (let i = 0; i < this.m_stretchCount; ++i) {
                        const c = this.m_stretchConstraints[i];
                        const sum = c.invMass1 + c.invMass2;
                        if (sum === 0.0) {
                            continue;
                        }
                        const mass = 1.0 / sum;
                        c.spring = mass * stretchOmega * stretchOmega;
                        c.damper = 2.0 * mass * this.m_tuning.stretchDamping * stretchOmega;
                    }
                }
                Step(dt, iterations, position) {
                    if (dt === 0.0) {
                        return;
                    }
                    const inv_dt = 1.0 / dt;
                    const d = Math.exp(-dt * this.m_tuning.damping);
                    // Apply gravity and damping
                    for (let i = 0; i < this.m_count; ++i) {
                        if (this.m_invMasses[i] > 0.0) {
                            // this.m_vs[i] *= d;
                            this.m_vs[i].x *= d;
                            this.m_vs[i].y *= d;
                            // this.m_vs[i] += dt * this.m_gravity;
                            this.m_vs[i].x += dt * this.m_gravity.x;
                            this.m_vs[i].y += dt * this.m_gravity.y;
                        }
                        else {
                            // this.m_vs[i] = inv_dt * (this.m_bindPositions[i] + position - this.m_p0s[i]);
                            this.m_vs[i].x = inv_dt * (this.m_bindPositions[i].x + position.x - this.m_p0s[i].x);
                            this.m_vs[i].y = inv_dt * (this.m_bindPositions[i].y + position.y - this.m_p0s[i].y);
                        }
                    }
                    // Apply bending spring
                    if (this.m_tuning.bendingModel === b2BendingModel.b2_springAngleBendingModel) {
                        this.ApplyBendForces(dt);
                    }
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        this.m_bendConstraints[i].lambda = 0.0;
                    }
                    for (let i = 0; i < this.m_stretchCount; ++i) {
                        this.m_stretchConstraints[i].lambda = 0.0;
                    }
                    // Update position
                    for (let i = 0; i < this.m_count; ++i) {
                        // this.m_ps[i] += dt * this.m_vs[i];
                        this.m_ps[i].x += dt * this.m_vs[i].x;
                        this.m_ps[i].y += dt * this.m_vs[i].y;
                    }
                    // Solve constraints
                    for (let i = 0; i < iterations; ++i) {
                        if (this.m_tuning.bendingModel === b2BendingModel.b2_pbdAngleBendingModel) {
                            this.SolveBend_PBD_Angle();
                        }
                        else if (this.m_tuning.bendingModel === b2BendingModel.b2_xpbdAngleBendingModel) {
                            this.SolveBend_XPBD_Angle(dt);
                        }
                        else if (this.m_tuning.bendingModel === b2BendingModel.b2_pbdDistanceBendingModel) {
                            this.SolveBend_PBD_Distance();
                        }
                        else if (this.m_tuning.bendingModel === b2BendingModel.b2_pbdHeightBendingModel) {
                            this.SolveBend_PBD_Height();
                        }
                        if (this.m_tuning.stretchingModel === b2StretchingModel.b2_pbdStretchingModel) {
                            this.SolveStretch_PBD();
                        }
                        else if (this.m_tuning.stretchingModel === b2StretchingModel.b2_xpbdStretchingModel) {
                            this.SolveStretch_XPBD(dt);
                        }
                    }
                    // Constrain velocity
                    for (let i = 0; i < this.m_count; ++i) {
                        // this.m_vs[i] = inv_dt * (this.m_ps[i] - this.m_p0s[i]);
                        this.m_vs[i].x = inv_dt * (this.m_ps[i].x - this.m_p0s[i].x);
                        this.m_vs[i].y = inv_dt * (this.m_ps[i].y - this.m_p0s[i].y);
                        this.m_p0s[i].Copy(this.m_ps[i]);
                    }
                }
                Reset(position) {
                    this.m_position.Copy(position);
                    for (let i = 0; i < this.m_count; ++i) {
                        // this.m_ps[i] = this.m_bindPositions[i] + this.m_position;
                        this.m_ps[i].x = this.m_bindPositions[i].x + this.m_position.x;
                        this.m_ps[i].y = this.m_bindPositions[i].y + this.m_position.y;
                        // this.m_p0s[i] = this.m_bindPositions[i] + this.m_position;
                        this.m_p0s[i].x = this.m_bindPositions[i].x + this.m_position.x;
                        this.m_p0s[i].y = this.m_bindPositions[i].y + this.m_position.y;
                        this.m_vs[i].SetZero();
                    }
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        this.m_bendConstraints[i].lambda = 0.0;
                    }
                    for (let i = 0; i < this.m_stretchCount; ++i) {
                        this.m_stretchConstraints[i].lambda = 0.0;
                    }
                }
                Draw(draw) {
                    const c = new b2_draw_js_1.b2Color(0.4, 0.5, 0.7);
                    const pg = new b2_draw_js_1.b2Color(0.1, 0.8, 0.1);
                    const pd = new b2_draw_js_1.b2Color(0.7, 0.2, 0.4);
                    for (let i = 0; i < this.m_count - 1; ++i) {
                        draw.DrawSegment(this.m_ps[i], this.m_ps[i + 1], c);
                        const pc = this.m_invMasses[i] > 0.0 ? pd : pg;
                        draw.DrawPoint(this.m_ps[i], 5.0, pc);
                    }
                    const pc = this.m_invMasses[this.m_count - 1] > 0.0 ? pd : pg;
                    draw.DrawPoint(this.m_ps[this.m_count - 1], 5.0, pc);
                }
                SolveStretch_PBD() {
                    const stiffness = this.m_tuning.stretchStiffness;
                    for (let i = 0; i < this.m_stretchCount; ++i) {
                        const c = this.m_stretchConstraints[i];
                        const p1 = this.m_ps[c.i1].Clone();
                        const p2 = this.m_ps[c.i2].Clone();
                        // b2Vec2 d = p2 - p1;
                        const d = p2.Clone().SelfSub(p1);
                        const L = d.Normalize();
                        const sum = c.invMass1 + c.invMass2;
                        if (sum === 0.0) {
                            continue;
                        }
                        const s1 = c.invMass1 / sum;
                        const s2 = c.invMass2 / sum;
                        // p1 -= stiffness * s1 * (c.L - L) * d;
                        p1.x -= stiffness * s1 * (c.L - L) * d.x;
                        p1.y -= stiffness * s1 * (c.L - L) * d.y;
                        // p2 += stiffness * s2 * (c.L - L) * d;
                        p2.x += stiffness * s2 * (c.L - L) * d.x;
                        p2.y += stiffness * s2 * (c.L - L) * d.y;
                        this.m_ps[c.i1].Copy(p1);
                        this.m_ps[c.i2].Copy(p2);
                    }
                }
                SolveStretch_XPBD(dt) {
                    // 	b2Assert(dt > 0.0);
                    for (let i = 0; i < this.m_stretchCount; ++i) {
                        const c = this.m_stretchConstraints[i];
                        const p1 = this.m_ps[c.i1].Clone();
                        const p2 = this.m_ps[c.i2].Clone();
                        const dp1 = p1.Clone().SelfSub(this.m_p0s[c.i1]);
                        const dp2 = p2.Clone().SelfSub(this.m_p0s[c.i2]);
                        // b2Vec2 u = p2 - p1;
                        const u = p2.Clone().SelfSub(p1);
                        const L = u.Normalize();
                        // b2Vec2 J1 = -u;
                        const J1 = u.Clone().SelfNeg();
                        // b2Vec2 J2 = u;
                        const J2 = u;
                        const sum = c.invMass1 + c.invMass2;
                        if (sum === 0.0) {
                            continue;
                        }
                        const alpha = 1.0 / (c.spring * dt * dt); // 1 / kg
                        const beta = dt * dt * c.damper; // kg * s
                        const sigma = alpha * beta / dt; // non-dimensional
                        const C = L - c.L;
                        // This is using the initial velocities
                        const Cdot = b2_math_js_1.b2Vec2.DotVV(J1, dp1) + b2_math_js_1.b2Vec2.DotVV(J2, dp2);
                        const B = C + alpha * c.lambda + sigma * Cdot;
                        const sum2 = (1.0 + sigma) * sum + alpha;
                        const impulse = -B / sum2;
                        // p1 += (c.invMass1 * impulse) * J1;
                        p1.x += (c.invMass1 * impulse) * J1.x;
                        p1.y += (c.invMass1 * impulse) * J1.y;
                        // p2 += (c.invMass2 * impulse) * J2;
                        p2.x += (c.invMass2 * impulse) * J2.x;
                        p2.y += (c.invMass2 * impulse) * J2.y;
                        this.m_ps[c.i1].Copy(p1);
                        this.m_ps[c.i2].Copy(p2);
                        c.lambda += impulse;
                    }
                }
                SolveBend_PBD_Angle() {
                    const stiffness = this.m_tuning.bendStiffness;
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        const c = this.m_bendConstraints[i];
                        const p1 = this.m_ps[c.i1];
                        const p2 = this.m_ps[c.i2];
                        const p3 = this.m_ps[c.i3];
                        // b2Vec2 d1 = p2 - p1;
                        const d1 = p2.Clone().SelfSub(p1);
                        // b2Vec2 d2 = p3 - p2;
                        const d2 = p3.Clone().SelfSub(p2);
                        const a = b2_math_js_1.b2Vec2.CrossVV(d1, d2);
                        const b = b2_math_js_1.b2Vec2.DotVV(d1, d2);
                        const angle = b2_math_js_1.b2Atan2(a, b);
                        let L1sqr = 0.0, L2sqr = 0.0;
                        if (this.m_tuning.isometric) {
                            L1sqr = c.L1 * c.L1;
                            L2sqr = c.L2 * c.L2;
                        }
                        else {
                            L1sqr = d1.LengthSquared();
                            L2sqr = d2.LengthSquared();
                        }
                        if (L1sqr * L2sqr === 0.0) {
                            continue;
                        }
                        // b2Vec2 Jd1 = (-1.0 / L1sqr) * d1.Skew();
                        const Jd1 = new b2_math_js_1.b2Vec2().Copy(d1).SelfSkew().SelfMul(-1.0 / L1sqr);
                        // b2Vec2 Jd2 = (1.0 / L2sqr) * d2.Skew();
                        const Jd2 = new b2_math_js_1.b2Vec2().Copy(d2).SelfSkew().SelfMul(1.0 / L2sqr);
                        // b2Vec2 J1 = -Jd1;
                        const J1 = Jd1.Clone().SelfNeg();
                        // b2Vec2 J2 = Jd1 - Jd2;
                        const J2 = Jd1.Clone().SelfSub(Jd2);
                        // b2Vec2 J3 = Jd2;
                        const J3 = Jd2;
                        let sum = 0.0;
                        if (this.m_tuning.fixedEffectiveMass) {
                            sum = c.invEffectiveMass;
                        }
                        else {
                            sum = c.invMass1 * b2_math_js_1.b2Vec2.DotVV(J1, J1) + c.invMass2 * b2_math_js_1.b2Vec2.DotVV(J2, J2) + c.invMass3 * b2_math_js_1.b2Vec2.DotVV(J3, J3);
                        }
                        if (sum === 0.0) {
                            sum = c.invEffectiveMass;
                        }
                        const impulse = -stiffness * angle / sum;
                        // p1 += (c.invMass1 * impulse) * J1;
                        p1.x += (c.invMass1 * impulse) * J1.x;
                        p1.y += (c.invMass1 * impulse) * J1.y;
                        // p2 += (c.invMass2 * impulse) * J2;
                        p2.x += (c.invMass2 * impulse) * J2.x;
                        p2.y += (c.invMass2 * impulse) * J2.y;
                        // p3 += (c.invMass3 * impulse) * J3;
                        p3.x += (c.invMass3 * impulse) * J3.x;
                        p3.y += (c.invMass3 * impulse) * J3.y;
                        this.m_ps[c.i1].Copy(p1);
                        this.m_ps[c.i2].Copy(p2);
                        this.m_ps[c.i3].Copy(p3);
                    }
                }
                SolveBend_XPBD_Angle(dt) {
                    // b2Assert(dt > 0.0);
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        const c = this.m_bendConstraints[i];
                        const p1 = this.m_ps[c.i1];
                        const p2 = this.m_ps[c.i2];
                        const p3 = this.m_ps[c.i3];
                        const dp1 = p1.Clone().SelfSub(this.m_p0s[c.i1]);
                        const dp2 = p2.Clone().SelfSub(this.m_p0s[c.i2]);
                        const dp3 = p3.Clone().SelfSub(this.m_p0s[c.i3]);
                        // b2Vec2 d1 = p2 - p1;
                        const d1 = p2.Clone().SelfSub(p1);
                        // b2Vec2 d2 = p3 - p2;
                        const d2 = p3.Clone().SelfSub(p2);
                        let L1sqr, L2sqr;
                        if (this.m_tuning.isometric) {
                            L1sqr = c.L1 * c.L1;
                            L2sqr = c.L2 * c.L2;
                        }
                        else {
                            L1sqr = d1.LengthSquared();
                            L2sqr = d2.LengthSquared();
                        }
                        if (L1sqr * L2sqr === 0.0) {
                            continue;
                        }
                        const a = b2_math_js_1.b2Vec2.CrossVV(d1, d2);
                        const b = b2_math_js_1.b2Vec2.DotVV(d1, d2);
                        const angle = b2_math_js_1.b2Atan2(a, b);
                        // b2Vec2 Jd1 = (-1.0 / L1sqr) * d1.Skew();
                        // b2Vec2 Jd2 = (1.0 / L2sqr) * d2.Skew();
                        // b2Vec2 J1 = -Jd1;
                        // b2Vec2 J2 = Jd1 - Jd2;
                        // b2Vec2 J3 = Jd2;
                        // b2Vec2 Jd1 = (-1.0 / L1sqr) * d1.Skew();
                        const Jd1 = new b2_math_js_1.b2Vec2().Copy(d1).SelfSkew().SelfMul(-1.0 / L1sqr);
                        // b2Vec2 Jd2 = (1.0 / L2sqr) * d2.Skew();
                        const Jd2 = new b2_math_js_1.b2Vec2().Copy(d2).SelfSkew().SelfMul(1.0 / L2sqr);
                        // b2Vec2 J1 = -Jd1;
                        const J1 = Jd1.Clone().SelfNeg();
                        // b2Vec2 J2 = Jd1 - Jd2;
                        const J2 = Jd1.Clone().SelfSub(Jd2);
                        // b2Vec2 J3 = Jd2;
                        const J3 = Jd2;
                        let sum;
                        if (this.m_tuning.fixedEffectiveMass) {
                            sum = c.invEffectiveMass;
                        }
                        else {
                            sum = c.invMass1 * b2_math_js_1.b2Vec2.DotVV(J1, J1) + c.invMass2 * b2_math_js_1.b2Vec2.DotVV(J2, J2) + c.invMass3 * b2_math_js_1.b2Vec2.DotVV(J3, J3);
                        }
                        if (sum === 0.0) {
                            continue;
                        }
                        const alpha = 1.0 / (c.spring * dt * dt);
                        const beta = dt * dt * c.damper;
                        const sigma = alpha * beta / dt;
                        const C = angle;
                        // This is using the initial velocities
                        const Cdot = b2_math_js_1.b2Vec2.DotVV(J1, dp1) + b2_math_js_1.b2Vec2.DotVV(J2, dp2) + b2_math_js_1.b2Vec2.DotVV(J3, dp3);
                        const B = C + alpha * c.lambda + sigma * Cdot;
                        const sum2 = (1.0 + sigma) * sum + alpha;
                        const impulse = -B / sum2;
                        // p1 += (c.invMass1 * impulse) * J1;
                        p1.x += (c.invMass1 * impulse) * J1.x;
                        p1.y += (c.invMass1 * impulse) * J1.y;
                        // p2 += (c.invMass2 * impulse) * J2;
                        p2.x += (c.invMass2 * impulse) * J2.x;
                        p2.y += (c.invMass2 * impulse) * J2.y;
                        // p3 += (c.invMass3 * impulse) * J3;
                        p3.x += (c.invMass3 * impulse) * J3.x;
                        p3.y += (c.invMass3 * impulse) * J3.y;
                        this.m_ps[c.i1].Copy(p1);
                        this.m_ps[c.i2].Copy(p2);
                        this.m_ps[c.i3].Copy(p3);
                        c.lambda += impulse;
                    }
                }
                SolveBend_PBD_Distance() {
                    const stiffness = this.m_tuning.bendStiffness;
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        const c = this.m_bendConstraints[i];
                        const i1 = c.i1;
                        const i2 = c.i3;
                        const p1 = this.m_ps[i1].Clone();
                        const p2 = this.m_ps[i2].Clone();
                        // b2Vec2 d = p2 - p1;
                        const d = p2.Clone().SelfSub(p1);
                        const L = d.Normalize();
                        const sum = c.invMass1 + c.invMass3;
                        if (sum === 0.0) {
                            continue;
                        }
                        const s1 = c.invMass1 / sum;
                        const s2 = c.invMass3 / sum;
                        // p1 -= stiffness * s1 * (c.L1 + c.L2 - L) * d;
                        p1.x -= stiffness * s1 * (c.L1 + c.L2 - L) * d.x;
                        p1.y -= stiffness * s1 * (c.L1 + c.L2 - L) * d.y;
                        // p2 += stiffness * s2 * (c.L1 + c.L2 - L) * d;
                        p2.x += stiffness * s2 * (c.L1 + c.L2 - L) * d.x;
                        p2.y += stiffness * s2 * (c.L1 + c.L2 - L) * d.y;
                        this.m_ps[i1].Copy(p1);
                        this.m_ps[i2].Copy(p2);
                    }
                }
                SolveBend_PBD_Height() {
                    const stiffness = this.m_tuning.bendStiffness;
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        const c = this.m_bendConstraints[i];
                        const p1 = this.m_ps[c.i1].Clone();
                        const p2 = this.m_ps[c.i2].Clone();
                        const p3 = this.m_ps[c.i3].Clone();
                        // Barycentric coordinates are held constant
                        const d = new b2_math_js_1.b2Vec2();
                        // b2Vec2 d = c.alpha1 * p1 + c.alpha2 * p3 - p2;
                        d.x = c.alpha1 * p1.x + c.alpha2 * p3.x - p2.x;
                        d.y = c.alpha1 * p1.y + c.alpha2 * p3.y - p2.y;
                        const dLen = d.Length();
                        if (dLen === 0.0) {
                            continue;
                        }
                        // b2Vec2 dHat = (1.0 / dLen) * d;
                        const dHat = d.Clone().SelfMul(1.0 / dLen);
                        // b2Vec2 J1 = c.alpha1 * dHat;
                        const J1 = dHat.Clone().SelfMul(c.alpha1);
                        // b2Vec2 J2 = -dHat;
                        const J2 = dHat.Clone().SelfNeg();
                        // b2Vec2 J3 = c.alpha2 * dHat;
                        const J3 = dHat.Clone().SelfMul(c.alpha2);
                        const sum = c.invMass1 * c.alpha1 * c.alpha1 + c.invMass2 + c.invMass3 * c.alpha2 * c.alpha2;
                        if (sum === 0.0) {
                            continue;
                        }
                        const C = dLen;
                        const mass = 1.0 / sum;
                        const impulse = -stiffness * mass * C;
                        // p1 += (c.invMass1 * impulse) * J1;
                        p1.x += (c.invMass1 * impulse) * J1.x;
                        p1.y += (c.invMass1 * impulse) * J1.y;
                        // p2 += (c.invMass2 * impulse) * J2;
                        p2.x += (c.invMass2 * impulse) * J2.x;
                        p2.y += (c.invMass2 * impulse) * J2.y;
                        // p3 += (c.invMass3 * impulse) * J3;
                        p3.x += (c.invMass3 * impulse) * J3.x;
                        p3.y += (c.invMass3 * impulse) * J3.y;
                        this.m_ps[c.i1].Copy(p1);
                        this.m_ps[c.i2].Copy(p2);
                        this.m_ps[c.i3].Copy(p3);
                    }
                }
                ApplyBendForces(dt) {
                    // omega = 2 * pi * hz
                    const omega = 2.0 * b2_settings_js_1.b2_pi * this.m_tuning.bendHertz;
                    for (let i = 0; i < this.m_bendCount; ++i) {
                        const c = this.m_bendConstraints[i];
                        const p1 = this.m_ps[c.i1].Clone();
                        const p2 = this.m_ps[c.i2].Clone();
                        const p3 = this.m_ps[c.i3].Clone();
                        const v1 = this.m_vs[c.i1];
                        const v2 = this.m_vs[c.i2];
                        const v3 = this.m_vs[c.i3];
                        // b2Vec2 d1 = p2 - p1;
                        const d1 = p1.Clone().SelfSub(p1);
                        // b2Vec2 d2 = p3 - p2;
                        const d2 = p3.Clone().SelfSub(p2);
                        let L1sqr, L2sqr;
                        if (this.m_tuning.isometric) {
                            L1sqr = c.L1 * c.L1;
                            L2sqr = c.L2 * c.L2;
                        }
                        else {
                            L1sqr = d1.LengthSquared();
                            L2sqr = d2.LengthSquared();
                        }
                        if (L1sqr * L2sqr === 0.0) {
                            continue;
                        }
                        const a = b2_math_js_1.b2Vec2.CrossVV(d1, d2);
                        const b = b2_math_js_1.b2Vec2.DotVV(d1, d2);
                        const angle = b2_math_js_1.b2Atan2(a, b);
                        // b2Vec2 Jd1 = (-1.0 / L1sqr) * d1.Skew();
                        // b2Vec2 Jd2 = (1.0 / L2sqr) * d2.Skew();
                        // b2Vec2 J1 = -Jd1;
                        // b2Vec2 J2 = Jd1 - Jd2;
                        // b2Vec2 J3 = Jd2;
                        // b2Vec2 Jd1 = (-1.0 / L1sqr) * d1.Skew();
                        const Jd1 = new b2_math_js_1.b2Vec2().Copy(d1).SelfSkew().SelfMul(-1.0 / L1sqr);
                        // b2Vec2 Jd2 = (1.0 / L2sqr) * d2.Skew();
                        const Jd2 = new b2_math_js_1.b2Vec2().Copy(d2).SelfSkew().SelfMul(1.0 / L2sqr);
                        // b2Vec2 J1 = -Jd1;
                        const J1 = Jd1.Clone().SelfNeg();
                        // b2Vec2 J2 = Jd1 - Jd2;
                        const J2 = Jd1.Clone().SelfSub(Jd2);
                        // b2Vec2 J3 = Jd2;
                        const J3 = Jd2;
                        let sum = 0.0;
                        if (this.m_tuning.fixedEffectiveMass) {
                            sum = c.invEffectiveMass;
                        }
                        else {
                            sum = c.invMass1 * b2_math_js_1.b2Vec2.DotVV(J1, J1) + c.invMass2 * b2_math_js_1.b2Vec2.DotVV(J2, J2) + c.invMass3 * b2_math_js_1.b2Vec2.DotVV(J3, J3);
                        }
                        if (sum === 0.0) {
                            continue;
                        }
                        const mass = 1.0 / sum;
                        const spring = mass * omega * omega;
                        const damper = 2.0 * mass * this.m_tuning.bendDamping * omega;
                        const C = angle;
                        const Cdot = b2_math_js_1.b2Vec2.DotVV(J1, v1) + b2_math_js_1.b2Vec2.DotVV(J2, v2) + b2_math_js_1.b2Vec2.DotVV(J3, v3);
                        const impulse = -dt * (spring * C + damper * Cdot);
                        // this.m_vs[c.i1] += (c.invMass1 * impulse) * J1;
                        this.m_vs[c.i1].x += (c.invMass1 * impulse) * J1.x;
                        this.m_vs[c.i1].y += (c.invMass1 * impulse) * J1.y;
                        // this.m_vs[c.i2] += (c.invMass2 * impulse) * J2;
                        this.m_vs[c.i2].x += (c.invMass2 * impulse) * J2.x;
                        this.m_vs[c.i2].y += (c.invMass2 * impulse) * J2.y;
                        // this.m_vs[c.i3] += (c.invMass3 * impulse) * J3;
                        this.m_vs[c.i3].x += (c.invMass3 * impulse) * J3.x;
                        this.m_vs[c.i3].y += (c.invMass3 * impulse) * J3.y;
                    }
                }
            };
            exports_1("b2Rope", b2Rope);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfcm9wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyX3JvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBMEJkLFdBQVksaUJBQWlCO2dCQUMzQiwyRkFBcUIsQ0FBQTtnQkFDckIsNkZBQXNCLENBQUE7WUFDeEIsQ0FBQyxFQUhXLGlCQUFpQixLQUFqQixpQkFBaUIsUUFHNUI7O1lBRUQsV0FBWSxjQUFjO2dCQUN4QiwrRkFBOEIsQ0FBQTtnQkFDOUIseUZBQXVCLENBQUE7Z0JBQ3ZCLDJGQUF3QixDQUFBO2dCQUN4QiwrRkFBMEIsQ0FBQTtnQkFDMUIsMkZBQXdCLENBQUE7WUFDMUIsQ0FBQyxFQU5XLGNBQWMsS0FBZCxjQUFjLFFBTXpCOztZQUVELEdBQUc7WUFDSCxlQUFBLE1BQWEsWUFBWTtnQkFBekI7b0JBQ1Msb0JBQWUsR0FBc0IsaUJBQWlCLENBQUMscUJBQXFCLENBQUM7b0JBQzdFLGlCQUFZLEdBQW1CLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDdEUsWUFBTyxHQUFXLEdBQUcsQ0FBQztvQkFDdEIscUJBQWdCLEdBQVcsR0FBRyxDQUFDO29CQUMvQixpQkFBWSxHQUFXLEdBQUcsQ0FBQztvQkFDM0IsbUJBQWMsR0FBVyxHQUFHLENBQUM7b0JBQzdCLGtCQUFhLEdBQVcsR0FBRyxDQUFDO29CQUM1QixjQUFTLEdBQVcsR0FBRyxDQUFDO29CQUN4QixnQkFBVyxHQUFXLEdBQUcsQ0FBQztvQkFDMUIsY0FBUyxHQUFZLEtBQUssQ0FBQztvQkFDM0IsdUJBQWtCLEdBQVksS0FBSyxDQUFDO29CQUNwQyxjQUFTLEdBQVksS0FBSyxDQUFDO2dCQWlCcEMsQ0FBQztnQkFmUSxJQUFJLENBQUMsS0FBNkI7b0JBQ3ZDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztvQkFDN0MsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO29C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