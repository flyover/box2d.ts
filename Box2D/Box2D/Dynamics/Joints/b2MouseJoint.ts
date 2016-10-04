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

/// <reference path="../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2Body.ts"/>
/// <reference path="../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts"/>

namespace box2d {

/// Mouse joint definition. This requires a world target point,
/// tuning parameters, and the time step.
export class b2MouseJointDef extends b2JointDef {
  public target: b2Vec2 = new b2Vec2();

  public maxForce: number = 0;

  public frequencyHz: number = 5;

  public dampingRatio: number = 0.7;

  constructor() {
    super(b2JointType.e_mouseJoint); // base class constructor
  }
}

export class b2MouseJoint extends b2Joint {
  public m_localAnchorB: b2Vec2 = null;
  public m_targetA: b2Vec2 = null;
  public m_frequencyHz: number = 0;
  public m_dampingRatio: number = 0;
  public m_beta: number = 0;

  // Solver shared
  public m_impulse: b2Vec2 = null;
  public m_maxForce: number = 0;
  public m_gamma: number = 0;

  // Solver temp
  public m_indexA: number = 0;
  public m_indexB: number = 0;
  public m_rB: b2Vec2 = null;
  public m_localCenterB: b2Vec2 = null;
  public m_invMassB: number = 0;
  public m_invIB: number = 0;
  public m_mass: b2Mat22 = null;
  public m_C: b2Vec2 = null;
  public m_qB: b2Rot = null;
  public m_lalcB: b2Vec2 = null;
  public m_K: b2Mat22 = null;

  constructor(def) {
    super(def); // base class constructor

    this.m_localAnchorB = new b2Vec2();
    this.m_targetA = new b2Vec2();

    this.m_impulse = new b2Vec2();

    this.m_rB = new b2Vec2();
    this.m_localCenterB = new b2Vec2();
    this.m_mass = new b2Mat22();
    this.m_C = new b2Vec2();
    this.m_qB = new b2Rot();
    this.m_lalcB = new b2Vec2();
    this.m_K = new b2Mat22();

    if (ENABLE_ASSERTS) { b2Assert(def.target.IsValid()); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(def.maxForce) && def.maxForce >= 0); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(def.frequencyHz) && def.frequencyHz >= 0); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(def.dampingRatio) && def.dampingRatio >= 0); }

    this.m_targetA.Copy(def.target);
    b2MulTXV(this.m_bodyB.GetTransform(), this.m_targetA, this.m_localAnchorB);

    this.m_maxForce = def.maxForce;
    this.m_impulse.SetZero();

    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;

    this.m_beta = 0;
    this.m_gamma = 0;
  }

  public SetTarget(target) {
    if (this.m_bodyB.IsAwake() === false) {
      this.m_bodyB.SetAwake(true);
    }
    this.m_targetA.Copy(target);
  }

  public GetTarget() {
    return this.m_targetA;
  }

  public SetMaxForce(maxForce) {
    this.m_maxForce = maxForce;
  }

  public GetMaxForce() {
    return this.m_maxForce;
  }

  public SetFrequency(hz) {
    this.m_frequencyHz = hz;
  }

  public GetFrequency() {
    return this.m_frequencyHz;
  }

  public SetDampingRatio(ratio) {
    this.m_dampingRatio = ratio;
  }

  public GetDampingRatio() {
    return this.m_dampingRatio;
  }

  public InitVelocityConstraints(data) {
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIB = this.m_bodyB.m_invI;

    const cB: b2Vec2 = data.positions[this.m_indexB].c;
    const aB: number = data.positions[this.m_indexB].a;
    const vB: b2Vec2 = data.velocities[this.m_indexB].v;
    let wB: number = data.velocities[this.m_indexB].w;

    const qB = this.m_qB.SetAngleRadians(aB);

    const mass: number = this.m_bodyB.GetMass();

    // Frequency
    const omega: number = 2 * b2_pi * this.m_frequencyHz;

    // Damping coefficient
    const d: number = 2 * mass * this.m_dampingRatio * omega;

    // Spring stiffness
    const k: number = mass * (omega * omega);

    // magic formulas
    // gamma has units of inverse mass.
    // beta has units of inverse time.
    const h: number = data.step.dt;
    if (ENABLE_ASSERTS) { b2Assert(d + h * k > b2_epsilon); }
    this.m_gamma = h * (d + h * k);
    if (this.m_gamma !== 0) {
      this.m_gamma = 1 / this.m_gamma;
    }
    this.m_beta = h * k * this.m_gamma;

    // Compute the effective mass matrix.
    b2SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    b2MulRV(qB, this.m_lalcB, this.m_rB);

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
      wB += this.m_invIB * b2CrossVV(this.m_rB, this.m_impulse);
    } else {
      this.m_impulse.SetZero();
    }

    // data.velocities[this.m_indexB].v = vB;
    data.velocities[this.m_indexB].w = wB;
  }

  private static SolveVelocityConstraints_s_Cdot = new b2Vec2();
  private static SolveVelocityConstraints_s_impulse = new b2Vec2();
  private static SolveVelocityConstraints_s_oldImpulse = new b2Vec2();
  public SolveVelocityConstraints(data) {
    const vB: b2Vec2 = data.velocities[this.m_indexB].v;
    let wB: number = data.velocities[this.m_indexB].w;

    // Cdot = v + cross(w, r)
    // b2Vec2 Cdot = vB + b2Cross(wB, m_rB);
    const Cdot: b2Vec2 = b2AddVCrossSV(vB, wB, this.m_rB, b2MouseJoint.SolveVelocityConstraints_s_Cdot);
    //  b2Vec2 impulse = b2Mul(m_mass, -(Cdot + m_C + m_gamma * m_impulse));
    const impulse: b2Vec2 = b2MulMV(
      this.m_mass,
      b2AddVV(
        Cdot,
        b2AddVV(this.m_C,
          b2MulSV(this.m_gamma, this.m_impulse, b2Vec2.s_t0),
          b2Vec2.s_t0),
        b2Vec2.s_t0).SelfNeg(),
      b2MouseJoint.SolveVelocityConstraints_s_impulse);

    // b2Vec2 oldImpulse = m_impulse;
    const oldImpulse = b2MouseJoint.SolveVelocityConstraints_s_oldImpulse.Copy(this.m_impulse);
    // m_impulse += impulse;
    this.m_impulse.SelfAdd(impulse);
    const maxImpulse: number = data.step.dt * this.m_maxForce;
    if (this.m_impulse.GetLengthSquared() > maxImpulse * maxImpulse) {
      this.m_impulse.SelfMul(maxImpulse / this.m_impulse.GetLength());
    }
    // impulse = m_impulse - oldImpulse;
    b2SubVV(this.m_impulse, oldImpulse, impulse);

    // vB += m_invMassB * impulse;
    vB.SelfMulAdd(this.m_invMassB, impulse);
    wB += this.m_invIB * b2CrossVV(this.m_rB, impulse);

    // data.velocities[this.m_indexB].v = vB;
    data.velocities[this.m_indexB].w = wB;
  }

  public SolvePositionConstraints(data) {
    return true;
  }

  public GetAnchorA(out: b2Vec2): b2Vec2 {
    return out.Copy(this.m_targetA);
  }

  public GetAnchorB(out: b2Vec2): b2Vec2 {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
  }

  public GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2 {
    return b2MulSV(inv_dt, this.m_impulse, out);
  }

  public GetReactionTorque(inv_dt: number): number {
    return 0;
  }

  public Dump() {
    if (DEBUG) {
      b2Log("Mouse joint dumping is not supported.\n");
    }
  }

  public ShiftOrigin(newOrigin) {
    this.m_targetA.SelfSub(newOrigin);
  }
}

} // namespace box2d
