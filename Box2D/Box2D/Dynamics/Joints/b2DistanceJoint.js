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
System.register(["../../Common/b2Settings", "../../Common/b2Math", "./b2Joint"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2Math_1, b2Joint_1, b2DistanceJointDef, b2DistanceJoint;
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
            /// Distance joint definition. This requires defining an
            /// anchor point on both bodies and the non-zero length of the
            /// distance joint. The definition uses local anchor points
            /// so that the initial configuration can violate the constraint
            /// slightly. This helps when saving and loading a game.
            /// @warning Do not use a zero or short length.
            b2DistanceJointDef = class b2DistanceJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(3 /* e_distanceJoint */);
                    this.localAnchorA = new b2Math_1.b2Vec2();
                    this.localAnchorB = new b2Math_1.b2Vec2();
                    this.length = 1;
                    this.frequencyHz = 0;
                    this.dampingRatio = 0;
                }
                Initialize(b1, b2, anchor1, anchor2) {
                    this.bodyA = b1;
                    this.bodyB = b2;
                    this.bodyA.GetLocalPoint(anchor1, this.localAnchorA);
                    this.bodyB.GetLocalPoint(anchor2, this.localAnchorB);
                    this.length = b2Math_1.b2Vec2.DistanceVV(anchor1, anchor2);
                    this.frequencyHz = 0;
                    this.dampingRatio = 0;
                }
            };
            exports_1("b2DistanceJointDef", b2DistanceJointDef);
            b2DistanceJoint = class b2DistanceJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_bias = 0;
                    // Solver shared
                    this.m_localAnchorA = new b2Math_1.b2Vec2();
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_gamma = 0;
                    this.m_impulse = 0;
                    this.m_length = 0;
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
                    this.m_qA = new b2Math_1.b2Rot();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_lalcA = new b2Math_1.b2Vec2();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_localAnchorA.Copy(def.localAnchorA);
                    this.m_localAnchorB.Copy(def.localAnchorB);
                    this.m_length = def.length;
                }
                GetAnchorA(out) {
                    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    return out.Set(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                GetLocalAnchorA() { return this.m_localAnchorA; }
                GetLocalAnchorB() { return this.m_localAnchorB; }
                SetLength(length) {
                    this.m_length = length;
                }
                Length() {
                    return this.m_length;
                }
                SetFrequency(hz) {
                    this.m_frequencyHz = hz;
                }
                GetFrequency() {
                    return this.m_frequencyHz;
                }
                SetDampingRatio(ratio) {
                    this.m_dampingRatio = ratio;
                }
                GetDampingRatio() {
                    return this.m_dampingRatio;
                }
                Dump(log) {
                    const indexA = this.m_bodyA.m_islandIndex;
                    const indexB = this.m_bodyB.m_islandIndex;
                    log("  const jd: b2DistanceJointDef = new b2DistanceJointDef();\n");
                    log("  jd.bodyA = bodies[%d];\n", indexA);
                    log("  jd.bodyB = bodies[%d];\n", indexB);
                    log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));
                    log("  jd.localAnchorA.Set(%.15f, %.15f);\n", this.m_localAnchorA.x, this.m_localAnchorA.y);
                    log("  jd.localAnchorB.Set(%.15f, %.15f);\n", this.m_localAnchorB.x, this.m_localAnchorB.y);
                    log("  jd.length = %.15f;\n", this.m_length);
                    log("  jd.frequencyHz = %.15f;\n", this.m_frequencyHz);
                    log("  jd.dampingRatio = %.15f;\n", this.m_dampingRatio);
                    log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
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
                    // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
                    const qA = this.m_qA.SetAngle(aA), qB = this.m_qB.SetAngle(aB);
                    // m_rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
                    b2Math_1.b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
                    // m_rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // m_u = cB + m_rB - cA - m_rA;
                    this.m_u.x = cB.x + this.m_rB.x - cA.x - this.m_rA.x;
                    this.m_u.y = cB.y + this.m_rB.y - cA.y - this.m_rA.y;
                    // Handle singularity.
                    const length = this.m_u.Length();
                    if (length > b2Settings_1.b2_linearSlop) {
                        this.m_u.SelfMul(1 / length);
                    }
                    else {
                        this.m_u.SetZero();
                    }
                    // float32 crAu = b2Cross(m_rA, m_u);
                    const crAu = b2Math_1.b2Vec2.CrossVV(this.m_rA, this.m_u);
                    // float32 crBu = b2Cross(m_rB, m_u);
                    const crBu = b2Math_1.b2Vec2.CrossVV(this.m_rB, this.m_u);
                    // float32 invMass = m_invMassA + m_invIA * crAu * crAu + m_invMassB + m_invIB * crBu * crBu;
                    let invMass = this.m_invMassA + this.m_invIA * crAu * crAu + this.m_invMassB + this.m_invIB * crBu * crBu;
                    // Compute the effective mass matrix.
                    this.m_mass = invMass !== 0 ? 1 / invMass : 0;
                    if (this.m_frequencyHz > 0) {
                        const C = length - this.m_length;
                        // Frequency
                        const omega = 2 * b2Settings_1.b2_pi * this.m_frequencyHz;
                        // Damping coefficient
                        const d = 2 * this.m_mass * this.m_dampingRatio * omega;
                        // Spring stiffness
                        const k = this.m_mass * omega * omega;
                        // magic formulas
                        const h = data.step.dt;
                        this.m_gamma = h * (d + h * k);
                        this.m_gamma = this.m_gamma !== 0 ? 1 / this.m_gamma : 0;
                        this.m_bias = C * h * k * this.m_gamma;
                        invMass += this.m_gamma;
                        this.m_mass = invMass !== 0 ? 1 / invMass : 0;
                    }
                    else {
                        this.m_gamma = 0;
                        this.m_bias = 0;
                    }
                    if (data.step.warmStarting) {
                        // Scale the impulse to support a variable time step.
                        this.m_impulse *= data.step.dtRatio;
                        // b2Vec2 P = m_impulse * m_u;
                        const P = b2Math_1.b2Vec2.MulSV(this.m_impulse, this.m_u, b2DistanceJoint.InitVelocityConstraints_s_P);
                        // vA -= m_invMassA * P;
                        vA.SelfMulSub(this.m_invMassA, P);
                        // wA -= m_invIA * b2Cross(m_rA, P);
                        wA -= this.m_invIA * b2Math_1.b2Vec2.CrossVV(this.m_rA, P);
                        // vB += m_invMassB * P;
                        vB.SelfMulAdd(this.m_invMassB, P);
                        // wB += m_invIB * b2Cross(m_rB, P);
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
                    // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
                    const vpA = b2Math_1.b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2DistanceJoint.SolveVelocityConstraints_s_vpA);
                    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
                    const vpB = b2Math_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2DistanceJoint.SolveVelocityConstraints_s_vpB);
                    // float32 Cdot = b2Dot(m_u, vpB - vpA);
                    const Cdot = b2Math_1.b2Vec2.DotVV(this.m_u, b2Math_1.b2Vec2.SubVV(vpB, vpA, b2Math_1.b2Vec2.s_t0));
                    const impulse = (-this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse));
                    this.m_impulse += impulse;
                    // b2Vec2 P = impulse * m_u;
                    const P = b2Math_1.b2Vec2.MulSV(impulse, this.m_u, b2DistanceJoint.SolveVelocityConstraints_s_P);
                    // vA -= m_invMassA * P;
                    vA.SelfMulSub(this.m_invMassA, P);
                    // wA -= m_invIA * b2Cross(m_rA, P);
                    wA -= this.m_invIA * b2Math_1.b2Vec2.CrossVV(this.m_rA, P);
                    // vB += m_invMassB * P;
                    vB.SelfMulAdd(this.m_invMassB, P);
                    // wB += m_invIB * b2Cross(m_rB, P);
                    wB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(this.m_rB, P);
                    // data.velocities[this.m_indexA].v = vA;
                    data.velocities[this.m_indexA].w = wA;
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    if (this.m_frequencyHz > 0) {
                        // There is no position correction for soft distance constraints.
                        return true;
                    }
                    const cA = data.positions[this.m_indexA].c;
                    let aA = data.positions[this.m_indexA].a;
                    const cB = data.positions[this.m_indexB].c;
                    let aB = data.positions[this.m_indexB].a;
                    // const qA: b2Rot = new b2Rot(aA), qB: b2Rot = new b2Rot(aB);
                    ///const qA: b2Rot = this.m_qA.SetAngle(aA), qB: b2Rot = this.m_qB.SetAngle(aB);
                    // b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_localCenterA);
                    const rA = b2Math_1.b2Rot.MulRV(this.m_qA, this.m_lalcA, this.m_rA); // use m_rA
                    // b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_localCenterB);
                    const rB = b2Math_1.b2Rot.MulRV(this.m_qB, this.m_lalcB, this.m_rB); // use m_rB
                    // b2Vec2 u = cB + rB - cA - rA;
                    const u = this.m_u; // use m_u
                    u.x = cB.x + rB.x - cA.x - rA.x;
                    u.y = cB.y + rB.y - cA.y - rA.y;
                    // float32 length = u.Normalize();
                    const length = this.m_u.Normalize();
                    // float32 C = length - m_length;
                    let C = length - this.m_length;
                    C = b2Math_1.b2Clamp(C, (-b2Settings_1.b2_maxLinearCorrection), b2Settings_1.b2_maxLinearCorrection);
                    const impulse = (-this.m_mass * C);
                    // b2Vec2 P = impulse * u;
                    const P = b2Math_1.b2Vec2.MulSV(impulse, u, b2DistanceJoint.SolvePositionConstraints_s_P);
                    // cA -= m_invMassA * P;
                    cA.SelfMulSub(this.m_invMassA, P);
                    // aA -= m_invIA * b2Cross(rA, P);
                    aA -= this.m_invIA * b2Math_1.b2Vec2.CrossVV(rA, P);
                    // cB += m_invMassB * P;
                    cB.SelfMulAdd(this.m_invMassB, P);
                    // aB += m_invIB * b2Cross(rB, P);
                    aB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(rB, P);
                    // data.positions[this.m_indexA].c = cA;
                    data.positions[this.m_indexA].a = aA;
                    // data.positions[this.m_indexB].c = cB;
                    data.positions[this.m_indexB].a = aB;
                    return b2Math_1.b2Abs(C) < b2Settings_1.b2_linearSlop;
                }
            };
            b2DistanceJoint.InitVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2DistanceJoint.SolveVelocityConstraints_s_vpA = new b2Math_1.b2Vec2();
            b2DistanceJoint.SolveVelocityConstraints_s_vpB = new b2Math_1.b2Vec2();
            b2DistanceJoint.SolveVelocityConstraints_s_P = new b2Math_1.b2Vec2();
            b2DistanceJoint.SolvePositionConstraints_s_P = new b2Math_1.b2Vec2();
            exports_1("b2DistanceJoint", b2DistanceJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJEaXN0YW5jZUpvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJEaXN0YW5jZUpvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFRRix3REFBd0Q7WUFDeEQsOERBQThEO1lBQzlELDJEQUEyRDtZQUMzRCxnRUFBZ0U7WUFDaEUsd0RBQXdEO1lBQ3hELCtDQUErQztZQUMvQyxxQkFBQSx3QkFBZ0MsU0FBUSxvQkFBVTtnQkFPaEQ7b0JBQ0UsS0FBSyx5QkFBNkIsQ0FBQztvQkFQOUIsaUJBQVksR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUNwQyxpQkFBWSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3BDLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixpQkFBWSxHQUFXLENBQUMsQ0FBQztnQkFJaEMsQ0FBQztnQkFFTSxVQUFVLENBQUMsRUFBVSxFQUFFLEVBQVUsRUFBRSxPQUFlLEVBQUUsT0FBZTtvQkFDeEUsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNyRCxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNsRCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7YUFDRixDQUFB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