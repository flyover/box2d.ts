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
System.register(["Box2D"], function (exports_1, context_1) {
    "use strict";
    var box2d, EmittedParticleCallback, RadialEmitter;
    var __moduleName = context_1 && context_1.id;
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
                Step(dt, particleIndices, particleIndicesCount = particleIndices ? particleIndices.length : 0) {
                    if (this.m_particleSystem === null) {
                        throw new Error();
                    }
                    let numberOfParticlesCreated = 0;
                    // How many (fractional) particles should we have emitted this frame?
                    this.m_emitRemainder += this.m_emitRate * dt;
                    const pd = new box2d.b2ParticleDef();
                    pd.color.Copy(this.m_color);
                    pd.flags = this.m_flags;
                    pd.group = this.m_group;
                    // Keep emitting particles on this frame until we only have a
                    // fractional particle left.
                    while (this.m_emitRemainder > 1.0) {
                        this.m_emitRemainder -= 1.0;
                        // Randomly pick a position within the emitter's radius.
                        const angle = RadialEmitter.Random() * 2.0 * box2d.b2_pi;
                        // Distance from the center of the circle.
                        const distance = RadialEmitter.Random();
                        const positionOnUnitCircle = new box2d.b2Vec2(Math.sin(angle), Math.cos(angle));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFydGljbGVFbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vRnJhbWV3b3JrL1BhcnRpY2xlRW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7O1lBTUgsMEJBQUE7Z0JBQ0U7O21CQUVHO2dCQUNJLGVBQWUsQ0FBQyxNQUE4QixFQUFFLGFBQXFCLElBQVMsQ0FBQzthQUN2RixDQUFBOztZQUVEOztlQUVHO1lBQ0gsZ0JBQUE7Z0JBQUE7b0JBQ0U7O3VCQUVHO29CQUNJLHFCQUFnQixHQUFrQyxJQUFJLENBQUM7b0JBQzlEOzt1QkFFRztvQkFDSSxlQUFVLEdBQW1DLElBQUksQ0FBQztvQkFDekQ7O3VCQUVHO29CQUNJLGFBQVEsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ25EOzt1QkFFRztvQkFDSSx1QkFBa0IsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzdEOzt1QkFFRztvQkFDSSxZQUFPLEdBQUcsR0FBRyxDQUFDO29CQUNyQjs7dUJBRUc7b0JBQ0ksZUFBVSxHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDckQ7O3VCQUVHO29CQUNJLGVBQVUsR0FBRyxHQUFHLENBQUM7b0JBQ3hCOzt1QkFFRztvQkFDSSxZQUFPLEdBQWtCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNwRDs7dUJBRUc7b0JBQ0ksb0JBQWUsR0FBRyxHQUFHLENBQUM7b0JBQzdCOzt1QkFFRztvQkFDSSxZQUFPLEdBQXlCLEtBQUssQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7b0JBQzdFOzt1QkFFRztvQkFDSSxZQUFPLEdBQWlDLElBQUksQ0FBQztnQkEwTnRELENBQUM7Z0JBeE5DOzttQkFFRztnQkFDSSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLENBQUMs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