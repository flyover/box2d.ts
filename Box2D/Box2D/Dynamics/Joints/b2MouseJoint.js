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
    var b2Settings_1, b2Math_1, b2Joint_1, b2MouseJointDef, b2MouseJoint;
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
            /// Mouse joint definition. This requires a world target point,
            /// tuning parameters, and the time step.
            b2MouseJointDef = class b2MouseJointDef extends b2Joint_1.b2JointDef {
                constructor() {
                    super(b2Joint_1.b2JointType.e_mouseJoint);
                    this.target = new b2Math_1.b2Vec2();
                    this.maxForce = 0;
                    this.frequencyHz = 5;
                    this.dampingRatio = 0.7;
                }
            };
            exports_1("b2MouseJointDef", b2MouseJointDef);
            b2MouseJoint = class b2MouseJoint extends b2Joint_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_localAnchorB = null;
                    this.m_targetA = null;
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_beta = 0;
                    // Solver shared
                    this.m_impulse = null;
                    this.m_maxForce = 0;
                    this.m_gamma = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rB = null;
                    this.m_localCenterB = null;
                    this.m_invMassB = 0;
                    this.m_invIB = 0;
                    this.m_mass = null;
                    this.m_C = null;
                    this.m_qB = null;
                    this.m_lalcB = null;
                    this.m_K = null;
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_targetA = new b2Math_1.b2Vec2();
                    this.m_impulse = new b2Math_1.b2Vec2();
                    this.m_rB = new b2Math_1.b2Vec2();
                    this.m_localCenterB = new b2Math_1.b2Vec2();
                    this.m_mass = new b2Math_1.b2Mat22();
                    this.m_C = new b2Math_1.b2Vec2();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_K = new b2Math_1.b2Mat22();
                    ///b2Assert(def.target.IsValid());
                    ///b2Assert(b2IsValid(def.maxForce) && def.maxForce >= 0);
                    ///b2Assert(b2IsValid(def.frequencyHz) && def.frequencyHz >= 0);
                    ///b2Assert(b2IsValid(def.dampingRatio) && def.dampingRatio >= 0);
                    this.m_targetA.Copy(def.target);
                    b2Math_1.b2Transform.MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
                    this.m_maxForce = def.maxForce;
                    this.m_impulse.SetZero();
                    this.m_frequencyHz = def.frequencyHz;
                    this.m_dampingRatio = def.dampingRatio;
                    this.m_beta = 0;
                    this.m_gamma = 0;
                }
                SetTarget(target) {
                    if (!this.m_bodyB.IsAwake()) {
                        this.m_bodyB.SetAwake(true);
                    }
                    this.m_targetA.Copy(target);
                }
                GetTarget() {
                    return this.m_targetA;
                }
                SetMaxForce(maxForce) {
                    this.m_maxForce = maxForce;
                }
                GetMaxForce() {
                    return this.m_maxForce;
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
                InitVelocityConstraints(data) {
                    this.m_indexB = this.m_bodyB.m_islandIndex;
                    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
                    this.m_invMassB = this.m_bodyB.m_invMass;
                    this.m_invIB = this.m_bodyB.m_invI;
                    const cB = data.positions[this.m_indexB].c;
                    const aB = data.positions[this.m_indexB].a;
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    const qB = this.m_qB.SetAngle(aB);
                    const mass = this.m_bodyB.GetMass();
                    // Frequency
                    const omega = 2 * b2Settings_1.b2_pi * this.m_frequencyHz;
                    // Damping coefficient
                    const d = 2 * mass * this.m_dampingRatio * omega;
                    // Spring stiffness
                    const k = mass * (omega * omega);
                    // magic formulas
                    // gamma has units of inverse mass.
                    // beta has units of inverse time.
                    const h = data.step.dt;
                    ///b2Assert(d + h * k > b2_epsilon);
                    this.m_gamma = h * (d + h * k);
                    if (this.m_gamma !== 0) {
                        this.m_gamma = 1 / this.m_gamma;
                    }
                    this.m_beta = h * k * this.m_gamma;
                    // Compute the effective mass matrix.
                    b2Math_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
                    // K    = [(1/m1 + 1/m2) * eye(2) - skew(r1) * invI1 * skew(r1) - skew(r2) * invI2 * skew(r2)]
                    //      = [1/m1+1/m2     0    ] + invI1 * [r1.y*r1.y -r1.x*r1.y] + invI2 * [r1.y*r1.y -r1.x*r1.y]
                    //        [    0     1/m1+1/m2]           [-r1.x*r1.y r1.x*r1.x]           [-r1.x*r1.y r1.x*r1.x]
                    const K = this.m_K;
                    K.ex.x = this.m_invMassB + this.m_invIB * this.m_rB.y * this.m_rB.y + this.m_gamma;
                    K.ex.y = -this.m_invIB * this.m_rB.x * this.m_rB.y;
                    K.ey.x = K.ex.y;
                    K.ey.y = this.m_invMassB + this.m_invIB * this.m_rB.x * this.m_rB.x + this.m_gamma;
                    K.GetInverse(this.m_mass);
                    // m_C = cB + m_rB - m_targetA;
                    this.m_C.x = cB.x + this.m_rB.x - this.m_targetA.x;
                    this.m_C.y = cB.y + this.m_rB.y - this.m_targetA.y;
                    // m_C *= m_beta;
                    this.m_C.SelfMul(this.m_beta);
                    // Cheat with some damping
                    wB *= 0.98;
                    if (data.step.warmStarting) {
                        this.m_impulse.SelfMul(data.step.dtRatio);
                        // vB += m_invMassB * m_impulse;
                        vB.x += this.m_invMassB * this.m_impulse.x;
                        vB.y += this.m_invMassB * this.m_impulse.y;
                        wB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(this.m_rB, this.m_impulse);
                    }
                    else {
                        this.m_impulse.SetZero();
                    }
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolveVelocityConstraints(data) {
                    const vB = data.velocities[this.m_indexB].v;
                    let wB = data.velocities[this.m_indexB].w;
                    // Cdot = v + cross(w, r)
                    // b2Vec2 Cdot = vB + b2Cross(wB, m_rB);
                    const Cdot = b2Math_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2MouseJoint.SolveVelocityConstraints_s_Cdot);
                    //  b2Vec2 impulse = b2Mul(m_mass, -(Cdot + m_C + m_gamma * m_impulse));
                    const impulse = b2Math_1.b2Mat22.MulMV(this.m_mass, b2Math_1.b2Vec2.AddVV(Cdot, b2Math_1.b2Vec2.AddVV(this.m_C, b2Math_1.b2Vec2.MulSV(this.m_gamma, this.m_impulse, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t0).SelfNeg(), b2MouseJoint.SolveVelocityConstraints_s_impulse);
                    // b2Vec2 oldImpulse = m_impulse;
                    const oldImpulse = b2MouseJoint.SolveVelocityConstraints_s_oldImpulse.Copy(this.m_impulse);
                    // m_impulse += impulse;
                    this.m_impulse.SelfAdd(impulse);
                    const maxImpulse = data.step.dt * this.m_maxForce;
                    if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
                        this.m_impulse.SelfMul(maxImpulse / this.m_impulse.Length());
                    }
                    // impulse = m_impulse - oldImpulse;
                    b2Math_1.b2Vec2.SubVV(this.m_impulse, oldImpulse, impulse);
                    // vB += m_invMassB * impulse;
                    vB.SelfMulAdd(this.m_invMassB, impulse);
                    wB += this.m_invIB * b2Math_1.b2Vec2.CrossVV(this.m_rB, impulse);
                    // data.velocities[this.m_indexB].v = vB;
                    data.velocities[this.m_indexB].w = wB;
                }
                SolvePositionConstraints(data) {
                    return true;
                }
                GetAnchorA(out) {
                    return out.Copy(this.m_targetA);
                }
                GetAnchorB(out) {
                    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
                }
                GetReactionForce(inv_dt, out) {
                    return b2Math_1.b2Vec2.MulSV(inv_dt, this.m_impulse, out);
                }
                GetReactionTorque(inv_dt) {
                    return 0;
                }
                Dump(log) {
                    log("Mouse joint dumping is not supported.\n");
                }
                ShiftOrigin(newOrigin) {
                    this.m_targetA.SelfSub(newOrigin);
                }
            };
            b2MouseJoint.SolveVelocityConstraints_s_Cdot = new b2Math_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_impulse = new b2Math_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_oldImpulse = new b2Math_1.b2Vec2();
            exports_1("b2MouseJoint", b2MouseJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJNb3VzZUpvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJNb3VzZUpvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFPRiwrREFBK0Q7WUFDL0QseUNBQXlDO1lBQ3pDLGtCQUFBLHFCQUE2QixTQUFRLG9CQUFVO2dCQVM3QztvQkFDRSxLQUFLLENBQUMscUJBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFUM0IsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBRTlCLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBRXJCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUV4QixpQkFBWSxHQUFXLEdBQUcsQ0FBQztnQkFJbEMsQ0FBQzthQUNGLENBQUE7O1lBRUQsZUFBQSxrQkFBMEIsU0FBUSxpQkFBTztnQkF5QnZDLFlBQVksR0FBb0I7b0JBQzlCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkF6Qk4sbUJBQWMsR0FBVyxJQUFJLENBQUM7b0JBQzlCLGNBQVMsR0FBVyxJQUFJLENBQUM7b0JBQ3pCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUMxQixtQkFBYyxHQUFXLENBQUMsQ0FBQztvQkFDM0IsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFFMUIsZ0JBQWdCO29CQUNULGNBQVMsR0FBVyxJQUFJLENBQUM7b0JBQ3pCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBRTNCLGNBQWM7b0JBQ1AsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsU0FBSSxHQUFXLElBQUksQ0FBQztvQkFDcEIsbUJBQWMsR0FBVyxJQUFJLENBQUM7b0JBQzlCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFdBQU0sR0FBWSxJ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