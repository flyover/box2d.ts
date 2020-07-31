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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfY29udGFjdF9mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJfY29udGFjdF9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBWUEsb0JBQUEsTUFBYSxpQkFBaUI7Z0JBQTlCO29CQUNTLFNBQUksR0FBZ0IsRUFBRSxDQUFDO29CQUN2QixjQUFTLEdBQTZCLElBQUksQ0FBQztvQkFDM0MsZUFBVSxHQUEwQyxJQUFJLENBQUM7b0JBQ3pELFlBQU8sR0FBWSxLQUFLLENBQUM7Z0JBQ2xDLENBQUM7YUFBQSxDQUFBOztZQUVELG1CQUFBLE1BQWEsZ0JBQWdCO2dCQUczQjtvQkFGZ0IsZ0JBQVcsR0FBMEIsRUFBRSxDQUFDO29CQUd0RCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQztnQkFFTyxPQUFPLENBQUMsU0FBMEIsRUFBRSxVQUF3QyxFQUFFLEtBQWtCLEVBQUUsS0FBa0I7b0JBQzFILE1BQU0sSUFBSSxHQUFnQixFQUFFLENBQUM7b0JBRTdCLFNBQVMsYUFBYTt3QkFDcEIsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksU0FBUyxFQUFFLENBQUM7b0JBQ25DLENBQUM7b0JBRUQsU0FBUyxjQUFjLENBQUMsT0FBa0I7d0JBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3JCLENBQUM7b0JBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsQ0FBQyxhQUFhO29CQUN2RSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsR0FBRyxj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