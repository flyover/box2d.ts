/*
 * Author: Chris Campbell - www.iforce2d.net
 *
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

import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class TopdownCar extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new TopdownCar();
  }
}

// goog.provide('box2d.Testbed.TopdownCar');

// goog.require('box2d.Testbed.Test');
// goog.require('box2d.Testbed.DestructionListener');

// /**
//  * @const
//  * @type {number}
//  */
// var DEGTORAD = 0.0174532925199432957;
// /**
//  * @const
//  * @type {number}
//  */
// var RADTODEG = 57.295779513082320876;

// var TDC_LEFT = 0x1;
// var TDC_RIGHT = 0x2;
// var TDC_UP = 0x4;
// var TDC_DOWN = 0x8;




// /**
//  * types of fixture user data
//  */
// var FUD_CAR_TIRE = 0;
// var FUD_GROUND_AREA = 1;

// /**
//  * a class to allow subclassing of different fixture user data
//  * @constructor
//  * @param {number} type
//  */
// var FixtureUserData = function(type) {
//   this.m_type = type;
// }

// /**
//  * @return {number}
//  */
// FixtureUserData.prototype.getType = function() {
//   return this.m_type;
// }

// /**
//  * class to allow marking a fixture as a car tire
//  * @constructor
//  * @extends {FixtureUserData}
//  */
// var CarTireFUD = function() {
//   FixtureUserData.call(this, FUD_CAR_TIRE);
// }

// goog.inherits(CarTireFUD, FixtureUserData);

// /**
//  * class to allow marking a fixture as a ground area
//  * @constructor
//  * @extends {FixtureUserData}
//  * @param {number} fm
//  * @param {boolean} ooc
//  */
// var GroundAreaFUD = function(fm, ooc) {
//   FixtureUserData.call(this, FUD_GROUND_AREA);
//   this.frictionModifier = fm;
//   this.outOfCourse = ooc;
// }

// goog.inherits(GroundAreaFUD, FixtureUserData);





// /**
//  * @constructor
//  * @param {box2d.b2World} world
//  */
// var TDTire = function(world) {
//   this.m_groundAreas = [];

//   var bodyDef = new box2d.b2BodyDef();
//   bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
//   this.m_body = world.CreateBody(bodyDef);

//   var polygonShape = new box2d.b2PolygonShape();
//   polygonShape.SetAsBox(0.5, 1.25);
//   var fixture = this.m_body.CreateFixture(polygonShape, 1); //shape, density
//   fixture.SetUserData(new CarTireFUD());

//   this.m_body.SetUserData(this);

//   this.m_currentTraction = 1;
// }

// /**
//  * @return {void}
//  * @param {number} maxForwardSpeed
//  * @param {number} maxBackwardSpeed
//  * @param {number} maxDriveForce
//  * @param {number} maxLateralImpulse
//  */
// TDTire.prototype.setCharacteristics = function(maxForwardSpeed, maxBackwardSpeed, maxDriveForce, maxLateralImpulse) {
//   this.m_maxForwardSpeed = maxForwardSpeed;
//   this.m_maxBackwardSpeed = maxBackwardSpeed;
//   this.m_maxDriveForce = maxDriveForce;
//   this.m_maxLateralImpulse = maxLateralImpulse;
// }

// /**
//  * @return {void}
//  * @param {FixtureUserData} ga
//  */
// TDTire.prototype.addGroundArea = function(ga) {
//     this.m_groundAreas.push(ga);
//     this.updateTraction();
//   }
//   /**
//    * @return {void}
//    * @param {FixtureUserData} ga
//    */
// TDTire.prototype.removeGroundArea = function(ga) {
//   this.m_groundAreas.splice(this.m_groundAreas.indexOf(ga));
//   this.updateTraction();
// }

// /**
//  * @return {void}
//  */
// TDTire.prototype.updateTraction = function() {
//   if (this.m_groundAreas.length === 0)
//     this.m_currentTraction = 1;
//   else {
//     //find area with highest traction
//     this.m_currentTraction = 0;
//     this.m_groundAreas.forEach(function(ga) {
//       if (ga.frictionModifier > this.m_currentTraction)
//         this.m_currentTraction = ga.frictionModifier;
//     });
//   }
// }

// /**
//  * @return {box2d.b2Vec2}
//  */
// TDTire.prototype.getLateralVelocity = function() {
//   var currentRightNormal = this.m_body.GetWorldVector(new box2d.b2Vec2(1, 0), new box2d.b2Vec2());
//   return currentRightNormal.SelfMul(box2d.b2Dot_V2_V2(currentRightNormal, this.m_body.GetLinearVelocity()));
// }

// /**
//  * @return {box2d.b2Vec2}
//  */
// TDTire.prototype.getForwardVelocity = function() {
//   var currentForwardNormal = this.m_body.GetWorldVector(new box2d.b2Vec2(0, 1), new box2d.b2Vec2());
//   return currentForwardNormal.SelfMul(box2d.b2Dot_V2_V2(currentForwardNormal, this.m_body.GetLinearVelocity()));
// }

// /**
//  * @return {void}
//  */
// TDTire.prototype.updateFriction = function() {
//   //lateral linear velocity
//   var impulse = this.getLateralVelocity().SelfMul(-1.0 * this.m_body.GetMass());
//   if (impulse.Length() > this.m_maxLateralImpulse)
//     impulse.SelfMul(this.m_maxLateralImpulse / impulse.Length());
//   this.m_body.ApplyLinearImpulse(impulse.SelfMul(this.m_currentTraction), this.m_body.GetWorldCenter());

//   //angular velocity
//   this.m_body.ApplyAngularImpulse(this.m_currentTraction * 0.1 * this.m_body.GetInertia() * -this.m_body.GetAngularVelocity());

//   //forward linear velocity
//   var currentForwardNormal = this.getForwardVelocity();
//   var currentForwardSpeed = currentForwardNormal.Normalize();
//   var dragForceMagnitude = -2 * currentForwardSpeed;
//   this.m_body.ApplyForce(currentForwardNormal.SelfMul(this.m_currentTraction * dragForceMagnitude), this.m_body.GetWorldCenter());
// }

// /**
//  * @return {void}
//  * @param {number} controlState
//  */
// TDTire.prototype.updateDrive = function(controlState) {

//   //find desired speed
//   var desiredSpeed = 0;
//   switch (controlState & (TDC_UP | TDC_DOWN)) {
//     case TDC_UP:
//       desiredSpeed = this.m_maxForwardSpeed;
//       break;
//     case TDC_DOWN:
//       desiredSpeed = this.m_maxBackwardSpeed;
//       break;
//     default:
//       return; //do nothing
//   }

//   //find current speed in forward direction
//   var currentForwardNormal = this.m_body.GetWorldVector(new box2d.b2Vec2(0, 1), new box2d.b2Vec2());
//   var currentSpeed = box2d.b2Dot_V2_V2(this.getForwardVelocity(), currentForwardNormal);

//   //apply necessary force
//   var force = 0;
//   if (desiredSpeed > currentSpeed)
//     force = this.m_maxDriveForce;
//   else if (desiredSpeed < currentSpeed)
//     force = -this.m_maxDriveForce;
//   else
//     return;
//   this.m_body.ApplyForce(currentForwardNormal.SelfMul(this.m_currentTraction * force), this.m_body.GetWorldCenter());
// }

// /**
//  * @return {void}
//  * @param {number} controlState
//  */
// TDTire.prototype.updateTurn = function(controlState) {
//   var desiredTorque = 0;
//   switch (controlState & (TDC_LEFT | TDC_RIGHT)) {
//     case TDC_LEFT:
//       desiredTorque = 15;
//       break;
//     case TDC_RIGHT:
//       desiredTorque = -15;
//       break;
//     default:
//       //nothing
//   }
//   this.m_body.ApplyTorque(desiredTorque);
// }


// /**
//  * @constructor
//  * @param {box2d.b2World} world
//  */
// var TDCar = function(world) {
//   this.m_tires = [];

//   //create car body
//   var bodyDef = new box2d.b2BodyDef();
//   bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
//   this.m_body = world.CreateBody(bodyDef);
//   this.m_body.SetAngularDamping(3);

//   var vertices = [];
//   vertices[0] = new box2d.b2Vec2(1.5, 0);
//   vertices[1] = new box2d.b2Vec2(3, 2.5);
//   vertices[2] = new box2d.b2Vec2(2.8, 5.5);
//   vertices[3] = new box2d.b2Vec2(1, 10);
//   vertices[4] = new box2d.b2Vec2(-1, 10);
//   vertices[5] = new box2d.b2Vec2(-2.8, 5.5);
//   vertices[6] = new box2d.b2Vec2(-3, 2.5);
//   vertices[7] = new box2d.b2Vec2(-1.5, 0);
//   var polygonShape = new box2d.b2PolygonShape();
//   polygonShape.Set(vertices, 8);
//   var fixture = this.m_body.CreateFixture(polygonShape, 0.1); //shape, density

//   //prepare common joint parameters
//   var jointDef = new box2d.b2RevoluteJointDef();
//   jointDef.bodyA = this.m_body;
//   jointDef.enableLimit = true;
//   jointDef.lowerAngle = 0;
//   jointDef.upperAngle = 0;
//   jointDef.localAnchorB.SetZero(); //center of tire

//   var maxForwardSpeed = 250;
//   var maxBackwardSpeed = -40;
//   var backTireMaxDriveForce = 300;
//   var frontTireMaxDriveForce = 500;
//   var backTireMaxLateralImpulse = 8.5;
//   var frontTireMaxLateralImpulse = 7.5;

//   //back left tire
//   var tire = new TDTire(world);
//   tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, backTireMaxDriveForce, backTireMaxLateralImpulse);
//   jointDef.bodyB = tire.m_body;
//   jointDef.localAnchorA.Set(-3, 0.75);
//   world.CreateJoint(jointDef);
//   this.m_tires.push(tire);

//   //back right tire
//   tire = new TDTire(world);
//   tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, backTireMaxDriveForce, backTireMaxLateralImpulse);
//   jointDef.bodyB = tire.m_body;
//   jointDef.localAnchorA.Set(3, 0.75);
//   world.CreateJoint(jointDef);
//   this.m_tires.push(tire);

//   //front left tire
//   tire = new TDTire(world);
//   tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
//   jointDef.bodyB = tire.m_body;
//   jointDef.localAnchorA.Set(-3, 8.5);
//   this.flJoint = world.CreateJoint(jointDef);
//   this.m_tires.push(tire);

//   //front right tire
//   tire = new TDTire(world);
//   tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
//   jointDef.bodyB = tire.m_body;
//   jointDef.localAnchorA.Set(3, 8.5);
//   this.frJoint = world.CreateJoint(jointDef);
//   this.m_tires.push(tire);
// }

// TDCar.prototype.update = function(controlState) {
//   this.m_tires.forEach(function(tire) {
//     tire.updateFriction()
//   });
//   this.m_tires.forEach(function(tire) {
//     tire.updateDrive(controlState)
//   });

//   //control steering
//   var lockAngle = 35 * DEGTORAD;
//   var turnSpeedPerSec = 160 * DEGTORAD; //from lock to lock in 0.5 sec
//   var turnPerTimeStep = turnSpeedPerSec / 60.0;
//   var desiredAngle = 0;
//   switch (controlState & (TDC_LEFT | TDC_RIGHT)) {
//     case TDC_LEFT:
//       desiredAngle = lockAngle;
//       break;
//     case TDC_RIGHT:
//       desiredAngle = -lockAngle;
//       break;
//     default:
//       //nothing
//   }
//   var angleNow = this.flJoint.GetJointAngle();
//   var angleToTurn = desiredAngle - angleNow;
//   angleToTurn = box2d.b2Clamp(angleToTurn, -turnPerTimeStep, turnPerTimeStep);
//   var newAngle = angleNow + angleToTurn;
//   this.flJoint.SetLimits(newAngle, newAngle);
//   this.frJoint.SetLimits(newAngle, newAngle);
// }




// /**
//  * @constructor
//  * @extends {box2d.Testbed.DestructionListener}
//  * @param {box2d.Testbed.Test} test
//  */
// var MyDestructionListener = function(test) {
//   box2d.Testbed.DestructionListener.call(this, test);
// }

// goog.inherits(MyDestructionListener, box2d.Testbed.DestructionListener);

// /**
//  * @return {void}
//  * @param {box2d.b2Fixture} fixture
//  */
// MyDestructionListener.prototype.SayGoodbyeFixture = function(fixture) {
//   ///  if ( FixtureUserData* fud = (FixtureUserData*)fixture.GetUserData() )
//   ///    delete fud;
//   box2d.Testbed.DestructionListener.prototype.SayGoodbyeFixture.call(this, fixture);
// }

// /**
//  * (unused but must implement all pure virtual functions)
//  * @return {void}
//  * @param {box2d.b2Joint} joint
//  */
// MyDestructionListener.prototype.SayGoodbyeJoint = function(joint) {
//   box2d.Testbed.DestructionListener.prototype.SayGoodbyeJoint.call(this, joint);
// }






// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.TopdownCar = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   //this.m_destructionListener = new MyDestructionListener(this);

//   this.m_world.SetGravity(new box2d.b2Vec2(0.0, 0.0));
//   this.m_world.SetDestructionListener(this.m_destructionListener);

//   //set up ground areas
//   {
//     var bodyDef = new box2d.b2BodyDef();
//     this.m_groundBody = this.m_world.CreateBody(bodyDef);

//     var polygonShape = new box2d.b2PolygonShape();
//     var fixtureDef = new box2d.b2FixtureDef();
//     fixtureDef.shape = polygonShape;
//     fixtureDef.isSensor = true;

//     polygonShape.SetAsBox(9, 7, new box2d.b2Vec2(-10, 15), 20 * DEGTORAD);
//     var groundAreaFixture = this.m_groundBody.CreateFixture(fixtureDef);
//     groundAreaFixture.SetUserData(new GroundAreaFUD(0.5, false));

//     polygonShape.SetAsBox(9, 5, new box2d.b2Vec2(5, 20), -40 * DEGTORAD);
//     groundAreaFixture = this.m_groundBody.CreateFixture(fixtureDef);
//     groundAreaFixture.SetUserData(new GroundAreaFUD(0.2, false));
//   }

//   //this.m_tire = new TDTire(this.m_world);
//   //this.m_tire.setCharacteristics(100, -20, 150);

//   this.m_car = new TDCar(this.m_world);

//   this.m_controlState = 0;
// }

// goog.inherits(box2d.Testbed.TopdownCar, box2d.Testbed.Test);

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.TopdownCar.prototype.Keyboard = function(key) {
//   switch (key) {
//     case goog.events.KeyCodes.A:
//       this.m_controlState |= TDC_LEFT;
//       break;
//     case goog.events.KeyCodes.D:
//       this.m_controlState |= TDC_RIGHT;
//       break;
//     case goog.events.KeyCodes.W:
//       this.m_controlState |= TDC_UP;
//       break;
//     case goog.events.KeyCodes.S:
//       this.m_controlState |= TDC_DOWN;
//       break;
//     default:
//       box2d.Testbed.Test.prototype.Keyboard.call(this, key);
//   }
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.TopdownCar.prototype.KeyboardUp = function(key) {
//   switch (key) {
//     case goog.events.KeyCodes.A:
//       this.m_controlState &= ~TDC_LEFT;
//       break;
//     case goog.events.KeyCodes.D:
//       this.m_controlState &= ~TDC_RIGHT;
//       break;
//     case goog.events.KeyCodes.W:
//       this.m_controlState &= ~TDC_UP;
//       break;
//     case goog.events.KeyCodes.S:
//       this.m_controlState &= ~TDC_DOWN;
//       break;
//     default:
//       box2d.Testbed.Test.prototype.KeyboardUp.call(this, key);
//   }
// }

// /**
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {boolean} began
//  */
// box2d.Testbed.TopdownCar.handleContact = function(contact, began) {
//   var a = contact.GetFixtureA();
//   var b = contact.GetFixtureB();
//   var fudA = a.GetUserData();
//   var fudB = b.GetUserData();

//   if (!fudA || !fudB)
//     return;

//   if (fudA.getType() == FUD_CAR_TIRE || fudB.getType() == FUD_GROUND_AREA)
//     box2d.Testbed.TopdownCar.tire_vs_groundArea(a, b, began);
//   else if (fudA.getType() == FUD_GROUND_AREA || fudB.getType() == FUD_CAR_TIRE)
//     box2d.Testbed.TopdownCar.tire_vs_groundArea(b, a, began);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.TopdownCar.prototype.BeginContact = function(contact) {
//   box2d.Testbed.TopdownCar.handleContact(contact, true);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.TopdownCar.prototype.EndContact = function(contact) {
//   box2d.Testbed.TopdownCar.handleContact(contact, false);
// }

// /**
//  * @return {void}
//  * @param {box2d.b2Fixture} tireFixture
//  * @param {box2d.b2Fixture} groundAreaFixture
//  * @param {boolean} began
//  */
// box2d.Testbed.TopdownCar.tire_vs_groundArea = function(tireFixture, groundAreaFixture, began) {
//   var tire = tireFixture.GetBody().GetUserData();
//   var gaFud = groundAreaFixture.GetUserData();
//   if (began)
//     tire.addGroundArea(gaFud);
//   else
//     tire.removeGroundArea(gaFud);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.TopdownCar.prototype.Step = function(settings) {
//   /*this.m_tire.updateFriction();
//   this.m_tire.updateDrive(this.m_controlState);
//   this.m_tire.updateTurn(this.m_controlState);*/

//   this.m_car.update(this.m_controlState);

//   box2d.Testbed.Test.prototype.Step.call(this, settings);

//   //show some useful info
//   this.m_debugDraw.DrawString(5, this.m_textLine, "Press w/a/s/d to control the car");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;

//   //this.m_debugDraw.DrawString(5, this.m_textLine, "Tire traction: %.2f", this.m_tire.m_currentTraction);
//   //this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
// }


// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.TopdownCar.Create = function(canvas, settings) {
//   return new box2d.Testbed.TopdownCar(canvas, settings);
// }
