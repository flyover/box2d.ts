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
System.register(["Box2D", "Testbed"], function (exports_1, context_1) {
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
            exports_1("Tiles", Tiles);
            Tiles.e_count = 20;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUaWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBS0Y7Ozs7ZUFJRztZQUVILFFBQUEsTUFBYSxLQUFNLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBTXJDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUpILG1CQUFjLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixpQkFBWSxHQUFHLEdBQUcsQ0FBQztvQkFLeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7b0JBQ3hCLGlCQUFpQjtvQkFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRWxDO3dCQUNFLFdBQVc7d0JBQ1gsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUNkLG1CQUFtQjt3QkFDbkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixnQkFBZ0I7d0JBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUUzQzs0QkFDRSxTQUFTOzRCQUNULE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQzs0QkFDZCxTQUFTOzRCQUNULE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQzs0QkFDYixnQkFBZ0I7NEJBQ2hCLE1BQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDOzRCQUNwQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs0QkFDakIsTUFBTSxTQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dDQUNyQyxRQUFR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