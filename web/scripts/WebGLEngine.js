include("geometry/Vertex");
include("geometry/Transform");
include("ShaderUniformManager");

include("Camera");
include("Skybox");

include("util/InitializableManager");
include("Renderer");
include("TerrainRenderer");
include("SkyboxRenderer");

class WebGLEngine extends Initializable {

    constructor(gl) {

        super();
        this.gl = gl;
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);

        this.objects = [];
        this.terrainObjects = [];
        this.terrainTexture0 = null;
        this.terrainTexture1 = null;

        this.bufferedGeometries = {};
        this.glTextures = {};
        this.lastBoundGeometry = null;
        this.lastBoundTexture = null;
        this.camera = new Camera();

        this.vertexShaderSource = null;
        this.fragmentShaderSource = null;

        this.skyboxRenderer = new SkyboxRenderer(this.gl, 64);
        this.terrainRenderer = new TerrainRenderer(this.gl);
    }

    initialize(callback) {

        let engine = this;

        let initializableManager = new InitializableManager();
        initializableManager.add(this.skyboxRenderer);
        initializableManager.add(this.terrainRenderer);
        initializableManager.initialize(function() {

            engine.mainShaderProgram = engine.terrainRenderer.shaderProgram;

            engine.terrainRenderer.useShaderProgram();

            let mainUniformManager = new ShaderUniformManager(engine.gl, engine.mainShaderProgram);

            engine.mainUniforms = {
                view: mainUniformManager.locateMatrix("view"),
                transform: mainUniformManager.locateMatrix("transform"),
                projection: mainUniformManager.locateMatrix("projection"),

                sampler0: mainUniformManager.locateInteger("sampler0"),
                sampler1: mainUniformManager.locateInteger("sampler1"),

                sunDirection: mainUniformManager.locateVector3("sunDirection"),
                sunColor: mainUniformManager.locateVector3("sunColor"),

                viewDistance: mainUniformManager.locateFloat("viewDistance"),
                fogFactor: mainUniformManager.locateFloat("fogFactor"),
                fogColor: mainUniformManager.locateVector3("fogColor"),

                terrainMode: mainUniformManager.locateFloat("terrainMode")
            };

            engine.mainUniforms.sampler0.write(0);
            engine.mainUniforms.sampler1.write(1);

            callback();
        });
    }

    bufferGeometry(geometry) {

        var bufferedGeometry = this.bufferedGeometries[geometry.objectID];
        if (!bufferedGeometry) {
            var vertexBuffer = this.gl.createBuffer();
            var indexBuffer = this.gl.createBuffer();
            bufferedGeometry = new WebGLEngine.BufferedGeometry(vertexBuffer, indexBuffer);
        }

        this.bindBufferedGeometry(bufferedGeometry);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), this.gl.STATIC_DRAW);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(geometry.indices), this.gl.STATIC_DRAW);
        this.bufferedGeometries[geometry.objectID] = bufferedGeometry;

        return bufferedGeometry;
    }

    bindBufferedGeometry(bufferedGeometry) {

        if (this.lastBoundGeometry !== bufferedGeometry) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferedGeometry.vertexBuffer);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferedGeometry.indexBuffer);

            this.terrainRenderer.enableAttributeF(this.terrainRenderer.positionAL, 0, 3, 8);
            this.terrainRenderer.enableAttributeF(this.terrainRenderer.normalAL, 3, 3, 8, true);
            this.terrainRenderer.enableAttributeF(this.terrainRenderer.textureCoordAL, 6, 2, 8);
            this.lastBoundGeometry = bufferedGeometry;
        }
    }

    getBufferedGeometry(geometry) {

        var bufferedGeometry = this.bufferedGeometries[geometry.objectID];
        if (bufferedGeometry === undefined)
            bufferedGeometry = this.bufferGeometry(geometry);

        return bufferedGeometry;
    }

    bufferTexture(texture) {

        var glTexture = this.gl.createTexture();

        this.bindTexture(glTexture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.glTextures[texture.objectID] = glTexture;

        return glTexture;
    }

    bindTexture(glTexture) {

        if (this.lastBoundTexture !== glTexture) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
            this.lastBoundTexture = glTexture;
        }
    }

    getGLTexture(texture) {

        var glTexture = this.glTextures[texture.objectID];
        if (glTexture === undefined)
            glTexture = this.bufferTexture(texture);

        return glTexture;
    }

    addObject(object) {

        this.getBufferedGeometry(object.geometry);
        this.getGLTexture(object.texture);
        this.objects.push(object);
    }

    addTerrainObject(object) {

        this.getBufferedGeometry(object.geometry);
        this.terrainObjects.push(object);
    }

    setTerrainTextures(texture0, texture1) {

        this.terrainTexture0 = this.getGLTexture(texture0);
        this.terrainTexture1 = this.getGLTexture(texture1);
    }

    renderGeometry(geometry) {

        var bufferedGeometry = this.getBufferedGeometry(geometry);
        this.bindBufferedGeometry(bufferedGeometry);

        var indices = geometry.indices.length;
        this.gl.drawElements(this.gl.TRIANGLES, indices, this.gl.UNSIGNED_BYTE, 0);
    }

    render() {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.skyboxRenderer.render(this.camera);

        this.gl.useProgram(this.mainShaderProgram);
        this.mainUniforms.view.write(this.camera.getViewMatrix());
        this.mainUniforms.projection.write(this.camera.getProjectionMatrix());
        this.mainUniforms.transform.write(Matrix4.identity());
        this.mainUniforms.terrainMode.write(1);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.bindTexture(this.terrainTexture0);
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.bindTexture(this.terrainTexture1);
        for (let terrainI in this.terrainObjects)
            this.renderGeometry(this.terrainObjects[terrainI].geometry);
        this.mainUniforms.terrainMode.write(0);
    }

    setViewPort(x, y, width, height) {

        this.gl.viewport(x, y, width, height);
    }
}

WebGLEngine.BufferedGeometry = class {

    constructor(vertexBuffer, indexBuffer) {

        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
    }
};

WebGLEngine.Geometry = class extends Identifyable {

    constructor(vertices, indices) {

        super();
        this.vertices = vertices;
        this.indices = indices;
    }
};

WebGLEngine.Texture = class extends Identifyable {

    constructor(image) {

        super();
        this.image = image;
    }
};

WebGLEngine.Object = class {

    constructor(geometry, texture) {

        this.geometry = geometry;
        this.texture = texture;
        this.transform = new Transform();
        this.children = [];
    }

    add(object) {

        this.children.push(object);
    }
};

WebGLEngine.TerrainObject = class {

    constructor(geometry, texture0, texture1) {

        this.geometry = geometry;
        this.texture0 = texture0;
        this.texture1 = texture1;
    }
};
