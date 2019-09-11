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
            exports_1("Maxwell", Maxwell);
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
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWF4d2VsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1heHdlbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9IOzs7Ozs7Ozs7O2VBVUc7WUFFSCxVQUFBLE1BQWEsT0FBUSxTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQXNCdkM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBdEJILGNBQVMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3JDLGVBQVUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUM7b0JBQzNDLGtCQUFhLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDO29CQUM3QyxrQkFBYSxHQUF3QixJQUFJLENBQUM7b0JBQzFDLG9CQUFlLEdBQWlDLElBQUksQ0FBQztvQkFvQjFELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFaEQsd0JBQXdCO29CQUN4Qjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzNDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUN2QyxNQUFNLFFBQVEsR0FBRzs0QkFDZixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDOzRCQUNsRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQzs0QkFDakQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENB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