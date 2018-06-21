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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmV2b2x1dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL1Jldm9sdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixXQUFBLGNBQXNCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBSXhDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztvQkFFbEI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFFckUsc0JBQXNCO3dCQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDcEMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2pCLDZCQUE2Qjt3QkFFN0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDMUI7b0JBRUQ7d0JBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQ3hDLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUVyQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLElBQUks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