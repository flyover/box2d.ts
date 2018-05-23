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
System.register(["../Common/b2Settings", "../Common/b2Math", "../Common/b2GrowableStack", "./b2Collision"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function verify(value) {
        if (value === null) {
            throw new Error();
        }
        return value;
    }
    var b2Settings_1, b2Math_1, b2GrowableStack_1, b2Collision_1, b2TreeNode, b2DynamicTree;
    return {
        setters: [
            function (b2Settings_1_1) {
                b2Settings_1 = b2Settings_1_1;
            },
            function (b2Math_1_1) {
                b2Math_1 = b2Math_1_1;
            },
            function (b2GrowableStack_1_1) {
                b2GrowableStack_1 = b2GrowableStack_1_1;
            },
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            }
        ],
        execute: function () {
            /// A node in the dynamic tree. The client does not interact with this directly.
            b2TreeNode = class b2TreeNode {
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
            };
            exports_1("b2TreeNode", b2TreeNode);
            b2DynamicTree = class b2DynamicTree {
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
                    node.child1 = null;
                    node.child2 = null;
                    node.height = -1;
                    node.userData = null;
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
                    const grandParent = parent && parent.parent;
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
                    const B = verify(A.child1);
                    const C = verify(A.child2);
                    const balance = C.height - B.height;
                    // Rotate C up
                    if (balance > 1) {
                        const F = verify(C.child1);
                        const G = verify(C.child2);
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
                        const D = verify(B.child1);
                        const E = verify(B.child2);
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
            };
            b2DynamicTree.s_stack = new b2GrowableStack_1.b2GrowableStack(256);
            b2DynamicTree.s_r = new b2Math_1.b2Vec2();
            b2DynamicTree.s_v = new b2Math_1.b2Vec2();
            b2DynamicTree.s_abs_v = new b2Math_1.b2Vec2();
            b2DynamicTree.s_segmentAABB = new b2Collision_1.b2AABB();
            b2DynamicTree.s_subInput = new b2Collision_1.b2RayCastInput();
            b2DynamicTree.s_combinedAABB = new b2Collision_1.b2AABB();
            b2DynamicTree.s_aabb = new b2Collision_1.b2AABB();
            b2DynamicTree.s_node_id = 0;
            exports_1("b2DynamicTree", b2DynamicTree);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJEeW5hbWljVHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyRHluYW1pY1RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7SUFPRixnQkFBbUIsS0FBZTtRQUNoQyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7U0FBRTtRQUMxQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQUVELGdGQUFnRjtZQUNoRixhQUFBO2dCQVNFLFlBQVksS0FBYSxDQUFDO29CQVJuQixTQUFJLEdBQVcsQ0FBQyxDQUFDO29CQUNqQixTQUFJLEdBQVcsSUFBSSxvQkFBTSxFQUFFLENBQUM7b0JBQzVCLGFBQVEsR0FBUSxJQUFJLENBQUM7b0JBQ3JCLFdBQU0sR0FBc0IsSUFBSSxDQUFDLENBQUMsK0JBQStCO29CQUNqRSxXQUFNLEdBQXNCLElBQUksQ0FBQyxDQUFDLCtCQUErQjtvQkFDakUsV0FBTSxHQUFzQixJQUFJLENBQUMsQ0FBQywrQkFBK0I7b0JBQ2pFLFdBQU0sR0FBVyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7b0JBR3BELElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUVNLE1BQU07b0JBQ1gsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQztnQkFDOUIsQ0FBQzthQUNGLENBQUE7O1lBRUQsZ0JBQUE7Z0JBQUE7b0JBQ1MsV0FBTSxHQUFzQixJQUFJLENBQUM7b0JBRXhDLDhCQUE4QjtvQkFDOUIsNEJBQTRCO29CQUM1QiwrQkFBK0I7b0JBRXhCLGVBQVUsR0FBc0IsSUFBSSxDQUFDO29CQUVyQyxXQUFNLEdBQVcsQ0FBQyxDQUFDO29CQUVuQixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7Z0JBa3ZCdEMsQ0FBQztnQkF2dUJRLFdBQVcsQ0FBQyxLQUFpQjtvQkFD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