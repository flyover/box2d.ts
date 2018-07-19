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
            ConvexHull.e_count = 10;
            exports_1("ConvexHull", ConvexHull);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmV4SHVsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvQ29udmV4SHVsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsYUFBQSxnQkFBd0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFPMUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBTEgsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO29CQUNuQyxZQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLFdBQU0sR0FBRyxLQUFLLENBQUM7b0JBS3BCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQztnQkFFTSxRQUFRO29CQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUMzQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUN6QyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUV6QyxxREFBcUQ7d0JBQ3JELDhDQUE4Qzt3QkFDOUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNoQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDaEQ7b0JBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO2dCQUNwQyxDQUFDO2dCQUVNLFFBQVEsQ0FBQyxHQUFXO29CQUN6QixRQUFRLEdBQUcsRUFBRTt3QkFDWCxLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQzNCLE1BQU07d0JBRVIsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs0QkFDaEIsTUFBTTtxQkFDVDtnQkFDSCxDQUFDO2dCQUVNLElBQUksQ0FBQyxRQUEwQjtvQkFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFckIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3pDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRTVDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLDhDQUE4QyxDQUFDLENBQUM7b0JBQ25HLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLG9CQUFvQixDQUFDO29CQUVoRCxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFbkcsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3JDLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzVGLE9BQU8sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUM3RztvQkFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFO3dCQUNyQixJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztxQkFDdEI7b0JBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNmLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDakI7Z0JBQ0gsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUMxQixDQUFDO2FBQ0YsQ0FBQTtZQW5Fd0Isa0JBQU8sR0FBRyxFQUFFLENBQUMifQ==