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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, RigidParticles;
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
            RigidParticles = class RigidParticles extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-4, -1),
                                new b2.Vec2(4, -1),
                                new b2.Vec2(4, 0),
                                new b2.Vec2(-4, 0),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-4, -0.1),
                                new b2.Vec2(-2, -0.1),
                                new b2.Vec2(-2, 2),
                                new b2.Vec2(-4, 2),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(2, -0.1),
                                new b2.Vec2(4, -0.1),
                                new b2.Vec2(4, 2),
                                new b2.Vec2(2, 2),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(0.035 * 2); // HACK: increase particle radius
                    {
                        const shape = new b2.CircleShape();
                        shape.m_p.Set(0, 3);
                        shape.m_radius = 0.5;
                        const pd = new b2.ParticleGroupDef();
                        pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup | b2.ParticleGroupFlag.b2_solidParticleGroup;
                        pd.shape = shape;
                        pd.color.SetByteRGBA(255, 0, 0, 255);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        const shape = new b2.CircleShape();
                        shape.m_p.Set(-1, 3);
                        shape.m_radius = 0.5;
                        const pd = new b2.ParticleGroupDef();
                        pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup | b2.ParticleGroupFlag.b2_solidParticleGroup;
                        pd.shape = shape;
                        pd.color.SetByteRGBA(0, 255, 0, 255);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        const shape = new b2.PolygonShape();
                        //const vertices = [
                        //  new b2.Vec2(0, 3),
                        //  new b2.Vec2(2, 3),
                        //  new b2.Vec2(2, 3.5),
                        //  new b2.Vec2(0, 3.5)
                        //];
                        //shape.Set(vertices, 4);
                        shape.SetAsBox(1, 0.5);
                        const pd = new b2.ParticleGroupDef();
                        pd.groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup | b2.ParticleGroupFlag.b2_solidParticleGroup;
                        pd.position.Set(1, 4);
                        pd.angle = -0.5;
                        pd.angularVelocity = 2.0;
                        pd.shape = shape;
                        pd.color.SetByteRGBA(0, 0, 255, 255);
                        this.m_particleSystem.CreateParticleGroup(pd);
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.CircleShape();
                        shape.m_p.Set(0, 8);
                        shape.m_radius = 0.5;
                        body.CreateFixture(shape, 0.5);
                    }
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new RigidParticles();
                }
            };
            exports_1("RigidParticles", RigidParticles);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlnaWRfcGFydGljbGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvcmlnaWRfcGFydGljbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFPSCxpQkFBQSxNQUFhLGNBQWUsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDOUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQzVCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQzs0QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs0QkFDcEMsTUFBTSxRQUFRLEdBQUc7Z0NBQ2YsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUNuQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUNsQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDakIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDbkIsQ0FBQzs0QkFDRixLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDdkIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQ2xDO3dCQUVEOzRCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUNwQyxNQUFNLFFBQVEsR0FBRztnQ0FDZixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FB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