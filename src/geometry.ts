import { Line } from "konva/lib/shapes/Line.js";

import { HVector } from "./models/hvector";
import HPolygon from "./models/hPolygon";
import HPoint from "./models/hpoint";
export const orientPoly = (poly: Line) => {
  const pts = getPointsFromArray(poly.attrs.points);

  const p1 = pts[0];
  const pE = pts[pts.length - 1];
  const angleToRotate = -getVectorAngle(p1, pE);
  const rotatedPoints = getRotatedPolyPoints(pts, p1, angleToRotate);
  poly.attrs.points = getArrayFromPoints(rotatedPoints);
};

export const getShortestVector = (hPoints: HPoint[]) => {
  const vectors = [];
  for (let idx = 1; idx < hPoints.length; idx++) {
    const p1 = hPoints[idx - 1];
    const p2 = hPoints[idx];
    const v = new HVector(p1.x, p1.y, p2.x, p2.y);
    vectors.push(v);
  }
  vectors.sort((a, b) => a.length - b.length);
  return vectors[0];
};


export const getRotatedPolyPoints = (
  points: HPoint[],
  center: HPoint,
  angleRad: number
) => {
  const rotated = points.map((p) => {
    const cosAlfa = Math.cos(angleRad);
    const sinAlfa = Math.sin(angleRad);
    const newX =
      cosAlfa * (p.x - center.x) - sinAlfa * (p.y - center.y) + center.x;
    const newY =
      sinAlfa * (p.x - center.x) + cosAlfa * (p.y - center.y) + center.y;
    return new HPoint(newX, newY);
  });
  return rotated;
};

export const translatePoly = (deltaX: number, deltaY: number, poly: Line) => {
  const pts = getPointsFromArray(poly.attrs.points);
  const transPts = pts.map((p) => {
    return new HPoint(p.x + deltaX, p.y + deltaY);
  });
  poly.attrs.points = getArrayFromPoints(transPts);
};

export const translateHFigureByPts = (
  figure: HPolygon,
  deltaX: number,
  deltaY: number
) => {
  const pts = figure.pts;
  const transPts = pts.map((p) => {
    return new HPoint(p.x + deltaX, p.y + deltaY);
  });
  figure.pts = transPts;
};

export const getPointsFromArray = (ints: number[]) => {
  const hpoints = [];
  for (let ix = 0; ix < ints.length - 1; ix += 2) {
    const newHpoint = new HPoint(ints[ix], ints[ix + 1]);
    hpoints.push(newHpoint);
  }
  return hpoints;
};

export const getArrayFromPoints = (pts: HPoint[]) => {
  const ptsArr: number[] = [];
  pts.forEach((p) => {
    ptsArr.push(...[p.x, p.y]);
  });
  return ptsArr;
};

export const getMinXMinYPoint = (pts: HPoint[]) => {
  const sortedPts = pts.sort((a: HPoint, b: HPoint) => {
    if (a.x > b.x) return 1;
    if (a.x < b.x) return -1;
    if (a.y > b.y) return 1;
    if (a.y < b.y) return -1;
    return 0;
  });
  return sortedPts[0];
};

export const getPolyTopRightBoundryPt = (poly: Line) => {
  const pts = getPointsFromArray(poly.attrs.points);
  const maxX = pts.sort((a, b) => -a.x + b.x)[0].x;
  const maxY = pts.sort((a, b) => -a.y + b.y)[0].y;
  return new HPoint(maxX, maxY);
};

export const getPolyMinLeftBoundryPt = (poly: Line) => {
  const pts = getPointsFromArray(poly.attrs.points);
  const minX = pts.sort((a, b) => a.x - b.x)[0].x;
  const minY = pts.sort((a, b) => a.y - b.y)[0].y;
  return new HPoint(minX, minY);
};

export const getVectorAngle = (p1: HPoint, p2: HPoint) => {
  var xDiff = p2.x - p1.x;
  var yDiff = p2.y - p1.y;
  const angleRad = Math.atan2(yDiff, xDiff);
  return angleRad;
};

export const getPointsBoundaryMiddlePoint = (pts: HPoint[]) => {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const maxY = Math.max(...ys);
  const minY = Math.min(...ys);
  const minX = Math.max(...xs);
  const maxX = Math.min(...xs);
  const mp = new HPoint((maxX + minX) / 2, (maxY + minY) / 2);
  return mp;
};

export const angleBetweenVectors = (a: HPoint, b: HPoint) => {
  const a_len = Math.pow(a.x, 2) + Math.pow(a.y, 2);
  const b_len = Math.pow(b.x, 2) + Math.pow(b.y, 2);
  const alfa = Math.acos(
    (a.x * b.x + a.y * b.y) / (Math.sqrt(a_len) * Math.sqrt(b_len))
  );
  return alfa;
};

export function intersectionPt(
  p1: HPoint,
  p2: HPoint,
  p3: HPoint,
  p4: HPoint
) {
  var c2x = p3.x - p4.x; 
  var c3x = p1.x - p2.x; 
  var c2y = p3.y - p4.y; 
  var c3y = p1.y - p2.y; 

  // down part of intersection point
  var d = c3x * c2y - c3y * c2x;

  if (d == 0) {
    return false; 
  }

  // upper part of intersection point
  var u1 = p1.x * p2.y - p1.y * p2.x; 
  var u4 = p3.x * p4.y - p3.y * p4.x; 

  // intersection point 
  var px = (u1 * c2x - c3x * u4) / d;
  var py = (u1 * c2y - c3y * u4) / d;

  var p = { x: px, y: py };

  return p;
}
