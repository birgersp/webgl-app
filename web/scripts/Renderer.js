include("util/FileLoader");

class Renderer extends Initializable {

    constructor(gl) {

        super();
        this.gl = gl;
        this.shaderProgram = this.gl.createProgram();
        this.shadersInitialized = 0;
        this.shadersLinked = false;

        this.bufferedObjects = [];

        this.buffers = [];
        this.lastBoundBuffer = null;
    }

    initializeVertexShader(shaderSource) {

        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, shaderSource);
        this.gl.compileShader(vertexShader);
        this.gl.attachShader(this.shaderProgram, vertexShader);
        this.shadersInitialized++;
        if (this.shadersInitialized === 2)
            this.linkShaderProgram();
    }

    initializeFragmentShader(shaderSource) {

        var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, shaderSource);
        this.gl.compileShader(fragmentShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);
        this.shadersInitialized++;
        if (this.shadersInitialized === 2)
            this.linkShaderProgram();
    }

    linkShaderProgram() {

        this.gl.linkProgram(this.shaderProgram);
    }

    useShaderProgram() {

        this.gl.useProgram(this.shaderProgram);
        this.lastBoundBuffer = null;
    }

    getUniformManager() {

        return new ShaderUniformManager(this.gl, this.shaderProgram);
    }

    bindArrayBuffer(array) {

        let buffer = this.getGLBuffer(array);
        if (this.lastBoundBuffer === buffer)
            return;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.lastBoundBuffer = buffer;
    }

    bufferArrayF(array) {

        this.bindArrayBuffer(array);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);
    }

    enableAttributeF(location, index, length, totalLength, normalize) {

        totalLength = totalLength !== undefined ? totalLength : 0;
        normalize = normalize !== undefined ? normalize : false;

        this.gl.vertexAttribPointer(location, length, this.gl.FLOAT, false, totalLength * Float32Array.BYTES_PER_ELEMENT, index * Float32Array.BYTES_PER_ELEMENT);
        this.gl.enableVertexAttribArray(location);
    }

    getAttributeLocation(name) {

        return this.gl.getAttribLocation(this.shaderProgram, name);
    }

    getGLBuffer(array) {

        let id = this.bufferedObjects.indexOf(array);
        if (id === -1) {
            id = this.buffers.length;
            this.buffers.push(this.gl.createBuffer());
            this.bufferedObjects.push(array);
        }
        return this.buffers[id];
    }
}
