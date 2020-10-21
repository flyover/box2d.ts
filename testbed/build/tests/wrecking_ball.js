// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, WreckingBall, testIndex;
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
            /// This test shows how a distance joint can be used to stabilize a chain of
            /// bodies with a heavy payload. Notice that the distance joint just prevents
            /// excessive stretching and has no other effect.
            /// By disabling the distance joint you can see that the Box2D solver has trouble
            /// supporting heavy bodies with light bodies. Try playing around with the
            /// densities, time step, and iterations to see how they affect stability.
            /// This test also shows how to use contact filtering. Filtering is configured
            /// so that the payload does not collide with the chain.
            WreckingBall = class WreckingBall extends testbed.Test {
                constructor() {
                    super();
                    this.m_distanceJointDef = new b2.DistanceJointDef();
                    this.m_distanceJoint = null;
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 0.125);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.density = 20.0;
                        fd.friction = 0.2;
                        fd.filter.categoryBits = 0x0001;
                        fd.filter.maskBits = 0xFFFF & ~0x0002;
                        const jd = new b2.RevoluteJointDef();
                        jd.collideConnected = false;
                        const N = 10;
                        const y = 15.0;
                        this.m_distanceJointDef.localAnchorA.Set(0.0, y);
                        let prevBody = ground;
                        for (let i = 0; i < N; ++i) {
                            const bd = new b2.BodyDef();
                            bd.type = b2.BodyType.b2_dynamicBody;
                            bd.position.Set(0.5 + 1.0 * i, y);
                            if (i === N - 1) {
                                bd.position.Set(1.0 * i, y);
                                bd.angularDamping = 0.4;
                            }
                            const body = this.m_world.CreateBody(bd);
                            if (i === N - 1) {
                                const circleShape = new b2.CircleShape();
                                circleShape.m_radius = 1.5;
                                const sfd = new b2.FixtureDef();
                                sfd.shape = circleShape;
                                sfd.density = 100.0;
                                sfd.filter.categoryBits = 0x0002;
                                body.CreateFixture(sfd);
                            }
                            else {
                                body.CreateFixture(fd);
                            }
                            const anchor = new b2.Vec2(i, y);
                            jd.Initialize(prevBody, body, anchor);
                            this.m_world.CreateJoint(jd);
                            prevBody = body;
                        }
                        this.m_distanceJointDef.localAnchorB.SetZero();
                        const extraLength = 0.01;
                        this.m_distanceJointDef.minLength = 0.0;
                        this.m_distanceJointDef.maxLength = N - 1.0 + extraLength;
                        this.m_distanceJointDef.bodyB = prevBody;
                    }
                    {
                        this.m_distanceJointDef.bodyA = ground;
                        this.m_distanceJoint = this.m_world.CreateJoint(this.m_distanceJointDef);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "j":
                            if (this.m_distanceJoint) {
                                this.m_world.DestroyJoint(this.m_distanceJoint);
                                this.m_distanceJoint = null;
                            }
                            else {
                                this.m_distanceJoint = this.m_world.CreateJoint(this.m_distanceJointDef);
                            }
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press (j) to toggle the distance joint.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    if (this.m_distanceJoint) {
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, "Distance Joint ON");
                    }
                    else {
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, "Distance Joint OFF");
                    }
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new WreckingBall();
                }
            };
            exports_1("WreckingBall", WreckingBall);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Wrecking Ball", WreckingBall.Create));
        }
    };
});
//# sourceMappingURL=wrecking_ball.js.map