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

export class Pulleys extends testbed.Test {
  public m_joint1: box2d.b2PulleyJoint;

  constructor() {
    super();

    const y = 16.0;
    const L = 12.0;
    const a = 1.0;
    const b = 2.0;

    let ground = null;
    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const edge = new box2d.b2EdgeShape();
      edge.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
      //ground.CreateFixture(edge, 0.0);

      /*box2d.b2CircleShape*/
      const circle = new box2d.b2CircleShape();
      circle.m_radius = 2.0;

      circle.m_p.Set(-10.0, y + b + L);
      ground.CreateFixture(circle, 0.0);

      circle.m_p.Set(10.0, y + b + L);
      ground.CreateFixture(circle, 0.0);
    }

    {

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(a, b);

      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;

      //bd.fixedRotation = true;
      bd.position.Set(-10.0, y);
      const body1 = this.m_world.CreateBody(bd);
      body1.CreateFixture(shape, 5.0);

      bd.position.Set(10.0, y);
      const body2 = this.m_world.CreateBody(bd);
      body2.CreateFixture(shape, 5.0);

      const pulleyDef = new box2d.b2PulleyJointDef();
      const anchor1 = new box2d.b2Vec2(-10.0, y + b);
      const anchor2 = new box2d.b2Vec2(10.0, y + b);
      const groundAnchor1 = new box2d.b2Vec2(-10.0, y + b + L);
      const groundAnchor2 = new box2d.b2Vec2(10.0, y + b + L);
      pulleyDef.Initialize(body1, body2, groundAnchor1, groundAnchor2, anchor1, anchor2, 1.5);

      this.m_joint1 = this.m_world.CreateJoint(pulleyDef);
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    const ratio = this.m_joint1.GetRatio();
    const L = this.m_joint1.GetCurrentLengthA() + ratio * this.m_joint1.GetCurrentLengthB();
    testbed.g_debugDraw.DrawString(5, this.m_textLine, `L1 + ${ratio.toFixed(2)} * L2 = ${L.toFixed(2)}`);
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Pulleys();
  }
}
