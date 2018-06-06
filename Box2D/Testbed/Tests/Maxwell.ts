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

import * as box2d from "Box2D";
import * as testbed from "Testbed";

/**
 * Game which adds some fun to Maxwell's demon.
 *
 * http://en.wikipedia.org/wiki/Maxwell's_demon
 *
 * The user's goal is to try to catch as many particles as
 * possible in the bottom half of the container by splitting the
 * container using a barrier with the 'a' key.
 *
 * See Maxwell::Keyboard() for other controls.
 */

export class Maxwell extends testbed.Test {
  public m_density = Maxwell.k_densityDefault;
  public m_position = Maxwell.k_containerHalfHeight;
  public m_temperature = Maxwell.k_temperatureDefault;
  public m_barrierBody: box2d.b2Body | null = null;
  public m_particleGroup: box2d.b2ParticleGroup | null = null;

  public static readonly k_containerWidth = 2.0;
  public static readonly k_containerHeight = 4.0;
  public static readonly k_containerHalfWidth = Maxwell.k_containerWidth / 2.0;
  public static readonly k_containerHalfHeight = Maxwell.k_containerHeight / 2.0;
  public static readonly k_barrierHeight = Maxwell.k_containerHalfHeight / 100.0;
  public static readonly k_barrierMovementIncrement = Maxwell.k_containerHalfHeight * 0.1;
  public static readonly k_densityStep = 1.25;
  public static readonly k_densityMin = 0.01;
  public static readonly k_densityMax = 0.8;
  public static readonly k_densityDefault = 0.25;
  public static readonly k_temperatureStep = 0.2;
  public static readonly k_temperatureMin = 0.4;
  public static readonly k_temperatureMax = 10.0;
  public static readonly k_temperatureDefault = 5.0;

  constructor() {
    super();

    this.m_world.SetGravity(new box2d.b2Vec2(0, 0));

    // Create the container.
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);
      const shape = new box2d.b2ChainShape();
      const vertices = [
        new box2d.b2Vec2(-Maxwell.k_containerHalfWidth, 0),
        new box2d.b2Vec2(Maxwell.k_containerHalfWidth, 0),
        new box2d.b2Vec2(Maxwell.k_containerHalfWidth, Maxwell.k_containerHeight),
        new box2d.b2Vec2(-Maxwell.k_containerHalfWidth, Maxwell.k_containerHeight),
      ];
      shape.CreateLoop(vertices, 4);
      const def = new box2d.b2FixtureDef();
      def.shape = shape;
      def.density = 0;
      def.restitution = 1.0;
      ground.CreateFixture(def);
    }

    // Enable the barrier.
    this.EnableBarrier();
    // Create the particles.
    this.ResetParticles();
  }

  /**
   * Disable the barrier.
   */
  public DisableBarrier() {
    if (this.m_barrierBody) {
      this.m_world.DestroyBody(this.m_barrierBody);
      this.m_barrierBody = null;
    }
  }

  /**
   * Enable the barrier.
   */
  public EnableBarrier() {
    if (!this.m_barrierBody) {
      const bd = new box2d.b2BodyDef();
      this.m_barrierBody = this.m_world.CreateBody(bd);
      const barrierShape = new box2d.b2PolygonShape();
      barrierShape.SetAsBox(Maxwell.k_containerHalfWidth, Maxwell.k_barrierHeight,
        new box2d.b2Vec2(0, this.m_position), 0);
      const def = new box2d.b2FixtureDef();
      def.shape = barrierShape;
      def.density = 0;
      def.restitution = 1.0;
      this.m_barrierBody.CreateFixture(def);
    }
  }

  /**
   * Enable / disable the barrier.
   */
  public ToggleBarrier() {
    if (this.m_barrierBody) {
      this.DisableBarrier();
    } else {
      this.EnableBarrier();
    }
  }

  /**
   * Destroy and recreate all particles.
   */
  public ResetParticles() {
    if (this.m_particleGroup !== null) {
      this.m_particleGroup.DestroyParticles(false);
      this.m_particleGroup = null;
    }

    this.m_particleSystem.SetRadius(Maxwell.k_containerHalfWidth / 20.0); {
      const shape = new box2d.b2PolygonShape();
      shape.SetAsBox(this.m_density * Maxwell.k_containerHalfWidth,
        this.m_density * Maxwell.k_containerHalfHeight,
        new box2d.b2Vec2(0, Maxwell.k_containerHalfHeight), 0);
      const pd = new box2d.b2ParticleGroupDef();
      pd.flags = box2d.b2ParticleFlag.b2_powderParticle;
      pd.shape = shape;
      this.m_particleGroup = this.m_particleSystem.CreateParticleGroup(pd);
      ///  b2Vec2* velocities =
      ///    this.m_particleSystem.GetVelocityBuffer() +
      ///    this.m_particleGroup.GetBufferIndex();
      const velocities = this.m_particleSystem.GetVelocityBuffer();
      const index = this.m_particleGroup.GetBufferIndex();

      for (let i = 0; i < this.m_particleGroup.GetParticleCount(); ++i) {
        ///  b2Vec2& v = *(velocities + i);
        const v = velocities[index + i];
        v.Set(testbed.RandomFloat() + 1.0, testbed.RandomFloat() + 1.0);
        v.Normalize();
        ///  v *= this.m_temperature;
        v.SelfMul(this.m_temperature);
      }
    }
  }

  public Keyboard(key: string) {
    switch (key) {
      case "a":
        // Enable / disable the barrier.
        this.ToggleBarrier();
        break;
      case "=":
        // Increase the particle density.
        this.m_density = box2d.b2Min(this.m_density * Maxwell.k_densityStep, Maxwell.k_densityMax);
        this.Reset();
        break;
      case "-":
        // Reduce the particle density.
        this.m_density = box2d.b2Max(this.m_density / Maxwell.k_densityStep, Maxwell.k_densityMin);
        this.Reset();
        break;
      case ".":
        // Move the location of the divider up.
        this.MoveDivider(this.m_position + Maxwell.k_barrierMovementIncrement);
        break;
      case ",":
        // Move the location of the divider down.
        this.MoveDivider(this.m_position - Maxwell.k_barrierMovementIncrement);
        break;
      case ";":
        // Reduce the temperature (velocity of particles).
        this.m_temperature = box2d.b2Max(this.m_temperature - Maxwell.k_temperatureStep,
          Maxwell.k_temperatureMin);
        this.Reset();
        break;
      case "'":
        // Increase the temperature (velocity of particles).
        this.m_temperature = box2d.b2Min(this.m_temperature + Maxwell.k_temperatureStep,
          Maxwell.k_temperatureMax);
        this.Reset();
        break;
      default:
        super.Keyboard(key);
        break;
    }
  }

  /**
   * Determine whether a point is in the container.
   */
  public InContainer(p: box2d.b2Vec2) {
    return p.x >= -Maxwell.k_containerHalfWidth && p.x <= Maxwell.k_containerHalfWidth &&
      p.y >= 0.0 && p.y <= Maxwell.k_containerHalfHeight * 2.0;
  }

  public MouseDown(p: box2d.b2Vec2) {
    if (!this.InContainer(p)) {
      super.MouseDown(p);
    }
  }

  public MouseUp(p: box2d.b2Vec2) {
    // If the pointer is in the container.
    if (this.InContainer(p)) {
      // Enable / disable the barrier.
      this.ToggleBarrier();
    } else {
      // Move the barrier to the touch position.
      this.MoveDivider(p.y);

      super.MouseUp(p);
    }
  }

  public Step(settings: testbed.Settings) {
    super.Step(settings);

    // Number of particles above (top) and below (bottom) the barrier.
    let top = 0;
    let bottom = 0;

    if (this.m_particleGroup) {
      const index = this.m_particleGroup.GetBufferIndex();
      ///  b2Vec2* const velocities = this.m_particleSystem.GetVelocityBuffer() + index;
      const velocities = this.m_particleSystem.GetVelocityBuffer();
      ///  b2Vec2* const positions = this.m_particleSystem.GetPositionBuffer() + index;
      const positions = this.m_particleSystem.GetPositionBuffer();

      for (let i = 0; i < this.m_particleGroup.GetParticleCount(); i++) {
        // Add energy to particles based upon the temperature.
        ///  b2Vec2& v = velocities[i];
        const v = velocities[index + i];
        v.Normalize();
        ///  v *= this.m_temperature;
        v.SelfMul(this.m_temperature);

        // Keep track of the number of particles above / below the
        // divider / barrier position.
        ///  b2Vec2& p = positions[i];
        const p = positions[index + i];
        if (p.y > this.m_position) {
          top++;
        } else {
          bottom++;
        }
      }
    }

    // Calculate a score based upon the difference in pressure between the
    // upper and lower divisions of the container.
    const topPressure = top / (Maxwell.k_containerHeight - this.m_position);
    const botPressure = bottom / this.m_position;
    testbed.g_debugDraw.DrawString(
      10, 75, `Score: ${topPressure > 0.0 ? botPressure / topPressure - 1.0 : 0.0}`);
  }

  /**
   * Reset the particles and the barrier.
   */
  public Reset() {
    this.DisableBarrier();
    this.ResetParticles();
    this.EnableBarrier();
  }

  /**
   * Move the divider / barrier.
   */
  public MoveDivider(newPosition: number) {
    this.m_position = box2d.b2Clamp(newPosition, Maxwell.k_barrierMovementIncrement,
      Maxwell.k_containerHeight - Maxwell.k_barrierMovementIncrement);
    this.Reset();
  }

  public GetDefaultViewZoom() {
    return 0.1;
  }

  public static Create() {
    return new Maxwell();
  }
}

// #endif
