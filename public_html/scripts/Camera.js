class Camera {

    constructor(fieldOfView) {

        this.n = 0.1;
        this.f = 1000;
        this.scale = 0;
        this.setFieldOfView(Math.PI / 3);
    }

    /**
     * 
     * @returns {Float32Array}
     */
    getProjectionMatrix() {
        
        var matrix = new Matrix4();
        matrix.setCell(0, 0, this.scale); // X-scale goes here
        matrix.setCell(1, 1, this.scale); // Y-scale goes here
        matrix.setCell(2, 2, -this.f / (this.f - this.n));
        matrix.setCell(2, 3, -1);
        matrix.setCell(3, 2, -2 * this.f * this.n / (this.f - this.n));
        return matrix;
    }

    setFieldOfView(angle) {

        this.scale = 1 / Math.tan(angle / 2);
    }
}
