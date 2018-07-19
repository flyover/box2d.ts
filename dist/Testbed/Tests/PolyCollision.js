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
    var box2d, testbed, PolyCollision;
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
            PolyCollision = class PolyCollision extends testbed.Test {
                constructor() {
                    super();
                    this.m_polygonA = new box2d.b2PolygonShape();
                    this.m_polygonB = new box2d.b2PolygonShape();
                    this.m_transformA = new box2d.b2Transform();
                    this.m_transformB = new box2d.b2Transform();
                    this.m_positionB = new box2d.b2Vec2();
                    this.m_angleB = 0;
                    {
                        this.m_polygonA.SetAsBox(0.2, 0.4);
                        this.m_transformA.SetPositionAngle(new box2d.b2Vec2(0.0, 0.0), 0.0);
                    }
                    {
                        this.m_polygonB.SetAsBox(0.5, 0.5);
                        this.m_positionB.Set(19.345284, 1.5632932);
                        this.m_angleB = 1.9160721;
                        this.m_transformB.SetPositionAngle(this.m_positionB, this.m_angleB);
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
                    // super.Step(settings);
                    const manifold = new box2d.b2Manifold();
                    box2d.b2CollidePolygons(manifold, this.m_polygonA, this.m_transformA, this.m_polygonB, this.m_transformB);
                    const worldManifold = new box2d.b2WorldManifold();
                    worldManifold.Initialize(manifold, this.m_transformA, this.m_polygonA.m_radius, this.m_transformB, this.m_polygonB.m_radius);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `point count = ${manifold.pointCount}`);
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
                    for (let i = 0; i < manifold.pointCount; ++i) {
                        testbed.g_debugDraw.DrawPoint(worldManifold.points[i], 4.0, new box2d.b2Color(0.9, 0.3, 0.3));
                    }
                }
                static Create() {
                    return new PolyCollision();
                }
            };
            exports_1("PolyCollision", PolyCollision);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seUNvbGxpc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvUG9seUNvbGxpc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsZ0JBQUEsbUJBQTJCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBUTdDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQVJILGVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDeEMsZUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN4QyxpQkFBWSxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN2QyxpQkFBWSxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN2QyxnQkFBVyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNqQyxhQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUtsQjt3QkFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDckU7b0JBRUQ7d0JBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7d0JBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO3dCQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFX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