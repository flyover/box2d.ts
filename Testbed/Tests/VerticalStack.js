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
            exports_1("VerticalStack", VerticalStack);
            VerticalStack.e_columnCount = 1;
            VerticalStack.e_rowCount = 15;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmVydGljYWxTdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlZlcnRpY2FsU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLGdCQUFBLE1BQWEsYUFBYyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVE3QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFMSCxhQUFRLEdBQXdCLElBQUksQ0FBQztvQkFPMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDbEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFbkY7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFB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