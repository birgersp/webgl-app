class CoordinateSystem {

    constructor(scale) {

        this.scale = scale;
    }

    getLocalX(x) {

        return x - this.getXIndex(x) * this.scale;
    }

    getLocalY(y) {

        return y - this.getYIndex(y) * this.scale;
    }

    getLocalZ(z) {

        return z - this.getZIndex(z) * this.scale;
    }

    getXIndex(x) {

        return Math.floor(x / this.scale);
    }

    getYIndex(y) {

        return Math.floor(y / this.scale);
    }

    getZIndex(z) {

        return Math.ceil(z / this.scale);
    }
}