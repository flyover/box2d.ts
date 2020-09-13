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
System.register(["../collision/b2_collide_circle.js", "./b2_contact.js"], function (exports_1, context_1) {
    "use strict";
    var b2_collide_circle_js_1, b2_contact_js_1, b2CircleContact;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_collide_circle_js_1_1) {
                b2_collide_circle_js_1 = b2_collide_circle_js_1_1;
            },
            function (b2_contact_js_1_1) {
                b2_contact_js_1 = b2_contact_js_1_1;
            }
        ],
        execute: function () {
            b2CircleContact = class b2CircleContact extends b2_contact_js_1.b2Contact {
                static Create() {
                    return new b2CircleContact();
                }
                static Destroy(contact) {
                }
                Evaluate(manifold, xfA, xfB) {
                    b2_collide_circle_js_1.b2CollideCircles(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
                }
            };
            exports_1("b2CircleContact", b2CircleContact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY2lyY2xlX2NvbnRhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZHluYW1pY3MvYjJfY2lyY2xlX2NvbnRhY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7Ozs7OztZQVFGLGtCQUFBLE1BQWEsZUFBZ0IsU0FBUSx5QkFBdUM7Z0JBQ25FLE1BQU0sQ0FBQyxNQUFNO29CQUNsQixPQUFPLElBQUksZUFBZSxFQUFFLENBQUM7Z0JBQy9CLENBQUM7Z0JBRU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFrQjtnQkFDeEMsQ0FBQztnQkFFTSxRQUFRLENBQUMsUUFBb0IsRUFBRSxHQUFnQixFQUFFLEdBQWdCO29CQUN0RSx1Q0FBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNFLENBQUM7YUFDRixDQUFBIn0=