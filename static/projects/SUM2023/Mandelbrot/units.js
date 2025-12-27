import { unitCubeAdd } from "./unitCube.js";
import { unitTetrAdd } from "./unitTetrahedron.js";
import { unitOctaAdd } from "./unitOctahedron.js";
import { unitIcoAdd } from "./unitIcosahedron.js";
import { unitMrkAdd } from "./markers.js";
import { unitMarkersAdd } from "./unitmarker.js";
import { unitFracAdd } from "./unitFractal.js";
import { unitObjAdd } from "./unitObj.js";
import { unitPlaneAdd } from "./unitPlane.js";

export class unit {
    constructor(init, render) {
        this.init = init;
        this.render = render;
    }
}
let units = [];

export async function init() {
    unitFracAdd();
    unitCubeAdd();
    unitTetrAdd();
    unitOctaAdd();
    unitIcoAdd();
    unitMrkAdd();
    unitMarkersAdd();
    //unitObjAdd();
    unitPlaneAdd();
    for (let i = 0; i < units.length; i++) {
        await units[i].init();
    }
}

export function render() {
    units.forEach((unit) => {
        unit.render();
    });
}

export function unitAdd(init, render) {
    units.push(new unit(init, render));
}
