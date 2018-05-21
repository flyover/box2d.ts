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
System.register(["../../Common/b2Settings", "../../Common/b2Math", "./b2Shape", "./b2EdgeShape"], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2Math_1, b2Shape_1, b2EdgeShape_1, b2ChainShape;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            },
            function (b2EdgeShape_1_1) {
                b2EdgeShape_1 = b2EdgeShape_1_1;
            }
        ],
        execute: function () {/*
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
            /// A chain shape is a free form sequence of line segments.
            /// The chain has two-sided collision, so you can use inside and outside collision.
            /// Therefore, you may use any winding order.
            /// Since there may be many vertices, they are allocated using b2Alloc.
            /// Connectivity information is used to create smooth collisions.
            /// WARNING: The chain will not collide properly if there are self-intersections.
            b2ChainShape = class b2ChainShape extends b2Shape_1.b2Shape {
                constructor() {
                    super(3 /* e_chainShape */, b2Settings_1.b2_polygonRadius);
                    this.m_count = 0;
                    this.m_prevVertex = new b2Math_1.b2Vec2();
                    this.m_nextVertex = new b2Math_1.b2Vec2();
                    this.m_hasPrevVertex = false;
                    this.m_hasNextVertex = false;
                }
                /// Create a loop. This automatically adjusts connectivity.
                /// @param vertices an array of vertices, these are copied
                /// @param count the vertex count
                CreateLoop(vertices, count = vertices.length) {
                    ///b2Assert(this.m_vertices === null && this.m_count === 0);
                    ///b2Assert(count >= 3);
                    ///for (let i: number = 1; i < count; ++i) {
                    ///  const v1 = vertices[i - 1];
                    ///  const v2 = vertices[i];
                    ///  // If the code crashes here, it means your vertices are too close together.
                    ///  b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
                    ///}
                    this.m_count = count + 1;
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices[i]);
                    }
                    this.m_vertices[count].Copy(this.m_vertices[0]);
                    this.m_prevVertex.Copy(this.m_vertices[this.m_count - 2]);
                    this.m_nextVertex.Copy(this.m_vertices[1]);
                    this.m_hasPrevVertex = true;
                    this.m_hasNextVertex = true;
                    return this;
                }
                /// Create a chain with isolated end vertices.
                /// @param vertices an array of vertices, these are copied
                /// @param count the vertex count
                CreateChain(vertices, count = vertices.length) {
                    ///b2Assert(this.m_vertices === null && this.m_count === 0);
                    ///b2Assert(count >= 2);
                    ///for (let i: number = 1; i < count; ++i) {
                    ///  const v1 = vertices[i - 1];
                    ///  const v2 = vertices[i];
                    ///  // If the code crashes here, it means your vertices are too close together.
                    ///  b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
                    ///}
                    this.m_count = count;
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices[i]);
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
                    ///b2Assert(other instanceof b2ChainShape);
                    this.CreateChain(other.m_vertices, other.m_count);
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
                    ///b2Assert(0 <= index && index < this.m_count - 1);
                    edge.m_type = 1 /* e_edgeShape */;
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
                    ///b2Assert(childIndex < this.m_count);
                    const edgeShape = b2ChainShape.RayCast_s_edgeShape;
                    edgeShape.m_vertex1.Copy(this.m_vertices[childIndex]);
                    edgeShape.m_vertex2.Copy(this.m_vertices[(childIndex + 1) % this.m_count]);
                    return edgeShape.RayCast(output, input, xf, 0);
                }
                ComputeAABB(aabb, xf, childIndex) {
                    ///b2Assert(childIndex < this.m_count);
                    const vertexi1 = this.m_vertices[childIndex];
                    const vertexi2 = this.m_vertices[(childIndex + 1) % this.m_count];
                    const v1 = b2Math_1.b2Transform.MulXV(xf, vertexi1, b2ChainShape.ComputeAABB_s_v1);
                    const v2 = b2Math_1.b2Transform.MulXV(xf, vertexi2, b2ChainShape.ComputeAABB_s_v2);
                    b2Math_1.b2Vec2.MinV(v1, v2, aabb.lowerBound);
                    b2Math_1.b2Vec2.MaxV(v1, v2, aabb.upperBound);
                }
                /// Chains have zero mass.
                /// @see b2Shape::ComputeMass
                ComputeMass(massData, density) {
                    massData.mass = 0;
                    massData.center.SetZero();
                    massData.I = 0;
                }
                SetupDistanceProxy(proxy, index) {
                    ///b2Assert(0 <= index && index < this.m_count);
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
                    log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2Settings_1.b2_maxPolygonVertices);
                    for (let i = 0; i < this.m_count; ++i) {
                        log("    vs[%d].Set(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
                    }
                    log("    shape.CreateChain(vs, %d);\n", this.m_count);
                    log("    shape.m_prevVertex.Set(%.15f, %.15f);\n", this.m_prevVertex.x, this.m_prevVertex.y);
                    log("    shape.m_nextVertex.Set(%.15f, %.15f);\n", this.m_nextVertex.x, this.m_nextVertex.y);
                    log("    shape.m_hasPrevVertex = %s;\n", (this.m_hasPrevVertex) ? ("true") : ("false"));
                    log("    shape.m_hasNextVertex = %s;\n", (this.m_hasNextVertex) ? ("true") : ("false"));
                }
            };
            ///#if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2ChainShape.ComputeDistance_s_edgeShape = new b2EdgeShape_1.b2EdgeShape();
            ///#endif
            /// Implement b2Shape.
            b2ChainShape.RayCast_s_edgeShape = new b2EdgeShape_1.b2EdgeShape();
            /// @see b2Shape::ComputeAABB
            b2ChainShape.ComputeAABB_s_v1 = new b2Math_1.b2Vec2();
            b2ChainShape.ComputeAABB_s_v2 = new b2Math_1.b2Vec2();
            exports_1("b2ChainShape", b2ChainShape);
        }
    };
});
