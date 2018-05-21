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
System.register(["../../Box2D/Box2D", "../Testbed", "../Framework/ParticleParameter", "../Framework/ParticleEmitter"], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, ParticleParameter_1, ParticleEmitter_1, ParticleLifetimeRandomizer, Faucet;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            },
            function (ParticleParameter_1_1) {
                ParticleParameter_1 = ParticleParameter_1_1;
            },
            function (ParticleEmitter_1_1) {
                ParticleEmitter_1 = ParticleEmitter_1_1;
            }
        ],
        execute: function () {/*
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
            ParticleLifetimeRandomizer = class ParticleLifetimeRandomizer extends ParticleEmitter_1.EmittedParticleCallback {
                constructor(minLifetime, maxLifetime) {
                    super();
                    this.m_minLifetime = 0.0;
                    this.m_maxLifetime = 0.0;
                    this.m_minLifetime = minLifetime;
                    this.m_maxLifetime = maxLifetime;
                }
                /**
                 * Called for each created particle.
                 */
                ParticleCreated(system, particleIndex) {
                    system.SetParticleLifetime(particleIndex, Math.random() * (this.m_maxLifetime - this.m_minLifetime) + this.m_minLifetime);
                }
            };
            exports_1("ParticleLifetimeRandomizer", ParticleLifetimeRandomizer);
            /**
             * Faucet test creates a container from boxes and continually
             * spawning particles with finite lifetimes that pour into the
             * box.
             */
            Faucet = class Faucet extends testbed.Test {
                constructor() {
                    super(); // base class constructor
                    /**
                     * Used to cycle through particle colors.
                     */
                    this.m_particleColorOffset = 0.0;
                    this.m_emitter = new ParticleEmitter_1.RadialEmitter();
                    this.m_lifetimeRandomizer = new ParticleLifetimeRandomizer(Faucet.k_particleLifetimeMin, Faucet.k_particleLifetimeMax);
                    // Configure particle system parameters.
                    this.m_particleSystem.SetRadius(0.035);
                    this.m_particleSystem.SetMaxParticleCount(Faucet.k_maxParticleCount);
                    this.m_particleSystem.SetDestructionByAge(true);
                    let ground = null;
                    {
                        let bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                    }
                    // Create the container / trough style sink.
                    {
                        let shape = new box2d.b2PolygonShape();
                        let height = Faucet.k_containerHeight + Faucet.k_containerThickness;
                        shape.SetAsBox(Faucet.k_containerWidth - Faucet.k_containerThickness, Faucet.k_containerThickness, new box2d.b2Vec2(0.0, 0.0), 0.0);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetAsBox(Faucet.k_containerThickness, height, new box2d.b2Vec2(-Faucet.k_containerWidth, Faucet.k_containerHeight), 0.0);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetAsBox(Faucet.k_containerThickness, height, new box2d.b2Vec2(Faucet.k_containerWidth, Faucet.k_containerHeight), 0.0);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Create ground under the container to catch overflow.
                    {
                        let shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(Faucet.k_containerWidth * 5.0, Faucet.k_containerThickness, new box2d.b2Vec2(0.0, Faucet.k_containerThickness * -2.0), 0.0);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Create the faucet spout.
                    {
                        let shape = new box2d.b2PolygonShape();
                        let particleDiameter = this.m_particleSystem.GetRadius() * 2.0;
                        let faucetLength = Faucet.k_faucetLength * particleDiameter;
                        // Dimensions of the faucet in world units.
                        let length = faucetLength * Faucet.k_spoutLength;
                        let width = Faucet.k_containerWidth * Faucet.k_faucetWidth *
                            Faucet.k_spoutWidth;
                        // Height from the bottom of the container.
                        let height = (Faucet.k_containerHeight * Faucet.k_faucetHeight) +
                            (length * 0.5);
                        shape.SetAsBox(particleDiameter, length, new box2d.b2Vec2(-width, height), 0.0);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetAsBox(particleDiameter, length, new box2d.b2Vec2(width, height), 0.0);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetAsBox(width - particleDiameter, particleDiameter, new box2d.b2Vec2(0.0, height + length -
                            particleDiameter), 0.0);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Initialize the particle emitter.
                    {
                        let faucetLength = this.m_particleSystem.GetRadius() * 2.0 * Faucet.k_faucetLength;
                        this.m_emitter.SetParticleSystem(this.m_particleSystem);
                        this.m_emitter.SetCallback(this.m_lifetimeRandomizer);
                        this.m_emitter.SetPosition(new box2d.b2Vec2(Faucet.k_containerWidth * Faucet.k_faucetWidth, Faucet.k_containerHeight * Faucet.k_faucetHeight + (faucetLength * 0.5)));
                        this.m_emitter.SetVelocity(new box2d.b2Vec2(0.0, 0.0));
                        this.m_emitter.SetSize(new box2d.b2Vec2(0.0, faucetLength));
                        this.m_emitter.SetColor(new box2d.b2Color(1, 1, 1, 1));
                        this.m_emitter.SetEmitRate(120.0);
                        this.m_emitter.SetParticleFlags(testbed.Main.GetParticleParameterValue());
                    }
                    // Don't restart the test when changing particle types.
                    testbed.Main.SetRestartOnParticleParameterChange(false);
                    // Limit the set of particle types.
                    testbed.Main.SetParticleParameters(Faucet.k_paramDef, Faucet.k_paramDefCount);
                }
                Step(settings) {
                    let dt = 1.0 / settings.hz;
                    testbed.Test.prototype.Step.call(this, settings);
                    this.m_particleColorOffset += dt;
                    // Keep m_particleColorOffset in the range 0.0f..k_ParticleColorsCount.
                    if (this.m_particleColorOffset >= testbed.Test.k_ParticleColorsCount) {
                        this.m_particleColorOffset -= testbed.Test.k_ParticleColorsCount;
                    }
                    // Propagate the currently selected particle flags.
                    this.m_emitter.SetParticleFlags(testbed.Main.GetParticleParameterValue());
                    // If this is a color mixing particle, add some color.
                    ///  b2Color color(1, 1, 1, 1);
                    if (this.m_emitter.GetParticleFlags() & 256 /* b2_colorMixingParticle */) {
                        // Each second, select a different color.
                        this.m_emitter.SetColor(testbed.Test.k_ParticleColors[Math.floor(this.m_particleColorOffset) % testbed.Test.k_ParticleColorsCount]);
                    }
                    else {
                        this.m_emitter.SetColor(new box2d.b2Color(1, 1, 1, 1));
                    }
                    // Create the particles.
                    this.m_emitter.Step(dt);
                    let k_keys = [
                        "Keys: (w) water, (q) powder",
                        "      (t) tensile, (v) viscous",
                        "      (c) color mixing, (s) static pressure",
                        "      (+) increase flow, (-) decrease flow"
                    ];
                    for (let i = 0; i < k_keys.length; ++i) {
                        testbed.g_debugDraw.DrawString(5, this.m_textLine, k_keys[i]);
                        this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    }
                }
                Keyboard(key) {
                    let parameter = 0;
                    switch (key) {
                        case "w":
                            parameter = 0 /* b2_waterParticle */;
                            break;
                        case "q":
                            parameter = 64 /* b2_powderParticle */;
                            break;
                        case "t":
                            parameter = 128 /* b2_tensileParticle */;
                            break;
                        case "v":
                            parameter = 32 /* b2_viscousParticle */;
                            break;
                        case "c":
                            parameter = 256 /* b2_colorMixingParticle */;
                            break;
                        case "s":
                            parameter = 2048 /* b2_staticPressureParticle */;
                            break;
                        case "=":
                            ///if (this.m_shift)
                            {
                                let emitRate = this.m_emitter.GetEmitRate();
                                emitRate *= Faucet.k_emitRateChangeFactor;
                                emitRate = box2d.b2Max(emitRate, Faucet.k_emitRateMin);
                                this.m_emitter.SetEmitRate(emitRate);
                            }
                            break;
                        case "-":
                            ///if (!this.shift)
                            {
                                let emitRate = this.m_emitter.GetEmitRate();
                                emitRate *= 1.0 / Faucet.k_emitRateChangeFactor;
                                emitRate = box2d.b2Min(emitRate, Faucet.k_emitRateMax);
                                this.m_emitter.SetEmitRate(emitRate);
                            }
                            break;
                        default:
                            // Nothing.
                            return;
                    }
                    testbed.Main.SetParticleParameterValue(parameter);
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                /**
                 * Create the faucet test.
                 */
                static Create() {
                    return new Faucet();
                }
            };
            /**
             * Minimum lifetime of particles in seconds.
             */
            Faucet.k_particleLifetimeMin = 30.0;
            /**
             * Maximum lifetime of particles in seconds.
             */
            Faucet.k_particleLifetimeMax = 50.0;
            /**
             * Height of the container.
             */
            Faucet.k_containerHeight = 0.2;
            /**
             * Width of the container.
             */
            Faucet.k_containerWidth = 1.0;
            /**
             * Thickness of the container's walls and bottom.
             */
            Faucet.k_containerThickness = 0.05;
            /**
             * Width of the faucet relative to the container width.
             */
            Faucet.k_faucetWidth = 0.1;
            /**
             * Height of the faucet relative to the base as a fraction of
             * the container height.
             */
            Faucet.k_faucetHeight = 15.0;
            /**
             * Length of the faucet as a fraction of the particle diameter.
             */
            Faucet.k_faucetLength = 2.0;
            /**
             * Spout height as a fraction of the faucet length.  This should
             * be greater than 1.0f).
             */
            Faucet.k_spoutLength = 2.0;
            /**
             * Spout width as a fraction of the *faucet* width.  This should
             * be greater than 1.0).
             */
            Faucet.k_spoutWidth = 1.1;
            /**
             * Maximum number of particles in the system.
             */
            Faucet.k_maxParticleCount = 1000;
            /**
             * Factor that is used to increase / decrease the emit rate.
             * This should be greater than 1.0.
             */
            Faucet.k_emitRateChangeFactor = 1.05;
            /**
             * Minimum emit rate of the faucet in particles per second.
             */
            Faucet.k_emitRateMin = 1.0;
            /**
             * Maximum emit rate of the faucet in particles per second.
             */
            Faucet.k_emitRateMax = 240.0;
            /**
             * Selection of particle types for this test.
             */
            Faucet.k_paramValues = [
                new ParticleParameter_1.ParticleParameter.Value(0 /* b2_waterParticle */, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "water"),
                new ParticleParameter_1.ParticleParameter.Value(0 /* b2_waterParticle */, ParticleParameter_1.ParticleParameter.k_DefaultOptions | ParticleParameter_1.ParticleParameter.Options.OptionStrictContacts, "water (strict)"),
                new ParticleParameter_1.ParticleParameter.Value(32 /* b2_viscousParticle */, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "viscous"),
                new ParticleParameter_1.ParticleParameter.Value(64 /* b2_powderParticle */, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "powder"),
                new ParticleParameter_1.ParticleParameter.Value(128 /* b2_tensileParticle */, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "tensile"),
                new ParticleParameter_1.ParticleParameter.Value(256 /* b2_colorMixingParticle */, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "color mixing"),
                new ParticleParameter_1.ParticleParameter.Value(2048 /* b2_staticPressureParticle */, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "static pressure")
            ];
            Faucet.k_paramDef = [
                new ParticleParameter_1.ParticleParameter.Definition(Faucet.k_paramValues)
            ];
            Faucet.k_paramDefCount = Faucet.k_paramDef.length;
            exports_1("Faucet", Faucet);
            ///#endif
        }
    };
});
