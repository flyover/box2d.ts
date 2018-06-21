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
    var b2Settings_1, b2Math_1, b2GrowableStack_1, b2Collision_1, b2TreeNode, b2DynamicTree;
    var __moduleName = context_1 && context_1.id;
    function verify(value) {
        if (value === null) {
            throw new Error();
        }
        return value;
    }
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
                    this.parent = null; // or next
                    this.child1 = null;
                    this.child2 = null;
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
                    this.m_stack = new b2GrowableStack_1.b2GrowableStack(256);
                }
                // public GetUserData(proxy: b2TreeNode<T>): any {
                //   // DEBUG: b2Assert(proxy !== null);
                //   return proxy.userData;
                // }
                // public GetFatAABB(proxy: b2TreeNode<T>): b2AABB {
                //   // DEBUG: b2Assert(proxy !== null);
                //   return proxy.aabb;
                // }
                Query(aabb, callback) {
                    if (this.m_root === null) {
                        return;
                    }
                    const stack = this.m_stack.Reset();
                    stack.Push(this.m_root);
                    while (stack.GetCount() > 0) {
                        const node = stack.Pop();
                        // if (node === null) {
                        //   continue;
                        // }
                        if (node.aabb.TestOverlap(aabb)) {
                            if (node.IsLeaf()) {
                                const proceed = callback(node);
                                if (!proceed) {
                                    return;
                                }
                            }
                            else {
                                stack.Push(verify(node.child1));
                                stack.Push(verify(node.child2));
                            }
                        }
                    }
                }
                QueryPoint(point, callback) {
                    if (this.m_root === null) {
                        return;
                    }
                    const stack = this.m_stack.Reset();
                    stack.Push(this.m_root);
                    while (stack.GetCount() > 0) {
                        const node = stack.Pop();
                        // if (node === null) {
                        //   continue;
                        // }
                        if (node.aabb.TestContain(point)) {
                            if (node.IsLeaf()) {
                                const proceed = callback(node);
                                if (!proceed) {
                                    return;
                                }
                            }
                            else {
                                stack.Push(verify(node.child1));
                                stack.Push(verify(node.child2));
                            }
                        }
                    }
                }
                RayCast(input, callback) {
                    if (this.m_root === null) {
                        return;
                    }
                    const p1 = input.p1;
                    const p2 = input.p2;
                    const r = b2Math_1.b2Vec2.SubVV(p2, p1, b2DynamicTree.s_r);
                    // DEBUG: b2Assert(r.LengthSquared() > 0);
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
                    const stack = this.m_stack.Reset();
                    stack.Push(this.m_root);
                    while (stack.GetCount() > 0) {
                        const node = stack.Pop();
                        // if (node === null) {
                        //   continue;
                        // }
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
                            stack.Push(verify(node.child1));
                            stack.Push(verify(node.child2));
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
                        delete node.userData; // = null;
                        return node;
                    }
                    return new b2TreeNode(b2DynamicTree.s_node_id++);
                }
                FreeNode(node) {
                    node.parent = this.m_freeList; // node.next = this.m_freeList;
                    node.child1 = null;
                    node.child2 = null;
                    node.height = -1;
                    delete node.userData; // = null;
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
                    // DEBUG: b2Assert(proxy.IsLeaf());
                    this.RemoveLeaf(proxy);
                    this.FreeNode(proxy);
                }
                MoveProxy(proxy, aabb, displacement) {
                    // DEBUG: b2Assert(proxy.IsLeaf());
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
                    while (!index.IsLeaf()) {
                        const child1 = verify(index.child1);
                        const child2 = verify(index.child2);
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
                    delete newParent.userData; // = null;
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
                    let index2 = leaf.parent;
                    while (index2 !== null) {
                        index2 = this.Balance(index2);
                        const child1 = verify(index2.child1);
                        const child2 = verify(index2.child2);
                        index2.height = 1 + b2Math_1.b2Max(child1.height, child2.height);
                        index2.aabb.Combine2(child1.aabb, child2.aabb);
                        index2 = index2.parent;
                    }
                    // this.Validate();
                }
                RemoveLeaf(leaf) {
                    if (leaf === this.m_root) {
                        this.m_root = null;
                        return;
                    }
                    const parent = verify(leaf.parent);
                    const grandParent = parent && parent.parent;
                    let sibling;
                    if (parent.child1 === leaf) {
                        sibling = verify(parent.child2);
                    }
                    else {
                        sibling = verify(parent.child1);
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
                            const child1 = verify(index.child1);
                            const child2 = verify(index.child2);
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
                    // DEBUG: b2Assert(A !== null);
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
                                // DEBUG: b2Assert(C.parent.child2 === A);
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
                                // DEBUG: b2Assert(B.parent.child2 === A);
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
                      const b2TreeNode<T>* node = m_nodes + i;
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
                    if (!node || node.IsLeaf()) {
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
                        // DEBUG: b2Assert(index.parent === null);
                    }
                    const node = index;
                    if (node.IsLeaf()) {
                        // DEBUG: b2Assert(node.child1 === null);
                        // DEBUG: b2Assert(node.child2 === null);
                        // DEBUG: b2Assert(node.height === 0);
                        return;
                    }
                    const child1 = verify(node.child1);
                    const child2 = verify(node.child2);
                    // DEBUG: b2Assert(child1.parent === index);
                    // DEBUG: b2Assert(child2.parent === index);
                    this.ValidateStructure(child1);
                    this.ValidateStructure(child2);
                }
                ValidateMetrics(index) {
                    if (index === null) {
                        return;
                    }
                    const node = index;
                    if (node.IsLeaf()) {
                        // DEBUG: b2Assert(node.child1 === null);
                        // DEBUG: b2Assert(node.child2 === null);
                        // DEBUG: b2Assert(node.height === 0);
                        return;
                    }
                    const child1 = verify(node.child1);
                    const child2 = verify(node.child2);
                    // DEBUG: const height1: number = child1.height;
                    // DEBUG: const height2: number = child2.height;
                    // DEBUG: const height: number = 1 + b2Max(height1, height2);
                    // DEBUG: b2Assert(node.height === height);
                    const aabb = b2DynamicTree.s_aabb;
                    aabb.Combine2(child1.aabb, child2.aabb);
                    // DEBUG: b2Assert(aabb.lowerBound === node.aabb.lowerBound);
                    // DEBUG: b2Assert(aabb.upperBound === node.aabb.upperBound);
                    this.ValidateMetrics(child1);
                    this.ValidateMetrics(child2);
                }
                Validate() {
                    // DEBUG: this.ValidateStructure(this.m_root);
                    // DEBUG: this.ValidateMetrics(this.m_root);
                    // let freeCount: number = 0;
                    // let freeIndex: b2TreeNode<T> | null = this.m_freeList;
                    // while (freeIndex !== null) {
                    //   freeIndex = freeIndex.parent; // freeIndex = freeIndex.next;
                    //   ++freeCount;
                    // }
                    // DEBUG: b2Assert(this.GetHeight() === this.ComputeHeight());
                    // b2Assert(this.m_nodeCount + freeCount === this.m_nodeCapacity);
                }
                static GetMaxBalanceNode(node, maxBalance) {
                    if (node === null) {
                        return maxBalance;
                    }
                    if (node.height <= 1) {
                        return maxBalance;
                    }
                    // DEBUG: b2Assert(!node.IsLeaf());
                    const child1 = verify(node.child1);
                    const child2 = verify(node.child2);
                    const balance = b2Math_1.b2Abs(child2.height - child1.height);
                    return b2Math_1.b2Max(maxBalance, balance);
                }
                GetMaxBalance() {
                    const maxBalance = b2DynamicTree.GetMaxBalanceNode(this.m_root, 0);
                    /*
                    int32 maxBalance = 0;
                    for (int32 i = 0; i < m_nodeCapacity; ++i) {
                      const b2TreeNode<T>* node = m_nodes + i;
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
                      b2TreeNode<T>* child1 = m_nodes + index1;
                      b2TreeNode<T>* child2 = m_nodes + index2;
                
                      int32 parentIndex = AllocateNode();
                      b2TreeNode<T>* parent = m_nodes + parentIndex;
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
                    // DEBUG: b2Assert(!node.IsLeaf());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJEeW5hbWljVHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0JveDJEL0NvbGxpc2lvbi9iMkR5bmFtaWNUcmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQVFGLGdCQUFtQixLQUFlO1FBQ2hDLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztTQUFFO1FBQzFDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFRCxnRkFBZ0Y7WUFDaEYsYUFBQTtnQkFTRSxZQUFZLEtBQWEsQ0FBQztvQkFSbkIsU0FBSSxHQUFXLENBQUMsQ0FBQztvQkFDUixTQUFJLEdBQVcsSUFBSSxvQkFBTSxFQUFFLENBQUM7b0JBRXJDLFdBQU0sR0FBeUIsSUFBSSxDQUFDLENBQUMsVUFBVTtvQkFDL0MsV0FBTSxHQUF5QixJQUFJLENBQUM7b0JBQ3BDLFdBQU0sR0FBeUIsSUFBSSxDQUFDO29CQUNwQyxXQUFNLEdBQVcsQ0FBQyxDQUFDLENBQUMsMkJBQTJCO29CQUdwRCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDakIsQ0FBQztnQkFFTSxNQUFNO29CQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUM7Z0JBQzlCLENBQUM7YUFDRixDQUFBOztZQUVELGdCQUFBO2dCQUFBO29CQUNTLFdBQU0sR0FBeUIsSUFBSSxDQUFDO29CQUUzQyw4QkFBOEI7b0JBQzlCLDRCQUE0QjtvQkFDNUIsK0JBQStCO29CQUV4QixlQUFVLEdBQXlCLElBQUksQ0FBQztvQkFFeEMsV0FBTSxHQUFXLENBQUMsQ0FBQztvQkFFbkIscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO29CQUVwQixZQUFPLEdBQUcsSUFBSSxpQ0FBZSxDQUFnQixHQUFHLENBQUMsQ0FBQztnQkF1d0JwRSxDQUFDO2dCQTl2QkMs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