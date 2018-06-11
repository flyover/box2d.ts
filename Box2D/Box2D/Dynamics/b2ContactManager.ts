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

// DEBUG: import { b2Assert } from "../Common/b2Settings";
import { b2BroadPhase } from "../Collision/b2BroadPhase";
import { b2TreeNode } from "../Collision/b2DynamicTree";
import { b2Contact } from "./Contacts/b2Contact";
import { b2ContactFactory } from "./Contacts/b2ContactFactory";
import { b2Body, b2BodyType } from "./b2Body";
import { b2Fixture, b2FixtureProxy } from "./b2Fixture";
import { b2ContactFilter, b2ContactListener } from "./b2WorldCallbacks";
import { b2TestOverlapAABB } from "../Collision/b2Collision";

// Delegate of b2World.
export class b2ContactManager {
  public readonly m_broadPhase: b2BroadPhase<b2FixtureProxy> = new b2BroadPhase<b2FixtureProxy>();
  public readonly m_contactList: Set<b2Contact> = new Set<b2Contact>();
  public m_contactFilter: b2ContactFilter = b2ContactFilter.b2_defaultFilter;
  public m_contactListener: b2ContactListener = b2ContactListener.b2_defaultListener;
  public m_allocator: any = null;

  public m_contactFactory: b2ContactFactory;

  constructor() {
    this.m_contactFactory = new b2ContactFactory(this.m_allocator);
  }

  // Broad-phase callback.
  public AddPair(proxyA: b2FixtureProxy, proxyB: b2FixtureProxy): void {
    // DEBUG: b2Assert(proxyA instanceof b2FixtureProxy);
    // DEBUG: b2Assert(proxyB instanceof b2FixtureProxy);

    let fixtureA: b2Fixture = proxyA.fixture;
    let fixtureB: b2Fixture = proxyB.fixture;

    let indexA: number = proxyA.childIndex;
    let indexB: number = proxyB.childIndex;

    let bodyA: b2Body = fixtureA.GetBody();
    let bodyB: b2Body = fixtureB.GetBody();

    // Are the fixtures on the same body?
    if (bodyA === bodyB) {
      return;
    }

    // TODO_ERIN use a hash table to remove a potential bottleneck when both
    // bodies have a lot of contacts.
    // Does a contact already exist?
    for (const contact of bodyB.GetContactList()) {
      if (contact.GetOtherBody(bodyB) === bodyA) {
        const fA: b2Fixture = contact.GetFixtureA();
        const fB: b2Fixture = contact.GetFixtureB();
        const iA: number = contact.GetChildIndexA();
        const iB: number = contact.GetChildIndexB();

        if (fA === fixtureA && fB === fixtureB && iA === indexA && iB === indexB) {
          // A contact already exists.
          return;
        }

        if (fA === fixtureB && fB === fixtureA && iA === indexB && iB === indexA) {
          // A contact already exists.
          return;
        }
      }
    }

    // Check user filtering.
    if (this.m_contactFilter && !this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
      return;
    }

    // Call the factory.
    const c: b2Contact | null = this.m_contactFactory.Create(fixtureA, indexA, fixtureB, indexB);
    if (c === null) {
      return;
    }

    // Contact creation may swap fixtures.
    fixtureA = c.GetFixtureA();
    fixtureB = c.GetFixtureB();
    indexA = c.GetChildIndexA();
    indexB = c.GetChildIndexB();
    bodyA = fixtureA.m_body;
    bodyB = fixtureB.m_body;

    // Insert into the world.
    this.m_contactList.add(c);

    // Connect to island graph.

    // Connect to body A
    bodyA.GetContactList().add(c);

    // Connect to body B
    bodyB.GetContactList().add(c);

    // Wake up the bodies
    if (!fixtureA.IsSensor() && !fixtureB.IsSensor()) {
      bodyA.SetAwake(true);
      bodyB.SetAwake(true);
    }
  }

  public FindNewContacts(): void {
    this.m_broadPhase.UpdatePairs((a: b2FixtureProxy, b: b2FixtureProxy): void => {
      this.AddPair(a, b);
    });
  }

  public Destroy(c: b2Contact): void {
    const fixtureA: b2Fixture = c.GetFixtureA();
    const fixtureB: b2Fixture = c.GetFixtureB();
    const bodyA: b2Body = fixtureA.GetBody();
    const bodyB: b2Body = fixtureB.GetBody();

    if (this.m_contactListener && c.IsTouching()) {
      this.m_contactListener.EndContact(c);
    }

    // Remove from the world.
    this.m_contactList.delete(c);

    // Remove from body 1
    bodyA.GetContactList().delete(c);

    // Remove from body 2
    bodyB.GetContactList().delete(c);

    // Call the factory.
    this.m_contactFactory.Destroy(c);
  }

  // This is the top level collision call for the time step. Here
  // all the narrow phase collision is processed for the world
  // contact list.
  public Collide(): void {
    // Update awake contacts.
    for (const c of this.m_contactList) {
      const fixtureA: b2Fixture = c.GetFixtureA();
      const fixtureB: b2Fixture = c.GetFixtureB();
      const indexA: number = c.GetChildIndexA();
      const indexB: number = c.GetChildIndexB();
      const bodyA: b2Body = fixtureA.GetBody();
      const bodyB: b2Body = fixtureB.GetBody();

      // Is this contact flagged for filtering?
      if (c.m_filterFlag) {
        // Check user filtering.
        if (this.m_contactFilter && !this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
          const cNuke: b2Contact = c;
          this.Destroy(cNuke);
          continue;
        }

        // Clear the filtering flag.
        c.m_filterFlag = false;
      }

      const activeA: boolean = bodyA.IsAwake() && bodyA.m_type !== b2BodyType.b2_staticBody;
      const activeB: boolean = bodyB.IsAwake() && bodyB.m_type !== b2BodyType.b2_staticBody;

      // At least one body must be awake and it must be dynamic or kinematic.
      if (!activeA && !activeB) {
        continue;
      }

      const proxyA: b2TreeNode<b2FixtureProxy> = fixtureA.m_proxies[indexA].treeNode;
      const proxyB: b2TreeNode<b2FixtureProxy> = fixtureB.m_proxies[indexB].treeNode;
      const overlap: boolean = b2TestOverlapAABB(proxyA.aabb, proxyB.aabb);

      // Here we destroy contacts that cease to overlap in the broad-phase.
      if (!overlap) {
        const cNuke: b2Contact = c;
        this.Destroy(cNuke);
        continue;
      }

      // The contact persists.
      c.Update(this.m_contactListener);
    }
  }
}
