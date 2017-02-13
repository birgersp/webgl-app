class TerrainGridCell {

    constructor(topleft, topright, bottomleft, bottomright) {

        this.topleft = topleft;
        this.topright = topright;
        this.bottomleft = bottomleft;
        this.bottomright = bottomright;

        this.tlXYSlope = (topright[1] - topleft[1]) / (topright[0] - topleft[0]);
        if (isNaN(this.tlXYSlope))
            this.tlXYSlope = 0;

        this.tlZYSlope = (bottomleft[1] - topleft[1]) / (bottomleft[2] - topleft[2]);
        if (isNaN(this.tlZYSlope))
            this.tlZYSlope = 0;

        this.blXYSlope = (bottomright[1] - bottomleft[1]) / (bottomright[0] - bottomleft[0]);
        if (isNaN(this.blXYSlope))
            this.blXYSlope = 0;

        this.blZYSlope = (topright[1] - bottomright[1]) / (topright[0] - bottomright[0]);
        if (isNaN(this.blZYSlope))
            this.blZYSlope = 0;
    }

    getY(x, z) {

        let dX = x - this.bottomleft[0];
        let dZ = z - this.bottomleft[2];
        let dY = 0;

        if (dX < dZ) {
            dY = dX * blXYSlope + dZ * blZYSlope;
        } else {
            dY = dX * tlXYSlope + dZ * tlZYSlope;
        }
        return bottomleft[1] + dY;
    }
};
