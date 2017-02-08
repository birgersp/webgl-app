include("WebGLEngine");

class Cube extends WebGLEngine.Geometry {

    constructor() {

        var vertices = [
            0.5, 0.5, 0.5, 1, 1,
            -0.5, 0.5, 0.5, 0, 1,
            -0.5, -0.5, 0.5, 0, 0,
            0.5, -0.5, 0.5, 1, 0,

            0.5, 0.5, -0.5, 0, 1,
            -0.5, 0.5, -0.5, 1, 1,
            -0.5, -0.5, -0.5, 1, 0,
            0.5, -0.5, -0.5, 0, 0
        ];

        var indices = [
            4, 0, 3, 3, 7, 4, // x+
            5, 6, 2, 2, 1, 5, // x-
            1, 0, 4, 4, 5, 1, // y+
            2, 6, 7, 7, 3, 2, // y-
            3, 0, 1, 1, 2, 3, // z+
            7, 6, 5, 5, 4, 7 // z-
        ];

        super(vertices, indices);
    }
}
