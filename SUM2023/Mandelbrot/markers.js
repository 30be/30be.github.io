import { gl } from "./main.js";
import { unitAdd } from "./units.js";
import { cam } from "./controls.js";
import { matr4, vec3, vec4 } from "./mth.js";
import { shaderAdd } from "./shaders.js";

const indices = new Uint16Array([
    0, 1, 2, 2, 1, 4, 4, 5, 2, 0, 2, 5, 0, 5, 3, 0, 3, 4, 0, 4, 1, 5, 4, 3,
]);

let markVertexArray;
let shaderI;
let markers = [];
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

    const colorLoc = gl.getUniformLocation(shaderI.shaderProgram, "color");

    gl.uniform4f(colorLoc, 1, 0, 1, 1);

    const worldLoc = gl.getUniformLocation(shaderI.shaderProgram, "world");
    //  draw tetr
    gl.bindVertexArray(markVertexArray);
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
        new Float32Array(myMatr4.a().join().split(","))
    );

    for (let i = 0; i < markers.length; i++) markers[i].render();
    markers = [];
}
async function init() {
    /* Tetr */
    markers = [];
    shaderI = await shaderAdd("markers");

    //gl.bindVertexArray(markVertexArray);
    /* aaa */
}
export function unitMrkAdd() {
    unitAdd(init, render);
}

export class marker {
    constructor(
        start = new vec3(0),
        end = new vec3(100),
        width = 0.1,
        color = new vec4(1, 0, 1, 1)
    ) {
        this.start = start;
        this.end = end;
        this.width = width;
        this.color = color;
        this.right =
            start.x != 0 && start.y != 0 && start.z != 0
                ? end.cross(start).normalize().mul(width)
                : new vec3(1, 0, 0);
        this.up = this.right.cross(end.sub(start)).normalize().mul(width);
        this.vertices = [];
        markers.push(this);
    }
    render() {
        markVertexArray = gl.createVertexArray();
        gl.bindVertexArray(markVertexArray);
        this.vertices[0] = this.start.x;
        this.vertices[1] = this.start.y;
        this.vertices[2] = this.start.z;

        this.vertices[3] = this.start.x + this.right.x;
        this.vertices[4] = this.start.y + this.right.y;
        this.vertices[5] = this.start.z + this.right.z;

        this.vertices[6] = this.start.x + this.up.x;
        this.vertices[7] = this.start.y + this.up.y;
        this.vertices[8] = this.start.z + this.up.z;

        this.vertices[9] = this.end.x;
        this.vertices[10] = this.end.y;
        this.vertices[11] = this.end.z;

        this.vertices[12] = this.end.x + this.right.x;
        this.vertices[13] = this.end.y + this.right.y;
        this.vertices[14] = this.end.z + this.right.z;

        this.vertices[15] = this.end.x + this.up.x;
        this.vertices[16] = this.end.y + this.up.y;
        this.vertices[17] = this.end.z + this.up.z;

        let posLoc = gl.getAttribLocation(shaderI.shaderProgram, "in_pos");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(...this.vertices),
            gl.STATIC_DRAW
        );
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.drawElements(
            gl.TRIANGLES,
            24, // num vertices to process
            gl.UNSIGNED_SHORT, // type of indices
            0 // offset on bytes to indices
        );
    }
}
