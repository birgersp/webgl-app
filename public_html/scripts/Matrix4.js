
class Matrix4 extends Float32Array {

    static xyzRotation(x, y, z) {

        var c = Math.cos;
        var s = Math.sin;
        var matrix = new Matrix4();
        matrix.set([
            c(y) * c(z), c(z) * s(x) * s(y) - c(x) * s(z), s(x) * s(z) + c(x) * c(z) * s(y), 0,
            c(y) * s(z), c(x) * c(z) + s(x) * s(y) * s(z), c(x) * s(y) * s(z) - c(z) * s(x), 0,
            -s(y), c(y) * s(x), c(x) * c(y), 0,
            0, 0, 0, 1
        ]);
        return matrix;
    }

    static identity() {

        var matrix = new Matrix4();
        matrix.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        return matrix;
    }

    constructor() {

        super(16);
    }
}

