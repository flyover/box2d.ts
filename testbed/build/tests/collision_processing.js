// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, CollisionProcessing, testIndex;
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
            // This test shows collision processing and tests
            // deferred body destruction.
            CollisionProcessing = class CollisionProcessing extends testbed.Test {
                constructor() {
                    super();
                    // Ground body
                    {
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        const sd = new b2.FixtureDef();
                        sd.shape = shape;
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        ground.CreateFixture(sd);
                    }
                    const xLo = -5.0, xHi = 5.0;
                    const yLo = 2.0, yHi = 35.0;
                    // Small triangle
                    const vertices = new Array(3);
                    vertices[0] = new b2.Vec2(-1.0, 0.0);
                    vertices[1] = new b2.Vec2(1.0, 0.0);
                    vertices[2] = new b2.Vec2(0.0, 2.0);
                    const polygon = new b2.PolygonShape();
                    polygon.Set(vertices, 3);
                    const triangleShapeDef = new b2.FixtureDef();
                    triangleShapeDef.shape = polygon;
                    triangleShapeDef.density = 1.0;
                    const triangleBodyDef = new b2.BodyDef();
                    triangleBodyDef.type = b2.BodyType.b2_dynamicBody;
                    triangleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body1 = this.m_world.CreateBody(triangleBodyDef);
                    body1.CreateFixture(triangleShapeDef);
                    // Large triangle (recycle definitions)
                    vertices[0].SelfMul(2.0);
                    vertices[1].SelfMul(2.0);
                    vertices[2].SelfMul(2.0);
                    polygon.Set(vertices, 3);
                    triangleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body2 = this.m_world.CreateBody(triangleBodyDef);
                    body2.CreateFixture(triangleShapeDef);
                    // Small box
                    polygon.SetAsBox(1.0, 0.5);
                    const boxShapeDef = new b2.FixtureDef();
                    boxShapeDef.shape = polygon;
                    boxShapeDef.density = 1.0;
                    const boxBodyDef = new b2.BodyDef();
                    boxBodyDef.type = b2.BodyType.b2_dynamicBody;
                    boxBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body3 = this.m_world.CreateBody(boxBodyDef);
                    body3.CreateFixture(boxShapeDef);
                    // Large box (recycle definitions)
                    polygon.SetAsBox(2.0, 1.0);
                    boxBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body4 = this.m_world.CreateBody(boxBodyDef);
                    body4.CreateFixture(boxShapeDef);
                    // Small circle
                    const circle = new b2.CircleShape();
                    circle.m_radius = 1.0;
                    const circleShapeDef = new b2.FixtureDef();
                    circleShapeDef.shape = circle;
                    circleShapeDef.density = 1.0;
                    const circleBodyDef = new b2.BodyDef();
                    circleBodyDef.type = b2.BodyType.b2_dynamicBody;
                    circleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body5 = this.m_world.CreateBody(circleBodyDef);
                    body5.CreateFixture(circleShapeDef);
                    // Large circle
                    circle.m_radius *= 2.0;
                    circleBodyDef.position.Set(b2.RandomRange(xLo, xHi), b2.RandomRange(yLo, yHi));
                    const body6 = this.m_world.CreateBody(circleBodyDef);
                    body6.CreateFixture(circleShapeDef);
                }
                Step(settings) {
                    super.Step(settings);
                    // We are going to destroy some bodies according to contact
                    // points. We must buffer the bodies that should be destroyed
                    // because they may belong to multiple contact points.
                    const k_maxNuke = 6;
                    const nuke = new Array(k_maxNuke);
                    let nukeCount = 0;
                    // Traverse the contact results. Destroy bodies that
                    // are touching heavier bodies.
                    for (let i = 0; i < this.m_pointCount; ++i) {
                        const point = this.m_points[i];
                        const body1 = point.fixtureA.GetBody();
                        const body2 = point.fixtureB.GetBody();
                        const mass1 = body1.GetMass();
                        const mass2 = body2.GetMass();
                        if (mass1 > 0.0 && mass2 > 0.0) {
                            if (mass2 > mass1) {
                                nuke[nukeCount++] = body1;
                            }
                            else {
                                nuke[nukeCount++] = body2;
                            }
                            if (nukeCount === k_maxNuke) {
                                break;
                            }
                        }
                    }
                    // Sort the nuke array to group duplicates.
                    nuke.sort((a, b) => {
                        return a - b;
                    });
                    // Destroy the bodies, skipping duplicates.
                    let i = 0;
                    while (i < nukeCount) {
                        const b = nuke[i++];
                        while (i < nukeCount && nuke[i] === b) {
                            ++i;
                        }
                        if (b !== this.m_bomb) {
                            this.m_world.DestroyBody(b);
                        }
                    }
                }
                static Create() {
                    return new CollisionProcessing();
                }
            };
            exports_1("CollisionProcessing", CollisionProcessing);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Collision Processing", CollisionProcessing.Create));
        }
    };
});
//# sourceMappingURL=collision_processing.js.map