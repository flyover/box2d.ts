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
    var box2d, testbed, EdgeTest;
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
            EdgeTest = class EdgeTest extends testbed.Test {
                constructor() {
                    super();
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        /*box2d.b2Body*/
                        const ground = this.m_world.CreateBody(bd);
                        /*box2d.b2Vec2*/
                        const v1 = new box2d.b2Vec2(-10.0, 0.0), v2 = new box2d.b2Vec2(-7.0, -2.0), v3 = new box2d.b2Vec2(-4.0, 0.0);
                        /*box2d.b2Vec2*/
                        const v4 = new box2d.b2Vec2(0.0, 0.0), v5 = new box2d.b2Vec2(4.0, 0.0), v6 = new box2d.b2Vec2(7.0, 2.0), v7 = new box2d.b2Vec2(10.0, 0.0);
                        /*box2d.b2EdgeShape*/
                        const shape = new box2d.b2EdgeShape();
                        shape.Set(v1, v2);
                        shape.m_hasVertex3 = true;
                        shape.m_vertex3.Copy(v3);
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(v2, v3);
                        shape.m_hasVertex0 = true;
                        shape.m_hasVertex3 = true;
                        shape.m_vertex0.Copy(v1);
                        shape.m_vertex3.Copy(v4);
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(v3, v4);
                        shape.m_hasVertex0 = true;
                        shape.m_hasVertex3 = true;
                        shape.m_vertex0.Copy(v2);
                        shape.m_vertex3.Copy(v5);
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(v4, v5);
                        shape.m_hasVertex0 = true;
                        shape.m_hasVertex3 = true;
                        shape.m_vertex0.Copy(v3);
                        shape.m_vertex3.Copy(v6);
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(v5, v6);
                        shape.m_hasVertex0 = true;
                        shape.m_hasVertex3 = true;
                        shape.m_vertex0.Copy(v4);
                        shape.m_vertex3.Copy(v7);
                        ground.CreateFixture(shape, 0.0);
                        shape.Set(v6, v7);
                        shape.m_hasVertex0 = true;
                        shape.m_vertex0.Copy(v5);
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(-0.5, 0.6);
                        bd.allowSleep = false;
                        /*box2d.b2Body*/
                        const body = this.m_world.CreateBody(bd);
                        /*box2d.b2CircleShape*/
                        const shape = new box2d.b2CircleShape();
                        shape.m_radius = 0.5;
                        body.CreateFixture(shape, 1.0);
                    }
                    {
                        /*box2d.b2BodyDef*/
                        const bd = new box2d.b2BodyDef();
                        bd.type = box2d.b2BodyType.b2_dynamicBody;
                        bd.position.Set(1.0, 0.6);
                        bd.allowSleep = false;
                        /*box2d.b2Body*/
                        const body = this.m_world.CreateBody(bd);
                        /*box2d.b2PolygonShape*/
                        const shape = new box2d.b2PolygonShape();
                        shape.SetAsBox(0.5, 0.5);
                        body.CreateFixture(shape, 1.0);
                    }
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new EdgeTest();
                }
            };
            exports_1("EdgeTest", EdgeTest);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRWRnZVRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9UZXN0YmVkL1Rlc3RzL0VkZ2VUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFLRixXQUFBLGNBQXNCLFNBQVEsT0FBTyxDQUFDLElBQUk7Z0JBQ3hDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUVSO3dCQUNFLG1CQUFtQjt3QkFDbkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2pDLGdCQUFnQjt3QkFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRTNDLGdCQUFnQjt3QkFDaEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUNyQyxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQ2pDLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ25DLGdCQUFnQjt3QkFDaEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFDbkMsRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQy9CLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUMvQixFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFFbkMscUJBQXFCO3dCQUNyQixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzt3QkFFdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7d0JBQ2xCLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO3dCQUMxQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDekIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWpDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNsQixLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzt3QkFDMUIsS0FBSyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7d0JBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUN6QixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDekIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWpDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNsQixLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzt3QkFDMUIsS0FBSyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7d0JBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUN6QixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDekIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRWpDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNsQixLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzt3QkFDMUIsS0FBSyxD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