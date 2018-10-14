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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, DEGTORAD, TDC_LEFT, TDC_RIGHT, TDC_UP, TDC_DOWN, FUD_CAR_TIRE, FUD_GROUND_AREA, FixtureUserData, CarTireFUD, GroundAreaFUD, TDTire, TDCar, MyDestructionListener, TopdownCar;
    var __moduleName = context_1 && context_1.id;
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
                    const bodyDef = new box2d.b2BodyDef();
                    bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    this.m_body = world.CreateBody(bodyDef);
                    const polygonShape = new box2d.b2PolygonShape();
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
                    const currentRightNormal = this.m_body.GetWorldVector(new box2d.b2Vec2(1, 0), new box2d.b2Vec2());
                    return currentRightNormal.SelfMul(box2d.b2Vec2.DotVV(currentRightNormal, this.m_body.GetLinearVelocity()));
                }
                getForwardVelocity() {
                    const currentForwardNormal = this.m_body.GetWorldVector(new box2d.b2Vec2(0, 1), new box2d.b2Vec2());
                    return currentForwardNormal.SelfMul(box2d.b2Vec2.DotVV(currentForwardNormal, this.m_body.GetLinearVelocity()));
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
                    const currentForwardNormal = this.m_body.GetWorldVector(new box2d.b2Vec2(0, 1), new box2d.b2Vec2());
                    const currentSpeed = box2d.b2Vec2.DotVV(this.getForwardVelocity(), currentForwardNormal);
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
                    const bodyDef = new box2d.b2BodyDef();
                    bodyDef.type = box2d.b2BodyType.b2_dynamicBody;
                    this.m_body = world.CreateBody(bodyDef);
                    this.m_body.SetAngularDamping(3);
                    const vertices = [];
                    vertices[0] = new box2d.b2Vec2(1.5, 0);
                    vertices[1] = new box2d.b2Vec2(3, 2.5);
                    vertices[2] = new box2d.b2Vec2(2.8, 5.5);
                    vertices[3] = new box2d.b2Vec2(1, 10);
                    vertices[4] = new box2d.b2Vec2(-1, 10);
                    vertices[5] = new box2d.b2Vec2(-2.8, 5.5);
                    vertices[6] = new box2d.b2Vec2(-3, 2.5);
                    vertices[7] = new box2d.b2Vec2(-1.5, 0);
                    const polygonShape = new box2d.b2PolygonShape();
                    polygonShape.Set(vertices, 8);
                    this.m_body.CreateFixture(polygonShape, 0.1); //shape, density
                    //prepare common joint parameters
                    const jointDef = new box2d.b2RevoluteJointDef();
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
                    angleToTurn = box2d.b2Clamp(angleToTurn, -turnPerTimeStep, turnPerTimeStep);
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
                    this.m_world.SetGravity(new box2d.b2Vec2(0.0, 0.0));
                    this.m_world.SetDestructionListener(this.m_destructionListener);
                    //set up ground areas
                    {
                        const bodyDef = new box2d.b2BodyDef();
                        this.m_groundBody = this.m_world.CreateBody(bodyDef);
                        const polygonShape = new box2d.b2PolygonShape();
                        const fixtureDef = new box2d.b2FixtureDef();
                        fixtureDef.shape = polygonShape;
                        fixtureDef.isSensor = true;
                        polygonShape.SetAsBox(9, 7, new box2d.b2Vec2(-10, 15), 20 * DEGTORAD);
                        let groundAreaFixture = this.m_groundBody.CreateFixture(fixtureDef);
                        groundAreaFixture.SetUserData(new GroundAreaFUD(0.5, false));
                        polygonShape.SetAsBox(9, 5, new box2d.b2Vec2(5, 20), -40 * DEGTORAD);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9wZG93bkNhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvVG9wZG93bkNhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFLRyxRQUFRLEdBQUcscUJBQXFCLENBQUM7WUFDdkMsMENBQTBDO1lBRXBDLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDZixTQUFTLEdBQUcsR0FBRyxDQUFDO1lBQ2hCLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDYixRQUFRLEdBQUcsR0FBRyxDQUFDO1lBRXJCOztlQUVHO1lBQ0csWUFBWSxHQUFHLENBQUMsQ0FBQztZQUNqQixlQUFlLEdBQUcsQ0FBQyxDQUFDO1lBRTFCOztlQUVHO1lBQ0gsa0JBQUEsTUFBYSxlQUFlO2dCQUcxQixZQUFZLElBQVk7b0JBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixDQUFDO2dCQUVNLE9BQU87b0JBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2FBQ0YsQ0FBQTs7WUFFRDs7ZUFFRztZQUNILGFBQUEsTUFBYSxVQUFXLFNBQVEsZUFBZTtnQkFDN0M7b0JBQ0UsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN0QixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxNQUFNO1lBQ04sdURBQXVEO1lBQ3ZELE1BQU07WUFDTixnQkFBQSxNQUFhLGFBQWMsU0FBUSxlQUFlO2dCQUdoRCxZQUFZLEVBQVUsRUFBRSxHQUFZO29CQUNsQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7b0JBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO2dCQUN6QixDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxTQUFBLE1BQWEsTUFBTTtnQkFTakIsWUFBWSxLQUFvQjtv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