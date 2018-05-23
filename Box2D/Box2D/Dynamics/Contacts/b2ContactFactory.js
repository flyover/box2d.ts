System.register(["../../Common/b2Settings", "./b2CircleContact", "./b2PolygonContact", "./b2PolygonAndCircleContact", "./b2EdgeAndCircleContact", "./b2EdgeAndPolygonContact", "./b2ChainAndCircleContact", "./b2ChainAndPolygonContact"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var b2Settings_1, b2CircleContact_1, b2PolygonContact_1, b2PolygonAndCircleContact_1, b2EdgeAndCircleContact_1, b2EdgeAndPolygonContact_1, b2ChainAndCircleContact_1, b2ChainAndPolygonContact_1, b2ContactRegister, b2ContactFactory;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
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
                    this.pool = null;
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
                    const that = this;
                    const pool = b2Settings_1.b2MakeArray(256, function (i) { return createFcn(that.m_allocator); }); // TODO: b2Settings
                    function poolCreateFcn(allocator) {
                        if (pool.length > 0) {
                            return pool.pop();
                        }
                        return createFcn(allocator);
                    }
                    function poolDestroyFcn(contact, allocator) {
                        pool.push(contact);
                    }
                    this.m_registers[type1][type2].pool = pool;
                    this.m_registers[type1][type2].createFcn = poolCreateFcn;
                    this.m_registers[type1][type2].destroyFcn = poolDestroyFcn;
                    this.m_registers[type1][type2].primary = true;
                    if (type1 !== type2) {
                        this.m_registers[type2][type1].pool = pool;
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
                    for (let i = 0; i < 4 /* e_shapeTypeCount */; i++) {
                        this.m_registers[i] = [ /*b2ShapeType.e_shapeTypeCount*/];
                        for (let j = 0; j < 4 /* e_shapeTypeCount */; j++) {
                            this.m_registers[i][j] = new b2ContactRegister();
                        }
                    }
                    this.AddType(b2CircleContact_1.b2CircleContact.Create, b2CircleContact_1.b2CircleContact.Destroy, 0 /* e_circleShape */, 0 /* e_circleShape */);
                    this.AddType(b2PolygonAndCircleContact_1.b2PolygonAndCircleContact.Create, b2PolygonAndCircleContact_1.b2PolygonAndCircleContact.Destroy, 2 /* e_polygonShape */, 0 /* e_circleShape */);
                    this.AddType(b2PolygonContact_1.b2PolygonContact.Create, b2PolygonContact_1.b2PolygonContact.Destroy, 2 /* e_polygonShape */, 2 /* e_polygonShape */);
                    this.AddType(b2EdgeAndCircleContact_1.b2EdgeAndCircleContact.Create, b2EdgeAndCircleContact_1.b2EdgeAndCircleContact.Destroy, 1 /* e_edgeShape */, 0 /* e_circleShape */);
                    this.AddType(b2EdgeAndPolygonContact_1.b2EdgeAndPolygonContact.Create, b2EdgeAndPolygonContact_1.b2EdgeAndPolygonContact.Destroy, 1 /* e_edgeShape */, 2 /* e_polygonShape */);
                    this.AddType(b2ChainAndCircleContact_1.b2ChainAndCircleContact.Create, b2ChainAndCircleContact_1.b2ChainAndCircleContact.Destroy, 3 /* e_chainShape */, 0 /* e_circleShape */);
                    this.AddType(b2ChainAndPolygonContact_1.b2ChainAndPolygonContact.Create, b2ChainAndPolygonContact_1.b2ChainAndPolygonContact.Destroy, 3 /* e_chainShape */, 2 /* e_polygonShape */);
                }
                Create(fixtureA, indexA, fixtureB, indexB) {
                    const type1 = fixtureA.GetType();
                    const type2 = fixtureB.GetType();
                    ///b2Assert(0 <= type1 && type1 < b2ShapeType.e_shapeTypeCount);
                    ///b2Assert(0 <= type2 && type2 < b2ShapeType.e_shapeTypeCount);
                    const reg = this.m_registers[type1][type2];
                    const c = reg.createFcn(this.m_allocator);
                    if (reg.primary) {
                        c.Reset(fixtureA, indexA, fixtureB, indexB);
                    }
                    else {
                        c.Reset(fixtureB, indexB, fixtureA, indexA);
                    }
                    return c;
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
                    ///b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);
                    ///b2Assert(0 <= typeA && typeB < b2ShapeType.e_shapeTypeCount);
                    const reg = this.m_registers[typeA][typeB];
                    reg.destroyFcn(contact, this.m_allocator);
                }
            };
            exports_1("b2ContactFactory", b2ContactFactory);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0RmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29udGFjdEZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFZQSxvQkFBQTtnQkFBQTtvQkFDUyxTQUFJLEdBQWdCLElBQUksQ0FBQztvQkFDekIsY0FBUyxHQUFxQyxJQUFJLENBQUM7b0JBQ25ELGVBQVUsR0FBb0QsSUFBSSxDQUFDO29CQUNuRSxZQUFPLEdBQVksS0FBSyxDQUFDO2dCQUNsQyxDQUFDO2FBQUEsQ0FBQTs7WUFFRCxtQkFBQTtnQkFJRSxZQUFZLFNBQWM7b0JBSG5CLGdCQUFXLEdBQVEsSUFBSSxDQUFDO29CQUk3QixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBRU8sT0FBTyxDQUFDLFNBQXdDLEVBQUUsVUFBd0QsRUFBRSxLQUFrQixFQUFFLEtBQWtCO29CQUN4SixNQUFNLElBQUksR0FBcUIsSUFBSSxDQUFDO29CQUVwQyxNQUFNLElBQUksR0FBZ0Isd0JBQVcsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLElBQUksT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxtQkFBbUI7b0JBRXRILHVCQUF1QixTQUFjO3dCQUNuQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRCQUNuQixPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzt5QkFDbkI7d0JBRUQsT0FBTyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzlCLENBQUM7b0JBRUQsd0JBQXdCLE9BQWtCLEVBQUUsU0FBYzt3QkFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckIsQ0FBQztvQkFFRCxJQUFJ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