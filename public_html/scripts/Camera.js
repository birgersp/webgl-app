include("Matrix4");
include("Vector3");

class Camera {

    constructor() {

        this.n = 0;
        this.f = 0;
        this.fl = 0;
        this.ar = 0;
        this.fov = 0;
        this.sX = 0;
        this.sY = 0;
        this.r = new Vector3();
        this.t = new Vector3();

        this.setNear(0.1);
        this.setFar(100);
        this.setAspectRatio(1);
        this.setFieldOfView(Math.PI / 3);
    }

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

        this.sX = 1 / Math.tan(this.fov / 2);
        this.sY = this.sX * this.ar;
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
        this.fl = this.f - this.n;
    }

    setFar(value) {

        this.f = value;
        this.fl = this.f - this.n;
    }
}
