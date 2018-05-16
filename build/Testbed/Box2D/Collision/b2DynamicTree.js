"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const b2Settings_1 = require("../Common/b2Settings");
const b2Math_1 = require("../Common/b2Math");
const b2GrowableStack_1 = require("../Common/b2GrowableStack");
const b2Collision_1 = require("./b2Collision");
/// A node in the dynamic tree. The client does not interact with this directly.
class b2TreeNode {
    constructor(id = 0) {
        this.m_id = 0;
        this.aabb = new b2Collision_1.b2AABB();
        this.userData = null;
        this.parent = null; // or b2TreeNode.prototype.next
        this.child1 = null; // or b2TreeNode.prototype.next
        this.child2 = null; // or b2TreeNode.prototype.next
        this.height = 0; // leaf = 0, free node = -1
        this.m_id = id;
    }
    IsLeaf() {
        return this.child1 === null;
    }
}
exports.b2TreeNode = b2TreeNode;
class b2DynamicTree {
    constructor() {
        this.m_root = null;
        // b2TreeNode* public m_nodes;
        // int32 public m_nodeCount;
        // int32 public m_nodeCapacity;
        this.m_freeList = null;
        this.m_path = 0;
        this.m_insertionCount = 0;
    }
    GetUserData(proxy) {
        ///b2Assert(proxy !== null);
        return proxy.userData;
    }
    GetFatAABB(proxy) {
        ///b2Assert(proxy !== null);
        return proxy.aabb;
    }
    Query(callback, aabb) {
        if (this.m_root === null)
            return;
        const stack = b2DynamicTree.s_stack.Reset();
        stack.Push(this.m_root);
        while (stack.GetCount() > 0) {
            const node = stack.Pop();
            if (node === null) {
                continue;
            }
            if (node.aabb.TestOverlap(aabb)) {
                if (node.IsLeaf()) {
                    const proceed = callback(node);
                    if (!proceed) {
                        return;
                    }
                }
                else {
                    stack.Push(node.child1);
                    stack.Push(node.child2);
                }
            }
        }
    }
    RayCast(callback, input) {
        if (this.m_root === null)
            return;
        const p1 = input.p1;
        const p2 = input.p2;
        const r = b2Math_1.b2Vec2.SubVV(p2, p1, b2DynamicTree.s_r);
        ///b2Assert(r.LengthSquared() > 0);
        r.Normalize();
        // v is perpendicular to the segment.
        const v = b2Math_1.b2Vec2.CrossOneV(r, b2DynamicTree.s_v);
        const abs_v = b2Math_1.b2Vec2.AbsV(v, b2DynamicTree.s_abs_v);
        // Separating axis for segment (Gino, p80).
        // |dot(v, p1 - c)| > dot(|v|, h)
        let maxFraction = input.maxFraction;
        // Build a bounding box for the segment.
        const segmentAABB = b2DynamicTree.s_segmentAABB;
        let t_x = p1.x + maxFraction * (p2.x - p1.x);
        let t_y = p1.y + maxFraction * (p2.y - p1.y);
        segmentAABB.lowerBound.x = b2Math_1.b2Min(p1.x, t_x);
        segmentAABB.lowerBound.y = b2Math_1.b2Min(p1.y, t_y);
        segmentAABB.upperBound.x = b2Math_1.b2Max(p1.x, t_x);
        segmentAABB.upperBound.y = b2Math_1.b2Max(p1.y, t_y);
        const stack = b2DynamicTree.s_stack.Reset();
        stack.Push(this.m_root);
        while (stack.GetCount() > 0) {
            const node = stack.Pop();
            if (node === null) {
                continue;
            }
            if (!b2Collision_1.b2TestOverlapAABB(node.aabb, segmentAABB)) {
                continue;
            }
            // Separating axis for segment (Gino, p80).
            // |dot(v, p1 - c)| > dot(|v|, h)
            const c = node.aabb.GetCenter();
            const h = node.aabb.GetExtents();
            const separation = b2Math_1.b2Abs(b2Math_1.b2Vec2.DotVV(v, b2Math_1.b2Vec2.SubVV(p1, c, b2Math_1.b2Vec2.s_t0))) - b2Math_1.b2Vec2.DotVV(abs_v, h);
            if (separation > 0) {
                continue;
            }
            if (node.IsLeaf()) {
                const subInput = b2DynamicTree.s_subInput;
                subInput.p1.Copy(input.p1);
                subInput.p2.Copy(input.p2);
                subInput.maxFraction = maxFraction;
                const value = callback(subInput, node);
                if (value === 0) {
                    // The client has terminated the ray cast.
                    return;
                }
                if (value > 0) {
                    // Update segment bounding box.
                    maxFraction = value;
                    t_x = p1.x + maxFraction * (p2.x - p1.x);
                    t_y = p1.y + maxFraction * (p2.y - p1.y);
                    segmentAABB.lowerBound.x = b2Math_1.b2Min(p1.x, t_x);
                    segmentAABB.lowerBound.y = b2Math_1.b2Min(p1.y, t_y);
                    segmentAABB.upperBound.x = b2Math_1.b2Max(p1.x, t_x);
                    segmentAABB.upperBound.y = b2Math_1.b2Max(p1.y, t_y);
                }
            }
            else {
                stack.Push(node.child1);
                stack.Push(node.child2);
            }
        }
    }
    AllocateNode() {
        // Expand the node pool as needed.
        if (this.m_freeList) {
            const node = this.m_freeList;
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
    FreeNode(node) {
        node.parent = this.m_freeList; // node.next = this.m_freeList;
        node.height = -1;
        this.m_freeList = node;
    }
    CreateProxy(aabb, userData) {
        const node = this.AllocateNode();
        // Fatten the aabb.
        const r_x = b2Settings_1.b2_aabbExtension;
        const r_y = b2Settings_1.b2_aabbExtension;
        node.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
        node.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
        node.aabb.upperBound.x = aabb.upperBound.x + r_x;
        node.aabb.upperBound.y = aabb.upperBound.y + r_y;
        node.userData = userData;
        node.height = 0;
        this.InsertLeaf(node);
        return node;
    }
    DestroyProxy(proxy) {
        ///b2Assert(proxy.IsLeaf());
        this.RemoveLeaf(proxy);
        this.FreeNode(proxy);
    }
    MoveProxy(proxy, aabb, displacement) {
        ///b2Assert(proxy.IsLeaf());
        if (proxy.aabb.Contains(aabb)) {
            return false;
        }
        this.RemoveLeaf(proxy);
        // Extend AABB.
        // Predict AABB displacement.
        const r_x = b2Settings_1.b2_aabbExtension + b2Settings_1.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
        const r_y = b2Settings_1.b2_aabbExtension + b2Settings_1.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
        proxy.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
        proxy.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
        proxy.aabb.upperBound.x = aabb.upperBound.x + r_x;
        proxy.aabb.upperBound.y = aabb.upperBound.y + r_y;
        this.InsertLeaf(proxy);
        return true;
    }
    InsertLeaf(leaf) {
        ++this.m_insertionCount;
        if (this.m_root === null) {
            this.m_root = leaf;
            this.m_root.parent = null;
            return;
        }
        // Find the best sibling for this node
        const leafAABB = leaf.aabb;
        ///const center: b2Vec2 = leafAABB.GetCenter();
        let index = this.m_root;
        let child1;
        let child2;
        while (!index.IsLeaf()) {
            child1 = index.child1;
            child2 = index.child2;
            const area = index.aabb.GetPerimeter();
            const combinedAABB = b2DynamicTree.s_combinedAABB;
            combinedAABB.Combine2(index.aabb, leafAABB);
            const combinedArea = combinedAABB.GetPerimeter();
            // Cost of creating a new parent for this node and the new leaf
            const cost = 2 * combinedArea;
            // Minimum cost of pushing the leaf further down the tree
            const inheritanceCost = 2 * (combinedArea - area);
            // Cost of descending into child1
            let cost1;
            const aabb = b2DynamicTree.s_aabb;
            let oldArea;
            let newArea;
            if (child1.IsLeaf()) {
                aabb.Combine2(leafAABB, child1.aabb);
                cost1 = aabb.GetPerimeter() + inheritanceCost;
            }
            else {
                aabb.Combine2(leafAABB, child1.aabb);
                oldArea = child1.aabb.GetPerimeter();
                newArea = aabb.GetPerimeter();
                cost1 = (newArea - oldArea) + inheritanceCost;
            }
            // Cost of descending into child2
            let cost2;
            if (child2.IsLeaf()) {
                aabb.Combine2(leafAABB, child2.aabb);
                cost2 = aabb.GetPerimeter() + inheritanceCost;
            }
            else {
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
            }
            else {
                index = child2;
            }
        }
        const sibling = index;
        // Create a parent for the siblings.
        const oldParent = sibling.parent;
        const newParent = this.AllocateNode();
        newParent.parent = oldParent;
        newParent.userData = null;
        newParent.aabb.Combine2(leafAABB, sibling.aabb);
        newParent.height = sibling.height + 1;
        if (oldParent) {
            // The sibling was not the root.
            if (oldParent.child1 === sibling) {
                oldParent.child1 = newParent;
            }
            else {
                oldParent.child2 = newParent;
            }
            newParent.child1 = sibling;
            newParent.child2 = leaf;
            sibling.parent = newParent;
            leaf.parent = newParent;
        }
        else {
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
            index.height = 1 + b2Math_1.b2Max(child1.height, child2.height);
            index.aabb.Combine2(child1.aabb, child2.aabb);
            index = index.parent;
        }
        // this.Validate();
    }
    RemoveLeaf(leaf) {
        if (leaf === this.m_root) {
            this.m_root = null;
            return;
        }
        const parent = leaf.parent;
        const grandParent = parent.parent;
        let sibling;
        if (parent.child1 === leaf) {
            sibling = parent.child2;
        }
        else {
            sibling = parent.child1;
        }
        if (grandParent) {
            // Destroy parent and connect sibling to grandParent.
            if (grandParent.child1 === parent) {
                grandParent.child1 = sibling;
            }
            else {
                grandParent.child2 = sibling;
            }
            sibling.parent = grandParent;
            this.FreeNode(parent);
            // Adjust ancestor bounds.
            let index = grandParent;
            while (index) {
                index = this.Balance(index);
                const child1 = index.child1;
                const child2 = index.child2;
                index.aabb.Combine2(child1.aabb, child2.aabb);
                index.height = 1 + b2Math_1.b2Max(child1.height, child2.height);
                index = index.parent;
            }
        }
        else {
            this.m_root = sibling;
            sibling.parent = null;
            this.FreeNode(parent);
        }
        // this.Validate();
    }
    Balance(A) {
        ///b2Assert(A !== null);
        if (A.IsLeaf() || A.height < 2) {
            return A;
        }
        const B = A.child1;
        const C = A.child2;
        const balance = C.height - B.height;
        // Rotate C up
        if (balance > 1) {
            const F = C.child1;
            const G = C.child2;
            // Swap A and C
            C.child1 = A;
            C.parent = A.parent;
            A.parent = C;
            // A's old parent should point to C
            if (C.parent !== null) {
                if (C.parent.child1 === A) {
                    C.parent.child1 = C;
                }
                else {
                    ///b2Assert(C.parent.child2 === A);
                    C.parent.child2 = C;
                }
            }
            else {
                this.m_root = C;
            }
            // Rotate
            if (F.height > G.height) {
                C.child2 = F;
                A.child2 = G;
                G.parent = A;
                A.aabb.Combine2(B.aabb, G.aabb);
                C.aabb.Combine2(A.aabb, F.aabb);
                A.height = 1 + b2Math_1.b2Max(B.height, G.height);
                C.height = 1 + b2Math_1.b2Max(A.height, F.height);
            }
            else {
                C.child2 = G;
                A.child2 = F;
                F.parent = A;
                A.aabb.Combine2(B.aabb, F.aabb);
                C.aabb.Combine2(A.aabb, G.aabb);
                A.height = 1 + b2Math_1.b2Max(B.height, F.height);
                C.height = 1 + b2Math_1.b2Max(A.height, G.height);
            }
            return C;
        }
        // Rotate B up
        if (balance < -1) {
            const D = B.child1;
            const E = B.child2;
            // Swap A and B
            B.child1 = A;
            B.parent = A.parent;
            A.parent = B;
            // A's old parent should point to B
            if (B.parent !== null) {
                if (B.parent.child1 === A) {
                    B.parent.child1 = B;
                }
                else {
                    ///b2Assert(B.parent.child2 === A);
                    B.parent.child2 = B;
                }
            }
            else {
                this.m_root = B;
            }
            // Rotate
            if (D.height > E.height) {
                B.child2 = D;
                A.child1 = E;
                E.parent = A;
                A.aabb.Combine2(C.aabb, E.aabb);
                B.aabb.Combine2(A.aabb, D.aabb);
                A.height = 1 + b2Math_1.b2Max(C.height, E.height);
                B.height = 1 + b2Math_1.b2Max(A.height, D.height);
            }
            else {
                B.child2 = E;
                A.child1 = D;
                D.parent = A;
                A.aabb.Combine2(C.aabb, D.aabb);
                B.aabb.Combine2(A.aabb, E.aabb);
                A.height = 1 + b2Math_1.b2Max(C.height, D.height);
                B.height = 1 + b2Math_1.b2Max(A.height, E.height);
            }
            return B;
        }
        return A;
    }
    GetHeight() {
        if (this.m_root === null) {
            return 0;
        }
        return this.m_root.height;
    }
    static GetAreaNode(node) {
        if (node === null) {
            return 0;
        }
        if (node.IsLeaf()) {
            return 0;
        }
        let area = node.aabb.GetPerimeter();
        area += b2DynamicTree.GetAreaNode(node.child1);
        area += b2DynamicTree.GetAreaNode(node.child2);
        return area;
    }
    GetAreaRatio() {
        if (this.m_root === null) {
            return 0;
        }
        const root = this.m_root;
        const rootArea = root.aabb.GetPerimeter();
        const totalArea = b2DynamicTree.GetAreaNode(this.m_root);
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
    ComputeHeightNode(node) {
        if (node.IsLeaf()) {
            return 0;
        }
        const height1 = this.ComputeHeightNode(node.child1);
        const height2 = this.ComputeHeightNode(node.child2);
        return 1 + b2Math_1.b2Max(height1, height2);
    }
    ComputeHeight() {
        const height = this.ComputeHeightNode(this.m_root);
        return height;
    }
    ValidateStructure(index) {
        if (index === null) {
            return;
        }
        if (index === this.m_root) {
            ///b2Assert(index.parent === null);
        }
        const node = index;
        const child1 = node.child1;
        const child2 = node.child2;
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
    ValidateMetrics(index) {
        if (index === null) {
            return;
        }
        const node = index;
        const child1 = node.child1;
        const child2 = node.child2;
        if (node.IsLeaf()) {
            ///b2Assert(child1 === null);
            ///b2Assert(child2 === null);
            ///b2Assert(node.height === 0);
            return;
        }
        ///const height1: number = child1.height;
        ///const height2: number = child2.height;
        ///const height: number = 1 + b2Max(height1, height2);
        ///b2Assert(node.height === height);
        const aabb = b2DynamicTree.s_aabb;
        aabb.Combine2(child1.aabb, child2.aabb);
        ///b2Assert(aabb.lowerBound === node.aabb.lowerBound);
        ///b2Assert(aabb.upperBound === node.aabb.upperBound);
        this.ValidateMetrics(child1);
        this.ValidateMetrics(child2);
    }
    Validate() {
        this.ValidateStructure(this.m_root);
        this.ValidateMetrics(this.m_root);
        // let freeCount: number = 0;
        let freeIndex = this.m_freeList;
        while (freeIndex !== null) {
            freeIndex = freeIndex.parent; // freeIndex = freeIndex.next;
            // ++freeCount;
        }
        ///b2Assert(this.GetHeight() === this.ComputeHeight());
    }
    static GetMaxBalanceNode(node, maxBalance) {
        if (node === null) {
            return maxBalance;
        }
        if (node.height <= 1) {
            return maxBalance;
        }
        ///b2Assert(!node.IsLeaf());
        const child1 = node.child1;
        const child2 = node.child2;
        const balance = b2Math_1.b2Abs(child2.height - child1.height);
        return b2Math_1.b2Max(maxBalance, balance);
    }
    GetMaxBalance() {
        const maxBalance = b2DynamicTree.GetMaxBalanceNode(this.m_root, 0);
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
          int32 balance = b2Abs(m_nodes[child2].height - m_nodes[child1].height);
          maxBalance = b2Max(maxBalance, balance);
        }
        */
        return maxBalance;
    }
    RebuildBottomUp() {
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
          parent.height = 1 + b2Max(child1.height, child2.height);
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
    static ShiftOriginNode(node, newOrigin) {
        if (node === null) {
            return;
        }
        if (node.height <= 1) {
            return;
        }
        ///b2Assert(!node.IsLeaf());
        const child1 = node.child1;
        const child2 = node.child2;
        b2DynamicTree.ShiftOriginNode(child1, newOrigin);
        b2DynamicTree.ShiftOriginNode(child2, newOrigin);
        node.aabb.lowerBound.SelfSub(newOrigin);
        node.aabb.upperBound.SelfSub(newOrigin);
    }
    ShiftOrigin(newOrigin) {
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
b2DynamicTree.s_stack = new b2GrowableStack_1.b2GrowableStack(256);
b2DynamicTree.s_r = new b2Math_1.b2Vec2();
b2DynamicTree.s_v = new b2Math_1.b2Vec2();
b2DynamicTree.s_abs_v = new b2Math_1.b2Vec2();
b2DynamicTree.s_segmentAABB = new b2Collision_1.b2AABB();
b2DynamicTree.s_subInput = new b2Collision_1.b2RayCastInput();
b2DynamicTree.s_combinedAABB = new b2Collision_1.b2AABB();
b2DynamicTree.s_aabb = new b2Collision_1.b2AABB();
b2DynamicTree.s_node_id = 0;
exports.b2DynamicTree = b2DynamicTree;
//# sourceMappingURL=b2DynamicTree.js.map