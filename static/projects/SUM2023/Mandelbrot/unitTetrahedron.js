import { gl } from "./main.js";
import { unitAdd } from "./units.js";
import { cam } from "./controls.js";
import { matr4, vec3 } from "./mth.js";
import { shaderAdd, useShader } from "./shaders.js";

const tetrVertexPositions = new Float32Array([
    1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1, 1,
]);
const tetrVertexIndices = new Uint16Array([0, 3, 1, 0, 2, 3, 0, 1, 2, 3, 2, 1]);

let tetrVertexArray;
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
    //  draw tetr
    gl.bindVertexArray(tetrVertexArray);
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
                .rotateZ(Date.now() / 30)
                .mul(myMatr4.translate(new vec3(0, 3, 0)))
                .a()
                .join()
                .split(",")
        )
    );
    /* more complicated*/

    const lightDirLoc = gl.getUniformLocation(
        shaderI.shaderProgram,
        "lightDir"
    );
    const camLocLoc = gl.getUniformLocation(shaderI.shaderProgram, "camLoc");
    gl.uniform1f(timeLoc, Date.now());
    gl.uniform3f(lightDirLoc, 1, 2, 3);
    gl.uniform3f(camLocLoc, cam.loc.x, cam.loc.y, cam.loc.z);

    /* Customiseable stuff */

    const kaLoc = gl.getUniformLocation(shaderI.shaderProgram, "ka");
    const kdLoc = gl.getUniformLocation(shaderI.shaderProgram, "kd");
    const ksLoc = gl.getUniformLocation(shaderI.shaderProgram, "ks");
    const phLoc = gl.getUniformLocation(shaderI.shaderProgram, "ph");

    gl.uniform3f(kaLoc, 0.24725, 0.2245, 0.0645);
    gl.uniform3f(kdLoc, 0.34615, 0.3143, 0.0903);
    gl.uniform3f(ksLoc, 0.797357, 0.723991, 0.208006);
    gl.uniform1f(phLoc, 83.2);

    gl.drawElements(
        gl.TRIANGLES,
        12, // num vertices to process
        gl.UNSIGNED_SHORT, // type of indices
        0 // offset on bytes to indices
    );
}
async function init() {
    /* Tetr */
    shaderI = await shaderAdd("withLight");
    tetrVertexArray = gl.createVertexArray();
    gl.bindVertexArray(tetrVertexArray);
    useShader(shaderI, tetrVertexPositions, tetrVertexIndices);
    gl.bindVertexArray(null);
    /* aaa */
}
export function unitTetrAdd() {
    unitAdd(init, render);
}
