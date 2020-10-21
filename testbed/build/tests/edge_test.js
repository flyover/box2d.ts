// MIT License
System.register(["@box2d", "@testbed"], function (exports_1, context_1) {
    "use strict";
    var b2, testbed, EdgeTest, testIndex;
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
            EdgeTest = class EdgeTest extends testbed.Test {
                constructor() {
                    super();
                    this.m_offset1 = new b2.Vec2();
                    this.m_offset2 = new b2.Vec2();
                    this.m_body1 = null;
                    this.m_body2 = null;
                    this.m_boxes = false;
                    const vertices = [
                        new b2.Vec2(10.0, -4.0),
                        new b2.Vec2(10.0, 0.0),
                        new b2.Vec2(6.0, 0.0),
                        new b2.Vec2(4.0, 2.0),
                        new b2.Vec2(2.0, 0.0),
                        new b2.Vec2(-2.0, 0.0),
                        new b2.Vec2(-6.0, 0.0),
                        new b2.Vec2(-8.0, -3.0),
                        new b2.Vec2(-10.0, 0.0),
                        new b2.Vec2(-10.0, -4.0),
                    ];
                    this.m_offset1.Set(0.0, 8.0);
                    this.m_offset2.Set(0.0, 16.0);
                    {
                        const v1 = vertices[0].Clone().SelfAdd(this.m_offset1);
                        const v2 = vertices[1].Clone().SelfAdd(this.m_offset1);
                        const v3 = vertices[2].Clone().SelfAdd(this.m_offset1);
                        const v4 = vertices[3].Clone().SelfAdd(this.m_offset1);
                        const v5 = vertices[4].Clone().SelfAdd(this.m_offset1);
                        const v6 = vertices[5].Clone().SelfAdd(this.m_offset1);
                        const v7 = vertices[6].Clone().SelfAdd(this.m_offset1);
                        const v8 = vertices[7].Clone().SelfAdd(this.m_offset1);
                        const v9 = vertices[8].Clone().SelfAdd(this.m_offset1);
                        const v10 = vertices[9].Clone().SelfAdd(this.m_offset1);
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetOneSided(v10, v1, v2, v3);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v1, v2, v3, v4);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v2, v3, v4, v5);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v3, v4, v5, v6);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v4, v5, v6, v7);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v5, v6, v7, v8);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v6, v7, v8, v9);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v7, v8, v9, v10);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v8, v9, v10, v1);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetOneSided(v9, v10, v1, v2);
                        ground.CreateFixture(shape, 0.0);
                    }
                    {
                        const v1 = vertices[0].Clone().SelfAdd(this.m_offset2);
                        const v2 = vertices[1].Clone().SelfAdd(this.m_offset2);
                        const v3 = vertices[2].Clone().SelfAdd(this.m_offset2);
                        const v4 = vertices[3].Clone().SelfAdd(this.m_offset2);
                        const v5 = vertices[4].Clone().SelfAdd(this.m_offset2);
                        const v6 = vertices[5].Clone().SelfAdd(this.m_offset2);
                        const v7 = vertices[6].Clone().SelfAdd(this.m_offset2);
                        const v8 = vertices[7].Clone().SelfAdd(this.m_offset2);
                        const v9 = vertices[8].Clone().SelfAdd(this.m_offset2);
                        const v10 = vertices[9].Clone().SelfAdd(this.m_offset2);
                        const bd = new b2.BodyDef();
                        const ground = this.m_world.CreateBody(bd);
                        const shape = new b2.EdgeShape();
                        shape.SetTwoSided(v1, v2);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v2, v3);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v3, v4);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v4, v5);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v5, v6);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v6, v7);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v7, v8);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v8, v9);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v9, v10);
                        ground.CreateFixture(shape, 0.0);
                        shape.SetTwoSided(v10, v1);
                        ground.CreateFixture(shape, 0.0);
                    }
                    this.m_body1 = null;
                    this.m_body2 = null;
                    this.CreateBoxes();
                    this.m_boxes = true;
                }
                CreateBoxes() {
                    if (this.m_body1) {
                        this.m_world.DestroyBody(this.m_body1);
                        this.m_body1 = null;
                    }
                    if (this.m_body2) {
                        this.m_world.DestroyBody(this.m_body2);
                        this.m_body2 = null;
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        // bd.position = b2Vec2(8.0, 2.6) + this.m_offset1;
                        bd.position.x = 8.0 + this.m_offset1.x;
                        bd.position.y = 2.6 + this.m_offset1.y;
                        bd.allowSleep = false;
                        this.m_body1 = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 1.0);
                        this.m_body1.CreateFixture(shape, 1.0);
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        // bd.position = b2Vec2(8.0, 2.6f) + this.m_offset2;
                        bd.position.x = 8.0 + this.m_offset2.x;
                        bd.position.y = 2.6 + this.m_offset2.y;
                        bd.allowSleep = false;
                        this.m_body2 = this.m_world.CreateBody(bd);
                        const shape = new b2.PolygonShape();
                        shape.SetAsBox(0.5, 1.0);
                        this.m_body2.CreateFixture(shape, 1.0);
                    }
                }
                CreateCircles() {
                    if (this.m_body1) {
                        this.m_world.DestroyBody(this.m_body1);
                        this.m_body1 = null;
                    }
                    if (this.m_body2) {
                        this.m_world.DestroyBody(this.m_body2);
                        this.m_body2 = null;
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        // bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset1;
                        bd.position.x = -0.5 + this.m_offset1.x;
                        bd.position.y = 0.6 + this.m_offset1.y;
                        bd.allowSleep = false;
                        this.m_body1 = this.m_world.CreateBody(bd);
                        const shape = new b2.CircleShape();
                        shape.m_radius = 0.5;
                        this.m_body1.CreateFixture(shape, 1.0);
                    }
                    {
                        const bd = new b2.BodyDef();
                        bd.type = b2.BodyType.b2_dynamicBody;
                        // bd.position = b2Vec2(-0.5f, 0.6f) + this.m_offset2;
                        bd.position.x = -0.5 + this.m_offset2.x;
                        bd.position.y = 0.6 + this.m_offset2.y;
                        bd.allowSleep = false;
                        this.m_body2 = this.m_world.CreateBody(bd);
                        const shape = new b2.CircleShape();
                        shape.m_radius = 0.5;
                        this.m_body2.CreateFixture(shape, 1.0);
                    }
                }
                UpdateUI() {
                    // ImGui::SetNextWindowPos(ImVec2(10.0, 100.0));
                    // ImGui::SetNextWindowSize(ImVec2(200.0, 100.0));
                    // ImGui::Begin("Custom Controls", null, ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize);
                    // if (ImGui::RadioButton("Boxes", m_boxes == true))
                    // {
                    //   CreateBoxes();
                    //   m_boxes = true;
                    // }
                    // if (ImGui::RadioButton("Circles", m_boxes == false))
                    // {
                    //   CreateCircles();
                    //   m_boxes = false;
                    // }
                    // ImGui::End();
                }
                Step(settings) {
                    // if (glfwGetKey(g_mainWindow, GLFW_KEY_A) == GLFW_PRESS)
                    // {
                    //   this.m_body1.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
                    //   this.m_body2.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
                    // }
                    // if (glfwGetKey(g_mainWindow, GLFW_KEY_D) == GLFW_PRESS)
                    // {
                    //   this.m_body1.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
                    //   this.m_body2.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
                    // }
                    super.Step(settings);
                }
                Keyboard(key) {
                    var _a, _b, _c, _d;
                    switch (key) {
                        case "a":
                            (_a = this.m_body1) === null || _a === void 0 ? void 0 : _a.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
                            (_b = this.m_body2) === null || _b === void 0 ? void 0 : _b.ApplyForceToCenter(new b2.Vec2(-10.0, 0.0), true);
                            break;
                        case "d":
                            (_c = this.m_body1) === null || _c === void 0 ? void 0 : _c.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
                            (_d = this.m_body2) === null || _d === void 0 ? void 0 : _d.ApplyForceToCenter(new b2.Vec2(10.0, 0.0), true);
                            break;
                        case "b":
                            this.CreateBoxes();
                            break;
                        case "c":
                            this.CreateCircles();
                            break;
                    }
                }
                static Create() {
                    return new EdgeTest();
                }
            };
            exports_1("EdgeTest", EdgeTest);
            exports_1("testIndex", testIndex = testbed.RegisterTest("Geometry", "Edge Test", EdgeTest.Create));
        }
    };
});
//# sourceMappingURL=edge_test.js.map