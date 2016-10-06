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

/// <reference path="./b2Shape.ts"/>
/// <reference path="./b2EdgeShape.ts"/>

namespace box2d {

/// A chain shape is a free form sequence of line segments.
/// The chain has two-sided collision, so you can use inside and outside collision.
/// Therefore, you may use any winding order.
/// Since there may be many vertices, they are allocated using b2Alloc.
/// Connectivity information is used to create smooth collisions.
/// WARNING: The chain will not collide properly if there are self-intersections.
export class b2ChainShape extends b2Shape {
  public m_vertices: b2Vec2[] = null;
  public m_count: number = 0;
  public m_prevVertex: b2Vec2 = new b2Vec2();
  public m_nextVertex: b2Vec2 = new b2Vec2();
  public m_hasPrevVertex: boolean = false;
  public m_hasNextVertex: boolean = false;

  constructor() {
    super(b2ShapeType.e_chainShape, b2_polygonRadius);
  }

  /// Create a loop. This automatically adjusts connectivity.
  /// @param vertices an array of vertices, these are copied
  /// @param count the vertex count
  public CreateLoop(vertices: b2Vec2[], count: number = vertices.length): b2ChainShape {
    count = count || vertices.length;
    if (ENABLE_ASSERTS) { b2Assert(this.m_vertices === null && this.m_count === 0); }
    if (ENABLE_ASSERTS) { b2Assert(count >= 3); }
    if (ENABLE_ASSERTS) {
      for (let i: number = 1; i < count; ++i) {
        const v1 = vertices[i - 1];
        const v2 = vertices[i];
        // If the code crashes here, it means your vertices are too close together.
        b2Assert(b2DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
      }
    }

    this.m_count = count + 1;
    this.m_vertices = b2Vec2.MakeArray(this.m_count);
    for (let i: number = 0; i < count; ++i) {
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
  public CreateChain(vertices: b2Vec2[], count: number = vertices.length): b2ChainShape {
    count = count || vertices.length;
    if (ENABLE_ASSERTS) { b2Assert(this.m_vertices === null && this.m_count === 0); }
    if (ENABLE_ASSERTS) { b2Assert(count >= 2); }
    if (ENABLE_ASSERTS) {
      for (let i: number = 1; i < count; ++i) {
        const v1 = vertices[i - 1];
        const v2 = vertices[i];
        // If the code crashes here, it means your vertices are too close together.
        b2Assert(b2DistanceSquaredVV(v1, v2) > b2_linearSlop * b2_linearSlop);
      }
    }

    this.m_count = count;
    this.m_vertices = b2Vec2.MakeArray(count);
    for (let i: number = 0; i < count; ++i) {
      this.m_vertices[i].Copy(vertices[i]);
    }
    this.m_hasPrevVertex = false;
    this.m_hasNextVertex = false;
    return this;
  }

  /// Establish connectivity to a vertex that precedes the first vertex.
  /// Don't call this for loops.
  public SetPrevVertex(prevVertex: b2Vec2): b2ChainShape {
    this.m_prevVertex.Copy(prevVertex);
    this.m_hasPrevVertex = true;
    return this;
  }

  /// Establish connectivity to a vertex that follows the last vertex.
  /// Don't call this for loops.
  public SetNextVertex(nextVertex: b2Vec2): b2ChainShape {
    this.m_nextVertex.Copy(nextVertex);
    this.m_hasNextVertex = true;
    return this;
  }

  /// Implement b2Shape. Vertices are cloned using b2Alloc.
  public Clone(): b2ChainShape {
    return new b2ChainShape().Copy(this);
  }

  public Copy(other: b2ChainShape): b2ChainShape {
    super.Copy(other);

    if (ENABLE_ASSERTS) { b2Assert(other instanceof b2ChainShape); }

    this.CreateChain(other.m_vertices, other.m_count);
    this.m_prevVertex.Copy(other.m_prevVertex);
    this.m_nextVertex.Copy(other.m_nextVertex);
    this.m_hasPrevVertex = other.m_hasPrevVertex;
    this.m_hasNextVertex = other.m_hasNextVertex;

    return this;
  }

  /// @see b2Shape::GetChildCount
  public GetChildCount(): number {
    // edge count = vertex count - 1
    return this.m_count - 1;
  }

  /// Get a child edge.
  public GetChildEdge(edge: b2EdgeShape, index: number): void {
    if (ENABLE_ASSERTS) { b2Assert(0 <= index && index < this.m_count - 1); }
    edge.m_type = b2ShapeType.e_edgeShape;
    edge.m_radius = this.m_radius;

    edge.m_vertex1.Copy(this.m_vertices[index]);
    edge.m_vertex2.Copy(this.m_vertices[index + 1]);

    if (index > 0) {
      edge.m_vertex0.Copy(this.m_vertices[index - 1]);
      edge.m_hasVertex0 = true;
    } else {
      edge.m_vertex0.Copy(this.m_prevVertex);
      edge.m_hasVertex0 = this.m_hasPrevVertex;
    }

    if (index < this.m_count - 2) {
      edge.m_vertex3.Copy(this.m_vertices[index + 2]);
      edge.m_hasVertex3 = true;
    } else {
      edge.m_vertex3.Copy(this.m_nextVertex);
      edge.m_hasVertex3 = this.m_hasNextVertex;
    }
  }

  /// This always return false.
  /// @see b2Shape::TestPoint
  public TestPoint(xf: b2Transform, p: b2Vec2): boolean {
    return false;
  }

  /// Implement b2Shape.
  private static RayCast_s_edgeShape = new b2EdgeShape();
  public RayCast(output: b2RayCastOutput, input: b2RayCastInput, xf: b2Transform, childIndex: number): boolean {
    if (ENABLE_ASSERTS) { b2Assert(childIndex < this.m_count); }

    const edgeShape: b2EdgeShape = b2ChainShape.RayCast_s_edgeShape;

    edgeShape.m_vertex1.Copy(this.m_vertices[childIndex]);
    edgeShape.m_vertex2.Copy(this.m_vertices[(childIndex + 1) % this.m_count]);

    return edgeShape.RayCast(output, input, xf, 0);
  }

  /// @see b2Shape::ComputeAABB
  private static ComputeAABB_s_v1 = new b2Vec2();
  private static ComputeAABB_s_v2 = new b2Vec2();
  public ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void {
    if (ENABLE_ASSERTS) { b2Assert(childIndex < this.m_count); }

    const vertexi1: b2Vec2 = this.m_vertices[childIndex];
    const vertexi2: b2Vec2 = this.m_vertices[(childIndex + 1) % this.m_count];

    const v1: b2Vec2 = b2MulXV(xf, vertexi1, b2ChainShape.ComputeAABB_s_v1);
    const v2: b2Vec2 = b2MulXV(xf, vertexi2, b2ChainShape.ComputeAABB_s_v2);

    b2MinV(v1, v2, aabb.lowerBound);
    b2MaxV(v1, v2, aabb.upperBound);
  }

  /// Chains have zero mass.
  /// @see b2Shape::ComputeMass
  public ComputeMass(massData: b2MassData, density: number): void {
    massData.mass = 0;
    massData.center.SetZero();
    massData.I = 0;
  }

  public SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void {
    if (ENABLE_ASSERTS) { b2Assert(0 <= index && index < this.m_count); }

    proxy.m_buffer[0].Copy(this.m_vertices[index]);
    if (index + 1 < this.m_count) {
      proxy.m_buffer[1].Copy(this.m_vertices[index + 1]);
    } else {
      proxy.m_buffer[1].Copy(this.m_vertices[0]);
    }

    proxy.m_vertices = proxy.m_buffer;
    proxy.m_count = 2;
    proxy.m_radius = this.m_radius;
  }

  public ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number {
    c.SetZero();
    return 0;
  }

  public Dump(): void {
    b2Log("    const shape: b2ChainShape = new b2ChainShape();\n");
    b2Log("    const vs: b2Vec2[] = b2Vec2.MakeArray(%d);\n", b2_maxPolygonVertices);
    for (let i: number = 0; i < this.m_count; ++i) {
      b2Log("    vs[%d].SetXY(%.15f, %.15f);\n", i, this.m_vertices[i].x, this.m_vertices[i].y);
    }
    b2Log("    shape.CreateChain(vs, %d);\n", this.m_count);
    b2Log("    shape.m_prevVertex.SetXY(%.15f, %.15f);\n", this.m_prevVertex.x, this.m_prevVertex.y);
    b2Log("    shape.m_nextVertex.SetXY(%.15f, %.15f);\n", this.m_nextVertex.x, this.m_nextVertex.y);
    b2Log("    shape.m_hasPrevVertex = %s;\n", (this.m_hasPrevVertex) ? ("true") : ("false"));
    b2Log("    shape.m_hasNextVertex = %s;\n", (this.m_hasNextVertex) ? ("true") : ("false"));
  }
}

} // namespace box2d
