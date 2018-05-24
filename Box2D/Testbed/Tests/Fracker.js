/*
 * Copyright (c) 2014 Google, Inc
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
    var box2d, testbed, EmitterTracker, ParticleGroupTracker, FrackerSettings, Fracker;
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
            /**
             * Tracks instances of RadialEmitter and destroys them after a
             * specified period of time.
             */
            EmitterTracker = class EmitterTracker {
                constructor() {
                    this.m_emitterLifetime = [];
                }
                /**
                 * Delete all emitters.
                 */
                __dtor__() {
                    ///  for (std.map<RadialEmitter*, float32>.const_iterator it = m_emitterLifetime.begin(); it !== m_emitterLifetime.end(); ++it)
                    for (var it = 0; it < this.m_emitterLifetime.length; ++it) {
                        ///  delete it.first;
                        this.m_emitterLifetime[it].emitter.__dtor__();
                    }
                }
                /**
                 * Add an emitter to the tracker.
                 * This assumes emitter was allocated using "new" and ownership
                 * of the object is handed to this class.
                 * @return {void}
                 * @param {testbed.RadialEmitter} emitter
                 * @param {number} lifetime
                 */
                Add(emitter, lifetime) {
                    ///  m_emitterLifetime[emitter] = lifetime;
                    this.m_emitterLifetime.push({
                        emitter: emitter,
                        lifetime: lifetime
                    });
                }
                /**
                 * Update all emitters destroying those who are too old.
                 * @return {void}
                 * @param {number} dt
                 */
                Step(dt) {
                    ///  std.vector<RadialEmitter*> emittersToDestroy;
                    var emittersToDestroy = [];
                    ///  for (std.map<RadialEmitter*, float32>.const_iterator it = m_emitterLifetime.begin(); it !== m_emitterLifetime.end(); ++it)
                    for (var it = 0; it < this.m_emitterLifetime.length; ++it) {
                        ///  RadialEmitter * const emitter = it.first;
                        var emitter = this.m_emitterLifetime[it].emitter;
                        ///  const float32 lifetime = it.second - dt;
                        var lifetime = this.m_emitterLifetime[it].lifetime - dt;
                        if (lifetime <= 0.0) {
                            emittersToDestroy.push(emitter);
                        }
                        ///  m_emitterLifetime[emitter] = lifetime;
                        this.m_emitterLifetime[it].lifetime = lifetime;
                        emitter.Step(dt);
                    }
                    ///  for (std.vector<RadialEmitter*>.const_iterator it = emittersToDestroy.begin(); it !== emittersToDestroy.end(); ++it)
                    for (var it = 0; it < emittersToDestroy.length; ++it) {
                        ///  RadialEmitter *emitter = *it;
                        var emitter = emittersToDestroy[it];
                        /// delete emitter;
                        emitter.__dtor__();
                        ///  m_emitterLifetime.erase(m_emitterLifetime.find(emitter));
                        this.m_emitterLifetime = this.m_emitterLifetime.filter(function (value) {
                            return value.emitter !== emitter;
                        });
                    }
                }
            };
            exports_1("EmitterTracker", EmitterTracker);
            /**
             * Keep track of particle groups in a set, removing them when
             * they're destroyed.
             */
            ParticleGroupTracker = class ParticleGroupTracker extends box2d.b2DestructionListener {
                constructor() {
                    super(...arguments);
                    this.m_particleGroups = [];
                }
                /**
                 * Called when any particle group is about to be destroyed.
                 * @return {void}
                 * @param {box2d.b2ParticleGroup} group
                 */
                SayGoodbyeParticleGroup(group) {
                    this.RemoveParticleGroup(group);
                }
                /**
                 * Add a particle group to the tracker.
                 * @return {void}
                 * @param {box2d.b2ParticleGroup} group
                 */
                AddParticleGroup(group) {
                    this.m_particleGroups.push(group);
                }
                /**
                 * Remove a particle group from the tracker.
                 * @return {void}
                 * @param {box2d.b2ParticleGroup} group
                 */
                RemoveParticleGroup(group) {
                    this.m_particleGroups.splice(this.m_particleGroups.indexOf(group), 1);
                }
                /**
                 * @return {Array.<box2d.b2ParticleGroup>}
                 */
                GetParticleGroups() {
                    return this.m_particleGroups;
                }
            };
            exports_1("ParticleGroupTracker", ParticleGroupTracker);
            // testbed.FrackerSettings = {};
            FrackerSettings = class FrackerSettings {
            };
            /**
             * Width and height of the world in tiles.
             */
            FrackerSettings.k_worldWidthTiles = 24;
            FrackerSettings.k_worldHeightTiles = 16;
            /**
             * Total number of tiles.
             */
            FrackerSettings.k_worldTiles = FrackerSettings.k_worldWidthTiles * FrackerSettings.k_worldHeightTiles;
            /**
             * Center of the world in world coordinates.
             */
            FrackerSettings.k_worldCenterX = 0.0;
            FrackerSettings.k_worldCenterY = 2.0;
            /**
             * Size of each tile in world units.
             */
            FrackerSettings.k_tileWidth = 0.2;
            FrackerSettings.k_tileHeight = 0.2;
            /**
             * Half width and height of tiles in world units.
             */
            FrackerSettings.k_tileHalfWidth = FrackerSettings.k_tileWidth * 0.5;
            FrackerSettings.k_tileHalfHeight = FrackerSettings.k_tileHeight * 0.5;
            /**
             * Half width and height of the world in world coordinates.
             */
            FrackerSettings.k_worldHalfWidth = (FrackerSettings.k_worldWidthTiles * FrackerSettings.k_tileWidth) * 0.5;
            FrackerSettings.k_worldHalfHeight = (FrackerSettings.k_worldHeightTiles * FrackerSettings.k_tileHeight) * 0.5;
            /**
             * Colors of tiles.
             */
            FrackerSettings.k_playerColor = new box2d.b2Color(1.0, 1.0, 1.0);
            FrackerSettings.k_playerFrackColor = new box2d.b2Color(1.0, 0.5, 0.5);
            FrackerSettings.k_wellColor = new box2d.b2Color(0.5, 0.5, 0.5);
            FrackerSettings.k_oilColor = new box2d.b2Color(1.0, 0.0, 0.0);
            FrackerSettings.k_waterColor = new box2d.b2Color(0.0, 0.2, 1.0);
            FrackerSettings.k_frackingFluidColor = new box2d.b2Color(0.8, 0.4, 0.0);
            /**
             * Default density of each body.
             */
            FrackerSettings.k_density = 0.1;
            /**
             * Radius of oil / water / fracking fluid particles.
             */
            FrackerSettings.k_particleRadius = ((FrackerSettings.k_tileWidth + FrackerSettings.k_tileHeight) * 0.5) * 0.2;
            /**
             * Probability (0..100%) of generating each tile (must sum to
             * 1.0).
             */
            FrackerSettings.k_dirtProbability = 80;
            FrackerSettings.k_emptyProbability = 10;
            FrackerSettings.k_oilProbability = 7;
            FrackerSettings.k_waterProbability = 3;
            /**
             * Lifetime of a fracking fluid emitter in seconds.
             */
            FrackerSettings.k_frackingFluidEmitterLifetime = 5.0;
            /**
             * Speed particles are sucked up the well.
             */
            FrackerSettings.k_wellSuckSpeedInside = FrackerSettings.k_tileHeight * 5.0;
            /**
             * Speed particle are sucket towards the well bottom.
             */
            FrackerSettings.k_wellSuckSpeedOutside = FrackerSettings.k_tileWidth * 1.0;
            /**
             * Time mouse button must be held before emitting fracking
             * fluid.
             */
            FrackerSettings.k_frackingFluidChargeTime = 1.0;
            /**
             * Scores.
             */
            FrackerSettings.k_scorePerOilParticle = 1;
            FrackerSettings.k_scorePerWaterParticle = -1;
            FrackerSettings.k_scorePerFrackingParticle = 0;
            FrackerSettings.k_scorePerFrackingDeployment = -10;
            exports_1("FrackerSettings", FrackerSettings);
            /**
             * Oil Fracking simulator.
             *
             * Dig down to move the oil (red) to the well (gray). Try not to
             * contaminate the ground water (blue). To deploy fracking fluid
             * press 'space'.  Fracking fluid can be used to push other
             * fluids to the well head and ultimately score points.
             */
            Fracker = class Fracker extends testbed.Test {
                constructor() {
                    super();
                    this.m_wellX = FrackerSettings.k_worldWidthTiles - (FrackerSettings.k_worldWidthTiles / 4);
                    this.m_wellTop = FrackerSettings.k_worldHeightTiles - 1;
                    this.m_wellBottom = FrackerSettings.k_worldHeightTiles / 8;
                    this.m_tracker = new EmitterTracker();
                    this.m_allowInput = false;
                    this.m_frackingFluidChargeTime = -1.0;
                    this.m_material = [];
                    this.m_bodies = [];
                    /**
                     * Set of particle groups the well has influence over.
                     */
                    this.m_listener = new Fracker.DestructionListener();
                    this.m_listener.Initialize(this.m_world);
                    this.m_particleSystem.SetRadius(FrackerSettings.k_particleRadius);
                    this.InitializeLayout();
                    // Create the boundaries of the play area.
                    this.CreateGround();
                    // Create the well.
                    this.CreateWell();
                    // Create the geography / features (tiles of the world).
                    this.CreateGeo();
                    // Create the player.
                    this.CreatePlayer();
                }
                __dtor__() {
                    this.m_listener.__dtor__();
                }
                /**
                 * Initialize the data structures used to track the material in
                 * each tile and the bodies associated with each tile.
                 * @return {void}
                 */
                InitializeLayout() {
                    for (var i = 0; i < FrackerSettings.k_worldTiles; ++i) {
                        this.m_material[i] = Fracker.Material.EMPTY;
                        this.m_bodies[i] = null;
                    }
                }
                /**
                 * Get the material of the tile at the specified tile position.
                 * @return {Fracker.Material}
                 * @param {number} x
                 * @param {number} y
                 */
                GetMaterial(x, y) {
                    ///  return *const_cast<Fracker*>(this).GetMaterialStorage(x, y);
                    return this.m_material[Fracker.TileToArrayOffset(x, y)];
                }
                /**
                 * Set the material of the tile at the specified tile position.
                 * @return {void}
                 * @param {number} x
                 * @param {number} y
                 * @param {Fracker.Material} material
                 */
                SetMaterial(x, y, material) {
                    ///  *GetMaterialStorage(x, y) = material;
                    this.m_material[Fracker.TileToArrayOffset(x, y)] = material;
                }
                /**
                 * Get the body associated with the specified tile position.
                 * @return {box2d.b2Body}
                 * @param {number} x
                 * @param {number} y
                 */
                GetBody(x, y) {
                    ///  return *const_cast<Fracker*>(this).GetBodyStorage(x, y);
                    return this.m_bodies[Fracker.TileToArrayOffset(x, y)];
                }
                /**
                 * Set the body associated with the specified tile position.
                 * @return {void}
                 * @param {number} x
                 * @param {number} y
                 * @param {box2d.b2Body} body
                 */
                SetBody(x, y, body) {
                    ///  b2Body** const currentBody = GetBodyStorage(x, y);
                    var currentBody = this.m_bodies[Fracker.TileToArrayOffset(x, y)];
                    if (currentBody) {
                        this.m_world.DestroyBody(currentBody);
                    }
                    this.m_bodies[Fracker.TileToArrayOffset(x, y)] = body;
                }
                /**
                 * Create the player.
                 * @return {void}
                 */
                CreatePlayer() {
                    var bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_kinematicBody;
                    this.m_player = this.m_world.CreateBody(bd);
                    var shape = new box2d.b2PolygonShape();
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, new box2d.b2Vec2(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight), 0);
                    this.m_player.CreateFixture(shape, FrackerSettings.k_density);
                    this.m_player.SetTransformVec(Fracker.TileToWorld(FrackerSettings.k_worldWidthTiles / 2, FrackerSettings.k_worldHeightTiles / 2), 0);
                }
                /**
                 * Create the geography / features of the world.
                 * @return {void}
                 */
                CreateGeo() {
                    box2d.b2Assert(FrackerSettings.k_dirtProbability +
                        FrackerSettings.k_emptyProbability +
                        FrackerSettings.k_oilProbability +
                        FrackerSettings.k_waterProbability === 100);
                    for (var x = 0; x < FrackerSettings.k_worldWidthTiles; x++) {
                        for (var y = 0; y < FrackerSettings.k_worldHeightTiles; y++) {
                            if (this.GetMaterial(x, y) !== Fracker.Material.EMPTY) {
                                continue;
                            }
                            // Choose a tile at random.
                            var chance = Math.random() * 100.0;
                            // Create dirt if this is the bottom row or chance dictates it.
                            if (chance < FrackerSettings.k_dirtProbability || y === 0) {
                                this.CreateDirtBlock(x, y);
                            }
                            else if (chance < FrackerSettings.k_dirtProbability +
                                FrackerSettings.k_emptyProbability) {
                                this.SetMaterial(x, y, Fracker.Material.EMPTY);
                            }
                            else if (chance < FrackerSettings.k_dirtProbability +
                                FrackerSettings.k_emptyProbability +
                                FrackerSettings.k_oilProbability) {
                                this.CreateReservoirBlock(x, y, Fracker.Material.OIL);
                            }
                            else {
                                this.CreateReservoirBlock(x, y, Fracker.Material.WATER);
                            }
                        }
                    }
                }
                /**
                 * Create the boundary of the world.
                 * @return {void}
                 */
                CreateGround() {
                    var bd = new box2d.b2BodyDef();
                    var ground = this.m_world.CreateBody(bd);
                    var shape = new box2d.b2ChainShape();
                    var bottomLeft = new box2d.b2Vec2(), topRight = new box2d.b2Vec2();
                    Fracker.GetExtents(bottomLeft, topRight);
                    var vertices = [
                        new box2d.b2Vec2(bottomLeft.x, bottomLeft.y),
                        new box2d.b2Vec2(topRight.x, bottomLeft.y),
                        new box2d.b2Vec2(topRight.x, topRight.y),
                        new box2d.b2Vec2(bottomLeft.x, topRight.y)
                    ];
                    shape.CreateLoop(vertices, 4);
                    ground.CreateFixture(shape, 0.0);
                }
                /**
                 * Create a dirt block at the specified world position.
                 * @return {void}
                 * @param {number} x
                 * @param {number} y
                 */
                CreateDirtBlock(x, y) {
                    var position = Fracker.TileToWorld(x, y);
                    var bd = new box2d.b2BodyDef();
                    var body = this.m_world.CreateBody(bd);
                    var shape = new box2d.b2PolygonShape();
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, Fracker.CenteredPosition(position), 0);
                    body.CreateFixture(shape, FrackerSettings.k_density);
                    this.SetBody(x, y, body);
                    this.SetMaterial(x, y, Fracker.Material.DIRT);
                }
                /**
                 * Create particles in a tile with resources.
                 * @return {void}
                 * @param {number} x
                 * @param {number} y
                 * @param {Fracker.Material} material
                 */
                CreateReservoirBlock(x, y, material) {
                    var position = Fracker.TileToWorld(x, y);
                    var shape = new box2d.b2PolygonShape();
                    this.SetMaterial(x, y, material);
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, Fracker.CenteredPosition(position), 0);
                    var pd = new box2d.b2ParticleGroupDef();
                    pd.flags = box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_destructionListenerParticle;
                    pd.shape = shape;
                    pd.color.Copy(material === Fracker.Material.OIL ?
                        FrackerSettings.k_oilColor : FrackerSettings.k_waterColor);
                    var group = this.m_particleSystem.CreateParticleGroup(pd);
                    this.m_listener.AddParticleGroup(group);
                    // Tag each particle with its type.
                    var particleCount = group.GetParticleCount();
                    ///  void** const userDataBuffer = m_particleSystem.GetUserDataBuffer() + group.GetBufferIndex();;
                    var userDataBuffer = this.m_particleSystem.GetUserDataBuffer();
                    var index = group.GetBufferIndex();
                    for (var i = 0; i < particleCount; ++i) {
                        ///  userDataBuffer[i] = GetMaterialStorage(x, y);
                        userDataBuffer[index + i] = this.m_material[Fracker.TileToArrayOffset(x, y)];
                    }
                    // Keep track of the total available oil.
                    if (material === Fracker.Material.OIL) {
                        this.m_listener.AddOil(particleCount);
                    }
                }
                /**
                 * Create a well and the region which applies negative pressure
                 * to suck out fluid.
                 * @return {void}
                 */
                CreateWell() {
                    for (var y = this.m_wellBottom; y <= this.m_wellTop; y++) {
                        this.SetMaterial(this.m_wellX, y, Fracker.Material.WELL);
                    }
                }
                /**
                 * Create a fracking fluid emitter.
                 * @return {void}
                 * @param {box2d.b2Vec2} position
                 */
                CreateFrackingFluidEmitter(position) {
                    var groupDef = new box2d.b2ParticleGroupDef();
                    var group = this.m_particleSystem.CreateParticleGroup(groupDef);
                    this.m_listener.AddParticleGroup(group);
                    var emitter = new testbed.RadialEmitter();
                    emitter.SetGroup(group);
                    emitter.SetParticleSystem(this.m_particleSystem);
                    emitter.SetPosition(Fracker.CenteredPosition(position));
                    emitter.SetVelocity(new box2d.b2Vec2(0.0, -FrackerSettings.k_tileHalfHeight));
                    emitter.SetSpeed(FrackerSettings.k_tileHalfWidth * 0.1);
                    emitter.SetSize(new box2d.b2Vec2(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight));
                    emitter.SetEmitRate(20.0);
                    emitter.SetColor(FrackerSettings.k_frackingFluidColor);
                    emitter.SetParticleFlags(box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_viscousParticle);
                    this.m_tracker.Add(emitter, FrackerSettings.k_frackingFluidEmitterLifetime);
                    this.m_listener.AddScore(FrackerSettings.k_scorePerFrackingDeployment);
                }
                /**
                 * Update the player's position.
                 * @return {void}
                 * @param {number} playerX
                 * @param {number} playerY
                 */
                SetPlayerPosition(playerX, playerY) {
                    var playerPosition = this.m_player.GetTransform().p;
                    var currentPlayerX = [0], currentPlayerY = [0];
                    Fracker.WorldToTile(playerPosition, currentPlayerX, currentPlayerY);
                    playerX = box2d.b2Clamp(playerX, 0, FrackerSettings.k_worldWidthTiles - 1);
                    playerY = box2d.b2Clamp(playerY, 0, FrackerSettings.k_worldHeightTiles - 1);
                    // Only update if the player has moved and isn't attempting to
                    // move through the well.
                    if (this.GetMaterial(playerX, playerY) !== Fracker.Material.WELL &&
                        (currentPlayerX[0] !== playerX ||
                            currentPlayerY[0] !== playerY)) {
                        // Try to deploy any fracking fluid that was charging.
                        this.DeployFrackingFluid();
                        // Move the player.
                        this.m_player.SetTransformVec(Fracker.TileToWorld(playerX, playerY), 0);
                    }
                }
                /**
                 * Try to deploy fracking fluid at the player's position,
                 * returning true if successful.
                 * @return {boolean}
                 */
                DeployFrackingFluid() {
                    var deployed = false;
                    var playerPosition = this.m_player.GetTransform().p;
                    if (this.m_frackingFluidChargeTime > FrackerSettings.k_frackingFluidChargeTime) {
                        this.CreateFrackingFluidEmitter(playerPosition);
                        deployed = true;
                    }
                    this.m_frackingFluidChargeTime = -1.0;
                    return deployed;
                }
                /**
                 * Destroy all particles in the box specified by a set of tile
                 * coordinates.
                 * @return {void}
                 * @param {number} startX
                 * @param {number} startY
                 * @param {number} endX
                 * @param {number} endY
                 */
                DestroyParticlesInTiles(startX, startY, endX, endY) {
                    var shape = new box2d.b2PolygonShape();
                    var width = endX - startX + 1;
                    var height = endY - startY + 1;
                    var centerX = startX + width / 2;
                    var centerY = startY + height / 2;
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth * width, FrackerSettings.k_tileHalfHeight * height);
                    var killLocation = new box2d.b2Transform();
                    killLocation.SetPositionAngle(Fracker.CenteredPosition(Fracker.TileToWorld(centerX, centerY)), 0);
                    this.m_particleSystem.DestroyParticlesInShape(shape, killLocation);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Joint} joint
                 */
                JointDestroyed(joint) {
                    testbed.Test.prototype.JointDestroyed.call(this, joint);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2ParticleGroup} group
                 */
                ParticleGroupDestroyed(group) {
                    testbed.Test.prototype.ParticleGroupDestroyed.call(this, group);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Contact} contact
                 */
                BeginContact(contact) {
                    testbed.Test.prototype.BeginContact.call(this, contact);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Contact} contact
                 */
                EndContact(contact) {
                    testbed.Test.prototype.EndContact.call(this, contact);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Contact} contact
                 * @param {box2d.b2Manifold} oldManifold
                 */
                PreSolve(contact, oldManifold) {
                    testbed.Test.prototype.PreSolve.call(this, contact, oldManifold);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Contact} contact
                 * @param {box2d.b2ContactImpulse} impulse
                 */
                PostSolve(contact, impulse) {
                    testbed.Test.prototype.PostSolve.call(this, contact, impulse);
                }
                /**
                 * a = left, d = right, a = up, s = down, e = deploy fracking
                 * fluid.
                 */
                Keyboard(key) {
                    // Only allow 1 move per simulation step.
                    if (!this.m_allowInput) {
                        return;
                    }
                    var playerPosition = this.m_player.GetTransform().p;
                    var playerX = [0], playerY = [0];
                    Fracker.WorldToTile(playerPosition, playerX, playerY);
                    switch (key) {
                        case "a":
                            playerX[0]--;
                            break;
                        case "s":
                            playerY[0]--;
                            break;
                        case "d":
                            playerX[0]++;
                            break;
                        case "w":
                            playerY[0]++;
                            break;
                        case "e":
                            // Start charging the fracking fluid.
                            if (this.m_frackingFluidChargeTime < 0.0) {
                                this.m_frackingFluidChargeTime = 0.0;
                            }
                            else {
                                // KeyboardUp() in freeglut (at least on OSX) is called
                                // repeatedly while a key is held.  This means there isn't
                                // a way for fracking fluid to be deployed when the user
                                // releases 'e'.  This works around the issue by attempting
                                // to deploy the fluid when 'e' is pressed again.
                                this.DeployFrackingFluid();
                            }
                            break;
                        default:
                            testbed.Test.prototype.Keyboard.call(this, key);
                            break;
                    }
                    this.SetPlayerPosition(playerX[0], playerY[0]);
                    this.m_allowInput = false;
                }
                /**
                 * @export
                 * @return {void}
                 * @param {number} key
                 */
                KeyboardUp(key) {
                    testbed.Test.prototype.KeyboardUp.call(this, key);
                }
                /**
                 * Start preparing the fracking fluid.
                 * @export
                 * @return {void}
                 * @param {box2d.b2Vec2} p
                 */
                MouseDown(p) {
                    testbed.Test.prototype.MouseDown.call(this, p);
                    this.m_frackingFluidChargeTime = 0.0;
                }
                /**
                 * Try to deploy the fracking fluid or move the player.
                 * @export
                 * @return {void}
                 * @param {box2d.b2Vec2} p
                 */
                MouseUp(p) {
                    testbed.Test.prototype.MouseUp.call(this, p);
                    if (!this.m_allowInput) {
                        return;
                    }
                    // If fracking fluid isn't being released, move the player.
                    if (!this.DeployFrackingFluid()) {
                        var playerPosition = this.m_player.GetTransform().p;
                        var playerX = [0], playerY = [0];
                        Fracker.WorldToTile(playerPosition, playerX, playerY);
                        // Move the player towards the mouse position, preferring to move
                        // along the axis with the maximal distance from the cursor.
                        var distance = box2d.b2Vec2.SubVV(p, Fracker.CenteredPosition(playerPosition), new box2d.b2Vec2());
                        var absDistX = Math.abs(distance.x);
                        var absDistY = Math.abs(distance.y);
                        if (absDistX > absDistY &&
                            absDistX >= FrackerSettings.k_tileHalfWidth) {
                            playerX[0] += distance.x > 0.0 ? 1 : -1;
                        }
                        else if (absDistY >= FrackerSettings.k_tileHalfWidth) {
                            playerY[0] += distance.y > 0.0 ? 1 : -1;
                        }
                        this.SetPlayerPosition(playerX[0], playerY[0]);
                    }
                    this.m_allowInput = false;
                }
                /**
                 * @export
                 * @return {void}
                 * @param {box2d.b2Vec2} p
                 */
                MouseMove(p) {
                    testbed.Test.prototype.MouseMove.call(this, p);
                }
                /**
                 * @export
                 * @return {void}
                 * @param {testbed.Settings} settings
                 */
                Step(settings) {
                    super.Step(settings);
                    var dt = 1.0 / settings.hz;
                    this.m_tracker.Step(dt);
                    // Allow the user to move again.
                    this.m_allowInput = true;
                    // Charge up fracking fluid.
                    if (this.m_frackingFluidChargeTime >= 0.0) {
                        this.m_frackingFluidChargeTime += dt;
                    }
                    var playerPosition = this.m_player.GetTransform().p;
                    var playerX = [0], playerY = [0];
                    Fracker.WorldToTile(playerPosition, playerX, playerY);
                    // If the player is moved to a square with dirt, remove it.
                    if (this.GetMaterial(playerX[0], playerY[0]) === Fracker.Material.DIRT) {
                        this.SetMaterial(playerX[0], playerY[0], Fracker.Material.EMPTY);
                        this.SetBody(playerX[0], playerY[0], null);
                    }
                    // Destroy particles at the top of the well.
                    this.DestroyParticlesInTiles(this.m_wellX, this.m_wellTop, this.m_wellX, this.m_wellTop);
                    // Only move particles in the groups being tracked.
                    ///  const std.set<b2ParticleGroup*> &particleGroups = m_listener.GetParticleGroups();
                    var particleGroups = this.m_listener.GetParticleGroups();
                    ///  for (std.set<b2ParticleGroup*>.const_iterator it = particleGroups.begin(); it !== particleGroups.end(); ++it)
                    for (var it = 0; it < particleGroups.length; ++it) {
                        ///  b2ParticleGroup * const particleGroup = *it;
                        var particleGroup = particleGroups[it];
                        var index = particleGroup.GetBufferIndex();
                        ///  const b2Vec2* const positionBuffer = m_particleSystem.GetPositionBuffer() + index;
                        var positionBuffer = this.m_particleSystem.GetPositionBuffer();
                        ///  b2Vec2* const velocityBuffer = m_particleSystem.GetVelocityBuffer() + index;
                        var velocityBuffer = this.m_particleSystem.GetVelocityBuffer();
                        var particleCount = particleGroup.GetParticleCount();
                        for (var i = 0; i < particleCount; ++i) {
                            // Apply velocity to particles near the bottom or in the well
                            // sucking them up to the top.
                            var wellEnd = Fracker.CenteredPosition(Fracker.TileToWorld(this.m_wellX, this.m_wellBottom - 2));
                            var particlePosition = positionBuffer[index + i];
                            // Distance from the well's bottom.
                            ///  const b2Vec2 distance = particlePosition - wellEnd;
                            var distance = box2d.b2Vec2.SubVV(particlePosition, wellEnd, new box2d.b2Vec2());
                            // Distance from either well side wall.
                            var absDistX = Math.abs(distance.x);
                            if (absDistX < FrackerSettings.k_tileWidth &&
                                // If the particles are just below the well bottom.
                                distance.y > FrackerSettings.k_tileWidth * -2.0 &&
                                distance.y < 0.0) {
                                // Suck the particles towards the end of the well.
                                ///  b2Vec2 velocity = wellEnd - particlePosition;
                                var velocity = box2d.b2Vec2.SubVV(wellEnd, particlePosition, new box2d.b2Vec2());
                                velocity.Normalize();
                                ///  velocityBuffer[i] = velocity * FrackerSettings.k_wellSuckSpeedOutside;
                                velocityBuffer[index + i].Copy(velocity.SelfMul(FrackerSettings.k_wellSuckSpeedOutside));
                            }
                            else if (absDistX <= FrackerSettings.k_tileHalfWidth && distance.y > 0.0) {
                                // Suck the particles up the well with a random
                                // x component moving them side to side in the well.
                                var randomX = (Math.random() * FrackerSettings.k_tileHalfWidth) - distance.x;
                                var velocity = new box2d.b2Vec2(randomX, FrackerSettings.k_tileHeight);
                                velocity.Normalize();
                                ///  velocityBuffer[i] = velocity * FrackerSettings.k_wellSuckSpeedInside;
                                velocityBuffer[index + i].Copy(velocity.SelfMul(FrackerSettings.k_wellSuckSpeedInside));
                            }
                        }
                    }
                    // Draw everything.
                    this.DrawPlayer();
                    this.DrawWell();
                    this.DrawScore();
                }
                /**
                 * Render the well.
                 * @return {void}
                 */
                DrawWell() {
                    for (var y = this.m_wellBottom; y <= this.m_wellTop; ++y) {
                        this.DrawQuad(Fracker.TileToWorld(this.m_wellX, y), FrackerSettings.k_wellColor);
                    }
                }
                /**
                 * Render the player / fracker.
                 * @return {void}
                 */
                DrawPlayer() {
                    this.DrawQuad(this.m_player.GetTransform().p, Fracker.LerpColor(FrackerSettings.k_playerColor, FrackerSettings.k_playerFrackColor, box2d.b2Max(this.m_frackingFluidChargeTime /
                        FrackerSettings.k_frackingFluidChargeTime, 0.0)), true);
                }
                /**
                 * Render the score and the instructions / keys.
                 * @return {void}
                 */
                DrawScore() {
                    ///  char score[512];
                    ///  sprintf(score, "Score: %d, Remaining Oil %d",
                    ///          m_listener.GetScore(), m_listener.GetOil());
                    ///  const char *lines[] = { score,  "Move: a,s,d,w   Fracking Fluid: e" };
                    ///  for (uint32 i = 0; i < B2_ARRAY_SIZE(lines); ++i)
                    ///  {
                    ///    m_debugDraw.DrawString(5, m_textLine, lines[i]);
                    ///    m_textLine += DRAW_STRING_NEW_LINE;
                    ///  }
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `Score: ${this.m_listener.GetScore()}, Remaining Oil ${this.m_listener.GetOil()}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Move: a,s,d,w   Fracking Fluid: e");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                /**
                 * Draw a quad at position of color that is either just an
                 * outline (fill = false) or solid (fill = true).
                 * @return {void}
                 * @param {box2d.b2Vec2} position
                 * @param {box2d.b2Color} color
                 * @param {boolean=} fill
                 */
                DrawQuad(position, color, fill = false) {
                    ///  b2Vec2 verts[4];
                    var verts = box2d.b2Vec2.MakeArray(4);
                    var maxX = position.x + FrackerSettings.k_tileWidth;
                    var maxY = position.y + FrackerSettings.k_tileHeight;
                    verts[0].Set(position.x, maxY);
                    verts[1].Set(position.x, position.y);
                    verts[2].Set(maxX, position.y);
                    verts[3].Set(maxX, maxY);
                    if (fill) {
                        testbed.g_debugDraw.DrawPolygon(verts, 4, color);
                    }
                    else {
                        testbed.g_debugDraw.DrawSolidPolygon(verts, 4, color);
                    }
                }
                ///  // Get a pointer to the material of the tile at the specified position.
                ///  Material* GetMaterialStorage(const int32 x, const int32 y)
                ///  {
                ///    return &m_material[Fracker.TileToArrayOffset(x, y)];
                ///  }
                ///  // A pointer to the body storage associated with the specified tile
                ///  // position.
                ///  b2Body** GetBodyStorage(const int32 x, const int32 y)
                ///  {
                ///    return &m_bodies[Fracker.TileToArrayOffset(x, y)];
                ///  }
                /**
                 * @export
                 * @return {number}
                 */
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new Fracker();
                }
                /**
                 * Get the bottom left position of the world in world units.
                 * @return {void}
                 * @param {box2d.b2Vec2} bottomLeft
                 */
                static GetBottomLeft(bottomLeft) {
                    bottomLeft.Set(FrackerSettings.k_worldCenterX -
                        FrackerSettings.k_worldHalfWidth, FrackerSettings.k_worldCenterY -
                        FrackerSettings.k_worldHalfHeight);
                }
                /**
                 * Get the extents of the world in world units.
                 * @return {void}
                 * @param {box2d.b2Vec2} bottomLeft
                 * @param {box2d.b2Vec2} topRight
                 */
                static GetExtents(bottomLeft, topRight) {
                    Fracker.GetBottomLeft(bottomLeft);
                    topRight.Set(FrackerSettings.k_worldCenterX +
                        FrackerSettings.k_worldHalfWidth, FrackerSettings.k_worldCenterY +
                        FrackerSettings.k_worldHalfHeight);
                }
                ///  // Convert a point in world coordintes to a tile location
                /**
                 * @return {void}
                 * @param {box2d.b2Vec2} position
                 * @param {Array.<number>} x
                 * @param {Array.<number>} y
                 */
                static WorldToTile(position, x, y) {
                    // Translate relative to the world center and scale based upon the
                    // tile size.
                    var bottomLeft = new box2d.b2Vec2();
                    Fracker.GetBottomLeft(bottomLeft);
                    x[0] = Math.floor(((position.x - bottomLeft.x) /
                        FrackerSettings.k_tileWidth) +
                        FrackerSettings.k_tileHalfWidth);
                    y[0] = Math.floor(((position.y - bottomLeft.y) /
                        FrackerSettings.k_tileHeight) +
                        FrackerSettings.k_tileHalfHeight);
                }
                /**
                 * Convert a tile position to a point  in world coordinates.
                 * @return {box2d.b2Vec2}
                 * @param {number} x
                 * @param {number} y
                 * @param {box2d.b2Vec2=} out
                 */
                static TileToWorld(x, y, out = new box2d.b2Vec2()) {
                    // Scale based upon the tile size and translate relative to the world
                    // center.
                    var bottomLeft = new box2d.b2Vec2();
                    Fracker.GetBottomLeft(bottomLeft);
                    return out.Set((x * FrackerSettings.k_tileWidth) + bottomLeft.x, (y * FrackerSettings.k_tileHeight) + bottomLeft.y);
                }
                /**
                 * Calculate the offset within an array of all world tiles using
                 * the specified tile coordinates.
                 * @return {number}
                 * @param {number} x
                 * @param {number} y
                 */
                static TileToArrayOffset(x, y) {
                    box2d.b2Assert(x >= 0);
                    box2d.b2Assert(x < FrackerSettings.k_worldWidthTiles);
                    box2d.b2Assert(y >= 0);
                    box2d.b2Assert(y < FrackerSettings.k_worldHeightTiles);
                    return x + (y * FrackerSettings.k_worldWidthTiles);
                }
                /**
                 * Calculate the center of a tile position in world units.
                 * @return {box2d.b2Vec2}
                 * @param {box2d.b2Vec2} position
                 * @param {box2d.b2Vec2=} out
                 */
                static CenteredPosition(position, out = new box2d.b2Vec2()) {
                    return out.Set(position.x + FrackerSettings.k_tileHalfWidth, position.y + FrackerSettings.k_tileHalfHeight);
                }
                /**
                 * Interpolate between color a and b using t.
                 * @return {box2d.b2Color}
                 * @param {box2d.b2Color} a
                 * @param {box2d.b2Color} b
                 * @param {number} t
                 */
                static LerpColor(a, b, t) {
                    return new box2d.b2Color(Fracker.Lerp(a.r, b.r, t), Fracker.Lerp(a.g, b.g, t), Fracker.Lerp(a.b, b.b, t));
                }
                /**
                 * Interpolate between a and b using t.
                 * @return {number}
                 * @param {number} a
                 * @param {number} b
                 * @param {number} t
                 */
                static Lerp(a, b, t) {
                    return a * (1.0 - t) + b * t;
                }
            };
            exports_1("Fracker", Fracker);
            (function (Fracker) {
                /**
                 * Type of material in a tile.
                 */
                let Material;
                (function (Material) {
                    Material[Material["EMPTY"] = 0] = "EMPTY";
                    Material[Material["DIRT"] = 1] = "DIRT";
                    Material[Material["ROCK"] = 2] = "ROCK";
                    Material[Material["OIL"] = 3] = "OIL";
                    Material[Material["WATER"] = 4] = "WATER";
                    Material[Material["WELL"] = 5] = "WELL";
                    Material[Material["PUMP"] = 6] = "PUMP";
                })(Material = Fracker.Material || (Fracker.Material = {}));
                /**
                 * Keep track of particle groups which are drawn up the well and
                 * tracks the score of the game.
                 */
                class DestructionListener extends ParticleGroupTracker {
                    constructor() {
                        super(...arguments);
                        this.m_score = 0;
                        this.m_oil = 0;
                    }
                    /**
                     * Initialize the score.
                     */
                    __ctor__() { }
                    __dtor__() {
                        if (this.m_world) {
                            this.m_world.SetDestructionListener(this.m_previousListener);
                        }
                    }
                    /**
                     * Initialize the particle system and world, setting this class
                     * as a destruction listener for the world.
                     */
                    Initialize(world) {
                        box2d.b2Assert(world !== null);
                        this.m_world = world;
                        this.m_world.SetDestructionListener(this);
                    }
                    /**
                     * Add to the current score.
                     */
                    AddScore(score) {
                        this.m_score += score;
                    }
                    /**
                     * Get the current score.
                     */
                    GetScore() {
                        return this.m_score;
                    }
                    /**
                     * Add to the remaining oil.
                     */
                    AddOil(oil) {
                        this.m_oil += oil;
                    }
                    /**
                     * Get the total oil.
                     * @return {number}
                     */
                    GetOil() {
                        return this.m_oil;
                    }
                    /**
                     * Update the score when certain particles are destroyed.
                     * @return {void}
                     * @param {box2d.b2ParticleSystem} particleSystem
                     * @param {number} index
                     */
                    SayGoodbyeParticle(particleSystem, index) {
                        box2d.b2Assert(particleSystem !== null);
                        ///  const void * const userData = particleSystem.GetUserDataBuffer()[index];
                        var userData = particleSystem.GetUserDataBuffer()[index];
                        if (userData) {
                            ///  const Material material = *((Material*)userData);
                            var material = userData;
                            switch (material) {
                                case Fracker.Material.OIL:
                                    this.AddScore(FrackerSettings.k_scorePerOilParticle);
                                    this.AddOil(-1);
                                    break;
                                case Fracker.Material.WATER:
                                    this.AddScore(FrackerSettings.k_scorePerWaterParticle);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
                Fracker.DestructionListener = DestructionListener;
            })(Fracker || (Fracker = {}));
            exports_1("Fracker", Fracker);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnJhY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkZyYWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9IOzs7ZUFHRztZQUNILGlCQUFBO2dCQUFBO29CQUNFLHNCQUFpQixHQUEyRCxFQUFFLENBQUM7Z0JBK0RqRixDQUFDO2dCQTdEQzs7bUJBRUc7Z0JBQ0gsUUFBUTtvQkFDTiwrSEFBK0g7b0JBQy9ILEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO3dCQUN6RCxxQkFBcUI7d0JBQ3JCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQy9DO2dCQUNILENBQUM7Z0JBRUQ7Ozs7Ozs7bUJBT0c7Z0JBQ0gsR0FBRyxDQUFDLE9BQThCLEVBQUUsUUFBZ0I7b0JBQ2xELDJDQUEyQztvQkFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQzt3QkFDMUIsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLFFBQVEsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRDs7OzttQkFJRztnQkFDSCxJQUFJLENBQUMsRUFBVTtvQkFDYixrREFBa0Q7b0JBQ2xELElBQUksaUJBQWlCLEdBQTRCLEVBQUUsQ0FBQztvQkFDcEQsK0hBQStIO29CQUMvSCxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDekQsOENBQThDO3dCQUM5QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUNqRCw2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