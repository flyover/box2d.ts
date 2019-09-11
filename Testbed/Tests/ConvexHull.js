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
    var box2d, testbed, ConvexHull;
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
            ConvexHull = class ConvexHull extends testbed.Test {
                constructor() {
                    super();
                    this.m_test_points = [];
                    this.m_count = 0;
                    this.m_auto = false;
                    this.Generate();
                }
                Generate() {
                    for (let i = 0; i < ConvexHull.e_count; ++i) {
                        let x = box2d.b2RandomRange(-10.0, 10.0);
                        let y = box2d.b2RandomRange(-10.0, 10.0);
                        // Clamp onto a square to help create collinearities.
                        // This will stress the convex hull algorithm.
                        x = box2d.b2Clamp(x, -8.0, 8.0);
                        y = box2d.b2Clamp(y, -8.0, 8.0);
                        this.m_test_points[i] = new box2d.b2Vec2(x, y);
                    }
                    this.m_count = ConvexHull.e_count;
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_auto = !this.m_auto;
                            break;
                        case "g":
                            this.Generate();
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    const shape = new box2d.b2PolygonShape();
                    shape.Set(this.m_test_points, this.m_count);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press g to generate a new random convex hull");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawPolygon(shape.m_vertices, shape.m_count, new box2d.b2Color(0.9, 0.9, 0.9));
                    for (let i = 0; i < this.m_count; ++i) {
                        testbed.g_debugDraw.DrawPoint(this.m_test_points[i], 3.0, new box2d.b2Color(0.3, 0.9, 0.3));
                        testbed.g_debugDraw.DrawStringWorld(this.m_test_points[i].x + 0.05, this.m_test_points[i].y + 0.05, `${i}`);
                    }
                    if (!shape.Validate()) {
                        this.m_textLine += 0;
                    }
                    if (this.m_auto) {
                        this.Generate();
                    }
                }
                static Create() {
                    return new ConvexHull();
                }
            };
            exports_1("ConvexHull", ConvexHull);
            ConvexHull.e_count = 10;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmV4SHVsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnZleEh1bGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLGFBQUEsTUFBYSxVQUFXLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBTzFDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUxILGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztvQkFDbkMsWUFBTyxHQUFHLENBQUMsQ0FBQztvQkFDWixXQUFNLEdBQUcsS0FBSyxDQUFDO29CQUtwQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2xCLENBQUM7Z0JBRU0sUUFBUTtvQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDM0MsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDekMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFFekMscURBQXFEO3dCQUNyRCw4Q0FBOEM7d0JBQzlDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDaEMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ2hEO29CQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDcEMsQ0FBQztnQkFFTSxRQUFRLENBQUMsR0FBVztvQkFDekIsUUFBUSxHQUFHLEVBQUU7d0JBQ1gsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzRCQUMzQixNQUFNO3dCQUVSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBQ2hCLE1BQU07cUJBQ1Q7Z0JBQ0gsQ0FBQztnQkFFTSxJQUFJLENBQUMsUUFBMEI7b0JBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRXJCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN6QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUU1QyxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSw4Q0FBOEMsQ0FBQyxDQUFDO29CQUNuRyxJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztvQkFFaEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRW5HLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUNyQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUM1RixPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDN0c7b0JBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFDckIsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7cUJBQ3RCO29CQUVELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDZixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ2pCO2dCQUNILENBQUM7Z0JBRU0sTUFBTSxDQUFDLE1BQU07b0JBQ2xCLE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQztnQkFDMUIsQ0FBQzthQUNGLENBQUE7O1lBbkV3QixrQkFBTyxHQUFHLEVBQUUsQ0FBQyJ9