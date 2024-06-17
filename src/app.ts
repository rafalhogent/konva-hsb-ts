import Konva from "konva";
import { addElementManipulation } from "./manipulation";
import { mapAndCalculate } from "./nest-calculations";
import { HsbJsonData } from "./models/hsbJsonData";

export const runApp = (
  canvaWidth: number,
  canvaHeight: number,
  gap: number,
  hsbData: HsbJsonData,
  stage: Konva.Stage
) => {
    
  //#region config canva scene
  stage.destroyChildren()
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
};
