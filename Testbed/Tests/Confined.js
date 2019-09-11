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
            exports_1("Confined", Confined);
            Confined.e_columnCount = 0;
            Confined.e_rowCount = 0;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmluZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb25maW5lZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YsV0FBQSxNQUFhLFFBQVMsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFJeEM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBRVI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFFdEMsUUFBUTt3QkFDUixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUVqQyxZQUFZO3dCQUNaLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUN2RSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFakMsYUFBYTt3QkFDYixLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFD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