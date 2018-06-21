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
    var box2d, testbed, VerticalStack;
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
            VerticalStack = class VerticalStack extends testbed.Test {
                constructor() {
                    super();
                    this.m_bullet = null;
                    this.m_bodies = new Array(VerticalStack.e_rowCount * VerticalStack.e_columnCount);
                    this.m_indices = new Array(VerticalStack.e_rowCount * VerticalStack.e_columnCount);
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(new box2d.b2Vec2(20.0, 0.0), new box2d.b2Vec2(20.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const xs = [0.0, -10.0, -5.0, 5.0, 10.0];
                    for (let j = 0; j < VerticalStack.e_columnCount; ++j) {
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        fd.friction = 0.3;
                        for (let i = 0; i < VerticalStack.e_rowCount; ++i) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            const n = j * VerticalStack.e_rowCount + i;
                            // DEBUG: box2d.b2Assert(n < VerticalStack.e_rowCount * VerticalStack.e_columnCount);
                            this.m_indices[n] = n;
                            bd.userData = this.m_indices[n];
                            const x = 0.0;
                            //const x = box2d.b2RandomRange(-0.02, 0.02);
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
                                const shape = new box2d.b2CircleShape();
                                shape.m_radius = 0.25;
                                const fd = new box2d.b2FixtureDef();
                                fd.shape = shape;
                                fd.density = 20.0;
                                fd.restitution = 0.05;
                                const bd = new box2d.b2BodyDef();
                                bd.type = box2d.b2BodyType.b2_dynamicBody;
                                bd.bullet = true;
                                bd.position.Set(-31.0, 5.0);
                                this.m_bullet = this.m_world.CreateBody(bd);
                                this.m_bullet.CreateFixture(fd);
                                this.m_bullet.SetLinearVelocity(new box2d.b2Vec2(400.0, 0.0));
                            }
                            break;
                        case "b":
                            // box2d.g_blockSolve = !box2d.g_blockSolve;
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (,) to launch a bullet.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Blocksolve = ${(box2d.g_blockSolve) ? (1) : (0)}`);
                    //if (this.m_stepCount === 300)
                    //{
                    //  if (this.m_bullet !== null)
                    //  {
                    //    this.m_world.DestroyBody(this.m_bullet);
                    //    this.m_bullet = null;
                    //  }
                    //  {
                    //    const shape = new box2d.b2CircleShape();
                    //    shape.m_radius = 0.25;
                    //    const fd = new box2d.b2FixtureDef();
                    //    fd.shape = shape;
                    //    fd.density = 20.0;
                    //    fd.restitution = 0.05;
                    //    const bd = new box2d.b2BodyDef();
                    //    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    //    bd.bullet = true;
                    //    bd.position.Set(-31.0, 5.0);
                    //    this.m_bullet = this.m_world.CreateBody(bd);
                    //    this.m_bullet.CreateFixture(fd);
                    //    this.m_bullet.SetLinearVelocity(new box2d.b2Vec2(400.0, 0.0));
                    //  }
                    //}
                }
                static Create() {
                    return new VerticalStack();
                }
            };
            VerticalStack.e_columnCount = 1;
            VerticalStack.e_rowCount = 15;
            exports_1("VerticalStack", VerticalStack);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVydGljYWxTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvVmVydGljYWxTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsZ0JBQUEsbUJBQTJCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBUTdDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUxILGFBQVEsR0FBd0IsSUFBSSxDQUFDO29CQU8xQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNsRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUVuRjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUVqQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFB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