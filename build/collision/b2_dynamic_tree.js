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
System.register(["../common/b2_settings.js", "../common/b2_math.js", "../common/b2_growable_stack.js", "./b2_collision.js"], function (exports_1, context_1) {
    "use strict";
    var b2_settings_js_1, b2_math_js_1, b2_growable_stack_js_1, b2_collision_js_1, b2TreeNode, b2DynamicTree;
    var __moduleName = context_1 && context_1.id;
    function verify(value) {
        if (value === null) {
            throw new Error();
        }
        return value;
    }
    return {
        setters: [
            function (b2_settings_js_1_1) {
                b2_settings_js_1 = b2_settings_js_1_1;
            },
            function (b2_math_js_1_1) {
                b2_math_js_1 = b2_math_js_1_1;
            },
            function (b2_growable_stack_js_1_1) {
                b2_growable_stack_js_1 = b2_growable_stack_js_1_1;
            },
            function (b2_collision_js_1_1) {
                b2_collision_js_1 = b2_collision_js_1_1;
            }
        ],
        execute: function () {
            /// A node in the dynamic tree. The client does not interact with this directly.
            b2TreeNode = class b2TreeNode {
                constructor(id = 0) {
                    this.m_id = 0;
                    this.aabb = new b2_collision_js_1.b2AABB();
                    this._userData = null;
                    this.parent = null; // or next
                    this.child1 = null;
                    this.child2 = null;
                    this.height = 0; // leaf = 0, free node = -1
                    this.moved = false;
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
                    this.m_stack = new b2_growable_stack_js_1.b2GrowableStack(256);
                }
                // public GetUserData(node: b2TreeNode<T>): T {
                //   // DEBUG: b2Assert(node !== null);
                //   return node.userData;
                // }
                // public WasMoved(node: b2TreeNode<T>): boolean {
                //   return node.moved;
                // }
                // public ClearMoved(node: b2TreeNode<T>): void {
                //   node.moved = false;
                // }
                // public GetFatAABB(node: b2TreeNode<T>): b2AABB {
                //   // DEBUG: b2Assert(node !== null);
                //   return node.aabb;
                // }
                Query(aabb, callback) {
                    const stack = this.m_stack.Reset();
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
                QueryPoint(point, callback) {
                    const stack = this.m_stack.Reset();
                    stack.Push(this.m_root);
                    while (stack.GetCount() > 0) {
                        const node = stack.Pop();
                        if (node === null) {
                            continue;
                        }
                        if (node.aabb.TestContain(point)) {
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
                RayCast(input, callback) {
                    const p1 = input.p1;
                    const p2 = input.p2;
                    const r = b2_math_js_1.b2Vec2.SubVV(p2, p1, b2DynamicTree.s_r);
                    // DEBUG: b2Assert(r.LengthSquared() > 0);
                    r.Normalize();
                    // v is perpendicular to the segment.
                    const v = b2_math_js_1.b2Vec2.CrossOneV(r, b2DynamicTree.s_v);
                    const abs_v = b2_math_js_1.b2Vec2.AbsV(v, b2DynamicTree.s_abs_v);
                    // Separating axis for segment (Gino, p80).
                    // |dot(v, p1 - c)| > dot(|v|, h)
                    let maxFraction = input.maxFraction;
                    // Build a bounding box for the segment.
                    const segmentAABB = b2DynamicTree.s_segmentAABB;
                    let t_x = p1.x + maxFraction * (p2.x - p1.x);
                    let t_y = p1.y + maxFraction * (p2.y - p1.y);
                    segmentAABB.lowerBound.x = b2_math_js_1.b2Min(p1.x, t_x);
                    segmentAABB.lowerBound.y = b2_math_js_1.b2Min(p1.y, t_y);
                    segmentAABB.upperBound.x = b2_math_js_1.b2Max(p1.x, t_x);
                    segmentAABB.upperBound.y = b2_math_js_1.b2Max(p1.y, t_y);
                    const stack = this.m_stack.Reset();
                    stack.Push(this.m_root);
                    while (stack.GetCount() > 0) {
                        const node = stack.Pop();
                        if (node === null) {
                            continue;
                        }
                        if (!b2_collision_js_1.b2TestOverlapAABB(node.aabb, segmentAABB)) {
                            continue;
                        }
                        // Separating axis for segment (Gino, p80).
                        // |dot(v, p1 - c)| > dot(|v|, h)
                        const c = node.aabb.GetCenter();
                        const h = node.aabb.GetExtents();
                        const separation = b2_math_js_1.b2Abs(b2_math_js_1.b2Vec2.DotVV(v, b2_math_js_1.b2Vec2.SubVV(p1, c, b2_math_js_1.b2Vec2.s_t0))) - b2_math_js_1.b2Vec2.DotVV(abs_v, h);
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
                                segmentAABB.lowerBound.x = b2_math_js_1.b2Min(p1.x, t_x);
                                segmentAABB.lowerBound.y = b2_math_js_1.b2Min(p1.y, t_y);
                                segmentAABB.upperBound.x = b2_math_js_1.b2Max(p1.x, t_x);
                                segmentAABB.upperBound.y = b2_math_js_1.b2Max(p1.y, t_y);
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
                    if (this.m_freeList !== null) {
                        const node = this.m_freeList;
                        this.m_freeList = node.parent; // this.m_freeList = node.next;
                        node.parent = null;
                        node.child1 = null;
                        node.child2 = null;
                        node.height = 0;
                        node.moved = false;
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
                    const r_x = b2_settings_js_1.b2_aabbExtension;
                    const r_y = b2_settings_js_1.b2_aabbExtension;
                    node.aabb.lowerBound.x = aabb.lowerBound.x - r_x;
                    node.aabb.lowerBound.y = aabb.lowerBound.y - r_y;
                    node.aabb.upperBound.x = aabb.upperBound.x + r_x;
                    node.aabb.upperBound.y = aabb.upperBound.y + r_y;
                    node.userData = userData;
                    node.height = 0;
                    node.moved = true;
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
                    // Extend AABB
                    const fatAABB = b2DynamicTree.MoveProxy_s_fatAABB;
                    const r_x = b2_settings_js_1.b2_aabbExtension;
                    const r_y = b2_settings_js_1.b2_aabbExtension;
                    fatAABB.lowerBound.x = aabb.lowerBound.x - r_x;
                    fatAABB.lowerBound.y = aabb.lowerBound.y - r_y;
                    fatAABB.upperBound.x = aabb.upperBound.x + r_x;
                    fatAABB.upperBound.y = aabb.upperBound.y + r_y;
                    // Predict AABB movement
                    const d_x = b2_settings_js_1.b2_aabbMultiplier * displacement.x;
                    const d_y = b2_settings_js_1.b2_aabbMultiplier * displacement.y;
                    if (d_x < 0.0) {
                        fatAABB.lowerBound.x += d_x;
                    }
                    else {
                        fatAABB.upperBound.x += d_x;
                    }
                    if (d_y < 0.0) {
                        fatAABB.lowerBound.y += d_y;
                    }
                    else {
                        fatAABB.upperBound.y += d_y;
                    }
                    const treeAABB = node.aabb; // m_nodes[proxyId].aabb;
                    if (treeAABB.Contains(aabb)) {
                        // The tree AABB still contains the object, but it might be too large.
                        // Perhaps the object was moving fast but has since gone to sleep.
                        // The huge AABB is larger than the new fat AABB.
                        const hugeAABB = b2DynamicTree.MoveProxy_s_hugeAABB;
                        hugeAABB.lowerBound.x = fatAABB.lowerBound.x - 4.0 * r_x;
                        hugeAABB.lowerBound.y = fatAABB.lowerBound.y - 4.0 * r_y;
                        hugeAABB.upperBound.x = fatAABB.upperBound.x + 4.0 * r_x;
                        hugeAABB.upperBound.y = fatAABB.upperBound.y + 4.0 * r_y;
                        if (hugeAABB.Contains(treeAABB)) {
                            // The tree AABB contains the object AABB and the tree AABB is
                            // not too large. No tree update needed.
                            return false;
                        }
                        // Otherwise the tree AABB is huge and needs to be shrunk
                    }
                    this.RemoveLeaf(node);
                    node.aabb.Copy(fatAABB); // m_nodes[proxyId].aabb = fatAABB;
                    this.InsertLeaf(node);
                    node.moved = true;
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
                        node.height = 1 + b2_math_js_1.b2Max(child1.height, child2.height);
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
                            index.height = 1 + b2_math_js_1.b2Max(child1.height, child2.height);
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
                            A.height = 1 + b2_math_js_1.b2Max(B.height, G.height);
                            C.height = 1 + b2_math_js_1.b2Max(A.height, F.height);
                        }
                        else {
                            C.child2 = G;
                            A.child2 = F;
                            F.parent = A;
                            A.aabb.Combine2(B.aabb, F.aabb);
                            C.aabb.Combine2(A.aabb, G.aabb);
                            A.height = 1 + b2_math_js_1.b2Max(B.height, F.height);
                            C.height = 1 + b2_math_js_1.b2Max(A.height, G.height);
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
                            A.height = 1 + b2_math_js_1.b2Max(C.height, E.height);
                            B.height = 1 + b2_math_js_1.b2Max(A.height, D.height);
                        }
                        else {
                            B.child2 = E;
                            A.child1 = D;
                            D.parent = A;
                            A.aabb.Combine2(C.aabb, D.aabb);
                            B.aabb.Combine2(A.aabb, E.aabb);
                            A.height = 1 + b2_math_js_1.b2Max(C.height, D.height);
                            B.height = 1 + b2_math_js_1.b2Max(A.height, E.height);
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
                    return 1 + b2_math_js_1.b2Max(height1, height2);
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
                    const balance = b2_math_js_1.b2Abs(child2.height - child1.height);
                    return b2_math_js_1.b2Max(maxBalance, balance);
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
            exports_1("b2DynamicTree", b2DynamicTree);
            b2DynamicTree.s_r = new b2_math_js_1.b2Vec2();
            b2DynamicTree.s_v = new b2_math_js_1.b2Vec2();
            b2DynamicTree.s_abs_v = new b2_math_js_1.b2Vec2();
            b2DynamicTree.s_segmentAABB = new b2_collision_js_1.b2AABB();
            b2DynamicTree.s_subInput = new b2_collision_js_1.b2RayCastInput();
            b2DynamicTree.s_combinedAABB = new b2_collision_js_1.b2AABB();
            b2DynamicTree.s_aabb = new b2_collision_js_1.b2AABB();
            b2DynamicTree.s_node_id = 0;
            b2DynamicTree.MoveProxy_s_fatAABB = new b2_collision_js_1.b2AABB();
            b2DynamicTree.MoveProxy_s_hugeAABB = new b2_collision_js_1.b2AABB();
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfZHluYW1pY190cmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbGxpc2lvbi9iMl9keW5hbWljX3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7Ozs7O0lBUUYsU0FBUyxNQUFNLENBQUksS0FBZTtRQUNoQyxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7U0FBRTtRQUMxQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBRUQsZ0ZBQWdGO1lBQ2hGLGFBQUEsTUFBYSxVQUFVO2dCQW1CckIsWUFBWSxLQUFhLENBQUM7b0JBbEJWLFNBQUksR0FBVyxDQUFDLENBQUM7b0JBQ2pCLFNBQUksR0FBVyxJQUFJLHdCQUFNLEVBQUUsQ0FBQztvQkFDcEMsY0FBUyxHQUFhLElBQUksQ0FBQztvQkFTNUIsV0FBTSxHQUF5QixJQUFJLENBQUMsQ0FBQyxVQUFVO29CQUMvQyxXQUFNLEdBQXlCLElBQUksQ0FBQztvQkFDcEMsV0FBTSxHQUF5QixJQUFJLENBQUM7b0JBQ3BDLFdBQU0sR0FBVyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7b0JBRS9DLFVBQUssR0FBWSxLQUFLLENBQUM7b0JBRzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQWpCRCxJQUFXLFFBQVE7b0JBQ2pCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLEVBQUU7d0JBQUUsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO3FCQUFFO29CQUNuRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQ0QsSUFBVyxRQUFRLENBQUMsS0FBUTtvQkFDMUIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTt3QkFBRSxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7cUJB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