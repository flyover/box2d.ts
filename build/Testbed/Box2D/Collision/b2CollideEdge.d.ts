import { b2Transform } from "../Common/b2Math";
import { b2Manifold } from "./b2Collision";
import { b2CircleShape } from "./Shapes/b2CircleShape";
import { b2PolygonShape } from "./Shapes/b2PolygonShape";
import { b2EdgeShape } from "./Shapes/b2EdgeShape";
export declare function b2CollideEdgeAndCircle(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
export declare function b2CollideEdgeAndPolygon(manifold: b2Manifold, edgeA: b2EdgeShape, xfA: b2Transform, polygonB: b2PolygonShape, xfB: b2Transform): void;
