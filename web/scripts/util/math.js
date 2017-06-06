include("../geometry/Vector3.js");
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

function getRayTriangleIntersection(v0, v1, v2, o, d) {

    //Edge1, Edge2
    let e1, e2;
    let P, Q, T;
    let det, inv_det, u, v;
    let t;

    //Find vectors for two edges sharing V1
    e1 = v1.minus(v0);
    e2 = v2.minus(v0);

    //Begin calculating determinant - also used to calculate u parameter
    P = Vector3.getCrossProduct(d, e2);

    //if determinant is near zero, ray lies in plane of triangle or ray is parallel to plane of triangle
    det = Vector3.getDotProduct(e1, P);

    //NOT CULLING
    if (det > -0.000001 && det < 0.000001)
        return null;
    inv_det = 1 / det;

    //calculate distance from V1 to ray origin
    T = o.minus(v0);

    //Calculate u parameter and test bound
    u = Vector3.getDotProduct(T, P) * inv_det;

    //The intersection lies outside of the triangle
    if (u < 0 || u > 1)
        return null;

    //Prepare to test v parameter
    Q = Vector3.getCrossProduct(T, e1);

    //Calculate V parameter and test bound
    v = Vector3.getDotProduct(d, Q) * inv_det;

    //The intersection lies outside of the triangle
    if (v < 0 || u + v > 1)
        return null;

    t = Vector3.getDotProduct(e2, Q) * inv_det;
    if (t > 0.000001)
        return t;
    else
        return null;
}
