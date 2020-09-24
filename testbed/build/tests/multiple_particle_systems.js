/*
 * Copyright (c) 2014 Google, Inc.
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
    var b2, testbed, MultipleParticleSystems;
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
            MultipleParticleSystems = class MultipleParticleSystems extends testbed.Test {
                constructor() {
                    super();
                    this.m_emitters = [
                        new testbed.RadialEmitter(),
                        new testbed.RadialEmitter(),
                    ];
                    // Configure the default particle system's parameters.
                    this.m_particleSystem.SetRadius(0.05);
                    this.m_particleSystem.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);
                    this.m_particleSystem.SetDestructionByAge(true);
                    // Create a secondary particle system.
                    const particleSystemDef = new b2.ParticleSystemDef();
                    particleSystemDef.radius = this.m_particleSystem.GetRadius();
                    particleSystemDef.destroyByAge = true;
                    this.m_particleSystem2 = this.m_world.CreateParticleSystem(particleSystemDef);
                    this.m_particleSystem2.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);
                    // Don't restart the test when changing particle types.
                    testbed.Test.SetRestartOnParticleParameterChange(false);
                    // Create the ground.
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(5.0, 0.1);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Create a dynamic body to push around.
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        const center = new b2.Vec2(0.0, 1.2);
                        shape.SetAsBox(MultipleParticleSystems.k_dynamicBoxSize.x, MultipleParticleSystems.k_dynamicBoxSize.y, center, 0.0);
                        body.CreateFixture(shape, 0.0);
                        ///  b2MassData massData = { MultipleParticleSystems.k_boxMass, center, 0.0 };
                        const massData = new b2.MassData();
                        massData.mass = MultipleParticleSystems.k_boxMass;
                        massData.center.Copy(center);
                        massData.I = 0.0;
                        body.SetMassData(massData);
                    }
                    // Initialize the emitters.
                    for (let i = 0; i < this.m_emitters.length; ++i) {
                        const mirrorAlongY = i & 1 ? -1.0 : 1.0;
                        const emitter = this.m_emitters[i];
                        emitter.SetPosition(new b2.Vec2(MultipleParticleSystems.k_emitterPosition.x * mirrorAlongY, MultipleParticleSystems.k_emitterPosition.y));
                        emitter.SetSize(MultipleParticleSystems.k_emitterSize);
                        emitter.SetVelocity(new b2.Vec2(MultipleParticleSystems.k_emitterVelocity.x * mirrorAlongY, MultipleParticleSystems.k_emitterVelocity.y));
                        emitter.SetEmitRate(MultipleParticleSystems.k_emitRate);
                        emitter.SetColor(i & 1 ? MultipleParticleSystems.k_rightEmitterColor : MultipleParticleSystems.k_leftEmitterColor);
                        emitter.SetParticleSystem(i & 1 ? this.m_particleSystem2 : this.m_particleSystem);
                    }
                }
                Step(settings) {
                    let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
                    if (settings.m_pause && !settings.m_singleStep) {
                        dt = 0.0;
                    }
                    super.Step(settings);
                    for (let i = 0; i < this.m_emitters.length; ++i) {
                        this.m_emitters[i].Step(dt);
                    }
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new MultipleParticleSystems();
                }
            };
            exports_1("MultipleParticleSystems", MultipleParticleSystems);
            /**
             * Maximum number of particles per system.
             */
            MultipleParticleSystems.k_maxParticleCount = 500;
            /**
             * Size of the box which is pushed around by particles.
             */
            MultipleParticleSystems.k_dynamicBoxSize = new b2.Vec2(0.5, 0.5);
            /**
             * Mass of the box.
             */
            MultipleParticleSystems.k_boxMass = 1.0;
            /**
             * Emit rate of the emitters in particles per second.
             */
            MultipleParticleSystems.k_emitRate = 100.0;
            /**
             * Location of the left emitter (the position of the right one
             * is mirrored along the y-axis).
             */
            MultipleParticleSystems.k_emitterPosition = new b2.Vec2(-5.0, 4.0);
            /**
             * Starting velocity of particles from the left emitter (the
             * velocity of particles from the right emitter are mirrored
             * along the y-axis).
             */
            MultipleParticleSystems.k_emitterVelocity = new b2.Vec2(7.0, -4.0);
            /**
             * Size of particle emitters.
             */
            MultipleParticleSystems.k_emitterSize = new b2.Vec2(1.0, 1.0);
            /**
             * Color of the left emitter's particles.
             */
            MultipleParticleSystems.k_leftEmitterColor = new b2.Color().SetByteRGBA(0x22, 0x33, 0xff, 0xff);
            /**
             * Color of the right emitter's particles.
             */
            MultipleParticleSystems.k_rightEmitterColor = new b2.Color().SetByteRGBA(0xff, 0x22, 0x11, 0xff);
        }
    };
});
//# sourceMappingURL=multiple_particle_systems.js.map