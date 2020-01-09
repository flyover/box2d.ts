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
System.register(["./b2Controller.js", "../Common/b2Math.js"], function (exports_1, context_1) {
    "use strict";
    var b2Controller_js_1, b2Math_js_1, b2ConstantAccelController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Controller_js_1_1) {
                b2Controller_js_1 = b2Controller_js_1_1;
            },
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            }
        ],
        execute: function () {
            /**
             * Applies a force every frame
             */
            b2ConstantAccelController = class b2ConstantAccelController extends b2Controller_js_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /**
                     * The acceleration to apply
                     */
                    this.A = new b2Math_js_1.b2Vec2(0, 0);
                }
                Step(step) {
                    const dtA = b2Math_js_1.b2Vec2.MulSV(step.dt, this.A, b2ConstantAccelController.Step_s_dtA);
                    for (let i = this.m_bodyList; i; i = i.nextBody) {
                        const body = i.body;
                        if (!body.IsAwake()) {
                            continue;
                        }
                        body.SetLinearVelocity(b2Math_js_1.b2Vec2.AddVV(body.GetLinearVelocity(), dtA, b2Math_js_1.b2Vec2.s_t0));
                    }
                }
                Draw(draw) { }
            };
            exports_1("b2ConstantAccelController", b2ConstantAccelController);
            b2ConstantAccelController.Step_s_dtA = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb25zdGFudEFjY2VsQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29uc3RhbnRBY2NlbENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQVNIOztlQUVHO1lBQ0gsNEJBQUEsTUFBYSx5QkFBMEIsU0FBUSw4QkFBWTtnQkFBM0Q7O29CQUNFOzt1QkFFRztvQkFDYSxNQUFDLEdBQUcsSUFBSSxrQkFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFldkMsQ0FBQztnQkFiUSxJQUFJLENBQUMsSUFBZ0I7b0JBQzFCLE1BQU0sR0FBRyxHQUFHLGtCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDaEYsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTt3QkFDL0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTs0QkFDbkIsU0FBUzt5QkFDVjt3QkFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxFQUFFLGtCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDbEY7Z0JBQ0gsQ0FBQztnQkFHTSxJQUFJLENBQUMsSUFBWSxJQUFHLENBQUM7YUFDN0IsQ0FBQTs7WUFIZ0Isb0NBQVUsR0FBRyxJQUFJLGtCQUFNLEVBQUUsQ0FBQyJ9