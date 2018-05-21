/*
 * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, ElasticParticles;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {/*
             * Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
            ElasticParticles = class ElasticParticles extends testbed.Test {
                constructor() {
                    super();
                    {
                        let bd = new box2d.b2BodyDef();
                        let ground = this.m_world.CreateBody(bd);
                        {
                            let shape = new box2d.b2PolygonShape();
                            let vertices = [
                                new box2d.b2Vec2(-4, -1),
                                new box2d.b2Vec2(4, -1),
                                new box2d.b2Vec2(4, 0),
                                new box2d.b2Vec2(-4, 0)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            let shape = new box2d.b2PolygonShape();
                            let vertices = [
                                new box2d.b2Vec2(-4, -0.1),
                                new box2d.b2Vec2(-2, -0.1),
                                new box2d.b2Vec2(-2, 2),
                                new box2d.b2Vec2(-4, 2)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            let shape = new box2d.b2PolygonShape();
                            let vertices = [
                                new box2d.b2Vec2(2, -0.1),
                                new box2d.b2Vec2(4, -0.1),
                                new box2d.b2Vec2(4, 2),
                                new box2d.b2Vec2(2, 2)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(0.035 * 3); // HACK: increase particle radius
                    {
                        let shape = new box2d.b2CircleShape();
                        shape.m_p.Set(0, 3);
                        shape.m_radius = 0.5;
                        let pd = new box2d.b2ParticleGroupDef();
                        pd.flags = 8 /* b2_springParticle */;
                        pd.groupFlags = 1 /* b2_solidParticleGroup */;
                        pd.shape = shape;
                        pd.color.Set(1, 0, 0, 1);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        let shape = new box2d.b2CircleShape();
                        shape.m_p.Set(-1, 3);
                        shape.m_radius = 0.5;
                        let pd = new box2d.b2ParticleGroupDef();
                        pd.flags = 16 /* b2_elasticParticle */;
                        pd.groupFlags = 1 /* b2_solidParticleGroup */;
                        pd.shape = shape;
                        pd.color.Set(0, 1, 0, 1);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        let shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(1, 0.5);
                        let pd = new box2d.b2ParticleGroupDef();
                        pd.flags = 16 /* b2_elasticParticle */;
                        pd.groupFlags = 1 /* b2_solidParticleGroup */;
                        pd.position.Set(1, 4);
                        pd.angle = -0.5;
                        pd.angularVelocity = 2.0;
                        pd.shape = shape;
                        pd.color.Set(0, 0, 1, 1);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        let bd = new box2d.b2BodyDef();
                        bd.type = 2 /* b2_dynamicBody */;
                        let body = this.m_world.CreateBody(bd);
                        let shape = new box2d.b2CircleShape();
                        shape.m_p.Set(0, 8);
                        shape.m_radius = 0.5;
                        body.CreateFixture(shape, 0.5);
                    }
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new ElasticParticles();
                }
            };
            exports_1("ElasticParticles", ElasticParticles);
            ///#endif
        }
    };
});
