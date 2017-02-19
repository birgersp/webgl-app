include("util/FileLoader");
include("ShaderUniformManager");

class Renderer extends Initializable {

    constructor(gl) {

        super();
        this.gl = gl;
        this.shaderProgram = this.gl.createProgram();
        this.shadersInitialized = 0;
        this.shadersLinked = false;

        this.bufferedArrays = [];
        this.buffers = [];
        this.lastBoundArrayBuffer = null;
        this.lastBoundElementArrayBuffer = null;

        this.textureImages = [];
        this.textures = [];
        this.lastBoundTexture = null;
    }

    initializeShaders(vertexShaderSource, fragmentShaderSource) {

        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, vertexShaderSource);
        this.gl.compileShader(vertexShader);
        this.gl.attachShader(this.shaderProgram, vertexShader);

        var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, fragmentShaderSource);
        this.gl.compileShader(fragmentShader);
        this.gl.attachShader(this.shaderProgram, fragmentShader);

        this.gl.linkProgram(this.shaderProgram);
        this.useShaderProgram();
    }

    useShaderProgram() {

        this.gl.useProgram(this.shaderProgram);
        this.lastBoundArrayBuffer = null;
        this.lastBoundElementArrayBuffer = null;
    }

    getUniformManager() {

        return new ShaderUniformManager(this.gl, this.shaderProgram);
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

    hasArrayBuffered(array) {

        return this.bufferedArrays.indexOf(array) !== -1;
    }

    getGLBuffer(array) {

        let id = this.bufferedArrays.indexOf(array);
        if (id === -1) {
            id = this.buffers.length;
            this.buffers.push(this.gl.createBuffer());
            this.bufferedArrays.push(array);
        }
        return this.buffers[id];
    }

    bindArrayBuffer(array) {

        let buffer = this.getGLBuffer(array);
        if (this.lastBoundArrayBuffer === buffer)
            return false;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.lastBoundArrayBuffer = buffer;
        return true;
    }

    bindElementArrayBuffer(array) {

        let buffer = this.getGLBuffer(array);
        if (this.lastBoundElementArrayBuffer === buffer)
            return;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.lastBoundElementArrayBuffer = buffer;
    }

    bufferArrayF(array) {

        this.bindArrayBuffer(array);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);
    }

    bufferElementArrayI(array) {

        this.bindElementArrayBuffer(array);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(array), this.gl.STATIC_DRAW);
    }

    hasImageBuffered(image) {

        return this.textureImages.indexOf(image) !== -1;
    }

    getGLTexture(image) {

        let id = this.textureImages.indexOf(image);
        if (id === -1) {
            id = this.textures.length;
            this.textures.push(this.gl.createTexture());
            this.textureImages.push(image);
        }
        return this.textures[id];
    }

    bindTexture(image) {

        let texture = this.getGLTexture(image);
        if (texture === this.lastBoundTexture)
            return;
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }

    bufferTexture(image) {

        this.bindTexture(image);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
    }

    setActiveTexture(id) {

        this.gl.activeTexture(this.gl.TEXTURE0 + id);
    }
}
