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
    var b2_settings_js_1, b2_math_js_1, b2_joint_js_1, b2_draw_js_1, b2RevoluteJointDef, b2RevoluteJoint;
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
            /// Revolute joint definition. This requires defining an anchor point where the
            /// bodies are joined. The definition uses local anchor points so that the
            /// initial configuration can violate the constraint slightly. You also need to
            /// specify the initial relative angle for joint limits. This helps when saving
            /// and loading a game.
            /// The local anchor points are measured from the body's origin
            /// rather than the center of mass because:
            /// 1. you might not know where the center of mass will be.
            /// 2. if you add/remove shapes from a body and recompute the mass,
            ///    the joints will be broken.
            b2RevoluteJointDef = class b2RevoluteJointDef extends b2_joint_js_1.b2JointDef {
                constructor() {
                    super(b2_joint_js_1.b2JointType.e_revoluteJoint);
                    this.localAnchorA = new b2_math_js_1.b2Vec2(0, 0);
                    this.localAnchorB = new b2_math_js_1.b2Vec2(0, 0);
                    this.referenceAngle = 0;
                    this.enableLimit = false;
                    this.lowerAngle = 0;
                    this.upperAngle = 0;
                    this.enableMotor = false;
                    this.motorSpeed = 0;
                    this.maxMotorTorque = 0;
                }
                Initialize(bA, bB, anchor) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
                }
            };
            exports_1("b2RevoluteJointDef", b2RevoluteJointDef);
            b2RevoluteJoint = class b2RevoluteJoint extends b2_joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    // Solver shared
                    this.m_localAnchorA = new b2_math_js_1.b2Vec2();
                    this.m_localAnchorB = new b2_math_js_1.b2Vec2();
                    this.m_impulse = new b2_math_js_1.b2Vec2();
                    this.m_motorImpulse = 0;
                    this.m_lowerImpulse = 0;
                    this.m_upperImpulse = 0;
                    this.m_enableMotor = false;
                    this.m_maxMotorTorque = 0;
                    this.m_motorSpeed = 0;
                    this.m_enableLimit = false;
                    this.m_referenceAngle = 0;
                    this.m_lowerAngle = 0;
                    this.m_upperAngle = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2_math_js_1.b2Vec2();
                    this.m_rB = new b2_math_js_1.b2Vec2();
                    this.m_localCenterA = new b2_math_js_1.b2Vec2();
                    this.m_localCenterB = new b2_math_js_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_K = new b2_math_js_1.b2Mat22();
                    this.m_angle = 0;
                    this.m_axialMass = 0;
                    this.m_qA = new b2_math_js_1.b2Rot();
                    this.m_qB = new b2_math_js_1.b2Rot();
                    this.m_lalcA = new b2_math_js_1.b2Vec2();
                    this.m_lalcB = new b2_math_js_1.b2Vec2();
                    this.m_localAnchorA.Copy(b2_settings_js_1.b2Maybe(def.localAnchorA, b2_math_js_1.b2Vec2.ZERO));
                    this.m_localAnchorB.Copy(b2_settings_js_1.b2Maybe(def.localAnchorB, b2_math_js_1.b2Vec2.ZERO));
                    this.m_referenceAngle = b2_settings_js_1.b2Maybe(def.referenceAngle, 0);
                    this.m_impulse.SetZero();
                    this.m_motorImpulse = 0;
                    this.m_lowerAngle = b2_settings_js_1.b2Maybe(def.lowerAngle, 0);
                    this.m_upperAngle = b2_settings_js_1.b2Maybe(def.upperAngle, 0);
                    this.m_maxMotorTorque = b2_settings_js_1.b2Maybe(def.maxMotorTorque, 0);
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
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
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
                    // J = [-I -r1_skew I r2_skew]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    this.m_K.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
                    this.m_K.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
                    this.m_K.ex.y = this.m_K.ey.x;
                    this.m_K.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
                    this.m_axialMass = iA + iB;
                    let fixedRotation;
                    if (this.m_axialMass > 0.0) {
                        this.m_axialMass = 1.0 / this.m_axialMass;
                        fixedRotation = false;
                    }
                    else {
                        fixedRotation = true;
                    }
                    this.m_angle = aB - aA - this.m_referenceAngle;
                    if (this.m_enableLimit === false || fixedRotation) {
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
                    }
                    if (this.m_enableMotor === false || fixedRotation) {
                        this.m_motorImpulse = 0.0;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        this.m_motorImpulse *= data.step.dtRatio;
                        this.m_lowerImpulse *= data.step.dtRatio;
                        this.m_upperImpulse *= data.step.dtRatio;
                        const axialImpulse = this.m_motorImpulse + this.m_lowerImpulse - this.m_upperImpulse;
                        // b2Vec2 P(m_impulse.x, m_impulse.y);
                        const P = b2RevoluteJoint.InitVelocityConstraints_s_P.Set(this.m_impulse.x, this.m_impulse.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2_math_js_1.b2Vec2.CrossVV(this.m_rA, P) + axialImpulse);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2_math_js_1.b2Vec2.CrossVV(this.m_rB, P) + axialImpulse);
                    }
                    else {
                        this.m_impulse.SetZero();
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
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const fixedRotation = (iA + iB === 0);
                    // Solve motor constraint.
                    if (this.m_enableMotor && !fixedRotation) {
                        const Cdot = wB - wA - this.m_motorSpeed;
                        let impulse = -this.m_axialMass * Cdot;
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorTorque;
                        this.m_motorImpulse = b2_math_js_1.b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve limit constraint.
                    if (this.m_enableLimit && !fixedRotation) {
                        // Lower limit
                        {
                            const C = this.m_angle - this.m_lowerAngle;
                            const Cdot = wB - wA;
                            let impulse = -this.m_axialMass * (Cdot + b2_math_js_1.b2Max(C, 0.0) * data.step.inv_dt);
                            const oldImpulse = this.m_lowerImpulse;
                            this.m_lowerImpulse = b2_math_js_1.b2Max(this.m_lowerImpulse + impulse, 0.0);
                            impulse = this.m_lowerImpulse - oldImpulse;
                            wA -= iA * impulse;
                            wB += iB * impulse;
                        }
                        // Upper limit
                        // Note: signs are flipped to keep C positive when the constraint is satisfied.
                        // This also keeps the impulse positive when the limit is active.
                        {
                            const C = this.m_upperAngle - this.m_angle;
                            const Cdot = wA - wB;
                            let impulse = -this.m_axialMass * (Cdot + b2_math_js_1.b2Max(C, 0.0) * data.step.inv_dt);
                            const oldImpulse = this.m_upperImpulse;
                            this.m_upperImpulse = b2_math_js_1.b2Max(this.m_upperImpulse + impulse, 0.0);
                            impulse = this.m_upperImpulse - oldImpulse;
                            wA += iA * impulse;
                            wB -= iB * impulse;
                        }
                    }
                    // Solve point-to-point constraint
                    {
                        // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                        const Cdot_v2 = b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2_math_js_1.b2Vec2.s_t1), b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = m_K.Solve(-Cdot);
                        const impulse_v2 = this.m_K.Solve(-Cdot_v2.x, -Cdot_v2.y, b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2);
                        this.m_impulse.x += impulse_v2.x;
                        this.m_impulse.y += impulse_v2.y;
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulse_v2);
                        wA -= iA * b2_math_js_1.b2Vec2.CrossVV(this.m_rA, impulse_v2);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulse_v2);
                        wB += iB * b2_math_js_1.b2Vec2.CrossVV(this.m_rB, impulse_v2);
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
                    // b2Rot qA(aA), qB(aB);
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    let angularError = 0;
                    let positionError = 0;
                    const fixedRotation = (this.m_invIA + this.m_invIB === 0);
                    // Solve angular limit constraint.
                    // let active: boolean = false;
                    if (this.m_enableLimit && !fixedRotation) {
                        const angle = aB - aA - this.m_referenceAngle;
                        let C = 0.0;
                        if (b2_math_js_1.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2_settings_js_1.b2_angularSlop) {
                            // Prevent large angular corrections
                            C = b2_math_js_1.b2Clamp(angle - this.m_lowerAngle, -b2_settings_js_1.b2_maxAngularCorrection, b2_settings_js_1.b2_maxAngularCorrection);
                        }
                        else if (angle <= this.m_lowerAngle) {
                            // Prevent large angular corrections and allow some slop.
                            C = b2_math_js_1.b2Clamp(angle - this.m_lowerAngle + b2_settings_js_1.b2_angularSlop, -b2_settings_js_1.b2_maxAngularCorrection, 0.0);
                        }
                        else if (angle >= this.m_upperAngle) {
                            // Prevent large angular corrections and allow some slop.
                            C = b2_math_js_1.b2Clamp(angle - this.m_upperAngle - b2_settings_js_1.b2_angularSlop, 0.0, b2_settings_js_1.b2_maxAngularCorrection);
                        }
                        const limitImpulse = -this.m_axialMass * C;
                        aA -= this.m_invIA * limitImpulse;
                        aB += this.m_invIB * limitImpulse;
                        angularError = b2_math_js_1.b2Abs(C);
                    }
                    // Solve point-to-point constraint.
                    {
                        qA.SetAngle(aA);
                        qB.SetAngle(aB);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                        const rA = b2_math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                        b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                        const rB = b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                        // b2Vec2 C = cB + rB - cA - rA;
                        const C_v2 = b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVV(cB, rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVV(cA, rA, b2_math_js_1.b2Vec2.s_t1), b2RevoluteJoint.SolvePositionConstraints_s_C_v2);
                        // positionError = C.Length();
                        positionError = C_v2.Length();
                        const mA = this.m_invMassA, mB = this.m_invMassB;
                        const iA = this.m_invIA, iB = this.m_invIB;
                        const K = this.m_K;
                        K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
                        K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
                        K.ey.x = K.ex.y;
                        K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
                        // b2Vec2 impulse = -K.Solve(C);
                        const impulse = K.Solve(C_v2.x, C_v2.y, b2RevoluteJoint.SolvePositionConstraints_s_impulse).SelfNeg();
                        // cA -= mA * impulse;
                        cA.SelfMulSub(mA, impulse);
                        aA -= iA * b2_math_js_1.b2Vec2.CrossVV(rA, impulse);
                        // cB += mB * impulse;
                        cB.SelfMulAdd(mB, impulse);
                        aB += iB * b2_math_js_1.b2Vec2.CrossVV(rB, impulse);
                    }
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return positionError <= b2_settings_js_1.b2_linearSlop && angularError <= b2_settings_js_1.b2_angularSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // b2Vec2 P(this.m_impulse.x, this.m_impulse.y);
                    // return inv_dt * P;
                    out.x = inv_dt * this.m_impulse.x;
                    out.y = inv_dt * this.m_impulse.y;
                    return out;
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * (this.m_lowerImpulse + this.m_upperImpulse);
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetReferenceAngle() { return this.m_referenceAngle; }
                GetJointAngle() {
                    // b2Body* bA = this.m_bodyA;
                    // b2Body* bB = this.m_bodyB;
                    // return bB.this.m_sweep.a - bA.this.m_sweep.a - this.m_referenceAngle;
                    return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
                }
                GetJointSpeed() {
                    // b2Body* bA = this.m_bodyA;
                    // b2Body* bB = this.m_bodyB;
                    // return bB.this.m_angularVelocity - bA.this.m_angularVelocity;
                    return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
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
                GetMotorTorque(inv_dt) {
                    return inv_dt * this.m_motorImpulse;
                }
                GetMotorSpeed() {
                    return this.m_motorSpeed;
                }
                SetMaxMotorTorque(torque) {
                    if (torque !== this.m_maxMotorTorque) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_maxMotorTorque = torque;
                    }
                }
                GetMaxMotorTorque() { return this.m_maxMotorTorque; }
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
                    return this.m_lowerAngle;
                }
                GetUpperLimit() {
                    return this.m_upperAngle;
                }
                SetLimits(lower, upper) {
                    if (lower !== this.m_lowerAngle || upper !== this.m_upperAngle) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_lowerImpulse = 0.0;
                        this.m_upperImpulse = 0.0;
                        this.m_lowerAngle = lower;
                        this.m_upperAngle = upper;
                    }
                }
                SetMotorSpeed(speed) {
                    if (speed !== this.m_motorSpeed) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_motorSpeed = speed;
                    }
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2RevoluteJointDef = new b2RevoluteJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                    log("  jd.enableLimit = %s;\n", (this.m_enableLimit) ? ("true") : ("false"));
                    log("  jd.lowerAngle = %.15f;\n", this.m_lowerAngle);
                    log("  jd.upperAngle = %.15f;\n", this.m_upperAngle);
                    log("  jd.enableMotor = %s;\n", (this.m_enableMotor) ? ("true") : ("false"));
                    log("  jd.motorSpeed = %.15f;\n", this.m_motorSpeed);
                    log("  jd.maxMotorTorque = %.15f;\n", this.m_maxMotorTorque);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
                // private static Draw_s_color = new b2Color(0.5, 0.8, 0.8);
                Draw(draw) {
                    const xfA = this.m_bodyA.GetTransform();
                    const xfB = this.m_bodyB.GetTransform();
                    const pA = b2_math_js_1.b2Transform.MulXV(xfA, this.m_localAnchorA, b2RevoluteJoint.Draw_s_pA);
                    const pB = b2_math_js_1.b2Transform.MulXV(xfB, this.m_localAnchorB, b2RevoluteJoint.Draw_s_pB);
                    const c1 = b2RevoluteJoint.Draw_s_c1; // b2Color c1(0.7f, 0.7f, 0.7f);
                    // const c2 = b2RevoluteJoint.Draw_s_c2; // b2Color c2(0.3f, 0.9f, 0.3f);
                    // const c3 = b2RevoluteJoint.Draw_s_c3; // b2Color c3(0.9f, 0.3f, 0.3f);
                    const c4 = b2RevoluteJoint.Draw_s_c4; // b2Color c4(0.3f, 0.3f, 0.9f);
                    const c5 = b2RevoluteJoint.Draw_s_c5; // b2Color c5(0.4f, 0.4f, 0.4f);
                    draw.DrawPoint(pA, 5.0, c4);
                    draw.DrawPoint(pB, 5.0, c5);
                    // const aA: number = this.m_bodyA.GetAngle();
                    // const aB: number = this.m_bodyB.GetAngle();
                    // const angle: number = aB - aA - this.m_referenceAngle;
                    const L = 0.5;
                    // b2Vec2 r = L * b2Vec2(Math.cos(angle), Math.sin(angle));
                    // draw.DrawSegment(pB, pB + r, c1);
                    draw.DrawCircle(pB, L, c1);
                    if (this.m_enableLimit) {
                        // b2Vec2 rlo = L * b2Vec2(Math.cos(m_lowerAngle), Math.sin(m_lowerAngle));
                        // b2Vec2 rhi = L * b2Vec2(Math.cos(m_upperAngle), Math.sin(m_upperAngle));
                        // draw.DrawSegment(pB, pB + rlo, c2);
                        // draw.DrawSegment(pB, pB + rhi, c3);
                    }
                    // const color = b2RevoluteJoint.Draw_s_color; // b2Color color(0.5f, 0.8f, 0.8f);
                    // draw.DrawSegment(xfA.p, pA, color);
                    // draw.DrawSegment(pA, pB, color);
                    // draw.DrawSegment(xfB.p, pB, color);
                }
            };
            exports_1("b2RevoluteJoint", b2RevoluteJoint);
            b2RevoluteJoint.InitVelocityConstraints_s_P = new b2_math_js_1.b2Vec2();
            // private static SolveVelocityConstraints_s_P: b2Vec2 = new b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2_math_js_1.b2Vec2();
            // private static SolveVelocityConstraints_s_Cdot1: b2Vec2 = new b2Vec2();
            // private static SolveVelocityConstraints_s_impulse_v3: b2Vec3 = new b2Vec3();
            // private static SolveVelocityConstraints_s_reduced_v2: b2Vec2 = new b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2 = new b2_math_js_1.b2Vec2();
            b2RevoluteJoint.SolvePositionConstraints_s_C_v2 = new b2_math_js_1.b2Vec2();
            b2RevoluteJoint.SolvePositionConstraints_s_impulse = new b2_math_js_1.b2Vec2();
            b2RevoluteJoint.Draw_s_pA = new b2_math_js_1.b2Vec2();
            b2RevoluteJoint.Draw_s_pB = new b2_math_js_1.b2Vec2();
            b2RevoluteJoint.Draw_s_c1 = new b2_draw_js_1.b2Color(0.7, 0.7, 0.7);
            // private static Draw_s_c2 = new b2Color(0.3, 0.9, 0.3);
            // private static Draw_s_c3 = new b2Color(0.9, 0.3, 0.3);
            b2RevoluteJoint.Draw_s_c4 = new b2_draw_js_1.b2Color(0.3, 0.3, 0.9);
            b2RevoluteJoint.Draw_s_c5 = new b2_draw_js_1.b2Color(0.4, 0.4, 0.4);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfcmV2b2x1dGVfam9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHluYW1pY3MvYjJfcmV2b2x1dGVfam9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQTZCRiwrRUFBK0U7WUFDL0UsMEVBQTBFO1lBQzFFLCtFQUErRTtZQUMvRSwrRUFBK0U7WUFDL0UsdUJBQXVCO1lBQ3ZCLCtEQUErRDtZQUMvRCwyQ0FBMkM7WUFDM0MsMkRBQTJEO1lBQzNELG1FQUFtRTtZQUNuRSxpQ0FBaUM7WUFDakMscUJBQUEsTUFBYSxrQkFBbUIsU0FBUSx3QkFBVTtnQkFtQmhEO29CQUNFLEtBQUssQ0FBQyx5QkFBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQW5CckIsaUJBQVksR0FBVyxJQUFJLG1CQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUV4QyxpQkFBWSxHQUFXLElBQUksbUJBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWpELG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUUzQixnQkFBVyxHQUFHLEtBQUssQ0FBQztvQkFFcEIsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFFdkIsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFFdkIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7b0JBRXBCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBRXZCLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO2dCQUlsQyxDQUFDO2dCQUVNLFVBQVUsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLE1BQVU7b0JBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENB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QXFCO29CQUVyQixTQUFTO29CQUNULDBEQUEwRDtvQkFDMUQsMERBQTBEO29CQUUxRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNqRSxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUUzRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUMxRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNqRixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUUxRixJQUFJLENBQUMsV0FB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