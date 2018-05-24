/*
 * Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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

import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class HeavyOnLightTwo extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new HeavyOnLightTwo();
  }
}

// goog.provide('box2d.Testbed.HeavyOnLightTwo');

// goog.require('box2d.Testbed.Test');
// goog.require('goog.events.KeyCodes');

// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.HeavyOnLightTwo = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   {
//     /*box2d.b2BodyDef*/
//     var bd = new box2d.b2BodyDef();
//     /*box2d.b2Body*/
//     var ground = this.m_world.CreateBody(bd);

//     /*box2d.b2EdgeShape*/
//     var shape = new box2d.b2EdgeShape();
//     shape.SetAsEdge(new box2d.b2Vec2(-40.0, 0.0), new box2d.b2Vec2(40.0, 0.0));
//     ground.CreateFixture(shape, 0.0);
//   }

//   /*box2d.b2BodyDef*/
//   var bd = new box2d.b2BodyDef();
//   bd.type = box2d.b2BodyType.b2_dynamicBody;
//   bd.position.Set(0.0, 2.5);
//   /*box2d.b2Body*/
//   var body = this.m_world.CreateBody(bd);

//   /*box2d.b2CircleShape*/
//   var shape = new box2d.b2CircleShape();
//   shape.m_radius = 0.5;
//   body.CreateFixture(shape, 10.0);

//   bd.position.Set(0.0, 3.5);
//   body = this.m_world.CreateBody(bd);
//   body.CreateFixture(shape, 10.0);

//   this.m_heavy = null;
// }

// goog.inherits(box2d.Testbed.HeavyOnLightTwo, box2d.Testbed.Test);

// /**
//  * @export
//  * @type {box2d.b2Body}
//  */
// box2d.Testbed.HeavyOnLightTwo.prototype.m_heavy = null;

// /**
//  * @export
//  * @return {void}
//  */
// box2d.Testbed.HeavyOnLightTwo.prototype.ToggleHeavy = function() {
//   if (this.m_heavy !== null) {
//     this.m_world.DestroyBody(this.m_heavy);
//     this.m_heavy = null;
//   } else {
//     /*box2d.b2BodyDef*/
//     var bd = new box2d.b2BodyDef();
//     bd.type = box2d.b2BodyType.b2_dynamicBody;
//     bd.position.Set(0.0, 9.0);
//     this.m_heavy = this.m_world.CreateBody(bd);

//     /*box2d.b2CircleShape*/
//     var shape = new box2d.b2CircleShape();
//     shape.m_radius = 5.0;
//     this.m_heavy.CreateFixture(shape, 10.0);
//   }
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.HeavyOnLightTwo.prototype.Keyboard = function(key) {
//   switch (key) {
//     case goog.events.KeyCodes.H:
//       this.ToggleHeavy();
//       break;
//   }

//   box2d.Testbed.Test.prototype.Keyboard.call(this, key);
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.HeavyOnLightTwo.Create = function(canvas, settings) {
//   return new box2d.Testbed.HeavyOnLightTwo(canvas, settings);
// }
