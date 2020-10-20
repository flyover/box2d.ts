import * as testbed from "@testbed";
export declare class CollisionFiltering extends testbed.Test {
    static readonly k_smallGroup = 1;
    static readonly k_largeGroup = -1;
    static readonly k_triangleCategory = 2;
    static readonly k_boxCategory = 4;
    static readonly k_circleCategory = 8;
    static readonly k_triangleMask = 65535;
    static readonly k_boxMask: number;
    static readonly k_circleMask = 65535;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
