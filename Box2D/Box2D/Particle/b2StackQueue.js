/*
 * Copyright (c) 2013 Google, Inc.
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
System.register(["../Common/b2Settings"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function b2Assert(condition) { }
    var b2Settings_1, b2StackQueue;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            }
        ],
        execute: function () {
            b2StackQueue = class b2StackQueue {
                constructor(capacity) {
                    this.m_front = 0;
                    this.m_back = 0;
                    this.m_capacity = 0;
                    this.m_buffer = b2Settings_1.b2MakeArray(capacity, function (index) { return null; });
                    ///this.m_end = capacity; // TODO: this was wrong!
                    this.m_capacity = capacity;
                }
                Push(item) {
                    if (this.m_back >= this.m_capacity) {
                        for (let i = this.m_front; i < this.m_back; i++) {
                            this.m_buffer[i - this.m_front] = this.m_buffer[i];
                        }
                        this.m_back -= this.m_front;
                        this.m_front = 0;
                        if (this.m_back >= this.m_capacity) {
                            if (this.m_capacity > 0) {
                                this.m_buffer.concat(b2Settings_1.b2MakeArray(this.m_capacity, function (index) { return null; }));
                                this.m_capacity *= 2;
                            }
                            else {
                                this.m_buffer.concat(b2Settings_1.b2MakeArray(1, function (index) { return null; }));
                                this.m_capacity = 1;
                            }
                            ///m_buffer = (T*) m_allocator->Reallocate(m_buffer, sizeof(T) * m_capacity);
                        }
                    }
                    this.m_buffer[this.m_back] = item;
                    this.m_back++;
                }
                Pop() {
                    b2Assert(this.m_front < this.m_back);
                    delete this.m_buffer[this.m_front];
                    this.m_front++;
                }
                Empty() {
                    b2Assert(this.m_front <= this.m_back);
                    return this.m_front === this.m_back;
                }
                Front() {
                    return this.m_buffer[this.m_front];
                }
            };
            exports_1("b2StackQueue", b2StackQueue);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJTdGFja1F1ZXVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJTdGFja1F1ZXVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHOzs7O0lBTUgsa0JBQWtCLFNBQWtCLElBQUcsQ0FBQzs7Ozs7Ozs7O1lBRXhDLGVBQUE7Z0JBS0UsWUFBWSxRQUFnQjtvQkFINUIsWUFBTyxHQUFXLENBQUMsQ0FBQztvQkFDcEIsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsZUFBVSxHQUFXLENBQUMsQ0FBQztvQkFFckIsSUFBSSxDQUFDLFFBQVEsR0FBRyx3QkFBVyxDQUFDLFFBQVEsRUFBRSxVQUFTLEtBQUssSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4RSxrREFBa0Q7b0JBQ2xELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO2dCQUM3QixDQUFDO2dCQUNELElBQUksQ0FBQyxJQUFPO29CQUNWLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUNsQyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwRDt3QkFDRCxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTs0QkFDbEMsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtnQ0FDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsd0JBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVMsS0FBSyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDckYsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7NkJBQ3RCO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLHdCQUFXLENBQUMsQ0FBQyxFQUFFLFVBQVMsS0FBSyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDdkUsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7NkJBQ3JCOzRCQUNELDZFQUE2RTt5QkFDOUU7cUJBQ0Y7b0JBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNsQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQ0QsR0FBRztvQkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3JDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ25DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFDRCxLQUFLO29CQUNILFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEMsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3RDLENBQUM7Z0JBQ0QsS0FBSztvQkFDSCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2FBQ0YsQ0FBQSJ9