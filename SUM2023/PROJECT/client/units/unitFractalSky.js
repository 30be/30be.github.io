import { gl, canvas } from "../main.js";
import { unitAdd } from "./units.js";
import { shaderAdd } from "../rnd/shaders.js";
import { mouse, cam } from "../utils/controls.js";

let pos = [];
let shaderProgram;
let skyShader;
let fracVertexArray;
const rcoeff = document.getElementById("rcoeff");
const gcoeff = document.getElementById("gcoeff");
const bcoeff = document.getElementById("bcoeff");
const a = document.getElementById("a");
const b = document.getElementById("b");
let startTime = Date.now();
let fbTextureWidth;
let fbTextureHeight;
let fb;
let fbTexture;
let depthRB;
let texUnit = 6;
function render() {
  gl.disable(gl.DEPTH_TEST);

  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.viewport(0, 0, fbTextureWidth, fbTextureHeight);
  /* Render to texture */
  // gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindVertexArray(fracVertexArray);
  gl.useProgram(shaderProgram.shaderProgram);
  let timeLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "time");
  let xLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "x");
  let yLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "y");
  let zoom = gl.getUniformLocation(shaderProgram.shaderProgram, "zoom");
  let rcoeffLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "rcoeff");
  let gcoeffLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "gcoeff");
  let bcoeffLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "bcoeff");
  let aLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "a");
  let bLoc = gl.getUniformLocation(shaderProgram.shaderProgram, "b");
  gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
  gl.uniform1f(yLoc, 0.4);
  gl.uniform1f(xLoc, 0.4);
  gl.uniform1f(zoom, 1);
  gl.uniform1f(rcoeffLoc, rcoeff.value);
  gl.uniform1f(gcoeffLoc, gcoeff.value);
  gl.uniform1f(bcoeffLoc, bcoeff.value);
  gl.uniform1f(aLoc, a.value);
  gl.uniform1f(bLoc, b.value * 5);
  gl.useProgram(shaderProgram.shaderProgram);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  /* Render to the sky */
  gl.useProgram(skyShader.shaderProgram);
  const texLoc = gl.getUniformLocation(skyShader.shaderProgram, "tex0");

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(
    0,
    0,
    cam.frameW,
    cam.frameH
    //  Math.max(gl.canvas.width, gl.canvas.height)
  );

  gl.activeTexture(gl.TEXTURE0 + texUnit);
  gl.bindTexture(gl.TEXTURE_2D, fbTexture);
  gl.uniform1i(texLoc, texUnit);

  let camDirLoc = gl.getUniformLocation(skyShader.shaderProgram, "camDir");
  let camUpLoc = gl.getUniformLocation(skyShader.shaderProgram, "camUp");
  let camRightLoc = gl.getUniformLocation(skyShader.shaderProgram, "camRight");
  let projDistLoc = gl.getUniformLocation(skyShader.shaderProgram, "projDist");
  let frameWLoc = gl.getUniformLocation(skyShader.shaderProgram, "frameW");

  let frameHLoc = gl.getUniformLocation(skyShader.shaderProgram, "frameH");
  gl.uniform3f(camDirLoc, cam.dir.x, cam.dir.y, cam.dir.z);
  gl.uniform3f(camUpLoc, cam.up.x, cam.up.y, cam.up.z);
  gl.uniform3f(camRightLoc, cam.right.x, cam.right.y, cam.right.z);
  gl.uniform1f(projDistLoc, cam.projDist);
  gl.uniform1f(frameWLoc, cam.frameW);
  gl.uniform1f(frameHLoc, cam.frameH);

  gl.useProgram(skyShader.shaderProgram);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.enable(gl.DEPTH_TEST);
}

async function init() {
  fracVertexArray = gl.createVertexArray();
  gl.bindVertexArray(fracVertexArray);
  shaderProgram = await shaderAdd("mandelbrot");
  pos = [-1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0];

  let posLoc = gl.getAttribLocation(shaderProgram.shaderProgram, "in_pos");
  let positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  /* Additional initialization */
  skyShader = await shaderAdd("sky");

  posLoc = gl.getAttribLocation(shaderProgram.shaderProgram, "in_pos");
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  fbTextureWidth = cam.frameW * 3;
  fbTextureHeight = cam.frameH * 3;
  fbTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, fbTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, // mip level
    gl.RGBA, // internal format
    fbTextureWidth, // width
    fbTextureHeight, // height
    0, // border
    gl.RGBA, // format
    gl.UNSIGNED_BYTE, // type
    null // data
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  depthRB = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRB);
  gl.renderbufferStorage(
    gl.RENDERBUFFER,
    gl.DEPTH_COMPONENT16, // format
    fbTextureWidth, // width,
    fbTextureHeight // height,
  );

  fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    fbTexture,
    0
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthRB
  );

  gl.bindVertexArray(null); /* aaa */
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
}
export function unitFractalSkyAdd() {
  unitAdd(init, render, "Fractal sky");
}
