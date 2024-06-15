export class HVector {
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  constructor(p1x: number, p1y: number, p2x: number, p2y: number) {
    this.p1x = p1x;
    this.p1y = p1y;
    this.p2x = p2x;
    this.p2y = p2y;
  }

  get length() {
    const len = Math.sqrt(
      Math.pow(this.p2x - this.p1x, 2) + Math.pow(this.p2y - this.p1y, 2)
    );
    return len;
  }
}
