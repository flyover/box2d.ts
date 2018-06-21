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
    var box2d, testbed, Pinball;
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
             * This tests bullet collision and provides an example of a
             * gameplay scenario. This also uses a loop shape.
             */
            Pinball = class Pinball extends testbed.Test {
                constructor() {
                    super();
                    this.m_button = false;
                    // Ground body
                    /*box2d.b2Body*/
                    let ground = null;
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        /*box2d.b2Vec2*/
                        const vs = box2d.b2Vec2.MakeArray(5);
                        vs[0].Set(0.0, -2.0);
                        vs[1].Set(8.0, 6.0);
                        vs[2].Set(8.0, 20.0);
                        vs[3].Set(-8.0, 20.0);
                        vs[4].Set(-8.0, 6.0);
                        /*box2d.b2ChainShape*/
                        const loop = new box2d.b2ChainShape();
                        loop.CreateLoop(vs, 5);
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = loop;
                        fd.density = 0.0;
                        ground.CreateFixture(fd);
                    }
                    // Flippers
                    {
                        /*box2d.b2Vec2*/
                        const p1 = new box2d.b2Vec2(-2.0, 0.0), p2 = new box2d.b2Vec2(2.0, 0.0);
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Copy(p1);
                        /*box2d.b2Body*/
                        const leftFlipper = this.m_world.CreateBody(bd);
                        bd.position.Copy(p2);
                        /*box2d.b2Body*/
                        const rightFlipper = this.m_world.CreateBody(bd);
                        /*box2d.b2PolygonShape*/
                        const box = new box2d.b2PolygonShape();
                        box.SetAsBox(1.75, 0.1);
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = box;
                        fd.density = 1.0;
                        leftFlipper.CreateFixture(fd);
                        rightFlipper.CreateFixture(fd);
                        /*box2d.b2RevoluteJointDef*/
                        const jd = new box2d.b2RevoluteJointDef();
                        jd.bodyA = ground;
                        jd.localAnchorB.SetZero();
                        jd.enableMotor = true;
                        jd.maxMotorTorque = 1000.0;
                        jd.enableLimit = true;
                        jd.motorSpeed = 0.0;
                        jd.localAnchorA.Copy(p1);
                        jd.bodyB = leftFlipper;
                        jd.lowerAngle = -30.0 * box2d.b2_pi / 180.0;
                        jd.upperAngle = 5.0 * box2d.b2_pi / 180.0;
                        this.m_leftJoint = this.m_world.CreateJoint(jd);
                        jd.motorSpeed = 0.0;
                        jd.localAnchorA.Copy(p2);
                        jd.bodyB = rightFlipper;
                        jd.lowerAngle = -5.0 * box2d.b2_pi / 180.0;
                        jd.upperAngle = 30.0 * box2d.b2_pi / 180.0;
                        this.m_rightJoint = this.m_world.CreateJoint(jd);
                    }
                    // Circle character
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.position.Set(1.0, 15.0);
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.bullet = true;
                        this.m_ball = this.m_world.CreateBody(bd);
                        /*box2d.b2CircleShape*/
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 0.2;
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        this.m_ball.CreateFixture(fd);
                    }
                    this.m_button = false;
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_button = true;
                            break;
                    }
                }
                KeyboardUp(key) {
                    switch (key) {
                        case "a":
                            this.m_button = false;
                            break;
                    }
                }
                Step(settings) {
                    if (this.m_button) {
                        this.m_leftJoint.SetMotorSpeed(20.0);
                        this.m_rightJoint.SetMotorSpeed(-20.0);
                    }
                    else {
                        this.m_leftJoint.SetMotorSpeed(-10.0);
                        this.m_rightJoint.SetMotorSpeed(10.0);
                    }
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to control the flippers");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Pinball();
                }
            };
            exports_1("Pinball", Pinball);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGluYmFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvUGluYmFsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0Y7OztlQUdHO1lBRUgsVUFBQSxhQUFxQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQU12QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFISCxhQUFRLEdBQVksS0FBSyxDQUFDO29CQUsvQixjQUFjO29CQUNkLGdCQUFnQjtvQkFDaEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNsQjt3QkFDRSxtQkFBbUI7d0JBQ25CLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXJDLGdCQUFnQjt3QkFDaEIsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFckIsc0JBQXNCO3dC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