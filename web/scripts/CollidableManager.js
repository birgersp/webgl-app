class CollidableManager { 

    constructor() {

        this.blocks = {};
    }

    setCollidableYInterval(origin, endY, collidable) {

        let vector = origin.getCopy();
        for (let y = origin[1]; y < endY; y += 1) {
            setCollidable(vector, collidable);
            vector[1] = y;
        }
        vector[1] = endY;
        setCollidable(vector, collidable);
    }

    getCollidabeYInterval(origin, endY) {

        let collidables = [];
        let vector = origin.getCopy();
        for (let y = origin[1]; y < endY; y += 1) {
            collidables.push(getCollidable(vector));
            vector[1] = y;
        }
        vector[1] = endY;
        let lastCollidable = getCollidable(vector);
        if (collidables.indexOf(lastCollidable) === -1)
            collidables.push(lastCollidable);
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
