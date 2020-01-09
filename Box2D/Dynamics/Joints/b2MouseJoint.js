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
    var b2Settings_js_1, b2Math_js_1, b2Joint_js_1, b2MouseJointDef, b2MouseJoint;
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
            /// Mouse joint definition. This requires a world target point,
            /// tuning parameters, and the time step.
            b2MouseJointDef = class b2MouseJointDef extends b2Joint_js_1.b2JointDef {
                constructor() {
                    super(b2Joint_js_1.b2JointType.e_mouseJoint);
                    this.target = new b2Math_js_1.b2Vec2();
                    this.maxForce = 0;
                    this.frequencyHz = 5;
                    this.dampingRatio = 0.7;
                }
            };
            exports_1("b2MouseJointDef", b2MouseJointDef);
            b2MouseJoint = class b2MouseJoint extends b2Joint_js_1.b2Joint {
                constructor(def) {
                    super(def);
                    this.m_localAnchorB = new b2Math_js_1.b2Vec2();
                    this.m_targetA = new b2Math_js_1.b2Vec2();
                    this.m_frequencyHz = 0;
                    this.m_dampingRatio = 0;
                    this.m_beta = 0;
                    // Solver shared
                    this.m_impulse = new b2Math_js_1.b2Vec2();
                    this.m_maxForce = 0;
                    this.m_gamma = 0;
                    // Solver temp
                    this.m_indexA = 0;
                    this.m_indexB = 0;
                    this.m_rB = new b2Math_js_1.b2Vec2();
                    this.m_localCenterB = new b2Math_js_1.b2Vec2();
                    this.m_invMassB = 0;
                    this.m_invIB = 0;
                    this.m_mass = new b2Math_js_1.b2Mat22();
                    this.m_C = new b2Math_js_1.b2Vec2();
                    this.m_qB = new b2Math_js_1.b2Rot();
                    this.m_lalcB = new b2Math_js_1.b2Vec2();
                    this.m_K = new b2Math_js_1.b2Mat22();
                    this.m_targetA.Copy(b2Settings_js_1.b2Maybe(def.target, b2Math_js_1.b2Vec2.ZERO));
                    // DEBUG: b2Assert(this.m_targetA.IsValid());
                    b2Math_js_1.b2Transform.MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);
                    this.m_maxForce = b2Settings_js_1.b2Maybe(def.maxForce, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_maxForce) && this.m_maxForce >= 0);
                    this.m_impulse.SetZero();
                    this.m_frequencyHz = b2Settings_js_1.b2Maybe(def.frequencyHz, 0);
                    // DEBUG: b2Assert(b2IsValid(this.m_frequencyHz) && this.m_frequencyHz >= 0);
                    this.m_dampingRatio = b2Settings_js_1.b2Maybe(def.dampingRatio, 0);
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
                    const omega = 2 * b2Settings_js_1.b2_pi * this.m_frequencyHz;
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
                    b2Math_js_1.b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
                    b2Math_js_1.b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
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
                        wB += this.m_invIB * b2Math_js_1.b2Vec2.CrossVV(this.m_rB, this.m_impulse);
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
                    const Cdot = b2Math_js_1.b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2MouseJoint.SolveVelocityConstraints_s_Cdot);
                    //  b2Vec2 impulse = b2Mul(m_mass, -(Cdot + m_C + m_gamma * m_impulse));
                    const impulse = b2Math_js_1.b2Mat22.MulMV(this.m_mass, b2Math_js_1.b2Vec2.AddVV(Cdot, b2Math_js_1.b2Vec2.AddVV(this.m_C, b2Math_js_1.b2Vec2.MulSV(this.m_gamma, this.m_impulse, b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.s_t0), b2Math_js_1.b2Vec2.s_t0).SelfNeg(), b2MouseJoint.SolveVelocityConstraints_s_impulse);
                    // b2Vec2 oldImpulse = m_impulse;
                    const oldImpulse = b2MouseJoint.SolveVelocityConstraints_s_oldImpulse.Copy(this.m_impulse);
                    // m_impulse += impulse;
                    this.m_impulse.SelfAdd(impulse);
                    const maxImpulse = data.step.dt * this.m_maxForce;
                    if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
                        this.m_impulse.SelfMul(maxImpulse / this.m_impulse.Length());
                    }
                    // impulse = m_impulse - oldImpulse;
                    b2Math_js_1.b2Vec2.SubVV(this.m_impulse, oldImpulse, impulse);
                    // vB += m_invMassB * impulse;
                    vB.SelfMulAdd(this.m_invMassB, impulse);
                    wB += this.m_invIB * b2Math_js_1.b2Vec2.CrossVV(this.m_rB, impulse);
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
                    return b2Math_js_1.b2Vec2.MulSV(inv_dt, this.m_impulse, out);
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
            b2MouseJoint.SolveVelocityConstraints_s_Cdot = new b2Math_js_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_impulse = new b2Math_js_1.b2Vec2();
            b2MouseJoint.SolveVelocityConstraints_s_oldImpulse = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJNb3VzZUpvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJNb3VzZUpvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFtQkYsK0RBQStEO1lBQy9ELHlDQUF5QztZQUN6QyxrQkFBQSxNQUFhLGVBQWdCLFNBQVEsdUJBQVU7Z0JBUzdDO29CQUNFLEtBQUssQ0FBQyx3QkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQVRsQixXQUFNLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBRXZDLGFBQVEsR0FBVyxDQUFDLENBQUM7b0JBRXJCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUV4QixpQkFBWSxHQUFXLEdBQUcsQ0FBQztnQkFJbEMsQ0FBQzthQUNGLENBQUE7O1lBRUQsZUFBQSxNQUFhLFlBQWEsU0FBUSxvQkFBTztnQkF5QnZDLFlBQVksR0FBcUI7b0JBQy9CLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkF6QkcsbUJBQWMsR0FBVyxJQUFJLGtCQUFNLEVBQUUsQ0FBQztvQkFDdEMsY0FBUyxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUMxQyxrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFDMUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7b0JBQzNCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBRTFCLGdCQUFnQjtvQkFDQSxjQUFTLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzFDLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBRTNCLGNBQWM7b0JBQ1AsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDckIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFDWixTQUFJLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQzVCLG1CQUFjLEdBQVcsSUFBSSxrQkFBTSxFQUFFLENBQUM7b0JBQy9DLGVB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