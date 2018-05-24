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

export class DrawingParticles extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new DrawingParticles();
  }
}

// #endif

// //#if B2_ENABLE_PARTICLE

// goog.provide('box2d.Testbed.DrawingParticles');

// goog.require('box2d.Testbed.Test');

// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.DrawingParticles = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   {
//     var bd = new box2d.b2BodyDef();
//     var ground = this.m_world.CreateBody(bd);

//     {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(-4, -2),
//         new box2d.b2Vec2(4, -2),
//         new box2d.b2Vec2(4, 0),
//         new box2d.b2Vec2(-4, 0)
//       ];
//       shape.Set(vertices, 4);
//       ground.CreateFixture(shape, 0.0);
//     }

//     {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(-4, -2),
//         new box2d.b2Vec2(-2, -2),
//         new box2d.b2Vec2(-2, 6),
//         new box2d.b2Vec2(-4, 6)
//       ];
//       shape.Set(vertices, 4);
//       ground.CreateFixture(shape, 0.0);
//     }

//     {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(2, -2),
//         new box2d.b2Vec2(4, -2),
//         new box2d.b2Vec2(4, 6),
//         new box2d.b2Vec2(2, 6)
//       ];
//       shape.Set(vertices, 4);
//       ground.CreateFixture(shape, 0.0);
//     }

//     {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(-4, 4),
//         new box2d.b2Vec2(4, 4),
//         new box2d.b2Vec2(4, 6),
//         new box2d.b2Vec2(-4, 6)
//       ];
//       shape.Set(vertices, 4);
//       ground.CreateFixture(shape, 0.0);
//     }
//   }

//   this.m_colorIndex = 0;
//   this.m_particleSystem.SetRadius(0.05 * 2);
//   this.m_lastGroup = null;
//   this.m_drawing = true;

//   box2d.b2Assert((box2d.Testbed.DrawingParticles.k_paramDef[0].CalculateValueMask() & box2d.Testbed.DrawingParticles.Parameters.e_parameterBegin) === 0);
//   testbed.Main.SetParticleParameters(box2d.Testbed.DrawingParticles.k_paramDef, box2d.Testbed.DrawingParticles.k_paramDefCount);
//   testbed.Main.SetRestartOnParticleParameterChange(false);

//   this.m_particleFlags = testbed.Main.GetParticleParameterValue();
//   this.m_groupFlags = 0;
// }

// goog.inherits(box2d.Testbed.DrawingParticles, box2d.Testbed.Test);

// /**
//  * Set bit 31 to distiguish these values from particle flags.
//  * @enum {number}
//  */
// box2d.Testbed.DrawingParticles.Parameters = {
//   e_parameterBegin: (1 << 31), // Start of this parameter namespace.
//   e_parameterMove: (1 << 31) | (1 << 0),
//   e_parameterRigid: (1 << 31) | (1 << 1),
//   e_parameterRigidBarrier: (1 << 31) | (1 << 2),
//   e_parameterElasticBarrier: (1 << 31) | (1 << 3),
//   e_parameterSpringBarrier: (1 << 31) | (1 << 4),
//   e_parameterRepulsive: (1 << 31) | (1 << 5)
// };

// /**
//  * @type {box2d.b2ParticleGroup}
//  */
// box2d.Testbed.DrawingParticles.prototype.m_lastGroup = null;
// /**
//  * @type {boolean}
//  */
// box2d.Testbed.DrawingParticles.prototype.m_drawing = true;
// /**
//  * @type {number}
//  */
// box2d.Testbed.DrawingParticles.prototype.m_particleFlags = 0;
// /**
//  * @type {number}
//  */
// box2d.Testbed.DrawingParticles.prototype.m_groupFlags = 0;
// /**
//  * @type {number}
//  */
// box2d.Testbed.DrawingParticles.prototype.m_colorIndex = 0;

// box2d.Testbed.DrawingParticles.k_paramValues = [
//   new box2d.Testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_zombieParticle, box2d.Testbed.ParticleParameter.k_DefaultOptions, "erase"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.Testbed.DrawingParticles.Parameters.e_parameterMove, box2d.Testbed.ParticleParameter.k_DefaultOptions, "move"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.Testbed.DrawingParticles.Parameters.e_parameterRigid, box2d.Testbed.ParticleParameter.k_DefaultOptions, "rigid"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.Testbed.DrawingParticles.Parameters.e_parameterRigidBarrier, box2d.Testbed.ParticleParameter.k_DefaultOptions, "rigid barrier"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.Testbed.DrawingParticles.Parameters.e_parameterElasticBarrier, box2d.Testbed.ParticleParameter.k_DefaultOptions, "elastic barrier"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.Testbed.DrawingParticles.Parameters.e_parameterSpringBarrier, box2d.Testbed.ParticleParameter.k_DefaultOptions, "spring barrier"),
//   new box2d.Testbed.ParticleParameter.Value(box2d.Testbed.DrawingParticles.Parameters.e_parameterRepulsive, box2d.Testbed.ParticleParameter.k_DefaultOptions, "repulsive wall")
// ];

// box2d.Testbed.DrawingParticles.k_paramDef = [
//   new box2d.Testbed.ParticleParameter.Definition(box2d.Testbed.ParticleParameter.k_particleTypes),
//   new box2d.Testbed.ParticleParameter.Definition(box2d.Testbed.DrawingParticles.k_paramValues)
// ];
// box2d.Testbed.DrawingParticles.k_paramDefCount = box2d.Testbed.DrawingParticles.k_paramDef.length;

// // Determine the current particle parameter from the drawing state and
// // group flags.
// box2d.Testbed.DrawingParticles.prototype.DetermineParticleParameter = function() {
//   if (this.m_drawing) {
//     if (this.m_groupFlags === (box2d.b2ParticleGroupFlag.b2_rigidParticleGroup | box2d.b2ParticleGroupFlag.b2_solidParticleGroup)) {
//       return box2d.Testbed.DrawingParticles.Parameters.e_parameterRigid;
//     }
//     if (this.m_groupFlags === box2d.b2ParticleGroupFlag.b2_rigidParticleGroup && this.m_particleFlags === box2d.b2ParticleFlag.b2_barrierParticle) {
//       return box2d.Testbed.DrawingParticles.Parameters.e_parameterRigidBarrier;
//     }
//     if (this.m_particleFlags === (box2d.b2ParticleFlag.b2_elasticParticle | box2d.b2ParticleFlag.b2_barrierParticle)) {
//       return box2d.Testbed.DrawingParticles.Parameters.e_parameterElasticBarrier;
//     }
//     if (this.m_particleFlags === (box2d.b2ParticleFlag.b2_springParticle | box2d.b2ParticleFlag.b2_barrierParticle)) {
//       return box2d.Testbed.DrawingParticles.Parameters.e_parameterSpringBarrier;
//     }
//     if (this.m_particleFlags === (box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_repulsiveParticle)) {
//       return box2d.Testbed.DrawingParticles.Parameters.e_parameterRepulsive;
//     }
//     return this.m_particleFlags;
//   }
//   return box2d.Testbed.DrawingParticles.Parameters.e_parameterMove;
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.DrawingParticles.prototype.Keyboard = function(key) {
//   this.m_drawing = key !== goog.events.KeyCodes.X;
//   this.m_particleFlags = 0;
//   this.m_groupFlags = 0;
//   switch (key) {
//     case goog.events.KeyCodes.E:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_elasticParticle;
//       this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//       break;
//     case goog.events.KeyCodes.P:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_powderParticle;
//       break;
//     case goog.events.KeyCodes.R:
//       this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup | box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//       break;
//     case goog.events.KeyCodes.S:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_springParticle;
//       this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//       break;
//     case goog.events.KeyCodes.T:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_tensileParticle;
//       break;
//     case goog.events.KeyCodes.V:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_viscousParticle;
//       break;
//     case goog.events.KeyCodes.W:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_wallParticle;
//       this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//       break;
//     case goog.events.KeyCodes.B:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_wallParticle;
//       break;
//     case goog.events.KeyCodes.H:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle;
//       this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup;
//       break;
//     case goog.events.KeyCodes.N:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_elasticParticle;
//       this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//       break;
//     case goog.events.KeyCodes.M:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_springParticle;
//       this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//       break;
//     case goog.events.KeyCodes.F:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_repulsiveParticle;
//       break;
//     case goog.events.KeyCodes.C:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_colorMixingParticle;
//       break;
//     case goog.events.KeyCodes.Z:
//       this.m_particleFlags = box2d.b2ParticleFlag.b2_zombieParticle;
//       break;
//     default:
//       break;
//   }
//   testbed.Main.SetParticleParameterValue(this.DetermineParticleParameter());
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.DrawingParticles.prototype.MouseMove = function(p) {
//   box2d.Testbed.Test.prototype.MouseMove.call(this, p);
//   if (this.m_drawing) {
//     var shape = new box2d.b2CircleShape();
//     shape.m_p.Copy(p);
//     shape.m_radius = 0.2;
//     ///  b2Transform xf;
//     ///  xf.SetIdentity();
//     var xf = box2d.b2Transform.IDENTITY;

//     this.m_particleSystem.DestroyParticlesInShape(shape, xf);

//     var joinGroup = this.m_lastGroup && this.m_groupFlags === this.m_lastGroup.GetGroupFlags();
//     if (!joinGroup) {
//       this.m_colorIndex = (this.m_colorIndex + 1) % box2d.Testbed.Test.k_ParticleColorsCount;
//     }
//     var pd = new box2d.b2ParticleGroupDef();
//     pd.shape = shape;
//     pd.flags = this.m_particleFlags;
//     if ((this.m_particleFlags & (box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_springParticle | box2d.b2ParticleFlag.b2_elasticParticle)) ||
//       (this.m_particleFlags === (box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_barrierParticle))) {
//       pd.flags |= box2d.b2ParticleFlag.b2_reactiveParticle;
//     }
//     pd.groupFlags = this.m_groupFlags;
//     pd.color.Copy(box2d.Testbed.Test.k_ParticleColors[this.m_colorIndex]);
//     pd.group = this.m_lastGroup;
//     this.m_lastGroup = this.m_particleSystem.CreateParticleGroup(pd);
//     this.m_mouseTracing = false;
//   }
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.DrawingParticles.prototype.MouseUp = function(p) {
//   box2d.Testbed.Test.prototype.MouseUp.call(this, p);
//   this.m_lastGroup = null;
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.DrawingParticles.prototype.ParticleGroupDestroyed = function(group) {
//   box2d.Testbed.Test.prototype.ParticleGroupDestroyed.call(this, group);
//   if (group === this.m_lastGroup) {
//     this.m_lastGroup = null;
//   }
// }

// box2d.Testbed.DrawingParticles.prototype.SplitParticleGroups = function() {
//   for (var group = this.m_particleSystem.GetParticleGroupList(); group; group = group.GetNext()) {
//     if (group !== this.m_lastGroup &&
//       (group.GetGroupFlags() & box2d.b2ParticleGroupFlag.b2_rigidParticleGroup) &&
//       (group.GetAllParticleFlags() & box2d.b2ParticleFlag.b2_zombieParticle)) {
//       // Split a rigid particle group which may be disconnected
//       // by destroying particles.
//       this.m_particleSystem.SplitParticleGroup(group);
//     }
//   }
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.DrawingParticles.prototype.Step = function(settings) {
//   var parameterValue = testbed.Main.GetParticleParameterValue();
//   this.m_drawing = (parameterValue & box2d.Testbed.DrawingParticles.Parameters.e_parameterMove) !== box2d.Testbed.DrawingParticles.Parameters.e_parameterMove;
//   if (this.m_drawing) {
//     switch (parameterValue) {
//       case box2d.b2ParticleFlag.b2_elasticParticle:
//       case box2d.b2ParticleFlag.b2_springParticle:
//       case box2d.b2ParticleFlag.b2_wallParticle:
//         this.m_particleFlags = parameterValue;
//         this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//         break;
//       case box2d.Testbed.DrawingParticles.Parameters.e_parameterRigid:
//         // b2_waterParticle is the default particle type in
//         // LiquidFun.
//         this.m_particleFlags = box2d.b2ParticleFlag.b2_waterParticle;
//         this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup | box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//         break;
//       case box2d.Testbed.DrawingParticles.Parameters.e_parameterRigidBarrier:
//         this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle;
//         this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup;
//         break;
//       case box2d.Testbed.DrawingParticles.Parameters.e_parameterElasticBarrier:
//         this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_elasticParticle;
//         this.m_groupFlags = 0;
//         break;
//       case box2d.Testbed.DrawingParticles.Parameters.e_parameterSpringBarrier:
//         this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_springParticle;
//         this.m_groupFlags = 0;
//         break;
//       case box2d.Testbed.DrawingParticles.Parameters.e_parameterRepulsive:
//         this.m_particleFlags = box2d.b2ParticleFlag.b2_repulsiveParticle | box2d.b2ParticleFlag.b2_wallParticle;
//         this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
//         break;
//       default:
//         this.m_particleFlags = parameterValue;
//         this.m_groupFlags = 0;
//         break;
//     }
//   }

//   if (this.m_particleSystem.GetAllParticleFlags() & box2d.b2ParticleFlag.b2_zombieParticle) {
//     this.SplitParticleGroups();
//   }

//   box2d.Testbed.Test.prototype.Step.call(this, settings);
//   this.m_debugDraw.DrawString(5, this.m_textLine, "Keys: (L) liquid, (E) elastic, (S) spring");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
//   this.m_debugDraw.DrawString(5, this.m_textLine, "(R) rigid, (W) wall, (V) viscous, (T) tensile");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
//   this.m_debugDraw.DrawString(5, this.m_textLine, "(F) repulsive wall, (B) wall barrier");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
//   this.m_debugDraw.DrawString(5, this.m_textLine, "(H) rigid barrier, (N) elastic barrier, (M) spring barrier");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
//   this.m_debugDraw.DrawString(5, this.m_textLine, "(C) color mixing, (Z) erase, (X) move");
//   this.m_textLine += box2d.Testbed.DRAW_STRING_NEW_LINE;
// }

// /**
//  * @export
//  * @return {number}
//  */
// box2d.Testbed.DrawingParticles.prototype.GetDefaultViewZoom = function() {
//   return 0.1;
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.DrawingParticles.Create = function(canvas, settings) {
//   return new box2d.Testbed.DrawingParticles(canvas, settings);
// }

// //#endif
