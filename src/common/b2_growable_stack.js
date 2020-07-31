/*
* Copyright (c) 2010 Erin Catto http://www.box2d.org
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
System.register(["./b2_settings.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2GrowableStack;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            }
        ],
        execute: function () {
            /// This is a growable LIFO stack with an initial capacity of N.
            /// If the stack size exceeds the initial capacity, the heap is used
            /// to increase the size of the stack.
            b2GrowableStack = class b2GrowableStack {
                constructor(N) {
                    this.m_stack = [];
                    this.m_count = 0;
                    this.m_stack = b2_settings_js_1.b2MakeArray(N, (index) => null);
                    this.m_count = 0;
                }
                Reset() {
                    this.m_count = 0;
                    return this;
                }
                Push(element) {
                    this.m_stack[this.m_count] = element;
                    this.m_count++;
                }
                Pop() {
                    // DEBUG: b2Assert(this.m_count > 0);
                    this.m_count--;
                    const element = this.m_stack[this.m_count];
                    this.m_stack[this.m_count] = null;
                    if (element === null) {
                        throw new Error();
                    }
                    return element;
                }
                GetCount() {
                    return this.m_count;
                }
            };
            exports_1("b2GrowableStack", b2GrowableStack);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfZ3Jvd2FibGVfc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMl9ncm93YWJsZV9zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7O1lBS0YsZ0VBQWdFO1lBQ2hFLG9FQUFvRTtZQUNwRSxzQ0FBc0M7WUFFdEMsa0JBQUEsTUFBYSxlQUFlO2dCQUkxQixZQUFZLENBQVM7b0JBSGQsWUFBTyxHQUFvQixFQUFFLENBQUM7b0JBQzlCLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBR3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsNEJBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztnQkFFTSxLQUFLO29CQUNWLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLElBQUksQ0FBQztnQkFDZCxDQUFDO2dCQUVNLElBQUksQ0FBQyxPQUFVO29CQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFFTSxHQUFHO29CQUNSLHFDQUFxQztvQkFDckMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNmLE1BQU0sT0FBTyxHQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ2xDLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBQzVDLE9BQU8sT0FBTyxDQUFDO2dCQUNqQixDQUFDO2dCQUVNLFFBQVE7b0JBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUN0QixDQUFDO2FBQ0YsQ0FBQSJ9