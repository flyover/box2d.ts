import { b2Contact } from "./b2Contact";
import { b2Fixture } from "../b2Fixture";
export declare class b2ContactRegister {
    pool: b2Contact[];
    createFcn: {
        (allocator: any): b2Contact;
    };
    destroyFcn: {
        (contact: b2Contact, allocator: any): void;
    };
    primary: boolean;
}
export declare class b2ContactFactory {
    m_allocator: any;
    m_registers: b2ContactRegister[][];
    constructor(allocator: any);
    private AddType(createFcn, destroyFcn, type1, type2);
    private InitializeRegisters();
    Create(fixtureA: b2Fixture, indexA: number, fixtureB: b2Fixture, indexB: number): b2Contact;
    Destroy(contact: b2Contact): void;
}
