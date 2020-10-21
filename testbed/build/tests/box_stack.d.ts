import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class BoxStack extends testbed.Test {
    static readonly e_columnCount = 1;
    static readonly e_rowCount = 15;
    m_bullet: b2.Body | null;
    m_bodies: b2.Body[];
    m_indices: number[];
    constructor();
    Keyboard(key: string): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
