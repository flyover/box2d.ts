/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
System.register(["@box2d"], function (exports_1, context_1) {
    "use strict";
    var box2d, Camera, DebugDraw, g_debugDraw, g_camera;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (box2d_1) {
                box2d = box2d_1;
            }
        ],
        execute: function () {
            Camera = class Camera {
                constructor() {
                    this.m_center = new box2d.b2Vec2(0, 20);
                    ///public readonly m_roll: box2d.b2Rot = new box2d.b2Rot(box2d.b2DegToRad(0));
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
                    box2d.b2Vec2.MulSV(1 / this.m_zoom, viewport, viewport);
                    ///box2d.b2Vec2.MulSV(this.m_extent, viewport, viewport);
                    box2d.b2Vec2.MulSV(0.5 * this.m_height / this.m_extent, projection, projection);
                    return viewport;
                }
                ConvertViewportToProjection(viewport, out) {
                    const projection = out.Copy(viewport);
                    ///box2d.b2Vec2.MulSV(1 / this.m_extent, projection, projection);
                    box2d.b2Vec2.MulSV(2 * this.m_extent / this.m_height, projection, projection);
                    box2d.b2Vec2.MulSV(this.m_zoom, projection, projection);
                    return projection;
                }
                ConvertWorldToProjection(world, out) {
                    const projection = out.Copy(world);
                    box2d.b2Vec2.SubVV(projection, this.m_center, projection);
                    ///box2d.b2Rot.MulTRV(this.m_roll, projection, projection);
                    return projection;
                }
                ConvertProjectionToWorld(projection, out) {
                    const world = out.Copy(projection);
                    ///box2d.b2Rot.MulRV(this.m_roll, world, world);
                    box2d.b2Vec2.AddVV(this.m_center, world, world);
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
            DebugDraw = class DebugDraw extends box2d.b2Draw {
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
                        ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true);
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
                        ctx.arc(cx, cy, radius, 0, box2d.b2_pi * 2, true);
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
                                ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true);
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
                                ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true);
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
                        ctx.strokeStyle = box2d.b2Color.RED.MakeStyleString(1);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, 1);
                        ctx.strokeStyle = box2d.b2Color.GREEN.MakeStyleString(1);
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
                        box2d.b2Vec2.SubVV(p, vt, p);
                        ///const vr = g_camera.m_roll;
                        ///box2d.b2Rot.MulTRV(vr, p, p);
                        const vs = g_camera.m_zoom;
                        box2d.b2Vec2.MulSV(1 / vs, p, p);
                        // viewport -> canvas
                        const cs = 0.5 * g_camera.m_height / g_camera.m_extent;
                        box2d.b2Vec2.MulSV(cs, p, p);
                        p.y *= -1;
                        const cc = DebugDraw.DrawStringWorld_s_cc.Set(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
                        box2d.b2Vec2.AddVV(p, cc, p);
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
            DebugDraw.DrawString_s_color = new box2d.b2Color(0.9, 0.6, 0.6);
            DebugDraw.DrawStringWorld_s_p = new box2d.b2Vec2();
            DebugDraw.DrawStringWorld_s_cc = new box2d.b2Vec2();
            DebugDraw.DrawStringWorld_s_color = new box2d.b2Color(0.5, 0.9, 0.5);
            exports_1("g_debugDraw", g_debugDraw = new DebugDraw());
            exports_1("g_camera", g_camera = new Camera());
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyYXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7OztZQUlGLFNBQUEsTUFBYSxNQUFNO2dCQUFuQjtvQkFDa0IsYUFBUSxHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNqRSw4RUFBOEU7b0JBQ3ZFLGFBQVEsR0FBVyxFQUFFLENBQUM7b0JBQ3RCLFdBQU0sR0FBVyxDQUFDLENBQUM7b0JBQ25CLFlBQU8sR0FBVyxJQUFJLENBQUM7b0JBQ3ZCLGFBQVEsR0FBVyxHQUFHLENBQUM7Z0JBc0VoQyxDQUFDO2dCQXBFUSxvQkFBb0IsQ0FBQyxXQUF5QixFQUFFLEdBQWlCO29CQUN0RSxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3RELENBQUM7Z0JBRU0sb0JBQW9CLENBQUMsVUFBd0IsRUFBRSxHQUFpQjtvQkFDckUsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2dCQUVNLHdCQUF3QixDQUFDLFFBQXNCLEVBQUUsR0FBaUI7b0JBQ3ZFLDRDQUE0QztvQkFDNUMsTUFBTSxTQUFTLEdBQVcsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVELE1BQU0sU0FBUyxHQUFXLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUM3RCxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVNLHdCQUF3QixDQUFDLE9BQXFCLEVBQUUsR0FBaUI7b0JBQ3RFLDRDQUE0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