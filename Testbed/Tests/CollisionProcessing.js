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
    var box2d, testbed, CollisionProcessing;
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
            CollisionProcessing = class CollisionProcessing extends testbed.Test {
                constructor() {
                    super();
                    // Ground body
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        const sd = new box2d.b2FixtureDef();
                        sd.shape = shape;
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        ground.CreateFixture(sd);
                    }
                    const xLo = -5.0, xHi = 5.0;
                    const yLo = 2.0, yHi = 35.0;
                    // Small triangle
                    const vertices = new Array(3);
                    vertices[0] = new box2d.b2Vec2(-1.0, 0.0);
                    vertices[1] = new box2d.b2Vec2(1.0, 0.0);
                    vertices[2] = new box2d.b2Vec2(0.0, 2.0);
                    const polygon = new box2d.b2PolygonShape();
                    polygon.Set(vertices, 3);
                    const triangleShapeDef = new box2d.b2FixtureDef();
                    triangleShapeDef.shape = polygon;
                    triangleShapeDef.density = 1.0;
                    const triangleBodyDef = new box2d.b2BodyDef();
                    triangleBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    triangleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));
                    const body1 = this.m_world.CreateBody(triangleBodyDef);
                    body1.CreateFixture(triangleShapeDef);
                    // Large triangle (recycle definitions)
                    vertices[0].SelfMul(2.0);
                    vertices[1].SelfMul(2.0);
                    vertices[2].SelfMul(2.0);
                    polygon.Set(vertices, 3);
                    triangleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));
                    const body2 = this.m_world.CreateBody(triangleBodyDef);
                    body2.CreateFixture(triangleShapeDef);
                    // Small box
                    polygon.SetAsBox(1.0, 0.5);
                    const boxShapeDef = new box2d.b2FixtureDef();
                    boxShapeDef.shape = polygon;
                    boxShapeDef.density = 1.0;
                    const boxBodyDef = new box2d.b2BodyDef();
                    boxBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    boxBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));
                    const body3 = this.m_world.CreateBody(boxBodyDef);
                    body3.CreateFixture(boxShapeDef);
                    // Large box (recycle definitions)
                    polygon.SetAsBox(2.0, 1.0);
                    boxBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));
                    const body4 = this.m_world.CreateBody(boxBodyDef);
                    body4.CreateFixture(boxShapeDef);
                    // Small circle
                    const circle = new box2d.b2CircleShape();
                    circle.m_radius = 1.0;
                    const circleShapeDef = new box2d.b2FixtureDef();
                    circleShapeDef.shape = circle;
                    circleShapeDef.density = 1.0;
                    const circleBodyDef = new box2d.b2BodyDef();
                    circleBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    circleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));
                    const body5 = this.m_world.CreateBody(circleBodyDef);
                    body5.CreateFixture(circleShapeDef);
                    // Large circle
                    circle.m_radius *= 2.0;
                    circleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));
                    const body6 = this.m_world.CreateBody(circleBodyDef);
                    body6.CreateFixture(circleShapeDef);
                }
                Step(settings) {
                    super.Step(settings);
                    // We are going to destroy some bodies according to contact
                    // points. We must buffer the bodies that should be destroyed
                    // because they may belong to multiple contact points.
                    const k_maxNuke = 6;
                    const nuke = new Array(k_maxNuke);
                    let nukeCount = 0;
                    // Traverse the contact results. Destroy bodies that
                    // are touching heavier bodies.
                    for (let i = 0; i < this.m_pointCount; ++i) {
                        const point = this.m_points[i];
                        const body1 = point.fixtureA.GetBody();
                        const body2 = point.fixtureB.GetBody();
                        const mass1 = body1.GetMass();
                        const mass2 = body2.GetMass();
                        if (mass1 > 0.0 && mass2 > 0.0) {
                            if (mass2 > mass1) {
                                nuke[nukeCount++] = body1;
                            }
                            else {
                                nuke[nukeCount++] = body2;
                            }
                            if (nukeCount === k_maxNuke) {
                                break;
                            }
                        }
                    }
                    // Sort the nuke array to group duplicates.
                    nuke.sort((a, b) => {
                        return a - b;
                    });
                    // Destroy the bodies, skipping duplicates.
                    let i = 0;
                    while (i < nukeCount) {
                        const b = nuke[i++];
                        while (i < nukeCount && nuke[i] === b) {
                            ++i;
                        }
                        if (b !== this.m_bomb) {
                            this.m_world.DestroyBody(b);
                        }
                    }
                }
                static Create() {
                    return new CollisionProcessing();
                }
            };
            exports_1("CollisionProcessing", CollisionProcessing);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGlzaW9uUHJvY2Vzc2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbGxpc2lvblByb2Nlc3NpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLHNCQUFBLE1BQWEsbUJBQW9CLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQ25EO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLGNBQWM7b0JBQ2Q7d0JBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFFckUsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUVqQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzFCO29CQUVELE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxFQUNkLEdBQUcsR0FBRyxHQUFHLENBQUM7b0JBQ1osTUFBTSxHQUFHLEdBQUcsR0FBRyxFQUNiLEdBQUcsR0FBRyxJQUFJLENBQUM7b0JBRWIsaUJBQWlCO29CQUNqQixNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElB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