/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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

class ParticleVFX {
  private m_initialLifetime = 0.0;
  private m_remainingLifetime = 0.0;
  private m_halfLifetime = 0.0;
  private m_pg: box2d.b2ParticleGroup;
  private m_particleSystem: box2d.b2ParticleSystem;
  private m_origColor: box2d.b2Color = new box2d.b2Color();
  constructor(particleSystem: box2d.b2ParticleSystem, origin: box2d.b2Vec2, size: number, speed: number, lifetime: number, particleFlags: box2d.b2ParticleFlag) {
    // Create a circle to house the particles of size size
    const shape = new box2d.b2CircleShape();
    shape.m_p.Copy(origin);
    shape.m_radius = size;

    // Create particle def of random color.
    const pd = new box2d.b2ParticleGroupDef();
    pd.flags = particleFlags;
    pd.shape = shape;
    // this.m_origColor.Set(
    //   Math.random(),
    //   Math.random(),
    //   Math.random(),
    //   1.0);
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) { t += 1; }
      if (t > 1) { t -= 1; }
      if (t < 1 / 6) { return p + (q - p) * 6 * t; }
      if (t < 1 / 2) { return q; }
      if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
      return p;
    }
    function hslToRgb(h: number, s: number, l: number, a: number = 1): box2d.RGBA {
      let r, g, b;
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p: number = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return { r, g, b, a };
    }
    this.m_origColor.Copy(hslToRgb(Math.random(), 1, 0.5));
    pd.color.Copy(this.m_origColor);
    this.m_particleSystem = particleSystem;

    // Create a circle full of particles
    this.m_pg = this.m_particleSystem.CreateParticleGroup(pd);

    this.m_initialLifetime = this.m_remainingLifetime = lifetime;
    this.m_halfLifetime = this.m_initialLifetime * 0.5;

    // Set particle initial velocity based on how far away it is from
    // origin, exploding outwards.
    const bufferIndex = this.m_pg.GetBufferIndex();
    const pos = this.m_particleSystem.GetPositionBuffer();
    const vel = this.m_particleSystem.GetVelocityBuffer();
    for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
      ///  vel[i] = pos[i] - origin;
      box2d.b2Vec2.SubVV(pos[i], origin, vel[i]);
      ///  vel[i] *= speed;
      box2d.b2Vec2.MulVS(vel[i], speed, vel[i]);
    }
  }
  public Drop() {
    this.m_pg.DestroyParticles(false);
    // this.m_pg = null;
  }
  public ColorCoeff() {
    if (this.m_remainingLifetime >= this.m_halfLifetime) {
      return 1.0;
    }
    return 1.0 - ((this.m_halfLifetime - this.m_remainingLifetime) / this.m_halfLifetime);
  }
  public Step(dt: number) {
    if (dt > 0 && this.m_remainingLifetime > 0.0) {
      this.m_remainingLifetime = Math.max(this.m_remainingLifetime - dt, 0.0);
      const coeff = this.ColorCoeff();

      const colors = this.m_particleSystem.GetColorBuffer();
      const bufferIndex = this.m_pg.GetBufferIndex();

      // Set particle colors all at once.
      for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
        const c = colors[i];
        // c *= coeff;
        // c.SelfMul(coeff);
        // c.a = this.m_origColor.a;
        c.a *= coeff;
      }
    }
  }
  public IsDone() {
    return this.m_remainingLifetime <= 0.0;
  }
}

export class Sparky extends testbed.Test {
  private static c_maxCircles = 3; ///6;
  private static c_maxVFX = 20; ///50;
  private static SHAPE_HEIGHT_OFFSET = 7;
  private static SHAPE_OFFSET = 4.5;
  private m_VFXIndex: number = 0;
  private m_VFX: Array<ParticleVFX | null> = [];
  private m_contact: boolean = false;
  private m_contactPoint: box2d.b2Vec2 = new box2d.b2Vec2();
  constructor() {
    super();

    // Set up array of sparks trackers.
    this.m_VFXIndex = 0;

    for (let i = 0; i < Sparky.c_maxVFX; i++) {
      this.m_VFX[i] = null;
    }

    this.CreateWalls();
    this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius

    // Create a list of circles that will spark.
    for (let i = 0; i < Sparky.c_maxCircles; i++) {
      const bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      const body = this.m_world.CreateBody(bd);
      const shape = new box2d.b2CircleShape();
      shape.m_p.Set(3.0 * testbed.RandomFloat(),
        Sparky.SHAPE_HEIGHT_OFFSET + Sparky.SHAPE_OFFSET * i);
      shape.m_radius = 2;
      const f = body.CreateFixture(shape, 0.5);
      // Tag this as a sparkable body.
      f.SetUserData({
        spark: true,
      });
    }

    testbed.Test.SetRestartOnParticleParameterChange(false);
    testbed.Test.SetParticleParameterValue(box2d.b2ParticleFlag.b2_powderParticle);
  }

  public BeginContact(contact: box2d.b2Contact) {
    super.BeginContact(contact);
    // Check to see if these are two circles hitting one another.
    const userA = contact.GetFixtureA().GetUserData();
    const userB = contact.GetFixtureB().GetUserData();
    if ((userA && userA.spark) ||
      (userB && userB.spark)) {
      const worldManifold = new box2d.b2WorldManifold();
      contact.GetWorldManifold(worldManifold);

      // Note that we overwrite any contact; if there are two collisions
      // on the same frame, only the last one showers sparks.
      // Two collisions are rare, and this also guarantees we will not
      // run out of places to store ParticleVFX explosions.
      this.m_contactPoint.Copy(worldManifold.points[0]);
      this.m_contact = true;
    }
  }

  public Step(settings: testbed.Settings): void {
    const particleFlags = testbed.Test.GetParticleParameterValue();
    let dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
    if (settings.pause && !settings.singleStep) {
      dt = 0.0;
    }

    super.Step(settings);

    // If there was a contacts...
    if (this.m_contact) {
      // ...explode!
      this.AddVFX(this.m_contactPoint, particleFlags);
      this.m_contact = false;
    }

    // Step particle explosions.
    for (let i = 0; i < Sparky.c_maxVFX; i++) {
      const vfx = this.m_VFX[i];
      if (vfx === null) {
        continue;
      }
      vfx.Step(dt);
      if (vfx.IsDone()) {
        /// delete vfx;
        vfx.Drop();
        this.m_VFX[i] = null;
      }
    }
  }

  public AddVFX(p: box2d.b2Vec2, particleFlags: box2d.b2ParticleFlag) {
    const vfx = this.m_VFX[this.m_VFXIndex];
    if (vfx !== null) {
      /// delete vfx;
      vfx.Drop();
      this.m_VFX[this.m_VFXIndex] = null;
    }
    this.m_VFX[this.m_VFXIndex] = new ParticleVFX(
      this.m_particleSystem, p, testbed.RandomFloat(1.0, 2.0), testbed.RandomFloat(10.0, 20.0),
      testbed.RandomFloat(0.5, 1.0), particleFlags);
    if (++this.m_VFXIndex >= Sparky.c_maxVFX) {
      this.m_VFXIndex = 0;
    }
  }

  public CreateWalls() {
    // Create the walls of the world.
    {
      const bd = new box2d.b2BodyDef();
      const ground = this.m_world.CreateBody(bd);

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(-40, -10),
          new box2d.b2Vec2(40, -10),
          new box2d.b2Vec2(40, 0),
          new box2d.b2Vec2(-40, 0),
        ];
        shape.Set(vertices, 4);
        ground.CreateFixture(shape, 0.0);
      }

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(-40, 40),
          new box2d.b2Vec2(40, 40),
          new box2d.b2Vec2(40, 50),
          new box2d.b2Vec2(-40, 50),
        ];
        shape.Set(vertices, 4);
        ground.CreateFixture(shape, 0.0);
      }

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(-40, -10),
          new box2d.b2Vec2(-20, -10),
          new box2d.b2Vec2(-20, 50),
          new box2d.b2Vec2(-40, 50),
        ];
        shape.Set(vertices, 4);
        ground.CreateFixture(shape, 0.0);
      }

      {
        const shape = new box2d.b2PolygonShape();
        const vertices = [
          new box2d.b2Vec2(20, -10),
          new box2d.b2Vec2(40, -10),
          new box2d.b2Vec2(40, 50),
          new box2d.b2Vec2(20, 50),
        ];
        shape.Set(vertices, 4);
        ground.CreateFixture(shape, 0.0);
      }
    }
  }

  public static Create(): testbed.Test {
    return new Sparky();
  }
}

// #endif
