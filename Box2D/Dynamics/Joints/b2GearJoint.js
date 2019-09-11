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
    var b2Settings_1, b2Math_1, b2Joint_1, b2GearJointDef, b2GearJoint;
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
            }
        ],
        execute: function () {
            /// Gear joint definition. This definition requires two existing
            /// revolute or prismatic joints (any combination will work).
            b2GearJointDef = class b2GearJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(b2Joint_1.b2JointType.e_gearJoint);
                    this.ratio = 1;
                }
            };
            exports_1("b2GearJointDef", b2GearJointDef);
            b2GearJoint = class b2GearJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_typeA = b2Joint_1.b2JointType.e_unknownJoint;
                    this.m_typeB = b2Joint_1.b2JointType.e_unknownJoint;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_localAnchorC = new b2Math_1.b2Vec2();
                    this.m_localAnchorD = new b2Math_1.b2Vec2();
                    this.m_localAxisC = new b2Math_1.b2Vec2();
                    this.m_localAxisD = new b2Math_1.b2Vec2();
                    this.m_referenceAngleA = 0;
                    this.m_referenceAngleB = 0;
                    this.m_constant = 0;
                    this.m_ratio = 0;
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_indexC = 0;
                    this.m_indexD = 0;
                    this.m_lcA = new b2Math_1.b2Vec2();
                    this.m_lcB = new b2Math_1.b2Vec2();
                    this.m_lcC = new b2Math_1.b2Vec2();
                    this.m_lcD = new b2Math_1.b2Vec2();
                    this.m_mA = 0;
                    this.m_mB = 0;
                    this.m_mC = 0;
                    this.m_mD = 0;
                    this.m_iA = 0;
                    this.m_iB = 0;
                    this.m_iC = 0;
                    this.m_iD = 0;
                    this.m_JvAC = new b2Math_1.b2Vec2();
                    this.m_JvBD = new b2Math_1.b2Vec2();
                    this.m_JwA = 0;
                    this.m_JwB = 0;
                    this.m_JwC = 0;
                    this.m_JwD = 0;
                    this.m_mass = 0;
                    this.m_qA = new b2Math_1.b2Rot();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_qC = new b2Math_1.b2Rot();
                    this.m_qD = new b2Math_1.b2Rot();
                    this.m_lalcA = new b2Math_1.b2Vec2();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_lalcC = new b2Math_1.b2Vec2();
                    this.m_lalcD = new b2Math_1.b2Vec2();
                    this.m_joint1 = def.joint1;
                    this.m_joint2 = def.joint2;
                    this.m_typeA = this.m_joint1.GetType();
                    this.m_typeB = this.m_joint2.GetType();
                    // DEBUG: b2Assert(this.m_typeA === b2JointType.e_revoluteJoint || this.m_typeA === b2JointType.e_prismaticJoint);
                    // DEBUG: b2Assert(this.m_typeB === b2JointType.e_revoluteJoint || this.m_typeB === b2JointType.e_prismaticJoint);
                    let coordinateA, coordinateB;
                    // TODO_ERIN there might be some problem with the joint edges in b2Joint.
                    this.m_bodyC = this.m_joint1.GetBodyA();
                    this.m_bodyA = this.m_joint1.GetBodyB();
                    // Get geometry of joint1
                    const xfA = this.m_bodyA.m_xf;
                    const aA = this.m_bodyA.m_sweep.a;
                    const xfC = this.m_bodyC.m_xf;
                    const aC = this.m_bodyC.m_sweep.a;
                    if (this.m_typeA === b2Joint_1.b2JointType.e_revoluteJoint) {
                        const revolute = def.joint1;
                        this.m_localAnchorC.Copy(revolute.m_localAnchorA);
                        this.m_localAnchorA.Copy(revolute.m_localAnchorB);
                        this.m_referenceAngleA = revolute.m_referenceAngle;
                        this.m_localAxisC.SetZero();
                        coordinateA = aA - aC - this.m_referenceAngleA;
                    }
                    else {
                        const prismatic = def.joint1;
                        this.m_localAnchorC.Copy(prismatic.m_localAnchorA);
                        this.m_localAnchorA.Copy(prismatic.m_localAnchorB);
                        this.m_referenceAngleA = prismatic.m_referenceAngle;
                        this.m_localAxisC.Copy(prismatic.m_localXAxisA);
                        // b2Vec2 pC = m_localAnchorC;
                        const pC = this.m_localAnchorC;
                        // b2Vec2 pA = b2MulT(xfC.q, b2Mul(xfA.q, m_localAnchorA) + (xfA.p - xfC.p));
                        const pA = b2Math_1.b2Rot.MulTRV(xfC.q, b2Math_1.b2Vec2.AddVV(b2Math_1.b2Rot.MulRV(xfA.q, this.m_localAnchorA, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.SubVV(xfA.p, xfC.p, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0); // pA uses s_t0
                        // coordinateA = b2Dot(pA - pC, m_localAxisC);
                        coordinateA = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pA, pC, b2Math_1.b2Vec2.s_t0), this.m_localAxisC);
                    }
                    this.m_bodyD = this.m_joint2.GetBodyA();
                    this.m_bodyB = this.m_joint2.GetBodyB();
                    // Get geometry of joint2
                    const xfB = this.m_bodyB.m_xf;
                    const aB = this.m_bodyB.m_sweep.a;
                    const xfD = this.m_bodyD.m_xf;
                    const aD = this.m_bodyD.m_sweep.a;
                    if (this.m_typeB === b2Joint_1.b2JointType.e_revoluteJoint) {
                        const revolute = def.joint2;
                        this.m_localAnchorD.Copy(revolute.m_localAnchorA);
                        this.m_localAnchorB.Copy(revolute.m_localAnchorB);
                        this.m_referenceAngleB = revolute.m_referenceAngle;
                        this.m_localAxisD.SetZero();
                        coordinateB = aB - aD - this.m_referenceAngleB;
                    }
                    else {
                        const prismatic = def.joint2;
                        this.m_localAnchorD.Copy(prismatic.m_localAnchorA);
                        this.m_localAnchorB.Copy(prismatic.m_localAnchorB);
                        this.m_referenceAngleB = prismatic.m_referenceAngle;
                        this.m_localAxisD.Copy(prismatic.m_localXAxisA);
                        // b2Vec2 pD = m_localAnchorD;
                        const pD = this.m_localAnchorD;
                        // b2Vec2 pB = b2MulT(xfD.q, b2Mul(xfB.q, m_localAnchorB) + (xfB.p - xfD.p));
                        const pB = b2Math_1.b2Rot.MulTRV(xfD.q, b2Math_1.b2Vec2.AddVV(b2Math_1.b2Rot.MulRV(xfB.q, this.m_localAnchorB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.SubVV(xfB.p, xfD.p, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0); // pB uses s_t0
                        // coordinateB = b2Dot(pB - pD, m_localAxisD);
                        coordinateB = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pB, pD, b2Math_1.b2Vec2.s_t0), this.m_localAxisD);
                    }
                    this.m_ratio = b2Settings_1.b2Maybe(def.ratio, 1);
                    this.m_constant = coordinateA + this.m_ratio * coordinateB;
                    this.m_impulse = 0;
                }
                InitVelocityConstraints(data) {
                    this.m_indexA = this.m_bodyA.m_islandIndex;
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_indexC = this.m_bodyC.m_islandIndex;
                    this.m_indexD = this.m_bodyD.m_islandIndex;
                    this.m_lcA.Copy(this.m_bodyA.m_sweep.localCenter);
                    this.m_lcB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_lcC.Copy(this.m_bodyC.m_sweep.localCenter);
                    this.m_lcD.Copy(this.m_bodyD.m_sweep.localCenter);
                    this.m_mA = this.m_bodyA.m_invMass;
                    this.m_mB = this.m_bodyB.m_invMass;
                    this.m_mC = this.m_bodyC.m_invMass;
                    this.m_mD = this.m_bodyD.m_invMass;
                    this.m_iA = this.m_bodyA.m_invI;
                    this.m_iB = this.m_bodyB.m_invI;
                    this.m_iC = this.m_bodyC.m_invI;
                    this.m_iD = this.m_bodyD.m_invI;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const aC = data.positions[this.m_indexC].a;
                    const vC = data.velocities[this.m_indexC].v;
                    let wC = data.velocities[this.m_indexC].w;
                    const aD = data.positions[this.m_indexD].a;
                    const vD = data.velocities[this.m_indexD].v;
                    let wD = data.velocities[this.m_indexD].w;
                    // b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB), qC = this.m_qC.SetAngle(aC), qD = this.m_qD.SetAngle(aD);
                    this.m_mass = 0;
                    if (this.m_typeA === b2Joint_1.b2JointType.e_revoluteJoint) {
                        this.m_JvAC.SetZero();
                        this.m_JwA = 1;
                        this.m_JwC = 1;
                        this.m_mass += this.m_iA + this.m_iC;
                    }
                    else {
                        // b2Vec2 u = b2Mul(qC, m_localAxisC);
                        const u = b2Math_1.b2Rot.MulRV(qC, this.m_localAxisC, b2GearJoint.InitVelocityConstraints_s_u);
                        // b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
                        b2Math_1.b2Vec2.SubVV(this.m_localAnchorC, this.m_lcC, this.m_lalcC);
                        const rC = b2Math_1.b2Rot.MulRV(qC, this.m_lalcC, b2GearJoint.InitVelocityConstraints_s_rC);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
                        b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_lcA, this.m_lalcA);
                        const rA = b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, b2GearJoint.InitVelocityConstraints_s_rA);
                        // m_JvAC = u;
                        this.m_JvAC.Copy(u);
                        // m_JwC = b2Cross(rC, u);
                        this.m_JwC = b2Math_1.b2Vec2.CrossVV(rC, u);
                        // m_JwA = b2Cross(rA, u);
                        this.m_JwA = b2Math_1.b2Vec2.CrossVV(rA, u);
                        this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
                    }
                    if (this.m_typeB === b2Joint_1.b2JointType.e_revoluteJoint) {
                        this.m_JvBD.SetZero();
                        this.m_JwB = this.m_ratio;
                        this.m_JwD = this.m_ratio;
                        this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
                    }
                    else {
                        // b2Vec2 u = b2Mul(qD, m_localAxisD);
                        const u = b2Math_1.b2Rot.MulRV(qD, this.m_localAxisD, b2GearJoint.InitVelocityConstraints_s_u);
                        // b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
                        b2Math_1.b2Vec2.SubVV(this.m_localAnchorD, this.m_lcD, this.m_lalcD);
                        const rD = b2Math_1.b2Rot.MulRV(qD, this.m_lalcD, b2GearJoint.InitVelocityConstraints_s_rD);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
                        b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_lcB, this.m_lalcB);
                        const rB = b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, b2GearJoint.InitVelocityConstraints_s_rB);
                        // m_JvBD = m_ratio * u;
                        b2Math_1.b2Vec2.MulSV(this.m_ratio, u, this.m_JvBD);
                        // m_JwD = m_ratio * b2Cross(rD, u);
                        this.m_JwD = this.m_ratio * b2Math_1.b2Vec2.CrossVV(rD, u);
                        // m_JwB = m_ratio * b2Cross(rB, u);
                        this.m_JwB = this.m_ratio * b2Math_1.b2Vec2.CrossVV(rB, u);
                        this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
                    }
                    // Compute effective mass.
                    this.m_mass = this.m_mass > 0 ? 1 / this.m_mass : 0;
                    if (data.step.warmStarting) {
                        // vA += (m_mA * m_impulse) * m_JvAC;
                        vA.SelfMulAdd(this.m_mA * this.m_impulse, this.m_JvAC);
                        wA += this.m_iA * this.m_impulse * this.m_JwA;
                        // vB += (m_mB * m_impulse) * m_JvBD;
                        vB.SelfMulAdd(this.m_mB * this.m_impulse, this.m_JvBD);
                        wB += this.m_iB * this.m_impulse * this.m_JwB;
                        // vC -= (m_mC * m_impulse) * m_JvAC;
                        vC.SelfMulSub(this.m_mC * this.m_impulse, this.m_JvAC);
                        wC -= this.m_iC * this.m_impulse * this.m_JwC;
                        // vD -= (m_mD * m_impulse) * m_JvBD;
                        vD.SelfMulSub(this.m_mD * this.m_impulse, this.m_JvBD);
                        wD -= this.m_iD * this.m_impulse * this.m_JwD;
                    }
                    else {
                        this.m_impulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                    // data.velocities[this.m_indexC].v = vC;
                    data.velocities[this.m_indexC].w = wC;
                    // data.velocities[this.m_indexD].v = vD;
                    data.velocities[this.m_indexD].w = wD;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const vC = data.velocities[this.m_indexC].v;
                    let wC = data.velocities[this.m_indexC].w;
                    const vD = data.velocities[this.m_indexD].v;
                    let wD = data.velocities[this.m_indexD].w;
                    // float32 Cdot = b2Dot(m_JvAC, vA - vC) + b2Dot(m_JvBD, vB - vD);
                    let Cdot = b2Math_1.b2Vec2.DotVV(this.m_JvAC, b2Math_1.b2Vec2.SubVV(vA, vC, b2Math_1.b2Vec2.s_t0)) +
                        b2Math_1.b2Vec2.DotVV(this.m_JvBD, b2Math_1.b2Vec2.SubVV(vB, vD, b2Math_1.b2Vec2.s_t0));
                    Cdot += (this.m_JwA * wA - this.m_JwC * wC) + (this.m_JwB * wB - this.m_JwD * wD);
                    const impulse = -this.m_mass * Cdot;
                    this.m_impulse += impulse;
                    // vA += (m_mA * impulse) * m_JvAC;
                    vA.SelfMulAdd((this.m_mA * impulse), this.m_JvAC);
                    wA += this.m_iA * impulse * this.m_JwA;
                    // vB += (m_mB * impulse) * m_JvBD;
                    vB.SelfMulAdd((this.m_mB * impulse), this.m_JvBD);
                    wB += this.m_iB * impulse * this.m_JwB;
                    // vC -= (m_mC * impulse) * m_JvAC;
                    vC.SelfMulSub((this.m_mC * impulse), this.m_JvAC);
                    wC -= this.m_iC * impulse * this.m_JwC;
                    // vD -= (m_mD * impulse) * m_JvBD;
                    vD.SelfMulSub((this.m_mD * impulse), this.m_JvBD);
                    wD -= this.m_iD * impulse * this.m_JwD;
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                    // data.velocities[this.m_indexC].v = vC;
                    data.velocities[this.m_indexC].w = wC;
                    // data.velocities[this.m_indexD].v = vD;
                    data.velocities[this.m_indexD].w = wD;
                }
                SolvePositionConstraints(data) {
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    const cC = data.positions[this.m_indexC].c;
                    let aC = data.positions[this.m_indexC].a;
                    const cD = data.positions[this.m_indexD].c;
                    let aD = data.positions[this.m_indexD].a;
                    // b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB), qC = this.m_qC.SetAngle(aC), qD = this.m_qD.SetAngle(aD);
                    const linearError = 0;
                    let coordinateA, coordinateB;
                    const JvAC = this.m_JvAC, JvBD = this.m_JvBD;
                    let JwA, JwB, JwC, JwD;
                    let mass = 0;
                    if (this.m_typeA === b2Joint_1.b2JointType.e_revoluteJoint) {
                        JvAC.SetZero();
                        JwA = 1;
                        JwC = 1;
                        mass += this.m_iA + this.m_iC;
                        coordinateA = aA - aC - this.m_referenceAngleA;
                    }
                    else {
                        // b2Vec2 u = b2Mul(qC, m_localAxisC);
                        const u = b2Math_1.b2Rot.MulRV(qC, this.m_localAxisC, b2GearJoint.SolvePositionConstraints_s_u);
                        // b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
                        const rC = b2Math_1.b2Rot.MulRV(qC, this.m_lalcC, b2GearJoint.SolvePositionConstraints_s_rC);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
                        const rA = b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, b2GearJoint.SolvePositionConstraints_s_rA);
                        // JvAC = u;
                        JvAC.Copy(u);
                        // JwC = b2Cross(rC, u);
                        JwC = b2Math_1.b2Vec2.CrossVV(rC, u);
                        // JwA = b2Cross(rA, u);
                        JwA = b2Math_1.b2Vec2.CrossVV(rA, u);
                        mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;
                        // b2Vec2 pC = m_localAnchorC - m_lcC;
                        const pC = this.m_lalcC;
                        // b2Vec2 pA = b2MulT(qC, rA + (cA - cC));
                        const pA = b2Math_1.b2Rot.MulTRV(qC, b2Math_1.b2Vec2.AddVV(rA, b2Math_1.b2Vec2.SubVV(cA, cC, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0); // pA uses s_t0
                        // coordinateA = b2Dot(pA - pC, m_localAxisC);
                        coordinateA = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pA, pC, b2Math_1.b2Vec2.s_t0), this.m_localAxisC);
                    }
                    if (this.m_typeB === b2Joint_1.b2JointType.e_revoluteJoint) {
                        JvBD.SetZero();
                        JwB = this.m_ratio;
                        JwD = this.m_ratio;
                        mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
                        coordinateB = aB - aD - this.m_referenceAngleB;
                    }
                    else {
                        // b2Vec2 u = b2Mul(qD, m_localAxisD);
                        const u = b2Math_1.b2Rot.MulRV(qD, this.m_localAxisD, b2GearJoint.SolvePositionConstraints_s_u);
                        // b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
                        const rD = b2Math_1.b2Rot.MulRV(qD, this.m_lalcD, b2GearJoint.SolvePositionConstraints_s_rD);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
                        const rB = b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, b2GearJoint.SolvePositionConstraints_s_rB);
                        // JvBD = m_ratio * u;
                        b2Math_1.b2Vec2.MulSV(this.m_ratio, u, JvBD);
                        // JwD = m_ratio * b2Cross(rD, u);
                        JwD = this.m_ratio * b2Math_1.b2Vec2.CrossVV(rD, u);
                        // JwB = m_ratio * b2Cross(rB, u);
                        JwB = this.m_ratio * b2Math_1.b2Vec2.CrossVV(rB, u);
                        mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * JwD * JwD + this.m_iB * JwB * JwB;
                        // b2Vec2 pD = m_localAnchorD - m_lcD;
                        const pD = this.m_lalcD;
                        // b2Vec2 pB = b2MulT(qD, rB + (cB - cD));
                        const pB = b2Math_1.b2Rot.MulTRV(qD, b2Math_1.b2Vec2.AddVV(rB, b2Math_1.b2Vec2.SubVV(cB, cD, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0); // pB uses s_t0
                        // coordinateB = b2Dot(pB - pD, m_localAxisD);
                        coordinateB = b2Math_1.b2Vec2.DotVV(b2Math_1.b2Vec2.SubVV(pB, pD, b2Math_1.b2Vec2.s_t0), this.m_localAxisD);
                    }
                    const C = (coordinateA + this.m_ratio * coordinateB) - this.m_constant;
                    let impulse = 0;
                    if (mass > 0) {
                        impulse = -C / mass;
                    }
                    // cA += m_mA * impulse * JvAC;
                    cA.SelfMulAdd(this.m_mA * impulse, JvAC);
                    aA += this.m_iA * impulse * JwA;
                    // cB += m_mB * impulse * JvBD;
                    cB.SelfMulAdd(this.m_mB * impulse, JvBD);
                    aB += this.m_iB * impulse * JwB;
                    // cC -= m_mC * impulse * JvAC;
                    cC.SelfMulSub(this.m_mC * impulse, JvAC);
                    aC -= this.m_iC * impulse * JwC;
                    // cD -= m_mD * impulse * JvBD;
                    cD.SelfMulSub(this.m_mD * impulse, JvBD);
                    aD -= this.m_iD * impulse * JwD;
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    // data.positions[this.m_indexC].c = cC;
                    data.positions[this.m_indexC].a = aC;
                    // data.positions[this.m_indexD].c = cD;
                    data.positions[this.m_indexD].a = aD;
                    // TODO_ERIN not implemented
                    return linearError < b2Settings_1.b2_linearSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // b2Vec2 P = m_impulse * m_JvAC;
                    // return inv_dt * P;
                    return b2Math_1.b2Vec2.MulSV(inv_dt * this.m_impulse, this.m_JvAC, out);
                }
                GetReactionTorque(inv_dt) {
                    // float32 L = m_impulse * m_JwA;
                    // return inv_dt * L;
                    return inv_dt * this.m_impulse * this.m_JwA;
                }
                GetJoint1() { return this.m_joint1; }
                GetJoint2() { return this.m_joint2; }
                GetRatio() {
                    return this.m_ratio;
                }
                SetRatio(ratio) {
                    // DEBUG: b2Assert(b2IsValid(ratio));
                    this.m_ratio = ratio;
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    const index1 = this.m_joint1.m_index;
                    const index2 = this.m_joint2.m_index;
                    log("  const jd: b2GearJointDef = new b2GearJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.joint1 = joints[%d];\n", index1);
                    log("  jd.joint2 = joints[%d];\n", index2);
                    log("  jd.ratio = %.15f;\n", this.m_ratio);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
            };
            exports_1("b2GearJoint", b2GearJoint);
            b2GearJoint.InitVelocityConstraints_s_u = new b2Math_1.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rA = new b2Math_1.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rB = new b2Math_1.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rC = new b2Math_1.b2Vec2();
            b2GearJoint.InitVelocityConstraints_s_rD = new b2Math_1.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_u = new b2Math_1.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rA = new b2Math_1.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rB = new b2Math_1.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rC = new b2Math_1.b2Vec2();
            b2GearJoint.SolvePositionConstraints_s_rD = new b2Math_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJHZWFySm9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkdlYXJKb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBb0JGLGdFQUFnRTtZQUNoRSw2REFBNkQ7WUFDN0QsaUJBQUEsTUFBYSxjQUFlLFNBQVEsb0JBQVU7Z0JBTzVDO29CQUNFLEtBQUssQ0FBQyxxQkFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUgxQixVQUFLLEdBQVcsQ0FBQyxDQUFDO2dCQUl6QixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxjQUFBLE1BQWEsV0FBWSxTQUFRLGlCQUFPO2dCQStEdEMsWUFBWSxHQUFvQjtvQkFDOUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQTVETixZQUFPLEdBQWdCLHFCQUFXLENBQUMsY0FBYyxDQUFDO29CQUNsRCxZQUFPLEdBQWdCLHFCQUFXLENBQUMsY0FBYyxDQUFDO29CQU96RCxnQkFBZ0I7b0JBQ0EsbUJBQWMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUN0QyxtQkFBYyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3RDLG1CQUFjLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDdEMsbUJBQWMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUV0QyxpQkFBWSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3BDLGlCQUFZLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFFN0Msc0JBQWlCLEdBQVcsQ0FBQyxDQUFDO29CQUM5QixzQkFBaUIsR0FBVyxDQUFDLENBQUM7b0JBRTlCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBRXBCLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBRTdCLGNBQWM7b0JBQ1AsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFX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RTNELElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixDQUFDO2dCQU9NLHVCQUF1QixDQUFDLElBQWtCO29CQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO29CQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO29CQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO29CQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO29CQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztvQkFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztvQkFFaEMsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbEQsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbEQsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbEQsTUFBTSxFQUFFLEdBQVcsSUFB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