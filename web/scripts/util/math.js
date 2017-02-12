include("../geometry/Vector3");

function getNormalVector(u, v, w) {

    let uv = v.minus(u);
    let uw = w.minus(u);
    let n = Vector3.getCrossProduct(uv, uw);
    return n;
}

function getVectorPlaneIntersection(origin, vector, planePoint, planeNormal) {

    let n = planeNormal;
    let a = planePoint;
    let o = origin;
    let d = vector;
    return (n[0] * (a[0] - o[0]) + n[1] * (a[1] - o[1]) + n[2] * (a[0] - o[2])) / (n[0] * d[0] + n[1] * d[1] + n[2] * d[2]);
}
