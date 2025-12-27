import { unitAdd } from "./units.js";
import { primitives } from "../rnd/prims.js";

function render() {
  primitives.forEach((it) => it.draw(it.trans));
}
async function init() {}
export function unitObjAdd() {
  unitAdd(init, render);
}
