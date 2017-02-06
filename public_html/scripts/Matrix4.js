
class Matrix4 extends Float32Array {

    /**
     * 
     * @returns {Matrix4}
     */
    static identity() {

        var matrix = new Matrix4();
        matrix.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
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
     * 
     * @param {Number} column
     * @param {Number} row
     * @param {Number} value
     * @returns {Matrix4}
     */
    setCell(column, row, value) {
        this[row + column * 4] = value;
        return this;
    }

    multiply(matrix) {

        this.set([
            this[0] * matrix[0] + this[4] * matrix[1] + this[8] * matrix[2] + this[12] * matrix[3],
            this[1] * matrix[0] + this[5] * matrix[1] + this[9] * matrix[2] + this[13] * matrix[3],
            this[2] * matrix[0] + this[6] * matrix[1] + this[10] * matrix[2] + this[14] * matrix[3],
            this[3] * matrix[0] + this[7] * matrix[1] + this[11] * matrix[2] + this[15] * matrix[3],

            this[0] * matrix[4] + this[4] * matrix[5] + this[8] * matrix[6] + this[12] * matrix[7],
            this[1] * matrix[4] + this[5] * matrix[5] + this[9] * matrix[6] + this[13] * matrix[7],
            this[2] * matrix[4] + this[6] * matrix[5] + this[10] * matrix[6] + this[14] * matrix[7],
            this[3] * matrix[4] + this[7] * matrix[5] + this[11] * matrix[6] + this[15] * matrix[7],

            this[0] * matrix[8] + this[4] * matrix[9] + this[8] * matrix[10] + this[12] * matrix[11],
            this[1] * matrix[8] + this[5] * matrix[9] + this[9] * matrix[10] + this[13] * matrix[11],
            this[2] * matrix[8] + this[6] * matrix[9] + this[10] * matrix[10] + this[14] * matrix[11],
            this[3] * matrix[8] + this[7] * matrix[9] + this[11] * matrix[10] + this[15] * matrix[11],

            this[0] * matrix[12] + this[4] * matrix[13] + this[8] * matrix[14] + this[12] * matrix[15],
            this[1] * matrix[12] + this[5] * matrix[13] + this[9] * matrix[14] + this[13] * matrix[15],
            this[2] * matrix[12] + this[6] * matrix[13] + this[10] * matrix[14] + this[14] * matrix[15],
            this[3] * matrix[12] + this[7] * matrix[13] + this[11] * matrix[14] + this[15] * matrix[15]
        ]);
    }
}
