class World extends CoordinateSystem {

    constructor() {

        super(1);
        this.blocks = {};
    }

    setBlockYInterval(origin, endY, collidable) {

        let vector = origin.getCopy();
        for (let y = origin[1]; y < endY; y += 1) {
            this.setBlock(vector, collidable);
            vector[1] = y;
        }
        vector[1] = endY;
        this.setBlock(vector, collidable);
    }

    getBlockYInterval(origin, endY) {

        let collidable;
        let vector = origin.getCopy();
        for (let y = origin[1]; !collidable && y < endY; y += 1) {
            collidable = this.getBlock(vector);
            vector[1] = y;
        }

        if (!collidable) {
            vector[1] = endY;
            collidable = this.getBlock(vector);
        }
        return collidable;
    }

    getBlockIntersectionYInterval(origin, dY) {

        let collidable;
        let vector = origin.getCopy();
        let endY = origin[1] + dY;

        while (!collidable && vector[1] < endY) {
            collidable = this.getBlock(vector);
            vector[1]++;
        }

        if (!collidable) {
            vector[1] = endY;
            collidable = this.getBlock(vector);
        }

        if (collidable) {
            let intersectionY = collidable.getY(origin[0], origin[2]);
            if (intersectionY >= origin[1] && intersectionY <= endY)
                return intersectionY;
        }

        return null;
    }

    addTerrainCell(gridCell) {

        let yMin = gridCell.bottomleft[1];
        yMin = gridCell.topleft[1] < yMin ? gridCell.topleft[1] : yMin;
        yMin = gridCell.topright[1] < yMin ? gridCell.topright[1] : yMin;
        yMin = gridCell.bottomright[1] < yMin ? gridCell.bottomright[1] : yMin;

        let yMax = gridCell.bottomleft[1];
        yMax = gridCell.topleft[1] > yMax ? gridCell.topleft[1] : yMax;
        yMax = gridCell.topright[1] > yMax ? gridCell.topright[1] : yMax;
        yMax = gridCell.bottomright[1] > yMax ? gridCell.bottomright[1] : yMax;

        let origin = gridCell.bottomleft.getCopy();
        origin[1] = yMin;
        this.setBlockYInterval(origin, yMax, gridCell);
    }

    setBlock(coordinate, collidable) {

        let xIndex = this.getXIndex(coordinate[0]);
        if (!this.blocks[xIndex])
            this.blocks[xIndex] = {};

        let yIndex = this.getYIndex(coordinate[1]);
        if (!this.blocks[xIndex][yIndex])
            this.blocks[xIndex][yIndex] = {};

        let zIndex = this.getZIndex(coordinate[2]);
        if (!this.blocks[xIndex][yIndex][zIndex])
            this.blocks[xIndex][yIndex][zIndex] = collidable;
    }

    getBlock(coordinate) {

        let xIndex = this.getXIndex(coordinate[0]);
        if (this.blocks[xIndex]) {
            let yIndex = this.getYIndex(coordinate[1]);
            if (this.blocks[xIndex][yIndex]) {
                let zIndex = this.getZIndex(coordinate[2]);
                return this.blocks[xIndex][yIndex][zIndex];
            }
        }
        return null;
    }
}
