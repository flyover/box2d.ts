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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJFZGdlQW5kUG9seWdvbkNvbnRhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Cb3gyRC9EeW5hbWljcy9Db250YWN0cy9iMkVkZ2VBbmRQb2x5Z29uQ29udGFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7O1lBYUYsMEJBQUEsNkJBQXFDLFNBQVEscUJBQVM7Z0JBQ3BEO29CQUNFLEtBQUssRUFBRSxDQUFDO2dCQUNWLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFjO29CQUNqQyxPQUFPLElBQUksdUJBQXVCLEVBQUUsQ0FBQztnQkFDdkMsQ0FBQztnQkFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWtCLEVBQUUsU0FBYztnQkFDeEQsQ0FBQztnQkFFTSxLQUFLLENBQUMsUUFBbUIsRUFBRSxNQUFjLEVBQUUsUUFBbUIsRUFBRSxNQUFjO29CQUNuRixLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNoRCxtRUFBbUU7b0JBQ25FLHNFQUFzRTtnQkFDeEUsQ0FBQztnQkFFTSxRQUFRLENBQUMsUUFBb0IsRUFBRSxHQUFnQixFQUFFLEdBQWdCO29CQUN0RSxNQUFNLE1BQU0sR0FBWSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNuRCxNQUFNLE1BQU0sR0FBWSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNuRCxrREFBa0Q7b0JBQ2xELHFEQUFxRDtvQkFDckQsdUNBQXVCLENBQ3JCLFFBQVEsRUFDUixNQUFxQixFQUFFLEdBQUcsRUFDMUIsTUFBd0IsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQzthQUNGLENBQUEifQ==