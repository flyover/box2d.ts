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
    var box2d, testbed, BodyTypes;
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
            BodyTypes = class BodyTypes extends testbed.Test {
                constructor() {
                    super();
                    this.m_speed = 0;
                    /*box2d.b2BodyDef*/
                    const bd = new box2d.b2BodyDef();
                    const ground = this.m_world.CreateBody(bd);
                    /*box2d.b2EdgeShape*/
                    const shape = new box2d.b2EdgeShape();
                    shape.Set(new box2d.b2Vec2(-20.0, 0.0), new box2d.b2Vec2(20.0, 0.0));
                    /*box2d.b2FixtureDef*/
                    const fd = new box2d.b2FixtureDef();
                    fd.shape = shape;
                    ground.CreateFixture(fd);
                    // Define attachment
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 3.0);
                        this.m_attachment = this.m_world.CreateBody(bd);
                        /*box2d.b2PolygonShape*/
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 2.0);
                        this.m_attachment.CreateFixture(shape, 2.0);
                    }
                    // Define platform
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(-4.0, 5.0);
                        this.m_platform = this.m_world.CreateBody(bd);
                        /*box2d.b2PolygonShape*/
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 4.0, new box2d.b2Vec2(4.0, 0.0), 0.5 * box2d.b2_pi);
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.6;
                        fd.density = 2.0;
                        this.m_platform.CreateFixture(fd);
                        /*box2d.b2RevoluteJointDef*/
                        const rjd = new box2d.b2RevoluteJointDef();
                        rjd.Initialize(this.m_attachment, this.m_platform, new box2d.b2Vec2(0.0, 5.0));
                        rjd.maxMotorTorque = 50.0;
                        rjd.enableMotor = true;
                        this.m_world.CreateJoint(rjd);
                        /*box2d.b2PrismaticJointDef*/
                        const pjd = new box2d.b2PrismaticJointDef();
                        pjd.Initialize(ground, this.m_platform, new box2d.b2Vec2(0.0, 5.0), new box2d.b2Vec2(1.0, 0.0));
                        pjd.maxMotorForce = 1000.0;
                        pjd.enableMotor = true;
                        pjd.lowerTranslation = -10.0;
                        pjd.upperTranslation = 10.0;
                        pjd.enableLimit = true;
                        this.m_world.CreateJoint(pjd);
                        this.m_speed = 3.0;
                    }
                    // Create a payload
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 8.0);
                        /*box2d.b2Body*/
                        const body = this.m_world.CreateBody(bd);
                        /*box2d.b2PolygonShape*/
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.75, 0.75);
                        /*box2d.b2FixtureDef*/
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.6;
                        fd.density = 2.0;
                        body.CreateFixture(fd);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "d":
                            this.m_platform.SetType(box2d.b2BodyType.b2_dynamicBody);
                            break;
                        case "s":
                            this.m_platform.SetType(box2d.b2BodyType.b2_staticBody);
                            break;
                        case "k":
                            this.m_platform.SetType(box2d.b2BodyType.b2_kinematicBody);
                            this.m_platform.SetLinearVelocity(new box2d.b2Vec2(-this.m_speed, 0.0));
                            this.m_platform.SetAngularVelocity(0.0);
                            break;
                    }
                }
                Step(settings) {
                    // Drive the kinematic body.
                    if (this.m_platform.GetType() === box2d.b2BodyType.b2_kinematicBody) {
                        /*box2d.b2Vec2*/
                        const p = this.m_platform.GetTransform().p;
                        /*box2d.b2Vec2*/
                        const v = this.m_platform.GetLinearVelocity();
                        if ((p.x < -10.0 && v.x < 0.0) ||
                            (p.x > 10.0 && v.x > 0.0)) {
                            this.m_platform.SetLinearVelocity(new box2d.b2Vec2(-v.x, v.y));
                        }
                    }
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (d) dynamic, (s) static, (k) kinematic");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new BodyTypes();
                }
            };
            exports_1("BodyTypes", BodyTypes);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9keVR5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9Cb2R5VHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFlBQUEsZUFBdUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFLekM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSEgsWUFBTyxHQUFHLENBQUMsQ0FBQztvQkFLakIsbUJBQW1CO29CQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRTNDLHFCQUFxQjtvQkFDckIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFFckUsc0JBQXNCO29CQUN0QixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDcEMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBRWpCLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRXpCLG9CQUFvQjtvQkFDcEI7d0JBQ0UsbUJBQW1CO3dCQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLFFBQVEs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