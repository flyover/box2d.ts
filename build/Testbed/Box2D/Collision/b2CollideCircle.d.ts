import { b2Transform } from "../Common/b2Math";
import { b2Manifold } from "./b2Collision";
import { b2CircleShape } from "./Shapes/b2CircleShape";
import { b2PolygonShape } from "./Shapes/b2PolygonShape";
export declare function b2CollideCircles(manifold: b2Manifold, circleA: b2CircleShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
export declare function b2CollidePolygonAndCircle(manifold: b2Manifold, polygonA: b2PolygonShape, xfA: b2Transform, circleB: b2CircleShape, xfB: b2Transform): void;
