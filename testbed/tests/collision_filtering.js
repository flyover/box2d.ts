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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, CollisionFiltering;
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
            CollisionFiltering = class CollisionFiltering extends testbed.Test {
                constructor() {
                    super();
                    // Ground body
                    {
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        const sd = new box2d.b2FixtureDef();
                        sd.shape = shape;
                        sd.friction = 0.3;
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        ground.CreateFixture(sd);
                    }
                    // Small triangle
                    const vertices = new Array();
                    vertices[0] = new box2d.b2Vec2(-1.0, 0.0);
                    vertices[1] = new box2d.b2Vec2(1.0, 0.0);
                    vertices[2] = new box2d.b2Vec2(0.0, 2.0);
                    const polygon = new box2d.b2PolygonShape();
                    polygon.Set(vertices, 3);
                    const triangleShapeDef = new box2d.b2FixtureDef();
                    triangleShapeDef.shape = polygon;
                    triangleShapeDef.density = 1.0;
                    triangleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
                    triangleShapeDef.filter.categoryBits = CollisionFiltering.k_triangleCategory;
                    triangleShapeDef.filter.maskBits = CollisionFiltering.k_triangleMask;
                    const triangleBodyDef = new box2d.b2BodyDef();
                    triangleBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    triangleBodyDef.position.Set(-5.0, 2.0);
                    const body1 = this.m_world.CreateBody(triangleBodyDef);
                    body1.CreateFixture(triangleShapeDef);
                    // Large triangle (recycle definitions)
                    vertices[0].SelfMul(2.0);
                    vertices[1].SelfMul(2.0);
                    vertices[2].SelfMul(2.0);
                    polygon.Set(vertices, 3);
                    triangleShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
                    triangleBodyDef.position.Set(-5.0, 6.0);
                    triangleBodyDef.fixedRotation = true; // look at me!
                    const body2 = this.m_world.CreateBody(triangleBodyDef);
                    body2.CreateFixture(triangleShapeDef);
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(-5.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const p = new box2d.b2PolygonShape();
                        p.SetAsBox(0.5, 1.0);
                        body.CreateFixture(p, 1.0);
                        const jd = new box2d.b2PrismaticJointDef();
                        jd.bodyA = body2;
                        jd.bodyB = body;
                        jd.enableLimit = true;
                        jd.localAnchorA.Set(0.0, 4.0);
                        jd.localAnchorB.SetZero();
                        jd.localAxisA.Set(0.0, 1.0);
                        jd.lowerTranslation = -1.0;
                        jd.upperTranslation = 1.0;
                        this.m_world.CreateJoint(jd);
                    }
                    // Small box
                    polygon.SetAsBox(1.0, 0.5);
                    const boxShapeDef = new box2d.b2FixtureDef();
                    boxShapeDef.shape = polygon;
                    boxShapeDef.density = 1.0;
                    boxShapeDef.restitution = 0.1;
                    boxShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
                    boxShapeDef.filter.categoryBits = CollisionFiltering.k_boxCategory;
                    boxShapeDef.filter.maskBits = CollisionFiltering.k_boxMask;
                    const boxBodyDef = new box2d.b2BodyDef();
                    boxBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    boxBodyDef.position.Set(0.0, 2.0);
                    const body3 = this.m_world.CreateBody(boxBodyDef);
                    body3.CreateFixture(boxShapeDef);
                    // Large box (recycle definitions)
                    polygon.SetAsBox(2.0, 1.0);
                    boxShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
                    boxBodyDef.position.Set(0.0, 6.0);
                    const body4 = this.m_world.CreateBody(boxBodyDef);
                    body4.CreateFixture(boxShapeDef);
                    // Small circle
                    const circle = new box2d.b2CircleShape();
                    circle.m_radius = 1.0;
                    const circleShapeDef = new box2d.b2FixtureDef();
                    circleShapeDef.shape = circle;
                    circleShapeDef.density = 1.0;
                    circleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
                    circleShapeDef.filter.categoryBits = CollisionFiltering.k_circleCategory;
                    circleShapeDef.filter.maskBits = CollisionFiltering.k_circleMask;
                    const circleBodyDef = new box2d.b2BodyDef();
                    circleBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    circleBodyDef.position.Set(5.0, 2.0);
                    const body5 = this.m_world.CreateBody(circleBodyDef);
                    body5.CreateFixture(circleShapeDef);
                    // Large circle
                    circle.m_radius *= 2.0;
                    circleShapeDef.filter.groupIndex = CollisionFiltering.k_largeGroup;
                    circleBodyDef.position.Set(5.0, 6.0);
                    const body6 = this.m_world.CreateBody(circleBodyDef);
                    body6.CreateFixture(circleShapeDef);
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new CollisionFiltering();
                }
            };
            exports_1("CollisionFiltering", CollisionFiltering);
            CollisionFiltering.k_smallGroup = 1;
            CollisionFiltering.k_largeGroup = -1;
            CollisionFiltering.k_defaultCategory = 0x0001;
            CollisionFiltering.k_triangleCategory = 0x0002;
            CollisionFiltering.k_boxCategory = 0x0004;
            CollisionFiltering.k_circleCategory = 0x0008;
            CollisionFiltering.k_triangleMask = 0xFFFF;
            CollisionFiltering.k_boxMask = 0xFFFF ^ CollisionFiltering.k_triangleCategory;
            CollisionFiltering.k_circleMask = 0xFFFF;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGlzaW9uX2ZpbHRlcmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbGxpc2lvbl9maWx0ZXJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLHFCQUFBLE1BQWEsa0JBQW1CLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBV2xEO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLGNBQWM7b0JBQ2Q7d0JBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFFckUsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNqQixFQUFFLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFFbEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMzQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMxQjtvQkFFRCxpQkFBaUI7b0JBQ2pCLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQzdCLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzFDLFFBQVEsQ0FBQyxDQUFDLENBQUMs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