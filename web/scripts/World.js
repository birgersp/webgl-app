include("TerrainManager");

class World extends CoordinateSystem {

    constructor() {

        super(1);
        this.terrainManager = new TerrainManager();
    }

    getTerrainIntersection(origin, dY) {

        return this.terrainManager.getIntersection(origin, dY);
    }

    addTerrainCoordinate(coordinate) {

        this.terrainManager.addCoordinate(coordinate);
    }

    enableTerrainCell(coordinate) {

        this.terrainManager.enableTerrainCell(coordinate);
    }
}
