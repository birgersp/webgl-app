class WebGLEngine {

    constructor(gl) {

        this.gl = gl;
        this.positionAttribL = null;
        this.transformUniformL = null;
        this.useColorUniformL = null;
        this.viewTransform = Matrix4.identity();
        this.bufferedGeometries = [];
        this.lastBoundGeometry = null;
    }

    initialize(vertexShaderSource, fragmentShaderSource) {

        var gl = this.gl;
        var shaderProgram = gl.createProgram();

        // Compile vertex shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        gl.attachShader(shaderProgram, vertexShader);

        // Compile fragment shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Link and use shader program
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        // Set vertex attribute pointer for position
        this.positionAttribL = gl.getAttribLocation(shaderProgram, "position");
        this.transformUniformL = gl.getUniformLocation(shaderProgram, "transform");
        this.useColorUniformL = gl.getUniformLocation(shaderProgram, "useColor");
    }

    bufferGeometry(geometry) {

        var gl = this.gl;

        var vertexBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        var bufferedGeometry = new WebGLEngine.BufferedGeometry(geometry, vertexBuffer, indexBuffer);

        this.bindBufferedGeometry(bufferedGeometry);
        this.writeBufferedGeometryData(bufferedGeometry);

        this.bufferedGeometries.push(bufferedGeometry);
        return bufferedGeometry;
    }

    bindBufferedGeometry(bufferedGeometry) {

        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferedGeometry.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferedGeometry.indexBuffer);
        gl.vertexAttribPointer(this.positionAttribL, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionAttribL);
        this.lastBoundGeometry = bufferedGeometry;
    }

    writeBufferedGeometryData(bufferedGeometry) {

        var gl = this.gl;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferedGeometry.geometry.vertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(bufferedGeometry.geometry.indices), gl.STATIC_DRAW);
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

        var gl = this.gl;
        for (var geometryIndex in this.bufferedGeometries) {
            var bufferedGeometry = this.bufferedGeometries[geometryIndex];

            if (this.lastBoundGeometry !== bufferedGeometry)
                this.bindBufferedGeometry(bufferedGeometry);

            var indices = bufferedGeometry.geometry.indices.length;

            for (var objectIndex in bufferedGeometry.objects) {

                var object = bufferedGeometry.objects[objectIndex];

                gl.uniformMatrix4fv(this.transformUniformL, false, object.transform.getMatrix());

                gl.uniform1f(this.useColorUniformL, 1.0);
                gl.drawElements(gl.TRIANGLES, indices, gl.UNSIGNED_BYTE, 0);

                gl.uniform1f(this.useColorUniformL, 0.0);
                gl.drawElements(gl.LINE_STRIP, indices, gl.UNSIGNED_BYTE, 0);
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
