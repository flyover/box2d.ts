System.register(["@box2d", "./settings.js", "./test.js", "./draw.js", "./tests/add_pair.js", "./tests/apply_force.js", "./tests/body_types.js", "./tests/box_stack.js", "./tests/breakable.js", "./tests/bridge.js", "./tests/bullet_test.js", "./tests/cantilever.js", "./tests/car.js", "./tests/chain.js", "./tests/character_collision.js", "./tests/circle_stack.js", "./tests/collision_filtering.js", "./tests/collision_processing.js", "./tests/compound_shapes.js", "./tests/confined.js", "./tests/continuous_test.js", "./tests/convex_hull.js", "./tests/conveyor_belt.js", "./tests/distance_joint.js", "./tests/distance_test.js", "./tests/dominos.js", "./tests/dump_loader.js", "./tests/dynamic_tree.js", "./tests/edge_shapes.js", "./tests/edge_test.js", "./tests/friction.js", "./tests/gear_joint.js", "./tests/heavy1.js", "./tests/heavy2.js", "./tests/mobile_balanced.js", "./tests/mobile_unbalanced.js", "./tests/motor_joint.js", "./tests/pinball.js", "./tests/platformer.js", "./tests/polygon_collision.js", "./tests/polygon_shapes.js", "./tests/prismatic_joint.js", "./tests/pulley_joint.js", "./tests/pyramid.js", "./tests/ray_cast.js", "./tests/restitution.js", "./tests/revolute_joint.js", "./tests/rope.js", "./tests/sensor.js", "./tests/shape_cast.js", "./tests/shape_editing.js", "./tests/skier.js", "./tests/slider_crank_1.js", "./tests/slider_crank_2.js", "./tests/theo_jansen.js", "./tests/tiles.js", "./tests/time_of_impact.js", "./tests/tumbler.js", "./tests/web.js", "./tests/wheel_joint.js", "./tests/wrecking_ball.js", "./tests/extras/blob_test.js", "./tests/extras/domino_tower.js", "./tests/extras/pyramid_topple.js", "./tests/extras/test_ccd.js", "./tests/extras/test_ragdoll.js", "./tests/extras/test_stack.js", "./tests/extras/top_down_car.js", "./tests/extras/segway.js", "./tests/extras/buoyancy_test.js", "./tests/particles/anti_pointy.js", "./tests/particles/corner_case.js", "./tests/particles/dam_break.js", "./tests/particles/drawing_particles.js", "./tests/particles/elastic_particles.js", "./tests/particles/eye_candy.js", "./tests/particles/faucet.js", "./tests/particles/fracker.js", "./tests/particles/impulse.js", "./tests/particles/liquid_timer.js", "./tests/particles/maxwell.js", "./tests/particles/multiple_particle_systems.js", "./tests/particles/particle_collision_filter.js", "./tests/particles/particles_surface_tension.js", "./tests/particles/particles.js", "./tests/particles/pointy.js", "./tests/particles/ramp.js", "./tests/particles/rigid_particles.js", "./tests/particles/sandbox.js", "./tests/particles/soup_stirrer.js", "./tests/particles/soup.js", "./tests/particles/sparky.js", "./tests/particles/wave_machine.js"], function (exports_1, context_1) {
    "use strict";
    var b2, settings_js_1, test_js_1, draw_js_1, Main;
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
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (_6) {
            },
            function (_7) {
            },
            function (_8) {
            },
            function (_9) {
            },
            function (_10) {
            },
            function (_11) {
            },
            function (_12) {
            },
            function (_13) {
            },
            function (_14) {
            },
            function (_15) {
            },
            function (_16) {
            },
            function (_17) {
            },
            function (_18) {
            },
            function (_19) {
            },
            function (_20) {
            },
            function (_21) {
            },
            function (_22) {
            },
            function (_23) {
            },
            function (_24) {
            },
            function (_25) {
            },
            function (_26) {
            },
            function (_27) {
            },
            function (_28) {
            },
            function (_29) {
            },
            function (_30) {
            },
            function (_31) {
            },
            function (_32) {
            },
            function (_33) {
            },
            function (_34) {
            },
            function (_35) {
            },
            function (_36) {
            },
            function (_37) {
            },
            function (_38) {
            },
            function (_39) {
            },
            function (_40) {
            },
            function (_41) {
            },
            function (_42) {
            },
            function (_43) {
            },
            function (_44) {
            },
            function (_45) {
            },
            function (_46) {
            },
            function (_47) {
            },
            function (_48) {
            },
            function (_49) {
            },
            function (_50) {
            },
            function (_51) {
            },
            function (_52) {
            },
            function (_53) {
            },
            function (_54) {
            },
            function (_55) {
            },
            function (_56) {
            },
            function (_57) {
            },
            function (_58) {
            },
            function (_59) {
            },
            function (_60) {
            },
            function (_61) {
            },
            function (_62) {
            },
            function (_63) {
            },
            function (_64) {
            },
            function (_65) {
            },
            function (_66) {
            },
            function (_67) {
            },
            function (_68) {
            },
            function (_69) {
            },
            function (_70) {
            },
            function (_71) {
            },
            function (_72) {
            },
            function (_73) {
            },
            function (_74) {
            },
            function (_75) {
            },
            function (_76) {
            },
            function (_77) {
            },
            function (_78) {
            },
            function (_79) {
            },
            function (_80) {
            },
            function (_81) {
            },
            function (_82) {
            },
            function (_83) {
            },
            function (_84) {
            },
            function (_85) {
            },
            function (_86) {
            },
            function (_87) {
            },
            function (_88) {
            },
            function (_89) {
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
                    const test_options = [];
                    for (let i = 0; i < test_js_1.g_testEntries.length; ++i) {
                        const option = document.createElement("option");
                        option.text = `${test_js_1.g_testEntries[i].category}:${test_js_1.g_testEntries[i].name}`;
                        option.value = i.toString();
                        test_options.push(option);
                    }
                    test_options.sort((a, b) => a.text.localeCompare(b.text));
                    for (let i = 0; i < test_options.length; ++i) {
                        const option = test_options[i];
                        test_select.add(option);
                    }
                    test_select.selectedIndex = this.m_settings.m_testIndex = 77;
                    test_select.addEventListener("change", (e) => {
                        this.m_settings.m_testIndex = test_select.selectedIndex;
                        this.LoadTest();
                    });
                    controls_div.appendChild(test_select);
                    this.m_test_select = test_select;
                    this.m_test_options = test_options;
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
                        this.m_settings.m_testIndex = this.m_test_options.length;
                    }
                    this.m_settings.m_testIndex--;
                    this.m_test_select.selectedIndex = this.m_settings.m_testIndex;
                    this.LoadTest();
                }
                IncrementTest() {
                    this.m_settings.m_testIndex++;
                    if (this.m_settings.m_testIndex >= this.m_test_options.length) {
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
                    this.m_test = test_js_1.g_testEntries[parseInt(this.m_test_options[this.m_settings.m_testIndex].value)].createFcn();
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
                            let msg = this.m_test_options[this.m_settings.m_testIndex].text;
                            if (test_js_1.Test.fullscreenUI.GetParticleParameterSelectionEnabled()) {
                                msg += " : ";
                                msg += test_js_1.Test.particleParameter.GetName();
                            }
                            if (this.m_test) {
                                this.m_test.DrawTitle(msg);
                            }
                            // #else
                            // if (this.m_test) { this.m_test.DrawTitle(this.m_test_options[this.m_settings.m_testIndex].text); }
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
//# sourceMappingURL=main.js.map