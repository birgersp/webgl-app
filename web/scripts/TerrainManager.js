class TerrainManager extends CoordinateSystem {

    constructor() {

        super(1);
        this.terrainCellIndices = {};
        this.terrainHeights = {};
    }

    getIntersection(origin, dY) {

        let xI = this.getXIndex(origin[0]);
        let yI = this.getYIndex(origin[1]);
        let zI = this.getZIndex(origin[2]);

        let isTerrainCell = this.isTerrainCell(xI, yI, zI);
        let endY = this.getYIndex(origin[1] + dY);

        while (yI < endY && !isTerrainCell) {
            isTerrainCell = this.isTerrainCell(xI, yI, zI);
            if (!isTerrainCell)
                yI++;
        }

        if (!isTerrainCell) {
            yI = endY;
            isTerrainCell = this.isTerrainCell(xI, yI, zI);
        }

        if (isTerrainCell) {

            let tlY = this.terrainHeights[xI][zI - 1];
            let trY = this.terrainHeights[xI + 1][zI - 1];
            let blY = this.terrainHeights[xI][zI];
            let brY = this.terrainHeights[xI + 1][zI];

            let dX = origin[0] - xI;
            let dZ = zI - origin[2];

            let y;
            if (dZ - dX > 0)
                y = blY - dZ * blY - dX * tlY + dX * trY + dZ * tlY;
            else
                y = blY - dX * blY + dX * brY - dZ * brY + dZ * trY;

            if (y >= origin[1] && y <= origin[1] + dY)
                return y;
        }

        return null;
    }

    addCoordinate(coordinate) {

        let xIndex = this.getXIndex(coordinate[0]);
        if (!this.terrainHeights[xIndex])
            this.terrainHeights[xIndex] = {};

        let zIndex = this.getZIndex(coordinate[2]);
        this.terrainHeights[xIndex][zIndex] = coordinate[1];
    }

    setAllTerrainCells(coordinate, value) {

        let xI = this.getXIndex(coordinate[0]);
        let zI = this.getZIndex(coordinate[2]);

        let tlY = this.terrainHeights[xI][zI - 1];
        let trY = this.terrainHeights[xI + 1][zI - 1];
        let blY = this.terrainHeights[xI][zI];
        let brY = this.terrainHeights[xI + 1][zI];

        let minY = this.getYIndex(Math.min(tlY, trY, blY, brY));
        let maxY = this.getYIndex(Math.max(tlY, trY, blY, brY));

        let yI;
        for (yI = minY; yI < maxY; yI++)
            this.terrainCellIndices[xI][zI][yI] = value;
        yI = maxY;
        this.terrainCellIndices[xI][zI][yI] = value;
    }

    enableTerrainCell(coordinate) {

        let xI = this.getXIndex(coordinate[0]);
        if (!this.terrainCellIndices[xI])
            this.terrainCellIndices[xI] = {};

        let zI = this.getZIndex(coordinate[2]);
        this.terrainCellIndices[xI][zI] = {};

        this.setAllTerrainCells(coordinate, true);
    }

    disableTerrainCell(coordinate) {

        this.setAllTerrainCells(coordinate, false);
    }

    isTerrainCell(xIndex, yIndex, zIndex) {

        if (this.terrainCellIndices[xIndex])
            if (this.terrainCellIndices[xIndex][zIndex])
                return this.terrainCellIndices[xIndex][zIndex][yIndex];
        return false;
    }
}
