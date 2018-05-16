import { b2Vec2, b2Transform, b2Sweep } from "../Common/b2Math";
import { b2Shape, b2MassData } from "../Collision/Shapes/b2Shape";
import { b2ContactEdge } from "./Contacts/b2Contact";
import { b2JointEdge } from "./Joints/b2Joint";
import { b2Fixture, b2FixtureDef } from "./b2Fixture";
import { b2World } from "./b2World";
export declare const enum b2BodyType {
    b2_unknown = -1,
    b2_staticBody = 0,
    b2_kinematicBody = 1,
    b2_dynamicBody = 2,
}
export declare class b2BodyDef {
    type: b2BodyType;
    position: b2Vec2;
    angle: number;
    linearVelocity: b2Vec2;
    angularVelocity: number;
    linearDamping: number;
    angularDamping: number;
    allowSleep: boolean;
    awake: boolean;
    fixedRotation: boolean;
    bullet: boolean;
    active: boolean;
    userData: any;
    gravityScale: number;
}
export declare class b2Body {
    m_type: b2BodyType;
    m_islandFlag: boolean;
    m_awakeFlag: boolean;
    m_autoSleepFlag: boolean;
    m_bulletFlag: boolean;
    m_fixedRotationFlag: boolean;
    m_activeFlag: boolean;
    m_toiFlag: boolean;
    m_islandIndex: number;
    m_xf: b2Transform;
    m_xf0: b2Transform;
    m_sweep: b2Sweep;
    m_linearVelocity: b2Vec2;
    m_angularVelocity: number;
    m_force: b2Vec2;
    m_torque: number;
    m_world: b2World;
    m_prev: b2Body;
    m_next: b2Body;
    m_fixtureList: b2Fixture;
    m_fixtureCount: number;
    m_jointList: b2JointEdge;
    m_contactList: b2ContactEdge;
    m_mass: number;
    m_invMass: number;
    m_I: number;
    m_invI: number;
    m_linearDamping: number;
    m_angularDamping: number;
    m_gravityScale: number;
    m_sleepTime: number;
    m_userData: any;
    constructor(bd: b2BodyDef, world: b2World);
    CreateFixture(a: b2FixtureDef | b2Shape, b?: number): b2Fixture;
    CreateFixtureDef(def: b2FixtureDef): b2Fixture;
    private static CreateFixtureShapeDensity_s_def;
    CreateFixtureShapeDensity(shape: b2Shape, density?: number): b2Fixture;
    DestroyFixture(fixture: b2Fixture): void;
    SetTransformVec(position: b2Vec2, angle: number): void;
    SetTransformXY(x: number, y: number, angle: number): void;
    SetTransform(xf: b2Transform): void;
    GetTransform(): b2Transform;
    GetPosition(): b2Vec2;
    SetPosition(position: b2Vec2): void;
    SetPositionXY(x: number, y: number): void;
    GetAngle(): number;
    SetAngle(angle: number): void;
    GetWorldCenter(): b2Vec2;
    GetLocalCenter(): b2Vec2;
    SetLinearVelocity(v: b2Vec2): void;
    GetLinearVelocity(): b2Vec2;
    SetAngularVelocity(w: number): void;
    GetAngularVelocity(): number;
    GetDefinition(bd: b2BodyDef): b2BodyDef;
    ApplyForce(force: b2Vec2, point: b2Vec2, wake?: boolean): void;
    ApplyForceToCenter(force: b2Vec2, wake?: boolean): void;
    ApplyTorque(torque: number, wake?: boolean): void;
    ApplyLinearImpulse(impulse: b2Vec2, point: b2Vec2, wake?: boolean): void;
    ApplyLinearImpulseToCenter(impulse: b2Vec2, wake?: boolean): void;
    ApplyAngularImpulse(impulse: number, wake?: boolean): void;
    GetMass(): number;
    GetInertia(): number;
    GetMassData(data: b2MassData): b2MassData;
    private static SetMassData_s_oldCenter;
    SetMassData(massData: b2MassData): void;
    private static ResetMassData_s_localCenter;
    private static ResetMassData_s_oldCenter;
    private static ResetMassData_s_massData;
    ResetMassData(): void;
    GetWorldPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
    GetWorldVector(localVector: b2Vec2, out: b2Vec2): b2Vec2;
    GetLocalPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
    GetLocalVector(worldVector: b2Vec2, out: b2Vec2): b2Vec2;
    GetLinearVelocityFromWorldPoint(worldPoint: b2Vec2, out: b2Vec2): b2Vec2;
    GetLinearVelocityFromLocalPoint(localPoint: b2Vec2, out: b2Vec2): b2Vec2;
    GetLinearDamping(): number;
    SetLinearDamping(linearDamping: number): void;
    GetAngularDamping(): number;
    SetAngularDamping(angularDamping: number): void;
    GetGravityScale(): number;
    SetGravityScale(scale: number): void;
    SetType(type: b2BodyType): void;
    GetType(): b2BodyType;
    SetBullet(flag: boolean): void;
    IsBullet(): boolean;
    SetSleepingAllowed(flag: boolean): void;
    IsSleepingAllowed(): boolean;
    SetAwake(flag: boolean): void;
    IsAwake(): boolean;
    SetActive(flag: boolean): void;
    IsActive(): boolean;
    SetFixedRotation(flag: boolean): void;
    IsFixedRotation(): boolean;
    GetFixtureList(): b2Fixture;
    GetJointList(): b2JointEdge;
    GetContactList(): b2ContactEdge;
    GetNext(): b2Body;
    GetUserData(): any;
    SetUserData(data: any): void;
    GetWorld(): b2World;
    Dump(log: (format: string, ...args: any[]) => void): void;
    private static SynchronizeFixtures_s_xf1;
    SynchronizeFixtures(): void;
    SynchronizeTransform(): void;
    ShouldCollide(other: b2Body): boolean;
    ShouldCollideConnected(other: b2Body): boolean;
    Advance(alpha: number): void;
}
