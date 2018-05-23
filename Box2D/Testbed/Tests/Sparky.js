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
System.register(["../../Box2D/Box2D", "../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, ParticleVFX, Sparky;
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
            ParticleVFX = class ParticleVFX {
                constructor(particleSystem, origin, size, speed, lifetime, particleFlags) {
                    this.m_initialLifetime = 0.0;
                    this.m_remainingLifetime = 0.0;
                    this.m_halfLifetime = 0.0;
                    this.m_pg = null;
                    this.m_particleSystem = null;
                    this.m_origColor = new box2d.b2Color();
                    // Create a circle to house the particles of size size
                    let shape = new box2d.b2CircleShape();
                    shape.m_p.Copy(origin);
                    shape.m_radius = size;
                    // Create particle def of random color.
                    let pd = new box2d.b2ParticleGroupDef();
                    pd.flags = particleFlags;
                    pd.shape = shape;
                    this.m_origColor.Set(Math.random(), Math.random(), Math.random(), 1.0);
                    pd.color.Copy(this.m_origColor);
                    this.m_particleSystem = particleSystem;
                    // Create a circle full of particles
                    this.m_pg = this.m_particleSystem.CreateParticleGroup(pd);
                    this.m_initialLifetime = this.m_remainingLifetime = lifetime;
                    this.m_halfLifetime = this.m_initialLifetime * 0.5;
                    // Set particle initial velocity based on how far away it is from
                    // origin, exploding outwards.
                    let bufferIndex = this.m_pg.GetBufferIndex();
                    let pos = this.m_particleSystem.GetPositionBuffer();
                    let vel = this.m_particleSystem.GetVelocityBuffer();
                    for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
                        ///  vel[i] = pos[i] - origin;
                        box2d.b2Vec2.SubVV(pos[i], origin, vel[i]);
                        ///  vel[i] *= speed;
                        box2d.b2Vec2.MulVS(vel[i], speed, vel[i]);
                    }
                }
                Drop() {
                    this.m_pg.DestroyParticles(false);
                    this.m_pg = null;
                }
                ColorCoeff() {
                    if (this.m_remainingLifetime >= this.m_halfLifetime) {
                        return 1.0;
                    }
                    return 1.0 - ((this.m_halfLifetime - this.m_remainingLifetime) / this.m_halfLifetime);
                }
                Step(dt) {
                    if (this.m_remainingLifetime > 0.0) {
                        this.m_remainingLifetime = Math.max(this.m_remainingLifetime - dt, 0.0);
                        let coeff = this.ColorCoeff();
                        let colors = this.m_particleSystem.GetColorBuffer();
                        let bufferIndex = this.m_pg.GetBufferIndex();
                        // Set particle colors all at once.
                        for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
                            let c = colors[i];
                            ///  c *= coeff;
                            c.SelfMul_0_1(coeff);
                            c.a = this.m_origColor.a;
                        }
                    }
                }
                IsDone() {
                    return this.m_remainingLifetime <= 0.0;
                }
            };
            Sparky = class Sparky extends testbed.Test {
                constructor() {
                    super();
                    this.m_VFXIndex = 0;
                    this.m_VFX = [];
                    this.m_contact = false;
                    this.m_contactPoint = new box2d.b2Vec2();
                    // Set up array of sparks trackers.
                    this.m_VFXIndex = 0;
                    for (let i = 0; i < Sparky.c_maxVFX; i++) {
                        this.m_VFX[i] = null;
                    }
                    this.CreateWalls();
                    this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
                    // Create a list of circles that will spark.
                    for (let i = 0; i < Sparky.c_maxCircles; i++) {
                        let bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        let body = this.m_world.CreateBody(bd);
                        let shape = new box2d.b2CircleShape();
                        shape.m_p.Set(3.0 * testbed.RandomFloat(), Sparky.SHAPE_HEIGHT_OFFSET + Sparky.SHAPE_OFFSET * i);
                        shape.m_radius = 2;
                        let f = body.CreateFixture(shape, 0.5);
                        // Tag this as a sparkable body.
                        f.SetUserData({
                            spark: true
                        });
                    }
                    testbed.Main.SetRestartOnParticleParameterChange(false);
                    testbed.Main.SetParticleParameterValue(box2d.b2ParticleFlag.b2_powderParticle);
                }
                BeginContact(contact) {
                    super.BeginContact(contact);
                    // Check to see if these are two circles hitting one another.
                    let userA = contact.GetFixtureA().GetUserData();
                    let userB = contact.GetFixtureB().GetUserData();
                    if ((userA && userA.spark) ||
                        (userB && userB.spark)) {
                        let worldManifold = new box2d.b2WorldManifold();
                        contact.GetWorldManifold(worldManifold);
                        // Note that we overwrite any contact; if there are two collisions
                        // on the same frame, only the last one showers sparks.
                        // Two collisions are rare, and this also guarantees we will not
                        // run out of places to store ParticleVFX explosions.
                        this.m_contactPoint.Copy(worldManifold.points[0]);
                        this.m_contact = true;
                    }
                }
                Step(settings) {
                    let particleFlags = testbed.Main.GetParticleParameterValue();
                    super.Step(settings);
                    // If there was a contacts...
                    if (this.m_contact) {
                        // ...explode!
                        this.AddVFX(this.m_contactPoint, particleFlags);
                        this.m_contact = false;
                    }
                    // Step particle explosions.
                    for (let i = 0; i < Sparky.c_maxVFX; i++) {
                        let vfx = this.m_VFX[i];
                        if (vfx === null)
                            continue;
                        vfx.Step(1.0 / settings.hz);
                        if (vfx.IsDone()) {
                            /// delete vfx;
                            vfx.Drop();
                            this.m_VFX[i] = null;
                        }
                    }
                }
                AddVFX(p, particleFlags) {
                    let vfx = this.m_VFX[this.m_VFXIndex];
                    if (vfx !== null) {
                        /// delete vfx;
                        vfx.Drop();
                        this.m_VFX[this.m_VFXIndex] = null;
                    }
                    this.m_VFX[this.m_VFXIndex] = new ParticleVFX(this.m_particleSystem, p, testbed.RandomFloat(1.0, 2.0), testbed.RandomFloat(10.0, 20.0), testbed.RandomFloat(0.5, 1.0), particleFlags);
                    if (++this.m_VFXIndex >= Sparky.c_maxVFX) {
                        this.m_VFXIndex = 0;
                    }
                }
                CreateWalls() {
                    // Create the walls of the world.
                    {
                        let bd = new box2d.b2BodyDef();
                        let ground = this.m_world.CreateBody(bd);
                        {
                            let shape = new box2d.b2PolygonShape();
                            let vertices = [
                                new box2d.b2Vec2(-40, -10),
                                new box2d.b2Vec2(40, -10),
                                new box2d.b2Vec2(40, 0),
                                new box2d.b2Vec2(-40, 0)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            let shape = new box2d.b2PolygonShape();
                            let vertices = [
                                new box2d.b2Vec2(-40, 40),
                                new box2d.b2Vec2(40, 40),
                                new box2d.b2Vec2(40, 50),
                                new box2d.b2Vec2(-40, 50)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            let shape = new box2d.b2PolygonShape();
                            let vertices = [
                                new box2d.b2Vec2(-40, -1),
                                new box2d.b2Vec2(-20, -1),
                                new box2d.b2Vec2(-20, 40),
                                new box2d.b2Vec2(-40, 40)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            let shape = new box2d.b2PolygonShape();
                            let vertices = [
                                new box2d.b2Vec2(20, -1),
                                new box2d.b2Vec2(40, -1),
                                new box2d.b2Vec2(40, 40),
                                new box2d.b2Vec2(20, 40)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                }
                static Create() {
                    return new Sparky();
                }
            };
            Sparky.c_maxCircles = 3; ///6;
            Sparky.c_maxVFX = 20; ///50;
            Sparky.SHAPE_HEIGHT_OFFSET = 7;
            Sparky.SHAPE_OFFSET = 4.5;
            exports_1("Sparky", Sparky);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Bhcmt5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU3Bhcmt5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFPRixjQUFBO2dCQU9FLFlBQVksY0FBc0MsRUFBRSxNQUFvQixFQUFFLElBQVksRUFBRSxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxhQUFtQztvQkFOcEosc0JBQWlCLEdBQUcsR0FBRyxDQUFDO29CQUN4Qix3QkFBbUIsR0FBRyxHQUFHLENBQUM7b0JBQzFCLG1CQUFjLEdBQUcsR0FBRyxDQUFDO29CQUNyQixTQUFJLEdBQTBCLElBQUksQ0FBQztvQkFDbkMscUJBQWdCLEdBQTJCLElBQUksQ0FBQztvQkFDaEQsZ0JBQVcsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRXZELHNEQUFzRDtvQkFDdEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQ3RDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN2QixLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFFdEIsdUNBQXVDO29CQUN2QyxJQUFJLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUN4QyxFQUFFLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQztvQkFDekIsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNsQixJQUFJLENBQUMsTUFBTSxFQUFFLEVBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUNiLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFDYixHQUFHLENBQUMsQ0FBQztvQkFDUCxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ2hD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