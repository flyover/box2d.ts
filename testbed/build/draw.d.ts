import * as box2d from "@box2d";
export declare class Camera {
    readonly m_center: box2d.b2Vec2;
    m_extent: number;
    m_zoom: number;
    m_width: number;
    m_height: number;
    ConvertScreenToWorld(screenPoint: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertWorldToScreen(worldPoint: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertViewportToElement(viewport: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertElementToViewport(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertProjectionToViewport(projection: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertViewportToProjection(viewport: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertWorldToProjection(world: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertProjectionToWorld(projection: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertElementToWorld(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertWorldToElement(world: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
    ConvertElementToProjection(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2;
}
export declare class DebugDraw extends box2d.b2Draw {
    m_ctx: CanvasRenderingContext2D | null;
    constructor();
    PushTransform(xf: box2d.b2Transform): void;
    PopTransform(xf: box2d.b2Transform): void;
    DrawPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void;
    DrawSolidPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void;
    DrawCircle(center: box2d.b2Vec2, radius: number, color: box2d.b2Color): void;
    DrawSolidCircle(center: box2d.b2Vec2, radius: number, axis: box2d.b2Vec2, color: box2d.b2Color): void;
    DrawParticles(centers: box2d.b2Vec2[], radius: number, colors: box2d.b2Color[] | null, count: number): void;
    DrawSegment(p1: box2d.b2Vec2, p2: box2d.b2Vec2, color: box2d.b2Color): void;
    DrawTransform(xf: box2d.b2Transform): void;
    DrawPoint(p: box2d.b2Vec2, size: number, color: box2d.b2Color): void;
    private static DrawString_s_color;
    DrawString(x: number, y: number, message: string): void;
    private static DrawStringWorld_s_p;
    private static DrawStringWorld_s_cc;
    private static DrawStringWorld_s_color;
    DrawStringWorld(x: number, y: number, message: string): void;
    DrawAABB(aabb: box2d.b2AABB, color: box2d.b2Color): void;
}
export declare const g_debugDraw: DebugDraw;
export declare const g_camera: Camera;
//# sourceMappingURL=draw.d.ts.map