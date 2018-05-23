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
System.register(["../Collision/b2BroadPhase", "./Contacts/b2ContactFactory", "./b2WorldCallbacks"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2BroadPhase_1, b2ContactFactory_1, b2WorldCallbacks_1, b2ContactManager;
    return {
        setters: [
            function (b2BroadPhase_1_1) {
                b2BroadPhase_1 = b2BroadPhase_1_1;
            },
            function (b2ContactFactory_1_1) {
                b2ContactFactory_1 = b2ContactFactory_1_1;
            },
            function (b2WorldCallbacks_1_1) {
                b2WorldCallbacks_1 = b2WorldCallbacks_1_1;
            }
        ],
        execute: function () {
            // Delegate of b2World.
            b2ContactManager = class b2ContactManager {
                constructor() {
                    this.m_broadPhase = new b2BroadPhase_1.b2BroadPhase();
                    this.m_contactList = null;
                    this.m_contactCount = 0;
                    this.m_contactFilter = b2WorldCallbacks_1.b2ContactFilter.b2_defaultFilter;
                    this.m_contactListener = b2WorldCallbacks_1.b2ContactListener.b2_defaultListener;
                    this.m_allocator = null;
                    this.m_contactFactory = null;
                    this.m_contactFactory = new b2ContactFactory_1.b2ContactFactory(this.m_allocator);
                }
                // Broad-phase callback.
                AddPair(proxyUserDataA, proxyUserDataB) {
                    ///b2Assert(proxyUserDataA instanceof b2FixtureProxy);
                    ///b2Assert(proxyUserDataB instanceof b2FixtureProxy);
                    const proxyA = proxyUserDataA; // (proxyUserDataA instanceof b2FixtureProxy ? proxyUserDataA : null);
                    const proxyB = proxyUserDataB; // (proxyUserDataB instanceof b2FixtureProxy ? proxyUserDataB : null);
                    let fixtureA = proxyA.fixture;
                    let fixtureB = proxyB.fixture;
                    let indexA = proxyA.childIndex;
                    let indexB = proxyB.childIndex;
                    let bodyA = fixtureA.GetBody();
                    let bodyB = fixtureB.GetBody();
                    // Are the fixtures on the same body?
                    if (bodyA === bodyB) {
                        return;
                    }
                    // TODO_ERIN use a hash table to remove a potential bottleneck when both
                    // bodies have a lot of contacts.
                    // Does a contact already exist?
                    let edge = bodyB.GetContactList();
                    while (edge) {
                        if (edge.other === bodyA) {
                            const fA = edge.contact.GetFixtureA();
                            const fB = edge.contact.GetFixtureB();
                            const iA = edge.contact.GetChildIndexA();
                            const iB = edge.contact.GetChildIndexB();
                            if (fA === fixtureA && fB === fixtureB && iA === indexA && iB === indexB) {
                                // A contact already exists.
                                return;
                            }
                            if (fA === fixtureB && fB === fixtureA && iA === indexB && iB === indexA) {
                                // A contact already exists.
                                return;
                            }
                        }
                        edge = edge.next;
                    }
                    // Check user filtering.
                    if (this.m_contactFilter && !this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
                        return;
                    }
                    // Call the factory.
                    const c = this.m_contactFactory.Create(fixtureA, indexA, fixtureB, indexB);
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
                    c.m_prev = null;
                    c.m_next = this.m_contactList;
                    if (this.m_contactList !== null) {
                        this.m_contactList.m_prev = c;
                    }
                    this.m_contactList = c;
                    // Connect to island graph.
                    // Connect to body A
                    c.m_nodeA.contact = c;
                    c.m_nodeA.other = bodyB;
                    c.m_nodeA.prev = null;
                    c.m_nodeA.next = bodyA.m_contactList;
                    if (bodyA.m_contactList !== null) {
                        bodyA.m_contactList.prev = c.m_nodeA;
                    }
                    bodyA.m_contactList = c.m_nodeA;
                    // Connect to body B
                    c.m_nodeB.contact = c;
                    c.m_nodeB.other = bodyA;
                    c.m_nodeB.prev = null;
                    c.m_nodeB.next = bodyB.m_contactList;
                    if (bodyB.m_contactList !== null) {
                        bodyB.m_contactList.prev = c.m_nodeB;
                    }
                    bodyB.m_contactList = c.m_nodeB;
                    // Wake up the bodies
                    if (!fixtureA.IsSensor() && !fixtureB.IsSensor()) {
                        bodyA.SetAwake(true);
                        bodyB.SetAwake(true);
                    }
                    ++this.m_contactCount;
                }
                FindNewContacts() {
                    this.m_broadPhase.UpdatePairs(this);
                }
                Destroy(c) {
                    const fixtureA = c.GetFixtureA();
                    const fixtureB = c.GetFixtureB();
                    const bodyA = fixtureA.GetBody();
                    const bodyB = fixtureB.GetBody();
                    if (this.m_contactListener && c.IsTouching()) {
                        this.m_contactListener.EndContact(c);
                    }
                    // Remove from the world.
                    if (c.m_prev) {
                        c.m_prev.m_next = c.m_next;
                    }
                    if (c.m_next) {
                        c.m_next.m_prev = c.m_prev;
                    }
                    if (c === this.m_contactList) {
                        this.m_contactList = c.m_next;
                    }
                    // Remove from body 1
                    if (c.m_nodeA.prev) {
                        c.m_nodeA.prev.next = c.m_nodeA.next;
                    }
                    if (c.m_nodeA.next) {
                        c.m_nodeA.next.prev = c.m_nodeA.prev;
                    }
                    if (c.m_nodeA === bodyA.m_contactList) {
                        bodyA.m_contactList = c.m_nodeA.next;
                    }
                    // Remove from body 2
                    if (c.m_nodeB.prev) {
                        c.m_nodeB.prev.next = c.m_nodeB.next;
                    }
                    if (c.m_nodeB.next) {
                        c.m_nodeB.next.prev = c.m_nodeB.prev;
                    }
                    if (c.m_nodeB === bodyB.m_contactList) {
                        bodyB.m_contactList = c.m_nodeB.next;
                    }
                    // Call the factory.
                    this.m_contactFactory.Destroy(c);
                    --this.m_contactCount;
                }
                // This is the top level collision call for the time step. Here
                // all the narrow phase collision is processed for the world
                // contact list.
                Collide() {
                    // Update awake contacts.
                    let c = this.m_contactList;
                    while (c) {
                        const fixtureA = c.GetFixtureA();
                        const fixtureB = c.GetFixtureB();
                        const indexA = c.GetChildIndexA();
                        const indexB = c.GetChildIndexB();
                        const bodyA = fixtureA.GetBody();
                        const bodyB = fixtureB.GetBody();
                        // Is this contact flagged for filtering?
                        if (c.m_filterFlag) {
                            // Check user filtering.
                            if (this.m_contactFilter && !this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
                                const cNuke = c;
                                c = cNuke.m_next;
                                this.Destroy(cNuke);
                                continue;
                            }
                            // Clear the filtering flag.
                            c.m_filterFlag = false;
                        }
                        const activeA = bodyA.IsAwake() && bodyA.m_type !== 0 /* b2_staticBody */;
                        const activeB = bodyB.IsAwake() && bodyB.m_type !== 0 /* b2_staticBody */;
                        // At least one body must be awake and it must be dynamic or kinematic.
                        if (!activeA && !activeB) {
                            c = c.m_next;
                            continue;
                        }
                        const proxyA = fixtureA.m_proxies[indexA].proxy;
                        const proxyB = fixtureB.m_proxies[indexB].proxy;
                        const overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
                        // Here we destroy contacts that cease to overlap in the broad-phase.
                        if (!overlap) {
                            const cNuke = c;
                            c = cNuke.m_next;
                            this.Destroy(cNuke);
                            continue;
                        }
                        // The contact persists.
                        c.Update(this.m_contactListener);
                        c = c.m_next;
                    }
                }
            };
            exports_1("b2ContactManager", b2ContactManager);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29udGFjdE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVVGLHVCQUF1QjtZQUN2QixtQkFBQTtnQkFVRTtvQkFUTyxpQkFBWSxHQUFpQixJQUFJLDJCQUFZLEVBQUUsQ0FBQztvQkFDaEQsa0JBQWEsR0FBYyxJQUFJLENBQUM7b0JBQ2hDLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUMzQixvQkFBZSxHQUFvQixrQ0FBZSxDQUFDLGdCQUFnQixDQUFDO29CQUNwRSxzQkFBaUIsR0FBc0Isb0NBQWlCLENBQUMsa0JBQWtCLENBQUM7b0JBQzVFLGdCQUFXLEdBQVEsSUFBSSxDQUFDO29CQUV4QixxQkFBZ0IsR0FBcUIsSUFBSSxDQUFDO29CQUcvQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ2pFLENBQUM7Z0JBRUQsd0JBQXdCO2dCQUNqQixPQUFPLENBQUMsY0FBbUIsRUFBRSxjQUFtQjtvQkFDckQsc0RBQXNEO29CQUN0RCxzREFBc0Q7b0JBQ3RELE1BQU0sTUFBTSxHQUFtQyxjQUFjLENBQUMsQ0FBQyxzRUFBc0U7b0JBQ3JJLE1BQU0sTUFBTSxHQUFtQyxjQUFjLENBQUMsQ0FBQyxzRUFBc0U7b0JBRXJJLElBQUksUUFBUSxHQUFjLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0JBQ3pDLElBQUksUUFBUSxHQUFjLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0JBRXpDLElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxVQUFVLENBQUM7b0JBQ3ZDLElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxVQUFVLENBQUM7b0JBRXZDLElBQUksS0FBSyxHQUFXLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdkMsSUFB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