import { unitAdd } from "./units.js";
import { primLoadObj } from "../rnd/prims.js";
import { matr4, vec3 } from "../utils/mth.js";
let dode;
let myMatr4 = new matr4();
function render() {
  dode.mtl.ka.x = Math.sin(Date.now() / 100);
  dode.draw(
    myMatr4
      .scale(
        new vec3(
          (Math.sin(Date.now() / 500) + 2) * 1,
          (Math.cos(Date.now() / 200) + 2) * 1,
          (Math.sin(Date.now() / 300 + 5) + 2) * 1
        )
      )
      .mul(myMatr4.translate(new vec3(0, -3, 0)))
  );
}
async function init() {
  let obj;

  const pr = fetch(`bin/models/dode.obj`)
    .then((res) => res.text())
    .then((data) => {
      obj = data;
    });

  await pr.then(() => {
    primLoadObj(obj).then((it) => (dode = it));
  });
}
export function unitDodeAdd() {
  unitAdd(init, render, "Dodecahedron");
}
