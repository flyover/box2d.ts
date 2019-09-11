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
    var b2Settings_1, b2Math_1, b2Joint_1, b2RopeJointDef, b2RopeJoint;
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
            /// Rope joint definition. This requires two body anchor points and
            /// a maximum lengths.
            /// Note: by default the connected objects will not collide.
            /// see collideConnected in b2JointDef.
            b2RopeJointDef = class b2RopeJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(b2Joint_1.b2JointType.e_ropeJoint);
                    this.localAnchorA = new b2Math_1.b2Vec2(-1, 0);
                    this.localAnchorB = new b2Math_1.b2Vec2(1, 0);
                    this.maxLength = 0;
                }
            };
            exports_1("b2RopeJointDef", b2RopeJointDef);
            b2RopeJoint = class b2RopeJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    // Solver shared
                    this.m_localAnchorA = new b2Math_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_maxLength = 0;
                    this.m_length = 0;
                    this.m_impulse = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_u = new b2Math_1.b2Vec2();
                    this.m_rA = new b2Math_1.b2Vec2();
                    this.m_rB = new b2Math_1.b2Vec2();
                    this.m_localCenterA = new b2Math_1.b2Vec2();
                    this.m_localCenterB = new b2Math_1.b2Vec2();
                    this.m_invMassA = 0;
                    this.m_invMassB = 0;
                    this.m_invIA = 0;
                    this.m_invIB = 0;
                    this.m_mass = 0;
                    this.m_state = b2Joint_1.b2LimitState.e_inactiveLimit;
                    this.m_qA = new b2Math_1.b2Rot();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_lalcA = new b2Math_1.b2Vec2();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_localAnchorA.Copy(b2Settings_1.b2Maybe(def.localAnchorA, new b2Math_1.b2Vec2(-1, 0)));
                    this.m_localAnchorB.Copy(b2Settings_1.b2Maybe(def.localAnchorB, new b2Math_1.b2Vec2(1, 0)));
                    this.m_maxLength = b2Settings_1.b2Maybe(def.maxLength, 0);
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
                    // this.m_rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // this.m_rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // this.m_u = cB + this.m_rB - cA - this.m_rA;
                    this.m_u.Copy(cB).SelfAdd(this.m_rB).SelfSub(cA).SelfSub(this.m_rA);
                    this.m_length = this.m_u.Length();
                    const C = this.m_length - this.m_maxLength;
                    if (C > 0) {
                        this.m_state = b2Joint_1.b2LimitState.e_atUpperLimit;
                    }
                    else {
                        this.m_state = b2Joint_1.b2LimitState.e_inactiveLimit;
                    }
                    if (this.m_length > b2Settings_1.b2_linearSlop) {
                        this.m_u.SelfMul(1 / this.m_length);
                    }
                    else {
                        this.m_u.SetZero();
                        this.m_mass = 0;
                        this.m_impulse = 0;
                        return;
                    }
                    // Compute effective mass.
                    const crA = b2Math_1.b2Vec2.CrossVV(this.m_rA, this.m_u);
                    const crB = b2Math_1.b2Vec2.CrossVV(this.m_rB, this.m_u);
                    const invMass = this.m_invMassA + this.m_invIA * crA * crA + this.m_invMassB + this.m_invIB * crB * crB;
                    this.m_mass = invMass !== 0 ? 1 / invMass : 0;
                    if (data.step.warmStarting) {
                        // Scale the impulse to support a variable time step.
                        this.m_impulse *= data.step.dtRatio;
                        // b2Vec2 P = m_impulse * m_u;
                        const P = b2Math_1.b2Vec2.MulSV(this.m_impulse, this.m_u, b2RopeJoint.InitVelocityConstraints_s_P);
                        // vA -= m_invMassA * P;
                        vA.SelfMulSub(this.m_invMassA, P);
                        wA -= this.m_invIA * b2Math_1.b2Vec2.CrossVV(this.m_rA, P);
                        // vB += m_invMassB * P;
                        vB.SelfMulAdd(this.m_invMassB, P);
                        wB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(this.m_rB, P);
                    }
                    else {
                        this.m_impulse = 0;
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
                    // Cdot = dot(u, v + cross(w, r))
                    // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
                    const vpA = b2Math_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2RopeJoint.SolveVelocityConstraints_s_vpA);
                    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
                    const vpB = b2Math_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2RopeJoint.SolveVelocityConstraints_s_vpB);
                    // float32 C = m_length - m_maxLength;
                    const C = this.m_length - this.m_maxLength;
                    // float32 Cdot = b2Dot(m_u, vpB - vpA);
                    let Cdot = b2Math_1.b2Vec2.DotVV(this.m_u, b2Math_1.b2Vec2.SubVV(vpB, vpA, b2Math_1.b2Vec2.s_t0));
                    // Predictive constraint.
                    if (C < 0) {
                        Cdot += data.step.inv_dt * C;
                    }
                    let impulse = -this.m_mass * Cdot;
                    const oldImpulse = this.m_impulse;
                    this.m_impulse = b2Math_1.b2Min(0, this.m_impulse + impulse);
                    impulse = this.m_impulse - oldImpulse;
                    // b2Vec2 P = impulse * m_u;
                    const P = b2Math_1.b2Vec2.MulSV(impulse, this.m_u, b2RopeJoint.SolveVelocityConstraints_s_P);
                    // vA -= m_invMassA * P;
                    vA.SelfMulSub(this.m_invMassA, P);
                    wA -= this.m_invIA * b2Math_1.b2Vec2.CrossVV(this.m_rA, P);
                    // vB += m_invMassB * P;
                    vB.SelfMulAdd(this.m_invMassB, P);
                    wB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(this.m_rB, P);
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
                    // b2Vec2 rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    const rA = b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // b2Vec2 rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    const rB = b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // b2Vec2 u = cB + rB - cA - rA;
                    const u = this.m_u.Copy(cB).SelfAdd(rB).SelfSub(cA).SelfSub(rA);
                    const length = u.Normalize();
                    let C = length - this.m_maxLength;
                    C = b2Math_1.b2Clamp(C, 0, b2Settings_1.b2_maxLinearCorrection);
                    const impulse = -this.m_mass * C;
                    // b2Vec2 P = impulse * u;
                    const P = b2Math_1.b2Vec2.MulSV(impulse, u, b2RopeJoint.SolvePositionConstraints_s_P);
                    // cA -= m_invMassA * P;
                    cA.SelfMulSub(this.m_invMassA, P);
                    aA -= this.m_invIA * b2Math_1.b2Vec2.CrossVV(rA, P);
                    // cB += m_invMassB * P;
                    cB.SelfMulAdd(this.m_invMassB, P);
                    aB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(rB, P);
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return length - this.m_maxLength < b2Settings_1.b2_linearSlop;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    // return out.Set(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
                    return b2Math_1.b2Vec2.MulSV((inv_dt * this.m_impulse), this.m_u, out);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                SetMaxLength(length) { this.m_maxLength = length; }
                GetMaxLength() {
                    return this.m_maxLength;
                }
                GetLimitState() {
                    return this.m_state;
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2RopeJointDef = new b2RopeJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.maxLength = %.15f;\n", this.m_maxLength);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
                }
            };
            exports_1("b2RopeJoint", b2RopeJoint);
            b2RopeJoint.InitVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2RopeJoint.SolveVelocityConstraints_s_vpA = new b2Math_1.b2Vec2();
            b2RopeJoint.SolveVelocityConstraints_s_vpB = new b2Math_1.b2Vec2();
            b2RopeJoint.SolveVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2RopeJoint.SolvePositionConstraints_s_P = new b2Math_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJSb3BlSm9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMlJvcGVKb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBZUYsbUVBQW1FO1lBQ25FLHNCQUFzQjtZQUN0Qiw0REFBNEQ7WUFDNUQsdUNBQXVDO1lBQ3ZDLGlCQUFBLE1BQWEsY0FBZSxTQUFRLG9CQUFVO2dCQU81QztvQkFDRSxLQUFLLENBQUMscUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFQakIsaUJBQVksR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFekMsaUJBQVksR0FBVyxJQUFJLGVBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRWpELGNBQVMsR0FBVyxDQUFDLENBQUM7Z0JBSTdCLENBQUM7YUFDRixDQUFBOztZQUVELGNBQUEsTUFBYSxXQUFZLFNBQVEsaUJBQU87Z0JBNEJ0QyxZQUFZLEdBQW9CO29CQUM5QixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBNUJiLGdCQUFnQjtvQkFDQSxtQkFBYyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3RDLG1CQUFjLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDL0MsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBQ3JCLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBRTdCLGNBQWM7b0JBQ1AsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDWixRQUFHLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDM0IsU0FBSSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQzVCLFNBQUksR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUM1QixtQkFBYyxHQUFXLElB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