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

export class MultipleParticleSystems extends testbed.Test {
  m_particleSystem2: box2d.b2ParticleSystem = null;
  m_emitters: testbed.RadialEmitter[];

  /**
   * Maximum number of particles per system.
   */
  static readonly k_maxParticleCount = 500;
  /**
   * Size of the box which is pushed around by particles.
   */
  static readonly k_dynamicBoxSize = new box2d.b2Vec2(0.5, 0.5);
  /**
   * Mass of the box.
   */
  static readonly k_boxMass = 1.0;
  /**
   * Emit rate of the emitters in particles per second.
   */
  static readonly k_emitRate = 100.0;
  /**
   * Location of the left emitter (the position of the right one
   * is mirrored along the y-axis).
   */
  static readonly k_emitterPosition = new box2d.b2Vec2(-5.0, 4.0);
  /**
   * Starting velocity of particles from the left emitter (the
   * velocity of particles from the right emitter are mirrored
   * along the y-axis).
   */
  static readonly k_emitterVelocity = new box2d.b2Vec2(7.0, -4.0);
  /**
   * Size of particle emitters.
   */
  static readonly k_emitterSize = new box2d.b2Vec2(1.0, 1.0);
  /**
   * Color of the left emitter's particles.
   */
  static readonly k_leftEmitterColor = new box2d.b2Color(0x22/255, 0x33/255, 0xff/255, 0xff/255);
  /**
   * Color of the right emitter's particles.
   */
  static readonly k_rightEmitterColor = new box2d.b2Color(0xff/255, 0x22/255, 0x11/255, 0xff/255);

  constructor() {
    super();

    this.m_emitters = [
      new testbed.RadialEmitter(),
      new testbed.RadialEmitter()
    ];

    // Configure the default particle system's parameters.
    this.m_particleSystem.SetRadius(0.05);
    this.m_particleSystem.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);
    this.m_particleSystem.SetDestructionByAge(true);

    // Create a secondary particle system.
    const particleSystemDef = new box2d.b2ParticleSystemDef();
    particleSystemDef.radius = this.m_particleSystem.GetRadius();
    particleSystemDef.destroyByAge = true;
    this.m_particleSystem2 = this.m_world.CreateParticleSystem(particleSystemDef);
    this.m_particleSystem2.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);

    // Don't restart the test when changing particle types.
    testbed.Main.SetRestartOnParticleParameterChange(false);

    // Create the ground.
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(5.0, 0.1);
      ground.CreateFixture(shape, 0.0);
    }

    // Create a dynamic body to push around.
    {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2PolygonShape();
      const center = new box2d.b2Vec2(0.0, 1.2);
      shape.SetAsBox(MultipleParticleSystems.k_dynamicBoxSize.x, MultipleParticleSystems.k_dynamicBoxSize.y, center, 0.0);
      body.CreateFixture(shape, 0.0);
      ///  b2MassData massData = { MultipleParticleSystems.k_boxMass, center, 0.0 };
      const massData = new box2d.b2MassData();
      massData.mass = MultipleParticleSystems.k_boxMass;
      massData.center.Copy(center);
      massData.I = 0.0;
      body.SetMassData(massData);
    }

    // Initialize the emitters.
    for (let i = 0; i < this.m_emitters.length; ++i) {
      const mirrorAlongY = i & 1 ? -1.0 : 1.0;
      const emitter = this.m_emitters[i];
      emitter.SetPosition(
        new box2d.b2Vec2(MultipleParticleSystems.k_emitterPosition.x * mirrorAlongY,
          MultipleParticleSystems.k_emitterPosition.y));
      emitter.SetSize(MultipleParticleSystems.k_emitterSize);
      emitter.SetVelocity(
        new box2d.b2Vec2(MultipleParticleSystems.k_emitterVelocity.x * mirrorAlongY,
          MultipleParticleSystems.k_emitterVelocity.y));
      emitter.SetEmitRate(MultipleParticleSystems.k_emitRate);
      emitter.SetColor(i & 1 ? MultipleParticleSystems.k_rightEmitterColor : MultipleParticleSystems.k_leftEmitterColor);
      emitter.SetParticleSystem(i & 1 ? this.m_particleSystem2 : this.m_particleSystem);
    }
  }

  Step(settings: testbed.Settings) {
    const dt = 1.0 / settings.hz;
    super.Step(settings);
    for (let i = 0; i < this.m_emitters.length; ++i) {
      this.m_emitters[i].Step(dt);
    }
  }

  GetDefaultViewZoom() {
    return 0.1;
  }

  static Create() {
    return new MultipleParticleSystems();
  }
}

// #endif

// //#if B2_ENABLE_PARTICLE

// goog.provide('MultipleParticleSystems');

// goog.require('testbed.Test');
// goog.require('testbed.RadialEmitter');

// /**
//  * The "Multiple Systems" test uses two particle emitters to
//  * push a rigid body in opposing directions showing that
//  * particles from each system can interact with the same body
//  * and at the same time not interact with each other.
//  * @export
//  * @constructor
//  * @extends {testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {testbed.Settings} settings
//  */
// MultipleParticleSystems = function(canvas, settings) {
//   testbed.Test.call(this, canvas, settings); // base class constructor

// }

// goog.inherits(MultipleParticleSystems, testbed.Test);


// /**
//  * Run a simulation step.
//  * @export
//  * @return {void}
//  * @param {testbed.Settings} settings
//  */
// MultipleParticleSystems.prototype.Step = function(settings) {
//   const dt = 1.0 / settings.hz;
//   testbed.Test.prototype.Step.call(this, settings);
//   for (let i = 0; i < this.m_emitters.length; ++i) {
//     this.m_emitters[i].Step(dt);
//   }
// }

// /**
//  * @export
//  * @return {number}
//  */
// MultipleParticleSystems.prototype.GetDefaultViewZoom = function() {
//   return 0.2;
// }

// /**
//  * Create the multiple particle systems test.
//  * @export
//  * @return {testbed.Test}
//  * @param {HTMLCanvasElement} canvas
//  * @param {testbed.Settings} settings
//  */
// MultipleParticleSystems.Create = function(canvas, settings) {
//   return new MultipleParticleSystems(canvas, settings);
// }

// //#endif
