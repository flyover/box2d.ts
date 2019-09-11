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
    var box2d, testbed, SliderCrank;
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
            SliderCrank = class SliderCrank extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        let prevBody = ground;
                        // Define crank.
                        {
                            const shape = new box2d.b2PolygonShape();
                            shape.SetAsBox(0.5, 2.0);
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 7.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new box2d.b2RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new box2d.b2Vec2(0.0, 5.0));
                            rjd.motorSpeed = 1.0 * box2d.b2_pi;
                            rjd.maxMotorTorque = 10000.0;
                            rjd.enableMotor = true;
                            this.m_joint1 = this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define follower.
                        {
                            const shape = new box2d.b2PolygonShape();
                            shape.SetAsBox(0.5, 4.0);
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 13.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new box2d.b2RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new box2d.b2Vec2(0.0, 9.0));
                            rjd.enableMotor = false;
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define piston
                        {
                            const shape = new box2d.b2PolygonShape();
                            shape.SetAsBox(1.5, 1.5);
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.fixedRotation = true;
                            bd.position.Set(0.0, 17.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            const rjd = new box2d.b2RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new box2d.b2Vec2(0.0, 17.0));
                            this.m_world.CreateJoint(rjd);
                            const pjd = new box2d.b2PrismaticJointDef();
                            pjd.Initialize(ground, body, new box2d.b2Vec2(0.0, 17.0), new box2d.b2Vec2(0.0, 1.0));
                            pjd.maxMotorForce = 1000.0;
                            pjd.enableMotor = true;
                            this.m_joint2 = this.m_world.CreateJoint(pjd);
                        }
                        // Create a payload
                        {
                            const shape = new box2d.b2PolygonShape();
                            shape.SetAsBox(1.5, 1.5);
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 23.0);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "f":
                            this.m_joint2.EnableMotor(!this.m_joint2.IsMotorEnabled());
                            this.m_joint2.GetBodyB().SetAwake(true);
                            break;
                        case "m":
                            this.m_joint1.EnableMotor(!this.m_joint1.IsMotorEnabled());
                            this.m_joint1.GetBodyB().SetAwake(true);
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (f) toggle friction, (m) toggle motor");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    const torque = this.m_joint1.GetMotorTorque(settings.hz);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque.toFixed(0)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new SliderCrank();
                }
            };
            exports_1("SliderCrank", SliderCrank);
            SliderCrank.e_count = 30;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2xpZGVyQ3JhbmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTbGlkZXJDcmFuay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsY0FBQSxNQUFhLFdBQVksU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFNM0M7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNsQjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUVyQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JBRUQ7d0JBQ0UsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDO3dCQUV0QixnQkFBZ0I7d0JBQ2hCOzRCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN6QyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzs0QkFFekIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7NEJBQ2pDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7NEJBQzFDLEVBQUUsQ0FBQyxR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