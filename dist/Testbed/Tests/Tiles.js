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
            Tiles.e_count = 20;
            exports_1("Tiles", Tiles);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL1RpbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRjs7OztlQUlHO1lBRUgsUUFBQSxXQUFtQixTQUFRLE9BQU8sQ0FBQyxJQUFJO2dCQU1yQztvQkFDRSxLQUFLLEVBQUUsQ0FBQztvQkFKSCxtQkFBYyxHQUFHLENBQUMsQ0FBQztvQkFDbkIsaUJBQVksR0FBRyxHQUFHLENBQUM7b0JBS3hCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO29CQUN4QixpQkFBaUI7b0JBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUVsQzt3QkFDRSxXQUFXO3dCQUNYLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQzt3QkFDZCxtQkFBbUI7d0JBQ25CLE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsZ0JBQWdCO3dCQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFFM0M7NEJBQ0UsU0FBUzs0QkFDVCxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUM7NEJBQ2QsU0FBUzs0QkFDVCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQ2IsZ0JBQWdCOzRCQUNoQixNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFDcEMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7NEJBQ2pCLE1BQU0sU0FBVSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENB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