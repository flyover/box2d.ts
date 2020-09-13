/*
* Copyright (c) 2006-2011 Erin Catto http://www.box2d.org
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
System.register(["../common/b2_settings.js", "../common/b2_math.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2Profile, b2TimeStep, b2Position, b2Velocity, b2SolverData;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            }
        ],
        execute: function () {
            /// Profiling data. Times are in milliseconds.
            b2Profile = class b2Profile {
                constructor() {
                    this.step = 0;
                    this.collide = 0;
                    this.solve = 0;
                    this.solveInit = 0;
                    this.solveVelocity = 0;
                    this.solvePosition = 0;
                    this.broadphase = 0;
                    this.solveTOI = 0;
                }
                Reset() {
                    this.step = 0;
                    this.collide = 0;
                    this.solve = 0;
                    this.solveInit = 0;
                    this.solveVelocity = 0;
                    this.solvePosition = 0;
                    this.broadphase = 0;
                    this.solveTOI = 0;
                    return this;
                }
            };
            exports_1("b2Profile", b2Profile);
            /// This is an internal structure.
            b2TimeStep = class b2TimeStep {
                constructor() {
                    this.dt = 0; // time step
                    this.inv_dt = 0; // inverse time step (0 if dt == 0).
                    this.dtRatio = 0; // dt * inv_dt0
                    this.velocityIterations = 0;
                    this.positionIterations = 0;
                    // #if B2_ENABLE_PARTICLE
                    this.particleIterations = 0;
                    // #endif
                    this.warmStarting = false;
                }
                Copy(step) {
                    this.dt = step.dt;
                    this.inv_dt = step.inv_dt;
                    this.dtRatio = step.dtRatio;
                    this.positionIterations = step.positionIterations;
                    this.velocityIterations = step.velocityIterations;
                    // #if B2_ENABLE_PARTICLE
                    this.particleIterations = step.particleIterations;
                    // #endif
                    this.warmStarting = step.warmStarting;
                    return this;
                }
            };
            exports_1("b2TimeStep", b2TimeStep);
            b2Position = class b2Position {
                constructor() {
                    this.c = new b2_math_js_1.b2Vec2();
                    this.a = 0;
                }
                static MakeArray(length) {
                    return b2_settings_js_1.b2MakeArray(length, (i) => new b2Position());
                }
            };
            exports_1("b2Position", b2Position);
            b2Velocity = class b2Velocity {
                constructor() {
                    this.v = new b2_math_js_1.b2Vec2();
                    this.w = 0;
                }
                static MakeArray(length) {
                    return b2_settings_js_1.b2MakeArray(length, (i) => new b2Velocity());
                }
            };
            exports_1("b2Velocity", b2Velocity);
            b2SolverData = class b2SolverData {
                constructor() {
                    this.step = new b2TimeStep();
                }
            };
            exports_1("b2SolverData", b2SolverData);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfdGltZV9zdGVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R5bmFtaWNzL2IyX3RpbWVfc3RlcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsOENBQThDO1lBQzlDLFlBQUEsTUFBYSxTQUFTO2dCQUF0QjtvQkFDUyxTQUFJLEdBQVcsQ0FBQyxDQUFDO29CQUNqQixZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUNwQixVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUNsQixjQUFTLEdBQVcsQ0FBQyxDQUFDO29CQUN0QixrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7b0JBQzFCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLGFBQVEsR0FBVyxDQUFDLENBQUM7Z0JBYTlCLENBQUM7Z0JBWFEsS0FBSztvQkFDVixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztvQkFDZCxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7b0JBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNsQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxrQ0FBa0M7WUFDbEMsYUFBQSxNQUFhLFVBQVU7Z0JBQXZCO29CQUNTLE9BQUUsR0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFZO29CQUM1QixXQUFNLEdBQVcsQ0FBQyxDQUFDLENBQUMsb0NBQW9DO29CQUN4RCxZQUFPLEdBQVcsQ0FBQyxDQUFDLENBQUMsZUFBZTtvQkFDcEMsdUJBQWtCLEdBQVcsQ0FBQyxDQUFDO29CQUMvQix1QkFBa0IsR0FBVyxDQUFDLENBQUM7b0JBQ3RDLHlCQUF5QjtvQkFDbEIsdUJBQWtCLEdBQVcsQ0FBQyxDQUFDO29CQUN0QyxTQUFTO29CQUNGLGlCQUFZLEdBQVksS0FBSyxDQUFDO2dCQWN2QyxDQUFDO2dCQVpRLElBQUksQ0FBQyxJQUFnQjtvQkFDMUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDNUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbEQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbEQseUJBQXlCO29CQUN6QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO29CQUNsRCxTQUFTO29CQUNULElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztvQkFDdEMsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUE7O1lBRUQsYUFBQSxNQUFhLFVBQVU7Z0JBQXZCO29CQUNrQixNQUFDLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7b0JBQ2xDLE1BQUMsR0FBVyxDQUFDLENBQUM7Z0JBS3ZCLENBQUM7Z0JBSFEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO29CQUNwQyxPQUFPLDRCQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBUyxFQUFjLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUM7Z0JBQzFFLENBQUM7YUFDRixDQUFBOztZQUVELGFBQUEsTUFBYSxVQUFVO2dCQUF2QjtvQkFDa0IsTUFBQyxHQUFXLElBQUksbUJBQU0sRUFBRSxDQUFDO29CQUNsQyxNQUFDLEdBQVcsQ0FBQyxDQUFDO2dCQUt2QixDQUFDO2dCQUhRLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBYztvQkFDcEMsT0FBTyw0QkFBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQVMsRUFBYyxFQUFFLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDO2dCQUMxRSxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxlQUFBLE1BQWEsWUFBWTtnQkFBekI7b0JBQ2tCLFNBQUksR0FBZSxJQUFJLFVBQVUsRUFBRSxDQUFDO2dCQUd0RCxDQUFDO2FBQUEsQ0FBQSJ9