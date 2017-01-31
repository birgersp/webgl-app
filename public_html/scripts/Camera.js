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

        var s = this.scale;
        var n = this.n;
        var f = this.f;

        var matrix = new Matrix4();
        matrix.setCell(0, 0, s);
        matrix.setCell(1, 1, s);
        matrix.setCell(2, 2, -f / (f - n));
        matrix.setCell(3, 2, -1);
        matrix.setCell(2, 3, -f * n / (f - n));

        return matrix;
    }

    setFieldOfView(angle) {

        this.scale = 1 / Math.tan(angle / 2);
    }
}
