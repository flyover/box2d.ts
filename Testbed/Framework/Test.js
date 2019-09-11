System.register(["Box2D", "./DebugDraw", "./FullscreenUI", "./ParticleParameter"], function (exports_1, context_1) {
    "use strict";
    var box2d, DebugDraw_1, FullscreenUI_1, ParticleParameter_1, DRAW_STRING_NEW_LINE, Settings, TestEntry, DestructionListener, ContactPoint, QueryCallback2, Test;
    var __moduleName = context_1 && context_1.id;
    function RandomFloat(lo = -1, hi = 1) {
        let r = Math.random();
        r = (hi - lo) * r + lo;
        return r;
    }
    exports_1("RandomFloat", RandomFloat);
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            },
            function (DebugDraw_1_1) {
                DebugDraw_1 = DebugDraw_1_1;
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
            exports_1("DRAW_STRING_NEW_LINE", DRAW_STRING_NEW_LINE = 16);
            Settings = class Settings {
                constructor() {
                    this.hz = 60;
                    this.velocityIterations = 8;
                    this.positionIterations = 3;
                    // #if B2_ENABLE_PARTICLE
                    // Particle iterations are needed for numerical stability in particle
                    // simulations with small particles and relatively high gravity.
                    // b2CalculateParticleIterations helps to determine the number.
                    this.particleIterations = box2d.b2CalculateParticleIterations(10, 0.04, 1 / this.hz);
                    // #endif
                    this.drawShapes = true;
                    // #if B2_ENABLE_PARTICLE
                    this.drawParticles = true;
                    // #endif
                    this.drawJoints = true;
                    this.drawAABBs = false;
                    this.drawContactPoints = false;
                    this.drawContactNormals = false;
                    this.drawContactImpulse = false;
                    this.drawFrictionImpulse = false;
                    this.drawCOMs = false;
                    this.drawControllers = true;
                    this.drawStats = false;
                    this.drawProfile = false;
                    this.enableWarmStarting = true;
                    this.enableContinuous = true;
                    this.enableSubStepping = false;
                    this.enableSleep = true;
                    this.pause = false;
                    this.singleStep = false;
                    // #if B2_ENABLE_PARTICLE
                    this.strictContacts = false;
                    // #endif
                }
            };
            exports_1("Settings", Settings);
            TestEntry = class TestEntry {
                constructor(name, createFcn) {
                    this.name = "unknown";
                    this.name = name;
                    this.createFcn = createFcn;
                }
            };
            exports_1("TestEntry", TestEntry);
            DestructionListener = class DestructionListener extends box2d.b2DestructionListener {
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
                    this.normal = new box2d.b2Vec2();
                    this.position = new box2d.b2Vec2();
                    this.state = box2d.b2PointState.b2_nullState;
                    this.normalImpulse = 0;
                    this.tangentImpulse = 0;
                    this.separation = 0;
                }
            };
            exports_1("ContactPoint", ContactPoint);
            // #if B2_ENABLE_PARTICLE
            QueryCallback2 = class QueryCallback2 extends box2d.b2QueryCallback {
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
                    const xf = box2d.b2Transform.IDENTITY;
                    const p = this.m_particleSystem.GetPositionBuffer()[index];
                    if (this.m_shape.TestPoint(xf, p)) {
                        const v = this.m_particleSystem.GetVelocityBuffer()[index];
                        v.Copy(this.m_velocity);
                    }
                    return true;
                }
            };
            // #endif
            Test = class Test extends box2d.b2ContactListener {
                // #endif
                constructor() {
                    super();
                    // #endif
                    this.m_bomb = null;
                    this.m_textLine = 30;
                    this.m_mouseJoint = null;
                    this.m_points = box2d.b2MakeArray(Test.k_maxContactPoints, (i) => new ContactPoint());
                    this.m_pointCount = 0;
                    this.m_bombSpawnPoint = new box2d.b2Vec2();
                    this.m_bombSpawning = false;
                    this.m_mouseWorld = new box2d.b2Vec2();
                    // #if B2_ENABLE_PARTICLE
                    this.m_mouseTracing = false;
                    this.m_mouseTracerPosition = new box2d.b2Vec2();
                    this.m_mouseTracerVelocity = new box2d.b2Vec2();
                    // #endif
                    this.m_stepCount = 0;
                    this.m_maxProfile = new box2d.b2Profile();
                    this.m_totalProfile = new box2d.b2Profile();
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleParameters = null;
                    this.m_particleParameterDef = null;
                    // #if B2_ENABLE_PARTICLE
                    const particleSystemDef = new box2d.b2ParticleSystemDef();
                    // #endif
                    const gravity = new box2d.b2Vec2(0, -10);
                    this.m_world = new box2d.b2World(gravity);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem = this.m_world.CreateParticleSystem(particleSystemDef);
                    // #endif
                    this.m_bomb = null;
                    this.m_textLine = 30;
                    this.m_mouseJoint = null;
                    this.m_destructionListener = new DestructionListener(this);
                    this.m_world.SetDestructionListener(this.m_destructionListener);
                    this.m_world.SetContactListener(this);
                    this.m_world.SetDebugDraw(DebugDraw_1.g_debugDraw);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem.SetGravityScale(0.4);
                    this.m_particleSystem.SetDensity(1.2);
                    // #endif
                    const bodyDef = new box2d.b2BodyDef();
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
                    box2d.b2GetPointStates(state1, state2, oldManifold, manifold);
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
                    DebugDraw_1.g_debugDraw.DrawString(5, DRAW_STRING_NEW_LINE, title);
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
                        if (body.GetType() === box2d.b2BodyType.b2_dynamicBody) {
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
                        const md = new box2d.b2MouseJointDef();
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
                    const vel = box2d.b2Vec2.SubVV(this.m_bombSpawnPoint, p, new box2d.b2Vec2());
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
                    const p = new box2d.b2Vec2(box2d.b2RandomRange(-15, 15), 30);
                    const v = box2d.b2Vec2.MulSV(-5, p, new box2d.b2Vec2());
                    this.LaunchBombAt(p, v);
                }
                LaunchBombAt(position, velocity) {
                    if (this.m_bomb) {
                        this.m_world.DestroyBody(this.m_bomb);
                        this.m_bomb = null;
                    }
                    const bd = new box2d.b2BodyDef();
                    bd.type = box2d.b2BodyType.b2_dynamicBody;
                    bd.position.Copy(position);
                    bd.bullet = true;
                    this.m_bomb = this.m_world.CreateBody(bd);
                    this.m_bomb.SetLinearVelocity(velocity);
                    const circle = new box2d.b2CircleShape();
                    circle.m_radius = 0.3;
                    const fd = new box2d.b2FixtureDef();
                    fd.shape = circle;
                    fd.density = 20;
                    fd.restitution = 0;
                    // box2d.b2Vec2 minV = position - box2d.b2Vec2(0.3f,0.3f);
                    // box2d.b2Vec2 maxV = position + box2d.b2Vec2(0.3f,0.3f);
                    // box2d.b2AABB aabb;
                    // aabb.lowerBound = minV;
                    // aabb.upperBound = maxV;
                    this.m_bomb.CreateFixture(fd);
                }
                Step(settings) {
                    let timeStep = settings.hz > 0 ? 1 / settings.hz : 0;
                    if (settings.pause) {
                        if (settings.singleStep) {
                            settings.singleStep = false;
                        }
                        else {
                            timeStep = 0;
                        }
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "****PAUSED****");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    let flags = box2d.b2DrawFlags.e_none;
                    if (settings.drawShapes) {
                        flags |= box2d.b2DrawFlags.e_shapeBit;
                    }
                    // #if B2_ENABLE_PARTICLE
                    if (settings.drawParticles) {
                        flags |= box2d.b2DrawFlags.e_particleBit;
                    }
                    // #endif
                    if (settings.drawJoints) {
                        flags |= box2d.b2DrawFlags.e_jointBit;
                    }
                    if (settings.drawAABBs) {
                        flags |= box2d.b2DrawFlags.e_aabbBit;
                    }
                    if (settings.drawCOMs) {
                        flags |= box2d.b2DrawFlags.e_centerOfMassBit;
                    }
                    if (settings.drawControllers) {
                        flags |= box2d.b2DrawFlags.e_controllerBit;
                    }
                    DebugDraw_1.g_debugDraw.SetFlags(flags);
                    this.m_world.SetAllowSleeping(settings.enableSleep);
                    this.m_world.SetWarmStarting(settings.enableWarmStarting);
                    this.m_world.SetContinuousPhysics(settings.enableContinuous);
                    this.m_world.SetSubStepping(settings.enableSubStepping);
                    // #if B2_ENABLE_PARTICLE
                    this.m_particleSystem.SetStrictContactCheck(settings.strictContacts);
                    // #endif
                    this.m_pointCount = 0;
                    // #if B2_ENABLE_PARTICLE
                    this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations, settings.particleIterations);
                    // #else
                    // this.m_world.Step(timeStep, settings.velocityIterations, settings.positionIterations);
                    // #endif
                    this.m_world.DrawDebugData();
                    if (timeStep > 0) {
                        ++this.m_stepCount;
                    }
                    if (settings.drawStats) {
                        const bodyCount = this.m_world.GetBodyCount();
                        const contactCount = this.m_world.GetContactCount();
                        const jointCount = this.m_world.GetJointCount();
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "bodies/contacts/joints = " + bodyCount + "/" + contactCount + "/" + jointCount);
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        // #if B2_ENABLE_PARTICLE
                        const particleCount = this.m_particleSystem.GetParticleCount();
                        const groupCount = this.m_particleSystem.GetParticleGroupCount();
                        const pairCount = this.m_particleSystem.GetPairCount();
                        const triadCount = this.m_particleSystem.GetTriadCount();
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "particles/groups/pairs/triads = " + particleCount + "/" + groupCount + "/" + pairCount + "/" + triadCount);
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        // #endif
                        const proxyCount = this.m_world.GetProxyCount();
                        const height = this.m_world.GetTreeHeight();
                        const balance = this.m_world.GetTreeBalance();
                        const quality = this.m_world.GetTreeQuality();
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "proxies/height/balance/quality = " + proxyCount + "/" + height + "/" + balance + "/" + quality.toFixed(2));
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    // Track maximum profile times
                    {
                        const p = this.m_world.GetProfile();
                        this.m_maxProfile.step = box2d.b2Max(this.m_maxProfile.step, p.step);
                        this.m_maxProfile.collide = box2d.b2Max(this.m_maxProfile.collide, p.collide);
                        this.m_maxProfile.solve = box2d.b2Max(this.m_maxProfile.solve, p.solve);
                        this.m_maxProfile.solveInit = box2d.b2Max(this.m_maxProfile.solveInit, p.solveInit);
                        this.m_maxProfile.solveVelocity = box2d.b2Max(this.m_maxProfile.solveVelocity, p.solveVelocity);
                        this.m_maxProfile.solvePosition = box2d.b2Max(this.m_maxProfile.solvePosition, p.solvePosition);
                        this.m_maxProfile.solveTOI = box2d.b2Max(this.m_maxProfile.solveTOI, p.solveTOI);
                        this.m_maxProfile.broadphase = box2d.b2Max(this.m_maxProfile.broadphase, p.broadphase);
                        this.m_totalProfile.step += p.step;
                        this.m_totalProfile.collide += p.collide;
                        this.m_totalProfile.solve += p.solve;
                        this.m_totalProfile.solveInit += p.solveInit;
                        this.m_totalProfile.solveVelocity += p.solveVelocity;
                        this.m_totalProfile.solvePosition += p.solvePosition;
                        this.m_totalProfile.solveTOI += p.solveTOI;
                        this.m_totalProfile.broadphase += p.broadphase;
                    }
                    if (settings.drawProfile) {
                        const p = this.m_world.GetProfile();
                        const aveProfile = new box2d.b2Profile();
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
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "step [ave] (max) = " + p.step.toFixed(2) + " [" + aveProfile.step.toFixed(2) + "] (" + this.m_maxProfile.step.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "collide [ave] (max) = " + p.collide.toFixed(2) + " [" + aveProfile.collide.toFixed(2) + "] (" + this.m_maxProfile.collide.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "solve [ave] (max) = " + p.solve.toFixed(2) + " [" + aveProfile.solve.toFixed(2) + "] (" + this.m_maxProfile.solve.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "solve init [ave] (max) = " + p.solveInit.toFixed(2) + " [" + aveProfile.solveInit.toFixed(2) + "] (" + this.m_maxProfile.solveInit.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "solve velocity [ave] (max) = " + p.solveVelocity.toFixed(2) + " [" + aveProfile.solveVelocity.toFixed(2) + "] (" + this.m_maxProfile.solveVelocity.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "solve position [ave] (max) = " + p.solvePosition.toFixed(2) + " [" + aveProfile.solvePosition.toFixed(2) + "] (" + this.m_maxProfile.solvePosition.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "solveTOI [ave] (max) = " + p.solveTOI.toFixed(2) + " [" + aveProfile.solveTOI.toFixed(2) + "] (" + this.m_maxProfile.solveTOI.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                        DebugDraw_1.g_debugDraw.DrawString(5, this.m_textLine, "broad-phase [ave] (max) = " + p.broadphase.toFixed(2) + " [" + aveProfile.broadphase.toFixed(2) + "] (" + this.m_maxProfile.broadphase.toFixed(2) + ")");
                        this.m_textLine += DRAW_STRING_NEW_LINE;
                    }
                    // #if B2_ENABLE_PARTICLE
                    if (this.m_mouseTracing && !this.m_mouseJoint) {
                        const delay = 0.1;
                        ///b2Vec2 acceleration = 2 / delay * (1 / delay * (m_mouseWorld - m_mouseTracerPosition) - m_mouseTracerVelocity);
                        const acceleration = new box2d.b2Vec2();
                        acceleration.x = 2 / delay * (1 / delay * (this.m_mouseWorld.x - this.m_mouseTracerPosition.x) - this.m_mouseTracerVelocity.x);
                        acceleration.y = 2 / delay * (1 / delay * (this.m_mouseWorld.y - this.m_mouseTracerPosition.y) - this.m_mouseTracerVelocity.y);
                        ///m_mouseTracerVelocity += timeStep * acceleration;
                        this.m_mouseTracerVelocity.SelfMulAdd(timeStep, acceleration);
                        ///m_mouseTracerPosition += timeStep * m_mouseTracerVelocity;
                        this.m_mouseTracerPosition.SelfMulAdd(timeStep, this.m_mouseTracerVelocity);
                        const shape = new box2d.b2CircleShape();
                        shape.m_p.Copy(this.m_mouseTracerPosition);
                        shape.m_radius = 2 * this.GetDefaultViewZoom();
                        ///QueryCallback2 callback(m_particleSystem, &shape, m_mouseTracerVelocity);
                        const callback = new QueryCallback2(this.m_particleSystem, shape, this.m_mouseTracerVelocity);
                        const aabb = new box2d.b2AABB();
                        const xf = new box2d.b2Transform();
                        xf.SetIdentity();
                        shape.ComputeAABB(aabb, xf, 0);
                        this.m_world.QueryAABB(callback, aabb);
                    }
                    // #endif
                    if (this.m_bombSpawning) {
                        const c = new box2d.b2Color(0, 0, 1);
                        DebugDraw_1.g_debugDraw.DrawPoint(this.m_bombSpawnPoint, 4, c);
                        c.SetRGB(0.8, 0.8, 0.8);
                        DebugDraw_1.g_debugDraw.DrawSegment(this.m_mouseWorld, this.m_bombSpawnPoint, c);
                    }
                    if (settings.drawContactPoints) {
                        const k_impulseScale = 0.1;
                        const k_axisScale = 0.3;
                        for (let i = 0; i < this.m_pointCount; ++i) {
                            const point = this.m_points[i];
                            if (point.state === box2d.b2PointState.b2_addState) {
                                // Add
                                DebugDraw_1.g_debugDraw.DrawPoint(point.position, 10, new box2d.b2Color(0.3, 0.95, 0.3));
                            }
                            else if (point.state === box2d.b2PointState.b2_persistState) {
                                // Persist
                                DebugDraw_1.g_debugDraw.DrawPoint(point.position, 5, new box2d.b2Color(0.3, 0.3, 0.95));
                            }
                            if (settings.drawContactNormals) {
                                const p1 = point.position;
                                const p2 = box2d.b2Vec2.AddVV(p1, box2d.b2Vec2.MulSV(k_axisScale, point.normal, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
                                DebugDraw_1.g_debugDraw.DrawSegment(p1, p2, new box2d.b2Color(0.9, 0.9, 0.9));
                            }
                            else if (settings.drawContactImpulse) {
                                const p1 = point.position;
                                const p2 = box2d.b2Vec2.AddVMulSV(p1, k_impulseScale * point.normalImpulse, point.normal, new box2d.b2Vec2());
                                DebugDraw_1.g_debugDraw.DrawSegment(p1, p2, new box2d.b2Color(0.9, 0.9, 0.3));
                            }
                            if (settings.drawFrictionImpulse) {
                                const tangent = box2d.b2Vec2.CrossVOne(point.normal, new box2d.b2Vec2());
                                const p1 = point.position;
                                const p2 = box2d.b2Vec2.AddVMulSV(p1, k_impulseScale * point.tangentImpulse, tangent, new box2d.b2Vec2());
                                DebugDraw_1.g_debugDraw.DrawSegment(p1, p2, new box2d.b2Color(0.9, 0.9, 0.3));
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
                    // DEBUG: box2d.b2Assert(group !== null);
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
                    const defaultNumValues = ParticleParameter_1.ParticleParameter.k_defaultDefinition[0].numValues;
                    const defaultValues = ParticleParameter_1.ParticleParameter.k_defaultDefinition[0].values;
                    ///  m_particleParameters = new ParticleParameter::Value[defaultNumValues];
                    this.m_particleParameters = [];
                    // Disable selection of wall and barrier particle types.
                    let numValues = 0;
                    for (let i = 0; i < defaultNumValues; i++) {
                        if (defaultValues[i].value & filterMask) {
                            continue;
                        }
                        ///memcpy(&m_particleParameters[numValues], &defaultValues[i], sizeof(defaultValues[0]));
                        this.m_particleParameters[numValues] = new ParticleParameter_1.ParticleParameterValue(defaultValues[i]);
                        numValues++;
                    }
                    this.m_particleParameterDef = new ParticleParameter_1.ParticleParameterDefinition(this.m_particleParameters, numValues);
                    ///m_particleParameterDef.values = m_particleParameters;
                    ///m_particleParameterDef.numValues = numValues;
                    Test.SetParticleParameters([this.m_particleParameterDef], 1);
                }
                /**
                 * Restore default particle parameters.
                 */
                RestoreParticleParameters() {
                    if (this.m_particleParameters) {
                        Test.SetParticleParameters(ParticleParameter_1.ParticleParameter.k_defaultDefinition, 1);
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
            Test.fullscreenUI = new FullscreenUI_1.FullScreenUI();
            Test.particleParameter = new ParticleParameter_1.ParticleParameter();
            // #endif
            Test.k_maxContactPoints = 2048;
            Test.PreSolve_s_state1 = [ /*box2d.b2_maxManifoldPoints*/];
            Test.PreSolve_s_state2 = [ /*box2d.b2_maxManifoldPoints*/];
            Test.PreSolve_s_worldManifold = new box2d.b2WorldManifold();
            // #if B2_ENABLE_PARTICLE
            Test.k_ParticleColors = [
                new box2d.b2Color().SetByteRGBA(0xff, 0x00, 0x00, 0xff),
                new box2d.b2Color().SetByteRGBA(0x00, 0xff, 0x00, 0xff),
                new box2d.b2Color().SetByteRGBA(0x00, 0x00, 0xff, 0xff),
                new box2d.b2Color().SetByteRGBA(0xff, 0x8c, 0x00, 0xff),
                new box2d.b2Color().SetByteRGBA(0x00, 0xce, 0xd1, 0xff),
                new box2d.b2Color().SetByteRGBA(0xff, 0x00, 0xff, 0xff),
                new box2d.b2Color().SetByteRGBA(0xff, 0xd7, 0x00, 0xff),
                new box2d.b2Color().SetByteRGBA(0x00, 0xff, 0xff, 0xff),
            ];
            Test.k_ParticleColorsCount = Test.k_ParticleColors.length;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQVNBLFNBQWdCLFdBQVcsQ0FBQyxLQUFhLENBQUMsQ0FBQyxFQUFFLEtBQWEsQ0FBQztRQUN6RCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEIsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFSRCxTQUFTO1lBRVQsa0NBQWEsb0JBQW9CLEdBQVcsRUFBRSxFQUFDO1lBUS9DLFdBQUEsTUFBYSxRQUFRO2dCQUFyQjtvQkFDUyxPQUFFLEdBQVcsRUFBRSxDQUFDO29CQUNoQix1QkFBa0IsR0FBVyxDQUFDLENBQUM7b0JBQy9CLHVCQUFrQixHQUFXLENBQUMsQ0FBQztvQkFDdEMseUJBQXlCO29CQUN6QixxRUFBcUU7b0JBQ3JFLGdFQUFnRTtvQkFDaEUsK0RBQStEO29CQUN4RCx1QkFBa0IsR0FBVyxLQUFLLENBQUMsNkJBQTZCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMvRixTQUFTO29CQUNGLGVBQVUsR0FBWSxJQUFJLENBQUM7b0JBQ2xDLHlCQUF5QjtvQkFDbEIsa0JBQWEsR0FBWSxJQUFJLENBQUM7b0JBQ3JDLFNBQVM7b0JBQ0YsZUFBVSxHQUFZLElBQUksQ0FBQztvQkFDM0IsY0FBUyxHQUFZLEtBQUssQ0FBQztvQkFDM0Isc0JBQWlCLEdBQVksS0FBSyxDQUFDO29CQUNuQyx1QkFBa0IsR0FBWSxLQUFLLENBQUM7b0JBQ3BDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztvQkFDcEMsd0JBQW1CLEdBQVksS0FBSyxDQUFDO29CQUNyQyxhQUFRLEdBQVksS0FBSyxDQUFD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