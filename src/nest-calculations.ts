import { getPointsFromArray, intersectionPt } from "./geometry";
import { HsbJsonData, HsbRhomb } from "./models/hsbJsonData";
import HPolygon from "./models/hPolygon";
import HCircle from "./models/hCircle";
import HEllipse from "./models/hEllipse";
import HSpace from "./models/hspace";
import HTriangle from "./models/htriangle";
import Konva from "konva";
import HPoint from "./models/hpoint";
import HRect from "./models/hrect";
import {
  createKonvaCircle,
  createKonvaEllipse,
  // createKonvaPoly,
  createKonvaRect,
  createKonvaRhomb,
  createKonvaTriangle,
  // getKonvaPoint,
} from "./helpers/konva-helper";

export const mapAndCalculate = (
  jsonData: HsbJsonData,
  canvaHeight: number,
  canvaWidth: number,
  gap: number,
  layer: Konva.Layer
) => {
  const freeSpace: HSpace[] = [];

  let lastX = gap;
  let lastY = gap;
  let maxRowH = gap;

  //#region rects
  const rectangles: HRect[] = jsonData.HsbRectanglesList.map((t: any) => {
    const pointsInts = [...t.Pt1, ...t.Pt2, ...t.Pt3, ...t.Pt4];
    const rc = new HRect(getPointsFromArray(pointsInts));
    rc.orientAlongXAx();
    return rc;
  });

  rectangles.sort((a, b) => b.width - a.width);

  rectangles.forEach((rc) => {
    const rcWidth = rc.width;

    // check remaining row space
    if (rcWidth + gap + lastX > canvaWidth) {
      // create remaining free space on row last item
      const remainingRowSpace = new HSpace([
        { x: lastX, y: lastY },
        { x: lastX, y: maxRowH },
        { x: canvaWidth, y: maxRowH },
        { x: canvaWidth, y: lastY },
      ]);
      freeSpace.push(remainingRowSpace);
      lastX = gap;
      lastY = maxRowH + gap;
    }

    rc.translate(lastX - rc.minX, lastY - rc.minY);

    lastX = rc.rightBottomPt.x + gap;

    maxRowH = Math.max(maxRowH, rc.topRightPt.y);
    layer.add(createKonvaRect(rc.pts));
  });
  // const remainingRowSpace = new HSpace(lastX, lastY, canvaWidth - gap, maxRowH);
  const remainingRowSpaceRects = new HSpace([
    { x: lastX, y: lastY },
    { x: lastX, y: maxRowH },
    { x: canvaWidth, y: maxRowH },
    { x: canvaWidth, y: lastY },
  ]);
  freeSpace.push(remainingRowSpaceRects);
  lastY = maxRowH + gap;
  //#endregion

  //#region triangles
  const triangles: HTriangle[] = jsonData.HsbTrianglesList.map((t: any) => {
    const pointsInts = [...t.Pt1, ...t.Pt2, ...t.Pt3];
    const tri = new HTriangle(getPointsFromArray(pointsInts));
    tri.orientAlongXAx();
    return tri;
  });

  triangles.sort((a, b) => b.rightAngle - a.rightAngle);

  let swap = false;
  let lastTriangle: HTriangle | undefined;

  triangles.forEach((t) => {
    let lastRightAngle = lastTriangle?.rightAngle ?? Math.PI;

    // if too many triangles,  move to next row up
    if (lastTriangle && lastTriangle.maxX + t.width + gap > canvaWidth) {
      swap = false;
      lastY = maxRowH + gap;
      const remainingRowSpaceTriangles = new HSpace([
        lastTriangle ? lastTriangle.bottomRightPt : { x: lastX, y: lastY },
        lastTriangle ? lastTriangle.topRightPt : { x: lastX, y: lastY },
        { x: canvaWidth, y: maxRowH },
        { x: canvaWidth, y: lastY },
      ]);
      freeSpace.push(remainingRowSpaceTriangles);
      lastTriangle = undefined;
    }

    // rotate every even traingle by 180 deg
    if (swap) t.rotate(t.middlePt, Math.PI);

    const leftMinPt = t.bottonLeftPt;
    t.translate(0, lastY - leftMinPt.y);

    // check offset from last item to calculate x position
    let startPoint: HPoint;
    let compareX: number;
    const topPt = t.topLeftPt;
    const bottonLeftPt = t.bottonLeftPt;
    if (
      lastTriangle &&
      (swap ? t.leftAngle < lastRightAngle : t.leftAngle > lastRightAngle)
    ) {
      const lastTopRight = lastTriangle.topRightPt;
      const vstart = topPt.y >= lastTopRight.y ? lastTopRight : topPt;

      const intersection = intersectionPt(
        { x: 0, y: vstart.y },
        { x: canvaWidth, y: vstart.y },
        bottonLeftPt,
        topPt
      );

      startPoint = intersection ? intersection : topPt;
      compareX = lastTriangle?.topRightPt.x ?? 0;
    } else {
      startPoint = bottonLeftPt;
      compareX = lastTriangle?.bottomRightPt.x ?? 0;
    }

    t.translate(compareX - startPoint.x + gap, 0);

    lastRightAngle = t.rightAngle;
    lastTriangle = t;

    maxRowH = Math.max(t.maxY, maxRowH);
    swap = !swap;

    // add rendered item to scene
    layer.add(createKonvaTriangle(t.pts));
  });
  const remainingRowSpaceTriangles = new HSpace([
    // lastTriangle ? lastTriangle.bottomRightPt : { x: lastX, y: lastY },
    // lastTriangle ? lastTriangle.topRightPt : { x: lastX, y: lastY },
    lastTriangle ? { x: lastTriangle.maxX, y: lastY } : { x: lastX, y: lastY },
    lastTriangle
      ? { x: lastTriangle.maxX, y: maxRowH }
      : { x: lastX, y: lastY },
    { x: canvaWidth, y: maxRowH },
    { x: canvaWidth, y: lastY },
  ]);
  freeSpace.push(remainingRowSpaceTriangles);
  //#endregion

  lastY = maxRowH + gap;
  lastX = gap;

  //#region ellipses
  const ellipses = jsonData.HsbEllipsesList.map((e) => {
    const wth = Math.min(e.WidthRadius, e.HeightRadius);
    const hth = Math.max(e.WidthRadius, e.HeightRadius);
    return new HEllipse(canvaWidth / 2, canvaHeight / 2, wth, hth);
  });

  ellipses.sort((a, b) => {
    return b.rHeight - a.rHeight;
  });

  const ellipseLocalFreeSpace: HSpace[] = [];
  ellipses.forEach((e) => {
    let ellipsePlaced = false;
    // check place in remaining local free-spaces
    const ellipsLocalSpacesFiltered = ellipseLocalFreeSpace.filter(
      (s) => s.height - e.height > 0
    );

    if (ellipsLocalSpacesFiltered.length) {
      for (let idx = 0; idx < ellipsLocalSpacesFiltered.length; idx++) {
        const space = ellipsLocalSpacesFiltered[idx];
        if (!space.lastX) space.lastX = space.bottonLeftPt.x + gap;

        if (
          space.maxX - gap - space.lastX > e.width &&
          space.height - 2 * gap > e.height + gap
        ) {
          e.translateToPoint(
            space.lastX + e.rWidth,
            space.minY + e.rHeight + gap
          );
          space.lastX = e.x + e.rWidth * 2 + gap;
          ellipsePlaced = true;
          layer.add(createKonvaEllipse(e.rWidth, e.rHeight, e.x, e.y));
          break;
        }
      }
    }
    if (ellipsePlaced) return;

    e.x = lastX + gap + e.rWidth;
    e.y = lastY + gap + e.rHeight;

    layer.add(createKonvaEllipse(e.rWidth, e.rHeight, e.x, e.y));
    maxRowH = Math.max(maxRowH, e.y + e.rHeight);
    lastX = lastX + gap + e.width;
    if (e.y + e.rHeight + gap < canvaHeight) {
      ellipseLocalFreeSpace.push(
        new HSpace([
          { x: e.x - e.rWidth, y: e.y + e.rHeight },
          { x: e.x - e.rWidth, y: canvaHeight },
          { x: e.x + e.rWidth, y: canvaHeight },
          { x: e.x + e.rWidth, y: e.y + e.rHeight },
        ])
      );
    }
  });

  const ellipseFreeRowSpace = new HSpace([
    { x: lastX, y: lastY },
    { x: lastX, y: canvaHeight },
    { x: canvaWidth, y: canvaHeight },
    { x: canvaWidth, y: lastY },
  ]);
  freeSpace.push(ellipseFreeRowSpace);
  //#endregion

  //#region rombs
  const rhombs: HPolygon[] = jsonData.HsbRhombusList.map((t: HsbRhomb) => {
    const pointsInts = [...t.Pt1, ...t.Pt2, ...t.Pt3, ...t.Pt4];
    const rho = new HPolygon(getPointsFromArray(pointsInts));
    rho.orientAlongXAx();
    return rho;
  });

  rhombs.sort((a, b) => b.height - a.height);

  rhombs.forEach((rh) => {
    const spaces = [...freeSpace];
    const spacesFIltered = spaces.filter((s) => s.height - rh.height > 0);
    spacesFIltered.sort((a, b) => {
      return a.height - rh.height - (b.height - rh.height);
    });

    if (spacesFIltered.length) {
      for (let idx = 0; idx < spacesFIltered.length; idx++) {
        const space = spacesFIltered[idx];
        if (!space.lastX) space.lastX = space.bottonLeftPt.x + gap;
        if (space.maxX - gap - space.lastX > rh.width) {
          rh.translate(space.lastX - rh.minX, space.minY - rh.minY + gap);
          space.lastX = rh.maxX + gap;
          break;
        }
      }
    }

    layer.add(createKonvaRhomb(rh.pts));
  });
  //#endregion

  //#region circles
  const circles = jsonData.HsbCirclesList.map((c) => {
    return new HCircle(c.Pt1[0], c.Pt1[1], c.Radius);
  });
  circles.sort((a,b) => b.diameter - a.diameter)

  circles.forEach((c) => {
    const spaces = [...freeSpace];
    const spacesFIltered = spaces.filter(
      (s) => s.height - 2 * c.radius > 0 && s.width - 2 * c.radius > 0
    );
    spacesFIltered.sort((a, b) => {
      return b.height - a.height;
    });
    if (spacesFIltered.length) {
      for (let idx = 0; idx < spacesFIltered.length; idx++) {
        const space = spacesFIltered[idx];
        if (!space.lastX) space.lastX = space.bottonLeftPt.x + gap;
        if (space.maxX - gap - space.lastX > c.diameter) {
          c.translate(space.lastX - c.minX, space.minY - c.minY + gap);
          layer.add(createKonvaCircle(c.radius, c.x, c.y));
          space.lastX = c.maxX + gap;
          break;
        }
      }
    }
  });
  //#endregion

  //#region free-space
  // freeSpace.forEach((s) => {
  //   // layer.add(createKonvaPoly(s.pts));
  // });
  //#endregion
};
