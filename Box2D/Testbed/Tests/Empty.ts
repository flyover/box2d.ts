import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

export class Empty extends testbed.Test {
  constructor() {
    super();
  }
  static Create() {
    return new Empty();
  }
}

// goog.provide('box2d.Testbed.Empty');

// goog.require('box2d.Testbed.Test');

// /**
//  * @export
//  * @constructor
//  * @extends {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Empty = function(canvas, settings) {
//   box2d.Testbed.Test.call(this, canvas, settings); // base class constructor
// }

// goog.inherits(box2d.Testbed.Empty, box2d.Testbed.Test);

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Joint} joint
//  */
// box2d.Testbed.Empty.prototype.JointDestroyed = function(joint) {
//   box2d.Testbed.Test.prototype.JointDestroyed.call(this, joint);
// }

// //#if B2_ENABLE_PARTICLE

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2ParticleGroup} group
//  */
// box2d.Testbed.Empty.prototype.ParticleGroupDestroyed = function(group) {
//   box2d.Testbed.Test.prototype.ParticleGroupDestroyed.call(this, group);
// }

// //#endif

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.Empty.prototype.BeginContact = function(contact) {
//   box2d.Testbed.Test.prototype.BeginContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  */
// box2d.Testbed.Empty.prototype.EndContact = function(contact) {
//   box2d.Testbed.Test.prototype.EndContact.call(this, contact);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2Manifold} oldManifold
//  */
// box2d.Testbed.Empty.prototype.PreSolve = function(contact, oldManifold) {
//   box2d.Testbed.Test.prototype.PreSolve.call(this, contact, oldManifold);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Contact} contact
//  * @param {box2d.b2ContactImpulse} impulse
//  */
// box2d.Testbed.Empty.prototype.PostSolve = function(contact, impulse) {
//   box2d.Testbed.Test.prototype.PostSolve.call(this, contact, impulse);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.Empty.prototype.Keyboard = function(key) {
//   box2d.Testbed.Test.prototype.Keyboard.call(this, key);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {number} key
//  */
// box2d.Testbed.Empty.prototype.KeyboardUp = function(key) {
//   box2d.Testbed.Test.prototype.KeyboardUp.call(this, key);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Empty.prototype.MouseDown = function(p) {
//   box2d.Testbed.Test.prototype.MouseDown.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Empty.prototype.MouseUp = function(p) {
//   box2d.Testbed.Test.prototype.MouseUp.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.b2Vec2} p
//  */
// box2d.Testbed.Empty.prototype.MouseMove = function(p) {
//   box2d.Testbed.Test.prototype.MouseMove.call(this, p);
// }

// /**
//  * @export
//  * @return {void}
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Empty.prototype.Step = function(settings) {
//   box2d.Testbed.Test.prototype.Step.call(this, settings);
// }

// /**
//  * @export
//  * @return {number}
//  */
// box2d.Testbed.Empty.prototype.GetDefaultViewZoom = function() {
//   return box2d.Testbed.Test.prototype.GetDefaultViewZoom.call(this);
// }

// /**
//  * @export
//  * @return {box2d.Testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {box2d.Testbed.Settings} settings
//  */
// box2d.Testbed.Empty.Create = function(canvas, settings) {
//   return new box2d.Testbed.Empty(canvas, settings);
// }
