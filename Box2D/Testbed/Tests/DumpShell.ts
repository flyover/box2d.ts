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

export class DumpShell extends testbed.Test {
  constructor() {
    super();

    // dump begin
    /*box2d.b2Vec2*/
    const g = new box2d.b2Vec2(0.000000000000000, 0.000000000000000);
    this.m_world.SetGravity(g);
    /*box2d.b2Body*/
    const bodies = new Array(4);
    /*box2d.b2Joint*/
    const joints = new Array(2); {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_staticBody;
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
      bd.active = true;
      bd.gravityScale = 1.000000000000000;

      bodies[0] = this.m_world.CreateBody(bd);

      {
        /*box2d.b2FixtureDef*/
        const fd = new box2d.b2FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        /*box2d.b2EdgeShape*/
        const shape = new box2d.b2EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex2.Set(44.521739959716797, 0.000000000000000);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        shape.m_hasVertex0 = false;
        shape.m_hasVertex3 = false;

        fd.shape = shape;

        bodies[0].CreateFixture(fd);
      }
      {
        /*box2d.b2FixtureDef*/
        const fd = new box2d.b2FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        /*box2d.b2EdgeShape*/
        const shape = new box2d.b2EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(0.000000000000000, 16.695652008056641);
        shape.m_vertex2.Set(44.521739959716797, 16.695652008056641);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        shape.m_hasVertex0 = false;
        shape.m_hasVertex3 = false;

        fd.shape = shape;

        bodies[0].CreateFixture(fd);
      }
      {
        /*box2d.b2FixtureDef*/
        const fd = new box2d.b2FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        /*box2d.b2EdgeShape*/
        const shape = new box2d.b2EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(0.000000000000000, 16.695652008056641);
        shape.m_vertex2.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        shape.m_hasVertex0 = false;
        shape.m_hasVertex3 = false;

        fd.shape = shape;

        bodies[0].CreateFixture(fd);
      }
      {
        /*box2d.b2FixtureDef*/
        const fd = new box2d.b2FixtureDef();
        fd.friction = 10.000000000000000;
        fd.restitution = 0.000000000000000;
        fd.density = 0.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        /*box2d.b2EdgeShape*/
        const shape = new box2d.b2EdgeShape();
        shape.m_radius = 0.009999999776483;
        shape.m_vertex0.Set(0.000000000000000, 0.000000000000000);
        shape.m_vertex1.Set(44.521739959716797, 16.695652008056641);
        shape.m_vertex2.Set(44.521739959716797, 0.000000000000000);
        shape.m_vertex3.Set(0.000000000000000, 0.000000000000000);
        shape.m_hasVertex0 = false;
        shape.m_hasVertex3 = false;

        fd.shape = shape;

        bodies[0].CreateFixture(fd);
      }
    }
    {
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
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
      bd.active = true;
      bd.gravityScale = 1.000000000000000;

      bodies[1] = this.m_world.CreateBody(bd);

      {
        /*box2d.b2FixtureDef*/
        const fd = new box2d.b2FixtureDef();
        fd.friction = 1.000000000000000;
        fd.restitution = 0.500000000000000;
        fd.density = 10.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        /*box2d.b2PolygonShape*/
        const shape = new box2d.b2PolygonShape();
        /*box2d.b2Vec2[]*/
        const vs = box2d.b2Vec2.MakeArray(8);
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
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
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
      bd.active = true;
      bd.gravityScale = 1.000000000000000;

      bodies[2] = this.m_world.CreateBody(bd);

      {
        /*box2d.b2FixtureDef*/
        const fd = new box2d.b2FixtureDef();
        fd.friction = 1.000000000000000;
        fd.restitution = 0.500000000000000;
        fd.density = 10.000000000000000;
        fd.isSensor = false;
        fd.filter.categoryBits = 1;
        fd.filter.maskBits = 65535;
        fd.filter.groupIndex = 0;
        /*box2d.b2PolygonShape*/
        const shape = new box2d.b2PolygonShape();
        /*box2d.b2Vec2[]*/
        const vs = box2d.b2Vec2.MakeArray(8);
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
      /*box2d.b2BodyDef*/
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_staticBody;
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
      bd.active = true;
      bd.gravityScale = 1.000000000000000;

      bodies[3] = this.m_world.CreateBody(bd);

    }
    {
      /*box2d.b2RevoluteJointDef*/
      const jd = new box2d.b2RevoluteJointDef();
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
      /*box2d.b2PrismaticJointDef*/
      const jd = new box2d.b2PrismaticJointDef();
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
