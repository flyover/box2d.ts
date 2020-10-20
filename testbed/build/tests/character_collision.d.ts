import * as b2 from "@box2d";
import * as testbed from "@testbed";
export declare class CharacterCollision extends testbed.Test {
    m_character: b2.Body;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
export declare const testIndex: number;
