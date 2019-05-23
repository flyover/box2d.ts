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
                    this._userData = null;
                    this.parent = null; // or next
                    this.child1 = null;
                    this.child2 = null;
                    this.height = 0; // leaf = 0, free node = -1
                    this.m_id = id;
                }
                get userData() {
                    if (this._userData === null) {
                        throw new Error();
                    }
                    return this._userData;
                }
                set userData(value) {
                    if (this._userData !== null) {
                        throw new Error();
                    }
                    this._userData = value;
                }
                Reset() {
                    this._userData = null;
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
                // public GetUserData(node: b2TreeNode<T>): T {
                //   // DEBUG: b2Assert(node !== null);
                //   return node.userData;
                // }
                // public GetFatAABB(node: b2TreeNode<T>): b2AABB {
                //   // DEBUG: b2Assert(node !== null);
                //   return node.aabb;
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
                    if (this.m_freeList !== null) {
                        const node = this.m_freeList;
                        this.m_freeList = node.parent; // this.m_freeList = node.next;
                        node.parent = null;
                        node.child1 = null;
                        node.child2 = null;
                        node.height = 0;
                        return node;
                    }
                    return new b2TreeNode(b2DynamicTree.s_node_id++);
                }
                FreeNode(node) {
                    node.parent = this.m_freeList; // node.next = this.m_freeList;
                    node.child1 = null;
                    node.child2 = null;
                    node.height = -1;
                    node.Reset();
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
                DestroyProxy(node) {
                    // DEBUG: b2Assert(node.IsLeaf());
                    this.RemoveLeaf(node);
                    this.FreeNode(node);
                }
                MoveProxy(node, aabb, displacement) {
                    // DEBUG: b2Assert(node.IsLeaf());
                    if (node.aabb.Contains(aabb)) {
                        return false;
                    }
                    this.RemoveLeaf(node);
                    // Extend AABB.
                    const r_x = b2Settings_1.b2_aabbExtension;
                    const r_y = b2Settings_1.b2_aabbExtension;
                    node.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
                    node.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
                    node.aabb.upperBound.x = aabb.upperBound.x + r_x;
                    node.aabb.upperBound.y = aabb.upperBound.y + r_y;
                    // Predict AABB displacement.
                    const d_x = b2Settings_1.b2_aabbMultiplier * displacement.x;
                    const d_y = b2Settings_1.b2_aabbMultiplier * displacement.y;
                    if (d_x < 0.0) {
                        node.aabb.lowerBound.x += d_x;
                    }
                    else {
                        node.aabb.upperBound.x += d_x;
                    }
                    if (d_y < 0.0) {
                        node.aabb.lowerBound.y += d_y;
                    }
                    else {
                        node.aabb.upperBound.y += d_y;
                    }
                    this.InsertLeaf(node);
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
                    let sibling = this.m_root;
                    while (!sibling.IsLeaf()) {
                        const child1 = verify(sibling.child1);
                        const child2 = verify(sibling.child2);
                        const area = sibling.aabb.GetPerimeter();
                        const combinedAABB = b2DynamicTree.s_combinedAABB;
                        combinedAABB.Combine2(sibling.aabb, leafAABB);
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
                            sibling = child1;
                        }
                        else {
                            sibling = child2;
                        }
                    }
                    // Create a parent for the siblings.
                    const oldParent = sibling.parent;
                    const newParent = this.AllocateNode();
                    newParent.parent = oldParent;
                    newParent.aabb.Combine2(leafAABB, sibling.aabb);
                    newParent.height = sibling.height + 1;
                    if (oldParent !== null) {
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
                    let node = leaf.parent;
                    while (node !== null) {
                        node = this.Balance(node);
                        const child1 = verify(node.child1);
                        const child2 = verify(node.child2);
                        node.height = 1 + b2Math_1.b2Max(child1.height, child2.height);
                        node.aabb.Combine2(child1.aabb, child2.aabb);
                        node = node.parent;
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
                    const sibling = verify(parent.child1 === leaf ? parent.child2 : parent.child1);
                    if (grandParent !== null) {
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
                        while (index !== null) {
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
                static ComputeHeightNode(node) {
                    if (node === null) {
                        return 0;
                    }
                    if (node.IsLeaf()) {
                        return 0;
                    }
                    const height1 = b2DynamicTree.ComputeHeightNode(node.child1);
                    const height2 = b2DynamicTree.ComputeHeightNode(node.child2);
                    return 1 + b2Math_1.b2Max(height1, height2);
                }
                ComputeHeight() {
                    const height = b2DynamicTree.ComputeHeightNode(this.m_root);
                    return height;
                }
                ValidateStructure(node) {
                    if (node === null) {
                        return;
                    }
                    if (node === this.m_root) {
                        // DEBUG: b2Assert(node.parent === null);
                    }
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
                ValidateMetrics(node) {
                    if (node === null) {
                        return;
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJEeW5hbWljVHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImIyRHluYW1pY1RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7O0lBUUYsU0FBUyxNQUFNLENBQUksS0FBZTtRQUNoQyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7U0FBRTtRQUMxQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBRUQsZ0ZBQWdGO1lBQ2hGLGFBQUEsTUFBYSxVQUFVO2dCQWlCckIsWUFBWSxLQUFhLENBQUM7b0JBaEJWLFNBQUksR0FBVyxDQUFDLENBQUM7b0JBQ2pCLFNBQUksR0FBVyxJQUFJLG9CQUFNLEVBQUUsQ0FBQztvQkFDcEMsY0FBUyxHQUFhLElBQUksQ0FBQztvQkFTNUIsV0FBTSxHQUF5QixJQUFJLENBQUMsQ0FBQyxVQUFVO29CQUMvQyxXQUFNLEdBQXlCLElBQUksQ0FBQztvQkFDcEMsV0FBTSxHQUF5QixJQUFJLENBQUM7b0JBQ3BDLFdBQU0sR0FBVyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7b0JBR3BELElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQWZELElBQVcsUUFBUTtvQkFDakIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJBQUU7b0JBQ25ELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDeEIsQ0FBQztnQkFDRCxJQUFXLFFBQVEsQ0FBQyxLQUFRO29CQUMxQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO3dCQUFFLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFBRTtvQkFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLENBQUM7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LENBQUM7eUJBQ2pCO3dCQUVELFNBQVM7d0JBQ1QsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUU7NEJBQ3ZCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFFaEMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsY0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzRCQUN6QyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxjQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7eUJBQzFDOzZCQUFNOzRCQUNMLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFFaEMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsY0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FB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