class TerrainManager {

    constructor() {

        this.collidables = {};
    }

    setCollidableYInterval(origin, endY, collidable) {

        let vector = origin.getCopy();
        for (let y = origin[1]; y < endY; y += 1) {
            this.setCollidable(vector, collidable);
            vector[1] = y;
        }
        vector[1] = endY;
        this.setCollidable(vector, collidable);
    }

    getCollidableOnYInterval(origin, endY) {

        let collidable;
        let vector = origin.getCopy();
        for (let y = origin[1]; !collidable && y < endY; y += 1) {
            collidable = this.getCollidable(vector);
            vector[1] = y;
        }

        if (!collidable) {
            vector[1] = endY;
            collidable = this.getCollidable(vector);
        }
        return collidable;
    }

    getTerrainIntersectionY(origin, dY) {

        let collidable;
        let vector = origin.getCopy();
        let endY = origin[1] + dY;

        while (!collidable && vector[1] < endY) {
            collidable = this.getCollidable(vector);
            vector[1]++;
        }

        if (!collidable) {
            vector[1] = endY;
            collidable = this.getCollidable(vector);
        }

        if (collidable) {
            let intersectionY = collidable.getY(origin[0], origin[2]);
            if (intersectionY >= origin[1] && intersectionY <= endY)
                return intersectionY;
        }

        return null;
    }

    addGridCell(gridCell) {

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
        this.setCollidableYInterval(origin, yMax, gridCell);
    }

    setCollidable(coordinate, collidable, overwrite) {

        let xIndex = Math.floor(coordinate[0]);
        if (!this.collidables[xIndex])
            this.collidables[xIndex] = {};

        let yIndex = Math.floor(coordinate[1]);
        if (!this.collidables[xIndex][yIndex])
            this.collidables[xIndex][yIndex] = {};

        let zIndex = Math.floor(coordinate[2]);
        if (!this.collidables[xIndex][yIndex][zIndex] || overwrite)
            this.collidables[xIndex][yIndex][zIndex] = collidable;
    }

    getCollidable(coordinate) {

        let xIndex = Math.floor(coordinate[0]);
        if (this.collidables[xIndex]) {
            let yIndex = Math.floor(coordinate[1]);
            if (this.collidables[xIndex][yIndex]) {
                let zIndex = Math.floor(coordinate[2]);
                return this.collidables[xIndex][yIndex][zIndex];
            }
        }
        return null;
    }
}
