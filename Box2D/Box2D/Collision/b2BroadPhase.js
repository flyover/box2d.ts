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
System.register(["./b2Collision", "./b2DynamicTree"], function (exports_1, context_1) {
    "use strict";
    var b2Collision_1, b2DynamicTree_1, b2Pair, b2BroadPhase;
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
            function (b2Collision_1_1) {
                b2Collision_1 = b2Collision_1_1;
            },
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
                GetFatAABB(proxy) {
                    return this.m_tree.GetFatAABB(proxy);
                }
                /// Get user data from a proxy. Returns NULL if the id is invalid.
                GetUserData(proxy) {
                    return this.m_tree.GetUserData(proxy);
                }
                /// Test overlap of fat AABBs.
                TestOverlap(proxyA, proxyB) {
                    const aabbA = this.m_tree.GetFatAABB(proxyA);
                    const aabbB = this.m_tree.GetFatAABB(proxyB);
                    return b2Collision_1.b2TestOverlapAABB(aabbA, aabbB);
                }
                /// Get the number of proxies.
                GetProxyCount() {
                    return this.m_proxyCount;
                }
                /// Update the pairs. This results in pair callbacks. This can only add pairs.
                UpdatePairs(contactManager) {
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
                        const fatAABB = this.m_tree.GetFatAABB(queryProxy);
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
                        const userDataA = this.m_tree.GetUserData(primaryPair.proxyA);
                        const userDataB = this.m_tree.GetUserData(primaryPair.proxyB);
                        contactManager.AddPair(userDataA, userDataB);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCcm9hZFBoYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJCcm9hZFBoYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7OztJQXdORiwrQkFBK0I7SUFDL0Isd0JBQStCLEtBQWEsRUFBRSxLQUFhO1FBQ3pELElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7WUFDM0MsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztTQUM5QztRQUVELE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDL0MsQ0FBQzs7Ozs7Ozs7Ozs7O1lBdk5ELFNBQUE7Z0JBQ0UsWUFBbUIsTUFBa0IsRUFBUyxNQUFrQjtvQkFBN0MsV0FBTSxHQUFOLE1BQU0sQ0FBWTtvQkFBUyxXQUFNLEdBQU4sTUFBTSxDQUFZO2dCQUFHLENBQUM7YUFDckUsQ0FBQTs7WUFFRCw0RkFBNEY7WUFDNUYseUZBQXlGO1lBQ3pGLG9GQUFvRjtZQUNwRixlQUFBO2dCQUFBO29CQUNrQixXQUFNLEdBQWtCLElBQUksNkJBQWEsRUFBRSxDQUFDO29CQUNyRCxpQkFBWSxHQUFXLENBQUMsQ0FBQztvQkFDaEMsc0NBQXNDO29CQUMvQixnQkFBVyxHQUFXLENBQUMsQ0FBQztvQkFDeEIsaUJBQVksR0FBNkIsRUFBRSxDQUFDO29CQUNuRCxzQ0FBc0M7b0JBQy9CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixpQkFBWSxHQUFhLEVBQUUsQ0FBQztnQkErTHJDLENBQUM7Z0JBOUxDLHFDQUFxQztnQkFFckMscUVBQXFFO2dCQUNyRSwwQkFBMEI7Z0JBQ25CLFdBQVcsQ0FBQyxJQUFZLEVBQUUsUUFBYTtvQkFDNUMsTUFBTSxLQUFL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