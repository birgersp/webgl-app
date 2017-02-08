include("WebGLEngine");

class Pyramid extends WebGLEngine.Geometry {

    constructor() {

        var vertices = [
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0, 0.5, 0,
        ];

        var indices = [
            0, 1, 2, 2, 3, 0, // bottom
            0, 4, 1,
            1, 4, 2,
            2, 4, 3,
            3, 4, 0
        ];

        super(vertices, indices);
    }
}
