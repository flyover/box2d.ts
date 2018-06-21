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
System.register(["../../Collision/b2CollideCircle", "./b2Contact"], function (exports_1, context_1) {
    "use strict";
    var b2CollideCircle_1, b2Contact_1, b2PolygonAndCircleContact;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2CollideCircle_1_1) {
                b2CollideCircle_1 = b2CollideCircle_1_1;
            },
            function (b2Contact_1_1) {
                b2Contact_1 = b2Contact_1_1;
            }
        ],
        execute: function () {
            b2PolygonAndCircleContact = class b2PolygonAndCircleContact extends b2Contact_1.b2Contact {
                constructor() {
                    super();
                }
                static Create(allocator) {
                    return new b2PolygonAndCircleContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                    // DEBUG: b2Assert(fixtureA.GetType() === b2ShapeType.e_polygonShape);
                    // DEBUG: b2Assert(fixtureB.GetType() === b2ShapeType.e_circleShape);
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    // DEBUG: b2Assert(shapeA instanceof b2PolygonShape);
                    // DEBUG: b2Assert(shapeB instanceof b2CircleShape);
                    b2CollideCircle_1.b2CollidePolygonAndCircle(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_1("b2PolygonAndCircleContact", b2PolygonAndCircleContact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJQb2x5Z29uQW5kQ2lyY2xlQ29udGFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0JveDJEL0R5bmFtaWNzL0NvbnRhY3RzL2IyUG9seWdvbkFuZENpcmNsZUNvbnRhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQWFGLDRCQUFBLCtCQUF1QyxTQUFRLHFCQUFTO2dCQUN0RDtvQkFDRSxLQUFLLEVBQUUsQ0FBQztnQkFDVixDQUFDO2dCQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBYztvQkFDakMsT0FBTyxJQUFJLHlCQUF5QixFQUFFLENBQUM7Z0JBQ3pDLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFrQixFQUFFLFNBQWM7Z0JBQ3hELENBQUM7Z0JBRU0sS0FBSyxDQUFDLFFBQW1CLEVBQUUsTUFBYyxFQUFFLFFBQW1CLEVBQUUsTUFBYztvQkFDbkYsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDaEQsc0VBQXNFO29CQUN0RSxxRUFBcUU7Z0JBQ3ZFLENBQUM7Z0JBRU0sUUFBUSxDQUFDLFFBQW9CLEVBQUUsR0FBZ0IsRUFBRSxHQUFnQjtvQkFDdEUsTUFBTSxNQUFNLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbkQsTUFBTSxNQUFNLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbkQscURBQXFEO29CQUNyRCxvREFBb0Q7b0JBQ3BELDJDQUF5QixDQUN2QixRQUFRLEVBQ1IsTUFBd0IsRUFBRSxHQUFHLEVBQzdCLE1BQXVCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7YUFDRixDQUFBIn0=