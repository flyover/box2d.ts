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
    var b2, testbed, BlobTest, testIndex;
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
            BlobTest = class BlobTest extends testbed.Test {
                constructor() {
                    super();
                    const ground = this.m_world.CreateBody(new b2.BodyDef());
                    {
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(-40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(new b2.Vec2(40.0, 0.0), new b2.Vec2(40.0, 25.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const ajd = new b2.AreaJointDef();
                        const cx = 0.0;
                        const cy = 10.0;
                        const rx = 5.0;
                        const ry = 5.0;
                        const nBodies = 20;
                        const bodyRadius = 0.5;
                        for (let i = 0; i < nBodies; ++i) {
                            const angle = (i * 2.0 * Math.PI) / nBodies;
                            const bd = new b2.BodyDef();
                            //bd.isBullet = true;
                            bd.fixedRotation = true;
                            const x = cx + rx * Math.cos(angle);
                            const y = cy + ry * Math.sin(angle);
                            bd.position.Set(x, y);
                            bd.type = b2.BodyType.b2_dynamicBody;
                            const body = this.m_world.CreateBody(bd);
                            const fd = new b2.FixtureDef();
                            fd.shape = new b2.CircleShape(bodyRadius);
                            fd.density = 1.0;
                            body.CreateFixture(fd);
                            ajd.AddBody(body);
                        }
                        const frequencyHz = 10.0;
                        const dampingRatio = 1.0;
                        b2.LinearStiffness(ajd, frequencyHz, dampingRatio, ajd.bodyA, ajd.bodyB);
                        this.m_world.CreateJoint(ajd);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new BlobTest();
                }
            };
            exports_1("BlobTest", BlobTest);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Extras", "Blob Test", BlobTest.Create));
        }
    };
});
//# sourceMappingURL=blob_test.js.map