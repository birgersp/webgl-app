const DEPENDENCIES = ["util", "FileLoader", "Matrix4", "Camera"];

const SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
};

const SHADER_VARIABLES = {
    POSITION: "position",
    TEXTURE_COORD: "textureCoord",
    USE_COLOR: "useColor",
    MV_MATRIX: "mvMatrix",
    SAMPLER: "sampler",
    COLOR: "color"
};

function main() {

    // Setup web page
    var style = document.createElement("style");
    document.head.appendChild(style);
    style.appendChild(document.createTextNode(""));
    style.sheet.insertRule("body {padding:0px; margin:0px;}", 0);
//    style.sheet.insertRule("canvas {"
//            + "padding:0px; margin:0px;"
//            + "width:100%; height:100%;"
//            + "}", 0);



    // Create canvas
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(canvas);
    var onResize = function() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    onResize();



    // 
    var gl = canvas.getContext("webgl");
    var shaderProgram = gl.createProgram();



    // FileLoader
    var loader = new FileLoader();


    // Load shaders
    var shaderFiles = {};
    for (var i in SHADER_FILENAMES) {
        shaderFiles[SHADER_FILENAMES[i]] = loader.addTextFile(SHADER_FILENAMES[i]);
    }


    // Load texture
    var crateWallImage = loader.addImageFile("binaries/crate.jpg");
    var grassImage = loader.addImageFile("binaries/grass.jpg");


    // Compile shaders
    loader.load(function() {

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

        var FSIZE = Float32Array.BYTES_PER_ELEMENT;
        gl.clearColor(1, 1, 1, 1);
        var mvMatrixL = gl.getUniformLocation(shaderProgram, "mvMatrix");
        var mvMatrix = Matrix4.rotation([0, 0, 0]);
        gl.uniformMatrix4fv(mvMatrixL, false, mvMatrix);
        
        var positionL = gl.getAttribLocation(shaderProgram, SHADER_VARIABLES.POSITION);
        gl.enableVertexAttribArray(positionL);
        
        var colorL = gl.getAttribLocation(shaderProgram, SHADER_VARIABLES.COLOR);
        gl.enableVertexAttribArray(colorL);


        var vertices1 = new Float32Array([
            0, -1, 0,
            1, -1, 0,
            1, 0, 0
        ]);
        var vertexBuffer1 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
        gl.bufferData(gl.ARRAY_BUFFER, vertices1, gl.STATIC_DRAW);

        var colors1 = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ]);
        var colorBuffer1 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
        gl.bufferData(gl.ARRAY_BUFFER, colors1, gl.STATIC_DRAW);

        var indices = new Uint16Array([0, 1, 2]);
        var indexBuffer1 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer1);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


        var vertices2 = new Float32Array([
            0, 1, 0,
            -1, 1, 0,
            -1, 0, 0
        ]);
        var vertexBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
        gl.bufferData(gl.ARRAY_BUFFER, vertices2, gl.STATIC_DRAW);

        var colors2 = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ]);
        var colorBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
        gl.bufferData(gl.ARRAY_BUFFER, colors2, gl.STATIC_DRAW);

        var indices2 = new Uint16Array([0, 1, 2]);
        var indexBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices2, gl.STATIC_DRAW);



        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
        gl.vertexAttribPointer(positionL, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
        gl.vertexAttribPointer(colorL, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
        gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
        
        

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
        gl.vertexAttribPointer(positionL, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
        gl.vertexAttribPointer(colorL, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
        gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    }


}

require(DEPENDENCIES, main);
