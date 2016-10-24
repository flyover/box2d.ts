import * as box2d from "../../Box2D/Box2D";
import { g_debugDraw } from "./DebugDraw";

export const DRAW_STRING_NEW_LINE: number = 16;

export class Settings {
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

export class TestEntry {
  public name: string = "unknown";
  public createFcn: () => Test = function(): Test { return null; };

  constructor(name: string, createFcn: () => Test) {
    this.name = name;
    this.createFcn = createFcn;
  }
}

export class DestructionListener extends box2d.b2DestructionListener {
  public test: Test = null;

  constructor(test: Test) {
    super();

    this.test = test;
  }

  public SayGoodbyeJoint(joint: box2d.b2Joint): void {
    if (this.test.m_mouseJoint === joint) {
      this.test.m_mouseJoint = null;
    } else {
      this.test.JointDestroyed(joint);
    }
  }

  public SayGoodbyeFixture(fixture: box2d.b2Fixture): void {}
}

export class ContactPoint {
  public fixtureA: box2d.b2Fixture = null;
  public fixtureB: box2d.b2Fixture = null;
  public normal: box2d.b2Vec2 = new box2d.b2Vec2();
  public position: box2d.b2Vec2 = new box2d.b2Vec2();
  public state: box2d.b2PointState = box2d.b2PointState.b2_nullState;
  public normalImpulse: number = 0;
  public tangentImpulse: number = 0;
  public separation: number = 0;
}

export class Test extends box2d.b2ContactListener {
  public static k_maxContactPoints: number = 2048;

  public m_world: box2d.b2World = null;
  public m_bomb: box2d.b2Body = null;
  public m_textLine: number = 30;
  public m_mouseJoint: box2d.b2MouseJoint = null;
  public m_points: ContactPoint[] = box2d.b2MakeArray(Test.k_maxContactPoints, function(i) { return new ContactPoint(); });
  public m_pointCount: number = 0;
  public m_destructionListener: DestructionListener;
  public m_bombSpawnPoint: box2d.b2Vec2 = new box2d.b2Vec2();
  public m_bombSpawning: boolean = false;
  public m_mouseWorld: box2d.b2Vec2 = new box2d.b2Vec2();
  public m_stepCount: number = 0;
  public m_maxProfile: box2d.b2Profile = new box2d.b2Profile();
  public m_totalProfile: box2d.b2Profile = new box2d.b2Profile();
  public m_groundBody: box2d.b2Body;

  constructor() {
    super();

    const gravity: box2d.b2Vec2 = new box2d.b2Vec2(0, -10);
    this.m_world = new box2d.b2World(gravity);
    this.m_bomb = null;
    this.m_textLine = 30;
    this.m_mouseJoint = null;

    this.m_destructionListener = new DestructionListener(this);
    this.m_world.SetDestructionListener(this.m_destructionListener);
    this.m_world.SetContactListener(this);
    this.m_world.SetDebugDraw(g_debugDraw);

    const bodyDef: box2d.b2BodyDef = new box2d.b2BodyDef();
    this.m_groundBody = this.m_world.CreateBody(bodyDef);
  }

  public JointDestroyed(joint: box2d.b2Joint): void {}

  public BeginContact(contact: box2d.b2Contact): void {}

  public EndContact(contact: box2d.b2Contact): void {}

  private static PreSolve_s_state1: box2d.b2PointState[] = [/*box2d.b2_maxManifoldPoints*/];
  private static PreSolve_s_state2: box2d.b2PointState[] = [/*box2d.b2_maxManifoldPoints*/];
  private static PreSolve_s_worldManifold: box2d.b2WorldManifold = new box2d.b2WorldManifold();
  public PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void {
    const manifold: box2d.b2Manifold = contact.GetManifold();

    if (manifold.pointCount === 0) {
      return;
    }

    const fixtureA: box2d.b2Fixture = contact.GetFixtureA();
    const fixtureB: box2d.b2Fixture = contact.GetFixtureB();

    const state1: box2d.b2PointState[] = Test.PreSolve_s_state1;
    const state2: box2d.b2PointState[] = Test.PreSolve_s_state2;
    box2d.b2GetPointStates(state1, state2, oldManifold, manifold);

    const worldManifold: box2d.b2WorldManifold = Test.PreSolve_s_worldManifold;
    contact.GetWorldManifold(worldManifold);

    for (let i: number = 0; i < manifold.pointCount && this.m_pointCount < Test.k_maxContactPoints; ++i) {
      const cp: ContactPoint = this.m_points[this.m_pointCount];
      cp.fixtureA = fixtureA;
      cp.fixtureB = fixtureB;
      cp.position.Copy(worldManifold.points[i]);
      cp.normal.Copy(worldManifold.normal);
      cp.state = state2[i];
      cp.normalImpulse = manifold.points[i].normalImpulse;
      cp.tangentImpulse = manifold.points[i].tangentImpulse;
      cp.separation = worldManifold.separations[i];
      ++this.m_pointCount;
    }
  }

  public PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse): void {}

  public Keyboard(key: string): void {}

  public KeyboardUp(key: string): void {}

  public SetTextLine(line: number): void {
    this.m_textLine = line;
  }

  public DrawTitle(title: string): void {
    g_debugDraw.DrawString(5, DRAW_STRING_NEW_LINE, title);
    this.m_textLine = 3 * DRAW_STRING_NEW_LINE;
  }

  public MouseDown(p: box2d.b2Vec2): void {
    this.m_mouseWorld.Copy(p);

    if (this.m_mouseJoint !== null) {
      return;
    }

    // Make a small box.
    const aabb: box2d.b2AABB = new box2d.b2AABB();
    const d: box2d.b2Vec2 = new box2d.b2Vec2();
    d.Set(0.001, 0.001);
    box2d.b2Vec2.SubVV(p, d, aabb.lowerBound);
    box2d.b2Vec2.AddVV(p, d, aabb.upperBound);

    const that: Test = this;
    let hit_fixture: box2d.b2Fixture = null;

    // Query the world for overlapping shapes.
    function callback(fixture: box2d.b2Fixture): boolean {
      const body = fixture.GetBody();
      if (body.GetType() === box2d.b2BodyType.b2_dynamicBody) {
        const inside = fixture.TestPoint(that.m_mouseWorld);
        if (inside) {
          hit_fixture = fixture;

          // We are done, terminate the query.
          return false;
        }
      }

      // Continue the query.
      return true;
    };

    this.m_world.QueryAABB(callback, aabb);

    if (hit_fixture) {
      const body = hit_fixture.GetBody();
      const md: box2d.b2MouseJointDef = new box2d.b2MouseJointDef();
      md.bodyA = this.m_groundBody;
      md.bodyB = body;
      md.target.Copy(p);
      md.maxForce = 1000 * body.GetMass();
      this.m_mouseJoint = <box2d.b2MouseJoint> this.m_world.CreateJoint(md);
      body.SetAwake(true);
    }
  }

  public SpawnBomb(worldPt: box2d.b2Vec2): void {
    this.m_bombSpawnPoint.Copy(worldPt);
    this.m_bombSpawning = true;
  }

  public CompleteBombSpawn(p: box2d.b2Vec2): void {
    if (!this.m_bombSpawning) {
      return;
    }

    const multiplier: number = 30;
    const vel: box2d.b2Vec2 = box2d.b2Vec2.SubVV(this.m_bombSpawnPoint, p, new box2d.b2Vec2());
    vel.SelfMul(multiplier);
    this.LaunchBombAt(this.m_bombSpawnPoint, vel);
    this.m_bombSpawning = false;
  }

  public ShiftMouseDown(p: box2d.b2Vec2): void {
    this.m_mouseWorld.Copy(p);

    if (this.m_mouseJoint !== null) {
      return;
    }

    this.SpawnBomb(p);
  }

  public MouseUp(p: box2d.b2Vec2): void {
    if (this.m_mouseJoint) {
      this.m_world.DestroyJoint(this.m_mouseJoint);
      this.m_mouseJoint = null;
    }

    if (this.m_bombSpawning) {
      this.CompleteBombSpawn(p);
    }
  }

  public MouseMove(p: box2d.b2Vec2): void {
    this.m_mouseWorld.Copy(p);

    if (this.m_mouseJoint) {
      this.m_mouseJoint.SetTarget(p);
    }
  }

  public LaunchBomb(): void {
    const p: box2d.b2Vec2 = new box2d.b2Vec2(box2d.b2RandomRange(-15, 15), 30);
    const v: box2d.b2Vec2 = box2d.b2Vec2.MulSV(-5, p, new box2d.b2Vec2());
    this.LaunchBombAt(p, v);
  }

  public LaunchBombAt(position: box2d.b2Vec2, velocity: box2d.b2Vec2): void {
    if (this.m_bomb) {
      this.m_world.DestroyBody(this.m_bomb);
      this.m_bomb = null;
    }

    const bd: box2d.b2BodyDef = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position.Copy(position);
    bd.bullet = true;
    this.m_bomb = this.m_world.CreateBody(bd);
    this.m_bomb.SetLinearVelocity(velocity);

    const circle: box2d.b2CircleShape = new box2d.b2CircleShape();
    circle.m_radius = 0.3;

    const fd: box2d.b2FixtureDef = new box2d.b2FixtureDef();
    fd.shape = circle;
    fd.density = 20;
    fd.restitution = 0;

    // box2d.b2Vec2 minV = position - box2d.b2Vec2(0.3f,0.3f);
    // box2d.b2Vec2 maxV = position + box2d.b2Vec2(0.3f,0.3f);

    // box2d.b2AABB aabb;
    // aabb.lowerBound = minV;
    // aabb.upperBound = maxV;

    this.m_bomb.CreateFixture(fd);
  }

  public Step(settings: Settings): void {
    let timeStep = settings.hz > 0 ? 1 / settings.hz : 0;

    if (settings.pause) {
      if (settings.singleStep) {
        settings.singleStep = false;
      } else {
        timeStep = 0;
      }

      g_debugDraw.DrawString(5, this.m_textLine, "****PAUSED****");
      this.m_textLine += DRAW_STRING_NEW_LINE;
    }

    let flags = box2d.b2DrawFlags.e_none;
    if (settings.drawShapes) { flags |= box2d.b2DrawFlags.e_shapeBit;        }
    if (settings.drawJoints) { flags |= box2d.b2DrawFlags.e_jointBit;        }
    if (settings.drawAABBs ) { flags |= box2d.b2DrawFlags.e_aabbBit;         }
    if (settings.drawCOMs  ) { flags |= box2d.b2DrawFlags.e_centerOfMassBit; }
    if (settings.drawControllers  ) { flags |= box2d.b2DrawFlags.e_controllerBit; }
    g_debugDraw.SetFlags(flags);

    this.m_world.SetAllowSleeping(settings.enableSleep);
    this.m_world.SetWarmStarting(settings.enableWarmStarting);
    this.m_world.SetContinuousPhysics(settings.enableContinuous);
    this.m_world.SetSubStepping(settings.enableSubStepping);

    this.m_pointCount = 0;

    this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations);

    this.m_world.DrawDebugData();

    if (timeStep > 0) {
      ++this.m_stepCount;
    }

    if (settings.drawStats) {
      const bodyCount = this.m_world.GetBodyCount();
      const contactCount = this.m_world.GetContactCount();
      const jointCount = this.m_world.GetJointCount();
      g_debugDraw.DrawString(5, this.m_textLine, "bodies/contacts/joints = " + bodyCount + "/" + contactCount + "/" + jointCount);
      this.m_textLine += DRAW_STRING_NEW_LINE;

      const proxyCount = this.m_world.GetProxyCount();
      const height = this.m_world.GetTreeHeight();
      const balance = this.m_world.GetTreeBalance();
      const quality = this.m_world.GetTreeQuality();
      g_debugDraw.DrawString(5, this.m_textLine, "proxies/height/balance/quality = " + proxyCount + "/" + height + "/" + balance + "/" + quality.toFixed(2));
      this.m_textLine += DRAW_STRING_NEW_LINE;
    }

    // Track maximum profile times
    {
      const p = this.m_world.GetProfile();
      this.m_maxProfile.step = box2d.b2Max(this.m_maxProfile.step, p.step);
      this.m_maxProfile.collide = box2d.b2Max(this.m_maxProfile.collide, p.collide);
      this.m_maxProfile.solve = box2d.b2Max(this.m_maxProfile.solve, p.solve);
      this.m_maxProfile.solveInit = box2d.b2Max(this.m_maxProfile.solveInit, p.solveInit);
      this.m_maxProfile.solveVelocity = box2d.b2Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
      this.m_maxProfile.solvePosition = box2d.b2Max(this.m_maxProfile.solvePosition, p.solvePosition);
      this.m_maxProfile.solveTOI = box2d.b2Max(this.m_maxProfile.solveTOI, p.solveTOI);
      this.m_maxProfile.broadphase = box2d.b2Max(this.m_maxProfile.broadphase, p.broadphase);

      this.m_totalProfile.step += p.step;
      this.m_totalProfile.collide += p.collide;
      this.m_totalProfile.solve += p.solve;
      this.m_totalProfile.solveInit += p.solveInit;
      this.m_totalProfile.solveVelocity += p.solveVelocity;
      this.m_totalProfile.solvePosition += p.solvePosition;
      this.m_totalProfile.solveTOI += p.solveTOI;
      this.m_totalProfile.broadphase += p.broadphase;
    }

    if (settings.drawProfile) {
      const p = this.m_world.GetProfile();

      const aveProfile: box2d.b2Profile = new box2d.b2Profile();
      if (this.m_stepCount > 0) {
        const scale: number = 1 / this.m_stepCount;
        aveProfile.step = scale * this.m_totalProfile.step;
        aveProfile.collide = scale * this.m_totalProfile.collide;
        aveProfile.solve = scale * this.m_totalProfile.solve;
        aveProfile.solveInit = scale * this.m_totalProfile.solveInit;
        aveProfile.solveVelocity = scale * this.m_totalProfile.solveVelocity;
        aveProfile.solvePosition = scale * this.m_totalProfile.solvePosition;
        aveProfile.solveTOI = scale * this.m_totalProfile.solveTOI;
        aveProfile.broadphase = scale * this.m_totalProfile.broadphase;
      }

      g_debugDraw.DrawString(5, this.m_textLine, "step [ave] (max) = " + p.step.toFixed(2) + " [" + aveProfile.step.toFixed(2) + "] (" + this.m_maxProfile.step.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
      g_debugDraw.DrawString(5, this.m_textLine, "collide [ave] (max) = " + p.collide.toFixed(2) + " [" + aveProfile.collide.toFixed(2) + "] (" + this.m_maxProfile.collide.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
      g_debugDraw.DrawString(5, this.m_textLine, "solve [ave] (max) = " + p.solve.toFixed(2) + " [" + aveProfile.solve.toFixed(2) + "] (" + this.m_maxProfile.solve.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
      g_debugDraw.DrawString(5, this.m_textLine, "solve init [ave] (max) = " + p.solveInit.toFixed(2) + " [" + aveProfile.solveInit.toFixed(2) + "] (" + this.m_maxProfile.solveInit.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
      g_debugDraw.DrawString(5, this.m_textLine, "solve velocity [ave] (max) = " + p.solveVelocity.toFixed(2) + " [" + aveProfile.solveVelocity.toFixed(2) + "] (" + this.m_maxProfile.solveVelocity.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
      g_debugDraw.DrawString(5, this.m_textLine, "solve position [ave] (max) = " + p.solvePosition.toFixed(2) + " [" + aveProfile.solvePosition.toFixed(2) + "] (" + this.m_maxProfile.solvePosition.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
      g_debugDraw.DrawString(5, this.m_textLine, "solveTOI [ave] (max) = " + p.solveTOI.toFixed(2) + " [" + aveProfile.solveTOI.toFixed(2) + "] (" + this.m_maxProfile.solveTOI.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
      g_debugDraw.DrawString(5, this.m_textLine, "broad-phase [ave] (max) = " + p.broadphase.toFixed(2) + " [" + aveProfile.broadphase.toFixed(2) + "] (" + this.m_maxProfile.broadphase.toFixed(2) + ")");
      this.m_textLine += DRAW_STRING_NEW_LINE;
    }

    if (this.m_mouseJoint) {
      const p1 = this.m_mouseJoint.GetAnchorB(new box2d.b2Vec2());
      const p2 = this.m_mouseJoint.GetTarget();

      const c: box2d.b2Color = new box2d.b2Color(0, 1, 0);
      g_debugDraw.DrawPoint(p1, 4, c);
      g_debugDraw.DrawPoint(p2, 4, c);

      c.SetRGB(0.8, 0.8, 0.8);
      g_debugDraw.DrawSegment(p1, p2, c);
    }

    if (this.m_bombSpawning) {
      const c: box2d.b2Color = new box2d.b2Color(0, 0, 1);
      g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);

      c.SetRGB(0.8, 0.8, 0.8);
      g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
    }

    if (settings.drawContactPoints) {
      const k_impulseScale: number = 0.1;
      const k_axisScale: number = 0.3;

      for (let i: number = 0; i < this.m_pointCount; ++i) {
        const point = this.m_points[i];

        if (point.state === box2d.b2PointState.b2_addState) {
          // Add
          g_debugDraw.DrawPoint(point.position, 10, new box2d.b2Color(0.3, 0.95, 0.3));
        } else if (point.state === box2d.b2PointState.b2_persistState) {
          // Persist
          g_debugDraw.DrawPoint(point.position, 5, new box2d.b2Color(0.3, 0.3, 0.95));
        }

        if (settings.drawContactNormals) {
          const p1 = point.position;
          const p2: box2d.b2Vec2 = box2d.b2Vec2.AddVV(p1, box2d.b2Vec2.MulSV(k_axisScale, point.normal, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
          g_debugDraw.DrawSegment(p1, p2, new box2d.b2Color(0.9, 0.9, 0.9));
        } else if (settings.drawContactImpulse) {
          const p1 = point.position;
          const p2: box2d.b2Vec2 = box2d.b2Vec2.AddVMulSV(p1, k_impulseScale * point.normalImpulse, point.normal, new box2d.b2Vec2());
          g_debugDraw.DrawSegment(p1, p2, new box2d.b2Color(0.9, 0.9, 0.3));
        }

        if (settings.drawFrictionImpulse) {
          const tangent: box2d.b2Vec2 = box2d.b2Vec2.CrossVOne(point.normal, new box2d.b2Vec2());
          const p1 = point.position;
          const p2: box2d.b2Vec2 = box2d.b2Vec2.AddVMulSV(p1, k_impulseScale * point.tangentImpulse, tangent, new box2d.b2Vec2());
          g_debugDraw.DrawSegment(p1, p2, new box2d.b2Color(0.9, 0.9, 0.3));
        }
      }
    }
  }

  public ShiftOrigin(newOrigin: box2d.b2Vec2): void {
    this.m_world.ShiftOrigin(newOrigin);
  }

  public GetDefaultViewZoom(): number {
    return 1.0;
  }
}
