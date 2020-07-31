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
System.register(["../collision/b2_collide_polygon.js", "./b2_contact.js"], function (exports_1, context_1) {
    "use strict";
    var b2_collide_polygon_js_1, b2_contact_js_1, b2PolygonContact;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_collide_polygon_js_1_1) {
                b2_collide_polygon_js_1 = b2_collide_polygon_js_1_1;
            },
            function (b2_contact_js_1_1) {
                b2_contact_js_1 = b2_contact_js_1_1;
            }
        ],
        execute: function () {
            b2PolygonContact = class b2PolygonContact extends b2_contact_js_1.b2Contact {
                static Create() {
                    return new b2PolygonContact();
                }
                static Destroy(contact) {
                }
                Evaluate(manifold, xfA, xfB) {
                    b2_collide_polygon_js_1.b2CollidePolygons(manifold, this.GetShapeA(), xfA, this.GetShapeB(), xfB);
                }
            };
            exports_1("b2PolygonContact", b2PolygonContact);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfcG9seWdvbl9jb250YWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJfcG9seWdvbl9jb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7Ozs7WUFRRixtQkFBQSxNQUFhLGdCQUFpQixTQUFRLHlCQUF5QztnQkFDdEUsTUFBTSxDQUFDLE1BQU07b0JBQ2xCLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNoQyxDQUFDO2dCQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBa0I7Z0JBQ3hDLENBQUM7Z0JBRU0sUUFBUSxDQUFDLFFBQW9CLEVBQUUsR0FBZ0IsRUFBRSxHQUFnQjtvQkFDdEUseUNBQWlCLENBQ2YsUUFBUSxFQUNSLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQ3JCLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDM0IsQ0FBQzthQUNGLENBQUEifQ==