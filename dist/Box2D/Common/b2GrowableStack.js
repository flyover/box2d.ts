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
System.register(["./b2Settings"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2GrowableStack;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
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
                    this.m_stack = b2Settings_1.b2MakeArray(N, (index) => null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJHcm93YWJsZVN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvQ29tbW9uL2IyR3Jvd2FibGVTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7O1lBS0YsZ0VBQWdFO1lBQ2hFLG9FQUFvRTtZQUNwRSxzQ0FBc0M7WUFFdEMsa0JBQUE7Z0JBSUUsWUFBWSxDQUFTO29CQUhkLFlBQU8sR0FBb0IsRUFBRSxDQUFDO29CQUM5QixZQUFPLEdBQVcsQ0FBQyxDQUFDO29CQUd6QixJQUFJLENBQUMsT0FBTyxHQUFHLHdCQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ25CLENBQUM7Z0JBRU0sS0FBSztvQkFDVixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakIsT0FBTyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztnQkFFTSxJQUFJLENBQUMsT0FBVTtvQkFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO29CQUNyQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pCLENBQUM7Z0JBRU0sR0FBRztvQkFDUixxQ0FBcUM7b0JBQ3JDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDZixNQUFNLE9BQU8sR0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNsQyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUM1QyxPQUFPLE9BQU8sQ0FBQztnQkFDakIsQ0FBQztnQkFFTSxRQUFRO29CQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsQ0FBQzthQUNGLENBQUEifQ==