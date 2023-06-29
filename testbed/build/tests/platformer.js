// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Platformer, Platformer_State, testIndex;
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
            Platformer = class Platformer extends testbed.Test {
                constructor() {
                    super();
                    this.m_radius = 0.0;
                    this.m_top = 0.0;
                    this.m_bottom = 0.0;
                    this.m_state = Platformer_State.e_unknown;
                    // Ground
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Platform
                    {
                        const bd = new b2.BodyDef();
                        bd.position.Set(0.0, 10.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(3.0, 0.5);
                        this.m_platform = body.CreateFixture(shape, 0.0);
                        this.m_bottom = 10.0 - 0.5;
                        this.m_top = 10.0 + 0.5;
                    }
                    // Actor
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 12.0);
                        const body = this.m_world.CreateBody(bd);
                        this.m_radius = 0.5;
                        const shape = new b2.CircleShape();
                        shape.m_radius = this.m_radius;
                        this.m_character = body.CreateFixture(shape, 20.0);
                        body.SetLinearVelocity(new b2.Vec2(0.0, -50.0));
                        this.m_state = Platformer_State.e_unknown;
                    }
                }
                PreSolve(contact, oldManifold) {
                    super.PreSolve(contact, oldManifold);
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    if (fixtureA !== this.m_platform && fixtureA !== this.m_character) {
                        return;
                    }
                    if (fixtureB !== this.m_platform && fixtureB !== this.m_character) {
                        return;
                    }
                    const position = this.m_character.GetBody().GetPosition();
                    if (position.y < this.m_top + this.m_radius - 3.0 * b2.linearSlop) {
                        contact.SetEnabled(false);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    const v = this.m_character.GetBody().GetLinearVelocity();
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Character Linear Velocity: ${v.y}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new Platformer();
                }
            };
            exports_1("Platformer", Platformer);
            (function (Platformer_State) {
                Platformer_State[Platformer_State["e_unknown"] = 0] = "e_unknown";
                Platformer_State[Platformer_State["e_above"] = 1] = "e_above";
                Platformer_State[Platformer_State["e_below"] = 2] = "e_below";
            })(Platformer_State || (exports_1("Platformer_State", Platformer_State = {})));
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Platformer", Platformer.Create));
        }
    };
});
//# sourceMappingURL=platformer.js.map