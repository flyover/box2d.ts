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
    var box2d, testbed, PolyShapesCallback, PolyShapes;
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
            /**
             * This callback is called by box2d.b2World::QueryAABB. We find
             * all the fixtures that overlap an AABB. Of those, we use
             * b2TestOverlap to determine which fixtures overlap a circle.
             * Up to 4 overlapped fixtures will be highlighted with a yellow
             * border.
             */
            PolyShapesCallback = class PolyShapesCallback extends box2d.b2QueryCallback {
                constructor() {
                    super(...arguments);
                    this.m_circle = new box2d.b2CircleShape();
                    this.m_transform = new box2d.b2Transform();
                    this.m_count = 0;
                }
                ReportFixture(fixture) {
                    if (this.m_count === PolyShapesCallback.e_maxCount) {
                        return false;
                    }
                    const body = fixture.GetBody();
                    const shape = fixture.GetShape();
                    const overlap = box2d.b2TestOverlapShape(shape, 0, this.m_circle, 0, body.GetTransform(), this.m_transform);
                    if (overlap) {
                        this.DrawFixture(fixture);
                        ++this.m_count;
                    }
                    return true;
                }
                DrawFixture(fixture) {
                    const color = new box2d.b2Color(0.95, 0.95, 0.6);
                    const xf = fixture.GetBody().GetTransform();
                    switch (fixture.GetType()) {
                        case box2d.b2ShapeType.e_circleShape:
                            {
                                //const circle = ((shape instanceof box2d.b2CircleShape ? shape : null));
                                const circle = fixture.GetShape();
                                const center = box2d.b2Transform.MulXV(xf, circle.m_p, new box2d.b2Vec2());
                                const radius = circle.m_radius;
                                testbed.g_debugDraw.DrawCircle(center, radius, color);
                            }
                            break;
                        case box2d.b2ShapeType.e_polygonShape:
                            {
                                //const poly = ((shape instanceof box2d.b2PolygonShape ? shape : null));
                                const poly = fixture.GetShape();
                                const vertexCount = poly.m_count;
                                const vertices = [];
                                for (let i = 0; i < vertexCount; ++i) {
                                    vertices[i] = box2d.b2Transform.MulXV(xf, poly.m_vertices[i], new box2d.b2Vec2());
                                }
                                testbed.g_debugDraw.DrawPolygon(vertices, vertexCount, color);
                            }
                            break;
                        default:
                            break;
                    }
                }
            };
            exports_1("PolyShapesCallback", PolyShapesCallback);
            PolyShapesCallback.e_maxCount = 4;
            PolyShapes = class PolyShapes extends testbed.Test {
                constructor() {
                    super();
                    this.m_bodyIndex = 0;
                    this.m_bodies = new Array(PolyShapes.e_maxBodies);
                    this.m_polygons = box2d.b2MakeArray(4, () => new box2d.b2PolygonShape());
                    this.m_circle = new box2d.b2CircleShape();
                    // Ground body
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
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
                    for (let i = 0; i < PolyShapes.e_maxBodies; ++i) {
                        this.m_bodies[i] = null;
                    }
                }
                CreateBody(index) {
                    if (this.m_bodies[this.m_bodyIndex] !== null) {
                        this.m_world.DestroyBody(this.m_bodies[this.m_bodyIndex]);
                        this.m_bodies[this.m_bodyIndex] = null;
                    }
                    const bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    const x = box2d.b2RandomRange(-2.0, 2.0);
                    bd.position.Set(x, 10.0);
                    bd.angle = box2d.b2RandomRange(-box2d.b2_pi, box2d.b2_pi);
                    if (index === 4) {
                        bd.angularDamping = 0.02;
                    }
                    this.m_bodies[this.m_bodyIndex] = this.m_world.CreateBody(bd);
                    if (index < 4) {
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = this.m_polygons[index];
                        fd.density = 1.0;
                        fd.friction = 0.3;
                        this.m_bodies[this.m_bodyIndex].CreateFixture(fd);
                    }
                    else {
                        const fd = new box2d.b2FixtureDef();
                        fd.shape = this.m_circle;
                        fd.density = 1.0;
                        fd.friction = 0.3;
                        this.m_bodies[this.m_bodyIndex].CreateFixture(fd);
                    }
                    this.m_bodyIndex = (this.m_bodyIndex + 1) % PolyShapes.e_maxBodies;
                }
                DestroyBody() {
                    for (let i = 0; i < PolyShapes.e_maxBodies; ++i) {
                        if (this.m_bodies[i] !== null) {
                            this.m_world.DestroyBody(this.m_bodies[i]);
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
                        case "a":
                            for (let i = 0; i < PolyShapes.e_maxBodies; i += 2) {
                                if (this.m_bodies[i]) {
                                    const active = this.m_bodies[i].IsActive();
                                    this.m_bodies[i].SetActive(!active);
                                }
                            }
                            break;
                        case "d":
                            this.DestroyBody();
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    const callback = new PolyShapesCallback();
                    callback.m_circle.m_radius = 2.0;
                    callback.m_circle.m_p.Set(0.0, 1.1);
                    callback.m_transform.SetIdentity();
                    const aabb = new box2d.b2AABB();
                    callback.m_circle.ComputeAABB(aabb, callback.m_transform, 0);
                    this.m_world.QueryAABB(callback, aabb);
                    const color = new box2d.b2Color(0.4, 0.7, 0.8);
                    testbed.g_debugDraw.DrawCircle(callback.m_circle.m_p, callback.m_circle.m_radius, color);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 1-5 to drop stuff");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'a' to (de)activate some bodies");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press 'd' to destroy a body");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new PolyShapes();
                }
            };
            exports_1("PolyShapes", PolyShapes);
            PolyShapes.e_maxBodies = 256;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seVNoYXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBvbHlTaGFwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGOzs7Ozs7ZUFNRztZQUNILHFCQUFBLE1BQWEsa0JBQW1CLFNBQVEsS0FBSyxDQUFDLGVBQWU7Z0JBQTdEOztvQkFHUyxhQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3JDLGdCQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3RDLFlBQU8sR0FBRyxDQUFDLENBQUM7Z0JBd0RyQixDQUFDO2dCQXREUSxhQUFhLENBQUMsT0FBd0I7b0JBQzNDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUU7d0JBQ2xELE9BQU8sS0FBSyxDQUFDO3FCQUNkO29CQUVELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDL0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUVqQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUU1RyxJQUFJLE9BQU8sRUFBRTt3QkFDWCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUMxQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2hCO29CQUVELE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRU0sV0FBVyxDQUFDLE9BQXdCO29CQUN6QyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDakQsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUU1QyxRQUFRLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRTt3QkFDekIsS0FBSyxLQUFLLENBQUMsV0FBVyxDQUFDLGFBQWE7NEJBQ2xDO2dDQUNFLHlFQUF5RTtnQ0FDekUsTUFBTSxNQUFNLEdBQXdCLE9BQU8sQ0FBQyxRQUFRLEVBQXlCLENBQUM7Z0NBRTlFLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0NBQzNFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7Z0NBRS9CLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7NkJBQ3ZEOzRCQUNELE1BQU07d0JBRVIsS0FBSyxLQUFLLENBQUMsV0FBVyxDQUFDLGNBQWM7NEJBQ25DO2dDQUNFLHdFQUF3RTtnQ0FDeEUsTUFBTSxJQUFJLEdBQXlCLE9BQU8sQ0FBQyxRQUFRLEVBQTBCLENBQUM7Z0NBQzlFLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0NBQ2pDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztnQ0FFcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRTtvQ0FDcEMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7aUNBQ25GO2dDQUVELE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7NkJBQy9EOzRCQUNELE1BQU07d0JBRVI7NEJBQ0UsTUFBTTtxQkFDVDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQTs7WUE1RHdCLDZCQUFVLEdBQUcsQ0FBQyxDQUFDO1lBOER4QyxhQUFBLE1BQWEsVUFBVyxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVExQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFOSCxnQkFBVyxHQUFHLENBQUMsQ0FBQztvQkFDaEIsYUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDN0MsZUFBVSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7b0JBQ3BFLGFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFLMUMsY0FBYztvQkFDZDt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUN0QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3JFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztvQkFFRDt3QkFDRSxNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDMUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3pDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQ3JDO29CQUVEO3dCQUNFLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUMxQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDekMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDckM7b0JBRUQ7d0JBQ0UsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUNkLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3hDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUVoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDOUIsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUM3QyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQy9DLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDaEQsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUU5QyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7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