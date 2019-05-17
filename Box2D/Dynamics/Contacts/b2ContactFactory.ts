// DEBUG: import { b2Assert } from "../../Common/b2Settings";
import { b2ShapeType } from "../../Collision/Shapes/b2Shape";
import { b2Contact } from "./b2Contact";
import { b2CircleContact } from "./b2CircleContact";
import { b2PolygonContact } from "./b2PolygonContact";
import { b2PolygonAndCircleContact } from "./b2PolygonAndCircleContact";
import { b2EdgeAndCircleContact } from "./b2EdgeAndCircleContact";
import { b2EdgeAndPolygonContact } from "./b2EdgeAndPolygonContact";
import { b2ChainAndCircleContact } from "./b2ChainAndCircleContact";
import { b2ChainAndPolygonContact } from "./b2ChainAndPolygonContact";
import { b2Fixture } from "../b2Fixture";

export class b2ContactRegister {
  public pool: b2Contact[] = [];
  public createFcn: (() => b2Contact) | null = null;
  public destroyFcn: ((contact: b2Contact) => void) | null = null;
  public primary: boolean = false;
}

export class b2ContactFactory {
  public readonly m_registers: b2ContactRegister[][] = [];

  constructor() {
    this.InitializeRegisters();
  }

  private AddType(createFcn: () => b2Contact, destroyFcn: (contact: b2Contact) => void, typeA: b2ShapeType, typeB: b2ShapeType): void {
    const pool: b2Contact[] = [];

    function poolCreateFcn(): b2Contact {
      return pool.pop() || createFcn();
    }

    function poolDestroyFcn(contact: b2Contact): void {
      pool.push(contact);
    }

    this.m_registers[typeA][typeB].pool = pool;
    this.m_registers[typeA][typeB].createFcn = poolCreateFcn; // createFcn;
    this.m_registers[typeA][typeB].destroyFcn = poolDestroyFcn; // destroyFcn;
    this.m_registers[typeA][typeB].primary = true;

    if (typeA !== typeB) {
      this.m_registers[typeB][typeA].pool = pool;
      this.m_registers[typeB][typeA].createFcn = poolCreateFcn; // createFcn;
      this.m_registers[typeB][typeA].destroyFcn = poolDestroyFcn; // destroyFcn;
      this.m_registers[typeB][typeA].primary = false;
    }
  }

  private InitializeRegisters(): void {
    for (let i: number = 0; i < b2ShapeType.e_shapeTypeCount; i++) {
      this.m_registers[i] = [];
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

  public Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact | null {
    const typeA: b2ShapeType = fixtureA.GetType();
    const typeB: b2ShapeType = fixtureB.GetType();

    // DEBUG: b2Assert(0 <= typeA && typeA < b2ShapeType.e_shapeTypeCount);
    // DEBUG: b2Assert(0 <= typeB && typeB < b2ShapeType.e_shapeTypeCount);

    const reg: b2ContactRegister = this.m_registers[typeA][typeB];
    if (reg.createFcn) {
      const c: b2Contact = reg.createFcn();
      if (reg.primary) {
        c.Reset(fixtureA, indexA, fixtureB, indexB);
      } else {
        c.Reset(fixtureB, indexB, fixtureA, indexA);
      }
      return c;
    } else {
      return null;
    }
  }

  public Destroy(contact: b2Contact): void {
    const typeA: b2ShapeType = contact.m_fixtureA.GetType();
    const typeB: b2ShapeType = contact.m_fixtureB.GetType();

    // DEBUG: b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);
    // DEBUG: b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);

    const reg: b2ContactRegister = this.m_registers[typeA][typeB];
    if (reg.destroyFcn) {
      reg.destroyFcn(contact);
    }
  }
}
