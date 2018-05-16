import { b2Vec2, b2Sweep } from "../Common/b2Math";
import { b2DistanceProxy, b2SimplexCache } from "./b2Distance";
export declare let b2_toiTime: number;
export declare let b2_toiMaxTime: number;
export declare let b2_toiCalls: number;
export declare let b2_toiIters: number;
export declare let b2_toiMaxIters: number;
export declare let b2_toiRootIters: number;
export declare let b2_toiMaxRootIters: number;
export declare class b2TOIInput {
    proxyA: b2DistanceProxy;
    proxyB: b2DistanceProxy;
    sweepA: b2Sweep;
    sweepB: b2Sweep;
    tMax: number;
}
export declare const enum b2TOIOutputState {
    e_unknown = 0,
    e_failed = 1,
    e_overlapped = 2,
    e_touching = 3,
    e_separated = 4,
}
export declare class b2TOIOutput {
    state: b2TOIOutputState;
    t: number;
}
export declare const enum b2SeparationFunctionType {
    e_unknown = -1,
    e_points = 0,
    e_faceA = 1,
    e_faceB = 2,
}
export declare class b2SeparationFunction {
    m_proxyA: b2DistanceProxy;
    m_proxyB: b2DistanceProxy;
    m_sweepA: b2Sweep;
    m_sweepB: b2Sweep;
    m_type: b2SeparationFunctionType;
    m_localPoint: b2Vec2;
    m_axis: b2Vec2;
    Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, sweepA: b2Sweep, proxyB: b2DistanceProxy, sweepB: b2Sweep, t1: number): number;
    FindMinSeparation(indexA: number[], indexB: number[], t: number): number;
    Evaluate(indexA: number, indexB: number, t: number): number;
}
export declare function b2TimeOfImpact(output: b2TOIOutput, input: b2TOIInput): void;
