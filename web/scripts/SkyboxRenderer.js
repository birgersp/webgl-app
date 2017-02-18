include("util/FileLoader");

class SkyboxRenderer extends Renderer {

    static getVertices(size) {

        return [
            -size, size, -size,
            -size, -size, -size,
            size, -size, -size,
            size, -size, -size,
            size, size, -size,
            -size, size, -size,

            -size, -size, size,
            -size, -size, -size,
            -size, size, -size,
            -size, size, -size,
            -size, size, size,
            -size, -size, size,

            size, -size, -size,
            size, -size, size,
            size, size, size,
            size, size, size,
            size, size, -size,
            size, -size, -size,

            -size, -size, size,
            -size, size, size,
            size, size, size,
            size, size, size,
            size, -size, size,
            -size, -size, size,

            -size, size, -size,
            size, size, -size,
            size, size, size,
            size, size, size,
            -size, size, size,
            -size, size, -size,

            -size, -size, -size,
            -size, -size, size,
            size, -size, -size,
            size, -size, -size,
            -size, -size, size,
            size, -size, size
        ];
    }

    constructor(gl, skyboxSize) {

        super(gl);
        this.gl = gl;
        this.texture = gl.createTexture();
        this.uniformManager = null;
        this.vertices = SkyboxRenderer.getVertices(skyboxSize);
        this.positionAL = null;
        this.viewUniform = null;
        this.fogColorUniform = null;
        this.projectionUniform = null;
    }

    initialize(callback) {

        let fileLoader = new FileLoader();

        let imageFiles = [];
        for (let i in SkyboxRenderer.filenames.images)
            imageFiles.push(fileLoader.addImageFile(SkyboxRenderer.filenames.images[i]));

        let vertexShaderSourceFile = fileLoader.addTextFile(SkyboxRenderer.filenames.VERTEX_SHADER);
        let fragmentShaderSourceFile = fileLoader.addTextFile(SkyboxRenderer.filenames.FRAGMENT_SHADER);

        let renderer = this;
        fileLoader.load(function() {

            renderer.initializeVertexShader(vertexShaderSourceFile.text);
            renderer.initializeFragmentShader(fragmentShaderSourceFile.text);

            renderer.useShaderProgram();

            renderer.positionAL = renderer.getAttributeLocation("position");
            let uniformManager = renderer.getUniformManager();
            renderer.viewUniform = uniformManager.locateMatrix("view");
            renderer.projectionUniform = uniformManager.locateMatrix("projection");
            renderer.fogColorUniform = uniformManager.locateVector3("fogColor");

            let gl = renderer.gl;

            // Initialize textures
            renderer.gl.bindTexture(renderer.gl.TEXTURE_CUBE_MAP, renderer.texture);
            for (let i = 0; i < imageFiles.length; i++)
                renderer.gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imageFiles[i].image);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            // Buffer vertices
            renderer.bufferArrayF(renderer.vertices);

            callback();
        });
    }

    render(camera) {

        this.useShaderProgram();
        this.bindArrayBuffer(this.vertices);
        this.enableAttributeF(this.positionAL, 0, 3);

        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);

        let viewMatrix = new Matrix4(camera.getViewMatrix());
        viewMatrix.set([0, 0, 0], 12);
        this.viewUniform.write(viewMatrix);
        this.projectionUniform.write(camera.getProjectionMatrix());

        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 3);
    }

    set fogColor(color) {

        this.fogColorUniform.write(color);
    }
}

SkyboxRenderer.filenames = {
    FRAGMENT_SHADER: "shaders/skybox_fshader.webgl",
    VERTEX_SHADER: "shaders/skybox_vshader.webgl",
    images: {
        RIGHT: "binaries/skybox/right.jpg",
        LEFT: "binaries/skybox/left.jpg",
        TOP: "binaries/skybox/top.jpg",
        BOTTOM: "binaries/skybox/bottom.jpg",
        BACK: "binaries/skybox/back.jpg",
        FRONT: "binaries/skybox/front.jpg"
    }
};
