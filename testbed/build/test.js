System.register(["@box2d", "./draw.js", "./fullscreen_ui.js", "./particle_parameter.js"], function (exports_1, context_1) {
    "use strict";
    var b2, draw_js_1, fullscreen_ui_js_1, particle_parameter_js_1, DRAW_STRING_NEW_LINE, TestEntry, g_testEntries, DestructionListener, ContactPoint, QueryCallback2, Test;
    var __moduleName = context_1 && context_1.id;
    function RandomFloat(lo = -1, hi = 1) {
        let r = Math.random();
        r = (hi - lo) * r + lo;
        return r;
    }
    exports_1("RandomFloat", RandomFloat);
    function RegisterTest(category, name, fcn) {
        return g_testEntries.push(new TestEntry(category, name, fcn));
    }
    exports_1("RegisterTest", RegisterTest);
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            },
            function (draw_js_1_1) {
                draw_js_1 = draw_js_1_1;
            },
            function (fullscreen_ui_js_1_1) {
                fullscreen_ui_js_1 = fullscreen_ui_js_1_1;
            },
            function (particle_parameter_js_1_1) {
                particle_parameter_js_1 = particle_parameter_js_1_1;
            }
        ],
        execute: function () {
            // #endif
            exports_1("DRAW_STRING_NEW_LINE", DRAW_STRING_NEW_LINE = 16);
            TestEntry = class TestEntry {
                constructor(category, name, createFcn) {
                    this.category = "";
                    this.name = "unknown";
                    this.category = category;
                    this.name = name;
                    this.createFcn = createFcn;
                }
            };
            exports_1("TestEntry", TestEntry);
            exports_1("g_testEntries", g_testEntries = []);
            DestructionListener = class DestructionListener extends b2.DestructionListener {
                constructor(test) {
                    super();
                    this.test = test;
                }
                SayGoodbyeJoint(joint) {
                    if (this.test.m_mouseJoint === joint) {
                        this.test.m_mouseJoint = null;
                    }
                    else {
                        this.test.JointDestroyed(joint);
                    }
                }
                SayGoodbyeFixture(fixture) { }
                // #if B2_ENABLE_PARTICLE
                SayGoodbyeParticleGroup(group) {
                    this.test.ParticleGroupDestroyed(group);
                }
            };
            exports_1("DestructionListener", DestructionListener);
            ContactPoint = class ContactPoint {
                constructor() {
                    this.normal = new b2.Vec2();
                    this.position = new b2.Vec2();
                    this.state = b2.PointState.b2_nullState;
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.separation = 0;
                }
            };
            exports_1("ContactPoint", ContactPoint);
            // #if B2_ENABLE_PARTICLE
            QueryCallback2 = class QueryCallback2 extends b2.QueryCallback {
                constructor(particleSystem, shape, velocity) {
                    super();
                    this.m_particleSystem = particleSystem;
                    this.m_shape = shape;
                    this.m_velocity = velocity;
                }
                ReportFixture(fixture) {
                    return false;
                }
                ReportParticle(particleSystem, index) {
                    if (particleSystem !== this.m_particleSystem) {
                        return false;
                    }
                    const xf = b2.Transform.IDENTITY;
                    const p = this.m_particleSystem.GetPositionBuffer()[index];
                    if (this.m_shape.TestPoint(xf, p)) {
                        const v = this.m_particleSystem.GetVelocityBuffer()[index];
                        v.Copy(this.m_velocity);
                    }
                    return true;
                }
            };
            // #endif
            Test = class Test extends b2.ContactListener {
                // #endif
                constructor() {
                    super();
                    // #endif
                    this.m_bomb = null;
                    this.m_textLine = 30;
                    this.m_mouseJoint = null;
                    this.m_points = b2.MakeArray(Test.k_maxContactPoints, (i) => new ContactPoint());
                    this.m_pointCount = 0;
                    this.m_bombSpawnPoint = new b2.Vec2();
                    this.m_bombSpawning = false;
                    this.m_mouseWorld = new b2.Vec2();
                    // #if B2_ENABLE_PARTICLE
                    this.m_mouseTracing = false;
                    this.m_mouseTracerPosition = new b2.Vec2();
                    this.m_mouseTracerVelocity = new b2.Vec2();
                    // #endif
                    this.m_stepCount = 0;
                    this.m_maxProfile = new b2.Profile();
                    this.m_totalProfile = new b2.Profile();
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleParameters = null;
                    this.m_particleParameterDef = null;
                    // #if B2_ENABLE_PARTICLE
                    const particleSystemDef = new b2.ParticleSystemDef();
                    // #endif
                    const gravity = new b2.Vec2(0, -10);
                    this.m_world = new b2.World(gravity);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem = this.m_world.CreateParticleSystem(particleSystemDef);
                    // #endif
                    this.m_bomb = null;
                    this.m_textLine = 30;
                    this.m_mouseJoint = null;
                    this.m_destructionListener = new DestructionListener(this);
                    this.m_world.SetDestructionListener(this.m_destructionListener);
                    this.m_world.SetContactListener(this);
                    this.m_world.SetDebugDraw(draw_js_1.g_debugDraw);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem.SetGravityScale(0.4);
                    this.m_particleSystem.SetDensity(1.2);
                    // #endif
                    const bodyDef = new b2.BodyDef();
                    this.m_groundBody = this.m_world.CreateBody(bodyDef);
                }
                JointDestroyed(joint) { }
                // #if B2_ENABLE_PARTICLE
                ParticleGroupDestroyed(group) { }
                // #endif
                BeginContact(contact) { }
                EndContact(contact) { }
                PreSolve(contact, oldManifold) {
                    const manifold = contact.GetManifold();
                    if (manifold.pointCount === 0) {
                        return;
                    }
                    const fixtureA = contact.GetFixtureA();
                    const fixtureB = contact.GetFixtureB();
                    const state1 = Test.PreSolve_s_state1;
                    const state2 = Test.PreSolve_s_state2;
                    b2.GetPointStates(state1, state2, oldManifold, manifold);
                    const worldManifold = Test.PreSolve_s_worldManifold;
                    contact.GetWorldManifold(worldManifold);
                    for (let i = 0; i < manifold.pointCount && this.m_pointCount < Test.k_maxContactPoints; ++i) {
                        const cp = this.m_points[this.m_pointCount];
                        cp.fixtureA = fixtureA;
                        cp.fixtureB = fixtureB;
                        cp.position.Copy(worldManifold.points[i]);
                        cp.normal.Copy(worldManifold.normal);
                        cp.state = state2[i];
                        cp.normalImpulse = manifold.points[i].normalImpulse;
                        cp.tangentImpulse = manifold.points[i].tangentImpulse;
                        cp.separation = worldManifold.separations[i];
                        ++this.m_pointCount;
                    }
                }
                PostSolve(contact, impulse) { }
                Keyboard(key) { }
                KeyboardUp(key) { }
                SetTextLine(line) {
                    this.m_textLine = line;
                }
                DrawTitle(title) {
                    draw_js_1.g_debugDraw.DrawString(5, DRAW_STRING_NEW_LINE, title);
                    this.m_textLine = 3 * DRAW_STRING_NEW_LINE;
                }
                MouseDown(p) {
                    this.m_mouseWorld.Copy(p);
                    // #if B2_ENABLE_PARTICLE
                    this.m_mouseTracing = true;
                    this.m_mouseTracerPosition.Copy(p);
                    this.m_mouseTracerVelocity.SetZero();
                    // #endif
                    if (this.m_mouseJoint !== null) {
                        this.m_world.DestroyJoint(this.m_mouseJoint);
                        this.m_mouseJoint = null;
                    }
                    let hit_fixture = null; // HACK: tsc doesn't detect calling callbacks
                    // Query the world for overlapping shapes.
                    this.m_world.QueryPointAABB(p, (fixture) => {
                        const body = fixture.GetBody();
                        if (body.GetType() === b2.BodyType.b2_dynamicBody) {
                            const inside = fixture.TestPoint(p);
                            if (inside) {
                                hit_fixture = fixture;
                                return false; // We are done, terminate the query.
                            }
                        }
                        return true; // Continue the query.
                    });
                    if (hit_fixture) {
                        const body = hit_fixture.GetBody();
                        const md = new b2.MouseJointDef();
                        md.bodyA = this.m_groundBody;
                        md.bodyB = body;
                        md.target.Copy(p);
                        md.maxForce = 1000 * body.GetMass();
                        this.m_mouseJoint = this.m_world.CreateJoint(md);
                        body.SetAwake(true);
                    }
                }
                SpawnBomb(worldPt) {
                    this.m_bombSpawnPoint.Copy(worldPt);
                    this.m_bombSpawning = true;
                }
                CompleteBombSpawn(p) {
                    if (!this.m_bombSpawning) {
                        return;
                    }
                    const multiplier = 30;
                    const vel = b2.Vec2.SubVV(this.m_bombSpawnPoint, p, new b2.Vec2());
                    vel.SelfMul(multiplier);
                    this.LaunchBombAt(this.m_bombSpawnPoint, vel);
                    this.m_bombSpawning = false;
                }
                ShiftMouseDown(p) {
                    this.m_mouseWorld.Copy(p);
                    if (this.m_mouseJoint !== null) {
                        return;
                    }
                    this.SpawnBomb(p);
                }
                MouseUp(p) {
                    // #if B2_ENABLE_PARTICLE
                    this.m_mouseTracing = false;
                    // #endif
                    if (this.m_mouseJoint) {
                        this.m_world.DestroyJoint(this.m_mouseJoint);
                        this.m_mouseJoint = null;
                    }
                    if (this.m_bombSpawning) {
                        this.CompleteBombSpawn(p);
                    }
                }
                MouseMove(p) {
                    this.m_mouseWorld.Copy(p);
                    if (this.m_mouseJoint) {
                        this.m_mouseJoint.SetTarget(p);
                    }
                }
                LaunchBomb() {
                    const p = new b2.Vec2(b2.RandomRange(-15, 15), 30);
                    const v = b2.Vec2.MulSV(-5, p, new b2.Vec2());
                    this.LaunchBombAt(p, v);
                }
                LaunchBombAt(position, velocity) {
                    if (this.m_bomb) {
                        this.m_world.DestroyBody(this.m_bomb);
                        this.m_bomb = null;
                    }
                    const bd = new b2.BodyDef();
                    bd.type = b2.BodyType.b2_dynamicBody;
                    bd.position.Copy(position);
                    bd.bullet = true;
                    this.m_bomb = this.m_world.CreateBody(bd);
                    this.m_bomb.SetLinearVelocity(velocity);
                    const circle = new b2.CircleShape();
                    circle.m_radius = 0.3;
                    const fd = new b2.FixtureDef();
                    fd.shape = circle;
                    fd.density = 20;
                    fd.restitution = 0;
                    // b2.Vec2 minV = position - b2.Vec2(0.3f,0.3f);
                    // b2.Vec2 maxV = position + b2.Vec2(0.3f,0.3f);
                    // b2.AABB aabb;
                    // aabb.lowerBound = minV;
                    // aabb.upperBound = maxV;
                    this.m_bomb.CreateFixture(fd);
                }
                Step(settings) {
                    let timeStep = settings.m_hertz > 0 ? 1 / settings.m_hertz : 0;
                    if (settings.m_pause) {
                        if (settings.m_singleStep) {
                            settings.m_singleStep = false;
                        }
                        else {
                            timeStep = 0;
                        }
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "****PAUSED****");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    let flags = b2.DrawFlags.e_none;
                    if (settings.m_drawShapes) {
                        flags |= b2.DrawFlags.e_shapeBit;
                    }
                    // #if B2_ENABLE_PARTICLE
                    if (settings.m_drawParticles) {
                        flags |= b2.DrawFlags.e_particleBit;
                    }
                    // #endif
                    if (settings.m_drawJoints) {
                        flags |= b2.DrawFlags.e_jointBit;
                    }
                    if (settings.m_drawAABBs) {
                        flags |= b2.DrawFlags.e_aabbBit;
                    }
                    if (settings.m_drawCOMs) {
                        flags |= b2.DrawFlags.e_centerOfMassBit;
                    }
                    // #if B2_ENABLE_CONTROLLER
                    if (settings.m_drawControllers) {
                        flags |= b2.DrawFlags.e_controllerBit;
                    }
                    // #endif
                    draw_js_1.g_debugDraw.SetFlags(flags);
                    this.m_world.SetAllowSleeping(settings.m_enableSleep);
                    this.m_world.SetWarmStarting(settings.m_enableWarmStarting);
                    this.m_world.SetContinuousPhysics(settings.m_enableContinuous);
                    this.m_world.SetSubStepping(settings.m_enableSubStepping);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem.SetStrictContactCheck(settings.m_strictContacts);
                    // #endif
                    this.m_pointCount = 0;
                    // #if B2_ENABLE_PARTICLE
                    this.m_world.Step(timeStep, settings.m_velocityIterations, settings.m_positionIterations, settings.m_particleIterations);
                    // #else
                    // this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations);
                    // #endif
                    this.m_world.DebugDraw();
                    if (timeStep > 0) {
                        ++this.m_stepCount;
                    }
                    if (settings.m_drawStats) {
                        const bodyCount = this.m_world.GetBodyCount();
                        const contactCount = this.m_world.GetContactCount();
                        const jointCount = this.m_world.GetJointCount();
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "bodies/contacts/joints = " + bodyCount + "/" + contactCount + "/" + jointCount);
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        // #if B2_ENABLE_PARTICLE
                        const particleCount = this.m_particleSystem.GetParticleCount();
                        const groupCount = this.m_particleSystem.GetParticleGroupCount();
                        const pairCount = this.m_particleSystem.GetPairCount();
                        const triadCount = this.m_particleSystem.GetTriadCount();
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "particles/groups/pairs/triads = " + particleCount + "/" + groupCount + "/" + pairCount + "/" + triadCount);
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        // #endif
                        const proxyCount = this.m_world.GetProxyCount();
                        const height = this.m_world.GetTreeHeight();
                        const balance = this.m_world.GetTreeBalance();
                        const quality = this.m_world.GetTreeQuality();
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "proxies/height/balance/quality = " + proxyCount + "/" + height + "/" + balance + "/" + quality.toFixed(2));
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    // Track maximum profile times
                    {
                        const p = this.m_world.GetProfile();
                        this.m_maxProfile.step = b2.Max(this.m_maxProfile.step, p.step);
                        this.m_maxProfile.collide = b2.Max(this.m_maxProfile.collide, p.collide);
                        this.m_maxProfile.solve = b2.Max(this.m_maxProfile.solve, p.solve);
                        this.m_maxProfile.solveInit = b2.Max(this.m_maxProfile.solveInit, p.solveInit);
                        this.m_maxProfile.solveVelocity = b2.Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
                        this.m_maxProfile.solvePosition = b2.Max(this.m_maxProfile.solvePosition, p.solvePosition);
                        this.m_maxProfile.solveTOI = b2.Max(this.m_maxProfile.solveTOI, p.solveTOI);
                        this.m_maxProfile.broadphase = b2.Max(this.m_maxProfile.broadphase, p.broadphase);
                        this.m_totalProfile.step += p.step;
                        this.m_totalProfile.collide += p.collide;
                        this.m_totalProfile.solve += p.solve;
                        this.m_totalProfile.solveInit += p.solveInit;
                        this.m_totalProfile.solveVelocity += p.solveVelocity;
                        this.m_totalProfile.solvePosition += p.solvePosition;
                        this.m_totalProfile.solveTOI += p.solveTOI;
                        this.m_totalProfile.broadphase += p.broadphase;
                    }
                    if (settings.m_drawProfile) {
                        const p = this.m_world.GetProfile();
                        const aveProfile = new b2.Profile();
                        if (this.m_stepCount > 0) {
                            const scale = 1 / this.m_stepCount;
                            aveProfile.step = scale * this.m_totalProfile.step;
                            aveProfile.collide = scale * this.m_totalProfile.collide;
                            aveProfile.solve = scale * this.m_totalProfile.solve;
                            aveProfile.solveInit = scale * this.m_totalProfile.solveInit;
                            aveProfile.solveVelocity = scale * this.m_totalProfile.solveVelocity;
                            aveProfile.solvePosition = scale * this.m_totalProfile.solvePosition;
                            aveProfile.solveTOI = scale * this.m_totalProfile.solveTOI;
                            aveProfile.broadphase = scale * this.m_totalProfile.broadphase;
                        }
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "step [ave] (max) = " + p.step.toFixed(2) + " [" + aveProfile.step.toFixed(2) + "] (" + this.m_maxProfile.step.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "collide [ave] (max) = " + p.collide.toFixed(2) + " [" + aveProfile.collide.toFixed(2) + "] (" + this.m_maxProfile.collide.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve [ave] (max) = " + p.solve.toFixed(2) + " [" + aveProfile.solve.toFixed(2) + "] (" + this.m_maxProfile.solve.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve init [ave] (max) = " + p.solveInit.toFixed(2) + " [" + aveProfile.solveInit.toFixed(2) + "] (" + this.m_maxProfile.solveInit.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve velocity [ave] (max) = " + p.solveVelocity.toFixed(2) + " [" + aveProfile.solveVelocity.toFixed(2) + "] (" + this.m_maxProfile.solveVelocity.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solve position [ave] (max) = " + p.solvePosition.toFixed(2) + " [" + aveProfile.solvePosition.toFixed(2) + "] (" + this.m_maxProfile.solvePosition.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "solveTOI [ave] (max) = " + p.solveTOI.toFixed(2) + " [" + aveProfile.solveTOI.toFixed(2) + "] (" + this.m_maxProfile.solveTOI.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        draw_js_1.g_debugDraw.DrawString(5, this.m_textLine, "broad-phase [ave] (max) = " + p.broadphase.toFixed(2) + " [" + aveProfile.broadphase.toFixed(2) + "] (" + this.m_maxProfile.broadphase.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    // #if B2_ENABLE_PARTICLE
                    if (this.m_mouseTracing && !this.m_mouseJoint) {
                        const delay = 0.1;
                        ///b2Vec2 acceleration = 2 / delay * (1 / delay * (m_mouseWorld - m_mouseTracerPosition) - m_mouseTracerVelocity);
                        const acceleration = new b2.Vec2();
                        acceleration.x = 2 / delay * (1 / delay * (this.m_mouseWorld.x - this.m_mouseTracerPosition.x) - this.m_mouseTracerVelocity.x);
                        acceleration.y = 2 / delay * (1 / delay * (this.m_mouseWorld.y - this.m_mouseTracerPosition.y) - this.m_mouseTracerVelocity.y);
                        ///m_mouseTracerVelocity += timeStep * acceleration;
                        this.m_mouseTracerVelocity.SelfMulAdd(timeStep, acceleration);
                        ///m_mouseTracerPosition += timeStep * m_mouseTracerVelocity;
                        this.m_mouseTracerPosition.SelfMulAdd(timeStep, this.m_mouseTracerVelocity);
                        const shape = new b2.CircleShape();
                        shape.m_p.Copy(this.m_mouseTracerPosition);
                        shape.m_radius = 2 * this.GetDefaultViewZoom();
                        ///QueryCallback2 callback(m_particleSystem, &shape, m_mouseTracerVelocity);
                        const callback = new QueryCallback2(this.m_particleSystem, shape, this.m_mouseTracerVelocity);
                        const aabb = new b2.AABB();
                        const xf = new b2.Transform();
                        xf.SetIdentity();
                        shape.ComputeAABB(aabb, xf, 0);
                        this.m_world.QueryAABB(callback, aabb);
                    }
                    // #endif
                    if (this.m_bombSpawning) {
                        const c = new b2.Color(0, 0, 1);
                        draw_js_1.g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);
                        c.SetRGB(0.8, 0.8, 0.8);
                        draw_js_1.g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
                    }
                    if (settings.m_drawContactPoints) {
                        const k_impulseScale = 0.1;
                        const k_axisScale = 0.3;
                        for (let i = 0; i < this.m_pointCount; ++i) {
                            const point = this.m_points[i];
                            if (point.state === b2.PointState.b2_addState) {
                                // Add
                                draw_js_1.g_debugDraw.DrawPoint(point.position, 10, new b2.Color(0.3, 0.95, 0.3));
                            }
                            else if (point.state === b2.PointState.b2_persistState) {
                                // Persist
                                draw_js_1.g_debugDraw.DrawPoint(point.position, 5, new b2.Color(0.3, 0.3, 0.95));
                            }
                            if (settings.m_drawContactNormals) {
                                const p1 = point.position;
                                const p2 = b2.Vec2.AddVV(p1, b2.Vec2.MulSV(k_axisScale, point.normal, b2.Vec2.s_t0), new b2.Vec2());
                                draw_js_1.g_debugDraw.DrawSegment(p1, p2, new b2.Color(0.9, 0.9, 0.9));
                            }
                            else if (settings.m_drawContactImpulse) {
                                const p1 = point.position;
                                const p2 = b2.Vec2.AddVMulSV(p1, k_impulseScale * point.normalImpulse, point.normal, new b2.Vec2());
                                draw_js_1.g_debugDraw.DrawSegment(p1, p2, new b2.Color(0.9, 0.9, 0.3));
                            }
                            if (settings.m_drawFrictionImpulse) {
                                const tangent = b2.Vec2.CrossVOne(point.normal, new b2.Vec2());
                                const p1 = point.position;
                                const p2 = b2.Vec2.AddVMulSV(p1, k_impulseScale * point.tangentImpulse, tangent, new b2.Vec2());
                                draw_js_1.g_debugDraw.DrawSegment(p1, p2, new b2.Color(0.9, 0.9, 0.3));
                            }
                        }
                    }
                }
                ShiftOrigin(newOrigin) {
                    this.m_world.ShiftOrigin(newOrigin);
                }
                GetDefaultViewZoom() {
                    return 1.0;
                }
                /**
                 * Apply a preset range of colors to a particle group.
                 *
                 * A different color out of k_ParticleColors is applied to each
                 * particlesPerColor particles in the specified group.
                 *
                 * If particlesPerColor is 0, the particles in the group are
                 * divided into k_ParticleColorsCount equal sets of colored
                 * particles.
                 */
                ColorParticleGroup(group, particlesPerColor) {
                    // DEBUG: b2.Assert(group !== null);
                    const colorBuffer = this.m_particleSystem.GetColorBuffer();
                    const particleCount = group.GetParticleCount();
                    const groupStart = group.GetBufferIndex();
                    const groupEnd = particleCount + groupStart;
                    const colorCount = Test.k_ParticleColors.length;
                    if (!particlesPerColor) {
                        particlesPerColor = Math.floor(particleCount / colorCount);
                        if (!particlesPerColor) {
                            particlesPerColor = 1;
                        }
                    }
                    for (let i = groupStart; i < groupEnd; i++) {
                        ///colorBuffer[i].Copy(box2d.Testbed.Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount]);
                        colorBuffer[i] = Test.k_ParticleColors[Math.floor(i / particlesPerColor) % colorCount].Clone();
                    }
                }
                /**
                 * Remove particle parameters matching "filterMask" from the set
                 * of particle parameters available for this test.
                 */
                InitializeParticleParameters(filterMask) {
                    const defaultNumValues = particle_parameter_js_1.ParticleParameter.k_defaultDefinition[0].numValues;
                    const defaultValues = particle_parameter_js_1.ParticleParameter.k_defaultDefinition[0].values;
                    ///  m_particleParameters = new ParticleParameter::Value[defaultNumValues];
                    this.m_particleParameters = [];
                    // Disable selection of wall and barrier particle types.
                    let numValues = 0;
                    for (let i = 0; i < defaultNumValues; i++) {
                        if (defaultValues[i].value & filterMask) {
                            continue;
                        }
                        ///memcpy(&m_particleParameters[numValues], &defaultValues[i], sizeof(defaultValues[0]));
                        this.m_particleParameters[numValues] = new particle_parameter_js_1.ParticleParameterValue(defaultValues[i]);
                        numValues++;
                    }
                    this.m_particleParameterDef = new particle_parameter_js_1.ParticleParameterDefinition(this.m_particleParameters, numValues);
                    ///m_particleParameterDef.values = m_particleParameters;
                    ///m_particleParameterDef.numValues = numValues;
                    Test.SetParticleParameters([this.m_particleParameterDef], 1);
                }
                /**
                 * Restore default particle parameters.
                 */
                RestoreParticleParameters() {
                    if (this.m_particleParameters) {
                        Test.SetParticleParameters(particle_parameter_js_1.ParticleParameter.k_defaultDefinition, 1);
                        ///  delete [] m_particleParameters;
                        this.m_particleParameters = null;
                    }
                }
                /**
                 * Set whether to restart the test on particle parameter
                 * changes. This parameter is re-enabled when the test changes.
                 */
                static SetRestartOnParticleParameterChange(enable) {
                    Test.particleParameter.SetRestartOnChange(enable);
                }
                /**
                 * Set the currently selected particle parameter value.  This
                 * value must match one of the values in
                 * Main::k_particleTypes or one of the values referenced by
                 * particleParameterDef passed to SetParticleParameters().
                 */
                static SetParticleParameterValue(value) {
                    const index = Test.particleParameter.FindIndexByValue(value);
                    // If the particle type isn't found, so fallback to the first entry in the
                    // parameter.
                    Test.particleParameter.Set(index >= 0 ? index : 0);
                    return Test.particleParameter.GetValue();
                }
                /**
                 * Get the currently selected particle parameter value and
                 * enable particle parameter selection arrows on Android.
                 */
                static GetParticleParameterValue() {
                    // Enable display of particle type selection arrows.
                    Test.fullscreenUI.SetParticleParameterSelectionEnabled(true);
                    return Test.particleParameter.GetValue();
                }
                /**
                 * Override the default particle parameters for the test.
                 */
                static SetParticleParameters(particleParameterDef, particleParameterDefCount = particleParameterDef.length) {
                    Test.particleParameter.SetDefinition(particleParameterDef, particleParameterDefCount);
                }
            };
            exports_1("Test", Test);
            // #if B2_ENABLE_PARTICLE
            Test.fullscreenUI = new fullscreen_ui_js_1.FullScreenUI();
            Test.particleParameter = new particle_parameter_js_1.ParticleParameter();
            // #endif
            Test.k_maxContactPoints = 2048;
            Test.PreSolve_s_state1 = [ /*b2.maxManifoldPoints*/];
            Test.PreSolve_s_state2 = [ /*b2.maxManifoldPoints*/];
            Test.PreSolve_s_worldManifold = new b2.WorldManifold();
            // #if B2_ENABLE_PARTICLE
            Test.k_ParticleColors = [
                new b2.Color().SetByteRGBA(0xff, 0x00, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0xff, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0x00, 0xff, 0xff),
                new b2.Color().SetByteRGBA(0xff, 0x8c, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0xce, 0xd1, 0xff),
                new b2.Color().SetByteRGBA(0xff, 0x00, 0xff, 0xff),
                new b2.Color().SetByteRGBA(0xff, 0xd7, 0x00, 0xff),
                new b2.Color().SetByteRGBA(0x00, 0xff, 0xff, 0xff),
            ];
            Test.k_ParticleColorsCount = Test.k_ParticleColors.length;
        }
    };
});
//# sourceMappingURL=test.js.map