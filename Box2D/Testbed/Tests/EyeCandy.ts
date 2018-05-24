// #if B2_ENABLE_PARTICLE

import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class EyeCandy extends testbed.Test {
  m_mover: box2d.b2Body;
  m_joint: box2d.b2RevoluteJoint;

  constructor() {
    super();

    this.m_particleSystem.SetDamping(0.2);
    this.m_particleSystem.SetRadius(0.3 * 2);
    this.m_particleSystem.SetGravityScale(0.4);
    this.m_particleSystem.SetDensity(1.2);

    var bdg = new box2d.b2BodyDef();
    var ground = this.m_world.CreateBody(bdg);

    var bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_staticBody; //box2d.b2BodyType.b2_dynamicBody;
    bd.allowSleep = false;
    bd.position.Set(0.0, 0.0);
    var body = this.m_world.CreateBody(bd);

    var shape = new box2d.b2PolygonShape();
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

    var jd = new box2d.b2RevoluteJointDef();
    jd.bodyA = ground;
    jd.bodyB = this.m_mover;
    jd.localAnchorA.Set(0.0, 0.0);
    jd.localAnchorB.Set(0.0, 5.0);
    jd.referenceAngle = 0.0;
    jd.motorSpeed = 0;
    jd.maxMotorTorque = 1e7;
    jd.enableMotor = true;
    this.m_joint = this.m_world.CreateJoint(jd);

    var pd = new box2d.b2ParticleGroupDef();
    pd.flags = box2d.b2ParticleFlag.b2_waterParticle;

    var shape2 = new box2d.b2PolygonShape();
    shape2.SetAsBox(9.0, 9.0, new box2d.b2Vec2(0.0, 0.0), 0.0);

    pd.shape = shape2;
    this.m_particleSystem.CreateParticleGroup(pd);
  }

  Step(settings: testbed.Settings) {
    var time = new Date().getTime();
    this.m_joint.SetMotorSpeed(0.7 * Math.cos(time / 1000));

    super.Step(settings);
  }

  static Create() {
    return new EyeCandy();
  }
}

// #endif

// goog.provide('box2d.Testbed.EyeCandy');

// goog.require('box2d.Testbed.Test');

// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.EyeCandy = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   this.m_particleSystem.SetDamping(0.2);
//   this.m_particleSystem.SetRadius(0.3 * 2);
//   this.m_particleSystem.SetGravityScale(0.4);
//   this.m_particleSystem.SetDensity(1.2);

//   var bdg = new box2d.b2BodyDef();
//   var ground = this.m_world.CreateBody(bdg);

//   var bd = new box2d.b2BodyDef();
//   bd.type = box2d.b2BodyType.b2_staticBody; //box2d.b2BodyType.b2_dynamicBody;
//   bd.allowSleep = false;
//   bd.position.Set(0.0, 0.0);
//   var body = this.m_world.CreateBody(bd);

//   var shape = new box2d.b2PolygonShape();
//   shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(20.0, 0.0), 0.0);
//   body.CreateFixture(shape, 5.0);
//   shape.SetAsBox(0.5, 10.0, new box2d.b2Vec2(-20.0, 0.0), 0.0);
//   body.CreateFixture(shape, 5.0);
//   shape.SetAsBox(0.5, 20.0, new box2d.b2Vec2(0.0, 10.0), Math.PI / 2.0);
//   body.CreateFixture(shape, 5.0);
//   shape.SetAsBox(0.5, 20.0, new box2d.b2Vec2(0.0, -10.0), Math.PI / 2.0);
//   body.CreateFixture(shape, 5.0);

//   bd.type = box2d.b2BodyType.b2_dynamicBody;
//   bd.position.Set(0.0, 0.0);
//   this.m_mover = this.m_world.CreateBody(bd);
//   shape.SetAsBox(1.0, 5.0, new box2d.b2Vec2(0.0, 2.0), 0.0);
//   this.m_mover.CreateFixture(shape, 5.0);

//   var jd = new box2d.b2RevoluteJointDef();
//   jd.bodyA = ground;
//   jd.bodyB = this.m_mover;
//   jd.localAnchorA.Set(0.0, 0.0);
//   jd.localAnchorB.Set(0.0, 5.0);
//   jd.referenceAngle = 0.0;
//   jd.motorSpeed = 0;
//   jd.maxMotorTorque = 1e7;
//   jd.enableMotor = true;
//   this.m_joint = this.m_world.CreateJoint(jd);

//   var pd = new box2d.b2ParticleGroupDef();
//   pd.flags = box2d.b2ParticleFlag.b2_waterParticle;

//   var shape2 = new box2d.b2PolygonShape();
//   shape2.SetAsBox(9.0, 9.0, new box2d.b2Vec2(0.0, 0.0), 0.0);

//   pd.shape = shape2;
//   this.m_particleSystem.CreateParticleGroup(pd);
// }

// goog.inherits(box2d.Testbed.EyeCandy, box2d.Testbed.Test);

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Joint} joint
//  */
// box2d.Testbed.EyeCandy.prototype.JointDestroyed = function(joint) {
//   box2d.Testbed.Test.prototype.JointDestroyed.call(this, joint);
// }

// //#if B2_ENABLE_PARTICLE

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.EyeCandy.prototype.ParticleGroupDestroyed = function(group) {
//   box2d.Testbed.Test.prototype.ParticleGroupDestroyed.call(this, group);
// }

// //#endif

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.EyeCandy.prototype.BeginContact = function(contact) {
//   box2d.Testbed.Test.prototype.BeginContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.EyeCandy.prototype.EndContact = function(contact) {
//   box2d.Testbed.Test.prototype.EndContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2Manifold} oldManifold
//  */
// box2d.Testbed.EyeCandy.prototype.PreSolve = function(contact, oldManifold) {
//   box2d.Testbed.Test.prototype.PreSolve.call(this, contact, oldManifold);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2ContactImpulse} impulse
//  */
// box2d.Testbed.EyeCandy.prototype.PostSolve = function(contact, impulse) {
//   box2d.Testbed.Test.prototype.PostSolve.call(this, contact, impulse);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.EyeCandy.prototype.Keyboard = function(key) {
//   box2d.Testbed.Test.prototype.Keyboard.call(this, key);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.EyeCandy.prototype.KeyboardUp = function(key) {
//   box2d.Testbed.Test.prototype.KeyboardUp.call(this, key);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.EyeCandy.prototype.MouseDown = function(p) {
//   box2d.Testbed.Test.prototype.MouseDown.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.EyeCandy.prototype.MouseUp = function(p) {
//   box2d.Testbed.Test.prototype.MouseUp.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.EyeCandy.prototype.MouseMove = function(p) {
//   box2d.Testbed.Test.prototype.MouseMove.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.EyeCandy.prototype.Step = function(settings) {
//   var time = new Date().getTime();
//   this.m_joint.SetMotorSpeed(0.7 * Math.cos(time / 1000));

//   box2d.Testbed.Test.prototype.Step.call(this, settings);
// }

// /**
//  * @export
//  * @return {number}
//  */
// box2d.Testbed.EyeCandy.prototype.GetDefaultViewZoom = function() {
//   return box2d.Testbed.Test.prototype.GetDefaultViewZoom.call(this);
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.EyeCandy.Create = function(canvas, settings) {
//   return new box2d.Testbed.EyeCandy(canvas, settings);
// }
