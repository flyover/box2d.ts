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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY190cmVlX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkeW5hbWljX3RyZWVfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0Ysa0JBQUEsTUFBYSxlQUFnQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQWUvQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFiSCxrQkFBYSxHQUFHLEdBQUcsQ0FBQztvQkFDcEIsa0JBQWEsR0FBRyxHQUFHLENBQUM7b0JBRXBCLFdBQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQXlCLENBQUM7b0JBQzFELGdCQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pDLG1CQUFjLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzVDLG9CQUFlLEdBQUcsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQzlDLGVBQVUsR0FBaUMsSUFBSSxDQUFDO29CQUNoRCxhQUFRLEdBQTRCLEtBQUssQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLHFCQUFxQixFQUFFLENBQUMsQ0FBQztvQkFDdkgsZ0JBQVcsR0FBRyxDQUFDLENBQUM7b0JBQ2hCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO29CQUt6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztvQkFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7b0JBRXpCLGFBQWE7b0JBRWIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9CLElBQUksQ0FBQyxh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