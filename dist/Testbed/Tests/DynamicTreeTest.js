/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, DynamicTreeTest, DynamicTreeTest_Actor;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            DynamicTreeTest = class DynamicTreeTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_worldExtent = 0.0;
                    this.m_proxyExtent = 0.0;
                    this.m_tree = new box2d.b2DynamicTree();
                    this.m_queryAABB = new box2d.b2AABB();
                    this.m_rayCastInput = new box2d.b2RayCastInput();
                    this.m_rayCastOutput = new box2d.b2RayCastOutput();
                    this.m_rayActor = null;
                    this.m_actors = box2d.b2MakeArray(DynamicTreeTest.e_actorCount, () => new DynamicTreeTest_Actor());
                    this.m_stepCount = 0;
                    this.m_automated = false;
                    this.m_worldExtent = 15.0;
                    this.m_proxyExtent = 0.5;
                    //srand(888);
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        const actor = this.m_actors[i];
                        this.GetRandomAABB(actor.aabb);
                        actor.proxyId = this.m_tree.CreateProxy(actor.aabb, actor);
                    }
                    this.m_stepCount = 0;
                    const h = this.m_worldExtent;
                    this.m_queryAABB.lowerBound.Set(-3.0, -4.0 + h);
                    this.m_queryAABB.upperBound.Set(5.0, 6.0 + h);
                    this.m_rayCastInput.p1.Set(-5.0, 5.0 + h);
                    this.m_rayCastInput.p2.Set(7.0, -4.0 + h);
                    //this.m_rayCastInput.p1.Set(0.0, 2.0 + h);
                    //this.m_rayCastInput.p2.Set(0.0, -2.0 + h);
                    this.m_rayCastInput.maxFraction = 1.0;
                    this.m_automated = false;
                }
                Step(settings) {
                    super.Step(settings);
                    this.Reset();
                    if (this.m_automated) {
                        const actionCount = box2d.b2Max(1, DynamicTreeTest.e_actorCount >> 2);
                        for (let i = 0; i < actionCount; ++i) {
                            this.Action();
                        }
                    }
                    this.Query();
                    this.RayCast();
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        const actor = this.m_actors[i];
                        if (actor.proxyId === null) {
                            continue;
                        }
                        const c = new box2d.b2Color(0.9, 0.9, 0.9);
                        if (actor === this.m_rayActor && actor.overlap) {
                            c.SetRGB(0.9, 0.6, 0.6);
                        }
                        else if (actor === this.m_rayActor) {
                            c.SetRGB(0.6, 0.9, 0.6);
                        }
                        else if (actor.overlap) {
                            c.SetRGB(0.6, 0.6, 0.9);
                        }
                        testbed.g_debugDraw.DrawAABB(actor.aabb, c);
                    }
                    const c = new box2d.b2Color(0.7, 0.7, 0.7);
                    testbed.g_debugDraw.DrawAABB(this.m_queryAABB, c);
                    testbed.g_debugDraw.DrawSegment(this.m_rayCastInput.p1, this.m_rayCastInput.p2, c);
                    const c1 = new box2d.b2Color(0.2, 0.9, 0.2);
                    const c2 = new box2d.b2Color(0.9, 0.2, 0.2);
                    testbed.g_debugDraw.DrawPoint(this.m_rayCastInput.p1, 6.0, c1);
                    testbed.g_debugDraw.DrawPoint(this.m_rayCastInput.p2, 6.0, c2);
                    if (this.m_rayActor) {
                        const cr = new box2d.b2Color(0.2, 0.2, 0.9);
                        //box2d.b2Vec2 p = this.m_rayCastInput.p1 + this.m_rayActor.fraction * (this.m_rayCastInput.p2 - this.m_rayCastInput.p1);
                        const p = box2d.b2Vec2.AddVV(this.m_rayCastInput.p1, box2d.b2Vec2.MulSV(this.m_rayActor.fraction, box2d.b2Vec2.SubVV(this.m_rayCastInput.p2, this.m_rayCastInput.p1, new box2d.b2Vec2()), new box2d.b2Vec2()), new box2d.b2Vec2());
                        testbed.g_debugDraw.DrawPoint(p, 6.0, cr);
                    }
                    {
                        const height = this.m_tree.GetHeight();
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    }
                    ++this.m_stepCount;
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_automated = !this.m_automated;
                            break;
                        case "c":
                            this.CreateProxy();
                            break;
                        case "d":
                            this.DestroyProxy();
                            break;
                        case "m":
                            this.MoveProxy();
                            break;
                    }
                }
                GetRandomAABB(aabb) {
                    const w = new box2d.b2Vec2();
                    w.Set(2.0 * this.m_proxyExtent, 2.0 * this.m_proxyExtent);
                    //aabb.lowerBound.x = -this.m_proxyExtent;
                    //aabb.lowerBound.y = -this.m_proxyExtent + this.m_worldExtent;
                    aabb.lowerBound.x = box2d.b2RandomRange(-this.m_worldExtent, this.m_worldExtent);
                    aabb.lowerBound.y = box2d.b2RandomRange(0.0, 2.0 * this.m_worldExtent);
                    aabb.upperBound.Copy(aabb.lowerBound);
                    aabb.upperBound.SelfAdd(w);
                }
                MoveAABB(aabb) {
                    const d = new box2d.b2Vec2();
                    d.x = box2d.b2RandomRange(-0.5, 0.5);
                    d.y = box2d.b2RandomRange(-0.5, 0.5);
                    //d.x = 2.0;
                    //d.y = 0.0;
                    aabb.lowerBound.SelfAdd(d);
                    aabb.upperBound.SelfAdd(d);
                    //box2d.b2Vec2 c0 = 0.5 * (aabb.lowerBound + aabb.upperBound);
                    const c0 = box2d.b2Vec2.MulSV(0.5, box2d.b2Vec2.AddVV(aabb.lowerBound, aabb.upperBound, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                    const min = new box2d.b2Vec2(-this.m_worldExtent, 0.0);
                    const max = new box2d.b2Vec2(this.m_worldExtent, 2.0 * this.m_worldExtent);
                    const c = box2d.b2Vec2.ClampV(c0, min, max, new box2d.b2Vec2());
                    aabb.lowerBound.SelfAdd(box2d.b2Vec2.SubVV(c, c0, new box2d.b2Vec2()));
                    aabb.upperBound.SelfAdd(box2d.b2Vec2.SubVV(c, c0, new box2d.b2Vec2()));
                }
                CreateProxy() {
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        const j = 0 | box2d.b2RandomRange(0, DynamicTreeTest.e_actorCount);
                        const actor = this.m_actors[j];
                        if (actor.proxyId === null) {
                            this.GetRandomAABB(actor.aabb);
                            actor.proxyId = this.m_tree.CreateProxy(actor.aabb, actor);
                            return;
                        }
                    }
                }
                DestroyProxy() {
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        const j = 0 | box2d.b2RandomRange(0, DynamicTreeTest.e_actorCount);
                        const actor = this.m_actors[j];
                        if (actor.proxyId !== null) {
                            this.m_tree.DestroyProxy(actor.proxyId);
                            actor.proxyId = null;
                            return;
                        }
                    }
                }
                MoveProxy() {
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        const j = 0 | box2d.b2RandomRange(0, DynamicTreeTest.e_actorCount);
                        const actor = this.m_actors[j];
                        if (actor.proxyId === null) {
                            continue;
                        }
                        const aabb0 = new box2d.b2AABB();
                        aabb0.Copy(actor.aabb);
                        this.MoveAABB(actor.aabb);
                        const displacement = box2d.b2Vec2.SubVV(actor.aabb.GetCenter(), aabb0.GetCenter(), new box2d.b2Vec2());
                        this.m_tree.MoveProxy(actor.proxyId, actor.aabb, displacement);
                        return;
                    }
                }
                Reset() {
                    this.m_rayActor = null;
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        this.m_actors[i].fraction = 1.0;
                        this.m_actors[i].overlap = false;
                    }
                }
                Action() {
                    const choice = 0 | box2d.b2RandomRange(0, 20);
                    switch (choice) {
                        case 0:
                            this.CreateProxy();
                            break;
                        case 1:
                            this.DestroyProxy();
                            break;
                        default:
                            this.MoveProxy();
                    }
                }
                Query() {
                    this.m_tree.Query(this.m_queryAABB, (proxyId) => {
                        const actor = proxyId.userData; // this.m_tree.GetUserData(proxyId);
                        actor.overlap = box2d.b2TestOverlapAABB(this.m_queryAABB, actor.aabb);
                        return true;
                    });
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        if (this.m_actors[i].proxyId === null) {
                            continue;
                        }
                        // DEBUG: const overlap =
                        box2d.b2TestOverlapAABB(this.m_queryAABB, this.m_actors[i].aabb);
                        // DEBUG: box2d.b2Assert(overlap === this.m_actors[i].overlap);
                    }
                }
                RayCast() {
                    this.m_rayActor = null;
                    const input = new box2d.b2RayCastInput();
                    input.Copy(this.m_rayCastInput);
                    // Ray cast against the dynamic tree.
                    this.m_tree.RayCast(input, (input, proxyId) => {
                        const actor = proxyId.userData; // this.m_tree.GetUserData(proxyId);
                        const output = new box2d.b2RayCastOutput();
                        const hit = actor.aabb.RayCast(output, input);
                        if (hit) {
                            this.m_rayCastOutput = output;
                            this.m_rayActor = actor;
                            this.m_rayActor.fraction = output.fraction;
                            return output.fraction;
                        }
                        return input.maxFraction;
                    });
                    // Brute force ray cast.
                    let bruteActor = null;
                    const bruteOutput = new box2d.b2RayCastOutput();
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        if (this.m_actors[i].proxyId === null) {
                            continue;
                        }
                        const output = new box2d.b2RayCastOutput();
                        const hit = this.m_actors[i].aabb.RayCast(output, input);
                        if (hit) {
                            bruteActor = this.m_actors[i];
                            bruteOutput.Copy(output);
                            input.maxFraction = output.fraction;
                        }
                    }
                    if (bruteActor !== null) {
                        // DEBUG: box2d.b2Assert(bruteOutput.fraction === this.m_rayCastOutput.fraction);
                    }
                }
                static Create() {
                    return new DynamicTreeTest();
                }
            };
            DynamicTreeTest.e_actorCount = 128;
            exports_1("DynamicTreeTest", DynamicTreeTest);
            DynamicTreeTest_Actor = class DynamicTreeTest_Actor {
                constructor() {
                    this.aabb = new box2d.b2AABB();
                    this.fraction = 0.0;
                    this.overlap = false;
                    this.proxyId = null;
                }
            };
            exports_1("DynamicTreeTest_Actor", DynamicTreeTest_Actor);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1pY1RyZWVUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9EeW5hbWljVHJlZVRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLGtCQUFBLE1BQWEsZUFBZ0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFlL0M7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBYkgsa0JBQWEsR0FBRyxHQUFHLENBQUM7b0JBQ3BCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO29CQUVwQixXQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUF5QixDQUFDO29CQUMxRCxnQkFBVyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNqQyxtQkFBYyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUM1QyxvQkFBZSxHQUFHLElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUM5QyxlQUFVLEdBQWlDLElBQUksQ0FBQztvQkFDaEQsYUFBUSxHQUE0QixLQUFLLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7b0JBQ3ZILGdCQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixnQkFBVyxHQUFHLEtBQUssQ0FBQztvQkFLekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO29CQUV6QixhQUFhO29CQUViLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUNyRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFD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