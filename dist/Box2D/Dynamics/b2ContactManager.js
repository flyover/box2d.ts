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
System.register(["../Collision/b2BroadPhase", "../Collision/b2Collision", "./Contacts/b2ContactFactory", "./b2Body", "./b2WorldCallbacks"], function (exports_1, context_1) {
    "use strict";
    var b2BroadPhase_1, b2Collision_1, b2ContactFactory_1, b2Body_1, b2WorldCallbacks_1, b2ContactManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2BroadPhase_1_1) {
                b2BroadPhase_1 = b2BroadPhase_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            },
            function (b2ContactFactory_1_1) {
                b2ContactFactory_1 = b2ContactFactory_1_1;
            },
            function (b2Body_1_1) {
                b2Body_1 = b2Body_1_1;
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
                    this.m_contactFactory = new b2ContactFactory_1.b2ContactFactory(this.m_allocator);
                }
                // Broad-phase callback.
                AddPair(proxyA, proxyB) {
                    // DEBUG: b2Assert(proxyA instanceof b2FixtureProxy);
                    // DEBUG: b2Assert(proxyB instanceof b2FixtureProxy);
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
                    this.m_broadPhase.UpdatePairs((proxyA, proxyB) => {
                        this.AddPair(proxyA, proxyB);
                    });
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
                        const activeA = bodyA.IsAwake() && bodyA.m_type !== b2Body_1.b2BodyType.b2_staticBody;
                        const activeB = bodyB.IsAwake() && bodyB.m_type !== b2Body_1.b2BodyType.b2_staticBody;
                        // At least one body must be awake and it must be dynamic or kinematic.
                        if (!activeA && !activeB) {
                            c = c.m_next;
                            continue;
                        }
                        const proxyA = fixtureA.m_proxies[indexA].treeNode;
                        const proxyB = fixtureB.m_proxies[indexB].treeNode;
                        const overlap = b2Collision_1.b2TestOverlapAABB(proxyA.aabb, proxyB.aabb);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL0R5bmFtaWNzL2IyQ29udGFjdE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVlGLHVCQUF1QjtZQUN2QixtQkFBQTtnQkFVRTtvQkFUZ0IsaUJBQVksR0FBaUMsSUFBSSwyQkFBWSxFQUFrQixDQUFDO29CQUN6RixrQkFBYSxHQUFxQixJQUFJLENBQUM7b0JBQ3ZDLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO29CQUMzQixvQkFBZSxHQUFvQixrQ0FBZSxDQUFDLGdCQUFnQixDQUFDO29CQUNwRSxzQkFBaUIsR0FBc0Isb0NBQWlCLENBQUMsa0JBQWtCLENBQUM7b0JBQzVFLGdCQUFXLEdBQVEsSUFBSSxDQUFDO29CQUs3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ2pFLENBQUM7Z0JBRUQsd0JBQXdCO2dCQUNqQixPQUFPLENBQUMsTUFBc0IsRUFBRSxNQUFzQjtvQkFDM0QscURBQXFEO29CQUNyRCxxREFBcUQ7b0JBRXJELElBQUksUUFBUSxHQUFjLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0JBQ3pDLElBQUksUUFBUSxHQUFjLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0JBRXpDLElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxVQUFVLENBQUM7b0JBQ3ZDLElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxVQUFVLENBQUM7b0JBRXZDLElBQUksS0FBSyxHQUFXLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDdkMsSUFBSSxLQUFLLEdBQVcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUV2QyxxQ0FBcUM7b0JBQ3JDLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTt3QkFD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