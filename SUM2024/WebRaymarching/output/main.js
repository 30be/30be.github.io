var XXX = (function (exports) {
  'use strict';

  class S {
      _s;
      _name = 'S';
      constructor(v = '0.') {
          if (typeof v == 'string')
              this._s = v;
          else
              this._s = v.toString();
      }
      get s() {
          if (isNaN(+this._s))
              return this._s;
          else
              return (+this._s).toFixed(3);
      }
      set s(newS) {
          this._s = newS;
      }
      toString() {
          return this.s;
      }
  }
  function isS(value) {
      return value && value._name == 'S';
  }
  function isSVec(value) {
      return value && value._name == 'svec3'; // I have no idea why and how this should work
  }
  function isVec(value) {
      return value && value._name == 'vec3'; // I have no idea why and how this should work
  }
  class svec3 {
      _x;
      _y;
      _z;
      _name = 'svec3';
      constructor(x = '0', y = '0', z = '0') {
          if (typeof x == 'number')
              this._x = x.toString();
          else
              this._x = x;
          if (typeof y == 'number')
              this._y = y.toString();
          else
              this._y = y;
          if (typeof z == 'number')
              this._z = z.toString();
          else
              this._z = z;
      }
      get x() {
          if (isNaN(+this._x))
              return this._x;
          else
              return (+this._x).toFixed(1);
      }
      get z() {
          if (isNaN(+this._z))
              return this._z;
          else
              return (+this._z).toFixed(1);
      }
      get y() {
          if (isNaN(+this._y))
              return this._y;
          else
              return (+this._y).toFixed(1);
      }
      set x(newVal) {
          this._x = newVal;
      }
      set y(newVal) {
          this._y = newVal;
      }
      set z(newVal) {
          this._z = newVal;
      }
      str = () => `vec3(${this.x},${this.y},${this.z})`;
      toVec3 = () => new vec3(+this.x, +this.y, +this.z);
  }
  class vec3 {
      x;
      y;
      z;
      _name = 'vec3';
      constructor(x = 0, y = 0, z = 0) {
          this.x = x;
          this.y = y;
          this.z = z;
      }
      arr = () => [this.x, this.y, this.z];
      arr4 = (w = 0) => [this.x, this.y, this.z, w];
      str = () => `vec3(${this.x},${this.y},${this.z})`;
      copy = () => new vec3(this.x, this.y, this.z);
      eq = (vec) => this.x == vec.x && this.y == vec.y && this.z == vec.z;
      add = (vec) => new vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
      sub = (vec) => new vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
      mul = (n) => new vec3(this.x * n, this.y * n, this.z * n);
      div = (n) => (n != 0 ? new vec3(this.x / n, this.y / n, this.z / n) : new vec3());
      neg = () => new vec3(-this.x, -this.y, -this.z);
      dot = (vec) => this.x * vec.x + this.y * vec.y + this.z * vec.z;
      cross = (vec) => new vec3(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
      len2 = () => this.x * this.x + this.y * this.y + this.z * this.z;
      len = () => Math.sqrt(this.len2());
      normalize = () => this.div(this.len());
      lerp = (vec, c = 0.5) => new vec3(this.x + (vec.x - this.x) * c, this.y + (vec.y - this.y) * c, this.z + (vec.z - this.z) * c);
      mulMatr(m) {
          const w = this.x * m.m[0][3] + this.y * m.m[1][3] + this.z * m.m[2][3] + m.m[3][3];
          return new vec3((this.x * m.m[0][0] + this.y * m.m[1][0] + this.z * m.m[2][0] + m.m[3][0]) / w, (this.x * m.m[0][1] + this.y * m.m[1][1] + this.z * m.m[2][1] + m.m[3][1]) / w, (this.x * m.m[0][2] + this.y * m.m[1][2] + this.z * m.m[2][2] + m.m[3][2]) / w);
      }
      angle(vec, up = new vec3(0, 1, 0)) {
          if (vec.len2() == 0 || this.len2() == 0)
              return 0;
          let angle = Math.acos(this.dot(vec) / (this.len() * vec.len()));
          if (this.cross(vec).dot(up) < 0)
              angle = -angle;
          return angle;
      }
      get xxx() {
          return new vec3(this.x, this.x, this.x);
      }
      get yyy() {
          return new vec3(this.y, this.y, this.y);
      }
      get zzz() {
          return new vec3(this.z, this.z, this.z);
      }
  }
  class matr4 {
      /*
    '0': number[]
    '1': number[]
    '2': number[]
    '3': number[]
  */
      m = [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1]
      ];
      constructor(m) {
          if (m)
              this.m = m;
      }
      str3x4 = () => 'mat4x3(' +
          this.m
              .map((old) => old.slice(0, -1))
              .flat()
              .join(',') +
          ')';
      static translate(vec) {
          return new matr4([
              [1, 0, 0, 0],
              [0, 1, 0, 0],
              [0, 0, 1, 0],
              [vec.x, vec.y, vec.z, 1]
          ]);
      }
      static scale(vec) {
          return new matr4([
              [vec.x, 0, 0, 0],
              [0, vec.y, 0, 0],
              [0, 0, vec.z, 0],
              [0, 0, 0, 1]
          ]);
      }
      static rotateX(angleInDegree) {
          const m = new matr4();
          const a = (angleInDegree / 180) * Math.PI;
          const sine = Math.sin(a);
          const cosine = Math.cos(a);
          m.m[1][1] = cosine;
          m.m[2][2] = cosine;
          m.m[1][2] = sine;
          m.m[2][1] = -sine;
          return m;
      }
      static rotateY(angleInDegree) {
          const m = new matr4();
          const a = (angleInDegree / 180) * Math.PI;
          const sine = Math.sin(a);
          const cosine = Math.cos(a);
          m.m[0][0] = cosine;
          m.m[2][2] = cosine;
          m.m[0][2] = -sine;
          m.m[2][0] = sine;
          return m;
      }
      static rotateZ(angleInDegree) {
          const m = new matr4();
          const a = (angleInDegree / 180) * Math.PI;
          const sine = Math.sin(a);
          const cosine = Math.cos(a);
          m.m[0][0] = cosine;
          m.m[1][1] = cosine;
          m.m[0][1] = sine;
          m.m[1][0] = -sine;
          return m;
      }
      static rotate(angleInDegree, v) {
          const a = (angleInDegree / 180) * Math.PI;
          const si = Math.sin(a);
          const co = Math.cos(a);
          return new matr4([
              [co + v.x * v.x * (1 - co), v.x * v.y * (1 - co) + v.z * si, v.x * v.z * (1 - co) - v.y * si, 0],
              [v.y * v.x * (1 - co) - v.z * si, co + v.y * v.y * (1 - co), v.y * v.z * (1 - co) + v.x * si, 0],
              [v.z * v.x * (1 - co) + v.y * si, v.z * v.y * (1 - co) - v.x * si, co + v.z * v.z * (1 - co), 0],
              [0, 0, 0, 1]
          ]);
      }
      /*
    transpose() {
      let res = new matr4()

      (res.m[0][0] = this.m[0][0]), (res.m[0][1] = this.m[1][0]), (res.m[0][2] = this.m[2][0]), (res.m[0][3] = this.m[3][0])
      (res.m[1][0] = this.m[0][1]), (res.m[1][1] = this.m[1][1]), (res.m[1][2] = this.m[2][1]), (res.m[1][3] = this.m[3][1])
      (res.m[2][0] = this.m[0][2]), (res.m[2][1] = this.m[1][2]), (res.m[2][2] = this.m[2][2]), (res.m[2][3] = this.m[3][2])
      (res.m[3][0] = this.m[0][3]), (res.m[3][1] = this.m[1][3]), (res.m[3][2] = this.m[2][3]), (res.m[3][3] = this.m[3][3])

      return res
    }
  */
      determ3x3(A11, A12, A13, A21, A22, A23, A31, A32, A33) {
          return A11 * A22 * A33 + A12 * A23 * A31 + A13 * A21 * A32 - A11 * A23 * A32 - A12 * A21 * A33 - A13 * A22 * A31;
      }
      determ() {
          return (+this.m[0][0] *
              this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) +
              -this.m[0][1] *
                  this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) +
              +this.m[0][2] *
                  this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) +
              -this.m[0][3] *
                  this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]));
      }
      inverse() {
          const det = this.determ();
          const r = new matr4();
          if (det == 0)
              return new matr4();
          r.m[0][0] =
              +this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det;
          r.m[1][0] =
              -this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det;
          r.m[2][0] =
              +this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det;
          r.m[3][0] =
              -this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det;
          r.m[0][1] =
              -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det;
          r.m[1][1] =
              +this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det;
          r.m[2][1] =
              -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det;
          r.m[3][1] =
              +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det;
          r.m[0][2] =
              +this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[1][1], this.m[1][2], this.m[1][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det;
          r.m[1][2] =
              -this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[1][0], this.m[1][2], this.m[1][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det;
          r.m[2][2] =
              +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[1][0], this.m[1][1], this.m[1][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det;
          r.m[3][2] =
              -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[1][0], this.m[1][1], this.m[1][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det;
          r.m[0][3] =
              -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3]) / det;
          r.m[1][3] =
              +this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3]) / det;
          r.m[2][3] =
              -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3]) / det;
          r.m[3][3] =
              +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2]) / det;
          return r;
      }
      mul(m) {
          const r = new matr4();
          r.m[0][0] = this.m[0][0] * m.m[0][0] + this.m[0][1] * m.m[1][0] + this.m[0][2] * m.m[2][0] + this.m[0][3] * m.m[3][0];
          r.m[0][1] = this.m[0][0] * m.m[0][1] + this.m[0][1] * m.m[1][1] + this.m[0][2] * m.m[2][1] + this.m[0][3] * m.m[3][1];
          r.m[0][2] = this.m[0][0] * m.m[0][2] + this.m[0][1] * m.m[1][2] + this.m[0][2] * m.m[2][2] + this.m[0][3] * m.m[3][2];
          r.m[0][3] = this.m[0][0] * m.m[0][3] + this.m[0][1] * m.m[1][3] + this.m[0][2] * m.m[2][3] + this.m[0][3] * m.m[3][3];
          r.m[1][0] = this.m[1][0] * m.m[0][0] + this.m[1][1] * m.m[1][0] + this.m[1][2] * m.m[2][0] + this.m[1][3] * m.m[3][0];
          r.m[1][1] = this.m[1][0] * m.m[0][1] + this.m[1][1] * m.m[1][1] + this.m[1][2] * m.m[2][1] + this.m[1][3] * m.m[3][1];
          r.m[1][2] = this.m[1][0] * m.m[0][2] + this.m[1][1] * m.m[1][2] + this.m[1][2] * m.m[2][2] + this.m[1][3] * m.m[3][2];
          r.m[1][3] = this.m[1][0] * m.m[0][3] + this.m[1][1] * m.m[1][3] + this.m[1][2] * m.m[2][3] + this.m[1][3] * m.m[3][3];
          r.m[2][0] = this.m[2][0] * m.m[0][0] + this.m[2][1] * m.m[1][0] + this.m[2][2] * m.m[2][0] + this.m[2][3] * m.m[3][0];
          r.m[2][1] = this.m[2][0] * m.m[0][1] + this.m[2][1] * m.m[1][1] + this.m[2][2] * m.m[2][1] + this.m[2][3] * m.m[3][1];
          r.m[2][2] = this.m[2][0] * m.m[0][2] + this.m[2][1] * m.m[1][2] + this.m[2][2] * m.m[2][2] + this.m[2][3] * m.m[3][2];
          r.m[2][3] = this.m[2][0] * m.m[0][3] + this.m[2][1] * m.m[1][3] + this.m[2][2] * m.m[2][3] + this.m[2][3] * m.m[3][3];
          r.m[3][0] = this.m[3][0] * m.m[0][0] + this.m[3][1] * m.m[1][0] + this.m[3][2] * m.m[2][0] + this.m[3][3] * m.m[3][0];
          r.m[3][1] = this.m[3][0] * m.m[0][1] + this.m[3][1] * m.m[1][1] + this.m[3][2] * m.m[2][1] + this.m[3][3] * m.m[3][1];
          r.m[3][2] = this.m[3][0] * m.m[0][2] + this.m[3][1] * m.m[1][2] + this.m[3][2] * m.m[2][2] + this.m[3][3] * m.m[3][2];
          r.m[3][3] = this.m[3][0] * m.m[0][3] + this.m[3][1] * m.m[1][3] + this.m[3][2] * m.m[2][3] + this.m[3][3] * m.m[3][3];
          return r;
      }
      view(loc, at, up1) {
          const dir = at.sub(loc).normalize(), right = dir.cross(up1).normalize(), up = right.cross(dir);
          return new matr4([
              [right.x, up.x, -dir.x, 0],
              [right.y, up.y, -dir.y, 0],
              [right.z, up.z, -dir.z, 0],
              [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1]
          ]);
      }
  }

  class Camera {
      projSize = 0.1;
      projDist = 0.1;
      projFarClip = 18000;
      frameW = 30;
      frameH = 30;
      matrView = new matr4();
      matrProj = new matr4();
      matrVP = new matr4();
      id = Math.random().toString();
      mode = 'floating';
      userDir = new vec3();
      loc = new vec3();
      at = new vec3();
      speed = 0;
      dir = new vec3(-this.matrView.m[0][2], -this.matrView.m[1][2], -this.matrView.m[2][2]);
      up = new vec3(this.matrView.m[0][1], this.matrView.m[1][1], this.matrView.m[2][1]);
      right = new vec3(this.matrView.m[0][0], this.matrView.m[1][0], this.matrView.m[2][0]);
      pos = new vec3();
      userLoc = new vec3();
      camSet(loc, at, up, pos, userLoc) {
          const myMatr4 = new matr4();
          this.matrView = myMatr4.view(loc, at, up);
          this.loc = loc;
          this.at = at;
          this.dir = new vec3(-this.matrView.m[0][2], -this.matrView.m[1][2], -this.matrView.m[2][2]);
          this.up = new vec3(this.matrView.m[0][1], this.matrView.m[1][1], this.matrView.m[2][1]);
          this.right = new vec3(this.matrView.m[0][0], this.matrView.m[1][0], this.matrView.m[2][0]);
          this.pos = pos;
          this.userLoc = userLoc;
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
          if (this.frameW > this.frameH)
              rx *= this.frameW / this.frameH;
          else
              ry *= this.frameH / this.frameW;
          //not sure
          //this.matrProj = myMatr4.frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, projDist, projFarClip)
          this.matrVP = this.matrView.mul(this.matrProj);
          return this;
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
      setSize(frameW, frameH) {
          this.frameW = frameW;
          this.frameH = frameH;
          this.setProj(this.projSize, this.projDist, this.projFarClip);
          return this;
      }
      setDef() {
          this.loc = new vec3(-5, 0, -5);
          this.at = new vec3(0, 0, 0);
          this.up = new vec3(0, 1, 0);
          this.projDist = 0.1;
          this.projSize = 0.1;
          this.projFarClip = 10000;
          this.frameW = 30;
          this.frameH = 30;
          this.camSet(this.loc, this.at, this.up, this.pos, this.userLoc);
          this.setProj(this.projSize, this.projDist, this.projFarClip);
          this.setSize(this.frameW, this.frameH);
          return this;
      }
  }

  const keys = new Map();
  const mouse = {
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
  };
  const cam = new Camera();
  cam.camSet(new vec3(0, 0, -5), new vec3(0, 0, 0), new vec3(0, 1, 0), new vec3(1, 1, 1), new vec3(0, 0.8, 0));
  function handleMouseMove(event) {
      mouse.dx = event.pageX - mouse.x;
      mouse.dy = event.pageY - mouse.y;
      mouse.x = event.pageX;
      mouse.y = event.pageY;
  }
  function handleMouseDown(event) {
      if (event.button == 0)
          mouse.isDown = true;
      else if (event.button == 2)
          mouse.isRDown = true;
  }
  function handleMouseUp(event) {
      // mouse.savedX = event.pageX;
      //mouse.savedY = event.pageY;
      if (event.button == 0)
          mouse.isDown = false;
      else if (event.button == 2)
          mouse.isRDown = false;
  }
  function handleMouseZoom(event) {
      //mouse.dz = event.deltaY - mouse.zoom;
      mouse.dz = event.deltaY;
  }
  function handleKeyUp(event) {
      keys.set(event.code, false);
  }
  function handleKeyDown(event) {
      keys.set(event.code, true);
  }
  const angleSpeed = 0.3;
  let speed = 1;
  const speedUp = 10;
  function floatingCamera() {
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
      mouse.dz = 0;
      /* Mouse x */
      cam.loc = cam.loc.mulMatr(matr4.rotate(+mouse.isDown * angleSpeed * mouse.dx, cam.up.neg())); /* !!Ani->DeltaTime *  */
      /* Mouse y */
      cam.loc = cam.loc.mulMatr(matr4.rotate(+mouse.isDown * angleSpeed * mouse.dy, cam.right.neg())); /* !!Ani->DeltaTime *  */
      /*** Moving free cam ***/
      /* Mouse x */
      cam.at = cam.at.sub(cam.loc);
      cam.at = cam.at.mulMatr(matr4.rotateY(+mouse.isRDown * angleSpeed * mouse.dx));
      cam.at = cam.at.add(cam.loc);
      cam.right = cam.right.mulMatr(matr4.rotateY(+mouse.isRDown * angleSpeed * mouse.dx));
      /* Mouse y */
      /*cam.at =
      PointTransform(cam.at,
        myMatr4.rotateX(!!mouse.isRDown *
                     angleSpeed * mouse.dy));
    */
      cam.at = cam.at.sub(cam.loc);
      cam.at = cam.at.mulMatr(matr4.rotate(+mouse.isRDown * angleSpeed * mouse.dy, cam.right));
      cam.at = cam.at.add(cam.loc);
      speed += keys.get('Shift') ? speedUp : 0;
      /* Arrows */
      cam.loc = cam.loc
          .add(cam.dir.mul(+!!keys.get('KeyW') * +!keys.get('ControlLeft') * speed))
          .sub(cam.dir.mul(+!!keys.get('KeyS') * +!keys.get('ControlLeft') * speed))
          .sub(cam.right.mul(+!!keys.get('KeyA') * +!keys.get('ControlLeft') * speed))
          .add(cam.right.mul(+!!keys.get('KeyD') * +!keys.get('ControlLeft') * speed));
      /* CamAt via arrows */
      cam.at = cam.at
          .add(cam.dir.mul(+!!keys.get('KeyW') * +!keys.get('ControlLeft') * speed))
          .sub(cam.dir.mul(+!!keys.get('KeyS') * +!keys.get('ControlLeft') * speed))
          .sub(cam.right.mul(+!!keys.get('KeyA') * +!keys.get('ControlLeft') * speed))
          .add(cam.right.mul(+!!keys.get('KeyD') * +!keys.get('ControlLeft') * speed));
      speed -= keys.get('Shift') ? speedUp : 0;
      cam.camSet(cam.loc, cam.at, cam.up, cam.pos, cam.userLoc);
  }
  function walking() {
      /* Upscaling */
      cam.pos = cam.pos.add(cam.pos.mul(mouse.dz * 0.001));
      /* Rotating */
      /* Mouse x */
      cam.pos = cam.pos.mulMatr(matr4.rotateY(-mouse.isDown * angleSpeed * mouse.dx)); /* !!Ani->DeltaTime *  */
      /* Mouse y */
      cam.pos = cam.pos.mulMatr(matr4.rotateX(-mouse.isDown * angleSpeed * mouse.dy));
      cam.userDir = cam.pos.neg().normalize();
      cam.userDir.y = 0;
      /* Walking */
      cam.userLoc = cam.userLoc
          .add(cam.userDir.mul(+!!keys.get('KeyW') * +!keys.get('ControlLeft') * speed))
          .add(cam.userDir.mul(-!!keys.get('KeyS') * speed))
          .add(cam.userDir.mulMatr(matr4.rotateY(90)).mul(+!!keys.get('KeyA') * speed))
          .add(cam.userDir.mulMatr(matr4.rotateY(90)).mul(-!!keys.get('KeyD') * speed));
      cam.at = cam.userLoc;
      cam.dir = cam.pos.neg().normalize();
      cam.loc = cam.userLoc.add(cam.pos);
      cam.right = cam.userDir.cross(new vec3(0, 1, 0));
      cam.up = cam.right.cross(cam.dir);
  }
  cam.speed = 0;
  cam.userDir = new vec3(1, 0, 0);
  cam.pos = new vec3(-1, 1, 0);
  const acceleration = 0.01;
  const deceleration = 1.01;
  let rotAngle = 0;
  const maxRotAngle = 45;
  const angleAcceleration = 0.2;
  const angleDeceleration = 1.1;
  function bike() {
      cam.speed += (+!!keys.get('KeyW') - +!!keys.get('KeyS')) * acceleration;
      cam.speed /= deceleration;
      /* Upscaling */
      cam.pos = cam.pos.add(cam.pos.mul(mouse.dz * 0.001));
      rotAngle += (-!!keys.get('KeyD') + +!!keys.get('KeyA')) * angleAcceleration;
      if (rotAngle > maxRotAngle)
          rotAngle = maxRotAngle;
      if (rotAngle < -maxRotAngle)
          rotAngle = -maxRotAngle;
      rotAngle /= angleDeceleration;
      cam.userDir = cam.userDir.mulMatr(matr4.rotateY(rotAngle * Math.sqrt(Math.abs(cam.speed))));
      /* Walking */
      cam.pos = cam.pos.mulMatr(matr4.rotateY(rotAngle * Math.sqrt(Math.abs(cam.speed))));
      cam.userLoc = cam.userLoc.add(cam.userDir.mul(cam.speed));
      /* Rotate around bike: this do not changes driving direction */
      /* Mouse x */
      cam.pos = cam.pos.mulMatr(matr4.rotateY(-mouse.isDown * angleSpeed * mouse.dx)); /* !!Ani->DeltaTime */
      /* Mouse y */
      cam.pos = cam.pos.mulMatr(matr4.rotate(-mouse.isDown * angleSpeed * mouse.dy, cam.right));
      cam.at = cam.userLoc;
      cam.dir = cam.pos.neg().normalize();
      cam.loc = cam.userLoc.add(cam.pos);
      const correctDir = new vec3(cam.dir.x, 0, cam.dir.z);
      cam.right = correctDir.cross(new vec3(0, 1, 0));
      cam.up = cam.right.cross(cam.dir);
  }
  function ControlCamera() {
      if (exports.isMouseOverCanvas) {
          if (cam.mode == 'floating')
              floatingCamera();
          else if (cam.mode == 'walking')
              walking();
          else
              bike();
      }
  }

  const defaultRoot = `{"kind":"Union","shapes":{"dataType":"Map","value":[["122",{"kind":"Sphere","position":{"dataType":"SVec","value":{"x":"0.0","y":"sin(float(time)/1000.0)*3.0","z":"0.0"}},"radius":{"dataType":"S","value":{"s":"1.000"}},"transform":{"position":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"rotation":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"scale":{"dataType":"S","value":{"s":"1.000"}}},"color":{"dataType":"SVec","value":{"x":"0.8","y":"0.8","z":"0.8"}},"id":"122"}],["174",{"kind":"Torus","radius1":{"dataType":"S","value":{"s":"2.000"}},"radius2":{"dataType":"S","value":{"s":"0.300"}},"transform":{"position":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"rotation":{"dataType":"SVec","value":{"x":"0.0","y":"sin(float(time)/2000.0)* 300.0","z":"0.0"}},"scale":{"dataType":"S","value":{"s":"1.000"}}},"color":{"dataType":"SVec","value":{"x":"0.8","y":"0.5","z":"0.3"}},"id":"174"}],["505",{"kind":"Cone","point1":{"dataType":"SVec","value":{"x":"5.0","y":"0.0","z":"5.0"}},"point2":{"dataType":"SVec","value":{"x":"5.0","y":"5.0","z":"5.0"}},"radius1":{"dataType":"S","value":{"s":"1.000"}},"radius2":{"dataType":"S","value":{"s":"0.000"}},"transform":{"position":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"rotation":{"dataType":"SVec","value":{"x":"0.0","y":"float(time)/30.0","z":"0.0"}},"scale":{"dataType":"S","value":{"s":"1.000"}}},"color":{"dataType":"SVec","value":{"x":"0.0","y":"1.0","z":"0.0"}},"id":"505"}],["588",{"kind":"Box","radius":{"dataType":"S","value":{"s":"0.000"}},"sideLengths":{"dataType":"SVec","value":{"x":"1.0","y":"1.0","z":"1.0"}},"transform":{"position":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"rotation":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"scale":{"dataType":"S","value":{"s":"1.000"}}},"color":{"dataType":"SVec","value":{"x":"1.0","y":"0.0","z":"0.0"}},"id":"588"}],["675",{"kind":"Custom","content":"Col(Plane(p, vec3(0.0, 1.0, 0.0), 2.0), sin(p.x) + cos(p.z) > 0.0? vec3(0, 1, 0) : vec3(1,0,0))","transform":{"position":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"rotation":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"scale":{"dataType":"S","value":{"s":"1.000"}}},"id":"675"}]]},"smoothness":{"dataType":"S","value":{"s":"0.700"}},"transform":{"position":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"rotation":{"dataType":"SVec","value":{"x":"0.0","y":"0.0","z":"0.0"}},"scale":{"dataType":"S","value":{"s":"1.000"}}},"id":"0"}`;
  const defaultCamera = `{"projSize":0.1,"projDist":0.1,"projFarClip":18000,"frameW":30,"frameH":30,"matrView":{"m":[[0.7474600338619259,-0.07127575913856472,0.6604720008738825,0],[-0.08123058487064047,0.9769600616880165,0.19735913950998182,0],[-0.6593216892084638,-0.20116859602275922,0.7244488291891498,0],[0.06574129378762672,-2.593100465478565,-8.271127792111793,1]]},"matrProj":{"m":[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]},"matrVP":{"m":[[0.7474600338619259,-0.07127575913856472,0.6604720008738825,0],[-0.08123058487064047,0.9769600616880165,0.19735913950998182,0],[-0.6593216892084638,-0.20116859602275922,0.7244488291891498,0],[0.06574129378762672,-2.593100465478565,-8.271127792111793,1]]},"id":"0.4060923365919058","mode":"floating","userDir":{"dataType":"Vec","value":{"x":1,"y":0,"z":0}},"loc":{"dataType":"Vec","value":{"x":5.228884128459477,"y":4.171078458289965,"z":5.513703125953747}},"at":{"dataType":"Vec","value":{"x":-0.1121112840733236,"y":2.5751073083403186,"z":-0.34464948883461055}},"speed":0,"dir":{"dataType":"Vec","value":{"x":-0.6604720008738825,"y":-0.19735913950998182,"z":-0.7244488291891498}},"up":{"dataType":"Vec","value":{"x":-0.07127575913856472,"y":0.9769600616880165,"z":-0.20116859602275922}},"right":{"dataType":"Vec","value":{"x":0.7474600338619259,"y":-0.08123058487064047,"z":-0.6593216892084638}},"pos":{"dataType":"Vec","value":{"x":-1,"y":1,"z":0}},"userLoc":{"dataType":"Vec","value":{"x":0,"y":0.8,"z":0}}}`;

  class Id {
      static currentId = 0;
      static get new() {
          this.currentId++;
          return (this.currentId - 1).toString();
      }
      static setMax(newId) {
          if (typeof newId == 'number' && !isNaN(newId) && newId >= this.currentId)
              this.currentId = newId + 1;
      }
  }
  function appendTextEditor(name, initial, parent, onchange) {
      const input1 = document.createElement('input');
      input1.type = 'text';
      input1.value = initial.toString();
      input1.placeholder = name;
      input1.id = Id.new;
      input1.onchange = () => {
          onchange(input1.value);
      };
      const label = document.createElement('label');
      label.textContent = name;
      label.htmlFor = input1.id;
      parent.append(label);
      parent.append(input1);
  }
  function appendSVec(name, vector, parent) {
      const inputDiv = document.createElement('div');
      const label = document.createElement('span');
      label.textContent = name;
      inputDiv.append(label);
      appendTextEditor('X', vector.x, inputDiv, (newVal) => {
          vector.x = newVal;
          compileShader();
      });
      appendTextEditor('Y', vector.y, inputDiv, (newVal) => {
          vector.y = newVal;
          compileShader();
      });
      appendTextEditor('Z', vector.z, inputDiv, (newVal) => {
          vector.z = newVal;
          compileShader();
      });
      parent.append(inputDiv);
  }
  function appendShapes(name, shape, parent) {
      const inputDiv = document.createElement('div');
      const shapeAddButton = document.createElement('button');
      shapeAddButton.innerText = 'Add';
      shapeAddButton.className = 'button-add';
      shapeAddButton.onclick = () => {
          addShape(shapeTypes[shapeTypeSelect.selectedIndex], shape);
          compileShader();
      };
      inputDiv.append(shapeAddButton);
      const shapeTypeSelect = document.createElement('select');
      shapeTypes.forEach((shapeType) => {
          const shapeSelectOption = document.createElement('option');
          shapeSelectOption.value = shapeType;
          shapeSelectOption.innerHTML = shapeType;
          shapeTypeSelect.append(shapeSelectOption);
      });
      inputDiv.append(shapeTypeSelect);
      parent.append(inputDiv);
  }
  function appendShapeDiv(shape, parent, onDelete) {
      const shapeDiv = document.createElement('div');
      shapeDiv.className = 'shape';
      shapeDiv.innerText = 'ID: ' + shape.id;
      parent.append(shapeDiv);
      const shapeType = document.createElement('select');
      shapeType.style.margin = '5px';
      isTwo(shape);
      shapeTypes.forEach((type) => {
          const shapeSelectOption = document.createElement('option');
          shapeSelectOption.value = type;
          shapeSelectOption.innerHTML = type;
          shapeType.append(shapeSelectOption);
      });
      shapeType.selectedIndex = shapeTypes.findIndex((el) => {
          return el == shape.kind;
      });
      shapeType.onchange = () => {
          if (isTwo(shape)) {
              shape.kind = shapeTypes[shapeType.selectedIndex];
              compileShader();
          }
          else {
              shapeDiv.remove();
              onDelete(shapeTypes[shapeType.selectedIndex]);
          }
      };
      shapeDiv.append(shapeType);
      if (shape.id != '0') {
          // Main content
          const deleteButton = document.createElement('button');
          deleteButton.className = 'button-delete';
          deleteButton.innerText = 'Delete';
          deleteButton.onclick = () => {
              shapeDiv.remove();
              onDelete();
          };
          shapeDiv.append(deleteButton);
      }
      const content = document.createElement('div');
      const hideButton = document.createElement('button');
      hideButton.className = 'button-hide';
      hideButton.onclick = () => {
          if (content.style.display === 'none') {
              content.style.display = 'block';
              hideButton.innerHTML = 'hide';
          }
          else {
              content.style.display = 'none';
              hideButton.innerHTML = 'show';
          }
      };
      content.style.margin = '0';
      if (isTwo(shape)) {
          hideButton.innerHTML = 'hide';
      }
      else {
          content.style.display = 'none';
          hideButton.innerHTML = 'show';
      }
      shapeDiv.append(hideButton);
      appendTransform(shape.transform, shapeDiv);
      content.id = shape.id;
      const separator = document.createElement('hr');
      content.append(separator);
      shapeDiv.append(content);
      return content;
  }
  function appendTransform(transform, parent) {
      const transformDiv = document.createElement('div');
      const hideButton = document.createElement('button');
      hideButton.innerHTML = 'show transforms';
      hideButton.className = 'button-hide';
      hideButton.onclick = () => {
          if (transformDiv.style.display === 'none') {
              transformDiv.style.display = 'block';
              hideButton.innerHTML = 'hide transforms';
          }
          else {
              transformDiv.style.display = 'none';
              hideButton.innerHTML = 'show transforms';
          }
      };
      parent.append(hideButton);
      appendSVec('position', transform.position, transformDiv);
      appendSVec('rotation', transform.rotation, transformDiv);
      appendTextEditor('scale', transform.scale, transformDiv, (newVal) => {
          transform.scale.s = newVal;
          compileShader();
      });
      transformDiv.style.display = 'none';
      parent.append(transformDiv);
  }

  const defaultTransform = () => ({ position: new svec3(), rotation: new svec3(), scale: new S(1) });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function replacer(key, value) {
      if (value instanceof Map)
          return {
              dataType: 'Map',
              value: Array.from(value.entries())
          };
      if (isSVec(value))
          return {
              dataType: 'SVec',
              value: { x: value.x, y: value.y, z: value.z }
          };
      if (isVec(value))
          return {
              dataType: 'Vec',
              value: { x: value.x, y: value.y, z: value.z }
          };
      if (isS(value))
          return {
              dataType: 'S',
              value: { s: value.s }
          };
      return value;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function reviver(key, value) {
      if (typeof value === 'object' && value !== null && value.dataType === 'Map')
          return new Map(value.value);
      if (typeof value === 'object' && value !== null && value.dataType === 'SVec')
          return new svec3(value.value.x, value.value.y, value.value.z);
      if (typeof value === 'object' && value !== null && value.dataType === 'Vec')
          return new vec3(value.value.x, value.value.y, value.value.z);
      if (typeof value === 'object' && value !== null && value.dataType === 'S')
          return new S(value.value.s);
      Id.setMax(+value.id);
      return value;
  }
  function getRoot() {
      const savedSceneString = window.localStorage.getItem('root');
      if (savedSceneString) {
          return JSON.parse(savedSceneString, reviver);
      }
      return JSON.parse(defaultRoot, reviver); //{ kind: 'Union', shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: Id.new }
  }
  let root = { kind: 'Union', shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: 'shapes' };
  let content = getRoot();
  const savedSceneString = window.localStorage.getItem('camera');
  if (savedSceneString) {
      const camInfo = JSON.parse(savedSceneString, reviver);
      cam.camSet(camInfo.loc, camInfo.at, camInfo.up, cam.pos, cam.userLoc);
  }
  else {
      const camInfo = JSON.parse(defaultCamera, reviver);
      cam.camSet(camInfo.loc, camInfo.at, camInfo.up, cam.pos, cam.userLoc);
  }
  const shapeTypes = [
      'Sphere',
      'Box',
      'Torus',
      'InfCylinder',
      'Cone',
      'Plane',
      'Triangle',
      'Union',
      'Subtraction',
      'Xor',
      'Intersection',
      'Custom'
  ];
  function isTwo(shape) {
      return shape.kind == 'Union' || shape.kind == 'Xor' || shape.kind == 'Intersection' || shape.kind == 'Subtraction';
  }
  function shapeAdd(shape, target) {
      target.shapes.set(shape.id, shape);
      const parentDiv = document.getElementById(target.id);
      const shapeDiv = appendShapeDiv(shape, parentDiv, (newKind) => {
          saveEvent({ kind: 'delete', parent: target, child: shape });
          target.shapes.delete(shape.id);
          if (newKind) {
              addShape(newKind, target);
          }
          compileShader();
      });
      const tShape = shape;
      //for (const [key, value] of Object.entries(shape)) {
      let key;
      for (key in tShape) {
          const capturedKey = key; // needed for lambdas
          switch (typeof tShape[key] // v should be any, but who knows?
          ) {
              case 'number':
                  appendTextEditor(key, tShape[capturedKey], shapeDiv, (newVal) => {
                      tShape[capturedKey] = newVal;
                      compileShader();
                  });
                  break;
              case 'string':
                  if (key == 'content')
                      appendTextEditor(key, tShape[capturedKey], shapeDiv, (newString) => {
                          tShape[capturedKey] = newString;
                          compileShader();
                      });
                  break;
              case 'object':
                  if (isSVec(tShape[key])) {
                      appendSVec(key.toString(), tShape[capturedKey], shapeDiv);
                  }
                  else if (key == 'shapes') {
                      appendShapes(key, shape, shapeDiv);
                  }
                  else if (isS(tShape[key])) {
                      appendTextEditor(key, tShape[capturedKey], shapeDiv, (newVal) => {
                          tShape[capturedKey].s = newVal;
                          compileShader();
                      });
                  }
                  else
                      break;
          }
      }
  }
  function addShape(shapeType, target) {
      let shape;
      // Order of field declaration is very important
      switch (shapeType) {
          case 'Sphere':
              shape = { kind: shapeType, position: new svec3(), radius: new S(1), transform: defaultTransform(), color: new svec3(0.8, 0.8, 0.8), id: Id.new };
              break;
          case 'Box':
              shape = {
                  kind: shapeType,
                  radius: new S(0),
                  sideLengths: new svec3(1, 1, 1),
                  transform: defaultTransform(),
                  color: new svec3(1, 0, 0.0),
                  id: Id.new
              };
              break;
          case 'Torus':
              shape = { kind: shapeType, radius1: new S(1), radius2: new S(0.3), transform: defaultTransform(), color: new svec3(0.8, 0.8, 0.8), id: Id.new };
              break;
          case 'InfCylinder':
              shape = { kind: shapeType, point: new svec3(1, 1, 1), transform: defaultTransform(), color: new svec3(0.8, 0.8, 0.8), id: Id.new };
              break;
          case 'Cone':
              shape = {
                  kind: shapeType,
                  point1: new svec3(),
                  point2: new svec3(),
                  radius1: new S(1),
                  radius2: new S(1),
                  transform: defaultTransform(),
                  color: new svec3(0.8, 0.8, 0.8),
                  id: Id.new
              };
              break;
          case 'Plane':
              shape = {
                  kind: shapeType,
                  normal: new svec3(0, 1, 0),
                  height: new S(0),
                  transform: defaultTransform(),
                  color: new svec3(0.8, 0.8, 0.8),
                  id: Id.new
              };
              break;
          case 'Triangle':
              shape = {
                  kind: shapeType,
                  point1: new svec3('1', '0', '0'),
                  point2: new svec3('1', '0', '0'),
                  point3: new svec3('1', '0', '0'),
                  transform: defaultTransform(),
                  color: new svec3(0.8, 0.8, 0.8),
                  id: Id.new
              };
              break;
          case 'Union':
          case 'Xor':
          case 'Intersection':
          case 'Subtraction':
              shape = { kind: shapeType, shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: Id.new };
              break;
          case 'Custom':
              shape = { kind: shapeType, content: '', transform: defaultTransform(), id: Id.new };
              break;
      }
      shapeAdd(shape, target);
      saveEvent({ kind: 'add', child: shape, parent: target });
  }
  function recursiveShapeAdd(shape, target) {
      shapeAdd(shape, target);
      if (isTwo(shape))
          for (const shp of shape.shapes)
              recursiveShapeAdd(shp[1], shape);
  }
  function shapeDelete(c, p) {
      document.getElementById(c.id)?.parentElement?.remove();
      p.shapes.delete(c.id);
  }
  function generateWorldMapRec(shape = content, parentTransform) {
      if (!shape)
          return null;
      console.log('generated', shape);
      if (shape.kind == 'Custom') {
          if (shape.content === '')
              return null;
          else
              return shape.content;
      }
      let result;
      const transform = shape.transform; // multiply by parent`s one later
      if (!isTwo(shape))
          result =
              /*`
  vec3(
      inverse(
          MatrRotateXYZ(
              D2R(${transform.rotation.x}),
              D2R(${transform.rotation.y}),
              D2R(${transform.rotation.z})) *
          MatrTranslate(${transform.position.str()})
          )
      )*/
              `Col(${shape.kind}(vec3(inverse(MatrRotateTranslate(
                D2R(${transform.rotation.x}),D2R(${transform.rotation.y}),D2R(${transform.rotation.z}),
                ${transform.position.x},${transform.position.y},${transform.position.z}
            )) * vec4(p,0))/${transform.scale.s},
            `;
      else
          result = `${shape.kind}(`;
      let key;
      for (key in shape) {
          let added = true;
          switch (typeof shape[key] // v should be any, but who knows?
          ) {
              case 'number':
                  if (shape.kind != 'Xor')
                      //kostyl
                      result += shape[key].toFixed(1);
                  break;
              case 'object':
                  if (isSVec(shape[key]) && key != 'color') {
                      result += shape[key].str();
                  }
                  else if (key == 'shapes') {
                      const shp = shape;
                      if (shp.shapes.size == 2) {
                          const localResults = [];
                          for (const iShape of shp.shapes) {
                              localResults.push(generateWorldMapRec(iShape[1]));
                          }
                          if (localResults[0] === null)
                              return localResults[1];
                          else if (localResults[1] === null)
                              return localResults[0];
                          else
                              result += localResults; // they are automatically merged with ','
                      }
                      else if (shp.shapes.size == 1) {
                          for (const iShape of shp.shapes)
                              return generateWorldMapRec(iShape[1]);
                          result = result.substring(0, result.length - 1); // remove trailing comma
                      }
                      else if (shp.shapes.size > 2) {
                          // I substitute existing shape with one of kind: {kind:same, shapes: [shapes[0], shapes[1..]] ...}
                          for (const [Key, Val] of shp.shapes) {
                              const copiedMap = new Map(shp.shapes);
                              const shapesMap = new Map();
                              shapesMap.set(Key, Val);
                              copiedMap.delete(Key);
                              let id;
                              shapesMap.set((id = Id.new), {
                                  kind: shp.kind,
                                  transform: shp.transform,
                                  shapes: copiedMap,
                                  smoothness: shp.smoothness,
                                  id: id
                              });
                              return generateWorldMapRec({
                                  kind: shp.kind,
                                  transform: shp.transform,
                                  shapes: shapesMap,
                                  smoothness: shp.smoothness,
                                  id: Id.new
                              });
                          }
                      }
                      else
                          return null;
                  }
                  else if (isS(shape[key])) {
                      result += shape[key].s;
                  }
                  else
                      added = false;
                  break;
              default:
                  added = false;
          }
          if (added)
              result += ',';
      }
      result = result.substring(0, result.length - 1); // remove trailing comma
      result += ')';
      if (!isTwo(shape))
          result += '*' + transform.scale;
      if (!isTwo(shape) && shape.color)
          result += `,${shape.color.str()})`;
      return result;
  }
  function generateWorldMap(shape = content) {
      const worldMap = generateWorldMapRec(shape, defaultTransform());
      if (!worldMap)
          return 'Col(0.0, vec3(0.0))';
      const worldDiv = document.getElementById('world');
      if (worldDiv)
          worldDiv.innerText = worldMap;
      return worldMap;
  }
  function initShapes() {
      recursiveShapeAdd(content, root);
  }
  function saveScene() {
      //alert(JSON.stringify(root, replacer))
      window.localStorage.setItem('root', JSON.stringify(content, replacer)); // first element in root
      window.localStorage.setItem('camera', JSON.stringify(cam, replacer));
  }
  function exportScene() {
      //alert(JSON.stringify(root, replacer))
      console.log('root', JSON.stringify(content, replacer)); // first element in root
      console.log('camera', JSON.stringify(cam, replacer));
  }
  function reload() {
      root = { kind: 'Union', shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: 'shapes' };
      content = JSON.parse(defaultRoot, reviver);
      document.getElementById('shapes').innerText = '';
      recursiveShapeAdd(content, root);
      const camInfo = JSON.parse(defaultCamera, reviver);
      cam.camSet(camInfo.loc, camInfo.at, camInfo.up, cam.pos, cam.userLoc);
      compileShader();
  }

  let gl;
  let programInfo;
  let buffers;
  function loadShader(type, source) {
      const shader = gl.createShader(type);
      if (!shader)
          return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
          gl.deleteShader(shader);
          return null;
      }
      return shader;
  }
  function initShaderProgram(vsSource, fsSource) {
      const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
      if (!vertexShader)
          return null;
      const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
      if (!fragmentShader)
          return null;
      const shaderProgram = gl.createProgram();
      if (!shaderProgram)
          return null;
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
          return null;
      }
      return shaderProgram;
  }
  function initPositionBuffer() {
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      //gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      return positionBuffer;
  }
  function initCameraBuffer() {
      const uniformBuffer = gl.createBuffer();
      const data = new Float32Array([cam.loc.arr4(), cam.dir.arr4(), cam.right.arr4(), cam.up.arr4(), cam.matrView.m.flat()].flat());
      const size = data.byteLength;
      gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
      gl.bufferData(gl.UNIFORM_BUFFER, size, gl.STATIC_DRAW);
      gl.bindBufferRange(gl.UNIFORM_BUFFER, 0, uniformBuffer, 0, size);
      gl.uniformBlockBinding(programInfo.program, gl.getUniformBlockIndex(programInfo.program, 'CameraBlock'), 0);
      gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, data);
      gl.bindBuffer(gl.UNIFORM_BUFFER, null);
      return uniformBuffer;
  }
  function initBuffers() {
      return {
          position: initPositionBuffer(),
          camera: initCameraBuffer()
      };
  }
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  function setPositionAttribute(buffers, programInfo) {
      const numComponents = 2; // pull out 2 values per iteration
      const type = gl.FLOAT; // the data in the buffer is 32bit floats
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set of values to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  async function compileShader(worldMap = generateWorldMap()) {
      const vsResponse = await fetch('./march.vertex.glsl');
      const vsText = await vsResponse.text();
      console.log(vsText);
      const fsResponse = await fetch('./march.fragment.glsl');
      let fsText = await fsResponse.text();
      if (!worldMap)
          worldMap = 'Col(0.0, vec3(0.0))'; //'Sphere(p, vec3(0), 1.)'
      // Replace the constant with the actual data
      fsText = fsText.replace('WORLD_MAP', worldMap);
      console.log(fsText);
      const shaderProgram = initShaderProgram(vsText, fsText);
      if (!shaderProgram)
          return;
      programInfo = {
          program: shaderProgram,
          attribLocations: {
              vertexPosition: gl.getAttribLocation(shaderProgram, 'in_pos')
          },
          uniformLocations: {
              frameW: gl.getUniformLocation(shaderProgram, 'frameW'),
              frameH: gl.getUniformLocation(shaderProgram, 'frameH'),
              time: gl.getUniformLocation(shaderProgram, 'time')
          }
      };
      buffers = initBuffers();
  }
  let canvas;
  async function init() {
      canvas = document.querySelector('#glcanvas');
      if (!canvas) {
          alert('No canvas element!!!');
          return;
      }
      gl = canvas.getContext('webgl2');
      // Only continue if WebGL is available and working
      if (gl === null) {
          alert('Unable to initialize WebGL. Your browser or machine may not support it.');
          return;
      }
      await compileShader();
  }
  function render() {
      gl.clearColor(0.8, 0.47, 0.3, 1.0);
      gl.clearDepth(1.0); // Clear everything
      gl.enable(gl.DEPTH_TEST); // Enable depth testing
      gl.depthFunc(gl.LEQUAL); // Near things obscure far things
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      setPositionAttribute(buffers, programInfo);
      gl.useProgram(programInfo.program);
      gl.bindBuffer(gl.UNIFORM_BUFFER, buffers.camera);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array([cam.loc.arr4(), cam.dir.arr4(), cam.right.arr4(), cam.up.arr4(), cam.matrView.m.flat()].flat()));
      gl.uniform1i(programInfo.uniformLocations.frameW, canvas.width);
      gl.uniform1i(programInfo.uniformLocations.frameH, canvas.height);
      gl.uniform1i(programInfo.uniformLocations.time, Date.now()); // not sure
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      ControlCamera();
      //buffers.camera
      //gl.deleteBuffer(camBuffer)
      window.requestAnimationFrame(render);
  }

  exports.isMouseOverCanvas = false;
  const eventHistory = Array();
  const undoHistory = Array();
  function saveEvent(event) {
      eventHistory.push(event);
      undoHistory.length = 0;
      updateHistory();
  }
  function updateHistory() {
      const historyDiv = document.getElementById('history');
      if (!historyDiv) {
          alert('Missing id=history container');
          return;
      }
      historyDiv.innerHTML = '';
      const allEvents = eventHistory.concat([null], undoHistory);
      let eType = 'history';
      for (const event of allEvents) {
          const eventDiv = document.createElement('div');
          if (event == null) {
              eventDiv.className = 'history-current';
              eventDiv.innerText = '*';
              eType = 'undo';
          }
          else {
              eventDiv.className = eType + '-event';
              eventDiv.innerText = event.kind + ' ' + event.child.kind + event.child.id + ' of ' + event.parent.kind + event.parent.id;
          }
          historyDiv.append(eventDiv);
      }
  }
  function Undo() {
      const lastEvent = eventHistory.pop();
      if (!lastEvent) {
          alert('History empty!');
          return;
      }
      switch (lastEvent.kind) {
          case 'delete':
              shapeAdd(lastEvent.child, lastEvent.parent);
              compileShader();
              break;
          case 'add':
              shapeDelete(lastEvent.child, lastEvent.parent);
              compileShader();
              break;
      }
      undoHistory.push(lastEvent);
      updateHistory();
  }
  function Redo() {
      const lastEvent = undoHistory.pop();
      if (!lastEvent) {
          alert('Undo history empty!');
          return;
      }
      switch (lastEvent.kind) {
          case 'delete':
              shapeDelete(lastEvent.child, lastEvent.parent);
              compileShader();
              break;
          case 'add':
              shapeAdd(lastEvent.child, lastEvent.parent);
              compileShader();
              break;
      }
      eventHistory.push(lastEvent);
      updateHistory();
  }
  async function main() {
      const canvas = document.querySelector('#glcanvas');
      canvas.addEventListener('mouseleave', () => {
          exports.isMouseOverCanvas = false;
      });
      canvas.addEventListener('mouseover', () => {
          exports.isMouseOverCanvas = true;
      });
      const reloadButton = document.getElementById('reload');
      if (reloadButton)
          reloadButton.onclick = reload;
      resize();
      await init();
      initShapes();
      render();
  }
  function resize() {
      const canvas = document.querySelector('#glcanvas');
      if (window.innerWidth < window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight / 2;
      }
      else {
          canvas.width = window.innerWidth / 2;
          canvas.height = window.innerHeight;
      }
  }
  window.addEventListener('load', main);
  window.addEventListener('resize', resize);
  window.onbeforeunload = saveScene;
  window.onmousemove = handleMouseMove;
  window.onmousedown = handleMouseDown;
  window.onmouseup = handleMouseUp;
  window.onscroll = () => {
      if (exports.isMouseOverCanvas)
          window.scroll(0, 0);
  };
  window.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('wheel', handleMouseZoom);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('keydown', handleKeyDown);
  function KeyPress(e) {
      if (e.keyCode == 90 && e.ctrlKey && e.shiftKey)
          Redo();
      else if (e.keyCode == 90 && e.ctrlKey)
          Undo();
      else if (e.key == 'r' && e.ctrlKey)
          cam.setDef();
      else if (e.key == 'e')
          exportScene();
  }
  document.onkeydown = KeyPress;
  const tips = document.getElementById('checkout')?.childNodes;
  if (tips != undefined) {
      for (const tip of tips) {
          if (tip)
              tip.onclick = () => {
                  navigator.clipboard.writeText(tip.innerText);
              };
      }
  }

  exports.main = main;
  exports.saveEvent = saveEvent;

  return exports;

})({});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbXRoLnRzIiwiLi4vY2FtZXJhLnRzIiwiLi4vY29udHJvbHMudHMiLCIuLi9kZWZhdWx0cy50cyIsIi4uL2h0bWwtdXRpbHMudHMiLCIuLi9zaGFwZXMudHMiLCIuLi9hbmltLnRzIiwiLi4vbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF0sIm5hbWVzIjpbImlzTW91c2VPdmVyQ2FudmFzIiwiY29udHJvbHMuaGFuZGxlTW91c2VNb3ZlIiwiY29udHJvbHMuaGFuZGxlTW91c2VEb3duIiwiY29udHJvbHMuaGFuZGxlTW91c2VVcCIsImNvbnRyb2xzLmhhbmRsZU1vdXNlWm9vbSIsImNvbnRyb2xzLmhhbmRsZUtleVVwIiwiY29udHJvbHMuaGFuZGxlS2V5RG93biIsImNvbnRyb2xzLmNhbSJdLCJtYXBwaW5ncyI6Ijs7O1FBQWEsQ0FBQyxDQUFBO0VBQ0YsSUFBQSxFQUFFLENBQVE7TUFDbEIsS0FBSyxHQUFHLEdBQVksQ0FBQTtFQUNwQixJQUFBLFdBQUEsQ0FBWSxJQUFxQixJQUFJLEVBQUE7VUFDakMsSUFBSSxPQUFPLENBQUMsSUFBSSxRQUFRO0VBQUUsWUFBQSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTs7RUFDaEMsWUFBQSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtPQUM5QjtFQUNELElBQUEsSUFBSSxDQUFDLEdBQUE7RUFDRCxRQUFBLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztjQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQTs7Y0FDOUIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDcEM7TUFDRCxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUE7RUFDTixRQUFBLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFBO09BQ2pCO01BQ0QsUUFBUSxHQUFBO1VBQ0osT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFBO09BQ2hCO0VBQ0osQ0FBQTtFQUNLLFNBQVUsR0FBRyxDQUFJLEtBQVEsRUFBQTtFQUMzQixJQUFBLE9BQVEsS0FBc0IsSUFBSyxLQUFzQixDQUFDLEtBQUssSUFBSSxHQUFHLENBQUE7RUFDMUUsQ0FBQztFQUNLLFNBQVUsTUFBTSxDQUFJLEtBQVEsRUFBQTtNQUM5QixPQUFRLEtBQTBCLElBQUssS0FBMEIsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFBO0VBQ3RGLENBQUM7RUFDSyxTQUFVLEtBQUssQ0FBSSxLQUFRLEVBQUE7TUFDN0IsT0FBUSxLQUF5QixJQUFLLEtBQXlCLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQTtFQUNuRixDQUFDO1FBQ1ksS0FBSyxDQUFBO0VBQ04sSUFBQSxFQUFFLENBQVE7RUFDVixJQUFBLEVBQUUsQ0FBUTtFQUNWLElBQUEsRUFBRSxDQUFRO01BQ2xCLEtBQUssR0FBRyxPQUFnQixDQUFBO0VBQ3hCLElBQUEsV0FBQSxDQUFZLElBQXFCLEdBQUcsRUFBRSxJQUFxQixHQUFHLEVBQUUsSUFBcUIsR0FBRyxFQUFBO1VBQ3BGLElBQUksT0FBTyxDQUFDLElBQUksUUFBUTtFQUFFLFlBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7O0VBQzNDLFlBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7VUFFaEIsSUFBSSxPQUFPLENBQUMsSUFBSSxRQUFRO0VBQUUsWUFBQSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTs7RUFDM0MsWUFBQSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtVQUVoQixJQUFJLE9BQU8sQ0FBQyxJQUFJLFFBQVE7RUFBRSxZQUFBLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBOztFQUMzQyxZQUFBLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO09BQ25CO0VBQ0QsSUFBQSxJQUFJLENBQUMsR0FBQTtFQUNELFFBQUEsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2NBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFBOztjQUM5QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNwQztFQUNELElBQUEsSUFBSSxDQUFDLEdBQUE7RUFDRCxRQUFBLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztjQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQTs7Y0FDOUIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDcEM7RUFDRCxJQUFBLElBQUksQ0FBQyxHQUFBO0VBQ0QsUUFBQSxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Y0FBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUE7O2NBQzlCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ3BDO01BQ0QsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFBO0VBQ1IsUUFBQSxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQTtPQUNuQjtNQUNELElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBQTtFQUNSLFFBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUE7T0FDbkI7TUFDRCxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUE7RUFDUixRQUFBLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFBO09BQ25CO0VBQ0QsSUFBQSxHQUFHLEdBQUcsTUFBTSxDQUFBLEtBQUEsRUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFJLENBQUEsRUFBQSxJQUFJLENBQUMsQ0FBQyxDQUFBLENBQUEsRUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUE7TUFDakQsTUFBTSxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUNyRCxDQUFBO1FBQ1ksSUFBSSxDQUFBO0VBQ2IsSUFBQSxDQUFDLENBQVE7RUFDVCxJQUFBLENBQUMsQ0FBUTtFQUNULElBQUEsQ0FBQyxDQUFRO01BQ1QsS0FBSyxHQUFHLE1BQWUsQ0FBQTtNQUN2QixXQUFZLENBQUEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUE7RUFDM0IsUUFBQSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtFQUNWLFFBQUEsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7RUFDVixRQUFBLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO09BQ2I7RUFDRCxJQUFBLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtNQUNwQyxJQUFJLEdBQUcsQ0FBQyxDQUFZLEdBQUEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7RUFDckQsSUFBQSxHQUFHLEdBQUcsTUFBTSxDQUFBLEtBQUEsRUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFJLENBQUEsRUFBQSxJQUFJLENBQUMsQ0FBQyxDQUFBLENBQUEsRUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUE7RUFDakQsSUFBQSxJQUFJLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0VBQzdDLElBQUEsRUFBRSxHQUFHLENBQUMsR0FBUyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFBO0VBQ3pFLElBQUEsR0FBRyxHQUFHLENBQUMsR0FBUyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFDN0UsSUFBQSxHQUFHLEdBQUcsQ0FBQyxHQUFTLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtNQUM3RSxHQUFHLEdBQUcsQ0FBQyxDQUFTLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtFQUNqRSxJQUFBLEdBQUcsR0FBRyxDQUFDLENBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFBO01BQ3pGLEdBQUcsR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFDL0MsSUFBQSxHQUFHLEdBQUcsQ0FBQyxHQUFTLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7TUFDckUsS0FBSyxHQUFHLENBQUMsR0FBUyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7TUFDbEksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUE7RUFDaEUsSUFBQSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0VBQ2xDLElBQUEsU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtFQUN0QyxJQUFBLElBQUksR0FBRyxDQUFDLEdBQVMsRUFBRSxDQUFDLEdBQUcsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7RUFDcEksSUFBQSxPQUFPLENBQUMsQ0FBUSxFQUFBO1VBQ1osTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUVsRixRQUFBLE9BQU8sSUFBSSxJQUFJLENBQ1gsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDOUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFDOUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDakYsQ0FBQTtPQUNKO0VBQ0QsSUFBQSxLQUFLLENBQUMsR0FBUyxFQUFFLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFBO0VBQ25DLFFBQUEsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO0VBQUUsWUFBQSxPQUFPLENBQUMsQ0FBQTtVQUNqRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7RUFDL0QsUUFBQSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7Y0FBRSxLQUFLLEdBQUcs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RyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7Y0FDaEcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2NBQ2hHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUNoRyxZQUFBLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ2YsU0FBQSxDQUFDLENBQUE7T0FDTDtFQUNEOzs7Ozs7Ozs7OztFQVdGO0VBRUUsSUFBQSxTQUFTLENBQUMsR0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFXLEVBQUE7RUFDekgsUUFBQSxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFBO09BQ25IO01BQ0QsTUFBTSxHQUFBO1VBQ0YsUUFDSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNoSixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2tCQUNULElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDaEosQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztrQkFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ2hKLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7a0JBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNuSjtPQUNKO01BQ0QsT0FBTyxHQUFBO0VBQ0gsUUFBQSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7RUFDekIsUUFBQSxNQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFBO1VBRXJCLElBQUksR0FBRyxJQUFJLENBQUM7Y0FBRSxPQUFPLElBQUksS0FBSyxFQUFFLENBQUE7RUFFaEMsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtFQUN2SixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ0wsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0VBQ3ZKLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDTCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7RUFDdkosUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtFQUN2SixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ0wsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0VBQ3ZKLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDTCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7RUFDdkosUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtFQUN2SixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ0wsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0VBQ3ZKLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDTCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7RUFDdkosUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtFQUN2SixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ0wsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0VBQ3ZKLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDTCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7RUFDdkosUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtFQUN2SixRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ0wsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO0VBQ3ZKLFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Y0FDTCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUE7RUFDdkosUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtFQUV2SixRQUFBLE9BQU8sQ0FBQyxDQUFBO09BQ1g7RUFDRCxJQUFBLEdBQUcsQ0FBQyxDQUFRLEVBQUE7RUFDUixRQUFBLE1BQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUE7RUFFckIsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUNySCxRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0VBQ3JILFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFDckgsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUVySCxRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0VBQ3JILFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFDckgsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUNySCxRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0VBRXJILFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFDckgsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUNySCxRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0VBQ3JILFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFFckgsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUNySCxRQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0VBQ3JILFFBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFDckgsUUFBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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LFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtFQUNyRixJQUFBLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0VBQ2hCLElBQUEsT0FBTyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUE7TUFFcEIsTUFBTSxDQUFDLEdBQVMsRUFBRSxFQUFRLEVBQUUsRUFBUSxFQUFFLEdBQVMsRUFBRSxPQUFhLEVBQUE7RUFDMUQsUUFBQSxNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFBO0VBQzNCLFFBQUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7RUFFekMsUUFBQSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtFQUNkLFFBQUEsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUE7VUFFWixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7RUFDM0YsUUFBQSxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENB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QUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7RUFDL0IsQ0FBQztFQUVLLFNBQVUsYUFBYSxDQUFDLEtBQW9CLEVBQUE7TUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0VBQzlCLENBQUM7RUFFRCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUE7RUFDdEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFBO0VBQ2IsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFBO1dBQ0YsY0FBYyxHQUFBO0VBQzFCOzs7Ozs7Ozs7Ozs7O0VBYUY7TUFDRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFBO0VBQ3BELElBQUEsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7O0VBR1osSUFBQSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFVBQVUsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBOztFQUU1RixJQUFBLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7OztFQUsvRixJQUFBLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO01BQzVCLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0VBQzlFLElBQUEsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7TUFFNUIsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7O0VBR3BGOzs7O0VBSUE7RUFDQSxJQUFBLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0VBQzVCLElBQUEsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtFQUV4RixJQUFBLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0VBRTVCLElBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQTs7RUFFeEMsSUFBQSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHO0VBQ1osU0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUN6RSxTQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0VBQ3pFLFNBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7RUFDM0UsU0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFBOztFQUdoRixJQUFBLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUU7RUFDVixTQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0VBQ3pFLFNBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7RUFDekUsU0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUMzRSxTQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUE7RUFFaEYsSUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFBO01BRXhDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7RUFDN0QsQ0FBQztFQUVELFNBQVMsT0FBTyxHQUFBOztNQUVaLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFBOzs7TUFJcEQsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7O01BRS9FLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0VBQy9FLElBQUEsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFBO0VBQ3ZDLElBQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztFQUVqQixJQUFBLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU87RUFDcEIsU0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUM3RSxTQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0VBQ2pELFNBQUEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztFQUM1RSxTQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElB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
