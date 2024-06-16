import HPoint from "./hpoint";

export default class HCircle {
  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  x: number;
  y: number;
  radius: number;

  get centerPt() {
    return new HPoint(this.x, this.y);
  }
  get minX() {
    return this.x - this.radius;
  }
  get maxX() {
    return this.x + this.radius;
  }
  get minY() {
    return this.y - this.radius;
  }
  get maxY() {
    return this.y + this.radius;
  }

  get diameter() {
    return this.radius * 2;
  }

  translate = (deltaX: number, deltaY: number) => {
    this.x = this.x + deltaX;
    this.y = this.y + deltaY;
  };
}
