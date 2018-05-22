/*
* Copyright (c) 2009 Erin Catto http://www.box2d.org
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

import { b2_aabbExtension, b2_aabbMultiplier } from "../Common/b2Settings";
import { b2Vec2 } from "../Common/b2Math";
import { b2GrowableStack } from "../Common/b2GrowableStack";
import { b2AABB, b2RayCastInput, b2TestOverlapAABB } from "./b2Collision";

/// A node in the dynamic tree. The client does not interact with this directly.
export class b2TreeNode {
  public m_id: number = 0;
  public aabb: b2AABB = new b2AABB();
  public userData: any = null;
  public parent: b2TreeNode = null; // or b2TreeNode.prototype.next
  public child1: b2TreeNode = null; // or b2TreeNode.prototype.next
  public child2: b2TreeNode = null; // or b2TreeNode.prototype.next
  public height: number = 0; // leaf = 0, free node = -1

  constructor(id: number = 0) {
    this.m_id = id;
  }

  public IsLeaf(): boolean {
    return this.child1 === null;
  }
}

export class b2DynamicTree {
  public m_root: b2TreeNode = null;

  // b2TreeNode* public m_nodes;
  // int32 public m_nodeCount;
  // int32 public m_nodeCapacity;

  public m_freeList: b2TreeNode = null;

  public m_path: number = 0;

  public m_insertionCount: number = 0;

  public static s_stack = new b2GrowableStack(256);
  public static s_r = new b2Vec2();
  public static s_v = new b2Vec2();
  public static s_abs_v = new b2Vec2();
  public static s_segmentAABB = new b2AABB();
  public static s_subInput = new b2RayCastInput();
  public static s_combinedAABB = new b2AABB();
  public static s_aabb = new b2AABB();

  public GetUserData(proxy: b2TreeNode): any {
    ///b2Assert(proxy !== null);
    return proxy.userData;
  }

  public GetFatAABB(proxy: b2TreeNode): b2AABB {
    ///b2Assert(proxy !== null);
    return proxy.aabb;
  }

  public Query(callback: (node: b2TreeNode) => boolean, aabb: b2AABB): void {
    if (this.m_root === null) return;

    const stack: b2GrowableStack = b2DynamicTree.s_stack.Reset();
    stack.Push(this.m_root);

    while (stack.GetCount() > 0) {
      const node: b2TreeNode = stack.Pop();
      if (node === null) {
        continue;
      }

      if (node.aabb.TestOverlap(aabb)) {
        if (node.IsLeaf()) {
          const proceed: boolean = callback(node);
          if (!proceed) {
            return;
          }
        } else {
          stack.Push(node.child1);
          stack.Push(node.child2);
        }
      }
    }
  }

  public RayCast(callback: (input: b2RayCastInput, node: b2TreeNode) => number, input: b2RayCastInput): void {
    if (this.m_root === null) return;

    const p1: b2Vec2 = input.p1;
    const p2: b2Vec2 = input.p2;
    const r: b2Vec2 = b2Vec2.SubVV(p2, p1, b2DynamicTree.s_r);
    ///b2Assert(r.LengthSquared() > 0);
    r.Normalize();

    // v is perpendicular to the segment.
    const v: b2Vec2 = b2Vec2.CrossOneV(r, b2DynamicTree.s_v);
    const abs_v: b2Vec2 = b2Vec2.AbsV(v, b2DynamicTree.s_abs_v);

    // Separating axis for segment (Gino, p80).
    // |dot(v, p1 - c)| > dot(|v|, h)

    let maxFraction: number = input.maxFraction;

    // Build a bounding box for the segment.
    const segmentAABB: b2AABB = b2DynamicTree.s_segmentAABB;
    let t_x: number = p1.x + maxFraction * (p2.x - p1.x);
    let t_y: number = p1.y + maxFraction * (p2.y - p1.y);
    segmentAABB.lowerBound.x = Math.min(p1.x, t_x);
    segmentAABB.lowerBound.y = Math.min(p1.y, t_y);
    segmentAABB.upperBound.x = Math.max(p1.x, t_x);
    segmentAABB.upperBound.y = Math.max(p1.y, t_y);

    const stack: b2GrowableStack = b2DynamicTree.s_stack.Reset();
    stack.Push(this.m_root);

    while (stack.GetCount() > 0) {
      const node: b2TreeNode = stack.Pop();
      if (node === null) {
        continue;
      }

      if (!b2TestOverlapAABB(node.aabb, segmentAABB)) {
        continue;
      }

      // Separating axis for segment (Gino, p80).
      // |dot(v, p1 - c)| > dot(|v|, h)
      const c: b2Vec2 = node.aabb.GetCenter();
      const h: b2Vec2 = node.aabb.GetExtents();
      const separation: number = Math.abs(b2Vec2.DotVV(v, b2Vec2.SubVV(p1, c, b2Vec2.s_t0))) - b2Vec2.DotVV(abs_v, h);
      if (separation > 0) {
        continue;
      }

      if (node.IsLeaf()) {
        const subInput: b2RayCastInput = b2DynamicTree.s_subInput;
        subInput.p1.Copy(input.p1);
        subInput.p2.Copy(input.p2);
        subInput.maxFraction = maxFraction;

        const value: number = callback(subInput, node);

        if (value === 0) {
          // The client has terminated the ray cast.
          return;
        }

        if (value > 0) {
          // Update segment bounding box.
          maxFraction = value;
          t_x = p1.x + maxFraction * (p2.x - p1.x);
          t_y = p1.y + maxFraction * (p2.y - p1.y);
          segmentAABB.lowerBound.x = Math.min(p1.x, t_x);
          segmentAABB.lowerBound.y = Math.min(p1.y, t_y);
          segmentAABB.upperBound.x = Math.max(p1.x, t_x);
          segmentAABB.upperBound.y = Math.max(p1.y, t_y);
        }
      } else {
        stack.Push(node.child1);
        stack.Push(node.child2);
      }
    }
  }

  public static s_node_id: number = 0;

  public AllocateNode(): b2TreeNode {
    // Expand the node pool as needed.
    if (this.m_freeList) {
      const node: b2TreeNode = this.m_freeList;
      this.m_freeList = node.parent; // this.m_freeList = node.next;
      node.parent = null;
      node.child1 = null;
      node.child2 = null;
      node.height = 0;
      node.userData = null;
      return node;
    }

    return new b2TreeNode(b2DynamicTree.s_node_id++);
  }

  public FreeNode(node: b2TreeNode): void {
    node.parent = this.m_freeList; // node.next = this.m_freeList;
    node.height = -1;
    this.m_freeList = node;
  }

  public CreateProxy(aabb: b2AABB, userData: any): b2TreeNode {
    const node: b2TreeNode = this.AllocateNode();

    // Fatten the aabb.
    const r_x: number = b2_aabbExtension;
    const r_y: number = b2_aabbExtension;
    node.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
    node.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
    node.aabb.upperBound.x = aabb.upperBound.x + r_x;
    node.aabb.upperBound.y = aabb.upperBound.y + r_y;
    node.userData = userData;
    node.height = 0;

    this.InsertLeaf(node);

    return node;
  }

  public DestroyProxy(proxy: b2TreeNode): void {
    ///b2Assert(proxy.IsLeaf());

    this.RemoveLeaf(proxy);
    this.FreeNode(proxy);
  }

  public MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): boolean {
    ///b2Assert(proxy.IsLeaf());

    if (proxy.aabb.Contains(aabb)) {
      return false;
    }

    this.RemoveLeaf(proxy);

    // Extend AABB.
    // Predict AABB displacement.
    const r_x: number = b2_aabbExtension + b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
    const r_y: number = b2_aabbExtension + b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
    proxy.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
    proxy.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
    proxy.aabb.upperBound.x = aabb.upperBound.x + r_x;
    proxy.aabb.upperBound.y = aabb.upperBound.y + r_y;

    this.InsertLeaf(proxy);
    return true;
  }

  public InsertLeaf(leaf: b2TreeNode): void {
    ++this.m_insertionCount;

    if (this.m_root === null) {
      this.m_root = leaf;
      this.m_root.parent = null;
      return;
    }

    // Find the best sibling for this node
    const leafAABB: b2AABB = leaf.aabb;
    ///const center: b2Vec2 = leafAABB.GetCenter();
    let index: b2TreeNode = this.m_root;
    let child1: b2TreeNode;
    let child2: b2TreeNode;
    while (!index.IsLeaf()) {
      child1 = index.child1;
      child2 = index.child2;

      const area: number = index.aabb.GetPerimeter();

      const combinedAABB: b2AABB = b2DynamicTree.s_combinedAABB;
      combinedAABB.Combine2(index.aabb, leafAABB);
      const combinedArea: number = combinedAABB.GetPerimeter();

      // Cost of creating a new parent for this node and the new leaf
      const cost: number = 2 * combinedArea;

      // Minimum cost of pushing the leaf further down the tree
      const inheritanceCost: number = 2 * (combinedArea - area);

      // Cost of descending into child1
      let cost1: number;
      const aabb: b2AABB = b2DynamicTree.s_aabb;
      let oldArea: number;
      let newArea: number;
      if (child1.IsLeaf()) {
        aabb.Combine2(leafAABB, child1.aabb);
        cost1 = aabb.GetPerimeter() + inheritanceCost;
      } else {
        aabb.Combine2(leafAABB, child1.aabb);
        oldArea = child1.aabb.GetPerimeter();
        newArea = aabb.GetPerimeter();
        cost1 = (newArea - oldArea) + inheritanceCost;
      }

      // Cost of descending into child2
      let cost2: number;
      if (child2.IsLeaf()) {
        aabb.Combine2(leafAABB, child2.aabb);
        cost2 = aabb.GetPerimeter() + inheritanceCost;
      } else {
        aabb.Combine2(leafAABB, child2.aabb);
        oldArea = child2.aabb.GetPerimeter();
        newArea = aabb.GetPerimeter();
        cost2 = newArea - oldArea + inheritanceCost;
      }

      // Descend according to the minimum cost.
      if (cost < cost1 && cost < cost2) {
        break;
      }

      // Descend
      if (cost1 < cost2) {
        index = child1;
      } else {
        index = child2;
      }
    }

    const sibling: b2TreeNode = index;

    // Create a parent for the siblings.
    const oldParent: b2TreeNode = sibling.parent;
    const newParent: b2TreeNode = this.AllocateNode();
    newParent.parent = oldParent;
    newParent.userData = null;
    newParent.aabb.Combine2(leafAABB, sibling.aabb);
    newParent.height = sibling.height + 1;

    if (oldParent) {
      // The sibling was not the root.
      if (oldParent.child1 === sibling) {
        oldParent.child1 = newParent;
      } else {
        oldParent.child2 = newParent;
      }

      newParent.child1 = sibling;
      newParent.child2 = leaf;
      sibling.parent = newParent;
      leaf.parent = newParent;
    } else {
      // The sibling was the root.
      newParent.child1 = sibling;
      newParent.child2 = leaf;
      sibling.parent = newParent;
      leaf.parent = newParent;
      this.m_root = newParent;
    }

    // Walk back up the tree fixing heights and AABBs
    index = leaf.parent;
    while (index !== null) {
      index = this.Balance(index);

      child1 = index.child1;
      child2 = index.child2;

      ///b2Assert(child1 !== null);
      ///b2Assert(child2 !== null);

      index.height = 1 + Math.max(child1.height, child2.height);
      index.aabb.Combine2(child1.aabb, child2.aabb);

      index = index.parent;
    }

    // this.Validate();
  }

  public RemoveLeaf(leaf: b2TreeNode): void {
    if (leaf === this.m_root) {
      this.m_root = null;
      return;
    }

    const parent: b2TreeNode = leaf.parent;
    const grandParent: b2TreeNode = parent.parent;
    let sibling: b2TreeNode;
    if (parent.child1 === leaf) {
      sibling = parent.child2;
    } else {
      sibling = parent.child1;
    }

    if (grandParent) {
      // Destroy parent and connect sibling to grandParent.
      if (grandParent.child1 === parent) {
        grandParent.child1 = sibling;
      } else {
        grandParent.child2 = sibling;
      }
      sibling.parent = grandParent;
      this.FreeNode(parent);

      // Adjust ancestor bounds.
      let index: b2TreeNode = grandParent;
      while (index) {
        index = this.Balance(index);

        const child1: b2TreeNode = index.child1;
        const child2: b2TreeNode = index.child2;

        index.aabb.Combine2(child1.aabb, child2.aabb);
        index.height = 1 + Math.max(child1.height, child2.height);

        index = index.parent;
      }
    } else {
      this.m_root = sibling;
      sibling.parent = null;
      this.FreeNode(parent);
    }

    // this.Validate();
  }

  public Balance(A: b2TreeNode): b2TreeNode {
    ///b2Assert(A !== null);

    if (A.IsLeaf() || A.height < 2) {
      return A;
    }

    const B: b2TreeNode = A.child1;
    const C: b2TreeNode = A.child2;

    const balance: number = C.height - B.height;

    // Rotate C up
    if (balance > 1) {
      const F: b2TreeNode = C.child1;
      const G: b2TreeNode = C.child2;

      // Swap A and C
      C.child1 = A;
      C.parent = A.parent;
      A.parent = C;

      // A's old parent should point to C
      if (C.parent !== null) {
        if (C.parent.child1 === A) {
          C.parent.child1 = C;
        } else {
          ///b2Assert(C.parent.child2 === A);
          C.parent.child2 = C;
        }
      } else {
        this.m_root = C;
      }

      // Rotate
      if (F.height > G.height) {
        C.child2 = F;
        A.child2 = G;
        G.parent = A;
        A.aabb.Combine2(B.aabb, G.aabb);
        C.aabb.Combine2(A.aabb, F.aabb);

        A.height = 1 + Math.max(B.height, G.height);
        C.height = 1 + Math.max(A.height, F.height);
      } else {
        C.child2 = G;
        A.child2 = F;
        F.parent = A;
        A.aabb.Combine2(B.aabb, F.aabb);
        C.aabb.Combine2(A.aabb, G.aabb);

        A.height = 1 + Math.max(B.height, F.height);
        C.height = 1 + Math.max(A.height, G.height);
      }

      return C;
    }

    // Rotate B up
    if (balance < -1) {
      const D: b2TreeNode = B.child1;
      const E: b2TreeNode = B.child2;

      // Swap A and B
      B.child1 = A;
      B.parent = A.parent;
      A.parent = B;

      // A's old parent should point to B
      if (B.parent !== null) {
        if (B.parent.child1 === A) {
          B.parent.child1 = B;
        } else {
          ///b2Assert(B.parent.child2 === A);
          B.parent.child2 = B;
        }
      } else {
        this.m_root = B;
      }

      // Rotate
      if (D.height > E.height) {
        B.child2 = D;
        A.child1 = E;
        E.parent = A;
        A.aabb.Combine2(C.aabb, E.aabb);
        B.aabb.Combine2(A.aabb, D.aabb);

        A.height = 1 + Math.max(C.height, E.height);
        B.height = 1 + Math.max(A.height, D.height);
      } else {
        B.child2 = E;
        A.child1 = D;
        D.parent = A;
        A.aabb.Combine2(C.aabb, D.aabb);
        B.aabb.Combine2(A.aabb, E.aabb);

        A.height = 1 + Math.max(C.height, D.height);
        B.height = 1 + Math.max(A.height, E.height);
      }

      return B;
    }

    return A;
  }

  public GetHeight(): number {
    if (this.m_root === null) {
      return 0;
    }

    return this.m_root.height;
  }

  private static GetAreaNode(node: b2TreeNode): number {
    if (node === null) {
      return 0;
    }

    if (node.IsLeaf()) {
      return 0;
    }

    let area: number = node.aabb.GetPerimeter();
    area += b2DynamicTree.GetAreaNode(node.child1);
    area += b2DynamicTree.GetAreaNode(node.child2);
    return area;
  }

  public GetAreaRatio(): number {
    if (this.m_root === null) {
      return 0;
    }

    const root: b2TreeNode = this.m_root;
    const rootArea: number = root.aabb.GetPerimeter();

    const totalArea: number = b2DynamicTree.GetAreaNode(this.m_root);

    /*
    float32 totalArea = 0.0;
    for (int32 i = 0; i < m_nodeCapacity; ++i) {
      const b2TreeNode* node = m_nodes + i;
      if (node.height < 0) {
        // Free node in pool
        continue;
      }

      totalArea += node.aabb.GetPerimeter();
    }
    */

    return totalArea / rootArea;
  }

  public ComputeHeightNode(node: b2TreeNode): number {
    if (node.IsLeaf()) {
      return 0;
    }

    const height1: number = this.ComputeHeightNode(node.child1);
    const height2: number = this.ComputeHeightNode(node.child2);
    return 1 + Math.max(height1, height2);
  }

  public ComputeHeight(): number {
    const height: number = this.ComputeHeightNode(this.m_root);
    return height;
  }

  public ValidateStructure(index: b2TreeNode): void {
    if (index === null) {
      return;
    }

    if (index === this.m_root) {
      ///b2Assert(index.parent === null);
    }

    const node: b2TreeNode = index;

    const child1: b2TreeNode = node.child1;
    const child2: b2TreeNode = node.child2;

    if (node.IsLeaf()) {
      ///b2Assert(child1 === null);
      ///b2Assert(child2 === null);
      ///b2Assert(node.height === 0);
      return;
    }

    ///b2Assert(child1.parent === index);
    ///b2Assert(child2.parent === index);

    this.ValidateStructure(child1);
    this.ValidateStructure(child2);
  }

  public ValidateMetrics(index: b2TreeNode): void {
    if (index === null) {
      return;
    }

    const node: b2TreeNode = index;

    const child1: b2TreeNode = node.child1;
    const child2: b2TreeNode = node.child2;

    if (node.IsLeaf()) {
      ///b2Assert(child1 === null);
      ///b2Assert(child2 === null);
      ///b2Assert(node.height === 0);
      return;
    }

    ///const height1: number = child1.height;
    ///const height2: number = child2.height;
    ///const height: number = 1 + Math.max(height1, height2);
    ///b2Assert(node.height === height);

    const aabb: b2AABB = b2DynamicTree.s_aabb;
    aabb.Combine2(child1.aabb, child2.aabb);

    ///b2Assert(aabb.lowerBound === node.aabb.lowerBound);
    ///b2Assert(aabb.upperBound === node.aabb.upperBound);

    this.ValidateMetrics(child1);
    this.ValidateMetrics(child2);
  }

  public Validate(): void {
    this.ValidateStructure(this.m_root);
    this.ValidateMetrics(this.m_root);

    // let freeCount: number = 0;
    let freeIndex: b2TreeNode = this.m_freeList;
    while (freeIndex !== null) {
      freeIndex = freeIndex.parent; // freeIndex = freeIndex.next;
      // ++freeCount;
    }

    ///b2Assert(this.GetHeight() === this.ComputeHeight());
  }

  private static GetMaxBalanceNode(node: b2TreeNode, maxBalance: number): number {
    if (node === null) {
      return maxBalance;
    }

    if (node.height <= 1) {
      return maxBalance;
    }

    ///b2Assert(!node.IsLeaf());

    const child1: b2TreeNode = node.child1;
    const child2: b2TreeNode = node.child2;
    const balance: number = Math.abs(child2.height - child1.height);
    return Math.max(maxBalance, balance);
  }

  public GetMaxBalance(): number {
    const maxBalance: number = b2DynamicTree.GetMaxBalanceNode(this.m_root, 0);

    /*
    int32 maxBalance = 0;
    for (int32 i = 0; i < m_nodeCapacity; ++i) {
      const b2TreeNode* node = m_nodes + i;
      if (node.height <= 1) {
        continue;
      }

      b2Assert(!node.IsLeaf());

      int32 child1 = node.child1;
      int32 child2 = node.child2;
      int32 balance = Math.abs(m_nodes[child2].height - m_nodes[child1].height);
      maxBalance = Math.max(maxBalance, balance);
    }
    */

    return maxBalance;
  }

  public RebuildBottomUp(): void {
    /*
    int32* nodes = (int32*)b2Alloc(m_nodeCount * sizeof(int32));
    int32 count = 0;

    // Build array of leaves. Free the rest.
    for (int32 i = 0; i < m_nodeCapacity; ++i) {
      if (m_nodes[i].height < 0) {
        // free node in pool
        continue;
      }

      if (m_nodes[i].IsLeaf()) {
        m_nodes[i].parent = b2_nullNode;
        nodes[count] = i;
        ++count;
      } else {
        FreeNode(i);
      }
    }

    while (count > 1) {
      float32 minCost = b2_maxFloat;
      int32 iMin = -1, jMin = -1;
      for (int32 i = 0; i < count; ++i) {
        b2AABB aabbi = m_nodes[nodes[i]].aabb;

        for (int32 j = i + 1; j < count; ++j) {
          b2AABB aabbj = m_nodes[nodes[j]].aabb;
          b2AABB b;
          b.Combine(aabbi, aabbj);
          float32 cost = b.GetPerimeter();
          if (cost < minCost) {
            iMin = i;
            jMin = j;
            minCost = cost;
          }
        }
      }

      int32 index1 = nodes[iMin];
      int32 index2 = nodes[jMin];
      b2TreeNode* child1 = m_nodes + index1;
      b2TreeNode* child2 = m_nodes + index2;

      int32 parentIndex = AllocateNode();
      b2TreeNode* parent = m_nodes + parentIndex;
      parent.child1 = index1;
      parent.child2 = index2;
      parent.height = 1 + Math.max(child1.height, child2.height);
      parent.aabb.Combine(child1.aabb, child2.aabb);
      parent.parent = b2_nullNode;

      child1.parent = parentIndex;
      child2.parent = parentIndex;

      nodes[jMin] = nodes[count-1];
      nodes[iMin] = parentIndex;
      --count;
    }

    m_root = nodes[0];
    b2Free(nodes);
    */

    this.Validate();
  }

  private static ShiftOriginNode(node: b2TreeNode, newOrigin: b2Vec2): void {
    if (node === null) {
      return;
    }

    if (node.height <= 1) {
      return;
    }

    ///b2Assert(!node.IsLeaf());

    const child1: b2TreeNode = node.child1;
    const child2: b2TreeNode = node.child2;
    b2DynamicTree.ShiftOriginNode(child1, newOrigin);
    b2DynamicTree.ShiftOriginNode(child2, newOrigin);

    node.aabb.lowerBound.SelfSub(newOrigin);
    node.aabb.upperBound.SelfSub(newOrigin);
  }

  public ShiftOrigin(newOrigin: b2Vec2): void {

    b2DynamicTree.ShiftOriginNode(this.m_root, newOrigin);

    /*
    // Build array of leaves. Free the rest.
    for (int32 i = 0; i < m_nodeCapacity; ++i) {
      m_nodes[i].aabb.lowerBound -= newOrigin;
      m_nodes[i].aabb.upperBound -= newOrigin;
    }
    */
  }
}
