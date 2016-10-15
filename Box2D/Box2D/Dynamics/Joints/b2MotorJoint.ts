import { DEBUG, ENABLE_ASSERTS, b2Assert, b2Log } from "../../Common/b2Settings";
import { b2IsValid } from "../../Common/b2Math";
import { b2Abs, b2Min, b2Max, b2Clamp } from "../../Common/b2Math";
import { b2Vec2 } from "../../Common/b2Math";
import { b2IsEqualToV } from "../../Common/b2Math";
import { b2NegV, b2AddVV, b2SubVV, b2MulSV } from "../../Common/b2Math";
import { b2DotVV, b2CrossVV } from "../../Common/b2Math";
import { b2CrossSV, b2CrossVS } from "../../Common/b2Math";
import { b2Mat22 } from "../../Common/b2Math";
import { b2MulMV, b2MulTMV } from "../../Common/b2Math";
import { b2Rot } from "../../Common/b2Math";
import { b2MulRV, b2MulTRV } from "../../Common/b2Math";
import { b2Joint, b2JointDef } from "./b2Joint";
import { b2JointType } from "./b2Joint";

export class b2MotorJointDef extends b2JointDef {
  public linearOffset: b2Vec2 = new b2Vec2(0, 0);

  public angularOffset: number = 0;

  public maxForce: number = 1;

  public maxTorque: number = 1;

  public correctionFactor: number = 0.3;

  constructor() {
    super(b2JointType.e_motorJoint); // base class constructor
  }

  public Initialize(bA, bB) {
    this.bodyA = bA;
    this.bodyB = bB;
    // b2Vec2 xB = bodyB->GetPosition();
    // linearOffset = bodyA->GetLocalPoint(xB);
    this.bodyA.GetLocalPoint(this.bodyB.GetPosition(), this.linearOffset);

    const angleA: number = this.bodyA.GetAngleRadians();
    const angleB: number = this.bodyB.GetAngleRadians();
    this.angularOffset = angleB - angleA;
  }
}

export class b2MotorJoint extends b2Joint {
  // Solver shared
  public m_linearOffset: b2Vec2 = new b2Vec2();
  public m_angularOffset: number = 0;
  public m_linearImpulse: b2Vec2 = new b2Vec2();
  public m_angularImpulse: number = 0;
  public m_maxForce: number = 0;
  public m_maxTorque: number = 0;
  public m_correctionFactor: number = 0.3;

  // Solver temp
  public m_indexA: number = 0;
  public m_indexB: number = 0;
  public m_rA: b2Vec2 = new b2Vec2();
  public m_rB: b2Vec2 = new b2Vec2();
  public m_localCenterA: b2Vec2 = new b2Vec2();
  public m_localCenterB: b2Vec2 = new b2Vec2();
  public m_linearError: b2Vec2 = new b2Vec2();
  public m_angularError: number = 0;
  public m_invMassA: number = 0;
  public m_invMassB: number = 0;
  public m_invIA: number = 0;
  public m_invIB: number = 0;
  public m_linearMass: b2Mat22 = new b2Mat22();
  public m_angularMass: number = 0;

  public m_qA: b2Rot = new b2Rot();
  public m_qB: b2Rot = new b2Rot();
  public m_K: b2Mat22 = new b2Mat22();

  constructor(def) {
    super(def); // base class constructor

    this.m_linearOffset.Copy(def.linearOffset);
    this.m_linearImpulse.SetZero();
    this.m_maxForce = def.maxForce;
    this.m_maxTorque = def.maxTorque;
    this.m_correctionFactor = def.correctionFactor;
  }

  public GetAnchorA() {
    return this.m_bodyA.GetPosition();
  }
  public GetAnchorB() {
    return this.m_bodyB.GetPosition();
  }

  public GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2 {
    // return inv_dt * m_linearImpulse;
    return b2MulSV(inv_dt, this.m_linearImpulse, out);
  }

  public GetReactionTorque(inv_dt: number): number {
    return inv_dt * this.m_angularImpulse;
  }

  public SetLinearOffset(linearOffset) {
    if (!b2IsEqualToV(linearOffset, this.m_linearOffset)) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_linearOffset.Copy(linearOffset);
    }
  }
  public GetLinearOffset() {
    return this.m_linearOffset;
  }

  public SetAngularOffset(angularOffset) {
    if (angularOffset !== this.m_angularOffset) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_angularOffset = angularOffset;
    }
  }
  public GetAngularOffset() {
    return this.m_angularOffset;
  }

  public SetMaxForce(force) {
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(force) && force >= 0); }
    this.m_maxForce = force;
  }

  public GetMaxForce() {
    return this.m_maxForce;
  }

  public SetMaxTorque(torque) {
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(torque) && torque >= 0); }
    this.m_maxTorque = torque;
  }

  public GetMaxTorque() {
    return this.m_maxTorque;
  }

  public InitVelocityConstraints(data) {
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

    const qA: b2Rot = this.m_qA.SetAngleRadians(aA), qB: b2Rot = this.m_qB.SetAngleRadians(aB);

    // Compute the effective mass matrix.
    // this.m_rA = b2Mul(qA, -this.m_localCenterA);
    const rA: b2Vec2 = b2MulRV(qA, b2NegV(this.m_localCenterA, b2Vec2.s_t0), this.m_rA);
    // this.m_rB = b2Mul(qB, -this.m_localCenterB);
    const rB: b2Vec2 = b2MulRV(qB, b2NegV(this.m_localCenterB, b2Vec2.s_t0), this.m_rB);

    // J = [-I -r1_skew I r2_skew]
    //     [ 0       -1 0       1]
    // r_skew = [-ry; rx]

    // Matlab
    // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x,          -r1y*iA-r2y*iB]
    //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB,           r1x*iA+r2x*iB]
    //     [          -r1y*iA-r2y*iB,           r1x*iA+r2x*iB,                   iA+iB]

    const mA: number = this.m_invMassA, mB: number = this.m_invMassB;
    const iA: number = this.m_invIA, iB: number = this.m_invIB;

    const K: b2Mat22 = this.m_K;
    K.ex.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
    K.ex.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
    K.ey.x = K.ex.y;
    K.ey.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;

    // this.m_linearMass = K.GetInverse();
    K.GetInverse(this.m_linearMass);

    this.m_angularMass = iA + iB;
    if (this.m_angularMass > 0) {
      this.m_angularMass = 1 / this.m_angularMass;
    }

    // this.m_linearError = cB + rB - cA - rA - b2Mul(qA, this.m_linearOffset);
    b2SubVV(
      b2SubVV(
        b2AddVV(cB, rB, b2Vec2.s_t0),
        b2AddVV(cA, rA, b2Vec2.s_t1),
        b2Vec2.s_t2),
      b2MulRV(qA, this.m_linearOffset, b2Vec2.s_t3),
      this.m_linearError);
    this.m_angularError = aB - aA - this.m_angularOffset;

    if (data.step.warmStarting) {
      // Scale impulses to support a variable time step.
      // this.m_linearImpulse *= data.step.dtRatio;
      this.m_linearImpulse.SelfMul(data.step.dtRatio);
      this.m_angularImpulse *= data.step.dtRatio;

      // b2Vec2 P(this.m_linearImpulse.x, this.m_linearImpulse.y);
      const P: b2Vec2 = this.m_linearImpulse;
      // vA -= mA * P;
      vA.SelfMulSub(mA, P);
      wA -= iA * (b2CrossVV(rA, P) + this.m_angularImpulse);
      // vB += mB * P;
      vB.SelfMulAdd(mB, P);
      wB += iB * (b2CrossVV(rB, P) + this.m_angularImpulse);
    } else {
      this.m_linearImpulse.SetZero();
      this.m_angularImpulse = 0;
    }

    // data.velocities[this.m_indexA].v = vA; // vA is a reference
    data.velocities[this.m_indexA].w = wA;
    // data.velocities[this.m_indexB].v = vB; // vB is a reference
    data.velocities[this.m_indexB].w = wB;
  }

  private static SolveVelocityConstraints_s_Cdot_v2 = new b2Vec2();
  private static SolveVelocityConstraints_s_impulse_v2 = new b2Vec2();
  private static SolveVelocityConstraints_s_oldImpulse_v2 = new b2Vec2();
  public SolveVelocityConstraints(data) {
    const vA: b2Vec2 = data.velocities[this.m_indexA].v;
    let wA: number = data.velocities[this.m_indexA].w;
    const vB: b2Vec2 = data.velocities[this.m_indexB].v;
    let wB: number = data.velocities[this.m_indexB].w;

    const mA: number = this.m_invMassA, mB: number = this.m_invMassB;
    const iA: number = this.m_invIA, iB: number = this.m_invIB;

    const h: number = data.step.dt;
    const inv_h: number = data.step.inv_dt;

    // Solve angular friction
    {
      const Cdot: number = wB - wA + inv_h * this.m_correctionFactor * this.m_angularError;
      let impulse: number = -this.m_angularMass * Cdot;

      const oldImpulse: number = this.m_angularImpulse;
      const maxImpulse: number = h * this.m_maxTorque;
      this.m_angularImpulse = b2Clamp(this.m_angularImpulse + impulse, -maxImpulse, maxImpulse);
      impulse = this.m_angularImpulse - oldImpulse;

      wA -= iA * impulse;
      wB += iB * impulse;
    }

    // Solve linear friction
    {
      const rA = this.m_rA;
      const rB = this.m_rB;

      // b2Vec2 Cdot = vB + b2CrossSV(wB, rB) - vA - b2CrossSV(wA, rA) + inv_h * this.m_correctionFactor * this.m_linearError;
      const Cdot_v2 =
        b2AddVV(
          b2SubVV(
            b2AddVV(vB, b2CrossSV(wB, rB, b2Vec2.s_t0), b2Vec2.s_t0),
            b2AddVV(vA, b2CrossSV(wA, rA, b2Vec2.s_t1), b2Vec2.s_t1), b2Vec2.s_t2),
          b2MulSV(inv_h * this.m_correctionFactor, this.m_linearError, b2Vec2.s_t3),
          b2MotorJoint.SolveVelocityConstraints_s_Cdot_v2);

      // b2Vec2 impulse = -b2Mul(this.m_linearMass, Cdot);
      const impulse_v2: b2Vec2 = b2MulMV(this.m_linearMass, Cdot_v2, b2MotorJoint.SolveVelocityConstraints_s_impulse_v2).SelfNeg();
      // b2Vec2 oldImpulse = this.m_linearImpulse;
      const oldImpulse_v2 = b2MotorJoint.SolveVelocityConstraints_s_oldImpulse_v2.Copy(this.m_linearImpulse);
      // this.m_linearImpulse += impulse;
      this.m_linearImpulse.SelfAdd(impulse_v2);

      const maxImpulse: number = h * this.m_maxForce;

      if (this.m_linearImpulse.GetLengthSquared() > maxImpulse * maxImpulse) {
        this.m_linearImpulse.Normalize();
        // this.m_linearImpulse *= maxImpulse;
        this.m_linearImpulse.SelfMul(maxImpulse);
      }

      // impulse = this.m_linearImpulse - oldImpulse;
      b2SubVV(this.m_linearImpulse, oldImpulse_v2, impulse_v2);

      // vA -= mA * impulse;
      vA.SelfMulSub(mA, impulse_v2);
      // wA -= iA * b2CrossVV(rA, impulse);
      wA -= iA * b2CrossVV(rA, impulse_v2);

      // vB += mB * impulse;
      vB.SelfMulAdd(mB, impulse_v2);
      // wB += iB * b2CrossVV(rB, impulse);
      wB += iB * b2CrossVV(rB, impulse_v2);
    }

    // data.velocities[this.m_indexA].v = vA; // vA is a reference
    data.velocities[this.m_indexA].w = wA;
    // data.velocities[this.m_indexB].v = vB; // vB is a reference
    data.velocities[this.m_indexB].w = wB;
  }

  public SolvePositionConstraints(data) {
    return true;
  }

  public Dump() {
    if (DEBUG) {
      const indexA = this.m_bodyA.m_islandIndex;
      const indexB = this.m_bodyB.m_islandIndex;

      b2Log("  const jd: b2MotorJointDef = new b2MotorJointDef();\n");

      b2Log("  jd.bodyA = bodies[%d];\n", indexA);
      b2Log("  jd.bodyB = bodies[%d];\n", indexB);
      b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected) ? ("true") : ("false"));

      b2Log("  jd.linearOffset.SetXY(%.15f, %.15f);\n", this.m_linearOffset.x, this.m_linearOffset.y);
      b2Log("  jd.angularOffset = %.15f;\n", this.m_angularOffset);
      b2Log("  jd.maxForce = %.15f;\n", this.m_maxForce);
      b2Log("  jd.maxTorque = %.15f;\n", this.m_maxTorque);
      b2Log("  jd.correctionFactor = %.15f;\n", this.m_correctionFactor);
      b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
    }
  }
}
