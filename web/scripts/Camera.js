include("geometry/Matrix4");
include("geometry/Vector3");

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
        this.pM = new Matrix4();
        this.vM = new Matrix4();
        this.pMUpdated = false;
        this.vMUpdated = false;
        this.setNear(0.1);
        this.setFar(100);
        this.setAspectRatio(16 / 9);
        this.setFieldOfView(Math.PI / 2);
        this.updateViewMatrix();
        this.updateProjectionMatrix();

    }

    updateViewMatrix() {

        var crX = Math.cos(this.r[0]);
        var crY = Math.cos(this.r[1]);
        var crZ = Math.cos(this.r[2]);

        var srX = Math.sin(this.r[0]);
        var srY = Math.sin(this.r[1]);
        var srZ = Math.sin(this.r[2]);

        this.vM.set([
            crY * crZ,
            crZ * srX * srY - crX * srZ,
            srX * srZ + crX * crZ * srY,
            0,

            crY * srZ,
            crX * crZ + srX * srY * srZ,
            crX * srY * srZ - crZ * srX,
            0,

            -srY,
            crY * srX,
            crX * crY,
            0,

            this.t[2] * srY - this.t[0] * crY * crZ - this.t[1] * crY * srZ,
            this.t[0] * (crX * srZ - crZ * srX * srY) - this.t[1] * (crX * crZ + srX * srY * srZ) - this.t[2] * crY * srX,
            this.t[1] * (crZ * srX - crX * srY * srZ) - this.t[0] * (srX * srZ + crX * crZ * srY) - this.t[2] * crX * crY,
            1
        ]);
        this.vMUpdated = true;
    }

    getViewMatrix() {

        if (!this.vMUpdated)
            this.updateViewMatrix();
        return this.vM;
    }

    updateProjectionMatrix() {

        this.pM.set([
            this.sX,
            0,
            0,
            0,

            0,
            this.sY,
            0,
            0,

            0,
            0,
            -this.f / this.fl,
            -1,

            0,
            0,
            -(2 * this.f * this.n) / this.fl,
            0
        ]);
        this.pMUpdated = true;
    }

    getProjectionMatrix() {

        if (!this.pMUpdated)
            this.updateProjectionMatrix();
        return this.pM;
    }

    updateScales() {

        this.sX = 1 / Math.tan(this.fov / 2);
        this.sY = this.sX * this.ar;
        this.pMUpdated = false;
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
        this.pMUpdated = false;
    }

    setFar(value) {

        this.f = value;
        this.fl = this.f - this.n;
        this.pMUpdated = false;
    }

    setRotation(vector) {
        this.r = vector;
        this.vMUpdated = false;
    }

    setTranslation(vector) {
        this.t = vector;
        this.vMUpdated = false;
    }

    move(vector) {

        this.t.add(vector);
        this.vMUpdated = false;
    }
}
