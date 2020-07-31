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
System.register(["./b2_controller.js", "../common/b2_settings.js", "../common/b2_math.js"], function (exports_1, context_1) {
    "use strict";
    var b2_controller_js_1, b2_settings_js_1, b2_math_js_1, b2GravityController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_controller_js_1_1) {
                b2_controller_js_1 = b2_controller_js_1_1;
            },
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            }
        ],
        execute: function () {
            /**
             * Applies simplified gravity between every pair of bodies
             */
            b2GravityController = class b2GravityController extends b2_controller_js_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /**
                     * Specifies the strength of the gravitiation force
                     */
                    this.G = 1;
                    /**
                     * If true, gravity is proportional to r^-2, otherwise r^-1
                     */
                    this.invSqr = true;
                }
                /**
                 * @see b2Controller::Step
                 */
                Step(step) {
                    if (this.invSqr) {
                        for (let i = this.m_bodyList; i; i = i.nextBody) {
                            const body1 = i.body;
                            const p1 = body1.GetWorldCenter();
                            const mass1 = body1.GetMass();
                            for (let j = this.m_bodyList; j && j !== i; j = j.nextBody) {
                                const body2 = j.body;
                                const p2 = body2.GetWorldCenter();
                                const mass2 = body2.GetMass();
                                const dx = p2.x - p1.x;
                                const dy = p2.y - p1.y;
                                const r2 = dx * dx + dy * dy;
                                if (r2 < b2_settings_js_1.b2_epsilon) {
                                    continue;
                                }
                                const f = b2GravityController.Step_s_f.Set(dx, dy);
                                f.SelfMul(this.G / r2 / b2_math_js_1.b2Sqrt(r2) * mass1 * mass2);
                                if (body1.IsAwake()) {
                                    body1.ApplyForce(f, p1);
                                }
                                if (body2.IsAwake()) {
                                    body2.ApplyForce(f.SelfMul(-1), p2);
                                }
                            }
                        }
                    }
                    else {
                        for (let i = this.m_bodyList; i; i = i.nextBody) {
                            const body1 = i.body;
                            const p1 = body1.GetWorldCenter();
                            const mass1 = body1.GetMass();
                            for (let j = this.m_bodyList; j && j !== i; j = j.nextBody) {
                                const body2 = j.body;
                                const p2 = body2.GetWorldCenter();
                                const mass2 = body2.GetMass();
                                const dx = p2.x - p1.x;
                                const dy = p2.y - p1.y;
                                const r2 = dx * dx + dy * dy;
                                if (r2 < b2_settings_js_1.b2_epsilon) {
                                    continue;
                                }
                                const f = b2GravityController.Step_s_f.Set(dx, dy);
                                f.SelfMul(this.G / r2 * mass1 * mass2);
                                if (body1.IsAwake()) {
                                    body1.ApplyForce(f, p1);
                                }
                                if (body2.IsAwake()) {
                                    body2.ApplyForce(f.SelfMul(-1), p2);
                                }
                            }
                        }
                    }
                }
                Draw(draw) { }
            };
            exports_1("b2GravityController", b2GravityController);
            b2GravityController.Step_s_f = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfZ3Jhdml0eV9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJfZ3Jhdml0eV9jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVSDs7ZUFFRztZQUNILHNCQUFBLE1BQWEsbUJBQW9CLFNBQVEsK0JBQVk7Z0JBQXJEOztvQkFDRTs7dUJBRUc7b0JBQ0ksTUFBQyxHQUFHLENBQUMsQ0FBQztvQkFDYjs7dUJBRUc7b0JBQ0ksV0FBTSxHQUFHLElBQUksQ0FBQztnQkE2RHZCLENBQUM7Z0JBM0RDOzttQkFFRztnQkFDSSxJQUFJLENBQUMsSUFBZ0I7b0JBQzFCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDZixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFOzRCQUMvQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDOzRCQUNyQixNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ2xDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFO2dDQUMxRCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dDQUNyQixNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0NBQ2xDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQ0FDOUIsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUN2QixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztnQ0FDN0IsSUFBSSxFQUFFLEdBQUcsMkJBQVUsRUFBRTtvQ0FDbkIsU0FBUztpQ0FDVjtnQ0FDRCxNQUFNLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQ0FDbkQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxtQkFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztnQ0FDcEQsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7b0NBQ25CLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lDQUN6QjtnQ0FDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQ0FDbkIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7aUNBQ3JDOzZCQUNGO3lCQUNGO3FCQUNGO3lCQUFNO3dCQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7NEJBQy9DLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7NEJBQ3JCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDbEMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDOzRCQUM5QixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7Z0NBQzFELE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0NBQ3JCLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQ0FDbEMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dDQUM5QixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDdkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO2dDQUM3QixJQUFJLEVBQUUsR0FBRywyQkFBVSxFQUFFO29DQUNuQixTQUFTO2lDQUNWO2dDQUNELE1BQU0sQ0FBQyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dDQUNuRCxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztnQ0FDdkMsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7b0NBQ25CLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lDQUN6QjtnQ0FDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQ0FDbkIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7aUNBQ3JDOzZCQUNGO3lCQUNGO3FCQUNGO2dCQUNILENBQUM7Z0JBR00sSUFBSSxDQUFDLElBQVksSUFBSSxDQUFDO2FBQzlCLENBQUE7O1lBSGdCLDRCQUFRLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUMifQ==