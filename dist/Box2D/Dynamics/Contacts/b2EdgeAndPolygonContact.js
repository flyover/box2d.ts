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
System.register(["../../Collision/b2CollideEdge", "./b2Contact"], function (exports_1, context_1) {
    "use strict";
    var b2CollideEdge_1, b2Contact_1, b2EdgeAndPolygonContact;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2CollideEdge_1_1) {
                b2CollideEdge_1 = b2CollideEdge_1_1;
            },
            function (b2Contact_1_1) {
                b2Contact_1 = b2Contact_1_1;
            }
        ],
        execute: function () {
            b2EdgeAndPolygonContact = class b2EdgeAndPolygonContact extends b2Contact_1.b2Contact {
                constructor() {
                    super();
                }
                static Create(allocator) {
                    return new b2EdgeAndPolygonContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    // DEBUG: b2Assert(fixtureA.GetType() === b2ShapeType.e_edgeShape);
                    // DEBUG: b2Assert(fixtureB.GetType() === b2ShapeType.e_polygonShape);
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    // DEBUG: b2Assert(shapeA instanceof b2EdgeShape);
                    // DEBUG: b2Assert(shapeB instanceof b2PolygonShape);
                    b2CollideEdge_1.b2CollideEdgeAndPolygon(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_1("b2EdgeAndPolygonContact", b2EdgeAndPolygonContact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJFZGdlQW5kUG9seWdvbkNvbnRhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Cb3gyRC9EeW5hbWljcy9Db250YWN0cy9iMkVkZ2VBbmRQb2x5Z29uQ29udGFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBYUYsMEJBQUEsTUFBYSx1QkFBd0IsU0FBUSxxQkFBUztnQkFDcEQ7b0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQWM7b0JBQ2pDLE9BQU8sSUFBSSx1QkFBdUIsRUFBRSxDQUFDO2dCQUN2QyxDQUFDO2dCQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBa0IsRUFBRSxTQUFjO2dCQUN4RCxDQUFDO2dCQUVNLEtBQUssQ0FBQyxRQUFtQixFQUFFLE1BQWMsRUFBRSxRQUFtQixFQUFFLE1BQWM7b0JBQ25GLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ2hELG1FQUFtRTtvQkFDbkUsc0VBQXNFO2dCQUN4RSxDQUFDO2dCQUVNLFFBQVEsQ0FBQyxRQUFvQixFQUFFLEdBQWdCLEVBQUUsR0FBZ0I7b0JBQ3RFLE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ25ELE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ25ELGtEQUFrRDtvQkFDbEQscURBQXFEO29CQUNyRCx1Q0FBdUIsQ0FDckIsUUFBUSxFQUNSLE1BQXFCLEVBQUUsR0FBRyxFQUMxQixNQUF3QixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2FBQ0YsQ0FBQSJ9