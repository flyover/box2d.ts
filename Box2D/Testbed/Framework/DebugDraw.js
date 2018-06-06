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
System.register(["Box2D"], function (exports_1, context_1) {
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
                                ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                                ///ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true); ctx.fill();
                            }
                        }
                        else {
                            ctx.fillStyle = "rgba(255,255,255,0.5)";
                            ctx.beginPath();
                            for (let i = 0; i < count; ++i) {
                                const center = centers[i];
                                ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                                ///ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true); ctx.fill();
                            }
                            ctx.fill();
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
            DebugDraw.DrawString_s_color = new box2d.b2Color(0.9, 0.6, 0.6);
            DebugDraw.DrawStringWorld_s_p = new box2d.b2Vec2();
            DebugDraw.DrawStringWorld_s_cc = new box2d.b2Vec2();
            DebugDraw.DrawStringWorld_s_color = new box2d.b2Color(0.5, 0.9, 0.5);
            exports_1("DebugDraw", DebugDraw);
            exports_1("g_debugDraw", g_debugDraw = new DebugDraw());
            exports_1("g_camera", g_camera = new Camera());
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdEcmF3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRGVidWdEcmF3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7WUFJRixTQUFBO2dCQUFBO29CQUNrQixhQUFRLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2pFLDhFQUE4RTtvQkFDdkUsYUFBUSxHQUFXLEVBQUUsQ0FBQztvQkFDdEIsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsWUFBTyxHQUFXLElBQUksQ0FBQztvQkFDdkIsYUFBUSxHQUFXLEdBQUcsQ0FBQztnQkFzRWhDLENBQUM7Z0JBcEVRLG9CQUFvQixDQUFDLFdBQXlCLEVBQUUsR0FBaUI7b0JBQ3RFLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEQsQ0FBQztnQkFFTSxvQkFBb0IsQ0FBQyxVQUF3QixFQUFFLEdBQWlCO29CQUNyRSxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBRU0sd0JBQXdCLENBQUMsUUFBc0IsRUFBRSxHQUFpQjtvQkFDdkUsNENBQTRDO29CQUM1QyxNQUFNLFNBQVMsR0FBVyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDNUQsTUFBTSxTQUFTLEdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQzdELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBRU0sd0JBQXdCLENBQUMsT0FBcUIsRUFBRSxHQUFpQjtvQkFDdEUsNENBQTRD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