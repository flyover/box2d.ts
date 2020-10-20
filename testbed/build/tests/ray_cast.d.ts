import * as testbed from "@testbed";
export declare class RayCast extends testbed.Test {
    private static e_maxBodies;
    private m_bodyIndex;
    private m_bodies;
    private m_polygons;
    private m_circle;
    private m_edge;
    private m_angle;
    private m_mode;
    constructor();
    CreateBody(index: number): void;
    DestroyBody(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
