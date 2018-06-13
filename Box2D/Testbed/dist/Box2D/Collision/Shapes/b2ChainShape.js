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
    "use strict";
    var b2Settings_1, b2Math_1, b2Shape_1, b2EdgeShape_1, b2ChainShape;
    var __moduleName = context_1 && context_1.id;
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
        execute: function () {
            /// A chain shape is a free form sequence of line segments.
            /// The chain has two-sided collision, so you can use inside and outside collision.
            /// Therefore, you may use any winding order.
            /// Since there may be many vertices, they are allocated using b2Alloc.
            /// Connectivity information is used to create smooth collisions.
            /// WARNING: The chain will not collide properly if there are self-intersections.
            b2ChainShape = class b2ChainShape extends b2Shape_1.b2Shape {
                constructor() {
                    super(b2Shape_1.b2ShapeType.e_chainShape, b2Settings_1.b2_polygonRadius);
                    this.m_vertices = [];
                    this.m_count = 0;
                    this.m_prevVertex = new b2Math_1.b2Vec2();
                    this.m_nextVertex = new b2Math_1.b2Vec2();
                    this.m_hasPrevVertex = false;
                    this.m_hasNextVertex = false;
                }
                /// Create a loop. This automatically adjusts connectivity.
                /// @param vertices an array of vertices, these are copied
                /// @param count the vertex count
                CreateLoop(vertices, count = vertices.length, start = 0) {
                    // DEBUG: b2Assert(count >= 3);
                    // DEBUG: for (let i: number = 1; i < count; ++i) {
                    // DEBUG:   const v1 = vertices[start + i - 1];
                    // DEBUG:   const v2 = vertices[start + i];
                    // DEBUG:   // If the code crashes here, it means your vertices are too close together.
                    // DEBUG:   b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
                    // DEBUG: }
                    this.m_count = count + 1;
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(this.m_count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices[start + i]);
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
                CreateChain(vertices, count = vertices.length, start = 0) {
                    // DEBUG: b2Assert(count >= 2);
                    // DEBUG: for (let i: number = 1; i < count; ++i) {
                    // DEBUG:   const v1 = vertices[start + i - 1];
                    // DEBUG:   const v2 = vertices[start + i];
                    // DEBUG:   // If the code crashes here, it means your vertices are too close together.
                    // DEBUG:   b2Assert(b2Vec2.DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
                    // DEBUG: }
                    this.m_count = count;
                    this.m_vertices = b2Math_1.b2Vec2.MakeArray(count);
                    for (let i = 0; i < count; ++i) {
                        this.m_vertices[i].Copy(vertices[start + i]);
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
                    // DEBUG: b2Assert(0 <= index && index < this.m_count - 1);
                    edge.m_type = b2Shape_1.b2ShapeType.e_edgeShape;
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
            // #if B2_ENABLE_PARTICLE
            /// @see b2Shape::ComputeDistance
            b2ChainShape.ComputeDistance_s_edgeShape = new b2EdgeShape_1.b2EdgeShape();
            // #endif
            /// Implement b2Shape.
            b2ChainShape.RayCast_s_edgeShape = new b2EdgeShape_1.b2EdgeShape();
            /// @see b2Shape::ComputeAABB
            b2ChainShape.ComputeAABB_s_v1 = new b2Math_1.b2Vec2();
            b2ChainShape.ComputeAABB_s_v2 = new b2Math_1.b2Vec2();
            exports_1("b2ChainShape", b2ChainShape);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaGFpblNoYXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vQm94MkQvQ29sbGlzaW9uL1NoYXBlcy9iMkNoYWluU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVdGLDJEQUEyRDtZQUMzRCxtRkFBbUY7WUFDbkYsNkNBQTZDO1lBQzdDLHVFQUF1RTtZQUN2RSxpRUFBaUU7WUFDakUsaUZBQWlGO1lBQ2pGLGVBQUEsa0JBQTBCLFNBQVEsaUJBQU87Z0JBUXZDO29CQUNFLEtBQUssQ0FBQyxxQkFBVyxDQUFDLFlBQVksRUFBRSw2QkFBZ0IsQ0FBQyxDQUFDO29CQVI3QyxlQUFVLEdBQWEsRUFBRSxDQUFDO29CQUMxQixZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUNYLGlCQUFZLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDcEMsaUJBQVksR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUM3QyxvQkFBZSxHQUFZLEtBQUssQ0FBQztvQkFDakMsb0JBQWUsR0FBWSxLQUFLLENBQUM7Z0JBSXhDLENBQUM7Z0JBRUQsMkRBQTJEO2dCQUMzRCwwREFBMEQ7Z0JBQzFELGlDQUFpQztnQkFDMUIsVUFBVSxDQUFDLFFBQWMsRUFBRSxRQUFnQixRQUFRLENBQUMsTUFBTSxFQUFFLFFBQWdCLENBQUM7b0JBQ2xGLCtCQUErQjtvQkFDL0IsbURBQW1EO29CQUNuRCwrQ0FBK0M7b0JBQy9DLDJDQUEyQztvQkFDM0MsdUZBQXVGO29CQUN2Rix1RkFBdUY7b0JBQ3ZGLFdBQVc7b0JBRVgsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLGVBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqRCxLQUFLLElBQUksQ0FBQyxHQUFX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