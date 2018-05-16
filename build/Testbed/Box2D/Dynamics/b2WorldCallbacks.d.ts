import { b2Vec2 } from "../Common/b2Math";
import { b2Manifold } from "../Collision/b2Collision";
import { b2Contact } from "./Contacts/b2Contact";
import { b2Joint } from "./Joints/b2Joint";
import { b2Fixture } from "./b2Fixture";
import { b2ParticleGroup } from "../Particle/b2ParticleGroup";
import { b2ParticleSystem, b2ParticleContact, b2ParticleBodyContact } from "../Particle/b2ParticleSystem";
export declare class b2DestructionListener {
    SayGoodbyeJoint(joint: b2Joint): void;
    SayGoodbyeFixture(fixture: b2Fixture): void;
    SayGoodbyeParticleGroup(group: b2ParticleGroup): void;
    SayGoodbyeParticle(system: b2ParticleSystem, index: number): void;
}
export declare class b2ContactFilter {
    ShouldCollide(fixtureA: b2Fixture, fixtureB: b2Fixture): boolean;
    ShouldCollideFixtureParticle(fixture: b2Fixture, system: b2ParticleSystem, index: number): boolean;
    ShouldCollideParticleParticle(system: b2ParticleSystem, indexA: number, indexB: number): boolean;
    static b2_defaultFilter: b2ContactFilter;
}
export declare class b2ContactImpulse {
    normalImpulses: number[];
    tangentImpulses: number[];
    count: number;
}
export declare class b2ContactListener {
    BeginContact(contact: b2Contact): void;
    EndContact(contact: b2Contact): void;
    BeginContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void;
    EndContactFixtureParticle(system: b2ParticleSystem, contact: b2ParticleBodyContact): void;
    BeginContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void;
    EndContactParticleParticle(system: b2ParticleSystem, contact: b2ParticleContact): void;
    PreSolve(contact: b2Contact, oldManifold: b2Manifold): void;
    PostSolve(contact: b2Contact, impulse: b2ContactImpulse): void;
    static b2_defaultListener: b2ContactListener;
}
export declare class b2QueryCallback {
    ReportFixture(fixture: b2Fixture): boolean;
    ReportParticle(system: b2ParticleSystem, index: number): boolean;
    ShouldQueryParticleSystem(system: b2ParticleSystem): boolean;
}
export declare type b2QueryCallbackFunction = {
    (fixture: b2Fixture): boolean;
};
export declare class b2RayCastCallback {
    ReportFixture(fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
    ReportParticle(system: b2ParticleSystem, index: number, point: b2Vec2, normal: b2Vec2, fraction: number): number;
    ShouldQueryParticleSystem(system: b2ParticleSystem): boolean;
}
export declare type b2RayCastCallbackFunction = {
    (fixture: b2Fixture, point: b2Vec2, normal: b2Vec2, fraction: number): number;
};
