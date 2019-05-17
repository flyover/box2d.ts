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

export class Segway extends testbed.Test {
  public static PENDULUM_LENGTH: number = 10;

  public targetPosition: number = 10;
  public targetPositionInterval: number = 0;
  public posAvg: number = 0;
  public readonly angleController: PIDController = new PIDController();
  public readonly positionController: PIDController = new PIDController();
  public pendulumBody: box2d.b2Body;
  public wheelBody: box2d.b2Body;
  public groundBody: box2d.b2Body;
  public wheelJoint: box2d.b2RevoluteJoint;

  constructor() {
    super();

    this.m_world.SetGravity({ x: 0, y: -30 });

    this.angleController.gainP = 1000;
    this.angleController.gainI = 0;
    this.angleController.gainD = 250;

    this.positionController.gainP = 0.5;
    this.positionController.gainI = 0;
    this.positionController.gainD = 1.5;

    const bd: box2d.b2BodyDef = new box2d.b2BodyDef();
    const fd: box2d.b2FixtureDef = new box2d.b2FixtureDef();

    // pendulumBody = new p2.Body({
    //     mass: 1,
    //     position: [0, 2 + 0.5 * PENDULUM_LENGTH]
    // });
    // pendulumBody.addShape(new p2.Box({ width: 1, height: PENDULUM_LENGTH }));
    // world.addBody(pendulumBody);
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position.x = 0;
    bd.position.y = 2 + 0.5 * Segway.PENDULUM_LENGTH;
    this.pendulumBody = this.m_world.CreateBody(bd);
    const pendulumShape: box2d.b2PolygonShape = new box2d.b2PolygonShape();
    pendulumShape.SetAsBox(0.5, 0.5 * Segway.PENDULUM_LENGTH);
    fd.shape = pendulumShape;
    fd.density = 1 / (1 * Segway.PENDULUM_LENGTH); // TODO: specify mass
    // fd.mass = 1;
    this.pendulumBody.CreateFixture(fd);

    // wheelBody = new p2.Body({
    //     mass: 1,
    //     position: [0,1]
    // });
    // wheelBody.addShape(new p2.Circle({ radius: 0.6 }));
    // world.addBody(wheelBody);
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    bd.position.x = 0;
    bd.position.y = 1;
    this.wheelBody = this.m_world.CreateBody(bd);
    const wheelShape: box2d.b2CircleShape = new box2d.b2CircleShape();
    wheelShape.m_radius = 0.6;
    fd.shape = wheelShape;
    fd.density = 1 / (Math.PI * 0.6 * 0.6); // TODO: specify mass
    // fd.mass = 1;
    fd.friction = 10;
    this.wheelBody.CreateFixture(fd);

    // var wheelJoint = new p2.RevoluteConstraint(wheelBody, pendulumBody, {
    //     localPivotA: [0, 0],
    //     localPivotB: [0, -0.5 * PENDULUM_LENGTH],
    //     collideConnected: false
    // });
    // world.addConstraint(wheelJoint);
    // wheelJoint.motorEnabled = true;
    // var m = 40;
    // wheelJoint.motorEquation.maxForce = m;
    // wheelJoint.motorEquation.minForce = -m;
    const jd: box2d.b2RevoluteJointDef = new box2d.b2RevoluteJointDef();
    jd.Initialize(this.wheelBody, this.pendulumBody, { x: 0, y: 0 });
    jd.localAnchorA.Set(0, 0);
    jd.localAnchorB.Set(0, -0.5 * Segway.PENDULUM_LENGTH);
    jd.collideConnected = false;
    jd.enableMotor = true;
    jd.maxMotorTorque = 40;
    this.wheelJoint = this.m_world.CreateJoint(jd);

    // Create ground
    // var groundShape = new p2.Plane();
    // var groundBody = new p2.Body({
    //     position:[0,0],
    // });
    // groundBody.addShape(groundShape);
    // world.addBody(groundBody);
    bd.type = box2d.b2BodyType.b2_staticBody;
    bd.position.x = 0;
    bd.position.y = 0;
    this.groundBody = this.m_world.CreateBody(bd);
    const groundShape: box2d.b2EdgeShape = new box2d.b2EdgeShape();
    groundShape.Set({ x: -100, y: 0 }, { x: 100, y: 0 });
    fd.shape = groundShape;
    fd.friction = 10;
    this.groundBody.CreateFixture(fd);
  }

  public Step(settings: testbed.Settings): void {
    let dt: number = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;

    if (settings.pause && !settings.singleStep) {
      dt = 0.0;
    }

    super.Step(settings);

    this.targetPositionInterval += dt;
    if (this.targetPositionInterval >= 8) {
      this.targetPositionInterval = 0;
      this.targetPosition = this.targetPosition === 10 ? -10 : 10;
    }

    let targetAngle: number = 0;
    if ( true ) {
      const alpha: number = 0.4;
      // posAvg = (1 - alpha) * posAvg + alpha * pendulumBody.position[0];
      this.posAvg = (1 - alpha) * this.posAvg + alpha * this.pendulumBody.GetPosition().x;
      this.positionController.currentError = this.targetPosition - this.posAvg;
      // positionController.step(world.lastTimeStep);
      this.positionController.step(dt);
      let targetLinAccel: number = this.positionController.output;
      // targetLinAccel = clamp(targetLinAccel, -10.0, 10.0);
      targetLinAccel = box2d.b2Clamp(targetLinAccel, -10, 10);
      // targetAngle = targetLinAccel / world.gravity[1];
      targetAngle = targetLinAccel / this.m_world.GetGravity().y;
      // targetAngle = clamp(targetAngle, -15 * DEGTORAD, 15 * DEGTORAD);
      targetAngle = box2d.b2Clamp(targetAngle, box2d.b2DegToRad(-15), box2d.b2DegToRad(15));
    }
    // var currentAngle = pendulumBody.angle;
    let currentAngle: number = this.pendulumBody.GetAngle();
    currentAngle = normalizeAngle(currentAngle);
    this.angleController.currentError = targetAngle - currentAngle;
    // angleController.step(world.lastTimeStep);
    this.angleController.step(dt);
    let targetSpeed: number = this.angleController.output;
    // give up if speed required is really high
    if ( Math.abs(targetSpeed) > 1000 ) {
      targetSpeed = 0;
    }
    // this is the only output
    // var targetAngularVelocity = -targetSpeed / (2 * Math.PI * wheelBody.shapes[0].radius); // wheel circumference = 2*pi*r
    const targetAngularVelocity: number = targetSpeed / (2 * Math.PI * 0.6); // wheel circumference = 2*pi*r
    // wheelJoint.motorSpeed = targetAngularVelocity;
    this.wheelJoint.SetMotorSpeed(targetAngularVelocity);
  }

  public static Create(): testbed.Test {
    return new Segway();
  }
}

/*
  Simple PID controller for single float variable
  http://en.wikipedia.org/wiki/PID_controller#Pseudocode
*/
class PIDController {
  public gainP: number = 1;
  public gainI: number = 1;
  public gainD: number = 1;
  public currentError: number = 0;
  public previousError: number = 0;
  public integral: number = 0;
  public output: number = 0;

  public step(dt: number): void {
    this.integral = dt * (this.integral + this.currentError);
    const derivative: number = (1 / dt) * (this.currentError - this.previousError);
    this.output = this.gainP * this.currentError + this.gainI * this.integral + this.gainD * derivative;
    this.previousError = this.currentError;
  }
}

// var DEGTORAD = 0.0174532925199432957;
// var RADTODEG = 57.295779513082320876;
// var PENDULUM_LENGTH = 10;
// var targetPosition = 0;
// var targetPositionInterval = setInterval(changeTargetPos, 8000);
// function changeTargetPos(){
//     targetPosition = targetPosition===0 ? 10 : 0;
// }
// changeTargetPos();
// var posAvg = 0;
// var angleController = new PIDController();
// angleController.gainP = 1000;
// angleController.gainI = 0;
// angleController.gainD = 250;
// var positionController = new PIDController();
// positionController.gainP = 0.5;
// positionController.gainI = 0;
// positionController.gainD = 1.5;
// // Create demo application
// var app = new p2.WebGLRenderer(function(){
//     var world = new p2.World({
//         gravity : [0,-30]
//     });
//     this.setWorld(world);
//     world.defaultContactMaterial.friction = 10;
//     pendulumBody = new p2.Body({
//         mass: 1,
//         position: [0, 2 + 0.5 * PENDULUM_LENGTH]
//     });
//     pendulumBody.addShape(new p2.Box({ width: 1, height: PENDULUM_LENGTH }));
//     world.addBody(pendulumBody);
//     wheelBody = new p2.Body({
//         mass: 1,
//         position: [0,1]
//     });
//     wheelBody.addShape(new p2.Circle({ radius: 0.6 }));
//     world.addBody(wheelBody);
//     var wheelJoint = new p2.RevoluteConstraint(wheelBody, pendulumBody, {
//         localPivotA: [0, 0],
//         localPivotB: [0, -0.5 * PENDULUM_LENGTH],
//         collideConnected: false
//     });
//     world.addConstraint(wheelJoint);
//     wheelJoint.motorEnabled = true;
//     var m = 40;
//     wheelJoint.motorEquation.maxForce = m;
//     wheelJoint.motorEquation.minForce = -m;
//     // Create ground
//     var groundShape = new p2.Plane();
//     var groundBody = new p2.Body({
//         position:[0,0],
//     });
//     groundBody.addShape(groundShape);
//     world.addBody(groundBody);
//     world.on('postStep', function(){
//         var targetAngle = 0;
//         if ( true ) {
//             var alpha = 0.4;
//             posAvg = (1 - alpha) * posAvg + alpha * pendulumBody.position[0];
//             positionController.currentError = targetPosition - posAvg;
//             positionController.step(world.lastTimeStep);
//             var targetLinAccel = positionController.output;
//             targetLinAccel = clamp(targetLinAccel, -10.0, 10.0);
//             targetAngle = targetLinAccel / world.gravity[1];
//             targetAngle = clamp(targetAngle, -15 * DEGTORAD, 15 * DEGTORAD);
//         }
//         var currentAngle = pendulumBody.angle;
//         currentAngle = normalizeAngle(currentAngle);
//         angleController.currentError = ( targetAngle - currentAngle );
//         angleController.step(world.lastTimeStep);
//         var targetSpeed = angleController.output;
//         // give up if speed required is really high
//         if ( Math.abs(targetSpeed) > 1000 )
//             targetSpeed = 0;
//         // this is the only output
//         var targetAngularVelocity = -targetSpeed / (2 * Math.PI * wheelBody.shapes[0].radius); // wheel circumference = 2*pi*r
//         wheelJoint.motorSpeed = targetAngularVelocity;
//     });
//     app.frame(3,5,16,16);
// });
// /*
//     Simple PID controller for single float variable
//     http://en.wikipedia.org/wiki/PID_controller#Pseudocode
// */
// function PIDController(){
//     this.gainP = 1;
//     this.gainI = 1;
//     this.gainD = 1;
//     this.currentError = 0;
//     this.previousError = 0;
//     this.integral = 0;
//     this.output = 0;
// }
// PIDController.prototype.step = function(dt) {
//     this.integral = dt * (this.integral + this.currentError);
//     var derivative = (1 / dt) * (this.currentError - this.previousError);
//     this.output = this.gainP * this.currentError + this.gainI * this.integral + this.gainD * derivative;
//     this.previousError = this.currentError;
// };
// function clamp(num, min, max) {
//     return Math.min(Math.max(num, min), max);
// };
function normalizeAngle(angle: number): number {
    while (angle > box2d.b2DegToRad( 180)) { angle -= box2d.b2DegToRad(360); }
    while (angle < box2d.b2DegToRad(-180)) { angle += box2d.b2DegToRad(360); }
    return angle;
}
