import { vec3, matr4 } from "./mth.js";
import { camera } from "./camera.js";
export let isPause = false;
export let isWalking = false;
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
cam.camSet(new vec3(18, 10, 10), new vec3(0, 8, -5), new vec3(0, 1, 0));

cam.camSet(new vec3(62, -16, 67), new vec3(28, 39, -6), new vec3(0, 1, 0));

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
    keys[event.key] = 0;
}

export function handleKeyDown(event) {
    keys[event.key] = 1;
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
        myMatr4.rotate(mouse.isRDown * angleSpeed * mouse.dx, cam.up)
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
        .add(cam.dir.mul(!!keys["w"] * !keys["Control"] * speed))
        .sub(cam.dir.mul(!!keys["s"] * !keys["Control"] * speed))
        .sub(cam.right.mul(!!keys["a"] * !keys["Control"] * speed))
        .add(cam.right.mul(!!keys["d"] * !keys["Control"] * speed));

    /* CamAt via arrows */
    cam.at = cam.at
        .add(cam.dir.mul(!!keys["w"] * !keys["Control"] * speed))
        .sub(cam.dir.mul(!!keys["s"] * !keys["Control"] * speed))
        .sub(cam.right.mul(!!keys["a"] * !keys["Control"] * speed))
        .add(cam.right.mul(!!keys["d"] * !keys["Control"] * speed));

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
    cam.pos = cam.pos.add(cam.pos.mul(-mouse.dz * speed));

    let myMatr4 = new matr4();
    /* Rotating */
    /* Mouse x */
    cam.pos = cam.pos.mulMatr(
        myMatr4.rotateY(mouse.isDown * angleSpeed * mouse.dx)
    ); /* !!Ani->DeltaTime *  */
    /* Mouse y */
    cam.pos = cam.pos.mulMatr(
        myMatr4.rotateX(mouse.isDown * angleSpeed * mouse.dy)
    );
    cam.userdir = cam.pos.negate().normalize();
    cam.userdir.y = 0;
    /* Walking */
    cam.userloc = cam.userloc.add(
        cam.userdir.mul(keys["w"] * !keys["Control"] * speed)
    );

    cam.userloc = cam.userloc.add(cam.userdir.mul(-keys["s"] * speed));

    cam.userloc =
        /* Right-pointing direction */
        cam.userloc.add(
            cam.userdir.mulMatr(myMatr4.rotateY(90)).mul(-!!keys["A"] * speed)
        );

    cam.userloc = cam.userloc.add(
        cam.userdir.mulMatr(myMatr4.rotateY(90)).mul(!!keys["D"] * speed)
    );

    cam.at = cam.userloc;
    cam.loc = cam.userloc.add(cam.pos);
}

export function ControlCamera() {
    if (!isWalking) floatingCamera();
    else walking();
}
