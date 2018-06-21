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
    var box2d, testbed, Pointy;
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
            /**
             * Test behavior when particles fall on a convex ambigious Body
             * contact fixture junction.
             */
            Pointy = class Pointy extends testbed.Test {
                constructor() {
                    super();
                    this.m_killfieldShape = new box2d.b2PolygonShape();
                    this.m_killfieldTransform = new box2d.b2Transform();
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        // Construct a triangle out of many polygons to ensure there's no
                        // issue with particles falling directly on an ambiguous corner
                        const xstep = 1.0;
                        for (let x = -10.0; x < 10.0; x += xstep) {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(x, -10.0),
                                new box2d.b2Vec2(x + xstep, -10.0),
                                new box2d.b2Vec2(0.0, 25.0),
                            ];
                            shape.Set(vertices, 3);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
                    const particleType = testbed.Test.GetParticleParameterValue();
                    if (particleType === box2d.b2ParticleFlag.b2_waterParticle) {
                        this.m_particleSystem.SetDamping(0.2);
                    }
                    // Create killfield shape and transform
                    this.m_killfieldShape = new box2d.b2PolygonShape();
                    this.m_killfieldShape.SetAsBox(50.0, 1.0);
                    // Put this at the bottom of the world
                    this.m_killfieldTransform = new box2d.b2Transform();
                    const loc = new box2d.b2Vec2(-25, 1);
                    this.m_killfieldTransform.SetPositionAngle(loc, 0);
                }
                Step(settings) {
                    super.Step(settings);
                    const flags = testbed.Test.GetParticleParameterValue();
                    const pd = new box2d.b2ParticleDef();
                    pd.position.Set(0.0, 33.0);
                    pd.velocity.Set(0.0, -1.0);
                    pd.flags = flags;
                    if (flags & (box2d.b2ParticleFlag.b2_springParticle | box2d.b2ParticleFlag.b2_elasticParticle)) {
                        const count = this.m_particleSystem.GetParticleCount();
                        pd.velocity.Set(count & 1 ? -1.0 : 1.0, -5.0);
                        pd.flags |= box2d.b2ParticleFlag.b2_reactiveParticle;
                    }
                    this.m_particleSystem.CreateParticle(pd);
                    // kill every particle near the bottom of the screen
                    this.m_particleSystem.DestroyParticlesInShape(this.m_killfieldShape, this.m_killfieldTransform);
                }
                static Create() {
                    return new Pointy();
                }
            };
            exports_1("Pointy", Pointy);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9pbnR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9Qb2ludHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9IOzs7ZUFHRztZQUVILFNBQUEsWUFBb0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFJdEM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSkgscUJBQWdCLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQzlDLHlCQUFvQixHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUtwRDt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLGlFQUFpRTt3QkFDakUsK0RBQStEO3dCQUUvRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUM7d0JBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFOzRCQUN4QyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDekMsTUFBTSxRQUFRLEdBQUc7Z0NBQ2YsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztnQ0FDMUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0NBQ2xDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDOzZCQUM1QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMs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