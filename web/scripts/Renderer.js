include("lib/utiljs/FileLoader.js");
include("util/Map.js");

include("ShaderUniformManager.js");

class Renderer extends Initializable {

    constructor(gl) {

        super();
        this.gl = gl;
        this.shaderProgram = this.gl.createProgram();
        this.shadersInitialized = 0;
        this.shadersLinked = false;

        this.arrayBuffers = new Map();

//        this.bufferedArrays = [];
//        this.buffers = [];
        this.lastBoundArrayBuffer = null;
        this.lastBoundElementArrayBuffer = null;

        this.imageTextures = new Map();

//        this.textureImages = [];
//        this.textures = [];
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

    getGLBuffer(array) {

        let buffer = this.arrayBuffers.get(array);
        if (buffer === null) {
            buffer = this.gl.createBuffer();
            this.arrayBuffers.put(array, buffer);
        }
        return buffer;
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

    getGLTexture(image) {

        let texture = this.imageTextures.get(image);
        if (texture === null) {
            texture = this.gl.createTexture();
            this.imageTextures.put(image, texture);
        }
        return texture;
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
