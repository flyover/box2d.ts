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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, DEGTORAD, TDC_LEFT, TDC_RIGHT, TDC_UP, TDC_DOWN, FUD_CAR_TIRE, FUD_GROUND_AREA, FixtureUserData, CarTireFUD, GroundAreaFUD, TDTire, TDCar, MyDestructionListener, TopdownCar;
    var __moduleName = context_1 && context_1.id;
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
            DEGTORAD = 0.0174532925199432957;
            // const RADTODEG = 57.295779513082320876;
            TDC_LEFT = 0x1;
            TDC_RIGHT = 0x2;
            TDC_UP = 0x4;
            TDC_DOWN = 0x8;
            /**
             * types of fixture user data
             */
            FUD_CAR_TIRE = 0;
            FUD_GROUND_AREA = 1;
            /**
             * a class to allow subclassing of different fixture user data
             */
            FixtureUserData = class FixtureUserData {
                constructor(type) {
                    this.m_type = type;
                }
                getType() {
                    return this.m_type;
                }
            };
            exports_1("FixtureUserData", FixtureUserData);
            /**
             * class to allow marking a fixture as a car tire
             */
            CarTireFUD = class CarTireFUD extends FixtureUserData {
                constructor() {
                    super(FUD_CAR_TIRE);
                }
            };
            exports_1("CarTireFUD", CarTireFUD);
            // /**
            //  * class to allow marking a fixture as a ground area
            //  */
            GroundAreaFUD = class GroundAreaFUD extends FixtureUserData {
                constructor(fm, ooc) {
                    super(FUD_GROUND_AREA);
                    this.frictionModifier = fm;
                    this.outOfCourse = ooc;
                }
            };
            exports_1("GroundAreaFUD", GroundAreaFUD);
            TDTire = class TDTire {
                constructor(world) {
                    this.m_groundAreas = [];
                    this.m_currentTraction = 1;
                    this.m_maxForwardSpeed = 0;
                    this.m_maxBackwardSpeed = 0;
                    this.m_maxDriveForce = 0;
                    this.m_maxLateralImpulse = 0;
                    const bodyDef = new b2.BodyDef();
                    bodyDef.type = b2.BodyType.b2_dynamicBody;
                    this.m_body = world.CreateBody(bodyDef);
                    const polygonShape = new b2.PolygonShape();
                    polygonShape.SetAsBox(0.5, 1.25);
                    const fixture = this.m_body.CreateFixture(polygonShape, 1); //shape, density
                    fixture.SetUserData(new CarTireFUD());
                    this.m_body.SetUserData(this);
                }
                setCharacteristics(maxForwardSpeed, maxBackwardSpeed, maxDriveForce, maxLateralImpulse) {
                    this.m_maxForwardSpeed = maxForwardSpeed;
                    this.m_maxBackwardSpeed = maxBackwardSpeed;
                    this.m_maxDriveForce = maxDriveForce;
                    this.m_maxLateralImpulse = maxLateralImpulse;
                }
                addGroundArea(ga) {
                    this.m_groundAreas.push(ga);
                    this.updateTraction();
                }
                removeGroundArea(ga) {
                    this.m_groundAreas.splice(this.m_groundAreas.indexOf(ga));
                    this.updateTraction();
                }
                updateTraction() {
                    if (this.m_groundAreas.length === 0) {
                        this.m_currentTraction = 1;
                    }
                    else {
                        //find area with highest traction
                        this.m_currentTraction = 0;
                        this.m_groundAreas.forEach((ga) => {
                            if (ga.frictionModifier > this.m_currentTraction) {
                                this.m_currentTraction = ga.frictionModifier;
                            }
                        });
                    }
                }
                getLateralVelocity() {
                    const currentRightNormal = this.m_body.GetWorldVector(new b2.Vec2(1, 0), new b2.Vec2());
                    return currentRightNormal.SelfMul(b2.Vec2.DotVV(currentRightNormal, this.m_body.GetLinearVelocity()));
                }
                getForwardVelocity() {
                    const currentForwardNormal = this.m_body.GetWorldVector(new b2.Vec2(0, 1), new b2.Vec2());
                    return currentForwardNormal.SelfMul(b2.Vec2.DotVV(currentForwardNormal, this.m_body.GetLinearVelocity()));
                }
                updateFriction() {
                    //lateral linear velocity
                    const impulse = this.getLateralVelocity().SelfMul(-1.0 * this.m_body.GetMass());
                    if (impulse.Length() > this.m_maxLateralImpulse) {
                        impulse.SelfMul(this.m_maxLateralImpulse / impulse.Length());
                    }
                    this.m_body.ApplyLinearImpulse(impulse.SelfMul(this.m_currentTraction), this.m_body.GetWorldCenter());
                    //angular velocity
                    this.m_body.ApplyAngularImpulse(this.m_currentTraction * 0.1 * this.m_body.GetInertia() * -this.m_body.GetAngularVelocity());
                    //forward linear velocity
                    const currentForwardNormal = this.getForwardVelocity();
                    const currentForwardSpeed = currentForwardNormal.Normalize();
                    const dragForceMagnitude = -2 * currentForwardSpeed;
                    this.m_body.ApplyForce(currentForwardNormal.SelfMul(this.m_currentTraction * dragForceMagnitude), this.m_body.GetWorldCenter());
                }
                updateDrive(controlState) {
                    //find desired speed
                    let desiredSpeed = 0;
                    switch (controlState & (TDC_UP | TDC_DOWN)) {
                        case TDC_UP:
                            desiredSpeed = this.m_maxForwardSpeed;
                            break;
                        case TDC_DOWN:
                            desiredSpeed = this.m_maxBackwardSpeed;
                            break;
                        default:
                            return; //do nothing
                    }
                    //find current speed in forward direction
                    const currentForwardNormal = this.m_body.GetWorldVector(new b2.Vec2(0, 1), new b2.Vec2());
                    const currentSpeed = b2.Vec2.DotVV(this.getForwardVelocity(), currentForwardNormal);
                    //apply necessary force
                    let force = 0;
                    if (desiredSpeed > currentSpeed) {
                        force = this.m_maxDriveForce;
                    }
                    else if (desiredSpeed < currentSpeed) {
                        force = -this.m_maxDriveForce;
                    }
                    else {
                        return;
                    }
                    this.m_body.ApplyForce(currentForwardNormal.SelfMul(this.m_currentTraction * force), this.m_body.GetWorldCenter());
                }
                updateTurn(controlState) {
                    let desiredTorque = 0;
                    switch (controlState & (TDC_LEFT | TDC_RIGHT)) {
                        case TDC_LEFT:
                            desiredTorque = 15;
                            break;
                        case TDC_RIGHT:
                            desiredTorque = -15;
                            break;
                        default:
                        //nothing
                    }
                    this.m_body.ApplyTorque(desiredTorque);
                }
            };
            exports_1("TDTire", TDTire);
            TDCar = class TDCar {
                constructor(world) {
                    this.m_tires = [];
                    //create car body
                    const bodyDef = new b2.BodyDef();
                    bodyDef.type = b2.BodyType.b2_dynamicBody;
                    this.m_body = world.CreateBody(bodyDef);
                    this.m_body.SetAngularDamping(3);
                    const vertices = [];
                    vertices[0] = new b2.Vec2(1.5, 0);
                    vertices[1] = new b2.Vec2(3, 2.5);
                    vertices[2] = new b2.Vec2(2.8, 5.5);
                    vertices[3] = new b2.Vec2(1, 10);
                    vertices[4] = new b2.Vec2(-1, 10);
                    vertices[5] = new b2.Vec2(-2.8, 5.5);
                    vertices[6] = new b2.Vec2(-3, 2.5);
                    vertices[7] = new b2.Vec2(-1.5, 0);
                    const polygonShape = new b2.PolygonShape();
                    polygonShape.Set(vertices, 8);
                    this.m_body.CreateFixture(polygonShape, 0.1); //shape, density
                    //prepare common joint parameters
                    const jointDef = new b2.RevoluteJointDef();
                    jointDef.bodyA = this.m_body;
                    jointDef.enableLimit = true;
                    jointDef.lowerAngle = 0;
                    jointDef.upperAngle = 0;
                    jointDef.localAnchorB.SetZero(); //center of tire
                    const maxForwardSpeed = 250;
                    const maxBackwardSpeed = -40;
                    const backTireMaxDriveForce = 300;
                    const frontTireMaxDriveForce = 500;
                    const backTireMaxLateralImpulse = 8.5;
                    const frontTireMaxLateralImpulse = 7.5;
                    //back left tire
                    let tire = new TDTire(world);
                    tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, backTireMaxDriveForce, backTireMaxLateralImpulse);
                    jointDef.bodyB = tire.m_body;
                    jointDef.localAnchorA.Set(-3, 0.75);
                    world.CreateJoint(jointDef);
                    this.m_tires.push(tire);
                    //back right tire
                    tire = new TDTire(world);
                    tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, backTireMaxDriveForce, backTireMaxLateralImpulse);
                    jointDef.bodyB = tire.m_body;
                    jointDef.localAnchorA.Set(3, 0.75);
                    world.CreateJoint(jointDef);
                    this.m_tires.push(tire);
                    //front left tire
                    tire = new TDTire(world);
                    tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
                    jointDef.bodyB = tire.m_body;
                    jointDef.localAnchorA.Set(-3, 8.5);
                    this.flJoint = world.CreateJoint(jointDef);
                    this.m_tires.push(tire);
                    //front right tire
                    tire = new TDTire(world);
                    tire.setCharacteristics(maxForwardSpeed, maxBackwardSpeed, frontTireMaxDriveForce, frontTireMaxLateralImpulse);
                    jointDef.bodyB = tire.m_body;
                    jointDef.localAnchorA.Set(3, 8.5);
                    this.frJoint = world.CreateJoint(jointDef);
                    this.m_tires.push(tire);
                }
                update(controlState) {
                    this.m_tires.forEach((tire) => {
                        tire.updateFriction();
                    });
                    this.m_tires.forEach((tire) => {
                        tire.updateDrive(controlState);
                    });
                    //control steering
                    const lockAngle = 35 * DEGTORAD;
                    const turnSpeedPerSec = 160 * DEGTORAD; //from lock to lock in 0.5 sec
                    const turnPerTimeStep = turnSpeedPerSec / 60.0;
                    let desiredAngle = 0;
                    switch (controlState & (TDC_LEFT | TDC_RIGHT)) {
                        case TDC_LEFT:
                            desiredAngle = lockAngle;
                            break;
                        case TDC_RIGHT:
                            desiredAngle = -lockAngle;
                            break;
                        default:
                        //nothing
                    }
                    const angleNow = this.flJoint.GetJointAngle();
                    let angleToTurn = desiredAngle - angleNow;
                    angleToTurn = b2.Clamp(angleToTurn, -turnPerTimeStep, turnPerTimeStep);
                    const newAngle = angleNow + angleToTurn;
                    this.flJoint.SetLimits(newAngle, newAngle);
                    this.frJoint.SetLimits(newAngle, newAngle);
                }
            };
            exports_1("TDCar", TDCar);
            MyDestructionListener = class MyDestructionListener extends testbed.DestructionListener {
                SayGoodbyeFixture(fixture) {
                    ///  if ( FixtureUserData* fud = (FixtureUserData*)fixture.GetUserData() )
                    ///    delete fud;
                    super.SayGoodbyeFixture(fixture);
                }
                /**
                 * (unused but must implement all pure virtual functions)
                 */
                SayGoodbyeJoint(joint) {
                    super.SayGoodbyeJoint(joint);
                }
            };
            exports_1("MyDestructionListener", MyDestructionListener);
            TopdownCar = class TopdownCar extends testbed.Test {
                constructor() {
                    super();
                    //this.m_destructionListener = new MyDestructionListener(this);
                    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));
                    this.m_world.SetDestructionListener(this.m_destructionListener);
                    //set up ground areas
                    {
                        const bodyDef = new b2.BodyDef();
                        this.m_groundBody = this.m_world.CreateBody(bodyDef);
                        const polygonShape = new b2.PolygonShape();
                        const fixtureDef = new b2.FixtureDef();
                        fixtureDef.shape = polygonShape;
                        fixtureDef.isSensor = true;
                        polygonShape.SetAsBox(9, 7, new b2.Vec2(-10, 15), 20 * DEGTORAD);
                        let groundAreaFixture = this.m_groundBody.CreateFixture(fixtureDef);
                        groundAreaFixture.SetUserData(new GroundAreaFUD(0.5, false));
                        polygonShape.SetAsBox(9, 5, new b2.Vec2(5, 20), -40 * DEGTORAD);
                        groundAreaFixture = this.m_groundBody.CreateFixture(fixtureDef);
                        groundAreaFixture.SetUserData(new GroundAreaFUD(0.2, false));
                    }
                    //this.m_tire = new TDTire(this.m_world);
                    //this.m_tire.setCharacteristics(100, -20, 150);
                    this.m_car = new TDCar(this.m_world);
                    this.m_controlState = 0;
                }
                Keyboard(key) {
                    switch (key) {
                        case "a":
                            this.m_controlState |= TDC_LEFT;
                            break;
                        case "d":
                            this.m_controlState |= TDC_RIGHT;
                            break;
                        case "w":
                            this.m_controlState |= TDC_UP;
                            break;
                        case "s":
                            this.m_controlState |= TDC_DOWN;
                            break;
                        default:
                            super.Keyboard(key);
                    }
                }
                KeyboardUp(key) {
                    switch (key) {
                        case "a":
                            this.m_controlState &= ~TDC_LEFT;
                            break;
                        case "d":
                            this.m_controlState &= ~TDC_RIGHT;
                            break;
                        case "w":
                            this.m_controlState &= ~TDC_UP;
                            break;
                        case "s":
                            this.m_controlState &= ~TDC_DOWN;
                            break;
                        default:
                            super.KeyboardUp(key);
                    }
                }
                static handleContact(contact, began) {
                    const a = contact.GetFixtureA();
                    const b = contact.GetFixtureB();
                    const fudA = a.GetUserData();
                    const fudB = b.GetUserData();
                    if (!fudA || !fudB) {
                        return;
                    }
                    if (fudA.getType() === FUD_CAR_TIRE || fudB.getType() === FUD_GROUND_AREA) {
                        TopdownCar.tire_vs_groundArea(a, b, began);
                    }
                    else if (fudA.getType() === FUD_GROUND_AREA || fudB.getType() === FUD_CAR_TIRE) {
                        TopdownCar.tire_vs_groundArea(b, a, began);
                    }
                }
                BeginContact(contact) {
                    TopdownCar.handleContact(contact, true);
                }
                EndContact(contact) {
                    TopdownCar.handleContact(contact, false);
                }
                static tire_vs_groundArea(tireFixture, groundAreaFixture, began) {
                    const tire = tireFixture.GetBody().GetUserData();
                    const gaFud = groundAreaFixture.GetUserData();
                    if (began) {
                        tire.addGroundArea(gaFud);
                    }
                    else {
                        tire.removeGroundArea(gaFud);
                    }
                }
                Step(settings) {
                    /*this.m_tire.updateFriction();
                    this.m_tire.updateDrive(this.m_controlState);
                    this.m_tire.updateTurn(this.m_controlState);*/
                    this.m_car.update(this.m_controlState);
                    super.Step(settings);
                    //show some useful info
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press w/a/s/d to control the car");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    //testbed.g_debugDraw.DrawString(5, this.m_textLine, "Tire traction: %.2f", this.m_tire.m_currentTraction);
                    //this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new TopdownCar();
                }
            };
            exports_1("TopdownCar", TopdownCar);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wX2Rvd25fY2FyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvdG9wX2Rvd25fY2FyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7Ozs7Ozs7Ozs7Ozs7OztZQUtHLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQztZQUN2QywwQ0FBMEM7WUFFcEMsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUNmLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDaEIsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNiLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFFckI7O2VBRUc7WUFDRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLGVBQWUsR0FBRyxDQUFDLENBQUM7WUFFMUI7O2VBRUc7WUFDSCxrQkFBQSxNQUFhLGVBQWU7Z0JBRzFCLFlBQVksSUFBWTtvQkFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sT0FBTztvQkFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7YUFDRixDQUFBOztZQUVEOztlQUVHO1lBQ0gsYUFBQSxNQUFhLFVBQVcsU0FBUSxlQUFlO2dCQUM3QztvQkFDRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3RCLENBQUM7YUFDRixDQUFBOztZQUVELE1BQU07WUFDTix1REFBdUQ7WUFDdkQsTUFBTTtZQUNOLGdCQUFBLE1BQWEsYUFBYyxTQUFRLGVBQWU7Z0JBR2hELFlBQVksRUFBVSxFQUFFLEdBQVk7b0JBQ2xDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7Z0JBQ3pCLENBQUM7YUFDRixDQUFBOztZQUVELFNBQUEsTUFBYSxNQUFNO2dCQVNqQixZQUFZLEtBQWU7b0JBUnBCLGtC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