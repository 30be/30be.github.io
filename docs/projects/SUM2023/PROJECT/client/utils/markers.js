import { gl } from "../main.js";
import { unitAdd } from "../units/units.js";
import { matr4, vec3, vec4 } from "../utils/mth.js";
import { cam } from "../utils/controls.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

const cubeVertexPositions = new Float32Array([
  0, 1, 0, 0, 0, 0.5, 0, 0, -0.5,

  0, 1, 0, 0.5, 0, 0, -0.5, 0, 0,
]);

let matrices = [];
let worldLoc;
let colorLoc;
let cubeVertexArray;
let shaderI;
function render() {
  gl.useProgram(shaderI.shaderProgram);
  gl.bindVertexArray(cubeVertexArray);

  const projectionLoc = gl.getUniformLocation(
    shaderI.shaderProgram,
    "projection"
  );
  const modelViewLoc = gl.getUniformLocation(
    shaderI.shaderProgram,
    "modelView"
  );
  worldLoc = gl.getUniformLocation(shaderI.shaderProgram, "world");
  colorLoc = gl.getUniformLocation(shaderI.shaderProgram, "color");
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

  let color = new vec4(0.8, 0.47, 0.3, 1);
  gl.uniform4f(colorLoc, color.x, color.y, color.z, color.w);

  matrices.forEach((it) => {
    gl.uniformMatrix4fv(worldLoc, false, it);
    gl.drawArrays(
      gl.TRIANGLES,
      0,
      6 // num vertices to process
      // gl.UNSIGNED_SHORT, // type of indices
      //0 // offset on bytes to indice
    );
  });
  matrices = [];
}

async function init() {
  /* Tetr */
  shaderI = await shaderAdd("markers");
  cubeVertexArray = gl.createVertexArray();
  gl.bindVertexArray(cubeVertexArray);
  useShader(shaderI, cubeVertexPositions);
  gl.bindVertexArray(null);
}

export function unitMrkAdd() {
  unitAdd(init, render, "Marker system");
}

export function markerDraw(
  start = new vec3(0),
  end = new vec3(100),
  width = 1
  //   color = new vec4(1, 0, 1, 1)
) {
  let myMatr4 = new matr4();
  let up = new vec3(0, 1, 0);
  //let right = new vec3(0, 0, 1);

  let centered = end.sub(start);
  matrices.push(
    new Float32Array(
      myMatr4
        .scale(new vec3(width, centered.len(), width))
        /*.mul(
          myMatr4.rotateZ(
            (up.angle(new vec3(centered.x, centered.y, 0), right) * 180) /
              Math.PI
          )
        )
        .mul(
          myMatr4.rotateY(
            90 +
              (right.angle(new vec3(centered.x, 0, centered.z)) * 180) / Math.PI
          )
        )*/
        .mul(
          myMatr4.rotate(180, centered.normalize().lerp(up, 0.5).normalize())
        )
        .mul(myMatr4.translate(start))
        .a()
        .join()
        .split(",")
    )
  );
}
