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

///<reference path='../../../Box2D/Box2D/Common/b2Settings.ts' />
///<reference path='../../../Box2D/Box2D/Common/b2Math.ts' />
///<reference path='../../../Box2D/Box2D/Common/b2BlockAllocator.ts' />
///<reference path='../../../Box2D/Box2D/Common/b2StackAllocator.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/b2ContactManager.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/b2WorldCallbacks.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/b2TimeStep.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/b2Body.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/b2Fixture.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/b2Island.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/Joints/b2Joint.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/Joints/b2JointFactory.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/Joints/b2PulleyJoint.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts' />
///<reference path='../../../Box2D/Box2D/Dynamics/Contacts/b2ContactSolver.ts' />
///<reference path='../../../Box2D/Box2D/Collision/b2Collision.ts' />
///<reference path='../../../Box2D/Box2D/Collision/b2BroadPhase.ts' />
///<reference path='../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts' />
///<reference path='../../../Box2D/Box2D/Collision/Shapes/b2EdgeShape.ts' />
///<reference path='../../../Box2D/Box2D/Collision/Shapes/b2ChainShape.ts' />
///<reference path='../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts' />
///<reference path='../../../Box2D/Box2D/Collision/b2TimeOfImpact.ts' />
///<reference path='../../../Box2D/Box2D/Common/b2Draw.ts' />
///<reference path='../../../Box2D/Box2D/Common/b2Timer.ts' />

///<reference path='../../../Contributions/Enhancements/Controllers/b2Controller.ts' />

module box2d {

export enum b2WorldFlag
{
	e_none			= 0,
	e_newFixture	= 0x1,
	e_locked		= 0x2,
	e_clearForces	= 0x4
}

/// The world class manages all physics entities, dynamic simulation,
/// and asynchronous queries. The world also contains efficient memory
/// management facilities.
export class b2World
{
	//b2BlockAllocator m_blockAllocator;
	//b2StackAllocator m_stackAllocator;

	public m_flags: b2WorldFlag = b2WorldFlag.e_clearForces;

	public m_contactManager: b2ContactManager = new b2ContactManager();

	public m_bodyList: b2Body = null;
	public m_jointList: b2Joint = null;

	public m_bodyCount: number = 0;
	public m_jointCount: number = 0;

	public m_gravity: b2Vec2 = new b2Vec2();
	public m_allowSleep: boolean = true;

	public m_destructionListener: b2DestructionListener = null;
	public m_debugDraw: b2Draw = null;

	// This is used to compute the time step ratio to
	// support a variable time step.
	public m_inv_dt0: number = 0;

	// These are for debugging the solver.
	public m_warmStarting: boolean = true;
	public m_continuousPhysics: boolean = true;
	public m_subStepping: boolean = false;

	public m_stepComplete: boolean = true;

	public m_profile: b2Profile = new b2Profile();

	public m_island: b2Island = new b2Island();

	public s_stack: b2Body[] = new Array();

//	public m_controllerList: b2Controller = null;
//	public m_controllerCount: number = 0;

	/// Construct a world object.
	/// @param gravity the world gravity vector.
	constructor(gravity: b2Vec2)
	{
		this.m_gravity = gravity.Clone();
	}

	/// Register a destruction listener. The listener is owned by you and must
	/// remain in scope.
	public SetDestructionListener(listener: b2DestructionListener): void
	{
		this.m_destructionListener = listener;
	}

	/// Register a contact filter to provide specific control over collision.
	/// Otherwise the default filter is used (b2_defaultFilter). The listener is
	/// owned by you and must remain in scope. 
	public SetContactFilter(filter: b2ContactFilter): void
	{
		this.m_contactManager.m_contactFilter = filter;
	}

	/// Register a contact event listener. The listener is owned by you and must
	/// remain in scope.
	public SetContactListener(listener: b2ContactListener): void
	{
		this.m_contactManager.m_contactListener = listener;
	}

	/// Register a routine for debug drawing. The debug draw functions are called
	/// inside with b2World::DrawDebugData method. The debug draw object is owned
	/// by you and must remain in scope.
	public SetDebugDraw(debugDraw: b2Draw): void
	{
		this.m_debugDraw = debugDraw;
	}

	/// Create a rigid body given a definition. No reference to the definition
	/// is retained.
	/// @warning This function is locked during callbacks.
	public CreateBody(def: b2BodyDef): b2Body
	{
		if (ENABLE_ASSERTS) { b2Assert(this.IsLocked() == false); }
		if (this.IsLocked())
		{
			return null;
		}

		var b: b2Body = new b2Body(def, this);

		// Add to world doubly linked list.
		b.m_prev = null;
		b.m_next = this.m_bodyList;
		if (this.m_bodyList)
		{
			this.m_bodyList.m_prev = b;
		}
		this.m_bodyList = b;
		++this.m_bodyCount;

		return b;
	}

	/// Destroy a rigid body given a definition. No reference to the definition
	/// is retained. This function is locked during callbacks.
	/// @warning This automatically deletes all associated shapes and joints.
	/// @warning This function is locked during callbacks.
	public DestroyBody(b: b2Body): void
	{
		if (ENABLE_ASSERTS) { b2Assert(this.m_bodyCount > 0); }
		if (ENABLE_ASSERTS) { b2Assert(this.IsLocked() == false); }
		if (this.IsLocked())
		{
			return;
		}

		// Delete the attached joints.
		var je: b2JointEdge = b.m_jointList;
		while (je)
		{
			var je0: b2JointEdge = je;
			je = je.next;

			if (this.m_destructionListener)
			{
				this.m_destructionListener.SayGoodbyeJoint(je0.joint);
			}

			this.DestroyJoint(je0.joint);

			b.m_jointList = je;
		}
		b.m_jointList = null;

		/// @see b2Controller list
//		var coe: b2ControllerEdge = b.m_controllerList;
//		while (coe)
//		{
//			var coe0: b2ControllerEdge = coe;
//			coe = coe.nextController;
//			coe0.controller.RemoveBody(b);
//		}

		// Delete the attached contacts.
		var ce: b2ContactEdge = b.m_contactList;
		while (ce)
		{
			var ce0: b2ContactEdge = ce;
			ce = ce.next;
			this.m_contactManager.Destroy(ce0.contact);
		}
		b.m_contactList = null;

		// Delete the attached fixtures. This destroys broad-phase proxies.
		var f: b2Fixture = b.m_fixtureList;
		while (f)
		{
			var f0: b2Fixture = f;
			f = f.m_next;

			if (this.m_destructionListener)
			{
				this.m_destructionListener.SayGoodbyeFixture(f0);
			}

			f0.DestroyProxies(this.m_contactManager.m_broadPhase);
			f0.Destroy();


			b.m_fixtureList = f;
			b.m_fixtureCount -= 1;
		}
		b.m_fixtureList = null;
		b.m_fixtureCount = 0;

		// Remove world body list.
		if (b.m_prev)
		{
			b.m_prev.m_next = b.m_next;
		}

		if (b.m_next)
		{
			b.m_next.m_prev = b.m_prev;
		}

		if (b == this.m_bodyList)
		{
			this.m_bodyList = b.m_next;
		}

		--this.m_bodyCount;
	}

	/// Create a joint to constrain bodies together. No reference to the definition
	/// is retained. This may cause the connected bodies to cease colliding.
	/// @warning This function is locked during callbacks.
	public CreateJoint(def: b2JointDef): b2Joint
	{
		if (ENABLE_ASSERTS) { b2Assert(this.IsLocked() == false); }
		if (this.IsLocked())
		{
			return null;
		}

		var j: b2Joint = b2JointFactory.Create(def, null);

		// Connect to the world list.
		j.m_prev = null;
		j.m_next = this.m_jointList;
		if (this.m_jointList)
		{
			this.m_jointList.m_prev = j;
		}
		this.m_jointList = j;
		++this.m_jointCount;

		// Connect to the bodies' doubly linked lists.
		j.m_edgeA.joint = j;
		j.m_edgeA.other = j.m_bodyB;
		j.m_edgeA.prev = null;
		j.m_edgeA.next = j.m_bodyA.m_jointList;
		if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
		j.m_bodyA.m_jointList = j.m_edgeA;

		j.m_edgeB.joint = j;
		j.m_edgeB.other = j.m_bodyA;
		j.m_edgeB.prev = null;
		j.m_edgeB.next = j.m_bodyB.m_jointList;
		if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
		j.m_bodyB.m_jointList = j.m_edgeB;

		var bodyA: b2Body = def.bodyA;
		var bodyB: b2Body = def.bodyB;

		// If the joint prevents collisions, then flag any contacts for filtering.
		if (def.collideConnected == false)
		{
			var edge: b2ContactEdge = bodyB.GetContactList();
			while (edge)
			{
				if (edge.other == bodyA)
				{
					// Flag the contact for filtering at the next time step (where either
					// body is awake).
					edge.contact.FlagForFiltering();
				}

				edge = edge.next;
			}
		}

		// Note: creating a joint doesn't wake the bodies.

		return j;
	}

	/// Destroy a joint. This may cause the connected bodies to begin colliding.
	/// @warning This function is locked during callbacks.
	public DestroyJoint(j: b2Joint): void
	{
		if (ENABLE_ASSERTS) { b2Assert(this.IsLocked() == false); }
		if (this.IsLocked())
		{
			return;
		}

		var collideConnected: boolean = j.m_collideConnected;

		// Remove from the doubly linked list.
		if (j.m_prev)
		{
			j.m_prev.m_next = j.m_next;
		}

		if (j.m_next)
		{
			j.m_next.m_prev = j.m_prev;
		}

		if (j == this.m_jointList)
		{
			this.m_jointList = j.m_next;
		}

		// Disconnect from island graph.
		var bodyA: b2Body = j.m_bodyA;
		var bodyB: b2Body = j.m_bodyB;

		// Wake up connected bodies.
		bodyA.SetAwake(true);
		bodyB.SetAwake(true);

		// Remove from body 1.
		if (j.m_edgeA.prev)
		{
			j.m_edgeA.prev.next = j.m_edgeA.next;
		}

		if (j.m_edgeA.next)
		{
			j.m_edgeA.next.prev = j.m_edgeA.prev;
		}

		if (j.m_edgeA == bodyA.m_jointList)
		{
			bodyA.m_jointList = j.m_edgeA.next;
		}

		j.m_edgeA.prev = null;
		j.m_edgeA.next = null;

		// Remove from body 2
		if (j.m_edgeB.prev)
		{
			j.m_edgeB.prev.next = j.m_edgeB.next;
		}

		if (j.m_edgeB.next)
		{
			j.m_edgeB.next.prev = j.m_edgeB.prev;
		}

		if (j.m_edgeB == bodyB.m_jointList)
		{
			bodyB.m_jointList = j.m_edgeB.next;
		}

		j.m_edgeB.prev = null;
		j.m_edgeB.next = null;

		b2JointFactory.Destroy(j, null);

		if (ENABLE_ASSERTS) { b2Assert(this.m_jointCount > 0); }
		--this.m_jointCount;

		// If the joint prevents collisions, then flag any contacts for filtering.
		if (collideConnected == false)
		{
			var edge: b2ContactEdge = bodyB.GetContactList();
			while (edge)
			{
				if (edge.other == bodyA)
				{
					// Flag the contact for filtering at the next time step (where either
					// body is awake).
					edge.contact.FlagForFiltering();
				}

				edge = edge.next;
			}
		}
	}

	/// Take a time step. This performs collision detection, integration,
	/// and constraint solution.
	/// @param timeStep the amount of time to simulate, this should not vary.
	/// @param velocityIterations for the velocity constraint solver.
	/// @param positionIterations for the position constraint solver.
	private static Step_s_step = new b2TimeStep();
	public Step(dt: number, velocityIterations: number, positionIterations: number): void
	{
		var stepTimer: b2Timer = new b2Timer();

		// If new fixtures were added, we need to find the new contacts.
		if (this.m_flags & b2WorldFlag.e_newFixture)
		{
			this.m_contactManager.FindNewContacts();
			this.m_flags &= ~b2WorldFlag.e_newFixture;
		}

		this.m_flags |= b2WorldFlag.e_locked;

		var step: b2TimeStep = b2World.Step_s_step;
		step.dt = dt;
		step.velocityIterations = velocityIterations;
		step.positionIterations = positionIterations;
		if (dt > 0)
		{
			step.inv_dt = 1 / dt;
		}
		else
		{
			step.inv_dt = 0;
		}

		step.dtRatio = this.m_inv_dt0 * dt;

		step.warmStarting = this.m_warmStarting;

		// Update contacts. This is where some contacts are destroyed.
		{
			var timer: b2Timer = new b2Timer();
			this.m_contactManager.Collide();
			this.m_profile.collide = timer.GetMilliseconds();
		}

		// Integrate velocities, solve velocity constraints, and integrate positions.
		if (this.m_stepComplete && step.dt > 0)
		{
			var timer: b2Timer = new b2Timer();
			this.Solve(step);
			this.m_profile.solve = timer.GetMilliseconds();
		}

		// Handle TOI events.
		if (this.m_continuousPhysics && step.dt > 0)
		{
			var timer: b2Timer = new b2Timer();
			this.SolveTOI(step);
			this.m_profile.solveTOI = timer.GetMilliseconds();
		}

		if (step.dt > 0)
		{
			this.m_inv_dt0 = step.inv_dt;
		}

		if (this.m_flags & b2WorldFlag.e_clearForces)
		{
			this.ClearForces();
		}

		this.m_flags &= ~b2WorldFlag.e_locked;

		this.m_profile.step = stepTimer.GetMilliseconds();
	}

	/// Manually clear the force buffer on all bodies. By default, forces are cleared automatically
	/// after each call to Step. The default behavior is modified by calling SetAutoClearForces.
	/// The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
	/// a fixed sized time step under a variable frame-rate.
	/// When you perform sub-stepping you will disable auto clearing of forces and instead call
	/// ClearForces after all sub-steps are complete in one pass of your game loop.
	/// @see SetAutoClearForces
	public ClearForces(): void
	{
		for (var body = this.m_bodyList; body; body = body.m_next)
		{
			body.m_force.SetZero();
			body.m_torque = 0;
		}
	}

	/// Call this to draw shapes and other debug draw data.
	private static DrawDebugData_s_color = new b2Color(0, 0, 0);
	private static DrawDebugData_s_vs = b2Vec2.MakeArray(4);
	private static DrawDebugData_s_xf = new b2Transform();
	public DrawDebugData(): void
	{
		if (this.m_debugDraw == null)
		{
			return;
		}

		var flags = this.m_debugDraw.GetFlags();
		var color: b2Color = b2World.DrawDebugData_s_color.SetRGB(0, 0, 0);

		if (flags & b2DrawFlags.e_shapeBit)
		{
			for (var b = this.m_bodyList; b; b = b.m_next)
			{
				var xf: b2Transform = b.m_xf;

				this.m_debugDraw.PushTransform(xf);

				for (var f = b.GetFixtureList(); f; f = f.m_next)
				{
					if (b.IsActive() == false)
					{
						color.SetRGB(0.5, 0.5, 0.3);
						this.DrawShape(f, color);
					}
					else if (b.GetType() == b2BodyType.b2_staticBody)
					{
						color.SetRGB(0.5, 0.9, 0.5);
						this.DrawShape(f, color);
					}
					else if (b.GetType() == b2BodyType.b2_kinematicBody)
					{
						color.SetRGB(0.5, 0.5, 0.9);
						this.DrawShape(f, color);
					}
					else if (b.IsAwake() == false)
					{
						color.SetRGB(0.6, 0.6, 0.6);
						this.DrawShape(f, color);
					}
					else
					{
						color.SetRGB(0.9, 0.7, 0.7);
						this.DrawShape(f, color);
					}
				}

				this.m_debugDraw.PopTransform(xf);
			}
		}

		if (flags & b2DrawFlags.e_jointBit)
		{
			for (var j = this.m_jointList; j; j = j.m_next)
			{
				this.DrawJoint(j);
			}
		}

		/*
		if (flags & b2DrawFlags.e_pairBit)
		{
			color.SetRGB(0.3, 0.9, 0.9);
			for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.m_next)
			{
				var fixtureA = contact.GetFixtureA();
				var fixtureB = contact.GetFixtureB();

				var cA = fixtureA.GetAABB().GetCenter();
				var cB = fixtureB.GetAABB().GetCenter();

				this.m_debugDraw.DrawSegment(cA, cB, color);
			}
		}
		*/

		if (flags & b2DrawFlags.e_aabbBit)
		{
			color.SetRGB(0.9, 0.3, 0.9);
			var bp: b2BroadPhase = this.m_contactManager.m_broadPhase;
			var vs: b2Vec2[] = b2World.DrawDebugData_s_vs;

			for (var b = this.m_bodyList; b; b = b.m_next)
			{
				if (b.IsActive() == false)
				{
					continue;
				}

				for (var f = b.GetFixtureList(); f; f = f.m_next)
				{
					for (var i: number = 0; i < f.m_proxyCount; ++i)
					{
						var proxy: b2FixtureProxy = f.m_proxies[i];

						var aabb: b2AABB = bp.GetFatAABB(proxy.proxy);
						vs[0].SetXY(aabb.lowerBound.x, aabb.lowerBound.y);
						vs[1].SetXY(aabb.upperBound.x, aabb.lowerBound.y);
						vs[2].SetXY(aabb.upperBound.x, aabb.upperBound.y);
						vs[3].SetXY(aabb.lowerBound.x, aabb.upperBound.y);
		
						this.m_debugDraw.DrawPolygon(vs, 4, color);
					}
				}
			}
		}

		if (flags & b2DrawFlags.e_centerOfMassBit)
		{
			for (var b = this.m_bodyList; b; b = b.m_next)
			{
				var xf: b2Transform = b2World.DrawDebugData_s_xf;
				xf.q.Copy(b.m_xf.q);
				xf.p.Copy(b.GetWorldCenter());
				this.m_debugDraw.DrawTransform(xf);
			}
		}

		/// @see b2Controller list
//		if (flags & b2DrawFlags.e_controllerBit)
//		{
//			for (var c = this.m_controllerList; c; c = c.m_next)
//			{
//				c.Draw(this.m_debugDraw);
//			}
//		}
	}

	/// Query the world for all fixtures that potentially overlap the
	/// provided AABB.
	/// @param callback a user implemented callback class.
	/// @param aabb the query box.
	public QueryAABB(callback, aabb): void
	{
		var broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;

		var WorldQueryWrapper = function (proxy)
		{
			var fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
			if (ENABLE_ASSERTS) { b2Assert(fixture_proxy instanceof b2FixtureProxy); }
			var fixture: b2Fixture = fixture_proxy.fixture;
			var index: number = fixture_proxy.childIndex;
			if (callback instanceof b2QueryCallback)
			{
				return callback.ReportFixture(fixture);
			}
			else //if (typeof(callback) == 'function')
			{
				return callback(fixture);
			}
		};

		broadPhase.Query(WorldQueryWrapper, aabb);
	}

	private static QueryShape_s_aabb = new b2AABB();
	public QueryShape(callback, shape, transform): void
	{
		var broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;

		var WorldQueryWrapper = function (proxy)
		{
			var fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
			if (ENABLE_ASSERTS) { b2Assert(fixture_proxy instanceof b2FixtureProxy); }
			var fixture: b2Fixture = fixture_proxy.fixture;
			var index: number = fixture_proxy.childIndex;
			if (b2TestOverlapShape(shape, 0, fixture.GetShape(), 0, transform, fixture.GetBody().GetTransform()))
			{
				if (callback instanceof b2QueryCallback)
				{
					return callback.ReportFixture(fixture);
				}
				else //if (typeof(callback) == 'function')
				{
					return callback(fixture);
				}
			}
			return true;
		};

		var aabb: b2AABB = b2World.QueryShape_s_aabb;
		shape.ComputeAABB(aabb, transform, 0); // TODO
		broadPhase.Query(WorldQueryWrapper, aabb);
	}

	private static QueryPoint_s_aabb = new b2AABB();
	public QueryPoint(callback, point): void
	{
		var broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;

		var WorldQueryWrapper = function (proxy)
		{
			var fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
			if (ENABLE_ASSERTS) { b2Assert(fixture_proxy instanceof b2FixtureProxy); }
			var fixture: b2Fixture = fixture_proxy.fixture;
			var index: number = fixture_proxy.childIndex;
			if (fixture.TestPoint(point))
			{
				if (callback instanceof b2QueryCallback)
				{
					return callback.ReportFixture(fixture);
				}
				else //if (typeof(callback) == 'function')
				{
					return callback(fixture);
				}
			}
			return true;
		};

		var aabb: b2AABB = b2World.QueryPoint_s_aabb;
		aabb.lowerBound.SetXY(point.x - b2_linearSlop, point.y - b2_linearSlop);
		aabb.upperBound.SetXY(point.x + b2_linearSlop, point.y + b2_linearSlop);
		broadPhase.Query(WorldQueryWrapper, aabb);
	}

	/// Ray-cast the world for all fixtures in the path of the ray. Your callback
	/// controls whether you get the closest point, any point, or n-points.
	/// The ray-cast ignores shapes that contain the starting point.
	/// @param callback a user implemented callback class.
	/// @param point1 the ray starting point
	/// @param point2 the ray ending point
	private static RayCast_s_input = new b2RayCastInput();
	private static RayCast_s_output = new b2RayCastOutput();
	private static RayCast_s_point = new b2Vec2();
	public RayCast(callback, point1, point2): void
	{
		var broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;

		var WorldRayCastWrapper = function (input, proxy)
		{
			var fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
			if (ENABLE_ASSERTS) { b2Assert(fixture_proxy instanceof b2FixtureProxy); }
			var fixture: b2Fixture = fixture_proxy.fixture;
			var index: number = fixture_proxy.childIndex;
			var output: b2RayCastOutput = b2World.RayCast_s_output;
			var hit: boolean = fixture.RayCast(output, input, index);

			if (hit)
			{
				var fraction: number = output.fraction;
				var point: b2Vec2 = b2World.RayCast_s_point;
				point.SetXY((1 - fraction) * point1.x + fraction * point2.x, (1 - fraction) * point1.y + fraction * point2.y);

				if (callback instanceof b2RayCastCallback)
				{
					return callback.ReportFixture(fixture, point, output.normal, fraction);
				}
				else //if (typeof(callback) == 'function')
				{
					return callback(fixture, point, output.normal, fraction);
				}
			}
			return input.maxFraction;
		};

		var input: b2RayCastInput = b2World.RayCast_s_input;
		input.maxFraction = 1;
		input.p1.Copy(point1);
		input.p2.Copy(point2);
		broadPhase.RayCast(WorldRayCastWrapper, input);
	}

	public RayCastOne(point1, point2): b2Fixture
	{
		var result: b2Fixture = null;
		var min_fraction: number = 1;

		function WorldRayCastOneWrapper(fixture, point, normal, fraction)
		{
			if (fraction < min_fraction)
			{
				min_fraction = fraction;
				result = fixture;
			}

			return min_fraction;
		};

		this.RayCast(WorldRayCastOneWrapper, point1, point2);

		return result;
	}

	public RayCastAll(point1, point2, out): b2Fixture[]
	{
		out.length = 0;

		function WorldRayCastAllWrapper(fixture, point, normal, fraction)
		{
			out.push(fixture);
			return 1;
		};

		this.RayCast(WorldRayCastAllWrapper, point1, point2);

		return out;
	}

	/// Get the world body list. With the returned body, use b2Body::GetNext to get
	/// the next body in the world list. A NULL body indicates the end of the list.
	/// @return the head of the world body list.
	public GetBodyList(): b2Body
	{
		return this.m_bodyList;
	}

	/// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
	/// the next joint in the world list. A NULL joint indicates the end of the list.
	/// @return the head of the world joint list.
	public GetJointList(): b2Joint
	{
		return this.m_jointList;
	}

	/// Get the world contact list. With the returned contact, use b2Contact::GetNext to get
	/// the next contact in the world list. A NULL contact indicates the end of the list.
	/// @return the head of the world contact list.
	/// @warning contacts are created and destroyed in the middle of a time step.
	/// Use b2ContactListener to avoid missing contacts.
	public GetContactList(): b2Contact
	{
		return this.m_contactManager.m_contactList;
	}

	/// Enable/disable sleep.
	public SetAllowSleeping(flag: boolean): void
	{
		if (flag == this.m_allowSleep)
		{
			return;
		}

		this.m_allowSleep = flag;
		if (this.m_allowSleep == false)
		{
			for (var b = this.m_bodyList; b; b = b.m_next)
			{
				b.SetAwake(true);
			}
		}
	}

	public GetAllowSleeping(): boolean
	{
		return this.m_allowSleep;
	}

	/// Enable/disable warm starting. For testing.
	public SetWarmStarting(flag: boolean): void
	{
		this.m_warmStarting = flag;
	}

	public GetWarmStarting(): boolean
	{
		return this.m_warmStarting;
	}

	/// Enable/disable continuous physics. For testing.
	public SetContinuousPhysics(flag: boolean): void
	{
		this.m_continuousPhysics = flag;
	}

	public GetContinuousPhysics(): boolean
	{
		return this.m_continuousPhysics;
	}

	/// Enable/disable single stepped continuous physics. For testing.
	public SetSubStepping(flag: boolean): void
	{
		this.m_subStepping = flag;
	}

	public GetSubStepping(): boolean
	{
		return this.m_subStepping;
	}

	/// Get the number of broad-phase proxies.
	public GetProxyCount(): number
	{
		return this.m_contactManager.m_broadPhase.GetProxyCount();
	}

	/// Get the number of bodies.
	public GetBodyCount(): number
	{
		return this.m_bodyCount;
	}

	/// Get the number of joints.
	public GetJointCount(): number
	{
		return this.m_jointCount;
	}

	/// Get the number of contacts (each may have 0 or more contact points).
	public GetContactCount(): number
	{
		return this.m_contactManager.m_contactCount;
	}

	/// Get the height of the dynamic tree.
	public GetTreeHeight(): number
	{
		return this.m_contactManager.m_broadPhase.GetTreeHeight();
	}

	/// Get the balance of the dynamic tree.
	public GetTreeBalance(): number
	{
		return this.m_contactManager.m_broadPhase.GetTreeBalance();
	}

	/// Get the quality metric of the dynamic tree. The smaller the better.
	/// The minimum is 1.
	public GetTreeQuality(): number
	{
		return this.m_contactManager.m_broadPhase.GetTreeQuality();
	}

	/// Change the global gravity vector.
	public SetGravity(gravity: b2Vec2, wake: boolean = true)
	{
		if ((this.m_gravity.x !== gravity.x) || (this.m_gravity.y !== gravity.y))
		{
			this.m_gravity.Copy(gravity);

			if (wake)
			{
				for (var b = this.m_bodyList; b; b = b.m_next)
				{
					b.SetAwake(true);
				}
			}
		}
	}

	/// Get the global gravity vector.
	public GetGravity(): b2Vec2
	{
		return this.m_gravity;
	}

	/// Is the world locked (in the middle of a time step).
	public IsLocked(): boolean
	{
		return (this.m_flags & b2WorldFlag.e_locked) > 0;
	}

	/// Set flag to control automatic clearing of forces after each time step.
	public SetAutoClearForces(flag: boolean): void
	{
		if (flag)
		{
			this.m_flags |= b2WorldFlag.e_clearForces;
		}
		else
		{
			this.m_flags &= ~b2WorldFlag.e_clearForces;
		}
	}

	/// Get the flag that controls automatic clearing of forces after each time step.
	public GetAutoClearForces(): boolean
	{
		return (this.m_flags & b2WorldFlag.e_clearForces) == b2WorldFlag.e_clearForces;
	}

	/// Shift the world origin. Useful for large worlds.
	/// The body shift formula is: position -= newOrigin
	/// @param newOrigin the new origin with respect to the old origin
	public ShiftOrigin(newOrigin: b2Vec2): void
	{
		if (ENABLE_ASSERTS) { b2Assert(this.IsLocked() == false); }
		if (this.IsLocked())
		{
			return;
		}

		for (var b = this.m_bodyList; b; b = b.m_next)
		{
			b.m_xf.p.SelfSub(newOrigin);
			b.m_sweep.c0.SelfSub(newOrigin);
			b.m_sweep.c.SelfSub(newOrigin);
		}

		for (var j = this.m_jointList; j; j = j.m_next)
		{
			j.ShiftOrigin(newOrigin);
		}

		this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
	}

	/// Get the contact manager for testing.
	public GetContactManager(): b2ContactManager
	{
		return this.m_contactManager;
	}

	/// Get the current profile.
	public GetProfile(): b2Profile
	{
		return this.m_profile;
	}

	/// Dump the world into the log file.
	/// @warning this should be called outside of a time step.
	public Dump(): void
	{
		if (DEBUG)
		{
			if ((this.m_flags & b2WorldFlag.e_locked) == b2WorldFlag.e_locked)
			{
				return;
			}
		
			b2Log("var g: b2Vec2 = new b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
			b2Log("this.m_world.SetGravity(g);\n");
		
			b2Log("var bodies: b2Body[] = new Array(%d);\n", this.m_bodyCount);
			b2Log("var joints: b2Joint[] = new Array(%d);\n", this.m_jointCount);
			var i: number = 0;
			for (var b = this.m_bodyList; b; b = b.m_next)
			{
				b.m_islandIndex = i;
				b.Dump();
				++i;
			}
		
			i = 0;
			for (var j = this.m_jointList; j; j = j.m_next)
			{
				j.m_index = i;
				++i;
			}
		
			// First pass on joints, skip gear joints.
			for (var j = this.m_jointList; j; j = j.m_next)
			{
				if (j.m_type == b2JointType.e_gearJoint)
				{
					continue;
				}
		
				box2d.b2Log("{\n");
				j.Dump();
				box2d.b2Log("}\n");
			}
		
			// Second pass on joints, only gear joints.
			for (var j = this.m_jointList; j; j = j.m_next)
			{
				if (j.m_type != b2JointType.e_gearJoint)
				{
					continue;
				}
		
				box2d.b2Log("{\n");
				j.Dump();
				box2d.b2Log("}\n");
			}
		}
	}

	private static DrawJoint_s_p1: b2Vec2 = new b2Vec2();
	private static DrawJoint_s_p2: b2Vec2 = new b2Vec2();
	private static DrawJoint_s_color: b2Color = new b2Color(0.5, 0.8, 0.8);
	public DrawJoint(joint: b2Joint): void
	{
		var bodyA: b2Body = joint.GetBodyA();
		var bodyB: b2Body = joint.GetBodyB();
		var xf1: b2Transform = bodyA.m_xf;
		var xf2: b2Transform = bodyB.m_xf;
		var x1: b2Vec2 = xf1.p;
		var x2: b2Vec2 = xf2.p;
		var p1: b2Vec2 = joint.GetAnchorA(b2World.DrawJoint_s_p1);
		var p2: b2Vec2 = joint.GetAnchorB(b2World.DrawJoint_s_p2);

		var color: b2Color = b2World.DrawJoint_s_color.SetRGB(0.5, 0.8, 0.8);

		switch (joint.m_type)
		{
		case b2JointType.e_distanceJoint:
			this.m_debugDraw.DrawSegment(p1, p2, color);
			break;

		case b2JointType.e_pulleyJoint:
			{
				var pulley: b2PulleyJoint = <b2PulleyJoint> joint;
				var s1: b2Vec2 = pulley.GetGroundAnchorA();
				var s2: b2Vec2 = pulley.GetGroundAnchorB();
				this.m_debugDraw.DrawSegment(s1, p1, color);
				this.m_debugDraw.DrawSegment(s2, p2, color);
				this.m_debugDraw.DrawSegment(s1, s2, color);
			}
			break;

		case b2JointType.e_mouseJoint:
			// don't draw this
			this.m_debugDraw.DrawSegment(p1, p2, color);
			break;

		default:
			this.m_debugDraw.DrawSegment(x1, p1, color);
			this.m_debugDraw.DrawSegment(p1, p2, color);
			this.m_debugDraw.DrawSegment(x2, p2, color);
		}
	}

	public DrawShape(fixture, color): void
	{
		var shape: b2Shape = fixture.GetShape();

		switch (shape.m_type)
		{
		case b2ShapeType.e_circleShape:
			{
				var circle: b2CircleShape = <b2CircleShape> shape; //((shape instanceof b2CircleShape ? shape : null));

				var center: b2Vec2 = circle.m_p;
				var radius: number = circle.m_radius;
				var axis: b2Vec2 = b2Vec2.UNITX;

				this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
			}
			break;

		case b2ShapeType.e_edgeShape:
			{
				var edge: b2EdgeShape = <b2EdgeShape> shape; //((shape instanceof b2EdgeShape ? shape : null));
				var v1: b2Vec2 = edge.m_vertex1;
				var v2: b2Vec2 = edge.m_vertex2;
				this.m_debugDraw.DrawSegment(v1, v2, color);
			}
			break;

		case b2ShapeType.e_chainShape:
			{
				var chain: b2ChainShape = <b2ChainShape> shape; //((shape instanceof b2ChainShape ? shape : null));
				var count: number = chain.m_count;
				var vertices: b2Vec2[] = chain.m_vertices;

				var v1: b2Vec2 = vertices[0];
				this.m_debugDraw.DrawCircle(v1, 0.05, color);
				for (var i: number = 1; i < count; ++i)
				{
					var v2: b2Vec2 = vertices[i];
					this.m_debugDraw.DrawSegment(v1, v2, color);
					this.m_debugDraw.DrawCircle(v2, 0.05, color);
					v1 = v2;
				}
			}
			break;

		case b2ShapeType.e_polygonShape:
			{
				var poly: b2PolygonShape = <b2PolygonShape> shape; //((shape instanceof b2PolygonShape ? shape : null));
				var vertexCount: number = poly.m_count;
				var vertices: b2Vec2[] = poly.m_vertices;

				this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
			}
			break;
		}
	}

	public Solve(step: b2TimeStep): void
	{
		/// @see b2Controller list
//		for (var controller = this.m_controllerList; controller; controller = controller.m_next)
//		{
//			controller.Step(step);
//		}

		this.m_profile.solveInit = 0;
		this.m_profile.solveVelocity = 0;
		this.m_profile.solvePosition = 0;

		// Size the island for the worst case.
		var island: b2Island = this.m_island;
		island.Initialize(this.m_bodyCount,
						  this.m_contactManager.m_contactCount,
						  this.m_jointCount,
						  null, // this.m_stackAllocator, 
						  this.m_contactManager.m_contactListener);

		// Clear all the island flags.
		for (var b = this.m_bodyList; b; b = b.m_next)
		{
			b.m_flags &= ~b2BodyFlag.e_islandFlag;
		}
		for (var c = this.m_contactManager.m_contactList; c; c = c.m_next)
		{
			c.m_flags &= ~b2ContactFlag.e_islandFlag;
		}
		for (var j = this.m_jointList; j; j = j.m_next)
		{
			j.m_islandFlag = false;
		}

		// Build and simulate all awake islands.
		var stackSize: number = this.m_bodyCount;
		var stack: b2Body[] = this.s_stack;
		for (var seed = this.m_bodyList; seed; seed = seed.m_next)
		{
			if (seed.m_flags & b2BodyFlag.e_islandFlag)
			{
				continue;
			}

			if (seed.IsAwake() == false || seed.IsActive() == false)
			{
				continue;
			}

			// The seed can be dynamic or kinematic.
			if (seed.GetType() == b2BodyType.b2_staticBody)
			{
				continue;
			}

			// Reset island and stack.
			island.Clear();
			var stackCount: number = 0;
			stack[stackCount++] = seed;
			seed.m_flags |= b2BodyFlag.e_islandFlag;

			// Perform a depth first search (DFS) on the constraint graph.
			while (stackCount > 0)
			{
				// Grab the next body off the stack and add it to the island.
				var b: b2Body = stack[--stackCount];
				if (ENABLE_ASSERTS) { b2Assert(b.IsActive() == true); }
				island.AddBody(b);

				// Make sure the body is awake.
				b.SetAwake(true);

				// To keep islands as small as possible, we don't
				// propagate islands across static bodies.
				if (b.GetType() == b2BodyType.b2_staticBody)
				{
					continue;
				}

				// Search all contacts connected to this body.
				for (var ce = b.m_contactList; ce; ce = ce.next)
				{
					var contact: b2Contact = ce.contact;

					// Has this contact already been added to an island?
					if (contact.m_flags & b2ContactFlag.e_islandFlag)
					{
						continue;
					}

					// Is this contact solid and touching?
					if (contact.IsEnabled() == false ||
						contact.IsTouching() == false)
					{
						continue;
					}

					// Skip sensors.
					var sensorA: boolean = contact.m_fixtureA.m_isSensor;
					var sensorB: boolean = contact.m_fixtureB.m_isSensor;
					if (sensorA || sensorB)
					{
						continue;
					}

					island.AddContact(contact);
					contact.m_flags |= b2ContactFlag.e_islandFlag;

					var other: b2Body = ce.other;

					// Was the other body already added to this island?
					if (other.m_flags & b2BodyFlag.e_islandFlag)
					{
						continue;
					}

					if (ENABLE_ASSERTS) { b2Assert(stackCount < stackSize); }
					stack[stackCount++] = other;
					other.m_flags |= b2BodyFlag.e_islandFlag;
				}

				// Search all joints connect to this body.
				for (var je = b.m_jointList; je; je = je.next)
				{
					if (je.joint.m_islandFlag == true)
					{
						continue;
					}

					var other: b2Body = je.other;

					// Don't simulate joints connected to inactive bodies.
					if (other.IsActive() == false)
					{
						continue;
					}

					island.AddJoint(je.joint);
					je.joint.m_islandFlag = true;

					if (other.m_flags & b2BodyFlag.e_islandFlag)
					{
						continue;
					}

					if (ENABLE_ASSERTS) { b2Assert(stackCount < stackSize); }
					stack[stackCount++] = other;
					other.m_flags |= b2BodyFlag.e_islandFlag;
				}
			}

			var profile: b2Profile = new b2Profile();
			island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
			this.m_profile.solveInit += profile.solveInit;
			this.m_profile.solveVelocity += profile.solveVelocity;
			this.m_profile.solvePosition += profile.solvePosition;

			// Post solve cleanup.
			for (var i: number = 0; i < island.m_bodyCount; ++i)
			{
				// Allow static bodies to participate in other islands.
				var b: b2Body = island.m_bodies[i];
				if (b.GetType() == b2BodyType.b2_staticBody)
				{
					b.m_flags &= ~b2BodyFlag.e_islandFlag;
				}
			}
		}

		for (var i: number = 0; i < stack.length; ++i)
		{
			if (!stack[i]) break;
			stack[i] = null;
		}

		{
			var timer: b2Timer = new b2Timer();

			// Synchronize fixtures, check for out of range bodies.
			for (var b = this.m_bodyList; b; b = b.m_next)
			{
				// If a body was not in an island then it did not move.
				if ((b.m_flags & b2BodyFlag.e_islandFlag) == 0)
				{
					continue;
				}
		
				if (b.GetType() == b2BodyType.b2_staticBody)
				{
					continue;
				}
		
				// Update fixtures (for broad-phase).
				b.SynchronizeFixtures();
			}
		
			// Look for new contacts.
			this.m_contactManager.FindNewContacts();
			this.m_profile.broadphase = timer.GetMilliseconds();
		}
	}

	private static SolveTOI_s_subStep = new b2TimeStep();
	private static SolveTOI_s_backup = new b2Sweep();
	private static SolveTOI_s_backup1 = new b2Sweep();
	private static SolveTOI_s_backup2 = new b2Sweep();
	private static SolveTOI_s_toi_input = new b2TOIInput();
	private static SolveTOI_s_toi_output = new b2TOIOutput();
	public SolveTOI(step: b2TimeStep): void
	{
		//b2Island island(2 * b2_maxTOIContacts, b2_maxTOIContacts, 0, &m_stackAllocator, m_contactManager.m_contactListener);
		var island: b2Island = this.m_island;
		island.Initialize(2 * b2_maxTOIContacts, b2_maxTOIContacts, 0, null, this.m_contactManager.m_contactListener);

		if (this.m_stepComplete)
		{
			for (var b = this.m_bodyList; b; b = b.m_next)
			{
				b.m_flags &= ~b2BodyFlag.e_islandFlag;
				b.m_sweep.alpha0 = 0;
			}

			for (var c = this.m_contactManager.m_contactList; c; c = c.m_next)
			{
				// Invalidate TOI
				c.m_flags &= ~(b2ContactFlag.e_toiFlag | b2ContactFlag.e_islandFlag);
				c.m_toiCount = 0;
				c.m_toi = 1;
			}
		}

		// Find TOI events and solve them.
		for (;;)
		{
			// Find the first TOI.
			var minContact: b2Contact = null;
			var minAlpha: number = 1;

			for (var c = this.m_contactManager.m_contactList; c; c = c.m_next)
			{
				// Is this contact disabled?
				if (c.IsEnabled() == false)
				{
					continue;
				}

				// Prevent excessive sub-stepping.
				if (c.m_toiCount > b2_maxSubSteps)
				{
					continue;
				}

				var alpha: number = 1;
				if (c.m_flags & b2ContactFlag.e_toiFlag)
				{
					// This contact has a valid cached TOI.
					alpha = c.m_toi;
				}
				else
				{
					var fA: b2Fixture = c.GetFixtureA();
					var fB: b2Fixture = c.GetFixtureB();

					// Is there a sensor?
					if (fA.IsSensor() || fB.IsSensor())
					{
						continue;
					}

					var bA: b2Body = fA.GetBody();
					var bB: b2Body = fB.GetBody();

					var typeA: b2BodyType = bA.m_type;
					var typeB: b2BodyType = bB.m_type;
					if (ENABLE_ASSERTS) { b2Assert(typeA == b2BodyType.b2_dynamicBody || typeB == b2BodyType.b2_dynamicBody); }

					var activeA: boolean = bA.IsAwake() && typeA != b2BodyType.b2_staticBody;
					var activeB: boolean = bB.IsAwake() && typeB != b2BodyType.b2_staticBody;

					// Is at least one body active (awake and dynamic or kinematic)?
					if (activeA == false && activeB == false)
					{
						continue;
					}

					var collideA: boolean = bA.IsBullet() || typeA != b2BodyType.b2_dynamicBody;
					var collideB: boolean = bB.IsBullet() || typeB != b2BodyType.b2_dynamicBody;

					// Are these two non-bullet dynamic bodies?
					if (collideA == false && collideB == false)
					{
						continue;
					}

					// Compute the TOI for this contact.
					// Put the sweeps onto the same time interval.
					var alpha0: number = bA.m_sweep.alpha0;

					if (bA.m_sweep.alpha0 < bB.m_sweep.alpha0)
					{
						alpha0 = bB.m_sweep.alpha0;
						bA.m_sweep.Advance(alpha0);
					}
					else if (bB.m_sweep.alpha0 < bA.m_sweep.alpha0)
					{
						alpha0 = bA.m_sweep.alpha0;
						bB.m_sweep.Advance(alpha0);
					}

					if (ENABLE_ASSERTS) { b2Assert(alpha0 < 1); }

					var indexA: number = c.GetChildIndexA();
					var indexB: number = c.GetChildIndexB();

					// Compute the time of impact in interval [0, minTOI]
					var input: b2TOIInput = b2World.SolveTOI_s_toi_input;
					input.proxyA.SetShape(fA.GetShape(), indexA);
					input.proxyB.SetShape(fB.GetShape(), indexB);
					input.sweepA.Copy(bA.m_sweep);
					input.sweepB.Copy(bB.m_sweep);
					input.tMax = 1;

					var output: b2TOIOutput = b2World.SolveTOI_s_toi_output;
					b2TimeOfImpact(output, input);

					// Beta is the fraction of the remaining portion of the .
					var beta: number = output.t;
					if (output.state == b2TOIOutputState.e_touching)
					{
						alpha = b2Min(alpha0 + (1 - alpha0) * beta, 1);
					}
					else
					{
						alpha = 1;
					}

					c.m_toi = alpha;
					c.m_flags |= b2ContactFlag.e_toiFlag;
				}

				if (alpha < minAlpha)
				{
					// This is the minimum TOI found so far.
					minContact = c;
					minAlpha = alpha;
				}
			}

			if (minContact == null || 1 - 10 * b2_epsilon < minAlpha)
			{
				// No more TOI events. Done!
				this.m_stepComplete = true;
				break;
			}

			// Advance the bodies to the TOI.
			var fA: b2Fixture = minContact.GetFixtureA();
			var fB: b2Fixture = minContact.GetFixtureB();
			var bA: b2Body = fA.GetBody();
			var bB: b2Body = fB.GetBody();

			var backup1: b2Sweep = b2World.SolveTOI_s_backup1.Copy(bA.m_sweep);
			var backup2: b2Sweep = b2World.SolveTOI_s_backup2.Copy(bB.m_sweep);

			bA.Advance(minAlpha);
			bB.Advance(minAlpha);

			// The TOI contact likely has some new contact points.
			minContact.Update(this.m_contactManager.m_contactListener);
			minContact.m_flags &= ~b2ContactFlag.e_toiFlag;
			++minContact.m_toiCount;

			// Is the contact solid?
			if (minContact.IsEnabled() == false || minContact.IsTouching() == false)
			{
				// Restore the sweeps.
				minContact.SetEnabled(false);
				bA.m_sweep.Copy(backup1);
				bB.m_sweep.Copy(backup2);
				bA.SynchronizeTransform();
				bB.SynchronizeTransform();
				continue;
			}

			bA.SetAwake(true);
			bB.SetAwake(true);

			// Build the island
			island.Clear();
			island.AddBody(bA);
			island.AddBody(bB);
			island.AddContact(minContact);

			bA.m_flags |= b2BodyFlag.e_islandFlag;
			bB.m_flags |= b2BodyFlag.e_islandFlag;
			minContact.m_flags |= b2ContactFlag.e_islandFlag;

			// Get contacts on bodyA and bodyB.
			// var bodies: b2Body[] = [bA, bB];
			for (var i: number = 0; i < 2; ++i)
			{
				var body: b2Body = (i == 0)?(bA):(bB);//bodies[i];
				if (body.m_type == b2BodyType.b2_dynamicBody)
				{
					for (var ce = body.m_contactList; ce; ce = ce.next)
					{
						if (island.m_bodyCount == island.m_bodyCapacity)
						{
							break;
						}

						if (island.m_contactCount == island.m_contactCapacity)
						{
							break;
						}

						var contact: b2Contact = ce.contact;

						// Has this contact already been added to the island?
						if (contact.m_flags & b2ContactFlag.e_islandFlag)
						{
							continue;
						}

						// Only add static, kinematic, or bullet bodies.
						var other: b2Body = ce.other;
						if (other.m_type == b2BodyType.b2_dynamicBody &&
							body.IsBullet() == false && other.IsBullet() == false)
						{
							continue;
						}

						// Skip sensors.
						var sensorA: boolean = contact.m_fixtureA.m_isSensor;
						var sensorB: boolean = contact.m_fixtureB.m_isSensor;
						if (sensorA || sensorB)
						{
							continue;
						}

						// Tentatively advance the body to the TOI.
						var backup: b2Sweep = b2World.SolveTOI_s_backup.Copy(other.m_sweep);
						if ((other.m_flags & b2BodyFlag.e_islandFlag) == 0)
						{
							other.Advance(minAlpha);
						}

						// Update the contact points
						contact.Update(this.m_contactManager.m_contactListener);

						// Was the contact disabled by the user?
						if (contact.IsEnabled() == false)
						{
							other.m_sweep.Copy(backup);
							other.SynchronizeTransform();
							continue;
						}

						// Are there contact points?
						if (contact.IsTouching() == false)
						{
							other.m_sweep.Copy(backup);
							other.SynchronizeTransform();
							continue;
						}

						// Add the contact to the island
						contact.m_flags |= b2ContactFlag.e_islandFlag;
						island.AddContact(contact);

						// Has the other body already been added to the island?
						if (other.m_flags & b2BodyFlag.e_islandFlag)
						{
							continue;
						}
						
						// Add the other body to the island.
						other.m_flags |= b2BodyFlag.e_islandFlag;

						if (other.m_type != b2BodyType.b2_staticBody)
						{
							other.SetAwake(true);
						}

						island.AddBody(other);
					}
				}
			}

			var subStep: b2TimeStep = b2World.SolveTOI_s_subStep;
			subStep.dt = (1 - minAlpha) * step.dt;
			subStep.inv_dt = 1 / subStep.dt;
			subStep.dtRatio = 1;
			subStep.positionIterations = 20;
			subStep.velocityIterations = step.velocityIterations;
			subStep.warmStarting = false;
			island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);

			// Reset island flags and synchronize broad-phase proxies.
			for (var i: number = 0; i < island.m_bodyCount; ++i)
			{
				var body = island.m_bodies[i];
				body.m_flags &= ~b2BodyFlag.e_islandFlag;

				if (body.m_type != b2BodyType.b2_dynamicBody)
				{
					continue;
				}

				body.SynchronizeFixtures();

				// Invalidate all contact TOIs on this displaced body.
				for (var ce = body.m_contactList; ce; ce = ce.next)
				{
					ce.contact.m_flags &= ~(b2ContactFlag.e_toiFlag | b2ContactFlag.e_islandFlag);
				}
			}

			// Commit fixture proxy movements to the broad-phase so that new contacts are created.
			// Also, some contacts can be destroyed.
			this.m_contactManager.FindNewContacts();

			if (this.m_subStepping)
			{
				this.m_stepComplete = false;
				break;
			}
		}
	}

//	public AddController(controller: b2Controller): b2Controller
//	{
//		if (ENABLE_ASSERTS) { b2Assert(controller.m_world === null, "Controller can only be a member of one world"); }
//		controller.m_world = this;
//		controller.m_next = this.m_controllerList;
//		controller.m_prev = null;
//		if (this.m_controllerList)
//			this.m_controllerList.m_prev = controller;
//		this.m_controllerList = controller;
//		++this.m_controllerCount;
//		return controller;
//	}

//	public RemoveController(controller: b2Controller): b2Controller
//	{
//		if (ENABLE_ASSERTS) { b2Assert(controller.m_world === this, "Controller is not a member of this world"); }
//		if (controller.m_prev)
//			controller.m_prev.m_next = controller.m_next;
//		if (controller.m_next)
//			controller.m_next.m_prev = controller.m_prev;
//		if (this.m_controllerList == controller)
//			this.m_controllerList = controller.m_next;
//		--this.m_controllerCount;
//		controller.m_prev = null;
//		controller.m_next = null;
//		controller.m_world = null;
//		return controller;
//	}
}

} // module box2d

