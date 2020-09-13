System.register(["../collision/b2_shape.js", "./b2_circle_contact.js", "./b2_polygon_contact.js", "./b2_polygon_circle_contact.js", "./b2_edge_circle_contact.js", "./b2_edge_polygon_contact.js", "./b2_chain_circle_contact.js", "./b2_chain_polygon_contact.js"], function (exports_1, context_1) {
    "use strict";
    var b2_shape_js_1, b2_circle_contact_js_1, b2_polygon_contact_js_1, b2_polygon_circle_contact_js_1, b2_edge_circle_contact_js_1, b2_edge_polygon_contact_js_1, b2_chain_circle_contact_js_1, b2_chain_polygon_contact_js_1, b2ContactRegister, b2ContactFactory;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_shape_js_1_1) {
                b2_shape_js_1 = b2_shape_js_1_1;
            },
            function (b2_circle_contact_js_1_1) {
                b2_circle_contact_js_1 = b2_circle_contact_js_1_1;
            },
            function (b2_polygon_contact_js_1_1) {
                b2_polygon_contact_js_1 = b2_polygon_contact_js_1_1;
            },
            function (b2_polygon_circle_contact_js_1_1) {
                b2_polygon_circle_contact_js_1 = b2_polygon_circle_contact_js_1_1;
            },
            function (b2_edge_circle_contact_js_1_1) {
                b2_edge_circle_contact_js_1 = b2_edge_circle_contact_js_1_1;
            },
            function (b2_edge_polygon_contact_js_1_1) {
                b2_edge_polygon_contact_js_1 = b2_edge_polygon_contact_js_1_1;
            },
            function (b2_chain_circle_contact_js_1_1) {
                b2_chain_circle_contact_js_1 = b2_chain_circle_contact_js_1_1;
            },
            function (b2_chain_polygon_contact_js_1_1) {
                b2_chain_polygon_contact_js_1 = b2_chain_polygon_contact_js_1_1;
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
                    for (let i = 0; i < b2_shape_js_1.b2ShapeType.e_shapeTypeCount; i++) {
                        this.m_registers[i] = [];
                        for (let j = 0; j < b2_shape_js_1.b2ShapeType.e_shapeTypeCount; j++) {
                            this.m_registers[i][j] = new b2ContactRegister();
                        }
                    }
                    this.AddType(b2_circle_contact_js_1.b2CircleContact.Create, b2_circle_contact_js_1.b2CircleContact.Destroy, b2_shape_js_1.b2ShapeType.e_circleShape, b2_shape_js_1.b2ShapeType.e_circleShape);
                    this.AddType(b2_polygon_circle_contact_js_1.b2PolygonAndCircleContact.Create, b2_polygon_circle_contact_js_1.b2PolygonAndCircleContact.Destroy, b2_shape_js_1.b2ShapeType.e_polygonShape, b2_shape_js_1.b2ShapeType.e_circleShape);
                    this.AddType(b2_polygon_contact_js_1.b2PolygonContact.Create, b2_polygon_contact_js_1.b2PolygonContact.Destroy, b2_shape_js_1.b2ShapeType.e_polygonShape, b2_shape_js_1.b2ShapeType.e_polygonShape);
                    this.AddType(b2_edge_circle_contact_js_1.b2EdgeAndCircleContact.Create, b2_edge_circle_contact_js_1.b2EdgeAndCircleContact.Destroy, b2_shape_js_1.b2ShapeType.e_edgeShape, b2_shape_js_1.b2ShapeType.e_circleShape);
                    this.AddType(b2_edge_polygon_contact_js_1.b2EdgeAndPolygonContact.Create, b2_edge_polygon_contact_js_1.b2EdgeAndPolygonContact.Destroy, b2_shape_js_1.b2ShapeType.e_edgeShape, b2_shape_js_1.b2ShapeType.e_polygonShape);
                    this.AddType(b2_chain_circle_contact_js_1.b2ChainAndCircleContact.Create, b2_chain_circle_contact_js_1.b2ChainAndCircleContact.Destroy, b2_shape_js_1.b2ShapeType.e_chainShape, b2_shape_js_1.b2ShapeType.e_circleShape);
                    this.AddType(b2_chain_polygon_contact_js_1.b2ChainAndPolygonContact.Create, b2_chain_polygon_contact_js_1.b2ChainAndPolygonContact.Destroy, b2_shape_js_1.b2ShapeType.e_chainShape, b2_shape_js_1.b2ShapeType.e_polygonShape);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29udGFjdF9mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2R5bmFtaWNzL2IyX2NvbnRhY3RfZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVlBLG9CQUFBLE1BQWEsaUJBQWlCO2dCQUE5QjtvQkFDUyxTQUFJLEdBQWdCLEVBQUUsQ0FBQztvQkFDdkIsY0FBUyxHQUE2QixJQUFJLENBQUM7b0JBQzNDLGVBQVUsR0FBMEMsSUFBSSxDQUFDO29CQUN6RCxZQUFPLEdBQVksS0FBSyxDQUFDO2dCQUNsQyxDQUFDO2FBQUEsQ0FBQTs7WUFFRCxtQkFBQSxNQUFhLGdCQUFnQjtnQkFHM0I7b0JBRmdCLGdCQUFXLEdBQTBCLEVBQUUsQ0FBQztvQkFHdEQsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBRU8sT0FBTyxDQUFDLFNBQTBCLEVBQUUsVUFBd0MsRUFBRSxLQUFrQixFQUFFLEtBQWtCO29CQUMxSCxNQUFNLElBQUksR0FBZ0IsRUFBRSxDQUFDO29CQUU3QixTQUFTLGFBQWE7d0JBQ3BCLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLFNBQVMsRUFBRSxDQUFDO29CQUNuQyxDQUFDO29CQUVELFNBQVMsY0FBYyxDQUFDLE9BQWtCO3dCQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyQixDQUFDO29CQUVELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLENBQUMsYUFBYTtvQkFDdkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENB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