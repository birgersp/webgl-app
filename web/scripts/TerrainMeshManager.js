class TerrainMeshManager {

    constructor(world, renderer) {

        this.world = world;
        this.renderer = renderer;
        this.geometries = {};
        this.coordinateHeights = {};
    }

    addTerrainCoordinate(coordinate) {

        let xIndex = Math.floor(coordinate[0]);
        if (!this.coordinateHeights[xIndex])
            this.coordinateHeights[xIndex] = {};

        let zIndex = Math.ceil(coordinate[2]);
        this.coordinateHeights[xIndex][zIndex] = coordinate[1];
    }

    getSectionXIndex(x) {

        return Math.floor(x / TerrainMeshManager.GEOMETRIES_SIZE);
    }

    getSectionZIndex(z) {

        return Math.ceil(z / TerrainMeshManager.GEOMETRIES_SIZE);
    }

    updateSectionGeometry(geometry) {

        this.renderer.setTerrainIndices(geometry.indices);
    }

    removeTerrainCoordinate(x, z) {

        let sectionXIndex = this.getSectionXIndex(x);
        let sectionZIndex = this.getSectionZIndex(z);

        let xIndex = Math.floor(x - sectionXIndex * TerrainMeshManager.GEOMETRIES_SIZE);
        let zIndex = Math.floor(sectionZIndex * TerrainMeshManager.GEOMETRIES_SIZE - z);
        let indexIndex = (zIndex * TerrainMeshManager.GEOMETRIES_SIZE + xIndex) * 6;

        let indices = this.geometries[sectionXIndex][sectionZIndex].indices;
        indices.splice(indexIndex, 6);
        this.renderer.setTerrainIndices(indices);
    }

    addTerrain(coordinates) {

        let size = Math.sqrt(coordinates.length);
        let verticesPerGeometry = TerrainMeshManager.GEOMETRIES_SIZE + 1;
        let sections = Math.ceil(size / verticesPerGeometry);
        let uvScale = 1 / (verticesPerGeometry - 1);

        let sectionI, sectionJ;
        function getSectionCoordinateIndex(i, j) {
            let index = sectionJ * size * (verticesPerGeometry - 1) + sectionI * (verticesPerGeometry - 1) + j * size + i;
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

                let vertices = [];
                let indices = [];

                for (let j = 0; j < verticesPerGeometry; j++) {
                    for (let i = 0; i < verticesPerGeometry; i++) {

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

                            let b = j * verticesPerGeometry + i;
                            let a = b - 1;
                            let d = b - verticesPerGeometry;
                            let c = d - 1;

                            indices = indices.concat([a, c, b, b, c, d]);
                        }

                        let n = new Vector3(heightLeft - heightRight, 2, heightBottom - heightTop).normalize();
                        vertices = vertices.concat([coord[0], coord[1], coord[2], n[0], n[1], n[2], i * uvScale, j * uvScale]);
                    }
                }

                let sectionPosition = getSectionCoordinate(0, 0);

                let xIndex = this.getSectionXIndex(sectionPosition[0]);
                if (!this.geometries[xIndex])
                    this.geometries[xIndex] = {};

                let zIndex = this.getSectionZIndex(sectionPosition[2]);

                let geometry = new Geometry(vertices, indices);
                this.geometries[xIndex][zIndex] = geometry;
                this.renderer.addGeometry(geometry);
            }
        }
    }
}

TerrainMeshManager.GEOMETRIES_SIZE = 8;
