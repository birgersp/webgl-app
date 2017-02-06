include("WebGLEngine");

class Cube extends WebGLEngine.Geometry {

    constructor() {

        var vertices = [
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,

            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5
        ];

        var indices = [
            0, 3, 4, 7, 4, 3, // x+
            6, 2, 5, 1, 5, 2, // x-
            0, 4, 1, 5, 1, 4, // y+
            6, 7, 2, 3, 2, 7, // y-
            6, 5, 7, 4, 7, 5, // z-
            0, 1, 3, 2, 3, 1 // z+
        ];

        super(vertices, indices);
    }
}
