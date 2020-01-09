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
System.register(["../../Common/b2Math.js"], function (exports_1, context_1) {
    "use strict";
    var b2Math_js_1, b2MassData, b2ShapeType, b2Shape;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Math_js_1_1) {
                b2Math_js_1 = b2Math_js_1_1;
            }
        ],
        execute: function () {
            /// This holds the mass data computed for a shape.
            b2MassData = class b2MassData {
                constructor() {
                    /// The mass of the shape, usually in kilograms.
                    this.mass = 0;
                    /// The position of the shape's centroid relative to the shape's origin.
                    this.center = new b2Math_js_1.b2Vec2(0, 0);
                    /// The rotational inertia of the shape about the local origin.
                    this.I = 0;
                }
            };
            exports_1("b2MassData", b2MassData);
            (function (b2ShapeType) {
                b2ShapeType[b2ShapeType["e_unknown"] = -1] = "e_unknown";
                b2ShapeType[b2ShapeType["e_circleShape"] = 0] = "e_circleShape";
                b2ShapeType[b2ShapeType["e_edgeShape"] = 1] = "e_edgeShape";
                b2ShapeType[b2ShapeType["e_polygonShape"] = 2] = "e_polygonShape";
                b2ShapeType[b2ShapeType["e_chainShape"] = 3] = "e_chainShape";
                b2ShapeType[b2ShapeType["e_shapeTypeCount"] = 4] = "e_shapeTypeCount";
            })(b2ShapeType || (b2ShapeType = {}));
            exports_1("b2ShapeType", b2ShapeType);
            /// A shape is used for collision detection. You can create a shape however you like.
            /// Shapes used for simulation in b2World are created automatically when a b2Fixture
            /// is created. Shapes may encapsulate a one or more child shapes.
            b2Shape = class b2Shape {
                constructor(type, radius) {
                    this.m_type = b2ShapeType.e_unknown;
                    /// Radius of a shape. For polygonal shapes this must be b2_polygonRadius. There is no support for
                    /// making rounded polygons.
                    this.m_radius = 0;
                    this.m_type = type;
                    this.m_radius = radius;
                }
                Copy(other) {
                    // DEBUG: b2Assert(this.m_type === other.m_type);
                    this.m_radius = other.m_radius;
                    return this;
                }
                /// Get the type of this shape. You can use this to down cast to the concrete shape.
                /// @return the shape type.
                GetType() {
                    return this.m_type;
                }
            };
            exports_1("b2Shape", b2Shape);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyU2hhcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7OztZQU9GLGtEQUFrRDtZQUNsRCxhQUFBLE1BQWEsVUFBVTtnQkFBdkI7b0JBQ0UsZ0RBQWdEO29CQUN6QyxTQUFJLEdBQVcsQ0FBQyxDQUFDO29CQUV4Qix3RUFBd0U7b0JBQ3hELFdBQU0sR0FBVyxJQUFJLGtCQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUVsRCwrREFBK0Q7b0JBQ3hELE1BQUMsR0FBVyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7YUFBQSxDQUFBOztZQUVELFdBQVksV0FBVztnQkFDckIsd0RBQWMsQ0FBQTtnQkFDZCwrREFBaUIsQ0FBQTtnQkFDakIsMkRBQWUsQ0FBQTtnQkFDZixpRUFBa0IsQ0FBQTtnQkFDbEIsNkRBQWdCLENBQUE7Z0JBQ2hCLHFFQUFvQixDQUFBO1lBQ3RCLENBQUMsRUFQVyxXQUFXLEtBQVgsV0FBVyxRQU90Qjs7WUFFRCxxRkFBcUY7WUFDckYsb0ZBQW9GO1lBQ3BGLGtFQUFrRTtZQUNsRSxVQUFBLE1BQXNCLE9BQU87Z0JBTzNCLFlBQVksSUFBaUIsRUFBRSxNQUFjO29CQU43QixXQUFNLEdBQWdCLFdBQVcsQ0FBQyxTQUFTLENBQUM7b0JBRTdELGtHQUFrRztvQkFDbEcsNEJBQTRCO29CQUNwQixhQUFRLEdBQVcsQ0FBQyxDQUFDO29CQUcxQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7Z0JBQ3pCLENBQUM7Z0JBS00sSUFBSSxDQUFDLEtBQWM7b0JBQ3hCLGlEQUFpRDtvQkFDakQsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO29CQUMvQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVELG9GQUFvRjtnQkFDcEYsMkJBQTJCO2dCQUNwQixPQUFPO29CQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDckIsQ0FBQzthQTJDRixDQUFBIn0=