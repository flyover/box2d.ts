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

export class BasicSliderCrank extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new BasicSliderCrank();
  }
}

// goog.provide('box2d.Testbed.BasicSliderCrank');

// goog.require('box2d.Testbed.Test');
// goog.require('goog.events.KeyCodes');

// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.BasicSliderCrank = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   /*box2d.b2Body*/
//   var ground = null; {
//     /*box2d.b2BodyDef*/
//     var bd = new box2d.b2BodyDef();
//     bd.position.Set(0.0, 17.0);
//     ground = this.m_world.CreateBody(bd);
//   }

//   {
//     /*box2d.b2Body*/
//     var prevBody = ground;

//     // Define crank.
//     {
//       /*box2d.b2PolygonShape*/
//       var shape = new box2d.b2PolygonShape();
//       shape.SetAsBox(4.0, 1.0);

//       /*box2d.b2BodyDef*/
//       var bd = new box2d.b2BodyDef();
//       bd.type = box2d.b2BodyType.b2_dynamicBody;
//       bd.position.Set(-8.0, 20.0);
//       /*box2d.b2Body*/
//       var body = this.m_world.CreateBody(bd);
//       body.CreateFixture(shape, 2.0);

//       /*box2d.b2RevoluteJointDef*/
//       var rjd = new box2d.b2RevoluteJointDef();
//       rjd.Initialize(prevBody, body, new box2d.b2Vec2(-12.0, 20.0));
//       this.m_world.CreateJoint(rjd);

//       prevBody = body;
//     }

//     // Define connecting rod
//     {
//       /*box2d.b2PolygonShape*/
//       var shape = new box2d.b2PolygonShape();
//       shape.SetAsBox(8.0, 1.0);

//       /*box2d.b2BodyDef*/
//       var bd = new box2d.b2BodyDef();
//       bd.type = box2d.b2BodyType.b2_dynamicBody;
//       bd.position.Set(4.0, 20.0);
//       /*box2d.b2Body*/
//       var body = this.m_world.CreateBody(bd);
//       body.CreateFixture(shape, 2.0);

//       /*box2d.b2RevoluteJointDef*/
//       var rjd = new box2d.b2RevoluteJointDef();
//       rjd.Initialize(prevBody, body, new box2d.b2Vec2(-4.0, 20.0));
//       this.m_world.CreateJoint(rjd);

//       prevBody = body;
//     }

//     // Define piston
//     {
//       /*box2d.b2PolygonShape*/
//       var shape = new box2d.b2PolygonShape();
//       shape.SetAsBox(3.0, 3.0);

//       /*box2d.b2BodyDef*/
//       var bd = new box2d.b2BodyDef();
//       bd.type = box2d.b2BodyType.b2_dynamicBody;
//       bd.fixedRotation = true;
//       bd.position.Set(12.0, 20.0);
//       /*box2d.b2Body*/
//       var body = this.m_world.CreateBody(bd);
//       body.CreateFixture(shape, 2.0);

//       /*box2d.b2RevoluteJointDef*/
//       var rjd = new box2d.b2RevoluteJointDef();
//       rjd.Initialize(prevBody, body, new box2d.b2Vec2(12.0, 20.0));
//       this.m_world.CreateJoint(rjd);

//       /*box2d.b2PrismaticJointDef*/
//       var pjd = new box2d.b2PrismaticJointDef();
//       pjd.Initialize(ground, body, new box2d.b2Vec2(12.0, 17.0), new box2d.b2Vec2(1.0, 0.0));
//       this.m_world.CreateJoint(pjd);
//     }
//   }
// }

// goog.inherits(box2d.Testbed.BasicSliderCrank, box2d.Testbed.Test);

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.BasicSliderCrank.Create = function(canvas, settings) {
//   return new box2d.Testbed.BasicSliderCrank(canvas, settings);
// }
