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

    addCollidableFace(collidableFace) {

        this.setCollidableYInterval(collidableFace.bottomleft, collidableFace.bottomright[1], collidableFace);
        this.setCollidableYInterval(collidableFace.bottomleft, collidableFace.topleft[1], collidableFace);
        this.setCollidableYInterval(collidableFace.bottomleft, collidableFace.topright[1], collidableFace);
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
