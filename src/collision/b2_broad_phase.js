/*
* Copyright (c) 2006-2009 Erin Catto http://www.box2d.org
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
System.register(["./b2_dynamic_tree.js"], function (exports_1, context_1) {
    "use strict";
    var b2_dynamic_tree_js_1, b2Pair, b2BroadPhase;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (b2_dynamic_tree_js_1_1) {
                b2_dynamic_tree_js_1 = b2_dynamic_tree_js_1_1;
            }
        ],
        execute: function () {
            b2Pair = class b2Pair {
                constructor(proxyA, proxyB) {
                    this.proxyA = proxyA;
                    this.proxyB = proxyB;
                }
            };
            exports_1("b2Pair", b2Pair);
            /// The broad-phase is used for computing pairs and performing volume queries and ray casts.
            /// This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
            /// It is up to the client to consume the new pairs and to track subsequent overlap.
            b2BroadPhase = class b2BroadPhase {
                constructor() {
                    this.m_tree = new b2_dynamic_tree_js_1.b2DynamicTree();
                    this.m_proxyCount = 0;
                    // public m_moveCapacity: number = 16;
                    this.m_moveCount = 0;
                    this.m_moveBuffer = [];
                    // public m_pairCapacity: number = 16;
                    this.m_pairCount = 0;
                    this.m_pairBuffer = [];
                }
                // public m_queryProxyId: number = 0;
                /// Create a proxy with an initial AABB. Pairs are not reported until
                /// UpdatePairs is called.
                CreateProxy(aabb, userData) {
                    const proxy = this.m_tree.CreateProxy(aabb, userData);
                    ++this.m_proxyCount;
                    this.BufferMove(proxy);
                    return proxy;
                }
                /// Destroy a proxy. It is up to the client to remove any pairs.
                DestroyProxy(proxy) {
                    this.UnBufferMove(proxy);
                    --this.m_proxyCount;
                    this.m_tree.DestroyProxy(proxy);
                }
                /// Call MoveProxy as many times as you like, then when you are done
                /// call UpdatePairs to finalized the proxy pairs (for your time step).
                MoveProxy(proxy, aabb, displacement) {
                    const buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
                    if (buffer) {
                        this.BufferMove(proxy);
                    }
                }
                /// Call to trigger a re-processing of it's pairs on the next call to UpdatePairs.
                TouchProxy(proxy) {
                    this.BufferMove(proxy);
                }
                /// Get the fat AABB for a proxy.
                // public GetFatAABB(proxy: b2TreeNode<T>): b2AABB {
                //   return this.m_tree.GetFatAABB(proxy);
                // }
                /// Get user data from a proxy. Returns NULL if the id is invalid.
                // public GetUserData(proxy: b2TreeNode<T>): T {
                //   return this.m_tree.GetUserData(proxy);
                // }
                /// Test overlap of fat AABBs.
                // public TestOverlap(proxyA: b2TreeNode<T>, proxyB: b2TreeNode<T>): boolean {
                //   const aabbA: b2AABB = this.m_tree.GetFatAABB(proxyA);
                //   const aabbB: b2AABB = this.m_tree.GetFatAABB(proxyB);
                //   return b2TestOverlapAABB(aabbA, aabbB);
                // }
                /// Get the number of proxies.
                GetProxyCount() {
                    return this.m_proxyCount;
                }
                /// Update the pairs. This results in pair callbacks. This can only add pairs.
                UpdatePairs(callback) {
                    // Reset pair buffer
                    this.m_pairCount = 0;
                    // Perform tree queries for all moving proxies.
                    for (let i = 0; i < this.m_moveCount; ++i) {
                        const queryProxy = this.m_moveBuffer[i];
                        if (queryProxy === null) {
                            continue;
                        }
                        // This is called from box2d.b2DynamicTree::Query when we are gathering pairs.
                        // boolean b2BroadPhase::QueryCallback(int32 proxyId);
                        // We have to query the tree with the fat AABB so that
                        // we don't fail to create a pair that may touch later.
                        const fatAABB = queryProxy.aabb; // this.m_tree.GetFatAABB(queryProxy);
                        // Query tree, create pairs and add them pair buffer.
                        this.m_tree.Query(fatAABB, (proxy) => {
                            // A proxy cannot form a pair with itself.
                            if (proxy.m_id === queryProxy.m_id) {
                                return true;
                            }
                            const moved = proxy.moved; // this.m_tree.WasMoved(proxy);
                            if (moved && proxy.m_id > queryProxy.m_id) {
                                // Both proxies are moving. Avoid duplicate pairs.
                                return true;
                            }
                            // const proxyA = proxy < queryProxy ? proxy : queryProxy;
                            // const proxyB = proxy >= queryProxy ? proxy : queryProxy;
                            let proxyA;
                            let proxyB;
                            if (proxy.m_id < queryProxy.m_id) {
                                proxyA = proxy;
                                proxyB = queryProxy;
                            }
                            else {
                                proxyA = queryProxy;
                                proxyB = proxy;
                            }
                            // Grow the pair buffer as needed.
                            if (this.m_pairCount === this.m_pairBuffer.length) {
                                this.m_pairBuffer[this.m_pairCount] = new b2Pair(proxyA, proxyB);
                            }
                            else {
                                const pair = this.m_pairBuffer[this.m_pairCount];
                                pair.proxyA = proxyA;
                                pair.proxyB = proxyB;
                            }
                            ++this.m_pairCount;
                            return true;
                        });
                    }
                    // Send pairs to caller
                    for (let i = 0; i < this.m_pairCount; ++i) {
                        const primaryPair = this.m_pairBuffer[i];
                        const userDataA = primaryPair.proxyA.userData; // this.m_tree.GetUserData(primaryPair.proxyA);
                        const userDataB = primaryPair.proxyB.userData; // this.m_tree.GetUserData(primaryPair.proxyB);
                        callback(userDataA, userDataB);
                    }
                    // Clear move flags
                    for (let i = 0; i < this.m_moveCount; ++i) {
                        const proxy = this.m_moveBuffer[i];
                        if (proxy === null) {
                            continue;
                        }
                        proxy.moved = false; // this.m_tree.ClearMoved(proxy);
                    }
                    // Reset move buffer
                    this.m_moveCount = 0;
                }
                /// Query an AABB for overlapping proxies. The callback class
                /// is called for each proxy that overlaps the supplied AABB.
                Query(aabb, callback) {
                    this.m_tree.Query(aabb, callback);
                }
                QueryPoint(point, callback) {
                    this.m_tree.QueryPoint(point, callback);
                }
                /// Ray-cast against the proxies in the tree. This relies on the callback
                /// to perform a exact ray-cast in the case were the proxy contains a shape.
                /// The callback also performs the any collision filtering. This has performance
                /// roughly equal to k * log(n), where k is the number of collisions and n is the
                /// number of proxies in the tree.
                /// @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
                /// @param callback a callback class that is called for each proxy that is hit by the ray.
                RayCast(input, callback) {
                    this.m_tree.RayCast(input, callback);
                }
                /// Get the height of the embedded tree.
                GetTreeHeight() {
                    return this.m_tree.GetHeight();
                }
                /// Get the balance of the embedded tree.
                GetTreeBalance() {
                    return this.m_tree.GetMaxBalance();
                }
                /// Get the quality metric of the embedded tree.
                GetTreeQuality() {
                    return this.m_tree.GetAreaRatio();
                }
                /// Shift the world origin. Useful for large worlds.
                /// The shift formula is: position -= newOrigin
                /// @param newOrigin the new origin with respect to the old origin
                ShiftOrigin(newOrigin) {
                    this.m_tree.ShiftOrigin(newOrigin);
                }
                BufferMove(proxy) {
                    this.m_moveBuffer[this.m_moveCount] = proxy;
                    ++this.m_moveCount;
                }
                UnBufferMove(proxy) {
                    const i = this.m_moveBuffer.indexOf(proxy);
                    this.m_moveBuffer[i] = null;
                }
            };
            exports_1("b2BroadPhase", b2BroadPhase);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJfYnJvYWRfcGhhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiMl9icm9hZF9waGFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7Ozs7Ozs7O1lBTUYsU0FBQSxNQUFhLE1BQU07Z0JBQ2pCLFlBQW1CLE1BQXFCLEVBQVMsTUFBcUI7b0JBQW5ELFdBQU0sR0FBTixNQUFNLENBQWU7b0JBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBZTtnQkFBSSxDQUFDO2FBQzVFLENBQUE7O1lBRUQsNEZBQTRGO1lBQzVGLHlGQUF5RjtZQUN6RixvRkFBb0Y7WUFDcEYsZUFBQSxNQUFhLFlBQVk7Z0JBQXpCO29CQUNrQixXQUFNLEdBQXFCLElBQUksa0NBQWEsRUFBSyxDQUFDO29CQUMzRCxpQkFBWSxHQUFXLENBQUMsQ0FBQztvQkFDaEMsc0NBQXNDO29CQUMvQixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDZixpQkFBWSxHQUFnQyxFQUFFLENBQUM7b0JBQy9ELHNDQUFzQztvQkFDL0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ2YsaUJBQVksR0FBcUIsRUFBRSxDQUFDO2dCQTZMdEQsQ0FBQztnQkE1TEMscUNBQXFDO2dCQUVyQyxxRUFBcUU7Z0JBQ3JFLDBCQUEwQjtnQkFDbkIsV0FBVyxDQUFDLElBQVksRUFBRSxRQUFXO29CQUMxQyxNQUFNLEtBQUssR0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNyRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3ZCLE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUM7Z0JBRUQsZ0VBQWdFO2dCQUN6RCxZQUFZLENBQUMsS0FBb0I7b0JBQ3RDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7b0JB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