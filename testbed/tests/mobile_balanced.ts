// MIT License

// Copyright (c) 2019 Erin Catto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as b2 from "@box2d";
import * as testbed from "@testbed";

export class MobileBalanced extends testbed.Test {
  public static readonly e_depth = 4;

  constructor() {
    super();

    // Create ground body.
    const bodyDef = new b2.BodyDef();
    bodyDef.position.Set(0.0, 20.0);
    const ground = this.m_world.CreateBody(bodyDef);

    const a = 0.5;
    const h = new b2.Vec2(0.0, a);

    const root = this.AddNode(ground, b2.Vec2_zero, 0, 3.0, a);

    const jointDef = new b2.RevoluteJointDef();
    jointDef.bodyA = ground;
    jointDef.bodyB = root;
    jointDef.localAnchorA.SetZero();
    jointDef.localAnchorB.Copy(h);
    this.m_world.CreateJoint(jointDef);
  }

  public AddNode(parent: b2.Body, localAnchor: b2.Vec2, depth: number, offset: number, a: number): b2.Body {
    const density = 20.0;
    const h = new b2.Vec2(0.0, a);

    //  b2Vec2 p = parent->GetPosition() + localAnchor - h;
    const p = parent.GetPosition().Clone().SelfAdd(localAnchor).SelfSub(h);

    const bodyDef = new b2.BodyDef();
    bodyDef.type = b2.BodyType.b2_dynamicBody;
    bodyDef.position.Copy(p);
    const body = this.m_world.CreateBody(bodyDef);

    const shape = new b2.PolygonShape();
    shape.SetAsBox(0.25 * a, a);
    body.CreateFixture(shape, density);

    if (depth === MobileBalanced.e_depth) {
      return body;
    }

    shape.SetAsBox(offset, 0.25 * a, new b2.Vec2(0, -a), 0.0);
    body.CreateFixture(shape, density);

    const a1 = new b2.Vec2(offset, -a);
    const a2 = new b2.Vec2(-offset, -a);
    const body1 = this.AddNode(body, a1, depth + 1, 0.5 * offset, a);
    const body2 = this.AddNode(body, a2, depth + 1, 0.5 * offset, a);

    const jointDef = new b2.RevoluteJointDef();
    jointDef.bodyA = body;
    jointDef.localAnchorB.Copy(h);

    jointDef.localAnchorA.Copy(a1);
    jointDef.bodyB = body1;
    this.m_world.CreateJoint(jointDef);

    jointDef.localAnchorA.Copy(a2);
    jointDef.bodyB = body2;
    this.m_world.CreateJoint(jointDef);

    return body;
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);
  }

  public static Create(): testbed.Test {
    return new MobileBalanced();
  }
}

export const testIndex: number = testbed.RegisterTest("Solver", "Mobile Balanced", MobileBalanced.Create);
