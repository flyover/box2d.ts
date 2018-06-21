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
    var b2CollideCircle_1, b2Contact_1, b2CircleContact;
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
            b2CircleContact = class b2CircleContact extends b2Contact_1.b2Contact {
                constructor() {
                    super();
                }
                static Create(allocator) {
                    return new b2CircleContact();
                }
                static Destroy(contact, allocator) {
                }
                Reset(fixtureA, indexA, fixtureB, indexB) {
                    super.Reset(fixtureA, indexA, fixtureB, indexB);
                }
                Evaluate(manifold, xfA, xfB) {
                    const shapeA = this.m_fixtureA.GetShape();
                    const shapeB = this.m_fixtureB.GetShape();
                    // DEBUG: b2Assert(shapeA.GetType() === b2ShapeType.e_circleShape);
                    // DEBUG: b2Assert(shapeB.GetType() === b2ShapeType.e_circleShape);
                    b2CollideCircle_1.b2CollideCircles(manifold, shapeA, xfA, shapeB, xfB);
                }
            };
            exports_1("b2CircleContact", b2CircleContact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaXJjbGVDb250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vQm94MkQvRHluYW1pY3MvQ29udGFjdHMvYjJDaXJjbGVDb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFZRixrQkFBQSxxQkFBNkIsU0FBUSxxQkFBUztnQkFDNUM7b0JBQ0UsS0FBSyxFQUFFLENBQUM7Z0JBQ1YsQ0FBQztnQkFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQWM7b0JBQ2pDLE9BQU8sSUFBSSxlQUFlLEVBQUUsQ0FBQztnQkFDL0IsQ0FBQztnQkFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWtCLEVBQUUsU0FBYztnQkFDeEQsQ0FBQztnQkFFTSxLQUFLLENBQUMsUUFBbUIsRUFBRSxNQUFjLEVBQUUsUUFBbUIsRUFBRSxNQUFjO29CQUNuRixLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNsRCxDQUFDO2dCQUVNLFFBQVEsQ0FBQyxRQUFvQixFQUFFLEdBQWdCLEVBQUUsR0FBZ0I7b0JBQ3RFLE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ25ELE1BQU0sTUFBTSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ25ELG1FQUFtRTtvQkFDbkUsbUVBQW1FO29CQUNuRSxrQ0FBZ0IsQ0FDZCxRQUFRLEVBQ1IsTUFBdUIsRUFBRSxHQUFHLEVBQzVCLE1BQXVCLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7YUFDRixDQUFBIn0=