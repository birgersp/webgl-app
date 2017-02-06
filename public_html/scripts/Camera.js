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
        this.m = new Matrix4();

        this.setNear(0.1);
        this.setFar(100);
        this.setAspectRatio(1);
        this.setFieldOfView(Math.PI / 3);
        this.updateMatrix();
    }
    
    updateMatrix() {
        
        this.m = new Matrix4();
        this.m.setCell(0, 0, this.sX); // X-scale goes here
        this.m.setCell(1, 1, this.sY); // Y-scale goes here
        this.m.setCell(2, 2, -this.f / (this.fl));
        this.m.setCell(2, 3, -1);
        this.m.setCell(3, 2, -2 * this.f * this.n / (this.fl));
    }

    getViewProjectionMatrix() {

        return this.m;
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
