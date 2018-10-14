/*
* Copyright (c) 2011 Erin Catto http://box2d.org
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
System.register([], function (exports_1, context_1) {
    "use strict";
    var b2Timer, b2Counter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /// Timer for profiling. This has platform specific code and may
            /// not work on every platform.
            b2Timer = class b2Timer {
                constructor() {
                    this.m_start = Date.now();
                }
                /// Reset the timer.
                Reset() {
                    this.m_start = Date.now();
                    return this;
                }
                /// Get the time since construction or the last reset.
                GetMilliseconds() {
                    return Date.now() - this.m_start;
                }
            };
            exports_1("b2Timer", b2Timer);
            b2Counter = class b2Counter {
                constructor() {
                    this.m_count = 0;
                    this.m_min_count = 0;
                    this.m_max_count = 0;
                }
                GetCount() {
                    return this.m_count;
                }
                GetMinCount() {
                    return this.m_min_count;
                }
                GetMaxCount() {
                    return this.m_max_count;
                }
                ResetCount() {
                    const count = this.m_count;
                    this.m_count = 0;
                    return count;
                }
                ResetMinCount() {
                    this.m_min_count = 0;
                }
                ResetMaxCount() {
                    this.m_max_count = 0;
                }
                Increment() {
                    this.m_count++;
                    if (this.m_max_count < this.m_count) {
                        this.m_max_count = this.m_count;
                    }
                }
                Decrement() {
                    this.m_count--;
                    if (this.m_min_count > this.m_count) {
                        this.m_min_count = this.m_count;
                    }
                }
            };
            exports_1("b2Counter", b2Counter);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJUaW1lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL0NvbW1vbi9iMlRpbWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7OztZQUVGLGdFQUFnRTtZQUNoRSwrQkFBK0I7WUFDL0IsVUFBQSxNQUFhLE9BQU87Z0JBQXBCO29CQUNTLFlBQU8sR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBWXRDLENBQUM7Z0JBVkMsb0JBQW9CO2dCQUNiLEtBQUs7b0JBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzFCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsc0RBQXNEO2dCQUMvQyxlQUFlO29CQUNwQixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNuQyxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxZQUFBLE1BQWEsU0FBUztnQkFBdEI7b0JBQ1MsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFDcEIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO2dCQTJDakMsQ0FBQztnQkF6Q1EsUUFBUTtvQkFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLENBQUM7Z0JBRU0sV0FBVztvQkFDaEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUMxQixDQUFDO2dCQUVNLFdBQVc7b0JBQ2hCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDMUIsQ0FBQztnQkFFTSxVQUFVO29CQUNmLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLEtBQUssQ0FBQztnQkFDZixDQUFDO2dCQUVNLGFBQWE7b0JBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2dCQUVNLGFBQWE7b0JBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO2dCQUVNLFNBQVM7b0JBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUVmLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2pDO2dCQUNILENBQUM7Z0JBRU0sU0FBUztvQkFDZCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRWYsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztxQkFDakM7Z0JBQ0gsQ0FBQzthQUNGLENBQUEifQ==