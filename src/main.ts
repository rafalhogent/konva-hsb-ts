// import { addElementManipulation } from "./manipulation";
import Konva from "konva";
import data from "../src/data/hsbExam.json";
// import { mapAndCalculate } from "./nest-calculations";
import { HsbJsonData } from "./models/hsbJsonData";
import { runApp } from "./app";
// import { stages } from "konva/lib/Stage";

//#region prepere data
const hsbData: HsbJsonData = data[0];
const rectsOrg = [...hsbData.HsbRectanglesList];
const ellipOrg = [...hsbData.HsbEllipsesList];
const triasOrg = [...hsbData.HsbTrianglesList];
const rhombOrg = [...hsbData.HsbRhombusList];
const circlOrg = [...hsbData.HsbCirclesList];
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

// add some random ellipses
// for (let idx = 0; idx < 5; idx++) {
//   const randoM = Math.floor(Math.random() * hsbData.HsbEllipsesList.length);
//   hsbData.HsbEllipsesList.push(hsbData.HsbEllipsesList[randoM]);
// }

// add some random rhombes
// for (let idx = 0; idx < 2; idx++) {
//   const randoM = Math.floor(Math.random() * hsbData.HsbRhombusList.length);
//   hsbData.HsbRhombusList.push(hsbData.HsbRhombusList[randoM]);
// }

//#endregion


//#region buttonsactions
const rectAddBtn = document.getElementById("btnAddRect");
const rectMinBtn = document.getElementById("btnMinRect");

if (rectAddBtn) {
  rectAddBtn.onclick = () => {
    const randoM = Math.floor(
      Math.random() * rectsOrg.length
    );
    hsbData.HsbRectanglesList.push(rectsOrg[randoM]);
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

if (rectMinBtn) {
  rectMinBtn.onclick = () => {
    hsbData.HsbRectanglesList.pop();
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

const triAddBtn = document.getElementById("btnAddTri");
const triMinBtn = document.getElementById("btnMinTri");

if (triAddBtn) {
  triAddBtn.onclick = () => {
    const randoM = Math.floor(
      Math.random() * triasOrg.length
    );
    hsbData.HsbTrianglesList.push(triasOrg[randoM]);
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

if (triMinBtn) {
  triMinBtn.onclick = () => {
    hsbData.HsbTrianglesList.pop();
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

const eliAddBtn = document.getElementById("btnAddElli");
const eliMinBtn = document.getElementById("btnMinElli");

if (eliAddBtn) {
  eliAddBtn.onclick = () => {
    const randoM = Math.floor(
      Math.random() * ellipOrg.length
    );
    hsbData.HsbEllipsesList.push(ellipOrg[randoM]);
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

if (eliMinBtn) {
  eliMinBtn.onclick = () => {
    hsbData.HsbEllipsesList.pop();
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}


const rhoAddBtn = document.getElementById("btnAddrhomb");
const rhoMinBtn = document.getElementById("btnMinrhomb");

if (rhoAddBtn) {
  rhoAddBtn.onclick = () => {
    const randoM = Math.floor(
      Math.random() * rhombOrg.length
    );
    hsbData.HsbRhombusList.push(rhombOrg[randoM]);
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

if (rhoMinBtn) {
  rhoMinBtn.onclick = () => {
    hsbData.HsbRhombusList.pop();
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}


const btnAddCircle = document.getElementById("btnAddCircle");
const btnMinCircle = document.getElementById("btnMinCircle");

if (btnAddCircle) {
  btnAddCircle.onclick = () => {
    const randoM = Math.floor(
      Math.random() * circlOrg.length
    );
    hsbData.HsbCirclesList.push(circlOrg[randoM]);
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

if (btnMinCircle) {
  btnMinCircle.onclick = () => {
    hsbData.HsbCirclesList.pop();
    runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
  };
}

//#endregion



//#region config
var gap = 2;
var canvaWidth = 900;
var canvaHeight = 610;
//#endregion
var stage = new Konva.Stage({
  container: "container",
  width: canvaWidth,
  height: canvaHeight,
});

runApp(canvaWidth, canvaHeight, gap, hsbData, stage);
