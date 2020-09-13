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
System.register(["@box2d"], function (exports_1, context_1) {
    "use strict";
    var b2, EmittedParticleCallback, RadialEmitter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
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
                    this.m_origin = new b2.Vec2();
                    /**
                     * Launch direction.
                     */
                    this.m_startingVelocity = new b2.Vec2();
                    /**
                     * Speed particles are emitted
                     */
                    this.m_speed = 0.0;
                    /**
                     * Half width / height of particle emitter
                     */
                    this.m_halfSize = new b2.Vec2();
                    /**
                     * Particles per second
                     */
                    this.m_emitRate = 1.0;
                    /**
                     * Initial color of particle emitted.
                     */
                    this.m_color = new b2.Color();
                    /**
                     * Number particles to emit on the next frame
                     */
                    this.m_emitRemainder = 0.0;
                    /**
                     * Flags for created particles, see b2ParticleFlag.
                     */
                    this.m_flags = b2.ParticleFlag.b2_waterParticle;
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
                __dtor__() {
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
                        this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() & ~b2.ParticleGroupFlag.b2_particleGroupCanBeEmpty);
                    }
                    this.m_group = group;
                    if (this.m_group) {
                        this.m_group.SetGroupFlags(this.m_group.GetGroupFlags() | b2.ParticleGroupFlag.b2_particleGroupCanBeEmpty);
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
                Step(dt, particleIndices, particleIndicesCount = particleIndices ? particleIndices.length : 0) {
                    if (this.m_particleSystem === null) {
                        throw new Error();
                    }
                    let numberOfParticlesCreated = 0;
                    // How many (fractional) particles should we have emitted this frame?
                    this.m_emitRemainder += this.m_emitRate * dt;
                    const pd = new b2.ParticleDef();
                    pd.color.Copy(this.m_color);
                    pd.flags = this.m_flags;
                    pd.group = this.m_group;
                    // Keep emitting particles on this frame until we only have a
                    // fractional particle left.
                    while (this.m_emitRemainder > 1.0) {
                        this.m_emitRemainder -= 1.0;
                        // Randomly pick a position within the emitter's radius.
                        const angle = RadialEmitter.Random() * 2.0 * b2.pi;
                        // Distance from the center of the circle.
                        const distance = RadialEmitter.Random();
                        const positionOnUnitCircle = new b2.Vec2(Math.sin(angle), Math.cos(angle));
                        // Initial position.
                        pd.position.Set(this.m_origin.x + positionOnUnitCircle.x * distance * this.m_halfSize.x, this.m_origin.y + positionOnUnitCircle.y * distance * this.m_halfSize.y);
                        // Send it flying
                        pd.velocity.Copy(this.m_startingVelocity);
                        if (this.m_speed !== 0.0) {
                            ///  pd.velocity += positionOnUnitCircle * m_speed;
                            pd.velocity.SelfMulAdd(this.m_speed, positionOnUnitCircle);
                        }
                        const particleIndex = this.m_particleSystem.CreateParticle(pd);
                        if (this.m_callback) {
                            this.m_callback.ParticleCreated(this.m_particleSystem, particleIndex);
                        }
                        if (particleIndices && (numberOfParticlesCreated < particleIndicesCount)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGljbGVfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3BhcnRpY2xlX2VtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7OztZQU1ILDBCQUFBLE1BQWEsdUJBQXVCO2dCQUNsQzs7bUJBRUc7Z0JBQ0ksZUFBZSxDQUFDLE1BQXlCLEVBQUUsYUFBcUIsSUFBUyxDQUFDO2FBQ2xGLENBQUE7O1lBRUQ7O2VBRUc7WUFDSCxnQkFBQSxNQUFhLGFBQWE7Z0JBQTFCO29CQUNFOzt1QkFFRztvQkFDSSxxQkFBZ0IsR0FBNkIsSUFBSSxDQUFDO29CQUN6RDs7dUJBRUc7b0JBQ0ksZUFBVSxHQUFtQyxJQUFJLENBQUM7b0JBQ3pEOzt1QkFFRztvQkFDSSxhQUFRLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3pDOzt1QkFFRztvQkFDSSx1QkFBa0IsR0FBWSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDbkQ7O3VCQUVHO29CQUNJLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBQ3JCOzt1QkFFRztvQkFDSSxlQUFVLEdBQVksSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzNDOzt1QkFFRztvQkFDSSxlQUFVLEdBQUcsR0FBRyxDQUFDO29CQUN4Qjs7dUJBRUc7b0JBQ0ksWUFBTyxHQUFhLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUMxQzs7dUJBRUc7b0JBQ0ksb0JBQWUsR0FBRyxHQUFHLENBQUM7b0JBQzdCOzt1QkFFRztvQkFDSSxZQUFPLEdBQW9CLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUM7b0JBQ25FOzt1QkFFRztvQkFDSSxZQUFPLEdBQTRCLElBQUksQ0FBQztnQkEwTmpELENBQUM7Z0JBeE5DOzttQkFFRztnQkFDSSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJ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