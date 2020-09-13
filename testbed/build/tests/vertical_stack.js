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
    var b2, testbed, VerticalStack;
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
            VerticalStack = class VerticalStack extends testbed.Test {
                constructor() {
                    super();
                    this.m_bullet = null;
                    this.m_bodies = new Array(VerticalStack.e_rowCount * VerticalStack.e_columnCount);
                    this.m_indices = new Array(VerticalStack.e_rowCount * VerticalStack.e_columnCount);
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(new b2.Vec2(20.0, 0.0), new b2.Vec2(20.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const xs = [0.0, -10.0, -5.0, 5.0, 10.0];
                    for (let j = 0; j < VerticalStack.e_columnCount; ++j) {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        fd.friction = 0.3;
                        for (let i = 0; i < VerticalStack.e_rowCount; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            const n = j * VerticalStack.e_rowCount + i;
                            // DEBUG: b2.Assert(n < VerticalStack.e_rowCount * VerticalStack.e_columnCount);
                            this.m_indices[n] = n;
                            bd.userData = this.m_indices[n];
                            const x = 0.0;
                            //const x = b2.RandomRange(-0.02, 0.02);
                            //const x = i % 2 === 0 ? -0.01 : 0.01;
                            bd.position.Set(xs[j] + x, 0.55 + 1.1 * i);
                            const body = this.m_world.CreateBody(bd);
                            this.m_bodies[n] = body;
                            body.CreateFixture(fd);
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case ",":
                            if (this.m_bullet) {
                                this.m_world.DestroyBody(this.m_bullet);
                                this.m_bullet = null;
                            }
                            {
                                const shape = new b2.CircleShape();
                                shape.m_radius = 0.25;
                                const fd = new b2.FixtureDef();
                                fd.shape = shape;
                                fd.density = 20.0;
                                fd.restitution = 0.05;
                                const bd = new b2.BodyDef();
                                bd.type = b2.BodyType.b2_dynamicBody;
                                bd.bullet = true;
                                bd.position.Set(-31.0, 5.0);
                                this.m_bullet = this.m_world.CreateBody(bd);
                                this.m_bullet.CreateFixture(fd);
                                this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
                            }
                            break;
                        case "b":
                            // b2.blockSolve = !b2.blockSolve;
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (,) to launch a bullet.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Blocksolve = ${(b2.blockSolve) ? (1) : (0)}`);
                    //if (this.m_stepCount === 300)
                    //{
                    //  if (this.m_bullet !== null)
                    //  {
                    //    this.m_world.DestroyBody(this.m_bullet);
                    //    this.m_bullet = null;
                    //  }
                    //  {
                    //    const shape = new b2.CircleShape();
                    //    shape.m_radius = 0.25;
                    //    const fd = new b2.FixtureDef();
                    //    fd.shape = shape;
                    //    fd.density = 20.0;
                    //    fd.restitution = 0.05;
                    //    const bd = new b2.BodyDef();
                    //    bd.type = b2.BodyType.b2_dynamicBody;
                    //    bd.bullet = true;
                    //    bd.position.Set(-31.0, 5.0);
                    //    this.m_bullet = this.m_world.CreateBody(bd);
                    //    this.m_bullet.CreateFixture(fd);
                    //    this.m_bullet.SetLinearVelocity(new b2.Vec2(400.0, 0.0));
                    //  }
                    //}
                }
                static Create() {
                    return new VerticalStack();
                }
            };
            exports_1("VerticalStack", VerticalStack);
            VerticalStack.e_columnCount = 1;
            VerticalStack.e_rowCount = 15;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVydGljYWxfc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy92ZXJ0aWNhbF9zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsZ0JBQUEsTUFBYSxhQUFjLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBUTdDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUxILGFBQVEsR0FBbUIsSUFBSSxDQUFDO29CQU9yQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNsRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUVuRjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDNUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLE1BQU0sS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUVqQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFD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