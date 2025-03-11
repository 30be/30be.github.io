import { gl } from "../main.js";
import { unitAdd } from "./units.js";
import { matr4 } from "../utils/mth.js";
import { cam } from "../utils/controls.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

const cubeVertexPositions = new Float32Array([
  1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,
  -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1,
  1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1,
  -1, -1, -1, -1, -1,
]);
const cubeVertexIndices = new Uint16Array([
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
  15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
]);

let cubeVertexArray;
let shaderI;
function render() {
  gl.useProgram(shaderI.shaderProgram);
  let timeLoc = gl.getUniformLocation(shaderI.shaderProgram, "time");
  const projectionLoc = gl.getUniformLocation(
    shaderI.shaderProgram,
    "projection"
  );
  const modelViewLoc = gl.getUniformLocation(
    shaderI.shaderProgram,
    "modelView"
  );
  const worldLoc = gl.getUniformLocation(shaderI.shaderProgram, "world");
  //  draw cube
  gl.bindVertexArray(cubeVertexArray);
  gl.uniformMatrix4fv(
    projectionLoc,
    false,
    new Float32Array(cam.matrProj.a().join().split(","))
  );
  let myMatr4 = new matr4();
  gl.uniformMatrix4fv(
    worldLoc,
    false,
    new Float32Array(myMatr4.a().join().split(","))
  );
  gl.uniformMatrix4fv(
    modelViewLoc,
    false,
    new Float32Array(cam.matrView.a().join().split(","))
  );
  gl.uniform1f(timeLoc, Date.now());

  const lightDirLoc = gl.getUniformLocation(shaderI.shaderProgram, "lightDir");
  const camLocLoc = gl.getUniformLocation(shaderI.shaderProgram, "camLoc");
  gl.uniform3f(lightDirLoc, 1, 2, 3);
  gl.uniform3f(camLocLoc, cam.loc.x, cam.loc.y, cam.loc.z);
  /* Customiseable stuff */

  const kaLoc = gl.getUniformLocation(shaderI.shaderProgram, "ka");
  const kdLoc = gl.getUniformLocation(shaderI.shaderProgram, "kd");
  const ksLoc = gl.getUniformLocation(shaderI.shaderProgram, "ks");
  const phLoc = gl.getUniformLocation(shaderI.shaderProgram, "ph");
  gl.uniform3f(kaLoc, 0.0215, 0.1745, 0.0215);
  gl.uniform3f(kdLoc, 0.07568, 0.61424, 0.07568);
  gl.uniform3f(ksLoc, 0.633, 0.727811, 0.633);
  gl.uniform1f(phLoc, 76.8);

  gl.drawElements(
    gl.TRIANGLES,
    36, // num vertices to process
    gl.UNSIGNED_SHORT, // type of indices
    0 // offset on bytes to indices
  );
}
async function init() {
  /* Cube */
  shaderI = await shaderAdd("rainbow");
  cubeVertexArray = gl.createVertexArray();
  gl.bindVertexArray(cubeVertexArray);
  useShader(shaderI, cubeVertexPositions, cubeVertexIndices);
  gl.bindVertexArray(null);
  /* aaa */
}
export function unitCubeAdd() {
  unitAdd(init, render, "cube");
}
