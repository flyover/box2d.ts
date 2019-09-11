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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, Segway, PIDController;
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
        while (angle > box2d.b2DegToRad(180)) {
            angle -= box2d.b2DegToRad(360);
        }
        while (angle < box2d.b2DegToRad(-180)) {
            angle += box2d.b2DegToRad(360);
        }
        return angle;
    }
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
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
                    const bd = new box2d.b2BodyDef();
                    const fd = new box2d.b2FixtureDef();
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
                    const pendulumShape = new box2d.b2PolygonShape();
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
                    const wheelShape = new box2d.b2CircleShape();
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
                    const jd = new box2d.b2RevoluteJointDef();
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
                    const groundShape = new box2d.b2EdgeShape();
                    groundShape.Set({ x: -100, y: 0 }, { x: 100, y: 0 });
                    fd.shape = groundShape;
                    fd.friction = 10;
                    this.groundBody.CreateFixture(fd);
                }
                Step(settings) {
                    let dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
                    if (settings.pause && !settings.singleStep) {
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
                        targetLinAccel = box2d.b2Clamp(targetLinAccel, -10, 10);
                        // targetAngle = targetLinAccel / world.gravity[1];
                        targetAngle = targetLinAccel / this.m_world.GetGravity().y;
                        // targetAngle = clamp(targetAngle, -15 * DEGTORAD, 15 * DEGTORAD);
                        targetAngle = box2d.b2Clamp(targetAngle, box2d.b2DegToRad(-15), box2d.b2DegToRad(15));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Vnd2F5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2Vnd2F5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQXFMRix3Q0FBd0M7SUFDeEMsd0NBQXdDO0lBQ3hDLDRCQUE0QjtJQUM1QiwwQkFBMEI7SUFDMUIsbUVBQW1FO0lBQ25FLDhCQUE4QjtJQUM5QixvREFBb0Q7SUFDcEQsSUFBSTtJQUNKLHFCQUFxQjtJQUNyQixrQkFBa0I7SUFDbEIsNkNBQTZDO0lBQzdDLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0IsK0JBQStCO0lBQy9CLGdEQUFnRDtJQUNoRCxrQ0FBa0M7SUFDbEMsZ0NBQWdDO0lBQ2hDLGtDQUFrQztJQUNsQyw2QkFBNkI7SUFDN0IsNkNBQTZDO0lBQzdDLGlDQUFpQztJQUNqQyw0QkFBNEI7SUFDNUIsVUFBVTtJQUNWLDRCQUE0QjtJQUM1QixrREFBa0Q7SUFDbEQsbUNBQW1DO0lBQ25DLG1CQUFtQjtJQUNuQixtREFBbUQ7SUFDbkQsVUFBVTtJQUNWLGdGQUFnRjtJQUNoRixtQ0FBbUM7SUFDbkMsZ0NBQWdDO0lBQ2hDLG1CQUFtQjtJQUNuQiwwQkFBMEI7SUFDMUIsVUFBVTtJQUNWLDBEQUEwRDtJQUMxRCxnQ0FBZ0M7SUFDaEMsNEVBQTRFO0lBQzVFLCtCQUErQjtJQUMvQixvREFBb0Q7SUFDcEQsa0NBQWtDO0lBQ2xDLFVBQVU7SUFDVix1Q0FBdUM7SUFDdkMsc0NBQXNDO0lBQ3RDLGtCQUFrQjtJQUNsQiw2Q0FBNkM7SUFDN0MsOENBQThDO0lBQzlDLHVCQUF1QjtJQUN2Qix3Q0FBd0M7SUFDeEMscUNBQXFDO0lBQ3JDLDBCQUEwQjtJQUMxQixVQUFVO0lBQ1Ysd0NBQXdDO0lBQ3hDLGlDQUFpQztJQUNqQyx1Q0FBdUM7SUFDdkMsK0JBQStCO0lBQy9CLHdCQUF3QjtJQUN4QiwrQkFBK0I7SUFDL0IsZ0ZBQWdGO0lBQ2hGLHlFQUF5RTtJQUN6RSwyREFBMkQ7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