import * as box2d from "../../Box2D/Box2D";
import * as testbed from "../Testbed";
export declare class SphereStack extends testbed.Test {
    static e_count: number;
    m_bodies: box2d.b2Body[];
    constructor();
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
