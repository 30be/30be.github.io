import { vec3 } from "./mth.js";

export function calculateNormals(pos, inds = null) {
    let pts = [];
    let k = 0;
    if (inds == null) inds = [...Array(pos.length / 3).keys()];
    for (let i = 0; i < pos.length; i += 3) {
        pts[k++] = new vec3(pos[i], pos[i + 1], pos[i + 2]);
    }
    let normals = [];
    for (let i = 0; i < pts.length; i++) normals[i] = new vec3();

    for (let i = 0; i < inds.length; i += 3) {
        {
            let p0 = pts[inds[i]],
                p1 = pts[inds[i + 1]],
                p2 = pts[inds[i + 2]];
            let n = p1.sub(p0).cross(p2.sub(p0)).normalize();

            normals[inds[i]] = normals[inds[i]].add(n);
            normals[inds[i + 1]] = normals[inds[i + 1]].add(n);
            normals[inds[i + 2]] = normals[inds[i + 2]].add(n);
        }
    }

    for (let i = 0; i < pts.length; i++) {
        normals[i] = normals[i].normalize();
    }

    k = 0;
    let res = [];
    for (let i = 0; i < normals.length; i++) {
        res[k++] = normals[i].x;
        res[k++] = normals[i].y;
        res[k++] = normals[i].z;
    }
    return res;
}
