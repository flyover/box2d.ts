/*
 * Copyright (c) 2013 Google, Inc.
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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2Draw"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function b2CalculateParticleIterations(gravity, radius, timeStep) {
        // In some situations you may want more particle iterations than this,
        // but to avoid excessive cycle cost, don't recommend more than this.
        const B2_MAX_RECOMMENDED_PARTICLE_ITERATIONS = 8;
        const B2_RADIUS_THRESHOLD = 0.01;
        const iterations = Math.ceil(Math.sqrt(gravity / (B2_RADIUS_THRESHOLD * radius)) * timeStep);
        return b2Math_1.b2Clamp(iterations, 1, B2_MAX_RECOMMENDED_PARTICLE_ITERATIONS);
    }
    exports_1("b2CalculateParticleIterations", b2CalculateParticleIterations);
    var b2Settings_1, b2Math_1, b2Draw_1, b2ParticleFlag, b2ParticleDef, b2ParticleHandle;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Draw_1_1) {
                b2Draw_1 = b2Draw_1_1;
            }
        ],
        execute: function () {
            /**
             * The particle type. Can be combined with the | operator.
             */
            (function (b2ParticleFlag) {
                /// Water particle.
                b2ParticleFlag[b2ParticleFlag["b2_waterParticle"] = 0] = "b2_waterParticle";
                /// Removed after next simulation step.
                b2ParticleFlag[b2ParticleFlag["b2_zombieParticle"] = 2] = "b2_zombieParticle";
                /// Zero velocity.
                b2ParticleFlag[b2ParticleFlag["b2_wallParticle"] = 4] = "b2_wallParticle";
                /// With restitution from stretching.
                b2ParticleFlag[b2ParticleFlag["b2_springParticle"] = 8] = "b2_springParticle";
                /// With restitution from deformation.
                b2ParticleFlag[b2ParticleFlag["b2_elasticParticle"] = 16] = "b2_elasticParticle";
                /// With viscosity.
                b2ParticleFlag[b2ParticleFlag["b2_viscousParticle"] = 32] = "b2_viscousParticle";
                /// Without isotropic pressure.
                b2ParticleFlag[b2ParticleFlag["b2_powderParticle"] = 64] = "b2_powderParticle";
                /// With surface tension.
                b2ParticleFlag[b2ParticleFlag["b2_tensileParticle"] = 128] = "b2_tensileParticle";
                /// Mix color between contacting particles.
                b2ParticleFlag[b2ParticleFlag["b2_colorMixingParticle"] = 256] = "b2_colorMixingParticle";
                /// Call b2DestructionListener on destruction.
                b2ParticleFlag[b2ParticleFlag["b2_destructionListenerParticle"] = 512] = "b2_destructionListenerParticle";
                /// Prevents other particles from leaking.
                b2ParticleFlag[b2ParticleFlag["b2_barrierParticle"] = 1024] = "b2_barrierParticle";
                /// Less compressibility.
                b2ParticleFlag[b2ParticleFlag["b2_staticPressureParticle"] = 2048] = "b2_staticPressureParticle";
                /// Makes pairs or triads with other particles.
                b2ParticleFlag[b2ParticleFlag["b2_reactiveParticle"] = 4096] = "b2_reactiveParticle";
                /// With high repulsive force.
                b2ParticleFlag[b2ParticleFlag["b2_repulsiveParticle"] = 8192] = "b2_repulsiveParticle";
                /// Call b2ContactListener when this particle is about to interact with
                /// a rigid body or stops interacting with a rigid body.
                /// This results in an expensive operation compared to using
                /// b2_fixtureContactFilterParticle to detect collisions between
                /// particles.
                b2ParticleFlag[b2ParticleFlag["b2_fixtureContactListenerParticle"] = 16384] = "b2_fixtureContactListenerParticle";
                /// Call b2ContactListener when this particle is about to interact with
                /// another particle or stops interacting with another particle.
                /// This results in an expensive operation compared to using
                /// b2_particleContactFilterParticle to detect collisions between
                /// particles.
                b2ParticleFlag[b2ParticleFlag["b2_particleContactListenerParticle"] = 32768] = "b2_particleContactListenerParticle";
                /// Call b2ContactFilter when this particle interacts with rigid bodies.
                b2ParticleFlag[b2ParticleFlag["b2_fixtureContactFilterParticle"] = 65536] = "b2_fixtureContactFilterParticle";
                /// Call b2ContactFilter when this particle interacts with other
                /// particles.
                b2ParticleFlag[b2ParticleFlag["b2_particleContactFilterParticle"] = 131072] = "b2_particleContactFilterParticle";
            })(b2ParticleFlag || (b2ParticleFlag = {}));
            exports_1("b2ParticleFlag", b2ParticleFlag);
            b2ParticleDef = class b2ParticleDef {
                constructor() {
                    this.flags = 0;
                    this.position = new b2Math_1.b2Vec2();
                    this.velocity = new b2Math_1.b2Vec2();
                    this.color = new b2Draw_1.b2Color();
                    this.lifetime = 0.0;
                    this.userData = null;
                    this.group = null;
                }
            };
            exports_1("b2ParticleDef", b2ParticleDef);
            b2ParticleHandle = class b2ParticleHandle {
                constructor() {
                    this.m_index = b2Settings_1.b2_invalidParticleIndex;
                }
                GetIndex() { return this.m_index; }
                SetIndex(index) { this.m_index = index; }
            };
            exports_1("b2ParticleHandle", b2ParticleHandle);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQYXJ0aWNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyUGFydGljbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7SUFzRUgsdUNBQThDLE9BQWUsRUFBRSxNQUFjLEVBQUUsUUFBZ0I7UUFDN0Ysc0VBQXNFO1FBQ3RFLHFFQUFxRTtRQUNyRSxNQUFNLHNDQUFzQyxHQUFHLENBQUMsQ0FBQztRQUNqRCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUNqQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztRQUM3RixPQUFPLGdCQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7WUFwRUQ7O2VBRUc7WUFDSCxXQUFrQixjQUFjO2dCQUM5QixtQkFBbUI7Z0JBQ25CLDJFQUFvQixDQUFBO2dCQUNwQix1Q0FBdUM7Z0JBQ3ZDLDZFQUEwQixDQUFBO2dCQUMxQixrQkFBa0I7Z0JBQ2xCLHlFQUF3QixDQUFBO2dCQUN4QixxQ0FBcUM7Z0JBQ3JDLDZFQUEwQixDQUFBO2dCQUMxQixzQ0FBc0M7Z0JBQ3RDLGdGQUEyQixDQUFBO2dCQUMzQixtQkFBbUI7Z0JBQ25CLGdGQUEyQixDQUFBO2dCQUMzQiwrQkFBK0I7Z0JBQy9CLDhFQUEwQixDQUFBO2dCQUMxQix5QkFBeUI7Z0JBQ3pCLGlGQUEyQixDQUFBO2dCQUMzQiwyQ0FBMkM7Z0JBQzNDLHlGQUErQixDQUFBO2dCQUMvQiw4Q0FBOEM7Z0JBQzlDLHlHQUF1QyxDQUFBO2dCQUN2QywwQ0FBMEM7Z0JBQzFDLGtGQUE0QixDQUFBO2dCQUM1Qix5QkFBeUI7Z0JBQ3pCLGdHQUFtQyxDQUFBO2dCQUNuQywrQ0FBK0M7Z0JBQy9DLG9GQUE2QixDQUFBO2dCQUM3Qiw4QkFBOEI7Z0JBQzlCLHNGQUE4QixDQUFBO2dCQUM5Qix1RUFBdUU7Z0JBQ3ZFLHdEQUF3RDtnQkFDeEQsNERBQTREO2dCQUM1RCxnRUFBZ0U7Z0JBQ2hFLGNBQWM7Z0JBQ2QsaUhBQTJDLENBQUE7Z0JBQzNDLHVFQUF1RTtnQkFDdkUsZ0VBQWdFO2dCQUNoRSw0REFBNEQ7Z0JBQzVELGlFQUFpRTtnQkFDakUsY0FBYztnQkFDZCxtSEFBNEMsQ0FBQTtnQkFDNUMsd0VBQXdFO2dCQUN4RSw2R0FBeUMsQ0FBQTtnQkFDekMsZ0VBQWdFO2dCQUNoRSxjQUFjO2dCQUNkLGdIQUEwQyxDQUFBO1lBQzVDLENBQUMsRUE5Q2lCLGNBQWMsS0FBZCxjQUFjLFFBOEMvQjs7WUFFRCxnQkFBQTtnQkFBQTtvQkFDRSxVQUFLLEdBQW1CLENBQUMsQ0FBQztvQkFDMUIsYUFBUSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ2hDLGFBQVEsR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUNoQyxVQUFLLEdBQVksSUFBSSxnQkFBTyxFQUFFLENBQUM7b0JBQy9CLGFBQVEsR0FBVyxHQUFHLENBQUM7b0JBQ3ZCLGFBQVEsR0FBUSxJQUFJLENBQUM7b0JBQ3JCLFVBQUssR0FBb0IsSUFBSSxDQUFDO2dCQUNoQyxDQUFDO2FBQUEsQ0FBQTs7WUFXRCxtQkFBQTtnQkFBQTtvQkFDUyxZQUFPLEdBQVcsb0NBQXVCLENBQUM7Z0JBR25ELENBQUM7Z0JBRlEsUUFBUSxLQUFhLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLFFBQVEsQ0FBQyxLQUFhLElBQVUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQy9ELENBQUEifQ==