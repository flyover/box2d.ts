import { b2Joint, b2JointDef } from "./b2Joint";
export declare class b2JointFactory {
    static Create(def: b2JointDef, allocator: any): b2Joint;
    static Destroy(joint: b2Joint, allocator: any): void;
}
