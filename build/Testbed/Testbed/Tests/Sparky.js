"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
///#if B2_ENABLE_PARTICLE
const box2d = require("../../Box2D/Box2D");
const testbed = require("../Testbed");
class ParticleVFX {
    constructor(particleSystem, origin, size, speed, lifetime, particleFlags) {
        this.m_initialLifetime = 0.0;
        this.m_remainingLifetime = 0.0;
        this.m_halfLifetime = 0.0;
        this.m_pg = null;
        this.m_particleSystem = null;
        this.m_origColor = new box2d.b2Color();
        // Create a circle to house the particles of size size
        let shape = new box2d.b2CircleShape();
        shape.m_p.Copy(origin);
        shape.m_radius = size;
        // Create particle def of random color.
        let pd = new box2d.b2ParticleGroupDef();
        pd.flags = particleFlags;
        pd.shape = shape;
        this.m_origColor.Set(Math.random(), Math.random(), Math.random(), 1.0);
        pd.color.Copy(this.m_origColor);
        this.m_particleSystem = particleSystem;
        // Create a circle full of particles
        this.m_pg = this.m_particleSystem.CreateParticleGroup(pd);
        this.m_initialLifetime = this.m_remainingLifetime = lifetime;
        this.m_halfLifetime = this.m_initialLifetime * 0.5;
        // Set particle initial velocity based on how far away it is from
        // origin, exploding outwards.
        let bufferIndex = this.m_pg.GetBufferIndex();
        let pos = this.m_particleSystem.GetPositionBuffer();
        let vel = this.m_particleSystem.GetVelocityBuffer();
        for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
            ///  vel[i] = pos[i] - origin;
            box2d.b2Vec2.SubVV(pos[i], origin, vel[i]);
            ///  vel[i] *= speed;
            box2d.b2Vec2.MulVS(vel[i], speed, vel[i]);
        }
    }
    Drop() {
        this.m_pg.DestroyParticles(false);
        this.m_pg = null;
    }
    ColorCoeff() {
        if (this.m_remainingLifetime >= this.m_halfLifetime) {
            return 1.0;
        }
        return 1.0 - ((this.m_halfLifetime - this.m_remainingLifetime) / this.m_halfLifetime);
    }
    Step(dt) {
        if (this.m_remainingLifetime > 0.0) {
            this.m_remainingLifetime = Math.max(this.m_remainingLifetime - dt, 0.0);
            let coeff = this.ColorCoeff();
            let colors = this.m_particleSystem.GetColorBuffer();
            let bufferIndex = this.m_pg.GetBufferIndex();
            // Set particle colors all at once.
            for (let i = bufferIndex; i < bufferIndex + this.m_pg.GetParticleCount(); i++) {
                let c = colors[i];
                ///  c *= coeff;
                c.SelfMul_0_1(coeff);
                c.a = this.m_origColor.a;
            }
        }
    }
    IsDone() {
        return this.m_remainingLifetime <= 0.0;
    }
}
class Sparky extends testbed.Test {
    constructor() {
        super();
        this.m_VFXIndex = 0;
        this.m_VFX = [];
        this.m_contact = false;
        this.m_contactPoint = new box2d.b2Vec2();
        // Set up array of sparks trackers.
        this.m_VFXIndex = 0;
        for (let i = 0; i < Sparky.c_maxVFX; i++) {
            this.m_VFX[i] = null;
        }
        this.CreateWalls();
        this.m_particleSystem.SetRadius(0.25 * 2); // HACK: increase particle radius
        // Create a list of circles that will spark.
        for (let i = 0; i < Sparky.c_maxCircles; i++) {
            let bd = new box2d.b2BodyDef();
            bd.type = 2 /* b2_dynamicBody */;
            let body = this.m_world.CreateBody(bd);
            let shape = new box2d.b2CircleShape();
            shape.m_p.Set(3.0 * testbed.RandomFloat(), Sparky.SHAPE_HEIGHT_OFFSET + Sparky.SHAPE_OFFSET * i);
            shape.m_radius = 2;
            let f = body.CreateFixture(shape, 0.5);
            // Tag this as a sparkable body.
            f.SetUserData({
                spark: true
            });
        }
        testbed.Main.SetRestartOnParticleParameterChange(false);
        testbed.Main.SetParticleParameterValue(64 /* b2_powderParticle */);
    }
    BeginContact(contact) {
        super.BeginContact(contact);
        // Check to see if these are two circles hitting one another.
        let userA = contact.GetFixtureA().GetUserData();
        let userB = contact.GetFixtureB().GetUserData();
        if ((userA && userA.spark) ||
            (userB && userB.spark)) {
            let worldManifold = new box2d.b2WorldManifold();
            contact.GetWorldManifold(worldManifold);
            // Note that we overwrite any contact; if there are two collisions
            // on the same frame, only the last one showers sparks.
            // Two collisions are rare, and this also guarantees we will not
            // run out of places to store ParticleVFX explosions.
            this.m_contactPoint.Copy(worldManifold.points[0]);
            this.m_contact = true;
        }
    }
    Step(settings) {
        let particleFlags = testbed.Main.GetParticleParameterValue();
        super.Step(settings);
        // If there was a contacts...
        if (this.m_contact) {
            // ...explode!
            this.AddVFX(this.m_contactPoint, particleFlags);
            this.m_contact = false;
        }
        // Step particle explosions.
        for (let i = 0; i < Sparky.c_maxVFX; i++) {
            let vfx = this.m_VFX[i];
            if (vfx === null)
                continue;
            vfx.Step(1.0 / settings.hz);
            if (vfx.IsDone()) {
                /// delete vfx;
                vfx.Drop();
                this.m_VFX[i] = null;
            }
        }
    }
    AddVFX(p, particleFlags) {
        let vfx = this.m_VFX[this.m_VFXIndex];
        if (vfx !== null) {
            /// delete vfx;
            vfx.Drop();
            this.m_VFX[this.m_VFXIndex] = null;
        }
        this.m_VFX[this.m_VFXIndex] = new ParticleVFX(this.m_particleSystem, p, testbed.RandomFloat(1.0, 2.0), testbed.RandomFloat(10.0, 20.0), testbed.RandomFloat(0.5, 1.0), particleFlags);
        if (++this.m_VFXIndex >= Sparky.c_maxVFX) {
            this.m_VFXIndex = 0;
        }
    }
    CreateWalls() {
        // Create the walls of the world.
        {
            let bd = new box2d.b2BodyDef();
            let ground = this.m_world.CreateBody(bd);
            {
                let shape = new box2d.b2PolygonShape();
                let vertices = [
                    new box2d.b2Vec2(-40, -10),
                    new box2d.b2Vec2(40, -10),
                    new box2d.b2Vec2(40, 0),
                    new box2d.b2Vec2(-40, 0)
                ];
                shape.Set(vertices, 4);
                ground.CreateFixture(shape, 0.0);
            }
            {
                let shape = new box2d.b2PolygonShape();
                let vertices = [
                    new box2d.b2Vec2(-40, 40),
                    new box2d.b2Vec2(40, 40),
                    new box2d.b2Vec2(40, 50),
                    new box2d.b2Vec2(-40, 50)
                ];
                shape.Set(vertices, 4);
                ground.CreateFixture(shape, 0.0);
            }
            {
                let shape = new box2d.b2PolygonShape();
                let vertices = [
                    new box2d.b2Vec2(-40, -1),
                    new box2d.b2Vec2(-20, -1),
                    new box2d.b2Vec2(-20, 40),
                    new box2d.b2Vec2(-40, 40)
                ];
                shape.Set(vertices, 4);
                ground.CreateFixture(shape, 0.0);
            }
            {
                let shape = new box2d.b2PolygonShape();
                let vertices = [
                    new box2d.b2Vec2(20, -1),
                    new box2d.b2Vec2(40, -1),
                    new box2d.b2Vec2(40, 40),
                    new box2d.b2Vec2(20, 40)
                ];
                shape.Set(vertices, 4);
                ground.CreateFixture(shape, 0.0);
            }
        }
    }
    static Create() {
        return new Sparky();
    }
}
Sparky.c_maxCircles = 3; ///6;
Sparky.c_maxVFX = 20; ///50;
Sparky.SHAPE_HEIGHT_OFFSET = 7;
Sparky.SHAPE_OFFSET = 4.5;
exports.Sparky = Sparky;
///#endif
//# sourceMappingURL=Sparky.js.map