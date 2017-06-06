include("geometry/Transform.js");

class Entity {

    constructor(geometry, textureImage) {

        this.geometry = geometry;
        this.textureImage = textureImage;
        this.transform = new Transform();
        this.children = [];
    }
}
