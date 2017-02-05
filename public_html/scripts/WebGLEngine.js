class WebGLEngine {

    constructor(gl) {

        this.gl = gl;
        this.positionAttribL = null;
        this.transformUniformL = null;
        this.useColorUniformL = null;
        this.lastBoundModel = null;
        this.objects = [];
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

    bufferModelData(vertices, indices) {

        var gl = this.gl;

        // Add buffers and index count
        var vertexBuffer = gl.createBuffer();
        var indexBuffer = gl.createBuffer();
        var model = new WebGLEngine.BufferedModel(vertexBuffer, indexBuffer, indices.length);

        // Bind buffers
        this.bindModel(model);

        // Write buffer data
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

        return model;
    }

    bindModel(model) {

        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
        gl.vertexAttribPointer(this.positionAttribL, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionAttribL);
        this.lastBoundModel = model;
    }

    addObject(object) {

        var i = 0;
        while (i < this.objects.length && this.objects[i].model !== object.model)
            i++;
        this.objects.splice(i, 0, object);
    }

    drawObjects() {

        for (var objectI in this.objects) {
            var object = this.objects[objectI];
            if (this.lastBoundModel !== object.model)
                this.bindModel(model);

            var gl = this.gl;
            gl.uniformMatrix4fv(this.transformUniformL, false, object.transform);
            
            gl.uniform1f(this.useColorUniformL, 1.0);
            gl.drawElements(gl.TRIANGLES, object.model.indexCount, gl.UNSIGNED_BYTE, 0);
            
            gl.uniform1f(this.useColorUniformL, 0.0);
            gl.drawElements(gl.LINE_STRIP, object.model.indexCount, gl.UNSIGNED_BYTE, 0);
        }
    }
}

WebGLEngine.BufferedModel = class {

    constructor(vertexBuffer, indexBuffer, indexCount) {

        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
        this.indexCount = indexCount;
    }
};

WebGLEngine.Object = class {

    constructor(model) {

        this.model = model;
        this.transform = Matrix4.identity();
    }
};
