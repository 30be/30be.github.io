import { vec2, vec3 /*vec4, matr4 */ } from "../utils/mth.js";
import { isPause } from "../utils/controls.js";
import { markerDraw } from "../utils/markers.js";

export function getPointSpherePenetrationPoints(point, c, r) {
  if (point.sub(c).len2() > r * r) return null;
  return c.add(point.sub(c).mul(r / point.sub(c).len()));
}

export function getPointCirclePenetrationPoints(point, c, r) {
  if (
    new vec2(point.X, point.Z).sub(new vec2(c.X, c.Z)).len2() > r * r ||
    point.Y > c.Y ||
    point.Y < c.Y - 1
  )
    return null;

  return new vec3(point.X, c.Y, point.Z);
}

let deltaTime = 10;

export class cloth {
  constructor() {
    this.w = 0;
    this.h = 0;
    this.size = 0.1;
    this.numOfConstraints = 0;
    this.constraints = [];
    this.p = [];
    this.oldP = [];
    this.forces = [];
    this.wind = new vec3(0, 0, 0);
    this.weight = 0;
    this.friction = 0;
    this.stiffness = 0;
    this.handleCollisions = null;
    this.handleHardConstraints = null;
    this.numIterations = 1;
  }

  createDefault(
    width = 10,
    height = 10,
    weight = 0.01,
    size = 1,
    friction = 0.99,
    stiffness = 0.99
  ) {
    this.w = width;
    this.h = height;
    this.weight = weight;
    this.friction = friction;
    this.stiffness = stiffness;
    this.size = size;
    // cloth constraints
    let p = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x < width - 1) {
          this.constraints[p] = {
            particleA: y * width + x,
            particleB: y * width + (x + 1),
            restLength: size,
            damper: 0,
            stretch: new vec3(),
          };
          p++;
        }
        if (y < height - 1) {
          this.constraints[p] = {
            particleA: y * width + x,
            particleB: (y + 1) * width + x,
            restLength: size,
            damper: 0,
            stretch: new vec3(),
          };
          p++;
        }
      }
    }
    this.numOfConstraints = p;

    // cloth particle positions
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pos = new vec3(x * size, 0, y * size);
        this.p[y * width + x] = pos;
        this.oldP[y * width + x] = pos.copy();
      }
    }
  }

  accumulateForces() {
    for (let i = 0; i < this.w * this.h; i++) {
      this.forces[i] = this.wind.add(new vec3(0, -this.weight, 0));
    }
  }

  verletStep() {
    for (let i = 0; i < this.w * this.h; i++) {
      const oldPos = this.p[i].copy();
      const newPos = this.p[i]
        .add(this.p[i].sub(this.oldP[i]).mul(this.friction))
        .add(this.forces[i].mul(deltaTime));
      this.p[i] = newPos.copy();
      this.oldP[i] = oldPos.copy();
    }
  }

  satisfyConstraints() {
    for (let iteration = 0; iteration < this.numIterations; iteration++) {
      if (this.handleCollisions !== null) {
        this.handleCollisions(this);
      }

      for (let i = 0; i < this.numOfConstraints; i++) {
        const constraint = this.constraints[i];
        let delta = this.p[constraint.particleB].sub(
          this.p[constraint.particleA]
        );
        delta = delta.mul(
          (this.stiffness * constraint.restLength) /
            (delta.len() + constraint.restLength) -
            0.5
        );

        this.p[constraint.particleA] = this.p[constraint.particleA].sub(delta);

        this.p[constraint.particleB] = this.p[constraint.particleB].add(delta);
      }
    }

    if (this.handleHardConstraints !== null) {
      this.handleHardConstraints(this);
    }
  }

  update(speed = 1) {
    if (!isPause) {
      this.accumulateForces();
      this.verletStep();
      for (let i = 0; i < speed; i++) {
        this.satisfyConstraints();
      }
    }
  }

  draw() {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        markerDraw(
          this.p[this.constraints[y * this.w + x].particleA],
          this.p[this.constraints[y * this.w + x].particleB],
          this.size / 3
        );
      }
    }

    for (let y = 0; y < this.h - 1; y++) {
      for (let x = 0; x < this.w; x++) {
        const constraint =
          this.constraints[this.h * (this.w - 1) + y * this.w + x];
        /*const stretch = constraint.stretch;
               const color = new vec4(
          1 - stretch[0] * 80,
          1 - stretch[1] * 80,
          1 - stretch[2] * 80,
          1
        );
*/
        markerDraw(
          this.p[constraint.particleA],
          this.p[constraint.particleB],
          this.size / 3
        );
      }
    }
  }
}
