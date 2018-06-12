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
System.register(["./b2DynamicTree"], function (exports_1, context_1) {
    "use strict";
    var b2DynamicTree_1, b2Pair, b2BroadPhase;
    var __moduleName = context_1 && context_1.id;
    /// This is used to sort pairs.
    function b2PairLessThan(pair1, pair2) {
        if (pair1.proxyA.m_id === pair2.proxyA.m_id) {
            return pair1.proxyB.m_id - pair2.proxyB.m_id;
        }
        return pair1.proxyA.m_id - pair2.proxyA.m_id;
    }
    exports_1("b2PairLessThan", b2PairLessThan);
    return {
        setters: [
            function (b2DynamicTree_1_1) {
                b2DynamicTree_1 = b2DynamicTree_1_1;
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
                    this.m_tree = new b2DynamicTree_1.b2DynamicTree();
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
                //   const aabbA: b2AABB = proxyA.aabb; // this.m_tree.GetFatAABB(proxyA);
                //   const aabbB: b2AABB = proxyB.aabb; // this.m_tree.GetFatAABB(proxyB);
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
                    // Reset move buffer
                    this.m_moveCount = 0;
                    // Sort the pair buffer to expose duplicates.
                    this.m_pairBuffer.length = this.m_pairCount;
                    this.m_pairBuffer.sort(b2PairLessThan);
                    // Send the pairs back to the client.
                    let i = 0;
                    while (i < this.m_pairCount) {
                        const primaryPair = this.m_pairBuffer[i];
                        const userDataA = primaryPair.proxyA.userData; // this.m_tree.GetUserData(primaryPair.proxyA);
                        const userDataB = primaryPair.proxyB.userData; // this.m_tree.GetUserData(primaryPair.proxyB);
                        callback(userDataA, userDataB);
                        ++i;
                        // Skip any duplicate pairs.
                        while (i < this.m_pairCount) {
                            const pair = this.m_pairBuffer[i];
                            if (pair.proxyA.m_id !== primaryPair.proxyA.m_id || pair.proxyB.m_id !== primaryPair.proxyB.m_id) {
                                break;
                            }
                            ++i;
                        }
                    }
                    // Try to keep the tree balanced.
                    // this.m_tree.Rebalance(4);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCcm9hZFBoYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJCcm9hZFBoYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQXNORiwrQkFBK0I7SUFDL0Isd0JBQWtDLEtBQWdCLEVBQUUsS0FBZ0I7UUFDbEUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtZQUMzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQzlDO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUMvQyxDQUFDOzs7Ozs7Ozs7WUF2TkQsU0FBQTtnQkFDRSxZQUFtQixNQUFxQixFQUFTLE1BQXFCO29CQUFuRCxXQUFNLEdBQU4sTUFBTSxDQUFlO29CQUFTLFdBQU0sR0FBTixNQUFNLENBQWU7Z0JBQUcsQ0FBQzthQUMzRSxDQUFBOztZQUVELDRGQUE0RjtZQUM1Rix5RkFBeUY7WUFDekYsb0ZBQW9GO1lBQ3BGLGVBQUE7Z0JBQUE7b0JBQ2tCLFdBQU0sR0FBcUIsSUFBSSw2QkFBYSxFQUFLLENBQUM7b0JBQzNELGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUNoQyxzQ0FBc0M7b0JBQy9CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUNmLGlCQUFZLEdBQWdDLEVBQUUsQ0FBQztvQkFDL0Qsc0NBQXNDO29CQUMvQixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDZixpQkFBWSxHQUFxQixFQUFFLENBQUM7Z0JBK0x0RCxDQUFDO2dCQTlMQyxxQ0FBcUM7Z0JBRXJDLHFFQUFxRTtnQkFDckUsMEJBQTBCO2dCQUNuQixXQUFXLENBQUMsSUFBWSxFQUFFLFFBQVc7b0JBQzFDLE1BQU0sS0FBSyxH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