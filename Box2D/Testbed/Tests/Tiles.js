/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
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
System.register(["../../Box2D/Box2D", "../Testbed"], function (exports_1, context_1) {
    "use strict";
    var box2d, testbed, Tiles;
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
             * This stress tests the dynamic tree broad-phase. This also
             * shows that tile based collision is _not_ smooth due to Box2D
             * not knowing about adjacency.
             */
            Tiles = class Tiles extends testbed.Test {
                constructor() {
                    super();
                    this.m_fixtureCount = 0;
                    this.m_createTime = 0.0;
                    this.m_fixtureCount = 0;
                    /*box2d.b2Timer*/
                    const timer = new box2d.b2Timer();
                    {
                        /*float32*/
                        const a = 0.5;
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.position.y = -a;
                        /*box2d.b2Body*/
                        const ground = this.m_world.CreateBody(bd);
                        {
                            /*int32*/
                            const N = 200;
                            /*int32*/
                            const M = 10;
                            /*box2d.b2Vec2*/
                            const position = new box2d.b2Vec2();
                            position.y = 0.0;
                            for ( /*int32*/let j = 0; j < M; ++j) {
                                position.x = -N * a;
                                for ( /*int32*/let i = 0; i < N; ++i) {
                                    /*box2d.b2PolygonShape*/
                                    const shape = new box2d.b2PolygonShape();
                                    shape.SetAsBox(a, a, position, 0.0);
                                    ground.CreateFixture(shape, 0.0);
                                    ++this.m_fixtureCount;
                                    position.x += 2.0 * a;
                                }
                                position.y -= 2.0 * a;
                            }
                        }
                        //    else
                        //    {
                        //      /*int32*/ const N = 200;
                        //      /*int32*/ const M = 10;
                        //      /*box2d.b2Vec2*/ const position = new box2d.b2Vec2();
                        //      position.x = -N * a;
                        //      for (/*int32*/ let i = 0; i < N; ++i)
                        //      {
                        //        position.y = 0.0;
                        //        for (/*int32*/ let j = 0; j < M; ++j)
                        //        {
                        //          /*box2d.b2PolygonShape*/ const shape = new box2d.b2PolygonShape();
                        //          shape.SetAsBox(a, a, position, 0.0);
                        //          ground.CreateFixture(shape, 0.0);
                        //          position.y -= 2.0 * a;
                        //        }
                        //        position.x += 2.0 * a;
                        //      }
                        //    }
                    }
                    {
                        /*float32*/
                        const a = 0.5;
                        /*box2d.b2PolygonShape*/
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(a, a);
                        /*box2d.b2Vec2*/
                        const x = new box2d.b2Vec2(-7.0, 0.75);
                        /*box2d.b2Vec2*/
                        const y = new box2d.b2Vec2();
                        /*box2d.b2Vec2*/
                        const deltaX = new box2d.b2Vec2(0.5625, 1.25);
                        /*box2d.b2Vec2*/
                        const deltaY = new box2d.b2Vec2(1.125, 0.0);
                        for ( /*int32*/let i = 0; i < Tiles.e_count; ++i) {
                            y.Copy(x);
                            for ( /*int32*/let j = i; j < Tiles.e_count; ++j) {
                                /*box2d.b2BodyDef*/
                                const bd = new box2d.b2BodyDef();
                                bd.type = box2d.b2BodyType.b2_dynamicBody;
                                bd.position.Copy(y);
                                //if (i === 0 && j === 0)
                                //{
                                //  bd.allowSleep = false;
                                //}
                                //else
                                //{
                                //  bd.allowSleep = true;
                                //}
                                /*box2d.b2Body*/
                                const body = this.m_world.CreateBody(bd);
                                body.CreateFixture(shape, 5.0);
                                ++this.m_fixtureCount;
                                y.SelfAdd(deltaY);
                            }
                            x.SelfAdd(deltaX);
                        }
                    }
                    this.m_createTime = timer.GetMilliseconds();
                }
                Step(settings) {
                    /*const box2d.b2ContactManager*/
                    const cm = this.m_world.GetContactManager();
                    /*int32*/
                    const height = cm.m_broadPhase.GetTreeHeight();
                    /*int32*/
                    const leafCount = cm.m_broadPhase.GetProxyCount();
                    /*int32*/
                    const minimumNodeCount = 2 * leafCount - 1;
                    /*float32*/
                    const minimumHeight = Math.ceil(Math.log(minimumNodeCount) / Math.log(2.0));
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}, min = ${minimumHeight}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `create time = ${this.m_createTime.toFixed(2)} ms, fixture count = ${this.m_fixtureCount}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    //box2d.b2DynamicTree* tree = this.m_world.this.m_contactManager.m_broadPhase.m_tree;
                    //if (this.m_stepCount === 400)
                    //{
                    //  tree.RebuildBottomUp();
                    //}    
                }
                static Create() {
                    return new Tiles();
                }
            };
            Tiles.e_count = 20;
            exports_1("Tiles", Tiles);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUaWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0Y7Ozs7ZUFJRztZQUVILFFBQUEsV0FBbUIsU0FBUSxPQUFPLENBQUMsSUFBSTtnQkFNckM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7b0JBSlYsbUJBQWMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLGlCQUFZLEdBQUcsR0FBRyxDQUFDO29CQUtqQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztvQkFDeEIsaUJBQWlCO29CQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFbEM7d0JBQ0UsV0FBVzt3QkFDWCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7d0JBQ2QsbUJBQW1CO3dCQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLGdCQUFnQjt3QkFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDOzRCQUNFLFNBQVM7NEJBQ1QsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDOzRCQUNkLFNBQVM7NEJBQ1QsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDOzRCQUNiLGdCQUFnQjs0QkFDaEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7NEJBQ3BDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDOzRCQUNqQixNQUFNLFNBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0NBQ3JDLFFBQVEsQ0FB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