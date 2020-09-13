import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class VerticalStack extends testbed.Test {
    static readonly e_columnCount = 1;
    static readonly e_rowCount = 15;
    m_bullet: box2d.b2Body | null;
    m_bodies: box2d.b2Body[];
    m_indices: number[];
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=vertical_stack.d.ts.map