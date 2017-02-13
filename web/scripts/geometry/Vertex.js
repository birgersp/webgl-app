class Vertex extends Float32Array {

    constructor(x, y, z, nx, ny, nz, u, v) {

        super([x, y, z, nx, ny, nz, u, v]);
    }
};

Vertex.LENGTH = (new Vertex()).length;
Vertex.SIZE = Vertex.LENGTH * Float32Array.BYTES_PER_ELEMENT;
