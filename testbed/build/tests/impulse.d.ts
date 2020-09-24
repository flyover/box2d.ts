import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class Impulse extends testbed.Test {
    static readonly kBoxLeft = -2;
    static readonly kBoxRight = 2;
    static readonly kBoxBottom = 0;
    static readonly kBoxTop = 4;
    m_useLinearImpulse: boolean;
    constructor();
    MouseUp(p: b2.Vec2): void;
    Keyboard(key: string): void;
    ApplyImpulseOrForce(direction: b2.Vec2): void;
    GetDefaultViewZoom(): number;
    static Create(): Impulse;
}
