import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class CharacterCollision extends testbed.Test {
    m_character: box2d.b2Body;
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=character_collision.d.ts.map