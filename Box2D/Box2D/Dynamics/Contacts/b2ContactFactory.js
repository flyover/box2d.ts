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
                    this.m_registers = new Array(b2Shape_1.b2ShapeType.e_shapeTypeCount);
                    this.m_allocator = allocator;
                    this.InitializeRegisters();
                }
                AddType(createFcn, destroyFcn, type1, type2) {
                    const pool = b2Settings_1.b2MakeArray(256, (i) => createFcn(this.m_allocator)); // TODO: b2Settings
                    function poolCreateFcn(allocator) {
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
                    for (let i = 0; i < b2Shape_1.b2ShapeType.e_shapeTypeCount; i++) {
                        this.m_registers[i] = new Array(b2Shape_1.b2ShapeType.e_shapeTypeCount);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb250YWN0RmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyQ29udGFjdEZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFhQSxvQkFBQTtnQkFBQTtvQkFDRSw0QkFBNEI7b0JBQ3JCLGNBQVMsR0FBMkMsSUFBSSxDQUFDO29CQUN6RCxlQUFVLEdBQTBELElBQUksQ0FBQztvQkFDekUsWUFBTyxHQUFZLEtBQUssQ0FBQztnQkFDbEMsQ0FBQzthQUFBLENBQUE7O1lBRUQsbUJBQUE7Z0JBSUUsWUFBWSxTQUFjO29CQUhuQixnQkFBVyxHQUFRLElBQUksQ0FBQztvQkFDZixnQkFBVyxHQUEwQixJQUFJLEtBQUssQ0FBQyxxQkFBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBRzNGLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO29CQUM3QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQztnQkFFTyxPQUFPLENBQUMsU0FBd0MsRUFBRSxVQUF3RCxFQUFFLEtBQWtCLEVBQUUsS0FBa0I7b0JBQ3hKLE1BQU0sSUFBSSxHQUFnQix3QkFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CO29CQUUzRyx1QkFBdUIsU0FBYzt3QkFDbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUM1QyxDQUFDO29CQUVELHdCQUF3QixPQUFrQixFQUFFLFNBQWM7d0JBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3JCLENBQUM7b0JBRUQsOENBQThDO29CQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FB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