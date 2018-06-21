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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaGFpbkFuZFBvbHlnb25Db250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvQ29udGFjdHMvYjJDaGFpbkFuZFBvbHlnb25Db250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFjRiwyQkFBQSw4QkFBc0MsU0FBUSxxQkFBUztnQkFDckQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQWM7b0JBQ2pDLE9BQU8sSUFBSSx3QkFBd0IsRUFBRSxDQUFDO2dCQUN4QyxDQUFDO2dCQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBa0IsRUFBRSxTQUFjO2dCQUN4RCxDQUFDO2dCQUVNLEtBQUssQ0FBQyxRQUFtQixFQUFFLE1BQWMsRUFBRSxRQUFtQixFQUFFLE1BQWM7b0JBQ25GLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ2hELG9FQUFvRTtvQkFDcEUsc0VBQXNFO2dCQUN4RSxDQUFDO2dCQUdNLFFBQVEsQ0FBQyxRQUFvQixFQUFFLEdBQWdCLEVBQUUsR0FBZ0I7b0JBQ3RFLE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ25ELE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ25ELG1EQUFtRDtvQkFDbkQscURBQXFEO29CQUNyRCxNQUFNLEtBQUssR0FBaUIsTUFBc0IsQ0FBQztvQkFDbkQsTUFBTSxJQUFJLEdBQWdCLHdCQUF3QixDQUFDLGVBQWUsQ0FBQztvQkFDbkUsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4Qyx1Q0FBdUIsQ0FDckIsUUFBUSxFQUNSLElBQUksRUFBRSxHQUFHLEVBQ1QsTUFBd0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQzthQUNGLENBQUE7WUFkZ0Isd0NBQWUsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQyJ9