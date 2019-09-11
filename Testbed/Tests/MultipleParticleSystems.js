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
    var box2d, testbed, MultipleParticleSystems;
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
            MultipleParticleSystems = class MultipleParticleSystems extends testbed.Test {
                constructor() {
                    super();
                    this.m_emitters = [
                        new testbed.RadialEmitter(),
                        new testbed.RadialEmitter(),
                    ];
                    // Configure the default particle system's parameters.
                    this.m_particleSystem.SetRadius(0.05);
                    this.m_particleSystem.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);
                    this.m_particleSystem.SetDestructionByAge(true);
                    // Create a secondary particle system.
                    const particleSystemDef = new box2d.b2ParticleSystemDef();
                    particleSystemDef.radius = this.m_particleSystem.GetRadius();
                    particleSystemDef.destroyByAge = true;
                    this.m_particleSystem2 = this.m_world.CreateParticleSystem(particleSystemDef);
                    this.m_particleSystem2.SetMaxParticleCount(MultipleParticleSystems.k_maxParticleCount);
                    // Don't restart the test when changing particle types.
                    testbed.Test.SetRestartOnParticleParameterChange(false);
                    // Create the ground.
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(5.0, 0.1);
                        ground.CreateFixture(shape, 0.0);
                    }
                    // Create a dynamic body to push around.
                    {
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        const body = this.m_world.CreateBody(bd);
                        const shape = new box2d.b2PolygonShape();
                        const center = new box2d.b2Vec2(0.0, 1.2);
                        shape.SetAsBox(MultipleParticleSystems.k_dynamicBoxSize.x, MultipleParticleSystems.k_dynamicBoxSize.y, center, 0.0);
                        body.CreateFixture(shape, 0.0);
                        ///  b2MassData massData = { MultipleParticleSystems.k_boxMass, center, 0.0 };
                        const massData = new box2d.b2MassData();
                        massData.mass = MultipleParticleSystems.k_boxMass;
                        massData.center.Copy(center);
                        massData.I = 0.0;
                        body.SetMassData(massData);
                    }
                    // Initialize the emitters.
                    for (let i = 0; i < this.m_emitters.length; ++i) {
                        const mirrorAlongY = i & 1 ? -1.0 : 1.0;
                        const emitter = this.m_emitters[i];
                        emitter.SetPosition(new box2d.b2Vec2(MultipleParticleSystems.k_emitterPosition.x * mirrorAlongY, MultipleParticleSystems.k_emitterPosition.y));
                        emitter.SetSize(MultipleParticleSystems.k_emitterSize);
                        emitter.SetVelocity(new box2d.b2Vec2(MultipleParticleSystems.k_emitterVelocity.x * mirrorAlongY, MultipleParticleSystems.k_emitterVelocity.y));
                        emitter.SetEmitRate(MultipleParticleSystems.k_emitRate);
                        emitter.SetColor(i & 1 ? MultipleParticleSystems.k_rightEmitterColor : MultipleParticleSystems.k_leftEmitterColor);
                        emitter.SetParticleSystem(i & 1 ? this.m_particleSystem2 : this.m_particleSystem);
                    }
                }
                Step(settings) {
                    let dt = settings.hz > 0.0 ? 1.0 / settings.hz : 0.0;
                    if (settings.pause && !settings.singleStep) {
                        dt = 0.0;
                    }
                    super.Step(settings);
                    for (let i = 0; i < this.m_emitters.length; ++i) {
                        this.m_emitters[i].Step(dt);
                    }
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new MultipleParticleSystems();
                }
            };
            exports_1("MultipleParticleSystems", MultipleParticleSystems);
            /**
             * Maximum number of particles per system.
             */
            MultipleParticleSystems.k_maxParticleCount = 500;
            /**
             * Size of the box which is pushed around by particles.
             */
            MultipleParticleSystems.k_dynamicBoxSize = new box2d.b2Vec2(0.5, 0.5);
            /**
             * Mass of the box.
             */
            MultipleParticleSystems.k_boxMass = 1.0;
            /**
             * Emit rate of the emitters in particles per second.
             */
            MultipleParticleSystems.k_emitRate = 100.0;
            /**
             * Location of the left emitter (the position of the right one
             * is mirrored along the y-axis).
             */
            MultipleParticleSystems.k_emitterPosition = new box2d.b2Vec2(-5.0, 4.0);
            /**
             * Starting velocity of particles from the left emitter (the
             * velocity of particles from the right emitter are mirrored
             * along the y-axis).
             */
            MultipleParticleSystems.k_emitterVelocity = new box2d.b2Vec2(7.0, -4.0);
            /**
             * Size of particle emitters.
             */
            MultipleParticleSystems.k_emitterSize = new box2d.b2Vec2(1.0, 1.0);
            /**
             * Color of the left emitter's particles.
             */
            MultipleParticleSystems.k_leftEmitterColor = new box2d.b2Color().SetByteRGBA(0x22, 0x33, 0xff, 0xff);
            /**
             * Color of the right emitter's particles.
             */
            MultipleParticleSystems.k_rightEmitterColor = new box2d.b2Color().SetByteRGBA(0xff, 0x22, 0x11, 0xff);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXVsdGlwbGVQYXJ0aWNsZVN5c3RlbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJNdWx0aXBsZVBhcnRpY2xlU3lzdGVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsMEJBQUEsTUFBYSx1QkFBd0IsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkE0Q3ZEO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSLElBQUksQ0FBQyxVQUFVLEdBQUc7d0JBQ2hCLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTt3QkFDM0IsSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFO3FCQUM1QixDQUFDO29CQUVGLHNEQUFzRDtvQkFDdEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLHVCQUF1QixDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ3RGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFaEQsc0NBQXNDO29CQUN0QyxNQUFNLGlCQUFpQixHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUM7b0JBQzFELGlCQUFpQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzdELGlCQUFpQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQzlFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUV2Rix1REFBdUQ7b0JBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMs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