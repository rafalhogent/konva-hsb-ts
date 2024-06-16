export class HsbJsonData {
  HsbTrianglesList: HsbTriangle[] = [];
  HsbRectanglesList: HsbRectangle[] = [];
  HsbCirclesList: HsbCircle[] = [];
  HsbEllipsesList: HsbEllipse[] = [];
  HsbRhombusList: HsbRhomb[] = [];
}

export type HsbTriangle = {
  Id: number;
  ShapeType: number;
  Pt1: number[];
  Pt2: number[];
  Pt3: number[];
  Area: number;
  GeometricCenterPoint: number[];
};
export type HsbRectangle = {
  Id: number;
  ShapeType: number;
  Pt1: number[];
  Pt2: number[];
  Pt3: number[];
  Pt4: number[];
  GeometricCenterPoint: number[];
  Area: number;
};
export type HsbCircle = {
  Id: number;
  ShapeType: number;
  PtUbication: number[];
  Pt1: number[];
  Radius: number;
  Area: number;
  GeometricCenterPoint: number[];
};
export type HsbEllipse = {
  Id: number;
  ShapeType: number;
  PtUbication: number[];
  Pt1: number[];
  Pt2: number[];
  WidthDiameter: number;
  HeigthDiameter: number;
  WidthRadius: number;
  HeightRadius: number;
  Area: number;
  GeometricCenterPoint: number[];
};
export type HsbRhomb = {
  Id: number;
  ShapeType: number;
  Pt1: number[];
  Pt2: number[];
  Pt3: number[];
  Pt4: number[];
  Area: number;
  GeometricCenterPoint: number[];
};
