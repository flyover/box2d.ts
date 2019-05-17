System.register(["../../Collision/Shapes/b2Shape", "./b2CircleContact", "./b2PolygonContact", "./b2PolygonAndCircleContact", "./b2EdgeAndCircleContact", "./b2EdgeAndPolygonContact", "./b2ChainAndCircleContact", "./b2ChainAndPolygonContact"], function (exports_1, context_1) {
    "use strict";
    var b2Shape_1, b2CircleContact_1, b2PolygonContact_1, b2PolygonAndCircleContact_1, b2EdgeAndCircleContact_1, b2EdgeAndPolygonContact_1, b2ChainAndCircleContact_1, b2ChainAndPolygonContact_1, b2ContactRegister, b2ContactFactory;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Shape_1_1) {
                b2Shape_1 = b2Shape_1_1;
            },
            function (b2CircleContact_1_1) {
                b2CircleContact_1 = b2CircleContact_1_1;
            },
            function (b2PolygonContact_1_1) {
                b2PolygonContact_1 = b2PolygonContact_1_1;
            },
            function (b2PolygonAndCircleContact_1_1) {
                b2PolygonAndCircleContact_1 = b2PolygonAndCircleContact_1_1;
            },
            function (b2EdgeAndCircleContact_1_1) {
                b2EdgeAndCircleContact_1 = b2EdgeAndCircleContact_1_1;
            },
            function (b2EdgeAndPolygonContact_1_1) {
                b2EdgeAndPolygonContact_1 = b2EdgeAndPolygonContact_1_1;
            },
            function (b2ChainAndCircleContact_1_1) {
                b2ChainAndCircleContact_1 = b2ChainAndCircleContact_1_1;
            },
            function (b2ChainAndPolygonContact_1_1) {
                b2ChainAndPolygonContact_1 = b2ChainAndPolygonContact_1_1;
            }
        ],
        execute: function () {
            b2ContactRegister = class b2ContactRegister {
                constructor() {
                    this.pool = [];
                    this.createFcn = null;
                    this.destroyFcn = null;
                    this.primary = false;
                }
            };
            exports_1("b2ContactRegister", b2ContactRegister);
            b2ContactFactory = class b2ContactFactory {
                constructor() {
                    this.m_registers = [];
                    this.InitializeRegisters();
                }
                AddType(createFcn, destroyFcn, typeA, typeB) {
                    const pool = [];
                    function poolCreateFcn() {
                        return pool.pop() || createFcn();
                    }
                    function poolDestroyFcn(contact) {
                        pool.push(contact);
                    }
                    this.m_registers[typeA][typeB].pool = pool;
                    this.m_registers[typeA][typeB].createFcn = poolCreateFcn; // createFcn;
                    this.m_registers[typeA][typeB].destroyFcn = poolDestroyFcn; // destroyFcn;
                    this.m_registers[typeA][typeB].primary = true;
                    if (typeA !== typeB) {
                        this.m_registers[typeB][typeA].pool = pool;
                        this.m_registers[typeB][typeA].createFcn = poolCreateFcn; // createFcn;
                        this.m_registers[typeB][typeA].destroyFcn = poolDestroyFcn; // destroyFcn;
                        this.m_registers[typeB][typeA].primary = false;
                    }
                }
                InitializeRegisters() {
                    for (let i = 0; i < b2Shape_1.b2ShapeType.e_shapeTypeCount; i++) {
                        this.m_registers[i] = [];
                        for (let j = 0; j < b2Shape_1.b2ShapeType.e_shapeTypeCount; j++) {
                            this.m_registers[i][j] = new b2ContactRegister();
                        }
                    }
                    this.AddType(b2CircleContact_1.b2CircleContact.Create, b2CircleContact_1.b2CircleContact.Destroy, b2Shape_1.b2ShapeType.e_circleShape, b2Shape_1.b2ShapeType.e_circleShape);
                    this.AddType(b2PolygonAndCircleContact_1.b2PolygonAndCircleContact.Create, b2PolygonAndCircleContact_1.b2PolygonAndCircleContact.Destroy, b2Shape_1.b2ShapeType.e_polygonShape, b2Shape_1.b2ShapeType.e_circleShape);
                    this.AddType(b2PolygonContact_1.b2PolygonContact.Create, b2PolygonContact_1.b2PolygonContact.Destroy, b2Shape_1.b2ShapeType.e_polygonShape, b2Shape_1.b2ShapeType.e_polygonShape);
                    this.AddType(b2EdgeAndCircleContact_1.b2EdgeAndCircleContact.Create, b2EdgeAndCircleContact_1.b2EdgeAndCircleContact.Destroy, b2Shape_1.b2ShapeType.e_edgeShape, b2Shape_1.b2ShapeType.e_circleShape);
                    this.AddType(b2EdgeAndPolygonContact_1.b2EdgeAndPolygonContact.Create, b2EdgeAndPolygonContact_1.b2EdgeAndPolygonContact.Destroy, b2Shape_1.b2ShapeType.e_edgeShape, b2Shape_1.b2ShapeType.e_polygonShape);
                    this.AddType(b2ChainAndCircleContact_1.b2ChainAndCircleContact.Create, b2ChainAndCircleContact_1.b2ChainAndCircleContact.Destroy, b2Shape_1.b2ShapeType.e_chainShape, b2Shape_1.b2ShapeType.e_circleShape);
                    this.AddType(b2ChainAndPolygonContact_1.b2ChainAndPolygonContact.Create, b2ChainAndPolygonContact_1.b2ChainAndPolygonContact.Destroy, b2Shape_1.b2ShapeType.e_chainShape, b2Shape_1.b2ShapeType.e_polygonShape);
                }
                Create(fixtureA, indexA, fixtureB, indexB) {
                    const typeA = fixtureA.GetType();
                    const typeB = fixtureB.GetType();
                    // DEBUG: b2Assert(0 <= typeA && typeA < b2ShapeType.e_shapeTypeCount);
                    // DEBUG: b2Assert(0 <= typeB && typeB < b2ShapeType.e_shapeTypeCount);
                    const reg = this.m_registers[typeA][typeB];
                    if (reg.createFcn) {
                        const c = reg.createFcn();
                        if (reg.primary) {
                            c.Reset(fixtureA, indexA, fixtureB, indexB);
                        }
                        else {
                            c.Reset(fixtureB, indexB, fixtureA, indexA);
                        }
                        return c;
                    }
                    else {
                        return null;
                    }
                }
                Destroy(contact) {
                    const typeA = contact.m_fixtureA.GetType();
                    const typeB = contact.m_fixtureB.GetType();
                    // DEBUG: b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);
                    // DEBUG: b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);
                    const reg = this.m_registers[typeA][typeB];
                    if (reg.destroyFcn) {
                        reg.destroyFcn(contact);
                    }
                }
            };
            exports_1("b2ContactFactory", b2ContactFactory);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0RmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29udGFjdEZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFZQSxvQkFBQSxNQUFhLGlCQUFpQjtnQkFBOUI7b0JBQ1MsU0FBSSxHQUFnQixFQUFFLENBQUM7b0JBQ3ZCLGNBQVMsR0FBNkIsSUFBSSxDQUFDO29CQUMzQyxlQUFVLEdBQTBDLElBQUksQ0FBQztvQkFDekQsWUFBTyxHQUFZLEtBQUssQ0FBQztnQkFDbEMsQ0FBQzthQUFBLENBQUE7O1lBRUQsbUJBQUEsTUFBYSxnQkFBZ0I7Z0JBRzNCO29CQUZnQixnQkFBVyxHQUEwQixFQUFFLENBQUM7b0JBR3RELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUM3QixDQUFDO2dCQUVPLE9BQU8sQ0FBQyxTQUEwQixFQUFFLFVBQXdDLEVBQUUsS0FBa0IsRUFBRSxLQUFrQjtvQkFDMUgsTUFBTSxJQUFJLEdBQWdCLEVBQUUsQ0FBQztvQkFFN0IsU0FBUyxhQUFhO3dCQUNwQixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDbkMsQ0FBQztvQkFFRCxTQUFTLGNBQWMsQ0FBQyxPQUFrQjt3QkFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckIsQ0FBQztvQkFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLGFBQWE7b0JBQ3ZFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxDQUFDLGNBQWM7b0JBQzFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztvQkFFOUMsSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO3dCQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxDQUFDLGFBQWE7d0JBQ3ZFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxDQUFDLGNBQWM7d0JBQzFFLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztxQkFDaEQ7Z0JBQ0gsQ0FBQztnQkFFTyxtQkFBbUI7b0JBQ3pCLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxxQkFBVyxDQUFDLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUM3RCxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFDekIsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLHFCQUFXLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQzdELElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO3lCQUNsRDtxQkFDRjtvQkFFRCxJQUFJLENBQUMsT0FBTyxDQUFXLGlDQUFlLENBQUMsTUFBTSxFQUFZLGlDQUFlLENBQUMsT0FBTyxFQUFFLHFCQUFXLENBQUMsYUFBYSxFQUFHLHFCQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3pJLElBQUksQ0FBQyxPQUFPLENBQUMscURBQXlCLENBQUMsTUFBTSxFQUFFLHFEQUF5QixDQUFDLE9BQU8sRUFBRSxxQkFBVyxDQUFDLGNBQWMsRUFBRSxxQkFBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUN6SSxJQUFJLENBQUMsT0FBTyxDQUFVLG1DQUFnQixDQUFDLE1BQU0sRUFBVyxtQ0FBZ0IsQ0FBQyxPQUFPLEVBQUUscUJBQVcsQ0FBQyxjQUFjLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDMUksSUFBSSxDQUFDLE9BQU8sQ0FBSSwrQ0FBc0IsQ0FBQyxNQUFNLEVBQUssK0NBQXNCLENBQUMsT0FBTyxFQUFFLHFCQUFXLENBQUMsV0FBVyxFQUFLLHFCQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3pJLElBQUksQ0FBQyxPQUFPLENBQUcsaURBQXVCLENBQUMsTUFBTSxFQUFJLGlEQUF1QixDQUFDLE9BQU8sRUFBRSxxQkFBVyxDQUFDLFdBQVcsRUFBSyxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUMxSSxJQUFJLENBQUMsT0FBTyxDQUFHLGlEQUF1QixDQUFDLE1BQU0sRUFBSSxpREFBdUIsQ0FBQyxPQUFPLEVBQUUscUJBQVcsQ0FBQyxZQUFZLEVBQUkscUJBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDekksSUFBSSxDQUFDLE9BQU8sQ0FBRSxtREFBd0IsQ0FBQyxNQUFNLEVBQUcsbURBQXdCLENBQUMsT0FBTyxFQUFFLHFCQUFXLENBQUMsWUFBWSxFQUFJLHFCQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzVJLENBQUM7Z0JBRU0sTUFBTSxDQUFDLFFBQW1CLEVBQUUsTUFBYyxFQUFFLFFBQW1CLEVBQUUsTUFBYztvQkFDcEYsTUFBTSxLQUFLLEdBQWdCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDOUMsTUFBTSxLQUFLLEdBQWdCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFFOUMsdUVBQXVFO29CQUN2RSx1RUFBdUU7b0JBRXZFLE1BQU0sR0FBRyxHQUFzQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5RCxJQUFJLEdBQUcsQ0FBQyxTQUFTLEVBQUU7d0JBQ2pCLE1BQU0sQ0FBQyxHQUFjLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDckMsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFOzRCQUNmLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7eUJBQzdDOzZCQUFNOzRCQUNMLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7eUJBQzdDO3dCQUNELE9BQU8sQ0FBQyxDQUFDO3FCQUNWO3lCQUFNO3dCQUNMLE9BQU8sSUFBSSxDQUFDO3FCQUNiO2dCQUNILENBQUM7Z0JBRU0sT0FBTyxDQUFDLE9BQWtCO29CQUMvQixNQUFNLEtBQUssR0FBZ0IsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDeEQsTUFBTSxLQUFLLEdBQWdCLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBRXhELHVFQUF1RTtvQkFDdkUsdUVBQXVFO29CQUV2RSxNQUFNLEdBQUcsR0FBc0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDOUQsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO3dCQUNsQixHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN6QjtnQkFDSCxDQUFDO2FBQ0YsQ0FBQSJ9