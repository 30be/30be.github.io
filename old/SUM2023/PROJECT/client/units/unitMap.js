import { gl } from "../main.js";
import { unitAdd } from "./units.js";
import { cam } from "../utils/controls.js";
import { matr4, vec3, vec4 } from "../utils/mth.js";
import { shaderAdd, useShader } from "../rnd/shaders.js";

let zoom = 11;

let size = 20;

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
let placesHTML;
let tileVA;
let shaderI;

let tiles = [];

let roughTiles = [];

let oldUserLoc = new vec3(0, 1000, 0);
/* Radius(in sizes) at which to render tiles */

let maxTileRenderLength2 = maxTileRenderLength * maxTileRenderLength;
let maxTileRenderBufferLength2 = maxTileRenderLength2 * 5;

let maxRoughTileRenderBufferLength2 =
  maxTileRenderBufferLength2 * roughness * roughness;
let maxRoughTileRenderLength = maxTileRenderLength * roughness;
let maxRoughTileRenderLength2 =
  maxRoughTileRenderLength * maxRoughTileRenderLength;

const startLon = 30.3350986;
const startLat = 59.9342802;
const startTileX = lon2tile(startLon, zoom);
const startTileY = lat2tile(startLat, zoom);
async function loadPlaceCategory(places, category, x, y, zoom = zoom, amount) {
  let drawTiles = true; //false;
  //drawTiles = false;
  if (drawTiles) {
    let lon1 = tile2lon(x - 5, zoom);
    let lat1 = tile2lat(y - 5, zoom);
    let lon2 = tile2lon(x + 5, zoom);
    let lat2 = tile2lat(y + 5, zoom);
    let apiKey = `49a02e9955fe4bd38881e3ec2c56f795`;
    //apiKey = `ca21185235644d0f821be4dfa3c2d6f3`;
    apiKey = `12b046bb99314b748355834551cd58d0`;
    let placesUrl = `https://api.geoapify.com/v2/places?categories=${category}&filter=rect%3A${lon1}%2C${lat1}%2C${lon2}%2C${lat2}&limit=${amount}&apiKey=`;
    placesUrl = `https://api.geoapify.com/v2/places?categories=${category}&filter=rect%3A${lon1}%2C${lat1}%2C${lon2}%2C${lat2}&limit=${amount}&apiKey=${apiKey}`;
    //12b046bb99314b748355834551cd58d0
    //49a02e9955fe4bd38881e3ec2c56f795
    try {
      let res = await fetch(placesUrl, {
        method: "GET",
      });
      let result = await res.json();

      places.push(
        ...result.features
          .map((feature) => {
            return {
              name: feature.properties.name,
              x: lon2place(feature.properties.lon, zoom) - startTileX,
              y: lat2place(feature.properties.lat, zoom) - startTileY,
            };
          })
          .filter((it) => it.name)
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

class tile {
  constructor(pos) {
    this.blockPos =
      pos; /* This vector should be multiplied by SIZE to be in world coords */
    this.places = [];
    this.loadCounter = 0;
  }
  async load() {
    let tileset_id = "mapbox.satellite";
    let access_token =
      "pk.eyJ1IjoibHM0IiwiYSI6ImNsaXluYmYyODA1bnAzcXQ4amlweGowc3gifQ.6cQiQQxsiO3WUIbKFOQrmw";
    let format = "png";
    let x = 0; //this.x;
    let y = 0; //this.y;
    x = startTileX + this.blockPos.x;
    y = startTileY + this.blockPos.z;

    let url = `https://api.mapbox.com/v4/${tileset_id}/${zoom}/${x}/${y}.${format}?access_token=${access_token}`;

    if (x % 5 == 0 && y % 5 == 0) {
      loadPlaceCategory(this.places, "populated_place.city", x, y, zoom, 10);
      loadPlaceCategory(this.places, "populated_place.county", x, y, zoom, 10);
      loadPlaceCategory(this.places, "natural.mountain", x, y, zoom, 10);
      loadPlaceCategory(this.places, "natural.water", x, y, zoom, 10);
    }
    /* fetches for a location */
    try {
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
        this.isLoaded = true;
      } else {
        if (this.loadCounter++ < 3) this.load();
        else console.log(`At url ${url} was an HTTP error: ` + response.status);
      }
    } catch (error) {
      if (this.loadCounter++ < 3) this.load();
      else console.log(`At url ${url} was an HTTP error: ` + error);
    }
    return this;
  }
}
/*
            document.getElementById("hide").addEventListener("click", async()=>{
                await document.getElementById("dsCan").requestPointerLock({
                    unadjustedMovement: true
                });
            }
*/
function reloadTiles() {
  /* load all the near and unloaded yet */
  /*size *= Math.pow(2, roughness);
  zoom -= roughness;
  cam.userBlockPos = new vec3(
    Math.floor(cam.userLoc.x / size),
    0,
    Math.floor(cam.userLoc.z / size)
  );

  /* ROUGH TILES*/

  /* Delete the too faraway ones */
  /*roughTiles = roughTiles.filter(
    (tile) =>
      (tile.blockPos.x - cam.userBlockPos.x) *
        (tile.blockPos.x - cam.userBlockPos.x) +
        (tile.blockPos.z - cam.userBlockPos.z) *
          (tile.blockPos.z - cam.userBlockPos.z) <
      maxRoughTileRenderBufferLength2
  );
  for (let x = -maxRoughTileRenderLength + 1; x < maxRoughTileRenderLength; x++)
    for (
      let y = -maxRoughTileRenderLength + 1;
      y < maxRoughTileRenderLength;
      y++
    )
      if (x * x + y * y < maxRoughTileRenderLength2)
        if (
          !roughTiles.find(
            (tile) =>
              tile.blockPos.x == x + cam.userBlockPos.x &&
              tile.blockPos.z == y + cam.userBlockPos.z
          )
        ) {
          let newTile = new tile(
            new vec3(x + cam.userBlockPos.x, 0, y + cam.userBlockPos.z)
          );
          newTile.load().then((it) => roughTiles.push(it));
        }
  zoom += roughness;
  size /= Math.pow(2, roughness);*/
  cam.userBlockPos = new vec3(
    Math.floor(cam.userLoc.x / size),
    0,
    Math.floor(cam.userLoc.z / size)
  );
  /* usual ones*/
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
          newTile.load();
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
  placesHTML.innerHTML = "";
  for (let i = 0; i < tiles.length; i++) {
    // if (tiles[i].isLoaded) {
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
    for (let j = 0; j < tiles[i].places.length; j++) {
      let clipspace = new vec3(
        tiles[i].places[j].x * size,
        0,
        tiles[i].places[j].y * size
      );

      if (
        cam.dir.angle(clipspace.sub(cam.loc)) > 1.57 ||
        cam.dir.angle(clipspace.sub(cam.loc)) < -1.57
      )
        continue;

      // vec3 / vec4 difference
      clipspace = clipspace.mulMatr(cam.matrView).mulMatr(cam.matrProj);

      let pixelX = (clipspace.x * 0.5 + 0.5) * gl.canvas.width;
      let pixelY = (clipspace.y * -0.5 + 0.5) * gl.canvas.height;

      let placeTag = document.createElement("span");
      const nameTag = document.createTextNode(tiles[i].places[j].name);
      placeTag.appendChild(nameTag);

      placeTag.className = "place";
      placeTag.style.left = Math.floor(pixelX) + "px";
      placeTag.style.top = Math.floor(pixelY) + "px";
      placeTag.style.position = "absolute";
      placeTag.style.color = "red";
      placeTag.style.fontFamily = "impact";
      placeTag.style.backgroundColor = "black";
      placeTag.style.borderRadius = "10px";
      placeTag.style.paddingRight = placeTag.style.paddingLeft = "3px";
      placesHTML.appendChild(placeTag);
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
  placesHTML = document.getElementById("places");
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

function lon2place(lon, zoom) {
  return ((lon + 180) / 360) * Math.pow(2, zoom);
}
function lat2place(lat, zoom) {
  return (
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
