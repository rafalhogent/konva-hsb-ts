import HPoint from "./hpoint";

export default class HEllipse {
  constructor(x: number, y: number, rWidth: number, rHeigth: number) {
    this.rWidth = rWidth;
    this.rHeight = rHeigth;
    this.x = x;
    this.y = y;
  }
  rWidth: number;
  rHeight: number;
  x: number;
  y: number;

  get centerPt() {
    return new HPoint(this.x, this.y);
  }

  get width() {
    return 2 * this.rWidth;
  }

  get height() {
    return 2 * this.rHeight;
  }

  translateToPoint(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
