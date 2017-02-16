class TerrainGridCell {

    constructor(topleft, topright, bottomleft, bottomright) {

        this.topleft = topleft;
        this.topright = topright;
        this.bottomleft = bottomleft;
        this.bottomright = bottomright;
    }

    getY(x, z) {

        let dX = x - this.bottomleft[0];
        let dZ = z - this.bottomleft[2];

        let y = 0;
        if (dZ - dX > 0) {
            y = this.bottomleft[1] - dX * this.topleft[1] + dX * this.topright[1] - this.bottomleft[1] * dZ + this.topleft[1] * dZ;
        } else {
            y = this.bottomleft[1] - dX * this.bottomleft[1] + dX * this.bottomright[1] - this.bottomright[1] * dZ + this.topright[1] * dZ;
        }
        return y;
    }
}
