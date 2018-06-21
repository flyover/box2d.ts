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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCcm9hZFBoYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vQm94MkQvQ29sbGlzaW9uL2IyQnJvYWRQaGFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztFQWdCRTs7Ozs7SUFzTkYsK0JBQStCO0lBQy9CLHdCQUFrQyxLQUFnQixFQUFFLEtBQWdCO1FBQ2xFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDM0MsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztTQUM5QztRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDL0MsQ0FBQzs7Ozs7Ozs7O1lBdk5ELFNBQUE7Z0JBQ0UsWUFBbUIsTUFBcUIsRUFBUyxNQUFxQjtvQkFBbkQsV0FBTSxHQUFOLE1BQU0sQ0FBZTtvQkFBUyxXQUFNLEdBQU4sTUFBTSxDQUFlO2dCQUFHLENBQUM7YUFDM0UsQ0FBQTs7WUFFRCw0RkFBNEY7WUFDNUYseUZBQXlGO1lBQ3pGLG9GQUFvRjtZQUNwRixlQUFBO2dCQUFBO29CQUNrQixXQUFNLEdBQXFCLElBQUksNkJBQWEsRUFBSyxDQUFDO29CQUMzRCxpQkFBWSxHQUFXLENBQUMsQ0FBQztvQkFDaEMsc0NBQXNDO29CQUMvQixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDZixpQkFBWSxHQUFnQyxFQUFFLENBQUM7b0JBQy9ELHNDQUFzQztvQkFDL0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ2YsaUJBQVksR0FBcUIsRUFBRSxDQUFDO2dCQStMdEQsQ0FBQztnQkE5TEMscUNBQXFDO2dCQUVyQyxxRUFBcUU7Z0JBQ3JFLDBCQUEwQjtnQkFDbkIsV0FBVyxDQUFDLElBQVksRUFB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