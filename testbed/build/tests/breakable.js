// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Breakable, testIndex;
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
            // This is used to test sensor shapes.
            Breakable = class Breakable extends testbed.Test {
                constructor() {
                    super();
                    this.m_velocity = new b2.Vec2();
                    this.m_angularVelocity = 0;
                    this.m_shape1 = new b2.PolygonShape();
                    this.m_shape2 = new b2.PolygonShape();
                    this.m_piece1 = null;
                    this.m_piece2 = null;
                    this.m_broke = false;
                    this.m_break = false;
                    // Ground body
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Breakable dynamic body
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.position.Set(0.0, 40.0);
                        bd.angle = 0.25 * b2.pi;
                        this.m_body1 = this.m_world.CreateBody(bd);
                        this.m_shape1 = new b2.PolygonShape();
                        this.m_shape1.SetAsBox(0.5, 0.5, new b2.Vec2(-0.5, 0.0), 0.0);
                        this.m_piece1 = this.m_body1.CreateFixture(this.m_shape1, 1.0);
                        this.m_shape2 = new b2.PolygonShape();
                        this.m_shape2.SetAsBox(0.5, 0.5, new b2.Vec2(0.5, 0.0), 0.0);
                        this.m_piece2 = this.m_body1.CreateFixture(this.m_shape2, 1.0);
                    }
                }
                PostSolve(contact, impulse) {
                    if (this.m_broke) {
                        // The body already broke.
                        return;
                    }
                    // Should the body break?
                    const count = contact.GetManifold().pointCount;
                    let maxImpulse = 0.0;
                    for (let i = 0; i < count; ++i) {
                        maxImpulse = b2.Max(maxImpulse, impulse.normalImpulses[i]);
                    }
                    if (maxImpulse > 40.0) {
                        // Flag the body for breaking.
                        this.m_break = true;
                    }
                }
                Break() {
                    if (this.m_piece1 === null) {
                        return;
                    }
                    if (this.m_piece2 === null) {
                        return;
                    }
                    // Create two bodies from one.
                    const body1 = this.m_piece1.GetBody();
                    const center = body1.GetWorldCenter();
                    body1.DestroyFixture(this.m_piece2);
                    this.m_piece2 = null;
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Copy(body1.GetPosition());
                    bd.angle = body1.GetAngle();
                    const body2 = this.m_world.CreateBody(bd);
                    this.m_piece2 = body2.CreateFixture(this.m_shape2, 1.0);
                    // Compute consistent velocities for new bodies based on
                    // cached velocity.
                    const center1 = body1.GetWorldCenter();
                    const center2 = body2.GetWorldCenter();
                    const velocity1 = b2.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2.Vec2.SubVV(center1, center, b2.Vec2.s_t0), new b2.Vec2());
                    const velocity2 = b2.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2.Vec2.SubVV(center2, center, b2.Vec2.s_t0), new b2.Vec2());
                    body1.SetAngularVelocity(this.m_angularVelocity);
                    body1.SetLinearVelocity(velocity1);
                    body2.SetAngularVelocity(this.m_angularVelocity);
                    body2.SetLinearVelocity(velocity2);
                }
                Step(settings) {
                    if (this.m_break) {
                        this.Break();
                        this.m_broke = true;
                        this.m_break = false;
                    }
                    // Cache velocities to improve movement on breakage.
                    if (!this.m_broke) {
                        this.m_velocity.Copy(this.m_body1.GetLinearVelocity());
                        this.m_angularVelocity = this.m_body1.GetAngularVelocity();
                    }
                    super.Step(settings);
                }
                static Create() {
                    return new Breakable();
                }
            };
            exports_1("Breakable", Breakable);
            Breakable.e_count = 7;
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Breakable", Breakable.Create));
        }
    };
});
//# sourceMappingURL=breakable.js.map