const DEPENDENCIES = ["util", "Loader", "Matrix4", "Camera"];

const SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};

const SHADER_VARIABLES = {
    POSITION: "position",
    TEXTURE_COORD: "textureCoord",
    USE_COLOR: "useColor",
    MV_MATRIX: "mvMatrix",
    SAMPLER: "sampler"
};

function main() {

    // Setup web page
    var style = document.createElement("style");
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(""));
    style.sheet.insertRule("body {padding:0px; margin:0px;}", 0);
    style.sheet.insertRule("canvas {"
            + "padding:0px; margin:0px;"
            + "width:100%; height:100%;"
            + "}", 0);



    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);
    var onResize = function () {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    onResize();



    // 
    var gl = canvas.getContext("webgl");
    var shaderProgram = gl.createProgram();



    // Loader
    var loader = new Loader();


    // Load shaders
    var shaderFiles = {};
    for (var i in SHADER_FILENAMES) {
        shaderFiles[SHADER_FILENAMES[i]] = loader.addTextFile(SHADER_FILENAMES[i]);
    }


    // Load texture
    var crateWallImage = loader.addImageFile("binaries/crate.jpg");


    // Compile shaders
    loader.load(function () {

        // Compile vertex shader
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, shaderFiles[SHADER_FILENAMES.VSHADER].text);
        gl.compileShader(vertexShader);
        gl.attachShader(shaderProgram, vertexShader);

        // Compile fragment shader
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, shaderFiles[SHADER_FILENAMES.FSHADER].text);
        gl.compileShader(fragmentShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Link and use shader program
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        start();
    });



    // Start
    function start() {

        gl.clearColor(1, 1, 1, 1);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        var FSIZE = Float32Array.BYTES_PER_ELEMENT;


        // Per scene object:

        var vertices = new Float32Array([
            0.5, 0.5, 0, 1, 1,
            -0.5, 0.5, 0, 0, 1,
            -0.5, -0.5, 0, 0, 0,
            0.5, -0.5, 0, 1, 0,
        ]);

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();

        // Obtain vertex attribute location
        var position = gl.getAttribLocation(shaderProgram, SHADER_VARIABLES.POSITION);

        // Obtain texture coordinate attribute location
        var textureCoor = gl.getAttribLocation(shaderProgram, SHADER_VARIABLES.TEXTURE_COORD);

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Specify data format and location of position vertex attribute
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, FSIZE * 5, 0);

        // Enable positino vertex attribute array
        gl.enableVertexAttribArray(position);

        gl.vertexAttribPointer(textureCoor, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
        gl.enableVertexAttribArray(textureCoor);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // Release buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        var indices = new Uint16Array([0, 1, 2, 2, 3, 0]);

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        // 
        var useColor = gl.getUniformLocation(shaderProgram, SHADER_VARIABLES.USE_COLOR);
        gl.uniform1f(useColor, 1);

        var mvMatrixL = gl.getUniformLocation(shaderProgram, SHADER_VARIABLES.MV_MATRIX);

        // Add texture
        var texture = gl.createTexture();
        var samplerL = gl.getUniformLocation(shaderProgram, SHADER_VARIABLES.SAMPLER);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, crateWallImage.image);
        gl.uniform1i(samplerL, 0);

        var mvMatrix = Matrix4.identity();
        gl.uniformMatrix4fv(mvMatrixL, false, mvMatrix);

        function renderLoop() {

            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            
            return;
            setTimeout(function () {
                window.requestAnimationFrame(renderLoop);
            }, 1000 / 60);
        }
        renderLoop();
    }


}

require(DEPENDENCIES, main);
