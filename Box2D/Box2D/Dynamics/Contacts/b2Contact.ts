/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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

import { b2_linearSlop } from "../../Common/b2Settings";
import { b2Sqrt, b2Transform, b2Sweep } from "../../Common/b2Math";
import { b2Manifold, b2WorldManifold, b2ManifoldPoint, b2ContactID } from "../../Collision/b2Collision";
import { b2TestOverlapShape } from "../../Collision/b2Collision";
import { b2TimeOfImpact, b2TOIInput, b2TOIOutput } from "../../Collision/b2TimeOfImpact";
import { b2Body } from "../b2Body";
import { b2Fixture } from "../b2Fixture";
import { b2Shape } from "../../Collision/Shapes/b2Shape";
import { b2ContactListener } from "../b2WorldCallbacks";

/// Friction mixing law. The idea is to allow either fixture to drive the restitution to zero.
/// For example, anything slides on ice.
export function b2MixFriction(friction1: number, friction2: number): number {
  return b2Sqrt(friction1 * friction2);
}

/// Restitution mixing law. The idea is allow for anything to bounce off an inelastic surface.
/// For example, a superball bounces on anything.
export function b2MixRestitution(restitution1: number, restitution2: number): number {
  return restitution1 > restitution2 ? restitution1 : restitution2;
}

export class b2ContactEdge {
  public other!: b2Body; ///< provides quick access to the other body attached.
  public contact: b2Contact; ///< the contact
  public prev: b2ContactEdge | null = null; ///< the previous contact edge in the body's contact list
  public next: b2ContactEdge | null = null; ///< the next contact edge in the body's contact list
  constructor(contact: b2Contact) {
    this.contact = contact;
  }
}

export abstract class b2Contact {
  public m_islandFlag: boolean = false; /// Used when crawling contact graph when forming islands.
  public m_touchingFlag: boolean = false; /// Set when the shapes are touching.
  public m_enabledFlag: boolean = false; /// This contact can be disabled (by user)
  public m_filterFlag: boolean = false; /// This contact needs filtering because a fixture filter was changed.
  public m_bulletHitFlag: boolean = false; /// This bullet contact had a TOI event
  public m_toiFlag: boolean = false; /// This contact has a valid TOI in m_toi

  public m_prev: b2Contact | null = null;
  public m_next: b2Contact | null = null;

  public readonly m_nodeA: b2ContactEdge; // = new b2ContactEdge(this);
  public readonly m_nodeB: b2ContactEdge; // = new b2ContactEdge(this);

  public m_fixtureA!: b2Fixture;
  public m_fixtureB!: b2Fixture;

  public m_indexA: number = 0;
  public m_indexB: number = 0;

  public m_manifold: b2Manifold = new b2Manifold(); // TODO: readonly

  public m_toiCount: number = 0;
  public m_toi: number = 0;

  public m_friction: number = 0;
  public m_restitution: number = 0;

  public m_tangentSpeed: number = 0;

  public m_oldManifold: b2Manifold = new b2Manifold(); // TODO: readonly

  constructor() {
    this.m_nodeA = new b2ContactEdge(this);
    this.m_nodeB = new b2ContactEdge(this);
  }

  public GetManifold() {
    return this.m_manifold;
  }

  public GetWorldManifold(worldManifold: b2WorldManifold): void {
    const bodyA: b2Body = this.m_fixtureA.GetBody();
    const bodyB: b2Body = this.m_fixtureB.GetBody();
    const shapeA: b2Shape = this.m_fixtureA.GetShape();
    const shapeB: b2Shape = this.m_fixtureB.GetShape();
    worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
  }

  public IsTouching(): boolean {
    return this.m_touchingFlag;
  }

  public SetEnabled(flag: boolean): void {
    this.m_enabledFlag = flag;
  }

  public IsEnabled(): boolean {
    return this.m_enabledFlag;
  }

  public GetNext(): b2Contact | null {
    return this.m_next;
  }

  public GetFixtureA(): b2Fixture {
    return this.m_fixtureA;
  }

  public GetChildIndexA(): number {
    return this.m_indexA;
  }

  public GetFixtureB(): b2Fixture {
    return this.m_fixtureB;
  }

  public GetChildIndexB(): number {
    return this.m_indexB;
  }

  public abstract Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;

  public FlagForFiltering(): void {
    this.m_filterFlag = true;
  }

  public SetFriction(friction: number): void {
    this.m_friction = friction;
  }

  public GetFriction(): number {
    return this.m_friction;
  }

  public ResetFriction(): void {
    this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
  }

  public SetRestitution(restitution: number): void {
    this.m_restitution = restitution;
  }

  public GetRestitution(): number {
    return this.m_restitution;
  }

  public ResetRestitution(): void {
    this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
  }

  public SetTangentSpeed(speed: number): void {
    this.m_tangentSpeed = speed;
  }

  public GetTangentSpeed(): number {
    return this.m_tangentSpeed;
  }

  public Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void {
    this.m_islandFlag = false;
    this.m_touchingFlag = false;
    this.m_enabledFlag = true;
    this.m_filterFlag = false;
    this.m_bulletHitFlag = false;
    this.m_toiFlag = false;

    this.m_fixtureA = fixtureA;
    this.m_fixtureB = fixtureB;

    this.m_indexA = indexA;
    this.m_indexB = indexB;

    this.m_manifold.pointCount = 0;

    this.m_prev = null;
    this.m_next = null;

    delete this.m_nodeA.contact; // = null;
    this.m_nodeA.prev = null;
    this.m_nodeA.next = null;
    delete this.m_nodeA.other; // = null;

    delete this.m_nodeB.contact; // = null;
    this.m_nodeB.prev = null;
    this.m_nodeB.next = null;
    delete this.m_nodeB.other; // = null;

    this.m_toiCount = 0;

    this.m_friction = b2MixFriction(this.m_fixtureA.m_friction, this.m_fixtureB.m_friction);
    this.m_restitution = b2MixRestitution(this.m_fixtureA.m_restitution, this.m_fixtureB.m_restitution);
  }

  public Update(listener: b2ContactListener): void {
    const tManifold: b2Manifold = this.m_oldManifold;
    this.m_oldManifold = this.m_manifold;
    this.m_manifold = tManifold;

    // Re-enable this contact.
    this.m_enabledFlag = true;

    let touching: boolean = false;
    const wasTouching: boolean = this.m_touchingFlag;

    const sensorA: boolean = this.m_fixtureA.IsSensor();
    const sensorB: boolean = this.m_fixtureB.IsSensor();
    const sensor: boolean = sensorA || sensorB;

    const bodyA: b2Body = this.m_fixtureA.GetBody();
    const bodyB: b2Body = this.m_fixtureB.GetBody();
    const xfA: b2Transform = bodyA.GetTransform();
    const xfB: b2Transform = bodyB.GetTransform();

    ///const aabbOverlap = b2TestOverlapAABB(this.m_fixtureA.GetAABB(0), this.m_fixtureB.GetAABB(0));

    // Is this contact a sensor?
    if (sensor) {
      ///if (aabbOverlap)
      ///{
      const shapeA: b2Shape = this.m_fixtureA.GetShape();
      const shapeB: b2Shape = this.m_fixtureB.GetShape();
      touching = b2TestOverlapShape(shapeA, this.m_indexA, shapeB, this.m_indexB, xfA, xfB);
      ///}

      // Sensors don't generate manifolds.
      this.m_manifold.pointCount = 0;
    } else {
      ///if (aabbOverlap)
      ///{
      this.Evaluate(this.m_manifold, xfA, xfB);
      touching = this.m_manifold.pointCount > 0;

      // Match old contact ids to new contact ids and copy the
      // stored impulses to warm start the solver.
      for (let i: number = 0; i < this.m_manifold.pointCount; ++i) {
        const mp2: b2ManifoldPoint = this.m_manifold.points[i];
        mp2.normalImpulse = 0;
        mp2.tangentImpulse = 0;
        const id2: b2ContactID = mp2.id;

        for (let j: number = 0; j < this.m_oldManifold.pointCount; ++j) {
          const mp1: b2ManifoldPoint = this.m_oldManifold.points[j];

          if (mp1.id.key === id2.key) {
            mp2.normalImpulse = mp1.normalImpulse;
            mp2.tangentImpulse = mp1.tangentImpulse;
            break;
          }
        }
      }
      ///}
      ///else
      ///{
      ///  this.m_manifold.pointCount = 0;
      ///}

      if (touching !== wasTouching) {
        bodyA.SetAwake(true);
        bodyB.SetAwake(true);
      }
    }

    this.m_touchingFlag = touching;

    if (!wasTouching && touching && listener) {
      listener.BeginContact(this);
    }

    if (wasTouching && !touching && listener) {
      listener.EndContact(this);
    }

    if (!sensor && touching && listener) {
      listener.PreSolve(this, this.m_oldManifold);
    }
  }

  private static ComputeTOI_s_input = new b2TOIInput();
  private static ComputeTOI_s_output = new b2TOIOutput();
  public ComputeTOI(sweepA: b2Sweep, sweepB: b2Sweep): number {
    const input: b2TOIInput = b2Contact.ComputeTOI_s_input;
    input.proxyA.SetShape(this.m_fixtureA.GetShape(), this.m_indexA);
    input.proxyB.SetShape(this.m_fixtureB.GetShape(), this.m_indexB);
    input.sweepA.Copy(sweepA);
    input.sweepB.Copy(sweepB);
    input.tMax = b2_linearSlop;

    const output: b2TOIOutput = b2Contact.ComputeTOI_s_output;

    b2TimeOfImpact(output, input);

    return output.t;
  }
}
