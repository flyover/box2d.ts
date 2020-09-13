import * as b2 from "@box2d";
export declare class Camera {
    readonly m_center: b2.Vec2;
    m_extent: number;
    m_zoom: number;
    m_width: number;
    m_height: number;
    ConvertScreenToWorld(screenPoint: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertWorldToScreen(worldPoint: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertViewportToElement(viewport: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertElementToViewport(element: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertProjectionToViewport(projection: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertViewportToProjection(viewport: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertWorldToProjection(world: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertProjectionToWorld(projection: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertElementToWorld(element: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertWorldToElement(world: b2.Vec2, out: b2.Vec2): b2.Vec2;
    ConvertElementToProjection(element: b2.Vec2, out: b2.Vec2): b2.Vec2;
}
export declare class DebugDraw extends b2.Draw {
    m_ctx: CanvasRenderingContext2D | null;
    constructor();
    PushTransform(xf: b2.Transform): void;
    PopTransform(xf: b2.Transform): void;
    DrawPolygon(vertices: b2.Vec2[], vertexCount: number, color: b2.Color): void;
    DrawSolidPolygon(vertices: b2.Vec2[], vertexCount: number, color: b2.Color): void;
    DrawCircle(center: b2.Vec2, radius: number, color: b2.Color): void;
    DrawSolidCircle(center: b2.Vec2, radius: number, axis: b2.Vec2, color: b2.Color): void;
    DrawParticles(centers: b2.Vec2[], radius: number, colors: b2.Color[] | null, count: number): void;
    DrawSegment(p1: b2.Vec2, p2: b2.Vec2, color: b2.Color): void;
    DrawTransform(xf: b2.Transform): void;
    DrawPoint(p: b2.Vec2, size: number, color: b2.Color): void;
    private static DrawString_s_color;
    DrawString(x: number, y: number, message: string): void;
    private static DrawStringWorld_s_p;
    private static DrawStringWorld_s_cc;
    private static DrawStringWorld_s_color;
    DrawStringWorld(x: number, y: number, message: string): void;
    DrawAABB(aabb: b2.AABB, color: b2.Color): void;
}
export declare const g_debugDraw: DebugDraw;
export declare const g_camera: Camera;
//# sourceMappingURL=draw.d.ts.map