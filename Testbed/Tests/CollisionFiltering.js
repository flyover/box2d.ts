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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sbGlzaW9uRmlsdGVyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ29sbGlzaW9uRmlsdGVyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixxQkFBQSxNQUFhLGtCQUFtQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVdsRDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixjQUFjO29CQUNkO3dCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBRXJFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUNwQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDakIsRUFBRSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBRWxCLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDMUI7b0JBRUQsaUJBQWlCO29CQUNqQixNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO29CQUM3QixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUMxQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdB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