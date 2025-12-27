import { unitAdd } from "./units.js";
import { primsLoad } from "../rnd/prims.js";
import { matr4, vec3 } from "../utils/mth.js";
import { cam } from "../utils/controls.js";
import { users, gl } from "../main.js";

let primitives;
let myMatr4 = new matr4();
let success = 1;
let side = new vec3(0, 0, -1);
let placesHTML;
let oldLoc = cam.userLoc.copy();
function render() {
  cam.mode = 1;
  if (success) {
    primitives.draw(
      myMatr4
        .rotateY((side.angle(cam.userDir) * 180) / Math.PI + 180)
        .mul(myMatr4.scale(new vec3(2, 2, 2)))
        .mul(myMatr4.translate(new vec3(cam.userLoc.x, 0, cam.userLoc.z))),
      true //oldLoc.sub(cam.userLoc).len2() > 0.1
    );
  }
  oldLoc = cam.userLoc.copy();

  for (let userCam of users) {
    if (userCam != null && cam.id != userCam.id) {
      let world = myMatr4
        .rotateY(
          (side.angle(
            new vec3(userCam.right.x, userCam.right.y, userCam.right.z)
          ) *
            180) /
            Math.PI +
            180
        )
        .mul(myMatr4.scale(new vec3(2, 2, 2)))
        .mul(
          myMatr4.translate(new vec3(userCam.userLoc.x, 0, userCam.userLoc.z))
        );
      primitives.draw(world);

      let clipspace = new vec3(
        userCam.userLoc.x,
        userCam.userLoc.y,
        userCam.userLoc.z
      );

      if (
        cam.userDir.angle(clipspace.sub(cam.loc)) > 1.57 ||
        cam.userDir.angle(clipspace.sub(cam.loc)) < -1.57
      )
        continue;

      clipspace = clipspace.mulMatr(cam.matrView).mulMatr(cam.matrProj);

      let pixelX = (clipspace.x * 0.5 + 0.5) * gl.canvas.width;
      let pixelY = (clipspace.y * -0.5 + 0.5) * gl.canvas.height;

      let placeTag = document.createElement("span");
      const nameTag = document.createTextNode(userCam.userName);
      placeTag.appendChild(nameTag);

      placeTag.className = "place";
      placeTag.style.left = Math.floor(pixelX) + "px";
      placeTag.style.top = Math.floor(pixelY) + "px";
      placeTag.style.position = "absolute";
      placeTag.style.fontSize = "24px";
      placeTag.style.color = "green";
      placeTag.style.fontFamily = "impact";
      placeTag.style.backgroundColor = "black";
      placeTag.style.borderRadius = "10px";
      placeTag.style.paddingRight = placeTag.style.paddingLeft = "3px";
      placesHTML.appendChild(placeTag);
    }
  }
}
async function init() {
  placesHTML = document.getElementById("places");

  primitives = await primsLoad("bin/models/mer.g3dm");
  primitives.prims.forEach((primitive) => {
    primitive.mtl.shaderName = "user";
    primitive.create();
  });
  await primitives.create();
}

export function unitUserAdd() {
  unitAdd(init, render, "user");
}
