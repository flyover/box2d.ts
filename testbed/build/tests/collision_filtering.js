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
    var b2, testbed, CollisionFiltering;
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
            CollisionFiltering = class CollisionFiltering extends testbed.Test {
                constructor() {
                    super();
                    // Ground body
                    {
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        const sd = new b2.FixtureDef();
                        sd.shape = shape;
                        sd.friction = 0.3;
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        ground.CreateFixture(sd);
                    }
                    // Small triangle
                    const vertices = new Array();
                    vertices[0] = new b2.Vec2(-1.0, 0.0);
                    vertices[1] = new b2.Vec2(1.0, 0.0);
                    vertices[2] = new b2.Vec2(0.0, 2.0);
                    const polygon = new b2.PolygonShape();
                    polygon.Set(vertices, 3);
                    const triangleShapeDef = new b2.FixtureDef();
                    triangleShapeDef.shape = polygon;
                    triangleShapeDef.density = 1.0;
                    triangleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
                    triangleShapeDef.filter.categoryBits = CollisionFiltering.k_triangleCategory;
                    triangleShapeDef.filter.maskBits = CollisionFiltering.k_triangleMask;
                    const triangleBodyDef = new b2.BodyDef();
                    triangleBodyDef.type = b2.BodyType.b2_dynamicBody;
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
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(-5.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const p = new b2.PolygonShape();
                        p.SetAsBox(0.5, 1.0);
                        body.CreateFixture(p, 1.0);
                        const jd = new b2.PrismaticJointDef();
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
                    const boxShapeDef = new b2.FixtureDef();
                    boxShapeDef.shape = polygon;
                    boxShapeDef.density = 1.0;
                    boxShapeDef.restitution = 0.1;
                    boxShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
                    boxShapeDef.filter.categoryBits = CollisionFiltering.k_boxCategory;
                    boxShapeDef.filter.maskBits = CollisionFiltering.k_boxMask;
                    const boxBodyDef = new b2.BodyDef();
                    boxBodyDef.type = b2.BodyType.b2_dynamicBody;
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
                    const circle = new b2.CircleShape();
                    circle.m_radius = 1.0;
                    const circleShapeDef = new b2.FixtureDef();
                    circleShapeDef.shape = circle;
                    circleShapeDef.density = 1.0;
                    circleShapeDef.filter.groupIndex = CollisionFiltering.k_smallGroup;
                    circleShapeDef.filter.categoryBits = CollisionFiltering.k_circleCategory;
                    circleShapeDef.filter.maskBits = CollisionFiltering.k_circleMask;
                    const circleBodyDef = new b2.BodyDef();
                    circleBodyDef.type = b2.BodyType.b2_dynamicBody;
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
            CollisionFiltering.k_triangleCategory = 0x0002;
            CollisionFiltering.k_boxCategory = 0x0004;
            CollisionFiltering.k_circleCategory = 0x0008;
            CollisionFiltering.k_triangleMask = 0xFFFF;
            CollisionFiltering.k_boxMask = 0xFFFF ^ CollisionFiltering.k_triangleCategory;
            CollisionFiltering.k_circleMask = 0xFFFF;
        }
    };
});
//# sourceMappingURL=collision_filtering.js.map