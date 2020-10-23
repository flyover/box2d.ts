// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, CompoundShapes, testIndex;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (testbed_1) {
                testbed = testbed_1;
            }
        ],
        execute: function () {
            CompoundShapes = class CompoundShapes extends testbed.Test {
                constructor() {
                    super();
                    {
                        const bd = new b2.BodyDef();
                        const body = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(50.0, 0.0), new b2.Vec2(-50.0, 0.0));
                        body.CreateFixture(shape, 0.0);
                    }
                    // Table 1
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Set(-15.0, 1.0);
                        this.m_table1 = this.m_world.CreateBody(bd);
                        const top = new b2.PolygonShape();
                        top.SetAsBox(3.0, 0.5, new b2.Vec2(0.0, 3.5), 0.0);
                        const leftLeg = new b2.PolygonShape();
                        leftLeg.SetAsBox(0.5, 1.5, new b2.Vec2(-2.5, 1.5), 0.0);
                        const rightLeg = new b2.PolygonShape();
                        rightLeg.SetAsBox(0.5, 1.5, new b2.Vec2(2.5, 1.5), 0.0);
                        this.m_table1.CreateFixture(top, 2.0);
                        this.m_table1.CreateFixture(leftLeg, 2.0);
                        this.m_table1.CreateFixture(rightLeg, 2.0);
                    }
                    // Table 2
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Set(-5.0, 1.0);
                        this.m_table2 = this.m_world.CreateBody(bd);
                        const top = new b2.PolygonShape();
                        top.SetAsBox(3.0, 0.5, new b2.Vec2(0.0, 3.5), 0.0);
                        const leftLeg = new b2.PolygonShape();
                        leftLeg.SetAsBox(0.5, 2.0, new b2.Vec2(-2.5, 2.0), 0.0);
                        const rightLeg = new b2.PolygonShape();
                        rightLeg.SetAsBox(0.5, 2.0, new b2.Vec2(2.5, 2.0), 0.0);
                        this.m_table2.CreateFixture(top, 2.0);
                        this.m_table2.CreateFixture(leftLeg, 2.0);
                        this.m_table2.CreateFixture(rightLeg, 2.0);
                    }
                    // Spaceship 1
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Set(5.0, 1.0);
                        this.m_ship1 = this.m_world.CreateBody(bd);
                        const vertices = b2.Vec2.MakeArray(3);
                        const left = new b2.PolygonShape();
                        vertices[0].Set(-2.0, 0.0);
                        vertices[1].Set(0.0, 4.0 / 3.0);
                        vertices[2].Set(0.0, 4.0);
                        left.Set(vertices, 3);
                        const right = new b2.PolygonShape();
                        vertices[0].Set(2.0, 0.0);
                        vertices[1].Set(0.0, 4.0 / 3.0);
                        vertices[2].Set(0.0, 4.0);
                        right.Set(vertices, 3);
                        this.m_ship1.CreateFixture(left, 2.0);
                        this.m_ship1.CreateFixture(right, 2.0);
                    }
                    // Spaceship 2
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Set(15.0, 1.0);
                        this.m_ship2 = this.m_world.CreateBody(bd);
                        const vertices = b2.Vec2.MakeArray(3);
                        const left = new b2.PolygonShape();
                        vertices[0].Set(-2.0, 0.0);
                        vertices[1].Set(1.0, 2.0);
                        vertices[2].Set(0.0, 4.0);
                        left.Set(vertices, 3);
                        const right = new b2.PolygonShape();
                        vertices[0].Set(2.0, 0.0);
                        vertices[1].Set(-1.0, 2.0);
                        vertices[2].Set(0.0, 4.0);
                        right.Set(vertices, 3);
                        this.m_ship2.CreateFixture(left, 2.0);
                        this.m_ship2.CreateFixture(right, 2.0);
                    }
                }
                Spawn() {
                    // Table 1 obstruction
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Copy(this.m_table1.GetPosition());
                        bd.angle = this.m_table1.GetAngle();
                        const body = this.m_world.CreateBody(bd);
                        const box = new b2.PolygonShape();
                        box.SetAsBox(4.0, 0.1, new b2.Vec2(0.0, 3.0), 0.0);
                        body.CreateFixture(box, 2.0);
                    }
                    // Table 2 obstruction
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Copy(this.m_table2.GetPosition());
                        bd.angle = this.m_table2.GetAngle();
                        const body = this.m_world.CreateBody(bd);
                        const box = new b2.PolygonShape();
                        box.SetAsBox(4.0, 0.1, new b2.Vec2(0.0, 3.0), 0.0);
                        body.CreateFixture(box, 2.0);
                    }
                    // Ship 1 obstruction
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Copy(this.m_ship1.GetPosition());
                        bd.angle = this.m_ship1.GetAngle();
                        bd.gravityScale = 0.0;
                        const body = this.m_world.CreateBody(bd);
                        const circle = new b2.CircleShape();
                        circle.m_radius = 0.5;
                        circle.m_p.Set(0.0, 2.0);
                        body.CreateFixture(circle, 2.0);
                    }
                    // Ship 2 obstruction
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.dynamicBody;
                        bd.position.Copy(this.m_ship2.GetPosition());
                        bd.angle = this.m_ship2.GetAngle();
                        bd.gravityScale = 0.0;
                        const body = this.m_world.CreateBody(bd);
                        const circle = new b2.CircleShape();
                        circle.m_radius = 0.5;
                        circle.m_p.Set(0.0, 2.0);
                        body.CreateFixture(circle, 2.0);
                    }
                }
                Keyboard(key) {
                    switch (key) {
                        case "s":
                            this.Spawn();
                            break;
                    }
                    super.Keyboard(key);
                }
                Step(settings) {
                    super.Step(settings);
                }
                static Create() {
                    return new CompoundShapes();
                }
            };
            exports_1("CompoundShapes", CompoundShapes);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Compound Shapes", CompoundShapes.Create));
        }
    };
});
//# sourceMappingURL=compound_shapes.js.map