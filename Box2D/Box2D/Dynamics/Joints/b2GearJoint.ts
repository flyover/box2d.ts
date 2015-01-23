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

///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2RevoluteJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Joints/b2PrismaticJoint.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/b2Body.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/b2TimeStep.ts' />

module box2d {

/// Gear joint definition. This definition requires two existing
/// revolute or prismatic joints (any combination will work).
export class b2GearJointDef extends b2JointDef
{
	public joint1: b2Joint = null;

	public joint2: b2Joint = null;

	public ratio: number = 1;

	constructor()
	{
		super(b2JointType.e_gearJoint); // base class constructor
	}
}

export class b2GearJoint extends b2Joint
{
	public m_joint1: b2Joint = null;
	public m_joint2: b2Joint = null;

	public m_typeA: b2JointType = b2JointType.e_unknownJoint;
	public m_typeB: b2JointType = b2JointType.e_unknownJoint;

	// Body A is connected to body C
	// Body B is connected to body D
	public m_bodyC: b2Body = null;
	public m_bodyD: b2Body = null;

	// Solver shared
	public m_localAnchorA: b2Vec2 = new b2Vec2();
	public m_localAnchorB: b2Vec2 = new b2Vec2();
	public m_localAnchorC: b2Vec2 = new b2Vec2();
	public m_localAnchorD: b2Vec2 = new b2Vec2();

	public m_localAxisC: b2Vec2 = new b2Vec2();
	public m_localAxisD: b2Vec2 = new b2Vec2();

	public m_referenceAngleA: number = 0;
	public m_referenceAngleB: number = 0;

	public m_constant: number = 0;
	public m_ratio: number = 0;

	public m_impulse: number = 0;

	// Solver temp
	public m_indexA: number = 0;
	public m_indexB: number = 0;
	public m_indexC: number = 0;
	public m_indexD: number = 0;
	public m_lcA: b2Vec2 = new b2Vec2();
	public m_lcB: b2Vec2 = new b2Vec2();
	public m_lcC: b2Vec2 = new b2Vec2();
	public m_lcD: b2Vec2 = new b2Vec2();
	public m_mA: number = 0;
	public m_mB: number = 0;
	public m_mC: number = 0;
	public m_mD: number = 0;
	public m_iA: number = 0;
	public m_iB: number = 0;
	public m_iC: number = 0;
	public m_iD: number = 0;
	public m_JvAC: b2Vec2 = new b2Vec2();
	public m_JvBD: b2Vec2 = new b2Vec2();
	public m_JwA: number = 0;
	public m_JwB: number = 0;
	public m_JwC: number = 0;
	public m_JwD: number = 0;
	public m_mass: number = 0;

	public m_qA: b2Rot = new b2Rot();
	public m_qB: b2Rot = new b2Rot();
	public m_qC: b2Rot = new b2Rot();
	public m_qD: b2Rot = new b2Rot();
	public m_lalcA: b2Vec2 = new b2Vec2();
	public m_lalcB: b2Vec2 = new b2Vec2();
	public m_lalcC: b2Vec2 = new b2Vec2();
	public m_lalcD: b2Vec2 = new b2Vec2();

	constructor(def)
	{
		super(def); // base class constructor

		this.m_joint1 = def.joint1;
		this.m_joint2 = def.joint2;

		this.m_typeA = this.m_joint1.GetType();
		this.m_typeB = this.m_joint2.GetType();

		if (ENABLE_ASSERTS) { b2Assert(this.m_typeA == b2JointType.e_revoluteJoint || this.m_typeA == b2JointType.e_prismaticJoint); }
		if (ENABLE_ASSERTS) { b2Assert(this.m_typeB == b2JointType.e_revoluteJoint || this.m_typeB == b2JointType.e_prismaticJoint); }

		var coordinateA: number, coordinateB;

		// TODO_ERIN there might be some problem with the joint edges in b2Joint.

		this.m_bodyC = this.m_joint1.GetBodyA();
		this.m_bodyA = this.m_joint1.GetBodyB();

		// Get geometry of joint1
		var xfA: b2Transform = this.m_bodyA.m_xf;
		var aA: number = this.m_bodyA.m_sweep.a;
		var xfC: b2Transform = this.m_bodyC.m_xf;
		var aC: number = this.m_bodyC.m_sweep.a;

		if (this.m_typeA == b2JointType.e_revoluteJoint)
		{
			var revolute: b2RevoluteJoint = def.joint1;
			this.m_localAnchorC.Copy(revolute.m_localAnchorA);
			this.m_localAnchorA.Copy(revolute.m_localAnchorB);
			this.m_referenceAngleA = revolute.m_referenceAngle;
			this.m_localAxisC.SetZero();

			coordinateA = aA - aC - this.m_referenceAngleA;
		}
		else
		{
			var prismatic: b2PrismaticJoint = def.joint1;
			this.m_localAnchorC.Copy(prismatic.m_localAnchorA);
			this.m_localAnchorA.Copy(prismatic.m_localAnchorB);
			this.m_referenceAngleA = prismatic.m_referenceAngle;
			this.m_localAxisC.Copy(prismatic.m_localXAxisA);

			//b2Vec2 pC = m_localAnchorC;
			var pC = this.m_localAnchorC;
			//b2Vec2 pA = b2MulT(xfC.q, b2Mul(xfA.q, m_localAnchorA) + (xfA.p - xfC.p));
			var pA: b2Vec2 = b2MulTRV(
				xfC.q,
				b2AddVV(
					b2MulRV(xfA.q, this.m_localAnchorA, b2Vec2.s_t0), 
					b2SubVV(xfA.p, xfC.p, b2Vec2.s_t1),
					b2Vec2.s_t0),
				b2Vec2.s_t0); // pA uses s_t0
			//coordinateA = b2Dot(pA - pC, m_localAxisC);
			coordinateA = b2DotVV(b2SubVV(pA, pC, b2Vec2.s_t0), this.m_localAxisC);
		}

		this.m_bodyD = this.m_joint2.GetBodyA();
		this.m_bodyB = this.m_joint2.GetBodyB();

		// Get geometry of joint2
		var xfB: b2Transform = this.m_bodyB.m_xf;
		var aB: number = this.m_bodyB.m_sweep.a;
		var xfD: b2Transform = this.m_bodyD.m_xf;
		var aD: number = this.m_bodyD.m_sweep.a;

		if (this.m_typeB == b2JointType.e_revoluteJoint)
		{
			var revolute: b2RevoluteJoint = def.joint2;
			this.m_localAnchorD.Copy(revolute.m_localAnchorA);
			this.m_localAnchorB.Copy(revolute.m_localAnchorB);
			this.m_referenceAngleB = revolute.m_referenceAngle;
			this.m_localAxisD.SetZero();

			coordinateB = aB - aD - this.m_referenceAngleB;
		}
		else
		{
			var prismatic: b2PrismaticJoint = def.joint2;
			this.m_localAnchorD.Copy(prismatic.m_localAnchorA);
			this.m_localAnchorB.Copy(prismatic.m_localAnchorB);
			this.m_referenceAngleB = prismatic.m_referenceAngle;
			this.m_localAxisD.Copy(prismatic.m_localXAxisA);

			//b2Vec2 pD = m_localAnchorD;
			var pD = this.m_localAnchorD;
			//b2Vec2 pB = b2MulT(xfD.q, b2Mul(xfB.q, m_localAnchorB) + (xfB.p - xfD.p));
			var pB: b2Vec2 = b2MulTRV(
				xfD.q,
				b2AddVV(
					b2MulRV(xfB.q, this.m_localAnchorB, b2Vec2.s_t0), 
					b2SubVV(xfB.p, xfD.p, b2Vec2.s_t1),
					b2Vec2.s_t0),
				b2Vec2.s_t0); // pB uses s_t0
			//coordinateB = b2Dot(pB - pD, m_localAxisD);
			coordinateB = b2DotVV(b2SubVV(pB, pD, b2Vec2.s_t0), this.m_localAxisD);
		}

		this.m_ratio = def.ratio;

		this.m_constant = coordinateA + this.m_ratio * coordinateB;

		this.m_impulse = 0;
	}

	private static InitVelocityConstraints_s_u = new b2Vec2();
	private static InitVelocityConstraints_s_rA = new b2Vec2();
	private static InitVelocityConstraints_s_rB = new b2Vec2();
	private static InitVelocityConstraints_s_rC = new b2Vec2();
	private static InitVelocityConstraints_s_rD = new b2Vec2();
	public InitVelocityConstraints(data)
	{
		this.m_indexA = this.m_bodyA.m_islandIndex;
		this.m_indexB = this.m_bodyB.m_islandIndex;
		this.m_indexC = this.m_bodyC.m_islandIndex;
		this.m_indexD = this.m_bodyD.m_islandIndex;
		this.m_lcA.Copy(this.m_bodyA.m_sweep.localCenter);
		this.m_lcB.Copy(this.m_bodyB.m_sweep.localCenter);
		this.m_lcC.Copy(this.m_bodyC.m_sweep.localCenter);
		this.m_lcD.Copy(this.m_bodyD.m_sweep.localCenter);
		this.m_mA = this.m_bodyA.m_invMass;
		this.m_mB = this.m_bodyB.m_invMass;
		this.m_mC = this.m_bodyC.m_invMass;
		this.m_mD = this.m_bodyD.m_invMass;
		this.m_iA = this.m_bodyA.m_invI;
		this.m_iB = this.m_bodyB.m_invI;
		this.m_iC = this.m_bodyC.m_invI;
		this.m_iD = this.m_bodyD.m_invI;

		var aA: number = data.positions[this.m_indexA].a;
		var vA: b2Vec2 = data.velocities[this.m_indexA].v;
		var wA: number = data.velocities[this.m_indexA].w;

		var aB: number = data.positions[this.m_indexB].a;
		var vB: b2Vec2 = data.velocities[this.m_indexB].v;
		var wB: number = data.velocities[this.m_indexB].w;

		var aC: number = data.positions[this.m_indexC].a;
		var vC: b2Vec2 = data.velocities[this.m_indexC].v;
		var wC: number = data.velocities[this.m_indexC].w;

		var aD: number = data.positions[this.m_indexD].a;
		var vD: b2Vec2 = data.velocities[this.m_indexD].v;
		var wD: number = data.velocities[this.m_indexD].w;

		//b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
		var qA: b2Rot = this.m_qA.SetAngleRadians(aA), 
			qB: b2Rot = this.m_qB.SetAngleRadians(aB), 
			qC: b2Rot = this.m_qC.SetAngleRadians(aC), 
			qD: b2Rot = this.m_qD.SetAngleRadians(aD);

		this.m_mass = 0;

		if (this.m_typeA == b2JointType.e_revoluteJoint)
		{
			this.m_JvAC.SetZero();
			this.m_JwA = 1;
			this.m_JwC = 1;
			this.m_mass += this.m_iA + this.m_iC;
		}
		else
		{
			//b2Vec2 u = b2Mul(qC, m_localAxisC);
			var u: b2Vec2 = b2MulRV(qC, this.m_localAxisC, b2GearJoint.InitVelocityConstraints_s_u);
			//b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
			b2SubVV(this.m_localAnchorC, this.m_lcC, this.m_lalcC);
			var rC: b2Vec2 = b2MulRV(qC, this.m_lalcC, b2GearJoint.InitVelocityConstraints_s_rC);
			//b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
			b2SubVV(this.m_localAnchorA, this.m_lcA, this.m_lalcA);
			var rA: b2Vec2 = b2MulRV(qA, this.m_lalcA, b2GearJoint.InitVelocityConstraints_s_rA);
			//m_JvAC = u;
			this.m_JvAC.Copy(u);
			//m_JwC = b2Cross(rC, u);
			this.m_JwC = b2CrossVV(rC, u);
			//m_JwA = b2Cross(rA, u);
			this.m_JwA = b2CrossVV(rA, u);
			this.m_mass += this.m_mC + this.m_mA + this.m_iC * this.m_JwC * this.m_JwC + this.m_iA * this.m_JwA * this.m_JwA;
		}

		if (this.m_typeB == b2JointType.e_revoluteJoint)
		{
			this.m_JvBD.SetZero();
			this.m_JwB = this.m_ratio;
			this.m_JwD = this.m_ratio;
			this.m_mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);
		}
		else
		{
			//b2Vec2 u = b2Mul(qD, m_localAxisD);
			var u: b2Vec2 = b2MulRV(qD, this.m_localAxisD, b2GearJoint.InitVelocityConstraints_s_u);
			//b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
			b2SubVV(this.m_localAnchorD, this.m_lcD, this.m_lalcD);
			var rD: b2Vec2 = b2MulRV(qD, this.m_lalcD, b2GearJoint.InitVelocityConstraints_s_rD);
			//b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
			b2SubVV(this.m_localAnchorB, this.m_lcB, this.m_lalcB);
			var rB: b2Vec2 = b2MulRV(qB, this.m_lalcB, b2GearJoint.InitVelocityConstraints_s_rB);
			//m_JvBD = m_ratio * u;
			b2MulSV(this.m_ratio, u, this.m_JvBD);
			//m_JwD = m_ratio * b2Cross(rD, u);
			this.m_JwD = this.m_ratio * b2CrossVV(rD, u);
			//m_JwB = m_ratio * b2Cross(rB, u);
			this.m_JwB = this.m_ratio * b2CrossVV(rB, u);
			this.m_mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * this.m_JwD * this.m_JwD + this.m_iB * this.m_JwB * this.m_JwB;
		}

		// Compute effective mass.
		this.m_mass = this.m_mass > 0 ? 1 / this.m_mass : 0;

		if (data.step.warmStarting)
		{
			//vA += (m_mA * m_impulse) * m_JvAC;
			vA.SelfMulAdd(this.m_mA * this.m_impulse, this.m_JvAC);
			wA += this.m_iA * this.m_impulse * this.m_JwA;
			//vB += (m_mB * m_impulse) * m_JvBD;
			vB.SelfMulAdd(this.m_mB * this.m_impulse, this.m_JvBD);
			wB += this.m_iB * this.m_impulse * this.m_JwB;
			//vC -= (m_mC * m_impulse) * m_JvAC;
			vC.SelfMulSub(this.m_mC * this.m_impulse, this.m_JvAC);
			wC -= this.m_iC * this.m_impulse * this.m_JwC;
			//vD -= (m_mD * m_impulse) * m_JvBD;
			vD.SelfMulSub(this.m_mD * this.m_impulse, this.m_JvBD);
			wD -= this.m_iD * this.m_impulse * this.m_JwD;
		}
		else
		{
			this.m_impulse = 0;
		}

		//data.velocities[this.m_indexA].v = vA;
		data.velocities[this.m_indexA].w = wA;
		//data.velocities[this.m_indexB].v = vB;
		data.velocities[this.m_indexB].w = wB;
		//data.velocities[this.m_indexC].v = vC;
		data.velocities[this.m_indexC].w = wC;
		//data.velocities[this.m_indexD].v = vD;
		data.velocities[this.m_indexD].w = wD;
	}

	public SolveVelocityConstraints(data)
	{
		var vA: b2Vec2 = data.velocities[this.m_indexA].v;
		var wA: number = data.velocities[this.m_indexA].w;
		var vB: b2Vec2 = data.velocities[this.m_indexB].v;
		var wB: number = data.velocities[this.m_indexB].w;
		var vC: b2Vec2 = data.velocities[this.m_indexC].v;
		var wC: number = data.velocities[this.m_indexC].w;
		var vD: b2Vec2 = data.velocities[this.m_indexD].v;
		var wD: number = data.velocities[this.m_indexD].w;

		//float32 Cdot = b2Dot(m_JvAC, vA - vC) + b2Dot(m_JvBD, vB - vD);
		var Cdot = 
			b2DotVV(this.m_JvAC, b2SubVV(vA, vC, b2Vec2.s_t0)) + 
			b2DotVV(this.m_JvBD, b2SubVV(vB, vD, b2Vec2.s_t0));
		Cdot += (this.m_JwA * wA - this.m_JwC * wC) + (this.m_JwB * wB - this.m_JwD * wD);

		var impulse: number = -this.m_mass * Cdot;
		this.m_impulse += impulse;

		//vA += (m_mA * impulse) * m_JvAC;
		vA.SelfMulAdd((this.m_mA * impulse), this.m_JvAC);
		wA += this.m_iA * impulse * this.m_JwA;
		//vB += (m_mB * impulse) * m_JvBD;
		vB.SelfMulAdd((this.m_mB * impulse), this.m_JvBD);
		wB += this.m_iB * impulse * this.m_JwB;
		//vC -= (m_mC * impulse) * m_JvAC;
		vC.SelfMulSub((this.m_mC * impulse), this.m_JvAC);
		wC -= this.m_iC * impulse * this.m_JwC;
		//vD -= (m_mD * impulse) * m_JvBD;
		vD.SelfMulSub((this.m_mD * impulse), this.m_JvBD);
		wD -= this.m_iD * impulse * this.m_JwD;

		//data.velocities[this.m_indexA].v = vA;
		data.velocities[this.m_indexA].w = wA;
		//data.velocities[this.m_indexB].v = vB;
		data.velocities[this.m_indexB].w = wB;
		//data.velocities[this.m_indexC].v = vC;
		data.velocities[this.m_indexC].w = wC;
		//data.velocities[this.m_indexD].v = vD;
		data.velocities[this.m_indexD].w = wD;
	}

	private static SolvePositionConstraints_s_u = new b2Vec2();
	private static SolvePositionConstraints_s_rA = new b2Vec2();
	private static SolvePositionConstraints_s_rB = new b2Vec2();
	private static SolvePositionConstraints_s_rC = new b2Vec2();
	private static SolvePositionConstraints_s_rD = new b2Vec2();
	public SolvePositionConstraints(data)
	{
		var cA: b2Vec2 = data.positions[this.m_indexA].c;
		var aA: number = data.positions[this.m_indexA].a;
		var cB: b2Vec2 = data.positions[this.m_indexB].c;
		var aB: number = data.positions[this.m_indexB].a;
		var cC: b2Vec2 = data.positions[this.m_indexC].c;
		var aC: number = data.positions[this.m_indexC].a;
		var cD: b2Vec2 = data.positions[this.m_indexD].c;
		var aD: number = data.positions[this.m_indexD].a;

		//b2Rot qA(aA), qB(aB), qC(aC), qD(aD);
		var qA: b2Rot = this.m_qA.SetAngleRadians(aA), 
			qB: b2Rot = this.m_qB.SetAngleRadians(aB), 
			qC: b2Rot = this.m_qC.SetAngleRadians(aC), 
			qD: b2Rot = this.m_qD.SetAngleRadians(aD);

		var linearError: number = 0;

		var coordinateA: number, coordinateB;

		var JvAC: b2Vec2 = this.m_JvAC, JvBD = this.m_JvBD;
		var JwA: number, JwB, JwC, JwD;
		var mass: number = 0;

		if (this.m_typeA == b2JointType.e_revoluteJoint)
		{
			JvAC.SetZero();
			JwA = 1;
			JwC = 1;
			mass += this.m_iA + this.m_iC;

			coordinateA = aA - aC - this.m_referenceAngleA;
		}
		else
		{
			//b2Vec2 u = b2Mul(qC, m_localAxisC);
			var u: b2Vec2 = b2MulRV(qC, this.m_localAxisC, b2GearJoint.SolvePositionConstraints_s_u);
			//b2Vec2 rC = b2Mul(qC, m_localAnchorC - m_lcC);
			var rC: b2Vec2 = b2MulRV(qC, this.m_lalcC, b2GearJoint.SolvePositionConstraints_s_rC);
			//b2Vec2 rA = b2Mul(qA, m_localAnchorA - m_lcA);
			var rA: b2Vec2 = b2MulRV(qA, this.m_lalcA, b2GearJoint.SolvePositionConstraints_s_rA);
			//JvAC = u;
			JvAC.Copy(u);
			//JwC = b2Cross(rC, u);
			JwC = b2CrossVV(rC, u);
			//JwA = b2Cross(rA, u);
			JwA = b2CrossVV(rA, u);
			mass += this.m_mC + this.m_mA + this.m_iC * JwC * JwC + this.m_iA * JwA * JwA;

			//b2Vec2 pC = m_localAnchorC - m_lcC;
			var pC = this.m_lalcC;
			//b2Vec2 pA = b2MulT(qC, rA + (cA - cC));
			var pA: b2Vec2 = b2MulTRV(
				qC,
				b2AddVV(
					rA, 
					b2SubVV(cA, cC, b2Vec2.s_t0), 
					b2Vec2.s_t0),
				b2Vec2.s_t0); // pA uses s_t0
			//coordinateA = b2Dot(pA - pC, m_localAxisC);
			coordinateA = b2DotVV(b2SubVV(pA, pC, b2Vec2.s_t0), this.m_localAxisC);
		}

		if (this.m_typeB == b2JointType.e_revoluteJoint)
		{
			JvBD.SetZero();
			JwB = this.m_ratio;
			JwD = this.m_ratio;
			mass += this.m_ratio * this.m_ratio * (this.m_iB + this.m_iD);

			coordinateB = aB - aD - this.m_referenceAngleB;
		}
		else
		{
			//b2Vec2 u = b2Mul(qD, m_localAxisD);
			var u: b2Vec2 = b2MulRV(qD, this.m_localAxisD, b2GearJoint.SolvePositionConstraints_s_u);
			//b2Vec2 rD = b2Mul(qD, m_localAnchorD - m_lcD);
			var rD: b2Vec2 = b2MulRV(qD, this.m_lalcD, b2GearJoint.SolvePositionConstraints_s_rD);
			//b2Vec2 rB = b2Mul(qB, m_localAnchorB - m_lcB);
			var rB: b2Vec2 = b2MulRV(qB, this.m_lalcB, b2GearJoint.SolvePositionConstraints_s_rB);
			//JvBD = m_ratio * u;
			b2MulSV(this.m_ratio, u, JvBD);
			//JwD = m_ratio * b2Cross(rD, u);
			JwD = this.m_ratio * b2CrossVV(rD, u);
			//JwB = m_ratio * b2Cross(rB, u);
			JwB = this.m_ratio * b2CrossVV(rB, u);
			mass += this.m_ratio * this.m_ratio * (this.m_mD + this.m_mB) + this.m_iD * JwD * JwD + this.m_iB * JwB * JwB;

			//b2Vec2 pD = m_localAnchorD - m_lcD;
			var pD = this.m_lalcD;
			//b2Vec2 pB = b2MulT(qD, rB + (cB - cD));
			var pB: b2Vec2 = b2MulTRV(
				qD,
				b2AddVV(
					rB, 
					b2SubVV(cB, cD, b2Vec2.s_t0), 
					b2Vec2.s_t0),
				b2Vec2.s_t0); // pB uses s_t0
			//coordinateB = b2Dot(pB - pD, m_localAxisD);
			coordinateB = b2DotVV(b2SubVV(pB, pD, b2Vec2.s_t0), this.m_localAxisD);
		}

		var C: number = (coordinateA + this.m_ratio * coordinateB) - this.m_constant;

		var impulse: number = 0;
		if (mass > 0)
		{
			impulse = -C / mass;
		}

		//cA += m_mA * impulse * JvAC;
		cA.SelfMulAdd(this.m_mA * impulse, JvAC);
		aA += this.m_iA * impulse * JwA;
		//cB += m_mB * impulse * JvBD;
		cB.SelfMulAdd(this.m_mB * impulse, JvBD);
		aB += this.m_iB * impulse * JwB;
		//cC -= m_mC * impulse * JvAC;
		cC.SelfMulSub(this.m_mC * impulse, JvAC);
		aC -= this.m_iC * impulse * JwC;
		//cD -= m_mD * impulse * JvBD;
		cD.SelfMulSub(this.m_mD * impulse, JvBD);
		aD -= this.m_iD * impulse * JwD;

		//data.positions[this.m_indexA].c = cA;
		data.positions[this.m_indexA].a = aA;
		//data.positions[this.m_indexB].c = cB;
		data.positions[this.m_indexB].a = aB;
		//data.positions[this.m_indexC].c = cC;
		data.positions[this.m_indexC].a = aC;
		//data.positions[this.m_indexD].c = cD;
		data.positions[this.m_indexD].a = aD;

		// TODO_ERIN not implemented
		return linearError < b2_linearSlop;
	}

	public GetAnchorA(out: b2Vec2): b2Vec2
	{
		return this.m_bodyA.GetWorldPoint(this.m_localAnchorA, out);
	}

	public GetAnchorB(out: b2Vec2): b2Vec2
	{
		return this.m_bodyB.GetWorldPoint(this.m_localAnchorB, out);
	}

	public GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2
	{
		//b2Vec2 P = m_impulse * m_JvAC;
		//return inv_dt * P;
		return b2MulSV(inv_dt * this.m_impulse, this.m_JvAC, out);
	}

	public GetReactionTorque(inv_dt: number): number
	{
		//float32 L = m_impulse * m_JwA;
		//return inv_dt * L;
		return inv_dt * this.m_impulse * this.m_JwA;
	}

	public GetJoint1() { return this.m_joint1; }

	public GetJoint2() { return this.m_joint2; }

	public GetRatio()
	{
		return this.m_ratio;
	}

	public SetRatio(ratio)
	{
		if (ENABLE_ASSERTS) { b2Assert(b2IsValid(ratio)); }
		this.m_ratio = ratio;
	}

	public Dump()
	{
		if (DEBUG)
		{
			var indexA = this.m_bodyA.m_islandIndex;
			var indexB = this.m_bodyB.m_islandIndex;
		
			var index1 = this.m_joint1.m_index;
			var index2 = this.m_joint2.m_index;
		
			b2Log("  var jd: b2GearJointDef = new b2GearJointDef();\n");
			b2Log("  jd.bodyA = bodies[%d];\n", indexA);
			b2Log("  jd.bodyB = bodies[%d];\n", indexB);
			b2Log("  jd.collideConnected = %s;\n", (this.m_collideConnected)?('true'):('false'));
			b2Log("  jd.joint1 = joints[%d];\n", index1);
			b2Log("  jd.joint2 = joints[%d];\n", index2);
			b2Log("  jd.ratio = %.15f;\n", this.m_ratio);
			b2Log("  joints[%d] = this.m_world.CreateJoint(jd);\n", this.m_index);
		}
	}
}

} // module box2d

