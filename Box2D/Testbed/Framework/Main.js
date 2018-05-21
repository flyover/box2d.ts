System.register(["../../Box2D/Box2D", "./Test", "./DebugDraw", "../Tests/TestEntries", "./FullscreenUI", "./ParticleParameter"], function (exports_1, context_1) {
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
            ///#endif
            Main = class Main {
                constructor() {
                    ///#endif
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
                    this.m_mouse = new box2d.b2Vec2();
                    const that = this; // for callbacks
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
                    window.addEventListener("resize", function (e) { resize_main_div(); });
                    window.addEventListener("orientationchange", function (e) { resize_main_div(); });
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
                    const canvas = this.m_canvas = canvas_div.appendChild(document.createElement("canvas"));
                    function resize_canvas() {
                        ///console.log(canvas_div.clientWidth + "x" + canvas_div.clientHeight);
                        if (canvas.width !== canvas_div.clientWidth) {
                            DebugDraw_1.g_camera.m_width = canvas.width = canvas_div.clientWidth;
                        }
                        if (canvas.height !== canvas_div.clientHeight) {
                            DebugDraw_1.g_camera.m_height = canvas.height = canvas_div.clientHeight;
                        }
                    }
                    window.addEventListener("resize", function (e) { resize_canvas(); });
                    window.addEventListener("orientationchange", function (e) { resize_canvas(); });
                    resize_canvas();
                    DebugDraw_1.g_debugDraw.m_ctx = this.m_ctx = this.m_canvas.getContext("2d");
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
                    test_select.addEventListener("change", function (e) {
                        that.m_test_index = test_select.selectedIndex;
                        that.LoadTest();
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
                        number_input.addEventListener("change", function (e) {
                            update(parseInt(number_input.value, 10));
                        });
                        number_input_td1.appendChild(number_input);
                        return number_input;
                    }
                    const number_input_table = controls_div.appendChild(document.createElement("table"));
                    connect_number_input(number_input_table, "Vel Iters", this.m_settings.velocityIterations, function (value) { that.m_settings.velocityIterations = value; }, 1, 20, 1);
                    connect_number_input(number_input_table, "Pos Iters", this.m_settings.positionIterations, function (value) { that.m_settings.positionIterations = value; }, 1, 20, 1);
                    ///#if B2_ENABLE_PARTICLE
                    connect_number_input(number_input_table, "Pcl Iters", that.m_settings.particleIterations, function (value) { that.m_settings.particleIterations = value; }, 1, 100, 1);
                    ///#endif
                    connect_number_input(number_input_table, "Hertz", this.m_settings.hz, function (value) { that.m_settings.hz = value; }, 10, 120, 1);
                    // simulation checkbox inputs
                    function connect_checkbox_input(parent, label, init, update) {
                        const checkbox_input = document.createElement("input");
                        checkbox_input.type = "checkbox";
                        checkbox_input.checked = init;
                        checkbox_input.addEventListener("click", function (e) {
                            update(checkbox_input.checked);
                        });
                        parent.appendChild(checkbox_input);
                        parent.appendChild(document.createTextNode(label));
                        parent.appendChild(document.createElement("br"));
                        return checkbox_input;
                    }
                    connect_checkbox_input(controls_div, "Sleep", this.m_settings.enableSleep, function (value) { that.m_settings.enableSleep = value; });
                    connect_checkbox_input(controls_div, "Warm Starting", this.m_settings.enableWarmStarting, function (value) { that.m_settings.enableWarmStarting = value; });
                    connect_checkbox_input(controls_div, "Time of Impact", this.m_settings.enableContinuous, function (value) { that.m_settings.enableContinuous = value; });
                    connect_checkbox_input(controls_div, "Sub-Stepping", this.m_settings.enableSubStepping, function (value) { that.m_settings.enableSubStepping = value; });
                    ///#if B2_ENABLE_PARTICLE
                    connect_checkbox_input(controls_div, "Strict Particle/Body Contacts", that.m_settings.strictContacts, function (value) { that.m_settings.strictContacts = value; });
                    ///#endif
                    // draw checkbox inputs
                    const draw_fieldset = controls_div.appendChild(document.createElement("fieldset"));
                    const draw_legend = draw_fieldset.appendChild(document.createElement("legend"));
                    draw_legend.appendChild(document.createTextNode("Draw"));
                    connect_checkbox_input(draw_fieldset, "Shapes", this.m_settings.drawShapes, function (value) { that.m_settings.drawShapes = value; });
                    ///#if B2_ENABLE_PARTICLE
                    connect_checkbox_input(draw_fieldset, "Particles", that.m_settings.drawParticles, function (value) { that.m_settings.drawParticles = value; });
                    ///#endif
                    connect_checkbox_input(draw_fieldset, "Joints", this.m_settings.drawJoints, function (value) { that.m_settings.drawJoints = value; });
                    connect_checkbox_input(draw_fieldset, "AABBs", this.m_settings.drawAABBs, function (value) { that.m_settings.drawAABBs = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Points", this.m_settings.drawContactPoints, function (value) { that.m_settings.drawContactPoints = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Normals", this.m_settings.drawContactNormals, function (value) { that.m_settings.drawContactNormals = value; });
                    connect_checkbox_input(draw_fieldset, "Contact Impulses", this.m_settings.drawContactImpulse, function (value) { that.m_settings.drawContactImpulse = value; });
                    connect_checkbox_input(draw_fieldset, "Friction Impulses", this.m_settings.drawFrictionImpulse, function (value) { that.m_settings.drawFrictionImpulse = value; });
                    connect_checkbox_input(draw_fieldset, "Center of Masses", this.m_settings.drawCOMs, function (value) { that.m_settings.drawCOMs = value; });
                    connect_checkbox_input(draw_fieldset, "Statistics", this.m_settings.drawStats, function (value) { that.m_settings.drawStats = value; });
                    connect_checkbox_input(draw_fieldset, "Profile", this.m_settings.drawProfile, function (value) { that.m_settings.drawProfile = value; });
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
                    connect_button_input(button_div, "Pause", function (e) { that.Pause(); });
                    connect_button_input(button_div, "Step", function (e) { that.SingleStep(); });
                    connect_button_input(button_div, "Restart", function (e) { that.LoadTest(); });
                    this.m_demo_button = connect_button_input(button_div, "Demo", function (e) { that.ToggleDemo(); });
                    // disable context menu to use right-click
                    window.addEventListener("contextmenu", function (e) { e.preventDefault(); }, true);
                    canvas_div.addEventListener("mousemove", function (e) { that.HandleMouseMove(e); });
                    canvas_div.addEventListener("mousedown", function (e) { that.HandleMouseDown(e); });
                    canvas_div.addEventListener("mouseup", function (e) { that.HandleMouseUp(e); });
                    canvas_div.addEventListener("mousewheel", function (e) { that.HandleMouseWheel(e); });
                    canvas_div.addEventListener("touchmove", function (e) { that.HandleTouchMove(e); });
                    canvas_div.addEventListener("touchstart", function (e) { that.HandleTouchStart(e); });
                    canvas_div.addEventListener("touchend", function (e) { that.HandleTouchEnd(e); });
                    window.addEventListener("keydown", function (e) { that.HandleKeyDown(e); });
                    window.addEventListener("keyup", function (e) { that.HandleKeyUp(e); });
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
                        ///#if B2_ENABLE_PARTICLE
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
                        ///#else
                        ///case ".":
                        ///  this.SingleStep();
                        ///  break;
                        ///#endif
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
                    ///#if B2_ENABLE_PARTICLE
                    Main.fullscreenUI.Reset();
                    if (!restartTest)
                        Main.particleParameter.Reset();
                    ///#endif
                    this.m_demo_time = 0;
                    ///#if B2_ENABLE_PARTICLE
                    if (this.m_test) {
                        this.m_test.RestoreParticleParameters();
                    }
                    ///#endif
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
                        ctx.strokeStyle = "blue";
                        ctx.strokeRect(this.m_mouse.x - 24, this.m_mouse.y - 24, 48, 48);
                        const mouse_world = DebugDraw_1.g_camera.ConvertScreenToWorld(this.m_mouse, new box2d.b2Vec2());
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
                        ///#if B2_ENABLE_PARTICLE
                        // Update the state of the particle parameter.
                        let restartTest = [false];
                        Main.particleParameter.Changed(restartTest);
                        ///#endif
                        ///#if B2_ENABLE_PARTICLE
                        let msg = TestEntries_1.g_testEntries[this.m_test_index].name;
                        if (Main.fullscreenUI.GetParticleParameterSelectionEnabled()) {
                            msg += " : ";
                            msg += Main.particleParameter.GetName();
                        }
                        this.m_test.DrawTitle(msg);
                        ///#else
                        ///this.m_test.DrawTitle(g_testEntries[this.m_test_index].name);
                        ///#endif
                        ctx.strokeStyle = "yellow";
                        ctx.strokeRect(mouse_world.x - 0.5, mouse_world.y - 0.5, 1.0, 1.0);
                        ctx.restore();
                        ///#if B2_ENABLE_PARTICLE
                        if (restartTest[0]) {
                            this.LoadTest(true);
                        }
                        ///#endif
                        this.UpdateTest(time_elapsed);
                    }
                }
                ///#if B2_ENABLE_PARTICLE
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
            ///#if B2_ENABLE_PARTICLE
            Main.fullscreenUI = new FullscreenUI_1.FullScreenUI();
            Main.particleParameter = new ParticleParameter_1.ParticleParameter();
            exports_1("Main", Main);
        }
    };
});
