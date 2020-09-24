/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
    var b2, testbed, BasicSliderCrank;
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
            BasicSliderCrank = class BasicSliderCrank extends testbed.Test {
                constructor() {
                    super();
                    /*b2.Body*/
                    let ground = null;
                    {
                        /*b2.BodyDef*/
                        const bd = new b2.BodyDef();
                        bd.position.Set(0.0, 17.0);
                        ground = this.m_world.CreateBody(bd);
                    }
                    {
                        /*b2.Body*/
                        let prevBody = ground;
                        // Define crank.
                        {
                            /*b2.PolygonShape*/
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(4.0, 1.0);
                            /*b2.BodyDef*/
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(-8.0, 20.0);
                            /*b2.Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            /*b2.RevoluteJointDef*/
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(-12.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define connecting rod
                        {
                            /*b2.PolygonShape*/
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(8.0, 1.0);
                            /*b2.BodyDef*/
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(4.0, 20.0);
                            /*b2.Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            /*b2.RevoluteJointDef*/
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(-4.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            prevBody = body;
                        }
                        // Define piston
                        {
                            /*b2.PolygonShape*/
                            const shape = new b2.PolygonShape();
                            shape.SetAsBox(3.0, 3.0);
                            /*b2.BodyDef*/
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.fixedRotation = true;
                            bd.position.Set(12.0, 20.0);
                            /*b2.Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(shape, 2.0);
                            /*b2.RevoluteJointDef*/
                            const rjd = new b2.RevoluteJointDef();
                            rjd.Initialize(prevBody, body, new b2.Vec2(12.0, 20.0));
                            this.m_world.CreateJoint(rjd);
                            /*b2.PrismaticJointDef*/
                            const pjd = new b2.PrismaticJointDef();
                            pjd.Initialize(ground, body, new b2.Vec2(12.0, 17.0), new b2.Vec2(1.0, 0.0));
                            this.m_world.CreateJoint(pjd);
                        }
                    }
                }
                static Create() {
                    return new BasicSliderCrank();
                }
            };
            exports_1("BasicSliderCrank", BasicSliderCrank);
        }
    };
});
//# sourceMappingURL=basic_slider_crank.js.map