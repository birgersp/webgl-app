const DEPENDENCIES = ["util", "Loader", "Matrix4", "Vector3"];

const SHADER_FILENAMES = {
    VSHADER: "shaders/vshader.webgl",
    FSHADER: "shaders/fshader.webgl"
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
    var onResize = function() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    onResize();



    // 
    var gl = canvas.getContext("webgl");
    gl.clearColor(1, 1, 1, 1);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    var shaderProgram = gl.createProgram();



    // Loader
    var loader = new Loader();


    // Load shaders
    var shaderFiles = {};
    for (var i in SHADER_FILENAMES) {
        shaderFiles[SHADER_FILENAMES[i]] = loader.addTextFile(SHADER_FILENAMES[i]);
    }


    // Load images
    var crateWallImage = loader.addImageFile("binaries/crate.jpg", 128, 128);


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

        // Add texture
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, crateWallImage.image);

        start();
    });



    // Start
    function start() {

        var vertices = new Float32Array([
            -0.5, 0.5, 0, 1, 0, 0,
            -0.5, -0.5, 0, 0, 1, 0,
            0.5, 0.5, 0, 0, 0, 1
        ]);

        var FSIZE = Float32Array.BYTES_PER_ELEMENT;

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);



        // Obtain vertex attribute location
        var position = gl.getAttribLocation(shaderProgram, "position");

        // Specify data format and location of position vertex attribute
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, FSIZE * 6, 0);

        // Enable positino vertex attribute array
        gl.enableVertexAttribArray(position);



        // Obtain color attribute location
        var color = gl.getAttribLocation(shaderProgram, "color");
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
        gl.enableVertexAttribArray(color);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);



        // 
        var useColor = gl.getUniformLocation(shaderProgram, "useColor");


        var z = 0;

        var mvMatrixL = gl.getUniformLocation(shaderProgram, "mvMatrix");

        function renderLoop() {
            z += 0.005;
            var mvMatrix = Matrix4.rotation([0, 0, z]);

            gl.uniformMatrix4fv(mvMatrixL, false, mvMatrix);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform1f(useColor, 1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
            gl.uniform1f(useColor, 0);
            gl.drawArrays(gl.LINE_LOOP, 0, 3);
            setTimeout(function() {
                window.requestAnimationFrame(renderLoop);
            }, 1000 / 60);
        }
        renderLoop();
    }
}

require(DEPENDENCIES, main);
