import Konva from "konva";
import HPoint from "../models/hpoint";

export const getKonvaPoint = (pt: HPoint) => {
  return new Konva.Circle({
    radius: 2,
    fill: "yellow",
    name: "point",
    x: pt.x,
    y: pt.y
  });
};
