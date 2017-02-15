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
        this.m = new Matrix4();
        this.updated = false;

        this.setNear(0.1);
        this.setFar(100);
        this.setAspectRatio(16 / 9);
        this.setFieldOfView(Math.PI / 2);
        this.updateViewMatrix();
        this.updateProjectionMatrix();
        this.updateMatrix();

    }

    updateMatrix() {

        var crX = Math.cos(this.r[0]);
        var crY = Math.cos(this.r[1]);
        var crZ = Math.cos(this.r[2]);

        var srX = Math.sin(this.r[0]);
        var srY = Math.sin(this.r[1]);
        var srZ = Math.sin(this.r[2]);

        this.m.set([
            this.sX * crY * crZ,
            -this.sY * (crX * srZ - crZ * srX * srY),
            -(this.f * (srX * srZ + crX * crZ * srY)) / this.fl,
            -srX * srZ - crX * crZ * srY,

            this.sX * crY * srZ,
            this.sY * (crX * crZ + srX * srY * srZ),
            (this.f * (crZ * srX - crX * srY * srZ)) / this.fl,
            crZ * srX - crX * srY * srZ,

            -this.sX * srY,
            this.sY * crY * srX,
            -(this.f * crX * crY) / this.fl,
            -crX * crY,

            this.sX * this.t[2] * srY - this.sX * this.t[1] * crY * srZ - this.sX * this.t[0] * crY * crZ,
            this.sY * this.t[0] * (crX * srZ - crZ * srX * srY) - this.sY * this.t[1] * (crX * crZ + srX * srY * srZ) - this.sY * this.t[2] * crY * srX,
            (this.f * this.t[0] * (srX * srZ + crX * crZ * srY)) / this.fl - (2 * this.f * this.n) / this.fl - (this.f * this.t[1] * (crZ * srX - crX * srY * srZ)) / this.fl + (this.f * this.t[2] * crX * crY) / this.fl,
            this.t[0] * (srX * srZ + crX * crZ * srY) - this.t[1] * (crZ * srX - crX * srY * srZ) + this.t[2] * crX * crY
        ]);

        this.updated = true;
    }

    getViewProjectionMatrix() {

        if (!this.updated) {
            this.updateMatrix();
        }
        return this.m;
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
        this.setNotUpdated();
    }

    setNotUpdated() {

        this.updated = false;
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
        this.setNotUpdated();
    }

    setFar(value) {

        this.f = value;
        this.fl = this.f - this.n;
        this.setNotUpdated();
    }

    setRotation(vector) {
        this.r = vector;
        this.setNotUpdated();
    }

    setTranslation(vector) {
        this.t = vector;
        this.setNotUpdated();
    }

    move(vector) {

        this.t.add(vector);
        this.setNotUpdated();
    }
}
