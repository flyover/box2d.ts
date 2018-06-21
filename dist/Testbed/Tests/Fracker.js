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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, EmitterTracker, ParticleGroupTracker, FrackerSettings, Fracker;
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
                    for (let it = 0; it < this.m_emitterLifetime.length; ++it) {
                        ///  delete it.first;
                        this.m_emitterLifetime[it].emitter.__dtor__();
                    }
                }
                /**
                 * Add an emitter to the tracker.
                 * This assumes emitter was allocated using "new" and ownership
                 * of the object is handed to this class.
                 */
                Add(emitter, lifetime) {
                    ///  m_emitterLifetime[emitter] = lifetime;
                    this.m_emitterLifetime.push({ emitter, lifetime });
                }
                /**
                 * Update all emitters destroying those who are too old.
                 */
                Step(dt) {
                    ///  std.vector<RadialEmitter*> emittersToDestroy;
                    const emittersToDestroy = [];
                    ///  for (std.map<RadialEmitter*, float32>.const_iterator it = m_emitterLifetime.begin(); it !== m_emitterLifetime.end(); ++it)
                    for (let it = 0; it < this.m_emitterLifetime.length; ++it) {
                        ///  RadialEmitter * const emitter = it.first;
                        const emitter = this.m_emitterLifetime[it].emitter;
                        ///  const float32 lifetime = it.second - dt;
                        const lifetime = this.m_emitterLifetime[it].lifetime - dt;
                        if (lifetime <= 0.0) {
                            emittersToDestroy.push(emitter);
                        }
                        ///  m_emitterLifetime[emitter] = lifetime;
                        this.m_emitterLifetime[it].lifetime = lifetime;
                        emitter.Step(dt);
                    }
                    ///  for (std.vector<RadialEmitter*>.const_iterator it = emittersToDestroy.begin(); it !== emittersToDestroy.end(); ++it)
                    for (let it = 0; it < emittersToDestroy.length; ++it) {
                        ///  RadialEmitter *emitter = *it;
                        const emitter = emittersToDestroy[it];
                        /// delete emitter;
                        emitter.__dtor__();
                        ///  m_emitterLifetime.erase(m_emitterLifetime.find(emitter));
                        this.m_emitterLifetime = this.m_emitterLifetime.filter((value) => {
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
                 */
                SayGoodbyeParticleGroup(group) {
                    this.RemoveParticleGroup(group);
                }
                /**
                 * Add a particle group to the tracker.
                 */
                AddParticleGroup(group) {
                    this.m_particleGroups.push(group);
                }
                /**
                 * Remove a particle group from the tracker.
                 */
                RemoveParticleGroup(group) {
                    this.m_particleGroups.splice(this.m_particleGroups.indexOf(group), 1);
                }
                GetParticleGroups() {
                    return this.m_particleGroups;
                }
            };
            exports_1("ParticleGroupTracker", ParticleGroupTracker);
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
                    this.m_listener = new Fracker.DestructionListener(this.m_world);
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
                 */
                InitializeLayout() {
                    for (let i = 0; i < FrackerSettings.k_worldTiles; ++i) {
                        this.m_material[i] = Fracker.Material.EMPTY;
                        this.m_bodies[i] = null;
                    }
                }
                /**
                 * Get the material of the tile at the specified tile position.
                 */
                GetMaterial(x, y) {
                    ///  return *const_cast<Fracker*>(this).GetMaterialStorage(x, y);
                    return this.m_material[Fracker.TileToArrayOffset(x, y)];
                }
                /**
                 * Set the material of the tile at the specified tile position.
                 */
                SetMaterial(x, y, material) {
                    ///  *GetMaterialStorage(x, y) = material;
                    this.m_material[Fracker.TileToArrayOffset(x, y)] = material;
                }
                /**
                 * Get the body associated with the specified tile position.
                 */
                GetBody(x, y) {
                    ///  return *const_cast<Fracker*>(this).GetBodyStorage(x, y);
                    return this.m_bodies[Fracker.TileToArrayOffset(x, y)];
                }
                /**
                 * Set the body associated with the specified tile position.
                 */
                SetBody(x, y, body) {
                    ///  b2Body** const currentBody = GetBodyStorage(x, y);
                    const currentBody = this.m_bodies[Fracker.TileToArrayOffset(x, y)];
                    if (currentBody) {
                        this.m_world.DestroyBody(currentBody);
                    }
                    this.m_bodies[Fracker.TileToArrayOffset(x, y)] = body;
                }
                /**
                 * Create the player.
                 */
                CreatePlayer() {
                    const bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_kinematicBody;
                    this.m_player = this.m_world.CreateBody(bd);
                    const shape = new box2d.b2PolygonShape();
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, new box2d.b2Vec2(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight), 0);
                    this.m_player.CreateFixture(shape, FrackerSettings.k_density);
                    this.m_player.SetTransformVec(Fracker.TileToWorld(FrackerSettings.k_worldWidthTiles / 2, FrackerSettings.k_worldHeightTiles / 2), 0);
                }
                /**
                 * Create the geography / features of the world.
                 */
                CreateGeo() {
                    // DEBUG: box2d.b2Assert(FrackerSettings.k_dirtProbability +
                    // DEBUG:   FrackerSettings.k_emptyProbability +
                    // DEBUG:   FrackerSettings.k_oilProbability +
                    // DEBUG:   FrackerSettings.k_waterProbability === 100);
                    for (let x = 0; x < FrackerSettings.k_worldWidthTiles; x++) {
                        for (let y = 0; y < FrackerSettings.k_worldHeightTiles; y++) {
                            if (this.GetMaterial(x, y) !== Fracker.Material.EMPTY) {
                                continue;
                            }
                            // Choose a tile at random.
                            const chance = Math.random() * 100.0;
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
                 */
                CreateGround() {
                    const bd = new box2d.b2BodyDef();
                    const ground = this.m_world.CreateBody(bd);
                    const shape = new box2d.b2ChainShape();
                    const bottomLeft = new box2d.b2Vec2(), topRight = new box2d.b2Vec2();
                    Fracker.GetExtents(bottomLeft, topRight);
                    const vertices = [
                        new box2d.b2Vec2(bottomLeft.x, bottomLeft.y),
                        new box2d.b2Vec2(topRight.x, bottomLeft.y),
                        new box2d.b2Vec2(topRight.x, topRight.y),
                        new box2d.b2Vec2(bottomLeft.x, topRight.y),
                    ];
                    shape.CreateLoop(vertices, 4);
                    ground.CreateFixture(shape, 0.0);
                }
                /**
                 * Create a dirt block at the specified world position.
                 */
                CreateDirtBlock(x, y) {
                    const position = Fracker.TileToWorld(x, y);
                    const bd = new box2d.b2BodyDef();
                    const body = this.m_world.CreateBody(bd);
                    const shape = new box2d.b2PolygonShape();
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, Fracker.CenteredPosition(position), 0);
                    body.CreateFixture(shape, FrackerSettings.k_density);
                    this.SetBody(x, y, body);
                    this.SetMaterial(x, y, Fracker.Material.DIRT);
                }
                /**
                 * Create particles in a tile with resources.
                 */
                CreateReservoirBlock(x, y, material) {
                    const position = Fracker.TileToWorld(x, y);
                    const shape = new box2d.b2PolygonShape();
                    this.SetMaterial(x, y, material);
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth, FrackerSettings.k_tileHalfHeight, Fracker.CenteredPosition(position), 0);
                    const pd = new box2d.b2ParticleGroupDef();
                    pd.flags = box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_destructionListenerParticle;
                    pd.shape = shape;
                    pd.color.Copy(material === Fracker.Material.OIL ?
                        FrackerSettings.k_oilColor : FrackerSettings.k_waterColor);
                    const group = this.m_particleSystem.CreateParticleGroup(pd);
                    this.m_listener.AddParticleGroup(group);
                    // Tag each particle with its type.
                    const particleCount = group.GetParticleCount();
                    ///  void** const userDataBuffer = m_particleSystem.GetUserDataBuffer() + group.GetBufferIndex();;
                    const userDataBuffer = this.m_particleSystem.GetUserDataBuffer();
                    const index = group.GetBufferIndex();
                    for (let i = 0; i < particleCount; ++i) {
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
                 */
                CreateWell() {
                    for (let y = this.m_wellBottom; y <= this.m_wellTop; y++) {
                        this.SetMaterial(this.m_wellX, y, Fracker.Material.WELL);
                    }
                }
                /**
                 * Create a fracking fluid emitter.
                 */
                CreateFrackingFluidEmitter(position) {
                    const groupDef = new box2d.b2ParticleGroupDef();
                    const group = this.m_particleSystem.CreateParticleGroup(groupDef);
                    this.m_listener.AddParticleGroup(group);
                    const emitter = new testbed.RadialEmitter();
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
                 */
                SetPlayerPosition(playerX, playerY) {
                    const playerPosition = this.m_player.GetTransform().p;
                    const currentPlayerX = [0], currentPlayerY = [0];
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
                 */
                DeployFrackingFluid() {
                    let deployed = false;
                    const playerPosition = this.m_player.GetTransform().p;
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
                 */
                DestroyParticlesInTiles(startX, startY, endX, endY) {
                    const shape = new box2d.b2PolygonShape();
                    const width = endX - startX + 1;
                    const height = endY - startY + 1;
                    const centerX = startX + width / 2;
                    const centerY = startY + height / 2;
                    shape.SetAsBox(FrackerSettings.k_tileHalfWidth * width, FrackerSettings.k_tileHalfHeight * height);
                    const killLocation = new box2d.b2Transform();
                    killLocation.SetPositionAngle(Fracker.CenteredPosition(Fracker.TileToWorld(centerX, centerY)), 0);
                    this.m_particleSystem.DestroyParticlesInShape(shape, killLocation);
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
                 * a = left, d = right, a = up, s = down, e = deploy fracking
                 * fluid.
                 */
                Keyboard(key) {
                    // Only allow 1 move per simulation step.
                    if (!this.m_allowInput) {
                        return;
                    }
                    const playerPosition = this.m_player.GetTransform().p;
                    const playerX = [0], playerY = [0];
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
                            super.Keyboard(key);
                            break;
                    }
                    this.SetPlayerPosition(playerX[0], playerY[0]);
                    this.m_allowInput = false;
                }
                KeyboardUp(key) {
                    super.KeyboardUp(key);
                }
                MouseDown(p) {
                    super.MouseDown(p);
                    this.m_frackingFluidChargeTime = 0.0;
                }
                /**
                 * Try to deploy the fracking fluid or move the player.
                 */
                MouseUp(p) {
                    super.MouseUp(p);
                    if (!this.m_allowInput) {
                        return;
                    }
                    // If fracking fluid isn't being released, move the player.
                    if (!this.DeployFrackingFluid()) {
                        const playerPosition = this.m_player.GetTransform().p;
                        const playerX = [0], playerY = [0];
                        Fracker.WorldToTile(playerPosition, playerX, playerY);
                        // Move the player towards the mouse position, preferring to move
                        // along the axis with the maximal distance from the cursor.
                        const distance = box2d.b2Vec2.SubVV(p, Fracker.CenteredPosition(playerPosition), new box2d.b2Vec2());
                        const absDistX = Math.abs(distance.x);
                        const absDistY = Math.abs(distance.y);
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
                MouseMove(p) {
                    super.MouseMove(p);
                }
                Step(settings) {
                    let dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
                    if (settings.pause && !settings.singleStep) {
                        dt = 0.0;
                    }
                    super.Step(settings);
                    this.m_tracker.Step(dt);
                    // Allow the user to move again.
                    this.m_allowInput = true;
                    // Charge up fracking fluid.
                    if (this.m_frackingFluidChargeTime >= 0.0) {
                        this.m_frackingFluidChargeTime += dt;
                    }
                    const playerPosition = this.m_player.GetTransform().p;
                    const playerX = [0], playerY = [0];
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
                    const particleGroups = this.m_listener.GetParticleGroups();
                    ///  for (std.set<b2ParticleGroup*>.const_iterator it = particleGroups.begin(); it !== particleGroups.end(); ++it)
                    for (let it = 0; it < particleGroups.length; ++it) {
                        ///  b2ParticleGroup * const particleGroup = *it;
                        const particleGroup = particleGroups[it];
                        const index = particleGroup.GetBufferIndex();
                        ///  const b2Vec2* const positionBuffer = m_particleSystem.GetPositionBuffer() + index;
                        const positionBuffer = this.m_particleSystem.GetPositionBuffer();
                        ///  b2Vec2* const velocityBuffer = m_particleSystem.GetVelocityBuffer() + index;
                        const velocityBuffer = this.m_particleSystem.GetVelocityBuffer();
                        const particleCount = particleGroup.GetParticleCount();
                        for (let i = 0; i < particleCount; ++i) {
                            // Apply velocity to particles near the bottom or in the well
                            // sucking them up to the top.
                            const wellEnd = Fracker.CenteredPosition(Fracker.TileToWorld(this.m_wellX, this.m_wellBottom - 2));
                            const particlePosition = positionBuffer[index + i];
                            // Distance from the well's bottom.
                            ///  const b2Vec2 distance = particlePosition - wellEnd;
                            const distance = box2d.b2Vec2.SubVV(particlePosition, wellEnd, new box2d.b2Vec2());
                            // Distance from either well side wall.
                            const absDistX = Math.abs(distance.x);
                            if (absDistX < FrackerSettings.k_tileWidth &&
                                // If the particles are just below the well bottom.
                                distance.y > FrackerSettings.k_tileWidth * -2.0 &&
                                distance.y < 0.0) {
                                // Suck the particles towards the end of the well.
                                ///  b2Vec2 velocity = wellEnd - particlePosition;
                                const velocity = box2d.b2Vec2.SubVV(wellEnd, particlePosition, new box2d.b2Vec2());
                                velocity.Normalize();
                                ///  velocityBuffer[i] = velocity * FrackerSettings.k_wellSuckSpeedOutside;
                                velocityBuffer[index + i].Copy(velocity.SelfMul(FrackerSettings.k_wellSuckSpeedOutside));
                            }
                            else if (absDistX <= FrackerSettings.k_tileHalfWidth && distance.y > 0.0) {
                                // Suck the particles up the well with a random
                                // x component moving them side to side in the well.
                                const randomX = (Math.random() * FrackerSettings.k_tileHalfWidth) - distance.x;
                                const velocity = new box2d.b2Vec2(randomX, FrackerSettings.k_tileHeight);
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
                 */
                DrawWell() {
                    for (let y = this.m_wellBottom; y <= this.m_wellTop; ++y) {
                        this.DrawQuad(Fracker.TileToWorld(this.m_wellX, y), FrackerSettings.k_wellColor);
                    }
                }
                /**
                 * Render the player / fracker.
                 */
                DrawPlayer() {
                    this.DrawQuad(this.m_player.GetTransform().p, Fracker.LerpColor(FrackerSettings.k_playerColor, FrackerSettings.k_playerFrackColor, box2d.b2Max(this.m_frackingFluidChargeTime /
                        FrackerSettings.k_frackingFluidChargeTime, 0.0)), true);
                }
                /**
                 * Render the score and the instructions / keys.
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
                 */
                DrawQuad(position, color, fill = false) {
                    ///  b2Vec2 verts[4];
                    const verts = box2d.b2Vec2.MakeArray(4);
                    const maxX = position.x + FrackerSettings.k_tileWidth;
                    const maxY = position.y + FrackerSettings.k_tileHeight;
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
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new Fracker();
                }
                /**
                 * Get the bottom left position of the world in world units.
                 */
                static GetBottomLeft(bottomLeft) {
                    bottomLeft.Set(FrackerSettings.k_worldCenterX -
                        FrackerSettings.k_worldHalfWidth, FrackerSettings.k_worldCenterY -
                        FrackerSettings.k_worldHalfHeight);
                }
                /**
                 * Get the extents of the world in world units.
                 */
                static GetExtents(bottomLeft, topRight) {
                    Fracker.GetBottomLeft(bottomLeft);
                    topRight.Set(FrackerSettings.k_worldCenterX +
                        FrackerSettings.k_worldHalfWidth, FrackerSettings.k_worldCenterY +
                        FrackerSettings.k_worldHalfHeight);
                }
                // Convert a point in world coordintes to a tile location
                static WorldToTile(position, x, y) {
                    // Translate relative to the world center and scale based upon the
                    // tile size.
                    const bottomLeft = new box2d.b2Vec2();
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
                 */
                static TileToWorld(x, y, out = new box2d.b2Vec2()) {
                    // Scale based upon the tile size and translate relative to the world
                    // center.
                    const bottomLeft = new box2d.b2Vec2();
                    Fracker.GetBottomLeft(bottomLeft);
                    return out.Set((x * FrackerSettings.k_tileWidth) + bottomLeft.x, (y * FrackerSettings.k_tileHeight) + bottomLeft.y);
                }
                /**
                 * Calculate the offset within an array of all world tiles using
                 * the specified tile coordinates.
                 */
                static TileToArrayOffset(x, y) {
                    // DEBUG: box2d.b2Assert(x >= 0);
                    // DEBUG: box2d.b2Assert(x < FrackerSettings.k_worldWidthTiles);
                    // DEBUG: box2d.b2Assert(y >= 0);
                    // DEBUG: box2d.b2Assert(y < FrackerSettings.k_worldHeightTiles);
                    return x + (y * FrackerSettings.k_worldWidthTiles);
                }
                /**
                 * Calculate the center of a tile position in world units.
                 */
                static CenteredPosition(position, out = new box2d.b2Vec2()) {
                    return out.Set(position.x + FrackerSettings.k_tileHalfWidth, position.y + FrackerSettings.k_tileHalfHeight);
                }
                /**
                 * Interpolate between color a and b using t.
                 */
                static LerpColor(a, b, t) {
                    return new box2d.b2Color(Fracker.Lerp(a.r, b.r, t), Fracker.Lerp(a.g, b.g, t), Fracker.Lerp(a.b, b.b, t));
                }
                /**
                 * Interpolate between a and b using t.
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
                    /**
                     * Initialize the particle system and world, setting this class
                     * as a destruction listener for the world.
                     */
                    constructor(world) {
                        super();
                        this.m_score = 0;
                        this.m_oil = 0;
                        this.m_previousListener = null;
                        // DEBUG: box2d.b2Assert(world !== null);
                        this.m_world = world;
                        this.m_previousListener = world.m_destructionListener;
                        this.m_world.SetDestructionListener(this);
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
                     */
                    GetOil() {
                        return this.m_oil;
                    }
                    /**
                     * Update the score when certain particles are destroyed.
                     */
                    SayGoodbyeParticle(particleSystem, index) {
                        // DEBUG: box2d.b2Assert(particleSystem !== null);
                        ///  const void * const userData = particleSystem.GetUserDataBuffer()[index];
                        const userData = particleSystem.GetUserDataBuffer()[index];
                        if (userData) {
                            ///  const Material material = *((Material*)userData);
                            const material = userData;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnJhY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvRnJhY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0g7OztlQUdHO1lBQ0gsaUJBQUE7Z0JBQUE7b0JBQ1Msc0JBQWlCLEdBQWdFLEVBQUUsQ0FBQztnQkF1RDdGLENBQUM7Z0JBckRDOzttQkFFRztnQkFDSSxRQUFRO29CQUNiLCtIQUErSDtvQkFDL0gsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7d0JBQ3pELHFCQUFxQjt3QkFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDL0M7Z0JBQ0gsQ0FBQztnQkFFRDs7OzttQkFJRztnQkFDSSxHQUFHLENBQUMsT0FBOEIsRUFBRSxRQUFnQjtvQkFDekQsMkNBQTJDO29CQUMzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBRUQ7O21CQUVHO2dCQUNJLElBQUksQ0FBQyxFQUFVO29CQUNwQixrREFBa0Q7b0JBQ2xELE1BQU0saUJBQWlCLEdBQTRCLEVBQUUsQ0FBQztvQkFDdEQsK0hBQStIO29CQUMvSCxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTt3QkFDekQsOENBQThDO3dCQUM5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO3dCQUNuRCw2Q0FBNkM7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