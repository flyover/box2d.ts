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
            Impulse.kBoxLeft = -2;
            Impulse.kBoxRight = 2;
            Impulse.kBoxBottom = 0;
            Impulse.kBoxTop = 4;
            exports_1("Impulse", Impulse);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wdWxzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvSW1wdWxzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsVUFBQSxNQUFhLE9BQVEsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFRdkM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSEgsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO29CQUtoQyw2QkFBNkI7b0JBQzdCO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0MsTUFBTSxHQUFHLEdBQUc7NEJBQ1YsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQzs0QkFDdEQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQzs0QkFDdkQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQzs0QkFDcEQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQzt5QkFDcEQsQ0FBQzt3QkFDRixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQzt3QkFDdkMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNsQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztxQkFDbEM7b0JBRUQsSUFBSSxD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