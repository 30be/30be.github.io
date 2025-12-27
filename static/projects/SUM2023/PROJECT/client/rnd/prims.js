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
    name = "Name not set",
    ka = new vec3(0.25, 0.25, 0.25),
    kd = new vec3(0.4, 0.4, 0.4),
    ks = new vec3(0.774597, 0.774597, 0.774597),
    ph = 76.8,
    trans = 1,
    shaderName = null,
    tex = [null]
  ) {
    this.ka = ka;
    this.kd = kd;
    this.ks = ks;
    this.ph = ph;
    this.trans = trans;
    this.shaderName = shaderName;
    this.tex = [...tex];
    this.name = name;
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
  let normals = [];
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
  if (normals.length == 0) {
    normals = calculateNormals(vertices, indices);
  }
  let realV = [];
  vertices.forEach((it, index) =>
    realV.push(new vertex(it, new vec2(), normals[index]))
  );
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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
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
  constructor(p = new vec3(), t = new vec2(), n = new vec3(), c = new vec4()) {
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
    mtl = null,
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

  draw(world, ...shdAddons) {
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
    const worldLoc = gl.getUniformLocation(this.shader.shaderProgram, "world");

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
    for (let i = 0; i < 8; i++) {
      const shdAddonLoc = gl.getUniformLocation(
        this.shader.shaderProgram,
        "shdAddon" + i
      );
      if (shdAddonLoc != -1 && shdAddonLoc != null) {
        gl.uniform1i(shdAddonLoc, shdAddons[i]);
      }
    }

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
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.mtl.tex.forEach((texture, index) => {
      if (texture && texture != null && texture != -1) {
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0 + index);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);
        let loc = gl.getUniformLocation(
          this.shader.shaderProgram,
          "tex" + index
        );

        gl.uniform1i(loc, index);
      }
    });

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
      new Float32Array(this.vBuf.map((el) => [el.p.x, el.p.y, el.p.z]).flat()),
      new Uint16Array(this.iBuf),
      new Float32Array(this.vBuf.map((el) => [el.n.x, el.n.y, el.n.z]).flat()),
      new Float32Array(this.vBuf.map((el) => [el.t.x, el.t.y]).flat()),
      new Float32Array(
        this.vBuf.map((el) => [el.c.x, el.c.y, el.c.z, el.c.w]).flat()
      )
    );
    gl.bindVertexArray(null);
  }
}

export class prims {
  constructor(numOfPrims) {
    this.numOfPrims = numOfPrims;
    this.trans = new matr4();
    this.minBB = this.maxBB = new vec3(0);
    this.prims = [];
  }

  draw(world, ...args) {
    const m = this.trans.mul(world);

    for (let i = 0; i < this.numOfPrims; i++) {
      this.prims[i].draw(m, this.numOfPrims, i, ...args);
    }
  }
  async create() {
    for (let pr of this.prims) await pr.create();
  }
}

function addTexture(bytes, width, height) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    bytes
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  return texture;
}

export async function primsLoad(fileName) {
  const response = await fetch(fileName);
  let dataBuf = await response.arrayBuffer();
  let buf = new Uint8Array(dataBuf);

  let materials = [];
  let textures = [];
  let ptr = 0;

  const sign = buf
    .slice(ptr, (ptr += 4))
    .reduce((resStr, ch) => (resStr += String.fromCharCode(ch)), "");
  if (sign !== "G3DM") return null;

  let [numOfPrims, numOfMaterials, numOfTextures] = new Uint32Array(
    dataBuf.slice(ptr, (ptr += 4 * 3))
  );

  let prs = new prims(numOfPrims);

  for (let i = 0; i < numOfPrims; i++) {
    let [numOfV, numOfI, mtlNo] = new Uint32Array(
      dataBuf.slice(ptr, (ptr += 4 * 3))
    );

    let v = new Float32Array(
      dataBuf.slice(ptr, (ptr += 4 * (3 + 2 + 3 + 4) * numOfV))
    );
    let ind = new Uint32Array(dataBuf.slice(ptr, (ptr += 4 * numOfI)));
    let realV = [];
    for (let i = 0; i < v.length; i += 12)
      realV.push(
        new vertex(
          new vec3(v[i], v[i + 1], v[i + 2]),
          new vec2(v[i + 3], v[i + 4]),
          new vec3(v[i + 5], v[i + 6], v[i + 7]),
          new vec4(v[i + 8], v[i + 9], v[i + 10], v[i + 11])
        )
      );

    prs.prims.push(new prim(realV, ind));
    prs.prims[i].mtlNo = mtlNo;
    /* if (i === 0)
      (prs.minBB = prs.prims[0].minBB), (prs.maxBB = prs.prims[0].maxBB);
    else {
      if (prs.minBB.x > prs.prims[i].minBB.x)
        prs.minBB.x = prs.prims[i].minBB.x;
      if (prs.maxBB.x < prs.prims[i].maxBB.x)
        prs.maxBB.x = prs.prims[i].maxBB.x;

      if (prs.minBB.y > prs.prims[i].minBB.y)
        prs.minBB.y = prs.prims[i].minBB.y;
      if (prs.maxBB.y < prs.prims[i].maxBB.y)
        prs.maxBB.y = prs.prims[i].maxBB.y;

      if (prs.minBB.z > prs.prims[i].minBB.z)
        prs.minBB.z = prs.prims[i].minBB.z;
      if (prs.maxBB.z < prs.prims[i].maxBB.z)
        prs.maxBB.z = prs.prims[i].maxBB.z;
    }
  */
  }

  for (let m = 0; m < numOfMaterials; m++) {
    const mtlName = buf
      .slice(ptr, (ptr += 300))
      .reduce(
        (res_str, ch) => (res_str += ch == 0 ? "" : String.fromCharCode(ch)),
        ""
      );
    let s = new Float32Array(dataBuf.slice(ptr, (ptr += 4 * 11)));
    let txtarr = new Int32Array(dataBuf.slice(ptr, (ptr += 4 * 8)));
    let material = new mtl(
      mtlName,
      new vec3(s[0], s[1], s[2]),
      new vec3(s[3], s[4], s[5]),
      new vec3(s[6], s[7], s[8]),
      s[9],
      s[10],
      "tex"
    );
    material.texNo = [];
    for (let i = 0; i < 8; i++) {
      material.texNo[i] = txtarr[i];
    }
    materials[m] = material;
    ptr += 300 + 4;
  }

  for (let t = 0; t < numOfTextures; t++) {
    const texName = buf
      .slice(ptr, (ptr += 300))
      .reduce(
        (res_str, ch) => (res_str += ch == 0 ? "" : String.fromCharCode(ch)),
        ""
      );

    let [w, h, c] = new Uint32Array(dataBuf.slice(ptr, (ptr += 4 * 3)));
    let bits = buf.slice(ptr, (ptr += w * h * c));

    for (let i = 0; i < bits.length; i += 4) {
      const t = bits[i];
      bits[i] = bits[i + 2];
      bits[i + 2] = t;
    }

    textures[t] = addTexture(bits, w, h);
  }

  for (let material of materials) {
    for (let i = 0; i < 8; i++) {
      material.tex[i] =
        material.texNo[i] == -1 ? -1 : textures[material.texNo[i]];
    }
  }

  for (let pr of prs.prims) {
    pr.mtl = pr.mtlNo != undefined ? materials[pr.mtlNo] : new mtl();
  }

  /*for (let i = 0; i < prs.prims.length; i++)
    for (let j = 0; j < prs.prims[i].mtl.tex.length; j++)
      if (
        prs.prims[i].mtl.tex[j] != undefined /* Why is this needed???????*/ /* &&
        prs.prims[i].mtl.tex[j].texNo != -1
      ) {
        prs.prim  s[i].mtl.tex[j] = textures[prs.prims[i].mtl.tex[j].texNo];
      }*/

  await prs.create();
  return prs;
}
