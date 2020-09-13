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

import * as b2 from "@box2d";

export class Camera {
  public readonly m_center: b2.Vec2 = new b2.Vec2(0, 20);
  ///public readonly m_roll: b2.Rot = new b2.Rot(b2.DegToRad(0));
  public m_extent: number = 25;
  public m_zoom: number = 1;
  public m_width: number = 1280;
  public m_height: number = 800;

  public ConvertScreenToWorld(screenPoint: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    return this.ConvertElementToWorld(screenPoint, out);
  }

  public ConvertWorldToScreen(worldPoint: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    return this.ConvertWorldToElement(worldPoint, out);
  }

  public ConvertViewportToElement(viewport: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    // 0,0 at center of canvas, x right and y up
    const element_x: number = viewport.x + (0.5 * this.m_width);
    const element_y: number = (0.5 * this.m_height) - viewport.y;
    return out.Set(element_x, element_y);
  }

  public ConvertElementToViewport(element: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    // 0,0 at center of canvas, x right and y up
    const viewport_x: number = element.x - (0.5 * this.m_width);
    const viewport_y: number = (0.5 * this.m_height) - element.y;
    return out.Set(viewport_x, viewport_y);
  }

  public ConvertProjectionToViewport(projection: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    const viewport: b2.Vec2 = out.Copy(projection);
    b2.Vec2.MulSV(1 / this.m_zoom, viewport, viewport);
    ///b2.Vec2.MulSV(this.m_extent, viewport, viewport);
    b2.Vec2.MulSV(0.5 * this.m_height / this.m_extent, projection, projection);
    return viewport;
  }

  public ConvertViewportToProjection(viewport: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    const projection: b2.Vec2 = out.Copy(viewport);
    ///b2.Vec2.MulSV(1 / this.m_extent, projection, projection);
    b2.Vec2.MulSV(2 * this.m_extent / this.m_height, projection, projection);
    b2.Vec2.MulSV(this.m_zoom, projection, projection);
    return projection;
  }

  public ConvertWorldToProjection(world: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    const projection: b2.Vec2 = out.Copy(world);
    b2.Vec2.SubVV(projection, this.m_center, projection);
    ///b2.Rot.MulTRV(this.m_roll, projection, projection);
    return projection;
  }

  public ConvertProjectionToWorld(projection: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    const world: b2.Vec2 = out.Copy(projection);
    ///b2.Rot.MulRV(this.m_roll, world, world);
    b2.Vec2.AddVV(this.m_center, world, world);
    return world;
  }

  public ConvertElementToWorld(element: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    const viewport: b2.Vec2 = this.ConvertElementToViewport(element, out);
    const projection: b2.Vec2 = this.ConvertViewportToProjection(viewport, out);
    return this.ConvertProjectionToWorld(projection, out);
  }

  public ConvertWorldToElement(world: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    const projection: b2.Vec2 = this.ConvertWorldToProjection(world, out);
    const viewport: b2.Vec2 = this.ConvertProjectionToViewport(projection, out);
    return this.ConvertViewportToElement(viewport, out);
  }

  public ConvertElementToProjection(element: b2.Vec2, out: b2.Vec2): b2.Vec2 {
    const viewport: b2.Vec2 = this.ConvertElementToViewport(element, out);
    return this.ConvertViewportToProjection(viewport, out);
  }
}

// This class implements debug drawing callbacks that are invoked
// inside b2World::Step.
export class DebugDraw extends b2.Draw {
  public m_ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    super();
  }

  public PushTransform(xf: b2.Transform): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.save();
      ctx.translate(xf.p.x, xf.p.y);
      ctx.rotate(xf.q.GetAngle());
    }
  }

  public PopTransform(xf: b2.Transform): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.restore();
    }
  }

  public DrawPolygon(vertices: b2.Vec2[], vertexCount: number, color: b2.Color): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i: number = 1; i < vertexCount; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = color.MakeStyleString(1);
      ctx.stroke();
    }
  }

  public DrawSolidPolygon(vertices: b2.Vec2[], vertexCount: number, color: b2.Color): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i: number = 1; i < vertexCount; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = color.MakeStyleString(0.5);
      ctx.fill();
      ctx.strokeStyle = color.MakeStyleString(1);
      ctx.stroke();
    }
  }

  public DrawCircle(center: b2.Vec2, radius: number, color: b2.Color): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, b2.pi * 2, true);
      ctx.strokeStyle = color.MakeStyleString(1);
      ctx.stroke();
    }
  }

  public DrawSolidCircle(center: b2.Vec2, radius: number, axis: b2.Vec2, color: b2.Color): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      const cx: number = center.x;
      const cy: number = center.y;
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
  public DrawParticles(centers: b2.Vec2[], radius: number, colors: b2.Color[] | null, count: number) {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      if (colors !== null) {
        for (let i = 0; i < count; ++i) {
          const center = centers[i];
          const color = colors[i];
          ctx.fillStyle = color.MakeStyleString();
          // ctx.fillRect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
          ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, b2.pi * 2, true); ctx.fill();
        }
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        // ctx.beginPath();
        for (let i = 0; i < count; ++i) {
          const center = centers[i];
          // ctx.rect(center.x - radius, center.y - radius, 2 * radius, 2 * radius);
          ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, b2.pi * 2, true); ctx.fill();
        }
        // ctx.fill();
      }
    }
  }
  // #endif

  public DrawSegment(p1: b2.Vec2, p2: b2.Vec2, color: b2.Color): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = color.MakeStyleString(1);
      ctx.stroke();
    }
  }

  public DrawTransform(xf: b2.Transform): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
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

  public DrawPoint(p: b2.Vec2, size: number, color: b2.Color): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.fillStyle = color.MakeStyleString();
      size *= g_camera.m_zoom;
      size /= g_camera.m_extent;
      const hsize: number = size / 2;
      ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
    }
  }

  private static DrawString_s_color: b2.Color = new b2.Color(0.9, 0.6, 0.6);
  public DrawString(x: number, y: number, message: string): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = "15px DroidSans";
      const color: b2.Color = DebugDraw.DrawString_s_color;
      ctx.fillStyle = color.MakeStyleString();
      ctx.fillText(message, x, y);
      ctx.restore();
    }
  }

  private static DrawStringWorld_s_p: b2.Vec2 = new b2.Vec2();
  private static DrawStringWorld_s_cc: b2.Vec2 = new b2.Vec2();
  private static DrawStringWorld_s_color: b2.Color = new b2.Color(0.5, 0.9, 0.5);
  public DrawStringWorld(x: number, y: number, message: string): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      const p: b2.Vec2 = DebugDraw.DrawStringWorld_s_p.Set(x, y);

      // world -> viewport
      const vt: b2.Vec2 = g_camera.m_center;
      b2.Vec2.SubVV(p, vt, p);
      ///const vr = g_camera.m_roll;
      ///b2.Rot.MulTRV(vr, p, p);
      const vs: number = g_camera.m_zoom;
      b2.Vec2.MulSV(1 / vs, p, p);

      // viewport -> canvas
      const cs: number = 0.5 * g_camera.m_height / g_camera.m_extent;
      b2.Vec2.MulSV(cs, p, p);
      p.y *= -1;
      const cc: b2.Vec2 = DebugDraw.DrawStringWorld_s_cc.Set(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
      b2.Vec2.AddVV(p, cc, p);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = "15px DroidSans";
      const color: b2.Color = DebugDraw.DrawStringWorld_s_color;
      ctx.fillStyle = color.MakeStyleString();
      ctx.fillText(message, p.x, p.y);
      ctx.restore();
    }
  }

  public DrawAABB(aabb: b2.AABB, color: b2.Color): void {
    const ctx: CanvasRenderingContext2D | null = this.m_ctx;
    if (ctx) {
      ctx.strokeStyle = color.MakeStyleString();
      const x: number = aabb.lowerBound.x;
      const y: number = aabb.lowerBound.y;
      const w: number = aabb.upperBound.x - aabb.lowerBound.x;
      const h: number = aabb.upperBound.y - aabb.lowerBound.y;
      ctx.strokeRect(x, y, w, h);
    }
  }
}

export const g_debugDraw: DebugDraw = new DebugDraw();
export const g_camera: Camera = new Camera();
