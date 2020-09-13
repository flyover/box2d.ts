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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_joint.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_joint_js_1, b2_minPulleyLength, b2PulleyJointDef, b2PulleyJoint;
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
            }
        ],
        execute: function () {
            exports_1("b2_minPulleyLength", b2_minPulleyLength = 2);
            /// Pulley joint definition. This requires two ground anchors,
            /// two dynamic body anchor points, and a pulley ratio.
            b2PulleyJointDef = class b2PulleyJointDef extends b2_joint_js_1.b2JointDef {
                constructor() {
                    super(b2_joint_js_1.b2JointType.e_pulleyJoint);
                    this.groundAnchorA = new b2_math_js_1.b2Vec2(-1, 1);
                    this.groundAnchorB = new b2_math_js_1.b2Vec2(1, 1);
                    this.localAnchorA = new b2_math_js_1.b2Vec2(-1, 0);
                    this.localAnchorB = new b2_math_js_1.b2Vec2(1, 0);
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
                    this.lengthA = b2_math_js_1.b2Vec2.DistanceVV(anchorA, groundA);
                    this.lengthB = b2_math_js_1.b2Vec2.DistanceVV(anchorB, groundB);
                    this.ratio = r;
                    // DEBUG: b2Assert(this.ratio > b2_epsilon);
                }
            };
            exports_1("b2PulleyJointDef", b2PulleyJointDef);
            b2PulleyJoint = class b2PulleyJoint extends b2_joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_groundAnchorA = new b2_math_js_1.b2Vec2();
                    this.m_groundAnchorB = new b2_math_js_1.b2Vec2();
                    this.m_lengthA = 0;
                    this.m_lengthB = 0;
                    // Solver shared
                    this.m_localAnchorA = new b2_math_js_1.b2Vec2();
                    this.m_localAnchorB = new b2_math_js_1.b2Vec2();
                    this.m_constant = 0;
                    this.m_ratio = 0;
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_uA = new b2_math_js_1.b2Vec2();
                    this.m_uB = new b2_math_js_1.b2Vec2();
                    this.m_rA = new b2_math_js_1.b2Vec2();
                    this.m_rB = new b2_math_js_1.b2Vec2();
                    this.m_localCenterA = new b2_math_js_1.b2Vec2();
                    this.m_localCenterB = new b2_math_js_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = 0;
                    this.m_qA = new b2_math_js_1.b2Rot();
                    this.m_qB = new b2_math_js_1.b2Rot();
                    this.m_lalcA = new b2_math_js_1.b2Vec2();
                    this.m_lalcB = new b2_math_js_1.b2Vec2();
                    this.m_groundAnchorA.Copy(b2_settings_js_1.b2Maybe(def.groundAnchorA, new b2_math_js_1.b2Vec2(-1, 1)));
                    this.m_groundAnchorB.Copy(b2_settings_js_1.b2Maybe(def.groundAnchorB, new b2_math_js_1.b2Vec2(1, 0)));
                    this.m_localAnchorA.Copy(b2_settings_js_1.b2Maybe(def.localAnchorA, new b2_math_js_1.b2Vec2(-1, 0)));
                    this.m_localAnchorB.Copy(b2_settings_js_1.b2Maybe(def.localAnchorB, new b2_math_js_1.b2Vec2(1, 0)));
                    this.m_lengthA = b2_settings_js_1.b2Maybe(def.lengthA, 0);
                    this.m_lengthB = b2_settings_js_1.b2Maybe(def.lengthB, 0);
                    // DEBUG: b2Assert(b2Maybe(def.ratio, 1) !== 0);
                    this.m_ratio = b2_settings_js_1.b2Maybe(def.ratio, 1);
                    this.m_constant = b2_settings_js_1.b2Maybe(def.lengthA, 0) + this.m_ratio * b2_settings_js_1.b2Maybe(def.lengthB, 0);
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
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // Get the pulley axes.
                    // m_uA = cA + m_rA - m_groundAnchorA;
                    this.m_uA.Copy(cA).SelfAdd(this.m_rA).SelfSub(this.m_groundAnchorA);
                    // m_uB = cB + m_rB - m_groundAnchorB;
                    this.m_uB.Copy(cB).SelfAdd(this.m_rB).SelfSub(this.m_groundAnchorB);
                    const lengthA = this.m_uA.Length();
                    const lengthB = this.m_uB.Length();
                    if (lengthA > 10 * b2_settings_js_1.b2_linearSlop) {
                        this.m_uA.SelfMul(1 / lengthA);
                    }
                    else {
                        this.m_uA.SetZero();
                    }
                    if (lengthB > 10 * b2_settings_js_1.b2_linearSlop) {
                        this.m_uB.SelfMul(1 / lengthB);
                    }
                    else {
                        this.m_uB.SetZero();
                    }
                    // Compute effective mass.
                    const ruA = b2_math_js_1.b2Vec2.CrossVV(this.m_rA, this.m_uA);
                    const ruB = b2_math_js_1.b2Vec2.CrossVV(this.m_rB, this.m_uB);
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
                        const PA = b2_math_js_1.b2Vec2.MulSV(-(this.m_impulse), this.m_uA, b2PulleyJoint.InitVelocityConstraints_s_PA);
                        // b2Vec2 PB = (-m_ratio * m_impulse) * m_uB;
                        const PB = b2_math_js_1.b2Vec2.MulSV((-this.m_ratio * this.m_impulse), this.m_uB, b2PulleyJoint.InitVelocityConstraints_s_PB);
                        // vA += m_invMassA * PA;
                        vA.SelfMulAdd(this.m_invMassA, PA);
                        wA += this.m_invIA * b2_math_js_1.b2Vec2.CrossVV(this.m_rA, PA);
                        // vB += m_invMassB * PB;
                        vB.SelfMulAdd(this.m_invMassB, PB);
                        wB += this.m_invIB * b2_math_js_1.b2Vec2.CrossVV(this.m_rB, PB);
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
                    const vpA = b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2PulleyJoint.SolveVelocityConstraints_s_vpA);
                    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
                    const vpB = b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2PulleyJoint.SolveVelocityConstraints_s_vpB);
                    const Cdot = -b2_math_js_1.b2Vec2.DotVV(this.m_uA, vpA) - this.m_ratio * b2_math_js_1.b2Vec2.DotVV(this.m_uB, vpB);
                    const impulse = -this.m_mass * Cdot;
                    this.m_impulse += impulse;
                    // b2Vec2 PA = -impulse * m_uA;
                    const PA = b2_math_js_1.b2Vec2.MulSV(-impulse, this.m_uA, b2PulleyJoint.SolveVelocityConstraints_s_PA);
                    // b2Vec2 PB = -m_ratio * impulse * m_uB;
                    const PB = b2_math_js_1.b2Vec2.MulSV(-this.m_ratio * impulse, this.m_uB, b2PulleyJoint.SolveVelocityConstraints_s_PB);
                    // vA += m_invMassA * PA;
                    vA.SelfMulAdd(this.m_invMassA, PA);
                    wA += this.m_invIA * b2_math_js_1.b2Vec2.CrossVV(this.m_rA, PA);
                    // vB += m_invMassB * PB;
                    vB.SelfMulAdd(this.m_invMassB, PB);
                    wB += this.m_invIB * b2_math_js_1.b2Vec2.CrossVV(this.m_rB, PB);
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
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // Get the pulley axes.
                    // b2Vec2 uA = cA + rA - m_groundAnchorA;
                    const uA = this.m_uA.Copy(cA).SelfAdd(rA).SelfSub(this.m_groundAnchorA);
                    // b2Vec2 uB = cB + rB - m_groundAnchorB;
                    const uB = this.m_uB.Copy(cB).SelfAdd(rB).SelfSub(this.m_groundAnchorB);
                    const lengthA = uA.Length();
                    const lengthB = uB.Length();
                    if (lengthA > 10 * b2_settings_js_1.b2_linearSlop) {
                        uA.SelfMul(1 / lengthA);
                    }
                    else {
                        uA.SetZero();
                    }
                    if (lengthB > 10 * b2_settings_js_1.b2_linearSlop) {
                        uB.SelfMul(1 / lengthB);
                    }
                    else {
                        uB.SetZero();
                    }
                    // Compute effective mass.
                    const ruA = b2_math_js_1.b2Vec2.CrossVV(rA, uA);
                    const ruB = b2_math_js_1.b2Vec2.CrossVV(rB, uB);
                    const mA = this.m_invMassA + this.m_invIA * ruA * ruA;
                    const mB = this.m_invMassB + this.m_invIB * ruB * ruB;
                    let mass = mA + this.m_ratio * this.m_ratio * mB;
                    if (mass > 0) {
                        mass = 1 / mass;
                    }
                    const C = this.m_constant - lengthA - this.m_ratio * lengthB;
                    const linearError = b2_math_js_1.b2Abs(C);
                    const impulse = -mass * C;
                    // b2Vec2 PA = -impulse * uA;
                    const PA = b2_math_js_1.b2Vec2.MulSV(-impulse, uA, b2PulleyJoint.SolvePositionConstraints_s_PA);
                    // b2Vec2 PB = -m_ratio * impulse * uB;
                    const PB = b2_math_js_1.b2Vec2.MulSV(-this.m_ratio * impulse, uB, b2PulleyJoint.SolvePositionConstraints_s_PB);
                    // cA += m_invMassA * PA;
                    cA.SelfMulAdd(this.m_invMassA, PA);
                    aA += this.m_invIA * b2_math_js_1.b2Vec2.CrossVV(rA, PA);
                    // cB += m_invMassB * PB;
                    cB.SelfMulAdd(this.m_invMassB, PB);
                    aB += this.m_invIB * b2_math_js_1.b2Vec2.CrossVV(rB, PB);
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return linearError < b2_settings_js_1.b2_linearSlop;
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
                    out.x = inv_dt * this.m_impulse * this.m_uB.x;
                    out.y = inv_dt * this.m_impulse * this.m_uB.y;
                    return out;
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
                    return b2_math_js_1.b2Vec2.DistanceVV(p, s);
                }
                GetCurrentLengthB() {
                    // b2Vec2 p = m_bodyB->GetWorldPoint(m_localAnchorB);
                    // b2Vec2 s = m_groundAnchorB;
                    // b2Vec2 d = p - s;
                    // return d.Length();
                    const p = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, b2PulleyJoint.GetCurrentLengthB_s_p);
                    const s = this.m_groundAnchorB;
                    return b2_math_js_1.b2Vec2.DistanceVV(p, s);
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
            exports_1("b2PulleyJoint", b2PulleyJoint);
            b2PulleyJoint.InitVelocityConstraints_s_PA = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.InitVelocityConstraints_s_PB = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_vpA = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_vpB = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_PA = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.SolveVelocityConstraints_s_PB = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.SolvePositionConstraints_s_PA = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.SolvePositionConstraints_s_PB = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.GetCurrentLengthA_s_p = new b2_math_js_1.b2Vec2();
            b2PulleyJoint.GetCurrentLengthB_s_p = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfcHVsbGV5X2pvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R5bmFtaWNzL2IyX3B1bGxleV9qb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBU0YsZ0NBQWEsa0JBQWtCLEdBQVcsQ0FBQyxFQUFDO1lBa0I1Qyw4REFBOEQ7WUFDOUQsdURBQXVEO1lBQ3ZELG1CQUFBLE1BQWEsZ0JBQWlCLFNBQVEsd0JBQVU7Z0JBZTlDO29CQUNFLEtBQUssQ0FBQyx5QkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQWZuQixrQkFBYSxHQUFXLElBQUksbUJBQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFMUMsa0JBQWEsR0FBVyxJQUFJLG1CQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUV6QyxpQkFBWSxHQUFXLElBQUksbUJBQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFekMsaUJBQVksR0FBVyxJQUFJLG1CQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUVqRCxZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUVwQixZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUVwQixVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUl2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2dCQUMvQixDQUFDO2dCQUVNLFVBQVUsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLE9BQWUsRUFBRSxDQUFTO29CQUNySCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxD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