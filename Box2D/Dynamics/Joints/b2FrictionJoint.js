/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
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
    var b2Settings_js_1, b2Math_js_1, b2Joint_js_1, b2FrictionJointDef, b2FrictionJoint;
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
            /// Friction joint definition.
            b2FrictionJointDef = class b2FrictionJointDef extends b2Joint_js_1.b2JointDef {
                constructor() {
                    super(b2Joint_js_1.b2JointType.e_frictionJoint);
                    this.localAnchorA = new b2Math_js_1.b2Vec2();
                    this.localAnchorB = new b2Math_js_1.b2Vec2();
                    this.maxForce = 0;
                    this.maxTorque = 0;
                }
                Initialize(bA, bB, anchor) {
                    this.bodyA = bA;
                    this.bodyB = bB;
                    this.bodyA.GetLocalPoint(anchor, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor, this.localAnchorB);
                }
            };
            exports_1("b2FrictionJointDef", b2FrictionJointDef);
            b2FrictionJoint = class b2FrictionJoint extends b2Joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_localAnchorA = new b2Math_js_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_js_1.b2Vec2();
                    // Solver shared
                    this.m_linearImpulse = new b2Math_js_1.b2Vec2();
                    this.m_angularImpulse = 0;
                    this.m_maxForce = 0;
                    this.m_maxTorque = 0;
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
                    this.m_linearMass = new b2Math_js_1.b2Mat22();
                    this.m_angularMass = 0;
                    this.m_qA = new b2Math_js_1.b2Rot();
                    this.m_qB = new b2Math_js_1.b2Rot();
                    this.m_lalcA = new b2Math_js_1.b2Vec2();
                    this.m_lalcB = new b2Math_js_1.b2Vec2();
                    this.m_K = new b2Math_js_1.b2Mat22();
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_linearImpulse.SetZero();
                    this.m_maxForce = b2Settings_js_1.b2Maybe(def.maxForce, 0);
                    this.m_maxTorque = b2Settings_js_1.b2Maybe(def.maxTorque, 0);
                    this.m_linearMass.SetZero();
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
                    // const cA: b2Vec2 = data.positions[this.m_indexA].c;
                    const aA = data.positions[this.m_indexA].a;
                    const vA = data.velocities[this.m_indexA].v;
                    let wA = data.velocities[this.m_indexA].w;
                    // const cB: b2Vec2 = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    // Compute the effective mass matrix.
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_js_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_js_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // J = [-I -r1_skew I r2_skew]
                    //     [ 0       -1 0       1]
                    // r_skew = [-ry; rx]
                    // Matlab
                    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
                    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
                    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]
                    const mA = this.m_invMassA, mB = this.m_invMassB;
                    const iA = this.m_invIA, iB = this.m_invIB;
                    const K = this.m_K; // new b2Mat22();
                    K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
                    K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
                    K.ey.x = K.ex.y;
                    K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;
                    K.GetInverse(this.m_linearMass);
                    this.m_angularMass = iA + iB;
                    if (this.m_angularMass > 0) {
                        this.m_angularMass = 1 / this.m_angularMass;
                    }
                    if (data.step.warmStarting) {
                        // Scale impulses to support a variable time step.
                        // m_linearImpulse *= data.step.dtRatio;
                        this.m_linearImpulse.SelfMul(data.step.dtRatio);
                        this.m_angularImpulse *= data.step.dtRatio;
                        // const P: b2Vec2(m_linearImpulse.x, m_linearImpulse.y);
                        const P = this.m_linearImpulse;
                        // vA -= mA * P;
                        vA.SelfMulSub(mA, P);
                        // wA -= iA * (b2Cross(m_rA, P) + m_angularImpulse);
                        wA -= iA * (b2Math_js_1.b2Vec2.CrossVV(this.m_rA, P) + this.m_angularImpulse);
                        // vB += mB * P;
                        vB.SelfMulAdd(mB, P);
                        // wB += iB * (b2Cross(m_rB, P) + m_angularImpulse);
                        wB += iB * (b2Math_js_1.b2Vec2.CrossVV(this.m_rB, P) + this.m_angularImpulse);
                    }
                    else {
                        this.m_linearImpulse.SetZero();
                        this.m_angularImpulse = 0;
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
                    const h = data.step.dt;
                    // Solve angular friction
                    {
                        const Cdot = wB - wA;
                        let impulse = (-this.m_angularMass * Cdot);
                        const oldImpulse = this.m_angularImpulse;
                        const maxImpulse = h * this.m_maxTorque;
                        this.m_angularImpulse = b2Math_js_1.b2Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
                        impulse = this.m_angularImpulse - oldImpulse;
                        wA -= iA * impulse;
                        wB += iB * impulse;
                    }
                    // Solve linear friction
                    {
                        // b2Vec2 Cdot = vB + b2Cross(wB, m_rB) - vA - b2Cross(wA, m_rA);
                        const Cdot_v2 = b2Math_js_1.b2Vec2.SubVV(b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2Math_js_1.b2Vec2.s_t1), b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2);
                        // b2Vec2 impulse = -b2Mul(m_linearMass, Cdot);
                        const impulseV = b2Math_js_1.b2Mat22.MulMV(this.m_linearMass, Cdot_v2, b2FrictionJoint.SolveVelocityConstraints_s_impulseV).SelfNeg();
                        // b2Vec2 oldImpulse = m_linearImpulse;
                        const oldImpulseV = b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV.Copy(this.m_linearImpulse);
                        // m_linearImpulse += impulse;
                        this.m_linearImpulse.SelfAdd(impulseV);
                        const maxImpulse = h * this.m_maxForce;
                        if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
                            this.m_linearImpulse.Normalize();
                            this.m_linearImpulse.SelfMul(maxImpulse);
                        }
                        // impulse = m_linearImpulse - oldImpulse;
                        b2Math_js_1.b2Vec2.SubVV(this.m_linearImpulse, oldImpulseV, impulseV);
                        // vA -= mA * impulse;
                        vA.SelfMulSub(mA, impulseV);
                        // wA -= iA * b2Cross(m_rA, impulse);
                        wA -= iA * b2Math_js_1.b2Vec2.CrossVV(this.m_rA, impulseV);
                        // vB += mB * impulse;
                        vB.SelfMulAdd(mB, impulseV);
                        // wB += iB * b2Cross(m_rB, impulse);
                        wB += iB * b2Math_js_1.b2Vec2.CrossVV(this.m_rB, impulseV);
                    }
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    return true;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    out.x = inv_dt * this.m_linearImpulse.x;
                    out.y = inv_dt * this.m_linearImpulse.y;
                    return out;
                }
                GetReactionTorque(inv_dt) {
                    return inv_dt * this.m_angularImpulse;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                SetMaxForce(force) {
                    this.m_maxForce = force;
                }
                GetMaxForce() {
                    return this.m_maxForce;
                }
                SetMaxTorque(torque) {
                    this.m_maxTorque = torque;
                }
                GetMaxTorque() {
                    return this.m_maxTorque;
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2FrictionJointDef = new b2FrictionJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.maxForce = %.15f;\n", this.m_maxForce);
                    log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
            };
            exports_1("b2FrictionJoint", b2FrictionJoint);
            b2FrictionJoint.SolveVelocityConstraints_s_Cdot_v2 = new b2Math_js_1.b2Vec2();
            b2FrictionJoint.SolveVelocityConstraints_s_impulseV = new b2Math_js_1.b2Vec2();
            b2FrictionJoint.SolveVelocityConstraints_s_oldImpulseV = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJGcmljdGlvbkpvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJGcmljdGlvbkpvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFrQkYsOEJBQThCO1lBQzlCLHFCQUFBLE1BQWEsa0JBQW1CLFNBQVEsdUJBQVU7Z0JBU2hEO29CQUNFLEtBQUssQ0FBQyx3QkFBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQVRyQixpQkFBWSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUVwQyxpQkFBWSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUU3QyxhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUVyQixjQUFTLEdBQVcsQ0FBQyxDQUFDO2dCQUk3QixDQUFDO2dCQUVNLFVBQVUsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLE1BQWM7b0JBQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDdEQsQ0FBQzthQUNGLENBQUE7O1lBRUQsa0JBQUEsTUFBYSxlQUFnQixTQUFRLG9CQUFPO2dCQThCMUMsWUFBWSxHQUF3QjtvQkFDbEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQTlCRyxtQkFBYyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUN0QyxtQkFBYyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUV0RCxnQkFBZ0I7b0JBQ0Esb0JBQWUsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDaEQs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