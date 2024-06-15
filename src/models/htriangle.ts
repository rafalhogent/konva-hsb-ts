import HPoint from "./hpoint";
import HPolygon from "./hPolygon";

import {
  getShortestVector,
  getVectorAngle,
  getPointsBoundaryMiddlePoint,
  getRotatedPolyPoints,
} from "../geometry";

export default class HTriangle extends HPolygon {
  constructor(pts: HPoint[]) {
    super(pts);
  }

  orientAlongXAx() {
    const shortestVector = getShortestVector(this.pts);
    const p1 = new HPoint(shortestVector.p1x, shortestVector.p1y);
    const p2 = new HPoint(shortestVector.p2x, shortestVector.p2y);
    const angle = getVectorAngle(p1, p2);
    const middlePoint = getPointsBoundaryMiddlePoint(this.pts);
    const extraAngle = p1.y > middlePoint.y ? Math.PI : 0;
    const rotatedPoints = getRotatedPolyPoints(
      this.pts,
      p1,
      -angle + extraAngle
    );

    this.pts = rotatedPoints;
  }
}
