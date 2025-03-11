import { gl } from "./main.js";
import { unitAdd } from "./units.js";
import { cam } from "./controls.js";
import { matr4, vec3 } from "./mth.js";
import { shaderAdd } from "./shaders.js";

const PHI = 1.6180339887;

const dodeVertexPositions = new Float32Array([
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
const dodeVertexIndices = new Uint16Array([
    0, 2, 1, 0, 1, 4, 0, 4, 8, 0, 8, 3, 0, 3, 2,

    11, 8, 4, 11, 4, 6, 11, 6, 9, 11, 9, 10, 11, 10, 9,

    7, 3, 10, 7, 10, 9, 7, 9, 5, 7, 5, 2, 7, 2, 3,

    2, 5, 1, 1, 5, 6, 5, 6, 9, 10, 3, 8, 1, 4, 6,
]);

let dodeVertexArray;
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
    //  draw dode
    gl.bindVertexArray(dodeVertexArray);
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
            myMatr4.translate(new vec3(-3, 0, 0)).a().join().split(",")
        )
    );
    gl.uniform1f(timeLoc, Date.now());

    gl.drawElements(
        gl.TRIANGLES,
        108, // num vertices to process
        gl.UNSIGNED_SHORT, // type of indices
        0 // offset on bytes to indices
    );
}
async function init() {
    /* Dode */
    shaderI = await shaderAdd();
    dodeVertexArray = gl.createVertexArray();
    gl.bindVertexArray(dodeVertexArray);

    let posLoc = gl.getAttribLocation(shaderI.shaderProgram, "in_pos");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, dodeVertexPositions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, dodeVertexIndices, gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    /* aaa */
}
export function unitDodeAdd() {
    unitAdd(init, render);
}
