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
    var b2CollideEdge_1, b2EdgeShape_1, b2Contact_1, b2ChainAndCircleContact;
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
            b2ChainAndCircleContact = class b2ChainAndCircleContact extends b2Contact_1.b2Contact {
                static Create() {
                    return new b2ChainAndCircleContact();
                }
                static Destroy(contact) {
                }
                Evaluate(manifold, xfA, xfB) {
                    const edge = b2ChainAndCircleContact.Evaluate_s_edge;
                    this.GetShapeA().GetChildEdge(edge, this.m_indexA);
                    b2CollideEdge_1.b2CollideEdgeAndCircle(manifold, edge, xfA, this.GetShapeB(), xfB);
                }
            };
            exports_1("b2ChainAndCircleContact", b2ChainAndCircleContact);
            b2ChainAndCircleContact.Evaluate_s_edge = new b2EdgeShape_1.b2EdgeShape();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDaGFpbkFuZENpcmNsZUNvbnRhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMkNoYWluQW5kQ2lyY2xlQ29udGFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsMEJBQUEsTUFBYSx1QkFBd0IsU0FBUSxxQkFBc0M7Z0JBQzFFLE1BQU0sQ0FBQyxNQUFNO29CQUNsQixPQUFPLElBQUksdUJBQXVCLEVBQUUsQ0FBQztnQkFDdkMsQ0FBQztnQkFFTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWtCO2dCQUN4QyxDQUFDO2dCQUdNLFFBQVEsQ0FBQyxRQUFvQixFQUFFLEdBQWdCLEVBQUUsR0FBZ0I7b0JBQ3RFLE1BQU0sSUFBSSxHQUFnQix1QkFBdUIsQ0FBQyxlQUFlLENBQUM7b0JBQ2xFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkQsc0NBQXNCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRSxDQUFDO2FBQ0YsQ0FBQTs7WUFOZ0IsdUNBQWUsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQyJ9