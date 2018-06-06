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
import { Soup } from "./Soup";

export class SoupStirrer extends Soup {
  public m_stirrer: box2d.b2Body;
  public m_joint: box2d.b2Joint | null = null;
  public m_oscillationOffset = 0.0;

  constructor() {
    super();

    this.m_particleSystem.SetDamping(1.0);

    // Shape of the stirrer.
    const shape = new box2d.b2CircleShape();
    shape.m_p.Set(0, 0.7);
    shape.m_radius = 0.4;

    // Create the stirrer.
    const bd = new box2d.b2BodyDef();
    bd.type = box2d.b2BodyType.b2_dynamicBody;
    this.m_stirrer = this.m_world.CreateBody(bd);
    this.m_stirrer.CreateFixture(shape, 1.0);

    // Destroy all particles under the stirrer.
    const xf = new box2d.b2Transform();
    xf.SetIdentity();
    this.m_particleSystem.DestroyParticlesInShape(shape, xf);

    // By default attach the body to a joint to restrict movement.
    this.CreateJoint();
  }

  public CreateJoint() {
    // DEBUG: box2d.b2Assert(!this.m_joint);
    // Create a prismatic joint and connect to the ground, and have it
    // slide along the x axis.
    // Disconnect the body from this joint to have more fun.
    const prismaticJointDef = new box2d.b2PrismaticJointDef();
    prismaticJointDef.bodyA = this.m_groundBody;
    prismaticJointDef.bodyB = this.m_stirrer;
    prismaticJointDef.collideConnected = true;
    prismaticJointDef.localAxisA.Set(1, 0);
    prismaticJointDef.localAnchorA.Copy(this.m_stirrer.GetPosition());
    this.m_joint = this.m_world.CreateJoint(prismaticJointDef);
  }

  /**
   * Enable the joint if it's disabled, disable it if it's
   * enabled.
   */
  public ToggleJoint() {
    if (this.m_joint) {
      this.m_world.DestroyJoint(this.m_joint);
      this.m_joint = null;
    } else {
      this.CreateJoint();
    }
  }

  /**
   * Press "t" to enable / disable the joint restricting the
   * stirrer's movement.
   */
  public Keyboard(key: string) {
    switch (key) {
      case "t":
        this.ToggleJoint();
        break;
      default:
        super.Keyboard(key);
        break;
    }
  }

  /**
   * Click the soup to toggle between enabling / disabling the
   * joint.
   */
  public MouseUp(p: box2d.b2Vec2) {
    super.MouseUp(p);
    if (this.InSoup(p)) {
      this.ToggleJoint();
    }
  }

  /**
   * Determine whether a point is in the soup.
   */
  public InSoup(pos: box2d.b2Vec2) {
    // The soup dimensions are from the container initialization in the
    // Soup test.
    return pos.y > -1.0 && pos.y < 2.0 && pos.x > -3.0 && pos.x < 3.0;
  }

  /**
   * Apply a force to the stirrer.
   */
  public Step(settings: testbed.Settings) {
    // Magnitude of the force applied to the body.
    const k_forceMagnitude = 10.0;
    // How often the force vector rotates.
    const k_forceOscillationPerSecond = 0.2;
    const k_forceOscillationPeriod = 1.0 / k_forceOscillationPerSecond;
    // Maximum speed of the body.
    const k_maxSpeed = 2.0;

    this.m_oscillationOffset += (1.0 / settings.hz);
    if (this.m_oscillationOffset > k_forceOscillationPeriod) {
      this.m_oscillationOffset -= k_forceOscillationPeriod;
    }

    // Calculate the force vector.
    const forceAngle = this.m_oscillationOffset * k_forceOscillationPerSecond * 2.0 * box2d.b2_pi;
    const forceVector = new box2d.b2Vec2(Math.sin(forceAngle), Math.cos(forceAngle)).SelfMul(k_forceMagnitude);

    // Only apply force to the body when it's within the soup.
    if (this.InSoup(this.m_stirrer.GetPosition()) &&
      this.m_stirrer.GetLinearVelocity().Length() < k_maxSpeed) {
      this.m_stirrer.ApplyForceToCenter(forceVector, true);
    }
    super.Step(settings);
  }

  public static Create() {
    return new SoupStirrer();
  }
}

// #endif
