/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
System.register(["../../Collision/b2CollideEdge", "../../Collision/Shapes/b2EdgeShape", "./b2Contact"], function (exports_1, context_1) {
    "use strict";
    var b2CollideEdge_1, b2EdgeShape_1, b2Contact_1, b2ChainAndPolygonContact;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2CollideEdge_1_1) {
                b2CollideEdge_1 = b2CollideEdge_1_1;
            },
            function (b2EdgeShape_1_1) {
                b2EdgeShape_1 = b2EdgeShape_1_1;
            },
            function (b2Contact_1_1) {
                b2Contact_1 = b2Contact_1_1;
            }
        ],
        execute: function () {
            b2ChainAndPolygonContact = class b2ChainAndPolygonContact extends b2Contact_1.b2Contact {
                constructor() {
                    super();
                }
                static Create(allocator) {
                    return new b2ChainAndPolygonContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    // DEBUG: b2Assert(fixtureA.GetType() === b2ShapeType.e_chainShape);
                    // DEBUG: b2Assert(fixtureB.GetType() === b2ShapeType.e_polygonShape);
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    // DEBUG: b2Assert(shapeA instanceof b2ChainShape);
                    // DEBUG: b2Assert(shapeB instanceof b2PolygonShape);
                    const chain = shapeA;
                    const edge = b2ChainAndPolygonContact.Evaluate_s_edge;
                    chain.GetChildEdge(edge, this.m_indexA);
                    b2CollideEdge_1.b2CollideEdgeAndPolygon(manifold, edge, xfA, shapeB, xfB);
                }
            };
            b2ChainAndPolygonContact.Evaluate_s_edge = new b2EdgeShape_1.b2EdgeShape();
            exports_1("b2ChainAndPolygonContact", b2ChainAndPolygonContact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaGFpbkFuZFBvbHlnb25Db250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvQ29udGFjdHMvYjJDaGFpbkFuZFBvbHlnb25Db250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFjRiwyQkFBQSxNQUFhLHdCQUF5QixTQUFRLHFCQUFTO2dCQUNyRDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztnQkFDVixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBYztvQkFDakMsT0FBTyxJQUFJLHdCQUF3QixFQUFFLENBQUM7Z0JBQ3hDLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFrQixFQUFFLFNBQWM7Z0JBQ3hELENBQUM7Z0JBRU0sS0FBSyxDQUFDLFFBQW1CLEVBQUUsTUFBYyxFQUFFLFFBQW1CLEVBQUUsTUFBYztvQkFDbkYsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDaEQsb0VBQW9FO29CQUNwRSxzRUFBc0U7Z0JBQ3hFLENBQUM7Z0JBR00sUUFBUSxDQUFDLFFBQW9CLEVBQUUsR0FBZ0IsRUFBRSxHQUFnQjtvQkFDdEUsTUFBTSxNQUFNLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbkQsTUFBTSxNQUFNLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbkQsbURBQW1EO29CQUNuRCxxREFBcUQ7b0JBQ3JELE1BQU0sS0FBSyxHQUFpQixNQUFzQixDQUFDO29CQUNuRCxNQUFNLElBQUksR0FBZ0Isd0JBQXdCLENBQUMsZUFBZSxDQUFDO29CQUNuRSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3hDLHVDQUF1QixDQUNyQixRQUFRLEVBQ1IsSUFBSSxFQUFFLEdBQUcsRUFDVCxNQUF3QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2FBQ0YsQ0FBQTtZQWRnQix3Q0FBZSxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDIn0=