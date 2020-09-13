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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "./b2_joint.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_joint_js_1, b2MouseJointDef, b2MouseJoint;
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
            /// Mouse joint definition. This requires a world target point,
            /// tuning parameters, and the time step.
            b2MouseJointDef = class b2MouseJointDef extends b2_joint_js_1.b2JointDef {
                constructor() {
                    super(b2_joint_js_1.b2JointType.e_mouseJoint);
                    this.target = new b2_math_js_1.b2Vec2();
                    this.maxForce = 0;
                    this.stiffness = 5;
                    this.damping = 0.7;
                }
            };
            exports_1("b2MouseJointDef", b2MouseJointDef);
            b2MouseJoint = class b2MouseJoint extends b2_joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_localAnchorB = new b2_math_js_1.b2Vec2();
                    this.m_targetA = new b2_math_js_1.b2Vec2();
                    this.m_stiffness = 0;
                    this.m_damping = 0;
                    this.m_beta = 0;
                    // Solver shared
                    this.m_impulse = new b2_math_js_1.b2Vec2();
                    this.m_maxForce = 0;
                    this.m_gamma = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rB = new b2_math_js_1.b2Vec2();
                    this.m_localCenterB = new b2_math_js_1.b2Vec2();
                    this.m_invMassB = 0;
                    this.m_invIB = 0;
                    this.m_mass = new b2_math_js_1.b2Mat22();
                    this.m_C = new b2_math_js_1.b2Vec2();
                    this.m_qB = new b2_math_js_1.b2Rot();
                    this.m_lalcB = new b2_math_js_1.b2Vec2();
                    this.m_K = new b2_math_js_1.b2Mat22();
                    this.m_targetA.Copy(b2_settings_js_1.b2Maybe(def.target, b2_math_js_1.b2Vec2.ZERO));
                    // DEBUG: b2Assert(this.m_targetA.IsValid());
                    b2_math_js_1.b2Transform.MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
                    this.m_maxForce = b2_settings_js_1.b2Maybe(def.maxForce, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_maxForce) && this.m_maxForce >= 0);
                    this.m_impulse.SetZero();
                    this.m_stiffness = b2_settings_js_1.b2Maybe(def.stiffness, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_stiffness) && this.m_stiffness >= 0);
                    this.m_damping = b2_settings_js_1.b2Maybe(def.damping, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_damping) && this.m_damping >= 0);
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
                SetStiffness(stiffness) {
                    this.m_stiffness = stiffness;
                }
                GetStiffness() {
                    return this.m_stiffness;
                }
                SetDamping(damping) {
                    this.m_damping = damping;
                }
                GetDamping() {
                    return this.m_damping;
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
                    const omega = 2 * b2_settings_js_1.b2_pi * this.m_stiffness;
                    // Damping coefficient
                    const d = 2 * mass * this.m_damping * omega;
                    // Spring stiffness
                    const k = mass * (omega * omega);
                    // magic formulas
                    // gamma has units of inverse mass.
                    // beta has units of inverse time.
                    const h = data.step.dt;
                    this.m_gamma = h * (d + h * k);
                    if (this.m_gamma !== 0) {
                        this.m_gamma = 1 / this.m_gamma;
                    }
                    this.m_beta = h * k * this.m_gamma;
                    // Compute the effective mass matrix.
                    b2_math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2_math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
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
                        wB += this.m_invIB * b2_math_js_1.b2Vec2.CrossVV(this.m_rB, this.m_impulse);
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
                    const Cdot = b2_math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2MouseJoint.SolveVelocityConstraints_s_Cdot);
                    //  b2Vec2 impulse = b2Mul(m_mass, -(Cdot + m_C + m_gamma * m_impulse));
                    const impulse = b2_math_js_1.b2Mat22.MulMV(this.m_mass, b2_math_js_1.b2Vec2.AddVV(Cdot, b2_math_js_1.b2Vec2.AddVV(this.m_C, b2_math_js_1.b2Vec2.MulSV(this.m_gamma, this.m_impulse, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.s_t0).SelfNeg(), b2MouseJoint.SolveVelocityConstraints_s_impulse);
                    // b2Vec2 oldImpulse = m_impulse;
                    const oldImpulse = b2MouseJoint.SolveVelocityConstraints_s_oldImpulse.Copy(this.m_impulse);
                    // m_impulse += impulse;
                    this.m_impulse.SelfAdd(impulse);
                    const maxImpulse = data.step.dt * this.m_maxForce;
                    if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
                        this.m_impulse.SelfMul(maxImpulse / this.m_impulse.Length());
                    }
                    // impulse = m_impulse - oldImpulse;
                    b2_math_js_1.b2Vec2.SubVV(this.m_impulse, oldImpulse, impulse);
                    // vB += m_invMassB * impulse;
                    vB.SelfMulAdd(this.m_invMassB, impulse);
                    wB += this.m_invIB * b2_math_js_1.b2Vec2.CrossVV(this.m_rB, impulse);
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
                    return b2_math_js_1.b2Vec2.MulSV(inv_dt, this.m_impulse, out);
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
            b2MouseJoint.SolveVelocityConstraints_s_Cdot = new b2_math_js_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_impulse = new b2_math_js_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_oldImpulse = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfbW91c2Vfam9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHluYW1pY3MvYjJfbW91c2Vfam9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQW1CRiwrREFBK0Q7WUFDL0QseUNBQXlDO1lBQ3pDLGtCQUFBLE1BQWEsZUFBZ0IsU0FBUSx3QkFBVTtnQkFTN0M7b0JBQ0UsS0FBSyxDQUFDLHlCQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBVGxCLFdBQU0sR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFFdkMsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFFckIsY0FBUyxHQUFXLENBQUMsQ0FBQztvQkFFdEIsWUFBTyxHQUFXLEdBQUcsQ0FBQztnQkFJN0IsQ0FBQzthQUNGLENBQUE7O1lBRUQsZUFBQSxNQUFhLFlBQWEsU0FBUSxxQkFBTztnQkF5QnZDLFlBQVksR0FBcUI7b0JBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkF6QkcsbUJBQWMsR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFDdEMsY0FBUyxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO29CQUMxQyxnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDeEIsY0FBUyxHQUFXLENBQUMsQ0FBQztvQkFDdEIsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFFMUIsZ0JBQWdCO29CQUNBLGNBQVMsR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFDMUMsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFDdkIsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFFM0IsY0FBYztvQkFDUCxhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUNaLFNBQUksR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFDNUIsbUJBQWMsR0FBVyxJQUFJLG1CQUFN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