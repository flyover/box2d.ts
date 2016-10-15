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

import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";

// This class implements debug drawing callbacks that are invoked
// inside b2World::Step.
export class DebugDraw extends box2d.b2Draw {
  public m_canvas: HTMLCanvasElement = null;
  public m_ctx: CanvasRenderingContext2D = null;
  public m_settings: testbed.Settings = null;

  constructor(canvas: HTMLCanvasElement, settings: testbed.Settings) {
    super(); // base class constructor

    this.m_canvas = canvas;
    this.m_ctx = <CanvasRenderingContext2D> this.m_canvas.getContext("2d");
    this.m_settings = settings;
  }

  public PushTransform(xf: box2d.b2Transform): void {
    const ctx = this.m_ctx;
    ctx.save();
    ctx.translate(xf.p.x, xf.p.y);
    ctx.rotate(xf.q.GetAngleRadians());
  }

  public PopTransform(xf: box2d.b2Transform): void {
    const ctx = this.m_ctx;
    ctx.restore();
  }

  public DrawPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void {
    if (!vertexCount) return;

    const ctx = this.m_ctx;

    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i: number = 1; i < vertexCount; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.stroke();
  }

  public DrawSolidPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void {
    if (!vertexCount) return;

    const ctx = this.m_ctx;

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

  public DrawCircle(center: box2d.b2Vec2, radius: number, color: box2d.b2Color): void {
    if (!radius) return;

    const ctx = this.m_ctx;

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, box2d.b2_pi * 2, true);
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.stroke();
  }

  public DrawSolidCircle(center: box2d.b2Vec2, radius: number, axis: box2d.b2Vec2, color: box2d.b2Color): void {
    if (!radius) return;

    const ctx = this.m_ctx;

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

  public DrawSegment(p1: box2d.b2Vec2, p2: box2d.b2Vec2, color: box2d.b2Color): void {
    const ctx = this.m_ctx;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color.MakeStyleString(1);
    ctx.stroke();
  }

  public DrawTransform(xf: box2d.b2Transform): void {
    const ctx = this.m_ctx;

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

  public DrawPoint(p: box2d.b2Vec2, size: number, color: box2d.b2Color): void {
    const ctx = this.m_ctx;

    ctx.fillStyle = color.MakeStyleString();
    size /= this.m_settings.viewZoom;
    size /= this.m_settings.canvasScale;
    const hsize = size / 2;
    ctx.fillRect(p.x - hsize, p.y - hsize, size, size);
  }

  private static DrawString_s_color: box2d.b2Color = new box2d.b2Color(0.9, 0.6, 0.6);
  public DrawString(x: number, y: number, message: string): void {
    const ctx = this.m_ctx;

    ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = "18pt helvetica"; // "9pt lucida console";
      const color = DebugDraw.DrawString_s_color;
      ctx.fillStyle = color.MakeStyleString();
      ctx.fillText(message, x, y);
    ctx.restore();
  }

  private static DrawStringWorld_s_p: box2d.b2Vec2 = new box2d.b2Vec2();
  private static DrawStringWorld_s_cc: box2d.b2Vec2 = new box2d.b2Vec2();
  private static DrawStringWorld_s_color: box2d.b2Color = new box2d.b2Color(0.5, 0.9, 0.5);
  public DrawStringWorld(x: number, y: number, message: string): void {
    const p = DebugDraw.DrawStringWorld_s_p.SetXY(x, y);

    // world -> viewport
    const vt = this.m_settings.viewCenter;
    box2d.b2SubVV(p, vt, p);
    const vr = this.m_settings.viewRotation;
    box2d.b2MulTRV(vr, p, p);
    const vs = this.m_settings.viewZoom;
    box2d.b2MulSV(vs, p, p);

    // viewport -> canvas
    const cs = this.m_settings.canvasScale;
    box2d.b2MulSV(cs, p, p);
    p.y *= -1;
    const cc = DebugDraw.DrawStringWorld_s_cc.SetXY(0.5 * this.m_canvas.width, 0.5 * this.m_canvas.height);
    box2d.b2AddVV(p, cc, p);

    const ctx = this.m_ctx;

    ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.font = "18pt helvetica"; // "9pt lucida console";
      const color = DebugDraw.DrawStringWorld_s_color;
      ctx.fillStyle = color.MakeStyleString();
      ctx.fillText(message, p.x, p.y);
    ctx.restore();
  }

  public DrawAABB(aabb: box2d.b2AABB, color: box2d.b2Color): void {
    const ctx = this.m_ctx;

    ctx.strokeStyle = color.MakeStyleString();
    const x = aabb.lowerBound.x;
    const y = aabb.lowerBound.y;
    const w = aabb.upperBound.x - aabb.lowerBound.x;
    const h = aabb.upperBound.y - aabb.lowerBound.y;
    ctx.strokeRect(x, y, w, h);
  }
}
