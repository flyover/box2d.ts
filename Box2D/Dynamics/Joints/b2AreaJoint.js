System.register(["../../Common/b2Settings", "../../Common/b2Math", "./b2Joint", "./b2DistanceJoint"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Joint_1, b2DistanceJoint_1, b2AreaJointDef, b2AreaJoint;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Joint_1_1) {
                b2Joint_1 = b2Joint_1_1;
            },
            function (b2DistanceJoint_1_1) {
                b2DistanceJoint_1 = b2DistanceJoint_1_1;
            }
        ],
        execute: function () {
            b2AreaJointDef = class b2AreaJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(b2Joint_1.b2JointType.e_areaJoint);
                    this.bodies = [];
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
            exports_1("b2AreaJointDef", b2AreaJointDef);
            b2AreaJoint = class b2AreaJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    // Solver shared
                    this.m_impulse = 0;
                    this.m_targetArea = 0;
                    this.m_delta = new b2Math_1.b2Vec2();
                    // DEBUG: b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies.");
                    this.m_bodies = def.bodies;
                    this.m_frequencyHz = b2Settings_1.b2Maybe(def.frequencyHz, 0);
                    this.m_dampingRatio = b2Settings_1.b2Maybe(def.dampingRatio, 0);
                    this.m_targetLengths = b2Settings_1.b2MakeNumberArray(def.bodies.length);
                    this.m_normals = b2Math_1.b2Vec2.MakeArray(def.bodies.length);
                    this.m_joints = []; // b2MakeNullArray(def.bodies.length);
                    this.m_deltas = b2Math_1.b2Vec2.MakeArray(def.bodies.length);
                    const djd = new b2DistanceJoint_1.b2DistanceJointDef();
                    djd.frequencyHz = this.m_frequencyHz;
                    djd.dampingRatio = this.m_dampingRatio;
                    this.m_targetArea = 0;
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const body = this.m_bodies[i];
                        const next = this.m_bodies[(i + 1) % this.m_bodies.length];
                        const body_c = body.GetWorldCenter();
                        const next_c = next.GetWorldCenter();
                        this.m_targetLengths[i] = b2Math_1.b2Vec2.DistanceVV(body_c, next_c);
                        this.m_targetArea += b2Math_1.b2Vec2.CrossVV(body_c, next_c);
                        djd.Initialize(body, next, body_c, next_c);
                        this.m_joints[i] = body.GetWorld().CreateJoint(djd);
                    }
                    this.m_targetArea *= 0.5;
                }
                GetAnchorA(out) {
                    return out;
                }
                GetAnchorB(out) {
                    return out;
                }
                GetReactionForce(inv_dt, out) {
                    return out;
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                SetFrequency(hz) {
                    this.m_frequencyHz = hz;
                    for (let i = 0; i < this.m_joints.length; ++i) {
                        this.m_joints[i].SetFrequency(hz);
                    }
                }
                GetFrequency() {
                    return this.m_frequencyHz;
                }
                SetDampingRatio(ratio) {
                    this.m_dampingRatio = ratio;
                    for (let i = 0; i < this.m_joints.length; ++i) {
                        this.m_joints[i].SetDampingRatio(ratio);
                    }
                }
                GetDampingRatio() {
                    return this.m_dampingRatio;
                }
                Dump(log) {
                    log("Area joint dumping is not supported.\n");
                }
                InitVelocityConstraints(data) {
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const prev = this.m_bodies[(i + this.m_bodies.length - 1) % this.m_bodies.length];
                        const next = this.m_bodies[(i + 1) % this.m_bodies.length];
                        const prev_c = data.positions[prev.m_islandIndex].c;
                        const next_c = data.positions[next.m_islandIndex].c;
                        const delta = this.m_deltas[i];
                        b2Math_1.b2Vec2.SubVV(next_c, prev_c, delta);
                    }
                    if (data.step.warmStarting) {
                        this.m_impulse *= data.step.dtRatio;
                        for (let i = 0; i < this.m_bodies.length; ++i) {
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
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const body = this.m_bodies[i];
                        const body_v = data.velocities[body.m_islandIndex].v;
                        const delta = this.m_deltas[i];
                        dotMassSum += delta.LengthSquared() / body.GetMass();
                        crossMassSum += b2Math_1.b2Vec2.CrossVV(body_v, delta);
                    }
                    const lambda = -2 * crossMassSum / dotMassSum;
                    // lambda = b2Clamp(lambda, -b2_maxLinearCorrection, b2_maxLinearCorrection);
                    this.m_impulse += lambda;
                    for (let i = 0; i < this.m_bodies.length; ++i) {
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
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const body = this.m_bodies[i];
                        const next = this.m_bodies[(i + 1) % this.m_bodies.length];
                        const body_c = data.positions[body.m_islandIndex].c;
                        const next_c = data.positions[next.m_islandIndex].c;
                        const delta = b2Math_1.b2Vec2.SubVV(next_c, body_c, this.m_delta);
                        let dist = delta.Length();
                        if (dist < b2Settings_1.b2_epsilon) {
                            dist = 1;
                        }
                        this.m_normals[i].x = delta.y / dist;
                        this.m_normals[i].y = -delta.x / dist;
                        perimeter += dist;
                        area += b2Math_1.b2Vec2.CrossVV(body_c, next_c);
                    }
                    area *= 0.5;
                    const deltaArea = this.m_targetArea - area;
                    const toExtrude = 0.5 * deltaArea / perimeter;
                    let done = true;
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const body = this.m_bodies[i];
                        const body_c = data.positions[body.m_islandIndex].c;
                        const next_i = (i + 1) % this.m_bodies.length;
                        const delta = b2Math_1.b2Vec2.AddVV(this.m_normals[i], this.m_normals[next_i], this.m_delta);
                        delta.SelfMul(toExtrude);
                        const norm_sq = delta.LengthSquared();
                        if (norm_sq > b2Math_1.b2Sq(b2Settings_1.b2_maxLinearCorrection)) {
                            delta.SelfMul(b2Settings_1.b2_maxLinearCorrection / b2Math_1.b2Sqrt(norm_sq));
                        }
                        if (norm_sq > b2Math_1.b2Sq(b2Settings_1.b2_linearSlop)) {
                            done = false;
                        }
                        body_c.x += delta.x;
                        body_c.y += delta.y;
                    }
                    return done;
                }
            };
            exports_1("b2AreaJoint", b2AreaJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJBcmVhSm9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkFyZWFKb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWtCQSxpQkFBQSxNQUFhLGNBQWUsU0FBUSxvQkFBVTtnQkFPNUM7b0JBQ0UsS0FBSyxDQUFDLHFCQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBUDFCLFdBQU0sR0FBYSxFQUFFLENBQUM7b0JBRXRCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUV4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztnQkFJaEMsQ0FBQztnQkFFTSxPQUFPLENBQUMsSUFBWTtvQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXZCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztxQkFDbkI7eUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO3FCQUNuQjtnQkFDSCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxjQUFBLE1BQWEsV0FBWSxTQUFRLGlCQUFPO2dCQWdCdEMsWUFBWSxHQUFvQjtvQkFDOUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQWZOLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUMxQixtQkFBYyxHQUFXLENBQUMsQ0FBQztvQkFFbEMsZ0JBQWdCO29CQUNULGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBSXRCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUloQixZQUFPLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFLN0MsMkdBQTJHO29CQUUzRyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7b0JBQzNCLElB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