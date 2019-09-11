/*
 * Copyright (c) 2013 Google, Inc.
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
    var box2d, testbed, Impulse;
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
            Impulse = class Impulse extends testbed.Test {
                constructor() {
                    super();
                    this.m_useLinearImpulse = false;
                    // Create the containing box.
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const box = [
                            new box2d.b2Vec2(Impulse.kBoxLeft, Impulse.kBoxBottom),
                            new box2d.b2Vec2(Impulse.kBoxRight, Impulse.kBoxBottom),
                            new box2d.b2Vec2(Impulse.kBoxRight, Impulse.kBoxTop),
                            new box2d.b2Vec2(Impulse.kBoxLeft, Impulse.kBoxTop),
                        ];
                        const shape = new box2d.b2ChainShape();
                        shape.CreateLoop(box, box.length);
                        ground.CreateFixture(shape, 0.0);
                    }
                    this.m_particleSystem.SetRadius(0.025 * 2); // HACK: increase particle radius
                    this.m_particleSystem.SetDamping(0.2);
                    // Create the particles.
                    {
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.8, 1.0, new box2d.b2Vec2(0.0, 1.01), 0);
                        const pd = new box2d.b2ParticleGroupDef();
                        pd.flags = testbed.Test.GetParticleParameterValue();
                        pd.shape = shape;
                        const group = this.m_particleSystem.CreateParticleGroup(pd);
                        if (pd.flags & box2d.b2ParticleFlag.b2_colorMixingParticle) {
                            this.ColorParticleGroup(group, 0);
                        }
                    }
                }
                MouseUp(p) {
                    super.MouseUp(p);
                    // Apply an impulse to the particles.
                    const isInsideBox = Impulse.kBoxLeft <= p.x && p.x <= Impulse.kBoxRight &&
                        Impulse.kBoxBottom <= p.y && p.y <= Impulse.kBoxTop;
                    if (isInsideBox) {
                        const kBoxCenter = new box2d.b2Vec2(0.5 * (Impulse.kBoxLeft + Impulse.kBoxRight), 0.5 * (Impulse.kBoxBottom + Impulse.kBoxTop));
                        const direction = box2d.b2Vec2.SubVV(p, kBoxCenter, new box2d.b2Vec2());
                        direction.Normalize();
                        this.ApplyImpulseOrForce(direction);
                    }
                }
                Keyboard(key) {
                    super.Keyboard(key);
                    switch (key) {
                        case "l":
                            this.m_useLinearImpulse = true;
                            break;
                        case "f":
                            this.m_useLinearImpulse = false;
                            break;
                    }
                }
                ApplyImpulseOrForce(direction) {
                    const particleSystem = this.m_world.GetParticleSystemList();
                    if (!particleSystem) {
                        throw new Error();
                    }
                    const particleGroup = particleSystem.GetParticleGroupList();
                    if (!particleGroup) {
                        throw new Error();
                    }
                    const numParticles = particleGroup.GetParticleCount();
                    if (this.m_useLinearImpulse) {
                        const kImpulseMagnitude = 0.005;
                        ///  const b2Vec2 impulse = kImpulseMagnitude * direction * (float32)numParticles;
                        const impulse = box2d.b2Vec2.MulSV(kImpulseMagnitude * numParticles, direction, new box2d.b2Vec2());
                        particleGroup.ApplyLinearImpulse(impulse);
                    }
                    else {
                        const kForceMagnitude = 1.0;
                        ///  const b2Vec2 force = kForceMagnitude * direction * (float32)numParticles;
                        const force = box2d.b2Vec2.MulSV(kForceMagnitude * numParticles, direction, new box2d.b2Vec2());
                        particleGroup.ApplyForce(force);
                    }
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new Impulse();
                }
            };
            exports_1("Impulse", Impulse);
            Impulse.kBoxLeft = -2;
            Impulse.kBoxRight = 2;
            Impulse.kBoxBottom = 0;
            Impulse.kBoxTop = 4;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wdWxzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkltcHVsc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9ILFVBQUEsTUFBYSxPQUFRLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBUXZDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUhILHVCQUFrQixHQUFHLEtBQUssQ0FBQztvQkFLaEMsNkJBQTZCO29CQUM3Qjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLE1BQU0sR0FBRyxHQUFHOzRCQUNWLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUM7NEJBQ3RELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUM7NEJBQ3ZELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUM7NEJBQ3BELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUM7eUJBQ3BELENBQUM7d0JBQ0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3ZDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDbEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7cUJBQ2xDO29CQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENB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