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
    var box2d, testbed, Gears;
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
            Gears = class Gears extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-50.0, 0.0), new box2d.b2Vec2(50.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const circle1 = new box2d.b2CircleShape();
                        circle1.m_radius = 1.0;
                        const box = new box2d.b2PolygonShape();
                        box.SetAsBox(0.5, 5.0);
                        const circle2 = new box2d.b2CircleShape();
                        circle2.m_radius = 2.0;
                        const bd1 = new box2d.b2BodyDef();
                        bd1.type = box2d.b2BodyType.b2_staticBody;
                        bd1.position.Set(10.0, 9.0);
                        const body1 = this.m_world.CreateBody(bd1);
                        body1.CreateFixture(circle1, 5.0);
                        const bd2 = new box2d.b2BodyDef();
                        bd2.type = box2d.b2BodyType.b2_dynamicBody;
                        bd2.position.Set(10.0, 8.0);
                        const body2 = this.m_world.CreateBody(bd2);
                        body2.CreateFixture(box, 5.0);
                        const bd3 = new box2d.b2BodyDef();
                        bd3.type = box2d.b2BodyType.b2_dynamicBody;
                        bd3.position.Set(10.0, 6.0);
                        const body3 = this.m_world.CreateBody(bd3);
                        body3.CreateFixture(circle2, 5.0);
                        const jd1 = new box2d.b2RevoluteJointDef();
                        jd1.Initialize(body2, body1, bd1.position);
                        const joint1 = this.m_world.CreateJoint(jd1);
                        const jd2 = new box2d.b2RevoluteJointDef();
                        jd2.Initialize(body2, body3, bd3.position);
                        const joint2 = this.m_world.CreateJoint(jd2);
                        const jd4 = new box2d.b2GearJointDef();
                        jd4.bodyA = body1;
                        jd4.bodyB = body3;
                        jd4.joint1 = joint1;
                        jd4.joint2 = joint2;
                        jd4.ratio = circle2.m_radius / circle1.m_radius;
                        this.m_world.CreateJoint(jd4);
                    }
                    {
                        const circle1 = new box2d.b2CircleShape();
                        circle1.m_radius = 1.0;
                        const circle2 = new box2d.b2CircleShape();
                        circle2.m_radius = 2.0;
                        const box = new box2d.b2PolygonShape();
                        box.SetAsBox(0.5, 5.0);
                        const bd1 = new box2d.b2BodyDef();
                        bd1.type = box2d.b2BodyType.b2_dynamicBody;
                        bd1.position.Set(-3.0, 12.0);
                        const body1 = this.m_world.CreateBody(bd1);
                        body1.CreateFixture(circle1, 5.0);
                        const jd1 = new box2d.b2RevoluteJointDef();
                        jd1.bodyA = ground;
                        jd1.bodyB = body1;
                        ground.GetLocalPoint(bd1.position, jd1.localAnchorA);
                        body1.GetLocalPoint(bd1.position, jd1.localAnchorB);
                        jd1.referenceAngle = body1.GetAngle() - ground.GetAngle();
                        this.m_joint1 = this.m_world.CreateJoint(jd1);
                        const bd2 = new box2d.b2BodyDef();
                        bd2.type = box2d.b2BodyType.b2_dynamicBody;
                        bd2.position.Set(0.0, 12.0);
                        const body2 = this.m_world.CreateBody(bd2);
                        body2.CreateFixture(circle2, 5.0);
                        const jd2 = new box2d.b2RevoluteJointDef();
                        jd2.Initialize(ground, body2, bd2.position);
                        this.m_joint2 = this.m_world.CreateJoint(jd2);
                        const bd3 = new box2d.b2BodyDef();
                        bd3.type = box2d.b2BodyType.b2_dynamicBody;
                        bd3.position.Set(2.5, 12.0);
                        const body3 = this.m_world.CreateBody(bd3);
                        body3.CreateFixture(box, 5.0);
                        const jd3 = new box2d.b2PrismaticJointDef();
                        jd3.Initialize(ground, body3, bd3.position, new box2d.b2Vec2(0.0, 1.0));
                        jd3.lowerTranslation = -5.0;
                        jd3.upperTranslation = 5.0;
                        jd3.enableLimit = true;
                        this.m_joint3 = this.m_world.CreateJoint(jd3);
                        const jd4 = new box2d.b2GearJointDef();
                        jd4.bodyA = body1;
                        jd4.bodyB = body2;
                        jd4.joint1 = this.m_joint1;
                        jd4.joint2 = this.m_joint2;
                        jd4.ratio = circle2.m_radius / circle1.m_radius;
                        this.m_joint4 = this.m_world.CreateJoint(jd4);
                        const jd5 = new box2d.b2GearJointDef();
                        jd5.bodyA = body2;
                        jd5.bodyB = body3;
                        jd5.joint1 = this.m_joint2;
                        jd5.joint2 = this.m_joint3;
                        jd5.ratio = -1.0 / circle2.m_radius;
                        this.m_joint5 = this.m_world.CreateJoint(jd5);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new Gears();
                }
            };
            exports_1("Gears", Gears);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VhcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL0dlYXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixRQUFBLE1BQWEsS0FBTSxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQU9yQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2xCO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXJDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztvQkFFRDt3QkFDRSxNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQzt3QkFDMUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBRXZCLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN2QyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQzFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcs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