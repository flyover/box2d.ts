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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaGFpblNoYXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vQm94MkQvQ29sbGlzaW9uL1NoYXBlcy9iMkNoYWluU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVdGLDJEQUEyRDtZQUMzRCxtRkFBbUY7WUFDbkYsNkNBQTZDO1lBQzdDLHVFQUF1RTtZQUN2RSxpRUFBaUU7WUFDakUsaUZBQWlGO1lBQ2pGLGVBQUEsa0JBQTBCLFNBQVEsaUJBQU87Z0JBUXZDO29CQUNFLEtBQUssQ0FBQyxxQkFBVyxDQUFDLFlBQVksRUFBRSw2QkFBZ0IsQ0FBQyxDQUFDO29CQVI3QyxlQUFVLEdBQWEsRUFBRSxDQUFDO29CQUMxQixZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUNYLGlCQUFZLEdBQVcsSUFBSSxlQUFNLEVBQUUsQ0FBQztvQkFDcEMsaUJBQVksR0FBVyxJQUFJLGVBQU0sRUFBRSxDQUFDO29CQUM3QyxvQkFBZSxHQUFZLEtBQUssQ0FBQztvQkFDakMsb0JBQWUsR0FBWSxLQUFLLENBQUM7Z0JBSXhDLENBQUM7Z0JBRUQsMkRBQTJEO2dCQUMzRCwwREFBMEQ7Z0JBQzFELGlDQUFpQztnQkFDMUIsVUFBVSxDQUFDLFFBQWMsRUFBRSxRQUFnQixRQUFRLENBQUMsTUFBTSxFQUFFLFFBQWdCLENBQUM7b0JBQ2xGLCtCQUErQjtvQkFDL0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO3dCQUNiLE9BQU8sSUFBSSxDQUFDO3FCQUNiO29CQUNELG1EQUFtRDtvQkFDbkQsK0NBQStDO29CQUMvQywyQ0FBMkM7b0JBQzNDLHVGQUF1RjtvQkFDdkYsdUZBQXVGO29CQUN2RixXQUFXO29CQUVYLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFNLENBQUMsU0FBUyxD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