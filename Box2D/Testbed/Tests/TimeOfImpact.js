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
System.register(["../../Box2D/Box2D", "../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, TimeOfImpact;
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
            TimeOfImpact = class TimeOfImpact extends testbed.Test {
                constructor() {
                    super();
                    this.m_shapeA = new box2d.b2PolygonShape();
                    this.m_shapeB = new box2d.b2PolygonShape();
                    this.m_shapeA.SetAsBox(25.0, 5.0);
                    this.m_shapeB.SetAsBox(2.5, 2.5);
                }
                Step(settings) {
                    super.Step(settings);
                    const sweepA = new box2d.b2Sweep;
                    sweepA.c0.Set(24.0, -60.0);
                    sweepA.a0 = 2.95;
                    sweepA.c.Copy(sweepA.c0);
                    sweepA.a = sweepA.a0;
                    sweepA.localCenter.SetZero();
                    const sweepB = new box2d.b2Sweep;
                    sweepB.c0.Set(53.474274, -50.252514);
                    sweepB.a0 = 513.36676; // - 162.0 * box2d.b2_pi;
                    sweepB.c.Set(54.595478, -51.083473);
                    sweepB.a = 513.62781; //  - 162.0 * box2d.b2_pi;
                    sweepB.localCenter.SetZero();
                    //sweepB.a0 -= 300.0 * box2d.b2_pi;
                    //sweepB.a -= 300.0 * box2d.b2_pi;
                    const input = new box2d.b2TOIInput();
                    input.proxyA.SetShape(this.m_shapeA, 0);
                    input.proxyB.SetShape(this.m_shapeB, 0);
                    input.sweepA.Copy(sweepA);
                    input.sweepB.Copy(sweepB);
                    input.tMax = 1.0;
                    const output = new box2d.b2TOIOutput();
                    box2d.b2TimeOfImpact(output, input);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `toi = ${output.t.toFixed(2)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `max toi iters = ${box2d.b2_toiMaxIters}, max root iters = ${box2d.b2_toiMaxRootIters}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    const vertices = new Array(box2d.b2_maxPolygonVertices);
                    const transformA = new box2d.b2Transform();
                    sweepA.GetTransform(transformA, 0.0);
                    for (let i = 0; i < this.m_shapeA.m_count; ++i) {
                        vertices[i] = box2d.b2Transform.MulXV(transformA, this.m_shapeA.m_vertices[i], new box2d.b2Vec2());
                    }
                    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeA.m_count, new box2d.b2Color(0.9, 0.9, 0.9));
                    const transformB = new box2d.b2Transform();
                    sweepB.GetTransform(transformB, 0.0);
                    //box2d.b2Vec2 localPoint(2.0f, -0.1f);
                    for (let i = 0; i < this.m_shapeB.m_count; ++i) {
                        vertices[i] = box2d.b2Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new box2d.b2Vec2());
                    }
                    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new box2d.b2Color(0.5, 0.9, 0.5));
                    sweepB.GetTransform(transformB, output.t);
                    for (let i = 0; i < this.m_shapeB.m_count; ++i) {
                        vertices[i] = box2d.b2Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new box2d.b2Vec2());
                    }
                    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new box2d.b2Color(0.5, 0.7, 0.9));
                    sweepB.GetTransform(transformB, 1.0);
                    for (let i = 0; i < this.m_shapeB.m_count; ++i) {
                        vertices[i] = box2d.b2Transform.MulXV(transformB, this.m_shapeB.m_vertices[i], new box2d.b2Vec2());
                    }
                    testbed.g_debugDraw.DrawPolygon(vertices, this.m_shapeB.m_count, new box2d.b2Color(0.9, 0.5, 0.5));
                    /*
                    #if 0
                      for (float32 t = 0.0f; t < 1.0f; t += 0.1f)
                      {
                        sweepB.GetTransform(&transformB, t);
                        for (int32 i = 0; i < m_shapeB.m_count; ++i)
                        {
                          vertices[i] = b2Mul(transformB, m_shapeB.m_vertices[i]);
                        }
                        m_debugDraw.DrawPolygon(vertices, m_shapeB.m_count, box2d.b2Color(0.9f, 0.5f, 0.5f));
                      }
                    #endif
                    */
                }
                static Create() {
                    return new TimeOfImpact();
                }
            };
            exports_1("TimeOfImpact", TimeOfImpact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZU9mSW1wYWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVGltZU9mSW1wYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixlQUFBLGtCQUEwQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUk1QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFKVixhQUFRLEdBQXlCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUM1RCxhQUFRLEdBQXlCLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUsxRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQztnQkFFTSxJQUFJLENBQUMsUUFBMEI7b0JBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXJCLE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQztvQkFDakMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzNCLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO29CQUNqQixNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3pCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztvQkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUNqQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVB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