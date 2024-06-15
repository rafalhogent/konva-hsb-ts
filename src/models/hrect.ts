import HPoint from "./hpoint";

export default class HRect {
  constructor(P1: HPoint, P2: HPoint) {
    this.p1 = P1;
    this.p2 = P2;
  }
  p1: HPoint;
  p2: HPoint;
}
