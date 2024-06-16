// import { angleBetweenVectors } from "../geometry";
import {
  angleBetweenVectors,
  getShortestVector,
  getVectorAngle,
  getPointsBoundaryMiddlePoint,
  getRotatedPolyPoints,
} from "../geometry";
import HPoint from "./hpoint";
export default class HPolygon {
  constructor(pts: HPoint[]) {
    this.pts = pts;
  }
  pts: HPoint[];

  get rightAngle() {
    const myPt = this.rightBottomPt;
    const ptIdx = this.pts.indexOf(myPt);
    const prev =
      ptIdx > 0 ? this.pts[ptIdx - 1] : this.pts[this.pts.length - 1];
    const next =
      ptIdx === this.pts.length - 1 ? this.pts[0] : this.pts[ptIdx + 1];

    const prevPrim = new HPoint(prev.x - myPt.x, prev.y - myPt.y);
    const nextPrim = new HPoint(next.x - myPt.x, next.y - myPt.y);

    const alfa = angleBetweenVectors(prevPrim, nextPrim);
    return alfa;
  }

  get leftAngle() {
    const myPt = this.leftBottomPt;
    const ptIdx = this.pts.indexOf(myPt);
    const prev =
      ptIdx > 0 ? this.pts[ptIdx - 1] : this.pts[this.pts.length - 1];
    const next =
      ptIdx === this.pts.length - 1 ? this.pts[0] : this.pts[ptIdx + 1];

    const prevPrim = new HPoint(prev.x - myPt.x, prev.y - myPt.y);
    const nextPrim = new HPoint(next.x - myPt.x, next.y - myPt.y);

    const alfa = angleBetweenVectors(prevPrim, nextPrim);
    return alfa;
  }

  get rightBottomPt() {
    const pts = [...this.pts];
    const sortedPts = pts.sort((a: HPoint, b: HPoint) => {
      if (a.x > b.x) return -1;
      if (a.x < b.x) return 1;
      if (a.y > b.y) return 1;
      if (a.y < b.y) return -1;
      return 0;
    });
    return sortedPts[0];
  }

  get leftBottomPt() {
    const pts = [...this.pts];
    const sortedPts = pts.sort((a, b) => {
      if (a.x > b.x) return 1;
      if (a.x < b.x) return -1;
      if (a.y > b.y) return 1;
      if (a.y < b.y) return -1;
      return 0;
    });
    return sortedPts[0];
  }

  get bottomRightPt() {
    const pts = [...this.pts];
    const sortedPts = pts.sort((a, b) => {
      if (a.y > b.y) return 1;
      if (a.y < b.y) return -1;
      if (a.x < b.x) return 1;
      if (a.x > b.x) return -1;
      return 0;
    });
    return sortedPts[0];
  }

  get bottonLeftPt() {
    const pts = [...this.pts];
    const sortedPts = pts.sort((a, b) => {
      if (a.y > b.y) return 1;
      if (a.y < b.y) return -1;
      if (a.x > b.x) return 1;
      if (a.x < b.x) return -1;
      return 0;
    });
    return sortedPts[0];
  }

  get topRightPt() {
    const pts = [...this.pts];
    const sortedPts = pts.sort((a: HPoint, b: HPoint) => {
      if (a.y < b.y) return 1;
      if (a.y > b.y) return -1;
      if (a.x > b.x) return -1;
      if (a.x < b.x) return 1;
      return 0;
    });
    return sortedPts[0];
  }

  get topLeftPt() {
    const pts = [...this.pts];
    const sortedPts = pts.sort((a: HPoint, b: HPoint) => {
      if (a.y < b.y) return 1;
      if (a.y > b.y) return -1;
      if (a.x < b.x) return -1;
      if (a.x > b.x) return 1;
      return 0;
    });
    return sortedPts[0];
  }

  get middlePt() {
    const pt = new HPoint(
      this.minX + (this.maxX - this.minX) / 2,
      this.minY + (this.maxY - this.minY) / 2
    );
    return pt;
  }

  get minX() {
    return Math.min(...this.pts.map((p) => p.x));
  }
  get minY() {
    return Math.min(...this.pts.map((p) => p.y));
  }

  get maxX() {
    return Math.max(...this.pts.map((p) => p.x));
  }

  get maxY() {
    return Math.max(...this.pts.map((p) => p.y));
  }

  get width() {
    return this.rightBottomPt.x - this.leftBottomPt.x;
  }

  rotate = (center: HPoint, angleRad: number) => {
    const pts = [...this.pts];
    const rotated = pts.map((p) => {
      const cosAlfa = Math.cos(angleRad);
      const sinAlfa = Math.sin(angleRad);
      const newX =
        cosAlfa * (p.x - center.x) - sinAlfa * (p.y - center.y) + center.x;
      const newY =
        sinAlfa * (p.x - center.x) + cosAlfa * (p.y - center.y) + center.y;
      return new HPoint(newX, newY);
    });
    this.pts = rotated;
  };

  translate = (deltaX: number, deltaY: number) => {
    const pts = [...this.pts];
    const transPts = pts.map((p) => {
      return new HPoint(p.x + deltaX, p.y + deltaY);
    });
    this.pts = transPts;
  };

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
