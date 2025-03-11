import { unitAdd } from "./units.js";
import { cloth } from "../utils/cloth.js";
import { keys } from "../utils/controls.js";
import { vec3 } from "../utils/mth.js";
import { cam } from "../utils/controls.js";
import { markerDraw } from "../utils/markers.js";

const flag = new cloth();
function handleHardConstraints(someCloth) {
  someCloth.p[0] = cam.userLoc.add(new vec3(0, 1, 0)).sub(cam.userDir.mul(0.5));
  /*
  someCloth.p[1] = cam.userLoc
    .add(new vec3(0, 1.1, 0))
    .sub(cam.userDir.mul(0.5));
  someCloth.p[8] = cam.userLoc.add(new vec3(0, 1.7, 0)).sub(cam.userDir);
  */
  someCloth.p[9] = cam.userLoc.add(new vec3(0, 1.8, 0)).sub(cam.userDir);
}

function render() {
  if (!keys["Space"]) flag.update(10);
  flag.wind = new vec3(0.0003 * Math.sin(Date.now() / 10), 0, 0);
  flag.draw();
  markerDraw(
    cam.userLoc,
    cam.userLoc.add(new vec3(0, 1.8, 0)).sub(cam.userDir),
    0.1
  );
}

async function init() {
  flag.createDefault(10, 10, 0.0001, 0.08, 0.98, 1);
  flag.handleHardConstraints = handleHardConstraints;
}

export function unitClothAdd() {
  unitAdd(init, render, "cloth");
}
