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
System.register(["../../Box2D/Box2D", "../Testbed"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, testbed, SandboxParams, SpecialParticleTracker, Sandbox;
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
                constructor() {
                    super(...arguments);
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
                }
                /**
                 * @return {void}
                 */
                __dtor__() {
                    this.m_world.SetDestructionListener(null);
                }
                /**
                 * Register this class as a destruction listener so that it's
                 * possible to keep track of special particles.
                 */
                Init(world, system) {
                    box2d.b2Assert(world !== null);
                    box2d.b2Assert(system !== null);
                    this.m_world = world;
                    this.m_particleSystem = system;
                    this.m_world.SetDestructionListener(this);
                }
                /**
                 * Add as many of the specified particles to the set of special
                 * particles.
                 */
                Add(particleIndices, numberOfParticles) {
                    box2d.b2Assert(this.m_particleSystem !== null);
                    for (let i = 0; i < numberOfParticles && this.m_particles.length < SandboxParams.k_numberOfSpecialParticles; ++i) {
                        const particleIndex = particleIndices[i];
                        this.m_particleSystem.SetParticleFlags(particleIndex, this.m_particleSystem.GetFlagsBuffer()[particleIndex] | box2d.b2ParticleFlag.b2_destructionListenerParticle);
                        this.m_particles.push(this.m_particleSystem.GetParticleHandleFromIndex(particleIndex));
                    }
                }
                /**
                 * Apply effects to special particles.
                 * @return {void}
                 * @param {number} dt
                 */
                Step(dt) {
                    function fmod(a, b) {
                        return (a - (Math.floor(a / b) * b));
                    }
                    // Oscillate the shade of color over this.m_colorOscillationPeriod seconds.
                    this.m_colorOscillationTime = fmod(this.m_colorOscillationTime + dt, this.m_colorOscillationPeriod);
                    const colorCoeff = 2.0 * Math.abs((this.m_colorOscillationTime / this.m_colorOscillationPeriod) - 0.5);
                    const color = new box2d.b2Color((128 + (128.0 * (1.0 - colorCoeff)) / 255), (128 + (256.0 * Math.abs(0.5 - colorCoeff)) / 255), (128 + (128.0 * colorCoeff)) / 255, 255 / 255);
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
                    if (particleSystem !== this.m_particleSystem)
                        return;
                    // NOTE: user data could be used as an alternative method to look up
                    // the local handle pointer from the index.
                    const length = this.m_particles.length;
                    this.m_particles = this.m_particles.filter(function (value) {
                        return value.GetIndex() !== index;
                    });
                    box2d.b2Assert((length - this.m_particles.length) === 1);
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
                    // We need some ground for the pumps to slide against
                    const bd = new box2d.b2BodyDef();
                    const ground = this.m_world.CreateBody(bd);
                    // Reset our pointers
                    this.m_emitters = [];
                    for (let i = 0; i < SandboxParams.k_maxEmitters; i++) {
                        this.m_emitters[i] = null;
                    }
                    this.m_pumps = [];
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
                                new box2d.b2Vec2(-40, 0)
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
                                new box2d.b2Vec2(SandboxParams.k_playfieldLeftEdge - 20, 50)
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
                                new box2d.b2Vec2(SandboxParams.k_playfieldRightEdge, 50)
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_particleSystem.SetRadius(0.25);
                    this.m_specialTracker = new SpecialParticleTracker();
                    this.m_specialTracker.Init(this.m_world, this.m_particleSystem);
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
                    testbed.Main.SetParticleParameters(Sandbox.k_paramDef, Sandbox.k_paramDefCount);
                    this.m_particleFlags = testbed.Main.GetParticleParameterValue();
                    testbed.Main.SetRestartOnParticleParameterChange(false);
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
                    box2d.b2Assert(maze.length == SandboxParams.k_tileWidth * SandboxParams.k_tileHeight);
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
                    const red = new box2d.b2Color(255 / 255, 128 / 255, 128 / 255, 255 / 255);
                    const green = new box2d.b2Color(128 / 255, 255 / 255, 128 / 255, 255 / 255);
                    const blue = new box2d.b2Color(128 / 255, 128 / 255, 255 / 255, 255 / 255);
                    this.m_pumpForce = new box2d.b2Vec2(SandboxParams.k_pumpForce, 0);
                    for (let i = 0; i < SandboxParams.k_tileWidth; i++) {
                        for (let j = 0; j < SandboxParams.k_tileHeight; j++) {
                            const item = maze[j * SandboxParams.k_tileWidth + i];
                            // Calculate center of this square
                            const center = new box2d.b2Vec2(SandboxParams.k_playfieldLeftEdge + SandboxParams.k_tileRadius * 2 * i + SandboxParams.k_tileRadius, SandboxParams.k_playfieldBottomEdge - SandboxParams.k_tileRadius * 2 * j +
                                SandboxParams.k_tileRadius);
                            // Let's add some items
                            switch (item) {
                                case '#':
                                    // Block
                                    this.CreateBody(center, boxShape, box2d.b2BodyType.b2_staticBody);
                                    break;
                                case 'A':
                                    // Left-to-right ramp
                                    this.CreateBody(center, leftTriangleShape, box2d.b2BodyType.b2_staticBody);
                                    break;
                                case '/':
                                    // Right-to-left ramp
                                    this.CreateBody(center, rightTriangleShape, box2d.b2BodyType.b2_staticBody);
                                    break;
                                case 'C':
                                    // A circle to play with
                                    this.CreateBody(center, circleShape, box2d.b2BodyType.b2_dynamicBody);
                                    break;
                                case 'p':
                                    this.AddPump(center);
                                    break;
                                case 'b':
                                    // Blue emitter
                                    this.AddFaucetEmitter(center, blue);
                                    break;
                                case 'r':
                                    // Red emitter
                                    this.AddFaucetEmitter(center, red);
                                    break;
                                case 'g':
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
                    box2d.b2Assert(this.m_pumpIndex < SandboxParams.k_maxPumps);
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
                    box2d.b2Assert(this.m_faucetEmitterIndex < SandboxParams.k_maxPumps);
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
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Contact} contact
                 * @param {box2d.b2Manifold} oldManifold
                 */
                PreSolve(contact, oldManifold) {
                    super.PreSolve(contact, oldManifold);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Contact} contact
                 * @param {box2d.b2ContactImpulse} impulse
                 */
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
                    testbed.Main.SetParticleParameterValue(this.m_particleFlags);
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
                    super.Step(settings);
                    this.m_particleFlags = testbed.Main.GetParticleParameterValue();
                    const dt = 1.0 / settings.hz;
                    // Step all the emitters
                    for (let i = 0; i < this.m_faucetEmitterIndex; i++) {
                        const particleIndices = [];
                        const emitter = this.m_emitters[i];
                        emitter.SetParticleFlags(this.m_particleFlags);
                        const particlesCreated = emitter.Step(dt, particleIndices, SandboxParams.k_numberOfSpecialParticles);
                        this.m_specialTracker.Add(particleIndices, particlesCreated);
                    }
                    // Step the special tracker.
                    this.m_specialTracker.Step(dt);
                    // Do killfield work--kill every particle near the bottom of the screen
                    this.m_particleSystem.DestroyParticlesInShape(this.m_killFieldShape, this.m_killFieldTransform);
                    // Move the pumps
                    for (let i = 0; i < this.m_pumpIndex; i++) {
                        const pump = this.m_pumps[i];
                        // Pumps can and will clog up if the pile of particles they're
                        // trying to push is too heavy. Increase k_pumpForce to make
                        // stronger pumps.
                        pump.ApplyForceToCenter(this.m_pumpForce, true);
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
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_tensileParticle, testbed.ParticleParameter.k_DefaultOptions, "tensile viscous water")
            ];
            Sandbox.k_paramDef = [
                new testbed.ParticleParameter.Definition(Sandbox.k_paramValues)
            ];
            Sandbox.k_paramDefCount = Sandbox.k_paramDef.length;
            exports_1("Sandbox", Sandbox);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2FuZGJveC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlNhbmRib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9ILE1BQU07WUFDTixrRUFBa0U7WUFDbEUsbUVBQW1FO1lBQ25FLGlDQUFpQztZQUNqQyxNQUFNO1lBQ04sc0JBQXNCO1lBQ3RCLGdCQUFBO2FBMERDLENBQUE7WUF6REM7O2VBRUc7WUFDYSx3QkFBVSxHQUFXLENBQUMsQ0FBQztZQUN2Qzs7ZUFFRztZQUNhLDJCQUFhLEdBQVcsQ0FBQyxDQUFDO1lBQzFDOzs7ZUFHRztZQUNhLHdCQUFVLEdBQVcsQ0FBQyxDQUFDO1lBQ3ZDOztlQUVHO1lBQ2EsMEJBQVksR0FBVyxDQUFDLENBQUM7WUFDekM7O2VBRUc7WUFDYSw0QkFBYyxHQUFXLENBQUMsQ0FBQztZQUMzQzs7ZUFFRztZQUNhLDBCQUFZLEdBQVcsR0FBRyxHQUFHLElBQUksQ0FBQztZQUVsQyxpQ0FBbUIsR0FBVyxDQUFDLEVBQUUsQ0FBQztZQUNsQyxrQ0FBb0IsR0FBVyxFQUFFLENBQUM7WUFDbEMsbUNBQXFCLEdBQVcsRUFBRSxDQUFDO1lBRW5EOztlQUVHO1lBQ2EseUJBQVcsR0FBVyxFQUFFLENBQUM7WUFDekIsMEJBQVksR0FBVyxFQUFFLENBQUM7WUFFMUM7O2VBRUc7WUFDYSxrQ0FBb0IsR0FBVyxFQUFFLENBQUM7WUFDbEQ7O2VBRUc7WUFDYSxrQ0FBb0IsR0FBVyxDQUFDLENBQUM7WUFDakQ7O2VBRUc7WUFDYSxrQ0FBb0IsR0FBVyxDQUFDLEdBQUcsQ0FBQztZQUNwRDs7ZUFFRztZQUNhLHlCQUFXLEdBQVcsR0FBRyxDQUFDO1lBRTFDOztlQUVHO1lBQ2Esd0NBQTBCLEdBQVcsR0FBRyxDQUFDOztZQUkzRDs7O2VBR0c7WUFDSCx5QkFBQSw0QkFBb0MsU0FBUSxLQUFLLENBQUMscUJBQXFCO2dCQUF2RTs7b0JBQ0U7O3VCQUVHO29C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