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
    var b2_settings_js_1, b2_math_js_1, b2_joint_js_1, b2_draw_js_1, b2WheelJointDef, b2WheelJoint;
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
            /// Wheel joint definition. This requires defining a line of
            /// motion using an axis and an anchor point. The definition uses local
            /// anchor points and a local axis so that the initial configuration
            /// can violate the constraint slightly. The joint translation is zero
            /// when the local anchor points coincide in world space. Using local
            /// anchors and a local axis helps when saving and loading a game.
            b2WheelJointDef = class b2WheelJointDef extends b2_joint_js_1.b2JointDef {
                constructor() {
                    super(b2_joint_js_1.b2JointType.e_wheelJoint);
                    this.localAnchorA = new b2_math_js_1.b2Vec2(0, 0);
                    this.localAnchorB = new b2_math_js_1.b2Vec2(0, 0);
                    this.localAxisA = new b2_math_js_1.b2Vec2(1, 0);
                    this.enableLimit = false;
                    this.lowerTranslation = 0;
                    this.upperTranslation = 0;
                    this.enableMotor = false;
                    this.maxMotorTorque = 0;
                    this.motorSpeed = 0;
                    this.stiffness = 0;
                    this.damping = 0;
                }
                Initialize(bA, bB, anchor, axis) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.bodyA.GetLocalVector(axis, this.localAxisA);
                }
            };
            exports_1("b2WheelJointDef", b2WheelJointDef);
            b2WheelJoint = class b2WheelJoint extends b2_joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_localAnchorA = new b2_math_js_1.b2Vec2();
                    this.m_localAnchorB = new b2_math_js_1.b2Vec2();
                    this.m_localXAxisA = new b2_math_js_1.b2Vec2();
                    this.m_localYAxisA = new b2_math_js_1.b2Vec2();
                    this.m_impulse = 0;
                    this.m_motorImpulse = 0;
                    this.m_springImpulse = 0;
                    this.m_lowerImpulse = 0;
                    this.m_upperImpulse = 0;
                    this.m_translation = 0;
                    this.m_lowerTranslation = 0;
                    this.m_upperTranslation = 0;
                    this.m_maxMotorTorque = 0;
                    this.m_motorSpeed = 0;
                    this.m_enableLimit = false;
                    this.m_enableMotor = false;
                    this.m_stiffness = 0;
                    this.m_damping = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_localCenterA = new b2_math_js_1.b2Vec2();
                    this.m_localCenterB = new b2_math_js_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_ax = new b2_math_js_1.b2Vec2();
                    this.m_ay = new b2_math_js_1.b2Vec2();
                    this.m_sAx = 0;
                    this.m_sBx = 0;
                    this.m_sAy = 0;
                    this.m_sBy = 0;
                    this.m_mass = 0;
                    this.m_motorMass = 0;
                    this.m_axialMass = 0;
                    this.m_springMass = 0;
                    this.m_bias = 0;
                    this.m_gamma = 0;
                    this.m_qA = new b2_math_js_1.b2Rot();
                    this.m_qB = new b2_math_js_1.b2Rot();
                    this.m_lalcA = new b2_math_js_1.b2Vec2();
                    this.m_lalcB = new b2_math_js_1.b2Vec2();
                    this.m_rA = new b2_math_js_1.b2Vec2();
                    this.m_rB = new b2_math_js_1.b2Vec2();
                    this.m_localAnchorA.Copy(b2_settings_js_1.b2Maybe(def.localAnchorA, b2_math_js_1.b2Vec2.ZERO));
                    this.m_localAnchorB.Copy(b2_settings_js_1.b2Maybe(def.localAnchorB, b2_math_js_1.b2Vec2.ZERO));
                    this.m_localXAxisA.Copy(b2_settings_js_1.b2Maybe(def.localAxisA, b2_math_js_1.b2Vec2.UNITX));
                    b2_math_js_1.b2Vec2.CrossOneV(this.m_localXAxisA, this.m_localYAxisA);
                    this.m_lowerTranslation = b2_settings_js_1.b2Maybe(def.lowerTranslation, 0);
                    this.m_upperTranslation = b2_settings_js_1.b2Maybe(def.upperTranslation, 0);
                    this.m_enableLimit = b2_settings_js_1.b2Maybe(def.enableLimit, false);
                    this.m_maxMotorTorque = b2_settings_js_1.b2Maybe(def.maxMotorTorque, 0);
                    this.m_motorSpeed = b2_settings_js_1.b2Maybe(def.motorSpeed, 0);
                    this.m_enableMotor = b2_settings_js_1.b2Maybe(def.enableMotor, false);
                    this.m_ax.SetZero();
                    this.m_ay.SetZero();
                    this.m_stiffness = b2_settings_js_1.b2Maybe(def.stiffness, 0);
                    this.m_damping = b2_settings_js_1.b2Maybe(def.damping, 0);
                }
                GetMotorSpeed() {
                    return this.m_motorSpeed;
                }
                GetMaxMotorTorque() {
                    return this.m_maxMotorTorque;
                }
                SetSpringFrequencyHz(hz) {
                    this.m_stiffness = hz;
                }
                GetSpringFrequencyHz() {
                    return this.m_stiffness;
                }
                SetSpringDampingRatio(ratio) {
                    this.m_damping = ratio;
                }
                GetSpringDampingRatio() {
                    return this.m_damping;
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
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
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
                    // b2Vec2 d = cB + rB - cA - rA;
                    const d = b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVV(cB, rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVV(cA, rA, b2_math_js_1.b2Vec2.s_t1), b2WheelJoint.InitVelocityConstraints_s_d);
                    // Point to line constraint
                    {
                        // m_ay = b2Mul(qA, m_localYAxisA);
                        b2_math_js_1.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_ay);
                        // m_sAy = b2Cross(d + rA, m_ay);
                        this.m_sAy = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), this.m_ay);
                        // m_sBy = b2Cross(rB, m_ay);
                        this.m_sBy = b2_math_js_1.b2Vec2.CrossVV(rB, this.m_ay);
                        this.m_mass = mA + mB + iA * this.m_sAy * this.m_sAy + iB * this.m_sBy * this.m_sBy;
                        if (this.m_mass > 0) {
                            this.m_mass = 1 / this.m_mass;
                        }
                    }
                    // Spring constraint
                    b2_math_js_1.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_ax); // m_ax = b2Mul(qA, m_localXAxisA);
                    this.m_sAx = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), this.m_ax);
                    this.m_sBx = b2_math_js_1.b2Vec2.CrossVV(rB, this.m_ax);
                    const invMass = mA + mB + iA * this.m_sAx * this.m_sAx + iB * this.m_sBx * this.m_sBx;
                    if (invMass > 0.0) {
                        this.m_axialMass = 1.0 / invMass;
                    }
                    else {
                        this.m_axialMass = 0.0;
                    }
                    this.m_springMass = 0;
                    this.m_bias = 0;
                    this.m_gamma = 0;
                    if (this.m_stiffness > 0.0 && invMass > 0.0) {
                        this.m_springMass = 1.0 / invMass;
                        const C = b2_math_js_1.b2Vec2.DotVV(d, this.m_ax);
                        // magic formulas
                        const h = data.step.dt;
                        this.m_gamma = h * (this.m_damping + h * this.m_stiffness);
                        if (this.m_gamma > 0.0) {
                            this.m_gamma = 1.0 / this.m_gamma;
                        }
                        this.m_bias = C * h * this.m_stiffness * this.m_gamma;
                        this.m_springMass = invMass + this.m_gamma;
                        if (this.m_springMass > 0.0) {
                            this.m_springMass = 1.0 / this.m_springMass;
                        }
                    }
                    else {
                        this.m_springImpulse = 0.0;
                    }
                    if (this.m_enableLimit) {
                        this.m_translation = b2_math_js_1.b2Vec2.DotVV(this.m_ax, d);
                    }
                    else {
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
                    }
                    if (this.m_enableMotor) {
                        this.m_motorMass = iA + iB;
                        if (this.m_motorMass > 0) {
                            this.m_motorMass = 1 / this.m_motorMass;
                        }
                    }
                    else {
                        this.m_motorMass = 0;
                        this.m_motorImpulse = 0;
                    }
                    if (data.step.warmStarting) {
                        // Account for variable time step.
                        this.m_impulse *= data.step.dtRatio;
                        this.m_springImpulse *= data.step.dtRatio;
                        this.m_motorImpulse *= data.step.dtRatio;
                        const axialImpulse = this.m_springImpulse + this.m_lowerImpulse - this.m_upperImpulse;
                        // b2Vec2 P = m_impulse * m_ay + m_springImpulse * m_ax;
                        const P = b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.MulSV(this.m_impulse, this.m_ay, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.MulSV(axialImpulse, this.m_ax, b2_math_js_1.b2Vec2.s_t1), b2WheelJoint.InitVelocityConstraints_s_P);
                        // float32 LA = m_impulse * m_sAy + m_springImpulse * m_sAx + m_motorImpulse;
                        const LA = this.m_impulse * this.m_sAy + axialImpulse * this.m_sAx + this.m_motorImpulse;
                        // float32 LB = m_impulse * m_sBy + m_springImpulse * m_sBx + m_motorImpulse;
                        const LB = this.m_impulse * this.m_sBy + axialImpulse * this.m_sBx + this.m_motorImpulse;
                        // vA -= m_invMassA * P;
                        vA.SelfMulSub(this.m_invMassA, P);
                        wA -= this.m_invIA * LA;
                        // vB += m_invMassB * P;
                        vB.SelfMulAdd(this.m_invMassB, P);
                        wB += this.m_invIB * LB;
                    }
                    else {
                        this.m_impulse = 0;
                        this.m_springImpulse = 0;
                        this.m_motorImpulse = 0;
                        this.m_lowerImpulse = 0;
                        this.m_upperImpulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // Solve spring constraint
                    {
                        const Cdot = b2_math_js_1.b2Vec2.DotVV(this.m_ax, b2_math_js_1.b2Vec2.SubVV(vB, vA, b2_math_js_1.b2Vec2.s_t0)) + this.m_sBx * wB - this.m_sAx * wA;
                        const impulse = -this.m_springMass * (Cdot + this.m_bias + this.m_gamma * this.m_springImpulse);
                        this.m_springImpulse += impulse;
                        // b2Vec2 P = impulse * m_ax;
                        const P = b2_math_js_1.b2Vec2.MulSV(impulse, this.m_ax, b2WheelJoint.SolveVelocityConstraints_s_P);
                        const LA = impulse * this.m_sAx;
                        const LB = impulse * this.m_sBx;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * LA;
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * LB;
                    }
                    // Solve rotational motor constraint
                    {
                        const Cdot = wB - wA - this.m_motorSpeed;
                        let impulse = -this.m_motorMass * Cdot;
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorTorque;
                        this.m_motorImpulse = b2_math_js_1.b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    if (this.m_enableLimit) {
                        // Lower limit
                        {
                            const C = this.m_translation - this.m_lowerTranslation;
                            const Cdot = b2_math_js_1.b2Vec2.DotVV(this.m_ax, b2_math_js_1.b2Vec2.SubVV(vB, vA, b2_math_js_1.b2Vec2.s_t0)) + this.m_sBx * wB - this.m_sAx * wA;
                            let impulse = -this.m_axialMass * (Cdot + b2_math_js_1.b2Max(C, 0.0) * data.step.inv_dt);
                            const oldImpulse = this.m_lowerImpulse;
                            this.m_lowerImpulse = b2_math_js_1.b2Max(this.m_lowerImpulse + impulse, 0.0);
                            impulse = this.m_lowerImpulse - oldImpulse;
                            // b2Vec2 P = impulse * this.m_ax;
                            const P = b2_math_js_1.b2Vec2.MulSV(impulse, this.m_ax, b2WheelJoint.SolveVelocityConstraints_s_P);
                            const LA = impulse * this.m_sAx;
                            const LB = impulse * this.m_sBx;
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
                            const Cdot = b2_math_js_1.b2Vec2.DotVV(this.m_ax, b2_math_js_1.b2Vec2.SubVV(vA, vB, b2_math_js_1.b2Vec2.s_t0)) + this.m_sAx * wA - this.m_sBx * wB;
                            let impulse = -this.m_axialMass * (Cdot + b2_math_js_1.b2Max(C, 0.0) * data.step.inv_dt);
                            const oldImpulse = this.m_upperImpulse;
                            this.m_upperImpulse = b2_math_js_1.b2Max(this.m_upperImpulse + impulse, 0.0);
                            impulse = this.m_upperImpulse - oldImpulse;
                            // b2Vec2 P = impulse * this.m_ax;
                            const P = b2_math_js_1.b2Vec2.MulSV(impulse, this.m_ax, b2WheelJoint.SolveVelocityConstraints_s_P);
                            const LA = impulse * this.m_sAx;
                            const LB = impulse * this.m_sBx;
                            // vA += mA * P;
                            vA.SelfMulAdd(mA, P);
                            wA += iA * LA;
                            // vB -= mB * P;
                            vB.SelfMulSub(mB, P);
                            wB -= iB * LB;
                        }
                    }
                    // Solve point to line constraint
                    {
                        const Cdot = b2_math_js_1.b2Vec2.DotVV(this.m_ay, b2_math_js_1.b2Vec2.SubVV(vB, vA, b2_math_js_1.b2Vec2.s_t0)) + this.m_sBy * wB - this.m_sAy * wA;
                        const impulse = -this.m_mass * Cdot;
                        this.m_impulse += impulse;
                        // b2Vec2 P = impulse * m_ay;
                        const P = b2_math_js_1.b2Vec2.MulSV(impulse, this.m_ay, b2WheelJoint.SolveVelocityConstraints_s_P);
                        const LA = impulse * this.m_sAy;
                        const LB = impulse * this.m_sBy;
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
                    // const qA: b2Rot = this.m_qA.SetAngle(aA), qB: b2Rot = this.m_qB.SetAngle(aB);
                    // // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    // b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    // const rA: b2Vec2 = b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    // b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    // const rB: b2Vec2 = b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // // b2Vec2 d = (cB - cA) + rB - rA;
                    // const d: b2Vec2 = b2Vec2.AddVV(
                    //   b2Vec2.SubVV(cB, cA, b2Vec2.s_t0),
                    //   b2Vec2.SubVV(rB, rA, b2Vec2.s_t1),
                    //   b2WheelJoint.SolvePositionConstraints_s_d);
                    // // b2Vec2 ay = b2Mul(qA, m_localYAxisA);
                    // const ay: b2Vec2 = b2Rot.MulRV(qA, this.m_localYAxisA, this.m_ay);
                    // // float32 sAy = b2Cross(d + rA, ay);
                    // const sAy = b2Vec2.CrossVV(b2Vec2.AddVV(d, rA, b2Vec2.s_t0), ay);
                    // // float32 sBy = b2Cross(rB, ay);
                    // const sBy = b2Vec2.CrossVV(rB, ay);
                    // // float32 C = b2Dot(d, ay);
                    // const C: number = b2Vec2.DotVV(d, this.m_ay);
                    // const k: number = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy;
                    // let impulse: number;
                    // if (k !== 0) {
                    //   impulse = - C / k;
                    // } else {
                    //   impulse = 0;
                    // }
                    // // b2Vec2 P = impulse * ay;
                    // const P: b2Vec2 = b2Vec2.MulSV(impulse, ay, b2WheelJoint.SolvePositionConstraints_s_P);
                    // const LA: number = impulse * sAy;
                    // const LB: number = impulse * sBy;
                    // // cA -= m_invMassA * P;
                    // cA.SelfMulSub(this.m_invMassA, P);
                    // aA -= this.m_invIA * LA;
                    // // cB += m_invMassB * P;
                    // cB.SelfMulAdd(this.m_invMassB, P);
                    // aB += this.m_invIB * LB;
                    let linearError = 0.0;
                    if (this.m_enableLimit) {
                        // b2Rot qA(aA), qB(aB);
                        const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                        // b2Vec2 rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
                        // b2Vec2 rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
                        // b2Vec2 d = (cB - cA) + rB - rA;
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                        const rA = b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                        const rB = b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                        // b2Vec2 d = (cB - cA) + rB - rA;
                        const d = b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.SubVV(cB, cA, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(rB, rA, b2_math_js_1.b2Vec2.s_t1), b2WheelJoint.SolvePositionConstraints_s_d);
                        // b2Vec2 ax = b2Mul(qA, this.m_localXAxisA);
                        const ax = b2_math_js_1.b2Rot.MulRV(qA, this.m_localXAxisA, this.m_ax);
                        // float sAx = b2Cross(d + rA, this.m_ax);
                        const sAx = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), this.m_ax);
                        // float sBx = b2Cross(rB, this.m_ax);
                        const sBx = b2_math_js_1.b2Vec2.CrossVV(rB, this.m_ax);
                        let C = 0.0;
                        const translation = b2_math_js_1.b2Vec2.DotVV(ax, d);
                        if (b2_math_js_1.b2Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2_settings_js_1.b2_linearSlop) {
                            C = translation;
                        }
                        else if (translation <= this.m_lowerTranslation) {
                            C = b2_math_js_1.b2Min(translation - this.m_lowerTranslation, 0.0);
                        }
                        else if (translation >= this.m_upperTranslation) {
                            C = b2_math_js_1.b2Max(translation - this.m_upperTranslation, 0.0);
                        }
                        if (C !== 0.0) {
                            const invMass = this.m_invMassA + this.m_invMassB + this.m_invIA * sAx * sAx + this.m_invIB * sBx * sBx;
                            let impulse = 0.0;
                            if (invMass !== 0.0) {
                                impulse = -C / invMass;
                            }
                            const P = b2_math_js_1.b2Vec2.MulSV(impulse, ax, b2WheelJoint.SolvePositionConstraints_s_P);
                            const LA = impulse * sAx;
                            const LB = impulse * sBx;
                            // cA -= m_invMassA * P;
                            cA.SelfMulSub(this.m_invMassA, P);
                            aA -= this.m_invIA * LA;
                            // cB += m_invMassB * P;
                            cB.SelfMulAdd(this.m_invMassB, P);
                            // aB += m_invIB * LB;
                            aB += this.m_invIB * LB;
                            linearError = b2_math_js_1.b2Abs(C);
                        }
                    }
                    // Solve perpendicular constraint
                    {
                        // b2Rot qA(aA), qB(aB);
                        const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                        // b2Vec2 d = (cB - cA) + rB - rA;
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                        const rA = b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                        const rB = b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                        // b2Vec2 d = (cB - cA) + rB - rA;
                        const d = b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.SubVV(cB, cA, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.SubVV(rB, rA, b2_math_js_1.b2Vec2.s_t1), b2WheelJoint.SolvePositionConstraints_s_d);
                        // b2Vec2 ay = b2Mul(qA, m_localYAxisA);
                        const ay = b2_math_js_1.b2Rot.MulRV(qA, this.m_localYAxisA, this.m_ay);
                        // float sAy = b2Cross(d + rA, ay);
                        const sAy = b2_math_js_1.b2Vec2.CrossVV(b2_math_js_1.b2Vec2.AddVV(d, rA, b2_math_js_1.b2Vec2.s_t0), ay);
                        // float sBy = b2Cross(rB, ay);
                        const sBy = b2_math_js_1.b2Vec2.CrossVV(rB, ay);
                        // float C = b2Dot(d, ay);
                        const C = b2_math_js_1.b2Vec2.DotVV(d, ay);
                        const invMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_sAy * this.m_sAy + this.m_invIB * this.m_sBy * this.m_sBy;
                        let impulse = 0.0;
                        if (invMass !== 0.0) {
                            impulse = -C / invMass;
                        }
                        // b2Vec2 P = impulse * ay;
                        // const LA: number = impulse * sAy;
                        // const LB: number = impulse * sBy;
                        const P = b2_math_js_1.b2Vec2.MulSV(impulse, ay, b2WheelJoint.SolvePositionConstraints_s_P);
                        const LA = impulse * sAy;
                        const LB = impulse * sBy;
                        // cA -= m_invMassA * P;
                        cA.SelfMulSub(this.m_invMassA, P);
                        aA -= this.m_invIA * LA;
                        // cB += m_invMassB * P;
                        cB.SelfMulAdd(this.m_invMassB, P);
                        aB += this.m_invIB * LB;
                        linearError = b2_math_js_1.b2Max(linearError, b2_math_js_1.b2Abs(C));
                    }
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return linearError <= b2_settings_js_1.b2_linearSlop;
                }
                GetDefinition(def) {
                    // DEBUG: b2Assert(false); // TODO
                    return def;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // return inv_dt * (m_impulse * m_ay + m_springImpulse * m_ax);
                    out.x = inv_dt * (this.m_impulse * this.m_ay.x + this.m_springImpulse * this.m_ax.x);
                    out.y = inv_dt * (this.m_impulse * this.m_ay.y + this.m_springImpulse * this.m_ax.y);
                    return out;
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetLocalAxisA() { return this.m_localXAxisA; }
                GetJointTranslation() {
                    return this.GetPrismaticJointTranslation();
                }
                GetJointLinearSpeed() {
                    return this.GetPrismaticJointSpeed();
                }
                GetJointAngle() {
                    return this.GetRevoluteJointAngle();
                }
                GetJointAngularSpeed() {
                    return this.GetRevoluteJointSpeed();
                }
                GetPrismaticJointTranslation() {
                    const bA = this.m_bodyA;
                    const bB = this.m_bodyB;
                    const pA = bA.GetWorldPoint(this.m_localAnchorA, new b2_math_js_1.b2Vec2());
                    const pB = bB.GetWorldPoint(this.m_localAnchorB, new b2_math_js_1.b2Vec2());
                    const d = b2_math_js_1.b2Vec2.SubVV(pB, pA, new b2_math_js_1.b2Vec2());
                    const axis = bA.GetWorldVector(this.m_localXAxisA, new b2_math_js_1.b2Vec2());
                    const translation = b2_math_js_1.b2Vec2.DotVV(d, axis);
                    return translation;
                }
                GetPrismaticJointSpeed() {
                    const bA = this.m_bodyA;
                    const bB = this.m_bodyB;
                    // b2Vec2 rA = b2Mul(bA.m_xf.q, m_localAnchorA - bA.m_sweep.localCenter);
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, bA.m_sweep.localCenter, this.m_lalcA);
                    const rA = b2_math_js_1.b2Rot.MulRV(bA.m_xf.q, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(bB.m_xf.q, m_localAnchorB - bB.m_sweep.localCenter);
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, bB.m_sweep.localCenter, this.m_lalcB);
                    const rB = b2_math_js_1.b2Rot.MulRV(bB.m_xf.q, this.m_lalcB, this.m_rB);
                    // b2Vec2 pA = bA.m_sweep.c + rA;
                    const pA = b2_math_js_1.b2Vec2.AddVV(bA.m_sweep.c, rA, b2_math_js_1.b2Vec2.s_t0); // pA uses s_t0
                    // b2Vec2 pB = bB.m_sweep.c + rB;
                    const pB = b2_math_js_1.b2Vec2.AddVV(bB.m_sweep.c, rB, b2_math_js_1.b2Vec2.s_t1); // pB uses s_t1
                    // b2Vec2 d = pB - pA;
                    const d = b2_math_js_1.b2Vec2.SubVV(pB, pA, b2_math_js_1.b2Vec2.s_t2); // d uses s_t2
                    // b2Vec2 axis = b2Mul(bA.m_xf.q, m_localXAxisA);
                    const axis = bA.GetWorldVector(this.m_localXAxisA, new b2_math_js_1.b2Vec2());
                    const vA = bA.m_linearVelocity;
                    const vB = bB.m_linearVelocity;
                    const wA = bA.m_angularVelocity;
                    const wB = bB.m_angularVelocity;
                    // float32 speed = b2Dot(d, b2Cross(wA, axis)) + b2Dot(axis, vB + b2Cross(wB, rB) - vA - b2Cross(wA, rA));
                    const speed = b2_math_js_1.b2Vec2.DotVV(d, b2_math_js_1.b2Vec2.CrossSV(wA, axis, b2_math_js_1.b2Vec2.s_t0)) +
                        b2_math_js_1.b2Vec2.DotVV(axis, b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, rA, b2_math_js_1.b2Vec2.s_t1), b2_math_js_1.b2Vec2.s_t0));
                    return speed;
                }
                GetRevoluteJointAngle() {
                    // b2Body* bA = this.m_bodyA;
                    // b2Body* bB = this.m_bodyB;
                    // return bB.this.m_sweep.a - bA.this.m_sweep.a;
                    return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a;
                }
                GetRevoluteJointSpeed() {
                    const wA = this.m_bodyA.m_angularVelocity;
                    const wB = this.m_bodyB.m_angularVelocity;
                    return wB - wA;
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
                SetMaxMotorTorque(force) {
                    if (force !== this.m_maxMotorTorque) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_maxMotorTorque = force;
                    }
                }
                GetMotorTorque(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                /// Is the joint limit enabled?
                IsLimitEnabled() {
                    return this.m_enableLimit;
                }
                /// Enable/disable the joint translation limit.
                EnableLimit(flag) {
                    if (flag !== this.m_enableLimit) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_enableLimit = flag;
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
                    }
                }
                /// Get the lower joint translation limit, usually in meters.
                GetLowerLimit() {
                    return this.m_lowerTranslation;
                }
                /// Get the upper joint translation limit, usually in meters.
                GetUpperLimit() {
                    return this.m_upperTranslation;
                }
                /// Set the joint translation limits, usually in meters.
                SetLimits(lower, upper) {
                    // b2Assert(lower <= upper);
                    if (lower !== this.m_lowerTranslation || upper !== this.m_upperTranslation) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_lowerTranslation = lower;
                        this.m_upperTranslation = upper;
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
                    }
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2WheelJointDef = new b2WheelJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.localAxisA.Set(%.15f, %.15f);\n", this.m_localXAxisA.x, this.m_localXAxisA.y);
                    log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                    log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                    log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
                    log("  jd.stiffness = %.15f;\n", this.m_stiffness);
                    log("  jd.damping = %.15f;\n", this.m_damping);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
                Draw(draw) {
                    const xfA = this.m_bodyA.GetTransform();
                    const xfB = this.m_bodyB.GetTransform();
                    const pA = b2_math_js_1.b2Transform.MulXV(xfA, this.m_localAnchorA, b2WheelJoint.Draw_s_pA);
                    const pB = b2_math_js_1.b2Transform.MulXV(xfB, this.m_localAnchorB, b2WheelJoint.Draw_s_pB);
                    // b2Vec2 axis = b2Mul(xfA.q, m_localXAxisA);
                    const c1 = b2WheelJoint.Draw_s_c1; // b2Color c1(0.7f, 0.7f, 0.7f);
                    // const c2 = b2WheelJoint.Draw_s_c2; // b2Color c2(0.3f, 0.9f, 0.3f);
                    // const c3 = b2WheelJoint.Draw_s_c3; // b2Color c3(0.9f, 0.3f, 0.3f);
                    const c4 = b2WheelJoint.Draw_s_c4; // b2Color c4(0.3f, 0.3f, 0.9f);
                    const c5 = b2WheelJoint.Draw_s_c5; // b2Color c5(0.4f, 0.4f, 0.4f);
                    draw.DrawSegment(pA, pB, c5);
                    if (this.m_enableLimit) {
                        // b2Vec2 lower = pA + m_lowerTranslation * axis;
                        // b2Vec2 upper = pA + m_upperTranslation * axis;
                        // b2Vec2 perp = b2Mul(xfA.q, m_localYAxisA);
                        // draw.DrawSegment(lower, upper, c1);
                        // draw.DrawSegment(lower - 0.5f * perp, lower + 0.5f * perp, c2);
                        // draw.DrawSegment(upper - 0.5f * perp, upper + 0.5f * perp, c3);
                    }
                    else {
                        // draw.DrawSegment(pA - 1.0f * axis, pA + 1.0f * axis, c1);
                    }
                    draw.DrawPoint(pA, 5.0, c1);
                    draw.DrawPoint(pB, 5.0, c4);
                }
            };
            exports_1("b2WheelJoint", b2WheelJoint);
            b2WheelJoint.InitVelocityConstraints_s_d = new b2_math_js_1.b2Vec2();
            b2WheelJoint.InitVelocityConstraints_s_P = new b2_math_js_1.b2Vec2();
            b2WheelJoint.SolveVelocityConstraints_s_P = new b2_math_js_1.b2Vec2();
            b2WheelJoint.SolvePositionConstraints_s_d = new b2_math_js_1.b2Vec2();
            b2WheelJoint.SolvePositionConstraints_s_P = new b2_math_js_1.b2Vec2();
            ///
            b2WheelJoint.Draw_s_pA = new b2_math_js_1.b2Vec2();
            b2WheelJoint.Draw_s_pB = new b2_math_js_1.b2Vec2();
            b2WheelJoint.Draw_s_c1 = new b2_draw_js_1.b2Color(0.7, 0.7, 0.7);
            // private static Draw_s_c2 = new b2Color(0.3, 0.9, 0.3);
            // private static Draw_s_c3 = new b2Color(0.9, 0.3, 0.3);
            b2WheelJoint.Draw_s_c4 = new b2_draw_js_1.b2Color(0.3, 0.3, 0.9);
            b2WheelJoint.Draw_s_c5 = new b2_draw_js_1.b2Color(0.4, 0.4, 0.4);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfd2hlZWxfam9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHluYW1pY3MvYjJfd2hlZWxfam9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQTZDRiw0REFBNEQ7WUFDNUQsdUVBQXVFO1lBQ3ZFLG9FQUFvRTtZQUNwRSxzRUFBc0U7WUFDdEUscUVBQXFFO1lBQ3JFLGtFQUFrRTtZQUNsRSxrQkFBQSxNQUFhLGVBQWdCLFNBQVEsd0JBQVU7Z0JBdUI3QztvQkFDRSxLQUFLLENBQUMseUJBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkF2QmxCLGlCQUFZLEdBQVcsSUFBSSxtQkFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFeEMsaUJBQVksR0FBVyxJQUFJLG1CQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUV4QyxlQUFVLEdBQVcsSUFBSSxtQkFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFL0MsZ0JBQVcsR0FBWSxLQUFLLENBQUM7b0JBRTdCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztvQkFFN0IscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO29CQUU3QixnQkFBVyxHQUFHLEtBQUssQ0FBQztvQkFFcEIsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBRTNCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBRXZCLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBRXRCLFlBQU8sR0FBVyxDQUFDLENBQUM7Z0JBSTNCLENBQUM7Z0JBRU0sVUFBVSxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsTUFBYyxFQUFFLElBQVk7b0JBQ3BFLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssQ0FB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