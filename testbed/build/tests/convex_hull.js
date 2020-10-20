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
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, ConvexHull, testIndex;
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
                        let x = b2.RandomRange(-10.0, 10.0);
                        let y = b2.RandomRange(-10.0, 10.0);
                        // Clamp onto a square to help create collinearities.
                        // This will stress the convex hull algorithm.
                        x = b2.Clamp(x, -8.0, 8.0);
                        y = b2.Clamp(y, -8.0, 8.0);
                        this.m_test_points[i] = new b2.Vec2(x, y);
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
                    const shape = new b2.PolygonShape();
                    shape.Set(this.m_test_points, this.m_count);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press g to generate a new random convex hull");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawPolygon(shape.m_vertices, shape.m_count, new b2.Color(0.9, 0.9, 0.9));
                    for (let i = 0; i < this.m_count; ++i) {
                        testbed.g_debugDraw.DrawPoint(this.m_test_points[i], 3.0, new b2.Color(0.3, 0.9, 0.3));
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
            exports_1("testIndex", testIndex = testbed.RegisterTest("Geometry", "Convex Hull", ConvexHull.Create));
        }
    };
});
//# sourceMappingURL=convex_hull.js.map