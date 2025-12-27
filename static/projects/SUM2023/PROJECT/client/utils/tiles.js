import { gl } from "../main.js";
import { unitAdd } from "./units.js";
import { cam } from "../utils/controls.js";
import { matr4, vec3, vec4 } from "../utils/mth.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

let zoom = 11;

let size = 5;

let maxTileRenderLength = 16;

let roughness = 3;

const planeVertexPositions = new Float32Array([
  size / 2,
  0,
  size / 2,

  -size / 2,
  0,
  size / 2,

  size / 2,
  0,
  -size / 2,

  size / 2,
  0,
  -size / 2,

  -size / 2,
  0,
  size / 2,

  -size / 2,
  0,
  -size / 2,
]);

const mapVertexTexcoords = new Float32Array([
  1, 1, 0, 1, 1, 0,

  1, 0, 0, 1, 0, 0,
]);

let tileVA;
let shaderI;

let tiles = [];

let oldUserLoc = new vec3(0, 1000, 0);
/* Radius(in sizes) at which to render tiles */

let maxTileRenderLength2 = maxTileRenderLength * maxTileRenderLength;
let maxTileRenderBufferLength2 = maxTileRenderLength2 * 5;

const startLon = 30.3350986;
const startLat = 59.9342802;
class tile {
  constructor(pos) {
    this.blockPos =
      pos; /* This vector should be multiplied by SIZE to be in world coords */
    this.places = [];
  }
  async load() {
    let tileset_id = "mapbox.satellite";
    let access_token =
      "pk.eyJ1IjoibHM0IiwiYSI6ImNsaXluYmYyODA1bnAzcXQ4amlweGowc3gifQ.6cQiQQxsiO3WUIbKFOQrmw";
    let format = "png";
    let x = 0; //this.x;
    let y = 0; //this.y;
    x = lon2tile(startLon, zoom) + this.blockPos.x;
    y = lat2tile(startLat, zoom) + this.blockPos.z;

    let url = `https://api.mapbox.com/v4/${tileset_id}/${zoom}/${x}/${y}.${format}?access_token=${access_token}`;

    /*
    const city = "populated_place";
    const nature = "natural";
    let lon1 = tile2lon(x - 0.5, zoom);
    let lat1 = tile2lat(y - 0.5, zoom);
    let lon2 = tile2lon(x + 0.5, zoom);
    let lat2 = tile2lat(y + 0.5, zoom);
    
    let naturePlacesUrl = `https://api.geoapify.com/v2/places?categories=${nature}&filter=rect%3A${lon1}%2C${lat1}%2C${lon2}%2C${lat2}&limit=20&apiKey=ca21185235644d0f821be4dfa3c2d6f3`;
    console.log(naturePlacesUrl);
    fetch(naturePlacesUrl)
      .then((response) => response.json())
      .then((result) => this.places.push(result))
      .catch((error) => console.log("error at " + naturePlacesUrl, error));

    let cityPlacesUrl = `https://api.geoapify.com/v2/places?categories=${city}&filter=rect%3A${lon1}%2C${lat1}%2C${lon2}%2C${lat2}&limit=20&apiKey=ca21185235644d0f821be4dfa3c2d6f3`;
    fetch(cityPlacesUrl)
      .then((response) => response.json())
      .then((result) => this.places.push(result))
      .catch((error) => console.log("error at " + naturePlacesUrl, error));
*/
    /* fetches for a location */
    let response = await fetch(url);
    if (response.ok) {
      let blob = await response.blob();
      let imageBM = await createImageBitmap(blob);

      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0, // mip level
        gl.RGBA, // internal format
        imageBM.width, // width
        imageBM.height, // height
        0, // border
        gl.RGBA, // format
        gl.UNSIGNED_BYTE, // type
        imageBM // data
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } else {
      console.log(`At url ${url} was an HTTP error: ` + response.status);
    }
    return this;
  }
}

function reloadTiles() {
  cam.userBlockPos = new vec3(
    Math.floor(cam.userLoc.x / size),
    0,
    Math.floor(cam.userLoc.z / size)
  );
  /* Delete the too faraway ones */
  tiles = tiles.filter(
    (tile) =>
      (tile.blockPos.x - cam.userBlockPos.x) *
        (tile.blockPos.x - cam.userBlockPos.x) +
        (tile.blockPos.z - cam.userBlockPos.z) *
          (tile.blockPos.z - cam.userBlockPos.z) <
      maxTileRenderBufferLength2
  );

  for (let x = -maxTileRenderLength + 1; x < maxTileRenderLength; x++)
    for (let y = -maxTileRenderLength + 1; y < maxTileRenderLength; y++)
      if (x * x + y * y < maxTileRenderLength2)
        if (
          !tiles.find(
            (tile) =>
              tile.blockPos.x == x + cam.userBlockPos.x &&
              tile.blockPos.z == y + cam.userBlockPos.z
          )
        ) {
          let newTile = new tile(
            new vec3(x + cam.userBlockPos.x, 0, y + cam.userBlockPos.z)
          );
          newTile.load().then((it) => (it.isLoaded = true));
          tiles.push(newTile);
        }
}

function render() {
  /* Shader handling. Make function! */

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
  gl.bindVertexArray(tileVA);
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

  const camLocLoc = gl.getUniformLocation(shaderI.shaderProgram, "camLoc");
  const lightDirLoc = gl.getUniformLocation(shaderI.shaderProgram, "lightDir");

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

  const texLoc = gl.getUniformLocation(shaderI.shaderProgram, "tex0");
  let texUnit = 0;

  /* Tiles rendering */

  if (oldUserLoc.sub(cam.userLoc).len2() > size * size * 10) {
    reloadTiles();
    oldUserLoc = cam.userLoc.copy();
  }
  /*
  for (let i = 0; i < roughTiles.length; i++) {
    /* Pass position */
  /*  gl.uniformMatrix4fv(
      worldLoc,
      false,
      new Float32Array(
        myMatr4
          .translate(
            new vec3(
              roughTiles[i].blockPos.x * Math.pow(size, roughness),
              -0.1,
              roughTiles[i].blockPos.z * Math.pow(size, roughness)
            )
          )
          .a()
          .join()
          .split(",")
      )
    );

    /* Bind texture */
  /*   gl.activeTexture(gl.TEXTURE0 + texUnit);
    gl.bindTexture(gl.TEXTURE_2D, roughTiles[i].texture);
    gl.uniform1i(texLoc, texUnit);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }*/
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].isLoaded) {
      let world = myMatr4.translate(
        new vec3(tiles[i].blockPos.x * size, 0, tiles[i].blockPos.z * size)
      );
      /* Pass position */
      gl.uniformMatrix4fv(
        worldLoc,
        false,
        new Float32Array(world.a().join().split(","))
      );

      /* Bind texture */
      gl.activeTexture(gl.TEXTURE0 + texUnit);
      gl.bindTexture(gl.TEXTURE_2D, tiles[i].texture);
      gl.uniform1i(texLoc, texUnit);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      /*
        var matrix = matr4.translate(cam.matrProj,
            translation[0], translation[1], translation[2]);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.translate(matrix, -50, -75, 0);
    */
      // Set the matrix.

      // compute a clipspace position
      // using the matrix we computed for the F
      for (let j = 0; j < tiles[i].places.length; j++) {
        var clipspace = new vec4(
          tiles[i].places[j].position.x,
          tiles[i].places[j].position.y,
          tiles[i].places[j].position.z,
          1
        ).mulMatr(cam.matrVP.mul(world));

        // divide X and Y by W just like the GPU does.
        clipspace[0] /= clipspace[3];
        clipspace[1] /= clipspace[3];

        // convert from clipspace to pixels
        var pixelX = (clipspace[0] * 0.5 + 0.5) * gl.canvas.width;
        var pixelY = (clipspace[1] * -0.5 + 0.5) * gl.canvas.height;

        // position the div
        document.getElementById("place").style.left = Math.floor(pixelX) + "px";
        document.getElementById("place").style.top = Math.floor(pixelY) + "px";
        document.getElementById("place").textContent = tiles[i].places[j].name;
      }
    }
  }
}

async function init() {
  shaderI = await shaderAdd("map");
  tileVA = gl.createVertexArray();
  gl.bindVertexArray(tileVA);
  useShader(shaderI, planeVertexPositions);

  const texcoordLoc = gl.getAttribLocation(shaderI.shaderProgram, "texCoord");
  const texcoordBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, mapVertexTexcoords, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texcoordLoc);
  gl.vertexAttribPointer(
    texcoordLoc, // location
    2, // size (components per iteration)
    gl.FLOAT, // type of to get from buffer
    false, // normalize
    0, // stride (bytes to advance each iteration)
    0 // offset (bytes from start of buffer)
  );
  gl.bindVertexArray(null);
  /* aaa */
  cam.userBlockPos = new vec3(
    Math.floor(cam.userLoc.x / size),
    0,
    Math.floor(cam.userLoc.z / size)
  );
}

export function unitMapAdd() {
  unitAdd(init, render, "Map");
}

function lon2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}
function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

function tile2lon(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}

function tile2lat(y, z) {
  var n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}
