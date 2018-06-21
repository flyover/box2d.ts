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
    var b2Settings_1, b2Math_1, b2Joint_1, b2RevoluteJointDef, b2RevoluteJoint;
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
            /// Revolute joint definition. This requires defining an
            /// anchor point where the bodies are joined. The definition
            /// uses local anchor points so that the initial configuration
            /// can violate the constraint slightly. You also need to
            /// specify the initial relative angle for joint limits. This
            /// helps when saving and loading a game.
            /// The local anchor points are measured from the body's origin
            /// rather than the center of mass because:
            /// 1. you might not know where the center of mass will be.
            /// 2. if you add/remove shapes from a body and recompute the mass,
            ///    the joints will be broken.
            b2RevoluteJointDef = class b2RevoluteJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(b2Joint_1.b2JointType.e_revoluteJoint);
                    this.localAnchorA = new b2Math_1.b2Vec2(0, 0);
                    this.localAnchorB = new b2Math_1.b2Vec2(0, 0);
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
            b2RevoluteJoint = class b2RevoluteJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    // Solver shared
                    this.m_localAnchorA = new b2Math_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_impulse = new b2Math_1.b2Vec3();
                    this.m_motorImpulse = 0;
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
                    this.m_rA = new b2Math_1.b2Vec2();
                    this.m_rB = new b2Math_1.b2Vec2();
                    this.m_localCenterA = new b2Math_1.b2Vec2();
                    this.m_localCenterB = new b2Math_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = new b2Math_1.b2Mat33(); // effective mass for point-to-point constraint.
                    this.m_motorMass = 0; // effective mass for motor/limit angular constraint.
                    this.m_limitState = b2Joint_1.b2LimitState.e_inactiveLimit;
                    this.m_qA = new b2Math_1.b2Rot();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_lalcA = new b2Math_1.b2Vec2();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_K = new b2Math_1.b2Mat22();
                    this.m_localAnchorA.Copy(b2Settings_1.b2Maybe(def.localAnchorA, b2Math_1.b2Vec2.ZERO));
                    this.m_localAnchorB.Copy(b2Settings_1.b2Maybe(def.localAnchorB, b2Math_1.b2Vec2.ZERO));
                    this.m_referenceAngle = b2Settings_1.b2Maybe(def.referenceAngle, 0);
                    this.m_impulse.SetZero();
                    this.m_motorImpulse = 0;
                    this.m_lowerAngle = b2Settings_1.b2Maybe(def.lowerAngle, 0);
                    this.m_upperAngle = b2Settings_1.b2Maybe(def.upperAngle, 0);
                    this.m_maxMotorTorque = b2Settings_1.b2Maybe(def.maxMotorTorque, 0);
                    this.m_motorSpeed = b2Settings_1.b2Maybe(def.motorSpeed, 0);
                    this.m_enableLimit = b2Settings_1.b2Maybe(def.enableLimit, false);
                    this.m_enableMotor = b2Settings_1.b2Maybe(def.enableMotor, false);
                    this.m_limitState = b2Joint_1.b2LimitState.e_inactiveLimit;
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
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    //     [ 0       -1 0       1]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const fixedRotation = (iA + iB === 0);
                    this.m_mass.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
                    this.m_mass.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
                    this.m_mass.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
                    this.m_mass.ex.y = this.m_mass.ey.x;
                    this.m_mass.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
                    this.m_mass.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
                    this.m_mass.ex.z = this.m_mass.ez.x;
                    this.m_mass.ey.z = this.m_mass.ez.y;
                    this.m_mass.ez.z = iA + iB;
                    this.m_motorMass = iA + iB;
                    if (this.m_motorMass > 0) {
                        this.m_motorMass = 1 / this.m_motorMass;
                    }
                    if (!this.m_enableMotor || fixedRotation) {
                        this.m_motorImpulse = 0;
                    }
                    if (this.m_enableLimit && !fixedRotation) {
                        const jointAngle = aB - aA - this.m_referenceAngle;
                        if (b2Math_1.b2Abs(this.m_upperAngle - this.m_lowerAngle) < 2 * b2Settings_1.b2_angularSlop) {
                            this.m_limitState = b2Joint_1.b2LimitState.e_equalLimits;
                        }
                        else if (jointAngle <= this.m_lowerAngle) {
                            if (this.m_limitState !== b2Joint_1.b2LimitState.e_atLowerLimit) {
                                this.m_impulse.z = 0;
                            }
                            this.m_limitState = b2Joint_1.b2LimitState.e_atLowerLimit;
                        }
                        else if (jointAngle >= this.m_upperAngle) {
                            if (this.m_limitState !== b2Joint_1.b2LimitState.e_atUpperLimit) {
                                this.m_impulse.z = 0;
                            }
                            this.m_limitState = b2Joint_1.b2LimitState.e_atUpperLimit;
                        }
                        else {
                            this.m_limitState = b2Joint_1.b2LimitState.e_inactiveLimit;
                            this.m_impulse.z = 0;
                        }
                    }
                    else {
                        this.m_limitState = b2Joint_1.b2LimitState.e_inactiveLimit;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        this.m_motorImpulse *= data.step.dtRatio;
                        // b2Vec2 P(m_impulse.x, m_impulse.y);
                        const P = b2RevoluteJoint.InitVelocityConstraints_s_P.Set(this.m_impulse.x, this.m_impulse.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_1.b2Vec2.CrossVV(this.m_rA, P) + this.m_motorImpulse + this.m_impulse.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_1.b2Vec2.CrossVV(this.m_rB, P) + this.m_motorImpulse + this.m_impulse.z);
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
                    const fixedRotation = (iA + iB === 0);
                    // Solve motor constraint.
                    if (this.m_enableMotor && this.m_limitState !== b2Joint_1.b2LimitState.e_equalLimits && !fixedRotation) {
                        const Cdot = wB - wA - this.m_motorSpeed;
                        let impulse = -this.m_motorMass * Cdot;
                        const oldImpulse = this.m_motorImpulse;
                        const maxImpulse = data.step.dt * this.m_maxMotorTorque;
                        this.m_motorImpulse = b2Math_1.b2Clamp(this.m_motorImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_motorImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve limit constraint.
                    if (this.m_enableLimit && this.m_limitState !== b2Joint_1.b2LimitState.e_inactiveLimit && !fixedRotation) {
                        // b2Vec2 Cdot1 = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                        const Cdot1 = b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_1.b2Vec2.s_t1), b2RevoluteJoint.SolveVelocityConstraints_s_Cdot1);
                        const Cdot2 = wB - wA;
                        // b2Vec3 Cdot(Cdot1.x, Cdot1.y, Cdot2);
                        // b2Vec3 impulse = -this.m_mass.Solve33(Cdot);
                        const impulse_v3 = this.m_mass.Solve33(Cdot1.x, Cdot1.y, Cdot2, b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v3).SelfNeg();
                        if (this.m_limitState === b2Joint_1.b2LimitState.e_equalLimits) {
                            this.m_impulse.SelfAdd(impulse_v3);
                        }
                        else if (this.m_limitState === b2Joint_1.b2LimitState.e_atLowerLimit) {
                            const newImpulse = this.m_impulse.z + impulse_v3.z;
                            if (newImpulse < 0) {
                                // b2Vec2 rhs = -Cdot1 + m_impulse.z * b2Vec2(m_mass.ez.x, m_mass.ez.y);
                                const rhs_x = -Cdot1.x + this.m_impulse.z * this.m_mass.ez.x;
                                const rhs_y = -Cdot1.y + this.m_impulse.z * this.m_mass.ez.y;
                                const reduced_v2 = this.m_mass.Solve22(rhs_x, rhs_y, b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2);
                                impulse_v3.x = reduced_v2.x;
                                impulse_v3.y = reduced_v2.y;
                                impulse_v3.z = -this.m_impulse.z;
                                this.m_impulse.x += reduced_v2.x;
                                this.m_impulse.y += reduced_v2.y;
                                this.m_impulse.z = 0;
                            }
                            else {
                                this.m_impulse.SelfAdd(impulse_v3);
                            }
                        }
                        else if (this.m_limitState === b2Joint_1.b2LimitState.e_atUpperLimit) {
                            const newImpulse = this.m_impulse.z + impulse_v3.z;
                            if (newImpulse > 0) {
                                // b2Vec2 rhs = -Cdot1 + m_impulse.z * b2Vec2(m_mass.ez.x, m_mass.ez.y);
                                const rhs_x = -Cdot1.x + this.m_impulse.z * this.m_mass.ez.x;
                                const rhs_y = -Cdot1.y + this.m_impulse.z * this.m_mass.ez.y;
                                const reduced_v2 = this.m_mass.Solve22(rhs_x, rhs_y, b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2);
                                impulse_v3.x = reduced_v2.x;
                                impulse_v3.y = reduced_v2.y;
                                impulse_v3.z = -this.m_impulse.z;
                                this.m_impulse.x += reduced_v2.x;
                                this.m_impulse.y += reduced_v2.y;
                                this.m_impulse.z = 0;
                            }
                            else {
                                this.m_impulse.SelfAdd(impulse_v3);
                            }
                        }
                        // b2Vec2 P(impulse.x, impulse.y);
                        const P = b2RevoluteJoint.SolveVelocityConstraints_s_P.Set(impulse_v3.x, impulse_v3.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_1.b2Vec2.CrossVV(this.m_rA, P) + impulse_v3.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_1.b2Vec2.CrossVV(this.m_rB, P) + impulse_v3.z);
                    }
                    else {
                        // Solve point-to-point constraint
                        // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                        const Cdot_v2 = b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_1.b2Vec2.s_t1), b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = m_mass.Solve22(-Cdot);
                        const impulse_v2 = this.m_mass.Solve22(-Cdot_v2.x, -Cdot_v2.y, b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2);
                        this.m_impulse.x += impulse_v2.x;
                        this.m_impulse.y += impulse_v2.y;
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulse_v2);
                        wA -= iA * b2Math_1.b2Vec2.CrossVV(this.m_rA, impulse_v2);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulse_v2);
                        wB += iB * b2Math_1.b2Vec2.CrossVV(this.m_rB, impulse_v2);
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
                    if (this.m_enableLimit && this.m_limitState !== b2Joint_1.b2LimitState.e_inactiveLimit && !fixedRotation) {
                        const angle = aB - aA - this.m_referenceAngle;
                        let limitImpulse = 0;
                        if (this.m_limitState === b2Joint_1.b2LimitState.e_equalLimits) {
                            // Prevent large angular corrections
                            const C = b2Math_1.b2Clamp(angle - this.m_lowerAngle, -b2Settings_1.b2_maxAngularCorrection, b2Settings_1.b2_maxAngularCorrection);
                            limitImpulse = -this.m_motorMass * C;
                            angularError = b2Math_1.b2Abs(C);
                        }
                        else if (this.m_limitState === b2Joint_1.b2LimitState.e_atLowerLimit) {
                            let C = angle - this.m_lowerAngle;
                            angularError = -C;
                            // Prevent large angular corrections and allow some slop.
                            C = b2Math_1.b2Clamp(C + b2Settings_1.b2_angularSlop, -b2Settings_1.b2_maxAngularCorrection, 0);
                            limitImpulse = -this.m_motorMass * C;
                        }
                        else if (this.m_limitState === b2Joint_1.b2LimitState.e_atUpperLimit) {
                            let C = angle - this.m_upperAngle;
                            angularError = C;
                            // Prevent large angular corrections and allow some slop.
                            C = b2Math_1.b2Clamp(C - b2Settings_1.b2_angularSlop, 0, b2Settings_1.b2_maxAngularCorrection);
                            limitImpulse = -this.m_motorMass * C;
                        }
                        aA -= this.m_invIA * limitImpulse;
                        aB += this.m_invIB * limitImpulse;
                    }
                    // Solve point-to-point constraint.
                    {
                        qA.SetAngle(aA);
                        qB.SetAngle(aB);
                        // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                        b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                        const rA = b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                        // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                        b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                        const rB = b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                        // b2Vec2 C = cB + rB - cA - rA;
                        const C_v2 = b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVV(cB, rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVV(cA, rA, b2Math_1.b2Vec2.s_t1), b2RevoluteJoint.SolvePositionConstraints_s_C_v2);
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
                        aA -= iA * b2Math_1.b2Vec2.CrossVV(rA, impulse);
                        // cB += mB * impulse;
                        cB.SelfMulAdd(mB, impulse);
                        aB += iB * b2Math_1.b2Vec2.CrossVV(rB, impulse);
                    }
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return positionError <= b2Settings_1.b2_linearSlop && angularError <= b2Settings_1.b2_angularSlop;
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
                    return inv_dt * this.m_impulse.z;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                GetReferenceAngle() { return this.m_referenceAngle; }
                GetJointAngle() {
                    // b2Body* bA = this.m_bodyA;
                    // b2Body* bB = this.m_bodyB;
                    // return bB->this.m_sweep.a - bA->this.m_sweep.a - this.m_referenceAngle;
                    return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
                }
                GetJointSpeed() {
                    // b2Body* bA = this.m_bodyA;
                    // b2Body* bB = this.m_bodyB;
                    // return bB->this.m_angularVelocity - bA->this.m_angularVelocity;
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
                        this.m_impulse.z = 0;
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
                        this.m_impulse.z = 0;
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
            };
            b2RevoluteJoint.InitVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2Math_1.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_Cdot1 = new b2Math_1.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v3 = new b2Math_1.b2Vec3();
            b2RevoluteJoint.SolveVelocityConstraints_s_reduced_v2 = new b2Math_1.b2Vec2();
            b2RevoluteJoint.SolveVelocityConstraints_s_impulse_v2 = new b2Math_1.b2Vec2();
            b2RevoluteJoint.SolvePositionConstraints_s_C_v2 = new b2Math_1.b2Vec2();
            b2RevoluteJoint.SolvePositionConstraints_s_impulse = new b2Math_1.b2Vec2();
            exports_1("b2RevoluteJoint", b2RevoluteJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJSZXZvbHV0ZUpvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvSm9pbnRzL2IyUmV2b2x1dGVKb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBNEJGLHdEQUF3RDtZQUN4RCw0REFBNEQ7WUFDNUQsOERBQThEO1lBQzlELHlEQUF5RDtZQUN6RCw2REFBNkQ7WUFDN0QseUNBQXlDO1lBQ3pDLCtEQUErRDtZQUMvRCwyQ0FBMkM7WUFDM0MsMkRBQTJEO1lBQzNELG1FQUFtRTtZQUNuRSxpQ0FBaUM7WUFDakMscUJBQUEsd0JBQWdDLFNBQVEsb0JBQVU7Z0JBbUJoRDtvQkFDRSxLQUFLLENBQUMscUJBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFuQnJCLGlCQUFZLEdBQVcsSUFBSSxlQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUV4QyxpQkFBWSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFakQsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBRTNCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO29CQUVwQixlQUFVLEdBQVcsQ0FBQyxDQUFDO29CQUV2QixlQUFVLEdBQVcsQ0FBQyxDQUFDO29CQUV2QixnQkFBVyxHQUFHLEtBQUssQ0FBQztvQkFFcEIsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFFdkIsbUJBQWMsR0FBVyxDQUFDLENBQUM7Z0JBSWxDLENBQUM7Z0JBRU0sVUFBVSxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsTUFBYztvQkFDdEQsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFB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