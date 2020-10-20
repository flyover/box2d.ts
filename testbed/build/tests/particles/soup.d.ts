import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class Soup extends testbed.Test {
    m_ground: b2.Body;
    constructor();
    GetDefaultViewZoom(): number;
    static Create(): Soup;
}
export declare const testIndex: number;
