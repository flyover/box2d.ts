System.register(["../../Common/b2Settings", "../../Common/b2Math", "./b2Joint", "./b2DistanceJoint"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2Math_1, b2Joint_1, b2DistanceJoint_1, b2AreaJointDef, b2AreaJoint;
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
                    super(12 /* e_areaJoint */);
                    this.world = null;
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
                    ///b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies.");
                    this.m_bodies = def.bodies;
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_targetLengths = b2Settings_1.b2MakeNumberArray(def.bodies.length);
                    this.m_normals = b2Math_1.b2Vec2.MakeArray(def.bodies.length);
                    this.m_joints = b2Settings_1.b2MakeNullArray(def.bodies.length);
                    this.m_deltas = b2Math_1.b2Vec2.MakeArray(def.bodies.length);
                    this.m_delta = new b2Math_1.b2Vec2();
                    const djd = new b2DistanceJoint_1.b2DistanceJointDef();
                    djd.frequencyHz = def.frequencyHz;
                    djd.dampingRatio = def.dampingRatio;
                    this.m_targetArea = 0;
                    for (let i = 0; i < this.m_bodies.length; ++i) {
                        const body = this.m_bodies[i];
                        const next = this.m_bodies[(i + 1) % this.m_bodies.length];
                        const body_c = body.GetWorldCenter();
                        const next_c = next.GetWorldCenter();
                        this.m_targetLengths[i] = b2Math_1.b2Vec2.DistanceVV(body_c, next_c);
                        this.m_targetArea += b2Math_1.b2Vec2.CrossVV(body_c, next_c);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJBcmVhSm9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkFyZWFKb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFBLGlCQUFBLG9CQUE0QixTQUFRLG9CQUFVO2dCQVM1QztvQkFDRSxLQUFLLHNCQUF5QixDQUFDO29CQVQxQixVQUFLLEdBQVksSUFBSSxDQUFDO29CQUV0QixXQUFNLEdBQWEsRUFBRSxDQUFDO29CQUV0QixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFFeEIsaUJBQVksR0FBVyxDQUFDLENBQUM7Z0JBSWhDLENBQUM7Z0JBRU0sT0FBTyxDQUFDLElBQVk7b0JBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV2QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTt3QkFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7cUJBQ25CO3lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztxQkFDbkI7Z0JBQ0gsQ0FBQzthQUNGLENBQUE7O1lBRUQsY0FBQSxpQkFBeUIsU0FBUSxpQkFBTztnQkFnQnRDLFlBQVksR0FBbUI7b0JBQzdCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFoQk4sYUFBUSxHQUFhLElBQUksQ0FBQztvQkFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBQzFCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUVsQyxnQkFBZ0I7b0JBQ1QsY0FBUyxHQUFXLENBQUMsQ0FBQztvQkFFN0IsY0FBYztvQkFDUCxvQkFBZSxHQUFhLElBQUksQ0FBQztvQkFDakMsaUJBQVksR0FBVyxDQUFDLENBQUM7b0JBQ3pCLGNBQVMsR0FBYSxJQUFJLENBQUM7b0JBQzNCLGFBQVEs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QUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ25FLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDNUQsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1RCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV2QyxlQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7cUJBQ3JDO29CQUVELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7d0JBQzFCLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBRXBDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDckQsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdEMsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM3RCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUV2QyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs0QkFDN0QsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzt5QkFDOUQ7cUJBQ0Y7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7cUJBQ3BCO2dCQUNILENBQUM7Z0JBRU0sd0JBQXdCLENBQUMsSUFBa0I7b0JBQ2hELElBQUksVUFBVSxHQUFXLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxZQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUU3QixLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3JELE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RDLE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0QsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFdkMsVUFBVSxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQ3JELFlBQVksSUFBSSxlQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztxQkFDL0M7b0JBRUQsTUFBTSxNQUFNLEdBQVcsQ0FBQyxDQUFDLEdBQUcsWUFBWSxHQUFHLFVBQVUsQ0FBQztvQkFDdEQsNkVBQTZFO29CQUU3RSxJQUFJLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQztvQkFFekIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUNyRCxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdELE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRXZDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7d0JBQ3JELE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztxQkFDdEQ7Z0JBQ0gsQ0FBQztnQkFFTSx3QkFBd0IsQ0FBQyxJQUFrQjtvQkFDaEQsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO29CQUMxQixJQUFJLElBQUksR0FBVyxDQUFDLENBQUM7b0JBRXJCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDckQsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNuRSxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVELE1BQU0sTUFBTSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFNUQsTUFBTSxLQUFLLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFFakUsSUFBSSxJQUFJLEdBQVcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUNsQyxJQUFJLElBQUksR0FBRyx1QkFBVSxFQUFFOzRCQUNyQixJQUFJLEdBQUcsQ0FBQyxDQUFDO3lCQUNWO3dCQUVELElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUV0QyxTQUFTLElBQUksSUFBSSxDQUFDO3dCQUVsQixJQUFJLElBQUksZUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7cUJBQ3hDO29CQUVELElBQUksSUFBSSxHQUFHLENBQUM7b0JBRVosTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ25ELE1BQU0sU0FBUyxHQUFXLEdBQUcsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDO29CQUN0RCxJQUFJLElBQUksR0FBWSxJQUFJLENBQUM7b0JBRXpCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDckQsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1RCxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFFdEQsTUFBTSxLQUFLLEdBQVcsZUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUM1RixLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUV6QixNQUFNLE9BQU8sR0FBVyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQzlDLElBQUksT0FBTyxHQUFHLGFBQUksQ0FBQyxtQ0FBc0IsQ0FBQyxFQUFFOzRCQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLG1DQUFzQixHQUFHLGVBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3lCQUN6RDt3QkFDRCxJQUFJLE9BQU8sR0FBRyxhQUFJLENBQUMsMEJBQWEsQ0FBQyxFQUFFOzRCQUNqQyxJQUFJLEdBQUcsS0FBSyxDQUFDO3lCQUNkO3dCQUVELE1BQU0sQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDcEIsTUFBTSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUNyQjtvQkFFRCxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQSJ9