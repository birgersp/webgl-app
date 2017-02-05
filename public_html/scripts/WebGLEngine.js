class WebGLEngine {

    constructor(gl) {

        this.gl = gl;
        this.gl.enable(gl.DEPTH_TEST);
        this.positionAttribL = null;
        this.transformUniformL = null;
        this.useColorUniformL = null;
        this.viewTransform = Matrix4.identity();
        this.bufferedGeometries = [];
        this.lastBoundGeometry = null;
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


        var camera = new Camera(70);
        var projectionUniformL = this.gl.getUniformLocation(shaderProgram, "projection");
        this.gl.uniformMatrix4fv(projectionUniformL, false, camera.getProjectionMatrix());
    }

    bufferGeometry(geometry) {

        var vertexBuffer = this.gl.createBuffer();
        var indexBuffer = this.gl.createBuffer();
        var bufferedGeometry = new WebGLEngine.BufferedGeometry(geometry, vertexBuffer, indexBuffer);

        this.bindBufferedGeometry(bufferedGeometry);
        this.writeBufferedGeometryData(bufferedGeometry);

        this.bufferedGeometries.push(bufferedGeometry);
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
        var geometryIndex = 0;
        while (geometryIndex < this.bufferedGeometries.length && !bufferedGeometry)
            if (this.bufferedGeometries[geometryIndex].geometry === geometry)
                bufferedGeometry = this.bufferedGeometries[geometryIndex];
            else
                geometryIndex++;

        if (!bufferedGeometry)
            bufferedGeometry = this.bufferGeometry(geometry);

        return bufferedGeometry;
    }

    addObject(object) {

        var bufferedGeometry = this.getBufferedGeometry(object.geometry);
        bufferedGeometry.objects.push(object);
    }

    drawObjects() {

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        for (var geometryIndex in this.bufferedGeometries) {
            var bufferedGeometry = this.bufferedGeometries[geometryIndex];

            if (this.lastBoundGeometry !== bufferedGeometry)
                this.bindBufferedGeometry(bufferedGeometry);

            var indices = bufferedGeometry.geometry.indices.length;

            for (var objectIndex in bufferedGeometry.objects) {

                var object = bufferedGeometry.objects[objectIndex];

                this.gl.uniformMatrix4fv(this.transformUniformL, false, object.transform.getMatrix());

                this.gl.uniform1f(this.useColorUniformL, 1.0);
                this.gl.drawElements(this.gl.TRIANGLES, indices, this.gl.UNSIGNED_BYTE, 0);
            }
        }
    }
}

WebGLEngine.BufferedGeometry = class {

    constructor(geometry, vertexBuffer, indexBuffer) {

        this.geometry = geometry;
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.objects = [];
    }
};

WebGLEngine.Geometry = class {

    constructor(vertices, indices) {

        this.vertices = vertices;
        this.indices = indices;
    }
};

WebGLEngine.Object = class {

    constructor(geometry) {

        this.geometry = geometry;
        this.transform = new Transform();
    }
};
