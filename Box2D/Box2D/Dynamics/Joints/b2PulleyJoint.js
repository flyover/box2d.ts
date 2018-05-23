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
System.register(["../../Common/b2Settings", "../../Common/b2Math", "./b2Joint"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2Math_1, b2Joint_1, b2_minPulleyLength, b2PulleyJointDef, b2PulleyJoint;
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
            }
        ],
        execute: function () {
            exports_1("b2_minPulleyLength", b2_minPulleyLength = 2);
            /// Pulley joint definition. This requires two ground anchors,
            /// two dynamic body anchor points, and a pulley ratio.
            b2PulleyJointDef = class b2PulleyJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(4 /* e_pulleyJoint */);
                    this.groundAnchorA = new b2Math_1.b2Vec2(-1, 1);
                    this.groundAnchorB = new b2Math_1.b2Vec2(1, 1);
                    this.localAnchorA = new b2Math_1.b2Vec2(-1, 0);
                    this.localAnchorB = new b2Math_1.b2Vec2(1, 0);
                    this.lengthA = 0;
                    this.lengthB = 0;
                    this.ratio = 1;
                    this.collideConnected = true;
                }
                Initialize(bA, bB, groundA, groundB, anchorA, anchorB, r) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.groundAnchorA.Copy(groundA);
                    this.groundAnchorB.Copy(groundB);
                    this.bodyA.GetLocalPoint(anchorA, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchorB, this.localAnchorB);
                    this.lengthA = b2Math_1.b2Vec2.DistanceVV(anchorA, groundA);
                    this.lengthB = b2Math_1.b2Vec2.DistanceVV(anchorB, groundB);
                    this.ratio = r;
                    ///b2Assert(this.ratio > b2_epsilon);
                }
            };
            exports_1("b2PulleyJointDef", b2PulleyJointDef);
            b2PulleyJoint = class b2PulleyJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_groundAnchorA = new b2Math_1.b2Vec2();
                    this.m_groundAnchorB = new b2Math_1.b2Vec2();
                    this.m_lengthA = 0;
                    this.m_lengthB = 0;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_constant = 0;
                    this.m_ratio = 0;
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_uA = new b2Math_1.b2Vec2();
                    this.m_uB = new b2Math_1.b2Vec2();
                    this.m_rA = new b2Math_1.b2Vec2();
                    this.m_rB = new b2Math_1.b2Vec2();
                    this.m_localCenterA = new b2Math_1.b2Vec2();
                    this.m_localCenterB = new b2Math_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = 0;
                    this.m_qA = new b2Math_1.b2Rot();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_lalcA = new b2Math_1.b2Vec2();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_groundAnchorA.Copy(def.groundAnchorA);
                    this.m_groundAnchorB.Copy(def.groundAnchorB);
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_lengthA = def.lengthA;
                    this.m_lengthB = def.lengthB;
                    ///b2Assert(def.ratio !== 0);
                    this.m_ratio = def.ratio;
                    this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
                    this.m_impulse = 0;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassA = this.m_bodyA.m_invMass;
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIA = this.m_bodyA.m_invI;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cA = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // b2Rot qA(aA), qB(aB);
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // Get the pulley axes.
                    // m_uA = cA + m_rA - m_groundAnchorA;
                    this.m_uA.Copy(cA).SelfAdd(this.m_rA).SelfSub(this.m_groundAnchorA);
                    // m_uB = cB + m_rB - m_groundAnchorB;
                    this.m_uB.Copy(cB).SelfAdd(this.m_rB).SelfSub(this.m_groundAnchorB);
                    const lengthA = this.m_uA.Length();
                    const lengthB = this.m_uB.Length();
                    if (lengthA > 10 * b2Settings_1.b2_linearSlop) {
                        this.m_uA.SelfMul(1 / lengthA);
                    }
                    else {
                        this.m_uA.SetZero();
                    }
                    if (lengthB > 10 * b2Settings_1.b2_linearSlop) {
                        this.m_uB.SelfMul(1 / lengthB);
                    }
                    else {
                        this.m_uB.SetZero();
                    }
                    // Compute effective mass.
                    const ruA = b2Math_1.b2Vec2.CrossVV(this.m_rA, this.m_uA);
                    const ruB = b2Math_1.b2Vec2.CrossVV(this.m_rB, this.m_uB);
                    const mA = this.m_invMassA + this.m_invIA * ruA * ruA;
                    const mB = this.m_invMassB + this.m_invIB * ruB * ruB;
                    this.m_mass = mA + this.m_ratio * this.m_ratio * mB;
                    if (this.m_mass > 0) {
                        this.m_mass = 1 / this.m_mass;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support variable time steps.
                        this.m_impulse *= data.step.dtRatio;
                        // Warm starting.
                        // b2Vec2 PA = -(m_impulse) * m_uA;
                        const PA = b2Math_1.b2Vec2.MulSV(-(this.m_impulse), this.m_uA, b2PulleyJoint.InitVelocityConstraints_s_PA);
                        // b2Vec2 PB = (-m_ratio * m_impulse) * m_uB;
                        const PB = b2Math_1.b2Vec2.MulSV((-this.m_ratio * this.m_impulse), this.m_uB, b2PulleyJoint.InitVelocityConstraints_s_PB);
                        // vA += m_invMassA * PA;
                        vA.SelfMulAdd(this.m_invMassA, PA);
                        wA += this.m_invIA * b2Math_1.b2Vec2.CrossVV(this.m_rA, PA);
                        // vB += m_invMassB * PB;
                        vB.SelfMulAdd(this.m_invMassB, PB);
                        wB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(this.m_rB, PB);
                    }
                    else {
                        this.m_impulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
                    const vpA = b2Math_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2PulleyJoint.SolveVelocityConstraints_s_vpA);
                    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
                    const vpB = b2Math_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2PulleyJoint.SolveVelocityConstraints_s_vpB);
                    const Cdot = -b2Math_1.b2Vec2.DotVV(this.m_uA, vpA) - this.m_ratio * b2Math_1.b2Vec2.DotVV(this.m_uB, vpB);
                    const impulse = -this.m_mass * Cdot;
                    this.m_impulse += impulse;
                    // b2Vec2 PA = -impulse * m_uA;
                    const PA = b2Math_1.b2Vec2.MulSV(-impulse, this.m_uA, b2PulleyJoint.SolveVelocityConstraints_s_PA);
                    // b2Vec2 PB = -m_ratio * impulse * m_uB;
                    const PB = b2Math_1.b2Vec2.MulSV(-this.m_ratio * impulse, this.m_uB, b2PulleyJoint.SolveVelocityConstraints_s_PB);
                    // vA += m_invMassA * PA;
                    vA.SelfMulAdd(this.m_invMassA, PA);
                    wA += this.m_invIA * b2Math_1.b2Vec2.CrossVV(this.m_rA, PA);
                    // vB += m_invMassB * PB;
                    vB.SelfMulAdd(this.m_invMassB, PB);
                    wB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(this.m_rB, PB);
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    // b2Rot qA(aA), qB(aB);
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // Get the pulley axes.
                    // b2Vec2 uA = cA + rA - m_groundAnchorA;
                    const uA = this.m_uA.Copy(cA).SelfAdd(rA).SelfSub(this.m_groundAnchorA);
                    // b2Vec2 uB = cB + rB - m_groundAnchorB;
                    const uB = this.m_uB.Copy(cB).SelfAdd(rB).SelfSub(this.m_groundAnchorB);
                    const lengthA = uA.Length();
                    const lengthB = uB.Length();
                    if (lengthA > 10 * b2Settings_1.b2_linearSlop) {
                        uA.SelfMul(1 / lengthA);
                    }
                    else {
                        uA.SetZero();
                    }
                    if (lengthB > 10 * b2Settings_1.b2_linearSlop) {
                        uB.SelfMul(1 / lengthB);
                    }
                    else {
                        uB.SetZero();
                    }
                    // Compute effective mass.
                    const ruA = b2Math_1.b2Vec2.CrossVV(rA, uA);
                    const ruB = b2Math_1.b2Vec2.CrossVV(rB, uB);
                    const mA = this.m_invMassA + this.m_invIA * ruA * ruA;
                    const mB = this.m_invMassB + this.m_invIB * ruB * ruB;
                    let mass = mA + this.m_ratio * this.m_ratio * mB;
                    if (mass > 0) {
                        mass = 1 / mass;
                    }
                    const C = this.m_constant - lengthA - this.m_ratio * lengthB;
                    const linearError = b2Math_1.b2Abs(C);
                    const impulse = -mass * C;
                    // b2Vec2 PA = -impulse * uA;
                    const PA = b2Math_1.b2Vec2.MulSV(-impulse, uA, b2PulleyJoint.SolvePositionConstraints_s_PA);
                    // b2Vec2 PB = -m_ratio * impulse * uB;
                    const PB = b2Math_1.b2Vec2.MulSV(-this.m_ratio * impulse, uB, b2PulleyJoint.SolvePositionConstraints_s_PB);
                    // cA += m_invMassA * PA;
                    cA.SelfMulAdd(this.m_invMassA, PA);
                    aA += this.m_invIA * b2Math_1.b2Vec2.CrossVV(rA, PA);
                    // cB += m_invMassB * PB;
                    cB.SelfMulAdd(this.m_invMassB, PB);
                    aB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(rB, PB);
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return linearError < b2Settings_1.b2_linearSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // b2Vec2 P = m_impulse * m_uB;
                    // return inv_dt * P;
                    return out.Set(inv_dt * this.m_impulse * this.m_uB.x, inv_dt * this.m_impulse * this.m_uB.y);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                GetGroundAnchorA() {
                    return this.m_groundAnchorA;
                }
                GetGroundAnchorB() {
                    return this.m_groundAnchorB;
                }
                GetLengthA() {
                    return this.m_lengthA;
                }
                GetLengthB() {
                    return this.m_lengthB;
                }
                GetRatio() {
                    return this.m_ratio;
                }
                GetCurrentLengthA() {
                    // b2Vec2 p = m_bodyA->GetWorldPoint(m_localAnchorA);
                    // b2Vec2 s = m_groundAnchorA;
                    // b2Vec2 d = p - s;
                    // return d.Length();
                    const p = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, b2PulleyJoint.GetCurrentLengthA_s_p);
                    const s = this.m_groundAnchorA;
                    return b2Math_1.b2Vec2.DistanceVV(p, s);
                }
                GetCurrentLengthB() {
                    // b2Vec2 p = m_bodyB->GetWorldPoint(m_localAnchorB);
                    // b2Vec2 s = m_groundAnchorB;
                    // b2Vec2 d = p - s;
                    // return d.Length();
                    const p = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, b2PulleyJoint.GetCurrentLengthB_s_p);
                    const s = this.m_groundAnchorB;
                    return b2Math_1.b2Vec2.DistanceVV(p, s);
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2PulleyJointDef = new b2PulleyJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.groundAnchorA.Set(%.15f, %.15f);\n", this.m_groundAnchorA.x, this.m_groundAnchorA.y);
                    log("  jd.groundAnchorB.Set(%.15f, %.15f);\n", this.m_groundAnchorB.x, this.m_groundAnchorB.y);
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.lengthA = %.15f;\n", this.m_lengthA);
                    log("  jd.lengthB = %.15f;\n", this.m_lengthB);
                    log("  jd.ratio = %.15f;\n", this.m_ratio);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
                ShiftOrigin(newOrigin) {
                    this.m_groundAnchorA.SelfSub(newOrigin);
                    this.m_groundAnchorB.SelfSub(newOrigin);
                }
            };
            b2PulleyJoint.InitVelocityConstraints_s_PA = new b2Math_1.b2Vec2();
            b2PulleyJoint.InitVelocityConstraints_s_PB = new b2Math_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_vpA = new b2Math_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_vpB = new b2Math_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_PA = new b2Math_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_PB = new b2Math_1.b2Vec2();
            b2PulleyJoint.SolvePositionConstraints_s_PA = new b2Math_1.b2Vec2();
            b2PulleyJoint.SolvePositionConstraints_s_PB = new b2Math_1.b2Vec2();
            b2PulleyJoint.GetCurrentLengthA_s_p = new b2Math_1.b2Vec2();
            b2PulleyJoint.GetCurrentLengthB_s_p = new b2Math_1.b2Vec2();
            exports_1("b2PulleyJoint", b2PulleyJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQdWxsZXlKb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyUHVsbGV5Sm9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVFGLGdDQUFhLGtCQUFrQixHQUFXLENBQUMsRUFBQztZQUU1Qyw4REFBOEQ7WUFDOUQsdURBQXVEO1lBQ3ZELG1CQUFBLHNCQUE4QixTQUFRLG9CQUFVO2dCQWU5QztvQkFDRSxLQUFLLHVCQUEyQixDQUFDO29CQWY1QixrQkFBYSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUUxQyxrQkFBYSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFekMsaUJBQVksR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFekMsaUJBQVksR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXhDLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBRXBCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBRXBCLFVBQUssR0FBVyxDQUFDLENBQUM7b0JBSXZCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0JBQy9CLENBQUM7Z0JBRU0sVUFBVSxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLENBQVM7b0JBQ3JILElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxD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