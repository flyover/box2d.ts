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
    var box2d, testbed, Revolute;
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
            Revolute = class Revolute extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        //fd.filter.categoryBits = 2;
                        ground.CreateFixture(fd);
                    }
                    {
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 0.5;
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        const rjd = new box2d.b2RevoluteJointDef();
                        bd.position.Set(-10.0, 20.0);
                        const body = this.m_world.CreateBody(bd);
                        body.CreateFixture(shape, 5.0);
                        const w = 100.0;
                        body.SetAngularVelocity(w);
                        body.SetLinearVelocity(new box2d.b2Vec2(-8.0 * w, 0.0));
                        rjd.Initialize(ground, body, new box2d.b2Vec2(-10.0, 12.0));
                        rjd.motorSpeed = 1.0 * box2d.b2_pi;
                        rjd.maxMotorTorque = 10000.0;
                        rjd.enableMotor = false;
                        rjd.lowerAngle = -0.25 * box2d.b2_pi;
                        rjd.upperAngle = 0.5 * box2d.b2_pi;
                        rjd.enableLimit = true;
                        rjd.collideConnected = true;
                        this.m_joint = this.m_world.CreateJoint(rjd);
                    }
                    {
                        /*box2d.b2CircleShape*/
                        const circle_shape = new box2d.b2CircleShape();
                        circle_shape.m_radius = 3.0;
                        const circle_bd = new box2d.b2BodyDef();
                        circle_bd.type = box2d.b2BodyType.b2_dynamicBody;
                        circle_bd.position.Set(5.0, 30.0);
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.density = 5.0;
                        fd.filter.maskBits = 1;
                        fd.shape = circle_shape;
                        this.m_ball = this.m_world.CreateBody(circle_bd);
                        this.m_ball.CreateFixture(fd);
                        /*box2d.b2PolygonShape*/
                        const polygon_shape = new box2d.b2PolygonShape();
                        polygon_shape.SetAsBox(10.0, 0.2, new box2d.b2Vec2(-10.0, 0.0), 0.0);
                        const polygon_bd = new box2d.b2BodyDef();
                        polygon_bd.position.Set(20.0, 10.0);
                        polygon_bd.type = box2d.b2BodyType.b2_dynamicBody;
                        polygon_bd.bullet = true;
                        /*box2d.b2Body*/
                        const polygon_body = this.m_world.CreateBody(polygon_bd);
                        polygon_body.CreateFixture(polygon_shape, 2.0);
                        const rjd = new box2d.b2RevoluteJointDef();
                        rjd.Initialize(ground, polygon_body, new box2d.b2Vec2(20.0, 10.0));
                        rjd.lowerAngle = -0.25 * box2d.b2_pi;
                        rjd.upperAngle = 0.0 * box2d.b2_pi;
                        rjd.enableLimit = true;
                        this.m_world.CreateJoint(rjd);
                    }
                    // Tests mass computation of a small object far from the origin
                    {
                        const bodyDef = new box2d.b2BodyDef();
                        bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                        /*box2d.b2Body*/
                        const body = this.m_world.CreateBody(bodyDef);
                        /*box2d.b2PolygonShape*/
                        const polyShape = new box2d.b2PolygonShape();
                        /*box2d.b2Vec2*/
                        const verts = box2d.b2Vec2.MakeArray(3);
                        verts[0].Set(17.63, 36.31);
                        verts[1].Set(17.52, 36.69);
                        verts[2].Set(17.19, 36.36);
                        polyShape.Set(verts, 3);
                        /*box2d.b2FixtureDef*/
                        const polyFixtureDef = new box2d.b2FixtureDef();
                        polyFixtureDef.shape = polyShape;
                        polyFixtureDef.density = 1;
                        body.CreateFixture(polyFixtureDef); //assertion hits inside here
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "l":
                            this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
                            break;
                        case "m":
                            this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motor");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    // if (this.m_stepCount === 360) {
                    //   this.m_ball.SetTransformVec(new box2d.b2Vec2(0.0, 0.5), 0.0);
                    // }
                    // const torque1 = this.m_joint.GetMotorTorque(settings.hz);
                    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque1.toFixed(0)}, ${torque2.toFixed(0)} : Motor Force = ${force3.toFixed(0)}`);
                    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Revolute();
                }
            };
            exports_1("Revolute", Revolute);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmV2b2x1dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0cy9SZXZvbHV0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsV0FBQSxjQUFzQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQUl4QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBRWxCO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXJDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBRXJFLHNCQUFzQjt3QkFDdEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNqQiw2QkFBNkI7d0JBRTdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQzFCO29CQUVEO3dCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUN4QyxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzt3QkFFckIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FB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