import { gl } from "../main.js";
import { unitAdd } from "./units.js";
import { shaderAdd } from "../rnd/shaders.js";
import { mouse, cam } from "../utils/controls.js";

let pos = [];
let shaderProgram;
let fracVertexArray;
const rcoeff = document.getElementById("rcoeff");
const gcoeff = document.getElementById("gcoeff");
const bcoeff = document.getElementById("bcoeff");
const a = document.getElementById("a");
const b = document.getElementById("b");
let startTime = Date.now();
function render() {
  //  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.disable(gl.DEPTH_TEST);
  gl.bindVertexArray(fracVertexArray);
  gl.useProgram(shaderProgram.shaderProgram);
  let timeLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "time");
  let xLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "x");
  let yLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "y");
  let zoom = gl.getUniformLocation(shaderProgram.shaderProgram, "zoom");
  let rcoeffLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "rcoeff");
  let gcoeffLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "gcoeff");
  let bcoeffLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "bcoeff");
  let aLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "a");
  let bLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "b");
  gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
  gl.uniform1f(yLoc, 0.4);
  gl.uniform1f(xLoc, -0.75);
  gl.uniform1f(zoom, 6);
  gl.uniform1f(rcoeffLoc, rcoeff.value);
  gl.uniform1f(gcoeffLoc, gcoeff.value);
  gl.uniform1f(bcoeffLoc, bcoeff.value);
  gl.uniform1f(aLoc, a.value);
  gl.uniform1f(bLoc, b.value * 5);
  gl.useProgram(shaderProgram.shaderProgram);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.enable(gl.DEPTH_TEST);
}
async function init() {
  fracVertexArray = gl.createVertexArray();
  gl.bindVertexArray(fracVertexArray);
  shaderProgram = await shaderAdd("mandelbrot");
  pos = [-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0];

  let posLoc = gl.getAttribLocation(shaderProgram.shaderProgram, "in_pos");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  /* aaa */
}
export function unitFracAdd() {
  unitAdd(init, render, "fract");
}
