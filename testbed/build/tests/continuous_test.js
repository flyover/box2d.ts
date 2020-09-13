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
    var b2, testbed, ContinuousTest;
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
            ContinuousTest = class ContinuousTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_angularVelocity = 0.0;
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(0.0, 0.0);
                        const body = this.m_world.CreateBody(bd);
                        const edge = new b2.EdgeShape();
                        edge.SetTwoSided(new b2.Vec2(-10.0, 0.0), new b2.Vec2(10.0, 0.0));
                        body.CreateFixture(edge, 0.0);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.2, 1.0, new b2.Vec2(0.5, 1.0), 0.0);
                        body.CreateFixture(shape, 0.0);
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 20.0);
                        //bd.angle = 0.1;
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(2.0, 0.1);
                        this.m_body = this.m_world.CreateBody(bd);
                        this.m_body.CreateFixture(shape, 1.0);
                        this.m_angularVelocity = b2.RandomRange(-50.0, 50.0);
                        //this.m_angularVelocity = 46.661274;
                        this.m_body.SetLinearVelocity(new b2.Vec2(0.0, -100.0));
                        this.m_body.SetAngularVelocity(this.m_angularVelocity);
                    }
                    /*
                    else
                    {
                      const bd = new b2.BodyDef();
                      bd.type = b2.BodyType.b2_dynamicBody;
                      bd.position.Set(0.0, 2.0);
                      const body = this.m_world.CreateBody(bd);
                      const shape = new b2.CircleShape();
                      shape.m_p.SetZero();
                      shape.m_radius = 0.5;
                      body.CreateFixture(shape, 1.0);
                      bd.bullet = true;
                      bd.position.Set(0.0, 10.0);
                      body = this.m_world.CreateBody(bd);
                      body.CreateFixture(shape, 1.0);
                      body.SetLinearVelocity(new b2.Vec2(0.0, -100.0));
                    }
                    */
                    // b2.gjkCalls = 0;
                    // b2.gjkIters = 0;
                    // b2.gjkMaxIters = 0;
                    b2.gjk_reset();
                    // b2.toiCalls = 0;
                    // b2.toiIters = 0;
                    // b2.toiRootIters = 0;
                    // b2.toiMaxRootIters = 0;
                    // b2.toiTime = 0.0;
                    // b2.toiMaxTime = 0.0;
                    b2.toi_reset();
                }
                Launch() {
                    // b2.gjkCalls = 0;
                    // b2.gjkIters = 0;
                    // b2.gjkMaxIters = 0;
                    b2.gjk_reset();
                    // b2.toiCalls = 0;
                    // b2.toiIters = 0;
                    // b2.toiRootIters = 0;
                    // b2.toiMaxRootIters = 0;
                    // b2.toiTime = 0.0;
                    // b2.toiMaxTime = 0.0;
                    b2.toi_reset();
                    this.m_body.SetTransformVec(new b2.Vec2(0.0, 20.0), 0.0);
                    this.m_angularVelocity = b2.RandomRange(-50.0, 50.0);
                    this.m_body.SetLinearVelocity(new b2.Vec2(0.0, -100.0));
                    this.m_body.SetAngularVelocity(this.m_angularVelocity);
                }
                Step(settings) {
                    super.Step(settings);
                    if (b2.gjkCalls > 0) {
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "gjk calls = %d, ave gjk iters = %3.1f, max gjk iters = %d",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `gjk calls = ${b2.gjkCalls.toFixed(0)}, ave gjk iters = ${(b2.gjkIters / b2.gjkCalls).toFixed(1)}, max gjk iters = ${b2.gjkMaxIters.toFixed(0)}`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    }
                    if (b2.toiCalls > 0) {
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "toi [max] calls = %d, ave toi iters = %3.1f [%d]",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `toi [max] calls = ${b2.toiCalls}, ave toi iters = ${(b2.toiIters / b2.toiCalls).toFixed(1)} [${b2.toiMaxRootIters}]`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi root iters = %3.1f [%d]",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi root iters = ${(b2.toiRootIters / b2.toiCalls).toFixed(1)} [${b2.toiMaxRootIters.toFixed(0)}]`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi time = %.1f [%.1f] (microseconds)",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi time = ${(1000.0 * b2.toiTime / b2.toiCalls).toFixed(1)} [${(1000.0 * b2.toiMaxTime).toFixed(1)}] (microseconds)`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    }
                    if (this.m_stepCount % 60 === 0) {
                        this.Launch();
                    }
                }
                static Create() {
                    return new ContinuousTest();
                }
            };
            exports_1("ContinuousTest", ContinuousTest);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGludW91c190ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvY29udGludW91c190ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixpQkFBQSxNQUFhLGNBQWUsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFJOUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSEgsc0JBQWlCLEdBQUcsR0FBRyxDQUFDO29CQUs3Qjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDNUIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFekMsTUFBTSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBRWhDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRTlCLE1BQU0sS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDckQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFD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