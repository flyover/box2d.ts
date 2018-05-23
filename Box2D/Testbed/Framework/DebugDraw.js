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
System.register(["../../Box2D/Box2D"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var box2d, Camera, DebugDraw, g_debugDraw, g_camera;
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
                    ///public m_roll: box2d.b2Rot = new box2d.b2Rot(box2d.b2DegToRad(0));
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
                ///#if B2_ENABLE_PARTICLE
                DrawParticles(centers, radius, colors, count) {
                    const ctx = this.m_ctx;
                    if (ctx) {
                        if (colors !== null) {
                            for (let i = 0; i < count; ++i) {
                                let center = centers[i];
                                let color = colors[i];
                                ctx.fillStyle = color.MakeStyleString();
                                ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                                ///ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true); ctx.fill();
                            }
                        }
                        else {
                            ctx.fillStyle = "rgba(255,255,255,0.5)";
                            ctx.beginPath();
                            for (let i = 0; i < count; ++i) {
                                let center = centers[i];
                                ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
                                ///ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true); ctx.fill();
                            }
                            ctx.fill();
                        }
                    }
                }
                ///#endif
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
                        box2d.b2Vec2.MulSV(vs, p, p);
                        // viewport -> canvas
                        const cs = g_camera.m_extent;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdEcmF3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRGVidWdEcmF3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7WUFJRixTQUFBO2dCQUFBO29CQUNTLGFBQVEsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDeEQscUVBQXFFO29CQUM5RCxhQUFRLEdBQVcsRUFBRSxDQUFDO29CQUN0QixXQUFNLEdBQVcsQ0FBQyxDQUFDO29CQUNuQixZQUFPLEdBQVcsSUFBSSxDQUFDO29CQUN2QixhQUFRLEdBQVcsR0FBRyxDQUFDO2dCQXNFaEMsQ0FBQztnQkFwRVEsb0JBQW9CLENBQUMsV0FBeUIsRUFBRSxHQUFpQjtvQkFDdEUsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxDQUFDO2dCQUVNLG9CQUFvQixDQUFDLFVBQXdCLEVBQUUsR0FBaUI7b0JBQ3JFLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDckQsQ0FBQztnQkFFTSx3QkFBd0IsQ0FBQyxRQUFzQixFQUFFLEdBQWlCO29CQUN2RSw0Q0FBNEM7b0JBQzVDLE1BQU0sU0FBUyxHQUFXLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM1RCxNQUFNLFNBQVMsR0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDN0QsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztnQkFFTSx3QkFBd0IsQ0FBQyxPQUFxQixFQUFFLEdBQWlCO29CQUN0RSw0Q0FBNEM7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