import * as testbed from "../testbed.js";
export declare class Confined extends testbed.Test {
    static readonly e_columnCount = 0;
    static readonly e_rowCount = 0;
    constructor();
    CreateCircle(): void;
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
