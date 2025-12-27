export class S {
    private _s: string
    _name = 'S' as const
    constructor(v: string | number = '0.') {
        if (typeof v == 'string') this._s = v
        else this._s = v.toString()
    }
    get s() {
        if (isNaN(+this._s)) return this._s
        else return (+this._s).toFixed(3)
    }
    set s(newS) {
        this._s = newS
    }
    toString() {
        return this.s
    }
}
export function isS<T>(value: T) {
    return (value as unknown as S) && (value as unknown as S)._name == 'S'
}
export function isSVec<T>(value: T) {
    return (value as unknown as svec3) && (value as unknown as svec3)._name == 'svec3' // I have no idea why and how this should work
}
export function isVec<T>(value: T) {
    return (value as unknown as vec3) && (value as unknown as vec3)._name == 'vec3' // I have no idea why and how this should work
}
export class svec3 {
    private _x: string
    private _y: string
    private _z: string
    _name = 'svec3' as const
    constructor(x: number | string = '0', y: number | string = '0', z: number | string = '0') {
        if (typeof x == 'number') this._x = x.toString()
        else this._x = x

        if (typeof y == 'number') this._y = y.toString()
        else this._y = y

        if (typeof z == 'number') this._z = z.toString()
        else this._z = z
    }
    get x() {
        if (isNaN(+this._x)) return this._x
        else return (+this._x).toFixed(1)
    }
    get z() {
        if (isNaN(+this._z)) return this._z
        else return (+this._z).toFixed(1)
    }
    get y() {
        if (isNaN(+this._y)) return this._y
        else return (+this._y).toFixed(1)
    }
    set x(newVal) {
        this._x = newVal
    }
    set y(newVal) {
        this._y = newVal
    }
    set z(newVal) {
        this._z = newVal
    }
    str = () => `vec3(${this.x},${this.y},${this.z})`
    toVec3 = () => new vec3(+this.x, +this.y, +this.z)
}
export class vec3 {
    x: number
    y: number
    z: number
    _name = 'vec3' as const
    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
    arr = () => [this.x, this.y, this.z]
    arr4 = (w: number = 0) => [this.x, this.y, this.z, w]
    str = () => `vec3(${this.x},${this.y},${this.z})`
    copy = () => new vec3(this.x, this.y, this.z)
    eq = (vec: vec3) => this.x == vec.x && this.y == vec.y && this.z == vec.z
    add = (vec: vec3) => new vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z)
    sub = (vec: vec3) => new vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z)
    mul = (n: number) => new vec3(this.x * n, this.y * n, this.z * n)
    div = (n: number) => (n != 0 ? new vec3(this.x / n, this.y / n, this.z / n) : new vec3())
    neg = () => new vec3(-this.x, -this.y, -this.z)
    dot = (vec: vec3) => this.x * vec.x + this.y * vec.y + this.z * vec.z
    cross = (vec: vec3) => new vec3(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x)
    len2 = () => this.x * this.x + this.y * this.y + this.z * this.z
    len = () => Math.sqrt(this.len2())
    normalize = () => this.div(this.len())
    lerp = (vec: vec3, c = 0.5) => new vec3(this.x + (vec.x - this.x) * c, this.y + (vec.y - this.y) * c, this.z + (vec.z - this.z) * c)
    mulMatr(m: matr4) {
        const w = this.x * m.m[0][3] + this.y * m.m[1][3] + this.z * m.m[2][3] + m.m[3][3]

        return new vec3(
            (this.x * m.m[0][0] + this.y * m.m[1][0] + this.z * m.m[2][0] + m.m[3][0]) / w,
            (this.x * m.m[0][1] + this.y * m.m[1][1] + this.z * m.m[2][1] + m.m[3][1]) / w,
            (this.x * m.m[0][2] + this.y * m.m[1][2] + this.z * m.m[2][2] + m.m[3][2]) / w
        )
    }
    angle(vec: vec3, up = new vec3(0, 1, 0)) {
        if (vec.len2() == 0 || this.len2() == 0) return 0
        let angle = Math.acos(this.dot(vec) / (this.len() * vec.len()))
        if (this.cross(vec).dot(up) < 0) angle = -angle
        return angle
    }
    get xxx() {
        return new vec3(this.x, this.x, this.x)
    }
    get yyy() {
        return new vec3(this.y, this.y, this.y)
    }
    get zzz() {
        return new vec3(this.z, this.z, this.z)
    }
    /* ... */
}
export class matr4 {
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
    ]
    constructor(m?: number[][]) {
        if (m) this.m = m
    }
    str3x4 = () =>
        'mat4x3(' +
        this.m
            .map((old) => old.slice(0, -1))
            .flat()
            .join(',') +
        ')'

    static translate(vec: vec3) {
        return new matr4([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [vec.x, vec.y, vec.z, 1]
        ])
    }

    static scale(vec: vec3) {
        return new matr4([
            [vec.x, 0, 0, 0],
            [0, vec.y, 0, 0],
            [0, 0, vec.z, 0],
            [0, 0, 0, 1]
        ])
    }
    static rotateX(angleInDegree: number) {
        const m = new matr4()
        const a = (angleInDegree / 180) * Math.PI
        const sine = Math.sin(a)
        const cosine = Math.cos(a)

        m.m[1][1] = cosine
        m.m[2][2] = cosine
        m.m[1][2] = sine
        m.m[2][1] = -sine
        return m
    }
    static rotateY(angleInDegree: number) {
        const m = new matr4()
        const a = (angleInDegree / 180) * Math.PI
        const sine = Math.sin(a)
        const cosine = Math.cos(a)

        m.m[0][0] = cosine
        m.m[2][2] = cosine
        m.m[0][2] = -sine
        m.m[2][0] = sine

        return m
    }
    static rotateZ(angleInDegree: number) {
        const m = new matr4()
        const a = (angleInDegree / 180) * Math.PI
        const sine = Math.sin(a)
        const cosine = Math.cos(a)

        m.m[0][0] = cosine
        m.m[1][1] = cosine
        m.m[0][1] = sine
        m.m[1][0] = -sine

        return m
    }
    static rotate(angleInDegree: number, v: vec3) {
        const a = (angleInDegree / 180) * Math.PI
        const si = Math.sin(a)
        const co = Math.cos(a)

        return new matr4([
            [co + v.x * v.x * (1 - co), v.x * v.y * (1 - co) + v.z * si, v.x * v.z * (1 - co) - v.y * si, 0],
            [v.y * v.x * (1 - co) - v.z * si, co + v.y * v.y * (1 - co), v.y * v.z * (1 - co) + v.x * si, 0],
            [v.z * v.x * (1 - co) + v.y * si, v.z * v.y * (1 - co) - v.x * si, co + v.z * v.z * (1 - co), 0],
            [0, 0, 0, 1]
        ])
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

    determ3x3(A11: number, A12: number, A13: number, A21: number, A22: number, A23: number, A31: number, A32: number, A33: number) {
        return A11 * A22 * A33 + A12 * A23 * A31 + A13 * A21 * A32 - A11 * A23 * A32 - A12 * A21 * A33 - A13 * A22 * A31
    }
    determ() {
        return (
            +this.m[0][0] *
                this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) +
            -this.m[0][1] *
                this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) +
            +this.m[0][2] *
                this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) +
            -this.m[0][3] *
                this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2])
        )
    }
    inverse() {
        const det = this.determ()
        const r = new matr4()

        if (det == 0) return new matr4()

        r.m[0][0] =
            +this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det
        r.m[1][0] =
            -this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det
        r.m[2][0] =
            +this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det
        r.m[3][0] =
            -this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det
        r.m[0][1] =
            -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[2][1], this.m[2][2], this.m[2][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det
        r.m[1][1] =
            +this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[2][0], this.m[2][2], this.m[2][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det
        r.m[2][1] =
            -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[2][0], this.m[2][1], this.m[2][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det
        r.m[3][1] =
            +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[2][0], this.m[2][1], this.m[2][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det
        r.m[0][2] =
            +this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[1][1], this.m[1][2], this.m[1][3], this.m[3][1], this.m[3][2], this.m[3][3]) / det
        r.m[1][2] =
            -this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[1][0], this.m[1][2], this.m[1][3], this.m[3][0], this.m[3][2], this.m[3][3]) / det
        r.m[2][2] =
            +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[1][0], this.m[1][1], this.m[1][3], this.m[3][0], this.m[3][1], this.m[3][3]) / det
        r.m[3][2] =
            -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[1][0], this.m[1][1], this.m[1][2], this.m[3][0], this.m[3][1], this.m[3][2]) / det
        r.m[0][3] =
            -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3], this.m[1][1], this.m[1][2], this.m[1][3], this.m[2][1], this.m[2][2], this.m[2][3]) / det
        r.m[1][3] =
            +this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3], this.m[1][0], this.m[1][2], this.m[1][3], this.m[2][0], this.m[2][2], this.m[2][3]) / det
        r.m[2][3] =
            -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3], this.m[1][0], this.m[1][1], this.m[1][3], this.m[2][0], this.m[2][1], this.m[2][3]) / det
        r.m[3][3] =
            +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2], this.m[1][0], this.m[1][1], this.m[1][2], this.m[2][0], this.m[2][1], this.m[2][2]) / det

        return r
    }
    mul(m: matr4) {
        const r = new matr4()

        r.m[0][0] = this.m[0][0] * m.m[0][0] + this.m[0][1] * m.m[1][0] + this.m[0][2] * m.m[2][0] + this.m[0][3] * m.m[3][0]
        r.m[0][1] = this.m[0][0] * m.m[0][1] + this.m[0][1] * m.m[1][1] + this.m[0][2] * m.m[2][1] + this.m[0][3] * m.m[3][1]
        r.m[0][2] = this.m[0][0] * m.m[0][2] + this.m[0][1] * m.m[1][2] + this.m[0][2] * m.m[2][2] + this.m[0][3] * m.m[3][2]
        r.m[0][3] = this.m[0][0] * m.m[0][3] + this.m[0][1] * m.m[1][3] + this.m[0][2] * m.m[2][3] + this.m[0][3] * m.m[3][3]

        r.m[1][0] = this.m[1][0] * m.m[0][0] + this.m[1][1] * m.m[1][0] + this.m[1][2] * m.m[2][0] + this.m[1][3] * m.m[3][0]
        r.m[1][1] = this.m[1][0] * m.m[0][1] + this.m[1][1] * m.m[1][1] + this.m[1][2] * m.m[2][1] + this.m[1][3] * m.m[3][1]
        r.m[1][2] = this.m[1][0] * m.m[0][2] + this.m[1][1] * m.m[1][2] + this.m[1][2] * m.m[2][2] + this.m[1][3] * m.m[3][2]
        r.m[1][3] = this.m[1][0] * m.m[0][3] + this.m[1][1] * m.m[1][3] + this.m[1][2] * m.m[2][3] + this.m[1][3] * m.m[3][3]

        r.m[2][0] = this.m[2][0] * m.m[0][0] + this.m[2][1] * m.m[1][0] + this.m[2][2] * m.m[2][0] + this.m[2][3] * m.m[3][0]
        r.m[2][1] = this.m[2][0] * m.m[0][1] + this.m[2][1] * m.m[1][1] + this.m[2][2] * m.m[2][1] + this.m[2][3] * m.m[3][1]
        r.m[2][2] = this.m[2][0] * m.m[0][2] + this.m[2][1] * m.m[1][2] + this.m[2][2] * m.m[2][2] + this.m[2][3] * m.m[3][2]
        r.m[2][3] = this.m[2][0] * m.m[0][3] + this.m[2][1] * m.m[1][3] + this.m[2][2] * m.m[2][3] + this.m[2][3] * m.m[3][3]

        r.m[3][0] = this.m[3][0] * m.m[0][0] + this.m[3][1] * m.m[1][0] + this.m[3][2] * m.m[2][0] + this.m[3][3] * m.m[3][0]
        r.m[3][1] = this.m[3][0] * m.m[0][1] + this.m[3][1] * m.m[1][1] + this.m[3][2] * m.m[2][1] + this.m[3][3] * m.m[3][1]
        r.m[3][2] = this.m[3][0] * m.m[0][2] + this.m[3][1] * m.m[1][2] + this.m[3][2] * m.m[2][2] + this.m[3][3] * m.m[3][2]
        r.m[3][3] = this.m[3][0] * m.m[0][3] + this.m[3][1] * m.m[1][3] + this.m[3][2] * m.m[2][3] + this.m[3][3] * m.m[3][3]

        return r
    }

    view(loc: vec3, at: vec3, up1: vec3) {
        const dir = at.sub(loc).normalize(),
            right = dir.cross(up1).normalize(),
            up = right.cross(dir)

        return new matr4([
            [right.x, up.x, -dir.x, 0],
            [right.y, up.y, -dir.y, 0],
            [right.z, up.z, -dir.z, 0],
            [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1]
        ])
    }
}
