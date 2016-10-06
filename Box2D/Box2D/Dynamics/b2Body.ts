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

/// <reference path="../Common/b2Settings.ts"/>
/// <reference path="../Common/b2Math.ts"/>
/// <reference path="../Collision/Shapes/b2Shape.ts"/>
/// <reference path="./b2Fixture.ts"/>
/// <reference path="./b2World.ts"/>
/// <reference path="./Contacts/b2Contact.ts"/>
/// <reference path="./Joints/b2Joint.ts"/>

namespace box2d {

/// The body type.
/// static: zero mass, zero velocity, may be manually moved
/// kinematic: zero mass, non-zero velocity set by user, moved by solver
/// dynamic: positive mass, non-zero velocity determined by forces, moved by solver
export enum b2BodyType {
  b2_unknown = -1,
  b2_staticBody = 0,
  b2_kinematicBody = 1,
  b2_dynamicBody = 2

  // TODO_ERIN
  // b2_bulletBody = 3
}

/// A body definition holds all the data needed to construct a rigid body.
/// You can safely re-use body definitions. Shapes are added to a body after construction.
export class b2BodyDef {
  /// The body type: static, kinematic, or dynamic.
  /// Note: if a dynamic body would have zero mass, the mass is set to one.
  public type: b2BodyType = b2BodyType.b2_staticBody;

  /// The world position of the body. Avoid creating bodies at the origin
  /// since this can lead to many overlapping shapes.
  public position: b2Vec2 = new b2Vec2(0, 0);

  /// The world angle of the body in radians.
  public angle: number = 0;

  /// The linear velocity of the body's origin in world co-ordinates.
  public linearVelocity: b2Vec2 = new b2Vec2(0, 0);

  /// The angular velocity of the body.
  public angularVelocity: number = 0;

  /// Linear damping is use to reduce the linear velocity. The damping parameter
  /// can be larger than 1.0f but the damping effect becomes sensitive to the
  /// time step when the damping parameter is large.
  public linearDamping: number = 0;

  /// Angular damping is use to reduce the angular velocity. The damping parameter
  /// can be larger than 1.0f but the damping effect becomes sensitive to the
  /// time step when the damping parameter is large.
  public angularDamping: number = 0;

  /// Set this flag to false if this body should never fall asleep. Note that
  /// this increases CPU usage.
  public allowSleep: boolean = true;

  /// Is this body initially awake or sleeping?
  public awake: boolean = true;

  /// Should this body be prevented from rotating? Useful for characters.
  public fixedRotation: boolean = false;

  /// Is this a fast moving body that should be prevented from tunneling through
  /// other moving bodies? Note that all bodies are prevented from tunneling through
  /// kinematic and static bodies. This setting is only considered on dynamic bodies.
  /// @warning You should use this flag sparingly since it increases processing time.
  public bullet: boolean = false;

  /// Does this body start out active?
  public active: boolean = true;

  /// Use this to store application specific body data.
  public userData: any = null;

  /// Scale the gravity applied to this body.
  public gravityScale: number = 1;
}

export enum b2BodyFlag {
  e_none = 0,
  e_islandFlag = 0x0001,
  e_awakeFlag = 0x0002,
  e_autoSleepFlag = 0x0004,
  e_bulletFlag = 0x0008,
  e_fixedRotationFlag = 0x0010,
  e_activeFlag = 0x0020,
  e_toiFlag = 0x0040
}

/// A rigid body. These are created via b2World::CreateBody.
export class b2Body {
  public m_type: b2BodyType = b2BodyType.b2_staticBody;

  public m_flags: b2BodyFlag = b2BodyFlag.e_none;

  public m_islandIndex: number = 0;

  public m_xf: b2Transform = new b2Transform();  // the body origin transform
  public m_sweep: b2Sweep = new b2Sweep();    // the swept motion for CCD

  public m_linearVelocity: b2Vec2 = new b2Vec2();
  public m_angularVelocity: number = 0;

  public m_force: b2Vec2 = new b2Vec2;
  public m_torque: number = 0;

  public m_world: b2World = null;
  public m_prev: b2Body = null;
  public m_next: b2Body = null;

  public m_fixtureList: b2Fixture = null;
  public m_fixtureCount: number = 0;

  public m_jointList: b2JointEdge = null;
  public m_contactList: b2ContactEdge = null;

  public m_mass: number = 1;
  public m_invMass: number = 1;

  // Rotational inertia about the center of mass.
  public m_I: number = 0;
  public m_invI: number = 0;

  public m_linearDamping: number = 0;
  public m_angularDamping: number = 0;
  public m_gravityScale: number = 1;

  public m_sleepTime: number = 0;

  public m_userData: any = null;

  // public m_controllerList: b2ControllerEdge = null;
  // public m_controllerCount: number = 0;

  constructor(bd: b2BodyDef, world: b2World) {
    if (ENABLE_ASSERTS) { b2Assert(bd.position.IsValid()); }
    if (ENABLE_ASSERTS) { b2Assert(bd.linearVelocity.IsValid()); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(bd.angle)); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(bd.angularVelocity)); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(bd.gravityScale) && bd.gravityScale >= 0); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(bd.angularDamping) && bd.angularDamping >= 0); }
    if (ENABLE_ASSERTS) { b2Assert(b2IsValid(bd.linearDamping) && bd.linearDamping >= 0); }

    this.m_flags = b2BodyFlag.e_none;

    if (bd.bullet) {
      this.m_flags |= b2BodyFlag.e_bulletFlag;
    }
    if (bd.fixedRotation) {
      this.m_flags |= b2BodyFlag.e_fixedRotationFlag;
    }
    if (bd.allowSleep) {
      this.m_flags |= b2BodyFlag.e_autoSleepFlag;
    }
    if (bd.awake) {
      this.m_flags |= b2BodyFlag.e_awakeFlag;
    }
    if (bd.active) {
      this.m_flags |= b2BodyFlag.e_activeFlag;
    }

    this.m_world = world;

    this.m_xf.p.Copy(bd.position);
    this.m_xf.q.SetAngleRadians(bd.angle);

    this.m_sweep.localCenter.SetZero();
    this.m_sweep.c0.Copy(this.m_xf.p);
    this.m_sweep.c.Copy(this.m_xf.p);
    this.m_sweep.a0 = bd.angle;
    this.m_sweep.a = bd.angle;
    this.m_sweep.alpha0 = 0;

    this.m_linearVelocity.Copy(bd.linearVelocity);
    this.m_angularVelocity = bd.angularVelocity;

    this.m_linearDamping = bd.linearDamping;
    this.m_angularDamping = bd.angularDamping;
    this.m_gravityScale = bd.gravityScale;

    this.m_force.SetZero();
    this.m_torque = 0;

    this.m_sleepTime = 0;

    this.m_type = bd.type;

    if (bd.type === b2BodyType.b2_dynamicBody) {
      this.m_mass = 1;
      this.m_invMass = 1;
    } else {
      this.m_mass = 0;
      this.m_invMass = 0;
    }

    this.m_I = 0;
    this.m_invI = 0;

    this.m_userData = bd.userData;

    this.m_fixtureList = null;
    this.m_fixtureCount = 0;

    // this.m_controllerList = null;
    // this.m_controllerCount = 0;
  }

  /// Creates a fixture and attach it to this body. Use this function if you need
  /// to set some fixture parameters, like friction. Otherwise you can create the
  /// fixture directly from a shape.
  /// If the density is non-zero, this function automatically updates the mass of the body.
  /// Contacts are not created until the next time step.
  /// @param def the fixture definition.
  /// @warning This function is locked during callbacks.
  public CreateFixture(def: b2FixtureDef): b2Fixture {
    if (ENABLE_ASSERTS) { b2Assert(this.m_world.IsLocked() === false); }
    if (this.m_world.IsLocked() === true) {
      return null;
    }

    const fixture: b2Fixture = new b2Fixture();
    fixture.Create(this, def);

    if (this.m_flags & b2BodyFlag.e_activeFlag) {
      const broadPhase: b2BroadPhase = this.m_world.m_contactManager.m_broadPhase;
      fixture.CreateProxies(broadPhase, this.m_xf);
    }

    fixture.m_next = this.m_fixtureList;
    this.m_fixtureList = fixture;
    ++this.m_fixtureCount;

    fixture.m_body = this;

    // Adjust mass properties if needed.
    if (fixture.m_density > 0) {
      this.ResetMassData();
    }

    // Let the world know we have a new fixture. This will cause new contacts
    // to be created at the beginning of the next time step.
    this.m_world.m_flags |= b2WorldFlag.e_newFixture;

    return fixture;
  }

  /// Creates a fixture from a shape and attach it to this body.
  /// This is a convenience function. Use b2FixtureDef if you need to set parameters
  /// like friction, restitution, user data, or filtering.
  /// If the density is non-zero, this function automatically updates the mass of the body.
  /// @param shape the shape to be cloned.
  /// @param density the shape density (set to zero for static bodies).
  /// @warning This function is locked during callbacks.
  private static CreateFixture2_s_def: b2FixtureDef = new b2FixtureDef();
  public CreateFixture2(shape: b2Shape, density: number = 0): b2Fixture {
    const def: b2FixtureDef = b2Body.CreateFixture2_s_def;
    def.shape = shape;
    def.density = density;
    return this.CreateFixture(def);
  }

  /// Destroy a fixture. This removes the fixture from the broad-phase and
  /// destroys all contacts associated with this fixture. This will
  /// automatically adjust the mass of the body if the body is dynamic and the
  /// fixture has positive density.
  /// All fixtures attached to a body are implicitly destroyed when the body is destroyed.
  /// @param fixture the fixture to be removed.
  /// @warning This function is locked during callbacks.
  public DestroyFixture(fixture: b2Fixture): void {
    if (ENABLE_ASSERTS) { b2Assert(this.m_world.IsLocked() === false); }
    if (this.m_world.IsLocked() === true) {
      return;
    }

    if (ENABLE_ASSERTS) { b2Assert(fixture.m_body === this); }

    // Remove the fixture from this body's singly linked list.
    if (ENABLE_ASSERTS) { b2Assert(this.m_fixtureCount > 0); }
    let node: b2Fixture = this.m_fixtureList;
    let ppF: b2Fixture = null;
    let found: boolean = false;
    while (node !== null) {
      if (node === fixture) {
        if (ppF)
          ppF.m_next = fixture.m_next;
        else
          this.m_fixtureList = fixture.m_next;
        found = true;
        break;
      }

      ppF = node;
      node = node.m_next;
    }

    // You tried to remove a shape that is not attached to this body.
    if (ENABLE_ASSERTS) { b2Assert(found); }

    // Destroy any contacts associated with the fixture.
    let edge: b2ContactEdge = this.m_contactList;
    while (edge) {
      const c = edge.contact;
      edge = edge.next;

      const fixtureA: b2Fixture = c.GetFixtureA();
      const fixtureB: b2Fixture = c.GetFixtureB();

      if (fixture === fixtureA || fixture === fixtureB) {
        // This destroys the contact and removes it from
        // this body's contact list.
        this.m_world.m_contactManager.Destroy(c);
      }
    }

    if (this.m_flags & b2BodyFlag.e_activeFlag) {
      const broadPhase: b2BroadPhase = this.m_world.m_contactManager.m_broadPhase;
      fixture.DestroyProxies(broadPhase);
    }

    fixture.Destroy();
    fixture.m_body = null;
    fixture.m_next = null;

    --this.m_fixtureCount;

    // Reset the mass data.
    this.ResetMassData();
  }

  /// Set the position of the body's origin and rotation.
  /// This breaks any contacts and wakes the other bodies.
  /// Manipulating a body's transform may cause non-physical behavior.
  /// @param position the world position of the body's local origin.
  /// @param angle the world rotation in radians.
  public SetTransformVecRadians(position: b2Vec2, angle: number): void {
    this.SetTransformXYRadians(position.x, position.y, angle);
  }

  public SetTransformXYRadians(x: number, y: number, angle: number): void {
    if (ENABLE_ASSERTS) { b2Assert(this.m_world.IsLocked() === false); }
    if (this.m_world.IsLocked() === true) {
      return;
    }

    this.m_xf.q.SetAngleRadians(angle);
    this.m_xf.p.SetXY(x, y);

    b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.a = angle;

    this.m_sweep.c0.Copy(this.m_sweep.c);
    this.m_sweep.a0 = angle;

    const broadPhase: b2BroadPhase = this.m_world.m_contactManager.m_broadPhase;
    for (let f = this.m_fixtureList; f; f = f.m_next) {
      f.Synchronize(broadPhase, this.m_xf, this.m_xf);
    }

    this.m_world.m_contactManager.FindNewContacts();
  }

  public SetTransform(xf: b2Transform): void {
    this.SetTransformVecRadians(xf.p, xf.GetAngleRadians());
  }

  /// Get the body transform for the body's origin.
  /// @return the world transform of the body's origin.
  public GetTransform(): b2Transform {
    return this.m_xf;
  }

  /// Get the world body origin position.
  /// @return the world position of the body's origin.
  public GetPosition(): b2Vec2 {
    return this.m_xf.p;
  }

  public SetPosition(position: b2Vec2): void {
    this.SetTransformVecRadians(position, this.GetAngleRadians());
  }

  public SetPositionXY(x: number, y: number): void {
    this.SetTransformXYRadians(x, y, this.GetAngleRadians());
  }

  /// Get the angle in radians.
  /// @return the current world rotation angle in radians.
  public GetAngleRadians(): number {
    return this.m_sweep.a;
  }

  public SetAngleRadians(angle: number): void {
    this.SetTransformVecRadians(this.GetPosition(), angle);
  }

  /// Get the world position of the center of mass.
  public GetWorldCenter(): b2Vec2 {
    return this.m_sweep.c;
  }

  /// Get the local position of the center of mass.
  public GetLocalCenter(): b2Vec2 {
    return this.m_sweep.localCenter;
  }

  /// Set the linear velocity of the center of mass.
  /// @param v the new linear velocity of the center of mass.
  public SetLinearVelocity(v: b2Vec2): void {
    if (this.m_type === b2BodyType.b2_staticBody) {
      return;
    }

    if (b2DotVV(v, v) > 0) {
      this.SetAwake(true);
    }

    this.m_linearVelocity.Copy(v);
  }

  /// Get the linear velocity of the center of mass.
  /// @return the linear velocity of the center of mass.
  public GetLinearVelocity(): b2Vec2 {
    return this.m_linearVelocity;
  }

  /// Set the angular velocity.
  /// @param omega the new angular velocity in radians/second.
  public SetAngularVelocity(w: number): void {
    if (this.m_type === b2BodyType.b2_staticBody) {
      return;
    }

    if (w * w > 0) {
      this.SetAwake(true);
    }

    this.m_angularVelocity = w;
  }

  /// Get the angular velocity.
  /// @return the angular velocity in radians/second.
  public GetAngularVelocity(): number {
    return this.m_angularVelocity;
  }

  public GetDefinition(bd: b2BodyDef): b2BodyDef {
    bd.type = this.GetType();
    bd.allowSleep = (this.m_flags & b2BodyFlag.e_autoSleepFlag) === b2BodyFlag.e_autoSleepFlag;
    bd.angle = this.GetAngleRadians();
    bd.angularDamping = this.m_angularDamping;
    bd.gravityScale = this.m_gravityScale;
    bd.angularVelocity = this.m_angularVelocity;
    bd.fixedRotation = (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === b2BodyFlag.e_fixedRotationFlag;
    bd.bullet = (this.m_flags & b2BodyFlag.e_bulletFlag) === b2BodyFlag.e_bulletFlag;
    bd.awake = (this.m_flags & b2BodyFlag.e_awakeFlag) === b2BodyFlag.e_awakeFlag;
    bd.linearDamping = this.m_linearDamping;
    bd.linearVelocity.Copy(this.GetLinearVelocity());
    bd.position.Copy(this.GetPosition());
    bd.userData = this.GetUserData();
    return bd;
  }

  /// Apply a force at a world point. If the force is not
  /// applied at the center of mass, it will generate a torque and
  /// affect the angular velocity. This wakes up the body.
  /// @param force the world force vector, usually in Newtons (N).
  /// @param point the world position of the point of application.
  /// @param wake also wake up the body
  public ApplyForce(force, point, wake: boolean = true): void {
    if (this.m_type !== b2BodyType.b2_dynamicBody) {
      return;
    }

    if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
      this.SetAwake(true);
    }

    // Don't accumulate a force if the body is sleeping.
    if (this.m_flags & b2BodyFlag.e_awakeFlag) {
      this.m_force.x += force.x;
      this.m_force.y += force.y;
      this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
    }
  }

  /// Apply a force to the center of mass. This wakes up the body.
  /// @param force the world force vector, usually in Newtons (N).
  /// @param wake also wake up the body
  public ApplyForceToCenter(force, wake: boolean = true): void {
    if (this.m_type !== b2BodyType.b2_dynamicBody) {
      return;
    }

    if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
      this.SetAwake(true);
    }

    // Don't accumulate a force if the body is sleeping.
    if (this.m_flags & b2BodyFlag.e_awakeFlag) {
      this.m_force.x += force.x;
      this.m_force.y += force.y;
    }
  }

  /// Apply a torque. This affects the angular velocity
  /// without affecting the linear velocity of the center of mass.
  /// This wakes up the body.
  /// @param torque about the z-axis (out of the screen), usually in N-m.
  /// @param wake also wake up the body
  public ApplyTorque(torque, wake: boolean = true): void {
    if (this.m_type !== b2BodyType.b2_dynamicBody) {
      return;
    }

    if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
      this.SetAwake(true);
    }

    // Don't accumulate a force if the body is sleeping.
    if (this.m_flags & b2BodyFlag.e_awakeFlag) {
      this.m_torque += torque;
    }
  }

  /// Apply an impulse at a point. This immediately modifies the velocity.
  /// It also modifies the angular velocity if the point of application
  /// is not at the center of mass. This wakes up the body.
  /// @param impulse the world impulse vector, usually in N-seconds or kg-m/s.
  /// @param point the world position of the point of application.
  /// @param wake also wake up the body
  public ApplyLinearImpulse(impulse, point, wake: boolean = true): void {
    if (this.m_type !== b2BodyType.b2_dynamicBody) {
      return;
    }

    if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
      this.SetAwake(true);
    }

    // Don't accumulate a force if the body is sleeping.
    if (this.m_flags & b2BodyFlag.e_awakeFlag) {
      this.m_linearVelocity.x += this.m_invMass * impulse.x;
      this.m_linearVelocity.y += this.m_invMass * impulse.y;
      this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
    }
  }

  /// Apply an angular impulse.
  /// @param impulse the angular impulse in units of kg*m*m/s
  /// @param wake also wake up the body
  public ApplyAngularImpulse(impulse, wake: boolean = true): void {
    if (this.m_type !== b2BodyType.b2_dynamicBody) {
      return;
    }

    if (wake && (this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
      this.SetAwake(true);
    }

    // Don't accumulate a force if the body is sleeping.
    if (this.m_flags & b2BodyFlag.e_awakeFlag) {
      this.m_angularVelocity += this.m_invI * impulse;
    }
  }

  /// Get the total mass of the body.
  /// @return the mass, usually in kilograms (kg).
  public GetMass(): number {
    return this.m_mass;
  }

  /// Get the rotational inertia of the body about the local origin.
  /// @return the rotational inertia, usually in kg-m^2.
  public GetInertia(): number {
    return this.m_I + this.m_mass * b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
  }

  /// Get the mass data of the body.
  /// @return a struct containing the mass, inertia and center of the body.
  public GetMassData(data: b2MassData): b2MassData {
    data.mass = this.m_mass;
    data.I = this.m_I + this.m_mass * b2DotVV(this.m_sweep.localCenter, this.m_sweep.localCenter);
    data.center.Copy(this.m_sweep.localCenter);
    return data;
  }

  /// Set the mass properties to override the mass properties of the fixtures.
  /// Note that this changes the center of mass position.
  /// Note that creating or destroying fixtures can also alter the mass.
  /// This function has no effect if the body isn't dynamic.
  /// @param massData the mass properties.
  private static SetMassData_s_oldCenter: b2Vec2 = new b2Vec2();
  public SetMassData(massData: b2MassData): void {
    if (ENABLE_ASSERTS) { b2Assert(this.m_world.IsLocked() === false); }
    if (this.m_world.IsLocked() === true) {
      return;
    }

    if (this.m_type !== b2BodyType.b2_dynamicBody) {
      return;
    }

    this.m_invMass = 0;
    this.m_I = 0;
    this.m_invI = 0;

    this.m_mass = massData.mass;
    if (this.m_mass <= 0) {
      this.m_mass = 1;
    }

    this.m_invMass = 1 / this.m_mass;

    if (massData.I > 0 && (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === 0) {
      this.m_I = massData.I - this.m_mass * b2DotVV(massData.center, massData.center);
      if (ENABLE_ASSERTS) { b2Assert(this.m_I > 0); }
      this.m_invI = 1 / this.m_I;
    }

    // Move center of mass.
    const oldCenter: b2Vec2 = b2Body.SetMassData_s_oldCenter.Copy(this.m_sweep.c);
    this.m_sweep.localCenter.Copy(massData.center);
    b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.c0.Copy(this.m_sweep.c);

    // Update center of mass velocity.
    b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2SubVV(this.m_sweep.c, oldCenter, b2Vec2.s_t0), this.m_linearVelocity);
  }

  /// This resets the mass properties to the sum of the mass properties of the fixtures.
  /// This normally does not need to be called unless you called SetMassData to override
  /// the mass and you later want to reset the mass.
  private static ResetMassData_s_localCenter: b2Vec2 = new b2Vec2();
  private static ResetMassData_s_oldCenter: b2Vec2 = new b2Vec2();
  private static ResetMassData_s_massData: b2MassData = new b2MassData();
  public ResetMassData(): void {
    // Compute mass data from shapes. Each shape has its own density.
    this.m_mass = 0;
    this.m_invMass = 0;
    this.m_I = 0;
    this.m_invI = 0;
    this.m_sweep.localCenter.SetZero();

    // Static and kinematic bodies have zero mass.
    if (this.m_type === b2BodyType.b2_staticBody || this.m_type === b2BodyType.b2_kinematicBody) {
      this.m_sweep.c0.Copy(this.m_xf.p);
      this.m_sweep.c.Copy(this.m_xf.p);
      this.m_sweep.a0 = this.m_sweep.a;
      return;
    }

    if (ENABLE_ASSERTS) { b2Assert(this.m_type === b2BodyType.b2_dynamicBody); }

    // Accumulate mass over all fixtures.
    const localCenter: b2Vec2 = b2Body.ResetMassData_s_localCenter.SetZero();
    for (let f = this.m_fixtureList; f; f = f.m_next) {
      if (f.m_density === 0) {
        continue;
      }

      const massData: b2MassData = f.GetMassData(b2Body.ResetMassData_s_massData);
      this.m_mass += massData.mass;
      localCenter.x += massData.center.x * massData.mass;
      localCenter.y += massData.center.y * massData.mass;
      this.m_I += massData.I;
    }

    // Compute center of mass.
    if (this.m_mass > 0) {
      this.m_invMass = 1 / this.m_mass;
      localCenter.x *= this.m_invMass;
      localCenter.y *= this.m_invMass;
    } else {
      // Force all dynamic bodies to have a positive mass.
      this.m_mass = 1;
      this.m_invMass = 1;
    }

    if (this.m_I > 0 && (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === 0) {
      // Center the inertia about the center of mass.
      this.m_I -= this.m_mass * b2DotVV(localCenter, localCenter);
      if (ENABLE_ASSERTS) { b2Assert(this.m_I > 0); }
      this.m_invI = 1 / this.m_I;
    } else {
      this.m_I = 0;
      this.m_invI = 0;
    }

    // Move center of mass.
    const oldCenter: b2Vec2 = b2Body.ResetMassData_s_oldCenter.Copy(this.m_sweep.c);
    this.m_sweep.localCenter.Copy(localCenter);
    b2MulXV(this.m_xf, this.m_sweep.localCenter, this.m_sweep.c);
    this.m_sweep.c0.Copy(this.m_sweep.c);

    // Update center of mass velocity.
    b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2SubVV(this.m_sweep.c, oldCenter, b2Vec2.s_t0), this.m_linearVelocity);
  }

  /// Get the world coordinates of a point given the local coordinates.
  /// @param localPoint a point on the body measured relative the the body's origin.
  /// @return the same point expressed in world coordinates.
  public GetWorldPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2 {
    return b2MulXV(this.m_xf, localPoint, out);
  }

  /// Get the world coordinates of a vector given the local coordinates.
  /// @param localVector a vector fixed in the body.
  /// @return the same vector expressed in world coordinates.
  public GetWorldVector(localVector: b2Vec2, out: b2Vec2): b2Vec2 {
    return b2MulRV(this.m_xf.q, localVector, out);
  }

  /// Gets a local point relative to the body's origin given a world point.
  /// @param a point in world coordinates.
  /// @return the corresponding local point relative to the body's origin.
  public GetLocalPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2 {
    return b2MulTXV(this.m_xf, worldPoint, out);
  }

  /// Gets a local vector given a world vector.
  /// @param a vector in world coordinates.
  /// @return the corresponding local vector.
  public GetLocalVector(worldVector: b2Vec2, out: b2Vec2): b2Vec2 {
    return b2MulTRV(this.m_xf.q, worldVector, out);
  }

  /// Get the world linear velocity of a world point attached to this body.
  /// @param a point in world coordinates.
  /// @return the world velocity of a point.
  public GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2 {
    return b2AddVCrossSV(this.m_linearVelocity, this.m_angularVelocity, b2SubVV(worldPoint, this.m_sweep.c, b2Vec2.s_t0), out);
  }

  /// Get the world velocity of a local point.
  /// @param a point in local coordinates.
  /// @return the world velocity of a point.
  public GetLinearVelocityFromLocalPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2 {
    return this.GetLinearVelocityFromWorldPoint(this.GetWorldPoint(localPoint, out), out);
  }

  /// Get the linear damping of the body.
  public GetLinearDamping(): number {
    return this.m_linearDamping;
  }

  /// Set the linear damping of the body.
  public SetLinearDamping(linearDamping: number): void {
    this.m_linearDamping = linearDamping;
  }

  /// Get the angular damping of the body.
  public GetAngularDamping(): number {
    return this.m_angularDamping;
  }

  /// Set the angular damping of the body.
  public SetAngularDamping(angularDamping: number): void {
    this.m_angularDamping = angularDamping;
  }

  /// Get the gravity scale of the body.
  public GetGravityScale(): number {
    return this.m_gravityScale;
  }

  /// Set the gravity scale of the body.
  public SetGravityScale(scale: number): void {
    this.m_gravityScale = scale;
  }

  /// Set the type of this body. This may alter the mass and velocity.
  public SetType(type: b2BodyType): void {
    if (ENABLE_ASSERTS) { b2Assert(this.m_world.IsLocked() === false); }
    if (this.m_world.IsLocked() === true) {
      return;
    }

    if (this.m_type === type) {
      return;
    }

    this.m_type = type;

    this.ResetMassData();

    if (this.m_type === b2BodyType.b2_staticBody) {
      this.m_linearVelocity.SetZero();
      this.m_angularVelocity = 0;
      this.m_sweep.a0 = this.m_sweep.a;
      this.m_sweep.c0.Copy(this.m_sweep.c);
      this.SynchronizeFixtures();
    }

    this.SetAwake(true);

    this.m_force.SetZero();
    this.m_torque = 0;

    // Delete the attached contacts.
    let ce: b2ContactEdge = this.m_contactList;
    while (ce) {
      const ce0: b2ContactEdge = ce;
      ce = ce.next;
      this.m_world.m_contactManager.Destroy(ce0.contact);
    }
    this.m_contactList = null;

    // Touch the proxies so that new contacts will be created (when appropriate)
    const broadPhase: b2BroadPhase = this.m_world.m_contactManager.m_broadPhase;
    for (let f: b2Fixture = this.m_fixtureList; f; f = f.m_next) {
      const proxyCount: number = f.m_proxyCount;
      for (let i: number = 0; i < proxyCount; ++i) {
        broadPhase.TouchProxy(f.m_proxies[i].proxy);
      }
    }
  }

  /// Get the type of this body.
  public GetType(): b2BodyType {
    return this.m_type;
  }

  /// Should this body be treated like a bullet for continuous collision detection?
  public SetBullet(flag: boolean): void {
    if (flag) {
      this.m_flags |= b2BodyFlag.e_bulletFlag;
    } else {
      this.m_flags &= ~b2BodyFlag.e_bulletFlag;
    }
  }

  /// Is this body treated like a bullet for continuous collision detection?
  public IsBullet(): boolean {
    return (this.m_flags & b2BodyFlag.e_bulletFlag) === b2BodyFlag.e_bulletFlag;
  }

  /// You can disable sleeping on this body. If you disable sleeping, the
  /// body will be woken.
  public SetSleepingAllowed(flag: boolean): void {
    if (flag) {
      this.m_flags |= b2BodyFlag.e_autoSleepFlag;
    } else {
      this.m_flags &= ~b2BodyFlag.e_autoSleepFlag;
      this.SetAwake(true);
    }
  }

  /// Is this body allowed to sleep
  public IsSleepingAllowed(): boolean {
    return (this.m_flags & b2BodyFlag.e_autoSleepFlag) === b2BodyFlag.e_autoSleepFlag;
  }

  /// Set the sleep state of the body. A sleeping body has very
  /// low CPU cost.
  /// @param flag set to true to wake the body, false to put it to sleep.
  public SetAwake(flag: boolean): void {
    if (flag) {
      if ((this.m_flags & b2BodyFlag.e_awakeFlag) === 0) {
        this.m_flags |= b2BodyFlag.e_awakeFlag;
        this.m_sleepTime = 0;
      }
    } else {
      this.m_flags &= ~b2BodyFlag.e_awakeFlag;
      this.m_sleepTime = 0;
      this.m_linearVelocity.SetZero();
      this.m_angularVelocity = 0;
      this.m_force.SetZero();
      this.m_torque = 0;
    }
  }

  /// Get the sleeping state of this body.
  /// @return true if the body is sleeping.
  public IsAwake(): boolean {
    return (this.m_flags & b2BodyFlag.e_awakeFlag) === b2BodyFlag.e_awakeFlag;
  }

  /// Set the active state of the body. An inactive body is not
  /// simulated and cannot be collided with or woken up.
  /// If you pass a flag of true, all fixtures will be added to the
  /// broad-phase.
  /// If you pass a flag of false, all fixtures will be removed from
  /// the broad-phase and all contacts will be destroyed.
  /// Fixtures and joints are otherwise unaffected. You may continue
  /// to create/destroy fixtures and joints on inactive bodies.
  /// Fixtures on an inactive body are implicitly inactive and will
  /// not participate in collisions, ray-casts, or queries.
  /// Joints connected to an inactive body are implicitly inactive.
  /// An inactive body is still owned by a b2World object and remains
  /// in the body list.
  public SetActive(flag: boolean): void {
    if (ENABLE_ASSERTS) { b2Assert(this.m_world.IsLocked() === false); }

    if (flag === this.IsActive()) {
      return;
    }

    if (flag) {
      this.m_flags |= b2BodyFlag.e_activeFlag;

      // Create all proxies.
      const broadPhase: b2BroadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (let f: b2Fixture = this.m_fixtureList; f; f = f.m_next) {
        f.CreateProxies(broadPhase, this.m_xf);
      }

      // Contacts are created the next time step.
    } else {
      this.m_flags &= ~b2BodyFlag.e_activeFlag;

      // Destroy all proxies.
      const broadPhase: b2BroadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (let f: b2Fixture = this.m_fixtureList; f; f = f.m_next) {
        f.DestroyProxies(broadPhase);
      }

      // Destroy the attached contacts.
      let ce: b2ContactEdge = this.m_contactList;
      while (ce) {
        const ce0: b2ContactEdge = ce;
        ce = ce.next;
        this.m_world.m_contactManager.Destroy(ce0.contact);
      }
      this.m_contactList = null;
    }
  }

  /// Get the active state of the body.
  public IsActive(): boolean {
    return (this.m_flags & b2BodyFlag.e_activeFlag) === b2BodyFlag.e_activeFlag;
  }

  /// Set this body to have fixed rotation. This causes the mass
  /// to be reset.
  public SetFixedRotation(flag: boolean): void {
    const status: boolean = (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === b2BodyFlag.e_fixedRotationFlag;
    if (status === flag) {
      return;
    }

    if (flag) {
      this.m_flags |= b2BodyFlag.e_fixedRotationFlag;
    } else {
      this.m_flags &= ~b2BodyFlag.e_fixedRotationFlag;
    }

    this.m_angularVelocity = 0;

    this.ResetMassData();
  }

  /// Does this body have fixed rotation?
  public IsFixedRotation(): boolean {
    return (this.m_flags & b2BodyFlag.e_fixedRotationFlag) === b2BodyFlag.e_fixedRotationFlag;
  }

  /// Get the list of all fixtures attached to this body.
  public GetFixtureList(): b2Fixture {
    return this.m_fixtureList;
  }

  /// Get the list of all joints attached to this body.
  public GetJointList(): b2JointEdge {
    return this.m_jointList;
  }

  /// Get the list of all contacts attached to this body.
  /// @warning this list changes during the time step and you may
  /// miss some collisions if you don't use b2ContactListener.
  public GetContactList(): b2ContactEdge {
    return this.m_contactList;
  }

  /// Get the next body in the world's body list.
  public GetNext(): b2Body {
    return this.m_next;
  }

  /// Get the user data pointer that was provided in the body definition.
  public GetUserData(): any {
    return this.m_userData;
  }

  /// Set the user data. Use this to store your application specific data.
  public SetUserData(data: any): void {
    this.m_userData = data;
  }

  /// Get the parent world of this body.
  public GetWorld(): b2World {
    return this.m_world;
  }

  /// Dump this body to a log file
  public Dump(): void {
    if (DEBUG) {
      const bodyIndex: number = this.m_islandIndex;

      b2Log("{\n");
      b2Log("  const bd: b2BodyDef = new b2BodyDef();\n");
      let type_str: string = "";
      switch (this.m_type) {
      case b2BodyType.b2_staticBody:
        type_str = "b2BodyType.b2_staticBody";
        break;
      case b2BodyType.b2_kinematicBody:
        type_str = "b2BodyType.b2_kinematicBody";
        break;
      case b2BodyType.b2_dynamicBody:
        type_str = "b2BodyType.b2_dynamicBody";
        break;
      default:
        if (ENABLE_ASSERTS) { b2Assert(false); }
        break;
      }
      b2Log("  bd.type = %s;\n", type_str);
      b2Log("  bd.position.SetXY(%.15f, %.15f);\n", this.m_xf.p.x, this.m_xf.p.y);
      b2Log("  bd.angle = %.15f;\n", this.m_sweep.a);
      b2Log("  bd.linearVelocity.SetXY(%.15f, %.15f);\n", this.m_linearVelocity.x, this.m_linearVelocity.y);
      b2Log("  bd.angularVelocity = %.15f;\n", this.m_angularVelocity);
      b2Log("  bd.linearDamping = %.15f;\n", this.m_linearDamping);
      b2Log("  bd.angularDamping = %.15f;\n", this.m_angularDamping);
      b2Log("  bd.allowSleep = %s;\n", (this.m_flags & b2BodyFlag.e_autoSleepFlag) ? ("true") : ("false"));
      b2Log("  bd.awake = %s;\n", (this.m_flags & b2BodyFlag.e_awakeFlag) ? ("true") : ("false"));
      b2Log("  bd.fixedRotation = %s;\n", (this.m_flags & b2BodyFlag.e_fixedRotationFlag) ? ("true") : ("false"));
      b2Log("  bd.bullet = %s;\n", (this.m_flags & b2BodyFlag.e_bulletFlag) ? ("true") : ("false"));
      b2Log("  bd.active = %s;\n", (this.m_flags & b2BodyFlag.e_activeFlag) ? ("true") : ("false"));
      b2Log("  bd.gravityScale = %.15f;\n", this.m_gravityScale);
      b2Log("\n");
      b2Log("  bodies[%d] = this.m_world.CreateBody(bd);\n", this.m_islandIndex);
      b2Log("\n");
      for (let f: b2Fixture = this.m_fixtureList; f; f = f.m_next) {
        b2Log("  {\n");
        f.Dump(bodyIndex);
        b2Log("  }\n");
      }
      b2Log("}\n");
    }
  }

  private static SynchronizeFixtures_s_xf1: b2Transform = new b2Transform();
  public SynchronizeFixtures(): void {
    const xf1: b2Transform = b2Body.SynchronizeFixtures_s_xf1;
    xf1.q.SetAngleRadians(this.m_sweep.a0);
    b2MulRV(xf1.q, this.m_sweep.localCenter, xf1.p);
    b2SubVV(this.m_sweep.c0, xf1.p, xf1.p);

    const broadPhase: b2BroadPhase = this.m_world.m_contactManager.m_broadPhase;
    for (let f: b2Fixture = this.m_fixtureList; f; f = f.m_next) {
      f.Synchronize(broadPhase, xf1, this.m_xf);
    }
  }

  public SynchronizeTransform(): void {
    this.m_xf.q.SetAngleRadians(this.m_sweep.a);
    b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
    b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
  }

  // This is used to prevent connected bodies from colliding.
  // It may lie, depending on the collideConnected flag.
  public ShouldCollide(other: b2Body): boolean {
    // At least one body should be dynamic.
    if (this.m_type !== b2BodyType.b2_dynamicBody && other.m_type !== b2BodyType.b2_dynamicBody) {
      return false;
    }

    // Does a joint prevent collision?
    for (let jn: b2JointEdge = this.m_jointList; jn; jn = jn.next) {
      if (jn.other === other) {
        if (jn.joint.m_collideConnected === false) {
          return false;
        }
      }
    }

    return true;
  }

  public Advance(alpha: number): void {
    // Advance to the new safe time. This doesn't sync the broad-phase.
    this.m_sweep.Advance(alpha);
    this.m_sweep.c.Copy(this.m_sweep.c0);
    this.m_sweep.a = this.m_sweep.a0;
    this.m_xf.q.SetAngleRadians(this.m_sweep.a);
    b2MulRV(this.m_xf.q, this.m_sweep.localCenter, this.m_xf.p);
    b2SubVV(this.m_sweep.c, this.m_xf.p, this.m_xf.p);
  }

  // public GetControllerList(): b2ControllerEdge
  // {
  //   return this.m_controllerList;
  // }

  // public GetControllerCount(): number
  // {
  //   return this.m_controllerCount;
  // }
}

} // namespace box2d
