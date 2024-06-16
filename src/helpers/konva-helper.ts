import Konva from "konva";
import HPoint from "../models/hpoint";
import { getArrayFromPoints } from "../geometry";

export const gfx = {
  triangleColor: "SeaGreen",
  rectColor: "skyblue",
  rombColor: "orange",
  circleColor: "SaddleBrown",
  ellipseColor: "deeppink",
  strokeColor: "black",
  strokeWidth: 1,
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

export const createKonvaRhomb = (points: HPoint[]) => {
  return new Konva.Line({
    points: getArrayFromPoints(points),
    fill: gfx.rombColor,
    stroke: gfx.strokeColor,
    draggable: true,
    strokeWidth: gfx.strokeWidth,
    closed: true,
    name: "poly",
    opacity: gfx.figureOpacity,
  });
};

export const createKonvaCircle = (radius: number, x: number, y: number) => {
  return new Konva.Circle({
    radius: radius,
    fill: gfx.circleColor,
    stroke: gfx.strokeColor,
    strokeWidth: gfx.strokeWidth,
    opacity: gfx.figureOpacity,
    draggable: true,
    name: "circ",
    x: x,
    y: y,
  });
}

export const createKonvaEllipse = (rx: number, ry: number, x: number, y: number) => {
    const ellipse = new Konva.Ellipse({
      x: x,
      y: y,
      radiusX: rx,
      radiusY: ry,
      fill: gfx.ellipseColor,
      stroke: gfx.strokeColor,
      strokeWidth: gfx.strokeWidth,
      opacity: gfx.figureOpacity,
      draggable: true,
      name: "elli",
    });
    return ellipse;
}

export const createKonvaPoly = (points: HPoint[]) => {
  return new Konva.Line({
    points: getArrayFromPoints(points),
    fill: 'grey',
    stroke: gfx.strokeColor,
    draggable: true,
    strokeWidth: gfx.strokeWidth,
    closed: true,
    name: "poly",
    opacity: gfx.figureOpacity,
  });
};
