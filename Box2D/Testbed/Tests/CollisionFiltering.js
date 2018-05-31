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
            CollisionFiltering.k_smallGroup = 1;
            CollisionFiltering.k_largeGroup = -1;
            CollisionFiltering.k_defaultCategory = 0x0001;
            CollisionFiltering.k_triangleCategory = 0x0002;
            CollisionFiltering.k_boxCategory = 0x0004;
            CollisionFiltering.k_circleCategory = 0x0008;
            CollisionFiltering.k_triangleMask = 0xFFFF;
            CollisionFiltering.k_boxMask = 0xFFFF ^ CollisionFiltering.k_triangleCategory;
            CollisionFiltering.k_circleMask = 0xFFFF;
            exports_1("CollisionFiltering", CollisionFiltering);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGlzaW9uRmlsdGVyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ29sbGlzaW9uRmlsdGVyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixxQkFBQSx3QkFBZ0MsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFXbEQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsY0FBYztvQkFDZDt3QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUVyRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDcEMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUVsQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzNDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzFCO29CQUVELGlCQUFpQjtvQkFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztvQkFDN0IsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDMUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElB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