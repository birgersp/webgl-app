class TerrainGridCell {

    constructor(topleft, topright, bottomleft, bottomright) {

        this.topleft = topleft;
        this.topright = topright;
        this.bottomleft = bottomleft;
        this.bottomright = bottomright;

        this.xySlopeTop = (topright[1] - topleft[1]) / (topright[0] - topleft[0]);
        if (!isFinite(this.xySlopeTop))
            this.xySlopeTop = 0;

        this.zySlopeLeft = (topleft[1] - bottomleft[1]) / (topleft[2] - bottomleft[2]);
        if (!isFinite(this.zySlopeLeft))
            this.zySlopeLeft = 0;

        this.xySlopeBottom = (bottomright[1] - bottomleft[1]) / (bottomright[0] - bottomleft[0]);
        if (!isFinite(this.xySlopeBottom))
            this.xySlopeBottom = 0;

        this.zySlopeRight = (topright[1] - bottomright[1]) / (topright[2] - bottomright[2]);
        if (!isFinite(this.zySlopeRight))
            this.zySlopeRight = 0;
    }

    getY(x, z) {

        let dX = x - this.bottomleft[0];
        let dZ = z - this.bottomleft[2];
        let dY = 0;

        if (dX < dZ) {
            dY = dX * this.xySlopeBottom + dZ * this.zySlopeRight;
        } else {
            dY = dX * this.xySlopeTop + dZ * this.zySlopeLeft;
        }
        return this.bottomleft[1] + dY;
    }
}
;
