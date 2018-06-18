// #if B2_ENABLE_PARTICLE

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class EyeCandy extends testbed.Test {
  public m_mover: box2d.b2Body;
  public m_joint: box2d.b2RevoluteJoint;

  constructor() {
    super();

    this.m_particleSystem.SetDamping(0.2);
    this.m_particleSystem.SetRadius(0.3 * 2);
    this.m_particleSystem.SetGravityScale(0.4);
    this.m_particleSystem.SetDensity(1.2);

    const bdg = new box2d.b2BodyDef();
    const ground = this.m_world.CreateBody(bdg);

    const bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_staticBody; //box2d.b2BodyType.b2_dynamicBody;
    bd.allowSleep = false;
    bd.position.Set(0.0, 0.0);
    const body = this.m_world.CreateBody(bd);

    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(20.0, 0.0), 0.0);
    body.CreateFixture(shape, 5.0);
    shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(-20.0, 0.0), 0.0);
    body.CreateFixture(shape, 5.0);
    shape.SetAsBox(0.5, 20.0, new box2d.b2Vec2(0.0, 10.0), Math.PI / 2.0);
    body.CreateFixture(shape, 5.0);
    shape.SetAsBox(0.5, 20.0, new box2d.b2Vec2(0.0, -10.0), Math.PI / 2.0);
    body.CreateFixture(shape, 5.0);

    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position.Set(0.0, 0.0);
    this.m_mover = this.m_world.CreateBody(bd);
    shape.SetAsBox(1.0, 5.0, new box2d.b2Vec2(0.0, 2.0), 0.0);
    this.m_mover.CreateFixture(shape, 5.0);

    const jd = new box2d.b2RevoluteJointDef();
    jd.bodyA = ground;
    jd.bodyB = this.m_mover;
    jd.localAnchorA.Set(0.0, 0.0);
    jd.localAnchorB.Set(0.0, 5.0);
    jd.referenceAngle = 0.0;
    jd.motorSpeed = 0;
    jd.maxMotorTorque = 1e7;
    jd.enableMotor = true;
    this.m_joint = this.m_world.CreateJoint(jd);

    const pd = new box2d.b2ParticleGroupDef();
    pd.flags = box2d.b2ParticleFlag.b2_waterParticle;

    const shape2 = new box2d.b2PolygonShape();
    shape2.SetAsBox(9.0, 9.0, new box2d.b2Vec2(0.0, 0.0), 0.0);

    pd.shape = shape2;
    this.m_particleSystem.CreateParticleGroup(pd);
  }

  public Step(settings: testbed.Settings) {
    const time = new Date().getTime();
    this.m_joint.SetMotorSpeed(0.7 * Math.cos(time / 1000));

    super.Step(settings);
  }

  public static Create() {
    return new EyeCandy();
  }
}

// #endif
