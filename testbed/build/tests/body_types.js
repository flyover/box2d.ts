// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, BodyTypes, testIndex;
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
            BodyTypes = class BodyTypes extends testbed.Test {
                constructor() {
                    super();
                    this.m_speed = 0;
                    const bd = new b2.BodyDef();
                    const ground = this.m_world.CreateBody(bd);
                    const shape = new b2.EdgeShape();
                    shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));
                    const fd = new b2.FixtureDef();
                    fd.shape = shape;
                    ground.CreateFixture(fd);
                    // Define attachment
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 3.0);
                        this.m_attachment = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 2.0);
                        this.m_attachment.CreateFixture(shape, 2.0);
                    }
                    // Define platform
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(-4.0, 5.0);
                        this.m_platform = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 4.0, new b2.Vec2(4.0, 0.0), 0.5 * b2.pi);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.6;
                        fd.density = 2.0;
                        this.m_platform.CreateFixture(fd);
                        const rjd = new b2.RevoluteJointDef();
                        rjd.Initialize(this.m_attachment, this.m_platform, new b2.Vec2(0.0, 5.0));
                        rjd.maxMotorTorque = 50.0;
                        rjd.enableMotor = true;
                        this.m_world.CreateJoint(rjd);
                        const pjd = new b2.PrismaticJointDef();
                        pjd.Initialize(ground, this.m_platform, new b2.Vec2(0.0, 5.0), new b2.Vec2(1.0, 0.0));
                        pjd.maxMotorForce = 1000.0;
                        pjd.enableMotor = true;
                        pjd.lowerTranslation = -10.0;
                        pjd.upperTranslation = 10.0;
                        pjd.enableLimit = true;
                        this.m_world.CreateJoint(pjd);
                        this.m_speed = 3.0;
                    }
                    // Create a payload
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 8.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.75, 0.75);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.6;
                        fd.density = 2.0;
                        body.CreateFixture(fd);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "d":
                            this.m_platform.SetType(b2.BodyType.b2_dynamicBody);
                            break;
                        case "s":
                            this.m_platform.SetType(b2.BodyType.b2_staticBody);
                            break;
                        case "k":
                            this.m_platform.SetType(b2.BodyType.b2_kinematicBody);
                            this.m_platform.SetLinearVelocity(new b2.Vec2(-this.m_speed, 0.0));
                            this.m_platform.SetAngularVelocity(0.0);
                            break;
                    }
                }
                Step(settings) {
                    // Drive the kinematic body.
                    if (this.m_platform.GetType() === b2.BodyType.b2_kinematicBody) {
                        const p = this.m_platform.GetTransform().p;
                        const v = this.m_platform.GetLinearVelocity();
                        if ((p.x < -10.0 && v.x < 0.0) ||
                            (p.x > 10.0 && v.x > 0.0)) {
                            this.m_platform.SetLinearVelocity(new b2.Vec2(-v.x, v.y));
                        }
                    }
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (d) dynamic, (s) static, (k) kinematic");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new BodyTypes();
                }
            };
            exports_1("BodyTypes", BodyTypes);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Body Types", BodyTypes.Create));
        }
    };
});
//# sourceMappingURL=body_types.js.map