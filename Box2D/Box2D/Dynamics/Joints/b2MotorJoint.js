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
System.register(["../../Common/b2Settings", "../../Common/b2Math", "./b2Joint"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Math_1, b2Joint_1, b2MotorJointDef, b2MotorJoint;
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
            b2MotorJointDef = class b2MotorJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(b2Joint_1.b2JointType.e_motorJoint);
                    this.linearOffset = new b2Math_1.b2Vec2(0, 0);
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
            b2MotorJoint = class b2MotorJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    // Solver shared
                    this.m_linearOffset = new b2Math_1.b2Vec2();
                    this.m_angularOffset = 0;
                    this.m_linearImpulse = new b2Math_1.b2Vec2();
                    this.m_angularImpulse = 0;
                    this.m_maxForce = 0;
                    this.m_maxTorque = 0;
                    this.m_correctionFactor = 0.3;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2Math_1.b2Vec2();
                    this.m_rB = new b2Math_1.b2Vec2();
                    this.m_localCenterA = new b2Math_1.b2Vec2();
                    this.m_localCenterB = new b2Math_1.b2Vec2();
                    this.m_linearError = new b2Math_1.b2Vec2();
                    this.m_angularError = 0;
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_linearMass = new b2Math_1.b2Mat22();
                    this.m_angularMass = 0;
                    this.m_qA = new b2Math_1.b2Rot();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_K = new b2Math_1.b2Mat22();
                    this.m_linearOffset.Copy(b2Settings_1.b2Maybe(def.linearOffset, b2Math_1.b2Vec2.ZERO));
                    this.m_linearImpulse.SetZero();
                    this.m_maxForce = b2Settings_1.b2Maybe(def.maxForce, 0);
                    this.m_maxTorque = b2Settings_1.b2Maybe(def.maxTorque, 0);
                    this.m_correctionFactor = b2Settings_1.b2Maybe(def.correctionFactor, 0.3);
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
                    return b2Math_1.b2Vec2.MulSV(inv_dt, this.m_linearImpulse, out);
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_angularImpulse;
                }
                SetLinearOffset(linearOffset) {
                    if (!b2Math_1.b2Vec2.IsEqualToV(linearOffset, this.m_linearOffset)) {
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
                    const rA = b2Math_1.b2Rot.MulRV(qA, b2Math_1.b2Vec2.SubVV(this.m_linearOffset, this.m_localCenterA, b2Math_1.b2Vec2.s_t0), this.m_rA);
                    // this.m_rB = b2Mul(qB, -this.m_localCenterB);
                    const rB = b2Math_1.b2Rot.MulRV(qB, b2Math_1.b2Vec2.NegV(this.m_localCenterB, b2Math_1.b2Vec2.s_t0), this.m_rB);
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
                    b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVV(cB, rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVV(cA, rA, b2Math_1.b2Vec2.s_t1), this.m_linearError);
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
                        wA -= iA * (b2Math_1.b2Vec2.CrossVV(rA, P) + this.m_angularImpulse);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_1.b2Vec2.CrossVV(rB, P) + this.m_angularImpulse);
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
                        this.m_angularImpulse = b2Math_1.b2Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
                        impulse = this.m_angularImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve linear friction
                    {
                        const rA = this.m_rA;
                        const rB = this.m_rB;
                        // b2Vec2 Cdot = vB + b2Vec2.CrossSV(wB, rB) - vA - b2Vec2.CrossSV(wA, rA) + inv_h * this.m_correctionFactor * this.m_linearError;
                        const Cdot_v2 = b2Math_1.b2Vec2.AddVV(b2Math_1.b2Vec2.SubVV(b2Math_1.b2Vec2.AddVV(vB, b2Math_1.b2Vec2.CrossSV(wB, rB, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.AddVV(vA, b2Math_1.b2Vec2.CrossSV(wA, rA, b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t1), b2Math_1.b2Vec2.s_t2), b2Math_1.b2Vec2.MulSV(inv_h * this.m_correctionFactor, this.m_linearError, b2Math_1.b2Vec2.s_t3), b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = -b2Mul(this.m_linearMass, Cdot);
                        const impulse_v2 = b2Math_1.b2Mat22.MulMV(this.m_linearMass, Cdot_v2, b2MotorJoint.SolveVelocityConstraints_s_impulse_v2).SelfNeg();
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
                        b2Math_1.b2Vec2.SubVV(this.m_linearImpulse, oldImpulse_v2, impulse_v2);
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulse_v2);
                        // wA -= iA * b2Vec2.CrossVV(rA, impulse);
                        wA -= iA * b2Math_1.b2Vec2.CrossVV(rA, impulse_v2);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulse_v2);
                        // wB += iB * b2Vec2.CrossVV(rB, impulse);
                        wB += iB * b2Math_1.b2Vec2.CrossVV(rB, impulse_v2);
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
            b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2Math_1.b2Vec2();
            b2MotorJoint.SolveVelocityConstraints_s_impulse_v2 = new b2Math_1.b2Vec2();
            b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2 = new b2Math_1.b2Vec2();
            exports_1("b2MotorJoint", b2MotorJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJNb3RvckpvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJNb3RvckpvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFtQ0Ysa0JBQUEscUJBQTZCLFNBQVEsb0JBQVU7Z0JBVzdDO29CQUNFLEtBQUssQ0FBQyxxQkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQVhsQixpQkFBWSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFakQsa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBRTFCLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBRXJCLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBRXRCLHFCQUFnQixHQUFXLEdBQUcsQ0FBQztnQkFJdEMsQ0FBQztnQkFFTSxVQUFVLENBQUMsRUFBVSxFQUFFLEVBQVU7b0JBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsb0NBQW9DO29CQUNwQywyQ0FBMkM7b0JBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUV0RSxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUM3QyxNQUFNLE1BQU0sR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUM3QyxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7Z0JBQ3ZDLENBQUM7YUFDRixDQUFBOztZQUVELGVBQUEsa0JBQTBCLFNBQVEsaUJBQU87Z0JBOEJ2QyxZQUFZLEdBQXFCO29CQUMvQixLQUFLLENBQUMsR0FBRyxDQUFDLENB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