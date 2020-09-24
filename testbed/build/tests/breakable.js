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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, Breakable;
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
                        /*b2.BodyDef*/
                        const bd = new b2.BodyDef();
                        /*b2.Body*/
                        const ground = this.m_world.CreateBody(bd);
                        /*b2.EdgeShape*/
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Breakable dynamic body
                    {
                        /*b2.BodyDef*/
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
                    /*int*/
                    const count = contact.GetManifold().pointCount;
                    /*float32*/
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
                    /*b2.BodyDef*/
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Copy(body1.GetPosition());
                    bd.angle = body1.GetAngle();
                    /*b2.Body*/
                    const body2 = this.m_world.CreateBody(bd);
                    this.m_piece2 = body2.CreateFixture(this.m_shape2, 1.0);
                    // Compute consistent velocities for new bodies based on
                    // cached velocity.
                    /*b2.Vec2*/
                    const center1 = body1.GetWorldCenter();
                    /*b2.Vec2*/
                    const center2 = body2.GetWorldCenter();
                    /*b2.Vec2*/
                    const velocity1 = b2.Vec2.AddVCrossSV(this.m_velocity, this.m_angularVelocity, b2.Vec2.SubVV(center1, center, b2.Vec2.s_t0), new b2.Vec2());
                    /*b2.Vec2*/
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
        }
    };
});
//# sourceMappingURL=breakable.js.map