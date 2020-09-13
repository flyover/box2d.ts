/*
 * Copyright (c) 2014 Google, Inc.
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
    var b2, testbed, CornerCase;
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
            CornerCase = class CornerCase extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        // Construct a pathological corner intersection out of many
                        // polygons to ensure there's no issue with particle oscillation
                        // from many fixture contact impulses at the corner
                        // left edge
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-20.0, 30.0),
                                new b2.Vec2(-20.0, 0.0),
                                new b2.Vec2(-25.0, 0.0),
                                new b2.Vec2(-25.0, 30.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                        const yrange = 30.0, ystep = yrange / 10.0, xrange = 20.0, xstep = xrange / 2.0;
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-25.0, 0.0),
                                new b2.Vec2(20.0, 15.0),
                                new b2.Vec2(25.0, 0.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                        for (let x = -xrange; x < xrange; x += xstep) {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-25.0, 0.0),
                                new b2.Vec2(x, 15.0),
                                new b2.Vec2(x + xstep, 15.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                        for (let y = 0.0; y < yrange; y += ystep) {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(25.0, y),
                                new b2.Vec2(25.0, y + ystep),
                                new b2.Vec2(20.0, 15.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(1.0);
                    const particleType = testbed.Test.GetParticleParameterValue();
                    {
                        const shape = new b2.CircleShape();
                        shape.m_p.Set(0, 35);
                        shape.m_radius = 12;
                        const pd = new b2.ParticleGroupDef();
                        pd.flags = particleType;
                        pd.shape = shape;
                        const group = this.m_particleSystem.CreateParticleGroup(pd);
                        if (pd.flags & b2.ParticleFlag.b2_colorMixingParticle) {
                            this.ColorParticleGroup(group, 0);
                        }
                    }
                }
                static Create() {
                    return new CornerCase();
                }
            };
            exports_1("CornerCase", CornerCase);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ybmVyX2Nhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9jb3JuZXJfY2FzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsYUFBQSxNQUFhLFVBQVcsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDMUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQzVCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQywyREFBMkQ7d0JBQzNELGdFQUFnRTt3QkFDaEUsbURBQW1EO3dCQUVuRCxZQUFZO3dCQUNaOzRCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUNwQyxNQUFNLFFBQVEsR0FBRztnQ0FDZixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dDQUN4QixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO2dDQUN2QixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO2dDQUN2QixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDOzZCQUN6QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ3BCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQzt3QkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQ2pCLEtBQUssR0FBRyxNQUFNLEdBQUcsSUFBSSxFQUNyQixNQUFNLEdBQUcsSUFBSSxF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