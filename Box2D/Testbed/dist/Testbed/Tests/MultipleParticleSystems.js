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
                    testbed.Main.SetRestartOnParticleParameterChange(false);
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
            exports_1("MultipleParticleSystems", MultipleParticleSystems);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXVsdGlwbGVQYXJ0aWNsZVN5c3RlbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0cy9NdWx0aXBsZVBhcnRpY2xlU3lzdGVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsMEJBQUEsNkJBQXFDLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBNEN2RDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFFUixJQUFJLENBQUMsVUFBVSxHQUFHO3dCQUNoQixJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7d0JBQzNCLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTtxQkFDNUIsQ0FBQztvQkFFRixzREFBc0Q7b0JBQ3RELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyx1QkFBdUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29CQUN0RixJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRWhELHNDQUFzQztvQkFDdEMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO29CQUMxRCxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUM3RCxpQkFBaUIsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUN0QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO29CQUM5RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztvQkFFdkYsdURBQXVEO29CQUN2RCxPQUFPLENBQUMs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