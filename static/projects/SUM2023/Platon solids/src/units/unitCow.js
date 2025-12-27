import { unitAdd } from "./units.js";
import { primLoadObj } from "../rnd/prims.js";
import { matr4, vec3 } from "../utils/mth.js";
let primitive;
let myMatr4 = new matr4();
let success = 1;
function render() {
  if (success) {
    primitive.draw(
      myMatr4
        .scale(
          new vec3(
            (Math.sin(Date.now() / 200) / 5 + 1.2) * 0.2,
            (Math.cos(Date.now() / 300) / 5 + 1.2) * 0.2,
            (Math.sin(Date.now() / 400 + 5) / 5 + 1.2) * 0.2
          )
        )
        .mul(myMatr4.translate(new vec3(0, -3, 0)))
        .mul(myMatr4.translate(new vec3(-10, 0, 0)))
    );
    let n = 40;
    for (let i = 0; i < n * n; i++) {
      primitive.mtl.ka = new vec3(
        (Math.sin(Date.now() / 200 + i) / 5 + 1.2) * 0.4,
        (Math.cos(Date.now() / 300 + i) / 5 + 1.2) * 0.4,
        (Math.sin(Date.now() / 400 + 5 + i) / 5 + 1.2) * 0.4
      );
      primitive.draw(
        myMatr4
          .scale(
            new vec3(
              (Math.sin(Date.now() / 200 + i) / 5 + 1.2) * 0.2,
              (Math.cos(Date.now() / 300 + i) / 5 + 1.2) * 0.2,
              (Math.sin(Date.now() / 400 + 5 + i) / 5 + 1.2) * 0.2
            )
          )
          .mul(
            myMatr4.translate(new vec3(0, Math.floor(i / n) * 5, -(i % n) * 5))
          )
      );
    }
  }
}
async function init() {
  let obj;

  await fetch(`bin/models/cow1.obj`)
    .then((res) => res.text())
    .then((data) => {
      obj = data;
    })
    .catch(() => (success = 0));

  primitive = await primLoadObj(obj);
  primitive.mtl.shaderName = "withLightSmooth";
  await primitive.create();
}
export function unitCowAdd() {
  unitAdd(init, render);
}
