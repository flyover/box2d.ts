// MIT License
System.register(["@box2d"], function (exports_1, context_1) {
    "use strict";
    var b2, Settings;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            }
        ],
        execute: function () {
            Settings = class Settings {
                constructor() {
                    this.m_testIndex = 0;
                    this.m_windowWidth = 1600;
                    this.m_windowHeight = 900;
                    this.m_hertz = 60;
                    this.m_velocityIterations = 8;
                    this.m_positionIterations = 3;
                    // #if B2_ENABLE_PARTICLE
                    // Particle iterations are needed for numerical stability in particle
                    // simulations with small particles and relatively high gravity.
                    // b2CalculateParticleIterations helps to determine the number.
                    this.m_particleIterations = b2.CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
                    // #endif
                    this.m_drawShapes = true;
                    // #if B2_ENABLE_PARTICLE
                    this.m_drawParticles = true;
                    // #endif
                    this.m_drawJoints = false;
                    this.m_drawAABBs = false;
                    this.m_drawContactPoints = false;
                    this.m_drawContactNormals = false;
                    this.m_drawContactImpulse = false;
                    this.m_drawFrictionImpulse = false;
                    this.m_drawCOMs = false;
                    this.m_drawControllers = true;
                    this.m_drawStats = false;
                    this.m_drawProfile = false;
                    this.m_enableWarmStarting = true;
                    this.m_enableContinuous = true;
                    this.m_enableSubStepping = false;
                    this.m_enableSleep = true;
                    this.m_pause = false;
                    this.m_singleStep = false;
                    // #if B2_ENABLE_PARTICLE
                    this.m_strictContacts = false;
                }
                // #endif
                Reset() {
                    this.m_testIndex = 0;
                    this.m_windowWidth = 1600;
                    this.m_windowHeight = 900;
                    this.m_hertz = 60;
                    this.m_velocityIterations = 8;
                    this.m_positionIterations = 3;
                    // #if B2_ENABLE_PARTICLE
                    // Particle iterations are needed for numerical stability in particle
                    // simulations with small particles and relatively high gravity.
                    // b2CalculateParticleIterations helps to determine the number.
                    this.m_particleIterations = b2.CalculateParticleIterations(10, 0.04, 1 / this.m_hertz);
                    // #endif
                    this.m_drawShapes = true;
                    // #if B2_ENABLE_PARTICLE
                    this.m_drawParticles = true;
                    // #endif
                    this.m_drawJoints = false;
                    this.m_drawAABBs = false;
                    this.m_drawContactPoints = false;
                    this.m_drawContactNormals = false;
                    this.m_drawContactImpulse = false;
                    this.m_drawFrictionImpulse = false;
                    this.m_drawCOMs = false;
                    // #if B2_ENABLE_CONTROLLER
                    this.m_drawControllers = true;
                    // #endif
                    this.m_drawStats = false;
                    this.m_drawProfile = false;
                    this.m_enableWarmStarting = true;
                    this.m_enableContinuous = true;
                    this.m_enableSubStepping = false;
                    this.m_enableSleep = true;
                    this.m_pause = false;
                    this.m_singleStep = false;
                    // #if B2_ENABLE_PARTICLE
                    this.m_strictContacts = false;
                    // #endif
                }
                Save() { }
                Load() { }
            };
            exports_1("Settings", Settings);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxjQUFjOzs7Ozs7Ozs7Ozs7WUF3QmQsV0FBQSxNQUFhLFFBQVE7Z0JBQXJCO29CQUNTLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixrQkFBYSxHQUFXLElBQUksQ0FBQztvQkFDN0IsbUJBQWMsR0FBVyxHQUFHLENBQUM7b0JBQzdCLFlBQU8sR0FBVyxFQUFFLENBQUM7b0JBQ3JCLHlCQUFvQixHQUFXLENBQUMsQ0FBQztvQkFDakMseUJBQW9CLEdBQVcsQ0FBQyxDQUFDO29CQUN4Qyx5QkFBeUI7b0JBQ3pCLHFFQUFxRTtvQkFDckUsZ0VBQWdFO29CQUNoRSwrREFBK0Q7b0JBQ3hELHlCQUFvQixHQUFXLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pHLFNBQVM7b0JBQ0YsaUJBQVksR0FBWSxJQUFJLENBQUM7b0JBQ3BDLHlCQUF5QjtvQkFDbEIsb0JBQWUsR0FBWSxJQUFJLENBQUM7b0JBQ3ZDLFNBQVM7b0JBQ0YsaUJBQVksR0FBWSxLQUFLLENBQUM7b0JBQzlCLGdCQUFXLEdBQVksS0FBSyxDQUFDO29CQUM3Qix3QkFBbUIsR0FBWSxLQUFLLENBQUM7b0JBQ3JDLHlCQUFvQixHQUFZLEtBQUssQ0FBQztvQkFDdEMseUJBQW9CLEdBQVksS0FBSyxDQUFDO29CQUN0QywwQkFBcUIsR0FBWSxLQUFLLENBQUM7b0JBQ3ZDLGVBQVUsR0FBWSxLQUFLLENBQUM7b0JBQzVCLHNCQUFpQixHQUFZLElBQUksQ0FBQztvQkFDbEMsZ0JBQVcsR0FBWSxLQUFLLENBQUM7b0JBQzdCLGtCQUFhLEdBQVksS0FBSyxDQUFDO29CQUMvQix5QkFBb0IsR0FBWSxJQUFJLENBQUM7b0JBQ3JDLHVCQUFrQixHQUFZLElBQUksQ0FBQztvQkFDbkMsd0JBQW1CLEdBQVksS0FBSyxDQUFDO29CQUNyQyxrQkFBYSxHQUFZLElBQUksQ0FBQztvQkFDOUIsWUFBTyxHQUFZLEtBQUssQ0FBQztvQkFDekIsaUJBQVksR0FBWSxLQUFLLENBQUM7b0JBQ3JDLHlCQUF5QjtvQkFDbEIscUJBQWdCLEdBQVksS0FBSyxDQUFDO2dCQTZDM0MsQ0FBQztnQkE1Q0MsU0FBUztnQkFFRixLQUFLO29CQUNWLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztvQkFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7b0JBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO29CQUNsQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO29CQUM5Qix5QkFBeUI7b0JBQ3pCLHFFQUFxRTtvQkFDckUsZ0VBQWdFO29CQUNoRSwrREFBK0Q7b0JBQy9ELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUMsMkJBQTJCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN2RixTQUFTO29CQUNULElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUN6Qix5QkFBeUI7b0JBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO29CQUM1QixTQUFTO29CQUNULElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO29CQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztvQkFDekIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztvQkFDakMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztvQkFDbEMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztvQkFDbEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7b0JBQ3hCLDJCQUEyQjtvQkFDM0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztvQkFDOUIsU0FBUztvQkFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztvQkFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7b0JBQzNCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7b0JBQy9CLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO29CQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7b0JBQzFCLHlCQUF5QjtvQkFDekIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztvQkFDOUIsU0FBUztnQkFDWCxDQUFDO2dCQUVNLElBQUksS0FBVyxDQUFDO2dCQUNoQixJQUFJLEtBQVcsQ0FBQzthQUN4QixDQUFBIn0=