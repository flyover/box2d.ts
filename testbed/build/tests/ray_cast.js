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
    var b2, testbed, RayCastClosestCallback, RayCastAnyCallback, RayCastMultipleCallback, RayCastMode, RayCast;
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
            RayCastClosestCallback = class RayCastClosestCallback extends b2.RayCastCallback {
                constructor() {
                    super();
                    this.m_hit = false;
                    this.m_point = new b2.Vec2();
                    this.m_normal = new b2.Vec2();
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
            RayCastAnyCallback = class RayCastAnyCallback extends b2.RayCastCallback {
                constructor() {
                    super();
                    this.m_hit = false;
                    this.m_point = new b2.Vec2();
                    this.m_normal = new b2.Vec2();
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
            RayCastMultipleCallback = class RayCastMultipleCallback extends b2.RayCastCallback {
                constructor() {
                    super();
                    this.m_points = b2.Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
                    this.m_normals = b2.Vec2.MakeArray(RayCastMultipleCallback.e_maxCount);
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
                    // DEBUG: b2.Assert(this.m_count < RayCastMultipleCallback.e_maxCount);
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
                    this.m_circle = new b2.CircleShape();
                    this.m_edge = new b2.EdgeShape();
                    this.m_angle = 0;
                    this.m_mode = RayCastMode.e_closest;
                    for (let i = 0; i < 4; ++i) {
                        this.m_polygons[i] = new b2.PolygonShape();
                    }
                    // Ground body
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const vertices = [ /*3*/];
                        vertices[0] = new b2.Vec2(-0.5, 0.0);
                        vertices[1] = new b2.Vec2(0.5, 0.0);
                        vertices[2] = new b2.Vec2(0.0, 1.5);
                        this.m_polygons[0].Set(vertices, 3);
                    }
                    {
                        const vertices = [ /*3*/];
                        vertices[0] = new b2.Vec2(-0.1, 0.0);
                        vertices[1] = new b2.Vec2(0.1, 0.0);
                        vertices[2] = new b2.Vec2(0.0, 1.5);
                        this.m_polygons[1].Set(vertices, 3);
                    }
                    {
                        const w = 1.0;
                        const b = w / (2.0 + b2.Sqrt(2.0));
                        const s = b2.Sqrt(2.0) * b;
                        const vertices = [ /*8*/];
                        vertices[0] = new b2.Vec2(0.5 * s, 0.0);
                        vertices[1] = new b2.Vec2(0.5 * w, b);
                        vertices[2] = new b2.Vec2(0.5 * w, b + s);
                        vertices[3] = new b2.Vec2(0.5 * s, w);
                        vertices[4] = new b2.Vec2(-0.5 * s, w);
                        vertices[5] = new b2.Vec2(-0.5 * w, b + s);
                        vertices[6] = new b2.Vec2(-0.5 * w, b);
                        vertices[7] = new b2.Vec2(-0.5 * s, 0.0);
                        this.m_polygons[2].Set(vertices, 8);
                    }
                    {
                        this.m_polygons[3].SetAsBox(0.5, 0.5);
                    }
                    {
                        this.m_circle.m_radius = 0.5;
                    }
                    {
                        this.m_edge.SetTwoSided(new b2.Vec2(-1, 0), new b2.Vec2(1, 0));
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
                    const bd = new b2.BodyDef();
                    const x = b2.RandomRange(-10.0, 10.0);
                    const y = b2.RandomRange(0.0, 20.0);
                    bd.position.Set(x, y);
                    bd.angle = b2.RandomRange(-b2.pi, b2.pi);
                    bd.userData = {};
                    bd.userData.index = index;
                    if (index === 4) {
                        bd.angularDamping = 0.02;
                    }
                    const new_body = this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);
                    if (index < 4) {
                        const fd = new b2.FixtureDef();
                        fd.shape = this.m_polygons[index];
                        fd.friction = 0.3;
                        new_body.CreateFixture(fd);
                    }
                    else if (index < 5) {
                        const fd = new b2.FixtureDef();
                        fd.shape = this.m_circle;
                        fd.friction = 0.3;
                        new_body.CreateFixture(fd);
                    }
                    else {
                        const fd = new b2.FixtureDef();
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
                    const advanceRay = !settings.m_pause || settings.m_singleStep;
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
                    const point1 = new b2.Vec2(0.0, 10.0);
                    const d = new b2.Vec2(L * b2.Cos(this.m_angle), L * b2.Sin(this.m_angle));
                    const point2 = b2.Vec2.AddVV(point1, d, new b2.Vec2());
                    if (this.m_mode === RayCastMode.e_closest) {
                        const callback = new RayCastClosestCallback();
                        this.m_world.RayCast(callback, point1, point2);
                        if (callback.m_hit) {
                            testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2.Color(0.4, 0.9, 0.4));
                            testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new b2.Color(0.8, 0.8, 0.8));
                            const head = b2.Vec2.AddVV(callback.m_point, b2.Vec2.MulSV(0.5, callback.m_normal, b2.Vec2.s_t0), new b2.Vec2());
                            testbed.g_debugDraw.DrawSegment(callback.m_point, head, new b2.Color(0.9, 0.9, 0.4));
                        }
                        else {
                            testbed.g_debugDraw.DrawSegment(point1, point2, new b2.Color(0.8, 0.8, 0.8));
                        }
                    }
                    else if (this.m_mode === RayCastMode.e_any) {
                        const callback = new RayCastAnyCallback();
                        this.m_world.RayCast(callback, point1, point2);
                        if (callback.m_hit) {
                            testbed.g_debugDraw.DrawPoint(callback.m_point, 5.0, new b2.Color(0.4, 0.9, 0.4));
                            testbed.g_debugDraw.DrawSegment(point1, callback.m_point, new b2.Color(0.8, 0.8, 0.8));
                            const head = b2.Vec2.AddVV(callback.m_point, b2.Vec2.MulSV(0.5, callback.m_normal, b2.Vec2.s_t0), new b2.Vec2());
                            testbed.g_debugDraw.DrawSegment(callback.m_point, head, new b2.Color(0.9, 0.9, 0.4));
                        }
                        else {
                            testbed.g_debugDraw.DrawSegment(point1, point2, new b2.Color(0.8, 0.8, 0.8));
                        }
                    }
                    else if (this.m_mode === RayCastMode.e_multiple) {
                        const callback = new RayCastMultipleCallback();
                        this.m_world.RayCast(callback, point1, point2);
                        testbed.g_debugDraw.DrawSegment(point1, point2, new b2.Color(0.8, 0.8, 0.8));
                        for (let i = 0; i < callback.m_count; ++i) {
                            const p = callback.m_points[i];
                            const n = callback.m_normals[i];
                            testbed.g_debugDraw.DrawPoint(p, 5.0, new b2.Color(0.4, 0.9, 0.4));
                            testbed.g_debugDraw.DrawSegment(point1, p, new b2.Color(0.8, 0.8, 0.8));
                            const head = b2.Vec2.AddVV(p, b2.Vec2.MulSV(0.5, n, b2.Vec2.s_t0), new b2.Vec2());
                            testbed.g_debugDraw.DrawSegment(p, head, new b2.Color(0.9, 0.9, 0.4));
                        }
                    }
                    if (advanceRay) {
                        this.m_angle += 0.25 * b2.pi / 180.0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF5X2Nhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9yYXlfY2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0YseUJBQUEsTUFBTSxzQkFBdUIsU0FBUSxFQUFFLENBQUMsZUFBZTtnQkFJckQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSkgsVUFBSyxHQUFZLEtBQUssQ0FBQztvQkFDZCxZQUFPLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2pDLGFBQVEsR0FBWSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFHbEQsQ0FBQztnQkFDTSxhQUFhLENBQUMsT0FBbUIsRUFBRSxLQUFjLEVBQUUsTUFBZSxFQUFFLFFBQWdCO29CQUN6RixNQUFNLElBQUksR0FBWSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3hDLE1BQU0sUUFBUSxHQUFRLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDekMsSUFBSSxRQUFRLEVBQUU7d0JBQ1osTUFBTSxLQUFLLEdBQVcsUUFBUSxDQUFDLEtBQUssQ0FBQzt3QkFDckMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFOzRCQUNmLHVFQUF1RTs0QkFDdkUsaURBQWlEOzRCQUNqRCxPQUFPLENBQUMsQ0FBQyxDQUFDO3lCQUNYO3FCQUNGO29CQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBRTNCLHNGQUFzRjtvQkFDdEYsa0ZBQWtGO29CQUNsRixzRkFBc0Y7b0JBQ3RGLE9BQU8sUUFBUSxDQUFDO2dCQUNsQixDQUFDO2FBQ0YsQ0FBQTtZQUVELDRGQUE0RjtZ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LEdBQWMsRUFBQyxLQUFLLENBQUMsQ0FBQzt3QkFDcEMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDckMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3BDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ3JDO29CQUVEO3dCQUNFLE1BQU0sUUFBUSxHQUFjLEVBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3BDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3JDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUNwQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO3FCQUNyQztvQkFFRDt3QkFDRSxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7d0JBQ2QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRTNCLE1BQU0sUUFBUSxHQUFjLEVBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3BDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDeEMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN0QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3RDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENB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