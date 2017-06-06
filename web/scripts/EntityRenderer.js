include("Entity.js");

class EntityRenderer extends GeometryRenderer {

    constructor(gl) {

        super(gl);
        this.entities = [];
        this.transformUniform = null;
    }

    initialize(callback) {

        let fileLoader = new FileLoader();
        let vertexShaderSourceFile = fileLoader.addTextFile(EntityRenderer.filenames.VERTEX_SHADER);
        let fragmentShaderSourceFile = fileLoader.addTextFile(EntityRenderer.filenames.FRAGMENT_SHADER);

        let renderer = this;
        fileLoader.load(function() {

            renderer.initializeShaders(vertexShaderSourceFile.text, fragmentShaderSourceFile.text);
            renderer.initializeUniforms();
            renderer.transformUniform = renderer.getUniformManager().locateMatrix("transform");
            callback();
        });
    }

    addEntity(entity) {

        this.addGeometry(entity.geometry);

        if (!this.imageTextures.contains(entity.textureImage))
            this.bufferTexture(entity.textureImage);

        this.entities.push(entity);
    }

    prepareRendering(camera) {

        super.prepareRendering(camera);
    }

    render(camera) {

        this.prepareRendering(camera);

        let transformations = [Matrix4.identity()];
        let transform = transformations[0];

        let renderer = this;
        function renderEntity(entity) {

            transformations.push(entity.transform.getMatrix());
            transform = transform.times(entity.transform.getMatrix());
            renderer.transformUniform.write(transform);

            renderer.bindTexture(entity.textureImage);
            renderer.renderGeometry(entity.geometry);

            for (let i in entity.children)
                renderEntity(entity.children[i]);

            transformations.pop();
            transform = transformations[transformations.length - 1];
        }

        for (let i in this.entities)
            renderEntity(this.entities[i]);
    }
}

EntityRenderer.filenames = {
    FRAGMENT_SHADER: "shaders/entity_fshader.webgl",
    VERTEX_SHADER: "shaders/entity_vshader.webgl"
};
