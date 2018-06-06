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

import { b2_linearSlop, b2_maxLinearCorrection, b2Maybe } from "../../Common/b2Settings";
import { b2Min, b2Clamp, b2Vec2, b2Rot, XY } from "../../Common/b2Math";
import { b2Joint, b2JointDef, b2JointType, b2LimitState, b2IJointDef } from "./b2Joint";
import { b2SolverData } from "../b2TimeStep";

export interface b2IRopeJointDef extends b2IJointDef {
  localAnchorA?: XY;

  localAnchorB?: XY;

  maxLength?: number;
}

/// Rope joint definition. This requires two body anchor points and
/// a maximum lengths.
/// Note: by default the connected objects will not collide.
/// see collideConnected in b2JointDef.
export class b2RopeJointDef extends b2JointDef implements b2IRopeJointDef {
  public readonly localAnchorA: b2Vec2 = new b2Vec2(-1, 0);

  public readonly localAnchorB: b2Vec2 = new b2Vec2(1, 0);

  public maxLength: number = 0;

  constructor() {
    super(b2JointType.e_ropeJoint);
  }
}

export class b2RopeJoint extends b2Joint {
  // Solver shared
  public readonly m_localAnchorA: b2Vec2 = new b2Vec2();
  public readonly m_localAnchorB: b2Vec2 = new b2Vec2();
  public m_maxLength: number = 0;
  public m_length: number = 0;
  public m_impulse: number = 0;

  // Solver temp
  public m_indexA: number = 0;
  public m_indexB: number = 0;
  public readonly m_u: b2Vec2 = new b2Vec2();
  public readonly m_rA: b2Vec2 = new b2Vec2();
  public readonly m_rB: b2Vec2 = new b2Vec2();
  public readonly m_localCenterA: b2Vec2 = new b2Vec2();
  public readonly m_localCenterB: b2Vec2 = new b2Vec2();
  public m_invMassA: number = 0;
  public m_invMassB: number = 0;
  public m_invIA: number = 0;
  public m_invIB: number = 0;
  public m_mass: number = 0;
  public m_state = b2LimitState.e_inactiveLimit;

  public readonly m_qA: b2Rot = new b2Rot();
  public readonly m_qB: b2Rot = new b2Rot();
  public readonly m_lalcA: b2Vec2 = new b2Vec2();
  public readonly m_lalcB: b2Vec2 = new b2Vec2();

  constructor(def: b2IRopeJointDef) {
    super(def);

    this.m_localAnchorA.Copy(b2Maybe(def.localAnchorA, new b2Vec2(-1, 0)));
    this.m_localAnchorB.Copy(b2Maybe(def.localAnchorB, new b2Vec2(1, 0)));
    this.m_maxLength = b2Maybe(def.maxLength, 0);
  }

  private static InitVelocityConstraints_s_P = new b2Vec2();
  public InitVelocityConstraints(data: b2SolverData): void {
    this.m_indexA = this.m_bodyA.m_islandIndex;
    this.m_indexB = this.m_bodyB.m_islandIndex;
    this.m_localCenterA.Copy(this.m_bodyA.m_sweep.localCenter);
    this.m_localCenterB.Copy(this.m_bodyB.m_sweep.localCenter);
    this.m_invMassA = this.m_bodyA.m_invMass;
    this.m_invMassB = this.m_bodyB.m_invMass;
    this.m_invIA = this.m_bodyA.m_invI;
    this.m_invIB = this.m_bodyB.m_invI;

    const cA: b2Vec2 = data.positions[this.m_indexA].c;
    const aA: number = data.positions[this.m_indexA].a;
    const vA: b2Vec2 = data.velocities[this.m_indexA].v;
    let wA: number = data.velocities[this.m_indexA].w;

    const cB: b2Vec2 = data.positions[this.m_indexB].c;
    const aB: number = data.positions[this.m_indexB].a;
    const vB: b2Vec2 = data.velocities[this.m_indexB].v;
    let wB: number = data.velocities[this.m_indexB].w;

    const qA: b2Rot = this.m_qA.SetAngle(aA), qB: b2Rot = this.m_qB.SetAngle(aB);

    // this.m_rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
    b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
    // this.m_rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
    b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
    // this.m_u = cB + this.m_rB - cA - this.m_rA;
    this.m_u.Copy(cB).SelfAdd(this.m_rB).SelfSub(cA).SelfSub(this.m_rA);

    this.m_length = this.m_u.Length();

    const C: number = this.m_length - this.m_maxLength;
    if (C > 0) {
      this.m_state = b2LimitState.e_atUpperLimit;
    } else {
      this.m_state = b2LimitState.e_inactiveLimit;
    }

    if (this.m_length > b2_linearSlop) {
      this.m_u.SelfMul(1 / this.m_length);
    } else {
      this.m_u.SetZero();
      this.m_mass = 0;
      this.m_impulse = 0;
      return;
    }

    // Compute effective mass.
    const crA: number = b2Vec2.CrossVV(this.m_rA, this.m_u);
    const crB: number = b2Vec2.CrossVV(this.m_rB, this.m_u);
    const invMass: number = this.m_invMassA + this.m_invIA * crA * crA + this.m_invMassB + this.m_invIB * crB * crB;

    this.m_mass = invMass !== 0 ? 1 / invMass : 0;

    if (data.step.warmStarting) {
      // Scale the impulse to support a variable time step.
      this.m_impulse *= data.step.dtRatio;

      // b2Vec2 P = m_impulse * m_u;
      const P: b2Vec2 = b2Vec2.MulSV(this.m_impulse, this.m_u, b2RopeJoint.InitVelocityConstraints_s_P);
      // vA -= m_invMassA * P;
      vA.SelfMulSub(this.m_invMassA, P);
      wA -= this.m_invIA * b2Vec2.CrossVV(this.m_rA, P);
      // vB += m_invMassB * P;
      vB.SelfMulAdd(this.m_invMassB, P);
      wB += this.m_invIB * b2Vec2.CrossVV(this.m_rB, P);
    } else {
      this.m_impulse = 0;
    }

    // data.velocities[this.m_indexA].v = vA;
    data.velocities[this.m_indexA].w = wA;
    // data.velocities[this.m_indexB].v = vB;
    data.velocities[this.m_indexB].w = wB;
  }

  private static SolveVelocityConstraints_s_vpA = new b2Vec2();
  private static SolveVelocityConstraints_s_vpB = new b2Vec2();
  private static SolveVelocityConstraints_s_P = new b2Vec2();
  public SolveVelocityConstraints(data: b2SolverData): void {
    const vA: b2Vec2 = data.velocities[this.m_indexA].v;
    let wA: number = data.velocities[this.m_indexA].w;
    const vB: b2Vec2 = data.velocities[this.m_indexB].v;
    let wB: number = data.velocities[this.m_indexB].w;

    // Cdot = dot(u, v + cross(w, r))
    // b2Vec2 vpA = vA + b2Cross(wA, m_rA);
    const vpA: b2Vec2 = b2Vec2.AddVCrossSV(vA, wA, this.m_rA, b2RopeJoint.SolveVelocityConstraints_s_vpA);
    // b2Vec2 vpB = vB + b2Cross(wB, m_rB);
    const vpB: b2Vec2 = b2Vec2.AddVCrossSV(vB, wB, this.m_rB, b2RopeJoint.SolveVelocityConstraints_s_vpB);
    // float32 C = m_length - m_maxLength;
    const C: number = this.m_length - this.m_maxLength;
    // float32 Cdot = b2Dot(m_u, vpB - vpA);
    let Cdot: number = b2Vec2.DotVV(this.m_u, b2Vec2.SubVV(vpB, vpA, b2Vec2.s_t0));

    // Predictive constraint.
    if (C < 0) {
      Cdot += data.step.inv_dt * C;
    }

    let impulse: number = -this.m_mass * Cdot;
    const oldImpulse: number = this.m_impulse;
    this.m_impulse = b2Min(0, this.m_impulse + impulse);
    impulse = this.m_impulse - oldImpulse;

    // b2Vec2 P = impulse * m_u;
    const P: b2Vec2 = b2Vec2.MulSV(impulse, this.m_u, b2RopeJoint.SolveVelocityConstraints_s_P);
    // vA -= m_invMassA * P;
    vA.SelfMulSub(this.m_invMassA, P);
    wA -= this.m_invIA * b2Vec2.CrossVV(this.m_rA, P);
    // vB += m_invMassB * P;
    vB.SelfMulAdd(this.m_invMassB, P);
    wB += this.m_invIB * b2Vec2.CrossVV(this.m_rB, P);

    // data.velocities[this.m_indexA].v = vA;
    data.velocities[this.m_indexA].w = wA;
    // data.velocities[this.m_indexB].v = vB;
    data.velocities[this.m_indexB].w = wB;
  }

  private static SolvePositionConstraints_s_P = new b2Vec2();
  public SolvePositionConstraints(data: b2SolverData): boolean {
    const cA: b2Vec2 = data.positions[this.m_indexA].c;
    let aA: number = data.positions[this.m_indexA].a;
    const cB: b2Vec2 = data.positions[this.m_indexB].c;
    let aB: number = data.positions[this.m_indexB].a;

    const qA: b2Rot = this.m_qA.SetAngle(aA), qB: b2Rot = this.m_qB.SetAngle(aB);

    // b2Vec2 rA = b2Mul(qA, this.m_localAnchorA - this.m_localCenterA);
    b2Vec2.SubVV(this.m_localAnchorA, this.m_localCenterA, this.m_lalcA);
    const rA: b2Vec2 = b2Rot.MulRV(qA, this.m_lalcA, this.m_rA);
    // b2Vec2 rB = b2Mul(qB, this.m_localAnchorB - this.m_localCenterB);
    b2Vec2.SubVV(this.m_localAnchorB, this.m_localCenterB, this.m_lalcB);
    const rB: b2Vec2 = b2Rot.MulRV(qB, this.m_lalcB, this.m_rB);
    // b2Vec2 u = cB + rB - cA - rA;
    const u: b2Vec2 = this.m_u.Copy(cB).SelfAdd(rB).SelfSub(cA).SelfSub(rA);

    const length: number = u.Normalize();
    let C: number = length - this.m_maxLength;

    C = b2Clamp(C, 0, b2_maxLinearCorrection);

    const impulse: number = -this.m_mass * C;
    // b2Vec2 P = impulse * u;
    const P: b2Vec2 = b2Vec2.MulSV(impulse, u, b2RopeJoint.SolvePositionConstraints_s_P);

    // cA -= m_invMassA * P;
    cA.SelfMulSub(this.m_invMassA, P);
    aA -= this.m_invIA * b2Vec2.CrossVV(rA, P);
    // cB += m_invMassB * P;
    cB.SelfMulAdd(this.m_invMassB, P);
    aB += this.m_invIB * b2Vec2.CrossVV(rB, P);

    // data.positions[this.m_indexA].c = cA;
    data.positions[this.m_indexA].a = aA;
    // data.positions[this.m_indexB].c = cB;
    data.positions[this.m_indexB].a = aB;

    return length - this.m_maxLength < b2_linearSlop;
  }

  public GetAnchorA<T extends XY>(out: T): T {
    return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
  }

  public GetAnchorB<T extends XY>(out: T): T {
    return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
  }

  public GetReactionForce<T extends XY>(inv_dt: number, out: T): T {
    // return out.Set(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
    return b2Vec2.MulSV((inv_dt * this.m_impulse), this.m_u, out);
  }

  public GetReactionTorque(inv_dt: number): number {
    return 0;
  }

  public GetLocalAnchorA(): Readonly<b2Vec2> { return this.m_localAnchorA; }

  public GetLocalAnchorB(): Readonly<b2Vec2> { return this.m_localAnchorB; }

  public SetMaxLength(length: number): void { this.m_maxLength = length; }
  public GetMaxLength(): number {
    return this.m_maxLength;
  }

  public GetLimitState(): b2LimitState {
    return this.m_state;
  }

  public Dump(log: (format: string, ...args: any[]) => void): void {
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
}
