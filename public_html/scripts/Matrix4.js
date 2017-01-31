
class Matrix4 extends Float32Array {

    /**
     * 
     * @param {Float32Array} vector
     * @returns {Matrix4}
     */
    static translation(vector) {

        var matrix = Matrix4.identity();
        matrix[3] = vector[0];
        matrix[7] = vector[1];
        matrix[11] = vector[2];
        return matrix;
    }

    /**
     * 
     * @param {Float32Array} vector
     * @returns {Matrix4}
     */
    static rotation(vector) {

        var x = vector[0];
        var y = vector[1];
        var z = vector[2];
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

    /**
     * 
     * @returns {Matrix4}
     */
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

    /**
     * 
     * @returns {Matrix4}
     */
    constructor() {

        super(16);
    }

    /**
     * @param {Matrix4} matrix
     */
    multiply(matrix) {

        var a = this;
        var b = matrix;
        this.set([
            a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
            a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
            a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
            a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
            a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
            a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
            a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
            a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
            a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
            a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
            a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
            a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
            a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
        ]);
    }

    /**
     * 
     * @param {Matrix4} matrix
     * @returns {Matrix4}
     */
    times(matrix) {

        var result = new Matrix4();
        result.set(this);
        result.multiply(matrix);
        return result;
    }

    /**
     * 
     * @param {Number} column
     * @param {Number} row
     * @param {Number} value
     * @returns {Matrix4}
     */
    setCell(column, row, value) {
        this[column + row * 4] = value;
        return this;
    }
}

