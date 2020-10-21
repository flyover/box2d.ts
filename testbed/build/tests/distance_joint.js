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
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, DistanceJoint, testIndex;
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
            DistanceJoint = class DistanceJoint extends testbed.Test {
                constructor() {
                    super();
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.angularDamping = 0.1;
                        bd.position.Set(0.0, 5.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        body.CreateFixture(shape, 5.0);
                        this.m_hertz = 1.0;
                        this.m_dampingRatio = 0.7;
                        const jd = new b2.DistanceJointDef();
                        jd.Initialize(ground, body, new b2.Vec2(0.0, 15.0), bd.position);
                        jd.collideConnected = true;
                        this.m_length = jd.length;
                        this.m_minLength = jd.minLength = jd.length - 3;
                        this.m_maxLength = jd.maxLength = jd.length + 3;
                        b2.LinearStiffness(jd, this.m_hertz, this.m_dampingRatio, jd.bodyA, jd.bodyB);
                        this.m_joint = this.m_world.CreateJoint(jd);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "l":
                            // this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
                            break;
                        case "m":
                            // this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
                            break;
                        case "s":
                            // this.m_joint.SetMotorSpeed(-this.m_joint.GetMotorSpeed());
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    // testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motors, (s) speed");
                    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    // const force = this.m_joint.GetMotorForce(settings.m_hertz);
                    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Force = ${force.toFixed(0)}`);
                    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new DistanceJoint();
                }
            };
            exports_1("DistanceJoint", DistanceJoint);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Joints", "DistanceJoint", DistanceJoint.Create));
        }
    };
});
//# sourceMappingURL=distance_joint.js.map