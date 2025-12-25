import { unitCubeAdd } from "./unitCube.js";
import { unitTetrAdd } from "./unitTetrahedron.js";
import { unitOctaAdd } from "./unitOctahedron.js";
import { unitIcoAdd } from "./unitIcosahedron.js";
import { unitMrkAdd } from "../utils/markers.js";
import { unitDbgAdd } from "./unitDbg.js";
import { unitMarkersAdd } from "./unitmarker.js";
import { unitObjAdd } from "./unitObj.js";
import { unitPlaneAdd } from "./unitPlane.js";
import { unitDodeAdd } from "./unitDodecahedron.js";
import { unitCowAdd } from "./unitCow.js";
import { unitBikeAdd } from "./unitBike.js";
import { unitUserAdd } from "./unitUser.js";
import { unitMapAdd } from "./unitMap.js";
import { unitFractalSkyAdd } from "./unitFractalSky.js";
import { unitInterfaceAdd } from "./unitInterface.js";
import { unitClothAdd } from "./unitCloth.js";

export class unit {
  constructor(init, render, name) {
    this.init = init;
    this.render = render;
    this.isToRender = true;
    this.name = name;
  }
}
let units = [];

export async function init() {
  unitFractalSkyAdd();
  unitClothAdd();
  unitInterfaceAdd();
  unitObjAdd();
  unitPlaneAdd();
  unitIcoAdd();
  unitCubeAdd();
  unitTetrAdd();
  unitOctaAdd();
  unitDodeAdd();
  unitDbgAdd();
  unitCowAdd();
  unitMarkersAdd();
  unitMapAdd();
  unitUserAdd();
  unitBikeAdd();
  unitMrkAdd();

  for (let i = 0; i < units.length; i++) {
    await units[i].init();
  }
  for (let i = 0; i < units.length; i++) {
    let input = document.createElement("input");
    input.type = "checkbox";
    let id = "unit" + i;
    input.id = id;
    let label = document.createElement("label");
    label.appendChild(input);
    label.innerHTML += units[i].name;
    document.getElementById("unitsChecker").appendChild(label);
    document.getElementById("unitsChecker").innerHTML += "<br />";
  }
  units.forEach((unit, index) => {
    switch (unit.name) {
      case "Plane":
        break;
      case "user":
        break;
      case "cows":
        break;
      case "markers":
        break;
      case "Icosahedron":
        break;
      case "Tetrahedron":
        break;
      case "cube":
        break;
      case "Debug":
        break;
      case "Octahedron":
        break;
      default:
        document.getElementById("unit" + index).checked = true;
    }
  });
}

export function render() {
  units.forEach((unit, index) => {
    if (document.getElementById("unit" + index).checked) unit.render();
  });
}

export function unitAdd(init, render, name) {
  units.push(new unit(init, render, name));
}
