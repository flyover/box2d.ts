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
                    testbed.Main.SetParticleParameters(DrawingParticles.k_paramDef, DrawingParticles.k_paramDefCount);
                    testbed.Main.SetRestartOnParticleParameterChange(false);
                    this.m_particleFlags = testbed.Main.GetParticleParameterValue();
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
                    testbed.Main.SetParticleParameterValue(this.DetermineParticleParameter());
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
                    const parameterValue = testbed.Main.GetParticleParameterValue();
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
                new testbed.ParticleParameter.Value(box2d.b2ParticleFlag.b2_zombieParticle, testbed.ParticleParameter.k_DefaultOptions, "erase"),
                new testbed.ParticleParameter.Value(DrawingParticles.Parameters.e_parameterMove, testbed.ParticleParameter.k_DefaultOptions, "move"),
                new testbed.ParticleParameter.Value(DrawingParticles.Parameters.e_parameterRigid, testbed.ParticleParameter.k_DefaultOptions, "rigid"),
                new testbed.ParticleParameter.Value(DrawingParticles.Parameters.e_parameterRigidBarrier, testbed.ParticleParameter.k_DefaultOptions, "rigid barrier"),
                new testbed.ParticleParameter.Value(DrawingParticles.Parameters.e_parameterElasticBarrier, testbed.ParticleParameter.k_DefaultOptions, "elastic barrier"),
                new testbed.ParticleParameter.Value(DrawingParticles.Parameters.e_parameterSpringBarrier, testbed.ParticleParameter.k_DefaultOptions, "spring barrier"),
                new testbed.ParticleParameter.Value(DrawingParticles.Parameters.e_parameterRepulsive, testbed.ParticleParameter.k_DefaultOptions, "repulsive wall"),
            ];
            DrawingParticles.k_paramDef = [
                new testbed.ParticleParameter.Definition(testbed.ParticleParameter.k_particleTypes),
                new testbed.ParticleParameter.Definition(DrawingParticles.k_paramValues),
            ];
            DrawingParticles.k_paramDefCount = DrawingParticles.k_paramDef.length;
            exports_1("DrawingParticles", DrawingParticles);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJhd2luZ1BhcnRpY2xlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1Rlc3RzL0RyYXdpbmdQYXJ0aWNsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7Ozs7Ozs7Ozs7OztZQU9ILG1CQUFBLHNCQUE4QixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQW9DaEQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBdEJILGNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2pCLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixpQkFBWSxHQUFHLENBQUMsQ0FBQztvQkFDakIsaUJBQVksR0FBRyxDQUFDLENBQUM7b0JBcUJ0Qjt3QkFDRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDOzRCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN6QyxNQUFNLFFBQVEsR0FBRztnQ0FDZixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3hCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUN0QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzZCQUN4QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDbEM7d0JBRUQ7NEJBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3pDLE1BQU0sUUFBUSxHQUFHO2dDQUNmLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDeEIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUN4QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUN2QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzZCQUN4QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDbEM7d0JBRUQ7NEJBQ0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3pDLE1BQU0sUUFBUSxHQUFHO2dDQUNmLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0NBQ3ZCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUN0QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDdkIsQ0FBQzs0QkFDRixLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDdkIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7eUJBQ2xDO3dCQUVEOzRCQUNFLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN6QyxNQUFNLFFBQVEsR0FBRztnQ0FDZixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUN2QixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDdEIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ3RCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7NkJBQ3hCLENBQUM7NEJBQ0YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3lCQUNsQztxQkFDRjtvQkFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFFdEIscUlBQXFJO29CQUNySSxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztvQkFDbEcsT0FBTyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFFeEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7b0JBQ2hFLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixDQUFDO2dCQUVELHNFQUFzRTtnQkFDdEUsZUFBZTtnQkFDUiwwQkFBMEI7b0JBQy9CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTt3QkFDbEIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFOzRCQUM3SCxPQUFPLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQzt5QkFDckQ7d0JBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUU7NEJBQzdJLE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDO3lCQUM1RDt3QkFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsRUFBRTs0QkFDaEgsT0FBTyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUM7eUJBQzlEO3dCQUNELElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFOzRCQUMvRyxPQUFPLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQzt5QkFDN0Q7d0JBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFOzRCQUMvRyxPQUFPLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQzt5QkFDekQ7d0JBQ0QsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO3FCQUM3QjtvQkFDRCxPQUFPLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7Z0JBQ3JELENBQUM7Z0JBRU0sUUFBUSxDQUFDLEdBQVc7b0JBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixRQUFRLEdBQUcsRUFBRTt3QkFDWCxLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDOzRCQUMvRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDcEUsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDOzRCQUM5RCxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUM7NEJBQ3RILE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQzs0QkFDOUQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUM7NEJBQ3BFLE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQzs0QkFDL0QsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDOzRCQUMvRCxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDOzRCQUM1RCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDcEUsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDOzRCQUN0RyxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7NEJBQy9ELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDOzRCQUNwRSxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQzs0QkFDekcsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUM7NEJBQ3BFLE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDOzRCQUN4RyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDcEUsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDOzRCQUN4RyxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUM7NEJBQ25FLE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQzs0QkFDOUQsTUFBTTt3QkFDUjs0QkFDRSxNQUFNO3FCQUNUO29CQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztnQkFDNUUsQ0FBQztnQkFFTSxTQUFTLENBQUMsQ0FBZTtvQkFDOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUNsQixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQzt3QkFDeEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO3dCQUNyQixvQkFBb0I7d0JBQ3BCLHNCQUFzQjt3QkFDdEIsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7d0JBRXRDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBRXpELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO3dCQUM3RixJQUFJLENBQUMsU0FBUyxFQUFFOzRCQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUM7eUJBQ2xGO3dCQUNELE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUM7d0JBQzFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNqQixFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7d0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7NEJBQ3BKLENBQUMsSUFBSSxDQUFDLGVBQWUsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFOzRCQUM3RyxFQUFFLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUM7eUJBQ3REO3dCQUNELEVBQUUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQzt3QkFDbEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDaEUsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3dCQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDakUsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7cUJBQzdCO2dCQUNILENBQUM7Z0JBRU0sT0FBTyxDQUFDLENBQWU7b0JBQzVCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixDQUFDO2dCQUVNLHNCQUFzQixDQUFDLEtBQTRCO29CQUN4RCxLQUFLLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3BDLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO3FCQUN6QjtnQkFDSCxDQUFDO2dCQUVNLG1CQUFtQjtvQkFDeEIsS0FBSyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRTt3QkFDN0YsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFdBQVc7NEJBQzVCLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQzs0QkFDekUsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7NEJBQ3hFLHlEQUF5RDs0QkFDekQsMkJBQTJCOzRCQUMzQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQ2pEO3FCQUNGO2dCQUNILENBQUM7Z0JBRU0sSUFBSSxDQUFDLFFBQTBCO29CQUNwQyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7b0JBQ2hFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxjQUFjLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxLQUFLLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7b0JBQ2hJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTt3QkFDbEIsUUFBUSxjQUFjLEVBQUU7NEJBQ3RCLEtBQUssS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQzs0QkFDN0MsS0FBSyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDOzRCQUM1QyxLQUFLLEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBZTtnQ0FDdkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7Z0NBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDO2dDQUNwRSxNQUFNOzRCQUNSLEtBQUssZ0JBQWdCLENBQUMsVUFBVSxDQUFDLGdCQUFnQjtnQ0FDL0MsbURBQW1EO2dDQUNuRCxhQUFhO2dDQUNiLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztnQ0FDN0QsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDO2dDQUN0SCxNQUFNOzRCQUNSLEtBQUssZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHVCQUF1QjtnQ0FDdEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDO2dDQUMvRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsQ0FBQztnQ0FDcEUsTUFBTTs0QkFDUixLQUFLLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyx5QkFBeUI7Z0NBQ3hELElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDO2dDQUN6RyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztnQ0FDdEIsTUFBTTs0QkFDUixLQUFLLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyx3QkFBd0I7Z0NBQ3ZELElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDO2dDQUN4RyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztnQ0FDdEIsTUFBTTs0QkFDUixLQUFLLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxvQkFBb0I7Z0NBQ25ELElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQztnQ0FDeEcsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUM7Z0NBQ3BFLE1BQU07NEJBQ1I7Z0NBQ0UsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7Z0NBQ3RDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dDQUN0QixNQUFNO3lCQUNUO3FCQUNGO29CQUVELElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRTt3QkFDeEYsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7cUJBQzVCO29CQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3JCLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLDJDQUEyQyxDQUFDLENBQUM7b0JBQ2hHLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLG9CQUFvQixDQUFDO29CQUNoRCxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO29CQUNwRyxJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztvQkFDaEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztvQkFDM0YsSUFBSSxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsb0JBQW9CLENBQUM7b0JBQ2hELE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLDREQUE0RCxDQUFDLENBQUM7b0JBQ2pILElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLG9CQUFvQixDQUFDO29CQUNoRCxPQUFPLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFDO29CQUM1RixJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztnQkFDbEQsQ0FBQztnQkFFTSxrQkFBa0I7b0JBQ3ZCLE9BQU8sR0FBRyxDQUFDO2dCQUNiLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE1BQU07b0JBQ2xCLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNoQyxDQUFDO2FBQ0YsQ0FBQTtZQWxUQzs7ZUFFRztZQUNvQiwyQkFBVSxHQUFHO2dCQUNsQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNCLGVBQWUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3Qyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNDLENBQUM7WUFRcUIsOEJBQWEsR0FBRztnQkFDckMsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQztnQkFDaEksSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQztnQkFDcEksSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDO2dCQUN0SSxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUM7Z0JBQ3JKLElBQUksT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMseUJBQXlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDO2dCQUN6SixJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDdkosSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7YUFDcEosQ0FBQztZQUVxQiwyQkFBVSxHQUFHO2dCQUNsQyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQztnQkFDbkYsSUFBSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQzthQUN6RSxDQUFDO1lBQ3FCLGdDQUFlLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyJ9