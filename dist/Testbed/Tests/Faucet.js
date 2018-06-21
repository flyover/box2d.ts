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
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions, "water"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions | testbed.ParticleParameter.Options.OptionStrictContacts, "water (strict)"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "powder"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_colorMixingParticle, testbed.ParticleParameter.k_DefaultOptions, "color mixing"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_staticPressureParticle, testbed.ParticleParameter.k_DefaultOptions, "static pressure"),
            ];
            Faucet.k_paramDef = [
                new testbed.ParticleParameter.Definition(Faucet.k_paramValues),
            ];
            Faucet.k_paramDefCount = Faucet.k_paramDef.length;
            exports_1("Faucet", Faucet);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmF1Y2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vVGVzdGJlZC9UZXN0cy9GYXVjZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9ILDZCQUFBLGdDQUF3QyxTQUFRLE9BQU8sQ0FBQyx1QkFBdUI7Z0JBRzdFLFlBQVksV0FBbUIsRUFBRSxXQUFtQjtvQkFDbEQsS0FBSyxFQUFFLENBQUM7b0JBSEgsa0JBQWEsR0FBRyxHQUFHLENBQUM7b0JBQ3BCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO29CQUd6QixJQUFJLENBQUMsYUFBYSxHQUFHLFdBQVcsQ0FBQztvQkFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0Q7O21CQUVHO2dCQUNJLGVBQWUsQ0FBQyxNQUE4QixFQUFFLGFBQXFCO29CQUMxRSxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDNUgsQ0FBQzthQUNGLENBQUE7O1lBRUQ7Ozs7ZUFJRztZQUNILFNBQUEsWUFBb0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkE0RnRDO29CQUNFLEtBQUssRUFBRSxDQUFDLENBQUMseUJBQXlCO29CQTVGcEM7O3VCQUVHO29CQUNJLDBCQUFxQixHQUFHLEdBQUcsQ0FBQztvQkEyRmpDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQzdDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztvQkFFdkgsd0NBQXdDO29C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