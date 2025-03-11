import { unitAdd } from "./units.js";
import { vec3, vec4 } from "../utils/mth.js";
import { markerDraw } from "../utils/markers.js";

function render() {
    for (let i = 0; i < 100; i++) {
        markerDraw(
            new vec3(0, 0, 0),
            new vec3(i / 10, -i % 10, i * 10),
            0.5,
            new vec4(0.5, 0, 0.3, 1)
        );
    }
}
async function init() {}
export function unitMarkersAdd() {
    unitAdd(init, render);
}
