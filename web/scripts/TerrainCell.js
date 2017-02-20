class TerrainCell {

    constructor(topleft, topright, bottomleft, bottomright) {

        this.topleft = topleft;
        this.topright = topright;
        this.bottomleft = bottomleft;
        this.bottomright = bottomright;
    }

    getY(x, z) {

        let dX = x - this.bottomleft[0];
        let dZ = this.bottomleft[2] - z;

        let y = 0;
        if (dZ - dX > 0) {
            y = this.bottomleft[1] - dZ * this.bottomleft[1] - dX * this.topleft[1] + dX * this.topright[1] + dZ * this.topleft[1];
        } else {
            y = this.bottomleft[1] - dX * this.bottomleft[1] + dX * this.bottomright[1] - dZ * this.bottomright[1] + dZ * this.topright[1];
        }
        return y;
    }
}
