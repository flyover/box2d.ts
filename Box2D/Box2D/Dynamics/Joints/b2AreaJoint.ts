//<reference path='../../../Box2D/Common/b2Settings.ts' />
//<reference path='../../../Box2D/Common/b2Math.ts' />
///<reference path='../../../Box2D/Dynamics/Joints/b2Joint.ts' />
///<reference path='../../../Box2D/Dynamics/Joints/b2DistanceJoint.ts' />

module box2d {

export class b2AreaJointDef extends b2JointDef
{
	public world: b2World = null;

	public bodies: b2Body[] = new Array();

	public frequencyHz: number = 0;

	public dampingRatio: number = 0;

	constructor()
	{
		super(b2JointType.e_areaJoint); // base class constructor
	}

	public AddBody(body)
	{
		this.bodies.push(body);

		if (this.bodies.length == 1)
		{
			this.bodyA = body;
		}
		else if (this.bodies.length == 2)
		{
			this.bodyB = body;
		}
	}
}

export class b2AreaJoint extends b2Joint
{
	public m_bodies: b2Body[] = null;
	public m_frequencyHz: number = 0;
	public m_dampingRatio: number = 0;

	// Solver shared
	public m_impulse: number = 0;

	// Solver temp
	public m_targetLengths = null;
	public m_targetArea: number = 0;
	public m_normals = null;
	public m_joints = null;
	public m_deltas = null;
	public m_delta = null;

	constructor(def)
	{
		super(def); // base class constructor

		if (ENABLE_ASSERTS) { b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies."); }

		this.m_bodies = def.bodies;
		this.m_frequencyHz = def.frequencyHz;
		this.m_dampingRatio = def.dampingRatio;

		this.m_targetLengths = b2MakeNumberArray(def.bodies.length);
		this.m_normals = b2Vec2.MakeArray(def.bodies.length);
		this.m_joints = new Array(def.bodies.length);
		this.m_deltas = b2Vec2.MakeArray(def.bodies.length);
		this.m_delta = new b2Vec2();

		var djd: b2DistanceJointDef = new b2DistanceJointDef();
		djd.frequencyHz = def.frequencyHz;
		djd.dampingRatio = def.dampingRatio;

		this.m_targetArea = 0;

		for (var i: number = 0, ict = this.m_bodies.length; i < ict; ++i)
		{
			var body = this.m_bodies[i];
			var next = this.m_bodies[(i+1)%ict];

			var body_c = body.GetWorldCenter();
			var next_c = next.GetWorldCenter();

			this.m_targetLengths[i] = b2DistanceVV(body_c, next_c);

			this.m_targetArea += b2CrossVV(body_c, next_c);

			djd.Initialize(body, next, body_c, next_c);
			this.m_joints[i] = def.world.CreateJoint(djd);
		}

		this.m_targetArea *= 0.5;
	}

	public GetAnchorA(out: b2Vec2): b2Vec2
	{
		return out.SetZero();
	}

	public GetAnchorB(out: b2Vec2): b2Vec2
	{
		return out.SetZero();
	}

	public GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2
	{
		return out.SetZero();
	}

	public GetReactionTorque(inv_dt: number): number
	{
		return 0;
	}

	public SetFrequency(hz)
	{
		this.m_frequencyHz = hz;

		for (var i: number = 0, ict = this.m_joints.length; i < ict; ++i)
		{
			this.m_joints[i].SetFrequency(hz);
		}
	}

	public GetFrequency()
	{
		return this.m_frequencyHz;
	}

	public SetDampingRatio(ratio)
	{
		this.m_dampingRatio = ratio;

		for (var i: number = 0, ict = this.m_joints.length; i < ict; ++i)
		{
			this.m_joints[i].SetDampingRatio(ratio);
		}
	}

	public GetDampingRatio()
	{
		return this.m_dampingRatio;
	}

	public Dump()
	{
		if (DEBUG)
		{
			b2Log("Area joint dumping is not supported.\n");
		}
	}

	public InitVelocityConstraints(data)
	{
		for (var i: number = 0, ict = this.m_bodies.length; i < ict; ++i)
		{
			var prev = this.m_bodies[(i+ict-1)%ict];
			var next = this.m_bodies[(i+1)%ict];
			var prev_c = data.positions[prev.m_islandIndex].c;
			var next_c = data.positions[next.m_islandIndex].c;
			var delta = this.m_deltas[i];

			b2SubVV(next_c, prev_c, delta);
		}

		if (data.step.warmStarting)
		{
			this.m_impulse *= data.step.dtRatio;

			for (var i: number = 0, ict = this.m_bodies.length; i < ict; ++i)
			{
				var body = this.m_bodies[i];
				var body_v = data.velocities[body.m_islandIndex].v;
				var delta = this.m_deltas[i];

				body_v.x += body.m_invMass *  delta.y * 0.5 * this.m_impulse;
				body_v.y += body.m_invMass * -delta.x * 0.5 * this.m_impulse;
			}
		}
		else
		{
			this.m_impulse = 0;
		}
	}

	public SolveVelocityConstraints(data)
	{
		var dotMassSum: number = 0;
		var crossMassSum: number = 0;

		for (var i: number = 0, ict = this.m_bodies.length; i < ict; ++i)
		{
			var body = this.m_bodies[i];
			var body_v = data.velocities[body.m_islandIndex].v;
			var delta = this.m_deltas[i];

			dotMassSum += delta.GetLengthSquared() / body.GetMass();
			crossMassSum += b2CrossVV(body_v, delta);
		}

		var lambda = -2 * crossMassSum / dotMassSum;
		//lambda = b2Clamp(lambda, -b2_maxLinearCorrection, b2_maxLinearCorrection);

		this.m_impulse += lambda;

		for (var i: number = 0, ict = this.m_bodies.length; i < ict; ++i)
		{
			var body = this.m_bodies[i];
			var body_v = data.velocities[body.m_islandIndex].v;
			var delta = this.m_deltas[i];

			body_v.x += body.m_invMass *  delta.y * 0.5 * lambda;
			body_v.y += body.m_invMass * -delta.x * 0.5 * lambda;
		}
	}

	public SolvePositionConstraints(data)
	{
		var perimeter: number = 0;
		var area: number = 0;

		for (var i: number = 0, ict = this.m_bodies.length; i < ict; ++i)
		{
			var body = this.m_bodies[i];
			var next = this.m_bodies[(i+1)%ict];
			var body_c = data.positions[body.m_islandIndex].c;
			var next_c = data.positions[next.m_islandIndex].c;

			var delta: b2Vec2 = b2SubVV(next_c, body_c, this.m_delta);

			var dist = delta.GetLength();
			if (dist < b2_epsilon)
			{
				dist = 1;
			}

			this.m_normals[i].x =  delta.y / dist;
			this.m_normals[i].y = -delta.x / dist;

			perimeter += dist;

			area += b2CrossVV(body_c, next_c);
		}

		area *= 0.5;

		var deltaArea = this.m_targetArea - area;
		var toExtrude: number = 0.5 * deltaArea / perimeter;
		var done = true;

		for (var i: number = 0, ict = this.m_bodies.length; i < ict; ++i)
		{
			var body = this.m_bodies[i];
			var body_c = data.positions[body.m_islandIndex].c;
			var next_i = (i+1)%ict;

			var delta: b2Vec2 = b2AddVV(this.m_normals[i], this.m_normals[next_i], this.m_delta);
			delta.SelfMul(toExtrude);

			var norm_sq = delta.GetLengthSquared();
			if (norm_sq > b2Sq(b2_maxLinearCorrection))
			{
				delta.SelfMul(b2_maxLinearCorrection / b2Sqrt(norm_sq));
			}
			if (norm_sq > b2Sq(b2_linearSlop))
			{
				done = false;
			}

			body_c.x += delta.x;
			body_c.y += delta.y;
		}

		return done;
	}
}

} // module box2d

