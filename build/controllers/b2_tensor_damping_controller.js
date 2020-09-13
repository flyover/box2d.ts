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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfdGVuc29yX2RhbXBpbmdfY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250cm9sbGVycy9iMl90ZW5zb3JfZGFtcGluZ19jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFVSDs7OztlQUlHO1lBQ0gsNEJBQUEsTUFBYSx5QkFBMEIsU0FBUSwrQkFBWTtnQkFBM0Q7O29CQUNJLGtDQUFrQztvQkFDbEIsTUFBQyxHQUFHLElBQUksb0JBQU8sRUFBRSxDQUFDO29CQUNsQzs7OztzQkFJRTtvQkFDRiw0RkFBNEY7b0JBRTVGLDhFQUE4RTtvQkFDdkUsZ0JBQVcsR0FBRyxDQUFDLENBQUM7Z0JBaUQzQixDQUFDO2dCQWhERyxpSUFBaUk7Z0JBRWpJOzttQkFFRztnQkFDSSxJQUFJLENBQUMsSUFBZ0I7b0JBQ3hCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksUUFBUSxJQUFJLDJCQUFVLEVBQUU7d0JBQ3hCLE9BQU87cUJBQ1Y7b0JBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTt3QkFDckQsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7cUJBQy9CO29CQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQzdDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7NEJBQ2pCLFNBQVM7eUJBQ1o7d0JBQ0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FDbkMsb0JBQU8sQ0FBQyxLQUFLLENBQ1QsSUFBSSxDQUFDLENBQUMsRUFDTixJQUFJLENBQUMsY0FBYyxDQUNuQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFDeEIsbUJBQU0sQ0FBQyxJQUFJLENBQUMsRUFDWixtQkFBTSxDQUFDLElBQUksQ0FBQyxFQUNoQix5QkFBeUIsQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDMUMsOEVBQThFO3dCQUM5RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsbUJBQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxtQkFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLG1CQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDN0g7Z0JBQ0wsQ0FBQztnQkFHTSxJQUFJLENBQUMsSUFBWSxJQUFHLENBQUM7Z0JBRTVCOzttQkFFRztnQkFDSSxjQUFjLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtvQkFDdEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7d0JBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLGtCQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3FCQUNsRDt5QkFBTTt3QkFDTCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztxQkFDdEI7Z0JBQ0gsQ0FBQzthQUNKLENBQUE7O1lBbEJrQix3Q0FBYyxHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDIn0=