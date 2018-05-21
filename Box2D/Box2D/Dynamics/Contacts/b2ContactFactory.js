System.register(["../../Common/b2Settings", "./b2CircleContact", "./b2PolygonContact", "./b2PolygonAndCircleContact", "./b2EdgeAndCircleContact", "./b2EdgeAndPolygonContact", "./b2ChainAndCircleContact", "./b2ChainAndPolygonContact"], function (exports_1, context_1) {
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
