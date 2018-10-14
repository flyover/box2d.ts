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
System.register(["../../Common/b2Math"], function (exports_1, context_1) {
    "use strict";
    var b2Math_1, b2MassData, b2ShapeType, b2Shape;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            }
        ],
        execute: function () {
            /// This holds the mass data computed for a shape.
            b2MassData = class b2MassData {
                constructor() {
                    /// The mass of the shape, usually in kilograms.
                    this.mass = 0;
                    /// The position of the shape's centroid relative to the shape's origin.
                    this.center = new b2Math_1.b2Vec2(0, 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTaGFwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0JveDJEL0NvbGxpc2lvbi9TaGFwZXMvYjJTaGFwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7O1lBT0Ysa0RBQWtEO1lBQ2xELGFBQUEsTUFBYSxVQUFVO2dCQUF2QjtvQkFDRSxnREFBZ0Q7b0JBQ3pDLFNBQUksR0FBVyxDQUFDLENBQUM7b0JBRXhCLHdFQUF3RTtvQkFDeEQsV0FBTSxHQUFXLElBQUksZUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFFbEQsK0RBQStEO29CQUN4RCxNQUFDLEdBQVcsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2FBQUEsQ0FBQTs7WUFFRCxXQUFZLFdBQVc7Z0JBQ3JCLHdEQUFjLENBQUE7Z0JBQ2QsK0RBQWlCLENBQUE7Z0JBQ2pCLDJEQUFlLENBQUE7Z0JBQ2YsaUVBQWtCLENBQUE7Z0JBQ2xCLDZEQUFnQixDQUFBO2dCQUNoQixxRUFBb0IsQ0FBQTtZQUN0QixDQUFDLEVBUFcsV0FBVyxLQUFYLFdBQVcsUUFPdEI7O1lBRUQscUZBQXFGO1lBQ3JGLG9GQUFvRjtZQUNwRixrRUFBa0U7WUFDbEUsVUFBQSxNQUFzQixPQUFPO2dCQU8zQixZQUFZLElBQWlCLEVBQUUsTUFBYztvQkFOdEMsV0FBTSxHQUFnQixXQUFXLENBQUMsU0FBUyxDQUFDO29CQUVwRCxrR0FBa0c7b0JBQ2xHLDRCQUE0QjtvQkFDcEIsYUFBUSxHQUFXLENBQUMsQ0FBQztvQkFHMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO2dCQUN6QixDQUFDO2dCQUtNLElBQUksQ0FBQyxLQUFjO29CQUN4QixpREFBaUQ7b0JBQ2pELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztvQkFDL0IsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFRCxvRkFBb0Y7Z0JBQ3BGLDJCQUEyQjtnQkFDcEIsT0FBTztvQkFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3JCLENBQUM7YUEyQ0YsQ0FBQSJ9