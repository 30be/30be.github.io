import { vec3, matr4 } from "./mth.js";
import { camera } from "./camera.js";
export let isPause = false;

export let keys = [];
export let mouse = {
  x: 0,
  y: 0,
  savedX: 0,
  savedY: 0,
  zoom: 1,
  dx: 0,
  dy: 0,
  dz: 0,
  isDown: false,
  isRDown: false,
};

export let cam = new camera();
//cam. (new vec3(18, 10, 10), new vec3(0, 8, -5), new vec3(0, 1, 0));
/*
cam.camSet(
  new vec3(62, -16, 67),
  new vec3(28, 39, -6),
  new vec3(0, 1, 0),
  new vec3(2, 2, 2),
  new vec3(0, 1.5, 0)
);
*/
cam.camSet(
  new vec3(0, 2.5, 0),
  new vec3(0, 0, -6),
  new vec3(0, 1, 0),
  new vec3(1, 1, 1),
  new vec3(0, 0.8, 0)
);

export function handleMouseMove(event) {
  mouse.dx = event.pageX - mouse.x;
  mouse.dy = event.pageY - mouse.y;
  mouse.x = event.pageX;
  mouse.y = event.pageY;
}
export function handlePause() {
  isPause = !isPause;
}
export function handleMouseDown(event) {
  if (event.button == 0) mouse.isDown = true;
  else if (event.button == 2) mouse.isRDown = true;
}

export function handleMouseUp(event) {
  // mouse.savedX = event.pageX;
  //mouse.savedY = event.pageY;
  if (event.button == 0) mouse.isDown = false;
  else if (event.button == 2) mouse.isRDown = false;
}
export function handleMouseZoom(event) {
  //mouse.dz = event.deltaY - mouse.zoom;
  mouse.dz = event.deltaY;
}

export function handleKeyUp(event) {
  keys[event.code] = 0;
}

export function handleKeyDown(event) {
  keys[event.code] = 1;
}

let angleSpeed = 0.05;
let speed = 1;
let speedUp = 10;
export function floatingCamera() {
  /*let th =
        mouse.isDown *
        angleSpeed *
        Math.sqrt(mouse.dy * mouse.dy + mouse.dx * mouse.dx);
    */ /*
    let dist = cam.at.sub(cam.loc).len(),
        cosT = cam.loc.y - cam.at.y / dist,
        sinT = Math.sqrt(1 - cosT * cosT),
        plen = dist * sinT,
        cosP = (cam.loc.z - cam.at.z) / plen,
        sinP = (cam.loc.x - cam.at.x) / plen,
        azimuth = (Math.atan2(sinP, cosP) / Math.PI) * 180,
        elevator = (Math.atan2(sinT, cosT) / Math.PI) * 180;
*/
  cam.loc = cam.loc.add(cam.dir.mul(-mouse.dz * 0.01));

  let myMatr4 = new matr4();
  /* Mouse x */
  cam.loc = cam.loc.mulMatr(
    myMatr4.rotate(mouse.isDown * angleSpeed * mouse.dx, cam.up.neg())
  ); /* !!Ani->DeltaTime *  */
  /* Mouse y */
  cam.loc = cam.loc.mulMatr(
    myMatr4.rotate(mouse.isDown * angleSpeed * mouse.dy, cam.right.neg())
  ); /* !!Ani->DeltaTime *  */

  /*** Moving free cam ***/

  /* Mouse x */
  cam.at = cam.at.sub(cam.loc);
  cam.at = cam.at.mulMatr(
    myMatr4.rotateY(mouse.isRDown * angleSpeed * mouse.dx)
  );
  cam.at = cam.at.add(cam.loc);

  cam.right = cam.right.mulMatr(
    myMatr4.rotateY(mouse.isRDown * angleSpeed * mouse.dx)
  );

  /* Mouse y */
  /*cam.at =
    PointTransform(cam.at,
      myMatr4.rotateX(!!mouse.isRDown *
                   angleSpeed * mouse.dy));
  */
  cam.at = cam.at.sub(cam.loc);
  cam.at = cam.at.mulMatr(
    myMatr4.rotate(mouse.isRDown * angleSpeed * mouse.dy, cam.right)
  );

  cam.at = cam.at.add(cam.loc);

  speed += keys["Shift"] ? speedUp : 0;
  /* Arrows */
  cam.loc = cam.loc
    .add(cam.dir.mul(!!keys["KeyW"] * !keys["ControlLeft"] * speed))
    .sub(cam.dir.mul(!!keys["KeyS"] * !keys["ControlLeft"] * speed))
    .sub(cam.right.mul(!!keys["KeyA"] * !keys["ControlLeft"] * speed))
    .add(cam.right.mul(!!keys["KeyD"] * !keys["ControlLeft"] * speed));

  /* CamAt via arrows */
  cam.at = cam.at
    .add(cam.dir.mul(!!keys["KeyW"] * !keys["ControlLeft"] * speed))
    .sub(cam.dir.mul(!!keys["KeyS"] * !keys["ControlLeft"] * speed))
    .sub(cam.right.mul(!!keys["KeyA"] * !keys["ControlLeft"] * speed))
    .add(cam.right.mul(!!keys["KeyD"] * !keys["ControlLeft"] * speed));

  speed -= keys["Shift"] ? speedUp : 0; /*

    /*** 
  Parallel transition 
  ***/ /*
    azimuth += globalDeltaTime * 3 * (-30 * mouse.isDown * mouse.dx);
    elevator += globalDeltaTime * 2 * (-30 * mouse.isDown * mouse.dy);

    if (elevator < 0.08) elevator = 0.08;
    else if (elevator > 178.9) elevator = 178.9;
    dist +=
        globalDeltaTime *
        (1 + keys["Shift"] * 27) *
        (2 * mouse.dz + 8 * (keys["Next"] - keys["Prior"]));
    if (dist < 0.1) dist = 0.1;

    if (mouse.isDown && keys["Shift"]) {
        let wp, hp, sx, sy;
        let dv;

        wp = cam.projSize;
        hp = cam.projSize;

        if (cam.frameW > cam.frameH) wp *= (cam.frameW * 1.0) / cam.frameH;
        else hp *= (cam.frameH * 1.0) / cam.frameW;
        sx = (((-mouse.dx * Wp) / cam.frameW) * dist) / cam.projdist;
        sy = (((-mouse.dy * hp) / cam.frameH) * dist) / cam.projdist;
        dv = cam.right.mul(sx).add(cam.up.mul(sy));
        cam.at = cam.at.add(dv);
        cam.loc = cam.loc.add(dv);
    }*/
}

function walking() {
  /* Upscaling */
  cam.pos = cam.pos.add(cam.pos.mul(mouse.dz * 0.001));

  let myMatr4 = new matr4();
  /* Rotating */
  /* Mouse x */
  cam.pos = cam.pos.mulMatr(
    myMatr4.rotateY(-mouse.isDown * angleSpeed * mouse.dx)
  ); /* !!Ani->DeltaTime *  */
  /* Mouse y */
  cam.pos = cam.pos.mulMatr(
    myMatr4.rotateX(-mouse.isDown * angleSpeed * mouse.dy)
  );
  cam.userDir = cam.pos.neg().normalize();
  cam.userDir.y = 0;
  /* Walking */
  cam.userLoc = cam.userLoc
    .add(cam.userDir.mul(!!keys["KeyW"] * !keys["ControlLeft"] * speed))
    .add(cam.userDir.mul(-!!keys["KeyS"] * speed))
    .add(cam.userDir.mulMatr(myMatr4.rotateY(90)).mul(!!keys["KeyA"] * speed))
    .add(cam.userDir.mulMatr(myMatr4.rotateY(90)).mul(-!!keys["KeyD"] * speed));

  cam.at = cam.userLoc;
  cam.dir = cam.pos.neg().normalize();
  cam.loc = cam.userLoc.add(cam.pos);
  cam.right = cam.userDir.cross(new vec3(0, 1, 0));
  cam.up = cam.right.cross(cam.dir);
}

let myMatr4 = new matr4();

cam.speed = 0;
cam.userDir = new vec3(1, 0, 0);
cam.pos = new vec3(-1, 1, 0);
let acceleration = 0.01;
let deceleration = 1.01;
let rotAngle = 0;
let maxRotAngle = 45;
let angleAcceleration = 0.2;
let angleDeceleration = 1.1;

function bike() {
  cam.speed += (!!keys["KeyW"] - !!keys["KeyS"]) * acceleration;
  cam.speed /= deceleration;

  /* Upscaling */
  cam.pos = cam.pos.add(cam.pos.mul(mouse.dz * 0.001));

  rotAngle += (-!!keys["KeyD"] + !!keys["KeyA"]) * angleAcceleration;
  if (rotAngle > maxRotAngle) rotAngle = maxRotAngle;
  if (rotAngle < -maxRotAngle) rotAngle = -maxRotAngle;
  rotAngle /= angleDeceleration;

  cam.userDir = cam.userDir.mulMatr(
    myMatr4.rotateY(rotAngle * Math.sqrt(Math.abs(cam.speed)))
  );
  /* Walking */
  cam.pos = cam.pos.mulMatr(
    myMatr4.rotateY(rotAngle * Math.sqrt(Math.abs(cam.speed)))
  );
  cam.userLoc = cam.userLoc.add(cam.userDir.mul(cam.speed));

  /* Rotate around bike: this do not changes driving direction */
  /* Mouse x */
  cam.pos = cam.pos.mulMatr(
    myMatr4.rotateY(-mouse.isDown * angleSpeed * mouse.dx)
  ); /* !!Ani->DeltaTime */
  /* Mouse y */
  cam.pos = cam.pos.mulMatr(
    myMatr4.rotate(-mouse.isDown * angleSpeed * mouse.dy, cam.right)
  );

  cam.at = cam.userLoc;
  cam.dir = cam.pos.neg().normalize();
  cam.loc = cam.userLoc.add(cam.pos);
  let correctDir = new vec3(cam.dir.x, 0, cam.dir.z);
  cam.right = correctDir.cross(new vec3(0, 1, 0));
  cam.up = cam.right.cross(cam.dir);
}

export function ControlCamera() {
  if (cam.mode == 0) floatingCamera();
  else if (cam.mode == 1) walking();
  else bike();
  cam.mode = 0;
}
