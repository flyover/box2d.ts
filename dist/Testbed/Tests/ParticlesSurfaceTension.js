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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, ParticlesSurfaceTension;
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
            ParticlesSurfaceTension = class ParticlesSurfaceTension extends testbed.Test {
                constructor() {
                    super(); // base class constructor
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-4, -1),
                                new box2d.b2Vec2(4, -1),
                                new box2d.b2Vec2(4, 0),
                                new box2d.b2Vec2(-4, 0),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-4, -0.1),
                                new box2d.b2Vec2(-2, -0.1),
                                new box2d.b2Vec2(-2, 2),
                                new box2d.b2Vec2(-4, 2),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(2, -0.1),
                                new box2d.b2Vec2(4, -0.1),
                                new box2d.b2Vec2(4, 2),
                                new box2d.b2Vec2(2, 2),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_p.Set(0, 2);
                        shape.m_radius = 0.5;
                        const pd = new box2d.b2ParticleGroupDef();
                        pd.flags = box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_colorMixingParticle;
                        pd.shape = shape;
                        pd.color.Set(1, 0, 0, 1);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_p.Set(-1, 2);
                        shape.m_radius = 0.5;
                        const pd = new box2d.b2ParticleGroupDef();
                        pd.flags = box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_colorMixingParticle;
                        pd.shape = shape;
                        pd.color.Set(0, 1, 0, 1);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        const shape = new box2d.b2PolygonShape();
                        const vertices = [
                            new box2d.b2Vec2(0, 3),
                            new box2d.b2Vec2(2, 3),
                            new box2d.b2Vec2(2, 3.5),
                            new box2d.b2Vec2(0, 3.5),
                        ];
                        shape.Set(vertices, 4);
                        const pd = new box2d.b2ParticleGroupDef();
                        pd.flags = box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_colorMixingParticle;
                        pd.shape = shape;
                        pd.color.Set(0, 0, 1, 1);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        const body = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2CircleShape();
                        shape.m_p.Set(0, 8);
                        shape.m_radius = 0.5;
                        body.CreateFixture(shape, 0.5);
                    }
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new ParticlesSurfaceTension();
                }
            };
            exports_1("ParticlesSurfaceTension", ParticlesSurfaceTension);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVzU3VyZmFjZVRlbnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL1BhcnRpY2xlc1N1cmZhY2VUZW5zaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFPSCwwQkFBQSxNQUFhLHVCQUF3QixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUN2RDtvQkFDRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtvQkFFbEM7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQzs0QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDekMsTUFBTSxRQUFRLEdBQUc7Z0NBQ2YsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUN4QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUN2QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDdEIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDeEIsQ0FBQzs0QkFDRixLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDdkIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQ2xDO3dCQUVEOzRCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN6QyxNQUFNLFFB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