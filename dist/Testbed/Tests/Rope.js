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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9wZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvUm9wZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsT0FBQSxVQUFrQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUlwQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFKSCxXQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzVCLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBS25CLGVBQWU7b0JBQ2YsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNiLGtCQUFrQjtvQkFDbEIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLGFBQWE7b0JBQ2IsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUUxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUMxQixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO3FCQUNqQjtvQkFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUNoQixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUVoQixtQkFBbUI7b0JBQ25CLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNsQyxHQUFHLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztvQkFDeEIsR0FBRyxDQUFDLEtBQUss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