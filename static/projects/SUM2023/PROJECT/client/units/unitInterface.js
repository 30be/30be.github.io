import { unitAdd } from "./units.js";
import { vec3 } from "../utils/mth.js";
import { cam } from "../utils/controls.js";
let coords;
function render() {
  document.getElementById("infoButton").onclick = () => {
    document.getElementById("info").style.visibility =
      document.getElementById("info").style.visibility == "visible"
        ? "hidden"
        : "visible";
  };
  document.getElementById("info").style.color = "black";

  let north = new vec3(0, 0, -1);
  document.getElementById("compassBox").style.backgroundPosition =
    (north.angle(new vec3(cam.dir.x, 0, cam.dir.z)) * 1800) / Math.PI +
    400 +
    "px 0px";

  coords.innerHTML =
    "LocX: " +
    cam.loc.x.toString().slice(0, 5) +
    " LocY: " +
    cam.loc.y.toString().slice(0, 5) +
    " LocZ: " +
    cam.loc.z.toString().slice(0, 5) +
    "<br />" +
    " Dir X: " +
    cam.dir.x.toString().slice(0, 5) +
    " Dir Y: " +
    cam.dir.y.toString().slice(0, 5) +
    " Dir Z: " +
    cam.dir.z.toString().slice(0, 5) +
    "<br />" +
    " Up X: " +
    cam.up.x.toString().slice(0, 5) +
    " Up Y: " +
    cam.up.y.toString().slice(0, 5) +
    " Up Z: " +
    cam.up.z.toString().slice(0, 5) +
    "<br />" +
    " At X: " +
    cam.at.x.toString().slice(0, 5) +
    " At Y: " +
    cam.at.y.toString().slice(0, 5) +
    " At Z: " +
    cam.at.z.toString().slice(0, 5) +
    "<br />" +
    " UserDir X: " +
    cam.userDir.x.toString().slice(0, 5) +
    " userDir: " +
    cam.userDir.y.toString().slice(0, 5) +
    " userDir Z: " +
    cam.userDir.z.toString().slice(0, 5) +
    "<br />" +
    " UserLoc X: " +
    cam.userLoc.x.toString().slice(0, 5) +
    " userLoc: " +
    cam.userLoc.y.toString().slice(0, 5) +
    " userLoc Z: " +
    cam.userLoc.z.toString().slice(0, 5) +
    "<br />";
}

async function init() {
  coords = document.getElementById("coords");
}
export function unitInterfaceAdd() {
  unitAdd(init, render, "Interface");
}
