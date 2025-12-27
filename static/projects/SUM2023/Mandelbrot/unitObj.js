import { gl } from "./main.js";
import { unitAdd } from "./units.js";
import { cam } from "./controls.js";
import { matr4, vec3 } from "./mth.js";
import { shaderAdd, useShader } from "./shaders.js";

function render() {}
async function init() {}
export function unitObjAdd() {
    unitAdd(init, render);
}
