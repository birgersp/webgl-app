class WebGLEngine {

    constructor(gl) {

        this.gl = gl;
        this.positionAttribL = null;
        this.vertexBuffers = [];
        this.indexBuffers = [];
        this.modelIndices = [];
        this.lastBoundModel = -1;
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
    }

    bufferModelData(vertices, indices) {

        var gl = this.gl;
        var id = this.modelIndices.length;

        // Add buffers and index count
        this.vertexBuffers.push(gl.createBuffer());
        this.indexBuffers.push(gl.createBuffer());
        this.modelIndices.push(indices.length);

        // Bind buffers
        this.bindBuffer(id);

        // Write buffer data
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

        return id;
    }

    bindBuffer(id) {

        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[id]);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffers[id]);
        gl.vertexAttribPointer(this.positionAttribL, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.positionAttribL);
        this.lastBoundModel = id;
    }

    draw(modelID) {

        if (this.lastBoundModel !== modelID)
            this.bindBuffer(modelID);

        var gl = this.gl;
        gl.drawElements(gl.LINE_STRIP, this.modelIndices[modelID], gl.UNSIGNED_BYTE, 0);
    }
}
