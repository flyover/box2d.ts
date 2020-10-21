// MIT License

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as b2 from "@box2d";
import * as testbed from "@testbed";

// This test holds worlds dumped using b2World::Dump.
export class DumpShell extends testbed.Test {
  constructor() {
    super();

    // dump begin
    const g = new b2.Vec2(0.000000000000000, 0.000000000000000);
    this.m_world.SetGravity(g);
    const bodies = new Array(4);
    const joints = new Array(2);
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_staticBody;
      bd.position.Set(0.000000000000000, 0.000000000000000);
      bd.angle = 0.000000000000000;
      bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
      bd.angularVelocity = 0.000000000000000;
      bd.linearDamping = 0.000000000000000;
      bd.angularDamping = 0.000000000000000;
      bd.allowSleep = true;
      bd.awake = true;
      bd.fixedRotation = false;
      bd.bullet = false;
      bd.enabled = true;
      bd.gravityScale = 1.000000000000000;
      bodies[0] = this.m_world.CreateBody(bd);
      {
        const fd = new b2.FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        const shape = new b2.EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex2.Set(44.521739959716797, 0.000000000000000);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        fd.shape = shape;
        bodies[0].CreateFixture(fd);
      }
      {
        const fd = new b2.FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        const shape = new b2.EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(0.000000000000000, 16.695652008056641);
        shape.m_vertex2.Set(44.521739959716797, 16.695652008056641);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        fd.shape = shape;
        bodies[0].CreateFixture(fd);
      }
      {
        const fd = new b2.FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        const shape = new b2.EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(0.000000000000000, 16.695652008056641);
        shape.m_vertex2.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        fd.shape = shape;
        bodies[0].CreateFixture(fd);
      }
      {
        const fd = new b2.FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        const shape = new b2.EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(44.521739959716797, 16.695652008056641);
        shape.m_vertex2.Set(44.521739959716797, 0.000000000000000);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        fd.shape = shape;
        bodies[0].CreateFixture(fd);
      }
    }
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(0.847826063632965, 2.500000000000000);
      bd.angle = 0.000000000000000;
      bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
      bd.angularVelocity = 0.000000000000000;
      bd.linearDamping = 0.500000000000000;
      bd.angularDamping = 0.500000000000000;
      bd.allowSleep = true;
      bd.awake = true;
      bd.fixedRotation = false;
      bd.bullet = false;
      bd.enabled = true;
      bd.gravityScale = 1.000000000000000;
      bodies[1] = this.m_world.CreateBody(bd);
      {
        const fd = new b2.FixtureDef();
        fd.friction = 1.000000000000000;
        fd.restitution = 0.500000000000000;
        fd.density = 10.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        const shape = new b2.PolygonShape();
        const vs = b2.Vec2.MakeArray(8);
        vs[0].Set(6.907599925994873, 0.327199995517731);
        vs[1].Set(-0.322800010442734, 0.282599985599518);
        vs[2].Set(-0.322800010442734, -0.295700013637543);
        vs[3].Set(6.885900020599365, -0.364100009202957);
        shape.Set(vs, 4);
        fd.shape = shape;
        bodies[1].CreateFixture(fd);
      }
    }
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_dynamicBody;
      bd.position.Set(13.043478012084959, 2.500000000000000);
      bd.angle = 0.000000000000000;
      bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
      bd.angularVelocity = 0.000000000000000;
      bd.linearDamping = 0.500000000000000;
      bd.angularDamping = 0.500000000000000;
      bd.allowSleep = true;
      bd.awake = true;
      bd.fixedRotation = false;
      bd.bullet = false;
      bd.enabled = true;
      bd.gravityScale = 1.000000000000000;
      bodies[2] = this.m_world.CreateBody(bd);
      {
        const fd = new b2.FixtureDef();
        fd.friction = 1.000000000000000;
        fd.restitution = 0.500000000000000;
        fd.density = 10.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        const shape = new b2.PolygonShape();
        const vs = b2.Vec2.MakeArray(8);
        vs[0].Set(0.200000002980232, -0.300000011920929);
        vs[1].Set(0.200000002980232, 0.200000002980232);
        vs[2].Set(-6.900000095367432, 0.200000002980232);
        vs[3].Set(-6.900000095367432, -0.300000011920929);
        shape.Set(vs, 4);
        fd.shape = shape;
        bodies[2].CreateFixture(fd);
      }
    }
    {
      const bd = new b2.BodyDef();
      bd.type = b2.BodyType.b2_staticBody;
      bd.position.Set(0.000000000000000, 0.000000000000000);
      bd.angle = 0.000000000000000;
      bd.linearVelocity.Set(0.000000000000000, 0.000000000000000);
      bd.angularVelocity = 0.000000000000000;
      bd.linearDamping = 0.000000000000000;
      bd.angularDamping = 0.000000000000000;
      bd.allowSleep = true;
      bd.awake = true;
      bd.fixedRotation = false;
      bd.bullet = false;
      bd.enabled = true;
      bd.gravityScale = 1.000000000000000;
      bodies[3] = this.m_world.CreateBody(bd);
    }
    {
      const jd = new b2.RevoluteJointDef();
      jd.bodyA = bodies[1];
      jd.bodyB = bodies[0];
      jd.collideConnected = false;
      jd.localAnchorA.Set(0.000000000000000, 0.000000000000000);
      jd.localAnchorB.Set(0.847826063632965, 2.500000000000000);
      jd.referenceAngle = 0.000000000000000;
      jd.enableLimit = false;
      jd.lowerAngle = 0.000000000000000;
      jd.upperAngle = 0.000000000000000;
      jd.enableMotor = false;
      jd.motorSpeed = 0.000000000000000;
      jd.maxMotorTorque = 0.000000000000000;
      joints[0] = this.m_world.CreateJoint(jd);
    }
    {
      const jd = new b2.PrismaticJointDef();
      jd.bodyA = bodies[1];
      jd.bodyB = bodies[2];
      jd.collideConnected = false;
      jd.localAnchorA.Set(0.000000000000000, 0.000000000000000);
      jd.localAnchorB.Set(-12.195652008056641, 0.000000000000000);
      jd.localAxisA.Set(-1.000000000000000, 0.000000000000000);
      jd.referenceAngle = 0.000000000000000;
      jd.enableLimit = true;
      jd.lowerTranslation = -20.000000000000000;
      jd.upperTranslation = 0.000000000000000;
      jd.enableMotor = true;
      jd.motorSpeed = 0.000000000000000;
      jd.maxMotorForce = 10.000000000000000;
      joints[1] = this.m_world.CreateJoint(jd);
    }
    // dump end
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new DumpShell();
  }
}

export const testIndex: number = testbed.RegisterTest("Bugs", "Dump Loader", DumpShell.Create);
