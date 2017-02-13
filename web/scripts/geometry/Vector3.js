class Vector3 extends Float32Array {

    static getCrossProduct(u, v) {

        return new Vector3(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]);
    }

    static getDotProduct(u, v) {

        return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    }

    constructor(x, y, z) {

        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        z = z !== undefined ? z : 0;
        super([x, y, z]);
    }

    applyMatrix(matrix) {

        var result = [
            matrix[0] * this[0] + matrix[4] * this[1] + matrix[8] * this[2] + matrix[12],
            matrix[1] * this[0] + matrix[5] * this[1] + matrix[9] * this[2] + matrix[13],
            matrix[2] * this[0] + matrix[6] * this[1] + matrix[10] * this[2] + matrix[14]
        ];
        this.set(result);
        return this;
    }

    scale(factor) {

        this[0] *= factor;
        this[1] *= factor;
        this[2] *= factor;
        return this;
    }

    times(factor) {

        let result = new Vector3(this[0], this[1], this[2]);
        result.scale(factor);
        return result;
    }

    add(vector) {

        this.set([this[0] + vector[0], this[1] + vector[1], this[2] + vector[2]]);
        return this;
    }

    subtract(vector) {

        this.set([this[0] - vector[0], this[1] - vector[1], this[2] - vector[2]]);
        return this;
    }

    plus(vector) {

        var result = new Vector3();
        result.add(this);
        result.add(vector);
        return result;
    }

    minus(vector) {

        var subtraction = new Vector3();
        subtraction.set(vector);
        subtraction.scale(-1);
        return this.plus(subtraction);
    }

    normalize() {

        let magnitude = this.getMagnitude();
        if (magnitude > 0)
            this.scale(1 / magnitude);
        return this;
    }

    getMagnitude() {

        return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
    }

    getCopy() {

        return new Vector3(this[0], this[1], this[2]);
    }
}
