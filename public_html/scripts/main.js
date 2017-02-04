const DEPENDENCIES = ["FileLoader", "WebGLEngine"];

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
    var onResize = function () {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    };
    onResize();

    // Create file loader
    var loader = new FileLoader();

    // Load shaders
    var shaderFiles = {};
    for (var i in SHADER_FILENAMES) {
        shaderFiles[SHADER_FILENAMES[i]] = loader.addTextFile(SHADER_FILENAMES[i]);
    }

    // Load texture
    var crateWallImage = loader.addImageFile("binaries/crate.jpg");


    // Load files, start app
    loader.load(function () {

        var gl = canvas.getContext("webgl");
        var engine = new WebGLEngine(gl);
        engine.initialize(
                shaderFiles[SHADER_FILENAMES.VSHADER].text,
                shaderFiles[SHADER_FILENAMES.FSHADER].text
                );

        var vertices1 = [
            0, -1, 0,
            1, -1, 0,
            1, 0, 0
        ];
        var indices1 = [0, 1, 2];

        var vertices2 = [
            -1, 1, 0,
            -1, 0, 0,
            0, 1, 0
        ];
        var indices2 = [0, 1, 2];

        gl.clear(gl.COLOR_BUFFER_BIT);
        
        var model1 = engine.addModel(vertices1, indices1);
        var model2 = engine.addModel(vertices2, indices2);

        engine.writeToBuffers();

        engine.renderModel(model1);
        engine.renderModel(model2);

    });
}

require(DEPENDENCIES, main);
