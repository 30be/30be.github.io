import { gl } from "../main.js";
import { unitAdd } from "./units.js";
import { cam } from "../utils/controls.js";
import { matr4, vec3 } from "../utils/mth.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

const octaVertexPositions = new Float32Array([
  1, 0, 0, 0, 1, 0, 0, 0, 1, -1, 0, 0, 0, -1, 0, 0, 0, -1,
]);
const octaVertexIndices = new Uint16Array([
  0, 1, 2, 0, 2, 4, 4, 2, 3, 3, 2, 1,

  5, 1, 0, 5, 0, 4, 5, 4, 3, 5, 3, 1,
]);

let octaVertexArray;
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
  const lightDirLoc = gl.getUniformLocation(shaderI.shaderProgram, "lightDir");
  const camLocLoc = gl.getUniformLocation(shaderI.shaderProgram, "camLoc");
  const worldLoc = gl.getUniformLocation(shaderI.shaderProgram, "world");
  //  draw octa
  gl.bindVertexArray(octaVertexArray);
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

  gl.uniform1f(timeLoc, Date.now());
  gl.uniform3f(lightDirLoc, 1, 2, 3);
  gl.uniform3f(camLocLoc, cam.loc.x, cam.loc.y, cam.loc.z);

  /* Customiseable stuff */
  gl.uniformMatrix4fv(
    worldLoc,
    false,
    new Float32Array(
      myMatr4
        .rotateY(Math.sin(Date.now() / 1000) * 180)
        .mul(myMatr4.translate(new vec3(3, 0, 0)))
        .a()
        .join()
        .split(",")
    )
  );
  const kaLoc = gl.getUniformLocation(shaderI.shaderProgram, "ka");
  const kdLoc = gl.getUniformLocation(shaderI.shaderProgram, "kd");
  const ksLoc = gl.getUniformLocation(shaderI.shaderProgram, "ks");
  const phLoc = gl.getUniformLocation(shaderI.shaderProgram, "ph");

  gl.uniform3f(kaLoc, 0.05375, 0.05, 0.06625);
  gl.uniform3f(kdLoc, 0.18275, 0.17, 0.22525);
  gl.uniform3f(ksLoc, 0.332741, 0.328634, 0.346435);
  gl.uniform1f(phLoc, 38.4);

  gl.drawElements(
    gl.TRIANGLES,
    24, // num vertices to process
    gl.UNSIGNED_SHORT, // type of indices
    0 // offset on bytes to indices
  );
}
async function init() {
  /* Octa */

  shaderI = await shaderAdd("withLight");
  octaVertexArray = gl.createVertexArray();
  gl.bindVertexArray(octaVertexArray);
  useShader(shaderI, octaVertexPositions, octaVertexIndices);
  gl.bindVertexArray(null);

  /* aaa */
}
export function unitOctaAdd() {
  unitAdd(init, render, "Octahedron");
}
