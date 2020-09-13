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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2RyYXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7Ozs7Ozs7OztZQUlGLFNBQUEsTUFBYSxNQUFNO2dCQUFuQjtvQkFDa0IsYUFBUSxHQUFZLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ3ZELCtEQUErRDtvQkFDeEQsYUFBUSxHQUFXLEVBQUUsQ0FBQztvQkFDdEIsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFDbkIsWUFBTyxHQUFXLElBQUksQ0FBQztvQkFDdkIsYUFBUSxHQUFXLEdBQUcsQ0FBQztnQkFzRWhDLENBQUM7Z0JBcEVRLG9CQUFvQixDQUFDLFdBQW9CLEVBQUUsR0FBWTtvQkFDNUQsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxDQUFDO2dCQUVNLG9CQUFvQixDQUFDLFVBQW1CLEVBQUUsR0FBWTtvQkFDM0QsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2dCQUVNLHdCQUF3QixDQUFDLFFBQWlCLEVBQUUsR0FBWTtvQkFDN0QsNENBQTRDO29CQUM1QyxNQUFNLFNBQVMsR0FBVyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDNUQsTUFBTSxTQUFTLEdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQzdELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBRU0sd0JBQXdCLENBQUMsT0FBZ0IsRUFBRSxHQUFZO29CQUM1RCw0Q0FBNEM7b0JBQzVDLE1BQU0sVUFBVSxHQUFXLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM1RCxNQUFNLFVBQVUsR0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDN0QsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFFTSwyQkFBMkIsQ0FBQyxVQUFtQixFQUFFLEdBQVk7b0JBQ2xFLE1BQU0sUUFBUSxHQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQy9DLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDbkQsb0RBQW9EO29CQUNwRCxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDM0UsT0FBTyxRQUFRLENBQUM7Z0JBQ2xCLENBQUM7Z0JBRU0sMkJBQTJCLENBQUMsUUFBaUIsRUFBRSxHQUFZO29CQUNoRSxNQUFNLFVBQVUsR0FBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQyw0REFBNEQ7b0JBQzVELEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUN6RSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDbkQsT0FBTyxVQUFVLENBQUM7Z0JBQ3BCLENBQUM7Z0JBRU0sd0JBQXdCLENBQUMsS0FBYyxFQUFFLEdBQVk7b0JBQzFELE1BQU0sVUFBVSxHQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzVDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNyRCxzREFBc0Q7b0JBQ3RELE9BQU8sVUFBVSxDQUFDO2dCQUNwQixDQUFDO2dCQUVNLHdCQUF3QixDQUFDLFVBQW1CLEVBQUUsR0FBWTtvQkFDL0QsTUFBTSxLQUFLLEdBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDNUMsMkNBQTJDO29CQUMzQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDM0MsT0FBTyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQztnQkFFTSxxQkFBcUIsQ0FBQyxPQUFnQixFQUFFLEdBQVk7b0JBQ3pELE1BQU0sUUFBUSxHQUFZLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3RFLE1BQU0sVUFBVSxHQUFZLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzVFLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztnQkFFTSxxQkFBcUIsQ0FBQyxLQUFjLEVBQUUsR0FBWTtvQkFDdkQsTUFBTSxVQUFVLEdBQVksSUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDdEUsTUFBTSxRQUFRLEdBQVksSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDNUUsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxDQUFDO2dCQUVNLDBCQUEwQixDQUFDLE9BQWdCLEVBQUUsR0FBWTtvQkFDOUQsTUFBTSxRQUFRLEdBQVksSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDdEUsT0FBTyxJQUFJLENBQUMsMkJBQTJCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6RCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxpRUFBaUU7WUFDakUsd0JBQXdCO1lBQ3hCLFlBQUEsTUFBYSxTQUFVLFNBQVEsRUFBRSxDQUFDLElBQUk7Z0JBR3BDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUhILFVBQUssR0FBb0MsSUFBSSxDQUFDO2dCQUlyRCxDQUFDO2dCQUVNLGFBQWEsQ0FBQyxFQUFnQjtvQkFDbkMsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDWCxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3FCQUM3QjtnQkFDSCxDQUFDO2dCQUVNLFlBQVksQ0FBQyxFQUFnQjtvQkFDbEMsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDZjtnQkFDSCxDQUFDO2dCQUVNLFdBQVcsQ0FBQyxRQUFtQixFQUFFLFdBQW1CLEVBQUUsS0FBZTtvQkFDMUUsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDekMsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDNUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDMUM7d0JBQ0QsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNoQixHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDZDtnQkFDSCxDQUFDO2dCQUVNLGdCQUFnQixDQUFDLFFBQW1CLEVBQUUsV0FBbUIsRUFBRSxLQUFlO29CQUMvRSxNQUFNLEdBQUcsR0FBb0MsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDeEQsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUM1QyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMxQzt3QkFDRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDM0MsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNYLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNkO2dCQUNILENBQUM7Z0JBRU0sVUFBVSxDQUFDLE1BQWUsRUFBRSxNQUFjLEVBQUUsS0FBZTtvQkFDaEUsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDeEQsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2Q7Z0JBQ0gsQ0FBQztnQkFFTSxlQUFlLENBQUMsTUFBZSxFQUFFLE1BQWMsRUFBRSxJQUFhLEVBQUUsS0FBZTtvQkFDcEYsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLE1BQU0sRUFBRSxHQUFXLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzVCLE1BQU0sRUFBRSxHQUFXLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQzVCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzVDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUNuQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUMzRCxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzNDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDWCxHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDZDtnQkFDSCxDQUFDO2dCQUVELHlCQUF5QjtnQkFDbEIsYUFBYSxDQUFDLE9BQWtCLEVBQUUsTUFBYyxFQUFFLE1BQXlCLEVBQUUsS0FBYTtvQkFDL0YsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLElBQUksTUFBTSxLQUFLLElBQUksRUFBRTs0QkFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtnQ0FDOUIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUMxQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3hCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dDQUN4Qyw4RUFBOEU7Z0NBQzlFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs2QkFDdEY7eUJBQ0Y7NkJBQU07NEJBQ0wsR0FBRyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQzs0QkFDeEMsbUJBQW1COzRCQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dDQUM5QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQzFCLDBFQUEwRTtnQ0FDMUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0NBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDOzZCQUN0Rjs0QkFDRCxjQUFjO3lCQUNmO3FCQUNGO2dCQUNILENBQUM7Z0JBQ0QsU0FBUztnQkFFRixXQUFXLENBQUMsRUFBVyxFQUFFLEVBQVcsRUFBRSxLQUFlO29CQUMxRCxNQUFNLEdBQUcsR0FBb0MsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDeEQsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDZDtnQkFDSCxDQUFDO2dCQUVNLGFBQWEsQ0FBQyxFQUFnQjtvQkFDbkMsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBRXZCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixHQUFHLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEQsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUViLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixHQUFHLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDcEQsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO3dCQUViLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ3ZCO2dCQUNILENBQUM7Z0JBRU0sU0FBUyxDQUFDLENBQVUsRUFBRSxJQUFZLEVBQUUsS0FBZTtvQkFDeEQsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO3dCQUN4QyxJQUFJLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDeEIsSUFBSSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUM7d0JBQzFCLE1BQU0sS0FBSyxHQUFXLElBQUksR0FBRyxDQUFDLENBQUM7d0JBQy9CLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUNwRDtnQkFDSCxDQUFDO2dCQUdNLFVBQVUsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLE9BQWU7b0JBQ3JELE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ1gsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNuQyxHQUFHLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDO3dCQUM1QixNQUFNLEtBQUssR0FBYSxTQUFTLENBQUMsa0JBQWtCLENBQUM7d0JBQ3JELEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO3dCQUN4QyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDZjtnQkFDSCxDQUFDO2dCQUtNLGVBQWUsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLE9BQWU7b0JBQzFELE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxNQUFNLENBQUMsR0FBWSxTQUFTLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFM0Qsb0JBQW9CO3dCQUNwQixNQUFNLEVBQUUsR0FBWSxRQUFRLENBQUMsUUFBUSxDQUFDO3dCQUN0QyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN4Qiw4QkFBOEI7d0JBQzlCLDJCQUEyQjt3QkFDM0IsTUFBTSxFQUFFLEdBQVcsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDbkMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBRTVCLHFCQUFxQjt3QkFDckIsTUFBTSxFQUFFLEdBQVcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQzt3QkFDL0QsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDVixNQUFNLEVBQUUsR0FBWSxTQUFTLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDeEcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFeEIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNYLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsR0FBRyxDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQzt3QkFDNUIsTUFBTSxLQUFLLEdBQWEsU0FBUyxDQUFDLHVCQUF1QixDQUFDO3dCQUMxRCxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQzt3QkFDeEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2hDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDZjtnQkFDSCxDQUFDO2dCQUVNLFFBQVEsQ0FBQyxJQUFhLEVBQUUsS0FBZTtvQkFDNUMsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO3dCQUMxQyxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsTUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUN4RCxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDeEQsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDNUI7Z0JBQ0gsQ0FBQzthQUNGLENBQUE7O1lBMURnQiw0QkFBa0IsR0FBYSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQWMzRCw2QkFBbUIsR0FBWSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM3Qyw4QkFBb0IsR0FBWSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5QyxpQ0FBdUIsR0FBYSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQTRDakYseUJBQWEsV0FBVyxHQUFjLElBQUksU0FBUyxFQUFFLEVBQUM7WUFDdEQsc0JBQWEsUUFBUSxHQUFXLElBQUksTUFBTSxFQUFFLEVBQUMifQ==