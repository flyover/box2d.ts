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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, Maxwell;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
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
            Maxwell = class Maxwell extends testbed.Test {
                constructor() {
                    super();
                    this.m_density = Maxwell.k_densityDefault;
                    this.m_position = Maxwell.k_containerHalfHeight;
                    this.m_temperature = Maxwell.k_temperatureDefault;
                    this.m_barrierBody = null;
                    this.m_particleGroup = null;
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
                DisableBarrier() {
                    if (this.m_barrierBody) {
                        this.m_world.DestroyBody(this.m_barrierBody);
                        this.m_barrierBody = null;
                    }
                }
                /**
                 * Enable the barrier.
                 */
                EnableBarrier() {
                    if (!this.m_barrierBody) {
                        const bd = new box2d.b2BodyDef();
                        this.m_barrierBody = this.m_world.CreateBody(bd);
                        const barrierShape = new box2d.b2PolygonShape();
                        barrierShape.SetAsBox(Maxwell.k_containerHalfWidth, Maxwell.k_barrierHeight, new box2d.b2Vec2(0, this.m_position), 0);
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
                ToggleBarrier() {
                    if (this.m_barrierBody) {
                        this.DisableBarrier();
                    }
                    else {
                        this.EnableBarrier();
                    }
                }
                /**
                 * Destroy and recreate all particles.
                 */
                ResetParticles() {
                    if (this.m_particleGroup !== null) {
                        this.m_particleGroup.DestroyParticles(false);
                        this.m_particleGroup = null;
                    }
                    this.m_particleSystem.SetRadius(Maxwell.k_containerHalfWidth / 20.0);
                    {
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(this.m_density * Maxwell.k_containerHalfWidth, this.m_density * Maxwell.k_containerHalfHeight, new box2d.b2Vec2(0, Maxwell.k_containerHalfHeight), 0);
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
                Keyboard(key) {
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
                            this.m_temperature = box2d.b2Max(this.m_temperature - Maxwell.k_temperatureStep, Maxwell.k_temperatureMin);
                            this.Reset();
                            break;
                        case "'":
                            // Increase the temperature (velocity of particles).
                            this.m_temperature = box2d.b2Min(this.m_temperature + Maxwell.k_temperatureStep, Maxwell.k_temperatureMax);
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
                InContainer(p) {
                    return p.x >= -Maxwell.k_containerHalfWidth && p.x <= Maxwell.k_containerHalfWidth &&
                        p.y >= 0.0 && p.y <= Maxwell.k_containerHalfHeight * 2.0;
                }
                MouseDown(p) {
                    if (!this.InContainer(p)) {
                        super.MouseDown(p);
                    }
                }
                MouseUp(p) {
                    // If the pointer is in the container.
                    if (this.InContainer(p)) {
                        // Enable / disable the barrier.
                        this.ToggleBarrier();
                    }
                    else {
                        // Move the barrier to the touch position.
                        this.MoveDivider(p.y);
                        super.MouseUp(p);
                    }
                }
                Step(settings) {
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
                            }
                            else {
                                bottom++;
                            }
                        }
                    }
                    // Calculate a score based upon the difference in pressure between the
                    // upper and lower divisions of the container.
                    const topPressure = top / (Maxwell.k_containerHeight - this.m_position);
                    const botPressure = bottom / this.m_position;
                    testbed.g_debugDraw.DrawString(10, 75, `Score: ${topPressure > 0.0 ? botPressure / topPressure - 1.0 : 0.0}`);
                }
                /**
                 * Reset the particles and the barrier.
                 */
                Reset() {
                    this.DisableBarrier();
                    this.ResetParticles();
                    this.EnableBarrier();
                }
                /**
                 * Move the divider / barrier.
                 */
                MoveDivider(newPosition) {
                    this.m_position = box2d.b2Clamp(newPosition, Maxwell.k_barrierMovementIncrement, Maxwell.k_containerHeight - Maxwell.k_barrierMovementIncrement);
                    this.Reset();
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new Maxwell();
                }
            };
            Maxwell.k_containerWidth = 2.0;
            Maxwell.k_containerHeight = 4.0;
            Maxwell.k_containerHalfWidth = Maxwell.k_containerWidth / 2.0;
            Maxwell.k_containerHalfHeight = Maxwell.k_containerHeight / 2.0;
            Maxwell.k_barrierHeight = Maxwell.k_containerHalfHeight / 100.0;
            Maxwell.k_barrierMovementIncrement = Maxwell.k_containerHalfHeight * 0.1;
            Maxwell.k_densityStep = 1.25;
            Maxwell.k_densityMin = 0.01;
            Maxwell.k_densityMax = 0.8;
            Maxwell.k_densityDefault = 0.25;
            Maxwell.k_temperatureStep = 0.2;
            Maxwell.k_temperatureMin = 0.4;
            Maxwell.k_temperatureMax = 10.0;
            Maxwell.k_temperatureDefault = 5.0;
            exports_1("Maxwell", Maxwell);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4d2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1heHdlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9IOzs7Ozs7Ozs7O2VBVUc7WUFFSCxVQUFBLGFBQXFCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBc0J2QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkF0QkgsY0FBUyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDckMsZUFBVSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztvQkFDM0Msa0JBQWEsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUM7b0JBQzdDLGtCQUFhLEdBQXdCLElBQUksQ0FBQztvQkFDMUMsb0JBQWUsR0FBaUMsSUFBSSxDQUFDO29CQW9CMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUVoRCx3QkFBd0I7b0JBQ3hCO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3ZDLE1BQU0sUUFBUSxHQUFHOzRCQUNmLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7NEJBQ2xELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDOzRCQUNqRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxp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