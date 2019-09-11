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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVidWdEcmF3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRGVidWdEcmF3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7Ozs7Ozs7Ozs7WUFJRixTQUFBLE1BQWEsTUFBTTtnQkFBbkI7b0JBQ2tCLGFBQVEsR0FBaUIsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDakUsOEVBQThFO29CQUN2RSxhQUFRLEdBQVcsRUFBRSxDQUFDO29CQUN0QixXQUFNLEdBQVcsQ0FBQyxDQUFDO29CQUNuQixZQUFPLEdBQVcsSUFBSSxDQUFDO29CQUN2QixhQUFRLEdBQVcsR0FBRyxDQUFDO2dCQXNFaEMsQ0FBQztnQkFwRVEsb0JBQW9CLENBQUMsV0FBeUIsRUFBRSxHQUFpQjtvQkFDdEUsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN0RCxDQUFDO2dCQUVNLG9CQUFvQixDQUFDLFVBQXdCLEVBQUUsR0FBaUI7b0JBQ3JFLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDckQsQ0FBQztnQkFFTSx3QkFBd0IsQ0FBQyxRQUFzQixFQUFFLEdBQWlCO29CQUN2RSw0Q0FBNEM7b0JBQzVDLE1BQU0sU0FBUyxHQUFXLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM1RCxNQUFNLFNBQVMsR0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDN0QsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztnQkFFTSx3QkFBd0IsQ0FBQyxPQUFxQixFQUFFLEdBQWlCO29CQUN0RSw0Q0FBNEM7b0JBQzVDLE1BQU0sVUFBVSxHQUFXLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUM1RCxNQUFNLFVBQVUsR0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDN0QsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFFTSwyQkFBMkIsQ0FBQyxVQUF3QixFQUFFLEdBQWlCO29CQUM1RSxNQUFNLFFBQVEsR0FBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDcEQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN4RCx5REFBeUQ7b0JBQ3pELEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUNoRixPQUFPLFFBQVEsQ0FBQztnQkFDbEIsQ0FBQztnQkFFTSwyQkFBMkIsQ0FBQyxRQUFzQixFQUFFLEdBQWlCO29CQUMxRSxNQUFNLFVBQVUsR0FBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEQsaUVBQWlFO29CQUNqRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDOUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7b0JBQ3hELE9BQU8sVUFBVSxDQUFDO2dCQUNwQixDQUFDO2dCQUVNLHdCQUF3QixDQUFDLEtBQW1CLEVBQUUsR0FBaUI7b0JBQ3BFLE1BQU0sVUFBVSxHQUFpQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNqRCxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDMUQsMkRBQTJEO29CQUMzRCxPQUFPLFVBQVUsQ0FBQztnQkFDcEIsQ0FBQztnQkFFTSx3QkFBd0IsQ0FBQyxVQUF3QixFQUFFLEdBQWlCO29CQUN6RSxNQUFNLEtBQUssR0FBaUIsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDakQsZ0RBQWdEO29CQUNoRCxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDaEQsT0FBTyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQztnQkFFTSxxQkFBcUIsQ0FBQyxPQUFxQixFQUFFLEdBQWlCO29CQUNuRSxNQUFNLFFBQVEsR0FBaUIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0UsTUFBTSxVQUFVLEdBQWlCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2pGLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztnQkFFTSxxQkFBcUIsQ0FBQyxLQUFtQixFQUFFLEdBQWlCO29CQUNqRSxNQUFNLFVBQVUsR0FBaUIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0UsTUFBTSxRQUFRLEdBQWlCLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ2pGLE9BQU8sSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEQsQ0FBQztnQkFFTSwwQkFBMEIsQ0FBQyxPQUFxQixFQUFFLEdBQWlCO29CQUN4RSxNQUFNLFFBQVEsR0FBaUIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDM0UsT0FBTyxJQUFJLENBQUMsMkJBQTJCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6RCxDQUFDO2FBQ0YsQ0FBQTs7WUFFRCxpRUFBaUU7WUFDakUsd0JBQXdCO1lBQ3hCLFlBQUEsTUFBYSxTQUFVLFNBQVEsS0FBSyxDQUFDLE1BQU07Z0JBR3pDO29CQUNFLEtBQUssRUFBRSxDQUFDO29CQUhILFVBQUssR0FBb0MsSUFBSSxDQUFDO2dCQUlyRCxDQUFDO2dCQUVNLGFBQWEsQ0FBQyxFQUFxQjtvQkFDeEMsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDWCxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3FCQUM3QjtnQkFDSCxDQUFDO2dCQUVNLFlBQVksQ0FBQyxFQUFxQjtvQkFDdkMsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDZjtnQkFDSCxDQUFDO2dCQUVNLFdBQVcsQ0FBQyxRQUF3QixFQUFFLFdBQW1CLEVBQUUsS0FBb0I7b0JBQ3BGLE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQzVDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzFDO3dCQUNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2Q7Z0JBQ0gsQ0FBQztnQkFFTSxnQkFBZ0IsQ0FBQyxRQUF3QixFQUFFLFdBQW1CLEVBQUUsS0FBb0I7b0JBQ3pGLE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQzVDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQzFDO3dCQUNELEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUMzQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ1gsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2Q7Z0JBQ0gsQ0FBQztnQkFFTSxVQUFVLENBQUMsTUFBb0IsRUFBRSxNQUFjLEVBQUUsS0FBb0I7b0JBQzFFLE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQzlELEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUNkO2dCQUNILENBQUM7Z0JBRU0sZUFBZSxDQUFDLE1BQW9CLEVBQUUsTUFBYyxFQUFFLElBQWtCLEVBQUUsS0FBb0I7b0JBQ25HLE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxNQUFNLEVBQUUsR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixNQUFNLEVBQUUsR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUM1QixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDbkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDM0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUMzQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ1gsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2Q7Z0JBQ0gsQ0FBQztnQkFFRCx5QkFBeUI7Z0JBQ2xCLGFBQWEsQ0FBQyxPQUF1QixFQUFFLE1BQWMsRUFBRSxNQUE4QixFQUFFLEtBQWE7b0JBQ3pHLE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7NEJBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0NBQzlCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDMUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUN4QixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQ0FDeEMsOEVBQThFO2dDQUM5RSxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7Z0NBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7NkJBQzVGO3lCQUNGOzZCQUFNOzRCQUNMLEdBQUcsQ0FBQyxTQUFTLEdBQUcsdUJBQXVCLENBQUM7NEJBQ3hDLG1CQUFtQjs0QkFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtnQ0FDOUIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUMxQiwwRUFBMEU7Z0NBQzFFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs2QkFDNUY7NEJBQ0QsY0FBYzt5QkFDZjtxQkFDRjtnQkFDSCxDQUFDO2dCQUNELFNBQVM7Z0JBRUYsV0FBVyxDQUFDLEVBQWdCLEVBQUUsRUFBZ0IsRUFBRSxLQUFvQjtvQkFDekUsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ2Q7Z0JBQ0gsQ0FBQztnQkFFTSxhQUFhLENBQUMsRUFBcUI7b0JBQ3hDLE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUV2QixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDakIsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFFYixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDakIsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3pELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzt3QkFFYixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN2QjtnQkFDSCxDQUFDO2dCQUVNLFNBQVMsQ0FBQyxDQUFlLEVBQUUsSUFBWSxFQUFFLEtBQW9CO29CQUNsRSxNQUFNLEdBQUcsR0FBb0MsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDeEQsSUFBSSxHQUFHLEVBQUU7d0JBQ1AsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7d0JBQ3hDLElBQUksSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUN4QixJQUFJLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQzt3QkFDMUIsTUFBTSxLQUFLLEdBQVcsSUFBSSxHQUFHLENBQUMsQ0FBQzt3QkFDL0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ3BEO2dCQUNILENBQUM7Z0JBR00sVUFBVSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsT0FBZTtvQkFDckQsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDWCxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUM7d0JBQzVCLE1BQU0sS0FBSyxHQUFrQixTQUFTLENBQUMsa0JBQWtCLENBQUM7d0JBQzFELEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO3dCQUN4QyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzVCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDZjtnQkFDSCxDQUFDO2dCQUtNLGVBQWUsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLE9BQWU7b0JBQzFELE1BQU0sR0FBRyxHQUFvQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN4RCxJQUFJLEdBQUcsRUFBRTt3QkFDUCxNQUFNLENBQUMsR0FBaUIsU0FBUyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBRWhFLG9CQUFvQjt3QkFDcEIsTUFBTSxFQUFFLEdBQWlCLFFBQVEsQ0FBQyxRQUFRLENBQUM7d0JBQzNDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLDhCQUE4Qjt3QkFDOUIsZ0NBQWdDO3dCQUNoQyxNQUFNLEVBQUUsR0FBVyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNuQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFakMscUJBQXFCO3dCQUNyQixNQUFNLEVBQUUsR0FBVyxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO3dCQUMvRCxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNWLE1BQU0sRUFBRSxHQUFpQixTQUFTLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDN0csS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFN0IsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNYLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsR0FBRyxDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQzt3QkFDNUIsTUFBTSxLQUFLLEdBQWtCLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQzt3QkFDL0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7d0JBQ3hDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQ2Y7Z0JBQ0gsQ0FBQztnQkFFTSxRQUFRLENBQUMsSUFBa0IsRUFBRSxLQUFvQjtvQkFDdEQsTUFBTSxHQUFHLEdBQW9DLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQ3hELElBQUksR0FBRyxFQUFFO3dCQUNQLEdBQUcsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO3dCQUMxQyxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsTUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7d0JBQ3BDLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO3dCQUN4RCxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDeEQsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDNUI7Z0JBQ0gsQ0FBQzthQUNGLENBQUE7O1lBMURnQiw0QkFBa0IsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFjckUsNkJBQW1CLEdBQWlCLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZELDhCQUFvQixHQUFpQixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4RCxpQ0FBdUIsR0FBa0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUE0QzNGLHlCQUFhLFdBQVcsR0FBYyxJQUFJLFNBQVMsRUFBRSxFQUFDO1lBQ3RELHNCQUFhLFFBQVEsR0FBVyxJQUFJLE1BQU0sRUFBRSxFQUFDIn0=