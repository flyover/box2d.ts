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
    var box2d, testbed, EdgeShapesCallback, EdgeShapes;
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
            EdgeShapesCallback = class EdgeShapesCallback extends box2d.b2RayCastCallback {
                constructor() {
                    super(...arguments);
                    this.m_fixture = null;
                    this.m_point = new box2d.b2Vec2();
                    this.m_normal = new box2d.b2Vec2();
                }
                ReportFixture(fixture, point, normal, fraction) {
                    this.m_fixture = fixture;
                    this.m_point.Copy(point);
                    this.m_normal.Copy(normal);
                    return fraction;
                }
            };
            exports_1("EdgeShapesCallback", EdgeShapesCallback);
            EdgeShapes = class EdgeShapes extends testbed.Test {
                constructor() {
                    super();
                    this.m_bodyIndex = 0;
                    this.m_angle = 0.0;
                    this.m_bodyIndex = 0;
                    this.m_bodies = new Array(EdgeShapes.e_maxBodies);
                    this.m_polygons = new Array(4);
                    for (let i = 0; i < 4; ++i) {
                        this.m_polygons[i] = new box2d.b2PolygonShape();
                    }
                    this.m_circle = new box2d.b2CircleShape();
                    this.m_angle = 0.0;
                    // Ground body
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        let x1 = -20.0;
                        let y1 = 2.0 * box2d.b2Cos(x1 / 10.0 * box2d.b2_pi);
                        for (let i = 0; i < 80; ++i) {
                            const x2 = x1 + 0.5;
                            const y2 = 2.0 * box2d.b2Cos(x2 / 10.0 * box2d.b2_pi);
                            const shape = new box2d.b2EdgeShape();
                            shape.Set(new box2d.b2Vec2(x1, y1), new box2d.b2Vec2(x2, y2));
                            ground.CreateFixture(shape, 0.0);
                            x1 = x2;
                            y1 = y2;
                        }
                    }
                    {
                        const vertices = new Array(3);
                        vertices[0] = new box2d.b2Vec2(-0.5, 0.0);
                        vertices[1] = new box2d.b2Vec2(0.5, 0.0);
                        vertices[2] = new box2d.b2Vec2(0.0, 1.5);
                        this.m_polygons[0].Set(vertices, 3);
                    }
                    {
                        const vertices = new Array(3);
                        vertices[0] = new box2d.b2Vec2(-0.1, 0.0);
                        vertices[1] = new box2d.b2Vec2(0.1, 0.0);
                        vertices[2] = new box2d.b2Vec2(0.0, 1.5);
                        this.m_polygons[1].Set(vertices, 3);
                    }
                    {
                        const w = 1.0;
                        const b = w / (2.0 + box2d.b2Sqrt(2.0));
                        const s = box2d.b2Sqrt(2.0) * b;
                        const vertices = new Array(8);
                        vertices[0] = new box2d.b2Vec2(0.5 * s, 0.0);
                        vertices[1] = new box2d.b2Vec2(0.5 * w, b);
                        vertices[2] = new box2d.b2Vec2(0.5 * w, b + s);
                        vertices[3] = new box2d.b2Vec2(0.5 * s, w);
                        vertices[4] = new box2d.b2Vec2(-0.5 * s, w);
                        vertices[5] = new box2d.b2Vec2(-0.5 * w, b + s);
                        vertices[6] = new box2d.b2Vec2(-0.5 * w, b);
                        vertices[7] = new box2d.b2Vec2(-0.5 * s, 0.0);
                        this.m_polygons[2].Set(vertices, 8);
                    }
                    {
                        this.m_polygons[3].SetAsBox(0.5, 0.5);
                    }
                    {
                        this.m_circle.m_radius = 0.5;
                    }
                    for (let i = 0; i < EdgeShapes.e_maxBodies; ++i) {
                        this.m_bodies[i] = null;
                    }
                }
                CreateBody(index) {
                    const old_body = this.m_bodies[this.m_bodyIndex];
                    if (old_body !== null) {
                        this.m_world.DestroyBody(old_body);
                        this.m_bodies[this.m_bodyIndex] = null;
                    }
                    const bd = new box2d.b2BodyDef();
                    const x = box2d.b2RandomRange(-10.0, 10.0);
                    const y = box2d.b2RandomRange(10.0, 20.0);
                    bd.position.Set(x, y);
                    bd.angle = box2d.b2RandomRange(-box2d.b2_pi, box2d.b2_pi);
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    if (index === 4) {
                        bd.angularDamping = 0.02;
                    }
                    const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);
                    if (index < 4) {
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = this.m_polygons[index];
                        fd.friction = 0.3;
                        fd.density = 20.0;
                        new_body.CreateFixture(fd);
                    }
                    else {
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = this.m_circle;
                        fd.friction = 0.3;
                        fd.density = 20.0;
                        new_body.CreateFixture(fd);
                    }
                    this.m_bodyIndex = (this.m_bodyIndex + 1) % EdgeShapes.e_maxBodies;
                }
                DestroyBody() {
                    for (let i = 0; i < EdgeShapes.e_maxBodies; ++i) {
                        const body = this.m_bodies[i];
                        if (body !== null) {
                            this.m_world.DestroyBody(body);
                            this.m_bodies[i] = null;
                            return;
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "1":
                        case "2":
                        case "3":
                        case "4":
                        case "5":
                            this.CreateBody(key.charCodeAt(0) - "1".charCodeAt(0));
                            break;
                        case "d":
                            this.DestroyBody();
                            break;
                    }
                }
                Step(settings) {
                    const advanceRay = !settings.pause || settings.singleStep;
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 1-5 to drop stuff, m to change the mode");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    const L = 25.0;
                    const point1 = new box2d.b2Vec2(0.0, 10.0);
                    const d = new box2d.b2Vec2(L * box2d.b2Cos(this.m_angle), -L * box2d.b2Abs(box2d.b2Sin(this.m_angle)));
                    const point2 = box2d.b2Vec2.AddVV(point1, d, new box2d.b2Vec2());
                    const callback = new EdgeShapesCallback();
                    this.m_world.RayCast(callback, point1, point2);
                    if (callback.m_fixture) {
                        testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new box2d.b2Color(0.4, 0.9, 0.4));
                        testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new box2d.b2Color(0.8, 0.8, 0.8));
                        const head = box2d.b2Vec2.AddVV(callback.m_point, box2d.b2Vec2.MulSV(0.5, callback.m_normal, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                        testbed.g_debugDraw.DrawSegment(callback.m_point, head, new box2d.b2Color(0.9, 0.9, 0.4));
                    }
                    else {
                        testbed.g_debugDraw.DrawSegment(point1, point2, new box2d.b2Color(0.8, 0.8, 0.8));
                    }
                    if (advanceRay) {
                        this.m_angle += 0.25 * box2d.b2_pi / 180.0;
                    }
                }
                static Create() {
                    return new EdgeShapes();
                }
            };
            exports_1("EdgeShapes", EdgeShapes);
            EdgeShapes.e_maxBodies = 256;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRnZVNoYXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkVkZ2VTaGFwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLHFCQUFBLE1BQWEsa0JBQW1CLFNBQVEsS0FBSyxDQUFDLGlCQUFpQjtnQkFBL0Q7O29CQUNTLGNBQVMsR0FBMkIsSUFBSSxDQUFDO29CQUN6QyxZQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzdCLGFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFPdkMsQ0FBQztnQkFOUSxhQUFhLENBQUMsT0FBd0IsRUFBRSxLQUFtQixFQUFFLE1BQW9CLEVBQUUsUUFBZ0I7b0JBQ3hHLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO29CQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzNCLE9BQU8sUUFBUSxDQUFDO2dCQUNsQixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxhQUFBLE1BQWEsVUFBVyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVMxQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFQSCxnQkFBVyxHQUFHLENBQUMsQ0FBQztvQkFJaEIsWUFBTyxHQUFHLEdBQUcsQ0FBQztvQkFLbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcs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QkFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUN4QyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlCLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDN0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2hELFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxRQUFRLENBQUMs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