System.register(["@box2d", "./settings.js", "./test.js", "./draw.js", "./tests/test_entries.js"], function (exports_1, context_1) {
    "use strict";
    var b2, settings_js_1, test_js_1, draw_js_1, test_entries_js_1, Main;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (settings_js_1_1) {
                settings_js_1 = settings_js_1_1;
            },
            function (test_js_1_1) {
                test_js_1 = test_js_1_1;
            },
            function (draw_js_1_1) {
                draw_js_1 = draw_js_1_1;
            },
            function (test_entries_js_1_1) {
                test_entries_js_1 = test_entries_js_1_1;
            }
        ],
        execute: function () {
            Main = class Main {
                constructor(time) {
                    this.m_time_last = 0;
                    this.m_fps_time = 0;
                    this.m_fps_frames = 0;
                    this.m_fps = 0;
                    this.m_settings = new settings_js_1.Settings();
                    this.m_shift = false;
                    this.m_ctrl = false;
                    this.m_lMouseDown = false;
                    this.m_rMouseDown = false;
                    this.m_projection0 = new b2.Vec2();
                    this.m_viewCenter0 = new b2.Vec2();
                    this.m_demo_mode = false;
                    this.m_demo_time = 0;
                    this.m_max_demo_time = 1000 * 10;
                    this.m_ctx = null;
                    this.m_mouse = new b2.Vec2();
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
                    document.body.style.backgroundColor = "rgba(51, 51, 51, 1.0)";
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
                    title_div.innerHTML = "Box2D Testbed version " + b2.version.toString();
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
                            draw_js_1.g_camera.m_width = canvas_2d.width = canvas_div.clientWidth;
                        }
                        if (canvas_2d.height !== canvas_div.clientHeight) {
                            draw_js_1.g_camera.m_height = canvas_2d.height = canvas_div.clientHeight;
                        }
                    }
                    window.addEventListener("resize", (e) => { resize_canvas(); });
                    window.addEventListener("orientationchange", (e) => { resize_canvas(); });
                    resize_canvas();
                    draw_js_1.g_debugDraw.m_ctx = this.m_ctx = this.m_canvas_2d.getContext("2d");
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
                    for (let i = 0; i < test_entries_js_1.g_testEntries.length; ++i) {
                        const option = document.createElement("option");
                        option.text = test_entries_js_1.g_testEntries[i].name;
                        option.value = i.toString();
                        test_select.add(option);
                    }
                    test_select.selectedIndex = this.m_settings.m_testIndex;
                    test_select.addEventListener("change", (e) => {
                        this.m_settings.m_testIndex = test_select.selectedIndex;
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
                    connect_number_input(number_input_table, "Vel Iters", this.m_settings.m_velocityIterations, (value) => { this.m_settings.m_velocityIterations = value; }, 1, 20, 1);
                    connect_number_input(number_input_table, "Pos Iters", this.m_settings.m_positionIterations, (value) => { this.m_settings.m_positionIterations = value; }, 1, 20, 1);
                    // #if B2_ENABLE_PARTICLE
                    connect_number_input(number_input_table, "Pcl Iters", this.m_settings.m_particleIterations, (value) => { this.m_settings.m_particleIterations = value; }, 1, 100, 1);
                    // #endif
                    connect_number_input(number_input_table, "Hertz", this.m_settings.m_hertz, (value) => { this.m_settings.m_hertz = value; }, 10, 120, 1);
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
                    connect_checkbox_input(controls_div, "Sleep", this.m_settings.m_enableSleep, (value) => { this.m_settings.m_enableSleep = value; });
                    connect_checkbox_input(controls_div, "Warm Starting", this.m_settings.m_enableWarmStarting, (value) => { this.m_settings.m_enableWarmStarting = value; });
                    connect_checkbox_input(controls_div, "Time of Impact", this.m_settings.m_enableContinuous, (value) => { this.m_settings.m_enableContinuous = value; });
                    connect_checkbox_input(controls_div, "Sub-Stepping", this.m_settings.m_enableSubStepping, (value) => { this.m_settings.m_enableSubStepping = value; });
                    // #if B2_ENABLE_PARTICLE
                    connect_checkbox_input(controls_div, "Strict Particle/Body Contacts", this.m_settings.m_strictContacts, (value) => { this.m_settings.m_strictContacts = value; });
                    // #endif
                    // draw checkbox inputs
                    const draw_fieldset = controls_div.appendChild(document.createElement("fieldset"));
                    const draw_legend = draw_fieldset.appendChild(document.createElement("legend"));
                    draw_legend.appendChild(document.createTextNode("Draw"));
                    connect_checkbox_input(draw_fieldset, "Shapes", this.m_settings.m_drawShapes, (value) => { this.m_settings.m_drawShapes = value; });
                    // #if B2_ENABLE_PARTICLE
                    connect_checkbox_input(draw_fieldset, "Particles", this.m_settings.m_drawParticles, (value) => { this.m_settings.m_drawParticles = value; });
                    // #endif
                    connect_checkbox_input(draw_fieldset, "Joints", this.m_settings.m_drawJoints, (value) => { this.m_settings.m_drawJoints = value; });
                    connect_checkbox_input(draw_fieldset, "AABBs", this.m_settings.m_drawAABBs, (value) => { this.m_settings.m_drawAABBs = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Points", this.m_settings.m_drawContactPoints, (value) => { this.m_settings.m_drawContactPoints = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Normals", this.m_settings.m_drawContactNormals, (value) => { this.m_settings.m_drawContactNormals = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Impulses", this.m_settings.m_drawContactImpulse, (value) => { this.m_settings.m_drawContactImpulse = value; });
                    connect_checkbox_input(draw_fieldset, "Friction Impulses", this.m_settings.m_drawFrictionImpulse, (value) => { this.m_settings.m_drawFrictionImpulse = value; });
                    connect_checkbox_input(draw_fieldset, "Center of Masses", this.m_settings.m_drawCOMs, (value) => { this.m_settings.m_drawCOMs = value; });
                    connect_checkbox_input(draw_fieldset, "Statistics", this.m_settings.m_drawStats, (value) => { this.m_settings.m_drawStats = value; });
                    connect_checkbox_input(draw_fieldset, "Profile", this.m_settings.m_drawProfile, (value) => { this.m_settings.m_drawProfile = value; });
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
                    draw_js_1.g_camera.m_zoom = (this.m_test) ? (this.m_test.GetDefaultViewZoom()) : (1.0);
                    draw_js_1.g_camera.m_center.Set(0, 20 * draw_js_1.g_camera.m_zoom);
                    ///g_camera.m_roll.SetAngle(b2.DegToRad(0));
                }
                MoveCamera(move) {
                    const position = draw_js_1.g_camera.m_center.Clone();
                    ///move.SelfRotate(g_camera.m_roll.GetAngle());
                    position.SelfAdd(move);
                    draw_js_1.g_camera.m_center.Copy(position);
                }
                ///public RollCamera(roll: number): void {
                ///  const angle: number = g_camera.m_roll.GetAngle();
                ///  g_camera.m_roll.SetAngle(angle + roll);
                ///}
                ZoomCamera(zoom) {
                    draw_js_1.g_camera.m_zoom *= zoom;
                    draw_js_1.g_camera.m_zoom = b2.Clamp(draw_js_1.g_camera.m_zoom, 0.02, 20);
                }
                HandleMouseMove(e) {
                    const element = new b2.Vec2(e.clientX, e.clientY);
                    const world = draw_js_1.g_camera.ConvertScreenToWorld(element, new b2.Vec2());
                    this.m_mouse.Copy(element);
                    if (this.m_lMouseDown) {
                        if (this.m_test) {
                            this.m_test.MouseMove(world);
                        }
                    }
                    if (this.m_rMouseDown) {
                        // m_center = viewCenter0 - (projection - projection0);
                        const projection = draw_js_1.g_camera.ConvertElementToProjection(element, new b2.Vec2());
                        const diff = b2.Vec2.SubVV(projection, this.m_projection0, new b2.Vec2());
                        const center = b2.Vec2.SubVV(this.m_viewCenter0, diff, new b2.Vec2());
                        draw_js_1.g_camera.m_center.Copy(center);
                    }
                }
                HandleMouseDown(e) {
                    const element = new b2.Vec2(e.clientX, e.clientY);
                    const world = draw_js_1.g_camera.ConvertScreenToWorld(element, new b2.Vec2());
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
                            const projection = draw_js_1.g_camera.ConvertElementToProjection(element, new b2.Vec2());
                            this.m_projection0.Copy(projection);
                            this.m_viewCenter0.Copy(draw_js_1.g_camera.m_center);
                            break;
                    }
                }
                HandleMouseUp(e) {
                    const element = new b2.Vec2(e.clientX, e.clientY);
                    const world = draw_js_1.g_camera.ConvertScreenToWorld(element, new b2.Vec2());
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
                    const element = new b2.Vec2(e.touches[0].clientX, e.touches[0].clientY);
                    const world = draw_js_1.g_camera.ConvertScreenToWorld(element, new b2.Vec2());
                    if (this.m_test) {
                        this.m_test.MouseMove(world);
                    }
                    e.preventDefault();
                }
                HandleTouchStart(e) {
                    const element = new b2.Vec2(e.touches[0].clientX, e.touches[0].clientY);
                    const world = draw_js_1.g_camera.ConvertScreenToWorld(element, new b2.Vec2());
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
                                    this.m_test.ShiftOrigin(new b2.Vec2(2, 0));
                                }
                            }
                            else {
                                this.MoveCamera(new b2.Vec2(-0.5, 0));
                            }
                            break;
                        case "ArrowRight":
                            if (this.m_ctrl) {
                                if (this.m_test) {
                                    this.m_test.ShiftOrigin(new b2.Vec2(-2, 0));
                                }
                            }
                            else {
                                this.MoveCamera(new b2.Vec2(0.5, 0));
                            }
                            break;
                        case "ArrowDown":
                            if (this.m_ctrl) {
                                if (this.m_test) {
                                    this.m_test.ShiftOrigin(new b2.Vec2(0, 2));
                                }
                            }
                            else {
                                this.MoveCamera(new b2.Vec2(0, -0.5));
                            }
                            break;
                        case "ArrowUp":
                            if (this.m_ctrl) {
                                if (this.m_test) {
                                    this.m_test.ShiftOrigin(new b2.Vec2(0, -2));
                                }
                            }
                            else {
                                this.MoveCamera(new b2.Vec2(0, 0.5));
                            }
                            break;
                        case "Home":
                            this.HomeCamera();
                            break;
                        ///case "PageUp":
                        ///  this.RollCamera(b2.DegToRad(-1));
                        ///  break;
                        ///case "PageDown":
                        ///  this.RollCamera(b2.DegToRad(1));
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
                                test_js_1.Test.particleParameter.Decrement();
                            }
                            break;
                        case ".":
                            if (this.m_shift) {
                                // Press > to select the next particle parameter setting.
                                test_js_1.Test.particleParameter.Increment();
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
                    if (this.m_settings.m_testIndex <= 0) {
                        this.m_settings.m_testIndex = test_entries_js_1.g_testEntries.length;
                    }
                    this.m_settings.m_testIndex--;
                    this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
                    this.LoadTest();
                }
                IncrementTest() {
                    this.m_settings.m_testIndex++;
                    if (this.m_settings.m_testIndex >= test_entries_js_1.g_testEntries.length) {
                        this.m_settings.m_testIndex = 0;
                    }
                    this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
                    this.LoadTest();
                }
                LoadTest(restartTest = false) {
                    // #if B2_ENABLE_PARTICLE
                    test_js_1.Test.fullscreenUI.Reset();
                    if (!restartTest) {
                        test_js_1.Test.particleParameter.Reset();
                    }
                    // #endif
                    this.m_demo_time = 0;
                    // #if B2_ENABLE_PARTICLE
                    if (this.m_test) {
                        this.m_test.RestoreParticleParameters();
                    }
                    // #endif
                    this.m_test = test_entries_js_1.g_testEntries[this.m_settings.m_testIndex].createFcn();
                    if (!restartTest) {
                        this.HomeCamera();
                    }
                }
                Pause() {
                    this.m_settings.m_pause = !this.m_settings.m_pause;
                }
                SingleStep() {
                    this.m_settings.m_pause = true;
                    this.m_settings.m_singleStep = true;
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
                            // const mouse_world: b2.Vec2 = g_camera.ConvertScreenToWorld(this.m_mouse, new b2.Vec2());
                            ctx.save();
                            // 0,0 at center of canvas, x right, y up
                            ctx.translate(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
                            ctx.scale(1, -1);
                            ///ctx.scale(g_camera.m_extent, g_camera.m_extent);
                            ///ctx.lineWidth /= g_camera.m_extent;
                            const s = 0.5 * draw_js_1.g_camera.m_height / draw_js_1.g_camera.m_extent;
                            ctx.scale(s, s);
                            ctx.lineWidth /= s;
                            // apply camera
                            ctx.scale(1 / draw_js_1.g_camera.m_zoom, 1 / draw_js_1.g_camera.m_zoom);
                            ctx.lineWidth *= draw_js_1.g_camera.m_zoom;
                            ///ctx.rotate(-g_camera.m_roll.GetAngle());
                            ctx.translate(-draw_js_1.g_camera.m_center.x, -draw_js_1.g_camera.m_center.y);
                            if (this.m_test) {
                                this.m_test.Step(this.m_settings);
                            }
                            // #if B2_ENABLE_PARTICLE
                            // Update the state of the particle parameter.
                            test_js_1.Test.particleParameter.Changed(restartTest);
                            // #endif
                            // #if B2_ENABLE_PARTICLE
                            let msg = test_entries_js_1.g_testEntries[this.m_settings.m_testIndex].name;
                            if (test_js_1.Test.fullscreenUI.GetParticleParameterSelectionEnabled()) {
                                msg += " : ";
                                msg += test_js_1.Test.particleParameter.GetName();
                            }
                            if (this.m_test) {
                                this.m_test.DrawTitle(msg);
                            }
                            // #else
                            // if (this.m_test) { this.m_test.DrawTitle(g_testEntries[this.m_settings.m_testIndex].name); }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFNQSxPQUFBLE1BQWEsSUFBSTtnQkF3QmYsWUFBWSxJQUFZO29CQXZCakIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGVBQVUsR0FBVyxDQUFDLENBQUM7b0JBQ3ZCLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUN6QixVQUFLLEdBQVcsQ0FBQyxDQUFDO29CQUdULGVBQVUsR0FBYSxJQUFJLHNCQUFRLEVBQUUsQ0FBQztvQkFHL0MsWUFBTyxHQUFZLEtBQUssQ0FBQztvQkFDekIsV0FBTSxHQUFZLEtBQUssQ0FBQztvQkFDeEIsaUJBQVksR0FBWSxLQUFLLENBQUM7b0JBQzlCLGlCQUFZLEdBQVksS0FBSyxDQUFDO29CQUNyQixrQkFBYSxHQUFZLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUN2QyxrQkFBYSxHQUFZLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNoRCxnQkFBVyxHQUFZLEtBQUssQ0FBQztvQkFDN0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLG9CQUFlLEdBQVcsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFHcEMsVUFBSyxHQUFvQyxJQUFJLENBQUM7b0JBdU83QyxZQUFPLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBbk85QixNQUFNLE9BQU8sR0FBbUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQzFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztvQkFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO29CQUMzQixPQUFPLENB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