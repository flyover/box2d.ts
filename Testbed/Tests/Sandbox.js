/*
 * Copyright (c) 2013 Google, Inc.
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
    var box2d, testbed, SandboxParams, SpecialParticleTracker, Sandbox;
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
            // /**
            //  * The following parameters are not static const members of the
            //  * Sandbox class with values assigned inline as it can result in
            //  * link errors when using gcc.
            //  */
            // SandboxParams = {};
            SandboxParams = class SandboxParams {
            };
            exports_1("SandboxParams", SandboxParams);
            /**
             * Total possible pump squares
             */
            SandboxParams.k_maxPumps = 5;
            /**
             * Total possible emitters
             */
            SandboxParams.k_maxEmitters = 5;
            /**
             * Number of seconds to push one direction or the other on the
             * pumps
             */
            SandboxParams.k_flipTime = 6;
            /**
             * Radius of a tile
             */
            SandboxParams.k_tileRadius = 2;
            /**
             * Diameter of a tile
             */
            SandboxParams.k_tileDiameter = 4;
            /**
             * Pump radius; slightly smaller than a tile
             */
            SandboxParams.k_pumpRadius = 2.0 - 0.05;
            SandboxParams.k_playfieldLeftEdge = -20;
            SandboxParams.k_playfieldRightEdge = 20;
            SandboxParams.k_playfieldBottomEdge = 40;
            /**
             * The world size in the TILE
             */
            SandboxParams.k_tileWidth = 10;
            SandboxParams.k_tileHeight = 11;
            /**
             * Particles/second
             */
            SandboxParams.k_defaultEmitterRate = 30;
            /**
             * Fit cleanly inside one block
             */
            SandboxParams.k_defaultEmitterSize = 3;
            /**
             * How fast particles coming out of the particles should drop
             */
            SandboxParams.k_particleExitSpeedY = -9.8;
            /**
             * How hard the pumps can push
             */
            SandboxParams.k_pumpForce = 600;
            /**
             * Number of *special* particles.
             */
            SandboxParams.k_numberOfSpecialParticles = 256;
            /**
             * Class which tracks a set of particles and applies a special
             * effect to them.
             */
            SpecialParticleTracker = class SpecialParticleTracker extends box2d.b2DestructionListener {
                /**
                 * Register this class as a destruction listener so that it's
                 * possible to keep track of special particles.
                 */
                constructor(world, system) {
                    super();
                    /**
                     * Set of particle handles used to track special particles.
                     */
                    this.m_particles = [];
                    /**
                     * Current offset into this.m_colorOscillationPeriod.
                     */
                    this.m_colorOscillationTime = 0.0;
                    /**
                     * Color oscillation period in seconds.
                     */
                    this.m_colorOscillationPeriod = 2.0;
                    // DEBUG: box2d.b2Assert(world !== null);
                    // DEBUG: box2d.b2Assert(system !== null);
                    this.m_world = world;
                    this.m_particleSystem = system;
                    this.m_world.SetDestructionListener(this);
                }
                __dtor__() {
                    this.m_world.SetDestructionListener(null);
                }
                /**
                 * Add as many of the specified particles to the set of special
                 * particles.
                 */
                Add(particleIndices, numberOfParticles) {
                    // DEBUG: box2d.b2Assert(this.m_particleSystem !== null);
                    for (let i = 0; i < numberOfParticles && this.m_particles.length < SandboxParams.k_numberOfSpecialParticles; ++i) {
                        const particleIndex = particleIndices[i];
                        this.m_particleSystem.SetParticleFlags(particleIndex, this.m_particleSystem.GetFlagsBuffer()[particleIndex] | box2d.b2ParticleFlag.b2_destructionListenerParticle);
                        this.m_particles.push(this.m_particleSystem.GetParticleHandleFromIndex(particleIndex));
                    }
                }
                /**
                 * Apply effects to special particles.
                 */
                Step(dt) {
                    function fmod(a, b) {
                        return (a - (Math.floor(a / b) * b));
                    }
                    // Oscillate the shade of color over this.m_colorOscillationPeriod seconds.
                    this.m_colorOscillationTime = fmod(this.m_colorOscillationTime + dt, this.m_colorOscillationPeriod);
                    const colorCoeff = 2.0 * Math.abs((this.m_colorOscillationTime / this.m_colorOscillationPeriod) - 0.5);
                    const color = new box2d.b2Color().SetByteRGBA(128 + (128.0 * (1.0 - colorCoeff)), 128 + (256.0 * Math.abs(0.5 - colorCoeff)), 128 + (128.0 * colorCoeff), 255);
                    // Update the color of all special particles.
                    for (let i = 0; i < this.m_particles.length; ++i) {
                        this.m_particleSystem.GetColorBuffer()[this.m_particles[i].GetIndex()].Copy(color);
                    }
                }
                SayGoodbyeJoint(joint) { }
                SayGoodbyeFixture(fixture) { }
                SayGoodbyeParticleGroup(group) { }
                /**
                 * When a particle is about to be destroyed, remove it from the
                 * list of special particles as the handle will become invalid.
                 */
                SayGoodbyeParticle(particleSystem, index) {
                    if (particleSystem !== this.m_particleSystem) {
                        return;
                    }
                    // NOTE: user data could be used as an alternative method to look up
                    // the local handle pointer from the index.
                    // DEBUG: const length = this.m_particles.length;
                    this.m_particles = this.m_particles.filter((value) => {
                        return value.GetIndex() !== index;
                    });
                    // DEBUG: box2d.b2Assert((length - this.m_particles.length) === 1);
                }
            };
            exports_1("SpecialParticleTracker", SpecialParticleTracker);
            /**
             * Sandbox test creates a maze of faucets, pumps, ramps,
             * circles, and blocks based on a string constant.  Please
             * modify and play with this string to make new mazes, and also
             * add new maze elements!
             */
            Sandbox = class Sandbox extends testbed.Test {
                constructor() {
                    super();
                    /**
                     * Count of faucets in the world
                     */
                    this.m_faucetEmitterIndex = 0;
                    /**
                     * Count of pumps in the world
                     */
                    this.m_pumpIndex = 0;
                    /**
                     * How long have we been pushing the pumps?
                     */
                    this.m_pumpTimer = 0.0;
                    /**
                     * Particle creation flags
                     */
                    this.m_particleFlags = 0;
                    /**
                     * Pump force
                     */
                    this.m_pumpForce = new box2d.b2Vec2();
                    /**
                     * Pumps and emitters
                     */
                    this.m_pumps = [];
                    this.m_emitters = [];
                    // We need some ground for the pumps to slide against
                    const bd = new box2d.b2BodyDef();
                    const ground = this.m_world.CreateBody(bd);
                    // Reset our pointers
                    for (let i = 0; i < SandboxParams.k_maxEmitters; i++) {
                        this.m_emitters[i] = null;
                    }
                    for (let i = 0; i < SandboxParams.k_maxPumps; i++) {
                        this.m_pumps[i] = null;
                    }
                    this.m_world.SetGravity(new box2d.b2Vec2(0.0, -20));
                    // Create physical box, no top
                    {
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-40, -10),
                                new box2d.b2Vec2(40, -10),
                                new box2d.b2Vec2(40, 0),
                                new box2d.b2Vec2(-40, 0),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(SandboxParams.k_playfieldLeftEdge - 20, -1),
                                new box2d.b2Vec2(SandboxParams.k_playfieldLeftEdge, -1),
                                new box2d.b2Vec2(SandboxParams.k_playfieldLeftEdge, 50),
                                new box2d.b2Vec2(SandboxParams.k_playfieldLeftEdge - 20, 50),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(SandboxParams.k_playfieldRightEdge, -1),
                                new box2d.b2Vec2(SandboxParams.k_playfieldRightEdge + 20, -1),
                                new box2d.b2Vec2(SandboxParams.k_playfieldRightEdge + 20, 50),
                                new box2d.b2Vec2(SandboxParams.k_playfieldRightEdge, 50),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(0.25);
                    this.m_specialTracker = new SpecialParticleTracker(this.m_world, this.m_particleSystem);
                    this.m_pumpTimer = 0;
                    this.SetupMaze();
                    // Create killfield shape and transform
                    this.m_killFieldShape = new box2d.b2PolygonShape();
                    this.m_killFieldShape.SetAsBox(SandboxParams.k_playfieldRightEdge - SandboxParams.k_playfieldLeftEdge, 1);
                    // Put this at the bottom of the world
                    this.m_killFieldTransform = new box2d.b2Transform();
                    const loc = new box2d.b2Vec2(-20, 1);
                    this.m_killFieldTransform.SetPositionAngle(loc, 0);
                    // Setup particle parameters.
                    testbed.Test.SetParticleParameters(Sandbox.k_paramDef, Sandbox.k_paramDefCount);
                    this.m_particleFlags = testbed.Test.GetParticleParameterValue();
                    testbed.Test.SetRestartOnParticleParameterChange(false);
                }
                __dtor__() {
                    // deallocate our emitters
                    for (let i = 0; i < this.m_faucetEmitterIndex; i++) {
                        ///  delete this.m_emitters[i];
                        this.m_emitters[i] = null;
                    }
                }
                // Create a maze of blocks, ramps, pumps, and faucets.
                // The maze is defined in a string; feel free to modify it.
                // Items in the maze include:
                //   # = a block
                //   / = a right-to-left ramp triangle
                //   A = a left-to-right ramp triangle (can't be \ or string formatting
                //       would be weird)
                //   r, g, b = colored faucets pointing down
                //   p = a pump block that rocks back and forth.  You can drag them
                //       yourself with your finger.
                //   C = a loose circle
                //   K = an ignored placeholder for a killfield to remove particles;
                //       entire bottom row is a killfield.
                SetupMaze() {
                    const maze = "# r#g #r##" +
                        "  /#  #  #" +
                        " ###     p" +
                        "A  #  /###" +
                        "## # /#  C" +
                        "  /# #   #" +
                        " ### # / #" +
                        " ## p /#  " +
                        " #  ####  " +
                        "A        /" +
                        "#####KK###";
                    // DEBUG: box2d.b2Assert(maze.length === SandboxParams.k_tileWidth * SandboxParams.k_tileHeight);
                    this.m_faucetEmitterIndex = 0;
                    this.m_pumpIndex = 0;
                    // Set up some standard shapes/vertices we'll use later.
                    const boxShape = new box2d.b2PolygonShape();
                    boxShape.SetAsBox(SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
                    ///  b2Vec2 triangle[3];
                    const triangle = box2d.b2Vec2.MakeArray(3);
                    triangle[0].Set(-SandboxParams.k_tileRadius, -SandboxParams.k_tileRadius);
                    triangle[1].Set(SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
                    triangle[2].Set(SandboxParams.k_tileRadius, -SandboxParams.k_tileRadius);
                    const rightTriangleShape = new box2d.b2PolygonShape();
                    rightTriangleShape.Set(triangle, 3);
                    triangle[1].Set(-SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
                    const leftTriangleShape = new box2d.b2PolygonShape();
                    leftTriangleShape.Set(triangle, 3);
                    // Make these just a touch smaller than a tile
                    const circleShape = new box2d.b2CircleShape();
                    circleShape.m_radius = SandboxParams.k_tileRadius * 0.7;
                    const red = new box2d.b2Color().SetByteRGBA(255, 128, 128, 255);
                    const green = new box2d.b2Color().SetByteRGBA(128, 255, 128, 255);
                    const blue = new box2d.b2Color().SetByteRGBA(128, 128, 255, 255);
                    this.m_pumpForce.Set(SandboxParams.k_pumpForce, 0);
                    for (let i = 0; i < SandboxParams.k_tileWidth; i++) {
                        for (let j = 0; j < SandboxParams.k_tileHeight; j++) {
                            const item = maze[j * SandboxParams.k_tileWidth + i];
                            // Calculate center of this square
                            const center = new box2d.b2Vec2(SandboxParams.k_playfieldLeftEdge + SandboxParams.k_tileRadius * 2 * i + SandboxParams.k_tileRadius, SandboxParams.k_playfieldBottomEdge - SandboxParams.k_tileRadius * 2 * j +
                                SandboxParams.k_tileRadius);
                            // Let's add some items
                            switch (item) {
                                case "#":
                                    // Block
                                    this.CreateBody(center, boxShape, box2d.b2BodyType.b2_staticBody);
                                    break;
                                case "A":
                                    // Left-to-right ramp
                                    this.CreateBody(center, leftTriangleShape, box2d.b2BodyType.b2_staticBody);
                                    break;
                                case "/":
                                    // Right-to-left ramp
                                    this.CreateBody(center, rightTriangleShape, box2d.b2BodyType.b2_staticBody);
                                    break;
                                case "C":
                                    // A circle to play with
                                    this.CreateBody(center, circleShape, box2d.b2BodyType.b2_dynamicBody);
                                    break;
                                case "p":
                                    this.AddPump(center);
                                    break;
                                case "b":
                                    // Blue emitter
                                    this.AddFaucetEmitter(center, blue);
                                    break;
                                case "r":
                                    // Red emitter
                                    this.AddFaucetEmitter(center, red);
                                    break;
                                case "g":
                                    // Green emitter
                                    this.AddFaucetEmitter(center, green);
                                    break;
                                default:
                                    // add nothing
                                    break;
                            }
                        }
                    }
                }
                CreateBody(center, shape, type) {
                    const def = new box2d.b2BodyDef();
                    def.position.Copy(center);
                    def.type = type;
                    const body = this.m_world.CreateBody(def);
                    body.CreateFixture(shape, 10.0);
                }
                // Inititalizes a pump and its prismatic joint, and adds it to the world
                AddPump(center) {
                    // Don't make too many pumps
                    // DEBUG: box2d.b2Assert(this.m_pumpIndex < SandboxParams.k_maxPumps);
                    const shape = new box2d.b2PolygonShape();
                    shape.SetAsBox(SandboxParams.k_pumpRadius, SandboxParams.k_pumpRadius);
                    const def = new box2d.b2BodyDef();
                    def.position.Copy(center);
                    def.type = box2d.b2BodyType.b2_dynamicBody;
                    def.angle = 0;
                    const body = this.m_world.CreateBody(def);
                    body.CreateFixture(shape, 5.0);
                    // Create a prismatic joint and connect to the ground, and have it
                    // slide along the x axis.
                    const prismaticJointDef = new box2d.b2PrismaticJointDef();
                    prismaticJointDef.bodyA = this.m_groundBody;
                    prismaticJointDef.bodyB = body;
                    prismaticJointDef.collideConnected = false;
                    prismaticJointDef.localAxisA.Set(1, 0);
                    prismaticJointDef.localAnchorA.Copy(center);
                    this.m_world.CreateJoint(prismaticJointDef);
                    this.m_pumps[this.m_pumpIndex] = body;
                    this.m_pumpIndex++;
                }
                // Initializes and adds a faucet emitter
                AddFaucetEmitter(center, color) {
                    // Don't make too many emitters
                    // DEBUG: box2d.b2Assert(this.m_faucetEmitterIndex < SandboxParams.k_maxPumps);
                    const startingVelocity = new box2d.b2Vec2(0, SandboxParams.k_particleExitSpeedY);
                    const emitter = new testbed.RadialEmitter();
                    emitter.SetParticleSystem(this.m_particleSystem);
                    emitter.SetPosition(center);
                    emitter.SetVelocity(startingVelocity);
                    emitter.SetSize(new box2d.b2Vec2(SandboxParams.k_defaultEmitterSize, 0.0));
                    emitter.SetEmitRate(SandboxParams.k_defaultEmitterRate);
                    emitter.SetColor(color);
                    this.m_emitters[this.m_faucetEmitterIndex] = emitter;
                    this.m_faucetEmitterIndex++;
                }
                JointDestroyed(joint) {
                    super.JointDestroyed(joint);
                }
                ParticleGroupDestroyed(group) {
                    super.ParticleGroupDestroyed(group);
                }
                BeginContact(contact) {
                    super.BeginContact(contact);
                }
                EndContact(contact) {
                    super.EndContact(contact);
                }
                PreSolve(contact, oldManifold) {
                    super.PreSolve(contact, oldManifold);
                }
                PostSolve(contact, impulse) {
                    super.PostSolve(contact, impulse);
                }
                /**
                 * Allows you to set particle flags on devices with keyboards
                 */
                Keyboard(key) {
                    super.Keyboard(key);
                    let toggle = 0;
                    switch (key) {
                        case "a":
                            this.m_particleFlags = 0;
                            break;
                        case "q":
                            toggle = box2d.b2ParticleFlag.b2_powderParticle;
                            break;
                        case "t":
                            toggle = box2d.b2ParticleFlag.b2_tensileParticle;
                            break;
                        case "v":
                            toggle = box2d.b2ParticleFlag.b2_viscousParticle;
                            break;
                        case "w":
                            toggle = box2d.b2ParticleFlag.b2_wallParticle;
                            break;
                    }
                    if (toggle) {
                        if (this.m_particleFlags & toggle) {
                            this.m_particleFlags = this.m_particleFlags & ~toggle;
                        }
                        else {
                            this.m_particleFlags = this.m_particleFlags | toggle;
                        }
                    }
                    testbed.Test.SetParticleParameterValue(this.m_particleFlags);
                }
                KeyboardUp(key) {
                    super.KeyboardUp(key);
                }
                MouseDown(p) {
                    super.MouseDown(p);
                }
                MouseUp(p) {
                    super.MouseUp(p);
                }
                MouseMove(p) {
                    super.MouseMove(p);
                }
                /**
                 * Per-frame step updater overridden from Test
                 */
                Step(settings) {
                    let dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
                    if (settings.pause && !settings.singleStep) {
                        dt = 0.0;
                    }
                    super.Step(settings);
                    this.m_particleFlags = testbed.Test.GetParticleParameterValue();
                    // Step all the emitters
                    for (let i = 0; i < this.m_faucetEmitterIndex; i++) {
                        const particleIndices = [];
                        const emitter = this.m_emitters[i];
                        if (emitter) {
                            emitter.SetParticleFlags(this.m_particleFlags);
                            const particlesCreated = emitter.Step(dt, particleIndices, SandboxParams.k_numberOfSpecialParticles);
                            this.m_specialTracker.Add(particleIndices, particlesCreated);
                        }
                    }
                    // Step the special tracker.
                    this.m_specialTracker.Step(dt);
                    // Do killfield work--kill every particle near the bottom of the screen
                    this.m_particleSystem.DestroyParticlesInShape(this.m_killFieldShape, this.m_killFieldTransform);
                    // Move the pumps
                    for (let i = 0; i < this.m_pumpIndex; i++) {
                        const pump = this.m_pumps[i];
                        if (pump) {
                            // Pumps can and will clog up if the pile of particles they're
                            // trying to push is too heavy. Increase k_pumpForce to make
                            // stronger pumps.
                            pump.ApplyForceToCenter(this.m_pumpForce, true);
                        }
                        this.m_pumpTimer += dt;
                        // Reset pump to go back right again
                        if (this.m_pumpTimer > SandboxParams.k_flipTime) {
                            this.m_pumpTimer -= SandboxParams.k_flipTime;
                            this.m_pumpForce.x *= -1;
                        }
                    }
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (a) zero out (water), (q) powder");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "      (t) tensile, (v) viscous");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                GetDefaultViewZoom() {
                    return super.GetDefaultViewZoom();
                }
                static Create() {
                    return new Sandbox();
                }
            };
            exports_1("Sandbox", Sandbox);
            Sandbox.k_paramValues = [
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions, "water"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions | testbed.ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "powder"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_viscousParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile powder"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous powder"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous tensile powder"),
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile viscous water"),
            ];
            Sandbox.k_paramDef = [
                new testbed.ParticleParameterDefinition(Sandbox.k_paramValues),
            ];
            Sandbox.k_paramDefCount = Sandbox.k_paramDef.length;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2FuZGJveC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlNhbmRib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9ILE1BQU07WUFDTixrRUFBa0U7WUFDbEUsbUVBQW1FO1lBQ25FLGlDQUFpQztZQUNqQyxNQUFNO1lBQ04sc0JBQXNCO1lBQ3RCLGdCQUFBLE1BQWEsYUFBYTthQTBEekIsQ0FBQTs7WUF6REM7O2VBRUc7WUFDb0Isd0JBQVUsR0FBVyxDQUFDLENBQUM7WUFDOUM7O2VBRUc7WUFDb0IsMkJBQWEsR0FBVyxDQUFDLENBQUM7WUFDakQ7OztlQUdHO1lBQ29CLHdCQUFVLEdBQVcsQ0FBQyxDQUFDO1lBQzlDOztlQUVHO1lBQ29CLDBCQUFZLEdBQVcsQ0FBQyxDQUFDO1lBQ2hEOztlQUVHO1lBQ29CLDRCQUFjLEdBQVcsQ0FBQyxDQUFDO1lBQ2xEOztlQUVHO1lBQ29CLDBCQUFZLEdBQVcsR0FBRyxHQUFHLElBQUksQ0FBQztZQUVsQyxpQ0FBbUIsR0FBVyxDQUFDLEVBQUUsQ0FBQztZQUNsQyxrQ0FBb0IsR0FBVyxFQUFFLENBQUM7WUFDbEMsbUNBQXFCLEdBQVcsRUFBRSxDQUFDO1lBRTFEOztlQUVHO1lBQ29CLHlCQUFXLEdBQVcsRUFBRSxDQUFDO1lBQ3pCLDBCQUFZLEdBQVcsRUFBRSxDQUFDO1lBRWpEOztlQUVHO1lBQ29CLGtDQUFvQixHQUFXLEVBQUUsQ0FBQztZQUN6RDs7ZUFFRztZQUNvQixrQ0FBb0IsR0FBVyxDQUFDLENBQUM7WUFDeEQ7O2VBRUc7WUFDb0Isa0NBQW9CLEdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDM0Q7O2VBRUc7WUFDb0IseUJBQVcsR0FBVyxHQUFHLENBQUM7WUFFakQ7O2VBRUc7WUFDb0Isd0NBQTBCLEdBQVcsR0FBRyxDQUFDO1lBR2xFOzs7ZUFHRztZQUNILHlCQUFBLE1BQWEsc0JBQXVCLFNBQVEsS0FBSyxDQUFDLHFC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