import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";

export const addElementManipulation = (stage: Stage, layer: Layer, canvaHeight: number) => {
  //#region  add a new feature, lets add ability to draw selection rectangle
  var selectionRectangle = new Konva.Rect({
    fill: "rgba(60,60,255,0.2)",
    visible: false,
    // disable events to not interrupt with events
    listening: false,
  });
  layer.add(selectionRectangle);

  var tr = new Konva.Transformer({
    centeredScaling: true,
    rotationSnaps: [0, 90, 180, 270],
    resizeEnabled: false,
  });
  layer.add(tr);

  var x1: number, y1: number, x2, y2;
  var selecting = false;
  stage.on("mousedown touchstart", (e) => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
      return;
    }
    e.evt.preventDefault();
    x1 = stage.getPointerPosition()!.x;
    y1 = stage.getPointerPosition()!.y;
    x2 = stage.getPointerPosition()!.x;
    y2 = stage.getPointerPosition()!.y;

    selectionRectangle.width(0);
    selectionRectangle.height(0);
    selecting = true;
  });

  stage.on("mousemove touchmove", (e) => {
    // do nothing if we didn't start selection
    if (!selecting) {
      return;
    }
    e.evt.preventDefault();
    x2 = stage.getPointerPosition()!.x;
    y2 = stage.getPointerPosition()!.y;

    selectionRectangle.setAttrs({
      visible: true,
      x: Math.min(x1, x2),
      y:  - Math.max(y1, y2) + canvaHeight,
      width: Math.abs(x2 - x1),
      height:  Math.abs(y2 - y1),
    });
  });

  stage.on("mouseup touchend", (e) => {
    // do nothing if we didn't start selection
    selecting = false;
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();
    // update visibility in timeout, so we can check it in click event
    selectionRectangle.visible(false);
    var shapes1 = stage.find('.poly');
    var shapes2 = stage.find('.rect');
    var shapes3 = stage.find('.circ');
    var shapes4 = stage.find('.elli');

    const shapes = [...shapes1, ...shapes2, ...shapes3, ...shapes4]

    var box = selectionRectangle.getClientRect();
    var selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    tr.nodes(selected);
  });

  // clicks should select/deselect shapes
  stage.on("click tap", function (e) {
    // if we are selecting with rect, do nothing
    if (selectionRectangle.visible()) {
      return;
    }

    // if click on empty area - remove all selections
    if (e.target === stage) {
      tr.nodes([]);
      return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
  });

  return tr;
  //#endregion
};
