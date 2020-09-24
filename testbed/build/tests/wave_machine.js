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
    var b2, testbed, WaveMachine;
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
            WaveMachine = class WaveMachine extends testbed.Test {
                constructor() {
                    super();
                    this.m_time = 0;
                    let ground = null;
                    {
                        const bd = new b2.BodyDef();
                        ground = this.m_world.CreateBody(bd);
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        bd.allowSleep = false;
                        bd.position.Set(0.0, 1.0);
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.05, 1.0, new b2.Vec2(2.0, 0.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(0.05, 1.0, new b2.Vec2(-2.0, 0.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(2.0, 0.05, new b2.Vec2(0.0, 1.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        shape.SetAsBox(2.0, 0.05, new b2.Vec2(0.0, -1.0), 0.0);
                        body.CreateFixture(shape, 5.0);
                        const jd = new b2.RevoluteJointDef();
                        jd.bodyA = ground;
                        jd.bodyB = body;
                        jd.localAnchorA.Set(0.0, 1.0);
                        jd.localAnchorB.Set(0.0, 0.0);
                        jd.referenceAngle = 0.0;
                        jd.motorSpeed = 0.05 * b2.pi;
                        jd.maxMotorTorque = 1e7;
                        jd.enableMotor = true;
                        this.m_joint = this.m_world.CreateJoint(jd);
                    }
                    this.m_particleSystem.SetRadius(0.025 * 2); // HACK: increase particle radius
                    const particleType = testbed.Test.GetParticleParameterValue();
                    this.m_particleSystem.SetDamping(0.2);
                    {
                        const pd = new b2.ParticleGroupDef();
                        pd.flags = particleType;
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.9, 0.9, new b2.Vec2(0.0, 1.0), 0.0);
                        pd.shape = shape;
                        const group = this.m_particleSystem.CreateParticleGroup(pd);
                        if (pd.flags & b2.ParticleFlag.b2_colorMixingParticle) {
                            this.ColorParticleGroup(group, 0);
                        }
                    }
                    this.m_time = 0;
                }
                Step(settings) {
                    super.Step(settings);
                    if (settings.m_hertz > 0) {
                        this.m_time += 1 / settings.m_hertz;
                    }
                    this.m_joint.SetMotorSpeed(0.05 * Math.cos(this.m_time) * b2.pi);
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new WaveMachine();
                }
            };
            exports_1("WaveMachine", WaveMachine);
        }
    };
});
//# sourceMappingURL=wave_machine.js.map