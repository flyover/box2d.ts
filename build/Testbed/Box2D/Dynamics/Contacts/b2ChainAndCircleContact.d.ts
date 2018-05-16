import { b2Transform } from "../../Common/b2Math";
import { b2Manifold } from "../../Collision/b2Collision";
import { b2Contact } from "./b2Contact";
import { b2Fixture } from "../b2Fixture";
export declare class b2ChainAndCircleContact extends b2Contact {
    constructor();
    static Create(allocator: any): b2Contact;
    static Destroy(contact: b2Contact, allocator: any): void;
    Reset(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): void;
    private static Evaluate_s_edge;
    Evaluate(manifold: b2Manifold, xfA: b2Transform, xfB: b2Transform): void;
}
