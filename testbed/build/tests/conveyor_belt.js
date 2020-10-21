// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, ConveyorBelt, testIndex;
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
            ConveyorBelt = class ConveyorBelt extends testbed.Test {
                constructor() {
                    super();
                    // Ground
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-20.0, 0.0), new b2.Vec2(20.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Platform
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(-5.0, 5.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(10.0, 0.5);
                        const fd = new b2.FixtureDef();
                        fd.shape = shape;
                        fd.friction = 0.8;
                        this.m_platform = body.CreateFixture(fd);
                    }
                    // Boxes
                    for (let i = 0; i < 5; ++i) {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(-10.0 + 2.0 * i, 7.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        body.CreateFixture(shape, 20.0);
                    }
                }
                PreSolve(contact, oldManifold) {
                    super.PreSolve(contact, oldManifold);
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    if (fixtureA === this.m_platform) {
                        contact.SetTangentSpeed(5.0);
                    }
                    if (fixtureB === this.m_platform) {
                        contact.SetTangentSpeed(-5.0);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new ConveyorBelt();
                }
            };
            exports_1("ConveyorBelt", ConveyorBelt);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Conveyor Belt", ConveyorBelt.Create));
        }
    };
});
//# sourceMappingURL=conveyor_belt.js.map