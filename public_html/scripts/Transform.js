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

        this.m.set([
            this.s[0] * Math.cos(this.r[1]) * Math.cos(this.r[2]),
            -this.s[1] * Math.cos(this.r[1]) * Math.sin(this.r[2]),
            this.s[2] * Math.sin(this.r[1]),
            this.t[0],

            this.s[0] * (Math.cos(this.r[0]) * Math.sin(this.r[2]) + Math.cos(this.r[2]) * Math.sin(this.r[0]) * Math.sin(this.r[1])),
            this.s[1] * (Math.cos(this.r[0]) * Math.cos(this.r[2]) - Math.sin(this.r[0]) * Math.sin(this.r[1]) * Math.sin(this.r[2])),
            -this.s[2] * Math.cos(this.r[1]) * Math.sin(this.r[0]),
            this.t[1],

            this.s[0] * (Math.sin(this.r[0]) * Math.sin(this.r[2]) - Math.cos(this.r[0]) * Math.cos(this.r[2]) * Math.sin(this.r[1])),
            this.s[1] * (Math.cos(this.r[2]) * Math.sin(this.r[0]) + Math.cos(this.r[0]) * Math.sin(this.r[1]) * Math.sin(this.r[2])),
            this.s[2] * Math.cos(this.r[0]) * Math.cos(this.r[1]),
            this.t[2],

            0,
            0,
            0,
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
