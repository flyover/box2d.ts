import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Sparky extends testbed.Test {
    private static c_maxCircles;
    private static c_maxVFX;
    private static SHAPE_HEIGHT_OFFSET;
    private static SHAPE_OFFSET;
    private m_VFXIndex;
    private m_VFX;
    private m_contact;
    private m_contactPoint;
    constructor();
    BeginContact(contact: b2.Contact): void;
    Step(settings: testbed.Settings): void;
    AddVFX(p: b2.Vec2, particleFlags: b2.ParticleFlag): void;
    CreateWalls(): void;
    static Create(): testbed.Test;
}
