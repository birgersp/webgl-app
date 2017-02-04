var WebGLEngine = class {

    constructor(gl) {

        this.gl = gl;
        this.vertices = [];
        this.indices = [];
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

        // Create and bind vertex buffer
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Set vertex attribute pointer for position
        var positionL = gl.getAttribLocation(shaderProgram, WebGLEngine.ShaderVariables.POSITION);
        gl.vertexAttribPointer(positionL, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 3, 0);
        gl.enableVertexAttribArray(positionL);

        // Create and bind index buffer
        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    }

    addModel(vertices, indices) {

        var bufferedModel = new WebGLEngine.BufferedModel(this.indices.length, indices.length);

        this.vertices = this.vertices.concat(vertices);
        this.indices = this.indices.concat(indices);

        return bufferedModel;
    }

    writeToBuffers() {

        var gl = this.gl;

        var verticesData = new Float32Array(this.vertices);
        gl.bufferData(gl.ARRAY_BUFFER, verticesData, gl.STATIC_DRAW);

        var indicesData = new Uint16Array(this.indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesData, gl.STATIC_DRAW);
    }

    renderModel(bufferedModel) {

        var gl = this.gl;
        var offset = bufferedModel.indexOffset;
        gl.drawElements(gl.TRIANGLES, bufferedModel.indexCount, gl.UNSIGNED_SHORT, offset);
    }
};

WebGLEngine.ShaderVariables = {
    POSITION: "position"
};

WebGLEngine.BufferedModel = class {

    constructor(indexOffset, indexCount) {

        this.indexOffset = indexOffset;
        this.indexCount = indexCount;
    }
};
