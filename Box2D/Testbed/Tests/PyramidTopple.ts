import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class PyramidTopple extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new PyramidTopple();
  }
}

// goog.provide('box2d.Testbed.PyramidTopple');

// goog.require('box2d.Testbed.Test');

// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.PyramidTopple = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor

//   var WIDTH = 4;
//   var HEIGHT = 30;

//   var add_domino = function(world, pos, flipped) {
//     var mass = 1;

//     var bd = new box2d.b2BodyDef();
//     bd.type = box2d.b2BodyType.b2_dynamicBody;
//     bd.position.Copy(pos);
//     var body = world.CreateBody(bd);

//     var shape = new box2d.b2PolygonShape();
//     if (flipped) {
//       shape.SetAsBox(0.5 * HEIGHT, 0.5 * WIDTH);
//     } else {
//       shape.SetAsBox(0.5 * WIDTH, 0.5 * HEIGHT);
//     }

//     var fd = new box2d.b2FixtureDef();
//     fd.shape = shape;
//     fd.density = mass / (WIDTH * HEIGHT);
//     fd.friction = 0.6;
//     fd.restitution = 0.0;
//     body.CreateFixture(fd);
//   };

//   var world = this.m_world;
//   ///settings.positionIterations = 30; // cpSpaceSetIterations(space, 30);
//   ///world.SetGravity(new box2d.b2Vec2(0, -300)); // cpSpaceSetGravity(space, cpv(0, -300));
//   ///box2d.b2_timeToSleep = 0.5; // cpSpaceSetSleepTimeThreshold(space, 0.5f);
//   ///box2d.b2_linearSlop = 0.5; // cpSpaceSetCollisionSlop(space, 0.5f);

//   // Add a floor.
//   var bd = new box2d.b2BodyDef();
//   var body = world.CreateBody(bd);
//   var shape = new box2d.b2EdgeShape();
//   shape.SetAsEdge(new box2d.b2Vec2(-600, -240), new box2d.b2Vec2(600, -240));
//   var fd = new box2d.b2FixtureDef();
//   fd.shape = shape;
//   fd.friction = 1.0;
//   fd.restitution = 1.0;
//   body.CreateFixture(fd);

//   // Add the dominoes.
//   var n = 12;
//   for (var i = 0; i < n; i++) {
//     for (var j = 0; j < (n - i); j++) {
//       var offset = new box2d.b2Vec2((j - (n - 1 - i) * 0.5) * 1.5 * HEIGHT, (i + 0.5) * (HEIGHT + 2 * WIDTH) - WIDTH - 240);
//       add_domino(world, offset, false);
//       add_domino(world, box2d.b2Add_V2_V2(offset, new box2d.b2Vec2(0, (HEIGHT + WIDTH) / 2), new box2d.b2Vec2()), true);

//       if (j === 0) {
//         add_domino(world, box2d.b2Add_V2_V2(offset, new box2d.b2Vec2(0.5 * (WIDTH - HEIGHT), HEIGHT + WIDTH), new box2d.b2Vec2()), false);
//       }

//       if (j != n - i - 1) {
//         add_domino(world, box2d.b2Add_V2_V2(offset, new box2d.b2Vec2(HEIGHT * 0.75, (HEIGHT + 3 * WIDTH) / 2), new box2d.b2Vec2()), true);
//       } else {
//         add_domino(world, box2d.b2Add_V2_V2(offset, new box2d.b2Vec2(0.5 * (HEIGHT - WIDTH), HEIGHT + WIDTH), new box2d.b2Vec2()), false);
//       }
//     }
//   }
// }

// goog.inherits(box2d.Testbed.PyramidTopple, box2d.Testbed.Test);

// /**
//  * @export
//  * @return {number}
//  */
// box2d.Testbed.PyramidTopple.prototype.GetDefaultViewZoom = function() {
//   return 10.0;
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.PyramidTopple.Create = function(canvas, settings) {
//   return new box2d.Testbed.PyramidTopple(canvas, settings);
// }
