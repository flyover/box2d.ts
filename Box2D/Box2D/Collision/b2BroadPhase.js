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
    var __moduleName = context_1 && context_1.id;
    /// This is used to sort pairs.
    function b2PairLessThan(pair1, pair2) {
        if (pair1.proxyA.m_id === pair2.proxyA.m_id) {
            return pair1.proxyB.m_id - pair2.proxyB.m_id;
        }
        return pair1.proxyA.m_id - pair2.proxyA.m_id;
    }
    exports_1("b2PairLessThan", b2PairLessThan);
    var b2Collision_1, b2DynamicTree_1, b2Pair, b2BroadPhase;
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
                constructor() {
                    this.proxyA = null;
                    this.proxyB = null;
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
                        const that = this;
                        // This is called from box2d.b2DynamicTree::Query when we are gathering pairs.
                        // boolean b2BroadPhase::QueryCallback(int32 proxyId);
                        const QueryCallback = function (proxy) {
                            // A proxy cannot form a pair with itself.
                            if (proxy.m_id === queryProxy.m_id) {
                                return true;
                            }
                            // Grow the pair buffer as needed.
                            if (that.m_pairCount === that.m_pairBuffer.length) {
                                that.m_pairBuffer[that.m_pairCount] = new b2Pair();
                            }
                            const pair = that.m_pairBuffer[that.m_pairCount];
                            // pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
                            // pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;
                            if (proxy.m_id < queryProxy.m_id) {
                                pair.proxyA = proxy;
                                pair.proxyB = queryProxy;
                            }
                            else {
                                pair.proxyA = queryProxy;
                                pair.proxyB = proxy;
                            }
                            ++that.m_pairCount;
                            return true;
                        };
                        // We have to query the tree with the fat AABB so that
                        // we don't fail to create a pair that may touch later.
                        const fatAABB = this.m_tree.GetFatAABB(queryProxy);
                        // Query tree, create pairs and add them pair buffer.
                        this.m_tree.Query(QueryCallback, fatAABB);
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
                Query(callback, aabb) {
                    this.m_tree.Query(callback, aabb);
                }
                /// Ray-cast against the proxies in the tree. This relies on the callback
                /// to perform a exact ray-cast in the case were the proxy contains a shape.
                /// The callback also performs the any collision filtering. This has performance
                /// roughly equal to k * log(n), where k is the number of collisions and n is the
                /// number of proxies in the tree.
                /// @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
                /// @param callback a callback class that is called for each proxy that is hit by the ray.
                RayCast(callback, input) {
                    this.m_tree.RayCast(callback, input);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJCcm9hZFBoYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYjJCcm9hZFBoYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0VBZ0JFOzs7O0lBaU5GLCtCQUErQjtJQUMvQix3QkFBK0IsS0FBYSxFQUFFLEtBQWE7UUFDekQsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtZQUMzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQzlDO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUMvQyxDQUFDOzs7Ozs7Ozs7Ozs7O1lBak5ELFNBQUE7Z0JBQUE7b0JBQ1MsV0FBTSxHQUFvQixJQUFJLENBQUM7b0JBQy9CLFdBQU0sR0FBb0IsSUFBSSxDQUFDO2dCQUN4QyxDQUFDO2FBQUEsQ0FBQTs7WUFFRCw0RkFBNEY7WUFDNUYseUZBQXlGO1lBQ3pGLG9GQUFvRjtZQUNwRixlQUFBO2dCQUFBO29CQUNTLFdBQU0sR0FBa0IsSUFBSSw2QkFBYSxFQUFFLENBQUM7b0JBQzVDLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO29CQUNoQyxzQ0FBc0M7b0JBQy9CLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO29CQUN4QixpQkFBWSxHQUFpQixFQUFFLENBQUM7b0JBQ3ZDLHNDQUFzQztvQkFDL0IsZ0JBQVcsR0FBVyxDQUFDLENBQUM7b0JBQ3hCLGlCQUFZLEdBQWEsRUFBRSxDQUFDO2dCQXdMckMsQ0FBQztnQkF2TEMscUNBQXFDO2dCQUVyQyxxRUFBcUU7Z0JBQ3JFLDBCQUEwQjtnQkFDbkIsV0FBVyxDQUFDLElBQVksRUFBRSxRQUFhO29CQUM1QyxNQUFNLEtBQUssR0FBZSxJQUFJLENBQUMsTUFBTSxD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