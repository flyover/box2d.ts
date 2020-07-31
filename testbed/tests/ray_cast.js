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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF5X2Nhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyYXlfY2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YseUJBQUEsTUFBTSxzQkFBdUIsU0FBUSxLQUFLLENBQUMsaUJBQWlCO2dCQUkxRDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFKSCxVQUFLLEdBQVksS0FBSyxDQUFDO29CQUNkLFlBQU8sR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzNDLGFBQVEsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRzVELENBQUM7Z0JBQ00sYUFBYSxDQUFDLE9BQXdCLEVBQUUsS0FBbUIsRUFBRSxNQUFvQixFQUFFLFFBQWdCO29CQUN4RyxNQUFNLElBQUksR0FBaUIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUM3QyxNQUFNLFFBQVEsR0FBUSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3pDLElBQUksUUFBUSxFQUFFO3dCQUNaLE1BQU0sS0FBSyxHQUFXLFFBQVEsQ0FBQyxLQUFLLENBQUM7d0JBQ3JDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTs0QkFDZix1RUFBdUU7NEJBQ3ZFLGlEQUFpRDs0QkFDakQsT0FBTyxDQUFDLENBQUMsQ0FBQzt5QkFDWDtxQkFDRjtvQkFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUUzQixzRkFBc0Y7b0JBQ3RGLGtGQUFrRjtvQkFDbEYsc0ZBQXNGO29CQUN0RixPQUFPLFFBQVEsQ0FBQztnQkFDbEIsQ0FBQzthQUNGLENBQUE7WUFFRCw0RkFBNEY7WUFDNUYscUZBQXFGO1lBQ3JGLHFCQUFBLE1BQU0sa0JBQW1CLFNBQVEsS0FBSyxDQUFDLGlCQUFpQjtnQkFJdEQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSkgsVUFBSyxHQUFZLEtBQUssQ0FBQztvQkFDZCxZQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMzQyxhQUFRLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUc1RCxDQUFDO2dCQUNNLGFBQWEsQ0FBQyxPQUF3QixFQUFFLEtBQW1CLEVBQUUsTUFBb0IsRUFBRSxRQUFnQjtvQkFDeEcsTUFBTSxJQUFJLEdBQWlCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxRQUFRLEdBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN6QyxJQUFJLFFBQVEsRUFBRTt3QkFDWixNQUFNLEtBQUssR0FBVyxRQUFRLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7NEJBQ2YsdUVBQXVFOzRCQUN2RSxpREFBaUQ7NEJBQ2pELE9BQU8sQ0FBQyxDQUFDLENBQUM7eUJBQ1g7cUJBQ0Y7b0JBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFM0IsaUVBQWlFO29CQUNqRSwwRUFBMEU7b0JBQzFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNYLENBQUM7YUFDRixDQUFBO1lBRUQsNkVBQTZFO1lBQzdFLDRFQUE0RTtZQUM1RSx1QkFBdUI7WUFDdkIsMEJBQUEsTUFBTSx1QkFBd0IsU0FBUSxLQUFLLENBQUMsaUJBQWlCO2dCQUszRDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFKSCxhQUFRLEdBQW1CLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN0RixjQUFTLEdBQW1CLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN2RixZQUFPLEdBQVcsQ0FBQyxDQUFDO2dCQUczQixDQUFDO2dCQUNNLGFBQWEsQ0FBQyxPQUF3QixFQUFFLEtBQW1CLEVBQUUsTUFBb0IsRUFBRSxRQUFnQjtvQkFDeEcsTUFBTSxJQUFJLEdBQWlCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxRQUFRLEdBQVEsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN6QyxJQUFJLFFBQVEsRUFBRTt3QkFDWixNQUFNLEtBQUssR0FBVyxRQUFRLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7NEJBQ2YsdUVBQXVFOzRCQUN2RSxpREFBaUQ7NEJBQ2pELE9BQU8sQ0FBQyxDQUFDLENBQUM7eUJBQ1g7cUJBQ0Y7b0JBRUQsNEVBQTRFO29CQUU1RSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDMUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUVmLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyx1QkFBdUIsQ0FBQyxVQUFVLEVBQUU7d0JBQ3ZELG9DQUFvQzt3QkFDcEMsMEVBQTBFO3dCQUMxRSxPQUFPLENBQUMsQ0FBQztxQkFDVjtvQkFFRCwrRUFBK0U7b0JBQy9FLE9BQU8sQ0FBQyxDQUFDO2dCQUNYLENBQUM7YUFDRixDQUFBO1lBbENnQixrQ0FBVSxHQUFXLENBQUMsQ0FBQztZQW9DeEMsV0FBSyxXQUFXO2dCQUNkLHVEQUFTLENBQUE7Z0JBQ1QsK0NBQUssQ0FBQTtnQkFDTCx5REFBVSxDQUFBO1lBQ1osQ0FBQyxFQUpJLFdBQVcsS0FBWCxXQUFXLFFBSWY7WUFFRCxVQUFBLE1BQWEsT0FBUSxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQWF2QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFYRixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDeEIsYUFBUSxHQUErQixFQUFFLENBQUM7b0JBQzFDLGVBQVUsR0FBMkIsRUFBRSxDQUFDO29CQUN4QyxhQUFRLEdBQXdCLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUMxRCxXQUFNLEdBQXNCLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUVwRCxZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUVwQixXQUFNLEdBQWdCLFdBQVcsQ0FBQyxTQUFTLENBQUM7b0JBS2xELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7cUJBQ2pEO29CQUVELGNBQWM7b0JBQ2Q7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JBRUQ7d0JBQ0UsTUFBTSxRQUFRLEdBQW1CLEVBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3pDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQzFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUN6QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUNyQztvQkFFRDt3QkFDRSxNQUFNLFFBQVEsR0FBbUIsRUFBQyxLQUFLLENBQUMsQ0FBQzt3QkFDekMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDMUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3pDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ3JDO29CQUVEO3dCQUNFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQzt3QkFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUN4QyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFFaEMsTUFBTSxRQUFRLEdBQW1CLEVBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3pDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDN0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMvQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2hELFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMs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