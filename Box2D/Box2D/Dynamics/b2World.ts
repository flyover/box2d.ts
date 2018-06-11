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

// DEBUG: import { b2Assert } from "../Common/b2Settings";
import { b2_epsilon, b2_maxSubSteps, b2_maxTOIContacts } from "../Common/b2Settings";
import { b2Min, b2Vec2, b2Transform, b2Sweep, XY } from "../Common/b2Math";
import { b2Timer } from "../Common/b2Timer";
import { b2Color, b2Draw, b2DrawFlags } from "../Common/b2Draw";
import { b2BroadPhase } from "../Collision/b2BroadPhase";
import { b2AABB, b2RayCastInput, b2RayCastOutput, b2TestOverlapShape } from "../Collision/b2Collision";
import { b2TreeNode } from "../Collision/b2DynamicTree";
import { b2TimeOfImpact, b2TOIInput, b2TOIOutput, b2TOIOutputState } from "../Collision/b2TimeOfImpact";
import { b2Shape, b2ShapeType } from "../Collision/Shapes/b2Shape";
import { b2ChainShape } from "../Collision/Shapes/b2ChainShape";
import { b2CircleShape } from "../Collision/Shapes/b2CircleShape";
import { b2EdgeShape } from "../Collision/Shapes/b2EdgeShape";
import { b2PolygonShape } from "../Collision/Shapes/b2PolygonShape";
import { b2Contact } from "./Contacts/b2Contact";
import { b2Joint, b2IJointDef, b2JointType } from "./Joints/b2Joint";
import { b2JointFactory } from "./Joints/b2JointFactory";
import { b2PulleyJoint } from "./Joints/b2PulleyJoint";
import { b2Body, b2IBodyDef, b2BodyType } from "./b2Body";
import { b2ContactManager } from "./b2ContactManager";
import { b2Fixture, b2FixtureProxy } from "./b2Fixture";
import { b2Island } from "./b2Island";
import { b2Profile, b2TimeStep } from "./b2TimeStep";
import { b2ContactFilter } from "./b2WorldCallbacks";
import { b2ContactListener } from "./b2WorldCallbacks";
import { b2DestructionListener } from "./b2WorldCallbacks";
import { b2QueryCallback, b2QueryCallbackFunction } from "./b2WorldCallbacks";
import { b2RayCastCallback, b2RayCastCallbackFunction } from "./b2WorldCallbacks";
// #if B2_ENABLE_PARTICLE
import { b2_maxFloat } from "../Common/b2Settings";
import { b2CalculateParticleIterations } from "../Particle/b2Particle";
import { b2ParticleSystemDef, b2ParticleSystem } from "../Particle/b2ParticleSystem";
// #endif
// #if B2_ENABLE_CONTROLLER
import { b2Controller } from "../Controllers/b2Controller";
// #endif

/// The world class manages all physics entities, dynamic simulation,
/// and asynchronous queries. The world also contains efficient memory
/// management facilities.
export class b2World {
  // b2BlockAllocator m_blockAllocator;
  // b2StackAllocator m_stackAllocator;

  public m_newFixture: boolean = false;
  public m_locked: boolean = false;
  public m_clearForces: boolean = true;

  public readonly m_contactManager: b2ContactManager = new b2ContactManager();

  public readonly m_bodyList: Set<b2Body> = new Set<b2Body>();
  public readonly m_jointList: Set<b2Joint> = new Set<b2Joint>();

  // #if B2_ENABLE_PARTICLE
  public readonly m_particleSystemList: Set<b2ParticleSystem> = new Set<b2ParticleSystem>();
  // #endif

  public readonly m_gravity: b2Vec2 = new b2Vec2();
  public m_allowSleep: boolean = true;

  public m_destructionListener: b2DestructionListener | null = null;
  public m_debugDraw: b2Draw | null = null;

  // This is used to compute the time step ratio to
  // support a variable time step.
  public m_inv_dt0: number = 0;

  // These are for debugging the solver.
  public m_warmStarting: boolean = true;
  public m_continuousPhysics: boolean = true;
  public m_subStepping: boolean = false;

  public m_stepComplete: boolean = true;

  public readonly m_profile: b2Profile = new b2Profile();

  public readonly m_island: b2Island = new b2Island();

  public readonly s_stack: Array<b2Body | null> = [];

  // #if B2_ENABLE_CONTROLLER
  public readonly m_controllerList: Set<b2Controller> = new Set<b2Controller>();
  // #endif

  /// Construct a world object.
  /// @param gravity the world gravity vector.
  constructor(gravity: XY) {
    this.m_gravity.Copy(gravity);
  }

  /// Register a destruction listener. The listener is owned by you and must
  /// remain in scope.
  public SetDestructionListener(listener: b2DestructionListener | null): void {
    this.m_destructionListener = listener;
  }

  /// Register a contact filter to provide specific control over collision.
  /// Otherwise the default filter is used (b2_defaultFilter). The listener is
  /// owned by you and must remain in scope.
  public SetContactFilter(filter: b2ContactFilter): void {
    this.m_contactManager.m_contactFilter = filter;
  }

  /// Register a contact event listener. The listener is owned by you and must
  /// remain in scope.
  public SetContactListener(listener: b2ContactListener): void {
    this.m_contactManager.m_contactListener = listener;
  }

  /// Register a routine for debug drawing. The debug draw functions are called
  /// inside with b2World::DrawDebugData method. The debug draw object is owned
  /// by you and must remain in scope.
  public SetDebugDraw(debugDraw: b2Draw): void {
    this.m_debugDraw = debugDraw;
  }

  /// Create a rigid body given a definition. No reference to the definition
  /// is retained.
  /// @warning This function is locked during callbacks.
  public CreateBody(def: b2IBodyDef = {}): b2Body {
    if (this.IsLocked()) { throw new Error(); }

    const b: b2Body = new b2Body(def, this);

    // Add to world doubly linked list.
    this.m_bodyList.add(b);

    return b;
  }

  /// Destroy a rigid body given a definition. No reference to the definition
  /// is retained. This function is locked during callbacks.
  /// @warning This automatically deletes all associated shapes and joints.
  /// @warning This function is locked during callbacks.
  public DestroyBody(b: b2Body): void {
    // DEBUG: b2Assert(this.m_bodyList.size > 0);
    if (this.IsLocked()) { throw new Error(); }

    // Delete the attached joints.
    for (const joint of b.GetJointList()) {
      if (this.m_destructionListener) {
        this.m_destructionListener.SayGoodbyeJoint(joint);
      }

      this.DestroyJoint(joint);
    }
    b.GetJointList().clear();

    // #if B2_ENABLE_CONTROLLER
    // @see b2Controller list
    for (const controller of b.GetControllerList()) {
      controller.RemoveBody(b);
    }
    // #endif

    // Delete the attached contacts.
    for (const contact of b.GetContactList()) {
      this.m_contactManager.Destroy(contact);
    }
    b.GetContactList().clear();

    // Delete the attached fixtures. This destroys broad-phase proxies.
    for (const f of b.GetFixtureList()) {
      if (this.m_destructionListener) {
        this.m_destructionListener.SayGoodbyeFixture(f);
      }

      f.DestroyProxies(this.m_contactManager.m_broadPhase);
      f.Destroy();
    }
    b.GetFixtureList().clear();

    // Remove world body list.
    this.m_bodyList.delete(b);
  }

  /// Create a joint to constrain bodies together. No reference to the definition
  /// is retained. This may cause the connected bodies to cease colliding.
  /// @warning This function is locked during callbacks.
  public CreateJoint<T extends b2Joint>(def: b2IJointDef): T {
    if (this.IsLocked()) { throw new Error(); }

    const j: b2Joint = b2JointFactory.Create(def, null);

    // Connect to the world list.
    this.m_jointList.add(j);

    // Connect to the bodies' doubly linked lists.
    j.m_bodyA.GetJointList().add(j);

    j.m_bodyB.GetJointList().add(j);

    const bodyA: b2Body = def.bodyA;
    const bodyB: b2Body = def.bodyB;

    // If the joint prevents collisions, then flag any contacts for filtering.
    if (!def.collideConnected) {
      for (const contact of bodyB.GetContactList()) {
        if (contact.GetOtherBody(bodyB) === bodyA) {
          // Flag the contact for filtering at the next time step (where either
          // body is awake).
          contact.FlagForFiltering();
        }
      }
    }

    // Note: creating a joint doesn't wake the bodies.

    return j as T;
  }

  /// Destroy a joint. This may cause the connected bodies to begin colliding.
  /// @warning This function is locked during callbacks.
  public DestroyJoint(j: b2Joint): void {
    if (this.IsLocked()) { throw new Error(); }

    const collideConnected: boolean = j.m_collideConnected;

    // Remove from the doubly linked list.
    this.m_jointList.delete(j);

    // Disconnect from island graph.
    const bodyA: b2Body = j.m_bodyA;
    const bodyB: b2Body = j.m_bodyB;

    // Wake up connected bodies.
    bodyA.SetAwake(true);
    bodyB.SetAwake(true);

    // Remove from body 1.
    bodyA.GetJointList().delete(j);

    // Remove from body 2
    bodyB.GetJointList().delete(j);

    b2JointFactory.Destroy(j, null);

    // DEBUG: b2Assert(this.m_jointList.size > 0);

    // If the joint prevents collisions, then flag any contacts for filtering.
    if (!collideConnected) {
      for (const contact of bodyB.GetContactList()) {
        if (contact.GetOtherBody(bodyB) === bodyA) {
          // Flag the contact for filtering at the next time step (where either
          // body is awake).
          contact.FlagForFiltering();
        }
      }
    }
  }

  // #if B2_ENABLE_PARTICLE

  public CreateParticleSystem(def: b2ParticleSystemDef): b2ParticleSystem {
    if (this.IsLocked()) { throw new Error(); }

    const p = new b2ParticleSystem(def, this);

    // Add to world doubly linked list.
    this.m_particleSystemList.add(p);

    return p;
  }

  public DestroyParticleSystem(p: b2ParticleSystem): void {
    if (this.IsLocked()) { throw new Error(); }

    // Remove world particleSystem list.
    this.m_particleSystemList.delete(p);
  }

  public CalculateReasonableParticleIterations(timeStep: number): number {
    if (this.m_particleSystemList.size === 0) {
      return 1;
    }

    function GetSmallestRadius(world: b2World): number {
      let smallestRadius = b2_maxFloat;
      for (const system of world.GetParticleSystemList()) {
        smallestRadius = b2Min(smallestRadius, system.GetRadius());
      }
      return smallestRadius;
    }

    // Use the smallest radius, since that represents the worst-case.
    return b2CalculateParticleIterations(this.m_gravity.Length(), GetSmallestRadius(this), timeStep);
  }

  // #endif

  /// Take a time step. This performs collision detection, integration,
  /// and constraint solution.
  /// @param timeStep the amount of time to simulate, this should not vary.
  /// @param velocityIterations for the velocity constraint solver.
  /// @param positionIterations for the position constraint solver.
  private static Step_s_step = new b2TimeStep();
  private static Step_s_stepTimer = new b2Timer();
  private static Step_s_timer = new b2Timer();
  // #if B2_ENABLE_PARTICLE
  public Step(dt: number, velocityIterations: number, positionIterations: number, particleIterations: number = this.CalculateReasonableParticleIterations(dt)): void {
  // #else
  // public Step(dt: number, velocityIterations: number, positionIterations: number): void {
  // #endif
    const stepTimer: b2Timer = b2World.Step_s_stepTimer.Reset();

    // If new fixtures were added, we need to find the new contacts.
    if (this.m_newFixture) {
      this.m_contactManager.FindNewContacts();
      this.m_newFixture = false;
    }

    this.m_locked = true;

    const step: b2TimeStep = b2World.Step_s_step;
    step.dt = dt;
    step.velocityIterations = velocityIterations;
    step.positionIterations = positionIterations;
    // #if B2_ENABLE_PARTICLE
    step.particleIterations = particleIterations;
    // #endif
    if (dt > 0) {
      step.inv_dt = 1 / dt;
    } else {
      step.inv_dt = 0;
    }

    step.dtRatio = this.m_inv_dt0 * dt;

    step.warmStarting = this.m_warmStarting;

    // Update contacts. This is where some contacts are destroyed.
    const timer: b2Timer = b2World.Step_s_timer.Reset();
    this.m_contactManager.Collide();
    this.m_profile.collide = timer.GetMilliseconds();

    // Integrate velocities, solve velocity constraints, and integrate positions.
    if (this.m_stepComplete && step.dt > 0) {
      const timer: b2Timer = b2World.Step_s_timer.Reset();
      // #if B2_ENABLE_PARTICLE
      for (const p of this.m_particleSystemList) {
        p.Solve(step); // Particle Simulation
      }
      // #endif
      this.Solve(step);
      this.m_profile.solve = timer.GetMilliseconds();
    }

    // Handle TOI events.
    if (this.m_continuousPhysics && step.dt > 0) {
      const timer: b2Timer = b2World.Step_s_timer.Reset();
      this.SolveTOI(step);
      this.m_profile.solveTOI = timer.GetMilliseconds();
    }

    if (step.dt > 0) {
      this.m_inv_dt0 = step.inv_dt;
    }

    if (this.m_clearForces) {
      this.ClearForces();
    }

    this.m_locked = false;

    this.m_profile.step = stepTimer.GetMilliseconds();
  }

  /// Manually clear the force buffer on all bodies. By default, forces are cleared automatically
  /// after each call to Step. The default behavior is modified by calling SetAutoClearForces.
  /// The purpose of this function is to support sub-stepping. Sub-stepping is often used to maintain
  /// a fixed sized time step under a variable frame-rate.
  /// When you perform sub-stepping you will disable auto clearing of forces and instead call
  /// ClearForces after all sub-steps are complete in one pass of your game loop.
  /// @see SetAutoClearForces
  public ClearForces(): void {
    for (const body of this.m_bodyList) {
      body.m_force.SetZero();
      body.m_torque = 0;
    }
  }

  // #if B2_ENABLE_PARTICLE

  public DrawParticleSystem(system: b2ParticleSystem): void {
    if (this.m_debugDraw === null) {
      return;
    }
    const particleCount = system.GetParticleCount();
    if (particleCount) {
      const radius = system.GetRadius();
      const positionBuffer = system.GetPositionBuffer();
      if (system.m_colorBuffer.data) {
        const colorBuffer = system.GetColorBuffer();
        this.m_debugDraw.DrawParticles(positionBuffer, radius, colorBuffer, particleCount);
      } else {
        this.m_debugDraw.DrawParticles(positionBuffer, radius, null, particleCount);
      }
    }
  }

  // #endif

  /// Call this to draw shapes and other debug draw data.
  private static DrawDebugData_s_color = new b2Color(0, 0, 0);
  private static DrawDebugData_s_vs = b2Vec2.MakeArray(4);
  private static DrawDebugData_s_xf = new b2Transform();
  public DrawDebugData(): void {
    if (this.m_debugDraw === null) {
      return;
    }

    const flags: number = this.m_debugDraw.GetFlags();
    const color: b2Color = b2World.DrawDebugData_s_color.SetRGB(0, 0, 0);

    if (flags & b2DrawFlags.e_shapeBit) {
      for (const b of this.m_bodyList) {
        const xf: b2Transform = b.m_xf;

        this.m_debugDraw.PushTransform(xf);

        for (const f of b.GetFixtureList()) {
          if (!b.IsActive()) {
            color.SetRGB(0.5, 0.5, 0.3);
            this.DrawShape(f, color);
          } else if (b.GetType() === b2BodyType.b2_staticBody) {
            color.SetRGB(0.5, 0.9, 0.5);
            this.DrawShape(f, color);
          } else if (b.GetType() === b2BodyType.b2_kinematicBody) {
            color.SetRGB(0.5, 0.5, 0.9);
            this.DrawShape(f, color);
          } else if (!b.IsAwake()) {
            color.SetRGB(0.6, 0.6, 0.6);
            this.DrawShape(f, color);
          } else {
            color.SetRGB(0.9, 0.7, 0.7);
            this.DrawShape(f, color);
          }
        }

        this.m_debugDraw.PopTransform(xf);
      }
    }

    // #if B2_ENABLE_PARTICLE
    if (flags & b2DrawFlags.e_particleBit) {
      for (const p of this.m_particleSystemList) {
        this.DrawParticleSystem(p);
      }
    }
    // #endif

    if (flags & b2DrawFlags.e_jointBit) {
      for (const j of this.m_jointList) {
        this.DrawJoint(j);
      }
    }

    // /*
    if (flags & b2DrawFlags.e_pairBit) {
      color.SetRGB(0.3, 0.9, 0.9);
      for (const contact of this.m_contactManager.m_contactList) {
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();

        const cA = fixtureA.GetAABB(contact.m_indexA).GetCenter();
        const cB = fixtureB.GetAABB(contact.m_indexB).GetCenter();

        this.m_debugDraw.DrawSegment(cA, cB, color);
      }
    }
    // */

    if (flags & b2DrawFlags.e_aabbBit) {
      color.SetRGB(0.9, 0.3, 0.9);
      const bp: b2BroadPhase = this.m_contactManager.m_broadPhase;
      const vs: b2Vec2[] = b2World.DrawDebugData_s_vs;

      for (const b of this.m_bodyList) {
        if (!b.IsActive()) {
          continue;
        }

        for (const f of b.GetFixtureList()) {
          for (let i: number = 0; i < f.m_proxyCount; ++i) {
            const proxy: b2FixtureProxy = f.m_proxies[i];

            const aabb: b2AABB = bp.GetFatAABB(proxy.treeNode);
            vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
            vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
            vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
            vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);

            this.m_debugDraw.DrawPolygon(vs, 4, color);
          }
        }
      }
    }

    if (flags & b2DrawFlags.e_centerOfMassBit) {
      for (const b of this.m_bodyList) {
        const xf: b2Transform = b2World.DrawDebugData_s_xf;
        xf.q.Copy(b.m_xf.q);
        xf.p.Copy(b.GetWorldCenter());
        this.m_debugDraw.DrawTransform(xf);
      }
    }

    // #if B2_ENABLE_CONTROLLER
    // @see b2Controller list
    if (flags & b2DrawFlags.e_controllerBit) {
      for (const c of this.m_controllerList) {
        c.Draw(this.m_debugDraw);
      }
    }
    // #endif
  }

  /// Query the world for all fixtures that potentially overlap the
  /// provided AABB.
  /// @param callback a user implemented callback class.
  /// @param aabb the query box.
  public QueryAABB(callback: b2QueryCallback | null, aabb: b2AABB, fn?: b2QueryCallbackFunction): void {
    const broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;
    broadPhase.Query(aabb, (proxy: b2TreeNode): boolean => {
      const fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
      // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
      const fixture: b2Fixture = fixture_proxy.fixture;
      if (callback) {
        return callback.ReportFixture(fixture);
      } else if (fn) {
        return fn(fixture);
      }
      return true;
    });
    // #if B2_ENABLE_PARTICLE
    if (callback) {
      for (const p of this.m_particleSystemList) {
        if (callback.ShouldQueryParticleSystem(p)) {
          p.QueryAABB(callback, aabb);
        }
      }
    }
    // #endif
  }

  public QueryAllAABB(aabb: b2AABB, out: b2Fixture[] = []): b2Fixture[] {
    this.QueryAABB(null, aabb, (fixture: b2Fixture): boolean => { out.push(fixture); return true; });
    return out;
  }

  /// Query the world for all fixtures that potentially overlap the
  /// provided point.
  /// @param callback a user implemented callback class.
  /// @param point the query point.
  public QueryPointAABB(callback: b2QueryCallback | null, point: b2Vec2, fn?: b2QueryCallbackFunction): void {
    const broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;
    broadPhase.QueryPoint(point, (proxy: b2TreeNode): boolean => {
      const fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
      // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
      const fixture: b2Fixture = fixture_proxy.fixture;
      if (callback) {
        return callback.ReportFixture(fixture);
      } else if (fn) {
        return fn(fixture);
      }
      return true;
    });
    // #if B2_ENABLE_PARTICLE
    if (callback) {
      for (const p of this.m_particleSystemList) {
        if (callback.ShouldQueryParticleSystem(p)) {
          p.QueryPointAABB(callback, point);
        }
      }
    }
    // #endif
  }

  public QueryAllPointAABB(point: b2Vec2, out: b2Fixture[] = []): b2Fixture[] {
    this.QueryPointAABB(null, point, (fixture: b2Fixture): boolean => { out.push(fixture); return true; });
    return out;
  }

  private static QueryFixtureShape_s_aabb = new b2AABB();
  public QueryFixtureShape(callback: b2QueryCallback | null, shape: b2Shape, index: number, transform: b2Transform, fn?: b2QueryCallbackFunction): void {
    const broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;
    const aabb: b2AABB = b2World.QueryFixtureShape_s_aabb;
    shape.ComputeAABB(aabb, transform, index);
    broadPhase.Query(aabb, (proxy: b2TreeNode): boolean => {
      const fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
      // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
      const fixture: b2Fixture = fixture_proxy.fixture;
      if (b2TestOverlapShape(shape, index, fixture.GetShape(), fixture_proxy.childIndex, transform, fixture.GetBody().GetTransform())) {
        if (callback) {
          return callback.ReportFixture(fixture);
        } else if (fn) {
          return fn(fixture);
        }
      }
      return true;
    });
    // #if B2_ENABLE_PARTICLE
    if (callback) {
      for (const p of this.m_particleSystemList) {
        if (callback.ShouldQueryParticleSystem(p)) {
          p.QueryAABB(callback, aabb);
        }
      }
    }
    // #endif
  }

  public QueryAllFixtureShape(shape: b2Shape, index: number, transform: b2Transform, out: b2Fixture[] = []): b2Fixture[] {
    this.QueryFixtureShape(null, shape, index, transform, (fixture: b2Fixture): boolean => { out.push(fixture); return true; });
    return out;
  }

  public QueryFixturePoint(callback: b2QueryCallback | null, point: b2Vec2, fn?: b2QueryCallbackFunction): void {
    const broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;
    broadPhase.QueryPoint(point, (proxy: b2TreeNode): boolean => {
      const fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
      // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
      const fixture: b2Fixture = fixture_proxy.fixture;
      if (fixture.TestPoint(point)) {
        if (callback) {
          return callback.ReportFixture(fixture);
        } else if (fn) {
          return fn(fixture);
        }
      }
      return true;
    });
    // #if B2_ENABLE_PARTICLE
    if (callback) {
      for (const p of this.m_particleSystemList) {
        if (callback.ShouldQueryParticleSystem(p)) {
          p.QueryPointAABB(callback, point);
        }
      }
    }
    // #endif
  }

  public QueryAllFixturePoint(point: b2Vec2, out: b2Fixture[] = []): b2Fixture[] {
    this.QueryFixturePoint(null, point, (fixture: b2Fixture): boolean => { out.push(fixture); return true; });
    return out;
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
  public RayCast(callback: b2RayCastCallback | null, point1: b2Vec2, point2: b2Vec2, fn?: b2RayCastCallbackFunction): void {
    const broadPhase: b2BroadPhase = this.m_contactManager.m_broadPhase;
    const input: b2RayCastInput = b2World.RayCast_s_input;
    input.maxFraction = 1;
    input.p1.Copy(point1);
    input.p2.Copy(point2);
    broadPhase.RayCast(input, (input: b2RayCastInput, proxy: b2TreeNode): number => {
      const fixture_proxy: b2FixtureProxy = broadPhase.GetUserData(proxy);
      // DEBUG: b2Assert(fixture_proxy instanceof b2FixtureProxy);
      const fixture: b2Fixture = fixture_proxy.fixture;
      const index: number = fixture_proxy.childIndex;
      const output: b2RayCastOutput = b2World.RayCast_s_output;
      const hit: boolean = fixture.RayCast(output, input, index);
      if (hit) {
        const fraction: number = output.fraction;
        const point: b2Vec2 = b2World.RayCast_s_point;
        point.Set((1 - fraction) * point1.x + fraction * point2.x, (1 - fraction) * point1.y + fraction * point2.y);
        if (callback) {
          return callback.ReportFixture(fixture, point, output.normal, fraction);
        } else if (fn) {
          return fn(fixture, point, output.normal, fraction);
        }
      }
      return input.maxFraction;
    });
    // #if B2_ENABLE_PARTICLE
    if (callback) {
      for (const p of this.m_particleSystemList) {
        if (callback.ShouldQueryParticleSystem(p)) {
          p.RayCast(callback, point1, point2);
        }
      }
    }
    // #endif
  }

  public RayCastOne(point1: b2Vec2, point2: b2Vec2): b2Fixture | null {
    let result: b2Fixture | null = null;
    let min_fraction: number = 1;
    this.RayCast(null, point1, point2, (fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number => {
      if (fraction < min_fraction) {
        min_fraction = fraction;
        result = fixture;
      }
      return min_fraction;
    });
    return result;
  }

  public RayCastAll(point1: b2Vec2, point2: b2Vec2, out: b2Fixture[] = []): b2Fixture[] {
    this.RayCast(null, point1, point2, (fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number => {
      out.push(fixture);
      return 1;
    });
    return out;
  }

  /// Get the world body list. With the returned body, use b2Body::GetNext to get
  /// the next body in the world list. A NULL body indicates the end of the list.
  /// @return the head of the world body list.
  public GetBodyList(): Set<b2Body> {
    return this.m_bodyList;
  }

  /// Get the world joint list. With the returned joint, use b2Joint::GetNext to get
  /// the next joint in the world list. A NULL joint indicates the end of the list.
  /// @return the head of the world joint list.
  public GetJointList(): Set<b2Joint> {
    return this.m_jointList;
  }

  // #if B2_ENABLE_PARTICLE
  public GetParticleSystemList(): Set<b2ParticleSystem> {
    return this.m_particleSystemList;
  }
  // #endif

  /// Get the world contact list. With the returned contact, use b2Contact::GetNext to get
  /// the next contact in the world list. A NULL contact indicates the end of the list.
  /// @return the head of the world contact list.
  /// @warning contacts are created and destroyed in the middle of a time step.
  /// Use b2ContactListener to avoid missing contacts.
  public GetContactList(): Set<b2Contact> {
    return this.m_contactManager.m_contactList;
  }

  /// Enable/disable sleep.
  public SetAllowSleeping(flag: boolean): void {
    if (flag === this.m_allowSleep) {
      return;
    }

    this.m_allowSleep = flag;
    if (!this.m_allowSleep) {
      for (const b of this.m_bodyList) {
        b.SetAwake(true);
      }
    }
  }

  public GetAllowSleeping(): boolean {
    return this.m_allowSleep;
  }

  /// Enable/disable warm starting. For testing.
  public SetWarmStarting(flag: boolean): void {
    this.m_warmStarting = flag;
  }

  public GetWarmStarting(): boolean {
    return this.m_warmStarting;
  }

  /// Enable/disable continuous physics. For testing.
  public SetContinuousPhysics(flag: boolean): void {
    this.m_continuousPhysics = flag;
  }

  public GetContinuousPhysics(): boolean {
    return this.m_continuousPhysics;
  }

  /// Enable/disable single stepped continuous physics. For testing.
  public SetSubStepping(flag: boolean): void {
    this.m_subStepping = flag;
  }

  public GetSubStepping(): boolean {
    return this.m_subStepping;
  }

  /// Get the number of broad-phase proxies.
  public GetProxyCount(): number {
    return this.m_contactManager.m_broadPhase.GetProxyCount();
  }

  /// Get the number of bodies.
  public GetBodyCount(): number {
    return this.m_bodyList.size;
  }

  /// Get the number of joints.
  public GetJointCount(): number {
    return this.m_jointList.size;
  }

  /// Get the number of contacts (each may have 0 or more contact points).
  public GetContactCount(): number {
    return this.m_contactManager.m_contactList.size;
  }

  /// Get the height of the dynamic tree.
  public GetTreeHeight(): number {
    return this.m_contactManager.m_broadPhase.GetTreeHeight();
  }

  /// Get the balance of the dynamic tree.
  public GetTreeBalance(): number {
    return this.m_contactManager.m_broadPhase.GetTreeBalance();
  }

  /// Get the quality metric of the dynamic tree. The smaller the better.
  /// The minimum is 1.
  public GetTreeQuality(): number {
    return this.m_contactManager.m_broadPhase.GetTreeQuality();
  }

  /// Change the global gravity vector.
  public SetGravity(gravity: XY, wake: boolean = true) {
    if (!b2Vec2.IsEqualToV(this.m_gravity, gravity)) {
      this.m_gravity.Copy(gravity);

      if (wake) {
        for (const b of this.m_bodyList) {
          b.SetAwake(true);
        }
      }
    }
  }

  /// Get the global gravity vector.
  public GetGravity(): Readonly<b2Vec2> {
    return this.m_gravity;
  }

  /// Is the world locked (in the middle of a time step).
  public IsLocked(): boolean {
    return this.m_locked;
  }

  /// Set flag to control automatic clearing of forces after each time step.
  public SetAutoClearForces(flag: boolean): void {
    this.m_clearForces = flag;
  }

  /// Get the flag that controls automatic clearing of forces after each time step.
  public GetAutoClearForces(): boolean {
    return this.m_clearForces;
  }

  /// Shift the world origin. Useful for large worlds.
  /// The body shift formula is: position -= newOrigin
  /// @param newOrigin the new origin with respect to the old origin
  public ShiftOrigin(newOrigin: XY): void {
    if (this.IsLocked()) { throw new Error(); }

    for (const b of this.m_bodyList) {
      b.m_xf.p.SelfSub(newOrigin);
      b.m_sweep.c0.SelfSub(newOrigin);
      b.m_sweep.c.SelfSub(newOrigin);
    }

    for (const j of this.m_jointList) {
      j.ShiftOrigin(newOrigin);
    }

    this.m_contactManager.m_broadPhase.ShiftOrigin(newOrigin);
  }

  /// Get the contact manager for testing.
  public GetContactManager(): b2ContactManager {
    return this.m_contactManager;
  }

  /// Get the current profile.
  public GetProfile(): b2Profile {
    return this.m_profile;
  }

  /// Dump the world into the log file.
  /// @warning this should be called outside of a time step.
  public Dump(log: (format: string, ...args: any[]) => void): void {
    if (this.m_locked) {
      return;
    }

    log("const g: b2Vec2 = new b2Vec2(%.15f, %.15f);\n", this.m_gravity.x, this.m_gravity.y);
    log("this.m_world.SetGravity(g);\n");

    log("const bodies: b2Body[] = [];\n");
    log("const joints: b2Joint[] = [];\n");
    let i: number = 0;
    for (const b of this.m_bodyList) {
      b.m_islandIndex = i;
      b.Dump(log);
      ++i;
    }

    i = 0;
    for (const j of this.m_jointList) {
      j.m_index = i;
      ++i;
    }

    // First pass on joints, skip gear joints.
    for (const j of this.m_jointList) {
      if (j.m_type === b2JointType.e_gearJoint) {
        continue;
      }

      log("{\n");
      j.Dump(log);
      log("}\n");
    }

    // Second pass on joints, only gear joints.
    for (const j of this.m_jointList) {
      if (j.m_type !== b2JointType.e_gearJoint) {
        continue;
      }

      log("{\n");
      j.Dump(log);
      log("}\n");
    }
  }

  private static DrawJoint_s_p1: b2Vec2 = new b2Vec2();
  private static DrawJoint_s_p2: b2Vec2 = new b2Vec2();
  private static DrawJoint_s_color: b2Color = new b2Color(0.5, 0.8, 0.8);
  public DrawJoint(joint: b2Joint): void {
    if (this.m_debugDraw === null) {
      return;
    }
    const bodyA: b2Body = joint.GetBodyA();
    const bodyB: b2Body = joint.GetBodyB();
    const xf1: b2Transform = bodyA.m_xf;
    const xf2: b2Transform = bodyB.m_xf;
    const x1: b2Vec2 = xf1.p;
    const x2: b2Vec2 = xf2.p;
    const p1: b2Vec2 = joint.GetAnchorA(b2World.DrawJoint_s_p1);
    const p2: b2Vec2 = joint.GetAnchorB(b2World.DrawJoint_s_p2);

    const color: b2Color = b2World.DrawJoint_s_color.SetRGB(0.5, 0.8, 0.8);

    switch (joint.m_type) {
    case b2JointType.e_distanceJoint:
      this.m_debugDraw.DrawSegment(p1, p2, color);
      break;

    case b2JointType.e_pulleyJoint: {
        const pulley: b2PulleyJoint = joint as b2PulleyJoint;
        const s1: b2Vec2 = pulley.GetGroundAnchorA();
        const s2: b2Vec2 = pulley.GetGroundAnchorB();
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

  public DrawShape(fixture: b2Fixture, color: b2Color): void {
    if (this.m_debugDraw === null) {
      return;
    }
    const shape: b2Shape = fixture.GetShape();

    switch (shape.m_type) {
    case b2ShapeType.e_circleShape: {
        const circle: b2CircleShape = shape as b2CircleShape;
        const center: b2Vec2 = circle.m_p;
        const radius: number = circle.m_radius;
        const axis: b2Vec2 = b2Vec2.UNITX;
        this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
      }
                                    break;

    case b2ShapeType.e_edgeShape: {
        const edge: b2EdgeShape = shape as b2EdgeShape;
        const v1: b2Vec2 = edge.m_vertex1;
        const v2: b2Vec2 = edge.m_vertex2;
        this.m_debugDraw.DrawSegment(v1, v2, color);
      }
                                  break;

    case b2ShapeType.e_chainShape: {
        const chain: b2ChainShape = shape as b2ChainShape;
        const count: number = chain.m_count;
        const vertices: b2Vec2[] = chain.m_vertices;
        let v1: b2Vec2 = vertices[0];
        this.m_debugDraw.DrawCircle(v1, 0.05, color);
        for (let i: number = 1; i < count; ++i) {
          const v2: b2Vec2 = vertices[i];
          this.m_debugDraw.DrawSegment(v1, v2, color);
          this.m_debugDraw.DrawCircle(v2, 0.05, color);
          v1 = v2;
        }
      }
                                   break;

    case b2ShapeType.e_polygonShape: {
        const poly: b2PolygonShape = shape as b2PolygonShape;
        const vertexCount: number = poly.m_count;
        const vertices: b2Vec2[] = poly.m_vertices;
        this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
      }
                                     break;
    }
  }

  public Solve(step: b2TimeStep): void {
    // #if B2_ENABLE_PARTICLE
    // update previous transforms
    for (const b of this.m_bodyList) {
      b.m_xf0.Copy(b.m_xf);
    }
    // #endif

    // #if B2_ENABLE_CONTROLLER
    // @see b2Controller list
    for (const controller of this.m_controllerList) {
      controller.Step(step);
    }
    // #endif

    this.m_profile.solveInit = 0;
    this.m_profile.solveVelocity = 0;
    this.m_profile.solvePosition = 0;

    // Size the island for the worst case.
    const island: b2Island = this.m_island;
    island.Initialize(this.m_bodyList.size,
      this.m_contactManager.m_contactList.size,
      this.m_jointList.size,
      null, // this.m_stackAllocator,
      this.m_contactManager.m_contactListener);

    // Clear all the island flags.
    for (const b of this.m_bodyList) {
      b.m_islandFlag = false;
    }
    for (const c of this.m_contactManager.m_contactList) {
      c.m_islandFlag = false;
    }
    for (const j of this.m_jointList) {
      j.m_islandFlag = false;
    }

    // Build and simulate all awake islands.
    // DEBUG: const stackSize: number = this.m_bodyList.size;
    const stack: Array<b2Body | null> = this.s_stack;
    for (const seed of this.m_bodyList) {
      if (seed.m_islandFlag) {
        continue;
      }

      if (!seed.IsAwake() || !seed.IsActive()) {
        continue;
      }

      // The seed can be dynamic or kinematic.
      if (seed.GetType() === b2BodyType.b2_staticBody) {
        continue;
      }

      // Reset island and stack.
      island.Clear();
      let stackCount: number = 0;
      stack[stackCount++] = seed;
      seed.m_islandFlag = true;

      // Perform a depth first search (DFS) on the constraint graph.
      while (stackCount > 0) {
        // Grab the next body off the stack and add it to the island.
        const b: b2Body | null = stack[--stackCount];
        if (!b) { throw new Error(); }
        // DEBUG: b2Assert(b.IsActive());
        island.AddBody(b);

        // Make sure the body is awake.
        b.SetAwake(true);

        // To keep islands as small as possible, we don't
        // propagate islands across static bodies.
        if (b.GetType() === b2BodyType.b2_staticBody) {
          continue;
        }

        // Search all contacts connected to this body.
        for (const contact of b.GetContactList()) {
          // Has this contact already been added to an island?
          if (contact.m_islandFlag) {
            continue;
          }

          // Is this contact solid and touching?
          if (!contact.IsEnabled() || !contact.IsTouching()) {
            continue;
          }

          // Skip sensors.
          const sensorA: boolean = contact.m_fixtureA.m_isSensor;
          const sensorB: boolean = contact.m_fixtureB.m_isSensor;
          if (sensorA || sensorB) {
            continue;
          }

          island.AddContact(contact);
          contact.m_islandFlag = true;

          const other: b2Body = contact.GetOtherBody(b);

          // Was the other body already added to this island?
          if (other.m_islandFlag) {
            continue;
          }

          // DEBUG: b2Assert(stackCount < stackSize);
          stack[stackCount++] = other;
          other.m_islandFlag = true;
        }

        // Search all joints connect to this body.
        for (const joint of b.GetJointList()) {
          if (joint.m_islandFlag) {
            continue;
          }

          const other: b2Body = joint.GetOtherBody(b);

          // Don't simulate joints connected to inactive bodies.
          if (!other.IsActive()) {
            continue;
          }

          island.AddJoint(joint);
          joint.m_islandFlag = true;

          if (other.m_islandFlag) {
            continue;
          }

          // DEBUG: b2Assert(stackCount < stackSize);
          stack[stackCount++] = other;
          other.m_islandFlag = true;
        }
      }

      const profile: b2Profile = new b2Profile();
      island.Solve(profile, step, this.m_gravity, this.m_allowSleep);
      this.m_profile.solveInit += profile.solveInit;
      this.m_profile.solveVelocity += profile.solveVelocity;
      this.m_profile.solvePosition += profile.solvePosition;

      // Post solve cleanup.
      for (let i: number = 0; i < island.m_bodyCount; ++i) {
        // Allow static bodies to participate in other islands.
        const b: b2Body = island.m_bodies[i];
        if (b.GetType() === b2BodyType.b2_staticBody) {
          b.m_islandFlag = false;
        }
      }
    }

    for (let i: number = 0; i < stack.length; ++i) {
      if (!stack[i]) { break; }
      stack[i] = null;
    }

    const timer: b2Timer = new b2Timer();

    // Synchronize fixtures, check for out of range bodies.
    for (const b of this.m_bodyList) {
      // If a body was not in an island then it did not move.
      if (!b.m_islandFlag) {
        continue;
      }

      if (b.GetType() === b2BodyType.b2_staticBody) {
        continue;
      }

      // Update fixtures (for broad-phase).
      b.SynchronizeFixtures();
    }

    // Look for new contacts.
    this.m_contactManager.FindNewContacts();
    this.m_profile.broadphase = timer.GetMilliseconds();
  }

  private static SolveTOI_s_subStep = new b2TimeStep();
  private static SolveTOI_s_backup = new b2Sweep();
  private static SolveTOI_s_backup1 = new b2Sweep();
  private static SolveTOI_s_backup2 = new b2Sweep();
  private static SolveTOI_s_toi_input = new b2TOIInput();
  private static SolveTOI_s_toi_output = new b2TOIOutput();
  public SolveTOI(step: b2TimeStep): void {
    // b2Island island(2 * b2_maxTOIContacts, b2_maxTOIContacts, 0, &m_stackAllocator, m_contactManager.m_contactListener);
    const island: b2Island = this.m_island;
    island.Initialize(2 * b2_maxTOIContacts, b2_maxTOIContacts, 0, null, this.m_contactManager.m_contactListener);

    if (this.m_stepComplete) {
      for (const b of this.m_bodyList) {
        b.m_islandFlag = false;
        b.m_sweep.alpha0 = 0;
      }

      for (const c of this.m_contactManager.m_contactList) {
        // Invalidate TOI
        c.m_toiFlag = false;
        c.m_islandFlag = false;
        c.m_toiCount = 0;
        c.m_toi = 1;
      }
    }

    // Find TOI events and solve them.
    for (; ; ) {
      // Find the first TOI.
      let minContact: b2Contact | null = null;
      let minAlpha: number = 1;

      for (const c of this.m_contactManager.m_contactList) {
        // Is this contact disabled?
        if (!c.IsEnabled()) {
          continue;
        }

        // Prevent excessive sub-stepping.
        if (c.m_toiCount > b2_maxSubSteps) {
          continue;
        }

        let alpha: number = 1;
        if (c.m_toiFlag) {
          // This contact has a valid cached TOI.
          alpha = c.m_toi;
        } else {
          const fA: b2Fixture = c.GetFixtureA();
          const fB: b2Fixture = c.GetFixtureB();

          // Is there a sensor?
          if (fA.IsSensor() || fB.IsSensor()) {
            continue;
          }

          const bA: b2Body = fA.GetBody();
          const bB: b2Body = fB.GetBody();

          const typeA: b2BodyType = bA.m_type;
          const typeB: b2BodyType = bB.m_type;
          // DEBUG: b2Assert(typeA !== b2BodyType.b2_staticBody || typeB !== b2BodyType.b2_staticBody);

          const activeA: boolean = bA.IsAwake() && typeA !== b2BodyType.b2_staticBody;
          const activeB: boolean = bB.IsAwake() && typeB !== b2BodyType.b2_staticBody;

          // Is at least one body active (awake and dynamic or kinematic)?
          if (!activeA && !activeB) {
            continue;
          }

          const collideA: boolean = bA.IsBullet() || typeA !== b2BodyType.b2_dynamicBody;
          const collideB: boolean = bB.IsBullet() || typeB !== b2BodyType.b2_dynamicBody;

          // Are these two non-bullet dynamic bodies?
          if (!collideA && !collideB) {
            continue;
          }

          // Compute the TOI for this contact.
          // Put the sweeps onto the same time interval.
          let alpha0: number = bA.m_sweep.alpha0;

          if (bA.m_sweep.alpha0 < bB.m_sweep.alpha0) {
            alpha0 = bB.m_sweep.alpha0;
            bA.m_sweep.Advance(alpha0);
          } else if (bB.m_sweep.alpha0 < bA.m_sweep.alpha0) {
            alpha0 = bA.m_sweep.alpha0;
            bB.m_sweep.Advance(alpha0);
          }

          // DEBUG: b2Assert(alpha0 < 1);

          const indexA: number = c.GetChildIndexA();
          const indexB: number = c.GetChildIndexB();

          // Compute the time of impact in interval [0, minTOI]
          const input: b2TOIInput = b2World.SolveTOI_s_toi_input;
          input.proxyA.SetShape(fA.GetShape(), indexA);
          input.proxyB.SetShape(fB.GetShape(), indexB);
          input.sweepA.Copy(bA.m_sweep);
          input.sweepB.Copy(bB.m_sweep);
          input.tMax = 1;

          const output: b2TOIOutput = b2World.SolveTOI_s_toi_output;
          b2TimeOfImpact(output, input);

          // Beta is the fraction of the remaining portion of the .
          const beta: number = output.t;
          if (output.state === b2TOIOutputState.e_touching) {
            alpha = b2Min(alpha0 + (1 - alpha0) * beta, 1);
          } else {
            alpha = 1;
          }

          c.m_toi = alpha;
          c.m_toiFlag = true;
        }

        if (alpha < minAlpha) {
          // This is the minimum TOI found so far.
          minContact = c;
          minAlpha = alpha;
        }
      }

      if (minContact === null || 1 - 10 * b2_epsilon < minAlpha) {
        // No more TOI events. Done!
        this.m_stepComplete = true;
        break;
      }

      // Advance the bodies to the TOI.
      const fA: b2Fixture = minContact.GetFixtureA();
      const fB: b2Fixture = minContact.GetFixtureB();
      const bA: b2Body = fA.GetBody();
      const bB: b2Body = fB.GetBody();

      const backup1: b2Sweep = b2World.SolveTOI_s_backup1.Copy(bA.m_sweep);
      const backup2: b2Sweep = b2World.SolveTOI_s_backup2.Copy(bB.m_sweep);

      bA.Advance(minAlpha);
      bB.Advance(minAlpha);

      // The TOI contact likely has some new contact points.
      minContact.Update(this.m_contactManager.m_contactListener);
      minContact.m_toiFlag = false;
      ++minContact.m_toiCount;

      // Is the contact solid?
      if (!minContact.IsEnabled() || !minContact.IsTouching()) {
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

      bA.m_islandFlag = true;
      bB.m_islandFlag = true;
      minContact.m_islandFlag = true;

      // Get contacts on bodyA and bodyB.
      // const bodies: b2Body[] = [bA, bB];
      for (let i: number = 0; i < 2; ++i) {
        const body: b2Body = (i === 0) ? (bA) : (bB); // bodies[i];
        if (body.m_type === b2BodyType.b2_dynamicBody) {
          for (const contact of body.GetContactList()) {
            if (island.m_bodyCount === island.m_bodyCapacity) {
              break;
            }

            if (island.m_contactCount === island.m_contactCapacity) {
              break;
            }

            // Has this contact already been added to the island?
            if (contact.m_islandFlag) {
              continue;
            }

            // Only add static, kinematic, or bullet bodies.
            const other: b2Body = contact.GetOtherBody(body);
            if (other.m_type === b2BodyType.b2_dynamicBody &&
              !body.IsBullet() && !other.IsBullet()) {
              continue;
            }

            // Skip sensors.
            const sensorA: boolean = contact.m_fixtureA.m_isSensor;
            const sensorB: boolean = contact.m_fixtureB.m_isSensor;
            if (sensorA || sensorB) {
              continue;
            }

            // Tentatively advance the body to the TOI.
            const backup: b2Sweep = b2World.SolveTOI_s_backup.Copy(other.m_sweep);
            if (!other.m_islandFlag) {
              other.Advance(minAlpha);
            }

            // Update the contact points
            contact.Update(this.m_contactManager.m_contactListener);

            // Was the contact disabled by the user?
            if (!contact.IsEnabled()) {
              other.m_sweep.Copy(backup);
              other.SynchronizeTransform();
              continue;
            }

            // Are there contact points?
            if (!contact.IsTouching()) {
              other.m_sweep.Copy(backup);
              other.SynchronizeTransform();
              continue;
            }

            // Add the contact to the island
            contact.m_islandFlag = true;
            island.AddContact(contact);

            // Has the other body already been added to the island?
            if (other.m_islandFlag) {
              continue;
            }

            // Add the other body to the island.
            other.m_islandFlag = true;

            if (other.m_type !== b2BodyType.b2_staticBody) {
              other.SetAwake(true);
            }

            island.AddBody(other);
          }
        }
      }

      const subStep: b2TimeStep = b2World.SolveTOI_s_subStep;
      subStep.dt = (1 - minAlpha) * step.dt;
      subStep.inv_dt = 1 / subStep.dt;
      subStep.dtRatio = 1;
      subStep.positionIterations = 20;
      subStep.velocityIterations = step.velocityIterations;
      // #if B2_ENABLE_PARTICLE
      subStep.particleIterations = step.particleIterations;
      // #endif
      subStep.warmStarting = false;
      island.SolveTOI(subStep, bA.m_islandIndex, bB.m_islandIndex);

      // Reset island flags and synchronize broad-phase proxies.
      for (let i: number = 0; i < island.m_bodyCount; ++i) {
        const body: b2Body = island.m_bodies[i];
        body.m_islandFlag = false;

        if (body.m_type !== b2BodyType.b2_dynamicBody) {
          continue;
        }

        body.SynchronizeFixtures();

        // Invalidate all contact TOIs on this displaced body.
        for (const contact of body.GetContactList()) {
          contact.m_toiFlag = false;
          contact.m_islandFlag = false;
        }
      }

      // Commit fixture proxy movements to the broad-phase so that new contacts are created.
      // Also, some contacts can be destroyed.
      this.m_contactManager.FindNewContacts();

      if (this.m_subStepping) {
        this.m_stepComplete = false;
        break;
      }
    }
  }

  // #if B2_ENABLE_CONTROLLER
  public AddController(controller: b2Controller): b2Controller {
    // b2Assert(controller.m_world === null, "Controller can only be a member of one world");
    // controller.m_world = this;
    this.m_controllerList.add(controller);
    return controller;
  }

  public RemoveController(controller: b2Controller): b2Controller {
    // b2Assert(controller.m_world === this, "Controller is not a member of this world");
    this.m_controllerList.delete(controller);
    // delete controller.m_world; // = null;
    return controller;
  }
  // #endif
}
