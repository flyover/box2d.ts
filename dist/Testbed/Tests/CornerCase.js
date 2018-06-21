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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, CornerCase;
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
            CornerCase = class CornerCase extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        // Construct a pathological corner intersection out of many
                        // polygons to ensure there's no issue with particle oscillation
                        // from many fixture contact impulses at the corner
                        // left edge
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-20.0, 30.0),
                                new box2d.b2Vec2(-20.0, 0.0),
                                new box2d.b2Vec2(-25.0, 0.0),
                                new box2d.b2Vec2(-25.0, 30.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                        const yrange = 30.0, ystep = yrange / 10.0, xrange = 20.0, xstep = xrange / 2.0;
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-25.0, 0.0),
                                new box2d.b2Vec2(20.0, 15.0),
                                new box2d.b2Vec2(25.0, 0.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                        for (let x = -xrange; x < xrange; x += xstep) {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-25.0, 0.0),
                                new box2d.b2Vec2(x, 15.0),
                                new box2d.b2Vec2(x + xstep, 15.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                        for (let y = 0.0; y < yrange; y += ystep) {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(25.0, y),
                                new box2d.b2Vec2(25.0, y + ystep),
                                new box2d.b2Vec2(20.0, 15.0),
                            ];
                            shape.Set(vertices);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(1.0);
                    const particleType = testbed.Test.GetParticleParameterValue();
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_p.Set(0, 35);
                        shape.m_radius = 12;
                        const pd = new box2d.b2ParticleGroupDef();
                        pd.flags = particleType;
                        pd.shape = shape;
                        const group = this.m_particleSystem.CreateParticleGroup(pd);
                        if (pd.flags & box2d.b2ParticleFlag.b2_colorMixingParticle) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ybmVyQ2FzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvQ29ybmVyQ2FzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsYUFBQSxnQkFBd0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFDMUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQywyREFBMkQ7d0JBQzNELGdFQUFnRTt3QkFDaEUsbURBQW1EO3dCQUVuRCxZQUFZO3dCQUNaOzRCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN6QyxNQUFNLFFBQVEsR0FBRztnQ0FDZixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2dDQUM3QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO2dDQUM1QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO2dDQUM1QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDOzZCQUM5QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ3BCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQzt3QkFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQ2pCLEtBQUssR0FBRyxNQUFNLEdBQUcsSUFBSSxFQUNyQixNQUFNLEdBQUcs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