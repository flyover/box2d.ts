import * as box2d from "@box2d";
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
    BeginContact(contact: box2d.b2Contact): void;
    Step(settings: testbed.Settings): void;
    AddVFX(p: box2d.b2Vec2, particleFlags: box2d.b2ParticleFlag): void;
    CreateWalls(): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=sparky.d.ts.map