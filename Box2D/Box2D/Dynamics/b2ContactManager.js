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
System.register(["../Collision/b2BroadPhase", "./Contacts/b2ContactFactory", "./b2Body", "./b2WorldCallbacks"], function (exports_1, context_1) {
    "use strict";
    var b2BroadPhase_1, b2ContactFactory_1, b2Body_1, b2WorldCallbacks_1, b2ContactManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2BroadPhase_1_1) {
                b2BroadPhase_1 = b2BroadPhase_1_1;
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
                    this.m_contactList = new Set();
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
                    for (const contact of bodyB.GetContactList()) {
                        if (contact.GetOtherBody(bodyB) === bodyA) {
                            const fA = contact.GetFixtureA();
                            const fB = contact.GetFixtureB();
                            const iA = contact.GetChildIndexA();
                            const iB = contact.GetChildIndexB();
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
                Collide() {
                    // Update awake contacts.
                    for (const c of this.m_contactList) {
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
                            continue;
                        }
                        const proxyA = fixtureA.m_proxies[indexA].treeNode;
                        const proxyB = fixtureB.m_proxies[indexB].treeNode;
                        const overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
                        // Here we destroy contacts that cease to overlap in the broad-phase.
                        if (!overlap) {
                            const cNuke = c;
                            this.Destroy(cNuke);
                            continue;
                        }
                        // The contact persists.
                        c.Update(this.m_contactListener);
                    }
                }
            };
            exports_1("b2ContactManager", b2ContactManager);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29udGFjdE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVdGLHVCQUF1QjtZQUN2QixtQkFBQTtnQkFTRTtvQkFSZ0IsaUJBQVksR0FBaUIsSUFBSSwyQkFBWSxFQUFFLENBQUM7b0JBQ2hELGtCQUFhLEdBQW1CLElBQUksR0FBRyxFQUFhLENBQUM7b0JBQzlELG9CQUFlLEdBQW9CLGtDQUFlLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3BFLHNCQUFpQixHQUFzQixvQ0FBaUIsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDNUUsZ0JBQVcsR0FBUSxJQUFJLENBQUM7b0JBSzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakUsQ0FBQztnQkFFRCx3QkFBd0I7Z0JBQ2pCLE9BQU8sQ0FBQyxNQUFzQixFQUFFLE1BQXNCO29CQUMzRCxxREFBcUQ7b0JBQ3JELHFEQUFxRDtvQkFFckQsSUFBSSxRQUFRLEdBQWMsTUFBTSxDQUFDLE9BQU8sQ0FBQztvQkFDekMsSUFBSSxRQUFRLEdBQWMsTUFBTSxDQUFDLE9BQU8sQ0FBQztvQkFFekMsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFDdkMsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFFdkMsSUFBSSxLQUFLLEdBQVcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN2QyxJQUFJLEtBQUssR0FBVyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRXZDLHFDQUFxQztvQkFDckMsSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO3dCQUNuQixPQUFPO3FCQUNSO29CQUVELHdFQUF3RTtvQkFDeEUsaUNBQWlDO29CQUNq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