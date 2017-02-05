class Vector3 extends Float32Array {

    constructor(x, y, z) {

        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        z = z !== undefined ? z : 0;
        super([x, y, z]);
    }

    applyMatrix(matrix) {

        var result = [
            matrix[0] * this[0] + matrix[1] * this[1] + matrix[2] * this[2] + matrix[3],
            matrix[4] * this[0] + matrix[5] * this[1] + matrix[6] * this[2] + matrix[7],
            matrix[8] * this[0] + matrix[9] * this[1] + matrix[10] * this[2] + matrix[11]
        ];
        this.set(result);
    }
}
