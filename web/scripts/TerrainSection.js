class TerrainSection extends CoordinateSystem {

    constructor() {

        super(TerrainSection.GEOMETRY_SIZE);
        this.geometries = {};
    }

    getGeometry(x, z) {

        return this.geometries[this.getXIndex(x)][this.getZIndex(z)];
    }

    setGeometry(x, z, geometry) {

        let xIndex = this.getXIndex(x);
        if (!this.geometries[xIndex])
            this.geometries[xIndex] = {};

        let zIndex = this.getZIndex(z);
        this.geometries[xIndex][zIndex] = geometry;
    }
}

TerrainSection.GEOMETRY_SIZE = 8;
