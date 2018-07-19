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
    var box2d, testbed, DistanceTest;
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
            DistanceTest = class DistanceTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_positionB = new box2d.b2Vec2();
                    this.m_angleB = 0;
                    this.m_transformA = new box2d.b2Transform();
                    this.m_transformB = new box2d.b2Transform();
                    this.m_polygonA = new box2d.b2PolygonShape();
                    this.m_polygonB = new box2d.b2PolygonShape();
                    {
                        this.m_transformA.SetIdentity();
                        this.m_transformA.p.Set(0.0, -0.2);
                        this.m_polygonA.SetAsBox(10.0, 0.2);
                    }
                    {
                        this.m_positionB.Set(12.017401, 0.13678508);
                        this.m_angleB = -0.0109265;
                        this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
                        this.m_polygonB.SetAsBox(2.0, 0.1);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_positionB.x -= 0.1;
                            break;
                        case "d":
                            this.m_positionB.x += 0.1;
                            break;
                        case "s":
                            this.m_positionB.y -= 0.1;
                            break;
                        case "w":
                            this.m_positionB.y += 0.1;
                            break;
                        case "q":
                            this.m_angleB += 0.1 * box2d.b2_pi;
                            break;
                        case "e":
                            this.m_angleB -= 0.1 * box2d.b2_pi;
                            break;
                    }
                    this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
                }
                Step(settings) {
                    super.Step(settings);
                    const input = new box2d.b2DistanceInput();
                    input.proxyA.SetShape(this.m_polygonA, 0);
                    input.proxyB.SetShape(this.m_polygonB, 0);
                    input.transformA.Copy(this.m_transformA);
                    input.transformB.Copy(this.m_transformB);
                    input.useRadii = true;
                    const cache = new box2d.b2SimplexCache();
                    cache.count = 0;
                    const output = new box2d.b2DistanceOutput();
                    box2d.b2Distance(output, cache, input);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `distance = ${output.distance.toFixed(2)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `iterations = ${output.iterations}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    {
                        const color = new box2d.b2Color(0.9, 0.9, 0.9);
                        const v = [];
                        for (let i = 0; i < this.m_polygonA.m_count; ++i) {
                            v[i] = box2d.b2Transform.MulXV(this.m_transformA, this.m_polygonA.m_vertices[i], new box2d.b2Vec2());
                        }
                        testbed.g_debugDraw.DrawPolygon(v, this.m_polygonA.m_count, color);
                        for (let i = 0; i < this.m_polygonB.m_count; ++i) {
                            v[i] = box2d.b2Transform.MulXV(this.m_transformB, this.m_polygonB.m_vertices[i], new box2d.b2Vec2());
                        }
                        testbed.g_debugDraw.DrawPolygon(v, this.m_polygonB.m_count, color);
                    }
                    const x1 = output.pointA;
                    const x2 = output.pointB;
                    const c1 = new box2d.b2Color(1.0, 0.0, 0.0);
                    testbed.g_debugDraw.DrawPoint(x1, 4.0, c1);
                    const c2 = new box2d.b2Color(1.0, 1.0, 0.0);
                    testbed.g_debugDraw.DrawPoint(x2, 4.0, c2);
                }
                static Create() {
                    return new DistanceTest();
                }
            };
            exports_1("DistanceTest", DistanceTest);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzdGFuY2VUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9EaXN0YW5jZVRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLGVBQUEsa0JBQTBCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBUTVDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQVJILGdCQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pDLGFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2IsaUJBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDdkMsaUJBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDdkMsZUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN4QyxlQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBSzdDO3dCQUNFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNyQztvQkFFRDt3QkFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxTQUFTLENBQUM7d0JBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRXBFLElBQUksQ0FB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