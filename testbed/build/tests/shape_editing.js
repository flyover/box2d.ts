// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, ShapeEditing, testIndex;
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
            ShapeEditing = class ShapeEditing extends testbed.Test {
                constructor() {
                    super();
                    this.m_fixture2 = null;
                    this.m_sensor = false;
                    {
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(new b2.Vec2(-40.0, 0.0), new b2.Vec2(40.0, 0.0));
                        ground.CreateFixture(shape, 0.0);
                    }
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Set(0.0, 10.0);
                    this.m_body = this.m_world.CreateBody(bd);
                    const shape = new b2.PolygonShape();
                    shape.SetAsBox(4.0, 4.0, new b2.Vec2(0.0, 0.0), 0.0);
                    this.m_fixture1 = this.m_body.CreateFixture(shape, 10.0);
                }
                Keyboard(key) {
                    switch (key) {
                        case "c":
                            if (this.m_fixture2 === null) {
                                const shape = new b2.CircleShape();
                                shape.m_radius = 3.0;
                                shape.m_p.Set(0.5, -4.0);
                                this.m_fixture2 = this.m_body.CreateFixture(shape, 10.0);
                                this.m_body.SetAwake(true);
                            }
                            break;
                        case "d":
                            if (this.m_fixture2 !== null) {
                                this.m_body.DestroyFixture(this.m_fixture2);
                                this.m_fixture2 = null;
                                this.m_body.SetAwake(true);
                            }
                            break;
                        case "s":
                            if (this.m_fixture2 !== null) {
                                this.m_sensor = !this.m_sensor;
                                this.m_fixture2.SetSensor(this.m_sensor);
                            }
                            break;
                    }
                }
                Step(settings) {
                    super.Step(settings);
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, "Press: (c) create a shape, (d) destroy a shape.");
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                    testbed.g_debugDraw.DrawString(5, this.m_textLine, `sensor = ${(this.m_sensor) ? (1) : (0)}`);
                    this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
                }
                static Create() {
                    return new ShapeEditing();
                }
            };
            exports_1("ShapeEditing", ShapeEditing);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Examples", "Shape Editing", ShapeEditing.Create));
        }
    };
});
//# sourceMappingURL=shape_editing.js.map