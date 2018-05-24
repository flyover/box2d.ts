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

// #if B2_ENABLE_PARTICLE

import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class Sandbox extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new Sandbox();
  }
}

// #endif

// //#if B2_ENABLE_PARTICLE

// goog.provide('box2d.Testbed.Sandbox');

// goog.require('box2d.Testbed.Test');
// goog.require('box2d.Testbed.RadialEmitter');

// /**
//  * The following parameters are not static const members of the
//  * Sandbox class with values assigned inline as it can result in
//  * link errors when using gcc.
//  */
// box2d.Testbed.SandboxParams = {};

// /**
//  * Total possible pump squares
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_maxPumps = 5;
// /**
//  * Total possible emitters
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_maxEmitters = 5;
// /**
//  * Number of seconds to push one direction or the other on the
//  * pumps
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_flipTime = 6;
// /**
//  * Radius of a tile
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_tileRadius = 2;
// /**
//  * Diameter of a tile
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_tileDiameter = 4;
// /**
//  * Pump radius; slightly smaller than a tile
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_pumpRadius = 2.0 - 0.05;

// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_playfieldLeftEdge = -20;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_playfieldRightEdge = 20;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_playfieldBottomEdge = 40;

// /**
//  * The world size in the TILE
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_tileWidth = 10;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_tileHeight = 11;

// /**
//  * Particles/second
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_defaultEmitterRate = 30;
// /**
//  * Fit cleanly inside one block
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_defaultEmitterSize = 3;
// /**
//  * How fast particles coming out of the particles should drop
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_particleExitSpeedY = -9.8;
// /**
//  * How hard the pumps can push
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_pumpForce = 600;

// /**
//  * Number of *special* particles.
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.SandboxParams.k_numberOfSpecialParticles = 256;

// /**
//  * Class which tracks a set of particles and applies a special
//  * effect to them.
//  * @constructor
//  * @extends {box2d.b2DestructionListener}
//  */
// box2d.Testbed.SpecialParticleTracker = function() {
//   box2d.b2DestructionListener.call(this);
//   this.__ctor__();
// }

// goog.inherits(box2d.Testbed.SpecialParticleTracker, box2d.b2DestructionListener);

// /**
//  * Set of particle handles used to track special particles.
//  * @type {Array.<box2d.b2ParticleHandle>}
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.m_particles = null;

// /**
//  * Pointer to the world used to enable / disable this class as a
//  * destruction listener.
//  * @type {box2d.b2World}
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.m_world = null;
// /**
//  * Pointer to the particle system used to retrieve particle
//  * handles.
//  * @type {box2d.b2ParticleSystem}
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.m_particleSystem = null;
// /**
//  * Current offset into this.m_colorOscillationPeriod.
//  * @type {number}
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.m_colorOscillationTime = 0.0;
// /**
//  * Color oscillation period in seconds.
//  * @type {number}
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.m_colorOscillationPeriod = 2.0;

// /**
//  * Initialize
//  * @return {void}
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.__ctor__ = function() {
//   this.m_particles = [];
// }

// /**
//  * @return {void}
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.__dtor__ = function() {
//   this.m_world.SetDestructionListener(null);
// }

// /**
//  * Register this class as a destruction listener so that it's
//  * possible to keep track of special particles.
//  * @return {void}
//  * @param {box2d.b2World} world
//  * @param {box2d.b2ParticleSystem} system
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.Init = function(world, system) {
//   box2d.b2Assert(world !== null);
//   box2d.b2Assert(system !== null);
//   this.m_world = world;
//   this.m_particleSystem = system;
//   this.m_world.SetDestructionListener(this);
// }

// /**
//  * Add as many of the specified particles to the set of special
//  * particles.
//  * @return {void}
//  * @param {Array.<number>} particleIndices
//  * @param {number} numberOfParticles
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.Add = function(particleIndices, numberOfParticles) {
//   box2d.b2Assert(this.m_particleSystem !== null);
//   for (var i = 0; i < numberOfParticles && this.m_particles.length < box2d.Testbed.SandboxParams.k_numberOfSpecialParticles; ++i) {
//     var particleIndex = particleIndices[i];
//     this.m_particleSystem.SetParticleFlags(particleIndex, this.m_particleSystem.GetFlagsBuffer()[particleIndex] | box2d.b2ParticleFlag.b2_destructionListenerParticle);
//     this.m_particles.push(this.m_particleSystem.GetParticleHandleFromIndex(particleIndex));
//   }
// }

// /**
//  * Apply effects to special particles.
//  * @return {void}
//  * @param {number} dt
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.Step = function(dt) {
//   function fmod(a, b) {
//     return (a - (Math.floor(a / b) * b));
//   }
//   // Oscillate the shade of color over this.m_colorOscillationPeriod seconds.
//   this.m_colorOscillationTime = fmod(this.m_colorOscillationTime + dt,
//     this.m_colorOscillationPeriod);
//   var colorCoeff = 2.0 * Math.abs(
//     (this.m_colorOscillationTime / this.m_colorOscillationPeriod) - 0.5);
//   var color = new box2d.b2ParticleColor(
//     128 + (128.0 * (1.0 - colorCoeff)),
//     128 + (256.0 * Math.abs(0.5 - colorCoeff)),
//     128 + (128.0 * colorCoeff), 255);
//   // Update the color of all special particles.
//   for (var i = 0; i < this.m_particles.length; ++i) {
//     this.m_particleSystem.GetColorBuffer()[this.m_particles[i].GetIndex()].Copy(color);
//   }
// }

// /**
//  * @return {void}
//  * @param {box2d.b2Joint} joint
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.SayGoodbyeJoint = function(joint) {}

// /**
//  * @return {void}
//  * @param {box2d.b2Fixture} fixture
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.SayGoodbyeFixture = function(fixture) {}

// /**
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.SayGoodbyeParticleGroup = function(group) {}

// /**
//  * When a particle is about to be destroyed, remove it from the
//  * list of special particles as the handle will become invalid.
//  * @return {void}
//  * @param {box2d.b2ParticleSystem} particleSystem
//  * @param {number} index
//  */
// box2d.Testbed.SpecialParticleTracker.prototype.SayGoodbyeParticle = function(particleSystem, index) {
//   if (particleSystem !== this.m_particleSystem)
//     return;

//   // NOTE: user data could be used as an alternative method to look up
//   // the local handle pointer from the index.
//   var length = this.m_particles.length;
//   this.m_particles = this.m_particles.filter(function(value) {
//     return value.GetIndex() !== index;
//   });
//   box2d.b2Assert((length - this.m_particles.length) === 1);
// }

// /**
//  * Sandbox test creates a maze of faucets, pumps, ramps,
//  * circles, and blocks based on a string constant.  Please
//  * modify and play with this string to make new mazes, and also
//  * add new maze elements!
//  *
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Sandbox = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor
//   this.__ctor__();
// }

// goog.inherits(box2d.Testbed.Sandbox, box2d.Testbed.Test);

// /**
//  * Count of faucets in the world
//  * @type {number}
//  */
// box2d.Testbed.Sandbox.prototype.m_faucetEmitterIndex = 0;
// /**
//  * Count of pumps in the world
//  * @type {number}
//  */
// box2d.Testbed.Sandbox.prototype.m_pumpIndex = 0;

// /**
//  * How long have we been pushing the pumps?
//  * @type {number}
//  */
// box2d.Testbed.Sandbox.prototype.m_pumpTimer = 0.0;
// /**
//  * Particle creation flags
//  * @type {number}
//  */
// box2d.Testbed.Sandbox.prototype.m_particleFlags = 0;

// /**
//  * Pump force
//  * @type {box2d.b2Vec2}
//  */
// box2d.Testbed.Sandbox.prototype.m_pumpForce = null;

// /**
//  * The shape we will use for the killfield
//  * @type {box2d.b2PolygonShape}
//  */
// box2d.Testbed.Sandbox.prototype.m_killFieldShape = null;
// /**
//  * Transform for the killfield shape
//  * @type {box2d.b2Transform}
//  */
// box2d.Testbed.Sandbox.prototype.m_killFieldTransform = null;

// /**
//  * Pumps and emitters
//  * @type {Array.<box2d.b2Body>}
//  */
// box2d.Testbed.Sandbox.prototype.m_pumps = null;
// /**
//  * @type {Array.<box2d.Testbed.RadialEmitter>}
//  */
// box2d.Testbed.Sandbox.prototype.m_emitters = null;

// /**
//  * Special particle tracker.
//  * @type {box2d.Testbed.SpecialParticleTracker}
//  */
// box2d.Testbed.Sandbox.prototype.m_specialTracker = null;

// /**
//  * @const
//  * @type {Array.<box2d.Testbed.ParticleParameter.Value>}
//  */
// box2d.Testbed.Sandbox.k_paramValues = [
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "water"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_waterParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions | box2d.Testbed.ParticleParameter.Options.OptionStrictContacts, "water (strict)"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_powderParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "powder"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_tensileParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "tensile"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "viscous"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_powderParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "tensile powder"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_powderParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "viscous powder"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_tensileParticle | box2d.b2ParticleFlag.b2_powderParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "viscous tensile powder"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_viscousParticle | box2d.b2ParticleFlag.b2_tensileParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "tensile viscous water")
// ];

// /**
//  * @const
//  * @type {Array.<box2d.Testbed.ParticleParameter.Definition>}
//  */
// box2d.Testbed.Sandbox.k_paramDef = [
//   new box2d.Testbed.ParticleParameter.Definition(box2d.Testbed.Sandbox.k_paramValues)
// ];
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Sandbox.k_paramDefCount = box2d.Testbed.Sandbox.k_paramDef.length;

// box2d.Testbed.Sandbox.prototype.__ctor__ = function() {
//   // We need some ground for the pumps to slide against
//   var bd = new box2d.b2BodyDef();
//   var ground = this.m_world.CreateBody(bd);

//   // Reset our pointers
//   this.m_emitters = [];
//   for (var i = 0; i < box2d.Testbed.SandboxParams.k_maxEmitters; i++) {
//     this.m_emitters[i] = null;
//   }

//   this.m_pumps = [];
//   for (var i = 0; i < box2d.Testbed.SandboxParams.k_maxPumps; i++) {
//     this.m_pumps[i] = null;
//   }

//   this.m_world.SetGravity(new box2d.b2Vec2(0.0, -20));

//   // Create physical box, no top
//   {
//     {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(-40, -10),
//         new box2d.b2Vec2(40, -10),
//         new box2d.b2Vec2(40, 0),
//         new box2d.b2Vec2(-40, 0)
//       ];
//       shape.Set(vertices, 4);
//       ground.CreateFixture(shape, 0.0);
//     }

//     {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldLeftEdge - 20, -1),
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldLeftEdge, -1),
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldLeftEdge, 50),
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldLeftEdge - 20, 50)
//       ];
//       shape.Set(vertices, 4);
//       ground.CreateFixture(shape, 0.0);
//     }

//     {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldRightEdge, -1),
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldRightEdge + 20, -1),
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldRightEdge + 20, 50),
//         new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_playfieldRightEdge, 50)
//       ];
//       shape.Set(vertices, 4);
//       ground.CreateFixture(shape, 0.0);
//     }
//   }

//   this.m_particleSystem.SetRadius(0.25);

//   this.m_specialTracker = new box2d.Testbed.SpecialParticleTracker();
//   this.m_specialTracker.Init(this.m_world, this.m_particleSystem);

//   this.m_pumpTimer = 0;

//   this.SetupMaze();

//   // Create killfield shape and transform
//   this.m_killFieldShape = new box2d.b2PolygonShape();
//   this.m_killFieldShape.SetAsBox(box2d.Testbed.SandboxParams.k_playfieldRightEdge - box2d.Testbed.SandboxParams.k_playfieldLeftEdge, 1);

//   // Put this at the bottom of the world
//   this.m_killFieldTransform = new box2d.b2Transform();
//   var loc = new box2d.b2Vec2(-20, 1);
//   this.m_killFieldTransform.Set(loc, 0);

//   // Setup particle parameters.
//   testbed.Main.SetParticleParameters(box2d.Testbed.Sandbox.k_paramDef, box2d.Testbed.Sandbox.k_paramDefCount);
//   this.m_particleFlags = testbed.Main.GetParticleParameterValue();
//   testbed.Main.SetRestartOnParticleParameterChange(false);
// }

// box2d.Testbed.Sandbox.prototype.__dtor__ = function() {
//   // deallocate our emitters
//   for (var i = 0; i < this.m_faucetEmitterIndex; i++) {
//     ///  delete this.m_emitters[i];
//     this.m_emitters[i] = null;
//   }
// }

// // Create a maze of blocks, ramps, pumps, and faucets.
// // The maze is defined in a string; feel free to modify it.
// // Items in the maze include:
// //   # = a block
// //   / = a right-to-left ramp triangle
// //   A = a left-to-right ramp triangle (can't be \ or string formatting
// //       would be weird)
// //   r, g, b = colored faucets pointing down
// //   p = a pump block that rocks back and forth.  You can drag them
// //       yourself with your finger.
// //   C = a loose circle
// //   K = an ignored placeholder for a killfield to remove particles;
// //       entire bottom row is a killfield.
// box2d.Testbed.Sandbox.prototype.SetupMaze = function() {
//   var maze =
//     "# r#g #r##" +
//     "  /#  #  #" +
//     " ###     p" +
//     "A  #  /###" +
//     "## # /#  C" +
//     "  /# #   #" +
//     " ### # / #" +
//     " ## p /#  " +
//     " #  ####  " +
//     "A        /" +
//     "#####KK###";

//   box2d.b2Assert(maze.length == box2d.Testbed.SandboxParams.k_tileWidth * box2d.Testbed.SandboxParams.k_tileHeight);

//   this.m_faucetEmitterIndex = 0;
//   this.m_pumpIndex = 0;

//   // Set up some standard shapes/vertices we'll use later.
//   var boxShape = new box2d.b2PolygonShape();
//   boxShape.SetAsBox(box2d.Testbed.SandboxParams.k_tileRadius, box2d.Testbed.SandboxParams.k_tileRadius);

//   ///  b2Vec2 triangle[3];
//   var triangle = box2d.b2Vec2.MakeArray(3);
//   triangle[0].Set(-box2d.Testbed.SandboxParams.k_tileRadius, -box2d.Testbed.SandboxParams.k_tileRadius);
//   triangle[1].Set(box2d.Testbed.SandboxParams.k_tileRadius, box2d.Testbed.SandboxParams.k_tileRadius);
//   triangle[2].Set(box2d.Testbed.SandboxParams.k_tileRadius, -box2d.Testbed.SandboxParams.k_tileRadius);
//   var rightTriangleShape = new box2d.b2PolygonShape();
//   rightTriangleShape.Set(triangle, 3);

//   triangle[1].Set(-box2d.Testbed.SandboxParams.k_tileRadius, box2d.Testbed.SandboxParams.k_tileRadius);
//   var leftTriangleShape = new box2d.b2PolygonShape();
//   leftTriangleShape.Set(triangle, 3);

//   // Make these just a touch smaller than a tile
//   var circleShape = new box2d.b2CircleShape();
//   circleShape.m_radius = box2d.Testbed.SandboxParams.k_tileRadius * 0.7;

//   var red = new box2d.b2ParticleColor(255, 128, 128, 255);
//   var green = new box2d.b2ParticleColor(128, 255, 128, 255);
//   var blue = new box2d.b2ParticleColor(128, 128, 255, 255);

//   this.m_pumpForce = new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_pumpForce, 0);

//   for (var i = 0; i < box2d.Testbed.SandboxParams.k_tileWidth; i++) {
//     for (var j = 0; j < box2d.Testbed.SandboxParams.k_tileHeight; j++) {
//       var item = maze[j * box2d.Testbed.SandboxParams.k_tileWidth + i];

//       // Calculate center of this square
//       var center = new box2d.b2Vec2(
//         box2d.Testbed.SandboxParams.k_playfieldLeftEdge + box2d.Testbed.SandboxParams.k_tileRadius * 2 * i + box2d.Testbed.SandboxParams.k_tileRadius,
//         box2d.Testbed.SandboxParams.k_playfieldBottomEdge - box2d.Testbed.SandboxParams.k_tileRadius * 2 * j +
//         box2d.Testbed.SandboxParams.k_tileRadius);

//       // Let's add some items
//       switch (item) {
//         case '#':
//           // Block
//           this.CreateBody(center, boxShape, box2d.b2BodyType.b2_staticBody);
//           break;
//         case 'A':
//           // Left-to-right ramp
//           this.CreateBody(center, leftTriangleShape, box2d.b2BodyType.b2_staticBody);
//           break;
//         case '/':
//           // Right-to-left ramp
//           this.CreateBody(center, rightTriangleShape, box2d.b2BodyType.b2_staticBody);
//           break;
//         case 'C':
//           // A circle to play with
//           this.CreateBody(center, circleShape, box2d.b2BodyType.b2_dynamicBody);
//           break;
//         case 'p':
//           this.AddPump(center);
//           break;
//         case 'b':
//           // Blue emitter
//           this.AddFaucetEmitter(center, blue);
//           break;
//         case 'r':
//           // Red emitter
//           this.AddFaucetEmitter(center, red);
//           break;
//         case 'g':
//           // Green emitter
//           this.AddFaucetEmitter(center, green);
//           break;
//         default:
//           // add nothing
//           break;
//       }
//     }
//   }
// }

// box2d.Testbed.Sandbox.prototype.CreateBody = function(center, shape, type) {
//   var def = new box2d.b2BodyDef();
//   def.position.Copy(center);
//   def.type = type;
//   var body = this.m_world.CreateBody(def);
//   body.CreateFixture(shape, 10.0);
// }

// // Inititalizes a pump and its prismatic joint, and adds it to the world
// box2d.Testbed.Sandbox.prototype.AddPump = function(center) {
//   // Don't make too many pumps
//   box2d.b2Assert(this.m_pumpIndex < box2d.Testbed.SandboxParams.k_maxPumps);

//   var shape = new box2d.b2PolygonShape();
//   shape.SetAsBox(box2d.Testbed.SandboxParams.k_pumpRadius, box2d.Testbed.SandboxParams.k_pumpRadius);

//   var def = new box2d.b2BodyDef();
//   def.position.Copy(center);
//   def.type = box2d.b2BodyType.b2_dynamicBody;
//   def.angle = 0;
//   var body = this.m_world.CreateBody(def);
//   body.CreateFixture(shape, 5.0);

//   // Create a prismatic joint and connect to the ground, and have it
//   // slide along the x axis.
//   var prismaticJointDef = new box2d.b2PrismaticJointDef();
//   prismaticJointDef.bodyA = this.m_groundBody;
//   prismaticJointDef.bodyB = body;
//   prismaticJointDef.collideConnected = false;
//   prismaticJointDef.localAxisA.Set(1, 0);
//   prismaticJointDef.localAnchorA.Copy(center);

//   this.m_world.CreateJoint(prismaticJointDef);

//   this.m_pumps[this.m_pumpIndex] = body;
//   this.m_pumpIndex++;
// }

// // Initializes and adds a faucet emitter
// box2d.Testbed.Sandbox.prototype.AddFaucetEmitter = function(center, color) {
//   // Don't make too many emitters
//   box2d.b2Assert(this.m_faucetEmitterIndex < box2d.Testbed.SandboxParams.k_maxPumps);

//   var startingVelocity = new box2d.b2Vec2(0, box2d.Testbed.SandboxParams.k_particleExitSpeedY);

//   var emitter = new box2d.Testbed.RadialEmitter();
//   emitter.SetParticleSystem(this.m_particleSystem);
//   emitter.SetPosition(center);
//   emitter.SetVelocity(startingVelocity);
//   emitter.SetSize(new box2d.b2Vec2(box2d.Testbed.SandboxParams.k_defaultEmitterSize, 0.0));
//   emitter.SetEmitRate(box2d.Testbed.SandboxParams.k_defaultEmitterRate);
//   emitter.SetColor(color);
//   this.m_emitters[this.m_faucetEmitterIndex] = emitter;
//   this.m_faucetEmitterIndex++;
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Joint} joint
//  */
// box2d.Testbed.Sandbox.prototype.JointDestroyed = function(joint) {
//   box2d.Testbed.Test.prototype.JointDestroyed.call(this, joint);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.Sandbox.prototype.ParticleGroupDestroyed = function(group) {
//   box2d.Testbed.Test.prototype.ParticleGroupDestroyed.call(this, group);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.Sandbox.prototype.BeginContact = function(contact) {
//   box2d.Testbed.Test.prototype.BeginContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.Sandbox.prototype.EndContact = function(contact) {
//   box2d.Testbed.Test.prototype.EndContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2Manifold} oldManifold
//  */
// box2d.Testbed.Sandbox.prototype.PreSolve = function(contact, oldManifold) {
//   box2d.Testbed.Test.prototype.PreSolve.call(this, contact, oldManifold);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2ContactImpulse} impulse
//  */
// box2d.Testbed.Sandbox.prototype.PostSolve = function(contact, impulse) {
//   box2d.Testbed.Test.prototype.PostSolve.call(this, contact, impulse);
// }

// /**
//  * Allows you to set particle flags on devices with keyboards
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.Sandbox.prototype.Keyboard = function(key) {
//   box2d.Testbed.Test.prototype.Keyboard.call(this, key);
//   var toggle = 0;
//   switch (key) {
//     case goog.events.KeyCodes.A:
//       this.m_particleFlags = 0;
//       break;
//     case goog.events.KeyCodes.Q:
//       toggle = box2d.b2ParticleFlag.b2_powderParticle;
//       break;
//     case goog.events.KeyCodes.T:
//       toggle = box2d.b2ParticleFlag.b2_tensileParticle;
//       break;
//     case goog.events.KeyCodes.V:
//       toggle = box2d.b2ParticleFlag.b2_viscousParticle;
//       break;
//     case goog.events.KeyCodes.W:
//       toggle = box2d.b2ParticleFlag.b2_wallParticle;
//       break;
//   }
//   if (toggle) {
//     if (this.m_particleFlags & toggle) {
//       this.m_particleFlags = this.m_particleFlags & ~toggle;
//     } else {
//       this.m_particleFlags = this.m_particleFlags | toggle;
//     }
//   }
//   testbed.Main.SetParticleParameterValue(this.m_particleFlags);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.Sandbox.prototype.KeyboardUp = function(key) {
//   box2d.Testbed.Test.prototype.KeyboardUp.call(this, key);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Sandbox.prototype.MouseDown = function(p) {
//   box2d.Testbed.Test.prototype.MouseDown.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Sandbox.prototype.MouseUp = function(p) {
//   box2d.Testbed.Test.prototype.MouseUp.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Sandbox.prototype.MouseMove = function(p) {
//   box2d.Testbed.Test.prototype.MouseMove.call(this, p);
// }

// /**
//  * Per-frame step updater overridden from Test
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Sandbox.prototype.Step = function(settings) {
//   box2d.Testbed.Test.prototype.Step.call(this, settings);

//   this.m_particleFlags = testbed.Main.GetParticleParameterValue();

//   var dt = 1.0 / settings.hz;

//   // Step all the emitters
//   for (var i = 0; i < this.m_faucetEmitterIndex; i++) {
//     var particleIndices = [];
//     var emitter = this.m_emitters[i];

//     emitter.SetParticleFlags(this.m_particleFlags);
//     var particlesCreated = emitter.Step(dt, particleIndices, box2d.Testbed.SandboxParams.k_numberOfSpecialParticles);
//     this.m_specialTracker.Add(particleIndices, particlesCreated);
//   }

//   // Step the special tracker.
//   this.m_specialTracker.Step(dt);

//   // Do killfield work--kill every particle near the bottom of the screen
//   this.m_particleSystem.DestroyParticlesInShape(this.m_killFieldShape, this.m_killFieldTransform);

//   // Move the pumps
//   for (var i = 0; i < this.m_pumpIndex; i++) {
//     var pump = this.m_pumps[i];

//     // Pumps can and will clog up if the pile of particles they're
//     // trying to push is too heavy. Increase k_pumpForce to make
//     // stronger pumps.
//     pump.ApplyForceToCenter(this.m_pumpForce, true);

//     this.m_pumpTimer += dt;

//     // Reset pump to go back right again
//     if (this.m_pumpTimer > box2d.Testbed.SandboxParams.k_flipTime) {
//       this.m_pumpTimer -= box2d.Testbed.SandboxParams.k_flipTime;
//       this.m_pumpForce.x *= -1;
//     }
//   }

//   this.m_debugDraw.DrawString(
//     5, this.m_textLine, "Keys: (a) zero out (water), (q) powder");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
//   this.m_debugDraw.DrawString(
//     5, this.m_textLine, "      (t) tensile, (v) viscous");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
// }

// /**
//  * @export
//  * @return {number}
//  */
// box2d.Testbed.Sandbox.prototype.GetDefaultViewZoom = function() {
//   return box2d.Testbed.Test.prototype.GetDefaultViewZoom.call(this);
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Sandbox.Create = function(canvas, settings) {
//   return new box2d.Testbed.Sandbox(canvas, settings);
// }

// //#endif
