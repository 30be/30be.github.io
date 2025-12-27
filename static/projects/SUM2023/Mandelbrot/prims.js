import { gl } from "./main.js";
import { cam } from "./controls.js";
import { matr4, vec2, vec3, vec4 } from "./mth.js";
import { shaderAdd, useShader } from "./shaders.js";
import { calculateNormals } from "./utils.js";

export let primitives = [];

export function loadObj(input) {
    let file = input.target.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = (e) => {
        primLoadObj(e.target.result);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

function primLoadObj(file) {
    let vertices = [];
    let indices = [];
    let normals = [];
    let strings = file.split("\n");

    for (let i = 0; i < strings.length; i++) {
        let string = strings[i].split(" ");
        if (string[0] == "v" && string[1] == " ") {
            let x = +string[1],
                y = +string[2],
                z = +string[3];

            vertices.push(new vec3(x, y, z));
        } else if (string[0] == "f" && string[1] == " ") {
            indices.push(string[1]);
            indices.push(string[2]);
            indices.push(string[3]);
        } else if (string[0] == "vn" && string[1] == " ") {
            normals.push(string[1]);
            normals.push(string[2]);
            normals.push(string[3]);
        }
    }
    if (normals.length == 0) normals = calculateNormals(vertices, indices);

    let res = new prim(
        vertices.forEach((it, index) => new vertex(it, indices[index])),
        indices
    );
    primitives.push(res);
    return res;
}

export class vertex {
    constructor(
        p = new vec3(),
        n = new vec3(),
        t = new vec2(),
        c = new vec4()
    ) {
        this.p = p;
        this.t = t;
        this.n = n;
        this.c = c;
    }
}

export class prim {
    constructor(
        vBuf,
        iBuf = null,
        mtl = 0,
        trans = new matr4(),
        type = gl.TRIANGLES,
        va = null
    ) {
        this.va = va;
        this.mtl = mtl;
        this.vBuf = vBuf;
        this.iBuf = iBuf;
        this.trans = trans;
        this.type = type;
    }

    draw(world) {
        gl.useProgram(this.shader.shaderProgram);
        let timeLoc = gl.getUniformLocation(this.shader.shaderProgram, "time");
        const projectionLoc = gl.getUniformLocation(
            this.shader.shaderProgram,
            "projection"
        );
        const modelViewLoc = gl.getUniformLocation(
            this.shader.shaderProgram,
            "modelView"
        );
        const lightDirLoc = gl.getUniformLocation(
            this.shader.shaderProgram,
            "lightDir"
        );
        const camLocLoc = gl.getUniformLocation(
            this.shader.shaderProgram,
            "camLoc"
        );
        const worldLoc = gl.getUniformLocation(
            this.shader.shaderProgram,
            "world"
        );
        //  draw octa
        gl.bindVertexArray(this.va);
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

        gl.uniform1f(timeLoc, Date.now());
        gl.uniform3f(lightDirLoc, 1, 2, 3);
        gl.uniform3f(camLocLoc, cam.loc.x, cam.loc.y, cam.loc.z);

        /* Customiseable stuff */
        gl.uniformMatrix4fv(worldLoc, false, new Float32Array(world));
        const kaLoc = gl.getUniformLocation(this.shader.shaderProgram, "ka");
        const kdLoc = gl.getUniformLocation(this.shader.shaderProgram, "kd");
        const ksLoc = gl.getUniformLocation(this.shader.shaderProgram, "ks");
        const phLoc = gl.getUniformLocation(this.shader.shaderProgram, "ph");

        gl.uniform3f(kaLoc, this.mtl.ka.x, this.mtl.ka.y, this.mtl.ka.z);
        gl.uniform3f(kdLoc, this.mtl.kd.x, this.mtl.kd.y, this.mtl.kd.z);
        gl.uniform3f(ksLoc, this.mtl.ks.x, this.mtl.ks.y, this.mtl.ks.z);
        gl.uniform1f(phLoc, this.mtl.ph);

        if (this.iBuf != null) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuf);
            gl.drawElements(
                gl.TRIANGLES,
                24, // num vertices to process
                gl.UNSIGNED_SHORT, // type of indices
                0 // offset on bytes to indices
            );
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0);
        } else gl.drawArrays(gl.type, 0, this.vBuf.length);
    }

    async create() {
        this.mtlshader = await shaderAdd(this.mtl.shaderName);
        this.va = gl.createVertexArray();
        gl.bindVertexArray(this.va);
        useShader(
            this.shader,
            this.vBuf.map((el) => el.p),
            this.iBuf
        );
        gl.bindVertexArray(null);
    }
}

export class prims {
    constructor(prims, trans) {
        this.prims = prims;
        this.trans = trans;
    }
}
