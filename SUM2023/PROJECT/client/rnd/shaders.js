import { gl } from "../main.js";
import { calculateNormals } from "../utils/utils.js";

export const shaders = [];
export class shader {
  constructor(vs, fs, shaderProgram) {
    this.vs = vs;
    this.fs = fs;
    this.shaderProgram = shaderProgram;
  }
}

export async function shaderAdd(fileName = null) {
  let vs, fs, res;
  if (fileName == null || fileName == 0) return shaders[0];
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader, source);

    return shader;
  }

  const ft1 = fetch(`bin/shaders/${fileName}/vert.glsl`)
    .then((res) => res.text()) // Стрелочная безымянная функция запустится после получение текста, из 'res' получаем текстовые данные
    .then((data) => {
      // Стрелочная безымянная функция запустится для обработки полученных на предыдущем этапе данных - 'data' это полученный текст
      vs = data; // Запоминаем полученный текст в глобальной переменной
    });

  const ft2 = fetch(`bin/shaders/${fileName}/frag.glsl`)
    .then((res) => res.text())
    .then((data) => {
      fs = data;
    });

  const allData = Promise.all([ft1, ft2]);

  await allData.then(() => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);
    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const Buf = gl.getProgramInfoLog(shaderProgram);
      console.log(Buf);
    }
    res = new shader(vs, fs, shaderProgram);
    shaders.push(res);
  });
  return res;
}

export function useShader(
  shader,
  vertices,
  indices = null,
  normals = null,
  texCoords = null,
  colors = null
) {
  let posLoc = gl.getAttribLocation(shader.shaderProgram, "in_pos");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
  ); /* TODO: Should i use float32Array here*/
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

  const normalLoc = gl.getAttribLocation(shader.shaderProgram, "normal");
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  if (normals == null)
    normals = new Float32Array(calculateNormals(vertices, indices));
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normalLoc);
  gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);

  if (texCoords != null) {
    const texCoordLoc = gl.getAttribLocation(shader.shaderProgram, "texCoord");
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
  }

  if (colors != null) {
    const colorLoc = gl.getAttribLocation(shader.shaderProgram, "color");
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorLoc);
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  }

  if (indices != null) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }
}
