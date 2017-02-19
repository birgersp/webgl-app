include("util/FileLoader");

class TerrainRenderer extends GeometryRenderer {

    constructor(gl) {

        super(gl);

        this.grassImage = null;
        this.rockImage = null;

        this.sampler2Uniform = null;
    }

    initializeUniforms() {

        super.initializeUniforms();
        let uniformManager = this.getUniformManager();
        this.sampler2Uniform = uniformManager.locateInteger("sampler2");
    }

    initialize(callback) {

        let fileLoader = new FileLoader();
        let vShaderFile = fileLoader.addTextFile(TerrainRenderer.filenames.VERTEX_SHADER);
        let fShaderFile = fileLoader.addTextFile(TerrainRenderer.filenames.FRAGMENT_SHADER);
        let grassTextureFile = fileLoader.addImageFile(TerrainRenderer.filenames.images.GRASS);
        let rockTextureFile = fileLoader.addImageFile(TerrainRenderer.filenames.images.ROCK);

        let renderer = this;
        fileLoader.load(function() {

            renderer.initializeShaders(vShaderFile.text, fShaderFile.text);

            renderer.useShaderProgram();

            renderer.grassImage = grassTextureFile.image;
            renderer.bufferTexture(renderer.grassImage);
            renderer.rockImage = rockTextureFile.image;
            renderer.bufferTexture(renderer.rockImage);

            renderer.initializeUniforms();
            callback();
        });
    }

    setTerrainIndices(indices) {

        let section;
        for (let i = 0; i < this.geometries.length && !section; i++)
            if (this.geometries[i].indices === indices)
                section = this.geometries[i];
        this.bufferElementArrayI(section.indices);
    }

    render(camera) {

        this.useShaderProgram();

        this.viewUniform.write(camera.getViewMatrix());
        this.projectionUniform.write(camera.getProjectionMatrix());
        this.setActiveTexture(0);
        this.bindTexture(this.grassImage);
        this.setActiveTexture(1);
        this.bindTexture(this.rockImage);

        this.samplerUniform.write(0);
        this.sampler2Uniform.write(1);

        for (let i in this.geometries)
            this.renderGeometry(this.geometries[i]);
    }
}

TerrainRenderer.filenames = {
    VERTEX_SHADER: "shaders/terrain_vshader.webgl",
    FRAGMENT_SHADER: "shaders/terrain_fshader.webgl",
    images: {
        GRASS: "binaries/grass01.jpg",
        ROCK: "binaries/rock01.jpg"
    }
};
