import HPoint from "./hpoint";
import HPolygon from "./hPolygon";

export default class HTriangle extends HPolygon {
  constructor(pts: HPoint[]) {
    super(pts);
  }
}
