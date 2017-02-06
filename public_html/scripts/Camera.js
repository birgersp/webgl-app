include("Matrix4");
include("Vector3");

class Camera {

    constructor() {

        this.n = 0;
        this.f = 0;
        this.frustumLength = 0;
        this.ar = 0;
        this.fov = 0;
        this.scaleX = 0;
        this.scaleY = 0;

        this.setNear(0.1);
        this.setFar(1000);
        this.setAspectRatio(1);
        this.setFieldOfView(Math.PI / 3);
    }

    /**
     * 
     * @returns {Float32Array}
     */
    getViewProjectionMatrix() {

        var matrix = new Matrix4();
        matrix.setCell(0, 0, this.scaleX); // X-scale goes here
        matrix.setCell(1, 1, this.scaleY); // Y-scale goes here
        matrix.setCell(2, 2, -this.f / (this.frustumLength));
        matrix.setCell(2, 3, -1);
        matrix.setCell(3, 2, -2 * this.f * this.n / (this.frustumLength));
        return matrix;
    }

    updateScales() {

        this.scaleX = 1 / Math.tan(this.fov / 2);
        this.scaleY = this.scaleX * this.ar;
    }

    setFieldOfView(angle) {

        this.fov = angle;
        this.updateScales();
    }

    setAspectRatio(ratio) {

        this.ar = ratio;
        this.updateScales();
    }

    setNear(value) {

        this.n = value;
        this.frustumLength = this.f - this.n;
    }

    setFar(value) {

        this.f = value;
        this.frustumLength = this.f - this.n;
    }
}
