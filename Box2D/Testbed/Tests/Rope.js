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
    var box2d, testbed, Rope;
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
            Rope = class Rope extends testbed.Test {
                constructor() {
                    super();
                    this.m_rope = new box2d.b2Rope();
                    this.m_angle = 0.0;
                    /*const int32*/
                    var N = 40;
                    /*box2d.b2Vec2[]*/
                    var vertices = box2d.b2Vec2.MakeArray(N);
                    /*float32[]*/
                    var masses = box2d.b2MakeNumberArray(N);
                    for ( /*int32*/var i = 0; i < N; ++i) {
                        vertices[i].Set(0.0, 20.0 - 0.25 * i);
                        masses[i] = 1.0;
                    }
                    masses[0] = 0.0;
                    masses[1] = 0.0;
                    /*box2d.b2RopeDef*/
                    var def = new box2d.b2RopeDef();
                    def.vertices = vertices;
                    def.count = N;
                    def.gravity.Set(0.0, -10.0);
                    def.masses = masses;
                    def.damping = 0.1;
                    def.k2 = 1.0;
                    def.k3 = 0.5;
                    this.m_rope.Initialize(def);
                    this.m_angle = 0.0;
                    this.m_rope.SetAngle(this.m_angle);
                }
                Keyboard(key) {
                    switch (key) {
                        case "q":
                            this.m_angle = box2d.b2Max(-box2d.b2_pi, this.m_angle - 0.05 * box2d.b2_pi);
                            this.m_rope.SetAngle(this.m_angle);
                            break;
                        case "e":
                            this.m_angle = box2d.b2Min(box2d.b2_pi, this.m_angle + 0.05 * box2d.b2_pi);
                            this.m_rope.SetAngle(this.m_angle);
                            break;
                    }
                }
                Step(settings) {
                    var dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
                    if (settings.pause && !settings.singleStep) {
                        dt = 0.0;
                    }
                    this.m_rope.Step(dt, 1);
                    super.Step(settings);
                    this.m_rope.Draw(testbed.g_debugDraw);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press (q,e) to adjust target angle");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Target angle = ${(this.m_angle * 180.0 / box2d.b2_pi).toFixed(2)} degrees`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Rope();
                }
            };
            exports_1("Rope", Rope);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLE9BQUEsVUFBa0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFJcEM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSlYsV0FBTSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUM1QixZQUFPLEdBQUcsR0FBRyxDQUFDO29CQUtaLGVBQWU7b0JBQ2YsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNYLGtCQUFrQjtvQkFDbEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLGFBQWE7b0JBQ2IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV4QyxNQUFNLFNBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ3JDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7cUJBQ2pCO29CQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQ2hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBRWhCLG1CQUFtQjtvQkFDbkIsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ2hDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO29CQUN4QixHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFD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