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
            exports_1("ParticleCollisionFilter", ParticleCollisionFilter);
            ParticleCollisionFilter.kBoxSize = 10.0;
            ParticleCollisionFilter.kBoxSizeHalf = ParticleCollisionFilter.kBoxSize / 2;
            ParticleCollisionFilter.kOffset = 20.0;
            ParticleCollisionFilter.kParticlesContainerSize = ParticleCollisionFilter.kOffset + 0.5;
            ParticleCollisionFilter.kSpeedup = 8.0;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVDb2xsaXNpb25GaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJQYXJ0aWNsZUNvbGxpc2lvbkZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBT0YsMkVBQTJFO1lBQzNFLDBCQUFBLE1BQWEsdUJBQXdCLFNBQVEsS0FBSyxDQUFDLGVBQWU7Z0JBQWxFOztvQkFDUyxzQ0FBaUMsR0FBRyxJQUFJLENBQUM7b0JBQ3pDLHVDQUFrQyxHQUFHLElBQUksQ0FBQztnQkFXbkQsQ0FBQztnQkFUQyxzRUFBc0U7Z0JBQy9ELDRCQUE0QjtvQkFDakMsT0FBTyxJQUFJLENBQUMsaUNBQWlDLENBQUM7Z0JBQ2hELENBQUM7Z0JBRUQseURBQXlEO2dCQUNsRCw2QkFBNkI7b0JBQ2xDLE9BQU8sSUFBSSxDQUFDLGtDQUFrQyxDQUFDO2dCQUNqRCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCwwQkFBQSxNQUFhLHVCQUF3QixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUN2RDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkE0SEgsc0JBQWlCLEdBQTRCLElBQUksdUJBQXVCLEVBQUUsQ0FBQztvQkExSGhGLHFEQUFxRDtvQkFDckQsMkRBQTJEO29CQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUV0RCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRWhELHdCQUF3QjtvQkFDeEI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dC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