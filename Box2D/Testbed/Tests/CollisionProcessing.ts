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

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class CollisionProcessing extends testbed.Test {
  constructor() {
    super();

    // Ground body
    {
      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));

      const sd = new box2d.b2FixtureDef();
      sd.shape = shape;

      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);
      ground.CreateFixture(sd);
    }

    const xLo = -5.0,
      xHi = 5.0;
    const yLo = 2.0,
      yHi = 35.0;

    // Small triangle
    const vertices = new Array(3);
    vertices[0] = new box2d.b2Vec2(-1.0, 0.0);
    vertices[1] = new box2d.b2Vec2(1.0, 0.0);
    vertices[2] = new box2d.b2Vec2(0.0, 2.0);

    const polygon = new box2d.b2PolygonShape();
    polygon.Set(vertices, 3);

    const triangleShapeDef = new box2d.b2FixtureDef();
    triangleShapeDef.shape = polygon;
    triangleShapeDef.density = 1.0;

    const triangleBodyDef = new box2d.b2BodyDef();
    triangleBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
    triangleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));

    const body1 = this.m_world.CreateBody(triangleBodyDef);
    body1.CreateFixture(triangleShapeDef);

    // Large triangle (recycle definitions)
    vertices[0].SelfMul(2.0);
    vertices[1].SelfMul(2.0);
    vertices[2].SelfMul(2.0);
    polygon.Set(vertices, 3);

    triangleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));

    const body2 = this.m_world.CreateBody(triangleBodyDef);
    body2.CreateFixture(triangleShapeDef);

    // Small box
    polygon.SetAsBox(1.0, 0.5);

    const boxShapeDef = new box2d.b2FixtureDef();
    boxShapeDef.shape = polygon;
    boxShapeDef.density = 1.0;

    const boxBodyDef = new box2d.b2BodyDef();
    boxBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
    boxBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));

    const body3 = this.m_world.CreateBody(boxBodyDef);
    body3.CreateFixture(boxShapeDef);

    // Large box (recycle definitions)
    polygon.SetAsBox(2.0, 1.0);
    boxBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));

    const body4 = this.m_world.CreateBody(boxBodyDef);
    body4.CreateFixture(boxShapeDef);

    // Small circle
    const circle = new box2d.b2CircleShape();
    circle.m_radius = 1.0;

    const circleShapeDef = new box2d.b2FixtureDef();
    circleShapeDef.shape = circle;
    circleShapeDef.density = 1.0;

    const circleBodyDef = new box2d.b2BodyDef();
    circleBodyDef.type = box2d.b2BodyType.b2_dynamicBody;
    circleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));

    const body5 = this.m_world.CreateBody(circleBodyDef);
    body5.CreateFixture(circleShapeDef);

    // Large circle
    circle.m_radius *= 2.0;
    circleBodyDef.position.Set(box2d.b2RandomRange(xLo, xHi), box2d.b2RandomRange(yLo, yHi));

    const body6 = this.m_world.CreateBody(circleBodyDef);
    body6.CreateFixture(circleShapeDef);

  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    // We are going to destroy some bodies according to contact
    // points. We must buffer the bodies that should be destroyed
    // because they may belong to multiple contact points.
    const k_maxNuke = 6;
    const nuke = new Array(k_maxNuke);
    let nukeCount = 0;

    // Traverse the contact results. Destroy bodies that
    // are touching heavier bodies.
    for (let i = 0; i < this.m_pointCount; ++i) {
      const point = this.m_points[i];

      const body1 = point.fixtureA.GetBody();
      const body2 = point.fixtureB.GetBody();
      const mass1 = body1.GetMass();
      const mass2 = body2.GetMass();

      if (mass1 > 0.0 && mass2 > 0.0) {
        if (mass2 > mass1) {
          nuke[nukeCount++] = body1;
        } else {
          nuke[nukeCount++] = body2;
        }

        if (nukeCount === k_maxNuke) {
          break;
        }
      }
    }

    // Sort the nuke array to group duplicates.
    nuke.sort((a, b) => {
      return a - b;
    });

    // Destroy the bodies, skipping duplicates.
    let i = 0;
    while (i < nukeCount) {
      const b = nuke[i++];
      while (i < nukeCount && nuke[i] === b) {
        ++i;
      }

      if (b !== this.m_bomb) {
        this.m_world.DestroyBody(b);
      }
    }
  }

  public static Create(): testbed.Test {
    return new CollisionProcessing();
  }
}
