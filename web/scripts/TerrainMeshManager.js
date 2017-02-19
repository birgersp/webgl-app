class TerrainMeshManager {

    constructor(world, renderer) {

        this.world = world;
        this.renderer = renderer;
        this.sectionGeometries = {};
    }

    getSectionXIndex(x) {

        return Math.floor(x / TerrainMeshManager.SECTION_SIZE);
    }

    getSectionZIndex(z) {

        return Math.ceil(z / TerrainMeshManager.SECTION_SIZE);
    }

    updateSectionGeometry(geometry) {

        this.renderer.setTerrainIndices(geometry.indices);
    }

    addTerrain(coordinates) {

        let size = Math.sqrt(coordinates.length);
        let sectionSize = TerrainMeshManager.SECTION_SIZE;
        let sections = Math.ceil(size / sectionSize);
        let uvScale = 1 / (sectionSize - 1);

        let sectionI, sectionJ;
        function getSectionCoordinateIndex(i, j) {
            let index = sectionJ * size * (sectionSize - 1) + sectionI * (sectionSize - 1) + j * size + i;
            return index;
        }

        function getSectionCoordinate(i, j) {

            let index = getSectionCoordinateIndex(i, j);
            if (index >= 0 && index < coordinates.length)
                return coordinates[index];
            else
                return null;
        }

        for (sectionJ = 0; sectionJ < sections; sectionJ++) {
            for (sectionI = 0; sectionI < sections; sectionI++) {

                let vertexIndex = 0;
                let indexIndex = 0;
                let vertices = new Float32Array(Math.pow(sectionSize, 2) * Vertex.LENGTH);
                let indices = new Uint8Array(Math.pow(sectionSize - 1, 2) * 6);

                for (let j = 0; j < sectionSize; j++) {
                    for (let i = 0; i < sectionSize; i++) {

                        let coord = getSectionCoordinate(i, j);

                        let left = getSectionCoordinate(i - 1, j);
                        let heightLeft = left ? left[1] : coord[1];

                        let right = getSectionCoordinate(i + 1, j);
                        let heightRight = right ? right[1] : coord[1];

                        let top = getSectionCoordinate(i, j + 1);
                        let heightTop = top ? top[1] : coord[1];

                        let bottom = getSectionCoordinate(i, j - 1);
                        let heightBottom = bottom ? bottom[1] : coord[1];

                        if (i > 0 && j > 0) {
                            let bottomleft = getSectionCoordinate(i - 1, j - 1);
                            this.world.addTerrainCell(new TerrainGridCell(left, coord, bottomleft, bottom));

                            let b = j * sectionSize + i;
                            let a = b - 1;
                            let d = b - sectionSize;
                            let c = d - 1;

                            indices.set([a, c, b, b, c, d], indexIndex++ * 6);
                        }

                        let n = new Vector3(heightLeft - heightRight, 2, heightBottom - heightTop).normalize();
                        vertices.set(new Vertex(coord[0], coord[1], coord[2], n[0], n[1], n[2], i * uvScale, j * uvScale), vertexIndex++ * Vertex.LENGTH);
                    }
                }

                let sectionPosition = getSectionCoordinate(0, 0);

                let xIndex = this.getSectionXIndex(sectionPosition[0]);
                if (!this.sectionGeometries[xIndex])
                    this.sectionGeometries[xIndex] = {};

                let zIndex = this.getSectionZIndex(sectionPosition[2]);

                let geometry = new Geometry(vertices, indices);
                this.sectionGeometries[xIndex][zIndex] = geometry;
                this.renderer.addGeometry(geometry);
            }
        }
    }
}

TerrainMeshManager.SECTION_SIZE = 9;
