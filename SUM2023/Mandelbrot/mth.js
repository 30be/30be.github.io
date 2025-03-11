export class vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        return new vec2(this.x + vec.x, this.y + vec.y);
    }
    sub(vec) {
        return new vec2(this.x - vec.x, this.y - vec.y);
    }
    mul(n) {
        return new vec2(this.x * n, this.y * n);
    }
    div(n) {
        return new vec2(this.x / n, this.y / n);
    }
    neg() {
        return new vec2(-this.x, -this.y);
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    cross(vec) {
        return this.x * vec.y - this.y * vec.x;
    }
    len2() {
        return this.x * this.x + this.y * this.y;
    }
    len() {
        return Math.sqrt(this.len2());
    }
    normalize() {
        return this.div(this.len());
    }
    lerp(vec, c) {
        return new vec2(
            this.x + (vec.x - this.x) * c,
            this.y + (vec.y - this.y) * c
        );
    }
}
export class vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vec) {
        return new vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    sub(vec) {
        return new vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }
    mul(n) {
        return new vec3(this.x * n, this.y * n, this.z * n);
    }
    div(n) {
        return n != 0
            ? new vec3(this.x / n, this.y / n, this.z / n)
            : new vec3();
    }
    neg() {
        return new vec3(-this.x, -this.y, -this.z);
    }
    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
    cross(vec) {
        return new vec3(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
        );
    }
    len2() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    len() {
        return Math.sqrt(this.len2());
    }
    normalize() {
        return this.div(this.len());
    }
    lerp(vec, c) {
        return new vec3(
            this.x + (vec.x - this.x) * c,
            this.y + (vec.y - this.y) * c,
            this.z + (vec.z - this.z) * c
        );
    }
    mulMatr(m) {
        let w =
            this.x * m[0][3] + this.y * m[1][3] + this.z * m[2][3] + m[3][3];

        return new vec3(
            (this.x * m[0][0] + this.y * m[1][0] + this.z * m[2][0] + m[3][0]) /
                w,
            (this.x * m[0][1] + this.y * m[1][1] + this.z * m[2][1] + m[3][1]) /
                w,
            (this.x * m[0][2] + this.y * m[1][2] + this.z * m[2][2] + m[3][2]) /
                w
        );
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
    /* ... */
}

export class vec4 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    add(vec) {
        return new vec4(
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z,
            this.w + vec.w
        );
    }
    sub(vec) {
        return new vec4(
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z,
            this.w - vec.w
        );
    }
    mul(n) {
        return new vec4(this.x * n, this.y * n, this.z * n, this.w * n);
    }
    div(n) {
        return new vec4(this.x / n, this.y / n, this.z / n, this.w / n);
    }
    neg() {
        return new vec4(-this.x, -this.y, -this.z, -this.w);
    }
    dot(vec) {
        return (
            this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * this.w
        );
    }
    len2() {
        return (
            this.x * this.x +
            this.y * this.y +
            this.z * this.z +
            this.w * this.w
        );
    }
    len() {
        return Math.sqrt(this.len2());
    }
    normalize() {
        return this.div(this.len());
    }
    lerp(vec, c) {
        return new vec3(
            this.x + (vec.x - this.x) * c,
            this.y + (vec.y - this.y) * c,
            this.z + (vec.z - this.z) * c,
            this.w + (vec.w - this.w) * c
        );
    }
}

export class matr4 {
    constructor(
        m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]
    ) {
        this[0] = [];
        this[1] = [];
        this[2] = [];
        this[3] = [];

        this[0][0] = m[0][0];
        this[0][1] = m[0][1];
        this[0][2] = m[0][2];
        this[0][3] = m[0][3];

        this[1][0] = m[1][0];
        this[1][1] = m[1][1];
        this[1][2] = m[1][2];
        this[1][3] = m[1][3];

        this[2][0] = m[2][0];
        this[2][1] = m[2][1];
        this[2][2] = m[2][2];
        this[2][3] = m[2][3];

        this[3][0] = m[3][0];
        this[3][1] = m[3][1];
        this[3][2] = m[3][2];
        this[3][3] = m[3][3];
    }
    a() {
        return [
            [this[0][0], this[0][1], this[0][2], this[0][3]],
            [this[1][0], this[1][1], this[1][2], this[1][3]],
            [this[2][0], this[2][1], this[2][2], this[2][3]],
            [this[3][0], this[3][1], this[3][2], this[3][3]],
        ];
    }
    translate(vec) {
        return new matr4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [vec.x, vec.y, vec.z, 1],
        ]);
    }

    scale(vec) {
        return new matr4([
            [vec.x, 0, 0, 0],
            [0, vec.y, 0, 0],
            [0, 0, vec.z, 0],
            [0, 0, 0, 1],
        ]);
    }
    rotateX(angleInDegree) {
        let m = new matr4();
        let a = (angleInDegree / 180) * Math.PI;
        let sine = Math.sin(a);
        let cosine = Math.cos(a);

        m[1][1] = cosine;
        m[2][2] = cosine;
        m[1][2] = sine;
        m[2][1] = -sine;
        return m;
    }
    rotateY(angleInDegree) {
        let m = new matr4();
        let a = (angleInDegree / 180) * Math.PI;
        let sine = Math.sin(a);
        let cosine = Math.cos(a);

        m[0][0] = cosine;
        m[2][2] = cosine;
        m[0][2] = -sine;
        m[2][0] = sine;

        return m;
    }
    rotateZ(angleInDegree) {
        let m = new matr4();
        let a = (angleInDegree / 180) * Math.PI;
        let sine = Math.sin(a);
        let cosine = Math.cos(a);

        m[0][0] = cosine;
        m[1][1] = cosine;
        m[0][1] = sine;
        m[1][0] = -sine;

        return m;
    }
    rotate(angleInDegree, v) {
        let a = (angleInDegree / 180) * Math.PI;
        let si = Math.sin(a);
        let co = Math.cos(a);

        return new matr4([
            [
                co + v.x * v.x * (1 - co),
                v.x * v.y * (1 - co) + v.z * si,
                v.x * v.z * (1 - co) - v.y * si,
                0,
            ],
            [
                v.y * v.x * (1 - co) - v.z * si,
                co + v.y * v.y * (1 - co),
                v.y * v.z * (1 - co) + v.x * si,
                0,
            ],
            [
                v.z * v.x * (1 - co) + v.y * si,
                v.z * v.y * (1 - co) - v.x * si,
                co + v.z * v.z * (1 - co),
                0,
            ],
            [0, 0, 0, 1],
        ]);
    }
    transpose() {
        let res = new matr4();

        (res[0][0] = this[0][0]),
            (res[0][1] = this[1][0]),
            (res[0][2] = this[2][0]),
            (res[0][3] = this[3][0]);
        (res[1][0] = this[0][1]),
            (res[1][1] = this[1][1]),
            (res[1][2] = this[2][1]),
            (res[1][3] = this[3][1]);
        (res[2][0] = this[0][2]),
            (res[2][1] = this[1][2]),
            (res[2][2] = this[2][2]),
            (res[2][3] = this[3][2]);
        (res[3][0] = this[0][3]),
            (res[3][1] = this[1][3]),
            (res[3][2] = this[2][3]),
            (res[3][3] = this[3][3]);

        return res;
    }

    determ3x3(A11, A12, A13, A21, A22, A23, A31, A32, A33) {
        return (
            A11 * A22 * A33 +
            A12 * A23 * A31 +
            A13 * A21 * A32 -
            A11 * A23 * A32 -
            A12 * A21 * A33 -
            A13 * A22 * A31
        );
    }
    determ() {
        return (
            +this[0][0] *
                this.determ3x3(
                    this[1][1],
                    this[1][2],
                    this[1][3],
                    this[2][1],
                    this[2][2],
                    this[2][3],
                    this[3][1],
                    this[3][2],
                    this[3][3]
                ) +
            -this[0][1] *
                this.determ3x3(
                    this[1][0],
                    this[1][2],
                    this[1][3],
                    this[2][0],
                    this[2][2],
                    this[2][3],
                    this[3][0],
                    this[3][2],
                    this[3][3]
                ) +
            +this[0][2] *
                this.determ3x3(
                    this[1][0],
                    this[1][1],
                    this[1][3],
                    this[2][0],
                    this[2][1],
                    this[2][3],
                    this[3][0],
                    this[3][1],
                    this[3][3]
                ) +
            -this[0][3] *
                this.determ3x3(
                    this[1][0],
                    this[1][1],
                    this[1][2],
                    this[2][0],
                    this[2][1],
                    this[2][2],
                    this[3][0],
                    this[3][1],
                    this[3][2]
                )
        );
    }
    inverse() {
        let det = this.determ();
        let r = new matr4();

        if (det == 0) return new matr4();

        /* build adjoint matrix */
        r[0][0] =
            +this.determ3x3(
                this[1][1],
                this[1][2],
                this[1][3],
                this[2][1],
                this[2][2],
                this[2][3],
                this[3][1],
                this[3][2],
                this[3][3]
            ) / det;

        r[1][0] =
            -this.determ3x3(
                this[1][0],
                this[1][2],
                this[1][3],
                this[2][0],
                this[2][2],
                this[2][3],
                this[3][0],
                this[3][2],
                this[3][3]
            ) / det;

        r[2][0] =
            +this.determ3x3(
                this[1][0],
                this[1][1],
                this[1][3],
                this[2][0],
                this[2][1],
                this[2][3],
                this[3][0],
                this[3][1],
                this[3][3]
            ) / det;

        r[3][0] =
            -this.determ3x3(
                this[1][0],
                this[1][1],
                this[1][2],
                this[2][0],
                this[2][1],
                this[2][2],
                this[3][0],
                this[3][1],
                this[3][2]
            ) / det;

        r[0][1] =
            -this.determ3x3(
                this[0][1],
                this[0][2],
                this[0][3],
                this[2][1],
                this[2][2],
                this[2][3],
                this[3][1],
                this[3][2],
                this[3][3]
            ) / det;

        r[1][1] =
            +this.determ3x3(
                this[0][0],
                this[0][2],
                this[0][3],
                this[2][0],
                this[2][2],
                this[2][3],
                this[3][0],
                this[3][2],
                this[3][3]
            ) / det;

        r[2][1] =
            -this.determ3x3(
                this[0][0],
                this[0][1],
                this[0][3],
                this[2][0],
                this[2][1],
                this[2][3],
                this[3][0],
                this[3][1],
                this[3][3]
            ) / det;

        r[3][1] =
            +this.determ3x3(
                this[0][0],
                this[0][1],
                this[0][2],
                this[2][0],
                this[2][1],
                this[2][2],
                this[3][0],
                this[3][1],
                this[3][2]
            ) / det;

        r[0][2] =
            +this.determ3x3(
                this[0][1],
                this[0][2],
                this[0][3],
                this[1][1],
                this[1][2],
                this[1][3],
                this[3][1],
                this[3][2],
                this[3][3]
            ) / det;

        r[1][2] =
            -this.determ3x3(
                this[0][0],
                this[0][2],
                this[0][3],
                this[1][0],
                this[1][2],
                this[1][3],
                this[3][0],
                this[3][2],
                this[3][3]
            ) / det;

        r[2][2] =
            +this.determ3x3(
                this[0][0],
                this[0][1],
                this[0][3],
                this[1][0],
                this[1][1],
                this[1][3],
                this[3][0],
                this[3][1],
                this[3][3]
            ) / det;

        r[3][2] =
            -this.determ3x3(
                this[0][0],
                this[0][1],
                this[0][2],
                this[1][0],
                this[1][1],
                this[1][2],
                this[3][0],
                this[3][1],
                this[3][2]
            ) / det;

        r[0][3] =
            -this.determ3x3(
                this[0][1],
                this[0][2],
                this[0][3],
                this[1][1],
                this[1][2],
                this[1][3],
                this[2][1],
                this[2][2],
                this[2][3]
            ) / det;

        r[1][3] =
            +this.determ3x3(
                this[0][0],
                this[0][2],
                this[0][3],
                this[1][0],
                this[1][2],
                this[1][3],
                this[2][0],
                this[2][2],
                this[2][3]
            ) / det;

        r[2][3] =
            -this.determ3x3(
                this[0][0],
                this[0][1],
                this[0][3],
                this[1][0],
                this[1][1],
                this[1][3],
                this[2][0],
                this[2][1],
                this[2][3]
            ) / det;

        r[3][3] =
            +this.determ3x3(
                this[0][0],
                this[0][1],
                this[0][2],
                this[1][0],
                this[1][1],
                this[1][2],
                this[2][0],
                this[2][1],
                this[2][2]
            ) / det;

        return r;
    }
    add(m) {
        let r = new matr4();

        r[0][0] = this[0][0] + m[0][0];
        r[0][1] = this[0][1] + m[0][1];
        r[0][2] = this[0][2] + m[0][2];
        r[0][3] = this[0][3] + m[0][3];
        r[1][0] = this[1][0] + m[1][0];
        r[1][1] = this[1][1] + m[1][1];
        r[1][2] = this[1][2] + m[1][2];
        r[1][3] = this[1][3] + m[1][3];
        r[2][0] = this[2][0] + m[2][0];
        r[2][1] = this[2][1] + m[2][1];
        r[2][2] = this[2][2] + m[2][2];
        r[2][3] = this[2][3] + m[2][3];
        r[3][0] = this[3][0] + m[3][0];
        r[3][1] = this[3][1] + m[3][1];
        r[3][2] = this[3][2] + m[3][2];
        r[3][3] = this[3][3] + m[3][3];
        return r;
    }
    mul(m) {
        let r = new matr4();

        r[0][0] =
            this[0][0] * m[0][0] +
            this[0][1] * m[1][0] +
            this[0][2] * m[2][0] +
            this[0][3] * m[3][0];
        r[0][1] =
            this[0][0] * m[0][1] +
            this[0][1] * m[1][1] +
            this[0][2] * m[2][1] +
            this[0][3] * m[3][1];
        r[0][2] =
            this[0][0] * m[0][2] +
            this[0][1] * m[1][2] +
            this[0][2] * m[2][2] +
            this[0][3] * m[3][2];
        r[0][3] =
            this[0][0] * m[0][3] +
            this[0][1] * m[1][3] +
            this[0][2] * m[2][3] +
            this[0][3] * m[3][3];

        r[1][0] =
            this[1][0] * m[0][0] +
            this[1][1] * m[1][0] +
            this[1][2] * m[2][0] +
            this[1][3] * m[3][0];
        r[1][1] =
            this[1][0] * m[0][1] +
            this[1][1] * m[1][1] +
            this[1][2] * m[2][1] +
            this[1][3] * m[3][1];
        r[1][2] =
            this[1][0] * m[0][2] +
            this[1][1] * m[1][2] +
            this[1][2] * m[2][2] +
            this[1][3] * m[3][2];
        r[1][3] =
            this[1][0] * m[0][3] +
            this[1][1] * m[1][3] +
            this[1][2] * m[2][3] +
            this[1][3] * m[3][3];

        r[2][0] =
            this[2][0] * m[0][0] +
            this[2][1] * m[1][0] +
            this[2][2] * m[2][0] +
            this[2][3] * m[3][0];
        r[2][1] =
            this[2][0] * m[0][1] +
            this[2][1] * m[1][1] +
            this[2][2] * m[2][1] +
            this[2][3] * m[3][1];
        r[2][2] =
            this[2][0] * m[0][2] +
            this[2][1] * m[1][2] +
            this[2][2] * m[2][2] +
            this[2][3] * m[3][2];
        r[2][3] =
            this[2][0] * m[0][3] +
            this[2][1] * m[1][3] +
            this[2][2] * m[2][3] +
            this[2][3] * m[3][3];

        r[3][0] =
            this[3][0] * m[0][0] +
            this[3][1] * m[1][0] +
            this[3][2] * m[2][0] +
            this[3][3] * m[3][0];
        r[3][1] =
            this[3][0] * m[0][1] +
            this[3][1] * m[1][1] +
            this[3][2] * m[2][1] +
            this[3][3] * m[3][1];
        r[3][2] =
            this[3][0] * m[0][2] +
            this[3][1] * m[1][2] +
            this[3][2] * m[2][2] +
            this[3][3] * m[3][2];
        r[3][3] =
            this[3][0] * m[0][3] +
            this[3][1] * m[1][3] +
            this[3][2] * m[2][3] +
            this[3][3] * m[3][3];

        return r;
    }
    view(loc, at, up1) {
        let dir = at.sub(loc).normalize(),
            right = dir.cross(up1).normalize(),
            up = right.cross(dir);

        return new matr4([
            [right.x, up.x, -dir.x, 0],
            [right.y, up.y, -dir.y, 0],
            [right.z, up.z, -dir.z, 0],
            [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1],
        ]);
    }
    ortho(left, right, bottom, top, near, far) {
        return new matr4([
            [2 / (right - left), 0, 0, 0],
            [0, 2 / (top - bottom), 0, 0],
            [0, 0, -2 / (far - near), 0],
            [
                -(right + left) / (right - left),
                -(top + bottom) / (top - bottom),
                -(far + near) / (far - near),
                1,
            ],
        ]);
    }
    frustum(left, right, bottom, top, near, far) {
        return new matr4([
            [(2 * near) / (right - left), 0, 0, 0],
            [0, (2 * near) / (top - bottom), 0, 0],
            [
                (right + left) / (right - left),
                (top + bottom) / (top - bottom),
                -(far + near) / (far - near),
                -1,
            ],
            [0, 0, -(2 * near * far) / (far - near), 0],
        ]);
    }
    /*
lerp( MATR M1, MATR M2, DBL C )
{
  return MatrSet(
    LERP(M1[0][0], M2[0][0], C), LERP(M1[0][1], M2[0][1], C), LERP(M1[0][2], M2[0][2], C), LERP(M1[0][3], M2[0][3], C), 
    LERP(M1[1][0], M2[1][0], C), LERP(M1[1][1], M2[1][1], C), LERP(M1[1][2], M2[1][2], C), LERP(M1[1][3], M2[1][3], C), 
    LERP(M1[2][0], M2[2][0], C), LERP(M1[2][1], M2[2][1], C), LERP(M1[2][2], M2[2][2], C), LERP(M1[2][3], M2[2][3], C), 
    LERP(M1[3][0], M2[3][0], C), LERP(M1[3][1], M2[3][1], C), LERP(M1[3][2], M2[3][2], C), LERP(M1[3][3], M2[3][3], C) 
  );
}
*/
}
