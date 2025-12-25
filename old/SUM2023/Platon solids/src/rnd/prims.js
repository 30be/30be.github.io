import { gl } from "../main.js";
import { cam } from "../utils/controls.js";
import { matr4, vec2, vec3, vec4 } from "../utils/mth.js";
import { shaderAdd, useShader } from "./shaders.js";
import { calculateNormals } from "../utils/utils.js";

export let primitives = [];

export class texture {
    constructor(fileName) {
        this.tex = loadImage(fileName); /* OpenGL texture Id */
    }
}

export class mtl {
    constructor(
        ka = new vec3(0.25, 0.25, 0.25),
        kd = new vec3(0.4, 0.4, 0.4),
        ks = new vec3(0.774597, 0.774597, 0.774597),
        ph = 76.8,
        shaderName = null,
        tex = [null]
    ) {
        this.ka = ka;
        this.kd = kd;
        this.ks = ks;
        this.ph = ph;
        this.shaderName = shaderName;
        this.tex = [...tex];
    }
}
export function loadObj(input) {
    let file = input.target.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = (e) => {
        primLoadObj(e.target.result).then((it) => primitives.push(it));
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

export async function primLoadObj(file) {
    let vertices = [0];
    let indices = [];
    let normals = [0];
    let strings = file.split("\n");

    for (let i = 0; i < strings.length; i++) {
        let string = strings[i].split(" ");
        if (string[0] == "v") {
            let x = +string[1],
                y = +string[2],
                z = +string[3];

            vertices.push(new vec3(x, y, z));
        } else if (string[0] == "f") {
            indices.push(+string[1].split("/")[0]);
            indices.push(+string[2].split("/")[0]);
            indices.push(+string[3].split("/")[0]);
        } else if (string[0] == "vn") {
            let x = +string[1],
                y = +string[2],
                z = +string[3];
            normals.push(new vec3(x, y, z));
        }
    }
    if (normals.length == 0) normals = calculateNormals(vertices, indices);

    let realV = [];
    vertices.forEach((it, index) => realV.push(new vertex(it, normals[index])));
    let res = new prim(realV, indices);
    res.mtl = new mtl();
    res.mtl.shaderName = "withLight";
    await res.create();
    return res;
}

export function loadImage(src) {
    const img = new Image();
    img.src = src;
    let image = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, image);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255])
    );
    img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, image);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_MIN_FILTER,
            gl.LINEAR_MIPMAP_LINEAR
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    return image;
}

export class vertex {
    constructor(
        p = new vec3(),
        n = new vec3(),
        t = new vec2(),
        c = new vec4()
    ) {
        this.p = p;
        this.n = n;
        this.t = t;
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
        gl.uniformMatrix4fv(
            worldLoc,
            false,
            new Float32Array(world.a().join().split(","))
        );
        const kaLoc = gl.getUniformLocation(this.shader.shaderProgram, "ka");
        const kdLoc = gl.getUniformLocation(this.shader.shaderProgram, "kd");
        const ksLoc = gl.getUniformLocation(this.shader.shaderProgram, "ks");
        const phLoc = gl.getUniformLocation(this.shader.shaderProgram, "ph");

        gl.uniform3f(kaLoc, this.mtl.ka.x, this.mtl.ka.y, this.mtl.ka.z);
        gl.uniform3f(kdLoc, this.mtl.kd.x, this.mtl.kd.y, this.mtl.kd.z);
        gl.uniform3f(ksLoc, this.mtl.ks.x, this.mtl.ks.y, this.mtl.ks.z);
        gl.uniform1f(phLoc, this.mtl.ph);

        if (this.iBuf != null) {
            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuf);
            gl.drawElements(
                gl.TRIANGLES,
                this.iBuf.length, // num vertices to process
                gl.UNSIGNED_SHORT, // type of indices
                0 // offset on bytes to indices
            );
            //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0);
        } else gl.drawArrays(gl.type, 0, this.vBuf.length);
    }

    async create() {
        this.shader = await shaderAdd(this.mtl.shaderName);
        this.va = gl.createVertexArray();
        gl.bindVertexArray(this.va);
        useShader(
            this.shader,
            new Float32Array(
                this.vBuf.map((el) => [el.p.x, el.p.y, el.p.z]).flat()
            ),
            new Uint16Array(this.iBuf),
            new Float32Array(
                this.vBuf.map((el) => [el.n.x, el.n.y, el.n.z]).flat()
            )
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
