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
    var __moduleName = context_1 && context_1.id;
    var b2Timer, b2Counter;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJUaW1lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyVGltZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7O1lBRUYsZ0VBQWdFO1lBQ2hFLCtCQUErQjtZQUMvQixVQUFBO2dCQUFBO29CQUNTLFlBQU8sR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBWXRDLENBQUM7Z0JBVkMsb0JBQW9CO2dCQUNiLEtBQUs7b0JBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzFCLE9BQU8sSUFBSSxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsc0RBQXNEO2dCQUMvQyxlQUFlO29CQUNwQixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNuQyxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxZQUFBO2dCQUFBO29CQUNTLFlBQU8sR0FBVyxDQUFDLENBQUM7b0JBQ3BCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixnQkFBVyxHQUFXLENBQUMsQ0FBQztnQkEyQ2pDLENBQUM7Z0JBekNRLFFBQVE7b0JBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUN0QixDQUFDO2dCQUVNLFdBQVc7b0JBQ2hCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDMUIsQ0FBQztnQkFFTSxXQUFXO29CQUNoQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQzFCLENBQUM7Z0JBRU0sVUFBVTtvQkFDZixNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDakIsT0FBTyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQztnQkFFTSxhQUFhO29CQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztnQkFFTSxhQUFhO29CQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztnQkFFTSxTQUFTO29CQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFZixJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRTt3QkFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO3FCQUNqQztnQkFDSCxDQUFDO2dCQUVNLFNBQVM7b0JBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUVmLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO3dCQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2pDO2dCQUNILENBQUM7YUFDRixDQUFBIn0=