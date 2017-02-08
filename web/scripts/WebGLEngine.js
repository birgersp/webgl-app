include("Transform");
include("Camera");

class WebGLEngine {

    constructor(gl) {

        this.gl = gl;
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);

        this.positionAttribL = null;
        this.transformUniformL = null;
        this.useColorUniformL = null;
        this.viewTransform = Matrix4.identity();
        this.objects = [];
        this.bufferedGeometries = [];
        this.lastBoundGeometry = null;
        this.camera = new Camera(70);
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
        this.transformUniformL = this.gl.getUniformLocation(shaderProgram, "transform");
        this.useColorUniformL = this.gl.getUniformLocation(shaderProgram, "useColor");
        this.projectionUniformL = this.gl.getUniformLocation(shaderProgram, "projectionView");
    }

    bufferGeometry(geometry) {

        var vertexBuffer = this.gl.createBuffer();
        var indexBuffer = this.gl.createBuffer();
        var bufferedGeometry = new WebGLEngine.BufferedGeometry(geometry, vertexBuffer, indexBuffer);

        this.bindBufferedGeometry(bufferedGeometry);
        this.writeBufferedGeometryData(bufferedGeometry);

        return bufferedGeometry;
    }

    bindBufferedGeometry(bufferedGeometry) {

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferedGeometry.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferedGeometry.indexBuffer);
        this.gl.vertexAttribPointer(this.positionAttribL, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.positionAttribL);
        this.lastBoundGeometry = bufferedGeometry;
    }

    writeBufferedGeometryData(bufferedGeometry) {

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(bufferedGeometry.geometry.vertices), this.gl.STATIC_DRAW);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(bufferedGeometry.geometry.indices), this.gl.STATIC_DRAW);
    }

    getBufferedGeometry(geometry) {

        var bufferedGeometry = null;
        for (var geometryIndex = 0; geometryIndex < this.bufferedGeometries.length && !bufferedGeometry; geometryIndex++)
            if (this.bufferedGeometries[geometryIndex].geometry === geometry)
                bufferedGeometry = this.bufferedGeometries[geometryIndex];

        if (!bufferedGeometry)
            bufferedGeometry = this.bufferGeometry(geometry);

        return bufferedGeometry;
    }

    addObject(object) {

        object.bufferedGeometry = this.getBufferedGeometry(object.geometry);
        this.objects.push(object);
    }

    drawObjects() {

        var engine = this;

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.uniformMatrix4fv(this.projectionUniformL, false, this.camera.getViewProjectionMatrix());

        var transformMatrices = [Matrix4.identity()];
        var transform = transformMatrices[0];

        function renderObject(object) {
            transformMatrices.push(object.transform.getMatrix());
            transform = transform.times(object.transform.getMatrix());
            engine.gl.uniformMatrix4fv(engine.transformUniformL, false, transform);

            if (!object.bufferedGeometry)
                object.bufferedGeometry = engine.bufferGeometry(object.geometry);
            var bufferedGeometry = object.bufferedGeometry;
            if (engine.lastBoundGeometry !== bufferedGeometry)
                engine.bindBufferedGeometry(bufferedGeometry);

            var indices = bufferedGeometry.geometry.indices.length;

            engine.gl.uniform1f(engine.useColorUniformL, 1);
            engine.gl.drawElements(engine.gl.TRIANGLES, indices, engine.gl.UNSIGNED_BYTE, 0);

            engine.gl.uniform1f(engine.useColorUniformL, 0);
            engine.gl.drawElements(engine.gl.LINE_STRIP, indices, engine.gl.UNSIGNED_BYTE, 0);

            for (var childIndex = 0; childIndex < object.children.length; childIndex++)
                renderObject(object.children[childIndex]);

            transformMatrices.pop();
            transform = transformMatrices[transformMatrices.length - 1];
        }

        this.objects.forEach(renderObject);
    }
}

WebGLEngine.BufferedGeometry = class {

    constructor(geometry, vertexBuffer, indexBuffer) {

        this.geometry = geometry;
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

WebGLEngine.Object = class {

    constructor(geometry) {

        this.geometry = geometry;
        this.transform = new Transform();
        this.children = [];
        this.bufferedGeometry = null;
    }

    add(object) {

        this.children.push(object);
    }
};
