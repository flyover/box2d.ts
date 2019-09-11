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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, ParticleLifetimeRandomizer, Faucet;
    var __moduleName = context_1 && context_1.id;
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
            ParticleLifetimeRandomizer = class ParticleLifetimeRandomizer extends testbed.EmittedParticleCallback {
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
                    this.m_emitter = new testbed.RadialEmitter();
                    this.m_lifetimeRandomizer = new ParticleLifetimeRandomizer(Faucet.k_particleLifetimeMin, Faucet.k_particleLifetimeMax);
                    // Configure particle system parameters.
                    this.m_particleSystem.SetRadius(0.035);
                    this.m_particleSystem.SetMaxParticleCount(Faucet.k_maxParticleCount);
                    this.m_particleSystem.SetDestructionByAge(true);
                    let ground;
                    {
                        const bd = new box2d.b2BodyDef();
                        ground = this.m_world.CreateBody(bd);
                    }
                    // Create the container / trough style sink.
                    {
                        const shape = new box2d.b2PolygonShape();
                        const height = Faucet.k_containerHeight + Faucet.k_containerThickness;
                        shape.SetAsBox(Faucet.k_containerWidth - Faucet.k_containerThickness, Faucet.k_containerThickness, new box2d.b2Vec2(0.0, 0.0), 0.0);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetAsBox(Faucet.k_containerThickness, height, new box2d.b2Vec2(-Faucet.k_containerWidth, Faucet.k_containerHeight), 0.0);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetAsBox(Faucet.k_containerThickness, height, new box2d.b2Vec2(Faucet.k_containerWidth, Faucet.k_containerHeight), 0.0);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Create ground under the container to catch overflow.
                    {
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(Faucet.k_containerWidth * 5.0, Faucet.k_containerThickness, new box2d.b2Vec2(0.0, Faucet.k_containerThickness * -2.0), 0.0);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Create the faucet spout.
                    {
                        const shape = new box2d.b2PolygonShape();
                        const particleDiameter = this.m_particleSystem.GetRadius() * 2.0;
                        const faucetLength = Faucet.k_faucetLength * particleDiameter;
                        // Dimensions of the faucet in world units.
                        const length = faucetLength * Faucet.k_spoutLength;
                        const width = Faucet.k_containerWidth * Faucet.k_faucetWidth *
                            Faucet.k_spoutWidth;
                        // Height from the bottom of the container.
                        const height = (Faucet.k_containerHeight * Faucet.k_faucetHeight) +
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
                        const faucetLength = this.m_particleSystem.GetRadius() * 2.0 * Faucet.k_faucetLength;
                        this.m_emitter.SetParticleSystem(this.m_particleSystem);
                        this.m_emitter.SetCallback(this.m_lifetimeRandomizer);
                        this.m_emitter.SetPosition(new box2d.b2Vec2(Faucet.k_containerWidth * Faucet.k_faucetWidth, Faucet.k_containerHeight * Faucet.k_faucetHeight + (faucetLength * 0.5)));
                        this.m_emitter.SetVelocity(new box2d.b2Vec2(0.0, 0.0));
                        this.m_emitter.SetSize(new box2d.b2Vec2(0.0, faucetLength));
                        this.m_emitter.SetColor(new box2d.b2Color(1, 1, 1, 1));
                        this.m_emitter.SetEmitRate(120.0);
                        this.m_emitter.SetParticleFlags(testbed.Test.GetParticleParameterValue());
                    }
                    // Don't restart the test when changing particle types.
                    testbed.Test.SetRestartOnParticleParameterChange(false);
                    // Limit the set of particle types.
                    testbed.Test.SetParticleParameters(Faucet.k_paramDef, Faucet.k_paramDefCount);
                }
                Step(settings) {
                    let dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
                    if (settings.pause && !settings.singleStep) {
                        dt = 0.0;
                    }
                    super.Step(settings);
                    this.m_particleColorOffset += dt;
                    // Keep m_particleColorOffset in the range 0.0f..k_ParticleColorsCount.
                    if (this.m_particleColorOffset >= testbed.Test.k_ParticleColorsCount) {
                        this.m_particleColorOffset -= testbed.Test.k_ParticleColorsCount;
                    }
                    // Propagate the currently selected particle flags.
                    this.m_emitter.SetParticleFlags(testbed.Test.GetParticleParameterValue());
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
                    const k_keys = [
                        "Keys: (w) water, (q) powder",
                        "      (t) tensile, (v) viscous",
                        "      (c) color mixing, (s) static pressure",
                        "      (+) increase flow, (-) decrease flow",
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
                    testbed.Test.SetParticleParameterValue(parameter);
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
            exports_1("Faucet", Faucet);
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
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions, "water"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions | testbed.ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_viscousParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "powder"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_colorMixingParticle, testbed.ParticleParameter.k_DefaultOptions, "color mixing"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_staticPressureParticle, testbed.ParticleParameter.k_DefaultOptions, "static pressure"),
            ];
            Faucet.k_paramDef = [
                new testbed.ParticleParameterDefinition(Faucet.k_paramValues),
            ];
            Faucet.k_paramDefCount = Faucet.k_paramDef.length;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmF1Y2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRmF1Y2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7Ozs7WUFPSCw2QkFBQSxNQUFhLDBCQUEyQixTQUFRLE9BQU8sQ0FBQyx1QkFBdUI7Z0JBRzdFLFlBQVksV0FBbUIsRUFBRSxXQUFtQjtvQkFDbEQsS0FBSyxFQUFFLENBQUM7b0JBSEgsa0JBQWEsR0FBRyxHQUFHLENBQUM7b0JBQ3BCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO29CQUd6QixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztvQkFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0Q7O21CQUVHO2dCQUNJLGVBQWUsQ0FBQyxNQUE4QixFQUFFLGFBQXFCO29CQUMxRSxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDNUgsQ0FBQzthQUNGLENBQUE7O1lBRUQ7Ozs7ZUFJRztZQUNILFNBQUEsTUFBYSxNQUFPLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBNEZ0QztvQkFDRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtvQkE1RnBDOzt1QkFFRztvQkFDSSwwQkFBcUIsR0FBRyxHQUFHLENBQUM7b0JBMkZqQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUM3QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSwwQkFBMEIsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7b0JBRXZILHdDQUF3QztvQkFDeEMsSUFBSSxDQUFD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