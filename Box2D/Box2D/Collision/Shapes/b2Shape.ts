/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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

/// <reference path="../../Common/b2Settings.ts"/>
/// <reference path="../../Common/b2Math.ts"/>
/// <reference path="../b2Collision.ts"/>

namespace box2d {

/// This holds the mass data computed for a shape.
export class b2MassData {
  /// The mass of the shape, usually in kilograms.
  public mass: number = 0;

  /// The position of the shape's centroid relative to the shape's origin.
  public center: b2Vec2 = new b2Vec2(0, 0);

  /// The rotational inertia of the shape about the local origin.
  public I: number = 0;
}

export enum b2ShapeType {
  e_unknown = -1,
  e_circleShape = 0,
  e_edgeShape = 1,
  e_polygonShape = 2,
  e_chainShape = 3,
  e_shapeTypeCount = 4
}

/// A shape is used for collision detection. You can create a shape however you like.
/// Shapes used for simulation in b2World are created automatically when a b2Fixture
/// is created. Shapes may encapsulate a one or more child shapes.
export class b2Shape {
  public m_type: b2ShapeType = b2ShapeType.e_unknown;
  public m_radius: number = 0;

  constructor(type: b2ShapeType, radius: number) {
    this.m_type = type;
    this.m_radius = radius;
  }

  /// Clone the concrete shape using the provided allocator.
  public Clone(): b2Shape {
    if (ENABLE_ASSERTS) { b2Assert(false); }
    return null;
  }

  public Copy(other: b2Shape): b2Shape {
    if (ENABLE_ASSERTS) { b2Assert(this.m_type === other.m_type); }
    this.m_radius = other.m_radius;
    return this;
  }

  /// Get the type of this shape. You can use this to down cast to the concrete shape.
  /// @return the shape type.
  public GetType(): b2ShapeType {
    return this.m_type;
  }

  /// Get the number of child primitives.
  public GetChildCount(): number {
    if (ENABLE_ASSERTS) { b2Assert(false, "pure virtual"); }
    return 0;
  }

  /// Test a point for containment in this shape. This only works for convex shapes.
  /// @param xf the shape world transform.
  /// @param p a point in world coordinates.
  public TestPoint(xf: b2Transform, p: b2Vec2): boolean {
    if (ENABLE_ASSERTS) { b2Assert(false, "pure virtual"); }
    return false;
  }

  /// Cast a ray against a child shape.
  /// @param output the ray-cast results.
  /// @param input the ray-cast input parameters.
  /// @param transform the transform to be applied to the shape.
  /// @param childIndex the child shape index
  public RayCast(output: b2RayCastOutput, input: b2RayCastInput, transform: b2Transform, childIndex: number): boolean {
    if (ENABLE_ASSERTS) { b2Assert(false, "pure virtual"); }
    return false;
  }

  /// Given a transform, compute the associated axis aligned bounding box for a child shape.
  /// @param aabb returns the axis aligned box.
  /// @param xf the world transform of the shape.
  /// @param childIndex the child shape
  public ComputeAABB(aabb: b2AABB, xf: b2Transform, childIndex: number): void {
    if (ENABLE_ASSERTS) { b2Assert(false, "pure virtual"); }
  }

  /// Compute the mass properties of this shape using its dimensions and density.
  /// The inertia tensor is computed about the local origin.
  /// @param massData returns the mass data for this shape.
  /// @param density the density in kilograms per meter squared.
  public ComputeMass(massData: b2MassData, density: number): void {
    if (ENABLE_ASSERTS) { b2Assert(false, "pure virtual"); }
  }

  public SetupDistanceProxy(proxy: b2DistanceProxy, index: number): void {
    if (ENABLE_ASSERTS) { b2Assert(false, "pure virtual"); }
  }

  public ComputeSubmergedArea(normal: b2Vec2, offset: number, xf: b2Transform, c: b2Vec2): number {
    if (ENABLE_ASSERTS) { b2Assert(false, "pure virtual"); }
    c.SetZero();
    return 0;
  }

  public Dump(): void {
  }
}

} // namespace box2d
