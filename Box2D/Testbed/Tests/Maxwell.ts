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

// #if B2_ENABLE_PARTICLE

import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class Maxwell extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new Maxwell();
  }
}

// #endif

// //#if B2_ENABLE_PARTICLE

// goog.provide('box2d.Testbed.Maxwell');

// goog.require('box2d.Testbed.Test');

// /**
//  * Game which adds some fun to Maxwell's demon.
//  *
//  * http://en.wikipedia.org/wiki/Maxwell's_demon
//  *
//  * The user's goal is to try to catch as many particles as
//  * possible in the bottom half of the container by splitting the
//  * container using a barrier with the 'a' key.
//  *
//  * See Maxwell::Keyboard() for other controls.
//  *
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Maxwell = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor
//   this.m_density = box2d.Testbed.Maxwell.k_densityDefault;
//   this.m_position = box2d.Testbed.Maxwell.k_containerHalfHeight;
//   this.m_particleGroup = null;
//   this.m_temperature = box2d.Testbed.Maxwell.k_temperatureDefault;
//   this.m_barrierBody = null;

//   this.m_world.SetGravity(new box2d.b2Vec2(0, 0));

//   // Create the container.
//   {
//     var bd = new box2d.b2BodyDef();
//     var ground = this.m_world.CreateBody(bd);
//     var shape = new box2d.b2ChainShape();
//     var vertices = [
//       new box2d.b2Vec2(-box2d.Testbed.Maxwell.k_containerHalfWidth, 0),
//       new box2d.b2Vec2(box2d.Testbed.Maxwell.k_containerHalfWidth, 0),
//       new box2d.b2Vec2(box2d.Testbed.Maxwell.k_containerHalfWidth, box2d.Testbed.Maxwell.k_containerHeight),
//       new box2d.b2Vec2(-box2d.Testbed.Maxwell.k_containerHalfWidth, box2d.Testbed.Maxwell.k_containerHeight)
//     ];
//     shape.CreateLoop(vertices, 4);
//     var def = new box2d.b2FixtureDef();
//     def.shape = shape;
//     def.density = 0;
//     def.restitution = 1.0;
//     ground.CreateFixture(def);
//   }

//   // Enable the barrier.
//   this.EnableBarrier();
//   // Create the particles.
//   this.ResetParticles();
// }

// goog.inherits(box2d.Testbed.Maxwell, box2d.Testbed.Test);

// /**
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.prototype.m_density = 0.0;
// /**
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.prototype.m_position = 0.0;
// /**
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.prototype.m_temperature = 0.0;
// /**
//  * @type {box2d.b2Body}
//  */
// box2d.Testbed.Maxwell.prototype.m_barrierBody = null;
// /**
//  * @type {box2d.b2ParticleGroup}
//  */
// box2d.Testbed.Maxwell.prototype.m_particleGroup = null;

// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_containerWidth = 2.0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_containerHeight = 4.0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_containerHalfWidth = box2d.Testbed.Maxwell.k_containerWidth / 2.0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_containerHalfHeight = box2d.Testbed.Maxwell.k_containerHeight / 2.0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_barrierHeight = box2d.Testbed.Maxwell.k_containerHalfHeight / 100.0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_barrierMovementIncrement = box2d.Testbed.Maxwell.k_containerHalfHeight * 0.1;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_densityStep = 1.25;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_densityMin = 0.01;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_densityMax = 0.8;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_densityDefault = 0.25;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_temperatureStep = 0.2;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_temperatureMin = 0.4;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_temperatureMax = 10.0;
// /**
//  * @const
//  * @type {number}
//  */
// box2d.Testbed.Maxwell.k_temperatureDefault = 5.0;

// /**
//  * Disable the barrier.
//  * @return {void}
//  */
// box2d.Testbed.Maxwell.prototype.DisableBarrier = function() {
//   if (this.m_barrierBody) {
//     this.m_world.DestroyBody(this.m_barrierBody);
//     this.m_barrierBody = null;
//   }
// }

// /**
//  * Enable the barrier.
//  * @return {void}
//  */
// box2d.Testbed.Maxwell.prototype.EnableBarrier = function() {
//   if (!this.m_barrierBody) {
//     var bd = new box2d.b2BodyDef();
//     this.m_barrierBody = this.m_world.CreateBody(bd);
//     var barrierShape = new box2d.b2PolygonShape();
//     barrierShape.SetAsBox(box2d.Testbed.Maxwell.k_containerHalfWidth, box2d.Testbed.Maxwell.k_barrierHeight,
//       new box2d.b2Vec2(0, this.m_position), 0);
//     var def = new box2d.b2FixtureDef();
//     def.shape = barrierShape;
//     def.density = 0;
//     def.restitution = 1.0;
//     this.m_barrierBody.CreateFixture(def);
//   }
// }

// /**
//  * Enable / disable the barrier.
//  * @return {void}
//  */
// box2d.Testbed.Maxwell.prototype.ToggleBarrier = function() {
//   if (this.m_barrierBody) {
//     this.DisableBarrier();
//   } else {
//     this.EnableBarrier();
//   }
// }

// /**
//  * Destroy and recreate all particles.
//  * @return {void}
//  */
// box2d.Testbed.Maxwell.prototype.ResetParticles = function() {
//   if (this.m_particleGroup !== null) {
//     this.m_particleGroup.DestroyParticles();
//     this.m_particleGroup = null;
//   }

//   this.m_particleSystem.SetRadius(box2d.Testbed.Maxwell.k_containerHalfWidth / 20.0); {
//     var shape = new box2d.b2PolygonShape();
//     shape.SetAsBox(this.m_density * box2d.Testbed.Maxwell.k_containerHalfWidth,
//       this.m_density * box2d.Testbed.Maxwell.k_containerHalfHeight,
//       new box2d.b2Vec2(0, box2d.Testbed.Maxwell.k_containerHalfHeight), 0);
//     var pd = new box2d.b2ParticleGroupDef();
//     pd.flags = box2d.b2ParticleFlag.b2_powderParticle;
//     pd.shape = shape;
//     this.m_particleGroup = this.m_particleSystem.CreateParticleGroup(pd);
//     ///  b2Vec2* velocities =
//     ///    this.m_particleSystem.GetVelocityBuffer() +
//     ///    this.m_particleGroup.GetBufferIndex();
//     var velocities = this.m_particleSystem.GetVelocityBuffer();
//     var index = this.m_particleGroup.GetBufferIndex();

//     for (var i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
//       ///  b2Vec2& v = *(velocities + i);
//       var v = velocities[index + i];
//       v.Set(box2d.Testbed.RandomFloat() + 1.0, box2d.Testbed.RandomFloat() + 1.0);
//       v.Normalize();
//       ///  v *= this.m_temperature;
//       v.SelfMul(this.m_temperature);
//     }
//   }
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.Maxwell.prototype.Keyboard = function(key) {
//   switch (key) {
//     case goog.events.KeyCodes.A:
//       // Enable / disable the barrier.
//       this.ToggleBarrier();
//       break;
//     case goog.events.KeyCodes.EQUALS:
//       // Increase the particle density.
//       this.m_density = box2d.b2Min(this.m_density * box2d.Testbed.Maxwell.k_densityStep, box2d.Testbed.Maxwell.k_densityMax);
//       this.Reset();
//       break;
//     case goog.events.KeyCodes.DASH:
//       // Reduce the particle density.
//       this.m_density = box2d.b2Max(this.m_density / box2d.Testbed.Maxwell.k_densityStep, box2d.Testbed.Maxwell.k_densityMin);
//       this.Reset();
//       break;
//     case goog.events.KeyCodes.PERIOD:
//       // Move the location of the divider up.
//       this.MoveDivider(this.m_position + box2d.Testbed.Maxwell.k_barrierMovementIncrement);
//       break;
//     case goog.events.KeyCodes.COMMA:
//       // Move the location of the divider down.
//       this.MoveDivider(this.m_position - box2d.Testbed.Maxwell.k_barrierMovementIncrement);
//       break;
//     case goog.events.KeyCodes.SEMICOLON:
//       // Reduce the temperature (velocity of particles).
//       this.m_temperature = box2d.b2Max(this.m_temperature - box2d.Testbed.Maxwell.k_temperatureStep,
//         box2d.Testbed.Maxwell.k_temperatureMin);
//       this.Reset();
//       break;
//     case goog.events.KeyCodes.SINGLE_QUOTE:
//       // Increase the temperature (velocity of particles).
//       this.m_temperature = box2d.b2Min(this.m_temperature + box2d.Testbed.Maxwell.k_temperatureStep,
//         box2d.Testbed.Maxwell.k_temperatureMax);
//       this.Reset();
//       break;
//     default:
//       box2d.Testbed.Test.prototype.Keyboard.call(this, key);
//       break;
//   }
// }

// /**
//  * Determine whether a point is in the container.
//  * @return {boolean}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Maxwell.prototype.InContainer = function(p) {
//   return p.x >= -box2d.Testbed.Maxwell.k_containerHalfWidth && p.x <= box2d.Testbed.Maxwell.k_containerHalfWidth &&
//     p.y >= 0.0 && p.y <= box2d.Testbed.Maxwell.k_containerHalfHeight * 2.0;
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Maxwell.prototype.MouseDown = function(p) {
//   if (!this.InContainer(p)) {
//     box2d.Testbed.Test.prototype.MouseDown.call(this, p);
//   }
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Maxwell.prototype.MouseUp = function(p) {
//   // If the pointer is in the container.
//   if (this.InContainer(p)) {
//     // Enable / disable the barrier.
//     this.ToggleBarrier();
//   } else {
//     // Move the barrier to the touch position.
//     this.MoveDivider(p.y);

//     box2d.Testbed.Test.prototype.MouseUp.call(this, p);
//   }
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Maxwell.prototype.Step = function(settings) {
//   box2d.Testbed.Test.prototype.Step.call(this, settings);

//   // Number of particles above (top) and below (bottom) the barrier.
//   var top = 0;
//   var bottom = 0;
//   var index = this.m_particleGroup.GetBufferIndex();
//   ///  b2Vec2* const velocities = this.m_particleSystem.GetVelocityBuffer() + index;
//   var velocities = this.m_particleSystem.GetVelocityBuffer();
//   ///  b2Vec2* const positions = this.m_particleSystem.GetPositionBuffer() + index;
//   var positions = this.m_particleSystem.GetPositionBuffer();

//   for (var i = 0; i < this.m_particleGroup.GetParticleCount(); i++) {
//     // Add energy to particles based upon the temperature.
//     ///  b2Vec2& v = velocities[i];
//     var v = velocities[index + i];
//     v.Normalize();
//     ///  v *= this.m_temperature;
//     v.SelfMul(this.m_temperature);

//     // Keep track of the number of particles above / below the
//     // divider / barrier position.
//     ///  b2Vec2& p = positions[i];
//     var p = positions[index + i];
//     if (p.y > this.m_position)
//       top++;
//     else
//       bottom++;
//   }

//   // Calculate a score based upon the difference in pressure between the
//   // upper and lower divisions of the container.
//   var topPressure = top / (box2d.Testbed.Maxwell.k_containerHeight - this.m_position);
//   var botPressure = bottom / this.m_position;
//   this.m_debugDraw.DrawString(
//     10, 75, "Score: %f",
//     topPressure > 0.0 ? botPressure / topPressure - 1.0 : 0.0);
// }

// /**
//  * Reset the particles and the barrier.
//  * @return {void}
//  */
// box2d.Testbed.Maxwell.prototype.Reset = function() {
//   this.DisableBarrier();
//   this.ResetParticles();
//   this.EnableBarrier();
// }

// /**
//  * Move the divider / barrier.
//  * @return {void}
//  * @param {number} newPosition
//  */
// box2d.Testbed.Maxwell.prototype.MoveDivider = function(newPosition) {
//   this.m_position = box2d.b2Clamp(newPosition, box2d.Testbed.Maxwell.k_barrierMovementIncrement,
//     box2d.Testbed.Maxwell.k_containerHeight - box2d.Testbed.Maxwell.k_barrierMovementIncrement);
//   this.Reset();
// }

// /**
//  * @export
//  * @return {number}
//  */
// box2d.Testbed.Maxwell.prototype.GetDefaultViewZoom = function() {
//   return 0.1;
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Maxwell.Create = function(canvas, settings) {
//   return new box2d.Testbed.Maxwell(canvas, settings);
// }

// //#endif
