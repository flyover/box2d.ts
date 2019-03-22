/*
* Copyright (c) 2006-2012 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

import * as box2d from "Box2D";
import * as testbed from "Testbed";

export class DynamicTreeTest extends testbed.Test {
  public static readonly e_actorCount = 128;

  public m_worldExtent = 0.0;
  public m_proxyExtent = 0.0;

  public m_tree = new box2d.b2DynamicTree<DynamicTreeTest_Actor>();
  public m_queryAABB = new box2d.b2AABB();
  public m_rayCastInput = new box2d.b2RayCastInput();
  public m_rayCastOutput = new box2d.b2RayCastOutput();
  public m_rayActor: DynamicTreeTest_Actor | null = null;
  public m_actors: DynamicTreeTest_Actor[] = box2d.b2MakeArray(DynamicTreeTest.e_actorCount, () => new DynamicTreeTest_Actor());
  public m_stepCount = 0;
  public m_automated = false;

  constructor() {
    super();

    this.m_worldExtent = 15.0;
    this.m_proxyExtent = 0.5;

    //srand(888);

    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      const actor = this.m_actors[i];
      this.GetRandomAABB(actor.aabb);
      actor.proxyId = this.m_tree.CreateProxy(actor.aabb, actor);
    }

    this.m_stepCount = 0;

    const h = this.m_worldExtent;
    this.m_queryAABB.lowerBound.Set(-3.0, -4.0 + h);
    this.m_queryAABB.upperBound.Set(5.0, 6.0 + h);

    this.m_rayCastInput.p1.Set(-5.0, 5.0 + h);
    this.m_rayCastInput.p2.Set(7.0, -4.0 + h);
    //this.m_rayCastInput.p1.Set(0.0, 2.0 + h);
    //this.m_rayCastInput.p2.Set(0.0, -2.0 + h);
    this.m_rayCastInput.maxFraction = 1.0;

    this.m_automated = false;
  }

  public Step(settings: testbed.Settings): void {
    super.Step(settings);

    this.Reset();

    if (this.m_automated) {
      const actionCount = box2d.b2Max(1, DynamicTreeTest.e_actorCount >> 2);

      for (let i = 0; i < actionCount; ++i) {
        this.Action();
      }
    }

    this.Query();
    this.RayCast();

    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      const actor = this.m_actors[i];
      if (actor.proxyId === null) {
        continue;
      }

      const c = new box2d.b2Color(0.9, 0.9, 0.9);
      if (actor === this.m_rayActor && actor.overlap) {
        c.SetRGB(0.9, 0.6, 0.6);
      } else if (actor === this.m_rayActor) {
        c.SetRGB(0.6, 0.9, 0.6);
      } else if (actor.overlap) {
        c.SetRGB(0.6, 0.6, 0.9);
      }
      testbed.g_debugDraw.DrawAABB(actor.aabb, c);
    }

    const c = new box2d.b2Color(0.7, 0.7, 0.7);
    testbed.g_debugDraw.DrawAABB(this.m_queryAABB, c);

    testbed.g_debugDraw.DrawSegment(this.m_rayCastInput.p1, this.m_rayCastInput.p2, c);

    const c1 = new box2d.b2Color(0.2, 0.9, 0.2);
    const c2 = new box2d.b2Color(0.9, 0.2, 0.2);
    testbed.g_debugDraw.DrawPoint(this.m_rayCastInput.p1, 6.0, c1);
    testbed.g_debugDraw.DrawPoint(this.m_rayCastInput.p2, 6.0, c2);

    if (this.m_rayActor) {
      const cr = new box2d.b2Color(0.2, 0.2, 0.9);
      //box2d.b2Vec2 p = this.m_rayCastInput.p1 + this.m_rayActor.fraction * (this.m_rayCastInput.p2 - this.m_rayCastInput.p1);
      const p = box2d.b2Vec2.AddVV(this.m_rayCastInput.p1, box2d.b2Vec2.MulSV(this.m_rayActor.fraction, box2d.b2Vec2.SubVV(this.m_rayCastInput.p2, this.m_rayCastInput.p1, new box2d.b2Vec2()), new box2d.b2Vec2()), new box2d.b2Vec2());
      testbed.g_debugDraw.DrawPoint(p, 6.0, cr);
    }

    {
      const height = this.m_tree.GetHeight();
      testbed.g_debugDraw.DrawString(5, this.m_textLine, `dynamic tree height = ${height}`);
      this.m_textLine += testbed.DRAW_STRING_NEW_LINE;
    }

    ++this.m_stepCount;
  }

  public Keyboard(key: string) {
    switch (key) {
      case "a":
        this.m_automated = !this.m_automated;
        break;

      case "c":
        this.CreateProxy();
        break;

      case "d":
        this.DestroyProxy();
        break;

      case "m":
        this.MoveProxy();
        break;
    }
  }

  public GetRandomAABB(aabb: box2d.b2AABB): void {
    const w = new box2d.b2Vec2();
    w.Set(2.0 * this.m_proxyExtent, 2.0 * this.m_proxyExtent);
    //aabb.lowerBound.x = -this.m_proxyExtent;
    //aabb.lowerBound.y = -this.m_proxyExtent + this.m_worldExtent;
    aabb.lowerBound.x = box2d.b2RandomRange(-this.m_worldExtent, this.m_worldExtent);
    aabb.lowerBound.y = box2d.b2RandomRange(0.0, 2.0 * this.m_worldExtent);
    aabb.upperBound.Copy(aabb.lowerBound);
    aabb.upperBound.SelfAdd(w);
  }

  public MoveAABB(aabb: box2d.b2AABB): void {
    const d = new box2d.b2Vec2();
    d.x = box2d.b2RandomRange(-0.5, 0.5);
    d.y = box2d.b2RandomRange(-0.5, 0.5);
    //d.x = 2.0;
    //d.y = 0.0;
    aabb.lowerBound.SelfAdd(d);
    aabb.upperBound.SelfAdd(d);

    //box2d.b2Vec2 c0 = 0.5 * (aabb.lowerBound + aabb.upperBound);
    const c0 = box2d.b2Vec2.MulSV(0.5, box2d.b2Vec2.AddVV(aabb.lowerBound, aabb.upperBound, box2d.b2Vec2.s_t0), new box2d.b2Vec2());
    const min = new box2d.b2Vec2(-this.m_worldExtent, 0.0);
    const max = new box2d.b2Vec2(this.m_worldExtent, 2.0 * this.m_worldExtent);
    const c = box2d.b2Vec2.ClampV(c0, min, max, new box2d.b2Vec2());

    aabb.lowerBound.SelfAdd(box2d.b2Vec2.SubVV(c, c0, new box2d.b2Vec2()));
    aabb.upperBound.SelfAdd(box2d.b2Vec2.SubVV(c, c0, new box2d.b2Vec2()));
  }

  public CreateProxy(): void {
    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      const j = 0 | box2d.b2RandomRange(0, DynamicTreeTest.e_actorCount);
      const actor = this.m_actors[j];
      if (actor.proxyId === null) {
        this.GetRandomAABB(actor.aabb);
        actor.proxyId = this.m_tree.CreateProxy(actor.aabb, actor);
        return;
      }
    }
  }

  public DestroyProxy(): void {
    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      const j = 0 | box2d.b2RandomRange(0, DynamicTreeTest.e_actorCount);
      const actor = this.m_actors[j];
      if (actor.proxyId !== null) {
        this.m_tree.DestroyProxy(actor.proxyId);
        actor.proxyId = null;
        return;
      }
    }
  }

  public MoveProxy(): void {
    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      const j = 0 | box2d.b2RandomRange(0, DynamicTreeTest.e_actorCount);
      const actor = this.m_actors[j];
      if (actor.proxyId === null) {
        continue;
      }

      const aabb0 = new box2d.b2AABB();
      aabb0.Copy(actor.aabb);
      this.MoveAABB(actor.aabb);
      const displacement = box2d.b2Vec2.SubVV(actor.aabb.GetCenter(), aabb0.GetCenter(), new box2d.b2Vec2());
      this.m_tree.MoveProxy(actor.proxyId, actor.aabb, displacement);
      return;
    }
  }

  public Reset(): void {
    this.m_rayActor = null;
    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      this.m_actors[i].fraction = 1.0;
      this.m_actors[i].overlap = false;
    }
  }

  public Action(): void {
    const choice = 0 | box2d.b2RandomRange(0, 20);

    switch (choice) {
      case 0:
        this.CreateProxy();
        break;

      case 1:
        this.DestroyProxy();
        break;

      default:
        this.MoveProxy();
    }
  }

  public Query(): void {
    this.m_tree.Query(this.m_queryAABB, (proxyId: box2d.b2TreeNode<DynamicTreeTest_Actor>): boolean => {
      const actor = proxyId.userData; // this.m_tree.GetUserData(proxyId);
      actor.overlap = box2d.b2TestOverlapAABB(this.m_queryAABB, actor.aabb);
      return true;
    });

    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      if (this.m_actors[i].proxyId === null) {
        continue;
      }

      // DEBUG: const overlap =
      box2d.b2TestOverlapAABB(this.m_queryAABB, this.m_actors[i].aabb);
      // DEBUG: box2d.b2Assert(overlap === this.m_actors[i].overlap);
    }
  }

  public RayCast(): void {
    this.m_rayActor = null;

    const input = new box2d.b2RayCastInput();
    input.Copy(this.m_rayCastInput);

    // Ray cast against the dynamic tree.
    this.m_tree.RayCast(input, (input: box2d.b2RayCastInput, proxyId: box2d.b2TreeNode<DynamicTreeTest_Actor>): number => {
      const actor: DynamicTreeTest_Actor = proxyId.userData; // this.m_tree.GetUserData(proxyId);

      const output = new box2d.b2RayCastOutput();
      const hit = actor.aabb.RayCast(output, input);

      if (hit) {
        this.m_rayCastOutput = output;
        this.m_rayActor = actor;
        this.m_rayActor.fraction = output.fraction;
        return output.fraction;
      }

      return input.maxFraction;
    });

    // Brute force ray cast.
    let bruteActor = null;
    const bruteOutput = new box2d.b2RayCastOutput();
    for (let i = 0; i < DynamicTreeTest.e_actorCount; ++i) {
      if (this.m_actors[i].proxyId === null) {
        continue;
      }

      const output = new box2d.b2RayCastOutput();
      const hit = this.m_actors[i].aabb.RayCast(output, input);
      if (hit) {
        bruteActor = this.m_actors[i];
        bruteOutput.Copy(output);
        input.maxFraction = output.fraction;
      }
    }

    if (bruteActor !== null) {
      // DEBUG: box2d.b2Assert(bruteOutput.fraction === this.m_rayCastOutput.fraction);
    }
  }

  public static Create(): testbed.Test {
    return new DynamicTreeTest();
  }
}

export class DynamicTreeTest_Actor {
  public aabb = new box2d.b2AABB();
  public fraction = 0.0;
  public overlap = false;
  public proxyId: box2d.b2TreeNode<DynamicTreeTest_Actor> | null = null;
}
