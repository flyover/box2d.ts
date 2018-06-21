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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4d2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvTWF4d2VsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0g7Ozs7Ozs7Ozs7ZUFVRztZQUVILFVBQUEsYUFBcUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFzQnZDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQXRCSCxjQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO29CQUNyQyxlQUFVLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDO29CQUMzQyxrQkFBYSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztvQkFDN0Msa0JBQWEsR0FBd0IsSUFBSSxDQUFDO29CQUMxQyxvQkFBZSxHQUFpQyxJQUFJLENBQUM7b0JBb0IxRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRWhELHdCQUF3QjtvQkFDeEI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMzQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDdkMsTUFBTSxRQUFRLEdBQUc7NEJBQ2YsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQzs0QkFDbEQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7NEJBQ2pELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMs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