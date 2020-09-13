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
    var b2, testbed, RopeJoint;
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
            RopeJoint = class RopeJoint extends testbed.Test {
                constructor() {
                    super();
                    this.m_ropeDef = new b2.RopeJointDef();
                    this.m_rope = null;
                    /*b2.Body*/
                    let ground = null;
                    {
                        /*b2.BodyDef*/
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        /*b2.EdgeShape*/
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        /*b2.PolygonShape*/
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 0.125);
                        /*b2.FixtureDef*/
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 20.0;
                        fd.friction = 0.2;
                        fd.filter.categoryBits = 0x0001;
                        fd.filter.maskBits = 0xFFFF & ~0x0002;
                        /*b2.RevoluteJointDef*/
                        const jd = new b2.RevoluteJointDef();
                        jd.collideConnected = false;
                        /*const int32*/
                        const N = 10;
                        /*const float32*/
                        const y = 15.0;
                        this.m_ropeDef.localAnchorA.Set(0.0, y);
                        /*b2.Body*/
                        let prevBody = ground;
                        for ( /*int32*/let i = 0; i < N; ++i) {
                            /*b2.BodyDef*/
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(0.5 + 1.0 * i, y);
                            if (i === N - 1) {
                                shape.SetAsBox(1.5, 1.5);
                                fd.density = 100.0;
                                fd.filter.categoryBits = 0x0002;
                                bd.position.Set(1.0 * i, y);
                                bd.angularDamping = 0.4;
                            }
                            /*b2.Body*/
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                            /*b2.Vec2*/
                            const anchor = new b2.Vec2(i, y);
                            jd.Initialize(prevBody, body, anchor);
                            this.m_world.CreateJoint(jd);
                            prevBody = body;
                        }
                        this.m_ropeDef.localAnchorB.SetZero();
                        /*float32*/
                        const extraLength = 0.01;
                        this.m_ropeDef.maxLength = N - 1.0 + extraLength;
                        this.m_ropeDef.bodyB = prevBody;
                    }
                    {
                        this.m_ropeDef.bodyA = ground;
                        this.m_rope = this.m_world.CreateJoint(this.m_ropeDef);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "j":
                            if (this.m_rope) {
                                this.m_world.DestroyJoint(this.m_rope);
                                this.m_rope = null;
                            }
                            else {
                                this.m_rope = this.m_world.CreateJoint(this.m_ropeDef);
                            }
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press (j) to toggle the rope joint.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    if (this.m_rope) {
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, "Rope ON");
                    }
                    else {
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, "Rope OFF");
                    }
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new RopeJoint();
                }
            };
            exports_1("RopeJoint", RopeJoint);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9wZV9qb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3JvcGVfam9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLFlBQUEsTUFBYSxTQUFVLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBSXpDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUpILGNBQVMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDbEMsV0FBTSxHQUF3QixJQUFJLENBQUM7b0JBS3hDLFdBQVc7b0JBQ1gsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUNsQjt3QkFDRSxjQUFjO3dCQUNkLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXJDLGdCQUFnQjt3QkFDaEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbkUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xDO29CQUVEO3dCQUNFLG1CQUFtQjt3QkFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUUzQixpQkFBaUI7d0JBQ2pCLE1BQU0sRUFBRSxHQUFHLElBQUksRUFB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