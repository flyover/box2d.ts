/*
* Copyright (c) 2006-2010 Erin Catto http://www.box2d.org
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
System.register(["../../Common/b2Settings.js", "../../Common/b2Math.js", "./b2Shape.js", "./b2EdgeShape.js"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_js_1, b2Math_js_1, b2Shape_js_1, b2EdgeShape_js_1, b2ChainShape;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_js_1_1) {
                b2Settings_js_1 = b2Settings_js_1_1;
            },
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            },
            function (b2Shape_js_1_1) {
                b2Shape_js_1 = b2Shape_js_1_1;
            },
            function (b2EdgeShape_js_1_1) {
                b2EdgeShape_js_1 = b2EdgeShape_js_1_1;
            }
        ],
        execute: function () {
            /// A chain shape is a free form sequence of line segments.
            /// The chain has two-sided collision, so you can use inside and outside collision.
            /// Therefore, you may use any winding order.
            /// Since there may be many vertices, they are allocated using b2Alloc.
            /// Connectivity information is used to create smooth collisions.
            /// WARNING: The chain will not collide properly if there are self-intersections.
            b2ChainShape = class b2ChainShape extends b2Shape_js_1.b2Shape {
                constructor() {
                    super(b2Shape_js_1.b2ShapeType.e_chainShape, b2Settings_js_1.b2_polygonRadius);
                    this.m_vertices = [];
                    this.m_count = 0;
                    this.m_prevVertex = new b2Math_js_1.b2Vec2();
                    this.m_nextVertex = new b2Math_js_1.b2Vec2();
                    this.m_hasPrevVertex = false;
                    this.m_hasNextVertex = false;
                }
                CreateLoop(...args) {
                    if (typeof args[0][0] === "number") {
                        const vertices = args[0];
                        if (vertices.length % 2 !== 0) {
                            throw new Error();
                        }
                        return this._CreateLoop((index) => ({ x: vertices[index * 2], y: vertices[index * 2 + 1] }), vertices.length / 2);
                    }
                    else {
                        const vertices = args[0];
                        const count = args[1] || vertices.length;
                        return this._CreateLoop((index) => vertices[index], count);
                    }
                }
                _CreateLoop(vertices, count) {
                    // DEBUG: b2Assert(count >= 3);
                    if (count < 3) {
                        return this;
                    }
                    // DEBUG: for (let i: number = 1; i < count; ++i) {
                    // DEBUG:   const v1 = vertices[start + i - 1];
                    // DEBUG:   const v2 = vertices[start + i];
                    // DEBUG:   // If the code crashes here, it means your vertices are too close together.
                    // DEBUG:   b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
                    // DEBUG: }
                    this.m_count = count + 1;
                    this.m_vertices = b2Math_js_1.b2Vec2.MakeArray(this.m_count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices(i));
                    }
                    this.m_vertices[count].Copy(this.m_vertices[0]);
                    this.m_prevVertex.Copy(this.m_vertices[this.m_count - 2]);
                    this.m_nextVertex.Copy(this.m_vertices[1]);
                    this.m_hasPrevVertex = true;
                    this.m_hasNextVertex = true;
                    return this;
                }
                CreateChain(...args) {
                    if (typeof args[0][0] === "number") {
                        const vertices = args[0];
                        if (vertices.length % 2 !== 0) {
                            throw new Error();
                        }
                        return this._CreateChain((index) => ({ x: vertices[index * 2], y: vertices[index * 2 + 1] }), vertices.length / 2);
                    }
                    else {
                        const vertices = args[0];
                        const count = args[1] || vertices.length;
                        return this._CreateChain((index) => vertices[index], count);
                    }
                }
                _CreateChain(vertices, count) {
                    // DEBUG: b2Assert(count >= 2);
                    // DEBUG: for (let i: number = 1; i < count; ++i) {
                    // DEBUG:   const v1 = vertices[start + i - 1];
                    // DEBUG:   const v2 = vertices[start + i];
                    // DEBUG:   // If the code crashes here, it means your vertices are too close together.
                    // DEBUG:   b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
                    // DEBUG: }
                    this.m_count = count;
                    this.m_vertices = b2Math_js_1.b2Vec2.MakeArray(count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices(i));
                    }
                    this.m_hasPrevVertex = false;
                    this.m_hasNextVertex = false;
                    this.m_prevVertex.SetZero();
                    this.m_nextVertex.SetZero();
                    return this;
                }
                /// Establish connectivity to a vertex that precedes the first vertex.
                /// Don't call this for loops.
                SetPrevVertex(prevVertex) {
                    this.m_prevVertex.Copy(prevVertex);
                    this.m_hasPrevVertex = true;
                    return this;
                }
                /// Establish connectivity to a vertex that follows the last vertex.
                /// Don't call this for loops.
                SetNextVertex(nextVertex) {
                    this.m_nextVertex.Copy(nextVertex);
                    this.m_hasNextVertex = true;
                    return this;
                }
                /// Implement b2Shape. Vertices are cloned using b2Alloc.
                Clone() {
                    return new b2ChainShape().Copy(this);
                }
                Copy(other) {
                    super.Copy(other);
                    // DEBUG: b2Assert(other instanceof b2ChainShape);
                    this._CreateChain((index) => other.m_vertices[index], other.m_count);
                    this.m_prevVertex.Copy(other.m_prevVertex);
                    this.m_nextVertex.Copy(other.m_nextVertex);
                    this.m_hasPrevVertex = other.m_hasPrevVertex;
                    this.m_hasNextVertex = other.m_hasNextVertex;
                    return this;
                }
                /// @see b2Shape::GetChildCount
                GetChildCount() {
                    // edge count = vertex count - 1
                    return this.m_count - 1;
                }
                /// Get a child edge.
                GetChildEdge(edge, index) {
                    // DEBUG: b2Assert(0 <= index && index < this.m_count - 1);
                    edge.m_radius = this.m_radius;
                    edge.m_vertex1.Copy(this.m_vertices[index]);
                    edge.m_vertex2.Copy(this.m_vertices[index + 1]);
                    if (index > 0) {
                        edge.m_vertex0.Copy(this.m_vertices[index - 1]);
                        edge.m_hasVertex0 = true;
                    }
                    else {
                        edge.m_vertex0.Copy(this.m_prevVertex);
                        edge.m_hasVertex0 = this.m_hasPrevVertex;
                    }
                    if (index < this.m_count - 2) {
                        edge.m_vertex3.Copy(this.m_vertices[index + 2]);
                        edge.m_hasVertex3 = true;
                    }
                    else {
                        edge.m_vertex3.Copy(this.m_nextVertex);
                        edge.m_hasVertex3 = this.m_hasNextVertex;
                    }
                }
                /// This always return false.
                /// @see b2Shape::TestPoint
                TestPoint(xf, p) {
                    return false;
                }
                ComputeDistance(xf, p, normal, childIndex) {
                    const edge = b2ChainShape.ComputeDistance_s_edgeShape;
                    this.GetChildEdge(edge, childIndex);
                    return edge.ComputeDistance(xf, p, normal, 0);
                }
                RayCast(output, input, xf, childIndex) {
                    // DEBUG: b2Assert(childIndex < this.m_count);
                    const edgeShape = b2ChainShape.RayCast_s_edgeShape;
                    edgeShape.m_vertex1.Copy(this.m_vertices[childIndex]);
                    edgeShape.m_vertex2.Copy(this.m_vertices[(childIndex + 1) % this.m_count]);
                    return edgeShape.RayCast(output, input, xf, 0);
                }
                ComputeAABB(aabb, xf, childIndex) {
                    // DEBUG: b2Assert(childIndex < this.m_count);
                    const vertexi1 = this.m_vertices[childIndex];
                    const vertexi2 = this.m_vertices[(childIndex + 1) % this.m_count];
                    const v1 = b2Math_js_1.b2Transform.MulXV(xf, vertexi1, b2ChainShape.ComputeAABB_s_v1);
                    const v2 = b2Math_js_1.b2Transform.MulXV(xf, vertexi2, b2ChainShape.ComputeAABB_s_v2);
                    b2Math_js_1.b2Vec2.MinV(v1, v2, aabb.lowerBound);
                    b2Math_js_1.b2Vec2.MaxV(v1, v2, aabb.upperBound);
                }
                /// Chains have zero mass.
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    massData.mass = 0;
                    massData.center.SetZero();
                    massData.I = 0;
                }
                SetupDistanceProxy(proxy, index) {
                    // DEBUG: b2Assert(0 <= index && index < this.m_count);
                    proxy.m_vertices = proxy.m_buffer;
                    proxy.m_vertices[0].Copy(this.m_vertices[index]);
                    if (index + 1 < this.m_count) {
                        proxy.m_vertices[1].Copy(this.m_vertices[index + 1]);
                    }
                    else {
                        proxy.m_vertices[1].Copy(this.m_vertices[0]);
                    }
                    proxy.m_count = 2;
                    proxy.m_radius = this.m_radius;
                }
                ComputeSubmergedArea(normal, offset, xf, c) {
                    c.SetZero();
                    return 0;
                }
                Dump(log) {
                    log("    const shape: b2ChainShape = new b2ChainShape();\n");
                    log("    const vs: b2Vec2[] = [];\n");
                    for (let i = 0; i < this.m_count; ++i) {
                        log("    vs[%d] = new bVec2(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
                    }
                    log("    shape.CreateChain(vs, %d);\n", this.m_count);
                    log("    shape.m_prevVertex.Set(%.15f, %.15f);\n", this.m_prevVertex.x, this.m_prevVertex.y);
                    log("    shape.m_nextVertex.Set(%.15f, %.15f);\n", this.m_nextVertex.x, this.m_nextVertex.y);
                    log("    shape.m_hasPrevVertex = %s;\n", (this.m_hasPrevVertex) ? ("true") : ("false"));
                    log("    shape.m_hasNextVertex = %s;\n", (this.m_hasNextVertex) ? ("true") : ("false"));
                }
            };
            exports_1("b2ChainShape", b2ChainShape);
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2ChainShape.ComputeDistance_s_edgeShape = new b2EdgeShape_js_1.b2EdgeShape();
            // #endif
            /// Implement b2Shape.
            b2ChainShape.RayCast_s_edgeShape = new b2EdgeShape_js_1.b2EdgeShape();
            /// @see b2Shape::ComputeAABB
            b2ChainShape.ComputeAABB_s_v1 = new b2Math_js_1.b2Vec2();
            b2ChainShape.ComputeAABB_s_v2 = new b2Math_js_1.b2Vec2();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaGFpblNoYXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJDaGFpblNoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFXRiwyREFBMkQ7WUFDM0QsbUZBQW1GO1lBQ25GLDZDQUE2QztZQUM3Qyx1RUFBdUU7WUFDdkUsaUVBQWlFO1lBQ2pFLGlGQUFpRjtZQUNqRixlQUFBLE1BQWEsWUFBYSxTQUFRLG9CQUFPO2dCQVF2QztvQkFDRSxLQUFLLENBQUMsd0JBQVcsQ0FBQyxZQUFZLEVBQUUsZ0NBQWdCLENBQUMsQ0FBQztvQkFSN0MsZUFBVSxHQUFhLEVBQUUsQ0FBQztvQkFDMUIsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFDWCxpQkFBWSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUNwQyxpQkFBWSxHQUFXLElBQUksa0JBQU0sRUFBRSxDQUFDO29CQUM3QyxvQkFBZSxHQUFZLEtBQUssQ0FBQztvQkFDakMsb0JBQWUsR0FBWSxLQUFLLENBQUM7Z0JBSXhDLENBQUM7Z0JBUU0sVUFBVSxDQUFDLEdBQUcsSUFBVztvQkFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7d0JBQ2xDLE1BQU0sUUFBUSxHQUFhLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7NEJBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3lCQUFFO3dCQUNyRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFhLEVBQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLEdB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