import { vec3, matr4 } from "./mth.js";

export class camera {
    constructor() {
        this.projSize = 0.1;
        this.projDist = 0.1;
        this.projFarClip = 18000;
        this.frameW = 30;
        this.frameH = 30;
        this.matrView = new matr4();
        this.matrProj = new matr4();
        this.matrVP = new matr4();
        this.setDef();
    }
    camSet(loc, at, up) {
        let myMatr4 = new matr4();
        this.matrView = myMatr4.view(loc, at, up);

        this.loc = loc;
        this.at = at;

        this.dir = new vec3(
            -this.matrView[0][2],
            -this.matrView[1][2],
            -this.matrView[2][2]
        );
        this.up = new vec3(
            this.matrView[0][1],
            this.matrView[1][1],
            this.matrView[2][1]
        );
        this.right = new vec3(
            this.matrView[0][0],
            this.matrView[1][0],
            this.matrView[2][0]
        );
        this.matrVP = this.matrView.mul(this.matrProj);
        return this;
    }

    setProj(projSize, projDist, projFarClip) {
        let rx, ry;

        rx = ry = projSize;

        this.projDist = projDist;
        this.projSize = projSize;
        this.projFarClip = projFarClip;

        /* Correct aspect ratio */
        if (this.frameW > this.frameH) rx *= this.FrameW / this.frameH;
        else ry *= this.frameH / this.frameW;

        let myMatr4 = new matr4();
        this.matrProj = myMatr4.frustum(
            -rx / 2,
            rx / 2,
            -ry / 2,
            ry / 2,
            projDist,
            projFarClip
        );
        this.matrVP = this.matrView.mul(this.matrProj);
        return this;
    }

    rotate(v, a) {
        let newLoc, newUp, newAt;
        let rot = new matr4();
        rot = rot.rotate(a, v);
        newLoc = this.loc.mulMatr(rot);
        newUp = this.up.mulMatr(rot);
        newAt = this.at.mulMatr(rot);
        this.camSet(newLoc, newAt, newUp);
        return this;
    }
    setSize(frameW, frameH) {
        this.frameW = frameW;
        this.frameH = frameH;
        this.setProj(this.projSize, this.projDist, this.projFarClip);
        return this;
    }
    setDef() {
        this.loc = new vec3(0, 0, 1);
        this.at = new vec3(0, 0, 0);
        this.dir = new vec3(0, 0, -1);
        this.up = new vec3(0, 1, 0);
        this.right = new vec3(1, 0, 0);

        this.projDist = 0.1;
        this.projSize = 0.1;
        this.projFarClip = 10000;

        this.frameW = 30;
        this.frameH = 30;

        this.camSet(this.loc, this.at, this.up);
        this.setProj(this.projSize, this.projDist, this.projFarClip);
        this.setSize(this.frameW, this.frameH);
        return this;
    }
}
