import Konva from "konva";
import HPoint from "../models/hpoint";
import { getArrayFromPoints } from "../geometry";

export const gfx = {
  triangleColor: "#33D267",
  rectColor: "skyblue",
  rombColor: "orange",
  circleColor: "IndianRed",
  ellipseColor: "deeppink",
  strokeColor: "black",
  strokeWidth: 0,
  figureOpacity: 0.7,
};

export const getKonvaPoint = (pt: HPoint) => {
  return new Konva.Circle({
    radius: 2,
    fill: "yellow",
    name: "point",
    x: pt.x,
    y: pt.y,
  });
};

export const createKonvaTriangle = (points: HPoint[]) => {
  return new Konva.Line({
    points: getArrayFromPoints(points),
    fill: gfx.triangleColor,
    stroke: gfx.strokeColor,
    draggable: true,
    strokeWidth: gfx.strokeWidth,
    closed: true,
    name: "poly",
    opacity: gfx.figureOpacity,
  });
};

export const createKonvaRect = (points: HPoint[]) => {
  return new Konva.Line({
    points: getArrayFromPoints(points),
    fill: gfx.rectColor,
    stroke: gfx.strokeColor,
    draggable: true,
    strokeWidth: gfx.strokeWidth,
    closed: true,
    name: "poly",
    opacity: gfx.figureOpacity,
  });
};
