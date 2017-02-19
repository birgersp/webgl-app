include("TerrainSection");
include("TerrainGeometry");

class TerrainMeshManager extends CoordinateSystem {

    constructor(world, renderer) {

        super(TerrainMeshManager.SECTION_SIZE);
        this.world = world;
        this.renderer = renderer;
//        this.world.terrainHeights = {};
        this.sections = {};
    }

//    addTerrainCoordinate(coordinate) {
//
//        let xIndex = coordinate[0];
//        if (!this.world.terrainHeights[xIndex])
//            this.world.terrainHeights[xIndex] = {};
//
//        let zIndex = coordinate[2];
//        this.world.terrainHeights[xIndex][zIndex] = coordinate[1];
//    }

    updateSectionGeometry(geometry) {

        this.renderer.setTerrainIndices(geometry.indices);
    }

    setSection(x, z, section) {

        let xIndex = this.getXIndex(x);
        if (!this.sections[xIndex])
            this.sections[xIndex] = {};

        let zIndex = this.getZIndex(z);
        this.sections[xIndex][zIndex] = section;
    }

    getSection(x, z) {

        let xIndex = this.getXIndex(x);
        if (this.sections[xIndex])
            return this.sections[this.getXIndex(x)][this.getZIndex(z)];
    }

    removeTerrainCoordinate(x, z) {

        let section = this.getSection(x, z);

        let xInSection = this.getLocalX(x);
        let zInSection = this.getLocalZ(z);

        let geometry = section.getGeometry(xInSection, zInSection);

        let xInGeometry = section.getLocalX(xInSection);
        let zInGeometry = section.getLocalZ(zInSection);

        let faceIndexX = geometry.getXIndex(xInGeometry);
        let faceIndexZ = -geometry.getZIndex(zInGeometry);

        let indexIndex = (faceIndexZ * TerrainSection.GEOMETRY_SIZE + faceIndexX) * 6;

        let indices = geometry.indices;
        indices.splice(indexIndex, 6, 0, 0, 0, 0, 0, 0);
        this.renderer.setTerrainIndices(indices);
    }

    initializeTerrainSection(originX, originZ) {

        let targetX = this.getXIndex(originX) * TerrainMeshManager.SECTION_SIZE;
        let targetZ = this.getZIndex(originZ) * TerrainMeshManager.SECTION_SIZE;

        let verticesPerGeometry = TerrainSection.GEOMETRY_SIZE + 1;
        let uvScale = TerrainMeshManager.UV_SCALE;

        let endX = targetX + TerrainMeshManager.SECTION_SIZE;
        let endZ = targetZ - TerrainMeshManager.SECTION_SIZE;

        let section = new TerrainSection();
        for (let z = targetZ; z > endZ; z -= TerrainSection.GEOMETRY_SIZE) {
            for (let x = targetX; x < endX; x += TerrainSection.GEOMETRY_SIZE) {

                let vertices = [];
                let indices = [];

                for (let j = 0; j <= TerrainSection.GEOMETRY_SIZE; j++) {
                    let z2 = z - j;
                    for (let i = 0; i <= TerrainSection.GEOMETRY_SIZE; i++) {
                        let x2 = x + i;
                        let coord = new Vector3(x2, this.world.terrainHeights[x2][z2], z2);
                        let leftHeight = this.world.terrainHeights[x2 - 1][z2];
                        let rightHeight = this.world.terrainHeights[x2 + 1][z2];
                        let bottomHeight = this.world.terrainHeights[x2][z2 + 1];
                        let topHeight = this.world.terrainHeights[x2][z2 - 1];

                        if (i > 0 && j > 0) {

                            let b = j * verticesPerGeometry + i;
                            let a = b - 1;
                            let d = b - verticesPerGeometry;
                            let c = d - 1;

                            indices = indices.concat([a, c, b, b, c, d]);
                        }

                        let n = new Vector3(leftHeight - rightHeight, 2, bottomHeight - topHeight).normalize();
                        vertices = vertices.concat([coord[0], coord[1], coord[2], n[0], n[1], n[2], i * uvScale, j * uvScale]);
                    }
                }

                let geometry = new TerrainGeometry(vertices, indices);
                section.setGeometry(this.getLocalX(x), this.getLocalZ(z), geometry);
                this.renderer.addGeometry(geometry);
            }
        }
        this.setSection(originX, originZ, section);
    }
}

TerrainMeshManager.SECTION_SIZE = 64;
TerrainMeshManager.UV_SCALE = 1 / 8;
