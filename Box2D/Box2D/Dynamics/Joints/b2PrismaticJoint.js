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
    var b2Settings_1, b2Math_1, b2Joint_1, b2PrismaticJointDef, b2PrismaticJoint;
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
            /// Prismatic joint definition. This requires defining a line of
            /// motion using an axis and an anchor point. The definition uses local
            /// anchor points and a local axis so that the initial configuration
            /// can violate the constraint slightly. The joint translation is zero
            /// when the local anchor points coincide in world space. Using local
            /// anchors and a local axis helps when saving and loading a game.
            b2PrismaticJointDef = class b2PrismaticJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(b2Joint_1.b2JointType.e_prismaticJoint);
                    this.localAnchorA = new b2Math_1.b2Vec2();
                    this.localAnchorB = new b2Math_1.b2Vec2();
                    this.localAxisA = new b2Math_1.b2Vec2(1, 0);
                    this.referenceAngle = 0;
                    this.enableLimit = false;
                    this.lowerTranslation = 0;
                    this.upperTranslation = 0;
                    this.enableMotor = false;
                    this.maxMotorForce = 0;
                    this.motorSpeed = 0;
                }
                Initialize(bA, bB, anchor, axis) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.bodyA.GetLocalVector(axis, this.localAxisA);
                    this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
                }
            };
            exports_1("b2PrismaticJointDef", b2PrismaticJointDef);
            b2PrismaticJoint = class b2PrismaticJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    // Solver shared
                    this.m_localAnchorA = new b2Math_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_localXAxisA = new b2Math_1.b2Vec2();
                    this.m_localYAxisA = new b2Math_1.b2Vec2();
                    this.m_referenceAngle = 0;
                    this.m_impulse = new b2Math_1.b2Vec3(0, 0, 0);
                    this.m_motorImpulse = 0;
                    this.m_lowerTranslation = 0;
                    this.m_upperTranslation = 0;
                    this.m_maxMotorForce = 0;
                    this.m_motorSpeed = 0;
                    this.m_enableLimit = false;
                    this.m_enableMotor = false;
                    this.m_limitState = b2Joint_1.b2LimitState.e_inactiveLimit;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_localCenterA = new b2Math_1.b2Vec2();
                    this.m_localCenterB = new b2Math_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_axis = new b2Math_1.b2Vec2(0, 0);
                    this.m_perp = new b2Math_1.b2Vec2(0, 0);
                    this.m_s1 = 0;
                    this.m_s2 = 0;
                    this.m_a1 = 0;
                    this.m_a2 = 0;
                    this.m_K = new b2Math_1.b2Mat33();
                    this.m_K3 = new b2Math_1.b2Mat33();
                    this.m_K2 = new b2Math_1.b2Mat22();
                    this.m_motorMass = 0;
                    this.m_qA = new b2Math_1.b2Rot();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_lalcA = new b2Math_1.b2Vec2();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_rA = new b2Math_1.b2Vec2();
                    this.m_rB = new b2Math_1.b2Vec2();
                    this.m_localAnchorA.Copy(b2Settings_1.b2Maybe(def.localAnchorA, b2Math_1.b2Vec2.ZERO));
                    this.m_localAnchorB.Copy(b2Settings_1.b2Maybe(def.localAnchorB, b2Math_1.b2Vec2.ZERO));
                    this.m_localXAxisA.Copy(b2Settings_1.b2Maybe(def.localAxisA, new b2Math_1.b2Vec2(1, 0))).SelfNormalize();
                    b2Math_1.b2Vec2.CrossOneV(this.m_localXAxisA, this.m_localYAxisA);
                    this.m_referenceAngle = b2Settings_1.b2Maybe(def.referenceAngle, 0);
                    this.m_lowerTranslation = b2Settings_1.b2Maybe(def.lowerTranslation, 0);
                    this.m_upperTranslation = b2Settings_1.b2Maybe(def.upperTranslation, 0);
                    this.m_maxMotorForce = b2Settings_1.b2Maybe(def.maxMotorForce, 0);
                    this.m_motorSpeed = b2Settings_1.b2Maybe(def.motorSpeed, 0);
                    this.m_enableLimit = b2Settings_1.b2Maybe(def.enableLimit, false);
                    this.m_enableMotor = b2Settings_1.b2Maybe(def.enableMotor, false);
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
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    // Compute the effective masses.
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = (cB - cA) + rB - rA;
                    const d = b2Math_1.b2Vec2.AddVV(b2Math_1.b2Vec2.SubVV(cB, cA, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.SubVV(rB, rA, b2Math_1.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_d);
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // Compute motor Jacobian and effective mass.
                    {
                        // m_axis = b2Mul(qA, m_localXAxisA);
                        b2Math_1.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_axis);
                        // m_a1 = b2Cross(d + rA, m_axis);
                        this.m_a1 = b2Math_1.b2Vec2.CrossVV(b2Math_1.b2Vec2.AddVV(d, rA, b2Math_1.b2Vec2.s_t0), this.m_axis);
                        // m_a2 = b2Cross(rB, m_axis);
                        this.m_a2 = b2Math_1.b2Vec2.CrossVV(rB, this.m_axis);
                        this.m_motorMass = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
                        if (this.m_motorMass > 0) {
                            this.m_motorMass = 1 / this.m_motorMass;
                        }
                    }
                    // Prismatic constraint.
                    {
                        // m_perp = b2Mul(qA, m_localYAxisA);
                        b2Math_1.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_perp);
                        // m_s1 = b2Cross(d + rA, m_perp);
                        this.m_s1 = b2Math_1.b2Vec2.CrossVV(b2Math_1.b2Vec2.AddVV(d, rA, b2Math_1.b2Vec2.s_t0), this.m_perp);
                        // m_s2 = b2Cross(rB, m_perp);
                        this.m_s2 = b2Math_1.b2Vec2.CrossVV(rB, this.m_perp);
                        // float32 k11 = mA + mB + iA * m_s1 * m_s1 + iB * m_s2 * m_s2;
                        this.m_K.ex.x = mA + mB + iA * this.m_s1 * this.m_s1 + iB * this.m_s2 * this.m_s2;
                        // float32 k12 = iA * m_s1 + iB * m_s2;
                        this.m_K.ex.y = iA * this.m_s1 + iB * this.m_s2;
                        // float32 k13 = iA * m_s1 * m_a1 + iB * m_s2 * m_a2;
                        this.m_K.ex.z = iA * this.m_s1 * this.m_a1 + iB * this.m_s2 * this.m_a2;
                        this.m_K.ey.x = this.m_K.ex.y;
                        // float32 k22 = iA + iB;
                        this.m_K.ey.y = iA + iB;
                        if (this.m_K.ey.y === 0) {
                            // For bodies with fixed rotation.
                            this.m_K.ey.y = 1;
                        }
                        // float32 k23 = iA * m_a1 + iB * m_a2;
                        this.m_K.ey.z = iA * this.m_a1 + iB * this.m_a2;
                        this.m_K.ez.x = this.m_K.ex.z;
                        this.m_K.ez.y = this.m_K.ey.z;
                        // float32 k33 = mA + mB + iA * m_a1 * m_a1 + iB * m_a2 * m_a2;
                        this.m_K.ez.z = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
                        // m_K.ex.Set(k11, k12, k13);
                        // m_K.ey.Set(k12, k22, k23);
                        // m_K.ez.Set(k13, k23, k33);
                    }
                    // Compute motor and limit terms.
                    if (this.m_enableLimit) {
                        // float32 jointTranslation = b2Dot(m_axis, d);
                        const jointTranslation = b2Math_1.b2Vec2.DotVV(this.m_axis, d);
                        if (b2Math_1.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2Settings_1.b2_linearSlop) {
                            this.m_limitState = b2Joint_1.b2LimitState.e_equalLimits;
                        }
                        else if (jointTranslation <= this.m_lowerTranslation) {
                            if (this.m_limitState !== b2Joint_1.b2LimitState.e_atLowerLimit) {
                                this.m_limitState = b2Joint_1.b2LimitState.e_atLowerLimit;
                                this.m_impulse.z = 0;
                            }
                        }
                        else if (jointTranslation >= this.m_upperTranslation) {
                            if (this.m_limitState !== b2Joint_1.b2LimitState.e_atUpperLimit) {
                                this.m_limitState = b2Joint_1.b2LimitState.e_atUpperLimit;
                                this.m_impulse.z = 0;
                            }
                        }
                        else {
                            this.m_limitState = b2Joint_1.b2LimitState.e_inactiveLimit;
                            this.m_impulse.z = 0;
                        }
                    }
                    else {
                        this.m_limitState = b2Joint_1.b2LimitState.e_inactiveLimit;
                        this.m_impulse.z = 0;
                    }
                    if (!this.m_enableMotor) {
                        this.m_motorImpulse = 0;
                    }
                    if (data.step.warmStarting) {
                        // Account for variable time step.
                        // m_impulse *= data.step.dtRatio;
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        this.m_motorImpulse *= data.step.dtRatio;
                        // b2Vec2 P = m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis;
                        const P = b2Math_1.b2Vec2.AddVV(b2Math_1.b2Vec2.MulSV(this.m_impulse.x, this.m_perp, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.MulSV((this.m_motorImpulse + this.m_impulse.z), this.m_axis, b2Math_1.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_P);
                        // float32 LA = m_impulse.x * m_s1 + m_impulse.y + (m_motorImpulse + m_impulse.z) * m_a1;
                        const LA = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
                        // float32 LB = m_impulse.x * m_s2 + m_impulse.y + (m_motorImpulse + m_impulse.z) * m_a2;
                        const LB = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    else {
                        this.m_impulse.SetZero();
                        this.m_motorImpulse = 0;
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
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // Solve linear motor constraint.
                    if (this.m_enableMotor && this.m_limitState !== b2Joint_1.b2LimitState.e_equalLimits) {
                        // float32 Cdot = b2Dot(m_axis, vB - vA) + m_a2 * wB - m_a1 * wA;
                        const Cdot = b2Math_1.b2Vec2.DotVV(this.m_axis, b2Math_1.b2Vec2.SubVV(vB, vA, b2Math_1.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                        let impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorForce;
                        this.m_motorImpulse = b2Math_1.b2Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        // b2Vec2 P = impulse * m_axis;
                        const P = b2Math_1.b2Vec2.MulSV(impulse, this.m_axis, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        const LA = impulse * this.m_a1;
                        const LB = impulse * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    // b2Vec2 Cdot1;
                    // Cdot1.x = b2Dot(m_perp, vB - vA) + m_s2 * wB - m_s1 * wA;
                    const Cdot1_x = b2Math_1.b2Vec2.DotVV(this.m_perp, b2Math_1.b2Vec2.SubVV(vB, vA, b2Math_1.b2Vec2.s_t0)) + this.m_s2 * wB - this.m_s1 * wA;
                    // Cdot1.y = wB - wA;
                    const Cdot1_y = wB - wA;
                    if (this.m_enableLimit && this.m_limitState !== b2Joint_1.b2LimitState.e_inactiveLimit) {
                        // Solve prismatic and limit constraint in block form.
                        // float32 Cdot2;
                        // Cdot2 = b2Dot(m_axis, vB - vA) + m_a2 * wB - m_a1 * wA;
                        const Cdot2 = b2Math_1.b2Vec2.DotVV(this.m_axis, b2Math_1.b2Vec2.SubVV(vB, vA, b2Math_1.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                        // b2Vec3 Cdot(Cdot1.x, Cdot1.y, Cdot2);
                        // b2Vec3 f1 = m_impulse;
                        const f1 = b2PrismaticJoint.SolveVelocityConstraints_s_f1.Copy(this.m_impulse);
                        // b2Vec3 df =  m_K.Solve33(-Cdot);
                        const df3 = this.m_K.Solve33((-Cdot1_x), (-Cdot1_y), (-Cdot2), b2PrismaticJoint.SolveVelocityConstraints_s_df3);
                        // m_impulse += df;
                        this.m_impulse.SelfAdd(df3);
                        if (this.m_limitState === b2Joint_1.b2LimitState.e_atLowerLimit) {
                            this.m_impulse.z = b2Math_1.b2Max(this.m_impulse.z, 0);
                        }
                        else if (this.m_limitState === b2Joint_1.b2LimitState.e_atUpperLimit) {
                            this.m_impulse.z = b2Math_1.b2Min(this.m_impulse.z, 0);
                        }
                        // f2(1:2) = invK(1:2,1:2) * (-Cdot(1:2) - K(1:2,3) * (f2(3) - f1(3))) + f1(1:2)
                        // b2Vec2 b = -Cdot1 - (m_impulse.z - f1.z) * b2Vec2(m_K.ez.x, m_K.ez.y);
                        const b_x = (-Cdot1_x) - (this.m_impulse.z - f1.z) * this.m_K.ez.x;
                        const b_y = (-Cdot1_y) - (this.m_impulse.z - f1.z) * this.m_K.ez.y;
                        // b2Vec2 f2r = m_K.Solve22(b) + b2Vec2(f1.x, f1.y);
                        const f2r = this.m_K.Solve22(b_x, b_y, b2PrismaticJoint.SolveVelocityConstraints_s_f2r);
                        f2r.x += f1.x;
                        f2r.y += f1.y;
                        // m_impulse.x = f2r.x;
                        this.m_impulse.x = f2r.x;
                        // m_impulse.y = f2r.y;
                        this.m_impulse.y = f2r.y;
                        // df = m_impulse - f1;
                        df3.x = this.m_impulse.x - f1.x;
                        df3.y = this.m_impulse.y - f1.y;
                        df3.z = this.m_impulse.z - f1.z;
                        // b2Vec2 P = df.x * m_perp + df.z * m_axis;
                        const P = b2Math_1.b2Vec2.AddVV(b2Math_1.b2Vec2.MulSV(df3.x, this.m_perp, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.MulSV(df3.z, this.m_axis, b2Math_1.b2Vec2.s_t1), b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        // float32 LA = df.x * m_s1 + df.y + df.z * m_a1;
                        const LA = df3.x * this.m_s1 + df3.y + df3.z * this.m_a1;
                        // float32 LB = df.x * m_s2 + df.y + df.z * m_a2;
                        const LB = df3.x * this.m_s2 + df3.y + df3.z * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    else {
                        // Limit is inactive, just solve the prismatic constraint in block form.
                        // b2Vec2 df = m_K.Solve22(-Cdot1);
                        const df2 = this.m_K.Solve22((-Cdot1_x), (-Cdot1_y), b2PrismaticJoint.SolveVelocityConstraints_s_df2);
                        this.m_impulse.x += df2.x;
                        this.m_impulse.y += df2.y;
                        // b2Vec2 P = df.x * m_perp;
                        const P = b2Math_1.b2Vec2.MulSV(df2.x, this.m_perp, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        // float32 LA = df.x * m_s1 + df.y;
                        const LA = df2.x * this.m_s1 + df2.y;
                        // float32 LB = df.x * m_s2 + df.y;
                        const LB = df2.x * this.m_s2 + df2.y;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
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
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    const rA = b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    const rB = b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = cB + rB - cA - rA;
                    const d = b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVV(cB, rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVV(cA, rA, b2Math_1.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_d);
                    // b2Vec2 axis = b2Mul(qA, m_localXAxisA);
                    const axis = b2Math_1.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_axis);
                    // float32 a1 = b2Cross(d + rA, axis);
                    const a1 = b2Math_1.b2Vec2.CrossVV(b2Math_1.b2Vec2.AddVV(d, rA, b2Math_1.b2Vec2.s_t0), axis);
                    // float32 a2 = b2Cross(rB, axis);
                    const a2 = b2Math_1.b2Vec2.CrossVV(rB, axis);
                    // b2Vec2 perp = b2Mul(qA, m_localYAxisA);
                    const perp = b2Math_1.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_perp);
                    // float32 s1 = b2Cross(d + rA, perp);
                    const s1 = b2Math_1.b2Vec2.CrossVV(b2Math_1.b2Vec2.AddVV(d, rA, b2Math_1.b2Vec2.s_t0), perp);
                    // float32 s2 = b2Cross(rB, perp);
                    const s2 = b2Math_1.b2Vec2.CrossVV(rB, perp);
                    // b2Vec3 impulse;
                    let impulse = b2PrismaticJoint.SolvePositionConstraints_s_impulse;
                    // b2Vec2 C1;
                    // C1.x = b2Dot(perp, d);
                    const C1_x = b2Math_1.b2Vec2.DotVV(perp, d);
                    // C1.y = aB - aA - m_referenceAngle;
                    const C1_y = aB - aA - this.m_referenceAngle;
                    let linearError = b2Math_1.b2Abs(C1_x);
                    const angularError = b2Math_1.b2Abs(C1_y);
                    let active = false;
                    let C2 = 0;
                    if (this.m_enableLimit) {
                        // float32 translation = b2Dot(axis, d);
                        const translation = b2Math_1.b2Vec2.DotVV(axis, d);
                        if (b2Math_1.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2Settings_1.b2_linearSlop) {
                            // Prevent large angular corrections
                            C2 = b2Math_1.b2Clamp(translation, (-b2Settings_1.b2_maxLinearCorrection), b2Settings_1.b2_maxLinearCorrection);
                            linearError = b2Math_1.b2Max(linearError, b2Math_1.b2Abs(translation));
                            active = true;
                        }
                        else if (translation <= this.m_lowerTranslation) {
                            // Prevent large linear corrections and allow some slop.
                            C2 = b2Math_1.b2Clamp(translation - this.m_lowerTranslation + b2Settings_1.b2_linearSlop, (-b2Settings_1.b2_maxLinearCorrection), 0);
                            linearError = b2Math_1.b2Max(linearError, this.m_lowerTranslation - translation);
                            active = true;
                        }
                        else if (translation >= this.m_upperTranslation) {
                            // Prevent large linear corrections and allow some slop.
                            C2 = b2Math_1.b2Clamp(translation - this.m_upperTranslation - b2Settings_1.b2_linearSlop, 0, b2Settings_1.b2_maxLinearCorrection);
                            linearError = b2Math_1.b2Max(linearError, translation - this.m_upperTranslation);
                            active = true;
                        }
                    }
                    if (active) {
                        // float32 k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        // float32 k12 = iA * s1 + iB * s2;
                        const k12 = iA * s1 + iB * s2;
                        // float32 k13 = iA * s1 * a1 + iB * s2 * a2;
                        const k13 = iA * s1 * a1 + iB * s2 * a2;
                        // float32 k22 = iA + iB;
                        let k22 = iA + iB;
                        if (k22 === 0) {
                            // For fixed rotation
                            k22 = 1;
                        }
                        // float32 k23 = iA * a1 + iB * a2;
                        const k23 = iA * a1 + iB * a2;
                        // float32 k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;
                        const k33 = mA + mB + iA * a1 * a1 + iB * a2 * a2;
                        // b2Mat33 K;
                        const K = this.m_K3;
                        // K.ex.Set(k11, k12, k13);
                        K.ex.SetXYZ(k11, k12, k13);
                        // K.ey.Set(k12, k22, k23);
                        K.ey.SetXYZ(k12, k22, k23);
                        // K.ez.Set(k13, k23, k33);
                        K.ez.SetXYZ(k13, k23, k33);
                        // b2Vec3 C;
                        // C.x = C1.x;
                        // C.y = C1.y;
                        // C.z = C2;
                        // impulse = K.Solve33(-C);
                        impulse = K.Solve33((-C1_x), (-C1_y), (-C2), impulse);
                    }
                    else {
                        // float32 k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
                        // float32 k12 = iA * s1 + iB * s2;
                        const k12 = iA * s1 + iB * s2;
                        // float32 k22 = iA + iB;
                        let k22 = iA + iB;
                        if (k22 === 0) {
                            k22 = 1;
                        }
                        // b2Mat22 K;
                        const K2 = this.m_K2;
                        // K.ex.Set(k11, k12);
                        K2.ex.Set(k11, k12);
                        // K.ey.Set(k12, k22);
                        K2.ey.Set(k12, k22);
                        // b2Vec2 impulse1 = K.Solve(-C1);
                        const impulse1 = K2.Solve((-C1_x), (-C1_y), b2PrismaticJoint.SolvePositionConstraints_s_impulse1);
                        impulse.x = impulse1.x;
                        impulse.y = impulse1.y;
                        impulse.z = 0;
                    }
                    // b2Vec2 P = impulse.x * perp + impulse.z * axis;
                    const P = b2Math_1.b2Vec2.AddVV(b2Math_1.b2Vec2.MulSV(impulse.x, perp, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.MulSV(impulse.z, axis, b2Math_1.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_P);
                    // float32 LA = impulse.x * s1 + impulse.y + impulse.z * a1;
                    const LA = impulse.x * s1 + impulse.y + impulse.z * a1;
                    // float32 LB = impulse.x * s2 + impulse.y + impulse.z * a2;
                    const LB = impulse.x * s2 + impulse.y + impulse.z * a2;
                    // cA -= mA * P;
                    cA.SelfMulSub(mA, P);
                    aA -= iA * LA;
                    // cB += mB * P;
                    cB.SelfMulAdd(mB, P);
                    aB += iB * LB;
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return linearError <= b2Settings_1.b2_linearSlop && angularError <= b2Settings_1.b2_angularSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // return inv_dt * (m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis);
                    out.x = inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x);
                    out.y = inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y);
                    return out;
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_impulse.y;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetLocalAxisA() { return this.m_localXAxisA; }
                GetReferenceAngle() { return this.m_referenceAngle; }
                GetJointTranslation() {
                    // b2Vec2 pA = m_bodyA.GetWorldPoint(m_localAnchorA);
                    const pA = this.m_bodyA.GetWorldPoint(this.m_localAnchorA, b2PrismaticJoint.GetJointTranslation_s_pA);
                    // b2Vec2 pB = m_bodyB.GetWorldPoint(m_localAnchorB);
                    const pB = this.m_bodyB.GetWorldPoint(this.m_localAnchorB, b2PrismaticJoint.GetJointTranslation_s_pB);
                    // b2Vec2 d = pB - pA;
                    const d = b2Math_1.b2Vec2.SubVV(pB, pA, b2PrismaticJoint.GetJointTranslation_s_d);
                    // b2Vec2 axis = m_bodyA.GetWorldVector(m_localXAxisA);
                    const axis = this.m_bodyA.GetWorldVector(this.m_localXAxisA, b2PrismaticJoint.GetJointTranslation_s_axis);
                    // float32 translation = b2Dot(d, axis);
                    const translation = b2Math_1.b2Vec2.DotVV(d, axis);
                    return translation;
                }
                GetJointSpeed() {
                    const bA = this.m_bodyA;
                    const bB = this.m_bodyB;
                    // b2Vec2 rA = b2Mul(bA->m_xf.q, m_localAnchorA - bA->m_sweep.localCenter);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, bA.m_sweep.localCenter, this.m_lalcA);
                    const rA = b2Math_1.b2Rot.MulRV(bA.m_xf.q, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(bB->m_xf.q, m_localAnchorB - bB->m_sweep.localCenter);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, bB.m_sweep.localCenter, this.m_lalcB);
                    const rB = b2Math_1.b2Rot.MulRV(bB.m_xf.q, this.m_lalcB, this.m_rB);
                    // b2Vec2 pA = bA->m_sweep.c + rA;
                    const pA = b2Math_1.b2Vec2.AddVV(bA.m_sweep.c, rA, b2Math_1.b2Vec2.s_t0); // pA uses s_t0
                    // b2Vec2 pB = bB->m_sweep.c + rB;
                    const pB = b2Math_1.b2Vec2.AddVV(bB.m_sweep.c, rB, b2Math_1.b2Vec2.s_t1); // pB uses s_t1
                    // b2Vec2 d = pB - pA;
                    const d = b2Math_1.b2Vec2.SubVV(pB, pA, b2Math_1.b2Vec2.s_t2); // d uses s_t2
                    // b2Vec2 axis = b2Mul(bA.m_xf.q, m_localXAxisA);
                    const axis = bA.GetWorldVector(this.m_localXAxisA, this.m_axis);
                    const vA = bA.m_linearVelocity;
                    const vB = bB.m_linearVelocity;
                    const wA = bA.m_angularVelocity;
                    const wB = bB.m_angularVelocity;
                    // float32 speed = b2Dot(d, b2Cross(wA, axis)) + b2Dot(axis, vB + b2Cross(wB, rB) - vA - b2Cross(wA, rA));
                    const speed = b2Math_1.b2Vec2.DotVV(d, b2Math_1.b2Vec2.CrossSV(wA, axis, b2Math_1.b2Vec2.s_t0)) +
                        b2Math_1.b2Vec2.DotVV(axis, b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, rA, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t0));
                    return speed;
                }
                IsLimitEnabled() {
                    return this.m_enableLimit;
                }
                EnableLimit(flag) {
                    if (flag !== this.m_enableLimit) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_enableLimit = flag;
                        this.m_impulse.z = 0;
                    }
                }
                GetLowerLimit() {
                    return this.m_lowerTranslation;
                }
                GetUpperLimit() {
                    return this.m_upperTranslation;
                }
                SetLimits(lower, upper) {
                    if (lower !== this.m_lowerTranslation || upper !== this.m_upperTranslation) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_lowerTranslation = lower;
                        this.m_upperTranslation = upper;
                        this.m_impulse.z = 0;
                    }
                }
                IsMotorEnabled() {
                    return this.m_enableMotor;
                }
                EnableMotor(flag) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_enableMotor = flag;
                }
                SetMotorSpeed(speed) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_motorSpeed = speed;
                }
                GetMotorSpeed() {
                    return this.m_motorSpeed;
                }
                SetMaxMotorForce(force) {
                    this.m_bodyA.SetAwake(true);
                    this.m_bodyB.SetAwake(true);
                    this.m_maxMotorForce = force;
                }
                GetMaxMotorForce() { return this.m_maxMotorForce; }
                GetMotorForce(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2PrismaticJointDef = new b2PrismaticJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.localAxisA.Set(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
                    log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                    log("  jd.enableLimit = %s;\n", (this.m_enableLimit) ? ("true") : ("false"));
                    log("  jd.lowerTranslation = %.15f;\n", this.m_lowerTranslation);
                    log("  jd.upperTranslation = %.15f;\n", this.m_upperTranslation);
                    log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                    log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                    log("  jd.maxMotorForce = %.15f;\n", this.m_maxMotorForce);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
            };
            b2PrismaticJoint.InitVelocityConstraints_s_d = new b2Math_1.b2Vec2();
            b2PrismaticJoint.InitVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2PrismaticJoint.SolveVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2PrismaticJoint.SolveVelocityConstraints_s_f2r = new b2Math_1.b2Vec2();
            b2PrismaticJoint.SolveVelocityConstraints_s_f1 = new b2Math_1.b2Vec3();
            b2PrismaticJoint.SolveVelocityConstraints_s_df3 = new b2Math_1.b2Vec3();
            b2PrismaticJoint.SolveVelocityConstraints_s_df2 = new b2Math_1.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_d = new b2Math_1.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_impulse = new b2Math_1.b2Vec3();
            b2PrismaticJoint.SolvePositionConstraints_s_impulse1 = new b2Math_1.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_P = new b2Math_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_pA = new b2Math_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_pB = new b2Math_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_d = new b2Math_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_axis = new b2Math_1.b2Vec2();
            exports_1("b2PrismaticJoint", b2PrismaticJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQcmlzbWF0aWNKb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyUHJpc21hdGljSm9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQThCRixnRUFBZ0U7WUFDaEUsdUVBQXVFO1lBQ3ZFLG9FQUFvRTtZQUNwRSxzRUFBc0U7WUFDdEUscUVBQXFFO1lBQ3JFLGtFQUFrRTtZQUNsRSxzQkFBQSx5QkFBaUMsU0FBUSxvQkFBVTtnQkFxQmpEO29CQUNFLEtBQUssQ0FBQyxxQkFBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBckJ0QixpQkFBWSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBRXBDLGlCQUFZLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFFcEMsZUFBVSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFL0MsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBRTNCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO29CQUVwQixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7b0JBRTdCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztvQkFFN0IsZ0JBQVcsR0FBRyxLQUFLLENBQUM7b0JBRXBCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUUxQixlQUFVLEdBQVcsQ0FBQyxDQUFDO2dCQUk5QixDQUFDO2dCQUVNLFVBQVUsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLE1BQWMsRUFBRSxJQUFZO29CQUNwRSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0s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