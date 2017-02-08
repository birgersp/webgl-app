class Vertex extends Float32Array {

    constructor(x, y, z) {

        super([x, y, z]);
    }
};

Vertex.LENGTH = (new Vertex()).length;
Vertex.SIZE = Vertex.LENGTH * Float32Array.BYTES_PER_ELEMENT;
