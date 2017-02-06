include("util/FileLoader");
include("WebGLEngine");
include("Cube");

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
    style.sheet.insertRule("body {padding:0px; margin:0px; overflow:hidden;}", 0);
    style.sheet.insertRule("canvas {"
            + "padding:0px; margin:0px;"
            + "}", 0);

    window.addEventListener("resize", function () {
    });

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

        // Create canvas
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        document.body.appendChild(canvas);

        var gl = canvas.getContext("webgl");
        var engine = new WebGLEngine(gl);
        engine.initialize(
                shaderFiles[SHADER_FILENAMES.VSHADER].text,
                shaderFiles[SHADER_FILENAMES.FSHADER].text
                );

        var object1 = new WebGLEngine.Object(new Cube());
        object1.transform.setTranslation(new Vector3(0, 0, 0));
        engine.addObject(object1);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            engine.camera.setAspectRatio(canvas.clientWidth / canvas.clientHeight);
            engine.camera.updateMatrix();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
        resizeCanvas();

        var resizingTimeout;
        window.addEventListener("resize", function () {
            clearTimeout(resizingTimeout);
            resizingTimeout = setTimeout(resizeCanvas, 250);
        });

        engine.camera.setTranslation(new Vector3(0, 2, 6));
        engine.camera.setRotation(new Vector3(0, 0.4, 0));

        function renderLoop() {
            engine.drawObjects();
            setTimeout(function () {
                requestAnimationFrame(renderLoop);
            }, 1000 / 60);
        }
        renderLoop();
    });
}
