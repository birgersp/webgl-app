/**
 * Thanks to ThinMatrix for showing me how to do this
 * https://www.facebook.com/thinmatrix
 */

class TerrainGenerator {

    constructor(coordinateHandler) {

        this.amplitude = 50;
        this.octaves = 4;
        this.roughness = 0.5;
        this.generatedNoise = {};
        this.coordinateHandler = coordinateHandler;
    }

    getNoise(x, z) {

        if (!this.generatedNoise[x])
            this.generatedNoise[x] = {};

        if (this.generatedNoise[x][z] === undefined)
            this.generatedNoise[x][z] = Math.random() * 2 - 1;

        return this.generatedNoise[x][z];
    }

    getSmoothNoise(x, z) {

        let corners = (this.getNoise(x + 1, z - 1) + this.getNoise(x - 1, z - 1) + this.getNoise(x - 1, z + 1) + this.getNoise(x + 1, z + 1)) / 16;
        let sides = (this.getNoise(x - 1, z) + this.getNoise(x + 1, z) + this.getNoise(x, z + 1) + this.getNoise(x, z - 1)) / 8;
        let center = this.getNoise(x, z) / 4;
        return (corners + sides + center);
    }

    interpolate(a, b, blend) {

        let theta = blend * Math.PI;
        let f = (1 - Math.cos(theta)) * 0.5;
        return a * (1 - f) + b * f;
    }

    getInterpolatedNoise(x, z) {

        let intX = Math.floor(x);
        let intZ = Math.floor(z);
        let fracX = x - intX;
        let fracZ = z - intZ;

        let v1 = this.getSmoothNoise(intX, intZ);
        let v2 = this.getSmoothNoise(intX + 1, intZ);
        let v3 = this.getSmoothNoise(intX, intZ + 1);
        let v4 = this.getSmoothNoise(intX + 1, intZ + 1);

        let i1 = this.interpolate(v1, v2, fracX);
        let i2 = this.interpolate(v3, v4, fracX);
        return this.interpolate(i1, i2, fracZ);
    }

    generateY(x, z) {

        let y = 0;
        let d = Math.pow(3, this.octaves - 1);
        for (let i = 0; i < this.octaves; i++) {
            let freq = Math.pow(2, i) / d;
            let amp = Math.pow(this.roughness, i) * this.amplitude;
            y += this.getInterpolatedNoise(x * freq, z * freq) * amp;
        }
        return y;
    }

    getTerrainCoordinates(xOffset, zOffset, size) {
        let i = 0;
//        let terrainCoordinates = new Array(Math.pow(size, 2));
        for (let z = 0; z <= size; z++)
            for (let x = 0; x <= size; x++) {
                let coordinate = new Vector3(xOffset + x, 0, zOffset - z);
                coordinate[1] = this.generateY(coordinate[0], coordinate[2]);
                this.coordinateHandler.addTerrainCoordinate(coordinate);
//                terrainCoordinates[i++] = coordinate;
            }
//        return terrainCoordinates;
    }
}