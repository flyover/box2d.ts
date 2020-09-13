/*
* Copyright (c) 2015 Google, Inc.
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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, ParticleContactDisabler, ParticleCollisionFilter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            // Optionally disables particle / fixture and particle / particle contacts.
            ParticleContactDisabler = class ParticleContactDisabler extends b2.ContactFilter {
                constructor() {
                    super(...arguments);
                    this.m_enableFixtureParticleCollisions = true;
                    this.m_enableParticleParticleCollisions = true;
                }
                // Blindly enable / disable collisions between fixtures and particles.
                ShouldCollideFixtureParticle() {
                    return this.m_enableFixtureParticleCollisions;
                }
                // Blindly enable / disable collisions between particles.
                ShouldCollideParticleParticle() {
                    return this.m_enableParticleParticleCollisions;
                }
            };
            exports_1("ParticleContactDisabler", ParticleContactDisabler);
            ParticleCollisionFilter = class ParticleCollisionFilter extends testbed.Test {
                constructor() {
                    super();
                    this.m_contactDisabler = new ParticleContactDisabler();
                    // must also set b2_particleContactFilterParticle and
                    // b2_fixtureContactFilterParticle flags for particle group
                    this.m_world.SetContactFilter(this.m_contactDisabler);
                    this.m_world.SetGravity(new b2.Vec2(0, 0));
                    // Create the container.
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.ChainShape();
                        const vertices = [
                            new b2.Vec2(-ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                            new b2.Vec2(ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                            new b2.Vec2(ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                            new b2.Vec2(-ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                        ];
                        shape.CreateLoop(vertices);
                        const def = new b2.FixtureDef();
                        def.shape = shape;
                        def.density = 0;
                        def.density = 0;
                        def.restitution = 1.0;
                        ground.CreateFixture(def);
                    }
                    // create the particles
                    this.m_particleSystem.SetRadius(0.5);
                    {
                        // b2PolygonShape shape;
                        const shape = new b2.PolygonShape();
                        // shape.SetAsBox(1.5f, 1.5f, b2Vec2(kBoxSizeHalf, kBoxSizeHalf + kOffset), 0.0f);
                        shape.SetAsBox(1.5, 1.5, new b2.Vec2(ParticleCollisionFilter.kBoxSizeHalf, ParticleCollisionFilter.kBoxSizeHalf + ParticleCollisionFilter.kOffset), 0.0);
                        // b2ParticleGroupDef pd;
                        const pd = new b2.ParticleGroupDef();
                        // pd.shape = &shape;
                        pd.shape = shape;
                        // pd.flags = b2_powderParticle
                        // 		| b2_particleContactFilterParticle
                        // 		| b2_fixtureContactFilterParticle;
                        pd.flags = b2.ParticleFlag.b2_powderParticle
                            | b2.ParticleFlag.b2_particleContactFilterParticle
                            | b2.ParticleFlag.b2_fixtureContactFilterParticle;
                        // m_particleGroup =
                        // 	m_particleSystem.CreateParticleGroup(pd);
                        this.m_particleGroup = this.m_particleSystem.CreateParticleGroup(pd);
                        // b2Vec2* velocities =
                        // 	m_particleSystem.GetVelocityBuffer() +
                        // 	m_particleGroup.GetBufferIndex();
                        const velocities = this.m_particleSystem.GetVelocityBuffer();
                        const index = this.m_particleGroup.GetBufferIndex();
                        // for (int i = 0; i < m_particleGroup.GetParticleCount(); ++i) {
                        // 	b2Vec2& v = *(velocities + i);
                        // 	v.Set(RandomFloat(), RandomFloat());
                        // 	v.Normalize();
                        // 	v *= kSpeedup;
                        // }
                        for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
                            const v = velocities[index + i];
                            v.Set(testbed.RandomFloat(), testbed.RandomFloat());
                            v.SelfNormalize();
                            v.SelfMul(ParticleCollisionFilter.kSpeedup);
                        }
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // const int32 index = m_particleGroup.GetBufferIndex();
                    const index = this.m_particleGroup.GetBufferIndex();
                    // b2Vec2* const velocities =
                    // 	m_particleSystem.GetVelocityBuffer() + index;
                    const velocities = this.m_particleSystem.GetVelocityBuffer();
                    // for (int32 i = 0; i < m_particleGroup.GetParticleCount(); i++) {
                    // 	// Add energy to particles based upon the temperature.
                    // 	b2Vec2& v = velocities[i];
                    // 	v.Normalize();
                    // 	v *= kSpeedup;
                    // }
                    for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
                        const v = velocities[index + i];
                        v.SelfNormalize();
                        v.SelfMul(ParticleCollisionFilter.kSpeedup);
                    }
                    // key help
                    {
                        const k_keys = [
                            "Keys: (a) toggle Fixture collisions",
                            "      (s) toggle particle collisions",
                        ];
                        for (let i = 0; i < k_keys.length; ++i) {
                            testbed.g_debugDraw.DrawString(5, this.m_textLine, k_keys[i]);
                            this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.ToggleFixtureCollisions();
                            break;
                        case "s":
                            this.ToggleParticleCollisions();
                            break;
                        default:
                            super.Keyboard(key);
                            break;
                    }
                }
                ToggleFixtureCollisions() {
                    this.m_contactDisabler.m_enableFixtureParticleCollisions = !this.m_contactDisabler.m_enableFixtureParticleCollisions;
                }
                ToggleParticleCollisions() {
                    this.m_contactDisabler.m_enableParticleParticleCollisions = !this.m_contactDisabler.m_enableParticleParticleCollisions;
                }
                static Create() {
                    return new ParticleCollisionFilter();
                }
            };
            exports_1("ParticleCollisionFilter", ParticleCollisionFilter);
            ParticleCollisionFilter.kBoxSize = 10.0;
            ParticleCollisionFilter.kBoxSizeHalf = ParticleCollisionFilter.kBoxSize / 2;
            ParticleCollisionFilter.kOffset = 20.0;
            ParticleCollisionFilter.kParticlesContainerSize = ParticleCollisionFilter.kOffset + 0.5;
            ParticleCollisionFilter.kSpeedup = 8.0;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGljbGVfY29sbGlzaW9uX2ZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3BhcnRpY2xlX2NvbGxpc2lvbl9maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQU9GLDJFQUEyRTtZQUMzRSwwQkFBQSxNQUFhLHVCQUF3QixTQUFRLEVBQUUsQ0FBQyxhQUFhO2dCQUE3RDs7b0JBQ1Msc0NBQWlDLEdBQUcsSUFBSSxDQUFDO29CQUN6Qyx1Q0FBa0MsR0FBRyxJQUFJLENBQUM7Z0JBV25ELENBQUM7Z0JBVEMsc0VBQXNFO2dCQUMvRCw0QkFBNEI7b0JBQ2pDLE9BQU8sSUFBSSxDQUFDLGlDQUFpQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUVELHlEQUF5RDtnQkFDbEQsNkJBQTZCO29CQUNsQyxPQUFPLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQztnQkFDakQsQ0FBQzthQUNGLENBQUE7O1lBRUQsMEJBQUEsTUFBYSx1QkFBd0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDdkQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBNEhILHNCQUFpQixHQUE0QixJQUFJLHVCQUF1QixFQUFFLENBQUM7b0JBMUhoRixxREFBcUQ7b0JBQ3JELDJEQUEyRDtvQkFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFFdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUUzQyx3QkFBd0I7b0JBQ3hCO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxF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