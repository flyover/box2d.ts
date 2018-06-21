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

// #if B2_ENABLE_PARTICLE

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class WaveMachine extends testbed.Test {
  public m_joint: box2d.b2RevoluteJoint;
  public m_time = 0;

  constructor() {
    super();

    let ground = null;
    {
      const bd = new box2d.b2BodyDef();
      ground = this.m_world.CreateBody(bd);
    }

    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.allowSleep = false;
      bd.position.Set(0.0, 1.0);
      const body = this.m_world.CreateBody(bd);

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.05, 1.0, new box2d.b2Vec2(2.0, 0.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(0.05, 1.0, new box2d.b2Vec2(-2.0, 0.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(2.0, 0.05, new box2d.b2Vec2(0.0, 1.0), 0.0);
      body.CreateFixture(shape, 5.0);
      shape.SetAsBox(2.0, 0.05, new box2d.b2Vec2(0.0, -1.0), 0.0);
      body.CreateFixture(shape, 5.0);

      const jd = new box2d.b2RevoluteJointDef();
      jd.bodyA = ground;
      jd.bodyB = body;
      jd.localAnchorA.Set(0.0, 1.0);
      jd.localAnchorB.Set(0.0, 0.0);
      jd.referenceAngle = 0.0;
      jd.motorSpeed = 0.05 * box2d.b2_pi;
      jd.maxMotorTorque = 1e7;
      jd.enableMotor = true;
      this.m_joint = this.m_world.CreateJoint(jd);
    }

    this.m_particleSystem.SetRadius(0.025 * 2); // HACK: increase particle radius
    const particleType = testbed.Test.GetParticleParameterValue();
    this.m_particleSystem.SetDamping(0.2);

    {
      const pd = new box2d.b2ParticleGroupDef();
      pd.flags = particleType;

      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(0.9, 0.9, new box2d.b2Vec2(0.0, 1.0), 0.0);

      pd.shape = shape;
      const group = this.m_particleSystem.CreateParticleGroup(pd);
      if (pd.flags & box2d.b2ParticleFlag.b2_colorMixingParticle) {
        this.ColorParticleGroup(group, 0);
      }
    }

    this.m_time = 0;
  }

  public Step(settings: testbed.Settings) {
    super.Step(settings);
    if (settings.hz > 0) {
      this.m_time += 1 / settings.hz;
    }
    this.m_joint.SetMotorSpeed(0.05 * Math.cos(this.m_time) * box2d.b2_pi);
  }

  public GetDefaultViewZoom() {
    return 0.1;
  }

  public static Create() {
    return new WaveMachine();
  }
}

// #endif
