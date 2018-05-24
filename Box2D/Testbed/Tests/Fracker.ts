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

// #if B2_ENABLE_PARTICLE

import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class Fracker extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new Fracker();
  }
}

// #endif

// //#if B2_ENABLE_PARTICLE

// goog.provide('box2d.Testbed.Fracker');

// goog.require('box2d.Testbed.Test');
// goog.require('box2d.Testbed.RadialEmitter');

// /**
//  * Tracks instances of RadialEmitter and destroys them after a
//  * specified period of time.
//  * @constructor
//  */
// box2d.Testbed.EmitterTracker = function() {
//   this.m_emitterLifetime = [];
// }

// /**
//  * std.map<RadialEmitter*,float32>
//  * @type {Array.<Object>}
//  */
// box2d.Testbed.EmitterTracker.prototype.m_emitterLifetime = null;

// /**
//  * Delete all emitters.
//  * @return {void}
//  */
// box2d.Testbed.EmitterTracker.prototype.__dtor__ = function() {
//   ///  for (std.map<RadialEmitter*, float32>.const_iterator it = m_emitterLifetime.begin(); it !== m_emitterLifetime.end(); ++it)
//   for (var it = 0; it < this.m_emitterLifetime.length; ++it) {
//     ///  delete it.first;
//     this.m_emitterLifetime[it].emitter.__dtor__();
//   }
// }

// /**
//  * Add an emitter to the tracker.
//  * This assumes emitter was allocated using "new" and ownership
//  * of the object is handed to this class.
//  * @return {void}
//  * @param {box2d.Testbed.RadialEmitter} emitter
//  * @param {number} lifetime
//  */
// box2d.Testbed.EmitterTracker.prototype.Add = function(emitter, lifetime) {
//   ///  m_emitterLifetime[emitter] = lifetime;
//   this.m_emitterLifetime.push({
//     emitter: emitter,
//     lifetime: lifetime
//   });
// }

// /**
//  * Update all emitters destroying those who are too old.
//  * @return {void}
//  * @param {number} dt
//  */
// box2d.Testbed.EmitterTracker.prototype.Step = function(dt) {
//   ///  std.vector<RadialEmitter*> emittersToDestroy;
//   var emittersToDestroy = [];
//   ///  for (std.map<RadialEmitter*, float32>.const_iterator it = m_emitterLifetime.begin(); it !== m_emitterLifetime.end(); ++it)
//   for (var it = 0; it < this.m_emitterLifetime.length; ++it) {
//     ///  RadialEmitter * const emitter = it.first;
//     var emitter = this.m_emitterLifetime[it].emitter;
//     ///  const float32 lifetime = it.second - dt;
//     var lifetime = this.m_emitterLifetime[it].lifetime - dt;
//     if (lifetime <= 0.0) {
//       emittersToDestroy.push(emitter);
//     }
//     ///  m_emitterLifetime[emitter] = lifetime;
//     this.m_emitterLifetime[it].lifetime = lifetime

//     emitter.Step(dt);
//   }
//   ///  for (std.vector<RadialEmitter*>.const_iterator it = emittersToDestroy.begin(); it !== emittersToDestroy.end(); ++it)
//   for (var it = 0; it < emittersToDestroy.length; ++it) {
//     ///  RadialEmitter *emitter = *it;
//     var emitter = emittersToDestroy[it];
//     /// delete emitter;
//     emitter.__dtor__();
//     ///  m_emitterLifetime.erase(m_emitterLifetime.find(emitter));
//     this.m_emitterLifetime = this.m_emitterLifetime.filter(function(value) {
//       return value.emitter !== emitter;
//     });
//   }
// }

// /**
//  * Keep track of particle groups in a set, removing them when
//  * they're destroyed.
//  * @constructor
//  * @extends {box2d.b2DestructionListener}
//  */
// box2d.Testbed.ParticleGroupTracker = function() {
//   box2d.b2DestructionListener.call(this);

//   this.m_particleGroups = [];
// }

// goog.inherits(box2d.Testbed.ParticleGroupTracker, box2d.b2DestructionListener);

// /**
//  * @type {Array.<box2d.b2ParticleGroup>}
//  */
// box2d.Testbed.ParticleGroupTracker.prototype.m_particleGroups = null;

// /**
//  * Called when any particle group is about to be destroyed.
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.ParticleGroupTracker.prototype.SayGoodbyeParticleGroup = function(group) {
//   this.RemoveParticleGroup(group);
// }

// /**
//  * Add a particle group to the tracker.
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.ParticleGroupTracker.prototype.AddParticleGroup = function(group) {
//   this.m_particleGroups.push(group);
// }

// /**
//  * Remove a particle group from the tracker.
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.ParticleGroupTracker.prototype.RemoveParticleGroup = function(group) {
//   this.m_particleGroups.splice(this.m_particleGroups.indexOf(group), 1);
// }

// /**
//  * @return {Array.<box2d.b2ParticleGroup>}
//  */
// box2d.Testbed.ParticleGroupTracker.prototype.GetParticleGroups = function() {
//   return this.m_particleGroups;
// }

// box2d.Testbed.FrackerSettings = {};

// /**
//  * Width and height of the world in tiles.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_worldWidthTiles = 24;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_worldHeightTiles = 16;
// /**
//  * Total number of tiles.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_worldTiles = box2d.Testbed.FrackerSettings.k_worldWidthTiles * box2d.Testbed.FrackerSettings.k_worldHeightTiles;
// /**
//  * Center of the world in world coordinates.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_worldCenterX = 0.0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_worldCenterY = 2.0;
// /**
//  * Size of each tile in world units.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_tileWidth = 0.2;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_tileHeight = 0.2;
// /**
//  * Half width and height of tiles in world units.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_tileHalfWidth = box2d.Testbed.FrackerSettings.k_tileWidth * 0.5;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_tileHalfHeight = box2d.Testbed.FrackerSettings.k_tileHeight * 0.5;
// /**
//  * Half width and height of the world in world coordinates.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_worldHalfWidth = (box2d.Testbed.FrackerSettings.k_worldWidthTiles * box2d.Testbed.FrackerSettings.k_tileWidth) * 0.5;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_worldHalfHeight = (box2d.Testbed.FrackerSettings.k_worldHeightTiles * box2d.Testbed.FrackerSettings.k_tileHeight) * 0.5;

// /**
//  * Colors of tiles.
//  * @const
//  * @type {box2d.b2Color}
//  */
// box2d.Testbed.FrackerSettings.k_playerColor = new box2d.b2Color(1.0, 1.0, 1.0);
// /**
//  * @const
//  * @type {box2d.b2Color}
//  */
// box2d.Testbed.FrackerSettings.k_playerFrackColor = new box2d.b2Color(1.0, 0.5, 0.5);
// /**
//  * @const
//  * @type {box2d.b2Color}
//  */
// box2d.Testbed.FrackerSettings.k_wellColor = new box2d.b2Color(0.5, 0.5, 0.5);
// /**
//  * @const
//  * @type {box2d.b2ParticleColor}
//  */
// box2d.Testbed.FrackerSettings.k_oilColor = new box2d.b2ParticleColor(new box2d.b2Color(1.0, 0.0, 0.0));
// /**
//  * @const
//  * @type {box2d.b2ParticleColor}
//  */
// box2d.Testbed.FrackerSettings.k_waterColor = new box2d.b2ParticleColor(new box2d.b2Color(0.0, 0.2, 1.0));
// /**
//  * @const
//  * @type {box2d.b2ParticleColor}
//  */
// box2d.Testbed.FrackerSettings.k_frackingFluidColor = new box2d.b2ParticleColor(new box2d.b2Color(0.8, 0.4, 0.0));

// /**
//  * Default density of each body.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_density = 0.1;

// /**
//  * Radius of oil / water / fracking fluid particles.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_particleRadius = ((box2d.Testbed.FrackerSettings.k_tileWidth + box2d.Testbed.FrackerSettings.k_tileHeight) * 0.5) * 0.2;

// /**
//  * Probability (0..100%) of generating each tile (must sum to
//  * 1.0).
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_dirtProbability = 80;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_emptyProbability = 10;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_oilProbability = 7;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_waterProbability = 3;

// /**
//  * Lifetime of a fracking fluid emitter in seconds.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_frackingFluidEmitterLifetime = 5.0;

// /**
//  * Speed particles are sucked up the well.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_wellSuckSpeedInside = box2d.Testbed.FrackerSettings.k_tileHeight * 5.0;
// /**
//  * Speed particle are sucket towards the well bottom.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_wellSuckSpeedOutside = box2d.Testbed.FrackerSettings.k_tileWidth * 1.0;

// /**
//  * Time mouse button must be held before emitting fracking
//  * fluid.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_frackingFluidChargeTime = 1.0;

// /**
//  * Scores.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_scorePerOilParticle = 1;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_scorePerWaterParticle = -1;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_scorePerFrackingParticle = 0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.FrackerSettings.k_scorePerFrackingDeployment = -10;

// /**
//  * Oil Fracking simulator.
//  *
//  * Dig down to move the oil (red) to the well (gray). Try not to
//  * contaminate the ground water (blue). To deploy fracking fluid
//  * press 'space'.  Fracking fluid can be used to push other
//  * fluids to the well head and ultimately score points.
//  *
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Fracker = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor
//   this.__ctor__();
// }

// goog.inherits(box2d.Testbed.Fracker, box2d.Testbed.Test);

// /**
//  * Type of material in a tile.
//  * @enum {number}
//  */
// box2d.Testbed.Fracker.Material = {
//   EMPTY: 0,
//   DIRT: 1,
//   ROCK: 2,
//   OIL: 3,
//   WATER: 4,
//   WELL: 5,
//   PUMP: 6
// };

// /**
//  * Keep track of particle groups which are drawn up the well and
//  * tracks the score of the game.
//  * @constructor
//  * @extends {box2d.Testbed.ParticleGroupTracker}
//  */
// box2d.Testbed.Fracker.DestructionListener = function() {
//   box2d.Testbed.ParticleGroupTracker.call(this);
//   this.__ctor__();
// }

// goog.inherits(box2d.Testbed.Fracker.DestructionListener, box2d.Testbed.ParticleGroupTracker);

// /**
//  * @type {number}
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.m_score = 0;
// /**
//  * @type {number}
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.m_oil = 0;
// /**
//  * @type {box2d.b2World}
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.m_world = null;
// /**
//  * @type {box2d.b2DestructionListener}
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.m_previousListener = null;

// /**
//  * Initialize the score.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.__ctor__ = function() {}

// box2d.Testbed.Fracker.DestructionListener.prototype.__dtor__ = function() {
//   if (this.m_world) {
//     this.m_world.SetDestructionListener(this.m_previousListener);
//   }
// }

// /**
//  * Initialize the particle system and world, setting this class
//  * as a destruction listener for the world.
//  * @return {void}
//  * @param {box2d.b2World} world
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.Initialize = function(world) {
//   box2d.b2Assert(world !== null);
//   this.m_world = world;
//   this.m_world.SetDestructionListener(this);
// }

// /**
//  * Add to the current score.
//  * @return {void}
//  * @param {number} score
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.AddScore = function(score) {
//   this.m_score += score;
// }

// /**
//  * Get the current score.
//  * @return {number}
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.GetScore = function() {
//   return this.m_score;
// }

// /**
//  * Add to the remaining oil.
//  * @return {void}
//  * @param {number} oil
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.AddOil = function(oil) {
//   this.m_oil += oil;
// }

// /**
//  * Get the total oil.
//  * @return {number}
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.GetOil = function() {
//   return this.m_oil;
// }

// /**
//  * Update the score when certain particles are destroyed.
//  * @return {void}
//  * @param {box2d.b2ParticleSystem} particleSystem
//  * @param {number} index
//  */
// box2d.Testbed.Fracker.DestructionListener.prototype.SayGoodbyeParticle = function(particleSystem, index) {
//   box2d.b2Assert(particleSystem !== null);
//   ///  const void * const userData = particleSystem.GetUserDataBuffer()[index];
//   var userData = particleSystem.GetUserDataBuffer()[index];
//   if (userData) {
//     ///  const Material material = *((Material*)userData);
//     var material = userData;
//     switch (material) {
//       case box2d.Testbed.Fracker.Material.OIL:
//         this.AddScore(box2d.Testbed.FrackerSettings.k_scorePerOilParticle);
//         this.AddOil(-1);
//         break;
//       case box2d.Testbed.Fracker.Material.WATER:
//         this.AddScore(box2d.Testbed.FrackerSettings.k_scorePerWaterParticle);
//         break;
//       default:
//         break;
//     }
//   }
// }

// /**
//  * @type {box2d.b2Body}
//  */
// box2d.Testbed.Fracker.prototype.m_player = null;
// /**
//  * @type {number}
//  */
// box2d.Testbed.Fracker.prototype.m_wellX = box2d.Testbed.FrackerSettings.k_worldWidthTiles - (box2d.Testbed.FrackerSettings.k_worldWidthTiles / 4);
// /**
//  * @type {number}
//  */
// box2d.Testbed.Fracker.prototype.m_wellTop = box2d.Testbed.FrackerSettings.k_worldHeightTiles - 1;
// /**
//  * @type {number}
//  */
// box2d.Testbed.Fracker.prototype.m_wellBottom = box2d.Testbed.FrackerSettings.k_worldHeightTiles / 8;
// /**
//  * @type {box2d.Testbed.EmitterTracker}
//  */
// box2d.Testbed.Fracker.prototype.m_tracker = null;
// /**
//  * @type {boolean}
//  */
// box2d.Testbed.Fracker.prototype.m_allowInput = false;
// /**
//  * @type {number}
//  */
// box2d.Testbed.Fracker.prototype.m_frackingFluidChargeTime = -1.0;
// /**
//  * @type {Array.<box2d.Testbed.Fracker.Material>}
//  */
// box2d.Testbed.Fracker.prototype.m_material = null;
// /**
//  * @type {Array.<box2d.b2Body>}
//  */
// box2d.Testbed.Fracker.prototype.m_bodies = null;
// /**
//  * Set of particle groups the well has influence over.
//  * @type {box2d.Testbed.Fracker.DestructionListener}
//  */
// box2d.Testbed.Fracker.prototype.m_listener = null;

// /**
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.__ctor__ = function() {
//   this.m_tracker = new box2d.Testbed.EmitterTracker();
//   this.m_material = [];
//   this.m_bodies = [];
//   this.m_listener = new box2d.Testbed.Fracker.DestructionListener();

//   this.m_listener.Initialize(this.m_world);
//   this.m_particleSystem.SetRadius(box2d.Testbed.FrackerSettings.k_particleRadius);
//   this.InitializeLayout();
//   // Create the boundaries of the play area.
//   this.CreateGround();
//   // Create the well.
//   this.CreateWell();
//   // Create the geography / features (tiles of the world).
//   this.CreateGeo();
//   // Create the player.
//   this.CreatePlayer();
// }

// box2d.Testbed.Fracker.prototype.__dtor__ = function() {
//   this.m_listener.__dtor__();
// }

// /**
//  * Initialize the data structures used to track the material in
//  * each tile and the bodies associated with each tile.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.InitializeLayout = function() {
//   for (var i = 0; i < box2d.Testbed.FrackerSettings.k_worldTiles; ++i) {
//     this.m_material[i] = box2d.Testbed.Fracker.Material.EMPTY;
//     this.m_bodies[i] = null;
//   }
// }

// /**
//  * Get the material of the tile at the specified tile position.
//  * @return {box2d.Testbed.Fracker.Material}
//  * @param {number} x
//  * @param {number} y
//  */
// box2d.Testbed.Fracker.prototype.GetMaterial = function(x, y) {
//   ///  return *const_cast<Fracker*>(this).GetMaterialStorage(x, y);
//   return this.m_material[box2d.Testbed.Fracker.TileToArrayOffset(x, y)];
// }

// /**
//  * Set the material of the tile at the specified tile position.
//  * @return {void}
//  * @param {number} x
//  * @param {number} y
//  * @param {box2d.Testbed.Fracker.Material} material
//  */
// box2d.Testbed.Fracker.prototype.SetMaterial = function(x, y, material) {
//   ///  *GetMaterialStorage(x, y) = material;
//   this.m_material[box2d.Testbed.Fracker.TileToArrayOffset(x, y)] = material;
// }

// /**
//  * Get the body associated with the specified tile position.
//  * @return {box2d.b2Body}
//  * @param {number} x
//  * @param {number} y
//  */
// box2d.Testbed.Fracker.prototype.GetBody = function(x, y) {
//   ///  return *const_cast<Fracker*>(this).GetBodyStorage(x, y);
//   return this.m_bodies[box2d.Testbed.Fracker.TileToArrayOffset(x, y)];
// }

// /**
//  * Set the body associated with the specified tile position.
//  * @return {void}
//  * @param {number} x
//  * @param {number} y
//  * @param {box2d.b2Body} body
//  */
// box2d.Testbed.Fracker.prototype.SetBody = function(x, y, body) {
//   ///  b2Body** const currentBody = GetBodyStorage(x, y);
//   var currentBody = this.m_bodies[box2d.Testbed.Fracker.TileToArrayOffset(x, y)];
//   if (currentBody) {
//     this.m_world.DestroyBody(currentBody);
//   }
//   this.m_bodies[box2d.Testbed.Fracker.TileToArrayOffset(x, y)] = body;
// }

// /**
//  * Create the player.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.CreatePlayer = function() {
//   var bd = new box2d.b2BodyDef();
//   bd.type = box2d.b2BodyType.b2_kinematicBody;
//   this.m_player = this.m_world.CreateBody(bd);
//   var shape = new box2d.b2PolygonShape();
//   shape.SetAsBox(box2d.Testbed.FrackerSettings.k_tileHalfWidth,
//     box2d.Testbed.FrackerSettings.k_tileHalfHeight,
//     new box2d.b2Vec2(box2d.Testbed.FrackerSettings.k_tileHalfWidth,
//       box2d.Testbed.FrackerSettings.k_tileHalfHeight), 0);
//   this.m_player.CreateFixture(shape, box2d.Testbed.FrackerSettings.k_density);
//   this.m_player.SetTransform(
//     box2d.Testbed.Fracker.TileToWorld(
//       box2d.Testbed.FrackerSettings.k_worldWidthTiles / 2,
//       box2d.Testbed.FrackerSettings.k_worldHeightTiles / 2),
//     0);
// }

// /**
//  * Create the geography / features of the world.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.CreateGeo = function() {
//   box2d.b2Assert(box2d.Testbed.FrackerSettings.k_dirtProbability +
//     box2d.Testbed.FrackerSettings.k_emptyProbability +
//     box2d.Testbed.FrackerSettings.k_oilProbability +
//     box2d.Testbed.FrackerSettings.k_waterProbability === 100);
//   for (var x = 0; x < box2d.Testbed.FrackerSettings.k_worldWidthTiles; x++) {
//     for (var y = 0; y < box2d.Testbed.FrackerSettings.k_worldHeightTiles; y++) {
//       if (this.GetMaterial(x, y) !== box2d.Testbed.Fracker.Material.EMPTY) {
//         continue;
//       }
//       // Choose a tile at random.
//       var chance = Math.random() * 100.0;
//       // Create dirt if this is the bottom row or chance dictates it.
//       if (chance < box2d.Testbed.FrackerSettings.k_dirtProbability || y === 0) {
//         this.CreateDirtBlock(x, y);
//       } else if (chance < box2d.Testbed.FrackerSettings.k_dirtProbability +
//         box2d.Testbed.FrackerSettings.k_emptyProbability) {
//         this.SetMaterial(x, y, box2d.Testbed.Fracker.Material.EMPTY);
//       } else if (chance < box2d.Testbed.FrackerSettings.k_dirtProbability +
//         box2d.Testbed.FrackerSettings.k_emptyProbability +
//         box2d.Testbed.FrackerSettings.k_oilProbability) {
//         this.CreateReservoirBlock(x, y, box2d.Testbed.Fracker.Material.OIL);
//       } else {
//         this.CreateReservoirBlock(x, y, box2d.Testbed.Fracker.Material.WATER);
//       }
//     }
//   }
// }

// /**
//  * Create the boundary of the world.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.CreateGround = function() {
//   var bd = new box2d.b2BodyDef();
//   var ground = this.m_world.CreateBody(bd);
//   var shape = new box2d.b2ChainShape();
//   var bottomLeft = new box2d.b2Vec2(),
//     topRight = new box2d.b2Vec2();
//   box2d.Testbed.Fracker.GetExtents(bottomLeft, topRight);
//   var vertices = [
//     new box2d.b2Vec2(bottomLeft.x, bottomLeft.y),
//     new box2d.b2Vec2(topRight.x, bottomLeft.y),
//     new box2d.b2Vec2(topRight.x, topRight.y),
//     new box2d.b2Vec2(bottomLeft.x, topRight.y)
//   ];
//   shape.CreateLoop(vertices, 4);
//   ground.CreateFixture(shape, 0.0);
// }

// /**
//  * Create a dirt block at the specified world position.
//  * @return {void}
//  * @param {number} x
//  * @param {number} y
//  */
// box2d.Testbed.Fracker.prototype.CreateDirtBlock = function(x, y) {
//   var position = box2d.Testbed.Fracker.TileToWorld(x, y);
//   var bd = new box2d.b2BodyDef();
//   var body = this.m_world.CreateBody(bd);
//   var shape = new box2d.b2PolygonShape();
//   shape.SetAsBox(box2d.Testbed.FrackerSettings.k_tileHalfWidth,
//     box2d.Testbed.FrackerSettings.k_tileHalfHeight,
//     box2d.Testbed.Fracker.CenteredPosition(position), 0);
//   body.CreateFixture(shape, box2d.Testbed.FrackerSettings.k_density);
//   this.SetBody(x, y, body);
//   this.SetMaterial(x, y, box2d.Testbed.Fracker.Material.DIRT);
// }

// /**
//  * Create particles in a tile with resources.
//  * @return {void}
//  * @param {number} x
//  * @param {number} y
//  * @param {box2d.Testbed.Fracker.Material} material
//  */
// box2d.Testbed.Fracker.prototype.CreateReservoirBlock = function(x, y, material) {
//   var position = box2d.Testbed.Fracker.TileToWorld(x, y);
//   var shape = new box2d.b2PolygonShape();
//   this.SetMaterial(x, y, material);
//   shape.SetAsBox(box2d.Testbed.FrackerSettings.k_tileHalfWidth,
//     box2d.Testbed.FrackerSettings.k_tileHalfHeight,
//     box2d.Testbed.Fracker.CenteredPosition(position), 0);
//   var pd = new box2d.b2ParticleGroupDef();
//   pd.flags = box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_destructionListenerParticle;
//   pd.shape = shape;
//   pd.color.Copy(material === box2d.Testbed.Fracker.Material.OIL ?
//     box2d.Testbed.FrackerSettings.k_oilColor : box2d.Testbed.FrackerSettings.k_waterColor);
//   var group = this.m_particleSystem.CreateParticleGroup(pd);
//   this.m_listener.AddParticleGroup(group);

//   // Tag each particle with its type.
//   var particleCount = group.GetParticleCount();
//   ///  void** const userDataBuffer = m_particleSystem.GetUserDataBuffer() + group.GetBufferIndex();;
//   var userDataBuffer = this.m_particleSystem.GetUserDataBuffer();
//   var index = group.GetBufferIndex();
//   for (var i = 0; i < particleCount; ++i) {
//     ///  userDataBuffer[i] = GetMaterialStorage(x, y);
//     userDataBuffer[index + i] = this.m_material[box2d.Testbed.Fracker.TileToArrayOffset(x, y)];
//   }
//   // Keep track of the total available oil.
//   if (material === box2d.Testbed.Fracker.Material.OIL) {
//     this.m_listener.AddOil(particleCount);
//   }
// }

// /**
//  * Create a well and the region which applies negative pressure
//  * to suck out fluid.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.CreateWell = function() {
//   for (var y = this.m_wellBottom; y <= this.m_wellTop; y++) {
//     this.SetMaterial(this.m_wellX, y, box2d.Testbed.Fracker.Material.WELL);
//   }
// }

// /**
//  * Create a fracking fluid emitter.
//  * @return {void}
//  * @param {box2d.b2Vec2} position
//  */
// box2d.Testbed.Fracker.prototype.CreateFrackingFluidEmitter = function(position) {
//   var groupDef = new box2d.b2ParticleGroupDef();
//   var group = this.m_particleSystem.CreateParticleGroup(groupDef);
//   this.m_listener.AddParticleGroup(group);
//   var emitter = new box2d.Testbed.RadialEmitter();
//   emitter.SetGroup(group);
//   emitter.SetParticleSystem(this.m_particleSystem);
//   emitter.SetPosition(box2d.Testbed.Fracker.CenteredPosition(position));
//   emitter.SetVelocity(new box2d.b2Vec2(0.0, -box2d.Testbed.FrackerSettings.k_tileHalfHeight));
//   emitter.SetSpeed(box2d.Testbed.FrackerSettings.k_tileHalfWidth * 0.1);
//   emitter.SetSize(new box2d.b2Vec2(box2d.Testbed.FrackerSettings.k_tileHalfWidth,
//     box2d.Testbed.FrackerSettings.k_tileHalfHeight));
//   emitter.SetEmitRate(20.0);
//   emitter.SetColor(box2d.Testbed.FrackerSettings.k_frackingFluidColor);
//   emitter.SetParticleFlags(box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_viscousParticle);
//   this.m_tracker.Add(emitter, box2d.Testbed.FrackerSettings.k_frackingFluidEmitterLifetime);
//   this.m_listener.AddScore(box2d.Testbed.FrackerSettings.k_scorePerFrackingDeployment);
// }

// /**
//  * Update the player's position.
//  * @return {void}
//  * @param {number} playerX
//  * @param {number} playerY
//  */
// box2d.Testbed.Fracker.prototype.SetPlayerPosition = function(playerX, playerY) {
//   var playerPosition = this.m_player.GetTransform().p;
//   var currentPlayerX = [0],
//     currentPlayerY = [0];
//   box2d.Testbed.Fracker.WorldToTile(playerPosition, currentPlayerX, currentPlayerY);

//   playerX = box2d.b2Clamp(playerX, 0, box2d.Testbed.FrackerSettings.k_worldWidthTiles - 1);
//   playerY = box2d.b2Clamp(playerY, 0, box2d.Testbed.FrackerSettings.k_worldHeightTiles - 1);

//   // Only update if the player has moved and isn't attempting to
//   // move through the well.
//   if (this.GetMaterial(playerX, playerY) !== box2d.Testbed.Fracker.Material.WELL &&
//     (currentPlayerX[0] !== playerX ||
//       currentPlayerY[0] !== playerY)) {
//     // Try to deploy any fracking fluid that was charging.
//     this.DeployFrackingFluid();
//     // Move the player.
//     this.m_player.SetTransform(box2d.Testbed.Fracker.TileToWorld(playerX, playerY), 0);
//   }
// }

// /**
//  * Try to deploy fracking fluid at the player's position,
//  * returning true if successful.
//  * @return {boolean}
//  */
// box2d.Testbed.Fracker.prototype.DeployFrackingFluid = function() {
//   var deployed = false;
//   var playerPosition = this.m_player.GetTransform().p;
//   if (this.m_frackingFluidChargeTime > box2d.Testbed.FrackerSettings.k_frackingFluidChargeTime) {
//     this.CreateFrackingFluidEmitter(playerPosition);
//     deployed = true;
//   }
//   this.m_frackingFluidChargeTime = -1.0;
//   return deployed;
// }

// /**
//  * Destroy all particles in the box specified by a set of tile
//  * coordinates.
//  * @return {void}
//  * @param {number} startX
//  * @param {number} startY
//  * @param {number} endX
//  * @param {number} endY
//  */
// box2d.Testbed.Fracker.prototype.DestroyParticlesInTiles = function(startX, startY, endX, endY) {
//   var shape = new box2d.b2PolygonShape();
//   var width = endX - startX + 1;
//   var height = endY - startY + 1;
//   var centerX = startX + width / 2;
//   var centerY = startY + height / 2;
//   shape.SetAsBox(
//     box2d.Testbed.FrackerSettings.k_tileHalfWidth * width,
//     box2d.Testbed.FrackerSettings.k_tileHalfHeight * height);
//   var killLocation = new box2d.b2Transform();
//   killLocation.Set(box2d.Testbed.Fracker.CenteredPosition(box2d.Testbed.Fracker.TileToWorld(centerX, centerY)), 0);
//   this.m_particleSystem.DestroyParticlesInShape(shape, killLocation);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Joint} joint
//  */
// box2d.Testbed.Fracker.prototype.JointDestroyed = function(joint) {
//   box2d.Testbed.Test.prototype.JointDestroyed.call(this, joint);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.Fracker.prototype.ParticleGroupDestroyed = function(group) {
//   box2d.Testbed.Test.prototype.ParticleGroupDestroyed.call(this, group);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.Fracker.prototype.BeginContact = function(contact) {
//   box2d.Testbed.Test.prototype.BeginContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.Fracker.prototype.EndContact = function(contact) {
//   box2d.Testbed.Test.prototype.EndContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2Manifold} oldManifold
//  */
// box2d.Testbed.Fracker.prototype.PreSolve = function(contact, oldManifold) {
//   box2d.Testbed.Test.prototype.PreSolve.call(this, contact, oldManifold);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2ContactImpulse} impulse
//  */
// box2d.Testbed.Fracker.prototype.PostSolve = function(contact, impulse) {
//   box2d.Testbed.Test.prototype.PostSolve.call(this, contact, impulse);
// }

// /**
//  * a = left, d = right, a = up, s = down, e = deploy fracking
//  * fluid.
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.Fracker.prototype.Keyboard = function(key) {
//   // Only allow 1 move per simulation step.
//   if (!this.m_allowInput) {
//     return;
//   }

//   var playerPosition = this.m_player.GetTransform().p;
//   var playerX = [0],
//     playerY = [0];
//   box2d.Testbed.Fracker.WorldToTile(playerPosition, playerX, playerY);
//   switch (key) {
//     case goog.events.KeyCodes.A:
//       playerX[0]--;
//       break;
//     case goog.events.KeyCodes.S:
//       playerY[0]--;
//       break;
//     case goog.events.KeyCodes.D:
//       playerX[0]++;
//       break;
//     case goog.events.KeyCodes.W:
//       playerY[0]++;
//       break;
//     case goog.events.KeyCodes.E:
//       // Start charging the fracking fluid.
//       if (this.m_frackingFluidChargeTime < 0.0) {
//         this.m_frackingFluidChargeTime = 0.0;
//       } else {
//         // KeyboardUp() in freeglut (at least on OSX) is called
//         // repeatedly while a key is held.  This means there isn't
//         // a way for fracking fluid to be deployed when the user
//         // releases 'e'.  This works around the issue by attempting
//         // to deploy the fluid when 'e' is pressed again.
//         this.DeployFrackingFluid();
//       }
//       break;
//     default:
//       box2d.Testbed.Test.prototype.Keyboard.call(this, key);
//       break;
//   }
//   this.SetPlayerPosition(playerX[0], playerY[0]);
//   this.m_allowInput = false;
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.Fracker.prototype.KeyboardUp = function(key) {
//   box2d.Testbed.Test.prototype.KeyboardUp.call(this, key);
// }

// /**
//  * Start preparing the fracking fluid.
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Fracker.prototype.MouseDown = function(p) {
//   box2d.Testbed.Test.prototype.MouseDown.call(this, p);
//   this.m_frackingFluidChargeTime = 0.0;
// }

// /**
//  * Try to deploy the fracking fluid or move the player.
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Fracker.prototype.MouseUp = function(p) {
//   box2d.Testbed.Test.prototype.MouseUp.call(this, p);
//   if (!this.m_allowInput) {
//     return;
//   }

//   // If fracking fluid isn't being released, move the player.
//   if (!this.DeployFrackingFluid()) {
//     var playerPosition = this.m_player.GetTransform().p;
//     var playerX = [0],
//       playerY = [0];
//     box2d.Testbed.Fracker.WorldToTile(playerPosition, playerX, playerY);
//     // Move the player towards the mouse position, preferring to move
//     // along the axis with the maximal distance from the cursor.
//     var distance = box2d.b2Sub_V2_V2(p, box2d.Testbed.Fracker.CenteredPosition(playerPosition), new box2d.b2Vec2());
//     var absDistX = Math.abs(distance.x);
//     var absDistY = Math.abs(distance.y);
//     if (absDistX > absDistY &&
//       absDistX >= box2d.Testbed.FrackerSettings.k_tileHalfWidth) {
//       playerX[0] += distance.x > 0.0 ? 1 : -1;
//     } else if (absDistY >= box2d.Testbed.FrackerSettings.k_tileHalfWidth) {
//       playerY[0] += distance.y > 0.0 ? 1 : -1;
//     }
//     this.SetPlayerPosition(playerX[0], playerY[0]);
//   }
//   this.m_allowInput = false;
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Fracker.prototype.MouseMove = function(p) {
//   box2d.Testbed.Test.prototype.MouseMove.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Fracker.prototype.Step = function(settings) {
//   box2d.Testbed.Test.prototype.Step.call(this, settings);
//   var dt = 1.0 / settings.hz;
//   this.m_tracker.Step(dt);
//   // Allow the user to move again.
//   this.m_allowInput = true;
//   // Charge up fracking fluid.
//   if (this.m_frackingFluidChargeTime >= 0.0) {
//     this.m_frackingFluidChargeTime += dt;
//   }

//   var playerPosition = this.m_player.GetTransform().p;
//   var playerX = [0],
//     playerY = [0];
//   box2d.Testbed.Fracker.WorldToTile(playerPosition, playerX, playerY);
//   // If the player is moved to a square with dirt, remove it.
//   if (this.GetMaterial(playerX[0], playerY[0]) === box2d.Testbed.Fracker.Material.DIRT) {
//     this.SetMaterial(playerX[0], playerY[0], box2d.Testbed.Fracker.Material.EMPTY);
//     this.SetBody(playerX[0], playerY[0], null);
//   }

//   // Destroy particles at the top of the well.
//   this.DestroyParticlesInTiles(this.m_wellX, this.m_wellTop, this.m_wellX, this.m_wellTop);

//   // Only move particles in the groups being tracked.
//   ///  const std.set<b2ParticleGroup*> &particleGroups = m_listener.GetParticleGroups();
//   var particleGroups = this.m_listener.GetParticleGroups();
//   ///  for (std.set<b2ParticleGroup*>.const_iterator it = particleGroups.begin(); it !== particleGroups.end(); ++it)
//   for (var it = 0; it < particleGroups.length; ++it) {
//     ///  b2ParticleGroup * const particleGroup = *it;
//     var particleGroup = particleGroups[it];
//     var index = particleGroup.GetBufferIndex();
//     ///  const b2Vec2* const positionBuffer = m_particleSystem.GetPositionBuffer() + index;
//     var positionBuffer = this.m_particleSystem.GetPositionBuffer();
//     ///  b2Vec2* const velocityBuffer = m_particleSystem.GetVelocityBuffer() + index;
//     var velocityBuffer = this.m_particleSystem.GetVelocityBuffer();
//     var particleCount = particleGroup.GetParticleCount();
//     for (var i = 0; i < particleCount; ++i) {
//       // Apply velocity to particles near the bottom or in the well
//       // sucking them up to the top.
//       var wellEnd = box2d.Testbed.Fracker.CenteredPosition(box2d.Testbed.Fracker.TileToWorld(this.m_wellX, this.m_wellBottom - 2));
//       var particlePosition = positionBuffer[index + i];
//       // Distance from the well's bottom.
//       ///  const b2Vec2 distance = particlePosition - wellEnd;
//       var distance = box2d.b2Sub_V2_V2(particlePosition, wellEnd, new box2d.b2Vec2())
//         // Distance from either well side wall.
//       var absDistX = Math.abs(distance.x);
//       if (absDistX < box2d.Testbed.FrackerSettings.k_tileWidth &&
//         // If the particles are just below the well bottom.
//         distance.y > box2d.Testbed.FrackerSettings.k_tileWidth * -2.0 &&
//         distance.y < 0.0) {
//         // Suck the particles towards the end of the well.
//         ///  b2Vec2 velocity = wellEnd - particlePosition;
//         var velocity = box2d.b2Sub_V2_V2(wellEnd, particlePosition, new box2d.b2Vec2());
//         velocity.Normalize();
//         ///  velocityBuffer[i] = velocity * box2d.Testbed.FrackerSettings.k_wellSuckSpeedOutside;
//         velocityBuffer[index + i].Copy(velocity.SelfMul(box2d.Testbed.FrackerSettings.k_wellSuckSpeedOutside));
//       } else if (absDistX <= box2d.Testbed.FrackerSettings.k_tileHalfWidth && distance.y > 0.0) {
//         // Suck the particles up the well with a random
//         // x component moving them side to side in the well.
//         var randomX = (Math.random() * box2d.Testbed.FrackerSettings.k_tileHalfWidth) - distance.x;
//         var velocity = new box2d.b2Vec2(randomX, box2d.Testbed.FrackerSettings.k_tileHeight);
//         velocity.Normalize();
//         ///  velocityBuffer[i] = velocity * box2d.Testbed.FrackerSettings.k_wellSuckSpeedInside;
//         velocityBuffer[index + i].Copy(velocity.SelfMul(box2d.Testbed.FrackerSettings.k_wellSuckSpeedInside));
//       }
//     }
//   }

//   // Draw everything.
//   this.DrawPlayer();
//   this.DrawWell();
//   this.DrawScore();
// }

// /**
//  * Render the well.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.DrawWell = function() {
//   for (var y = this.m_wellBottom; y <= this.m_wellTop; ++y) {
//     this.DrawQuad(box2d.Testbed.Fracker.TileToWorld(this.m_wellX, y), box2d.Testbed.FrackerSettings.k_wellColor);
//   }
// }

// /**
//  * Render the player / fracker.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.DrawPlayer = function() {
//   this.DrawQuad(
//     this.m_player.GetTransform().p,
//     box2d.Testbed.Fracker.LerpColor(box2d.Testbed.FrackerSettings.k_playerColor,
//       box2d.Testbed.FrackerSettings.k_playerFrackColor,
//       box2d.b2Max(this.m_frackingFluidChargeTime /
//         box2d.Testbed.FrackerSettings.k_frackingFluidChargeTime, 0.0)),
//     true);
// }

// /**
//  * Render the score and the instructions / keys.
//  * @return {void}
//  */
// box2d.Testbed.Fracker.prototype.DrawScore = function() {
//   ///  char score[512];
//   ///  sprintf(score, "Score: %d, Remaining Oil %d",
//   ///          m_listener.GetScore(), m_listener.GetOil());
//   ///  const char *lines[] = { score,  "Move: a,s,d,w   Fracking Fluid: e" };
//   ///  for (uint32 i = 0; i < B2_ARRAY_SIZE(lines); ++i)
//   ///  {
//   ///    m_debugDraw.DrawString(5, m_textLine, lines[i]);
//   ///    m_textLine += DRAW_STRING_NEW_LINE;
//   ///  }
//   this.m_debugDraw.DrawString(5, this.m_textLine, "Score: %d, Remaining Oil %d", this.m_listener.GetScore(), this.m_listener.GetOil());
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
//   this.m_debugDraw.DrawString(5, this.m_textLine, "Move: a,s,d,w   Fracking Fluid: e");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
// }

// /**
//  * Draw a quad at position of color that is either just an
//  * outline (fill = false) or solid (fill = true).
//  * @return {void}
//  * @param {box2d.b2Vec2} position
//  * @param {box2d.b2Color} color
//  * @param {boolean=} fill
//  */
// box2d.Testbed.Fracker.prototype.DrawQuad = function(position, color, fill) {
//   fill = fill || false;
//   ///  b2Vec2 verts[4];
//   var verts = box2d.b2Vec2.MakeArray(4);
//   var maxX = position.x + box2d.Testbed.FrackerSettings.k_tileWidth;
//   var maxY = position.y + box2d.Testbed.FrackerSettings.k_tileHeight;
//   verts[0].Set(position.x, maxY);
//   verts[1].Set(position.x, position.y);
//   verts[2].Set(maxX, position.y);
//   verts[3].Set(maxX, maxY);
//   if (fill) {
//     this.m_debugDraw.DrawPolygon(verts, 4, color);
//   } else {
//     this.m_debugDraw.DrawSolidPolygon(verts, 4, color);
//   }
// }

// ///  // Get a pointer to the material of the tile at the specified position.
// ///  Material* GetMaterialStorage(const int32 x, const int32 y)
// ///  {
// ///    return &m_material[box2d.Testbed.Fracker.TileToArrayOffset(x, y)];
// ///  }

// ///  // A pointer to the body storage associated with the specified tile
// ///  // position.
// ///  b2Body** GetBodyStorage(const int32 x, const int32 y)
// ///  {
// ///    return &m_bodies[box2d.Testbed.Fracker.TileToArrayOffset(x, y)];
// ///  }

// /**
//  * @export
//  * @return {number}
//  */
// box2d.Testbed.Fracker.prototype.GetDefaultViewZoom = function() {
//   return 0.1;
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Fracker.Create = function(canvas, settings) {
//   return new box2d.Testbed.Fracker(canvas, settings);
// }

// /**
//  * Get the bottom left position of the world in world units.
//  * @return {void}
//  * @param {box2d.b2Vec2} bottomLeft
//  */
// box2d.Testbed.Fracker.GetBottomLeft = function(bottomLeft) {
//   bottomLeft.Set(box2d.Testbed.FrackerSettings.k_worldCenterX -
//     box2d.Testbed.FrackerSettings.k_worldHalfWidth,
//     box2d.Testbed.FrackerSettings.k_worldCenterY -
//     box2d.Testbed.FrackerSettings.k_worldHalfHeight);
// }

// /**
//  * Get the extents of the world in world units.
//  * @return {void}
//  * @param {box2d.b2Vec2} bottomLeft
//  * @param {box2d.b2Vec2} topRight
//  */
// box2d.Testbed.Fracker.GetExtents = function(bottomLeft, topRight) {
//   box2d.Testbed.Fracker.GetBottomLeft(bottomLeft);
//   topRight.Set(box2d.Testbed.FrackerSettings.k_worldCenterX +
//     box2d.Testbed.FrackerSettings.k_worldHalfWidth,
//     box2d.Testbed.FrackerSettings.k_worldCenterY +
//     box2d.Testbed.FrackerSettings.k_worldHalfHeight);
// }

// ///  // Convert a point in world coordintes to a tile location
// /**
//  * @return {void}
//  * @param {box2d.b2Vec2} position
//  * @param {Array.<number>} x
//  * @param {Array.<number>} y
//  */
// box2d.Testbed.Fracker.WorldToTile = function(position, x, y) {
//   // Translate relative to the world center and scale based upon the
//   // tile size.
//   var bottomLeft = new box2d.b2Vec2();
//   box2d.Testbed.Fracker.GetBottomLeft(bottomLeft);
//   x[0] = Math.floor(((position.x - bottomLeft.x) /
//       box2d.Testbed.FrackerSettings.k_tileWidth) +
//     box2d.Testbed.FrackerSettings.k_tileHalfWidth);
//   y[0] = Math.floor(((position.y - bottomLeft.y) /
//       box2d.Testbed.FrackerSettings.k_tileHeight) +
//     box2d.Testbed.FrackerSettings.k_tileHalfHeight);
// }

// /**
//  * Convert a tile position to a point  in world coordinates.
//  * @return {box2d.b2Vec2}
//  * @param {number} x
//  * @param {number} y
//  * @param {box2d.b2Vec2=} out
//  */
// box2d.Testbed.Fracker.TileToWorld = function(x, y, out) {
//   out = out || new box2d.b2Vec2();
//   // Scale based upon the tile size and translate relative to the world
//   // center.
//   var bottomLeft = new box2d.b2Vec2();
//   box2d.Testbed.Fracker.GetBottomLeft(bottomLeft);
//   return out.Set(
//     (x * box2d.Testbed.FrackerSettings.k_tileWidth) + bottomLeft.x, (y * box2d.Testbed.FrackerSettings.k_tileHeight) + bottomLeft.y);
// }

// /**
//  * Calculate the offset within an array of all world tiles using
//  * the specified tile coordinates.
//  * @return {number}
//  * @param {number} x
//  * @param {number} y
//  */
// box2d.Testbed.Fracker.TileToArrayOffset = function(x, y) {
//   box2d.b2Assert(x >= 0);
//   box2d.b2Assert(x < box2d.Testbed.FrackerSettings.k_worldWidthTiles);
//   box2d.b2Assert(y >= 0);
//   box2d.b2Assert(y < box2d.Testbed.FrackerSettings.k_worldHeightTiles);
//   return x + (y * box2d.Testbed.FrackerSettings.k_worldWidthTiles);
// }

// /**
//  * Calculate the center of a tile position in world units.
//  * @return {box2d.b2Vec2}
//  * @param {box2d.b2Vec2} position
//  * @param {box2d.b2Vec2=} out
//  */
// box2d.Testbed.Fracker.CenteredPosition = function(position, out) {
//   out = out || new box2d.b2Vec2();
//   return out.Set(position.x + box2d.Testbed.FrackerSettings.k_tileHalfWidth,
//     position.y + box2d.Testbed.FrackerSettings.k_tileHalfHeight);
// }

// /**
//  * Interpolate between color a and b using t.
//  * @return {box2d.b2Color}
//  * @param {box2d.b2Color} a
//  * @param {box2d.b2Color} b
//  * @param {number} t
//  */
// box2d.Testbed.Fracker.LerpColor = function(a, b, t) {
//   return new box2d.b2Color(box2d.Testbed.Fracker.Lerp(a.r, b.r, t),
//     box2d.Testbed.Fracker.Lerp(a.g, b.g, t),
//     box2d.Testbed.Fracker.Lerp(a.b, b.b, t));
// }

// /**
//  * Interpolate between a and b using t.
//  * @return {number}
//  * @param {number} a
//  * @param {number} b
//  * @param {number} t
//  */
// box2d.Testbed.Fracker.Lerp = function(a, b, t) {
//   return a * (1.0 - t) + b * t;
// }

// //#endif
