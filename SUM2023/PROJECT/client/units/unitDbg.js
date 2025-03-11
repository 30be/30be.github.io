import { unitAdd } from "./units.js";
import { vec3, vec4 } from "../utils/mth.js";
import { markerDraw } from "../utils/markers.js";
import { cam } from "../utils/controls.js";

function render() {
  markerDraw(
    new vec3(0, 0, 0),
    cam.userLoc.sub(new vec3(0, 1, 0)),
    1,
    new vec4(0.5, 0, 0.3, 1)
  );
  markerDraw(
    new vec3(0, 0, 0),
    new vec3(10, 10, 10),
    1,
    new vec4(0.5, 0, 0.3, 1)
  );
}
async function init() {}
export function unitDbgAdd() {
  unitAdd(init, render, "Debug");
}
