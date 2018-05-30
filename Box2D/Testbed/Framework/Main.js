System.register(["Box2D", "./Test", "./DebugDraw", "../Tests/TestEntries", "./FullscreenUI", "./ParticleParameter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, Test_1, DebugDraw_1, TestEntries_1, FullscreenUI_1, ParticleParameter_1, Main;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (Test_1_1) {
                Test_1 = Test_1_1;
            },
            function (DebugDraw_1_1) {
                DebugDraw_1 = DebugDraw_1_1;
            },
            function (TestEntries_1_1) {
                TestEntries_1 = TestEntries_1_1;
            },
            function (FullscreenUI_1_1) {
                FullscreenUI_1 = FullscreenUI_1_1;
            },
            function (ParticleParameter_1_1) {
                ParticleParameter_1 = ParticleParameter_1_1;
            }
        ],
        execute: function () {
            // #endif
            Main = class Main {
                constructor() {
                    // #endif
                    this.m_time_last = 0;
                    this.m_fps_time = 0;
                    this.m_fps_frames = 0;
                    this.m_fps = 0;
                    this.m_settings = new Test_1.Settings();
                    this.m_test_index = 0;
                    this.m_shift = false;
                    this.m_ctrl = false;
                    this.m_lMouseDown = false;
                    this.m_rMouseDown = false;
                    this.m_projection0 = new box2d.b2Vec2();
                    this.m_viewCenter0 = new box2d.b2Vec2();
                    this.m_demo_mode = false;
                    this.m_demo_time = 0;
                    this.m_max_demo_time = 1000 * 10;
                    this.m_ctx = null;
                    this.m_mouse = new box2d.b2Vec2();
                    const fps_div = this.m_fps_div = document.body.appendChild(document.createElement("div"));
                    fps_div.style.position = "absolute";
                    fps_div.style.left = "0px";
                    fps_div.style.bottom = "0px";
                    fps_div.style.backgroundColor = "rgba(0,0,255,0.75)";
                    fps_div.style.color = "white";
                    fps_div.style.font = "10pt Courier New";
                    fps_div.style.zIndex = "256";
                    fps_div.innerHTML = "FPS";
                    const debug_div = this.m_debug_div = document.body.appendChild(document.createElement("div"));
                    debug_div.style.position = "absolute";
                    debug_div.style.left = "0px";
                    debug_div.style.bottom = "0px";
                    debug_div.style.backgroundColor = "rgba(0,0,255,0.75)";
                    debug_div.style.color = "white";
                    debug_div.style.font = "10pt Courier New";
                    debug_div.style.zIndex = "256";
                    debug_div.innerHTML = "";
                    document.body.style.backgroundColor = "black";
                    const main_div = document.body.appendChild(document.createElement("div"));
                    main_div.style.position = "absolute"; // relative to document.body
                    main_div.style.left = "0px";
                    main_div.style.top = "0px";
                    function resize_main_div() {
                        // console.log(window.innerWidth + "x" + window.innerHeight);
                        main_div.style.width = window.innerWidth + "px";
                        main_div.style.height = window.innerHeight + "px";
                    }
                    window.addEventListener("resize", (e) => { resize_main_div(); });
                    window.addEventListener("orientationchange", (e) => { resize_main_div(); });
                    resize_main_div();
                    const title_div = main_div.appendChild(document.createElement("div"));
                    title_div.style.textAlign = "center";
                    title_div.style.color = "grey";
                    title_div.innerHTML = "Box2D Testbed version " + box2d.b2_version + " (revision " + box2d.b2_changelist + ")";
                    const view_div = main_div.appendChild(document.createElement("div"));
                    const canvas_div = this.m_canvas_div = view_div.appendChild(document.createElement("div"));
                    canvas_div.style.position = "absolute"; // relative to view_div
                    canvas_div.style.left = "0px";
                    canvas_div.style.right = "0px";
                    canvas_div.style.top = "0px";
                    canvas_div.style.bottom = "0px";
                    const canvas_2d = this.m_canvas_2d = canvas_div.appendChild(document.createElement("canvas"));
                    function resize_canvas() {
                        ///console.log(canvas_div.clientWidth + "x" + canvas_div.clientHeight);
                        if (canvas_2d.width !== canvas_div.clientWidth) {
                            DebugDraw_1.g_camera.m_width = canvas_2d.width = canvas_div.clientWidth;
                        }
                        if (canvas_2d.height !== canvas_div.clientHeight) {
                            DebugDraw_1.g_camera.m_height = canvas_2d.height = canvas_div.clientHeight;
                        }
                    }
                    window.addEventListener("resize", (e) => { resize_canvas(); });
                    window.addEventListener("orientationchange", (e) => { resize_canvas(); });
                    resize_canvas();
                    DebugDraw_1.g_debugDraw.m_ctx = this.m_ctx = this.m_canvas_2d.getContext("2d");
                    const controls_div = view_div.appendChild(document.createElement("div"));
                    controls_div.style.position = "absolute"; // relative to view_div
                    controls_div.style.backgroundColor = "rgba(255,255,255,0.5)";
                    controls_div.style.padding = "8px";
                    controls_div.style.right = "0px";
                    controls_div.style.top = "0px";
                    controls_div.style.bottom = "0px";
                    controls_div.style.overflowY = "scroll";
                    // tests select box
                    controls_div.appendChild(document.createTextNode("Tests"));
                    controls_div.appendChild(document.createElement("br"));
                    const test_select = document.createElement("select");
                    for (let i = 0; i < TestEntries_1.g_testEntries.length; ++i) {
                        const option = document.createElement("option");
                        option.text = TestEntries_1.g_testEntries[i].name;
                        option.value = i.toString();
                        test_select.add(option);
                    }
                    test_select.selectedIndex = this.m_test_index;
                    test_select.addEventListener("change", (e) => {
                        this.m_test_index = test_select.selectedIndex;
                        this.LoadTest();
                    });
                    controls_div.appendChild(test_select);
                    this.m_test_select = test_select;
                    controls_div.appendChild(document.createElement("br"));
                    controls_div.appendChild(document.createElement("hr"));
                    // simulation number inputs
                    function connect_number_input(parent, label, init, update, min, max, step) {
                        const number_input_tr = parent.appendChild(document.createElement("tr"));
                        const number_input_td0 = number_input_tr.appendChild(document.createElement("td"));
                        number_input_td0.align = "right";
                        number_input_td0.appendChild(document.createTextNode(label));
                        const number_input_td1 = number_input_tr.appendChild(document.createElement("td"));
                        const number_input = document.createElement("input");
                        number_input.size = 8;
                        number_input.min = min.toString();
                        number_input.max = max.toString();
                        number_input.step = step.toString();
                        number_input.value = init.toString();
                        number_input.addEventListener("change", (e) => {
                            update(parseInt(number_input.value, 10));
                        });
                        number_input_td1.appendChild(number_input);
                        return number_input;
                    }
                    const number_input_table = controls_div.appendChild(document.createElement("table"));
                    connect_number_input(number_input_table, "Vel Iters", this.m_settings.velocityIterations, (value) => { this.m_settings.velocityIterations = value; }, 1, 20, 1);
                    connect_number_input(number_input_table, "Pos Iters", this.m_settings.positionIterations, (value) => { this.m_settings.positionIterations = value; }, 1, 20, 1);
                    // #if B2_ENABLE_PARTICLE
                    connect_number_input(number_input_table, "Pcl Iters", this.m_settings.particleIterations, (value) => { this.m_settings.particleIterations = value; }, 1, 100, 1);
                    // #endif
                    connect_number_input(number_input_table, "Hertz", this.m_settings.hz, (value) => { this.m_settings.hz = value; }, 10, 120, 1);
                    // simulation checkbox inputs
                    function connect_checkbox_input(parent, label, init, update) {
                        const checkbox_input = document.createElement("input");
                        checkbox_input.type = "checkbox";
                        checkbox_input.checked = init;
                        checkbox_input.addEventListener("click", (e) => {
                            update(checkbox_input.checked);
                        });
                        parent.appendChild(checkbox_input);
                        parent.appendChild(document.createTextNode(label));
                        parent.appendChild(document.createElement("br"));
                        return checkbox_input;
                    }
                    connect_checkbox_input(controls_div, "Sleep", this.m_settings.enableSleep, (value) => { this.m_settings.enableSleep = value; });
                    connect_checkbox_input(controls_div, "Warm Starting", this.m_settings.enableWarmStarting, (value) => { this.m_settings.enableWarmStarting = value; });
                    connect_checkbox_input(controls_div, "Time of Impact", this.m_settings.enableContinuous, (value) => { this.m_settings.enableContinuous = value; });
                    connect_checkbox_input(controls_div, "Sub-Stepping", this.m_settings.enableSubStepping, (value) => { this.m_settings.enableSubStepping = value; });
                    // #if B2_ENABLE_PARTICLE
                    connect_checkbox_input(controls_div, "Strict Particle/Body Contacts", this.m_settings.strictContacts, (value) => { this.m_settings.strictContacts = value; });
                    // #endif
                    // draw checkbox inputs
                    const draw_fieldset = controls_div.appendChild(document.createElement("fieldset"));
                    const draw_legend = draw_fieldset.appendChild(document.createElement("legend"));
                    draw_legend.appendChild(document.createTextNode("Draw"));
                    connect_checkbox_input(draw_fieldset, "Shapes", this.m_settings.drawShapes, (value) => { this.m_settings.drawShapes = value; });
                    // #if B2_ENABLE_PARTICLE
                    connect_checkbox_input(draw_fieldset, "Particles", this.m_settings.drawParticles, (value) => { this.m_settings.drawParticles = value; });
                    // #endif
                    connect_checkbox_input(draw_fieldset, "Joints", this.m_settings.drawJoints, (value) => { this.m_settings.drawJoints = value; });
                    connect_checkbox_input(draw_fieldset, "AABBs", this.m_settings.drawAABBs, (value) => { this.m_settings.drawAABBs = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Points", this.m_settings.drawContactPoints, (value) => { this.m_settings.drawContactPoints = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Normals", this.m_settings.drawContactNormals, (value) => { this.m_settings.drawContactNormals = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Impulses", this.m_settings.drawContactImpulse, (value) => { this.m_settings.drawContactImpulse = value; });
                    connect_checkbox_input(draw_fieldset, "Friction Impulses", this.m_settings.drawFrictionImpulse, (value) => { this.m_settings.drawFrictionImpulse = value; });
                    connect_checkbox_input(draw_fieldset, "Center of Masses", this.m_settings.drawCOMs, (value) => { this.m_settings.drawCOMs = value; });
                    connect_checkbox_input(draw_fieldset, "Statistics", this.m_settings.drawStats, (value) => { this.m_settings.drawStats = value; });
                    connect_checkbox_input(draw_fieldset, "Profile", this.m_settings.drawProfile, (value) => { this.m_settings.drawProfile = value; });
                    // simulation buttons
                    function connect_button_input(parent, label, callback) {
                        const button_input = document.createElement("input");
                        button_input.type = "button";
                        button_input.style.width = "100";
                        button_input.value = label;
                        button_input.addEventListener("click", callback);
                        parent.appendChild(button_input);
                        parent.appendChild(document.createElement("br"));
                        return button_input;
                    }
                    const button_div = controls_div.appendChild(document.createElement("div"));
                    button_div.align = "center";
                    connect_button_input(button_div, "Pause", (e) => { this.Pause(); });
                    connect_button_input(button_div, "Step", (e) => { this.SingleStep(); });
                    connect_button_input(button_div, "Restart", (e) => { this.LoadTest(); });
                    this.m_demo_button = connect_button_input(button_div, "Demo", (e) => { this.ToggleDemo(); });
                    // disable context menu to use right-click
                    window.addEventListener("contextmenu", (e) => { e.preventDefault(); }, true);
                    canvas_div.addEventListener("mousemove", (e) => { this.HandleMouseMove(e); });
                    canvas_div.addEventListener("mousedown", (e) => { this.HandleMouseDown(e); });
                    canvas_div.addEventListener("mouseup", (e) => { this.HandleMouseUp(e); });
                    canvas_div.addEventListener("mousewheel", (e) => { this.HandleMouseWheel(e); });
                    canvas_div.addEventListener("touchmove", (e) => { this.HandleTouchMove(e); });
                    canvas_div.addEventListener("touchstart", (e) => { this.HandleTouchStart(e); });
                    canvas_div.addEventListener("touchend", (e) => { this.HandleTouchEnd(e); });
                    window.addEventListener("keydown", (e) => { this.HandleKeyDown(e); });
                    window.addEventListener("keyup", (e) => { this.HandleKeyUp(e); });
                    this.LoadTest();
                    this.m_time_last = Date.now();
                }
                HomeCamera() {
                    DebugDraw_1.g_camera.m_zoom = (this.m_test) ? (this.m_test.GetDefaultViewZoom()) : (1.0);
                    DebugDraw_1.g_camera.m_center.Set(0, 20 * DebugDraw_1.g_camera.m_zoom);
                    ///g_camera.m_roll.SetAngle(box2d.b2DegToRad(0));
                }
                MoveCamera(move) {
                    const position = DebugDraw_1.g_camera.m_center.Clone();
                    ///move.SelfRotate(g_camera.m_roll.GetAngle());
                    position.SelfAdd(move);
                    DebugDraw_1.g_camera.m_center.Copy(position);
                }
                ///public RollCamera(roll: number): void {
                ///  const angle: number = g_camera.m_roll.GetAngle();
                ///  g_camera.m_roll.SetAngle(angle + roll);
                ///}
                ZoomCamera(zoom) {
                    DebugDraw_1.g_camera.m_zoom *= zoom;
                    DebugDraw_1.g_camera.m_zoom = box2d.b2Clamp(DebugDraw_1.g_camera.m_zoom, 0.02, 20);
                }
                HandleMouseMove(e) {
                    const element = new box2d.b2Vec2(e.clientX, e.clientY);
                    const world = DebugDraw_1.g_camera.ConvertScreenToWorld(element, new box2d.b2Vec2());
                    this.m_mouse.Copy(element);
                    if (this.m_lMouseDown) {
                        this.m_test.MouseMove(world);
                    }
                    if (this.m_rMouseDown) {
                        // m_center = viewCenter0 - (projection - projection0);
                        const projection = DebugDraw_1.g_camera.ConvertElementToProjection(element, new box2d.b2Vec2());
                        const diff = box2d.b2Vec2.SubVV(projection, this.m_projection0, new box2d.b2Vec2());
                        const center = box2d.b2Vec2.SubVV(this.m_viewCenter0, diff, new box2d.b2Vec2());
                        DebugDraw_1.g_camera.m_center.Copy(center);
                    }
                }
                HandleMouseDown(e) {
                    const element = new box2d.b2Vec2(e.clientX, e.clientY);
                    const world = DebugDraw_1.g_camera.ConvertScreenToWorld(element, new box2d.b2Vec2());
                    switch (e.which) {
                        case 1: // left mouse button
                            this.m_lMouseDown = true;
                            if (this.m_shift) {
                                this.m_test.ShiftMouseDown(world);
                            }
                            else {
                                this.m_test.MouseDown(world);
                            }
                            break;
                        case 3: // right mouse button
                            this.m_rMouseDown = true;
                            const projection = DebugDraw_1.g_camera.ConvertElementToProjection(element, new box2d.b2Vec2());
                            this.m_projection0.Copy(projection);
                            this.m_viewCenter0.Copy(DebugDraw_1.g_camera.m_center);
                            break;
                    }
                }
                HandleMouseUp(e) {
                    const element = new box2d.b2Vec2(e.clientX, e.clientY);
                    const world = DebugDraw_1.g_camera.ConvertScreenToWorld(element, new box2d.b2Vec2());
                    switch (e.which) {
                        case 1: // left mouse button
                            this.m_lMouseDown = false;
                            this.m_test.MouseUp(world);
                            break;
                        case 3: // right mouse button
                            this.m_rMouseDown = false;
                            break;
                    }
                }
                HandleTouchMove(e) {
                    const element = new box2d.b2Vec2(e.touches[0].clientX, e.touches[0].clientY);
                    const world = DebugDraw_1.g_camera.ConvertScreenToWorld(element, new box2d.b2Vec2());
                    this.m_test.MouseMove(world);
                    e.preventDefault();
                }
                HandleTouchStart(e) {
                    const element = new box2d.b2Vec2(e.touches[0].clientX, e.touches[0].clientY);
                    const world = DebugDraw_1.g_camera.ConvertScreenToWorld(element, new box2d.b2Vec2());
                    this.m_test.MouseDown(world);
                    e.preventDefault();
                }
                HandleTouchEnd(e) {
                    this.m_test.MouseUp(this.m_test.m_mouseWorld);
                    e.preventDefault();
                }
                HandleMouseWheel(e) {
                    if (e.wheelDelta > 0) {
                        this.ZoomCamera(1 / 1.1);
                    }
                    else if (e.wheelDelta < 0) {
                        this.ZoomCamera(1.1);
                    }
                    e.preventDefault();
                }
                HandleKeyDown(e) {
                    switch (e.key) {
                        case "Control":
                            this.m_ctrl = true;
                            break;
                        case "Shift":
                            this.m_shift = true;
                            break;
                        case "ArrowLeft":
                            if (this.m_ctrl) {
                                if (this.m_test) {
                                    this.m_test.ShiftOrigin(new box2d.b2Vec2(2, 0));
                                }
                            }
                            else {
                                this.MoveCamera(new box2d.b2Vec2(-0.5, 0));
                            }
                            break;
                        case "ArrowRight":
                            if (this.m_ctrl) {
                                if (this.m_test) {
                                    this.m_test.ShiftOrigin(new box2d.b2Vec2(-2, 0));
                                }
                            }
                            else {
                                this.MoveCamera(new box2d.b2Vec2(0.5, 0));
                            }
                            break;
                        case "ArrowDown":
                            if (this.m_ctrl) {
                                if (this.m_test) {
                                    this.m_test.ShiftOrigin(new box2d.b2Vec2(0, 2));
                                }
                            }
                            else {
                                this.MoveCamera(new box2d.b2Vec2(0, -0.5));
                            }
                            break;
                        case "ArrowUp":
                            if (this.m_ctrl) {
                                if (this.m_test) {
                                    this.m_test.ShiftOrigin(new box2d.b2Vec2(0, -2));
                                }
                            }
                            else {
                                this.MoveCamera(new box2d.b2Vec2(0, 0.5));
                            }
                            break;
                        case "Home":
                            this.HomeCamera();
                            break;
                        ///case "PageUp":
                        ///  this.RollCamera(box2d.b2DegToRad(-1));
                        ///  break;
                        ///case "PageDown":
                        ///  this.RollCamera(box2d.b2DegToRad(1));
                        ///  break;
                        case "z":
                            this.ZoomCamera(1.1);
                            break;
                        case "x":
                            this.ZoomCamera(0.9);
                            break;
                        case "r":
                            this.LoadTest();
                            break;
                        case " ":
                            if (this.m_test) {
                                this.m_test.LaunchBomb();
                            }
                            break;
                        case "p":
                            this.Pause();
                            break;
                        case "[":
                            this.DecrementTest();
                            break;
                        case "]":
                            this.IncrementTest();
                            break;
                        // #if B2_ENABLE_PARTICLE
                        case ",":
                            if (this.m_shift) {
                                // Press < to select the previous particle parameter setting.
                                Main.particleParameter.Decrement();
                            }
                            break;
                        case ".":
                            if (this.m_shift) {
                                // Press > to select the next particle parameter setting.
                                Main.particleParameter.Increment();
                            }
                            else {
                                this.SingleStep();
                            }
                            break;
                        // #else
                        // case ".":
                        //   this.SingleStep();
                        //   break;
                        // #endif
                        default:
                            // console.log(e.keyCode);
                            break;
                    }
                    if (this.m_test) {
                        this.m_test.Keyboard(e.key);
                    }
                }
                HandleKeyUp(e) {
                    switch (e.key) {
                        case "Control":
                            this.m_ctrl = false;
                            break;
                        case "Shift":
                            this.m_shift = false;
                            break;
                        default:
                            // console.log(e.keyCode);
                            break;
                    }
                    if (this.m_test) {
                        this.m_test.KeyboardUp(e.key);
                    }
                }
                UpdateTest(time_elapsed) {
                    if (this.m_demo_mode) {
                        this.m_demo_time += time_elapsed;
                        if (this.m_demo_time > this.m_max_demo_time) {
                            this.IncrementTest();
                        }
                        const str = ((500 + this.m_max_demo_time - this.m_demo_time) / 1000).toFixed(0).toString();
                        this.m_demo_button.value = str;
                    }
                    else {
                        this.m_demo_button.value = "Demo";
                    }
                }
                DecrementTest() {
                    if (this.m_test_index <= 0) {
                        this.m_test_index = TestEntries_1.g_testEntries.length;
                    }
                    this.m_test_index--;
                    this.m_test_select.selectedIndex = this.m_test_index;
                    this.LoadTest();
                }
                IncrementTest() {
                    this.m_test_index++;
                    if (this.m_test_index >= TestEntries_1.g_testEntries.length) {
                        this.m_test_index = 0;
                    }
                    this.m_test_select.selectedIndex = this.m_test_index;
                    this.LoadTest();
                }
                LoadTest(restartTest = false) {
                    // #if B2_ENABLE_PARTICLE
                    Main.fullscreenUI.Reset();
                    if (!restartTest)
                        Main.particleParameter.Reset();
                    // #endif
                    this.m_demo_time = 0;
                    // #if B2_ENABLE_PARTICLE
                    if (this.m_test) {
                        this.m_test.RestoreParticleParameters();
                    }
                    // #endif
                    this.m_test = TestEntries_1.g_testEntries[this.m_test_index].createFcn();
                    if (!restartTest) {
                        this.HomeCamera();
                    }
                }
                Pause() {
                    this.m_settings.pause = !this.m_settings.pause;
                }
                SingleStep() {
                    this.m_settings.pause = true;
                    this.m_settings.singleStep = true;
                }
                ToggleDemo() {
                    this.m_demo_mode = !this.m_demo_mode;
                }
                SimulationLoop() {
                    const time = Date.now();
                    this.m_time_last = this.m_time_last || time;
                    let time_elapsed = time - this.m_time_last;
                    this.m_time_last = time;
                    if (time_elapsed > 1000) {
                        time_elapsed = 1000;
                    } // clamp
                    this.m_fps_time += time_elapsed;
                    this.m_fps_frames++;
                    if (this.m_fps_time >= 500) {
                        this.m_fps = (this.m_fps_frames * 1000) / this.m_fps_time;
                        this.m_fps_frames = 0;
                        this.m_fps_time = 0;
                        this.m_fps_div.innerHTML = this.m_fps.toFixed(1).toString();
                    }
                    if (time_elapsed > 0) {
                        const ctx = this.m_ctx;
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        // ctx.strokeStyle = "blue";
                        // ctx.strokeRect(this.m_mouse.x - 24, this.m_mouse.y - 24, 48, 48);
                        // const mouse_world: box2d.b2Vec2 = g_camera.ConvertScreenToWorld(this.m_mouse, new box2d.b2Vec2());
                        ctx.save();
                        // 0,0 at center of canvas, x right, y up
                        ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
                        ctx.scale(1, -1);
                        ///ctx.scale(g_camera.m_extent, g_camera.m_extent);
                        ///ctx.lineWidth /= g_camera.m_extent;
                        const s = 0.5 * DebugDraw_1.g_camera.m_height / DebugDraw_1.g_camera.m_extent;
                        ctx.scale(s, s);
                        ctx.lineWidth /= s;
                        // apply camera
                        ctx.scale(1 / DebugDraw_1.g_camera.m_zoom, 1 / DebugDraw_1.g_camera.m_zoom);
                        ctx.lineWidth *= DebugDraw_1.g_camera.m_zoom;
                        ///ctx.rotate(-g_camera.m_roll.GetAngle());
                        ctx.translate(-DebugDraw_1.g_camera.m_center.x, -DebugDraw_1.g_camera.m_center.y);
                        this.m_test.Step(this.m_settings);
                        // #if B2_ENABLE_PARTICLE
                        // Update the state of the particle parameter.
                        let restartTest = [false];
                        Main.particleParameter.Changed(restartTest);
                        // #endif
                        // #if B2_ENABLE_PARTICLE
                        let msg = TestEntries_1.g_testEntries[this.m_test_index].name;
                        if (Main.fullscreenUI.GetParticleParameterSelectionEnabled()) {
                            msg += " : ";
                            msg += Main.particleParameter.GetName();
                        }
                        this.m_test.DrawTitle(msg);
                        // #else
                        // this.m_test.DrawTitle(g_testEntries[this.m_test_index].name);
                        // #endif
                        // ctx.strokeStyle = "yellow";
                        // ctx.strokeRect(mouse_world.x - 0.5, mouse_world.y - 0.5, 1.0, 1.0);
                        ctx.restore();
                        // #if B2_ENABLE_PARTICLE
                        if (restartTest[0]) {
                            this.LoadTest(true);
                        }
                        // #endif
                        this.UpdateTest(time_elapsed);
                    }
                }
                // #if B2_ENABLE_PARTICLE
                /**
                 * Set whether to restart the test on particle parameter
                 * changes. This parameter is re-enabled when the test changes.
                 */
                static SetRestartOnParticleParameterChange(enable) {
                    Main.particleParameter.SetRestartOnChange(enable);
                }
                /**
                 * Set the currently selected particle parameter value.  This
                 * value must match one of the values in
                 * Main::k_particleTypes or one of the values referenced by
                 * particleParameterDef passed to SetParticleParameters().
                 */
                static SetParticleParameterValue(value) {
                    const index = Main.particleParameter.FindIndexByValue(value);
                    // If the particle type isn't found, so fallback to the first entry in the
                    // parameter.
                    Main.particleParameter.Set(index >= 0 ? index : 0);
                    return Main.particleParameter.GetValue();
                }
                /**
                 * Get the currently selected particle parameter value and
                 * enable particle parameter selection arrows on Android.
                 */
                static GetParticleParameterValue() {
                    // Enable display of particle type selection arrows.
                    Main.fullscreenUI.SetParticleParameterSelectionEnabled(true);
                    return Main.particleParameter.GetValue();
                }
                /**
                 * Override the default particle parameters for the test.
                 */
                static SetParticleParameters(particleParameterDef, particleParameterDefCount = particleParameterDef.length) {
                    Main.particleParameter.SetDefinition(particleParameterDef, particleParameterDefCount);
                }
            };
            // #if B2_ENABLE_PARTICLE
            Main.fullscreenUI = new FullscreenUI_1.FullScreenUI();
            Main.particleParameter = new ParticleParameter_1.ParticleParameter();
            exports_1("Main", Main);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFPQSxTQUFTO1lBRVQsT0FBQTtnQkE2QkU7b0JBekJBLFNBQVM7b0JBQ0YsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUN6QixVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUdsQixlQUFVLEdBQWEsSUFBSSxlQUFRLEVBQUUsQ0FBQztvQkFFdEMsaUJBQVksR0FBVyxDQUFDLENBQUM7b0JBRXpCLFlBQU8sR0FBWSxLQUFLLENBQUM7b0JBQ3pCLFdBQU0sR0FBWSxLQUFLLENBQUM7b0JBQ3hCLGlCQUFZLEdBQVksS0FBSyxDQUFDO29CQUM5QixpQkFBWSxHQUFZLEtBQUssQ0FBQztvQkFDOUIsa0JBQWEsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pELGtCQUFhLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNqRCxnQkFBVyxHQUFZLEtBQUssQ0FBQztvQkFDN0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLG9CQUFlLEdBQVcsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFHcEMsVUFBSyxHQUFvQyxJQUFJLENBQUM7b0JBdU83QyxZQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBbk9uQyxNQUFNLE9BQU8sR0FBbUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztvQkFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJ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