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
System.register(["./b2Controller", "../Common/b2Math"], function (exports_1, context_1) {
    "use strict";
    var b2Controller_1, b2Math_1, b2ConstantAccelController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Controller_1_1) {
                b2Controller_1 = b2Controller_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            }
        ],
        execute: function () {
            /**
             * Applies a force every frame
             */
            b2ConstantAccelController = class b2ConstantAccelController extends b2Controller_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /**
                     * The acceleration to apply
                     */
                    this.A = new b2Math_1.b2Vec2(0, 0);
                }
                Step(step) {
                    const dtA = b2Math_1.b2Vec2.MulSV(step.dt, this.A, b2ConstantAccelController.Step_s_dtA);
                    for (let i = this.m_bodyList; i; i = i.nextBody) {
                        const body = i.body;
                        if (!body.IsAwake()) {
                            continue;
                        }
                        body.SetLinearVelocity(b2Math_1.b2Vec2.AddVV(body.GetLinearVelocity(), dtA, b2Math_1.b2Vec2.s_t0));
                    }
                }
                Draw(draw) { }
            };
            b2ConstantAccelController.Step_s_dtA = new b2Math_1.b2Vec2();
            exports_1("b2ConstantAccelController", b2ConstantAccelController);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb25zdGFudEFjY2VsQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL0NvbnRyb2xsZXJzL2IyQ29uc3RhbnRBY2NlbENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQVNIOztlQUVHO1lBQ0gsNEJBQUEsK0JBQXVDLFNBQVEsMkJBQVk7Z0JBQTNEOztvQkFDRTs7dUJBRUc7b0JBQ2EsTUFBQyxHQUFHLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFldkMsQ0FBQztnQkFiUSxJQUFJLENBQUMsSUFBZ0I7b0JBQzFCLE1BQU0sR0FBRyxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNoRixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO3dCQUMvQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFOzRCQUNuQixTQUFTO3lCQUNWO3dCQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEdBQUcsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDbEY7Z0JBQ0gsQ0FBQztnQkFHTSxJQUFJLENBQUMsSUFBWSxJQUFHLENBQUM7YUFDN0IsQ0FBQTtZQUhnQixvQ0FBVSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUMifQ==