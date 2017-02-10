include("../WebGLEngine");
include("Vertex");

class GeometryBuilder {

    static getSurface(resolution) {

        let vertices = new Float32Array(Math.pow(resolution, 2) * 4 * Vertex.LENGTH);
        let indices = new Float32Array(Math.pow(resolution, 2) * 6);

        let cellIndex = 0;
        for (let yCount = 1; yCount <= resolution; yCount++) {
            let y = yCount / resolution;
            for (let xCount = 1; xCount <= resolution; xCount++) {

                let i = cellIndex * 4;
                vertices.set(new Vertex((xCount - 1) / resolution, (yCount - 1) / resolution, 0, (xCount - 1) % 2, (yCount - 1) % 2), i * Vertex.LENGTH);
                vertices.set(new Vertex(xCount / resolution, (yCount - 1) / resolution, 0, xCount % 2, (yCount - 1) % 2), (i + 1) * Vertex.LENGTH);
                vertices.set(new Vertex((xCount - 1) / resolution, yCount / resolution, 0, (xCount - 1) % 2, yCount % 2), (i + 2) * Vertex.LENGTH);
                vertices.set(new Vertex(xCount / resolution, yCount / resolution, 0, xCount % 2, yCount % 2), (i + 3) * Vertex.LENGTH);

                indices.set([i, i + 1, i + 3, i, i + 3, i + 2], cellIndex * 6);

                cellIndex++;
            }
        }

        return new WebGLEngine.Geometry(vertices, indices);
    }
}