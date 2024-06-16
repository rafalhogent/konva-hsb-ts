import { addElementManipulation } from "./manipulation";
import Konva from "konva";
import data from "../src/data/hsbExam.json";
import { mapAndCalculate } from "./nest-calculations";
import { HsbJsonData } from "./models/hsbJsonData";

//#region prepere data
const hsbData: HsbJsonData = data[0];

// add some extra rects ...
// for (let idx = 0; idx < 2; idx++) {
//   const randoM = Math.floor(Math.random() * hsbData.HsbRectanglesList.length);
//   hsbData.HsbRectanglesList.push(hsbData.HsbRectanglesList[randoM]);
// }

// add some random triangles
// for (let idx = 0; idx < 2; idx++) {
//   const randoM = Math.floor(Math.random() * hsbData.HsbTrianglesList.length);
//   hsbData.HsbTrianglesList.push(hsbData.HsbTrianglesList[randoM]);
// }

//#endregion

//#region config
var gap = 5;
var canvaWidth = 900;
var canvaHeight = 610;
//#endregion

//#region config canva scene
var stage = new Konva.Stage({
  container: "container",
  width: canvaWidth,
  height: canvaHeight,
});

var layer = new Konva.Layer();
stage.add(layer);
//#endregion

// calculate and render
mapAndCalculate(hsbData, canvaHeight, canvaWidth, gap, layer);

// add manipulation events and Transformer to allow user 
// manipulate items after nesting
addElementManipulation(stage, layer, canvaHeight);

// mirror stage to locate OXOY point botton left
stage.scaleY(-1);
stage.offsetY(canvaHeight);
