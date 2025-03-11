import { gl } from "../main.js";
import { unitAdd } from "./units.js";
import { cam } from "../utils/controls.js";
import { matr4, vec3 } from "../utils/mth.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

const planeVertexPositions = new Float32Array([
    10, -5, 10, -10, -5, -10, 10, -5, -10,

    10, -5, 10, -10, -5, 10, -10, -5, -10,
]);

let planeVertexArray;
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
    gl.bindVertexArray(planeVertexArray);
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

    const camLocLoc = gl.getUniformLocation(shaderI.shaderProgram, "camLoc");
    const lightDirLoc = gl.getUniformLocation(
        shaderI.shaderProgram,
        "lightDir"
    );

    gl.uniform3f(lightDirLoc, 1, 1, 1);
    gl.uniform3f(camLocLoc, cam.loc.x, cam.loc.y, cam.loc.z);
    /* Customiseable stuff */

    const kaLoc = gl.getUniformLocation(shaderI.shaderProgram, "ka");
    const kdLoc = gl.getUniformLocation(shaderI.shaderProgram, "kd");
    const ksLoc = gl.getUniformLocation(shaderI.shaderProgram, "ks");
    const phLoc = gl.getUniformLocation(shaderI.shaderProgram, "ph");
    gl.uniform3f(kaLoc, 0.01, 0.3, 0.1);
    gl.uniform3f(kdLoc, 0.07568, 0.61424, 0.07568);
    gl.uniform3f(ksLoc, 0.633, 0.727811, 0.633);
    gl.uniform1f(phLoc, 76.8);

    gl.uniform1f(timeLoc, Date.now());

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
async function init() {
    shaderI = await shaderAdd("withLight");
    planeVertexArray = gl.createVertexArray();
    gl.bindVertexArray(planeVertexArray);
    useShader(shaderI, planeVertexPositions);
    gl.bindVertexArray(null);
    /* aaa */
}
export function unitPlaneAdd() {
    unitAdd(init, render);
}
