import { gl } from "../main.js";
import { unitAdd } from "./units.js";
import { cam } from "../utils/controls.js";
import { matr4, vec3 } from "../utils/mth.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

const PHI = 1.6180339887;

const icoVertexPositions = new Float32Array([
  0,
  1,
  PHI,
  1,
  PHI,
  0,
  PHI,
  0,
  1,

  0,
  -1,
  PHI,
  -1,
  PHI,
  0,
  PHI,
  0,
  -1,

  0,
  1,
  -PHI,
  1,
  -PHI,
  0,
  -PHI,
  0,
  1,

  0,
  -1,
  -PHI,
  -1,
  -PHI,
  0,
  -PHI,
  0,
  -1,
]);

const icoVertexIndices = new Uint16Array([
  0, 2, 1, 0, 1, 4, 0, 4, 8, 0, 8, 3, 0, 3, 2,

  11, 8, 4, 11, 4, 6, 11, 6, 9, 11, 9, 10, 11, 10, 9,

  7, 3, 10, 7, 10, 9, 7, 9, 5, 7, 5, 2, 7, 2, 3,

  2, 5, 1, 1, 5, 6, 5, 6, 9, 10, 3, 8, 1, 4, 6,
]);

let icoVertexArray;
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
  //  draw ico
  gl.bindVertexArray(icoVertexArray);
  gl.uniformMatrix4fv(
    projectionLoc,
    false,
    new Float32Array(cam.matrProj.a().join().split(","))
  );
  gl.uniformMatrix4fv(
    modelViewLoc,
    false,
    new Float32Array(cam.matrView.a().join().split(","))
  );
  let myMatr4 = new matr4();
  gl.uniformMatrix4fv(
    worldLoc,
    false,
    new Float32Array(
      myMatr4
        .rotateX(Date.now() / 10)
        .mul(myMatr4.translate(new vec3(-3, 0, 0)))
        .a()
        .join()
        .split(",")
    )
  );
  const camLocLoc = gl.getUniformLocation(shaderI.shaderProgram, "camLoc");
  const lightDirLoc = gl.getUniformLocation(shaderI.shaderProgram, "lightDir");

  gl.uniform3f(lightDirLoc, 1, 1, 1);
  gl.uniform3f(camLocLoc, cam.loc.x, cam.loc.y, cam.loc.z);
  /* Customiseable stuff */

  const kaLoc = gl.getUniformLocation(shaderI.shaderProgram, "ka");
  const kdLoc = gl.getUniformLocation(shaderI.shaderProgram, "kd");
  const ksLoc = gl.getUniformLocation(shaderI.shaderProgram, "ks");
  const phLoc = gl.getUniformLocation(shaderI.shaderProgram, "ph");
  gl.uniform3f(
    kaLoc,
    Math.sin(Date.now() / 500) / 4 + 0.25,
    Math.cos(Date.now() / 300) / 4 + 0.25,
    Math.sin(Date.now() / 1000 + 5) / 4 + 0.25
  );
  gl.uniform3f(kdLoc, 0.07568, 0.61424, 0.07568);
  gl.uniform3f(ksLoc, 0.633, 0.727811, 0.633);
  gl.uniform1f(phLoc, 76.8);

  gl.uniform1f(timeLoc, Date.now());

  gl.drawElements(
    gl.TRIANGLES,
    60, // num vertices to process
    gl.UNSIGNED_SHORT, // type of indices
    0 // offset on bytes to indices
  );
}
async function init() {
  /* Ico */
  shaderI = await shaderAdd("withLight");
  icoVertexArray = gl.createVertexArray();
  gl.bindVertexArray(icoVertexArray);
  useShader(shaderI, icoVertexPositions, icoVertexIndices);
  gl.bindVertexArray(null);
  //gl.shaderModel(gl.FLAT);
  /* aaa */
}
export function unitIcoAdd() {
  unitAdd(init, render, "Icosahedron");
}
