"use strict";

const DEPENDENCIES = ["util", "loader"];

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



    // 
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    var vertexPositionAttribute;



    // Load shaders
    var loader = new Loader();
    for (var i in SHADER_FILENAMES) {
        loader.add(SHADER_FILENAMES[i]);
    }



    // Compile shaders
    loader.load(function () {

        var shaderSources = {};
        for (var i in loader.files) {
            shaderSources[loader.files[i].name] = loader.files[i].text;
        }

        var shaderProgram = gl.createProgram();

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, shaderSources[SHADER_FILENAMES.VSHADER]);
        gl.compileShader(vertexShader);
        gl.attachShader(shaderProgram, vertexShader);

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, shaderSources[SHADER_FILENAMES.FSHADER]);
        gl.compileShader(fragmentShader);
        gl.attachShader(shaderProgram, fragmentShader);

        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        start();
    });



    // Start
    function start() {

        // Specify the color for clearing <canvas>
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);

    }
}

require(DEPENDENCIES, main);
