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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfdGltZV9zdGVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJfdGltZV9zdGVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRiw4Q0FBOEM7WUFDOUMsWUFBQSxNQUFhLFNBQVM7Z0JBQXRCO29CQUNTLFNBQUksR0FBVyxDQUFDLENBQUM7b0JBQ2pCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLFVBQUssR0FBVyxDQUFDLENBQUM7b0JBQ2xCLGNBQVMsR0FBVyxDQUFDLENBQUM7b0JBQ3RCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO29CQUMxQixrQkFBYSxHQUFXLENBQUMsQ0FBQztvQkFDMUIsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFDdkIsYUFBUSxHQUFXLENBQUMsQ0FBQztnQkFhOUIsQ0FBQztnQkFYUSxLQUFLO29CQUNWLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO29CQUNkLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFDZixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFBOztZQUVELGtDQUFrQztZQUNsQyxhQUFBLE1BQWEsVUFBVTtnQkFBdkI7b0JBQ1MsT0FBRSxHQUFXLENBQUMsQ0FBQyxDQUFDLFlBQVk7b0JBQzVCLFdBQU0sR0FBVyxDQUFDLENBQUMsQ0FBQyxvQ0FBb0M7b0JBQ3hELFlBQU8sR0FBVyxDQUFDLENBQUMsQ0FBQyxlQUFlO29CQUNwQyx1QkFBa0IsR0FBVyxDQUFDLENBQUM7b0JBQy9CLHVCQUFrQixHQUFXLENBQUMsQ0FBQztvQkFDdEMseUJBQXlCO29CQUNsQix1QkFBa0IsR0FBVyxDQUFDLENBQUM7b0JBQ3RDLFNBQVM7b0JBQ0YsaUJBQVksR0FBWSxLQUFLLENBQUM7Z0JBY3ZDLENBQUM7Z0JBWlEsSUFBSSxDQUFDLElBQWdCO29CQUMxQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUM1QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO29CQUNsRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO29CQUNsRCx5QkFBeUI7b0JBQ3pCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUM7b0JBQ2xELFNBQVM7b0JBQ1QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO29CQUN0QyxPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxhQUFBLE1BQWEsVUFBVTtnQkFBdkI7b0JBQ2tCLE1BQUMsR0FBVyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztvQkFDbEMsTUFBQyxHQUFXLENBQUMsQ0FBQztnQkFLdkIsQ0FBQztnQkFIUSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWM7b0JBQ3BDLE9BQU8sNEJBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFTLEVBQWMsRUFBRSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDMUUsQ0FBQzthQUNGLENBQUE7O1lBRUQsYUFBQSxNQUFhLFVBQVU7Z0JBQXZCO29CQUNrQixNQUFDLEdBQVcsSUFBSSxtQkFBTSxFQUFFLENBQUM7b0JBQ2xDLE1BQUMsR0FBVyxDQUFDLENBQUM7Z0JBS3ZCLENBQUM7Z0JBSFEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFjO29CQUNwQyxPQUFPLDRCQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBUyxFQUFjLEVBQUUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUM7Z0JBQzFFLENBQUM7YUFDRixDQUFBOztZQUVELGVBQUEsTUFBYSxZQUFZO2dCQUF6QjtvQkFDa0IsU0FBSSxHQUFlLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBR3RELENBQUM7YUFBQSxDQUFBIn0=