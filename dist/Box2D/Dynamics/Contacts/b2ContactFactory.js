System.register(["../../Common/b2Settings", "../../Collision/Shapes/b2Shape", "./b2CircleContact", "./b2PolygonContact", "./b2PolygonAndCircleContact", "./b2EdgeAndCircleContact", "./b2EdgeAndPolygonContact", "./b2ChainAndCircleContact", "./b2ChainAndPolygonContact"], function (exports_1, context_1) {
    "use strict";
    var b2Settings_1, b2Shape_1, b2CircleContact_1, b2PolygonContact_1, b2PolygonAndCircleContact_1, b2EdgeAndCircleContact_1, b2EdgeAndPolygonContact_1, b2ChainAndCircleContact_1, b2ChainAndPolygonContact_1, b2ContactRegister, b2ContactFactory;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
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
                    // public pool: b2Contact[];
                    this.createFcn = null;
                    this.destroyFcn = null;
                    this.primary = false;
                }
            };
            exports_1("b2ContactRegister", b2ContactRegister);
            b2ContactFactory = class b2ContactFactory {
                constructor(allocator) {
                    this.m_allocator = null;
                    this.m_allocator = allocator;
                    this.InitializeRegisters();
                }
                AddType(createFcn, destroyFcn, type1, type2) {
                    const pool = b2Settings_1.b2MakeArray(256, (i) => createFcn(this.m_allocator)); // TODO: b2Settings
                    function poolCreateFcn(allocator) {
                        // if (pool.length > 0) {
                        //   return pool.pop();
                        // }
                        // return createFcn(allocator);
                        return pool.pop() || createFcn(allocator);
                    }
                    function poolDestroyFcn(contact, allocator) {
                        pool.push(contact);
                    }
                    // this.m_registers[type1][type2].pool = pool;
                    this.m_registers[type1][type2].createFcn = poolCreateFcn;
                    this.m_registers[type1][type2].destroyFcn = poolDestroyFcn;
                    this.m_registers[type1][type2].primary = true;
                    if (type1 !== type2) {
                        // this.m_registers[type2][type1].pool = pool;
                        this.m_registers[type2][type1].createFcn = poolCreateFcn;
                        this.m_registers[type2][type1].destroyFcn = poolDestroyFcn;
                        this.m_registers[type2][type1].primary = false;
                    }
                    /*
                    this.m_registers[type1][type2].createFcn = createFcn;
                    this.m_registers[type1][type2].destroyFcn = destroyFcn;
                    this.m_registers[type1][type2].primary = true;
                
                    if (type1 !== type2) {
                      this.m_registers[type2][type1].createFcn = createFcn;
                      this.m_registers[type2][type1].destroyFcn = destroyFcn;
                      this.m_registers[type2][type1].primary = false;
                    }
                    */
                }
                InitializeRegisters() {
                    this.m_registers = [ /*b2ShapeType.e_shapeTypeCount*/];
                    for (let i = 0; i < b2Shape_1.b2ShapeType.e_shapeTypeCount; i++) {
                        this.m_registers[i] = [ /*b2ShapeType.e_shapeTypeCount*/];
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
                    const type1 = fixtureA.GetType();
                    const type2 = fixtureB.GetType();
                    // DEBUG: b2Assert(0 <= type1 && type1 < b2ShapeType.e_shapeTypeCount);
                    // DEBUG: b2Assert(0 <= type2 && type2 < b2ShapeType.e_shapeTypeCount);
                    const reg = this.m_registers[type1][type2];
                    if (reg.createFcn) {
                        const c = reg.createFcn(this.m_allocator);
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
                    const fixtureA = contact.m_fixtureA;
                    const fixtureB = contact.m_fixtureB;
                    if (contact.m_manifold.pointCount > 0 &&
                        !fixtureA.IsSensor() &&
                        !fixtureB.IsSensor()) {
                        fixtureA.GetBody().SetAwake(true);
                        fixtureB.GetBody().SetAwake(true);
                    }
                    const typeA = fixtureA.GetType();
                    const typeB = fixtureB.GetType();
                    // DEBUG: b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);
                    // DEBUG: b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);
                    const reg = this.m_registers[typeA][typeB];
                    if (reg.destroyFcn) {
                        reg.destroyFcn(contact, this.m_allocator);
                    }
                }
            };
            exports_1("b2ContactFactory", b2ContactFactory);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0RmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0JveDJEL0R5bmFtaWNzL0NvbnRhY3RzL2IyQ29udGFjdEZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFhQSxvQkFBQTtnQkFBQTtvQkFDRSw0QkFBNEI7b0JBQ3JCLGNBQVMsR0FBMkMsSUFBSSxDQUFDO29CQUN6RCxlQUFVLEdBQTBELElBQUksQ0FBQztvQkFDekUsWUFBTyxHQUFZLEtBQUssQ0FBQztnQkFDbEMsQ0FBQzthQUFBLENBQUE7O1lBRUQsbUJBQUE7Z0JBSUUsWUFBWSxTQUFjO29CQUhuQixnQkFBVyxHQUFRLElBQUksQ0FBQztvQkFJN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7b0JBQzdCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUM3QixDQUFDO2dCQUVPLE9BQU8sQ0FBQyxTQUF3QyxFQUFFLFVBQXdELEVBQUUsS0FBa0IsRUFBRSxLQUFrQjtvQkFDeEosTUFBTSxJQUFJLEdBQWdCLHdCQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7b0JBRTNHLHVCQUF1QixTQUFjO3dCQUNuQyx5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsSUFBSTt3QkFFSiwrQkFBK0I7d0JBQy9CLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDNUMsQ0FBQztvQkFFRCx3QkFBd0IsT0FBa0IsRUFBRSxTQUFjO3dCQUN4RCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyQixDQUFDO29CQUVELDhDQUE4QztvQkFDOUMsSUFBSSxDQUFDLFdBQVcs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