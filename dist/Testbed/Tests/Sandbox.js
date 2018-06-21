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
            exports_1("SandboxParams", SandboxParams);
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
            Sandbox.k_paramValues = [
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions, "water"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, testbed.ParticleParameter.k_DefaultOptions | testbed.ParticleParameter.Options.OptionStrictContacts, "water (strict)"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "powder"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile powder"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous powder"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_powderParticle, testbed.ParticleParameter.k_DefaultOptions, "viscous tensile powder"),
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile viscous water"),
            ];
            Sandbox.k_paramDef = [
                new testbed.ParticleParameter.Definition(Sandbox.k_paramValues),
            ];
            Sandbox.k_paramDefCount = Sandbox.k_paramDef.length;
            exports_1("Sandbox", Sandbox);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2FuZGJveC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvU2FuZGJveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsTUFBTTtZQUNOLGtFQUFrRTtZQUNsRSxtRUFBbUU7WUFDbkUsaUNBQWlDO1lBQ2pDLE1BQU07WUFDTixzQkFBc0I7WUFDdEIsZ0JBQUE7YUEwREMsQ0FBQTtZQXpEQzs7ZUFFRztZQUNvQix3QkFBVSxHQUFXLENBQUMsQ0FBQztZQUM5Qzs7ZUFFRztZQUNvQiwyQkFBYSxHQUFXLENBQUMsQ0FBQztZQUNqRDs7O2VBR0c7WUFDb0Isd0JBQVUsR0FBVyxDQUFDLENBQUM7WUFDOUM7O2VBRUc7WUFDb0IsMEJBQVksR0FBVyxDQUFDLENBQUM7WUFDaEQ7O2VBRUc7WUFDb0IsNEJBQWMsR0FBVyxDQUFDLENBQUM7WUFDbEQ7O2VBRUc7WUFDb0IsMEJBQVksR0FBVyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBRWxDLGlDQUFtQixHQUFXLENBQUMsRUFBRSxDQUFDO1lBQ2xDLGtDQUFvQixHQUFXLEVBQUUsQ0FBQztZQUNsQyxtQ0FBcUIsR0FBVyxFQUFFLENBQUM7WUFFMUQ7O2VBRUc7WUFDb0IseUJBQVcsR0FBVyxFQUFFLENBQUM7WUFDekIsMEJBQVksR0FBVyxFQUFFLENBQUM7WUFFakQ7O2VBRUc7WUFDb0Isa0NBQW9CLEdBQVcsRUFBRSxDQUFDO1lBQ3pEOztlQUVHO1lBQ29CLGtDQUFvQixHQUFXLENBQUMsQ0FBQztZQUN4RDs7ZUFFRztZQUNvQixrQ0FBb0IsR0FBVyxDQUFDLEdBQUcsQ0FBQztZQUMzRDs7ZUFFRztZQUNvQix5QkFBVyxHQUFXLEdBQUcsQ0FBQztZQUVqRDs7ZUFFRztZQUNvQix3Q0FBMEIsR0FBVyxHQUFHLENBQUM7O1lBR2xFOzs7ZUFHRztZQUNILHlCQUFBLDRCQUFvQyxTQUFRLEtBQUss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