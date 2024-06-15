export default class HSpace {
  constructor(minx: number, miny: number, maxx: number, maxy: number) {
    this.minx = minx;
    this.maxx = maxx;
    this.miny = miny;
    this.maxy = maxy;
  }
  maxx: number;
  miny: number;
  maxy: number;
  minx: number;
}
