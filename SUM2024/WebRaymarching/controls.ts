import { vec3, matr4 } from './mth.js'
import { Camera } from './camera.js'
import { isMouseOverCanvas } from './main.js'
export let isPause = false

export const keys = new Map<string, boolean>()
export const mouse = {
    x: 0,
    y: 0,
    savedX: 0,
    savedY: 0,
    zoom: 1,
    dx: 0,
    dy: 0,
    dz: 0,
    isDown: false,
    isRDown: false
}

export const cam = new Camera()
cam.camSet(new vec3(0, 0, -5), new vec3(0, 0, 0), new vec3(0, 1, 0), new vec3(1, 1, 1), new vec3(0, 0.8, 0))

export function handleMouseMove(event: MouseEvent) {
    mouse.dx = event.pageX - mouse.x
    mouse.dy = event.pageY - mouse.y
    mouse.x = event.pageX
    mouse.y = event.pageY
}
export function handlePause() {
    isPause = !isPause
}
export function handleMouseDown(event: MouseEvent) {
    if (event.button == 0) mouse.isDown = true
    else if (event.button == 2) mouse.isRDown = true
}

export function handleMouseUp(event: MouseEvent) {
    // mouse.savedX = event.pageX;
    //mouse.savedY = event.pageY;
    if (event.button == 0) mouse.isDown = false
    else if (event.button == 2) mouse.isRDown = false
}
export function handleMouseZoom(event: WheelEvent) {
    //mouse.dz = event.deltaY - mouse.zoom;
    mouse.dz = event.deltaY
}

export function handleKeyUp(event: KeyboardEvent) {
    keys.set(event.code, false)
}

export function handleKeyDown(event: KeyboardEvent) {
    keys.set(event.code, true)
}

const angleSpeed = 0.3
let speed = 1
const speedUp = 10
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
    cam.loc = cam.loc.add(cam.dir.mul(-mouse.dz * 0.01))
    mouse.dz = 0

    /* Mouse x */
    cam.loc = cam.loc.mulMatr(matr4.rotate(+mouse.isDown * angleSpeed * mouse.dx, cam.up.neg())) /* !!Ani->DeltaTime *  */
    /* Mouse y */
    cam.loc = cam.loc.mulMatr(matr4.rotate(+mouse.isDown * angleSpeed * mouse.dy, cam.right.neg())) /* !!Ani->DeltaTime *  */

    /*** Moving free cam ***/

    /* Mouse x */
    cam.at = cam.at.sub(cam.loc)
    cam.at = cam.at.mulMatr(matr4.rotateY(+mouse.isRDown * angleSpeed * mouse.dx))
    cam.at = cam.at.add(cam.loc)

    cam.right = cam.right.mulMatr(matr4.rotateY(+mouse.isRDown * angleSpeed * mouse.dx))

    /* Mouse y */
    /*cam.at =
    PointTransform(cam.at,
      myMatr4.rotateX(!!mouse.isRDown *
                   angleSpeed * mouse.dy));
  */
    cam.at = cam.at.sub(cam.loc)
    cam.at = cam.at.mulMatr(matr4.rotate(+mouse.isRDown * angleSpeed * mouse.dy, cam.right))

    cam.at = cam.at.add(cam.loc)

    speed += keys.get('Shift') ? speedUp : 0
    /* Arrows */
    cam.loc = cam.loc
        .add(cam.dir.mul(+!!keys.get('KeyW') * +!keys.get('ControlLeft') * speed))
        .sub(cam.dir.mul(+!!keys.get('KeyS') * +!keys.get('ControlLeft') * speed))
        .sub(cam.right.mul(+!!keys.get('KeyA') * +!keys.get('ControlLeft') * speed))
        .add(cam.right.mul(+!!keys.get('KeyD') * +!keys.get('ControlLeft') * speed))

    /* CamAt via arrows */
    cam.at = cam.at
        .add(cam.dir.mul(+!!keys.get('KeyW') * +!keys.get('ControlLeft') * speed))
        .sub(cam.dir.mul(+!!keys.get('KeyS') * +!keys.get('ControlLeft') * speed))
        .sub(cam.right.mul(+!!keys.get('KeyA') * +!keys.get('ControlLeft') * speed))
        .add(cam.right.mul(+!!keys.get('KeyD') * +!keys.get('ControlLeft') * speed))

    speed -= keys.get('Shift') ? speedUp : 0

    cam.camSet(cam.loc, cam.at, cam.up, cam.pos, cam.userLoc)
}

function walking() {
    /* Upscaling */
    cam.pos = cam.pos.add(cam.pos.mul(mouse.dz * 0.001))

    /* Rotating */
    /* Mouse x */
    cam.pos = cam.pos.mulMatr(matr4.rotateY(-mouse.isDown * angleSpeed * mouse.dx)) /* !!Ani->DeltaTime *  */
    /* Mouse y */
    cam.pos = cam.pos.mulMatr(matr4.rotateX(-mouse.isDown * angleSpeed * mouse.dy))
    cam.userDir = cam.pos.neg().normalize()
    cam.userDir.y = 0
    /* Walking */
    cam.userLoc = cam.userLoc
        .add(cam.userDir.mul(+!!keys.get('KeyW') * +!keys.get('ControlLeft') * speed))
        .add(cam.userDir.mul(-!!keys.get('KeyS') * speed))
        .add(cam.userDir.mulMatr(matr4.rotateY(90)).mul(+!!keys.get('KeyA') * speed))
        .add(cam.userDir.mulMatr(matr4.rotateY(90)).mul(-!!keys.get('KeyD') * speed))

    cam.at = cam.userLoc
    cam.dir = cam.pos.neg().normalize()
    cam.loc = cam.userLoc.add(cam.pos)
    cam.right = cam.userDir.cross(new vec3(0, 1, 0))
    cam.up = cam.right.cross(cam.dir)
}

cam.speed = 0
cam.userDir = new vec3(1, 0, 0)
cam.pos = new vec3(-1, 1, 0)
const acceleration = 0.01
const deceleration = 1.01
let rotAngle = 0
const maxRotAngle = 45
const angleAcceleration = 0.2
const angleDeceleration = 1.1

function bike() {
    cam.speed += (+!!keys.get('KeyW') - +!!keys.get('KeyS')) * acceleration
    cam.speed /= deceleration

    /* Upscaling */
    cam.pos = cam.pos.add(cam.pos.mul(mouse.dz * 0.001))

    rotAngle += (-!!keys.get('KeyD') + +!!keys.get('KeyA')) * angleAcceleration
    if (rotAngle > maxRotAngle) rotAngle = maxRotAngle
    if (rotAngle < -maxRotAngle) rotAngle = -maxRotAngle
    rotAngle /= angleDeceleration

    cam.userDir = cam.userDir.mulMatr(matr4.rotateY(rotAngle * Math.sqrt(Math.abs(cam.speed))))
    /* Walking */
    cam.pos = cam.pos.mulMatr(matr4.rotateY(rotAngle * Math.sqrt(Math.abs(cam.speed))))
    cam.userLoc = cam.userLoc.add(cam.userDir.mul(cam.speed))

    /* Rotate around bike: this do not changes driving direction */
    /* Mouse x */
    cam.pos = cam.pos.mulMatr(matr4.rotateY(-mouse.isDown * angleSpeed * mouse.dx)) /* !!Ani->DeltaTime */
    /* Mouse y */
    cam.pos = cam.pos.mulMatr(matr4.rotate(-mouse.isDown * angleSpeed * mouse.dy, cam.right))

    cam.at = cam.userLoc
    cam.dir = cam.pos.neg().normalize()
    cam.loc = cam.userLoc.add(cam.pos)
    const correctDir = new vec3(cam.dir.x, 0, cam.dir.z)
    cam.right = correctDir.cross(new vec3(0, 1, 0))
    cam.up = cam.right.cross(cam.dir)
}

export function ControlCamera() {
    if (isMouseOverCanvas) {
        if (cam.mode == 'floating') floatingCamera()
        else if (cam.mode == 'walking') walking()
        else bike()
    }
}
