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

// DEBUG: import { b2Assert } from "../../Common/b2Settings";
// DEBUG: import { b2ShapeType } from "../../Collision/Shapes/b2Shape";
import { b2Transform } from "../../Common/b2Math";
import { b2CollideCircles } from "../../Collision/b2CollideCircle";
import { b2Manifold } from "../../Collision/b2Collision";
import { b2Shape } from "../../Collision/Shapes/b2Shape";
import { b2CircleShape } from "../../Collision/Shapes/b2CircleShape";
import { b2Contact } from "./b2Contact";
import { b2Fixture } from "../b2Fixture";

export class b2CircleContact extends b2Contact {
  constructor() {
    super();
  }

  public static Create(allocator: any): b2Contact {
    return new b2CircleContact();
  }

  public static Destroy(contact: b2Contact, allocator: any): void {
  }

  public Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void {
    super.Reset(fixtureA, indexA, fixtureB, indexB);
  }

  public Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void {
    const shapeA: b2Shape = this.m_fixtureA.GetShape();
    const shapeB: b2Shape = this.m_fixtureB.GetShape();
    // DEBUG: b2Assert(shapeA.GetType() === b2ShapeType.e_circleShape);
    // DEBUG: b2Assert(shapeB.GetType() === b2ShapeType.e_circleShape);
    b2CollideCircles(
      manifold,
      shapeA as b2CircleShape, xfA,
      shapeB as b2CircleShape, xfB);
  }
}
