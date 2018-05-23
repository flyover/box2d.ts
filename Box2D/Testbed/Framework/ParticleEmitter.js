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
System.register(["../../Box2D/Box2D"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, EmittedParticleCallback, RadialEmitter;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            }
        ],
        execute: function () {
            EmittedParticleCallback = class EmittedParticleCallback {
                /**
                 * Called for each created particle.
                 */
                ParticleCreated(system, particleIndex) { }
            };
            exports_1("EmittedParticleCallback", EmittedParticleCallback);
            /**
             * Emit particles from a circular region.
             */
            RadialEmitter = class RadialEmitter {
                constructor() {
                    /**
                     * Pointer to global world
                     */
                    this.m_particleSystem = null;
                    /**
                     * Called for each created particle.
                     */
                    this.m_callback = null;
                    /**
                     * Center of particle emitter
                     */
                    this.m_origin = new box2d.b2Vec2();
                    /**
                     * Launch direction.
                     */
                    this.m_startingVelocity = new box2d.b2Vec2();
                    /**
                     * Speed particles are emitted
                     */
                    this.m_speed = 0.0;
                    /**
                     * Half width / height of particle emitter
                     */
                    this.m_halfSize = new box2d.b2Vec2();
                    /**
                     * Particles per second
                     */
                    this.m_emitRate = 1.0;
                    /**
                     * Initial color of particle emitted.
                     */
                    this.m_color = new box2d.b2Color();
                    /**
                     * Number particles to emit on the next frame
                     */
                    this.m_emitRemainder = 0.0;
                    /**
                     * Flags for created particles, see b2ParticleFlag.
                     */
                    this.m_flags = box2d.b2ParticleFlag.b2_waterParticle;
                    /**
                     * Group to put newly created particles in.
                     */
                    this.m_group = null;
                }
                /**
                 * Calculate a random number 0.0..1.0.
                 */
                static Random() {
                    return Math.random();
                }
                _dtor_() {
                    this.SetGroup(null);
                }
                /**
                 * Set the center of the emitter.
                 */
                SetPosition(origin) {
                    this.m_origin.Copy(origin);
                }
                /**
                 * Get the center of the emitter.
                 */
                GetPosition(out) {
                    return out.Copy(this.m_origin);
                }
                /**
                 * Set the size of the circle which emits particles.
                 */
                SetSize(size) {
                    this.m_halfSize.Copy(size).SelfMul(0.5);
                }
                /**
                 * Get the size of the circle which emits particles.
                 */
                GetSize(out) {
                    return out.Copy(this.m_halfSize).SelfMul(2.0);
                }
                /**
                 * Set the starting velocity of emitted particles.
                 */
                SetVelocity(velocity) {
                    this.m_startingVelocity.Copy(velocity);
                }
                /**
                 * Get the starting velocity.
                 */
                GetVelocity(out) {
                    return out.Copy(this.m_startingVelocity);
                }
                /**
                 * Set the speed of particles along the direction from the
                 * center of the emitter.
                 */
                SetSpeed(speed) {
                    this.m_speed = speed;
                }
                /**
                 * Get the speed of particles along the direction from the
                 * center of the emitter.
                 */
                GetSpeed() {
                    return this.m_speed;
                }
                /**
                 * Set the flags for created particles.
                 */
                SetParticleFlags(flags) {
                    this.m_flags = flags;
                }
                /**
                 * Get the flags for created particles.
                 */
                GetParticleFlags() {
                    return this.m_flags;
                }
                /**
                 * Set the color of particles.
                 */
                SetColor(color) {
                    this.m_color.Copy(color);
                }
                /**
                 * Get the color of particles emitter.
                 */
                GetColor(out) {
                    return out.Copy(this.m_color);
                }
                /**
                 * Set the emit rate in particles per second.
                 */
                SetEmitRate(emitRate) {
                    this.m_emitRate = emitRate;
                }
                /**
                 * Get the current emit rate.
                 */
                GetEmitRate() {
                    return this.m_emitRate;
                }
                /**
                 * Set the particle system this emitter is adding particles to.
                 */
                SetParticleSystem(particleSystem) {
                    this.m_particleSystem = particleSystem;
                }
                /**
                 * Get the particle system this emitter is adding particle to.
                 */
                GetParticleSystem() {
                    return this.m_particleSystem;
                }
                /**
                 * Set the callback that is called on the creation of each
                 * particle.
                 */
                SetCallback(callback) {
                    this.m_callback = callback;
                }
                /**
                 * Get the callback that is called on the creation of each
                 * particle.
                 */
                GetCallback() {
                    return this.m_callback;
                }
                /**
                 * This class sets the group flags to b2_particleGroupCanBeEmpty
                 * so that it isn't destroyed and clears the
                 * b2_particleGroupCanBeEmpty on the group when the emitter no
                 * longer references it so that the group can potentially be
                 * cleaned up.
                 */
                SetGroup(group) {
                    if (this.m_group) {
                        this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() & ~box2d.b2ParticleGroupFlag.b2_particleGroupCanBeEmpty);
                    }
                    this.m_group = group;
                    if (this.m_group) {
                        this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() | box2d.b2ParticleGroupFlag.b2_particleGroupCanBeEmpty);
                    }
                }
                /**
                 * Get the group particles should be created within.
                 */
                GetGroup() {
                    return this.m_group;
                }
                /**
                 * dt is seconds that have passed, particleIndices is an
                 * optional pointer to an array which tracks which particles
                 * have been created and particleIndicesCount is the size of the
                 * particleIndices array. This function returns the number of
                 * particles created during this simulation step.
                 */
                Step(dt, particleIndices, particleIndicesCount) {
                    box2d.b2Assert(this.m_particleSystem !== null);
                    let numberOfParticlesCreated = 0;
                    // How many (fractional) particles should we have emitted this frame?
                    this.m_emitRemainder += this.m_emitRate * dt;
                    let pd = new box2d.b2ParticleDef();
                    pd.color.Copy(this.m_color);
                    pd.flags = this.m_flags;
                    pd.group = this.m_group;
                    // Keep emitting particles on this frame until we only have a
                    // fractional particle left.
                    while (this.m_emitRemainder > 1.0) {
                        this.m_emitRemainder -= 1.0;
                        // Randomly pick a position within the emitter's radius.
                        let angle = RadialEmitter.Random() * 2.0 * box2d.b2_pi;
                        // Distance from the center of the circle.
                        let distance = RadialEmitter.Random();
                        let positionOnUnitCircle = new box2d.b2Vec2(Math.sin(angle), Math.cos(angle));
                        // Initial position.
                        pd.position.Set(this.m_origin.x + positionOnUnitCircle.x * distance * this.m_halfSize.x, this.m_origin.y + positionOnUnitCircle.y * distance * this.m_halfSize.y);
                        // Send it flying
                        pd.velocity.Copy(this.m_startingVelocity);
                        if (this.m_speed !== 0.0) {
                            ///  pd.velocity += positionOnUnitCircle * m_speed;
                            pd.velocity.SelfMulAdd(this.m_speed, positionOnUnitCircle);
                        }
                        let particleIndex = this.m_particleSystem.CreateParticle(pd);
                        if (this.m_callback) {
                            this.m_callback.ParticleCreated(this.m_particleSystem, particleIndex);
                        }
                        if ((particleIndices !== null) && (numberOfParticlesCreated < particleIndicesCount)) {
                            particleIndices[numberOfParticlesCreated] = particleIndex;
                        }
                        ++numberOfParticlesCreated;
                    }
                    return numberOfParticlesCreated;
                }
            };
            exports_1("RadialEmitter", RadialEmitter);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVFbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGFydGljbGVFbWl0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7Ozs7Ozs7Ozs7WUFNSCwwQkFBQTtnQkFDRTs7bUJBRUc7Z0JBQ0gsZUFBZSxDQUFDLE1BQThCLEVBQUUsYUFBcUIsSUFBUyxDQUFDO2FBQ2hGLENBQUE7O1lBRUQ7O2VBRUc7WUFDSCxnQkFBQTtnQkFBQTtvQkFDRTs7dUJBRUc7b0JBQ0gscUJBQWdCLEdBQTJCLElBQUksQ0FBQztvQkFDaEQ7O3VCQUVHO29CQUNILGVBQVUsR0FBNEIsSUFBSSxDQUFDO29CQUMzQzs7dUJBRUc7b0JBQ0gsYUFBUSxHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDNUM7O3VCQUVHO29CQUNILHVCQUFrQixHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDdEQ7O3VCQUVHO29CQUNILFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBQ2Q7O3VCQUVHO29CQUNILGVBQVUsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzlDOzt1QkFFRztvQkFDSCxlQUFVLEdBQUcsR0FBRyxDQUFDO29CQUNqQjs7dUJBRUc7b0JBQ0gsWUFBTyxHQUFrQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDN0M7O3VCQUVHO29CQUNILG9CQUFlLEdBQUcsR0FBRyxDQUFDO29CQUN0Qjs7dUJBRUc7b0JBQ0gsWUFBTyxHQUF5QixLQUFLLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDO29CQUN0RTs7dUJBRUc7b0JBQ0gsWUFBTyxHQUEwQixJQUFJLENBQUM7Z0JBME54QyxDQUFDO2dCQXhOQzs7bUJBRUc7Z0JBQ0gsTUFBTSxDQUFDLE1BQU07b0JBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3ZC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