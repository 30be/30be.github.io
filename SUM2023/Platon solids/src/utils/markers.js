import { gl } from "../main.js";
import { unitAdd } from "../units/units.js";
import { matr4, vec3, vec4 } from "../utils/mth.js";
import { cam } from "../utils/controls.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

const cubeVertexPositions = new Float32Array([
    1, 2, -1, 1, 2, 1, 1, 0, 1, 1, 0, -1, -1, 2, 1, -1, 2, -1, -1, 0, -1, -1, 0,
    1, -1, 2, 1, 1, 2, 1, 1, 2, -1, -1, 2, -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1,
    0, 1, 1, 2, 1, -1, 2, 1, -1, 0, 1, 1, 0, 1, -1, 2, -1, 1, 2, -1, 1, 0, -1,
    -1, 0, -1,
]);

const cubeVertexIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
    15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
]);
let ext;
let matrices = [];
let worldLoc;
let colorLoc;
let cubeVertexArray;
let shaderI;
function render() {
    gl.useProgram(shaderI.shaderProgram);

    const projectionLoc = gl.getUniformLocation(
        shaderI.shaderProgram,
        "projection"
    );
    const modelViewLoc = gl.getUniformLocation(
        shaderI.shaderProgram,
        "modelView"
    );
    worldLoc = gl.getAttribLocation(shaderI.shaderProgram, "world");
    colorLoc = gl.getUniformLocation(shaderI.shaderProgram, "color");
    gl.uniformMatrix4fv(
        projectionLoc,
        false,
        new Float32Array(cam.matrProj.a().join().split(","))
    );
    let myMatr4 = new matr4();
    /*gl.uniformMatrix4fv(
        worldLoc,
        false,
        new Float32Array(myMatr4.a().join().split(","))
    );*/
    gl.uniformMatrix4fv(
        modelViewLoc,
        false,
        new Float32Array(cam.matrView.a().join().split(","))
    );

    let color = new vec4(1, 0, 1, 1);
    gl.uniform4f(colorLoc, color.x, color.y, color.z, color.w);
    let matrixData = new Float32Array(...matrices);

    const matrixBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
    // just allocate the buffer
    gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);

    const bytesPerMatrix = 4 * 16;
    for (let i = 0; i < 4; ++i) {
        const loc = worldLoc + i;
        gl.enableVertexAttribArray(loc);
        // note the stride and offset
        const offset = i * 16; // 4 floats per row, 4 bytes per float
        gl.vertexAttribPointer(
            loc, // location
            4, // size (num values to pull from buffer per iteration)
            gl.FLOAT, // type of data in buffer
            false, // normalize
            bytesPerMatrix, // stride, num bytes to advance to get to next set of values
            offset // offset in buffer
        );
        // this line says this attribute only changes for each 1 instance
        gl.vertexAttribDivisor(loc, 1);
    }
    gl.drawElementsInstanced(
        gl.TRIANGLES,
        36, // num vertices to process
        gl.UNSIGNED_SHORT, // type of indices
        0, // offset on bytes to indice
        matrices.length
    );
    matrices = [];
}

async function init() {
    /* Tetr */
    shaderI = await shaderAdd("markers");
    cubeVertexArray = gl.createVertexArray();
    gl.bindVertexArray(cubeVertexArray);
    useShader(shaderI, cubeVertexPositions, cubeVertexIndices);
    gl.bindVertexArray(null);
    //gl.bindVertexArray(markVertexArray);
    /* aaa */
}

export function unitMrkAdd() {
    unitAdd(init, render);
}

export function markerDraw(
    start = new vec3(0),
    end = new vec3(100),
    width = 0.1
    //   color = new vec4(1, 0, 1, 1)
) {
    let myMatr4 = new matr4();
    let up = new vec3(0, 1, 0);
    let centered = end.sub(start);
    matrices.push(
        new Float32Array(
            myMatr4
                .scale(new vec3(width, centered.len(), width))
                .mul(
                    myMatr4.rotateX(
                        (up.angle(new vec3(0, centered.y, centered.z)) * 180) /
                            Math.PI
                    )
                )
                .mul(
                    myMatr4.rotateY(
                        (up.angle(new vec3(centered.x, centered.y, 0)) * 180) /
                            Math.PI
                    )
                )
                .mul(myMatr4.translate(start))
                .a()
                .join()
                .split(",")
        )
    );
}
