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
    var b2_controller_js_1, b2_math_js_1, b2ConstantForceController;
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
            b2ConstantForceController = class b2ConstantForceController extends b2_controller_js_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /**
                     * The force to apply
                     */
                    this.F = new b2_math_js_1.b2Vec2(0, 0);
                }
                Step(step) {
                    for (let i = this.m_bodyList; i; i = i.nextBody) {
                        const body = i.body;
                        if (!body.IsAwake()) {
                            continue;
                        }
                        body.ApplyForce(this.F, body.GetWorldCenter());
                    }
                }
                Draw(draw) { }
            };
            exports_1("b2ConstantForceController", b2ConstantForceController);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29uc3RhbnRfZm9yY2VfY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9iMl9jb25zdGFudF9mb3JjZV9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFTSDs7ZUFFRztZQUNILDRCQUFBLE1BQWEseUJBQTBCLFNBQVEsK0JBQVk7Z0JBQTNEOztvQkFDRTs7dUJBRUc7b0JBQ2EsTUFBQyxHQUFHLElBQUksbUJBQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBYXZDLENBQUM7Z0JBWFEsSUFBSSxDQUFDLElBQWdCO29CQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO3dCQUMvQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFOzRCQUNuQixTQUFTO3lCQUNWO3dCQUNELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztxQkFDaEQ7Z0JBQ0gsQ0FBQztnQkFFTSxJQUFJLENBQUMsSUFBWSxJQUFHLENBQUM7YUFDN0IsQ0FBQSJ9