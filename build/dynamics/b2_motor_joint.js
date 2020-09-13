/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
    var b2_settings_js_1, b2_math_js_1, b2_joint_js_1, b2MotorJointDef, b2MotorJoint;
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
            b2MotorJointDef = class b2MotorJointDef extends b2_joint_js_1.b2JointDef {
                constructor() {
                    super(b2_joint_js_1.b2JointType.e_motorJoint);
                    this.linearOffset = new b2_math_js_1.b2Vec2(0, 0);
                    this.angularOffset = 0;
                    this.maxForce = 1;
                    this.maxTorque = 1;
                    this.correctionFactor = 0.3;
                }
                Initialize(bA, bB) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    // b2Vec2 xB = bodyB->GetPosition();
                    // linearOffset = bodyA->GetLocalPoint(xB);
                    this.bodyA.GetLocalPoint(this.bodyB.GetPosition(), this.linearOffset);
                    const angleA = this.bodyA.GetAngle();
                    const angleB = this.bodyB.GetAngle();
                    this.angularOffset = angleB - angleA;
                }
            };
            exports_1("b2MotorJointDef", b2MotorJointDef);
            b2MotorJoint = class b2MotorJoint extends b2_joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    // Solver shared
                    this.m_linearOffset = new b2_math_js_1.b2Vec2();
                    this.m_angularOffset = 0;
                    this.m_linearImpulse = new b2_math_js_1.b2Vec2();
                    this.m_angularImpulse = 0;
                    this.m_maxForce = 0;
                    this.m_maxTorque = 0;
                    this.m_correctionFactor = 0.3;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2_math_js_1.b2Vec2();
                    this.m_rB = new b2_math_js_1.b2Vec2();
                    this.m_localCenterA = new b2_math_js_1.b2Vec2();
                    this.m_localCenterB = new b2_math_js_1.b2Vec2();
                    this.m_linearError = new b2_math_js_1.b2Vec2();
                    this.m_angularError = 0;
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_linearMass = new b2_math_js_1.b2Mat22();
                    this.m_angularMass = 0;
                    this.m_qA = new b2_math_js_1.b2Rot();
                    this.m_qB = new b2_math_js_1.b2Rot();
                    this.m_K = new b2_math_js_1.b2Mat22();
                    this.m_linearOffset.Copy(b2_settings_js_1.b2Maybe(def.linearOffset, b2_math_js_1.b2Vec2.ZERO));
                    this.m_linearImpulse.SetZero();
                    this.m_maxForce = b2_settings_js_1.b2Maybe(def.maxForce, 0);
                    this.m_maxTorque = b2_settings_js_1.b2Maybe(def.maxTorque, 0);
                    this.m_correctionFactor = b2_settings_js_1.b2Maybe(def.correctionFactor, 0.3);
                }
                GetAnchorA(out) {
                    const pos = this.m_bodyA.GetPosition();
                    out.x = pos.x;
                    out.y = pos.y;
                    return out;
                }
                GetAnchorB(out) {
                    const pos = this.m_bodyB.GetPosition();
                    out.x = pos.x;
                    out.y = pos.y;
                    return out;
                }
                GetReactionForce(inv_dt, out) {
                    // return inv_dt * m_linearImpulse;
                    return b2_math_js_1.b2Vec2.MulSV(inv_dt, this.m_linearImpulse, out);
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_angularImpulse;
                }
                SetLinearOffset(linearOffset) {
                    if (!b2_math_js_1.b2Vec2.IsEqualToV(linearOffset, this.m_linearOffset)) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_linearOffset.Copy(linearOffset);
                    }
                }
                GetLinearOffset() {
                    return this.m_linearOffset;
                }
                SetAngularOffset(angularOffset) {
                    if (angularOffset !== this.m_angularOffset) {
                        this.m_bodyA.SetAwake(true);
                        this.m_bodyB.SetAwake(true);
                        this.m_angularOffset = angularOffset;
                    }
                }
                GetAngularOffset() {
                    return this.m_angularOffset;
                }
                SetMaxForce(force) {
                    // DEBUG: b2Assert(b2IsValid(force) && force >= 0);
                    this.m_maxForce = force;
                }
                GetMaxForce() {
                    return this.m_maxForce;
                }
                SetMaxTorque(torque) {
                    // DEBUG: b2Assert(b2IsValid(torque) && torque >= 0);
                    this.m_maxTorque = torque;
                }
                GetMaxTorque() {
                    return this.m_maxTorque;
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
                    // Compute the effective mass matrix.
                    // this.m_rA = b2Mul(qA, m_linearOffset - this.m_localCenterA);
                    const rA = b2_math_js_1.b2Rot.MulRV(qA, b2_math_js_1.b2Vec2.SubVV(this.m_linearOffset, this.m_localCenterA, b2_math_js_1.b2Vec2.s_t0), this.m_rA);
                    // this.m_rB = b2Mul(qB, -this.m_localCenterB);
                    const rB = b2_math_js_1.b2Rot.MulRV(qB, b2_math_js_1.b2Vec2.NegV(this.m_localCenterB, b2_math_js_1.b2Vec2.s_t0), this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    // Upper 2 by 2 of K for point to point
                    const K = this.m_K;
                    K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
                    K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
                    K.ey.x = K.ex.y;
                    K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
                    // this.m_linearMass = K.GetInverse();
                    K.GetInverse(this.m_linearMass);
                    this.m_angularMass = iA + iB;
                    if (this.m_angularMass > 0) {
                        this.m_angularMass = 1 / this.m_angularMass;
                    }
                    // this.m_linearError = cB + rB - cA - rA;
                    b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVV(cB, rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVV(cA, rA, b2_math_js_1.b2Vec2.s_t1), this.m_linearError);
                    this.m_angularError = aB - aA - this.m_angularOffset;
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        // this.m_linearImpulse *= data.step.dtRatio;
                        this.m_linearImpulse.SelfMul(data.step.dtRatio);
                        this.m_angularImpulse *= data.step.dtRatio;
                        // b2Vec2 P(this.m_linearImpulse.x, this.m_linearImpulse.y);
                        const P = this.m_linearImpulse;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2_math_js_1.b2Vec2.CrossVV(rA, P) + this.m_angularImpulse);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2_math_js_1.b2Vec2.CrossVV(rB, P) + this.m_angularImpulse);
                    }
                    else {
                        this.m_linearImpulse.SetZero();
                        this.m_angularImpulse = 0;
                    }
                    // data.velocities[this.m_indexA].v = vA; // vA is a reference
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB; // vB is a reference
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const h = data.step.dt;
                    const inv_h = data.step.inv_dt;
                    // Solve angular friction
                    {
                        const Cdot = wB - wA + inv_h * this.m_correctionFactor * this.m_angularError;
                        let impulse = -this.m_angularMass * Cdot;
                        const oldImpulse = this.m_angularImpulse;
                        const maxImpulse = h * this.m_maxTorque;
                        this.m_angularImpulse = b2_math_js_1.b2Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_angularImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve linear friction
                    {
                        const rA = this.m_rA;
                        const rB = this.m_rB;
                        // b2Vec2 Cdot = vB + b2Vec2.CrossSV(wB, rB) - vA - b2Vec2.CrossSV(wA, rA) + inv_h * this.m_correctionFactor * this.m_linearError;
                        const Cdot_v2 = b2_math_js_1.b2Vec2.AddVV(b2_math_js_1.b2Vec2.SubVV(b2_math_js_1.b2Vec2.AddVV(vB, b2_math_js_1.b2Vec2.CrossSV(wB, rB, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.AddVV(vA, b2_math_js_1.b2Vec2.CrossSV(wA, rA, b2_math_js_1.b2Vec2.s_t1), b2_math_js_1.b2Vec2.s_t1), b2_math_js_1.b2Vec2.s_t2), b2_math_js_1.b2Vec2.MulSV(inv_h * this.m_correctionFactor, this.m_linearError, b2_math_js_1.b2Vec2.s_t3), b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = -b2Mul(this.m_linearMass, Cdot);
                        const impulse_v2 = b2_math_js_1.b2Mat22.MulMV(this.m_linearMass, Cdot_v2, b2MotorJoint.SolveVelocityConstraints_s_impulse_v2).SelfNeg();
                        // b2Vec2 oldImpulse = this.m_linearImpulse;
                        const oldImpulse_v2 = b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2.Copy(this.m_linearImpulse);
                        // this.m_linearImpulse += impulse;
                        this.m_linearImpulse.SelfAdd(impulse_v2);
                        const maxImpulse = h * this.m_maxForce;
                        if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
                            this.m_linearImpulse.Normalize();
                            // this.m_linearImpulse *= maxImpulse;
                            this.m_linearImpulse.SelfMul(maxImpulse);
                        }
                        // impulse = this.m_linearImpulse - oldImpulse;
                        b2_math_js_1.b2Vec2.SubVV(this.m_linearImpulse, oldImpulse_v2, impulse_v2);
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulse_v2);
                        // wA -= iA * b2Vec2.CrossVV(rA, impulse);
                        wA -= iA * b2_math_js_1.b2Vec2.CrossVV(rA, impulse_v2);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulse_v2);
                        // wB += iB * b2Vec2.CrossVV(rB, impulse);
                        wB += iB * b2_math_js_1.b2Vec2.CrossVV(rB, impulse_v2);
                    }
                    // data.velocities[this.m_indexA].v = vA; // vA is a reference
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB; // vB is a reference
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    return true;
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2MotorJointDef = new b2MotorJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.linearOffset.Set(%.15f, %.15f);\n", this.m_linearOffset.x, this.m_linearOffset.y);
                    log("  jd.angularOffset = %.15f;\n", this.m_angularOffset);
                    log("  jd.maxForce = %.15f;\n", this.m_maxForce);
                    log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
                    log("  jd.correctionFactor = %.15f;\n", this.m_correctionFactor);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
            };
            exports_1("b2MotorJoint", b2MotorJoint);
            b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2_math_js_1.b2Vec2();
            b2MotorJoint.SolveVelocityConstraints_s_impulse_v2 = new b2_math_js_1.b2Vec2();
            b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2 = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfbW90b3Jfam9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHluYW1pY3MvYjJfbW90b3Jfam9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQXFDRixrQkFBQSxNQUFhLGVBQWdCLFNBQVEsd0JBQVU7Z0JBVzdDO29CQUNFLEtBQUssQ0FBQyx5QkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQVhsQixpQkFBWSxHQUFXLElBQUksbUJBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWpELGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUUxQixhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUVyQixjQUFTLEdBQVcsQ0FBQyxDQUFDO29CQUV0QixxQkFBZ0IsR0FBVyxHQUFHLENBQUM7Z0JBSXRDLENBQUM7Z0JBRU0sVUFBVSxDQUFDLEVBQVUsRUFBRSxFQUFVO29CQUN0QyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2hCLG9DQUFvQztvQkFDcEMsMkNBQTJDO29CQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFFdEUsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDN0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO2dCQUN2QyxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxlQUFBLE1BQWEsWUFBYSxTQUFRLHFCQUFPO2dCQThCdkMsWUFBWSxHQUFx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