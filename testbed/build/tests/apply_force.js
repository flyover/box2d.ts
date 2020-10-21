// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, ApplyForce, testIndex;
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
            // This test shows how to apply forces and torques to a body.
            // It also shows how to use the friction joint that can be useful
            // for overhead games.
            ApplyForce = class ApplyForce extends testbed.Test {
                constructor() {
                    super();
                    this.m_world.SetGravity(new b2.Vec2(0.0, 0.0));
                    const k_restitution = 0.4;
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(0.0, 20.0);
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        const sd = new b2.FixtureDef();
                        sd.shape = shape;
                        sd.density = 0.0;
                        sd.restitution = k_restitution;
                        // Left vertical
                        shape.SetTwoSided(new b2.Vec2(-20.0, -20.0), new b2.Vec2(-20.0, 20.0));
                        ground.CreateFixture(sd);
                        // Right vertical
                        shape.SetTwoSided(new b2.Vec2(20.0, -20.0), new b2.Vec2(20.0, 20.0));
                        ground.CreateFixture(sd);
                        // Top horizontal
                        shape.SetTwoSided(new b2.Vec2(-20.0, 20.0), new b2.Vec2(20.0, 20.0));
                        ground.CreateFixture(sd);
                        // Bottom horizontal
                        shape.SetTwoSided(new b2.Vec2(-20.0, -20.0), new b2.Vec2(20.0, -20.0));
                        ground.CreateFixture(sd);
                    }
                    {
                        const xf1 = new b2.Transform();
                        xf1.q.SetAngle(0.3524 * b2.pi);
                        xf1.p.Copy(b2.Rot.MulRV(xf1.q, new b2.Vec2(1.0, 0.0), new b2.Vec2()));
                        const vertices = new Array();
                        vertices[0] = b2.Transform.MulXV(xf1, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
                        vertices[1] = b2.Transform.MulXV(xf1, new b2.Vec2(1.0, 0.0), new b2.Vec2());
                        vertices[2] = b2.Transform.MulXV(xf1, new b2.Vec2(0.0, 0.5), new b2.Vec2());
                        const poly1 = new b2.PolygonShape();
                        poly1.Set(vertices, 3);
                        const sd1 = new b2.FixtureDef();
                        sd1.shape = poly1;
                        sd1.density = 2.0;
                        const xf2 = new b2.Transform();
                        xf2.q.SetAngle(-0.3524 * b2.pi);
                        xf2.p.Copy(b2.Rot.MulRV(xf2.q, new b2.Vec2(-1.0, 0.0), new b2.Vec2()));
                        vertices[0] = b2.Transform.MulXV(xf2, new b2.Vec2(-1.0, 0.0), new b2.Vec2());
                        vertices[1] = b2.Transform.MulXV(xf2, new b2.Vec2(1.0, 0.0), new b2.Vec2());
                        vertices[2] = b2.Transform.MulXV(xf2, new b2.Vec2(0.0, 0.5), new b2.Vec2());
                        const poly2 = new b2.PolygonShape();
                        poly2.Set(vertices, 3);
                        const sd2 = new b2.FixtureDef();
                        sd2.shape = poly2;
                        sd2.density = 2.0;
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 3.0);
                        bd.angle = b2.pi;
                        bd.allowSleep = false;
                        this.m_body = this.m_world.CreateBody(bd);
                        this.m_body.CreateFixture(sd1);
                        this.m_body.CreateFixture(sd2);
                        const gravity = 10.0;
                        const I = this.m_body.GetInertia();
                        const mass = this.m_body.GetMass();
                        // Compute an effective radius that can be used to
                        // set the max torque for a friction joint
                        // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
                        const radius = b2.Sqrt(2.0 * I / mass);
                        const jd = new b2.FrictionJointDef();
                        jd.bodyA = ground;
                        jd.bodyB = this.m_body;
                        jd.localAnchorA.SetZero();
                        jd.localAnchorB.Copy(this.m_body.GetLocalCenter());
                        jd.collideConnected = true;
                        jd.maxForce = 0.5 * mass * gravity;
                        jd.maxTorque = 0.2 * mass * radius * gravity;
                        this.m_world.CreateJoint(jd);
                    }
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 1.0;
                        fd.friction = 0.3;
                        for (let i = 0; i < 10; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(0.0, 7.0 + 1.54 * i);
                            const body = this.m_world.CreateBody(bd);
                            body.CreateFixture(fd);
                            const gravity = 10.0;
                            const I = body.GetInertia();
                            const mass = body.GetMass();
                            // For a circle: I = 0.5 * m * r * r ==> r = sqrt(2 * I / m)
                            const radius = b2.Sqrt(2.0 * I / mass);
                            const jd = new b2.FrictionJointDef();
                            jd.localAnchorA.SetZero();
                            jd.localAnchorB.SetZero();
                            jd.bodyA = ground;
                            jd.bodyB = body;
                            jd.collideConnected = true;
                            jd.maxForce = mass * gravity;
                            jd.maxTorque = 0.1 * mass * radius * gravity;
                            this.m_world.CreateJoint(jd);
                        }
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "w":
                            {
                                const f = this.m_body.GetWorldVector(new b2.Vec2(0.0, -50.0), new b2.Vec2());
                                const p = this.m_body.GetWorldPoint(new b2.Vec2(0.0, 3.0), new b2.Vec2());
                                this.m_body.ApplyForce(f, p, true);
                            }
                            break;
                        case "a":
                            {
                                this.m_body.ApplyTorque(10.0, true);
                            }
                            break;
                        case "d":
                            {
                                this.m_body.ApplyTorque(-10.0, true);
                            }
                            break;
                    }
                    super.Keyboard(key);
                }
                Step(settings) {
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Forward (W), Turn (A) and (D)`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    super.Step(settings);
                }
                static Create() {
                    return new ApplyForce();
                }
            };
            exports_1("ApplyForce", ApplyForce);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Forces", "Apply Force", ApplyForce.Create));
        }
    };
});
//# sourceMappingURL=apply_force.js.map