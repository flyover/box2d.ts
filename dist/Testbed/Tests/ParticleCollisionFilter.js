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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, ParticleContactDisabler, ParticleCollisionFilter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            // Optionally disables particle / fixture and particle / particle contacts.
            ParticleContactDisabler = class ParticleContactDisabler extends box2d.b2ContactFilter {
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
                    this.m_world.SetGravity(new box2d.b2Vec2(0, 0));
                    // Create the container.
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2ChainShape();
                        const vertices = [
                            new box2d.b2Vec2(-ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                            new box2d.b2Vec2(ParticleCollisionFilter.kBoxSize, -ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                            new box2d.b2Vec2(ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                            new box2d.b2Vec2(-ParticleCollisionFilter.kBoxSize, ParticleCollisionFilter.kBoxSize + ParticleCollisionFilter.kOffset),
                        ];
                        shape.CreateLoop(vertices);
                        const def = new box2d.b2FixtureDef();
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
                        const shape = new box2d.b2PolygonShape();
                        // shape.SetAsBox(1.5f, 1.5f, b2Vec2(kBoxSizeHalf, kBoxSizeHalf + kOffset), 0.0f);
                        shape.SetAsBox(1.5, 1.5, new box2d.b2Vec2(ParticleCollisionFilter.kBoxSizeHalf, ParticleCollisionFilter.kBoxSizeHalf + ParticleCollisionFilter.kOffset), 0.0);
                        // b2ParticleGroupDef pd;
                        const pd = new box2d.b2ParticleGroupDef();
                        // pd.shape = &shape;
                        pd.shape = shape;
                        // pd.flags = b2_powderParticle
                        // 		| b2_particleContactFilterParticle
                        // 		| b2_fixtureContactFilterParticle;
                        pd.flags = box2d.b2ParticleFlag.b2_powderParticle
                            | box2d.b2ParticleFlag.b2_particleContactFilterParticle
                            | box2d.b2ParticleFlag.b2_fixtureContactFilterParticle;
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
            ParticleCollisionFilter.kBoxSize = 10.0;
            ParticleCollisionFilter.kBoxSizeHalf = ParticleCollisionFilter.kBoxSize / 2;
            ParticleCollisionFilter.kOffset = 20.0;
            ParticleCollisionFilter.kParticlesContainerSize = ParticleCollisionFilter.kOffset + 0.5;
            ParticleCollisionFilter.kSpeedup = 8.0;
            exports_1("ParticleCollisionFilter", ParticleCollisionFilter);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVDb2xsaXNpb25GaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL1BhcnRpY2xlQ29sbGlzaW9uRmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFPRiwyRUFBMkU7WUFDM0UsMEJBQUEsNkJBQXFDLFNBQVEsS0FBSyxDQUFDLGVBQWU7Z0JBQWxFOztvQkFDUyxzQ0FBaUMsR0FBRyxJQUFJLENBQUM7b0JBQ3pDLHVDQUFrQyxHQUFHLElBQUksQ0FBQztnQkFXbkQsQ0FBQztnQkFUQyxzRUFBc0U7Z0JBQy9ELDRCQUE0QjtvQkFDakMsT0FBTyxJQUFJLENBQUMsaUNBQWlDLENBQUM7Z0JBQ2hELENBQUM7Z0JBRUQseURBQXlEO2dCQUNsRCw2QkFBNkI7b0JBQ2xDLE9BQU8sSUFBSSxDQUFDLGtDQUFrQyxDQUFDO2dCQUNqRCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCwwQkFBQSw2QkFBcUMsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDdkQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBNEhILHNCQUFpQixHQUE0QixJQUFJLHVCQUF1QixFQUFFLENBQUM7b0JBMUhoRixxREFBcUQ7b0JBQ3JELDJEQUEyRDtvQkFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFFdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVoRCx3QkFBd0I7b0JBQ3hCO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFF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