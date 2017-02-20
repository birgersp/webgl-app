class Section extends CoordinateSystem {

    constructor() {

        super(Section.TERRAIN_GEOMETRY_SIZE);
        this.terrainGeometries = {};
    }

    getGeometry(x, z) {

        return this.terrainGeometries[this.getXIndex(x)][this.getZIndex(z)];
    }

    setGeometry(x, z, geometry) {

        let xIndex = this.getXIndex(x);
        if (!this.terrainGeometries[xIndex])
            this.terrainGeometries[xIndex] = {};

        let zIndex = this.getZIndex(z);
        this.terrainGeometries[xIndex][zIndex] = geometry;
    }
}

Section.TERRAIN_GEOMETRY_SIZE = 8;
