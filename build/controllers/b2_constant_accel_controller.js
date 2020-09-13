/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
System.register(["./b2_controller.js", "../common/b2_math.js"], function (exports_1, context_1) {
    "use strict";
    var b2_controller_js_1, b2_math_js_1, b2ConstantAccelController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_controller_js_1_1) {
                b2_controller_js_1 = b2_controller_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            }
        ],
        execute: function () {
            /**
             * Applies a force every frame
             */
            b2ConstantAccelController = class b2ConstantAccelController extends b2_controller_js_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /**
                     * The acceleration to apply
                     */
                    this.A = new b2_math_js_1.b2Vec2(0, 0);
                }
                Step(step) {
                    const dtA = b2_math_js_1.b2Vec2.MulSV(step.dt, this.A, b2ConstantAccelController.Step_s_dtA);
                    for (let i = this.m_bodyList; i; i = i.nextBody) {
                        const body = i.body;
                        if (!body.IsAwake()) {
                            continue;
                        }
                        body.SetLinearVelocity(b2_math_js_1.b2Vec2.AddVV(body.GetLinearVelocity(), dtA, b2_math_js_1.b2Vec2.s_t0));
                    }
                }
                Draw(draw) { }
            };
            exports_1("b2ConstantAccelController", b2ConstantAccelController);
            b2ConstantAccelController.Step_s_dtA = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29uc3RhbnRfYWNjZWxfY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9iMl9jb25zdGFudF9hY2NlbF9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFTSDs7ZUFFRztZQUNILDRCQUFBLE1BQWEseUJBQTBCLFNBQVEsK0JBQVk7Z0JBQTNEOztvQkFDRTs7dUJBRUc7b0JBQ2EsTUFBQyxHQUFHLElBQUksbUJBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBZXZDLENBQUM7Z0JBYlEsSUFBSSxDQUFDLElBQWdCO29CQUMxQixNQUFNLEdBQUcsR0FBRyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUseUJBQXlCLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2hGLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQy9DLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7NEJBQ25CLFNBQVM7eUJBQ1Y7d0JBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEdBQUcsRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7cUJBQ2xGO2dCQUNILENBQUM7Z0JBR00sSUFBSSxDQUFDLElBQVksSUFBRyxDQUFDO2FBQzdCLENBQUE7O1lBSGdCLG9DQUFVLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUMifQ==