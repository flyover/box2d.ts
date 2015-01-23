///<reference path='../../../Box2D/Box2D/Box2D.ts' />
///<reference path='../../../Box2D/Testbed/Framework/Render.ts' />

module box2d.Testbed {

export var DRAW_STRING_NEW_LINE: number = 25;

export enum KeyCode
{
	WIN_KEY_FF_LINUX = 0,
	MAC_ENTER = 3,
	BACKSPACE = 8,
	TAB = 9,
	NUM_CENTER = 12,  // NUMLOCK on FF/Safari Mac
	ENTER = 13,
	SHIFT = 16,
	CTRL = 17,
	ALT = 18,
	PAUSE = 19,
	CAPS_LOCK = 20,
	ESC = 27,
	SPACE = 32,
	PAGE_UP = 33,     // also NUM_NORTH_EAST
	PAGE_DOWN = 34,   // also NUM_SOUTH_EAST
	END = 35,         // also NUM_SOUTH_WEST
	HOME = 36,        // also NUM_NORTH_WEST
	LEFT = 37,        // also NUM_WEST
	UP = 38,          // also NUM_NORTH
	RIGHT = 39,       // also NUM_EAST
	DOWN = 40,        // also NUM_SOUTH
	PRINT_SCREEN = 44,
	INSERT = 45,      // also NUM_INSERT
	DELETE = 46,      // also NUM_DELETE
	ZERO = 48,
	ONE = 49,
	TWO = 50,
	THREE = 51,
	FOUR = 52,
	FIVE = 53,
	SIX = 54,
	SEVEN = 55,
	EIGHT = 56,
	NINE = 57,
	FF_SEMICOLON = 59, // Firefox (Gecko) fires this for semicolon instead of 186
	FF_EQUALS = 61, // Firefox (Gecko) fires this for equals instead of 187
	QUESTION_MARK = 63, // needs localization
	A = 65,
	B = 66,
	C = 67,
	D = 68,
	E = 69,
	F = 70,
	G = 71,
	H = 72,
	I = 73,
	J = 74,
	K = 75,
	L = 76,
	M = 77,
	N = 78,
	O = 79,
	P = 80,
	Q = 81,
	R = 82,
	S = 83,
	T = 84,
	U = 85,
	V = 86,
	W = 87,
	X = 88,
	Y = 89,
	Z = 90,
	META = 91, // WIN_KEY_LEFT
	WIN_KEY_RIGHT = 92,
	CONTEXT_MENU = 93,
	NUM_ZERO = 96,
	NUM_ONE = 97,
	NUM_TWO = 98,
	NUM_THREE = 99,
	NUM_FOUR = 100,
	NUM_FIVE = 101,
	NUM_SIX = 102,
	NUM_SEVEN = 103,
	NUM_EIGHT = 104,
	NUM_NINE = 105,
	NUM_MULTIPLY = 106,
	NUM_PLUS = 107,
	NUM_MINUS = 109,
	NUM_PERIOD = 110,
	NUM_DIVISION = 111,
	F1 = 112,
	F2 = 113,
	F3 = 114,
	F4 = 115,
	F5 = 116,
	F6 = 117,
	F7 = 118,
	F8 = 119,
	F9 = 120,
	F10 = 121,
	F11 = 122,
	F12 = 123,
	NUMLOCK = 144,
	SCROLL_LOCK = 145,

	// OS-specific media keys like volume controls and browser controls.
	FIRST_MEDIA_KEY = 166,
	LAST_MEDIA_KEY = 183,

	SEMICOLON = 186,            // needs localization
	DASH = 189,                 // needs localization
	EQUALS = 187,               // needs localization
	COMMA = 188,                // needs localization
	PERIOD = 190,               // needs localization
	SLASH = 191,                // needs localization
	APOSTROPHE = 192,           // needs localization
	TILDE = 192,                // needs localization
	SINGLE_QUOTE = 222,         // needs localization
	OPEN_SQUARE_BRACKET = 219,  // needs localization
	BACKSLASH = 220,            // needs localization
	CLOSE_SQUARE_BRACKET = 221, // needs localization
	WIN_KEY = 224,
	MAC_FF_META = 224, // Firefox (Gecko) fires this for the meta key instead of 91
	WIN_IME = 229,

	// We've seen users whose machines fire this keycode at regular one
	// second intervals. The common thread among these users is that
	// they're all using Dell Inspiron laptops, so we suspect that this
	// indicates a hardware/bios problem.
	// http://en.community.dell.com/support-forums/laptop/f/3518/p/19285957/19523128.aspx
	PHANTOM = 255
}

export class Settings
{
	public canvasScale: number = 10;
	public viewZoom: number = 1;
	public viewCenter: b2Vec2 = new b2Vec2(0, 20);
	public viewRotation: b2Rot = new b2Rot(b2DegToRad(0));
	public hz: number = 60;
	public velocityIterations: number = 8;
	public positionIterations: number = 3;
	public drawShapes: boolean = true;
	public drawJoints: boolean = true;
	public drawAABBs: boolean = false;
	public drawContactPoints: boolean = false;
	public drawContactNormals: boolean = false;
	public drawContactImpulse: boolean = false;
	public drawFrictionImpulse: boolean = false;
	public drawCOMs: boolean = false;
	public drawControllers: boolean = true;
	public drawStats: boolean = false;
	public drawProfile: boolean = false;
	public enableWarmStarting: boolean = true;
	public enableContinuous: boolean = true;
	public enableSubStepping: boolean = false;
	public enableSleep: boolean = true;
	public pause: boolean = false;
	public singleStep: boolean = false;
}

export class TestEntry
{
	public name: string = "unknown";
	public createFcn = function (canvas, settings): Test { return null; };

	constructor(name: string, createFcn)
	{
		this.name = name;
		this.createFcn = createFcn;
	}
}

export class DestructionListener extends b2DestructionListener
{
	public test: Test = null;

	constructor(test)
	{
		super(); // base class constructor

		this.test = test;
	}

	public SayGoodbyeJoint(joint)
	{
		if (this.test.m_mouseJoint == joint)
		{
			this.test.m_mouseJoint = null;
		}
		else
		{
			this.test.JointDestroyed(joint);
		}
	}

	public SayGoodbyeFixture(fixture)
	{
	}
}

export class ContactPoint
{
	public fixtureA = null;
	public fixtureB = null;
	public normal: b2Vec2 = new b2Vec2();
	public position: b2Vec2 = new b2Vec2();
	public state = b2PointState.b2_nullState;
	public normalImpulse: number = 0;
	public tangentImpulse: number = 0;
}

export class Test extends b2ContactListener
{
	public static k_maxContactPoints: number = 2048;

	public m_world: b2World = null;
	public m_bomb: b2Body = null;
	public m_textLine: number = 30;
	public m_mouseJoint: b2MouseJoint = null;
	public m_points: ContactPoint[] = null;
	public m_pointCount: number = 0;
	public m_destructionListener: DestructionListener = null;
	public m_debugDraw: DebugDraw = null;
	public m_bombSpawnPoint: b2Vec2 = null;
	public m_bombSpawning: boolean = false;
	public m_mouseWorld: b2Vec2 = null;
	public m_stepCount: number = 0;
	public m_maxProfile: b2Profile = null;
	public m_totalProfile: b2Profile = null;
	public m_groundBody: b2Body = null;

	constructor(canvas: HTMLCanvasElement, settings: Settings)
	{
		super(); // base class constructor

		var gravity: b2Vec2 = new b2Vec2(0, -10);
		this.m_world = new b2World(gravity);
		this.m_bomb = null;
		this.m_textLine = 30;
		this.m_mouseJoint = null;
		this.m_points = new Array(Test.k_maxContactPoints);
		for (var i: number = 0; i < Test.k_maxContactPoints; ++i)
		{
			this.m_points[i] = new ContactPoint();
		}
		this.m_pointCount = 0;

		this.m_destructionListener = new DestructionListener(this);
		this.m_world.SetDestructionListener(this.m_destructionListener);
		this.m_world.SetContactListener(this);
		this.m_debugDraw = new DebugDraw(canvas, settings);
		this.m_world.SetDebugDraw(this.m_debugDraw);

		this.m_bombSpawnPoint = new b2Vec2();
		this.m_bombSpawning = false;
		this.m_mouseWorld = new b2Vec2();

		this.m_stepCount = 0;

		this.m_maxProfile = new b2Profile();
		this.m_totalProfile = new b2Profile();

		var bodyDef: b2BodyDef = new b2BodyDef();
		this.m_groundBody = this.m_world.CreateBody(bodyDef);
	}

	public JointDestroyed(joint)
	{
	}

	public BeginContact(contact)
	{
	}

	public EndContact(contact)
	{
	}

	private static PreSolve_s_state1 = new Array(b2_maxManifoldPoints);
	private static PreSolve_s_state2 = new Array(b2_maxManifoldPoints);
	private static PreSolve_s_worldManifold = new b2WorldManifold();
	public PreSolve(contact, oldManifold)
	{
		var manifold = contact.GetManifold();

		if (manifold.pointCount == 0)
		{
			return;
		}

		var fixtureA = contact.GetFixtureA();
		var fixtureB = contact.GetFixtureB();

		var state1 = Test.PreSolve_s_state1;
		var state2 = Test.PreSolve_s_state2;
		b2GetPointStates(state1, state2, oldManifold, manifold);

		var worldManifold = Test.PreSolve_s_worldManifold;
		contact.GetWorldManifold(worldManifold);

		for (var i: number = 0; i < manifold.pointCount && this.m_pointCount < Test.k_maxContactPoints; ++i)
		{
			var cp = this.m_points[this.m_pointCount];
			cp.fixtureA = fixtureA;
			cp.fixtureB = fixtureB;
			cp.position.Copy(worldManifold.points[i]);
			cp.normal.Copy(worldManifold.normal);
			cp.state = state2[i];
			cp.normalImpulse = manifold.points[i].normalImpulse;
			cp.tangentImpulse = manifold.points[i].tangentImpulse;
			++this.m_pointCount;
		}
	}

	public PostSolve(contact, impulse)
	{
	}

	public Keyboard(key: KeyCode): void
	{
	}

	public KeyboardUp(key: KeyCode): void
	{
	}

	public SetTextLine(line)
	{
		this.m_textLine = line;
	}

	public DrawTitle(title: string): void
	{
		this.m_debugDraw.DrawString(5, DRAW_STRING_NEW_LINE, title);
		this.m_textLine = 2 * DRAW_STRING_NEW_LINE;
	}

	public MouseDown(p)
	{
		this.m_mouseWorld.Copy(p);

		if (this.m_mouseJoint !== null)
		{
			return;
		}

		// Make a small box.
		var aabb: b2AABB = new b2AABB();
		var d: b2Vec2 = new b2Vec2();
		d.SetXY(0.001, 0.001);
		b2SubVV(p, d, aabb.lowerBound);
		b2AddVV(p, d, aabb.upperBound);

		var that = this;
		var hit_fixture = null;

		// Query the world for overlapping shapes.
		var callback = function (fixture)
		{
			var body = fixture.GetBody();
			if (body.GetType() == b2BodyType.b2_dynamicBody)
			{
				var inside = fixture.TestPoint(that.m_mouseWorld);
				if (inside)
				{
					hit_fixture = fixture;

					// We are done, terminate the query.
					return false;
				}
			}

			// Continue the query.
			return true;
		}

		this.m_world.QueryAABB(callback, aabb);

		if (hit_fixture)
		{
			var body = hit_fixture.GetBody();
			var md: b2MouseJointDef = new b2MouseJointDef();
			md.bodyA = this.m_groundBody;
			md.bodyB = body;
			md.target.Copy(p);
			md.maxForce = 1000 * body.GetMass();
			this.m_mouseJoint = <b2MouseJoint> this.m_world.CreateJoint(md);
			body.SetAwake(true);
		}
	}

	public SpawnBomb(worldPt)
	{
		this.m_bombSpawnPoint.Copy(worldPt);
		this.m_bombSpawning = true;
	}

	public CompleteBombSpawn(p)
	{
		if (this.m_bombSpawning == false)
		{
			return;
		}

		var multiplier: number = 30;
		var vel: b2Vec2 = b2SubVV(this.m_bombSpawnPoint, p, new b2Vec2());
		vel.SelfMul(multiplier);
		this.LaunchBombAt(this.m_bombSpawnPoint, vel);
		this.m_bombSpawning = false;
	}

	public ShiftMouseDown(p)
	{
		this.m_mouseWorld.Copy(p);

		if (this.m_mouseJoint != null)
		{
			return;
		}

		this.SpawnBomb(p);
	}

	public MouseUp(p)
	{
		if (this.m_mouseJoint)
		{
			this.m_world.DestroyJoint(this.m_mouseJoint);
			this.m_mouseJoint = null;
		}

		if (this.m_bombSpawning)
		{
			this.CompleteBombSpawn(p);
		}
	}

	public MouseMove(p)
	{
		this.m_mouseWorld.Copy(p);

		if (this.m_mouseJoint)
		{
			this.m_mouseJoint.SetTarget(p);
		}
	}

	public LaunchBomb()
	{
		var p: b2Vec2 = new b2Vec2(b2RandomRange(-15, 15), 30);
		var v: b2Vec2 = b2MulSV(-5, p, new b2Vec2());
		this.LaunchBombAt(p, v);
	}

	public LaunchBombAt(position, velocity)
	{
		if (this.m_bomb)
		{
			this.m_world.DestroyBody(this.m_bomb);
			this.m_bomb = null;
		}

		var bd: b2BodyDef = new b2BodyDef();
		bd.type = b2BodyType.b2_dynamicBody;
		bd.position.Copy(position);
		bd.bullet = true;
		this.m_bomb = this.m_world.CreateBody(bd);
		this.m_bomb.SetLinearVelocity(velocity);

		var circle: b2CircleShape = new b2CircleShape();
		circle.m_radius = 0.3;

		var fd: b2FixtureDef = new b2FixtureDef();
		fd.shape = circle;
		fd.density = 20;
		fd.restitution = 0;

		//b2Vec2 minV = position - b2Vec2(0.3f,0.3f);
		//b2Vec2 maxV = position + b2Vec2(0.3f,0.3f);

		//b2AABB aabb;
		//aabb.lowerBound = minV;
		//aabb.upperBound = maxV;

		this.m_bomb.CreateFixture(fd);
	}

	public Step(settings: Settings): void
	{
		var timeStep = settings.hz > 0 ? 1 / settings.hz : 0;

		if (settings.pause)
		{
			if (settings.singleStep)
			{
				settings.singleStep = false;
			}
			else
			{
				timeStep = 0;
			}

			this.m_debugDraw.DrawString(5, this.m_textLine, "****PAUSED****");
			this.m_textLine += DRAW_STRING_NEW_LINE;
		}

		var flags = b2DrawFlags.e_none;
		if (settings.drawShapes) { flags |= b2DrawFlags.e_shapeBit;        }
		if (settings.drawJoints) { flags |= b2DrawFlags.e_jointBit;        }
		if (settings.drawAABBs ) { flags |= b2DrawFlags.e_aabbBit;         }
		if (settings.drawCOMs  ) { flags |= b2DrawFlags.e_centerOfMassBit; }
		if (settings.drawControllers  ) { flags |= b2DrawFlags.e_controllerBit; }
		this.m_debugDraw.SetFlags(flags);

		this.m_world.SetAllowSleeping(settings.enableSleep);
		this.m_world.SetWarmStarting(settings.enableWarmStarting);
		this.m_world.SetContinuousPhysics(settings.enableContinuous);
		this.m_world.SetSubStepping(settings.enableSubStepping);

		this.m_pointCount = 0;

		this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations);

		this.m_world.DrawDebugData();

		if (timeStep > 0)
		{
			++this.m_stepCount;
		}

		if (settings.drawStats)
		{
			var bodyCount = this.m_world.GetBodyCount();
			var contactCount = this.m_world.GetContactCount();
			var jointCount = this.m_world.GetJointCount();
			this.m_debugDraw.DrawString(5, this.m_textLine, "bodies/contacts/joints = " + bodyCount + "/" + contactCount + "/" + jointCount);
			this.m_textLine += DRAW_STRING_NEW_LINE;

			var proxyCount = this.m_world.GetProxyCount();
			var height = this.m_world.GetTreeHeight();
			var balance = this.m_world.GetTreeBalance();
			var quality = this.m_world.GetTreeQuality();
			this.m_debugDraw.DrawString(5, this.m_textLine, "proxies/height/balance/quality = " + proxyCount + "/" + height + "/" + balance + "/" + quality.toFixed(2));
			this.m_textLine += DRAW_STRING_NEW_LINE;
		}

		// Track maximum profile times
		if (true)
		{
			var p = this.m_world.GetProfile();
			this.m_maxProfile.step = b2Max(this.m_maxProfile.step, p.step);
			this.m_maxProfile.collide = b2Max(this.m_maxProfile.collide, p.collide);
			this.m_maxProfile.solve = b2Max(this.m_maxProfile.solve, p.solve);
			this.m_maxProfile.solveInit = b2Max(this.m_maxProfile.solveInit, p.solveInit);
			this.m_maxProfile.solveVelocity = b2Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
			this.m_maxProfile.solvePosition = b2Max(this.m_maxProfile.solvePosition, p.solvePosition);
			this.m_maxProfile.solveTOI = b2Max(this.m_maxProfile.solveTOI, p.solveTOI);
			this.m_maxProfile.broadphase = b2Max(this.m_maxProfile.broadphase, p.broadphase);

			this.m_totalProfile.step += p.step;
			this.m_totalProfile.collide += p.collide;
			this.m_totalProfile.solve += p.solve;
			this.m_totalProfile.solveInit += p.solveInit;
			this.m_totalProfile.solveVelocity += p.solveVelocity;
			this.m_totalProfile.solvePosition += p.solvePosition;
			this.m_totalProfile.solveTOI += p.solveTOI;
			this.m_totalProfile.broadphase += p.broadphase;
		}

		if (settings.drawProfile)
		{
			var p = this.m_world.GetProfile();

			var aveProfile: b2Profile = new b2Profile();
			if (this.m_stepCount > 0)
			{
				var scale: number = 1 / this.m_stepCount;
				aveProfile.step = scale * this.m_totalProfile.step;
				aveProfile.collide = scale * this.m_totalProfile.collide;
				aveProfile.solve = scale * this.m_totalProfile.solve;
				aveProfile.solveInit = scale * this.m_totalProfile.solveInit;
				aveProfile.solveVelocity = scale * this.m_totalProfile.solveVelocity;
				aveProfile.solvePosition = scale * this.m_totalProfile.solvePosition;
				aveProfile.solveTOI = scale * this.m_totalProfile.solveTOI;
				aveProfile.broadphase = scale * this.m_totalProfile.broadphase;
			}

			this.m_debugDraw.DrawString(5, this.m_textLine, "step [ave] (max) = " + p.step.toFixed(2) + " [" + aveProfile.step.toFixed(2) + "] (" + this.m_maxProfile.step.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
			this.m_debugDraw.DrawString(5, this.m_textLine, "collide [ave] (max) = " + p.collide.toFixed(2) + " [" + aveProfile.collide.toFixed(2) + "] (" + this.m_maxProfile.collide.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
			this.m_debugDraw.DrawString(5, this.m_textLine, "solve [ave] (max) = " + p.solve.toFixed(2) + " [" + aveProfile.solve.toFixed(2) + "] (" + this.m_maxProfile.solve.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
			this.m_debugDraw.DrawString(5, this.m_textLine, "solve init [ave] (max) = " + p.solveInit.toFixed(2) + " [" + aveProfile.solveInit.toFixed(2) + "] (" + this.m_maxProfile.solveInit.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
			this.m_debugDraw.DrawString(5, this.m_textLine, "solve velocity [ave] (max) = " + p.solveVelocity.toFixed(2) + " [" + aveProfile.solveVelocity.toFixed(2) + "] (" + this.m_maxProfile.solveVelocity.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
			this.m_debugDraw.DrawString(5, this.m_textLine, "solve position [ave] (max) = " + p.solvePosition.toFixed(2) + " [" + aveProfile.solvePosition.toFixed(2) + "] (" + this.m_maxProfile.solvePosition.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
			this.m_debugDraw.DrawString(5, this.m_textLine, "solveTOI [ave] (max) = " + p.solveTOI.toFixed(2) + " [" + aveProfile.solveTOI.toFixed(2) + "] (" + this.m_maxProfile.solveTOI.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
			this.m_debugDraw.DrawString(5, this.m_textLine, "broad-phase [ave] (max) = " + p.broadphase.toFixed(2) + " [" + aveProfile.broadphase.toFixed(2) + "] (" + this.m_maxProfile.broadphase.toFixed(2) + ")");
			this.m_textLine += DRAW_STRING_NEW_LINE;
		}

		if (this.m_mouseJoint)
		{
			var p1 = this.m_mouseJoint.GetAnchorB(new b2Vec2());
			var p2 = this.m_mouseJoint.GetTarget();

			var c: b2Color = new b2Color(0, 1, 0);
			this.m_debugDraw.DrawPoint(p1, 4, c);
			this.m_debugDraw.DrawPoint(p2, 4, c);

			c.SetRGB(0.8, 0.8, 0.8);
			this.m_debugDraw.DrawSegment(p1, p2, c);
		}

		if (this.m_bombSpawning)
		{
			var c: b2Color = new b2Color(0, 0, 1);
			this.m_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);

			c.SetRGB(0.8, 0.8, 0.8);
			this.m_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
		}

		if (settings.drawContactPoints)
		{
			var k_impulseScale: number = 0.1;
			var k_axisScale: number = 0.3;

			for (var i: number = 0; i < this.m_pointCount; ++i)
			{
				var point = this.m_points[i];

				if (point.state == b2PointState.b2_addState)
				{
					// Add
					this.m_debugDraw.DrawPoint(point.position, 10, new b2Color(0.3, 0.95, 0.3));
				}
				else if (point.state == b2PointState.b2_persistState)
				{
					// Persist
					this.m_debugDraw.DrawPoint(point.position, 5, new b2Color(0.3, 0.3, 0.95));
				}

				if (settings.drawContactNormals)
				{
					var p1 = point.position;
					var p2: b2Vec2 = b2AddVV(p1, b2MulSV(k_axisScale, point.normal, b2Vec2.s_t0), new b2Vec2());
					this.m_debugDraw.DrawSegment(p1, p2, new b2Color(0.9, 0.9, 0.9));
				}
				else if (settings.drawContactImpulse)
				{
					var p1 = point.position;
					var p2: b2Vec2 = b2AddVMulSV(p1, k_impulseScale * point.normalImpulse, point.normal, new b2Vec2());
					this.m_debugDraw.DrawSegment(p1, p2, new b2Color(0.9, 0.9, 0.3));
				}

				if (settings.drawFrictionImpulse)
				{
					var tangent: b2Vec2 = b2CrossVOne(point.normal, new b2Vec2());
					var p1 = point.position;
					var p2: b2Vec2 = b2AddVMulSV(p1, k_impulseScale * point.tangentImpulse, tangent, new b2Vec2());
					this.m_debugDraw.DrawSegment(p1, p2, new b2Color(0.9, 0.9, 0.3));
				}
			}
		}
	}

	public ShiftOrigin(newOrigin)
	{
		this.m_world.ShiftOrigin(newOrigin);
	}
}

} // module Testbed

