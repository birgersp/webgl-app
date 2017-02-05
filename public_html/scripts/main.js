const DEPENDENCIES = ["FileLoader", "WebGLEngine", "Matrix4", "Cube", "Vector3", "Transform", "Camera"];

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
        engine.camera.setAspectRatio(canvas.clientWidth / canvas.clientHeight);
        engine.initialize(
                shaderFiles[SHADER_FILENAMES.VSHADER].text,
                shaderFiles[SHADER_FILENAMES.FSHADER].text
                );

        var object1 = new WebGLEngine.Object(new Cube());
        engine.addObject(object1);

        var rot = 0.1;
        var pos = 0;
        function renderLoop() {
            rot += 0.01;
            pos += 0.02;
            object1.transform.setRotation(new Vector3(0, rot, 0));
            object1.transform.setTranslation(new Vector3(2*Math.sin(pos), 0, -5));
            engine.drawObjects();
            requestAnimationFrame(renderLoop);
        }
        renderLoop();
    });
}

require(DEPENDENCIES, main);
