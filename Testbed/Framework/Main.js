System.register(["Box2D", "./Test", "./DebugDraw", "../Tests/TestEntries"], function (exports_1, context_1) {
    "use strict";
    var box2d, Test_1, DebugDraw_1, TestEntries_1, Main;
    var __moduleName = context_1 && context_1.id;
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
            }
        ],
        execute: function () {
            Main = class Main {
                constructor(time) {
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
                    title_div.innerHTML = "Box2D Testbed version " + box2d.b2_version + "<br>(branch: " + box2d.b2_branch + " commit: " + box2d.b2_commit + ")";
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
                        button_input.style.width = "120";
                        button_input.value = label;
                        button_input.addEventListener("click", callback);
                        parent.appendChild(button_input);
                        parent.appendChild(document.createElement("br"));
                        return button_input;
                    }
                    const button_div = controls_div.appendChild(document.createElement("div"));
                    button_div.align = "center";
                    connect_button_input(button_div, "Pause (P)", (e) => { this.Pause(); });
                    connect_button_input(button_div, "Single Step (O)", (e) => { this.SingleStep(); });
                    connect_button_input(button_div, "Restart (R)", (e) => { this.LoadTest(); });
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
                    this.m_time_last = time;
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
                        if (this.m_test) {
                            this.m_test.MouseMove(world);
                        }
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
                                if (this.m_test) {
                                    this.m_test.ShiftMouseDown(world);
                                }
                            }
                            else {
                                if (this.m_test) {
                                    this.m_test.MouseDown(world);
                                }
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
                            if (this.m_test) {
                                this.m_test.MouseUp(world);
                            }
                            break;
                        case 3: // right mouse button
                            this.m_rMouseDown = false;
                            break;
                    }
                }
                HandleTouchMove(e) {
                    const element = new box2d.b2Vec2(e.touches[0].clientX, e.touches[0].clientY);
                    const world = DebugDraw_1.g_camera.ConvertScreenToWorld(element, new box2d.b2Vec2());
                    if (this.m_test) {
                        this.m_test.MouseMove(world);
                    }
                    e.preventDefault();
                }
                HandleTouchStart(e) {
                    const element = new box2d.b2Vec2(e.touches[0].clientX, e.touches[0].clientY);
                    const world = DebugDraw_1.g_camera.ConvertScreenToWorld(element, new box2d.b2Vec2());
                    if (this.m_test) {
                        this.m_test.MouseDown(world);
                    }
                    e.preventDefault();
                }
                HandleTouchEnd(e) {
                    if (this.m_test) {
                        this.m_test.MouseUp(this.m_test.m_mouseWorld);
                    }
                    e.preventDefault();
                }
                HandleMouseWheel(e) {
                    if (e.deltaY > 0) {
                        this.ZoomCamera(1 / 1.1);
                    }
                    else if (e.deltaY < 0) {
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
                        case "o":
                            this.SingleStep();
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
                                Test_1.Test.particleParameter.Decrement();
                            }
                            break;
                        case ".":
                            if (this.m_shift) {
                                // Press > to select the next particle parameter setting.
                                Test_1.Test.particleParameter.Increment();
                            }
                            break;
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
                    Test_1.Test.fullscreenUI.Reset();
                    if (!restartTest) {
                        Test_1.Test.particleParameter.Reset();
                    }
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
                SimulationLoop(time) {
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
                        // #if B2_ENABLE_PARTICLE
                        const restartTest = [false];
                        // #endif
                        if (ctx) {
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
                            if (this.m_test) {
                                this.m_test.Step(this.m_settings);
                            }
                            // #if B2_ENABLE_PARTICLE
                            // Update the state of the particle parameter.
                            Test_1.Test.particleParameter.Changed(restartTest);
                            // #endif
                            // #if B2_ENABLE_PARTICLE
                            let msg = TestEntries_1.g_testEntries[this.m_test_index].name;
                            if (Test_1.Test.fullscreenUI.GetParticleParameterSelectionEnabled()) {
                                msg += " : ";
                                msg += Test_1.Test.particleParameter.GetName();
                            }
                            if (this.m_test) {
                                this.m_test.DrawTitle(msg);
                            }
                            // #else
                            // if (this.m_test) { this.m_test.DrawTitle(g_testEntries[this.m_test_index].name); }
                            // #endif
                            // ctx.strokeStyle = "yellow";
                            // ctx.strokeRect(mouse_world.x - 0.5, mouse_world.y - 0.5, 1.0, 1.0);
                            ctx.restore();
                        }
                        // #if B2_ENABLE_PARTICLE
                        if (restartTest[0]) {
                            this.LoadTest(true);
                        }
                        // #endif
                        this.UpdateTest(time_elapsed);
                    }
                }
            };
            exports_1("Main", Main);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFLQSxPQUFBLE1BQWEsSUFBSTtnQkF5QmYsWUFBWSxJQUFZO29CQXhCakIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUN6QixVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUdULGVBQVUsR0FBYSxJQUFJLGVBQVEsRUFBRSxDQUFDO29CQUUvQyxpQkFBWSxHQUFXLENBQUMsQ0FBQztvQkFFekIsWUFBTyxHQUFZLEtBQUssQ0FBQztvQkFDekIsV0FBTSxHQUFZLEtBQUssQ0FBQztvQkFDeEIsaUJBQVksR0FBWSxLQUFLLENBQUM7b0JBQzlCLGlCQUFZLEdBQVksS0FBSyxDQUFDO29CQUNyQixrQkFBYSxHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDakQsa0JBQWEsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzFELGdCQUFXLEdBQVksS0FBSyxDQUFDO29CQUM3QixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDeEIsb0JBQWUsR0FBVyxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUdwQyxVQUFLLEdBQW9DLElBQUksQ0FBQztvQkF1TzdDLFlBQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFuT25DLE1BQU0sT0FBTyxHQUFtQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDMUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO29CQUNwQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsb0JBQW9CLENBQUM7b0JBQ3JELE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDOUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7b0JBQ3hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDN0IsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7b0JBRTFCLE1BQU0sU0FBUyxHQUFtQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDOUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO29CQUN0QyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQzdCLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDL0IsU0FBUyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsb0JBQW9CLENBQUM7b0JBQ3ZELFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztvQkFDaEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7b0JBQzFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDL0IsU0FBUyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBRXpCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7b0JBRTlDLE1BQU0sUUFBUSxHQUFtQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzFGLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLDRCQUE0QjtvQkFDbEUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO29CQUM1QixRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7b0JBRTNCLFNBQVMsZUFBZTt3QkFDdEIsNkRBQTZEO3dCQUM3RCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzt3QkFDaEQsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7b0JBQ3BELENBQUM7b0JBQ0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLENBQVUsRUFBUSxFQUFFLEdBQUcsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBUSxFQUFRLEVBQUUsR0FBRyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6RixlQUFlLEVBQUUsQ0FBQztvQkFFbEIsTUFBTSxTQUFTLEdBQW1CLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN0RixTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7b0JBQ3JDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztvQkFDL0IsU0FBUyxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsR0FBRyxLQUFLLENBQUMsVUFBVSxHQUFHLGVBQWUsR0FBRyxLQUFLLENBQUMsU0FBUyxHQUFHLFdBQVcsR0FBRyxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztvQkFFNUksTUFBTSxRQUFRLEdBQW1CLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUVyRixNQUFNLFVBQVUsR0FBbUIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDM0csVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLENBQUMsdUJBQXVCO29CQUMvRCxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQzlCLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDL0IsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO29CQUM3QixVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7b0JBRWhDLE1BQU0sU0FBUyxHQUFzQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUVqSCxTQUFTLGFBQWE7d0JBQ3BCLHVFQUF1RTt3QkFDdkUsSUFBSSxTQUFTLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQyxXQUFXLEVBQUU7NEJBQzlDLG9CQUFRLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQzt5QkFDN0Q7d0JBQ0QsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxZQUFZLEVBQUU7NEJBQ2hELG9CQUFRLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQzt5QkFDaEU7b0JBQ0gsQ0FBQztvQkFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBVSxFQUFRLEVBQUUsR0FBRyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFRLEVBQVEsRUFBRSxHQUFHLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZGLGFBQWEsRUFBRSxDQUFDO29CQUVoQix1QkFBVyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVuRSxNQUFNLFlBQVksR0FBbUIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3pGLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxDQUFDLHVCQUF1QjtvQkFDakUsWUFBWSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsdUJBQXVCLENBQUM7b0JBQzdELFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDbkMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO29CQUNqQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7b0JBQy9CLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFDbEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO29CQUV4QyxtQkFBbUI7b0JBQ25CLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDdkQsTUFBTSxXQUFXLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3hFLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRywyQkFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDckQsTUFBTSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ25FLE1BQU0sQ0FBQyxJQUFJLEdBQUcsMkJBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3BDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUM1QixXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUN6QjtvQkFDRCxXQUFXLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQzlDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFRLEVBQVEsRUFBRTt3QkFDeEQsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDO3dCQUM5QyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2xCLENBQUMsQ0FBQyxDQUFDO29CQUNILFlBQVksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDO29CQUNqQyxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFFdkQsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBRXZELDJCQUEyQjtvQkFDM0IsU0FBUyxvQkFBb0IsQ0FBQyxNQUFZLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxNQUErQixFQUFFLEdBQVcsRUFBRSxHQUFXLEVBQUUsSUFBWTt3QkFDOUksTUFBTSxlQUFlLEdBQXdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUM5RixNQUFNLGdCQUFnQixHQUE2QixlQUFlLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDN0csZ0JBQWdCLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQzt3QkFDakMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDN0QsTUFBTSxnQkFBZ0IsR0FBNkIsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQzdHLE1BQU0sWUFBWSxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN2RSxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDdEIsWUFBWSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ2xDLFlBQVksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUNsQyxZQUFZLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDcEMsWUFBWSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ3JDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFRLEVBQVEsRUFBRTs0QkFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLENBQUMsQ0FBQyxDQUFDO3dCQUNILGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDM0MsT0FBTyxZQUFZLENBQUM7b0JBQ3RCLENBQUM7b0JBRUQsTUFBTSxrQkFBa0IsR0FBcUIsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3ZHLG9CQUFvQixDQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUMsS0FBYSxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUM5SyxvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQWEsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDOUsseUJBQXlCO29CQUN6QixvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQWEsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDL0ssU0FBUztvQkFDVCxvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFhLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUU1SSw2QkFBNkI7b0JBQzdCLFNBQVMsc0JBQXNCLENBQUMsTUFBWSxFQUFFLEtBQWEsRUFBRSxJQUFhLEVBQUUsTUFBZ0M7d0JBQzFHLE1BQU0sY0FBYyxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN6RSxjQUFjLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzt3QkFDakMsY0FBYyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7d0JBQzlCLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFhLEVBQVEsRUFBRTs0QkFDL0QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDakMsQ0FBQyxDQUFDLENBQUM7d0JBQ0gsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDbkMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ25ELE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNqRCxPQUFPLGNBQWMsQ0FBQztvQkFDeEIsQ0FBQztvQkFFRCxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBYyxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0ksc0JBQXNCLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUMsS0FBYyxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNySyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEtBQWMsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEssc0JBQXNCLENBQUMsWUFBWSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUMsS0FBYyxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsSyx5QkFBeUI7b0JBQ3pCLHNCQUFzQixDQUFDLFlBQVksRUFBRSwrQkFBK0IsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQWMsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdLLFNBQVM7b0JBRVQsdUJBQXVCO29CQUN2QixNQUFNLGFBQWEsR0FBd0IsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hHLE1BQU0sV0FBVyxHQUFzQixhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbkcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3pELHNCQUFzQixDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFjLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvSSx5QkFBeUI7b0JBQ3pCLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxLQUFjLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4SixTQUFTO29CQUNULHNCQUFzQixDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFjLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvSSxzQkFBc0IsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBYyxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUksc0JBQXNCLENBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxLQUFjLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JLLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixFQUFFLENBQUMsS0FBYyxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4SyxzQkFBc0IsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQWMsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekssc0JBQXNCLENBQUMsYUFBYSxFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxLQUFjLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVLLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQWMsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JKLHNCQUFzQixDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFjLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqSixzQkFBc0IsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBYyxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbEoscUJBQXFCO29CQUNyQixTQUFTLG9CQUFvQixDQUFDLE1BQVksRUFBRSxLQUFhLEVBQUUsUUFBaUM7d0JBQzFGLE1BQU0sWUFBWSxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN2RSxZQUFZLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQzt3QkFDN0IsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNqQyxZQUFZLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzt3QkFDM0IsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDakQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDakMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2pELE9BQU8sWUFBWSxDQUFDO29CQUN0QixDQUFDO29CQUVELE1BQU0sVUFBVSxHQUFtQixZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDM0YsVUFBVSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7b0JBQzVCLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFhLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxRixvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFhLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyRyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBYSxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0YsSUFBSSxDQUFDLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBYSxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFL0csMENBQTBDO29CQUMxQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBYSxFQUFRLEVBQUUsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRS9GLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFhLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQWEsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBYSxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVGLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFRLEVBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFaEgsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDLENBQWEsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBYSxFQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxDQUFDLENBQWEsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU5RixNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBZ0IsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBZ0IsRUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV2RixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBRWhCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixDQUFDO2dCQUVNLFVBQVU7b0JBQ2Ysb0JBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzdFLG9CQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLG9CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQy9DLGlEQUFpRDtnQkFDbkQsQ0FBQztnQkFFTSxVQUFVLENBQUMsSUFBa0I7b0JBQ2xDLE1BQU0sUUFBUSxHQUFpQixvQkFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDekQsK0NBQStDO29CQUMvQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2QixvQkFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBRUQsMENBQTBDO2dCQUMxQyxzREFBc0Q7Z0JBQ3RELDRDQUE0QztnQkFDNUMsSUFBSTtnQkFFRyxVQUFVLENBQUMsSUFBWTtvQkFDNUIsb0JBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO29CQUN4QixvQkFBUSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLG9CQUFRLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFJTSxlQUFlLENBQUMsQ0FBYTtvQkFDbEMsTUFBTSxPQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckUsTUFBTSxLQUFLLEdBQWlCLG9CQUFRLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBRXZGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUUzQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7d0JBQ3JCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTs0QkFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzt5QkFBRTtxQkFDbkQ7b0JBRUQsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO3dCQUNyQix1REFBdUQ7d0JBQ3ZELE1BQU0sVUFBVSxHQUFpQixvQkFBUSxDQUFDLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dCQUNsRyxNQUFNLElBQUksR0FBaUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFDbEcsTUFBTSxNQUFNLEdBQWlCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7d0JBQzlGLG9CQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDaEM7Z0JBQ0gsQ0FBQztnQkFFTSxlQUFlLENBQUMsQ0FBYTtvQkFDbEMsTUFBTSxPQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckUsTUFBTSxLQUFLLEdBQWlCLG9CQUFRLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBRXZGLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRTt3QkFDakIsS0FBSyxDQUFDLEVBQUUsb0JBQW9COzRCQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs0QkFDekIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dDQUNoQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0NBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7aUNBQUU7NkJBQ3hEO2lDQUFNO2dDQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQ0FBRTs2QkFDbkQ7NEJBQ0QsTUFBTTt3QkFDUixLQUFLLENBQUMsRUFBRSxxQkFBcUI7NEJBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDOzRCQUN6QixNQUFNLFVBQVUsR0FBaUIsb0JBQVEsQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzs0QkFDbEcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7NEJBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG9CQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQzNDLE1BQU07cUJBQ1A7Z0JBQ0gsQ0FBQztnQkFFTSxhQUFhLENBQUMsQ0FBYTtvQkFDaEMsTUFBTSxPQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDckUsTUFBTSxLQUFLLEdBQWlCLG9CQUFRLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7b0JBRXZGLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRTt3QkFDakIsS0FBSyxDQUFDLEVBQUUsb0JBQW9COzRCQUMxQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQzs0QkFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOzZCQUFFOzRCQUNoRCxNQUFNO3dCQUNSLEtBQUssQ0FBQyxFQUFFLHFCQUFxQjs0QkFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7NEJBQzFCLE1BQU07cUJBQ1A7Z0JBQ0gsQ0FBQztnQkFFTSxlQUFlLENBQUMsQ0FBYTtvQkFDbEMsTUFBTSxPQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMzRixNQUFNLEtBQUssR0FBaUIsb0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztvQkFDdkYsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUFFO29CQUNsRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sZ0JBQWdCLENBQUMsQ0FBYTtvQkFDbkMsTUFBTSxPQUFPLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMzRixNQUFNLEtBQUssR0FBaUIsb0JBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztvQkFDdkYsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUFFO29CQUNsRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sY0FBYyxDQUFDLENBQWE7b0JBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUFFO29CQUNuRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sZ0JBQWdCLENBQUMsQ0FBa0I7b0JBQ3hDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO3FCQUMxQjt5QkFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN0QjtvQkFDRCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRU0sYUFBYSxDQUFDLENBQWdCO29CQUNuQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEVBQUU7d0JBQ2YsS0FBSyxTQUFTOzRCQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzRCQUNuQixNQUFNO3dCQUNSLEtBQUssT0FBTzs0QkFDVixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs0QkFDcEIsTUFBTTt3QkFDUixLQUFLLFdBQVc7NEJBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dDQUNmLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQ0FDZixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQ2pEOzZCQUNGO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQzVDOzRCQUNELE1BQU07d0JBQ1IsS0FBSyxZQUFZOzRCQUNmLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQ0FDZixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0NBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQ2xEOzZCQUNGO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUMzQzs0QkFDRCxNQUFNO3dCQUNSLEtBQUssV0FBVzs0QkFDZCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0NBQ2YsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29DQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDakQ7NkJBQ0Y7aUNBQU07Z0NBQ0wsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs2QkFDNUM7NEJBQ0QsTUFBTTt3QkFDUixLQUFLLFNBQVM7NEJBQ1osSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dDQUNmLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQ0FDZixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDbEQ7NkJBQ0Y7aUNBQU07Z0NBQ0wsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7NkJBQzNDOzRCQUNELE1BQU07d0JBQ1IsS0FBSyxNQUFNOzRCQUNULElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs0QkFDbEIsTUFBTTt3QkFDUixpQkFBaUI7d0JBQ2pCLDJDQUEyQzt3QkFDM0MsV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLDBDQUEwQzt3QkFDMUMsV0FBVzt3QkFDWCxLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDckIsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDckIsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzRCQUNoQixNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0NBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQzs2QkFDMUI7NEJBQ0QsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOzRCQUNsQixNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7NEJBQ2IsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDOzRCQUNyQixNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7NEJBQ3JCLE1BQU07d0JBQ1IseUJBQXlCO3dCQUN6QixLQUFLLEdBQUc7NEJBQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dDQUNoQiw2REFBNkQ7Z0NBQzdELFdBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs2QkFDcEM7NEJBQ0QsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dDQUNoQix5REFBeUQ7Z0NBQ3pELFdBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs2QkFDcEM7NEJBQ0QsTUFBTTt3QkFDUixTQUFTO3dCQUNUOzRCQUNFLDBCQUEwQjs0QkFDMUIsTUFBTTtxQkFDUDtvQkFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUM3QjtnQkFDSCxDQUFDO2dCQUVNLFdBQVcsQ0FBQyxDQUFnQjtvQkFDakMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFO3dCQUNmLEtBQUssU0FBUzs0QkFDWixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs0QkFDcEIsTUFBTTt3QkFDUixLQUFLLE9BQU87NEJBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7NEJBQ3JCLE1BQU07d0JBQ1I7NEJBQ0UsMEJBQTBCOzRCQUMxQixNQUFNO3FCQUNQO29CQUVELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQy9CO2dCQUNILENBQUM7Z0JBRU0sVUFBVSxDQUFDLFlBQW9CO29CQUNwQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7d0JBQ3BCLElBQUksQ0FBQyxXQUFXLElBQUksWUFBWSxDQUFDO3dCQUVqQyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRTs0QkFDM0MsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO3lCQUN0Qjt3QkFFRCxNQUFNLEdBQUcsR0FBVyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDbkcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO3FCQUNoQzt5QkFBTTt3QkFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7cUJBQ25DO2dCQUNILENBQUM7Z0JBRU0sYUFBYTtvQkFDbEIsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsRUFBRTt3QkFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRywyQkFBYSxDQUFDLE1BQU0sQ0FBQztxQkFDMUM7b0JBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO29CQUNyRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2xCLENBQUM7Z0JBRU0sYUFBYTtvQkFDbEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNwQixJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksMkJBQWEsQ0FBQyxNQUFNLEVBQUU7d0JBQzdDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO3FCQUN2QjtvQkFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO29CQUNyRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2xCLENBQUM7Z0JBRU0sUUFBUSxDQUFDLGNBQXVCLEtBQUs7b0JBQzFDLHlCQUF5QjtvQkFDekIsV0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFBRSxXQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBQ3JELFNBQVM7b0JBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7b0JBQ3JCLHlCQUF5QjtvQkFDekIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMseUJBQXlCLEVBQUUsQ0FBQztxQkFDekM7b0JBQ0QsU0FBUztvQkFDVCxJQUFJLENBQUMsTUFBTSxHQUFHLDJCQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUMzRCxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUNoQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7cUJBQ25CO2dCQUNILENBQUM7Z0JBRU0sS0FBSztvQkFDVixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqRCxDQUFDO2dCQUVNLFVBQVU7b0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO29CQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3BDLENBQUM7Z0JBRU0sVUFBVTtvQkFDZixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDdkMsQ0FBQztnQkFFTSxjQUFjLENBQUMsSUFBWTtvQkFDaEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztvQkFFNUMsSUFBSSxZQUFZLEdBQVcsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ25ELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO29CQUV4QixJQUFJLFlBQVksR0FBRyxJQUFJLEVBQUU7d0JBQUUsWUFBWSxHQUFHLElBQUksQ0FBQztxQkFBRSxDQUFDLFFBQVE7b0JBRTFELElBQUksQ0FBQyxVQUFVLElBQUksWUFBWSxDQUFDO29CQUNoQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBRXBCLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7d0JBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7d0JBQzFELElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO3dCQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzt3QkFFcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQzdEO29CQUVELElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTt3QkFDcEIsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7d0JBRXhELHlCQUF5Qjt3QkFDekIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDNUIsU0FBUzt3QkFFVCxJQUFJLEdBQUcsRUFBRTs0QkFDUCxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFFekQsNEJBQTRCOzRCQUM1QixvRUFBb0U7NEJBRXBFLHFHQUFxRzs0QkFFckcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOzRCQUVULHlDQUF5Qzs0QkFDM0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQy9ELEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2YsbURBQW1EOzRCQUNuRCxzQ0FBc0M7NEJBQ3hDLE1BQU0sQ0FBQyxHQUFXLEdBQUcsR0FBRyxvQkFBUSxDQUFDLFFBQVEsR0FBRyxvQkFBUSxDQUFDLFFBQVEsQ0FBQzs0QkFDOUQsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2hCLEdBQUcsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDOzRCQUVqQixlQUFlOzRCQUNqQixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxvQkFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsb0JBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDcEQsR0FBRyxDQUFDLFNBQVMsSUFBSSxvQkFBUSxDQUFDLE1BQU0sQ0FBQzs0QkFDL0IsMkNBQTJDOzRCQUM3QyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsb0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsb0JBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBRTFELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQ0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQUU7NEJBRXZELHlCQUF5Qjs0QkFDekIsOENBQThDOzRCQUM5QyxXQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzRCQUM1QyxTQUFTOzRCQUVULHlCQUF5Qjs0QkFDekIsSUFBSSxHQUFHLEdBQUcsMkJBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDOzRCQUNoRCxJQUFJLFdBQUksQ0FBQyxZQUFZLENBQUMsb0NBQW9DLEVBQUUsRUFBRTtnQ0FDNUQsR0FBRyxJQUFJLEtBQUssQ0FBQztnQ0FDYixHQUFHLElBQUksV0FBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDOzZCQUN6Qzs0QkFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0NBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7NkJBQUU7NEJBQ2hELFFBQVE7NEJBQ1IscUZBQXFGOzRCQUNyRixTQUFTOzRCQUVULDhCQUE4Qjs0QkFDOUIsc0VBQXNFOzRCQUV0RSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7eUJBQ2Y7d0JBRUQseUJBQXlCO3dCQUN6QixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDckI7d0JBQ0QsU0FBUzt3QkFFVCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUMvQjtnQkFDSCxDQUFDO2FBQ0YsQ0FBQSJ9