import * as units from "./units/units.js";
import { shaderAdd } from "./rnd/shaders.js";
import { mouse, cam, ControlCamera } from "./utils/controls.js";
import * as controls from "./utils/controls.js";
import { loadObj } from "./rnd/prims.js";

export let gl;
let canvas;
let coords;
window.addEventListener("load", () => {
  canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");

  coords = document.getElementById("coords");

  initGL();
  window.onmousemove = controls.handleMouseMove;
  window.onmouse = controls.handleMouseMove;
  window.onmousedown = controls.handleMouseDown;
  window.onmouseup = controls.handleMouseUp;
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener("wheel", (event) => {
    controls.handleMouseZoom(event);
  });
  window.onscroll = () => window.scroll(0, 0);

  window.addEventListener("keyup", (event) => {
    controls.handleKeyUp(event);
  });
  window.addEventListener("keydown", (event) => {
    controls.handleKeyDown(event);
  });
  document.querySelector("#file").addEventListener("change", loadObj);

  function touchHandler(event) {
    var touches = event.changedTouches,
      first = touches[0],
      type = "";
    switch (event.type) {
      case "touchstart":
        type = "mousedown";
        break;
      case "touchmove":
        type = "mousemove";
        break;
      case "touchend":
        type = "mouseup";
        break;
      default:
        return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
      type,
      true,
      true,
      window,
      1,
      first.screenX,
      first.screenY,
      first.clientX,
      first.clientY,
      false,
      false,
      false,
      false,
      0 /*left*/,
      null
    );

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  }

  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
});

const draw = () => {
  gl.clearColor(0.8, 0.47, 0.3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ControlCamera();
  cam.frameW = canvas.width;
  cam.frameH = canvas.height;
  cam.camSet(cam.loc, cam.at, cam.up);

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
    "<br />";

  units.render();

  mouse.dx = mouse.dy = mouse.dz = 0; //костыль because idk how to see end of mouse move
  window.requestAnimationFrame(draw);
};

export async function initGL() {
  gl.clearColor(1, 1, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  //gl.enable(gl.CULL_FACE);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); /* Delete this mb*/
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ControlCamera();
  cam.frameW = canvas.width;
  cam.frameH = canvas.height;
  cam.camSet(cam.loc, cam.at, cam.up);

  await shaderAdd("default");
  await units.init();
  draw();
}
