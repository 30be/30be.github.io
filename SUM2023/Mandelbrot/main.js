import * as units from "./units.js";
import { shaderAdd } from "./shaders.js";
import { mouse, cam, ControlCamera } from "./controls.js";

const canvas = document.getElementById("glCanvas");
export const gl = canvas.getContext("webgl2");

const coords = document.getElementById("coords");

const draw = () => {
    gl.clearColor(0.8, 0.47, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ControlCamera();
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
    await shaderAdd("default");
    await units.init();
    draw();
}
