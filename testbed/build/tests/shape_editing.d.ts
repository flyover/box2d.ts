import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class ShapeEditing extends testbed.Test {
    m_body: box2d.b2Body;
    m_fixture1: box2d.b2Fixture;
    m_fixture2: box2d.b2Fixture | null;
    m_sensor: boolean;
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=shape_editing.d.ts.map