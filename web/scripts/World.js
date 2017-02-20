class World extends CoordinateSystem {

    constructor() {

        super(1);
        this.terrainCells = {};
        this.terrainHeights = {};
    }

    setTerrainCellYInterval(origin, endY, collidable) {

        let vector = origin.getCopy();
        for (let y = origin[1]; y < endY; y += 1) {
            this.setTerrainCell(vector, collidable);
            vector[1] = y;
        }
        vector[1] = endY;
        this.setTerrainCell(vector, collidable);
    }

    getTerrainCellYInterval(origin, endY) {

        let cell;
        let vector = origin.getCopy();
        for (let y = origin[1]; !cell && y < endY; y += 1) {
            cell = this.getTerrainCell(vector);
            vector[1] = y;
        }

        if (!cell) {
            vector[1] = endY;
            cell = this.getTerrainCell(vector);
        }
        return cell;
    }

    getTerrainCellIntersectionYInterval(origin, dY) {

        let cell;
        let vector = origin.getCopy();
        let endY = origin[1] + dY;

        while (!cell && vector[1] < endY) {
            cell = this.getTerrainCell(vector);
            vector[1]++;
        }

        if (!cell) {
            vector[1] = endY;
            cell = this.getTerrainCell(vector);
        }

        if (cell) {
            let intersectionY = cell.getY(origin[0], origin[2]);
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
        this.setTerrainCellYInterval(origin, yMax, gridCell);
    }

    addTerrainHeight(coordinate) {

        let xIndex = this.getXIndex(coordinate[0]);
        if (!this.terrainHeights[xIndex])
            this.terrainHeights[xIndex] = {};

        let zIndex = this.getZIndex(coordinate[2]);
        this.terrainHeights[xIndex][zIndex] = coordinate[1];
    }

    setTerrainCell(coordinate, cell) {

        let xIndex = this.getXIndex(coordinate[0]);
        if (!this.terrainCells[xIndex])
            this.terrainCells[xIndex] = {};

        let zIndex = this.getZIndex(coordinate[2]);
        if (!this.terrainCells[xIndex][zIndex])
            this.terrainCells[xIndex][zIndex] = {};

        let yIndex = this.getYIndex(coordinate[1]);
        if (!this.terrainCells[xIndex][zIndex][yIndex])
            this.terrainCells[xIndex][zIndex][yIndex] = cell;
    }

    getTerrainCell(coordinate) {

        let xIndex = this.getXIndex(coordinate[0]);
        if (this.terrainCells[xIndex]) {
            let zIndex = this.getZIndex(coordinate[2]);
            if (this.terrainCells[xIndex][zIndex]) {
                let yIndex = this.getYIndex(coordinate[1]);
                return this.terrainCells[xIndex][zIndex][yIndex];
            }
        }
        return null;
    }
}
