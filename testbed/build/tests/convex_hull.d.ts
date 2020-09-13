import * as b2 from "@box2d";
import * as testbed from "../testbed.js";
export declare class ConvexHull extends testbed.Test {
    static readonly e_count = 10;
    m_test_points: b2.Vec2[];
    m_count: number;
    m_auto: boolean;
    constructor();
    Generate(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=convex_hull.d.ts.map