///<reference path='../../../Box2D/Box2D/Collision/b2Collision.ts' />
///<reference path='../../../Box2D/Box2D/Collision/Shapes/b2PolygonShape.ts' />

module box2d {

var b2EdgeSeparation_s_normal1World: b2Vec2 = new b2Vec2();
var b2EdgeSeparation_s_normal1: b2Vec2 = new b2Vec2();
var b2EdgeSeparation_s_v1: b2Vec2 = new b2Vec2();
var b2EdgeSeparation_s_v2: b2Vec2 = new b2Vec2();
export function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2)
{
	var count1 = poly1.m_count;
	var vertices1 = poly1.m_vertices;
	var normals1 = poly1.m_normals;

	var count2 = poly2.m_count;
	var vertices2 = poly2.m_vertices;

	if (ENABLE_ASSERTS) { b2Assert(0 <= edge1 && edge1 < count1); }

	// Convert normal from poly1's frame into poly2's frame.
	var normal1World: b2Vec2 = b2MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
	var normal1: b2Vec2 = b2MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);

	// Find support vertex on poly2 for -normal.
	var index: number = 0;
	var minDot = b2_maxFloat;

	for (var i: number = 0; i < count2; ++i)
	{
		var dot: number = b2DotVV(vertices2[i], normal1);
		if (dot < minDot)
		{
			minDot = dot;
			index = i;
		}
	}

	var v1: b2Vec2 = b2MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
	var v2: b2Vec2 = b2MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
	var separation: number = b2DotVV(b2SubVV(v2, v1, b2Vec2.s_t0), normal1World);
	return separation;
}

var b2FindMaxSeparation_s_d: b2Vec2 = new b2Vec2();
var b2FindMaxSeparation_s_dLocal1: b2Vec2 = new b2Vec2();
export function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2)
{
	var count1 = poly1.m_count;
	var normals1 = poly1.m_normals;

	// Vector pointing from the centroid of poly1 to the centroid of poly2.
	var d: b2Vec2 = b2SubVV(b2MulXV(xf2, poly2.m_centroid, b2Vec2.s_t0), b2MulXV(xf1, poly1.m_centroid, b2Vec2.s_t1), b2FindMaxSeparation_s_d);
	var dLocal1: b2Vec2 = b2MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);

	// Find edge normal on poly1 that has the largest projection onto d.
	var edge: number = 0;
	var maxDot = (-b2_maxFloat);
	for (var i: number = 0; i < count1; ++i)
	{
		var dot: number = b2DotVV(normals1[i], dLocal1);
		if (dot > maxDot)
		{
			maxDot = dot;
			edge = i;
		}
	}

	// Get the separation for the edge normal.
	var s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);

	// Check the separation for the previous edge normal.
	var prevEdge = (edge + count1 - 1) % count1;
	var sPrev = b2EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);

	// Check the separation for the next edge normal.
	var nextEdge = (edge + 1) % count1;
	var sNext = b2EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);

	// Find the best edge and the search direction.
	var bestEdge: number = 0;
	var bestSeparation: number = 0;
	var increment: number = 0;
	if (sPrev > s && sPrev > sNext)
	{
		increment = -1;
		bestEdge = prevEdge;
		bestSeparation = sPrev;
	}
	else if (sNext > s)
	{
		increment = 1;
		bestEdge = nextEdge;
		bestSeparation = sNext;
	}
	else
	{
		edgeIndex[0] = edge;
		return s;
	}

	// Perform a local search for the best edge normal.
	while (true)
	{
		if (increment == -1)
			edge = (bestEdge + count1 - 1) % count1;
		else
			edge = (bestEdge + 1) % count1;

		s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);

		if (s > bestSeparation)
		{
			bestEdge = edge;
			bestSeparation = s;
		}
		else
		{
			break;
		}
	}

	edgeIndex[0] = bestEdge;
	return bestSeparation;
}

var b2FindIncidentEdge_s_normal1: b2Vec2 = new b2Vec2();
export function b2FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2)
{
	var count1 = poly1.m_count;
	var normals1 = poly1.m_normals;

	var count2 = poly2.m_count;
	var vertices2 = poly2.m_vertices;
	var normals2 = poly2.m_normals;

	if (ENABLE_ASSERTS) { b2Assert(0 <= edge1 && edge1 < count1); }

	// Get the normal of the reference edge in poly2's frame.
	var normal1: b2Vec2 = b2MulTRV(xf2.q, b2MulRV(xf1.q, normals1[edge1], b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);

	// Find the incident edge on poly2.
	var index: number = 0;
	var minDot = b2_maxFloat;
	for (var i: number = 0; i < count2; ++i)
	{
		var dot: number = b2DotVV(normal1, normals2[i]);
		if (dot < minDot)
		{
			minDot = dot;
			index = i;
		}
	}

	// Build the clip vertices for the incident edge.
	var i1 = index;
	var i2 = (i1 + 1) % count2;

	var c0 = c[0];
	b2MulXV(xf2, vertices2[i1], c0.v);
	var cf0 = c0.id.cf;
	cf0.indexA = edge1;
	cf0.indexB = i1;
	cf0.typeA = b2ContactFeatureType.e_face;
	cf0.typeB = b2ContactFeatureType.e_vertex;

	var c1 = c[1];
	b2MulXV(xf2, vertices2[i2], c1.v);
	var cf1 = c1.id.cf;
	cf1.indexA = edge1;
	cf1.indexB = i2;
	cf1.typeA = b2ContactFeatureType.e_face;
	cf1.typeB = b2ContactFeatureType.e_vertex;
}

var b2CollidePolygons_s_incidentEdge = b2ClipVertex.MakeArray(2);
var b2CollidePolygons_s_clipPoints1 = b2ClipVertex.MakeArray(2);
var b2CollidePolygons_s_clipPoints2 = b2ClipVertex.MakeArray(2);
var b2CollidePolygons_s_edgeA = b2MakeNumberArray(1);
var b2CollidePolygons_s_edgeB = b2MakeNumberArray(1);
var b2CollidePolygons_s_localTangent: b2Vec2 = new b2Vec2();
var b2CollidePolygons_s_localNormal: b2Vec2 = new b2Vec2();
var b2CollidePolygons_s_planePoint: b2Vec2 = new b2Vec2();
var b2CollidePolygons_s_normal: b2Vec2 = new b2Vec2();
var b2CollidePolygons_s_tangent: b2Vec2 = new b2Vec2();
var b2CollidePolygons_s_ntangent: b2Vec2 = new b2Vec2();
var b2CollidePolygons_s_v11: b2Vec2 = new b2Vec2();
var b2CollidePolygons_s_v12: b2Vec2 = new b2Vec2();
export function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB)
{
	manifold.pointCount = 0;
	var totalRadius = polyA.m_radius + polyB.m_radius;

	var edgeA = b2CollidePolygons_s_edgeA; edgeA[0] = 0;
	var separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
	if (separationA > totalRadius)
		return;

	var edgeB = b2CollidePolygons_s_edgeB; edgeB[0] = 0;
	var separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
	if (separationB > totalRadius)
		return;

	var poly1; // reference polygon
	var poly2; // incident polygon
	var xf1, xf2;
	var edge1: number = 0; // reference edge
	var flip: number = 0;
	var k_relativeTol: number = 0.98;
	var k_absoluteTol: number = 0.001;

	if (separationB > k_relativeTol * separationA + k_absoluteTol)
	{
		poly1 = polyB;
		poly2 = polyA;
		xf1 = xfB;
		xf2 = xfA;
		edge1 = edgeB[0];
		manifold.type = b2ManifoldType.e_faceB;
		flip = 1;
	}
	else
	{
		poly1 = polyA;
		poly2 = polyB;
		xf1 = xfA;
		xf2 = xfB;
		edge1 = edgeA[0];
		manifold.type = b2ManifoldType.e_faceA;
		flip = 0;
	}

	var incidentEdge = b2CollidePolygons_s_incidentEdge;
	b2FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);

	var count1 = poly1.m_count;
	var vertices1 = poly1.m_vertices;

	var iv1 = edge1;
	var iv2 = (edge1 + 1) % count1;

	var local_v11 = vertices1[iv1];
	var local_v12 = vertices1[iv2];

	var localTangent: b2Vec2 = b2SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
	localTangent.Normalize();

	var localNormal: b2Vec2 = b2CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
	var planePoint: b2Vec2 = b2MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);

	var tangent: b2Vec2 = b2MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
	var normal: b2Vec2 = b2CrossVOne(tangent, b2CollidePolygons_s_normal);

	var v11: b2Vec2 = b2MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
	var v12: b2Vec2 = b2MulXV(xf1, local_v12, b2CollidePolygons_s_v12);

	// Face offset.
	var frontOffset: number = b2DotVV(normal, v11);

	// Side offsets, extended by polytope skin thickness.
	var sideOffset1: number = -b2DotVV(tangent, v11) + totalRadius;
	var sideOffset2: number = b2DotVV(tangent, v12) + totalRadius;

	// Clip incident edge against extruded edge1 side edges.
	var clipPoints1 = b2CollidePolygons_s_clipPoints1;
	var clipPoints2 = b2CollidePolygons_s_clipPoints2;
	var np;

	// Clip to box side 1
	var ntangent = b2NegV(tangent, b2CollidePolygons_s_ntangent);
	np = b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);

	if (np < 2)
		return;

	// Clip to negative box side 1
	np = b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);

	if (np < 2)
	{
		return;
	}

	// Now clipPoints2 contains the clipped points.
	manifold.localNormal.Copy(localNormal);
	manifold.localPoint.Copy(planePoint);

	var pointCount: number = 0;
	for (var i: number = 0; i < b2_maxManifoldPoints; ++i)
	{
		var cv = clipPoints2[i];
		var separation: number = b2DotVV(normal, cv.v) - frontOffset;

		if (separation <= totalRadius)
		{
			var cp = manifold.points[pointCount];
			b2MulTXV(xf2, cv.v, cp.localPoint);
			cp.id.Copy(cv.id);
			if (flip)
			{
				// Swap features
				var cf: b2ContactFeature = cp.id.cf;
				cp.id.cf.indexA = cf.indexB;
				cp.id.cf.indexB = cf.indexA;
				cp.id.cf.typeA = cf.typeB;
				cp.id.cf.typeB = cf.typeA;
			}
			++pointCount;
		}
	}

	manifold.pointCount = pointCount;
}

} // module box2d

