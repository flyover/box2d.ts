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
System.register(["./b2Controller", "../Common/b2Math", "../Common/b2Settings"], function (exports_1, context_1) {
    "use strict";
    var b2Controller_1, b2Math_1, b2Settings_1, b2TensorDampingController;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Controller_1_1) {
                b2Controller_1 = b2Controller_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            }
        ],
        execute: function () {
            /**
             * Applies top down linear damping to the controlled bodies
             * The damping is calculated by multiplying velocity by a matrix
             * in local co-ordinates.
             */
            b2TensorDampingController = class b2TensorDampingController extends b2Controller_1.b2Controller {
                constructor() {
                    super(...arguments);
                    /// Tensor to use in damping model
                    this.T = new b2Math_1.b2Mat22();
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
                    if (timestep <= b2Settings_1.b2_epsilon) {
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
                        const damping = body.GetWorldVector(b2Math_1.b2Mat22.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity(), b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t1), b2TensorDampingController.Step_s_damping);
                        //    body->SetLinearVelocity(body->GetLinearVelocity() + timestep * damping);
                        body.SetLinearVelocity(b2Math_1.b2Vec2.AddVV(body.GetLinearVelocity(), b2Math_1.b2Vec2.MulSV(timestep, damping, b2Math_1.b2Vec2.s_t0), b2Math_1.b2Vec2.s_t1));
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
                        this.maxTimestep = 1 / b2Math_1.b2Max(xDamping, yDamping);
                    }
                    else {
                        this.maxTimestep = 0;
                    }
                }
            };
            b2TensorDampingController.Step_s_damping = new b2Math_1.b2Vec2();
            exports_1("b2TensorDampingController", b2TensorDampingController);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJUZW5zb3JEYW1waW5nQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL0NvbnRyb2xsZXJzL2IyVGVuc29yRGFtcGluZ0NvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVVIOzs7O2VBSUc7WUFDSCw0QkFBQSwrQkFBdUMsU0FBUSwyQkFBWTtnQkFBM0Q7O29CQUNJLGtDQUFrQztvQkFDbEIsTUFBQyxHQUFHLElBQUksZ0JBQU8sRUFBRSxDQUFDO29CQUNsQzs7OztzQkFJRTtvQkFDRiw0RkFBNEY7b0JBRTVGLDhFQUE4RTtvQkFDdkUsZ0JBQVcsR0FBRyxDQUFDLENBQUM7Z0JBaUQzQixDQUFDO2dCQWhERyxpSUFBaUk7Z0JBRWpJOzttQkFFRztnQkFDSSxJQUFJLENBQUMsSUFBZ0I7b0JBQ3hCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksUUFBUSxJQUFJLHVCQUFVLEVBQUU7d0JBQ3hCLE9BQU87cUJBQ1Y7b0JBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTt3QkFDckQsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7cUJBQy9CO29CQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUU7d0JBQzdDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7NEJBQ2pCLFNBQVM7eUJBQ1o7d0JBQ0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FDbkMsZ0JBQU8sQ0FBQyxLQUFLLENBQ1QsSUFBSSxDQUFDLENBQUMsRUFDTixJQUFJLENBQUMsY0FBYyxDQUNuQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFDeEIsZUFBTSxDQUFDLElBQUksQ0FBQyxFQUNaLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFDaEIseUJBQXlCLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBQzFDLDhFQUE4RTt3QkFDOUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsZUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGVBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxlQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztxQkFDN0g7Z0JBQ0wsQ0FBQztnQkFHTSxJQUFJLENBQUMsSUFBWSxJQUFHLENBQUM7Z0JBRTVCOzttQkFFRztnQkFDSSxjQUFjLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtvQkFDdEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7d0JBQ2hDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLGNBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2xEO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtnQkFDSCxDQUFDO2FBQ0osQ0FBQTtZQWxCa0Isd0NBQWMsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDIn0=