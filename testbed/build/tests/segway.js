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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Segway, PIDController;
    var __moduleName = context_1 && context_1.id;
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
    function normalizeAngle(angle) {
        while (angle > b2.DegToRad(180)) {
            angle -= b2.DegToRad(360);
        }
        while (angle < b2.DegToRad(-180)) {
            angle += b2.DegToRad(360);
        }
        return angle;
    }
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            Segway = class Segway extends testbed.Test {
                constructor() {
                    super();
                    this.targetPosition = 10;
                    this.targetPositionInterval = 0;
                    this.posAvg = 0;
                    this.angleController = new PIDController();
                    this.positionController = new PIDController();
                    this.m_world.SetGravity({ x: 0, y: -30 });
                    this.angleController.gainP = 1000;
                    this.angleController.gainI = 0;
                    this.angleController.gainD = 250;
                    this.positionController.gainP = 0.5;
                    this.positionController.gainI = 0;
                    this.positionController.gainD = 1.5;
                    const bd = new b2.BodyDef();
                    const fd = new b2.FixtureDef();
                    // pendulumBody = new p2.Body({
                    //     mass: 1,
                    //     position: [0, 2 + 0.5 * PENDULUM_LENGTH]
                    // });
                    // pendulumBody.addShape(new p2.Box({ width: 1, height: PENDULUM_LENGTH }));
                    // world.addBody(pendulumBody);
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.x = 0;
                    bd.position.y = 2 + 0.5 * Segway.PENDULUM_LENGTH;
                    this.pendulumBody = this.m_world.CreateBody(bd);
                    const pendulumShape = new b2.PolygonShape();
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
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.x = 0;
                    bd.position.y = 1;
                    this.wheelBody = this.m_world.CreateBody(bd);
                    const wheelShape = new b2.CircleShape();
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
                    const jd = new b2.RevoluteJointDef();
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
                    bd.type = b2.BodyType.b2_staticBody;
                    bd.position.x = 0;
                    bd.position.y = 0;
                    this.groundBody = this.m_world.CreateBody(bd);
                    const groundShape = new b2.EdgeShape();
                    groundShape.SetTwoSided({ x: -100, y: 0 }, { x: 100, y: 0 });
                    fd.shape = groundShape;
                    fd.friction = 10;
                    this.groundBody.CreateFixture(fd);
                }
                Step(settings) {
                    let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
                    if (settings.m_pause && !settings.m_singleStep) {
                        dt = 0.0;
                    }
                    super.Step(settings);
                    this.targetPositionInterval += dt;
                    if (this.targetPositionInterval >= 8) {
                        this.targetPositionInterval = 0;
                        this.targetPosition = this.targetPosition === 10 ? -10 : 10;
                    }
                    let targetAngle = 0;
                    if (true) {
                        const alpha = 0.4;
                        // posAvg = (1 - alpha) * posAvg + alpha * pendulumBody.position[0];
                        this.posAvg = (1 - alpha) * this.posAvg + alpha * this.pendulumBody.GetPosition().x;
                        this.positionController.currentError = this.targetPosition - this.posAvg;
                        // positionController.step(world.lastTimeStep);
                        this.positionController.step(dt);
                        let targetLinAccel = this.positionController.output;
                        // targetLinAccel = clamp(targetLinAccel, -10.0, 10.0);
                        targetLinAccel = b2.Clamp(targetLinAccel, -10, 10);
                        // targetAngle = targetLinAccel / world.gravity[1];
                        targetAngle = targetLinAccel / this.m_world.GetGravity().y;
                        // targetAngle = clamp(targetAngle, -15 * DEGTORAD, 15 * DEGTORAD);
                        targetAngle = b2.Clamp(targetAngle, b2.DegToRad(-15), b2.DegToRad(15));
                    }
                    // var currentAngle = pendulumBody.angle;
                    let currentAngle = this.pendulumBody.GetAngle();
                    currentAngle = normalizeAngle(currentAngle);
                    this.angleController.currentError = targetAngle - currentAngle;
                    // angleController.step(world.lastTimeStep);
                    this.angleController.step(dt);
                    let targetSpeed = this.angleController.output;
                    // give up if speed required is really high
                    if (Math.abs(targetSpeed) > 1000) {
                        targetSpeed = 0;
                    }
                    // this is the only output
                    // var targetAngularVelocity = -targetSpeed / (2 * Math.PI * wheelBody.shapes[0].radius); // wheel circumference = 2*pi*r
                    const targetAngularVelocity = targetSpeed / (2 * Math.PI * 0.6); // wheel circumference = 2*pi*r
                    // wheelJoint.motorSpeed = targetAngularVelocity;
                    this.wheelJoint.SetMotorSpeed(targetAngularVelocity);
                }
                static Create() {
                    return new Segway();
                }
            };
            exports_1("Segway", Segway);
            Segway.PENDULUM_LENGTH = 10;
            /*
              Simple PID controller for single float variable
              http://en.wikipedia.org/wiki/PID_controller#Pseudocode
            */
            PIDController = class PIDController {
                constructor() {
                    this.gainP = 1;
                    this.gainI = 1;
                    this.gainD = 1;
                    this.currentError = 0;
                    this.previousError = 0;
                    this.integral = 0;
                    this.output = 0;
                }
                step(dt) {
                    this.integral = dt * (this.integral + this.currentError);
                    const derivative = (1 / dt) * (this.currentError - this.previousError);
                    this.output = this.gainP * this.currentError + this.gainI * this.integral + this.gainD * derivative;
                    this.previousError = this.currentError;
                }
            };
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vnd2F5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvc2Vnd2F5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQXFMRix3Q0FBd0M7SUFDeEMsd0NBQXdDO0lBQ3hDLDRCQUE0QjtJQUM1QiwwQkFBMEI7SUFDMUIsbUVBQW1FO0lBQ25FLDhCQUE4QjtJQUM5QixvREFBb0Q7SUFDcEQsSUFBSTtJQUNKLHFCQUFxQjtJQUNyQixrQkFBa0I7SUFDbEIsNkNBQTZDO0lBQzdDLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0IsK0JBQStCO0lBQy9CLGdEQUFnRDtJQUNoRCxrQ0FBa0M7SUFDbEMsZ0NBQWdDO0lBQ2hDLGtDQUFrQztJQUNsQyw2QkFBNkI7SUFDN0IsNkNBQTZDO0lBQzdDLGlDQUFpQztJQUNqQyw0QkFBNEI7SUFDNUIsVUFBVTtJQUNWLDRCQUE0QjtJQUM1QixrREFBa0Q7SUFDbEQsbUNBQW1DO0lBQ25DLG1CQUFtQjtJQUNuQixtREFBbUQ7SUFDbkQsVUFBVTtJQUNWLGdGQUFnRjtJQUNoRixtQ0FBbUM7SUFDbkMsZ0NBQWdDO0lBQ2hDLG1CQUFtQjtJQUNuQiwwQkFBMEI7SUFDMUIsVUFBVTtJQUNWLDBEQUEwRDtJQUMxRCxnQ0FBZ0M7SUFDaEMsNEVBQTRFO0lBQzVFLCtCQUErQjtJQUMvQixvREFBb0Q7SUFDcEQsa0NBQWtDO0lBQ2xDLFVBQVU7SUFDVix1Q0FBdUM7SUFDdkMsc0NBQXNDO0lBQ3RDLGtCQUFrQjtJQUNsQiw2Q0FBNkM7SUFDN0MsOENBQThDO0lBQzlDLHVCQUF1QjtJQUN2Qix3Q0FBd0M7SUFDeEMscUNBQXFDO0lBQ3JDLDBCQUEwQjtJQUMxQixVQUFVO0lBQ1Ysd0NBQXdDO0lBQ3hDLGlDQUFpQztJQUNqQyx1Q0FBdUM7SUFDdkMsK0JBQStCO0lBQy9CLHdCQUF3QjtJQUN4QiwrQkFBK0I7SUFDL0IsZ0ZBQWdGO0lBQ2hGLHlFQUF5RTtJ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