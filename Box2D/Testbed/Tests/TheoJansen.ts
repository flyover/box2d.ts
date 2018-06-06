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

// Inspired by a contribution by roman_m
// Dimensions scooped from APE (http://www.cove.org/ape/index.htm)

export class TheoJansen extends testbed.Test {
  public m_offset = new box2d.b2Vec2();
  public m_chassis!: box2d.b2Body;
  public m_wheel!: box2d.b2Body;
  public m_motorJoint!: box2d.b2RevoluteJoint;
  public m_motorOn = false;
  public m_motorSpeed = 0;

  constructor() {
    super();

    this.Construct();
  }

  public CreateLeg(s: number, wheelAnchor: box2d.b2Vec2) {
    const p1 = new box2d.b2Vec2(5.4 * s, -6.1);
    const p2 = new box2d.b2Vec2(7.2 * s, -1.2);
    const p3 = new box2d.b2Vec2(4.3 * s, -1.9);
    const p4 = new box2d.b2Vec2(3.1 * s, 0.8);
    const p5 = new box2d.b2Vec2(6.0 * s, 1.5);
    const p6 = new box2d.b2Vec2(2.5 * s, 3.7);

    const fd1 = new box2d.b2FixtureDef();
    const fd2 = new box2d.b2FixtureDef();
    fd1.filter.groupIndex = -1;
    fd2.filter.groupIndex = -1;
    fd1.density = 1.0;
    fd2.density = 1.0;

    const poly1 = new box2d.b2PolygonShape();
    const poly2 = new box2d.b2PolygonShape();

    if (s > 0.0) {
      const vertices = new Array();

      vertices[0] = p1;
      vertices[1] = p2;
      vertices[2] = p3;
      poly1.Set(vertices);

      vertices[0] = box2d.b2Vec2_zero;
      vertices[1] = box2d.b2Vec2.SubVV(p5, p4, new box2d.b2Vec2());
      vertices[2] = box2d.b2Vec2.SubVV(p6, p4, new box2d.b2Vec2());
      poly2.Set(vertices);
    } else {
      const vertices = new Array();

      vertices[0] = p1;
      vertices[1] = p3;
      vertices[2] = p2;
      poly1.Set(vertices);

      vertices[0] = box2d.b2Vec2_zero;
      vertices[1] = box2d.b2Vec2.SubVV(p6, p4, new box2d.b2Vec2());
      vertices[2] = box2d.b2Vec2.SubVV(p5, p4, new box2d.b2Vec2());
      poly2.Set(vertices);
    }

    fd1.shape = poly1;
    fd2.shape = poly2;

    const bd1 = new box2d.b2BodyDef();
    const bd2 = new box2d.b2BodyDef();
    bd1.type = box2d.b2BodyType.b2_dynamicBody;
    bd2.type = box2d.b2BodyType.b2_dynamicBody;
    bd1.position.Copy(this.m_offset);
    bd2.position.Copy(box2d.b2Vec2.AddVV(p4, this.m_offset, new box2d.b2Vec2()));

    bd1.angularDamping = 10.0;
    bd2.angularDamping = 10.0;

    const body1 = this.m_world.CreateBody(bd1);
    const body2 = this.m_world.CreateBody(bd2);

    body1.CreateFixture(fd1);
    body2.CreateFixture(fd2);

    const djd = new box2d.b2DistanceJointDef();

    // Using a soft distance constraint can reduce some jitter.
    // It also makes the structure seem a bit more fluid by
    // acting like a suspension system.
    djd.dampingRatio = 0.5;
    djd.frequencyHz = 10.0;

    djd.Initialize(body1, body2, box2d.b2Vec2.AddVV(p2, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(p5, this.m_offset, new box2d.b2Vec2()));
    this.m_world.CreateJoint(djd);

    djd.Initialize(body1, body2, box2d.b2Vec2.AddVV(p3, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(p4, this.m_offset, new box2d.b2Vec2()));
    this.m_world.CreateJoint(djd);

    djd.Initialize(body1, this.m_wheel, box2d.b2Vec2.AddVV(p3, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(wheelAnchor, this.m_offset, new box2d.b2Vec2()));
    this.m_world.CreateJoint(djd);

    djd.Initialize(body2, this.m_wheel, box2d.b2Vec2.AddVV(p6, this.m_offset, new box2d.b2Vec2()), box2d.b2Vec2.AddVV(wheelAnchor, this.m_offset, new box2d.b2Vec2()));
    this.m_world.CreateJoint(djd);

    const rjd = new box2d.b2RevoluteJointDef();

    rjd.Initialize(body2, this.m_chassis, box2d.b2Vec2.AddVV(p4, this.m_offset, new box2d.b2Vec2()));
    this.m_world.CreateJoint(rjd);
  }

  public Construct() {
    this.m_offset.Set(0.0, 8.0);
    this.m_motorSpeed = 2.0;
    this.m_motorOn = true;
    const pivot = new box2d.b2Vec2(0.0, 0.8);

    // Ground
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      const shape = new box2d.b2EdgeShape();
      shape.Set(new box2d.b2Vec2(-50.0, 0.0), new box2d.b2Vec2(50.0, 0.0));
      ground.CreateFixture(shape, 0.0);

      shape.Set(new box2d.b2Vec2(-50.0, 0.0), new box2d.b2Vec2(-50.0, 10.0));
      ground.CreateFixture(shape, 0.0);

      shape.Set(new box2d.b2Vec2(50.0, 0.0), new box2d.b2Vec2(50.0, 10.0));
      ground.CreateFixture(shape, 0.0);
    }

    // Balls
    for (let i = 0; i < 40; ++i) {
      const shape = new box2d.b2CircleShape();
      shape.m_radius = 0.25;

      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Set(-40.0 + 2.0 * i, 0.5);

      const body = this.m_world.CreateBody(bd);
      body.CreateFixture(shape, 1.0);
    }

    // Chassis
    {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(2.5, 1.0);

      const sd = new box2d.b2FixtureDef();
      sd.density = 1.0;
      sd.shape = shape;
      sd.filter.groupIndex = -1;
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Copy(pivot).SelfAdd(this.m_offset);
      this.m_chassis = this.m_world.CreateBody(bd);
      this.m_chassis.CreateFixture(sd);
    }

    {
      const shape = new box2d.b2CircleShape();
      shape.m_radius = 1.6;

      const sd = new box2d.b2FixtureDef();
      sd.density = 1.0;
      sd.shape = shape;
      sd.filter.groupIndex = -1;
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position.Copy(pivot).SelfAdd(this.m_offset);
      this.m_wheel = this.m_world.CreateBody(bd);
      this.m_wheel.CreateFixture(sd);
    }

    {
      const jd = new box2d.b2RevoluteJointDef();
      jd.Initialize(this.m_wheel, this.m_chassis, box2d.b2Vec2.AddVV(pivot, this.m_offset, new box2d.b2Vec2()));
      jd.collideConnected = false;
      jd.motorSpeed = this.m_motorSpeed;
      jd.maxMotorTorque = 400.0;
      jd.enableMotor = this.m_motorOn;
      this.m_motorJoint = this.m_world.CreateJoint(jd);
    }

    const wheelAnchor = box2d.b2Vec2.AddVV(pivot, new box2d.b2Vec2(0.0, -0.8), new box2d.b2Vec2());

    this.CreateLeg(-1.0, wheelAnchor);
    this.CreateLeg(1.0, wheelAnchor);

    this.m_wheel.SetTransformVec(this.m_wheel.GetPosition(), 120.0 * box2d.b2_pi / 180.0);
    this.CreateLeg(-1.0, wheelAnchor);
    this.CreateLeg(1.0, wheelAnchor);

    this.m_wheel.SetTransformVec(this.m_wheel.GetPosition(), -120.0 * box2d.b2_pi / 180.0);
    this.CreateLeg(-1.0, wheelAnchor);
    this.CreateLeg(1.0, wheelAnchor);
  }

  public Keyboard(key: string) {
    switch (key) {
      case "a":
        this.m_motorJoint.SetMotorSpeed(-this.m_motorSpeed);
        break;

      case "s":
        this.m_motorJoint.SetMotorSpeed(0.0);
        break;

      case "d":
        this.m_motorJoint.SetMotorSpeed(this.m_motorSpeed);
        break;

      case "m":
        this.m_motorJoint.EnableMotor(!this.m_motorJoint.IsMotorEnabled());
        break;
    }
  }

  public Step(settings: testbed.Settings): void {
    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: left = a, brake = s, right = d, toggle motor = m");
    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;

    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new TheoJansen();
  }
}
