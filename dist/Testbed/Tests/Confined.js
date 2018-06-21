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
    var box2d, testbed, Confined;
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
            Confined = class Confined extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        // Floor
                        shape.Set(new box2d.b2Vec2(-10.0, 0.0), new box2d.b2Vec2(10.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                        // Left wall
                        shape.Set(new box2d.b2Vec2(-10.0, 0.0), new box2d.b2Vec2(-10.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                        // Right wall
                        shape.Set(new box2d.b2Vec2(10.0, 0.0), new box2d.b2Vec2(10.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                        // Roof
                        shape.Set(new box2d.b2Vec2(-10.0, 20.0), new box2d.b2Vec2(10.0, 20.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const radius = 0.5;
                    const shape = new box2d.b2CircleShape();
                    shape.m_p.SetZero();
                    shape.m_radius = radius;
                    const fd = new box2d.b2FixtureDef();
                    fd.shape = shape;
                    fd.density = 1.0;
                    fd.friction = 0.1;
                    for (let j = 0; j < Confined.e_columnCount; ++j) {
                        for (let i = 0; i < Confined.e_rowCount; ++i) {
                            const bd = new box2d.b2BodyDef();
                            bd.type = box2d.b2BodyType.b2_dynamicBody;
                            bd.position.Set(-10.0 + (2.1 * j + 1.0 + 0.01 * i) * radius, (2.0 * i + 1.0) * radius);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                        }
                    }
                    this.m_world.SetGravity(new box2d.b2Vec2(0.0, 0.0));
                }
                CreateCircle() {
                    const radius = 2.0;
                    const shape = new box2d.b2CircleShape();
                    shape.m_p.SetZero();
                    shape.m_radius = radius;
                    const fd = new box2d.b2FixtureDef();
                    fd.shape = shape;
                    fd.density = 1.0;
                    fd.friction = 0.0;
                    const p = new box2d.b2Vec2(box2d.b2Random(), 3.0 + box2d.b2Random());
                    const bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    bd.position.Copy(p);
                    //bd.allowSleep = false;
                    const body = this.m_world.CreateBody(bd);
                    body.CreateFixture(fd);
                }
                Keyboard(key) {
                    switch (key) {
                        case "c":
                            this.CreateCircle();
                            break;
                    }
                }
                Step(settings) {
                    let sleeping = true;
                    for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
                        if (b.GetType() !== box2d.b2BodyType.b2_dynamicBody) {
                            continue;
                        }
                        if (b.IsAwake()) {
                            sleeping = false;
                        }
                    }
                    if (this.m_stepCount === 180) {
                        this.m_stepCount += 0;
                    }
                    if (sleeping) {
                        // this.CreateCircle();
                    }
                    super.Step(settings);
                    for (let b = this.m_world.GetBodyList(); b; b = b.m_next) {
                        if (b.GetType() !== box2d.b2BodyType.b2_dynamicBody) {
                            continue;
                        }
                        // const p = b.GetPosition();
                        // if (p.x <= -10.0 || 10.0 <= p.x || p.y <= 0.0 || 20.0 <= p.y) {
                        //   p.x += 0.0;
                        // }
                    }
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'c' to create a circle.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Confined();
                }
            };
            Confined.e_columnCount = 0;
            Confined.e_rowCount = 0;
            exports_1("Confined", Confined);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmluZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL0NvbmZpbmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixXQUFBLGNBQXNCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBSXhDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBRXRDLFFBQVE7d0JBQ1IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFakMsWUFBWTt3QkFDWixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDdkUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWpDLGFBQWE7d0JBQ2IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUks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