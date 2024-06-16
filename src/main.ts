import { addElementManipulation } from "./manipulation";
import {
  orientPoly,
  getPolyTopRightBoundryPt,
  getPointsFromArray,
  translatePoly,
  getPolyMinLeftBoundryPt,
  intersectionPt,
} from "./geometry";
// import HRect from "./models/hrect.ts";
import HSpace from "./models/hspace";
import HTriangle from "./models/htriangle";
import Konva from "konva";
import data from "../src/data/hsbExam.json";
import HPoint from "./models/hpoint";
import { createKonvaRect, createKonvaTriangle } from "./helpers/konva-helper";

//#region import source
// import * as data from "./data/hsbExam.json" assert { type: "json" };
// const data = await fetch("./data/hsbExam.json").then((response) =>
//   response.json()
// );
const trianglesJson = data[0].HsbTrianglesList;
const rectsJson = data[0].HsbRectanglesList;
// const circlesJson = data[0].HsbCirclesList;
// const ellipsesJson = data[0].HsbEllipsesList;
// const rombsJson = data[0].HsbRhombusList;
//#endregion

//#region config
var gap = 10;
var canvaWidth = 900;
var canvaHeight = 610;
//#endregion

//#region  config canva scene

var stage = new Konva.Stage({
  container: "container",
  width: canvaWidth,
  height: canvaHeight,
});

var layer = new Konva.Layer();
stage.add(layer);

//#endregion

const freeSpace: any[] = [];

// push some extra rects ...
// for (let idx = 0; idx < 7; idx++) {
//   const randoM = Math.floor(Math.random() * rectsJson.length);
//   rectsJson.push(rectsJson[randoM]);
// }

//#region rects
const rects: Konva.Line[] = rectsJson.map((r: any) => {
  return createKonvaRect(
    getPointsFromArray([...r.Pt1, ...r.Pt2, ...r.Pt3, ...r.Pt4])
  );
});

let lastX = gap;
let lastY = gap;
let maxRowH = gap;
rects.forEach((r) => {
  orientPoly(r);
  const p0 = getPolyMinLeftBoundryPt(r);
  const p2 = getPolyTopRightBoundryPt(r);
  const polyWidth = p2.x - p0.x;

  if (polyWidth + gap + lastX > canvaWidth) {
    const remainingRowSpace = new HSpace(
      lastX,
      lastY,
      canvaWidth - gap,
      maxRowH
    );
    freeSpace.push(remainingRowSpace);
    lastX = gap;
    lastY = maxRowH + gap;
  }
  translatePoly(lastX - p0.x, lastY - p0.y, r);
  lastX = getPolyTopRightBoundryPt(r).x + gap;
  const p2Translated = getPolyTopRightBoundryPt(r);
  maxRowH = Math.max(maxRowH, p2Translated.y);
  layer.add(r);
});
const remainingRowSpace = new HSpace(lastX, lastY, canvaWidth - gap, maxRowH);
freeSpace.push(remainingRowSpace);
lastY = maxRowH + gap;
//#endregion

//#region tringles

// add some random triangles
// for (let idx = 0; idx < 0; idx++) {
//   const randoM = Math.floor(Math.random() * trianglesJson.length);
//   trianglesJson.push(trianglesJson[randoM]);
// }

const triangles: HTriangle[] = trianglesJson.map((t: any) => {
  const pointsInts = [...t.Pt1, ...t.Pt2, ...t.Pt3];
  const tri = new HTriangle(getPointsFromArray(pointsInts));
  tri.orientAlongXAx();
  return tri;
});

triangles.sort((a, b) => b.rightAngle - a.rightAngle);

lastX = gap;
let swap = false;
let lastTriangle: HTriangle | undefined;

triangles.forEach((t) => {
  let lastRightAngle = lastTriangle?.rightAngle ?? Math.PI;

  // if too many triangles,  move to next row up
  if (lastTriangle && lastTriangle.maxX + t.width + gap > canvaWidth) {
    swap = false;
    lastY = maxRowH + gap;
    lastTriangle = undefined;
  }

  // rotate every even traingle by 180 deg
  if (swap) t.rotate(t.middlePt, Math.PI);

  const leftMinPt = t.bottonLeftPt;
  t.translate(0, lastY - leftMinPt.y);

  // check offset from last item to calculate x position
  let startPoint: HPoint;
  let compareX: number;
  const topLeftPt = t.topLeftPt;
  const bottonLeftPt = t.bottonLeftPt;
  if (
    lastTriangle &&
    (swap ? t.leftAngle < lastRightAngle : t.leftAngle > lastRightAngle)
  ) {
    const lastTopRight = lastTriangle.topRightPt;
    const vstart = topLeftPt.y >= lastTopRight.y ? lastTopRight : topLeftPt;

    const intersection = intersectionPt(
      { x: 0, y: vstart.y },
      { x: canvaWidth, y: vstart.y },
      bottonLeftPt,
      topLeftPt
    );

    startPoint = intersection ? intersection : topLeftPt;
    compareX = lastTriangle?.topRightPt.x ?? gap;
  } else {
    startPoint = bottonLeftPt;
    compareX = lastTriangle?.bottomRightPt.x ?? gap;
  }

  t.translate(compareX - startPoint.x + gap, 0);

  lastRightAngle = t.rightAngle;
  lastTriangle = t;

  maxRowH = Math.max(t.maxY, maxRowH);
  swap = !swap;

  // add renderd item to scene
  layer.add(createKonvaTriangle(t.pts));
});
//#endregion

//#region rombs
// const rombs = rombsJson.map((rh) => {
//   const romb = new Konva.Line({
//     points: [...rh.Pt1, ...rh.Pt2, ...rh.Pt3, ...rh.Pt4],
//     fill: rombColor,
//     stroke: strokeColor,
//     draggable: true,
//     strokeWidth: strokeWidth,
//     closed: true,
//     name: "poly",
//   });
//   return romb;
// });
// rombs.forEach((rh) => {
//   // layer.add(rh);
// });
//#endregion

//#region circles
// const circles = circlesJson.map((c) => {
//   const circle = new Konva.Circle({
//     radius: c.Radius,
//     fill: circleColor,
//     stroke: strokeColor,
//     strokeWidth: strokeWidth,
//     draggable: true,
//     name: "circ",
//   });

//   circle.x(c.Pt1[0]);
//   circle.y(c.Pt1[1]);
//   return circle;
// });
// circles.forEach((c) => {
//   // layer.add(c);
// });
//#endregion

//#region ellipses
// const ellipses = ellipsesJson.map((e) => {
//   const ellipse = new Konva.Ellipse({
//     x: stage.width() / 2,
//     y: stage.height() / 2,
//     radiusX: e.WidthRadius,
//     radiusY: e.HeightRadius,
//     fill: ellipseColor,
//     stroke: strokeColor,
//     strokeWidth: strokeWidth,
//     draggable: true,
//     name: "elli",
//   });
//   return ellipse;
// });

// ellipses.forEach((e) => {
//   // layer.add(e);
// });
//#endregion

//#region free-space
// console.log("free-space", freeSpace);
freeSpace.forEach((s) => {
  const rect = new Konva.Line({
    points: [s.minx, s.miny, s.minx, s.maxy, s.maxx, s.maxy, s.maxx, s.miny],
    fill: "gray",
    draggable: false,
    strokeWidth: 0,
    closed: true,
    name: "space",
    opacity: 0.5,
  });
  layer.add(rect);
});
//#endregion

addElementManipulation(stage, layer, canvaHeight);
stage.scaleY(-1);
stage.offsetY(canvaHeight);
