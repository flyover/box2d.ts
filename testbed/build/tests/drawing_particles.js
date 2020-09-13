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
System.register(["@box2d", "../testbed.js"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, DrawingParticles;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
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
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-4, -2),
                                new b2.Vec2(4, -2),
                                new b2.Vec2(4, 0),
                                new b2.Vec2(-4, 0),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-4, -2),
                                new b2.Vec2(-2, -2),
                                new b2.Vec2(-2, 6),
                                new b2.Vec2(-4, 6),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(2, -2),
                                new b2.Vec2(4, -2),
                                new b2.Vec2(4, 6),
                                new b2.Vec2(2, 6),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                        {
                            const shape = new b2.PolygonShape();
                            const vertices = [
                                new b2.Vec2(-4, 4),
                                new b2.Vec2(4, 4),
                                new b2.Vec2(4, 6),
                                new b2.Vec2(-4, 6),
                            ];
                            shape.Set(vertices, 4);
                            ground.CreateFixture(shape, 0.0);
                        }
                    }
                    this.m_colorIndex = 0;
                    this.m_particleSystem.SetRadius(0.05 * 2);
                    this.m_lastGroup = null;
                    this.m_drawing = true;
                    // DEBUG: b2.Assert((DrawingParticles.k_paramDef[0].CalculateValueMask() & DrawingParticles.Parameters.e_parameterBegin) === 0);
                    testbed.Test.SetParticleParameters(DrawingParticles.k_paramDef, DrawingParticles.k_paramDefCount);
                    testbed.Test.SetRestartOnParticleParameterChange(false);
                    this.m_particleFlags = testbed.Test.GetParticleParameterValue();
                    this.m_groupFlags = 0;
                }
                // Determine the current particle parameter from the drawing state and
                // group flags.
                DetermineParticleParameter() {
                    if (this.m_drawing) {
                        if (this.m_groupFlags === (b2.ParticleGroupFlag.b2_rigidParticleGroup | b2.ParticleGroupFlag.b2_solidParticleGroup)) {
                            return DrawingParticles.Parameters.e_parameterRigid;
                        }
                        if (this.m_groupFlags === b2.ParticleGroupFlag.b2_rigidParticleGroup && this.m_particleFlags === b2.ParticleFlag.b2_barrierParticle) {
                            return DrawingParticles.Parameters.e_parameterRigidBarrier;
                        }
                        if (this.m_particleFlags === (b2.ParticleFlag.b2_elasticParticle | b2.ParticleFlag.b2_barrierParticle)) {
                            return DrawingParticles.Parameters.e_parameterElasticBarrier;
                        }
                        if (this.m_particleFlags === (b2.ParticleFlag.b2_springParticle | b2.ParticleFlag.b2_barrierParticle)) {
                            return DrawingParticles.Parameters.e_parameterSpringBarrier;
                        }
                        if (this.m_particleFlags === (b2.ParticleFlag.b2_wallParticle | b2.ParticleFlag.b2_repulsiveParticle)) {
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
                            this.m_particleFlags = b2.ParticleFlag.b2_elasticParticle;
                            this.m_groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "p":
                            this.m_particleFlags = b2.ParticleFlag.b2_powderParticle;
                            break;
                        case "r":
                            this.m_groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup | b2.ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "s":
                            this.m_particleFlags = b2.ParticleFlag.b2_springParticle;
                            this.m_groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "t":
                            this.m_particleFlags = b2.ParticleFlag.b2_tensileParticle;
                            break;
                        case "v":
                            this.m_particleFlags = b2.ParticleFlag.b2_viscousParticle;
                            break;
                        case "w":
                            this.m_particleFlags = b2.ParticleFlag.b2_wallParticle;
                            this.m_groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "b":
                            this.m_particleFlags = b2.ParticleFlag.b2_barrierParticle | b2.ParticleFlag.b2_wallParticle;
                            break;
                        case "h":
                            this.m_particleFlags = b2.ParticleFlag.b2_barrierParticle;
                            this.m_groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup;
                            break;
                        case "n":
                            this.m_particleFlags = b2.ParticleFlag.b2_barrierParticle | b2.ParticleFlag.b2_elasticParticle;
                            this.m_groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "m":
                            this.m_particleFlags = b2.ParticleFlag.b2_barrierParticle | b2.ParticleFlag.b2_springParticle;
                            this.m_groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
                            break;
                        case "f":
                            this.m_particleFlags = b2.ParticleFlag.b2_wallParticle | b2.ParticleFlag.b2_repulsiveParticle;
                            break;
                        case "c":
                            this.m_particleFlags = b2.ParticleFlag.b2_colorMixingParticle;
                            break;
                        case "z":
                            this.m_particleFlags = b2.ParticleFlag.b2_zombieParticle;
                            break;
                        default:
                            break;
                    }
                    testbed.Test.SetParticleParameterValue(this.DetermineParticleParameter());
                }
                MouseMove(p) {
                    super.MouseMove(p);
                    if (this.m_drawing) {
                        const shape = new b2.CircleShape();
                        shape.m_p.Copy(p);
                        shape.m_radius = 0.2;
                        ///  b2Transform xf;
                        ///  xf.SetIdentity();
                        const xf = b2.Transform.IDENTITY;
                        this.m_particleSystem.DestroyParticlesInShape(shape, xf);
                        const joinGroup = this.m_lastGroup && this.m_groupFlags === this.m_lastGroup.GetGroupFlags();
                        if (!joinGroup) {
                            this.m_colorIndex = (this.m_colorIndex + 1) % testbed.Test.k_ParticleColorsCount;
                        }
                        const pd = new b2.ParticleGroupDef();
                        pd.shape = shape;
                        pd.flags = this.m_particleFlags;
                        if ((this.m_particleFlags & (b2.ParticleFlag.b2_wallParticle | b2.ParticleFlag.b2_springParticle | b2.ParticleFlag.b2_elasticParticle)) ||
                            (this.m_particleFlags === (b2.ParticleFlag.b2_wallParticle | b2.ParticleFlag.b2_barrierParticle))) {
                            pd.flags |= b2.ParticleFlag.b2_reactiveParticle;
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
                            (group.GetGroupFlags() & b2.ParticleGroupFlag.b2_rigidParticleGroup) &&
                            (group.GetAllParticleFlags() & b2.ParticleFlag.b2_zombieParticle)) {
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
                            case b2.ParticleFlag.b2_elasticParticle:
                            case b2.ParticleFlag.b2_springParticle:
                            case b2.ParticleFlag.b2_wallParticle:
                                this.m_particleFlags = parameterValue;
                                this.m_groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
                                break;
                            case DrawingParticles.Parameters.e_parameterRigid:
                                // b2_waterParticle is the default particle type in
                                // LiquidFun.
                                this.m_particleFlags = b2.ParticleFlag.b2_waterParticle;
                                this.m_groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup | b2.ParticleGroupFlag.b2_solidParticleGroup;
                                break;
                            case DrawingParticles.Parameters.e_parameterRigidBarrier:
                                this.m_particleFlags = b2.ParticleFlag.b2_barrierParticle;
                                this.m_groupFlags = b2.ParticleGroupFlag.b2_rigidParticleGroup;
                                break;
                            case DrawingParticles.Parameters.e_parameterElasticBarrier:
                                this.m_particleFlags = b2.ParticleFlag.b2_barrierParticle | b2.ParticleFlag.b2_elasticParticle;
                                this.m_groupFlags = 0;
                                break;
                            case DrawingParticles.Parameters.e_parameterSpringBarrier:
                                this.m_particleFlags = b2.ParticleFlag.b2_barrierParticle | b2.ParticleFlag.b2_springParticle;
                                this.m_groupFlags = 0;
                                break;
                            case DrawingParticles.Parameters.e_parameterRepulsive:
                                this.m_particleFlags = b2.ParticleFlag.b2_repulsiveParticle | b2.ParticleFlag.b2_wallParticle;
                                this.m_groupFlags = b2.ParticleGroupFlag.b2_solidParticleGroup;
                                break;
                            default:
                                this.m_particleFlags = parameterValue;
                                this.m_groupFlags = 0;
                                break;
                        }
                    }
                    if (this.m_particleSystem.GetAllParticleFlags() & b2.ParticleFlag.b2_zombieParticle) {
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
                new testbed.ParticleParameterValue(b2.ParticleFlag.b2_zombieParticle, testbed.ParticleParameter.k_DefaultOptions, "erase"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2luZ19wYXJ0aWNsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9kcmF3aW5nX3BhcnRpY2xlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRzs7Ozs7Ozs7Ozs7Ozs7O1lBT0gsbUJBQUEsTUFBYSxnQkFBaUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFvQ2hEO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQXRCSCxjQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNqQixvQkFBZSxHQUFHLENBQUMsQ0FBQztvQkFDcEIsaUJBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO29CQXFCdEI7d0JBQ0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQzVCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQzs0QkFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs0QkFDcEMsTUFBTSxRQUFRLEdBQUc7Z0NBQ2YsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUNuQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUNsQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDakIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDbkIsQ0FBQzs0QkFDRixLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDdkIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7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