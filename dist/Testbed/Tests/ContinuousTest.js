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
    var box2d, testbed, ContinuousTest;
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
            ContinuousTest = class ContinuousTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_angularVelocity = 0.0;
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.position.Set(0.0, 0.0);
                        const body = this.m_world.CreateBody(bd);
                        const edge = new box2d.b2EdgeShape();
                        edge.Set(new box2d.b2Vec2(-10.0, 0.0), new box2d.b2Vec2(10.0, 0.0));
                        body.CreateFixture(edge, 0.0);
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.2, 1.0, new box2d.b2Vec2(0.5, 1.0), 0.0);
                        body.CreateFixture(shape, 0.0);
                    }
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 20.0);
                        //bd.angle = 0.1;
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(2.0, 0.1);
                        this.m_body = this.m_world.CreateBody(bd);
                        this.m_body.CreateFixture(shape, 1.0);
                        this.m_angularVelocity = box2d.b2RandomRange(-50.0, 50.0);
                        //this.m_angularVelocity = 46.661274;
                        this.m_body.SetLinearVelocity(new box2d.b2Vec2(0.0, -100.0));
                        this.m_body.SetAngularVelocity(this.m_angularVelocity);
                    }
                    /*
                    else
                    {
                      const bd = new box2d.b2BodyDef();
                      bd.type = box2d.b2BodyType.b2_dynamicBody;
                      bd.position.Set(0.0, 2.0);
                      const body = this.m_world.CreateBody(bd);
                      const shape = new box2d.b2CircleShape();
                      shape.m_p.SetZero();
                      shape.m_radius = 0.5;
                      body.CreateFixture(shape, 1.0);
                      bd.bullet = true;
                      bd.position.Set(0.0, 10.0);
                      body = this.m_world.CreateBody(bd);
                      body.CreateFixture(shape, 1.0);
                      body.SetLinearVelocity(new box2d.b2Vec2(0.0, -100.0));
                    }
                    */
                    // box2d.b2_gjkCalls = 0;
                    // box2d.b2_gjkIters = 0;
                    // box2d.b2_gjkMaxIters = 0;
                    box2d.b2_gjk_reset();
                    // box2d.b2_toiCalls = 0;
                    // box2d.b2_toiIters = 0;
                    // box2d.b2_toiRootIters = 0;
                    // box2d.b2_toiMaxRootIters = 0;
                    // box2d.b2_toiTime = 0.0;
                    // box2d.b2_toiMaxTime = 0.0;
                    box2d.b2_toi_reset();
                }
                Launch() {
                    // box2d.b2_gjkCalls = 0;
                    // box2d.b2_gjkIters = 0;
                    // box2d.b2_gjkMaxIters = 0;
                    box2d.b2_gjk_reset();
                    // box2d.b2_toiCalls = 0;
                    // box2d.b2_toiIters = 0;
                    // box2d.b2_toiRootIters = 0;
                    // box2d.b2_toiMaxRootIters = 0;
                    // box2d.b2_toiTime = 0.0;
                    // box2d.b2_toiMaxTime = 0.0;
                    box2d.b2_toi_reset();
                    this.m_body.SetTransformVec(new box2d.b2Vec2(0.0, 20.0), 0.0);
                    this.m_angularVelocity = box2d.b2RandomRange(-50.0, 50.0);
                    this.m_body.SetLinearVelocity(new box2d.b2Vec2(0.0, -100.0));
                    this.m_body.SetAngularVelocity(this.m_angularVelocity);
                }
                Step(settings) {
                    super.Step(settings);
                    if (box2d.b2_gjkCalls > 0) {
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "gjk calls = %d, ave gjk iters = %3.1f, max gjk iters = %d",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `gjk calls = ${box2d.b2_gjkCalls.toFixed(0)}, ave gjk iters = ${(box2d.b2_gjkIters / box2d.b2_gjkCalls).toFixed(1)}, max gjk iters = ${box2d.b2_gjkMaxIters.toFixed(0)}`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    }
                    if (box2d.b2_toiCalls > 0) {
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "toi [max] calls = %d, ave toi iters = %3.1f [%d]",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `toi [max] calls = ${box2d.b2_toiCalls}, ave toi iters = ${(box2d.b2_toiIters / box2d.b2_toiCalls).toFixed(1)} [${box2d.b2_toiMaxRootIters}]`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi root iters = %3.1f [%d]",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi root iters = ${(box2d.b2_toiRootIters / box2d.b2_toiCalls).toFixed(1)} [${box2d.b2_toiMaxRootIters.toFixed(0)}]`);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                        // testbed.g_debugDraw.DrawString(5, this.m_textLine, "ave [max] toi time = %.1f [%.1f] (microseconds)",
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, `ave [max] toi time = ${(1000.0 * box2d.b2_toiTime / box2d.b2_toiCalls).toFixed(1)} [${(1000.0 * box2d.b2_toiMaxTime).toFixed(1)}] (microseconds)`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGludW91c1Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL0NvbnRpbnVvdXNUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixpQkFBQSxvQkFBNEIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFJOUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSEgsc0JBQWlCLEdBQUcsR0FBRyxDQUFDO29CQUs3Qjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFekMsTUFBTSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBRXJDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDcEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRTlCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN6QyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDMUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FB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