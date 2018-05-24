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

export class Pointy extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new Pointy();
  }
}

// #endif

// //#if B2_ENABLE_PARTICLE

// goog.provide('box2d.Testbed.Pointy');

// goog.require('box2d.Testbed.Test');

// /**
//  * Test behavior when particles fall on a convex ambigious Body
//  * contact fixture junction.
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Pointy = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   {
//     var bd = new box2d.b2BodyDef();
//     var ground = this.m_world.CreateBody(bd);

//     // Construct a triangle out of many polygons to ensure there's no
//     // issue with particles falling directly on an ambiguous corner

//     var xstep = 1.0;
//     for (var x = -10.0; x < 10.0; x += xstep) {
//       var shape = new box2d.b2PolygonShape();
//       var vertices = [
//         new box2d.b2Vec2(x, -10.0),
//         new box2d.b2Vec2(x + xstep, -10.0),
//         new box2d.b2Vec2(0.0, 25.0)
//       ];
//       shape.Set(vertices, 3);
//       ground.CreateFixture(shape, 0.0);
//     }
//   }

//   this.m_particleSystem.SetRadius(0.25 * 3); // HACK: increase particle radius
//   var particleType = testbed.Main.GetParticleParameterValue();
//   if (particleType === box2d.b2ParticleFlag.b2_waterParticle) {
//     this.m_particleSystem.SetDamping(0.2);
//   }

//   // Create killfield shape and transform
//   this.m_killfieldShape = new box2d.b2PolygonShape();
//   this.m_killfieldShape.SetAsBox(50.0, 1.0);

//   // Put this at the bottom of the world
//   this.m_killfieldTransform = new box2d.b2Transform();
//   var loc = new box2d.b2Vec2(-25, 1);
//   this.m_killfieldTransform.Set(loc, 0);
// }

// goog.inherits(box2d.Testbed.Pointy, box2d.Testbed.Test);

// /**
//  * @type {box2d.b2PolygonShape}
//  */
// box2d.Testbed.Pointy.prototype.m_killfieldShape = null;

// /**
//  * @type {box2d.b2Transform}
//  */
// box2d.Testbed.Pointy.prototype.m_killfieldTransform = null;

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Pointy.prototype.Step = function(settings) {
//   box2d.Testbed.Test.prototype.Step.call(this, settings);

//   var flags = testbed.Main.GetParticleParameterValue();
//   var pd = new box2d.b2ParticleDef();

//   pd.position.Set(0.0, 33.0);
//   pd.velocity.Set(0.0, -1.0);
//   pd.flags = flags;

//   if (flags & (box2d.b2ParticleFlag.b2_springParticle | box2d.b2ParticleFlag.b2_elasticParticle)) {
//     var count = this.m_particleSystem.GetParticleCount();
//     pd.velocity.Set(count & 1 ? -1.0 : 1.0, -5.0);
//     pd.flags |= box2d.b2ParticleFlag.b2_reactiveParticle;
//   }

//   this.m_particleSystem.CreateParticle(pd);

//   // kill every particle near the bottom of the screen
//   this.m_particleSystem.DestroyParticlesInShape(this.m_killfieldShape, this.m_killfieldTransform);
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Pointy.Create = function(canvas, settings) {
//   return new box2d.Testbed.Pointy(canvas, settings);
// }

// //#endif
