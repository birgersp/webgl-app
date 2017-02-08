class Vertex extends Float32Array {

    constructor(x, y, z, u, v) {

        super([x, y, z, u, v]);
    }
};

Vertex.LENGTH = (new Vertex()).length;
Vertex.SIZE = Vertex.LENGTH * Float32Array.BYTES_PER_ELEMENT;
