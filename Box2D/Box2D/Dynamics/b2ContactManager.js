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
System.register(["../Common/b2Settings", "../Collision/b2BroadPhase", "./Contacts/b2ContactFactory", "./b2Body", "./b2WorldCallbacks", "../Collision/b2Collision"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2BroadPhase_1, b2ContactFactory_1, b2Body_1, b2WorldCallbacks_1, b2Collision_1, b2ContactManager;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
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
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            }
        ],
        execute: function () {
            // Delegate of b2World.
            b2ContactManager = class b2ContactManager {
                constructor() {
                    this.m_broadPhase = new b2BroadPhase_1.b2BroadPhase();
                    this.m_contactList = new b2Settings_1.b2List();
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
                    this.m_broadPhase.UpdatePairs((a, b) => {
                        this.AddPair(a, b);
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
                        const overlap = b2Collision_1.b2TestOverlapAABB(proxyA.aabb, proxyB.aabb);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29udGFjdE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQWFGLHVCQUF1QjtZQUN2QixtQkFBQTtnQkFTRTtvQkFSZ0IsaUJBQVksR0FBaUMsSUFBSSwyQkFBWSxFQUFrQixDQUFDO29CQUNoRixrQkFBYSxHQUFzQixJQUFJLG1CQUFNLEVBQWEsQ0FBQztvQkFDcEUsb0JBQWUsR0FBb0Isa0NBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDcEUsc0JBQWlCLEdBQXNCLG9DQUFpQixDQUFDLGtCQUFrQixDQUFDO29CQUM1RSxnQkFBVyxHQUFRLElBQUksQ0FBQztvQkFLN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksbUNBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDO2dCQUVELHdCQUF3QjtnQkFDakIsT0FBTyxDQUFDLE1BQXNCLEVBQUUsTUFBc0I7b0JBQzNELHFEQUFxRDtvQkFDckQscURBQXFEO29CQUVyRCxJQUFJLFFBQVEsR0FBYyxNQUFNLENBQUMsT0FBTyxDQUFDO29CQUN6QyxJQUFJLFFBQVEsR0FBYyxNQUFNLENBQUMsT0FBTyxDQUFDO29CQUV6QyxJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsVUFBVSxDQUFDO29CQUN2QyxJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsVUFBVSxDQUFDO29CQUV2QyxJQUFJLEtBQUssR0FBVyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3ZDLElBQUksS0FBSyxHQUFXLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFdkMscUNBQXFDO29CQUNyQyxJQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7d0JBQ25CLE9BQU87cUJBQ1I7b0JBRUQsd0VBQXdFO29CQUN4RSxpQ0FB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