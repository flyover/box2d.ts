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
    var box2d, testbed, DrawingParticles;
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
            DrawingParticles = class DrawingParticles extends testbed.Test {
                constructor() {
                    super();
                    this.m_drawing = true;
                    this.m_particleFlags = 0;
                    this.m_groupFlags = 0;
                    this.m_colorIndex = 0;
                    {
                        const bd = new box2d.b2BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-4, -2),
                                new box2d.b2Vec2(4, -2),
                                new box2d.b2Vec2(4, 0),
                                new box2d.b2Vec2(-4, 0),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-4, -2),
                                new box2d.b2Vec2(-2, -2),
                                new box2d.b2Vec2(-2, 6),
                                new box2d.b2Vec2(-4, 6),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(2, -2),
                                new box2d.b2Vec2(4, -2),
                                new box2d.b2Vec2(4, 6),
                                new box2d.b2Vec2(2, 6),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new box2d.b2PolygonShape();
                            const vertices = [
                                new box2d.b2Vec2(-4, 4),
                                new box2d.b2Vec2(4, 4),
                                new box2d.b2Vec2(4, 6),
                                new box2d.b2Vec2(-4, 6),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_colorIndex = 0;
                    this.m_particleSystem.SetRadius(0.05 * 2);
                    this.m_lastGroup = null;
                    this.m_drawing = true;
                    // DEBUG: box2d.b2Assert((DrawingParticles.k_paramDef[0].CalculateValueMask() & DrawingParticles.Parameters.e_parameterBegin) === 0);
                    testbed.Test.SetParticleParameters(DrawingParticles.k_paramDef, DrawingParticles.k_paramDefCount);
                    testbed.Test.SetRestartOnParticleParameterChange(false);
                    this.m_particleFlags = testbed.Test.GetParticleParameterValue();
                    this.m_groupFlags = 0;
                }
                // Determine the current particle parameter from the drawing state and
                // group flags.
                DetermineParticleParameter() {
                    if (this.m_drawing) {
                        if (this.m_groupFlags === (box2d.b2ParticleGroupFlag.b2_rigidParticleGroup | box2d.b2ParticleGroupFlag.b2_solidParticleGroup)) {
                            return DrawingParticles.Parameters.e_parameterRigid;
                        }
                        if (this.m_groupFlags === box2d.b2ParticleGroupFlag.b2_rigidParticleGroup && this.m_particleFlags === box2d.b2ParticleFlag.b2_barrierParticle) {
                            return DrawingParticles.Parameters.e_parameterRigidBarrier;
                        }
                        if (this.m_particleFlags === (box2d.b2ParticleFlag.b2_elasticParticle | box2d.b2ParticleFlag.b2_barrierParticle)) {
                            return DrawingParticles.Parameters.e_parameterElasticBarrier;
                        }
                        if (this.m_particleFlags === (box2d.b2ParticleFlag.b2_springParticle | box2d.b2ParticleFlag.b2_barrierParticle)) {
                            return DrawingParticles.Parameters.e_parameterSpringBarrier;
                        }
                        if (this.m_particleFlags === (box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_repulsiveParticle)) {
                            return DrawingParticles.Parameters.e_parameterRepulsive;
                        }
                        return this.m_particleFlags;
                    }
                    return DrawingParticles.Parameters.e_parameterMove;
                }
                Keyboard(key) {
                    this.m_drawing = key !== "x";
                    this.m_particleFlags = 0;
                    this.m_groupFlags = 0;
                    switch (key) {
                        case "e":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_elasticParticle;
                            this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "p":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_powderParticle;
                            break;
                        case "r":
                            this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup | box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "s":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_springParticle;
                            this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "t":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_tensileParticle;
                            break;
                        case "v":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_viscousParticle;
                            break;
                        case "w":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_wallParticle;
                            this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "b":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_wallParticle;
                            break;
                        case "h":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle;
                            this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup;
                            break;
                        case "n":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_elasticParticle;
                            this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "m":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_springParticle;
                            this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "f":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_repulsiveParticle;
                            break;
                        case "c":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_colorMixingParticle;
                            break;
                        case "z":
                            this.m_particleFlags = box2d.b2ParticleFlag.b2_zombieParticle;
                            break;
                        default:
                            break;
                    }
                    testbed.Test.SetParticleParameterValue(this.DetermineParticleParameter());
                }
                MouseMove(p) {
                    super.MouseMove(p);
                    if (this.m_drawing) {
                        const shape = new box2d.b2CircleShape();
                        shape.m_p.Copy(p);
                        shape.m_radius = 0.2;
                        ///  b2Transform xf;
                        ///  xf.SetIdentity();
                        const xf = box2d.b2Transform.IDENTITY;
                        this.m_particleSystem.DestroyParticlesInShape(shape, xf);
                        const joinGroup = this.m_lastGroup && this.m_groupFlags === this.m_lastGroup.GetGroupFlags();
                        if (!joinGroup) {
                            this.m_colorIndex = (this.m_colorIndex + 1) % testbed.Test.k_ParticleColorsCount;
                        }
                        const pd = new box2d.b2ParticleGroupDef();
                        pd.shape = shape;
                        pd.flags = this.m_particleFlags;
                        if ((this.m_particleFlags & (box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_springParticle | box2d.b2ParticleFlag.b2_elasticParticle)) ||
                            (this.m_particleFlags === (box2d.b2ParticleFlag.b2_wallParticle | box2d.b2ParticleFlag.b2_barrierParticle))) {
                            pd.flags |= box2d.b2ParticleFlag.b2_reactiveParticle;
                        }
                        pd.groupFlags = this.m_groupFlags;
                        pd.color.Copy(testbed.Test.k_ParticleColors[this.m_colorIndex]);
                        pd.group = this.m_lastGroup;
                        this.m_lastGroup = this.m_particleSystem.CreateParticleGroup(pd);
                        this.m_mouseTracing = false;
                    }
                }
                MouseUp(p) {
                    super.MouseUp(p);
                    this.m_lastGroup = null;
                }
                ParticleGroupDestroyed(group) {
                    super.ParticleGroupDestroyed(group);
                    if (group === this.m_lastGroup) {
                        this.m_lastGroup = null;
                    }
                }
                SplitParticleGroups() {
                    for (let group = this.m_particleSystem.GetParticleGroupList(); group; group = group.GetNext()) {
                        if (group !== this.m_lastGroup &&
                            (group.GetGroupFlags() & box2d.b2ParticleGroupFlag.b2_rigidParticleGroup) &&
                            (group.GetAllParticleFlags() & box2d.b2ParticleFlag.b2_zombieParticle)) {
                            // Split a rigid particle group which may be disconnected
                            // by destroying particles.
                            this.m_particleSystem.SplitParticleGroup(group);
                        }
                    }
                }
                Step(settings) {
                    const parameterValue = testbed.Test.GetParticleParameterValue();
                    this.m_drawing = (parameterValue & DrawingParticles.Parameters.e_parameterMove) !== DrawingParticles.Parameters.e_parameterMove;
                    if (this.m_drawing) {
                        switch (parameterValue) {
                            case box2d.b2ParticleFlag.b2_elasticParticle:
                            case box2d.b2ParticleFlag.b2_springParticle:
                            case box2d.b2ParticleFlag.b2_wallParticle:
                                this.m_particleFlags = parameterValue;
                                this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                                break;
                            case DrawingParticles.Parameters.e_parameterRigid:
                                // b2_waterParticle is the default particle type in
                                // LiquidFun.
                                this.m_particleFlags = box2d.b2ParticleFlag.b2_waterParticle;
                                this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup | box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                                break;
                            case DrawingParticles.Parameters.e_parameterRigidBarrier:
                                this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle;
                                this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_rigidParticleGroup;
                                break;
                            case DrawingParticles.Parameters.e_parameterElasticBarrier:
                                this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_elasticParticle;
                                this.m_groupFlags = 0;
                                break;
                            case DrawingParticles.Parameters.e_parameterSpringBarrier:
                                this.m_particleFlags = box2d.b2ParticleFlag.b2_barrierParticle | box2d.b2ParticleFlag.b2_springParticle;
                                this.m_groupFlags = 0;
                                break;
                            case DrawingParticles.Parameters.e_parameterRepulsive:
                                this.m_particleFlags = box2d.b2ParticleFlag.b2_repulsiveParticle | box2d.b2ParticleFlag.b2_wallParticle;
                                this.m_groupFlags = box2d.b2ParticleGroupFlag.b2_solidParticleGroup;
                                break;
                            default:
                                this.m_particleFlags = parameterValue;
                                this.m_groupFlags = 0;
                                break;
                        }
                    }
                    if (this.m_particleSystem.GetAllParticleFlags() & box2d.b2ParticleFlag.b2_zombieParticle) {
                        this.SplitParticleGroups();
                    }
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Keys: (L) liquid, (E) elastic, (S) spring");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "(R) rigid, (W) wall, (V) viscous, (T) tensile");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "(F) repulsive wall, (B) wall barrier");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "(H) rigid barrier, (N) elastic barrier, (M) spring barrier");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "(C) color mixing, (Z) erase, (X) move");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                GetDefaultViewZoom() {
                    return 0.1;
                }
                static Create() {
                    return new DrawingParticles();
                }
            };
            exports_1("DrawingParticles", DrawingParticles);
            /**
             * Set bit 31 to distiguish these values from particle flags.
             */
            DrawingParticles.Parameters = {
                e_parameterBegin: (1 << 31),
                e_parameterMove: (1 << 31) | (1 << 0),
                e_parameterRigid: (1 << 31) | (1 << 1),
                e_parameterRigidBarrier: (1 << 31) | (1 << 2),
                e_parameterElasticBarrier: (1 << 31) | (1 << 3),
                e_parameterSpringBarrier: (1 << 31) | (1 << 4),
                e_parameterRepulsive: (1 << 31) | (1 << 5),
            };
            DrawingParticles.k_paramValues = [
                new testbed.ParticleParameterValue(box2d.b2ParticleFlag.b2_zombieParticle, testbed.ParticleParameter.k_DefaultOptions, "erase"),
                new testbed.ParticleParameterValue(DrawingParticles.Parameters.e_parameterMove, testbed.ParticleParameter.k_DefaultOptions, "move"),
                new testbed.ParticleParameterValue(DrawingParticles.Parameters.e_parameterRigid, testbed.ParticleParameter.k_DefaultOptions, "rigid"),
                new testbed.ParticleParameterValue(DrawingParticles.Parameters.e_parameterRigidBarrier, testbed.ParticleParameter.k_DefaultOptions, "rigid barrier"),
                new testbed.ParticleParameterValue(DrawingParticles.Parameters.e_parameterElasticBarrier, testbed.ParticleParameter.k_DefaultOptions, "elastic barrier"),
                new testbed.ParticleParameterValue(DrawingParticles.Parameters.e_parameterSpringBarrier, testbed.ParticleParameter.k_DefaultOptions, "spring barrier"),
                new testbed.ParticleParameterValue(DrawingParticles.Parameters.e_parameterRepulsive, testbed.ParticleParameter.k_DefaultOptions, "repulsive wall"),
            ];
            DrawingParticles.k_paramDef = [
                new testbed.ParticleParameterDefinition(testbed.ParticleParameter.k_particleTypes),
                new testbed.ParticleParameterDefinition(DrawingParticles.k_paramValues),
            ];
            DrawingParticles.k_paramDefCount = DrawingParticles.k_paramDef.length;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJhd2luZ1BhcnRpY2xlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkRyYXdpbmdQYXJ0aWNsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9ILG1CQUFBLE1BQWEsZ0JBQWlCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBb0NoRDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkF0QkgsY0FBUyxHQUFHLElBQUksQ0FBQztvQkFDakIsb0JBQWUsR0FBRyxDQUFDLENBQUM7b0JBQ3BCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixpQkFBWSxHQUFHLENBQUMsQ0FBQztvQkFxQnRCO3dCQUNFLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0M7NEJBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3pDLE1BQU0sUUFBUSxHQUFHO2dDQUNmLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDeEIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDdkIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ3RCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7NkJBQ3hCLENBQUM7NEJBQ0YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQzt3QkFFRDs0QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDekMsTUFBTSxRQUFRLEdBQUc7Z0NBQ2YsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUN4QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3hCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ3ZCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7NkJBQ3hCLENBQUM7NEJBQ0YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQzt3QkFFRDs0QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDekMsTUFBTSxRQUFRLEdBQUc7Z0NBQ2YsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDdkIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDdkIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ3RCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzZCQUN2QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDbEM7d0JBRUQ7NEJBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3pDLE1BQU0sUUFBUSxHQUFHO2dDQUNmLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ3ZCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUN0QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDdEIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDeEIsQ0FBQzs0QkFDRixLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDdkIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQ2xDO3FCQUNGO29CQUVELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUV0QixxSUFBcUk7b0JBQ3JJLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUNsRyxPQUFPLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUV4RCxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztvQkFDaEUsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7Z0JBRUQsc0VBQXNFO2dCQUN0RSxlQUFlO2dCQUNSLDBCQUEwQjtvQkFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUNsQixJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLEVBQUU7NEJBQzdILE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDO3lCQUNyRDt3QkFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRTs0QkFDN0ksT0FBTyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUM7eUJBQzVEO3dCQUNELElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFOzRCQUNoSCxPQUFPLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQzt5QkFDOUQ7d0JBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7NEJBQy9HLE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDO3lCQUM3RDt3QkFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7NEJBQy9HLE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDO3lCQUN6RDt3QkFDRCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7cUJBQzdCO29CQUNELE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztnQkFDckQsQ0FBQztnQkFFTSxRQUFRLENBQUMsR0FBVztvQkFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDO29CQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ3RCLFFBQVEsR0FBRyxFQUFFO3dCQUNYLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7NEJBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDOzRCQUNwRSxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUM7NEJBQzlELE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDdEgsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDOzRCQUM5RCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDcEUsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDOzRCQUMvRCxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7NEJBQy9ELE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUM7NEJBQzVELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDOzRCQUNwRSxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUM7NEJBQ3RHLE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQzs0QkFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUM7NEJBQ3BFLE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDOzRCQUN6RyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDcEUsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUM7NEJBQ3hHLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDOzRCQUNwRSxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUM7NEJBQ3hHLE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQzs0QkFDbkUsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDOzRCQUM5RCxNQUFNO3dCQUNSOzRCQUNFLE1BQU07cUJBQ1Q7b0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO2dCQUM1RSxDQUFDO2dCQUVNLFNBQVMsQ0FBQyxDQUFlO29CQUM5QixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7d0JBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUN4QyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7d0JBQ3JCLG9CQUFvQjt3QkFDcEIsc0JBQXNCO3dCQUN0QixNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQzt3QkFFdEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFFekQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLENBQUM7d0JBQzdGLElBQUksQ0FBQyxTQUFTLEVBQUU7NEJBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQzt5QkFDbEY7d0JBQ0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzt3QkFDMUMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7d0JBQ2pCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQzt3QkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs0QkFDcEosQ0FBQyxJQUFJLENBQUMsZUFBZSxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUU7NEJBQzdHLEVBQUUsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQzt5QkFDdEQ7d0JBQ0QsRUFBRSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO3dCQUNsQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUNoRSxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUNqRSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztxQkFDN0I7Z0JBQ0gsQ0FBQztnQkFFTSxPQUFPLENBQUMsQ0FBZTtvQkFDNUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQzFCLENBQUM7Z0JBRU0sc0JBQXNCLENBQUMsS0FBNEI7b0JBQ3hELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7cUJBQ3pCO2dCQUNILENBQUM7Z0JBRU0sbUJBQW1CO29CQUN4QixLQUFLLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFO3dCQUM3RixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsV0FBVzs0QkFDNUIsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDOzRCQUN6RSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsRUFBRTs0QkFDeEUseURBQXlEOzRCQUN6RCwyQkFBMkI7NEJBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzt5QkFDakQ7cUJBQ0Y7Z0JBQ0gsQ0FBQztnQkFFTSxJQUFJLENBQUMsUUFBMEI7b0JBQ3BDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztvQkFDaEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQztvQkFDaEksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUNsQixRQUFRLGNBQWMsRUFBRTs0QkFDdEIsS0FBSyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDOzRCQUM3QyxLQUFLLEtBQUssQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUM7NEJBQzVDLEtBQUssS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlO2dDQUN2QyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztnQ0FDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUM7Z0NBQ3BFLE1BQU07NEJBQ1IsS0FBSyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO2dDQUMvQyxtREFBbUQ7Z0NBQ25ELGFBQWE7Z0NBQ2IsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDO2dDQUM3RCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUM7Z0NBQ3RILE1BQU07NEJBQ1IsS0FBSyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsdUJBQXVCO2dDQUN0RCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7Z0NBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDO2dDQUNwRSxNQUFNOzRCQUNSLEtBQUssZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHlCQUF5QjtnQ0FDeEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7Z0NBQ3pHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dDQUN0QixNQUFNOzRCQUNSLEtBQUssZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHdCQUF3QjtnQ0FDdkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUM7Z0NBQ3hHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dDQUN0QixNQUFNOzRCQUNSLEtBQUssZ0JBQWdCLENBQUMsVUFBVSxDQUFDLG9CQUFvQjtnQ0FDbkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDO2dDQUN4RyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQztnQ0FDcEUsTUFBTTs0QkFDUjtnQ0FDRSxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztnQ0FDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7Z0NBQ3RCLE1BQU07eUJBQ1Q7cUJBQ0Y7b0JBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFO3dCQUN4RixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztxQkFDNUI7b0JBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDckIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztvQkFDaEcsSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsb0JBQW9CLENBQUM7b0JBQ2hELE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLCtDQUErQyxDQUFDLENBQUM7b0JBQ3BHLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLG9CQUFvQixDQUFDO29CQUNoRCxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO29CQUMzRixJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztvQkFDaEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsNERBQTRELENBQUMsQ0FBQztvQkFDakgsSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsb0JBQW9CLENBQUM7b0JBQ2hELE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLHVDQUF1QyxDQUFDLENBQUM7b0JBQzVGLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLG9CQUFvQixDQUFDO2dCQUNsRCxDQUFDO2dCQUVNLGtCQUFrQjtvQkFDdkIsT0FBTyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTTtvQkFDbEIsT0FBTyxJQUFJLGdCQUFnQixFQUFFLENBQUM7Z0JBQ2hDLENBQUM7YUFDRixDQUFBOztZQWxUQzs7ZUFFRztZQUNvQiwyQkFBVSxHQUFHO2dCQUNsQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNCLGVBQWUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3Qyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNDLENBQUM7WUFRcUIsOEJBQWEsR0FBRztnQkFDckMsSUFBSSxPQUFPLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDO2dCQUMvSCxJQUFJLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUM7Z0JBQ25JLElBQUksT0FBTyxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDO2dCQUNySSxJQUFJLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztnQkFDcEosSUFBSSxPQUFPLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQztnQkFDeEosSUFBSSxPQUFPLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDdEosSUFBSSxPQUFPLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzthQUNuSixDQUFDO1lBRXFCLDJCQUFVLEdBQUc7Z0JBQ2xDLElBQUksT0FBTyxDQUFDLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xGLElBQUksT0FBTyxDQUFDLDJCQUEyQixDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQzthQUN4RSxDQUFDO1lBQ3FCLGdDQUFlLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyJ9