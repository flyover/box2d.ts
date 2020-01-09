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
System.register(["../../Common/b2Settings.js", "../../Common/b2Math.js", "./b2Joint.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Joint_js_1, b2WeldJointDef, b2WeldJoint;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_js_1_1) {
                b2Settings_js_1 = b2Settings_js_1_1;
            },
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            },
            function (b2Joint_js_1_1) {
                b2Joint_js_1 = b2Joint_js_1_1;
            }
        ],
        execute: function () {
            /// Weld joint definition. You need to specify local anchor points
            /// where they are attached and the relative body angle. The position
            /// of the anchor points is important for computing the reaction torque.
            b2WeldJointDef = class b2WeldJointDef extends b2Joint_js_1.b2JointDef {
                constructor() {
                    super(b2Joint_js_1.b2JointType.e_weldJoint);
                    this.localAnchorA = new b2Math_js_1.b2Vec2();
                    this.localAnchorB = new b2Math_js_1.b2Vec2();
                    this.referenceAngle = 0;
                    this.frequencyHz = 0;
                    this.dampingRatio = 0;
                }
                Initialize(bA, bB, anchor) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                    this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
                }
            };
            exports_1("b2WeldJointDef", b2WeldJointDef);
            b2WeldJoint = class b2WeldJoint extends b2Joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_bias = 0;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_js_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_js_1.b2Vec2();
                    this.m_referenceAngle = 0;
                    this.m_gamma = 0;
                    this.m_impulse = new b2Math_js_1.b2Vec3(0, 0, 0);
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rA = new b2Math_js_1.b2Vec2();
                    this.m_rB = new b2Math_js_1.b2Vec2();
                    this.m_localCenterA = new b2Math_js_1.b2Vec2();
                    this.m_localCenterB = new b2Math_js_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = new b2Math_js_1.b2Mat33();
                    this.m_qA = new b2Math_js_1.b2Rot();
                    this.m_qB = new b2Math_js_1.b2Rot();
                    this.m_lalcA = new b2Math_js_1.b2Vec2();
                    this.m_lalcB = new b2Math_js_1.b2Vec2();
                    this.m_K = new b2Math_js_1.b2Mat33();
                    this.m_frequencyHz = b2Settings_js_1.b2Maybe(def.frequencyHz, 0);
                    this.m_dampingRatio = b2Settings_js_1.b2Maybe(def.dampingRatio, 0);
                    this.m_localAnchorA.Copy(b2Settings_js_1.b2Maybe(def.localAnchorA, b2Math_js_1.b2Vec2.ZERO));
                    this.m_localAnchorB.Copy(b2Settings_js_1.b2Maybe(def.localAnchorB, b2Math_js_1.b2Vec2.ZERO));
                    this.m_referenceAngle = b2Settings_js_1.b2Maybe(def.referenceAngle, 0);
                    this.m_impulse.SetZero();
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
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    //     [ 0       -1 0       1]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const K = this.m_K;
                    K.ex.x = mA + mB + this.m_rA.y * this.m_rA.y * iA + this.m_rB.y * this.m_rB.y * iB;
                    K.ey.x = -this.m_rA.y * this.m_rA.x * iA - this.m_rB.y * this.m_rB.x * iB;
                    K.ez.x = -this.m_rA.y * iA - this.m_rB.y * iB;
                    K.ex.y = K.ey.x;
                    K.ey.y = mA + mB + this.m_rA.x * this.m_rA.x * iA + this.m_rB.x * this.m_rB.x * iB;
                    K.ez.y = this.m_rA.x * iA + this.m_rB.x * iB;
                    K.ex.z = K.ez.x;
                    K.ey.z = K.ez.y;
                    K.ez.z = iA + iB;
                    if (this.m_frequencyHz > 0) {
                        K.GetInverse22(this.m_mass);
                        let invM = iA + iB;
                        const m = invM > 0 ? 1 / invM : 0;
                        const C = aB - aA - this.m_referenceAngle;
                        // Frequency
                        const omega = 2 * b2Settings_js_1.b2_pi * this.m_frequencyHz;
                        // Damping coefficient
                        const d = 2 * m * this.m_dampingRatio * omega;
                        // Spring stiffness
                        const k = m * omega * omega;
                        // magic formulas
                        const h = data.step.dt;
                        this.m_gamma = h * (d + h * k);
                        this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0;
                        this.m_bias = C * h * k * this.m_gamma;
                        invM += this.m_gamma;
                        this.m_mass.ez.z = invM !== 0 ? 1 / invM : 0;
                    }
                    else {
                        K.GetSymInverse33(this.m_mass);
                        this.m_gamma = 0;
                        this.m_bias = 0;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        // b2Vec2 P(m_impulse.x, m_impulse.y);
                        const P = b2WeldJoint.InitVelocityConstraints_s_P.Set(this.m_impulse.x, this.m_impulse.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_js_1.b2Vec2.CrossVV(this.m_rA, P) + this.m_impulse.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_js_1.b2Vec2.CrossVV(this.m_rB, P) + this.m_impulse.z);
                    }
                    else {
                        this.m_impulse.SetZero();
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
                    if (this.m_frequencyHz > 0) {
                        const Cdot2 = wB - wA;
                        const impulse2 = -this.m_mass.ez.z * (Cdot2 + this.m_bias + this.m_gamma * this.m_impulse.z);
                        this.m_impulse.z += impulse2;
                        wA -= iA * impulse2;
                        wB += iB * impulse2;
                        // b2Vec2 Cdot1 = vB + b2Vec2.CrossSV(wB, this.m_rB) - vA - b2Vec2.CrossSV(wA, this.m_rA);
                        const Cdot1 = b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_js_1.b2Vec2.s_t1), b2WeldJoint.SolveVelocityConstraints_s_Cdot1);
                        // b2Vec2 impulse1 = -b2Mul22(m_mass, Cdot1);
                        const impulse1 = b2Math_js_1.b2Mat33.MulM33XY(this.m_mass, Cdot1.x, Cdot1.y, b2WeldJoint.SolveVelocityConstraints_s_impulse1).SelfNeg();
                        this.m_impulse.x += impulse1.x;
                        this.m_impulse.y += impulse1.y;
                        // b2Vec2 P = impulse1;
                        const P = impulse1;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        // wA -= iA * b2Cross(m_rA, P);
                        wA -= iA * b2Math_js_1.b2Vec2.CrossVV(this.m_rA, P);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        // wB += iB * b2Cross(m_rB, P);
                        wB += iB * b2Math_js_1.b2Vec2.CrossVV(this.m_rB, P);
                    }
                    else {
                        // b2Vec2 Cdot1 = vB + b2Cross(wB, this.m_rB) - vA - b2Cross(wA, this.m_rA);
                        const Cdot1 = b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_js_1.b2Vec2.s_t1), b2WeldJoint.SolveVelocityConstraints_s_Cdot1);
                        const Cdot2 = wB - wA;
                        // b2Vec3 const Cdot(Cdot1.x, Cdot1.y, Cdot2);
                        // b2Vec3 impulse = -b2Mul(m_mass, Cdot);
                        const impulse = b2Math_js_1.b2Mat33.MulM33XYZ(this.m_mass, Cdot1.x, Cdot1.y, Cdot2, b2WeldJoint.SolveVelocityConstraints_s_impulse).SelfNeg();
                        this.m_impulse.SelfAdd(impulse);
                        // b2Vec2 P(impulse.x, impulse.y);
                        const P = b2WeldJoint.SolveVelocityConstraints_s_P.Set(impulse.x, impulse.y);
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        wA -= iA * (b2Math_js_1.b2Vec2.CrossVV(this.m_rA, P) + impulse.z);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        wB += iB * (b2Math_js_1.b2Vec2.CrossVV(this.m_rB, P) + impulse.z);
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
                    b2Math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    let positionError, angularError;
                    const K = this.m_K;
                    K.ex.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
                    K.ey.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
                    K.ez.x = -rA.y * iA - rB.y * iB;
                    K.ex.y = K.ey.x;
                    K.ey.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
                    K.ez.y = rA.x * iA + rB.x * iB;
                    K.ex.z = K.ez.x;
                    K.ey.z = K.ez.y;
                    K.ez.z = iA + iB;
                    if (this.m_frequencyHz > 0) {
                        // b2Vec2 C1 =  cB + rB - cA - rA;
                        const C1 = b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVV(cB, rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVV(cA, rA, b2Math_js_1.b2Vec2.s_t1), b2WeldJoint.SolvePositionConstraints_s_C1);
                        positionError = C1.Length();
                        angularError = 0;
                        // b2Vec2 P = -K.Solve22(C1);
                        const P = K.Solve22(C1.x, C1.y, b2WeldJoint.SolvePositionConstraints_s_P).SelfNeg();
                        // cA -= mA * P;
                        cA.SelfMulSub(mA, P);
                        aA -= iA * b2Math_js_1.b2Vec2.CrossVV(rA, P);
                        // cB += mB * P;
                        cB.SelfMulAdd(mB, P);
                        aB += iB * b2Math_js_1.b2Vec2.CrossVV(rB, P);
                    }
                    else {
                        // b2Vec2 C1 =  cB + rB - cA - rA;
                        const C1 = b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVV(cB, rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVV(cA, rA, b2Math_js_1.b2Vec2.s_t1), b2WeldJoint.SolvePositionConstraints_s_C1);
                        const C2 = aB - aA - this.m_referenceAngle;
                        positionError = C1.Length();
                        angularError = b2Math_js_1.b2Abs(C2);
                        // b2Vec3 C(C1.x, C1.y, C2);
                        // b2Vec3 impulse = -K.Solve33(C);
                        const impulse = K.Solve33(C1.x, C1.y, C2, b2WeldJoint.SolvePositionConstraints_s_impulse).SelfNeg();
                        // b2Vec2 P(impulse.x, impulse.y);
                        const P = b2WeldJoint.SolvePositionConstraints_s_P.Set(impulse.x, impulse.y);
                        // cA -= mA * P;
                        cA.SelfMulSub(mA, P);
                        aA -= iA * (b2Math_js_1.b2Vec2.CrossVV(this.m_rA, P) + impulse.z);
                        // cB += mB * P;
                        cB.SelfMulAdd(mB, P);
                        aB += iB * (b2Math_js_1.b2Vec2.CrossVV(this.m_rB, P) + impulse.z);
                    }
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return positionError <= b2Settings_js_1.b2_linearSlop && angularError <= b2Settings_js_1.b2_angularSlop;
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
                SetFrequency(hz) { this.m_frequencyHz = hz; }
                GetFrequency() { return this.m_frequencyHz; }
                SetDampingRatio(ratio) { this.m_dampingRatio = ratio; }
                GetDampingRatio() { return this.m_dampingRatio; }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2WeldJointDef = new b2WeldJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.referenceAngle = %.15f;\n", this.m_referenceAngle);
                    log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                    log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
            };
            exports_1("b2WeldJoint", b2WeldJoint);
            b2WeldJoint.InitVelocityConstraints_s_P = new b2Math_js_1.b2Vec2();
            b2WeldJoint.SolveVelocityConstraints_s_Cdot1 = new b2Math_js_1.b2Vec2();
            b2WeldJoint.SolveVelocityConstraints_s_impulse1 = new b2Math_js_1.b2Vec2();
            b2WeldJoint.SolveVelocityConstraints_s_impulse = new b2Math_js_1.b2Vec3();
            b2WeldJoint.SolveVelocityConstraints_s_P = new b2Math_js_1.b2Vec2();
            b2WeldJoint.SolvePositionConstraints_s_C1 = new b2Math_js_1.b2Vec2();
            b2WeldJoint.SolvePositionConstraints_s_P = new b2Math_js_1.b2Vec2();
            b2WeldJoint.SolvePositionConstraints_s_impulse = new b2Math_js_1.b2Vec3();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJXZWxkSm9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMldlbGRKb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBb0JGLGtFQUFrRTtZQUNsRSxxRUFBcUU7WUFDckUsd0VBQXdFO1lBQ3hFLGlCQUFBLE1BQWEsY0FBZSxTQUFRLHVCQUFVO2dCQVc1QztvQkFDRSxLQUFLLENBQUMsd0JBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFYakIsaUJBQVksR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFFcEMsaUJBQVksR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFFN0MsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBRTNCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUV4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztnQkFJaEMsQ0FBQztnQkFFTSxVQUFVLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxNQUFjO29CQUN0RCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3BELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN0RSxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxjQUFBLE1BQWEsV0FBWSxTQUFRLG9CQUFPO2dCQStCdEMsWUFBWSxHQUFvQjtvQkFDOUIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQS9CTixrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFDMUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBQzNCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBRTFCLGdCQUFnQjtvQkFDQSxtQkFBYyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUN0QyxtQkFBYyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUMvQyxxQkFBZ0IsR0FBVyxDQUFDLENBQUM7b0JBQzdCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ1gsY0FBUyxHQUFXLElBQUksa0JBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUV4RCxjQUFjO29CQUNQLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBQ3JCLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBQ1osU0FBSSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUM1QixTQUFJLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzVCLG1CQUFjLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQ3RDLG1CQUFjLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQy9DLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ1gsV0FBTSxHQUFZLElBQUksbUJBQU8sRUFBRSxDQUFDO29CQUVoQyxTQUFJLEdBQVUsSUFBSSxpQkFBSyxFQUFFLENBQUM7b0JBQzFCLFNBQUksR0FBVSxJQUFJLGlCQUFLLEVBQUUsQ0FBQztvQkFDMUIsWUFBTyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUMvQixZQUFPLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQy9CLFFBQUcsR0FBWSxJQUFJLG1CQUFPLEVBQUUsQ0FBQztvQkFLM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsdUJBQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUVuRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsa0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNqRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsa0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNqRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsdUJBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUMzQixDQUFDO2dCQUdNLHVCQUF1QixDQUFDLElBQWtCO29CQUMvQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO29CQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO29CQUMzQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDM0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzNELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7b0JBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7b0JBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7b0JBRW5DLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRWxELE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRWxELE1BQU0sRUFBRSxHQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFN0UscURBQXFEO29CQUNyRCxrQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyRSxpQkFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pDLHFEQUFxRDtvQkFDckQsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckUsaUJBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV6Qyw4QkFBOEI7b0JBQzlCLDhCQUE4QjtvQkFDOUIscUJBQXFCO29CQUVyQixTQUFTO29CQUNULG1GQUFtRjtvQkFDbkYsbUZBQW1GO29CQUNuRixtRkFBbUY7b0JBRW5GLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ2pFLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBRTNELE1BQU0sQ0FBQyxHQUFZLElBQUksQ0FBQyxHQUFHLENBQUM7b0JBQzVCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDbkYsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUMxRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzlDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNoQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ25GLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzdDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNoQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztvQkFFakIsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTt3QkFDMUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBRTVCLElBQUksSUFBSSxHQUFXLEVBQUUsR0FBRyxFQUFFLENBQUM7d0JBQzNCLE1BQU0sQ0FBQyxHQUFXLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFMUMsTUFBTSxDQUFDLEdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7d0JBRWxELFlBQVk7d0JBQ1osTUFBTSxLQUFLLEdBQVcsQ0FBQyxHQUFHLHFCQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzt3QkFFckQsc0JBQXNCO3dCQUN0QixNQUFNLENBQUMsR0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO3dCQUV0RCxtQkFBbUI7d0JBQ25CLE1BQU0sQ0FBQyxHQUFXLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUVwQyxpQkFBaUI7d0JBQ2pCLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3dCQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzt3QkFFdkMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzlDO3lCQUFNO3dCQUNMLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQzt3QkFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7cUJBQ2pCO29CQUVELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7d0JBQzFCLGtEQUFrRDt3QkFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFFMUMsc0NBQXNDO3dCQUN0QyxNQUFNLENBQUMsR0FBVyxXQUFXLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRWxHLGdCQUFnQjt3QkFDaEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxrQkFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBRTdELGdCQUFnQjt3QkFDaEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxrQkFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQzlEO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQzFCO29CQUVELHlDQUF5QztvQkFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDdEMseUNBQXlDO29CQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN4QyxDQUFDO2dCQU1NLHdCQUF3QixDQUFDLElBQWtCO29CQUNoRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRWxELE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ2pFLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBRTNELElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEVBQUU7d0JBQzFCLE1BQU0sS0FBSyxHQUFXLEVBQUUsR0FBRyxFQUFFLENBQUM7d0JBRTlCLE1BQU0sUUFBUSxHQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUM7d0JBRTdCLEVBQUUsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDO3dCQUNwQixFQUFFLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQzt3QkFFcEIsMEZBQTBGO3dCQUMxRixNQUFNLEtBQUssR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FDaEMsa0JBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLEVBQ2xELGtCQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxrQkFBTSxDQUFDLElBQUksQ0FBQyxFQUNsRCxXQUFXLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzt3QkFFaEQsNkNBQTZDO3dCQUM3QyxNQUFNLFFBQVEsR0FBVyxtQkFBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDcEksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFFL0IsdUJBQXVCO3dCQUN2QixNQUFNLENBQUMsR0FBVyxRQUFRLENBQUM7d0JBRTNCLGdCQUFnQjt3QkFDaEIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLCtCQUErQjt3QkFDL0IsRUFBRSxJQUFJLEVBQUUsR0FBRyxrQkFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUV4QyxnQkFBZ0I7d0JBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNyQiwrQkFBK0I7d0JBQy9CLEVBQUUsSUFBSSxFQUFFLEdBQUcsa0JBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDekM7eUJBQU07d0JBQ0wsNEVBQTRFO3dCQUM1RSxNQUFNLEtBQUssR0FBVyxrQkFBTSxDQUFDLEtBQUssQ0FDaEMsa0JBQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLEVBQ2xELGtCQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxrQkFBTSxDQUFDLElBQUksQ0FBQyxFQUNsRCxXQUFXLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzt3QkFDaEQsTUFBTSxLQUFLLEdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQzt3QkFDOUIsOENBQThDO3dCQUU5Qyx5Q0FBeUM7d0JBQ3pDLE1BQU0sT0FBTyxHQUFXLG1CQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDMUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBRWhDLGtDQUFrQzt3QkFDbEMsTUFBTSxDQUFDLEdBQVcsV0FBVyxDQUFDLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFckYsZ0JBQWdCO3dCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLGtCQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV0RCxnQkFBZ0I7d0JBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsa0JBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZEO29CQUVELHlDQUF5QztvQkFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDdEMseUNBQXlDO29CQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN4QyxDQUFDO2dCQUtNLHdCQUF3QixDQUFDLElBQWtCO29CQUNoRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELElBQUksRUFBRSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakQsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxJQUFJLEVBQUUsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRWpELE1BQU0sRUFBRSxHQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFN0UsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDakUsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFFM0QsMERBQTBEO29CQUMxRCxrQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyRSxNQUFNLEVBQUUsR0FBVyxpQkFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVELDBEQUEwRDtvQkFDMUQsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckUsTUFBTSxFQUFFLEdBQVcsaUJBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUU1RCxJQUFJLGFBQXFCLEVBQUUsWUFBb0IsQ0FBQztvQkFFaEQsTUFBTSxDQUFDLEdBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQztvQkFDNUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3ZELENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUM5QyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNoQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3ZELENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUMvQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7b0JBRWpCLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEVBQUU7d0JBQzFCLGtDQUFrQzt3QkFDbEMsTUFBTSxFQUFFLEdBQ04sa0JBQU0sQ0FBQyxLQUFLLENBQ1Ysa0JBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxrQkFBTSxDQUFDLElBQUksQ0FBQyxFQUNqQyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLEVBQ2pDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO3dCQUMvQyxhQUFhLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUM1QixZQUFZLEdBQUcsQ0FBQyxDQUFDO3dCQUVqQiw2QkFBNkI7d0JBQzdCLE1BQU0sQ0FBQyxHQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUU1RixnQkFBZ0I7d0JBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixFQUFFLElBQUksRUFBRSxHQUFHLGtCQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFakMsZ0JBQWdCO3dCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsRUFBRSxJQUFJLEVBQUUsR0FBRyxrQkFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ2xDO3lCQUFNO3dCQUNMLGtDQUFrQzt3QkFDbEMsTUFBTSxFQUFFLEdBQ04sa0JBQU0sQ0FBQyxLQUFLLENBQ1Ysa0JBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxrQkFBTSxDQUFDLElBQUksQ0FBQyxFQUNqQyxrQkFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLEVBQ2pDLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO3dCQUMvQyxNQUFNLEVBQUUsR0FBVyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFFbkQsYUFBYSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFDNUIsWUFBWSxHQUFHLGlCQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXpCLDRCQUE0Qjt3QkFFNUIsa0NBQWtDO3dCQUNsQyxNQUFNLE9BQU8sR0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsV0FBVyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBRTVHLGtDQUFrQzt3QkFDbEMsTUFBTSxDQUFDLEdBQVcsV0FBVyxDQUFDLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFFckYsZ0JBQWdCO3dCQUNoQixFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLGtCQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUV0RCxnQkFBZ0I7d0JBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsa0JBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZEO29CQUVELHdDQUF3QztvQkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDckMsd0NBQXdDO29CQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUVyQyxPQUFPLGFBQWEsSUFBSSw2QkFBYSxJQUFJLFlBQVksSUFBSSw4QkFBYyxDQUFDO2dCQUMxRSxDQUFDO2dCQUVNLFVBQVUsQ0FBZSxHQUFNO29CQUNwQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzlELENBQUM7Z0JBRU0sVUFBVSxDQUFlLEdBQU07b0JBQ3BDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDOUQsQ0FBQztnQkFFTSxnQkFBZ0IsQ0FBZSxNQUFjLEVBQUUsR0FBTTtvQkFDMUQsZ0RBQWdEO29CQUNoRCxxQkFBcUI7b0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDbEMsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFFTSxpQkFBaUIsQ0FBQyxNQUFjO29CQUNyQyxPQUFPLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFFTSxlQUFlLEtBQXVCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBRW5FLGVBQWUsS0FBdUIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFFbkUsaUJBQWlCLEtBQWEsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUU3RCxZQUFZLENBQUMsRUFBVSxJQUFVLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0QsWUFBWSxLQUFhLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBRXJELGVBQWUsQ0FBQyxLQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxlQUFlLEtBQUssT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFFakQsSUFBSSxDQUFDLEdBQTZDO29CQUN2RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztvQkFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7b0JBRTFDLEdBQUcsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO29CQUM1RCxHQUFHLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQzFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDMUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDdkYsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVGLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RixHQUFHLENBQUMsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQzdELEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3ZELEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQ3pELEdBQUcsQ0FBQyxnREFBZ0QsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3RFLENBQUM7YUFDRixDQUFBOztZQWhVZ0IsdUNBQTJCLEdBQUcsSUFBSSxrQkFBTSxFQUFFLENBQUM7WUEwRzNDLDRDQUFnQyxHQUFHLElBQUksa0JBQU0sRUFBRSxDQUFDO1lBQ2hELCtDQUFtQyxHQUFHLElBQUksa0JBQU0sRUFBRSxDQUFDO1lBQ25ELDhDQUFrQyxHQUFHLElBQUksa0JBQU0sRUFBRSxDQUFDO1lBQ2xELHdDQUE0QixHQUFHLElBQUksa0JBQU0sRUFBRSxDQUFDO1lBeUU1Qyx5Q0FBNkIsR0FBRyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztZQUM3Qyx3Q0FBNEIsR0FBRyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztZQUM1Qyw4Q0FBa0MsR0FBRyxJQUFJLGtCQUFNLEVBQUUsQ0FBQyJ9