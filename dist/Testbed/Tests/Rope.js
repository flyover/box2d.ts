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
    var box2d, testbed, Rope;
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
            Rope = class Rope extends testbed.Test {
                constructor() {
                    super();
                    this.m_rope = new box2d.b2Rope();
                    this.m_angle = 0.0;
                    /*const int32*/
                    const N = 40;
                    /*box2d.b2Vec2[]*/
                    const vertices = box2d.b2Vec2.MakeArray(N);
                    /*float32[]*/
                    const masses = box2d.b2MakeNumberArray(N);
                    for (let i = 0; i < N; ++i) {
                        vertices[i].Set(0.0, 20.0 - 0.25 * i);
                        masses[i] = 1.0;
                    }
                    masses[0] = 0.0;
                    masses[1] = 0.0;
                    /*box2d.b2RopeDef*/
                    const def = new box2d.b2RopeDef();
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
                    let dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvUm9wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsT0FBQSxNQUFhLElBQUssU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFJcEM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSkgsV0FBTSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUM1QixZQUFPLEdBQUcsR0FBRyxDQUFDO29CQUtuQixlQUFlO29CQUNmLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDYixrQkFBa0I7b0JBQ2xCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQyxhQUFhO29CQUNiLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDMUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztxQkFDakI7b0JBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFDaEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFFaEIsbUJBQW1CO29CQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDbEMsR0FBRyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7b0JBQ3hCLEdBQUcsQ0FBQyxL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