import { b2BroadPhase } from "../Collision/b2BroadPhase";
import { b2Contact } from "./Contacts/b2Contact";
import { b2ContactFactory } from "./Contacts/b2ContactFactory";
import { b2ContactFilter, b2ContactListener } from "./b2WorldCallbacks";
export declare class b2ContactManager {
    m_broadPhase: b2BroadPhase;
    m_contactList: b2Contact;
    m_contactCount: number;
    m_contactFilter: b2ContactFilter;
    m_contactListener: b2ContactListener;
    m_allocator: any;
    m_contactFactory: b2ContactFactory;
    constructor();
    AddPair(proxyUserDataA: any, proxyUserDataB: any): void;
    FindNewContacts(): void;
    Destroy(c: b2Contact): void;
    Collide(): void;
}
