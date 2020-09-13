System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_joint.js", "./b2_distance_joint.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_joint_js_1, b2_distance_joint_js_1, b2AreaJointDef, b2AreaJoint;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_joint_js_1_1) {
                b2_joint_js_1 = b2_joint_js_1_1;
            },
            function (b2_distance_joint_js_1_1) {
                b2_distance_joint_js_1 = b2_distance_joint_js_1_1;
            }
        ],
        execute: function () {
            b2AreaJointDef = class b2AreaJointDef extends b2_joint_js_1.b2JointDef {
                constructor() {
                    super(b2_joint_js_1.b2JointType.e_areaJoint);
                    this.bodies = [];
                    this.stiffness = 0;
                    this.damping = 0;
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
            b2AreaJoint = class b2AreaJoint extends b2_joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_stiffness = 0;
                    this.m_damping = 0;
                    // Solver shared
                    this.m_impulse = 0;
                    this.m_targetArea = 0;
                    this.m_delta = new b2_math_js_1.b2Vec2();
                    // DEBUG: b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies.");
                    this.m_bodies = def.bodies;
                    this.m_stiffness = b2_settings_js_1.b2Maybe(def.stiffness, 0);
                    this.m_damping = b2_settings_js_1.b2Maybe(def.damping, 0);
                    this.m_targetLengths = b2_settings_js_1.b2MakeNumberArray(def.bodies.length);
                    this.m_normals = b2_math_js_1.b2Vec2.MakeArray(def.bodies.length);
                    this.m_joints = []; // b2MakeNullArray(def.bodies.length);
                    this.m_deltas = b2_math_js_1.b2Vec2.MakeArray(def.bodies.length);
                    const djd = new b2_distance_joint_js_1.b2DistanceJointDef();
                    djd.stiffness = this.m_stiffness;
                    djd.damping = this.m_damping;
                    this.m_targetArea = 0;
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const body = this.m_bodies[i];
                        const next = this.m_bodies[(i + 1) % this.m_bodies.length];
                        const body_c = body.GetWorldCenter();
                        const next_c = next.GetWorldCenter();
                        this.m_targetLengths[i] = b2_math_js_1.b2Vec2.DistanceVV(body_c, next_c);
                        this.m_targetArea += b2_math_js_1.b2Vec2.CrossVV(body_c, next_c);
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
                SetStiffness(stiffness) {
                    this.m_stiffness = stiffness;
                    for (let i = 0; i < this.m_joints.length; ++i) {
                        this.m_joints[i].SetStiffness(stiffness);
                    }
                }
                GetStiffness() {
                    return this.m_stiffness;
                }
                SetDamping(damping) {
                    this.m_damping = damping;
                    for (let i = 0; i < this.m_joints.length; ++i) {
                        this.m_joints[i].SetDamping(damping);
                    }
                }
                GetDamping() {
                    return this.m_damping;
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
                        b2_math_js_1.b2Vec2.SubVV(next_c, prev_c, delta);
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
                        crossMassSum += b2_math_js_1.b2Vec2.CrossVV(body_v, delta);
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
                        const delta = b2_math_js_1.b2Vec2.SubVV(next_c, body_c, this.m_delta);
                        let dist = delta.Length();
                        if (dist < b2_settings_js_1.b2_epsilon) {
                            dist = 1;
                        }
                        this.m_normals[i].x = delta.y / dist;
                        this.m_normals[i].y = -delta.x / dist;
                        perimeter += dist;
                        area += b2_math_js_1.b2Vec2.CrossVV(body_c, next_c);
                    }
                    area *= 0.5;
                    const deltaArea = this.m_targetArea - area;
                    const toExtrude = 0.5 * deltaArea / perimeter;
                    let done = true;
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const body = this.m_bodies[i];
                        const body_c = data.positions[body.m_islandIndex].c;
                        const next_i = (i + 1) % this.m_bodies.length;
                        const delta = b2_math_js_1.b2Vec2.AddVV(this.m_normals[i], this.m_normals[next_i], this.m_delta);
                        delta.SelfMul(toExtrude);
                        const norm_sq = delta.LengthSquared();
                        if (norm_sq > b2_math_js_1.b2Sq(b2_settings_js_1.b2_maxLinearCorrection)) {
                            delta.SelfMul(b2_settings_js_1.b2_maxLinearCorrection / b2_math_js_1.b2Sqrt(norm_sq));
                        }
                        if (norm_sq > b2_math_js_1.b2Sq(b2_settings_js_1.b2_linearSlop)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfYXJlYV9qb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9keW5hbWljcy9iMl9hcmVhX2pvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBa0JBLGlCQUFBLE1BQWEsY0FBZSxTQUFRLHdCQUFVO2dCQU81QztvQkFDRSxLQUFLLENBQUMseUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFQMUIsV0FBTSxHQUFhLEVBQUUsQ0FBQztvQkFFdEIsY0FBUyxHQUFXLENBQUMsQ0FBQztvQkFFdEIsWUFBTyxHQUFXLENBQUMsQ0FBQztnQkFJM0IsQ0FBQztnQkFFTSxPQUFPLENBQUMsSUFBWTtvQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXZCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztxQkFDbkI7eUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO3FCQUNuQjtnQkFDSCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxjQUFBLE1BQWEsV0FBWSxTQUFRLHFCQUFPO2dCQWdCdEMsWUFBWSxHQUFvQjtvQkFDOUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQWZOLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixjQUFTLEdBQVcsQ0FBQyxDQUFDO29CQUU3QixnQkFBZ0I7b0JBQ1QsY0FBUyxHQUFXLENBQUMsQ0FBQztvQkFJdEIsaUJBQVksR0FBVyxDQUFDLENBQUM7b0JBSWhCLFlBQU8sR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFLN0MsMkdBQTJHO29CQUUzRyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FB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