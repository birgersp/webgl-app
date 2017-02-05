class Camera {

    constructor(fieldOfView) {

        this.n = 0.01;
        this.f = 100;
        this.scale = 0;
        this.setFieldOfView(Math.PI / 3);
    }

    /**
     * 
     * @returns {Float32Array}
     */
    getProjectionMatrix() {

        var matrix = new Matrix4();
        matrix.setCell(0, 0, this.s);
        matrix.setCell(1, 1, this.s);
        matrix.setCell(2, 2, -this.f / (this.f - this.n));
        matrix.setCell(3, 2, -1);
        matrix.setCell(2, 3, -this.f * this.n / (this.f - this.n));

        return matrix;
    }

    setFieldOfView(angle) {

        this.scale = 1 / Math.tan(angle / 2);
    }
}
