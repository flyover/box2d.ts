import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class DominoTower extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new DominoTower();
  }
}

// goog.provide('box2d.Testbed.DominoTower');

// goog.require('box2d.Testbed.Test');

// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.DominoTower = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   var DOMINO_WIDTH = .2;
//   var DOMINO_FRICTION = 0.1;
//   var DOMINO_HEIGHT = 1.0;
//   var BASE_COUNT = 25;

//   /**
//    * The density of the dominos under construction. Varies for
//    * different parts of the tower.
//    */
//   var dominoDensity;

//   function makeDomino(x, y, horizontal) {
//     var sd = new box2d.b2PolygonShape();
//     sd.SetAsBox(0.5 * DOMINO_WIDTH, 0.5 * DOMINO_HEIGHT);
//     var fd = new box2d.b2FixtureDef();
//     fd.shape = sd;
//     fd.density = dominoDensity;
//     var bd = new box2d.b2BodyDef();
//     bd.type = box2d.b2BodyType.b2_dynamicBody;
//     fd.friction = DOMINO_FRICTION;
//     fd.restitution = 0.65;
//     bd.position.Set(x, y);
//     bd.angle = horizontal ? (Math.PI / 2.0) : 0;
//     var myBody = world.CreateBody(bd);
//     myBody.CreateFixture(fd);
//   }

//   var gravity = new box2d.b2Vec2(0, -10);
//   //world = new box2d.b2World(gravity);
//   var world = this.m_world;
//   world.SetGravity(gravity);

//   // Create the floor
//   {
//     var sd = new box2d.b2PolygonShape();
//     sd.SetAsBox(50, 10);

//     var bd = new box2d.b2BodyDef();
//     bd.position.Set(0, -10);
//     var body = world.CreateBody(bd);
//     body.CreateFixture(sd, 0);
//   }

//   {
//     dominoDensity = 10;
//     // Make bullet
//     var sd = new box2d.b2PolygonShape();
//     sd.SetAsBox(.7, .7);
//     var fd = new box2d.b2FixtureDef();
//     fd.density = 35.0;
//     var bd = new box2d.b2BodyDef();
//     bd.type = box2d.b2BodyType.b2_dynamicBody;
//     fd.shape = sd;
//     fd.friction = 0.0;
//     fd.restitution = 0.85;
//     bd.bullet = true;
//     bd.position = new box2d.b2Vec2(30.0, 5.00);
//     var b = world.CreateBody(bd);
//     b.CreateFixture(fd);
//     b.SetLinearVelocity(new box2d.b2Vec2(-25.0, -25.0))
//     b.SetAngularVelocity(6.7);

//     fd.density = 25.0;
//     bd.position = new box2d.b2Vec2(-30.0, 25.0);
//     b = world.CreateBody(bd);
//     b.CreateFixture(fd);
//     b.SetLinearVelocity(new box2d.b2Vec2(35.0, -10.0));
//     b.SetAngularVelocity(-8.3);
//   }

//   {

//     var currX;
//     // Make base
//     for (var i = 0; i < BASE_COUNT; ++i) {
//       currX = i * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * BASE_COUNT / 2);
//       makeDomino(currX, DOMINO_HEIGHT / 2.0, false);
//       makeDomino(currX, DOMINO_HEIGHT + DOMINO_WIDTH / 2.0, true);
//     }
//     currX = BASE_COUNT * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * BASE_COUNT / 2);

//     // Make 'I's
//     for (var j = 1; j < BASE_COUNT; ++j) {
//       if (j > 3) dominoDensity *= .8;

//       // The y at the center of the I structure.
//       var currY = DOMINO_HEIGHT * 0.5 + (DOMINO_HEIGHT + 2 * DOMINO_WIDTH) * .99 * j;

//       for (var i = 0; i < BASE_COUNT - j; ++i) {
//         currX = i * 1.5 * DOMINO_HEIGHT - (1.5 * DOMINO_HEIGHT * (BASE_COUNT - j) / 2);
//         dominoDensity *= 2.5;
//         if (i == 0) {
//           makeDomino(currX - (1.25 * DOMINO_HEIGHT) + .5 * DOMINO_WIDTH, currY - DOMINO_WIDTH, false);
//         }
//         if (i == BASE_COUNT - j - 1) {
//           makeDomino(currX + (1.25 * DOMINO_HEIGHT) - .5 * DOMINO_WIDTH, currY - DOMINO_WIDTH, false);
//         }

//         dominoDensity /= 2.5;
//         makeDomino(currX, currY, false);
//         makeDomino(currX, currY + .5 * (DOMINO_WIDTH + DOMINO_HEIGHT), true);
//         makeDomino(currX, currY - .5 * (DOMINO_WIDTH + DOMINO_HEIGHT), true);
//       }
//     }
//   }
// }

// goog.inherits(box2d.Testbed.DominoTower, box2d.Testbed.Test);

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.DominoTower.Create = function(canvas, settings) {
//   return new box2d.Testbed.DominoTower(canvas, settings);
// }
