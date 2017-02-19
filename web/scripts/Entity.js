include("geometry/Transform");

class Entity {

    constructor(geometry, textureImage) {

        this.geometry = geometry;
        this.textureImage = textureImage;
        this.transform = new Transform();
        this.children = [];
    }
}
