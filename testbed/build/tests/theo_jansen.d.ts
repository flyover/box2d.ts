import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class TheoJansen extends testbed.Test {
    m_offset: box2d.b2Vec2;
    m_chassis: box2d.b2Body;
    m_wheel: box2d.b2Body;
    m_motorJoint: box2d.b2RevoluteJoint;
    m_motorOn: boolean;
    m_motorSpeed: number;
    constructor();
    CreateLeg(s: number, wheelAnchor: box2d.b2Vec2): void;
    Construct(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=theo_jansen.d.ts.map