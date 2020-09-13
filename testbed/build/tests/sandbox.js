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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, SandboxParams, SpecialParticleTracker, Sandbox;
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
            SpecialParticleTracker = class SpecialParticleTracker extends b2.DestructionListener {
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
                    // DEBUG: b2.Assert(world !== null);
                    // DEBUG: b2.Assert(system !== null);
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
                    // DEBUG: b2.Assert(this.m_particleSystem !== null);
                    for (let i = 0; i < numberOfParticles && this.m_particles.length < SandboxParams.k_numberOfSpecialParticles; ++i) {
                        const particleIndex = particleIndices[i];
                        this.m_particleSystem.SetParticleFlags(particleIndex, this.m_particleSystem.GetFlagsBuffer()[particleIndex] | b2.ParticleFlag.b2_destructionListenerParticle);
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
                    const color = new b2.Color().SetByteRGBA(128 + (128.0 * (1.0 - colorCoeff)), 128 + (256.0 * Math.abs(0.5 - colorCoeff)), 128 + (128.0 * colorCoeff), 255);
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
                    // DEBUG: b2.Assert((length - this.m_particles.length) === 1);
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
                    this.m_pumpForce = new b2.Vec2();
                    /**
                     * Pumps and emitters
                     */
                    this.m_pumps = [];
                    this.m_emitters = [];
                    // We need some ground for the pumps to slide against
                    const bd = new b2.BodyDef();
                    const ground = this.m_world.CreateBody(bd);
                    // Reset our pointers
                    for (let i = 0; i < SandboxParams.k_maxEmitters; i++) {
                        this.m_emitters[i] = null;
                    }
                    for (let i = 0; i < SandboxParams.k_maxPumps; i++) {
                        this.m_pumps[i] = null;
                    }
                    this.m_world.SetGravity(new b2.Vec2(0.0, -20));
                    // Create physical box, no top
                    {
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-40, -10),
                                new b2.Vec2(40, -10),
                                new b2.Vec2(40, 0),
                                new b2.Vec2(-40, 0),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(SandboxParams.k_playfieldLeftEdge - 20, -1),
                                new b2.Vec2(SandboxParams.k_playfieldLeftEdge, -1),
                                new b2.Vec2(SandboxParams.k_playfieldLeftEdge, 50),
                                new b2.Vec2(SandboxParams.k_playfieldLeftEdge - 20, 50),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(SandboxParams.k_playfieldRightEdge, -1),
                                new b2.Vec2(SandboxParams.k_playfieldRightEdge + 20, -1),
                                new b2.Vec2(SandboxParams.k_playfieldRightEdge + 20, 50),
                                new b2.Vec2(SandboxParams.k_playfieldRightEdge, 50),
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
                    this.m_killFieldShape = new b2.PolygonShape();
                    this.m_killFieldShape.SetAsBox(SandboxParams.k_playfieldRightEdge - SandboxParams.k_playfieldLeftEdge, 1);
                    // Put this at the bottom of the world
                    this.m_killFieldTransform = new b2.Transform();
                    const loc = new b2.Vec2(-20, 1);
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
                    // DEBUG: b2.Assert(maze.length === SandboxParams.k_tileWidth * SandboxParams.k_tileHeight);
                    this.m_faucetEmitterIndex = 0;
                    this.m_pumpIndex = 0;
                    // Set up some standard shapes/vertices we'll use later.
                    const boxShape = new b2.PolygonShape();
                    boxShape.SetAsBox(SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
                    ///  b2Vec2 triangle[3];
                    const triangle = b2.Vec2.MakeArray(3);
                    triangle[0].Set(-SandboxParams.k_tileRadius, -SandboxParams.k_tileRadius);
                    triangle[1].Set(SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
                    triangle[2].Set(SandboxParams.k_tileRadius, -SandboxParams.k_tileRadius);
                    const rightTriangleShape = new b2.PolygonShape();
                    rightTriangleShape.Set(triangle, 3);
                    triangle[1].Set(-SandboxParams.k_tileRadius, SandboxParams.k_tileRadius);
                    const leftTriangleShape = new b2.PolygonShape();
                    leftTriangleShape.Set(triangle, 3);
                    // Make these just a touch smaller than a tile
                    const circleShape = new b2.CircleShape();
                    circleShape.m_radius = SandboxParams.k_tileRadius * 0.7;
                    const red = new b2.Color().SetByteRGBA(255, 128, 128, 255);
                    const green = new b2.Color().SetByteRGBA(128, 255, 128, 255);
                    const blue = new b2.Color().SetByteRGBA(128, 128, 255, 255);
                    this.m_pumpForce.Set(SandboxParams.k_pumpForce, 0);
                    for (let i = 0; i < SandboxParams.k_tileWidth; i++) {
                        for (let j = 0; j < SandboxParams.k_tileHeight; j++) {
                            const item = maze[j * SandboxParams.k_tileWidth + i];
                            // Calculate center of this square
                            const center = new b2.Vec2(SandboxParams.k_playfieldLeftEdge + SandboxParams.k_tileRadius * 2 * i + SandboxParams.k_tileRadius, SandboxParams.k_playfieldBottomEdge - SandboxParams.k_tileRadius * 2 * j +
                                SandboxParams.k_tileRadius);
                            // Let's add some items
                            switch (item) {
                                case "#":
                                    // Block
                                    this.CreateBody(center, boxShape, b2.BodyType.b2_staticBody);
                                    break;
                                case "A":
                                    // Left-to-right ramp
                                    this.CreateBody(center, leftTriangleShape, b2.BodyType.b2_staticBody);
                                    break;
                                case "/":
                                    // Right-to-left ramp
                                    this.CreateBody(center, rightTriangleShape, b2.BodyType.b2_staticBody);
                                    break;
                                case "C":
                                    // A circle to play with
                                    this.CreateBody(center, circleShape, b2.BodyType.b2_dynamicBody);
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
                    const def = new b2.BodyDef();
                    def.position.Copy(center);
                    def.type = type;
                    const body = this.m_world.CreateBody(def);
                    body.CreateFixture(shape, 10.0);
                }
                // Inititalizes a pump and its prismatic joint, and adds it to the world
                AddPump(center) {
                    // Don't make too many pumps
                    // DEBUG: b2.Assert(this.m_pumpIndex < SandboxParams.k_maxPumps);
                    const shape = new b2.PolygonShape();
                    shape.SetAsBox(SandboxParams.k_pumpRadius, SandboxParams.k_pumpRadius);
                    const def = new b2.BodyDef();
                    def.position.Copy(center);
                    def.type = b2.BodyType.b2_dynamicBody;
                    def.angle = 0;
                    const body = this.m_world.CreateBody(def);
                    body.CreateFixture(shape, 5.0);
                    // Create a prismatic joint and connect to the ground, and have it
                    // slide along the x axis.
                    const prismaticJointDef = new b2.PrismaticJointDef();
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
                    // DEBUG: b2.Assert(this.m_faucetEmitterIndex < SandboxParams.k_maxPumps);
                    const startingVelocity = new b2.Vec2(0, SandboxParams.k_particleExitSpeedY);
                    const emitter = new testbed.RadialEmitter();
                    emitter.SetParticleSystem(this.m_particleSystem);
                    emitter.SetPosition(center);
                    emitter.SetVelocity(startingVelocity);
                    emitter.SetSize(new b2.Vec2(SandboxParams.k_defaultEmitterSize, 0.0));
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
                            toggle = b2.ParticleFlag.b2_powderParticle;
                            break;
                        case "t":
                            toggle = b2.ParticleFlag.b2_tensileParticle;
                            break;
                        case "v":
                            toggle = b2.ParticleFlag.b2_viscousParticle;
                            break;
                        case "w":
                            toggle = b2.ParticleFlag.b2_wallParticle;
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
                    let dt = settings.m_hertz > 0.0 ? 1.0 / settings.m_hertz : 0.0;
                    if (settings.m_pause && !settings.m_singleStep) {
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
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions, "water"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions | testbed.ParticleParameterOptions.OptionStrictContacts, "water (strict)"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "powder"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_viscousParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_tensileParticle | b2.ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile powder"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_viscousParticle | b2.ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous powder"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_viscousParticle | b2.ParticleFlag.b2_tensileParticle | b2.ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous tensile powder"),
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_viscousParticle | b2.ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile viscous water"),
            ];
            Sandbox.k_paramDef = [
                new testbed.ParticleParameterDefinition(Sandbox.k_paramValues),
            ];
            Sandbox.k_paramDefCount = Sandbox.k_paramDef.length;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuZGJveC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL3NhbmRib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9ILE1BQU07WUFDTixrRUFBa0U7WUFDbEUsbUVBQW1FO1lBQ25FLGlDQUFpQztZQUNqQyxNQUFNO1lBQ04sc0JBQXNCO1lBQ3RCLGdCQUFBLE1BQWEsYUFBYTthQTBEekIsQ0FBQTs7WUF6REM7O2VBRUc7WUFDb0Isd0JBQVUsR0FBVyxDQUFDLENBQUM7WUFDOUM7O2VBRUc7WUFDb0IsMkJBQWEsR0FBVyxDQUFDLENBQUM7WUFDakQ7OztlQUdHO1lBQ29CLHdCQUFVLEdBQVcsQ0FBQyxDQUFDO1lBQzlDOztlQUVHO1lBQ29CLDBCQUFZLEdBQVcsQ0FBQyxDQUFDO1lBQ2hEOztlQUVHO1lBQ29CLDRCQUFjLEdBQVcsQ0FBQyxDQUFDO1lBQ2xEOztlQUVHO1lBQ29CLDBCQUFZLEdBQVcsR0FBRyxHQUFHLElBQUksQ0FBQztZQUVsQyxpQ0FBbUIsR0FBVyxDQUFDLEVBQUUsQ0FBQztZQUNsQyxrQ0FBb0IsR0FBVyxFQUFFLENBQUM7WUFDbEMsbUNBQXFCLEdBQVcsRUFBRSxDQUFDO1lBRTFEOztlQUVHO1lBQ29CLHlCQUFXLEdBQVcsRUFBRSxDQUFDO1lBQ3pCLDBCQUFZLEdBQVcsRUFBRSxDQUFDO1lBRWpEOztlQUVHO1lBQ29CLGtDQUFvQixHQUFXLEVBQUUsQ0FBQztZQUN6RDs7ZUFFRztZQUNvQixrQ0FBb0IsR0FBVyxDQUFDLENBQUM7WUFDeEQ7O2VBRUc7WUFDb0Isa0NBQW9CLEdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDM0Q7O2VBRUc7WUFDb0IseUJBQVcsR0FBVyxHQUFHLENBQUM7WUFFakQ7O2VBRUc7WUFDb0Isd0NBQTBCLEdBQVcsR0FBRyxDQUFDO1lBR2xFOzs7ZUFHRztZQUNILHlCQUFBLE1BQWEsc0JBQXVCLFNBQVEs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