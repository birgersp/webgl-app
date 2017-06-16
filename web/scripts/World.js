include("Section.js");
include("TerrainManager.js");

class World extends CoordinateSystem {

    constructor() {

        super(World.SECTION_SIZE);
        this.terrainManager = new TerrainManager();
        this.sections = {};
    }

    addSection(x, z) {

        let xIndex = this.getXIndex(x);
        let zIndex = this.getZIndex(z);
        if (!this.sections[xIndex])
            this.sections[xIndex] = {};
        this.sections[xIndex][zIndex] = new Section();
    }

    getSection(x, z) {

        let xIndex = this.getXIndex(x);
        if (this.sections[xIndex])
            return this.sections[this.getXIndex(x)][this.getZIndex(z)];
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

World.SECTION_SIZE = 96;
