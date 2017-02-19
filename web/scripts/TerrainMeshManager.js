class TerrainMeshManager {

    constructor(world, renderer) {

        this.world = world;
        this.renderer = renderer;
        this.geometries = {};
        this.coordinateHeights = {};
    }

    addTerrainCoordinate(coordinate) {

        let xIndex = coordinate[0];
        if (!this.coordinateHeights[xIndex])
            this.coordinateHeights[xIndex] = {};

        let zIndex = coordinate[2];
        this.coordinateHeights[xIndex][zIndex] = coordinate[1];
    }

    getGeometryXIndex(x) {

        return Math.floor(x / TerrainMeshManager.GEOMETRIES_SIZE);
    }

    getGeometryZIndex(z) {

        return Math.ceil(z / TerrainMeshManager.GEOMETRIES_SIZE);
    }

    updateSectionGeometry(geometry) {

        this.renderer.setTerrainIndices(geometry.indices);
    }

    removeTerrainCoordinate(x, z) {

        let sectionXIndex = this.getGeometryXIndex(x);
        let sectionZIndex = this.getGeometryZIndex(z);

        let xIndex = Math.floor(x - sectionXIndex * TerrainMeshManager.GEOMETRIES_SIZE);
        let zIndex = Math.floor(sectionZIndex * TerrainMeshManager.GEOMETRIES_SIZE - z);
        let indexIndex = (zIndex * TerrainMeshManager.GEOMETRIES_SIZE + xIndex) * 6;

        let indices = this.geometries[sectionXIndex][sectionZIndex].indices;
        indices.splice(indexIndex, 6);
        this.renderer.setTerrainIndices(indices);
    }

    initializeTerrainSection(targetX, targetZ) {

        let verticesPerGeometry = TerrainMeshManager.GEOMETRIES_SIZE + 1;
        let uvScale = TerrainMeshManager.UV_SCALE;

        let endX = targetX + TerrainMeshManager.SECTION_SIZE;
        let endZ = targetZ - TerrainMeshManager.SECTION_SIZE;

        for (let z = targetZ; z > endZ; z -= TerrainMeshManager.GEOMETRIES_SIZE) {
            for (let x = targetX; x < endX; x += TerrainMeshManager.GEOMETRIES_SIZE) {

                let vertices = [];
                let indices = [];

                for (let j = 0; j <= TerrainMeshManager.GEOMETRIES_SIZE; j++) {
                    let z2 = z - j;
                    for (let i = 0; i <= TerrainMeshManager.GEOMETRIES_SIZE; i++) {
                        let x2 = x + i;
                        let coord = new Vector3(x2, this.coordinateHeights[x2][z2], z2);
                        let left = new Vector3(x2 - 1, this.coordinateHeights[x2 - 1][z2], z2);
                        let rightHeight = this.coordinateHeights[x2 + 1][z2];
                        let bottom = new Vector3(x2, this.coordinateHeights[x2][z2 + 1], z2 + 1);
                        let bottomleft = new Vector3(x2 - 1, this.coordinateHeights[x2 - 1][z2 + 1], z2 + 1);
                        let topHeight = this.coordinateHeights[x2][z2 - 1];

                        if (i > 0 && j > 0) {

                            this.world.addTerrainCell(new TerrainGridCell(left, coord, bottomleft, bottom));

                            let b = j * verticesPerGeometry + i;
                            let a = b - 1;
                            let d = b - verticesPerGeometry;
                            let c = d - 1;

                            indices = indices.concat([a, c, b, b, c, d]);
                        }

                        let n = new Vector3(left[1] - rightHeight, 2, bottom[1] - topHeight).normalize();
                        vertices = vertices.concat([coord[0], coord[1], coord[2], n[0], n[1], n[2], i * uvScale, j * uvScale]);
                    }
                }

                let xIndex = this.getGeometryXIndex(x);
                if (!this.geometries[xIndex])
                    this.geometries[xIndex] = {};

                let zIndex = this.getGeometryZIndex(z);

                let geometry = new Geometry(vertices, indices);
                this.geometries[xIndex][zIndex] = geometry;
                this.renderer.addGeometry(geometry);
            }
        }
    }
}

TerrainMeshManager.GEOMETRIES_SIZE = 8;
TerrainMeshManager.SECTION_SIZE = 64;
TerrainMeshManager.UV_SCALE = 1 / 8;
