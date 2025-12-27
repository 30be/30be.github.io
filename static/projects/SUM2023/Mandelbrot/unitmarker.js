import { gl } from "./main.js";
import { unitAdd } from "./units.js";
import { cam } from "./controls.js";
import { vec3, vec4 } from "./mth.js";
import { shaderAdd, useShader } from "./shaders.js";
import { marker } from "./markers.js";

let tetrVertexArray;
let shaderI;
function render() {
    let mrk = new marker(
        new vec3(0, 0, 0),
        new vec3(100, 100, 100),
        1,
        new vec4(1, 0, 1, 1)
    );
}
async function init() {}
export function unitMarkersAdd() {
    unitAdd(init, render);
}
