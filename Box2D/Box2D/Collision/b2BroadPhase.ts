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

/// <reference path="../Common/b2Settings.ts"/>
/// <reference path="../Common/b2Math.ts"/>
/// <reference path="./b2Collision.ts"/>
/// <reference path="./b2DynamicTree.ts"/>

namespace box2d {

export class b2Pair {
  public proxyA: b2TreeNode = null;
  public proxyB: b2TreeNode = null;
}

/// The broad-phase is used for computing pairs and performing volume queries and ray casts.
/// This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
/// It is up to the client to consume the new pairs and to track subsequent overlap.
export class b2BroadPhase {
  public m_tree: b2DynamicTree = new b2DynamicTree();
  public m_proxyCount: number = 0;
  // public m_moveCapacity: number = 16;
  public m_moveCount: number = 0;
  public m_moveBuffer: any[] = [];
  // public m_pairCapacity: number = 16;
  public m_pairCount: number = 0;
  public m_pairBuffer: any[] = [];
  // public m_queryProxyId: number = 0;

  /// Create a proxy with an initial AABB. Pairs are not reported until
  /// UpdatePairs is called.
  public CreateProxy(aabb: b2AABB, userData: any): b2TreeNode {
    const proxy = this.m_tree.CreateProxy(aabb, userData);
    ++this.m_proxyCount;
    this.BufferMove(proxy);
    return proxy;
  }

  /// Destroy a proxy. It is up to the client to remove any pairs.
  public DestroyProxy(proxy: b2TreeNode): void {
    this.UnBufferMove(proxy);
    --this.m_proxyCount;
    this.m_tree.DestroyProxy(proxy);
  }

  /// Call MoveProxy as many times as you like, then when you are done
  /// call UpdatePairs to finalized the proxy pairs (for your time step).
  public MoveProxy(proxy: b2TreeNode, aabb: b2AABB, displacement: b2Vec2): void {
    const buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
    if (buffer) {
      this.BufferMove(proxy);
    }
  }

  /// Call to trigger a re-processing of it's pairs on the next call to UpdatePairs.
  public TouchProxy(proxy: b2TreeNode): void {
    this.BufferMove(proxy);
  }

  /// Get the fat AABB for a proxy.
  public GetFatAABB(proxy: b2TreeNode): b2AABB {
    return this.m_tree.GetFatAABB(proxy);
  }

  /// Get user data from a proxy. Returns NULL if the id is invalid.
  public GetUserData(proxy: b2TreeNode): any {
    return this.m_tree.GetUserData(proxy);
  }

  /// Test overlap of fat AABBs.
  public TestOverlap(proxyA: b2TreeNode, proxyB: b2TreeNode): boolean {
    const aabbA = this.m_tree.GetFatAABB(proxyA);
    const aabbB = this.m_tree.GetFatAABB(proxyB);
    return b2TestOverlapAABB(aabbA, aabbB);
  }

  /// Get the number of proxies.
  public GetProxyCount(): number {
    return this.m_proxyCount;
  }

  /// Update the pairs. This results in pair callbacks. This can only add pairs.
  public UpdatePairs(contactManager: any): void {
    // Reset pair buffer
    this.m_pairCount = 0;

    // Perform tree queries for all moving proxies.
    for (let i: number = 0; i < this.m_moveCount; ++i) {
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
        } else {
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
    let i: number = 0;
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
  public Query(callback: any, aabb: b2AABB): void {
    this.m_tree.Query(callback, aabb);
  }

  /// Ray-cast against the proxies in the tree. This relies on the callback
  /// to perform a exact ray-cast in the case were the proxy contains a shape.
  /// The callback also performs the any collision filtering. This has performance
  /// roughly equal to k * log(n), where k is the number of collisions and n is the
  /// number of proxies in the tree.
  /// @param input the ray-cast input data. The ray extends from p1 to p1 + maxFraction * (p2 - p1).
  /// @param callback a callback class that is called for each proxy that is hit by the ray.
  public RayCast(callback: any, input: b2RayCastInput): void {
    this.m_tree.RayCast(callback, input);
  }

  /// Get the height of the embedded tree.
  public GetTreeHeight(): number {
    return this.m_tree.GetHeight();
  }

  /// Get the balance of the embedded tree.
  public GetTreeBalance(): number {
    return this.m_tree.GetMaxBalance();
  }

  /// Get the quality metric of the embedded tree.
  public GetTreeQuality(): number {
    return this.m_tree.GetAreaRatio();
  }

  /// Shift the world origin. Useful for large worlds.
  /// The shift formula is: position -= newOrigin
  /// @param newOrigin the new origin with respect to the old origin
  public ShiftOrigin(newOrigin: b2Vec2): void {
    this.m_tree.ShiftOrigin(newOrigin);
  }

  public BufferMove(proxy: b2TreeNode): void {
    this.m_moveBuffer[this.m_moveCount] = proxy;
    ++this.m_moveCount;
  }

  public UnBufferMove(proxy: b2TreeNode): void {
    const i = this.m_moveBuffer.indexOf(proxy);
    this.m_moveBuffer[i] = null;
  }
}

/// This is used to sort pairs.
export function b2PairLessThan(pair1: b2Pair, pair2: b2Pair): number {
  if (pair1.proxyA.m_id === pair2.proxyA.m_id) {
    return pair1.proxyB.m_id - pair2.proxyB.m_id;
  }

  return pair1.proxyA.m_id - pair2.proxyA.m_id;
}

} // namespace box2d
