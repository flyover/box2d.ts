// <reference path="../../Common/b2Math.ts"/>
// <reference path="../../Collision/b2Collision.ts"/>
// <reference path="../../Collision/Shapes/b2Shape.ts"/>
// <reference path="../b2Fixture.ts"/>
/// <reference path="./b2Contact.ts"/>
/// <reference path="./b2CircleContact.ts"/>
/// <reference path="./b2PolygonAndCircleContact.ts"/>
/// <reference path="./b2PolygonContact.ts"/>
/// <reference path="./b2EdgeAndCircleContact.ts"/>
/// <reference path="./b2EdgeAndPolygonContact.ts"/>
/// <reference path="./b2ChainAndCircleContact.ts"/>
/// <reference path="./b2ChainAndPolygonContact.ts"/>
// <reference path="./b2ContactSolver.ts"/>
// <reference path="../../Collision/b2Collision.ts"/>
// <reference path="../../Collision/b2TimeOfImpact.ts"/>
// <reference path="../../Common/b2BlockAllocator.ts"/>
// <reference path="../b2Body.ts"/>
// <reference path="../b2Fixture.ts"/>
// <reference path="../b2World.ts"/>

namespace box2d {

export class b2ContactRegister {
  public pool: b2Contact[] = null;
  public createFcn: { (allocator: any): b2Contact; } = null;
  public destroyFcn: { (contact: b2Contact, allocator: any): void; } = null;
  public primary: boolean = false;
}

export class b2ContactFactory {
  public m_allocator: any = null;
  public m_registers: b2ContactRegister[][];

  constructor(allocator: any) {
    this.m_allocator = allocator;
    this.InitializeRegisters();
  }

  private AddType(createFcn, destroyFcn, type1: b2ShapeType, type2: b2ShapeType): void {
    const that = this;

    const pool = b2MakeArray(256, function (i) { return createFcn(that.m_allocator); } ); // TODO: b2Settings

    const poolCreateFcn = function (allocator) {
      if (pool.length > 0) {
        return pool.pop();
      }

      return createFcn(allocator);
    };

    const poolDestroyFcn = function (contact, allocator) {
      pool.push(contact);
    };

    this.m_registers[type1][type2].pool = pool;
    this.m_registers[type1][type2].createFcn = poolCreateFcn;
    this.m_registers[type1][type2].destroyFcn = poolDestroyFcn;
    this.m_registers[type1][type2].primary = true;

    if (type1 !== type2) {
      this.m_registers[type2][type1].pool = pool;
      this.m_registers[type2][type1].createFcn = poolCreateFcn;
      this.m_registers[type2][type1].destroyFcn = poolDestroyFcn;
      this.m_registers[type2][type1].primary = false;
    }

    /*
    this.m_registers[type1][type2].createFcn = createFcn;
    this.m_registers[type1][type2].destroyFcn = destroyFcn;
    this.m_registers[type1][type2].primary = true;

    if (type1 !== type2) {
      this.m_registers[type2][type1].createFcn = createFcn;
      this.m_registers[type2][type1].destroyFcn = destroyFcn;
      this.m_registers[type2][type1].primary = false;
    }
    */
  }

  private InitializeRegisters(): void {
    this.m_registers = new Array(b2ShapeType.e_shapeTypeCount);

    for (let i: number = 0; i < b2ShapeType.e_shapeTypeCount; i++) {
      this.m_registers[i] = new Array(b2ShapeType.e_shapeTypeCount);

      for (let j: number = 0; j < b2ShapeType.e_shapeTypeCount; j++) {
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

  public Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact {
    const type1: b2ShapeType = fixtureA.GetType();
    const type2: b2ShapeType = fixtureB.GetType();

    if (ENABLE_ASSERTS) { b2Assert(0 <= type1 && type1 < b2ShapeType.e_shapeTypeCount); }
    if (ENABLE_ASSERTS) { b2Assert(0 <= type2 && type2 < b2ShapeType.e_shapeTypeCount); }

    const reg: b2ContactRegister = this.m_registers[type1][type2];

    if (reg.primary) {
      const c: b2Contact = reg.createFcn(this.m_allocator);
      c.Reset(fixtureA, indexA, fixtureB, indexB);
      return c;
    } else {
      const c: b2Contact = reg.createFcn(this.m_allocator);
      c.Reset(fixtureB, indexB, fixtureA, indexA);
      return c;
    }
  }

  public Destroy(contact: b2Contact): void {
    const fixtureA: b2Fixture = contact.m_fixtureA;
    const fixtureB: b2Fixture = contact.m_fixtureB;

    if (contact.m_manifold.pointCount > 0 &&
      fixtureA.IsSensor() === false &&
      fixtureB.IsSensor() === false) {
      fixtureA.GetBody().SetAwake(true);
      fixtureB.GetBody().SetAwake(true);
    }

    const typeA: b2ShapeType = fixtureA.GetType();
    const typeB: b2ShapeType = fixtureB.GetType();

    if (ENABLE_ASSERTS) { b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount); }
    if (ENABLE_ASSERTS) { b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount); }

    const reg: b2ContactRegister = this.m_registers[typeA][typeB];

    reg.destroyFcn(contact, this.m_allocator);
  }
}

} // namespace box2d
