
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
}
