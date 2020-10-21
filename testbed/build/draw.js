// MIT License
System.register(["@box2d"], function (exports_1, context_1) {
    "use strict";
    var b2, Camera, DebugDraw, g_debugDraw, g_camera;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_1) {
                b2 = b2_1;
            }
        ],
        execute: function () {
            Camera = class Camera {
                constructor() {
                    this.m_center = new b2.Vec2(0, 20);
                    ///public readonly m_roll: b2.Rot = new b2.Rot(b2.DegToRad(0));
                    this.m_extent = 25;
                    this.m_zoom = 1;
                    this.m_width = 1280;
                    this.m_height = 800;
                }
                ConvertScreenToWorld(screenPoint, out) {
                    return this.ConvertElementToWorld(screenPoint, out);
                }
                ConvertWorldToScreen(worldPoint, out) {
                    return this.ConvertWorldToElement(worldPoint, out);
                }
                ConvertViewportToElement(viewport, out) {
                    // 0,0 at center of canvas, x right and y up
                    const element_x = viewport.x + (0.5 * this.m_width);
                    const element_y = (0.5 * this.m_height) - viewport.y;
                    return out.Set(element_x, element_y);
                }
                ConvertElementToViewport(element, out) {
                    // 0,0 at center of canvas, x right and y up
                    const viewport_x = element.x - (0.5 * this.m_width);
                    const viewport_y = (0.5 * this.m_height) - element.y;
                    return out.Set(viewport_x, viewport_y);
                }
                ConvertProjectionToViewport(projection, out) {
                    const viewport = out.Copy(projection);
                    b2.Vec2.MulSV(1 / this.m_zoom, viewport, viewport);
                    ///b2.Vec2.MulSV(this.m_extent, viewport, viewport);
                    b2.Vec2.MulSV(0.5 * this.m_height / this.m_extent, projection, projection);
                    return viewport;
                }
                ConvertViewportToProjection(viewport, out) {
                    const projection = out.Copy(viewport);
                    ///b2.Vec2.MulSV(1 / this.m_extent, projection, projection);
                    b2.Vec2.MulSV(2 * this.m_extent / this.m_height, projection, projection);
                    b2.Vec2.MulSV(this.m_zoom, projection, projection);
                    return projection;
                }
                ConvertWorldToProjection(world, out) {
                    const projection = out.Copy(world);
                    b2.Vec2.SubVV(projection, this.m_center, projection);
                    ///b2.Rot.MulTRV(this.m_roll, projection, projection);
                    return projection;
                }
                ConvertProjectionToWorld(projection, out) {
                    const world = out.Copy(projection);
                    ///b2.Rot.MulRV(this.m_roll, world, world);
                    b2.Vec2.AddVV(this.m_center, world, world);
                    return world;
                }
                ConvertElementToWorld(element, out) {
                    const viewport = this.ConvertElementToViewport(element, out);
                    const projection = this.ConvertViewportToProjection(viewport, out);
                    return this.ConvertProjectionToWorld(projection, out);
                }
                ConvertWorldToElement(world, out) {
                    const projection = this.ConvertWorldToProjection(world, out);
                    const viewport = this.ConvertProjectionToViewport(projection, out);
                    return this.ConvertViewportToElement(viewport, out);
                }
                ConvertElementToProjection(element, out) {
                    const viewport = this.ConvertElementToViewport(element, out);
                    return this.ConvertViewportToProjection(viewport, out);
                }
            };
            exports_1("Camera", Camera);
            // This class implements debug drawing callbacks that are invoked
            // inside b2World::Step.
            DebugDraw = class DebugDraw extends b2.Draw {
                constructor() {
                    super();
                    this.m_ctx = null;
                }
                PushTransform(xf) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.save();
                        ctx.translate(xf.p.x, xf.p.y);
                        ctx.rotate(xf.q.GetAngle());
                    }
                }
                PopTransform(xf) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.restore();
                    }
                }
                DrawPolygon(vertices, vertexCount, color) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.beginPath();
                        ctx.moveTo(vertices[0].x, vertices[0].y);
                        for (let i = 1; i < vertexCount; i++) {
                            ctx.lineTo(vertices[i].x, vertices[i].y);
                        }
                        ctx.closePath();
                        ctx.strokeStyle = color.MakeStyleString(1);
                        ctx.stroke();
                    }
                }
                DrawSolidPolygon(vertices, vertexCount, color) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.beginPath();
                        ctx.moveTo(vertices[0].x, vertices[0].y);
                        for (let i = 1; i < vertexCount; i++) {
                            ctx.lineTo(vertices[i].x, vertices[i].y);
                        }
                        ctx.closePath();
                        ctx.fillStyle = color.MakeStyleString(0.5);
                        ctx.fill();
                        ctx.strokeStyle = color.MakeStyleString(1);
                        ctx.stroke();
                    }
                }
                DrawCircle(center, radius, color) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.beginPath();
                        ctx.arc(center.x, center.y, radius, 0, b2.pi * 2, true);
                        ctx.strokeStyle = color.MakeStyleString(1);
                        ctx.stroke();
                    }
                }
                DrawSolidCircle(center, radius, axis, color) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        const cx = center.x;
                        const cy = center.y;
                        ctx.beginPath();
                        ctx.arc(cx, cy, radius, 0, b2.pi * 2, true);
                        ctx.moveTo(cx, cy);
                        ctx.lineTo((cx + axis.x * radius), (cy + axis.y * radius));
                        ctx.fillStyle = color.MakeStyleString(0.5);
                        ctx.fill();
                        ctx.strokeStyle = color.MakeStyleString(1);
                        ctx.stroke();
                    }
                }
                // #if B2_ENABLE_PARTICLE
                DrawParticles(centers, radius, colors, count) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        if (colors !== null) {
                            for (let i = 0; i < count; ++i) {
                                const center = centers[i];
                                const color = colors[i];
                                ctx.fillStyle = color.MakeStyleString();
                                // ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                                ctx.beginPath();
                                ctx.arc(center.x, center.y, radius, 0, b2.pi * 2, true);
                                ctx.fill();
                            }
                        }
                        else {
                            ctx.fillStyle = "rgba(255,255,255,0.5)";
                            // ctx.beginPath();
                            for (let i = 0; i < count; ++i) {
                                const center = centers[i];
                                // ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                                ctx.beginPath();
                                ctx.arc(center.x, center.y, radius, 0, b2.pi * 2, true);
                                ctx.fill();
                            }
                            // ctx.fill();
                        }
                    }
                }
                // #endif
                DrawSegment(p1, p2, color) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = color.MakeStyleString(1);
                        ctx.stroke();
                    }
                }
                DrawTransform(xf) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        this.PushTransform(xf);
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(1, 0);
                        ctx.strokeStyle = b2.Color.RED.MakeStyleString(1);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, 1);
                        ctx.strokeStyle = b2.Color.GREEN.MakeStyleString(1);
                        ctx.stroke();
                        this.PopTransform(xf);
                    }
                }
                DrawPoint(p, size, color) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.fillStyle = color.MakeStyleString();
                        size *= g_camera.m_zoom;
                        size /= g_camera.m_extent;
                        const hsize = size / 2;
                        ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
                    }
                }
                DrawString(x, y, message) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.save();
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.font = "15px DroidSans";
                        const color = DebugDraw.DrawString_s_color;
                        ctx.fillStyle = color.MakeStyleString();
                        ctx.fillText(message, x, y);
                        ctx.restore();
                    }
                }
                DrawStringWorld(x, y, message) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        const p = DebugDraw.DrawStringWorld_s_p.Set(x, y);
                        // world -> viewport
                        const vt = g_camera.m_center;
                        b2.Vec2.SubVV(p, vt, p);
                        ///const vr = g_camera.m_roll;
                        ///b2.Rot.MulTRV(vr, p, p);
                        const vs = g_camera.m_zoom;
                        b2.Vec2.MulSV(1 / vs, p, p);
                        // viewport -> canvas
                        const cs = 0.5 * g_camera.m_height / g_camera.m_extent;
                        b2.Vec2.MulSV(cs, p, p);
                        p.y *= -1;
                        const cc = DebugDraw.DrawStringWorld_s_cc.Set(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
                        b2.Vec2.AddVV(p, cc, p);
                        ctx.save();
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.font = "15px DroidSans";
                        const color = DebugDraw.DrawStringWorld_s_color;
                        ctx.fillStyle = color.MakeStyleString();
                        ctx.fillText(message, p.x, p.y);
                        ctx.restore();
                    }
                }
                DrawAABB(aabb, color) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        ctx.strokeStyle = color.MakeStyleString();
                        const x = aabb.lowerBound.x;
                        const y = aabb.lowerBound.y;
                        const w = aabb.upperBound.x - aabb.lowerBound.x;
                        const h = aabb.upperBound.y - aabb.lowerBound.y;
                        ctx.strokeRect(x, y, w, h);
                    }
                }
            };
            exports_1("DebugDraw", DebugDraw);
            DebugDraw.DrawString_s_color = new b2.Color(0.9, 0.6, 0.6);
            DebugDraw.DrawStringWorld_s_p = new b2.Vec2();
            DebugDraw.DrawStringWorld_s_cc = new b2.Vec2();
            DebugDraw.DrawStringWorld_s_color = new b2.Color(0.5, 0.9, 0.5);
            exports_1("g_debugDraw", g_debugDraw = new DebugDraw());
            exports_1("g_camera", g_camera = new Camera());
        }
    };
});
//# sourceMappingURL=draw.js.map