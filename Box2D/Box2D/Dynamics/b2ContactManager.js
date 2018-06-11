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
                    for (const edge of bodyB.GetContactList()) {
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
                    c.m_nodeA.contact = c;
                    c.m_nodeA.other = bodyB;
                    bodyA.GetContactList().add(c.m_nodeA);
                    // Connect to body B
                    c.m_nodeB.contact = c;
                    c.m_nodeB.other = bodyA;
                    bodyB.GetContactList().add(c.m_nodeB);
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
                    bodyA.GetContactList().delete(c.m_nodeA);
                    // Remove from body 2
                    bodyB.GetContactList().delete(c.m_nodeB);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29udGFjdE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVdGLHVCQUF1QjtZQUN2QixtQkFBQTtnQkFTRTtvQkFSZ0IsaUJBQVksR0FBaUIsSUFBSSwyQkFBWSxFQUFFLENBQUM7b0JBQ2hELGtCQUFhLEdBQW1CLElBQUksR0FBRyxFQUFhLENBQUM7b0JBQzlELG9CQUFlLEdBQW9CLGtDQUFlLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3BFLHNCQUFpQixHQUFzQixvQ0FBaUIsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDNUUsZ0JBQVcsR0FBUSxJQUFJLENBQUM7b0JBSzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDakUsQ0FBQztnQkFFRCx3QkFBd0I7Z0JBQ2pCLE9BQU8sQ0FBQyxNQUFzQixFQUFFLE1BQXNCO29CQUMzRCxxREFBcUQ7b0JBQ3JELHFEQUFxRDtvQkFFckQsSUFBSSxRQUFRLEdBQWMsTUFBTSxDQUFDLE9BQU8sQ0FBQztvQkFDekMsSUFBSSxRQUFRLEdBQWMsTUFBTSxDQUFDLE9BQU8sQ0FBQztvQkFFekMsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFDdkMsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFFdkMsSUFBSSxLQUFLLEdBQVcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUN2QyxJQUFJLEtBQUssR0FBVyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRXZDLHFDQUFxQztvQkFDckMsSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO3dCQUNuQixPQUFPO3FCQUNSO29CQUVELHdFQUF3RTtvQkFDeEUsaUNBQWlDO29CQUNqQyxnQ0FBZ0M7b0JBQ2hDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFO3dCQUN6QyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFOzRCQUN4QixNQUFNLEVBQUUsR0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDOzRCQUNqRCxNQUFNLEVBQUUsR0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDOzRCQUNqRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUNqRCxNQUFNLEVBQUUsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUVqRCxJQUFJLEVBQUUsS0FBSyxRQUFRLElBQUksRUFBRSxLQUFLLFFBQVEsSUFBSSxFQUFFLEtBQUssTUFBTSxJQUFJLEVBQUUsS0FBSyxNQUFNLEVBQUU7Z0NBQ3hFLDRCQUE0QjtnQ0FDNUIsT0FBTzs2QkFDUjs0QkFFRCxJQUFJLEVBQUUsS0FBSyxRQUFRLElBQUksRUFBRSxLQUFLLFFBQVEsSUFBSSxFQUFFLEtBQUssTUFBTSxJQUFJLEVBQUUsS0FBSyxNQUFNLEVBQUU7Z0NBQ3hFLDRCQUE0QjtnQ0FDNUIsT0FBTzs2QkFDUjt5QkFDRjtxQkFDRjtvQkFFRCx3QkFBd0I7b0JBQ3hCLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTt3QkFDbkYsT0FBTztxQkFDUjtvQkFFRCxvQkFBb0I7b0JBQ3BCLE1BQU0sQ0FBQyxHQUFxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUM3RixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7d0JBQ2QsT0FBTztxQkFDUjtvQkFFRCxzQ0FBc0M7b0JBQ3RDLFFBQVEsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzNCLFFBQVEsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzNCLE1BQU0sR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzVCLE1BQU0sR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzVCLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO29CQUN4QixLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztvQkFFeEIseUJBQXlCO29CQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFMUIsMkJBQTJCO29CQUUzQixvQkFBb0I7b0JBQ3BCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUV4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFdEMsb0JBQW9CO29CQUNwQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQ3RCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFFeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRXRDLHFCQUFxQjtvQkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFDaEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDckIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdEI7Z0JBQ0gsQ0FBQztnQkFFTSxlQUFlO29CQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztnQkFFTSxPQUFPLENBQUMsQ0FBWTtvQkFDekIsTUFBTSxRQUFRLEdBQWMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUM1QyxNQUFNLFFBQVEsR0FBYyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzVDLE1BQU0sS0FBSyxHQUFXLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDekMsTUFBTSxLQUFLLEdBQVcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUV6QyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7d0JBQzVDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RDO29CQUVELHlCQUF5QjtvQkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTdCLHFCQUFxQjtvQkFDckIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRXpDLHFCQUFxQjtvQkFDckIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRXpDLG9CQUFvQjtvQkFDcEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFFRCwrREFBK0Q7Z0JBQy9ELDREQUE0RDtnQkFDNUQsZ0JBQWdCO2dCQUNULE9BQU87b0JBQ1oseUJBQXlCO29CQUN6QixLQUFLLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ2xDLE1BQU0sUUFBUSxHQUFjLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDNUMsTUFBTSxRQUFRLEdBQWMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUM1QyxNQUFNLE1BQU0sR0FBVyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7d0JBQzFDLE1BQU0sTUFBTSxHQUFXLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDMUMsTUFBTSxLQUFLLEdBQVcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUN6QyxNQUFNLEtBQUssR0FBVyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBRXpDLHlDQUF5Qzt3QkFDekMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFOzRCQUNsQix3QkFBd0I7NEJBQ3hCLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtnQ0FDbkYsTUFBTSxLQUFLLEdBQWMsQ0FBQyxDQUFDO2dDQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUNwQixTQUFTOzZCQUNWOzRCQUVELDRCQUE0Qjs0QkFDNUIsQ0FBQyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7eUJBQ3hCO3dCQUVELE1BQU0sT0FBTyxHQUFZLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLG1CQUFVLENBQUMsYUFBYSxDQUFDO3dCQUN0RixNQUFNLE9BQU8sR0FBWSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxtQkFBVSxDQUFDLGFBQWEsQ0FBQzt3QkFFdEYsdUVBQXVFO3dCQUN2RSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFOzRCQUN4QixTQUFTO3lCQUNWO3dCQUVELE1BQU0sTUFBTSxHQUFlLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDO3dCQUMvRCxNQUFNLE1BQU0sR0FBZSxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFDL0QsTUFBTSxPQUFPLEdBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUV2RSxxRUFBcUU7d0JBQ3JFLElBQUksQ0FBQyxPQUFPLEVBQUU7NEJBQ1osTUFBTSxLQUFLLEdBQWMsQ0FBQyxDQUFDOzRCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOzRCQUNwQixTQUFTO3lCQUNWO3dCQUVELHdCQUF3Qjt3QkFDeEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztxQkFDbEM7Z0JBQ0gsQ0FBQzthQUNGLENBQUEifQ==