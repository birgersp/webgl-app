include("../WebGLEngine");
include("Vertex");

class GeometryBuilder {

    static getSurfaceGeometry(resolution) {

        let vertices = new Float32Array(Math.pow(resolution + 1, 2) * Vertex.LENGTH);
        let indices = new Float32Array(Math.pow(resolution, 2) * 6);

        let i = 0;
        for (let yCount = 0; yCount <= resolution; yCount++) {
            let y = yCount / resolution;
            for (let xCount = 0; xCount <= resolution; xCount++) {

                vertices.set(new Vertex(xCount / resolution, yCount / resolution, 0, xCount, yCount), i * Vertex.LENGTH);

                if (xCount > 0 && yCount > 0) {

                    let a = i - resolution - 2;
                    let b = a + 1;
                    let c = i - 1;
                    indices.set([a, b, i, a, i, c], ((yCount - 1) * resolution + xCount - 1) * 6);
                }
                i++;
            }
        }

        return new WebGLEngine.Geometry(vertices, indices);
    }
}