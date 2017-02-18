include("util/FileLoader");

class TerrainRenderer extends ObjectRenderer {

    constructor(gl) {

        super(gl);

        this.terrainSections = [];

        this.grassImage = null;
        this.rockImage = null;
    }

    onInitialized(callback) {

        super.initialize(callback);
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

            renderer.onInitialized(callback);
        });
    }

    addTerrain(vertices, indices) {

        this.terrainSections.push(new TerrainRenderer.TerrainSection(vertices, indices));
        this.bufferArrayF(vertices);
        this.setTerrainIndices(indices);
    }

    setTerrainIndices(indices) {

        let section;
        for (let i = 0; i < this.terrainSections.length && !section; i++)
            if (this.terrainSections[i].indices === indices)
                section = this.terrainSections[i];
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

        this.sampler0Uniform.write(0);
        this.sampler1Uniform.write(1);

        for (let terrainSectionI in this.terrainSections) {
            let terrainSection = this.terrainSections[terrainSectionI];
            this.bindArrayBuffer(terrainSection.vertices);
            this.enableAttributeF(this.positionAL, 0, 3, 8);
            this.enableAttributeF(this.normalAL, 3, 3, 8, true);
            this.enableAttributeF(this.textureCoordAL, 6, 2, 8);
            this.bindElementArrayBuffer(terrainSection.indices);
            this.gl.drawElements(this.gl.TRIANGLES, terrainSection.indices.length, this.gl.UNSIGNED_BYTE, 0);
        }
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

TerrainRenderer.TerrainSection = class {

    constructor(vertices, indices) {

        this.vertices = vertices;
        this.indices = indices;
    }
};
