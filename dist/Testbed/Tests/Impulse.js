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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wdWxzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RiZWQvVGVzdHMvSW1wdWxzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsVUFBQSxhQUFxQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQVF2QztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFISCx1QkFBa0IsR0FBRyxLQUFLLENBQUM7b0JBS2hDLDZCQUE2QjtvQkFDN0I7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQyxNQUFNLEdBQUcsR0FBRzs0QkFDVixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDOzRCQUN0RCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDOzRCQUN2RCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDOzRCQUNwRCxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDO3lCQUNwRCxDQUFDO3dCQUNGLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO3dCQUN2QyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztvQkFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlDQUFpQztvQkFDN0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFFdEMsd0JBQXdCO29CQUN4Qjt3QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDekMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3pELE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7d0JBQzFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO3dCQUNwRCxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUM1RCxJQUFJLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsRUFBRTs0QkFDMUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDbkM7cUJBQ0Y7Z0JBQ0gsQ0FBQztnQkFFTSxPQUFPLENBQUMsQ0FBZTtvQkFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFakIscUNBQXFDO29CQUNyQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUzt3QkFDckUsT0FBTyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQztvQkFDdEQsSUFBSSxXQUFXLEVBQUU7d0JBQ2YsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUM5RSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNoRCxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7d0JBQ3hFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUNyQztnQkFDSCxDQUFDO2dCQUVNLFFBQVEsQ0FBQyxHQUFXO29CQUN6QixLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUVwQixRQUFRLEdBQUcsRUFBRTt3QkFDWCxLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQzs0QkFDL0IsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQzs0QkFDaEMsTUFBTTtxQkFDVDtnQkFDSCxDQUFDO2dCQUVNLG1CQUFtQixDQUFDLFNBQXVCO29CQUNoRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQzVELElBQUksQ0FBQyxjQUFjLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUMzQyxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztvQkFDNUQsSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBQzFDLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUV0RCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTt3QkFDM0IsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7d0JBQ2hDLGtGQUFrRjt3QkFDbEYsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dCQUNwRyxhQUFhLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQzNDO3lCQUFNO3dCQUNMLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQzt3QkFDNUIsOEVBQThFO3dCQUM5RSxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dCQUNoRyxhQUFhLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNqQztnQkFDSCxDQUFDO2dCQUVNLGtCQUFrQjtvQkFDdkIsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUN2QixDQUFDO2FBQ0YsQ0FBQTtZQWxHd0IsZ0JBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNkLGlCQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2Qsa0JBQVUsR0FBRyxDQUFDLENBQUM7WUFDZixlQUFPLEdBQUcsQ0FBQyxDQUFDIn0=