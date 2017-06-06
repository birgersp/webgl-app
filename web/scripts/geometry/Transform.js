include("Matrix4.js");
include("Vector3.js");

class Transform {

    constructor() {

        this.t = new Vector3();
        this.r = new Vector3();
        this.s = new Vector3(1, 1, 1);
        this.m = Matrix4.identity();
        this.updated = true;
    }

    setTranslation(vector) {

        this.t = vector;
        this.updated = false;
    }

    setRotation(vector) {

        this.r = vector;
        this.updated = false;
    }

    setScale(vector) {

        this.s = vector;
        this.updated = false;
    }

    updateMatrix() {

        var crX = Math.cos(this.r[0]);
        var crY = Math.cos(this.r[1]);
        var crZ = Math.cos(this.r[2]);

        var srX = Math.sin(this.r[0]);
        var srY = Math.sin(this.r[1]);
        var srZ = Math.sin(this.r[2]);

        this.m.set([
            this.s[0] * crY * crZ,
            this.s[0] * (crX * srZ + crZ * srX * srY),
            this.s[0] * (srX * srZ - crX * crZ * srY),
            0,

            -this.s[1] * crY * srZ,
            this.s[1] * (crX * crZ - srX * srY * srZ),
            this.s[1] * (crZ * srX + crX * srY * srZ),
            0,

            this.s[2] * srY,
            -this.s[2] * crY * srX,
            this.s[2] * crX * crY,
            0,

            this.t[0],
            this.t[1],
            this.t[2],
            1
        ]);
        this.updated = true;
    }

    getMatrix() {

        if (!this.updated)
            this.updateMatrix();
        return this.m;
    }
}
