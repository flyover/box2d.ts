//<reference path='../../../../Box2D/Box2D/Common/b2Math.ts' />
//<reference path='../../../../Box2D/Box2D/Collision/b2Collision.ts' />
//<reference path='../../../../Box2D/Box2D/Collision/Shapes/b2Shape.ts' />
//<reference path='../../../../Box2D/Box2D/Dynamics/b2Fixture.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2Contact.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2CircleContact.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2PolygonAndCircleContact.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2PolygonContact.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2EdgeAndCircleContact.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2EdgeAndPolygonContact.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2ChainAndCircleContact.ts' />
///<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2ChainAndPolygonContact.ts' />
//<reference path='../../../../Box2D/Box2D/Dynamics/Contacts/b2ContactSolver.ts' />
//<reference path='../../../../Box2D/Box2D/Collision/b2Collision.ts' />
//<reference path='../../../../Box2D/Box2D/Collision/b2TimeOfImpact.ts' />
//<reference path='../../../../Box2D/Box2D/Common/b2BlockAllocator.ts' />
//<reference path='../../../../Box2D/Box2D/Dynamics/b2Body.ts' />
//<reference path='../../../../Box2D/Box2D/Dynamics/b2Fixture.ts' />
//<reference path='../../../../Box2D/Box2D/Dynamics/b2World.ts' />

module box2d {

export class b2ContactRegister
{
	public pool: b2Contact[] = null;
	public createFcn: { (allocator: any): b2Contact; } = null;
	public destroyFcn: { (contact: b2Contact, allocator: any): void; } = null;
	public primary: boolean = false;
}   
   	 
export class b2ContactFactory
{
	public m_allocator: any = null;
	public m_registers: b2ContactRegister[][];

	constructor(allocator: any)
	{
		this.m_allocator = allocator;
		this.InitializeRegisters();
	}

	private AddType(createFcn, destroyFcn, type1: b2ShapeType, type2: b2ShapeType): void
	{
		{
			var that = this;

			var pool = b2MakeArray(256, function (i) { return createFcn(that.m_allocator); } ); // TODO: b2Settings

			var poolCreateFcn = function (allocator)
			{
				if (pool.length > 0)
				{
					return pool.pop();
				}

				return createFcn(allocator);
			}

			var poolDestroyFcn = function (contact, allocator)
			{
				pool.push(contact);
			}

			this.m_registers[type1][type2].pool = pool;
			this.m_registers[type1][type2].createFcn = poolCreateFcn;
			this.m_registers[type1][type2].destroyFcn = poolDestroyFcn;
			this.m_registers[type1][type2].primary = true;

			if (type1 != type2)
			{
				this.m_registers[type2][type1].pool = pool;
				this.m_registers[type2][type1].createFcn = poolCreateFcn;
				this.m_registers[type2][type1].destroyFcn = poolDestroyFcn;
				this.m_registers[type2][type1].primary = false;
			}
		}

		/*
		this.m_registers[type1][type2].createFcn = createFcn;
		this.m_registers[type1][type2].destroyFcn = destroyFcn;
		this.m_registers[type1][type2].primary = true;

		if (type1 != type2)
		{
			this.m_registers[type2][type1].createFcn = createFcn;
			this.m_registers[type2][type1].destroyFcn = destroyFcn;
			this.m_registers[type2][type1].primary = false;
		}
		*/
	}

	private InitializeRegisters(): void
	{
		this.m_registers = new Array(b2ShapeType.e_shapeTypeCount);

		for (var i: number = 0; i < b2ShapeType.e_shapeTypeCount; i++)
		{
			this.m_registers[i] = new Array(b2ShapeType.e_shapeTypeCount);

			for (var j: number = 0; j < b2ShapeType.e_shapeTypeCount; j++)
			{
				this.m_registers[i][j] = new b2ContactRegister();
			}
		}

		this.AddType(          b2CircleContact.Create,           b2CircleContact.Destroy, b2ShapeType.e_circleShape,  b2ShapeType.e_circleShape);
		this.AddType(b2PolygonAndCircleContact.Create, b2PolygonAndCircleContact.Destroy, b2ShapeType.e_polygonShape, b2ShapeType.e_circleShape);
		this.AddType(         b2PolygonContact.Create,          b2PolygonContact.Destroy, b2ShapeType.e_polygonShape, b2ShapeType.e_polygonShape);
		this.AddType(   b2EdgeAndCircleContact.Create,    b2EdgeAndCircleContact.Destroy, b2ShapeType.e_edgeShape,    b2ShapeType.e_circleShape);
		this.AddType(  b2EdgeAndPolygonContact.Create,   b2EdgeAndPolygonContact.Destroy, b2ShapeType.e_edgeShape,    b2ShapeType.e_polygonShape);
		this.AddType(  b2ChainAndCircleContact.Create,   b2ChainAndCircleContact.Destroy, b2ShapeType.e_chainShape,   b2ShapeType.e_circleShape);
		this.AddType( b2ChainAndPolygonContact.Create,  b2ChainAndPolygonContact.Destroy, b2ShapeType.e_chainShape,   b2ShapeType.e_polygonShape);
	}

	public Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact
	{
		var type1: b2ShapeType = fixtureA.GetType();
		var type2: b2ShapeType = fixtureB.GetType();

		if (ENABLE_ASSERTS) { b2Assert(0 <= type1 && type1 < b2ShapeType.e_shapeTypeCount); }
		if (ENABLE_ASSERTS) { b2Assert(0 <= type2 && type2 < b2ShapeType.e_shapeTypeCount); }

		var reg: b2ContactRegister = this.m_registers[type1][type2];

		if (reg.primary)
		{
			var c: b2Contact = reg.createFcn(this.m_allocator);
			c.Reset(fixtureA, indexA, fixtureB, indexB);
			return c;
		}
		else
		{
			var c: b2Contact = reg.createFcn(this.m_allocator);
			c.Reset(fixtureB, indexB, fixtureA, indexA);
			return c;
		}
	}

	public Destroy(contact: b2Contact): void
	{
		var fixtureA: b2Fixture = contact.m_fixtureA;
		var fixtureB: b2Fixture = contact.m_fixtureB;

		if (contact.m_manifold.pointCount > 0 &&
			fixtureA.IsSensor() == false &&
			fixtureB.IsSensor() == false)
		{
			fixtureA.GetBody().SetAwake(true);
			fixtureB.GetBody().SetAwake(true);
		}

		var typeA: b2ShapeType = fixtureA.GetType();
		var typeB: b2ShapeType = fixtureB.GetType();

		if (ENABLE_ASSERTS) { b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount); }
		if (ENABLE_ASSERTS) { b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount); }

		var reg: b2ContactRegister = this.m_registers[typeA][typeB];

		reg.destroyFcn(contact, this.m_allocator);
	}
}

} // module box2d

