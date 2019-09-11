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
            exports_1("DynamicTreeTest", DynamicTreeTest);
            DynamicTreeTest.e_actorCount = 128;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1pY1RyZWVUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRHluYW1pY1RyZWVUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixrQkFBQSxNQUFhLGVBQWdCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBZS9DO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQWJILGtCQUFhLEdBQUcsR0FBRyxDQUFDO29CQUNwQixrQkFBYSxHQUFHLEdBQUcsQ0FBQztvQkFFcEIsV0FBTSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBeUIsQ0FBQztvQkFDMUQsZ0JBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDakMsbUJBQWMsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDNUMsb0JBQWUsR0FBRyxJQUFJLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDOUMsZUFBVSxHQUFpQyxJQUFJLENBQUM7b0JBQ2hELGFBQVEsR0FBNEIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUkscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO29CQUN2SCxnQkFBVyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsZ0JBQVcsR0FBRyxLQUFLLENBQUM7b0JBS3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztvQkFFekIsYUFBYTtvQkFFYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDckQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLGFBQWEs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