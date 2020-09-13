import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Impulse extends testbed.Test {
    static readonly kBoxLeft = -2;
    static readonly kBoxRight = 2;
    static readonly kBoxBottom = 0;
    static readonly kBoxTop = 4;
    m_useLinearImpulse: boolean;
    constructor();
    MouseUp(p: box2d.b2Vec2): void;
    Keyboard(key: string): void;
    ApplyImpulseOrForce(direction: box2d.b2Vec2): void;
    GetDefaultViewZoom(): number;
    static Create(): Impulse;
}
//# sourceMappingURL=impulse.d.ts.map