import * as box2d from "@box2d";
import * as testbed from "../testbed.js";
export declare class Breakable extends testbed.Test {
    static readonly e_count = 7;
    readonly m_body1: box2d.b2Body;
    readonly m_velocity: box2d.b2Vec2;
    m_angularVelocity: number;
    readonly m_shape1: box2d.b2PolygonShape;
    readonly m_shape2: box2d.b2PolygonShape;
    m_piece1: box2d.b2Fixture | null;
    m_piece2: box2d.b2Fixture | null;
    m_broke: boolean;
    m_break: boolean;
    constructor();
    PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse): void;
    Break(): void;
    Step(settings: testbed.Settings): void;
    static Create(): testbed.Test;
}
//# sourceMappingURL=breakable.d.ts.map