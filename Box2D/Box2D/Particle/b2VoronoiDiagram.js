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
System.register(["../Common/b2Settings", "../Common/b2Math", "./b2StackQueue"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function b2Assert(condition) { }
    var b2Settings_1, b2Math_1, b2StackQueue_1, b2VoronoiDiagram;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2StackQueue_1_1) {
                b2StackQueue_1 = b2StackQueue_1_1;
            }
        ],
        execute: function () {
            /**
             * A field representing the nearest generator from each point.
             */
            b2VoronoiDiagram = class b2VoronoiDiagram {
                constructor(generatorCapacity) {
                    this.m_generatorBuffer = null;
                    this.m_generatorCapacity = 0;
                    this.m_generatorCount = 0;
                    this.m_countX = 0;
                    this.m_countY = 0;
                    this.m_diagram = null;
                    this.m_generatorBuffer = b2Settings_1.b2MakeArray(generatorCapacity, function (index) {
                        return new b2VoronoiDiagram.Generator();
                    });
                    this.m_generatorCapacity = generatorCapacity;
                }
                /**
                 * Add a generator.
                 *
                 * @param center the position of the generator.
                 * @param tag a tag used to identify the generator in callback functions.
                 * @param necessary whether to callback for nodes associated with the generator.
                 */
                AddGenerator(center, tag, necessary) {
                    b2Assert(this.m_generatorCount < this.m_generatorCapacity);
                    let g = this.m_generatorBuffer[this.m_generatorCount++];
                    g.center.Copy(center);
                    g.tag = tag;
                    g.necessary = necessary;
                }
                /**
                 * Generate the Voronoi diagram. It is rasterized with a given
                 * interval in the same range as the necessary generators exist.
                 *
                 * @param radius the interval of the diagram.
                 * @param margin margin for which the range of the diagram is extended.
                 */
                Generate(radius, margin) {
                    b2Assert(this.m_diagram === null);
                    let inverseRadius = 1 / radius;
                    let lower = new b2Math_1.b2Vec2(+b2Settings_1.b2_maxFloat, +b2Settings_1.b2_maxFloat);
                    let upper = new b2Math_1.b2Vec2(-b2Settings_1.b2_maxFloat, -b2Settings_1.b2_maxFloat);
                    let necessary_count = 0;
                    for (let k = 0; k < this.m_generatorCount; k++) {
                        let g = this.m_generatorBuffer[k];
                        if (g.necessary) {
                            b2Math_1.b2Vec2.MinV(lower, g.center, lower);
                            b2Math_1.b2Vec2.MaxV(upper, g.center, upper);
                            ++necessary_count;
                        }
                    }
                    if (necessary_count === 0) {
                        ///debugger;
                        this.m_countX = 0;
                        this.m_countY = 0;
                        return;
                    }
                    lower.x -= margin;
                    lower.y -= margin;
                    upper.x += margin;
                    upper.y += margin;
                    this.m_countX = 1 + Math.floor(inverseRadius * (upper.x - lower.x));
                    this.m_countY = 1 + Math.floor(inverseRadius * (upper.y - lower.y));
                    ///  m_diagram = (Generator**) m_allocator->Allocate(sizeof(Generator*) * m_countX * m_countY);
                    ///  for (int32 i = 0; i < m_countX * m_countY; i++)
                    ///  {
                    ///    m_diagram[i] = NULL;
                    ///  }
                    this.m_diagram = b2Settings_1.b2MakeArray(this.m_countX * this.m_countY, function (index) { return null; });
                    // (4 * m_countX * m_countY) is the queue capacity that is experimentally
                    // known to be necessary and sufficient for general particle distributions.
                    let queue = new b2StackQueue_1.b2StackQueue(4 * this.m_countX * this.m_countY);
                    for (let k = 0; k < this.m_generatorCount; k++) {
                        let g = this.m_generatorBuffer[k];
                        ///  g.center = inverseRadius * (g.center - lower);
                        g.center.SelfSub(lower).SelfMul(inverseRadius);
                        let x = Math.floor(g.center.x);
                        let y = Math.floor(g.center.y);
                        if (x >= 0 && y >= 0 && x < this.m_countX && y < this.m_countY) {
                            queue.Push(new b2VoronoiDiagram.Task(x, y, x + y * this.m_countX, g));
                        }
                    }
                    while (!queue.Empty()) {
                        let task = queue.Front();
                        let x = task.m_x;
                        let y = task.m_y;
                        let i = task.m_i;
                        let g = task.m_generator;
                        queue.Pop();
                        if (!this.m_diagram[i]) {
                            this.m_diagram[i] = g;
                            if (x > 0) {
                                queue.Push(new b2VoronoiDiagram.Task(x - 1, y, i - 1, g));
                            }
                            if (y > 0) {
                                queue.Push(new b2VoronoiDiagram.Task(x, y - 1, i - this.m_countX, g));
                            }
                            if (x < this.m_countX - 1) {
                                queue.Push(new b2VoronoiDiagram.Task(x + 1, y, i + 1, g));
                            }
                            if (y < this.m_countY - 1) {
                                queue.Push(new b2VoronoiDiagram.Task(x, y + 1, i + this.m_countX, g));
                            }
                        }
                    }
                    for (let y = 0; y < this.m_countY; y++) {
                        for (let x = 0; x < this.m_countX - 1; x++) {
                            let i = x + y * this.m_countX;
                            let a = this.m_diagram[i];
                            let b = this.m_diagram[i + 1];
                            if (a !== b) {
                                queue.Push(new b2VoronoiDiagram.Task(x, y, i, b));
                                queue.Push(new b2VoronoiDiagram.Task(x + 1, y, i + 1, a));
                            }
                        }
                    }
                    for (let y = 0; y < this.m_countY - 1; y++) {
                        for (let x = 0; x < this.m_countX; x++) {
                            let i = x + y * this.m_countX;
                            let a = this.m_diagram[i];
                            let b = this.m_diagram[i + this.m_countX];
                            if (a !== b) {
                                queue.Push(new b2VoronoiDiagram.Task(x, y, i, b));
                                queue.Push(new b2VoronoiDiagram.Task(x, y + 1, i + this.m_countX, a));
                            }
                        }
                    }
                    while (!queue.Empty()) {
                        let task = queue.Front();
                        let x = task.m_x;
                        let y = task.m_y;
                        let i = task.m_i;
                        let k = task.m_generator;
                        queue.Pop();
                        let a = this.m_diagram[i];
                        let b = k;
                        if (a !== b) {
                            let ax = a.center.x - x;
                            let ay = a.center.y - y;
                            let bx = b.center.x - x;
                            let by = b.center.y - y;
                            let a2 = ax * ax + ay * ay;
                            let b2 = bx * bx + by * by;
                            if (a2 > b2) {
                                this.m_diagram[i] = b;
                                if (x > 0) {
                                    queue.Push(new b2VoronoiDiagram.Task(x - 1, y, i - 1, b));
                                }
                                if (y > 0) {
                                    queue.Push(new b2VoronoiDiagram.Task(x, y - 1, i - this.m_countX, b));
                                }
                                if (x < this.m_countX - 1) {
                                    queue.Push(new b2VoronoiDiagram.Task(x + 1, y, i + 1, b));
                                }
                                if (y < this.m_countY - 1) {
                                    queue.Push(new b2VoronoiDiagram.Task(x, y + 1, i + this.m_countX, b));
                                }
                            }
                        }
                    }
                }
                /**
                 * Enumerate all nodes that contain at least one necessary
                 * generator.
                 */
                GetNodes(callback) {
                    for (let y = 0; y < this.m_countY - 1; y++) {
                        for (let x = 0; x < this.m_countX - 1; x++) {
                            let i = x + y * this.m_countX;
                            let a = this.m_diagram[i];
                            let b = this.m_diagram[i + 1];
                            let c = this.m_diagram[i + this.m_countX];
                            let d = this.m_diagram[i + 1 + this.m_countX];
                            if (b !== c) {
                                if (a !== b && a !== c &&
                                    (a.necessary || b.necessary || c.necessary)) {
                                    callback(a.tag, b.tag, c.tag);
                                }
                                if (d !== b && d !== c &&
                                    (a.necessary || b.necessary || c.necessary)) {
                                    callback(b.tag, d.tag, c.tag);
                                }
                            }
                        }
                    }
                }
            };
            exports_1("b2VoronoiDiagram", b2VoronoiDiagram);
            (function (b2VoronoiDiagram) {
                class Generator {
                    constructor() {
                        this.center = new b2Math_1.b2Vec2();
                        this.tag = 0;
                        this.necessary = false;
                    }
                }
                b2VoronoiDiagram.Generator = Generator;
                class Task {
                    constructor(x, y, i, g) {
                        this.m_x = 0;
                        this.m_y = 0;
                        this.m_i = 0;
                        this.m_generator = null;
                        this.m_x = x;
                        this.m_y = y;
                        this.m_i = i;
                        this.m_generator = g;
                    }
                }
                b2VoronoiDiagram.Task = Task;
            })(b2VoronoiDiagram || (b2VoronoiDiagram = {})); // namespace b2VoronoiDiagram
            exports_1("b2VoronoiDiagram", b2VoronoiDiagram);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJWb3Jvbm9pRGlhZ3JhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyVm9yb25vaURpYWdyYW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7Ozs7SUFRSCxrQkFBa0IsU0FBa0IsSUFBRyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7WUFFeEM7O2VBRUc7WUFDSCxtQkFBQTtnQkFRRSxZQUFZLGlCQUF5QjtvQkFQckMsc0JBQWlCLEdBQWlDLElBQUksQ0FBQztvQkFDdkQsd0JBQW1CLEdBQUcsQ0FBQyxDQUFDO29CQUN4QixxQkFBZ0IsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLGFBQVEsR0FBRyxDQUFDLENBQUM7b0JBQ2IsYUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDYixjQUFTLEdBQWlDLElBQUksQ0FBQztvQkFHN0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLHdCQUFXLENBQUMsaUJBQWlCLEVBQUUsVUFBUyxLQUFLO3dCQUNwRSxPQUFPLElBQUksZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzFDLENBQUMsQ0FBQyxDQUFDO29CQUNILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQztnQkFDL0MsQ0FBQztnQkFFRDs7Ozs7O21CQU1HO2dCQUNILFlBQVksQ0FBQyxNQUFjLEVBQUUsR0FBVyxFQUFFLFNBQWtCO29CQUMxRCxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO29CQUMzRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztvQkFDeEQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3RCLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO29CQUNaLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO2dCQUMxQixDQUFDO2dCQUVEOzs7Ozs7bUJBTUc7Z0JBQ0gsUUFBUSxDQUFDLE1BQWMsRUFBRSxNQUFjO29CQUNyQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDL0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFNLENBQUMsQ0FBQyx3QkFBVyxFQUFFLENBQUMsd0JBQVcsQ0FBQyxDQUFDO29CQUNuRCxJQUFJLEtBQUssR0FBRyxJQUFJLGVBQU0sQ0FBQyxDQUFDLHdCQUFXLEVBQUUsQ0FBQyx3QkFBVyxDQUFDLENBQUM7b0JBQ25ELElBQUksZUFBZSxHQUFHLENBQUMsQ0FBQztvQkFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDOUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUU7NEJBQ2YsZUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDcEMsZUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzs0QkFDcEMsRUFBRSxlQUFlLENBQUM7eUJBQ25CO3FCQUNGO29CQUNELElBQUksZUFBZSxLQUFLLENBQUMsRUFBRTt3QkFDekIsWUFBWTt3QkFDWixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7d0JBQ2xCLE9BQU87cUJBQ1I7b0JBQ0QsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7b0JBQ2xCLEtBQUssQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDO29CQUNsQixLQUFLLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQztvQkFDbEIsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwRSwrRkFBK0Y7b0JBQy9GLG9EQUFvRDtvQkFDcEQsTUFBTTtvQkFDTiwyQkFBMkI7b0JBQzNCLE1BQU07b0JBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyx3QkFBVyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFTLEtBQUssSUFBSSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU5Rix5RUFBeUU7b0JBQ3pFLDJFQUEyRTtvQkFDM0UsSUFBSSxLQUFLLEdBQUcsSUFBSSwyQkFBWSxDQUF3QixDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3ZGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzlDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEMsbURBQW1EO3dCQUNuRCxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQy9DLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDOUQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN2RTtxQkFDRjtvQkFDRCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFO3dCQUNyQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQ3pCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQ0FDVCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDM0Q7NEJBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dDQUNULEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDdkU7NEJBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7Z0NBQ3pCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUMzRDs0QkFDRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtnQ0FDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUN2RTt5QkFDRjtxQkFDRjtvQkFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUMxQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7NEJBQzlCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzFCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQ1gsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNsRCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDM0Q7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzRCQUM5QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQ0FDWCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ2xELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDdkU7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRTt3QkFDckIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUN6QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO3dCQUNqQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO3dCQUNqQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO3dCQUNqQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3dCQUN6QixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ1osSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTs0QkFDWCxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ3hCLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDeEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUN4QixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ3hCLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQzs0QkFDM0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDOzRCQUMzQixJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0NBQ1gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQ0FDVCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDM0Q7Z0NBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29DQUNULEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDdkU7Z0NBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7b0NBQ3pCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lDQUMzRDtnQ0FDRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtvQ0FDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lDQUN2RTs2QkFDRjt5QkFDRjtxQkFDRjtnQkFDSCxDQUFDO2dCQUVEOzs7bUJBR0c7Z0JBQ0gsUUFBUSxDQUFDLFFBQXVDO29CQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDOzRCQUM5QixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDOUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUMxQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzRCQUM5QyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0NBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO29DQUNwQixDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUU7b0NBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lDQUMvQjtnQ0FDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7b0NBQ3BCLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQ0FDN0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7aUNBQy9COzZCQUNGO3lCQUNGO3FCQUNGO2dCQUNILENBQUM7YUFDRixDQUFBOztZQUVELFdBQWlCLGdCQUFnQjtnQkFTakM7b0JBQUE7d0JBQ0UsV0FBTSxHQUFXLElBQUksZUFBTSxFQUFFLENBQUM7d0JBQzlCLFFBQUcsR0FBVyxDQUFDLENBQUM7d0JBQ2hCLGNBQVMsR0FBWSxLQUFLLENBQUM7b0JBQzdCLENBQUM7aUJBQUE7Z0JBSlksMEJBQVMsWUFJckIsQ0FBQTtnQkFFRDtvQkFLRSxZQUFZLENBQVMsRUFBRSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQTZCO3dCQUoxRSxRQUFHLEdBQVcsQ0FBQyxDQUFDO3dCQUNoQixRQUFHLEdBQVcsQ0FBQyxDQUFDO3dCQUNoQixRQUFHLEdBQVcsQ0FBQyxDQUFDO3dCQUNoQixnQkFBVyxHQUErQixJQUFJLENBQUM7d0JBRTdDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUNiLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO3dCQUNiLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixDQUFDO2lCQUNGO2dCQVhZLHFCQUFJLE9BV2hCLENBQUE7WUFFRCxDQUFDLEVBNUJnQixnQkFBZ0IsS0FBaEIsZ0JBQWdCLFFBNEJoQyxDQUFDLDZCQUE2QiJ9