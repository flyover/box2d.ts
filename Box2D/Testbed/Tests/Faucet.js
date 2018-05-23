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
    "use strict";
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
        execute: function () {
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
                    if (this.m_emitter.GetParticleFlags() & box2d.b2ParticleFlag.b2_colorMixingParticle) {
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
                            parameter = box2d.b2ParticleFlag.b2_waterParticle;
                            break;
                        case "q":
                            parameter = box2d.b2ParticleFlag.b2_powderParticle;
                            break;
                        case "t":
                            parameter = box2d.b2ParticleFlag.b2_tensileParticle;
                            break;
                        case "v":
                            parameter = box2d.b2ParticleFlag.b2_viscousParticle;
                            break;
                        case "c":
                            parameter = box2d.b2ParticleFlag.b2_colorMixingParticle;
                            break;
                        case "s":
                            parameter = box2d.b2ParticleFlag.b2_staticPressureParticle;
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
                new ParticleParameter_1.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "water"),
                new ParticleParameter_1.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, ParticleParameter_1.ParticleParameter.k_DefaultOptions | ParticleParameter_1.ParticleParameter.Options.OptionStrictContacts, "water (strict)"),
                new ParticleParameter_1.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "viscous"),
                new ParticleParameter_1.ParticleParameter.Value(box2d.b2ParticleFlag.b2_powderParticle, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "powder"),
                new ParticleParameter_1.ParticleParameter.Value(box2d.b2ParticleFlag.b2_tensileParticle, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "tensile"),
                new ParticleParameter_1.ParticleParameter.Value(box2d.b2ParticleFlag.b2_colorMixingParticle, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "color mixing"),
                new ParticleParameter_1.ParticleParameter.Value(box2d.b2ParticleFlag.b2_staticPressureParticle, ParticleParameter_1.ParticleParameter.k_DefaultOptions, "static pressure")
            ];
            Faucet.k_paramDef = [
                new ParticleParameter_1.ParticleParameter.Definition(Faucet.k_paramValues)
            ];
            Faucet.k_paramDefCount = Faucet.k_paramDef.length;
            exports_1("Faucet", Faucet);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmF1Y2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRmF1Y2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFTSCw2QkFBQSxnQ0FBd0MsU0FBUSx5Q0FBdUI7Z0JBR3JFLFlBQVksV0FBbUIsRUFBRSxXQUFtQjtvQkFDbEQsS0FBSyxFQUFFLENBQUM7b0JBSFYsa0JBQWEsR0FBRyxHQUFHLENBQUM7b0JBQ3BCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO29CQUdsQixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztvQkFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0Q7O21CQUVHO2dCQUNILGVBQWUsQ0FBQyxNQUE4QixFQUFFLGFBQXFCO29CQUNuRSxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDNUgsQ0FBQzthQUNGLENBQUE7O1lBRUQ7Ozs7ZUFJRztZQUNILFNBQUEsWUFBb0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkE0RnRDO29CQUNFLEtBQUssRUFBRSxDQUFDLENBQUMseUJBQXlCO29CQTVGcEM7O3VCQUVHO29CQUNILDBCQUFxQixHQUFHLEdBQUcsQ0FBQztvQkEyRjFCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSwrQkFBYSxFQUFFLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztvQkFFdkgsd0NBQXdDO29CQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFD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