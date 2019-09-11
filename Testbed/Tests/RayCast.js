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
    var box2d, testbed, RayCastClosestCallback, RayCastAnyCallback, RayCastMultipleCallback, RayCastMode, RayCast;
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
            RayCastClosestCallback = class RayCastClosestCallback extends box2d.b2RayCastCallback {
                constructor() {
                    super();
                    this.m_hit = false;
                    this.m_point = new box2d.b2Vec2();
                    this.m_normal = new box2d.b2Vec2();
                }
                ReportFixture(fixture, point, normal, fraction) {
                    const body = fixture.GetBody();
                    const userData = body.GetUserData();
                    if (userData) {
                        const index = userData.index;
                        if (index === 0) {
                            // By returning -1, we instruct the calling code to ignore this fixture
                            // and continue the ray-cast to the next fixture.
                            return -1;
                        }
                    }
                    this.m_hit = true;
                    this.m_point.Copy(point);
                    this.m_normal.Copy(normal);
                    // By returning the current fraction, we instruct the calling code to clip the ray and
                    // continue the ray-cast to the next fixture. WARNING: do not assume that fixtures
                    // are reported in order. However, by clipping, we can always get the closest fixture.
                    return fraction;
                }
            };
            // This callback finds any hit. Polygon 0 is filtered. For this type of query we are usually
            // just checking for obstruction, so the actual fixture and hit point are irrelevant.
            RayCastAnyCallback = class RayCastAnyCallback extends box2d.b2RayCastCallback {
                constructor() {
                    super();
                    this.m_hit = false;
                    this.m_point = new box2d.b2Vec2();
                    this.m_normal = new box2d.b2Vec2();
                }
                ReportFixture(fixture, point, normal, fraction) {
                    const body = fixture.GetBody();
                    const userData = body.GetUserData();
                    if (userData) {
                        const index = userData.index;
                        if (index === 0) {
                            // By returning -1, we instruct the calling code to ignore this fixture
                            // and continue the ray-cast to the next fixture.
                            return -1;
                        }
                    }
                    this.m_hit = true;
                    this.m_point.Copy(point);
                    this.m_normal.Copy(normal);
                    // At this point we have a hit, so we know the ray is obstructed.
                    // By returning 0, we instruct the calling code to terminate the ray-cast.
                    return 0;
                }
            };
            // This ray cast collects multiple hits along the ray. Polygon 0 is filtered.
            // The fixtures are not necessary reported in order, so we might not capture
            // the closest fixture.
            RayCastMultipleCallback = class RayCastMultipleCallback extends box2d.b2RayCastCallback {
                constructor() {
                    super();
                    this.m_points = box2d.b2Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
                    this.m_normals = box2d.b2Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
                    this.m_count = 0;
                }
                ReportFixture(fixture, point, normal, fraction) {
                    const body = fixture.GetBody();
                    const userData = body.GetUserData();
                    if (userData) {
                        const index = userData.index;
                        if (index === 0) {
                            // By returning -1, we instruct the calling code to ignore this fixture
                            // and continue the ray-cast to the next fixture.
                            return -1;
                        }
                    }
                    // DEBUG: box2d.b2Assert(this.m_count < RayCastMultipleCallback.e_maxCount);
                    this.m_points[this.m_count].Copy(point);
                    this.m_normals[this.m_count].Copy(normal);
                    ++this.m_count;
                    if (this.m_count === RayCastMultipleCallback.e_maxCount) {
                        // At this point the buffer is full.
                        // By returning 0, we instruct the calling code to terminate the ray-cast.
                        return 0;
                    }
                    // By returning 1, we instruct the caller to continue without clipping the ray.
                    return 1;
                }
            };
            RayCastMultipleCallback.e_maxCount = 3;
            (function (RayCastMode) {
                RayCastMode[RayCastMode["e_closest"] = 0] = "e_closest";
                RayCastMode[RayCastMode["e_any"] = 1] = "e_any";
                RayCastMode[RayCastMode["e_multiple"] = 2] = "e_multiple";
            })(RayCastMode || (RayCastMode = {}));
            RayCast = class RayCast extends testbed.Test {
                constructor() {
                    super();
                    this.m_bodyIndex = 0;
                    this.m_bodies = [];
                    this.m_polygons = [];
                    this.m_circle = new box2d.b2CircleShape();
                    this.m_edge = new box2d.b2EdgeShape();
                    this.m_angle = 0;
                    this.m_mode = RayCastMode.e_closest;
                    for (let i = 0; i < 4; ++i) {
                        this.m_polygons[i] = new box2d.b2PolygonShape();
                    }
                    // Ground body
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const vertices = [ /*3*/];
                        vertices[0] = new box2d.b2Vec2(-0.5, 0.0);
                        vertices[1] = new box2d.b2Vec2(0.5, 0.0);
                        vertices[2] = new box2d.b2Vec2(0.0, 1.5);
                        this.m_polygons[0].Set(vertices, 3);
                    }
                    {
                        const vertices = [ /*3*/];
                        vertices[0] = new box2d.b2Vec2(-0.1, 0.0);
                        vertices[1] = new box2d.b2Vec2(0.1, 0.0);
                        vertices[2] = new box2d.b2Vec2(0.0, 1.5);
                        this.m_polygons[1].Set(vertices, 3);
                    }
                    {
                        const w = 1.0;
                        const b = w / (2.0 + box2d.b2Sqrt(2.0));
                        const s = box2d.b2Sqrt(2.0) * b;
                        const vertices = [ /*8*/];
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
                    {
                        this.m_edge.Set(new box2d.b2Vec2(-1, 0), new box2d.b2Vec2(1, 0));
                    }
                    this.m_bodyIndex = 0;
                    for (let i = 0; i < RayCast.e_maxBodies; ++i) {
                        this.m_bodies[i] = null;
                    }
                    this.m_angle = 0;
                    this.m_mode = RayCastMode.e_closest;
                }
                CreateBody(index) {
                    const old_body = this.m_bodies[this.m_bodyIndex];
                    if (old_body !== null) {
                        this.m_world.DestroyBody(old_body);
                        this.m_bodies[this.m_bodyIndex] = null;
                    }
                    const bd = new box2d.b2BodyDef();
                    const x = box2d.b2RandomRange(-10.0, 10.0);
                    const y = box2d.b2RandomRange(0.0, 20.0);
                    bd.position.Set(x, y);
                    bd.angle = box2d.b2RandomRange(-box2d.b2_pi, box2d.b2_pi);
                    bd.userData = {};
                    bd.userData.index = index;
                    if (index === 4) {
                        bd.angularDamping = 0.02;
                    }
                    const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);
                    if (index < 4) {
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = this.m_polygons[index];
                        fd.friction = 0.3;
                        new_body.CreateFixture(fd);
                    }
                    else if (index < 5) {
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = this.m_circle;
                        fd.friction = 0.3;
                        new_body.CreateFixture(fd);
                    }
                    else {
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = this.m_edge;
                        fd.friction = 0.3;
                        new_body.CreateFixture(fd);
                    }
                    this.m_bodyIndex = (this.m_bodyIndex + 1) % RayCast.e_maxBodies;
                }
                DestroyBody() {
                    for (let i = 0; i < RayCast.e_maxBodies; ++i) {
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
                        case "6":
                            this.CreateBody(parseInt(key, 10) - 1);
                            break;
                        case "d":
                            this.DestroyBody();
                            break;
                        case "m":
                            if (this.m_mode === RayCastMode.e_closest) {
                                this.m_mode = RayCastMode.e_any;
                            }
                            else if (this.m_mode === RayCastMode.e_any) {
                                this.m_mode = RayCastMode.e_multiple;
                            }
                            else if (this.m_mode === RayCastMode.e_multiple) {
                                this.m_mode = RayCastMode.e_closest;
                            }
                    }
                }
                Step(settings) {
                    const advanceRay = !settings.pause || settings.singleStep;
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 1-6 to drop stuff, m to change the mode");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    switch (this.m_mode) {
                        case RayCastMode.e_closest:
                            testbed.g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: closest - find closest fixture along the ray");
                            break;
                        case RayCastMode.e_any:
                            testbed.g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: any - check for obstruction");
                            break;
                        case RayCastMode.e_multiple:
                            testbed.g_debugDraw.DrawString(5, this.m_textLine, "Ray-cast mode: multiple - gather multiple fixtures");
                            break;
                    }
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    const L = 11.0;
                    const point1 = new box2d.b2Vec2(0.0, 10.0);
                    const d = new box2d.b2Vec2(L * box2d.b2Cos(this.m_angle), L * box2d.b2Sin(this.m_angle));
                    const point2 = box2d.b2Vec2.AddVV(point1, d, new box2d.b2Vec2());
                    if (this.m_mode === RayCastMode.e_closest) {
                        const callback = new RayCastClosestCallback();
                        this.m_world.RayCast(callback, point1, point2);
                        if (callback.m_hit) {
                            testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new box2d.b2Color(0.4, 0.9, 0.4));
                            testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new box2d.b2Color(0.8, 0.8, 0.8));
                            const head = box2d.b2Vec2.AddVV(callback.m_point, box2d.b2Vec2.MulSV(0.5, callback.m_normal, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                            testbed.g_debugDraw.DrawSegment(callback.m_point, head, new box2d.b2Color(0.9, 0.9, 0.4));
                        }
                        else {
                            testbed.g_debugDraw.DrawSegment(point1, point2, new box2d.b2Color(0.8, 0.8, 0.8));
                        }
                    }
                    else if (this.m_mode === RayCastMode.e_any) {
                        const callback = new RayCastAnyCallback();
                        this.m_world.RayCast(callback, point1, point2);
                        if (callback.m_hit) {
                            testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new box2d.b2Color(0.4, 0.9, 0.4));
                            testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new box2d.b2Color(0.8, 0.8, 0.8));
                            const head = box2d.b2Vec2.AddVV(callback.m_point, box2d.b2Vec2.MulSV(0.5, callback.m_normal, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                            testbed.g_debugDraw.DrawSegment(callback.m_point, head, new box2d.b2Color(0.9, 0.9, 0.4));
                        }
                        else {
                            testbed.g_debugDraw.DrawSegment(point1, point2, new box2d.b2Color(0.8, 0.8, 0.8));
                        }
                    }
                    else if (this.m_mode === RayCastMode.e_multiple) {
                        const callback = new RayCastMultipleCallback();
                        this.m_world.RayCast(callback, point1, point2);
                        testbed.g_debugDraw.DrawSegment(point1, point2, new box2d.b2Color(0.8, 0.8, 0.8));
                        for (let i = 0; i < callback.m_count; ++i) {
                            const p = callback.m_points[i];
                            const n = callback.m_normals[i];
                            testbed.g_debugDraw.DrawPoint(p, 5.0, new box2d.b2Color(0.4, 0.9, 0.4));
                            testbed.g_debugDraw.DrawSegment(point1, p, new box2d.b2Color(0.8, 0.8, 0.8));
                            const head = box2d.b2Vec2.AddVV(p, box2d.b2Vec2.MulSV(0.5, n, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                            testbed.g_debugDraw.DrawSegment(p, head, new box2d.b2Color(0.9, 0.9, 0.4));
                        }
                    }
                    if (advanceRay) {
                        this.m_angle += 0.25 * box2d.b2_pi / 180.0;
                    }
                    /*
                    #if 0
                      // This case was failing.
                      {
                        b2Vec2 vertices[4];
                        //vertices[0].Set(-22.875f, -3.0f);
                        //vertices[1].Set(22.875f, -3.0f);
                        //vertices[2].Set(22.875f, 3.0f);
                        //vertices[3].Set(-22.875f, 3.0f);
                
                        b2PolygonShape shape;
                        //shape.Set(vertices, 4);
                        shape.SetAsBox(22.875f, 3.0f);
                
                        b2RayCastInput input;
                        input.p1.Set(10.2725f,1.71372f);
                        input.p2.Set(10.2353f,2.21807f);
                        //input.maxFraction = 0.567623f;
                        input.maxFraction = 0.56762173f;
                
                        b2Transform xf;
                        xf.SetIdentity();
                        xf.p.Set(23.0f, 5.0f);
                
                        b2RayCastOutput output;
                        bool hit;
                        hit = shape.RayCast(&output, input, xf);
                        hit = false;
                
                        b2Color color(1.0f, 1.0f, 1.0f);
                        b2Vec2 vs[4];
                        for (int32 i = 0; i < 4; ++i)
                        {
                          vs[i] = b2Mul(xf, shape.m_vertices[i]);
                        }
                
                        g_debugDraw.DrawPolygon(vs, 4, color);
                        g_debugDraw.DrawSegment(input.p1, input.p2, color);
                      }
                    #endif
                    */
                }
                static Create() {
                    return new RayCast();
                }
            };
            exports_1("RayCast", RayCast);
            RayCast.e_maxBodies = 256;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmF5Q2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJheUNhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLHlCQUFBLE1BQU0sc0JBQXVCLFNBQVEsS0FBSyxDQUFDLGlCQUFpQjtnQkFJMUQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSkgsVUFBSyxHQUFZLEtBQUssQ0FBQztvQkFDZCxZQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMzQyxhQUFRLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUc1RCxDQUFDO2dCQUNNLGFBQWEsQ0FBQyxPQUF3QixFQUFFLEtBQW1CLEVBQUUsTUFBb0IsRUFBRSxRQUFnQjtvQkFDeEcsTUFBTSxJQUFJLEdBQWlCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxRQUFRLEdBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN6QyxJQUFJLFFBQVEsRUFBRTt3QkFDWixNQUFNLEtBQUssR0FBVyxRQUFRLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7NEJBQ2YsdUVBQXVFOzRCQUN2RSxpREFBaUQ7NEJBQ2pELE9BQU8sQ0FBQyxDQUFDLENBQUM7eUJBQ1g7cUJBQ0Y7b0JBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFM0Isc0ZBQXNGO29CQUN0RixrRkFBa0Y7b0JBQ2xGLHNGQUFzRjtvQkFDdEYsT0FBTyxRQUFRLENBQUM7Z0JBQ2xCLENBQUM7YUFDRixDQUFBO1lBRUQsNEZBQTRGO1lBQzVGLHFG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QU0sUUFBUSxHQUFtQixFQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN6QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMxQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDekMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDckM7b0JBRUQ7d0JBQ0UsTUFBTSxRQUFRLEdBQW1CLEVBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3pDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUN6QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUNyQztvQkFFRDt3QkFDRSxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7d0JBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDeEMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRWhDLE1BQU0sUUFBUSxHQUFtQixFQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN6QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNoRCxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRTlDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENB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