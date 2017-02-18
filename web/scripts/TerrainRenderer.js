include("util/FileLoader");

class TerrainRenderer extends Renderer {

    constructor(gl) {

        super(gl);

        this.terrainSections = [];

        this.viewUniform = null;
        this.transformUniform = null;
        this.projectionUniform = null;
        this.sampler0Uniform = null;
        this.sampler1Uniform = null;
        this.sunDirectionUniform = null;
        this.sunColorUniform = null;
        this.viewDistanceUniform = null;
        this.fogFactorUniform = null;
        this.fogColorUniform = null;

        this.grassImage = null;
        this.rockImage = null;

        this.positionAL = null;
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
            let uniformManager = renderer.getUniformManager();
            renderer.viewUniform = uniformManager.locateMatrix("view");
            renderer.transformUniform = uniformManager.locateMatrix("transform");
            renderer.projectionUniform = uniformManager.locateMatrix("projection");
            renderer.sampler0Uniform = uniformManager.locateInteger("sampler0");
            renderer.sampler1Uniform = uniformManager.locateInteger("sampler1");

            renderer.sunDirectionUniform = uniformManager.locateVector3("sunDirection");
            renderer.sunColorUniform = uniformManager.locateVector3("sunColor");
            renderer.viewDistanceUniform = uniformManager.locateFloat("viewDistance");
            renderer.fogFactorUniform = uniformManager.locateFloat("fogFactor");
            renderer.fogColorUniform = uniformManager.locateVector3("fogColor");

            renderer.positionAL = renderer.getAttributeLocation("position");
            renderer.normalAL = renderer.getAttributeLocation("normal");
            renderer.textureCoordAL = renderer.getAttributeLocation("textureCoord");

            renderer.grassImage = grassTextureFile.image;
            renderer.bufferTexture(renderer.grassImage);
            renderer.rockImage = rockTextureFile.image;
            renderer.bufferTexture(renderer.rockImage);

            callback();
        });
    }

    addTerrain(vertices, indices) {

        this.terrainSections.push(new TerrainRenderer.TerrainSection(vertices, indices));
        this.bufferArrayF(vertices);
        this.bufferElementArrayI(indices);
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

        this.transformUniform.write(Matrix4.identity());

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

    set sunDirection(vector) {
        this.sunDirectionUniform.write(vector);
    }

    set sunColor(vector) {
        this.sunColorUniform.write(vector);
    }

    set viewDistance(value) {
        this.viewDistanceUniform.write(value);
    }

    set fogFactor(value) {
        this.fogFactorUniform.write(value);
    }

    set fogColor(vector) {
        this.fogColorUniform.write(vector);
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
