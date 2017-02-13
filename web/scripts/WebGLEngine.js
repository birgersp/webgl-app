include("geometry/Vertex");
include("geometry/Transform");

include("Camera");

class WebGLEngine {

    constructor(gl) {

        this.gl = gl;
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);

        this.positionAttribL = null;
        this.textureCoordinateAttribL = null;
        this.transformUniformL = null;
        this.samplerUniformL = null;
        this.useColorUniformL = null;
        this.viewTransform = Matrix4.identity();
        this.objects = [];
        this.bufferedGeometries = {};
        this.glTextures = {};
        this.lastBoundGeometry = null;
        this.lastBoundTexture = null;
        this.camera = new Camera();
    }

    initialize(vertexShaderSource, fragmentShaderSource) {

        var shaderProgram = this.gl.createProgram();

        // Compile vertex shader
        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, vertexShaderSource);
        this.gl.compileShader(vertexShader);
        this.gl.attachShader(shaderProgram, vertexShader);

        // Compile fragment shader
        var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, fragmentShaderSource);
        this.gl.compileShader(fragmentShader);
        this.gl.attachShader(shaderProgram, fragmentShader);

        // Link and use shader program
        this.gl.linkProgram(shaderProgram);
        this.gl.useProgram(shaderProgram);

        // Set vertex attribute pointer for position
        this.positionAttribL = this.gl.getAttribLocation(shaderProgram, "position");
        this.textureCoordinateAttribL = this.gl.getAttribLocation(shaderProgram, "textureCoord");
        this.transformUniformL = this.gl.getUniformLocation(shaderProgram, "transform");
        this.samplerUniformL = this.gl.getUniformLocation(shaderProgram, "sampler");
        this.useColorUniformL = this.gl.getUniformLocation(shaderProgram, "useColor");
        this.projectionUniformL = this.gl.getUniformLocation(shaderProgram, "projectionView");
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
            this.gl.vertexAttribPointer(this.positionAttribL, 3, this.gl.FLOAT, false, Vertex.SIZE, 0);
            this.gl.enableVertexAttribArray(this.positionAttribL);
            this.gl.vertexAttribPointer(this.textureCoordinateAttribL, 2, this.gl.FLOAT, false, Vertex.SIZE, 3 * Vertex.BYTES_PER_ELEMENT);
            this.gl.enableVertexAttribArray(this.textureCoordinateAttribL);
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
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.glTextures[texture.objectID] = glTexture;

        return glTexture;
    }

    bindTexture(glTexture) {

        if (this.lastBoundTexture !== glTexture) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
            this.gl.uniform1i(this.samplerUniformL, 0);
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

    drawObjects() {

        let engine = this;

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.uniformMatrix4fv(this.projectionUniformL, false, this.camera.getViewProjectionMatrix());

        var transformMatrices = [Matrix4.identity()];
        var transform = transformMatrices[0];

        function renderObject(object) {
            transformMatrices.push(object.transform.getMatrix());
            transform = transform.times(object.transform.getMatrix());
            engine.gl.uniformMatrix4fv(engine.transformUniformL, false, transform);

            var bufferedGeometry = engine.getBufferedGeometry(object.geometry);
            engine.bindBufferedGeometry(bufferedGeometry);

            var glTexture = engine.getGLTexture(object.texture);
            engine.bindTexture(glTexture);

            var indices = object.geometry.indices.length;

            engine.gl.uniform1f(engine.useColorUniformL, 1);
            engine.gl.drawElements(engine.gl.TRIANGLES, indices, engine.gl.UNSIGNED_BYTE, 0);

//            engine.gl.uniform1f(engine.useColorUniformL, 0);
//            engine.gl.drawElements(engine.gl.LINE_STRIP, indices, engine.gl.UNSIGNED_BYTE, 0);

            for (var childIndex = 0; childIndex < object.children.length; childIndex++)
                renderObject(object.children[childIndex]);

            transformMatrices.pop();
            transform = transformMatrices[transformMatrices.length - 1];
        }

        this.objects.forEach(renderObject);
    }

    setViewPort(x, y, width, height) {

        this.gl.viewport(x, y, width, height);
    }

    render() {

        let engine = this;
        requestAnimationFrame(function() {
            engine.drawObjects();
        });
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
