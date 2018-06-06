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

export class Revolute extends testbed.Test {
  public m_ball: box2d.b2Body;
  public m_joint: box2d.b2RevoluteJoint;

  constructor() {
    super();

    let ground = null;

    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));

      /*box2d.b2FixtureDef*/
      const fd = new box2d.b2FixtureDef();
      fd.shape = shape;
      //fd.filter.categoryBits = 2;

      ground.CreateFixture(fd);
    }

    {
      const shape = new box2d.b2CircleShape();
      shape.m_radius = 0.5;

      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;

      const rjd = new box2d.b2RevoluteJointDef();

      bd.position.Set(-10.0, 20.0);
      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 5.0);

      const w = 100.0;
      body.SetAngularVelocity(w);
      body.SetLinearVelocity(new box2d.b2Vec2(-8.0 * w, 0.0));

      rjd.Initialize(ground, body, new box2d.b2Vec2(-10.0, 12.0));
      rjd.motorSpeed = 1.0 * box2d.b2_pi;
      rjd.maxMotorTorque = 10000.0;
      rjd.enableMotor = false;
      rjd.lowerAngle = -0.25 * box2d.b2_pi;
      rjd.upperAngle = 0.5 * box2d.b2_pi;
      rjd.enableLimit = true;
      rjd.collideConnected = true;

      this.m_joint = this.m_world.CreateJoint(rjd);
    }

    {
      /*box2d.b2CircleShape*/
      const circle_shape = new box2d.b2CircleShape();
      circle_shape.m_radius = 3.0;

      const circle_bd = new box2d.b2BodyDef();
      circle_bd.type = box2d.b2BodyType.b2_dynamicBody;
      circle_bd.position.Set(5.0, 30.0);

      /*box2d.b2FixtureDef*/
      const fd = new box2d.b2FixtureDef();
      fd.density = 5.0;
      fd.filter.maskBits = 1;
      fd.shape = circle_shape;

      this.m_ball = this.m_world.CreateBody(circle_bd);
      this.m_ball.CreateFixture(fd);

      /*box2d.b2PolygonShape*/
      const polygon_shape = new box2d.b2PolygonShape();
      polygon_shape.SetAsBox(10.0, 0.2, new box2d.b2Vec2(-10.0, 0.0), 0.0);

      const polygon_bd = new box2d.b2BodyDef();
      polygon_bd.position.Set(20.0, 10.0);
      polygon_bd.type = box2d.b2BodyType.b2_dynamicBody;
      polygon_bd.bullet = true;
      /*box2d.b2Body*/
      const polygon_body = this.m_world.CreateBody(polygon_bd);
      polygon_body.CreateFixture(polygon_shape, 2.0);

      const rjd = new box2d.b2RevoluteJointDef();
      rjd.Initialize(ground, polygon_body, new box2d.b2Vec2(20.0, 10.0));
      rjd.lowerAngle = -0.25 * box2d.b2_pi;
      rjd.upperAngle = 0.0 * box2d.b2_pi;
      rjd.enableLimit = true;
      this.m_world.CreateJoint(rjd);
    }

    // Tests mass computation of a small object far from the origin
    {
      const bodyDef = new box2d.b2BodyDef();
      bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
      /*box2d.b2Body*/
      const body = this.m_world.CreateBody(bodyDef);

      /*box2d.b2PolygonShape*/
      const polyShape = new box2d.b2PolygonShape();
      /*box2d.b2Vec2*/
      const verts = box2d.b2Vec2.MakeArray(3);
      verts[0].Set(17.63, 36.31);
      verts[1].Set(17.52, 36.69);
      verts[2].Set(17.19, 36.36);
      polyShape.Set(verts, 3);

      /*box2d.b2FixtureDef*/
      const polyFixtureDef = new box2d.b2FixtureDef();
      polyFixtureDef.shape = polyShape;
      polyFixtureDef.density = 1;

      body.CreateFixture(polyFixtureDef); //assertion hits inside here
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "l":
        this.m_joint.EnableLimit(!this.m_joint.IsLimitEnabled());
        break;

      case "m":
        this.m_joint.EnableMotor(!this.m_joint.IsMotorEnabled());
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (l) limits, (m) motor");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    // if (this.m_stepCount === 360) {
    //   this.m_ball.SetTransformVec(new box2d.b2Vec2(0.0, 0.5), 0.0);
    // }

    // const torque1 = this.m_joint.GetMotorTorque(settings.hz);
    // testbed.g_debugDraw.DrawString(5, this.m_textLine, `Motor Torque = ${torque1.toFixed(0)}, ${torque2.toFixed(0)} : Motor Force = ${force3.toFixed(0)}`);
    // this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
  }

  public static Create(): testbed.Test {
    return new Revolute();
  }
}
