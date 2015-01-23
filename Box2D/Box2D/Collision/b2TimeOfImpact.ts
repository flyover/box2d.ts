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

///<reference path='../../../Box2D/Box2D/Common/b2Math.ts' />
///<reference path='../../../Box2D/Box2D/Collision/b2Distance.ts' />
//<reference path='../../../Box2D/Box2D/Collision/b2Collision.ts' />
//<reference path='../../../Box2D/Box2D/Collision/Shapes/b2CircleShape.ts' />
//<reference path='../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts' />
///<reference path='../../../Box2D/Box2D/Common/b2Timer.ts' />

module box2d {

export var b2_toiTime: number = 0;
export var b2_toiMaxTime: number = 0;
export var b2_toiCalls: number = 0;
export var b2_toiIters: number = 0;
export var b2_toiMaxIters: number = 0;
export var b2_toiRootIters: number = 0;
export var b2_toiMaxRootIters: number = 0;

var b2TimeOfImpact_s_xfA: b2Transform = new b2Transform();
var b2TimeOfImpact_s_xfB: b2Transform = new b2Transform();
var b2TimeOfImpact_s_pointA: b2Vec2 = new b2Vec2();
var b2TimeOfImpact_s_pointB: b2Vec2 = new b2Vec2();
var b2TimeOfImpact_s_normal: b2Vec2 = new b2Vec2();
var b2TimeOfImpact_s_axisA: b2Vec2 = new b2Vec2();
var b2TimeOfImpact_s_axisB: b2Vec2 = new b2Vec2();

/// Input parameters for b2TimeOfImpact
export class b2TOIInput
{
	public proxyA: b2DistanceProxy = new b2DistanceProxy();
	public proxyB: b2DistanceProxy = new b2DistanceProxy();
	public sweepA: b2Sweep = new b2Sweep();
	public sweepB: b2Sweep = new b2Sweep();
	public tMax: number = 0; // defines sweep interval [0, tMax]
}

export enum b2TOIOutputState
{
	e_unknown		= 0,
	e_failed		= 1,
	e_overlapped	= 2,
	e_touching		= 3,
	e_separated		= 4
}

export class b2TOIOutput
{
	public state = b2TOIOutputState.e_unknown;
	public t: number = 0;
}

export enum b2SeparationFunctionType
{
	e_unknown	= -1,
	e_points	= 0,
	e_faceA		= 1,
	e_faceB		= 2
}

export class b2SeparationFunction
{
	public m_proxyA = null;
	public m_proxyB = null;
	public m_sweepA: b2Sweep = new b2Sweep();
	public m_sweepB: b2Sweep = new b2Sweep();
	public m_type = b2SeparationFunctionType.e_unknown;
	public m_localPoint: b2Vec2 = new b2Vec2();
	public m_axis: b2Vec2 = new b2Vec2();

	public Initialize(cache: b2SimplexCache, proxyA: b2DistanceProxy, sweepA: b2Sweep, proxyB: b2DistanceProxy, sweepB: b2Sweep, t1: number): number
	{
		this.m_proxyA = proxyA;
		this.m_proxyB = proxyB;
		var count: number = cache.count;
		if (ENABLE_ASSERTS) { b2Assert(0 < count && count < 3); }

		this.m_sweepA.Copy(sweepA);
		this.m_sweepB.Copy(sweepB);

		var xfA: b2Transform = b2TimeOfImpact_s_xfA;
		var xfB: b2Transform = b2TimeOfImpact_s_xfB;
		this.m_sweepA.GetTransform(xfA, t1);
		this.m_sweepB.GetTransform(xfB, t1);

		if (count == 1)
		{
			this.m_type = b2SeparationFunctionType.e_points;
			var localPointA: b2Vec2 = this.m_proxyA.GetVertex(cache.indexA[0]);
			var localPointB: b2Vec2 = this.m_proxyB.GetVertex(cache.indexB[0]);
			var pointA: b2Vec2 = b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
			var pointB: b2Vec2 = b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
			b2SubVV(pointB, pointA, this.m_axis);
			var s: number = this.m_axis.Normalize();
			return s;
		}
		else if (cache.indexA[0] == cache.indexA[1])
		{
			// Two points on B and one on A.
			this.m_type = b2SeparationFunctionType.e_faceB;
			var localPointB1: b2Vec2 = this.m_proxyB.GetVertex(cache.indexB[0]);
			var localPointB2: b2Vec2 = this.m_proxyB.GetVertex(cache.indexB[1]);

			b2CrossVOne(b2SubVV(localPointB2, localPointB1, b2Vec2.s_t0), this.m_axis).SelfNormalize();
			var normal: b2Vec2 = b2MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);

			b2MidVV(localPointB1, localPointB2, this.m_localPoint);
			var pointB: b2Vec2 = b2MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);

			var localPointA: b2Vec2 = this.m_proxyA.GetVertex(cache.indexA[0]);
			var pointA: b2Vec2 = b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);

			var s: number = b2DotVV(b2SubVV(pointA, pointB, b2Vec2.s_t0), normal);
			if (s < 0)
			{
				this.m_axis.SelfNeg();
				s = -s;
			}
			return s;
		}
		else
		{
			// Two points on A and one or two points on B.
			this.m_type = b2SeparationFunctionType.e_faceA;
			var localPointA1: b2Vec2 = this.m_proxyA.GetVertex(cache.indexA[0]);
			var localPointA2: b2Vec2 = this.m_proxyA.GetVertex(cache.indexA[1]);

			b2CrossVOne(b2SubVV(localPointA2, localPointA1, b2Vec2.s_t0), this.m_axis).SelfNormalize();
			var normal: b2Vec2 = b2MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);

			b2MidVV(localPointA1, localPointA2, this.m_localPoint);
			var pointA: b2Vec2 = b2MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);

			var localPointB: b2Vec2 = this.m_proxyB.GetVertex(cache.indexB[0]);
			var pointB: b2Vec2 = b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);

			var s: number = b2DotVV(b2SubVV(pointB, pointA, b2Vec2.s_t0), normal);
			if (s < 0)
			{
				this.m_axis.SelfNeg();
				s = -s;
			}
			return s;
		}
	}

	public FindMinSeparation(indexA: number[], indexB: number[], t: number): number
	{
		var xfA: b2Transform = b2TimeOfImpact_s_xfA;
		var xfB: b2Transform = b2TimeOfImpact_s_xfB;
		this.m_sweepA.GetTransform(xfA, t);
		this.m_sweepB.GetTransform(xfB, t);

		switch (this.m_type)
		{
		case b2SeparationFunctionType.e_points:
			{
				var axisA: b2Vec2 = b2MulTRV(xfA.q, this.m_axis, b2TimeOfImpact_s_axisA);
				var axisB: b2Vec2 = b2MulTRV(xfB.q, b2NegV(this.m_axis, b2Vec2.s_t0), b2TimeOfImpact_s_axisB);

				indexA[0] = this.m_proxyA.GetSupport(axisA);
				indexB[0] = this.m_proxyB.GetSupport(axisB);

				var localPointA: b2Vec2 = this.m_proxyA.GetVertex(indexA[0]);
				var localPointB: b2Vec2 = this.m_proxyB.GetVertex(indexB[0]);

				var pointA: b2Vec2 = b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
				var pointB: b2Vec2 = b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);

				var separation: number = b2DotVV(b2SubVV(pointB, pointA, b2Vec2.s_t0), this.m_axis)
				return separation;
			}

		case b2SeparationFunctionType.e_faceA:
			{
				var normal: b2Vec2 = b2MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
				var pointA: b2Vec2 = b2MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);

				var axisB: b2Vec2 = b2MulTRV(xfB.q, b2NegV(normal, b2Vec2.s_t0), b2TimeOfImpact_s_axisB);

				indexA[0] = -1;
				indexB[0] = this.m_proxyB.GetSupport(axisB);

				var localPointB: b2Vec2 = this.m_proxyB.GetVertex(indexB[0]);
				var pointB: b2Vec2 = b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);

				var separation: number = b2DotVV(b2SubVV(pointB, pointA, b2Vec2.s_t0), normal)
				return separation;
			}

		case b2SeparationFunctionType.e_faceB:
			{
				var normal: b2Vec2 = b2MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
				var pointB: b2Vec2 = b2MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);

				var axisA: b2Vec2 = b2MulTRV(xfA.q, b2NegV(normal, b2Vec2.s_t0), b2TimeOfImpact_s_axisA);

				indexB[0] = -1;
				indexA[0] = this.m_proxyA.GetSupport(axisA);

				var localPointA: b2Vec2 = this.m_proxyA.GetVertex(indexA[0]);
				var pointA: b2Vec2 = b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);

				var separation: number = b2DotVV(b2SubVV(pointA, pointB, b2Vec2.s_t0), normal)
				return separation;
			}

		default:
			if (ENABLE_ASSERTS) { b2Assert(false); }
			indexA[0] = -1;
			indexB[0] = -1;
			return 0;
		}
	}

	public Evaluate(indexA: number, indexB: number, t: number): number
	{
		var xfA: b2Transform = b2TimeOfImpact_s_xfA;
		var xfB: b2Transform = b2TimeOfImpact_s_xfB;
		this.m_sweepA.GetTransform(xfA, t);
		this.m_sweepB.GetTransform(xfB, t);

		switch (this.m_type)
		{
		case b2SeparationFunctionType.e_points:
			{
				var localPointA: b2Vec2 = this.m_proxyA.GetVertex(indexA);
				var localPointB: b2Vec2 = this.m_proxyB.GetVertex(indexB);

				var pointA: b2Vec2 = b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);
				var pointB: b2Vec2 = b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);
				var separation: number = b2DotVV(b2SubVV(pointB, pointA, b2Vec2.s_t0), this.m_axis)

				return separation;
			}

		case b2SeparationFunctionType.e_faceA:
			{
				var normal: b2Vec2 = b2MulRV(xfA.q, this.m_axis, b2TimeOfImpact_s_normal);
				var pointA: b2Vec2 = b2MulXV(xfA, this.m_localPoint, b2TimeOfImpact_s_pointA);

				var localPointB: b2Vec2 = this.m_proxyB.GetVertex(indexB);
				var pointB: b2Vec2 = b2MulXV(xfB, localPointB, b2TimeOfImpact_s_pointB);

				var separation: number = b2DotVV(b2SubVV(pointB, pointA, b2Vec2.s_t0), normal)
				return separation;
			}

		case b2SeparationFunctionType.e_faceB:
			{
				var normal: b2Vec2 = b2MulRV(xfB.q, this.m_axis, b2TimeOfImpact_s_normal);
				var pointB: b2Vec2 = b2MulXV(xfB, this.m_localPoint, b2TimeOfImpact_s_pointB);

				var localPointA: b2Vec2 = this.m_proxyA.GetVertex(indexA);
				var pointA: b2Vec2 = b2MulXV(xfA, localPointA, b2TimeOfImpact_s_pointA);

				var separation: number = b2DotVV(b2SubVV(pointA, pointB, b2Vec2.s_t0), normal)
				return separation;
			}

		default:
			if (ENABLE_ASSERTS) { b2Assert(false); }
			return 0;
		}
	}
}

var b2TimeOfImpact_s_timer: b2Timer = new b2Timer();
var b2TimeOfImpact_s_cache: b2SimplexCache = new b2SimplexCache();
var b2TimeOfImpact_s_distanceInput: b2DistanceInput = new b2DistanceInput();
var b2TimeOfImpact_s_distanceOutput: b2DistanceOutput = new b2DistanceOutput();
var b2TimeOfImpact_s_fcn: b2SeparationFunction = new b2SeparationFunction();
var b2TimeOfImpact_s_indexA = b2MakeNumberArray(1);
var b2TimeOfImpact_s_indexB = b2MakeNumberArray(1);
var b2TimeOfImpact_s_sweepA: b2Sweep = new b2Sweep();
var b2TimeOfImpact_s_sweepB: b2Sweep = new b2Sweep();
export function b2TimeOfImpact(output: b2TOIOutput, input: b2TOIInput): void
{
	var timer: b2Timer = b2TimeOfImpact_s_timer.Reset();

	++b2_toiCalls;

	output.state = b2TOIOutputState.e_unknown;
	output.t = input.tMax;

	var proxyA: b2DistanceProxy = input.proxyA;
	var proxyB: b2DistanceProxy = input.proxyB;

	var sweepA: b2Sweep = b2TimeOfImpact_s_sweepA.Copy(input.sweepA);
	var sweepB: b2Sweep = b2TimeOfImpact_s_sweepB.Copy(input.sweepB);

	// Large rotations can make the root finder fail, so we normalize the
	// sweep angles.
	sweepA.Normalize();
	sweepB.Normalize();

	var tMax: number = input.tMax;

	var totalRadius: number = proxyA.m_radius + proxyB.m_radius;
	var target: number = b2Max(b2_linearSlop, totalRadius - 3 * b2_linearSlop);
	var tolerance: number = 0.25 * b2_linearSlop;
	if (ENABLE_ASSERTS) { b2Assert(target > tolerance); }

	var t1: number = 0;
	var k_maxIterations: number = 20; // TODO_ERIN b2Settings
	var iter: number = 0;

	// Prepare input for distance query.
	var cache: b2SimplexCache = b2TimeOfImpact_s_cache;
	cache.count = 0;
	var distanceInput: b2DistanceInput = b2TimeOfImpact_s_distanceInput;
	distanceInput.proxyA = input.proxyA;
	distanceInput.proxyB = input.proxyB;
	distanceInput.useRadii = false;

	// The outer loop progressively attempts to compute new separating axes.
	// This loop terminates when an axis is repeated (no progress is made).
	for (;;)
	{
		var xfA: b2Transform = b2TimeOfImpact_s_xfA;
		var xfB: b2Transform = b2TimeOfImpact_s_xfB;
		sweepA.GetTransform(xfA, t1);
		sweepB.GetTransform(xfB, t1);

		// Get the distance between shapes. We can also use the results
		// to get a separating axis.
		distanceInput.transformA.Copy(xfA);
		distanceInput.transformB.Copy(xfB);
		var distanceOutput: b2DistanceOutput = b2TimeOfImpact_s_distanceOutput;
		b2Distance(distanceOutput, cache, distanceInput);

		// If the shapes are overlapped, we give up on continuous collision.
		if (distanceOutput.distance <= 0)
		{
			// Failure!
			output.state = b2TOIOutputState.e_overlapped;
			output.t = 0;
			break;
		}

		if (distanceOutput.distance < target + tolerance)
		{
			// Victory!
			output.state = b2TOIOutputState.e_touching;
			output.t = t1;
			break;
		}

		// Initialize the separating axis.
		var fcn: b2SeparationFunction = b2TimeOfImpact_s_fcn;
		fcn.Initialize(cache, proxyA, sweepA, proxyB, sweepB, t1);
/*
#if 0
		// Dump the curve seen by the root finder
		{
			const int32 N = 100;
			float32 dx = 1.0f / N;
			float32 xs[N+1];
			float32 fs[N+1];

			float32 x = 0.0f;

			for (int32 i = 0; i <= N; ++i)
			{
				sweepA.GetTransform(&xfA, x);
				sweepB.GetTransform(&xfB, x);
				float32 f = fcn.Evaluate(xfA, xfB) - target;

				printf("%g %g\n", x, f);

				xs[i] = x;
				fs[i] = f;

				x += dx;
			}
		}
#endif
*/

		// Compute the TOI on the separating axis. We do this by successively
		// resolving the deepest point. This loop is bounded by the number of vertices.
		var done: boolean = false;
		var t2: number = tMax;
		var pushBackIter: number = 0;
		for (;;)
		{
			// Find the deepest point at t2. Store the witness point indices.
			var indexA: number[] = b2TimeOfImpact_s_indexA;
			var indexB: number[] = b2TimeOfImpact_s_indexB;
			var s2: number = fcn.FindMinSeparation(indexA, indexB, t2);

			// Is the final configuration separated?
			if (s2 > (target + tolerance))
			{
				// Victory!
				output.state = b2TOIOutputState.e_separated;
				output.t = tMax;
				done = true;
				break;
			}

			// Has the separation reached tolerance?
			if (s2 > (target - tolerance))
			{
				// Advance the sweeps
				t1 = t2;
				break;
			}

			// Compute the initial separation of the witness points.
			var s1: number = fcn.Evaluate(indexA[0], indexB[0], t1);

			// Check for initial overlap. This might happen if the root finder
			// runs out of iterations.
			if (s1 < (target - tolerance))
			{
				output.state = b2TOIOutputState.e_failed;
				output.t = t1;
				done = true;
				break;
			}

			// Check for touching
			if (s1 <= (target + tolerance))
			{
				// Victory! t1 should hold the TOI (could be 0.0).
				output.state = b2TOIOutputState.e_touching;
				output.t = t1;
				done = true;
				break;
			}

			// Compute 1D root of: f(x) - target = 0
			var rootIterCount: number = 0;
			var a1: number = t1;
			var a2: number = t2;
			for (;;)
			{
				// Use a mix of the secant rule and bisection.
				var t: number = 0;
				if (rootIterCount & 1)
				{
					// Secant rule to improve convergence.
					t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
				}
				else
				{
					// Bisection to guarantee progress.
					t = 0.5 * (a1 + a2);
				}

				++rootIterCount;
				++b2_toiRootIters;

				var s: number = fcn.Evaluate(indexA[0], indexB[0], t);

				if (b2Abs(s - target) < tolerance)
				{
					// t2 holds a tentative value for t1
					t2 = t;
					break;
				}

				// Ensure we continue to bracket the root.
				if (s > target)
				{
					a1 = t;
					s1 = s;
				}
				else
				{
					a2 = t;
					s2 = s;
				}

				if (rootIterCount == 50)
				{
					break;
				}
			}

			b2_toiMaxRootIters = b2Max(b2_toiMaxRootIters, rootIterCount);

			++pushBackIter;

			if (pushBackIter == b2_maxPolygonVertices)
			{
				break;
			}
		}

		++iter;
		++b2_toiIters;

		if (done)
		{
			break;
		}

		if (iter == k_maxIterations)
		{
			// Root finder got stuck. Semi-victory.
			output.state = b2TOIOutputState.e_failed;
			output.t = t1;
			break;
		}
	}

	b2_toiMaxIters = b2Max(b2_toiMaxIters, iter);

	var time: number = timer.GetMilliseconds();
	b2_toiMaxTime = b2Max(b2_toiMaxTime, time);
	b2_toiTime += time;
}

} // module box2d

