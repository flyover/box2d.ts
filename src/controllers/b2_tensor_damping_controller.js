/*
 * Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
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
System.register(["./b2_controller.js", "../common/b2_math.js", "../common/b2_settings.js"], function (exports_1, context_1) {
    "use strict";
    var b2_controller_js_1, b2_math_js_1, b2_settings_js_1, b2TensorDampingController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_controller_js_1_1) {
                b2_controller_js_1 = b2_controller_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            }
        ],
        execute: function () {
            /**
             * Applies top down linear damping to the controlled bodies
             * The damping is calculated by multiplying velocity by a matrix
             * in local co-ordinates.
             */
            b2TensorDampingController = class b2TensorDampingController extends b2_controller_js_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /// Tensor to use in damping model
                    this.T = new b2_math_js_1.b2Mat22();
                    /*Some examples (matrixes in format (row1; row2))
                    (-a 0; 0 -a)    Standard isotropic damping with strength a
                    ( 0 a; -a 0)    Electron in fixed field - a force at right angles to velocity with proportional magnitude
                    (-a 0; 0 -b)    Differing x and y damping. Useful e.g. for top-down wheels.
                    */
                    //By the way, tensor in this case just means matrix, don't let the terminology get you down.
                    /// Set this to a positive number to clamp the maximum amount of damping done.
                    this.maxTimestep = 0;
                }
                // Typically one wants maxTimestep to be 1/(max eigenvalue of T), so that damping will never cause something to reverse direction
                /**
                 * @see b2Controller::Step
                 */
                Step(step) {
                    let timestep = step.dt;
                    if (timestep <= b2_settings_js_1.b2_epsilon) {
                        return;
                    }
                    if (timestep > this.maxTimestep && this.maxTimestep > 0) {
                        timestep = this.maxTimestep;
                    }
                    for (let i = this.m_bodyList; i; i = i.nextBody) {
                        const body = i.body;
                        if (!body.IsAwake()) {
                            continue;
                        }
                        const damping = body.GetWorldVector(b2_math_js_1.b2Mat22.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity(), b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.s_t1), b2TensorDampingController.Step_s_damping);
                        //    body->SetLinearVelocity(body->GetLinearVelocity() + timestep * damping);
                        body.SetLinearVelocity(b2_math_js_1.b2Vec2.AddVV(body.GetLinearVelocity(), b2_math_js_1.b2Vec2.MulSV(timestep, damping, b2_math_js_1.b2Vec2.s_t0), b2_math_js_1.b2Vec2.s_t1));
                    }
                }
                Draw(draw) { }
                /**
                 * Sets damping independantly along the x and y axes
                 */
                SetAxisAligned(xDamping, yDamping) {
                    this.T.ex.x = (-xDamping);
                    this.T.ex.y = 0;
                    this.T.ey.x = 0;
                    this.T.ey.y = (-yDamping);
                    if (xDamping > 0 || yDamping > 0) {
                        this.maxTimestep = 1 / b2_math_js_1.b2Max(xDamping, yDamping);
                    }
                    else {
                        this.maxTimestep = 0;
                    }
                }
            };
            exports_1("b2TensorDampingController", b2TensorDampingController);
            b2TensorDampingController.Step_s_damping = new b2_math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfdGVuc29yX2RhbXBpbmdfY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyX3RlbnNvcl9kYW1waW5nX2NvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVVIOzs7O2VBSUc7WUFDSCw0QkFBQSxNQUFhLHlCQUEwQixTQUFRLCtCQUFZO2dCQUEzRDs7b0JBQ0ksa0NBQWtDO29CQUNsQixNQUFDLEdBQUcsSUFBSSxvQkFBTyxFQUFFLENBQUM7b0JBQ2xDOzs7O3NCQUlFO29CQUNGLDRGQUE0RjtvQkFFNUYsOEVBQThFO29CQUN2RSxnQkFBVyxHQUFHLENBQUMsQ0FBQztnQkFpRDNCLENBQUM7Z0JBaERHLGlJQUFpSTtnQkFFakk7O21CQUVHO2dCQUNJLElBQUksQ0FBQyxJQUFnQjtvQkFDeEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxRQUFRLElBQUksMkJBQVUsRUFBRTt3QkFDeEIsT0FBTztxQkFDVjtvQkFDRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFO3dCQUNyRCxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztxQkFDL0I7b0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTt3QkFDN0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTs0QkFDakIsU0FBUzt5QkFDWjt3QkFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUNuQyxvQkFBTyxDQUFDLEtBQUssQ0FDVCxJQUFJLENBQUMsQ0FBQyxFQUNOLElBQUksQ0FBQyxjQUFjLENBQ25CLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUN4QixtQkFBTSxDQUFDLElBQUksQ0FBQyxFQUNaLG1CQUFNLENBQUMsSUFBSSxDQUFDLEVBQ2hCLHlCQUF5QixDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUMxQyw4RUFBOEU7d0JBQzlFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxtQkFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsbUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3FCQUM3SDtnQkFDTCxDQUFDO2dCQUdNLElBQUksQ0FBQyxJQUFZLElBQUcsQ0FBQztnQkFFNUI7O21CQUVHO2dCQUNJLGNBQWMsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO29CQUN0RCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMxQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMxQixJQUFJLFFBQVEsR0FBRyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTt3QkFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsa0JBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2xEO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtnQkFDSCxDQUFDO2FBQ0osQ0FBQTs7WUFsQmtCLHdDQUFjLEdBQUcsSUFBSSxtQkFBTSxFQUFFLENBQUMifQ==