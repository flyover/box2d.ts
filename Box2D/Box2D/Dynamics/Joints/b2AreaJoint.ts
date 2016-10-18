import { b2_epsilon, b2_linearSlop, b2_maxLinearCorrection, b2MakeNumberArray } from "../../Common/b2Settings";
import { b2Sq, b2Sqrt, b2Vec2, b2Transform } from "../../Common/b2Math";
import { b2Joint, b2JointDef } from "./b2Joint";
import { b2JointType } from "./b2Joint";
import { b2DistanceJoint, b2DistanceJointDef } from "./b2DistanceJoint";
import { b2Body, b2BodyDef } from "../b2Body";
import { b2World } from "../b2World";

export class b2AreaJointDef extends b2JointDef {
  public world: b2World = null;

  public bodies: b2Body[] = new Array();

  public frequencyHz: number = 0;

  public dampingRatio: number = 0;

  constructor() {
    super(b2JointType.e_areaJoint); // base class constructor
  }

  public AddBody(body) {
    this.bodies.push(body);

    if (this.bodies.length === 1) {
      this.bodyA = body;
    } else if (this.bodies.length === 2) {
      this.bodyB = body;
    }
  }
}

export class b2AreaJoint extends b2Joint {
  public m_bodies: b2Body[] = null;
  public m_frequencyHz: number = 0;
  public m_dampingRatio: number = 0;

  // Solver shared
  public m_impulse: number = 0;

  // Solver temp
  public m_targetLengths = null;
  public m_targetArea: number = 0;
  public m_normals = null;
  public m_joints = null;
  public m_deltas = null;
  public m_delta = null;

  constructor(def) {
    super(def); // base class constructor

    ///b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies.");

    this.m_bodies = def.bodies;
    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;

    this.m_targetLengths = b2MakeNumberArray(def.bodies.length);
    this.m_normals = b2Vec2.MakeArray(def.bodies.length);
    this.m_joints = new Array(def.bodies.length);
    this.m_deltas = b2Vec2.MakeArray(def.bodies.length);
    this.m_delta = new b2Vec2();

    const djd: b2DistanceJointDef = new b2DistanceJointDef();
    djd.frequencyHz = def.frequencyHz;
    djd.dampingRatio = def.dampingRatio;

    this.m_targetArea = 0;

    for (let i: number = 0, ict = this.m_bodies.length; i < ict; ++i) {
      const body = this.m_bodies[i];
      const next = this.m_bodies[(i + 1) % ict];

      const body_c = body.GetWorldCenter();
      const next_c = next.GetWorldCenter();

      this.m_targetLengths[i] = b2Vec2.DistanceVV(body_c, next_c);

      this.m_targetArea += b2Vec2.CrossVV(body_c, next_c);

      djd.Initialize(body, next, body_c, next_c);
      this.m_joints[i] = def.world.CreateJoint(djd);
    }

    this.m_targetArea *= 0.5;
  }

  public GetAnchorA(out: b2Vec2): b2Vec2 {
    return out.SetZero();
  }

  public GetAnchorB(out: b2Vec2): b2Vec2 {
    return out.SetZero();
  }

  public GetReactionForce(inv_dt: number, out: b2Vec2): b2Vec2 {
    return out.SetZero();
  }

  public GetReactionTorque(inv_dt: number): number {
    return 0;
  }

  public SetFrequency(hz) {
    this.m_frequencyHz = hz;

    for (let i: number = 0, ict = this.m_joints.length; i < ict; ++i) {
      this.m_joints[i].SetFrequency(hz);
    }
  }

  public GetFrequency() {
    return this.m_frequencyHz;
  }

  public SetDampingRatio(ratio) {
    this.m_dampingRatio = ratio;

    for (let i: number = 0, ict = this.m_joints.length; i < ict; ++i) {
      this.m_joints[i].SetDampingRatio(ratio);
    }
  }

  public GetDampingRatio() {
    return this.m_dampingRatio;
  }

  public Dump(log: (format: string, ...args: any[]) => void) {
    log("Area joint dumping is not supported.\n");
  }

  public InitVelocityConstraints(data) {
    for (let i: number = 0, ict = this.m_bodies.length; i < ict; ++i) {
      const prev = this.m_bodies[(i + ict - 1) % ict];
      const next = this.m_bodies[(i + 1) % ict];
      const prev_c = data.positions[prev.m_islandIndex].c;
      const next_c = data.positions[next.m_islandIndex].c;
      const delta = this.m_deltas[i];

      b2Vec2.SubVV(next_c, prev_c, delta);
    }

    if (data.step.warmStarting) {
      this.m_impulse *= data.step.dtRatio;

      for (let i: number = 0, ict = this.m_bodies.length; i < ict; ++i) {
        const body = this.m_bodies[i];
        const body_v = data.velocities[body.m_islandIndex].v;
        const delta = this.m_deltas[i];

        body_v.x += body.m_invMass *  delta.y * 0.5 * this.m_impulse;
        body_v.y += body.m_invMass * -delta.x * 0.5 * this.m_impulse;
      }
    } else {
      this.m_impulse = 0;
    }
  }

  public SolveVelocityConstraints(data) {
    let dotMassSum: number = 0;
    let crossMassSum: number = 0;

    for (let i: number = 0, ict = this.m_bodies.length; i < ict; ++i) {
      const body = this.m_bodies[i];
      const body_v = data.velocities[body.m_islandIndex].v;
      const delta = this.m_deltas[i];

      dotMassSum += delta.GetLengthSquared() / body.GetMass();
      crossMassSum += b2Vec2.CrossVV(body_v, delta);
    }

    const lambda = -2 * crossMassSum / dotMassSum;
    // lambda = b2Clamp(lambda, -b2_maxLinearCorrection, b2_maxLinearCorrection);

    this.m_impulse += lambda;

    for (let i: number = 0, ict = this.m_bodies.length; i < ict; ++i) {
      const body = this.m_bodies[i];
      const body_v = data.velocities[body.m_islandIndex].v;
      const delta = this.m_deltas[i];

      body_v.x += body.m_invMass *  delta.y * 0.5 * lambda;
      body_v.y += body.m_invMass * -delta.x * 0.5 * lambda;
    }
  }

  public SolvePositionConstraints(data) {
    let perimeter: number = 0;
    let area: number = 0;

    for (let i: number = 0, ict = this.m_bodies.length; i < ict; ++i) {
      const body = this.m_bodies[i];
      const next = this.m_bodies[(i + 1) % ict];
      const body_c = data.positions[body.m_islandIndex].c;
      const next_c = data.positions[next.m_islandIndex].c;

      const delta: b2Vec2 = b2Vec2.SubVV(next_c, body_c, this.m_delta);

      let dist = delta.GetLength();
      if (dist < b2_epsilon) {
        dist = 1;
      }

      this.m_normals[i].x =  delta.y / dist;
      this.m_normals[i].y = -delta.x / dist;

      perimeter += dist;

      area += b2Vec2.CrossVV(body_c, next_c);
    }

    area *= 0.5;

    const deltaArea = this.m_targetArea - area;
    const toExtrude: number = 0.5 * deltaArea / perimeter;
    let done = true;

    for (let i: number = 0, ict = this.m_bodies.length; i < ict; ++i) {
      const body = this.m_bodies[i];
      const body_c = data.positions[body.m_islandIndex].c;
      const next_i = (i + 1) % ict;

      const delta: b2Vec2 = b2Vec2.AddVV(this.m_normals[i], this.m_normals[next_i], this.m_delta);
      delta.SelfMul(toExtrude);

      const norm_sq = delta.GetLengthSquared();
      if (norm_sq > b2Sq(b2_maxLinearCorrection)) {
        delta.SelfMul(b2_maxLinearCorrection / b2Sqrt(norm_sq));
      }
      if (norm_sq > b2Sq(b2_linearSlop)) {
        done = false;
      }

      body_c.x += delta.x;
      body_c.y += delta.y;
    }

    return done;
  }
}
