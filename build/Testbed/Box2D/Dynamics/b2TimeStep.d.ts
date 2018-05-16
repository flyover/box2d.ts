import { b2Vec2 } from "../Common/b2Math";
export declare class b2Profile {
    step: number;
    collide: number;
    solve: number;
    solveInit: number;
    solveVelocity: number;
    solvePosition: number;
    broadphase: number;
    solveTOI: number;
    Reset(): this;
}
export declare class b2TimeStep {
    dt: number;
    inv_dt: number;
    dtRatio: number;
    velocityIterations: number;
    positionIterations: number;
    particleIterations: number;
    warmStarting: boolean;
    Copy(step: b2TimeStep): b2TimeStep;
}
export declare class b2Position {
    c: b2Vec2;
    a: number;
    static MakeArray(length: number): b2Position[];
}
export declare class b2Velocity {
    v: b2Vec2;
    w: number;
    static MakeArray(length: number): b2Velocity[];
}
export declare class b2SolverData {
    step: b2TimeStep;
    positions: b2Position[];
    velocities: b2Velocity[];
}
