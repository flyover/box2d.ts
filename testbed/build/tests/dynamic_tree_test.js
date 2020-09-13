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
    var b2, testbed, DynamicTreeTest, DynamicTreeTest_Actor;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
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
                    this.m_tree = new b2.DynamicTree();
                    this.m_queryAABB = new b2.AABB();
                    this.m_rayCastInput = new b2.RayCastInput();
                    this.m_rayCastOutput = new b2.RayCastOutput();
                    this.m_rayActor = null;
                    this.m_actors = b2.MakeArray(DynamicTreeTest.e_actorCount, () => new DynamicTreeTest_Actor());
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
                        const actionCount = b2.Max(1, DynamicTreeTest.e_actorCount >> 2);
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
                        const c = new b2.Color(0.9, 0.9, 0.9);
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
                    const c = new b2.Color(0.7, 0.7, 0.7);
                    testbed.g_debugDraw.DrawAABB(this.m_queryAABB, c);
                    testbed.g_debugDraw.DrawSegment(this.m_rayCastInput.p1, this.m_rayCastInput.p2, c);
                    const c1 = new b2.Color(0.2, 0.9, 0.2);
                    const c2 = new b2.Color(0.9, 0.2, 0.2);
                    testbed.g_debugDraw.DrawPoint(this.m_rayCastInput.p1, 6.0, c1);
                    testbed.g_debugDraw.DrawPoint(this.m_rayCastInput.p2, 6.0, c2);
                    if (this.m_rayActor) {
                        const cr = new b2.Color(0.2, 0.2, 0.9);
                        //b2.Vec2 p = this.m_rayCastInput.p1 + this.m_rayActor.fraction * (this.m_rayCastInput.p2 - this.m_rayCastInput.p1);
                        const p = b2.Vec2.AddVV(this.m_rayCastInput.p1, b2.Vec2.MulSV(this.m_rayActor.fraction, b2.Vec2.SubVV(this.m_rayCastInput.p2, this.m_rayCastInput.p1, new b2.Vec2()), new b2.Vec2()), new b2.Vec2());
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
                    const w = new b2.Vec2();
                    w.Set(2.0 * this.m_proxyExtent, 2.0 * this.m_proxyExtent);
                    //aabb.lowerBound.x = -this.m_proxyExtent;
                    //aabb.lowerBound.y = -this.m_proxyExtent + this.m_worldExtent;
                    aabb.lowerBound.x = b2.RandomRange(-this.m_worldExtent, this.m_worldExtent);
                    aabb.lowerBound.y = b2.RandomRange(0.0, 2.0 * this.m_worldExtent);
                    aabb.upperBound.Copy(aabb.lowerBound);
                    aabb.upperBound.SelfAdd(w);
                }
                MoveAABB(aabb) {
                    const d = new b2.Vec2();
                    d.x = b2.RandomRange(-0.5, 0.5);
                    d.y = b2.RandomRange(-0.5, 0.5);
                    //d.x = 2.0;
                    //d.y = 0.0;
                    aabb.lowerBound.SelfAdd(d);
                    aabb.upperBound.SelfAdd(d);
                    //b2.Vec2 c0 = 0.5 * (aabb.lowerBound + aabb.upperBound);
                    const c0 = b2.Vec2.MulSV(0.5, b2.Vec2.AddVV(aabb.lowerBound, aabb.upperBound, b2.Vec2.s_t0), new b2.Vec2());
                    const min = new b2.Vec2(-this.m_worldExtent, 0.0);
                    const max = new b2.Vec2(this.m_worldExtent, 2.0 * this.m_worldExtent);
                    const c = b2.Vec2.ClampV(c0, min, max, new b2.Vec2());
                    aabb.lowerBound.SelfAdd(b2.Vec2.SubVV(c, c0, new b2.Vec2()));
                    aabb.upperBound.SelfAdd(b2.Vec2.SubVV(c, c0, new b2.Vec2()));
                }
                CreateProxy() {
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        const j = 0 | b2.RandomRange(0, DynamicTreeTest.e_actorCount);
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
                        const j = 0 | b2.RandomRange(0, DynamicTreeTest.e_actorCount);
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
                        const j = 0 | b2.RandomRange(0, DynamicTreeTest.e_actorCount);
                        const actor = this.m_actors[j];
                        if (actor.proxyId === null) {
                            continue;
                        }
                        const aabb0 = new b2.AABB();
                        aabb0.Copy(actor.aabb);
                        this.MoveAABB(actor.aabb);
                        const displacement = b2.Vec2.SubVV(actor.aabb.GetCenter(), aabb0.GetCenter(), new b2.Vec2());
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
                    const choice = 0 | b2.RandomRange(0, 20);
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
                        actor.overlap = b2.TestOverlapAABB(this.m_queryAABB, actor.aabb);
                        return true;
                    });
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        if (this.m_actors[i].proxyId === null) {
                            continue;
                        }
                        // DEBUG: const overlap =
                        b2.TestOverlapAABB(this.m_queryAABB, this.m_actors[i].aabb);
                        // DEBUG: b2.Assert(overlap === this.m_actors[i].overlap);
                    }
                }
                RayCast() {
                    this.m_rayActor = null;
                    const input = new b2.RayCastInput();
                    input.Copy(this.m_rayCastInput);
                    // Ray cast against the dynamic tree.
                    this.m_tree.RayCast(input, (input, proxyId) => {
                        const actor = proxyId.userData; // this.m_tree.GetUserData(proxyId);
                        const output = new b2.RayCastOutput();
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
                    const bruteOutput = new b2.RayCastOutput();
                    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
                        if (this.m_actors[i].proxyId === null) {
                            continue;
                        }
                        const output = new b2.RayCastOutput();
                        const hit = this.m_actors[i].aabb.RayCast(output, input);
                        if (hit) {
                            bruteActor = this.m_actors[i];
                            bruteOutput.Copy(output);
                            input.maxFraction = output.fraction;
                        }
                    }
                    if (bruteActor !== null) {
                        // DEBUG: b2.Assert(bruteOutput.fraction === this.m_rayCastOutput.fraction);
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
                    this.aabb = new b2.AABB();
                    this.fraction = 0.0;
                    this.overlap = false;
                    this.proxyId = null;
                }
            };
            exports_1("DynamicTreeTest_Actor", DynamicTreeTest_Actor);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY190cmVlX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9keW5hbWljX3RyZWVfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0Ysa0JBQUEsTUFBYSxlQUFnQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQWUvQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFiSCxrQkFBYSxHQUFHLEdBQUcsQ0FBQztvQkFDcEIsa0JBQWEsR0FBRyxHQUFHLENBQUM7b0JBRXBCLFdBQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQXlCLENBQUM7b0JBQ3JELGdCQUFXLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzVCLG1CQUFjLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ3ZDLG9CQUFlLEdBQUcsSUFBSSxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3pDLGVBQVUsR0FBaUMsSUFBSSxDQUFDO29CQUNoRCxhQUFRLEdBQTRCLEVBQUUsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLHFCQUFxQixFQUFFLENBQUMsQ0FBQztvQkFDbEgsZ0JBQVcsR0FBRyxDQUFDLENBQUM7b0JBQ2hCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO29CQUt6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztvQkFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7b0JBRXpCLGFBQWE7b0JBRWIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQy9C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SUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDNUcsTUFBTSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDdEUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFFdEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzdELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxDQUFDO2dCQUVNLFdBQVc7b0JBQ2hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUM5RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxD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