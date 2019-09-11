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
    var b2Settings_1, b2Math_1, b2Joint_1, b2MouseJointDef, b2MouseJoint;
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
                    this.m_localAnchorB = new b2Math_1.b2Vec2();
                    this.m_targetA = new b2Math_1.b2Vec2();
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_beta = 0;
                    // Solver shared
                    this.m_impulse = new b2Math_1.b2Vec2();
                    this.m_maxForce = 0;
                    this.m_gamma = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rB = new b2Math_1.b2Vec2();
                    this.m_localCenterB = new b2Math_1.b2Vec2();
                    this.m_invMassB = 0;
                    this.m_invIB = 0;
                    this.m_mass = new b2Math_1.b2Mat22();
                    this.m_C = new b2Math_1.b2Vec2();
                    this.m_qB = new b2Math_1.b2Rot();
                    this.m_lalcB = new b2Math_1.b2Vec2();
                    this.m_K = new b2Math_1.b2Mat22();
                    this.m_targetA.Copy(b2Settings_1.b2Maybe(def.target, b2Math_1.b2Vec2.ZERO));
                    // DEBUG: b2Assert(this.m_targetA.IsValid());
                    b2Math_1.b2Transform.MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
                    this.m_maxForce = b2Settings_1.b2Maybe(def.maxForce, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_maxForce) && this.m_maxForce >= 0);
                    this.m_impulse.SetZero();
                    this.m_frequencyHz = b2Settings_1.b2Maybe(def.frequencyHz, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_frequencyHz) && this.m_frequencyHz >= 0);
                    this.m_dampingRatio = b2Settings_1.b2Maybe(def.dampingRatio, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_dampingRatio) && this.m_dampingRatio >= 0);
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
                    // DEBUG: b2Assert(d + h * k > b2_epsilon);
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
                    out.x = this.m_targetA.x;
                    out.y = this.m_targetA.y;
                    return out;
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
            exports_1("b2MouseJoint", b2MouseJoint);
            b2MouseJoint.SolveVelocityConstraints_s_Cdot = new b2Math_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_impulse = new b2Math_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_oldImpulse = new b2Math_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJNb3VzZUpvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJNb3VzZUpvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFtQkYsK0RBQStEO1lBQy9ELHlDQUF5QztZQUN6QyxrQkFBQSxNQUFhLGVBQWdCLFNBQVEsb0JBQVU7Z0JBUzdDO29CQUNFLEtBQUssQ0FBQyxxQkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQVRsQixXQUFNLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFFdkMsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFFckIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBRXhCLGlCQUFZLEdBQVcsR0FBRyxDQUFDO2dCQUlsQyxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxlQUFBLE1BQWEsWUFBYSxTQUFRLGlCQUFPO2dCQXlCdkMsWUFBWSxHQUFxQjtvQkFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQXpCRyxtQkFBYyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3RDLGNBQVMsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUMxQyxrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFDMUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBQzNCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBRTFCLGdCQUFnQjtvQkFDQSxjQUFTLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDMUMsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFDdkIsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFFM0IsY0FBYztvQkFDUCxhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUNaLFNBQUksR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUM1QixtQkFBYyxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQy9DLGVBQVUsR0FB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