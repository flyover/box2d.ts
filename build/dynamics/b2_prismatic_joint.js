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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_joint.js", "../common/b2_draw.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_joint_js_1, b2_draw_js_1, b2PrismaticJointDef, b2PrismaticJoint;
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
            function (b2_draw_js_1_1) {
                b2_draw_js_1 = b2_draw_js_1_1;
            }
        ],
        execute: function () {
            /// Prismatic joint definition. This requires defining a line of
            /// motion using an axis and an anchor point. The definition uses local
            /// anchor points and a local axis so that the initial configuration
            /// can violate the constraint slightly. The joint translation is zero
            /// when the local anchor points coincide in world space. Using local
            /// anchors and a local axis helps when saving and loading a game.
            b2PrismaticJointDef = class b2PrismaticJointDef extends b2_joint_js_1.b2JointDef {
                constructor() {
                    super(b2_joint_js_1.b2JointType.e_prismaticJoint);
                    this.localAnchorA = new b2_math_js_1.b2Vec2();
                    this.localAnchorB = new b2_math_js_1.b2Vec2();
                    this.localAxisA = new b2_math_js_1.b2Vec2(1, 0);
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
            // Linear constraint (point-to-line)
            // d = p2 - p1 = x2 + r2 - x1 - r1
            // C = dot(perp, d)
            // Cdot = dot(d, cross(w1, perp)) + dot(perp, v2 + cross(w2, r2) - v1 - cross(w1, r1))
            //      = -dot(perp, v1) - dot(cross(d + r1, perp), w1) + dot(perp, v2) + dot(cross(r2, perp), v2)
            // J = [-perp, -cross(d + r1, perp), perp, cross(r2,perp)]
            //
            // Angular constraint
            // C = a2 - a1 + a_initial
            // Cdot = w2 - w1
            // J = [0 0 -1 0 0 1]
            //
            // K = J * invM * JT
            //
            // J = [-a -s1 a s2]
            //     [0  -1  0  1]
            // a = perp
            // s1 = cross(d + r1, a) = cross(p2 - x1, a)
            // s2 = cross(r2, a) = cross(p2 - x2, a)
            // Motor/Limit linear constraint
            // C = dot(ax1, d)
            // Cdot = -dot(ax1, v1) - dot(cross(d + r1, ax1), w1) + dot(ax1, v2) + dot(cross(r2, ax1), v2)
            // J = [-ax1 -cross(d+r1,ax1) ax1 cross(r2,ax1)]
            // Predictive limit is applied even when the limit is not active.
            // Prevents a constraint speed that can lead to a constraint error in one time step.
            // Want C2 = C1 + h * Cdot >= 0
            // Or:
            // Cdot + C1/h >= 0
            // I do not apply a negative constraint error because that is handled in position correction.
            // So:
            // Cdot + max(C1, 0)/h >= 0
            // Block Solver
            // We develop a block solver that includes the angular and linear constraints. This makes the limit stiffer.
            //
            // The Jacobian has 2 rows:
            // J = [-uT -s1 uT s2] // linear
            //     [0   -1   0  1] // angular
            //
            // u = perp
            // s1 = cross(d + r1, u), s2 = cross(r2, u)
            // a1 = cross(d + r1, v), a2 = cross(r2, v)
            b2PrismaticJoint = class b2PrismaticJoint extends b2_joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_localAnchorA = new b2_math_js_1.b2Vec2();
                    this.m_localAnchorB = new b2_math_js_1.b2Vec2();
                    this.m_localXAxisA = new b2_math_js_1.b2Vec2();
                    this.m_localYAxisA = new b2_math_js_1.b2Vec2();
                    this.m_referenceAngle = 0;
                    this.m_impulse = new b2_math_js_1.b2Vec2(0, 0);
                    this.m_motorImpulse = 0;
                    this.m_lowerImpulse = 0;
                    this.m_upperImpulse = 0;
                    this.m_lowerTranslation = 0;
                    this.m_upperTranslation = 0;
                    this.m_maxMotorForce = 0;
                    this.m_motorSpeed = 0;
                    this.m_enableLimit = false;
                    this.m_enableMotor = false;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_localCenterA = new b2_math_js_1.b2Vec2();
                    this.m_localCenterB = new b2_math_js_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_axis = new b2_math_js_1.b2Vec2(0, 0);
                    this.m_perp = new b2_math_js_1.b2Vec2(0, 0);
                    this.m_s1 = 0;
                    this.m_s2 = 0;
                    this.m_a1 = 0;
                    this.m_a2 = 0;
                    this.m_K = new b2_math_js_1.b2Mat22();
                    this.m_K3 = new b2_math_js_1.b2Mat33();
                    this.m_K2 = new b2_math_js_1.b2Mat22();
                    this.m_translation = 0;
                    this.m_axialMass = 0;
                    this.m_qA = new b2_math_js_1.b2Rot();
                    this.m_qB = new b2_math_js_1.b2Rot();
                    this.m_lalcA = new b2_math_js_1.b2Vec2();
                    this.m_lalcB = new b2_math_js_1.b2Vec2();
                    this.m_rA = new b2_math_js_1.b2Vec2();
                    this.m_rB = new b2_math_js_1.b2Vec2();
                    this.m_localAnchorA.Copy(b2_settings_js_1.b2Maybe(def.localAnchorA, b2_math_js_1.b2Vec2.ZERO));
                    this.m_localAnchorB.Copy(b2_settings_js_1.b2Maybe(def.localAnchorB, b2_math_js_1.b2Vec2.ZERO));
                    this.m_localXAxisA.Copy(b2_settings_js_1.b2Maybe(def.localAxisA, new b2_math_js_1.b2Vec2(1, 0))).SelfNormalize();
                    b2_math_js_1.b2Vec2.CrossOneV(this.m_localXAxisA, this.m_localYAxisA);
                    this.m_referenceAngle = b2_settings_js_1.b2Maybe(def.referenceAngle, 0);
                    this.m_lowerTranslation = b2_settings_js_1.b2Maybe(def.lowerTranslation, 0);
                    this.m_upperTranslation = b2_settings_js_1.b2Maybe(def.upperTranslation, 0);
                    // b2Assert(this.m_lowerTranslation <= this.m_upperTranslation);
                    this.m_maxMotorForce = b2_settings_js_1.b2Maybe(def.maxMotorForce, 0);
                    this.m_motorSpeed = b2_settings_js_1.b2Maybe(def.motorSpeed, 0);
                    this.m_enableLimit = b2_settings_js_1.b2Maybe(def.enableLimit, false);
                    this.m_enableMotor = b2_settings_js_1.b2Maybe(def.enableMotor, false);
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
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = (cB - cA) + rB - rA;
                    const d = b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.SubVV(cB, cA, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(rB, rA, b2_math_js_1.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_d);
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // Compute motor Jacobian and effective mass.
                    {
                        // m_axis = b2Mul(qA, m_localXAxisA);
                        b2_math_js_1.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_axis);
                        // m_a1 = b2Cross(d + rA, m_axis);
                        this.m_a1 = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), this.m_axis);
                        // m_a2 = b2Cross(rB, m_axis);
                        this.m_a2 = b2_math_js_1.b2Vec2.CrossVV(rB, this.m_axis);
                        this.m_axialMass = mA + mB + iA * this.m_a1 * this.m_a1 + iB * this.m_a2 * this.m_a2;
                        if (this.m_axialMass > 0) {
                            this.m_axialMass = 1 / this.m_axialMass;
                        }
                    }
                    // Prismatic constraint.
                    {
                        // m_perp = b2Mul(qA, m_localYAxisA);
                        b2_math_js_1.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_perp);
                        // m_s1 = b2Cross(d + rA, m_perp);
                        this.m_s1 = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), this.m_perp);
                        // m_s2 = b2Cross(rB, m_perp);
                        this.m_s2 = b2_math_js_1.b2Vec2.CrossVV(rB, this.m_perp);
                        // float32 k11 = mA + mB + iA * m_s1 * m_s1 + iB * m_s2 * m_s2;
                        this.m_K.ex.x = mA + mB + iA * this.m_s1 * this.m_s1 + iB * this.m_s2 * this.m_s2;
                        // float32 k12 = iA * m_s1 + iB * m_s2;
                        this.m_K.ex.y = iA * this.m_s1 + iB * this.m_s2;
                        this.m_K.ey.x = this.m_K.ex.y;
                        // float32 k22 = iA + iB;
                        this.m_K.ey.y = iA + iB;
                        if (this.m_K.ey.y === 0) {
                            // For bodies with fixed rotation.
                            this.m_K.ey.y = 1;
                        }
                        // m_K.ex.Set(k11, k12);
                        // m_K.ey.Set(k12, k22);
                    }
                    // Compute motor and limit terms.
                    if (this.m_enableLimit) {
                        this.m_translation = b2_math_js_1.b2Vec2.DotVV(this.m_axis, d);
                    }
                    else {
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
                    }
                    if (!this.m_enableMotor) {
                        this.m_motorImpulse = 0;
                    }
                    if (data.step.warmStarting) {
                        // Account for variable time step.
                        // m_impulse *= data.step.dtRatio;
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        this.m_motorImpulse *= data.step.dtRatio;
                        this.m_lowerImpulse *= data.step.dtRatio;
                        this.m_upperImpulse *= data.step.dtRatio;
                        const axialImpulse = this.m_motorImpulse + this.m_lowerImpulse - this.m_upperImpulse;
                        // b2Vec2 P = m_impulse.x * m_perp + axialImpulse * m_axis;
                        const P = b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.MulSV(this.m_impulse.x, this.m_perp, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.MulSV(axialImpulse, this.m_axis, b2_math_js_1.b2Vec2.s_t1), b2PrismaticJoint.InitVelocityConstraints_s_P);
                        // float LA = m_impulse.x * m_s1 + m_impulse.y + axialImpulse * m_a1;
                        const LA = this.m_impulse.x * this.m_s1 + this.m_impulse.y + axialImpulse * this.m_a1;
                        // float LB = m_impulse.x * m_s2 + m_impulse.y + axialImpulse * m_a2;
                        const LB = this.m_impulse.x * this.m_s2 + this.m_impulse.y + axialImpulse * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    else {
                        this.m_impulse.SetZero();
                        this.m_motorImpulse = 0.0;
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
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
                    if (this.m_enableMotor) {
                        // float32 Cdot = b2Dot(m_axis, vB - vA) + m_a2 * wB - m_a1 * wA;
                        const Cdot = b2_math_js_1.b2Vec2.DotVV(this.m_axis, b2_math_js_1.b2Vec2.SubVV(vB, vA, b2_math_js_1.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                        let impulse = this.m_axialMass * (this.m_motorSpeed - Cdot);
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorForce;
                        this.m_motorImpulse = b2_math_js_1.b2Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        // b2Vec2 P = impulse * m_axis;
                        const P = b2_math_js_1.b2Vec2.MulSV(impulse, this.m_axis, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        const LA = impulse * this.m_a1;
                        const LB = impulse * this.m_a2;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    if (this.m_enableLimit) {
                        // Lower limit
                        {
                            const C = this.m_translation - this.m_lowerTranslation;
                            const Cdot = b2_math_js_1.b2Vec2.DotVV(this.m_axis, b2_math_js_1.b2Vec2.SubVV(vB, vA, b2_math_js_1.b2Vec2.s_t0)) + this.m_a2 * wB - this.m_a1 * wA;
                            let impulse = -this.m_axialMass * (Cdot + b2_math_js_1.b2Max(C, 0.0) * data.step.inv_dt);
                            const oldImpulse = this.m_lowerImpulse;
                            this.m_lowerImpulse = b2_math_js_1.b2Max(this.m_lowerImpulse + impulse, 0.0);
                            impulse = this.m_lowerImpulse - oldImpulse;
                            // b2Vec2 P = impulse * this.m_axis;
                            const P = b2_math_js_1.b2Vec2.MulSV(impulse, this.m_axis, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                            const LA = impulse * this.m_a1;
                            const LB = impulse * this.m_a2;
                            // vA -= mA * P;
                            vA.SelfMulSub(mA, P);
                            wA -= iA * LA;
                            // vB += mB * P;
                            vB.SelfMulAdd(mB, P);
                            wB += iB * LB;
                        }
                        // Upper limit
                        // Note: signs are flipped to keep C positive when the constraint is satisfied.
                        // This also keeps the impulse positive when the limit is active.
                        {
                            const C = this.m_upperTranslation - this.m_translation;
                            const Cdot = b2_math_js_1.b2Vec2.DotVV(this.m_axis, b2_math_js_1.b2Vec2.SubVV(vA, vB, b2_math_js_1.b2Vec2.s_t0)) + this.m_a1 * wA - this.m_a2 * wB;
                            let impulse = -this.m_axialMass * (Cdot + b2_math_js_1.b2Max(C, 0.0) * data.step.inv_dt);
                            const oldImpulse = this.m_upperImpulse;
                            this.m_upperImpulse = b2_math_js_1.b2Max(this.m_upperImpulse + impulse, 0.0);
                            impulse = this.m_upperImpulse - oldImpulse;
                            // b2Vec2 P = impulse * this.m_axis;
                            const P = b2_math_js_1.b2Vec2.MulSV(impulse, this.m_axis, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                            const LA = impulse * this.m_a1;
                            const LB = impulse * this.m_a2;
                            // vA += mA * P;
                            vA.SelfMulAdd(mA, P);
                            wA += iA * LA;
                            // vB -= mB * P;
                            vB.SelfMulSub(mB, P);
                            wB -= iB * LB;
                        }
                    }
                    // Solve the prismatic constraint in block form.
                    {
                        // b2Vec2 Cdot;
                        // Cdot.x = b2Dot(m_perp, vB - vA) + m_s2 * wB - m_s1 * wA;
                        const Cdot_x = b2_math_js_1.b2Vec2.DotVV(this.m_perp, b2_math_js_1.b2Vec2.SubVV(vB, vA, b2_math_js_1.b2Vec2.s_t0)) + this.m_s2 * wB - this.m_s1 * wA;
                        // Cdot.y = wB - wA;
                        const Cdot_y = wB - wA;
                        // b2Vec2 df = m_K.Solve(-Cdot);
                        const df = this.m_K.Solve(-Cdot_x, -Cdot_y, b2PrismaticJoint.SolveVelocityConstraints_s_df);
                        // m_impulse += df;
                        this.m_impulse.SelfAdd(df);
                        // b2Vec2 P = df.x * m_perp;
                        const P = b2_math_js_1.b2Vec2.MulSV(df.x, this.m_perp, b2PrismaticJoint.SolveVelocityConstraints_s_P);
                        // float32 LA = df.x * m_s1 + df.y;
                        const LA = df.x * this.m_s1 + df.y;
                        // float32 LB = df.x * m_s2 + df.y;
                        const LB = df.x * this.m_s2 + df.y;
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
                    const rA = b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    const rB = b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 d = cB + rB - cA - rA;
                    const d = b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVV(cB, rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVV(cA, rA, b2_math_js_1.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_d);
                    // b2Vec2 axis = b2Mul(qA, m_localXAxisA);
                    const axis = b2_math_js_1.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_axis);
                    // float32 a1 = b2Cross(d + rA, axis);
                    const a1 = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), axis);
                    // float32 a2 = b2Cross(rB, axis);
                    const a2 = b2_math_js_1.b2Vec2.CrossVV(rB, axis);
                    // b2Vec2 perp = b2Mul(qA, m_localYAxisA);
                    const perp = b2_math_js_1.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_perp);
                    // float32 s1 = b2Cross(d + rA, perp);
                    const s1 = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), perp);
                    // float32 s2 = b2Cross(rB, perp);
                    const s2 = b2_math_js_1.b2Vec2.CrossVV(rB, perp);
                    // b2Vec3 impulse;
                    let impulse = b2PrismaticJoint.SolvePositionConstraints_s_impulse;
                    // b2Vec2 C1;
                    // C1.x = b2Dot(perp, d);
                    const C1_x = b2_math_js_1.b2Vec2.DotVV(perp, d);
                    // C1.y = aB - aA - m_referenceAngle;
                    const C1_y = aB - aA - this.m_referenceAngle;
                    let linearError = b2_math_js_1.b2Abs(C1_x);
                    const angularError = b2_math_js_1.b2Abs(C1_y);
                    let active = false;
                    let C2 = 0;
                    if (this.m_enableLimit) {
                        // float32 translation = b2Dot(axis, d);
                        const translation = b2_math_js_1.b2Vec2.DotVV(axis, d);
                        if (b2_math_js_1.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2 * b2_settings_js_1.b2_linearSlop) {
                            C2 = translation;
                            linearError = b2_math_js_1.b2Max(linearError, b2_math_js_1.b2Abs(translation));
                            active = true;
                        }
                        else if (translation <= this.m_lowerTranslation) {
                            C2 = b2_math_js_1.b2Min(translation - this.m_lowerTranslation, 0.0);
                            linearError = b2_math_js_1.b2Max(linearError, this.m_lowerTranslation - translation);
                            active = true;
                        }
                        else if (translation >= this.m_upperTranslation) {
                            C2 = b2_math_js_1.b2Max(translation - this.m_upperTranslation, 0.0);
                            linearError = b2_math_js_1.b2Max(linearError, translation - this.m_upperTranslation);
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
                    const P = b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.MulSV(impulse.x, perp, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.MulSV(impulse.z, axis, b2_math_js_1.b2Vec2.s_t1), b2PrismaticJoint.SolvePositionConstraints_s_P);
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
                    return linearError <= b2_settings_js_1.b2_linearSlop && angularError <= b2_settings_js_1.b2_angularSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // return inv_dt * (m_impulse.x * m_perp + (m_motorImpulse + m_impulse.z) * m_axis);
                    out.x = inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_lowerImpulse + this.m_upperImpulse) * this.m_axis.x);
                    out.y = inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_lowerImpulse + this.m_upperImpulse) * this.m_axis.y);
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
                    const d = b2_math_js_1.b2Vec2.SubVV(pB, pA, b2PrismaticJoint.GetJointTranslation_s_d);
                    // b2Vec2 axis = m_bodyA.GetWorldVector(m_localXAxisA);
                    const axis = this.m_bodyA.GetWorldVector(this.m_localXAxisA, b2PrismaticJoint.GetJointTranslation_s_axis);
                    // float32 translation = b2Dot(d, axis);
                    const translation = b2_math_js_1.b2Vec2.DotVV(d, axis);
                    return translation;
                }
                GetJointSpeed() {
                    const bA = this.m_bodyA;
                    const bB = this.m_bodyB;
                    // b2Vec2 rA = b2Mul(bA->m_xf.q, m_localAnchorA - bA->m_sweep.localCenter);
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, bA.m_sweep.localCenter, this.m_lalcA);
                    const rA = b2_math_js_1.b2Rot.MulRV(bA.m_xf.q, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(bB->m_xf.q, m_localAnchorB - bB->m_sweep.localCenter);
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, bB.m_sweep.localCenter, this.m_lalcB);
                    const rB = b2_math_js_1.b2Rot.MulRV(bB.m_xf.q, this.m_lalcB, this.m_rB);
                    // b2Vec2 pA = bA->m_sweep.c + rA;
                    const pA = b2_math_js_1.b2Vec2.AddVV(bA.m_sweep.c, rA, b2_math_js_1.b2Vec2.s_t0); // pA uses s_t0
                    // b2Vec2 pB = bB->m_sweep.c + rB;
                    const pB = b2_math_js_1.b2Vec2.AddVV(bB.m_sweep.c, rB, b2_math_js_1.b2Vec2.s_t1); // pB uses s_t1
                    // b2Vec2 d = pB - pA;
                    const d = b2_math_js_1.b2Vec2.SubVV(pB, pA, b2_math_js_1.b2Vec2.s_t2); // d uses s_t2
                    // b2Vec2 axis = b2Mul(bA.m_xf.q, m_localXAxisA);
                    const axis = bA.GetWorldVector(this.m_localXAxisA, this.m_axis);
                    const vA = bA.m_linearVelocity;
                    const vB = bB.m_linearVelocity;
                    const wA = bA.m_angularVelocity;
                    const wB = bB.m_angularVelocity;
                    // float32 speed = b2Dot(d, b2Cross(wA, axis)) + b2Dot(axis, vB + b2Cross(wB, rB) - vA - b2Cross(wA, rA));
                    const speed = b2_math_js_1.b2Vec2.DotVV(d, b2_math_js_1.b2Vec2.CrossSV(wA, axis, b2_math_js_1.b2Vec2.s_t0)) +
                        b2_math_js_1.b2Vec2.DotVV(axis, b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, rA, b2_math_js_1.b2Vec2.s_t1), b2_math_js_1.b2Vec2.s_t0));
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
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
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
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
                    }
                }
                IsMotorEnabled() {
                    return this.m_enableMotor;
                }
                EnableMotor(flag) {
                    if (flag !== this.m_enableMotor) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_enableMotor = flag;
                    }
                }
                SetMotorSpeed(speed) {
                    if (speed !== this.m_motorSpeed) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_motorSpeed = speed;
                    }
                }
                GetMotorSpeed() {
                    return this.m_motorSpeed;
                }
                SetMaxMotorForce(force) {
                    if (force !== this.m_maxMotorForce) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_maxMotorForce = force;
                    }
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
                // private static Draw_s_perp = new b2Vec2();
                Draw(draw) {
                    const xfA = this.m_bodyA.GetTransform();
                    const xfB = this.m_bodyB.GetTransform();
                    const pA = b2_math_js_1.b2Transform.MulXV(xfA, this.m_localAnchorA, b2PrismaticJoint.Draw_s_pA);
                    const pB = b2_math_js_1.b2Transform.MulXV(xfB, this.m_localAnchorB, b2PrismaticJoint.Draw_s_pB);
                    // b2Vec2 axis = b2Mul(xfA.q, m_localXAxisA);
                    const axis = b2_math_js_1.b2Rot.MulRV(xfA.q, this.m_localXAxisA, b2PrismaticJoint.Draw_s_axis);
                    const c1 = b2PrismaticJoint.Draw_s_c1; // b2Color c1(0.7f, 0.7f, 0.7f);
                    // const c2 = b2PrismaticJoint.Draw_s_c2; // b2Color c2(0.3f, 0.9f, 0.3f);
                    // const c3 = b2PrismaticJoint.Draw_s_c3; // b2Color c3(0.9f, 0.3f, 0.3f);
                    const c4 = b2PrismaticJoint.Draw_s_c4; // b2Color c4(0.3f, 0.3f, 0.9f);
                    const c5 = b2PrismaticJoint.Draw_s_c5; // b2Color c5(0.4f, 0.4f, 0.4f);
                    draw.DrawSegment(pA, pB, c5);
                    if (this.m_enableLimit) {
                        // b2Vec2 lower = pA + m_lowerTranslation * axis;
                        const lower = b2PrismaticJoint.Draw_s_lower.Copy(pA).SelfAdd(b2_math_js_1.b2Vec2.MulSV(this.m_lowerTranslation, axis, b2_math_js_1.b2Vec2.s_t0));
                        // b2Vec2 upper = pA + m_upperTranslation * axis;
                        const upper = b2PrismaticJoint.Draw_s_upper.Copy(pA).SelfAdd(b2_math_js_1.b2Vec2.MulSV(this.m_upperTranslation, axis, b2_math_js_1.b2Vec2.s_t0));
                        // b2Vec2 perp = b2Mul(xfA.q, m_localYAxisA);
                        // const perp = b2Rot.MulRV(xfA.q, this.m_localYAxisA, b2PrismaticJoint.Draw_s_perp);
                        draw.DrawSegment(lower, upper, c1);
                        // draw.DrawSegment(lower - 0.5 * perp, lower + 0.5 * perp, c2);
                        // draw.DrawSegment(upper - 0.5 * perp, upper + 0.5 * perp, c3);
                    }
                    else {
                        // draw.DrawSegment(pA - 1.0 * axis, pA + 1.0 * axis, c1);
                    }
                    draw.DrawPoint(pA, 5.0, c1);
                    draw.DrawPoint(pB, 5.0, c4);
                }
            };
            exports_1("b2PrismaticJoint", b2PrismaticJoint);
            b2PrismaticJoint.InitVelocityConstraints_s_d = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.InitVelocityConstraints_s_P = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.SolveVelocityConstraints_s_P = new b2_math_js_1.b2Vec2();
            // private static SolveVelocityConstraints_s_f2r = new b2Vec2();
            // private static SolveVelocityConstraints_s_f1 = new b2Vec3();
            // private static SolveVelocityConstraints_s_df3 = new b2Vec3();
            b2PrismaticJoint.SolveVelocityConstraints_s_df = new b2_math_js_1.b2Vec2();
            // A velocity based solver computes reaction forces(impulses) using the velocity constraint solver.Under this context,
            // the position solver is not there to resolve forces.It is only there to cope with integration error.
            //
            // Therefore, the pseudo impulses in the position solver do not have any physical meaning.Thus it is okay if they suck.
            //
            // We could take the active state from the velocity solver.However, the joint might push past the limit when the velocity
            // solver indicates the limit is inactive.
            b2PrismaticJoint.SolvePositionConstraints_s_d = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_impulse = new b2_math_js_1.b2Vec3();
            b2PrismaticJoint.SolvePositionConstraints_s_impulse1 = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.SolvePositionConstraints_s_P = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_pA = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_pB = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_d = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.GetJointTranslation_s_axis = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.Draw_s_pA = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.Draw_s_pB = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.Draw_s_axis = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.Draw_s_c1 = new b2_draw_js_1.b2Color(0.7, 0.7, 0.7);
            // private static Draw_s_c2 = new b2Color(0.3, 0.9, 0.3);
            // private static Draw_s_c3 = new b2Color(0.9, 0.3, 0.3);
            b2PrismaticJoint.Draw_s_c4 = new b2_draw_js_1.b2Color(0.3, 0.3, 0.9);
            b2PrismaticJoint.Draw_s_c5 = new b2_draw_js_1.b2Color(0.4, 0.4, 0.4);
            b2PrismaticJoint.Draw_s_lower = new b2_math_js_1.b2Vec2();
            b2PrismaticJoint.Draw_s_upper = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfcHJpc21hdGljX2pvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R5bmFtaWNzL2IyX3ByaXNtYXRpY19qb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBK0JGLGdFQUFnRTtZQUNoRSx1RUFBdUU7WUFDdkUsb0VBQW9FO1lBQ3BFLHNFQUFzRTtZQUN0RSxxRUFBcUU7WUFDckUsa0VBQWtFO1lBQ2xFLHNCQUFBLE1BQWEsbUJBQW9CLFNBQVEsd0JBQVU7Z0JBcUJqRDtvQkFDRSxLQUFLLENBQUMseUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQXJCdEIsaUJBQVksR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFFcEMsaUJBQVksR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFFcEMsZUFBVSxHQUFXLElBQUksbUJBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRS9DLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUUzQixnQkFBVyxHQUFHLEtBQUssQ0FBQztvQkFFcEIscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO29CQUU3QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7b0JBRTdCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO29CQUVwQixrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFFMUIsZUFBVSxHQUFXLENBQUMsQ0FBQztnQkFJOUIsQ0FBQztnQkFFTSxVQUFVLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxNQUFjLEVBQUUsSUFBWTtvQkFDcEUsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNwRCxJ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