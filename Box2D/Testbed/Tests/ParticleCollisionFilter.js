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
System.register(["../../Box2D/Box2D", "../Testbed"], function (exports_1, context_1) {
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
                            "      (s) toggle particle collisions"
                        ];
                        for (let i = 0; i < k_keys.length; ++i) {
                            testbed.g_debugDraw.DrawString(5, this.m_textLine, k_keys[i]);
                            this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case 'a':
                            this.ToggleFixtureCollisions();
                            break;
                        case 's':
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVDb2xsaXNpb25GaWx0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJQYXJ0aWNsZUNvbGxpc2lvbkZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBT0YsMkVBQTJFO1lBQzNFLDBCQUFBLDZCQUFxQyxTQUFRLEtBQUssQ0FBQyxlQUFlO2dCQUFsRTs7b0JBQ0Usc0NBQWlDLEdBQUcsSUFBSSxDQUFDO29CQUN6Qyx1Q0FBa0MsR0FBRyxJQUFJLENBQUM7Z0JBVzVDLENBQUM7Z0JBVEMsc0VBQXNFO2dCQUN0RSw0QkFBNEI7b0JBQzFCLE9BQU8sSUFBSSxDQUFDLGlDQUFpQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUVELHlEQUF5RDtnQkFDekQsNkJBQTZCO29CQUMzQixPQUFPLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQztnQkFDakQsQ0FBQzthQUNGLENBQUE7O1lBRUQsMEJBQUEsNkJBQXFDLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQ3ZEO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQTRIVixzQkFBaUIsR0FBNEIsSUFBSSx1QkFBdUIsRUFBRSxDQUFDO29CQTFIekUscURBQXFEO29CQUNyRCwyREFBMkQ7b0JBQzNELElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBRXRELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFaEQsd0JBQXdCO29CQUN4Qjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzNDLE1BQU0s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