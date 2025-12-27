import { matr4, vec3 } from './mth'

export class Camera {
    projSize = 0.1
    projDist = 0.1
    projFarClip = 18000
    frameW = 30
    frameH = 30
    matrView = new matr4()
    matrProj = new matr4()
    matrVP = new matr4()
    id = Math.random().toString()
    mode: 'floating' | 'walking' | 'bike' = 'floating'
    userDir = new vec3()
    loc = new vec3()
    at = new vec3()
    speed = 0
    dir = new vec3(-this.matrView.m[0][2], -this.matrView.m[1][2], -this.matrView.m[2][2])
    up = new vec3(this.matrView.m[0][1], this.matrView.m[1][1], this.matrView.m[2][1])
    right = new vec3(this.matrView.m[0][0], this.matrView.m[1][0], this.matrView.m[2][0])
    pos = new vec3()
    userLoc = new vec3()

    camSet(loc: vec3, at: vec3, up: vec3, pos: vec3, userLoc: vec3) {
        const myMatr4 = new matr4()
        this.matrView = myMatr4.view(loc, at, up)

        this.loc = loc
        this.at = at

        this.dir = new vec3(-this.matrView.m[0][2], -this.matrView.m[1][2], -this.matrView.m[2][2])
        this.up = new vec3(this.matrView.m[0][1], this.matrView.m[1][1], this.matrView.m[2][1])
        this.right = new vec3(this.matrView.m[0][0], this.matrView.m[1][0], this.matrView.m[2][0])
        this.pos = pos
        this.userLoc = userLoc
        this.matrVP = this.matrView.mul(this.matrProj)
        return this
    }

    setProj(projSize: number, projDist: number, projFarClip: number) {
        let rx, ry

        rx = ry = projSize

        this.projDist = projDist
        this.projSize = projSize
        this.projFarClip = projFarClip

        /* Correct aspect ratio */
        if (this.frameW > this.frameH) rx *= this.frameW / this.frameH
        else ry *= this.frameH / this.frameW

        const myMatr4 = new matr4()
        //not sure
        //this.matrProj = myMatr4.frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, projDist, projFarClip)
        this.matrVP = this.matrView.mul(this.matrProj)
        return this
    }

    /*rotate(v, a) {
    let newLoc, newUp, newAt;
    let rot = new matr4();
    rot = rot.rotate(a, v);
    newLoc = this.loc.mulMatr(rot);
    newUp = this.up.mulMatr(rot);
    newAt = this.at.mulMatr(rot);
    this.camSet(newLoc, newAt, newUp);
    return this;
  }*/
    setSize(frameW: number, frameH: number) {
        this.frameW = frameW
        this.frameH = frameH
        this.setProj(this.projSize, this.projDist, this.projFarClip)
        return this
    }
    setDef() {
        this.loc = new vec3(-5, 0, -5)
        this.at = new vec3(0, 0, 0)
        this.up = new vec3(0, 1, 0)

        this.projDist = 0.1
        this.projSize = 0.1
        this.projFarClip = 10000

        this.frameW = 30
        this.frameH = 30

        this.camSet(this.loc, this.at, this.up, this.pos, this.userLoc)
        this.setProj(this.projSize, this.projDist, this.projFarClip)
        this.setSize(this.frameW, this.frameH)
        return this
    }
}
